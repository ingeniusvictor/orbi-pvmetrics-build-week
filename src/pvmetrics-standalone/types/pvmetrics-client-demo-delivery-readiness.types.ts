export type PVMetricsClientDemoDeliveryReadinessStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'export-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsDeliveryMode =
  | 'text-only'
  | 'checklist-only'
  | 'safety-boundary'
  | 'agenda-outline'
  | 'speaking-points'
  | 'readiness-summary'
  | 'placeholder-only';

export type PVMetricsDeliveryRiskSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsDeliveryReviewRole =
  | 'demo-owner'
  | 'qa-owner'
  | 'security-owner'
  | 'technical-owner'
  | 'business-owner'
  | 'client-owner'
  | 'release-owner';

export type PVMetricsDeliveryReadinessItemType =
  | 'allowed-delivery-readiness-item'
  | 'blocked-delivery-readiness-item'
  | 'delivery-readiness-principle'
  | 'delivery-readiness-category'
  | 'delivery-preparation-gate'
  | 'delivery-safety-gate'
  | 'delivery-approval-role'
  | 'delivery-risk-register-item'
  | 'delivery-exit-criterion';

export type PVMetricsAllowedDeliveryReadinessItem = {
  itemId: string;
  label: string;
  itemType: 'allowed-delivery-readiness-item';
  description: string;
  deliveryMode: PVMetricsDeliveryMode;
  requiresApproval: boolean;
};

export type PVMetricsBlockedDeliveryReadinessItem = {
  itemId: string;
  label: string;
  itemType: 'blocked-delivery-readiness-item';
  severity: PVMetricsDeliveryRiskSeverity;
  reason: string;
  safeAlternative: string;
};

export type PVMetricsDeliveryReadinessPrinciple = {
  principleId: string;
  label: string;
  itemType: 'delivery-readiness-principle';
  description: string;
  mandatory: boolean;
};

export type PVMetricsDeliveryReadinessCategory = {
  categoryId: string;
  label: string;
  itemType: 'delivery-readiness-category';
  description: string;
  deliveryMode: PVMetricsDeliveryMode;
};

export type PVMetricsDeliveryPreparationGate = {
  gateId: string;
  label: string;
  itemType: 'delivery-preparation-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDeliverySafetyGate = {
  gateId: string;
  label: string;
  itemType: 'delivery-safety-gate';
  required: boolean;
  description: string;
};

export type PVMetricsDeliveryApprovalRole = {
  approvalId: string;
  label: string;
  itemType: 'delivery-approval-role';
  reviewerRole: PVMetricsDeliveryReviewRole;
  required: boolean;
  description: string;
};

export type PVMetricsDeliveryRiskRegisterItem = {
  riskId: string;
  label: string;
  itemType: 'delivery-risk-register-item';
  severity: PVMetricsDeliveryRiskSeverity;
  mitigation: string;
};

export type PVMetricsDeliveryExitCriterion = {
  criterionId: string;
  label: string;
  itemType: 'delivery-exit-criterion';
  required: boolean;
  passed: boolean;
  description: string;
};

export type PVMetricsControlledClientDemoDeliveryReadinessPack = {
  packId: string;
  generatedAtLabel: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-U — Controlled Client Demo Delivery Readiness';
  module: string;
  internalVersion: string;
  status: PVMetricsClientDemoDeliveryReadinessStatus;
  clientDemoDeliveryPurpose: string[];
  allowedDeliveryReadinessItems: PVMetricsAllowedDeliveryReadinessItem[];
  blockedDeliveryReadinessItems: PVMetricsBlockedDeliveryReadinessItem[];
  deliveryReadinessPrinciples: PVMetricsDeliveryReadinessPrinciple[];
  deliveryReadinessCategories: PVMetricsDeliveryReadinessCategory[];
  deliveryPreparationGates: PVMetricsDeliveryPreparationGate[];
  deliverySafetyGates: PVMetricsDeliverySafetyGate[];
  deliveryApprovalRoles: PVMetricsDeliveryApprovalRole[];
  deliveryRiskRegister: PVMetricsDeliveryRiskRegisterItem[];
  deliveryExitCriteria: PVMetricsDeliveryExitCriterion[];
  deliveryReadinessBoundary: string;
  nextRecommendedModule: string;
};
