# ORBI PVMetrics IA — OpenAI Build Week Edition

A local-first photovoltaic operations and maintenance demo that turns synthetic plant telemetry into clearer operational decisions.

## Current status

This repository is the **sanitized pre-Build-Week baseline**. The existing ORBI PVMetrics IA demo compiles and runs, but the competition feature—**Incident Intelligence Copilot**—has not yet been implemented in this baseline.

## Pre-existing work

Before OpenAI Build Week, ORBI PVMetrics IA already included:

- photovoltaic and BESS dashboard views;
- daily, weekly, and monthly forecast demonstrations;
- PV performance and simulated BESS dispatch analysis;
- simulated energy-value views;
- SCADA read-only readiness concepts;
- telemetry trust and data-quality scoring;
- plant profiles, signal mapping, reporting, and presentation workflows;
- an independent local demo boundary with no real SCADA control or client data.

The historical development record is preserved in `docs/PRE_BUILD_WEEK_DEVELOPMENT_HISTORY.md`.

## Build Week scope

During OpenAI Build Week, Codex and GPT-5.6 will be used to design, implement, test, and document a new bounded workflow: **Incident Intelligence Copilot**.

The target workflow will analyze synthetic photovoltaic scenarios and produce:

- a prioritized incident;
- evidence used by the assessment;
- confirmed facts versus hypotheses;
- missing information and recommended verification steps;
- confidence and uncertainty indicators;
- recommended O&M actions;
- an executive incident summary.

No part of the baseline should be represented as newly built during Build Week.

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
- Codex and GPT-5.6 for Build Week engineering workflows

## Build Week evidence

The final submission must include:

- a clear record of pre-existing versus Build Week work;
- commits made during the event;
- tests and reproducible setup instructions;
- a public demo video under three minutes;
- the Codex `/feedback` Session ID for the principal development thread.

## Attribution

Concept, creative direction, renewable-energy domain expertise, and ORBI Ecosystem: **Víctor M. León**.

Co-design, system architecture, prompts, and QA support: **ChatGPT / OpenAI**.

Build Week implementation workflow: **Codex / OpenAI**.
