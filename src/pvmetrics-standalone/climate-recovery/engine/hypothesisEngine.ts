import type {
  AssessmentConfiguration,
  DataSufficiencyAssessment,
  EvidenceAssessment,
  RecoverabilityAssessment,
} from '../contracts/assessment';
import type {
  DiagnosticHypothesis,
  EvidenceItem,
  RecoverableLoss,
} from '../contracts/entities';
import type { RecoverableLossCategory } from '../types/taxonomy';
import { deriveConfiguredConfidenceLevel } from './configuration';
import { CLIMATE_RECOVERY_ENGINE_VERSION } from './version';

const RULES: Readonly<Record<RecoverableLossCategory, { id: string; title: string; summary: string }>> = {
  availability: { id: 'CR-HYP-INV-001', title: 'Possible availability limitation', summary: 'Availability evidence may indicate a recoverable operational limitation.' },
  underperformance: { id: 'CR-HYP-INV-001', title: 'Possible underperformance', summary: 'Current evidence may be consistent with underperformance.' },
  soiling: { id: 'CR-HYP-SOIL-001', title: 'Possible soiling-related loss', summary: 'Current evidence may be consistent with soiling and requires cleaning assessment.' },
  'thermal-derating': { id: 'CR-HYP-THERM-001', title: 'Possible thermal derating', summary: 'Current evidence may be consistent with expected or partially recoverable thermal derating.' },
  inverter: { id: 'CR-HYP-INV-001', title: 'Possible inverter limitation', summary: 'Current evidence may be consistent with an inverter limitation.' },
  'mppt-or-string': { id: 'CR-HYP-MPPT-001', title: 'Possible MPPT or string limitation', summary: 'Current evidence may be consistent with an MPPT or string limitation.' },
  communications: { id: 'CR-HYP-COMM-001', title: 'Possible communications observability issue', summary: 'Communications evidence indicates an observability issue, not a confirmed energy loss.' },
  'sensor-quality': { id: 'CR-HYP-SENSOR-001', title: 'Possible sensor-quality issue', summary: 'Sensor-quality evidence may invalidate expected/actual comparisons.' },
  'grid-curtailment': { id: 'CR-HYP-GRID-001', title: 'Possible external grid curtailment', summary: 'Current evidence may be consistent with a non-recoverable external limitation.' },
  clipping: { id: 'CR-HYP-CLIP-001', title: 'Possible design-context clipping', summary: 'Clipping requires design context and is not automatically a failure.' },
  'bess-operation': { id: 'CR-HYP-BESS-001', title: 'Possible BESS operating-strategy difference', summary: 'Operating strategy context is required before classifying BESS behavior as erroneous.' },
  'operational-configuration': { id: 'CR-HYP-CONFIG-001', title: 'Possible operational configuration difference', summary: 'Current evidence may be consistent with a configuration difference requiring review.' },
  'maintenance-delay': { id: 'CR-HYP-MAINT-001', title: 'Possible maintenance-delay persistence', summary: 'Current evidence may be consistent with loss persistence during a maintenance delay.' },
  unknown: { id: 'CR-HYP-UNKNOWN-001', title: 'Unclassified loss hypothesis', summary: 'Available evidence is insufficient to classify a root-cause hypothesis.' },
};

export const generateDeterministicHypotheses = (input: {
  loss: RecoverableLoss;
  evidence: EvidenceItem[];
  dataSufficiency: DataSufficiencyAssessment;
  evidenceAssessment: EvidenceAssessment;
  recoverability: RecoverabilityAssessment;
  evaluationTimestamp: string;
  configuration: AssessmentConfiguration;
}): DiagnosticHypothesis[] => {
  const { loss, evidence, dataSufficiency, evidenceAssessment, recoverability } = input;
  const rule = RULES[loss.category];
  const evidenceFor = evidence.filter((item) => item.direction === 'supports').map((item) => item.id);
  const evidenceAgainst = evidence.filter((item) => item.direction === 'contradicts').map((item) => item.id);
  let score = recoverability.confidenceScore;
  if (evidenceAgainst.length > 0) score = Math.min(score, 0.59);
  if (dataSufficiency.missingCriticalFields.length > 0 || dataSufficiency.status === 'insufficient') {
    score = Math.min(score, 0.39);
  }
  score = Math.round(score * 100) / 100;
  const alternativeId = `${loss.id}:hypothesis:alternative`;
  const shouldAddAlternative = ['inverter', 'mppt-or-string', 'underperformance'].includes(loss.category);
  const primary: DiagnosticHypothesis = {
    id: `${loss.id}:hypothesis:${rule.id}`,
    title: rule.title,
    summary: rule.summary,
    category: loss.category,
    status: 'generated',
    confidenceLevel: deriveConfiguredConfidenceLevel(score, input.configuration),
    confidenceScore: score,
    evidenceFor,
    evidenceAgainst,
    missingEvidence: [...dataSufficiency.recommendedDataRequests],
    assumptions: [...loss.assumptions],
    limitations: [
      ...loss.limitations,
      'This rule-generated hypothesis is not a definitive diagnosis.',
      'The confidence score is a qualitative convention, not a statistical probability.',
    ],
    alternativeHypothesisIds: shouldAddAlternative ? [alternativeId] : [],
    requiresHumanReview: true,
    humanReviewStatus: dataSufficiency.requiresMoreData ? 'needs-more-data' : 'pending',
    createdAt: input.evaluationTimestamp,
    updatedAt: input.evaluationTimestamp,
    generatedBy: 'rule-engine',
    modelOrRuleVersion: `${CLIMATE_RECOVERY_ENGINE_VERSION}:${rule.id}`,
  };
  if (!shouldAddAlternative) return [primary];

  const alternativeScore = Math.min(score, 0.39);
  return [
    primary,
    {
      id: alternativeId,
      title: 'Alternative data-quality or operational-context explanation',
      summary: 'The observed deviation may reflect data quality, operating context, or configuration rather than equipment failure.',
      category: 'operational-configuration',
      status: evidenceAssessment.contradictingScore > 0 ? 'supported' : 'generated',
      confidenceLevel: deriveConfiguredConfidenceLevel(alternativeScore, input.configuration),
      confidenceScore: alternativeScore,
      evidenceFor: evidenceAgainst,
      evidenceAgainst: evidenceFor,
      missingEvidence: [...dataSufficiency.recommendedDataRequests],
      assumptions: [],
      limitations: ['This alternative remains a hypothesis and requires human review.'],
      alternativeHypothesisIds: [primary.id],
      requiresHumanReview: true,
      humanReviewStatus: 'pending',
      createdAt: input.evaluationTimestamp,
      updatedAt: input.evaluationTimestamp,
      generatedBy: 'rule-engine',
      modelOrRuleVersion: `${CLIMATE_RECOVERY_ENGINE_VERSION}:${rule.id}:ALT`,
    },
  ];
};
