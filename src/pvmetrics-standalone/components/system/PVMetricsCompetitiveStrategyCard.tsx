import { PV_METRICS_SUNCAST_COMPETITIVE_GAP_REGISTER } from '../../data/pvMetricsSuncastCompetitiveGapRegister';

const priorityLabel = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  future: 'Futura',
};

const statusLabel = {
  missing: 'Falta',
  partial: 'Parcial',
  planned: 'Planificado',
  covered: 'Cubierto',
  differentiator: 'Diferenciador',
};

export const PVMetricsCompetitiveStrategyCard = () => {
  const register = PV_METRICS_SUNCAST_COMPETITIVE_GAP_REGISTER;

  return (
    <section className="rounded-3xl border border-amber-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            COMPETITIVE STRATEGY LOCK
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            {register.strategyTitle}
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            {register.strategyStatement}
          </p>

          <p className="mt-2 max-w-5xl text-sm font-semibold text-amber-100">
            {register.positioningStatement}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-amber-300">
            Referente competitivo
          </p>
          <p className="mt-1 text-lg font-black text-amber-100">
            {register.competitorReference}
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Área</th>
              <th className="px-3 py-2">Capacidad competidor</th>
              <th className="px-3 py-2">Estado ORBI</th>
              <th className="px-3 py-2">Prioridad</th>
              <th className="px-3 py-2">Objetivo ORBI</th>
              <th className="px-3 py-2">Módulo recomendado</th>
            </tr>
          </thead>

          <tbody>
            {register.competitiveGaps.map((gap) => (
              <tr
                key={gap.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {gap.area}
                </td>
                <td className="px-3 py-3">{gap.competitorCapability}</td>
                <td className="px-3 py-3">{statusLabel[gap.orbiCurrentStatus]}</td>
                <td className="px-3 py-3">{priorityLabel[gap.priority]}</td>
                <td className="px-3 py-3">{gap.orbiTargetCapability}</td>
                <td className="px-3 py-3 font-semibold text-cyan-200">
                  {gap.recommendedModule}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Diferenciadores ORBI
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100">
            {register.differentiators.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Roadmap competitivo recomendado
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50">
            {register.recommendedRoadmap.map((item) => (
              <li key={item.id}>
                • <strong>{item.module}</strong> — {item.title}: {item.objective}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Límites de seguridad
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-rose-100 md:grid-cols-2">
          {register.safetyBoundaries.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
