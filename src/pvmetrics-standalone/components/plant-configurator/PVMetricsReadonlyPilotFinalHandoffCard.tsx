import { PVMetricsReadonlyPilotFinalHandoffPackage } from '../../types/pvmetrics-readonly-pilot-final-handoff.types';

type PVMetricsReadonlyPilotFinalHandoffCardProps = {
  handoff: PVMetricsReadonlyPilotFinalHandoffPackage;
};

const handoffTone = {
  blocked: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'draft-handoff': 'border-slate-500/30 bg-slate-900/60 text-slate-100',
  'ready-for-internal-review':
    'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'ready-for-client-handoff':
    'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
};

const itemStatusLabel = {
  complete: 'Completo',
  pending: 'Pendiente',
  warning: 'Advertencia',
  blocked: 'Bloqueado',
};

const categoryLabel = {
  scope: 'Alcance',
  'review-pack': 'Review pack',
  'go-no-go': 'Go/No-Go',
  'data-contract': 'Contrato datos',
  security: 'Seguridad',
  governance: 'Gobernanza',
  'client-action': 'Acción cliente',
  'orbi-action': 'Acción ORBI',
};

export const PVMetricsReadonlyPilotFinalHandoffCard = ({
  handoff,
}: PVMetricsReadonlyPilotFinalHandoffCardProps) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            READ-ONLY FINAL HANDOFF
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Paquete final de handoff read-only
          </h3>

          <p className="mt-2 max-w-4xl text-sm text-slate-400">
            {handoff.executiveSummary}
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${handoffTone[handoff.handoffStatus]}`}
        >
          <p className="text-xs uppercase tracking-wide">
            Estado handoff
          </p>
          <p className="mt-1 text-sm font-black uppercase">
            {handoff.handoffStatusLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Estado contractual heredado
          </p>
          <p className="mt-2 text-sm font-bold text-cyan-50">
            {handoff.inheritedContractStatusLabel}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Decisión Go/No-Go heredada
          </p>
          <p className="mt-2 text-sm font-bold text-emerald-50">
            {handoff.inheritedGoNoGoDecisionLabel}
          </p>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-violet-300">
            Readiness Score heredado
          </p>
          <p className="mt-2 text-2xl font-black text-violet-50">
            {handoff.inheritedReadinessScorePct}%
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total ítems', handoff.totalItems],
          ['Completos', handoff.completeItems],
          ['Pendientes', handoff.pendingItems],
          ['Advertencias', handoff.warningItems],
          ['Bloqueados', handoff.blockedItems],
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

      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
          Entregables preparados
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {handoff.preparedDeliverables.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-emerald-400/10 bg-slate-950/40 px-3 py-2 text-sm text-emerald-50"
            >
              • {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Ítem</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Requerido</th>
              <th className="px-3 py-2">Evidencia</th>
              <th className="px-3 py-2">Siguiente acción</th>
            </tr>
          </thead>

          <tbody>
            {handoff.handoffItems.map((item) => (
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
                  {itemStatusLabel[item.status]}
                </td>
                <td className="px-3 py-3">
                  {item.requiredForClientHandoff ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-3">
                  {item.evidence}
                </td>
                <td className="px-3 py-3">
                  {item.nextAction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Pendientes críticos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {handoff.criticalPendingItems.length ? (
              handoff.criticalPendingItems.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>• Sin pendientes críticos.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Pendientes recomendados
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {handoff.recommendedPendingItems.length ? (
              handoff.recommendedPendingItems.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>• Sin pendientes recomendados.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-orange-400/20 bg-orange-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
            Riesgos finales
          </p>
          <ul className="mt-3 space-y-2 text-sm text-orange-100">
            {handoff.finalRisks.length ? (
              handoff.finalRisks.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin riesgos finales relevantes.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Acciones antes de piloto
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50">
            {handoff.actionsBeforePilot.length ? (
              handoff.actionsBeforePilot.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>• Sin acciones adicionales antes de piloto conceptual.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Límites de seguridad
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {handoff.securityBoundaries.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-300"
            >
              • {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {handoff.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
