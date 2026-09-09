# G34 — Release Candidate Integration & Pilot Readiness

Status: IN PROGRESS
Branch: `feature/bess-commissioning-workspace`
Baseline entering G34: `9c9ac24d904a673a7b1e1864870bef679bd08b11` (G33 PASS / Commissioning MVP Release Candidate)
Certified G34 foundation commit: `8d05f75b9bfb4b0168e9cc105f6b2c86e59cbff4`
Certified G34-D implementation commit: `9f296533a63f3b46206de068fb07b90765844f73`

## Purpose

Move ORBI PVMetrics BESS Commissioning from a certified synthetic MVP toward a controlled real-project pilot without adding production deployment, direct OT connectivity, control authority, energization authority or writeback to BMS/PCS/EMS/SCADA.

G34 is an integration-readiness stage, not an operational commissioning approval stage.

## Pilot boundary

The first pilot path is strictly **offline / file-based / read-only**.

Allowed in G34:

- manually supplied project metadata;
- approved scope and asset registers;
- test matrix and acceptance-criteria source references;
- signal dictionaries and explicit signal mappings;
- exported telemetry files;
- exported event/alarm files;
- evidence indexes and hashes;
- human authority / witness / reviewer registers;
- deterministic ORBI analysis against those supplied records;
- local reports and traceability review.

Not allowed in G34:

- live BMS, PCS, EMS or SCADA sessions;
- Modbus/IEC-104/OPC-UA/MQTT or vendor API runtime connections to the plant;
- remote commands, setpoints, start/stop, charge/discharge dispatch or protection changes;
- energization approval;
- automatic human acceptance;
- auto-confirmed root cause;
- production deployment;
- silent interpretation of unknown signal units, names or acceptance thresholds.

## G34 pilot intake contract

A package may be declared `READY_FOR_OFFLINE_INGEST` only when the following required artifact classes are supplied and traceable:

1. `PROJECT_IDENTITY`
2. `SCOPE_REGISTER`
3. `ASSET_REGISTER`
4. `TEST_MATRIX`
5. `CRITERIA_SOURCES`
6. `SIGNAL_MAPPING`
7. `TELEMETRY_EXPORT`
8. `EVIDENCE_PACKAGE_INDEX`
9. `AUTHORITY_REGISTER`

Optional but recommended:

- `SIGNAL_DICTIONARY`
- `EVENT_EXPORT`

Machine-data packages such as telemetry/event exports and the evidence package index require a recorded SHA-256 before offline ingest. A recorded hash proves only that a reference was captured; independent verification remains a separate action.

## Readiness semantics

The only positive G34 intake status is:

`READY_FOR_OFFLINE_INGEST`

It means only that the package has enough declared inputs to enter an offline pilot dry run.

It explicitly does **not** mean:

- ready to energize;
- ready to operate;
- ready for dispatch;
- project accepted;
- test accepted;
- BESS accepted;
- handover approved;
- OT connection approved.

If required artifacts are missing or pending validation, or if a live connector/writeback/operational-authority claim is introduced, the result is `BLOCKED`.

## Implementation sequence

### G34-A — Release Candidate baseline freeze

Target: preserve the G33 PASS baseline and verify CI before pilot-readiness work.

Certification: **PASS**. G33 commit `9c9ac24...` completed Commissioning CI successfully, including Test, TypeScript lint and Production build.

### G34-B — Pilot Intake Contract

Target: define the artifact classes, required/optional inputs, traceability expectations and safety boundary.

Implementation: `src/pvmetrics-standalone/commissioning/pilot/pilotReadiness.ts`.

Certification: **PASS** on `8d05f75...`.

### G34-C — Offline Pilot Readiness Validator

Target: deterministic admission check returning only `BLOCKED` or `READY_FOR_OFFLINE_INGEST`.

Mandatory rules:

- project identity and scope revision must be declared;
- every required artifact class must be provided;
- provided artifacts need traceable references;
- telemetry/event/evidence-index machine files require recorded SHA-256;
- any configured real-time connector blocks G34 admission;
- any writeback capability blocks G34 admission;
- any claim that pilot readiness equals operational/energization authority blocks admission;
- optional missing event/signal-dictionary files create warnings, not fabricated data.

Certification: **PASS** on `8d05f75...`. Focused tests were added to the repository test suite. Commissioning CI run 108 completed Test, TypeScript lint and Production build successfully.

### G34-D — Controlled Manual Intake UI

Certification: **PASS**.

Implementation commit: `9f296533a63f3b46206de068fb07b90765844f73`.

CI evidence: Commissioning CI run 110 completed successfully with Test, TypeScript lint and Production build all PASS.

Human visual smoke evidence confirms the final desktop surface renders correctly inside the native Commissioning workspace:

- `Pilot Intake` is visible as a Commissioning section;
- the workspace header retains `SHADOW MODE` and `NO OT WRITEBACK`;
- the Pilot Intake header explicitly states offline preparation;
- `OFFLINE ONLY · NO OT WRITEBACK · NO ENERGIZATION AUTHORITY` is visible;
- the privacy/traceability notice states that selected files stay in browser memory and are not uploaded or stored in localStorage;
- Project ID and Scope Revision fields render correctly;
- required artifact rows and local file selectors render without overlap or clipping;
- no live connector, OT writeback, energization or operational command control is exposed.

The selected files remain in browser memory for the current interaction. This G34-D surface does not upload files, does not discover network sources, does not write them to localStorage and does not persist an ingest package. It is a preflight/admission UI only; actual controlled ingest remains a later gated action.

### G34-E — Project Mapping Profile

Status: **FRAMEWORK READY — PENDING VERIFIED REAL PILOT INPUTS**.

A formal source-data request/checklist is prepared at:

`docs/commissioning/G34_E_PROJECT_MAPPING_DATA_REQUEST.md`

The generic source-verified mapping framework is implemented in:

`src/pvmetrics-standalone/commissioning/pilot/projectMappingProfile.ts`

It distinguishes `UNVERIFIED` from `SOURCE_CONFIRMED`, blocks confirmed mappings backed by unverified sources, and prevents silent completion of missing asset IDs, tag mappings or unit metadata.

The first real mapping profile must be built only from verified as-built/project sources. It must not infer missing topology, device hierarchy, tag names, units, scaling, sign convention, firmware, thresholds or OEM criteria.

Recommended strategy: begin with one narrow, well-documented commissioning test slice with authoritative procedure + criteria + telemetry + evidence + human witness/reviewer information, rather than attempting the full BESS project in the first real-data dry run.

Until the real source package is supplied and validated, no project-specific mapping claims are certified.

### G34-F — Offline Real-Data Dry Run

Status: **FRAMEWORK PATH READY — PENDING REAL DATA**.

The certified Commissioning pipeline is already capable of preserving the traceability chain:

`Scope → Test → Data → Evidence → Result → Finding → Punch → Retest → Acceptance`

A real-data dry run remains blocked until the real source package and project mapping pass validation. No synthetic fixture may be relabeled as real pilot evidence.

### G34-G — Pilot Readiness Pack

Status: **FRAMEWORK READY — REAL PACK PENDING REAL PILOT DATA**.

The generic Pilot Readiness Pack framework is prepared so that the future real pilot can only resolve to a real readiness state after verified source data is explicitly present. Until then it remains source-pending and retains explicit `NO` values for operational authorization, energization authorization and OT writeback.

Reference:

`docs/commissioning/G34_G_PILOT_READINESS_PACK_FRAMEWORK.md`

### Cross-cutting G34 asset — Generic Data Exchange Templates

Status: **IMPLEMENTED**.

A project-agnostic CSV exchange contract and header validator are now prepared so that incoming project information can be normalized without inventing values. Templates are header-only and intentionally contain no synthetic project records.

Code:

`src/pvmetrics-standalone/commissioning/pilot/dataExchangeTemplates.ts`

Templates:

`docs/commissioning/templates/`

The template set covers Project Identity, Scope Register, Asset Register, Test Matrix, Criteria Sources, Signal Dictionary, Signal Mapping, normalized Telemetry, Event Export, Evidence Index and Authority Register. Additional vendor/source columns may be retained for review but are never interpreted silently. Missing mandatory columns or duplicate headers block deterministic header admission.

## Safety invariants inherited from G32/G33

- ORBI assessment remains separate from human acceptance.
- No PASS without evidence.
- Mandatory missing criteria remain inconclusive.
- Root cause is never auto-confirmed.
- Retest precedence remains preserved.
- Baseline can only derive from accepted eligible executions.
- `READY` never equals energization authority.
- EXCLUDED / THIRD_PARTY scope items are never silently promoted into acceptance scope.
- Traceability may retain observations from excluded assets without changing acceptance scope.

## Current G34 gates

- G34-A — RC baseline + prior CI: PASS.
- G34-B — Pilot Intake Contract: PASS.
- G34-C — Offline Pilot Readiness Validator + focused tests: PASS.
- G34-D — Controlled Manual Intake UI + CI + human visual smoke: PASS.
- G34-E — Project Mapping Profile: FRAMEWORK READY / PENDING VERIFIED REAL PILOT INPUTS.
- G34-F — Offline Real-Data Dry Run: FRAMEWORK PATH READY / PENDING REAL DATA.
- G34-G — Pilot Readiness Pack: FRAMEWORK READY / REAL PACK PENDING REAL DATA.
- Generic CSV Data Exchange Templates: IMPLEMENTED / pending current CI certification.

No G34 result is operational authorization for a real BESS plant.
