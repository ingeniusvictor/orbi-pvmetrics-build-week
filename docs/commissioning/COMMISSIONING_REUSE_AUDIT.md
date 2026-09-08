# ORBI PVMetrics — Commissioning Reuse Audit

Version: v0.1
Status: APPROVED BASELINE AUDIT
Gate: G00 FULL PASS
Branch: `feature/bess-commissioning-workspace`
Baseline commit: `e616b94e8e8d69d793cde2678301360907e3a4ad`
Functional Climate Recovery source: `40e85b18752bc15ef1de67e762f7580e479f1c91`

## 1. Purpose

This audit identifies what the BESS Commissioning Workspace must reuse, extend, isolate, or create in the real ORBI PVMetrics repository before implementation begins.

Commissioning remains read-only / Shadow Mode. It may ingest, normalize, analyze, correlate, document, review and report. It must not send BMS/PCS/EMS/SCADA commands, modify setpoints, operate protections, authorize energization, or replace human acceptance.

## 2. Verified application shell

Entry flow:

`index.html -> src/main.tsx -> src/App.tsx -> src/pvmetrics-standalone/app/OrbiPVMetricsStandaloneApp.tsx -> StateProvider + state-switched views`

The application does not use React Router for the main PVMetrics workspace. Main navigation is a typed React state union and switch.

Primary integration point:

`src/pvmetrics-standalone/app/OrbiPVMetricsStandaloneApp.tsx`

Current shell already lazy-loads Incident Copilot and Climate Recovery. Commissioning must follow the same lazy boundary pattern.

Decision: REUSE + EXTEND.

## 3. Existing navigation and modules

Verified main views include:

- Dashboard
- Climate Recovery
- Incident Copilot
- Live Monitoring
- Daily / Weekly / Monthly Forecast
- BESS
- Energy Sales
- SCADA
- Plant Profiles
- Data Sources
- Signal Mapping
- Signal Quality
- Reports
- Configuration

Commissioning will be introduced as a new permanent top-level workspace rather than under Build Week or Climate Recovery.

Recommended future view id: `commissioning`.

Decision: REUSE + EXTEND.

## 4. State and persistence

Verified file:

`src/pvmetrics-standalone/app/StateContext.tsx`

Current global app state persists companies, active company, active plant, noise level, client checklist, SCADA registers, lockdown and report history through browser `localStorage`.

There is no verified production database or server-side persistence layer for this standalone baseline.

Commissioning records such as TestExecution, Criterion snapshots, Findings, Punch, Retests, Human Acceptance, Baseline and Handover are long-lived audit records and must not be inserted casually into the current global StateContext.

Decision:

- Existing workspace selection state: REUSE AS-IS.
- Existing global localStorage architecture: REFERENCE ONLY.
- Commissioning persistence boundary: NEW, additive, repository/service abstraction first.
- No migration to a remote database is authorized by this audit.

## 5. BESS view

Verified file:

`src/pvmetrics-standalone/components/BessView.tsx`

The current BESS view is simulation/advisory oriented. It includes projected SOC, charge/discharge advice, BESS confidence concepts, data-quality display, commercial confidence and technical BESS parameters. It explicitly states read-only behavior and no EMS/BMS command execution.

The view currently derives demo values from plant configuration and `generateDailyForecast`; it is not a commissioning test engine.

Decision:

- BESS visual language and plant selection: REUSE.
- Recharts/time-series conventions: REUSE + EXTEND.
- BESS calculations in this view: DO NOT REUSE as commissioning acceptance criteria.
- Commissioning test/result domain: NEW.

## 6. Data Source Manager

Verified file:

`src/pvmetrics-standalone/components/data-sources/PVMetricsDataSourceManagerView.tsx`

Existing architecture already models read-only readiness for future sources and explicitly prohibits telecontrol.

Decision: REUSE + EXTEND.

Commissioning MVP source modes:

- MANUAL
- FILE_IMPORT
- EXISTING_PVMETRICS_DATA_READ

Future OT connectors remain outside MVP and require a separate OT READ-ONLY SECURITY REVIEW.

## 7. Signal Mapping

Verified file:

`src/pvmetrics-standalone/components/signal-mapping/PVMetricsSignalMappingView.tsx`

Existing Signal Mapping includes a technical catalog, expected units/ranges, validation summary, quality-rule integration and readiness matrix. It is explicitly read-only and local.

Decision: REUSE + EXTEND.

Commissioning must not create a second canonical signal registry if the existing types/services can be extended.

Required commissioning concept:

`OEM/source signal -> canonical PVMetrics signal -> normalized sample -> metric -> criterion -> assessment`

## 8. Signal Quality

Verified file:

`src/pvmetrics-standalone/components/signal-quality/PVMetricsSignalQualityRulesView.tsx`

A local quality-rule concept already exists for presence, range, unit, timestamp, quality and readiness.

Current implementation uses demonstration datasets and does not ingest production data.

Decision: REUSE DESIGN + EXTEND ENGINE.

Commissioning Data Quality must add deterministic dataset-level checks for:

- coverage
- missing samples
- duplicates
- invalid values
- timestamp integrity
- telemetry gaps
- frozen signals
- signal mapping status

Global result values planned: GOOD / DEGRADED / POOR / INVALID.

## 9. Reports

Verified file:

`src/pvmetrics-standalone/components/ReportsView.tsx`

Existing reporting supports print, TXT/JSON export, local report history, checklist and presentation utilities.

Some current QA/demo behavior is explicitly presentation-oriented and must not be reused as commissioning evidence logic.

Decision:

- Export/print conventions: REUSE + EXTEND.
- Report history concept: REUSE PATTERN.
- Commissioning report templates: NEW on top of existing reporting surface.
- Demo QA console / hardcoded demo password flows: DO NOT USE for commissioning authority/security.

Planned commissioning templates:

- Test Report
- Campaign Summary
- Punch List Report
- Final Commissioning Summary

These reports are analytical records and do not become OEM certificates.

## 10. Climate Recovery reusable architecture

Verified Climate Recovery is integrated under:

- `src/pvmetrics-standalone/climate-recovery/`
- `src/pvmetrics-standalone/components/climate-recovery/`

The frozen competition chain contains deterministic domain logic, application services, portfolio aggregation, explainability, evidence-oriented case presentation, human review, typed ES/EN presentation contracts, guided/presentation modes and extensive regression tests.

Final audited Climate Recovery freeze reported 553/553 passing tests, lint PASS and production build PASS.

Decision:

REUSE PATTERNS:

- deterministic domain engine
- explicit evidence traceability
- facts vs hypotheses separation
- human review separation
- fixed synthetic fixtures
- expected result oracles
- typed contracts
- read-only boundaries
- lazy loading
- ES/EN localization approach
- progressive disclosure

DO NOT COUPLE Commissioning directly to competition presentation components where a shared neutral contract is more appropriate.

## 11. Competition-only layers

The following Climate Recovery features are valuable historical assets but are not mandatory product navigation for Commissioning:

- Guided Demo
- Presentation Mode
- Competition Video Mode
- competition badges/copy

Decision: KEEP, HIDE LATER / INTERNAL / FEATURE FLAG as appropriate.

Do not delete during Commissioning implementation.

## 12. Types architecture

Verified directory:

`src/pvmetrics-standalone/types/`

The repository already uses many bounded typed capability files rather than one monolithic type definition.

Decision: Commissioning should follow the same bounded-type pattern.

Recommended new root:

`src/pvmetrics-standalone/commissioning/`

with bounded submodules rather than placing permanent functionality under `src/build-week/`.

## 13. Recommended Commissioning module structure

```text
src/pvmetrics-standalone/commissioning/
  domain/
  contracts/
  persistence/
  import/
  normalization/
  quality/
  phases/
  metrics/
  criteria/
  anomalies/
  findings/
  punch/
  baseline/
  handover/
  fixtures/
  services/
  components/
  tests/
```

Exact file names may be refined during IMPL-01/02.

## 14. Reuse matrix

| Capability | Decision |
| --- | --- |
| App shell | REUSE + EXTEND |
| State-based navigation | REUSE + EXTEND |
| Company / active plant selection | REUSE AS-IS |
| Global StateContext | REUSE AS HOST CONTEXT, DO NOT OVERLOAD |
| BESS visual conventions | REUSE |
| BESS demo acceptance logic | DO NOT REUSE |
| Recharts | REUSE + EXTEND |
| Data Source Manager | REUSE + EXTEND |
| Signal Mapping | REUSE + EXTEND |
| Signal Quality concepts | REUSE + EXTEND |
| Readiness Matrix concepts | REUSE + EXTEND |
| Reporting/export surface | REUSE + EXTEND |
| Climate Recovery deterministic patterns | REUSE PATTERN |
| Climate Recovery human review pattern | REUSE PATTERN |
| Climate Recovery evidence/explainability | REUSE PATTERN |
| Incident Copilot provider-neutral pattern | REUSE PATTERN |
| Scope | NEW |
| Campaigns | NEW |
| Test Library | NEW |
| TestExecution / Retest | NEW |
| Criteria Registry / snapshots | NEW |
| Commissioning DQ engine | NEW SHARED/EXTENDED ENGINE |
| Commissioning metrics | NEW |
| Anomaly Radar | NEW |
| Findings | NEW |
| Punch List | NEW |
| Human Acceptance persistence | NEW |
| Commissioning Baseline | NEW |
| Handover | NEW |
| File package import | NEW |
| OT write/control | FORBIDDEN |

## 15. Duplicate-prevention rules

Commissioning implementation must not create:

- a second application shell
- a second company/plant selector
- a second chart library
- a second signal registry without first evaluating the existing mapping types
- a second generic report system
- a second generic data-source registry
- an OT write/control path

## 16. Persistence recommendation

Because the verified standalone baseline uses browser localStorage and no production database is confirmed, persistence implementation must be staged:

1. define repository interfaces and immutable domain records;
2. implement a local adapter suitable for the MVP;
3. preserve raw imported files/data provenance;
4. avoid binding domain logic directly to localStorage;
5. leave a future persistent/server adapter seam.

This prevents Commissioning from repeating the legacy global-state coupling.

## 17. UI integration recommendation

Commissioning should be lazy-loaded from `OrbiPVMetricsStandaloneApp.tsx`.

Top-level Commissioning internal navigation:

- Overview
- Scope
- Campaigns
- Tests
- Anomaly Radar
- Findings
- Punch List
- Evidence
- Baseline
- Handover

Do not implement the full UI before Core E2E certification.

## 18. Safety boundary

Shadow Mode is mandatory:

Allowed:

- READ
- IMPORT
- NORMALIZE
- ANALYZE
- CORRELATE
- DOCUMENT
- REVIEW
- REPORT

Forbidden:

- CONTROL
- COMMAND
- ACTUATE
- CHANGE SETPOINT
- OPERATE PROTECTION
- AUTHORIZE ENERGIZATION
- AUTO-ACCEPT

Human authority remains separate from ORBI Assessment.

## 19. Gate result

Repository identified: PASS
Correct frozen baseline identified: PASS
Competition backup parity: PASS
Application shell inspected: PASS
State/persistence inspected: PASS
BESS inspected: PASS
Data source layer inspected: PASS
Signal mapping inspected: PASS
Signal quality inspected: PASS
Reporting inspected: PASS
Climate Recovery architecture verified: PASS
Duplicate risks identified: PASS
Safety boundary confirmed: PASS
Dedicated implementation branch created: PASS

**G00 = FULL PASS**

## 20. Next implementation block

Proceed to IMPL-01 — Commissioning Contracts & Types.

No main UI implementation is authorized until the Core E2E gate is certified.
