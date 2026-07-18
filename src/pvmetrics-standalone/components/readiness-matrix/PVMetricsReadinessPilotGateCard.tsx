import React from 'react';
import { PVMetricsReadinessMatrixSummary } from '../../types/pvmetrics-readiness-matrix.types';
import { ShieldCheck, AlertTriangle, XCircle, Info, ArrowUpRight } from 'lucide-react';

type PVMetricsReadinessPilotGateCardProps = {
  summary: PVMetricsReadinessMatrixSummary;
};

export const PVMetricsReadinessPilotGateCard: React.FC<PVMetricsReadinessPilotGateCardProps> = ({ summary }) => {
  const isApto = summary.pilotReadinessPct >= 80 && summary.criticalRiskRows === 0;
  const isParcial = summary.pilotReadinessPct >= 60 && !isApto;
  const isNoListo = summary.pilotReadinessPct < 60;

  const requiresMitigation = summary.criticalRiskRows > 0;

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl" id="pilot-gate-card">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Evaluación Ejecutiva de Preparación para Piloto Read-Only
          </h3>
          
          <div className="flex flex-wrap items-baseline gap-2.5 mb-3">
            {isApto && (
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded uppercase tracking-wider">
                APTO PARA PRE-PILOTO READ-ONLY
              </span>
            )}
            {isParcial && (
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded uppercase tracking-wider">
                PARCIALMENTE PREPARADO
              </span>
            )}
            {isNoListo && (
              <span className="text-xs font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded uppercase tracking-wider">
                NO LISTO PARA PILOTO
              </span>
            )}

            {requiresMitigation && (
              <span className="text-xs font-extrabold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded uppercase tracking-wider">
                REQUIERE MITIGACIÓN TÉCNICA
              </span>
            )}

            <span className="text-xs text-gray-400 font-mono">
              (Pilot Readiness: <strong className="text-white font-bold">{summary.pilotReadinessPct}%</strong>)
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-4xl">
            <strong className="text-gray-300">DIAGNÓSTICO OPERACIONAL:</strong> Esta evaluación no habilita conexión real. Solo indica preparación conceptual antes de solicitar autorización formal del cliente. La calificación técnica actual refleja que las señales {isApto ? 'cumplen con las garantías de calidad necesarias para una fase de piloto seguro' : 'aún requieren mitigar desviaciones o autorizar fuentes'}.
          </p>
        </div>

        {/* Suggested Actions Button Column */}
        <div className="flex flex-col gap-2 flex-shrink-0 w-full lg:w-72">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Acciones Prioritarias</span>
          <div className="space-y-1.5 text-[11px] font-mono">
            <div className="p-2 bg-gray-950 border border-gray-800 rounded flex items-center justify-between hover:border-gray-700 transition-colors">
              <span className="text-gray-300">1. Confirmar tags SCADA</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="p-2 bg-gray-950 border border-gray-800 rounded flex items-center justify-between hover:border-gray-700 transition-colors">
              <span className="text-gray-300">2. Validar fuente de medición</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="p-2 bg-gray-950 border border-gray-800 rounded flex items-center justify-between hover:border-gray-700 transition-colors">
              <span className="text-gray-300">3. Solicitar aprobación cliente</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
