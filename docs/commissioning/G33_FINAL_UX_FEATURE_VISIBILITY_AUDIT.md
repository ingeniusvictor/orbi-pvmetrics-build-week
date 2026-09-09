# G33 — Final UX Polish + Feature Visibility Audit

Status: IN PROGRESS
Branch: `feature/bess-commissioning-workspace`
Scope: final product-facing cleanup after G32 Human Visual E2E certification.

## Purpose

Reduce certification/demo-only chrome from the client-facing Commissioning workspace, preserve all historical code for reuse, and classify adjacent PVMetrics surfaces without deleting them.

## Visibility classes

- `VISIBLE`: part of the product-facing navigation/workflow.
- `INTERNAL`: retained for engineering/QA, not intended for ordinary client-facing navigation.
- `FEATURE_FLAG`: retained and selectively exposed for controlled demos/validation.
- `HIDDEN`: implemented but intentionally not rendered by default.
- `LEGACY`: historical competition/build-week surface retained in source for traceability and reuse, not part of the Commissioning pilot product surface.

## Commissioning surfaces

| Surface | Classification | Decision |
| --- | --- | --- |
| BESS Commissioning Workspace | VISIBLE | Keep in global navigation. |
| Overview | VISIBLE | Keep. |
| Scope | VISIBLE | Keep. |
| Campaigns | VISIBLE | Keep. |
| Tests | VISIBLE | Keep. |
| Anomaly Radar | VISIBLE | Keep. |
| Findings | VISIBLE | Keep. |
| Punch List | VISIBLE | Keep. |
| Evidence | VISIBLE | Keep. |
| Baseline | VISIBLE | Keep. |
| Handover | VISIBLE | Keep. |
| BESS Commissioning Report | VISIBLE | Keep as a separate reporting domain from PV+BESS Reports. |
| Synthetic base lab | FEATURE_FLAG | Keep available for controlled local demo/empty-state validation. |
| Processed E2E certification scenario | INTERNAL | Hidden by default after G32; retained in code for deterministic regression certification. |
| `Core E2E · G19 PASS` badge | HIDDEN | Internal gate language is not client-facing product copy. |
| G32 certification labels | HIDDEN | Certification gate identifiers are removed from ordinary UI. |

## Adjacent PVMetrics surfaces

| Surface | Classification | Decision |
| --- | --- | --- |
| Dashboard | VISIBLE | Core PVMetrics shell. |
| Live Monitoring | VISIBLE | Keep, subject to existing simulation/read-only boundary. |
| Daily / Weekly / Monthly | VISIBLE | Keep. |
| BESS monitoring/advisory | VISIBLE | Keep distinct from Commissioning. |
| Energy Sales | VISIBLE | Keep as existing product domain. |
| SCADA | VISIBLE | Keep existing simulation/read-only semantics; no OT writeback. |
| Plant Profiles | VISIBLE | Keep. |
| Data Sources | VISIBLE | Keep. |
| Signal Mapping | VISIBLE | Keep. |
| Quality Rules | VISIBLE | Keep. |
| Reports | VISIBLE | Keep. |
| Settings | VISIBLE | Keep. |
| Climate Recovery competition presentation layer | INTERNAL | Preserve source and historical competition freeze; remove competition-only chrome from Commissioning pilot-facing navigation in the final enforcement pass. |
| Incident Copilot Build Week surface | LEGACY | Preserve source/history; not part of Commissioning pilot-facing navigation in the final enforcement pass. |

## G32 findings carried into G33 polish

1. Findings summary label `Punch required` is semantically ambiguous because its value counts only unresolved workflow items. Target wording: `Open punch required` or equivalent.
2. Closed synthetic Punch records may display `UNASSIGNED` / `Target date NOT SET`. These values are truthful snapshot data but can look like open administrative debt. Target wording should make clear that these are historical snapshot fields and not a current closure blocker.
3. Processed report traceability bug discovered during G32 was fixed before G33: acceptance scope remains 54 assets while full traceability preserves 9 anomalies / 5 Findings / 3 Punch / 6 evidence records.

## Safety invariants preserved

- No BMS/PCS/EMS/SCADA command path is added.
- No setpoint, protection, energization or dispatch control is introduced.
- ORBI analytical assessment remains separate from human acceptance.
- Root cause is never auto-confirmed.
- `READY` and `PASS` never imply energization authority.
- Excluded assets remain outside acceptance scope while their observations may remain in traceability.
- Historical Climate Recovery and Build Week code is hidden/classified, never deleted by G33.

## G33 execution gates

- G33-A — Visibility policy defined: PASS when this document and feature flags are committed.
- G33-B — Internal Commissioning certification chrome hidden by default: PASS after CI.
- G33-C — Minor Findings/Punch copy polish: PENDING.
- G33-D — Global navigation enforcement for INTERNAL/LEGACY competition surfaces: PENDING.
- G33-E — Final CI + visual smoke: PENDING.

No G33 gate may be interpreted as operational acceptance of a real BESS project.
