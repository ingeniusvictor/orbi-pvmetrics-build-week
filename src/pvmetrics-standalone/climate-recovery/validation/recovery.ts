import type {
  RecommendedAction,
  RecoverableLoss,
  RecoveryScenario,
} from '../contracts/entities';
import type { ValidationIssue, ValidationResult } from '../types/validation';
import { validateConfidenceConsistency } from '../utils/confidence';
import {
  createIssue,
  finalizeValidation,
  isNonNegativeFiniteNumber,
  validateIsoDate,
  validateNonNegative,
  validateOriginRealityCoherence,
  validateRequiredArray,
  validateRequiredId,
  validateTimeWindow,
  validateUncertaintyRange,
} from './primitives';

export const validateRecoverableLoss = (
  loss: RecoverableLoss,
  path = 'loss',
): ValidationResult<RecoverableLoss> => {
  const entityId = loss?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(loss?.id, `${path}.id`, entityId),
    ...validateRequiredId(loss?.assetId, `${path}.assetId`, entityId),
    ...validateRequiredId(loss?.plantId, `${path}.plantId`, entityId),
    ...validateIsoDate(loss?.detectedAt, `${path}.detectedAt`, entityId),
    ...validateIsoDate(loss?.createdAt, `${path}.createdAt`, entityId),
    ...validateIsoDate(loss?.updatedAt, `${path}.updatedAt`, entityId),
    ...validateTimeWindow(loss?.analysisWindow, `${path}.analysisWindow`, entityId),
    ...validateRequiredArray(loss?.evidenceIds, `${path}.evidenceIds`, entityId),
    ...validateRequiredArray(loss?.hypothesisIds, `${path}.hypothesisIds`, entityId),
    ...validateRequiredArray(loss?.exclusions, `${path}.exclusions`, entityId),
    ...validateRequiredArray(loss?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(loss?.limitations, `${path}.limitations`, entityId),
  ];
  for (const field of [
    'estimatedPowerLossKw',
    'estimatedEnergyLossKwh',
    'estimatedDailyEnergyLossKwh',
  ] as const) {
    if (loss?.[field] !== undefined) {
      issues.push(...validateNonNegative(loss[field], `${path}.${field}`, entityId));
    }
  }
  if (!loss?.limitations?.some((limitation) => limitation.trim())) {
    issues.push(
      createIssue(
        'loss-limitation-required',
        'error',
        `${path}.limitations`,
        'Every loss assessment must declare at least one limitation.',
        'Add the principal uncertainty or data limitation.',
        entityId,
      ),
    );
  }
  if (
    loss?.category === 'grid-curtailment' &&
    loss.recoverabilityStatus === 'recoverable'
  ) {
    issues.push(
      createIssue(
        'curtailment-not-automatically-recoverable',
        'critical',
        `${path}.recoverabilityStatus`,
        'Grid curtailment cannot be classified automatically as recoverable.',
        'Classify it as non-recoverable, indeterminate, or justify partial recoverability through human review.',
        entityId,
      ),
    );
  }
  if (
    loss?.category === 'unknown' &&
    ['actionable', 'resolved'].includes(loss.status)
  ) {
    issues.push(
      createIssue(
        'unknown-loss-needs-data',
        'error',
        `${path}.status`,
        'An unknown loss category cannot be actionable or resolved.',
        'Request additional evidence and keep the loss under assessment.',
        entityId,
      ),
    );
  }
  if (
    ['communications', 'sensor-quality'].includes(loss?.category) &&
    loss?.estimatedEnergyLossKwh !== undefined
  ) {
    issues.push(
      createIssue(
        'observability-is-not-energy-loss',
        'warning',
        `${path}.estimatedEnergyLossKwh`,
        'Communications or sensor-quality issues do not by themselves prove energy loss.',
        'Retain the estimate only with independent operational evidence and human review.',
        entityId,
      ),
    );
  }
  if (loss?.category === 'clipping' && loss?.recoverabilityStatus === 'recoverable') {
    issues.push(
      createIssue(
        'clipping-needs-context',
        'warning',
        `${path}.recoverabilityStatus`,
        'Clipping is not automatically an equipment failure.',
        'Review design limits and operating conditions before classifying recovery potential.',
        entityId,
      ),
    );
  }
  if (loss?.uncertaintyRange) {
    issues.push(
      ...validateUncertaintyRange(
        loss.uncertaintyRange,
        `${path}.uncertaintyRange`,
        entityId,
      ).issues,
    );
  }
  if (loss) {
    issues.push(
      ...validateOriginRealityCoherence(
        loss.origin,
        loss.datasetReality,
        path,
        entityId,
      ),
      ...validateConfidenceConsistency(
        loss.confidenceScore,
        loss.confidenceLevel,
        path,
      ).issues.map((issue) => ({ ...issue, entityId })),
    );
  }
  return finalizeValidation(loss, issues);
};

export const validateRecommendedAction = (
  action: RecommendedAction,
  path = 'action',
): ValidationResult<RecommendedAction> => {
  const entityId = action?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(action?.id, `${path}.id`, entityId),
    ...validateRequiredId(action?.lossId, `${path}.lossId`, entityId),
    ...validateRequiredArray(action?.prerequisites, `${path}.prerequisites`, entityId),
    ...validateRequiredArray(action?.safetyNotes, `${path}.safetyNotes`, entityId),
    ...validateRequiredArray(
      action?.uncertaintyNotes,
      `${path}.uncertaintyNotes`,
      entityId,
    ),
    ...validateRequiredArray(action?.evidenceIds, `${path}.evidenceIds`, entityId),
    ...validateRequiredArray(action?.hypothesisIds, `${path}.hypothesisIds`, entityId),
    ...validateIsoDate(action?.createdAt, `${path}.createdAt`, entityId),
    ...validateIsoDate(action?.updatedAt, `${path}.updatedAt`, entityId),
  ];
  if (action?.actionType === 'no-action' && !action.rationale?.trim()) {
    issues.push(
      createIssue(
        'no-action-rationale-required',
        'error',
        `${path}.rationale`,
        'A no-action recommendation requires a rationale.',
        'Explain why intervention is not appropriate.',
        entityId,
      ),
    );
  }
  if (
    ['field-inspection', 'maintenance-intervention'].includes(action?.actionType) &&
    !action?.safetyNotes?.some((note) => note.trim())
  ) {
    issues.push(
      createIssue(
        'field-safety-notes-required',
        'critical',
        `${path}.safetyNotes`,
        'Field or maintenance actions require safety notes.',
        'Add site-procedure, isolation, competency, and approval boundaries as applicable.',
        entityId,
      ),
    );
  }
  if (action?.requiresApproval !== true) {
    issues.push(
      createIssue(
        'action-human-approval-required',
        'critical',
        `${path}.requiresApproval`,
        'Recommendations are non-binding and require human approval.',
        'Set requiresApproval to true and retain advisory wording.',
        entityId,
      ),
    );
  }
  if (action?.estimatedCost) {
    issues.push(
      ...validateNonNegative(
        action.estimatedCost.amount,
        `${path}.estimatedCost.amount`,
        entityId,
      ),
    );
  }
  return finalizeValidation(action, issues);
};

export const validateRecoveryScenario = (
  scenario: RecoveryScenario,
  path = 'scenario',
): ValidationResult<RecoveryScenario> => {
  const entityId = scenario?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(scenario?.id, `${path}.id`, entityId),
    ...validateRequiredId(scenario?.lossId, `${path}.lossId`, entityId),
    ...validateIsoDate(scenario?.createdAt, `${path}.createdAt`, entityId),
    ...validateRequiredArray(scenario?.assumptions, `${path}.assumptions`, entityId),
    ...validateRequiredArray(scenario?.limitations, `${path}.limitations`, entityId),
    ...validateNonNegative(
      scenario?.noInterventionEnergyLossKwh,
      `${path}.noInterventionEnergyLossKwh`,
      entityId,
    ),
    ...validateNonNegative(
      scenario?.interventionEnergyLossKwh,
      `${path}.interventionEnergyLossKwh`,
      entityId,
    ),
    ...validateNonNegative(
      scenario?.estimatedRecoveredEnergyKwh,
      `${path}.estimatedRecoveredEnergyKwh`,
      entityId,
    ),
  ];
  if (
    scenario?.horizon === 'custom' &&
    (!Number.isInteger(scenario.customHorizonDays) ||
      !isNonNegativeFiniteNumber(scenario.customHorizonDays) ||
      scenario.customHorizonDays === 0)
  ) {
    issues.push(
      createIssue(
        'custom-horizon-days-required',
        'error',
        `${path}.customHorizonDays`,
        'A custom horizon requires a positive whole number of days.',
        'Provide customHorizonDays greater than zero.',
        entityId,
      ),
    );
  }
  if (
    isNonNegativeFiniteNumber(scenario?.noInterventionEnergyLossKwh) &&
    isNonNegativeFiniteNumber(scenario?.interventionEnergyLossKwh) &&
    isNonNegativeFiniteNumber(scenario?.estimatedRecoveredEnergyKwh)
  ) {
    const maximumRecovery = Math.max(
      0,
      scenario.noInterventionEnergyLossKwh - scenario.interventionEnergyLossKwh,
    );
    if (scenario.estimatedRecoveredEnergyKwh > maximumRecovery + 1e-9) {
      issues.push(
        createIssue(
          'inconsistent-recovered-energy',
          'critical',
          `${path}.estimatedRecoveredEnergyKwh`,
          'Estimated recovery exceeds the difference between intervention and no-intervention scenarios.',
          'Reconcile the scenario energy values and assumptions.',
          entityId,
        ),
      );
    }
  }
  if (
    scenario?.datasetReality === 'synthetic' &&
    !['draft', 'simulated'].includes(scenario.status)
  ) {
    issues.push(
      createIssue(
        'synthetic-scenario-status',
        'error',
        `${path}.status`,
        'Synthetic recovery scenarios must remain draft or simulated.',
        'Use simulated for current Competition Edition fixtures.',
        entityId,
      ),
    );
  }
  if (scenario?.uncertaintyRange) {
    issues.push(
      ...validateUncertaintyRange(
        scenario.uncertaintyRange,
        `${path}.uncertaintyRange`,
        entityId,
      ).issues,
    );
  }
  if (scenario) {
    issues.push(
      ...validateOriginRealityCoherence(
        scenario.origin,
        scenario.datasetReality,
        path,
        entityId,
      ),
    );
  }
  return finalizeValidation(scenario, issues);
};
