import type { ExplainabilitySection } from '../contracts/presentationModels';
import { text, type PresenterContext } from './presenterContext';

export const presentExplainability = (context: PresenterContext): ExplainabilitySection => {
  const supportingIds = new Set(
    context.assessment.lossAssessments.flatMap(
      (item) => item.evidenceAssessment.strongestSupportingEvidenceIds,
    ),
  );
  const contradictingIds = new Set(
    context.assessment.lossAssessments.flatMap(
      (item) => item.evidenceAssessment.strongestContradictingEvidenceIds,
    ),
  );
  const supportingEvidence = context.caseData.evidence
    .filter((item) => item.direction === 'supports' || supportingIds.has(item.id))
    .map((item) => `${item.title}: ${item.description}`);
  const contradictingEvidence = context.caseData.evidence
    .filter((item) => item.direction === 'contradicts' || contradictingIds.has(item.id))
    .map((item) => `${item.title}: ${item.description}`);
  const missingEvidence = context.assessment.hypotheses.flatMap((item) => item.missingEvidence);
  const assumptions = context.assessment.lossAssessments.flatMap((item) => [
    ...item.hypotheses.flatMap((hypothesis) => hypothesis.assumptions),
    ...item.energyLoss.assumptions,
    ...item.scenarios.flatMap((scenario) => scenario.assumptions),
    ...item.climateImpact.assumptions,
  ]);
  const limitations = [
    ...context.assessment.limitations,
    ...context.assessment.lossAssessments.flatMap((item) => [
      ...item.evidenceAssessment.limitations,
      ...item.hypotheses.flatMap((hypothesis) => hypothesis.limitations),
      ...item.energyLoss.limitations,
      ...item.scenarios.flatMap((scenario) => scenario.limitations),
      ...item.climateImpact.limitations,
      ...item.priority.limitations,
    ]),
  ];
  const selectedStages = new Set([
    'data-sufficiency',
    'recoverability',
    'energy-loss',
    'climate-impact',
    'double-counting',
  ]);
  const traceHighlights = context.assessment.trace
    .filter((step) => selectedStages.has(step.stage))
    .slice(0, context.configuration.timelineMaxTraceHighlights)
    .map((step) => ({
      ruleId: step.ruleId,
      summary: step.outputSummary,
      version: step.version,
    }));
  const ruleVersions = [
    context.assessment.engineVersion,
    ...context.assessment.hypotheses.flatMap((item) =>
      item.modelOrRuleVersion ? [item.modelOrRuleVersion] : [],
    ),
  ];
  return {
    summary: `The deterministic assessment classified the case as ${context.assessment.recoverability.status} with ${context.assessment.dataSufficiency.status} data. Hypotheses remain unconfirmed.`,
    supportingEvidence: [...new Set(supportingEvidence)],
    contradictingEvidence: [...new Set(contradictingEvidence)],
    missingEvidence: [...new Set([
      ...missingEvidence,
      ...context.assessment.dataSufficiency.missingCriticalFields,
    ])],
    assumptions: [...new Set(assumptions)],
    limitations: [...new Set(limitations)],
    traceHighlights,
    ruleVersions: [...new Set(ruleVersions)],
    confidenceExplanation: text(context, 'confidence.explanation'),
    humanReviewExplanation: 'Hypotheses and recommendations remain advisory; the accountable operator retains the final decision.',
  };
};
