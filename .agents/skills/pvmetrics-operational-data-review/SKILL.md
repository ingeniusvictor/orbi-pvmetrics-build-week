---
name: pvmetrics-operational-data-review
description: Review ORBI PVMetrics operational-data, provenance, evidence and governed-observation changes. Use when touching operational-data contracts, adapters, imports, source mappings, evidence references, quality/verification state, synthetic/real data boundaries, or when operational evidence could affect commissioning or AI claims.
version: "0.1.0"
license: MIT
metadata:
  origin: ORBI
  upstream_inspiration: ECC contract-first + security-review + verification-loop
  authoritative: false
  runtime_dependency: false
---

# PVMetrics Operational Data Review

Use this skill for changes that can alter the meaning, provenance, quality, verification or evidentiary status of PVMetrics operational data.

This skill is advisory/instructional. Current repository code, tests, governed phase documents and `AGENTS.md` remain authoritative.

## Activate when

Use this skill when a change touches or proposes:

- `src/pvmetrics-standalone/operational-data/**`;
- operational-data adapters or registries;
- CSV/JSON/API/import pipelines that produce operational observations;
- source mappings or signal definitions;
- evidence references or hashes;
- quality or verification states;
- synthetic fixtures or demo data;
- real-data integration;
- commissioning evidence derived from operational data;
- AI features that summarize, infer from, or cite operational data.

## Core authority boundaries

Preserve these distinctions at all times:

`DATA GOVERNANCE != OPERATIONAL AUTHORITY`

`SOURCE_VERIFIED != MEASUREMENT_CORRECT != ACCEPTANCE`

`SYNTHETIC != REAL`

`AI OUTPUT != PLANT FACT != ACCEPTANCE EVIDENCE`

`FRAMEWORK READY != VERIFIED REAL PILOT`

A governed observation can be valid under its contract without authorizing any plant command, energization, dispatch, protection change or commissioning acceptance.

## 1. Read the current contracts first

Before reviewing a change, inspect the current repository versions of:

- `operational-data/contracts/entities.ts`;
- `operational-data/contracts/taxonomy.ts`;
- `operational-data/validation/validateGovernedObservation.ts`;
- relevant fixtures/adapters/tests.

Do not rely on an old skill description when the contract has changed.

Current foundation models a chain similar to:

`Asset -> Source -> Signal -> Quality -> Evidence -> GovernedObservation`

Review the actual types and validator before deciding whether a change is valid.

## 2. Trace every observation to its references

For each changed or newly produced governed observation verify:

- `assetId` resolves to a referenceable asset;
- `sourceId` resolves to a referenceable source;
- `signalId` resolves to a referenceable signal;
- `signalKey` matches the signal definition;
- timestamp is present and parseable;
- declared unit requirements are respected;
- value type matches the signal definition;
- quality belongs to the governed taxonomy;
- each `evidenceId` resolves to referenceable evidence;
- evidence source, when declared, matches the observation source.

Do not accept a value merely because it is syntactically parseable.

## 3. Preserve provenance

Current governed provenance distinguishes at least:

- `SYNTHETIC`;
- `DECLARED_REAL`.

Rules:

- observation provenance must match source provenance;
- synthetic data must remain visibly synthetic through every adapter/transform;
- a filename, UI label or human statement must not silently upgrade synthetic data to real;
- derived/normalized data must retain traceability to its source;
- transformations may change representation, not historical provenance.

If a new provenance state is proposed, require a contract/test phase rather than encoding it ad hoc in one adapter.

## 4. Preserve verification hierarchy

Current verification states include:

`UNVERIFIED < SOURCE_DECLARED < SOURCE_VERIFIED`

The observation must never claim a verification level above its source.

Current validator explicitly blocks:

- `SYNTHETIC_SOURCE_CLAIMED_VERIFIED`;
- `OBSERVATION_VERIFICATION_EXCEEDS_SOURCE`.

Do not weaken, bypass or special-case these protections merely to ingest a dataset.

`SOURCE_VERIFIED` means the source identity/provenance was verified under the governed process. It does **not** prove measurement accuracy, calibration, engineering correctness, root cause or commissioning acceptance.

## 5. Treat quality separately from verification

Current quality states include:

- `GOOD`
- `SUSPECT`
- `MISSING`
- `INVALID`
- `UNKNOWN`

Quality and verification are separate dimensions.

Examples:

- a `GOOD` value can still come from an unverified source;
- a source can be verified while a particular measurement is `INVALID`;
- `GOOD` must never be interpreted as commissioning acceptance.

Do not collapse quality, provenance and verification into one confidence score without a separately governed contract.

## 6. Evidence is reference material, not automatic truth

For `OperationalEvidenceReference` changes verify:

- reference is explicit and traceable;
- source linkage is coherent;
- capture time is not invented;
- hashes, when present, are treated as byte-integrity evidence only;
- a SHA-256 hash does not establish source authority, authenticity, calibration or engineering truth;
- screenshots/manual notes remain their declared evidence type;
- missing evidence stays missing rather than being fabricated by an AI or fixture.

Do not generate fake evidence identifiers to make validation pass.

## 7. Real-data admission requires a separate governed step

If a change introduces or proposes real plant/customer/OEM data:

- stop treating it as a fixture-only change;
- identify approved source and owner;
- document source system and mapping;
- document whether data may be stored in Git/test fixtures;
- remove/redact confidential identifiers where required;
- define provenance and verification procedure;
- define expected unit/value/quality mappings;
- add tests before promoting the adapter;
- preserve a clear rollback path.

Never commit employer/customer/plant credentials or confidential operational exports.

Do not mark data `DECLARED_REAL` or `SOURCE_VERIFIED` merely because the user says it came from a real plant; follow the repository's governed admission process.

## 8. Commissioning boundary

Operational-data validity does not change the frozen BESS Commissioning status:

`PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING`

This skill must not:

- authorize energization;
- authorize charge/discharge dispatch;
- authorize start/stop;
- create SCADA/BMS/PCS/EMS commands;
- create setpoints;
- bypass OEM/project criteria;
- convert a governed observation into automatic human acceptance;
- claim a real-pilot verification without governed real evidence.

If a proposed change crosses into live OT or acceptance authority, classify it as a new governed phase rather than a normal operational-data patch.

## 9. AI boundary

When an AI consumes operational data:

- facts, hypotheses and missing evidence must remain distinguishable;
- cite/reference governed evidence where the product contract supports it;
- do not let the model invent tags, topology, thresholds, timestamps, units, procedures or root cause;
- deterministic validation remains authoritative over LLM prose;
- AI text cannot elevate verification state;
- AI output cannot create acceptance evidence.

## 10. Required review workflow

For an operational-data change:

1. identify changed contracts/adapters/fixtures;
2. classify provenance impact;
3. trace asset/source/signal/evidence references;
4. review quality and verification independently;
5. inspect synthetic-vs-real boundary;
6. inspect confidentiality/credential risk;
7. run the focused operational-data test;
8. run full PVMetrics CI-equivalent checks;
9. inspect final diff for authority expansion;
10. record remaining evidence gaps.

Focused current foundation test:

```bash
node --import tsx --test src/pvmetrics-standalone/operational-data/operationalDataFoundation.test.ts
```

Repository gate:

```bash
npm ci
npm test
npm run lint
npm run build
```

## 11. Review report

Return:

```text
PVMETRICS OPERATIONAL DATA REVIEW

Scope:
- branch/head:
- changed contracts/adapters:
- data source(s):

Governance:
- provenance:
- verification state:
- quality:
- evidence references:
- synthetic/real boundary:

Authority impact:
- live OT introduced: YES/NO
- plant commands introduced: YES/NO
- acceptance authority changed: YES/NO
- real-pilot status changed: YES/NO

Validation:
- focused operational-data test:
- full tests:
- TypeScript/lint:
- build:
- AgentShield if applicable:

Result:
- READY / NOT READY / PARTIALLY VERIFIED

Remaining evidence gaps:
- ...
```

Use READY only for the software/data-governance change that was actually verified. Do not imply operational acceptance.

## Rollback

This skill is instruction-only.

Remove `.agents/skills/pvmetrics-operational-data-review/` and its manifest registration to roll back. Product runtime must not depend on this file.
