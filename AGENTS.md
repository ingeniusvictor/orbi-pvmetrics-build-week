# AGENTS.md — ORBI PVMetrics IA Build Week

## Mission

Use the sanitized pre-Build-Week ORBI PVMetrics IA demo as a base and build a focused **Incident Intelligence Copilot** for OpenAI Build Week.

## Historical boundary

- Read `BUILD_WEEK_BASELINE.md` before editing.
- Distinguish pre-existing work from Build Week work.
- Never claim the full application was built during the event.
- Place new competition functionality in an identifiable bounded area such as `src/build-week/incident-copilot/`, unless a better architecture is reviewed first.
- Maintain a Build Week changelog.

## Product goal

Transform synthetic photovoltaic telemetry and maintenance observations into a traceable incident assessment containing prioritized issue, confirmed evidence, hypotheses, missing information, verification steps, confidence, uncertainty, O&M actions, risk, and executive summary.

## Safety and domain rules

- Never ingest or commit real employer, customer, plant, SCADA, meter, weather, credential, or personal data.
- Use synthetic scenarios only.
- Never implement telecontrol, setpoint changes, BESS/inverter/protection commands, or SCADA acknowledgements.
- Recommendations are advisory and require human review.
- Separate facts, hypotheses, uncertainty, and missing evidence.
- Do not invent a root cause when evidence is insufficient.

## OpenAI and secrets

- Document Codex and GPT-5.6 accurately.
- Any future OpenAI API key must remain server-side and outside Git.
- Do not add runtime API integration until architecture and cost are explicitly approved.
- Preserve a deterministic local demo mode.

## Change discipline

- Inspect first and show a plan before major changes.
- Keep changes small and reviewable.
- Preserve stable pre-existing behavior.
- Do not commit until the user approves the diff.

## Required checks

```bash
npm ci
npm run lint
npm run build
```

Add focused tests for Build Week logic. Report exact commands, exit codes, changed files, test results, and unresolved limitations.
