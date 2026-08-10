import React from 'react';
import type { ClimateRecoveryLocale } from '../copy';
import type { CompetitionVideoChapter } from './competitionVideoContracts';
import { COMPETITION_VIDEO_TARGET_SECONDS, competitionVideoPlannedProgress, getCompetitionVideoText as text } from './competitionVideoScript';

const formatSeconds = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export const VideoTimingGuide: React.FC<{ chapter: CompetitionVideoChapter; locale: ClimateRecoveryLocale }> = ({ chapter, locale }) => {
  const progress = competitionVideoPlannedProgress(chapter.id);
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-3" data-recording-excluded aria-label={text(locale, 'common.plannedProgress')}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-400">{text(locale, 'common.plannedDuration')} <strong className="font-mono text-white">{formatSeconds(chapter.durationSeconds)}</strong></span>
        <span className="text-slate-400">{text(locale, 'common.plannedProgress')} <strong className="font-mono text-white">{formatSeconds(progress)}</strong></span>
        <span className="text-slate-400">{text(locale, 'common.targetTotal')} <strong className="font-mono text-white">{formatSeconds(COMPETITION_VIDEO_TARGET_SECONDS)}</strong></span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuemin={0} aria-valuemax={COMPETITION_VIDEO_TARGET_SECONDS} aria-valuenow={progress}>
        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-cyan-400" style={{ width: `${(progress / COMPETITION_VIDEO_TARGET_SECONDS) * 100}%` }} />
      </div>
    </div>
  );
};
