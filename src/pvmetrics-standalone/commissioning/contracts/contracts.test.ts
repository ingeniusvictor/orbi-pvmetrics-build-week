import assert from 'node:assert/strict';
import test from 'node:test';
import type {
  CommissioningBaseline,
  Criterion,
  CriterionSnapshot,
  HumanAcceptanceDecision,
  PunchItem,
  TestExecution,
} from './index';

const audit = {
  createdAt: '2026-09-08T00:00:00.000Z',
  createdBy: 'qa-user',
  updatedAt: '2026-09-08T00:00:00.000Z',
  updatedBy: 'qa-user',
} as const;

const execution = {
  ...audit,
  executionId: 'exec-initial-001',
  testInstanceId: 'test-instance-001',
  executionNumber: 1,
  executionType: 'INITIAL',
  dataQuality: 'DEGRADED',
  orbiAssessment: 'INCONCLUSIVE',
  humanAcceptance: 'PENDING',
  status: 'HUMAN_REVIEW',
  notes: ['Mandatory criterion missing.'],
} satisfies TestExecution;

const labCriterion = {
  ...audit,
  criterionId: 'criterion-lab-response',
  testTemplateId: 'template-charge',
  name: 'LAB charge response time',
  variable: 'pcs_response_time_s',
  operator: '<=',
  maxValue: 10,
  unit: 's',
  sourceType: 'LAB',
  sourceReference: 'ORBI synthetic commissioning fixture v0.1',
  sourceRevision: '0.1',
  mandatory: true,
  status: 'CONFIRMED',
  severityOnFail: 'MAJOR',
} satisfies Criterion;

const snapshot = {
  criterionSnapshotId: 'criterion-snapshot-001',
  criterionId: labCriterion.criterionId,
  executionId: execution.executionId,
  snapshotAt: '2026-09-08T00:01:00.000Z',
  name: labCriterion.name,
  variable: labCriterion.variable,
  operator: labCriterion.operator,
  maxValue: labCriterion.maxValue,
  unit: labCriterion.unit,
  sourceType: labCriterion.sourceType,
  sourceReference: labCriterion.sourceReference,
  sourceRevision: labCriterion.sourceRevision,
  mandatory: labCriterion.mandatory,
  status: labCriterion.status,
  severityOnFail: labCriterion.severityOnFail,
} satisfies CriterionSnapshot;

const acceptance = {
  ...audit,
  acceptanceDecisionId: 'acceptance-001',
  executionId: execution.executionId,
  decision: 'RETEST_REQUIRED',
  reason: 'Initial execution remains inconclusive until the mandatory criterion is resolved.',
  decidedBy: 'authorized-human-reviewer',
  decidedAt: '2026-09-08T00:02:00.000Z',
  previousDecision: 'PENDING',
} satisfies HumanAcceptanceDecision;

const punch = {
  ...audit,
  punchItemId: 'punch-001',
  findingId: 'finding-001',
  assetId: 'asset-pb-001',
  severity: 'CRITICAL',
  description: 'Fast Stop receiver missing during initial execution.',
  requiredAction: 'Inspect configuration and repeat the authorized functional test.',
  status: 'READY_FOR_RETEST',
  retestRequirement: 'YES',
  retestExecutionIds: [],
  closureEvidenceIds: [],
} satisfies PunchItem;

const baseline = {
  ...audit,
  baselineId: 'baseline-001',
  projectId: 'project-001',
  scopeId: 'scope-001',
  revision: '1',
  assetId: 'asset-pb-001',
  acceptedAt: '2026-09-08T00:03:00.000Z',
  acceptedBy: 'authorized-human-reviewer',
  metrics: [
    {
      metricKey: 'pcs_response_time_s',
      value: 6,
      unit: 's',
      sourceExecutionId: 'exec-retest-001',
      calculationId: 'calc-retest-response',
      acceptedAt: '2026-09-08T00:03:00.000Z',
    },
  ],
  firmwareVersions: {},
  configurationReferences: [],
  knownDeviationFindingIds: [],
  status: 'AVAILABLE',
} satisfies CommissioningBaseline;

test('ORBI assessment and human acceptance remain separate authorities', () => {
  assert.equal(execution.orbiAssessment, 'INCONCLUSIVE');
  assert.equal(execution.humanAcceptance, 'PENDING');
  assert.equal(acceptance.decision, 'RETEST_REQUIRED');
});

test('criterion snapshots preserve source, revision and execution context', () => {
  assert.equal(snapshot.executionId, execution.executionId);
  assert.equal(snapshot.sourceType, 'LAB');
  assert.equal(snapshot.sourceRevision, '0.1');
  assert.equal(snapshot.maxValue, 10);
});

test('critical punch items can require retest without pretending to be closed', () => {
  assert.equal(punch.severity, 'CRITICAL');
  assert.equal(punch.retestRequirement, 'YES');
  assert.equal(punch.status, 'READY_FOR_RETEST');
  assert.equal(punch.retestExecutionIds.length, 0);
});

test('accepted baseline can point to a retest execution instead of the failed initial execution', () => {
  assert.equal(baseline.status, 'AVAILABLE');
  assert.equal(baseline.metrics[0].sourceExecutionId, 'exec-retest-001');
  assert.notEqual(baseline.metrics[0].sourceExecutionId, execution.executionId);
});
