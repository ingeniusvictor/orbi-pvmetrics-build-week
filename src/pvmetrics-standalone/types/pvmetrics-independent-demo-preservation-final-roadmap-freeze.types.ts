export type PVMetricsFinalFreezeStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsFinalFreezeMode =
  | 'roadmap-freeze'
  | 'qa-preservation'
  | 'boundary-lock'
  | 'anti-mix-final-review'
  | 'human-governance'
  | 'placeholder-only';

export type PVMetricsFinalFreezeRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsFinalFreezeReviewerRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'business-owner'
  | 'observer';

export type PVMetricsFinalFreezeItemType =
  | 'preserved-roadmap-block'
  | 'allowed-final-freeze-item'
  | 'blocked-final-freeze-item'
  | 'final-freeze-principle'
  | 'final-freeze-domain'
  | 'final-freeze-gate'
  | 'final-freeze-role'
  | 'final-freeze-risk-register-item'
  | 'final-freeze-exit-criterion';

export type PVMetricsPreservedRoadmapBlock = {
  blockId: string;
  label: string;
  itemType: 'preserved-roadmap-block';
  description: string;
  freezeStatus:
    | 'preserved-conceptually'
    | 'not-preserved'
    | 'blocked';
};

export type PVMetricsAllowedFinalFreezeItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-final-freeze-item';
  description: string;
  freezeMode: PVMetricsFinalFreezeMode;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedFinalFreezeItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-final-freeze-item';
  severity: PVMetricsFinalFreezeRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsFinalFreezePrinciple = {
  principleId: string;
  label: string;
  itemType: 'final-freeze-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsFinalFreezeDomain = {
  domainId: string;
  label: string;
  itemType: 'final-freeze-domain';
  freezeMode: PVMetricsFinalFreezeMode;
  description: string;
};

export type PVMetricsFinalFreezeGate = {
  gateId: string;
  label: string;
  itemType: 'final-freeze-gate';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsFinalFreezeRole = {
  roleId: string;
  label: string;
  itemType: 'final-freeze-role';
  reviewerRole: PVMetricsFinalFreezeReviewerRole;
  required: boolean;
  description: string;
};

export type PVMetricsFinalFreezeRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'final-freeze-risk-register-item';
  severity: PVMetricsFinalFreezeRiskSeverity;
  mitigation: string;
};

export type PVMetricsFinalFreezeExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'final-freeze-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-Z — Independent Demo Preservation & Final Roadmap Freeze';
  module: string;
  internalVersion: string;
  status: PVMetricsFinalFreezeStatus;
  finalPreservationPurpose: string[];
  preservedRoadmapBlocks: PVMetricsPreservedRoadmapBlock[];
  allowedFinalFreezeItems: PVMetricsAllowedFinalFreezeItem[];
  blockedFinalFreezeItems: PVMetricsBlockedFinalFreezeItem[];
  finalFreezePrinciples: PVMetricsFinalFreezePrinciple[];
  finalFreezeDomains: PVMetricsFinalFreezeDomain[];
  finalFreezeGates: PVMetricsFinalFreezeGate[];
  finalFreezeRoles: PVMetricsFinalFreezeRole[];
  finalFreezeRiskRegister: PVMetricsFinalFreezeRiskRegisterItem[];
  finalFreezeExitCriteria: PVMetricsFinalFreezeExitCriterion[];
  finalFreezeBoundary: string;
  nextRecommendedModule: string;
};
