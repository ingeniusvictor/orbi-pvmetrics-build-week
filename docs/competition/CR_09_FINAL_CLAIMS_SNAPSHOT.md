# CR-09 Final Claims Snapshot

Status: submission-language freeze candidate

Source baseline: `40e85b18752bc15ef1de67e762f7580e479f1c91`

Scope: ORBI PVMetrics IA — Climate Recovery Edition for the AI for Climate
Innovation Factory 2026 Competition Edition.

This snapshot controls language used in the submission form, pitch deck,
video, website, interviews, and jury Q&A. Every quantitative statement must
retain its synthetic, estimated, deterministic, and unverified qualifiers.

## A. DEMONSTRATED

The following statements are directly supported by source, tests, build, and
local browser evidence:

- Climate Recovery implements a deterministic domain, assessment engine,
  application service, portfolio service, and read-only executive interface.
- The interface supports Free Explore, an eight-step Guided Demo, Presentation
  Mode, and a nine-chapter Competition Video Mode.
- Spanish and English are supported across the bounded Climate Recovery
  presentation surfaces and competition video flow.
- Users can inspect portfolio KPIs, a five-plant ranking, featured cases,
  accessible chart summaries, detailed case evidence, and a human-review queue.
- Uncertainty, assumptions, limitations, provenance, evidence gaps,
  double-counting risk, and human-review requirements remain visible.
- Competition Video Mode is presenter-controlled, has no autoplay, and provides
  a static 260-second / 4:20 planning guide.
- Exit, Escape, Reset, explicit previous/next controls, context restoration,
  and focus management are implemented.
- The complete repository suite contains 553 passing tests with 0 failures and
  0 skips at the audited baseline.
- TypeScript lint and the production build pass.
- The requested seven desktop, tablet, and mobile viewports passed the final
  local page-overflow and mode smoke.
- Climate Recovery requires no credential, external network, GPT runtime,
  persistence, live data source, or backend service.
- Climate Recovery is read-only and has no dispatch, telecontrol, equipment
  control, work-order creation, or maintenance-execution capability.
- A sanitized tracked-source archive of the audited commit was generated with
  a reproducible SHA-256 checksum.

The phrase **Explainable AI** may be used only to describe the demonstrated
visibility of deterministic rule-derived hypotheses, evidence, traceability,
assumptions, uncertainty, limitations, and human review. It must not imply a
GPT call, statistical model calibration, autonomous diagnosis, or operational
authority.

## B. SYNTHETICALLY DEMONSTRATED

The following statements are demonstrated only with fixed fictional data:

- A portfolio of five synthetic plants and fourteen deterministic synthetic
  cases can be evaluated locally.
- The engine can classify cases as recoverable, partially recoverable,
  non-recoverable, or indeterminate under explicit rules.
- The portfolio presents **129.16 MWh estimated recoverable energy** under
  synthetic counterfactual assumptions and overlap exclusions.
- The portfolio presents **47.92 tCO2e estimated avoided emissions** using a
  configurable fictional factor of 0.371 kgCO2e/kWh where applicable.
- Fourteen cases require human review in the canonical portfolio.
- Aurora Solar ranks first with a Climate Opportunity Score of **92.58**;
  Costa Sur Solar and Patagonia Storage complete the synthetic Top 3.
- Patagonia's possible-overlap handling demonstrates an explicit score penalty
  and exclusion from automatic aggregation.
- The application can propose non-binding read-only reviews, evidence requests,
  and human-approved next steps for fictional cases.
- The system can fail closed when evidence is insufficient or climate impact
  is blocked.

Required qualifiers:

- “synthetic demonstration” or “fictional demonstration data”;
- “estimated” or “projected,” as applicable;
- “not measured or verified” for climate and recovery outcomes;
- “requires human review” for recommendations and proposed next steps.

**Climate Opportunity Score** is an internal transparent demonstration index.
It is not a calibrated probability, scientific validation, official metric,
certification, or automatic operational decision.

## C. PLANNED

These items are planned or awaiting separate human authorization and must not
be represented as completed:

- Human approval and creation of the CR-09 documentation commit.
- Creation of the proposed final tag
  `v0.2.0-pvmetrics-climate-recovery-competition-freeze`.
- Creation of the proposed backup branch
  `backup/pvmetrics-climate-recovery-competition-submission`.
- Publication of the eventual CR-09 commit and final references.
- Capture of official submission screenshots.
- Recording, editing, rendering, encoding, uploading, or submitting the
  official competition video.
- Any production pilot, customer validation, live connector, external
  certification, calibrated model study, measured-recovery program, or
  verified-emissions program.

Planned items are not promises and require their own scope, evidence, safety
review, approvals, and claims update.

## D. EXPLICITLY PROHIBITED

Do not state or imply that:

- ORBI recovered real MWh or reduced, saved, prevented, or avoided verified
  real-world emissions.
- The 129.16 MWh or 47.92 tCO2e values are measured, realized, verified,
  certified, audited, or attributable to operating assets.
- Climate Recovery is production-ready, production-connected, publicly
  deployed, or used in commercial operation.
- The Competition Edition contains real customers, paying customers, real
  pilots, real plants, real coordinates, PII, live SCADA, or operational
  telemetry.
- The system controls BESS, grid assets, inverters, EMS/BMS, SCADA, dispatch,
  maintenance crews, alarms, setpoints, work orders, or field activity.
- A rule-derived hypothesis is a definitive diagnosis, root-cause finding, or
  autonomous decision.
- A recommendation is an approved maintenance order or authorization to act.
- Climate Opportunity Score or confidence is a calibrated probability,
  prediction accuracy, scientific validation, regulatory score, or certified
  metric.
- The fictional emission factor is official, universal, measured, regulatory,
  market-derived, or representative of a real grid or region.
- “Explainable AI” means GPT, OpenAI, Gemini, a network model, or autonomous AI
  runs inside Climate Recovery.
- Competition Video Mode records, generates narration, renders, encodes,
  uploads, submits, or automatically advances the video.
- Recording-safe framing guarantees a valid recording on every device.
- Visual polish validates calculations, recovery, emissions, safety, or
  commercial readiness.
- The whole application is fully bilingual; only the bounded Climate Recovery
  competition surfaces are claimed.
- The optional Incident Copilot advisory has been live-API verified as part of
  CR-09.

## Usage rule

If a statement is not explicitly supported above, classify it as planned or
prohibited until evidence is reviewed and this snapshot is deliberately
updated. Never remove the distinction among source data, rule-derived
inference, simulation, projection, human review, and verified outcome.
