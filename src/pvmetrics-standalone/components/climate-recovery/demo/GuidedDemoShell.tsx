import React from 'react';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { GUIDED_DEMO_STEPS, getGuidedDemoText, type GuidedDemoStep } from './guidedDemoSteps';
import { GuidedDemoControls } from './GuidedDemoControls';
import { GuidedDemoNarrative } from './GuidedDemoNarrative';
import { GuidedDemoProgress } from './GuidedDemoProgress';

export const GuidedDemoShell: React.FC<{
  step: GuidedDemoStep;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onExit: () => void;
  onReset: () => void;
  narrativeExpanded: boolean;
  onToggleNarrative: () => void;
  navigationMessage?: string;
}> = ({ step, locale, t, narrativeExpanded, onToggleNarrative, navigationMessage, ...controls }) => (
  <aside id="guided-demo-shell" tabIndex={-1} aria-label={t.guidedDemo} className="guided-demo-shell rounded-3xl border border-amber-500/30 bg-[linear-gradient(135deg,rgba(30,41,59,0.99),rgba(2,6,23,0.99))] p-4 shadow-2xl shadow-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:p-5">
    <div className="sr-only" aria-live="polite" aria-atomic="true">{t.step} {step.order} {t.of} {GUIDED_DEMO_STEPS.length}: {getGuidedDemoText(locale, step.titleKey)}</div>
    <GuidedDemoProgress step={step} total={GUIDED_DEMO_STEPS.length} t={t} />
    <div id="guided-demo-narrative" className="guided-demo-narrative-scroll my-3 min-h-0 flex-1 pr-1"><GuidedDemoNarrative step={step} locale={locale} t={t} expanded={narrativeExpanded} onToggle={onToggleNarrative} /></div>
    {navigationMessage && <p role="status" className="mb-2 shrink-0 text-xs text-amber-200">{navigationMessage}</p>}
    <GuidedDemoControls step={step} t={t} {...controls} />
  </aside>
);
