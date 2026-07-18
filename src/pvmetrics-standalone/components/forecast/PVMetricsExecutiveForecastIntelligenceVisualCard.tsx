import { PVMetricsExecutiveForecastIntelligenceSummary } from '../../types/pvmetrics-executive-forecast-intelligence.types';

type PVMetricsExecutiveForecastIntelligenceVisualCardProps = {
  summary: PVMetricsExecutiveForecastIntelligenceSummary;
};

const riskTone = {
  low: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  medium: 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  high: 'border-orange-400/30 bg-orange-950/20 text-orange-100',
  critical: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'not-evaluable': 'border-slate-400/30 bg-slate-900/40 text-slate-100',
};

const riskText = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-orange-300',
  critical: 'text-rose-300',
  'not-evaluable': 'text-slate-300',
};

const priorityTone = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-orange-300',
  critical: 'text-rose-300',
};

const readinessTone = {
  'mock-ready': 'text-emerald-300',
  'review-required': 'text-amber-300',
  'data-quality-review': 'text-orange-300',
  'commercial-review': 'text-violet-300',
  blocked: 'text-rose-300',
};

const formatUsd = (value: number) =>
  `${value.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })} USD`;

export const PVMetricsExecutiveForecastIntelligenceVisualCard = ({
  summary,
}: PVMetricsExecutiveForecastIntelligenceVisualCardProps) => {
  const { kpiSnapshot } = summary;

  return (
    <section className="rounded-3xl border border-fuchsia-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
            EXECUTIVE FORECAST INTELLIGENCE
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Resumen ejecutivo integrado
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Lectura ejecutiva mock que consolida forecast, cumplimiento
            conceptual, eventos operacionales, accuracy, soiling e impacto
            comercial. No usa datos reales ni activa acciones operativas.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${riskTone[summary.overallRiskLevel]}`}
        >
          <p className="text-xs uppercase tracking-wide">Riesgo general</p>
          <p className="text-xs uppercase tracking-wide mt-1 text-lg font-black uppercase">
            {summary.overallRiskLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-950/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">
            Headline ejecutivo
          </p>
          <p className="mt-2 text-xl font-black text-slate-50">
            {summary.executiveHeadline}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {summary.executiveConclusion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Readiness
          </p>
          <p
            className={`mt-2 text-xl font-black uppercase ${readinessTone[summary.readinessStatus]}`}
          >
            {summary.readinessStatusLabel}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Generado: {summary.generatedAtLabel}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Planta: {summary.plantName} ({summary.plantCode})
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Forecast Energy', `${kpiSnapshot.forecastEnergyMwh} MWh`],
          ['Compliance Score', `${kpiSnapshot.complianceScorePct}%`],
          ['Eventos activos', kpiSnapshot.activeOperationalEvents],
          ['Forecast MAPE', `${kpiSnapshot.forecastMapePct}%`],
          ['Error explicado', `${kpiSnapshot.eventExplainedErrorPct}%`],
          ['Soiling Loss', `${kpiSnapshot.soilingLossPct}%`],
          ['Revenue Risk', formatUsd(kpiSnapshot.commercialRevenueRiskUsd)],
          ['Oportunidad', formatUsd(kpiSnapshot.recoverableOpportunityUsd)],
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
          Insights integrados
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Sección</th>
              <th className="px-3 py-2">Insight</th>
              <th className="px-3 py-2">Riesgo</th>
              <th className="px-3 py-2">Señal</th>
              <th className="px-3 py-2">Acción</th>
            </tr>
          </thead>

          <tbody>
            {summary.insights.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.section}
                </td>
                <td className="px-3 py-3">
                  <p className="font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.message}</p>
                </td>
                <td
                  className={`px-3 py-3 font-semibold ${riskText[item.riskLevel]}`}
                >
                  {item.riskLevel}
                </td>
                <td className="px-3 py-3 text-xs text-fuchsia-200">
                  {item.decisionSignal}
                </td>
                <td className="px-3 py-3">{item.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Prioridades ejecutivas
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Prioridad</th>
              <th className="px-3 py-2">Título</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Razón</th>
              <th className="px-3 py-2">Próximo paso</th>
            </tr>
          </thead>

          <tbody>
            {summary.priorities.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td
                  className={`px-3 py-3 font-semibold uppercase ${priorityTone[item.priority]}`}
                >
                  {item.priority}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.title}
                </td>
                <td className="px-3 py-3">{item.ownerHint}</td>
                <td className="px-3 py-3">{item.reason}</td>
                <td className="px-3 py-3">{item.recommendedNextStep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {summary.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
