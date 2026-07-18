# ORBI PVMetrics IA — OpenAI Build Week Edition

A local-first photovoltaic operations and maintenance demo that turns synthetic plant telemetry into clearer operational decisions.

## Problem addressed

PV and battery incidents rarely arrive as a complete diagnosis. Operators must reconcile alarms, meters, performance expectations, stale signals, conflicting sources, and missing field evidence while avoiding premature root-cause claims. The Incident Intelligence Copilot turns those raw observations into a structured, reviewable assessment without issuing operational commands.

## Current status

This repository contains the sanitized ORBI PVMetrics IA demonstration plus a bounded **Incident Intelligence Copilot** implemented during OpenAI Build Week. Its authoritative assessment runs locally in the browser against four fixed synthetic scenarios. An explicit, optional loopback-only server can request a separate GPT-5.6 advisory interpretation; it cannot alter the deterministic assessment or operate equipment.

**Authoritative runtime:** Deterministic local evidence engine

**Optional supplemental runtime:** Server-side GPT-5.6 Sol advisory interpretation

**Development assistance:** GPT-5.6 Sol and Codex

The deterministic engine must not be represented as GPT-5.6 inference. The pre-Build-Week historical record remains preserved in `BUILD_WEEK_BASELINE.md`, `SANITIZATION_REPORT.md`, `docs/PRE_BUILD_WEEK_DEVELOPMENT_HISTORY.md`, and `src/pvmetrics-standalone/version/pvMetricsVersionRegistry.ts`.

## Pre-existing before OpenAI Build Week

ORBI PVMetrics IA already included:

- the operational dashboard;
- photovoltaic and BESS views;
- daily, weekly, and monthly forecasts;
- reporting and presentation workflows;
- SCADA-readiness and read-only safety concepts;
- plant profiles, signal mapping, telemetry trust, and data-quality scoring;
- local synthetic demo infrastructure with no real SCADA control or client data.

## Built during OpenAI Build Week with GPT-5.6 Sol and Codex

The bounded Build Week contribution is:

- Incident Intelligence Copilot;
- a deterministic local evidence engine behind an `IncidentAnalysisProvider` boundary;
- four fixed synthetic incident scenarios covering PV, BESS, and hybrid visibility conditions;
- explicit separation of facts, hypotheses, conflicts, and missing information;
- confidence, uncertainty, and bounded or non-quantifiable energy-risk handling;
- ordered read-only field-verification guidance and advisory O&M actions;
- a human-review workflow that starts and resets to `pending-review`;
- focused Node test-runner coverage with independent scenario oracles;
- lazy-loaded integration as an independent async application chunk;
- an optional, schema-validated server-side GPT-5.6 advisory interpretation kept separate from the authoritative assessment;
- Build Week documentation and reproducible verification evidence.

No pre-existing dashboard, forecast, BESS, report, SCADA-readiness, or historical capability is represented as newly built during Build Week.

## What the Incident Intelligence Copilot does

For a selected synthetic scenario, the Copilot produces:

- a priority incident and linked raw evidence;
- confirmed facts kept separate from technical hypotheses;
- conflicting evidence and missing information;
- ordered read-only field-verification steps;
- advisory O&M actions that always require human approval;
- confidence, uncertainty, and operational/energy-risk indications;
- an executive summary and explicit human-review state.

## Four fixed synthetic scenarios

1. PV inverter-block derating.
2. Ambiguous PV underperformance.
3. BESS EMS-versus-meter mismatch.
4. Hybrid communication loss and stale data.

Every fixture uses fixed timestamps, fictional `DEMO-*` identifiers, raw observations, synthetic provenance, and read-only evidence sources. No additional or user-supplied scenarios are analyzed in this Build Week version.

## Human-in-the-loop safety model

The deterministic provider cannot approve its own assessment. Every analysis starts at `pending-review`; a human may approve, request changes, or reject it. Rerunning an analysis or changing the selected scenario clears the previous decision and returns the workflow to `pending-review`.

All O&M actions and GPT investigation considerations are advisory and carry `requiresHumanApproval: true`. The feature does not generate switching commands, setpoints, alarm acknowledgements, remote-control actions, telecontrol operations, or unsupported definitive root-cause claims. Human approval of the deterministic assessment does not approve the separate GPT advisory.

## Architecture summary

The Build Week feature is isolated under `src/build-week/incident-copilot/` and loaded with `React.lazy` and `Suspense` as an independent async chunk:

```text
fixed synthetic fixtures
  → scenario validation
  → deterministic evidence rules and stable ranking
  → provider-output validation
  → human-review session state
  → responsive evidence-linked UI

optional explicit request (scenario ID + assessment ID only)
  → loopback Node server reconstructs the fixed scenario
  → deterministic assessment is recomputed and ID-matched
  → GPT-5.6 Sol receives synthetic reference data with no tools
  → strict structured output and local semantic validation
  → separate supplemental advisory panel
```

`IncidentAnalysisProvider` remains the authoritative deterministic boundary. The optional `IncidentAdvisoryProvider` produces a sibling artifact and never writes into `IncidentAssessmentV1`. Normal deterministic operation requires no backend, external API, secret, or credential.

## How GPT-5.6 Sol and Codex were used

GPT-5.6 Sol and Codex assisted the Build Week development process: repository audit, bounded architecture, scenario schema, deterministic reasoning design, UI implementation, test-oracle design, security review, browser QA, and documentation. Separately, the optional loopback advisory mode uses GPT-5.6 Sol at runtime only to summarize the validated deterministic assessment, explain uncertainty, and propose questions or non-operational investigation considerations.

**Authoritative runtime:** Deterministic local evidence engine.

**Optional supplemental runtime:** Server-side GPT-5.6 Sol advisory interpretation. It cannot modify facts, priority, risk, confidence, evidence IDs, calculations, or human review.

**Development assistance:** GPT-5.6 Sol and Codex.

## Privacy and safety

- All demo companies, plants, telemetry, and network addresses are fictional or sanitized.
- No employer, customer, or operational plant data is included.
- No SCADA, meter, weather, CEN, BESS, inverter, or telecontrol connection is active.
- No credentials or API keys are committed.
- Optional advisory requests contain only a fixed synthetic scenario identifier and deterministic assessment identifier; the server reconstructs all reference data.
- `OPENAI_API_KEY` is read only by the loopback Node process. The browser never receives it, and advisory requests use `store: false` with no tools or external retrieval.
- Private data must never be added to this repository.

## Local setup

Requirements:

- Node.js 22 LTS recommended
- npm

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`.

Deterministic mode requires no account, API key, credential, network service, or external data source.

### Optional private GPT-5.6 advisory mode

Advisory mode is optional and binds only to `127.0.0.1`. Supply `OPENAI_API_KEY` to the server process without writing it to a file, then run `npm run dev:advisory`.

PowerShell:

```powershell
$env:OPENAI_API_KEY = [System.Net.NetworkCredential]::new('', (Read-Host -AsSecureString 'OpenAI API key')).Password
npm run dev:advisory
Remove-Item Env:OPENAI_API_KEY
```

POSIX shell:

```bash
read -rs OPENAI_API_KEY
export OPENAI_API_KEY
npm run dev:advisory
unset OPENAI_API_KEY
```

Do not place the key in a Vite variable, `.env` file, shell history, source file, or browser storage. Open `http://127.0.0.1:3000`, run a deterministic assessment, and explicitly select **Generate GPT-5.6 advisory**. Without a key or advisory server, the authoritative deterministic workflow remains fully operational and the advisory panel fails closed with a sanitized message.

**Live API verification status:** `LIVE_API_NOT_RUN`. No real GPT-5.6 API request has been executed or claimed as successful in this repository state; private verification requires a separately supplied server-process credential.

## Judge Quickstart

1. Install Node.js 22 LTS.
2. Run `npm ci`.
3. Run `npm run dev`.
4. Open `http://127.0.0.1:3000`.
5. Select **Incident Copilot — Build Week** in the sidebar.
6. Choose one of the four synthetic scenarios.
7. Run the deterministic analysis.
8. Inspect facts, hypotheses, uncertainty, risk, field checks, evidence links, and advisory actions.
9. Complete a human review using approve, request changes, or reject.
10. Rerun the analysis or change scenario and verify that review returns to `pending-review`.

For an authorized private live-API evaluation, follow the optional advisory-mode procedure above after deterministic behavior is verified. No credential is required for the primary judge walkthrough.

## Test commands

```bash
npm test
npm run lint
npm run build
```

The focused Node test suite validates all four scenarios, deterministic repeatability, evidence references, stable ranking, confidence penalties, bounded risk, advisory-language restrictions, provider output, and review reset behavior.

## Demo walkthrough for judges

Start on the legacy dashboard to establish the pre-existing product context, then open **Incident Copilot — Build Week**. Run the PV derating scenario and follow a fact link to raw evidence. Contrast it with ambiguous PV underperformance to show uncertainty and missing information, then use the hybrid communications scenario to demonstrate stale-data penalties and non-quantifiable energy risk. If live advisory mode has been separately verified and authorized, generate the clearly separated GPT-5.6 advisory and explain that it is supplemental. Finish by approving the deterministic assessment, rerunning it, and showing that both human review and any advisory safely reset.

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Node.js built-in test runner
- Express loopback server for optional local advisory mode
- OpenAI JavaScript SDK imported only by the server-side provider
- GPT-5.6 Sol and Codex for Build Week development assistance

The Incident Copilot async chunk does not import Recharts or the legacy QA, release, or historical surfaces.

## Known limitations

- Authoritative runtime reasoning is deterministic and limited to four fixed synthetic scenarios.
- Optional GPT advisory output is non-authoritative, nondeterministic, and requires both network access and a server-process `OPENAI_API_KEY`; live capability must not be claimed unless separately verified.
- There is no live data ingestion, public backend, authentication, persistence, or equipment control.
- Human-review state is held in browser memory and is not persisted after page reload.
- Energy-risk values are transparent synthetic estimates, not operational forecasts.
- The pre-existing main application bundle remains large; the Build Week feature is separately lazy-loaded.
- Browser smoke coverage is focused on the Build Week workflow and representative legacy dashboard/BESS views, not every historical module.

## Accepted Build Week history

- Sanitized pre-Build-Week baseline: `5cdc9c8dbcae93841f47175141f28e7e9871ba14` — `Pre-Build-Week sanitized baseline`.
- Accepted Incident Copilot implementation: `741138156974eec68836b028e877a36f9af5c9a9` — `Build Week: add deterministic Incident Intelligence Copilot`.
- Final QA and publication readiness: `ec891fb81e760c94dfcf84ca619d1a928023f94f` — `Build Week: prepare final QA and publication readiness`.
- Private evaluation readiness: `ca3f137418029979951ab026fa7ef7b71d6389cb` — `Build Week: prepare private evaluation readiness`.

These commits preserve the distinction between the product that existed before Build Week and the bounded competition feature built during the event.

## Private evaluation delivery model

The authorized Build Week delivery model is:

- a private GitHub repository;
- controlled evaluator access;
- local execution using Node.js 22;
- a public demonstration video without source-code exposure;
- no public web deployment unless separately approved by the owner.

Public source-code publication and public Vercel, Netlify, GitHub Pages, or other web deployment are not authorized by this repository.

## Build Week evidence

Build Week evidence includes:

- a clear record of pre-existing versus Build Week work;
- the immutable sanitized baseline and accepted implementation commits;
- tests and reproducible setup instructions;
- a public demo video under three minutes without source-code exposure;
- the Codex `/feedback` Session ID for the principal development thread.

See `BUILD_WEEK_CHANGELOG.md` for the focused implementation and verification record.

## Intellectual Property and Evaluation Notice

Copyright © 2026 Víctor Marcel León Pacheco / ORBI Ecosystem.
All rights reserved.

This repository and its contents are provided solely for evaluation in OpenAI Build Week.

No permission is granted to copy, redistribute, sublicense, commercialize, sell, publish, create derivative commercial products from, or reuse the software, source code, prompts, architecture, interfaces, reasoning rules, documentation, or associated materials outside the authorized evaluation process.

ORBI PVMetrics IA is proprietary software under active commercial development. This competition repository contains only a sanitized, synthetic, and bounded evaluation edition. It does not contain the complete commercial product, real customer data, production connectors, operational credentials, or future proprietary modules.

Access to this private repository does not transfer ownership or grant an open-source license.

## Attribution

Concept, creative direction, renewable-energy domain expertise, and ORBI Ecosystem: **Víctor M. León**.

Co-design, system architecture, prompts, and QA support: **ChatGPT / OpenAI**.

Build Week implementation workflow: **Codex / OpenAI**.
