export const INCIDENT_SCENARIO_SCHEMA_VERSION = '1.0' as const;
export const INCIDENT_ASSESSMENT_SCHEMA_VERSION = '1.0' as const;
export const INCIDENT_ENGINE_VERSION = 'build-week-deterministic-1.0.0' as const;

export type AssetKind = 'pv' | 'bess' | 'hybrid';
export type EvidenceQuality = 'valid' | 'suspect' | 'stale' | 'missing';
export type EvidenceKind =
  | 'telemetry'
  | 'alarm'
  | 'maintenance-note'
  | 'weather'
  | 'data-quality';

export type ObservationValue = string | number | boolean | null;

export type SyntheticEvidenceSource = {
  id: string;
  label: string;
  provenance: 'synthetic';
  access: 'read-only';
};

export type IncidentObservation = {
  id: string;
  kind: EvidenceKind;
  observedAt: string;
  assetId: string;
  signal: string;
  value: ObservationValue;
  unit: string;
  quality: EvidenceQuality;
  source: SyntheticEvidenceSource;
  statement: string;
};

export type IncidentScenario = {
  schemaVersion: typeof INCIDENT_SCENARIO_SCHEMA_VERSION;
  id: string;
  title: string;
  description: string;
  synthetic: true;
  analysisAsOf: string;
  asset: {
    id: string;
    label: string;
    kind: AssetKind;
    capacityMw: number;
    bessCapacityMwh: number | null;
  };
  window: {
    start: string;
    end: string;
  };
  observations: IncidentObservation[];
};

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type OperationalRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type HumanReviewState =
  | 'pending-review'
  | 'approved'
  | 'changes-requested'
  | 'rejected';

export type PriorityIncident = {
  id: string;
  title: string;
  severity: Severity;
  score: number;
  rationale: string;
  evidenceIds: string[];
};

export type ConfirmedFact = {
  id: string;
  classification: 'confirmed-fact';
  statement: string;
  evidenceIds: string[];
};

export type TechnicalHypothesis = {
  id: string;
  classification: 'technical-hypothesis';
  statement: string;
  rootCauseStatus: 'unconfirmed';
  supportingEvidenceIds: string[];
  conflictingEvidenceIds: string[];
  uncertainty: string;
};

export type ConflictingEvidence = {
  id: string;
  statement: string;
  evidenceIds: string[];
  implication: string;
};

export type MissingInformation = {
  id: string;
  question: string;
  whyItMatters: string;
};

export type FieldVerificationStep = {
  id: string;
  order: number;
  action: string;
  rationale: string;
  safetyBoundary: string;
  relatedEvidenceIds: string[];
};

export type AdvisoryOmAction = {
  id: string;
  priority: 'now' | 'next-shift' | 'planned';
  action: string;
  rationale: string;
  requiresHumanApproval: true;
};

export type EnergyRisk = {
  quantification: 'bounded' | 'not-quantifiable';
  lowMwh: number | null;
  likelyMwh: number | null;
  highMwh: number | null;
  affectedPowerMw: number | null;
  basis: string;
  assumptions: string[];
};

export type IncidentRisk = {
  operationalLevel: OperationalRiskLevel;
  operationalSummary: string;
  energy: EnergyRisk;
};

export type IncidentConfidence = {
  score: number;
  level: ConfidenceLevel;
  evidenceQualityScore: number;
  drivers: string[];
  uncertainty: string;
};

export type HumanReview = {
  state: HumanReviewState;
  note: string;
  authority: 'human-only';
};

export type IncidentAssessment = {
  schemaVersion: typeof INCIDENT_ASSESSMENT_SCHEMA_VERSION;
  assessmentId: string;
  scenarioId: string;
  analyzedAt: string;
  provider: {
    id: 'deterministic-local-evidence-engine';
    label: 'Deterministic local evidence engine';
    engineVersion: typeof INCIDENT_ENGINE_VERSION;
  };
  priorityIncident: PriorityIncident;
  confirmedFacts: ConfirmedFact[];
  hypotheses: TechnicalHypothesis[];
  conflictingEvidence: ConflictingEvidence[];
  missingInformation: MissingInformation[];
  verificationSteps: FieldVerificationStep[];
  advisoryActions: AdvisoryOmAction[];
  risk: IncidentRisk;
  confidence: IncidentConfidence;
  executiveSummary: string;
  review: HumanReview;
  trace: {
    ruleIds: string[];
    evidenceIds: string[];
  };
};

export type ValidationIssue = {
  path: string;
  code: string;
  message: string;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: ValidationIssue[] };

export type IncidentAnalysisRequest = {
  scenario: IncidentScenario;
};

export interface IncidentAnalysisProvider {
  readonly id: string;
  readonly label: string;
  readonly runtime: 'deterministic-local';
  analyze(request: IncidentAnalysisRequest): Promise<IncidentAssessment>;
}

export type IncidentCandidate = {
  id: string;
  title: string;
  severity: Severity;
  score: number;
  rationale: string;
  evidenceIds: string[];
};
