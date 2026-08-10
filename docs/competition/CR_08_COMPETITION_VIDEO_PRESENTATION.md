# CR-08 Competition Video Presentation Mode — Implementation and QA Report

Date: 2026-08-10

Repository: ORBI PVMetrics IA

Branch: `competition/ai-climate-recovery-2026`

Reference HEAD: `3c5f008a6b72c41b2d63f71601ff3a9e9f79a3f4`

## A. Outcome

CR-08 is complete and ready for human review. The implementation adds a
deterministic, bilingual Competition Video Presentation Mode without adding
recording, audio, autoplay, network, GPT, operational control, or persistence.

## B. Preflight

- Repository: `C:\ORBI CODEX\orbi-pvmetrics-build-week-codex-ready\orbi-pvmetrics-build-week`.
- Branch: `competition/ai-climate-recovery-2026`.
- Starting HEAD: `3c5f008a6b72c41b2d63f71601ff3a9e9f79a3f4`.
- Upstream: `origin/competition/ai-climate-recovery-2026`.
- Initial divergence: 0 ahead / 0 behind.
- Initial tree: clean; 0 staged, 0 tracked modifications, 0 untracked.
- `package.json` and `package-lock.json`: unchanged.
- Protected master, backup, and frozen tag references were recorded before
  implementation and were not mutated.

## C. Architecture

The new `video/` presentation layer owns only video-coordination state and
copy. It consumes the existing CR-05/CR-07 public presentation contracts and
anchors; it does not import domain engines, registries, fixtures, or services.

Integration is in `ClimateRecoveryView.tsx`. It preserves the pre-video mode,
section, selected plant/case, exact scroll container position, and focus
identity. Product navigation continues through the existing bounded,
abortable Guided Demo coordinator. Competition Video Mode and Case Detail are
lazy boundaries; only the next Case Detail component is prefetched.

State is in memory. The pure reducer supports start, begin, next, previous,
replay, pause/resume, cue/timing toggles, reset, exit, locale, reduced motion,
and navigation status. No wall clock drives presentation state.

## D. Opening

The opening is a static cinematic frame with ORBI PVMetrics IA, Climate
Recovery Edition, the reviewed renewable-loss hook, value proposition, and
visible synthetic/read-only/offline boundaries. `Begin Presentation` is the
only path into the chapter flow; `Exit` restores the captured context. There
is no autoplay. At 360×800 both controls remain in the viewport.

## E. Chapters

| # | Chapter | Product destination | Planned |
|---:|---|---|---:|
| 1 | Opening | Presentation / Overview | 0:20 |
| 2 | Loss Problem | Guided `problem` / Overview | 0:20 |
| 3 | Portfolio Opportunity | Guided `opportunity` / Overview | 0:30 |
| 4 | Prioritization | Guided `ranking` / Overview | 0:35 |
| 5 | Recoverable Case | Aurora `DEMO-CR-CASE-A` | 0:55 |
| 6 | Not Every Loss | Helios `DEMO-CR-CASE-B` plus Valle proof | 0:35 |
| 7 | Explainability & Review | Guided `explainability` / Review | 0:30 |
| 8 | Climate Impact | Aurora `climate-impact` | 0:25 |
| 9 | Closing | Static closing frame | 0:10 |

IDs are unique, order is contiguous, links are reciprocal, Opening has no
Previous, Closing has no Next, and the total is exactly 260 seconds (4:20).

## F. First 90 seconds

- 0:00–0:20: synthetic, read-only, offline opening and explicit Begin.
- 0:20–0:40: explains that not all renewable-energy loss deserves the same
  action; it does not claim live telemetry or a diagnosis.
- 0:40–1:10: shows 129.16 MWh, 47.92 tCO2e, five synthetic assets, fourteen
  cases, and fourteen pending reviews with estimated/counterfactual labels.
- 1:10–1:30 of the prioritization beat: shows the transparent 92.58 internal
  score as an index, never as a probability or certified metric.

Every beat remains bounded by synthetic demonstration, estimated impact,
read-only decision support, and human review.

## G. Full script and timing

Chapter durations are 20, 20, 30, 35, 55, 35, 30, 25, and 10 seconds. The
planned pauses are one second after chapters 1–8 and five seconds at Closing.
The guide displays chapter duration, cumulative planned progress, and the 4:20
target. It deliberately does not measure elapsed wall time. All cut points are
presenter-controlled through explicit buttons or supported keyboard input.

## H. Narration cues

Each chapter provides a suggested phrase, key fact, next action, warning,
pronunciation note, and planned pause in reviewed ES and EN. Cues can be hidden
and restored; hiding removes them from composition and accessibility order.
No speech, audio, synthesis, captions track, microphone, or media API exists.
Visible narration is the local caption/script aid.

## I. Recording controls

Localized semantic controls cover Previous, Next, Replay Chapter,
Pause/Resume guidance, Hide/Show Cues, Hide/Show Timing, Reset Presentation,
Exit Video Mode, and Return to Presentation Mode. Next locks while a target or
Case Detail prefetch is pending; rapid repeated advancement cannot pass the
pending chapter. Closing disables Next. Reset returns directly to Opening and
known Overview state. Exit restores captured context; Return preserves CR-07
Presentation Mode.

## J. Recording-safe layout

The video shell uses a crop-safe margin and a bounded viewport grid. Chapter
content has its own coordinated scroll region while recording controls occupy
a separate non-overlapping row. At 1440×900 the sidebar remains the restrained
72 px presentation rail; at mobile it is removed by the existing presentation
contract. The coordinator, not manual recovery scroll, positions targets.
Essential titles, metrics, units, disclosures, and controls remain reachable.
No browser/OS chrome or cursor simulation was added.

## K. Closing frame

Closing is static, focused, bilingual, and planned for a five-second hold. It
contains Every potentially recovered MWh matters, Explainable AI, Human
review, Estimated climate impact, ORBI Ecosystem SpA, Synthetic demonstration,
the reviewed CTA, and the non-operational decision-support boundary. It does
not claim customers, pilots, deployment, realized recovery, or verified
emissions.

## L. CR-07V corrections

1. Case Detail is prefetched at the preceding chapter/step and Next remains
   pending until that lazy component is ready.
2. Next is locked until the destination is mounted, stable, focused, and
   reported ready; failures expose a localized recovery status.
3. The actual scroll container and exact position are captured and restored;
   focus restoration uses the captured node or its stable remounted ID.
4. The Featured Aurora CTA records Overview as its origin, so Back returns to
   Overview.
5. Reset/return paths declared for Overview navigate there directly without an
   intermediate catalog state.

AbortController cancellation, eight bounded anchor attempts, one corrective
scroll, reduced motion, and existing anchor contracts remain intact.

## M. Localization

All CR-08 opening, chapter, cue, timing, control, status, closing, disclosure,
and accessibility strings resolve in ES and EN. Locale changes retain chapter
and state. Automated checks found no untranslated keys or opening-language
leakage. The second full rehearsal ran entirely in English.

## N. Responsive

| Viewport | Overflow | Controls | h1 | ≥44 px targets | Result |
|---|---|---|---:|---|---|
| 1440×900 | None | Fully visible; no overlap | 1 | Pass | PASS |
| 1280×800 | None | Fully visible; no overlap | 1 | Pass | PASS |
| 1024×768 | None | Fully visible; no overlap | 1 | Pass | PASS |
| 768×1024 | None | Fully visible; no overlap | 1 | Pass | PASS |
| 430×932 | None | Fully visible; no overlap | 1 | Pass | PASS |
| 390×844 | None | Fully visible; no overlap | 1 | Pass | PASS |
| 360×800 | None | Fully visible; no overlap | 1 | Pass | PASS |

The 360×800 opening separately passed with Begin and Exit fully visible.

## O. Accessibility

- Exactly one `h1` is active in Opening, every chapter, and Closing.
- Each guided destination receives focus after mount; Closing focuses its h1.
- Chapter changes and pending/failure states use a polite live region.
- `aria-current="step"`, native disabled states, and `aria-pressed` toggles are
  present.
- Tab/Shift+Tab, Enter/Space, Left/Right, and Escape paths are implemented.
- Browser validation confirmed Right, Left, and Escape restoration with exact
  mode, locale, and scroll; stable focus IDs restore remounted entry controls.
- Touch targets passed at all viewports; no visible control was below 44 px.
- A 720×450 CSS viewport equivalent to representative 200% reflow passed with
  no horizontal overflow, no control overlap, and a usable 171 px content row.
- The live browser environment reported reduced motion inactive. The reduced
  motion implementation and dynamic listener passed automated tests 271–272;
  CSS removes decorative transforms, delays, and material durations.

## P. Performance

| Artifact | CR-07 reference | CR-08 result | Delta |
|---|---:|---:|---:|
| Climate Recovery | 316.15 / 79.73 gzip kB | 344.72 / 87.17 gzip kB | +28.57 / +7.44 |
| Guided Demo | 5.88 / 1.93 gzip kB | 5.77 / 1.91 gzip kB | −0.11 / −0.02 |
| Case Detail | 19.17 / 4.37 gzip kB | 19.17 / 4.37 gzip kB | 0 / 0 |
| Competition Video | n/a | 16.85 / 4.26 gzip kB | new lazy chunk |
| Main entry | exact CR-07 size not recorded here | 3230.01 / 557.34 gzip kB | historical warning remains |
| CSS | not recorded | 130.31 / 19.39 gzip kB | current result |

The video coordinator is independently lazy. Case Detail remains separate.
The existing Vite warning for the legacy main chunk above 500 kB remains and
is not introduced as a new CR-08 runtime dependency.

## Q. Tests

- Historical baseline: 456 tests.
- CR-08 matrix: exactly 84 new tests, numbered 214–297.
- Full command: `npm.cmd test`.
- Final result: 540/540 passed, 0 failed, 0 skipped.
- Duration: 16,629.62 ms.
- Coverage includes contracts, navigation, reset/exit, prefetch/pending lock,
  localization, claims, accessibility, reduced motion, performance boundaries,
  deterministic timing, and prohibited APIs.

## R. Technical QA

| Command | Result |
|---|---|
| `npm.cmd ls --depth=0` | PASS, exit 0 |
| `npm.cmd test` | PASS, exit 0, 540/540 |
| `npm.cmd run lint` | PASS, exit 0 |
| `npm.cmd run build` | PASS, exit 0, 2,566 modules |
| `git diff --check` | PASS, exit 0; Windows LF→CRLF notices only |

Two iterative pre-gate test runs correctly caught temporary scroll/autoplay
contract violations and were fixed. The final prescribed run above is clean.
Build time was 9.83 s. The only build warning is the known legacy main-chunk
size warning.

## S. Visual smoke

All seven required viewports passed Opening/chapter/control layout checks.
There was no page-level horizontal overflow, hidden control, overlay collision,
duplicate h1, or sub-44 px target. Desktop, mobile, opening, product target,
and Closing frames were visually inspected. Browser console warnings/errors:
zero. All declared page resources were same-origin at `127.0.0.1`; external
resources: zero; API-key inputs: zero.

## T. Recording rehearsal

Two consecutive 1440×900 functional rehearsals traversed Opening through
Closing with explicit controls:

- Run 1, ES: nine chapters, all target states `ready`, Closing stable.
- Run 2, EN: nine chapters, all target states `ready`; active focus confirmed
  on `problem`, `opportunity`, `ranking`, Aurora, Helios, explainability,
  climate-impact, and the Closing h1.

Planned narrated duration was 4:20 in both runs. No live elapsed clock was
used. Manual recovery scroll: zero. Lost focus: zero. Hidden controls: zero.
Warnings: zero. Errors: zero. Replay, Previous, Pause/Resume, cue/timing
toggles, keyboard Right/Left, Reset, Return, and Escape were also exercised.
No actual screen/audio recording was created.

## U. Documentation

Created:

- `docs/competition/CR_08_COMPETITION_VIDEO_PRESENTATION.md`.

Updated:

- `README.md`;
- `BUILD_WEEK_CHANGELOG.md`;
- `docs/competition/CLAIMS_REGISTER.md`;
- `docs/competition/CR_08_PREPARATION_PACKAGE.md`.

The documentation distinguishes deterministic explainable assessment from
GPT, keeps every impact statement estimated/synthetic/unverified where
required, and records the recording limitation.

## V. Files

Added (11):

- `docs/competition/CR_08_COMPETITION_VIDEO_PRESENTATION.md`;
- `src/pvmetrics-standalone/components/climate-recovery/video/CinematicOpening.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/CompetitionVideoMode.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/VideoChapterFrame.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/VideoClosingFrame.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/VideoNarrationCue.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/VideoRecordingControls.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/VideoTimingGuide.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/video/competitionVideoContracts.ts`;
- `src/pvmetrics-standalone/components/climate-recovery/video/competitionVideoScript.ts`;
- `src/pvmetrics-standalone/components/climate-recovery/video/index.ts`.

Modified (11):

- `BUILD_WEEK_CHANGELOG.md`;
- `README.md`;
- `docs/competition/CLAIMS_REGISTER.md`;
- `docs/competition/CR_08_PREPARATION_PACKAGE.md`;
- `src/index.css`;
- `src/pvmetrics-standalone/components/climate-recovery/ClimateRecoveryView.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/climateRecoveryDashboard.test.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/demo/GuidedDemoControls.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/demo/GuidedDemoLauncher.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/demo/GuidedDemoShell.tsx`;
- `src/pvmetrics-standalone/components/climate-recovery/demo/useGuidedDemoNavigation.ts`.

Deleted: none. Final handoff target: these 22 files staged, with no unstaged or
untracked files.

## W. Claims

Permitted claims used: synthetic demonstration, deterministic local
assessment, read-only/offline decision support, transparent internal score,
estimated recoverable energy, estimated counterfactual avoided emissions,
explainable evidence, data-quality boundaries, and required human review.

Audit found no claims of real telemetry, customer data, pilots, customers,
deployment, production readiness, realized recovery, verified/prevented
emissions, certification, autonomous decisions, diagnosis, operational order,
dispatch, telecontrol, or market leadership. Remaining concern: final human
narration/editing must preserve the same qualifiers.

## X. Risks and limitations

- This mode is a local visual rehearsal aid, not a recorder or final video.
- Planned timing is not measured elapsed time; narration pace must be rehearsed.
- The live visual browser did not expose a reduced-motion emulation control;
  the inactive environment was inspected and the active path is covered by
  deterministic tests and CSS.
- The historical main-bundle warning above 500 kB remains.
- Final capture, audio, captions, editing, encoding, upload, and submission are
  deliberately outside CR-08 and require separate human work.
- CR-09 may address recording production and broader bundle decomposition only
  under separate authorization.

## Y. Git and approval state

- HEAD remains `3c5f008a6b72c41b2d63f71601ff3a9e9f79a3f4`.
- Branch remains `competition/ai-climate-recovery-2026`.
- Upstream remains 0 ahead / 0 behind because no CR-08 commit exists.
- Final handoff contains only the 22 CR-08 files listed above in staging.
- `package.json` and `package-lock.json` remain unchanged.
- No commit, amend, push, branch, tag, PR, deployment, dependency install,
  persistent Git configuration change, GPT advisory, or external network use
  occurred.
- The local validation Vite server was stopped after browser QA.

## Z. Recommended next step

Review the staged CR-08 diff and this A–Z evidence. If it is approved, provide
separate authorization to create exactly one commit with the planned message:
`feat: add Climate Recovery competition video presentation mode`.

CR-08 COMPETITION VIDEO PRESENTATION MODE READY FOR HUMAN APPROVAL
