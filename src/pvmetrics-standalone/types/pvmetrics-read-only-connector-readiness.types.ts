export type PVMetricsReadOnlyConnectorReadinessStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsConnectorReadinessItemType =
  | 'allowed-readiness-item'
  | 'blocked-readiness-item'
  | 'read-only-principle'
  | 'connector-candidate-category'
  | 'credential-secret-boundary'
  | 'data-contract-gate'
  | 'sandbox-readiness-gate'
  | 'qa-safety-gate'
  | 'risk-register-item'
  | 'exit-criterion';

export type PVMetricsConnectorCandidateStatus =
  | 'concept-only'
  | 'blocked-until-approved'
  | 'sandbox-required'
  | 'qa-required'
  | 'not-approved'
  | 'approved-for-future-review';

export type PVMetricsConnectorRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsConnectorReviewRole =
  | 'client-owner'
  | 'technical-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'commercial-owner'
  | 'release-owner';

export type PVMetricsAllowedConnectorReadinessItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-readiness-item';
  description: string;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedConnectorReadinessItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-readiness-item';
  reason: string;
  safeAlternative: string;
  severity: PVMetricsConnectorRiskSeverity;
};

export type PVMetricsReadOnlyConnectorPrinciple = {
  principleId: string;
  label: string;
  itemType: 'read-only-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsConnectorCandidateCategory = {
  categoryId: string;
  label: string;
  itemType: 'connector-candidate-category';
  status: PVMetricsConnectorCandidateStatus;
  description: string;
};

export type PVMetricsCredentialSecretBoundary = {
  boundaryId: string;
  label: string;
  itemType: 'credential-secret-boundary';
  allowed: boolean;
  description: string;
};

export type PVMetricsDataContractReviewGate = {
  gateId: string;
  label: string;
  itemType: 'data-contract-gate';
  required: boolean;
  reviewerRole: PVMetricsConnectorReviewRole;
  description: string;
};

export type PVMetricsSandboxReadinessGate = {
  gateId: string;
  label: string;
  itemType: 'sandbox-readiness-gate';
  required: boolean;
  description: string;
};

export type PVMetricsQaConnectorSafetyGate = {
  gateId: string;
  label: string;
  itemType: 'qa-safety-gate';
  required: boolean;
  description: string;
};

export type PVMetricsConnectorRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'risk-register-item';
  severity: PVMetricsConnectorRiskSeverity;
  mitigation: string;
};

export type PVMetricsConnectorExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledReadOnlyConnectorReadinessPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-Q — Controlled Read-Only Connector Readiness';
  module: string;
  internalVersion: string;
  status: PVMetricsReadOnlyConnectorReadinessStatus;
  connectorReadinessPurpose: string[];
  allowedConnectorReadinessItems: PVMetricsAllowedConnectorReadinessItem[];
  blockedConnectorReadinessItems: PVMetricsBlockedConnectorReadinessItem[];
  readOnlyConnectorPrinciples: PVMetricsReadOnlyConnectorPrinciple[];
  connectorCandidateCategories: PVMetricsConnectorCandidateCategory[];
  credentialSecretBoundaries: PVMetricsCredentialSecretBoundary[];
  dataContractReviewGates: PVMetricsDataContractReviewGate[];
  sandboxReadinessGates: PVMetricsSandboxReadinessGate[];
  qaConnectorSafetyGates: PVMetricsQaConnectorSafetyGate[];
  connectorRiskRegister: PVMetricsConnectorRiskRegisterItem[];
  connectorExitCriteria: PVMetricsConnectorExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
