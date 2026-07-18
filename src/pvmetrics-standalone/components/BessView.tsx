import React, { useState, useEffect } from 'react';
import { useAppState } from '../app/StateContext';
import { generateDailyForecast } from '../utils/simulator';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Battery, Zap, Clock, ShieldCheck, AlertTriangle, HelpCircle, Thermometer, Info } from 'lucide-react';

export const BessView: React.FC = () => {
  const { activePlant, noiseLevel } = useAppState();
  const [dailyData, setDailyData] = useState(() => generateDailyForecast(activePlant, noiseLevel));
  const [selectedHour, setSelectedHour] = useState<number>(new Date().getHours());

  useEffect(() => {
    setDailyData(generateDailyForecast(activePlant, noiseLevel));
  }, [activePlant, noiseLevel]);

  if (activePlant.bess.capacityMW === 0) {
    return (
      <div className="p-12 text-center bg-gray-900 border border-gray-800 rounded-xl space-y-4" id="bess-view">
        <Battery className="w-16 h-16 text-gray-600 mx-auto animate-pulse" />
        <h3 className="text-lg font-semibold text-white">No hay BESS configurado</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          La planta activa actual ({activePlant.name}) está registrada como planta solar simple sin sistema de almacenamiento. 
          Cambie de planta en el menú superior o modifique la configuración para agregar almacenamiento BESS.
        </p>
      </div>
    );
  }

  const currentHourData = dailyData[selectedHour] || dailyData[0];

  // Calculate customized battery metrics
  const degradationYrs = 5; // Simulating 5 years degradation
  const remainingCapacityMWh = activePlant.bess.capacityMWh * (1 - (activePlant.bess.degradationRatePercentPerYear * degradationYrs / 100));

  // 1. Data Quality Scorer (for this BESS)
  const dataQualityScorer = noiseLevel === 'low' ? 98 : noiseLevel === 'medium' ? 94 : 78;

  // 2. BESS Confidence
  const bessConfidence = Math.round(98 - (activePlant.bess.degradationRatePercentPerYear * 4));

  // 3. Commercial Confidence (How well we match charging during low price and discharging during high price)
  const commercialConfidence = Math.round(activePlant.bess.roundTripEfficiency * 0.95);

  return (
    <div className="space-y-6" id="bess-view">
      {/* Disclaimer Row */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex gap-3 text-xs text-blue-300">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p><strong>Aviso de seguridad operativa:</strong> ORBI PVMetrics IA opera de manera <strong>READ-ONLY</strong> en modo demostrativo para evaluar despacho y ventanas comerciales.</p>
          <p className="mt-1 text-[10px] text-blue-400">“ORBI PVMetrics IA no opera BESS, no envía comandos al EMS/BMS y no ejecuta ventas de energía.”</p>
        </div>
      </div>

      {/* Grid of Confidence Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Data Quality Score Card */}
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Data Quality Scorer</p>
            <h4 className="text-xl font-bold text-white mt-0.5 font-mono">{dataQualityScorer}%</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Integridad de señales de telemetría BESS</p>
          </div>
        </div>

        {/* BESS Confidence Score Card */}
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">BESS Confidence Score</p>
            <h4 className="text-xl font-bold text-white mt-0.5 font-mono">{bessConfidence}%</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Estado térmico, degradación y salud LFP</p>
          </div>
        </div>

        {/* Commercial Confidence Score Card */}
        <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Commercial Confidence</p>
            <h4 className="text-xl font-bold text-white mt-0.5 font-mono">{commercialConfidence}%</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Aprovechamiento teórico de arbitraje</p>
          </div>
        </div>
      </div>

      {/* Chart: SOC and Charge Advice Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Comportamiento Proyectado BESS (24 horas)</h3>
              <p className="text-xs text-gray-400">Proyección horaria de carga de excedente solar y descarga en hora punta</p>
            </div>
            <div className="text-[10px] flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded bg-emerald-400"></span> Charge MW
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded bg-rose-400"></span> Discharge MW
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.4} />
                <XAxis dataKey="timeLabel" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Area type="monotone" name="SOC de Bateria (%)" dataKey="socForecastPercent" stroke="#10b981" strokeWidth={1.5} fill="#10b981" fillOpacity={0.05} />
                <Area type="monotone" name="Propuesta Carga (MW)" dataKey="bessChargeAdviceMW" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Area type="monotone" name="Propuesta Despacho (MW)" dataKey="bessDischargeAdviceMW" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hour-by-Hour interactive advisor */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Simulador de Despacho Horario</h3>
            
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5">Seleccionar Hora de Evaluación</label>
              <select 
                value={selectedHour}
                onChange={(e) => setSelectedHour(Number(e.target.value))}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              >
                {dailyData.map((d) => (
                  <option key={d.hour} value={d.hour}>
                    {d.timeLabel} - {d.advisoryType === 'CHARGE' ? 'Cargando baterias' : d.advisoryType === 'DISCHARGE' ? 'Inyectando energía' : 'Espera de red (HOLD)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-xs text-gray-400">Recomendación EMS:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentHourData.advisoryType === 'CHARGE' ? 'text-emerald-400 bg-emerald-500/10' :
                  currentHourData.advisoryType === 'DISCHARGE' ? 'text-rose-400 bg-rose-500/10' :
                  'text-gray-400 bg-gray-800'
                }`}>
                  {currentHourData.advisoryType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 block">Flujo Recomendado:</span>
                  <span className="text-white font-mono font-bold">
                    {currentHourData.bessChargeAdviceMW > 0 ? `+${currentHourData.bessChargeAdviceMW} MW` :
                     currentHourData.bessDischargeAdviceMW > 0 ? `-${currentHourData.bessDischargeAdviceMW} MW` :
                     '0.00 MW'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Marginal Cost:</span>
                  <span className="text-blue-400 font-mono font-bold">${currentHourData.marginalCostUSD}/MWh</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span>Temp. Estimada Celda: <strong className="text-white">25.4°C (Normal)</strong></span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 mt-4 space-y-2.5">
            <h4 className="text-xs font-semibold text-gray-200">Especificaciones Técnicas BESS</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-mono">
              <div className="bg-gray-950 p-2 rounded border border-gray-800/60">
                <span>RTE nominal:</span>
                <p className="text-xs font-bold text-gray-200 mt-0.5">{activePlant.bess.roundTripEfficiency}%</p>
              </div>
              <div className="bg-gray-950 p-2 rounded border border-gray-800/60">
                <span>Degradación Anual:</span>
                <p className="text-xs font-bold text-gray-200 mt-0.5">{activePlant.bess.degradationRatePercentPerYear}%/año</p>
              </div>
              <div className="bg-gray-950 p-2 rounded border border-gray-800/60 col-span-2">
                <span>Capacidad Remanente (SOH):</span>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">
                  {remainingCapacityMWh.toFixed(1)} MWh ({Math.round((remainingCapacityMWh / activePlant.bess.capacityMWh) * 100)}% SOH)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Timeline Logs */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Registro Operativo de Sugerencias de Ventanas</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {dailyData.filter(d => d.advisoryType !== 'HOLD').map((d) => (
            <div key={d.hour} className="p-3 bg-gray-950 border border-gray-800 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-400 font-mono">{d.timeLabel}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  d.advisoryType === 'CHARGE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}>
                  {d.advisoryType === 'CHARGE' ? 'CARGA' : 'DESPACHO'}
                </span>
                <span className="text-gray-300">
                  {d.advisoryType === 'CHARGE' 
                    ? `Carga de batería sugerida a ${d.bessChargeAdviceMW} MW usando excedentes solares.` 
                    : `Despacho comercial sugerido a ${d.bessDischargeAdviceMW} MW debido a costo marginal elevado.`}
                </span>
              </div>
              <span className="text-blue-400 font-mono font-medium">${d.marginalCostUSD} / MWh</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
