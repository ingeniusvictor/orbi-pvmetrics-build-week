# CR-07 Premium UX and Competition Polish

Execution date: 2026-08-04

Status: implemented and validated locally; pending human staged-diff approval

## A. Summary

CR-07 turns the existing Climate Recovery experience into a premium,
competition-oriented local presentation without changing domain calculations,
fixtures, services, cases, or the eight-step story. It adds a concise executive
hero, tiered KPIs, a prominent Climate Opportunity Score, a service-selected
lead opportunity, a Top-3 leaderboard, clearer chart communication, a bounded
motion system, polished controls/cards/empty states, and an in-memory
Presentation Mode.

Climate Recovery remains synthetic, read-only, non-operational, offline, and
human-gated. Presentation Mode is a visual layout mode, not a recording or
production guarantee.

## B. Preflight

- Repository: `orbi-pvmetrics-build-week`.
- Branch: `competition/ai-climate-recovery-2026`.
- Approved starting HEAD: `2f903d6984304093e7c10457af80b156f93c63bd`.
- Upstream: `origin/competition/ai-climate-recovery-2026`.
- Starting divergence: 0 ahead / 0 behind.
- Starting tree: clean.
- `package.json` and `package-lock.json`: identical to starting `HEAD`.
- Protected master and backup: `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.
- Protected tag: `79e10a4fef888e50117c2be5dba744f620817323`.
- Dependencies added: none.

## C. Visual audit

The CR-06.1 view already had a strong dark ORBI identity, stable guided
navigation, six clear KPIs, complete rankings, accessible charts, explicit
blocked/unavailable states, and responsive behavior. CR-07 addressed uniform
card weight, technical hero copy, table-first ranking, equal featured cards,
limited chart meaning, recording chrome, and inconsistent microinteraction
timing.

## D. Tokens

`src/index.css` now centralizes CR surfaces, borders, three shadow levels,
accent glow, three radii, section spacing, fast/standard/panel motion, and one
easing curve. Existing amber, cyan, emerald, violet, slate, and semantic status
colors remain the source palette; no component-local arbitrary palette or
parallel design system was added.

## E. Hero

The bilingual hero now leads with the approved outcome statements:

- recover lost clean energy;
- reduce avoidable emissions;
- prioritize opportunities with explainable AI.

It retains Climate Recovery Edition, Synthetic Executive Demonstration,
read-only/no-network status, fixed evaluation time, ES/EN selection, guided and
free CTAs, synthetic/operator disclosure, and return to the general dashboard.
The 1440 x 900 composition keeps the mode selector visible without manual
scroll.

## F. KPI hierarchy

Exactly six executive KPIs remain. Estimated recoverable energy, estimated
avoided emissions, and Climate Opportunity Score are the primary tier;
synthetic assets, recovery cases, and pending human review form the supporting
tier. No KPI value is recalculated in React.

## G. Climate Opportunity Score

The unchanged CR-04 score is presented in a restrained 0-100 ring with its
band, leading plant, synthetic label, and the existing non-probability,
non-certified explanation. No count-up timer was added, keeping SSR and tests
deterministic. Reduced-motion rules remove all entry transforms and delays.

## H. Featured opportunity

The lead card is selected from `executive.featuredCases`, which is supplied by
the existing service. It is not hardcoded to a plant or case. It exposes plant,
case, category, priority, recoverability, estimated energy, estimated climate
impact, confidence, recommended next step, human review, and Inspect Case.
The remaining service-selected items stay available as secondary cards.

## I. Leaderboard

The first three service rankings are presented as an accessible ordered
leaderboard with score, energy, high-priority count, review count, data quality,
and visible overlap penalty. The complete five-plant ranking remains available
below in an open disclosure with its captioned desktop table and stacked mobile
cards.

## J. Charts

The existing charts retain their service data and disabled animation. The
recoverability donut now shows the service-provided percentage and count in its
center; priority bars distinguish critical/high states and include a textual
summary; data-quality bars show readable percentages plus a general review
recommendation. All three preserve textual equivalents and synthetic
limitations, and none relies on color alone.

## K. Presentation Mode

Free Explore, Guided Demo, and Presentation Mode are exposed through an
accessible pressed-state control. Presentation Mode:

- minimizes the desktop sidebar to an icon rail and hides it on mobile;
- removes workspace selectors and technical global chrome;
- expands the content area;
- retains synthetic, estimated, unavailable, blocked, and Human Review copy;
- retains Guided Demo, Exit, Reset, Escape, and global dashboard exit;
- shows a bounded Recording Safe label and non-guarantee;
- uses component memory only and requests no fullscreen state.

Guided Demo can run while Presentation Mode remains active. Exiting or resetting
the guided story returns to Presentation Mode rather than discarding it.

## L. Motion

Motion durations are 170 ms, 210 ms, and 260 ms with one easing curve. They are
used for button feedback, interactive cards, hero/KPI/featured/leaderboard
entry, and shell mode changes. There are no loops, pulses, particles, timers,
or permanent motion. `prefers-reduced-motion` removes entry animation,
transforms, delays, and smooth transition duration.

## M. Buttons

Primary, secondary, and restrained ghost treatments share hover, active,
focus-visible, and motion feedback. Climate Recovery controls and selects use a
minimum 44 px height; guided controls retain a 44 x 44 px minimum.

## N. Cards

Static KPI/panel cards no longer imply interactivity through hover movement.
Interactive leaderboard and opportunity cards use the shared restrained lift.
Borders, padding, radii, surface levels, explanations, limitations, and CTAs are
consistent; glow is reserved for the score and lead opportunity.

## O. Sidebar

Free Explore keeps the normal shell. Guided Demo attenuates the sidebar.
Presentation Mode reduces it to a keyboard-accessible icon rail on desktop and
hides it on mobile, while the in-view dashboard exit remains clearly visible.
Other ORBI views keep their existing shell.

## P. Empty states

The opportunity no-results state now includes a professional explanation and a
44 px reset action. Existing unavailable, blocked, missing-case, missing-plant,
service-error, and no-review behavior remains explicit and non-numeric where a
value does not exist.

## Q. Typography and spacing

Section headings, captions, secondary copy, KPI values, and vertical rhythm now
follow a clearer executive hierarchy. Climate Recovery introduces no 9-11 px
copy; mobile secondary copy remains at least 12 px. The global font is
unchanged.

## R. Responsive

Local smoke covered 1440 x 900, 1280 x 800, 1024 x 768, 768 x 1024, 430 x 932,
390 x 844, and 360 x 800. Every viewport had one h1, no page-level horizontal
overflow, and visible 44 px controls. Internal tab/table overflow remains
intentionally contained. Presentation Mode hides the global sidebar below the
desktop breakpoint.

## S. Accessibility

The feature retains one h1, coherent h2/h3 structure, real buttons, labels,
captions, `aria-current`, `aria-pressed`, live guided announcements, visible
focus, chart summaries, ordered leaderboard semantics, status text in addition
to color, Escape behavior, and reduced-motion support. Constrained viewport
testing exercises the same reflow pressure as zoomed layouts; a formal
assistive-technology and 200% browser-zoom audit remains a production adoption
requirement.

## T. Performance

- CR-06.1 Climate Recovery baseline: 300.68 kB (76.40 kB gzip).
- CR-07 Climate Recovery: 316.15 kB (79.73 kB gzip).
- Increase: 15.47 kB (3.33 kB gzip).
- Guided Demo lazy chunk: 5.88 kB (1.93 kB gzip).
- Case Detail lazy chunk: 19.17 kB (4.37 kB gzip).
- Presentation Mode: no separate chunk; small state/layout logic lives in the
  already lazy Climate Recovery shell.
- Main entry: 3,230.01 kB (557.34 kB gzip).

The existing Vite warning for the legacy main chunk above 500 kB remains. Mode
switching performs no data fetch, calculation, persistence, or duplicate chart
render.

## U. Tests

CR-07 adds 48 focused contracts to the previous 408-test suite. They cover the
ES/EN hero, six-KPI limit, unchanged/non-probabilistic score, reduced motion,
service-selected featured case, Top 3 and full ranking, overlap penalty, chart
percentage/summaries, three modes, sidebar behavior, Exit/Reset, no fullscreen,
Recording Safe disclosure, Estimated/Human Review preservation, tokens,
buttons/cards/empty state, typography, mobile rules, 44 px targets, and
forbidden storage/network/clock/random/GPT/domain imports.

Final repository result: 456/456 passing.

## V. Technical QA

- `npm.cmd ls --depth=0`: exit 0; 5.72 s.
- `npm.cmd test`: exit 0; 456/456; 17.72 s wall time.
- `npm.cmd run lint`: exit 0; 12.97 s.
- `npm.cmd run build`: exit 0; 11.24 s command wall time; Vite 9.34 s.
- `git diff --check`: exit 0; line-ending notices only.
- `package.json` and `package-lock.json`: byte-identical Git object hashes to
  starting `HEAD`.
- New dependencies: zero.

## W. Visual smoke

Loopback Vite used `127.0.0.1:4173` because the first 3000 probe resolved to a
different local application context. No existing process was altered. Free,
Guided, Presentation, ES/EN, hero, KPIs, score, leaderboard, full table,
charts, featured opportunity, mobile sidebar, and premium no-results/reset
were exercised. Browser console result: zero warnings and zero errors.

## X. Recording rehearsal

At 1440 x 900, Presentation Mode completed steps 1-8 using only Next. At every
step the guided shell, narrative, controls, target anchor, and correct focused
anchor were inside the viewport; page-level horizontal overflow remained
false. Return preserved Presentation Mode, Reset returned to Overview, steps
1-2 were repeated, Exit restored launcher focus, and Recording Safe remained
visible. Manual recovery scrolls: zero. Lost focus events: zero. Hidden control
events: zero.

## Y. Documentation

This report, README, Build Week changelog, claims register, and a minimal
CR-06.1 forward reference describe the bounded CR-07 implementation and local
evidence.

## Z. Claims

Supported claims are limited to a premium competition-oriented local visual
experience, reduced local recording chrome, three visual/exploration modes,
and improved executive hierarchy without calculation changes. Visual polish
does not validate energy or climate calculations, establish production
deployment, represent real plants/customers, authorize operations, or replace
human review and technical evidence.

## AA. Files and staging

The implementation is bounded to existing Climate Recovery components, minimal
outer-shell mode classes, centralized CSS, focused tests, and competition
documentation. Only CR-07 files are staged after final QA for human inspection.
No commit exists.

## AB. Risks

- The legacy main chunk remains large and outside CR-07 scope.
- Presentation Mode is optimized for local demonstration, not every browser,
  capture tool, device, or accessibility technology.
- The global shell is only partially bilingual outside Climate Recovery.
- Production adoption still requires governed data, validated methods,
  security review, accessibility audit, and accountable operators.

## AC. Restrictions

No dependency, lockfile, domain calculation, fixture, service, backend,
authentication, persistence, API, network call, GPT runtime, real data,
coordinate, dispatch, approval mutation, telecontrol, PDF export, deployment,
push, PR, branch, tag, or commit was introduced.

## AD. Approval request

Review the staged CR-07 diff. If approved, create the single requested local
commit `feat: add premium Climate Recovery competition experience`. Do not
push.

CR-07 PREMIUM UX READY FOR HUMAN APPROVAL
