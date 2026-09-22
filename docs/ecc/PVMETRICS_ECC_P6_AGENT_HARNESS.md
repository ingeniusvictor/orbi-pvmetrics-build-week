# PVM-ECC-P6 — Agent Harness Contract

Status: CONTROLLED / CONTRACT-DEFINED

## Goal

Adapt ECC `agent-harness-construction` into a PVMetrics-specific structured observation and recovery contract.

## Added surfaces

- `.agents/skills/pvmetrics-agent-harness/SKILL.md`
- `.orbi/pvmetrics-agent-observation-v1.schema.json`
- `scripts/validate-pvmetrics-agent-observation.mjs`
- `tests/pvmetricsAgentHarnessContract.test.mjs`

The existing repository test command is extended to include the harness contract test.

## Observation contract

A valid observation contains:

- status;
- summary;
- next actions;
- artifacts;
- evidence;
- explicit authority impact.

Errors additionally require:

- root-cause hint;
- safe retry;
- stop condition.

Unknown top-level fields are rejected to prevent silent contract/capability widening.

## PVMetrics authority separation

Every observation explicitly reports impact on:

- live OT;
- plant commands;
- commissioning acceptance;
- verified-real-pilot state;
- real-data status;
- secrets;
- canonical Git.

The validator does not authorize any of those actions. It validates shape only.

## Non-goals

P6 does not:

- activate an autonomous agent loop;
- enable hooks;
- enable MCP;
- activate memory;
- activate continuous learning;
- call an LLM;
- connect to OT;
- grant write or acceptance authority.

## Tests

P6 tests:

1. valid success observation;
2. fail-closed recovery requirement for errors;
3. valid error observation with recovery;
4. rejection of unknown contract fields;
5. explicit boolean authority-impact fields.

## Exit criteria

- harness tests GREEN;
- full Product Evolution CI GREEN;
- AgentShield report-only has no new finding class;
- product/runtime behavior unchanged.
