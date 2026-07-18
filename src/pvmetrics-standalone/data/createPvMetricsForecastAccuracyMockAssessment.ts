import { PV_METRICS_FORECAST_ACCURACY_BLUEPRINT } from './pvMetricsForecastAccuracyBlueprint';
import {
  PVMetricsForecastAccuracyKpis,
  PVMetricsForecastAccuracyMockAssessment,
  PVMetricsForecastAccuracyMockPoint,
  PVMetricsForecastAccuracyRootCauseItem,
} from '../types/pvmetrics-forecast-accuracy-mock.types';
import {
  PVMetricsForecastAccuracyLevel,
  PVMetricsForecastErrorCategory,
} from '../types/pvmetrics-forecast-accuracy-blueprint.types';
import { PVMetricsOperationalEventMockAssessment } from '../types/pvmetrics-operational-event-mock.types';
import { PVMetricsSolarForecastMockSeries } from '../types/pvmetrics-solar-forecast-mock.types';

type CreatePvMetricsForecastAccuracyMockAssessmentInput = {
  forecastSeries: PVMetricsSolarForecastMockSeries;
  operationalEventsAssessment?: PVMetricsOperationalEventMockAssessment;
  installedCapacityMwac?: number;
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const round = (value: number) => Number(value.toFixed(2));

const average = (values: number[]) =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

const levelLabel: Record<PVMetricsForecastAccuracyLevel, string> = {
  excellent: 'EXCELENTE — ERROR MOCK BAJO',
  good: 'BUENO — ERROR MOCK CONTROLADO',
  'needs-review': 'REQUIERE REVISIÓN — ERROR MOCK RELEVANTE',
  poor: 'DEFICIENTE — ERROR MOCK ALTO',
  'not-evaluable': 'NO EVALUABLE — DATOS MOCK INSUFICIENTES',
};

const errorLabel: Record<PVMetricsForecastErrorCategory, string> = {
  'weather-error': 'Error meteorológico',
  'availability-error': 'Error por disponibilidad',
  'soiling-error': 'Error por soiling',
  'bess-separation-error': 'Error por separación FV/BESS',
  'curtailment-error': 'Error por curtailment',
  'data-quality-error': 'Error por calidad de datos',
  'model-bias': 'Sesgo del modelo',
  'unexplained-error': 'Error no explicado',
};

const resolvePointErrorCategory = (
  hourIndex: number,
  point: PVMetricsSolarForecastMockSeries['points'][number],
  operationalEventsAssessment?: PVMetricsOperationalEventMockAssessment,
): PVMetricsForecastErrorCategory => {
  const hasDataQualityEvent = operationalEventsAssessment?.events.some(
    (event) => event.impactedAreas.includes('data-quality'),
  );

  const hasBessEvent = operationalEventsAssessment?.events.some((event) =>
    event.impactedAreas.includes('bess-separation'),
  );

  if (hasDataQualityEvent && hourIndex >= 8 && hourIndex <= 9) {
    return 'data-quality-error';
  }

  if (hasBessEvent && hourIndex >= 12 && hourIndex <= 15) {
    return 'bess-separation-error';
  }

  if (point.availabilityFactorPct < 96) {
    return 'availability-error';
  }

  if (point.soilingFactorPct < 98) {
    return 'soiling-error';
  }

  if (point.weatherFactorPct < 88 || point.condition === 'cloudy') {
    return 'weather-error';
  }

  if (hourIndex >= 10 && hourIndex <= 13) {
    return 'availability-error';
  }

  if (hourIndex >= 14 && hourIndex <= 16) {
    return 'weather-error';
  }

  return Math.abs(point.expectedPowerMw) > 0 ? 'model-bias' : 'unexplained-error';
};

const createObservedPower = (
  point: PVMetricsSolarForecastMockSeries['points'][number],
  hourIndex: number,
  errorCategory: PVMetricsForecastErrorCategory,
): number => {
  const base = point.expectedPowerMw;

  const categoryPenalty: Record<PVMetricsForecastErrorCategory, number> = {
    'weather-error': 0.88,
    'availability-error': 0.9,
    'soiling-error': 0.96,
    'bess-separation-error': 1.04,
    'curtailment-error': 0.86,
    'data-quality-error': 0.94,
    'model-bias': hourIndex % 2 === 0 ? 1.03 : 0.97,
    'unexplained-error': 0.98,
  };

  const deterministicShape = 1 + ((hourIndex % 5) - 2) * 0.01;
  return round(Math.max(0, base * categoryPenalty[errorCategory] * deterministicShape));
};

const createAccuracyPoints = (
  forecastSeries: PVMetricsSolarForecastMockSeries,
  operationalEventsAssessment?: PVMetricsOperationalEventMockAssessment,
): PVMetricsForecastAccuracyMockPoint[] => {
  return forecastSeries.points.map((point, hourIndex) => {
    const errorCategory = resolvePointErrorCategory(
      hourIndex,
      point,
      operationalEventsAssessment,
    );

    const observedPowerMw = createObservedPower(point, hourIndex, errorCategory);
    const absoluteErrorMw = round(Math.abs(point.expectedPowerMw - observedPowerMw));
    const biasMw = round(point.expectedPowerMw - observedPowerMw);
    const percentageErrorPct =
      observedPowerMw > 0 ? round((absoluteErrorMw / observedPowerMw) * 100) : 0;

    const explainedByEvent = [
      'weather-error',
      'availability-error',
      'bess-separation-error',
      'data-quality-error',
      'soiling-error',
      'curtailment-error',
    ].includes(errorCategory);

    return {
      hourLabel: point.hourLabel,
      forecastPowerMw: point.expectedPowerMw,
      observedPowerMw,
      lowerBandMw: point.lowerBandMw,
      upperBandMw: point.upperBandMw,
      absoluteErrorMw,
      squaredErrorMw: round(absoluteErrorMw * absoluteErrorMw),
      percentageErrorPct,
      biasMw,
      insideConfidenceBand:
        observedPowerMw >= point.lowerBandMw && observedPowerMw <= point.upperBandMw,
      errorCategory,
      explainedByEvent,
      explanation: `${errorLabel[errorCategory]} mock asociado a ${point.condition}.`,
    };
  });
};

const createKpis = (
  points: PVMetricsForecastAccuracyMockPoint[],
  installedCapacityMwac: number,
): PVMetricsForecastAccuracyKpis => {
  const maeMw = average(points.map((point) => point.absoluteErrorMw));
  const rmseMw = Math.sqrt(average(points.map((point) => point.squaredErrorMw)));
  const mapePct = average(points.map((point) => point.percentageErrorPct));
  const biasMw = average(points.map((point) => point.biasMw));
  const confidenceHitRatePct =
    points.length > 0
      ? (points.filter((point) => point.insideConfidenceBand).length /
          points.length) *
        100
      : 0;

  const eventExplainedErrorPct =
    points.length > 0
      ? (points.filter((point) => point.explainedByEvent).length / points.length) *
        100
      : 0;

  return {
    maeMw: round(maeMw),
    rmseMw: round(rmseMw),
    mapePct: round(mapePct),
    biasMw: round(biasMw),
    nmaePct: installedCapacityMwac > 0 ? round((maeMw / installedCapacityMwac) * 100) : 0,
    confidenceHitRatePct: round(confidenceHitRatePct),
    eventExplainedErrorPct: round(eventExplainedErrorPct),
  };
};

const resolveAccuracyLevel = (
  kpis: PVMetricsForecastAccuracyKpis,
): PVMetricsForecastAccuracyLevel => {
  if (kpis.maeMw === 0 && kpis.rmseMw === 0) return 'not-evaluable';
  if (kpis.nmaePct <= 3 && kpis.confidenceHitRatePct >= 85) return 'excellent';
  if (kpis.nmaePct <= 7 && kpis.confidenceHitRatePct >= 70) return 'good';
  if (kpis.nmaePct <= 12) return 'needs-review';
  return 'poor';
};

const createRootCauseBreakdown = (
  points: PVMetricsForecastAccuracyMockPoint[],
): PVMetricsForecastAccuracyRootCauseItem[] => {
  const totalError = points.reduce((sum, point) => sum + point.absoluteErrorMw, 0);

  const categories = Array.from(
    new Set(points.map((point) => point.errorCategory)),
  );

  return categories
    .map((category) => {
      const categoryPoints = points.filter((point) => point.errorCategory === category);
      const estimatedErrorMw = categoryPoints.reduce(
        (sum, point) => sum + point.absoluteErrorMw,
        0,
      );

      return {
        category,
        label: errorLabel[category],
        pointsAffected: categoryPoints.length,
        estimatedErrorMw: round(estimatedErrorMw),
        estimatedErrorMwh: round(estimatedErrorMw),
        contributionPct:
          totalError > 0 ? round((estimatedErrorMw / totalError) * 100) : 0,
        explanation:
          PV_METRICS_FORECAST_ACCURACY_BLUEPRINT.errorCategories.find(
            (item) => item.category === category,
          )?.recommendedAction ?? 'Requiere revisión técnica.',
      };
    })
    .sort((a, b) => b.contributionPct - a.contributionPct);
};

const buildInternalText = (
  assessmentBase: Omit<
    PVMetricsForecastAccuracyMockAssessment,
    'internalAccuracyText' | 'clientAccuracyText'
  >
) =>
  [
    'ORBI PVMetrics IA — Forecast Accuracy Mock Assessment',
    `Generado: ${assessmentBase.generatedAtLabel}`,
    `Planta: ${assessmentBase.plantName} (${assessmentBase.plantCode})`,
    `Horizonte: ${assessmentBase.horizonLabel}`,
    `Nivel: ${assessmentBase.accuracyLevelLabel}`,
    '',
    'KPIs:',
    `- MAE: ${assessmentBase.kpis.maeMw} MW`,
    `- RMSE: ${assessmentBase.kpis.rmseMw} MW`,
    `- MAPE: ${assessmentBase.kpis.mapePct}%`,
    `- Bias: ${assessmentBase.kpis.biasMw} MW`,
    `- NMAE: ${assessmentBase.kpis.nmaePct}%`,
    `- Confidence Hit Rate: ${assessmentBase.kpis.confidenceHitRatePct}%`,
    `- Event Explained Error: ${assessmentBase.kpis.eventExplainedErrorPct}%`,
    '',
    `Categoría dominante: ${assessmentBase.dominantErrorLabel}`,
    '',
    'Breakdown de causas:',
    assessmentBase.rootCauseBreakdown
      .map(
        (item) =>
          `- ${item.label}: ${item.contributionPct}% | ${item.pointsAffected} puntos | ${item.estimatedErrorMw} MW`,
      )
      .join('\n'),
    '',
    'Notas interpretativas:',
    assessmentBase.interpretationNotes.map((item) => `- ${item}`).join('\n'),
    '',
    'Recomendaciones O&M:',
    assessmentBase.omRecommendations.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    assessmentBase.safetyBoundary,
  ].join('\n');

const buildClientText = (
  assessmentBase: Omit<
    PVMetricsForecastAccuracyMockAssessment,
    'internalAccuracyText' | 'clientAccuracyText'
  >
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos una evaluación conceptual de precisión del forecast para ${assessmentBase.plantName} (${assessmentBase.plantCode}).`,
    '',
    `Estado conceptual: ${assessmentBase.accuracyLevelLabel}.`,
    `MAE mock: ${assessmentBase.kpis.maeMw} MW.`,
    `MAPE mock: ${assessmentBase.kpis.mapePct}%.`,
    `Error explicado por eventos mock: ${assessmentBase.kpis.eventExplainedErrorPct}%.`,
    '',
    `Principal causa conceptual: ${assessmentBase.dominantErrorLabel}.`,
    '',
    'Este resultado es conceptual. No calcula precisión real, no usa SCADA, no lee medidores reales, no usa API meteorológica y no debe usarse como reporte oficial de desempeño.',
  ].join('\n');

export const createPvMetricsForecastAccuracyMockAssessment = ({
  forecastSeries,
  operationalEventsAssessment,
  installedCapacityMwac,
}: CreatePvMetricsForecastAccuracyMockAssessmentInput): PVMetricsForecastAccuracyMockAssessment => {
  const capacityReference =
    installedCapacityMwac ??
    forecastSeries.installedCapacityMwac ??
    forecastSeries.points.reduce(
      (max, point) => Math.max(max, point.expectedPowerMw),
      1,
    );

  const points = createAccuracyPoints(forecastSeries, operationalEventsAssessment);
  const kpis = createKpis(points, capacityReference);
  const accuracyLevel = resolveAccuracyLevel(kpis);
  const rootCauseBreakdown = createRootCauseBreakdown(points);
  const dominantErrorCategory =
    rootCauseBreakdown[0]?.category ?? 'unexplained-error';

  const interpretationNotes = [
    'La serie observada es mock y fue generada localmente para validar la capa de error analytics.',
    'El error no debe atribuirse automáticamente al modelo si existen eventos operacionales asociados.',
    `El ${kpis.eventExplainedErrorPct}% de los puntos tiene una causa conceptual explicable por evento, disponibilidad, clima, BESS, soiling o calidad de datos.`,
    `Confidence Hit Rate mock: ${kpis.confidenceHitRatePct}%.`,
  ];

  const omRecommendations = [
    'Validar eventos operacionales antes de recalibrar el forecast.',
    'Separar errores por clima, disponibilidad, BESS, soiling, curtailment y calidad de datos.',
    'Usar Bias para detectar sobreestimación o subestimación persistente.',
    'No usar métricas mock como desempeño real de planta.',
  ];

  const dataQualityWarnings =
    rootCauseBreakdown.some((item) => item.category === 'data-quality-error')
      ? [
          'Existe error asociado a calidad de datos mock. Bloquear conclusiones automáticas y exigir revisión humana.',
        ]
      : ['Sin advertencias críticas de calidad de datos en este set mock.'];

  const safetyBoundary =
    'Este assessment de precisión es mock, local y conceptual. No calcula precisión real, no consume datos reales, no conecta SCADA, no lee medidores reales, no usa APIs meteorológicas reales, no envía información al CEN, no controla BESS, no controla inversores y no modifica setpoints.';

  const base = {
    id: `forecast-accuracy-assessment-${forecastSeries.plantCode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: forecastSeries.plantName,
    plantCode: forecastSeries.plantCode,
    horizonLabel: forecastSeries.horizonLabel,
    accuracyLevel,
    accuracyLevelLabel: levelLabel[accuracyLevel],
    dominantErrorCategory,
    dominantErrorLabel: errorLabel[dominantErrorCategory],
    kpis,
    points,
    rootCauseBreakdown,
    interpretationNotes,
    omRecommendations,
    dataQualityWarnings,
    safetyBoundary,
    sourceForecastSeries: forecastSeries,
    sourceOperationalEventsAssessment: operationalEventsAssessment,
  };

  return {
    ...base,
    internalAccuracyText: buildInternalText(base),
    clientAccuracyText: buildClientText(base),
  };
};
