import { useEffect, useRef, useState } from 'react';
import type { ClimateRecoverySection } from '../hooks/useClimateRecoveryDemo';
import type { GuidedDemoStep } from './guidedDemoSteps';

export const GUIDED_DEMO_SCROLL_OFFSET_DESKTOP = 24;
export const GUIDED_DEMO_SCROLL_OFFSET_TABLET = 24;
export const GUIDED_DEMO_SCROLL_OFFSET_MOBILE = 16;
export const GUIDED_DEMO_MAX_ANCHOR_ATTEMPTS = 8;
export const GUIDED_DEMO_MAX_CORRECTIVE_SCROLLS = 1;
export const GUIDED_DEMO_MAX_SCROLL_SETTLE_FRAMES = 48;

export type GuidedNavigationStatus = 'success' | 'target-not-found' | 'cancelled' | 'timeout' | 'blocked';

export type GuidedNavigationResult = {
  status: GuidedNavigationStatus;
  stepId: string;
  targetId: string;
  attempts: number;
  focused: boolean;
  scrolled: boolean;
  warnings: string[];
};

export type GuidedDemoVisibility = {
  shellVisible: boolean;
  targetVisible: boolean;
  controlsVisible: boolean;
  narrativeVisible: boolean;
  viewportHeight: number;
  shellRect?: DOMRect;
  targetRect?: DOMRect;
  warnings: string[];
};

export type GuidedDemoContextSnapshot = {
  scrollYBeforeGuidedDemo: number;
  focusedElementBeforeGuidedDemo: HTMLElement | null;
  selectedSectionBeforeGuidedDemo: ClimateRecoverySection;
  selectedPlantBeforeGuidedDemo?: string;
  selectedCaseBeforeGuidedDemo?: string;
  scrollContainer: HTMLElement;
};

type NavigationOptions = {
  step: GuidedDemoStep;
  reducedMotion: boolean;
  signal: AbortSignal;
  focusShellBeforeTarget?: boolean;
};

type ScrollContext = {
  container: HTMLElement;
  viewportTop: number;
  viewportBottom: number;
  isDocument: boolean;
};

const isScrollable = (element: HTMLElement) => {
  const overflowY = window.getComputedStyle(element).overflowY;
  return /(auto|scroll)/.test(overflowY) && element.scrollHeight > element.clientHeight;
};

export const findGuidedDemoScrollContainer = (element: HTMLElement): HTMLElement => {
  let parent = element.parentElement;
  while (parent) {
    if (isScrollable(parent)) return parent;
    parent = parent.parentElement;
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
};

const getScrollContext = (target: HTMLElement): ScrollContext => {
  const container = findGuidedDemoScrollContainer(target);
  const isDocument = container === document.documentElement || container === document.body || container === document.scrollingElement;
  if (isDocument) return { container, viewportTop: 0, viewportBottom: window.innerHeight, isDocument: true };
  const rect = container.getBoundingClientRect();
  return {
    container,
    viewportTop: Math.max(0, rect.top),
    viewportBottom: Math.min(window.innerHeight, rect.bottom),
    isDocument: false,
  };
};

export const isElementWithinViewport = (
  rect: Pick<DOMRect, 'top' | 'bottom'>,
  viewportTop: number,
  viewportBottom: number,
) => rect.top >= viewportTop && rect.bottom <= viewportBottom;

export const getGuidedDemoScrollOffset = (viewportWidth: number, shellHeight: number) => {
  if (viewportWidth >= 1024) return GUIDED_DEMO_SCROLL_OFFSET_DESKTOP;
  if (viewportWidth >= 768) return shellHeight + GUIDED_DEMO_SCROLL_OFFSET_TABLET;
  return shellHeight + GUIDED_DEMO_SCROLL_OFFSET_MOBILE;
};

const nextAnimationFrame = (signal?: AbortSignal) => new Promise<boolean>((resolve) => {
  if (signal?.aborted) { resolve(false); return; }
  const frame = window.requestAnimationFrame(() => resolve(!signal?.aborted));
  signal?.addEventListener('abort', () => {
    window.cancelAnimationFrame(frame);
    resolve(false);
  }, { once: true });
});

const waitForAnchor = async (targetId: string, signal: AbortSignal) => {
  let candidate: HTMLElement | null = null;
  let candidateTop: number | undefined;
  for (let attempts = 1; attempts <= GUIDED_DEMO_MAX_ANCHOR_ATTEMPTS; attempts += 1) {
    if (signal.aborted) return { target: null, attempts, cancelled: true };
    const target = document.getElementById(targetId);
    if (target instanceof HTMLElement) {
      const top = target.getBoundingClientRect().top;
      if (target === candidate && candidateTop !== undefined && Math.abs(top - candidateTop) <= 1) {
        return { target, attempts, cancelled: false };
      }
      candidate = target;
      candidateTop = top;
    } else {
      candidate = null;
      candidateTop = undefined;
    }
    if (!await nextAnimationFrame(signal)) return { target: null, attempts, cancelled: true };
  }
  return { target: null, attempts: GUIDED_DEMO_MAX_ANCHOR_ATTEMPTS, cancelled: false };
};

const scrollToAnchor = (target: HTMLElement, context: ScrollContext, top: number, behavior: ScrollBehavior) => {
  if (context.isDocument) window.scrollTo({ top, behavior });
  else context.container.scrollTo({ top, behavior });
};

const calculateAnchorTop = (target: HTMLElement, context: ScrollContext, offset: number) => {
  const targetRect = target.getBoundingClientRect();
  const currentTop = context.isDocument ? window.scrollY : context.container.scrollTop;
  const containerTop = context.isDocument ? 0 : context.container.getBoundingClientRect().top;
  return Math.max(0, currentTop + targetRect.top - containerTop - offset);
};

const getScrollPosition = (context: ScrollContext) => context.isDocument ? window.scrollY : context.container.scrollTop;

const waitForScrollSettle = async (
  context: ScrollContext,
  initialPosition: number,
  expectedPosition: number,
  signal: AbortSignal,
) => {
  if (Math.abs(expectedPosition - initialPosition) <= 0.5) return nextAnimationFrame(signal);
  return new Promise<boolean>((resolve) => {
  const eventTarget: EventTarget = context.isDocument ? window : context.container;
  let completed = false;
  const finish = (settled: boolean) => {
    if (completed) return;
    completed = true;
    eventTarget.removeEventListener('scrollend', onScrollEnd);
    signal.removeEventListener('abort', onAbort);
    resolve(settled);
  };
  const onScrollEnd = () => finish(true);
  const onAbort = () => finish(false);
  eventTarget.addEventListener('scrollend', onScrollEnd, { once: true });
  signal.addEventListener('abort', onAbort, { once: true });
  void (async () => {
    for (let frame = 0; frame < GUIDED_DEMO_MAX_SCROLL_SETTLE_FRAMES; frame += 1) {
      if (!await nextAnimationFrame(signal)) return;
    }
    finish(!signal.aborted);
  })();
  });
};

export const assessGuidedDemoVisibility = (target: HTMLElement): GuidedDemoVisibility => {
  const context = getScrollContext(target);
  const shell = document.getElementById('guided-demo-shell');
  const controls = document.getElementById('guided-demo-controls');
  const narrative = document.getElementById('guided-demo-narrative');
  const shellRect = shell?.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const within = (element: HTMLElement | null) => element
    ? isElementWithinViewport(element.getBoundingClientRect(), context.viewportTop, context.viewportBottom)
    : false;
  const visibility = {
    shellVisible: within(shell),
    targetVisible: isElementWithinViewport(targetRect, context.viewportTop, context.viewportBottom),
    controlsVisible: within(controls),
    narrativeVisible: within(narrative),
  };
  return {
    ...visibility,
    viewportHeight: context.viewportBottom - context.viewportTop,
    shellRect,
    targetRect,
    warnings: Object.entries(visibility).filter(([, visible]) => !visible).map(([name]) => `${name} is outside the guided viewport.`),
  };
};

export const coordinateGuidedDemoNavigation = async ({
  step,
  reducedMotion,
  signal,
  focusShellBeforeTarget = false,
}: NavigationOptions): Promise<GuidedNavigationResult> => {
  const base = { stepId: step.id, targetId: step.anchorId, focused: false, scrolled: false, warnings: [] as string[] };
  if (typeof document === 'undefined' || typeof window === 'undefined') return { ...base, status: 'blocked', attempts: 0 };
  if (focusShellBeforeTarget) document.getElementById('guided-demo-shell')?.focus({ preventScroll: true });
  const waited = await waitForAnchor(step.anchorId, signal);
  if (waited.cancelled) return { ...base, status: 'cancelled', attempts: waited.attempts };
  if (!waited.target) return { ...base, status: 'timeout', attempts: waited.attempts, warnings: [`Anchor ${step.anchorId} did not mount.`] };

  try {
    const target = waited.target;
    const context = getScrollContext(target);
    const shellHeight = window.innerWidth < 1024 ? document.getElementById('guided-demo-shell')?.getBoundingClientRect().height ?? 0 : 0;
    const offset = getGuidedDemoScrollOffset(window.innerWidth, shellHeight);
    const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth';
    let correctiveScrolls = 0;
    const correctVisibility = () => {
      if (signal.aborted || correctiveScrolls >= GUIDED_DEMO_MAX_CORRECTIVE_SCROLLS) return;
      if (assessGuidedDemoVisibility(target).targetVisible) return;
      correctiveScrolls += 1;
      scrollToAnchor(target, context, calculateAnchorTop(target, context, offset), 'auto');
      target.focus({ preventScroll: true });
    };
    const initialPosition = getScrollPosition(context);
    const anchorTop = calculateAnchorTop(target, context, offset);
    scrollToAnchor(target, context, anchorTop, behavior);

    if (reducedMotion) await nextAnimationFrame(signal);
    else await waitForScrollSettle(context, initialPosition, anchorTop, signal);
    if (signal.aborted) return { ...base, status: 'cancelled', attempts: waited.attempts };
    let visibility = assessGuidedDemoVisibility(target);
    if (!visibility.targetVisible) {
      correctVisibility();
      await nextAnimationFrame(signal);
      visibility = assessGuidedDemoVisibility(target);
    }
    target.focus({ preventScroll: true });
    return {
      ...base,
      status: 'success',
      attempts: waited.attempts,
      focused: document.activeElement === target,
      scrolled: true,
      warnings: visibility.warnings,
    };
  } catch (error) {
    return { ...base, status: 'blocked', attempts: waited.attempts, warnings: [error instanceof Error ? error.message : 'Guided navigation was blocked.'] };
  }
};

export const captureGuidedDemoContext = (
  root: HTMLElement,
  selectedSectionBeforeGuidedDemo: ClimateRecoverySection,
  selectedPlantBeforeGuidedDemo?: string,
  selectedCaseBeforeGuidedDemo?: string,
): GuidedDemoContextSnapshot => {
  const scrollContainer = findGuidedDemoScrollContainer(root);
  const isDocument = scrollContainer === document.documentElement || scrollContainer === document.body || scrollContainer === document.scrollingElement;
  return {
    scrollYBeforeGuidedDemo: isDocument ? window.scrollY : scrollContainer.scrollTop,
    focusedElementBeforeGuidedDemo: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    selectedSectionBeforeGuidedDemo,
    selectedPlantBeforeGuidedDemo,
    selectedCaseBeforeGuidedDemo,
    scrollContainer,
  };
};

export const restoreGuidedDemoContext = async (
  snapshot: GuidedDemoContextSnapshot,
  restoreSelection: () => void,
) => {
  restoreSelection();
  await nextAnimationFrame();
  const isDocument = snapshot.scrollContainer === document.documentElement
    || snapshot.scrollContainer === document.body
    || snapshot.scrollContainer === document.scrollingElement;
  if (isDocument) window.scrollTo({ top: snapshot.scrollYBeforeGuidedDemo, behavior: 'auto' });
  else snapshot.scrollContainer.scrollTo({ top: snapshot.scrollYBeforeGuidedDemo, behavior: 'auto' });
  const launcher = document.getElementById('guided-demo-launcher');
  const heading = document.getElementById('climate-recovery-heading');
  const focusTarget = launcher instanceof HTMLElement
    ? launcher
    : snapshot.focusedElementBeforeGuidedDemo?.isConnected
      ? snapshot.focusedElementBeforeGuidedDemo
      : heading;
  focusTarget?.focus({ preventScroll: true });
};

export const useGuidedDemoNavigation = ({
  active,
  step,
  reducedMotion,
  prepareStep,
}: {
  active: boolean;
  step: GuidedDemoStep;
  reducedMotion: boolean;
  prepareStep: (step: GuidedDemoStep) => void;
}) => {
  const sequence = useRef(0);
  const wasActive = useRef(false);
  const [result, setResult] = useState<GuidedNavigationResult>();

  useEffect(() => {
    if (!active) { wasActive.current = false; setResult(undefined); return; }
    sequence.current += 1;
    const currentSequence = sequence.current;
    const controller = new AbortController();
    const focusShellBeforeTarget = !wasActive.current || step.order === 1;
    wasActive.current = true;
    setResult(undefined);
    prepareStep(step);
    void coordinateGuidedDemoNavigation({ step, reducedMotion, signal: controller.signal, focusShellBeforeTarget }).then((nextResult) => {
      if (sequence.current === currentSequence && nextResult.status !== 'cancelled') setResult(nextResult);
    });
    return () => controller.abort();
  }, [active, prepareStep, reducedMotion, step]);

  return result;
};
