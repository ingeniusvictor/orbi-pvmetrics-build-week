# Incident Intelligence Copilot

A bounded Build Week feature for analyzing four fixed synthetic PV and BESS incident scenarios. Its authoritative assessment remains browser-local; a separate loopback-only server can optionally request a supplemental GPT-5.6 interpretation.

**Authoritative runtime:** Deterministic local evidence engine

**Optional supplemental runtime:** Server-side GPT-5.6 Sol advisory interpretation

**Development assistance:** GPT-5.6 Sol and Codex

`IncidentAnalysisProvider` and `IncidentAssessmentV1` remain exclusively deterministic and authoritative. The optional `IncidentAdvisoryProvider` returns a separately validated sibling artifact; GPT output cannot modify the assessment, facts, evidence IDs, calculations, priority, risk, confidence, or review state. Deterministic mode requires no credential and makes no external call.

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
- `advisoryDomain.ts` and `advisoryValidation.ts` define the bounded sibling contract, strict structured-output schema, and local semantic rejection rules.
- `advisoryClient.ts` sends only a fixed scenario ID and deterministic assessment ID to the same-origin loopback route.
- `server/advisoryServer.ts` reconstructs the fixture, recomputes the deterministic assessment, verifies its ID, and binds only to `127.0.0.1`.
- `server/openaiAdvisoryProvider.ts` is the only OpenAI SDK importer; it hardcodes `gpt-5.6-sol`, uses the Responses API with `store: false`, and enables no tools or retrieval.
- `incidentAdvisory.test.ts` exercises the optional path with injected fake transports and never calls the OpenAI network.

The legacy application imports only `IncidentCopilotView.tsx` through `React.lazy`. Incident logic remains inside this directory, and its production code imports neither Recharts nor legacy QA, release, forecast, report, SCADA, or historical modules.

## Fixed synthetic scenarios

1. PV inverter-block derating.
2. Ambiguous PV underperformance.
3. BESS EMS-versus-meter mismatch.
4. Hybrid communication loss and stale data.

Every fixture uses fixed timestamps, fictional `DEMO-*` identifiers, explicit synthetic provenance, read-only source access, and raw observations rather than embedded diagnoses.

## Safety and human authority

Confirmed facts, unconfirmed hypotheses, conflicting evidence, missing information, verification steps, advisory actions, risk, confidence, uncertainty, executive summary, and review state are separate fields. Every deterministic action and GPT investigation consideration has `requiresHumanApproval: true`. Provider output always starts at `pending-review` and cannot approve itself. Rerunning or changing scenario resets review state and reviewer notes and clears any prior GPT advisory.

The feature produces no switching instructions, setpoints, acknowledgement instructions, remote-control actions, SCADA-control instructions, telecontrol operations, or unsupported definitive root-cause claims. GPT structured output is rejected completely if it is malformed, refused, incomplete, references unknown evidence, uses operational or review-state language, or violates any exact safety flag.

## Optional private advisory mode

Run `npm run dev:advisory` with `OPENAI_API_KEY` present only in the Node process environment. The server accepts no prompt, raw scenario body, reviewer note, uploaded file, or arbitrary operational data. All model reference data comes from the four fixed synthetic fixtures and a freshly recomputed deterministic assessment. Inputs and outputs are not logged or persisted.

The optional mode is for controlled private evaluation on `http://127.0.0.1:3000`; public deployment is not authorized. Without the key or server, the deterministic application remains fully functional and the advisory request fails closed with a sanitized message. Live API behavior must not be claimed unless it has been separately verified.

**Live API verification status:** `LIVE_API_NOT_RUN`. Automated advisory tests use an injected fake transport; no real GPT-5.6 API request has been verified in this repository state.
