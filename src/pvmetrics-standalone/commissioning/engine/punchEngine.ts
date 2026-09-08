import type { Finding, PunchItem, TestExecution } from '../contracts';

export const createPunchItems = (findings: readonly Finding[], createdAt: string): PunchItem[] =>
  findings
    .filter((finding) => finding.requiresPunch)
    .map((finding) => ({
      punchItemId: `PUNCH:${finding.findingId}`,
      findingId: finding.findingId,
      assetId: finding.assetId,
      severity: finding.severity,
      description: finding.description,
      requiredAction: `Resolve finding ${finding.findingId} and provide closure evidence.`,
      status: 'OPEN' as const,
      retestRequirement: 'YES' as const,
      retestExecutionIds: [],
      closureEvidenceIds: [],
      createdAt,
      createdBy: 'ORBI-PUNCH-ENGINE',
      updatedAt: createdAt,
      updatedBy: 'ORBI-PUNCH-ENGINE',
    }));

export const canClosePunchItem = (
  punch: PunchItem,
  executions: readonly TestExecution[],
): { allowed: boolean; reason?: string } => {
  if (punch.retestRequirement === 'NO') return { allowed: punch.closureEvidenceIds.length > 0, reason: punch.closureEvidenceIds.length ? undefined : 'Closure evidence is required.' };

  if (punch.retestExecutionIds.length === 0) return { allowed: false, reason: 'Required retest has not been created.' };

  const linked = executions.filter((execution) => punch.retestExecutionIds.includes(execution.executionId));
  if (linked.length !== punch.retestExecutionIds.length) return { allowed: false, reason: 'One or more linked retest executions are missing.' };

  const accepted = linked.some((execution) =>
    execution.executionType === 'RETEST' &&
    execution.orbiAssessment === 'PASS' &&
    (execution.humanAcceptance === 'ACCEPTED' || execution.humanAcceptance === 'ACCEPTED_WITH_COMMENTS'),
  );
  if (!accepted) return { allowed: false, reason: 'No linked retest has both ORBI PASS and human acceptance.' };
  if (punch.closureEvidenceIds.length === 0) return { allowed: false, reason: 'Closure evidence is required.' };
  return { allowed: true };
};
