# CR-08 Preparation Package

Preparation date: 2026-08-05

Status: documentation-only design package; no CR-08 implementation authorized

Repository baseline:

- Repository: ORBI PVMetrics IA.
- Branch: `competition/ai-climate-recovery-2026`.
- Approved HEAD: `483bbe92f02a9fe1d4ea69f9f5001766da3b2d51`.
- CR-07 validation verdict: READY WITH MINOR POLISH.
- Product boundary: synthetic, local, read-only, non-operational, offline, and
  human-gated.

This document defines the proposed competition-video and presentation design
for CR-08. It does not authorize implementation, source changes, recording,
publication, deployment, real-data use, or any operational integration.

## 1. Executive Objective

CR-08 should turn the validated CR-07 experience into a repeatable competition
presentation system that communicates the product's value, technical rigor,
climate relevance, and safety boundaries in approximately four minutes and
twenty seconds.

The intended result is a video-ready presentation flow in which a judge can
understand, without prior product knowledge:

1. the renewable-energy loss problem;
2. how ORBI PVMetrics IA identifies and prioritizes synthetic opportunities;
3. why the Climate Opportunity Score is useful but not a probability;
4. how evidence, uncertainty, and human review constrain every recommendation;
5. why the experience is commercially credible without implying production or
   operational authority.

CR-08 should preserve the complete deterministic product beneath the
presentation layer. The presentation must simplify attention, not simplify or
hide the evidence contract.

## 2. Scope

The proposed CR-08 implementation scope is limited to competition presentation
and recording support around the existing CR-07 experience:

- a controlled competition-video sequence based on the existing eight Guided
  Demo steps;
- recording-specific framing and safe-area guidance;
- optional presenter cues and timing guidance stored only in component memory;
- explicit shot transitions with no autoplay requirement;
- a stronger opening, mid-story proof point, and final closing slate;
- preloading or navigation gating for the existing lazy Case Detail transition;
- exact restoration of scroll and the section from which a case was opened;
- clear start, restart, exit, and recovery paths;
- preservation of ES and EN presentation flows;
- continued use of service-provided portfolio, ranking, case, and chart data;
- recording and submission procedures documented in this package.

Any future implementation must remain local, read-only, deterministic, and
bounded to the existing synthetic dataset unless a separate approved module
changes those constraints.

## 3. Out of Scope

CR-08 must not include:

- changes to domain calculations, scoring, ranking, climate factors, fixtures,
  cases, or synthetic plants;
- real plants, customer data, production credentials, coordinates, or live
  telemetry;
- GPT advisory, network calls, API keys, external media services, analytics, or
  remote storage;
- automatic fullscreen requests, microphone or camera permissions, or browser
  capture APIs;
- video rendering, encoding, uploading, hosting, or submission automation;
- autonomous step advancement or forced presenter timing;
- dispatch, maintenance authorization, approval mutation, work-order creation,
  or any operational command;
- claims of verified energy recovery, verified avoided emissions, production
  readiness, commercial adoption, or regulatory validation;
- broad redesign of non-Climate-Recovery ORBI modules;
- dependency, backend, authentication, deployment, or persistence work;
- CR-09 implementation.

## 4. Success Criteria

CR-08 should be considered successful only when all of the following are true:

- the first value proposition is understandable within five seconds;
- the complete recording is between 3:45 and 4:40, with a target of 4:20;
- the first 90 seconds establish problem, product, quantitative opportunity,
  differentiator, and human-control boundary;
- all eight story steps remain reachable using only explicit presenter input;
- the current CR-07 values remain unchanged and internally consistent;
- step 4 cannot be advanced into an unresolved lazy-navigation state;
- Exit restores the exact prior mode, section, focus, and scroll position;
- opening a featured case returns to the originating Overview context;
- Presentation Mode retains Recording Safe, Estimated, Synthetic, Human Review,
  and non-operational disclosures;
- the 1440 x 900 recording rehearsal requires zero manual recovery scrolls;
- all required controls, narration, and targets remain visible;
- console output contains zero warnings and zero errors;
- no page-level horizontal overflow occurs at the seven validated viewports;
- reduced motion removes decorative movement without impairing navigation;
- ES and EN deliver the same claims and safety boundaries;
- a presenter can recover from a wrong click in under five seconds;
- no unsupported competition claim appears in visuals, narration, captions, or
  submission text.

## 5. Competition Goals

The competition presentation should optimize for five outcomes:

1. **Immediate relevance.** Frame renewable-energy loss as a prioritization and
   decision-quality problem, not merely a dashboard problem.
2. **Visible product depth.** Show portfolio, plant, case, evidence, scenario,
   ranking, and review layers without exposing unnecessary technical chrome.
3. **Explainable intelligence.** Demonstrate that the system explains scores,
   uncertainty, excluded overlap, blocked values, and recommended next steps.
4. **Responsible climate framing.** State that energy and emissions values are
   synthetic counterfactual estimates, not measured outcomes.
5. **Commercial credibility.** Present a coherent product workflow while
   clearly separating the competition demonstration from production claims.

Secondary goals are to show bilingual readiness, mobile resilience, accessible
interaction, deterministic behavior, and disciplined human oversight.

## 6. Video Recording Goals

The competition video should:

- use a 1440 x 900 browser viewport unless submission rules require another
  resolution;
- record at 30 fps or 60 fps with no dropped-frame warnings;
- use Presentation Mode from the first product interaction onward;
- keep pointer movement deliberate and outside key text while narration runs;
- avoid manual page scrolling during the eight-step flow;
- hold each quantitative screen long enough for score and units to be read;
- capture one recoverable, one non-recoverable, and one insufficient-data case;
- show the review queue and human-decision boundary;
- end on a stable branded screen rather than on a technical detail or control;
- preserve readable disclosures in the final encoded output;
- use clean narration with no background notification sounds;
- contain no credentials, personal data, desktop notifications, unrelated tabs,
  bookmarks, or operating-system identifiers.

The recording should feel paced and intentional rather than fast. Visual proof
should appear before explanatory detail, with narration guiding attention to
one focal point at a time.

## 7. Storytelling Strategy

The recommended story uses a five-act structure.

### Act 1: Problem

Renewable plants create large amounts of operational evidence, but losses are
not equally recoverable, measurable, or urgent. The challenge is deciding what
deserves attention first.

### Act 2: Portfolio opportunity

Introduce the synthetic five-plant portfolio, six executive KPIs, the Climate
Opportunity Score, and the Top 3 ranking. Establish that the score prioritizes;
it does not predict probability or certify impact.

### Act 3: Evidence and exceptions

Open the featured Aurora inverter opportunity, then contrast it with Helios
grid curtailment and Valle Verde insufficient data. This demonstrates that the
product can recommend investigation, reject false recovery, and block climate
impact when evidence is inadequate.

### Act 4: Explainability and control

Show the review queue, evidence gaps, methodology, suppressed actions, and the
operator's final authority. The product supports decisions; it does not issue
operational orders.

### Act 5: Climate Recovery close

Return to the estimated recovery scenario, restate the synthetic and
counterfactual boundary, and close on the product's core value: prioritize the
right opportunity, explain why, and keep a human accountable.

## 8. First 90 Seconds Strategy

The first 90 seconds should operate as a complete miniature pitch. If a judge
stops watching at 90 seconds, they should still understand the problem,
solution, differentiator, headline numbers, and safety boundary.

- **0-10 seconds — Hook:** “Renewable-energy losses are not equally
  recoverable.” Show the premium hero.
- **10-20 seconds — Scale:** Introduce five synthetic plants and fourteen
  deterministic cases. Keep Synthetic Executive Demonstration visible.
- **20-30 seconds — Product promise:** Enter Presentation Mode and state the
  three outcomes: recover energy, reduce avoidable emissions, prioritize with
  explainable intelligence.
- **30-40 seconds — Quantitative overview:** Reveal 129.16 MWh estimated
  recoverable energy and 47.92 tCO2e estimated avoided emissions.
- **40-50 seconds — Differentiator:** Focus the 92.58 Climate Opportunity Score,
  its Very High band, and the non-probability disclosure.
- **50-60 seconds — Portfolio prioritization:** Show Aurora, Costa Sur, and
  Patagonia as the Top 3.
- **60-70 seconds — Integrity:** Point out Patagonia's visible overlap penalty
  and Helios/Valle Verde remaining in the full ranking.
- **70-80 seconds — Actionable case:** Frame the Aurora inverter opportunity,
  its 9.8 MWh estimate, 59% confidence, and required human review.
- **80-90 seconds — Control boundary:** State that the system proposes a
  read-only next step; the operator retains the decision.

The 90-second mark should land on a product screen, not a title card, and should
create the question: “How does the system know when not to recommend recovery?”
The next act answers that question.

## 9. Presentation Flow

The proposed presentation sequence is:

1. Clean opening slate with ORBI PVMetrics IA and Climate Recovery Edition.
2. Premium hero and concise problem statement.
3. Enter Presentation Mode and confirm Recording Safe boundary.
4. Portfolio KPI hierarchy and Climate Opportunity Score.
5. Top 3 leaderboard and complete five-plant context.
6. Featured Aurora inverter opportunity.
7. Recoverable case evidence and bounded recommended next step.
8. Non-recoverable Helios case and suppressed recovery action.
9. Insufficient-data Valle Verde case and blocked climate impact.
10. Human Review queue and explainability.
11. Recovery scenario with estimated, unverified climate impact.
12. Branded closing slate with decision-support boundary.

The underlying Guided Demo remains the navigation engine. CR-08 should add
recording cues and stronger context restoration around it, not create a second
story state machine.

## 10. Detailed Timeline

Target duration: 4 minutes 20 seconds. A tolerance of plus or minus 20 seconds
is acceptable if submission rules permit it.

| Time | Screen and action | Narration objective | Camera focus |
| --- | --- | --- | --- |
| Second 0-10 | Opening slate into premium hero | Establish the renewable-loss problem and product name. | Center hero headline; no pointer movement. |
| Second 10-20 | Hero badges and portfolio statement | Declare synthetic, local, read-only scope and five-plant scale. | Upper hero and disclosure line. |
| Second 20-30 | Enter Presentation Mode | Explain that this is a reduced-chrome local presentation view. | Mode switch, then expanded content. |
| Second 30-40 | Primary KPIs | Read the estimated energy and emissions values with units. | Energy and emissions cards. |
| Second 40-50 | Climate Opportunity Score | Explain score, band, leading plant, and non-probability boundary. | Score ring and tooltip/disclosure. |
| Second 50-60 | Secondary KPIs | Confirm five assets, fourteen cases, fourteen reviews. | Supporting KPI row. |
| Second 60-70 | Top 3 leaderboard | Show portfolio prioritization and the first three plants. | Rank, plant, score, energy. |
| Second 70-80 | Full ranking context | Show Valle Verde, Helios, and Patagonia overlap penalty remain visible. | Full ranking disclosure/table. |
| Second 80-90 | Featured Aurora case | Introduce category, priority, 9.8 MWh, 3.64 tCO2e, and 59% confidence. | Featured card left-to-right. |
| Second 90-100 | Recommended next step | Emphasize read-only review and required approval. | Next-step panel and Human Review. |
| Second 100-110 | Open recoverable case | Transition from portfolio signal to case evidence. | Case heading and status badges. |
| Second 110-120 | Case metrics | Explain estimate, confidence, sufficiency, and priority band. | Key metrics grid. |
| Second 120-130 | Evidence and hypothesis | Show why the result is explainable and still unconfirmed. | Evidence and hypothesis disclosure. |
| Second 130-140 | Recovery scenario | Compare without-intervention and with-intervention estimates. | Scenario chart and accessible values. |
| Second 140-150 | Helios non-recoverable case | Explain that grid curtailment is not recoverable through asset maintenance. | Non-recoverable badge and rationale. |
| Second 150-160 | Suppressed action | Demonstrate that the product can decline an inappropriate recovery action. | Suppressed-actions explanation. |
| Second 160-170 | Valle Verde insufficient data | Introduce evidence insufficiency rather than forcing a result. | Data sufficiency and warning. |
| Second 170-180 | Blocked climate impact | Explain why unavailable or blocked is not displayed as zero. | Blocked impact and request-more-data CTA. |
| Second 180-190 | Human Review queue | Show fourteen pending reviews and deterministic ordering. | Queue heading and first entries. |
| Second 190-200 | Review rationale | Show evidence gap, review type, and urgency. | One queue card; avoid dense scrolling. |
| Second 200-210 | Explainability | Connect score, evidence, limitations, and operator authority. | Explainability and methodology controls. |
| Second 210-220 | Return to Climate Recovery | Reframe the case-level insight at portfolio level. | Guided step 8 target. |
| Second 220-230 | Climate impact boundary | Restate that impact is synthetic, counterfactual, and unverified. | Estimated emissions and disclosure. |
| Second 230-240 | Commercial value | Summarize prioritization, explainability, and human-controlled action. | Score, featured card, or clean overview. |
| Second 240-250 | Product close | Deliver the single-sentence value proposition. | Hero or purpose-built closing composition. |
| Second 250-260 | Final slate | Hold brand, Climate Recovery Edition, and decision-support disclaimer. | Static centered slate; no pointer. |

If the allowed video duration is shorter than four minutes, remove detail from
seconds 110-130 and 190-210 before removing any safety disclosure or the three
contrasting case outcomes.

## 11. Screen-by-screen Plan

### Screen 1 — Opening Slate

- ORBI PVMetrics IA.
- Climate Recovery Edition.
- One-line value proposition.
- Synthetic Executive Demonstration label.
- Duration: 3-5 seconds before dissolving into the live product view.

### Screen 2 — Premium Hero

- Show the complete three-line headline.
- Keep Read-only, No network, timestamp, and synthetic disclosure readable.
- Enter Presentation Mode through the visible control.

### Screen 3 — Executive KPI Overview

- Lead with energy and emissions estimates.
- Move focus to the Climate Opportunity Score.
- Finish with the three supporting KPIs.

### Screen 4 — Plant Prioritization

- Show the Top 3 before the complete ranking.
- Call out Patagonia's overlap penalty.
- Confirm that low-ranked and unavailable cases are not hidden.

### Screen 5 — Featured Opportunity

- Show Aurora Solar, inverter category, High priority, Partially Recoverable,
  9.8 MWh, 3.64 tCO2e, 59% confidence, and Human Review Required.
- Use Inspect Case only after the summary has been readable for at least four
  seconds.

### Screen 6 — Recoverable Case

- Show evidence, estimate, uncertainty, and the proposed read-only next step.
- Avoid reading every technical accordion.

### Screen 7 — Non-recoverable Case

- Show Helios grid curtailment.
- Focus on the suppressed inappropriate action and the explanation.

### Screen 8 — Insufficient-data Case

- Show Valle Verde data insufficiency.
- Focus on blocked impact and the request for more evidence.

### Screen 9 — Human Review Queue

- Show the queue total and first prioritized items.
- Explain review reason, evidence gap, and review type.

### Screen 10 — Explainability

- Show methodology, assumptions, limitations, or why-this-result content.
- State that explanations support accountable human decisions.

### Screen 11 — Climate Recovery Scenario

- Show the counterfactual comparison and estimated impact.
- Keep the unverified-impact disclosure visible.

### Screen 12 — Final Slate

- ORBI PVMetrics IA — Climate Recovery Edition.
- “Prioritize the right opportunity. Explain why. Keep humans in control.”
- “Synthetic decision-support demonstration — not an operational order.”

## 12. Camera Focus Plan

“Camera” refers to the screen-recording crop and visual attention, not a webcam
or automated browser camera permission.

- Use one fixed 1440 x 900 capture region.
- Keep the browser content edge-to-edge; omit desktop chrome where permitted.
- Do not use digital zoom above 115%; use layout and pointer position to guide
  attention.
- Maintain a 48 px recording-safe perimeter around essential text.
- Keep the pointer stationary in an empty area during narration.
- Move the pointer only immediately before a click.
- For KPIs, focus left-to-right: energy, emissions, score.
- For leaderboard, focus top-to-bottom: rank, score, energy, review.
- For cases, focus top-to-bottom: status, evidence, estimate, next step, review.
- Do not crop synthetic, estimated, unavailable, blocked, or human-review labels.
- Avoid full-page rapid pans. Guided navigation should perform all required
  movement.
- Hold the final slate for at least five seconds.

## 13. Animation Plan

CR-08 should reuse the CR-07 motion system rather than introduce a video-style
animation framework.

- Fast feedback: 170 ms.
- Standard transition: 210 ms.
- Panel reveal: 260 ms.
- One existing easing curve.
- Hero reveal: once, on entry.
- KPI reveal: one restrained stagger, never a numeric count-up.
- Score ring: static value; optional single reveal only.
- Featured opportunity: one entrance, no glow pulse.
- Leaderboard: one restrained reveal, no podium bounce.
- Guided transitions: navigation-driven, no autoplay.
- Final slate: simple opacity transition, 260 ms maximum.

Forbidden motion:

- loops, particles, permanent pulses, animated backgrounds, parallax, 3D charts,
  spinning score rings, simulated live counters, or celebratory effects;
- motion that delays interaction or masks unavailable/blocked states;
- animation that continues while the presenter is speaking about another area.

Reduced motion must remove entry transforms, smooth-scroll duration, stagger
delays, and decorative movement while preserving immediate state changes.

## 14. Transitions

Use four transition types only:

1. **Mode transition:** Free Explore to Presentation Mode; layout expands while
   preserving content and focus.
2. **Guided focus transition:** controlled navigation to the declared anchor.
3. **Case transition:** short lazy-loading state followed by the exact case
   heading and anchor.
4. **Closing transition:** product overview to static final slate.

Transition rules:

- never cut away before the destination target is mounted;
- disable or guard Next while navigation is pending;
- cancel obsolete navigation if the presenter changes direction;
- show an accessible recovery message if a target cannot mount;
- preserve Presentation Mode through Guided Demo Exit and Reset;
- restore origin section, focus, and scroll when closing a case;
- avoid crossfades that temporarily hide disclosures;
- keep transition duration below 300 ms, excluding actual lazy loading.

## 15. Presentation Mode Improvements

The CR-08 implementation proposal should address the CR-07V findings and add
bounded recording support:

### Required minor-polish fixes

- prefetch Case Detail before the step 4 transition or gate Next until the
  target is ready;
- restore the exact captured scroll position when leaving Guided Demo;
- return from the featured case to the originating Overview, not always to the
  Opportunities catalog.

### Proposed presentation enhancements

- optional in-memory “Competition Sequence” indicator separate from autoplay;
- clear current beat and estimated narration duration;
- recording-safe margins for 16:10 and 16:9 capture crops;
- a clean opening and closing composition using existing brand tokens;
- presenter-cue text that is excluded from the captured region by design;
- one-click restart that returns to Overview, Presentation Mode, and step 1;
- visible navigation-pending state preventing rapid double advancement;
- optional “Hide pointer cue” instruction for rehearsal, not runtime capture;
- explicit final-state focus target for a strong closing frame.

No enhancement may request fullscreen, control recording software, capture
audio/video, persist rehearsal history, or transmit telemetry.

## 16. Narration Recommendations

- Use a calm, credible, technical-executive tone.
- Speak at 125-145 words per minute.
- Use short sentences when numbers are on screen.
- Say “estimated,” “synthetic,” and “counterfactual” wherever a viewer could
  otherwise infer measured outcomes.
- Say “decision support” before describing recommended actions.
- Do not call the Climate Opportunity Score a probability, forecast accuracy,
  certified score, or guaranteed recovery.
- Do not say the product “prevents emissions”; say it estimates potential
  avoided emissions under explicit synthetic assumptions.
- Do not claim that AI autonomously decides or controls equipment.
- Use “explainable intelligence” for the product concept and “deterministic
  assessment” for the current competition implementation.
- Pause for one second after the three headline numbers.
- Avoid reading every label. Explain what the screen proves.
- Use the same claims in ES and EN, not a looser translation.

## 17. Presenter Notes

- Start with the product already loaded on the Climate Recovery hero.
- Confirm ES or EN before recording; never switch unintentionally mid-sentence.
- Enter Presentation Mode once and acknowledge its non-guarantee disclosure.
- Keep hands off the scroll wheel during Guided Demo.
- Wait until the target is stable before pressing Next.
- If navigation shows a recovery status, stop, Reset, and restart the take.
- On the score screen, point to the non-probability explanation.
- On Patagonia, mention the overlap penalty as evidence of conservative
  aggregation.
- On Helios, emphasize that “not recoverable” is a useful result.
- On Valle Verde, emphasize that blocked is not zero.
- On the review queue, state that every current synthetic case requires human
  review.
- Do not improvise customer names, deployments, market size, accuracy rates, or
  realized impact.
- If asked about production, distinguish the validated competition experience
  from governed production adoption requirements.
- End on the final slate and remain silent for two seconds before stopping the
  recorder.

## 18. Investor Perspective

The presentation should demonstrate investable product qualities without
making fundraising or traction claims that the repository cannot support.

Positive signals to communicate:

- a clear operational problem with economic and climate relevance;
- a product hierarchy spanning portfolio, plant, case, evidence, and review;
- explainable prioritization rather than a black-box recommendation;
- conservative handling of overlap, non-recoverable conditions, and missing
  data;
- a human-gated workflow compatible with future enterprise governance;
- bilingual presentation and a coherent commercial visual language;
- a modular architecture with deterministic domain, application, portfolio,
  presentation, and guided-story layers.

Claims to avoid:

- market leadership, revenue, customer adoption, production integrations,
  validated savings, proprietary data advantage, regulatory approval, or
  guaranteed return on investment.

The appropriate investor takeaway is that the demonstration presents a
credible product direction and disciplined architecture, not commercial proof.

## 19. Judge Perspective

The story should make the following judging dimensions easy to score:

- **Problem clarity:** a visible renewable-energy prioritization challenge.
- **Innovation:** explainable opportunity scoring joined to evidence,
  counterfactual scenarios, and human review.
- **Technical execution:** deterministic service boundaries, lazy presentation
  layers, accessibility, localization, and stable guided navigation.
- **Climate relevance:** estimated recoverable energy and avoided emissions with
  limitations preserved.
- **Responsible AI:** no autonomous authority, no hidden uncertainty, and no
  conversion of blocked or unavailable values into false precision.
- **Product quality:** premium hero, KPI hierarchy, featured opportunity,
  leaderboard, charts, cases, and Presentation Mode.
- **Demo readiness:** repeatable 3-5 minute narrative with clear recovery paths.

The presentation should answer “why this matters,” “how it works,” “what makes
it trustworthy,” and “what is real today” before the judge needs to ask.

## 20. Common Questions and Answers

### Is this using real plant or customer data?

No. All plants, cases, metrics, timestamps, and results in Climate Recovery are
synthetic competition-demonstration data.

### Does the product operate equipment or dispatch energy?

No. The demonstrated experience is read-only and non-operational. It does not
send commands, create work orders, dispatch assets, or approve field activity.

### Is the Climate Opportunity Score a probability?

No. It is a transparent internal demonstration index used to prioritize
synthetic opportunities. It is not a calibrated probability or certified
metric.

### Are 129.16 MWh and 47.92 tCO2e measured outcomes?

No. They are synthetic estimates produced under explicit demonstration
assumptions and aggregation rules. The climate value is counterfactual and
unverified.

### What AI is running in this demonstration?

The Climate Recovery assessment shown here is deterministic and explainable.
It does not call GPT, external APIs, or a network service.

### Why require human review for all fourteen cases?

The system provides decision support under uncertainty. A human must evaluate
evidence, safety, authorization, and operational context before any real-world
action could be considered.

### Why show non-recoverable and insufficient-data cases?

Because trustworthy prioritization must identify when maintenance is not the
answer and when evidence is too weak to support an estimate.

### What is the overlap penalty?

It is a visible conservative adjustment in the synthetic ranking that reduces
the risk of treating overlapping opportunities as independent value.

### Can this connect to real data later?

The product direction can support governed integrations, but production use
would require separate validation, security, data governance, methodology,
accessibility, and accountable-operator work. This demonstration makes no
production-integration claim.

### Why is Presentation Mode not fullscreen?

It is an application layout mode. Avoiding automatic fullscreen keeps browser
permissions and recording control with the presenter.

### What is the commercial value proposition?

Help teams prioritize which renewable-energy opportunities deserve review,
explain the evidence and uncertainty, and preserve accountable human control.

### What remains after CR-08?

Competition submission hardening, broader accessibility validation, production
governance design, real-data validation planning, and controlled integration
architecture remain future work.

## 21. Recommended Script

The following English script targets approximately four minutes and twenty
seconds at 130-140 words per minute. A Spanish version should preserve the same
claims and boundaries rather than translate loosely.

### 0:00-0:30 — Opening

“Renewable plants produce enormous volumes of operational evidence, but not
every energy loss is recoverable, measurable, or urgent. ORBI PVMetrics IA
Climate Recovery helps teams identify which opportunities deserve attention
first. This is a fully synthetic, local, read-only demonstration. It contains
no customer data, makes no operational decisions, and sends no commands.”

### 0:30-1:00 — Portfolio value

“Across five synthetic assets and fourteen deterministic cases, the portfolio
shows 129.16 megawatt-hours of estimated recoverable energy and 47.92 tonnes of
estimated avoided emissions. These are counterfactual demonstration estimates,
not measured outcomes. The Climate Opportunity Score highlights Aurora Solar
at 92.58, in the Very High band. The score is a transparent prioritization
index, not a probability or certified metric.”

### 1:00-1:30 — Ranking and featured opportunity

“The Top 3 turns the complete ranking into an immediate executive decision
view. Aurora leads, Costa Sur follows, and Patagonia remains visible with an
explicit overlap penalty. Lower-ranked Valle Verde and Helios are not hidden.
The featured Aurora inverter case estimates 9.8 megawatt-hours of recoverable
energy, 3.64 tonnes of avoided emissions, and 59 percent confidence. Human
review is required before any approved next step.”

### 1:30-2:10 — Recoverable case

“Opening the case moves from portfolio signal to traceable evidence. The system
shows data sufficiency, confidence, limitations, and a seven-day recovery
scenario. It proposes a read-only review rather than an operational order. The
hypothesis remains unconfirmed, the climate estimate remains unverified, and
the operator retains the final decision.”

### 2:10-2:45 — Non-recoverable and insufficient data

“Trustworthy intelligence must also know when not to recommend recovery.
Helios grid curtailment is classified as non-recoverable through asset
maintenance, so inappropriate actions are suppressed. Valle Verde has
insufficient evidence. Its climate impact is blocked rather than displayed as
zero or false precision, and the next step is to request more data.”

### 2:45-3:20 — Explainability and review

“Every synthetic case enters the human-review queue. Reviewers can see the
reason, evidence gap, urgency, methodology, assumptions, limitations, and
suppressed actions. This creates an explainable chain from portfolio score to
case evidence while preserving safety, authorization, and accountability.”

### 3:20-3:55 — Climate Recovery close

“The final recovery scenario compares a synthetic future with and without an
approved intervention. It is not a promise of recovered energy or verified
emissions. It is a structured way to evaluate potential value, uncertainty,
and the next responsible question.”

### 3:55-4:20 — Final value proposition

“ORBI PVMetrics IA Climate Recovery brings portfolio prioritization,
explainable evidence, climate context, and human review into one coherent
experience. Prioritize the right opportunity. Explain why. Keep humans in
control. Synthetic decision support — not an operational order.”

## 22. Recording Checklist

- [ ] Confirm competition rules, maximum duration, resolution, codec, and file
  size.
- [ ] Confirm approved repository commit and clean Git tree.
- [ ] Confirm the intended language and narration script.
- [ ] Close email, chat, calendar, password manager, and notification overlays.
- [ ] Hide bookmarks, personal browser profiles, and unrelated tabs.
- [ ] Disable operating-system notifications and automatic updates temporarily.
- [ ] Confirm no customer data, credentials, coordinates, or API keys are
  visible.
- [ ] Load the application locally and verify the exact Climate Recovery view.
- [ ] Enter Presentation Mode and verify Recording Safe disclosure.
- [ ] Confirm the first frame and final frame.
- [ ] Perform one silent rehearsal and one narrated rehearsal.
- [ ] Record at least two complete takes.
- [ ] Keep the untouched original recording before editing.
- [ ] Review the final export from beginning to end.

## 23. Audio Checklist

- [ ] Record in a quiet room with soft surfaces where possible.
- [ ] Use one microphone throughout the take.
- [ ] Set input level so normal speech peaks between -12 dB and -6 dB.
- [ ] Confirm no clipping, automatic gain pumping, hum, or keyboard noise.
- [ ] Record ten seconds of room tone.
- [ ] Maintain 15-25 cm microphone distance.
- [ ] Use a pop filter or off-axis placement.
- [ ] Silence phone, desktop, browser, and collaboration notifications.
- [ ] Pronounce MWh, tCO2e, counterfactual, Patagonia, and explainable
  consistently.
- [ ] Leave short pauses around headline numbers.
- [ ] Do not add music that competes with narration.
- [ ] If music is used, confirm license and keep it at least 18 dB below voice.
- [ ] Listen through both headphones and laptop speakers before submission.
- [ ] Check captions against the final audio, not the draft script.

## 24. Screen Recording Checklist

- [ ] Capture at 1440 x 900 or the approved submission resolution.
- [ ] Use one browser zoom level and verify it before recording.
- [ ] Confirm no page-level horizontal overflow.
- [ ] Confirm all Climate Recovery controls are at least 44 px high.
- [ ] Confirm the hero and mode switch fit the opening composition.
- [ ] Confirm score ring, Top 3, featured card, and disclosures are readable.
- [ ] Confirm Presentation Mode sidebar is a 72 px rail on desktop.
- [ ] Confirm no automatic Fullscreen API prompt occurs.
- [ ] Confirm pointer highlight, if used, does not obscure text.
- [ ] Disable capture of unrelated screens and system audio.
- [ ] Verify frame rate and dropped-frame indicators.
- [ ] Verify colors, text sharpness, and contrast in the encoded sample.
- [ ] Check that mobile footage, if included, uses a separate deliberate shot.
- [ ] Hold each major quantitative screen for at least three seconds.
- [ ] Hold the final slate for at least five seconds.

## 25. Demo Rehearsal Checklist

- [ ] Start on the premium hero in the selected language.
- [ ] Enter Presentation Mode.
- [ ] Confirm Recording Safe and its limitation.
- [ ] Start Guided Demo.
- [ ] Traverse steps 1-8 using only Next.
- [ ] Confirm shell, narrative, controls, and target at every step.
- [ ] Confirm exact anchor focus and no body focus.
- [ ] Confirm zero manual recovery scrolls.
- [ ] Confirm step 4 waits for the recoverable case target.
- [ ] Exercise Previous and Skip outside the final take.
- [ ] Exercise Reset, Exit, and Escape outside the final take.
- [ ] Confirm Exit restores exact scroll and focus.
- [ ] Confirm Featured Opportunity opens Aurora's expected case.
- [ ] Confirm Back restores Overview context.
- [ ] Confirm Helios non-recoverable and Valle Verde blocked states.
- [ ] Confirm review KPI and queue both equal 14.
- [ ] Confirm console has zero warnings and zero errors.
- [ ] Time the complete narrated flow.
- [ ] Repeat rehearsal until two consecutive clean runs succeed.

## 26. Final Submission Checklist

- [ ] Verify the final file opens from a clean local copy.
- [ ] Confirm required format, codec, duration, aspect ratio, and file size.
- [ ] Confirm title, team, product name, and category are correct.
- [ ] Confirm narration and captions match the visible product.
- [ ] Confirm all quantitative claims remain qualified as estimated/synthetic.
- [ ] Confirm no claim of production, customer adoption, or verified impact.
- [ ] Confirm no personal data, credentials, tokens, or notifications.
- [ ] Confirm audio is intelligible throughout.
- [ ] Confirm there are no frozen frames, cursor accidents, or edit gaps.
- [ ] Confirm opening and closing slates are readable.
- [ ] Confirm music, fonts, icons, and any external assets are licensed.
- [ ] Generate a checksum for the final submission file.
- [ ] Preserve source recording, final export, captions, and submission copy.
- [ ] Have one technical reviewer and one non-technical reviewer watch the final
  version.
- [ ] Obtain explicit human approval before upload.
- [ ] Record submission timestamp and confirmation outside the product repo.

## 27. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation / acceptance gate |
| --- | --- | --- | --- | --- |
| CR08-R01 | Rapid Next input reaches step 4 before Case Detail anchor is ready. | Medium | Medium | Prefetch or gate navigation; require two clean rehearsals. |
| CR08-R02 | Exit restores a slightly shifted scroll position. | Medium | Low | Restore captured scroll exactly and validate before recording. |
| CR08-R03 | Featured case Back returns to Opportunities instead of Overview. | High | Low | Restore origin context or include explicit Overview return in the shot plan. |
| CR08-R04 | Narration implies measured recovery or verified emissions. | Medium | High | Script lock, claims review, captions review, human approval. |
| CR08-R05 | Presenter calls the score a probability or AI prediction. | Low | High | Rehearse approved score wording and keep disclosure visible. |
| CR08-R06 | Recording hides synthetic or human-review disclosures. | Low | High | Safe-area audit and final encoded-frame review. |
| CR08-R07 | Browser or OS notification exposes private information. | Medium | High | Dedicated clean recording session and notification shutdown. |
| CR08-R08 | Local server or wrong checkout serves a different ORBI view. | Medium | Medium | Verify branch, HEAD, URL, title, and hero before recording. |
| CR08-R09 | Audio clipping or low intelligibility weakens judging. | Medium | Medium | Level test, room tone, headphones, and second-device review. |
| CR08-R10 | Video exceeds competition duration or file limit. | Medium | High | Encode a 20-second margin and validate the final file before upload. |
| CR08-R11 | Legacy main bundle produces slow cold start. | Low | Medium | Preload locally before take; do not claim production performance. |
| CR08-R12 | Mobile or zoom layout obscures content in supplemental footage. | Low | Medium | Reuse the seven-viewport matrix and 200% reflow check. |
| CR08-R13 | Editing introduces unsupported text or external assets. | Medium | Medium | Final claims and licensing review after edit. |
| CR08-R14 | Recording software changes color, scale, or frame rate. | Medium | Low | Record a 20-second sample and inspect the encoded output. |
| CR08-R15 | CR-08 presentation changes accidentally alter domain behavior. | Low | High | Restrict code scope and rerun full deterministic regression in a separately authorized module. |

No risk is accepted merely because the video looks polished. High-impact claims,
privacy, data, or domain risks require explicit evidence and human approval.

## 28. Potential Improvements After Competition

Potential post-competition work, subject to separate authorization, includes:

- formal screen-reader and browser-zoom accessibility audits;
- governed production localization with domain-reviewed ES/EN terminology;
- performance budgets and decomposition of the legacy main bundle;
- reusable presentation-safe-area tooling across ORBI modules;
- structured export of evidence and review summaries;
- configurable but governed climate-factor provenance;
- scenario comparison with versioned assumptions;
- reviewer assignments, comments, and audit history in a non-operational
  workflow;
- user research with operators, asset managers, and sustainability teams;
- validation studies comparing prioritization with independently reviewed
  synthetic and later governed datasets;
- security, threat-model, privacy, and data-retention design;
- product analytics only after consent, governance, and privacy approval;
- controlled integration adapters with strict read-only permissions;
- production-grade observability and failure recovery;
- a broader design system and accessibility standard across the ORBI suite.

These are product opportunities, not current repository capabilities or
competition claims.

## 29. CR-09 Roadmap

Recommended CR-09 theme: **Competition Submission Assurance and Evidence Pack**.

### Proposed objectives

- validate the implemented CR-08 presentation flow against the approved script;
- produce a claims-to-screen evidence matrix;
- create final recording, caption, and submission checklists tied to actual
  competition rules;
- perform a formal accessibility and 200% zoom audit;
- establish performance and bundle budgets for the competition path;
- capture final visual evidence at all required viewports;
- document reproducible recording and recovery procedures;
- verify licensing and attribution for every submitted asset;
- preserve an immutable reference to the approved submission commit and video
  checksum without modifying protected historical references;
- obtain explicit human sign-off before any upload or publication.

### Proposed CR-09 gates

1. CR-08 implementation committed and published through separately authorized
   modules.
2. Full tests, lint, build, visual smoke, and recording rehearsal pass.
3. Zero Critical or High findings.
4. All Medium findings explicitly resolved or accepted by the owner.
5. Claims register aligned with final narration and captions.
6. Submission file independently reviewed by technical and non-technical
   reviewers.

CR-09 should not automatically upload, deploy, or publish anything.

## 30. Long-term Product Roadmap

### Horizon 1 — Demonstration hardening

- Complete CR-08 presentation implementation and CR-09 submission assurance.
- Resolve navigation, context restoration, accessibility, and performance debt.
- Preserve deterministic synthetic baselines and reproducible QA.

### Horizon 2 — Validation foundation

- Define governed data contracts and provenance requirements.
- Establish methodology ownership, versioning, and independent review.
- Build offline evaluation packs with known expected outcomes.
- Conduct operator-centered usability and safety research.
- Complete formal accessibility, security, privacy, and threat-model reviews.

### Horizon 3 — Governed pilot architecture

- Design read-only connectors with least privilege and explicit tenancy.
- Add evidence lineage, freshness, quality gates, and audit logging.
- Introduce accountable review roles without operational command authority.
- Validate estimates against approved historical datasets.
- Define incident, rollback, observability, and support procedures.

### Horizon 4 — Enterprise productization

- Multi-portfolio governance and role-based access.
- Configurable methodology with controlled approvals and versioned assumptions.
- Integration with existing maintenance and analytics systems through reviewed
  advisory boundaries.
- Service-level objectives, disaster recovery, compliance evidence, and formal
  customer validation.
- Internationalization and region-specific methodology governance.

### Horizon 5 — Responsible decision intelligence

- Independently validated opportunity prioritization across asset types.
- Auditable human-AI collaboration with calibrated uncertainty.
- Scenario planning that separates measured facts, estimates, hypotheses, and
  decisions.
- Transparent climate-impact accounting aligned with applicable standards.
- Continuous monitoring for drift, misuse, and unintended automation pressure.

Every horizon requires separate scope, evidence, approval, and governance. The
competition demonstration is a product-direction artifact; it is not a shortcut
to production authority.

## Preparation-package approval gate

Before any CR-08 implementation begins, the owner should approve:

- the target duration and competition rules;
- the first-90-seconds strategy;
- the screen and timeline plan;
- the exact narration claims;
- the three CR-07V minor-polish targets;
- the recording-safe layout proposal;
- the risk register and acceptance gates;
- the boundary between CR-08 implementation and CR-09 submission assurance.

Until that approval is granted, this file remains planning documentation only.
