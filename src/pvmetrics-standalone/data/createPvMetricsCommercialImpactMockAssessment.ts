import {
  PVMetricsCommercialAssessmentStatus,
  PVMetricsCommercialCauseBreakdownItem,
  PVMetricsCommercialImpactMockAssessment,
  PVMetricsCommercialKpis,
} from '../types/pvmetrics-commercial-impact-mock.types';
import { PVMetricsCommercialRiskLevel } from '../types/pvmetrics-commercial-impact-blueprint.types';

type CreatePvMetricsCommercialImpactMockAssessmentInput = {
  plantName?: string;
  plantCode?: string;
  estimatedLostEnergyMwh?: number;
  mockEnergyPriceUsdMwh?: number;
  forecastErrorEnergyMwh?: number;
  availabilityLossEnergyMwh?: number;
  soilingLossEnergyMwh?: number;
  curtailmentLossEnergyMwh?: number;
  dataQualityRiskEnergyMwh?: number;
  recoveryFactorPct?: number;
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const round = (value: number) => Number(value.toFixed(2));

const riskLabel: Record<PVMetricsCommercialRiskLevel, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico',
  'not-evaluable': 'No evaluable',
};

const statusLabel: Record<PVMetricsCommercialAssessmentStatus, string> = {
  'mock-monitoring': 'MONITOREO COMERCIAL MOCK',
  'mock-review-required': 'REVISIÓN COMERCIAL MOCK REQUERIDA',
  'mock-high-exposure': 'EXPOSICIÓN COMERCIAL MOCK ALTA',
  'mock-critical-exposure': 'EXPOSICIÓN COMERCIAL MOCK CRÍTICA',
  'blocked-by-data-quality': 'BLOQUEADO POR CALIDAD DE DATOS',
};

const resolveRiskLevel = (valueUsd: number): PVMetricsCommercialRiskLevel => {
  if (valueUsd <= 0) return 'not-evaluable';
  if (valueUsd < 500) return 'low';
  if (valueUsd < 1500) return 'medium';
  if (valueUsd < 3500) return 'high';
  return 'critical';
};

const resolveStatus = (
  overallRiskLevel: PVMetricsCommercialRiskLevel,
  dataQualityRiskUsd: number,
): PVMetricsCommercialAssessmentStatus => {
  if (dataQualityRiskUsd > 800) return 'blocked-by-data-quality';
  if (overallRiskLevel === 'critical') return 'mock-critical-exposure';
  if (overallRiskLevel === 'high') return 'mock-high-exposure';
  if (overallRiskLevel === 'medium') return 'mock-review-required';
  return 'mock-monitoring';
};

const createKpis = ({
  estimatedLostEnergyMwh,
  mockEnergyPriceUsdMwh,
  forecastErrorEnergyMwh,
  availabilityLossEnergyMwh,
  soilingLossEnergyMwh,
  curtailmentLossEnergyMwh,
  dataQualityRiskEnergyMwh,
  recoveryFactorPct,
}: Required<CreatePvMetricsCommercialImpactMockAssessmentInput>): PVMetricsCommercialKpis => {
  const estimatedRevenueRiskUsd = round(
    estimatedLostEnergyMwh * mockEnergyPriceUsdMwh,
  );

  const recoverableRevenueOpportunityUsd = round(
    estimatedRevenueRiskUsd * (recoveryFactorPct / 100),
  );

  return {
    estimatedLostEnergyMwh,
    mockEnergyPriceUsdMwh,
    estimatedRevenueRiskUsd,
    recoverableRevenueOpportunityUsd,
    forecastErrorExposureUsd: round(forecastErrorEnergyMwh * mockEnergyPriceUsdMwh),
    availabilityImpactUsd: round(
      availabilityLossEnergyMwh * mockEnergyPriceUsdMwh,
    ),
    soilingImpactUsd: round(soilingLossEnergyMwh * mockEnergyPriceUsdMwh),
    curtailmentImpactUsd: round(
      curtailmentLossEnergyMwh * mockEnergyPriceUsdMwh,
    ),
    dataQualityRiskUsd: round(dataQualityRiskEnergyMwh * mockEnergyPriceUsdMwh),
  };
};

const createCauseBreakdown = (
  kpis: PVMetricsCommercialKpis,
  input: Required<CreatePvMetricsCommercialImpactMockAssessmentInput>,
): PVMetricsCommercialCauseBreakdownItem[] => {
  const totalValue = Math.max(kpis.estimatedRevenueRiskUsd, 1);

  const items: PVMetricsCommercialCauseBreakdownItem[] = [
    {
      source: 'mock-forecast-accuracy',
      metric: 'forecast-error-commercial-exposure',
      label: 'Exposición por error forecast',
      estimatedEnergyMwh: input.forecastErrorEnergyMwh,
      estimatedValueUsd: kpis.forecastErrorExposureUsd,
      contributionPct: round((kpis.forecastErrorExposureUsd / totalValue) * 100),
      riskLevel: resolveRiskLevel(kpis.forecastErrorExposureUsd),
      explanation:
        'Exposición mock asociada a desviaciones del forecast y error analytics.',
    },
    {
      source: 'mock-availability-loss',
      metric: 'availability-commercial-impact',
      label: 'Impacto por disponibilidad',
      estimatedEnergyMwh: input.availabilityLossEnergyMwh,
      estimatedValueUsd: kpis.availabilityImpactUsd,
      contributionPct: round((kpis.availabilityImpactUsd / totalValue) * 100),
      riskLevel: resolveRiskLevel(kpis.availabilityImpactUsd),
      explanation:
        'Exposición mock asociada a indisponibilidad, derating o eventos operacionales.',
    },
    {
      source: 'mock-soiling-cleaning',
      metric: 'soiling-commercial-impact',
      label: 'Impacto por soiling',
      estimatedEnergyMwh: input.soilingLossEnergyMwh,
      estimatedValueUsd: kpis.soilingImpactUsd,
      contributionPct: round((kpis.soilingImpactUsd / totalValue) * 100),
      riskLevel: resolveRiskLevel(kpis.soilingImpactUsd),
      explanation:
        'Exposición mock asociada a suciedad y oportunidad de limpieza conceptual.',
    },
    {
      source: 'mock-curtailment-loss',
      metric: 'curtailment-commercial-impact',
      label: 'Impacto por curtailment',
      estimatedEnergyMwh: input.curtailmentLossEnergyMwh,
      estimatedValueUsd: kpis.curtailmentImpactUsd,
      contributionPct: round((kpis.curtailmentImpactUsd / totalValue) * 100),
      riskLevel: resolveRiskLevel(kpis.curtailmentImpactUsd),
      explanation:
        'Exposición mock asociada a recortes externos o limitaciones de red.',
    },
    {
      source: 'manual-assumption',
      metric: 'data-quality-commercial-risk',
      label: 'Riesgo por calidad de datos',
      estimatedEnergyMwh: input.dataQualityRiskEnergyMwh,
      estimatedValueUsd: kpis.dataQualityRiskUsd,
      contributionPct: round((kpis.dataQualityRiskUsd / totalValue) * 100),
      riskLevel: resolveRiskLevel(kpis.dataQualityRiskUsd),
      explanation:
        'Riesgo mock cuando la calidad de datos impide validar una conclusión comercial.',
    },
  ];

  return items.sort((a, b) => b.estimatedValueUsd - a.estimatedValueUsd);
};

const buildInternalText = (
  assessment: Omit<
    PVMetricsCommercialImpactMockAssessment,
    'internalCommercialText' | 'clientCommercialText'
  >,
) =>
  [
    'ORBI PVMetrics IA — Commercial Impact & Revenue Risk Mock Assessment',
    `Generado: ${assessment.generatedAtLabel}`,
    `Planta: ${assessment.plantName} (${assessment.plantCode})`,
    `Estado: ${assessment.assessmentStatusLabel}`,
    `Riesgo general: ${assessment.overallRiskLabel}`,
    '',
    'KPIs comerciales mock:',
    `- Energía perdida estimada: ${assessment.kpis.estimatedLostEnergyMwh} MWh`,
    `- Precio mock: ${assessment.kpis.mockEnergyPriceUsdMwh} USD/MWh`,
    `- Riesgo ingreso estimado: ${assessment.kpis.estimatedRevenueRiskUsd} USD`,
    `- Oportunidad recuperable: ${assessment.kpis.recoverableRevenueOpportunityUsd} USD`,
    `- Exposición forecast error: ${assessment.kpis.forecastErrorExposureUsd} USD`,
    `- Impacto disponibilidad: ${assessment.kpis.availabilityImpactUsd} USD`,
    `- Impacto soiling: ${assessment.kpis.soilingImpactUsd} USD`,
    `- Impacto curtailment: ${assessment.kpis.curtailmentImpactUsd} USD`,
    `- Riesgo calidad datos: ${assessment.kpis.dataQualityRiskUsd} USD`,
    '',
    'Breakdown por causa:',
    assessment.causeBreakdown
      .map(
        (item) =>
          `- ${item.label}: ${item.estimatedValueUsd} USD | ${item.contributionPct}% | Riesgo ${riskLabel[item.riskLevel]}`,
      )
      .join('\n'),
    '',
    'Notas:',
    assessment.interpretationNotes.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    assessment.safetyBoundary,
  ].join('\n');

const buildClientText = (
  assessment: Omit<
    PVMetricsCommercialImpactMockAssessment,
    'internalCommercialText' | 'clientCommercialText'
  >,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos una evaluación conceptual de impacto comercial para ${assessment.plantName} (${assessment.plantCode}).`,
    '',
    `Estado: ${assessment.assessmentStatusLabel}.`,
    `Riesgo general conceptual: ${assessment.overallRiskLabel}.`,
    `Exposición comercial mock estimada: ${assessment.kpis.estimatedRevenueRiskUsd} USD.`,
    `Oportunidad recuperable mock: ${assessment.kpis.recoverableRevenueOpportunityUsd} USD.`,
    '',
    'Este análisis es conceptual y no contractual. No usa precios reales, contratos reales, facturación, ERP ni APIs de mercado.',
  ].join('\n');

export const createPvMetricsCommercialImpactMockAssessment = ({
  plantName = 'ORBI Solar Demo Plant',
  plantCode = 'AES-DEMO-FV',
  estimatedLostEnergyMwh = 18,
  mockEnergyPriceUsdMwh = 65,
  forecastErrorEnergyMwh = 4,
  availabilityLossEnergyMwh = 6,
  soilingLossEnergyMwh = 5,
  curtailmentLossEnergyMwh = 2,
  dataQualityRiskEnergyMwh = 1,
  recoveryFactorPct = 42,
}: CreatePvMetricsCommercialImpactMockAssessmentInput = {}): PVMetricsCommercialImpactMockAssessment => {
  const normalizedInput = {
    plantName,
    plantCode,
    estimatedLostEnergyMwh,
    mockEnergyPriceUsdMwh,
    forecastErrorEnergyMwh,
    availabilityLossEnergyMwh,
    soilingLossEnergyMwh,
    curtailmentLossEnergyMwh,
    dataQualityRiskEnergyMwh,
    recoveryFactorPct,
  };

  const kpis = createKpis(normalizedInput);
  const causeBreakdown = createCauseBreakdown(kpis, normalizedInput);
  const overallRiskLevel = resolveRiskLevel(kpis.estimatedRevenueRiskUsd);
  const assessmentStatus = resolveStatus(
    overallRiskLevel,
    kpis.dataQualityRiskUsd,
  );

  const assumptions = [
    {
      assumptionType: 'mock-energy-price' as const,
      label: 'Precio energía mock',
      valueLabel: `${mockEnergyPriceUsdMwh} USD/MWh`,
      explanation:
        'Supuesto local para valorizar pérdidas. No corresponde a precio real ni contrato real.',
      isMock: true as const,
    },
    {
      assumptionType: 'mock-recovery-factor' as const,
      label: 'Factor de recuperación mock',
      valueLabel: `${recoveryFactorPct}%`,
      explanation:
        'Porcentaje conceptual usado para estimar oportunidad recuperable.',
      isMock: true as const,
    },
  ];

  const impactAssessments = [
    {
      area: 'client-reporting' as const,
      label: 'Reporte cliente',
      riskLevel: overallRiskLevel,
      valueLabel: `${kpis.estimatedRevenueRiskUsd} USD mock`,
      explanation:
        'Permite explicar exposición comercial conceptual sin compromisos contractuales.',
      recommendedAction:
        'Usar solo como texto conceptual y validar antes de comunicación externa.',
    },
    {
      area: 'om-prioritization' as const,
      label: 'Priorización O&M',
      riskLevel: resolveRiskLevel(kpis.recoverableRevenueOpportunityUsd),
      valueLabel: `${kpis.recoverableRevenueOpportunityUsd} USD mock recuperable`,
      explanation:
        'Ayuda a priorizar acciones O&M cuando existe oportunidad recuperable.',
      recommendedAction:
        'Cruzar con seguridad, disponibilidad de cuadrilla y revisión humana.',
    },
    {
      area: 'forecast-risk' as const,
      label: 'Riesgo forecast',
      riskLevel: resolveRiskLevel(kpis.forecastErrorExposureUsd),
      valueLabel: `${kpis.forecastErrorExposureUsd} USD mock`,
      explanation:
        'Conecta error analytics con exposición comercial conceptual.',
      recommendedAction:
        'No atribuir al modelo si hay eventos operacionales explicativos.',
    },
    {
      area: 'soiling-cleaning' as const,
      label: 'Soiling & Cleaning',
      riskLevel: resolveRiskLevel(kpis.soilingImpactUsd),
      valueLabel: `${kpis.soilingImpactUsd} USD mock`,
      explanation:
        'Relaciona pérdida por suciedad con oportunidad de limpieza conceptual.',
      recommendedAction:
        'Comparar con costo mock de limpieza y condición HSEC.',
    },
    {
      area: 'data-quality' as const,
      label: 'Calidad de datos',
      riskLevel: resolveRiskLevel(kpis.dataQualityRiskUsd),
      valueLabel: `${kpis.dataQualityRiskUsd} USD mock`,
      explanation:
        'Datos incompletos pueden invalidar una conclusión comercial.',
      recommendedAction:
        'Bloquear conclusiones automáticas si la calidad de datos es insuficiente.',
    },
  ];

  const interpretationNotes = [
    'Todos los valores comerciales son mock y no contractuales.',
    'El riesgo comercial se calcula desde energía mock y precio mock.',
    'El breakdown separa forecast, disponibilidad, soiling, curtailment y calidad de datos.',
    'Ninguna cifra debe usarse como facturación ni pérdida real.',
  ];

  const omRecommendations = [
    'Priorizar revisión de causas con mayor contribución comercial mock.',
    'Validar disponibilidad, soiling y curtailment antes de interpretar forecast error.',
    'Revisar calidad de datos antes de comunicar cifras comerciales.',
  ];

  const clientNotes = [
    'Resultado conceptual y no contractual.',
    'No usa precios reales, contratos reales, facturación ni datos comerciales reales.',
  ];

  const dataQualityWarnings =
    kpis.dataQualityRiskUsd > 800
      ? [
          'Riesgo de calidad de datos elevado. Bloquear conclusión comercial automática.',
        ]
      : ['Sin bloqueo crítico de calidad de datos en este escenario mock.'];

  const safetyBoundary =
    'Este assessment comercial es mock, local y conceptual. No usa precios reales, no usa contratos reales, no calcula facturación real, no usa APIs de mercado, no integra ERP, no conecta SCADA, no lee medidores reales, no envía información al CEN, no controla BESS, no controla inversores y no modifica setpoints.';

  const base = {
    id: `commercial-impact-assessment-${plantCode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName,
    plantCode,
    assessmentStatus,
    assessmentStatusLabel: statusLabel[assessmentStatus],
    overallRiskLevel,
    overallRiskLabel: riskLabel[overallRiskLevel],
    kpis,
    assumptions,
    causeBreakdown,
    impactAssessments,
    interpretationNotes,
    omRecommendations,
    clientNotes,
    dataQualityWarnings,
    safetyBoundary,
  };

  return {
    ...base,
    internalCommercialText: buildInternalText(base),
    clientCommercialText: buildClientText(base),
  };
};
