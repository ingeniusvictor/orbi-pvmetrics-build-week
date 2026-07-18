export type PVMetricsClientDemoEvidenceFreezeStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsDemoEvidenceMode =
  | 'text-only'
  | 'visual-summary'
  | 'qa-trace'
  | 'safety-boundary'
  | 'demo-readiness'
  | 'placeholder-only';

export type PVMetricsDemoEvidenceRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsDemoEvidenceReviewRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'client-owner'
  | 'release-owner';

export type PVMetricsDemoEvidenceItemType =
  | 'allowed-demo-evidence-item'
  | 'blocked-demo-evidence-item'
  | 'demo-evidence-freeze-principle'
  | 'demo-evidence-category'
  | 'demo-evidence-review-gate'
  | 'demo-evidence-safety-gate'
  | 'demo-evidence-approval-role'
  | 'demo-evidence-risk-register-item'
  | 'demo-evidence-exit-criterion';

export type PVMetricsAllowedDemoEvidenceItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-demo-evidence-item';
  description: string;
  evidenceMode: PVMetricsDemoEvidenceMode;
  requiresApproval: boolean;
};

export type PVMetricsBlockedDemoEvidenceItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-demo-evidence-item';
  severity: PVMetricsDemoEvidenceRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsDemoEvidenceFreezePrinciple = {
  principleId: string;
  label: string;
  itemType: 'demo-evidence-freeze-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsDemoEvidenceCategory = {
  categoryId: string;
  label: string;
  itemType: 'demo-evidence-category';
  description: string;
  evidenceMode: PVMetricsDemoEvidenceMode;
};

export type PVMetricsDemoEvidenceReviewGate = {
  gateId: string;
  label: string;
  itemType: 'demo-evidence-review-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDemoEvidenceSafetyGate = {
  gateId: string;
  label: string;
  itemType: 'demo-evidence-safety-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDemoEvidenceApprovalRole = {
  approvalId: string;
  label: string;
  itemType: 'demo-evidence-approval-role';
  reviewerRole: PVMetricsDemoEvidenceReviewRole;
  required: boolean;
  description: string;
};

export type PVMetricsDemoEvidenceRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'demo-evidence-risk-register-item';
  severity: PVMetricsDemoEvidenceRiskSeverity;
  mitigation: string;
};

export type PVMetricsDemoEvidenceExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'demo-evidence-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoEvidenceFreezePack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-T — Controlled Client Demo Evidence Freeze';
  module: string;
  internalVersion: string;
  status: PVMetricsClientDemoEvidenceFreezeStatus;
  clientDemoEvidencePurpose: string[];
  allowedDemoEvidenceItems: PVMetricsAllowedDemoEvidenceItem[];
  blockedDemoEvidenceItems: PVMetricsBlockedDemoEvidenceItem[];
  demoEvidenceFreezePrinciples: PVMetricsDemoEvidenceFreezePrinciple[];
  demoEvidenceCategories: PVMetricsDemoEvidenceCategory[];
  demoEvidenceReviewGates: PVMetricsDemoEvidenceReviewGate[];
  demoEvidenceSafetyGates: PVMetricsDemoEvidenceSafetyGate[];
  demoEvidenceApprovalRoles: PVMetricsDemoEvidenceApprovalRole[];
  demoEvidenceRiskRegister: PVMetricsDemoEvidenceRiskRegisterItem[];
  demoEvidenceExitCriteria: PVMetricsDemoEvidenceExitCriterion[];
  evidenceFreezeBoundary: string;
  nextRecommendedModule: string;
};
