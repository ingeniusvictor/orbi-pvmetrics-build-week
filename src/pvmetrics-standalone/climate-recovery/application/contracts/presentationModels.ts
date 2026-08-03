import type {
  ConfidenceLevel,
  DataOrigin,
  DatasetReality,
  HumanReviewStatus,
  RecoverabilityStatus,
  RecoveryHorizon,
} from '../../types/taxonomy';
import type { UncertaintyRange } from '../../types/common';

export type PresentationAvailability =
  | 'available'
  | 'unavailable'
  | 'blocked'
  | 'not-applicable'
  | 'pending-review';

export type PresentationStatusToken =
  | 'neutral'
  | 'informative'
  | 'positive'
  | 'caution'
  | 'warning'
  | 'critical'
  | 'blocked'
  | 'unavailable';

export type PresentationValue<T> = {
  value?: T;
  formattedValue: string;
  unit?: string;
  availability: PresentationAvailability;
  origin: DataOrigin;
  datasetReality: DatasetReality;
  confidenceLevel?: ConfidenceLevel;
  isEstimate: boolean;
  isProjection: boolean;
  isSynthetic: boolean;
  disclosure?: string;
  limitations: string[];
  tooltip?: string;
};

export type RecoveryOpportunityPresentation = {
  recoverability: RecoverabilityStatus;
  estimatedEnergy: PresentationValue<number>;
  horizon?: RecoveryHorizon;
  recoveryRateAssumption?: number;
  uncertainty?: UncertaintyRange;
  status: PresentationStatusToken;
  methodology: string;
  assumptions: string[];
  limitations: string[];
  scenarioId?: string;
};

export type ClimateImpactPresentation = {
  availability: PresentationAvailability;
  estimatedAvoidedEmissions: PresentationValue<number>;
  emissionFactor: PresentationValue<number>;
  factorRegion?: string;
  factorYear?: number;
  methodology: string;
  status: PresentationStatusToken;
  isCounterfactualEstimate: true;
  isVerified: false;
  syntheticDisclosure: string;
  assumptions: string[];
  limitations: string[];
  blockingReasons: string[];
};

export type ExecutiveCaseSummary = {
  caseId: string;
  plantId: string;
  assetId: string;
  caseTitle: string;
  shortDescription: string;
  currentStatus: string;
  category: string;
  recoverability: RecoverabilityStatus;
  priorityBand: string;
  priorityScore: PresentationValue<number>;
  confidence: PresentationValue<number>;
  dataSufficiency: string;
  recoveryOpportunity: RecoveryOpportunityPresentation;
  climateImpact: ClimateImpactPresentation;
  recommendedNextStep: string;
  humanReviewRequired: boolean;
  syntheticDisclosure: string;
  headline: string;
  executiveNarrative: string;
  keyWarnings: string[];
  lastEvaluatedAt: PresentationValue<string>;
};

export type RecoveryKpi = {
  id:
    | 'estimatedEnergyLoss'
    | 'estimatedRecoverableEnergy'
    | 'estimatedAvoidedEmissions'
    | 'priorityScore'
    | 'confidence'
    | 'dataSufficiency'
    | 'recommendedActionCount'
    | 'humanReviewStatus';
  labelKey: string;
  shortLabelKey: string;
  value: PresentationValue<number | string | boolean>;
  category:
    | 'energy'
    | 'climate'
    | 'operational'
    | 'confidence'
    | 'data-quality'
    | 'priority'
    | 'review';
  status: PresentationStatusToken;
  prominence: 'primary' | 'secondary' | 'contextual';
  explanation: string;
  sourceReferences: string[];
  limitations: string[];
};

export type RecoveryScorePresentation = {
  score: number;
  band: string;
  labelKey: string;
  explanation: string;
  components: Record<string, number>;
  confidence: ConfidenceLevel;
  isOperational: false;
  isSynthetic: true;
  limitations: string[];
};

export type RecommendedActionPresentation = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  actionType: string;
  urgency: string;
  rationale: string;
  expectedOutcome: string;
  requiresApproval: boolean;
  safetyNotes: string[];
  uncertaintyNotes: string[];
  status: string;
  displayOrder: number;
  isBinding: false;
  humanReviewStatus: HumanReviewStatus;
};

export type ScenarioPresentation = {
  id: string;
  nameKey: string;
  horizon: RecoveryHorizon;
  noIntervention: PresentationValue<number>;
  intervention: PresentationValue<number>;
  recoveredEnergy: PresentationValue<number>;
  climateImpact?: PresentationValue<number>;
  assumptions: string[];
  limitations: string[];
  status: string;
  isSimulated: true;
  isProjection: true;
};

export type TimelineEvent = {
  id: string;
  caseId: string;
  timestamp: string;
  eventType:
    | 'detection'
    | 'evidence-collected'
    | 'assessment-generated'
    | 'hypothesis-generated'
    | 'recommendation-generated'
    | 'review-requested'
    | 'scenario-generated'
    | 'climate-estimate-generated'
    | 'warning-raised'
    | 'case-status';
  titleKey: string;
  descriptionKey: string;
  severity: PresentationStatusToken;
  relatedEntityIds: string[];
  origin: DataOrigin;
  isSynthetic: boolean;
  disclosure?: string;
};

export type ExplainabilitySection = {
  summary: string;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  missingEvidence: string[];
  assumptions: string[];
  limitations: string[];
  traceHighlights: Array<{ ruleId: string; summary: string; version: string }>;
  ruleVersions: string[];
  confidenceExplanation: string;
  humanReviewExplanation: string;
};

export type PresentationEvidence = {
  id: string;
  title: string;
  description: string;
  direction: string;
  qualityStatus: string;
  sourceReference: string;
};

export type PresentationHypothesis = {
  id: string;
  title: string;
  summary: string;
  status: string;
  confidence: ConfidenceLevel;
  isDiagnosis: false;
  requiresHumanReview: boolean;
};

export type AvailableOperation =
  | 'request-human-review'
  | 'acknowledge-warning'
  | 'inspect-evidence'
  | 'inspect-methodology'
  | 'compare-scenarios'
  | 'request-more-data'
  | 'export-summary'
  | 'none';

export type CaseDetailPresentation = {
  summary: ExecutiveCaseSummary;
  kpis: RecoveryKpi[];
  recoveryScore: RecoveryScorePresentation;
  lossOverview: Array<{
    lossId: string;
    category: string;
    recoverability: RecoverabilityStatus;
    energyLoss: PresentationValue<number>;
  }>;
  hypotheses: PresentationHypothesis[];
  evidence: PresentationEvidence[];
  actions: RecommendedActionPresentation[];
  scenarios: ScenarioPresentation[];
  climateImpact: ClimateImpactPresentation;
  timeline: TimelineEvent[];
  explainability: ExplainabilitySection;
  warnings: string[];
  limitations: string[];
  disclosures: string[];
  availableOperations: AvailableOperation[];
  metadata: {
    assessmentId: string;
    engineVersion: string;
    presentationVersion: string;
    evaluatedAt: string;
    datasetReality: DatasetReality;
  };
};

export type CaseCatalogItem = {
  caseId: string;
  title: string;
  plantName: string;
  assetName: string;
  category: string;
  status: string;
  priority: PresentationValue<number>;
  confidence: PresentationValue<number>;
  recoverability: RecoverabilityStatus;
  estimatedRecoverableEnergy: PresentationValue<number>;
  estimatedClimateImpact: PresentationValue<number>;
  recommendedNextStep: string;
  humanReviewRequired: boolean;
  isSynthetic: true;
  evaluatedAt: string;
};

export type PortfolioSummaryPresentation = {
  portfolioId: string;
  portfolioName: string;
  caseCount: number;
  recoverableCaseCount: number;
  partiallyRecoverableCaseCount: number;
  nonRecoverableCaseCount: number;
  insufficientDataCaseCount: number;
  pendingHumanReviewCount: number;
  possibleDoubleCountingCount: number;
  estimatedRecoverableEnergy: PresentationValue<number>;
  estimatedClimateImpact: PresentationValue<number>;
  priorityDistribution: Record<string, number>;
  dataQualityDistribution: Record<string, number>;
  disclosures: string[];
  warnings: string[];
  aggregationStatus: 'complete' | 'complete-with-exclusions' | 'warning' | 'blocked';
  excludedCaseIds: string[];
  includedCaseIds: string[];
  overlapPolicy: 'exclude-overlap' | 'include-with-warning' | 'block-aggregation';
};
