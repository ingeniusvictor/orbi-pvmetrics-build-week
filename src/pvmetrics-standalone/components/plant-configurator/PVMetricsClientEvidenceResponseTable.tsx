import React from 'react';
import {
  PVMetricsClientEvidenceQuality,
  PVMetricsClientEvidenceResponseDataset,
  PVMetricsClientEvidenceStatus,
} from '../../types/pvmetrics-client-evidence-response.types';

type PVMetricsClientEvidenceResponseTableProps = {
  dataset: PVMetricsClientEvidenceResponseDataset;
  onUpdateItem: (
    itemId: string,
    patch: Partial<{
      status: PVMetricsClientEvidenceStatus;
      quality: PVMetricsClientEvidenceQuality;
      simulatedEvidenceLabel: string;
      reviewerNote: string;
    }>,
  ) => void;
};

const evidenceStatusOptions: PVMetricsClientEvidenceStatus[] = [
  'requested',
  'received',
  'partially-valid',
  'rejected',
  'not-required',
];

const evidenceQualityOptions: PVMetricsClientEvidenceQuality[] = [
  'not-reviewed',
  'low',
  'medium',
  'high',
  'official',
];

export const PVMetricsClientEvidenceResponseTable = ({
  dataset,
  onUpdateItem,
}: PVMetricsClientEvidenceResponseTableProps) => {
  return (
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          EVIDENCE RESPONSE TABLE
        </p>
        <h3 className="text-xl font-bold text-slate-50">
          Evidencias recibidas / simuladas
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Marca localmente el estado de cada evidencia. Esto no guarda ni sube documentos.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Solicitud</th>
              <th className="px-3 py-2">Prioridad</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Calidad</th>
              <th className="px-3 py-2">Evidencia</th>
              <th className="px-3 py-2">Nota</th>
            </tr>
          </thead>
          <tbody>
            {dataset.items.map((item) => (
              <tr
                key={item.id}
                className="rounded-2xl bg-slate-900/70 text-slate-200"
              >
                <td className="max-w-xs rounded-l-2xl px-3 py-3">
                  <p className="font-semibold">{item.title}</p>
                  {item.blocksReadonlyPilot && (
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-rose-300">
                      Bloquea piloto read-only
                    </p>
                  )}
                </td>

                <td className="px-3 py-3 text-slate-400">{item.priority}</td>

                <td className="px-3 py-3">
                  <select
                    value={item.status}
                    onChange={(event) =>
                      onUpdateItem(item.id, {
                        status: event.target.value as PVMetricsClientEvidenceStatus,
                      })
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                  >
                    {evidenceStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-3 py-3">
                  <select
                    value={item.quality}
                    onChange={(event) =>
                      onUpdateItem(item.id, {
                        quality: event.target.value as PVMetricsClientEvidenceQuality,
                      })
                    }
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                  >
                    {evidenceQualityOptions.map((quality) => (
                      <option key={quality} value={quality}>
                        {quality}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-3 py-3">
                  <input
                    value={item.simulatedEvidenceLabel}
                    onChange={(event) =>
                      onUpdateItem(item.id, {
                        simulatedEvidenceLabel: event.target.value,
                      })
                    }
                    placeholder="Ej: Ficha técnica recibida"
                    className="w-52 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                  />
                </td>

                <td className="rounded-r-2xl px-3 py-3">
                  <input
                    value={item.reviewerNote}
                    onChange={(event) =>
                      onUpdateItem(item.id, {
                        reviewerNote: event.target.value,
                      })
                    }
                    placeholder="Nota interna"
                    className="w-64 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
