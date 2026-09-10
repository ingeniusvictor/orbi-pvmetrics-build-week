# G34-J — Final Framework Certification and Freeze

Status: **PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING**

Branch: `feature/bess-commissioning-workspace`

Input baseline: `71f6221b886eff7302e597c364c8ce7afee1007e`

## Purpose

G34-J formally reconciles and freezes the generic ORBI PVMetrics BESS
Commissioning framework through G34-I. It certifies the maturity of the
offline, read-only framework and its documented safety boundaries only.

This status does **not** mean project acceptance, energization, operation,
dispatch, commissioning completion, operational authority or any connection to
a real plant.

## G34-A through G34-I reconciliation

| Gate | Certified reconciliation state |
|---|---|
| G34-A | PASS — Release Candidate baseline and prior CI preserved. |
| G34-B | PASS — Pilot Intake Contract defined. |
| G34-C | PASS — Offline Pilot Readiness Validator implemented and tested. |
| G34-D | PASS — Controlled Manual Intake UI, CI and human visual smoke certified. |
| G34-E | **FRAMEWORK READY — PENDING VERIFIED REAL PILOT INPUTS**. |
| G34-F | **FRAMEWORK PATH READY — PENDING REAL DATA**. |
| G34-G | **FRAMEWORK READY — REAL PACK PENDING REAL PILOT DATA**. |
| G34-H | **PASS — IMPLEMENTED, CI CERTIFIED AND HUMAN NEGATIVE-SMOKE CERTIFIED**; see `G34_H_OFFLINE_TELEMETRY_CONTENT_VALIDATION.md`. |
| G34-I | **PASS — STRUCTURAL COVERAGE AUDITED**: `IMPLEMENTED` 10/15 and `FRAMEWORK_READY` 5/15; see `G34_I_SMA_BASELINE_COVERAGE_AUDIT.md`. |

The G34-E, G34-F and G34-G states are source-pending framework states. They
are not FAIL states and must never be reported as a real pilot result.

## G34-H and G34-I certification boundary

G34-H certifies deterministic, browser-local telemetry content validation and
its CI and human negative-smoke evidence. It does not certify source authority
or real pilot evidence.

G34-I certifies structural coverage of a generic SMA/e-STORAGE-oriented
baseline without treating unverified OEM or project material as a product
criterion. Dependencies on Client/OEM documents remain mandatory. No criterion,
threshold, setpoint, procedure, mapping or topology is inferred.

## Safety invariants

The frozen framework retains all of the following invariants:

- no live OT connectivity;
- no SCADA/BMS/PCS/EMS runtime connection;
- no Modbus/IEC-104/OPC-UA/MQTT traffic to a plant;
- no writeback, remote commands, start/stop, charge/discharge dispatch or setpoints;
- no protection changes, energization authority or operational authority;
- no automatic human acceptance and no auto-confirmed root cause;
- no synthetic fixture relabeled as real evidence;
- no SMA/e-STORAGE criteria invented;
- no employer, customer or plant confidential data.

## ES/EN support

The existing Commissioning workspace preserves its Spanish/English locale path,
including the Commissioning / Puesta en Servicio navigation and localized
workspace loading path. This documentation freeze does not add, alter or
certify translations beyond that existing implementation.

## Pending external dependencies

`VERIFIED REAL PILOT DATA` means an approved, traceable and source-verifiable
project package for the intended pilot slice. At minimum it must include the
required G34 intake artifacts: project identity, scope and asset registers,
test matrix, criteria sources, signal mapping, telemetry export, evidence
package index and authority register. Machine-data files require recorded
SHA-256; validation of that record remains a separate human/source action.

The package must provide approved Client/OEM sources and verified as-built
mapping where applicable. It must not be replaced by demo fixtures, templates,
assumptions, inferred topology, inferred tags, inferred units, inferred
thresholds or inferred procedures.

## Framework freeze rule

After G34-J, do not add generic Commissioning functionality merely to increase
scope. Further evolution is conditional on authentic, verified sources.

`Baseline genérica ORBI + fuentes aprobadas Cliente/OEM + mapping as-built verificado = configuración específica del proyecto`

The generic engine is not rebuilt per manufacturer. Verified sources, mappings,
criteria and procedures configure the existing framework for a specific
project.

## Final certification statement

G34 is frozen at **PILOT_FRAMEWORK_READY — VERIFIED REAL PILOT DATA PENDING**.
The next legitimate action is controlled reconciliation against verified real
pilot inputs; it is not an authorization to energize, operate, dispatch,
connect to OT systems or accept a BESS project.
