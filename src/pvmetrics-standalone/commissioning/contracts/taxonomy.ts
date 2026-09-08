export type AssessmentStatus = 'PASS' | 'WARNING' | 'FAIL' | 'INCONCLUSIVE';

export type HumanAcceptanceStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ACCEPTED_WITH_COMMENTS'
  | 'RETEST_REQUIRED'
  | 'REJECTED';

export type DataQuality = 'GOOD' | 'DEGRADED' | 'POOR' | 'INVALID';

export type SampleQuality = 'GOOD' | 'SUSPECT' | 'MISSING' | 'INVALID';

export type FindingSeverity = 'INFO' | 'WARNING' | 'MAJOR' | 'CRITICAL';

export type PunchStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'READY_FOR_RETEST'
  | 'CLOSED';

export type ExecutionType = 'INITIAL' | 'RETEST' | 'VALIDATION' | 'PARTIAL';

export type ExecutionStatus =
  | 'DRAFT'
  | 'READY'
  | 'BLOCKED'
  | 'IN_PROGRESS'
  | 'DATA_REVIEW'
  | 'HUMAN_REVIEW'
  | 'PASS'
  | 'WARNING'
  | 'FAIL'
  | 'INCONCLUSIVE'
  | 'RETEST_REQUIRED'
  | 'CLOSED';

export type CriterionStatus = 'CONFIRMED' | 'PENDING_CONFIRMATION' | 'MISSING' | 'SUPERSEDED';

export type CriterionSourceType =
  | 'OEM'
  | 'CLIENT'
  | 'CONTRACT'
  | 'PROJECT_SPEC'
  | 'GRID_CODE'
  | 'ENGINEERING'
  | 'LAB'
  | 'OTHER';

export type CriterionOperator =
  | '<'
  | '<='
  | '>'
  | '>='
  | '=='
  | 'BETWEEN'
  | 'OUTSIDE'
  | 'ABS<=';

export type CriterionEvaluationResult = 'PASS' | 'WARNING' | 'FAIL' | 'NOT_EVALUATED';

export type GateStatus = 'NOT_READY' | 'BLOCKED' | 'READY' | 'READY_WITH_COMMENTS' | 'APPROVED';

export type ScopeStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SUPERSEDED' | 'CLOSED';

export type ScopeAssetStatus = 'INCLUDED' | 'PARTIAL' | 'EXCLUDED' | 'THIRD_PARTY' | 'PENDING_CONFIRMATION';

export type Applicability = 'MANDATORY' | 'CONDITIONAL' | 'OPTIONAL' | 'NOT_APPLICABLE';

export type CampaignType =
  | 'PRE_COMMISSIONING'
  | 'FIRST_ENERGIZATION'
  | 'BMS_FUNCTIONAL'
  | 'PCS_FUNCTIONAL'
  | 'CHARGE_DISCHARGE'
  | 'PERFORMANCE'
  | 'GRID_INTEGRATION'
  | 'RELIABILITY_RUN';

export type PhaseType =
  | 'PRE_TEST'
  | 'ENERGIZATION'
  | 'CHARGE_COMMAND'
  | 'CHARGING'
  | 'HOLD'
  | 'DISCHARGE_COMMAND'
  | 'DISCHARGING'
  | 'POST_TEST';

export type PhaseDetectionSource = 'MANUAL' | 'RULE_ENGINE' | 'IMPORTED' | 'AI_SUGGESTED';

export type DatasetSourceType =
  | 'MANUAL'
  | 'FILE_IMPORT'
  | 'EXISTING_PVMETRICS_DATA_READ'
  | 'SCADA_READ_ONLY'
  | 'BMS_EXPORT'
  | 'PCS_EXPORT'
  | 'METER_EXPORT';

export type ImportResult = 'ACCEPTED' | 'ACCEPTED_WITH_WARNINGS' | 'REJECTED';

export type AnomalyStatus = 'NEW' | 'ACTIVE' | 'CLEARED' | 'ACK' | 'UNDER_REVIEW' | 'DISMISSED' | 'CONVERTED_TO_FINDING';

export type AnomalyImpact = 'INFORMATIONAL' | 'ASSESSMENT_RELEVANT' | 'GATE_BLOCKING';

export type FindingStatus = 'OPEN' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'READY_FOR_RETEST' | 'CLOSED' | 'DISMISSED';

export type RootCauseState = 'UNKNOWN' | 'SUSPECTED' | 'CONFIRMED';

export type RetestRequirement = 'YES' | 'NO' | 'CONDITIONAL';

export type EvidenceType =
  | 'PHOTO'
  | 'SCREENSHOT'
  | 'CSV'
  | 'XLSX'
  | 'LOG'
  | 'GRAPH'
  | 'MEASUREMENT'
  | 'PDF'
  | 'DOCUMENT'
  | 'SCADA'
  | 'BMS'
  | 'PCS'
  | 'COMMENT';

export type AssetType =
  | 'SITE'
  | 'MV_CIRCUIT'
  | 'POWER_BLOCK'
  | 'MVPS'
  | 'PCS'
  | 'TRANSFORMER'
  | 'MV_SWITCHGEAR'
  | 'SOLBANK'
  | 'BMS'
  | 'RACK'
  | 'TMS'
  | 'FIRE_SYSTEM'
  | 'GAS_SYSTEM'
  | 'UPS'
  | 'METER'
  | 'OTHER';

export type CommissioningLifecycleStatus =
  | 'NOT_STARTED'
  | 'IN_PRE_COMMISSIONING'
  | 'READY_FOR_ENERGIZATION'
  | 'ENERGIZATION_IN_PROGRESS'
  | 'FUNCTIONAL_TESTING'
  | 'PERFORMANCE_TESTING'
  | 'PUNCH_LIST'
  | 'RETEST'
  | 'READY_FOR_ACCEPTANCE'
  | 'ACCEPTED'
  | 'HANDED_OVER';

export type RequirementStatus = 'DRAFT' | 'CONFIRMED' | 'SUPERSEDED' | 'NOT_APPLICABLE';

export type HandoverStatus = 'DRAFT' | 'BLOCKED' | 'READY' | 'APPROVED' | 'RECEIVED_BY_O_AND_M';
