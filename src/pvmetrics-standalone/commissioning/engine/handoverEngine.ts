import type { CommissioningBaseline, Finding, HandoverPackage, HumanAcceptanceDecision, PunchItem } from '../contracts';

export type HandoverReadinessInput = {
  handover: HandoverPackage;
  baseline?: CommissioningBaseline;
  findings: readonly Finding[];
  punchItems: readonly PunchItem[];
  acceptanceDecisions: readonly HumanAcceptanceDecision[];
  requiredDocumentReferences?: readonly string[];
  evaluatedAt: string;
  evaluatedBy: string;
};

export const evaluateHandoverReadiness = ({
  handover,
  baseline,
  findings,
  punchItems,
  acceptanceDecisions,
  requiredDocumentReferences = [],
  evaluatedAt,
  evaluatedBy,
}: HandoverReadinessInput): HandoverPackage => {
  const openFindingIds = findings
    .filter((finding) => finding.status !== 'CLOSED' && finding.status !== 'DISMISSED')
    .map((finding) => finding.findingId);
  const openPunchItemIds = punchItems
    .filter((punch) => punch.status !== 'CLOSED')
    .map((punch) => punch.punchItemId);

  const missingDocuments = requiredDocumentReferences.filter((reference) => !handover.requiredDocumentReferences.includes(reference));
  const hasAcceptedDecision = acceptanceDecisions.some((decision) => decision.decision === 'ACCEPTED' || decision.decision === 'ACCEPTED_WITH_COMMENTS');

  const ready =
    baseline?.status === 'AVAILABLE' &&
    openFindingIds.length === 0 &&
    openPunchItemIds.length === 0 &&
    missingDocuments.length === 0 &&
    hasAcceptedDecision;

  return {
    ...handover,
    baselineId: baseline?.baselineId ?? handover.baselineId,
    status: ready ? 'READY' : 'BLOCKED',
    openFindingIds,
    openPunchItemIds,
    humanAcceptanceDecisionIds: acceptanceDecisions.map((decision) => decision.acceptanceDecisionId),
    updatedAt: evaluatedAt,
    updatedBy: evaluatedBy,
  };
};
