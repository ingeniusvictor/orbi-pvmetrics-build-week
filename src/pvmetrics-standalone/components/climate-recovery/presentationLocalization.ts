import type { ClimateRecoveryLocale } from './copy';
import type {
  CaseCatalogItem,
  CaseDetailPresentation,
  PortfolioExecutivePresentation,
  SyntheticPlant,
} from '../../climate-recovery';

const keys: Record<string, { es: string; en: string }> = {
  'kpi.confidence': { es: 'Confianza', en: 'Confidence' },
  'kpi.dataSufficiency': { es: 'Suficiencia de datos', en: 'Data Sufficiency' },
  'kpi.estimatedAvoidedEmissions': { es: 'Emisiones evitadas estimadas', en: 'Estimated Avoided Emissions' },
  'kpi.estimatedEnergyLoss': { es: 'Pérdida de energía estimada', en: 'Estimated Energy Loss' },
  'kpi.estimatedRecoverableEnergy': { es: 'Energía recuperable estimada', en: 'Estimated Recoverable Energy' },
  'kpi.humanReviewStatus': { es: 'Estado de revisión humana', en: 'Human Review Status' },
  'kpi.priorityScore': { es: 'Puntaje de prioridad', en: 'Priority Score' },
  'kpi.recommendedActionCount': { es: 'Acciones recomendadas', en: 'Recommended Actions' },
  'scenario.seven-days': { es: 'Escenario de siete días', en: 'Seven-day scenario' },
  'seven-days': { es: 'Siete días', en: 'Seven days' },
  'Synthetic portfolio demonstration': { es: 'Demostración de portafolio sintético', en: 'Synthetic portfolio demonstration' },
  'request-more-data': { es: 'Solicitar más datos', en: 'Request more data' },
  'remote-review': { es: 'Revisión remota', en: 'Remote review' },
  'data-validation': { es: 'Validación de datos', en: 'Data validation' },
  'alarm-review': { es: 'Revisión de alarmas', en: 'Alarm review' },
  monitoring: { es: 'Monitoreo', en: 'Monitoring' },
  escalation: { es: 'Escalamiento', en: 'Escalation' },
  'field-inspection': { es: 'Inspección en terreno', en: 'Field inspection' },
  'cleaning-assessment': { es: 'Evaluación de limpieza', en: 'Cleaning assessment' },
  'maintenance-intervention': { es: 'Intervención de mantenimiento', en: 'Maintenance intervention' },
  'operational-check': { es: 'Verificación operacional', en: 'Operational check' },
  'no-action': { es: 'Sin acción recomendada', en: 'No action' },
  detection: { es: 'Detección', en: 'Detection' },
  'evidence-collected': { es: 'Evidencia recopilada', en: 'Evidence collected' },
  'assessment-generated': { es: 'Evaluación generada', en: 'Assessment generated' },
  'hypothesis-generated': { es: 'Hipótesis generada', en: 'Hypothesis generated' },
  'scenario-generated': { es: 'Escenario generado', en: 'Scenario generated' },
  'climate-estimate-generated': { es: 'Estimación climática generada', en: 'Climate estimate generated' },
  'recommendation-generated': { es: 'Recomendación generada', en: 'Recommendation generated' },
  'review-requested': { es: 'Revisión solicitada', en: 'Review requested' },
  'warning-raised': { es: 'Advertencia registrada', en: 'Warning raised' },
  'case-status': { es: 'Estado del caso', en: 'Case status' },
  'assessment requires human review': { es: 'La evaluación requiere revisión humana', en: 'Assessment requires human review' },
  'human-evidence-review': { es: 'Revisión humana de evidencia', en: 'Human evidence review' },
  'overlap-review': { es: 'Revisión de solapamiento', en: 'Overlap review' },
  'data-quality-review': { es: 'Revisión de calidad de datos', en: 'Data quality review' },
  'methodology-review': { es: 'Revisión de metodología', en: 'Methodology review' },
  'field-safety-review': { es: 'Revisión de seguridad en terreno', en: 'Field safety review' },
  'maintenance-review': { es: 'Revisión de mantenimiento', en: 'Maintenance review' },
  'hypothesis-review': { es: 'Revisión de hipótesis', en: 'Hypothesis review' },
  'evidence-gap-review': { es: 'Revisión de brecha de evidencia', en: 'Evidence gap review' },
  'review-first': { es: 'Revisar primero', en: 'Review first' },
  'review-soon': { es: 'Revisar pronto', en: 'Review soon' },
  'review-routine': { es: 'Revisión rutinaria', en: 'Routine review' },
  'field inspection recommendation gate': { es: 'Control de recomendación para inspección en terreno', en: 'Field inspection recommendation gate' },
};

export const formatCaseCount = (count: number, locale: ClimateRecoveryLocale) => (
  locale === 'es'
    ? `${count} ${count === 1 ? 'caso' : 'casos'}`
    : `${count} ${count === 1 ? 'case' : 'cases'}`
);

const localizeCaseCountPlaceholders = (value: string, locale: ClimateRecoveryLocale) => value.replace(
  /\b(\d+) case\(s\)/g,
  (_, count: string) => formatCaseCount(Number(count), locale),
);

const caseTitlesEs: Record<string, string> = {
  'DEMO-CR-CASE-A': 'Oportunidad de inversor Aurora',
  'CR04-CASE-SOILING': 'Evaluación de soiling Aurora',
  'CR04-CASE-MPPT': 'Revisión MPPT Aurora',
  'CR04-CASE-MAINTENANCE-DELAY': 'Oportunidad por demora de mantenimiento Aurora',
  'DEMO-CR-CASE-B': 'Curtailment externo de red Helios',
  'CR04-CASE-COMMUNICATIONS': 'Brecha de comunicaciones Helios',
  'CR04-CASE-CLIPPING': 'Clipping con contexto de diseño Helios',
  'DEMO-CR-CASE-C': 'Calidad de sensor Valle Verde',
  'CR04-CASE-UNDERPERFORMANCE': 'Oportunidad de underperformance Valle Verde',
  'DEMO-CR-CASE-D': 'Posible solapamiento Patagonia',
  'CR04-CASE-BESS-OPERATION': 'Revisión de estrategia BESS Patagonia',
  'CR04-CASE-OPERATIONAL-CONFIG': 'Revisión de configuración Patagonia',
  'CR04-CASE-THERMAL-DERATING': 'Derating térmico Costa Sur',
  'CR04-CASE-INVERTER-HIGH': 'Revisión prioritaria de inversor Costa Sur',
};

const spanishSignal = /\b(?:datos|evidencia|revisi[oó]n|estimaci[oó]n|p[eé]rdida|sint[eé]tic|recuperaci[oó]n|hip[oó]tesis|advertencia|factor)\b/i;
const englishSignal = /\b(?:the|this|that|is|are|was|were|requires?|review|evidence|synthetic|estimated|recovery|scenario|data|human|not|no|missing|unavailable|methodology|limitation|action|priority|confidence|cases?|opportunity|assessment|curtailment|configuration|communications|clipping|thermal|underperformance|maintenance|inverter|strategy)\b/i;

const fallbackSpanish = (value: string) => {
  const normalized = value.toLowerCase();
  if (/overlap|double.count|solap/.test(normalized)) return 'Existe un posible solapamiento; la agregación requiere revisión humana para evitar doble conteo.';
  if (/insufficient|missing|unavailable|more data|observability|communications|sensor/.test(normalized)) return 'Los datos sintéticos disponibles son insuficientes; se requiere evidencia adicional antes de reevaluar.';
  if (/non-recoverable|curtailment|clipping|external grid/.test(normalized)) return 'La evaluación clasifica esta pérdida como no recuperable mediante mantenimiento del activo; no se afirma recuperación.';
  if (/climate|emission|factor|counterfactual/.test(normalized)) return 'Estimación climática contrafactual basada en un factor sintético configurable; no está medida ni verificada.';
  if (/hypoth|diagnos|rule/.test(normalized)) return 'Hipótesis generada por reglas, no confirmada y sujeta a revisión humana; no constituye un diagnóstico.';
  if (/scenario|recover|intervention|forecast|projection/.test(normalized)) return 'Escenario sintético proyectado bajo supuestos explícitos; no garantiza recuperación operacional.';
  if (/action|recommend|operator|approval|dispatch|maintenance|field/.test(normalized)) return 'Recomendación no vinculante sujeta a revisión y aprobación humana; no ejecuta despacho ni mantenimiento.';
  if (/priority|confidence|quality|score|probabil/.test(normalized)) return 'Puntaje cualitativo determinista para priorización humana; no es una probabilidad calibrada.';
  if (/bess|operating strateg/.test(normalized)) return 'El contexto de estrategia BESS requiere revisión humana; no se infiere un error operacional ni una acción de control.';
  if (/evidence|source|peer|alarm|signal|comparison/.test(normalized)) return 'Evidencia sintética trazable conservada para revisión humana; no demuestra por sí sola una falla.';
  return 'Detalle técnico sintético conservado para revisión humana y trazabilidad.';
};

export const localizePresentationText = (
  value: string | undefined,
  locale: ClimateRecoveryLocale,
): string => {
  if (!value) return '';
  const pluralized = localizeCaseCountPlaceholders(value, locale);
  if (pluralized !== value) {
    if (locale === 'en') return pluralized;
    if (/have insufficient data and are excluded from aggregation/i.test(value)) {
      const count = Number(value.match(/\d+/)?.[0] ?? 0);
      return `${formatCaseCount(count, 'es')} ${count === 1 ? 'tiene' : 'tienen'} datos insuficientes y ${count === 1 ? 'se excluye' : 'se excluyen'} de la agregación.`;
    }
    if (/contain possible or confirmed overlap/i.test(value)) {
      const count = Number(value.match(/\d+/)?.[0] ?? 0);
      return `${formatCaseCount(count, 'es')} ${count === 1 ? 'contiene' : 'contienen'} solapamiento posible o confirmado y ${count === 1 ? 'se excluye' : 'se excluyen'} según la política de agregación.`;
    }
    return pluralized;
  }
  const direct = keys[value];
  if (direct) return direct[locale];
  const actionKey = value.startsWith('action.') ? value.split('.')[1] : undefined;
  if (actionKey && keys[actionKey]) return keys[actionKey][locale];
  if (locale === 'en' || spanishSignal.test(value) || !englishSignal.test(value)) return value;
  const priority = value.match(/^Priority band: ([a-z-]+)/i);
  if (priority) return `Banda de prioridad sintética: ${priority[1]}. No es una probabilidad ni una orden.`;
  const status = value.match(/^(Assessment|Case) status: ([a-z-]+)/i);
  if (status) return `${status[1] === 'Assessment' ? 'Estado de evaluación' : 'Estado del caso'}: ${status[2]}.`;
  const categoryRule = value.match(/^Deterministic category rule for ([a-z-]+)/i);
  if (categoryRule) return `Regla determinista para ${categoryRule[1]}; la evidencia y la incertidumbre requieren revisión humana.`;
  return fallbackSpanish(value);
};

export const localizePresentationList = (values: string[], locale: ClimateRecoveryLocale): string[] => (
  [...new Set(values.map((value) => localizePresentationText(value, locale)).filter(Boolean))]
);

const localizeValue = <T extends { limitations: string[] }>(value: T, locale: ClimateRecoveryLocale): T => ({
  ...value,
  limitations: localizePresentationList(value.limitations, locale),
});

export const localizeCaseCatalogItem = (item: CaseCatalogItem, locale: ClimateRecoveryLocale): CaseCatalogItem => ({
  ...item,
  title: locale === 'es' ? caseTitlesEs[item.caseId] ?? localizePresentationText(item.title, locale) : item.title,
  recommendedNextStep: localizePresentationText(item.recommendedNextStep, locale),
  estimatedRecoverableEnergy: localizeValue(item.estimatedRecoverableEnergy, locale),
  estimatedClimateImpact: localizeValue(item.estimatedClimateImpact, locale),
  priority: localizeValue(item.priority, locale),
  confidence: localizeValue(item.confidence, locale),
});

export const localizeSyntheticPlant = (plant: SyntheticPlant, locale: ClimateRecoveryLocale): SyntheticPlant => ({
  ...plant,
  description: localizePresentationText(plant.description, locale),
  limitations: localizePresentationList(plant.limitations, locale),
});

export const localizeCaseDetailPresentation = (
  detail: CaseDetailPresentation,
  locale: ClimateRecoveryLocale,
): CaseDetailPresentation => ({
  ...detail,
  summary: {
    ...detail.summary,
    caseTitle: locale === 'es' ? caseTitlesEs[detail.summary.caseId] ?? localizePresentationText(detail.summary.caseTitle, locale) : detail.summary.caseTitle,
    headline: localizePresentationText(detail.summary.headline, locale),
    executiveNarrative: localizePresentationText(detail.summary.executiveNarrative, locale),
    recommendedNextStep: localizePresentationText(detail.summary.recommendedNextStep, locale),
    confidence: localizeValue(detail.summary.confidence, locale),
    recoveryOpportunity: {
      ...detail.summary.recoveryOpportunity,
      methodology: localizePresentationText(detail.summary.recoveryOpportunity.methodology, locale),
      limitations: localizePresentationList(detail.summary.recoveryOpportunity.limitations, locale),
      estimatedEnergy: localizeValue(detail.summary.recoveryOpportunity.estimatedEnergy, locale),
    },
    climateImpact: {
      ...detail.summary.climateImpact,
      estimatedAvoidedEmissions: localizeValue(detail.summary.climateImpact.estimatedAvoidedEmissions, locale),
    },
    syntheticDisclosure: localizePresentationText(detail.summary.syntheticDisclosure, locale),
  },
  kpis: detail.kpis.map((kpi) => ({
    ...kpi,
    labelKey: localizePresentationText(kpi.labelKey, locale),
    explanation: localizePresentationText(kpi.explanation, locale),
    value: localizeValue(kpi.value, locale),
  })),
  actions: detail.actions.map((action) => ({
    ...action,
    titleKey: localizePresentationText(action.titleKey, locale),
    descriptionKey: localizePresentationText(action.descriptionKey, locale),
    rationale: localizePresentationText(action.rationale, locale),
    expectedOutcome: localizePresentationText(action.expectedOutcome, locale),
    safetyNotes: localizePresentationList(action.safetyNotes, locale),
    uncertaintyNotes: localizePresentationList(action.uncertaintyNotes, locale),
  })),
  scenarios: detail.scenarios.map((scenario) => ({
    ...scenario,
    nameKey: localizePresentationText(scenario.nameKey, locale),
    assumptions: localizePresentationList(scenario.assumptions, locale),
    limitations: localizePresentationList(scenario.limitations, locale),
    noIntervention: localizeValue(scenario.noIntervention, locale),
    intervention: localizeValue(scenario.intervention, locale),
    recoveredEnergy: localizeValue(scenario.recoveredEnergy, locale),
  })),
  climateImpact: {
    ...detail.climateImpact,
    methodology: localizePresentationText(detail.climateImpact.methodology, locale),
    assumptions: localizePresentationList(detail.climateImpact.assumptions, locale),
    limitations: localizePresentationList(detail.climateImpact.limitations, locale),
    blockingReasons: localizePresentationList(detail.climateImpact.blockingReasons, locale),
    estimatedAvoidedEmissions: localizeValue(detail.climateImpact.estimatedAvoidedEmissions, locale),
    emissionFactor: localizeValue(detail.climateImpact.emissionFactor, locale),
  },
  evidence: detail.evidence.map((evidence) => ({
    ...evidence,
    title: localizePresentationText(evidence.title, locale),
    description: localizePresentationText(evidence.description, locale),
  })),
  hypotheses: detail.hypotheses.map((hypothesis) => ({
    ...hypothesis,
    title: localizePresentationText(hypothesis.title, locale),
    summary: localizePresentationText(hypothesis.summary, locale),
  })),
  timeline: detail.timeline.map((event) => ({
    ...event,
    titleKey: localizePresentationText(event.titleKey, locale),
    descriptionKey: localizePresentationText(event.descriptionKey, locale),
  })),
  explainability: {
    ...detail.explainability,
    summary: localizePresentationText(detail.explainability.summary, locale),
    confidenceExplanation: localizePresentationText(detail.explainability.confidenceExplanation, locale),
    humanReviewExplanation: localizePresentationText(detail.explainability.humanReviewExplanation, locale),
    supportingEvidence: localizePresentationList(detail.explainability.supportingEvidence, locale),
    contradictingEvidence: localizePresentationList(detail.explainability.contradictingEvidence, locale),
    missingEvidence: localizePresentationList(detail.explainability.missingEvidence, locale),
    assumptions: localizePresentationList(detail.explainability.assumptions, locale),
    limitations: localizePresentationList(detail.explainability.limitations, locale),
    traceHighlights: detail.explainability.traceHighlights.map((trace) => ({ ...trace, summary: localizePresentationText(trace.summary, locale) })),
  },
  warnings: localizePresentationList(detail.warnings, locale),
  limitations: localizePresentationList(detail.limitations, locale),
  disclosures: localizePresentationList(detail.disclosures, locale),
});

export const localizeExecutivePresentation = (
  executive: PortfolioExecutivePresentation,
  locale: ClimateRecoveryLocale,
): PortfolioExecutivePresentation => ({
  ...executive,
  summary: {
    ...executive.summary,
    portfolioName: localizePresentationText(executive.summary.portfolioName, locale),
    estimatedRecoverableEnergy: localizeValue(executive.summary.estimatedRecoverableEnergy, locale),
    estimatedClimateImpact: localizeValue(executive.summary.estimatedClimateImpact, locale),
    disclosures: localizePresentationList(executive.summary.disclosures, locale),
    warnings: localizePresentationList(executive.summary.warnings, locale),
  },
  kpis: {
    ...executive.kpis,
    estimatedRecoverableEnergy: localizeValue(executive.kpis.estimatedRecoverableEnergy, locale),
    estimatedClimateImpact: localizeValue(executive.kpis.estimatedClimateImpact, locale),
  },
  plantSummaries: executive.plantSummaries.map((plant) => ({
    ...plant,
    recommendedNextStep: localizePresentationText(plant.recommendedNextStep, locale),
    warnings: localizePresentationList(plant.warnings, locale),
    limitations: localizePresentationList(plant.limitations, locale),
    estimatedRecoverableEnergy: localizeValue(plant.estimatedRecoverableEnergy, locale),
    estimatedClimateImpact: localizeValue(plant.estimatedClimateImpact, locale),
  })),
  rankings: executive.rankings.map((ranking) => ({
    ...ranking,
    reasons: localizePresentationList(ranking.reasons, locale),
    limitations: localizePresentationList(ranking.limitations, locale),
    estimatedRecoverableEnergy: localizeValue(ranking.estimatedRecoverableEnergy, locale),
    estimatedClimateImpact: localizeValue(ranking.estimatedClimateImpact, locale),
  })),
  featuredCases: executive.featuredCases.map((detail) => localizeCaseDetailPresentation(detail, locale)),
  reviewQueue: executive.reviewQueue.map((item) => ({
    ...item,
    reason: localizePresentationList(item.reason, locale),
    evidenceGap: localizePresentationList(item.evidenceGap, locale),
    recommendedReviewType: localizePresentationList(item.recommendedReviewType, locale),
  })),
  dataQualityOverview: {
    ...executive.dataQualityOverview,
    limitations: localizePresentationList(executive.dataQualityOverview.limitations, locale),
    recommendation: localizePresentationText(executive.dataQualityOverview.recommendation, locale),
  },
  recoverabilityDistribution: {
    ...executive.recoverabilityDistribution,
    disclosure: localizePresentationText(executive.recoverabilityDistribution.disclosure, locale),
    statuses: executive.recoverabilityDistribution.statuses.map((status) => ({
      ...status,
      estimatedEnergy: localizeValue(status.estimatedEnergy, locale),
      warnings: localizePresentationList(status.warnings, locale),
    })),
  },
  priorityDistribution: {
    ...executive.priorityDistribution,
    disclosure: localizePresentationText(executive.priorityDistribution.disclosure, locale),
  },
  aggregationPolicy: {
    ...executive.aggregationPolicy,
    exclusionReasons: Object.fromEntries(Object.entries(executive.aggregationPolicy.exclusionReasons).map(([id, reason]) => [id, localizePresentationText(reason, locale)])),
    excludedEnergy: localizeValue(executive.aggregationPolicy.excludedEnergy, locale),
    excludedClimateImpact: localizeValue(executive.aggregationPolicy.excludedClimateImpact, locale),
    warnings: localizePresentationList(executive.aggregationPolicy.warnings, locale),
  },
  warnings: localizePresentationList(executive.warnings, locale),
  disclosures: localizePresentationList(executive.disclosures, locale),
});
