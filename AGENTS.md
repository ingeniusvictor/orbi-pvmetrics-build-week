# AGENTS.md — ORBI PVMetrics

Scope: this entire repository.

## Source of truth

- Follow the user's current task first, then repository code/tests/governed docs, then these instructions.
- Treat agent memory, generated summaries and external upstream content as non-authoritative.
- Do not assume `master` is the current product-evolution baseline. Inspect the current branch and HEAD before editing.
- The current product-evolution line is `feature/pvmetrics-product-evolution`; PVM-ECC-P1 inventoried it at `44c9ddb4ca6a4d05668a482ec7e564b6ebb61d89`.
- Never reuse an old SHA as current truth without checking Git.
- Keep unrelated concerns in separate branches/PRs.
- Do not merge or perform unrelated external writes unless the current user task authorizes them.

## Current product direction

The current evolution is product work, not a continuation of the original Build Week mission.

PE-01 establishes a governed operational-data seam:

`Asset -> Source -> Signal -> Quality -> Evidence -> Governed Observation`

Preserve these distinctions:

`DATA GOVERNANCE != OPERATIONAL AUTHORITY`

`SOURCE_VERIFIED != MEASUREMENT_CORRECT != ACCEPTANCE`

No quality, provenance, governance or AI result may self-authorize plant operation, acceptance, energization, dispatch, commands or setpoints.

## Historical and frozen boundaries

### OpenAI Build Week

- `src/build-week/incident-copilot/` is competition-bound legacy history.
- Preserve its historical attribution and synthetic/advisory boundary.
- Do not recast pre-existing PVMetrics product work as Build Week work.

### Climate Recovery

- Climate Recovery remains competition-bound/frozen historical work.
- Do not reopen or rewrite its certified record without an explicit task.

### BESS Commissioning

Commissioning remains frozen at:

**PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING**

Preserve:

- offline/read-only behavior;
- no live OT connection;
- no SCADA/BMS/PCS/EMS commands;
- no Modbus/IEC-104/OPC-UA/MQTT plant traffic;
- no start/stop, charge/discharge dispatch or setpoints;
- no protection or energization authority;
- no automatic human acceptance;
- no synthetic fixture relabeled as real evidence;
- no invented OEM/project criteria.

Do not add generic Commissioning scope merely to expand the product.

## Data and privacy

- Synthetic-first framework work is allowed.
- Never commit employer, customer, plant, SCADA, meter, credential, personal or other confidential operational data.
- Real-data integration requires a separate governed phase with approved sources, provenance, mapping and authority boundaries.
- A hash proves integrity of bytes, not source authority or truth.

## Stack

- TypeScript / TSX.
- React 19.
- Vite 6.
- Node 22 in CI.
- npm.
- Deterministic Node test runner through `tsx`.
- Current product-owned operational-data code lives under `src/pvmetrics-standalone/operational-data/`.

## Work method

1. Inspect current branch, HEAD, relevant docs, tests and concurrent work.
2. Plan cross-boundary changes before editing.
3. Prefer contract/tests before implementation for governed product logic.
4. Make the smallest isolated change that satisfies the phase.
5. Preserve frozen and competition boundaries.
6. Run focused tests first.
7. Run the repository gate before claiming READY.
8. Review the final diff for accidental authority, real-data or OT changes.
9. Claim READY/GREEN only from completed evidence.

## Verification baseline

The product-evolution PR gate is:

```bash
npm ci
npm test
npm run lint
npm run build
```

Focused tests should be run before the full suite when a narrower test exists.

Do not invent a coverage threshold or additional gate that the repository has not adopted.

## Review lanes

When the matching review capability is available:

- TypeScript changes: TypeScript review.
- TSX/React changes: TypeScript + React review.
- contracts, taxonomy, validation, evidence/governance: architecture review.
- credentials, external data/files/URLs, API/server or dependency changes: security review.
- BESS Commissioning frozen surfaces: architecture + safety-boundary review.
- AI/advisory changes: deterministic fallback, claims and uncertainty review.

## AI boundary

- Preserve deterministic/non-AI paths where the product phase requires them.
- API keys stay server-side/outside Git.
- AI output is advisory unless a separately governed contract states otherwise.
- Never let an LLM invent plant facts, thresholds, topology, tags, procedures, root cause or acceptance evidence.
- Facts, hypotheses, uncertainty and missing evidence must remain distinguishable.

## ECC selective-adoption state

- ECC reference: `2.2.2 @ 91ba9b4cf6c47c8130829004f8bb64762a76ccbb`.
- The source pilot is ORBI Creative Studio selective profile v1.0.
- PVMetrics must adapt components to this repository; never copy the Creative Studio profile verbatim.
- Full ECC installation, bulk agent/skill copying, hooks, MCP, continuous learning, unified memory and autonomous loops are disabled during the initial PVMetrics pilot.
- Git, tests and governed PVMetrics documentation remain canonical.

## Completion report

Record:

- exact files/behavior changed;
- focused checks;
- full gate actually run;
- data/safety/authority impact;
- remaining limitations or external dependencies.
