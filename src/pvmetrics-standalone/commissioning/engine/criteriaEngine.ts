import type {
  AssessmentStatus,
  Calculation,
  CriterionEvaluation,
  CriterionEvaluationResult,
  CriterionSnapshot,
} from '../contracts';

export type CriteriaMode = 'LAB' | 'PROJECT';

const compare = (criterion: CriterionSnapshot, measuredValue: number | string | boolean): CriterionEvaluationResult => {
  const { operator } = criterion;
  if (operator === '==') return measuredValue === criterion.expectedValue ? 'PASS' : 'FAIL';
  if (typeof measuredValue !== 'number') return 'NOT_EVALUATED';

  if (operator === '<') return criterion.maxValue !== undefined && measuredValue < criterion.maxValue ? 'PASS' : 'FAIL';
  if (operator === '<=') return criterion.maxValue !== undefined && measuredValue <= criterion.maxValue ? 'PASS' : 'FAIL';
  if (operator === '>') return criterion.minValue !== undefined && measuredValue > criterion.minValue ? 'PASS' : 'FAIL';
  if (operator === '>=') return criterion.minValue !== undefined && measuredValue >= criterion.minValue ? 'PASS' : 'FAIL';
  if (operator === 'BETWEEN') return criterion.minValue !== undefined && criterion.maxValue !== undefined && measuredValue >= criterion.minValue && measuredValue <= criterion.maxValue ? 'PASS' : 'FAIL';
  if (operator === 'OUTSIDE') return criterion.minValue !== undefined && criterion.maxValue !== undefined && (measuredValue < criterion.minValue || measuredValue > criterion.maxValue) ? 'PASS' : 'FAIL';
  if (operator === 'ABS<=') return criterion.maxValue !== undefined && Math.abs(measuredValue) <= criterion.maxValue ? 'PASS' : 'FAIL';
  return 'NOT_EVALUATED';
};

export const evaluateCriterion = (
  criterion: CriterionSnapshot,
  calculation: Calculation | undefined,
  mode: CriteriaMode,
  evaluatedAt: string,
): CriterionEvaluation => {
  let result: CriterionEvaluationResult = 'NOT_EVALUATED';
  let reason: string | undefined;

  if (criterion.status !== 'CONFIRMED') {
    reason = `Criterion status is ${criterion.status}; confirmed acceptance criteria are required.`;
  } else if (mode === 'PROJECT' && criterion.sourceType === 'LAB') {
    reason = 'LAB criterion cannot govern PROJECT mode.';
  } else if (!calculation || calculation.resultValue === null || calculation.resultValue === undefined) {
    reason = 'Required measured/calculated value is missing.';
  } else {
    result = compare(criterion, calculation.resultValue);
    if (result === 'NOT_EVALUATED') reason = 'Criterion configuration is incomplete or incompatible with the measured value.';
  }

  return {
    criterionEvaluationId: `${criterion.executionId}:${criterion.criterionSnapshotId}:evaluation`,
    executionId: criterion.executionId,
    criterionSnapshotId: criterion.criterionSnapshotId,
    measuredValue: calculation?.resultValue,
    result,
    calculationId: calculation?.calculationId,
    evidenceIds: [],
    evaluatedAt,
    reason,
  };
};

export const summarizeCriteriaAssessment = (
  snapshots: readonly CriterionSnapshot[],
  evaluations: readonly CriterionEvaluation[],
): AssessmentStatus => {
  const byId = new Map(evaluations.map((evaluation) => [evaluation.criterionSnapshotId, evaluation]));

  for (const snapshot of snapshots) {
    const evaluation = byId.get(snapshot.criterionSnapshotId);
    if (snapshot.mandatory && (!evaluation || evaluation.result === 'NOT_EVALUATED')) return 'INCONCLUSIVE';
  }

  if (evaluations.some((evaluation) => evaluation.result === 'FAIL')) return 'FAIL';
  if (evaluations.some((evaluation) => evaluation.result === 'WARNING')) return 'WARNING';
  if (evaluations.length === 0) return 'INCONCLUSIVE';
  return 'PASS';
};
