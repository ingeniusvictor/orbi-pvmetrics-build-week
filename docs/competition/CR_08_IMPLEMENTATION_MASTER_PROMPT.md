# CR-08 — Competition Storytelling and Cinematic Presentation Edition

## Master implementation prompt

Paste this complete document into a new Codex task. It is an implementation
instruction, not an implementation artifact. Execute it autonomously only
after the repository owner authorizes CR-08 implementation.

---

## 0. Role, mission, and authorization boundary

You are implementing **CR-08 — Competition Storytelling and Cinematic
Presentation Edition** for ORBI PVMetrics IA. Convert the validated CR-07
Climate Recovery experience into a repeatable, cinematic, recording-safe
competition presentation for a 3–5 minute video. Preserve the deterministic
product and all of its safety disclosures beneath a new presentation layer.

This prompt authorizes the bounded CR-08 implementation, focused tests,
technical QA, local visual smoke testing, recording rehearsal, and required
documentation. It does not authorize publication, deployment, real data,
external services, commit, push, tag, branch creation, PR creation, upload, or
submission.

Do not redesign the module from scratch. Inspect the repository first, reuse
the CR-06/CR-06.1 guided navigation and CR-07 visual system, and isolate the new
video-presentation layer. Do not add domain logic.

Human approval gates are mandatory. When a gate says **STOP**, stop and report;
do not repair, clean, stash, stage, commit, or work around the condition.

## 1. Repository context and immutable references

### Identity

- Company: **ORBI Ecosystem SpA**.
- Product: **ORBI PVMetrics IA**.
- Edition: **Climate Recovery Edition**.
- Competition: **AI for Climate Innovation Factory 2026**.
- Category: **Renewable Energy Integration and Efficiency**.
- Repository directory: `orbi-pvmetrics-build-week`.
- Development branch: `competition/ai-climate-recovery-2026`.
- CR-07 reference HEAD: `483bbe92f02a9fe1d4ea69f9f5001766da3b2d51`.
- Frozen Build Week baseline: `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.
- Immutable baseline tag: `v0.1.0-pvmetrics-build-week-submission-lock`.
- Immutable backup branch: `backup/pvmetrics-build-week-submission`.
- Expected upstream: `origin/competition/ai-climate-recovery-2026`.

Never move or develop on the immutable tag, baseline, or backup branch. Do not
change Git configuration.

### Product baseline

The frozen Build Week demo is deterministic, local, credential-free,
loopback-only, synthetic/sanitized, read-only, and was recorded without the
optional GPT advisory server or `OPENAI_API_KEY`. Climate Recovery development
is an identifiable layer added after that frozen baseline.

The current repository uses React 19, TypeScript, Vite 6, Tailwind, Recharts,
Lucide, and Motion. Do not add, remove, or upgrade dependencies. Do not modify
`package.json` or `package-lock.json`.

### Completed module chain

- **CR-01 — Domain Foundation:** typed synthetic Climate Recovery entities,
  validation, taxonomy, confidence, traceability, and overlap contracts.
- **CR-02 — Deterministic Assessment Engine:** pure deterministic evidence,
  sufficiency, recoverability, energy, priority, recommendation, scenario, and
  climate-impact assessment; no network and no GPT.
- **CR-03 — Application Service:** explicit-timestamp ES/EN presentation
  boundary over CR-02 with typed errors and defensive data handling.
- **CR-04 — Synthetic Portfolio:** five synthetic plants, fourteen cases,
  deterministic ranking, Climate Opportunity Score, overlap handling, and
  human-review queue.
- **CR-05 — Executive Dashboard:** first read-only visual experience with
  overview, plants, opportunities, case detail, review queue, and ES/EN.
- **CR-06 — Guided Demo Storytelling:** controlled eight-step story, Free and
  Guided modes, progressive disclosure, lazy Guided Demo and Case Detail.
- **CR-06.1 — Guided Demo Recording Fix:** bounded anchor coordination, focus,
  responsive visibility, cancellation, context restoration, and recovery.
- **CR-07 — Premium UX and Competition Polish:** premium hero, KPI hierarchy,
  score ring, featured opportunity, leaderboard, restrained motion,
  Presentation Mode, responsive/accessibility polish, and competition QA.

CR-07 validation at the reference HEAD recorded:

- `npm.cmd ls --depth=0`: PASS;
- `npm.cmd test`: PASS, **456/456**;
- `npm.cmd run lint`: PASS;
- `npm.cmd run build`: PASS;
- Climate Recovery chunk: **316.15 kB / 79.73 kB gzip**;
- Guided Demo lazy chunk: **5.88 kB / 1.93 kB gzip**;
- Case Detail lazy chunk: **19.17 kB / 4.37 kB gzip**;
- existing legacy main-chunk warning above 500 kB: known and out of scope;
- CR-07V verdict: **READY WITH MINOR POLISH**.

Treat those results as historical baseline evidence, not as proof that the
current working tree passes. Run the current QA only at the instructed gate.

### Non-negotiable product boundary

All Climate Recovery data and results remain synthetic, estimated where
applicable, local, offline, read-only, deterministic, non-operational, and
human-gated. No real plants, customers, telemetry, credentials, coordinates,
production integrations, dispatch, telecontrol, work orders, or autonomous
decisions exist in this demonstration.

## 2. Mandatory preflight and stop conditions

Before editing anything:

1. Read `AGENTS.md` and `docs/competition/BASELINE_MANIFEST.md` completely.
2. Read this prompt completely.
3. Read `docs/competition/CR_08_PREPARATION_PACKAGE.md` completely.
4. Inspect the relevant CR-01 through CR-07 documentation and current
   implementation paths before proposing changes.
5. Run only read-only Git commands:

   ```powershell
   git branch --show-current
   git rev-parse HEAD
   git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'
   git rev-list --left-right --count 'HEAD...@{upstream}'
   git status --short
   git diff --name-only
   git diff --cached --name-only
   git ls-files --others --exclude-standard
   ```

6. Confirm branch `competition/ai-climate-recovery-2026`.
7. Confirm HEAD `483bbe92f02a9fe1d4ea69f9f5001766da3b2d51`, unless the owner has
   explicitly supplied a newer approved CR-08 starting HEAD in the same task.
8. Confirm upstream is 0 ahead / 0 behind.
9. Confirm no staged files and no tracked modifications.
10. Treat these two documentation files as the only expected pre-existing
    untracked files if they have not yet been committed:
    - `docs/competition/CR_08_PREPARATION_PACKAGE.md`;
    - `docs/competition/CR_08_IMPLEMENTATION_MASTER_PROMPT.md`.
11. Do not delete, clean, stash, restore, stage, or modify either document
    during preflight.

**STOP** if the branch, approved HEAD, upstream parity, staged set, tracked set,
or untracked set differs. Show the exact discrepancy and request human
direction. Do not infer ownership of unexpected changes.

After successful preflight, provide a short implementation plan and an exact
candidate-file list. Keep the plan modular and reviewable. Then implement
without asking routine questions that this prompt already answers.

## 3. Executive objective

Make CR-07 presentation-ready for a credible competition video, targeting
**4:20**, with an acceptable range of **3:45–4:40** and an absolute requested
format of **3–5 minutes**. A judge without prior product knowledge must quickly
understand:

1. renewable-energy losses are not equally recoverable, measurable, or urgent;
2. ORBI PVMetrics IA prioritizes synthetic opportunities;
3. the Climate Opportunity Score is an explainable index, not a probability;
4. evidence, uncertainty, blocked values, and human review constrain every
   recommendation;
5. the product is commercially coherent without being represented as deployed
   or operational.

CR-08 changes presentation, attention, pacing, cues, framing, and recovery. It
must not add or change domain calculations, data, cases, ranking, scores,
metrics, or outcomes.

## 4. Problem to solve

CR-07 is a strong interactive experience, but a 3–5 minute competition video
needs a controlled audiovisual story:

- value must be clear in the first five seconds;
- the first 90 seconds must work as a complete miniature pitch;
- screens need cinematic framing without decorative excess;
- presenter rhythm needs explicit beats, pauses, and cut points;
- the transition from overview to lazy Case Detail must be recording-safe;
- exits, reset, replay, and wrong-click recovery must be deterministic;
- the closing must hold on a stable, branded, honest call to action;
- the user must control every advance; autoplay is not required or permitted as
  the only path.

## 5. Exact CR-08 scope

Implement only the following bounded capabilities:

- an optional **Competition Video Mode** within Climate Recovery;
- a cinematic but restrained opening composition;
- a title card with product, edition, value proposition, and disclosures;
- nine video chapters mapped onto the existing product and guided story;
- controlled chapter transitions;
- presentation framing and one clear visual focus per beat;
- optional, non-intrusive presenter/narration cues;
- optional timing guidance based on chapter state;
- recording-safe layout and safe-area treatment;
- a defined opening sequence and closing sequence;
- a final competition-compatible call to action;
- bilingual presenter notes;
- rehearsal controls and recovery paths;
- safe, deterministic reset;
- compatibility with Free Explore, Guided Demo, and Presentation Mode;
- exact context restoration on exit;
- the three mandatory CR-07V navigation fixes in section 20;
- focused tests, technical QA, visual smoke, rehearsal, and documentation.

Reuse service-provided portfolio, ranking, case, review, scenario, and chart
data. Do not duplicate or recalculate them in the UI.

## 6. Explicitly out of scope

Do not implement or change:

- backend or server behavior;
- domain contracts, calculations, climate factors, scoring, ranking, fixtures,
  plant count, cases, metrics, timestamps, or expected results;
- GPT, advisory integration, OpenAI calls, other APIs, fetches, sockets, or any
  external network access;
- real data, customers, authentication, authorization, credentials, telemetry,
  SCADA, EMS/BMS, maintenance systems, coordinates, or production connections;
- telecontrol, dispatch, setpoints, approvals, work orders, or operational
  controls;
- deployment, publishing, upload, analytics, remote storage, or persistence;
- new dependencies or lockfile changes;
- automatic Fullscreen API calls or permission prompts;
- mandatory autoplay or autonomous chapter advance;
- automatic screen, camera, microphone, or browser recording;
- generated voice, audio, music, or video inside the app;
- recording software control;
- broad redesign outside Climate Recovery;
- CR-09 implementation.

## 7. Non-negotiable design and safety principles

- Never hide or crop **Synthetic**, **Estimated**, **Human Review**, read-only,
  offline, unavailable, blocked, counterfactual, or unverified disclosures.
- Do not modify current results or introduce new claims.
- Do not transform unavailable or blocked values into zero.
- Do not call the Climate Opportunity Score a probability, prediction,
  accuracy measure, certified score, or guarantee.
- Human control is visible at every decision boundary.
- Competition Video Mode is optional, escapable, replayable, and resettable.
- Every navigation action comes from explicit user input.
- Reduced motion removes decorative movement without removing information or
  navigation.
- Preserve keyboard, screen-reader, touch, zoom, and focus usability.
- State is in component memory only; no persistence.
- Do not use `localStorage`, `sessionStorage`, IndexedDB, cookies, or URL state.
- Do not use `Date.now()`, `new Date()` as a state clock, random values, or
  import-time timestamps. Use fixed metadata timestamps only for product data.
- Do not introduce permanent timers, polling, loops, or background work.
- Remain completely offline after the local app is loaded.

## 8. Architecture adapted to the real repository

The current bounded UI root is:

```text
src/pvmetrics-standalone/components/climate-recovery/
├── ClimateRecoveryView.tsx
├── copy.ts
├── presentationLocalization.ts
├── cases/
├── demo/
├── hooks/
├── overview/
├── plants/
├── review/
└── shared/
```

Add an isolated CR-08 layer under the same bounded component area:

```text
src/pvmetrics-standalone/components/climate-recovery/video/
├── CompetitionVideoMode.tsx
├── CinematicOpening.tsx
├── VideoChapterFrame.tsx
├── VideoNarrationCue.tsx
├── VideoTimingGuide.tsx
├── VideoRecordingControls.tsx
├── VideoClosingFrame.tsx
├── competitionVideoScript.ts
├── competitionVideoContracts.ts
└── index.ts
```

This structure is suggested, not a command to create empty abstractions. Adapt
names only when the inspected repository makes another split materially
clearer. Keep the layer isolated and preserve the existing `demo/` engine as
the navigation authority. Do not create a second competing product-data state
machine. A thin video chapter coordinator may map chapters to existing modes,
sections, guided steps, plants, cases, and anchors.

Expected integration points are bounded changes to:

- `ClimateRecoveryView.tsx` for mode composition and context orchestration;
- `copy.ts` and/or a dedicated typed video copy registry for ES/EN;
- `demo/useGuidedDemoNavigation.ts` for the CR-07V fixes where needed;
- `hooks/useClimateRecoveryDemo.ts` only for exact origin restoration if the
  current public UI adapter cannot express it;
- centralized Climate Recovery styles in the existing stylesheet;
- the existing dashboard test file and focused new CR-08 tests;
- competition documentation listed in section 29.

Do not move domain or service code into components. Do not create duplicate
charts. Prefer lazy-loading the new CR-08 presentation layer if that avoids
inflating the default Climate Recovery path.

## 9. Required typed contracts

Define at least these contracts in `competitionVideoContracts.ts`, using the
repository's real locale, section, guided-step, case, and plant types where
safe. Do not replace precise unions with arbitrary strings.

```ts
export type CompetitionVideoChapter = {
  id: string;
  order: number;
  titleKey: CompetitionVideoTextKey;
  subtitleKey: CompetitionVideoTextKey;
  narrationKey: CompetitionVideoTextKey;
  targetMode: 'presentation' | 'guided';
  targetSection: ClimateRecoverySection;
  targetStepId?: string;
  targetCaseId?: string;
  durationSeconds: number;
  pauseAfterSeconds: number;
  cameraFocus: CompetitionVideoCameraFocus;
  presenterCue: CompetitionVideoTextKey;
  visualEmphasis: CompetitionVideoEmphasis;
  disclosureRequired: readonly CompetitionVideoDisclosure[];
  allowSkip: boolean;
  allowReplay: boolean;
  nextChapterId?: string;
  previousChapterId?: string;
};

export type CompetitionVideoState = {
  active: boolean;
  currentChapterId: string;
  completedChapterIds: string[];
  locale: ClimateRecoveryLocale;
  narrationVisible: boolean;
  timingGuideVisible: boolean;
  recordingSafe: boolean;
  reducedMotion: boolean;
  modeBeforeVideo: 'free' | 'guided' | 'presentation';
  sectionBeforeVideo: ClimateRecoverySection;
  selectedCaseBeforeVideo?: string;
  selectedPlantBeforeVideo?: string;
  scrollBeforeVideo: number;
};
```

Also define narrow types for:

- `CompetitionVideoTextKey`;
- `CompetitionVideoCameraFocus`;
- `CompetitionVideoEmphasis`;
- `CompetitionVideoDisclosure`;
- navigation status: idle, pending, ready, failed, paused;
- presenter cue kinds: phrase, pause, action, fact, warning, pronunciation;
- deterministic actions: start, next, previous, replay, pause/resume, toggle
  cues, toggle timing, reset, exit, return-to-presentation.

Contract rules:

- chapter order and links are static, validated, and deterministic;
- copy is addressed by typed keys, never embedded as mixed-language runtime
  fragments;
- all state transitions are pure functions where practical;
- arrays returned from public helpers do not expose mutable registries;
- no `Date.now()`, random IDs, system-time deltas, or persistence;
- duration is guidance metadata, not an autoplay trigger;
- `scrollBeforeVideo` captures the exact active scroll container position, not
  an estimated offset.

## 10. Narrative chapter registry

Create exactly this ordered nine-chapter story, adapting target IDs to the
existing guided registry rather than duplicating content:

1. **Opening** — product, edition, scope, and problem hook.
2. **The Renewable-Energy Loss Problem** — five synthetic assets, fourteen
   deterministic cases, unequal recoverability.
3. **Portfolio Opportunity** — 129.16 MWh and 47.92 tCO2e estimated values.
4. **Prioritization** — 92.58 score, Very High band, Top 3, overlap penalty,
   full-ranking integrity.
5. **Recoverable Case** — Aurora inverter, 9.8 MWh, 3.64 tCO2e, 59% confidence,
   evidence, scenario, read-only next step.
6. **Not Every Loss Is Recoverable** — Helios non-recoverable plus Valle Verde
   insufficient evidence and blocked impact.
7. **Explainability and Human Review** — fourteen pending reviews,
   methodology, evidence gaps, suppressed actions, operator authority.
8. **Climate Impact** — synthetic counterfactual scenario, estimated and
   unverified impact.
9. **Closing** — value proposition, company, safety boundary, and call to
   action.

Validate uniqueness, contiguous order, bidirectional links, valid targets,
positive durations, non-negative pauses, required disclosures, and locale
coverage. The total target duration should be 260 seconds, with a tolerance
configuration that describes 225–280 seconds without causing auto-advance.

## 11. Exact first-90-seconds strategy

Implement and document these six controlled beats. Copy may be polished for
fit, but facts and qualifiers must not weaken.

| Time | Screen | Copy / narration | Focus | Transition | Emotional objective | Risk to avoid |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0–10 s | Cinematic opening into premium hero | “Renewable-energy losses are not equally recoverable.” / “Las pérdidas de energía renovable no son igualmente recuperables.” | Centered product and hook; no pointer movement | One restrained opacity reveal, then live hero | Urgency and relevance | Staying on a title card too long; hiding Synthetic |
| 10–20 s | Hero scope and disclosure | Five synthetic plants, fourteen deterministic cases; fully local, read-only, offline | Synthetic Executive Demonstration, scope badges, portfolio statement | Controlled focus shift, no cut away | Credibility and scale | Implying real plants, customers, or live data |
| 20–35 s | Enter Competition Video/Presentation framing and KPI overview | Recover energy, reduce potential avoidable emissions, prioritize with explainable intelligence | Visible mode action, then energy and emissions cards | User-triggered chapter change | Product promise and momentum | Fullscreen request, autoplay, or hidden Recording Safe boundary |
| 35–50 s | Score and headline numbers | 129.16 MWh estimated recoverable; 47.92 tCO2e estimated avoided; 92.58 Very High score | Energy, emissions, then score ring | One target-ready navigation | Quantified opportunity | Calling estimates measured or score a probability |
| 50–70 s | Top 3 and complete ranking integrity | Aurora, Costa Sur, Patagonia; overlap penalty visible; Valle Verde and Helios not hidden | Rank, plant, score, energy, penalty | Controlled anchor focus | Confidence in prioritization | Hiding lower-ranked, unavailable, or conservative adjustments |
| 70–90 s | Featured Aurora opportunity and control boundary | 9.8 MWh, 3.64 tCO2e, 59% confidence; read-only next step; human review required | Featured card followed by Human Review | Prefetched/gated case-ready transition cue | Curiosity and responsible action | Navigating before target mounts; implying autonomous action |

At second 90, remain on a product screen. The narrative question is: **How
does the system know when not to recommend recovery?** The next chapters answer
it.

## 12. Full 3–5 minute implementation script

Encode this as static bilingual chapter/beat metadata and document it. Do not
implement audio. Each move is presenter-controlled. “Cut point” means a safe
place for editing or shortening, not an in-app recording feature.

| Time | Chapter | Screen / presenter action | Narrative and pause | Disclosure | Transition / cut point |
| --- | --- | --- | --- | --- | --- |
| 0–10 | Opening | Start mode; leave pointer still; reveal opening and hero | State problem and product; 1 s pause | Synthetic Executive Demonstration | 260 ms max opacity; cut after hook |
| 10–20 | Opening | Hold hero badges and scope | Five synthetic plants, fourteen deterministic cases; local/read-only/offline | Synthetic, read-only, offline | Next only on user input |
| 20–30 | Loss Problem | Choose Begin Presentation | Explain reduced-chrome recording framing | Recording Safe is visual only | Mode transition; cut after stable frame |
| 30–40 | Portfolio | Advance to KPI target | Read 129.16 MWh and 47.92 tCO2e with units; 1 s pause | Estimated, counterfactual | Focus energy then emissions |
| 40–50 | Prioritization | Advance to score | Explain 92.58, Very High, Aurora | Not probability or certified | Stable score; no count-up |
| 50–60 | Portfolio | Show supporting KPIs | Five assets, fourteen cases, fourteen reviews | Synthetic, Human Review | Cut after totals |
| 60–70 | Prioritization | Show Top 3 | Aurora, Costa Sur, Patagonia | Estimated values | Top-to-bottom focus |
| 70–80 | Prioritization | Hold full-ranking context | Explain Patagonia overlap penalty and visible low-ranked plants | Conservative aggregation | Cut after penalty explanation |
| 80–90 | Recoverable Case | Focus featured Aurora card | 9.8 MWh, 3.64 tCO2e, 59% confidence | Estimated, Human Review | Case prefetch already initiated |
| 90–100 | Recoverable Case | Hold next-step panel | Read-only review; operator decides | Non-operational | Next locked until ready |
| 100–110 | Recoverable Case | Open case after ready state | Move from portfolio signal to evidence | Synthetic case | Case transition under 300 ms excluding load |
| 110–120 | Recoverable Case | Focus metrics | Estimate, confidence, sufficiency, priority | Estimated, confidence not certainty | Cut after metrics |
| 120–130 | Recoverable Case | Focus evidence/hypothesis | Explain why result is traceable and unconfirmed | Human Review, hypothesis | Pause 1 s |
| 130–140 | Recoverable Case | Focus scenario chart | Compare without/with approved intervention | Counterfactual, unverified | Do not duplicate chart |
| 140–150 | Not Every Loss | Navigate to Helios | Grid curtailment is non-recoverable through asset maintenance | Non-recoverable | Stable badge and rationale |
| 150–160 | Not Every Loss | Focus suppressed action | Product declines an inappropriate recovery action | Read-only, non-operational | Cut after suppression proof |
| 160–170 | Not Every Loss | Navigate to Valle Verde | Evidence insufficiency; do not force a result | Insufficient data | Stable warning |
| 170–180 | Not Every Loss | Focus blocked impact | Blocked is not zero; request more data | Blocked/unavailable | Cut after request-more-data cue |
| 180–190 | Explainability | Navigate to review queue | Fourteen pending reviews, deterministic ordering | Human Review | Focus heading and first items |
| 190–200 | Explainability | Focus one queue item | Review reason, evidence gap, urgency | Synthetic | Avoid dense scrolling |
| 200–210 | Explainability | Focus methodology | Score, evidence, limitations, operator authority | Non-probability, Human Review | Cut after authority statement |
| 210–220 | Climate Impact | Return to Climate Recovery overview/step | Reframe case insight at portfolio level | Estimated | Existing guided target |
| 220–230 | Climate Impact | Hold scenario/impact | Synthetic, counterfactual, unverified climate impact | Estimated, unverified | Pause 1 s |
| 230–240 | Climate Impact | Hold clean overview | Prioritization, explainability, human-controlled action | Decision support | Safe shortening point |
| 240–250 | Closing | Advance to closing composition | “Prioritize the right opportunity. Explain why. Keep humans in control.” | Synthetic decision support | 260 ms max opacity |
| 250–260 | Closing | Hold final slate; pointer still | Company and non-operational boundary; silence last 2 s | Synthetic demonstration | Hold at least 5 s; final cut |

If competition rules demand a shorter result, shorten detailed evidence at
110–130 and 190–210 first. Never remove safety disclosures, the three contrast
outcomes, the human-control boundary, or the closing hold.

## 13. Cinematic opening specification

Build a premium opening using existing CR-07 tokens, typography, gradient
language, and restrained motion. It must contain:

- `ORBI PVMetrics IA`;
- `Climate Recovery Edition`;
- the value proposition: prioritize renewable-energy recovery opportunities,
  explain why, and keep humans in control;
- **Synthetic Executive Demonstration**;
- **Read-only**;
- **Offline / No network**;
- a clear **Begin Presentation** CTA in EN and equivalent ES copy;
- an accessible exit/back path before starting.

The opening may be an in-app title composition but not a fake video player. It
must not imply customers, pilots, deployment, real-time operation, or verified
impact. Do not request fullscreen. Do not begin chapter navigation until the
presenter activates the CTA. The default focus lands on the opening heading;
the CTA comes next in logical tab order.

## 14. Chapter transition specification

Use only restrained, navigation-driven transitions:

- feedback: approximately 170 ms;
- standard: approximately 210 ms;
- panel or opening/closing reveal: no more than 260 ms;
- never exceed 300 ms except actual lazy-load waiting;
- one existing easing curve;
- no loops, particles, parallax, bounce, pulse, count-up, spinning score,
  animated background, 3D chart, or celebratory effect;
- never crossfade away a required disclosure;
- never transition before the target is mounted and stable;
- cancel obsolete navigation when direction changes;
- show an accessible failure/recovery message if a target cannot mount.

Each transition may show chapter number, short title, and one-line subtitle,
then reveal the real product target. Do not create lengthy interstitials.

Reduced-motion fallback changes state immediately, removes transforms, smooth
scrolling, stagger, and decorative opacity sequencing, preserves focus and live
announcements, and never delays interaction.

## 15. Narration cue specification

Implement visible text cues only—never speech, audio, synthesis, recording, or
browser media APIs. Cues are optional, unobtrusive, hideable, localized, and
positioned outside the intended capture-safe region where possible.

Each chapter can provide:

- **Presenter cue:** what to do now;
- **Suggested phrase:** concise, claim-approved narration;
- **Pause:** recommended silent hold in seconds;
- **Next action:** explicit button/target action;
- **Key fact:** the one number or truth to emphasize;
- **Warning:** a claim or UI risk to avoid;
- **Pronunciation note:** optional for MWh, tCO2e, counterfactual,
  explainability, Aurora, Patagonia, Helios, and Valle Verde.

Cue rules:

- no hidden disclosures under the cue panel;
- no focus trap;
- no live-region announcement for every passive cue change;
- show/hide state is in memory and deterministic;
- hiding cues expands no essential product content into an unsafe crop;
- copy remains semantically equivalent in ES and EN;
- the suggested phrase is a guide, not a new product claim.

## 16. Optional timing guide

Provide a hideable visual guide, not an automatic clock:

- no autoplay and no automatic chapter advance;
- no system-time dependency and no `Date.now()`;
- use static chapter duration, accumulated completed-chapter durations, current
  chapter number, and target total to display planned progress;
- a presenter-controlled Pause may mark the presentation as paused but must not
  measure real elapsed wall time;
- labels include planned chapter duration, planned cumulative time, and target
  total;
- if a live elapsed timer cannot be implemented without forbidden clock state,
  do not implement one;
- the guide can be hidden before final recording and stays hidden until the
  user shows it again or performs a deterministic reset;
- hiding the guide removes it from the capture composition and accessibility
  order; the toggle remains reachable in the controls.

## 17. Recording and rehearsal controls

Provide semantic buttons with localized accessible names:

- Previous;
- Next;
- Replay Chapter;
- Pause / Resume presentation guidance;
- Hide Cues / Show Cues;
- Hide Timing / Show Timing;
- Reset Presentation;
- Exit Video Mode;
- Return to Presentation Mode.

Rules:

- these control presentation state only;
- do not create operational controls;
- disable Previous on the first chapter and Next on the final chapter;
- disable navigation while the target is pending;
- `aria-pressed` represents toggles; `aria-disabled`/native disabled represents
  blocked navigation;
- Replay reruns the current presentation framing without mutating product data;
- Pause does not freeze the application or start/stop media;
- Reset returns to Opening, clears completed chapters, resets cue/timing
  defaults, restores known Overview state, and remains deterministic;
- Exit restores the exact pre-video mode, section, selection, focus, and scroll;
- Return to Presentation Mode exits only the video coordinator and preserves
  the existing CR-07 presentation layout.

Keyboard support: Tab/Shift+Tab, Enter/Space, Left/Right where not inside an
interactive control, and Escape. Escape exits Competition Video Mode after
restoring state; it must not close the entire application.

## 18. Recording-safe layout

Design for a primary **16:9, 1920×1080 final recording**, rehearsed in a
**1440×900 browser viewport**. The app viewport is 16:10, so keep essential
content inside a 16:9-safe internal composition when Recording Safe is active.

- preserve at least 48 px around essential text at 1440×900;
- identify the 16:9 crop-safe area without a destructive overlay;
- keep title, headline metric, units, required disclosures, and active controls
  inside the safe area;
- maintain crisp, readable typography after 1920×1080 encoding;
- preserve the CR-07 72 px desktop sidebar rail where the shell uses it, or
  reduce nonessential chrome through existing Presentation Mode behavior;
- do not hide the controls required to recover or exit;
- do not add browser or OS chrome simulations;
- ensure the intended cursor path moves only immediately before a click and
  rests in empty space during narration;
- avoid manual scroll throughout the primary 1440×900 rehearsal;
- never place a destructive overlay over charts, labels, or disclosures;
- prevent page-level horizontal overflow;
- preserve visible keyboard focus and at least 44×44 px touch targets.

## 19. Closing frame

The final frame must be static, stable, accessible, bilingual, and held for at
least five planned seconds. It must communicate:

- `Every potentially recovered MWh matters.` / an equivalent reviewed Spanish
  translation;
- `Explainable AI.`;
- `Human review.`;
- `Estimated climate impact.`;
- `ORBI Ecosystem SpA.`;
- `Synthetic demonstration.`;
- `Prioritize the right opportunity. Explain why. Keep humans in control.`;
- `Synthetic decision-support demonstration — not an operational order.`

Use **Explainable AI** as competition framing while accurately stating in cues
and documentation that this demonstration's Climate Recovery assessment is
deterministic and makes no GPT or external API call. Do not claim pilots,
customers, adoption, deployment, production readiness, realized recovery,
verified emissions, certification, regulatory approval, or market leadership.

## 20. Mandatory CR-07V minor corrections

These are acceptance requirements, not optional polish:

1. **Prefetch Case Detail before its chapter/step.** Start the existing lazy
   import early enough that the Aurora case target is normally mounted when the
   presenter advances. Do not preload all fourteen case details or duplicate
   data queries.
2. **Lock Next while navigation is pending.** The control remains disabled from
   activation until the destination anchor is mounted, stable, focused, and the
   coordinator reports ready/success. Prevent rapid double advancement. Expose
   a localized accessible pending state and deterministic recovery on failure.
3. **Restore exact scroll.** Capture the actual scroll container and exact
   position before video/guided entry; restore after state and target mount,
   then restore focus without causing a second scroll.
4. **Restore Featured CTA origin.** Opening Aurora from the Featured
   Opportunity on Overview records `overview` as the origin. Back returns to
   that Overview context, not unconditionally to Opportunities.
5. **Return directly to Overview where appropriate.** Exit/reset flows whose
   declared destination is Overview must not briefly route through the catalog
   or leave a stale selected case.

Preserve cancellation via `AbortController`, bounded target attempts, reduced
motion, existing anchors, and the no-manual-recovery-scroll contract.

## 21. Complete ES/EN support

Every CR-08-visible string needs reviewed ES and EN values:

- opening product/edition copy;
- chapter titles, subtitles, and narration;
- presenter cues, facts, warnings, pauses, and actions;
- controls and pending/error/recovery states;
- timing labels;
- recording-safe labels;
- closing frame and CTA;
- disclosures and accessibility announcements.

Do not expose untranslated keys. Do not concatenate fragments that create
broken grammar. Do not accidentally mix languages after a locale switch.
Switching locale must retain current chapter and state while updating all
visible and announced CR-08 copy. Claims must remain equally constrained in
both languages; Spanish is not a looser translation of English.

## 22. Responsive requirements

Validate all opening, chapter, control, cue, timing, target, and closing states
at these exact CSS viewports:

- 1440×900;
- 1280×800;
- 1024×768;
- 768×1024;
- 430×932;
- 390×844;
- 360×800.

At desktop, the recording flow should show narrative, target, and controls
without recovery scroll. At tablet/mobile, prioritize correctness,
reachability, target visibility, and non-overlap; a deliberate, controlled
scroll is acceptable only if the existing navigation coordinator performs it.
No page-level horizontal overflow, clipped dialogs, hidden exit, overlapping
fixed controls, or sub-44 px targets are permitted.

## 23. Accessibility requirements

- Exactly one primary `h1` for the active Climate Recovery video experience;
  opening and closing headings must fit the real document outline.
- Move focus to the current chapter heading/target only after it is mounted.
- Announce chapter changes and navigation failure/recovery through a concise
  polite live region.
- Preserve logical DOM and tab order; visuals must not reorder meaning.
- Use `aria-current="step"` for the active chapter.
- Use `aria-pressed` for cue/timing/pause toggles.
- Give every icon-only control a localized accessible name.
- Support keyboard navigation and Escape restoration.
- Respect `prefers-reduced-motion` from first render and changes while mounted.
- Provide text equivalents/captions for any concept conveyed visually. Since
  no audio is implemented, “captions” means visible narration/script support
  and documented final-video caption requirements.
- Maintain visible focus, sufficient contrast, and 44×44 px touch targets.
- Do not rely on color, motion, pointer hover, or chart shape alone.
- At 200% browser zoom, content reflows without loss, two-dimensional page
  scrolling, clipped disclosures, or unreachable controls.
- Never programmatically focus `body`.

## 24. Performance requirements

- Prefer lazy loading for Competition Video Mode if the actual bundle result
  supports it.
- Use controlled prefetch only for the next required UI chunk, especially Case
  Detail before the Aurora transition.
- Do not load fourteen Case Detail views.
- Do not duplicate Recharts components or service queries.
- Do not add permanent timers, polling, animation loops, resize loops, or
  unbounded observers.
- Clean up listeners, animation frames, observers, and abort controllers.
- Do not add dependencies or modify the lockfile.
- Record before/after sizes for the default Climate Recovery chunk, Guided Demo,
  Case Detail, new video chunk if any, and the existing main bundle.
- Treat the known legacy main-chunk warning as historical unless CR-08 worsens
  it; do not broaden scope to refactor the whole application.

## 25. Minimum focused test matrix

Add at least **60 focused CR-08 checks** while preserving all historical tests.
Use the repository's existing Node test runner and server-render/static
contract approach; do not add a browser test dependency. Cover at minimum:

1. chapter registry contains exactly nine chapters;
2. chapter IDs are unique;
3. order is contiguous 1–9;
4. previous/next links are reciprocal;
5. first chapter has no previous link;
6. final chapter has no next link;
7. every target mode is valid;
8. every target section is valid;
9. every guided target step exists;
10. every target case ID exists;
11. all durations are positive;
12. pauses are non-negative;
13. planned total equals the approved target;
14. each chapter declares required disclosures;
15. opening contains product and edition;
16. opening visibly declares synthetic demonstration;
17. opening visibly declares read-only/offline scope;
18. Begin Presentation requires explicit input;
19. no autoplay contract exists;
20. start initializes deterministic state;
21. Next advances one chapter only;
22. pending navigation blocks Next;
23. rapid repeated Next cannot skip a chapter;
24. Previous moves back exactly one chapter;
25. Previous is disabled on Opening;
26. Next is disabled on Closing;
27. Replay preserves current chapter ID;
28. Replay does not mutate completed history incorrectly;
29. Pause changes guidance state only;
30. Resume restores guidance state only;
31. Hide Cues removes cue presentation;
32. Show Cues restores localized cues;
33. timing guide can be hidden;
34. timing guide uses planned chapter progress only;
35. reset returns to Opening and clears completed chapters;
36. reset returns product navigation directly to Overview;
37. exit restores pre-video Free mode;
38. exit restores pre-video Guided mode where supported;
39. exit restores pre-video Presentation Mode;
40. exit restores exact source section;
41. exit restores selected plant;
42. exit restores selected case;
43. exit restores exact captured scroll position;
44. exit restores valid focus without scroll drift;
45. Featured CTA captures Overview as origin;
46. Featured case Back returns to Overview;
47. regular catalog case Back returns to Opportunities;
48. Case Detail prefetch occurs before Aurora navigation;
49. prefetch does not load all fourteen details;
50. failed target exposes accessible recovery status;
51. obsolete navigation is cancelled;
52. Escape exits and restores context;
53. ES opening has no visible keys or English leakage;
54. EN opening has no visible keys or Spanish leakage;
55. all ES chapter and cue keys resolve;
56. all EN chapter and cue keys resolve;
57. locale switch preserves chapter/state;
58. ES and EN disclosure sets are semantically aligned;
59. reduced motion removes smooth navigation/entry transforms;
60. reduced motion preserves focus and navigation;
61. controls expose localized accessible labels;
62. current chapter exposes `aria-current="step"`;
63. toggles expose correct `aria-pressed`;
64. chapter change exposes a polite announcement;
65. closing contains company and CTA;
66. closing contains synthetic, estimated, and human-review boundaries;
67. current portfolio values remain 129.16 MWh and 47.92 tCO2e;
68. current leading score remains 92.58 and is not labeled probability;
69. Aurora values remain 9.8 MWh, 3.64 tCO2e, and 59%;
70. Helios remains non-recoverable through asset maintenance;
71. Valle Verde impact remains blocked/unavailable, not zero;
72. review total remains fourteen;
73. no CR-08 source uses `Date.now`;
74. no CR-08 source uses random values;
75. no CR-08 source uses `localStorage`;
76. no CR-08 source uses `sessionStorage`;
77. no CR-08 source uses `fetch` or network clients;
78. no CR-08 source imports GPT/OpenAI advisory code;
79. no CR-08 source invokes Fullscreen or media capture APIs;
80. no product data is mutated;
81. no domain result is recalculated in video components;
82. historical 456 tests still pass;
83. `package.json` is unchanged;
84. `package-lock.json` is unchanged.

Tests must assert behavior and contracts, not merely search for decorative
strings. Static forbidden-API checks may complement behavioral tests.

## 26. Technical QA gate

After implementation and focused review, run these commands in order from the
repository root:

```powershell
npm.cmd ls --depth=0
npm.cmd test
npm.cmd run lint
npm.cmd run build
git diff --check
git status --short
```

Report each exact command, exit code, test count, duration if available,
warnings, and bundle sizes. Do not run `npm install` or `npm ci`; dependencies
must already be present. If dependency state is invalid, **STOP** and report.

Any failing test, lint error, build error, new console warning, new unresolved
bundle regression, whitespace error, lockfile change, or unexpected file is a
release blocker. Fix only in-scope CR-08 causes, rerun affected checks, then run
the full gate again. Do not suppress errors or weaken tests.

## 27. Visual smoke matrix

Use the local loopback application only after technical QA passes. Do not use
external sites, network APIs, GPT advisory, credentials, or browser media APIs.
At all seven viewports verify:

- opening heading, product, edition, CTA, and disclosures;
- chapter indicator and current-state announcement;
- cue/timing show/hide behavior;
- Previous/Next/Replay/Pause/Reset/Exit reachability;
- pending-navigation lock and stable target focus;
- KPI, score, leaderboard, Featured Aurora, Case Detail, Helios, Valle Verde,
  review queue, climate scenario, and closing frame;
- ES and EN without mixed copy or unresolved keys;
- reduced motion;
- visible focus and keyboard-only completion;
- no page-level horizontal overflow;
- no clipped essential content or disclosure;
- no overlay collision or hidden controls;
- 44×44 px touch targets;
- 200% zoom/reflow at a representative desktop viewport;
- zero console warnings and zero console errors.

The viewports are 1440×900, 1280×800, 1024×768, 768×1024, 430×932,
390×844, and 360×800. Record results by viewport and state. Do not create final
competition screenshots or video artifacts in this module; the smoke is QA.

## 28. Recording rehearsal gate

Perform at least two consecutive clean 1440×900 rehearsals:

1. load the Climate Recovery hero locally;
2. select and confirm ES or EN;
3. activate Competition Video Mode explicitly;
4. verify Synthetic, read-only, offline, and Recording Safe boundaries;
5. begin presentation;
6. traverse all nine chapters using explicit controls;
7. show and hide cues;
8. show and hide timing guidance;
9. exercise Previous and Replay outside the final straight-through run;
10. reach the closing frame and hold the planned five seconds;
11. Exit and verify exact mode, section, selection, focus, and scroll restore;
12. Reset and verify direct Overview/Opening state;
13. repeat the straight-through run.

Acceptance for each clean run:

- zero manual recovery scrolls;
- zero lost-focus events and never body focus;
- zero hidden or unreachable controls;
- zero early advances into pending navigation;
- zero accidental locale changes;
- zero missing or cropped disclosures;
- zero console warnings;
- zero console errors;
- presenter can recover from a wrong click in under five seconds;
- complete planned narrative remains within 3:45–4:40.

No actual screen/audio recording, editing, encoding, upload, or submission is
authorized by this prompt.

## 29. Required documentation

Create:

- `docs/competition/CR_08_COMPETITION_VIDEO_PRESENTATION.md`.

Update minimally and accurately:

- root `README.md` with the bounded CR-08 capability and safety boundary;
- the repository's existing changelog location with the CR-08 change summary;
- `docs/competition/CLAIMS_REGISTER.md` with permitted/prohibited CR-08 claims;
- `docs/competition/CR_08_PREPARATION_PACKAGE.md` only to mark which approved
  preparation items were implemented and link the final CR-08 report.

Do not rewrite historical CR-01–CR-07 records or the immutable baseline
manifest. Do not claim validation before commands pass. The new CR-08 report
must follow the modular A–Z reporting style used by CR-06/CR-07 and include:
summary, preflight, architecture, narrative, opening, chapters, timing, cues,
controls, CR-07V fixes, localization, responsive, accessibility, performance,
tests, QA, visual smoke, rehearsal, claims, files, staging, risks,
restrictions, and approval request.

If there is no clearly existing changelog file, do not invent multiple
documents: identify the established changelog section in repository context or
**STOP** and ask the owner which tracked changelog is authoritative.

## 30. Permitted and prohibited claims

### Permitted when fully qualified

- ORBI PVMetrics IA Climate Recovery is a synthetic competition demonstration.
- The demonstrated Climate Recovery assessment is deterministic, local,
  offline, read-only, explainable, and human-gated.
- The synthetic portfolio contains five plants and fourteen cases.
- At the approved fixed synthetic evaluation timestamp, it presents 129.16 MWh
  estimated recoverable energy and 47.92 tCO2e estimated avoided emissions.
- The Climate Opportunity Score is a transparent internal demonstration index
  for prioritization and the leading synthetic score is 92.58.
- Aurora's synthetic featured case presents 9.8 MWh, 3.64 tCO2e, and 59%
  confidence under the existing deterministic contracts.
- The system shows recoverable, non-recoverable, and insufficient-data
  outcomes; blocked is not treated as zero.
- Every current synthetic case requires human review.
- The product supports decisions and proposes read-only next steps; the human
  operator retains responsibility.
- Climate impact is estimated, counterfactual, synthetic, and unverified.
- Competition Video Mode provides controlled presentation and rehearsal
  support without recording or autoplay.
- “Explainable AI” may describe the product direction only alongside the fact
  that this current demonstration is deterministic and uses no GPT/network.

### Prohibited

- real, live, customer, production, or field-validated data;
- active pilots, named customers, revenue, adoption, traction, market
  leadership, or proprietary-data advantage;
- production readiness, production integration, regulatory approval,
  certification, or standards compliance not evidenced in the repository;
- measured, realized, verified, guaranteed, or prevented energy/emissions
  outcomes;
- guaranteed savings, ROI, recovery, performance, or climate benefit;
- Climate Opportunity Score as probability, forecast accuracy, AI prediction,
  certified metric, or guarantee;
- autonomous AI decision-making, operational approval, control, dispatch,
  telecontrol, work orders, or maintenance authorization;
- GPT or network intelligence running in the Climate Recovery demo;
- automatic recording, audio generation, video generation, or submission;
- any claim that the entire pre-existing ORBI application was built for this
  competition or during Build Week.

Review all UI copy, cues, documentation, tests, rehearsal notes, and proposed
commit text against this register.

## 31. Precommit and human approval gate

Do not stage as you work. Once implementation, QA, visual smoke, rehearsal, and
documentation all pass:

1. show the exact changed/untracked file list;
2. show `git diff --stat`;
3. show the complete relevant diff for human review, split into readable
   sections if necessary;
4. show the QA command table and visual/rehearsal evidence;
5. confirm no dependency, lockfile, domain-result, fixture, baseline tag,
   backup branch, Git configuration, or external-service change;
6. identify every remaining warning or risk;
7. propose the exact staging set;
8. **STOP for explicit human approval before staging**.

Only after explicit staging approval, stage exactly the approved CR-08 files,
then show:

```powershell
git diff --cached --check
git diff --cached --stat
git status --short
```

**STOP again for human inspection.** Do not interpret implementation approval
as commit approval.

## 32. Commit gate

Suggested commit message:

```text
feat: add Climate Recovery competition video presentation mode
```

Create the commit only after the owner explicitly authorizes the commit after
reviewing the staged diff. After any authorized commit, show commit hash and
status. **Do not push.** Do not create a tag, branch, PR, release, deployment,
upload, or submission.

## 33. Measurable acceptance checklist

### Repository and scope

- [ ] Preflight branch, approved HEAD, upstream, and tree matched.
- [ ] Changes are bounded to Climate Recovery CR-08, tests, styles, and required
  documentation.
- [ ] No new dependency; `package.json` and lockfile unchanged.
- [ ] No backend, network, GPT, API key, authentication, deployment, or
  persistence work.
- [ ] Domain, scoring, fixtures, cases, metrics, and results unchanged.

### Experience

- [ ] Optional Competition Video Mode exists and is explicitly started.
- [ ] Opening states product, edition, value, Synthetic, read-only, and offline.
- [ ] Exactly nine ordered chapters implement the approved story.
- [ ] First 90 seconds cover hook, scale, promise, numbers, prioritization,
  featured case, and human control.
- [ ] Planned full narrative targets 260 seconds and fits 3:45–4:40.
- [ ] No autoplay or automatic chapter advance.
- [ ] Presenter cues and timing guide are optional and hideable.
- [ ] Recording controls are complete, semantic, and non-operational.
- [ ] Closing frame contains approved company, value, claims, and safety copy.

### Navigation and recovery

- [ ] Case Detail is prefetched before Aurora navigation.
- [ ] Next is locked for all pending navigation.
- [ ] Obsolete navigation cancels safely.
- [ ] Featured CTA Back restores Overview.
- [ ] Overview resets do not route through Opportunities.
- [ ] Exit restores exact mode, section, selections, focus, and scroll.
- [ ] Reset is deterministic and returns to the declared start state.
- [ ] Wrong-click recovery takes under five seconds.

### Truth and safety

- [ ] Synthetic, Estimated, Human Review, blocked/unavailable, read-only,
  counterfactual, and unverified boundaries remain visible when relevant.
- [ ] Score is never called a probability or guarantee.
- [ ] No customer, pilot, deployment, measured-impact, production, or
  operational-authority claim appears.
- [ ] ES and EN preserve identical claims and constraints.

### Quality

- [ ] At least 60 focused CR-08 checks added; full historical suite passes.
- [ ] `npm.cmd ls --depth=0`, test, lint, build, and `git diff --check` pass.
- [ ] Bundle sizes before/after are documented; no unexplained regression.
- [ ] All seven viewport smokes pass.
- [ ] Keyboard, focus, live region, reduced motion, contrast, touch targets, and
  200% zoom pass.
- [ ] Two consecutive 1440×900 rehearsals pass with zero manual recovery scroll,
  zero lost focus, zero hidden controls, zero warnings, and zero errors.
- [ ] Required documentation and claims register are accurate.
- [ ] Exact diff and staging set receive human approval.
- [ ] No push or deployment occurs.

## 34. Final report format: sections A–Z

At the end of implementation, respond with all of these sections, even when a
section says “None” or “Not run”:

### A. Outcome

State whether CR-08 is complete, partial, or blocked.

### B. Preflight

Repository path, branch, starting HEAD, upstream, ahead/behind, initial staged,
tracked, and untracked state.

### C. Architecture

New video layer, integration points, state ownership, and lazy boundaries.

### D. Opening

Cinematic opening behavior, copy, CTA, and disclosures.

### E. Chapters

Nine chapters, mappings, deterministic links, and total planned duration.

### F. First 90 seconds

Summarize each approved beat and evidence that it remains within claims.

### G. Full script and timing

Planned duration, chapter durations, pauses, cut points, and no-autoplay proof.

### H. Narration cues

Cue kinds, visibility behavior, localization, and confirmation of no audio.

### I. Recording controls

Previous, Next, Replay, Pause, cues, timing, reset, exit, and return behavior.

### J. Recording-safe layout

Safe area, 16:9 framing, 1440×900 behavior, pointer path, and chrome treatment.

### K. Closing frame

Final copy, company attribution, CTA, disclosures, and hold duration.

### L. CR-07V corrections

Prefetch, pending lock, exact scroll restoration, Featured origin, and Overview
return evidence.

### M. Localization

ES/EN scope and key/mixed-language validation.

### N. Responsive

Results for all seven viewports.

### O. Accessibility

Heading, focus, live region, keyboard, Escape, reduced motion, ARIA, contrast,
touch, captions, and 200% zoom results.

### P. Performance

Before/after default, Climate Recovery, Guided Demo, Case Detail, video, and
main chunk sizes; known warnings.

### Q. Tests

Focused count, full count, coverage summary, command, result, and duration.

### R. Technical QA

Command-by-command exit codes and warnings.

### S. Visual smoke

Viewport-by-viewport pass/fail and console status.

### T. Recording rehearsal

Two-run results, duration, manual scroll, focus, controls, warnings, and errors.

### U. Documentation

Created/updated documents and claims alignment.

### V. Files

Exact added, modified, deleted, staged, and untracked files.

### W. Claims

Permitted claims used, prohibited claims audit, and any remaining concern.

### X. Risks and limitations

Unresolved issues, legacy warning, recording limitation, and future CR-09 work.

### Y. Git and approval state

Final HEAD, status, staging state, commit state, push state, and next required
human approval.

### Z. Recommended next step

One precise human action. Do not recommend push or deployment unless a later
separate authorization explicitly asks for it.

End the final report with exactly:

**CR-08 COMPETITION VIDEO MODE READY FOR HUMAN APPROVAL**

