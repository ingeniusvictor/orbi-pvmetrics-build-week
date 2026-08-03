import type { TimelineEvent } from '../contracts/presentationModels';
import { disclosureFor, type PresenterContext } from './presenterContext';

const event = (
  context: PresenterContext,
  value: Omit<TimelineEvent, 'caseId' | 'isSynthetic' | 'disclosure'>,
): TimelineEvent => ({
  ...value,
  caseId: context.caseData.id,
  isSynthetic: true,
  disclosure: disclosureFor(context),
});

export const presentTimeline = (context: PresenterContext): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  for (const loss of context.caseData.losses) {
    events.push(event(context, {
      id: `detection:${loss.id}`,
      timestamp: loss.detectedAt,
      eventType: 'detection',
      titleKey: 'timeline.detection',
      descriptionKey: loss.description,
      severity: 'caution',
      relatedEntityIds: [loss.id],
      origin: loss.origin,
    }));
  }
  for (const evidence of context.caseData.evidence) {
    events.push(event(context, {
      id: `evidence:${evidence.id}`,
      timestamp: evidence.createdAt,
      eventType: 'evidence-collected',
      titleKey: 'timeline.evidence',
      descriptionKey: evidence.description,
      severity: evidence.direction === 'contradicts' ? 'warning' : 'informative',
      relatedEntityIds: [evidence.id],
      origin: evidence.provenance.origin,
    }));
  }
  for (const hypothesis of context.assessment.hypotheses) {
    events.push(event(context, {
      id: `hypothesis:${hypothesis.id}`,
      timestamp: hypothesis.createdAt,
      eventType: 'hypothesis-generated',
      titleKey: 'timeline.hypothesis',
      descriptionKey: hypothesis.summary,
      severity: 'caution',
      relatedEntityIds: [hypothesis.id, ...hypothesis.evidenceFor, ...hypothesis.evidenceAgainst],
      origin: hypothesis.generatedBy === 'human' ? 'manually-entered' : 'derived',
    }));
  }
  const actions = context.assessment.lossAssessments.flatMap((item) => item.recommendations.recommendedActions);
  for (const action of actions) {
    events.push(event(context, {
      id: `recommendation:${action.id}`,
      timestamp: action.createdAt,
      eventType: 'recommendation-generated',
      titleKey: 'timeline.recommendation',
      descriptionKey: action.description,
      severity: 'informative',
      relatedEntityIds: [action.id, action.lossId],
      origin: 'derived',
    }));
  }
  if (context.assessment.scenarios.some((item) => item.status === 'simulated')) {
    events.push(event(context, {
      id: `scenario:${context.assessment.assessmentId}`,
      timestamp: context.assessment.evaluatedAt,
      eventType: 'scenario-generated',
      titleKey: 'timeline.scenario',
      descriptionKey: 'Projected scenarios were generated from explicit synthetic assumptions.',
      severity: 'informative',
      relatedEntityIds: context.caseData.losses.map((item) => item.id),
      origin: 'projected',
    }));
  }
  if (['estimated', 'projected'].includes(context.assessment.climateImpact.status)) {
    events.push(event(context, {
      id: `climate:${context.assessment.assessmentId}`,
      timestamp: context.assessment.evaluatedAt,
      eventType: 'climate-estimate-generated',
      titleKey: 'timeline.climate',
      descriptionKey: 'A counterfactual estimate was generated using a fictional configurable factor.',
      severity: 'informative',
      relatedEntityIds: [context.assessment.assessmentId],
      origin: 'estimated',
    }));
  }
  events.push(event(context, {
    id: `assessment:${context.assessment.assessmentId}`,
    timestamp: context.assessment.evaluatedAt,
    eventType: 'assessment-generated',
    titleKey: 'timeline.assessment',
    descriptionKey: `Assessment status: ${context.assessment.status}.`,
    severity: context.assessment.status === 'blocked' ? 'blocked' : 'informative',
    relatedEntityIds: [context.assessment.assessmentId],
    origin: 'derived',
  }));
  if (context.assessment.requiresHumanReview) {
    events.push(event(context, {
      id: `review:${context.assessment.assessmentId}`,
      timestamp: context.assessment.evaluatedAt,
      eventType: 'review-requested',
      titleKey: 'timeline.review',
      descriptionKey: 'Operator review is required; no decision is automated.',
      severity: 'caution',
      relatedEntityIds: [context.assessment.assessmentId],
      origin: 'derived',
    }));
  }
  for (const [index, warning] of context.assessment.warnings.entries()) {
    events.push(event(context, {
      id: `warning:${context.assessment.assessmentId}:${index + 1}`,
      timestamp: context.assessment.evaluatedAt,
      eventType: 'warning-raised',
      titleKey: 'timeline.warning',
      descriptionKey: warning,
      severity: 'warning',
      relatedEntityIds: [context.assessment.assessmentId],
      origin: 'derived',
    }));
  }
  events.push(event(context, {
    id: `status:${context.caseData.id}`,
    timestamp: context.caseData.updatedAt,
    eventType: 'case-status',
    titleKey: 'timeline.status',
    descriptionKey: `Case status: ${context.caseData.status}.`,
    severity: 'neutral',
    relatedEntityIds: [context.caseData.id],
    origin: 'manually-entered',
  }));
  return events.sort((a, b) => a.timestamp.localeCompare(b.timestamp) || a.id.localeCompare(b.id));
};
