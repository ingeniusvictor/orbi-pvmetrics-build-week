import {
  PVMetricsExecutiveForecastIntelligenceSummary,
  PVMetricsExecutiveInsight,
  PVMetricsExecutiveKpiSnapshot,
  PVMetricsExecutivePriorityItem,
  PVMetricsExecutiveReadinessStatus,
  PVMetricsExecutiveRiskLevel,
} from '../types/pvmetrics-executive-forecast-intelligence.types';

export type CreatePvMetricsExecutiveForecastIntelligenceSummaryInput = {
  plantName?: string;
  plantCode?: string;
  forecastEnergyMwh?: number;
  complianceScorePct?: number;
  activeOperationalEvents?: number;
  forecastMapePct?: number;
  eventExplainedErrorPct?: number;
  soilingLossPct?: number;
  commercialRevenueRiskUsd?: number;
  recoverableOpportunityUsd?: number;
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const riskLabel: Record<PVMetricsExecutiveRiskLevel, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico',
  'not-evaluable': 'No evaluable',
};

const readinessLabel: Record<PVMetricsExecutiveReadinessStatus, string> = {
  'mock-ready': 'MOCK READY',
  'review-required': 'REVISIÓN REQUERIDA',
  'data-quality-review': 'REVISIÓN DE CALIDAD DE DATOS',
  'commercial-review': 'REVISIÓN COMERCIAL',
  blocked: 'BLOQUEADO',
};

const resolveRisk = (kpis: PVMetricsExecutiveKpiSnapshot): PVMetricsExecutiveRiskLevel => {
  if (kpis.complianceScorePct < 50) return 'critical';
  if (kpis.activeOperationalEvents >= 4) return 'critical';
  if (kpis.commercialRevenueRiskUsd >= 3500) return 'critical';
  if (kpis.forecastMapePct >= 12 || kpis.soilingLossPct >= 7) return 'high';
  if (kpis.activeOperationalEvents >= 2 || kpis.commercialRevenueRiskUsd >= 1500) {
    return 'high';
  }
  if (kpis.forecastMapePct >= 7 || kpis.soilingLossPct >= 4) return 'medium';
  return 'low';
};

const resolveReadiness = (
  kpis: PVMetricsExecutiveKpiSnapshot,
  risk: PVMetricsExecutiveRiskLevel,
): PVMetricsExecutiveReadinessStatus => {
  if (kpis.complianceScorePct < 40) return 'blocked';
  if (kpis.eventExplainedErrorPct < 35) return 'data-quality-review';
  if (kpis.commercialRevenueRiskUsd >= 2500) return 'commercial-review';
  if (risk === 'high' || risk === 'critical') return 'review-required';
  return 'mock-ready';
};

const createInsights = (
  kpis: PVMetricsExecutiveKpiSnapshot,
): PVMetricsExecutiveInsight[] => [
  {
    id: 'insight-forecast',
    section: 'forecast',
    title: 'Forecast solar mock',
    message: `Energía forecast conceptual: ${kpis.forecastEnergyMwh} MWh.`,
    riskLevel: kpis.forecastMapePct >= 10 ? 'high' : 'medium',
    decisionSignal: kpis.forecastMapePct >= 10 ? 'review-forecast' : 'continue-monitoring',
    recommendedAction:
      'Revisar forecast solo como simulación mock y cruzar con eventos operacionales.',
  },
  {
    id: 'insight-cen',
    section: 'cen-compliance',
    title: 'Readiness CEN conceptual',
    message: `Compliance score mock: ${kpis.complianceScorePct}%.`,
    riskLevel: kpis.complianceScorePct < 70 ? 'high' : 'low',
    decisionSignal:
      kpis.complianceScorePct < 70 ? 'human-review-required' : 'continue-monitoring',
    recommendedAction:
      'No enviar información real al CEN. Mantener evaluación como readiness conceptual.',
  },
  {
    id: 'insight-events',
    section: 'operational-events',
    title: 'Eventos operacionales',
    message: `Eventos activos mock: ${kpis.activeOperationalEvents}.`,
    riskLevel: kpis.activeOperationalEvents >= 3 ? 'critical' : 'medium',
    decisionSignal:
      kpis.activeOperationalEvents >= 1
        ? 'review-operational-events'
        : 'continue-monitoring',
    recommendedAction:
      'Separar pérdidas operacionales de errores del forecast antes de concluir.',
  },
  {
    id: 'insight-soiling',
    section: 'soiling-cleaning',
    title: 'Soiling & Cleaning',
    message: `Pérdida por soiling mock: ${kpis.soilingLossPct}%.`,
    riskLevel: kpis.soilingLossPct >= 5 ? 'high' : 'medium',
    decisionSignal: kpis.soilingLossPct >= 5 ? 'review-cleaning' : 'continue-monitoring',
    recommendedAction:
      'Evaluar limpieza solo con revisión O&M/HSEC. No crear órdenes reales.',
  },
  {
    id: 'insight-commercial',
    section: 'commercial-impact',
    title: 'Impacto comercial mock',
    message: `Riesgo comercial conceptual: ${kpis.commercialRevenueRiskUsd} USD.`,
    riskLevel: kpis.commercialRevenueRiskUsd >= 2500 ? 'high' : 'medium',
    decisionSignal:
      kpis.commercialRevenueRiskUsd >= 2500
        ? 'review-commercial-exposure'
        : 'continue-monitoring',
    recommendedAction:
      'Usar solo como lectura ejecutiva mock, no contractual ni financiera real.',
  },
];

const createPriorities = (
  kpis: PVMetricsExecutiveKpiSnapshot,
): PVMetricsExecutivePriorityItem[] => {
  const priorities: PVMetricsExecutivePriorityItem[] = [];

  if (kpis.activeOperationalEvents > 0) {
    priorities.push({
      id: 'priority-events',
      priority: kpis.activeOperationalEvents >= 3 ? 'critical' : 'high',
      title: 'Revisar eventos operacionales',
      reason: 'Existen eventos activos que pueden explicar pérdida o desviación del forecast.',
      ownerHint: 'om',
      recommendedNextStep:
        'Validar eventos, derating, disponibilidad y estado operacional antes de comunicar resultados.',
    });
  }

  if (kpis.soilingLossPct >= 4) {
    priorities.push({
      id: 'priority-soiling',
      priority: kpis.soilingLossPct >= 7 ? 'critical' : 'high',
      title: 'Evaluar soiling y limpieza',
      reason: 'La pérdida mock por soiling tiene impacto técnico y comercial conceptual.',
      ownerHint: 'hsec',
      recommendedNextStep:
        'Revisar condición de limpieza con O&M/HSEC sin generar órdenes reales.',
    });
  }

  if (kpis.commercialRevenueRiskUsd >= 1500) {
    priorities.push({
      id: 'priority-commercial',
      priority: kpis.commercialRevenueRiskUsd >= 3500 ? 'critical' : 'high',
      title: 'Revisar exposición comercial mock',
      reason: 'El riesgo comercial conceptual supera umbral de revisión.',
      ownerHint: 'commercial',
      recommendedNextStep:
        'Mantener cifras como mock y validar supuestos antes de cualquier comunicación cliente.',
    });
  }

  if (kpis.forecastMapePct >= 8) {
    priorities.push({
      id: 'priority-forecast',
      priority: kpis.forecastMapePct >= 12 ? 'high' : 'medium',
      title: 'Revisar precisión del forecast',
      reason: 'El MAPE mock sugiere desviación relevante.',
      ownerHint: 'forecast',
      recommendedNextStep:
        'Cruzar accuracy con eventos, soiling y calidad de datos antes de atribuir causa.',
    });
  }

  return priorities.length > 0
    ? priorities
    : [
        {
          id: 'priority-monitor',
          priority: 'low',
          title: 'Continuar monitoreo',
          reason: 'No se detectan señales mock críticas en el resumen ejecutivo.',
          ownerHint: 'om',
          recommendedNextStep:
            'Mantener seguimiento conceptual sin activar acciones reales.',
        },
      ];
};

const buildInternalText = (
  summary: Omit<
    PVMetricsExecutiveForecastIntelligenceSummary,
    'internalExecutiveText' | 'clientExecutiveText'
  >,
) =>
  [
    'ORBI PVMetrics IA — Executive Forecast Intelligence Summary',
    `Generado: ${summary.generatedAtLabel}`,
    `Planta: ${summary.plantName} (${summary.plantCode})`,
    `Readiness: ${summary.readinessStatusLabel}`,
    `Riesgo general: ${summary.overallRiskLabel}`,
    '',
    summary.executiveHeadline,
    summary.executiveConclusion,
    '',
    'KPIs:',
    `- Forecast Energy: ${summary.kpiSnapshot.forecastEnergyMwh} MWh`,
    `- Compliance Score: ${summary.kpiSnapshot.complianceScorePct}%`,
    `- Eventos activos: ${summary.kpiSnapshot.activeOperationalEvents}`,
    `- Forecast MAPE: ${summary.kpiSnapshot.forecastMapePct}%`,
    `- Event Explained Error: ${summary.kpiSnapshot.eventExplainedErrorPct}%`,
    `- Soiling Loss: ${summary.kpiSnapshot.soilingLossPct}%`,
    `- Commercial Revenue Risk: ${summary.kpiSnapshot.commercialRevenueRiskUsd} USD`,
    `- Recoverable Opportunity: ${summary.kpiSnapshot.recoverableOpportunityUsd} USD`,
    '',
    'Prioridades:',
    summary.priorities
      .map((item) => `- [${item.priority}] ${item.title}: ${item.recommendedNextStep}`)
      .join('\n'),
    '',
    'Safety Boundary:',
    summary.safetyBoundary,
  ].join('\n');

const buildClientText = (
  summary: Omit<
    PVMetricsExecutiveForecastIntelligenceSummary,
    'internalExecutiveText' | 'clientExecutiveText'
  >,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos un resumen ejecutivo conceptual para ${summary.plantName} (${summary.plantCode}).`,
    '',
    `Estado: ${summary.readinessStatusLabel}.`,
    `Riesgo general conceptual: ${summary.overallRiskLabel}.`,
    '',
    summary.executiveConclusion,
    '',
    'Este resumen es mock, no contractual y no utiliza datos reales de SCADA, medidores, mercado, contratos ni CEN.',
  ].join('\n');

export const createPvMetricsExecutiveForecastIntelligenceSummary = ({
  plantName = 'ORBI Solar Demo Plant',
  plantCode = 'AES-DEMO-FV',
  forecastEnergyMwh = 52,
  complianceScorePct = 82,
  activeOperationalEvents = 2,
  forecastMapePct = 7.8,
  eventExplainedErrorPct = 64,
  soilingLossPct = 4.8,
  commercialRevenueRiskUsd = 1170,
  recoverableOpportunityUsd = 491,
}: CreatePvMetricsExecutiveForecastIntelligenceSummaryInput = {}): PVMetricsExecutiveForecastIntelligenceSummary => {
  const kpiSnapshot: PVMetricsExecutiveKpiSnapshot = {
    forecastEnergyMwh,
    complianceScorePct,
    activeOperationalEvents,
    forecastMapePct,
    eventExplainedErrorPct,
    soilingLossPct,
    commercialRevenueRiskUsd,
    recoverableOpportunityUsd,
  };

  const overallRiskLevel = resolveRisk(kpiSnapshot);
  const readinessStatus = resolveReadiness(kpiSnapshot, overallRiskLevel);

  const insights = createInsights(kpiSnapshot);
  const priorities = createPriorities(kpiSnapshot);

  const executiveHeadline =
    overallRiskLevel === 'critical'
      ? 'Resumen ejecutivo mock con riesgo crítico y revisión humana obligatoria.'
      : overallRiskLevel === 'high'
        ? 'Resumen ejecutivo mock con señales relevantes para revisión O&M/comercial.'
        : 'Resumen ejecutivo mock estable para monitoreo conceptual.';

  const executiveConclusion =
    'La lectura integrada conecta forecast, cumplimiento conceptual, eventos operacionales, accuracy, soiling e impacto comercial mock. Ninguna conclusión debe usarse como reporte oficial ni activar acciones reales sin revisión humana.';

  const safetyBoundary =
    'Este Executive Forecast Intelligence Summary es mock, local y conceptual. No usa forecast real, no conecta SCADA, no lee medidores reales, no usa weather API, no envía información al CEN, no usa precios reales, no usa contratos reales, no integra ERP, no calcula billing, no envía correos reales, no exporta PDF, no controla BESS, no controla inversores y no modifica setpoints.';

  const base = {
    id: `executive-forecast-intelligence-${plantCode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName,
    plantCode,
    readinessStatus,
    readinessStatusLabel: readinessLabel[readinessStatus],
    overallRiskLevel,
    overallRiskLabel: riskLabel[overallRiskLevel],
    executiveHeadline,
    executiveConclusion,
    kpiSnapshot,
    insights,
    priorities,
    safetyBoundary,
  };

  return {
    ...base,
    internalExecutiveText: buildInternalText(base),
    clientExecutiveText: buildClientText(base),
  };
};
