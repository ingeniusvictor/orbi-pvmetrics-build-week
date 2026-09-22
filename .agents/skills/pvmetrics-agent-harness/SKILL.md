---
name: pvmetrics-agent-harness
description: Design or review PVMetrics agent action spaces, structured observations, recovery, stop conditions and skill routing. Use when creating an agent, tool contract, handoff, structured agent output or bounded automation around PVMetrics.
version: "0.1.0"
license: MIT
metadata:
  origin: ORBI
  upstream_inspiration: ECC agent-harness-construction
  authoritative: false
  runtime_dependency: false
---

# PVMetrics Agent Harness

Use this skill when PVMetrics introduces or changes an agent-like workflow.

The goal is a narrow, observable and reversible action space. A tool/agent success result is evidence of execution, not operational authority.

## Five controlled surfaces

1. action-space quality;
2. observation quality;
3. recovery quality;
4. context-budget quality;
5. PVMetrics authority separation.

## Action-space tiers

### Read-only

Preferred default:

- inspect Git/repository state;
- read contracts/docs;
- inspect CI;
- inspect governed observations/evidence;
- compare commits;
- analyze synthetic fixtures.

### Reversible repository mutation

Examples:

- isolated feature-branch edits;
- tests;
- synthetic fixtures;
- docs/reports.

Require a deterministic diff and rollback path.

### External writes

Examples:

- PR/issue updates;
- approved external project artifacts.

Require explicit task authorization and preserve returned object IDs/evidence.

### Prohibited without separately governed phase

The harness does not grant:

- live OT connectivity;
- plant commands;
- setpoints;
- energization;
- dispatch;
- commissioning acceptance;
- promotion to VERIFIED REAL PILOT;
- secret disclosure;
- canonical Git mutation outside the authorized workflow.

## Structured observation contract

Schema:

`.orbi/pvmetrics-agent-observation-v1.schema.json`

Validator:

```bash
node scripts/validate-pvmetrics-agent-observation.mjs <observation.json>
```

Every observation reports:

- status;
- summary;
- next actions;
- artifacts;
- evidence with verification state;
- explicit authority impact.

Error observations also require:

- root-cause hint;
- safe retry;
- stop condition.

The validator checks shape/consistency only. It is **not** an authorization engine and does not prove evidence is true.

## Authority-impact fields

Every structured observation explicitly reports whether it affected:

- live OT connection;
- plant commands;
- commissioning acceptance;
- verified-real-pilot state;
- real-data status;
- secrets;
- canonical Git.

Do not omit a field to imply “no impact.”

## Recovery

Do not repeat the same failed mutation with the same assumptions.

A safe retry must change at least one of:

- evidence source;
- hypothesis;
- input;
- scope;
- implementation.

Stop when:

- required evidence is unavailable;
- the same root cause repeats without new evidence;
- state is ambiguous;
- the next action would cross an unauthorized OT/data/acceptance boundary.

## Skill routing

Use:

- `pvmetrics-operational-data-review` for provenance/evidence/operational-data work;
- `pvmetrics-verification-loop` before READY/GREEN/merge/handoff claims.

Keep other ECC specialist skills library/on-demand.

## Completion anti-patterns

These alone never prove PVMetrics READY:

- tool returned success;
- PR is mergeable;
- model responded;
- scanner score improved;
- file exists;
- build passed;
- source was labeled real.

Use task-specific evidence and the verification skill.

## Context budget

Do not load every project/library skill for every task.

Keep invariant guidance in `AGENTS.md`; route domain procedures to project skills only when triggered.

## Rollback

P6 engineering harness files can be removed without changing product runtime.
