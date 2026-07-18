export type PVMetricsCommercialImpactSource =
  | 'mock-forecast-series'
  | 'mock-forecast-accuracy'
  | 'mock-operational-events'
  | 'mock-soiling-cleaning'
  | 'mock-availability-loss'
  | 'mock-curtailment-loss'
  | 'mock-bess-context'
  | 'manual-assumption'
  | 'future-market-api'
  | 'future-contract-data';

export type PVMetricsCommercialRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'not-evaluable';

export type PVMetricsCommercialReadinessStatus =
  | 'conceptual'
  | 'mock-ready'
  | 'data-missing'
  | 'review-required'
  | 'blocked';

export type PVMetricsCommercialImpactMetric =
  | 'estimated-lost-energy-mwh'
  | 'estimated-revenue-risk'
  | 'recoverable-revenue-opportunity'
  | 'forecast-error-commercial-exposure'
  | 'availability-commercial-impact'
  | 'soiling-commercial-impact'
  | 'curtailment-commercial-impact'
  | 'bess-separation-commercial-context'
  | 'data-quality-commercial-risk';

export type PVMetricsCommercialAssumptionType =
  | 'mock-energy-price'
  | 'mock-contract-price'
  | 'mock-merchant-price'
  | 'mock-penalty-factor'
  | 'mock-availability-factor'
  | 'mock-recovery-factor'
  | 'future-real-price'
  | 'manual-note';

export type PVMetricsCommercialImpactArea =
  | 'client-reporting'
  | 'om-prioritization'
  | 'forecast-risk'
  | 'availability-management'
  | 'soiling-cleaning'
  | 'curtailment-review'
  | 'bess-analysis'
  | 'commercial-review'
  | 'data-quality';

export type PVMetricsCommercialBlueprintFieldCategory =
  | 'plant-context'
  | 'energy-context'
  | 'price-assumption'
  | 'loss-source'
  | 'risk-context'
  | 'recovery-context'
  | 'reporting-context'
  | 'traceability'
  | 'safety-boundary';

export type PVMetricsCommercialBlueprintField = {
  id: string;
  label: string;
  category: PVMetricsCommercialBlueprintFieldCategory;
  required: boolean;
  description: string;
  validationRule: string;
};

export type PVMetricsCommercialMetricDefinition = {
  id: string;
  metric: PVMetricsCommercialImpactMetric;
  label: string;
  description: string;
  interpretation: string;
  goodDirection: 'lower-is-better' | 'higher-is-better' | 'balanced';
  safeMockAvailability: 'available-now' | 'planned' | 'not-available';
};

export type PVMetricsCommercialAssumptionDefinition = {
  id: string;
  assumptionType: PVMetricsCommercialAssumptionType;
  label: string;
  description: string;
  requiredForMockAssessment: boolean;
  mustBeMarkedAsMock: boolean;
};

export type PVMetricsCommercialImpactDefinition = {
  id: string;
  area: PVMetricsCommercialImpactArea;
  label: string;
  description: string;
  recommendedAction: string;
};

export type PVMetricsCommercialImpactBlueprint = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  blueprintStatus: PVMetricsCommercialReadinessStatus;
  blueprintStatusLabel: string;
  productTitle: string;
  productVision: string;
  commercialScope: string;
  supportedSources: PVMetricsCommercialImpactSource[];
  fields: PVMetricsCommercialBlueprintField[];
  metricDefinitions: PVMetricsCommercialMetricDefinition[];
  assumptionDefinitions: PVMetricsCommercialAssumptionDefinition[];
  impactDefinitions: PVMetricsCommercialImpactDefinition[];
  interpretationRules: string[];
  traceabilityRules: string[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
