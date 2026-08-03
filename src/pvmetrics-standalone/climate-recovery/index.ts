export type * from './contracts/entities';
export type * from './contracts/assessment';
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
export {
  CLIMATE_RECOVERY_ENGINE_VERSION,
  DEFAULT_ASSESSMENT_CONFIGURATION,
  DEFAULT_REQUESTED_OPERATIONS,
  assessClimateImpact,
  assessClimateRecoveryCase,
  assessDataSufficiency,
  assessEnergyLoss,
  assessEvidence,
  assessPriority,
  assessRecoverability,
  createAssessmentTraceStep,
  deriveConfiguredConfidenceLevel,
  generateDeterministicHypotheses,
  generateRecommendations,
  generateRecoveryScenarios,
  hasIndependentEnergyEvidence,
  normalizeEmissionFactorToKgPerKwh,
  resolveAssessmentConfiguration,
  validateAssessmentConfiguration,
} from './engine';
export type * from './application/contracts/applicationContracts';
export type * from './application/contracts/presentationModels';
export type * from './application/contracts/queryContracts';
export {
  CLIMATE_RECOVERY_PRESENTATION_VERSION,
  DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
  resolveClimateRecoveryApplicationConfiguration,
  createDemoCaseRegistry,
  resolveClimateRecoveryText,
  createClimateRecoveryApplicationService,
} from './application';
