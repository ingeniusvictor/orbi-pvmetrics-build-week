export type PVMetricsReadOnlyDataContractStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsDataContractItemType =
  | 'allowed-data-contract-item'
  | 'blocked-data-contract-item'
  | 'read-only-data-contract-principle'
  | 'required-data-domain'
  | 'required-data-field'
  | 'optional-data-field'
  | 'forbidden-data-field'
  | 'data-quality-gate'
  | 'data-sanitization-gate'
  | 'data-ownership-gate'
  | 'schema-review-gate'
  | 'risk-register-item'
  | 'exit-criterion';

export type PVMetricsDataFieldCriticality =
  | 'required'
  | 'optional'
  | 'forbidden';

export type PVMetricsDataRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsDataReviewRole =
  | 'client-owner'
  | 'technical-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'commercial-owner'
  | 'release-owner';

export type PVMetricsAllowedDataContractItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-data-contract-item';
  description: string;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedDataContractItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-data-contract-item';
  reason: string;
  safeAlternative: string;
  severity: PVMetricsDataRiskSeverity;
};

export type PVMetricsReadOnlyDataContractPrinciple = {
  principleId: string;
  label: string;
  itemType: 'read-only-data-contract-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsRequiredDataDomain = {
  domainId: string;
  label: string;
  itemType: 'required-data-domain';
  description: string;
  required: boolean;
};

export type PVMetricsBaseDataField = {
  fieldId: string;
  label: string;
  domain: string;
  expectedType: string;
  expectedUnit: string;
  description: string;
};

export type PVMetricsRequiredDataField = PVMetricsBaseDataField & {
  itemType: 'required-data-field';
  criticality: 'required';
  required: true;
};

export type PVMetricsOptionalDataField = PVMetricsBaseDataField & {
  itemType: 'optional-data-field';
  criticality: 'optional';
  required: false;
};

export type PVMetricsForbiddenDataField = {
  fieldId: string;
  label: string;
  itemType: 'forbidden-data-field';
  criticality: 'forbidden';
  reason: string;
  severity: PVMetricsDataRiskSeverity;
};

export type PVMetricsDataQualityGate = {
  gateId: string;
  label: string;
  itemType: 'data-quality-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDataSanitizationGate = {
  gateId: string;
  label: string;
  itemType: 'data-sanitization-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDataOwnershipGate = {
  gateId: string;
  label: string;
  itemType: 'data-ownership-gate';
  required: boolean;
  reviewerRole: PVMetricsDataReviewRole;
  description: string;
};

export type PVMetricsSchemaReviewGate = {
  gateId: string;
  label: string;
  itemType: 'schema-review-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDataContractRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'risk-register-item';
  severity: PVMetricsDataRiskSeverity;
  mitigation: string;
};

export type PVMetricsDataContractExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledReadOnlyDataContractPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-R — Controlled Read-Only Data Contract';
  module: string;
  internalVersion: string;
  status: PVMetricsReadOnlyDataContractStatus;
  dataContractPurpose: string[];
  allowedDataContractItems: PVMetricsAllowedDataContractItem[];
  blockedDataContractItems: PVMetricsBlockedDataContractItem[];
  readOnlyDataContractPrinciples: PVMetricsReadOnlyDataContractPrinciple[];
  requiredDataDomains: PVMetricsRequiredDataDomain[];
  requiredDataFields: PVMetricsRequiredDataField[];
  optionalDataFields: PVMetricsOptionalDataField[];
  forbiddenDataFields: PVMetricsForbiddenDataField[];
  dataQualityGates: PVMetricsDataQualityGate[];
  dataSanitizationGates: PVMetricsDataSanitizationGate[];
  dataOwnershipGates: PVMetricsDataOwnershipGate[];
  schemaReviewGates: PVMetricsSchemaReviewGate[];
  dataContractRiskRegister: PVMetricsDataContractRiskRegisterItem[];
  dataContractExitCriteria: PVMetricsDataContractExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
