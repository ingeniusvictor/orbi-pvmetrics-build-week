export type PVMetricsForecastAccuracyMetric =
  | 'mae'
  | 'rmse'
  | 'mape'
  | 'wmape'
  | 'bias'
  | 'nmae'
  | 'nrmse'
  | 'confidence-hit-rate'
  | 'forecast-availability-adjusted-error'
  | 'event-explained-error';

export type PVMetricsForecastAccuracyWindow =
  | 'intraday'
  | 'day-ahead'
  | 'rolling-7-days'
  | 'rolling-30-days'
  | 'monthly-review'
  | 'event-window';

export type PVMetricsForecastAccuracyLevel =
  | 'excellent'
  | 'good'
  | 'needs-review'
  | 'poor'
  | 'not-evaluable';

export type PVMetricsForecastErrorCategory =
  | 'weather-error'
  | 'availability-error'
  | 'soiling-error'
  | 'bess-separation-error'
  | 'curtailment-error'
  | 'data-quality-error'
  | 'model-bias'
  | 'unexplained-error';

export type PVMetricsForecastAccuracyImpactArea =
  | 'forecast-quality'
  | 'om-planning'
  | 'cen-compliance'
  | 'client-reporting'
  | 'bess-analysis'
  | 'data-governance'
  | 'commercial-risk';

export type PVMetricsForecastAccuracyMetricDefinition = {
  id: string;
  metric: PVMetricsForecastAccuracyMetric;
  label: string;
  description: string;
  interpretation: string;
  goodDirection: 'lower-is-better' | 'higher-is-better' | 'zero-is-ideal';
  requiresActualGeneration: boolean;
  safeMockAvailability: 'available-now' | 'planned' | 'not-available';
};

export type PVMetricsForecastAccuracyWindowDefinition = {
  id: string;
  window: PVMetricsForecastAccuracyWindow;
  label: string;
  objective: string;
  useCase: string;
};

export type PVMetricsForecastErrorCategoryDefinition = {
  id: string;
  category: PVMetricsForecastErrorCategory;
  label: string;
  description: string;
  typicalEvidence: string;
  relatedOperationalEventCategories: string[];
  impactedAreas: PVMetricsForecastAccuracyImpactArea[];
  recommendedAction: string;
};

export type PVMetricsForecastAccuracyReadinessCheck = {
  id: string;
  label: string;
  required: boolean;
  description: string;
  blocksAccuracyAssessment: boolean;
};

export type PVMetricsForecastAccuracyBlueprint = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  blueprintStatus: 'conceptual' | 'ready-for-mock-engine' | 'blocked';
  blueprintStatusLabel: string;
  productTitle: string;
  productVision: string;
  competitivePositioning: string;
  metricDefinitions: PVMetricsForecastAccuracyMetricDefinition[];
  evaluationWindows: PVMetricsForecastAccuracyWindowDefinition[];
  errorCategories: PVMetricsForecastErrorCategoryDefinition[];
  readinessChecks: PVMetricsForecastAccuracyReadinessCheck[];
  interpretationRules: string[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
