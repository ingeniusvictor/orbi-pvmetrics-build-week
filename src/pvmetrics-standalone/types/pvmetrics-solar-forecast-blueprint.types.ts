export type PVMetricsSolarForecastHorizon =
  | 'same-day'
  | 'day-ahead'
  | 'week-ahead'
  | 'month-outlook'
  | 'regulatory-window';

export type PVMetricsSolarForecastInputCategory =
  | 'plant-profile'
  | 'weather'
  | 'historical-generation'
  | 'availability'
  | 'outage-events'
  | 'soiling'
  | 'bess'
  | 'grid-curtailment'
  | 'manual-assumption';

export type PVMetricsSolarForecastOutputCategory =
  | 'energy-forecast'
  | 'power-curve'
  | 'confidence-band'
  | 'risk-flag'
  | 'technical-explanation'
  | 'regulatory-summary'
  | 'om-recommendation';

export type PVMetricsSolarForecastKpiCategory =
  | 'accuracy'
  | 'bias'
  | 'availability-impact'
  | 'weather-impact'
  | 'soiling-impact'
  | 'bess-impact'
  | 'regulatory-readiness';

export type PVMetricsSolarForecastBlueprintStatus =
  | 'conceptual'
  | 'ready-for-mock-engine'
  | 'blocked';

export type PVMetricsSolarForecastInput = {
  id: string;
  label: string;
  category: PVMetricsSolarForecastInputCategory;
  required: boolean;
  currentAvailability: 'available-demo' | 'planned' | 'missing' | 'not-required';
  description: string;
  safetyNote: string;
};

export type PVMetricsSolarForecastOutput = {
  id: string;
  label: string;
  category: PVMetricsSolarForecastOutputCategory;
  description: string;
  differentiator: boolean;
};

export type PVMetricsSolarForecastKpi = {
  id: string;
  label: string;
  category: PVMetricsSolarForecastKpiCategory;
  unit: string;
  description: string;
  whyItMatters: string;
};

export type PVMetricsSolarForecastHorizonDefinition = {
  id: string;
  horizon: PVMetricsSolarForecastHorizon;
  label: string;
  description: string;
  intendedUse: string;
};

export type PVMetricsSolarForecastDifferentiator = {
  id: string;
  label: string;
  description: string;
  competitorGapAddressed: string;
};

export type PVMetricsSolarForecastProductBlueprint = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  blueprintStatus: PVMetricsSolarForecastBlueprintStatus;
  blueprintStatusLabel: string;
  productTitle: string;
  productVision: string;
  competitivePositioning: string;
  horizons: PVMetricsSolarForecastHorizonDefinition[];
  requiredInputs: PVMetricsSolarForecastInput[];
  expectedOutputs: PVMetricsSolarForecastOutput[];
  forecastKpis: PVMetricsSolarForecastKpi[];
  differentiators: PVMetricsSolarForecastDifferentiator[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
