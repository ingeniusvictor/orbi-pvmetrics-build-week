# BUILD_WEEK_BASELINE.md

## Verified baseline

- `npm ci`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS
- Frontend architecture: React + TypeScript + Vite
- Runtime model: client-side synthetic demo
- Real SCADA connected: false
- Real BESS control enabled: false
- Real client data used: false
- Production deployment approved: false

## Existing application areas

1. Live photovoltaic and BESS monitoring demo.
2. Forecast demonstrations for daily, weekly, and monthly horizons.
3. PV performance views.
4. Simulated BESS dispatch and commercial analysis.
5. SCADA read-only readiness and signal mapping concepts.
6. Telemetry quality, freshness, trust, and readiness views.
7. Plant-profile and configurator workflows.
8. Reports, export text boxes, demo runbooks, and QA/release panels.
9. Independent-demo preservation and roadmap-freeze documentation.

## Not present in this baseline

- Incident Intelligence Copilot.
- GPT-5.6 runtime analysis.
- OpenAI API integration.
- Real plant, weather, SCADA, or meter ingestion.
- Automated control or telecontrol.

## Sanitization performed

- Removed the root `.env.example` created for Google AI Studio.
- Removed unused Google AI Studio server-side capability metadata.
- Replaced company and plant names used in presets with fictional demo identities.
- Replaced private network examples with IANA documentation address ranges.
- Added public-repository privacy rules.

## Integrity rule

All competition claims must distinguish this baseline from work performed during Build Week.
