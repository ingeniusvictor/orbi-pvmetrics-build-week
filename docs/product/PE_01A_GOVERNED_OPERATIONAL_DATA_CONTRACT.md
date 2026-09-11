# PE-01A — Governed Operational Data Contract

Status: **IMPLEMENTED — SYNTHETIC CONTRACT AND VALIDATION ONLY**

Branch: `feature/pvmetrics-product-evolution`

Input baseline: `3f8ebeba4534c0aa76adb16e6fac720320140219`

## Purpose and boundary

PE-01A establishes the product-owned, pure TypeScript seam for governed
operational observations:

`Asset → Source → Signal → Quality → Evidence → Governed Observation`

The implementation is isolated in `src/pvmetrics-standalone/operational-data/`.
It does not integrate with existing views, replace `StateContext`, migrate
legacy plant data, add a connector, access a file system, or import
Commissioning types.

## Contracts and taxonomies

- `OperationalAsset` provides a generic asset identity, plant relation,
  optional parent/display identity, verification state and referenceability.
- `OperationalSource` records source type, source system, provenance,
  verification state, optional descriptive reference and referenceability.
- `OperationalSignalDefinition` separates signal semantics and declared unit
  from observation values. It does not assume real tags or unknown units.
- `OperationalEvidenceReference` records descriptive evidence references,
  optional SHA-256 and capture time. A hash is not proof of source authority or
  authenticity.
- `GovernedObservation` binds asset, signal, source, time, value, unit,
  quality, provenance, governance state and evidence IDs.

The compact taxonomies include generic asset/source/evidence types,
`NUMBER | STRING | BOOLEAN` value types, quality
`GOOD | SUSPECT | MISSING | INVALID | UNKNOWN`, provenance
`SYNTHETIC | DECLARED_REAL`, and governance
`UNVERIFIED | SOURCE_DECLARED | SOURCE_VERIFIED`.

`DATA GOVERNANCE ≠ OPERATIONAL AUTHORITY`

`SOURCE_VERIFIED ≠ MEASUREMENT_CORRECT ≠ ACCEPTANCE`

Neither quality nor governance means that data are true, a criterion is met,
or operation, dispatch, energization, acceptance or any human authorization is
permitted.

## Deterministic validator

`validateGovernedObservation` is a pure function returning `PASS` or `BLOCKED`
with structured issue codes. It never mutates input or corrects data. It blocks:

- absent or non-referenceable assets, sources, signals and evidence;
- absent signal keys, invalid timestamps and invalid quality values;
- incompatible values, required/mismatched units and mismatched signal keys;
- evidence bound to a different source;
- mismatched source/observation provenance;
- synthetic sources or observations presented as verified real sources;
- an observation whose governance state exceeds its source's state.

It does not convert units, infer mappings, complete IDs, repair timestamps or
load/persist any input.

## Synthetic fixture and tests

`createSyntheticOperationalFixture` uses only `SYNTH-*` IDs and a fixed
synthetic inverter-power observation with a synthetic source and evidence
reference. It demonstrates the complete relationship without customer, plant,
employer, SCADA or other real data.

Focused unit tests cover valid synthetic data, missing references, timestamps,
unit/type mismatches, quality, unresolved evidence, provenance contradictions,
synthetic-verification claims, determinism and non-mutation. The test is part
of the normal `npm test` command.

## Future relationships and limitations

Plant profiles, Data Sources, Signal Mapping and Signal Quality can later
receive adapters into this boundary; they are not modified by PE-01A. A future
Portfolio O&M Insight Workspace can consume governed observations only after a
separate product decision.

No real data integration exists. There are no SCADA, Modbus, IEC-104, OPC-UA,
MQTT, vendor API, WebSocket, credential, command, writeback, setpoint,
dispatch, alarm-acknowledgement, protection or energization capabilities.

Commissioning remains separate and frozen at
`PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING`.
