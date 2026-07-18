import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PVMetricsTrendPoint, PVMetricsTrendRange } from '../../types/pvmetrics-live-monitoring.types';
import { Info } from 'lucide-react';

interface PVMetricsIrradianceLiveChartProps {
  data: PVMetricsTrendPoint[];
  range: PVMetricsTrendRange;
  environmentDataMode?: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available';
}

export const PVMetricsIrradianceLiveChart: React.FC<PVMetricsIrradianceLiveChartProps> = ({
  data,
  range,
  environmentDataMode = 'external-telemetry',
}) => {
  const isDaily = range === 'daily';
  
  const title = isDaily ? '2. IRRADIANCIA EN TIEMPO REAL' : '2. IRRADIANCIA PROMEDIO';
  
  let subtitle = range === 'daily'
    ? 'Irradiancia horaria — Día actual'
    : range === 'weekly'
    ? 'Irradiancia promedio diaria — Semana actual'
    : 'Irradiancia promedio diaria — Mes actual';

  if (environmentDataMode === 'external-telemetry') {
    subtitle += ' (Estimada por ubicación de planta)';
  } else if (environmentDataMode === 'onsite-weather') {
    subtitle += ' (Medición real on-site read-only)';
  } else {
    subtitle += ' (Simulación demo local)';
  }

  let irradianceLabel = "Irradiancia demo local (W/m²)";
  if (environmentDataMode === 'external-telemetry') {
    irradianceLabel = "Irradiancia estimada por ubicación (W/m²)";
  } else if (environmentDataMode === 'onsite-weather') {
    irradianceLabel = "Irradiancia on-site (W/m²)";
  }

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between animate-fadeIn" id="chart-irradiance-live">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-205 tracking-wider uppercase flex items-center gap-1.5">
            {title}
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-60 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Visualización de la radiación solar global horizontal (GHI) promedio o instantánea en vatios por metro cuadrado, fundamental para calcular la eficiencia de los paneles.
              </span>
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">Unidad: W/m²</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIrradiance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
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
              domain={[0, 1100]}
              tickFormatter={(v) => `${v} W`}
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
              name={irradianceLabel} 
              type="monotone" 
              dataKey="irradianceAvgWm2" 
              stroke="#f59e0b" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorIrradiance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
