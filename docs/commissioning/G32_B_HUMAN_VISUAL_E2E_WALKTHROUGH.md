# G32-B — Human Visual E2E Walkthrough

**Product:** ORBI PVMetrics IA — BESS Commissioning Workspace  
**Repository:** `ingeniusvictor/orbi-pvmetrics-build-week`  
**Branch:** `feature/bess-commissioning-workspace`  
**Automated baseline:** `138a9bd111f3b4b229f0e75970daec8c9f3115e2`  
**G32-A automated status:** **PASS** — 627/627 tests, TypeScript PASS, production build PASS  
**G32-B status:** **PENDING HUMAN EXECUTION**

---

## 1. Purpose

This walkthrough is the final human visual checkpoint for the Commissioning Workspace. It verifies what automated tests cannot fully certify: visual hierarchy, navigation continuity, readable safety boundaries, truthful empty states, traceability presentation and the absence of misleading operational controls.

A human PASS does **not** authorize energization, equipment operation, acceptance of a BESS, OT writeback, or modification of BMS/PCS/EMS/SCADA settings.

---

## 2. Hard acceptance rules

G32-B may be marked PASS only when all mandatory checkpoints below are visually inspected and no critical defect remains.

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

## 3. Test environment record

Fill before execution:

| Field | Value |
|---|---|
| Reviewer | PENDING |
| Date / time | PENDING |
| Browser | PENDING |
| Viewport | PENDING |
| Tested commit SHA | PENDING |
| Dataset | Synthetic Commissioning Lab / other approved synthetic snapshot |
| Console errors at start | PENDING |
| Console warnings at start | PENDING |

Recommended primary viewport: desktop 1440×900 or similar. A second mobile-width smoke check is recommended after the desktop route.

---

## 4. Walkthrough route

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
- The synthetic laboratory action is explicit.
- The text states that the synthetic lab does not connect to real SCADA/BMS/PCS.
- Empty state is not presented as PASS, ACCEPTED or READY.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-04 — Load synthetic laboratory

**Action**
1. Select **Abrir laboratorio sintético**.

**Expected**
- The workspace loads a synthetic project without page failure.
- The project/scope/campaign/asset hierarchy is visible where applicable.
- The excluded external comparison SolBank is not presented as an accepted in-scope asset.
- No real-data or real-plant claim is introduced.

**Important:** The base UI laboratory intentionally seeds scope/assets/campaign context. It does not automatically fabricate processed anomalies, Findings, Punch Items, accepted baselines or handover decisions. Empty downstream registers are therefore valid if no processed snapshot has been loaded.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-05 — Overview

**Action**
1. Open **Overview**.

**Expected**
- Summary cards are readable and internally consistent with the loaded snapshot.
- Zero/empty counts are not interpreted as acceptance.
- Risk / status / next-action hierarchy is understandable.
- No operational control is present.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-06 — Scope

**Action**
1. Open **Scope**.

**Expected**
- Scope revision/status is visible.
- Asset inclusion status is explicit.
- `INCLUDED`, `PARTIAL`, `EXCLUDED`, `THIRD_PARTY` or pending status is not visually conflated.
- External comparison assets remain visibly outside acceptance scope.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-07 — Campaigns

**Action**
1. Open **Campaigns**.

**Expected**
- Campaign identity, type and lifecycle status are readable.
- Planned/actual information is not fabricated when absent.
- Campaign completion is not equivalent to human acceptance.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-08 — Tests

**Action**
1. Open **Tests**.
2. Inspect execution rows/details if present.

**Expected**
- ORBI Assessment and Human Acceptance appear independently.
- Data Quality is visible separately from PASS/FAIL logic.
- Missing mandatory evidence/criteria does not visually become PASS.
- Retest provenance is identifiable when a RETEST execution is present.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-09 — Anomaly Radar

**Action**
1. Open **Anomaly Radar**.

**Expected**
- Empty state is truthful if no processed anomaly records are loaded.
- If anomaly records exist, severity/impact/status and evidence linkage are understandable.
- An anomaly is not visually declared a confirmed root cause.
- No automatic operational action is offered.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-10 — Findings

**Action**
1. Open **Findings**.

**Expected**
- Finding severity/status are visually distinct.
- Root-cause state is displayed independently as `UNKNOWN`, `SUSPECTED` or `CONFIRMED`.
- Empty Findings state explicitly does not imply commissioning acceptance.
- No UI action automatically confirms root cause.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-11 — Punch List / Retest

**Action**
1. Open **Punch List**.

**Expected**
- Punch status and retest requirement are visible.
- Closure eligibility is informational.
- A retest-required Punch cannot appear eligible for closure without linked accepted PASS retest plus closure evidence.
- UI does not contain an uncontrolled one-click close or fake retest action.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-12 — Evidence

**Action**
1. Open **Evidence**.

**Expected**
- Evidence type/source/asset/execution relationships are readable where available.
- `SHA-256 recorded` is not presented as `cryptographically verified` unless verification actually exists.
- Missing evidence remains visibly missing.
- Evidence links do not imply human acceptance.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-13 — Baseline

**Action**
1. Open **Baseline**.

**Expected**
- Empty state is truthful if no accepted baseline exists.
- When a baseline exists, revision, accepted-by/at, asset and metrics are visible.
- Each metric preserves its source execution/calculation reference.
- RETEST source is identifiable where applicable.
- Baseline is explicitly not presented as authorization to energize or operate equipment.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-14 — Handover

**Action**
1. Open **Handover**.

**Expected**
- BLOCKED / READY / APPROVED status is readable.
- Open Findings/Punch blockers are visible when present.
- Baseline and human acceptance dependencies are visible.
- Stored document references are not silently treated as proof that every contractual document requirement is complete.
- `READY` is explicitly not equivalent to energization authority.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-15 — Global Reports integration

**Action**
1. Return to global PVMetrics navigation.
2. Open **Reportes**.

**Expected**
- Existing PV+BESS reporting remains available.
- A separate **BESS Commissioning Report** domain is available.
- Commissioning reporting does not overwrite or masquerade as the legacy operational report composer.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-16 — Commissioning Report generation

**Action**
1. Open **BESS Commissioning Report**.
2. Select/generate a report from the loaded Commissioning snapshot where available.
3. Exercise TXT and JSON export if enabled.

**Expected**
- Report generation remains local and explicit.
- Project/scope identity and counts match the loaded snapshot.
- Shadow Mode / read-only limitations remain visible.
- Report does not execute tests, alter acceptance, close Punch Items or write to OT systems.
- Export does not change Commissioning state.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-17 — Navigation regression smoke

**Action**
1. Navigate back to Dashboard.
2. Open BESS, SCADA and Reports once.
3. Return to Commissioning.

**Expected**
- No navigation lock-up.
- Existing product modules still render.
- Commissioning state behaves consistently with its persistence rules.
- No unexpected cross-module mutation is observed.

**Result:** PENDING  
**Evidence / note:** PENDING

---

### G32-B-18 — Mobile-width smoke check

**Action**
1. Resize to approximately 390 px width or use browser responsive mode.
2. Open Commissioning and traverse at least Overview, Tests, Findings, Punch, Handover and Reports.

**Expected**
- Main navigation remains usable.
- Horizontal section navigation remains accessible.
- No critical text/control is permanently clipped.
- Safety/authority wording remains reachable.
- No destructive control becomes accidentally exposed by responsive layout.

**Result:** PENDING  
**Evidence / note:** PENDING

---

## 5. Console / runtime check

After the complete route, record:

| Check | Result |
|---|---|
| Uncaught runtime errors | PENDING |
| React render errors | PENDING |
| Failed dynamic imports | PENDING |
| Unexpected network calls caused by Commissioning | PENDING |
| Unexpected OT/command request | PENDING |
| Unexpected state mutation after report export | PENDING |

Non-blocking build-size warnings or dependency audit advisories must be tracked separately and must not be hidden, but they are not by themselves evidence of a visual E2E failure.

---

## 6. Evidence minimum

For final human certification, retain at minimum:

1. Screenshot of Commissioning header showing Shadow Mode / No OT Writeback.
2. Screenshot of Scope or asset hierarchy.
3. Screenshot of Tests showing separation between ORBI Assessment and Human Acceptance, if populated data is available.
4. Screenshot of Findings or its truthful empty state.
5. Screenshot of Punch/Retest or its truthful empty state.
6. Screenshot of Baseline/Handover or their truthful empty states.
7. Screenshot of global Reports with both report domains.
8. Screenshot of BESS Commissioning Report panel.

If a populated processed snapshot is used, also retain evidence showing anomaly → finding → punch → retest → baseline/handover traceability.

---

## 7. Defect severity for G32-B

- **CRITICAL:** OT write/control capability, false acceptance authority, fabricated PASS, hidden blocker, wrong scope inclusion, silent root-cause confirmation, data/evidence fabrication.
- **MAJOR:** broken navigation, inaccessible required section, wrong traceability, report state mutation, unusable responsive flow.
- **MINOR:** visual alignment, copy inconsistency or non-blocking presentation defect that does not alter meaning/safety.

G32-B cannot PASS with any unresolved CRITICAL or MAJOR defect.

---

## 8. Final certification record

**G32-A Automated Release Gate:** PASS  
**G32-B Human Visual E2E:** PENDING HUMAN EXECUTION  
**Overall G32:** PENDING

Reviewer: `PENDING`  
Date: `PENDING`  
Tested commit: `PENDING`  
Final result: `PENDING`  
Open defects: `PENDING`  
Evidence references: `PENDING`

### Final reviewer statement

> I confirm that I visually executed the documented Commissioning route, reviewed the safety and authority boundaries, and found no unresolved critical or major defect that would make the interface misleading or operationally unsafe.

Signature / reviewer identification: `PENDING`
