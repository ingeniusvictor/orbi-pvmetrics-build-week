import { PVMetricsCommercialImpactMockAssessment } from '../../types/pvmetrics-commercial-impact-mock.types';

type PVMetricsCommercialImpactVisualCardProps = {
  assessment: PVMetricsCommercialImpactMockAssessment;
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

const statusTone = {
  'mock-monitoring': 'text-emerald-300',
  'mock-review-required': 'text-amber-300',
  'mock-high-exposure': 'text-orange-300',
  'mock-critical-exposure': 'text-rose-300',
  'blocked-by-data-quality': 'text-red-300',
};

const formatUsd = (value: number) =>
  `${value.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })} USD`;

export const PVMetricsCommercialImpactVisualCard = ({
  assessment,
}: PVMetricsCommercialImpactVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-violet-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
            COMMERCIAL IMPACT & REVENUE RISK
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Impacto comercial mock
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Evaluación conceptual de exposición comercial asociada a forecast,
            disponibilidad, soiling, curtailment y calidad de datos. No usa
            precios reales, contratos reales ni facturación.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${riskTone[assessment.overallRiskLevel]}`}
        >
          <p className="text-xs uppercase tracking-wide">Riesgo general</p>
          <p className="mt-1 text-lg font-black uppercase">
            {assessment.overallRiskLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Estado comercial
        </p>
        <p
          className={`mt-2 text-xl font-black uppercase ${statusTone[assessment.assessmentStatus]}`}
        >
          {assessment.assessmentStatusLabel}
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Energía perdida', `${assessment.kpis.estimatedLostEnergyMwh} MWh`],
          ['Precio mock', `${assessment.kpis.mockEnergyPriceUsdMwh} USD/MWh`],
          ['Riesgo ingreso', formatUsd(assessment.kpis.estimatedRevenueRiskUsd)],
          [
            'Oportunidad recuperable',
            formatUsd(assessment.kpis.recoverableRevenueOpportunityUsd),
          ],
          [
            'Forecast error',
            formatUsd(assessment.kpis.forecastErrorExposureUsd),
          ],
          ['Disponibilidad', formatUsd(assessment.kpis.availabilityImpactUsd)],
          ['Soiling', formatUsd(assessment.kpis.soilingImpactUsd)],
          ['Curtailment', formatUsd(assessment.kpis.curtailmentImpactUsd)],
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

      <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
          Riesgo por calidad de datos
        </p>
        <p className="mt-1 text-2xl font-bold text-red-100">
          {formatUsd(assessment.kpis.dataQualityRiskUsd)}
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Supuestos comerciales mock
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Supuesto</th>
              <th className="px-3 py-2">Valor</th>
              <th className="px-3 py-2">Mock</th>
              <th className="px-3 py-2">Explicación</th>
            </tr>
          </thead>

          <tbody>
            {assessment.assumptions.map((item) => (
              <tr
                key={item.assumptionType}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td className="px-3 py-3">{item.valueLabel}</td>
                <td className="px-3 py-3 font-semibold text-emerald-300">
                  Sí
                </td>
                <td className="px-3 py-3">{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Breakdown por causa técnica
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Causa</th>
              <th className="px-3 py-2">Energía</th>
              <th className="px-3 py-2">Valor mock</th>
              <th className="px-3 py-2">Contribución</th>
              <th className="px-3 py-2">Riesgo</th>
              <th className="px-3 py-2">Explicación</th>
            </tr>
          </thead>

          <tbody>
            {assessment.causeBreakdown.map((item) => (
              <tr
                key={`${item.source}-${item.metric}`}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td className="px-3 py-3">{item.estimatedEnergyMwh} MWh</td>
                <td className="px-3 py-3">
                  {formatUsd(item.estimatedValueUsd)}
                </td>
                <td className="px-3 py-3">{item.contributionPct}%</td>
                <td
                  className={`px-3 py-3 font-semibold ${riskText[item.riskLevel]}`}
                >
                  {item.riskLevel}
                </td>
                <td className="px-3 py-3">{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Impactos comerciales evaluables
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Área</th>
              <th className="px-3 py-2">Riesgo</th>
              <th className="px-3 py-2">Valor</th>
              <th className="px-3 py-2">Acción sugerida</th>
            </tr>
          </thead>

          <tbody>
            {assessment.impactAssessments.map((item) => (
              <tr
                key={item.area}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td
                  className={`px-3 py-3 font-semibold ${riskText[item.riskLevel]}`}
                >
                  {item.riskLevel}
                </td>
                <td className="px-3 py-3">{item.valueLabel}</td>
                <td className="px-3 py-3">{item.recommendedAction}</td>
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
            Advertencias de calidad de datos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {assessment.dataQualityWarnings.map((item) => (
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
