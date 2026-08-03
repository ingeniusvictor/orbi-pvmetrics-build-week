import type { ClimateRecoveryCase, EmissionFactor } from '../../contracts/entities';
import type {
  DataQualityStatus,
  RecoverabilityStatus,
  RecoverableLossCategory,
} from '../../types/taxonomy';
import type { SyntheticPlant } from './plantContracts';

export type PortfolioAggregationPolicy =
  | 'exclude-overlap'
  | 'include-with-warning'
  | 'block-aggregation';

export type PortfolioCaseDefinition = {
  caseId: string;
  plantId: string;
  displayName: string;
  category: RecoverableLossCategory;
  featured: boolean;
  demoSequence: number;
  narrativeRole: string;
  expectedRecoverability: RecoverabilityStatus;
  expectedPriorityBand: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  expectedDataSufficiency: 'sufficient' | 'partially-sufficient' | 'insufficient' | 'invalid';
  expectedClimateImpactAvailability: 'available' | 'unavailable' | 'blocked';
  includeInDefaultAggregation: boolean;
  exclusionReason?: string;
  syntheticDisclosure: string;
};

export type SyntheticPortfolio = {
  id: string;
  name: string;
  description: string;
  companyName: 'ORBI Ecosystem SpA';
  editionName: 'Climate Recovery Edition';
  datasetReality: 'synthetic';
  disclosure: string;
  plants: SyntheticPlant[];
  cases: ClimateRecoveryCase[];
  caseDefinitions: PortfolioCaseDefinition[];
  emissionFactors: EmissionFactor[];
  defaultEmissionFactorId: string;
  evaluationTimestamp: string;
  locale: 'es' | 'en';
  version: string;
  createdAt: string;
  assumptions: string[];
  limitations: string[];
};

export type PortfolioServiceOptions = {
  locale?: 'es' | 'en';
  overlapPolicy?: PortfolioAggregationPolicy;
  emissionFactorId?: string;
};

export type PortfolioMetadata = {
  portfolioName: string;
  portfolioVersion: string;
  productName: 'ORBI PVMetrics IA';
  editionName: 'Climate Recovery Edition';
  companyName: 'ORBI Ecosystem SpA';
  plantCount: number;
  caseCount: number;
  datasetReality: 'synthetic';
  evaluationTimestamp: string;
  supportedLocales: readonly ['es', 'en'];
  credentialRequired: false;
  networkRequired: false;
  productionOperational: false;
  emissionFactorStatus: 'synthetic-configurable';
  disclosures: string[];
  limitations: string[];
};

export type PortfolioValidationIssue = {
  code: string;
  path: string;
  message: string;
  severity: 'warning' | 'error';
};

export type PortfolioValidationResult = {
  valid: boolean;
  issues: PortfolioValidationIssue[];
  plantCount: number;
  caseCount: number;
  dataQualityCounts: Record<DataQualityStatus, number>;
};
