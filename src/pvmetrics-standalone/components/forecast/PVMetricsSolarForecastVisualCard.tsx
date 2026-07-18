import { PVMetricsSolarForecastMockSeries } from '../../types/pvmetrics-solar-forecast-mock.types';
import { PVMetricsSolarForecastSummary } from '../../types/pvmetrics-solar-forecast-summary.types';

type PVMetricsSolarForecastVisualCardProps = {
  series: PVMetricsSolarForecastMockSeries;
  summary: PVMetricsSolarForecastSummary;
};

const riskTone = {
  low: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  medium: 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  high: 'border-orange-400/30 bg-orange-950/20 text-orange-100',
  critical: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
};

const riskLabel = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico',
};

const conditionLabel = {
  clear: 'Despejado',
  'partly-cloudy': 'Parcial nublado',
  cloudy: 'Nublado',
  'high-temperature': 'Alta temperatura',
  unstable: 'Inestable',
};

export const PVMetricsSolarForecastVisualCard = ({
  series,
  summary,
}: PVMetricsSolarForecastVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 shadow-2xl" id="pvmetrics-solar-forecast-visual-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            ORBI SOLAR FORECAST IA
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Forecast solar mock explicativo
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            {summary.executiveSummary}
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${riskTone[summary.riskLevel]}`}
        >
          <p className="text-xs uppercase tracking-wide">Riesgo forecast</p>
          <p className="mt-1 text-lg font-black uppercase">
            {riskLabel[summary.riskLevel]}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Energía forecast', `${summary.kpis.totalForecastEnergyMwh} MWh`],
          ['Peak esperado', `${summary.kpis.peakForecastPowerMw} MW`],
          ['Confianza promedio', `${summary.kpis.averageConfidencePct}%`],
          ['Confianza mínima', `${summary.kpis.lowestConfidencePct}%`],
          ['Readiness', `${summary.kpis.forecastReadinessPct}%`],
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

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Pérdida clima', `${summary.kpis.estimatedWeatherLossPct}%`],
          [
            'Pérdida disponibilidad',
            `${summary.kpis.estimatedAvailabilityLossPct}%`,
          ],
          ['Pérdida soiling', `${summary.kpis.estimatedSoilingLossPct}%`],
          ['Influencia BESS', `${summary.kpis.estimatedBessInfluencePct}%`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-cyan-400/10 bg-cyan-950/10 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-cyan-300">
              {label}
            </p>
            <p className="mt-1 text-xl font-bold text-cyan-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Explicación técnica conceptual
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {summary.technicalExplanation}
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Hora</th>
              <th className="px-3 py-2">Potencia MW</th>
              <th className="px-3 py-2">Banda inferior</th>
              <th className="px-3 py-2">Banda superior</th>
              <th className="px-3 py-2">Energía MWh</th>
              <th className="px-3 py-2">Clima</th>
              <th className="px-3 py-2">Disp.</th>
              <th className="px-3 py-2">Soiling</th>
              <th className="px-3 py-2">BESS</th>
              <th className="px-3 py-2">Confianza</th>
              <th className="px-3 py-2">Condición</th>
            </tr>
          </thead>

          <tbody>
            {series.points.map((point) => (
              <tr
                key={point.hourLabel}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {point.hourLabel}
                </td>
                <td className="px-3 py-3">{point.expectedPowerMw}</td>
                <td className="px-3 py-3">{point.lowerBandMw}</td>
                <td className="px-3 py-3">{point.upperBandMw}</td>
                <td className="px-3 py-3">{point.expectedEnergyMwh}</td>
                <td className="px-3 py-3">{point.weatherFactorPct}%</td>
                <td className="px-3 py-3">{point.availabilityFactorPct}%</td>
                <td className="px-3 py-3">{point.soilingFactorPct}%</td>
                <td className="px-3 py-3">{point.bessInfluencePct}%</td>
                <td className="px-3 py-3">{point.confidencePct}%</td>
                <td className="px-3 py-3">
                  {conditionLabel[point.condition]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-orange-400/20 bg-orange-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
            Riesgos técnicos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-orange-100">
            {summary.risks.length ? (
              summary.risks.map((risk) => (
                <li key={risk.id}>
                  • <strong>{risk.label}</strong>: {risk.description}
                </li>
              ))
            ) : (
              <li>• Sin riesgos relevantes en la simulación mock.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Recomendaciones O&M
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100">
            {summary.omRecommendations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Notas regulatorias
          </p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100">
            {summary.regulatoryNotes.map((item) => (
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
          {summary.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
