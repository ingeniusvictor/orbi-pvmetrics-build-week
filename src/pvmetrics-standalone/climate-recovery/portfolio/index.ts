export type * from './contracts/plantContracts';
export type * from './contracts/portfolioContracts';
export type * from './contracts/portfolioPresentationContracts';
export type {
  SyntheticClimateRecoveryPortfolioService,
  SyntheticClimateRecoveryPortfolioServiceDependencies,
} from './services/portfolioApplicationService';
export type { ClimateOpportunityScoreInput } from './scoring/climateOpportunityScoreConfig';

export {
  createSyntheticClimateRecoveryPortfolioService,
  SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_METADATA,
} from './services/portfolioApplicationService';
export { calculateClimateOpportunityScore } from './scoring/climateOpportunityScore';
export { CLIMATE_OPPORTUNITY_SCORE_CONFIGURATION } from './scoring/climateOpportunityScoreConfig';
export {
  SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION,
  getSyntheticPortfolioConfiguration,
} from './data/syntheticPortfolio';
