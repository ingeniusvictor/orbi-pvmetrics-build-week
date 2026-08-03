import type { ClimateRecoveryAssessmentResult } from '../../contracts/assessment';
import type { DemoCaseRegistryEntry } from '../contracts/applicationContracts';
import type { ClimateRecoveryCatalogQuery } from '../contracts/queryContracts';
import type { CaseCatalogItem } from '../contracts/presentationModels';
import { presentExecutiveSummary } from '../presenters/executiveSummaryPresenter';
import type { PresenterContext } from '../presenters/presenterContext';

export type EvaluatedDemoCase = {
  entry: DemoCaseRegistryEntry;
  assessment: ClimateRecoveryAssessmentResult;
  context: PresenterContext;
};

const matches = <T>(value: T, filter: T | T[] | undefined) =>
  filter === undefined || (Array.isArray(filter) ? filter.includes(value) : value === filter);

export const presentCatalogItem = (evaluated: EvaluatedDemoCase): CaseCatalogItem => {
  const { entry, assessment, context } = evaluated;
  const summary = presentExecutiveSummary(context);
  return {
    caseId: entry.caseData.id,
    title: entry.metadata.displayName,
    plantName: entry.metadata.plantDisplayName,
    assetName: entry.metadata.assetDisplayName,
    category: entry.caseData.losses[0]?.category ?? 'unknown',
    status: assessment.status,
    priority: summary.priorityScore,
    confidence: summary.confidence,
    recoverability: assessment.recoverability.status,
    estimatedRecoverableEnergy: summary.recoveryOpportunity.estimatedEnergy,
    estimatedClimateImpact: summary.climateImpact.estimatedAvoidedEmissions,
    recommendedNextStep: summary.recommendedNextStep,
    humanReviewRequired: assessment.requiresHumanReview,
    isSynthetic: true,
    evaluatedAt: assessment.evaluatedAt,
  };
};

export const filterCatalog = (
  evaluatedCases: EvaluatedDemoCase[],
  query: ClimateRecoveryCatalogQuery,
): EvaluatedDemoCase[] => {
  const filters = query.filters;
  if (!filters) return [...evaluatedCases];
  return evaluatedCases.filter(({ entry, assessment }) => {
    const category = entry.caseData.losses[0]?.category ?? 'unknown';
    return matches(category, filters.category)
      && matches(assessment.recoverability.status, filters.recoverability)
      && matches(assessment.priority.band, filters.priorityBand)
      && matches(assessment.recoverability.confidenceLevel, filters.confidenceLevel)
      && matches(assessment.dataSufficiency.status, filters.dataSufficiency)
      && (filters.humanReviewRequired === undefined
        || assessment.requiresHumanReview === filters.humanReviewRequired)
      && (filters.climateImpactAvailability === undefined
        || (['estimated', 'projected'].includes(assessment.climateImpact.status)
          ? 'available'
          : ['blocked', 'invalid'].includes(assessment.climateImpact.status)
            ? 'blocked'
            : 'unavailable') === filters.climateImpactAvailability)
      && (filters.syntheticOnly !== true || entry.metadata.datasetReality === 'synthetic');
  });
};

const recoveredEnergy = (assessment: ClimateRecoveryAssessmentResult) =>
  assessment.lossAssessments.reduce((sum, item) =>
    sum + (item.scenarios.find((scenario) => scenario.status === 'simulated')?.recoveredEnergy.valueKwh ?? 0),
  0);

const climateImpact = (assessment: ClimateRecoveryAssessmentResult) =>
  assessment.lossAssessments.reduce((sum, item) =>
    sum + (['estimated', 'projected'].includes(item.climateImpact.status)
      ? item.climateImpact.avoidedEmissionsKgCO2e ?? 0
      : 0),
  0);

export const sortCatalog = (
  values: EvaluatedDemoCase[],
  sort: ClimateRecoveryCatalogQuery['sort'],
): EvaluatedDemoCase[] => [...values].sort((a, b) => {
  const stable = () => a.entry.metadata.sortOrder - b.entry.metadata.sortOrder;
  switch (sort) {
    case 'priority-asc':
      return a.assessment.priority.score - b.assessment.priority.score || stable();
    case 'recoverable-energy-desc':
      return recoveredEnergy(b.assessment) - recoveredEnergy(a.assessment) || stable();
    case 'climate-impact-desc':
      return climateImpact(b.assessment) - climateImpact(a.assessment) || stable();
    case 'confidence-desc':
      return b.assessment.recoverability.confidenceScore - a.assessment.recoverability.confidenceScore || stable();
    case 'evaluated-at-desc':
      return b.assessment.evaluatedAt.localeCompare(a.assessment.evaluatedAt) || stable();
    case 'case-title-asc':
      return a.entry.metadata.displayName.localeCompare(b.entry.metadata.displayName) || stable();
    case 'priority-desc':
    default:
      return b.assessment.priority.score - a.assessment.priority.score || stable();
  }
});
