export type PVMetricsArchiveMaintenanceStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsArchiveMaintenanceMode =
  | 'archive-state'
  | 'read-only-qa'
  | 'boundary-preservation'
  | 'maintenance-notes'
  | 'anti-mix-review'
  | 'human-governance'
  | 'placeholder-only';

export type PVMetricsArchiveMaintenanceRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsArchiveMaintenanceReviewerRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'business-owner'
  | 'observer';

export type PVMetricsArchiveMaintenanceItemType =
  | 'archived-demo-closure-block'
  | 'allowed-archive-maintenance-item'
  | 'blocked-archive-maintenance-item'
  | 'archive-maintenance-principle'
  | 'archive-maintenance-domain'
  | 'archive-maintenance-gate'
  | 'archive-maintenance-role'
  | 'archive-maintenance-risk-register-item'
  | 'archive-maintenance-exit-criterion';

export type PVMetricsArchivedDemoClosureBlock = {
  blockId: string;
  label: string;
  itemType: 'archived-demo-closure-block';
  description: string;
  archiveStatus: 'conceptually-archived' | 'not-archived' | 'blocked';
};

export type PVMetricsAllowedArchiveMaintenanceItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-archive-maintenance-item';
  description: string;
  maintenanceMode: PVMetricsArchiveMaintenanceMode;
  requiresHumanReview: boolean;
};

export type PVMetricsBlockedArchiveMaintenanceItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-archive-maintenance-item';
  severity: PVMetricsArchiveMaintenanceRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsArchiveMaintenancePrinciple = {
  principleId: string;
  label: string;
  itemType: 'archive-maintenance-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsArchiveMaintenanceDomain = {
  domainId: string;
  label: string;
  itemType: 'archive-maintenance-domain';
  maintenanceMode: PVMetricsArchiveMaintenanceMode;
  description: string;
};

export type PVMetricsArchiveMaintenanceGate = {
  gateId: string;
  label: string;
  itemType: 'archive-maintenance-gate';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsArchiveMaintenanceRole = {
  roleId: string;
  label: string;
  itemType: 'archive-maintenance-role';
  reviewerRole: PVMetricsArchiveMaintenanceReviewerRole;
  required: boolean;
  description: string;
};

export type PVMetricsArchiveMaintenanceRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'archive-maintenance-risk-register-item';
  severity: PVMetricsArchiveMaintenanceRiskSeverity;
  mitigation: string;
};

export type PVMetricsArchiveMaintenanceExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'archive-maintenance-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-Y — Controlled Client Demo Archive & Read-Only Maintenance';
  module: string;
  internalVersion: string;
  status: PVMetricsArchiveMaintenanceStatus;
  archiveMaintenancePurpose: string[];
  archivedDemoClosureBlocks: PVMetricsArchivedDemoClosureBlock[];
  allowedArchiveMaintenanceItems: PVMetricsAllowedArchiveMaintenanceItem[];
  blockedArchiveMaintenanceItems: PVMetricsBlockedArchiveMaintenanceItem[];
  archiveMaintenancePrinciples: PVMetricsArchiveMaintenancePrinciple[];
  archiveMaintenanceDomains: PVMetricsArchiveMaintenanceDomain[];
  archiveMaintenanceGates: PVMetricsArchiveMaintenanceGate[];
  archiveMaintenanceRoles: PVMetricsArchiveMaintenanceRole[];
  archiveMaintenanceRiskRegister: PVMetricsArchiveMaintenanceRiskRegisterItem[];
  archiveMaintenanceExitCriteria: PVMetricsArchiveMaintenanceExitCriterion[];
  archiveMaintenanceBoundary: string;
  nextRecommendedModule: string;
};
