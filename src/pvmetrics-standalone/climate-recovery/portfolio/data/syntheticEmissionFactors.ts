import type { EmissionFactor } from '../../contracts/entities';

export const SYNTHETIC_PORTFOLIO_DISCLOSURE =
  'Fictional synthetic Climate Recovery portfolio for deterministic competition demonstration only; it contains no operational plant, customer, coordinate, telemetry, recovery, or verified emissions data.';

export const SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP =
  '2026-08-03T12:00:00.000Z';

export const SYNTHETIC_PORTFOLIO_CREATED_AT =
  '2026-08-03T09:00:00.000Z';

const factors: EmissionFactor[] = [
  {
    id: 'CR04-EF-CL-DEMO-2026',
    name: 'Synthetic Chile Grid Demo Factor 2026',
    region: 'CL-SYNTHETIC-DEMO',
    gridOrSystem: 'Synthetic national demonstration system',
    value: 0.371,
    unit: 'kgCO2e-per-kWh',
    year: 2026,
    sourceName: 'ORBI synthetic competition portfolio',
    methodology: 'Fictional fixed coefficient selected only to demonstrate deterministic counterfactual calculations.',
    origin: 'simulated',
    datasetReality: 'synthetic',
    qualityStatus: 'valid',
    validFrom: '2026-01-01T00:00:00.000Z',
    validTo: '2026-12-31T23:59:59.999Z',
    assumptions: ['The fictional coefficient remains constant for the seven-day demonstration horizon.'],
    limitations: ['Not an official, measured, regulatory, market, or regionally representative emission factor.'],
    isDefault: true,
    createdAt: SYNTHETIC_PORTFOLIO_CREATED_AT,
    updatedAt: SYNTHETIC_PORTFOLIO_CREATED_AT,
  },
  {
    id: 'CR04-EF-REGIONAL-SENSITIVITY-2026',
    name: 'Synthetic Regional Sensitivity Factor',
    region: 'SYNTHETIC-REGIONAL-SENSITIVITY',
    gridOrSystem: 'Synthetic sensitivity demonstration system',
    value: 0.463,
    unit: 'tCO2e-per-MWh',
    year: 2026,
    sourceName: 'ORBI synthetic competition portfolio',
    methodology: 'Fictional alternative coefficient used to demonstrate sensitivity without asserting a real regional value.',
    origin: 'simulated',
    datasetReality: 'synthetic',
    qualityStatus: 'valid',
    validFrom: '2026-01-01T00:00:00.000Z',
    validTo: '2026-12-31T23:59:59.999Z',
    assumptions: ['The alternative coefficient changes only the synthetic climate estimate, not energy recovery.'],
    limitations: ['Sensitivity-only value; not official, externally validated, or suitable for operational claims.'],
    isDefault: false,
    createdAt: SYNTHETIC_PORTFOLIO_CREATED_AT,
    updatedAt: SYNTHETIC_PORTFOLIO_CREATED_AT,
  },
];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createSyntheticPortfolioEmissionFactors = (): EmissionFactor[] => clone(factors);

export const SYNTHETIC_PORTFOLIO_EMISSION_FACTORS: readonly EmissionFactor[] =
  Object.freeze(factors);
