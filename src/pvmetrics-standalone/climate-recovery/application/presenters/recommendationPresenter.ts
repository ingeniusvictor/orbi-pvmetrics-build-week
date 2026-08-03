import type { RecommendedAction } from '../../contracts/entities';
import type { RecommendedActionPresentation } from '../contracts/presentationModels';
import type { PresenterContext } from './presenterContext';

const actionOrder: Record<string, number> = {
  'request-more-data': 10,
  'remote-review': 20,
  'data-validation': 30,
  'alarm-review': 40,
  monitoring: 50,
  escalation: 60,
  'field-inspection': 70,
  'cleaning-assessment': 80,
  'maintenance-intervention': 90,
  'operational-check': 100,
  'no-action': 110,
};

const presentAction = (action: RecommendedAction, suppressed = false): RecommendedActionPresentation => ({
  id: action.id,
  titleKey: `action.${action.actionType}.title`,
  descriptionKey: `action.${action.actionType}.description`,
  actionType: action.actionType,
  urgency: action.urgency,
  rationale: action.rationale,
  expectedOutcome: action.expectedOutcome,
  requiresApproval: action.requiresApproval,
  safetyNotes: [...action.safetyNotes],
  uncertaintyNotes: [...action.uncertaintyNotes],
  status: suppressed ? 'suppressed' : action.status,
  displayOrder: actionOrder[action.actionType] ?? 999,
  isBinding: false,
  humanReviewStatus: action.humanReviewStatus,
});

export const presentRecommendations = (context: PresenterContext): RecommendedActionPresentation[] =>
  context.assessment.lossAssessments
    .flatMap((item) => [
      ...item.recommendations.recommendedActions.map((action) => presentAction(action)),
      ...item.recommendations.suppressedActions.map((action) => presentAction(action, true)),
    ])
    .sort((a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));
