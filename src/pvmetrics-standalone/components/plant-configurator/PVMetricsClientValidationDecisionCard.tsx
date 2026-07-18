import React from 'react';
import { PVMetricsClientValidationDecisionSummary } from '../../types/pvmetrics-client-validation-decision.types';

type PVMetricsClientValidationDecisionCardProps = {
  summary: PVMetricsClientValidationDecisionSummary;
};

const statusLabel = {
  blocked: 'Bloqueado',
  'draft-review-required': 'Revisión requerida',
  'ready-for-client-validation': 'Listo para validación cliente',
  'ready-for-readonly-pilot-preparation':
    'Listo para preparar piloto read-only',
};

const decisionItemStatusLabel = {
  ok: 'OK',
  warning: 'Advertencia',
  blocked: 'Bloqueado',
};

export const PVMetricsClientValidationDecisionCard = ({
  summary,
}: PVMetricsClientValidationDecisionCardProps) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            CLIENT VALIDATION DECISION
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-50">
            {summary.decisionLabel}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {summary.executiveSummary}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Combined Readiness
          </p>
          <p className="text-3xl font-black text-cyan-100">
            {summary.combinedReadinessPct}%
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Gate Score', `${summary.gateScorePct}%`],
          ['Evidence Score', `${summary.evidenceScorePct}%`],
          ['Riesgo', summary.riskLevel],
          ['Bloqueantes', summary.blockingChecks],
          ['Estado', statusLabel[summary.decisionStatus]],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-lg font-bold text-slate-50">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {summary.decisionItems.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-semibold text-slate-100">
                {item.label}
              </h4>
              <span className="rounded-full border border-slate-600 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                {decisionItemStatusLabel[item.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Bloqueantes restantes
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {summary.remainingBlockers.length ? (
            summary.remainingBlockers.map((blocker) => (
              <li key={blocker}>• {blocker}</li>
            ))
          ) : (
            <li>• Sin bloqueantes críticos pendientes.</li>
          )}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Acciones recomendadas
        </p>
        <ul className="mt-3 space-y-2 text-sm text-cyan-50">
          {summary.recommendedNextActions.map((action) => (
            <li key={action}>• {action}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Límite de seguridad
        </p>
        <p className="mt-2 text-sm text-amber-100">
          {summary.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
