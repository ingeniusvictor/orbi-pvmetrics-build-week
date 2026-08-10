import type { ClimateRecoveryLocale } from '../copy';
import {
  createCompetitionVideoState,
  type CompetitionVideoAction,
  type CompetitionVideoChapter,
  type CompetitionVideoChapterId,
  type CompetitionVideoState,
  type CompetitionVideoTextKey,
} from './competitionVideoContracts';

const baseChapters: Array<Omit<CompetitionVideoChapter, 'nextChapterId' | 'previousChapterId'>> = [
  { id: 'opening', order: 1, titleKey: 'opening.title', subtitleKey: 'opening.subtitle', narrationKey: 'opening.narration', targetMode: 'presentation', targetSection: 'overview', durationSeconds: 20, pauseAfterSeconds: 1, cameraFocus: 'center-title', presenterCue: 'opening.cue', visualEmphasis: 'brand', disclosureRequired: ['synthetic', 'read-only', 'offline'], allowSkip: false, allowReplay: true },
  { id: 'loss-problem', order: 2, titleKey: 'loss-problem.title', subtitleKey: 'loss-problem.subtitle', narrationKey: 'loss-problem.narration', targetMode: 'guided', targetSection: 'overview', targetStepId: 'problem', durationSeconds: 20, pauseAfterSeconds: 1, cameraFocus: 'hero-scope', presenterCue: 'loss-problem.cue', visualEmphasis: 'problem', disclosureRequired: ['synthetic', 'read-only'], allowSkip: true, allowReplay: true },
  { id: 'portfolio-opportunity', order: 3, titleKey: 'portfolio-opportunity.title', subtitleKey: 'portfolio-opportunity.subtitle', narrationKey: 'portfolio-opportunity.narration', targetMode: 'guided', targetSection: 'overview', targetStepId: 'opportunity', durationSeconds: 30, pauseAfterSeconds: 1, cameraFocus: 'primary-kpis', presenterCue: 'portfolio-opportunity.cue', visualEmphasis: 'opportunity', disclosureRequired: ['synthetic', 'estimated', 'counterfactual'], allowSkip: true, allowReplay: true },
  { id: 'prioritization', order: 4, titleKey: 'prioritization.title', subtitleKey: 'prioritization.subtitle', narrationKey: 'prioritization.narration', targetMode: 'guided', targetSection: 'overview', targetStepId: 'ranking', durationSeconds: 35, pauseAfterSeconds: 1, cameraFocus: 'ranking', presenterCue: 'prioritization.cue', visualEmphasis: 'integrity', disclosureRequired: ['synthetic', 'estimated'], allowSkip: true, allowReplay: true },
  { id: 'recoverable-case', order: 5, titleKey: 'recoverable-case.title', subtitleKey: 'recoverable-case.subtitle', narrationKey: 'recoverable-case.narration', targetMode: 'guided', targetSection: 'case', targetStepId: 'recoverable-case', targetCaseId: 'DEMO-CR-CASE-A', durationSeconds: 55, pauseAfterSeconds: 1, cameraFocus: 'case-evidence', presenterCue: 'recoverable-case.cue', visualEmphasis: 'evidence', disclosureRequired: ['synthetic', 'estimated', 'human-review', 'non-operational'], allowSkip: true, allowReplay: true },
  { id: 'not-every-loss', order: 6, titleKey: 'not-every-loss.title', subtitleKey: 'not-every-loss.subtitle', narrationKey: 'not-every-loss.narration', targetMode: 'guided', targetSection: 'case', targetStepId: 'non-recoverable', targetCaseId: 'DEMO-CR-CASE-B', durationSeconds: 35, pauseAfterSeconds: 1, cameraFocus: 'exception-proof', presenterCue: 'not-every-loss.cue', visualEmphasis: 'boundary', disclosureRequired: ['synthetic', 'human-review', 'non-operational'], allowSkip: true, allowReplay: true },
  { id: 'explainability-review', order: 7, titleKey: 'explainability-review.title', subtitleKey: 'explainability-review.subtitle', narrationKey: 'explainability-review.narration', targetMode: 'guided', targetSection: 'review', targetStepId: 'explainability', durationSeconds: 30, pauseAfterSeconds: 1, cameraFocus: 'review-queue', presenterCue: 'explainability-review.cue', visualEmphasis: 'accountability', disclosureRequired: ['synthetic', 'human-review', 'non-operational'], allowSkip: true, allowReplay: true },
  { id: 'climate-impact', order: 8, titleKey: 'climate-impact.title', subtitleKey: 'climate-impact.subtitle', narrationKey: 'climate-impact.narration', targetMode: 'guided', targetSection: 'case', targetStepId: 'climate-impact', targetCaseId: 'DEMO-CR-CASE-A', durationSeconds: 25, pauseAfterSeconds: 1, cameraFocus: 'scenario-impact', presenterCue: 'climate-impact.cue', visualEmphasis: 'climate', disclosureRequired: ['synthetic', 'estimated', 'counterfactual', 'unverified'], allowSkip: false, allowReplay: true },
  { id: 'closing', order: 9, titleKey: 'closing.title', subtitleKey: 'closing.subtitle', narrationKey: 'closing.narration', targetMode: 'presentation', targetSection: 'overview', durationSeconds: 10, pauseAfterSeconds: 5, cameraFocus: 'center-closing', presenterCue: 'closing.cue', visualEmphasis: 'call-to-action', disclosureRequired: ['synthetic', 'estimated', 'human-review', 'non-operational'], allowSkip: false, allowReplay: true },
];

export const COMPETITION_VIDEO_CHAPTERS: readonly CompetitionVideoChapter[] = baseChapters.map((chapter, index, chapters) => ({
  ...chapter,
  previousChapterId: chapters[index - 1]?.id,
  nextChapterId: chapters[index + 1]?.id,
}));

export const COMPETITION_VIDEO_TARGET_SECONDS = 260;
export const COMPETITION_VIDEO_MIN_SECONDS = 225;
export const COMPETITION_VIDEO_MAX_SECONDS = 280;

export const competitionVideoChapterById = (chapterId: CompetitionVideoChapterId) =>
  COMPETITION_VIDEO_CHAPTERS.find((chapter) => chapter.id === chapterId) ?? COMPETITION_VIDEO_CHAPTERS[0];

export const competitionVideoPlannedProgress = (chapterId: CompetitionVideoChapterId) => {
  const current = competitionVideoChapterById(chapterId);
  return COMPETITION_VIDEO_CHAPTERS
    .filter((chapter) => chapter.order <= current.order)
    .reduce((total, chapter) => total + chapter.durationSeconds, 0);
};

export const validateCompetitionVideoChapters = () => {
  const issues: string[] = [];
  const ids = new Set(COMPETITION_VIDEO_CHAPTERS.map((chapter) => chapter.id));
  if (ids.size !== COMPETITION_VIDEO_CHAPTERS.length) issues.push('Chapter IDs must be unique.');
  COMPETITION_VIDEO_CHAPTERS.forEach((chapter, index) => {
    if (chapter.order !== index + 1) issues.push(`Chapter ${chapter.id} order is not contiguous.`);
    if (chapter.durationSeconds <= 0) issues.push(`Chapter ${chapter.id} duration must be positive.`);
    if (chapter.pauseAfterSeconds < 0) issues.push(`Chapter ${chapter.id} pause must be non-negative.`);
    if (chapter.previousChapterId !== COMPETITION_VIDEO_CHAPTERS[index - 1]?.id) issues.push(`Chapter ${chapter.id} previous link is invalid.`);
    if (chapter.nextChapterId !== COMPETITION_VIDEO_CHAPTERS[index + 1]?.id) issues.push(`Chapter ${chapter.id} next link is invalid.`);
    if (chapter.disclosureRequired.length === 0) issues.push(`Chapter ${chapter.id} requires a disclosure.`);
  });
  const total = COMPETITION_VIDEO_CHAPTERS.reduce((sum, chapter) => sum + chapter.durationSeconds, 0);
  if (total !== COMPETITION_VIDEO_TARGET_SECONDS) issues.push(`Planned total must be ${COMPETITION_VIDEO_TARGET_SECONDS} seconds.`);
  return { valid: issues.length === 0, issues, totalSeconds: total };
};

export const reduceCompetitionVideoState = (
  state: CompetitionVideoState,
  action: CompetitionVideoAction,
): CompetitionVideoState => {
  const chapter = competitionVideoChapterById(state.currentChapterId);
  switch (action.type) {
    case 'start':
      return { ...createCompetitionVideoState(action.locale, action.context, action.reducedMotion), active: true };
    case 'begin':
      return chapter.nextChapterId
        ? { ...state, started: true, currentChapterId: chapter.nextChapterId, completedChapterIds: ['opening'], navigationStatus: 'pending' }
        : state;
    case 'next':
      if (!chapter.nextChapterId || state.navigationStatus === 'pending' || state.navigationStatus === 'failed' || state.paused) return state;
      return { ...state, currentChapterId: chapter.nextChapterId, completedChapterIds: [...new Set([...state.completedChapterIds, chapter.id])], navigationStatus: chapter.nextChapterId === 'closing' ? 'ready' : 'pending' };
    case 'previous':
      if (!chapter.previousChapterId || state.navigationStatus === 'pending') return state;
      return { ...state, currentChapterId: chapter.previousChapterId, started: chapter.previousChapterId !== 'opening', navigationStatus: chapter.previousChapterId === 'opening' ? 'idle' : 'pending' };
    case 'replay':
      return chapter.allowReplay ? { ...state, replaySequence: state.replaySequence + 1, navigationStatus: chapter.targetStepId ? 'pending' : 'ready' } : state;
    case 'pause':
      return { ...state, paused: true, navigationStatus: 'paused' };
    case 'resume':
      return { ...state, paused: false, navigationStatus: chapter.targetStepId ? 'pending' : 'ready', replaySequence: state.replaySequence + 1 };
    case 'toggle-cues':
      return { ...state, narrationVisible: !state.narrationVisible };
    case 'toggle-timing':
      return { ...state, timingGuideVisible: !state.timingGuideVisible };
    case 'set-navigation':
      return state.paused ? state : { ...state, navigationStatus: action.status };
    case 'set-locale':
      return { ...state, locale: action.locale };
    case 'set-reduced-motion':
      return { ...state, reducedMotion: action.reducedMotion };
    case 'reset':
      return { ...createCompetitionVideoState(state.locale, {
        modeBeforeVideo: state.modeBeforeVideo,
        sectionBeforeVideo: state.sectionBeforeVideo,
        selectedCaseBeforeVideo: state.selectedCaseBeforeVideo,
        selectedPlantBeforeVideo: state.selectedPlantBeforeVideo,
        scrollBeforeVideo: state.scrollBeforeVideo,
      }, state.reducedMotion), active: true };
    case 'exit':
      return { ...state, active: false, paused: false, navigationStatus: 'idle' };
  }
};

const commonEs: Record<`common.${string}`, string> = {
  'common.product': 'ORBI PVMetrics IA', 'common.edition': 'Climate Recovery Edition',
  'common.hook': 'Las pérdidas de energía renovable no son igualmente recuperables.',
  'common.valueProposition': 'Prioriza la oportunidad correcta. Explica por qué. Mantén a las personas en control.',
  'common.syntheticExecutive': 'Demostración ejecutiva sintética', 'common.readOnly': 'Solo lectura', 'common.offline': 'Offline · sin red',
  'common.begin': 'Comenzar presentación', 'common.exit': 'Salir', 'common.chapter': 'Capítulo', 'common.of': 'de',
  'common.plannedDuration': 'Duración planificada', 'common.plannedProgress': 'Progreso planificado', 'common.targetTotal': 'Objetivo total',
  'common.presenterCue': 'Cue del presentador', 'common.suggestedPhrase': 'Frase sugerida', 'common.pauseLabel': 'Pausa',
  'common.nextAction': 'Siguiente acción', 'common.keyFact': 'Dato clave', 'common.warning': 'Advertencia', 'common.pronunciation': 'Pronunciación',
  'common.previous': 'Anterior', 'common.next': 'Siguiente', 'common.replay': 'Repetir capítulo', 'common.pause': 'Pausar guía', 'common.resume': 'Reanudar guía',
  'common.hideCues': 'Ocultar cues', 'common.showCues': 'Mostrar cues', 'common.hideTiming': 'Ocultar tiempos', 'common.showTiming': 'Mostrar tiempos',
  'common.reset': 'Reiniciar presentación', 'common.exitVideo': 'Salir del modo video', 'common.returnPresentation': 'Volver a Modo Presentación',
  'common.navigationPending': 'Preparando el destino del capítulo…', 'common.navigationFailed': 'El destino no está disponible. Reinicia la presentación para recuperar el recorrido.',
  'common.recordingSafe': 'Encuadre seguro para grabación', 'common.recordingSafeBoundary': 'Guía visual local; no garantiza el resultado final de grabación.',
  'common.everyMwh': 'Cada MWh potencialmente recuperado importa.', 'common.explainableAi': 'IA explicable.', 'common.humanReview': 'Revisión humana.',
  'common.estimatedImpact': 'Impacto climático estimado.', 'common.company': 'ORBI Ecosystem SpA.', 'common.syntheticDemo': 'Demostración sintética.',
  'common.decisionSupport': 'Soporte de decisión sintético — no es una orden operacional.',
  'common.closingCta': 'Prioriza la oportunidad correcta. Explica por qué. Mantén a las personas en control.',
  'common.proofHelios': 'Helios: la restricción de red no es recuperable mediante mantenimiento del activo.',
  'common.proofValle': 'Valle Verde: evidencia insuficiente; impacto bloqueado, no cero.',
};

const commonEn: typeof commonEs = {
  'common.product': 'ORBI PVMetrics IA', 'common.edition': 'Climate Recovery Edition',
  'common.hook': 'Renewable-energy losses are not equally recoverable.',
  'common.valueProposition': 'Prioritize the right opportunity. Explain why. Keep humans in control.',
  'common.syntheticExecutive': 'Synthetic Executive Demonstration', 'common.readOnly': 'Read-only', 'common.offline': 'Offline · no network',
  'common.begin': 'Begin Presentation', 'common.exit': 'Exit', 'common.chapter': 'Chapter', 'common.of': 'of',
  'common.plannedDuration': 'Planned duration', 'common.plannedProgress': 'Planned progress', 'common.targetTotal': 'Target total',
  'common.presenterCue': 'Presenter cue', 'common.suggestedPhrase': 'Suggested phrase', 'common.pauseLabel': 'Pause',
  'common.nextAction': 'Next action', 'common.keyFact': 'Key fact', 'common.warning': 'Warning', 'common.pronunciation': 'Pronunciation',
  'common.previous': 'Previous', 'common.next': 'Next', 'common.replay': 'Replay Chapter', 'common.pause': 'Pause guidance', 'common.resume': 'Resume guidance',
  'common.hideCues': 'Hide Cues', 'common.showCues': 'Show Cues', 'common.hideTiming': 'Hide Timing', 'common.showTiming': 'Show Timing',
  'common.reset': 'Reset Presentation', 'common.exitVideo': 'Exit Video Mode', 'common.returnPresentation': 'Return to Presentation Mode',
  'common.navigationPending': 'Preparing the chapter target…', 'common.navigationFailed': 'The target is unavailable. Reset the presentation to recover the flow.',
  'common.recordingSafe': 'Recording-safe frame', 'common.recordingSafeBoundary': 'Local visual guidance; it does not guarantee the final recording result.',
  'common.everyMwh': 'Every potentially recovered MWh matters.', 'common.explainableAi': 'Explainable AI.', 'common.humanReview': 'Human review.',
  'common.estimatedImpact': 'Estimated climate impact.', 'common.company': 'ORBI Ecosystem SpA.', 'common.syntheticDemo': 'Synthetic demonstration.',
  'common.decisionSupport': 'Synthetic decision support — not an operational order.',
  'common.closingCta': 'Prioritize the right opportunity. Explain why. Keep humans in control.',
  'common.proofHelios': 'Helios: grid curtailment is not recoverable through asset maintenance.',
  'common.proofValle': 'Valle Verde: insufficient evidence; impact is blocked, not zero.',
};

const chaptersEs: Record<`${CompetitionVideoChapterId}.${string}`, string> = {
  'opening.title': 'Recuperación climática, con evidencia y control humano', 'opening.subtitle': 'ORBI PVMetrics IA · Climate Recovery Edition', 'opening.narration': 'Las pérdidas renovables no son igualmente recuperables, medibles ni urgentes. Esta demostración sintética ayuda a decidir qué merece atención primero.', 'opening.cue': 'Mantén el cursor quieto y deja leer el alcance.', 'opening.fact': 'Cinco plantas sintéticas · catorce casos deterministas.', 'opening.warning': 'No sugieras datos reales ni operación productiva.', 'opening.action': 'Activa Comenzar presentación.', 'opening.pronunciation': 'ORBI: or-bi.',
  'loss-problem.title': 'El problema de las pérdidas renovables', 'loss-problem.subtitle': 'No toda pérdida merece la misma acción', 'loss-problem.narration': 'El desafío no es mostrar más datos: es priorizar pérdidas recuperables sin ocultar incertidumbre, excepciones ni evidencia faltante.', 'loss-problem.cue': 'Enmarca el problema antes de mostrar cifras.', 'loss-problem.fact': 'Cinco activos y catorce casos, todos sintéticos.', 'loss-problem.warning': 'No presentes el portafolio como telemetría live.', 'loss-problem.action': 'Avanza a los KPI ejecutivos.', 'loss-problem.pronunciation': 'Sintético: datos de demostración, no datos reales.',
  'portfolio-opportunity.title': 'Oportunidad del portafolio', 'portfolio-opportunity.subtitle': 'Valor estimado, no resultado medido', 'portfolio-opportunity.narration': 'El portafolio presenta 129.16 MWh recuperables estimados y 47.92 tCO2e evitadas estimadas bajo supuestos contrafactuales sintéticos.', 'portfolio-opportunity.cue': 'Lee energía y emisiones con sus unidades; pausa un segundo.', 'portfolio-opportunity.fact': '129.16 MWh · 47.92 tCO2e · catorce revisiones.', 'portfolio-opportunity.warning': 'Nunca digas recuperado, verificado o garantizado.', 'portfolio-opportunity.action': 'Mueve el foco al score y al Top 3.', 'portfolio-opportunity.pronunciation': 'MWh: megavatio-hora. tCO2e: toneladas de CO2 equivalente.',
  'prioritization.title': 'Priorización explicable', 'prioritization.subtitle': 'El score ordena; no predice probabilidad', 'prioritization.narration': 'Aurora lidera con 92.58 en banda Muy Alta. Costa Sur y Patagonia completan el Top 3; la penalización por solapamiento y el ranking completo siguen visibles.', 'prioritization.cue': 'Señala score, banda, Top 3 y penalización.', 'prioritization.fact': '92.58 es un índice interno transparente, no una probabilidad.', 'prioritization.warning': 'No lo llames predicción, precisión o certificación.', 'prioritization.action': 'Prepara el caso Aurora; espera el estado listo.', 'prioritization.pronunciation': 'Patagonia: pa-ta-go-nia.',
  'recoverable-case.title': 'Caso potencialmente recuperable', 'recoverable-case.subtitle': 'Evidencia, incertidumbre y siguiente paso acotado', 'recoverable-case.narration': 'Aurora presenta 9.8 MWh y 3.64 tCO2e estimados con 59% de confianza. La hipótesis sigue sin confirmar y la acción propuesta es de solo lectura y requiere revisión humana.', 'recoverable-case.cue': 'Recorre estado, evidencia, estimación, escenario y revisión.', 'recoverable-case.fact': '9.8 MWh · 3.64 tCO2e · 59% de confianza.', 'recoverable-case.warning': 'Confianza no significa probabilidad de éxito ni diagnóstico.', 'recoverable-case.action': 'Contrasta con resultados que no recomiendan recuperación.', 'recoverable-case.pronunciation': 'Aurora: au-ro-ra. Contrafactual: contra-factual.',
  'not-every-loss.title': 'No toda pérdida es recuperable', 'not-every-loss.subtitle': 'La integridad también consiste en detenerse', 'not-every-loss.narration': 'Helios clasifica la restricción de red como no recuperable mediante mantenimiento. Valle Verde bloquea el impacto cuando la evidencia es insuficiente; bloqueado no significa cero.', 'not-every-loss.cue': 'Contrasta Helios y Valle Verde sin acelerar.', 'not-every-loss.fact': 'Una buena priorización también suprime acciones inadecuadas.', 'not-every-loss.warning': 'No conviertas falta de datos en precisión falsa.', 'not-every-loss.action': 'Avanza a la cola de revisión humana.', 'not-every-loss.pronunciation': 'Helios: e-li-os. Valle Verde: va-ye ver-de.',
  'explainability-review.title': 'Explicabilidad y revisión humana', 'explainability-review.subtitle': 'Reglas trazables; autoridad humana', 'explainability-review.narration': 'Las catorce evaluaciones sintéticas entran a revisión. Motivos, brechas, urgencia, metodología, limitaciones y acciones suprimidas permanecen inspeccionables.', 'explainability-review.cue': 'Enfoca una tarjeta de revisión y la metodología.', 'explainability-review.fact': 'Catorce casos sintéticos requieren revisión humana.', 'explainability-review.warning': 'La cola no aprueba, despacha ni autoriza trabajo.', 'explainability-review.action': 'Regresa al escenario climático estimado.', 'explainability-review.pronunciation': 'Explicabilidad: ex-pli-ca-bi-li-dad.',
  'climate-impact.title': 'Impacto climático estimado', 'climate-impact.subtitle': 'Un contrafactual sintético y no verificado', 'climate-impact.narration': 'El escenario compara futuros sintéticos con y sin una intervención humana aprobada. Estructura una pregunta responsable; no promete energía recuperada ni emisiones verificadas.', 'climate-impact.cue': 'Mantén visibles factor, metodología y limitaciones.', 'climate-impact.fact': 'El impacto es estimado, contrafactual, sintético y no verificado.', 'climate-impact.warning': 'No digas que el producto previene emisiones.', 'climate-impact.action': 'Avanza al cierre y deja el cursor quieto.', 'climate-impact.pronunciation': 'Contrafactual: contra-factual.',
  'closing.title': 'Cada MWh potencialmente recuperado importa', 'closing.subtitle': 'Prioriza. Explica. Mantén a las personas en control.', 'closing.narration': 'ORBI PVMetrics IA reúne priorización, evidencia explicable, contexto climático y revisión humana en una experiencia coherente.', 'closing.cue': 'Sostén la pantalla al menos cinco segundos y guarda dos segundos de silencio.', 'closing.fact': 'Soporte de decisión sintético; no es una orden operacional.', 'closing.warning': 'No agregues claims de clientes, pilotos o despliegues.', 'closing.action': 'Finaliza la toma o vuelve a Modo Presentación.', 'closing.pronunciation': 'ORBI Ecosystem SpA: or-bi ecosystem ese-pe-a.',
};

const chaptersEn: typeof chaptersEs = {
  'opening.title': 'Climate recovery with evidence and human control', 'opening.subtitle': 'ORBI PVMetrics IA · Climate Recovery Edition', 'opening.narration': 'Renewable losses are not equally recoverable, measurable, or urgent. This synthetic demonstration helps teams decide what deserves attention first.', 'opening.cue': 'Keep the pointer still and let the scope remain readable.', 'opening.fact': 'Five synthetic plants · fourteen deterministic cases.', 'opening.warning': 'Do not imply real data or production operation.', 'opening.action': 'Activate Begin Presentation.', 'opening.pronunciation': 'ORBI: or-bee.',
  'loss-problem.title': 'The renewable-energy loss problem', 'loss-problem.subtitle': 'Not every loss deserves the same action', 'loss-problem.narration': 'The challenge is not showing more data. It is prioritizing recoverable loss without hiding uncertainty, exceptions, or missing evidence.', 'loss-problem.cue': 'Frame the problem before showing numbers.', 'loss-problem.fact': 'Five assets and fourteen cases, all synthetic.', 'loss-problem.warning': 'Do not present the portfolio as live telemetry.', 'loss-problem.action': 'Advance to the executive KPIs.', 'loss-problem.pronunciation': 'Synthetic means demonstration data, not real data.',
  'portfolio-opportunity.title': 'Portfolio opportunity', 'portfolio-opportunity.subtitle': 'Estimated value, not a measured outcome', 'portfolio-opportunity.narration': 'The portfolio presents 129.16 MWh estimated recoverable energy and 47.92 tCO2e estimated avoided emissions under synthetic counterfactual assumptions.', 'portfolio-opportunity.cue': 'Read energy and emissions with units; pause for one second.', 'portfolio-opportunity.fact': '129.16 MWh · 47.92 tCO2e · fourteen reviews.', 'portfolio-opportunity.warning': 'Never say recovered, verified, or guaranteed.', 'portfolio-opportunity.action': 'Move focus to the score and Top 3.', 'portfolio-opportunity.pronunciation': 'MWh: megawatt-hour. tCO2e: tonnes of CO2 equivalent.',
  'prioritization.title': 'Explainable prioritization', 'prioritization.subtitle': 'The score ranks; it does not predict probability', 'prioritization.narration': 'Aurora leads at 92.58 in the Very High band. Costa Sur and Patagonia complete the Top 3; the overlap penalty and complete ranking remain visible.', 'prioritization.cue': 'Point to score, band, Top 3, and penalty.', 'prioritization.fact': '92.58 is a transparent internal index, not a probability.', 'prioritization.warning': 'Do not call it prediction, accuracy, or certification.', 'prioritization.action': 'Prepare the Aurora case; wait for ready state.', 'prioritization.pronunciation': 'Patagonia: pat-a-go-nee-a.',
  'recoverable-case.title': 'A potentially recoverable case', 'recoverable-case.subtitle': 'Evidence, uncertainty, and a bounded next step', 'recoverable-case.narration': 'Aurora presents 9.8 MWh and 3.64 tCO2e estimated at 59% confidence. The hypothesis remains unconfirmed, and the proposed read-only action requires human review.', 'recoverable-case.cue': 'Move through status, evidence, estimate, scenario, and review.', 'recoverable-case.fact': '9.8 MWh · 3.64 tCO2e · 59% confidence.', 'recoverable-case.warning': 'Confidence is not success probability or diagnosis.', 'recoverable-case.action': 'Contrast outcomes that do not recommend recovery.', 'recoverable-case.pronunciation': 'Aurora: aw-roar-a. Counterfactual: counter-factual.',
  'not-every-loss.title': 'Not every loss is recoverable', 'not-every-loss.subtitle': 'Integrity also means knowing when to stop', 'not-every-loss.narration': 'Helios classifies grid curtailment as non-recoverable through asset maintenance. Valle Verde blocks impact when evidence is insufficient; blocked does not mean zero.', 'not-every-loss.cue': 'Contrast Helios and Valle Verde without rushing.', 'not-every-loss.fact': 'Good prioritization also suppresses inappropriate actions.', 'not-every-loss.warning': 'Do not turn missing data into false precision.', 'not-every-loss.action': 'Advance to the human-review queue.', 'not-every-loss.pronunciation': 'Helios: hee-lee-os. Valle Verde: vah-yeh ver-deh.',
  'explainability-review.title': 'Explainability and human review', 'explainability-review.subtitle': 'Traceable rules; human authority', 'explainability-review.narration': 'All fourteen synthetic assessments enter review. Reasons, evidence gaps, urgency, methodology, limitations, and suppressed actions remain inspectable.', 'explainability-review.cue': 'Focus one review card and the methodology.', 'explainability-review.fact': 'Fourteen synthetic cases require human review.', 'explainability-review.warning': 'The queue does not approve, dispatch, or authorize work.', 'explainability-review.action': 'Return to the estimated climate scenario.', 'explainability-review.pronunciation': 'Explainability: ex-plain-a-bility.',
  'climate-impact.title': 'Estimated climate impact', 'climate-impact.subtitle': 'A synthetic, unverified counterfactual', 'climate-impact.narration': 'The scenario compares synthetic futures with and without a human-approved intervention. It structures a responsible question; it does not promise recovered energy or verified emissions.', 'climate-impact.cue': 'Keep factor, methodology, and limitations visible.', 'climate-impact.fact': 'Impact is estimated, counterfactual, synthetic, and unverified.', 'climate-impact.warning': 'Do not say the product prevents emissions.', 'climate-impact.action': 'Advance to the close and keep the pointer still.', 'climate-impact.pronunciation': 'Counterfactual: counter-factual.',
  'closing.title': 'Every potentially recovered MWh matters', 'closing.subtitle': 'Prioritize. Explain. Keep humans in control.', 'closing.narration': 'ORBI PVMetrics IA brings prioritization, explainable evidence, climate context, and human review into one coherent experience.', 'closing.cue': 'Hold for at least five seconds and leave two seconds of silence.', 'closing.fact': 'Synthetic decision support; not an operational order.', 'closing.warning': 'Do not add customer, pilot, or deployment claims.', 'closing.action': 'End the take or return to Presentation Mode.', 'closing.pronunciation': 'ORBI Ecosystem SpA: or-bee ecosystem ess-pee-ay.',
};

const text: Record<ClimateRecoveryLocale, Record<CompetitionVideoTextKey, string>> = {
  es: { ...commonEs, ...chaptersEs } as Record<CompetitionVideoTextKey, string>,
  en: { ...commonEn, ...chaptersEn } as Record<CompetitionVideoTextKey, string>,
};

export const getCompetitionVideoText = (locale: ClimateRecoveryLocale, key: CompetitionVideoTextKey) => text[locale][key];

export const getCompetitionVideoTextRegistry = (locale: ClimateRecoveryLocale) => ({ ...text[locale] });
