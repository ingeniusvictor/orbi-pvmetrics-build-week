import React, { useState, useEffect } from 'react';
import { useAppState } from '../app/StateContext';
import { generateDailyForecast, generateTelemetryData } from '../utils/simulator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Sun, Battery, Activity, Wifi, ShieldAlert, Cpu, Award, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { DISCLAIMER_AES_CHILE } from '../data/presets';
import { PVMetricsStandaloneVersionCard } from '../../components/PVMetricsStandaloneVersionCard';


export const DashboardView: React.FC = () => {
  const { activePlant, activeCompany, noiseLevel } = useAppState();
  const [telemetry, setTelemetry] = useState(() => generateTelemetryData(activePlant));
  const [dailyData, setDailyData] = useState(() => generateDailyForecast(activePlant, noiseLevel));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll for simulated live telemetry updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(generateTelemetryData(activePlant));
    }, 3000); // update every 3 seconds for live simulation feel
    return () => clearInterval(timer);
  }, [activePlant]);

  // Update daily forecast arrays when plant specs change
  useEffect(() => {
    setDailyData(generateDailyForecast(activePlant, noiseLevel));
  }, [activePlant, noiseLevel]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTelemetry(generateTelemetryData(activePlant));
    setDailyData(generateDailyForecast(activePlant, noiseLevel, new Date()));
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'maintenance': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  // Aggregated values for the daily summary card
  const totalPVGenMWh = dailyData.reduce((acc, curr) => acc + curr.pvGenerationForecastMW, 0);
  const totalBessDischargeMWh = dailyData.reduce((acc, curr) => acc + curr.bessDischargeAdviceMW, 0);
  const estimatedRevenue = dailyData.reduce((acc, curr) => {
    const pvRev = curr.pvGenerationForecastMW * curr.marginalCostUSD;
    const bessRev = (curr.bessDischargeAdviceMW - curr.bessChargeAdviceMW) * curr.marginalCostUSD;
    return acc + pvRev + bessRev;
  }, 0);

  return (
    <div className="space-y-6" id="dashboard-view">
      {/* Disclaimer banner if ORBI Solar Demo preset */}
      {activeCompany.id === 'orbi-solar-demo' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Aviso:</strong> {DISCLAIMER_AES_CHILE}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Panel de Operaciones
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-normal ${getStatusColor(activePlant.status)}`}>
              ● {activePlant.status === 'active' ? 'En Línea' : activePlant.status === 'maintenance' ? 'Mantenimiento' : 'Sin Conexión'}
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Visualización integrada de {activePlant.name} ({activePlant.region})
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2 py-1 bg-gray-900 border border-gray-800 text-gray-400 rounded">
            SIMULACIÓN LIVE: 3s SCAN RATE
          </span>
          <button 
            onClick={handleManualRefresh}
            className={`p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-300 transition flex items-center gap-2 text-xs`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            Sincronizar
          </button>
        </div>
      </div>

      {/* Bento Grid KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PV KPI */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">Potencia Solar Activa</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {activePlant.pv.capacityMW > 0 ? `${telemetry.pvPowerMW} MW` : 'N/A'}
              </h3>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-gray-800/60 pt-2.5">
            <span className="text-gray-500">Capacidad Solar:</span>
            <span className="text-gray-300 font-medium">{activePlant.pv.capacityMW} MWp</span>
          </div>
        </div>

        {/* BESS SOC KPI */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">Estado de Batería (SOC)</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {activePlant.bess.capacityMW > 0 ? `${telemetry.bessSocPercent}%` : 'S/BESS'}
              </h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <Battery className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-gray-800/60 pt-2.5">
            <span className="text-gray-500">Capacidad BESS:</span>
            <span className="text-gray-300 font-medium">
              {activePlant.bess.capacityMW > 0 ? `${activePlant.bess.capacityMW}MW / ${activePlant.bess.capacityMWh}MWh` : 'No configurado'}
            </span>
          </div>
        </div>

        {/* Grid Integration KPI */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">Inyección neta al Grid</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {telemetry.gridPowerMW} MW
              </h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-gray-800/60 pt-2.5">
            <span className="text-gray-500">Frecuencia / Voltaje:</span>
            <span className="text-gray-300 font-medium">{telemetry.frequencyHz} Hz | {telemetry.voltageKV} kV</span>
          </div>
        </div>

        {/* Telemetry Status KPI */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">Telemetry Quality</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {telemetry.dataQualityScore}%
              </h3>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Wifi className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-gray-800/60 pt-2.5">
            <span className="text-gray-500">Latencia / Pérdida:</span>
            <span className="text-gray-300 font-medium">
              {activePlant.status === 'offline' ? 'N/A' : `${telemetry.signalStrengthDbm} dBm / ${telemetry.packetLossPercent}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Side Gauges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Forecast Curve Chart */}
        <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Curva Diaria de Pronóstico y BESS</h3>
              <p className="text-[11px] text-gray-400">Pronóstico horario de radiación solar vs. SOC proyectado</p>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Solar
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> SOC %
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Inyección MW
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.4} />
                <XAxis dataKey="timeLabel" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af', fontSize: '11px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" name="Solar Forecast (MW)" dataKey="pvGenerationForecastMW" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#solarGrad)" />
                <Area type="monotone" name="BESS SOC (%)" dataKey="socForecastPercent" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#socGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6 lg:col-span-1 flex flex-col justify-between">
          
          {/* Version Card compacta */}
          <PVMetricsStandaloneVersionCard />

          {/* Interactive Metrics Side Panel */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Indicadores de Calidad de Datos</h3>
              
              {/* Solar Radiation Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-500" /> Irradiación GHI</span>
                  <span className="text-white font-mono">{telemetry.solarRadiation} W/m²</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (telemetry.solarRadiation / 1000) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Network Latency Meter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Latencia SCADA</span>
                  <span className={`font-mono ${activePlant.status === 'offline' ? 'text-rose-500' : 'text-white'}`}>
                    {activePlant.status === 'offline' ? 'TIMEOUT' : `${activePlant.status === 'maintenance' ? '145 ms (Maint)' : '16 ms (OK)'}`}
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${activePlant.status === 'maintenance' ? 'bg-amber-500' : activePlant.status === 'offline' ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: activePlant.status === 'offline' ? '100%' : activePlant.status === 'maintenance' ? '70%' : '18%' }}
                  ></div>
                </div>
              </div>

              {/* Data Quality Gauge score */}
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg flex items-center gap-4 mt-2">
                <div className="relative flex items-center justify-center">
                  {/* SVG Radial Gauge */}
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#1f2937" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      stroke={telemetry.dataQualityScore > 85 ? '#10b981' : telemetry.dataQualityScore > 50 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 - (175.9 * telemetry.dataQualityScore) / 100}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-white font-mono">{telemetry.dataQualityScore}%</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-200">Data Quality Scorer</h4>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {telemetry.dataQualityScore > 90 
                      ? 'Señales estables con telemetría robusta.' 
                      : telemetry.dataQualityScore > 0 
                      ? 'Ruido moderado o pérdida menor detectada.' 
                      : 'Enlace desconectado sin comunicación.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 flex items-center gap-1"><Award className="w-3.5 h-3.5 text-yellow-500" /> Rendimiento Diario</span>
                <span className="text-emerald-400 font-bold">SCADA READY</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center pt-1.5">
                <div className="p-2 bg-gray-950 rounded border border-gray-800">
                  <p className="text-[9px] text-gray-500 uppercase">Energía PV Hoy</p>
                  <p className="text-xs font-bold text-gray-200">{totalPVGenMWh.toFixed(1)} MWh</p>
                </div>
                <div className="p-2 bg-gray-950 rounded border border-gray-800">
                  <p className="text-[9px] text-gray-500 uppercase">BESS Ciclos Hoy</p>
                  <p className="text-xs font-bold text-gray-200">{(totalBessDischargeMWh / (activePlant.bess.capacityMWh || 1)).toFixed(2)} cycles</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Simulated Commercial Summary Card */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Pre-Factibilidad Comercial Diaria Proyectada (Arbitraje BESS + Venta PV)
            </h3>
            <p className="text-xs text-gray-400">Evaluación financiera preliminar utilizando costos marginales proyectados del nodo</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] text-emerald-400 uppercase font-semibold">Simulación de Arbitraje</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-3.5 bg-gray-950 rounded-lg border border-gray-800/80">
            <p className="text-[10px] text-gray-500 uppercase">Tarifa Promedio Carga BESS</p>
            <p className="text-sm font-semibold text-amber-400 font-mono mt-1">$4.20 USD / MWh</p>
            <p className="text-[10px] text-gray-400 mt-1">Horario de carga: 11:00 - 15:00</p>
          </div>
          <div className="p-3.5 bg-gray-950 rounded-lg border border-gray-800/80">
            <p className="text-[10px] text-gray-500 uppercase">Tarifa Promedio Inyección BESS</p>
            <p className="text-sm font-semibold text-emerald-400 font-mono mt-1">$102.50 USD / MWh</p>
            <p className="text-[10px] text-gray-400 mt-1">Horario despacho: 18:00 - 22:00</p>
          </div>
          <div className="p-3.5 bg-gray-950 rounded-lg border border-gray-800/80">
            <p className="text-[10px] text-gray-500 uppercase">Ingreso Proyectado Hoy</p>
            <p className="text-sm font-bold text-white font-mono mt-1">
              ${estimatedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
            </p>
            <p className="text-[10px] text-emerald-400 mt-1">Optimización completada</p>
          </div>
        </div>
      </div>
    </div>
  );
};
