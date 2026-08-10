# CR-09 Final Submission Freeze Manifest

Status: READY FOR FINAL FREEZE WITH DOCUMENTED LOW-RISK DEBT

Prepared: 2026-08-10

This manifest freezes the technical, documentary, security, privacy, claims,
and recording-readiness evidence for the human approval gate. It adds no
product functionality and does not create a commit, tag, backup branch, push,
deployment, or official recording.

## 1. Product identity

- Product: ORBI PVMetrics IA — Climate Recovery Edition.
- Company: ORBI Ecosystem SpA.
- Edition: AI for Climate Innovation Factory 2026 Competition Edition.
- Repository: ORBI PVMetrics IA.
- Required branch: `competition/ai-climate-recovery-2026`.
- Audited source HEAD: `40e85b18752bc15ef1de67e762f7580e479f1c91`.
- Audited upstream: `origin/competition/ai-climate-recovery-2026`.
- Initial divergence: 0 ahead / 0 behind.
- Initial worktree: 0 staged, 0 unstaged, 0 untracked.

The future CR-09 documentation commit is not part of the audited source ZIP.
The proposed commit message is
`docs: freeze Climate Recovery competition submission`.

## 2. Protected historical references

The following references were read and verified before CR-09 documentation
was created:

- `master`: `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.
- `backup/pvmetrics-build-week-submission`:
  `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.
- Frozen tag `v0.1.0-pvmetrics-build-week-submission-lock`: tag object
  `79e10a4fef888e50117c2be5dba744f620817323`, resolving to
  `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.

CR-09 does not move or modify any of these references.

## 3. Canonical module inventory

| Module | Commit | Purpose and status | Relevant tests | Canonical documentation | Guarantees | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| CR-01 — Climate Recovery Domain Foundation | `658b5341b58e379fed24410de936ec082105d405` | Complete typed contracts, taxonomy, validation, traceability, confidence, and overlap primitives. | 27 current foundation checks in `climateRecovery.test.ts`. | `CR_01_DOMAIN_FOUNDATION.md` | Synthetic/unverified boundaries, provenance, human review, fail-closed validation. | No engine, UI, live data, persistence, network, or operational authority. |
| CR-02 — Deterministic Assessment Engine | `24e051272d6384496c44f9236af3029ef7cb3c20` | Complete deterministic assessment, evidence, priority, recoverability, scenarios, climate impact, recommendations, and trace. | 53 checks in `assessmentEngine.test.ts`. | `CR_02_DETERMINISTIC_ASSESSMENT_ENGINE.md` | Repeatable rules, explicit assumptions, uncertainty, overlap protection, non-binding recommendations. | Not calibrated AI, probability, diagnosis, forecast, certification, or control. |
| CR-03 — Application Service | `dab4fdcc4a56557cff06307fa63c915c2a1726d8` | Complete presentation boundary for summaries, KPIs, cases, timelines, and explainability. | 66 checks in `applicationService.test.ts`. | `CR_03_APPLICATION_SERVICE.md` | Browser-independent deterministic presentation models in ES/EN with preserved provenance. | Four canonical demo cases at this layer; no storage, API, or operational mutation. |
| CR-04 — Synthetic Portfolio | `23eedac49059b2d46601f0ed25f7fd94658de608` | Complete five-plant, fourteen-case synthetic portfolio, ranking, integrity, summaries, and review queue. | 68 current portfolio checks, including later queue-consistency gates. | `CR_04_SYNTHETIC_PORTFOLIO.md` | Fixed timestamp, stable ranking, explicit exclusions, transparent internal score, synthetic factor. | Fictional values only; score is neither scientific nor probabilistic; no real assets. |
| CR-05 — Executive Dashboard | `4bdff68774d4797321139229e7cf2783af3af341` | Complete read-only executive UI for portfolio, plants, cases, charts, and review. | 70 focused dashboard checks at the CR-05 milestone. | `CR_05_EXECUTIVE_DASHBOARD.md` | Consumes public CR-03/CR-04 models; visible estimates, evidence, limits, and human review. | Demonstration UI only; no backend, connection, persistence, or dispatch. |
| CR-06 — Guided Competition Demo | `f05eb05531c774d96c87e624e1eba3e5f535cff5` | Complete Free Explore plus deterministic eight-step Guided Demo and progressive Case Detail. | 59-test suite increase, reaching the 368-test milestone. | `CR_06_GUIDED_DEMO_STORYTELLING.md` | Explicit navigation, bilingual narrative, preserved evidence and limitations, no autoplay. | Presenter-controlled demonstration; not autonomous decision-making. |
| CR-06.1 — Recording Stabilization | `2f903d6984304093e7c10457af80b156f93c63bd` | Complete anchor, focus, cancellable-scroll, mobile-control, and context-restoration stabilization. | 40-test suite increase, reaching the 408-test milestone. | `CR_06_1_GUIDED_DEMO_RECORDING_FIX.md` | Eight explicit anchors, bounded navigation, Exit/Escape restoration, reduced-motion handling. | Recording-oriented behavior is not a guarantee of a final recording. |
| CR-07 — Premium Competition Experience | `483bbe92f02a9fe1d4ea69f9f5001766da3b2d51` | Complete premium hierarchy, Top 3, score ring, charts, lead opportunity, and Presentation Mode. | 48-test suite increase, reaching the 456-test milestone. | `CR_07_PREMIUM_UX_COMPETITION_POLISH.md` | Keeps calculations unchanged; seven viewport families; local in-memory presentation state. | Large pre-existing main bundle remains; no fullscreen or recording capability. |
| CR-08 — Competition Video Presentation Mode | `bc045e716c63be2dc7357a9a3728169405efe598` | Complete nine-chapter, 260-second presenter-controlled competition story. | 84-test suite increase, reaching the 540-test milestone. | `CR_08_COMPETITION_VIDEO_PRESENTATION.md` | Deterministic targets, explicit advance, bilingual cues/timing, stable opening/closing, exact exit restoration. | Does not record, render, encode, upload, narrate, or submit video. |
| CR-08.1 — Final Minor Polish / Freeze Candidate | `40e85b18752bc15ef1de67e762f7580e479f1c91` | Complete residual ES localization, deterministic number formatting, and semantic Escape exit. | 13-test suite increase, reaching 553 tests. | `CR_08_1_FINAL_POLISH_FREEZE_CANDIDATE.md` | Removes visible floating-point artifacts and preserves mode-exit priority without calculation changes. | CR08V-03 remains accepted low-risk polish debt. |

This inventory records existing history; it does not rewrite, squash, amend,
or otherwise modify any module commit.

## 4. Final QA

All commands ran from the repository root on the required branch.

| Check | Exit | Observed duration | Result |
| --- | ---: | ---: | --- |
| `npm.cmd ls --depth=0` | 0 | 2.512 s | PASS; dependency tree resolved with no missing, invalid, or extraneous top-level entry reported. |
| `npm.cmd test` | 0 | 15.602 s wall clock; 14.497 s runner duration | PASS; 553 tests, 0 failures, 0 skips, 0 cancelled, 0 todo. |
| `npm.cmd run lint` | 0 | 11.732 s | PASS; `tsc --noEmit`. |
| `npm.cmd run build` | 0 | 10.421 s; Vite build 8.45 s | PASS; 2,566 modules transformed. |
| `git diff --check` | 0 | 0.102 s | PASS before CR-09 documentation. |

No dependency installation or update was performed.

## 5. Build record

Vite 6.4.3 emitted `index.html`, one CSS asset, and eight JavaScript chunks:

- `log-out-DziUj3xo.js` — 0.40 kB, 0.29 kB gzip.
- `search-check-BoPJAF5-.js` — 0.81 kB, 0.42 kB gzip.
- `GuidedDemoShell-B8im5Lsx.js` — 5.77 kB, 1.91 kB gzip.
- `CompetitionVideoMode-DqF6JXJh.js` — 16.85 kB, 4.26 kB gzip.
- `CaseDetailView-A36Wncz9.js` — 19.19 kB, 4.38 kB gzip.
- `IncidentCopilotView-DBCGX3QM.js` — 76.55 kB, 19.49 kB gzip.
- `ClimateRecoveryView-CK-UZP8P.js` — 346.11 kB, 87.65 kB gzip.
- `index-CUNm9YwY.js` — 3,230.01 kB, 557.35 kB gzip.

The CSS asset is 130.31 kB, 19.39 kB gzip. The existing Vite warning for a
chunk larger than 500 kB remains. It is not new, does not affect the recorded
functional gate, and is classified as non-blocking technical debt. The build
output is ignored and was not staged.

## 6. Dependency audit

The resolved top-level tree contains 19 packages: `@google/genai` 2.10.0,
`@tailwindcss/vite` 4.3.1, `@types/express` 4.17.25, `@types/node` 22.20.0,
`@vitejs/plugin-react` 5.2.0, `autoprefixer` 10.5.2, `dotenv` 17.4.2,
`esbuild` 0.25.12, `express` 4.22.2, `lucide-react` 0.546.0, `motion`
12.42.0, `openai` 6.48.0, `react` 19.2.7, `react-dom` 19.2.7,
`recharts` 3.9.0, `tailwindcss` 4.3.1, `tsx` 4.22.4, `typescript` 5.8.3,
and `vite` 6.4.3.

The Google/OpenAI/Express dependencies belong to repository capabilities
outside the deterministic Climate Recovery runtime. CR-09 added no dependency
and did not modify either package file.

## 7. Visual smoke

The application was started only with the existing Vite command on
`127.0.0.1:3000`; HTTP returned 200. The process was stopped after validation.
No external network, advisory server, tunnel, or deployment was used.

| Viewport | Free Explore | Guided Demo | Presentation Mode | Video opening | Page overflow |
| --- | --- | --- | --- | --- | --- |
| 1440×900 | PASS | 8/8 complete | PASS | 9/9 complete ES and EN | none |
| 1280×800 | PASS | step/control smoke PASS | PASS | PASS | none |
| 1024×768 | PASS | step/control smoke PASS | PASS | PASS | none |
| 768×1024 | PASS | step/control smoke PASS | PASS | PASS | none |
| 430×932 | PASS | step/control smoke PASS | PASS | PASS | none |
| 390×844 | PASS | step/control smoke PASS | PASS | PASS | none |
| 360×800 | PASS | step/control smoke PASS | PASS | PASS | none |

Hero, KPIs, Top 3 and full ranking, featured opportunities, accessible chart
summaries, Case Detail, and the fourteen-item Human Review queue were inspected.
Exit, Escape, Reset, locale switching, visible controls, anchor focus, and
context restoration passed. Browser console result: 0 warnings and 0 errors.

The browser observations support this manifest. Official submission
screenshots were not created and remain `TO CAPTURE` in the evidence index.

## 8. Recording rehearsal

The mandatory 1440×900 rehearsal was completed twice:

- ES: opening plus eight subsequent chapters, closing reached.
- EN: opening plus eight subsequent chapters, closing reached.
- Planned total: 260 seconds / 4:20 in both locales.
- Manual corrective scroll: 0.
- Lost focus: 0; chapter anchors and closing heading received focus.
- Hidden recording controls: 0.
- Browser warnings/errors: 0/0.
- Closing: visible in both locales.
- Synthetic, Estimated, and Human Review language: visible during both flows.

The official competition video was not recorded.

## 9. Synthetic dataset statement

The dataset has a fixed evaluation timestamp of
`2026-08-03T12:00:00.000Z`. It contains five fictional plants and fourteen
fictional cases, uses a configurable fictional emission factor, and includes
no PII, customer record, real coordinate, live telemetry, operational secret,
or production credential.

Plants:

1. Aurora Solar.
2. Helios Norte.
3. Valle Verde.
4. Patagonia Storage.
5. Costa Sur Solar.

The complete case list is frozen in `CR_09_EVIDENCE_INDEX.md`.

Canonical portfolio values are 129.16 MWh estimated recoverable energy,
47.92 tCO2e estimated avoided emissions, and fourteen pending human reviews.
They are deterministic synthetic counterfactual presentation values, not
measured outcomes or verified impact.

## 10. Source audit

The Climate Recovery domain, application, portfolio, UI, Guided Demo, Case
Detail, Presentation Mode, and Competition Video Mode were scanned for network,
storage, nondeterminism, credentials, secrets, databases, providers, and real
data indicators.

Classification:

- Historical matches outside Climate Recovery: the optional Incident Copilot
  advisory documentation/server refers to `OPENAI_API_KEY`, OpenAI, GPT, and
  process environment; `vite.config.ts` reads `DISABLE_HMR`. These are not used
  by Climate Recovery.
- Documentary/test matches: Climate Recovery READMEs, fixture limitations, UI
  disclosures, narration warnings, and source tests explicitly state or assert
  the absence of network, coordinates, customers, credentials, or verified
  impact.
- Legitimate browser mechanics: the Guided Demo coordinator uses DOM focus,
  viewport, animation frame, and bounded scroll APIs. Date/number display uses
  `Intl` and parses fixed ISO fixture timestamps.
- Problematic matches: 0.

No Climate Recovery runtime occurrence was found for `fetch(`, axios,
`XMLHttpRequest`, WebSocket, EventSource, `localStorage`, `sessionStorage`,
`Date.now`, `Math.random`, `OPENAI_API_KEY`, API keys, bearer tokens, hardcoded
credentials, SCADA URLs, database URLs, cloud credentials, or deployment
secrets. The only network-client matches in Climate Recovery test files are
negative assertions that source contains no such client.

## 11. Security and privacy statement

- Strict token/private-key/database-credential signatures: 0 matches.
- Tracked sensitive filenames such as `.env*`, credential files, private keys,
  databases, logs, IDE metadata, or secret files: 0 matches.
- Climate Recovery customer names, real locations, or coordinates: 0.
- `telemetryProfile` is a fictional categorical fixture field; it is not live
  telemetry.
- Operational commands, dispatch, telecontrol, maintenance execution, and
  equipment control: absent.
- Persistence and authentication: absent from Climate Recovery.

## 12. Claims summary

Acceptable claims are frozen in `CR_09_FINAL_CLAIMS_SNAPSHOT.md`. In summary,
the software demonstrates a deterministic, explainable, human-reviewed workflow
over synthetic data. The phrase “Explainable AI” refers to visible rule-derived
hypotheses, evidence, assumptions, limitations, and traceability; it does not
claim a GPT call, network model, statistical calibration, autonomy, or verified
operational outcome.

Climate Opportunity Score is an internal transparent demonstration index. It
is not a calibrated probability, scientific metric, certification, or automatic
maintenance decision.

## 13. Runtime and authority boundaries

- Network required for Climate Recovery: no.
- Credential required for Climate Recovery: no.
- Production status: synthetic competition demonstration; not production.
- Operational authority: none.
- Human authority: retained; recommendations remain non-binding and require
  authorized human review before any real-world action.
- Data persistence: none for Climate Recovery state.
- GPT or external model at Climate Recovery runtime: none.

The repository's separately documented optional Incident Copilot advisory is
outside this Competition Edition flow and was not started or verified in CR-09.

## 14. Known limitations

- All values, cases, plants, factors, and timestamps are synthetic.
- Estimates are counterfactual demonstration outputs and are not measured,
  validated, certified, or verified outcomes.
- Scores and confidence are internal deterministic conventions, not calibrated
  probabilities.
- No official video or submission screenshots have been captured.
- No production ingestion, authentication, persistence, backend integration,
  live SCADA, or control capability exists in Climate Recovery.
- The pre-existing main application bundle exceeds Vite's 500 kB warning
  threshold.
- Application-wide localization outside the bounded Climate Recovery surfaces
  is not asserted.

## 15. Accepted low-risk debt

CR08V-03 remains `ACCEPTED LOW-RISK POLISH DEBT`. A safe correction would
require changing the shared scroll/focus coordinator. The residual polish issue
does not block the 1440×900 recording path, the core workflow, the Competition
Freeze, or this final gate. It was not changed during CR-09.

## 16. Sanitized source backup

- Filename:
  `ORBI_PVMetrics_IA_Climate_Recovery_Competition_Edition_40e85b1_sanitized.zip`.
- Location: outside the repository in the local Codex artifact workspace.
- Source commit: `40e85b18752bc15ef1de67e762f7580e479f1c91`.
- Generation method: `git archive --format=zip` from the exact commit.
- Size: 1,365,660 bytes.
- Archive entries including directory entries: 542.
- Forbidden-name scan inside archive: 0 matches.
- SHA-256:
  `d15038515b6e756ba1837062dccd8b1a8679901e60f7960bb2703ec6c8ffe78f`.

Because the archive is generated from tracked commit content, it excludes the
worktree, `.git`, `node_modules`, `dist`, `.env*`, cache, coverage, logs,
databases, temporary files, unnecessary IDE metadata, secrets, and credentials.
It is intentionally not staged.

## 17. Package hashes

- `package.json` SHA-256:
  `8c98fe5d970aaa2d55fecc6a968105da6c05a1758312abac8c5f199e1d9aee90`.
- `package-lock.json` SHA-256:
  `2b0f4d41b5adef98f5618a05208433ec84ba01c23dfd28e670919b1aebda1f4d`.

The package files were byte-identical to the audited HEAD when hashed and were
not modified by CR-09.

## 18. Documentation references

- `README.md` — product boundary, local use, judge flow, and CR-09 gate pointer.
- `BUILD_WEEK_CHANGELOG.md` — chronological competition record.
- `docs/competition/CLAIMS_REGISTER.md` — controlled current-state claims.
- `docs/competition/CR_01_DOMAIN_FOUNDATION.md` through
  `docs/competition/CR_08_1_FINAL_POLISH_FREEZE_CANDIDATE.md` — module evidence.
- `docs/competition/CR_09_FINAL_CLAIMS_SNAPSHOT.md` — submission claim freeze.
- `docs/competition/CR_09_EVIDENCE_INDEX.md` — reproducible evidence map.

## 19. Freeze instructions and reference plan

Human approval is required before any final reference is created.

1. Review the staged documentary diff and external ZIP checksum.
2. If approved, create one documentation commit using
   `docs: freeze Climate Recovery competition submission`.
3. Re-run the appropriate publication preflight against that new commit.
4. Proposed tag:
   `v0.2.0-pvmetrics-climate-recovery-competition-freeze`.
5. Proposed backup branch:
   `backup/pvmetrics-climate-recovery-competition-submission`.
6. Both references must point to the eventual final CR-09 documentation commit,
   not necessarily to source HEAD `40e85b1`.
7. Do not create either reference or push without separate human authorization.

## 20. Final gate

| Gate | Result |
| --- | --- |
| Critical issues | 0 |
| High issues | 0 |
| Medium blocking issues | 0 |
| Tests | PASS |
| Lint | PASS |
| Build | PASS with existing non-blocking bundle warning |
| Visual smoke | PASS |
| Recording rehearsal | PASS |
| Claims | PASS |
| Security/privacy | PASS |
| Git before CR-09 docs | clean |

Final verdict: **READY FOR FINAL FREEZE WITH DOCUMENTED LOW-RISK DEBT**.

This verdict authorizes human review of the staged documentation only. It does
not authorize a commit, tag, branch, push, deployment, or official recording.
