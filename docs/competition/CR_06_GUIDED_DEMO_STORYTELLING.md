# CR-06 Guided Demo Storytelling

Execution date: 2026-08-04

Status: implemented; CR-06.1 recording navigation validated locally and pending
human staged-diff approval

## CR-06.1 recording-fix addendum

CR-06.1 started from approved HEAD
`f05eb05531c774d96c87e624e1eba3e5f535cff5`. It adds explicit content anchors,
a cancellable viewport-aware coordinator, lazy synchronization, bounded sticky
mobile controls, and in-memory context restoration. All eight steps passed at
the seven required viewports (56/56 combinations), the recording rehearsal
required zero manual recovery scrolls, and the repository suite passes 408/408.
See `CR_06_1_GUIDED_DEMO_RECORDING_FIX.md` for the complete evidence.

## A. Summary

CR-06 transforms the CR-05 synthetic executive dashboard into a controlled,
bilingual, three-to-five-minute competition experience while preserving free
exploration. It does not change CR-02 assessment calculations, generate data,
connect to a network, persist workflow state, or add operational authority.

## B. Preflight

- Repository: `orbi-pvmetrics-build-week`.
- Branch: `competition/ai-climate-recovery-2026`.
- Approved starting HEAD: `4bdff68774d4797321139229e7cf2783af3af341`.
- Upstream at start: `origin/competition/ai-climate-recovery-2026`.
- Synchronization at start: 0 ahead / 0 behind.
- Tree and `package-lock.json` at start: clean and unchanged.
- Protected master and backup: `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.
- Protected tag: `79e10a4fef888e50117c2be5dba744f620817323`.
- Dependencies added: none.

## C. Issues CR-05V resolved

- CR05V-01: review KPI/queue mismatch fixed at the CR-04 service boundary.
- CR05V-02: typed presentation localization covers KPI/scenario keys, action
  labels, methodologies, limitations, timeline, explainability, queue reasons,
  and blocked/unavailable messages in ES and EN.
- CR05V-03: Case Detail is executive-first with eight secondary accordions.
- CR05V-04: captions, select names, semantic active states, one h1, guided focus,
  live announcements, and accordion semantics are present.
- CR05V-05/06: mobile tabs use a restrained scrollbar/fade and CR copy no longer
  uses 9-11 px utilities.
- CR05V-07: Guided Demo and Case Detail are separate lazy chunks.
- CR05V-08: Climate Recovery sets a scoped product title and restores the
  general title on exit.

## D. Review count

The assessment-level `requiresHumanReview` flag produced by CR-02 is canonical.
The CR-04 review queue now uses that gate and adds specialized reasons when
available, with a deterministic general reason otherwise. The BESS strategy
case is included, producing 14 pending reviews in the KPI, badge, queue, plant
totals, and opportunity presentations. Queue order remains stable and unique.

## E. Localization

`copy.ts` owns interface copy and `presentationLocalization.ts` owns the typed
presentation mapping for service text. Unresolved `kpi.*`, `scenario.*`, or
`action.*` keys do not appear in normal ES or EN flows. Technical identifiers,
units, MPPT, BESS, soiling, clipping, curtailment, and Climate Opportunity Score
remain untranslated by design where they are accepted domain terms.

## F. Guided Demo architecture

`GuidedDemoStep` declares order, narrative keys, target section, optional plant
and case, focus target, duration hint, key points, warnings, synthetic-disclosure
requirement, skip policy, locale support, expected viewport, and explicit links.
`GuidedDemoState` stores deterministic local mode, step, completion, fixed start
timestamp, locale, reduced-motion preference, and narration visibility. It uses
no current clock, random value, storage, fetch, or autoplay timer.

## G. Demo steps

1. The Problem: five synthetic assets and fourteen deterministic cases.
2. The Opportunity: estimated energy, climate impact, score, and human review.
3. Portfolio Prioritization: score, quality, recoverability, and penalties.
4. Recoverable Case: inverter evidence and human-gated next step.
5. Not Every Loss Is Recoverable: grid curtailment and suppressed actions.
6. Insufficient Data: blocked impact and request-more-data behavior.
7. Explainability and Human Review: queue, evidence, and operator authority.
8. Climate Recovery: counterfactual scenario and unverified estimated impact.

## H. Free vs Guided

Free Explore retains CR-05 navigation, filters, sorts, plant views, queue, and
case inspection. Guided Demo provides focus and narrative without disabling the
underlying read-only product. Exit, Escape, or the final Return to Overview
restores free mode. No step advances without an explicit user action.

## I. Progressive disclosure

The visible first layer is Summary, Key Metrics, Recommended Next Step, Recovery
Scenario, and Human Review. Evidence, Hypotheses, Timeline, Explainability,
Methodology, Assumptions, Limitations, and Suppressed Actions are independent
accessible accordions. Guided steps may explicitly open a relevant accordion.

## J. Case Detail

Recommended actions remain in the primary next-step section. Suppressed actions
are retained in a separate secondary section with an explanation. Warnings,
blocked-impact reasons, synthetic disclosure, confidence limits, and human
authority stay visible outside collapsed technical content.

## K. Accessibility

Ranking and opportunity tables have captions. Both outer-shell selects have
programmatic labels. Primary and internal navigation expose `aria-current`.
Climate Recovery has one h1. Guided mode manages focus, announces step changes,
supports Escape and arrow navigation, and respects reduced motion. Accordions
use buttons with `aria-expanded`, `aria-controls`, and labelled regions.

## L. Mobile

The sticky tab row remains keyboard and touch scrollable with a four-pixel
low-contrast scrollbar and edge fade. Browser smoke at 430, 390, and 360 CSS
pixels found no page-level horizontal overflow; launcher and tabs remained
usable.

## M. Document title

The general document title is `ORBI PVMetrics IA`. While Climate Recovery is
mounted it is `ORBI PVMetrics IA — Climate Recovery Edition`; unmount restores
the previous general title.

## N. Performance

- CR-05 baseline Climate Recovery chunk: 277.77 kB (66.97 kB gzip).
- CR-06 initial Climate Recovery chunk: 290.56 kB (73.26 kB gzip).
- Guided Demo shell: 4.96 kB (1.71 kB gzip), lazy.
- Case Detail: 18.86 kB (4.24 kB gzip), lazy.
- Case-detail evaluation is deferred outside the opportunities/case flow.
- The initial CR chunk increased 12.79 kB to support localization, state, and
  launch controls; technical detail and narrative renderers do not load on the
  free overview.

## O. Tests

CR-06 adds 59 checks: four portfolio consistency tests and 55 dashboard/demo
tests. They cover review consistency, localization, all eight steps, navigation,
reset/exit, safety boundaries, progressive disclosure, accessibility, mobile,
title, lazy loading, and forbidden runtime capabilities. Repository result:
368/368 passing, up from 309/309.

## P. QA

- `npm.cmd ls --depth=0`: exit 0; 1.94 s.
- `npm.cmd test`: exit 0; 368/368; 15.18 s wall time.
- `npm.cmd run lint`: exit 0; 11.71 s.
- `npm.cmd run build`: exit 0; 9.94 s in the measured QA run.
- `git diff --check`: exit 0; line-ending notices only.
- Vite retains the pre-existing main-chunk warning above 500 kB.
- `package-lock.json`: unchanged.

## Q. Smoke test

Loopback used `127.0.0.1:4173` because port 3000 was unavailable. Free Explore,
all eight guided steps, Previous, Next, Skip, Exit, Reset, Escape, ES/EN,
14-item review queue, BESS inclusion, recoverable/non-recoverable/insufficient
cases, accordions, captions, select labels, title restoration, and 430/390/360
responsive layouts passed. HTTP navigation succeeded and the browser console
had zero warnings and zero errors. The server was stopped after validation.

## R. Documentation

This report, the root README, Build Week changelog, and claims register describe
the bounded guided experience and its validation evidence.

## S. Claims

Permitted claims are limited to a deterministic guided synthetic competition
demo, switchable free/guided modes, preserved uncertainty and human review,
progressive disclosure, and ES/EN storytelling. No live, customer, recovery,
verified-emissions, autonomous-decision, dispatch, production, or deployment
claim is supported.

## T. Files

Changes are bounded to the CR-04 review-queue contract/tests, CR-06 Climate
Recovery components/tests/copy, minimal shell/title/CSS updates, and competition
documentation. No fixture, dependency, lockfile, backend, or API file changed.

## U. Staging

Only the CR-06 implementation, tests, shell polish, and documentation files are
staged after final QA. Cached name/status, stat, and diff-check evidence is
presented to the human reviewer before commit.

## V. Risks

The Spanish technical fallback intentionally summarizes some low-level English
fixture prose while preserving identifiers, rule versions, evidence references,
warnings, and the full English presentation. A production localization program
would require domain-reviewed translations. The legacy main bundle remains over
500 kB and outside CR-06 scope.

## W. Restrictions

No dependency, lockfile change, backend, authentication, persistence, API,
network call, GPT integration, real data, coordinate, dispatch, approval,
telecontrol, PDF export, deployment, push, PR, or commit was introduced.

## X. Approval request

Review the staged CR-06 diff. If approved, create the single requested commit:
`feat: add Climate Recovery guided competition demo`. Do not push.
