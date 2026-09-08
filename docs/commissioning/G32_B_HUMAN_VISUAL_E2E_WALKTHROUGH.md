# G32-B — Human Visual E2E Walkthrough

**Product:** ORBI PVMetrics IA — BESS Commissioning Workspace  
**Repository:** `ingeniusvictor/orbi-pvmetrics-build-week`  
**Branch:** `feature/bess-commissioning-workspace`  
**Latest automated certification head:** `9969a106b234860549932435bc54a0fe720a9e7c`  
**G32-A automated status:** **PASS** — 633/633 tests, TypeScript PASS, production build PASS  
**Processed visual fixture status:** **PASS** — deterministic G19-derived synthetic scenario certified in CI  
**G32-B status:** **PENDING HUMAN EXECUTION**

---

## 1. Purpose

This walkthrough is the final human visual checkpoint for the Commissioning Workspace. It verifies what automated tests cannot fully certify: visual hierarchy, navigation continuity, readable safety boundaries, truthful empty states, populated traceability presentation and the absence of misleading operational controls.

A human PASS does **not** authorize energization, equipment operation, acceptance of a real BESS, OT writeback, or modification of BMS/PCS/EMS/SCADA settings.

---

## 2. Certified synthetic scenarios

Two explicit in-memory validation paths are available and must not be confused:

### A. Base synthetic lab — empty-state validation

Button: **Abrir laboratorio sintético**

Purpose:
- loads synthetic project, approved scope, campaign and asset hierarchy;
- validates project/scope/campaign navigation and truthful downstream empty states;
- intentionally does **not** fabricate processed anomalies, Findings, Punch Items, accepted baselines or Handover decisions.

### B. Processed E2E certification scenario — populated traceability validation

Button: **Abrir escenario E2E procesado**

Purpose:
- reuses the already certified deterministic Core engines;
- populates the full synthetic chain without connecting to real systems;
- does not silently persist the scenario.

Expected processed scenario invariants:

| Item | Expected |
|---|---:|
| Anomalies | 9 |
| Findings | 5 |
| Punch Items | 3 |
| RETEST executions | 4 |
| Accepted RETEST executions | 4 |
| Root cause auto-confirmed | 0 |
| Baseline | AVAILABLE |
| Baseline response metric | 5 s |
| Baseline source execution | `EXEC-LAB-R4` |
| Gate GATE-15 | APPROVED |
| Handover | READY |
| External comparison SolBank | EXCLUDED |

All processed Findings retain `rootCauseState = UNKNOWN` unless a human review explicitly changes that state. Synthetic `PASS`, `ACCEPTED`, `APPROVED` and `READY` values are test records only and carry no real operational authority.

---

## 3. Hard acceptance rules

G32-B may be marked PASS only when all mandatory checkpoints below are visually inspected and no unresolved CRITICAL or MAJOR defect remains.

The reviewer must confirm that:

- Commissioning is reachable from the main PVMetrics navigation.
- The workspace remains visibly read-only / Shadow Mode.
- No control can send commands, change setpoints, operate breakers, dispatch power, reset protections, or write to OT systems.
- ORBI Assessment and Human Acceptance remain visibly separate concepts.
- Missing data is shown as missing / empty / inconclusive instead of being replaced by invented values.
- Root cause is never visually presented as confirmed unless the stored Finding explicitly says `CONFIRMED`.
- Punch closure eligibility is informational; the UI does not close Punch Items on its own.
- Baseline presentation preserves source execution/retest provenance.
- Handover READY is not presented as energization authority.
- Reports keeps Operational/PV+BESS reporting separate from BESS Commissioning reporting.
- No unresolved placeholder view remains in the ten approved Commissioning sections.

---

## 4. Test environment record

Fill before execution:

| Field | Value |
|---|---|
| Reviewer | PENDING |
| Date / time | PENDING |
| Browser | PENDING |
| Viewport | PENDING |
| Tested commit SHA | PENDING |
| Base scenario checked | PENDING |
| Processed E2E scenario checked | PENDING |
| Console errors at start | PENDING |
| Console warnings at start | PENDING |

Recommended primary viewport: desktop 1440×900 or similar. A second mobile-width smoke check is required after the desktop route.

---

## 5. Walkthrough route

### G32-B-01 — Main PVMetrics navigation

**Action**
1. Open ORBI PVMetrics.
2. Confirm normal global navigation loads.
3. Select **Commissioning**.

**Expected**
- Commissioning appears as a deliberate feature-flagged navigation item.
- The workspace opens without leaving the PVMetrics shell.
- No duplicate standalone application shell appears.
- Existing modules such as Dashboard, BESS, SCADA and Reports remain available.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-02 — Commissioning header and authority boundary

**Action**
1. Inspect the Commissioning header before loading synthetic data.

**Expected**
- `Commissioning Workspace` is visible.
- `Shadow Mode` is visible.
- `No OT Writeback` is visible.
- The explanatory copy states that final acceptance remains with authorized humans.
- There is no energize, start, stop, dispatch, setpoint, breaker, protection-reset or OT-write control.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-03 — Empty workspace truthfulness

**Action**
1. With no Commissioning snapshot loaded, inspect the empty state.

**Expected**
- The UI clearly says no commissioning dataset is loaded.
- Two explicit synthetic options are visible: base lab and processed E2E scenario.
- Both are described as local/synthetic and non-operational.
- Empty state is not presented as PASS, ACCEPTED or READY.
- No synthetic option is silently persisted merely by opening it.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-04 — Base synthetic laboratory / empty-state path

**Action**
1. Select **Abrir laboratorio sintético**.
2. Review Overview, Scope and Campaigns.
3. Open Anomaly Radar, Findings, Punch, Evidence, Baseline and Handover at least once.

**Expected**
- The workspace loads a synthetic project without page failure.
- Project/scope/campaign/asset hierarchy is visible where applicable.
- `SB-LAB-004-EXTERNAL` remains visibly outside acceptance scope.
- Downstream registers without processed records show truthful empty states.
- Empty downstream records are not interpreted as acceptance.
- No real-data or real-plant claim is introduced.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-05 — Load processed E2E certification scenario

**Action**
1. Return to a fresh/empty Commissioning workspace state as needed.
2. Select **Abrir escenario E2E procesado**.

**Expected**
- Processed scenario opens without runtime failure.
- The UI remains visibly synthetic / Shadow Mode / No OT Writeback.
- Data is populated through the deterministic Core scenario, not through live systems.
- Expected high-level counts are available for subsequent checkpoints: 9 anomalies, 5 Findings, 3 Punch Items, 4 RETEST executions, one AVAILABLE baseline and one READY Handover package.
- Synthetic state is not silently persisted solely by opening the scenario.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-06 — Overview

**Action**
1. Open **Overview** with the processed E2E scenario.

**Expected**
- Summary cards are readable and internally consistent with the loaded snapshot.
- Risk / status / next-action hierarchy is understandable.
- Closed Findings/Punch counts are not misrepresented as real-world acceptance authority.
- No operational control is present.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-07 — Scope

**Action**
1. Open **Scope**.

**Expected**
- Scope revision/status is visible.
- Asset inclusion status is explicit.
- `INCLUDED`, `PARTIAL`, `EXCLUDED`, `THIRD_PARTY` or pending status is not visually conflated.
- External comparison asset `SB-LAB-004-EXTERNAL` remains EXCLUDED and outside Power Block acceptance scope.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-08 — Campaigns

**Action**
1. Open **Campaigns**.

**Expected**
- Campaign identity, type and lifecycle status are readable.
- Planned/actual information is not fabricated when absent.
- Campaign completion is not equivalent to human acceptance.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-09 — Tests / ORBI vs human authority

**Action**
1. Open **Tests**.
2. Inspect the INITIAL execution and the RETEST executions.

**Expected**
- ORBI Assessment and Human Acceptance appear independently.
- Data Quality is visible separately from PASS/FAIL logic.
- Four RETEST executions are identifiable.
- Accepted RETEST records show ORBI PASS and Human ACCEPTED as separate fields.
- Retest provenance / parent execution linkage is visible or traceable.
- No UI control converts ORBI PASS into human acceptance.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-10 — Anomaly Radar

**Action**
1. Open **Anomaly Radar** with the processed scenario.

**Expected**
- Exactly 9 deterministic anomaly records are represented by the loaded scenario.
- Severity/impact/status and evidence linkage are understandable.
- The external comparison anomaly does not silently move the excluded SolBank into acceptance scope.
- An anomaly is not visually declared a confirmed root cause.
- No automatic operational action is offered.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-11 — Findings

**Action**
1. Open **Findings**.

**Expected**
- Exactly 5 synthetic Findings are represented by the loaded scenario.
- Finding severity/status are visually distinct.
- Root-cause state is displayed independently.
- All five processed certification Findings remain `ROOT CAUSE · UNKNOWN` unless a human explicitly changed a record after fixture load.
- Human review metadata may be present, but review does not imply confirmed root cause.
- No UI action automatically confirms root cause.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-12 — Punch List / Retest

**Action**
1. Open **Punch List**.

**Expected**
- Exactly 3 synthetic Punch Items are represented.
- Punch status, closure evidence and retest requirement are visible.
- Across the 3 Punch Items, 4 accepted RETEST execution links exist.
- Closure eligibility reflects the canonical rule: linked RETEST + ORBI PASS + Human ACCEPTED/ACCEPTED_WITH_COMMENTS + closure evidence.
- Closure eligibility is informational; UI does not perform an uncontrolled close action.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-13 — Evidence

**Action**
1. Open **Evidence**.

**Expected**
- Synthetic evidence type/source/asset/execution relationships are readable.
- The telemetry evidence shows a recorded SHA-256 value where present.
- A recorded SHA-256 is **not** presented as independently cryptographically verified by the UI.
- Evidence links do not imply human acceptance.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-14 — Baseline / retest precedence

**Action**
1. Open **Baseline**.

**Expected**
- Baseline status is AVAILABLE.
- Revision, accepted-by/at and asset are visible.
- `pcs.response_time_s` is 5 s.
- Metric source execution is `EXEC-LAB-R4`.
- R4 is visibly/traceably a RETEST, demonstrating accepted-retest precedence.
- Baseline is explicitly not presented as authorization to energize or operate equipment.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-15 — Handover

**Action**
1. Open **Handover**.

**Expected**
- Synthetic Handover status is READY.
- Open Finding count is zero for this processed resolved scenario.
- Open Punch count is zero for this processed resolved scenario.
- Baseline and human acceptance dependencies are visible/traceable.
- Stored document references are not silently presented as proof of every unknown contractual requirement outside the synthetic scenario.
- `READY` is explicitly not equivalent to energization authority or final real-project acceptance.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-16 — Global Reports integration and processed preview

**Action**
1. Return to global PVMetrics navigation.
2. Open **Reportes**.
3. Confirm both reporting domains exist.
4. Open **BESS Commissioning Report**.
5. If no persisted Commissioning dataset exists, select **Open processed E2E preview**.
6. Generate the report.

**Expected**
- Existing PV+BESS reporting remains available and unchanged.
- A separate BESS Commissioning Report domain is available.
- The processed preview is explicit and in-memory; it does not silently persist state.
- Generated Commissioning report reflects the processed scenario, including traceability counts for 9 anomalies, 5 Findings, 3 Punch Items and 4 human acceptance decisions/retests as represented by the report contract.
- Handover is READY and baseline is present.
- Shadow Mode / read-only limitations remain visible.
- Report generation does not execute tests, alter acceptance, close Punch Items or write to OT systems.

**Important architecture note:** The Commissioning Workspace and Reports panel intentionally instantiate independent read models. Synthetic previews are explicit in-memory fixtures in each view. Moving between views does not silently persist or transfer synthetic state. This is intentional and must not be reported as a persistence defect during G32-B.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-17 — TXT / JSON export and navigation regression

**Action**
1. Exercise TXT export.
2. Exercise JSON export.
3. Navigate back to Dashboard.
4. Open BESS, SCADA and Reports once.
5. Return to Commissioning.

**Expected**
- Downloads are generated locally.
- Export does not mutate Commissioning state.
- No navigation lock-up occurs.
- Existing product modules still render.
- Returning to Commissioning follows its documented persistence semantics; in-memory synthetic preview should not be mistaken for persisted project data.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-18 — Mobile-width smoke check

**Action**
1. Resize to approximately 390 px width or use browser responsive mode.
2. Open Commissioning and traverse at least Overview, Tests, Findings, Punch, Baseline, Handover and Reports.

**Expected**
- Main navigation remains usable.
- Horizontal Commissioning section navigation remains accessible.
- No critical text/control is permanently clipped.
- Safety/authority wording remains reachable.
- No destructive control becomes accidentally exposed by responsive layout.

**Result:** PENDING  
**Evidence / note:** PENDING

---

## 6. Console / runtime check

After the complete route, record:

| Check | Result |
|---|---|
| Uncaught runtime errors | PENDING |
| React render errors | PENDING |
| Failed dynamic imports | PENDING |
| Unexpected network calls caused by Commissioning | PENDING |
| Unexpected OT/command request | PENDING |
| Unexpected state mutation after report export | PENDING |

Known non-blocking automated observations to track separately:
- dependency audit currently reports advisories that require a dedicated dependency review;
- production build emits a large-chunk size warning;
- GitHub Actions emits Node runtime deprecation notices for current action versions.

These items must not be hidden, but they are not by themselves evidence of a G32-B visual failure.

---

## 7. Evidence minimum

For final human certification, retain at minimum:

1. Screenshot of Commissioning header showing Shadow Mode / No OT Writeback.
2. Screenshot of the two explicit synthetic scenario choices.
3. Screenshot of Scope showing the excluded comparison SolBank.
4. Screenshot of Tests showing separation between ORBI Assessment and Human Acceptance and at least one RETEST.
5. Screenshot of Anomaly Radar with populated processed scenario.
6. Screenshot of Findings showing `ROOT CAUSE · UNKNOWN`.
7. Screenshot of Punch/Retest linkage and closure eligibility.
8. Screenshot of Baseline showing 5 s from `EXEC-LAB-R4`.
9. Screenshot of Handover showing READY plus authority limitation.
10. Screenshot of global Reports with both report domains.
11. Screenshot of BESS Commissioning Report generated from **Open processed E2E preview**.
12. Screenshot or note of mobile-width smoke check.

The retained evidence should make the synthetic chain visually reconstructable:

`Anomaly → Finding → Punch → RETEST → Human Acceptance → Baseline → Handover → Report`

---

## 8. Defect severity for G32-B

- **CRITICAL:** OT write/control capability, false acceptance authority, fabricated PASS outside the explicit synthetic fixture, hidden blocker, wrong scope inclusion, silent root-cause confirmation, data/evidence fabrication, synthetic data presented as real project data.
- **MAJOR:** broken navigation, inaccessible required section, wrong traceability, report state mutation, unusable responsive flow, processed E2E counts/provenance inconsistent with the certified fixture.
- **MINOR:** visual alignment, copy inconsistency or non-blocking presentation defect that does not alter meaning/safety.

G32-B cannot PASS with any unresolved CRITICAL or MAJOR defect.

---

## 9. Final certification record

**G32-A Automated Release Gate:** PASS — 633/633, TypeScript PASS, production build PASS at `9969a106b234860549932435bc54a0fe720a9e7c`  
**Processed visual fixture automated certification:** PASS  
**G32-B Human Visual E2E:** PENDING HUMAN EXECUTION  
**Overall G32:** PENDING

Reviewer: `PENDING`  
Date: `PENDING`  
Tested commit: `PENDING`  
Final result: `PENDING`  
Open defects: `PENDING`  
Evidence references: `PENDING`

### Final reviewer statement

> I confirm that I visually executed the documented Commissioning route using both the base empty-state lab and the processed E2E certification scenario, reviewed the safety and authority boundaries, and found no unresolved critical or major defect that would make the interface misleading or operationally unsafe.

Signature / reviewer identification: `PENDING`
