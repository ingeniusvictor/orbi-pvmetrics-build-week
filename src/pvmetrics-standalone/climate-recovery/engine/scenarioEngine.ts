import type {
  AssessmentConfiguration,
  AssessmentRequestedOperations,
  EnergyLossAssessment,
  RecoverabilityAssessment,
  RecoveryScenarioAssessment,
} from '../contracts/assessment';
import type { RecoveryHorizon } from '../types/taxonomy';

const horizonDays = (
  horizon: RecoveryHorizon,
  customHorizonDays?: number,
): number | undefined => {
  switch (horizon) {
    case 'immediate': return 0;
    case 'daily': return 1;
    case 'seven-days': return 7;
    case 'thirty-days': return 30;
    case 'ninety-days': return 90;
    case 'custom': return customHorizonDays;
  }
};

const emptyRange = (methodology: string) => ({
  lowerBound: 0,
  centralEstimate: 0,
  upperBound: 0,
  unit: 'kWh',
  confidenceDescriptor: 'No recovery calculated',
  methodology,
});

export const generateRecoveryScenarios = (input: {
  energyLoss: EnergyLossAssessment;
  recoverability: RecoverabilityAssessment;
  configuration: AssessmentConfiguration;
  requestedOperations: AssessmentRequestedOperations;
  datasetReality: string;
}): RecoveryScenarioAssessment[] => {
  const { energyLoss, recoverability, configuration, requestedOperations } = input;
  if (requestedOperations.generateRecoveryScenarios === false) return [];
  const horizons = requestedOperations.recoveryHorizons ?? configuration.defaultRecoveryHorizons;
  const configuredRate = configuration.recoveryRates[recoverability.status];
  const recoveryRate = requestedOperations.recoveryRate ?? configuredRate;

  return horizons.map((horizon) => {
    const days = horizonDays(horizon, requestedOperations.customHorizonDays);
    if (
      horizon === 'custom' &&
      (!Number.isInteger(days) || (days ?? 0) <= 0)
    ) {
      return {
        noIntervention: { energyLossKwh: 0, origin: 'projected' },
        intervention: { energyLossKwh: 0, recoveryRate: 0, origin: 'projected' },
        recoveredEnergy: { valueKwh: 0, origin: 'projected' },
        uncertaintyRange: emptyRange('Invalid custom horizon.'),
        horizon,
        assumptions: [],
        limitations: ['A custom horizon requires a positive whole number of days.'],
        status: 'invalid',
      };
    }
    if (recoveryRate !== null && (!Number.isFinite(recoveryRate) || recoveryRate < 0 || recoveryRate > 1)) {
      return {
        noIntervention: { energyLossKwh: 0, origin: 'projected' },
        intervention: { energyLossKwh: 0, recoveryRate: 0, origin: 'projected' },
        recoveredEnergy: { valueKwh: 0, origin: 'projected' },
        uncertaintyRange: emptyRange('Invalid recovery rate.'),
        horizon,
        ...(horizon === 'custom' ? { customHorizonDays: days } : {}),
        assumptions: [],
        limitations: ['Recovery rate must be within the inclusive range 0..1.'],
        status: 'invalid',
      };
    }
    if (recoverability.status === 'non-recoverable') {
      return {
        noIntervention: { energyLossKwh: 0, origin: 'projected' },
        intervention: { energyLossKwh: 0, recoveryRate: 0, origin: 'projected' },
        recoveredEnergy: { valueKwh: 0, origin: 'projected' },
        uncertaintyRange: emptyRange('Recovery blocked by non-recoverable classification.'),
        horizon,
        ...(horizon === 'custom' ? { customHorizonDays: days } : {}),
        assumptions: [],
        limitations: ['No recovery scenario is generated for a non-recoverable loss.'],
        status: 'blocked',
      };
    }
    if (recoveryRate === null || ['indeterminate', 'not-assessed'].includes(recoverability.status)) {
      return {
        noIntervention: { energyLossKwh: 0, origin: 'projected' },
        intervention: { energyLossKwh: 0, recoveryRate: 0, origin: 'projected' },
        recoveredEnergy: { valueKwh: 0, origin: 'projected' },
        uncertaintyRange: emptyRange('Recoverability is indeterminate.'),
        horizon,
        ...(horizon === 'custom' ? { customHorizonDays: days } : {}),
        assumptions: [],
        limitations: ['More data and human review are required before scenario generation.'],
        status: 'unavailable',
      };
    }
    if (
      !['calculated', 'partially-calculated'].includes(energyLoss.status) ||
      energyLoss.energyLossKwh === undefined ||
      energyLoss.dailyEnergyLossKwh === undefined ||
      !energyLoss.uncertaintyRange
    ) {
      return {
        noIntervention: { energyLossKwh: 0, origin: 'projected' },
        intervention: { energyLossKwh: 0, recoveryRate, origin: 'projected' },
        recoveredEnergy: { valueKwh: 0, origin: 'projected' },
        uncertaintyRange: emptyRange('Energy-loss estimate is unavailable.'),
        horizon,
        ...(horizon === 'custom' ? { customHorizonDays: days } : {}),
        assumptions: [],
        limitations: ['A valid estimated energy loss is required.'],
        status: 'unavailable',
      };
    }
    if (input.datasetReality === 'synthetic' && !configuration.allowSyntheticProjection) {
      return {
        noIntervention: { energyLossKwh: 0, origin: 'projected' },
        intervention: { energyLossKwh: 0, recoveryRate, origin: 'projected' },
        recoveredEnergy: { valueKwh: 0, origin: 'projected' },
        uncertaintyRange: emptyRange('Synthetic projection disabled by policy.'),
        horizon,
        ...(horizon === 'custom' ? { customHorizonDays: days } : {}),
        assumptions: [],
        limitations: ['Synthetic scenario projection is disabled by configuration.'],
        status: 'blocked',
      };
    }

    const noInterventionEnergy =
      horizon === 'immediate'
        ? energyLoss.energyLossKwh
        : energyLoss.dailyEnergyLossKwh * (days ?? 0);
    const recoveredEnergy = noInterventionEnergy * recoveryRate;
    const interventionEnergy = Math.max(0, noInterventionEnergy - recoveredEnergy);
    const central = energyLoss.uncertaintyRange.centralEstimate;
    const lowerRatio = central === 0 ? 0 : energyLoss.uncertaintyRange.lowerBound / central;
    const upperRatio = central === 0 ? 0 : energyLoss.uncertaintyRange.upperBound / central;
    return {
      noIntervention: { energyLossKwh: noInterventionEnergy, origin: 'projected' },
      intervention: { energyLossKwh: interventionEnergy, recoveryRate, origin: 'projected' },
      recoveredEnergy: { valueKwh: recoveredEnergy, origin: 'projected' },
      uncertaintyRange: {
        lowerBound: recoveredEnergy * lowerRatio,
        centralEstimate: recoveredEnergy,
        upperBound: recoveredEnergy * upperRatio,
        unit: 'kWh',
        confidenceDescriptor: energyLoss.uncertaintyRange.confidenceDescriptor,
        methodology: 'Energy-loss uncertainty propagated linearly through a synthetic recovery-rate assumption.',
      },
      horizon,
      ...(horizon === 'custom' ? { customHorizonDays: days } : {}),
      assumptions: [
        `A synthetic central recovery rate of ${recoveryRate} is held constant over the horizon.`,
        'No-intervention loss persists at the estimated daily rate.',
      ],
      limitations: [
        'This is a deterministic simulation, not a forecast or guaranteed recovery.',
        'The recovery rate is configurable and is not calibrated from operational outcomes.',
      ],
      status: 'simulated',
    };
  });
};
