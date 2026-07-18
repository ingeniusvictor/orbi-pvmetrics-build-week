import { useState } from 'react';
import { PVMetricsCommercialImpactMockAssessment } from '../../types/pvmetrics-commercial-impact-mock.types';

type PVMetricsCommercialImpactExportBoxProps = {
  assessment: PVMetricsCommercialImpactMockAssessment;
};

export const PVMetricsCommercialImpactExportBox = ({
  assessment,
}: PVMetricsCommercialImpactExportBoxProps) => {
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
          COMMERCIAL IMPACT EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Textos copiables de impacto comercial mock
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Panel local para copiar reporte interno y resumen cliente. No usa
          precios reales, contratos reales, ERP, billing ni APIs de mercado.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Reporte interno comercial
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('internal', assessment.internalCommercialText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={assessment.internalCommercialText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen cliente
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('client', assessment.clientCommercialText)
              }
              className="rounded-xl border border-violet-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-violet-100 hover:bg-violet-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={assessment.clientCommercialText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota comercial
        </p>

        <p className="mt-2 text-sm text-amber-100">
          Este assessment es conceptual y no contractual. No representa
          facturación real, pérdida real ni ingreso real.
        </p>
      </div>
    </section>
  );
};
