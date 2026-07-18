import { useState } from 'react';
import { PVMetricsSoilingCleaningMockAssessment } from '../../types/pvmetrics-soiling-cleaning-mock.types';

type PVMetricsSoilingCleaningExportBoxProps = {
  assessment: PVMetricsSoilingCleaningMockAssessment;
};

export const PVMetricsSoilingCleaningExportBox = ({
  assessment,
}: PVMetricsSoilingCleaningExportBoxProps) => {
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          SOILING & CLEANING EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Textos copiables de soiling y limpieza mock
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Panel local para copiar reporte interno O&M y resumen cliente. No crea
          órdenes de limpieza, no envía correos y no exporta archivos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Reporte interno O&M
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('internal', assessment.internalSoilingText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={assessment.internalSoilingText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen cliente
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('client', assessment.clientSoilingText)
              }
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={assessment.clientSoilingText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota de seguridad
        </p>

        <p className="mt-2 text-sm text-amber-100">
          Este assessment es conceptual. No usa sensores reales, no lee
          piranómetros, no conecta SCADA y no crea órdenes de limpieza reales.
        </p>
      </div>
    </section>
  );
};
