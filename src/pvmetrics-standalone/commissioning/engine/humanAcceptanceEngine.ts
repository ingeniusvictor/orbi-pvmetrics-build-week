import type { HumanAcceptanceDecision, HumanAcceptanceStatus, TestExecution } from '../contracts';

export type RecordAcceptanceInput = {
  execution: TestExecution;
  decision: Exclude<HumanAcceptanceStatus, 'PENDING'>;
  reason: string;
  decidedBy: string;
  decidedAt: string;
};

export const recordHumanAcceptance = ({ execution, decision, reason, decidedBy, decidedAt }: RecordAcceptanceInput): HumanAcceptanceDecision => {
  if (!reason.trim()) throw new Error('Human acceptance requires a reason.');
  if (!decidedBy.trim()) throw new Error('Human acceptance requires an identified decision maker.');
  return {
    acceptanceDecisionId: `${execution.executionId}:acceptance:${decidedAt}`,
    executionId: execution.executionId,
    decision,
    reason,
    decidedBy,
    decidedAt,
    previousDecision: execution.humanAcceptance,
    createdAt: decidedAt,
    createdBy: decidedBy,
    updatedAt: decidedAt,
    updatedBy: decidedBy,
  };
};

export const applyHumanAcceptance = (execution: TestExecution, decision: HumanAcceptanceDecision): TestExecution => {
  if (decision.executionId !== execution.executionId) throw new Error('Acceptance decision does not belong to execution.');
  return {
    ...execution,
    humanAcceptance: decision.decision,
    status: decision.decision === 'RETEST_REQUIRED' ? 'RETEST_REQUIRED' : execution.status,
    updatedAt: decision.decidedAt,
    updatedBy: decision.decidedBy,
  };
};
