# CR-09 Final Evidence Index

Status: freeze candidate evidence map

Audited source commit: `40e85b18752bc15ef1de67e762f7580e479f1c91`

## Status legend

- **AVAILABLE** — present in the repository or reproduced during CR-09.
- **TO CAPTURE** — intentionally not yet created; requires the official
  submission capture workflow.
- **NOT APPLICABLE** — outside the bounded Competition Edition or explicitly
  absent by design.

## 1. Automated QA

| Evidence | Status | Location or result |
| --- | --- | --- |
| Dependency tree | AVAILABLE | `npm.cmd ls --depth=0`; exit 0; 19 resolved top-level packages. |
| Full test suite | AVAILABLE | `npm.cmd test`; 553 pass, 0 fail, 0 skip, 0 cancelled, 0 todo. |
| TypeScript lint | AVAILABLE | `npm.cmd run lint`; `tsc --noEmit`; exit 0. |
| Production build | AVAILABLE | `npm.cmd run build`; 2,566 modules; eight JS chunks; exit 0. |
| Whitespace/error check | AVAILABLE | `git diff --check`; exit 0 before CR-09 documentation. |
| Existing bundle warning | AVAILABLE | Vite main-chunk >500 kB warning; documented non-blocking debt. |

Current Climate Recovery test distribution:

- `src/pvmetrics-standalone/climate-recovery/climateRecovery.test.ts` — 27.
- `src/pvmetrics-standalone/climate-recovery/assessmentEngine.test.ts` — 53.
- `src/pvmetrics-standalone/climate-recovery/applicationService.test.ts` — 66.
- `src/pvmetrics-standalone/climate-recovery/portfolio.test.ts` — 68.
- `src/pvmetrics-standalone/components/climate-recovery/climateRecoveryDashboard.test.tsx` — 312.
- Climate Recovery subtotal — 526.
- Other retained repository checks — 27.
- Repository total — 553.

## 2. Demo-flow evidence

| Flow | Status | Evidence |
| --- | --- | --- |
| Free Explore | AVAILABLE | Hero, six-KPI hierarchy, ranking, distributions, quality, featured opportunities, case navigation. |
| Guided Demo | AVAILABLE | Eight explicit steps traversed at 1440×900; step/control smoke at all other required viewports. |
| Presentation Mode | AVAILABLE | Enter/Exit/Escape, reduced chrome, Recording Safe non-guarantee, disclosures retained. |
| Competition Video Mode ES | AVAILABLE | Opening + eight chapters, 4:20 closing reached, explicit advance only. |
| Competition Video Mode EN | AVAILABLE | Opening + eight chapters, 4:20 closing reached, explicit advance only. |
| Case Detail | AVAILABLE | Executive summary, KPIs, recommendation, scenario, climate factor, uncertainty, evidence, methodology, limitations. |
| Human Review queue | AVAILABLE | Fourteen ordered synthetic review items. |
| Official video file | TO CAPTURE | No official recording was made in CR-09. |

## 3. Viewport and visual evidence

| Viewport | Status | Result |
| --- | --- | --- |
| 1440×900 | AVAILABLE | Full ES/EN rehearsal plus all modes; no page overflow. |
| 1280×800 | AVAILABLE | Free/Guided/Presentation/Video smoke; no page overflow. |
| 1024×768 | AVAILABLE | Free/Guided/Presentation/Video smoke; no page overflow. |
| 768×1024 | AVAILABLE | Free/Guided/Presentation/Video smoke; no page overflow. |
| 430×932 | AVAILABLE | Free/Guided/Presentation/Video smoke; no page overflow. |
| 390×844 | AVAILABLE | Free/Guided/Presentation/Video smoke; no page overflow. |
| 360×800 | AVAILABLE | Free/Guided/Presentation/Video smoke; no page overflow. |
| Browser warnings/errors | AVAILABLE | 0/0 after the complete smoke. |
| Official hero screenshot ES | TO CAPTURE | Capture only in the authorized submission session. |
| Official hero screenshot EN | TO CAPTURE | Capture only in the authorized submission session. |
| Official KPI/ranking screenshot | TO CAPTURE | Must retain Synthetic, Estimated, score limitation, and Human Review. |
| Official Case Detail screenshot | TO CAPTURE | Must retain uncertainty, factor limitation, and non-operational boundary. |
| Official closing screenshot ES/EN | TO CAPTURE | Capture from the final approved commit and recording setup. |

No screenshot is claimed as a repository artifact in this index.

## 4. Canonical synthetic plants

All five are **AVAILABLE** in
`src/pvmetrics-standalone/climate-recovery/portfolio/data/syntheticPlants.ts`:

1. `CR04-PLANT-AURORA` — Aurora Solar.
2. `CR04-PLANT-HELIOS` — Helios Norte.
3. `CR04-PLANT-VALLE` — Valle Verde.
4. `CR04-PLANT-PATAGONIA` — Patagonia Storage.
5. `CR04-PLANT-COSTA` — Costa Sur Solar.

## 5. Canonical synthetic cases

All fourteen are **AVAILABLE** in the fixed portfolio registry:

1. `DEMO-CR-CASE-A` — Aurora inverter opportunity — Aurora Solar.
2. `CR04-CASE-SOILING` — Aurora soiling assessment — Aurora Solar.
3. `CR04-CASE-MPPT` — Aurora MPPT review — Aurora Solar.
4. `CR04-CASE-MAINTENANCE-DELAY` — Aurora maintenance delay — Aurora Solar.
5. `DEMO-CR-CASE-B` — Helios grid curtailment — Helios Norte.
6. `CR04-CASE-COMMUNICATIONS` — Helios communications gap — Helios Norte.
7. `CR04-CASE-CLIPPING` — Helios design clipping — Helios Norte.
8. `DEMO-CR-CASE-C` — Valle sensor data gap — Valle Verde.
9. `CR04-CASE-UNDERPERFORMANCE` — Valle underperformance — Valle Verde.
10. `DEMO-CR-CASE-D` — Patagonia overlap review — Patagonia Storage.
11. `CR04-CASE-BESS-OPERATION` — Patagonia BESS strategy — Patagonia Storage.
12. `CR04-CASE-OPERATIONAL-CONFIG` — Patagonia configuration review — Patagonia Storage.
13. `CR04-CASE-THERMAL-DERATING` — Costa Sur thermal context — Costa Sur Solar.
14. `CR04-CASE-INVERTER-HIGH` — Costa Sur inverter review — Costa Sur Solar.

These names are fictional presentation identifiers, not customer or asset data.

## 6. Key values and ranking

| Evidence | Status | Value and boundary |
| --- | --- | --- |
| Evaluation timestamp | AVAILABLE | `2026-08-03T12:00:00.000Z`; fixed synthetic timestamp. |
| Plant count | AVAILABLE | 5 synthetic plants. |
| Case count | AVAILABLE | 14 synthetic cases. |
| Estimated recoverable energy | AVAILABLE | 129.16 MWh; counterfactual synthetic estimate. |
| Estimated avoided emissions | AVAILABLE | 47.92 tCO2e; synthetic, counterfactual, unverified. |
| Synthetic emission factor | AVAILABLE | 0.371 kgCO2e/kWh; fictional and configurable, not official. |
| Pending Human Review | AVAILABLE | 14. |
| Rank 1 | AVAILABLE | Aurora Solar — 92.58, Very High. |
| Rank 2 | AVAILABLE | Costa Sur Solar — 75.25, High. |
| Rank 3 | AVAILABLE | Patagonia Storage — 63.69, High, overlap penalty −5. |
| Rank 4 | AVAILABLE | Valle Verde — 20.90, Low. |
| Rank 5 | AVAILABLE | Helios Norte — 13.51, Minimal. |
| Score meaning | AVAILABLE | Internal transparent demo index; not probability, science, certification, or authority. |

Featured cases are **AVAILABLE** through the portfolio service: Aurora inverter
opportunity, Aurora soiling assessment, Helios grid curtailment, Valle sensor
data gap, Patagonia overlap review, and Costa Sur inverter review.

## 7. Recording flow

| Chapter | Planned duration | Target evidence | Status |
| --- | ---: | --- | --- |
| Opening | 0:20 | Product, edition, synthetic and human-control framing | AVAILABLE |
| Loss problem | 0:20 | Five assets, fourteen cases, no live telemetry claim | AVAILABLE |
| Portfolio opportunity | 0:30 | 129.16 MWh and 47.92 tCO2e with estimated qualifiers | AVAILABLE |
| Prioritization | 0:35 | 92.58 score, Top 3, non-probability boundary | AVAILABLE |
| Recoverable case | 0:55 | Aurora detail, evidence, uncertainty, human approval | AVAILABLE |
| Non-recoverable case | 0:35 | External limitation and no false maintenance claim | AVAILABLE |
| Human review/explainability | 0:30 | Queue, evidence, methodology, retained authority | AVAILABLE |
| Climate context | 0:25 | Synthetic counterfactual factor and estimates | AVAILABLE |
| Closing | 0:10 | Synthetic decision support, Estimated, Human Review | AVAILABLE |
| Total | 4:20 / 260 s | Explicit presenter-controlled flow | AVAILABLE |

The official recorded media, edit project, captions, export, upload, and
submission receipt are all **TO CAPTURE**.

## 8. Source, security, and privacy evidence

| Evidence | Status | Result |
| --- | --- | --- |
| Climate Recovery network-client scan | AVAILABLE | 0 runtime matches; negative assertions only in tests. |
| Browser storage scan | AVAILABLE | 0 `localStorage`, `sessionStorage`, or IndexedDB runtime use. |
| Runtime nondeterminism scan | AVAILABLE | 0 `Date.now` and 0 `Math.random`; fixed ISO timestamps parsed/formatted. |
| Credential/token signature scan | AVAILABLE | 0 strict secret signatures. |
| Tracked sensitive filename scan | AVAILABLE | 0. |
| Real customer/coordinate/telemetry review | AVAILABLE | 0 real records; only explicit negative disclosures and synthetic profile fields. |
| Live SCADA/database/cloud URLs | AVAILABLE | 0 in Climate Recovery. |
| Deployment secrets | NOT APPLICABLE | No deployment was performed or configured by CR-09. |
| Production credential | NOT APPLICABLE | Climate Recovery requires none. |

## 9. Documentation evidence

| Document | Status | Purpose |
| --- | --- | --- |
| `AGENTS.md` | AVAILABLE | Repository safety, history, claims, and approval constraints. |
| `BUILD_WEEK_BASELINE.md` | AVAILABLE | Protected historical boundary. |
| `README.md` | AVAILABLE | Product, setup, runtime, competition, and delivery boundaries. |
| `BUILD_WEEK_CHANGELOG.md` | AVAILABLE | Chronological implementation and verification record. |
| `docs/competition/CLAIMS_REGISTER.md` | AVAILABLE | Current controlled claim set. |
| `CR_01_DOMAIN_FOUNDATION.md` through `CR_08_1_FINAL_POLISH_FREEZE_CANDIDATE.md` | AVAILABLE | Module implementation evidence. |
| `CR_09_FINAL_SUBMISSION_FREEZE_MANIFEST.md` | AVAILABLE | Final gate and artifact manifest. |
| `CR_09_FINAL_CLAIMS_SNAPSHOT.md` | AVAILABLE | Submission claim freeze. |
| `CR_09_EVIDENCE_INDEX.md` | AVAILABLE | This evidence map. |

## 10. Commit evidence

| Module | Commit | Status |
| --- | --- | --- |
| CR-01 | `658b5341b58e379fed24410de936ec082105d405` | AVAILABLE |
| CR-02 | `24e051272d6384496c44f9236af3029ef7cb3c20` | AVAILABLE |
| CR-03 | `dab4fdcc4a56557cff06307fa63c915c2a1726d8` | AVAILABLE |
| CR-04 | `23eedac49059b2d46601f0ed25f7fd94658de608` | AVAILABLE |
| CR-05 | `4bdff68774d4797321139229e7cf2783af3af341` | AVAILABLE |
| CR-06 | `f05eb05531c774d96c87e624e1eba3e5f535cff5` | AVAILABLE |
| CR-06.1 | `2f903d6984304093e7c10457af80b156f93c63bd` | AVAILABLE |
| CR-07 | `483bbe92f02a9fe1d4ea69f9f5001766da3b2d51` | AVAILABLE |
| CR-08 | `bc045e716c63be2dc7357a9a3728169405efe598` | AVAILABLE |
| CR-08.1 | `40e85b18752bc15ef1de67e762f7580e479f1c91` | AVAILABLE |
| Future CR-09 documentation commit | — | TO CAPTURE after human approval |

## 11. Checksums and backup

| Artifact | Status | SHA-256 |
| --- | --- | --- |
| `ORBI_PVMetrics_IA_Climate_Recovery_Competition_Edition_40e85b1_sanitized.zip` | AVAILABLE outside repository; 1,365,660 bytes | `d15038515b6e756ba1837062dccd8b1a8679901e60f7960bb2703ec6c8ffe78f` |
| `package.json` | AVAILABLE | `8c98fe5d970aaa2d55fecc6a968105da6c05a1758312abac8c5f199e1d9aee90` |
| `package-lock.json` | AVAILABLE | `2b0f4d41b5adef98f5618a05208433ec84ba01c23dfd28e670919b1aebda1f4d` |
| Final CR-09 documentation commit hash | TO CAPTURE | Requires human-approved commit. |
| Final tag object/hash | TO CAPTURE | Must not be created before separate approval. |
| Final backup branch hash | TO CAPTURE | Must not be created before separate approval. |

The ZIP was generated with `git archive` from exact source commit `40e85b1`.
Its internal forbidden-name scan returned 0 matches.

## 12. Evidence that is not applicable

- Real customer testimonial or logo: NOT APPLICABLE; none is claimed.
- Production telemetry trace: NOT APPLICABLE; no live connection exists.
- Verified recovery or emissions certificate: NOT APPLICABLE; values are
  synthetic estimates.
- Regulatory approval: NOT APPLICABLE; none is claimed.
- Operational dispatch log: NOT APPLICABLE; the product has no dispatch
  authority.
- GPT/API trace for Climate Recovery: NOT APPLICABLE; the runtime is local and
  deterministic.
- Public deployment URL: NOT APPLICABLE; no deployment is authorized or made.

## 13. Human approval boundary

The evidence package is ready for review. It does not itself authorize the
future CR-09 commit, final tag, backup branch, push, deployment, or official
media capture. Each requires the applicable explicit human approval.
