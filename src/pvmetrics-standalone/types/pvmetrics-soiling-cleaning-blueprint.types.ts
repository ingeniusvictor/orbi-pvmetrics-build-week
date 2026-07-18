export type PVMetricsSoilingSource =
  | 'manual-estimate'
  | 'soiling-station'
  | 'pyranometer-comparison'
  | 'drone-thermal-inspection'
  | 'visual-field-report'
  | 'historical-performance-trend'
  | 'weather-dust-risk'
  | 'future-integration';

export type PVMetricsCleaningReadinessStatus =
  | 'conceptual'
  | 'data-missing'
  | 'review-required'
  | 'ready-for-mock-optimization'
  | 'blocked';

export type PVMetricsCleaningPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsSoilingLossMetric =
  | 'estimated-soiling-loss-pct'
  | 'estimated-energy-loss-mwh'
  | 'estimated-revenue-risk'
  | 'cleaning-payback-index'
  | 'dust-risk-index'
  | 'rain-recovery-factor'
  | 'manual-inspection-confidence'
  | 'forecast-impact-pct';

export type PVMetricsCleaningDecisionFactor =
  | 'soiling-loss'
  | 'energy-price'
  | 'water-availability'
  | 'cleaning-cost'
  | 'rain-forecast'
  | 'access-condition'
  | 'om-crew-availability'
  | 'safety-condition'
  | 'client-priority'
  | 'forecast-accuracy-impact';

export type PVMetricsSoilingImpactArea =
  | 'forecast'
  | 'performance'
  | 'forecast-accuracy'
  | 'om-planning'
  | 'client-reporting'
  | 'cleaning-schedule'
  | 'commercial-risk'
  | 'data-quality';

export type PVMetricsSoilingBlueprintFieldCategory =
  | 'plant-context'
  | 'soiling-source'
  | 'loss-estimation'
  | 'cleaning-context'
  | 'weather-context'
  | 'cost-context'
  | 'safety-context'
  | 'traceability';

export type PVMetricsSoilingBlueprintField = {
  id: string;
  label: string;
  category: PVMetricsSoilingBlueprintFieldCategory;
  required: boolean;
  description: string;
  validationRule: string;
};

export type PVMetricsSoilingMetricDefinition = {
  id: string;
  metric: PVMetricsSoilingLossMetric;
  label: string;
  description: string;
  interpretation: string;
  goodDirection: 'lower-is-better' | 'higher-is-better' | 'balanced';
  safeMockAvailability: 'available-now' | 'planned' | 'not-available';
};

export type PVMetricsCleaningDecisionFactorDefinition = {
  id: string;
  factor: PVMetricsCleaningDecisionFactor;
  label: string;
  description: string;
  impactOnDecision: string;
  requiredForRecommendation: boolean;
};

export type PVMetricsSoilingImpactDefinition = {
  id: string;
  area: PVMetricsSoilingImpactArea;
  label: string;
  description: string;
  recommendedAction: string;
};

export type PVMetricsSoilingCleaningBlueprint = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  blueprintStatus: PVMetricsCleaningReadinessStatus;
  blueprintStatusLabel: string;
  productTitle: string;
  productVision: string;
  competitivePositioning: string;
  supportedSources: PVMetricsSoilingSource[];
  fields: PVMetricsSoilingBlueprintField[];
  metricDefinitions: PVMetricsSoilingMetricDefinition[];
  decisionFactors: PVMetricsCleaningDecisionFactorDefinition[];
  impactDefinitions: PVMetricsSoilingImpactDefinition[];
  interpretationRules: string[];
  traceabilityRules: string[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
