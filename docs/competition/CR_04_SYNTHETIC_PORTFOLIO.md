# CR-04 Synthetic Climate Recovery Portfolio

Execution date: 2026-08-03

Portfolio version: `cr-04.0.0-synthetic-portfolio`

## 1. Objective and boundary

CR-04 implements a five-asset, fourteen-case deterministic synthetic portfolio
for ORBI PVMetrics IA — Climate Recovery Edition. It is a canonical source for
future executive, plant, case, ranking, review, data-quality, distribution,
scenario, climate-impact, demo, and pitch presentations.

Every asset, capacity, observation, factor, estimate, scenario, and result is
fictional. There are no customers, coordinates, equipment brands, live sources,
credentials, network calls, persistence, browser APIs, React components, visual
changes, operational commands, verified recovery, or certified climate claims.

## 2. Architecture

The bounded implementation is under
`src/pvmetrics-standalone/climate-recovery/portfolio/`:

```text
contracts/   plant, portfolio, presentation, ranking, queue, and distribution contracts
data/        five plants, fourteen cases, two factors, fixed portfolio configuration
registry/    defensive-copy portfolio, plant, and CR-03-compatible case registries
scoring/     centralized Climate Opportunity Score configuration and calculator
services/    plant summaries, ranking, integrity, and portfolio application service
validation/  cross-registry, synthetic, capacity, BESS, factor, and timestamp checks
fixtures/    compact engine-derived expected invariants
index.ts     controlled public CR-04 entry point
```

`createSyntheticClimateRecoveryPortfolioService()` injects the CR-04 case
registry into CR-03, which invokes CR-02. Plant and portfolio presentation
values therefore derive from existing application and assessment results rather
than manually restating fixture energy or climate values.

## 3. Plants

| Plant | Type | Synthetic capacity | Generic region | Cases |
| --- | --- | ---: | --- | ---: |
| Aurora Solar | utility-pv | 95 MW | northern-zone | 4 |
| Helios Norte | pmgd-pv | 9 MW | central-zone | 3 |
| Valle Verde | pmgd-pv | 6 MW | central-zone | 2 |
| Patagonia Storage | hybrid-pv-bess | 24 MW PV; 12 MW / 48 MWh BESS | southern-zone | 3 |
| Costa Sur Solar | utility-pv | 42 MW | southern-zone | 2 |

The country code `CL` provides generic market context only. No exact location,
address, grid node, customer, real vendor, or operational identity is present.

## 4. Cases and categories

| Sequence | Plant | Case | Category | Demonstration role |
| ---: | --- | --- | --- | --- |
| 1 | Aurora | `DEMO-CR-CASE-A` | inverter | canonical partial recovery and remote review |
| 2 | Aurora | `CR04-CASE-SOILING` | soiling | cleaning assessment gate |
| 3 | Aurora | `CR04-CASE-MPPT` | mppt-or-string | remote review before field work |
| 4 | Aurora | `CR04-CASE-MAINTENANCE-DELAY` | maintenance-delay | recoverable pending-review scenario |
| 5 | Helios | `DEMO-CR-CASE-B` | grid-curtailment | non-recoverable by asset maintenance |
| 6 | Helios | `CR04-CASE-COMMUNICATIONS` | communications | insufficient observability |
| 7 | Helios | `CR04-CASE-CLIPPING` | clipping | design behavior, not automatic failure |
| 8 | Valle | `DEMO-CR-CASE-C` | sensor-quality | canonical fail-closed case |
| 9 | Valle | `CR04-CASE-UNDERPERFORMANCE` | underperformance | degraded-data partial opportunity |
| 10 | Patagonia | `DEMO-CR-CASE-D` | underperformance/inverter | possible overlap |
| 11 | Patagonia | `CR04-CASE-BESS-OPERATION` | bess-operation | strategy context without assumed error |
| 12 | Patagonia | `CR04-CASE-OPERATIONAL-CONFIG` | operational-configuration | review-gated configuration opportunity |
| 13 | Costa Sur | `CR04-CASE-THERMAL-DERATING` | thermal-derating | expected synthetic behavior |
| 14 | Costa Sur | `CR04-CASE-INVERTER-HIGH` | inverter | high/critical synthetic review signal |

The four CR-01/CR-03 canonical IDs remain present. Their fictional plant
identity is assigned to the CR-04 portfolio and their engine scenarios are
regenerated at the CR-04 timestamp. Ten new cases use CR-01 contracts and the
same CR-02 rules.

At the canonical timestamp, CR-02 produces five recoverable, three partially
recoverable, three non-recoverable, and three indeterminate cases. Two cases
have insufficient data. One case contains possible overlap. These results were
fixed only after execution and are documented as compact invariants, not large
snapshots.

## 5. Synthetic emission factors and timestamp

- `Synthetic Chile Grid Demo Factor 2026`: fictional default, `0.371
  kgCO2e-per-kWh`.
- `Synthetic Regional Sensitivity Factor`: fictional alternative, `0.463
  tCO2e-per-MWh`.

Both are synthetic, traceable, configurable, valid at the canonical timestamp,
and explicitly non-official. They exist only to demonstrate calculation and
sensitivity. The fixed portfolio evaluation timestamp is
`2026-08-03T12:00:00.000Z`; no local clock or implicit current time is used.

## 6. Aggregation and overlap

The supported policies are:

- `exclude-overlap` (default): overlap cases are excluded and recorded.
- `include-with-warning`: possible overlap is included provisionally with an
  explicit double-counting warning; confirmed overlap remains excluded.
- `block-aggregation`: any possible or confirmed overlap blocks the total and
  leaves its numeric value absent.

Non-recoverable, insufficient, invalid, blocked, and unavailable scenarios are
not summed. Missing values remain unavailable; they are not converted to zero.
Confirmed overlap caps scoring and blocks aggregation eligibility.

## 7. Climate Opportunity Score

Climate Opportunity Score is a transparent internal 0–100 demonstration index:

| Component | Maximum |
| --- | ---: |
| estimated recoverable energy | 30 |
| recoverability | 20 |
| CR-02 priority | 15 |
| confidence | 10 |
| data quality | 10 |
| climate-impact availability | 10 |
| human-review readiness | 5 |
| possible/confirmed overlap penalty | −15 |
| insufficient-data penalty | −20 |

The weights and reference values are centralized. Scores are clamped to 0–100,
carry a component explanation, and use bilingual bands: minimal, low, moderate,
high, and very-high. Insufficient data caps a score at 59; confirmed overlap
also prevents a score above moderate. The score is not scientific, certified,
probabilistic, operational, or comparable outside this demonstration.

The canonical ranking is Aurora Solar, Costa Sur Solar, Patagonia Storage,
Valle Verde, and Helios Norte. Ranking order is score descending, high-priority
case count descending, recoverable energy descending, then plant name ascending.
It does not dispatch, schedule, or authorize maintenance.

## 8. Plant summaries and executive presentation

Plant summaries expose case-state counts, pending review, overlap warnings,
eligible estimated energy and climate impact, highest priority, data-quality
status, score, featured case, next human step, disclosures, warnings, and
limitations. Featured-case selection uses priority, recoverable energy, data
quality, review requirement, explicit featured metadata, then stable case ID.

The portfolio executive presentation combines the CR-03 portfolio summary,
five plant summaries, rankings, featured CR-03 case presentations, review queue,
quality overview, recoverability and priority distributions, climate status,
aggregation policy, exclusions, warnings, disclosures, and safe metadata.

## 9. Human-review queue

The queue is derived from high/critical priority, overlap, insufficient data,
blocked climate impact, field or maintenance recommendation gates,
contradicted hypotheses, and `needs-more-data`. Each item records reasons,
relative urgency, review type, evidence gaps, and deterministic `dueOrder`.
There are no due dates, work orders, dispatch records, or state mutation.

## 10. Data quality and distributions

Data quality uses the CR-01 statuses `valid`, `degraded`, `incomplete`, `stale`,
`conflicting`, `unavailable`, and `unknown`, with counts, percentages, and
affected case IDs. It describes evidence fitness and is explicitly separate
from asset health.

Recoverability distribution covers recoverable, partially recoverable,
non-recoverable, indeterminate, and not assessed. Priority distribution covers
informational, low, medium, high, and critical. Insufficient energy data cannot
produce critical priority without separate safety risk. All priority values are
synthetic review aids, not operational priorities.

## 11. Metadata and public API

Metadata declares five plants, fourteen cases, fixed timestamp, Spanish and
English support, synthetic reality, configurable synthetic factors, no
credentials, no network, and `productionOperational: false`.

The controlled public exports are the portfolio/plant/presentation contracts,
`createSyntheticClimateRecoveryPortfolioService`, the score calculator and
configuration, portfolio configuration, metadata, and version. Internal data,
registries, validation details, and service helpers are not public exports.

## 12. Tests and QA scope

CR-04 adds 64 focused tests covering the requested portfolio, registry,
category, scoring, aggregation, queue, quality, distribution, metadata,
determinism, non-mutation, and runtime-boundary behaviors. Historical tests are
unchanged. Exact final commands and repository totals are recorded in the
completion report after QA.

## 13. Claims, limitations, and risks

Permitted claims are limited to local deterministic evaluation and presentation
of this synthetic portfolio. No result represents a real plant, customer,
production outcome, recovered energy, verified emissions, official factor,
scientifically validated score, autonomous decision, or production connection.

Operational adoption would require governed real inputs, factor authority,
method validation, calibration, security, safety processes, accountable human
approval, and explicit product scope. A future visual module must preserve
unavailable values, overlap exclusions, synthetic disclosure, and review gates.

## 14. Suggested next module

CR-05 may add a read-only executive UI over the CR-04 service after separate
review. It must not calculate portfolio values in React, hide exclusions, imply
verified outcomes, or introduce operational mutation.
