import {
  DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
  createClimateRecoveryApplicationService,
} from '../../application';
import type { ClimateRecoveryApplicationService } from '../../application/contracts/applicationContracts';
import type { CaseDetailPresentation } from '../../application/contracts/presentationModels';
import { resolveClimateRecoveryText } from '../../application/registry/textRegistry';
import { assessClimateRecoveryCase } from '../../engine/assessmentEngine';
import type { DataQualityStatus, RecoverabilityStatus } from '../../types/taxonomy';
import type {
  PortfolioMetadata,
  PortfolioServiceOptions,
  PortfolioValidationResult,
  SyntheticPortfolio,
} from '../contracts/portfolioContracts';
import type {
  DataQualityOverview,
  PlantSummaryPresentation,
  PortfolioAggregationPresentation,
  PortfolioExecutivePresentation,
  PortfolioRankingItem,
  PortfolioReviewQueueItem,
  PriorityDistribution,
  RecoverabilityDistribution,
} from '../contracts/portfolioPresentationContracts';
import type { SyntheticPlant } from '../contracts/plantContracts';
import {
  SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION,
  createSyntheticClimateRecoveryPortfolio,
} from '../data/syntheticPortfolio';
import {
  SYNTHETIC_PORTFOLIO_DISCLOSURE,
  SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP,
} from '../data/syntheticEmissionFactors';
import { createPortfolioCaseRegistry } from '../registry/portfolioCaseRegistry';
import { createPlantRegistry, type PlantRegistry } from '../registry/plantRegistry';
import { createPortfolioRegistry, type PortfolioRegistry } from '../registry/portfolioRegistry';
import { validateSyntheticPortfolio } from '../validation/portfolioValidation';
import {
  assessmentClimateImpact,
  assessmentHasOverlap,
  assessmentRecoveredEnergy,
  createPlantSummary,
  portfolioQuantity,
} from './plantSummaryService';
import { createPlantRanking } from './portfolioRankingService';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export type SyntheticClimateRecoveryPortfolioServiceDependencies = {
  portfolio?: SyntheticPortfolio;
};

export type SyntheticClimateRecoveryPortfolioService = {
  getPortfolio(): SyntheticPortfolio;
  listPlants(): SyntheticPlant[];
  getPlant(plantId: string): SyntheticPlant | undefined;
  getPlantSummary(plantId: string, options?: PortfolioServiceOptions): PlantSummaryPresentation | undefined;
  getPortfolioExecutiveSummary(options?: PortfolioServiceOptions): PortfolioExecutivePresentation;
  getPlantRanking(options?: PortfolioServiceOptions): PortfolioRankingItem[];
  getReviewQueue(options?: PortfolioServiceOptions): PortfolioReviewQueueItem[];
  getFeaturedCases(options?: PortfolioServiceOptions): CaseDetailPresentation[];
  getDataQualityOverview(options?: PortfolioServiceOptions): DataQualityOverview;
  getRecoverabilityDistribution(options?: PortfolioServiceOptions): RecoverabilityDistribution;
  getPriorityDistribution(options?: PortfolioServiceOptions): PriorityDistribution;
  getPortfolioMetadata(): PortfolioMetadata;
  validatePortfolio(): PortfolioValidationResult;
};

const optionsWithDefaults = (options: PortfolioServiceOptions = {}): Required<PortfolioServiceOptions> => ({
  locale: options.locale ?? 'en',
  overlapPolicy: options.overlapPolicy ?? 'exclude-overlap',
  emissionFactorId: options.emissionFactorId ?? 'CR04-EF-CL-DEMO-2026',
});

const applicationFor = (
  portfolio: SyntheticPortfolio,
  options: Required<PortfolioServiceOptions>,
): ClimateRecoveryApplicationService => {
  const selected = portfolio.emissionFactors.find((item) => item.id === options.emissionFactorId);
  if (!selected) throw new Error(`Unknown synthetic emission factor: ${options.emissionFactorId}`);
  const remaining = portfolio.emissionFactors.filter((item) => item.id !== selected.id);
  const contextual = clone(portfolio);
  contextual.cases.forEach((caseData) => {
    caseData.emissionFactors = [clone(selected), ...clone(remaining)];
  });
  return createClimateRecoveryApplicationService({
    caseRegistry: createPortfolioCaseRegistry(contextual),
    assessmentEngine: assessClimateRecoveryCase,
    applicationConfiguration: DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
    textResolver: resolveClimateRecoveryText,
  });
};

const evaluateAll = (
  application: ClimateRecoveryApplicationService,
  portfolio: SyntheticPortfolio,
  options: Required<PortfolioServiceOptions>,
) => portfolio.caseDefinitions.map((definition) => {
  const result = application.evaluateCase(definition.caseId, {
    evaluationTimestamp: portfolio.evaluationTimestamp,
    locale: options.locale,
    configurationOverrides: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
  });
  if ('error' in result) throw new Error(result.error.message);
  return { definition, assessment: result.data };
});

const percentage = (count: number, total: number) => total === 0
  ? 0
  : Math.round((count / total) * 10_000) / 100;

const qualityOrder: DataQualityStatus[] = [
  'unavailable', 'conflicting', 'stale', 'incomplete', 'degraded', 'unknown', 'valid',
];

const caseQuality = (portfolio: SyntheticPortfolio, caseId: string): DataQualityStatus => {
  const caseData = portfolio.cases.find((item) => item.id === caseId);
  if (!caseData || caseData.evidence.length === 0) return 'unknown';
  return [...caseData.evidence.map((item) => item.qualityStatus)]
    .sort((left, right) => qualityOrder.indexOf(left) - qualityOrder.indexOf(right))[0];
};

const metadataFor = (portfolio: SyntheticPortfolio): PortfolioMetadata => ({
  portfolioName: portfolio.name,
  portfolioVersion: portfolio.version,
  productName: 'ORBI PVMetrics IA',
  editionName: 'Climate Recovery Edition',
  companyName: 'ORBI Ecosystem SpA',
  plantCount: portfolio.plants.length,
  caseCount: portfolio.cases.length,
  datasetReality: 'synthetic',
  evaluationTimestamp: portfolio.evaluationTimestamp,
  supportedLocales: ['es', 'en'] as const,
  credentialRequired: false,
  networkRequired: false,
  productionOperational: false,
  emissionFactorStatus: 'synthetic-configurable',
  disclosures: [portfolio.disclosure],
  limitations: [...portfolio.limitations],
});

const aggregationPresentation = (
  application: ClimateRecoveryApplicationService,
  portfolio: SyntheticPortfolio,
  options: Required<PortfolioServiceOptions>,
): PortfolioAggregationPresentation => {
  const summary = application.getPortfolioSummary({
    evaluationTimestamp: portfolio.evaluationTimestamp,
    locale: options.locale,
    overlapPolicy: options.overlapPolicy,
    configurationOverrides: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
  });
  const evaluated = evaluateAll(application, portfolio, options);
  const excluded = evaluated.filter((item) => summary.excludedCaseIds.includes(item.definition.caseId));
  const availableEnergy = excluded.map((item) => assessmentRecoveredEnergy(item.assessment)).filter((value) => value > 0);
  const availableClimate = excluded.map((item) => assessmentClimateImpact(item.assessment)).filter((value) => value > 0);
  const reasons: Record<string, string> = {};
  excluded.forEach((item) => {
    reasons[item.definition.caseId] = item.assessment.dataSufficiency.status === 'insufficient'
      ? 'Insufficient data.'
      : item.assessment.recoverability.status === 'non-recoverable'
        ? 'Non-recoverable through asset maintenance.'
        : assessmentHasOverlap(item.assessment)
          ? `Excluded by overlap policy ${options.overlapPolicy}.`
          : 'No eligible available recovery scenario.';
  });
  return {
    policy: options.overlapPolicy,
    status: summary.aggregationStatus,
    includedCaseIds: [...summary.includedCaseIds],
    excludedCaseIds: [...summary.excludedCaseIds],
    exclusionReasons: reasons,
    excludedEnergy: availableEnergy.length
      ? portfolioQuantity(availableEnergy.reduce((sum, value) => sum + value, 0), 'kWh', 'available', ['Available excluded estimates only; unavailable values are not zero-filled.'])
      : portfolioQuantity(undefined, 'kWh', 'unavailable', ['No excluded energy estimate is available.']),
    excludedClimateImpact: availableClimate.length
      ? portfolioQuantity(availableClimate.reduce((sum, value) => sum + value, 0), 'kgCO2e', 'available', ['Available excluded estimates only; not verified impact.'])
      : portfolioQuantity(undefined, 'kgCO2e', 'unavailable', ['No excluded climate estimate is available.']),
    warnings: [...summary.warnings],
  };
};

export const createSyntheticClimateRecoveryPortfolioService = (
  dependencies: SyntheticClimateRecoveryPortfolioServiceDependencies = {},
): SyntheticClimateRecoveryPortfolioService => {
  const source = clone(dependencies.portfolio ?? createSyntheticClimateRecoveryPortfolio());
  const portfolioRegistry: PortfolioRegistry = createPortfolioRegistry(source);
  const plantRegistry: PlantRegistry = createPlantRegistry(source.plants);

  const summariesFor = (options: Required<PortfolioServiceOptions>) => {
    const application = applicationFor(source, options);
    return plantRegistry.list().map((plant) =>
      createPlantSummary(application, plant, source.caseDefinitions, options),
    );
  };

  const dataQualityFor = (): DataQualityOverview => {
    const statuses: DataQualityStatus[] = ['valid', 'degraded', 'incomplete', 'stale', 'conflicting', 'unavailable', 'unknown'];
    const total = source.cases.length;
    return {
      totalCases: total,
      statuses: statuses.map((status) => {
        const affectedCaseIds = source.cases
          .filter((caseData) => caseQuality(source, caseData.id) === status)
          .map((caseData) => caseData.id);
        return { status, count: affectedCaseIds.length, percentage: percentage(affectedCaseIds.length, total), affectedCaseIds };
      }),
      limitations: ['Data quality describes evidence fitness, not plant or equipment health.'],
      recommendation: source.cases.some((item) => caseQuality(source, item.id) !== 'valid')
        ? 'Resolve unavailable or degraded evidence before relying on affected synthetic scenarios.'
        : 'Continue human review of traceability and methodology.',
    };
  };

  const recoverabilityFor = (options: Required<PortfolioServiceOptions>): RecoverabilityDistribution => {
    const application = applicationFor(source, options);
    const evaluated = evaluateAll(application, source, options);
    const statuses: RecoverabilityStatus[] = ['recoverable', 'partially-recoverable', 'non-recoverable', 'indeterminate', 'not-assessed'];
    return {
      totalCases: evaluated.length,
      statuses: statuses.map((status) => {
        const matching = evaluated.filter((item) => item.assessment.recoverability.status === status);
        const energies = matching.map((item) => assessmentRecoveredEnergy(item.assessment)).filter((value) => value > 0);
        return {
          status,
          count: matching.length,
          percentage: percentage(matching.length, evaluated.length),
          estimatedEnergy: energies.length
            ? portfolioQuantity(energies.reduce((sum, value) => sum + value, 0), 'kWh', 'available', ['CR-03 scenario values grouped by recoverability.'])
            : portfolioQuantity(undefined, 'kWh', status === 'non-recoverable' ? 'not-applicable' : 'unavailable', ['No positive available recovery scenario in this group.']),
          exclusions: matching.filter((item) => item.assessment.dataSufficiency.status === 'insufficient').map((item) => item.definition.caseId),
          warnings: matching.filter((item) => assessmentHasOverlap(item.assessment)).map((item) => `${item.definition.caseId} requires overlap review.`),
        };
      }),
      disclosure: SYNTHETIC_PORTFOLIO_DISCLOSURE,
    };
  };

  const priorityFor = (options: Required<PortfolioServiceOptions>): PriorityDistribution => {
    const application = applicationFor(source, options);
    const evaluated = evaluateAll(application, source, options);
    const statuses = ['informational', 'low', 'medium', 'high', 'critical'] as const;
    return {
      totalCases: evaluated.length,
      statuses: statuses.map((status) => {
        const caseIds = evaluated.filter((item) => item.assessment.priority.band === status).map((item) => item.definition.caseId);
        return { status, count: caseIds.length, percentage: percentage(caseIds.length, evaluated.length), caseIds };
      }),
      disclosure: 'Synthetic priority supports human review only; it is not an operational maintenance order.',
    };
  };

  const reviewQueueFor = (options: Required<PortfolioServiceOptions>): PortfolioReviewQueueItem[] => {
    const application = applicationFor(source, options);
    const evaluated = evaluateAll(application, source, options);
    const items = evaluated.flatMap(({ definition, assessment }) => {
      // CR-02's assessment-level review gate is canonical. Queue reasons add
      // context; they must never silently narrow the set of review-required cases.
      if (!assessment.requiresHumanReview) return [];
      const reasons: string[] = [];
      const reviewTypes: string[] = [];
      if (['high', 'critical'].includes(assessment.priority.band)) reasons.push(`${assessment.priority.band} synthetic priority`);
      if (assessmentHasOverlap(assessment)) { reasons.push('possible or confirmed overlap'); reviewTypes.push('overlap-review'); }
      if (assessment.dataSufficiency.status === 'insufficient') { reasons.push('insufficient data'); reviewTypes.push('data-quality-review'); }
      if (assessment.lossAssessments.some((loss) => loss.climateImpact.status === 'blocked')) { reasons.push('blocked climate impact'); reviewTypes.push('methodology-review'); }
      const actions = assessment.lossAssessments.flatMap((loss) => [...loss.recommendations.recommendedActions, ...loss.recommendations.suppressedActions]);
      if (actions.some((action) => action.actionType === 'field-inspection')) { reasons.push('field inspection recommendation gate'); reviewTypes.push('field-safety-review'); }
      if (actions.some((action) => action.actionType === 'maintenance-intervention')) { reasons.push('maintenance intervention recommendation gate'); reviewTypes.push('maintenance-review'); }
      if (assessment.hypotheses.some((item) => item.status === 'contradicted')) { reasons.push('contradicted hypothesis'); reviewTypes.push('hypothesis-review'); }
      if (assessment.recommendations.humanReviewStatus === 'needs-more-data') { reasons.push('needs more data'); reviewTypes.push('evidence-gap-review'); }
      if (reasons.length === 0) reasons.push('assessment requires human review');
      const evidenceGap = [...new Set([
        ...assessment.dataSufficiency.missingCriticalFields,
        ...assessment.dataSufficiency.recommendedDataRequests,
        ...assessment.hypotheses.flatMap((item) => item.missingEvidence),
      ])];
      return [{
        caseId: definition.caseId,
        plantId: definition.plantId,
        reason: [...new Set(reasons)],
        priority: assessment.priority.band,
        urgency: ['critical', 'high'].includes(assessment.priority.band) ? 'review-first' as const
          : assessment.dataSufficiency.status === 'insufficient' || assessmentHasOverlap(assessment) ? 'review-soon' as const
            : 'review-routine' as const,
        recommendedReviewType: [...new Set(reviewTypes.length ? reviewTypes : ['human-evidence-review'])],
        evidenceGap,
        dueOrder: 0,
        isSynthetic: true as const,
      }];
    });
    const urgency = { 'review-first': 0, 'review-soon': 1, 'review-routine': 2 };
    const priorityRank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, informational: 0 };
    return items.sort((left, right) => urgency[left.urgency] - urgency[right.urgency]
      || (priorityRank[right.priority] ?? 0) - (priorityRank[left.priority] ?? 0)
      || left.caseId.localeCompare(right.caseId))
      .map((item, index) => ({ ...item, dueOrder: index + 1 }));
  };

  const featuredFor = (options: Required<PortfolioServiceOptions>): CaseDetailPresentation[] => {
    const application = applicationFor(source, options);
    return source.caseDefinitions.filter((item) => item.featured).sort((a, b) => a.demoSequence - b.demoSequence).map((definition) => {
      const result = application.getCase(definition.caseId, {
        evaluationTimestamp: source.evaluationTimestamp,
        locale: options.locale,
        configurationOverrides: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
      });
      if ('error' in result) throw new Error(result.error.message);
      return result.data;
    });
  };

  return {
    getPortfolio: () => portfolioRegistry.get(),
    listPlants: () => plantRegistry.list(),
    getPlant: (plantId) => plantRegistry.getById(plantId),
    getPlantSummary: (plantId, rawOptions = {}) => {
      const plant = plantRegistry.getById(plantId);
      if (!plant) return undefined;
      const options = optionsWithDefaults(rawOptions);
      return createPlantSummary(applicationFor(source, options), plant, source.caseDefinitions, options);
    },
    getPlantRanking: (rawOptions = {}) => createPlantRanking(summariesFor(optionsWithDefaults(rawOptions))),
    getReviewQueue: (rawOptions = {}) => reviewQueueFor(optionsWithDefaults(rawOptions)),
    getFeaturedCases: (rawOptions = {}) => featuredFor(optionsWithDefaults(rawOptions)),
    getDataQualityOverview: () => dataQualityFor(),
    getRecoverabilityDistribution: (rawOptions = {}) => recoverabilityFor(optionsWithDefaults(rawOptions)),
    getPriorityDistribution: (rawOptions = {}) => priorityFor(optionsWithDefaults(rawOptions)),
    getPortfolioMetadata: () => metadataFor(source),
    validatePortfolio: () => validateSyntheticPortfolio(source),
    getPortfolioExecutiveSummary: (rawOptions = {}) => {
      const options = optionsWithDefaults(rawOptions);
      const application = applicationFor(source, options);
      const summary = application.getPortfolioSummary({
        evaluationTimestamp: source.evaluationTimestamp,
        locale: options.locale,
        overlapPolicy: options.overlapPolicy,
        configurationOverrides: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
      });
      const plantSummaries = summariesFor(options);
      const aggregationPolicy = aggregationPresentation(application, source, options);
      const availableClimate = plantSummaries.filter((item) => item.estimatedClimateImpact.availability === 'available').length;
      const blockedClimate = plantSummaries.filter((item) => item.estimatedClimateImpact.availability === 'blocked').length;
      return {
        summary,
        kpis: {
          plantCount: source.plants.length,
          caseCount: source.cases.length,
          estimatedRecoverableEnergy: summary.estimatedRecoverableEnergy.value === undefined
            ? portfolioQuantity(undefined, 'kWh', summary.estimatedRecoverableEnergy.availability === 'blocked' ? 'blocked' : 'unavailable', summary.warnings)
            : portfolioQuantity(summary.estimatedRecoverableEnergy.value, (summary.estimatedRecoverableEnergy.unit ?? 'kWh') as 'kWh' | 'MWh', 'available', summary.warnings),
          estimatedClimateImpact: summary.estimatedClimateImpact.value === undefined
            ? portfolioQuantity(undefined, 'kgCO2e', summary.estimatedClimateImpact.availability === 'blocked' ? 'blocked' : 'unavailable', summary.warnings)
            : portfolioQuantity(summary.estimatedClimateImpact.value, (summary.estimatedClimateImpact.unit ?? 'kgCO2e') as 'kgCO2e' | 'tCO2e', 'available', summary.warnings),
        },
        plantSummaries,
        rankings: createPlantRanking(plantSummaries),
        featuredCases: featuredFor(options),
        reviewQueue: reviewQueueFor(options),
        dataQualityOverview: dataQualityFor(),
        recoverabilityDistribution: recoverabilityFor(options),
        priorityDistribution: priorityFor(options),
        climateImpactStatus: blockedClimate === plantSummaries.length ? 'blocked'
          : availableClimate === plantSummaries.length ? 'available'
            : availableClimate > 0 ? 'partially-available'
              : blockedClimate > 0 ? 'blocked'
                : 'unavailable',
        aggregationPolicy,
        excludedCaseIds: [...summary.excludedCaseIds],
        warnings: [...new Set([...summary.warnings, ...plantSummaries.flatMap((item) => item.warnings)])],
        disclosures: [SYNTHETIC_PORTFOLIO_DISCLOSURE],
        metadata: metadataFor(source),
      } satisfies PortfolioExecutivePresentation;
    },
  };
};

export const SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_METADATA: Readonly<PortfolioMetadata> = Object.freeze({
  portfolioName: 'ORBI Synthetic Climate Recovery Portfolio',
  portfolioVersion: SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION,
  productName: 'ORBI PVMetrics IA',
  editionName: 'Climate Recovery Edition',
  companyName: 'ORBI Ecosystem SpA',
  plantCount: 5,
  caseCount: 14,
  evaluationTimestamp: SYNTHETIC_PORTFOLIO_EVALUATION_TIMESTAMP,
  datasetReality: 'synthetic',
  supportedLocales: ['es', 'en'] as const,
  credentialRequired: false,
  networkRequired: false,
  productionOperational: false,
  emissionFactorStatus: 'synthetic-configurable',
  disclosures: [SYNTHETIC_PORTFOLIO_DISCLOSURE],
  limitations: [
    'Synthetic deterministic demonstration only; no real assets, operational totals, or verified impact.',
    'Climate Opportunity Score is internal, non-scientific, non-probabilistic, and non-operational.',
  ],
});
