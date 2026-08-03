# CR-01 Climate Recovery Domain Foundation

Execution date: 2026-08-03

Edition: ORBI PVMetrics IA — Climate Recovery Edition

Competition: AI for Climate Innovation Factory 2026

Category: Renewable Energy Integration and Efficiency

## 1. Objective

CR-01 establishes a pure, typed, deterministic domain for representing
potentially recoverable energy losses, evidence, diagnostic hypotheses,
uncertainty, advisory actions, recovery scenarios, configurable climate-impact
estimates, before/after verification, data provenance, human review, and
double-counting risk.

This foundation is representational and defensive. It does not make Climate
Recovery operational and does not calculate production climate results.

## 2. Architecture

The capability is isolated under
`src/pvmetrics-standalone/climate-recovery/`, following the preferred location
in the CR-01 specification and preserving existing application boundaries.

```text
climate-recovery/
├── index.ts                     public API
├── types/                       taxonomy, common values, validation results
├── contracts/                   domain entities and aggregate root
├── validation/                  primitives, traceability, recovery, impact, case
├── utils/                       confidence and double-counting rules
├── fixtures/                    fixed synthetic cases
├── climateRecovery.test.ts      focused Node test-runner suite
└── README.md                    local safety and usage boundary
```

There are no imports from React or visual components. The module does not use
the DOM, browser state, network calls, OpenAI, server processes, current time,
randomness, or import-time side effects.

## 3. Canonical taxonomy

- Data origin: `measured`, `derived`, `estimated`, `simulated`, `projected`,
  `manually-entered`, `externally-supplied`.
- Dataset reality: `synthetic`, `sanitized`, `anonymized`, `operational`,
  `unknown`.
- Data quality: `valid`, `degraded`, `incomplete`, `stale`, `conflicting`,
  `unavailable`, `unknown`.
- Confidence: `very-low`, `low`, `medium`, `high`, `very-high` plus an optional
  normalized score.
- Human review: `not-requested`, `pending`, `reviewed`, `accepted`, `rejected`,
  `needs-more-data`, `superseded`.
- Recoverability: `recoverable`, `partially-recoverable`, `non-recoverable`,
  `indeterminate`, `not-assessed`.
- Verification: `not-started`, `collecting-post-action-data`,
  `insufficient-data`, `estimated-recovery`, `provisionally-verified`,
  `verified`, `not-recovered`, `inconclusive`.
- Loss categories: availability, underperformance, soiling, thermal derating,
  inverter, MPPT/string, communications, sensor quality, grid curtailment,
  clipping, BESS operation, operational configuration, maintenance delay, and
  unknown.
- Operational severity: informational through critical.
- Recovery horizon: immediate, daily, 7, 30, or 90 days, or custom.

The taxonomy is extensible through additive contract changes. No existing
PVMetrics type was modified or overloaded.

## 4. Entities

The domain implements `DataProvenance`, `EvidenceItem`,
`DiagnosticHypothesis`, `RecoverableLoss`, `RecommendedAction`,
`EmissionFactor`, `ClimateImpactEstimate`, `RecoveryScenario`,
`RecoveryVerification`, and the aggregate root `ClimateRecoveryCase`.

The aggregate connects plant and asset identity to every loss, evidence item,
hypothesis, action, scenario, factor, impact estimate, verification, trace, and
human-review state. Reference validation prevents silent orphan records.

## 5. Invariants and validators

Validators are pure and return `ValidationResult<T>` with typed issues, errors,
and warnings. Expected bad data does not throw.

Implemented checks include:

- ISO 8601 timestamps with timezone and ordered time windows;
- finite and non-negative values;
- normalized confidence scores and centralized level consistency;
- ordered, non-negative uncertainty bounds;
- mandatory identifiers and explicit arrays;
- synthetic disclosure and trace identifiers;
- origin/reality coherence;
- recoverability and action consistency;
- hypothesis evidence, limitations, and human confirmation;
- custom scenario horizon and internally consistent recovery energy;
- emission-factor presence, validity, identity, methodology, and validity dates;
- synthetic and degraded-data verification ceilings;
- field safety notes and mandatory human approval;
- cross-entity reference integrity and unique case identifiers;
- explicit accounting of contradictory evidence;
- double-counting warnings without automatic consolidation.

Grid curtailment is not automatically recoverable. Communications and sensor
quality affect observability but do not independently prove energy loss.
Clipping is not automatically treated as equipment failure. Unknown loss
categories require more evidence before becoming actionable.

## 6. Data provenance

`DataProvenance` records source, source type, data origin, dataset reality,
quality, observation and validity times, methodology, assumptions, limitations,
synthetic disclosure, and a trace identifier. `assumptions` and `limitations`
remain explicit even when empty.

All new Competition Edition fixtures use `datasetReality: synthetic` and an
unambiguous disclosure. No fixture contains real customer, plant, coordinate,
SCADA, weather, personal, or credential data.

## 7. Measurement, derivation, estimation, simulation, and projection

- `measured` means directly observed from an operational source or instrument;
  it does not mean correct or verified.
- `derived` means deterministically calculated from known inputs.
- `estimated` means inferred with stated uncertainty and assumptions.
- `simulated` means generated for demonstration, testing, or scenario analysis.
- `projected` means a future value under explicit assumptions.

Data origin is independent from dataset reality. A synthetic fixture remains
synthetic even when it represents the shape of a measurement workflow. Current
fixtures label fictional raw values as simulated and loss/impact values as
estimated or simulated, never as operational measurement.

## 8. Hypothesis, human diagnosis, recommendation, and verification

A diagnostic hypothesis links supporting, contradicting, and missing evidence.
It is not a diagnosis. Only `confirmed-by-human` can represent human
confirmation, and validation requires completed human review.

A recommended action is advisory, non-binding, and always requires approval. It
is not a dispatch order. Field and maintenance actions require safety notes.

A recovery scenario is a simulation, not a guaranteed prediction. A recovery
verification is a distinct before/after artifact with confounding factors,
quality, uncertainty, normalization disclosure, and human review.

## 9. Confidence and uncertainty

The single initial confidence convention is:

| Score | Level |
| --- | --- |
| 0.00–0.19 | very-low |
| 0.20–0.39 | low |
| 0.40–0.59 | medium |
| 0.60–0.79 | high |
| 0.80–1.00 | very-high |

`clampConfidenceScore`, `deriveConfidenceLevel`, and
`validateConfidenceConsistency` share that convention. These thresholds are
internal qualitative conventions, not calibrated probabilities. Very high
does not mean certainty.

Energy and climate quantities carry ordered uncertainty ranges with unit,
descriptor, and methodology. Negative values are rejected.

## 10. Human review

Hypotheses and recommendations require human review. Human-confirmed
hypotheses, verified recovery, verified climate impact, and closed cases require
completed human review. External AI origin never grants higher confidence or
human authority.

## 11. Double-counting prevention

`assessDoubleCounting` compares plant, asset, overlapping windows, related
categories, explicit double-counting groups, evidence, and hypotheses. It
returns `clear`, `possible-overlap`, `confirmed-overlap`, or
`insufficient-information`, plus reasons and a treatment recommendation.

The utility never merges, removes, or changes losses. Possible and confirmed
overlaps require human review before aggregation. Full-case validation exposes
the risk as a warning so evidence remains intact.

## 12. Emission factors

Emission factors are configurable and traceable by identity, region/system,
value, unit, year, source, methodology, origin, reality, quality, validity,
assumptions, and limitations. `isDefault` does not mean universal.

CR-01 contains one clearly fictional, non-default factor only. Climate-impact
validation fails closed when the factor is missing, mismatched, or invalid.
No real or universal factor is embedded.

## 13. Limitations

- Contracts and defensive validation only; no production calculations.
- No statistical calibration of confidence.
- No causal inference or definitive diagnosis.
- No live data source, persistence, authentication, or external validation.
- Double-counting detection is a conservative deterministic review aid.
- No commercial or verified climate claim can be produced from the fixtures.

## 14. Synthetic fixtures

- Case A: possible inverter/MPPT underperformance with supporting and minor
  contradictory evidence, remote review first, simulated recovery, fictional
  factor, estimated climate impact, and no real verification.
- Case B: grid curtailment classified as non-recoverable by asset maintenance;
  no operational recovery or climate impact is counted.
- Case C: missing sensor/reference data, low confidence, request for more data,
  and no energy or climate-impact claim.
- Case D: general underperformance and inverter-specific assessments share
  evidence and overlapping windows, producing `possible-overlap`.

All timestamps and identifiers are fixed and reproducible.

## 15. Tests

CR-01 adds 27 focused tests covering confidence, range ordering, negative
values, synthetic disclosure, hypothesis review, verification ceilings,
emission factors, custom horizons, field safety, recoverability, the four
fixture behaviors, deterministic reproduction, complete-case validation,
non-negative values, and non-mutating double-counting assessment.

The combined suite contains 59 tests: 32 historical tests plus 27 new tests.
Historical test files were not changed.

## 16. Explicitly not implemented

No dashboard, screen, navigation, chart, card, command center, GPT integration,
SCADA connector, backend, database, API, form, remote persistence, deployment,
production climate calculation, advanced prioritization, visual simulator,
visual verification, branding change, telecontrol, dispatch, or equipment
command was implemented.

## 17. Dependencies

No dependency was added, removed, or updated. CR-01 uses TypeScript and the
existing Node test runner/`tsx` setup. `package-lock.json` remains unchanged.

## 18. Risks

Future modules must keep UI wording aligned with these distinctions and must
not bypass validators. Real emission factors, operational verification,
normalization methods, and calibrated confidence require separate governance,
data authority, and validation. Cross-asset double counting may require more
domain-specific grouping rules later.

## 19. Suggested next module

CR-02 should add a deterministic application-service boundary that consumes
these contracts and validators without UI, persistence, GPT, or live data. It
should preserve explicit provenance, review gates, and fail-closed climate
impact behavior.
