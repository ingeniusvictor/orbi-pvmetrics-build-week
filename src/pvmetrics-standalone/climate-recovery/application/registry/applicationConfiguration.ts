import type { ClimateRecoveryApplicationConfiguration } from '../contracts/applicationContracts';

export const CLIMATE_RECOVERY_PRESENTATION_VERSION = 'cr-03.0.0-presentation';

export const DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION: Readonly<ClimateRecoveryApplicationConfiguration> =
  Object.freeze({
    defaultLocale: 'en',
    supportedLocales: ['es', 'en'] as const,
    energyDisplayUnit: 'MWh',
    emissionsDisplayUnit: 'tCO2e',
    decimalPrecision: 2,
    compactNumberThreshold: 100_000,
    catalogDefaultSort: 'priority-desc',
    catalogPageSize: 20,
    timelineMaxTraceHighlights: 5,
    executiveSummaryMaxWarnings: 4,
    allowSyntheticPortfolioAggregation: true,
    possibleOverlapAggregationPolicy: 'exclude-overlap',
    showUnavailableKpis: true,
    showBlockedClimateImpact: true,
    requireSyntheticDisclosure: true,
    presentationVersion: CLIMATE_RECOVERY_PRESENTATION_VERSION,
  });

export const resolveClimateRecoveryApplicationConfiguration = (
  overrides: Partial<ClimateRecoveryApplicationConfiguration> = {},
): ClimateRecoveryApplicationConfiguration => ({
  ...DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
  ...overrides,
  supportedLocales: ['es', 'en'],
});
