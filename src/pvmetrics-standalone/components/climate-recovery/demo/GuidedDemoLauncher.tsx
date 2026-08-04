import React from 'react';
import { Compass, Play } from 'lucide-react';
import type { ClimateRecoveryCopy } from '../copy';

export const GuidedDemoLauncher: React.FC<{
  guided: boolean;
  t: ClimateRecoveryCopy;
  onStart: () => void;
  onFree: () => void;
}> = ({ guided, t, onStart, onFree }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3" aria-label={`${t.freeExplore} / ${t.guidedDemo}`}>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button type="button" aria-pressed={!guided} onClick={onFree} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${!guided ? 'bg-slate-100 text-slate-950' : 'border border-slate-700 text-slate-300'}`}>
        <Compass className="h-4 w-4" />{t.freeExplore}
      </button>
      <button id="guided-demo-launcher" type="button" aria-pressed={guided} onClick={onStart} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${guided ? 'bg-amber-500 text-slate-950' : 'border border-amber-500/40 bg-amber-500/10 text-amber-200'}`}>
        <Play className="h-4 w-4" />{t.startGuidedDemo}
      </button>
    </div>
    <p className="mt-2 text-xs leading-5 text-slate-400">{t.guidedDemoDescription}</p>
  </div>
);
