import React from 'react';
import { ArrowLeft, ArrowRight, Captions, Clock3, LogOut, MonitorUp, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import type { ClimateRecoveryLocale } from '../copy';
import type { CompetitionVideoChapter, CompetitionVideoNavigationStatus } from './competitionVideoContracts';
import { getCompetitionVideoText as text } from './competitionVideoScript';

const button = 'cr-button inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40';

export const VideoRecordingControls: React.FC<{
  chapter: CompetitionVideoChapter;
  locale: ClimateRecoveryLocale;
  navigationStatus: CompetitionVideoNavigationStatus;
  paused: boolean;
  cuesVisible: boolean;
  timingVisible: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReplay: () => void;
  onTogglePause: () => void;
  onToggleCues: () => void;
  onToggleTiming: () => void;
  onReset: () => void;
  onExit: () => void;
  onReturnToPresentation: () => void;
}> = ({ chapter, locale, navigationStatus, paused, cuesVisible, timingVisible, onPrevious, onNext, onReplay, onTogglePause, onToggleCues, onToggleTiming, onReset, onExit, onReturnToPresentation }) => {
  const blocked = navigationStatus === 'pending' || navigationStatus === 'failed' || paused;
  return (
    <div className="cr-video-controls flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-700 bg-slate-950/90 p-3" aria-label="Competition video recording controls">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onExit} className={`${button} border-slate-700 text-slate-300`}><LogOut className="h-4 w-4" />{text(locale, 'common.exitVideo')}</button>
        <button type="button" onClick={onReturnToPresentation} className={`${button} border-cyan-500/40 text-cyan-200`}><MonitorUp className="h-4 w-4" />{text(locale, 'common.returnPresentation')}</button>
        <button type="button" onClick={onReset} className={`${button} border-slate-700 text-slate-300`}><RotateCcw className="h-4 w-4" />{text(locale, 'common.reset')}</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={paused} onClick={onTogglePause} className={`${button} border-slate-700 text-slate-200`}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{text(locale, paused ? 'common.resume' : 'common.pause')}</button>
        <button type="button" aria-pressed={cuesVisible} onClick={onToggleCues} className={`${button} border-slate-700 text-slate-200`}><Captions className="h-4 w-4" />{text(locale, cuesVisible ? 'common.hideCues' : 'common.showCues')}</button>
        <button type="button" aria-pressed={timingVisible} onClick={onToggleTiming} className={`${button} border-slate-700 text-slate-200`}><Clock3 className="h-4 w-4" />{text(locale, timingVisible ? 'common.hideTiming' : 'common.showTiming')}</button>
        <button type="button" disabled={!chapter.allowReplay || navigationStatus === 'pending'} onClick={onReplay} className={`${button} border-slate-700 text-slate-200`}><RotateCw className="h-4 w-4" />{text(locale, 'common.replay')}</button>
        <button type="button" disabled={!chapter.previousChapterId || navigationStatus === 'pending'} onClick={onPrevious} className={`${button} border-slate-700 text-slate-200`}><ArrowLeft className="h-4 w-4" />{text(locale, 'common.previous')}</button>
        <button type="button" disabled={!chapter.nextChapterId || blocked} onClick={onNext} className={`${button} border-amber-400 bg-amber-400 text-slate-950`}>{text(locale, 'common.next')}<ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
};
