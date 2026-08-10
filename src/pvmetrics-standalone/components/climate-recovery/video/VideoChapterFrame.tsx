import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Film, ShieldCheck } from 'lucide-react';
import type { ClimateRecoveryLocale } from '../copy';
import type { CompetitionVideoChapter, CompetitionVideoNavigationStatus } from './competitionVideoContracts';
import { COMPETITION_VIDEO_CHAPTERS, getCompetitionVideoText as text } from './competitionVideoScript';

export const VideoChapterFrame: React.FC<{
  chapter: CompetitionVideoChapter;
  locale: ClimateRecoveryLocale;
  navigationStatus: CompetitionVideoNavigationStatus;
}> = ({ chapter, locale, navigationStatus }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [chapter.id]);
  return (
    <header className="cr-video-chapter-frame cr-video-safe-frame rounded-3xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 shadow-[var(--cr-shadow-md)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-4xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-amber-300"><Film className="h-4 w-4" />{text(locale, 'common.chapter')} {chapter.order} {text(locale, 'common.of')} {COMPETITION_VIDEO_CHAPTERS.length}</p>
          <h1 ref={headingRef} id="competition-video-chapter-heading" tabIndex={-1} className="mt-3 text-3xl font-black leading-tight tracking-[-0.035em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:text-4xl">{text(locale, chapter.titleKey)}</h1>
          <p className="mt-2 text-sm leading-6 text-cyan-100">{text(locale, chapter.subtitleKey)}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-amber-200">{text(locale, 'common.syntheticExecutive')}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-200"><ShieldCheck className="h-3.5 w-3.5" />{text(locale, 'common.recordingSafe')}</span>
        </div>
      </div>
      {chapter.id === 'not-every-loss' && <div className="mt-5 grid gap-3 sm:grid-cols-2"><p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs leading-5 text-emerald-100"><CheckCircle2 className="mr-2 inline h-4 w-4" />{text(locale, 'common.proofHelios')}</p><p className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs leading-5 text-amber-100"><AlertTriangle className="mr-2 inline h-4 w-4" />{text(locale, 'common.proofValle')}</p></div>}
      <div className="sr-only" aria-live="polite" aria-atomic="true">{text(locale, 'common.chapter')} {chapter.order}: {text(locale, chapter.titleKey)}. {navigationStatus === 'pending' ? text(locale, 'common.navigationPending') : navigationStatus === 'failed' ? text(locale, 'common.navigationFailed') : ''}</div>
      {navigationStatus === 'pending' && <p role="status" className="mt-4 text-xs text-cyan-200">{text(locale, 'common.navigationPending')}</p>}
      {navigationStatus === 'failed' && <p role="status" className="mt-4 text-xs text-amber-200">{text(locale, 'common.navigationFailed')}</p>}
    </header>
  );
};
