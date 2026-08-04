# CR-05 Executive Climate Recovery Dashboard

Execution date: 2026-08-03

Status: implemented locally; pending human diff approval and commit

## 1. Objective and boundary

CR-05 adds the first read-only visual experience for ORBI PVMetrics IA —
Climate Recovery Edition. A judge can inspect the five-asset, fourteen-case
synthetic portfolio at executive, plant, queue, and case level without a
network connection or credential.

The dashboard is presentation software. It does not ingest live data, persist
state, approve work, dispatch maintenance, control equipment, diagnose failures,
or verify recovered energy or avoided emissions.

## 2. Architecture

The bounded UI is under
`src/pvmetrics-standalone/components/climate-recovery/`:

```text
ClimateRecoveryView.tsx       lazy-loaded feature shell and internal navigation
copy.ts                       typed ES/EN visual copy
hooks/                        deterministic CR-03/CR-04 UI adapter and local state
overview/                     KPIs, ranking, distributions, featured cases
plants/                       five-plant list and selected-plant presentation
cases/                        opportunity catalog and selected-case detail
review/                       read-only human-review queue
shared/                       availability, status, metric, panel, and disclosure UI
```

`useClimateRecoveryDemo()` creates the public CR-04 portfolio service once for
the mounted feature, adapts the CR-04 public portfolio into the public CR-03
application service, and queries both at the fixed CR-04 timestamp. React does
not calculate energy, climate impact, priority, recoverability, opportunity
score, rankings, timelines, or explainability.

## 3. Navigation

The existing state-based shell adds one lazy-loaded sidebar entry,
**Recuperación Climática**, with a CR-05 badge. The same real-button navigation
works through the existing mobile menu. Internal tabs provide Overview, Plants,
Opportunities, and Human Review; case detail is a local selected state.

## 4. Executive overview and KPIs

The initial screen contains exactly six primary cards:

1. five synthetic assets;
2. fourteen recovery cases;
3. estimated recoverable energy;
4. estimated avoided emissions;
5. pending human review;
6. the leading CR-04 Climate Opportunity Score.

The score tooltip states that the index is internal, transparent,
non-probabilistic, and uncertified. Estimated, synthetic, unavailable, blocked,
and review states remain visually explicit.

## 5. Ranking and distributions

The five-plant ranking uses the exact CR-04 order and exposes score, estimated
energy, estimated climate impact, high-priority count, pending review, data
quality, and overlap penalty context. The overview includes an accessible
recoverability donut, priority bar chart, and textual data-quality list. Chart
animation is disabled and every chart has a textual summary.

## 6. Plants and opportunities

The plant list shows asset type, generic region, synthetic capacity, case-state
counts, score, quality, high-priority and review counts, featured case, and
overlap penalties. Plant detail adds CR-04 KPIs, recoverability and priority
summaries, warnings, limitations, a local recoverability filter, and case
inspection.

The opportunity catalog uses all fourteen CR-03 case presentations. Local
filters cover plant, category, recoverability, priority, confidence, data
sufficiency, human review, and climate availability. Sorting is delegated to
the public CR-03 service for priority, recoverable energy, climate impact,
confidence, and title. The list also presents data sufficiency obtained from
the public CR-03 case-detail presentation. Desktop uses a controlled-scroll
table; smaller screens use cards.

## 7. Human-review queue

The queue presents deterministic due order, relative urgency, reasons, evidence
gaps, and review types. Its only controls inspect a case, evidence, or
methodology. No approve, reject, assign, complete, due-date, work-order, or
dispatch control exists.

## 8. Case detail

The selected-case experience presents the CR-03 headline and executive
narrative, eight CR-03 KPIs, recovery opportunity, non-binding actions,
projected scenario cards, visual comparison bars and accessible tables,
counterfactual climate impact, supporting and contradicting evidence, evidence
sources, unavailable and missing evidence, unconfirmed hypotheses,
deterministic timeline, confidence rationale, explainability rules,
assumptions, limitations, review boundary, and synthetic disclosure.

Blocked climate values show blocking reasons. Unavailable values never fall
back to zero. Synthetic factors are explicitly not verified. Scenarios remain
simulated projections and never promise recovery.

## 9. Localization

The mounted view switches between Spanish and English without reload. CR-03
provides localized presentation narratives and the typed CR-05 visual registry
contains new interface copy. Locale is component state only and is not stored.
This is bounded Climate Recovery localization, not application-wide i18n.

## 10. Responsive and accessibility

The feature uses one-, two-, three-, four-, and six-column responsive grids,
contained table overflow, stacked mobile cards, horizontally contained internal
navigation, and touch-sized controls. It uses semantic headings, tables with
headers, real buttons, visible keyboard focus, labels, `aria-current`, chart
summaries, status text in addition to color, and readable disclosures.

## 11. Tests

`climateRecoveryDashboard.test.tsx` adds 70 contract and static-render checks.
They cover navigation, offline/credential-free rendering, cardinalities, KPIs,
ranking order, distributions, plants, filters, sorts, review, every case detail,
scenarios, blocked and unavailable states, actions, evidence, hypotheses,
timeline, explainability, safety language, localization, responsive contracts,
accessibility, disabled chart motion, and forbidden runtime dependencies.

The repository uses the Node test runner and server-side React rendering because
no browser DOM test dependency is installed. Browser behavior is covered by the
manual loopback smoke test. No testing dependency was added.

## 12. QA evidence

Final local validation on 2026-08-03 completed without network access or an
advisory server:

- `npm.cmd ls --depth=0`: exit 0 in 2.8 seconds;
- `npm.cmd test`: exit 0 in 22.1 seconds, 309/309 tests passed, including 70
  CR-05 tests;
- `npm.cmd run lint`: exit 0 in 15.6 seconds;
- `npm.cmd run build`: exit 0 in 12.2 seconds;
- loopback `npm.cmd run dev`: HTTP 200 on `127.0.0.1:3000`;
- browser smoke: overview, five-plant list, plant detail, fourteen-case
  catalog, local filter and sort, thirteen-item review queue, case detail, and
  ES/EN switch passed;
- responsive checks at 1440, 1024, 768, 430, 390, and 360 CSS pixels found no
  page-level horizontal overflow;
- browser console: zero warnings and zero errors.

Vite retained the existing repository-wide warning for a main chunk above 500
kB. The lazy Climate Recovery chunk built at 277.77 kB (66.97 kB gzip). No
dependency or lockfile change was made.

## 13. Limitations and risks

- The visual is a deterministic synthetic demonstration, not a production UI.
- The global shell remains primarily Spanish; only the CR-05 bounded view is
  bilingual.
- Charts are executive summaries, not analytical or scientific validation.
- Review interactions navigate to evidence; they do not mutate workflow state.
- Real adoption requires governed data, factor authority, method validation,
  security, accessibility audit, operational safety review, and accountable
  human approval.

## 14. Claims

Permitted claims are limited to a functional local dashboard over five
synthetic assets and fourteen synthetic cases, with visible estimated recovery,
estimated climate impact, uncertainty, evidence, and human-review requirements
in Spanish and English. No connection, customer, real recovery, verified
emissions, autonomous diagnosis, operational authority, scientific validation,
deployment, or active SaaS claim is supported.

## 15. Next module

A separately reviewed CR-06 may focus on competition storytelling and visual
polish while preserving the deterministic, synthetic, read-only, no-network,
and human-authority boundaries. It must not add production or operational
claims without separate evidence and approval.
