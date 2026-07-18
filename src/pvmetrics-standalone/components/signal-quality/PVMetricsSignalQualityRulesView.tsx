import React from 'react';
import { createPvMetricsSignalQualityRulesDemo } from '../../data/createPvMetricsSignalQualityRulesDemo';
import { PVMetricsSignalQualityOverviewCards } from './PVMetricsSignalQualityOverviewCards';
import { PVMetricsSignalQualityRiskCard } from './PVMetricsSignalQualityRiskCard';
import { PVMetricsSignalQualityRulesTable } from './PVMetricsSignalQualityRulesTable';
import { PVMetricsSignalQualitySecurityNote } from './PVMetricsSignalQualitySecurityNote';
import { Info } from 'lucide-react';

export const PVMetricsSignalQualityRulesView: React.FC = () => {
  const dataset = createPvMetricsSignalQualityRulesDemo();

  return (
    <div className="space-y-6" id="signal-quality-rules-view">
      {/* Header and badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              LOCAL RULE ENGINE
            </span>
            <span className="text-[9px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              READ-ONLY FIRST
            </span>
            <span className="text-[9px] font-mono font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              NO DATA INGESTION
            </span>
            <span className="text-[9px] font-mono font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              NO TELECONTROL
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight font-sans uppercase">
            SIGNAL QUALITY RULES
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Motor local de reglas para validar presencia, rango, unidad, timestamp, calidad y preparación de señales críticas.
          </p>
        </div>
      </div>

      {/* Info warning note */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-300 font-semibold">EVALUACIÓN DE REGLAS CONCEPTUALES:</strong> Este módulo evalúa reglas sobre el catálogo demo de señales. No consume datos productivos, no consulta APIs y no conecta SCADA real. Ninguna escritura de setpoint ni comando de telecontrol es ejecutado.
        </div>
      </div>

      {/* Summary KPI Cards */}
      <PVMetricsSignalQualityOverviewCards summary={dataset.summary} />

      {/* Risk and Readiness Cards */}
      <PVMetricsSignalQualityRiskCard rules={dataset.rules} riskScore={dataset.summary.operationalRiskScore} />

      {/* Detailed Rules Table */}
      <PVMetricsSignalQualityRulesTable rules={dataset.rules} />

      {/* Safe Sovereign Mode Security Footer */}
      <PVMetricsSignalQualitySecurityNote />
    </div>
  );
};

export default PVMetricsSignalQualityRulesView;
