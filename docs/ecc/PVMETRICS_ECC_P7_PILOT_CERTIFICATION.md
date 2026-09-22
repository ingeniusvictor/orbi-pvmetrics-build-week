# PVM-ECC-P7 — ORBI PVMetrics ECC Pilot Certification

Status: SELECTIVE ADOPTION READY  
Pilot repository: `ingeniusvictor/orbi-pvmetrics-build-week`  
Canonical product-evolution branch: `feature/pvmetrics-product-evolution`  
Certified baseline before P7: `96087b124dd7a450cb5fdf2d80d81c296a34cf85`

## Purpose

Close the PVMetrics ECC pilot with an evidence-backed reusable engineering profile.

The outcome is **not** a full ECC installation.

The certified pattern is:

`ECC reference -> ORBI adaptation -> PVMetrics evidence -> selective project skill -> CI/security validation -> canonical merge`

## Upstream references

- ECC: `2.2.2 @ 91ba9b4cf6c47c8130829004f8bb64762a76ccbb`
- AgentShield: `1.6.0 @ b0891303bdcd6037376a94263d45cfd2ff3dfb98`

## Pilot history

| Phase | PR | Canonical result |
|---|---:|---|
| P1 | #1 | governed AGENTS/profile + Product Evolution CI — `a62ea14e...` |
| P2 | #2 | PVMetrics-specific AgentShield baseline — `390efd09...` |
| P3 | #3 | evidence-backed DAILY/LIBRARY classification — `dfda18af...` |
| P4 | #4 | `pvmetrics-operational-data-review` — `a458739f...` |
| P5 | #5 | `pvmetrics-verification-loop` — `b4d999c2...` |
| P6 | #6 | structured agent harness contract — `96087b12...` |

Each phase was merged only after the applicable PVMetrics validation surfaces completed successfully.

## Materialized PVMetrics engineering layer

### Root instructions

`AGENTS.md`

Defines:

- source-of-truth ordering;
- product-evolution branch discipline;
- Build Week / Climate Recovery historical boundaries;
- BESS Commissioning frozen state;
- data/privacy constraints;
- AI/operational authority separation;
- exact repository gate.

### Project skills

- `pvmetrics-operational-data-review`
- `pvmetrics-verification-loop`
- `pvmetrics-agent-harness`

These are ORBI-owned adaptations. Product runtime does not depend on them.

### Deterministic harness tooling

- `.orbi/pvmetrics-agent-observation-v1.schema.json`
- `scripts/validate-pvmetrics-agent-observation.mjs`
- `tests/pvmetricsAgentHarnessContract.test.mjs`

The harness validator checks observation shape and consistency only. It is not an authorization engine and does not establish that referenced evidence is true.

## P6 final verification evidence

Product Evolution CI run: `35680202032`

Final result:

- exact dependency install: PASS;
- repository tests: **672 / 672 PASS**;
- TypeScript check: PASS;
- production build: PASS.

The new harness tests executed inside the normal repository test gate, including:

- valid success observation;
- error observations requiring recovery;
- valid explicit recovery;
- unknown-field rejection;
- explicit boolean authority-impact validation.

AgentShield run: `35680201871`

Result:

- report-only workflow: SUCCESS;
- finding count: 350;
- unique finding classes: 1;
- finding class: `Hardcoded Azure storage account key` in `package-lock.json`;
- classification remains the PVMetrics P2 baseline: npm `integrity: sha512-...` false positives;
- no new security finding class introduced by the P6 harness.

## Security posture

AgentShield remains:

- SHA-pinned;
- `contents: read`;
- non-fixing;
- report-only;
- non-blocking.

The accepted PVMetrics baseline is narrowly defined:

`ACCEPTED_FALSE_POSITIVE — NPM_INTEGRITY_SHA512`

It must not be generalized to another repository without fresh evidence.

A future new finding class requires explicit review.

## PVMetrics authority invariants

The pilot certifies the agentic engineering layer only. It does not alter these boundaries:

`DATA GOVERNANCE != OPERATIONAL AUTHORITY`

`SOURCE_VERIFIED != MEASUREMENT_CORRECT != ACCEPTANCE`

`SYNTHETIC != REAL`

`AI OUTPUT != PLANT FACT != ACCEPTANCE EVIDENCE`

`TESTS GREEN != REAL PLANT VERIFIED`

`BUILD GREEN != OPERATIONALLY ACCEPTED`

`FRAMEWORK READY != VERIFIED REAL PILOT`

The ECC-derived layer has no authority to:

- connect to live OT;
- issue SCADA/BMS/PCS/EMS commands;
- issue start/stop or charge/discharge dispatch;
- alter setpoints or protection;
- authorize energization;
- authorize commissioning acceptance;
- mark synthetic data as real;
- invent OEM/project criteria;
- promote PVMetrics to verified-real-pilot status.

## BESS Commissioning state

This certification does **not** change the existing commissioning state:

**PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING**

The agentic pilot is independent of physical/site acceptance.

## DAILY surface

Certified DAILY agents:

- planner
- architect
- code-reviewer
- security-reviewer
- tdd-guide
- doc-updater
- typescript-reviewer

Certified DAILY skills/reference capabilities:

- architecture-decision-records
- coding-standards
- contract-first
- tdd-workflow
- `pvmetrics-verification-loop`
- security-review
- context-budget
- delivery-gate
- git-workflow

Project-specific skills remain conditionally loaded rather than permanently injecting all procedures into every task.

## What is portable from PVMetrics

### Portable with minor review

- explicit authority-impact reporting;
- structured observation status/summary/next-action/evidence model;
- fail-closed recovery requirements;
- unknown-field rejection;
- verification-vs-operational-acceptance distinction;
- conditional project-skill routing.

### PVMetrics-specific and must not be blindly copied

- operational-data taxonomy;
- synthetic/declared-real provenance policy;
- source-verification hierarchy;
- commissioning frozen state;
- OT/energization/dispatch authority list;
- PVMetrics AgentShield accepted baseline;
- exact Product Evolution test/build commands.

## Deliberately disabled after certification

- ECC full installation;
- bulk agent installation;
- bulk skill installation;
- hooks;
- MCP;
- continuous-learning-v2;
- unified-memory runtime;
- autonomous loops;
- agent runtime execution;
- multi-agent roles.

These remain future experiments, not implicit next steps.

## Rollback model

The PVMetrics ECC layer remains removable:

- remove project skills;
- remove harness schema/validator/tests;
- remove ECC docs/workflows/profile;
- restore the prior package test command if the harness test is removed.

No PVMetrics product runtime is designed to require these files.

## Certification conclusion

PVMetrics demonstrates that the Creative Studio portable ECC pattern can be transferred to a second, technically different ORBI project without copying its authority model verbatim.

The result is a smaller and more domain-aware engineering layer:

`repository evidence -> PVMetrics-specific instructions -> report-only security baseline -> agent-sort -> domain skills -> structured harness -> certification`

PVM-ECC-P7 therefore certifies the current selective layer as suitable for continued ORBI engineering use while keeping runtime autonomy, memory, hooks and OT authority disabled.
