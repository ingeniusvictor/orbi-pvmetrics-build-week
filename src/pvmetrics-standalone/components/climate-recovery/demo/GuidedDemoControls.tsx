import React from 'react';
import { ArrowLeft, ArrowRight, LogOut, RotateCcw, SkipForward } from 'lucide-react';
import type { ClimateRecoveryCopy } from '../copy';
import type { GuidedDemoStep } from './guidedDemoSteps';

const button = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40';

export const GuidedDemoControls: React.FC<{
  step: GuidedDemoStep;
  t: ClimateRecoveryCopy;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onExit: () => void;
  onReset: () => void;
}> = ({ step, t, onPrevious, onNext, onSkip, onExit, onReset }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
    <div className="flex flex-wrap gap-2">
      <button type="button" aria-label={t.exitDemo} onClick={onExit} className={`${button} border-slate-700 text-slate-300`}><LogOut className="h-4 w-4" />{t.exitDemo}</button>
      <button type="button" aria-label={t.resetDemo} onClick={onReset} className={`${button} border-slate-700 text-slate-300`}><RotateCcw className="h-4 w-4" />{t.resetDemo}</button>
    </div>
    <div className="flex flex-wrap gap-2">
      <button type="button" aria-label={t.previous} disabled={!step.previousStepId} onClick={onPrevious} className={`${button} border-slate-700 text-slate-200`}><ArrowLeft className="h-4 w-4" />{t.previous}</button>
      {step.allowSkip && step.nextStepId && <button type="button" aria-label={t.skip} onClick={onSkip} className={`${button} border-slate-700 text-slate-300`}><SkipForward className="h-4 w-4" />{t.skip}</button>}
      <button type="button" aria-label={step.nextStepId ? t.next : t.returnOverview} onClick={onNext} className={`${button} border-amber-400 bg-amber-500 text-slate-950`}>
        {step.nextStepId ? t.next : t.returnOverview}<ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);
