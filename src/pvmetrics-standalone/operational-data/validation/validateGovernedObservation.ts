import type {
  GovernedObservation,
  GovernedOperationalCatalog,
  OperationalQualityStatus,
  OperationalValueType,
} from '../contracts';
import { OPERATIONAL_QUALITY_STATUSES } from '../contracts';

export type GovernedObservationIssueCode =
  | 'MISSING_ASSET_ID'
  | 'MISSING_SOURCE_ID'
  | 'MISSING_SIGNAL_ID'
  | 'MISSING_SIGNAL_KEY'
  | 'INVALID_TIMESTAMP'
  | 'ASSET_NOT_REFERENCEABLE'
  | 'SOURCE_NOT_REFERENCEABLE'
  | 'SIGNAL_NOT_REFERENCEABLE'
  | 'SIGNAL_KEY_MISMATCH'
  | 'UNIT_REQUIRED'
  | 'UNIT_MISMATCH'
  | 'VALUE_TYPE_MISMATCH'
  | 'INVALID_QUALITY'
  | 'EVIDENCE_NOT_REFERENCEABLE'
  | 'EVIDENCE_SOURCE_MISMATCH'
  | 'PROVENANCE_MISMATCH'
  | 'SYNTHETIC_SOURCE_CLAIMED_VERIFIED'
  | 'OBSERVATION_VERIFICATION_EXCEEDS_SOURCE';

export type GovernedObservationIssue = {
  code: GovernedObservationIssueCode;
  message: string;
};

export type GovernedObservationValidationResult = {
  status: 'PASS' | 'BLOCKED';
  issues: GovernedObservationIssue[];
};

const qualitySet = new Set<string>(OPERATIONAL_QUALITY_STATUSES);

const verificationRank = {
  UNVERIFIED: 0,
  SOURCE_DECLARED: 1,
  SOURCE_VERIFIED: 2,
} as const;

const valueMatchesType = (value: GovernedObservation['value'], type: OperationalValueType): boolean => {
  if (type === 'NUMBER') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'STRING') return typeof value === 'string';
  return typeof value === 'boolean';
};

export const validateGovernedObservation = (
  observation: GovernedObservation,
  catalog: GovernedOperationalCatalog,
): GovernedObservationValidationResult => {
  const issues: GovernedObservationIssue[] = [];
  const block = (code: GovernedObservationIssueCode, message: string) => issues.push({ code, message });

  if (!observation.assetId.trim()) block('MISSING_ASSET_ID', 'Observation assetId is required.');
  if (!observation.sourceId.trim()) block('MISSING_SOURCE_ID', 'Observation sourceId is required.');
  if (!observation.signalId.trim()) block('MISSING_SIGNAL_ID', 'Observation signalId is required.');
  if (!observation.signalKey.trim()) block('MISSING_SIGNAL_KEY', 'Observation signalKey is required.');
  if (!observation.timestamp.trim() || !Number.isFinite(Date.parse(observation.timestamp))) {
    block('INVALID_TIMESTAMP', 'Observation timestamp must be a valid date-time string.');
  }
  if (!qualitySet.has(observation.quality as OperationalQualityStatus)) {
    block('INVALID_QUALITY', 'Observation quality is not part of the governed quality taxonomy.');
  }

  const asset = catalog.assets.find((item) => item.assetId === observation.assetId);
  if (!asset?.referenceable) block('ASSET_NOT_REFERENCEABLE', 'Observation asset is missing or not referenceable.');

  const source = catalog.sources.find((item) => item.sourceId === observation.sourceId);
  if (!source?.referenceable) block('SOURCE_NOT_REFERENCEABLE', 'Observation source is missing or not referenceable.');

  const signal = catalog.signals.find((item) => item.signalId === observation.signalId);
  if (!signal?.referenceable) {
    block('SIGNAL_NOT_REFERENCEABLE', 'Observation signal is missing or not referenceable.');
  } else {
    if (signal.signalKey !== observation.signalKey) block('SIGNAL_KEY_MISMATCH', 'Observation signalKey does not match its signal definition.');
    if (signal.declaredUnit && !observation.unit) block('UNIT_REQUIRED', 'Observation unit is required by its signal definition.');
    if (signal.declaredUnit && observation.unit && signal.declaredUnit !== observation.unit) {
      block('UNIT_MISMATCH', 'Observation unit does not match the declared signal unit.');
    }
    if (!valueMatchesType(observation.value, signal.valueType)) {
      block('VALUE_TYPE_MISMATCH', 'Observation value is incompatible with the signal value type.');
    }
  }

  for (const evidenceId of observation.evidenceIds) {
    const evidence = catalog.evidence.find((item) => item.evidenceId === evidenceId);
    if (!evidence?.referenceable) {
      block('EVIDENCE_NOT_REFERENCEABLE', `Evidence ${evidenceId} is missing or not referenceable.`);
    } else if (evidence.sourceId && evidence.sourceId !== observation.sourceId) {
      block('EVIDENCE_SOURCE_MISMATCH', `Evidence ${evidenceId} references a different source.`);
    }
  }

  if (source) {
    if (source.provenance !== observation.provenance) {
      block('PROVENANCE_MISMATCH', 'Observation provenance does not match its source provenance.');
    }
    if (source.provenance === 'SYNTHETIC' && source.verificationState === 'SOURCE_VERIFIED') {
      block('SYNTHETIC_SOURCE_CLAIMED_VERIFIED', 'Synthetic sources cannot be presented as verified real sources.');
    }
    if (source.provenance === 'SYNTHETIC' && observation.verificationState === 'SOURCE_VERIFIED') {
      block('SYNTHETIC_SOURCE_CLAIMED_VERIFIED', 'Synthetic observations cannot be presented as verified real sources.');
    }
    if (verificationRank[observation.verificationState] > verificationRank[source.verificationState]) {
      block('OBSERVATION_VERIFICATION_EXCEEDS_SOURCE', 'Observation verification cannot exceed source verification.');
    }
  }

  return { status: issues.length === 0 ? 'PASS' : 'BLOCKED', issues };
};
