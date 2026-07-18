import {
  PVMetricsReadOnlyAccessMode,
  PVMetricsReadOnlyConnectorFamily,
  PVMetricsReadOnlyDataDomain,
  PVMetricsReadOnlyForbiddenOperation,
  PVMetricsReadOnlySourceType,
} from './pvmetrics-readonly-data-contract.types';

export type PVMetricsFutureConnectorLifecycleStatus =
  | 'concept'
  | 'contract-defined'
  | 'mock-ready'
  | 'qa-review'
  | 'approved-for-future-read-only'
  | 'blocked'
  | 'deprecated';

export type PVMetricsFutureConnectorSecurityStatus =
  | 'safe-mock-only'
  | 'read-only-required'
  | 'credential-review-required'
  | 'consent-required'
  | 'blocked-dangerous-write-risk'
  | 'blocked-telecontrol-risk';

export type PVMetricsFutureConnectorPermissionStatus =
  | 'no-permission-needed-mock'
  | 'owner-consent-required'
  | 'credential-scope-required'
  | 'read-only-scope-required'
  | 'permission-blocked';

export type PVMetricsFutureConnectorRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'not-evaluable';

export type PVMetricsFutureConnectorCapability =
  | 'read-plant-profile'
  | 'read-weather-data'
  | 'read-scada-signal'
  | 'read-meter-energy'
  | 'read-cen-readiness'
  | 'read-om-event'
  | 'read-commercial-assumption'
  | 'validate-freshness'
  | 'validate-data-quality'
  | 'normalize-units'
  | 'separate-pv-bess'
  | 'generate-mock-summary';

export type PVMetricsFutureConnectorQaRequirement = {
  requirementId: string;
  label: string;
  required: boolean;
  description: string;
};

export type PVMetricsFutureConnectorHumanReviewRequirement = {
  reviewId: string;
  label: string;
  ownerHint:
    | 'engineering'
    | 'om'
    | 'hsec'
    | 'commercial'
    | 'client-owner'
    | 'data-governance'
    | 'security';
  requiredBeforeActivation: boolean;
  description: string;
};

export type PVMetricsFutureConnectorContractRequirement = {
  contractRequirementId: string;
  domain: PVMetricsReadOnlyDataDomain;
  label: string;
  mustHaveSourceId: boolean;
  mustHaveTimestamp: boolean;
  mustHaveUnit: boolean;
  mustSeparatePvBess: boolean;
  mustPassFreshnessGate: boolean;
  mustPassQualityGate: boolean;
  description: string;
};

export type PVMetricsFutureConnectorRegistryItem = {
  connectorId: string;
  label: string;
  description: string;

  connectorFamily: PVMetricsReadOnlyConnectorFamily;
  sourceType: PVMetricsReadOnlySourceType;
  domains: PVMetricsReadOnlyDataDomain[];

  lifecycleStatus: PVMetricsFutureConnectorLifecycleStatus;
  securityStatus: PVMetricsFutureConnectorSecurityStatus;
  permissionStatus: PVMetricsFutureConnectorPermissionStatus;
  riskLevel: PVMetricsFutureConnectorRiskLevel;

  allowedAccessMode: PVMetricsReadOnlyAccessMode;
  allowedCapabilities: PVMetricsFutureConnectorCapability[];
  forbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];

  contractRequirements: PVMetricsFutureConnectorContractRequirement[];
  qaRequirements: PVMetricsFutureConnectorQaRequirement[];
  humanReviewRequirements: PVMetricsFutureConnectorHumanReviewRequirement[];

  readinessSummary: string;
  blockedReason?: string;
  safetyBoundary: string;
};

export type PVMetricsFutureConnectorRegistrySummary = {
  totalConnectors: number;
  mockReadyCount: number;
  approvedForFutureReadOnlyCount: number;
  blockedCount: number;
  credentialReviewRequiredCount: number;
  consentRequiredCount: number;
  criticalRiskCount: number;
};

export type PVMetricsFutureConnectorRegistry = {
  registryId: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-G — Read-Only Data Contract & Connector Readiness';
  module:
    | '1O-G.3A — Future Connector Registry Types'
    | '1O-G.3B — Future Connector Registry Mock Data'
    | '1O-G.3C.1 — Future Connector Registry Visual Card';
  internalVersion:
    | '0.1O-G.3A-future-connector-registry-types'
    | '0.1O-G.3B-future-connector-registry-mock-data'
    | '0.1O-G.3C.1-future-connector-registry-visual-card';

  registryStatus:
    | 'types-only'
    | 'mock-registry-ready'
    | 'visual-ready'
    | 'closed';

  items: PVMetricsFutureConnectorRegistryItem[];
  summary: PVMetricsFutureConnectorRegistrySummary;

  globalForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  globalSafetyBoundaries: string[];

  nextRecommendedModule: string;
};
