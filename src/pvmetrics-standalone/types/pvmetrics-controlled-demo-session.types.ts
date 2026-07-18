export type PVMetricsControlledDemoSessionStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'runbook-visual-ready'
  | 'script-export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsControlledDemoSessionChecklistStatus =
  | 'ready'
  | 'requires-run'
  | 'requires-human-review'
  | 'pending'
  | 'blocked'
  | 'not-applicable';

export type PVMetricsControlledDemoSessionRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsControlledDemoSessionRoleId =
  | 'demo-operator'
  | 'technical-owner'
  | 'qa-owner'
  | 'commercial-owner'
  | 'client-observer';

export type PVMetricsDemoSessionRole = {
  roleId: PVMetricsControlledDemoSessionRoleId;
  label: string;
  responsibility: string;
};

export type PVMetricsDemoSessionPhase = {
  phaseId: string;
  label: string;
  order: number;
  objective: string;
  allowedFocus: string;
};

export type PVMetricsPreDemoChecklistItem = {
  checklistId: string;
  label: string;
  status: PVMetricsControlledDemoSessionChecklistStatus;
  command?: string;
  description: string;
  required: boolean;
};

export type PVMetricsLiveDemoScriptLine = {
  scriptId: string;
  phaseId: string;
  speakerRole: PVMetricsControlledDemoSessionRoleId;
  script: string;
  safetyNote?: string;
};

export type PVMetricsClientSafeStatement = {
  statementId: string;
  label: string;
  statement: string;
  required: boolean;
};

export type PVMetricsForbiddenDemoAction = {
  actionId: string;
  label: string;
  forbiddenAction: string;
  safeAlternative: string;
  severity: PVMetricsControlledDemoSessionRiskSeverity;
};

export type PVMetricsPauseStopCriterion = {
  criterionId: string;
  label: string;
  severity: PVMetricsControlledDemoSessionRiskSeverity;
  trigger: string;
  action: string;
};

export type PVMetricsQuestionHandlingRule = {
  ruleId: string;
  label: string;
  rule: string;
  escalationRole?: PVMetricsControlledDemoSessionRoleId;
};

export type PVMetricsEvidenceCaptureBoundary = {
  boundaryId: string;
  label: string;
  allowed: boolean;
  description: string;
  safetyNote: string;
};

export type PVMetricsPostDemoFollowUpRule = {
  ruleId: string;
  label: string;
  rule: string;
  requiresHumanReview: boolean;
};

export type PVMetricsControlledDemoHumanApprovalGate = {
  gateId: string;
  label: string;
  required: boolean;
  reviewerRole: PVMetricsControlledDemoSessionRoleId;
  description: string;
};

export type PVMetricsControlledDemoSessionRisk = {
  riskId: string;
  label: string;
  severity: PVMetricsControlledDemoSessionRiskSeverity;
  mitigation: string;
  ownerRole: PVMetricsControlledDemoSessionRoleId;
};

export type PVMetricsControlledDemoSessionExitCriterion = {
  criterionId: string;
  label: string;
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoSessionRunbookPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-N — Controlled Client Demo Session Runbook';
  module: string;
  internalVersion: string;
  status: PVMetricsControlledDemoSessionStatus;
  demoSessionPurpose: string[];
  demoSessionRoles: PVMetricsDemoSessionRole[];
  demoSessionPhases: PVMetricsDemoSessionPhase[];
  preDemoChecklist: PVMetricsPreDemoChecklistItem[];
  liveDemoScript: PVMetricsLiveDemoScriptLine[];
  clientSafeStatements: PVMetricsClientSafeStatement[];
  forbiddenDemoActions: PVMetricsForbiddenDemoAction[];
  pauseStopCriteria: PVMetricsPauseStopCriterion[];
  questionHandlingRules: PVMetricsQuestionHandlingRule[];
  evidenceCaptureBoundaries: PVMetricsEvidenceCaptureBoundary[];
  postDemoFollowUpRules: PVMetricsPostDemoFollowUpRule[];
  humanApprovalGates: PVMetricsControlledDemoHumanApprovalGate[];
  sessionRisks: PVMetricsControlledDemoSessionRisk[];
  sessionExitCriteria: PVMetricsControlledDemoSessionExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
