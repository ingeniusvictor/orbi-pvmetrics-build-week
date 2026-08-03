import type { PlantSummaryPresentation, PortfolioRankingItem } from '../contracts/portfolioPresentationContracts';

export const createPlantRanking = (summaries: PlantSummaryPresentation[]): PortfolioRankingItem[] =>
  [...summaries]
    .sort((left, right) =>
      right.climateOpportunityScore.score - left.climateOpportunityScore.score
      || right.highPriorityCaseCount - left.highPriorityCaseCount
      || (right.estimatedRecoverableEnergy.value ?? -1) - (left.estimatedRecoverableEnergy.value ?? -1)
      || left.plantName.localeCompare(right.plantName),
    )
    .map((summary, index) => ({
      rank: index + 1,
      plantId: summary.plantId,
      plantName: summary.plantName,
      score: summary.climateOpportunityScore.score,
      scoreBand: summary.climateOpportunityScore.band,
      estimatedRecoverableEnergy: summary.estimatedRecoverableEnergy,
      estimatedClimateImpact: summary.estimatedClimateImpact,
      highPriorityCaseCount: summary.highPriorityCaseCount,
      pendingReviewCount: summary.pendingReviewCount,
      dataQualityPenalty: summary.dataQualityPenalty,
      overlapPenalty: summary.overlapPenalty,
      reasons: [...summary.climateOpportunityScore.explanation],
      limitations: [...summary.climateOpportunityScore.limitations, ...summary.limitations],
      isSynthetic: true,
      isOperational: false,
    }));
