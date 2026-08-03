import type { ClimateRecoveryApplicationService } from '../../application/contracts/applicationContracts';
import type { ClimateRecoveryAssessmentResult } from '../../contracts/assessment';
import type { PortfolioCaseDefinition, PortfolioServiceOptions } from '../contracts/portfolioContracts';
import type { PlantSummaryPresentation, PortfolioQuantity } from '../contracts/portfolioPresentationContracts';
import type { SyntheticPlant } from '../contracts/plantContracts';
import { SYNTHETIC_PORTFOLIO_DISCLOSURE, SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP } from '../data/syntheticEmissionFactors';
import { calculateClimateOpportunityScore } from '../scoring/climateOpportunityScore';

export type EvaluatedPortfolioCase = {
  definition: PortfolioCaseDefinition;
  assessment: ClimateRecoveryAssessmentResult;
};

const quantity = (
  value: number | undefined,
  unit: PortfolioQuantity['unit'],
  availability: PortfolioQuantity['availability'] = value === undefined ? 'unavailable' : 'available',
  limitations: string[] = [],
): PortfolioQuantity => ({
  ...(value !== undefined ? { value: Math.round(value * 100) / 100 } : {}),
  unit,
  availability,
  origin: 'derived',
  datasetReality: 'synthetic',
  isEstimate: true,
  isVerified: false,
  disclosure: SYNTHETIC_PORTFOLIO_DISCLOSURE,
  limitations,
});

export const evaluatePlantCases = (
  applicationService: ClimateRecoveryApplicationService,
  plant: SyntheticPlant,
  definitions: PortfolioCaseDefinition[],
  options: PortfolioServiceOptions = {},
): EvaluatedPortfolioCase[] => plant.caseIds.map((caseId) => {
  const definition = definitions.find((item) => item.caseId === caseId);
  if (!definition) throw new Error(`Missing CR-04 definition for ${caseId}.`);
  const result = applicationService.evaluateCase(caseId, {
    evaluationTimestamp: SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP,
    locale: options.locale ?? 'en',
    configurationOverrides: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
  });
  if ('error' in result) throw new Error(result.error.message);
  return { definition, assessment: result.data };
});

const overlapStatuses = (assessment: ClimateRecoveryAssessmentResult) =>
  assessment.doubleCounting.filter((item) => ['possible-overlap', 'confirmed-overlap'].includes(item.status));

const recoveredEnergy = (assessment: ClimateRecoveryAssessmentResult) =>
  assessment.lossAssessments.reduce((sum, item) =>
    sum + (item.scenarios.find((scenario) => scenario.status === 'simulated')?.recoveredEnergy.valueKwh ?? 0), 0);

const climateImpact = (assessment: ClimateRecoveryAssessmentResult) =>
  assessment.lossAssessments.reduce((sum, item) =>
    sum + (['estimated', 'projected'].includes(item.climateImpact.status)
      ? item.climateImpact.avoidedEmissionsKgCO2e ?? 0
      : 0), 0);

const excludedFromAggregation = (
  item: EvaluatedPortfolioCase,
  policy: NonNullable<PortfolioServiceOptions['overlapPolicy']>,
) => item.assessment.recoverability.status === 'non-recoverable'
  || item.assessment.dataSufficiency.status === 'insufficient'
  || item.assessment.dataSufficiency.status === 'invalid'
  || item.assessment.lossAssessments.every((loss) => !loss.scenarios.some((scenario) => scenario.status === 'simulated'))
  || overlapStatuses(item.assessment).some((overlap) => overlap.status === 'confirmed-overlap')
  || (policy === 'exclude-overlap' && overlapStatuses(item.assessment).length > 0);

const priorityOrder = ['informational', 'low', 'medium', 'high', 'critical'];
const dataQualityRatio = (status: ClimateRecoveryAssessmentResult['dataSufficiency']['status']) =>
  ({ sufficient: 1, 'partially-sufficient': 0.65, insufficient: 0.2, invalid: 0 })[status];
const recoverabilityRatio = (status: ClimateRecoveryAssessmentResult['recoverability']['status']) =>
  ({ recoverable: 1, 'partially-recoverable': 0.5, 'non-recoverable': 0, indeterminate: 0.1, 'not-assessed': 0 })[status];

const chooseFeaturedCase = (items: EvaluatedPortfolioCase[]): string | undefined =>
  [...items].sort((left, right) => {
    const priority = right.assessment.priority.score - left.assessment.priority.score;
    if (priority) return priority;
    const energy = recoveredEnergy(right.assessment) - recoveredEnergy(left.assessment);
    if (energy) return energy;
    const quality = dataQualityRatio(right.assessment.dataSufficiency.status) - dataQualityRatio(left.assessment.dataSufficiency.status);
    if (quality) return quality;
    const review = Number(right.assessment.requiresHumanReview) - Number(left.assessment.requiresHumanReview);
    if (review) return review;
    const featured = Number(right.definition.featured) - Number(left.definition.featured);
    return featured || left.definition.caseId.localeCompare(right.definition.caseId);
  })[0]?.definition.caseId;

export const createPlantSummary = (
  applicationService: ClimateRecoveryApplicationService,
  plant: SyntheticPlant,
  definitions: PortfolioCaseDefinition[],
  options: PortfolioServiceOptions = {},
): PlantSummaryPresentation => {
  const evaluated = evaluatePlantCases(applicationService, plant, definitions, options);
  const policy = options.overlapPolicy ?? 'exclude-overlap';
  const overlaps = evaluated.flatMap((item) => overlapStatuses(item.assessment));
  const blocked = policy === 'block-aggregation' && overlaps.length > 0;
  const included = blocked ? [] : evaluated.filter((item) => !excludedFromAggregation(item, policy));
  const energyAvailableCount = included.filter((item) => assessmentRecoveredEnergy(item.assessment) > 0).length;
  const energy = included.reduce((sum, item) => sum + recoveredEnergy(item.assessment), 0);
  const climate = included.reduce((sum, item) => sum + climateImpact(item.assessment), 0);
  const insufficient = evaluated.filter((item) => item.assessment.dataSufficiency.status === 'insufficient').length;
  const possible = overlaps.filter((item) => item.status === 'possible-overlap').length;
  const confirmed = overlaps.filter((item) => item.status === 'confirmed-overlap').length;
  const highest = evaluated.reduce((current, item) =>
    priorityOrder.indexOf(item.assessment.priority.band) > priorityOrder.indexOf(current)
      ? item.assessment.priority.band
      : current, 'informational');
  const climateAvailableCount = evaluated.filter((item) =>
    item.assessment.lossAssessments.some((loss) => ['estimated', 'projected'].includes(loss.climateImpact.status)),
  ).length;
  const score = calculateClimateOpportunityScore({
    estimatedRecoverableEnergyKwh: energy,
    recoverabilityRatios: evaluated.map((item) => recoverabilityRatio(item.assessment.recoverability.status)),
    highestPriorityScore: Math.max(...evaluated.map((item) => item.assessment.priority.score), 0),
    confidenceScores: evaluated.map((item) => item.assessment.recoverability.confidenceScore),
    dataQualityRatios: evaluated.map((item) => dataQualityRatio(item.assessment.dataSufficiency.status)),
    climateAvailableCount,
    reviewReadyCount: evaluated.filter((item) => item.assessment.requiresHumanReview && item.assessment.dataSufficiency.status !== 'insufficient').length,
    caseCount: evaluated.length,
    possibleOverlapCount: possible,
    insufficientDataCount: insufficient,
    confirmedOverlapCount: confirmed,
  });
  const warnings = [
    ...(overlaps.length ? [`${overlaps.length} overlap warning(s) require human review; policy=${policy}.`] : []),
    ...(insufficient ? [`${insufficient} case(s) have insufficient data and are excluded from aggregation.`] : []),
    ...(blocked ? ['Aggregation is blocked by the selected overlap policy.'] : []),
  ];
  const qualityStatus = evaluated.some((item) => item.assessment.dataSufficiency.status === 'invalid') ? 'unavailable'
    : insufficient > 0 ? 'incomplete'
      : evaluated.some((item) => item.assessment.dataSufficiency.status === 'partially-sufficient') ? 'degraded'
        : 'valid';
  const recommendedNextStep = insufficient > 0
    ? 'Resolve the documented evidence gaps before reassessment.'
    : overlaps.length > 0
      ? 'Complete human overlap review before using aggregate values.'
      : ['high', 'critical'].includes(highest)
        ? 'Perform the highest-priority read-only review; no maintenance is automatically dispatched.'
        : 'Continue human review of the synthetic opportunities and limitations.';
  return {
    plantId: plant.id,
    plantName: plant.name,
    assetType: plant.assetType,
    nominalCapacity: quantity(plant.nominalCapacityMw, 'MW', 'available', ['Nominal synthetic capacity; not an operational measurement.']),
    caseCount: evaluated.length,
    recoverableCaseCount: evaluated.filter((item) => item.assessment.recoverability.status === 'recoverable').length,
    partiallyRecoverableCaseCount: evaluated.filter((item) => item.assessment.recoverability.status === 'partially-recoverable').length,
    nonRecoverableCaseCount: evaluated.filter((item) => item.assessment.recoverability.status === 'non-recoverable').length,
    insufficientDataCaseCount: insufficient,
    pendingReviewCount: evaluated.filter((item) => item.assessment.requiresHumanReview).length,
    overlapWarningCount: overlaps.length,
    estimatedRecoverableEnergy: blocked
      ? quantity(undefined, 'kWh', 'blocked', warnings)
      : energyAvailableCount === 0
        ? quantity(undefined, 'kWh', 'unavailable', ['No eligible CR-03 recovery scenario is available.'])
        : quantity(energy, 'kWh', 'available', ['Only eligible CR-03 scenario values are summed.']),
    estimatedClimateImpact: blocked
      ? quantity(undefined, 'kgCO2e', 'blocked', warnings)
      : climateAvailableCount === 0
        ? quantity(undefined, 'kgCO2e', 'unavailable', ['No eligible CR-03 climate estimate is available.'])
        : quantity(climate, 'kgCO2e', 'available', ['Counterfactual synthetic estimate; not verified emissions.']),
    highestPriority: highest,
    highPriorityCaseCount: evaluated.filter((item) => ['high', 'critical'].includes(item.assessment.priority.band)).length,
    climateOpportunityScore: score,
    dataQualityStatus: qualityStatus,
    dataQualityPenalty: Math.abs(score.components.insufficientDataPenalty),
    overlapPenalty: Math.abs(score.components.overlapPenalty),
    recommendedNextStep,
    featuredCaseId: chooseFeaturedCase(evaluated),
    disclosure: SYNTHETIC_PORTFOLIO_DISCLOSURE,
    warnings,
    limitations: [
      'Plant summary is derived from CR-03 assessments at the fixed CR-04 timestamp.',
      'Unavailable, blocked, non-recoverable, and policy-excluded values are not converted to zero.',
    ],
  };
};

export const portfolioQuantity = quantity;
export const assessmentRecoveredEnergy = recoveredEnergy;
export const assessmentClimateImpact = climateImpact;
export const assessmentHasOverlap = (assessment: ClimateRecoveryAssessmentResult) => overlapStatuses(assessment).length > 0;
