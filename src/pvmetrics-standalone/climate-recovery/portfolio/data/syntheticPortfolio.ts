import type { SyntheticPortfolio } from '../contracts/portfolioContracts';
import { createPortfolioCaseDefinitions, createSyntheticPortfolioCases } from './syntheticCases';
import {
  SYNTHETIC_PORTFOLIO_CREATED_AT,
  SYNTHETIC_PORTFOLIO_DISCLOSURE,
  SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP,
  createSyntheticPortfolioEmissionFactors,
} from './syntheticEmissionFactors';
import { SYNTHETIC_PORTFOLIO_ID, createSyntheticPlants } from './syntheticPlants';

export const SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION = 'cr-04.0.0-synthetic-portfolio';

const build = (): SyntheticPortfolio => ({
  id: SYNTHETIC_PORTFOLIO_ID,
  name: 'ORBI Synthetic Climate Recovery Portfolio',
  description: 'Five-asset, fourteen-case deterministic portfolio for executive Climate Recovery demonstration.',
  companyName: 'ORBI Ecosystem SpA',
  editionName: 'Climate Recovery Edition',
  datasetReality: 'synthetic',
  disclosure: SYNTHETIC_PORTFOLIO_DISCLOSURE,
  plants: createSyntheticPlants(),
  cases: createSyntheticPortfolioCases(),
  caseDefinitions: createPortfolioCaseDefinitions(),
  emissionFactors: createSyntheticPortfolioEmissionFactors(),
  defaultEmissionFactorId: 'CR04-EF-CL-DEMO-2026',
  evaluationTimestamp: SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP,
  locale: 'en',
  version: SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION,
  createdAt: SYNTHETIC_PORTFOLIO_CREATED_AT,
  assumptions: [
    'All assets, observations, estimates, factors, and scenarios are fictional.',
    'The same explicit input and timestamp produce the same output.',
    'Portfolio aggregation excludes overlap by default and never implies operational recovery.',
  ],
  limitations: [
    'No live data, coordinates, customers, vendors, network, credentials, persistence, or operational commands.',
    'Climate Opportunity Score is an internal transparent demo index, not a probability or scientific metric.',
    'Energy and climate quantities are estimated counterfactual presentation values and are never verified.',
  ],
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createSyntheticClimateRecoveryPortfolio = (): SyntheticPortfolio => build();

export const SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO: Readonly<SyntheticPortfolio> =
  Object.freeze(build());

export const getSyntheticPortfolioConfiguration = () => ({
  portfolioId: SYNTHETIC_PORTFOLIO_ID,
  portfolioVersion: SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION,
  evaluationTimestamp: SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP,
  defaultEmissionFactorId: 'CR04-EF-CL-DEMO-2026',
  defaultOverlapPolicy: 'exclude-overlap' as const,
  supportedLocales: ['es', 'en'] as const,
});

export const cloneSyntheticPortfolio = (): SyntheticPortfolio =>
  clone(SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO);
