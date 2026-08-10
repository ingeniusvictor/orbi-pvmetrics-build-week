import React from 'react';
import type { ClimateRecoveryLocale } from '../copy';
import type { CompetitionVideoChapter, CompetitionVideoTextKey } from './competitionVideoContracts';
import { getCompetitionVideoText as text } from './competitionVideoScript';

const chapterKey = (chapter: CompetitionVideoChapter, field: 'fact' | 'warning' | 'action' | 'pronunciation') => `${chapter.id}.${field}` as CompetitionVideoTextKey;

export const VideoNarrationCue: React.FC<{ chapter: CompetitionVideoChapter; locale: ClimateRecoveryLocale }> = ({ chapter, locale }) => (
  <aside className="cr-video-cues rounded-2xl border border-slate-700/70 bg-slate-950/88 p-4" data-recording-excluded aria-label={text(locale, 'common.presenterCue')}>
    <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">{text(locale, 'common.presenterCue')}</p>
    <dl className="mt-3 space-y-3 text-xs leading-5">
      <div><dt className="font-bold text-cyan-200">{text(locale, 'common.suggestedPhrase')}</dt><dd className="mt-1 text-slate-300">{text(locale, chapter.narrationKey)}</dd></div>
      <div><dt className="font-bold text-cyan-200">{text(locale, 'common.keyFact')}</dt><dd className="mt-1 text-slate-300">{text(locale, chapterKey(chapter, 'fact'))}</dd></div>
      <div><dt className="font-bold text-cyan-200">{text(locale, 'common.nextAction')}</dt><dd className="mt-1 text-slate-300">{text(locale, chapterKey(chapter, 'action'))}</dd></div>
      <div><dt className="font-bold text-amber-200">{text(locale, 'common.warning')}</dt><dd className="mt-1 text-slate-300">{text(locale, chapterKey(chapter, 'warning'))}</dd></div>
      <div><dt className="font-bold text-slate-400">{text(locale, 'common.pronunciation')}</dt><dd className="mt-1 text-slate-400">{text(locale, chapterKey(chapter, 'pronunciation'))}</dd></div>
      <div><dt className="font-bold text-slate-400">{text(locale, 'common.pauseLabel')}</dt><dd className="mt-1 font-mono text-slate-300">{chapter.pauseAfterSeconds}s</dd></div>
    </dl>
  </aside>
);
