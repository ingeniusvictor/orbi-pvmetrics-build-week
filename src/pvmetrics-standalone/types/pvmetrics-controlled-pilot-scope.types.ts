export type PVMetricsControlledPilotScopeStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsPilotScopeItemType =
  | 'allowed-scope-item'
  | 'blocked-scope-item'
  | 'read-only-principle'
  | 'data-access-boundary'
  | 'approval-gate'
  | 'legal-commercial-note'
  | 'risk-register-item'
  | 'exit-criterion';

export type PVMetricsPilotApprovalRole =
  | 'client-owner'
  | 'technical-owner'
  | 'qa-owner'
  | 'commercial-owner'
  | 'legal-owner'
  | 'release-owner';

export type PVMetricsControlledPilotRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsAllowedPilotScopeItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-scope-item';
  description: string;
  requiresHumanApproval: boolean;
};

export type PVMetricsBlockedPilotScopeItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-scope-item';
  reason: string;
  safeAlternative: string;
  severity: PVMetricsControlledPilotRiskSeverity;
};

export type PVMetricsReadOnlyIntegrationPrinciple = {
  principleId: string;
  label: string;
  itemType: 'read-only-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsDataAccessBoundary = {
  boundaryId: string;
  label: string;
  itemType: 'data-access-boundary';
  allowed: boolean;
  description: string;
};

export type PVMetricsPilotApprovalGateBase = {
  gateId: string;
  label: string;
  itemType: 'approval-gate';
  required: boolean;
  reviewerRole: PVMetricsPilotApprovalRole;
  description: string;
};

export type PVMetricsClientApprovalGate = PVMetricsPilotApprovalGateBase & {
  gateGroup: 'client';
};

export type PVMetricsTechnicalApprovalGate = PVMetricsPilotApprovalGateBase & {
  gateGroup: 'technical';
};

export type PVMetricsQaApprovalGate = PVMetricsPilotApprovalGateBase & {
  gateGroup: 'qa';
};

export type PVMetricsLegalCommercialReviewNote = {
  noteId: string;
  label: string;
  itemType: 'legal-commercial-note';
  ownerRole: PVMetricsPilotApprovalRole;
  note: string;
  requiresHumanReview: boolean;
};

export type PVMetricsControlledPilotRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'risk-register-item';
  severity: PVMetricsControlledPilotRiskSeverity;
  mitigation: string;
  ownerRole: PVMetricsPilotApprovalRole;
};

export type PVMetricsControlledPilotExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledPilotScopeAgreementPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-P — Controlled Pilot Scope & Read-Only Integration Agreement';
  module: string;
  internalVersion: string;
  status: PVMetricsControlledPilotScopeStatus;
  pilotScopePurpose: string[];
  allowedPilotScopeItems: PVMetricsAllowedPilotScopeItem[];
  blockedPilotScopeItems: PVMetricsBlockedPilotScopeItem[];
  readOnlyIntegrationPrinciples: PVMetricsReadOnlyIntegrationPrinciple[];
  dataAccessBoundaries: PVMetricsDataAccessBoundary[];
  clientApprovalGates: PVMetricsClientApprovalGate[];
  technicalApprovalGates: PVMetricsTechnicalApprovalGate[];
  qaApprovalGates: PVMetricsQaApprovalGate[];
  legalCommercialReviewNotes: PVMetricsLegalCommercialReviewNote[];
  pilotRiskRegister: PVMetricsControlledPilotRiskRegisterItem[];
  pilotExitCriteria: PVMetricsControlledPilotExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
