import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { getGuidedDemoText, type GuidedDemoStep } from './guidedDemoSteps';

export const GuidedDemoNarrative: React.FC<{ step: GuidedDemoStep; locale: ClimateRecoveryLocale; t: ClimateRecoveryCopy }> = ({ step, locale, t }) => (
  <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">{getGuidedDemoText(locale, step.subtitleKey)}</p>
      <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">{getGuidedDemoText(locale, step.titleKey)}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-200">{getGuidedDemoText(locale, step.narrativeKey)}</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <div className="rounded-xl bg-slate-950/60 p-3">
        <h3 className="text-xs font-bold text-cyan-200">{t.keyPoints}</h3>
        <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-300">{step.keyPoints.map((key) => <li key={key} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />{getGuidedDemoText(locale, key)}</li>)}</ul>
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-3">
        <ul className="space-y-2 text-xs leading-5 text-amber-100">{step.warnings.map((key) => <li key={key} className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />{getGuidedDemoText(locale, key)}</li>)}</ul>
      </div>
    </div>
  </div>
);
