export type PVMetricsCenComplianceWindow =
  | 'day-ahead'
  | 'intraday-update'
  | 'weekly-planning'
  | 'monthly-operational-review'
  | 'pmgd-operational-report-concept';

export type PVMetricsCenComplianceStatus =
  | 'conceptual'
  | 'draft-ready'
  | 'missing-required-data'
  | 'blocked';

export type PVMetricsCenComplianceFieldCategory =
  | 'plant-identification'
  | 'forecast-energy'
  | 'forecast-power'
  | 'availability'
  | 'limitations'
  | 'weather-assumption'
  | 'timestamp'
  | 'traceability'
  | 'responsible-party'
  | 'safety-boundary';

export type PVMetricsCenComplianceField = {
  id: string;
  label: string;
  category: PVMetricsCenComplianceFieldCategory;
  required: boolean;
  currentAvailability: 'available-demo' | 'planned' | 'missing' | 'not-required';
  description: string;
  validationRule: string;
};

export type PVMetricsCenComplianceCheckSeverity =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export type PVMetricsCenComplianceCheck = {
  id: string;
  label: string;
  severity: PVMetricsCenComplianceCheckSeverity;
  category:
    | 'data-completeness'
    | 'forecast-consistency'
    | 'traceability'
    | 'regulatory-readiness'
    | 'safety'
    | 'human-review';
  description: string;
  blocksSubmission: boolean;
};

export type PVMetricsCenComplianceWindowDefinition = {
  id: string;
  window: PVMetricsCenComplianceWindow;
  label: string;
  objective: string;
  intendedUse: string;
};

export type PVMetricsCenComplianceBlueprint = {
  id: string;
  appName: string;
  generatedAtLabel: string;
  blueprintStatus: PVMetricsCenComplianceStatus;
  blueprintStatusLabel: string;
  productTitle: string;
  productVision: string;
  competitivePositioning: string;
  windows: PVMetricsCenComplianceWindowDefinition[];
  conceptualFields: PVMetricsCenComplianceField[];
  complianceChecks: PVMetricsCenComplianceCheck[];
  regulatoryNotes: string[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
