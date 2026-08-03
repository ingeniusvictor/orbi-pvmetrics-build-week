import type {
  AssessmentConfiguration,
  AssessmentRequestedOperations,
  ClimateImpactAssessment,
  DataSufficiencyAssessment,
  RecoveryScenarioAssessment,
} from '../contracts/assessment';
import type { EmissionFactor } from '../contracts/entities';
import type { DoubleCountingAssessment } from '../utils/doubleCounting';
import { validateEmissionFactor } from '../validation/impact';

export const normalizeEmissionFactorToKgPerKwh = (
  factor: Pick<EmissionFactor, 'value' | 'unit'>,
): number => {
  // 1 tCO2e/MWh equals 1 kgCO2e/kWh, so both supported units share the numeric value.
  return factor.value;
};

export const assessClimateImpact = (input: {
  scenarios: RecoveryScenarioAssessment[];
  factors: EmissionFactor[];
  configuration: AssessmentConfiguration;
  requestedOperations: AssessmentRequestedOperations;
  dataSufficiency: DataSufficiencyAssessment;
  evaluationTimestamp: string;
  datasetReality: string;
  relatedDoubleCounting: DoubleCountingAssessment[];
}): ClimateImpactAssessment => {
  const base = {
    blockingReasons: [] as string[],
    assumptions: [] as string[],
    limitations: [
      'Avoided emissions are a counterfactual estimate, not a measured or certified outcome.',
    ],
    trace: [] as string[],
  };
  if (input.requestedOperations.estimateClimateImpact === false) {
    return { status: 'not-requested', ...base };
  }
  if (!input.configuration.allowClimateImpactEstimate) {
    return {
      status: 'blocked',
      ...base,
      blockingReasons: ['Climate-impact estimation is disabled by configuration.'],
    };
  }
  if (input.dataSufficiency.status === 'insufficient' || input.dataSufficiency.status === 'invalid') {
    return {
      status: 'blocked',
      ...base,
      blockingReasons: ['Insufficient or invalid data blocks climate-impact estimation.'],
    };
  }
  const confirmedOverlap = input.relatedDoubleCounting.some(
    (assessment) => assessment.status === 'confirmed-overlap',
  );
  const possibleOverlap = input.relatedDoubleCounting.some(
    (assessment) => assessment.status === 'possible-overlap',
  );
  if (
    (confirmedOverlap && input.configuration.doubleCountingPolicy.confirmedOverlap === 'block') ||
    (possibleOverlap && input.configuration.doubleCountingPolicy.possibleOverlap === 'block')
  ) {
    return {
      status: 'blocked',
      ...base,
      blockingReasons: ['Double-counting policy blocks climate aggregation pending human review.'],
    };
  }
  const scenario = input.scenarios.find((item) => item.status === 'simulated');
  if (!scenario || scenario.recoveredEnergy.valueKwh <= 0) {
    return {
      status: 'unavailable',
      ...base,
      blockingReasons: ['No valid positive recovered-energy scenario is available.'],
    };
  }
  const factor = input.requestedOperations.emissionFactorId
    ? input.factors.find((item) => item.id === input.requestedOperations.emissionFactorId)
    : input.factors[0];
  if (!factor) {
    return {
      status: input.configuration.requireEmissionFactorForClimateImpact ? 'blocked' : 'unavailable',
      ...base,
      blockingReasons: ['A valid, traceable emission factor is required.'],
    };
  }
  const factorValidation = validateEmissionFactor(factor);
  if (!factorValidation.valid || !factor.sourceName.trim() || !factor.methodology.trim()) {
    return {
      status: 'invalid',
      ...base,
      emissionFactorId: factor.id,
      blockingReasons: [
        'The selected emission factor is invalid.',
        ...factorValidation.errors.map((issue) => issue.message),
      ],
    };
  }
  const evaluatedMs = Date.parse(input.evaluationTimestamp);
  if (
    evaluatedMs < Date.parse(factor.validFrom) ||
    (factor.validTo !== undefined && evaluatedMs > Date.parse(factor.validTo))
  ) {
    return {
      status: 'blocked',
      ...base,
      emissionFactorId: factor.id,
      blockingReasons: ['The emission factor is not valid at evaluationTimestamp.'],
    };
  }
  if (input.datasetReality === 'synthetic' && !input.configuration.allowSyntheticProjection) {
    return {
      status: 'blocked',
      ...base,
      emissionFactorId: factor.id,
      blockingReasons: ['Synthetic climate projection is disabled by configuration.'],
    };
  }

  const normalizedFactor = normalizeEmissionFactorToKgPerKwh(factor);
  const recoveredEnergyKwh = scenario.recoveredEnergy.valueKwh;
  const avoidedEmissionsKgCO2e = recoveredEnergyKwh * normalizedFactor;
  const provisionalLimitation = possibleOverlap
    ? ['Possible overlap prevents automatic aggregation; the individual estimate is provisional.']
    : [];
  return {
    status: 'estimated',
    emissionFactorId: factor.id,
    recoveredEnergyKwh,
    avoidedEmissionsKgCO2e,
    uncertaintyRange: {
      lowerBound: scenario.uncertaintyRange.lowerBound * normalizedFactor,
      centralEstimate: avoidedEmissionsKgCO2e,
      upperBound: scenario.uncertaintyRange.upperBound * normalizedFactor,
      unit: 'kgCO2e',
      confidenceDescriptor: scenario.uncertaintyRange.confidenceDescriptor,
      methodology: 'Recovered-energy uncertainty multiplied by the normalized configurable factor.',
    },
    methodology: 'recoveredEnergyKwh × emission factor normalized to kgCO2e/kWh',
    blockingReasons: [],
    assumptions: [
      `Factor ${factor.id} remains applicable at evaluationTimestamp.`,
      ...factor.assumptions,
    ],
    limitations: [
      ...base.limitations,
      ...factor.limitations,
      ...provisionalLimitation,
      'Synthetic results can only be estimated or projected and can never be verified.',
    ],
    trace: [
      `${factor.value} ${factor.unit} normalized to ${normalizedFactor} kgCO2e/kWh.`,
      `${recoveredEnergyKwh} kWh × ${normalizedFactor} kgCO2e/kWh = ${avoidedEmissionsKgCO2e} kgCO2e.`,
    ],
  };
};
