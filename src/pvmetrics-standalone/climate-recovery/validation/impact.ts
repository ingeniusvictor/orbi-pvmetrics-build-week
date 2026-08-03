import type {
  ClimateImpactEstimate,
  EmissionFactor,
  RecoveryVerification,
} from '../contracts/entities';
import type { ValidationIssue, ValidationResult } from '../types/validation';
import { validateConfidenceConsistency } from '../utils/confidence';
import {
  createIssue,
  finalizeValidation,
  isValidIsoDate,
  validateIsoDate,
  validateNonNegative,
  validateOriginRealityCoherence,
  validateRequiredArray,
  validateRequiredId,
  validateTimeWindow,
  validateUncertaintyRange,
} from './primitives';

export const validateEmissionFactor = (
  factor: EmissionFactor,
  path = 'emissionFactor',
): ValidationResult<EmissionFactor> => {
  const entityId = factor?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(factor?.id, `${path}.id`, entityId),
    ...validateRequiredId(factor?.sourceName, `${path}.sourceName`, entityId),
    ...validateIsoDate(factor?.validFrom, `${path}.validFrom`, entityId),
    ...validateIsoDate(factor?.createdAt, `${path}.createdAt`, entityId),
    ...validateIsoDate(factor?.updatedAt, `${path}.updatedAt`, entityId),
    ...validateRequiredArray(factor?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(factor?.limitations, `${path}.limitations`, entityId),
  ];
  if (factor?.validTo !== undefined) {
    issues.push(...validateIsoDate(factor.validTo, `${path}.validTo`, entityId));
  }
  if (!(typeof factor?.value === 'number' && Number.isFinite(factor.value) && factor.value > 0)) {
    issues.push(
      createIssue(
        'invalid-emission-factor-value',
        'critical',
        `${path}.value`,
        'Emission factor must be finite and greater than zero.',
        'Provide a traceable positive factor before estimating climate impact.',
        entityId,
      ),
    );
  }
  if (!Number.isInteger(factor?.year) || factor.year < 1900) {
    issues.push(
      createIssue(
        'invalid-emission-factor-year',
        'error',
        `${path}.year`,
        'Emission factor year must be a plausible whole year.',
        'Provide the source methodology year.',
        entityId,
      ),
    );
  }
  if (
    isValidIsoDate(factor?.validFrom) &&
    isValidIsoDate(factor?.validTo) &&
    Date.parse(factor.validFrom) > Date.parse(factor.validTo)
  ) {
    issues.push(
      createIssue(
        'invalid-emission-factor-validity',
        'error',
        `${path}.validTo`,
        'Emission factor validTo cannot precede validFrom.',
        'Correct the factor validity interval.',
        entityId,
      ),
    );
  }
  if (!factor?.methodology?.trim() || !factor?.limitations?.some((item) => item.trim())) {
    issues.push(
      createIssue(
        'emission-factor-methodology-required',
        'error',
        path,
        'Emission factor methodology and at least one limitation are required.',
        'Document how the factor was produced and where it must not be generalized.',
        entityId,
      ),
    );
  }
  if (factor) {
    issues.push(
      ...validateOriginRealityCoherence(
        factor.origin,
        factor.datasetReality,
        path,
        entityId,
      ),
    );
  }
  return finalizeValidation(factor, issues);
};

export const validateClimateImpactEstimate = (
  estimate: ClimateImpactEstimate,
  factor?: EmissionFactor,
  path = 'climateImpactEstimate',
): ValidationResult<ClimateImpactEstimate> => {
  const entityId = estimate?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(estimate?.id, `${path}.id`, entityId),
    ...validateRequiredId(estimate?.lossId, `${path}.lossId`, entityId),
    ...validateRequiredId(
      estimate?.emissionFactorId,
      `${path}.emissionFactorId`,
      entityId,
    ),
    ...validateNonNegative(
      estimate?.recoveredEnergyKwh,
      `${path}.recoveredEnergyKwh`,
      entityId,
    ),
    ...validateNonNegative(
      estimate?.avoidedEmissionsKgCO2e,
      `${path}.avoidedEmissionsKgCO2e`,
      entityId,
    ),
    ...validateIsoDate(estimate?.calculatedAt, `${path}.calculatedAt`, entityId),
    ...validateRequiredArray(estimate?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(estimate?.limitations, `${path}.limitations`, entityId),
  ];
  if (!factor) {
    issues.push(
      createIssue(
        'emission-factor-required',
        'critical',
        `${path}.emissionFactorId`,
        'Climate impact cannot be evaluated without its emission factor.',
        'Attach a valid, traceable EmissionFactor record.',
        entityId,
      ),
    );
  } else {
    if (factor.id !== estimate?.emissionFactorId) {
      issues.push(
        createIssue(
          'emission-factor-reference-mismatch',
          'critical',
          `${path}.emissionFactorId`,
          'The supplied emission factor does not match the estimate reference.',
          'Resolve the factor by exact emissionFactorId.',
          entityId,
        ),
      );
    }
    const factorResult = validateEmissionFactor(factor, 'emissionFactor');
    if (!factorResult.valid) {
      issues.push(
        createIssue(
          'invalid-emission-factor',
          'critical',
          `${path}.emissionFactorId`,
          'The referenced emission factor is invalid.',
          'Correct the emission factor before producing climate impact.',
          entityId,
        ),
      );
      issues.push(...factorResult.issues);
    }
  }
  if (
    estimate?.datasetReality === 'synthetic' &&
    (estimate.status === 'verified' ||
      estimate.verificationStatus === 'verified' ||
      estimate.status === 'provisionally-verified')
  ) {
    issues.push(
      createIssue(
        'synthetic-impact-cannot-be-verified',
        'critical',
        `${path}.status`,
        'Synthetic climate impact cannot be provisionally or fully verified.',
        'Use estimated or projected status and disclose the synthetic basis.',
        entityId,
      ),
    );
  }
  if (
    (estimate?.status === 'verified' || estimate?.verificationStatus === 'verified') &&
    !['reviewed', 'accepted'].includes(estimate.humanReviewStatus)
  ) {
    issues.push(
      createIssue(
        'verified-impact-human-review-required',
        'critical',
        `${path}.humanReviewStatus`,
        'Verified climate impact requires completed human review.',
        'Record reviewed or accepted human review.',
        entityId,
      ),
    );
  }
  if (estimate?.uncertaintyRange) {
    issues.push(
      ...validateUncertaintyRange(
        estimate.uncertaintyRange,
        `${path}.uncertaintyRange`,
        entityId,
      ).issues,
    );
  }
  if (estimate) {
    issues.push(
      ...validateOriginRealityCoherence(
        estimate.origin,
        estimate.datasetReality,
        path,
        entityId,
      ),
    );
  }
  return finalizeValidation(estimate, issues);
};

export const validateRecoveryVerification = (
  verification: RecoveryVerification,
  path = 'verification',
): ValidationResult<RecoveryVerification> => {
  const entityId = verification?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(verification?.id, `${path}.id`, entityId),
    ...validateRequiredId(verification?.lossId, `${path}.lossId`, entityId),
    ...validateRequiredId(verification?.actionId, `${path}.actionId`, entityId),
    ...validateTimeWindow(
      verification?.verificationWindow,
      `${path}.verificationWindow`,
      entityId,
    ),
    ...validateTimeWindow(
      verification?.baselinePeriod,
      `${path}.baselinePeriod`,
      entityId,
    ),
    ...validateTimeWindow(
      verification?.postActionPeriod,
      `${path}.postActionPeriod`,
      entityId,
    ),
    ...validateNonNegative(
      verification?.baselineEnergyKwh,
      `${path}.baselineEnergyKwh`,
      entityId,
    ),
    ...validateNonNegative(
      verification?.observedPostActionEnergyKwh,
      `${path}.observedPostActionEnergyKwh`,
      entityId,
    ),
    ...validateNonNegative(
      verification?.estimatedRecoveredEnergyKwh,
      `${path}.estimatedRecoveredEnergyKwh`,
      entityId,
    ),
    ...validateRequiredArray(
      verification?.confoundingFactors,
      `${path}.confoundingFactors`,
      entityId,
    ),
    ...validateRequiredArray(verification?.evidenceIds, `${path}.evidenceIds`, entityId),
    ...validateRequiredArray(verification?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(verification?.limitations, `${path}.limitations`, entityId),
    ...validateIsoDate(verification?.createdAt, `${path}.createdAt`, entityId),
    ...validateIsoDate(verification?.updatedAt, `${path}.updatedAt`, entityId),
  ];
  if (verification?.normalizedExpectedEnergyKwh !== undefined) {
    issues.push(
      ...validateNonNegative(
        verification.normalizedExpectedEnergyKwh,
        `${path}.normalizedExpectedEnergyKwh`,
        entityId,
      ),
    );
  }
  if (verification?.verifiedAt !== undefined) {
    issues.push(
      ...validateIsoDate(verification.verifiedAt, `${path}.verifiedAt`, entityId),
    );
  }
  if (
    verification?.weatherNormalizationApplied &&
    !verification.normalizationMethod?.trim()
  ) {
    issues.push(
      createIssue(
        'normalization-method-required',
        'error',
        `${path}.normalizationMethod`,
        'Weather normalization requires a documented method.',
        'Describe the deterministic or reviewed normalization method.',
        entityId,
      ),
    );
  }
  if (verification?.verificationStatus === 'verified') {
    if (!verification.verifiedBy?.trim() || !isValidIsoDate(verification.verifiedAt)) {
      issues.push(
        createIssue(
          'verification-attribution-required',
          'critical',
          `${path}.verifiedBy`,
          'Verified status requires verifiedBy and a valid verifiedAt timestamp.',
          'Record the accountable reviewer and verification time.',
          entityId,
        ),
      );
    }
    if (!['reviewed', 'accepted'].includes(verification.humanReviewStatus)) {
      issues.push(
        createIssue(
          'verification-human-review-required',
          'critical',
          `${path}.humanReviewStatus`,
          'Verified status requires completed human review.',
          'Record reviewed or accepted human review.',
          entityId,
        ),
      );
    }
  }
  if (
    verification?.datasetReality === 'synthetic' &&
    verification.verificationStatus === 'verified'
  ) {
    issues.push(
      createIssue(
        'synthetic-data-cannot-be-verified',
        'critical',
        `${path}.verificationStatus`,
        'Synthetic data cannot support verified recovery.',
        'Use estimated-recovery, insufficient-data, or not-started.',
        entityId,
      ),
    );
  }
  if (
    ['degraded', 'incomplete', 'conflicting'].includes(
      verification?.dataQualityStatus,
    ) &&
    ['provisionally-verified', 'verified'].includes(
      verification?.verificationStatus,
    )
  ) {
    issues.push(
      createIssue(
        'data-quality-limits-verification',
        'critical',
        `${path}.verificationStatus`,
        'Degraded, incomplete, or conflicting data cannot reach provisional or verified status.',
        'Improve data quality or use an uncertainty-preserving verification status.',
        entityId,
      ),
    );
  }
  if (verification?.uncertaintyRange) {
    issues.push(
      ...validateUncertaintyRange(
        verification.uncertaintyRange,
        `${path}.uncertaintyRange`,
        entityId,
      ).issues,
    );
  }
  if (verification) {
    issues.push(
      ...validateOriginRealityCoherence(
        verification.origin,
        verification.datasetReality,
        path,
        entityId,
      ),
      ...validateConfidenceConsistency(
        verification.confidenceScore,
        verification.confidenceLevel,
        path,
      ).issues.map((issue) => ({ ...issue, entityId })),
    );
  }
  return finalizeValidation(verification, issues);
};
