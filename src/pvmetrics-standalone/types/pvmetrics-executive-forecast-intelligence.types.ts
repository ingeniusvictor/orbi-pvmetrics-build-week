export type PVMetricsExecutiveRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'not-evaluable';

export type PVMetricsExecutiveReadinessStatus =
  | 'mock-ready'
  | 'review-required'
  | 'data-quality-review'
  | 'commercial-review'
  | 'blocked';

export type PVMetricsExecutiveSummarySection =
  | 'forecast'
  | 'cen-compliance'
  | 'operational-events'
  | 'forecast-accuracy'
  | 'soiling-cleaning'
  | 'commercial-impact'
  | 'om-priority'
  | 'client-summary'
  | 'safety-boundary';

export type PVMetricsExecutiveDecisionSignal =
  | 'continue-monitoring'
  | 'review-forecast'
  | 'review-operational-events'
  | 'review-cleaning'
  | 'review-commercial-exposure'
  | 'review-data-quality'
  | 'human-review-required';

export type PVMetricsExecutiveInsight = {
  id: string;
  section: PVMetricsExecutiveSummarySection;
  title: string;
  message: string;
  riskLevel: PVMetricsExecutiveRiskLevel;
  decisionSignal: PVMetricsExecutiveDecisionSignal;
  recommendedAction: string;
};

export type PVMetricsExecutiveKpiSnapshot = {
  forecastEnergyMwh: number;
  complianceScorePct: number;
  activeOperationalEvents: number;
  forecastMapePct: number;
  eventExplainedErrorPct: number;
  soilingLossPct: number;
  commercialRevenueRiskUsd: number;
  recoverableOpportunityUsd: number;
};

export type PVMetricsExecutivePriorityItem = {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  reason: string;
  ownerHint: 'forecast' | 'om' | 'hsec' | 'commercial' | 'data-quality' | 'client';
  recommendedNextStep: string;
};

export type PVMetricsExecutiveForecastIntelligenceSummary = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;

  readinessStatus: PVMetricsExecutiveReadinessStatus;
  readinessStatusLabel: string;

  overallRiskLevel: PVMetricsExecutiveRiskLevel;
  overallRiskLabel: string;

  executiveHeadline: string;
  executiveConclusion: string;

  kpiSnapshot: PVMetricsExecutiveKpiSnapshot;
  insights: PVMetricsExecutiveInsight[];
  priorities: PVMetricsExecutivePriorityItem[];

  internalExecutiveText: string;
  clientExecutiveText: string;
  safetyBoundary: string;
};
