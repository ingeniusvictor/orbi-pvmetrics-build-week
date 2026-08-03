import type { ClimateRecoveryCase } from '../contracts/entities';
import type { ValidationIssue, ValidationResult } from '../types/validation';
import { assessCaseDoubleCounting } from '../utils/doubleCounting';
import {
  createIssue,
  finalizeValidation,
  validateIsoDate,
  validateRequiredArray,
  validateRequiredId,
} from './primitives';
import {
  validateClimateImpactEstimate,
  validateEmissionFactor,
  validateRecoveryVerification,
} from './impact';
import {
  validateRecommendedAction,
  validateRecoverableLoss,
  validateRecoveryScenario,
} from './recovery';
import {
  validateDataProvenance,
  validateDiagnosticHypothesis,
  validateEvidenceItem,
} from './traceability';

const addMissingReference = (
  issues: ValidationIssue[],
  exists: boolean,
  path: string,
  entityId: string,
  referenceType: string,
): void => {
  if (!exists) {
    issues.push(
      createIssue(
        'missing-reference',
        'error',
        path,
        `${referenceType} reference does not exist in the case.`,
        `Add the referenced ${referenceType} or correct the identifier.`,
        entityId,
      ),
    );
  }
};

const findDuplicates = (ids: string[]): string[] =>
  [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

export const validateClimateRecoveryCase = (
  recoveryCase: ClimateRecoveryCase,
): ValidationResult<ClimateRecoveryCase> => {
  const entityId = recoveryCase?.id;
  const issues: ValidationIssue[] = [
    ...validateRequiredId(recoveryCase?.id, 'id', entityId),
    ...validateRequiredId(recoveryCase?.plant?.id, 'plant.id', entityId),
    ...validateRequiredId(recoveryCase?.asset?.id, 'asset.id', entityId),
    ...validateRequiredArray(recoveryCase?.losses, 'losses', entityId),
    ...validateRequiredArray(recoveryCase?.evidence, 'evidence', entityId),
    ...validateRequiredArray(recoveryCase?.hypotheses, 'hypotheses', entityId),
    ...validateRequiredArray(recoveryCase?.actions, 'actions', entityId),
    ...validateRequiredArray(recoveryCase?.scenarios, 'scenarios', entityId),
    ...validateRequiredArray(
      recoveryCase?.emissionFactors,
      'emissionFactors',
      entityId,
    ),
    ...validateRequiredArray(
      recoveryCase?.climateImpactEstimates,
      'climateImpactEstimates',
      entityId,
    ),
    ...validateRequiredArray(recoveryCase?.verifications, 'verifications', entityId),
    ...validateRequiredArray(recoveryCase?.provenance, 'provenance', entityId),
    ...validateRequiredArray(recoveryCase?.traceIds, 'traceIds', entityId),
    ...validateIsoDate(recoveryCase?.createdAt, 'createdAt', entityId),
    ...validateIsoDate(recoveryCase?.updatedAt, 'updatedAt', entityId),
  ];

  if (recoveryCase?.asset?.plantId !== recoveryCase?.plant?.id) {
    issues.push(
      createIssue(
        'asset-plant-mismatch',
        'error',
        'asset.plantId',
        'The asset must belong to the case plant.',
        'Use the same plant identifier on the case asset.',
        entityId,
      ),
    );
  }

  const evidenceIds = new Set(recoveryCase?.evidence?.map((item) => item.id) ?? []);
  const hypothesisIds = new Set(
    recoveryCase?.hypotheses?.map((item) => item.id) ?? [],
  );
  const lossIds = new Set(recoveryCase?.losses?.map((item) => item.id) ?? []);
  const actionIds = new Set(recoveryCase?.actions?.map((item) => item.id) ?? []);
  const scenarioIds = new Set(recoveryCase?.scenarios?.map((item) => item.id) ?? []);
  const impactIds = new Set(
    recoveryCase?.climateImpactEstimates?.map((item) => item.id) ?? [],
  );
  const factorById = new Map(
    recoveryCase?.emissionFactors?.map((factor) => [factor.id, factor]) ?? [],
  );
  const provenanceTraceIds = new Set(
    recoveryCase?.provenance?.map((item) => item.traceId) ?? [],
  );

  recoveryCase?.provenance?.forEach((item, index) => {
    issues.push(...validateDataProvenance(item, `provenance[${index}]`).issues);
  });
  recoveryCase?.evidence?.forEach((item, index) => {
    issues.push(...validateEvidenceItem(item, `evidence[${index}]`).issues);
    addMissingReference(
      issues,
      provenanceTraceIds.has(item.provenance.traceId),
      `evidence[${index}].provenance.traceId`,
      item.id,
      'case provenance trace',
    );
  });
  recoveryCase?.hypotheses?.forEach((item, index) => {
    issues.push(
      ...validateDiagnosticHypothesis(item, `hypotheses[${index}]`).issues,
    );
    item.evidenceFor.forEach((id, refIndex) =>
      addMissingReference(
        issues,
        evidenceIds.has(id),
        `hypotheses[${index}].evidenceFor[${refIndex}]`,
        item.id,
        'evidence',
      ),
    );
    item.evidenceAgainst.forEach((id, refIndex) =>
      addMissingReference(
        issues,
        evidenceIds.has(id),
        `hypotheses[${index}].evidenceAgainst[${refIndex}]`,
        item.id,
        'evidence',
      ),
    );
  });
  recoveryCase?.losses?.forEach((item, index) => {
    issues.push(...validateRecoverableLoss(item, `losses[${index}]`).issues);
    if (item.plantId !== recoveryCase.plant.id) {
      issues.push(
        createIssue(
          'loss-plant-mismatch',
          'error',
          `losses[${index}].plantId`,
          'Loss plant does not match the case plant.',
          'Correct the loss plant reference.',
          item.id,
        ),
      );
    }
    item.evidenceIds.forEach((id, refIndex) =>
      addMissingReference(
        issues,
        evidenceIds.has(id),
        `losses[${index}].evidenceIds[${refIndex}]`,
        item.id,
        'evidence',
      ),
    );
    item.hypothesisIds.forEach((id, refIndex) =>
      addMissingReference(
        issues,
        hypothesisIds.has(id),
        `losses[${index}].hypothesisIds[${refIndex}]`,
        item.id,
        'hypothesis',
      ),
    );
  });
  recoveryCase?.actions?.forEach((item, index) => {
    issues.push(...validateRecommendedAction(item, `actions[${index}]`).issues);
    addMissingReference(
      issues,
      lossIds.has(item.lossId),
      `actions[${index}].lossId`,
      item.id,
      'loss',
    );
    const linkedLoss = recoveryCase.losses.find((loss) => loss.id === item.lossId);
    if (
      linkedLoss?.recoverabilityStatus === 'non-recoverable' &&
      !['no-action', 'monitoring', 'request-more-data', 'data-validation'].includes(
        item.actionType,
      )
    ) {
      issues.push(
        createIssue(
          'non-recoverable-action-conflict',
          'critical',
          `actions[${index}].actionType`,
          'A non-recoverable loss cannot generate a recovery intervention.',
          'Use no-action, monitoring, data validation, or reclassify after human review.',
          item.id,
        ),
      );
    }
  });
  recoveryCase?.emissionFactors?.forEach((item, index) => {
    issues.push(...validateEmissionFactor(item, `emissionFactors[${index}]`).issues);
  });
  recoveryCase?.scenarios?.forEach((item, index) => {
    issues.push(...validateRecoveryScenario(item, `scenarios[${index}]`).issues);
    addMissingReference(
      issues,
      lossIds.has(item.lossId),
      `scenarios[${index}].lossId`,
      item.id,
      'loss',
    );
    if (item.emissionFactorId) {
      addMissingReference(
        issues,
        factorById.has(item.emissionFactorId),
        `scenarios[${index}].emissionFactorId`,
        item.id,
        'emission factor',
      );
    }
    if (item.climateImpactEstimateId) {
      addMissingReference(
        issues,
        impactIds.has(item.climateImpactEstimateId),
        `scenarios[${index}].climateImpactEstimateId`,
        item.id,
        'climate impact estimate',
      );
    }
    const linkedLoss = recoveryCase.losses.find((loss) => loss.id === item.lossId);
    if (
      ['non-recoverable', 'indeterminate'].includes(
        linkedLoss?.recoverabilityStatus ?? '',
      ) &&
      item.estimatedRecoveredEnergyKwh > 0
    ) {
      issues.push(
        createIssue(
          'unrecoverable-scenario-energy',
          'critical',
          `scenarios[${index}].estimatedRecoveredEnergyKwh`,
          'Non-recoverable or indeterminate losses cannot claim recovered energy.',
          'Set recovery to zero or complete recoverability review.',
          item.id,
        ),
      );
    }
  });
  recoveryCase?.climateImpactEstimates?.forEach((item, index) => {
    issues.push(
      ...validateClimateImpactEstimate(
        item,
        factorById.get(item.emissionFactorId),
        `climateImpactEstimates[${index}]`,
      ).issues,
    );
    addMissingReference(
      issues,
      lossIds.has(item.lossId),
      `climateImpactEstimates[${index}].lossId`,
      item.id,
      'loss',
    );
    if (item.scenarioId) {
      addMissingReference(
        issues,
        scenarioIds.has(item.scenarioId),
        `climateImpactEstimates[${index}].scenarioId`,
        item.id,
        'scenario',
      );
    }
    const linkedLoss = recoveryCase.losses.find((loss) => loss.id === item.lossId);
    if (
      ['non-recoverable', 'indeterminate'].includes(
        linkedLoss?.recoverabilityStatus ?? '',
      )
    ) {
      issues.push(
        createIssue(
          'unrecoverable-climate-impact',
          'critical',
          `climateImpactEstimates[${index}].lossId`,
          'Non-recoverable or indeterminate loss cannot produce operational recovery impact.',
          'Remove the estimate or complete recoverability review.',
          item.id,
        ),
      );
    }
  });
  recoveryCase?.verifications?.forEach((item, index) => {
    issues.push(
      ...validateRecoveryVerification(item, `verifications[${index}]`).issues,
    );
    addMissingReference(
      issues,
      lossIds.has(item.lossId),
      `verifications[${index}].lossId`,
      item.id,
      'loss',
    );
    addMissingReference(
      issues,
      actionIds.has(item.actionId),
      `verifications[${index}].actionId`,
      item.id,
      'action',
    );
  });

  const contradictoryIds = recoveryCase?.evidence
    ?.filter((item) => item.direction === 'contradicts')
    .map((item) => item.id) ?? [];
  const accountedContradictions = new Set(
    recoveryCase?.hypotheses?.flatMap((item) => item.evidenceAgainst) ?? [],
  );
  contradictoryIds.forEach((id) => {
    if (!accountedContradictions.has(id)) {
      issues.push(
        createIssue(
          'contradictory-evidence-unaccounted',
          'error',
          'hypotheses',
          'Contradictory evidence must remain visible in hypothesis assessment.',
          'Reference the evidence in evidenceAgainst for the relevant hypothesis.',
          id,
        ),
      );
    }
  });

  recoveryCase?.traceIds?.forEach((traceId, index) =>
    addMissingReference(
      issues,
      provenanceTraceIds.has(traceId),
      `traceIds[${index}]`,
      entityId,
      'case provenance trace',
    ),
  );

  const allIds = [
    ...(recoveryCase?.losses?.map((item) => item.id) ?? []),
    ...(recoveryCase?.evidence?.map((item) => item.id) ?? []),
    ...(recoveryCase?.hypotheses?.map((item) => item.id) ?? []),
    ...(recoveryCase?.actions?.map((item) => item.id) ?? []),
    ...(recoveryCase?.scenarios?.map((item) => item.id) ?? []),
    ...(recoveryCase?.emissionFactors?.map((item) => item.id) ?? []),
    ...(recoveryCase?.climateImpactEstimates?.map((item) => item.id) ?? []),
    ...(recoveryCase?.verifications?.map((item) => item.id) ?? []),
  ];
  findDuplicates(allIds).forEach((id) => {
    issues.push(
      createIssue(
        'duplicate-entity-id',
        'error',
        'id',
        'Entity identifiers must be unique within a case.',
        'Assign a unique stable identifier.',
        id,
      ),
    );
  });

  if (
    recoveryCase?.status === 'closed' &&
    !['reviewed', 'accepted'].includes(recoveryCase.humanReviewStatus)
  ) {
    issues.push(
      createIssue(
        'closed-case-human-review-required',
        'critical',
        'humanReviewStatus',
        'A closed case requires completed human review.',
        'Record reviewed or accepted human review before closing.',
        entityId,
      ),
    );
  }

  assessCaseDoubleCounting(recoveryCase?.losses ?? [])
    .filter((assessment) => assessment.status !== 'clear')
    .forEach((assessment) => {
      issues.push(
        createIssue(
          'double-counting-review-required',
          'warning',
          'losses',
          `${assessment.status}: ${assessment.reasons.join(' ')}`,
          'Do not consolidate automatically; request human review before aggregation.',
          assessment.relatedLossIds.join(','),
        ),
      );
    });

  return finalizeValidation(recoveryCase, issues);
};
