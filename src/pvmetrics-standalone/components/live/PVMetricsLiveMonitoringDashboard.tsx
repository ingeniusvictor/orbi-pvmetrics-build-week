import React, { useState, useEffect, useMemo } from 'react';
import { createPvMetricsLiveDemoData, createPvMetricsTrendDemoByRange } from '../../data/createPvMetricsLiveDemoData';
import { PVMetricsLiveKpiBar } from './PVMetricsLiveKpiBar';
import { PVMetricsProductionExpectedChart } from './PVMetricsProductionExpectedChart';
import { PVMetricsIrradianceLiveChart } from './PVMetricsIrradianceLiveChart';
import { PVMetricsTelemetryVsScadaChart } from './PVMetricsTelemetryVsScadaChart';
import { PVMetricsPrHourlyChart } from './PVMetricsPrHourlyChart';
import { PVMetricsBessSocPowerChart } from './PVMetricsBessSocPowerChart';
import { PVMetricsBessTelemetryRealityCard } from './PVMetricsBessTelemetryRealityCard';
import { PVMetricsTemperatureChart } from './PVMetricsTemperatureChart';
import { PVMetricsDaySummaryCard } from './PVMetricsDaySummaryCard';
import { PVMetricsLossDistributionCard } from './PVMetricsLossDistributionCard';
import { PVMetricsRecentAlertsCard } from './PVMetricsRecentAlertsCard';
import { PVMetricsSubsystemStatusCard } from './PVMetricsSubsystemStatusCard';
import { PVMetricsTechnicalFooterNote } from './PVMetricsTechnicalFooterNote';
import { PVMetricsDataMode, PVMetricsTrendRange } from '../../types/pvmetrics-live-monitoring.types';
import { Shield, RefreshCw } from 'lucide-react';

export const PVMetricsLiveMonitoringDashboard: React.FC = () => {
  const [mode, setMode] = useState<PVMetricsDataMode>('demo');
  const [selectedRange, setSelectedRange] = useState<PVMetricsTrendRange>('daily');
  const [isUpdating, setIsUpdating] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const [environmentDataMode, setEnvironmentDataMode] = useState<'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available'>('external-telemetry');
  const [operationalDataMode, setOperationalDataMode] = useState<'demo' | 'scada-readonly' | 'not-available'>('demo');
  const [bessDataMode, setBessDataMode] = useState<'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available'>('demo');

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  // Memoize dataset to respond immediately to 'now' and 'mode' changes
  const dataset = useMemo(() => {
    return createPvMetricsLiveDemoData({
      now,
      timezone: 'America/Santiago',
      mode,
      environmentDataMode,
      operationalDataMode,
      bessDataMode
    });
  }, [now, mode, environmentDataMode, operationalDataMode, bessDataMode]);

  const lastUpdateTime = dataset.kpi.lastUpdateTime;

  const trendData = selectedRange === 'daily'
    ? dataset.timeSeries.map(pt => ({
        label: pt.time,
        expectedEnergyMWh: pt.expectedPowerMw,
        actualEnergyMWh: pt.actualPowerMw,
        expectedPowerMw: pt.expectedPowerMw,
        actualPowerMw: pt.actualPowerMw,
        irradianceAvgWm2: pt.irradianceWm2,
        prAvgPct: pt.prPct,
        lossesPct: 13.8,
        availabilityPct: 100.0,
        telemetryPowerMw: pt.telemetryPowerMw,
        scadaPowerMw: pt.scadaPowerMw
      }))
    : createPvMetricsTrendDemoByRange(selectedRange);

  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setNow(new Date());
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="live-monitoring-dashboard">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
              Monitoreo Live — Planta FV + BESS
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Monitoreo en tiempo real del desempeño fotovoltaico, almacenamiento e integración SCADA.
          </p>
        </div>

        {/* Right side technical indicators */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Temporal Range Selectors */}
          <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 text-[10px] font-bold">
            <button
              onClick={() => setSelectedRange('daily')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedRange === 'daily' 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Diario
            </button>
            <button
              onClick={() => setSelectedRange('weekly')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedRange === 'weekly' 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setSelectedRange('monthly')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedRange === 'monthly' 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
          </div>

          {/* Mode selectors */}
          <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 text-[10px] font-bold">
            <button
              onClick={() => {
                setMode('demo');
                setEnvironmentDataMode('demo');
                setOperationalDataMode('demo');
                setBessDataMode('demo');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                mode === 'demo' 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Demo Sim
            </button>
            <button
              onClick={() => {
                setMode('telemetry');
                setEnvironmentDataMode('external-telemetry');
                setOperationalDataMode('demo');
                setBessDataMode('demo');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                mode === 'telemetry' 
                  ? 'bg-cyan-500 text-slate-950 font-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Telemetría Cloud
            </button>
            <button
              onClick={() => {
                setMode('scada-live');
                setEnvironmentDataMode('onsite-weather');
                setOperationalDataMode('scada-readonly');
                setBessDataMode('ems-readonly');
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                mode === 'scada-live' 
                  ? 'bg-emerald-500 text-slate-950 font-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              SCADA Directo
            </button>
          </div>

          <button 
            onClick={handleRefresh}
            className="p-1.5 bg-gray-950 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-white rounded-lg transition"
            title="Refrescar señales"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>

          <div className="px-3 py-1.5 bg-gray-950 border border-gray-855 rounded-lg text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
            <span>Última actualización: {lastUpdateTime}</span>
            <span className="text-gray-600">|</span>
            <span>Zona horaria: America/Santiago</span>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400 font-semibold">Vista: General</span>
          </div>
        </div>
      </div>

      {/* Safety warning banner */}
      <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center justify-between gap-3 text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            <strong className="text-amber-400 font-bold">Nota de Seguridad Operacional:</strong> El dashboard puede combinar telemetría ambiental real o estimada por ubicación con datos operacionales demo/local o fuentes read-only autorizadas. Cada dato debe indicar su procedencia. El sistema no ejecuta comandos, no modifica setpoints, no habilita telecontrol y no escribe hacia activos FV, BESS, SCADA, EMS/BMS/PCS, medidores o protecciones.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider text-center flex-shrink-0">
          Modo híbrido read-only
        </span>
      </div>

      {/* Procedencia de Datos Live Card/Section */}
      <div className="p-4 bg-gray-950 border border-gray-850 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wider">
          Procedencia de Datos Live — Configuración del Modo Híbrido Read-Only
        </h3>
        <p className="text-[11px] text-gray-400">
          Clasificación y origen de las señales según las fuentes autorizadas por ubicación y factibilidad técnica.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Environment telemetry selection */}
          <div className="bg-slate-950/45 p-3 rounded-lg border border-gray-900 space-y-2">
            <label className="text-[10px] font-bold text-gray-400 font-mono uppercase block">Canal Ambiental / Clima</label>
            <select
              value={environmentDataMode}
              onChange={(e) => setEnvironmentDataMode(e.target.value as any)}
              className="w-full bg-slate-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="external-telemetry">Externa por ubicación (Estimada/Satélite)</option>
              <option value="onsite-weather">Meteo On-Site (Lectura real pasiva)</option>
              <option value="demo">Ambiental Demo Local (Simulada)</option>
            </select>
          </div>

          {/* Operational telemetry selection */}
          <div className="bg-slate-950/45 p-3 rounded-lg border border-gray-900 space-y-2">
            <label className="text-[10px] font-bold text-gray-400 font-mono uppercase block">Canal Operacional Planta / SCADA</label>
            <select
              value={operationalDataMode}
              onChange={(e) => setOperationalDataMode(e.target.value as any)}
              className="w-full bg-slate-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="demo">Operación Planta Demo (Sin SCADA autorizado)</option>
              <option value="scada-readonly">Operación SCADA Read-Only (Lectura autorizada)</option>
            </select>
          </div>

          {/* BESS telemetry selection */}
          <div className="bg-slate-950/45 p-3 rounded-lg border border-gray-900 space-y-2">
            <label className="text-[10px] font-bold text-gray-400 font-mono uppercase block">Canal BESS Telemetría / Medidores</label>
            <select
              value={bessDataMode}
              onChange={(e) => setBessDataMode(e.target.value as any)}
              className="w-full bg-slate-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="demo">BESS Demo Local (Simulada)</option>
              <option value="ems-readonly">BESS EMS Read-Only (Lectura autorizada)</option>
              <option value="meter-readonly">BESS Medidor Read-Only (Medidor dedicado)</option>
            </select>
          </div>
        </div>

        {/* Provenance badges display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-2 border-t border-gray-900">
          {dataset.dataSourceBadges?.map((badge) => {
            let trustColor = "bg-amber-500/10 text-amber-400 border-amber-500/25";
            if (badge.trustLevel === 'validated-real' || badge.trustLevel === 'onsite-real') {
              trustColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
            } else if (badge.trustLevel === 'external-real' || badge.trustLevel === 'estimated') {
              trustColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/25";
            }
            
            return (
              <div key={badge.id} className="p-2.5 bg-slate-950/60 border border-gray-850/65 rounded-lg flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] font-extrabold tracking-wider text-gray-300 font-mono truncate uppercase">
                    {badge.label}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono border ${trustColor} uppercase font-bold shrink-0`}>
                    {badge.trustLevel}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  {badge.sourceDescription}
                </p>
                <p className="text-[9px] text-gray-500 mt-1.5 pt-1.5 border-t border-gray-900/60 font-mono italic">
                  🛡️ {badge.safetyNote}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nocturnal state notification */}
      {dataset.kpi.irradianceCurrentWm2 === 0 && (
        <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-lg flex items-center justify-between gap-3 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <span className="text-sm">🌙</span>
            <span>
              <strong className="text-indigo-400">MODO NOCTURNO — SIN IRRADIANCIA FV:</strong> La planta FV no registra recurso solar en este horario. El monitoreo live mantiene telemetría simulada en cero para producción FV y conserva lectura del BESS.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider flex-shrink-0">
            Noche Activa
          </span>
        </div>
      )}

      {/* 8 KPI Cards Bar */}
      <PVMetricsLiveKpiBar
        kpi={dataset.kpi}
        environmentDataMode={environmentDataMode}
        operationalDataMode={operationalDataMode}
        bessDataMode={bessDataMode}
      />

      {/* Bento Grid layout with the 3 main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PVMetricsProductionExpectedChart
          data={trendData}
          range={selectedRange}
          operationalDataMode={operationalDataMode}
        />
        <PVMetricsIrradianceLiveChart
          data={trendData}
          range={selectedRange}
          environmentDataMode={environmentDataMode}
        />
        <PVMetricsTelemetryVsScadaChart data={trendData} range={selectedRange} mode={mode} />
      </div>

      {/* Advanced Diagnostics Bento Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <PVMetricsPrHourlyChart data={trendData} range={selectedRange} />
        <PVMetricsBessSocPowerChart data={dataset.timeSeries} />
        <PVMetricsBessTelemetryRealityCard reality={dataset.bessTelemetryReality} />
        <PVMetricsTemperatureChart data={dataset.timeSeries} />
      </div>

      {/* Summary, Losses, Alerts, and Subsystems Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <PVMetricsDaySummaryCard energyTodayMWh={dataset.kpi.energyTodayMWh} />
        <PVMetricsLossDistributionCard losses={dataset.losses} />
        <PVMetricsRecentAlertsCard alerts={dataset.alerts} />
        <PVMetricsSubsystemStatusCard subsystems={dataset.subsystems} />
      </div>

      {/* Technical Footer */}
      <PVMetricsTechnicalFooterNote
        mode={mode}
        environmentDataMode={environmentDataMode}
        operationalDataMode={operationalDataMode}
        bessDataMode={bessDataMode}
      />
    </div>
  );
};
