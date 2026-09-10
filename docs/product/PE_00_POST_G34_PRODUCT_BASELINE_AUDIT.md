# PE-00 — Post-G34 Product Baseline Audit

Status: **ARCHITECTURE / PRODUCT DECISION AUDIT — NO FEATURE IMPLEMENTATION**

Branch: `feature/pvmetrics-product-evolution`

Audited baseline: `bf07457d906f08a8ba273960ab34c9b7fd9a8060`

## Scope and product shell

This is a source-level inventory, not feature work. “Active” means reachable in the
current shell; it does not mean ready for a real plant.

`src/pvmetrics-standalone/app/OrbiPVMetricsStandaloneApp.tsx` is the single
client-side shell. It owns current-view state through a switch rather than URL
routing. `app/StateContext.tsx` owns the legacy shared model: synthetic
company/plant selection, noise, mock SCADA registers, demo configuration,
report history and browser `localStorage`.

Three bounded domains are lazy loaded and do not consume that legacy state
model:

| Domain | Entry / integration | Classification |
|---|---|---|
| Incident Intelligence Copilot | Lazy `src/build-week/incident-copilot/IncidentCopilotView.tsx`; own synthetic scenarios and advisory boundary | COMPETITION_BOUND; LEGACY; HIDDEN |
| Climate Recovery | Lazy `components/climate-recovery/ClimateRecoveryView.tsx`; own contracts, service and synthetic portfolio | COMPETITION_BOUND; FROZEN_CERTIFIED; HIDDEN |
| BESS Commissioning | Lazy `commissioning/components/CommissioningWorkspaceView.tsx`; own contracts, engines, persistence and localization | FROZEN_CERTIFIED; ACTIVE_PRODUCT surface; REQUIRES_REAL_DATA |

There is no product-level normalized asset/signal/evidence contract across the
legacy product and these bounded domains.

## Current module inventory

| Block | UI / main implementation | Integration | Classification |
|---|---|---|---|
| Dashboard | `DashboardView` | `StateContext` active company/plant | ACTIVE_PRODUCT |
| Portfolio / plants | Shell selectors; `StateContext`; plant-profile manager | Shared demo plant model and browser storage | ACTIVE_PRODUCT; REQUIRES_REAL_DATA |
| Live PV monitoring | `PVMetricsLiveMonitoringDashboard` | Local/synthetic presentation; no live source authority | ACTIVE_PRODUCT; REQUIRES_REAL_DATA |
| Daily / weekly / monthly forecast | `ForecastViews` | `generateDailyForecast`, active plant, noise simulation | ACTIVE_PRODUCT; EXPERIMENTAL for real operations |
| BESS advisor | `BessView` | Active plant and simulation values | ACTIVE_PRODUCT; EXPERIMENTAL; REQUIRES_REAL_DATA |
| Energy sales | `EnergySalesView` | Active plant and simulation state | EXPERIMENTAL; REQUIRES_REAL_DATA |
| SCADA presentation | `ScadaView` | Mock SCADA registers in `StateContext` | LEGACY; EXPERIMENTAL; REQUIRES_REAL_DATA |
| Plant profiles | `PVMetricsPlantProfileManagerView` | Visible local profile surface | ACTIVE_PRODUCT; REQUIRES_REAL_DATA |
| Data sources | `PVMetricsDataSourceManagerView` | Visible information-management surface | ACTIVE_PRODUCT; REQUIRES_REAL_DATA |
| Signal mapping | `PVMetricsSignalMappingView` | Also embeds Signal Quality | ACTIVE_PRODUCT; DUPLICATED presentation path; REQUIRES_REAL_DATA |
| Signal quality | `PVMetricsSignalQualityRulesView` | Direct nav and nested mapping view path | ACTIVE_PRODUCT; DUPLICATED presentation path; REQUIRES_REAL_DATA |
| Unified Reports | `UnifiedReportsView` | Tabs between `ReportsView` and Commissioning Reports | ACTIVE_PRODUCT; MIXED_BOUNDARY |
| Operational reports / demo tools | `ReportsView` | Legacy state, simulation, local download/print and demo QA copy | LEGACY; ACTIVE_PRODUCT via Unified Reports |
| Configuration | `ConfigView` | Mutates local demo plant state | ACTIVE_PRODUCT; LEGACY persistence model |
| Incident Copilot | `src/build-week/incident-copilot/` | Visibility marks it `LEGACY`; normal nav hides it | COMPETITION_BOUND; LEGACY; HIDDEN |
| Climate Recovery | `src/pvmetrics-standalone/climate-recovery/` | Visibility `INTERNAL`; `SHOW_INTERNAL_PRODUCT_SURFACES = false` | COMPETITION_BOUND; FROZEN_CERTIFIED; HIDDEN |
| BESS Commissioning | `src/pvmetrics-standalone/commissioning/` | Visible workspace plus narrower feature flags | FROZEN_CERTIFIED; FEATURE_FLAG sub-surfaces; REQUIRES_REAL_DATA |

## Visibility, loading and historical boundaries

`PRODUCT_FEATURE_VISIBILITY` exposes Commissioning, marks Climate Recovery
`INTERNAL`, and marks Incident Copilot `LEGACY`. With internal surfaces
disabled, Climate Recovery and Copilot are hidden from normal navigation.

Commissioning flags keep its workspace and synthetic base lab available while
the processed certification scenario is internal/disabled and certification
badges hidden. Unified Reports is deliberately one navigation surface but
retains separate operational and Commissioning read models.

### OpenAI Build Week

Incident Intelligence Copilot remains under `src/build-week/incident-copilot/`.
Its fixed synthetic scenarios, deterministic assessment, advisory safety
boundary and optional local server mode remain historically bounded. Pre-Build
Week components must not be recast as Build Week work.

### Climate Recovery

Climate Recovery remains a competition-bound synthetic portfolio with its own
contracts, validation, presentation modes and historical artifacts in
`docs/competition/`. This audit neither rewrites nor reopens that record.

### BESS Commissioning

Commissioning remains **FROZEN_CERTIFIED**:

`PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING`

No generic Commissioning feature is authorized. It can reopen only for verified
real pilot data or another concrete external functional reason; offline,
read-only and no-OT invariants remain in force.

## Architectural debt and risks

1. **Monolithic legacy state:** `StateContext` mixes workspace selection,
   simulation, mock SCADA, reports, checklist and presentation-lockdown state
   with direct browser persistence.
2. **No normalized data seam:** plants, source metadata, telemetry, signals,
   quality and evidence do not have a governed shared contract.
3. **Mixed report boundary:** Unified Reports is a useful UI container, but
   legacy operational demo/report tooling and a governed Commissioning panel
   remain different domains.
4. **Duplicated quality route:** Signal Quality is both directly navigable and
   embedded inside Signal Mapping.
5. **Legacy demo language:** operational reports contain mock-connection and QA
   copy unsuitable as real operational evidence.
6. **Bundle size:** the certified build warns that the main bundle is above
   500 kB gzipped; only the three bounded domains are lazy loaded.
7. **No route-level composition:** the growing app switch makes deep links,
   entitlement and per-domain ownership harder to introduce.
8. **Dependency provenance:** the root manifest contains AI/server packages
   while the visible shell is client-side. Ownership requires a separate audit;
   this audit changes no dependency.

## Proposed next evolution

### PRIORITY 1 — Governed Operational Data Foundation

Create a synthetic-first product contract for asset identity, source provenance,
signal semantics, quality status and evidence references. Reuse plant profiles,
data sources, mappings and quality concepts without modifying Commissioning.

| Dimension | Assessment |
|---|---|
| Commercial / O&M value | High |
| Differentiation | High: provenance and quality before analytics |
| Reuse | High |
| Synthetic demonstration | High |
| Difficulty / architecture risk | Medium-high: needs an anti-corruption boundary around legacy state |
| Real-data dependency | Not for framework; required for project activation |
| Pilot path | Direct controlled source-onboarding path |

### PRIORITY 2 — Portfolio O&M Insight Workspace

Create a product-facing review workflow combining plant context, forecast, BESS
simulation and quality posture into traceable, non-command operational review.
It must stay independent from both competition domains.

| Dimension | Assessment |
|---|---|
| Commercial / O&M value | High |
| Differentiation | Medium-high: evidence and uncertainty over unsupported automation |
| Reuse / synthetic demonstration | High |
| Difficulty / architecture risk | Medium; should build on PRIORITY 1 |
| Real-data dependency | Synthetic MVP: no; customer claims: yes |
| Pilot path | High after verified source onboarding |

### PRIORITY 3 — Governed Product Report Registry

Evolve Unified Reports into typed operational-simulation, synthetic-demo,
data-quality-review and future-project-evidence reports. Preserve the frozen
Commissioning report boundary; do not flatten authority or evidence semantics.

| Dimension | Assessment |
|---|---|
| Commercial / O&M value | Medium-high |
| Reuse / synthetic demonstration | High |
| Difficulty / architecture risk | Medium; requires report taxonomy and legacy-copy classification |
| Real-data dependency | Framework: no; authentic reports: yes |
| Pilot path | Medium-high after PRIORITY 1 |

## Recommendation for PE-01

Start **PE-01: Governed Operational Data Foundation** as a bounded design and
implementation phase. First deliver a product-owned contract and adapter
boundary—not a live connector, data migration, Commissioning extension, report
rewrite or AI feature. Demonstrate source → mapping → quality → evidence with
clearly labeled synthetic fixtures only.

This gives the later portfolio workspace and report registry a stable seam while
preserving G34 and both competition boundaries.
