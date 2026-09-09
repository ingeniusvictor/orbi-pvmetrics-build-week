import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assessPilotReadiness,
  PILOT_REQUIRED_ARTIFACT_KINDS,
  type PilotArtifact,
  type PilotArtifactKind,
} from './pilotReadiness';

const makeArtifact = (kind: PilotArtifactKind): PilotArtifact => ({
  artifactId: `ART-${kind}`,
  kind,
  status: 'PROVIDED',
  reference: `pilot://${kind.toLowerCase()}`,
  ...(kind === 'TELEMETRY_EXPORT' || kind === 'EVIDENCE_PACKAGE_INDEX'
    ? { sha256: `sha256-${kind.toLowerCase()}` }
    : {}),
});

const makeReadyInput = () => ({
  projectId: 'DAS-BESS-PILOT',
  scopeRevision: 'PILOT-REV-1',
  artifacts: PILOT_REQUIRED_ARTIFACT_KINDS.map(makeArtifact),
});

test('declares readiness only for offline ingest and never operational authority', () => {
  const result = assessPilotReadiness(makeReadyInput());

  assert.equal(result.status, 'READY_FOR_OFFLINE_INGEST');
  assert.equal(result.blockers.length, 0);
  assert.equal(result.providedRequiredArtifacts, result.requiredArtifacts);
  assert.equal(result.boundary.offlineOnly, true);
  assert.equal(result.boundary.operationalReady, false);
  assert.equal(result.boundary.energizationAuthorized, false);
  assert.equal(result.boundary.otWritebackAllowed, false);
});

test('blocks intake when a required artifact is missing', () => {
  const input = makeReadyInput();
  input.artifacts = input.artifacts.filter((artifact) => artifact.kind !== 'ASSET_REGISTER');

  const result = assessPilotReadiness(input);

  assert.equal(result.status, 'BLOCKED');
  assert.match(result.blockers.join('\n'), /ASSET_REGISTER is required/);
});

test('blocks intake while a required artifact is pending validation', () => {
  const input = makeReadyInput();
  input.artifacts = input.artifacts.map((artifact) =>
    artifact.kind === 'CRITERIA_SOURCES'
      ? { ...artifact, status: 'PENDING_VALIDATION' as const }
      : artifact,
  );

  const result = assessPilotReadiness(input);

  assert.equal(result.status, 'BLOCKED');
  assert.match(result.blockers.join('\n'), /CRITERIA_SOURCES is pending validation/);
});

test('blocks real-time, writeback and operational-authority claims', () => {
  const result = assessPilotReadiness({
    ...makeReadyInput(),
    realTimeConnectorConfigured: true,
    writebackCapabilityConfigured: true,
    operationalAuthorityClaimed: true,
  });

  assert.equal(result.status, 'BLOCKED');
  assert.match(result.blockers.join('\n'), /Real-time connector/);
  assert.match(result.blockers.join('\n'), /writeback capability/i);
  assert.match(result.blockers.join('\n'), /operational or energization authority/);
});

test('requires traceable references and hashes for machine-data artifacts', () => {
  const input = makeReadyInput();
  input.artifacts = input.artifacts.map((artifact) => {
    if (artifact.kind === 'TELEMETRY_EXPORT') return { ...artifact, sha256: undefined };
    if (artifact.kind === 'TEST_MATRIX') return { ...artifact, reference: undefined };
    return artifact;
  });

  const result = assessPilotReadiness(input);

  assert.equal(result.status, 'BLOCKED');
  assert.match(result.blockers.join('\n'), /TEST_MATRIX .*traceable reference/);
  assert.match(result.blockers.join('\n'), /TELEMETRY_EXPORT .*SHA-256/);
});

test('allows an offline dry-run package without optional event and signal-dictionary exports but warns', () => {
  const result = assessPilotReadiness(makeReadyInput());

  assert.equal(result.status, 'READY_FOR_OFFLINE_INGEST');
  assert.equal(result.warnings.length, 2);
  assert.match(result.warnings.join('\n'), /event export/i);
  assert.match(result.warnings.join('\n'), /signal dictionary/i);
});
