import type {
  ClimateRecoveryCase,
  DiagnosticHypothesis,
  EmissionFactor,
  RecommendedAction,
  RecoverableLoss,
} from './entities';
import type { UncertaintyRange } from '../types/common';
import type {
  ConfidenceLevel,
  DataOrigin,
  DatasetReality,
  HumanReviewStatus,
  RecoverabilityStatus,
  RecoveryHorizon,
} from '../types/taxonomy';
import type { ValidationResult } from '../types/validation';
import type { DoubleCountingAssessment } from '../utils/doubleCounting';

export type EnergyLossMethod =
  | 'auto'
  | 'direct-difference'
  | 'power-duration'
  | 'peer-comparison'
  | 'unavailable';

export type AssessmentRequestedOperations = {
  assessEnergyLoss?: boolean;
  generateRecoveryScenarios?: boolean;
  estimateClimateImpact?: boolean;
  recoveryHorizons?: RecoveryHorizon[];
  customHorizonDays?: number;
  emissionFactorId?: string;
  recoveryRate?: number;
  energyLossInputs?: {
    expectedEnergyKwh?: number;
    actualEnergyKwh?: number;
    estimatedPowerLossKw?: number;
    durationHours?: number;
    peerExpectedEnergyKwh?: number;
    actualComparableEnergyKwh?: number;
  };
};

export type AssessmentOperatorContext = {
  operatorId?: string;
  operationalContext?: string[];
  safetyRisk?: number;
  safetyNotes?: string[];
};

export type AssessmentConfiguration = {
  minimumEvidenceCount: number;
  minimumSupportingEvidenceWeight: number;
  maximumAllowedDataAgeMinutes: number;
  confidenceThresholds: {
    veryLowMaximum: number;
    lowMaximum: number;
    mediumMaximum: number;
    highMaximum: number;
  };
  priorityWeights: PriorityAssessment['components'];
  priorityReferenceEnergyKwh: number;
  priorityReferenceClimateKgCO2e: number;
  uncertaintyPolicy: {
    highQualityFraction: number;
    mediumQualityFraction: number;
    degradedQualityFraction: number;
  };
  evidenceQualityWeights: Record<
    'valid' | 'degraded' | 'incomplete' | 'stale' | 'conflicting' | 'unavailable' | 'unknown',
    number
  >;
  defaultEvidenceWeight: number;
  allowClimateImpactEstimate: boolean;
  requireHumanReviewForHighPriority: boolean;
  requireEmissionFactorForClimateImpact: boolean;
  allowSyntheticProjection: boolean;
  doubleCountingPolicy: {
    possibleOverlap: 'warn' | 'provisional' | 'block';
    confirmedOverlap: 'block' | 'provisional';
  };
  energyLossMethod: EnergyLossMethod;
  defaultRecoveryHorizons: RecoveryHorizon[];
  recoveryRates: Record<RecoverabilityStatus, number | null>;
};

export type AssessmentConfigurationOverrides = Partial<
  Omit<
    AssessmentConfiguration,
    | 'confidenceThresholds'
    | 'priorityWeights'
    | 'uncertaintyPolicy'
    | 'evidenceQualityWeights'
    | 'doubleCountingPolicy'
    | 'recoveryRates'
  >
> & {
  confidenceThresholds?: Partial<AssessmentConfiguration['confidenceThresholds']>;
  priorityWeights?: Partial<AssessmentConfiguration['priorityWeights']>;
  uncertaintyPolicy?: Partial<AssessmentConfiguration['uncertaintyPolicy']>;
  evidenceQualityWeights?: Partial<AssessmentConfiguration['evidenceQualityWeights']>;
  doubleCountingPolicy?: Partial<AssessmentConfiguration['doubleCountingPolicy']>;
  recoveryRates?: Partial<AssessmentConfiguration['recoveryRates']>;
};

export type AssessmentInput = {
  caseData: ClimateRecoveryCase;
  evaluationTimestamp: string;
  emissionFactors: EmissionFactor[];
  configuration?: AssessmentConfigurationOverrides;
  requestedOperations: AssessmentRequestedOperations;
  operatorContext?: AssessmentOperatorContext;
  previousAssessment?: ClimateRecoveryAssessmentResult;
};

export type AssessmentTraceStage =
  | 'input-validation'
  | 'data-sufficiency'
  | 'evidence-scoring'
  | 'recoverability'
  | 'hypothesis-generation'
  | 'energy-loss'
  | 'scenario-generation'
  | 'climate-impact'
  | 'recommendation'
  | 'priority'
  | 'double-counting'
  | 'final-status';

export type AssessmentTraceStep = {
  id: string;
  stage: AssessmentTraceStage;
  ruleId: string;
  description: string;
  inputReferences: string[];
  outputSummary: string;
  warnings: string[];
  limitations: string[];
  timestamp: string;
  deterministic: true;
  version: string;
};

export type DataSufficiencyAssessment = {
  status: 'sufficient' | 'partially-sufficient' | 'insufficient' | 'invalid';
  availableEvidenceCount: number;
  supportingEvidenceCount: number;
  contradictingEvidenceCount: number;
  unavailableEvidenceCount: number;
  missingCriticalFields: string[];
  staleDataSources: string[];
  degradedDataSources: string[];
  conflictingDataSources: string[];
  blockingReasons: string[];
  warnings: string[];
  requiresMoreData: boolean;
  recommendedDataRequests: string[];
  confidenceCap?: number;
};

export type EvidenceAssessment = {
  supportingScore: number;
  contradictingScore: number;
  neutralScore: number;
  unavailableScore: number;
  netEvidenceScore: number;
  evidenceBalance: 'supporting' | 'contradicting' | 'balanced' | 'none';
  strongestSupportingEvidenceIds: string[];
  strongestContradictingEvidenceIds: string[];
  excludedEvidenceIds: string[];
  exclusionReasons: Record<string, string>;
  qualityAdjustment: number;
  limitations: string[];
};

export type RecoverabilityAssessment = {
  status: RecoverabilityStatus;
  score?: number;
  reasons: string[];
  exclusions: string[];
  blockingConditions: string[];
  requiresHumanReview: boolean;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  recommendedTreatment:
    | 'evaluate-intervention'
    | 'evaluate-partial-intervention'
    | 'monitor-or-escalate'
    | 'request-more-data'
    | 'no-asset-maintenance'
    | 'not-assessed';
};

export type EnergyLossAssessment = {
  method: Exclude<EnergyLossMethod, 'auto'>;
  powerLossKw?: number;
  energyLossKwh?: number;
  dailyEnergyLossKwh?: number;
  uncertaintyRange?: UncertaintyRange;
  origin: DataOrigin;
  assumptions: string[];
  limitations: string[];
  calculationTrace: string[];
  status: 'calculated' | 'partially-calculated' | 'unavailable' | 'invalid';
};

export type RecoveryScenarioAssessment = {
  noIntervention: { energyLossKwh: number; origin: 'projected' };
  intervention: { energyLossKwh: number; recoveryRate: number; origin: 'projected' };
  recoveredEnergy: { valueKwh: number; origin: 'projected' };
  uncertaintyRange: UncertaintyRange;
  horizon: RecoveryHorizon;
  customHorizonDays?: number;
  assumptions: string[];
  limitations: string[];
  status: 'simulated' | 'blocked' | 'unavailable' | 'invalid';
};

export type ClimateImpactAssessment = {
  status: 'not-requested' | 'unavailable' | 'blocked' | 'estimated' | 'projected' | 'invalid';
  emissionFactorId?: string;
  recoveredEnergyKwh?: number;
  avoidedEmissionsKgCO2e?: number;
  uncertaintyRange?: UncertaintyRange;
  methodology?: string;
  blockingReasons: string[];
  assumptions: string[];
  limitations: string[];
  trace: string[];
};

export type PriorityAssessment = {
  score: number;
  band: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  components: {
    energyImpact: number;
    operationalSeverity: number;
    urgency: number;
    confidence: number;
    dataQuality: number;
    recoverability: number;
    persistenceRisk: number;
    safetyRisk: number;
    climateImpact: number;
    effortAdjustment: number;
  };
  reasons: string[];
  limitations: string[];
  requiresHumanReview: boolean;
};

export type RecommendedActionAssessment = {
  recommendedActions: RecommendedAction[];
  suppressedActions: RecommendedAction[];
  suppressionReasons: Record<string, string>;
  requiresApproval: boolean;
  safetyEscalation: boolean;
  humanReviewStatus: HumanReviewStatus;
};

export type LossAssessmentResult = {
  lossId: string;
  dataSufficiency: DataSufficiencyAssessment;
  evidenceAssessment: EvidenceAssessment;
  recoverability: RecoverabilityAssessment;
  hypotheses: DiagnosticHypothesis[];
  energyLoss: EnergyLossAssessment;
  scenarios: RecoveryScenarioAssessment[];
  climateImpact: ClimateImpactAssessment;
  recommendations: RecommendedActionAssessment;
  priority: PriorityAssessment;
};

export type ClimateRecoveryAssessmentResult = {
  assessmentId: string;
  caseId: string;
  engineVersion: string;
  evaluatedAt: string;
  inputReality: DatasetReality;
  validation: ValidationResult<ClimateRecoveryCase>;
  dataSufficiency: DataSufficiencyAssessment;
  evidenceAssessment: EvidenceAssessment;
  recoverability: RecoverabilityAssessment;
  hypotheses: DiagnosticHypothesis[];
  energyLoss: EnergyLossAssessment;
  scenarios: RecoveryScenarioAssessment[];
  climateImpact: ClimateImpactAssessment;
  recommendations: RecommendedActionAssessment;
  priority: PriorityAssessment;
  doubleCounting: DoubleCountingAssessment[];
  lossAssessments: LossAssessmentResult[];
  trace: AssessmentTraceStep[];
  warnings: string[];
  limitations: string[];
  requiresHumanReview: boolean;
  status: 'complete' | 'partial' | 'blocked' | 'invalid';
};

export type LossAssessmentContext = {
  loss: RecoverableLoss;
  caseData: ClimateRecoveryCase;
  evaluationTimestamp: string;
};
