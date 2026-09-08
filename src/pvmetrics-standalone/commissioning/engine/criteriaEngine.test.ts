import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCriterion, summarizeCriteriaAssessment } from './criteriaEngine';
import type { Calculation, CriterionSnapshot } from '../contracts';

const criterion = (overrides: Partial<CriterionSnapshot> = {}): CriterionSnapshot => ({
  criterionSnapshotId: 'CS-001',
  criterionId: 'C-001',
  executionId: 'EXEC-001',
  snapshotAt: '2026-01-01T00:00:00Z',
  name: 'Response time',
  variable: 'response_time_s',
  operator: '<=',
  maxValue: 10,
  unit: 's',
  sourceType: 'OEM',
  sourceReference: 'OEM-PROC-001',
  sourceRevision: 'A',
  mandatory: true,
  status: 'CONFIRMED',
  severityOnFail: 'MAJOR',
  ...overrides,
});

const calculation = (value: number | null): Calculation => ({
  calculationId: 'CALC-001',
  executionId: 'EXEC-001',
  metricKey: 'response_time_s',
  algorithmVersion: 'v1',
  inputSignalKeys: ['command', 'response'],
  resultValue: value,
  unit: 's',
  calculatedAt: '2026-01-01T00:01:00Z',
  notes: [],
});

test('confirmed criterion evaluates deterministically', () => {
  const evaluation = evaluateCriterion(criterion(), calculation(8), 'PROJECT', '2026-01-01T00:02:00Z');
  assert.equal(evaluation.result, 'PASS');
});

test('mandatory missing measured value leads to INCONCLUSIVE aggregate', () => {
  const snapshot = criterion();
  const evaluation = evaluateCriterion(snapshot, calculation(null), 'PROJECT', '2026-01-01T00:02:00Z');
  assert.equal(evaluation.result, 'NOT_EVALUATED');
  assert.equal(summarizeCriteriaAssessment([snapshot], [evaluation]), 'INCONCLUSIVE');
});

test('LAB criteria are blocked from governing PROJECT mode', () => {
  const snapshot = criterion({ sourceType: 'LAB' });
  const evaluation = evaluateCriterion(snapshot, calculation(5), 'PROJECT', '2026-01-01T00:02:00Z');
  assert.equal(evaluation.result, 'NOT_EVALUATED');
  assert.match(evaluation.reason ?? '', /LAB criterion/);
});

test('unconfirmed criterion cannot silently become PASS', () => {
  const snapshot = criterion({ status: 'PENDING_CONFIRMATION' });
  const evaluation = evaluateCriterion(snapshot, calculation(5), 'PROJECT', '2026-01-01T00:02:00Z');
  assert.equal(evaluation.result, 'NOT_EVALUATED');
});

test('confirmed failed criterion produces FAIL assessment', () => {
  const snapshot = criterion();
  const evaluation = evaluateCriterion(snapshot, calculation(18), 'PROJECT', '2026-01-01T00:02:00Z');
  assert.equal(evaluation.result, 'FAIL');
  assert.equal(summarizeCriteriaAssessment([snapshot], [evaluation]), 'FAIL');
});
