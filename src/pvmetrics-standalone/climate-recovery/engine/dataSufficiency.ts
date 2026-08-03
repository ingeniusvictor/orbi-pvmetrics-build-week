import type {
  AssessmentConfiguration,
  AssessmentRequestedOperations,
  DataSufficiencyAssessment,
} from '../contracts/assessment';
import type {
  ClimateRecoveryCase,
  EmissionFactor,
  EvidenceItem,
  RecoverableLoss,
} from '../contracts/entities';
import type { DataQualityStatus } from '../types/taxonomy';

const QUALITY_CAPS: Readonly<Partial<Record<DataQualityStatus, number>>> = {
  degraded: 0.59,
  incomplete: 0.39,
  stale: 0.49,
  conflicting: 0.39,
  unavailable: 0.19,
  unknown: 0.39,
};

const unique = (values: string[]): string[] => [...new Set(values)];

const scopedEvidence = (
  caseData: ClimateRecoveryCase,
  loss: RecoverableLoss,
): EvidenceItem[] => {
  const ids = new Set(loss.evidenceIds ?? []);
  return (caseData.evidence ?? []).filter((item) => ids.has(item.id));
};

export const hasIndependentEnergyEvidence = (evidence: EvidenceItem[]): boolean =>
  evidence.some(
    (item) =>
      item.direction === 'supports' &&
      item.qualityStatus === 'valid' &&
      /energy|power|yield|production/i.test(item.metricKey ?? '') &&
      typeof item.observedValue === 'number' &&
      typeof item.expectedValue === 'number',
  );

export const assessDataSufficiency = (input: {
  caseData: ClimateRecoveryCase;
  loss: RecoverableLoss;
  evaluationTimestamp: string;
  emissionFactors: EmissionFactor[];
  configuration: AssessmentConfiguration;
  requestedOperations: AssessmentRequestedOperations;
}): DataSufficiencyAssessment => {
  const { caseData, loss, configuration, requestedOperations } = input;
  const evidence = scopedEvidence(caseData, loss);
  const missingCriticalFields: string[] = [];
  if (!caseData.id?.trim()) missingCriticalFields.push('caseData.id');
  if (!loss.id?.trim()) missingCriticalFields.push('loss.id');
  if (!loss.assetId?.trim()) missingCriticalFields.push('loss.assetId');
  if (!loss.plantId?.trim()) missingCriticalFields.push('loss.plantId');
  if (!loss.analysisWindow?.start) missingCriticalFields.push('loss.analysisWindow.start');
  if (!loss.analysisWindow?.end) missingCriticalFields.push('loss.analysisWindow.end');

  const supporting = evidence.filter((item) => item.direction === 'supports');
  const contradicting = evidence.filter((item) => item.direction === 'contradicts');
  const unavailable = evidence.filter((item) => item.direction === 'unavailable');
  const available = evidence.filter((item) => item.direction !== 'unavailable');
  const supportingWeight = supporting.reduce(
    (total, item) => total + (item.weight ?? configuration.defaultEvidenceWeight),
    0,
  );

  const evaluationMs = Date.parse(input.evaluationTimestamp);
  const staleDataSources: string[] = [];
  const degradedDataSources: string[] = [];
  const conflictingDataSources: string[] = [];
  const qualityStatuses: DataQualityStatus[] = [];
  const warnings: string[] = [];
  const recommendedDataRequests: string[] = [];

  for (const item of evidence) {
    qualityStatuses.push(item.qualityStatus, item.provenance.qualityStatus);
    const sourceId = item.provenance.sourceId || item.id;
    const observedMs = Date.parse(item.provenance.observedAt);
    const ageMinutes = (evaluationMs - observedMs) / 60_000;
    if (
      item.qualityStatus === 'stale' ||
      item.provenance.qualityStatus === 'stale' ||
      (Number.isFinite(ageMinutes) && ageMinutes > configuration.maximumAllowedDataAgeMinutes)
    ) {
      staleDataSources.push(sourceId);
    }
    if (Number.isFinite(ageMinutes) && ageMinutes < 0) {
      conflictingDataSources.push(sourceId);
      warnings.push(`Evidence ${item.id} is timestamped after evaluationTimestamp.`);
    }
    if (['degraded', 'incomplete', 'unknown'].includes(item.qualityStatus)) {
      degradedDataSources.push(sourceId);
    }
    if (
      item.qualityStatus === 'conflicting' ||
      item.provenance.qualityStatus === 'conflicting'
    ) {
      conflictingDataSources.push(sourceId);
    }
    if (!item.provenance.traceId?.trim()) {
      missingCriticalFields.push(`evidence.${item.id}.provenance.traceId`);
    }
  }

  const blockingReasons: string[] = [];
  if (evidence.length < configuration.minimumEvidenceCount) {
    blockingReasons.push(
      `At least ${configuration.minimumEvidenceCount} evidence item(s) are required.`,
    );
    recommendedDataRequests.push('Provide additional traceable evidence.');
  }
  if (supporting.length === 0) {
    blockingReasons.push('No supporting evidence is available.');
    recommendedDataRequests.push('Provide at least one supporting observation.');
  }
  if (supportingWeight < configuration.minimumSupportingEvidenceWeight) {
    blockingReasons.push('Supporting evidence does not meet the configured weight threshold.');
  }
  if (unavailable.length > 0) {
    warnings.push('Unavailable evidence reduces data sufficiency.');
    recommendedDataRequests.push(...unavailable.map((item) => `Resolve unavailable evidence ${item.id}.`));
  }
  if (contradicting.length > 0) {
    warnings.push('Contradictory evidence remains visible and limits confidence.');
  }
  if (staleDataSources.length > 0) {
    warnings.push('One or more data sources exceed the configured age limit.');
    recommendedDataRequests.push('Refresh stale data sources.');
  }
  if (degradedDataSources.length > 0) {
    warnings.push('Degraded or incomplete sources limit confidence.');
  }
  if (conflictingDataSources.length > 0) {
    warnings.push('Conflicting sources require human review.');
    recommendedDataRequests.push('Reconcile conflicting source values and timestamps.');
  }

  const independentEnergy = hasIndependentEnergyEvidence(evidence);
  if (loss.category === 'communications' && !independentEnergy) {
    blockingReasons.push('Communications evidence alone cannot demonstrate energy loss.');
    recommendedDataRequests.push('Provide an independent energy or power comparison.');
  }
  if (loss.category === 'sensor-quality') {
    blockingReasons.push('Sensor-quality evidence cannot support a reliable energy estimate yet.');
    recommendedDataRequests.push('Validate the sensor against an independent reference.');
  }
  if (loss.category === 'unknown') {
    blockingReasons.push('Unknown loss category requires additional attribution data.');
    recommendedDataRequests.push('Provide evidence sufficient to classify the loss category.');
  }
  if (loss.category === 'clipping' && !evidence.some((item) => /design|rated|nameplate|dc.?ac/i.test(`${item.metricKey ?? ''} ${item.description}`))) {
    warnings.push('Clipping lacks design-limit context and is not treated as a failure.');
    recommendedDataRequests.push('Provide inverter and plant design-limit information.');
  }
  if (!loss.analysisWindow?.start || !loss.analysisWindow?.end) {
    blockingReasons.push('A valid analysis window is required.');
  }
  const hasExpectedValue = evidence.some((item) => item.expectedValue !== undefined) ||
    loss.estimatedEnergyLossKwh !== undefined ||
    loss.estimatedPowerLossKw !== undefined;
  if (!hasExpectedValue && requestedOperations.assessEnergyLoss !== false) {
    blockingReasons.push('No expected, peer, power-loss, or energy-loss input is available.');
    recommendedDataRequests.push('Provide expected and actual energy, power-duration, or peer inputs.');
  }

  if (requestedOperations.estimateClimateImpact !== false) {
    const factorId = requestedOperations.emissionFactorId;
    const factorAvailable = factorId
      ? input.emissionFactors.some((factor) => factor.id === factorId)
      : input.emissionFactors.length > 0;
    if (!factorAvailable && configuration.requireEmissionFactorForClimateImpact) {
      warnings.push('Climate impact is unavailable without a requested emission factor.');
      recommendedDataRequests.push('Provide a valid, traceable emission factor.');
    }
  }

  let confidenceCap: number | undefined;
  for (const status of qualityStatuses) {
    const cap = QUALITY_CAPS[status];
    if (cap !== undefined) confidenceCap = Math.min(confidenceCap ?? 1, cap);
  }
  if (staleDataSources.length > 0) confidenceCap = Math.min(confidenceCap ?? 1, 0.49);
  if (contradicting.length > 0) confidenceCap = Math.min(confidenceCap ?? 1, 0.59);
  if (conflictingDataSources.length > 0) confidenceCap = Math.min(confidenceCap ?? 1, 0.39);

  const invalid = missingCriticalFields.length > 0;
  const insufficient = blockingReasons.length > 0;
  const partial =
    warnings.length > 0 ||
    staleDataSources.length > 0 ||
    degradedDataSources.length > 0 ||
    conflictingDataSources.length > 0;

  return {
    status: invalid
      ? 'invalid'
      : insufficient
        ? 'insufficient'
        : partial
          ? 'partially-sufficient'
          : 'sufficient',
    availableEvidenceCount: available.length,
    supportingEvidenceCount: supporting.length,
    contradictingEvidenceCount: contradicting.length,
    unavailableEvidenceCount: unavailable.length,
    missingCriticalFields: unique(missingCriticalFields),
    staleDataSources: unique(staleDataSources),
    degradedDataSources: unique(degradedDataSources),
    conflictingDataSources: unique(conflictingDataSources),
    blockingReasons: unique(blockingReasons),
    warnings: unique(warnings),
    requiresMoreData: invalid || insufficient || partial,
    recommendedDataRequests: unique(recommendedDataRequests),
    ...(confidenceCap !== undefined ? { confidenceCap } : {}),
  };
};
