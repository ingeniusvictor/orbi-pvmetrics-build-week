import type { ClimateRecoveryLocale } from '../copy';
import type { ClimateRecoverySection } from '../hooks/useClimateRecoveryDemo';

export type CompetitionVideoChapterId =
  | 'opening'
  | 'loss-problem'
  | 'portfolio-opportunity'
  | 'prioritization'
  | 'recoverable-case'
  | 'not-every-loss'
  | 'explainability-review'
  | 'climate-impact'
  | 'closing';

type CompetitionVideoCommonTextKey =
  | 'product' | 'edition' | 'hook' | 'valueProposition' | 'syntheticExecutive'
  | 'readOnly' | 'offline' | 'begin' | 'exit' | 'chapter' | 'of'
  | 'plannedDuration' | 'plannedProgress' | 'targetTotal' | 'presenterCue'
  | 'suggestedPhrase' | 'pauseLabel' | 'nextAction' | 'keyFact' | 'warning'
  | 'pronunciation' | 'previous' | 'next' | 'replay' | 'pause' | 'resume'
  | 'hideCues' | 'showCues' | 'hideTiming' | 'showTiming' | 'reset'
  | 'exitVideo' | 'returnPresentation' | 'navigationPending' | 'navigationFailed'
  | 'recordingSafe' | 'recordingSafeBoundary' | 'everyMwh' | 'explainableAi'
  | 'humanReview' | 'estimatedImpact' | 'company' | 'syntheticDemo'
  | 'decisionSupport' | 'closingCta' | 'proofHelios' | 'proofValle';

type CompetitionVideoChapterTextField =
  | 'title' | 'subtitle' | 'narration' | 'cue' | 'fact' | 'warning'
  | 'action' | 'pronunciation';

export type CompetitionVideoTextKey =
  | `common.${CompetitionVideoCommonTextKey}`
  | `${CompetitionVideoChapterId}.${CompetitionVideoChapterTextField}`;

export type CompetitionVideoCameraFocus =
  | 'center-title' | 'hero-scope' | 'primary-kpis' | 'ranking'
  | 'case-evidence' | 'exception-proof' | 'review-queue'
  | 'scenario-impact' | 'center-closing';

export type CompetitionVideoEmphasis =
  | 'brand' | 'problem' | 'opportunity' | 'integrity' | 'evidence'
  | 'boundary' | 'accountability' | 'climate' | 'call-to-action';

export type CompetitionVideoDisclosure =
  | 'synthetic' | 'estimated' | 'read-only' | 'offline'
  | 'human-review' | 'counterfactual' | 'unverified' | 'non-operational';

export type CompetitionVideoNavigationStatus = 'idle' | 'pending' | 'ready' | 'failed' | 'paused';

export type CompetitionVideoPresenterCueKind =
  | 'phrase' | 'pause' | 'action' | 'fact' | 'warning' | 'pronunciation';

export type CompetitionVideoChapter = {
  id: CompetitionVideoChapterId;
  order: number;
  titleKey: CompetitionVideoTextKey;
  subtitleKey: CompetitionVideoTextKey;
  narrationKey: CompetitionVideoTextKey;
  targetMode: 'presentation' | 'guided';
  targetSection: ClimateRecoverySection;
  targetStepId?: string;
  targetCaseId?: string;
  durationSeconds: number;
  pauseAfterSeconds: number;
  cameraFocus: CompetitionVideoCameraFocus;
  presenterCue: CompetitionVideoTextKey;
  visualEmphasis: CompetitionVideoEmphasis;
  disclosureRequired: readonly CompetitionVideoDisclosure[];
  allowSkip: boolean;
  allowReplay: boolean;
  nextChapterId?: CompetitionVideoChapterId;
  previousChapterId?: CompetitionVideoChapterId;
};

export type CompetitionVideoState = {
  active: boolean;
  started: boolean;
  paused: boolean;
  currentChapterId: CompetitionVideoChapterId;
  completedChapterIds: CompetitionVideoChapterId[];
  locale: ClimateRecoveryLocale;
  narrationVisible: boolean;
  timingGuideVisible: boolean;
  recordingSafe: boolean;
  reducedMotion: boolean;
  modeBeforeVideo: 'free' | 'guided' | 'presentation';
  sectionBeforeVideo: ClimateRecoverySection;
  selectedCaseBeforeVideo?: string;
  selectedPlantBeforeVideo?: string;
  scrollBeforeVideo: number;
  navigationStatus: CompetitionVideoNavigationStatus;
  replaySequence: number;
};

export type CompetitionVideoInitialContext = Pick<
  CompetitionVideoState,
  'modeBeforeVideo' | 'sectionBeforeVideo' | 'selectedCaseBeforeVideo'
  | 'selectedPlantBeforeVideo' | 'scrollBeforeVideo'
>;

export type CompetitionVideoAction =
  | { type: 'start'; context: CompetitionVideoInitialContext; locale: ClimateRecoveryLocale; reducedMotion: boolean }
  | { type: 'begin' }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'replay' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'toggle-cues' }
  | { type: 'toggle-timing' }
  | { type: 'set-navigation'; status: CompetitionVideoNavigationStatus }
  | { type: 'set-locale'; locale: ClimateRecoveryLocale }
  | { type: 'set-reduced-motion'; reducedMotion: boolean }
  | { type: 'reset' }
  | { type: 'exit' };

export const DEFAULT_COMPETITION_VIDEO_CONTEXT: CompetitionVideoInitialContext = {
  modeBeforeVideo: 'free',
  sectionBeforeVideo: 'overview',
  scrollBeforeVideo: 0,
};

export const createCompetitionVideoState = (
  locale: ClimateRecoveryLocale,
  context: CompetitionVideoInitialContext = DEFAULT_COMPETITION_VIDEO_CONTEXT,
  reducedMotion = false,
): CompetitionVideoState => ({
  active: false,
  started: false,
  paused: false,
  currentChapterId: 'opening',
  completedChapterIds: [],
  locale,
  narrationVisible: true,
  timingGuideVisible: true,
  recordingSafe: true,
  reducedMotion,
  ...context,
  navigationStatus: 'idle',
  replaySequence: 0,
});
