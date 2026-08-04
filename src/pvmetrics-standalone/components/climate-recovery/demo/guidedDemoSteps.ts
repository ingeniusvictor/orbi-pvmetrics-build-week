import type { ClimateRecoveryLocale } from '../copy';
import type { ClimateRecoverySection } from '../hooks/useClimateRecoveryDemo';

export type GuidedDemoTextKey =
  | 'step.problem.title' | 'step.problem.subtitle' | 'step.problem.narrative' | 'step.problem.point.assets' | 'step.problem.point.cases'
  | 'step.opportunity.title' | 'step.opportunity.subtitle' | 'step.opportunity.narrative' | 'step.opportunity.point.estimate' | 'step.opportunity.point.review'
  | 'step.ranking.title' | 'step.ranking.subtitle' | 'step.ranking.narrative' | 'step.ranking.point.score' | 'step.ranking.point.quality'
  | 'step.recoverable.title' | 'step.recoverable.subtitle' | 'step.recoverable.narrative' | 'step.recoverable.point.evidence' | 'step.recoverable.point.human'
  | 'step.nonrecoverable.title' | 'step.nonrecoverable.subtitle' | 'step.nonrecoverable.narrative' | 'step.nonrecoverable.point.classification' | 'step.nonrecoverable.point.suppressed'
  | 'step.insufficient.title' | 'step.insufficient.subtitle' | 'step.insufficient.narrative' | 'step.insufficient.point.blocked' | 'step.insufficient.point.data'
  | 'step.explainability.title' | 'step.explainability.subtitle' | 'step.explainability.narrative' | 'step.explainability.point.rules' | 'step.explainability.point.operator'
  | 'step.climate.title' | 'step.climate.subtitle' | 'step.climate.narrative' | 'step.climate.point.counterfactual' | 'step.climate.point.unverified'
  | 'warning.synthetic' | 'warning.estimated' | 'warning.humanReview';

export type GuidedDemoStep = {
  id: string;
  order: number;
  titleKey: GuidedDemoTextKey;
  subtitleKey: GuidedDemoTextKey;
  narrativeKey: GuidedDemoTextKey;
  targetSection: ClimateRecoverySection;
  plantId?: string;
  caseId?: string;
  anchorId: string;
  durationHintSeconds: number;
  keyPoints: GuidedDemoTextKey[];
  warnings: GuidedDemoTextKey[];
  syntheticDisclosureRequired: boolean;
  allowSkip: boolean;
  localeSupport: readonly ClimateRecoveryLocale[];
  expectedViewport: 'responsive' | 'desktop-preferred';
  nextStepId?: string;
  previousStepId?: string;
  requiredOpenSections: readonly GuidedDemoRequiredOpenSection[];
};

export type GuidedDemoRequiredOpenSection =
  | 'evidence'
  | 'explainability'
  | 'methodology'
  | 'review-queue'
  | 'recovery-scenario';

export type GuidedDemoState = {
  active: boolean;
  currentStepId: string;
  completedStepIds: string[];
  startedAt: '2026-08-03T12:00:00.000Z';
  locale: ClimateRecoveryLocale;
  mode: 'guided' | 'free';
  reducedMotion: boolean;
  narrationVisible: boolean;
};

const baseSteps: Omit<GuidedDemoStep, 'nextStepId' | 'previousStepId'>[] = [
  {
    id: 'problem', order: 1, titleKey: 'step.problem.title', subtitleKey: 'step.problem.subtitle', narrativeKey: 'step.problem.narrative',
    targetSection: 'overview', anchorId: 'guided-demo-anchor-problem', durationHintSeconds: 25,
    keyPoints: ['step.problem.point.assets', 'step.problem.point.cases'], warnings: ['warning.synthetic'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'responsive', requiredOpenSections: [],
  },
  {
    id: 'opportunity', order: 2, titleKey: 'step.opportunity.title', subtitleKey: 'step.opportunity.subtitle', narrativeKey: 'step.opportunity.narrative',
    targetSection: 'overview', anchorId: 'guided-demo-anchor-opportunity', durationHintSeconds: 25,
    keyPoints: ['step.opportunity.point.estimate', 'step.opportunity.point.review'], warnings: ['warning.estimated', 'warning.humanReview'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'responsive', requiredOpenSections: [],
  },
  {
    id: 'ranking', order: 3, titleKey: 'step.ranking.title', subtitleKey: 'step.ranking.subtitle', narrativeKey: 'step.ranking.narrative',
    targetSection: 'overview', anchorId: 'guided-demo-anchor-portfolio-ranking', durationHintSeconds: 30,
    keyPoints: ['step.ranking.point.score', 'step.ranking.point.quality'], warnings: ['warning.estimated'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'desktop-preferred', requiredOpenSections: [],
  },
  {
    id: 'recoverable-case', order: 4, titleKey: 'step.recoverable.title', subtitleKey: 'step.recoverable.subtitle', narrativeKey: 'step.recoverable.narrative',
    targetSection: 'case', plantId: 'CR04-PLANT-AURORA', caseId: 'DEMO-CR-CASE-A', anchorId: 'guided-demo-anchor-recoverable-case', durationHintSeconds: 35,
    keyPoints: ['step.recoverable.point.evidence', 'step.recoverable.point.human'], warnings: ['warning.estimated', 'warning.humanReview'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'responsive', requiredOpenSections: ['evidence'],
  },
  {
    id: 'non-recoverable', order: 5, titleKey: 'step.nonrecoverable.title', subtitleKey: 'step.nonrecoverable.subtitle', narrativeKey: 'step.nonrecoverable.narrative',
    targetSection: 'case', plantId: 'CR04-PLANT-HELIOS', caseId: 'DEMO-CR-CASE-B', anchorId: 'guided-demo-anchor-non-recoverable-case', durationHintSeconds: 30,
    keyPoints: ['step.nonrecoverable.point.classification', 'step.nonrecoverable.point.suppressed'], warnings: ['warning.synthetic', 'warning.humanReview'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'responsive', requiredOpenSections: [],
  },
  {
    id: 'insufficient-data', order: 6, titleKey: 'step.insufficient.title', subtitleKey: 'step.insufficient.subtitle', narrativeKey: 'step.insufficient.narrative',
    targetSection: 'case', plantId: 'CR04-PLANT-VALLE', caseId: 'DEMO-CR-CASE-C', anchorId: 'guided-demo-anchor-insufficient-data', durationHintSeconds: 30,
    keyPoints: ['step.insufficient.point.blocked', 'step.insufficient.point.data'], warnings: ['warning.synthetic', 'warning.humanReview'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'responsive', requiredOpenSections: ['methodology'],
  },
  {
    id: 'explainability', order: 7, titleKey: 'step.explainability.title', subtitleKey: 'step.explainability.subtitle', narrativeKey: 'step.explainability.narrative',
    targetSection: 'review', anchorId: 'guided-demo-anchor-explainability-review', durationHintSeconds: 30,
    keyPoints: ['step.explainability.point.rules', 'step.explainability.point.operator'], warnings: ['warning.humanReview'],
    syntheticDisclosureRequired: true, allowSkip: true, localeSupport: ['es', 'en'], expectedViewport: 'responsive', requiredOpenSections: ['review-queue'],
  },
  {
    id: 'climate-impact', order: 8, titleKey: 'step.climate.title', subtitleKey: 'step.climate.subtitle', narrativeKey: 'step.climate.narrative',
    targetSection: 'case', plantId: 'CR04-PLANT-AURORA', caseId: 'DEMO-CR-CASE-A', anchorId: 'guided-demo-anchor-climate-recovery', durationHintSeconds: 35,
    keyPoints: ['step.climate.point.counterfactual', 'step.climate.point.unverified'], warnings: ['warning.estimated', 'warning.synthetic'],
    syntheticDisclosureRequired: true, allowSkip: false, localeSupport: ['es', 'en'], expectedViewport: 'desktop-preferred', requiredOpenSections: ['recovery-scenario'],
  },
];

export const GUIDED_DEMO_STEPS: GuidedDemoStep[] = baseSteps.map((step, index, steps) => ({
  ...step,
  previousStepId: steps[index - 1]?.id,
  nextStepId: steps[index + 1]?.id,
}));

const text: Record<ClimateRecoveryLocale, Record<GuidedDemoTextKey, string>> = {
  es: {
    'step.problem.title': 'El problema', 'step.problem.subtitle': 'Cinco activos · catorce casos sintéticos',
    'step.problem.narrative': 'Las plantas renovables generan grandes volúmenes de datos, pero no todas las pérdidas se identifican o priorizan a tiempo.',
    'step.problem.point.assets': 'Portafolio ejecutivo de cinco activos sintéticos.', 'step.problem.point.cases': 'Catorce casos deterministas, sin datos reales.',
    'step.opportunity.title': 'La oportunidad', 'step.opportunity.subtitle': 'De pérdidas potenciales a prioridades explicables',
    'step.opportunity.narrative': 'ORBI convierte pérdidas potenciales en oportunidades estimadas y priorizadas, conservando incertidumbre y revisión humana.',
    'step.opportunity.point.estimate': 'Energía e impacto climático permanecen etiquetados como estimaciones.', 'step.opportunity.point.review': 'El KPI de revisión usa la misma regla canónica que la cola.',
    'step.ranking.title': 'Priorización del portafolio', 'step.ranking.subtitle': 'La energía no es el único criterio',
    'step.ranking.narrative': 'La prioridad también considera calidad de datos, confianza, recuperabilidad y posibles solapamientos.',
    'step.ranking.point.score': 'El Climate Opportunity Score es transparente y no probabilístico.', 'step.ranking.point.quality': 'Las penalizaciones y la calidad de datos permanecen visibles.',
    'step.recoverable.title': 'Un caso potencialmente recuperable', 'step.recoverable.subtitle': 'Evidencia, hipótesis y siguiente paso',
    'step.recoverable.narrative': 'La evidencia sugiere una oportunidad recuperable, pero no constituye un diagnóstico definitivo ni una orden.',
    'step.recoverable.point.evidence': 'La evidencia a favor, contradictoria y faltante sigue disponible.', 'step.recoverable.point.human': 'Toda intervención requiere revisión y aprobación humana.',
    'step.nonrecoverable.title': 'No toda pérdida es recuperable', 'step.nonrecoverable.subtitle': 'La clasificación evita falsos fallos',
    'step.nonrecoverable.narrative': 'Una limitación de red o el clipping de diseño no se convierten automáticamente en mantenimiento recuperable.',
    'step.nonrecoverable.point.classification': 'La recuperabilidad se evalúa antes de presentar impacto.', 'step.nonrecoverable.point.suppressed': 'Las acciones no recomendadas se separan y explican.',
    'step.insufficient.title': 'Datos insuficientes', 'step.insufficient.subtitle': 'El sistema se detiene antes de inventar',
    'step.insufficient.narrative': 'Cuando faltan señales críticas, la energía y el impacto climático quedan no disponibles o bloqueados.',
    'step.insufficient.point.blocked': 'Los motivos de bloqueo permanecen visibles.', 'step.insufficient.point.data': 'El siguiente paso es solicitar más datos, no afirmar una causa.',
    'step.explainability.title': 'Explicabilidad y revisión humana', 'step.explainability.subtitle': 'Reglas trazables; decisión humana',
    'step.explainability.narrative': 'La IA propone hipótesis explicables. La persona operadora conserva la autoridad y decide qué evidencia revisar.',
    'step.explainability.point.rules': 'Reglas, evidencia y contradicciones son inspeccionables.', 'step.explainability.point.operator': 'La cola es informativa; no aprueba ni despacha trabajo.',
    'step.climate.title': 'Recuperación climática', 'step.climate.subtitle': 'Un contrafactual estimado, no un resultado verificado',
    'step.climate.narrative': 'Cada MWh potencialmente recuperado importa, pero el escenario y las emisiones evitadas siguen siendo estimaciones sintéticas no verificadas.',
    'step.climate.point.counterfactual': 'Se comparan escenarios sin intervención y con intervención humana aprobada.', 'step.climate.point.unverified': 'El factor, la metodología y los límites permanecen visibles.',
    'warning.synthetic': 'Datos sintéticos de demostración.', 'warning.estimated': 'Estimación, no medición.', 'warning.humanReview': 'Revisión humana requerida.',
  },
  en: {
    'step.problem.title': 'The Problem', 'step.problem.subtitle': 'Five assets · fourteen synthetic cases',
    'step.problem.narrative': 'Renewable plants generate large volumes of data, but not every loss is identified or prioritized in time.',
    'step.problem.point.assets': 'Executive portfolio of five synthetic assets.', 'step.problem.point.cases': 'Fourteen deterministic cases with no real data.',
    'step.opportunity.title': 'The Opportunity', 'step.opportunity.subtitle': 'From potential losses to explainable priorities',
    'step.opportunity.narrative': 'ORBI turns potential losses into estimated, prioritized opportunities while preserving uncertainty and human review.',
    'step.opportunity.point.estimate': 'Energy and climate impact remain explicitly estimated.', 'step.opportunity.point.review': 'The review KPI uses the same canonical rule as the queue.',
    'step.ranking.title': 'Portfolio Prioritization', 'step.ranking.subtitle': 'Energy is not the only criterion',
    'step.ranking.narrative': 'Priority also considers data quality, confidence, recoverability, and possible overlap.',
    'step.ranking.point.score': 'Climate Opportunity Score is transparent and non-probabilistic.', 'step.ranking.point.quality': 'Penalties and data quality remain visible.',
    'step.recoverable.title': 'A Potentially Recoverable Case', 'step.recoverable.subtitle': 'Evidence, hypothesis, and next step',
    'step.recoverable.narrative': 'Evidence suggests a recoverable opportunity, but it is not a definitive diagnosis or an order.',
    'step.recoverable.point.evidence': 'Supporting, contradicting, and missing evidence remains available.', 'step.recoverable.point.human': 'Every intervention requires human review and approval.',
    'step.nonrecoverable.title': 'Not Every Loss Is Recoverable', 'step.nonrecoverable.subtitle': 'Classification avoids false failures',
    'step.nonrecoverable.narrative': 'Grid limitation or design clipping is not automatically converted into recoverable maintenance.',
    'step.nonrecoverable.point.classification': 'Recoverability is evaluated before impact is presented.', 'step.nonrecoverable.point.suppressed': 'Suppressed actions are separated and explained.',
    'step.insufficient.title': 'Insufficient Data', 'step.insufficient.subtitle': 'The system stops before inventing',
    'step.insufficient.narrative': 'When critical signals are missing, energy and climate impact remain unavailable or blocked.',
    'step.insufficient.point.blocked': 'Blocking reasons remain visible.', 'step.insufficient.point.data': 'The next step is to request more data, not assert a cause.',
    'step.explainability.title': 'Explainability and Human Review', 'step.explainability.subtitle': 'Traceable rules; human decision',
    'step.explainability.narrative': 'AI provides explainable hypotheses. The operator retains authority and decides which evidence to review.',
    'step.explainability.point.rules': 'Rules, evidence, and contradictions are inspectable.', 'step.explainability.point.operator': 'The queue is informational; it does not approve or dispatch work.',
    'step.climate.title': 'Climate Recovery', 'step.climate.subtitle': 'An estimated counterfactual, not a verified outcome',
    'step.climate.narrative': 'Every potentially recovered MWh matters, while the scenario and avoided emissions remain unverified synthetic estimates.',
    'step.climate.point.counterfactual': 'No-intervention and human-approved intervention scenarios are compared.', 'step.climate.point.unverified': 'The factor, methodology, and limitations remain visible.',
    'warning.synthetic': 'Synthetic demonstration data.', 'warning.estimated': 'Estimate, not measurement.', 'warning.humanReview': 'Human review required.',
  },
};

export const getGuidedDemoText = (locale: ClimateRecoveryLocale, key: GuidedDemoTextKey) => text[locale][key];

export const createGuidedDemoState = (locale: ClimateRecoveryLocale, reducedMotion = false): GuidedDemoState => ({
  active: false,
  currentStepId: GUIDED_DEMO_STEPS[0].id,
  completedStepIds: [],
  startedAt: '2026-08-03T12:00:00.000Z',
  locale,
  mode: 'free',
  reducedMotion,
  narrationVisible: true,
});

export const resetGuidedDemo = (
  state: GuidedDemoState,
  locale: ClimateRecoveryLocale = state.locale,
): GuidedDemoState => ({ ...createGuidedDemoState(locale, state.reducedMotion), active: true, mode: 'guided' });

export const guidedDemoStepById = (stepId: string) => GUIDED_DEMO_STEPS.find((step) => step.id === stepId) ?? GUIDED_DEMO_STEPS[0];

export const advanceGuidedDemo = (state: GuidedDemoState): GuidedDemoState => {
  const step = guidedDemoStepById(state.currentStepId);
  if (!step.nextStepId) return { ...state, active: false, mode: 'free' };
  return {
    ...state,
    currentStepId: step.nextStepId,
    completedStepIds: [...new Set([...state.completedStepIds, step.id])],
  };
};

export const previousGuidedDemo = (state: GuidedDemoState): GuidedDemoState => {
  const previousStepId = guidedDemoStepById(state.currentStepId).previousStepId;
  return previousStepId ? { ...state, currentStepId: previousStepId } : state;
};

export const skipGuidedDemo = (state: GuidedDemoState): GuidedDemoState => advanceGuidedDemo(state);

export const exitGuidedDemo = (state: GuidedDemoState): GuidedDemoState => ({ ...state, active: false, mode: 'free' });
