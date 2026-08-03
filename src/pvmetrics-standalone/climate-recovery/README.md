# Climate Recovery deterministic domain and assessment engine

Pure TypeScript domain contracts for the Climate Recovery Edition. This module
represents evidence, diagnostic hypotheses, recoverability, advisory actions,
recovery scenarios, configurable emission factors, climate-impact estimates,
verification, provenance, uncertainty, human review, and double-counting risk.

CR-02 adds `assessClimateRecoveryCase`, a pure deterministic assessment engine.
Its explicit input includes the typed case, evaluation timestamp, factors,
configuration, and requested operations. It evaluates validation, data
sufficiency, evidence balance, recoverability, rule-based hypotheses, estimated
energy loss, simulated scenarios, estimated climate impact, non-binding
recommendations, explainable priority, overlap risk, and traceability. Multi-loss
cases retain individual results in `lossAssessments`.

## Safety boundary

- Hypotheses remain separate from human-confirmed diagnoses.
- Data origin (`measured`, `derived`, `estimated`, `simulated`, `projected`,
  `manually-entered`, or `externally-supplied`) is separate from dataset reality.
- Synthetic data cannot support verified recovery or verified climate impact.
- Recommendations are advisory and require human approval.
- Grid curtailment is not automatically recoverable; communications and sensor
  issues do not by themselves prove energy loss; clipping is not automatically a
  failure.
- Double-counting utilities only flag overlaps for review. They never merge or
  remove loss records.
- Engine output is an assessment aid, never a definitive diagnosis, calibrated
  probability, maintenance order, verified recovery, or certified climate claim.

## Confidence convention

The central thresholds are exported as `CONFIDENCE_THRESHOLDS`: 0.00-0.19 is
very low, 0.20-0.39 low, 0.40-0.59 medium, 0.60-0.79 high, and 0.80-1.00 very
high. These are initial internal conventions, not calibrated probabilities;
very high never means certainty.

## Fixtures

`createSyntheticClimateRecoveryCases()` returns deterministic deep copies of
four fictional cases. Every provenance record includes an explicit synthetic
disclosure. No fixture uses current time, randomness, real coordinates, client
names, or operational telemetry. The emission factor is fictional,
non-default, configurable, and unsuitable for real claims.

## Runtime constraints

The module has no React, DOM, browser, server, storage, network, OpenAI, or
third-party runtime dependency and performs no work during import.

The engine additionally uses no system clock or randomness. Every trace
timestamp derives from the explicit `evaluationTimestamp`, and every generated
ID derives from stable input identifiers.

## Configuration conventions

`DEFAULT_ASSESSMENT_CONFIGURATION` centralizes evidence weights, quality
adjustments, data age, uncertainty ranges, scenario recovery rates, priority
weights, climate gates, and overlap policy. Defaults are synthetic internal
demonstration conventions; they are not calibrated, official, scientific, or
universal.

## Public entry point

```ts
const result = assessClimateRecoveryCase({
  caseData,
  evaluationTimestamp: '2026-07-01T12:00:00Z',
  emissionFactors: caseData.emissionFactors,
  configuration: {},
  requestedOperations: {
    assessEnergyLoss: true,
    generateRecoveryScenarios: true,
    estimateClimateImpact: true,
  },
});
```

The same complete input produces the same complete output. All results require
human review.
