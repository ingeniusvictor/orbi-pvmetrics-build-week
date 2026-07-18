import {
  PVMetricsSoilingCleaningKpis,
  PVMetricsSoilingCleaningMockAssessment,
  PVMetricsSoilingCleaningRecommendationStatus,
} from '../types/pvmetrics-soiling-cleaning-mock.types';
import {
  PVMetricsCleaningPriority,
  PVMetricsSoilingSource,
} from '../types/pvmetrics-soiling-cleaning-blueprint.types';

type CreatePvMetricsSoilingCleaningMockAssessmentInput = {
  plantName?: string;
  plantCode?: string;
  dailyForecastEnergyMwh?: number;
  estimatedSoilingLossPct?: number;
  cleaningCostIndex?: number;
  rainRecoveryFactorPct?: number;
  inspectionConfidencePct?: number;
  safetyReady?: boolean;
  source?: PVMetricsSoilingSource;
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const round = (value: number) => Number(value.toFixed(2));

const recommendationStatusLabel: Record<
  PVMetricsSoilingCleaningRecommendationStatus,
  string
> = {
  monitor: 'MONITOREAR — PÉRDIDA BAJA',
  'wait-for-rain': 'ESPERAR LLUVIA / REEVALUAR',
  'review-cleaning': 'REVISAR LIMPIEZA CON O&M',
  'cleaning-recommended': 'LIMPIEZA CONCEPTUAL RECOMENDADA',
  'blocked-by-safety': 'BLOQUEADO POR CONDICIÓN HSEC',
};

const cleaningPriorityLabel: Record<PVMetricsCleaningPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

const sourceLabel: Record<PVMetricsSoilingSource, string> = {
  'manual-estimate': 'Estimación manual mock',
  'soiling-station': 'Estación soiling futura',
  'pyranometer-comparison': 'Comparación piranómetros futura',
  'drone-thermal-inspection': 'Inspección dron futura',
  'visual-field-report': 'Reporte visual de terreno mock',
  'historical-performance-trend': 'Tendencia histórica mock',
  'weather-dust-risk': 'Riesgo polvo/clima mock',
  'future-integration': 'Integración futura',
};

const createKpis = ({
  dailyForecastEnergyMwh,
  estimatedSoilingLossPct,
  cleaningCostIndex,
  rainRecoveryFactorPct,
  inspectionConfidencePct,
}: Required<
  Pick<
    CreatePvMetricsSoilingCleaningMockAssessmentInput,
    | 'dailyForecastEnergyMwh'
    | 'estimatedSoilingLossPct'
    | 'cleaningCostIndex'
    | 'rainRecoveryFactorPct'
    | 'inspectionConfidencePct'
  >
>): PVMetricsSoilingCleaningKpis => {
  const estimatedEnergyLossMwh = round(
    dailyForecastEnergyMwh * (estimatedSoilingLossPct / 100),
  );

  const estimatedRecoveredEnergyMwh = round(
    estimatedEnergyLossMwh * 0.82 * (1 - rainRecoveryFactorPct / 200),
  );

  const cleaningPaybackIndex = round(
    cleaningCostIndex > 0 ? estimatedRecoveredEnergyMwh / cleaningCostIndex : 0,
  );

  const dustRiskIndex = round(
    Math.min(100, estimatedSoilingLossPct * 9 + (100 - rainRecoveryFactorPct) * 0.25),
  );

  const forecastImpactPct = round(estimatedSoilingLossPct * 0.75);

  return {
    estimatedSoilingLossPct,
    estimatedEnergyLossMwh,
    estimatedRecoveredEnergyMwh,
    cleaningPaybackIndex,
    dustRiskIndex,
    rainRecoveryFactorPct,
    forecastImpactPct,
    inspectionConfidencePct,
  };
};

const resolvePriority = (
  kpis: PVMetricsSoilingCleaningKpis,
  safetyReady: boolean,
): PVMetricsCleaningPriority => {
  if (!safetyReady) return 'critical';
  if (kpis.estimatedSoilingLossPct >= 7 || kpis.cleaningPaybackIndex >= 3) {
    return 'critical';
  }
  if (kpis.estimatedSoilingLossPct >= 4.5 || kpis.cleaningPaybackIndex >= 2) {
    return 'high';
  }
  if (kpis.estimatedSoilingLossPct >= 2.5 || kpis.cleaningPaybackIndex >= 1) {
    return 'medium';
  }
  return 'low';
};

const resolveStatus = (
  kpis: PVMetricsSoilingCleaningKpis,
  priority: PVMetricsCleaningPriority,
  safetyReady: boolean,
): PVMetricsSoilingCleaningRecommendationStatus => {
  if (!safetyReady) return 'blocked-by-safety';
  if (kpis.rainRecoveryFactorPct >= 55 && priority !== 'critical') {
    return 'wait-for-rain';
  }
  if (priority === 'critical' || priority === 'high') {
    return 'cleaning-recommended';
  }
  if (priority === 'medium') return 'review-cleaning';
  return 'monitor';
};

const buildInternalText = (
  assessment: Omit<
    PVMetricsSoilingCleaningMockAssessment,
    'internalSoilingText' | 'clientSoilingText'
  >,
) =>
  [
    'ORBI PVMetrics IA — Soiling & Cleaning Mock Assessment',
    `Generado: ${assessment.generatedAtLabel}`,
    `Planta: ${assessment.plantName} (${assessment.plantCode})`,
    `Fuente: ${assessment.sourceLabel}`,
    `Estado: ${assessment.recommendationStatusLabel}`,
    `Prioridad: ${assessment.cleaningPriorityLabel}`,
    '',
    'KPIs:',
    `- Pérdida soiling: ${assessment.kpis.estimatedSoilingLossPct}%`,
    `- Pérdida energía: ${assessment.kpis.estimatedEnergyLossMwh} MWh`,
    `- Energía recuperable: ${assessment.kpis.estimatedRecoveredEnergyMwh} MWh`,
    `- Payback index: ${assessment.kpis.cleaningPaybackIndex}`,
    `- Dust risk index: ${assessment.kpis.dustRiskIndex}`,
    `- Rain recovery factor: ${assessment.kpis.rainRecoveryFactorPct}%`,
    `- Impacto forecast: ${assessment.kpis.forecastImpactPct}%`,
    '',
    'Factores de decisión:',
    assessment.decisionFactors
      .map((item) => `- ${item.label}: ${item.status} | ${item.explanation}`)
      .join('\n'),
    '',
    'Recomendaciones O&M:',
    assessment.omRecommendations.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    assessment.safetyBoundary,
  ].join('\n');

const buildClientText = (
  assessment: Omit<
    PVMetricsSoilingCleaningMockAssessment,
    'internalSoilingText' | 'clientSoilingText'
  >,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos una evaluación conceptual de soiling para ${assessment.plantName} (${assessment.plantCode}).`,
    '',
    `Estado: ${assessment.recommendationStatusLabel}.`,
    `Prioridad conceptual: ${assessment.cleaningPriorityLabel}.`,
    `Pérdida estimada mock: ${assessment.kpis.estimatedSoilingLossPct}%.`,
    `Energía recuperable mock: ${assessment.kpis.estimatedRecoveredEnergyMwh} MWh.`,
    '',
    'Este resultado es conceptual. No usa sensores reales, no lee piranómetros, no conecta SCADA y no crea órdenes de limpieza reales.',
  ].join('\n');

export const createPvMetricsSoilingCleaningMockAssessment = ({
  plantName = 'ORBI Solar Demo Plant',
  plantCode = 'AES-DEMO-FV',
  dailyForecastEnergyMwh = 52,
  estimatedSoilingLossPct = 4.8,
  cleaningCostIndex = 12,
  rainRecoveryFactorPct = 18,
  inspectionConfidencePct = 72,
  safetyReady = true,
  source = 'manual-estimate',
}: CreatePvMetricsSoilingCleaningMockAssessmentInput = {}): PVMetricsSoilingCleaningMockAssessment => {
  const kpis = createKpis({
    dailyForecastEnergyMwh,
    estimatedSoilingLossPct,
    cleaningCostIndex,
    rainRecoveryFactorPct,
    inspectionConfidencePct,
  });

  const cleaningPriority = resolvePriority(kpis, safetyReady);
  const recommendationStatus = resolveStatus(kpis, cleaningPriority, safetyReady);

  const decisionFactors = [
    {
      factor: 'soiling-loss' as const,
      label: 'Pérdida por soiling',
      status: kpis.estimatedSoilingLossPct >= 4 ? 'unfavorable' as const : 'neutral' as const,
      valueLabel: `${kpis.estimatedSoilingLossPct}%`,
      explanation:
        'Pérdida conceptual usada para determinar prioridad de limpieza.',
    },
    {
      factor: 'cleaning-cost' as const,
      label: 'Costo de limpieza',
      status: kpis.cleaningPaybackIndex >= 1.5 ? 'favorable' as const : 'neutral' as const,
      valueLabel: `Payback ${kpis.cleaningPaybackIndex}`,
      explanation:
        'Relación mock entre energía recuperable y costo conceptual.',
    },
    {
      factor: 'rain-forecast' as const,
      label: 'Lluvia esperada',
      status: kpis.rainRecoveryFactorPct >= 55 ? 'favorable' as const : 'neutral' as const,
      valueLabel: `${kpis.rainRecoveryFactorPct}%`,
      explanation:
        'Factor mock que puede reducir urgencia de limpieza si la recuperación natural es alta.',
    },
    {
      factor: 'safety-condition' as const,
      label: 'Condición HSEC',
      status: safetyReady ? 'favorable' as const : 'blocking' as const,
      valueLabel: safetyReady ? 'Apta para revisión' : 'Bloqueada',
      explanation:
        'Toda limpieza real requiere revisión humana y HSEC antes de ejecución.',
    },
    {
      factor: 'forecast-accuracy-impact' as const,
      label: 'Impacto en accuracy',
      status: kpis.forecastImpactPct >= 3 ? 'unfavorable' as const : 'neutral' as const,
      valueLabel: `${kpis.forecastImpactPct}%`,
      explanation:
        'Conecta soiling con error analytics y causas raíz del forecast.',
    },
  ];

  const impacts = [
    {
      area: 'forecast' as const,
      label: 'Forecast',
      impactLevel: kpis.forecastImpactPct >= 4 ? 'high' as const : 'medium' as const,
      explanation:
        'El soiling puede reducir energía esperada e introducir sesgo conceptual.',
    },
    {
      area: 'performance' as const,
      label: 'Performance',
      impactLevel: kpis.estimatedSoilingLossPct >= 5 ? 'high' as const : 'medium' as const,
      explanation:
        'La suciedad puede explicar pérdida bajo irradiancia similar.',
    },
    {
      area: 'forecast-accuracy' as const,
      label: 'Forecast Accuracy',
      impactLevel: kpis.forecastImpactPct >= 3 ? 'high' as const : 'medium' as const,
      explanation:
        'El soiling puede aumentar MAE/MAPE si no se considera en el forecast.',
    },
    {
      area: 'om-planning' as const,
      label: 'O&M',
      impactLevel: cleaningPriority === 'high' || cleaningPriority === 'critical'
        ? 'high' as const
        : 'medium' as const,
      explanation:
        'La recomendación debe pasar por revisión O&M/HSEC antes de cualquier limpieza real.',
    },
  ];

  const interpretationNotes = [
    'La evaluación de soiling es mock y local.',
    'La prioridad se calcula combinando pérdida, energía recuperable, payback, lluvia y condición HSEC.',
    'La recomendación no crea órdenes de limpieza reales.',
  ];

  const omRecommendations = [
    recommendationStatus === 'cleaning-recommended'
      ? 'Revisar factibilidad de limpieza con O&M/HSEC antes de cualquier acción real.'
      : 'Mantener monitoreo conceptual y reevaluar con nueva evidencia.',
    'Separar soiling de fallas, curtailment, BESS y calidad de datos.',
    'No usar este resultado como medición real de soiling.',
  ];

  const clientNotes = [
    'El resultado es conceptual y no contractual.',
    'La recomendación debe validarse con inspección y revisión operacional.',
  ];

  const safetyWarnings = [
    'No usa sensores reales de soiling.',
    'No lee piranómetros reales.',
    'No crea órdenes de limpieza reales.',
    'No controla equipos de planta.',
  ];

  const safetyBoundary =
    'Este assessment de soiling es mock, local y conceptual. No usa sensores reales, no lee piranómetros, no conecta SCADA, no lee medidores reales, no usa weather API, no crea órdenes de limpieza, no controla BESS, no controla inversores y no modifica setpoints.';

  const base = {
    id: `soiling-cleaning-assessment-${plantCode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName,
    plantCode,
    source,
    sourceLabel: sourceLabel[source],
    recommendationStatus,
    recommendationStatusLabel: recommendationStatusLabel[recommendationStatus],
    cleaningPriority,
    cleaningPriorityLabel: cleaningPriorityLabel[cleaningPriority],
    kpis,
    decisionFactors,
    impacts,
    interpretationNotes,
    omRecommendations,
    clientNotes,
    safetyWarnings,
    safetyBoundary,
  };

  return {
    ...base,
    internalSoilingText: buildInternalText(base),
    clientSoilingText: buildClientText(base),
  };
};
