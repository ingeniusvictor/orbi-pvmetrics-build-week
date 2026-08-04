import React from 'react';
import type { ClimateRecoveryCopy } from '../copy';
import type { GuidedDemoStep } from './guidedDemoSteps';

export const GuidedDemoProgress: React.FC<{ step: GuidedDemoStep; total: number; t: ClimateRecoveryCopy }> = ({ step, total, t }) => (
  <div>
    <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
      <span>{t.step} {step.order} {t.of} {total}</span>
      <span className="font-mono text-slate-500">~{step.durationHintSeconds}s</span>
    </div>
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step.order} aria-label={`${t.step} ${step.order} ${t.of} ${total}`}>
      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-[width] motion-reduce:transition-none" style={{ width: `${(step.order / total) * 100}%` }} />
    </div>
  </div>
);
