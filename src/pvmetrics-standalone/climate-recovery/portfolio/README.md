# CR-04 synthetic Climate Recovery portfolio

This pure TypeScript module provides a deterministic five-asset, fourteen-case
synthetic portfolio over the CR-01 domain, CR-02 engine, and CR-03 application
service. It produces plant summaries, an executive portfolio presentation,
rankings, a human-review queue, quality and distribution summaries, explicit
overlap aggregation, and a transparent internal Climate Opportunity Score.

All plants, cases, factors, observations, capacities, scenarios, and results are
fictional. The module contains no customer names, coordinates, equipment brands,
live telemetry, network access, credentials, persistence, React, browser access,
or operational commands. Energy and climate values are synthetic estimates;
they are never verified outcomes.

The fixed evaluation timestamp is `2026-08-03T12:00:00.000Z`. The default
aggregation policy is `exclude-overlap`. The same complete input produces the
same output, and every public result is returned as a defensive copy or newly
derived presentation.

`Climate Opportunity Score` is a 0–100 internal demonstration index with
centralized weights and explicit penalties for overlap and insufficient data.
It is not a probability, scientific metric, certification, operational order,
or cross-portfolio benchmark.
