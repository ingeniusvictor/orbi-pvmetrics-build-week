import { PVMetricsReadonlyPilotReviewPack } from './pvmetrics-readonly-pilot-review-pack.types';

export type PVMetricsReadonlyPilotGoNoGoDecision =
  | 'go'
  | 'conditional-go'
  | 'no-go';

export type PVMetricsReadonlyPilotGoNoGoCheckStatus =
  | 'pass'
  | 'warning'
  | 'fail'
  | 'not-applicable';

export type PVMetricsReadonlyPilotGoNoGoCheckCategory =
  | 'signals'
  | 'bess'
  | 'read-only-access'
  | 'security'
  | 'governance'
  | 'data-quality'
  | 'safety-boundary';

export type PVMetricsReadonlyPilotGoNoGoCheck = {
  id: string;
  category: PVMetricsReadonlyPilotGoNoGoCheckCategory;
  label: string;
  status: PVMetricsReadonlyPilotGoNoGoCheckStatus;
  requiredForGo: boolean;
  blocksGo: boolean;
  evidence: string;
  recommendation: string;
};

export type PVMetricsReadonlyPilotGoNoGoChecklist = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  decision: PVMetricsReadonlyPilotGoNoGoDecision;
  decisionLabel: string;
  readinessScorePct: number;

  totalChecks: number;
  passChecks: number;
  warningChecks: number;
  failChecks: number;
  blockingChecks: number;
  bessChecks: number;

  checks: PVMetricsReadonlyPilotGoNoGoCheck[];
  blockers: string[];
  risks: string[];
  requiredActions: string[];

  internalSummaryText: string;
  safetyBoundary: string;

  sourceReviewPack: PVMetricsReadonlyPilotReviewPack;
};
