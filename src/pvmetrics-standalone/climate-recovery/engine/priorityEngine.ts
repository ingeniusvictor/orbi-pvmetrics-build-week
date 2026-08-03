import type {
  AssessmentConfiguration,
  AssessmentOperatorContext,
  ClimateImpactAssessment,
  DataSufficiencyAssessment,
  EnergyLossAssessment,
  PriorityAssessment,
  RecommendedActionAssessment,
  RecoverabilityAssessment,
} from '../contracts/assessment';
import type { RecoverableLoss } from '../contracts/entities';

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));
const rounded = (value: number): number => Math.round(value * 100) / 100;

const bandFor = (score: number): PriorityAssessment['band'] =>
  score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : score >= 20 ? 'low' : 'informational';

export const assessPriority = (input: {
  loss: RecoverableLoss;
  energyLoss: EnergyLossAssessment;
  climateImpact: ClimateImpactAssessment;
  recoverability: RecoverabilityAssessment;
  dataSufficiency: DataSufficiencyAssessment;
  recommendations: RecommendedActionAssessment;
  configuration: AssessmentConfiguration;
  evaluationTimestamp: string;
  operatorContext?: AssessmentOperatorContext;
}): PriorityAssessment => {
  const { loss, configuration } = input;
  const weights = configuration.priorityWeights;
  const severity = { informational: 0, low: 0.25, medium: 0.5, high: 0.75, critical: 1 }[loss.operationalSeverity];
  const confidence = input.recoverability.confidenceScore;
  const dataQuality = { sufficient: 1, 'partially-sufficient': 0.65, insufficient: 0.2, invalid: 0 }[input.dataSufficiency.status];
  const recoverability = { recoverable: 1, 'partially-recoverable': 0.5, 'non-recoverable': 0, indeterminate: 0.1, 'not-assessed': 0 }[input.recoverability.status];
  const analysisEnd = Date.parse(loss.analysisWindow.end);
  const persistenceDays = Math.max(0, (Date.parse(input.evaluationTimestamp) - analysisEnd) / 86_400_000);
  const safetyRisk = clamp(input.operatorContext?.safetyRisk ?? 0, 0, 1);
  const priorityEnergyKwh = Math.max(
    input.energyLoss.energyLossKwh ?? 0,
    input.energyLoss.dailyEnergyLossKwh ?? 0,
  );
  const components: PriorityAssessment['components'] = {
    energyImpact: rounded(
      weights.energyImpact * clamp(priorityEnergyKwh / configuration.priorityReferenceEnergyKwh, 0, 1),
    ),
    operationalSeverity: rounded(weights.operationalSeverity * severity),
    urgency: rounded(weights.urgency * Math.max(severity, Math.min(1, persistenceDays / 7))),
    confidence: rounded(weights.confidence * confidence),
    dataQuality: rounded(weights.dataQuality * dataQuality),
    recoverability: rounded(weights.recoverability * recoverability),
    persistenceRisk: rounded(weights.persistenceRisk * Math.min(1, persistenceDays / 30)),
    safetyRisk: rounded(weights.safetyRisk * safetyRisk),
    climateImpact: rounded(
      weights.climateImpact * clamp((input.climateImpact.avoidedEmissionsKgCO2e ?? 0) / configuration.priorityReferenceClimateKgCO2e, 0, 1),
    ),
    effortAdjustment: rounded(
      input.recommendations.suppressedActions.some((action) => action.actionType === 'field-inspection')
        ? weights.effortAdjustment * 0.25
        : 0,
    ),
  };
  let score = Object.values(components).reduce((sum, value) => sum + value, 0);
  const limitations: string[] = [
    'Priority is an explainable deterministic score, not a calibrated probability or maintenance order.',
  ];
  if (input.dataSufficiency.status === 'insufficient' && safetyRisk === 0) {
    score = Math.min(score, 59);
    limitations.push('Insufficient data caps energy-driven priority below high.');
  }
  if (confidence < 0.2 && safetyRisk === 0) {
    score = Math.min(score, 59);
    limitations.push('Very-low confidence caps priority below high unless a separate safety risk exists.');
  }
  if (loss.category === 'unknown' && safetyRisk === 0) {
    score = Math.min(score, 59);
    limitations.push('Unknown loss category cannot produce critical priority without separate safety risk.');
  }
  score = rounded(clamp(score, 0, 100));
  const band = bandFor(score);
  return {
    score,
    band,
    components,
    reasons: Object.entries(components).map(([name, value]) => `${name}: ${value} point(s).`),
    limitations,
    requiresHumanReview:
      ['high', 'critical'].includes(band) && configuration.requireHumanReviewForHighPriority
        ? true
        : input.recoverability.requiresHumanReview,
  };
};
