import type {
  AssessmentConfiguration,
  AssessmentRequestedOperations,
  DataSufficiencyAssessment,
  EnergyLossAssessment,
} from '../contracts/assessment';
import type { EvidenceItem, RecoverableLoss } from '../contracts/entities';

const finiteNonNegative = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const unavailable = (limitations: string[], status: 'unavailable' | 'invalid' = 'unavailable'): EnergyLossAssessment => ({
  method: 'unavailable',
  origin: 'estimated',
  assumptions: [],
  limitations,
  calculationTrace: ['No energy-loss calculation was performed.'],
  status,
});

export const assessEnergyLoss = (input: {
  loss: RecoverableLoss;
  evidence: EvidenceItem[];
  dataSufficiency: DataSufficiencyAssessment;
  configuration: AssessmentConfiguration;
  requestedOperations: AssessmentRequestedOperations;
}): EnergyLossAssessment => {
  const { loss, dataSufficiency, configuration, requestedOperations } = input;
  if (requestedOperations.assessEnergyLoss === false) {
    return unavailable(['Energy-loss assessment was not requested.']);
  }
  if (dataSufficiency.status === 'invalid') {
    return unavailable(['Invalid critical data blocks energy-loss assessment.'], 'invalid');
  }
  if (dataSufficiency.status === 'insufficient') {
    return unavailable([
      'Insufficient data blocks energy-loss assessment.',
      ...dataSufficiency.blockingReasons,
    ]);
  }
  if (['communications', 'sensor-quality', 'unknown'].includes(loss.category)) {
    return unavailable([`${loss.category} does not independently demonstrate energy loss.`]);
  }

  const values = requestedOperations.energyLossInputs ?? {};
  let method = configuration.energyLossMethod;
  if (method === 'auto') {
    if (finiteNonNegative(values.expectedEnergyKwh) && finiteNonNegative(values.actualEnergyKwh)) {
      method = 'direct-difference';
    } else if (
      finiteNonNegative(values.estimatedPowerLossKw ?? loss.estimatedPowerLossKw) &&
      finiteNonNegative(values.durationHours)
    ) {
      method = 'power-duration';
    } else if (
      finiteNonNegative(values.peerExpectedEnergyKwh) &&
      finiteNonNegative(values.actualComparableEnergyKwh)
    ) {
      method = 'peer-comparison';
    } else if (finiteNonNegative(loss.estimatedPowerLossKw)) {
      method = 'power-duration';
    } else if (finiteNonNegative(loss.estimatedEnergyLossKwh)) {
      method = 'peer-comparison';
    } else {
      method = 'unavailable';
    }
  }

  let energyLossKwh: number | undefined;
  let powerLossKw: number | undefined;
  const calculationTrace: string[] = [];
  const assumptions: string[] = [];
  if (method === 'direct-difference') {
    if (!finiteNonNegative(values.expectedEnergyKwh) || !finiteNonNegative(values.actualEnergyKwh)) {
      return unavailable(['direct-difference requires finite non-negative expectedEnergyKwh and actualEnergyKwh.'], 'invalid');
    }
    energyLossKwh = Math.max(0, values.expectedEnergyKwh - values.actualEnergyKwh);
    calculationTrace.push(`max(0, ${values.expectedEnergyKwh} kWh - ${values.actualEnergyKwh} kWh) = ${energyLossKwh} kWh.`);
  } else if (method === 'power-duration') {
    powerLossKw = values.estimatedPowerLossKw ?? loss.estimatedPowerLossKw;
    let durationHours = values.durationHours;
    if (durationHours === undefined) {
      durationHours =
        (Date.parse(loss.analysisWindow.end) - Date.parse(loss.analysisWindow.start)) / 3_600_000;
      assumptions.push('Duration is derived from the case analysis window.');
    }
    if (!finiteNonNegative(powerLossKw) || !finiteNonNegative(durationHours)) {
      return unavailable(['power-duration requires finite non-negative power and duration inputs.'], 'invalid');
    }
    energyLossKwh = powerLossKw * durationHours;
    calculationTrace.push(`${powerLossKw} kW × ${durationHours} h = ${energyLossKwh} kWh.`);
  } else if (method === 'peer-comparison') {
    if (finiteNonNegative(values.peerExpectedEnergyKwh) && finiteNonNegative(values.actualComparableEnergyKwh)) {
      energyLossKwh = Math.max(0, values.peerExpectedEnergyKwh - values.actualComparableEnergyKwh);
      calculationTrace.push(`max(0, peer ${values.peerExpectedEnergyKwh} kWh - actual ${values.actualComparableEnergyKwh} kWh) = ${energyLossKwh} kWh.`);
    } else if (finiteNonNegative(loss.estimatedEnergyLossKwh)) {
      energyLossKwh = loss.estimatedEnergyLossKwh;
      assumptions.push('The typed case estimate is retained as the peer-comparison input.');
      calculationTrace.push(`Typed case estimate ${energyLossKwh} kWh retained without reclassification as measurement.`);
    } else {
      return unavailable(['peer-comparison requires valid peer and actual inputs.'], 'invalid');
    }
  } else {
    return unavailable(['No permitted energy-loss method has valid inputs.']);
  }

  const fraction =
    dataSufficiency.status === 'sufficient' && dataSufficiency.confidenceCap === undefined
      ? configuration.uncertaintyPolicy.highQualityFraction
      : dataSufficiency.confidenceCap !== undefined && dataSufficiency.confidenceCap <= 0.39
        ? configuration.uncertaintyPolicy.degradedQualityFraction
        : configuration.uncertaintyPolicy.mediumQualityFraction;
  const dailyEnergyLossKwh = finiteNonNegative(loss.estimatedDailyEnergyLossKwh)
    ? loss.estimatedDailyEnergyLossKwh
    : energyLossKwh;
  const lowerBound = Math.max(0, energyLossKwh * (1 - fraction));
  const upperBound = energyLossKwh * (1 + fraction);
  return {
    method,
    ...(powerLossKw !== undefined ? { powerLossKw } : {}),
    energyLossKwh,
    dailyEnergyLossKwh,
    uncertaintyRange: {
      lowerBound,
      centralEstimate: energyLossKwh,
      upperBound,
      unit: 'kWh',
      confidenceDescriptor: `Internal demonstrative ±${fraction * 100}% convention`,
      methodology: 'Configured deterministic uncertainty convention; not scientifically calibrated.',
    },
    origin: 'estimated',
    assumptions: [...loss.assumptions, ...assumptions],
    limitations: [
      ...loss.limitations,
      'This value is an estimate, not a measurement or verified recovery.',
      'No real meteorological normalization is applied.',
    ],
    calculationTrace,
    status: dataSufficiency.status === 'partially-sufficient' ? 'partially-calculated' : 'calculated',
  };
};
