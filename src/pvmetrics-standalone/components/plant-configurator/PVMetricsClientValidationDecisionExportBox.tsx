import React, { useState } from 'react';
import { PVMetricsClientValidationDecisionSummary } from '../../types/pvmetrics-client-validation-decision.types';

type PVMetricsClientValidationDecisionExportBoxProps = {
  summary: PVMetricsClientValidationDecisionSummary;
};

export const PVMetricsClientValidationDecisionExportBox = ({
  summary,
}: PVMetricsClientValidationDecisionExportBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'internal' | 'client' | null
  >(null);

  const handleCopy = async (
    target: 'internal' | 'client',
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
          DECISION EXPORT
        </p>
        <h3 className="text-xl font-bold text-slate-50">
          Resumen copiable de decisión
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Texto local para comité interno o seguimiento cliente. No envía, no guarda y no exporta archivos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Comité interno
            </h4>
            <button
              type="button"
              onClick={() =>
                handleCopy('internal', summary.internalCommitteeText)
              }
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={summary.internalCommitteeText}
            className="mt-3 h-80 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Seguimiento cliente
            </h4>
            <button
              type="button"
              onClick={() =>
                handleCopy('client', summary.clientFollowUpText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={summary.clientFollowUpText}
            className="mt-3 h-80 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota
        </p>
        <p className="mt-2 text-sm text-amber-100">
          Este resumen no constituye certificación oficial ni autorización de conexión real. Debe ser revisado por un responsable humano.
        </p>
      </div>
    </section>
  );
};
