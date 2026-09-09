# G34-G — Pilot Readiness Pack Framework

Status: FRAMEWORK IMPLEMENTED — REAL PILOT DATA PENDING

## Purpose

Define the deterministic structure of the future ORBI PVMetrics BESS Commissioning Pilot Readiness Pack before real project data is available.

This framework must not fabricate project-specific readiness. It is allowed to summarize verified pilot intake, mapping coverage, blockers, warnings, limitations and dry-run state. It is not an energization, operation, dispatch or contractual acceptance document.

## Status model

The pack exposes only three top-level statuses:

- `PENDING_SOURCE_DATA` — no verified real-project package is available;
- `BLOCKED` — real inputs exist but intake, mapping or cross-profile consistency still contains blockers;
- `READY_FOR_OFFLINE_DRY_RUN` — verified real inputs are sufficient to begin an offline dry run only.

`READY_FOR_OFFLINE_DRY_RUN` never means:

- ready to energize;
- ready to operate;
- ready to dispatch;
- BESS accepted;
- commissioning accepted;
- handover accepted;
- OT connection approved.

## Deterministic inputs

The framework consumes:

1. G34 Pilot Intake assessment;
2. Project Mapping Profile assessment;
3. explicit source-reality declaration (`NO_REAL_PACKAGE` or `REAL_SOURCE_PACKAGE`);
4. offline dry-run state;
5. known limitations.

No generative model is involved in readiness status selection.

## Hard integration gates

A real package cannot become `READY_FOR_OFFLINE_DRY_RUN` when any of these conditions applies:

- Pilot Intake is `BLOCKED`;
- Project Mapping Profile is `BLOCKED`;
- Project ID differs between intake and mapping profile;
- Scope revision differs between intake and mapping profile;
- source reality is `NO_REAL_PACKAGE`.

## Pack coverage

The generated pack records:

- Project ID and Scope Revision;
- required artifact coverage;
- intake blockers and warnings;
- mapping source coverage;
- confirmed asset mappings;
- confirmed signal mappings;
- mapping blockers and warnings;
- cross-profile integration blockers;
- dry-run state;
- known limitations;
- explicit safety boundary.

## Safety boundary

Every generated pack records:

- offline only = true;
- live OT connection allowed = false;
- OT writeback allowed = false;
- energization authorized = false;
- operational authorization granted = false;
- human acceptance required = true.

## Current project state

There is currently no verified real-project package available for the intended first pilot. Therefore the only truthful project-specific readiness state today is `PENDING_SOURCE_DATA`.

The framework may be developed and tested with synthetic/unit-test fixtures, but those fixtures must never be represented as real pilot evidence.

## Implementation

- `src/pvmetrics-standalone/commissioning/pilot/pilotReadinessPack.ts`
- `src/pvmetrics-standalone/commissioning/pilot/pilotReadinessPack.test.ts`

The framework will be reused after G34-E source verification and G34-F offline real-data dry run. Final G34-G certification remains pending until a real authorized source package is processed.
