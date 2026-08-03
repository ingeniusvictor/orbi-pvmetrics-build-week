import type { TimeWindow, UncertaintyRange } from '../types/common';
import type { DataOrigin, DatasetReality, ValidationSeverity } from '../types/taxonomy';
import type { ValidationIssue, ValidationResult } from '../types/validation';

const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export const isValidIsoDate = (value: unknown): value is string =>
  typeof value === 'string' &&
  ISO_DATE_PATTERN.test(value) &&
  Number.isFinite(Date.parse(value));

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export const isNonNegativeFiniteNumber = (value: unknown): value is number =>
  isFiniteNumber(value) && value >= 0;

export const createIssue = (
  code: string,
  severity: ValidationSeverity,
  path: string,
  message: string,
  remediation: string,
  entityId?: string,
): ValidationIssue => ({
  code,
  severity,
  path,
  message,
  remediation,
  ...(entityId ? { entityId } : {}),
});

export const finalizeValidation = <T>(
  value: T,
  issues: ValidationIssue[],
): ValidationResult<T> => {
  const errors = issues.filter(
    (issue) => issue.severity === 'error' || issue.severity === 'critical',
  );
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  return {
    valid: errors.length === 0,
    value: errors.length === 0 ? value : undefined,
    issues,
    errors,
    warnings,
  };
};

export const validateRequiredId = (
  value: unknown,
  path: string,
  entityId?: string,
): ValidationIssue[] =>
  typeof value === 'string' && value.trim().length > 0
    ? []
    : [
        createIssue(
          'required-id',
          'error',
          path,
          'A non-empty identifier is required.',
          'Provide a stable, traceable identifier.',
          entityId,
        ),
      ];

export const validateRequiredArray = (
  value: unknown,
  path: string,
  entityId?: string,
): ValidationIssue[] =>
  Array.isArray(value)
    ? []
    : [
        createIssue(
          'required-array',
          'error',
          path,
          'An explicit array is required, even when empty.',
          'Provide an array value.',
          entityId,
        ),
      ];

export const validateIsoDate = (
  value: unknown,
  path: string,
  entityId?: string,
): ValidationIssue[] =>
  isValidIsoDate(value)
    ? []
    : [
        createIssue(
          'invalid-iso-date',
          'error',
          path,
          'A valid ISO 8601 date-time with timezone is required.',
          'Use an ISO 8601 timestamp such as 2026-01-01T12:00:00Z.',
          entityId,
        ),
      ];

export const validateNonNegative = (
  value: unknown,
  path: string,
  entityId?: string,
): ValidationIssue[] =>
  isNonNegativeFiniteNumber(value)
    ? []
    : [
        createIssue(
          'non-negative-finite-number-required',
          'error',
          path,
          'Value must be finite and non-negative.',
          'Provide a finite number greater than or equal to zero.',
          entityId,
        ),
      ];

export const validateTimeWindow = (
  window: TimeWindow,
  path: string,
  entityId?: string,
): ValidationIssue[] => {
  const issues = [
    ...validateIsoDate(window?.start, `${path}.start`, entityId),
    ...validateIsoDate(window?.end, `${path}.end`, entityId),
  ];
  if (
    isValidIsoDate(window?.start) &&
    isValidIsoDate(window?.end) &&
    Date.parse(window.start) > Date.parse(window.end)
  ) {
    issues.push(
      createIssue(
        'inverted-time-window',
        'error',
        path,
        'Time window start must not be after its end.',
        'Correct the start and end timestamps.',
        entityId,
      ),
    );
  }
  return issues;
};

export const validateUncertaintyRange = (
  range: UncertaintyRange,
  path = 'uncertaintyRange',
  entityId?: string,
): ValidationResult<UncertaintyRange> => {
  const issues: ValidationIssue[] = [];
  for (const [field, value] of [
    ['lowerBound', range?.lowerBound],
    ['centralEstimate', range?.centralEstimate],
    ['upperBound', range?.upperBound],
  ] as const) {
    issues.push(...validateNonNegative(value, `${path}.${field}`, entityId));
  }
  if (
    isNonNegativeFiniteNumber(range?.lowerBound) &&
    isNonNegativeFiniteNumber(range?.centralEstimate) &&
    isNonNegativeFiniteNumber(range?.upperBound) &&
    (range.lowerBound > range.centralEstimate ||
      range.centralEstimate > range.upperBound)
  ) {
    issues.push(
      createIssue(
        'unordered-uncertainty-range',
        'error',
        path,
        'Uncertainty bounds must satisfy lower <= central <= upper.',
        'Order all uncertainty estimates and use a consistent unit.',
        entityId,
      ),
    );
  }
  if (!range?.unit?.trim() || !range?.methodology?.trim()) {
    issues.push(
      createIssue(
        'incomplete-uncertainty-range',
        'error',
        path,
        'Uncertainty unit and methodology are required.',
        'Declare the unit, methodology, and confidence descriptor.',
        entityId,
      ),
    );
  }
  return finalizeValidation(range, issues);
};

export const validateOriginRealityCoherence = (
  origin: DataOrigin,
  datasetReality: DatasetReality,
  path: string,
  entityId?: string,
): ValidationIssue[] => {
  if (origin === 'simulated' && datasetReality === 'operational') {
    return [
      createIssue(
        'origin-reality-conflict',
        'error',
        path,
        'Simulated values cannot be labeled as operational data.',
        'Use synthetic/sanitized reality or correct the origin.',
        entityId,
      ),
    ];
  }
  if (origin === 'measured' && datasetReality === 'unknown') {
    return [
      createIssue(
        'untraceable-measurement',
        'warning',
        path,
        'A measured value has unknown dataset reality.',
        'Confirm whether the source is operational, sanitized, anonymized, or synthetic.',
        entityId,
      ),
    ];
  }
  return [];
};
