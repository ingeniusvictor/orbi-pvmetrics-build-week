# G34-E — Project Mapping Profile / Source Data Request

Status: SOURCE PACK REQUEST PREPARED
Branch: `feature/bess-commissioning-workspace`
Candidate pilot: Diego de Almagro Sur BESS

## Purpose

Define the minimum verified source material required before ORBI PVMetrics creates a real project-specific Commissioning mapping profile.

This document is a request/checklist only. It does not assert project topology, tag names, thresholds, firmware, device counts or OEM acceptance criteria. Unknown values remain unknown until supported by approved/as-built source material.

## Required source package

### 1. Project identity

Provide an approved project identity reference containing, where available:

- official project/site name;
- client/owner;
- EPC/integrator;
- BESS OEM and PCS/inverter OEM;
- project location;
- rated power and energy;
- document number/revision/date.

### 2. Approved commissioning scope

Provide the current approved commissioning scope or responsibility matrix showing:

- scope revision;
- included systems/assets;
- excluded / third-party / comparison-only assets;
- contractual responsibility boundaries;
- witness / approval responsibilities;
- known scope deviations.

ORBI must never promote an excluded or third-party asset into acceptance scope only because telemetry or evidence exists for it.

### 3. As-built asset register / topology

Preferred sources:

- approved/as-built single-line diagrams;
- BESS block diagrams;
- container/rack/PCS/MVPS asset register;
- equipment schedules;
- OEM serial/model register;
- network architecture drawing where available.

The mapping profile must be built from verified source relationships. Device ratios, hierarchy and parent-child relationships must not be inferred from public project summaries or nominal counts.

### 4. Test matrix and procedures

Provide the latest applicable test matrix/protocol set identifying:

- test code/name;
- applicable asset/system;
- test procedure reference and revision;
- required signals/measurements;
- required evidence;
- witness/reviewer/approver roles;
- retest rules;
- prerequisites and hold points.

### 5. Acceptance criteria sources

Provide the authoritative source for every acceptance threshold used in the pilot, such as:

- employer/client requirements;
- EPC commissioning procedures;
- OEM manuals/procedures;
- grid-code / utility requirements;
- approved technical specifications;
- contractual test protocols.

For each criterion ORBI needs the source document, revision and section/table/page reference. If sources conflict, the criterion remains unresolved until an authorized human reconciles them. ORBI must not choose a threshold silently.

### 6. Signal dictionary and mapping sources

Provide exported tag/signal dictionaries for the relevant data sources, preferably including:

- source system;
- source tag name/address;
- engineering description;
- unit;
- data type;
- asset association;
- scaling/offset/sign convention;
- quality semantics;
- sample rate where known.

Mapping should explicitly identify each source tag to an ORBI canonical signal key. Unknown units/sign/scaling remain `PENDING_CONFIRMATION` or `UNMAPPED`.

### 7. Offline telemetry export

Provide a sanitized/exported file covering a representative commissioning test window. Preferred initial format: CSV.

Minimum normalized fields expected by the current importer:

`timestamp,assetId,signalKey,value,unit,sourceSystem,quality`

Accepted quality values are currently:

- `GOOD`
- `SUSPECT`
- `MISSING`
- `INVALID`

The original source export should be preserved as evidence even if a normalized derivative is prepared for ORBI. SHA-256 should be recorded for the exact files used in the pilot.

### 8. Event / alarm export

Recommended for the first pilot, particularly when validating trips, warnings, communications losses or protection sequences.

Useful fields include:

- timestamp;
- source system;
- asset/equipment reference;
- event/alarm code;
- severity;
- state/change;
- message/description;
- acknowledgement/clear timestamp where available.

### 9. Evidence package index

Provide an index of supporting evidence such as:

- screenshots;
- trend exports;
- test sheets;
- photos;
- signed witness records;
- OEM reports;
- configuration/firmware records;
- calibration certificates where applicable.

Each item should have a stable reference and, where practical, SHA-256 of the exact file used.

### 10. Authority register

Provide the human authority matrix for the pilot, identifying roles that may:

- execute;
- witness;
- review;
- accept/reject;
- approve closure/retest;
- approve handover.

ORBI analytical PASS/FAIL does not replace these authorities.

## Recommended first pilot slice

Start with one deliberately narrow, well-documented commissioning test rather than the entire BESS project. The preferred pilot slice should have:

- clearly identified asset(s);
- approved test procedure;
- authoritative acceptance criteria;
- telemetry available for the full test interval;
- at least one evidence item;
- identified human witness/reviewer;
- no need for live OT connectivity.

A single high-quality test slice is more useful for validating the real-data pipeline than a large dataset with uncertain mappings or criteria.

## Pre-mapping admission rule

G34-E may create a real project mapping profile only after the source package supports, at minimum:

1. verified project identity;
2. verified scope revision;
3. verified asset identity/hierarchy for the pilot slice;
4. authoritative test procedure;
5. authoritative acceptance criteria references;
6. explicit source-tag/unit mapping;
7. representative offline telemetry;
8. evidence traceability;
9. human authority roles.

If any mandatory item is unresolved, the mapping profile stays `PENDING_SOURCE_VERIFICATION` and no missing topology, tag, unit or threshold is invented.

## Safety boundary

This request does not authorize:

- plant network access;
- live SCADA/BMS/PCS/EMS connection;
- control/writeback;
- setpoint changes;
- energization;
- dispatch;
- automatic project acceptance.

The first real-data pilot remains offline, file-based and read-only.
