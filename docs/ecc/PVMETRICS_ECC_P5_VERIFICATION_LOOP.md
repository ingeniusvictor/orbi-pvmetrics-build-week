# PVM-ECC-P5 — PVMetrics Verification Loop

Status: CONTROLLED / SECOND PROJECT SKILL

## Skill

`.agents/skills/pvmetrics-verification-loop/SKILL.md`

## Purpose

Provide a repository-owned completion gate that adapts ECC `verification-loop` and `delivery-gate` to PVMetrics.

The generic ECC workflow is insufficient on its own because PVMetrics must distinguish software readiness from operational/commissioning evidence.

## Key semantics

P5 codifies:

`TESTS GREEN != REAL PLANT VERIFIED`

`BUILD GREEN != OPERATIONALLY ACCEPTED`

`DATA GOVERNANCE VALID != MEASUREMENT CORRECT`

`SOURCE_VERIFIED != COMMISSIONING ACCEPTANCE`

`AI OUTPUT != ACCEPTANCE EVIDENCE`

`FRAMEWORK READY != VERIFIED REAL PILOT`

## Repository gate

The current software gate remains exactly:

```bash
npm ci
npm test
npm run lint
npm run build
```

No coverage threshold, E2E suite or external connector test is invented.

## Relationship with P4

`pvmetrics-operational-data-review` reviews domain-specific data/evidence semantics.

`pvmetrics-verification-loop` is the broader completion/readiness loop and calls for the P4 skill when the changed scope includes operational data.

## Activation

P5 should be used:

- before READY/GREEN claims;
- before phase PR merge;
- before product-evolution handoff;
- after final branch changes;
- when a previously GREEN branch has moved.

It is not operational authority and does not validate a real plant.

## Safety

No runtime dependency.
No OT connection.
No new test implementation.
No hooks, MCP, memory, continuous learning or autonomous loops.

## Exit criteria

P5 passes when:

1. skill is registered;
2. AgentShield has no new finding class;
3. Product Evolution CI is GREEN on the final HEAD;
4. manifest keeps autonomous/stateful ECC features disabled;
5. no product source changes.
