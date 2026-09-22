# PVM-ECC-P1 — PVMetrics ECC Inventory and Instruction Baseline

Status: CONTROLLED / NO PRODUCT FEATURE CHANGE

Base branch: `feature/pvmetrics-product-evolution`  
Audited HEAD: `44c9ddb4ca6a4d05668a482ec7e564b6ebb61d89`

## Purpose

Start the PVMetrics ECC pilot using the portable lessons certified in ORBI Creative Studio without copying its repository-specific profile.

P1 updates the agent instruction surface, records an ECC candidate profile and adds CI coverage for pull requests targeting the active product-evolution branch.

## Repository evidence

- 593 tracked files.
- 338 `.ts` files.
- 190 `.tsx` files.
- 33 test files by tree inventory.
- 1 pre-existing GitHub Actions workflow.
- React 19 + Vite 6.
- Node 22 in the existing Commissioning CI.
- `package.json` defines `npm test`, `npm run lint` and `npm run build`.

## Important finding: existing AGENTS.md was stale

The pre-P1 root instructions were centered on the OpenAI Build Week Incident Intelligence Copilot.

That historical boundary remains important, but it is no longer an accurate repository-wide mission for the active product-evolution branch.

P1 therefore preserves Build Week history while making current product governance explicit:

- PE-01 governed operational data foundation;
- BESS Commissioning frozen boundary;
- Climate Recovery frozen competition boundary;
- no real OT/plant commands;
- no synthetic-to-real relabeling;
- data governance is not operational authority.

## Product state used by P1

### BESS Commissioning

Frozen at:

`PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING`

No generic Commissioning expansion is authorized.

### PE-00

Identifies the highest-priority evolution as a governed operational-data foundation and explicitly avoids live connectors or Commissioning modification.

### PE-01A

Implemented a synthetic-only contract:

`Asset -> Source -> Signal -> Quality -> Evidence -> Governed Observation`

No real-data connector, OT protocol, writeback, command, dispatch or acceptance authority exists.

## CI gap found

The existing `commissioning-ci.yml` does not target pull requests into `feature/pvmetrics-product-evolution`.

P1 adds `.github/workflows/pvmetrics-product-evolution-ci.yml` with:

- read-only repository permission;
- immutable checkout/setup-node action SHAs;
- Node 22;
- `npm ci`;
- `npm test`;
- `npm run lint`;
- `npm run build`.

This establishes evidence before later ECC/AgentShield phases.

## ECC state

P1 does not install ECC.

It records candidates only.

Disabled:

- full install;
- hooks;
- MCP;
- continuous learning;
- unified memory;
- autonomous loops;
- AgentShield until PVM-ECC-P2.

## Next phase

PVM-ECC-P2 should add a SHA-pinned AgentShield report-only baseline specific to PVMetrics.

The Creative Studio false-positive baseline must not be imported as accepted PVMetrics evidence.
