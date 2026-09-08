import type {
  AnomalyImpact,
  AnomalyStatus,
  Applicability,
  AssessmentStatus,
  AssetType,
  CampaignType,
  CommissioningLifecycleStatus,
  CriterionEvaluationResult,
  CriterionOperator,
  CriterionSourceType,
  CriterionStatus,
  DataQuality,
  DatasetSourceType,
  EvidenceType,
  ExecutionStatus,
  ExecutionType,
  FindingSeverity,
  FindingStatus,
  GateStatus,
  HandoverStatus,
  HumanAcceptanceStatus,
  ImportResult,
  PhaseDetectionSource,
  PhaseType,
  PunchStatus,
  RequirementStatus,
  RetestRequirement,
  RootCauseState,
  SampleQuality,
  ScopeAssetStatus,
  ScopeStatus,
} from './taxonomy';

export type ISODateTime = string;
export type EntityId = string;

export type AuditFields = {
  createdAt: ISODateTime;
  createdBy: string;
  updatedAt: ISODateTime;
  updatedBy: string;
};

export type CommissioningProject = AuditFields & {
  projectId: EntityId;
  name: string;
  client?: string;
  owner?: string;
  epc?: string;
  oemBattery?: string;
  oemPcs?: string;
  country?: string;
  region?: string;
  site?: string;
  ratedPowerMw?: number;
  ratedEnergyMwh?: number;
  lifecycleStatus: CommissioningLifecycleStatus;
};

export type CommissioningScope = AuditFields & {
  scopeId: EntityId;
  projectId: EntityId;
  revision: string;
  name: string;
  description: string;
  status: ScopeStatus;
  approvedBy?: string;
  approvedAt?: ISODateTime;
  effectiveAt?: ISODateTime;
  sourceReference?: string;
};

export type CommissioningAsset = AuditFields & {
  assetId: EntityId;
  projectId: EntityId;
  parentAssetId?: EntityId;
  assetType: AssetType;
  name: string;
  externalReference?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type ScopeAsset = {
  scopeAssetId: EntityId;
  scopeId: EntityId;
  assetId: EntityId;
  status: ScopeAssetStatus;
  responsibility?: string;
  notes?: string[];
};

export type CommissioningCampaign = AuditFields & {
  campaignId: EntityId;
  projectId: EntityId;
  scopeId: EntityId;
  name: string;
  type: CampaignType;
  description?: string;
  plannedStart?: ISODateTime;
  plannedEnd?: ISODateTime;
  actualStart?: ISODateTime;
  actualEnd?: ISODateTime;
  status: 'PLANNED' | 'READY' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
};

export type TestTemplate = AuditFields & {
  testTemplateId: EntityId;
  code: string;
  name: string;
  category: string;
  assetType?: AssetType;
  description: string;
  procedureReference?: string;
  oemReference?: string;
  requiredSignalKeys: string[];
  optionalSignalKeys: string[];
  requiredEvidenceTypes: EvidenceType[];
  applicability: Applicability;
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED';
};

export type TestInstance = AuditFields & {
  testInstanceId: EntityId;
  testTemplateId: EntityId;
  campaignId: EntityId;
  scopeId: EntityId;
  assetId: EntityId;
  applicability: Applicability;
  plannedAt?: ISODateTime;
  assignedTo?: string;
  witness?: string;
  status: 'PLANNED' | 'READY' | 'BLOCKED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';
};

export type TestExecution = AuditFields & {
  executionId: EntityId;
  testInstanceId: EntityId;
  executionNumber: number;
  executionType: ExecutionType;
  parentExecutionId?: EntityId;
  retestReason?: string;
  correctiveActionId?: EntityId;
  startedAt?: ISODateTime;
  endedAt?: ISODateTime;
  executedBy?: string;
  witnessedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  dataQuality: DataQuality;
  orbiAssessment: AssessmentStatus;
  humanAcceptance: HumanAcceptanceStatus;
  status: ExecutionStatus;
  notes: string[];
};

export type TestPhase = {
  testPhaseId: EntityId;
  executionId: EntityId;
  phaseType: PhaseType;
  startedAt: ISODateTime;
  endedAt?: ISODateTime;
  detectionSource: PhaseDetectionSource;
  confidence?: number;
  evidenceIds: EntityId[];
};

export type Criterion = AuditFields & {
  criterionId: EntityId;
  testTemplateId: EntityId;
  name: string;
  variable: string;
  operator: CriterionOperator;
  minValue?: number;
  maxValue?: number;
  expectedValue?: number | string | boolean;
  unit?: string;
  sourceType: CriterionSourceType;
  sourceReference?: string;
  sourceRevision?: string;
  mandatory: boolean;
  status: CriterionStatus;
  severityOnFail: FindingSeverity;
};

export type CriterionSnapshot = {
  criterionSnapshotId: EntityId;
  criterionId: EntityId;
  executionId: EntityId;
  snapshotAt: ISODateTime;
  name: string;
  variable: string;
  operator: CriterionOperator;
  minValue?: number;
  maxValue?: number;
  expectedValue?: number | string | boolean;
  unit?: string;
  sourceType: CriterionSourceType;
  sourceReference?: string;
  sourceRevision?: string;
  mandatory: boolean;
  status: CriterionStatus;
  severityOnFail: FindingSeverity;
};

export type CriterionEvaluation = {
  criterionEvaluationId: EntityId;
  executionId: EntityId;
  criterionSnapshotId: EntityId;
  measuredValue?: number | string | boolean | null;
  expectedDescription?: string;
  result: CriterionEvaluationResult;
  calculationId?: EntityId;
  evidenceIds: EntityId[];
  evaluatedAt: ISODateTime;
  reason?: string;
};

export type SignalDefinition = AuditFields & {
  signalKey: string;
  name: string;
  description?: string;
  unit?: string;
  valueType: 'NUMBER' | 'STRING' | 'BOOLEAN';
  assetTypes: AssetType[];
};

export type SignalMapping = AuditFields & {
  signalMappingId: EntityId;
  sourceSystem: string;
  sourceSignal: string;
  canonicalSignalKey: string;
  sourceUnit?: string;
  canonicalUnit?: string;
  scale?: number;
  offset?: number;
  signMultiplier?: 1 | -1;
  status: 'CONFIRMED' | 'PENDING_CONFIRMATION' | 'UNMAPPED' | 'SUPERSEDED';
};

export type TelemetrySample = {
  timestamp: ISODateTime;
  assetId: EntityId;
  signalKey: string;
  value: number | string | boolean | null;
  unit?: string;
  sourceSystem: string;
  quality: SampleQuality;
  rawReference?: string;
};

export type CommissioningDataset = AuditFields & {
  datasetId: EntityId;
  projectId: EntityId;
  scopeId: EntityId;
  campaignId?: EntityId;
  executionId?: EntityId;
  sourceType: DatasetSourceType;
  sourceName: string;
  rawEvidenceId?: EntityId;
  importResult: ImportResult;
  dataQuality: DataQuality;
  coveragePercent?: number;
  expectedSamples?: number;
  receivedSamples?: number;
  missingSamples?: number;
  duplicateSamples?: number;
  invalidSamples?: number;
  frozenSignalCount?: number;
  warnings: string[];
  errors: string[];
};

export type CommissioningEvent = {
  eventId: EntityId;
  projectId: EntityId;
  assetId?: EntityId;
  executionId?: EntityId;
  occurredAt: ISODateTime;
  eventType: 'ALARM' | 'WARNING' | 'TRIP' | 'COMMAND' | 'STATE' | 'OPERATOR' | 'COMM_LOSS' | 'PROTECTION';
  severity: FindingSeverity;
  code?: string;
  message: string;
  sourceSystem?: string;
  evidenceIds: EntityId[];
};

export type Evidence = AuditFields & {
  evidenceId: EntityId;
  projectId: EntityId;
  assetId?: EntityId;
  executionId?: EntityId;
  type: EvidenceType;
  name: string;
  source: string;
  fileReference?: string;
  sha256?: string;
  capturedAt?: ISODateTime;
  description?: string;
};

export type Calculation = {
  calculationId: EntityId;
  executionId: EntityId;
  metricKey: string;
  algorithmVersion: string;
  inputSignalKeys: string[];
  windowStart?: ISODateTime;
  windowEnd?: ISODateTime;
  resultValue?: number | string | boolean | null;
  unit?: string;
  calculatedAt: ISODateTime;
  notes: string[];
};

export type Anomaly = AuditFields & {
  anomalyId: EntityId;
  executionId?: EntityId;
  campaignId?: EntityId;
  assetId: EntityId;
  ruleId: string;
  ruleVersion: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  impact: AnomalyImpact;
  status: AnomalyStatus;
  detectedAt: ISODateTime;
  clearedAt?: ISODateTime;
  evidenceIds: EntityId[];
  criterionSnapshotIds: EntityId[];
  calculationIds: EntityId[];
  notes: string[];
};

export type Finding = AuditFields & {
  findingId: EntityId;
  projectId: EntityId;
  assetId: EntityId;
  executionId?: EntityId;
  sourceAnomalyIds: EntityId[];
  title: string;
  description: string;
  category: string;
  severity: FindingSeverity;
  status: FindingStatus;
  rootCauseState: RootCauseState;
  rootCause?: string;
  evidenceIds: EntityId[];
  requiresPunch: boolean;
  reviewedBy?: string;
  reviewedAt?: ISODateTime;
};

export type CorrectiveAction = AuditFields & {
  correctiveActionId: EntityId;
  findingId: EntityId;
  punchItemId?: EntityId;
  description: string;
  responsibleParty?: string;
  assignedTo?: string;
  targetDate?: ISODateTime;
  completedAt?: ISODateTime;
  closureEvidenceIds: EntityId[];
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
};

export type PunchItem = AuditFields & {
  punchItemId: EntityId;
  findingId: EntityId;
  assetId: EntityId;
  severity: FindingSeverity;
  description: string;
  requiredAction: string;
  responsibleParty?: string;
  assignedTo?: string;
  targetDate?: ISODateTime;
  status: PunchStatus;
  retestRequirement: RetestRequirement;
  retestExecutionIds: EntityId[];
  closureEvidenceIds: EntityId[];
  closedAt?: ISODateTime;
  closedBy?: string;
};

export type HumanAcceptanceDecision = AuditFields & {
  acceptanceDecisionId: EntityId;
  executionId: EntityId;
  decision: HumanAcceptanceStatus;
  reason: string;
  decidedBy: string;
  decidedAt: ISODateTime;
  previousDecision?: HumanAcceptanceStatus;
};

export type CommissioningGate = AuditFields & {
  gateId: EntityId;
  projectId: EntityId;
  scopeId: EntityId;
  campaignId?: EntityId;
  name: string;
  status: GateStatus;
  blockerIds: EntityId[];
  evidenceIds: EntityId[];
  reviewedBy?: string;
  reviewedAt?: ISODateTime;
};

export type Requirement = AuditFields & {
  requirementId: EntityId;
  projectId: EntityId;
  code: string;
  title: string;
  description: string;
  sourceType: CriterionSourceType;
  sourceReference?: string;
  sourceRevision?: string;
  status: RequirementStatus;
  testTemplateIds: EntityId[];
};

export type BaselineMetric = {
  metricKey: string;
  value: number | string | boolean | null;
  unit?: string;
  sourceExecutionId: EntityId;
  calculationId?: EntityId;
  acceptedAt: ISODateTime;
};

export type CommissioningBaseline = AuditFields & {
  baselineId: EntityId;
  projectId: EntityId;
  scopeId: EntityId;
  revision: string;
  assetId: EntityId;
  acceptedAt: ISODateTime;
  acceptedBy: string;
  metrics: BaselineMetric[];
  firmwareVersions: Record<string, string>;
  configurationReferences: string[];
  knownDeviationFindingIds: EntityId[];
  status: 'DRAFT' | 'AVAILABLE' | 'SUPERSEDED';
};

export type HandoverPackage = AuditFields & {
  handoverPackageId: EntityId;
  projectId: EntityId;
  scopeId: EntityId;
  baselineId?: EntityId;
  status: HandoverStatus;
  requiredDocumentReferences: string[];
  evidenceIds: EntityId[];
  openFindingIds: EntityId[];
  openPunchItemIds: EntityId[];
  humanAcceptanceDecisionIds: EntityId[];
  preparedBy?: string;
  preparedAt?: ISODateTime;
  approvedBy?: string;
  approvedAt?: ISODateTime;
  receivedByOandM?: string;
  receivedAt?: ISODateTime;
};
