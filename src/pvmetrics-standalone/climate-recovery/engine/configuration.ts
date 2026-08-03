import type {
  AssessmentConfiguration,
  AssessmentConfigurationOverrides,
  AssessmentRequestedOperations,
} from '../contracts/assessment';
import type { ConfidenceLevel } from '../types/taxonomy';

export const DEFAULT_ASSESSMENT_CONFIGURATION: Readonly<AssessmentConfiguration> =
  Object.freeze({
    minimumEvidenceCount: 1,
    minimumSupportingEvidenceWeight: 0.4,
    maximumAllowedDataAgeMinutes: 24 * 60,
    confidenceThresholds: {
      veryLowMaximum: 0.19,
      lowMaximum: 0.39,
      mediumMaximum: 0.59,
      highMaximum: 0.79,
    },
    priorityWeights: {
      energyImpact: 25,
      operationalSeverity: 15,
      urgency: 10,
      confidence: 10,
      dataQuality: 10,
      recoverability: 15,
      persistenceRisk: 5,
      safetyRisk: 5,
      climateImpact: 5,
      effortAdjustment: -10,
    },
    priorityReferenceEnergyKwh: 5_000,
    priorityReferenceClimateKgCO2e: 2_500,
    uncertaintyPolicy: {
      highQualityFraction: 0.1,
      mediumQualityFraction: 0.2,
      degradedQualityFraction: 0.35,
    },
    evidenceQualityWeights: {
      valid: 1,
      degraded: 0.7,
      incomplete: 0.5,
      stale: 0.5,
      conflicting: 0.5,
      unavailable: 0,
      unknown: 0.4,
    },
    defaultEvidenceWeight: 0.5,
    allowClimateImpactEstimate: true,
    requireHumanReviewForHighPriority: true,
    requireEmissionFactorForClimateImpact: true,
    allowSyntheticProjection: true,
    doubleCountingPolicy: {
      possibleOverlap: 'provisional',
      confirmedOverlap: 'block',
    },
    energyLossMethod: 'auto',
    defaultRecoveryHorizons: ['seven-days'],
    recoveryRates: {
      recoverable: 0.7,
      'partially-recoverable': 0.35,
      'non-recoverable': 0,
      indeterminate: null,
      'not-assessed': null,
    },
  } satisfies AssessmentConfiguration);

export const DEFAULT_REQUESTED_OPERATIONS: Readonly<
  Required<
    Pick<
      AssessmentRequestedOperations,
      'assessEnergyLoss' | 'generateRecoveryScenarios' | 'estimateClimateImpact'
    >
  >
> = Object.freeze({
  assessEnergyLoss: true,
  generateRecoveryScenarios: true,
  estimateClimateImpact: true,
});

export const resolveAssessmentConfiguration = (
  overrides: AssessmentConfigurationOverrides = {},
): AssessmentConfiguration => ({
  ...DEFAULT_ASSESSMENT_CONFIGURATION,
  ...overrides,
  confidenceThresholds: {
    ...DEFAULT_ASSESSMENT_CONFIGURATION.confidenceThresholds,
    ...overrides.confidenceThresholds,
  },
  priorityWeights: {
    ...DEFAULT_ASSESSMENT_CONFIGURATION.priorityWeights,
    ...overrides.priorityWeights,
  },
  uncertaintyPolicy: {
    ...DEFAULT_ASSESSMENT_CONFIGURATION.uncertaintyPolicy,
    ...overrides.uncertaintyPolicy,
  },
  evidenceQualityWeights: {
    ...DEFAULT_ASSESSMENT_CONFIGURATION.evidenceQualityWeights,
    ...overrides.evidenceQualityWeights,
  },
  doubleCountingPolicy: {
    ...DEFAULT_ASSESSMENT_CONFIGURATION.doubleCountingPolicy,
    ...overrides.doubleCountingPolicy,
  },
  recoveryRates: {
    ...DEFAULT_ASSESSMENT_CONFIGURATION.recoveryRates,
    ...overrides.recoveryRates,
  },
  defaultRecoveryHorizons: [
    ...(overrides.defaultRecoveryHorizons ??
      DEFAULT_ASSESSMENT_CONFIGURATION.defaultRecoveryHorizons),
  ],
});

export const validateAssessmentConfiguration = (
  configuration: AssessmentConfiguration,
): string[] => {
  const errors: string[] = [];
  if (!Number.isInteger(configuration.minimumEvidenceCount) || configuration.minimumEvidenceCount < 0) {
    errors.push('minimumEvidenceCount must be a non-negative integer.');
  }
  if (
    !Number.isFinite(configuration.minimumSupportingEvidenceWeight) ||
    configuration.minimumSupportingEvidenceWeight < 0
  ) {
    errors.push('minimumSupportingEvidenceWeight must be finite and non-negative.');
  }
  if (
    !Number.isFinite(configuration.maximumAllowedDataAgeMinutes) ||
    configuration.maximumAllowedDataAgeMinutes < 0
  ) {
    errors.push('maximumAllowedDataAgeMinutes must be finite and non-negative.');
  }
  for (const [status, rate] of Object.entries(configuration.recoveryRates)) {
    if (rate !== null && (!Number.isFinite(rate) || rate < 0 || rate > 1)) {
      errors.push(`recoveryRates.${status} must be null or between 0 and 1.`);
    }
  }
  for (const [quality, weight] of Object.entries(configuration.evidenceQualityWeights)) {
    if (!Number.isFinite(weight) || weight < 0 || weight > 1) {
      errors.push(`evidenceQualityWeights.${quality} must be between 0 and 1.`);
    }
  }
  const thresholds = Object.values(configuration.confidenceThresholds);
  if (
    thresholds.some((value) => !Number.isFinite(value) || value < 0 || value > 1) ||
    thresholds.some((value, index) => index > 0 && value <= thresholds[index - 1])
  ) {
    errors.push('confidenceThresholds must be strictly increasing values within 0..1.');
  }
  for (const [name, fraction] of Object.entries(configuration.uncertaintyPolicy)) {
    if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) {
      errors.push(`uncertaintyPolicy.${name} must be between 0 and 1.`);
    }
  }
  for (const [name, weight] of Object.entries(configuration.priorityWeights)) {
    const valid = name === 'effortAdjustment'
      ? Number.isFinite(weight) && weight <= 0 && weight >= -100
      : Number.isFinite(weight) && weight >= 0 && weight <= 100;
    if (!valid) errors.push(`priorityWeights.${name} is outside its permitted range.`);
  }
  return errors;
};

export const deriveConfiguredConfidenceLevel = (
  score: number,
  configuration: Pick<AssessmentConfiguration, 'confidenceThresholds'>,
): ConfidenceLevel => {
  const normalized = Math.min(1, Math.max(0, Number.isFinite(score) ? score : 0));
  const thresholds = configuration.confidenceThresholds;
  if (normalized <= thresholds.veryLowMaximum) return 'very-low';
  if (normalized <= thresholds.lowMaximum) return 'low';
  if (normalized <= thresholds.mediumMaximum) return 'medium';
  if (normalized <= thresholds.highMaximum) return 'high';
  return 'very-high';
};
