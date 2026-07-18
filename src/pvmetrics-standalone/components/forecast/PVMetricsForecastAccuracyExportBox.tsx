import { useState } from 'react';
import { PVMetricsForecastAccuracyMockAssessment } from '../../types/pvmetrics-forecast-accuracy-mock.types';

type PVMetricsForecastAccuracyExportBoxProps = {
  assessment: PVMetricsForecastAccuracyMockAssessment;
};

export const PVMetricsForecastAccuracyExportBox = ({
  assessment,
}: PVMetricsForecastAccuracyExportBoxProps) => {
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
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl" id="pvmetrics-forecast-accuracy-export-box">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
          FORECAST ACCURACY EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Textos copiables de precisión forecast mock
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Panel local para copiar el reporte técnico interno y el resumen cliente.
          No calcula precisión real, no guarda datos, no envía correos y no exporta archivos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Reporte interno de precisión
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('internal', assessment.internalAccuracyText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10 cursor-pointer"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={assessment.internalAccuracyText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300 focus:outline-none"
          />
        </article>

        <article className="rounded-2xl border border-blue-400/20 bg-blue-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen cliente
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('client', assessment.clientAccuracyText)
              }
              className="rounded-xl border border-blue-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 hover:bg-blue-400/10 cursor-pointer"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={assessment.clientAccuracyText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300 focus:outline-none"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota de precisión
        </p>

        <p className="mt-2 text-sm text-amber-100">
          Este assessment es conceptual. No representa desempeño real de planta,
          no usa SCADA, no lee medidores reales, no usa API meteorológica y no debe
          usarse como reporte oficial de precisión.
        </p>
      </div>
    </section>
  );
};
