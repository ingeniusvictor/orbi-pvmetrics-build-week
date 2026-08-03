# ORBI PVMetrics IA Build Week Baseline Manifest

## Identity and purpose

- Company: ORBI Ecosystem SpA
- Product: ORBI PVMetrics IA
- Baseline: OpenAI Build Week frozen screen-recording snapshot
- Confirmed commit: `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`
- Immutable tag: `v0.1.0-pvmetrics-build-week-submission-lock`
- Backup branch: `backup/pvmetrics-build-week-submission`
- Climate Recovery branch: `competition/ai-climate-recovery-2026`
- Target competition: AI for Climate Innovation Factory 2026
- Category: Renewable Energy Integration and Efficiency

## Human evidence

The owner confirmed that the last recording procedure explicitly required running the frozen demo at commit `e552ec0`. This commit is therefore the official ORBI PVMetrics IA Build Week submission baseline.

## Frozen demo state

The recorded demo was:

- deterministic;
- local;
- credential-free;
- loopback-only;
- run without the optional GPT-5.6 advisory server;
- run without `OPENAI_API_KEY`;
- based on synthetic or sanitized data.

The code contains an optional GPT-5.6 advisory integration, but the advisory server was not started during the frozen recording.

## Architecture and persistence

The baseline uses React 19, TypeScript, Vite 6, Tailwind, Recharts, and an optional Express server. Runtime persistence is limited to `localStorage` and browser memory; there is no remote database.

Real SCADA, EMS/BMS, meters, weather services, and telecontrol are not connected or operational.

## Baseline QA

CR-00B ran the safe validations available in the repository:

- `npm.cmd ls --depth=0`;
- `npm.cmd test`;
- `npm.cmd run lint` (TypeScript `tsc --noEmit`).

All checks passed. A build was not run because CR-00B prohibited writing to `dist`.

## Limitations

- Synthetic or sanitized data only.
- No real authentication.
- No telecontrol.
- No dispatch.
- No remote persistence.
- No live validation of the GPT advisory path.
- Demonstration mode only.

## Immutability and future direction

The tag `v0.1.0-pvmetrics-build-week-submission-lock` and branch `backup/pvmetrics-build-week-submission` must not be used for development or moved from the confirmed commit.

ORBI PVMetrics IA — Climate Recovery Edition will be developed only from `competition/ai-climate-recovery-2026`.
