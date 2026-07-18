# ORBI PVMetrics IA — OpenAI Build Week Edition

A local-first photovoltaic operations and maintenance demo that turns synthetic plant telemetry into clearer operational decisions.

## Current status

This repository contains the sanitized ORBI PVMetrics IA demonstration plus a bounded **Incident Intelligence Copilot** implemented during OpenAI Build Week. The Copilot runs entirely in the browser against four fixed synthetic scenarios. It does not call an external model or service and cannot operate equipment.

**Runtime analysis provider:** Deterministic local evidence engine

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
- Build Week documentation and reproducible verification evidence.

No pre-existing dashboard, forecast, BESS, report, SCADA-readiness, or historical capability is represented as newly built during Build Week.

## Incident Copilot flow

Open **Incident Copilot — Build Week** from the sidebar, choose one of the four synthetic scenarios, inspect the raw observations, and run the deterministic analysis. Evidence links connect each conclusion to its source observation. A human reviewer may approve, request changes, or reject the assessment; selecting another scenario or rerunning always clears that decision and returns the assessment to `pending-review`.

## Privacy and safety

- All demo companies, plants, telemetry, and network addresses are fictional or sanitized.
- No employer, customer, or operational plant data is included.
- No SCADA, meter, weather, CEN, BESS, inverter, or telecontrol connection is active.
- No credentials or API keys are committed.
- Private data must never be added to this repository.

## Local setup

Requirements:

- Node.js 22 LTS recommended
- npm

```bash
npm ci
npm test
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Node.js built-in test runner
- GPT-5.6 Sol and Codex for Build Week development assistance

The Incident Copilot async chunk does not import Recharts or the legacy QA, release, or historical surfaces.

## Build Week evidence

Build Week evidence includes:

- a clear record of pre-existing versus Build Week work;
- the immutable sanitized baseline commit and the pending implementation diff;
- tests and reproducible setup instructions;
- a public demo video under three minutes;
- the Codex `/feedback` Session ID for the principal development thread.

See `BUILD_WEEK_CHANGELOG.md` for the focused implementation and verification record.

## Attribution

Concept, creative direction, renewable-energy domain expertise, and ORBI Ecosystem: **Víctor M. León**.

Co-design, system architecture, prompts, and QA support: **ChatGPT / OpenAI**.

Build Week implementation workflow: **Codex / OpenAI**.
