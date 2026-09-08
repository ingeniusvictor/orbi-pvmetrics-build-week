import type { CommissioningGate, Finding, PunchItem, TestExecution } from '../contracts';

export type GateEvaluationInput = {
  gate: CommissioningGate;
  executions: readonly TestExecution[];
  findings: readonly Finding[];
  punchItems: readonly PunchItem[];
  requiredExecutionIds?: readonly string[];
  humanApprovalGranted?: boolean;
  evaluatedAt: string;
  evaluatedBy: string;
};

export const evaluateCommissioningGate = ({
  gate,
  executions,
  findings,
  punchItems,
  requiredExecutionIds = [],
  humanApprovalGranted = false,
  evaluatedAt,
  evaluatedBy,
}: GateEvaluationInput): CommissioningGate => {
  const blockers: string[] = [];
  const executionById = new Map(executions.map((execution) => [execution.executionId, execution]));

  for (const executionId of requiredExecutionIds) {
    const execution = executionById.get(executionId);
    if (!execution) blockers.push(`MISSING_EXECUTION:${executionId}`);
    else if (execution.orbiAssessment !== 'PASS') blockers.push(`ORBI_NOT_PASS:${executionId}`);
    else if (execution.humanAcceptance !== 'ACCEPTED' && execution.humanAcceptance !== 'ACCEPTED_WITH_COMMENTS') blockers.push(`HUMAN_NOT_ACCEPTED:${executionId}`);
  }

  for (const finding of findings) {
    if (finding.status !== 'CLOSED' && finding.status !== 'DISMISSED' && finding.severity === 'CRITICAL') blockers.push(`CRITICAL_FINDING:${finding.findingId}`);
  }

  for (const punch of punchItems) {
    if (punch.status !== 'CLOSED' && (punch.severity === 'CRITICAL' || punch.severity === 'MAJOR')) blockers.push(`OPEN_PUNCH:${punch.punchItemId}`);
  }

  let status: CommissioningGate['status'];
  if (blockers.length > 0) status = 'BLOCKED';
  else if (!humanApprovalGranted) status = 'READY';
  else status = 'APPROVED';

  return {
    ...gate,
    status,
    blockerIds: blockers,
    reviewedBy: evaluatedBy,
    reviewedAt: evaluatedAt,
    updatedAt: evaluatedAt,
    updatedBy: evaluatedBy,
  };
};
