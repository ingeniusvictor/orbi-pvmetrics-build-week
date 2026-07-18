export type PVMetricsClientDemoPresentationScriptStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsPresentationScriptMode =
  | 'opening'
  | 'problem-framing'
  | 'solution-overview'
  | 'demo-walkthrough'
  | 'safety-disclaimer'
  | 'technical-review'
  | 'executive-summary'
  | 'next-steps'
  | 'placeholder-only';

export type PVMetricsPresentationScriptRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsPresentationScriptReviewRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'business-owner'
  | 'client-owner'
  | 'release-owner';

export type PVMetricsPresentationScriptItemType =
  | 'allowed-presentation-script-item'
  | 'blocked-presentation-script-item'
  | 'presentation-script-principle'
  | 'presentation-script-section'
  | 'presentation-script-timing-block'
  | 'presentation-script-speaker-note'
  | 'presentation-script-safety-disclaimer'
  | 'presentation-script-approval-role'
  | 'presentation-script-risk-register-item'
  | 'presentation-script-exit-criterion';

export type PVMetricsAllowedPresentationScriptItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-presentation-script-item';
  description: string;
  scriptMode: PVMetricsPresentationScriptMode;
  requiresApproval: boolean;
};

export type PVMetricsBlockedPresentationScriptItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-presentation-script-item';
  severity: PVMetricsPresentationScriptRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsPresentationScriptPrinciple = {
  principleId: string;
  label: string;
  itemType: 'presentation-script-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsPresentationScriptSection = {
  sectionId: string;
  label: string;
  itemType: 'presentation-script-section';
  scriptMode: PVMetricsPresentationScriptMode;
  description: string;
  recommendedDuration: string;
};

export type PVMetricsPresentationScriptTimingBlock = {
  timingId: string;
  label: string;
  itemType: 'presentation-script-timing-block';
  duration: string;
  description: string;
};

export type PVMetricsPresentationScriptSpeakerNote = {
  noteId: string;
  label: string;
  itemType: 'presentation-script-speaker-note';
  scriptMode: PVMetricsPresentationScriptMode;
  note: string;
  mandatory: boolean;
};

export type PVMetricsPresentationScriptSafetyDisclaimer = {
  disclaimerId: string;
  label: string;
  itemType: 'presentation-script-safety-disclaimer';
  disclaimer: string;
  mandatory: boolean;
};

export type PVMetricsPresentationScriptApprovalRole = {
  approvalId: string;
  label: string;
  itemType: 'presentation-script-approval-role';
  reviewerRole: PVMetricsPresentationScriptReviewRole;
  required: boolean;
  description: string;
};

export type PVMetricsPresentationScriptRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'presentation-script-risk-register-item';
  severity: PVMetricsPresentationScriptRiskSeverity;
  mitigation: string;
};

export type PVMetricsPresentationScriptExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'presentation-script-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoPresentationScriptPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-V — Controlled Client Demo Presentation Script';
  module: string;
  internalVersion: string;
  status: PVMetricsClientDemoPresentationScriptStatus;
  clientDemoPresentationScriptPurpose: string[];
  allowedPresentationScriptItems: PVMetricsAllowedPresentationScriptItem[];
  blockedPresentationScriptItems: PVMetricsBlockedPresentationScriptItem[];
  presentationScriptPrinciples: PVMetricsPresentationScriptPrinciple[];
  presentationScriptSections: PVMetricsPresentationScriptSection[];
  presentationScriptTimingBlocks: PVMetricsPresentationScriptTimingBlock[];
  presentationScriptSpeakerNotes: PVMetricsPresentationScriptSpeakerNote[];
  presentationScriptSafetyDisclaimers: PVMetricsPresentationScriptSafetyDisclaimer[];
  presentationScriptApprovalRoles: PVMetricsPresentationScriptApprovalRole[];
  presentationScriptRiskRegister: PVMetricsPresentationScriptRiskRegisterItem[];
  presentationScriptExitCriteria: PVMetricsPresentationScriptExitCriterion[];
  presentationScriptBoundary: string;
  nextRecommendedModule: string;
};
