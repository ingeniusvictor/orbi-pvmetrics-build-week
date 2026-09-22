# PVM-ECC-P2 — AgentShield Repository Baseline

Status: REPORT-ONLY / BASELINE CLASSIFIED

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

## First-run evidence

Run: `35679299316`

Result:
- scanner outcome: SUCCESS;
- security score: 80 / B;
- total findings: 350;
- critical findings: 350;
- supply-chain status: CLEAN;
- evidence-pack verification: PASSED;
- evidence-pack verification digest: `sha256:e90805964b9ee5e2a203ae307dea63aadd054947564e9ce42b4830ef66476d70`;
- uploaded artifact: `pvmetrics-ecc-agentshield-35679299316`;
- artifact ID: `10674220461`;
- artifact digest: `sha256:e54acfa67bbef84602bcbdfe7c2678a9eabed836e5eeb16d086707951783be3f`.

### Finding classification

All **350 / 350** findings are one detector class:

`Hardcoded Azure storage account key`

All 350 findings point to `package-lock.json`.

Direct repository inspection confirmed the matched material is standard npm Subresource Integrity metadata, for example:

`"integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/...=="`

These values are dependency integrity hashes, not Azure storage account credentials.

Classification:

`ACCEPTED_FALSE_POSITIVE — NPM_INTEGRITY_SHA512`

The lockfile must **not** be redacted or rewritten to satisfy this detector. Its integrity fields are required package-manager metadata.

No additional secret/finding class was reported by this first run.
