import type { RecoveryKpi } from '../contracts/presentationModels';
import { formatEnergy } from '../formatters/energyFormatter';
import { formatNumber, unavailableNumber } from '../formatters/numberFormatter';
import { formatPercentage } from '../formatters/percentageFormatter';
import { presentClimateImpact } from './climateImpactPresenter';
import { presentRecoveryOpportunity } from './executiveSummaryPresenter';
import { disclosureFor, text, type PresenterContext } from './presenterContext';
import { presentStatus } from './statusPresenter';

export const presentKpis = (context: PresenterContext): RecoveryKpi[] => {
  const common = {
    locale: context.locale,
    precision: context.configuration.decimalPrecision,
    compactThreshold: context.configuration.compactNumberThreshold,
    datasetReality: 'synthetic' as const,
    disclosure: disclosureFor(context),
  };
  const energyLoss = context.assessment.energyLoss.energyLossKwh;
  const recovery = presentRecoveryOpportunity(context);
  const climate = presentClimateImpact(context);
  const actions = context.assessment.lossAssessments.flatMap(
    (item) => item.recommendations.recommendedActions,
  );
  const kpis: RecoveryKpi[] = [
    {
      id: 'estimatedEnergyLoss',
      labelKey: 'kpi.estimatedEnergyLoss',
      shortLabelKey: 'short.energyLoss',
      value: formatEnergy(energyLoss, context.configuration.energyDisplayUnit, {
        ...common,
        origin: context.assessment.energyLoss.origin,
        isEstimate: true,
        limitations: context.assessment.energyLoss.limitations,
      }),
      category: 'energy',
      status: presentStatus(context.assessment.energyLoss.status),
      prominence: 'secondary',
      explanation: 'Estimated loss from the deterministic CR-02 method; it is not measured recovery.',
      sourceReferences: [context.caseData.losses[0].id, context.assessment.assessmentId],
      limitations: [...context.assessment.energyLoss.limitations],
    },
    {
      id: 'estimatedRecoverableEnergy',
      labelKey: 'kpi.estimatedRecoverableEnergy',
      shortLabelKey: 'short.recovery',
      value: recovery.estimatedEnergy,
      category: 'energy',
      status: recovery.status,
      prominence: 'primary',
      explanation: 'Projected scenario difference under a configurable synthetic recovery assumption.',
      sourceReferences: [context.caseData.losses[0].id, context.assessment.assessmentId],
      limitations: [...recovery.limitations],
    },
    {
      id: 'estimatedAvoidedEmissions',
      labelKey: 'kpi.estimatedAvoidedEmissions',
      shortLabelKey: 'short.climate',
      value: climate.estimatedAvoidedEmissions,
      category: 'climate',
      status: climate.status,
      prominence: 'primary',
      explanation: 'Counterfactual estimate using a fictional configurable factor; it is not verified impact.',
      sourceReferences: [
        context.assessment.assessmentId,
        ...(context.assessment.climateImpact.emissionFactorId
          ? [context.assessment.climateImpact.emissionFactorId]
          : []),
      ],
      limitations: [...climate.limitations, ...climate.blockingReasons],
    },
    {
      id: 'priorityScore',
      labelKey: 'kpi.priorityScore',
      shortLabelKey: 'short.priority',
      value: formatNumber(context.assessment.priority.score, {
        ...common,
        origin: 'derived',
        limitations: context.assessment.priority.limitations,
      }),
      category: 'priority',
      status: presentStatus(context.assessment.priority.band),
      prominence: 'primary',
      explanation: `Priority band: ${context.assessment.priority.band}. This score is not a probability or command.`,
      sourceReferences: [context.assessment.assessmentId, ...context.caseData.losses.map((item) => item.id)],
      limitations: [...context.assessment.priority.limitations],
    },
    {
      id: 'confidence',
      labelKey: 'kpi.confidence',
      shortLabelKey: 'short.confidence',
      value: {
        ...formatPercentage(context.assessment.recoverability.confidenceScore, {
          ...common,
          origin: 'derived',
          limitations: [text(context, 'confidence.explanation')],
        }),
        confidenceLevel: context.assessment.recoverability.confidenceLevel,
      },
      category: 'confidence',
      status: presentStatus(context.assessment.recoverability.confidenceLevel),
      prominence: 'secondary',
      explanation: text(context, 'confidence.explanation'),
      sourceReferences: [context.assessment.assessmentId],
      limitations: [text(context, 'confidence.explanation')],
    },
    {
      id: 'dataSufficiency',
      labelKey: 'kpi.dataSufficiency',
      shortLabelKey: 'short.sufficiency',
      value: {
        value: context.assessment.dataSufficiency.status,
        formattedValue: context.assessment.dataSufficiency.status,
        availability: context.assessment.dataSufficiency.status === 'insufficient' ? 'unavailable' : 'available',
        origin: 'derived',
        datasetReality: 'synthetic',
        isEstimate: false,
        isProjection: false,
        isSynthetic: true,
        disclosure: disclosureFor(context),
        limitations: [...context.assessment.dataSufficiency.blockingReasons],
      },
      category: 'data-quality',
      status: presentStatus(context.assessment.dataSufficiency.status),
      prominence: 'secondary',
      explanation: 'Data sufficiency reflects availability, quality, age, and category-specific evidence requirements.',
      sourceReferences: context.caseData.losses[0].evidenceIds,
      limitations: [...context.assessment.dataSufficiency.blockingReasons],
    },
    {
      id: 'recommendedActionCount',
      labelKey: 'kpi.recommendedActionCount',
      shortLabelKey: 'short.actions',
      value: formatNumber(actions.length, {
        ...common,
        origin: 'derived',
      }),
      category: 'operational',
      status: presentStatus(actions.length > 0 ? 'informational' : 'neutral'),
      prominence: 'contextual',
      explanation: 'Count of deterministic, non-binding actions currently presented for human review.',
      sourceReferences: actions.map((item) => item.id),
      limitations: ['Actions are advisory and do not authorize dispatch or equipment operation.'],
    },
    {
      id: 'humanReviewStatus',
      labelKey: 'kpi.humanReviewStatus',
      shortLabelKey: 'short.review',
      value: {
        value: context.caseData.humanReviewStatus,
        formattedValue: context.caseData.humanReviewStatus,
        availability: 'pending-review',
        origin: 'manually-entered',
        datasetReality: 'synthetic',
        isEstimate: false,
        isProjection: false,
        isSynthetic: true,
        disclosure: disclosureFor(context),
        limitations: ['The operator retains final decision authority.'],
      },
      category: 'review',
      status: presentStatus(context.caseData.humanReviewStatus),
      prominence: 'contextual',
      explanation: text(context, 'review.required'),
      sourceReferences: [context.caseData.id],
      limitations: ['No application operation changes review state.'],
    },
  ];
  if (context.configuration.showUnavailableKpis) return kpis;
  return kpis.filter((item) => item.value.availability !== 'unavailable' && item.value.availability !== 'blocked');
};
