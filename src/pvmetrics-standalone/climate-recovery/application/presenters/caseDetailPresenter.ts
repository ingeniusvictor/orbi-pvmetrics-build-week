import type {
  AvailableOperation,
  CaseDetailPresentation,
  RecoveryScorePresentation,
} from '../contracts/presentationModels';
import { formatEnergy } from '../formatters/energyFormatter';
import { disclosureFor, type PresenterContext } from './presenterContext';
import { presentClimateImpact } from './climateImpactPresenter';
import { presentExecutiveSummary } from './executiveSummaryPresenter';
import { presentExplainability } from './explainabilityPresenter';
import { presentKpis } from './kpiPresenter';
import { presentRecommendations } from './recommendationPresenter';
import { presentScenarios } from './scenarioPresenter';
import { presentTimeline } from './timelinePresenter';

const presentRecoveryScore = (context: PresenterContext): RecoveryScorePresentation => {
  const normalized = context.assessment.recoverability.score;
  const score = normalized === undefined ? 0 : Math.round(normalized * 100);
  return {
    score,
    band: context.assessment.recoverability.status,
    labelKey: `recoverability.${context.assessment.recoverability.status}`,
    explanation: context.assessment.recoverability.reasons.join(' '),
    components: {
      recoverability: score,
      confidence: Math.round(context.assessment.recoverability.confidenceScore * 100),
      evidenceBalance: Math.round((context.assessment.evidenceAssessment.netEvidenceScore + 1) * 50),
    },
    confidence: context.assessment.recoverability.confidenceLevel,
    isOperational: false,
    isSynthetic: true,
    limitations: [
      ...context.assessment.recoverability.blockingConditions,
      'The recovery score is a deterministic presentation aid, not an operational or calibrated probability.',
    ],
  };
};

const availableOperations = (context: PresenterContext): AvailableOperation[] => {
  const operations: AvailableOperation[] = [
    'request-human-review',
    'inspect-evidence',
    'inspect-methodology',
    'export-summary',
  ];
  if (context.assessment.warnings.length > 0 || context.assessment.doubleCounting.some((item) => item.status !== 'clear')) {
    operations.push('acknowledge-warning');
  }
  if (context.assessment.scenarios.length > 0) operations.push('compare-scenarios');
  if (context.assessment.dataSufficiency.requiresMoreData) operations.push('request-more-data');
  return operations;
};

export const presentCaseDetail = (context: PresenterContext): CaseDetailPresentation => ({
  summary: presentExecutiveSummary(context),
  kpis: presentKpis(context),
  recoveryScore: presentRecoveryScore(context),
  lossOverview: context.assessment.lossAssessments.map((item) => ({
    lossId: item.lossId,
    category: context.caseData.losses.find((loss) => loss.id === item.lossId)?.category ?? 'unknown',
    recoverability: item.recoverability.status,
    energyLoss: formatEnergy(item.energyLoss.energyLossKwh, context.configuration.energyDisplayUnit, {
      locale: context.locale,
      precision: context.configuration.decimalPrecision,
      compactThreshold: context.configuration.compactNumberThreshold,
      origin: item.energyLoss.origin,
      datasetReality: 'synthetic',
      isEstimate: true,
      disclosure: disclosureFor(context),
      limitations: item.energyLoss.limitations,
    }),
  })),
  hypotheses: context.assessment.hypotheses.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    status: item.status,
    confidence: item.confidenceLevel,
    isDiagnosis: false,
    requiresHumanReview: item.requiresHumanReview,
  })),
  evidence: context.caseData.evidence.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    direction: item.direction,
    qualityStatus: item.qualityStatus,
    sourceReference: item.provenance.sourceId,
  })),
  actions: presentRecommendations(context),
  scenarios: presentScenarios(context),
  climateImpact: presentClimateImpact(context),
  timeline: presentTimeline(context),
  explainability: presentExplainability(context),
  warnings: [...context.assessment.warnings],
  limitations: [...context.assessment.limitations],
  disclosures: [disclosureFor(context)],
  availableOperations: availableOperations(context),
  metadata: {
    assessmentId: context.assessment.assessmentId,
    engineVersion: context.assessment.engineVersion,
    presentationVersion: context.configuration.presentationVersion,
    evaluatedAt: context.assessment.evaluatedAt,
    datasetReality: context.assessment.inputReality,
  },
});
