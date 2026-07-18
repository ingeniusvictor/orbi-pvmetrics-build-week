import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { PVMetricsTrendPoint, PVMetricsTrendRange } from '../../types/pvmetrics-live-monitoring.types';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface PVMetricsPrHourlyChartProps {
  data: PVMetricsTrendPoint[];
  range: PVMetricsTrendRange;
  thresholdPct?: number;
}

export const PVMetricsPrHourlyChart: React.FC<PVMetricsPrHourlyChartProps> = ({ 
  data, 
  range,
  thresholdPct = 80 
}) => {
  const isDaily = range === 'daily';

  // Check if any active period drops below the threshold
  const lowPerformancePeriods = data.filter(
    (pt) => (isDaily ? (pt.expectedPowerMw ?? 0) > 0.2 : pt.expectedEnergyMWh > 5) && pt.prAvgPct !== null && pt.prAvgPct < thresholdPct
  );
  
  const hasLowPerformance = lowPerformancePeriods.length > 0;

  const title = isDaily ? '4. PERFORMANCE RATIO (PR) HORARIO' : '4. PERFORMANCE RATIO (PR) PROMEDIO';
  const subtitle = range === 'daily'
    ? 'PR horario'
    : range === 'weekly'
    ? 'PR promedio diario — Semana actual'
    : 'PR promedio diario — Mes actual';

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between animate-fadeIn" id="chart-pr-hourly">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-205 tracking-wider uppercase flex items-center gap-1.5">
            {title}
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-60 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Relación entre la energía real producida y la teóricamente esperada de acuerdo a las condiciones de radiación y temperatura.
              </span>
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {subtitle} (Garantía: {thresholdPct}%)
          </p>
        </div>
        
        {hasLowPerformance ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>PR Bajo Detectado</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>PR Estable</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
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
              domain={[0, 120]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ fontSize: '11px' }}
              formatter={(value: any, name: any, props: any) => {
                const pt = props.payload as PVMetricsTrendPoint;
                if (name === 'PR (%)') {
                  const hasValues = isDaily ? (pt.expectedPowerMw ?? 0) > 0.2 : pt.expectedEnergyMWh > 0.5;
                  const prStr = hasValues ? `${value}%` : 'N/A';
                  return [
                    <div key="pr-details" className="space-y-1">
                      <span className="font-semibold text-cyan-400">{prStr}</span>
                      <div className="text-[10px] text-gray-400 mt-1">
                        <div>Real: {isDaily ? `${pt.actualPowerMw?.toFixed(2)} MW` : `${pt.actualEnergyMWh.toFixed(1)} MWh`}</div>
                        <div>Esperado: {isDaily ? `${pt.expectedPowerMw?.toFixed(2)} MW` : `${pt.expectedEnergyMWh.toFixed(1)} MWh`}</div>
                      </div>
                    </div>,
                    'Métrica'
                  ];
                }
                return [value, name];
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Area 
              name="PR (%)" 
              type="monotone" 
              dataKey="prAvgPct" 
              stroke="#06b6d4" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPr)" 
            />
            <ReferenceLine 
              y={thresholdPct} 
              stroke="#f59e0b" 
              strokeDasharray="3 3" 
              label={{ 
                value: `Garantía (${thresholdPct}%)`, 
                fill: '#f59e0b', 
                fontSize: 9, 
                position: 'top',
                offset: 5
              }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
