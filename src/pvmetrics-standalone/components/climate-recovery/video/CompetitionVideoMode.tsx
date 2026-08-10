import React from 'react';
import type { ClimateRecoveryLocale } from '../copy';
import type { CompetitionVideoState } from './competitionVideoContracts';
import { COMPETITION_VIDEO_CHAPTERS, competitionVideoChapterById } from './competitionVideoScript';
import { CinematicOpening } from './CinematicOpening';
import { VideoChapterFrame } from './VideoChapterFrame';
import { VideoClosingFrame } from './VideoClosingFrame';
import { VideoNarrationCue } from './VideoNarrationCue';
import { VideoRecordingControls } from './VideoRecordingControls';
import { VideoTimingGuide } from './VideoTimingGuide';

export const CompetitionVideoMode: React.FC<{
  state: CompetitionVideoState;
  locale: ClimateRecoveryLocale;
  onBegin: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReplay: () => void;
  onTogglePause: () => void;
  onToggleCues: () => void;
  onToggleTiming: () => void;
  onReset: () => void;
  onExit: () => void;
  onReturnToPresentation: () => void;
  children: React.ReactNode;
}> = ({ state, locale, onBegin, onPrevious, onNext, onReplay, onTogglePause, onToggleCues, onToggleTiming, onReset, onExit, onReturnToPresentation, children }) => {
  const chapter = competitionVideoChapterById(state.currentChapterId);
  if (!state.started && chapter.id === 'opening') return <CinematicOpening locale={locale} reducedMotion={state.reducedMotion} onBegin={onBegin} onExit={onExit} />;

  return (
    <section className="cr-video-mode space-y-4" data-testid="competition-video-mode" data-video-chapter={chapter.id} data-navigation-status={state.navigationStatus} data-recording-safe={state.recordingSafe}>
      <nav className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/85 p-2" aria-label="Competition video chapters">
        <ol className="flex min-w-max gap-2">
          {COMPETITION_VIDEO_CHAPTERS.map((item) => <li key={item.id} aria-current={item.id === chapter.id ? 'step' : undefined} className={`rounded-lg px-3 py-2 text-xs font-bold ${item.id === chapter.id ? 'bg-amber-400 text-slate-950' : state.completedChapterIds.includes(item.id) ? 'bg-cyan-500/10 text-cyan-200' : 'text-slate-500'}`}>{item.order}</li>)}
        </ol>
      </nav>
      <div className="cr-video-scroll-region space-y-4">
        {chapter.id === 'closing' ? <VideoClosingFrame locale={locale} /> : <VideoChapterFrame chapter={chapter} locale={locale} navigationStatus={state.navigationStatus} />}
        {state.timingGuideVisible && <VideoTimingGuide chapter={chapter} locale={locale} />}
        <div className={`grid min-w-0 gap-4 ${state.narrationVisible ? 'xl:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]' : ''}`}>
          {state.narrationVisible && <VideoNarrationCue chapter={chapter} locale={locale} />}
          <div className="cr-video-product-stage min-w-0 space-y-4">{chapter.id !== 'closing' && children}</div>
        </div>
      </div>
      <VideoRecordingControls chapter={chapter} locale={locale} navigationStatus={state.navigationStatus} paused={state.paused} cuesVisible={state.narrationVisible} timingVisible={state.timingGuideVisible} onPrevious={onPrevious} onNext={onNext} onReplay={onReplay} onTogglePause={onTogglePause} onToggleCues={onToggleCues} onToggleTiming={onToggleTiming} onReset={onReset} onExit={onExit} onReturnToPresentation={onReturnToPresentation} />
    </section>
  );
};

export default CompetitionVideoMode;
