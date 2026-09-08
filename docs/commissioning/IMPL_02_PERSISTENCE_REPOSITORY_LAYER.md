# IMPL-02 — Commissioning Persistence / Repository Layer

Status: implemented, QA in progress

Branch: `feature/bess-commissioning-workspace`

## Objective

Provide a local-first, versioned persistence boundary for the BESS Commissioning workspace without coupling Commissioning domain state to the existing global `StateContext` or to direct `localStorage` calls.

## Architecture

- `CommissioningStorageDriver`: minimal read/write/remove port.
- `MemoryCommissioningStorageDriver`: deterministic test/runtime memory adapter.
- `BrowserLocalStorageDriver`: scoped browser adapter with a Commissioning-only key prefix.
- `CommissioningRepository`: versioned JSON envelope and load/save/reset operations.
- `CommissioningSnapshot`: normalized aggregate of Commissioning entities.

## Persistence envelope

Schema version: `1`

Stored envelope contains:

- `schemaVersion`
- `savedAt`
- `snapshot`

Unknown schema versions and malformed JSON are rejected as `INVALID`; they are never silently coerced into current state.

## Safety invariants

1. Commissioning persistence is isolated from legacy PVMetrics global storage keys.
2. Repository reset removes only the scoped Commissioning workspace key.
3. No operational command, setpoint, EMS/BMS/PCS writeback, SCADA write, or telecontrol is introduced.
4. Persistence stores analytical/documentary Commissioning state only.
5. Invalid stored payloads fall back to an empty snapshot with explicit invalid status.
6. No automatic schema migration exists in v1; migration must be explicit and version-controlled.
7. Raw imported evidence/data files are not embedded blindly into browser storage; later import blocks will store references/normalized state according to the data contract.

## Current entities persisted

Projects, scopes, assets, scope-assets, campaigns, test templates/instances/executions/phases, criteria/snapshots/evaluations, signal definitions/mappings, telemetry samples, datasets, events, evidence metadata, calculations, anomalies, findings, corrective actions, punch items, human acceptance decisions, gates, requirements, accepted baselines, and handover packages.

## QA matrix

- Empty load returns a complete empty snapshot.
- Save/load round-trip preserves versioned state.
- Malformed JSON is rejected.
- Unknown schema version is rejected.
- Browser storage keys are namespaced.
- Reset does not remove unrelated browser keys.
- Full historical repository tests remain required.
- TypeScript lint required.
- Production build required.

## Gate

`G02` may only PASS after the Commissioning CI reports:

- `npm ci` PASS
- `npm test` PASS
- `npm run lint` PASS
- `npm run build` PASS

No UI integration is authorized by IMPL-02.
