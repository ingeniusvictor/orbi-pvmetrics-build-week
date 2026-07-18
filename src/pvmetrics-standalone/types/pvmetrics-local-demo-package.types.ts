export type PVMetricsLocalDemoPackageStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'operator-signoff-visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsLocalDemoPackageChecklistStatus =
  | 'ready'
  | 'requires-run'
  | 'requires-human-review'
  | 'pending'
  | 'blocked'
  | 'not-applicable';

export type PVMetricsLocalDemoPackageRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsLocalDemoReviewerRole =
  | 'operator'
  | 'technical-owner'
  | 'qa-owner'
  | 'commercial-owner'
  | 'operations-owner'
  | 'release-owner';

export type PVMetricsLocalDemoPackageContentItem = {
  contentId: string;
  label: string;
  description: string;
  clientVisible: boolean;
  allowed: boolean;
  safetyNote: string;
};

export type PVMetricsBlockedRealReleaseArtifact = {
  artifactId: string;
  label: string;
  blocked: true;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsOperatorSignOffScopeItem = {
  scopeId: string;
  label: string;
  description: string;
  required: boolean;
};

export type PVMetricsOperatorPreflightChecklistItem = {
  checklistId: string;
  label: string;
  status: PVMetricsLocalDemoPackageChecklistStatus;
  command?: string;
  description: string;
  required: boolean;
};

export type PVMetricsReviewerSignOffChecklistItem = {
  checklistId: string;
  label: string;
  status: PVMetricsLocalDemoPackageChecklistStatus;
  reviewerRole: PVMetricsLocalDemoReviewerRole;
  description: string;
  required: boolean;
};

export type PVMetricsDemoEnvironmentAssumption = {
  assumptionId: string;
  label: string;
  description: string;
  mustBeTrue: boolean;
};

export type PVMetricsHumanApprovalGate = {
  gateId: string;
  label: string;
  required: boolean;
  reviewerRole: PVMetricsLocalDemoReviewerRole;
  description: string;
};

export type PVMetricsAssemblyRisk = {
  riskId: string;
  label: string;
  severity: PVMetricsLocalDemoPackageRiskSeverity;
  mitigation: string;
  ownerRole: PVMetricsLocalDemoReviewerRole;
};

export type PVMetricsAssemblyExitCriterion = {
  criterionId: string;
  label: string;
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsLocalDemoPackageAssemblyPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-M — Local Demo Package Assembly & Operator Sign-Off';
  module: string;
  internalVersion: string;
  status: PVMetricsLocalDemoPackageStatus;
  packageContents: PVMetricsLocalDemoPackageContentItem[];
  blockedRealReleaseArtifacts: PVMetricsBlockedRealReleaseArtifact[];
  operatorSignOffScope: PVMetricsOperatorSignOffScopeItem[];
  operatorPreflightChecklist: PVMetricsOperatorPreflightChecklistItem[];
  reviewerSignOffChecklist: PVMetricsReviewerSignOffChecklistItem[];
  demoEnvironmentAssumptions: PVMetricsDemoEnvironmentAssumption[];
  humanApprovalGates: PVMetricsHumanApprovalGate[];
  assemblyRisks: PVMetricsAssemblyRisk[];
  assemblyExitCriteria: PVMetricsAssemblyExitCriterion[];
  safetyBoundary: string;
  nextRecommendedModule: string;
};
