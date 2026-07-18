import { useState } from 'react';
import { PVMetricsSolarForecastSummary } from '../../types/pvmetrics-solar-forecast-summary.types';

type PVMetricsSolarForecastExportBoxProps = {
  summary: PVMetricsSolarForecastSummary;
};

export const PVMetricsSolarForecastExportBox = ({
  summary,
}: PVMetricsSolarForecastExportBoxProps) => {
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
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl" id="pvmetrics-solar-forecast-export-box">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          SOLAR FORECAST EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Textos copiables del forecast solar mock
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Panel local para copiar el resumen interno y el texto cliente. No envía correos, no guarda datos y no exporta archivos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Forecast interno
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('internal', summary.internalForecastText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10 cursor-pointer"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={summary.internalForecastText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Forecast cliente
            </h4>

            <button
              type="button"
              onClick={() =>
                handleCopy('client', summary.clientForecastText)
              }
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10 cursor-pointer"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={summary.clientForecastText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota de uso
        </p>

        <p className="mt-2 text-sm text-amber-100">
          Este resultado es mock y conceptual. No corresponde a forecast real, no se envía al CEN, no usa SCADA y no debe usarse como instrucción operacional.
        </p>
      </div>
    </section>
  );
};
