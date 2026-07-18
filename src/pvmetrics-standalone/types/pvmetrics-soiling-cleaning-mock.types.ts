import {
  PVMetricsCleaningDecisionFactor,
  PVMetricsCleaningPriority,
  PVMetricsSoilingImpactArea,
  PVMetricsSoilingSource,
} from './pvmetrics-soiling-cleaning-blueprint.types';

export type PVMetricsSoilingCleaningRecommendationStatus =
  | 'monitor'
  | 'wait-for-rain'
  | 'review-cleaning'
  | 'cleaning-recommended'
  | 'blocked-by-safety';

export type PVMetricsSoilingCleaningKpis = {
  estimatedSoilingLossPct: number;
  estimatedEnergyLossMwh: number;
  estimatedRecoveredEnergyMwh: number;
  cleaningPaybackIndex: number;
  dustRiskIndex: number;
  rainRecoveryFactorPct: number;
  forecastImpactPct: number;
  inspectionConfidencePct: number;
};

export type PVMetricsSoilingDecisionFactorAssessment = {
  factor: PVMetricsCleaningDecisionFactor;
  label: string;
  status: 'favorable' | 'neutral' | 'unfavorable' | 'blocking';
  valueLabel: string;
  explanation: string;
};

export type PVMetricsSoilingImpactAssessment = {
  area: PVMetricsSoilingImpactArea;
  label: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
};

export type PVMetricsSoilingCleaningMockAssessment = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;

  source: PVMetricsSoilingSource;
  sourceLabel: string;

  recommendationStatus: PVMetricsSoilingCleaningRecommendationStatus;
  recommendationStatusLabel: string;
  cleaningPriority: PVMetricsCleaningPriority;
  cleaningPriorityLabel: string;

  kpis: PVMetricsSoilingCleaningKpis;
  decisionFactors: PVMetricsSoilingDecisionFactorAssessment[];
  impacts: PVMetricsSoilingImpactAssessment[];

  interpretationNotes: string[];
  omRecommendations: string[];
  clientNotes: string[];
  safetyWarnings: string[];

  internalSoilingText: string;
  clientSoilingText: string;
  safetyBoundary: string;
};
