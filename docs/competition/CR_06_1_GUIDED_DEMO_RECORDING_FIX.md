# CR-06.1 Guided Demo Recording Fix

Execution date: 2026-08-04

Status: implemented and validated locally; preserved by CR-07

## Scope and preflight

- Branch: `competition/ai-climate-recovery-2026`.
- Approved starting HEAD: `f05eb05531c774d96c87e624e1eba3e5f535cff5`.
- Upstream at start: `origin/competition/ai-climate-recovery-2026`.
- Synchronization at start: 0 ahead / 0 behind.
- Initial tree: clean.
- Dependencies and `package-lock.json`: unchanged.
- Backend, network, credentials, storage, GPT, deployment, push, PR, and commit:
  not introduced.

## Root cause

CR-06 used a single animation-frame delay followed by
`scrollIntoView({ block: 'center' })` on large presentation containers. Lazy
case/detail transitions could replace the element while navigation was in
flight, and the browser could center an entire tall region rather than the
specific narrative target. The guided shell remained in normal document flow,
so it and its controls could be pushed outside the recording viewport. Exit
also reset exploration instead of restoring the prior in-memory context. The
actual scrolling surface is the standalone application's outer `<main>`, not
always `window`.

## Architecture of the fix

`useGuidedDemoNavigation.ts` is the single navigation coordinator. Each step
declares one required anchor and any secondary section that must be open. The
coordinator prepares the correct overview, case, or review state; waits for the
real anchor; finds its scrollable ancestor; applies a bounded offset; waits for
smooth scrolling to settle; performs at most one corrective scroll; and moves
focus only to the final mounted anchor. An `AbortController` cancels obsolete
work when the step changes.

The coordinator returns typed `success`, `target-not-found`, `cancelled`,
`timeout`, or `blocked` results. The view exposes the current result for test
observability and the shell presents an accessible failure status rather than
silently losing navigation.

## Step anchors

| Step | Anchor | Required presentation state |
| --- | --- | --- |
| 1 | `guided-demo-anchor-problem` | Portfolio overview |
| 2 | `guided-demo-anchor-opportunity` | Executive opportunity KPI |
| 3 | `guided-demo-anchor-portfolio-ranking` | Plant ranking |
| 4 | `guided-demo-anchor-recoverable-case` | Recoverable case; Evidence open |
| 5 | `guided-demo-anchor-non-recoverable-case` | Non-recoverable case |
| 6 | `guided-demo-anchor-insufficient-data` | Insufficient-data case; Methodology open |
| 7 | `guided-demo-anchor-explainability-review` | Human review queue open |
| 8 | `guided-demo-anchor-climate-recovery` | Recovery scenario visible |

Anchors are unique, one pixel high, programmatically focusable, and attached to
the specific content needed for the narration. Navigation no longer uses
`scrollIntoView` or `block: 'center'`.

## Lazy synchronization and cancellation

Anchor discovery is bounded to eight animation-frame attempts and requires a
stable mounted candidate before it can be used. Smooth-scroll completion uses
the scrolling surface's `scrollend` event with a bounded 48-frame fallback.
Every new step aborts the preceding request. Case anchors are not supplied
until the selected case matches the step, preventing a previous lazy case from
winning the race.

## Scroll offsets and visibility assertions

- Desktop: 24 px above the target.
- Tablet: guided-shell height plus 24 px.
- Mobile: guided-shell height plus 16 px.
- Reduced motion: automatic scrolling.
- Normal motion: smooth scrolling.
- Corrective scrolls: maximum one.

The visibility contract records the shell, target, controls, narrative,
viewport height, active element, and scroll position. It rejects clipped
targets, controls or narrative outside the guided viewport, body focus, and
horizontal overflow.

## Focus and restoration policy

Focus is applied only after the required anchor has mounted and scrolling has
settled. Missing targets never fall back to `body`. Exit, Escape, and final
Return share one restoration path. It restores the prior section, plant, case,
and scroll position from an in-memory snapshot, then focuses the Guided Demo
launcher (or the Climate Recovery heading only if the launcher is unavailable).
No browser storage is used.

Reset remains in Guided mode, clears secondary disclosure state, returns to
step 1, synchronizes the overview, and focuses the problem anchor. Previous
uses the same coordinated navigation in reverse.

## Mobile shell

The shell is sticky and bounded to 58 dVH on compact viewports. Narrative copy
has its own contained scroll region and an accessible compact/expand control;
the progress indicator and all controls remain visible. Controls have a minimum
44 by 44 px target. At desktop widths the shell and workspace use a stable
split layout.

## Localization

Both ES and EN now cover the guided UI, outer standalone shell, residual case
statuses, seven-day scenario label, grammatical case counts, and the field
inspection approval/safety gate. The visual English flow contains no unresolved
presentation keys or `case(s)` placeholder.

## Automated tests and build

- `npm.cmd ls --depth=0`: PASS; no new dependency.
- `npm.cmd test`: PASS, 408/408.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- Guided Demo contract/dashboard checks: 165 total, including 40 CR-06.1
  navigation, restoration, responsive, focus, and localization checks.
- Built lazy chunks: Guided Demo 5.87 kB (1.93 kB gzip), Case Detail 19.15 kB
  (4.35 kB gzip), Climate Recovery 300.68 kB (76.40 kB gzip).
- The pre-existing main-chunk warning above 500 kB remains outside this scope.

## Visual smoke matrix

All eight steps passed at each required viewport with no manual scroll:

- 1440 x 900
- 1280 x 800
- 1024 x 768
- 768 x 1024
- 430 x 932
- 390 x 844
- 360 x 800

Result: 56/56 step/viewport combinations with shell, narrative, progress,
controls, target, and correct anchor focus visible; no horizontal overflow and
no destructive overlay. Exit, Escape, Reset, Return to Overview, Previous, and
ES/EN were exercised separately. Browser console result: zero warnings and
zero errors.

## Recording rehearsal

At 1440 x 900 a complete Start -> steps 1-8 -> Return sequence used only Next
and no manual scrolling. Approximate eight-step duration was 37 seconds in the
background-controlled browser. There were zero interruptions, zero lost focus
events, zero hidden-control events, and zero recovery scrolls. A fresh launch
then repeated steps 1-2 and exited with launcher focus restored.

## Claims and restrictions

The Guided Demo navigation has been stabilized for local recording and the
guided flow has been validated across desktop and mobile viewports. This does
not establish a live operational workflow, production readiness, verified
energy recovery, verified avoided emissions, autonomous decision-making, or a
replacement for human presentation and review.

No commit has been created. The bounded CR-06.1 diff is staged only for human
review.

## CR-07 forward reference

CR-07 preserves this eight-step navigation coordinator, anchors, focus policy,
Exit/Reset restoration, responsive shell, and safety boundaries. Presentation
Mode can host the same guided flow while reducing unrelated global chrome. See
`CR_07_PREMIUM_UX_COMPETITION_POLISH.md` for the visual, test, smoke, and
recording evidence added on top of CR-06.1.
