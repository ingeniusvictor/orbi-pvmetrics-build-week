export type * from './contracts/entities';
export type * from './types/common';
export type * from './types/taxonomy';
export type * from './types/validation';
export type { DoubleCountingAssessment } from './utils/doubleCounting';

export {
  CONFIDENCE_LABELS,
  CONFIDENCE_THRESHOLDS,
  clampConfidenceScore,
  deriveConfidenceLevel,
  validateConfidenceConsistency,
} from './utils/confidence';
export {
  assessCaseDoubleCounting,
  assessDoubleCounting,
} from './utils/doubleCounting';
export {
  SYNTHETIC_CLIMATE_RECOVERY_CASES,
  SYNTHETIC_CLIMATE_RECOVERY_DISCLOSURE,
  createSyntheticClimateRecoveryCases,
  getSyntheticClimateRecoveryCase,
} from './fixtures/syntheticCases';
export {
  isFiniteNumber,
  isNonNegativeFiniteNumber,
  isValidIsoDate,
  validateIsoDate,
  validateNonNegative,
  validateOriginRealityCoherence,
  validateRequiredArray,
  validateRequiredId,
  validateTimeWindow,
  validateUncertaintyRange,
} from './validation/primitives';
export {
  validateDataProvenance,
  validateDiagnosticHypothesis,
  validateEvidenceItem,
} from './validation/traceability';
export {
  validateRecommendedAction,
  validateRecoverableLoss,
  validateRecoveryScenario,
} from './validation/recovery';
export {
  validateClimateImpactEstimate,
  validateEmissionFactor,
  validateRecoveryVerification,
} from './validation/impact';
export { validateClimateRecoveryCase } from './validation/case';
