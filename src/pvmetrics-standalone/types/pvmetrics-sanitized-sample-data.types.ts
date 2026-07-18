export type PVMetricsSanitizedSampleDataStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsSampleDataMode =
  | 'synthetic'
  | 'sanitized'
  | 'demo-only'
  | 'placeholder-only';

export type PVMetricsSampleDataRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsSampleDataReviewRole =
  | 'technical-owner'
  | 'qa-owner'
  | 'client-owner'
  | 'security-owner'
  | 'release-owner';

export type PVMetricsSampleDataItemType =
  | 'allowed-sample-data-item'
  | 'blocked-sample-data-item'
  | 'sanitized-sample-data-principle'
  | 'synthetic-sample-rule'
  | 'sanitization-requirement'
  | 'forbidden-sample-content'
  | 'sample-data-domain'
  | 'sample-data-field-placeholder'
  | 'sample-data-quality-gate'
  | 'sample-data-privacy-gate'
  | 'sample-data-approval-gate'
  | 'sample-data-risk-register-item'
  | 'sample-data-exit-criterion';

export type PVMetricsAllowedSampleDataItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-sample-data-item';
  description: string;
  sampleMode: PVMetricsSampleDataMode;
  requiresApproval: boolean;
};

export type PVMetricsBlockedSampleDataItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-sample-data-item';
  severity: PVMetricsSampleDataRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsSanitizedSampleDataPrinciple = {
  principleId: string;
  label: string;
  itemType: 'sanitized-sample-data-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsSyntheticSampleRule = {
  ruleId: string;
  label: string;
  itemType: 'synthetic-sample-rule';
  description: string;
  mandatory: boolean;
};

export type PVMetricsSanitizationRequirement = {
  requirementId: string;
  label: string;
  itemType: 'sanitization-requirement';
  description: string;
  required: boolean;
};

export type PVMetricsForbiddenSampleContent = {
  contentId: string;
  label: string;
  itemType: 'forbidden-sample-content';
  severity: PVMetricsSampleDataRiskSeverity;
  reason: string;
};

export type PVMetricsSampleDataDomain = {
  domainId: string;
  label: string;
  itemType: 'sample-data-domain';
  description: string;
  sampleMode: PVMetricsSampleDataMode;
};

export type PVMetricsSampleDataFieldPlaceholder = {
  placeholderId: string;
  label: string;
  itemType: 'sample-data-field-placeholder';
  placeholderValue: string;
  sampleMode: PVMetricsSampleDataMode;
  rule: string;
};

export type PVMetricsSampleDataQualityGate = {
  gateId: string;
  label: string;
  itemType: 'sample-data-quality-gate';
  required: boolean;
  description: string;
};

export type PVMetricsSampleDataPrivacyGate = {
  gateId: string;
  label: string;
  itemType: 'sample-data-privacy-gate';
  required: boolean;
  description: string;
};

export type PVMetricsSampleDataApprovalGate = {
  gateId: string;
  label: string;
  itemType: 'sample-data-approval-gate';
  reviewerRole: PVMetricsSampleDataReviewRole;
  required: boolean;
  description: string;
};

export type PVMetricsSampleDataRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'sample-data-risk-register-item';
  severity: PVMetricsSampleDataRiskSeverity;
  mitigation: string;
};

export type PVMetricsSampleDataExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'sample-data-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledSanitizedSampleDataPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-S — Controlled Sanitized Sample Data';
  module: string;
  internalVersion: string;
  status: PVMetricsSanitizedSampleDataStatus;
  sampleDataPurpose: string[];
  allowedSampleDataItems: PVMetricsAllowedSampleDataItem[];
  blockedSampleDataItems: PVMetricsBlockedSampleDataItem[];
  sanitizedSampleDataPrinciples: PVMetricsSanitizedSampleDataPrinciple[];
  syntheticSampleRules: PVMetricsSyntheticSampleRule[];
  sanitizationRequirements: PVMetricsSanitizationRequirement[];
  forbiddenSampleContent: PVMetricsForbiddenSampleContent[];
  sampleDataDomains: PVMetricsSampleDataDomain[];
  sampleDataFieldPlaceholders: PVMetricsSampleDataFieldPlaceholder[];
  sampleDataQualityGates: PVMetricsSampleDataQualityGate[];
  sampleDataPrivacyGates: PVMetricsSampleDataPrivacyGate[];
  sampleDataApprovalGates: PVMetricsSampleDataApprovalGate[];
  sampleDataRiskRegister: PVMetricsSampleDataRiskRegisterItem[];
  sampleDataExitCriteria: PVMetricsSampleDataExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
