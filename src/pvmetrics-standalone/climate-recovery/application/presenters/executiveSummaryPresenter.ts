import type {
  ExecutiveCaseSummary,
  RecoveryOpportunityPresentation,
} from '../contracts/presentationModels';
import { formatIsoDate } from '../formatters/dateFormatter';
import { formatEnergy } from '../formatters/energyFormatter';
import { formatNumber } from '../formatters/numberFormatter';
import { formatPercentage } from '../formatters/percentageFormatter';
import { presentClimateImpact } from './climateImpactPresenter';
import { disclosureFor, text, type PresenterContext } from './presenterContext';
import { presentStatus } from './statusPresenter';

const hasOverlap = (context: PresenterContext) =>
  context.assessment.doubleCounting.some((item) =>
    ['possible-overlap', 'confirmed-overlap'].includes(item.status),
  );

const recommendedNextStep = (context: PresenterContext): string => {
  if (context.assessment.dataSufficiency.status === 'insufficient') return text(context, 'action.requestMoreData');
  if (context.assessment.recoverability.status === 'non-recoverable') return text(context, 'action.monitorExternal');
  if (hasOverlap(context)) return text(context, 'action.reviewOverlap');
  return text(context, 'action.reviewEvidence');
};

const narrativeKeys = (context: PresenterContext) => {
  if (context.assessment.dataSufficiency.status === 'insufficient') return ['headline.insufficient', 'narrative.insufficient'] as const;
  if (context.assessment.recoverability.status === 'non-recoverable') return ['headline.nonRecoverable', 'narrative.nonRecoverable'] as const;
  if (hasOverlap(context)) return ['headline.overlap', 'narrative.overlap'] as const;
  return ['headline.recoverable', 'narrative.recoverable'] as const;
};

export const presentRecoveryOpportunity = (context: PresenterContext): RecoveryOpportunityPresentation => {
  const scenario = context.assessment.scenarios.find((item) => item.status === 'simulated');
  const available = Boolean(scenario && scenario.recoveredEnergy.valueKwh > 0);
  const estimatedEnergy = formatEnergy(
    available ? scenario?.recoveredEnergy.valueKwh : undefined,
    context.configuration.energyDisplayUnit,
    {
      locale: context.locale,
      precision: context.configuration.decimalPrecision,
      compactThreshold: context.configuration.compactNumberThreshold,
      origin: 'projected',
      datasetReality: 'synthetic',
      isEstimate: true,
      isProjection: true,
      disclosure: disclosureFor(context),
      limitations: scenario?.limitations ?? context.assessment.energyLoss.limitations,
    },
  );
  if (context.assessment.recoverability.status === 'non-recoverable') {
    estimatedEnergy.availability = 'not-applicable';
    estimatedEnergy.formattedValue = text(context, 'value.notApplicable');
  }
  return {
    recoverability: context.assessment.recoverability.status,
    estimatedEnergy,
    horizon: scenario?.horizon,
    recoveryRateAssumption: scenario?.intervention.recoveryRate,
    uncertainty: scenario?.uncertaintyRange,
    status: presentStatus(scenario?.status ?? 'unavailable'),
    methodology: scenario
      ? 'Projected scenario difference under an explicit synthetic recovery-rate assumption.'
      : 'No recovery scenario is available.',
    assumptions: [...(scenario?.assumptions ?? [])],
    limitations: [...(scenario?.limitations ?? context.assessment.energyLoss.limitations)],
    scenarioId: scenario ? `${context.assessment.assessmentId}:${scenario.horizon}` : undefined,
  };
};

export const presentExecutiveSummary = (context: PresenterContext): ExecutiveCaseSummary => {
  const [headlineKey, narrativeKey] = narrativeKeys(context);
  const loss = context.caseData.losses[0];
  const warnings = [
    ...(context.assessment.dataSufficiency.status === 'insufficient'
      ? context.assessment.dataSufficiency.blockingReasons
      : []),
    ...context.assessment.doubleCounting
      .filter((item) => item.status !== 'clear')
      .flatMap((item) => [`${item.status}: ${item.reasons.join(' ')}`]),
    ...context.assessment.climateImpact.blockingReasons,
    ...context.assessment.warnings,
  ];
  return {
    caseId: context.caseData.id,
    plantId: context.caseData.plant.id,
    assetId: context.caseData.asset.id,
    caseTitle: context.demoMetadata.displayName,
    shortDescription: context.caseData.summary,
    currentStatus: context.caseData.status,
    category: loss.category,
    recoverability: context.assessment.recoverability.status,
    priorityBand: context.assessment.priority.band,
    priorityScore: formatNumber(context.assessment.priority.score, {
      locale: context.locale,
      precision: context.configuration.decimalPrecision,
      origin: 'derived',
      datasetReality: 'synthetic',
      disclosure: disclosureFor(context),
      limitations: context.assessment.priority.limitations,
    }),
    confidence: formatPercentage(context.assessment.recoverability.confidenceScore, {
      locale: context.locale,
      precision: context.configuration.decimalPrecision,
      origin: 'derived',
      datasetReality: 'synthetic',
      disclosure: disclosureFor(context),
      limitations: [text(context, 'confidence.explanation')],
    }),
    dataSufficiency: context.assessment.dataSufficiency.status,
    recoveryOpportunity: presentRecoveryOpportunity(context),
    climateImpact: presentClimateImpact(context),
    recommendedNextStep: recommendedNextStep(context),
    humanReviewRequired: context.assessment.requiresHumanReview,
    syntheticDisclosure: disclosureFor(context),
    headline: text(context, headlineKey),
    executiveNarrative: text(context, narrativeKey),
    keyWarnings: [...new Set(warnings)].slice(0, context.configuration.executiveSummaryMaxWarnings),
    lastEvaluatedAt: formatIsoDate(
      context.assessment.evaluatedAt,
      context.locale,
      'UTC',
      disclosureFor(context),
    ),
  };
};
