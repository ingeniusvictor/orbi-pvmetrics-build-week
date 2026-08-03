import type { ClimateOpportunityScore } from '../contracts/portfolioPresentationContracts';
import {
  CLIMATE_OPPORTUNITY_SCORE_CONFIGURATION as CONFIG,
  type ClimateOpportunityScoreInput,
} from './climateOpportunityScoreConfig';

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : 0));
const average = (values: number[]) => values.length === 0
  ? 0
  : values.reduce((sum, value) => sum + value, 0) / values.length;
const round = (value: number) => Math.round(value * 100) / 100;

const bandFor = (score: number): ClimateOpportunityScore['band'] =>
  score <= CONFIG.bands.minimalMaximum ? 'minimal'
    : score <= CONFIG.bands.lowMaximum ? 'low'
      : score <= CONFIG.bands.moderateMaximum ? 'moderate'
        : score <= CONFIG.bands.highMaximum ? 'high'
          : 'very-high';

export const calculateClimateOpportunityScore = (
  input: ClimateOpportunityScoreInput,
): ClimateOpportunityScore => {
  const caseDivisor = Math.max(1, input.caseCount);
  const components: ClimateOpportunityScore['components'] = {
    estimatedRecoverableEnergy: round(CONFIG.maximums.estimatedRecoverableEnergy * clamp(input.estimatedRecoverableEnergyKwh / CONFIG.referenceRecoverableEnergyKwh, 0, 1)),
    recoverability: round(CONFIG.maximums.recoverability * clamp(average(input.recoverabilityRatios), 0, 1)),
    priority: round(CONFIG.maximums.priority * clamp(input.highestPriorityScore / 100, 0, 1)),
    confidence: round(CONFIG.maximums.confidence * clamp(average(input.confidenceScores), 0, 1)),
    dataQuality: round(CONFIG.maximums.dataQuality * clamp(average(input.dataQualityRatios), 0, 1)),
    climateImpactAvailability: round(CONFIG.maximums.climateImpactAvailability * clamp(input.climateAvailableCount / caseDivisor, 0, 1)),
    humanReviewReadiness: round(CONFIG.maximums.humanReviewReadiness * clamp(input.reviewReadyCount / caseDivisor, 0, 1)),
    overlapPenalty: -Math.min(CONFIG.penalties.overlapMaximum, input.possibleOverlapCount * CONFIG.penalties.possibleOverlapEach + input.confirmedOverlapCount * CONFIG.penalties.overlapMaximum),
    insufficientDataPenalty: -Math.min(CONFIG.penalties.insufficientDataMaximum, input.insufficientDataCount * CONFIG.penalties.insufficientDataEach),
  };
  let score = Object.values(components).reduce((sum, value) => sum + value, 0);
  if (input.insufficientDataCount > 0) score = Math.min(score, CONFIG.insufficientDataScoreCap);
  if (input.confirmedOverlapCount > 0) score = Math.min(score, CONFIG.bands.moderateMaximum);
  score = round(clamp(score, 0, 100));
  const band = bandFor(score);
  return {
    score,
    band,
    labels: CONFIG.labels[band],
    components,
    explanation: [
      `Estimated recoverable energy contributes ${components.estimatedRecoverableEnergy}/30 points.`,
      `Recoverability contributes ${components.recoverability}/20 points.`,
      `Highest CR-02 priority contributes ${components.priority}/15 points.`,
      `Confidence and data quality contribute ${round(components.confidence + components.dataQuality)}/20 points.`,
      `Climate availability and review readiness contribute ${round(components.climateImpactAvailability + components.humanReviewReadiness)}/15 points.`,
      `Overlap and insufficient-data penalties contribute ${round(components.overlapPenalty + components.insufficientDataPenalty)} points.`,
    ],
    limitations: [
      'Internal deterministic demonstration index; not scientific, certified, probabilistic, or comparable outside this synthetic portfolio.',
      'The score does not authorize, schedule, or automatically order maintenance.',
      'Insufficient data and confirmed overlap impose explicit score caps.',
    ],
    isProbability: false,
    isScientific: false,
    isCertified: false,
    isOperational: false,
  };
};
