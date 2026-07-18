import React from 'react';
import { PVMetricsReadonlyPilotScope } from '../../types/pvmetrics-readonly-pilot-scope.types';

type PVMetricsReadonlyPilotScopeCardProps = {
  scope: PVMetricsReadonlyPilotScope;
};

const priorityLabel = {
  mandatory: 'Obligatoria',
  recommended: 'Recomendada',
  optional: 'Opcional',
};

const statusTone = {
  blocked: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'draft-scope': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'ready-for-client-review': 'border-cyan-400/30 bg-cyan-950/20 text-cyan-100',
  'ready-for-readonly-preparation':
    'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
};

export const PVMetricsReadonlyPilotScopeCard = ({
  scope,
}: PVMetricsReadonlyPilotScopeCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            READ-ONLY PILOT SCOPE
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Alcance conceptual de piloto read-only
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {scope.executiveSummary}
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${statusTone[scope.status]}`}
        >
          <p className="text-xs uppercase tracking-wide">
            Estado del alcance
          </p>
          <p className="mt-1 text-sm font-black uppercase">
            {scope.statusLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total señales', scope.signalCount],
          ['Obligatorias', scope.mandatorySignals],
          ['Recomendadas', scope.recommendedSignals],
          ['Opcionales', scope.optionalSignals],
          ['BESS', scope.bessSignals],
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
              <th className="px-3 py-2">Señal</th>
              <th className="px-3 py-2">Dominio</th>
              <th className="px-3 py-2">Prioridad</th>
              <th className="px-3 py-2">Unidad</th>
              <th className="px-3 py-2">Fuente esperada</th>
              <th className="px-3 py-2">Motivo</th>
            </tr>
          </thead>

          <tbody>
            {scope.signals.map((signal) => (
              <tr
                key={signal.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {signal.label}
                </td>
                <td className="px-3 py-3">{signal.domain}</td>
                <td className="px-3 py-3">
                  {priorityLabel[signal.priority]}
                </td>
                <td className="px-3 py-3">{signal.unit}</td>
                <td className="px-3 py-3">{signal.expectedSource}</td>
                <td className="px-3 py-3">{signal.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Fuera de alcance
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {scope.outOfScopeItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Criterios previos a conexión real
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50">
            {scope.preConnectionCriteria.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Límite de seguridad
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {scope.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
