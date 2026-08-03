# CR-02 Deterministic Climate Recovery Assessment Engine

Execution date: 2026-08-03

Engine version: `cr-02.0.0-deterministic-assessment`

## 1. Objective

CR-02 implements a pure TypeScript application-service layer over the CR-01
domain foundation. Given the same typed case, explicit evaluation timestamp,
configuration, requested operations, and emission factors, it returns the same
assessment result. The result covers input validation, data sufficiency,
evidence balance, recoverability, deterministic hypotheses, estimated energy
loss, simulated recovery scenarios, estimated climate impact, non-binding
recommendations, priority, double-counting risk, traceability, limitations, and
mandatory human review.

The engine does not provide a definitive diagnosis or an operational command.

## 2. Architecture

The implementation remains isolated under
`src/pvmetrics-standalone/climate-recovery/`:

```text
contracts/assessment.ts           public CR-02 contracts
engine/configuration.ts           centralized defaults and validation
engine/version.ts                 single engine version
engine/assessmentTrace.ts         deterministic trace records
engine/dataSufficiency.ts         availability, age, quality and blocking rules
engine/evidenceAssessment.ts      normalized explainable evidence weighting
engine/recoverabilityAssessment.ts category-specific recoverability rules
engine/hypothesisEngine.ts        versioned deterministic hypotheses
engine/energyLossAssessment.ts    permitted initial energy methods
engine/scenarioEngine.ts          no-intervention/intervention simulations
engine/climateImpactEngine.ts     fail-closed configurable factor calculation
engine/recommendationEngine.ts    advisory action rules and suppression
engine/priorityEngine.ts          explainable 0–100 priority
engine/assessmentEngine.ts        pure orchestrator
engine/index.ts                   controlled engine exports
assessmentEngine.test.ts          CR-02 deterministic test suite
```

No engine file imports React, DOM, browser, server, network, storage, OpenAI, or
third-party runtime APIs. No import-time work is performed.

## 3. Engine flow

`assessClimateRecoveryCase(input)` performs the following deterministic stages:

1. CR-01 and CR-02 input validation.
2. Data-sufficiency assessment per loss.
3. Evidence scoring per loss.
4. Recoverability classification.
5. Versioned rule-based hypothesis generation.
6. Estimated energy-loss calculation.
7. Recovery-scenario simulation.
8. Configurable climate-impact estimation.
9. Non-binding recommendation generation.
10. Explainable priority calculation.
11. Double-counting reporting without mutation or consolidation.
12. Final status, warnings, limitations, and human-review gate.

Case-level output exposes the primary loss for simple consumers and retains
every individual result in `lossAssessments` for multi-loss cases.

## 4. Configuration

`DEFAULT_ASSESSMENT_CONFIGURATION` centralizes all demonstrative conventions:

- minimum evidence count: 1;
- minimum supporting evidence weight: 0.4;
- maximum data age: 1,440 minutes;
- default evidence weight: 0.5;
- explicit evidence-quality multipliers;
- priority component maxima totaling 100 before effort adjustment;
- priority reference values used only for deterministic scaling;
- uncertainty conventions of ±10%, ±20%, and ±35%;
- recovery rates of 0.70 for recoverable and 0.35 for
  partially-recoverable loss;
- no scenario rate for indeterminate or not-assessed loss;
- default seven-day horizon;
- provisional treatment of possible overlap and blocking of confirmed overlap;
- explicit climate and synthetic-projection policy gates.

These defaults are internal demonstration assumptions. They are configurable,
not scientifically calibrated, not official, and not universally applicable.

## 5. Validation and fail-closed behavior

The orchestrator runs `validateClimateRecoveryCase` before assessment. Any
CR-01 validation error, malformed case structure, invalid explicit timestamp,
empty loss set, or invalid configuration returns an `invalid` result. All later
trace stages remain visible as skipped and no energy or climate calculation is
performed.

Climate-impact validation is scoped and fail-closed: a missing, invalid,
expired, untraceable, or methodologically incomplete factor blocks or
invalidates climate output. Invalid custom horizons and recovery rates return
invalid scenarios without emitting recovery.

## 6. Data sufficiency

The engine evaluates evidence counts, direction, weights, quality, age,
timestamps, trace IDs, expected/comparison inputs, analysis windows, requested
emission factors, and category-specific requirements. It returns `sufficient`,
`partially-sufficient`, `insufficient`, or `invalid`, plus blocking reasons,
warnings, source lists, missing fields, requested data, and an optional
confidence cap.

Communications and sensor-quality evidence affect observability and do not by
themselves prove energy loss. Unknown categories request more data. Clipping
requires explicit design/nameplate/DC-AC context. Grid curtailment remains a
classification rather than a default asset-recovery opportunity.

## 7. Evidence assessment

Evidence uses explicit base weights and configured quality multipliers.
Supporting evidence adds, contradicting evidence subtracts, neutral evidence
does not alter net direction, and unavailable evidence reduces sufficiency.
Invalid weights are excluded with a recorded reason. Strongest supporting and
contradicting IDs remain visible. Scores are normalized qualitative weights,
not probabilities.

## 8. Recoverability

Category rules return `recoverable`, `partially-recoverable`,
`non-recoverable`, `indeterminate`, or `not-assessed` with reasons, exclusions,
blocking conditions, treatment, confidence, and human-review requirement.

- Grid curtailment is non-recoverable through asset maintenance.
- Communications and sensor-quality cases remain indeterminate without valid
  independent data.
- Soiling requires cleaning assessment before intervention.
- Inverter and MPPT cases start with remote review.
- Thermal derating distinguishes expected behavior from partial recovery.
- Clipping is not automatically a fault.
- BESS operation requires operating-strategy context.
- Unknown cases request more data.

## 9. Hypothesis generation

Versioned rule IDs include `CR-HYP-INV-001`, `CR-HYP-MPPT-001`,
`CR-HYP-SOIL-001`, `CR-HYP-COMM-001`, `CR-HYP-SENSOR-001`,
`CR-HYP-GRID-001`, `CR-HYP-CLIP-001`, `CR-HYP-BESS-001`, and
`CR-HYP-UNKNOWN-001`. Generated hypotheses retain evidence for, evidence
against, missing data, alternatives, assumptions, limitations, confidence, and
human review. Contradictory evidence caps confidence; insufficient critical
data prevents high confidence. The engine never emits `confirmed-by-human`.

## 10. Energy-loss assessment

Initial permitted methods are:

- `direct-difference`: `max(0, expectedEnergyKwh - actualEnergyKwh)`;
- `power-duration`: `estimatedPowerLossKw × durationHours`;
- `peer-comparison`: valid peer/actual difference or the typed synthetic peer
  estimate;
- `unavailable`: fail-closed result when inputs are insufficient.

Outputs never become negative, remain `estimated`, record inputs and units,
propagate the configured uncertainty convention, and never become measurement
or verified recovery. No real meteorological factor is applied.

## 11. Recovery scenarios

The scenario engine supports immediate, daily, seven-day, thirty-day,
ninety-day, and positive whole-day custom horizons. No-intervention loss
persists under an explicit assumption. Intervention applies a configurable
rate within 0..1 and never defaults to 100%. Non-recoverable loss is blocked;
indeterminate loss is unavailable. Every generated scenario is labeled
simulated/projected and bounded by the difference between its two branches.

## 12. Climate impact

Climate impact is calculated only from a valid positive recovered-energy
scenario and a valid factor selected explicitly from `AssessmentInput`.

```text
avoidedEmissionsKgCO2e = recoveredEnergyKwh × normalizedFactorKgCO2ePerKwh
```

Both `kgCO2e-per-kWh` and `tCO2e-per-MWh` are supported; they are numerically
equivalent because 1 tCO2e/MWh equals 1 kgCO2e/kWh. Factor identity, value,
source, methodology, validity interval, assumptions, and limitations are
checked. Synthetic results remain estimated or projected and can never be
verified. Every value is described as a counterfactual estimate.

## 13. Recommendations

Category mappings produce non-binding advisory records with rationale,
evidence, uncertainty, prerequisites, safety notes, approval, and pending human
review. Remote review precedes inverter/MPPT field inspection. Cleaning
assessment precedes soiling maintenance. Corrective actions are suppressed for
non-recoverable loss. Field and maintenance actions remain suppressed until
their review, safety, and approval conditions are met.

## 14. Priority

Priority is clamped to 0–100 and separated into informational, low, medium,
high, and critical bands. Its explicit components are energy impact,
operational severity, urgency, confidence, data quality, recoverability,
persistence risk, safety risk, climate impact, and effort adjustment.

Insufficient energy data and very-low confidence cap energy-driven priority
below high unless a distinct safety risk exists. Non-recoverable loss receives
no recoverability points. Synthetic priority is demonstrative, never an
operational order. High and critical bands require human review.

## 15. Double counting

CR-02 reuses the CR-01 pairwise utility. Possible overlap emits a warning and
preserves individual results as provisional for aggregation. Confirmed overlap
blocks climate aggregation by default. Losses are never merged, deleted,
excluded, or consolidated automatically. Reasons, related IDs, treatment, and
human-review requirements are recorded in output and trace.

## 16. Traceability and versioning

Every result contains all 12 required trace stages. Trace IDs are derived from
the deterministic assessment ID and sequence. Every timestamp equals the
explicit `evaluationTimestamp`; no system clock is used. Inputs are referenced
by stable IDs, and summaries avoid duplicating large objects. The version is
declared once as `CLIMATE_RECOVERY_ENGINE_VERSION` and propagated to the result,
trace, and generated hypothesis rule version.

## 17. Synthetic fixture results

- Case A: partially sufficient because contradictory evidence remains visible;
  partially recoverable; estimated energy; simulated scenario; estimated
  climate impact with a fictional factor; remote review first; medium priority;
  mandatory human review.
- Case B: grid curtailment is non-recoverable through asset maintenance; no
  recovered energy; monitoring/escalation/no-action only; no field inspection
  or climate recovery claim.
- Case C: insufficient sensor data; indeterminate; more-data request; no energy
  or climate result; limited priority and confidence.
- Case D: both individual priorities remain present; possible overlap is
  reported; no automatic aggregation; mandatory human review.

## 18. Tests and QA scope

CR-02 adds 51 deterministic tests covering the 48 requested acceptance areas,
including reproducibility, forbidden clocks/randomness, validation gates,
category rules, evidence quality, every energy method, uncertainty,
scenarios, both emission-factor units, factor failures, synthetic ceilings,
priority, double counting, trace completeness, versioning, and fixtures A–D.
The complete repository suite now contains 110 tests: 59 pre-existing tests and
51 CR-02 tests. Historical test files were not modified.

## 19. Limitations and risks

- No statistical calibration, causal inference, or scientific validation.
- No live plant, SCADA, weather, meter, or maintenance data.
- No official or real default emission factor.
- No verified energy recovery or avoided emissions.
- No UI, persistence, authentication, API, backend, network, or deployment.
- No GPT, other generative model, telecontrol, dispatch, or autonomous action.
- Multi-loss aggregation remains intentionally conservative and review-gated.
- Operational use would require governed inputs, calibration, independent
  validation, safety processes, and accountable human authority.

## 20. Claims boundary

Permitted CR-02 claims are limited to deterministic assessment of synthetic
cases, explicit insufficiency and overlap flags, non-binding recommendations,
configurable synthetic scenarios and climate estimates, traceability,
uncertainty, and human review. The engine is not operational, statistically
validated, certified, autonomous, or connected to live assets.

## 21. Suggested next module

CR-03 may add a deterministic presentation adapter or reviewed application
boundary over CR-02 outputs. It must preserve the contracts, fail-closed gates,
synthetic disclosure, non-binding language, and human authority before any UI
or external integration is considered.
