# PVM-ECC-P2 — AgentShield Repository Baseline

Status: REPORT-ONLY / BASELINE PENDING FIRST EXECUTION

## Purpose

Create a PVMetrics-specific AgentShield baseline after PVM-ECC-P1 proved the product-evolution branch can execute its CI successfully.

This phase does not inherit accepted findings from Creative Studio or L.U.M.I.A.

## Pinning and permissions

AgentShield:
- package: `ecc-agentshield@1.6.0`
- repository: `affaan-m/agentshield`
- commit: `b0891303bdcd6037376a94263d45cfd2ff3dfb98`

Workflow:
- `contents: read`;
- immutable action SHAs;
- checkout credentials not persisted;
- report-only;
- no automatic fixes;
- non-blocking findings;
- supply-chain online lookup disabled;
- evidence pack verification enabled.

## PVMetrics-specific review priorities

Findings must be classified against PVMetrics trust boundaries, especially:

- API keys, tokens and external connector credentials;
- operational-data adapters and ingestion paths;
- CSV/JSON/imported evidence and file parsing;
- provenance and evidence references;
- synthetic-versus-real data labeling;
- BESS/PV commissioning observations;
- future OT/SCADA/OEM connector surfaces;
- browser/API network destinations;
- GitHub Actions and dependency supply chain;
- agent/harness instructions and permissions.

## Operational authority boundary

A scanner result, agent recommendation, governed observation or AI output must never:

- connect to live OT by itself;
- issue a plant command;
- authorize energization, dispatch or commissioning acceptance;
- relabel synthetic data as real;
- invent OEM/project acceptance criteria;
- convert framework readiness into verified-pilot status.

## No inherited false positives

A finding class accepted in another ORBI repository is not automatically accepted here.

If the scanner reports lockfile material as a secret, P2 must inspect PVMetrics evidence directly before classifying it.

## Exit criteria

P2 passes only when:

1. AgentShield completes successfully;
2. evidence pack verification passes;
3. supply-chain status is recorded;
4. all finding classes are inspected;
5. any accepted false positives are justified from PVMetrics evidence;
6. PVMetrics Product Evolution CI remains GREEN;
7. no product/runtime/operational behavior changes are introduced.
