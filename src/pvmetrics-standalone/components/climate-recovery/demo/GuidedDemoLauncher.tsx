import React from 'react';
import { Compass, Film, MonitorUp, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import type { ClimateRecoveryCopy } from '../copy';

export const GuidedDemoLauncher: React.FC<{
  guided: boolean;
  presentation: boolean;
  t: ClimateRecoveryCopy;
  onStart: () => void;
  onFree: () => void;
  onPresentation: () => void;
  onVideo: () => void;
  videoLabel: string;
  onReset: () => void;
}> = ({ guided, presentation, t, onStart, onFree, onPresentation, onVideo, videoLabel, onReset }) => (
  <div className="cr-premium-panel rounded-2xl border p-3" aria-label={`${t.freeExplore} / ${t.guidedDemo} / ${t.presentationMode}`}>
    <div role="group" aria-label={t.presentationModeDescription} className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      <button type="button" aria-pressed={!guided && !presentation} onClick={onFree} className={`cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${!guided && !presentation ? 'bg-slate-100 text-slate-950' : 'border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'}`}>
        <Compass className="h-4 w-4" />{t.freeExplore}
      </button>
      <button id="guided-demo-launcher" type="button" aria-pressed={guided} onClick={onStart} className={`cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${guided ? 'bg-amber-500 text-slate-950' : 'border border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20'}`}>
        <Play className="h-4 w-4" />{t.startGuidedDemo}
      </button>
      <button type="button" aria-pressed={presentation} aria-label={presentation ? t.exitPresentation : t.enterPresentation} onClick={onPresentation} className={`cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${presentation ? 'border border-cyan-300/60 bg-cyan-400 text-slate-950' : 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'}`}>
        <MonitorUp className="h-4 w-4" />{t.presentationMode}
      </button>
      <button id="competition-video-launcher" type="button" onClick={onVideo} className="cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-fuchsia-400/35 bg-fuchsia-400/10 px-4 text-xs font-bold text-fuchsia-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300">
        <Film className="h-4 w-4" />{videoLabel}
      </button>
    </div>
    <div className="mt-2 flex flex-col justify-between gap-2 text-xs leading-5 text-slate-400 sm:flex-row sm:items-center">
      <p>{presentation ? t.presentationModeDescription : t.guidedDemoDescription}</p>
      {presentation && <div className="flex flex-wrap items-center gap-2"><span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-bold uppercase tracking-wide text-emerald-300" title={t.recordingSafeBoundary}><ShieldCheck className="h-3.5 w-3.5" />{t.recordingSafe}</span><button type="button" onClick={onReset} className="cr-button inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-700 px-3 font-bold text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><RotateCcw className="h-3.5 w-3.5" />{t.resetPresentation}</button></div>}
    </div>
  </div>
);
