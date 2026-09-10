# G34-H — Offline Telemetry Content Validation

Status: PASS — IMPLEMENTED, CI CERTIFIED AND HUMAN NEGATIVE-SMOKE CERTIFIED
Branch: `feature/bess-commissioning-workspace`
Certified implementation head: `5e375f6ded27dc685525f147f230b829bdd1ec7f`
CI evidence: Commissioning CI run 131 — Test PASS, TypeScript lint PASS, Production build PASS.
Human smoke evidence: 2026-09-09 — the downloaded header-only `telemetry_normalized.csv` was re-selected in Pilot Intake and correctly resolved to `PENDING VALIDATION`, with `CSV header admission PASS`, `TELEMETRY CONTENT BLOCKED`, and `EMPTY_DATASET` surfaced to the user.

## Purpose

Harden Pilot Intake so that a normalized telemetry CSV cannot be treated as `PROVIDED` merely because its header is structurally correct.

This gate remains fully offline, browser-local and read-only. It does not connect to SCADA/BMS/PCS/EMS and it does not alter source files.

## Deterministic telemetry checks

For `TELEMETRY_EXPORT`, after header admission the local preflight validates row content for:

- valid timestamp;
- non-empty `assetId`;
- non-empty `signalKey`;
- finite numeric `value`;
- non-empty `unit`;
- non-empty `sourceSystem`;
- quality limited to `GOOD`, `SUSPECT`, `MISSING`, `INVALID`;
- exact duplicate rows;
- conflicting samples for the same timestamp + asset + signal + source system;
- unit changes within the same asset/signal/source series;
- row-width mismatch;
- malformed quoted CSV content.

Out-of-order timestamps are reported as a warning and are never auto-sorted.

## Empty-template rule

The generic downloadable `telemetry_normalized.csv` remains intentionally header-only. It is a schema template, not pilot evidence.

Therefore:

- it may pass CSV header admission;
- it must fail telemetry content admission until at least one valid data row exists;
- it must remain `PENDING_VALIDATION`, not `PROVIDED`, when selected without data rows.

This prevents a blank template from satisfying Pilot Readiness.

## File-size boundary

The browser preflight performs full telemetry content validation only for CSV files up to 10 MB.

A larger file is not partially sampled and then declared valid. It remains `PENDING_VALIDATION` for a later controlled offline ingest/parser path.

## No silent correction

The validator never:

- fills empty asset IDs;
- replaces or converts units;
- coerces invalid quality values;
- repairs timestamps;
- drops duplicate rows;
- chooses between conflicting samples;
- sorts source records automatically.

Detected issues block telemetry content admission and are surfaced for human/source review.

## Safety semantics

`Telemetry content admission PASS` means only that the supplied normalized CSV passed deterministic content-preflight checks.

It does **not** mean:

- source authority verified;
- contractual acceptance criteria verified;
- test PASS;
- human acceptance;
- project handover;
- energization authorization;
- operational authorization;
- OT writeback authorization.

## Implementation

- `src/pvmetrics-standalone/commissioning/pilot/telemetryContentValidation.ts`
- `src/pvmetrics-standalone/commissioning/pilot/telemetryContentValidation.test.ts`
- `src/pvmetrics-standalone/commissioning/components/CommissioningPilotIntakeView.tsx`

## Certified behavior

A valid telemetry CSV becomes `PROVIDED` and records a content-admission PASS note.

A telemetry CSV with deterministic content defects becomes `PENDING_VALIDATION` and reports issue codes/rows without altering the source file.

Focused tests cover valid content, header-only content, invalid timestamp, empty asset, non-numeric value, missing unit, invalid quality, exact duplicates, conflicting samples, unit inconsistency, out-of-order timestamps and quoted CSV fields.
