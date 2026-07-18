import React from 'react';
import { PVMetricsReadonlyPilotGoNoGoChecklist } from '../../types/pvmetrics-readonly-pilot-gonogo.types';

type PVMetricsReadonlyPilotGoNoGoCardProps = {
  checklist: PVMetricsReadonlyPilotGoNoGoChecklist;
};

const decisionTone = {
  go: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  'conditional-go': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'no-go': 'border-rose-400/30 bg-rose-950/20 text-rose-100',
};

const statusLabel = {
  pass: 'OK',
  warning: 'Advertencia',
  fail: 'Falla',
  'not-applicable': 'No aplica',
};

const categoryLabel = {
  signals: 'Señales',
  bess: 'BESS',
  'read-only-access': 'Acceso read-only',
  security: 'Seguridad',
  governance: 'Gobernanza',
  'data-quality': 'Calidad de datos',
  'safety-boundary': 'Límite seguridad',
};

export const PVMetricsReadonlyPilotGoNoGoCard = ({
  checklist,
}: PVMetricsReadonlyPilotGoNoGoCardProps) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            READ-ONLY PILOT GO/NO-GO
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Checklist de decisión read-only
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Evaluación local y conceptual para decidir si el alcance puede pasar a preparación técnica read-only.
          </p>
        </div>

        <div className={`rounded-2xl border px-5 py-4 text-center ${decisionTone[checklist.decision]}`}>
          <p className="text-xs uppercase tracking-wide">Decisión</p>
          <p className="mt-1 text-sm font-black uppercase">
            {checklist.decisionLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {[
          ['Readiness', `${checklist.readinessScorePct}%`],
          ['Total checks', checklist.totalChecks],
          ['OK', checklist.passChecks],
          ['Warnings', checklist.warningChecks],
          ['Fallos', checklist.failChecks],
          ['Bloqueantes', checklist.blockingChecks],
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

      {checklist.bessChecks > 0 && (
        <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Checks BESS activos
          </p>
          <p className="mt-2 text-sm text-violet-100">
            El alcance incluye {checklist.bessChecks} check(s) específicos asociados a almacenamiento BESS bajo límites estrictamente read-only.
          </p>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Check</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Requerido</th>
              <th className="px-3 py-2">Bloquea</th>
              <th className="px-3 py-2">Evidencia</th>
              <th className="px-3 py-2">Recomendación</th>
            </tr>
          </thead>

          <tbody>
            {checklist.checks.map((check) => (
              <tr
                key={check.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {check.label}
                </td>
                <td className="px-3 py-3">
                  {categoryLabel[check.category]}
                </td>
                <td className="px-3 py-3">
                  {statusLabel[check.status]}
                </td>
                <td className="px-3 py-3">
                  {check.requiredForGo ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-3">
                  {check.blocksGo ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-3">
                  {check.evidence}
                </td>
                <td className="px-3 py-3">
                  {check.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Bloqueantes
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {checklist.blockers.length ? (
              checklist.blockers.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin bloqueantes activos.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Riesgos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {checklist.risks.length ? (
              checklist.risks.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin riesgos relevantes activos.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Acciones requeridas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50">
            {checklist.requiredActions.length ? (
              checklist.requiredActions.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin acciones requeridas.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Límite de seguridad
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {checklist.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
