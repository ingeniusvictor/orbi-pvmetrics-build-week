import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PVMetricsTrendPoint, PVMetricsTrendRange } from '../../types/pvmetrics-live-monitoring.types';
import { Info } from 'lucide-react';

interface PVMetricsProductionExpectedChartProps {
  data: PVMetricsTrendPoint[];
  range: PVMetricsTrendRange;
  operationalDataMode?: 'demo' | 'scada-readonly' | 'not-available';
}

export const PVMetricsProductionExpectedChart: React.FC<PVMetricsProductionExpectedChartProps> = ({
  data,
  range,
  operationalDataMode = 'demo',
}) => {
  const isDaily = range === 'daily';
  
  // Dynamic Title & Subtitle based on range
  const title = isDaily ? '1. PRODUCCIÓN REAL VS ESPERADA' : '1. ENERGÍA REAL VS ESPERADA';
  
  let subtitle = range === 'daily'
    ? 'Producción horaria — Día actual'
    : range === 'weekly'
    ? 'Producción acumulada diaria — Semana actual'
    : 'Producción acumulada diaria — Mes actual';

  if (operationalDataMode === 'scada-readonly') {
    subtitle += ' (Datos SCADA read-only autorizados)';
  } else {
    subtitle += ' (Simulación demo/local basada en perfil)';
  }

  const unit = isDaily ? 'MW' : 'MWh';

  let actualLabel = isDaily ? `Producción real (${unit})` : `Energía real (${unit})`;
  if (operationalDataMode === 'scada-readonly') {
    actualLabel = isDaily ? `Producción SCADA Read-Only (${unit})` : `Energía SCADA Read-Only (${unit})`;
  } else {
    actualLabel = isDaily ? `Producción demo/local (${unit})` : `Energía demo/local (${unit})`;
  }

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between animate-fadeIn" id="chart-production-expected">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-205 tracking-wider uppercase flex items-center gap-1.5">
            {title}
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-60 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {isDaily 
                  ? "Muestra la comparación directa entre la generación real inyectada y el rendimiento esperado según el modelo matemático de irradiancia."
                  : "Muestra la energía diaria acumulada real comparada con la energía esperada programada para el período."}
              </span>
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Unidad: {unit}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.05}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={isDaily ? [0, 6.5] : [0, 'auto']}
              tickFormatter={(v) => `${v} ${unit}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ fontSize: '11px' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Area 
              name={actualLabel}
              type="monotone" 
              dataKey={isDaily ? "actualPowerMw" : "actualEnergyMWh"} 
              stroke="#06b6d4" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorActual)" 
            />
            <Area 
              name={isDaily ? `Producción esperada (${unit})` : `Energía esperada (${unit})`}
              type="monotone" 
              dataKey={isDaily ? "expectedPowerMw" : "expectedEnergyMWh"} 
              stroke="#f59e0b" 
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorExpected)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
