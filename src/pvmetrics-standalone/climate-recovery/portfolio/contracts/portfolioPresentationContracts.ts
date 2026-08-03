import type { CaseDetailPresentation, PortfolioSummaryPresentation } from '../../application/contracts/presentationModels';
import type { DataQualityStatus, RecoverabilityStatus } from '../../types/taxonomy';
import type { PortfolioAggregationPolicy, PortfolioMetadata } from './portfolioContracts';
import type { SyntheticAssetType } from './plantContracts';

export type PortfolioQuantity = {
  value?: number;
  unit: 'kWh' | 'kgCO2e' | 'MW' | 'MWh' | 'tCO2e';
  availability: 'available' | 'unavailable' | 'blocked' | 'not-applicable';
  origin: 'derived';
  datasetReality: 'synthetic';
  isEstimate: true;
  isVerified: false;
  disclosure: string;
  limitations: string[];
};

export type ClimateOpportunityScoreBand =
  | 'minimal'
  | 'low'
  | 'moderate'
  | 'high'
  | 'very-high';

export type ClimateOpportunityScore = {
  score: number;
  band: ClimateOpportunityScoreBand;
  labels: { es: string; en: string };
  components: {
    estimatedRecoverableEnergy: number;
    recoverability: number;
    priority: number;
    confidence: number;
    dataQuality: number;
    climateImpactAvailability: number;
    humanReviewReadiness: number;
    overlapPenalty: number;
    insufficientDataPenalty: number;
  };
  explanation: string[];
  limitations: string[];
  isProbability: false;
  isScientific: false;
  isCertified: false;
  isOperational: false;
};

export type PlantSummaryPresentation = {
  plantId: string;
  plantName: string;
  assetType: SyntheticAssetType;
  nominalCapacity: PortfolioQuantity;
  caseCount: number;
  recoverableCaseCount: number;
  partiallyRecoverableCaseCount: number;
  nonRecoverableCaseCount: number;
  insufficientDataCaseCount: number;
  pendingReviewCount: number;
  overlapWarningCount: number;
  estimatedRecoverableEnergy: PortfolioQuantity;
  estimatedClimateImpact: PortfolioQuantity;
  highestPriority: string;
  highPriorityCaseCount: number;
  climateOpportunityScore: ClimateOpportunityScore;
  dataQualityStatus: DataQualityStatus;
  dataQualityPenalty: number;
  overlapPenalty: number;
  recommendedNextStep: string;
  featuredCaseId?: string;
  disclosure: string;
  warnings: string[];
  limitations: string[];
};

export type PortfolioRankingItem = {
  rank: number;
  plantId: string;
  plantName: string;
  score: number;
  scoreBand: ClimateOpportunityScoreBand;
  estimatedRecoverableEnergy: PortfolioQuantity;
  estimatedClimateImpact: PortfolioQuantity;
  highPriorityCaseCount: number;
  pendingReviewCount: number;
  dataQualityPenalty: number;
  overlapPenalty: number;
  reasons: string[];
  limitations: string[];
  isSynthetic: true;
  isOperational: false;
};

export type PortfolioReviewQueueItem = {
  caseId: string;
  plantId: string;
  reason: string[];
  priority: string;
  urgency: 'review-first' | 'review-soon' | 'review-routine';
  recommendedReviewType: string[];
  evidenceGap: string[];
  dueOrder: number;
  isSynthetic: true;
};

export type DataQualityOverview = {
  totalCases: number;
  statuses: Array<{
    status: DataQualityStatus;
    count: number;
    percentage: number;
    affectedCaseIds: string[];
  }>;
  limitations: string[];
  recommendation: string;
};

export type RecoverabilityDistribution = {
  totalCases: number;
  statuses: Array<{
    status: RecoverabilityStatus;
    count: number;
    percentage: number;
    estimatedEnergy: PortfolioQuantity;
    exclusions: string[];
    warnings: string[];
  }>;
  disclosure: string;
};

export type PriorityDistribution = {
  totalCases: number;
  statuses: Array<{
    status: 'informational' | 'low' | 'medium' | 'high' | 'critical';
    count: number;
    percentage: number;
    caseIds: string[];
  }>;
  disclosure: string;
};

export type PortfolioAggregationPresentation = {
  policy: PortfolioAggregationPolicy;
  status: 'complete' | 'complete-with-exclusions' | 'warning' | 'blocked';
  includedCaseIds: string[];
  excludedCaseIds: string[];
  exclusionReasons: Record<string, string>;
  excludedEnergy: PortfolioQuantity;
  excludedClimateImpact: PortfolioQuantity;
  warnings: string[];
};

export type PortfolioExecutivePresentation = {
  summary: PortfolioSummaryPresentation;
  kpis: {
    plantCount: number;
    caseCount: number;
    estimatedRecoverableEnergy: PortfolioQuantity;
    estimatedClimateImpact: PortfolioQuantity;
  };
  plantSummaries: PlantSummaryPresentation[];
  rankings: PortfolioRankingItem[];
  featuredCases: CaseDetailPresentation[];
  reviewQueue: PortfolioReviewQueueItem[];
  dataQualityOverview: DataQualityOverview;
  recoverabilityDistribution: RecoverabilityDistribution;
  priorityDistribution: PriorityDistribution;
  climateImpactStatus: 'available' | 'partially-available' | 'blocked' | 'unavailable';
  aggregationPolicy: PortfolioAggregationPresentation;
  excludedCaseIds: string[];
  warnings: string[];
  disclosures: string[];
  metadata: PortfolioMetadata;
};
