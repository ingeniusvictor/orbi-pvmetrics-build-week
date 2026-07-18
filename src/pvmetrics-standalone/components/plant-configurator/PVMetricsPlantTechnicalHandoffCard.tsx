import React from 'react';
import { PVMetricsPlantTechnicalHandoff } from '../../types/pvmetrics-plant-handoff.types';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Activity,
  FileText,
  Clock,
} from 'lucide-react';

interface PVMetricsPlantTechnicalHandoffCardProps {
  handoff: PVMetricsPlantTechnicalHandoff;
}

export const PVMetricsPlantTechnicalHandoffCard: React.FC<PVMetricsPlantTechnicalHandoffCardProps> = ({
  handoff,
}) => {
  const {
    readinessLevel,
    readinessLabel,
    executiveSummary,
    plantTechnicalSummary,
    bessTechnicalSummary,
    dataProvenanceSummary,
    requiredSources,
    requiredSignalGroups,
    gaps,
    nextSteps,
    generatedAtLabel,
  } = handoff;

  // Set style based on readiness level
  let readinessColor = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
  let badgeLabel = 'Draft Incompleto';

  if (readinessLevel === 'draft-ready') {
    readinessColor = 'border-blue-500/30 text-blue-400 bg-blue-500/10';
    badgeLabel = 'Borrador Técnico Posible';
  } else if (readinessLevel === 'client-validation-ready') {
    readinessColor = 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10';
    badgeLabel = 'Validación Cliente';
  } else if (readinessLevel === 'readonly-pilot-ready') {
    readinessColor = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
    badgeLabel = 'Listo Piloto Read-Only';
  }

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-6 animate-fadeIn" id="technical-handoff-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-gray-200 font-mono tracking-wider uppercase">
              ORBI Technical Handoff Draft
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Paquete conceptual de preparación técnica y levantamiento on-site.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-gray-500 font-mono block">Generado (CLT):</span>
            <span className="text-xs text-gray-300 font-mono font-medium">{generatedAtLabel}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-extrabold uppercase ${readinessColor}`}>
            {readinessLabel}
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="p-3 bg-slate-950/60 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-[10px] text-gray-300 leading-normal">
          <strong className="text-amber-400 font-bold">Límite de Seguridad Conceptual:</strong> Este handoff es local y de caracter estrictamente consultivo. No equivale a una ficha técnica oficial, no autoriza conexión real, no realiza escrituras de setpoint, no ejecuta telecomandos ni activa cargas/descargas físicas en inversores o baterías.
        </div>
      </div>

      {/* Executive Summary */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          Resumen Ejecutivo
        </h4>
        <div className="p-3 bg-slate-950/40 rounded border border-gray-850 text-xs text-gray-300 leading-relaxed italic">
          {executiveSummary}
        </div>
      </div>

      {/* Grid: FV/Plant & BESS Technical summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Plant Summary */}
        <div className="p-4 bg-slate-950/40 border border-gray-850 rounded-lg space-y-3">
          <h5 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase border-b border-gray-800 pb-2">
            🔌 Perfil Técnico Planta FV
          </h5>
          <pre className="text-[11px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">
            {plantTechnicalSummary}
          </pre>
        </div>

        {/* BESS Summary */}
        <div className="p-4 bg-slate-950/40 border border-gray-850 rounded-lg space-y-3">
          <h5 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase border-b border-gray-800 pb-2">
            🔋 Subactivo BESS
          </h5>
          <pre className="text-[11px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">
            {bessTechnicalSummary}
          </pre>
        </div>
      </div>

      {/* Data Provenance hierarchy */}
      <div className="p-4 bg-slate-950/40 border border-gray-850 rounded-lg space-y-3">
        <h5 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-500" />
          Jerarquía de Procedencia de Datos Sugerida
        </h5>
        <pre className="text-[11px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap">
          {dataProvenanceSummary}
        </pre>
      </div>

      {/* Sources & Signal Groups Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Required Sources */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Fuentes Técnicas Requeridas
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {requiredSources.map((src) => (
              <span
                key={src}
                className="px-2 py-1 bg-gray-950 border border-gray-800 rounded text-[10px] text-gray-300 font-mono"
              >
                {src}
              </span>
            ))}
          </div>
        </div>

        {/* Required Signal Groups */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Grupos de Señales Mínimas
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {requiredSignalGroups.map((grp) => (
              <span
                key={grp}
                className="px-2 py-1 bg-gray-950 border border-gray-800 rounded text-[10px] text-gray-300 font-mono"
              >
                {grp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Technical Gaps */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Brechas Técnicas Clave ({gaps.length})
        </h4>

        {gaps.length === 0 ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            ¡Sin brechas pendientes! El perfil del borrador está completamente listo para validación formal.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gaps.map((gap) => {
              const borderStyles =
                gap.severity === 'critical'
                  ? 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                  : 'border-amber-500/20 bg-amber-500/5 text-amber-400';
              return (
                <div key={gap.id} className={`p-2.5 border rounded-lg text-[11px] ${borderStyles}`}>
                  <div className="font-bold uppercase tracking-wider mb-1 font-mono flex items-center justify-between">
                    <span>{gap.label}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded border uppercase font-extrabold">
                      {gap.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed font-sans">{gap.recommendation}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Steps / Recommendation Flow */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Hoja de Ruta y Próximos Pasos Sugeridos
        </h4>
        <div className="space-y-2">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-2.5 text-xs text-gray-300">
              <span className="text-cyan-500 font-mono font-bold mt-0.5 shrink-0">
                0{index + 1}.
              </span>
              <p className="leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
