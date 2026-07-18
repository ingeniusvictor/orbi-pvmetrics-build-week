import React, { useState, useEffect } from 'react';
import { useAppState } from '../app/StateContext';
import { generateDailyForecast, generateWeeklyForecast, generateMonthlyForecast } from '../utils/simulator';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Sun, Calendar, Clock, BarChart3, Settings, HelpCircle, Activity, ChevronRight, Zap } from 'lucide-react';

interface ForecastViewsProps {
  initialTab?: 'daily' | 'weekly' | 'monthly' | 'performance';
}

export const ForecastViews: React.FC<ForecastViewsProps> = ({ initialTab }) => {
  const { activePlant, noiseLevel } = useAppState();
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'weekly' | 'monthly' | 'performance'>(() => {
    return initialTab || 'daily';
  });

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Load generated simulations
  const [dailyData, setDailyData] = useState(() => generateDailyForecast(activePlant, noiseLevel));
  const [weeklyData, setWeeklyData] = useState(() => generateWeeklyForecast(activePlant, noiseLevel));
  const [monthlyData, setMonthlyData] = useState(() => generateMonthlyForecast(activePlant));

  useEffect(() => {
    setDailyData(generateDailyForecast(activePlant, noiseLevel));
    setWeeklyData(generateWeeklyForecast(activePlant, noiseLevel));
    setMonthlyData(generateMonthlyForecast(activePlant));
  }, [activePlant, noiseLevel]);

  return (
    <div className="space-y-6" id="forecast-views">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'daily' 
              ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pronóstico Diario (24h)
        </button>
        <button
          onClick={() => setActiveSubTab('weekly')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'weekly' 
              ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Pronóstico Semanal
        </button>
        <button
          onClick={() => setActiveSubTab('monthly')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'monthly' 
              ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Mensual & Estacional
        </button>
        <button
          onClick={() => setActiveSubTab('performance')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'performance' 
              ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          PV Performance & Trackers
        </button>
      </div>

      {/* View Rendering */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6">
          {/* Daily Summary */}
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-[10px] text-gray-500 uppercase font-medium">Irradiación Acumulada</span>
              <p className="text-lg font-bold text-white mt-1">
                {(dailyData.reduce((acc, curr) => acc + curr.radiationForecast, 0) / 1000).toFixed(2)} kWh/m²
              </p>
            </div>
            <div className="p-3.5 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-[10px] text-gray-500 uppercase font-medium">Generación Estimada PV</span>
              <p className="text-lg font-bold text-white mt-1">
                {dailyData.reduce((acc, curr) => acc + curr.pvGenerationForecastMW, 0).toFixed(1)} MWh
              </p>
            </div>
            <div className="p-3.5 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-[10px] text-gray-500 uppercase font-medium">Factor de Confianza de Pronóstico</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">
                {(dailyData.reduce((acc, curr) => acc + curr.confidenceScore, 0) / 24).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Daily Curve Chart */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Curva Horaria Proyectada</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.4} />
                  <XAxis dataKey="timeLabel" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar name="Generación Solar (MW)" dataKey="pvGenerationForecastMW" fill="#f59e0b" opacity={0.8} />
                  <Bar name="Carga BESS (MW)" dataKey="bessChargeAdviceMW" fill="#10b981" />
                  <Bar name="Despacho BESS (MW)" dataKey="bessDischargeAdviceMW" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white">Detalle Horario de Generación</h3>
              <span className="text-[10px] px-2 py-0.5 bg-gray-950 border border-gray-800 rounded text-gray-400 font-mono">24 Horas</span>
            </div>
            <div className="overflow-x-auto max-h-96 custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-950 text-gray-400 border-b border-gray-800">
                    <th className="p-3 font-medium">Hora</th>
                    <th className="p-3 font-medium text-right">Radiación (W/m²)</th>
                    <th className="p-3 font-medium text-right">Gen PV (MW)</th>
                    <th className="p-3 font-medium text-right">BESS Charge (MW)</th>
                    <th className="p-3 font-medium text-right">BESS Discharge (MW)</th>
                    <th className="p-3 font-medium text-right">Proyección SOC</th>
                    <th className="p-3 font-medium text-right">Marginal Cost ($/MWh)</th>
                    <th className="p-3 font-medium text-center">Advisory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {dailyData.map((row) => (
                    <tr key={row.hour} className="hover:bg-gray-800/20">
                      <td className="p-3 font-semibold text-gray-300 font-mono">{row.timeLabel}</td>
                      <td className="p-3 text-right text-gray-400 font-mono">{row.radiationForecast}</td>
                      <td className="p-3 text-right text-amber-400 font-bold font-mono">
                        {row.pvGenerationForecastMW > 0 ? `${row.pvGenerationForecastMW} MW` : '-'}
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-mono">
                        {row.bessChargeAdviceMW > 0 ? `${row.bessChargeAdviceMW} MW` : '-'}
                      </td>
                      <td className="p-3 text-right text-rose-400 font-mono">
                        {row.bessDischargeAdviceMW > 0 ? `${row.bessDischargeAdviceMW} MW` : '-'}
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-mono">{row.socForecastPercent}%</td>
                      <td className="p-3 text-right text-blue-400 font-mono">${row.marginalCostUSD}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          row.advisoryType === 'CHARGE' ? 'text-emerald-400 bg-emerald-500/10' :
                          row.advisoryType === 'DISCHARGE' ? 'text-rose-400 bg-rose-500/10' :
                          'text-gray-400 bg-gray-800'
                        }`}>
                          {row.advisoryType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Forecast Tab */}
      {activeSubTab === 'weekly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
              <p className="text-[10px] text-gray-500 uppercase">PV Yield Semanal</p>
              <p className="text-xl font-bold text-white mt-1">
                {weeklyData.reduce((acc, curr) => acc + curr.pvYieldMWh, 0).toFixed(1)} MWh
              </p>
            </div>
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
              <p className="text-[10px] text-gray-500 uppercase">Ciclos BESS Semanales</p>
              <p className="text-xl font-bold text-white mt-1">
                {weeklyData.reduce((acc, curr) => acc + curr.bessCycles, 0).toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
              <p className="text-[10px] text-gray-500 uppercase">Ganancia Arbitraje Proyectada</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                ${weeklyData.reduce((acc, curr) => acc + curr.commercialOptimizationUSD, 0).toLocaleString('en-US')} USD
              </p>
            </div>
            <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
              <p className="text-[10px] text-gray-500 uppercase">Precisión Promedio</p>
              <p className="text-xl font-bold text-white mt-1">
                {(weeklyData.reduce((acc, curr) => acc + curr.confidenceScore, 0) / 7).toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Producción Semanal Proyectada</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.4} />
                  <XAxis dataKey="dayName" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  <Bar name="Generación PV (MWh)" dataKey="pvYieldMWh" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar name="Optimización Arbitraje ($)" dataKey="commercialOptimizationUSD" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-950 text-gray-400 border-b border-gray-800">
                  <th className="p-3 font-medium">Día</th>
                  <th className="p-3 font-medium text-right">Radiación Promedio (kWh/m²)</th>
                  <th className="p-3 font-medium text-right">Generación PV (MWh)</th>
                  <th className="p-3 font-medium text-right">Ciclos de Bateria</th>
                  <th className="p-3 font-medium text-right">Retorno Arbitraje Estimado</th>
                  <th className="p-3 font-medium text-right">Confianza de Red</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-gray-300">
                {weeklyData.map((d) => (
                  <tr key={d.dayName} className="hover:bg-gray-800/20">
                    <td className="p-3 font-semibold text-white">{d.dayName} <span className="text-gray-500 font-normal">({d.date})</span></td>
                    <td className="p-3 text-right font-mono">{d.radiationSum}</td>
                    <td className="p-3 text-right text-amber-400 font-bold font-mono">{d.pvYieldMWh} MWh</td>
                    <td className="p-3 text-right font-mono">{d.bessCycles} cycles</td>
                    <td className="p-3 text-right text-emerald-400 font-mono">${d.commercialOptimizationUSD} USD</td>
                    <td className="p-3 text-right font-mono">{d.confidenceScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Aggregate Tab */}
      {activeSubTab === 'monthly' && (
        <div className="space-y-6">
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-4">Curva Estacional Anual</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.4} />
                  <XAxis dataKey="monthName" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" name="Rendimiento PV (MWh)" dataKey="pvYieldMWh" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" name="BESS Throughput (MWh)" dataKey="bessThroughputMWh" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" name="Ingresos Totales ($x10)" dataKey="estimatedRevenueUSD" stroke="#3b82f6" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-950 text-gray-400 border-b border-gray-800">
                  <th className="p-3 font-medium">Mes</th>
                  <th className="p-3 font-medium text-right">Rendimiento Solar (MWh)</th>
                  <th className="p-3 font-medium text-right">BESS Total Despacho (MWh)</th>
                  <th className="p-3 font-medium text-right">Ingreso Estimado</th>
                  <th className="p-3 font-medium text-right">Performance Ratio (PR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-gray-300">
                {monthlyData.map((m) => (
                  <tr key={m.monthName} className="hover:bg-gray-800/20">
                    <td className="p-3 font-semibold text-white">{m.monthName}</td>
                    <td className="p-3 text-right text-amber-400 font-mono">{m.pvYieldMWh.toLocaleString()} MWh</td>
                    <td className="p-3 text-right text-emerald-400 font-mono">{m.bessThroughputMWh.toLocaleString()} MWh</td>
                    <td className="p-3 text-right text-blue-400 font-bold font-mono">${m.estimatedRevenueUSD.toLocaleString()} USD</td>
                    <td className="p-3 text-right font-mono">{m.performanceRatio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PV Performance & Trackers Tab */}
      {activeSubTab === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tracker Angle & Booster info */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Seguidores Solar Tracker Model</h3>
            <p className="text-xs text-gray-400">
              Cálculo trigonométrico en tiempo real del ángulo óptimo de inclinación astronómica.
            </p>

            <div className="bg-gray-950 p-4 border border-gray-800 rounded-lg space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Tipo de Tracker:</span>
                <span className="text-white font-medium">{activePlant.pv.trackerType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Inclinación Astronómica:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {activePlant.pv.trackerType === 'Fixed' ? `${activePlant.pv.tiltDegrees}°` : 'Dynamic: -42.8° a +42.8°'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Aumento de Eficiencia:</span>
                <span className="text-emerald-400 font-bold">
                  {activePlant.pv.trackerType === 'Single-Axis' ? '+15.0% (Bifacial Boost)' : 
                   activePlant.pv.trackerType === 'Dual-Axis' ? '+25.0% (Astronomic Dual)' : 
                   '0% (Inclinación fija)'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg">
              <strong>Efecto Albedo:</strong> Los paneles bifaciales capturan la radiación reflejada del desierto (suelo calizo de Atacama $\approx 22\%$ reflectividad).
            </div>
          </div>

          {/* Inverters diagnostics */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white">Estado Dinámico de Inversores Centrales</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% OPERATIVOS
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Desglose y diagnóstico simulado de inversores de {activePlant.name}.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: Math.min(12, activePlant.pv.inverterCount || 4) }).map((_, idx) => (
                <div key={idx} className="p-3 bg-gray-950 border border-gray-800/80 rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500">INV-{(idx + 1).toString().padStart(2, '0')}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-xs font-bold text-white font-mono">
                    {activePlant.pv.capacityMW > 0 ? `${(activePlant.pv.capacityMW / (activePlant.pv.inverterCount || 1) * 0.8).toFixed(2)} MW` : '0 MW'}
                  </p>
                  <div className="flex justify-between text-[8px] text-gray-400 font-mono">
                    <span>Temp: 34.5°C</span>
                    <span className="text-emerald-400">98.9%</span>
                  </div>
                </div>
              ))}
            </div>

            {activePlant.pv.inverterCount > 12 && (
              <p className="text-[10px] text-gray-500 text-center italic mt-2">
                ...Mostrando 12 de {activePlant.pv.inverterCount} inversores conectados
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
