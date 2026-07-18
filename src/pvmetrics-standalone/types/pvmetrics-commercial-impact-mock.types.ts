import {
  PVMetricsCommercialAssumptionType,
  PVMetricsCommercialImpactArea,
  PVMetricsCommercialImpactMetric,
  PVMetricsCommercialImpactSource,
  PVMetricsCommercialRiskLevel,
} from './pvmetrics-commercial-impact-blueprint.types';

export type PVMetricsCommercialAssessmentStatus =
  | 'mock-monitoring'
  | 'mock-review-required'
  | 'mock-high-exposure'
  | 'mock-critical-exposure'
  | 'blocked-by-data-quality';

export type PVMetricsCommercialKpis = {
  estimatedLostEnergyMwh: number;
  mockEnergyPriceUsdMwh: number;
  estimatedRevenueRiskUsd: number;
  recoverableRevenueOpportunityUsd: number;
  forecastErrorExposureUsd: number;
  availabilityImpactUsd: number;
  soilingImpactUsd: number;
  curtailmentImpactUsd: number;
  dataQualityRiskUsd: number;
};

export type PVMetricsCommercialAssumption = {
  assumptionType: PVMetricsCommercialAssumptionType;
  label: string;
  valueLabel: string;
  explanation: string;
  isMock: true;
};

export type PVMetricsCommercialCauseBreakdownItem = {
  source: PVMetricsCommercialImpactSource;
  metric: PVMetricsCommercialImpactMetric;
  label: string;
  estimatedEnergyMwh: number;
  estimatedValueUsd: number;
  contributionPct: number;
  riskLevel: PVMetricsCommercialRiskLevel;
  explanation: string;
};

export type PVMetricsCommercialImpactAssessment = {
  area: PVMetricsCommercialImpactArea;
  label: string;
  riskLevel: PVMetricsCommercialRiskLevel;
  valueLabel: string;
  explanation: string;
  recommendedAction: string;
};

export type PVMetricsCommercialImpactMockAssessment = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;

  assessmentStatus: PVMetricsCommercialAssessmentStatus;
  assessmentStatusLabel: string;
  overallRiskLevel: PVMetricsCommercialRiskLevel;
  overallRiskLabel: string;

  kpis: PVMetricsCommercialKpis;
  assumptions: PVMetricsCommercialAssumption[];
  causeBreakdown: PVMetricsCommercialCauseBreakdownItem[];
  impactAssessments: PVMetricsCommercialImpactAssessment[];

  interpretationNotes: string[];
  omRecommendations: string[];
  clientNotes: string[];
  dataQualityWarnings: string[];

  internalCommercialText: string;
  clientCommercialText: string;
  safetyBoundary: string;
};
