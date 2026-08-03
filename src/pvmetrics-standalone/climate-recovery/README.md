# Climate Recovery domain foundation

Pure TypeScript domain contracts for the Climate Recovery Edition. This module
represents evidence, diagnostic hypotheses, recoverability, advisory actions,
recovery scenarios, configurable emission factors, climate-impact estimates,
verification, provenance, uncertainty, human review, and double-counting risk.

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
