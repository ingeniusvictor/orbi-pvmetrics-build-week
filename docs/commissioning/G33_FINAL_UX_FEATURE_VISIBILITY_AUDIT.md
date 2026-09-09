# G33 — Final UX Polish + Feature Visibility Audit

Status: PASS
Branch: `feature/bess-commissioning-workspace`
Release candidate status: COMMISSIONING MVP RELEASE CANDIDATE
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
| Climate Recovery competition presentation layer | INTERNAL | Preserved in source and historical competition freeze; hidden from ordinary Commissioning pilot-facing navigation. |
| Incident Copilot Build Week surface | LEGACY | Preserved in source/history; hidden from ordinary Commissioning pilot-facing navigation. |

## G32 findings carried into G33 polish

1. Findings summary label `Punch required` was semantically ambiguous because its value counts only unresolved workflow items. Resolved with clearer open-workflow wording.
2. Closed synthetic Punch records could display `UNASSIGNED` / `Target date NOT SET`, which looked like open administrative debt. Resolved by presenting missing historical fields as `NOT RECORDED` for closed records.
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

- G33-A — Visibility policy defined: PASS.
- G33-B — Internal Commissioning certification chrome hidden by default: PASS.
- G33-C — Minor Findings/Punch copy polish: PASS.
- G33-D — Global navigation enforcement for INTERNAL/LEGACY competition surfaces: PASS.
- G33-E — Final CI + visual smoke: PASS.

## Final visual smoke evidence

The final desktop smoke confirms the intended product-facing state:

- `Commissioning` remains visible in the global navigation.
- Climate Recovery is hidden from ordinary navigation.
- Incident Copilot / Build Week is hidden from ordinary navigation.
- `Core E2E · G19 PASS` internal badge is not rendered.
- The processed E2E certification scenario is not rendered in the ordinary empty state.
- The controlled `Abrir laboratorio sintético` surface remains available.
- Commissioning still exposes Overview, Scope, Campaigns, Tests, Anomaly Radar, Findings, Punch List, Evidence, Baseline and Handover.
- Shadow Mode / No OT Writeback safety chrome remains visible.

## Final verdict

G33 PASS. The branch is accepted as the ORBI PVMetrics BESS Commissioning MVP Release Candidate for subsequent integration/release planning. This certification does not merge the branch, does not authorize production deployment, and does not represent operational acceptance of a real BESS project.
