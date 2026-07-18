import {
  PVMetricsReadOnlyAssetSeparation,
  PVMetricsReadOnlyDataDomain,
  PVMetricsReadOnlyDataQualityStatus,
  PVMetricsReadOnlyForbiddenOperation,
  PVMetricsReadOnlyFreshnessStatus,
  PVMetricsReadOnlyUnit,
} from './pvmetrics-readonly-data-contract.types';

export type PVMetricsSourceQualityGateStatus =
  | 'passed'
  | 'passed-with-warnings'
  | 'blocked'
  | 'human-review-required'
  | 'not-evaluable';

export type PVMetricsSourceQualityGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking'
  | 'critical';

export type PVMetricsSourceQualityGateCategory =
  | 'source-id'
  | 'timestamp'
  | 'freshness'
  | 'unit'
  | 'data-quality'
  | 'asset-separation'
  | 'forbidden-operation'
  | 'domain-consistency'
  | 'human-review'
  | 'safety-boundary';

export type PVMetricsSourceQualityGateDecision =
  | 'allow-mock-use'
  | 'allow-with-warning'
  | 'block-automatic-use'
  | 'require-human-review'
  | 'reject-packet';

export type PVMetricsSourceFreshnessWindow = {
  domain: PVMetricsReadOnlyDataDomain;
  label: string;
  maxAgeMinutes: number;
  staleAfterMinutes: number;
  blockAfterMinutes: number;
  rationale: string;
};

export type PVMetricsSourceQualityGateRule = {
  ruleId: string;
  category: PVMetricsSourceQualityGateCategory;
  label: string;
  severity: PVMetricsSourceQualityGateSeverity;
  decisionIfFailed: PVMetricsSourceQualityGateDecision;
  description: string;
  failureMessage: string;
};

export type PVMetricsSourceQualityGateCheck = {
  checkId: string;
  category: PVMetricsSourceQualityGateCategory;
  label: string;
  status: PVMetricsSourceQualityGateStatus;
  severity: PVMetricsSourceQualityGateSeverity;
  decision: PVMetricsSourceQualityGateDecision;
  details: string;
  recommendedAction: string;
};

export type PVMetricsSourceFreshnessAssessment = {
  freshnessStatus: PVMetricsReadOnlyFreshnessStatus;
  measuredAtLabel: string | null;
  generatedAtLabel: string;
  ageMinutesLabel: string;
  windowLabel: string;
  isStale: boolean;
  isBlocked: boolean;
  explanation: string;
};

export type PVMetricsSourceDataQualityAssessment = {
  dataQualityStatus: PVMetricsReadOnlyDataQualityStatus;
  unit: PVMetricsReadOnlyUnit;
  assetSeparation: PVMetricsReadOnlyAssetSeparation;
  sourceIdPresent: boolean;
  timestampPresent: boolean;
  unitRecognized: boolean;
  fvBessSeparated: boolean;
  explanation: string;
};

export type PVMetricsSourceForbiddenOperationAssessment = {
  attemptedOperation: PVMetricsReadOnlyForbiddenOperation;
  blocked: true;
  reason: string;
};

export type PVMetricsSourceQualityGateFinding = {
  findingId: string;
  category: PVMetricsSourceQualityGateCategory;
  severity: PVMetricsSourceQualityGateSeverity;
  title: string;
  message: string;
  decision: PVMetricsSourceQualityGateDecision;
};

export type PVMetricsSourceQualityGateResult = {
  gateId: string;
  generatedAtLabel: string;
  sourceId: string;
  sourceName: string;
  domain: PVMetricsReadOnlyDataDomain;

  overallStatus: PVMetricsSourceQualityGateStatus;
  overallDecision: PVMetricsSourceQualityGateDecision;

  freshnessAssessment: PVMetricsSourceFreshnessAssessment;
  dataQualityAssessment: PVMetricsSourceDataQualityAssessment;
  forbiddenOperationAssessments: PVMetricsSourceForbiddenOperationAssessment[];

  checks: PVMetricsSourceQualityGateCheck[];
  findings: PVMetricsSourceQualityGateFinding[];

  blockedReasons: string[];
  warnings: string[];
  humanReviewReasons: string[];

  safetyBoundary: string;
};

export type PVMetricsSourceQualityGateRegistry = {
  registryId: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-G — Read-Only Data Contract & Connector Readiness';
  defaultFreshnessWindows: PVMetricsSourceFreshnessWindow[];
  rules: PVMetricsSourceQualityGateRule[];
  forbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  safetyBoundaries: string[];
  nextRecommendedModule: string;
};
