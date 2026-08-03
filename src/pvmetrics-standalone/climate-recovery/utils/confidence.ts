import type { ConfidenceLevel } from '../types/taxonomy';
import type { ValidationIssue, ValidationResult } from '../types/validation';

export const CONFIDENCE_THRESHOLDS = Object.freeze([
  { minimum: 0, maximum: 0.19, level: 'very-low' },
  { minimum: 0.2, maximum: 0.39, level: 'low' },
  { minimum: 0.4, maximum: 0.59, level: 'medium' },
  { minimum: 0.6, maximum: 0.79, level: 'high' },
  { minimum: 0.8, maximum: 1, level: 'very-high' },
] as const satisfies readonly {
  minimum: number;
  maximum: number;
  level: ConfidenceLevel;
}[]);

export const CONFIDENCE_LABELS: Readonly<
  Record<ConfidenceLevel, { en: string; es: string }>
> = Object.freeze({
  'very-low': { en: 'Very low', es: 'Muy baja' },
  low: { en: 'Low', es: 'Baja' },
  medium: { en: 'Medium', es: 'Media' },
  high: { en: 'High', es: 'Alta' },
  'very-high': { en: 'Very high', es: 'Muy alta' },
});

export const clampConfidenceScore = (score: number): number => {
  if (!Number.isFinite(score)) return 0;
  return Math.min(1, Math.max(0, score));
};

export const deriveConfidenceLevel = (score: number): ConfidenceLevel => {
  const normalized = clampConfidenceScore(score);
  if (normalized < 0.2) return 'very-low';
  if (normalized < 0.4) return 'low';
  if (normalized < 0.6) return 'medium';
  if (normalized < 0.8) return 'high';
  return 'very-high';
};

export const validateConfidenceConsistency = (
  confidenceScore: number | undefined,
  confidenceLevel: ConfidenceLevel,
  path = 'confidence',
): ValidationResult<{ confidenceScore?: number; confidenceLevel: ConfidenceLevel }> => {
  const issues: ValidationIssue[] = [];
  if (
    confidenceScore !== undefined &&
    (!Number.isFinite(confidenceScore) || confidenceScore < 0 || confidenceScore > 1)
  ) {
    issues.push({
      code: 'confidence-score-out-of-range',
      severity: 'error',
      path: `${path}.confidenceScore`,
      message: 'Confidence score must be a finite number between 0 and 1.',
      remediation: 'Provide a normalized score in the inclusive range 0..1.',
    });
  } else if (
    confidenceScore !== undefined &&
    deriveConfidenceLevel(confidenceScore) !== confidenceLevel
  ) {
    issues.push({
      code: 'confidence-level-mismatch',
      severity: 'error',
      path: `${path}.confidenceLevel`,
      message: `Confidence level must be ${deriveConfidenceLevel(confidenceScore)} for score ${confidenceScore}.`,
      remediation: 'Derive the qualitative level with deriveConfidenceLevel.',
    });
  }

  return {
    valid: issues.length === 0,
    value:
      issues.length === 0 ? { confidenceScore, confidenceLevel } : undefined,
    issues,
    errors: issues,
    warnings: [],
  };
};
