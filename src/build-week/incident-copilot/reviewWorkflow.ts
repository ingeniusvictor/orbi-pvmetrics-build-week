import {
  HumanReviewState,
  IncidentAssessment,
} from './domain';

export type IncidentCopilotSession = {
  selectedScenarioId: string;
  assessment: IncidentAssessment | null;
  analysisRunCount: number;
};
export const createIncidentCopilotSession = (
  selectedScenarioId: string,
): IncidentCopilotSession => ({
  selectedScenarioId,
  assessment: null,
  analysisRunCount: 0,
});

export const selectIncidentScenario = (
  session: IncidentCopilotSession,
  selectedScenarioId: string,
): IncidentCopilotSession => ({
  selectedScenarioId,
  assessment: null,
  analysisRunCount: session.analysisRunCount,
});

export const recordIncidentAnalysis = (
  session: IncidentCopilotSession,
  assessment: IncidentAssessment,
): IncidentCopilotSession => ({
  ...session,
  assessment: {
    ...assessment,
    review: {
      state: 'pending-review',
      note: '',
      authority: 'human-only',
    },
  },
  analysisRunCount: session.analysisRunCount + 1,
});

export const applyHumanReview = (
  session: IncidentCopilotSession,
  state: Exclude<HumanReviewState, 'pending-review'>,
  note: string,
): IncidentCopilotSession => {
  if (!session.assessment) return session;
  return {
    ...session,
    assessment: {
      ...session.assessment,
      review: {
        state,
        note,
        authority: 'human-only',
      },
    },
  };
};
