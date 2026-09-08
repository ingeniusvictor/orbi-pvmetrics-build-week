import test from 'node:test';
import assert from 'node:assert/strict';
import { recordHumanAcceptance, applyHumanAcceptance } from './humanAcceptanceEngine';
import { evaluateCommissioningGate } from './gateEngine';
import { buildCommissioningBaseline } from './baselineEngine';
import { evaluateHandoverReadiness } from './handoverEngine';
import type { Calculation, CommissioningGate, HandoverPackage, TestExecution } from '../contracts';

const execution = (id: string, type: TestExecution['executionType'], number: number, assessment: TestExecution['orbiAssessment'], human: TestExecution['humanAcceptance']): TestExecution => ({
  executionId: id,
  testInstanceId: 'TEST-001',
  executionNumber: number,
  executionType: type,
  parentExecutionId: type === 'RETEST' ? 'EXEC-001' : undefined,
  dataQuality: 'GOOD',
  orbiAssessment: assessment,
  humanAcceptance: human,
  status: 'CLOSED',
  notes: [],
  createdAt: '2026-09-08T12:00:00Z',
  createdBy: 'TEST',
  updatedAt: '2026-09-08T12:00:00Z',
  updatedBy: 'TEST',
});

const calc = (id: string, executionId: string, metricKey: string, value: number): Calculation => ({
  calculationId: id,
  executionId,
  metricKey,
  algorithmVersion: 'v1',
  inputSignalKeys: [],
  resultValue: value,
  unit: 's',
  calculatedAt: '2026-09-08T12:05:00Z',
  notes: [],
});

const gate: CommissioningGate = {
  gateId: 'GATE-01', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', name: 'Functional Test Gate',
  status: 'NOT_READY', blockerIds: [], evidenceIds: [],
  createdAt: '2026-09-08T12:00:00Z', createdBy: 'TEST', updatedAt: '2026-09-08T12:00:00Z', updatedBy: 'TEST',
};

const handover: HandoverPackage = {
  handoverPackageId: 'HANDOVER-001', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', status: 'DRAFT',
  requiredDocumentReferences: ['TEST-REPORT'], evidenceIds: [], openFindingIds: [], openPunchItemIds: [], humanAcceptanceDecisionIds: [],
  createdAt: '2026-09-08T12:00:00Z', createdBy: 'TEST', updatedAt: '2026-09-08T12:00:00Z', updatedBy: 'TEST',
};

test('human acceptance is explicit and retains previous state', () => {
  const pending = execution('EXEC-001', 'INITIAL', 1, 'PASS', 'PENDING');
  const decision = recordHumanAcceptance({ execution: pending, decision: 'ACCEPTED', reason: 'Witnessed and accepted.', decidedBy: 'AUTHORIZED-WITNESS', decidedAt: '2026-09-08T13:00:00Z' });
  assert.equal(decision.previousDecision, 'PENDING');
  const accepted = applyHumanAcceptance(pending, decision);
  assert.equal(accepted.humanAcceptance, 'ACCEPTED');
});

test('gate cannot become APPROVED without explicit human approval', () => {
  const accepted = execution('EXEC-001', 'INITIAL', 1, 'PASS', 'ACCEPTED');
  const ready = evaluateCommissioningGate({ gate, executions: [accepted], findings: [], punchItems: [], requiredExecutionIds: ['EXEC-001'], humanApprovalGranted: false, evaluatedAt: '2026-09-08T13:00:00Z', evaluatedBy: 'TEST' });
  assert.equal(ready.status, 'READY');
  const approved = evaluateCommissioningGate({ gate, executions: [accepted], findings: [], punchItems: [], requiredExecutionIds: ['EXEC-001'], humanApprovalGranted: true, evaluatedAt: '2026-09-08T13:00:00Z', evaluatedBy: 'AUTHORIZED-WITNESS' });
  assert.equal(approved.status, 'APPROVED');
});

test('baseline gives precedence to accepted retest over accepted initial execution', () => {
  const initial = execution('EXEC-001', 'INITIAL', 1, 'PASS', 'ACCEPTED');
  const retest = execution('EXEC-002', 'RETEST', 2, 'PASS', 'ACCEPTED');
  const baseline = buildCommissioningBaseline({
    baselineId: 'BASE-001', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', revision: '1', assetId: 'PB-LAB-001',
    executions: [initial, retest], calculations: [calc('C1', 'EXEC-001', 'response_time_s', 9), calc('C2', 'EXEC-002', 'response_time_s', 6)],
    metricKeys: ['response_time_s'], acceptedAt: '2026-09-08T14:00:00Z', acceptedBy: 'AUTHORIZED-WITNESS',
  });
  assert.equal(baseline.metrics[0].sourceExecutionId, 'EXEC-002');
  assert.equal(baseline.metrics[0].value, 6);
});

test('handover stays BLOCKED until baseline, findings, punch and human acceptance are all resolved', () => {
  const accepted = execution('EXEC-002', 'RETEST', 2, 'PASS', 'ACCEPTED');
  const decision = recordHumanAcceptance({ execution: accepted, decision: 'ACCEPTED', reason: 'Accepted.', decidedBy: 'AUTHORIZED-WITNESS', decidedAt: '2026-09-08T14:00:00Z' });
  const baseline = buildCommissioningBaseline({
    baselineId: 'BASE-001', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', revision: '1', assetId: 'PB-LAB-001',
    executions: [accepted], calculations: [calc('C2', 'EXEC-002', 'response_time_s', 6)], metricKeys: ['response_time_s'],
    acceptedAt: '2026-09-08T14:00:00Z', acceptedBy: 'AUTHORIZED-WITNESS',
  });
  const ready = evaluateHandoverReadiness({ handover, baseline, findings: [], punchItems: [], acceptanceDecisions: [decision], requiredDocumentReferences: ['TEST-REPORT'], evaluatedAt: '2026-09-08T15:00:00Z', evaluatedBy: 'TEST' });
  assert.equal(ready.status, 'READY');
});
