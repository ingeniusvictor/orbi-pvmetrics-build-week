export type PVMetricsOperationalEventCategory =
  | 'planned-maintenance'
  | 'forced-outage'
  | 'partial-derating'
  | 'grid-curtailment'
  | 'inverter-issue'
  | 'bess-limitation'
  | 'weather-related'
  | 'soiling-related'
  | 'communication-loss'
  | 'data-quality-issue'
  | 'manual-note';

export type PVMetricsOperationalEventStatus =
  | 'draft'
  | 'active'
  | 'under-review'
  | 'resolved'
  | 'cancelled';

export type PVMetricsOperationalEventSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsOperationalEventImpactArea =
  | 'forecast'
  | 'availability'
  | 'performance'
  | 'cen-compliance'
  | 'bess-separation'
  | 'data-quality'
  | 'om-planning';

export type PVMetricsOperationalEventFieldCategory =
  | 'event-identification'
  | 'time-window'
  | 'affected-asset'
  | 'impact-estimation'
  | 'evidence'
  | 'responsible-party'
  | 'traceability'
  | 'safety-boundary';

export type PVMetricsOperationalEventField = {
  id: string;
  label: string;
  category: PVMetricsOperationalEventFieldCategory;
  required: boolean;
  description: string;
  validationRule: string;
};

export type PVMetricsOperationalEventImpactDefinition = {
  id: string;
  area: PVMetricsOperationalEventImpactArea;
  label: string;
  description: string;
  forecastEffect: string;
};

export type PVMetricsOperationalEventBlueprintItem = {
  id: string;
  category: PVMetricsOperationalEventCategory;
  label: string;
  description: string;
  defaultSeverity: PVMetricsOperationalEventSeverity;
  impactedAreas: PVMetricsOperationalEventImpactArea[];
  requiredFields: string[];
  recommendedAction: string;
};

export type PVMetricsOperationalEventBlueprint = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  blueprintStatus: 'conceptual' | 'ready-for-mock-engine' | 'blocked';
  blueprintStatusLabel: string;
  productTitle: string;
  productVision: string;
  competitivePositioning: string;
  eventTypes: PVMetricsOperationalEventBlueprintItem[];
  fields: PVMetricsOperationalEventField[];
  impactDefinitions: PVMetricsOperationalEventImpactDefinition[];
  traceabilityRules: string[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
