import React from 'react';
import { PVMetricsKpiSnapshot } from '../../types/pvmetrics-live-monitoring.types';
import { Zap, Percent, Activity, Sun, TrendingUp, Cpu, Battery, Radio } from 'lucide-react';

interface PVMetricsLiveKpiBarProps {
  kpi: PVMetricsKpiSnapshot;
  environmentDataMode?: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available';
  operationalDataMode?: 'demo' | 'scada-readonly' | 'not-available';
  bessDataMode?: 'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available';
}

export const PVMetricsLiveKpiBar: React.FC<PVMetricsLiveKpiBarProps> = ({
  kpi,
  environmentDataMode = 'external-telemetry',
  operationalDataMode = 'demo',
  bessDataMode = 'demo',
}) => {
  let envLabel = "Fuente: Demo local";
  if (environmentDataMode === 'external-telemetry') envLabel = "Fuente: Externa por ubicación";
  if (environmentDataMode === 'onsite-weather') envLabel = "Fuente: Meteo on-site";

  let opLabel = "Fuente: Demo local";
  if (operationalDataMode === 'scada-readonly') opLabel = "Fuente: SCADA read-only";

  let bessLabel = "Fuente: BESS demo";
  if (bessDataMode === 'ems-readonly') bessLabel = "Fuente: EMS read-only";
  if (bessDataMode === 'meter-readonly') bessLabel = "Fuente: Medidor read-only";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {/* 1. ENERGÍA DEL DÍA */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-energy-today">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Energía del Día</span>
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold font-mono text-amber-400">{kpi.energyTodayMWh.toFixed(2)} <span className="text-xs text-gray-400">MWh</span></div>
          <div className="text-[9px] text-gray-500 mt-1 flex justify-between">
            <span>Ayer: {kpi.energyYesterdayMWh} MWh</span>
            <span className="text-emerald-500 font-semibold">+6.1%</span>
          </div>
          <div className="text-[8px] text-gray-600 mt-1 font-mono">{opLabel}</div>
        </div>
      </div>

      {/* 2. PR PROMEDIO (DÍA) */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-pr-avg">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">PR Promedio (Día)</span>
          <Percent className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold font-mono text-emerald-400">{kpi.prDayAvgPct}%</div>
          <div className="text-[9px] text-gray-500 mt-1 flex justify-between">
            <span>Ayer: {kpi.prYesterdayPct}%</span>
            <span className="text-emerald-500 font-semibold">+3 pp</span>
          </div>
          <div className="text-[8px] text-gray-600 mt-1 font-mono">Cálculo híbrido</div>
        </div>
      </div>

      {/* 3. PICO MÁXIMO (DÍA) */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-peak-power">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Pico Máximo (Día)</span>
          <TrendingUp className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold font-mono text-cyan-400">{kpi.peakPowerMw.toFixed(2)} <span className="text-xs text-gray-400">MW</span></div>
          <div className="text-[9px] text-gray-500 mt-1">
            <span>Registrado a las {kpi.peakPowerTime}</span>
          </div>
          <div className="text-[8px] text-gray-600 mt-1 font-mono">{opLabel}</div>
        </div>
      </div>

      {/* 4. IRRADIANCIA ACTUAL */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-irradiance">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Irradiancia Actual</span>
          <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold font-mono text-amber-500">{kpi.irradianceCurrentWm2} <span className="text-xs text-gray-400">W/m²</span></div>
          <div className="text-[9px] text-gray-500 mt-1">
            <span>Medición instantánea GHI</span>
          </div>
          <div className="text-[8px] text-cyan-500 mt-1 font-mono font-medium">{envLabel}</div>
        </div>
      </div>

      {/* 5. POTENCIA ESPERADA ACTUAL */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-expected-power">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Potencia Esperada Actual</span>
          <Activity className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold font-mono text-purple-400">{kpi.expectedPowerCurrentMw.toFixed(2)} <span className="text-xs text-gray-400">MW</span></div>
          <div className="text-[9px] text-gray-500 mt-1">
            <span>Simulado según modelo</span>
          </div>
          <div className="text-[8px] text-gray-600 mt-1 font-mono">Algoritmo ORBI</div>
        </div>
      </div>

      {/* 6. POTENCIA REAL ACTUAL */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-actual-power">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Potencia Real Actual</span>
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold font-mono text-cyan-400">{kpi.actualPowerCurrentMw.toFixed(2)} <span className="text-xs text-gray-400">MW</span></div>
          <div className="text-[9px] text-gray-500 mt-1">
            <span>Enlace de campo activo</span>
          </div>
          <div className="text-[8px] text-gray-600 mt-1 font-mono">{opLabel}</div>
        </div>
      </div>

      {/* 7. ESTADO SCADA */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-scada-status">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Estado SCADA</span>
          <Radio className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2">
          <div className={`text-sm font-black uppercase font-mono tracking-wide ${
            kpi.scadaStatus === 'connected' ? 'text-emerald-400' : 'text-cyan-400'
          }`}>
            {kpi.scadaStatus === 'connected' ? 'SCADA CONECTADO' : 'SCADA SIMULADO'}
          </div>
          <div className="text-[9px] text-gray-500 mt-1 flex justify-between">
            <span>Calidad: {kpi.scadaQualityPct}%</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-[8px] text-gray-600 mt-1 font-mono">{opLabel}</div>
        </div>
      </div>

      {/* 8. ESTADO BESS */}
      <div className="p-3 bg-gray-950 border border-gray-850 rounded-lg flex flex-col justify-between" id="kpi-bess-status">
        <div className="flex items-center justify-between text-gray-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Estado BESS</span>
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className="text-sm font-black text-emerald-400 uppercase font-mono tracking-wide">
            {kpi.bessMode === 'charging' ? 'CARGANDO' : kpi.bessMode === 'discharging' ? 'DESCARGANDO' : 'STANDBY'}
          </div>
          <div className="text-[9px] text-gray-500 mt-1 flex justify-between">
            <span>SOC: {kpi.bessSocPct}%</span>
            <span>Normal</span>
          </div>
          <div className="text-[8px] text-emerald-500 mt-1 font-mono font-medium">{bessLabel}</div>
        </div>
      </div>
    </div>
  );
};
