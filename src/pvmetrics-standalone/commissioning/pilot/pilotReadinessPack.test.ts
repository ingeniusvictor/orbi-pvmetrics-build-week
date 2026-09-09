import assert from 'node:assert/strict';
import test from 'node:test';

import type { PilotReadinessInput } from './pilotReadiness';
import type { ProjectMappingProfile } from './projectMappingProfile';
import {
  buildPilotReadinessPack,
  renderPilotReadinessPackText,
} from './pilotReadinessPack';

const completeReadinessInput = (): PilotReadinessInput => ({
  projectId: 'PROJECT-1',
  scopeRevision: 'REV-A',
  artifacts: [
    { artifactId: 'A1', kind: 'PROJECT_IDENTITY', status: 'PROVIDED', reference: 'project.pdf' },
    { artifactId: 'A2', kind: 'SCOPE_REGISTER', status: 'PROVIDED', reference: 'scope.xlsx' },
    { artifactId: 'A3', kind: 'ASSET_REGISTER', status: 'PROVIDED', reference: 'assets.xlsx' },
    { artifactId: 'A4', kind: 'TEST_MATRIX', status: 'PROVIDED', reference: 'tests.xlsx' },
    { artifactId: 'A5', kind: 'CRITERIA_SOURCES', status: 'PROVIDED', reference: 'criteria.pdf' },
    { artifactId: 'A6', kind: 'SIGNAL_MAPPING', status: 'PROVIDED', reference: 'mapping.xlsx' },
    { artifactId: 'A7', kind: 'TELEMETRY_EXPORT', status: 'PROVIDED', reference: 'telemetry.csv', sha256: 'abc123' },
    { artifactId: 'A8', kind: 'EVIDENCE_PACKAGE_INDEX', status: 'PROVIDED', reference: 'evidence.csv', sha256: 'def456' },
    { artifactId: 'A9', kind: 'AUTHORITY_REGISTER', status: 'PROVIDED', reference: 'authority.xlsx' },
  ],
});

const confirmedMapping = (): ProjectMappingProfile => ({
  profileId: 'MAP-1',
  projectId: 'PROJECT-1',
  scopeRevision: 'REV-A',
  sources: [
    {
      sourceId: 'SRC-1',
      reference: 'approved-as-built.xlsx',
      revision: 'A',
      verificationStatus: 'SOURCE_CONFIRMED',
    },
  ],
  assets: [
    {
      sourceAssetId: 'PCS-01',
      canonicalAssetId: 'PCS-01',
      canonicalAssetType: 'PCS',
      sourceId: 'SRC-1',
      verificationStatus: 'SOURCE_CONFIRMED',
    },
  ],
  signals: [
    {
      sourceSignal: 'P_AC',
      canonicalSignalKey: 'pcs.active_power',
      sourceUnit: 'kW',
      canonicalUnit: 'kW',
      scale: 1,
      signMultiplier: 1,
      sourceId: 'SRC-1',
      verificationStatus: 'SOURCE_CONFIRMED',
    },
  ],
});

test('no real source package can never become ready for a real dry run', () => {
  const pack = buildPilotReadinessPack({
    generatedAt: '2026-09-09T00:00:00Z',
    generatedBy: 'ORBI QA',
    sourceReality: 'NO_REAL_PACKAGE',
    readinessInput: completeReadinessInput(),
    mappingProfile: confirmedMapping(),
  });

  assert.equal(pack.status, 'PENDING_SOURCE_DATA');
  assert.equal(pack.boundary.energizationAuthorized, false);
  assert.equal(pack.boundary.otWritebackAllowed, false);
  assert.match(pack.limitations.join(' '), /No verified real-project source package/);
});

test('a blocked intake keeps the readiness pack blocked', () => {
  const input = completeReadinessInput();
  input.artifacts = input.artifacts.filter((item) => item.kind !== 'TELEMETRY_EXPORT');

  const pack = buildPilotReadinessPack({
    generatedAt: '2026-09-09T00:00:00Z',
    generatedBy: 'ORBI QA',
    sourceReality: 'REAL_SOURCE_PACKAGE',
    readinessInput: input,
    mappingProfile: confirmedMapping(),
  });

  assert.equal(pack.status, 'BLOCKED');
  assert.match(pack.intake.blockers.join(' '), /TELEMETRY_EXPORT/);
});

test('a blocked mapping keeps the readiness pack blocked', () => {
  const mapping = confirmedMapping();
  mapping.signals[0] = {
    ...mapping.signals[0],
    verificationStatus: 'UNVERIFIED',
  };

  const pack = buildPilotReadinessPack({
    generatedAt: '2026-09-09T00:00:00Z',
    generatedBy: 'ORBI QA',
    sourceReality: 'REAL_SOURCE_PACKAGE',
    readinessInput: completeReadinessInput(),
    mappingProfile: mapping,
  });

  assert.equal(pack.status, 'BLOCKED');
  assert.match(pack.mapping.blockers.join(' '), /UNVERIFIED/);
});

test('project or scope mismatch blocks integration', () => {
  const mapping = confirmedMapping();
  mapping.projectId = 'OTHER-PROJECT';
  mapping.scopeRevision = 'REV-B';

  const pack = buildPilotReadinessPack({
    generatedAt: '2026-09-09T00:00:00Z',
    generatedBy: 'ORBI QA',
    sourceReality: 'REAL_SOURCE_PACKAGE',
    readinessInput: completeReadinessInput(),
    mappingProfile: mapping,
  });

  assert.equal(pack.status, 'BLOCKED');
  assert.equal(pack.integrationBlockers.length, 2);
});

test('verified real inputs can become ready only for an offline dry run', () => {
  const pack = buildPilotReadinessPack({
    generatedAt: '2026-09-09T00:00:00Z',
    generatedBy: 'ORBI QA',
    sourceReality: 'REAL_SOURCE_PACKAGE',
    readinessInput: completeReadinessInput(),
    mappingProfile: confirmedMapping(),
  });

  assert.equal(pack.status, 'READY_FOR_OFFLINE_DRY_RUN');
  assert.equal(pack.intake.status, 'READY_FOR_OFFLINE_INGEST');
  assert.equal(pack.mapping.status, 'READY_FOR_MAPPING_REVIEW');
  assert.equal(pack.boundary.liveOtConnectionAllowed, false);
  assert.equal(pack.boundary.operationalAuthorizationGranted, false);

  const text = renderPilotReadinessPackText(pack);
  assert.match(text, /READY_FOR_OFFLINE_DRY_RUN/);
  assert.match(text, /Operational authorization: NO/);
  assert.match(text, /Energization authorization: NO/);
  assert.match(text, /OT writeback: NO/);
});
