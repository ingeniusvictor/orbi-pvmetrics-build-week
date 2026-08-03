import type { ClimateImpactPresentation, PresentationAvailability } from '../contracts/presentationModels';
import { formatEmissions } from '../formatters/emissionsFormatter';
import { formatNumber, unavailableNumber } from '../formatters/numberFormatter';
import { disclosureFor, text, type PresenterContext } from './presenterContext';
import { presentStatus } from './statusPresenter';

export const presentClimateImpact = (context: PresenterContext): ClimateImpactPresentation => {
  const { assessment, caseData, configuration, locale } = context;
  const impact = assessment.climateImpact;
  const factor = caseData.emissionFactors.find((item) => item.id === impact.emissionFactorId);
  const availability: PresentationAvailability = ['estimated', 'projected'].includes(impact.status)
    && impact.avoidedEmissionsKgCO2e !== undefined
    ? 'available'
    : impact.status === 'blocked' || impact.status === 'invalid'
      ? 'blocked'
      : 'unavailable';
  const common = {
    locale,
    precision: configuration.decimalPrecision,
    compactThreshold: configuration.compactNumberThreshold,
    origin: 'estimated' as const,
    datasetReality: 'synthetic' as const,
    isEstimate: true,
    disclosure: disclosureFor(context),
    limitations: impact.limitations,
  };
  const estimatedAvoidedEmissions = availability === 'available'
    ? formatEmissions(impact.avoidedEmissionsKgCO2e, configuration.emissionsDisplayUnit, {
        ...common,
        isProjection: impact.status === 'projected',
      })
    : unavailableNumber(
        availability === 'blocked' ? text(context, 'value.blocked') : text(context, 'value.unavailable'),
        { ...common, unit: configuration.emissionsDisplayUnit },
        availability === 'blocked' ? 'blocked' : 'unavailable',
      );
  const emissionFactor = factor
    ? formatNumber(factor.value, {
        locale,
        precision: configuration.decimalPrecision,
        unit: factor.unit,
        origin: factor.origin,
        datasetReality: factor.datasetReality,
        disclosure: disclosureFor(context),
        limitations: factor.limitations,
      })
    : unavailableNumber(
        text(context, availability === 'blocked' ? 'value.blocked' : 'value.unavailable'),
        {
          locale,
          precision: configuration.decimalPrecision,
          unit: 'kgCO2e-per-kWh',
          origin: 'estimated',
          datasetReality: 'synthetic',
          disclosure: disclosureFor(context),
          limitations: ['No valid emission factor is available for presentation.'],
        },
        availability === 'blocked' ? 'blocked' : 'unavailable',
      );
  return {
    availability,
    estimatedAvoidedEmissions,
    emissionFactor,
    factorRegion: factor?.region,
    factorYear: factor?.year,
    methodology: impact.methodology ?? 'No climate calculation was performed.',
    status: presentStatus(impact.status),
    isCounterfactualEstimate: true,
    isVerified: false,
    syntheticDisclosure: disclosureFor(context),
    assumptions: [...impact.assumptions],
    limitations: [...impact.limitations],
    blockingReasons: [...impact.blockingReasons],
  };
};
