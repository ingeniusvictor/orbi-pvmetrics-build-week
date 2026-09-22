---
name: pvmetrics-verification-loop
description: Repository-aware completion and readiness verification for ORBI PVMetrics. Use before claiming READY/GREEN, merging a phase PR, certifying framework changes, or handing off product-evolution work. Verifies focused tests, full CI-equivalent checks, data/authority boundaries, and evidence gaps without confusing software validation with plant or commissioning acceptance.
version: "0.1.0"
license: MIT
metadata:
  origin: ORBI
  upstream_inspiration: ECC verification-loop + delivery-gate
  authoritative: false
  runtime_dependency: false
---

# PVMetrics Verification Loop

Use this skill before declaring PVMetrics work complete, READY, GREEN, certified, mergeable, or suitable for handoff.

This skill is instruction-only. Repository code, tests, governed phase documents, Git history and the current `AGENTS.md` remain authoritative.

## Core rule

A software gate proves only the software surface it actually exercised.

Preserve:

`TESTS GREEN != REAL PLANT VERIFIED`

`BUILD GREEN != OPERATIONALLY ACCEPTED`

`DATA GOVERNANCE VALID != MEASUREMENT CORRECT`

`SOURCE_VERIFIED != COMMISSIONING ACCEPTANCE`

`AI OUTPUT != ACCEPTANCE EVIDENCE`

`FRAMEWORK READY != VERIFIED REAL PILOT`

## 1. Establish exact state

Before verification record:

- repository;
- branch;
- HEAD SHA;
- base/canonical branch;
- changed files;
- intended phase;
- whether concurrent PRs changed the base;
- whether the change touches a frozen/historical surface.

Never report a stale commit as the verified state.

If the branch moved after a successful CI run, rerun the required gate for the final HEAD.

## 2. Classify changed surface

Identify every relevant lane:

- TypeScript contracts/logic;
- React/TSX UI;
- operational-data governance;
- BESS Commissioning;
- Build Week legacy;
- Climate Recovery frozen work;
- AI/advisory behavior;
- API/server/network;
- credentials/secrets;
- imports/files/data parsing;
- agentic/ECC harness files;
- dependencies/workflows.

A change can require more than one lane.

## 3. Run focused evidence first

Run the narrowest deterministic test that exercises the changed contract.

Examples:

Operational-data foundation:

```bash
node --import tsx --test src/pvmetrics-standalone/operational-data/operationalDataFoundation.test.ts
```

For Commissioning, Climate Recovery, Build Week or UI changes, select the existing matching test file(s) from the repository rather than inventing a new command or skipping focused validation.

Focused success does not replace the full repository gate.

## 4. Run the repository gate

Current product-evolution baseline:

```bash
npm ci
npm test
npm run lint
npm run build
```

Interpretation:

- `npm ci`: exact committed dependency graph installs successfully;
- `npm test`: governed deterministic repository tests pass;
- `npm run lint`: current repository TypeScript no-emit check passes;
- `npm run build`: production Vite build succeeds.

Do not claim coverage, browser E2E, real connector behavior or plant validation unless those were actually run.

## 5. Verify data-governance boundaries

When data/evidence is involved, verify:

- synthetic remains synthetic;
- real-source claims follow the governed admission process;
- provenance is preserved;
- verification state does not exceed its source;
- quality is not conflated with verification;
- evidence references resolve coherently;
- hashes are not treated as source authority;
- confidential plant/customer/OEM data is not committed.

Use `pvmetrics-operational-data-review` for detailed operational-data changes.

## 6. Verify frozen and competition boundaries

### BESS Commissioning

Current frozen state remains:

`PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING`

A software change must not silently convert that status to verified real pilot.

Verification must explicitly state whether the change introduced:

- live OT connectivity;
- SCADA/BMS/PCS/EMS protocol traffic;
- start/stop commands;
- charge/discharge dispatch;
- setpoints;
- protection changes;
- energization authority;
- automated acceptance.

If any answer changes from NO to YES, this is not a routine completion gate. It requires a separately governed phase.

### Build Week / Climate Recovery

Do not rewrite historical competition evidence or attribution as part of unrelated product evolution.

## 7. Verify AI claims

For AI/advisory changes:

- deterministic fallback/validation remains available where required;
- facts, hypotheses, uncertainty and missing evidence remain distinguishable;
- no LLM-generated plant fact is treated as evidence;
- no LLM-generated threshold/procedure/root cause is silently promoted to authority;
- provider failure behavior is explicit;
- secret/API-key handling remains outside Git/client exposure.

## 8. Verify agentic/ECC changes

For `.agents/**`, `.orbi/**`, `docs/ecc/**`, `AGENTS.md` or ECC workflow changes:

- AgentShield remains report-only unless an explicit later phase changes that policy;
- compare findings against the recorded PVMetrics baseline;
- the accepted baseline is currently only the documented npm `package-lock.json` integrity-hash false-positive class;
- any new finding class requires review;
- hooks, MCP, continuous learning, unified memory and autonomous loops remain disabled unless the current phase explicitly governs them;
- agent instructions cannot grant operational authority.

## 9. Review the final diff

Before READY:

- inspect every changed file;
- confirm no unrelated file drift;
- confirm no real data/credentials were introduced;
- confirm no authority boundary was weakened;
- confirm docs/manifests match implementation;
- confirm rollback remains possible.

Documentation-only and skill-only changes still require the repository gate if the phase says they do.

## 10. Readiness states

Use only:

### READY

Use when all required deterministic evidence for the software/change scope is complete and no unresolved blocking boundary exists.

### PARTIALLY VERIFIED

Use when some required evidence is unavailable or external, but completed checks are known.

Examples:

- GitHub CI passed but real pilot evidence is still pending;
- software contract passed but a physical/OT runtime was not exercised;
- local-only hardware evidence is unavailable.

### NOT READY

Use when required tests/build fail, evidence is contradictory, authority boundaries are violated, or the final HEAD has not been verified.

Never use READY to imply commissioning/operational acceptance unless a separately governed process actually established it.

## 11. Completion report

Return:

```text
PVMETRICS VERIFICATION

Scope:
- phase/task:
- branch:
- HEAD:
- base:
- changed files:

Focused checks:
- ...

Repository gate:
- npm ci:
- npm test:
- npm run lint:
- npm run build:

Security / agentic:
- AgentShield if applicable:
- new finding classes:

Data governance:
- synthetic/real:
- provenance:
- evidence:
- verification-state impact:

Authority:
- live OT introduced: YES/NO
- commands/setpoints introduced: YES/NO
- commissioning acceptance changed: YES/NO
- verified-real-pilot status changed: YES/NO

Result:
- READY / PARTIALLY VERIFIED / NOT READY

Remaining external evidence:
- ...
```

## Rollback

This skill is instruction-only.

Remove `.agents/skills/pvmetrics-verification-loop/` and its manifest registration to roll back. No product runtime may depend on it.
