import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf, LogOut, ShieldCheck, WifiOff } from 'lucide-react';
import type { ClimateRecoveryLocale } from '../copy';
import { getCompetitionVideoText as text } from './competitionVideoScript';

export const CinematicOpening: React.FC<{
  locale: ClimateRecoveryLocale;
  reducedMotion: boolean;
  onBegin: () => void;
  onExit: () => void;
}> = ({ locale, reducedMotion, onBegin, onExit }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  return (
    <section
      className="cr-video-opening cr-video-safe-frame relative isolate overflow-hidden rounded-[2rem] border border-cyan-400/25 bg-slate-950 px-4 py-4 shadow-[var(--cr-shadow-lg)] sm:px-10 sm:py-14 lg:px-16 lg:py-20"
      data-reduced-motion={reducedMotion}
      aria-labelledby="competition-video-opening-heading"
    >
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-400 text-slate-950 shadow-[var(--cr-glow-accent)]"><Leaf aria-hidden="true" className="h-7 w-7" /></div>
        <p className="mt-3 text-xs font-black uppercase tracking-[0.24em] text-amber-300 sm:mt-6">{text(locale, 'common.product')}</p>
        <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200 sm:mt-2">{text(locale, 'common.edition')}</p>
        <h1 ref={headingRef} id="competition-video-opening-heading" tabIndex={-1} className="mx-auto mt-4 max-w-4xl text-3xl font-black leading-[1.05] tracking-[-0.045em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:mt-8 sm:text-5xl lg:text-6xl">
          {text(locale, 'common.hook')}
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-5 text-slate-300 sm:mt-6 sm:text-lg sm:leading-7">{text(locale, 'common.valueProposition')}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-wide sm:mt-8">
          <span className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-2 text-amber-200">{text(locale, 'common.syntheticExecutive')}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-emerald-200"><ShieldCheck className="h-3.5 w-3.5" />{text(locale, 'common.readOnly')}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-cyan-200"><WifiOff className="h-3.5 w-3.5" />{text(locale, 'common.offline')}</span>
        </div>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row">
          <button type="button" onClick={onBegin} className="cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 text-sm font-black text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">
            {text(locale, 'common.begin')}<ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={onExit} className="cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 text-sm font-bold text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
            <LogOut className="h-4 w-4" />{text(locale, 'common.exit')}
          </button>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-500 sm:mt-8">{text(locale, 'common.recordingSafeBoundary')}</p>
      </div>
    </section>
  );
};
