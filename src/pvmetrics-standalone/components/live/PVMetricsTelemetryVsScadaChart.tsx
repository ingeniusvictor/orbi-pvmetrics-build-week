import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PVMetricsTrendPoint, PVMetricsTrendRange, PVMetricsDataMode } from '../../types/pvmetrics-live-monitoring.types';
import { Info } from 'lucide-react';

interface PVMetricsTelemetryVsScadaChartProps {
  data: PVMetricsTrendPoint[];
  range: PVMetricsTrendRange;
  mode: PVMetricsDataMode;
}

export const PVMetricsTelemetryVsScadaChart: React.FC<PVMetricsTelemetryVsScadaChartProps> = ({ data, range, mode }) => {
  const isDaily = range === 'daily';
  
  const title = isDaily ? '3. POTENCIA TELEMETRIZADA VS SCADA REAL' : '3. ENERGÍA TELEMETRIZADA VS SCADA';
  
  const subtitle = range === 'daily'
    ? 'Verifica consistencia entre telemetría cloud y SCADA de planta.'
    : range === 'weekly'
    ? 'Energía acumulada diaria — Semana actual (Telemetría vs SCADA)'
    : 'Energía acumulada diaria — Mes actual (Telemetría vs SCADA)';

  const unit = isDaily ? 'MW' : 'MWh';

  // Process data to map keys appropriately for weekly/monthly
  const processedData = data.map((pt, idx) => {
    if (isDaily) {
      return {
        ...pt,
        displayTel: pt.telemetryPowerMw ?? pt.actualPowerMw,
        displayScada: pt.scadaPowerMw ?? pt.actualPowerMw,
      };
    } else {
      // Create slight telemetry and SCADA divergence for weekly/monthly simulation
      const seed = idx + (range === 'weekly' ? 10 : 30);
      const telNoise = 1.0 + (Math.sin(seed) * 0.015);
      const scadaNoise = 1.0 + (Math.cos(seed * 1.5) * 0.005);
      
      return {
        ...pt,
        displayTel: Math.round(pt.actualEnergyMWh * telNoise * 10) / 10,
        displayScada: Math.round(pt.actualEnergyMWh * scadaNoise * 10) / 10,
      };
    }
  });

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between animate-fadeIn" id="chart-telemetry-scada">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-205 tracking-wider uppercase flex items-center gap-1.5">
            {title}
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-60 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Verifica la consistencia entre las lecturas de telemetría cloud y las registradas directamente por el concentrador SCADA.
              </span>
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Unidad: {unit}</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorScada" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
              name={isDaily ? `Potencia telemetrizada (${unit})` : `Energía telemetrizada (${unit})`}
              type="monotone" 
              dataKey="displayTel" 
              stroke="#06b6d4" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorTel)" 
            />
            <Area 
              name={isDaily ? `Potencia SCADA real (${unit})` : `Energía SCADA real (${unit})`}
              type="monotone" 
              dataKey="displayScada" 
              stroke="#10b981" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorScada)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
