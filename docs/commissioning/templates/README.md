# ORBI PVMetrics BESS Commissioning — Pilot Data Exchange Templates

Status: GENERIC / PROJECT-AGNOSTIC
Boundary: OFFLINE ONLY · READ-ONLY · NO OT WRITEBACK · NO ENERGIZATION AUTHORITY

## Purpose

These CSV templates provide a stable exchange format for the first controlled BESS Commissioning pilot. They are intentionally header-only and contain no fabricated project records.

They are not substitutes for approved/as-built source documents. A value may be entered only when it is supported by an authorized project source or is explicitly marked as unresolved/unverified where the corresponding workflow permits it.

## Template set

- `project_identity.csv` — project identity and source reference.
- `scope_register.csv` — commissioning scope, exclusions and responsibility boundaries.
- `asset_register.csv` — source asset register / topology references.
- `test_matrix.csv` — commissioning tests, procedure references and authority roles.
- `criteria_sources.csv` — acceptance-criteria source register; conflicting or unresolved thresholds remain unresolved.
- `signal_dictionary.csv` — optional source-system signal dictionary.
- `signal_mapping.csv` — explicit source-to-ORBI mapping with provenance and verification state.
- `telemetry_normalized.csv` — normalized offline telemetry accepted by the current importer.
- `event_export.csv` — optional event/alarm exchange format.
- `evidence_index.csv` — evidence package index and traceability references.
- `authority_register.csv` — human authority / witness / reviewer / approval matrix.

## Verification semantics

Where a template contains `verificationStatus`, use only states supported by the project-mapping workflow:

- `UNVERIFIED`
- `SOURCE_CONFIRMED`

`SOURCE_CONFIRMED` must not be used without a traceable authoritative source. ORBI does not promote an unverified source into a confirmed mapping.

## Scope semantics

For `scopeStatus`, preserve the source meaning explicitly. Recommended normalized values are:

- `INCLUDED`
- `EXCLUDED`
- `THIRD_PARTY`
- `COMPARISON_ONLY`
- `PENDING_CONFIRMATION`

An excluded or third-party item may remain visible for traceability without becoming part of acceptance scope.

## Criteria semantics

`criteria_sources.csv` is a source register, not a threshold-invention mechanism. Recommended `status` values are:

- `SOURCE_CONFIRMED`
- `PENDING_SOURCE`
- `PENDING_RECONCILIATION`
- `NOT_APPLICABLE`

If two authoritative sources conflict, keep the criterion `PENDING_RECONCILIATION` until an authorized human resolves the conflict.

## Normalized telemetry contract

The current normalized telemetry header is exactly:

`timestamp,assetId,signalKey,value,unit,sourceSystem,quality`

Accepted quality values in the current importer are:

- `GOOD`
- `SUSPECT`
- `MISSING`
- `INVALID`

The original vendor/source export should be preserved as evidence. The normalized derivative does not replace the source file.

## File integrity

G34 requires a recorded SHA-256 for machine-data packages used for offline ingest, including telemetry exports, event exports when supplied, and the evidence package index. A recorded hash proves only which bytes were referenced; it does not by itself prove authenticity or independent verification.

## Human authority boundary

The authority register records who may execute, witness, review, accept/reject, approve closure/retest and approve handover. ORBI analytical assessment remains separate from these human authorities.

## Usage rule

1. Preserve original project/vendor files unchanged.
2. Create ORBI exchange derivatives only when needed.
3. Record source document/revision/section references.
4. Keep unknown values blank or explicitly unresolved; do not infer them.
5. Validate mapping and criteria before any real-data dry run.
6. Never interpret pilot readiness as energization, dispatch, operation or contractual acceptance authority.
