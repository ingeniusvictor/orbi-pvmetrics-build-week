import type { ScenarioPresentation } from '../contracts/presentationModels';
import { formatEnergy } from '../formatters/energyFormatter';
import type { PresenterContext } from './presenterContext';
import { disclosureFor, text } from './presenterContext';

export const presentScenarios = (context: PresenterContext): ScenarioPresentation[] =>
  context.assessment.lossAssessments.flatMap((lossAssessment) =>
    lossAssessment.scenarios.map((scenario, index) => {
      const common = {
        locale: context.locale,
        precision: context.configuration.decimalPrecision,
        compactThreshold: context.configuration.compactNumberThreshold,
        origin: 'projected' as const,
        datasetReality: 'synthetic' as const,
        isEstimate: true,
        isProjection: true,
        disclosure: disclosureFor(context),
        limitations: scenario.limitations,
      };
      const available = scenario.status === 'simulated';
      const energy = (value: number) => {
        const presented = formatEnergy(
          available ? value : undefined,
          context.configuration.energyDisplayUnit,
          common,
        );
        if (!available && scenario.status === 'blocked') {
          presented.availability = 'blocked';
          presented.formattedValue = text(context, 'value.blocked');
        }
        return presented;
      };
      return {
        id: `${lossAssessment.lossId}:${scenario.horizon}:${index + 1}`,
        nameKey: `scenario.${scenario.horizon}`,
        horizon: scenario.horizon,
        noIntervention: energy(scenario.noIntervention.energyLossKwh),
        intervention: energy(scenario.intervention.energyLossKwh),
        recoveredEnergy: energy(scenario.recoveredEnergy.valueKwh),
        assumptions: [...scenario.assumptions],
        limitations: [...scenario.limitations],
        status: scenario.status,
        isSimulated: true,
        isProjection: true,
      };
    }),
  );
