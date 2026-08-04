import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Building2, ClipboardCheck, Languages, LayoutDashboard, Leaf, ListFilter, ShieldAlert } from 'lucide-react';
import { getClimateRecoveryCopy } from './copy';
import { useClimateRecoveryDemo, type ClimateRecoverySection } from './hooks/useClimateRecoveryDemo';
import { PortfolioOverview } from './overview/PortfolioOverview';
import { PlantViews } from './plants/PlantViews';
import { OpportunityList } from './cases/OpportunityList';
import { HumanReviewQueue } from './review/HumanReviewQueue';
import { DisclosurePanel, EmptyState, SyntheticBadge } from './shared/Display';
import { GuidedDemoLauncher } from './demo/GuidedDemoLauncher';
import { GuidedDemoHighlight } from './demo/GuidedDemoHighlight';
import {
  GUIDED_DEMO_STEPS,
  createGuidedDemoState,
  advanceGuidedDemo,
  exitGuidedDemo,
  guidedDemoStepById,
  previousGuidedDemo,
  resetGuidedDemo,
  skipGuidedDemo,
} from './demo/guidedDemoSteps';

const navIcons = { overview: LayoutDashboard, plants: Building2, opportunities: ListFilter, review: ClipboardCheck } as const;

const GuidedDemoShell = lazy(() => import('./demo/GuidedDemoShell').then((module) => ({ default: module.GuidedDemoShell })));
const CaseDetailView = lazy(() => import('./cases/CaseDetailView').then((module) => ({ default: module.CaseDetailView })));

const ClimateRecoveryView: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  const demo = useClimateRecoveryDemo();
  const t = getClimateRecoveryCopy(demo.locale);
  const [guidedState, setGuidedState] = useState(() => createGuidedDemoState(demo.locale));
  const currentStep = guidedDemoStepById(guidedState.currentStepId);
  const sections: Array<{ id: Exclude<ClimateRecoverySection, 'case'>; label: string }> = [
    { id: 'overview', label: t.overview }, { id: 'plants', label: t.plants },
    { id: 'opportunities', label: t.opportunities }, { id: 'review', label: t.review },
  ];
  const evaluatedAt = new Intl.DateTimeFormat(demo.locale === 'es' ? 'es-CL' : 'en-US', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
  }).format(new Date(demo.executive.metadata.evaluationTimestamp));

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'ORBI PVMetrics IA — Climate Recovery Edition';
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setGuidedState((state) => ({ ...state, reducedMotion: media.matches }));
  }, []);

  useEffect(() => {
    setGuidedState((state) => ({ ...state, locale: demo.locale }));
  }, [demo.locale]);

  useEffect(() => {
    if (!guidedState.active) return;
    if (currentStep.caseId) demo.selectCase(currentStep.caseId);
    else if (currentStep.plantId) demo.selectPlant(currentStep.plantId);
    else demo.navigate(currentStep.targetSection);
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(currentStep.focusElementId ?? 'guided-demo-shell')
        ?? document.getElementById('guided-demo-shell');
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: guidedState.reducedMotion ? 'auto' : 'smooth', block: 'center' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentStep, demo.navigate, demo.selectCase, demo.selectPlant, guidedState.active, guidedState.reducedMotion]);

  const exitGuided = useCallback((reset = true) => {
    setGuidedState((state) => ({ ...exitGuidedDemo(state), completedStepIds: reset ? [] : state.completedStepIds }));
    if (reset) demo.resetExploration();
  }, [demo.resetExploration]);

  const startGuided = useCallback(() => {
    demo.resetExploration();
    setGuidedState((state) => resetGuidedDemo(state, demo.locale));
  }, [demo.locale, demo.resetExploration]);

  const resetDemo = useCallback(() => {
    demo.resetExploration();
    setGuidedState((state) => resetGuidedDemo(state, demo.locale));
  }, [demo.locale, demo.resetExploration]);

  const move = useCallback((direction: 'next' | 'previous' | 'skip') => {
    setGuidedState((state) => {
      if (direction === 'previous') return previousGuidedDemo(state);
      if (direction === 'skip') return skipGuidedDemo(state);
      return advanceGuidedDemo(state);
    });
  }, []);

  const next = useCallback(() => {
    if (!currentStep.nextStepId) exitGuided(true);
    else move('next');
  }, [currentStep.nextStepId, exitGuided, move]);

  useEffect(() => {
    if (!guidedState.active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); exitGuided(true); return; }
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, select, textarea, button, a')) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
      if (event.key === 'ArrowLeft' && currentStep.previousStepId) { event.preventDefault(); move('previous'); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentStep.previousStepId, exitGuided, guidedState.active, move, next]);

  if (!demo.serviceValid) {
    return <EmptyState title="Climate Recovery synthetic service is unavailable." action={<p className="text-xs text-rose-300">{demo.serviceIssues.join(' ')}</p>} />;
  }

  return (
    <div className="mx-auto max-w-[1680px] space-y-5" data-testid="climate-recovery-view">
      <header className="overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_42%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2"><SyntheticBadge label={t.demonstration} /><span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-bold uppercase text-slate-300">{t.readOnly}</span><span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-bold uppercase text-slate-300">{t.noNetwork}</span></div>
            <div className="mt-5 flex items-start gap-3"><div className="rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-400 p-2.5 text-slate-950 shadow-lg shadow-cyan-950"><Leaf className="h-6 w-6" /></div><div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{t.product} · {t.edition}</p><h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">{t.title}</h1></div></div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{t.subtitle}</p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[430px]:grid-cols-2 xl:w-[390px]">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs font-bold uppercase text-slate-500">{t.evaluated} · UTC</p><p className="mt-1 font-mono text-xs text-white">{evaluatedAt}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><label htmlFor="climate-recovery-locale" className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500"><Languages className="h-3.5 w-3.5" />{t.language}</label><select id="climate-recovery-locale" aria-label={`${t.title}: ${t.language}`} value={demo.locale} onChange={(event) => demo.setLocale(event.target.value as 'es' | 'en')} className="mt-1 min-h-8 w-full bg-transparent text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><option value="es" className="bg-slate-950">ES · Español</option><option value="en" className="bg-slate-950">EN · English</option></select></div>
            {onExit && <button type="button" onClick={onExit} className="col-span-full inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-xs font-bold text-slate-300 hover:border-amber-500/40 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><ArrowLeft className="h-4 w-4" />{t.back}</button>}
          </div>
        </div>
      </header>

      <GuidedDemoLauncher guided={guidedState.active} t={t} onStart={startGuided} onFree={() => exitGuided(false)} />

      {guidedState.active && <Suspense fallback={<div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-4 text-xs text-amber-200">{t.guidedDemo}</div>}><GuidedDemoShell step={currentStep} locale={demo.locale} t={t} onPrevious={() => move('previous')} onNext={next} onSkip={() => move('skip')} onExit={() => exitGuided(true)} onReset={resetDemo} /></Suspense>}

      <DisclosurePanel disclosure={t.disclosure} boundary={t.operatorBoundary} ariaLabel={t.syntheticDisclosureLabel} />

      <nav aria-label="Climate Recovery sections" className="cr-mobile-tabs sticky top-0 z-20 -mx-1 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-xl shadow-slate-950/40 backdrop-blur">
        <div className="flex min-w-max gap-2">
          {sections.map((section) => {
            const Icon = navIcons[section.id];
            const active = demo.activeSection === section.id || (section.id === 'opportunities' && demo.activeSection === 'case');
            return <button key={section.id} type="button" aria-current={active ? 'page' : undefined} onClick={() => { exitGuided(false); section.id === 'plants' ? demo.showPlantList() : demo.navigate(section.id); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${active ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon className="h-4 w-4" />{section.label}{section.id === 'review' && <span className={`rounded-full px-1.5 py-0.5 font-mono text-xs ${active ? 'bg-slate-950/15' : 'bg-amber-500/10 text-amber-300'}`}>{demo.executive.reviewQueue.length}</span>}</button>;
          })}
        </div>
      </nav>

      <GuidedDemoHighlight active={guidedState.active}>
      <main className="min-w-0" data-guided-mode={guidedState.active ? 'guided' : 'free'}>
        {demo.activeSection === 'overview' && <PortfolioOverview executive={demo.executive} locale={demo.locale} t={t} onPlant={demo.selectPlant} onCase={demo.selectCase} />}
        {demo.activeSection === 'plants' && <PlantViews plants={demo.plants} summaries={demo.executive.plantSummaries} selectedPlant={demo.selectedPlant} selectedSummary={demo.selectedPlantSummary} selectedPlantCases={demo.selectedPlantCases} locale={demo.locale} t={t} onPlant={demo.selectPlant} onCase={demo.selectCase} onBack={demo.showPlantList} />}
        {demo.activeSection === 'opportunities' && <OpportunityList cases={demo.cases} plants={demo.plants} filters={demo.filters} setFilters={demo.setFilters} sort={demo.sort} setSort={demo.setSort} availableFilters={demo.availableFilters} caseDataSufficiency={demo.caseDataSufficiency} locale={demo.locale} t={t} onCase={demo.selectCase} />}
        {demo.activeSection === 'review' && <HumanReviewQueue queue={demo.executive.reviewQueue} plants={demo.plants} caseTitle={demo.caseTitle} t={t} locale={demo.locale} onCase={demo.selectCase} />}
        {demo.activeSection === 'case' && <Suspense fallback={<div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5 text-xs text-cyan-200">{t.caseSummary}</div>}><CaseDetailView key={`${demo.selectedCaseId}:${currentStep.id}:${guidedState.active}`} detail={demo.selectedCase} locale={demo.locale} t={t} onBack={() => demo.navigate('opportunities')} guidedOpenSection={guidedState.active ? currentStep.openTechnicalSection : undefined} /></Suspense>}
      </main>
      </GuidedDemoHighlight>

      <footer className="flex flex-col justify-between gap-3 border-t border-slate-800 py-5 text-xs leading-4 text-slate-500 sm:flex-row"><p>{t.disclosure}</p><p className="flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 text-amber-400" />{t.safetyFooter}</p></footer>
    </div>
  );
};

export default ClimateRecoveryView;
