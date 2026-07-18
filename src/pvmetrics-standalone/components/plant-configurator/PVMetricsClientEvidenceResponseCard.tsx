import React from 'react';
import { PVMetricsClientEvidenceResponseEvaluation } from '../../types/pvmetrics-client-evidence-response.types';

type PVMetricsClientEvidenceResponseCardProps = {
  evaluation: PVMetricsClientEvidenceResponseEvaluation;
};

export const PVMetricsClientEvidenceResponseCard = ({
  evaluation,
}: PVMetricsClientEvidenceResponseCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            CLIENT EVIDENCE RESPONSE
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-50">
            {evaluation.readinessLabel}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {evaluation.executiveNote}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Evidence Score
          </p>
          <p className="text-3xl font-black text-emerald-100">
            {evaluation.evidenceScorePct}%
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[
          ['Total', evaluation.totalItems],
          ['Recibidas', evaluation.receivedItems],
          ['Parciales', evaluation.partiallyValidItems],
          ['Rechazadas', evaluation.rejectedItems],
          ['Pendientes', evaluation.pendingItems],
          ['Bloqueantes', evaluation.blockingPendingItems],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-50">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Próximas acciones
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {evaluation.nextActions.length ? (
            evaluation.nextActions.map((action) => (
              <li key={action}>• {action}</li>
            ))
          ) : (
            <li>• No hay acciones pendientes relevantes.</li>
          )}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Límite de seguridad
        </p>
        <p className="mt-2 text-sm text-amber-100">
          {evaluation.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
