# CR-03 Climate Recovery Application Service

Execution date: 2026-08-03

Presentation version: `cr-03.0.0-presentation`

## 1. Purpose

CR-03 adds a pure TypeScript boundary that transforms CR-02 deterministic
assessment results into stable presentation models for a possible future UI.
It does not add a dashboard, React component, route, browser dependency,
backend, network operation, persistence, generative AI, or live data.

```text
ClimateRecoveryCase
  -> AssessmentInput
  -> deterministic CR-02 engine
  -> CR-03 application service
  -> presentation models
  -> future consumer
```

Every numeric presentation value carries availability, origin, dataset reality,
estimate/projection flags, unit, formatted value, disclosure, and limitations.
Unavailable or blocked values are absent; zero is never used as a fallback.

## 2. Architecture

The implementation is isolated in
`src/pvmetrics-standalone/climate-recovery/application/`:

```text
contracts/    application, query, and presentation contracts
formatters/   deterministic number, energy, emissions, percent, and UTC dates
presenters/   executive, KPI, scenario, action, timeline, explainability, status
registry/     typed configuration, bilingual text, immutable demo cases
services/     catalog, detail orchestration, and portfolio aggregation
index.ts      controlled CR-03 entry point
```

`createClimateRecoveryApplicationService(dependencies)` injects the registry,
assessment engine, application configuration, and text resolver. There is no
mutable singleton or stored application state.

## 3. Contracts and application service

The root `CaseDetailPresentation` includes an executive summary, eight initial
KPIs, recovery score, loss overview, hypotheses, evidence, non-binding actions,
scenarios, climate impact, timeline, explainability, warnings, limitations,
disclosures, operation descriptors, and version metadata.

The service provides local catalog, detail, summary, KPI, timeline,
explainability, portfolio, evaluation, filter, and metadata queries. A missing
case returns a typed error result. Synthetic scores set `isOperational: false`;
synthetic climate values set `isVerified: false`; all actions set
`isBinding: false`.

## 4. Queries, filters, and sorting

Queries require an explicit evaluation timestamp and locale. Optional CR-02
configuration overrides remain explicit. The catalog supports category,
recoverability, priority, confidence, data sufficiency, human review, climate
availability, and synthetic-only filters.

Deterministic sorting supports priority, recoverable energy, climate impact,
confidence, evaluated timestamp, and title. Pagination is local and in-memory;
it does not imply a remote API or persistence.

## 5. Demo registry

The canonical registry wraps the four CR-01 fixtures: inverter/MPPT recovery,
non-recoverable grid curtailment, insufficient sensor data, and possible
double-counting overlap. Display identities are fictional. `list()` and
`getById()` return defensive copies. `validate()` explicitly checks unique IDs,
metadata, disclosure, and CR-01 validity without an import-time side effect.

## 6. Executive summaries and KPIs

Deterministic bilingual templates put insufficient data, non-recoverability, or
overlap warnings before opportunity language. They use cautious language and
never convert a hypothesis into a diagnosis or a recommendation into an order.

The initial KPIs cover estimated energy loss, projected recoverable energy,
estimated avoided emissions, priority, confidence, data sufficiency,
recommended-action count, and human-review status. Source references and
limitations are mandatory. Confidence is explicitly an internal qualitative
score, not a calibrated probability.

## 7. Timeline and explainability

The timeline is derived only from fixture and assessment timestamps, with
stable timestamp/ID ordering. No clock or random value is consulted. Technical
trace output is reduced to selected rule/version highlights.

Explainability retains supporting and contradicting evidence, missing evidence,
assumptions, limitations, useful rules and versions, confidence language, and
the human-authority boundary. Hypotheses remain unconfirmed.

## 8. Formatters and localization

Pure formatters support Wh, kWh, MWh, GWh, kgCO2e, tCO2e, normalized
percentages, finite numbers, compact notation, and explicit-timezone dates.
Non-finite values become unavailable. Calculations use numeric engine values,
never parsed formatted strings.

The small CR-03 text registry provides the required English and Spanish labels,
disclosures, narratives, actions, review language, and timeline labels.
`resolveClimateRecoveryText()` uses controlled placeholders and deterministic
fallback with an explicit limitation. This is not application-wide i18n or a
complete bilingual UI.

## 9. Portfolio aggregation and double counting

The portfolio summary is limited to synthetic cases. Non-recoverable and
insufficient-data cases contribute no recovery or climate total. Policies are:

- `exclude-overlap` (default): exclude overlap cases and record their IDs;
- `include-with-warning`: include provisionally and warn about double counting;
- `block-aggregation`: return blocked totals without a zero fallback.

Overlaps are never silently consolidated. Aggregates are synthetic estimates,
not operational, commercial, verified, or externally validated impact.

## 10. Operations and metadata

Case details describe review, warning acknowledgement, evidence/methodology
inspection, scenario comparison, more-data request, and summary export. These
descriptors execute no command and mutate no review state.

Metadata declares the product and versions, synthetic reality, locales, and
that credentials, network access, and production operation are false.

## 11. Tests

CR-03 adds 65 tests covering the four narratives, typed not-found behavior,
determinism, registry validation, unavailable/blocked values, disclosures,
estimate/projection flags, actions and approval gates, KPIs, timelines,
explainability, formatters, bilingual resolution, filters, sorting, aggregation
policies, non-mutation, metadata, versions, and forbidden runtime dependencies.
Historical tests are unchanged. No dependency or lockfile change is required.

## 12. Limitations and risks

- Only four synthetic fixtures are presented.
- No statistical, causal, scientific, or operational validation is provided.
- No official factor or verified energy/climate outcome is present.
- Portfolio totals are illustrative and depend on explicit overlap policy.
- English/Spanish coverage is limited to CR-03 content.
- A future UI must preserve disclosures, blocking reasons, and review gates.

## 13. Suggested next module

A later reviewed module may consume these models in a read-only UI. It must not
bypass this service, erase unavailable state, hide synthetic disclosure, imply
calibrated probability, or add operational mutation without separate scope and
governance.
