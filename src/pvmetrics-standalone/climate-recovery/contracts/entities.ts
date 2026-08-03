import type { MetadataValue, TimeWindow, UncertaintyRange } from '../types/common';
import type {
  ConfidenceLevel,
  DataOrigin,
  DataQualityStatus,
  DatasetReality,
  EvidenceDirection,
  HumanReviewStatus,
  HypothesisGenerator,
  HypothesisStatus,
  OperationalSeverity,
  RecommendedActionType,
  RecoverabilityStatus,
  RecoverableLossCategory,
  RecoveryHorizon,
  VerificationStatus,
} from '../types/taxonomy';

export type DataProvenance = {
  sourceId: string;
  sourceType: string;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  qualityStatus: DataQualityStatus;
  observedAt: string;
  receivedAt?: string;
  validFrom?: string;
  validTo?: string;
  unit?: string;
  methodology?: string;
  assumptions: string[];
  limitations: string[];
  syntheticDisclosure?: string;
  traceId: string;
  metadata?: Record<string, MetadataValue>;
};

export type EvidenceItem = {
  id: string;
  title: string;
  description: string;
  direction: EvidenceDirection;
  metricKey?: string;
  observedValue?: number | string | boolean | null;
  expectedValue?: number | string | boolean | null;
  delta?: number;
  unit?: string;
  provenance: DataProvenance;
  weight?: number;
  qualityStatus: DataQualityStatus;
  notes: string[];
  createdAt: string;
};

export type DiagnosticHypothesis = {
  id: string;
  title: string;
  summary: string;
  category: RecoverableLossCategory;
  status: HypothesisStatus;
  confidenceLevel: ConfidenceLevel;
  confidenceScore?: number;
  evidenceFor: string[];
  evidenceAgainst: string[];
  missingEvidence: string[];
  assumptions: string[];
  limitations: string[];
  alternativeHypothesisIds: string[];
  requiresHumanReview: boolean;
  humanReviewStatus: HumanReviewStatus;
  createdAt: string;
  updatedAt: string;
  generatedBy: HypothesisGenerator;
  modelOrRuleVersion?: string;
};

export type RecoverableLoss = {
  id: string;
  assetId: string;
  plantId: string;
  detectedAt: string;
  analysisWindow: TimeWindow;
  category: RecoverableLossCategory;
  title: string;
  description: string;
  recoverabilityStatus: RecoverabilityStatus;
  operationalSeverity: OperationalSeverity;
  estimatedPowerLossKw?: number;
  estimatedEnergyLossKwh?: number;
  estimatedDailyEnergyLossKwh?: number;
  uncertaintyRange: UncertaintyRange;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  confidenceLevel: ConfidenceLevel;
  confidenceScore?: number;
  evidenceIds: string[];
  hypothesisIds: string[];
  exclusions: string[];
  assumptions: string[];
  limitations: string[];
  doubleCountingGroupId?: string;
  status:
    | 'detected'
    | 'assessing'
    | 'actionable'
    | 'monitoring'
    | 'resolved'
    | 'dismissed'
    | 'invalidated';
  humanReviewStatus: HumanReviewStatus;
  createdAt: string;
  updatedAt: string;
};

export type RecommendedAction = {
  id: string;
  lossId: string;
  title: string;
  description: string;
  actionType: RecommendedActionType;
  urgency: 'informational' | 'routine' | 'soon' | 'urgent';
  rationale: string;
  expectedOutcome: string;
  prerequisites: string[];
  safetyNotes: string[];
  uncertaintyNotes: string[];
  evidenceIds: string[];
  hypothesisIds: string[];
  estimatedEffort?: string;
  estimatedCost?: {
    amount: number;
    currency: string;
    origin: Extract<DataOrigin, 'estimated' | 'externally-supplied' | 'manually-entered'>;
  };
  requiresApproval: boolean;
  humanReviewStatus: HumanReviewStatus;
  status:
    | 'proposed'
    | 'approved'
    | 'scheduled'
    | 'in-progress'
    | 'completed'
    | 'cancelled'
    | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type EmissionFactor = {
  id: string;
  name: string;
  region: string;
  gridOrSystem: string;
  value: number;
  unit: 'kgCO2e-per-kWh' | 'tCO2e-per-MWh';
  year: number;
  sourceName: string;
  sourceUrl?: string;
  methodology: string;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  qualityStatus: DataQualityStatus;
  validFrom: string;
  validTo?: string;
  assumptions: string[];
  limitations: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClimateImpactEstimate = {
  id: string;
  lossId: string;
  scenarioId?: string;
  emissionFactorId: string;
  recoveredEnergyKwh: number;
  avoidedEmissionsKgCO2e: number;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  methodology: string;
  uncertaintyRange: UncertaintyRange;
  assumptions: string[];
  limitations: string[];
  doubleCountingGroupId?: string;
  status:
    | 'draft'
    | 'estimated'
    | 'projected'
    | 'provisionally-verified'
    | 'verified'
    | 'invalidated';
  calculatedAt: string;
  verificationStatus: VerificationStatus;
  humanReviewStatus: HumanReviewStatus;
};

export type RecoveryScenario = {
  id: string;
  lossId: string;
  name: string;
  description: string;
  horizon: RecoveryHorizon;
  customHorizonDays?: number;
  interventionAssumption: string;
  noInterventionEnergyLossKwh: number;
  interventionEnergyLossKwh: number;
  estimatedRecoveredEnergyKwh: number;
  uncertaintyRange: UncertaintyRange;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  assumptions: string[];
  limitations: string[];
  emissionFactorId?: string;
  climateImpactEstimateId?: string;
  createdAt: string;
  generatedBy: HypothesisGenerator;
  status: 'draft' | 'simulated' | 'approved-for-review' | 'rejected' | 'superseded';
};

export type RecoveryVerification = {
  id: string;
  lossId: string;
  actionId: string;
  scenarioId?: string;
  verificationWindow: TimeWindow;
  baselinePeriod: TimeWindow;
  postActionPeriod: TimeWindow;
  baselineEnergyKwh: number;
  observedPostActionEnergyKwh: number;
  normalizedExpectedEnergyKwh?: number;
  estimatedRecoveredEnergyKwh: number;
  uncertaintyRange: UncertaintyRange;
  weatherNormalizationApplied: boolean;
  normalizationMethod?: string;
  confoundingFactors: string[];
  dataQualityStatus: DataQualityStatus;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  verificationStatus: VerificationStatus;
  confidenceLevel: ConfidenceLevel;
  confidenceScore?: number;
  evidenceIds: string[];
  assumptions: string[];
  limitations: string[];
  humanReviewStatus: HumanReviewStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClimateRecoveryCase = {
  id: string;
  title: string;
  summary: string;
  plant: {
    id: string;
    name: string;
  };
  asset: {
    id: string;
    plantId: string;
    name: string;
    type: 'plant' | 'inverter' | 'string' | 'sensor' | 'communications' | 'bess' | 'grid-interface';
  };
  losses: RecoverableLoss[];
  evidence: EvidenceItem[];
  hypotheses: DiagnosticHypothesis[];
  actions: RecommendedAction[];
  scenarios: RecoveryScenario[];
  emissionFactors: EmissionFactor[];
  climateImpactEstimates: ClimateImpactEstimate[];
  verifications: RecoveryVerification[];
  status: 'open' | 'under-review' | 'actionable' | 'monitoring' | 'closed' | 'invalidated';
  provenance: DataProvenance[];
  traceIds: string[];
  humanReviewStatus: HumanReviewStatus;
  createdAt: string;
  updatedAt: string;
};
