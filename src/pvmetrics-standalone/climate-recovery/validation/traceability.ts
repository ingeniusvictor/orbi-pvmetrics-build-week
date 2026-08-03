import type {
  DataProvenance,
  DiagnosticHypothesis,
  EvidenceItem,
} from '../contracts/entities';
import type { ValidationIssue, ValidationResult } from '../types/validation';
import { validateConfidenceConsistency } from '../utils/confidence';
import {
  createIssue,
  finalizeValidation,
  isFiniteNumber,
  isValidIsoDate,
  validateIsoDate,
  validateOriginRealityCoherence,
  validateRequiredArray,
  validateRequiredId,
} from './primitives';

export const validateDataProvenance = (
  provenance: DataProvenance,
  path = 'provenance',
): ValidationResult<DataProvenance> => {
  const entityId = provenance?.traceId;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(provenance?.sourceId, `${path}.sourceId`, entityId),
    ...validateRequiredId(provenance?.sourceType, `${path}.sourceType`, entityId),
    ...validateRequiredId(provenance?.traceId, `${path}.traceId`, entityId),
    ...validateIsoDate(provenance?.observedAt, `${path}.observedAt`, entityId),
    ...validateRequiredArray(provenance?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(provenance?.limitations, `${path}.limitations`, entityId),
  ];
  for (const field of ['receivedAt', 'validFrom', 'validTo'] as const) {
    const value = provenance?.[field];
    if (value !== undefined) {
      issues.push(...validateIsoDate(value, `${path}.${field}`, entityId));
    }
  }
  if (
    isValidIsoDate(provenance?.validFrom) &&
    isValidIsoDate(provenance?.validTo) &&
    Date.parse(provenance.validFrom) > Date.parse(provenance.validTo)
  ) {
    issues.push(
      createIssue(
        'invalid-provenance-validity',
        'error',
        `${path}.validTo`,
        'Provenance validTo cannot precede validFrom.',
        'Correct the provenance validity interval.',
        entityId,
      ),
    );
  }
  if (
    provenance?.datasetReality === 'synthetic' &&
    !provenance.syntheticDisclosure?.trim()
  ) {
    issues.push(
      createIssue(
        'synthetic-disclosure-required',
        'critical',
        `${path}.syntheticDisclosure`,
        'Synthetic data requires an explicit disclosure.',
        'State clearly that the value is fictional and for demonstration or testing only.',
        entityId,
      ),
    );
  }
  if (provenance) {
    issues.push(
      ...validateOriginRealityCoherence(
        provenance.origin,
        provenance.datasetReality,
        path,
        entityId,
      ),
    );
  }
  return finalizeValidation(provenance, issues);
};

export const validateEvidenceItem = (
  evidence: EvidenceItem,
  path = 'evidence',
): ValidationResult<EvidenceItem> => {
  const entityId = evidence?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(evidence?.id, `${path}.id`, entityId),
    ...validateRequiredArray(evidence?.notes, `${path}.notes`, entityId),
    ...validateIsoDate(evidence?.createdAt, `${path}.createdAt`, entityId),
  ];
  if (evidence?.delta !== undefined && !isFiniteNumber(evidence.delta)) {
    issues.push(
      createIssue(
        'finite-number-required',
        'error',
        `${path}.delta`,
        'Evidence delta must be finite.',
        'Provide a finite numeric delta or omit it.',
        entityId,
      ),
    );
  }
  if (
    evidence?.weight !== undefined &&
    (!isFiniteNumber(evidence.weight) || evidence.weight < 0 || evidence.weight > 1)
  ) {
    issues.push(
      createIssue(
        'evidence-weight-out-of-range',
        'error',
        `${path}.weight`,
        'Evidence weight must be between 0 and 1.',
        'Normalize the optional weight to the inclusive range 0..1.',
        entityId,
      ),
    );
  }
  if (
    evidence?.direction === 'unavailable' &&
    (!Array.isArray(evidence.notes) || evidence.notes.every((note) => !note.trim()))
  ) {
    issues.push(
      createIssue(
        'unavailable-evidence-explanation-required',
        'error',
        `${path}.notes`,
        'Unavailable evidence must explain why it is unavailable.',
        'Add a concrete missing-data explanation.',
        entityId,
      ),
    );
  }
  if (evidence?.provenance) {
    issues.push(
      ...validateDataProvenance(evidence.provenance, `${path}.provenance`).issues,
    );
  } else {
    issues.push(
      createIssue(
        'provenance-required',
        'critical',
        `${path}.provenance`,
        'Evidence requires traceable provenance.',
        'Attach a DataProvenance record.',
        entityId,
      ),
    );
  }
  return finalizeValidation(evidence, issues);
};

export const validateDiagnosticHypothesis = (
  hypothesis: DiagnosticHypothesis,
  path = 'hypothesis',
): ValidationResult<DiagnosticHypothesis> => {
  const entityId = hypothesis?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(hypothesis?.id, `${path}.id`, entityId),
    ...validateRequiredArray(hypothesis?.evidenceFor, `${path}.evidenceFor`, entityId),
    ...validateRequiredArray(hypothesis?.evidenceAgainst, `${path}.evidenceAgainst`, entityId),
    ...validateRequiredArray(hypothesis?.missingEvidence, `${path}.missingEvidence`, entityId),
    ...validateRequiredArray(hypothesis?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(hypothesis?.limitations, `${path}.limitations`, entityId),
    ...validateRequiredArray(
      hypothesis?.alternativeHypothesisIds,
      `${path}.alternativeHypothesisIds`,
      entityId,
    ),
    ...validateIsoDate(hypothesis?.createdAt, `${path}.createdAt`, entityId),
    ...validateIsoDate(hypothesis?.updatedAt, `${path}.updatedAt`, entityId),
  ];
  if (!hypothesis?.limitations?.some((limitation) => limitation.trim())) {
    issues.push(
      createIssue(
        'hypothesis-limitation-required',
        'error',
        `${path}.limitations`,
        'Every diagnostic hypothesis must declare at least one limitation.',
        'Add the main uncertainty or boundary of the hypothesis.',
        entityId,
      ),
    );
  }
  if (
    (hypothesis?.confidenceLevel === 'high' ||
      hypothesis?.confidenceLevel === 'very-high') &&
    hypothesis.evidenceFor.length === 0
  ) {
    issues.push(
      createIssue(
        'high-confidence-evidence-required',
        'critical',
        `${path}.evidenceFor`,
        'High or very-high confidence requires supporting evidence.',
        'Lower confidence or cite at least one supporting evidence item.',
        entityId,
      ),
    );
  }
  if (
    hypothesis?.status === 'confirmed-by-human' &&
    !['reviewed', 'accepted'].includes(hypothesis.humanReviewStatus)
  ) {
    issues.push(
      createIssue(
        'human-confirmation-required',
        'critical',
        `${path}.humanReviewStatus`,
        'A human-confirmed hypothesis requires completed human review.',
        'Record reviewed or accepted human review before confirmation.',
        entityId,
      ),
    );
  }
  if (hypothesis?.requiresHumanReview !== true) {
    issues.push(
      createIssue(
        'hypothesis-human-review-required',
        'error',
        `${path}.requiresHumanReview`,
        'Diagnostic hypotheses must remain subject to human review.',
        'Set requiresHumanReview to true.',
        entityId,
      ),
    );
  }
  if (hypothesis) {
    issues.push(
      ...validateConfidenceConsistency(
        hypothesis.confidenceScore,
        hypothesis.confidenceLevel,
        path,
      ).issues.map((issue) => ({ ...issue, entityId })),
    );
  }
  return finalizeValidation(hypothesis, issues);
};
