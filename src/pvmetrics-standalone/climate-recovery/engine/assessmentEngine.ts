import type {
  AssessmentInput,
  AssessmentTraceStage,
  ClimateRecoveryAssessmentResult,
  DataSufficiencyAssessment,
  EvidenceAssessment,
  LossAssessmentResult,
  PriorityAssessment,
  RecommendedActionAssessment,
  RecoverabilityAssessment,
  EnergyLossAssessment,
  ClimateImpactAssessment,
} from '../contracts/assessment';
import type { ClimateRecoveryCase, RecoverableLoss } from '../contracts/entities';
import type { ValidationIssue, ValidationResult } from '../types/validation';
import { assessCaseDoubleCounting } from '../utils/doubleCounting';
import { isValidIsoDate } from '../validation/primitives';
import { validateClimateRecoveryCase } from '../validation/case';
import { createAssessmentTraceStep } from './assessmentTrace';
import { assessClimateImpact } from './climateImpactEngine';
import {
  DEFAULT_REQUESTED_OPERATIONS,
  resolveAssessmentConfiguration,
  validateAssessmentConfiguration,
} from './configuration';
import { assessDataSufficiency } from './dataSufficiency';
import { assessEnergyLoss } from './energyLossAssessment';
import { assessEvidence } from './evidenceAssessment';
import { generateDeterministicHypotheses } from './hypothesisEngine';
import { assessPriority } from './priorityEngine';
import { generateRecommendations } from './recommendationEngine';
import { assessRecoverability } from './recoverabilityAssessment';
import { generateRecoveryScenarios } from './scenarioEngine';
import { CLIMATE_RECOVERY_ENGINE_VERSION } from './version';

const ENGINE_LIMITATIONS = [
  'The engine produces deterministic assessments, not definitive diagnoses.',
  'Synthetic inputs and scenarios do not demonstrate operational recovery or verified climate impact.',
  'Confidence and priority scores are internal qualitative conventions, not calibrated probabilities.',
  'All recommendations are non-binding and require human review and approval.',
];

const safeCaseId = (caseData: ClimateRecoveryCase): string =>
  typeof caseData?.id === 'string' && caseData.id.trim() ? caseData.id : 'invalid-case';

const issue = (code: string, path: string, message: string): ValidationIssue => ({
  code,
  severity: 'critical',
  path,
  message,
  remediation: 'Correct the assessment input before retrying.',
});

const safeValidate = (caseData: ClimateRecoveryCase): ValidationResult<ClimateRecoveryCase> => {
  try {
    return validateClimateRecoveryCase(caseData);
  } catch {
    const issues = [
      issue(
        'malformed-case-input',
        'caseData',
        'The case structure is malformed and cannot be validated safely.',
      ),
    ];
    return { valid: false, issues, errors: issues, warnings: [] };
  }
};

const invalidDataSufficiency = (reasons: string[]): DataSufficiencyAssessment => ({
  status: 'invalid',
  availableEvidenceCount: 0,
  supportingEvidenceCount: 0,
  contradictingEvidenceCount: 0,
  unavailableEvidenceCount: 0,
  missingCriticalFields: [...reasons],
  staleDataSources: [],
  degradedDataSources: [],
  conflictingDataSources: [],
  blockingReasons: [...reasons],
  warnings: [],
  requiresMoreData: true,
  recommendedDataRequests: ['Correct critical input validation errors.'],
  confidenceCap: 0,
});

const emptyEvidence: EvidenceAssessment = {
  supportingScore: 0,
  contradictingScore: 0,
  neutralScore: 0,
  unavailableScore: 0,
  netEvidenceScore: 0,
  evidenceBalance: 'none',
  strongestSupportingEvidenceIds: [],
  strongestContradictingEvidenceIds: [],
  excludedEvidenceIds: [],
  exclusionReasons: {},
  qualityAdjustment: 0,
  limitations: ['Evidence scoring was blocked by input validation.'],
};

const emptyRecoverability: RecoverabilityAssessment = {
  status: 'not-assessed',
  reasons: ['Recoverability was not assessed because validation failed.'],
  exclusions: [],
  blockingConditions: ['Critical validation failure.'],
  requiresHumanReview: true,
  confidenceLevel: 'very-low',
  confidenceScore: 0,
  recommendedTreatment: 'not-assessed',
};

const emptyEnergy: EnergyLossAssessment = {
  method: 'unavailable',
  origin: 'estimated',
  assumptions: [],
  limitations: ['Energy-loss calculation was blocked by input validation.'],
  calculationTrace: ['No calculation performed.'],
  status: 'invalid',
};

const emptyClimate: ClimateImpactAssessment = {
  status: 'blocked',
  blockingReasons: ['Critical validation failure.'],
  assumptions: [],
  limitations: ['Climate-impact calculation was blocked.'],
  trace: [],
};

const emptyRecommendations: RecommendedActionAssessment = {
  recommendedActions: [],
  suppressedActions: [],
  suppressionReasons: {},
  requiresApproval: false,
  safetyEscalation: false,
  humanReviewStatus: 'needs-more-data',
};

const emptyPriority: PriorityAssessment = {
  score: 0,
  band: 'informational',
  components: {
    energyImpact: 0,
    operationalSeverity: 0,
    urgency: 0,
    confidence: 0,
    dataQuality: 0,
    recoverability: 0,
    persistenceRisk: 0,
    safetyRisk: 0,
    climateImpact: 0,
    effortAdjustment: 0,
  },
  reasons: ['Priority calculation was blocked by input validation.'],
  limitations: ['No operational priority can be inferred from invalid input.'],
  requiresHumanReview: true,
};

const stages: readonly AssessmentTraceStage[] = [
  'input-validation',
  'data-sufficiency',
  'evidence-scoring',
  'recoverability',
  'hypothesis-generation',
  'energy-loss',
  'scenario-generation',
  'climate-impact',
  'recommendation',
  'priority',
  'double-counting',
  'final-status',
];

const invalidResult = (input: AssessmentInput, validation: ValidationResult<ClimateRecoveryCase>, reasons: string[]): ClimateRecoveryAssessmentResult => {
  const caseId = safeCaseId(input.caseData);
  const evaluatedAt = input.evaluationTimestamp;
  const assessmentId = `CR02:${caseId}:${evaluatedAt || 'invalid-timestamp'}`;
  const dataSufficiency = invalidDataSufficiency(reasons);
  const trace = stages.map((stage, index) =>
    createAssessmentTraceStep({
      assessmentId,
      sequence: index + 1,
      stage,
      ruleId: stage === 'input-validation' ? 'CR-VAL-001' : `CR-SKIP-${String(index + 1).padStart(3, '0')}`,
      description: stage === 'input-validation' ? 'Validate CR-01 case and CR-02 assessment input.' : 'Stage skipped after fail-closed validation.',
      inputReferences: [caseId],
      outputSummary: stage === 'input-validation' ? `Invalid: ${reasons.join(' ')}` : 'Skipped.',
      warnings: [],
      limitations: stage === 'input-validation' ? [] : ['Critical validation failure prevents this stage.'],
      evaluationTimestamp: evaluatedAt,
    }),
  );
  return {
    assessmentId,
    caseId,
    engineVersion: CLIMATE_RECOVERY_ENGINE_VERSION,
    evaluatedAt,
    inputReality: input.caseData?.losses?.[0]?.datasetReality ?? input.caseData?.provenance?.[0]?.datasetReality ?? 'unknown',
    validation,
    dataSufficiency,
    evidenceAssessment: emptyEvidence,
    recoverability: emptyRecoverability,
    hypotheses: [],
    energyLoss: emptyEnergy,
    scenarios: [],
    climateImpact: emptyClimate,
    recommendations: emptyRecommendations,
    priority: emptyPriority,
    doubleCounting: [],
    lossAssessments: [],
    trace,
    warnings: validation.warnings.map((item) => item.message),
    limitations: [...ENGINE_LIMITATIONS, ...reasons],
    requiresHumanReview: true,
    status: 'invalid',
  };
};

const evidenceForLoss = (caseData: ClimateRecoveryCase, loss: RecoverableLoss) => {
  const ids = new Set(loss.evidenceIds);
  return caseData.evidence.filter((item) => ids.has(item.id));
};

export const assessClimateRecoveryCase = (
  input: AssessmentInput,
): ClimateRecoveryAssessmentResult => {
  const caseValidation = safeValidate(input.caseData);
  const configuration = resolveAssessmentConfiguration(input.configuration);
  const configurationErrors = validateAssessmentConfiguration(configuration);
  const inputErrors = [
    ...(!isValidIsoDate(input.evaluationTimestamp)
      ? ['evaluationTimestamp must be an explicit ISO 8601 timestamp with timezone.']
      : []),
    ...configurationErrors,
    ...(input.caseData?.losses?.length ? [] : ['caseData.losses must contain at least one loss.']),
  ];
  if (!caseValidation.valid || inputErrors.length > 0) {
    const engineIssues = inputErrors.map((message, index) =>
      issue(`invalid-assessment-input-${index + 1}`, 'assessmentInput', message),
    );
    const validation: ValidationResult<ClimateRecoveryCase> = engineIssues.length > 0
      ? {
          valid: false,
          issues: [...caseValidation.issues, ...engineIssues],
          errors: [...caseValidation.errors, ...engineIssues],
          warnings: caseValidation.warnings,
        }
      : caseValidation;
    const validationReasons = validation.errors.map((item) => `${item.path}: ${item.message}`);
    return invalidResult(input, validation, validationReasons);
  }

  const validation = caseValidation;

  const caseData = input.caseData;
  const caseId = caseData.id;
  const assessmentId = `CR02:${caseId}:${input.evaluationTimestamp}`;
  const requestedOperations = {
    ...DEFAULT_REQUESTED_OPERATIONS,
    ...input.requestedOperations,
  };
  const doubleCounting = assessCaseDoubleCounting(caseData.losses);
  const lossAssessments: LossAssessmentResult[] = caseData.losses.map((loss) => {
    const evidence = evidenceForLoss(caseData, loss);
    const dataSufficiency = assessDataSufficiency({
      caseData,
      loss,
      evaluationTimestamp: input.evaluationTimestamp,
      emissionFactors: input.emissionFactors,
      configuration,
      requestedOperations,
    });
    const evidenceAssessment = assessEvidence(evidence, configuration);
    const recoverability = assessRecoverability({
      loss,
      evidence,
      dataSufficiency,
      evidenceAssessment,
      configuration,
    });
    const hypotheses = generateDeterministicHypotheses({
      loss,
      evidence,
      dataSufficiency,
      evidenceAssessment,
      recoverability,
      evaluationTimestamp: input.evaluationTimestamp,
      configuration,
    });
    const energyLoss = assessEnergyLoss({
      loss,
      evidence,
      dataSufficiency,
      configuration,
      requestedOperations,
    });
    const scenarios = generateRecoveryScenarios({
      energyLoss,
      recoverability,
      configuration,
      requestedOperations,
      datasetReality: loss.datasetReality,
    });
    const relatedDoubleCounting = doubleCounting.filter((assessment) =>
      assessment.relatedLossIds.includes(loss.id),
    );
    const climateImpact = assessClimateImpact({
      scenarios,
      factors: input.emissionFactors,
      configuration,
      requestedOperations,
      dataSufficiency,
      evaluationTimestamp: input.evaluationTimestamp,
      datasetReality: loss.datasetReality,
      relatedDoubleCounting,
    });
    const recommendations = generateRecommendations({
      loss,
      evidence,
      hypotheses,
      recoverability,
      dataSufficiency,
      evaluationTimestamp: input.evaluationTimestamp,
      operatorContext: input.operatorContext,
    });
    const priority = assessPriority({
      loss,
      energyLoss,
      climateImpact,
      recoverability,
      dataSufficiency,
      recommendations,
      configuration,
      evaluationTimestamp: input.evaluationTimestamp,
      operatorContext: input.operatorContext,
    });
    return {
      lossId: loss.id,
      dataSufficiency,
      evidenceAssessment,
      recoverability,
      hypotheses,
      energyLoss,
      scenarios,
      climateImpact,
      recommendations,
      priority,
    };
  });

  const primary = lossAssessments[0];
  const hypotheses = lossAssessments.flatMap((item) => item.hypotheses);
  const possibleOrConfirmedOverlap = doubleCounting.filter((item) =>
    ['possible-overlap', 'confirmed-overlap'].includes(item.status),
  );
  const warnings = [
    ...validation.warnings.map((item) => item.message),
    ...lossAssessments.flatMap((item) => item.dataSufficiency.warnings),
    ...possibleOrConfirmedOverlap.map(
      (item) => `${item.status}: ${item.reasons.join(' ')} No automatic consolidation was performed.`,
    ),
  ];
  const blockedStages = lossAssessments.some(
    (item) =>
      item.dataSufficiency.status === 'insufficient' ||
      item.energyLoss.status === 'unavailable' ||
      item.climateImpact.status === 'blocked' ||
      item.climateImpact.status === 'invalid' ||
      item.scenarios.some((scenario) => ['blocked', 'invalid'].includes(scenario.status)),
  );
  const partialStages = lossAssessments.some(
    (item) =>
      item.dataSufficiency.status === 'partially-sufficient' ||
      item.energyLoss.status === 'partially-calculated' ||
      item.climateImpact.status === 'unavailable',
  );
  const status: ClimateRecoveryAssessmentResult['status'] = blockedStages
    ? 'blocked'
    : partialStages || possibleOrConfirmedOverlap.length > 0
      ? 'partial'
      : 'complete';

  const traceDetails: Record<AssessmentTraceStage, { ruleId: string; summary: string; warnings?: string[]; limitations?: string[] }> = {
    'input-validation': { ruleId: 'CR-VAL-001', summary: `CR-01 validation passed with ${validation.warnings.length} warning(s).` },
    'data-sufficiency': { ruleId: 'CR-DATA-001', summary: lossAssessments.map((item) => `${item.lossId}=${item.dataSufficiency.status}`).join('; '), warnings: lossAssessments.flatMap((item) => item.dataSufficiency.warnings) },
    'evidence-scoring': { ruleId: 'CR-EVID-001', summary: lossAssessments.map((item) => `${item.lossId} net=${item.evidenceAssessment.netEvidenceScore}`).join('; '), limitations: ['Scores are qualitative weights, not probabilities.'] },
    recoverability: { ruleId: 'CR-REC-001', summary: lossAssessments.map((item) => `${item.lossId}=${item.recoverability.status}`).join('; ') },
    'hypothesis-generation': { ruleId: 'CR-HYP-001', summary: `${hypotheses.length} deterministic hypothesis record(s) generated.`, limitations: ['No hypothesis is a definitive or human-confirmed diagnosis.'] },
    'energy-loss': { ruleId: 'CR-ENERGY-001', summary: lossAssessments.map((item) => `${item.lossId}=${item.energyLoss.status}:${item.energyLoss.method}`).join('; '), limitations: ['All values remain estimates.'] },
    'scenario-generation': { ruleId: 'CR-SCENARIO-001', summary: `${lossAssessments.flatMap((item) => item.scenarios).filter((item) => item.status === 'simulated').length} simulated scenario(s) generated.`, limitations: ['Scenario rates are configurable synthetic assumptions.'] },
    'climate-impact': { ruleId: 'CR-CLIMATE-001', summary: lossAssessments.map((item) => `${item.lossId}=${item.climateImpact.status}`).join('; '), limitations: ['Climate values are counterfactual estimates, never verified outcomes.'] },
    recommendation: { ruleId: 'CR-ACTION-001', summary: `${lossAssessments.flatMap((item) => item.recommendations.recommendedActions).length} non-binding recommendation(s) generated.` },
    priority: { ruleId: 'CR-PRIORITY-001', summary: lossAssessments.map((item) => `${item.lossId}=${item.priority.score}/${item.priority.band}`).join('; '), limitations: ['Priority scores are not calibrated probabilities.'] },
    'double-counting': { ruleId: 'CR-DOUBLE-001', summary: possibleOrConfirmedOverlap.length > 0 ? `${possibleOrConfirmedOverlap.length} overlap risk(s) retained for review.` : 'No overlapping loss pair was detected.', warnings: possibleOrConfirmedOverlap.map((item) => item.status) },
    'final-status': { ruleId: 'CR-FINAL-001', summary: `Assessment status=${status}; human review required.` },
  };
  const trace = stages.map((stage, index) => {
    const details = traceDetails[stage];
    return createAssessmentTraceStep({
      assessmentId,
      sequence: index + 1,
      stage,
      ruleId: details.ruleId,
      description: `Deterministic ${stage} stage.`,
      inputReferences: [caseId, ...caseData.losses.map((loss) => loss.id)],
      outputSummary: details.summary,
      warnings: details.warnings,
      limitations: details.limitations,
      evaluationTimestamp: input.evaluationTimestamp,
    });
  });

  return {
    assessmentId,
    caseId,
    engineVersion: CLIMATE_RECOVERY_ENGINE_VERSION,
    evaluatedAt: input.evaluationTimestamp,
    inputReality: caseData.losses[0]?.datasetReality ?? caseData.provenance[0]?.datasetReality ?? 'unknown',
    validation,
    dataSufficiency: primary.dataSufficiency,
    evidenceAssessment: primary.evidenceAssessment,
    recoverability: primary.recoverability,
    hypotheses,
    energyLoss: primary.energyLoss,
    scenarios: primary.scenarios,
    climateImpact: primary.climateImpact,
    recommendations: primary.recommendations,
    priority: primary.priority,
    doubleCounting,
    lossAssessments,
    trace,
    warnings: [...new Set(warnings)],
    limitations: [...ENGINE_LIMITATIONS],
    requiresHumanReview: true,
    status,
  };
};
