export type PVMetricsMasterClosureStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsMasterClosureMode =
  | 'technical-closure'
  | 'evidence-closure'
  | 'delivery-closure'
  | 'script-closure'
  | 'board-closure'
  | 'security-closure'
  | 'human-governance'
  | 'master-closure'
  | 'placeholder-only';

export type PVMetricsMasterClosureRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsMasterClosureReviewerRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'business-owner'
  | 'client-owner'
  | 'release-owner'
  | 'observer';

export type PVMetricsMasterClosureItemType =
  | 'completed-demo-closure-block'
  | 'allowed-master-closure-item'
  | 'blocked-master-closure-item'
  | 'master-closure-principle'
  | 'master-closure-domain'
  | 'master-closure-gate'
  | 'master-closure-approval-role'
  | 'master-closure-risk-register-item'
  | 'master-closure-exit-criterion';

export type PVMetricsCompletedDemoClosureBlock = {
  blockId: string;
  label: string;
  itemType: 'completed-demo-closure-block';
  description: string;
  closureStatus: 'closed' | 'open' | 'blocked';
};

export type PVMetricsAllowedMasterClosureItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-master-closure-item';
  description: string;
  closureMode: PVMetricsMasterClosureMode;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedMasterClosureItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-master-closure-item';
  severity: PVMetricsMasterClosureRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsMasterClosurePrinciple = {
  principleId: string;
  label: string;
  itemType: 'master-closure-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsMasterClosureDomain = {
  domainId: string;
  label: string;
  itemType: 'master-closure-domain';
  closureMode: PVMetricsMasterClosureMode;
  description: string;
};

export type PVMetricsMasterClosureGate = {
  gateId: string;
  label: string;
  itemType: 'master-closure-gate';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsMasterClosureApprovalRole = {
  approvalId: string;
  label: string;
  itemType: 'master-closure-approval-role';
  reviewerRole: PVMetricsMasterClosureReviewerRole;
  required: boolean;
  description: string;
};

export type PVMetricsMasterClosureRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'master-closure-risk-register-item';
  severity: PVMetricsMasterClosureRiskSeverity;
  mitigation: string;
};

export type PVMetricsMasterClosureExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'master-closure-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoMasterClosurePack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-X — Controlled Client Demo Master Closure';
  module: string;
  internalVersion: string;
  status: PVMetricsMasterClosureStatus;
  masterClosurePurpose: string[];
  completedDemoClosureBlocks: PVMetricsCompletedDemoClosureBlock[];
  allowedMasterClosureItems: PVMetricsAllowedMasterClosureItem[];
  blockedMasterClosureItems: PVMetricsBlockedMasterClosureItem[];
  masterClosurePrinciples: PVMetricsMasterClosurePrinciple[];
  masterClosureDomains: PVMetricsMasterClosureDomain[];
  masterClosureGates: PVMetricsMasterClosureGate[];
  masterClosureApprovalRoles: PVMetricsMasterClosureApprovalRole[];
  masterClosureRiskRegister: PVMetricsMasterClosureRiskRegisterItem[];
  masterClosureExitCriteria: PVMetricsMasterClosureExitCriterion[];
  masterClosureBoundary: string;
  nextRecommendedModule: string;
};
