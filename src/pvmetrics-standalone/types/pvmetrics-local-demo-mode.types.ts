export type PVMetricsLocalDemoModeStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-state-ready'
  | 'visual-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsDemoAudienceModeId =
  | 'executive-demo'
  | 'technical-demo'
  | 'internal-qa-demo';

export type PVMetricsDemoAudienceMode = {
  audienceId: PVMetricsDemoAudienceModeId;
  label: string;
  description: string;
  allowedFocus: string[];
  blockedFocus: string[];
};

export type PVMetricsDemoSafetyLockId =
  | 'no-real-data'
  | 'no-network'
  | 'no-persistence'
  | 'no-mutation'
  | 'no-operational-control'
  | 'no-secrets';

export type PVMetricsDemoSafetyLockStatus =
  | 'locked'
  | 'warning'
  | 'blocked'
  | 'pending-review';

export type PVMetricsDemoSafetyLock = {
  lockId: PVMetricsDemoSafetyLockId;
  label: string;
  status: PVMetricsDemoSafetyLockStatus;
  enforced: true;
  description: string;
};

export type PVMetricsPresentationStageId =
  | 'context-and-scope'
  | 'product-readiness'
  | 'controlled-sandbox'
  | 'pilot-evidence'
  | 'next-steps';

export type PVMetricsPresentationStage = {
  stageId: PVMetricsPresentationStageId;
  order: number;
  label: string;
  objective: string;
  safetyReminder: string;
  audienceModes: PVMetricsDemoAudienceModeId[];
};

export type PVMetricsSafeDemoScriptLine = {
  lineId: string;
  order: number;
  text: string;
  required: boolean;
};

export type PVMetricsOperatorNote = {
  noteId: string;
  label: string;
  severity: 'info' | 'warning' | 'critical';
  instruction: string;
};

export type PVMetricsClientNarrativeGuardrail = {
  guardrailId: string;
  label: string;
  preferredLanguage: string;
  forbiddenLanguage: string;
};

export type PVMetricsDemoForbiddenCapability =
  | 'PDF_EXPORT_REAL'
  | 'EMAIL_SEND_REAL'
  | 'BACKEND'
  | 'REAL_CONNECTOR'
  | 'SCADA_CONNECTION'
  | 'METER_READING'
  | 'WEATHER_API'
  | 'CEN_SUBMIT'
  | 'CREDENTIALS'
  | 'TOKENS'
  | 'SECRETS'
  | 'LOCAL_STORAGE'
  | 'POST_PUT_PATCH_DELETE'
  | 'TELECONTROL'
  | 'SETPOINTS'
  | 'BESS_COMMANDS'
  | 'INVERTER_COMMANDS'
  | 'ERP_WRITE'
  | 'BILLING'
  | 'WORK_ORDER_CREATE';

export type PVMetricsDemoExitCriterion = {
  criterionId: string;
  label: string;
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsLocalDemoModeState = {
  stateId: string;
  generatedAtLabel: string;
  status: PVMetricsLocalDemoModeStatus;
  activeAudienceMode: PVMetricsDemoAudienceModeId;
  isRuntimeToggleEnabled: false;
  isPersistent: false;
  isNetworkEnabled: false;
  safetyLocks: PVMetricsDemoSafetyLock[];
  forbiddenCapabilities: PVMetricsDemoForbiddenCapability[];
  safetyBoundary: string;
};

export type PVMetricsPresentationFlowPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-J — Local Demo Mode Hardening & Presentation Flow';
  module: string;
  internalVersion: string;
  status: PVMetricsLocalDemoModeStatus;
  audienceModes: PVMetricsDemoAudienceMode[];
  presentationStages: PVMetricsPresentationStage[];
  safeDemoScript: PVMetricsSafeDemoScriptLine[];
  operatorNotes: PVMetricsOperatorNote[];
  clientNarrativeGuardrails: PVMetricsClientNarrativeGuardrail[];
  exitCriteria: PVMetricsDemoExitCriterion[];
  demoModeState: PVMetricsLocalDemoModeState;
  nextRecommendedModule: string;
};
