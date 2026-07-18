import React, { useMemo, useState } from 'react';
import { PVMetricsReadonlyPilotGoNoGoChecklist } from '../../types/pvmetrics-readonly-pilot-gonogo.types';

type PVMetricsReadonlyPilotGoNoGoExportBoxProps = {
  checklist: PVMetricsReadonlyPilotGoNoGoChecklist;
};

export const PVMetricsReadonlyPilotGoNoGoExportBox = ({
  checklist,
}: PVMetricsReadonlyPilotGoNoGoExportBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'summary' | 'actions' | null>(
    null,
  );

  const actionPlanText = useMemo(
    () =>
      [
        'ORBI PVMetrics IA — Read-Only Pilot Go/No-Go Action Plan',
        `Planta: ${checklist.plantName} (${checklist.plantCode})`,
        `Decisión: ${checklist.decisionLabel}`,
        `Readiness Score: ${checklist.readinessScorePct}%`,
        '',
        'Acciones requeridas:',
        checklist.requiredActions.length
          ? checklist.requiredActions.map((item) => `- ${item}`).join('\n')
          : '- Sin acciones requeridas.',
        '',
        'Bloqueantes:',
        checklist.blockers.length
          ? checklist.blockers.map((item) => `- ${item}`).join('\n')
          : '- Sin bloqueantes activos.',
        '',
        'Riesgos:',
        checklist.risks.length
          ? checklist.risks.map((item) => `- ${item}`).join('\n')
          : '- Sin riesgos relevantes activos.',
        '',
        'Límite de seguridad:',
        checklist.safetyBoundary,
      ].join('\n'),
    [checklist],
  );

  const handleCopy = async (
    target: 'summary' | 'actions',
    value: string,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          GO/NO-GO EXPORT
        </p>
        <h3 className="text-xl font-bold text-slate-50">
          Resumen copiable Go/No-Go
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Panel local para copiar el resumen interno y el plan de acciones. No envía correos, no guarda y no exporta archivos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen interno
            </h4>
            <button
              type="button"
              onClick={() =>
                handleCopy('summary', checklist.internalSummaryText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'summary' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={checklist.internalSummaryText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Plan de acciones
            </h4>
            <button
              type="button"
              onClick={() => handleCopy('actions', actionPlanText)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'actions' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={actionPlanText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota de uso
        </p>
        <p className="mt-2 text-sm text-amber-100">
          El resultado Go/No-Go es una evaluación local conceptual. No autoriza conexión real ni reemplaza aprobación técnica humana.
        </p>
      </div>
    </section>
  );
};
