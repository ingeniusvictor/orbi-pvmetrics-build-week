import { PVMetricsSolarForecastMockSeries } from '../types/pvmetrics-solar-forecast-mock.types';
import {
  PVMetricsSolarForecastKpiSummary,
  PVMetricsSolarForecastRisk,
  PVMetricsSolarForecastRiskLevel,
  PVMetricsSolarForecastSummary,
} from '../types/pvmetrics-solar-forecast-summary.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const round = (value: number) => Number(value.toFixed(2));

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const resolveRiskLevel = (risks: PVMetricsSolarForecastRisk[]): PVMetricsSolarForecastRiskLevel => {
  if (risks.some((risk) => risk.level === 'critical')) return 'critical';
  if (risks.some((risk) => risk.level === 'high')) return 'high';
  if (risks.some((risk) => risk.level === 'medium')) return 'medium';
  return 'low';
};

const createKpis = (
  series: PVMetricsSolarForecastMockSeries,
): PVMetricsSolarForecastKpiSummary => {
  const weatherLoss = average(
    series.points.map((point) => Math.max(0, 100 - point.weatherFactorPct)),
  );

  const availabilityLoss = average(
    series.points.map((point) => Math.max(0, 100 - point.availabilityFactorPct)),
  );

  const soilingLoss = average(
    series.points.map((point) => Math.max(0, 100 - point.soilingFactorPct)),
  );

  const bessInfluence = average(
    series.points.map((point) => Math.abs(point.bessInfluencePct)),
  );

  const lowestConfidencePct = Math.min(
    ...series.points.map((point) => point.confidencePct),
  );

  const forecastReadinessPct = round(
    Math.max(
      0,
      Math.min(
        100,
        series.averageConfidencePct -
          weatherLoss * 0.25 -
          availabilityLoss * 0.35 -
          soilingLoss * 0.2 -
          bessInfluence * 0.2,
      ),
    ),
  );

  return {
    totalForecastEnergyMwh: series.totalForecastEnergyMwh,
    peakForecastPowerMw: series.peakForecastPowerMw,
    averageConfidencePct: series.averageConfidencePct,
    lowestConfidencePct,
    estimatedWeatherLossPct: round(weatherLoss),
    estimatedAvailabilityLossPct: round(availabilityLoss),
    estimatedSoilingLossPct: round(soilingLoss),
    estimatedBessInfluencePct: round(bessInfluence),
    forecastReadinessPct,
  };
};

const createRisks = (
  kpis: PVMetricsSolarForecastKpiSummary,
): PVMetricsSolarForecastRisk[] => {
  const risks: PVMetricsSolarForecastRisk[] = [];

  if (kpis.lowestConfidencePct < 70) {
    risks.push({
      id: 'risk-low-confidence',
      category: 'confidence',
      level: 'high',
      label: 'Baja confianza horaria',
      description:
        'La serie mock contiene horas con confianza inferior al umbral recomendado.',
      recommendedAction:
        'Revisar supuestos de clima, disponibilidad y datos de entrada antes de usar el forecast como referencia operativa.',
    });
  }

  if (kpis.estimatedWeatherLossPct > 15) {
    risks.push({
      id: 'risk-weather-impact',
      category: 'weather',
      level: 'medium',
      label: 'Impacto climático relevante',
      description:
        'El forecast mock detecta reducción esperada por condición climática o nubosidad.',
      recommendedAction:
        'Cruzar forecast con irradiancia, nubosidad y temperatura cuando existan datos autorizados.',
    });
  }

  if (kpis.estimatedAvailabilityLossPct > 3) {
    risks.push({
      id: 'risk-availability-impact',
      category: 'availability',
      level: 'medium',
      label: 'Impacto de disponibilidad',
      description:
        'La disponibilidad mock reduce la energía esperada en parte del horizonte.',
      recommendedAction:
        'Confirmar mantenimientos, limitaciones, derating o fallas antes de cerrar el forecast.',
    });
  }

  if (kpis.estimatedSoilingLossPct > 2) {
    risks.push({
      id: 'risk-soiling-impact',
      category: 'soiling',
      level: 'medium',
      label: 'Pérdida por soiling',
      description:
        'El factor mock de soiling indica pérdida energética acumulada.',
      recommendedAction:
        'Evaluar módulo futuro de soiling, limpieza y costo-beneficio O&M.',
    });
  }

  if (kpis.estimatedBessInfluencePct > 0) {
    risks.push({
      id: 'risk-bess-separation',
      category: 'bess',
      level: 'medium',
      label: 'Influencia BESS conceptual',
      description:
        'El forecast considera influencia BESS mock que debe separarse de generación FV pura.',
      recommendedAction:
        'Mantener separación FV/BESS antes de comparar energía generada, cargada o descargada.',
    });
  }

  if (kpis.forecastReadinessPct < 75) {
    risks.push({
      id: 'risk-regulatory-readiness',
      category: 'regulatory',
      level: 'high',
      label: 'Readiness regulatorio insuficiente',
      description:
        'La madurez conceptual del forecast aún no es suficiente para simular cumplimiento regulatorio.',
      recommendedAction:
        'No usar este resultado como forecast CEN. Preparar módulo de simulación regulatoria posterior.',
    });
  }

  return risks;
};

const createTechnicalExplanation = (
  series: PVMetricsSolarForecastMockSeries,
  kpis: PVMetricsSolarForecastKpiSummary,
) =>
  [
    `El forecast mock para ${series.plantName} estima ${kpis.totalForecastEnergyMwh} MWh en el horizonte ${series.horizonLabel}.`,
    `La potencia peak esperada es ${kpis.peakForecastPowerMw} MW, con confianza promedio de ${kpis.averageConfidencePct}%.`,
    `La pérdida climática estimada es ${kpis.estimatedWeatherLossPct}%, la pérdida por disponibilidad es ${kpis.estimatedAvailabilityLossPct}% y el soiling mock aporta ${kpis.estimatedSoilingLossPct}% de reducción conceptual.`,
    `El readiness del forecast es ${kpis.forecastReadinessPct}%, por lo que debe interpretarse como simulación segura y no como pronóstico operativo real.`,
  ].join(' ');

const createOmRecommendations = (
  kpis: PVMetricsSolarForecastKpiSummary,
): string[] => {
  const recommendations = [
    'Validar perfil de planta, potencia AC/DC y supuestos antes de comparar forecast contra generación real.',
  ];

  if (kpis.estimatedWeatherLossPct > 15) {
    recommendations.push(
      'Revisar nubosidad, irradiancia y temperatura como causa probable de desviación.',
    );
  }

  if (kpis.estimatedAvailabilityLossPct > 3) {
    recommendations.push(
      'Confirmar si existen mantenimientos, fallas, limitaciones o derating durante el horizonte.',
    );
  }

  if (kpis.estimatedSoilingLossPct > 2) {
    recommendations.push(
      'Evaluar limpieza o inspección de soiling si la pérdida se mantiene en módulos posteriores.',
    );
  }

  if (kpis.estimatedBessInfluencePct > 0) {
    recommendations.push(
      'Separar análisis FV y BESS para evitar interpretar carga/descarga como desviación de generación solar.',
    );
  }

  return recommendations;
};

const createRegulatoryNotes = (
  kpis: PVMetricsSolarForecastKpiSummary,
): string[] => [
  'Este resultado no corresponde a un forecast regulatorio real.',
  'No se envía información al CEN ni a operadores eléctricos.',
  'El readiness regulatorio es conceptual y sirve solo para preparar futuros módulos de cumplimiento.',
  `Readiness conceptual actual: ${kpis.forecastReadinessPct}%.`,
];

const buildInternalText = (
  summaryBase: Omit<PVMetricsSolarForecastSummary, 'internalForecastText' | 'clientForecastText'>,
) =>
  [
    'ORBI PVMetrics IA — Solar Forecast Mock Summary',
    `Generado: ${summaryBase.generatedAtLabel}`,
    `Planta: ${summaryBase.plantName} (${summaryBase.plantCode})`,
    `Horizonte: ${summaryBase.horizonLabel}`,
    '',
    'KPIs:',
    `- Energía forecast: ${summaryBase.kpis.totalForecastEnergyMwh} MWh`,
    `- Peak forecast: ${summaryBase.kpis.peakForecastPowerMw} MW`,
    `- Confianza promedio: ${summaryBase.kpis.averageConfidencePct}%`,
    `- Confianza mínima: ${summaryBase.kpis.lowestConfidencePct}%`,
    `- Readiness forecast: ${summaryBase.kpis.forecastReadinessPct}%`,
    '',
    'Explicación técnica:',
    summaryBase.technicalExplanation,
    '',
    'Riesgos:',
    summaryBase.risks.length
      ? summaryBase.risks
          .map((risk) => `- [${risk.level}] ${risk.label}: ${risk.description}`)
          .join('\n')
      : '- Sin riesgos relevantes en la serie mock.',
    '',
    'Recomendaciones O&M:',
    summaryBase.omRecommendations.map((item) => `- ${item}`).join('\n'),
    '',
    'Notas regulatorias:',
    summaryBase.regulatoryNotes.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    summaryBase.safetyBoundary,
  ].join('\n');

const buildClientText = (
  summaryBase: Omit<PVMetricsSolarForecastSummary, 'internalForecastText' | 'clientForecastText'>,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos un resumen conceptual de forecast solar mock para ${summaryBase.plantName} (${summaryBase.plantCode}).`,
    '',
    `Horizonte: ${summaryBase.horizonLabel}.`,
    `Energía estimada mock: ${summaryBase.kpis.totalForecastEnergyMwh} MWh.`,
    `Confianza promedio mock: ${summaryBase.kpis.averageConfidencePct}%.`,
    `Readiness conceptual: ${summaryBase.kpis.forecastReadinessPct}%.`,
    '',
    'Interpretación:',
    summaryBase.technicalExplanation,
    '',
    'Puntos de atención:',
    summaryBase.risks.length
      ? summaryBase.risks.map((risk) => `- ${risk.label}: ${risk.recommendedAction}`).join('\n')
      : '- Sin riesgos relevantes en esta simulación.',
    '',
    'Este resultado es conceptual. No corresponde a pronóstico real, no se envía al CEN y no se conecta a SCADA ni medidores reales.',
  ].join('\n');

export const createPvMetricsSolarForecastSummary = (
  series: PVMetricsSolarForecastMockSeries,
): PVMetricsSolarForecastSummary => {
  const kpis = createKpis(series);
  const risks = createRisks(kpis);
  const riskLevel = resolveRiskLevel(risks);

  const safetyBoundary =
    'Este resumen de forecast es mock, local y conceptual. No usa APIs meteorológicas reales, no conecta SCADA, no lee medidores reales, no envía pronósticos al CEN, no controla BESS, no controla inversores y no modifica setpoints.';

  const base = {
    id: `solar-forecast-summary-${series.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: series.plantName,
    plantCode: series.plantCode,
    horizonLabel: series.horizonLabel,
    kpis,
    riskLevel,
    risks,
    executiveSummary:
      `Forecast mock ${series.horizonLabel} para ${series.plantName}: ${kpis.totalForecastEnergyMwh} MWh esperados, peak ${kpis.peakForecastPowerMw} MW, confianza promedio ${kpis.averageConfidencePct}% y readiness conceptual ${kpis.forecastReadinessPct}%.`,
    technicalExplanation: createTechnicalExplanation(series, kpis),
    omRecommendations: createOmRecommendations(kpis),
    regulatoryNotes: createRegulatoryNotes(kpis),
    safetyBoundary,
    sourceSeries: series,
  };

  return {
    ...base,
    internalForecastText: buildInternalText(base),
    clientForecastText: buildClientText(base),
  };
};
