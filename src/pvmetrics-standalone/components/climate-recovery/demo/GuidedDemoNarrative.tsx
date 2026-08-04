import React from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { getGuidedDemoText, type GuidedDemoStep } from './guidedDemoSteps';

export const GuidedDemoNarrative: React.FC<{
  step: GuidedDemoStep;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  expanded: boolean;
  onToggle: () => void;
}> = ({ step, locale, t, expanded, onToggle }) => (
  <div>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">{getGuidedDemoText(locale, step.subtitleKey)}</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h2 className="text-lg font-black text-white sm:text-xl">{getGuidedDemoText(locale, step.titleKey)}</h2>
        <button type="button" aria-expanded={expanded} aria-controls="guided-demo-narrative-details" onClick={onToggle} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 lg:hidden">
          <span className="sr-only">{expanded ? t.showLess : t.showMore}</span><ChevronDown className={`h-4 w-4 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
    <div id="guided-demo-narrative-details" hidden={!expanded} className="mt-3 space-y-3">
      <p className="text-sm leading-5 text-slate-200">{getGuidedDemoText(locale, step.narrativeKey)}</p>
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
