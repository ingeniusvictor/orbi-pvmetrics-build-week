import React from 'react';
import { PVMetricsReadonlyPilotReviewPack } from '../../types/pvmetrics-readonly-pilot-review-pack.types';

type PVMetricsReadonlyPilotReviewPackCardProps = {
  reviewPack: PVMetricsReadonlyPilotReviewPack;
};

const priorityLabel = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const statusLabel = {
  'pending-client-confirmation': 'Pendiente cliente',
  confirmed: 'Confirmado',
  'requires-clarification': 'Requiere aclaración',
  'not-applicable': 'No aplica',
};

const categoryLabel = {
  'signal-availability': 'Disponibilidad señal',
  'source-system': 'Sistema fuente',
  'read-only-access': 'Acceso read-only',
  'data-quality': 'Calidad de datos',
  bess: 'BESS',
  security: 'Seguridad',
  governance: 'Gobernanza',
};

export const PVMetricsReadonlyPilotReviewPackCard = ({
  reviewPack,
}: PVMetricsReadonlyPilotReviewPackCardProps) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            READ-ONLY PILOT REVIEW PACK
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Checklist de revisión cliente
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Paquete local para validar señales, fuentes, confirmaciones read-only y gobernanza antes de preparar cualquier piloto.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Total ítems
          </p>
          <p className="mt-1 text-3xl font-black text-cyan-100">
            {reviewPack.totalItems}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {[
          ['Críticos', reviewPack.criticalItems],
          ['Altos', reviewPack.highItems],
          ['Medios', reviewPack.mediumItems],
          ['Bajos', reviewPack.lowItems],
          ['BESS', reviewPack.bessItems],
          ['Bloqueantes', reviewPack.blockingItems],
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

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Ítem</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Prioridad</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Bloquea</th>
              <th className="px-3 py-2">Pregunta cliente</th>
            </tr>
          </thead>

          <tbody>
            {reviewPack.items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td className="px-3 py-3">
                  {categoryLabel[item.category]}
                </td>
                <td className="px-3 py-3">
                  {priorityLabel[item.priority]}
                </td>
                <td className="px-3 py-3">
                  {statusLabel[item.status]}
                </td>
                <td className="px-3 py-3">
                  {item.blocksReadonlyPreparation ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-3">
                  {item.questionForClient}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Señales obligatorias
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {reviewPack.mandatorySignalSummary.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Señales recomendadas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50">
            {reviewPack.recommendedSignalSummary.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Señales opcionales
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {reviewPack.optionalSignalSummary.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Confirmaciones read-only
        </p>
        <ul className="mt-3 space-y-2 text-sm text-amber-100">
          {reviewPack.readOnlyConfirmations.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Límite de seguridad
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {reviewPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
