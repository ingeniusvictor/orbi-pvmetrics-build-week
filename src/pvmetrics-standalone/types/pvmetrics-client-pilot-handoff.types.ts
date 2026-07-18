export type PVMetricsClientPilotHandoffStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsPilotAudienceType =
  | 'client-executive'
  | 'client-technical'
  | 'internal-qa'
  | 'internal-commercial'
  | 'operations-review';

export type PVMetricsClientHandoffSectionId =
  | 'handoff-context'
  | 'handoff-capabilities'
  | 'handoff-boundaries'
  | 'handoff-pilot-path'
  | 'handoff-review-requirements';

export type PVMetricsClientHandoffSection = {
  sectionId: PVMetricsClientHandoffSectionId;
  label: string;
  objective: string;
  clientMessage: string;
  audienceTypes: PVMetricsPilotAudienceType[];
  required: boolean;
};

export type PVMetricsAllowedPilotMaterialId =
  | 'wizard-local'
  | 'controlled-sandbox-mock'
  | 'pilot-evidence-pack'
  | 'client-demo-narrative'
  | 'presentation-flow-card'
  | 'demo-safety-locks-card'
  | 'plain-text-reports'
  | 'qa-checklist'
  | 'version-registry'
  | 'closure-snapshots'
  | 'technical-readme';

export type PVMetricsAllowedPilotMaterial = {
  materialId: PVMetricsAllowedPilotMaterialId;
  label: string;
  description: string;
  clientVisible: boolean;
  safetyNote: string;
};

export type PVMetricsBlockedPilotClaimId =
  | 'real-scada-connected'
  | 'real-meter-reading'
  | 'cen-submit-enabled'
  | 'official-reporting'
  | 'telecontrol-enabled'
  | 'setpoints-enabled'
  | 'bess-control-enabled'
  | 'inverter-control-enabled'
  | 'real-weather-api'
  | 'production-backend'
  | 'automatic-real-email'
  | 'production-ready';

export type PVMetricsBlockedPilotClaim = {
  claimId: PVMetricsBlockedPilotClaimId;
  forbiddenClaim: string;
  safeAlternative: string;
  severity: 'medium' | 'high' | 'critical';
};

export type PVMetricsPilotReadinessConditionId =
  | 'client-scope-approved'
  | 'readonly-contract'
  | 'data-sanitization'
  | 'human-review'
  | 'no-telecontrol'
  | 'qa-before-client'
  | 'rollback-defined';

export type PVMetricsPilotReadinessCondition = {
  conditionId: PVMetricsPilotReadinessConditionId;
  label: string;
  required: boolean;
  status: 'pending' | 'ready' | 'blocked' | 'requires-human-review';
  description: string;
};

export type PVMetricsHumanReviewRequirement = {
  requirementId: string;
  label: string;
  requiredBefore: string;
  reviewerRole:
    | 'technical-owner'
    | 'operations-owner'
    | 'client-owner'
    | 'qa-owner'
    | 'commercial-owner';
  required: true;
};

export type PVMetricsReadOnlyFutureIntegrationCondition = {
  conditionId: string;
  label: string;
  required: boolean;
  description: string;
  forbiddenIfMissing: boolean;
};

export type PVMetricsPilotRiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type PVMetricsPilotRiskRegisterItem = {
  riskId: string;
  label: string;
  severity: PVMetricsPilotRiskSeverity;
  mitigation: string;
  ownerRole:
    | 'technical-owner'
    | 'operations-owner'
    | 'qa-owner'
    | 'commercial-owner';
};

export type PVMetricsDecisionGateStatus =
  | 'passed'
  | 'requires-human-review'
  | 'blocked'
  | 'forbidden';

export type PVMetricsDecisionGate = {
  gateId: string;
  label: string;
  status: PVMetricsDecisionGateStatus;
  description: string;
  nextAction: string;
};

export type PVMetricsSafeNextStep = {
  stepId: string;
  order: number;
  label: string;
  description: string;
  allowed: boolean;
  requiresHumanReview: boolean;
};

export type PVMetricsPilotHandoffExitCriterion = {
  criterionId: string;
  label: string;
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsClientPilotHandoffPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-K — Client Pilot Handoff & Safe Next Steps';
  module: string;
  internalVersion: string;
  status: PVMetricsClientPilotHandoffStatus;
  handoffSections: PVMetricsClientHandoffSection[];
  allowedPilotMaterials: PVMetricsAllowedPilotMaterial[];
  blockedPilotClaims: PVMetricsBlockedPilotClaim[];
  pilotReadinessConditions: PVMetricsPilotReadinessCondition[];
  humanReviewRequirements: PVMetricsHumanReviewRequirement[];
  readOnlyFutureIntegrationConditions: PVMetricsReadOnlyFutureIntegrationCondition[];
  pilotRiskRegister: PVMetricsPilotRiskRegisterItem[];
  decisionGates: PVMetricsDecisionGate[];
  safeNextSteps: PVMetricsSafeNextStep[];
  exitCriteria: PVMetricsPilotHandoffExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
