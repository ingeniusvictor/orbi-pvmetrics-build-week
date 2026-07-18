import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { PVMetricsTimePoint } from '../../types/pvmetrics-live-monitoring.types';
import { Info, Thermometer, AlertTriangle } from 'lucide-react';

interface PVMetricsTemperatureChartProps {
  data: PVMetricsTimePoint[];
  moduleTempThresholdC?: number;
}

export const PVMetricsTemperatureChart: React.FC<PVMetricsTemperatureChartProps> = ({ 
  data, 
  moduleTempThresholdC = 65 
}) => {
  // Check if any module temperature exceeds threshold
  const highTempPoints = data.filter((pt) => pt.moduleTempC > moduleTempThresholdC);
  const hasHighTemperature = highTempPoints.length > 0;

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between" id="chart-temperature">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-1.5">
            6. TEMPERATURA AMBIENTE Y TEMPERATURA DE MÓDULO
            <span className="group relative">
              <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-60 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Monitorea el calentamiento térmico de las celdas FV. Temperaturas elevadas en el módulo disminuyen la eficiencia de conversión fotoeléctrica.
              </span>
            </span>
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-cyan-400" />
            Límite óptimo de celda: &lt;{moduleTempThresholdC}°C
          </p>
        </div>

        {hasHighTemperature ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>Pérdidas Térmicas</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span>Rango Térmico Nominal</span>
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
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
              domain={[0, 80]}
              tickFormatter={(v) => `${v}°C`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.375rem' }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ fontSize: '11px' }}
              formatter={(value: any, name: any, props: any) => {
                const pt = props.payload as PVMetricsTimePoint;
                const diff = Math.round((pt.moduleTempC - pt.ambientTempC) * 10) / 10;
                
                if (name === 'Temp. módulo (°C)') {
                  return [
                    <div key="temp-details" className="space-y-0.5">
                      <span className="font-semibold text-amber-500">{value}°C</span>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Diferencial térmico: <strong className="text-white">+{diff}°C</strong>
                      </div>
                    </div>,
                    'Temperatura de Celda'
                  ];
                }
                return [`${value}°C`, name];
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            
            {/* Ambient temperature line in cyan */}
            <Line 
              name="Temp. ambiente (°C)" 
              type="monotone" 
              dataKey="ambientTempC" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

            {/* Module temperature line in amber */}
            <Line 
              name="Temp. módulo (°C)" 
              type="monotone" 
              dataKey="moduleTempC" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />

            {/* ReferenceLine for the moduleTempThresholdC threshold */}
            <ReferenceLine 
              y={moduleTempThresholdC} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              label={{ 
                value: `Pérdida Crítica (${moduleTempThresholdC}°C)`, 
                fill: '#ef4444', 
                fontSize: 9, 
                position: 'top',
                offset: 5
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
