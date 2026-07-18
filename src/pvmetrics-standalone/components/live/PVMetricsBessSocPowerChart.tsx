import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { PVMetricsTimePoint } from '../../types/pvmetrics-live-monitoring.types';
import { Info, BatteryCharging } from 'lucide-react';

interface PVMetricsBessSocPowerChartProps {
  data: PVMetricsTimePoint[];
}

export const PVMetricsBessSocPowerChart: React.FC<PVMetricsBessSocPowerChartProps> = ({ data }) => {
  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between" id="chart-bess-soc-power">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-1.5">
            5. ESTADO DE CARGA BESS / CARGA-DESCARGA
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-60 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Visualiza el estado de carga (SOC %) de las baterías junto con la potencia activa de carga (positiva) y descarga (negativa) del BESS.
              </span>
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
            Control Automático de Inyección Arbitraria Activo
          </p>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">SOC (%) | Potencia (MW)</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            {/* Left Y Axis for SOC (%) */}
            <YAxis 
              yAxisId="left"
              stroke="#06b6d4" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            {/* Right Y Axis for BESS Power (MW) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[-2.5, 2.5]}
              tickFormatter={(v) => `${v} MW`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ fontSize: '11px' }}
              formatter={(value: any, name: any, props: any) => {
                const pt = props.payload as PVMetricsTimePoint;
                if (name === 'SOC (%)') {
                  return [`${value}%`, 'Estado de Carga (SOC)'];
                }
                if (name === 'Potencia BESS (MW)') {
                  const modeStr = pt.bessPowerMw > 0.1 
                    ? '⚡ Cargando' 
                    : pt.bessPowerMw < -0.1 
                      ? '🔋 Descargando' 
                      : '⏹️ Standby';
                  return [
                    <div key="bess-power-details" className="space-y-1">
                      <span className={pt.bessPowerMw > 0.1 ? 'text-emerald-400' : pt.bessPowerMw < -0.1 ? 'text-amber-400' : 'text-gray-400'}>
                        {pt.bessPowerMw > 0 ? `+${value} MW` : `${value} MW`}
                      </span>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Estado: <strong className="text-white">{modeStr}</strong>
                      </div>
                    </div>,
                    'Operación BESS'
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
            
            {/* Bess Power (MW) styled with different colors for charge/discharge */}
            <Bar 
              yAxisId="right" 
              name="Potencia BESS (MW)" 
              dataKey="bessPowerMw" 
              barSize={12}
            >
              {data.map((entry, index) => {
                const isCharging = entry.bessPowerMw > 0.1;
                const isDischarging = entry.bessPowerMw < -0.1;
                // Elegant amber gradient/shades for power bars
                const fillColor = isCharging 
                  ? 'rgba(16, 185, 129, 0.65)' // Green-amber for charge
                  : isDischarging 
                    ? 'rgba(245, 158, 11, 0.65)' // Bright amber for discharge
                    : 'rgba(100, 116, 139, 0.2)'; // Slate gray for standby
                return <Cell key={`cell-${index}`} fill={fillColor} />;
              })}
            </Bar>

            {/* SOC Line in cyan */}
            <Line 
              yAxisId="left"
              name="SOC (%)" 
              type="monotone" 
              dataKey="bessSocPct" 
              stroke="#06b6d4" 
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#06b6d4', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
