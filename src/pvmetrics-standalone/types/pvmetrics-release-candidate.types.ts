export type PVMetricsReleaseCandidateStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'readiness-visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsReleaseCandidateChecklistStatus =
  | 'ready'
  | 'requires-run'
  | 'requires-human-review'
  | 'pending'
  | 'blocked'
  | 'not-applicable';

export type PVMetricsReleaseCandidateRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsReleaseCandidateScopeItem = {
  scopeId: string;
  label: string;
  description: string;
  included: boolean;
};

export type PVMetricsDemoPackageBoundary = {
  boundaryId: string;
  label: string;
  blocked: true;
  description: string;
};

export type PVMetricsClientDemoReadinessItem = {
  readinessId: string;
  label: string;
  status: PVMetricsReleaseCandidateChecklistStatus;
  description: string;
};

export type PVMetricsTechnicalReadinessItem = {
  readinessId: string;
  label: string;
  status: PVMetricsReleaseCandidateChecklistStatus;
  command?: string;
  description: string;
};

export type PVMetricsSafetyReadinessItem = {
  readinessId: string;
  label: string;
  status: PVMetricsReleaseCandidateChecklistStatus;
  description: string;
};

export type PVMetricsBuildRequirement = {
  requirementId: string;
  label: string;
  command?: string;
  required: boolean;
  description: string;
};

export type PVMetricsAllowedDemoCapability = {
  capabilityId: string;
  label: string;
  description: string;
  clientVisible: boolean;
  safetyNote: string;
};

export type PVMetricsBlockedProductionClaim = {
  claimId: string;
  forbiddenClaim: string;
  safeAlternative: string;
  severity: PVMetricsReleaseCandidateRiskSeverity;
};

export type PVMetricsReleaseCandidateRisk = {
  riskId: string;
  label: string;
  severity: PVMetricsReleaseCandidateRiskSeverity;
  mitigation: string;
  ownerRole:
    | 'technical-owner'
    | 'qa-owner'
    | 'commercial-owner'
    | 'operations-owner'
    | 'release-owner';
};

export type PVMetricsHumanReviewGate = {
  gateId: string;
  label: string;
  required: boolean;
  reviewerRole:
    | 'technical-owner'
    | 'qa-owner'
    | 'commercial-owner'
    | 'operations-owner'
    | 'release-owner';
  description: string;
};

export type PVMetricsReleaseCandidateExitCriterion = {
  criterionId: string;
  label: string;
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsStandaloneClientDemoReleaseCandidatePack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-L — Standalone Client Demo Release Candidate';
  module: string;
  internalVersion: string;
  status: PVMetricsReleaseCandidateStatus;
  releaseCandidateScope: PVMetricsReleaseCandidateScopeItem[];
  demoPackageBoundaries: PVMetricsDemoPackageBoundary[];
  clientDemoReadinessChecklist: PVMetricsClientDemoReadinessItem[];
  technicalReadinessChecklist: PVMetricsTechnicalReadinessItem[];
  safetyReadinessChecklist: PVMetricsSafetyReadinessItem[];
  buildAndTypescriptRequirements: PVMetricsBuildRequirement[];
  allowedDemoCapabilities: PVMetricsAllowedDemoCapability[];
  blockedProductionClaims: PVMetricsBlockedProductionClaim[];
  releaseCandidateRisks: PVMetricsReleaseCandidateRisk[];
  humanReviewGates: PVMetricsHumanReviewGate[];
  exitCriteria: PVMetricsReleaseCandidateExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
