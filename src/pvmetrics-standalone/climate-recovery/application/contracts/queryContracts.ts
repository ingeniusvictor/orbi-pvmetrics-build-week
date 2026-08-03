import type { AssessmentConfigurationOverrides } from '../../contracts/assessment';
import type {
  ConfidenceLevel,
  RecoverabilityStatus,
  RecoverableLossCategory,
} from '../../types/taxonomy';
import type { PresentationAvailability } from './presentationModels';

export type ClimateRecoveryLocale = 'es' | 'en';

export type ClimateRecoveryCaseQuery = {
  caseId: string;
  evaluationTimestamp: string;
  locale: ClimateRecoveryLocale;
  configurationOverrides?: AssessmentConfigurationOverrides;
};

export type ClimateRecoveryCatalogFilters = {
  category?: RecoverableLossCategory | RecoverableLossCategory[];
  recoverability?: RecoverabilityStatus | RecoverabilityStatus[];
  priorityBand?: string | string[];
  confidenceLevel?: ConfidenceLevel | ConfidenceLevel[];
  dataSufficiency?: string | string[];
  humanReviewRequired?: boolean;
  climateImpactAvailability?: PresentationAvailability;
  syntheticOnly?: boolean;
};

export type ClimateRecoveryCatalogSort =
  | 'priority-desc'
  | 'priority-asc'
  | 'recoverable-energy-desc'
  | 'climate-impact-desc'
  | 'confidence-desc'
  | 'evaluated-at-desc'
  | 'case-title-asc';

export type ClimateRecoveryCatalogQuery = {
  evaluationTimestamp: string;
  locale: ClimateRecoveryLocale;
  filters?: ClimateRecoveryCatalogFilters;
  sort?: ClimateRecoveryCatalogSort;
  pagination?: { page: number; pageSize: number };
  configurationOverrides?: AssessmentConfigurationOverrides;
};

export type ClimateRecoveryPortfolioQuery = ClimateRecoveryCatalogQuery & {
  overlapPolicy?: 'exclude-overlap' | 'include-with-warning' | 'block-aggregation';
};

export type ClimateRecoveryCaseOptions = Omit<ClimateRecoveryCaseQuery, 'caseId'>;
