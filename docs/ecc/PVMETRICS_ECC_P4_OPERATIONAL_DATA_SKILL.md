# PVM-ECC-P4 — First PVMetrics-owned Project Skill

Status: CONTROLLED / PROJECT-SKILL MATERIALIZED

## Skill

`.agents/skills/pvmetrics-operational-data-review/SKILL.md`

## Why this skill first

PVM-ECC-P3 showed that the highest-value project-specific recurring surface is not generic React or coding guidance. It is the operational-data/evidence governance boundary.

The skill is grounded in the actual current repository contracts:

- `OperationalAsset`
- `OperationalSource`
- `OperationalSignalDefinition`
- `OperationalEvidenceReference`
- `GovernedObservation`

and the actual validation rules in `validateGovernedObservation.ts`.

## Encoded repository rules

The skill preserves:

- referenceable asset/source/signal/evidence links;
- signal-key consistency;
- declared units;
- value types;
- governed quality taxonomy;
- evidence/source coherence;
- provenance matching;
- synthetic source protection;
- observation verification not exceeding source verification.

It also preserves higher-level ORBI boundaries:

`DATA GOVERNANCE != OPERATIONAL AUTHORITY`

`SOURCE_VERIFIED != MEASUREMENT_CORRECT != ACCEPTANCE`

`SYNTHETIC != REAL`

`AI OUTPUT != PLANT FACT != ACCEPTANCE EVIDENCE`

`FRAMEWORK READY != VERIFIED REAL PILOT`

## Activation

This skill is project-local and conditionally activated for:

- operational-data contracts;
- adapters/imports;
- evidence/provenance;
- real-data admission;
- commissioning evidence;
- AI grounded in operational data.

It is not intended to inflate context for unrelated UI work.

## Safety

P4 adds no runtime dependency and no operational capability.

It does not:

- connect to OT;
- enable SCADA/BMS/PCS/EMS protocols;
- issue commands/setpoints;
- change Commissioning status;
- ingest real data;
- enable hooks/MCP/memory/continuous learning;
- install ECC wholesale.

## Verification

P4 passes when:

1. the project skill exists and is registered;
2. AgentShield still reports only the already-classified P2 lockfile finding class;
3. Product Evolution CI is GREEN;
4. no product/runtime/operational source file changes;
5. hooks/MCP/memory/continuous learning remain disabled.

## Next

After P4 is certified, P5 should decide between:

- `pvmetrics-verification-loop` for repository-wide delivery evidence; or
- a lightweight PVMetrics agent-harness contract that routes the new project skill without introducing hooks or autonomous execution.
