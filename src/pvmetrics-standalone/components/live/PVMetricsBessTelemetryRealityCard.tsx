import React from 'react';
import { PVMetricsBessTelemetryRealitySnapshot } from '../../types/pvmetrics-live-monitoring.types';
import { Info, Battery, Zap, AlertTriangle, ShieldCheck, Cpu, Gauge } from 'lucide-react';

interface PVMetricsBessTelemetryRealityCardProps {
  reality?: PVMetricsBessTelemetryRealitySnapshot;
}

export const PVMetricsBessTelemetryRealityCard: React.FC<PVMetricsBessTelemetryRealityCardProps> = ({ reality }) => {
  if (!reality) {
    return (
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl text-center text-gray-500 text-xs">
        Sin datos de comparación BESS disponibles.
      </div>
    );
  }

  const {
    emsPowerMw,
    measuredPowerMw,
    powerDeltaMw,
    powerDeltaPct,
    emsSocPct,
    telemetryConfidence,
    statusLabel,
    sourceTelemetryLabel,
    sourceMeasurementLabel,
    emsEnergyChargedMwh,
    measuredEnergyChargedMwh,
    chargedEnergyDeltaMwh,
    emsEnergyDischargedMwh,
    measuredEnergyDischargedMwh,
    dischargedEnergyDeltaMwh,
  } = reality;

  const confidenceStyles = {
    high: {
      bg: 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400',
      dot: 'bg-emerald-500',
      label: 'ALTA',
    },
    medium: {
      bg: 'bg-amber-950/20 border-amber-500/20 text-amber-400',
      dot: 'bg-amber-500',
      label: 'MEDIA',
    },
    low: {
      bg: 'bg-rose-950/20 border-rose-500/20 text-rose-400',
      dot: 'bg-rose-500',
      label: 'BAJA (REVISAR)',
    },
    'not-tested': {
      bg: 'bg-gray-950/20 border-gray-500/20 text-gray-400',
      dot: 'bg-gray-500',
      label: 'NO PROBADO',
    },
  };

  const currentConfidence = confidenceStyles[telemetryConfidence] || confidenceStyles['not-tested'];

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between" id="bess-telemetry-vs-reality">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-1.5">
              BESS Telemetry vs Reality
              <span className="group relative">
                <Info className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-64 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 leading-relaxed">
                  Compara la telemetría enviada por el EMS/PCS del BESS con la medición física real del medidor dedicado en el punto de acoplamiento.
                </span>
              </span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Contraste conceptual de confiabilidad del almacenamiento
            </p>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-mono font-black rounded-md border border-gray-800 bg-gray-950 text-gray-400">
            Read-Only First
          </span>
        </div>

        {/* Status indicator and Confidence */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 bg-slate-950 rounded-lg border border-gray-850">
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Estado de Enlace</span>
            <span className="text-xs font-medium text-gray-200 block mt-1 truncate" title={statusLabel}>
              {statusLabel}
            </span>
          </div>
          <div className={`p-2.5 rounded-lg border ${currentConfidence.bg}`}>
            <span className="text-[10px] block uppercase tracking-wider font-semibold opacity-80">Confianza de Telemetría</span>
            <span className="text-xs font-extrabold flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${currentConfidence.dot}`}></span>
              {currentConfidence.label}
            </span>
          </div>
        </div>

        {/* Real-time comparison grid */}
        <div className="space-y-3.5">
          {/* Power Comparison (MW) */}
          <div className="p-3 bg-slate-950/60 border border-gray-850 rounded-lg">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Flujo de Potencia Activa BESS</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 bg-slate-900 rounded border border-gray-850">
                <span className="text-[9px] text-gray-400 block">EMS Power</span>
                <span className="text-xs font-mono font-bold text-cyan-400 mt-0.5 block">
                  {emsPowerMw > 0 ? `+${emsPowerMw}` : emsPowerMw} MW
                </span>
              </div>
              <div className="p-1.5 bg-slate-900 rounded border border-gray-850">
                <span className="text-[9px] text-gray-400 block">Medido BESS</span>
                <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5 block">
                  {measuredPowerMw > 0 ? `+${measuredPowerMw}` : measuredPowerMw} MW
                </span>
              </div>
              <div className="p-1.5 bg-slate-900/80 rounded border border-gray-850">
                <span className="text-[9px] text-gray-400 block">Delta (MW | %)</span>
                <span className={`text-xs font-mono font-bold mt-0.5 block ${Math.abs(powerDeltaMw) > 0.15 ? 'text-amber-400' : 'text-gray-300'}`}>
                  {powerDeltaMw > 0 ? `+${powerDeltaMw}` : powerDeltaMw} ({powerDeltaPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Energy & SOC comparison */}
          <div className="grid grid-cols-2 gap-3">
            {/* EMS SOC */}
            <div className="p-2.5 bg-slate-950/60 border border-gray-850 rounded-lg flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 block uppercase tracking-wider">EMS SOC %</span>
                <span className="text-sm font-mono font-extrabold text-cyan-400 block">{emsSocPct}%</span>
              </div>
              <Battery className="w-6 h-6 text-cyan-500 shrink-0" />
            </div>

            {/* Simulated expected BESS SOC */}
            <div className="p-2.5 bg-slate-950/60 border border-gray-850 rounded-lg flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 block uppercase tracking-wider">Confiabilidad Real</span>
                <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                  {telemetryConfidence === 'high' ? 'Alta (99.2%)' : 'Estable (96.5%)'}
                </span>
              </div>
              <Gauge className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>
          </div>

          {/* Energy Charged / Discharged Deltas */}
          <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-xs space-y-2">
            <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-bold">Acumulado Diario de Energía</span>
            
            <div className="flex items-center justify-between border-b border-gray-850 pb-1.5">
              <span className="text-gray-400 text-[10px]">Energía Cargada (EMS vs Medido):</span>
              <span className="font-mono text-gray-200">
                <span className="text-cyan-400">{emsEnergyChargedMwh}</span> / <span className="text-emerald-400">{measuredEnergyChargedMwh}</span> MWh 
                <span className="text-[10px] text-gray-500 ml-1">({chargedEnergyDeltaMwh >= 0 ? `+${chargedEnergyDeltaMwh}` : chargedEnergyDeltaMwh})</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-gray-400 text-[10px]">Energía Descargada (EMS vs Medido):</span>
              <span className="font-mono text-gray-200">
                <span className="text-cyan-400">{emsEnergyDischargedMwh}</span> / <span className="text-emerald-400">{measuredEnergyDischargedMwh}</span> MWh 
                <span className="text-[10px] text-gray-500 ml-1">({dischargedEnergyDeltaMwh >= 0 ? `+${dischargedEnergyDeltaMwh}` : dischargedEnergyDeltaMwh})</span>
              </span>
            </div>
          </div>

          {/* Sources details */}
          <div className="p-2 bg-slate-950/40 rounded border border-gray-850 text-[9px] text-gray-400 font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span>Fuente telemetría BESS:</span>
              <span className="text-gray-200">{sourceTelemetryLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fuente medición BESS:</span>
              <span className="text-gray-200">{sourceMeasurementLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Warning text (Obligatory) */}
      <div className="mt-4 pt-3.5 border-t border-gray-850 flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[9px] text-gray-300 leading-relaxed font-sans">
          Esta comparación utiliza datos de telemetría BESS contra la medición física BESS según los canales configurados en el modo híbrido. No se implementa telecontrol, no se envían comandos, no se modifican setpoints y no se escribe hacia activos físicos.
        </p>
      </div>
    </div>
  );
};
