# PVM-ECC-P3 — ECC Agent Sort Audit for ORBI PVMetrics

Status: EVIDENCE-BACKED / CLASSIFICATION-ONLY  
PVMetrics base: `feature/pvmetrics-product-evolution`  
P2 canonical at start: `390efd095aa1b66c4ce78171a9efa8a7af376640`  
ECC reference: `2.2.2 @ 91ba9b4cf6c47c8130829004f8bb64762a76ccbb`

This audit applies the ECC `agent-sort` methodology to the actual PVMetrics product-evolution repository. It does not claim that the ECC runtime executed the classification.

## STACK

Repository evidence established by PVM-ECC-P1/P2:

- TypeScript / TSX is the dominant product language.
- React 19 + Vite 6.
- Node 22 in CI.
- npm with committed lockfile.
- deterministic tests executed through the existing repository test command.
- governed operational-data contracts under `src/pvmetrics-standalone/operational-data/`.
- historical Build Week and Climate Recovery surfaces remain bounded/frozen.
- BESS Commissioning remains `PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING`.
- Product Evolution CI runs `npm ci`, tests, TypeScript/lint checks and production build.
- AgentShield is report-only and its P2 baseline is classified from PVMetrics evidence.

The codebase is therefore not a generic React application. Its recurring engineering concerns are TypeScript correctness, contract/governance integrity, evidence provenance, deterministic validation, safety boundaries and controlled AI usage.

## DAILY AGENTS

| Agent | Repository evidence | Decision |
|---|---|---|
| `planner` | phased PE/G34 development, frozen boundaries and multi-step governed changes | DAILY |
| `architect` | operational-data contracts, evidence/provenance model and BESS/PV authority boundaries | DAILY |
| `code-reviewer` | large TypeScript/TSX product surface with governed PR validation | DAILY |
| `security-reviewer` | external data, credentials, API/server paths and future OT/SCADA connector risk | DAILY |
| `tdd-guide` | deterministic tests and contract-first product evolution | DAILY |
| `doc-updater` | phase/freeze/certification records are part of repository authority | DAILY |
| `typescript-reviewer` | TypeScript/TSX is the dominant implementation stack | DAILY |

## LIBRARY AGENTS

Useful only when the matching task exists:

| Agent | Trigger | Decision |
|---|---|---|
| `react-reviewer` | React/TSX UI-specific change | LIBRARY |
| `react-build-resolver` | React-specific build failure | LIBRARY |
| `build-error-resolver` | failed CI/build investigation | LIBRARY |
| `e2e-runner` | explicit browser/end-to-end workflow | LIBRARY |
| `performance-optimizer` | performance/benchmark phase | LIBRARY |
| `refactor-cleaner` | explicit cleanup/refactor phase | LIBRARY |
| `silent-failure-hunter` | ingestion/provider/async failure investigation | LIBRARY |
| `mle-reviewer` | AI/ML evaluation or inference-specific work | LIBRARY |
| `rag-pipeline-reviewer` | only if governed retrieval/RAG becomes an active product surface | LIBRARY |
| `harness-optimizer` | only after a materialized agent harness exists | LIBRARY |
| `loop-operator` | only for explicitly bounded autonomous loops | LIBRARY |

## DAILY SKILLS

These are broad enough to help most PVMetrics product-evolution sessions:

| Skill | Repository evidence |
|---|---|
| `architecture-decision-records` | phase decisions and frozen boundaries need durable rationale |
| `coding-standards` | large TypeScript/TSX surface |
| `contract-first` | operational-data entities/validators and governed interfaces |
| `tdd-workflow` | deterministic contract-first development |
| `verification-loop` | focused test -> full test -> type/lint -> build -> evidence discipline |
| `security-review` | credentials, external data/files/APIs and future OT integration |
| `context-budget` | large multi-phase repository with historical/frozen surfaces |
| `delivery-gate` | Product Evolution CI and phase-certification discipline |
| `git-workflow` | feature-branch / PR / canonical product-evolution workflow |

## LIBRARY SKILLS

Keep searchable/on-demand rather than always loaded:

- `agent-sort`
- `codebase-onboarding`
- `agent-harness-construction`
- `ai-regression-testing`
- `eval-harness`
- `benchmark`
- `benchmark-methodology`
- `browser-qa`
- `e2e-testing`
- `frontend-patterns`
- `react-patterns`
- `react-testing`
- `react-performance`
- `vite-patterns`
- `error-handling`

One-time setup skills such as `agent-sort` and `codebase-onboarding` should not remain DAILY once their job is complete.

## EXCLUDED / DEFERRED

Not active in P3:

- full ECC installation;
- bulk agent/skill copy;
- hooks;
- MCP;
- continuous-learning-v2;
- unified-memory;
- continuous-agent-loop;
- autonomous multi-agent loops.

Python/C++/mobile-specific reviewer surfaces are off-stack for the current product-owned source and should not be loaded by default.

## PVMETRICS-SPECIFIC ADAPTATION

Generic ECC verification/security guidance is insufficient for PVMetrics because it must preserve these non-negotiable distinctions:

`DATA GOVERNANCE != OPERATIONAL AUTHORITY`

`SOURCE_VERIFIED != MEASUREMENT_CORRECT != ACCEPTANCE`

`SYNTHETIC != REAL`

`AI OUTPUT != PLANT FACT != ACCEPTANCE EVIDENCE`

`FRAMEWORK READY != VERIFIED REAL PILOT`

Any future project-local skill must encode these boundaries directly rather than relying on generic software-development wording.

## INSTALL PLAN

P3 performs no ECC installation.

Controlled next step:

1. keep the DAILY/LIBRARY classification in the ORBI manifest;
2. materialize exactly one PVMetrics-owned project skill;
3. choose a skill that adds domain-specific value rather than duplicating generic coding guidance;
4. run AgentShield and Product Evolution CI;
5. only after GREEN evaluate a second skill or agent-harness layer.

Recommended P4 first skill:

`pvmetrics-operational-data-review`

Reason: operational data/evidence governance is the most project-specific recurring boundary and the least useful to import verbatim from another ORBI repository.

## VERIFICATION

P3 passes when:

- manifest classification matches this document;
- no product/runtime/operational source changes;
- hooks/MCP/memory/continuous learning remain disabled;
- AgentShield remains report-only;
- Product Evolution CI remains GREEN;
- no accepted security baseline is broadened beyond the P2 evidence.

## RESULT

The initial PVMetrics candidate profile is reduced to a compact DAILY surface, while React, AI evaluation, benchmarking and specialized harness capabilities remain accessible as LIBRARY components.

The next value step is not a larger ECC install. It is a first PVMetrics-owned skill that encodes operational-data and evidence-governance rules.
