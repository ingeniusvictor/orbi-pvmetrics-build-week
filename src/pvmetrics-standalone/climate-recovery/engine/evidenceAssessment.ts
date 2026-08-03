import type {
  AssessmentConfiguration,
  EvidenceAssessment,
} from '../contracts/assessment';
import type { EvidenceItem } from '../contracts/entities';

const round = (value: number): number => Math.round(value * 1_000_000) / 1_000_000;

export const assessEvidence = (
  evidence: readonly EvidenceItem[],
  configuration: AssessmentConfiguration,
): EvidenceAssessment => {
  const excludedEvidenceIds: string[] = [];
  const exclusionReasons: Record<string, string> = {};
  const included = evidence.flatMap((item) => {
    const weight = item.weight ?? configuration.defaultEvidenceWeight;
    if (!Number.isFinite(weight) || weight < 0 || weight > 1) {
      excludedEvidenceIds.push(item.id);
      exclusionReasons[item.id] = 'Evidence weight is not finite within 0..1.';
      return [];
    }
    const qualityWeight = configuration.evidenceQualityWeights[item.qualityStatus];
    return [{ item, weight, adjustedWeight: weight * qualityWeight }];
  });
  const totalBaseWeight = included.reduce((sum, item) => sum + item.weight, 0);
  const denominator = totalBaseWeight > 0 ? totalBaseWeight : 1;
  const directionScore = (direction: EvidenceItem['direction']): number =>
    round(
      included
        .filter(({ item }) => item.direction === direction)
        .reduce(
          (sum, item) =>
            sum + (direction === 'unavailable' ? item.weight : item.adjustedWeight),
          0,
        ) / denominator,
    );
  const supportingScore = directionScore('supports');
  const contradictingScore = directionScore('contradicts');
  const neutralScore = directionScore('neutral');
  const unavailableScore = directionScore('unavailable');
  const netEvidenceScore = round(supportingScore - contradictingScore);
  const byInfluence = (direction: EvidenceItem['direction']): string[] =>
    included
      .filter(({ item }) => item.direction === direction)
      .sort(
        (left, right) =>
          right.adjustedWeight - left.adjustedWeight || left.item.id.localeCompare(right.item.id),
      )
      .slice(0, 3)
      .map(({ item }) => item.id);

  const limitations: string[] = [
    'Evidence scores are deterministic qualitative weights, not calibrated probabilities.',
  ];
  if (unavailableScore > 0) limitations.push('Unavailable evidence reduces sufficiency.');
  if (included.some(({ item }) => item.qualityStatus !== 'valid')) {
    limitations.push('Quality multipliers reduce the influence of non-valid evidence.');
  }
  if (contradictingScore > 0) {
    limitations.push('Contradictory evidence remains included and visible.');
  }

  return {
    supportingScore,
    contradictingScore,
    neutralScore,
    unavailableScore,
    netEvidenceScore,
    evidenceBalance:
      included.length === 0 || (supportingScore === 0 && contradictingScore === 0)
        ? 'none'
        : Math.abs(netEvidenceScore) < 0.05
          ? 'balanced'
          : netEvidenceScore > 0
            ? 'supporting'
            : 'contradicting',
    strongestSupportingEvidenceIds: byInfluence('supports'),
    strongestContradictingEvidenceIds: byInfluence('contradicts'),
    excludedEvidenceIds,
    exclusionReasons,
    qualityAdjustment: round(
      included.reduce((sum, item) => sum + item.adjustedWeight, 0) / denominator,
    ),
    limitations,
  };
};
