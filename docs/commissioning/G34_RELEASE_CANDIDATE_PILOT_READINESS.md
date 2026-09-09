# G34 — Release Candidate Integration & Pilot Readiness

Status: IN PROGRESS
Branch: `feature/bess-commissioning-workspace`
Baseline entering G34: `9c9ac24d904a673a7b1e1864870bef679bd08b11` (G33 PASS / Commissioning MVP Release Candidate)

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

Current evidence: G33 commit `9c9ac24...` completed Commissioning CI successfully, including Test, TypeScript lint and Production build.

### G34-B — Pilot Intake Contract

Target: define the artifact classes, required/optional inputs, traceability expectations and safety boundary.

Implementation: `src/pvmetrics-standalone/commissioning/pilot/pilotReadiness.ts`.

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

### G34-D — Controlled Manual Intake UI

Planned after G34-C certification. The user should be able to select local exported files and review admission results before anything is persisted. No automatic network discovery.

### G34-E — Project Mapping Profile

Planned after a real pilot package is available. Build a project-specific mapping profile from verified as-built information. Do not infer missing topology, tag names, thresholds or OEM criteria.

### G34-F — Offline Real-Data Dry Run

Planned after mapping validation. Process sanitized/exported real project records through Scope → Test → Data → Evidence → Result → Finding → Punch → Retest → Acceptance traceability while preserving human authority.

### G34-G — Pilot Readiness Pack

Planned final gate. Produce a client-facing readiness summary, known limitations, mapping coverage, data-quality statement, unresolved criteria and explicit no-OT-writeback boundary.

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

## Initial G34 gates

- G34-A — RC baseline + prior CI: PASS.
- G34-B — Pilot Intake Contract: IMPLEMENTED, pending current CI.
- G34-C — Offline Pilot Readiness Validator + focused tests: IMPLEMENTED, pending current CI.
- G34-D — Controlled Manual Intake UI: PENDING.
- G34-E — Project Mapping Profile: PENDING REAL PILOT INPUTS.
- G34-F — Offline Real-Data Dry Run: PENDING.
- G34-G — Pilot Readiness Pack: PENDING.

No G34 result is operational authorization for a real BESS plant.
