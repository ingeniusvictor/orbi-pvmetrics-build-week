import React, { useEffect, useRef } from 'react';
import { Building2, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import type { ClimateRecoveryLocale } from '../copy';
import { getCompetitionVideoText as text } from './competitionVideoScript';

export const VideoClosingFrame: React.FC<{ locale: ClimateRecoveryLocale }> = ({ locale }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <section className="cr-video-closing cr-video-safe-frame rounded-[2rem] border border-amber-400/25 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_42%),linear-gradient(135deg,#0f172a,#020617)] px-6 py-12 text-center shadow-[var(--cr-shadow-lg)] sm:px-12 lg:py-16" aria-labelledby="competition-video-closing-heading">
      <Leaf className="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
      <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">{text(locale, 'common.product')} · {text(locale, 'common.edition')}</p>
      <h1 ref={headingRef} id="competition-video-closing-heading" tabIndex={-1} className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:text-5xl">{text(locale, 'common.everyMwh')}</h1>
      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">{text(locale, 'common.closingCta')}</p>
      <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <span className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm font-bold text-cyan-100"><Sparkles className="mx-auto mb-2 h-4 w-4" />{text(locale, 'common.explainableAi')}</span>
        <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-100"><ShieldCheck className="mx-auto mb-2 h-4 w-4" />{text(locale, 'common.humanReview')}</span>
        <span className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm font-bold text-amber-100"><Leaf className="mx-auto mb-2 h-4 w-4" />{text(locale, 'common.estimatedImpact')}</span>
        <span className="rounded-xl border border-slate-600 bg-slate-900/70 p-3 text-sm font-bold text-slate-200"><Building2 className="mx-auto mb-2 h-4 w-4" />{text(locale, 'common.company')}</span>
      </div>
      <p className="mt-8 text-xs font-bold uppercase tracking-wide text-amber-200">{text(locale, 'common.syntheticDemo')}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{text(locale, 'common.decisionSupport')}</p>
    </section>
  );
};
