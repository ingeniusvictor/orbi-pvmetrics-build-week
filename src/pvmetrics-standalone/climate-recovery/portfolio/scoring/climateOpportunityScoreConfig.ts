export const CLIMATE_OPPORTUNITY_SCORE_CONFIGURATION = Object.freeze({
  maximums: {
    estimatedRecoverableEnergy: 30,
    recoverability: 20,
    priority: 15,
    confidence: 10,
    dataQuality: 10,
    climateImpactAvailability: 10,
    humanReviewReadiness: 5,
  },
  penalties: {
    possibleOverlapEach: 5,
    overlapMaximum: 15,
    insufficientDataEach: 10,
    insufficientDataMaximum: 20,
  },
  referenceRecoverableEnergyKwh: 50_000,
  insufficientDataScoreCap: 59,
  bands: {
    minimalMaximum: 19,
    lowMaximum: 39,
    moderateMaximum: 59,
    highMaximum: 79,
  },
  labels: {
    minimal: { es: 'mínimo', en: 'minimal' },
    low: { es: 'bajo', en: 'low' },
    moderate: { es: 'moderado', en: 'moderate' },
    high: { es: 'alto', en: 'high' },
    'very-high': { es: 'muy alto', en: 'very-high' },
  },
});

export type ClimateOpportunityScoreInput = {
  estimatedRecoverableEnergyKwh: number;
  recoverabilityRatios: number[];
  highestPriorityScore: number;
  confidenceScores: number[];
  dataQualityRatios: number[];
  climateAvailableCount: number;
  reviewReadyCount: number;
  caseCount: number;
  possibleOverlapCount: number;
  insufficientDataCount: number;
  confirmedOverlapCount: number;
};
