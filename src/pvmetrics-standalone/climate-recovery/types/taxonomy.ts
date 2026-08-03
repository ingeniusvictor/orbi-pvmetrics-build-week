export type DataOrigin =
  | 'measured'
  | 'derived'
  | 'estimated'
  | 'simulated'
  | 'projected'
  | 'manually-entered'
  | 'externally-supplied';

export type DatasetReality =
  | 'synthetic'
  | 'sanitized'
  | 'anonymized'
  | 'operational'
  | 'unknown';

export type DataQualityStatus =
  | 'valid'
  | 'degraded'
  | 'incomplete'
  | 'stale'
  | 'conflicting'
  | 'unavailable'
  | 'unknown';

export type ConfidenceLevel =
  | 'very-low'
  | 'low'
  | 'medium'
  | 'high'
  | 'very-high';

export type HumanReviewStatus =
  | 'not-requested'
  | 'pending'
  | 'reviewed'
  | 'accepted'
  | 'rejected'
  | 'needs-more-data'
  | 'superseded';

export type RecoverabilityStatus =
  | 'recoverable'
  | 'partially-recoverable'
  | 'non-recoverable'
  | 'indeterminate'
  | 'not-assessed';

export type VerificationStatus =
  | 'not-started'
  | 'collecting-post-action-data'
  | 'insufficient-data'
  | 'estimated-recovery'
  | 'provisionally-verified'
  | 'verified'
  | 'not-recovered'
  | 'inconclusive';

export type RecoverableLossCategory =
  | 'availability'
  | 'underperformance'
  | 'soiling'
  | 'thermal-derating'
  | 'inverter'
  | 'mppt-or-string'
  | 'communications'
  | 'sensor-quality'
  | 'grid-curtailment'
  | 'clipping'
  | 'bess-operation'
  | 'operational-configuration'
  | 'maintenance-delay'
  | 'unknown';

export type OperationalSeverity =
  | 'informational'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type RecoveryHorizon =
  | 'immediate'
  | 'daily'
  | 'seven-days'
  | 'thirty-days'
  | 'ninety-days'
  | 'custom';

export type HypothesisStatus =
  | 'generated'
  | 'under-review'
  | 'supported'
  | 'contradicted'
  | 'rejected'
  | 'confirmed-by-human'
  | 'superseded';

export type HypothesisGenerator =
  | 'deterministic-engine'
  | 'rule-engine'
  | 'statistical-model'
  | 'external-ai'
  | 'human'
  | 'hybrid';

export type EvidenceDirection =
  | 'supports'
  | 'contradicts'
  | 'neutral'
  | 'unavailable';

export type RecommendedActionType =
  | 'remote-review'
  | 'data-validation'
  | 'alarm-review'
  | 'operational-check'
  | 'field-inspection'
  | 'cleaning-assessment'
  | 'maintenance-intervention'
  | 'monitoring'
  | 'escalation'
  | 'no-action'
  | 'request-more-data';

export type ValidationSeverity = 'info' | 'warning' | 'error' | 'critical';
