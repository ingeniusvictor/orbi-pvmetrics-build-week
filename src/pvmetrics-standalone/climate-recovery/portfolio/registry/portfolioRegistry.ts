import type { SyntheticPortfolio } from '../contracts/portfolioContracts';
import { createSyntheticClimateRecoveryPortfolio } from '../data/syntheticPortfolio';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export type PortfolioRegistry = {
  get(): SyntheticPortfolio;
};

export const createPortfolioRegistry = (
  portfolio: SyntheticPortfolio = createSyntheticClimateRecoveryPortfolio(),
): PortfolioRegistry => {
  const immutableSource = clone(portfolio);
  return { get: () => clone(immutableSource) };
};
