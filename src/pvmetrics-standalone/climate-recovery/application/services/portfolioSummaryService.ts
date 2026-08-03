import type { ClimateRecoveryApplicationConfiguration } from '../contracts/applicationContracts';
import type { ClimateRecoveryPortfolioQuery } from '../contracts/queryContracts';
import type { PortfolioSummaryPresentation } from '../contracts/presentationModels';
import { formatEmissions } from '../formatters/emissionsFormatter';
import { formatEnergy } from '../formatters/energyFormatter';
import { unavailableNumber } from '../formatters/numberFormatter';
import type { EvaluatedDemoCase } from './caseCatalogService';

const hasOverlap = (value: EvaluatedDemoCase) => value.assessment.doubleCounting.some(
  (item) => ['possible-overlap', 'confirmed-overlap'].includes(item.status),
);

const recoverableEnergy = (value: EvaluatedDemoCase) =>
  value.assessment.lossAssessments.reduce((sum, item) =>
    sum + (item.scenarios.find((scenario) => scenario.status === 'simulated')?.recoveredEnergy.valueKwh ?? 0),
  0);

const climateImpact = (value: EvaluatedDemoCase) =>
  value.assessment.lossAssessments.reduce((sum, item) =>
    sum + (['estimated', 'projected'].includes(item.climateImpact.status)
      ? item.climateImpact.avoidedEmissionsKgCO2e ?? 0
      : 0),
  0);

export const createPortfolioSummary = (
  evaluatedCases: EvaluatedDemoCase[],
  query: ClimateRecoveryPortfolioQuery,
  configuration: ClimateRecoveryApplicationConfiguration,
  syntheticDisclosure: string,
): PortfolioSummaryPresentation => {
  const policy = query.overlapPolicy ?? configuration.possibleOverlapAggregationPolicy;
  const overlapCases = evaluatedCases.filter(hasOverlap);
  const excluded = evaluatedCases.filter((item) =>
    item.assessment.recoverability.status === 'non-recoverable'
    || item.assessment.dataSufficiency.status === 'insufficient'
    || (policy === 'exclude-overlap' && hasOverlap(item)),
  );
  const candidates = evaluatedCases.filter((item) => !excluded.includes(item));
  const aggregationBlocked = !configuration.allowSyntheticPortfolioAggregation
    || (policy === 'block-aggregation' && overlapCases.length > 0);
  const included = aggregationBlocked ? [] : candidates;
  const energyTotal = included.reduce((sum, item) => sum + recoverableEnergy(item), 0);
  const climateTotal = included.reduce((sum, item) => sum + climateImpact(item), 0);
  const warnings = [
    ...(overlapCases.length > 0
      ? [`${overlapCases.length} case(s) contain possible or confirmed overlap; policy=${policy}.`]
      : []),
    ...(policy === 'include-with-warning' && overlapCases.length > 0
      ? ['Overlapping estimates are included provisionally and may be double counted.']
      : []),
    ...(aggregationBlocked
      ? ['Synthetic portfolio aggregation is blocked by configuration or overlap policy.']
      : []),
    'Synthetic aggregation is a demonstration and does not represent real or verified impact.',
  ];
  const common = {
    locale: query.locale,
    precision: configuration.decimalPrecision,
    compactThreshold: configuration.compactNumberThreshold,
    origin: 'derived' as const,
    datasetReality: 'synthetic' as const,
    isEstimate: true,
    disclosure: syntheticDisclosure,
    limitations: warnings,
  };
  const priorityDistribution: Record<string, number> = {};
  const dataQualityDistribution: Record<string, number> = {};
  for (const item of evaluatedCases) {
    priorityDistribution[item.assessment.priority.band] = (priorityDistribution[item.assessment.priority.band] ?? 0) + 1;
    dataQualityDistribution[item.assessment.dataSufficiency.status] = (dataQualityDistribution[item.assessment.dataSufficiency.status] ?? 0) + 1;
  }
  return {
    portfolioId: 'DEMO-CR-PORTFOLIO',
    portfolioName: 'Synthetic portfolio demonstration',
    caseCount: evaluatedCases.length,
    recoverableCaseCount: evaluatedCases.filter((item) => item.assessment.recoverability.status === 'recoverable').length,
    partiallyRecoverableCaseCount: evaluatedCases.filter((item) => item.assessment.recoverability.status === 'partially-recoverable').length,
    nonRecoverableCaseCount: evaluatedCases.filter((item) => item.assessment.recoverability.status === 'non-recoverable').length,
    insufficientDataCaseCount: evaluatedCases.filter((item) => item.assessment.dataSufficiency.status === 'insufficient').length,
    pendingHumanReviewCount: evaluatedCases.filter((item) => item.assessment.requiresHumanReview).length,
    possibleDoubleCountingCount: overlapCases.length,
    estimatedRecoverableEnergy: aggregationBlocked
      ? unavailableNumber(query.locale === 'es' ? 'Bloqueado' : 'Blocked', { ...common, unit: configuration.energyDisplayUnit }, 'blocked')
      : formatEnergy(energyTotal, configuration.energyDisplayUnit, common),
    estimatedClimateImpact: aggregationBlocked
      ? unavailableNumber(query.locale === 'es' ? 'Bloqueado' : 'Blocked', { ...common, unit: configuration.emissionsDisplayUnit }, 'blocked')
      : formatEmissions(climateTotal, configuration.emissionsDisplayUnit, common),
    priorityDistribution,
    dataQualityDistribution,
    disclosures: [syntheticDisclosure],
    warnings,
    aggregationStatus: aggregationBlocked
      ? 'blocked'
      : policy === 'include-with-warning' && overlapCases.length > 0
        ? 'warning'
        : excluded.length > 0
          ? 'complete-with-exclusions'
          : 'complete',
    excludedCaseIds: excluded.map((item) => item.entry.caseData.id),
    includedCaseIds: included.map((item) => item.entry.caseData.id),
    overlapPolicy: policy,
  };
};
