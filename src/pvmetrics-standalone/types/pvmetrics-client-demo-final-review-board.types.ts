export type PVMetricsFinalReviewBoardStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsFinalReviewMode =
  | 'technical-readiness'
  | 'safety-boundary'
  | 'evidence-review'
  | 'delivery-review'
  | 'script-review'
  | 'risk-review'
  | 'human-governance'
  | 'final-closure'
  | 'placeholder-only';

export type PVMetricsFinalReviewRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsFinalReviewReviewerRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'business-owner'
  | 'client-owner'
  | 'release-owner'
  | 'observer';

export type PVMetricsFinalReviewItemType =
  | 'allowed-final-review-board-item'
  | 'blocked-final-review-board-item'
  | 'final-review-board-principle'
  | 'final-review-domain'
  | 'final-review-gate'
  | 'final-review-approval-role'
  | 'final-review-risk-register-item'
  | 'final-review-exit-criterion';

export type PVMetricsAllowedFinalReviewBoardItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-final-review-board-item';
  description: string;
  reviewMode: PVMetricsFinalReviewMode;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedFinalReviewBoardItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-final-review-board-item';
  severity: PVMetricsFinalReviewRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsFinalReviewBoardPrinciple = {
  principleId: string;
  label: string;
  itemType: 'final-review-board-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsFinalReviewDomain = {
  domainId: string;
  label: string;
  itemType: 'final-review-domain';
  reviewMode: PVMetricsFinalReviewMode;
  description: string;
};

export type PVMetricsFinalReviewGate = {
  gateId: string;
  label: string;
  itemType: 'final-review-gate';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsFinalReviewApprovalRole = {
  approvalId: string;
  label: string;
  itemType: 'final-review-approval-role';
  reviewerRole: PVMetricsFinalReviewReviewerRole;
  required: boolean;
  description: string;
};

export type PVMetricsFinalReviewRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'final-review-risk-register-item';
  severity: PVMetricsFinalReviewRiskSeverity;
  mitigation: string;
};

export type PVMetricsFinalReviewExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'final-review-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoFinalReviewBoardPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-W — Controlled Client Demo Final Review Board';
  module: string;
  internalVersion: string;
  status: PVMetricsFinalReviewBoardStatus;
  finalReviewBoardPurpose: string[];
  allowedFinalReviewBoardItems: PVMetricsAllowedFinalReviewBoardItem[];
  blockedFinalReviewBoardItems: PVMetricsBlockedFinalReviewBoardItem[];
  finalReviewBoardPrinciples: PVMetricsFinalReviewBoardPrinciple[];
  finalReviewDomains: PVMetricsFinalReviewDomain[];
  finalReviewGates: PVMetricsFinalReviewGate[];
  finalReviewApprovalRoles: PVMetricsFinalReviewApprovalRole[];
  finalReviewRiskRegister: PVMetricsFinalReviewRiskRegisterItem[];
  finalReviewExitCriteria: PVMetricsFinalReviewExitCriterion[];
  finalReviewBoundary: string;
  nextRecommendedModule: string;
};
