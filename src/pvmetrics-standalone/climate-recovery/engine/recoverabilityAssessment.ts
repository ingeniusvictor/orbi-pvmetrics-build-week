import type {
  AssessmentConfiguration,
  DataSufficiencyAssessment,
  EvidenceAssessment,
  RecoverabilityAssessment,
} from '../contracts/assessment';
import type { EvidenceItem, RecoverableLoss } from '../contracts/entities';
import type { RecoverabilityStatus } from '../types/taxonomy';
import { deriveConfiguredConfidenceLevel } from './configuration';

export const assessRecoverability = (input: {
  loss: RecoverableLoss;
  evidence: EvidenceItem[];
  dataSufficiency: DataSufficiencyAssessment;
  evidenceAssessment: EvidenceAssessment;
  configuration: AssessmentConfiguration;
}): RecoverabilityAssessment => {
  const { loss, evidence, dataSufficiency, evidenceAssessment } = input;
  const reasons: string[] = [];
  const exclusions = [...(loss.exclusions ?? [])];
  const blockingConditions = [...dataSufficiency.blockingReasons];
  let status: RecoverabilityStatus = 'not-assessed';
  let recommendedTreatment: RecoverabilityAssessment['recommendedTreatment'] = 'not-assessed';

  switch (loss.category) {
    case 'grid-curtailment':
      status = 'non-recoverable';
      recommendedTreatment = 'no-asset-maintenance';
      reasons.push('External grid curtailment is non-recoverable through asset maintenance.');
      exclusions.push('Default field maintenance intervention is excluded.');
      break;
    case 'communications':
      status = 'indeterminate';
      recommendedTreatment = 'request-more-data';
      reasons.push('Communications loss affects observability and is not independent proof of energy loss.');
      break;
    case 'sensor-quality':
      status = 'indeterminate';
      recommendedTreatment = 'request-more-data';
      reasons.push('Sensor quality can invalidate expected/actual comparisons.');
      break;
    case 'soiling':
      status = dataSufficiency.status === 'insufficient' ? 'indeterminate' : 'recoverable';
      recommendedTreatment = status === 'recoverable' ? 'evaluate-intervention' : 'request-more-data';
      reasons.push('Soiling may be recoverable after a cleaning assessment and human approval.');
      break;
    case 'inverter':
    case 'mppt-or-string':
      status =
        dataSufficiency.status === 'insufficient'
          ? 'indeterminate'
          : evidenceAssessment.contradictingScore > 0
            ? 'partially-recoverable'
            : 'recoverable';
      recommendedTreatment =
        status === 'recoverable'
          ? 'evaluate-intervention'
          : status === 'partially-recoverable'
            ? 'evaluate-partial-intervention'
            : 'request-more-data';
      reasons.push('Inverter and MPPT limitations can be recoverable, subject to remote review first.');
      break;
    case 'thermal-derating': {
      const expectedThermal = evidence.some((item) =>
        /expected|design|ambient/i.test(`${item.metricKey ?? ''} ${item.description}`),
      );
      status = expectedThermal ? 'non-recoverable' : 'partially-recoverable';
      recommendedTreatment = expectedThermal
        ? 'no-asset-maintenance'
        : 'evaluate-partial-intervention';
      reasons.push(
        expectedThermal
          ? 'Evidence indicates expected thermal behavior rather than an asset fault.'
          : 'Thermal derating may be partially recoverable but environmental effects remain.',
      );
      break;
    }
    case 'clipping': {
      const hasDesignContext = evidence.some((item) =>
        /design|rated|nameplate|dc.?ac/i.test(`${item.metricKey ?? ''} ${item.description}`),
      );
      status = hasDesignContext ? 'non-recoverable' : 'indeterminate';
      recommendedTreatment = hasDesignContext ? 'no-asset-maintenance' : 'request-more-data';
      reasons.push(
        hasDesignContext
          ? 'Design-context clipping is not classified as an equipment failure.'
          : 'Clipping requires design-limit context before recoverability can be assessed.',
      );
      break;
    }
    case 'bess-operation':
      status = 'indeterminate';
      recommendedTreatment = 'request-more-data';
      reasons.push('A different BESS strategy is not assumed to be an operational error.');
      blockingConditions.push('BESS operating strategy context is required.');
      break;
    case 'unknown':
      status = 'indeterminate';
      recommendedTreatment = 'request-more-data';
      reasons.push('Unknown categories require more evidence before intervention assessment.');
      break;
    default:
      status =
        dataSufficiency.status === 'insufficient'
          ? 'indeterminate'
          : loss.recoverabilityStatus === 'not-assessed'
            ? 'partially-recoverable'
            : loss.recoverabilityStatus;
      recommendedTreatment =
        status === 'recoverable'
          ? 'evaluate-intervention'
          : status === 'partially-recoverable'
            ? 'evaluate-partial-intervention'
            : status === 'non-recoverable'
              ? 'monitor-or-escalate'
              : 'request-more-data';
      reasons.push('Recoverability is conservatively derived from the typed loss and current evidence.');
  }

  let confidenceScore = Math.max(0, Math.min(1, (evidenceAssessment.netEvidenceScore + 1) / 2));
  if (status === 'indeterminate') confidenceScore = Math.min(confidenceScore, 0.39);
  if (dataSufficiency.confidenceCap !== undefined) {
    confidenceScore = Math.min(confidenceScore, dataSufficiency.confidenceCap);
  }
  confidenceScore = Math.round(confidenceScore * 100) / 100;

  return {
    status,
    score:
      status === 'recoverable'
        ? 1
        : status === 'partially-recoverable'
          ? 0.5
          : status === 'non-recoverable'
            ? 0
            : undefined,
    reasons,
    exclusions: [...new Set(exclusions)],
    blockingConditions: [...new Set(blockingConditions)],
    requiresHumanReview: true,
    confidenceLevel: deriveConfiguredConfidenceLevel(confidenceScore, input.configuration),
    confidenceScore,
    recommendedTreatment,
  };
};
