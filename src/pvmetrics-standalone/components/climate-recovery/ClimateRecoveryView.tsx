import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Building2, ClipboardCheck, Compass, Film, Languages, LayoutDashboard, Leaf, ListFilter, Play, ShieldAlert } from 'lucide-react';
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
  createGuidedDemoState,
  advanceGuidedDemo,
  exitGuidedDemo,
  guidedDemoStepById,
  previousGuidedDemo,
  resetGuidedDemo,
  skipGuidedDemo,
  type GuidedDemoState,
} from './demo/guidedDemoSteps';
import {
  captureGuidedDemoContext,
  restoreGuidedDemoContext,
  useGuidedDemoNavigation,
  type GuidedDemoContextSnapshot,
} from './demo/useGuidedDemoNavigation';
import {
  competitionVideoChapterById,
  createCompetitionVideoState,
  getCompetitionVideoText,
  reduceCompetitionVideoState,
} from './video';

const navIcons = { overview: LayoutDashboard, plants: Building2, opportunities: ListFilter, review: ClipboardCheck } as const;

const GuidedDemoShell = lazy(() => import('./demo/GuidedDemoShell').then((module) => ({ default: module.GuidedDemoShell })));
const loadCaseDetailView = () => import('./cases/CaseDetailView');
const CaseDetailView = lazy(() => loadCaseDetailView().then((module) => ({ default: module.CaseDetailView })));
const CompetitionVideoMode = lazy(() => import('./video/CompetitionVideoMode').then((module) => ({ default: module.CompetitionVideoMode })));

type BrowsableSection = Exclude<ClimateRecoverySection, 'case'>;

const ClimateRecoveryView: React.FC<{
  onExit?: () => void;
  onLocaleChange?: (locale: 'es' | 'en') => void;
  onExperienceModeChange?: (mode: 'free' | 'guided' | 'presentation') => void;
}> = ({ onExit, onLocaleChange, onExperienceModeChange }) => {
  const demo = useClimateRecoveryDemo();
  const t = getClimateRecoveryCopy(demo.locale);
  const [guidedState, setGuidedState] = useState(() => createGuidedDemoState(demo.locale));
  const [presentationMode, setPresentationMode] = useState(false);
  const [videoState, setVideoState] = useState(() => createCompetitionVideoState(demo.locale));
  const [caseDetailPrefetched, setCaseDetailPrefetched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const contextBeforeGuidedDemo = useRef<GuidedDemoContextSnapshot>();
  const contextBeforeVideo = useRef<GuidedDemoContextSnapshot>();
  const guidedStateBeforeVideo = useRef<GuidedDemoState>();
  const presentationBeforeVideo = useRef(false);
  const caseOrigin = useRef<BrowsableSection>('opportunities');
  const currentStep = guidedDemoStepById(guidedState.currentStepId);
  const currentVideoChapter = competitionVideoChapterById(videoState.currentChapterId);
  const videoTargetStep = currentVideoChapter.targetStepId ? guidedDemoStepById(currentVideoChapter.targetStepId) : undefined;
  const guidedWillOpenCase = guidedState.active && currentStep.nextStepId === 'recoverable-case';
  const videoWillOpenCase = videoState.active && currentVideoChapter.nextChapterId === 'recoverable-case';
  const caseDetailPrefetchPending = (guidedWillOpenCase || videoWillOpenCase) && !caseDetailPrefetched;
  const videoNavigationActive = videoState.active && videoState.started && currentVideoChapter.id !== 'closing' && videoTargetStep !== undefined;
  const storyStep = videoNavigationActive && videoTargetStep ? videoTargetStep : currentStep;
  const storyNavigationActive = guidedState.active || videoNavigationActive;
  const sections: Array<{ id: BrowsableSection; label: string }> = [
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
    const update = () => {
      setGuidedState((state) => ({ ...state, reducedMotion: media.matches }));
      setVideoState((state) => reduceCompetitionVideoState(state, { type: 'set-reduced-motion', reducedMotion: media.matches }));
    };
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    setGuidedState((state) => ({ ...state, locale: demo.locale }));
    setVideoState((state) => reduceCompetitionVideoState(state, { type: 'set-locale', locale: demo.locale }));
    onLocaleChange?.(demo.locale);
  }, [demo.locale, onLocaleChange]);

  useEffect(() => {
    onExperienceModeChange?.(videoState.active || presentationMode ? 'presentation' : guidedState.active ? 'guided' : 'free');
    return () => onExperienceModeChange?.('free');
  }, [guidedState.active, onExperienceModeChange, presentationMode, videoState.active]);

  const prepareStoryStep = useCallback((step: typeof storyStep) => {
    if (step.caseId) {
      caseOrigin.current = step.id === 'recoverable-case' ? 'overview' : 'opportunities';
      demo.selectCase(step.caseId);
    } else if (step.plantId) demo.selectPlant(step.plantId);
    else demo.navigate(step.targetSection);
  }, [demo.navigate, demo.selectCase, demo.selectPlant]);

  const navigationResult = useGuidedDemoNavigation({
    active: storyNavigationActive,
    step: storyStep,
    reducedMotion: videoState.active ? videoState.reducedMotion : guidedState.reducedMotion,
    prepareStep: prepareStoryStep,
    requestKey: videoState.active ? videoState.replaySequence : 0,
  });

  useEffect(() => {
    if (!videoNavigationActive || !videoTargetStep) return;
    const status = !navigationResult || navigationResult.stepId !== videoTargetStep.id
      ? 'pending'
      : navigationResult.status === 'success'
        ? 'ready'
        : 'failed';
    setVideoState((state) => state.navigationStatus === status
      ? state
      : reduceCompetitionVideoState(state, { type: 'set-navigation', status }));
  }, [navigationResult, videoNavigationActive, videoTargetStep]);

  useEffect(() => {
    if (!guidedWillOpenCase && !videoWillOpenCase) return;
    void loadCaseDetailView().then(() => setCaseDetailPrefetched(true));
  }, [guidedWillOpenCase, videoWillOpenCase]);

  const exitGuided = useCallback((reset = true) => {
    setGuidedState((state) => ({ ...exitGuidedDemo(state), completedStepIds: reset ? [] : state.completedStepIds }));
    const snapshot = contextBeforeGuidedDemo.current;
    contextBeforeGuidedDemo.current = undefined;
    if (!snapshot) return;
    void restoreGuidedDemoContext(snapshot, () => demo.restoreExploration({
      activeSection: snapshot.selectedSectionBeforeGuidedDemo,
      selectedPlantId: snapshot.selectedPlantBeforeGuidedDemo,
      selectedCaseId: snapshot.selectedCaseBeforeGuidedDemo,
    }));
  }, [demo.restoreExploration]);

  const startGuided = useCallback(() => {
    if (!guidedState.active && rootRef.current) {
      contextBeforeGuidedDemo.current = captureGuidedDemoContext(rootRef.current, demo.activeSection, demo.selectedPlantId, demo.selectedCaseId);
    }
    demo.resetExploration();
    setGuidedState((state) => resetGuidedDemo(state, demo.locale));
  }, [demo.activeSection, demo.locale, demo.resetExploration, demo.selectedCaseId, demo.selectedPlantId, guidedState.active]);

  const startVideo = useCallback(() => {
    if (!rootRef.current) return;
    const snapshot = captureGuidedDemoContext(rootRef.current, demo.activeSection, demo.selectedPlantId, demo.selectedCaseId);
    contextBeforeVideo.current = snapshot;
    guidedStateBeforeVideo.current = guidedState;
    presentationBeforeVideo.current = presentationMode;
    const modeBeforeVideo = presentationMode ? 'presentation' : guidedState.active ? 'guided' : 'free';
    setVideoState((state) => reduceCompetitionVideoState(state, {
      type: 'start',
      context: {
        modeBeforeVideo,
        sectionBeforeVideo: demo.activeSection,
        selectedCaseBeforeVideo: demo.selectedCaseId,
        selectedPlantBeforeVideo: demo.selectedPlantId,
        scrollBeforeVideo: snapshot.scrollYBeforeGuidedDemo,
      },
      locale: demo.locale,
      reducedMotion: state.reducedMotion,
    }));
    setPresentationMode(true);
    setGuidedState((state) => exitGuidedDemo(state));
    demo.resetExploration();
  }, [demo, guidedState, presentationMode]);

  const exitVideo = useCallback((returnToPresentation = false) => {
    setVideoState((state) => reduceCompetitionVideoState(state, { type: 'exit' }));
    if (returnToPresentation) {
      setPresentationMode(true);
      setGuidedState((state) => exitGuidedDemo(state));
      demo.resetExploration();
      return;
    }
    const snapshot = contextBeforeVideo.current;
    setPresentationMode(presentationBeforeVideo.current);
    if (guidedStateBeforeVideo.current) setGuidedState(guidedStateBeforeVideo.current);
    contextBeforeVideo.current = undefined;
    if (!snapshot) return;
    void restoreGuidedDemoContext(snapshot, () => demo.restoreExploration({
      activeSection: snapshot.selectedSectionBeforeGuidedDemo,
      selectedPlantId: snapshot.selectedPlantBeforeGuidedDemo,
      selectedCaseId: snapshot.selectedCaseBeforeGuidedDemo,
    }), { preferCapturedFocus: true });
  }, [demo.resetExploration, demo.restoreExploration]);

  const showFreeExplore = useCallback(() => { setPresentationMode(false); exitGuided(false); }, [exitGuided]);
  const enterPresentationMode = useCallback(() => { setPresentationMode(true); }, []);
  const exitPresentationMode = useCallback(() => { setPresentationMode(false); }, []);
  const resetPresentationView = useCallback(() => {
    demo.resetExploration();
    if (guidedState.active) setGuidedState((state) => resetGuidedDemo(state, demo.locale));
  }, [demo.locale, demo.resetExploration, guidedState.active]);
  const resetDemo = useCallback(() => { demo.resetExploration(); setGuidedState((state) => resetGuidedDemo(state, demo.locale)); }, [demo.locale, demo.resetExploration]);
  const resetVideo = useCallback(() => {
    demo.resetExploration();
    setPresentationMode(true);
    setGuidedState((state) => exitGuidedDemo(state));
    setVideoState((state) => reduceCompetitionVideoState(state, { type: 'reset' }));
  }, [demo.resetExploration]);

  const moveGuided = useCallback((direction: 'next' | 'previous' | 'skip') => {
    setGuidedState((state) => {
      const nextState = direction === 'previous' ? previousGuidedDemo(state) : direction === 'skip' ? skipGuidedDemo(state) : advanceGuidedDemo(state);
      return { ...nextState, narrationVisible: true };
    });
  }, []);
  const guidedNavigationPending = guidedState.active && (caseDetailPrefetchPending || !navigationResult || navigationResult.stepId !== currentStep.id || navigationResult.status !== 'success');
  const nextGuided = useCallback(() => {
    if (guidedNavigationPending) return;
    if (!currentStep.nextStepId) exitGuided(true); else moveGuided('next');
  }, [currentStep.nextStepId, exitGuided, guidedNavigationPending, moveGuided]);
  const videoAction = useCallback((type: 'begin' | 'next' | 'previous' | 'replay' | 'pause' | 'resume' | 'toggle-cues' | 'toggle-timing') => {
    setVideoState((state) => reduceCompetitionVideoState(state, { type }));
  }, []);
  const nextVideo = useCallback(() => {
    if (caseDetailPrefetchPending) return;
    videoAction('next');
  }, [caseDetailPrefetchPending, videoAction]);

  useEffect(() => {
    if (!guidedState.active && !videoState.active && !presentationMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (videoState.active) exitVideo(false);
        else if (guidedState.active) exitGuided(true);
        else exitPresentationMode();
        return;
      }
      if (target?.matches('input, select, textarea, button, a')) return;
      if (videoState.active) {
        if (event.key === 'ArrowRight') { event.preventDefault(); nextVideo(); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); videoAction('previous'); }
      } else {
        if (event.key === 'ArrowRight') { event.preventDefault(); nextGuided(); }
        if (event.key === 'ArrowLeft' && currentStep.previousStepId) { event.preventDefault(); moveGuided('previous'); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentStep.previousStepId, exitGuided, exitPresentationMode, exitVideo, guidedState.active, moveGuided, nextGuided, nextVideo, presentationMode, videoAction, videoState.active]);

  if (!demo.serviceValid) return <EmptyState title="Climate Recovery synthetic service is unavailable." action={<p className="text-xs text-rose-300">{demo.serviceIssues.join(' ')}</p>} />;

  const storyAnchor = storyNavigationActive ? { id: storyStep.anchorId, stepId: storyStep.id, label: `${t.guidedDemo}: ${t.step} ${storyStep.order}` } : undefined;
  const caseStoryAnchor = storyStep.caseId === demo.selectedCaseId ? storyAnchor : undefined;
  const navigationMessage = guidedState.active && navigationResult && navigationResult.status !== 'success' ? t.guidedTargetUnavailable : undefined;
  const openCaseFrom = (origin: BrowsableSection) => (caseId: string) => { caseOrigin.current = origin; demo.selectCase(caseId); };
  const backFromCase = () => demo.navigate(caseOrigin.current);

  const workspace = (
    <div className="min-w-0 space-y-5">
      <DisclosurePanel disclosure={t.disclosure} boundary={t.operatorBoundary} ariaLabel={t.syntheticDisclosureLabel} />
      {!videoState.active && <nav aria-label="Climate Recovery sections" className={`cr-mobile-tabs z-20 -mx-1 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-xl shadow-slate-950/40 backdrop-blur ${guidedState.active ? 'lg:sticky lg:top-0' : 'sticky top-0'}`}><div className="flex min-w-max gap-2">{sections.map((section) => { const Icon = navIcons[section.id]; const active = demo.activeSection === section.id || (section.id === 'opportunities' && demo.activeSection === 'case'); return <button key={section.id} type="button" aria-current={active ? 'page' : undefined} onClick={() => { exitGuided(false); section.id === 'plants' ? demo.showPlantList() : demo.navigate(section.id); }} className={`cr-button inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${active ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon className="h-4 w-4" />{section.label}{section.id === 'review' && <span className={`rounded-full px-1.5 py-0.5 font-mono text-xs ${active ? 'bg-slate-950/15' : 'bg-amber-500/10 text-amber-300'}`}>{demo.executive.reviewQueue.length}</span>}</button>; })}</div></nav>}
      <GuidedDemoHighlight active={storyNavigationActive}>
        <main className="min-w-0" data-guided-mode={storyNavigationActive ? 'guided' : 'free'}>
          {demo.activeSection === 'overview' && <PortfolioOverview executive={demo.executive} locale={demo.locale} t={t} onPlant={demo.selectPlant} onCase={openCaseFrom('overview')} />}
          {demo.activeSection === 'plants' && <PlantViews plants={demo.plants} summaries={demo.executive.plantSummaries} selectedPlant={demo.selectedPlant} selectedSummary={demo.selectedPlantSummary} selectedPlantCases={demo.selectedPlantCases} locale={demo.locale} t={t} onPlant={demo.selectPlant} onCase={openCaseFrom('plants')} onBack={demo.showPlantList} />}
          {demo.activeSection === 'opportunities' && <OpportunityList cases={demo.cases} plants={demo.plants} filters={demo.filters} setFilters={demo.setFilters} sort={demo.sort} setSort={demo.setSort} availableFilters={demo.availableFilters} caseDataSufficiency={demo.caseDataSufficiency} locale={demo.locale} t={t} onCase={openCaseFrom('opportunities')} />}
          {demo.activeSection === 'review' && <HumanReviewQueue queue={demo.executive.reviewQueue} plants={demo.plants} caseTitle={demo.caseTitle} t={t} locale={demo.locale} onCase={openCaseFrom('review')} guidedAnchor={storyStep.id === 'explainability' ? storyAnchor : undefined} />}
          {demo.activeSection === 'case' && <Suspense fallback={<div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5 text-xs text-cyan-200">{t.caseSummary}</div>}><CaseDetailView key={`${demo.selectedCaseId}:${storyStep.id}:${storyNavigationActive}`} detail={demo.selectedCase} locale={demo.locale} t={t} onBack={backFromCase} guidedOpenSections={storyNavigationActive ? storyStep.requiredOpenSections : undefined} guidedAnchor={caseStoryAnchor} /></Suspense>}
        </main>
      </GuidedDemoHighlight>
      <footer className="flex flex-col justify-between gap-3 border-t border-slate-800 py-5 text-xs leading-4 text-slate-500 sm:flex-row"><p>{t.disclosure}</p><p className="flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 text-amber-400" />{t.safetyFooter}</p></footer>
    </div>
  );

  if (videoState.active) return (
    <div ref={rootRef} className="climate-recovery-view mx-auto max-w-[1800px] space-y-5" data-testid="climate-recovery-view" data-presentation-mode="true" data-experience-mode="video" data-video-mode="true">
      <Suspense fallback={<div role="status" className="rounded-2xl border border-cyan-400/20 bg-slate-950 p-5 text-cyan-100">{getCompetitionVideoText(demo.locale, 'common.navigationPending')}</div>}>
        <CompetitionVideoMode state={caseDetailPrefetchPending ? { ...videoState, navigationStatus: 'pending' } : videoState} locale={demo.locale} onBegin={() => videoAction('begin')} onPrevious={() => videoAction('previous')} onNext={nextVideo} onReplay={() => videoAction('replay')} onTogglePause={() => videoAction(videoState.paused ? 'resume' : 'pause')} onToggleCues={() => videoAction('toggle-cues')} onToggleTiming={() => videoAction('toggle-timing')} onReset={resetVideo} onExit={() => exitVideo(false)} onReturnToPresentation={() => exitVideo(true)}>{workspace}</CompetitionVideoMode>
      </Suspense>
    </div>
  );

  return (
    <div ref={rootRef} className="climate-recovery-view mx-auto max-w-[1680px] space-y-5" data-testid="climate-recovery-view" data-guided-nav-status={navigationResult?.status ?? 'idle'} data-presentation-mode={presentationMode} data-experience-mode={presentationMode ? 'presentation' : guidedState.active ? 'guided' : 'free'}>
      <header className="cr-hero-enter overflow-hidden rounded-3xl border border-slate-700/80 bg-[radial-gradient(circle_at_85%_10%,rgba(34,211,238,0.17),transparent_36%),radial-gradient(circle_at_12%_95%,rgba(245,158,11,0.12),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,1))] p-5 shadow-[var(--cr-shadow-lg)] sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,350px)] xl:items-start">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-2"><SyntheticBadge label={t.demonstration} /><span className="rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">{t.readOnly}</span><span className="rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">{t.noNetwork}</span></div>
            <div className="mt-5 flex items-start gap-3"><div className="rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-400 p-2.5 text-slate-950 shadow-lg shadow-cyan-950"><Leaf className="h-6 w-6" /></div><div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{t.product}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">{t.edition} · {t.title}</p></div></div>
            <h1 id="climate-recovery-heading" tabIndex={-1} className="mt-5 max-w-4xl text-3xl font-black leading-[1.08] tracking-[-0.035em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:text-4xl xl:text-[2.5rem]"><span className="block">{t.heroLine1}</span><span className="mt-1.5 block text-cyan-200">{t.heroLine2}</span><span className="mt-1.5 block text-slate-300">{t.heroLine3}</span></h1>
            <p className="cr-presentation-key-copy mt-4 max-w-3xl text-sm leading-6 text-slate-300">{t.subtitle}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button id="competition-video-hero-entry" type="button" onClick={startVideo} className="cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-fuchsia-400 px-5 text-xs font-black text-slate-950 shadow-lg shadow-fuchsia-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200"><Film className="h-4 w-4" />{getCompetitionVideoText(demo.locale, 'common.begin')}</button><button type="button" onClick={startGuided} className="cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-xs font-black text-slate-950 shadow-lg shadow-amber-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"><Play className="h-4 w-4" />{t.startGuidedDemo}</button><button type="button" onClick={showFreeExplore} className="cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-950/60 px-5 text-xs font-bold text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><Compass className="h-4 w-4" />{t.exploreFreely}</button></div>
            <p className="mt-4 max-w-4xl border-l-2 border-cyan-400/50 pl-3 text-xs leading-5 text-slate-400"><span className="font-semibold text-cyan-200">{t.disclosure}</span> {t.operatorBoundary}</p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-3 min-[430px]:grid-cols-2 xl:grid-cols-1"><div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t.evaluated} · UTC</p><p className="mt-2 font-mono text-sm text-white">{evaluatedAt}</p></div><div className="rounded-2xl border border-slate-700/70 bg-slate-950/65 p-4"><label htmlFor="climate-recovery-locale" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500"><Languages className="h-3.5 w-3.5" />{t.language}</label><select id="climate-recovery-locale" aria-label={`${t.title}: ${t.language}`} value={demo.locale} onChange={(event) => demo.setLocale(event.target.value as 'es' | 'en')} className="mt-2 min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><option value="es" className="bg-slate-950">ES · Español</option><option value="en" className="bg-slate-950">EN · English</option></select></div>{presentationMode && <div role="status" className="col-span-full rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs leading-5 text-emerald-100"><span className="font-black uppercase tracking-wide">{t.recordingSafe}</span><span className="mt-1 block text-emerald-200/75">{t.recordingSafeBoundary}</span></div>}{onExit && <button type="button" onClick={onExit} className="cr-button col-span-full inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-3 text-xs font-bold text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><ArrowLeft className="h-4 w-4" />{t.back}</button>}</div>
        </div>
      </header>
      <GuidedDemoLauncher guided={guidedState.active} presentation={presentationMode} t={t} onStart={startGuided} onFree={showFreeExplore} onPresentation={presentationMode ? exitPresentationMode : enterPresentationMode} onVideo={startVideo} videoLabel={getCompetitionVideoText(demo.locale, 'common.begin')} onReset={resetPresentationView} />
      {guidedState.active ? <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] lg:items-start"><Suspense fallback={<div className="rounded-2xl border border-amber-500/20 bg-slate-900 p-4 text-xs text-amber-200">{t.guidedDemo}</div>}><GuidedDemoShell step={currentStep} locale={demo.locale} t={t} onPrevious={() => moveGuided('previous')} onNext={nextGuided} onSkip={() => moveGuided('skip')} onExit={() => exitGuided(true)} onReset={resetDemo} narrativeExpanded={guidedState.narrationVisible} onToggleNarrative={() => setGuidedState((state) => ({ ...state, narrationVisible: !state.narrationVisible }))} navigationMessage={navigationMessage} navigationPending={guidedNavigationPending} navigationPendingMessage={getCompetitionVideoText(demo.locale, 'common.navigationPending')} /></Suspense>{workspace}</div> : workspace}
    </div>
  );
};

export default ClimateRecoveryView;
