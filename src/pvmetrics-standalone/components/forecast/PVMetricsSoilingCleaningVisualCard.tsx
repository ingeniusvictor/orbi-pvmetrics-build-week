import { PVMetricsSoilingCleaningMockAssessment } from '../../types/pvmetrics-soiling-cleaning-mock.types';

type PVMetricsSoilingCleaningVisualCardProps = {
  assessment: PVMetricsSoilingCleaningMockAssessment;
};

const priorityTone = {
  low: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  medium: 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  high: 'border-orange-400/30 bg-orange-950/20 text-orange-100',
  critical: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
};

const statusTone = {
  monitor: 'text-emerald-300',
  'wait-for-rain': 'text-cyan-300',
  'review-cleaning': 'text-amber-300',
  'cleaning-recommended': 'text-orange-300',
  'blocked-by-safety': 'text-rose-300',
};

const factorTone = {
  favorable: 'text-emerald-300',
  neutral: 'text-slate-300',
  unfavorable: 'text-orange-300',
  blocking: 'text-rose-300',
};

const impactTone = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-orange-300',
  critical: 'text-rose-300',
};

export const PVMetricsSoilingCleaningVisualCard = ({
  assessment,
}: PVMetricsSoilingCleaningVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            SOILING & CLEANING OPTIMIZATION
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Recomendación conceptual de limpieza
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Evaluación mock de pérdida por suciedad, energía recuperable,
            retorno conceptual de limpieza e impacto sobre forecast, performance,
            accuracy y O&M.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${priorityTone[assessment.cleaningPriority]}`}
        >
          <p className="text-xs uppercase tracking-wide">Prioridad</p>
          <p className="mt-1 text-lg font-black uppercase">
            {assessment.cleaningPriorityLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Estado de recomendación
          </p>
          <p
            className={`mt-2 text-xl font-black uppercase ${statusTone[assessment.recommendationStatus]}`}
          >
            {assessment.recommendationStatusLabel}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Fuente de soiling
          </p>
          <p className="mt-2 text-xl font-black text-slate-50">
            {assessment.sourceLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Pérdida soiling', `${assessment.kpis.estimatedSoilingLossPct}%`],
          ['Pérdida energía', `${assessment.kpis.estimatedEnergyLossMwh} MWh`],
          [
            'Energía recuperable',
            `${assessment.kpis.estimatedRecoveredEnergyMwh} MWh`,
          ],
          ['Payback Index', assessment.kpis.cleaningPaybackIndex],
          ['Dust Risk Index', assessment.kpis.dustRiskIndex],
          ['Rain Recovery', `${assessment.kpis.rainRecoveryFactorPct}%`],
          ['Impacto forecast', `${assessment.kpis.forecastImpactPct}%`],
          ['Confianza inspección', `${assessment.kpis.inspectionConfidencePct}%`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Factores de decisión
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Factor</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Valor</th>
              <th className="px-3 py-2">Explicación</th>
            </tr>
          </thead>

          <tbody>
            {assessment.decisionFactors.map((item) => (
              <tr
                key={item.factor}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td className={`px-3 py-3 font-semibold ${factorTone[item.status]}`}>
                  {item.status}
                </td>
                <td className="px-3 py-3">{item.valueLabel}</td>
                <td className="px-3 py-3">{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Impactos evaluados
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Área</th>
              <th className="px-3 py-2">Nivel</th>
              <th className="px-3 py-2">Explicación</th>
            </tr>
          </thead>

          <tbody>
            {assessment.impacts.map((item) => (
              <tr
                key={item.area}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td
                  className={`px-3 py-3 font-semibold ${impactTone[item.impactLevel]}`}
                >
                  {item.impactLevel}
                </td>
                <td className="px-3 py-3">{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-blue-400/20 bg-blue-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
            Notas interpretativas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-blue-100">
            {assessment.interpretationNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Recomendaciones O&M
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100">
            {assessment.omRecommendations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Notas cliente
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-100">
            {assessment.clientNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Advertencias de seguridad
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {assessment.safetyWarnings.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {assessment.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
