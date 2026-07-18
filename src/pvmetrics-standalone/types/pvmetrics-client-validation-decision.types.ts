import { PVMetricsClientValidationGate } from './pvmetrics-client-validation.types';
import { PVMetricsClientValidationRequestPack } from './pvmetrics-client-validation-request.types';
import { PVMetricsClientEvidenceResponseEvaluation } from './pvmetrics-client-evidence-response.types';

export type PVMetricsClientValidationDecisionStatus =
  | 'blocked'
  | 'draft-review-required'
  | 'ready-for-client-validation'
  | 'ready-for-readonly-pilot-preparation';

export type PVMetricsClientValidationDecisionRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsClientValidationDecisionItem = {
  id: string;
  label: string;
  status: 'ok' | 'warning' | 'blocked';
  note: string;
};

export type PVMetricsClientValidationDecisionSummary = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  decisionStatus: PVMetricsClientValidationDecisionStatus;
  decisionLabel: string;
  riskLevel: PVMetricsClientValidationDecisionRiskLevel;

  gateScorePct: number;
  evidenceScorePct: number;
  combinedReadinessPct: number;

  blockingChecks: number;
  pendingEvidenceItems: number;
  rejectedEvidenceItems: number;
  criticalRequestItems: number;

  decisionItems: PVMetricsClientValidationDecisionItem[];
  executiveSummary: string;
  decisionRationale: string;
  remainingBlockers: string[];
  recommendedNextActions: string[];
  internalCommitteeText: string;
  clientFollowUpText: string;
  safetyBoundary: string;

  sourceGate: PVMetricsClientValidationGate;
  sourceRequestPack: PVMetricsClientValidationRequestPack;
  sourceEvidenceEvaluation: PVMetricsClientEvidenceResponseEvaluation;
};
