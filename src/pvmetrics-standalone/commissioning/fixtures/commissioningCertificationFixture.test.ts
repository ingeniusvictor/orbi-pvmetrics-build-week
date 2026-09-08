import test from 'node:test';
import assert from 'node:assert/strict';
import { createCommissioningCertificationFixture } from './createCommissioningCertificationFixture';
import { canClosePunchItem } from '../engine/punchEngine';

const build = () => createCommissioningCertificationFixture();

test('processed certification fixture preserves scope and deterministic G19 counts', () => {
  const snapshot = build();

  assert.equal(snapshot.projects[0]?.projectId, 'DAS-BESS-LAB');
  assert.equal(
    snapshot.scopeAssets.find((item) => item.assetId === 'SB-LAB-004-EXTERNAL')?.status,
    'EXCLUDED',
  );
  assert.equal(snapshot.anomalies.length, 9);
  assert.equal(snapshot.findings.length, 5);
  assert.equal(snapshot.punchItems.length, 3);
  assert.equal(snapshot.testExecutions.filter((item) => item.executionType === 'RETEST').length, 4);
});

test('processed certification fixture never auto-confirms root cause', () => {
  const snapshot = build();

  assert.ok(snapshot.findings.length > 0);
  assert.ok(snapshot.findings.every((item) => item.rootCauseState === 'UNKNOWN'));
  assert.ok(snapshot.findings.every((item) => item.reviewedBy === 'LAB-WITNESS'));
});

test('all synthetic closed punch items satisfy the canonical retest closure rule', () => {
  const snapshot = build();

  for (const punch of snapshot.punchItems) {
    assert.equal(punch.status, 'CLOSED');
    assert.equal(canClosePunchItem(punch, snapshot.testExecutions).allowed, true);
    assert.ok(punch.closureEvidenceIds.length > 0);
  }

  const linkedRetests = new Set(snapshot.punchItems.flatMap((item) => item.retestExecutionIds));
  assert.equal(linkedRetests.size, 4);
});

test('accepted retests remain separate from ORBI assessment and baseline uses latest accepted retest', () => {
  const snapshot = build();
  const retests = snapshot.testExecutions.filter((item) => item.executionType === 'RETEST');

  assert.equal(retests.length, 4);
  assert.ok(retests.every((item) => item.orbiAssessment === 'PASS'));
  assert.ok(retests.every((item) => item.humanAcceptance === 'ACCEPTED'));

  const baseline = snapshot.baselines[0];
  assert.equal(baseline?.status, 'AVAILABLE');
  assert.equal(baseline?.metrics[0]?.value, 5);
  assert.equal(baseline?.metrics[0]?.sourceExecutionId, 'EXEC-LAB-R4');
});

test('processed certification fixture reaches approved gate and ready handover without granting OT authority', () => {
  const snapshot = build();

  assert.equal(snapshot.gates.find((item) => item.gateId === 'GATE-15')?.status, 'APPROVED');
  assert.equal(snapshot.handoverPackages[0]?.status, 'READY');
  assert.equal(snapshot.handoverPackages[0]?.openFindingIds.length, 0);
  assert.equal(snapshot.handoverPackages[0]?.openPunchItemIds.length, 0);
  assert.equal(snapshot.humanAcceptanceDecisions.length, 4);

  const telemetryEvidence = snapshot.evidence.find((item) => item.evidenceId === 'EVID-LAB-TELEMETRY');
  assert.equal(telemetryEvidence?.sha256?.length, 64);
  assert.match(telemetryEvidence?.description ?? '', /not independently verified/i);
});
