import { PVMetricsForecastAccuracyMockAssessment } from '../../types/pvmetrics-forecast-accuracy-mock.types';

type PVMetricsForecastAccuracyVisualCardProps = {
  assessment: PVMetricsForecastAccuracyMockAssessment;
};

const accuracyTone = {
  excellent: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  good: 'border-cyan-400/30 bg-cyan-950/20 text-cyan-100',
  'needs-review': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  poor: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'not-evaluable': 'border-slate-400/30 bg-slate-900/40 text-slate-100',
};

const errorCategoryLabel = {
  'weather-error': 'Error meteorológico',
  'availability-error': 'Error por disponibilidad',
  'soiling-error': 'Error por soiling',
  'bess-separation-error': 'Error por separación FV/BESS',
  'curtailment-error': 'Error por curtailment',
  'data-quality-error': 'Error por calidad de datos',
  'model-bias': 'Sesgo del modelo',
  'unexplained-error': 'Error no explicado',
};

const errorCategoryTone = {
  'weather-error': 'text-cyan-300',
  'availability-error': 'text-orange-300',
  'soiling-error': 'text-amber-300',
  'bess-separation-error': 'text-violet-300',
  'curtailment-error': 'text-rose-300',
  'data-quality-error': 'text-red-300',
  'model-bias': 'text-blue-300',
  'unexplained-error': 'text-slate-300',
};

export const PVMetricsForecastAccuracyVisualCard = ({
  assessment,
}: PVMetricsForecastAccuracyVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-blue-400/20 bg-slate-950/80 p-5 shadow-2xl" id="pvmetrics-forecast-accuracy-visual-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
            FORECAST ACCURACY & ERROR ANALYTICS
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Precisión del forecast mock
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Evaluación local de precisión, sesgo, bandas de confianza y causas
            raíz del error. La serie observada es mock y no representa medición
            real de planta.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${accuracyTone[assessment.accuracyLevel]}`}
        >
          <p className="text-xs uppercase tracking-wide">Nivel de precisión</p>
          <p className="mt-1 max-w-xs text-lg font-black uppercase">
            {assessment.accuracyLevelLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Categoría dominante de error
        </p>
        <p
          className={`mt-2 text-2xl font-black ${errorCategoryTone[assessment.dominantErrorCategory]}`}
        >
          {assessment.dominantErrorLabel}
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['MAE', `${assessment.kpis.maeMw} MW`],
          ['RMSE', `${assessment.kpis.rmseMw} MW`],
          ['MAPE', `${assessment.kpis.mapePct}%`],
          ['Bias', `${assessment.kpis.biasMw} MW`],
          ['NMAE', `${assessment.kpis.nmaePct}%`],
          [
            'Confidence Hit Rate',
            `${assessment.kpis.confidenceHitRatePct}%`,
          ],
          [
            'Event Explained Error',
            `${assessment.kpis.eventExplainedErrorPct}%`,
          ],
          ['Horizonte', assessment.horizonLabel],
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
          Tabla forecast vs observado mock
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Hora</th>
              <th className="px-3 py-2">Forecast MW</th>
              <th className="px-3 py-2">Observado mock MW</th>
              <th className="px-3 py-2">Banda inferior</th>
              <th className="px-3 py-2">Banda superior</th>
              <th className="px-3 py-2">Error abs.</th>
              <th className="px-3 py-2">Error %</th>
              <th className="px-3 py-2">Bias</th>
              <th className="px-3 py-2">Dentro banda</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Explicado</th>
            </tr>
          </thead>

          <tbody>
            {assessment.points.map((point) => (
              <tr
                key={point.hourLabel}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {point.hourLabel}
                </td>
                <td className="px-3 py-3">{point.forecastPowerMw}</td>
                <td className="px-3 py-3">{point.observedPowerMw}</td>
                <td className="px-3 py-3">{point.lowerBandMw}</td>
                <td className="px-3 py-3">{point.upperBandMw}</td>
                <td className="px-3 py-3">{point.absoluteErrorMw}</td>
                <td className="px-3 py-3">{point.percentageErrorPct}%</td>
                <td className="px-3 py-3">{point.biasMw}</td>
                <td className="px-3 py-3">
                  {point.insideConfidenceBand ? (
                    <span className="font-semibold text-emerald-300">Sí</span>
                  ) : (
                    <span className="font-semibold text-amber-300">No</span>
                  )}
                </td>
                <td
                  className={`px-3 py-3 font-semibold ${errorCategoryTone[point.errorCategory]}`}
                >
                  {errorCategoryLabel[point.errorCategory]}
                </td>
                <td className="px-3 py-3">
                  {point.explainedByEvent ? 'Sí' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Breakdown de causas raíz
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Causa</th>
              <th className="px-3 py-2">Puntos afectados</th>
              <th className="px-3 py-2">Error MW</th>
              <th className="px-3 py-2">Error MWh</th>
              <th className="px-3 py-2">Contribución</th>
              <th className="px-3 py-2">Explicación</th>
            </tr>
          </thead>

          <tbody>
            {assessment.rootCauseBreakdown.map((item) => (
              <tr
                key={item.category}
                className="border-t border-slate-800 text-slate-300"
              >
                <td
                  className={`px-3 py-3 font-semibold ${errorCategoryTone[item.category]}`}
                >
                  {item.label}
                </td>
                <td className="px-3 py-3">{item.pointsAffected}</td>
                <td className="px-3 py-3">{item.estimatedErrorMw}</td>
                <td className="px-3 py-3">{item.estimatedErrorMwh}</td>
                <td className="px-3 py-3">{item.contributionPct}%</td>
                <td className="px-3 py-3">{item.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
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
