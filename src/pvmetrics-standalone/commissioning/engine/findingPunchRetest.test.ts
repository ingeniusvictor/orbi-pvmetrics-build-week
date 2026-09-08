import test from 'node:test';
import assert from 'node:assert/strict';
import { createFindingsFromAnomalies, LAB_FINDING_POLICIES } from './findingsEngine';
import { canClosePunchItem, createPunchItems } from './punchEngine';
import { createRetestExecution } from './retestEngine';
import type { Anomaly, PunchItem, TestExecution } from '../contracts';

const anomaly = (ruleId: string, assetId: string): Anomaly => ({
  anomalyId: `A:${ruleId}`,
  executionId: 'EXEC-001',
  campaignId: 'CAMPAIGN-001',
  assetId,
  ruleId,
  ruleVersion: 'LAB-1',
  title: ruleId,
  description: `${ruleId} synthetic anomaly`,
  severity: ruleId === 'AR009' ? 'CRITICAL' : 'MAJOR',
  impact: 'ASSESSMENT_RELEVANT',
  status: 'NEW',
  detectedAt: '2026-09-08T12:00:00Z',
  evidenceIds: [],
  criterionSnapshotIds: [],
  calculationIds: [],
  notes: [],
  createdAt: '2026-09-08T12:00:00Z',
  createdBy: 'TEST',
  updatedAt: '2026-09-08T12:00:00Z',
  updatedBy: 'TEST',
});

const anomalies = [
  anomaly('AR001', 'RACK-LAB-2-07'), anomaly('AR002', 'RACK-LAB-3-11'), anomaly('AR003', 'PCS-LAB-001'),
  anomaly('AR004', 'SB-LAB-001'), anomaly('AR005', 'RACK-LAB-3-04'), anomaly('AR006', 'PB-LAB-001'),
  anomaly('AR007', 'BMS-LAB-001'), anomaly('AR008', 'SB-LAB-004-EXTERNAL'), anomaly('AR009', 'SB-LAB-003'),
];

const parentExecution: TestExecution = {
  executionId: 'EXEC-001', testInstanceId: 'TEST-001', executionNumber: 1, executionType: 'INITIAL',
  dataQuality: 'GOOD', orbiAssessment: 'FAIL', humanAcceptance: 'RETEST_REQUIRED', status: 'RETEST_REQUIRED', notes: [],
  createdAt: '2026-09-08T12:00:00Z', createdBy: 'TEST', updatedAt: '2026-09-08T12:00:00Z', updatedBy: 'TEST',
};

test('LAB policy converts exactly five anomalies into findings without confirming root cause', () => {
  const findings = createFindingsFromAnomalies({ projectId: 'DAS-BESS-LAB', evaluatedAt: '2026-09-08T12:10:00Z', anomalies, policies: LAB_FINDING_POLICIES });
  assert.equal(findings.length, 5);
  assert.ok(findings.every((finding) => finding.rootCauseState === 'UNKNOWN'));
});

test('LAB findings generate exactly three punch items', () => {
  const findings = createFindingsFromAnomalies({ projectId: 'DAS-BESS-LAB', evaluatedAt: '2026-09-08T12:10:00Z', anomalies, policies: LAB_FINDING_POLICIES });
  const punch = createPunchItems(findings, '2026-09-08T12:11:00Z');
  assert.equal(punch.length, 3);
  assert.ok(punch.every((item) => item.retestRequirement === 'YES'));
});

test('retest cannot be created before punch is READY_FOR_RETEST', () => {
  const punchItem: PunchItem = {
    ...createPunchItems(createFindingsFromAnomalies({ projectId: 'DAS-BESS-LAB', evaluatedAt: '2026-09-08T12:10:00Z', anomalies, policies: LAB_FINDING_POLICIES }), '2026-09-08T12:11:00Z')[0],
    status: 'OPEN',
  };
  assert.throws(() => createRetestExecution({ parentExecution, punchItem, executionId: 'EXEC-002', createdAt: '2026-09-08T13:00:00Z', actor: 'TEST' }), /READY_FOR_RETEST/);
});

test('created retest remains pending and linked to original execution', () => {
  const punchItem = { ...createPunchItems(createFindingsFromAnomalies({ projectId: 'DAS-BESS-LAB', evaluatedAt: '2026-09-08T12:10:00Z', anomalies, policies: LAB_FINDING_POLICIES }), '2026-09-08T12:11:00Z')[0], status: 'READY_FOR_RETEST' as const };
  const retest = createRetestExecution({ parentExecution, punchItem, executionId: 'EXEC-002', createdAt: '2026-09-08T13:00:00Z', actor: 'TEST' });
  assert.equal(retest.executionType, 'RETEST');
  assert.equal(retest.parentExecutionId, 'EXEC-001');
  assert.equal(retest.orbiAssessment, 'INCONCLUSIVE');
  assert.equal(retest.humanAcceptance, 'PENDING');
});

test('punch closure requires accepted PASS retest and closure evidence', () => {
  const punchItem = { ...createPunchItems(createFindingsFromAnomalies({ projectId: 'DAS-BESS-LAB', evaluatedAt: '2026-09-08T12:10:00Z', anomalies, policies: LAB_FINDING_POLICIES }), '2026-09-08T12:11:00Z')[0], retestExecutionIds: ['EXEC-002'], closureEvidenceIds: ['EVID-001'] };
  const acceptedRetest: TestExecution = { ...parentExecution, executionId: 'EXEC-002', executionNumber: 2, executionType: 'RETEST', parentExecutionId: 'EXEC-001', orbiAssessment: 'PASS', humanAcceptance: 'ACCEPTED', status: 'CLOSED' };
  assert.equal(canClosePunchItem(punchItem, [acceptedRetest]).allowed, true);
});
