# Incident Intelligence Copilot

A bounded, browser-local Build Week feature for analyzing four fixed synthetic PV and BESS incident scenarios.

**Runtime analysis provider:** Deterministic local evidence engine

**Development assistance:** GPT-5.6 Sol and Codex

The runtime does not perform GPT-5.6 inference. `IncidentAnalysisProvider` is the provider boundary for a possible separately approved implementation; this phase supplies only `deterministicIncidentAnalysisProvider` and has no API key, OpenAI SDK, backend, external call, telemetry, authentication, or operational-control integration.

## Architecture

- `domain.ts` defines the synthetic scenario, evidence, assessment, risk, confidence, action, provider, and human-review contracts.
- `syntheticScenarios.ts` contains exactly four fixed, fictional, read-only scenario fixtures.
- `validation.ts` enforces schema, synthetic-only provenance, read-only sources, evidence-reference integrity, pending review, bounded risk, human approval, and command-language restrictions.
- `reasoningEngine.ts` applies deterministic evidence rules and stable incident tie-breaking.
- `providers.ts` exposes the deterministic provider and truthful runtime/development labels.
- `reviewWorkflow.ts` keeps human decisions outside provider output and resets them after rerun or scenario change.
- `IncidentCopilotView.tsx` presents the responsive workflow and evidence links.
- `expectedScenarioOracles.ts` keeps expected outcomes separate from scenario inputs.
- `incidentCopilot.test.ts` uses the Node test runner without another test framework.

The legacy application imports only `IncidentCopilotView.tsx` through `React.lazy`. Incident logic remains inside this directory, and its production code imports neither Recharts nor legacy QA, release, forecast, report, SCADA, or historical modules.

## Fixed synthetic scenarios

1. PV inverter-block derating.
2. Ambiguous PV underperformance.
3. BESS EMS-versus-meter mismatch.
4. Hybrid communication loss and stale data.

Every fixture uses fixed timestamps, fictional `DEMO-*` identifiers, explicit synthetic provenance, read-only source access, and raw observations rather than embedded diagnoses.

## Safety and human authority

Confirmed facts, unconfirmed hypotheses, conflicting evidence, missing information, verification steps, advisory actions, risk, confidence, uncertainty, executive summary, and review state are separate fields. Every advisory action has `requiresHumanApproval: true`. Provider output always starts at `pending-review` and cannot approve itself. Rerunning or changing scenario resets review state and reviewer notes.

The feature produces no switching instructions, setpoints, acknowledgement instructions, remote-control actions, telecontrol operations, or unsupported definitive root-cause claims.
