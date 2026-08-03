import type {
  AssessmentOperatorContext,
  DataSufficiencyAssessment,
  RecommendedActionAssessment,
  RecoverabilityAssessment,
} from '../contracts/assessment';
import type {
  DiagnosticHypothesis,
  EvidenceItem,
  RecommendedAction,
  RecoverableLoss,
} from '../contracts/entities';
import type { RecommendedActionType } from '../types/taxonomy';

const ACTION_MAP: Readonly<Partial<Record<RecoverableLoss['category'], RecommendedActionType[]>>> = {
  inverter: ['remote-review', 'alarm-review', 'operational-check'],
  'mppt-or-string': ['remote-review', 'alarm-review', 'operational-check'],
  soiling: ['cleaning-assessment', 'data-validation'],
  communications: ['data-validation', 'request-more-data', 'remote-review'],
  'sensor-quality': ['data-validation', 'request-more-data'],
  'grid-curtailment': ['monitoring', 'escalation', 'no-action'],
  clipping: ['operational-check', 'monitoring', 'request-more-data'],
  unknown: ['request-more-data', 'monitoring'],
  'bess-operation': ['operational-check', 'request-more-data', 'monitoring'],
};

const titleFor = (type: RecommendedActionType): string =>
  type.split('-').map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join(' ');

const buildAction = (input: {
  type: RecommendedActionType;
  loss: RecoverableLoss;
  evidence: EvidenceItem[];
  hypotheses: DiagnosticHypothesis[];
  evaluationTimestamp: string;
  safetyNotes: string[];
  suffix?: string;
}): RecommendedAction => ({
  id: `${input.loss.id}:recommendation:${input.type}${input.suffix ?? ''}`,
  lossId: input.loss.id,
  title: titleFor(input.type),
  description: `Non-binding ${titleFor(input.type).toLowerCase()} recommendation for human review.`,
  actionType: input.type,
  urgency: input.loss.operationalSeverity === 'critical' ? 'urgent' : input.loss.operationalSeverity === 'high' ? 'soon' : 'routine',
  rationale: `Deterministic category rule for ${input.loss.category}; current evidence and uncertainty require human review.`,
  expectedOutcome: 'A human reviewer decides whether evidence, monitoring, or an approved intervention is appropriate.',
  prerequisites: ['Human review of supporting, contradicting, and missing evidence.'],
  safetyNotes: input.safetyNotes.length > 0
    ? [...input.safetyNotes]
    : ['Advisory only; follow approved site safety and authorization procedures before any field activity.'],
  uncertaintyNotes: ['The engine does not provide a definitive diagnosis or dispatch order.'],
  evidenceIds: input.evidence.map((item) => item.id),
  hypothesisIds: input.hypotheses.map((item) => item.id),
  requiresApproval: true,
  humanReviewStatus: 'pending',
  status: 'proposed',
  createdAt: input.evaluationTimestamp,
  updatedAt: input.evaluationTimestamp,
});

export const generateRecommendations = (input: {
  loss: RecoverableLoss;
  evidence: EvidenceItem[];
  hypotheses: DiagnosticHypothesis[];
  recoverability: RecoverabilityAssessment;
  dataSufficiency: DataSufficiencyAssessment;
  evaluationTimestamp: string;
  operatorContext?: AssessmentOperatorContext;
}): RecommendedActionAssessment => {
  let types = ACTION_MAP[input.loss.category] ?? ['monitoring', 'request-more-data'];
  if (input.dataSufficiency.status === 'insufficient') {
    types = ['request-more-data', 'data-validation', 'monitoring'];
  }
  if (input.recoverability.status === 'non-recoverable') {
    types = types.filter((type) =>
      ['monitoring', 'escalation', 'no-action', 'request-more-data', 'data-validation'].includes(type),
    );
    if (types.length === 0) types = ['no-action'];
  }
  const safetyNotes = input.operatorContext?.safetyNotes ?? [];
  const recommendedActions = types.map((type) =>
    buildAction({ ...input, type, safetyNotes }),
  );
  const suppressedActions: RecommendedAction[] = [];
  const suppressionReasons: Record<string, string> = {};

  const suppress = (type: RecommendedActionType, reason: string): void => {
    const action = buildAction({ ...input, type, safetyNotes, suffix: ':suppressed' });
    suppressedActions.push(action);
    suppressionReasons[action.id] = reason;
  };
  if (['inverter', 'mppt-or-string'].includes(input.loss.category)) {
    suppress('field-inspection', 'Remote review must precede field inspection and explicit approval is still required.');
  }
  if (input.loss.category === 'soiling') {
    suppress('maintenance-intervention', 'Cleaning assessment and human approval must precede maintenance intervention.');
  }
  if (input.loss.category === 'sensor-quality' && !(input.operatorContext?.safetyRisk && input.operatorContext.safetyRisk > 0)) {
    suppress('field-inspection', 'No separate safety risk and safety context support field inspection.');
  }
  if (input.recoverability.status === 'non-recoverable') {
    for (const type of ['field-inspection', 'maintenance-intervention'] as const) {
      suppress(type, 'Corrective asset maintenance is suppressed for a non-recoverable loss.');
    }
  }

  const safetyEscalation = (input.operatorContext?.safetyRisk ?? 0) > 0;
  return {
    recommendedActions,
    suppressedActions,
    suppressionReasons,
    requiresApproval: recommendedActions.length > 0,
    safetyEscalation,
    humanReviewStatus: input.dataSufficiency.requiresMoreData ? 'needs-more-data' : 'pending',
  };
};
