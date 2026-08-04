# OpenAI Build Week Changelog

## CR-06 Competition Storytelling and Guided Demo Flow

- Resolved the 14/13 human-review discrepancy by making the CR-02 assessment
  review gate canonical for the CR-04 queue; Patagonia BESS is now represented
  consistently in KPI, queue, plant summary, and opportunity presentation.
- Added deterministic Free Explore and eight-step Guided Demo modes with
  bilingual storytelling, Previous/Next/Skip/Exit/Reset controls, keyboard
  navigation, focus management, reduced-motion support, and live announcements.
- Added executive-first Case Detail progressive disclosure and separated
  suppressed or not-recommended actions without removing technical evidence,
  warnings, contradictions, assumptions, methodology, or limitations.
- Completed bounded presentation localization, accessible table captions,
  outer-shell select names, single-h1 semantics, mobile-tab polish, and scoped
  browser-title restoration.
- Lazy-loaded the 4.96 kB Guided Demo shell and 18.86 kB Case Detail renderer;
  the initial Climate Recovery chunk is 290.56 kB (73.26 kB gzip).
- Expanded the repository suite from 309 to 368 passing tests with no new
  dependency or `package-lock.json` change.

## CR-05 Executive Climate Recovery Dashboard

- Added a lazy-loaded, read-only Climate Recovery executive view to the
  existing state-based desktop and mobile navigation.
- Added six executive KPIs, the CR-04 plant ranking, status distributions,
  five-plant and fourteen-case browsing, local filters/sorts, a human-review
  queue, and complete case presentation views.
- Consumed the public CR-03 and CR-04 boundaries at the fixed CR-04 timestamp;
  no React-domain calculation, network, credential, persistence, or operational
  mutation was added.
- Added bounded ES/EN visual copy and 70 CR-05 contract/static-render tests with
  no new dependency or lockfile change.
- Added the CR-05 competition architecture and claims documentation.

## Historical baseline

- Baseline commit: `5cdc9c8dbcae93841f47175141f28e7e9871ba14`
- Commit subject: `Pre-Build-Week sanitized baseline`
- The protected historical evidence files were not modified.

## Incident Intelligence Copilot

Implemented a bounded, deterministic, browser-local incident workflow under `src/build-week/incident-copilot/`.

### Added

- Typed scenario, evidence, assessment, provider, risk, confidence, and human-review contracts.
- Exactly four fixed synthetic PV, BESS, and hybrid incident scenarios.
- Scenario and provider-output validation with synthetic-only, read-only, evidence-reference, risk-bound, approval, and command-language safeguards.
- Deterministic incident reasoning with stable ranking and explicit uncertainty penalties.
- Separate confirmed facts, technical hypotheses, conflicting evidence, missing information, ordered field verification, advisory O&M actions, energy/operational risk, confidence, executive summary, and human-review state.
- Responsive Incident Copilot UI with raw-evidence anchors and visible provider attribution.
- Node test-runner suite with separate expected scenario oracles.

### Integrated

- Added one **Incident Copilot — Build Week** sidebar entry.
- Loaded the feature through `React.lazy` and `Suspense` as an independent production chunk.
- Added `npm test` without adding a test-framework dependency.

### Provider attribution

- Runtime analysis provider: **Deterministic local evidence engine**.
- Development assistance: **GPT-5.6 Sol and Codex**.
- No OpenAI SDK, API key, GPT runtime call, backend, cloud service, telemetry, authentication, or operational-control capability was added.

## Verification evidence

Final local verification on 2026-07-17:

- `npm test`: exit 0; 16 tests passed, 0 failed.
- `npm run lint`: exit 0; TypeScript no-emit check passed.
- `npm run build`: exit 0; 2,475 modules transformed.
- Browser smoke: startup, sidebar navigation, four scenario analyses, evidence links, review transitions and resets, mobile navigation, reload, and return to legacy dashboard/BESS views passed with no console errors.
- Main entry: 555.75 kB gzip, +0.74 kB versus the 555.01 kB baseline.
- Incident Copilot async chunk: 16.39 kB gzip.
- Existing Vite warning remains for the legacy main chunk exceeding 500 kB; the Build Week feature stays separately lazy-loaded.

The implementation changes intentionally remain uncommitted pending separate approval.
