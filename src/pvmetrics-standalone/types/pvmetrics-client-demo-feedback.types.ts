export type PVMetricsClientDemoFeedbackStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsClientDemoFeedbackInputType =
  | 'manual-note'
  | 'client-question'
  | 'value-observation'
  | 'technical-observation'
  | 'operational-observation'
  | 'safety-observation'
  | 'blocked-sensitive-input';

export type PVMetricsPilotReadinessSignal =
  | 'positive'
  | 'caution'
  | 'blocking';

export type PVMetricsPilotRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsFeedbackOwnerRole =
  | 'commercial-owner'
  | 'technical-owner'
  | 'operations-owner'
  | 'qa-owner'
  | 'release-owner';

export type PVMetricsAllowedFeedbackInput = {
  inputId: string;
  label: string;
  inputType: PVMetricsClientDemoFeedbackInputType;
  description: string;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedFeedbackInput = {
  inputId: string;
  label: string;
  reason: string;
  safeAlternative: string;
  severity: PVMetricsPilotRiskSeverity;
};

export type PVMetricsFeedbackCategory = {
  categoryId: string;
  label: string;
  description: string;
  ownerRole: PVMetricsFeedbackOwnerRole;
};

export type PVMetricsPilotReadinessDimension = {
  dimensionId: string;
  label: string;
  description: string;
  minimumCondition: string;
  required: boolean;
};

export type PVMetricsClientQuestionLogRule = {
  ruleId: string;
  label: string;
  rule: string;
  escalationRole?: PVMetricsFeedbackOwnerRole;
};

export type PVMetricsReadinessSignalGuideline = {
  signalId: string;
  signal: PVMetricsPilotReadinessSignal;
  label: string;
  meaning: string;
  action: string;
};

export type PVMetricsPilotRiskRegisterItem = {
  riskId: string;
  label: string;
  severity: PVMetricsPilotRiskSeverity;
  mitigation: string;
  ownerRole: PVMetricsFeedbackOwnerRole;
};

export type PVMetricsPilotHumanReviewGate = {
  gateId: string;
  label: string;
  required: boolean;
  reviewerRole: PVMetricsFeedbackOwnerRole;
  description: string;
};

export type PVMetricsPilotReadinessExitCriterion = {
  criterionId: string;
  label: string;
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoFeedbackPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-O — Controlled Client Demo Feedback & Pilot Readiness';
  module: string;
  internalVersion: string;
  status: PVMetricsClientDemoFeedbackStatus;
  demoFeedbackPurpose: string[];
  allowedFeedbackInputs: PVMetricsAllowedFeedbackInput[];
  blockedFeedbackInputs: PVMetricsBlockedFeedbackInput[];
  feedbackCategories: PVMetricsFeedbackCategory[];
  pilotReadinessDimensions: PVMetricsPilotReadinessDimension[];
  clientQuestionLogRules: PVMetricsClientQuestionLogRule[];
  readinessSignalGuidelines: PVMetricsReadinessSignalGuideline[];
  pilotRiskRegister: PVMetricsPilotRiskRegisterItem[];
  humanReviewGates: PVMetricsPilotHumanReviewGate[];
  pilotReadinessExitCriteria: PVMetricsPilotReadinessExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
