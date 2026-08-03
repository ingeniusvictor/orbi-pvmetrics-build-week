import type { RecoverableLoss } from '../contracts/entities';
import type { RecoverableLossCategory } from '../types/taxonomy';

export type DoubleCountingAssessment = {
  status:
    | 'clear'
    | 'possible-overlap'
    | 'confirmed-overlap'
    | 'insufficient-information';
  relatedLossIds: string[];
  reasons: string[];
  recommendedTreatment:
    | 'count-separately'
    | 'consolidate'
    | 'exclude-one'
    | 'request-review';
  requiresHumanReview: boolean;
};

const RELATED_CATEGORY_GROUPS: readonly (readonly RecoverableLossCategory[])[] = [
  ['availability', 'underperformance', 'inverter', 'mppt-or-string'],
  ['communications', 'sensor-quality'],
  ['soiling', 'underperformance'],
  ['thermal-derating', 'underperformance', 'clipping'],
  ['bess-operation', 'operational-configuration'],
];

const overlap = (left: RecoverableLoss, right: RecoverableLoss): boolean =>
  Date.parse(left.analysisWindow.start) <= Date.parse(right.analysisWindow.end) &&
  Date.parse(right.analysisWindow.start) <= Date.parse(left.analysisWindow.end);

const shareAny = (left: string[], right: string[]): boolean =>
  left.some((value) => right.includes(value));

const categoriesAreRelated = (
  left: RecoverableLossCategory,
  right: RecoverableLossCategory,
): boolean =>
  left === right ||
  RELATED_CATEGORY_GROUPS.some(
    (group) => group.includes(left) && group.includes(right),
  );

export const assessDoubleCounting = (
  left: RecoverableLoss,
  right: RecoverableLoss,
): DoubleCountingAssessment => {
  const relatedLossIds = [left?.id, right?.id].filter(
    (id): id is string => typeof id === 'string' && id.length > 0,
  );
  if (
    !left?.plantId ||
    !right?.plantId ||
    !left?.assetId ||
    !right?.assetId ||
    !left?.analysisWindow?.start ||
    !left?.analysisWindow?.end ||
    !right?.analysisWindow?.start ||
    !right?.analysisWindow?.end ||
    !Number.isFinite(Date.parse(left.analysisWindow.start)) ||
    !Number.isFinite(Date.parse(left.analysisWindow.end)) ||
    !Number.isFinite(Date.parse(right.analysisWindow.start)) ||
    !Number.isFinite(Date.parse(right.analysisWindow.end))
  ) {
    return {
      status: 'insufficient-information',
      relatedLossIds,
      reasons: ['Plant, asset, and valid analysis windows are required.'],
      recommendedTreatment: 'request-review',
      requiresHumanReview: true,
    };
  }

  const reasons: string[] = [];
  if (left.plantId === right.plantId) reasons.push('Same plant.');
  if (left.assetId === right.assetId) reasons.push('Same asset.');
  if (overlap(left, right)) reasons.push('Analysis windows overlap.');
  if (categoriesAreRelated(left.category, right.category)) {
    reasons.push('Loss categories are equal or operationally related.');
  }
  if (
    left.doubleCountingGroupId &&
    left.doubleCountingGroupId === right.doubleCountingGroupId
  ) {
    reasons.push('Same explicit double-counting group.');
  }
  if (shareAny(left.evidenceIds, right.evidenceIds)) {
    reasons.push('Evidence references overlap.');
  }
  if (shareAny(left.hypothesisIds, right.hypothesisIds)) {
    reasons.push('Hypothesis references overlap.');
  }

  const sameScope =
    left.plantId === right.plantId &&
    left.assetId === right.assetId &&
    overlap(left, right);
  const explicitGroupMatch =
    Boolean(left.doubleCountingGroupId) &&
    left.doubleCountingGroupId === right.doubleCountingGroupId;

  if (sameScope && explicitGroupMatch) {
    return {
      status: 'confirmed-overlap',
      relatedLossIds,
      reasons,
      recommendedTreatment: 'request-review',
      requiresHumanReview: true,
    };
  }

  const referenceOrCategoryMatch =
    categoriesAreRelated(left.category, right.category) ||
    shareAny(left.evidenceIds, right.evidenceIds) ||
    shareAny(left.hypothesisIds, right.hypothesisIds);
  if (sameScope && referenceOrCategoryMatch) {
    return {
      status: 'possible-overlap',
      relatedLossIds,
      reasons,
      recommendedTreatment: 'request-review',
      requiresHumanReview: true,
    };
  }

  return {
    status: 'clear',
    relatedLossIds,
    reasons:
      reasons.length > 0
        ? reasons
        : ['Losses do not share plant, asset, time window, or trace references.'],
    recommendedTreatment: 'count-separately',
    requiresHumanReview: false,
  };
};

export const assessCaseDoubleCounting = (
  losses: readonly RecoverableLoss[],
): DoubleCountingAssessment[] => {
  const assessments: DoubleCountingAssessment[] = [];
  for (let leftIndex = 0; leftIndex < losses.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < losses.length; rightIndex += 1) {
      assessments.push(assessDoubleCounting(losses[leftIndex], losses[rightIndex]));
    }
  }
  return assessments;
};
