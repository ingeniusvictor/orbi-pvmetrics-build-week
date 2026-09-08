import test from 'node:test';
import assert from 'node:assert/strict';
import { createCommissioningLabFixture } from '../fixtures/createCommissioningLabFixture';
import { evaluateDataQuality } from './dataQualityEngine';
import { detectTestPhases } from './testPhaseEngine';
import { builtInCommissioningMetrics, calculateCommissioningMetrics } from './commissioningMetrics';
import { evaluateCriterion, summarizeCriteriaAssessment } from './criteriaEngine';
import { runAnomalyRules, type CommissioningAnomalyContext } from './anomalyEngine';
import { createLabAnomalyRules } from './createLabAnomalyRules';
import { createFindingsFromAnomalies, LAB_FINDING_POLICIES } from './findingsEngine';
import { createPunchItems } from './punchEngine';
import { createRetestExecution } from './retestEngine';
import { recordHumanAcceptance, applyHumanAcceptance } from './humanAcceptanceEngine';
import { buildCommissioningBaseline } from './baselineEngine';
import { evaluateCommissioningGate } from './gateEngine';
import { evaluateHandoverReadiness } from './handoverEngine';
import type {
  Calculation,
  CommissioningEvent,
  CommissioningGate,
  CriterionSnapshot,
  HandoverPackage,
  TelemetrySample,
  TestExecution,
} from '../contracts';

const ts = (seconds: number) => `2026-09-08T12:00:${String(seconds).padStart(2, '0')}Z`;
const sample = (assetId: string, signalKey: string, value: number | null, timestamp: string, quality: TelemetrySample['quality'] = 'GOOD', unit = 'kW'): TelemetrySample => ({
  timestamp, assetId, signalKey, value, unit, sourceSystem: 'LAB', quality,
});

const event = (assetId: string, code: string): CommissioningEvent => ({
  eventId: `EVENT:${assetId}:${code}`,
  projectId: 'DAS-BESS-LAB', assetId, executionId: 'EXEC-LAB-001', occurredAt: ts(20),
  eventType: 'WARNING', severity: 'WARNING', code, message: code, sourceSystem: 'LAB', evidenceIds: [],
});

const initialExecution: TestExecution = {
  executionId: 'EXEC-LAB-001', testInstanceId: 'TEST-LAB-001', executionNumber: 1, executionType: 'INITIAL',
  dataQuality: 'DEGRADED', orbiAssessment: 'FAIL', humanAcceptance: 'RETEST_REQUIRED', status: 'RETEST_REQUIRED', notes: [],
  createdAt: ts(0), createdBy: 'LAB', updatedAt: ts(0), updatedBy: 'LAB',
};

const acceptedCopy = (execution: TestExecution, responseSeconds: number): { execution: TestExecution; calculation: Calculation } => {
  const pass = { ...execution, dataQuality: 'GOOD' as const, orbiAssessment: 'PASS' as const, status: 'CLOSED' as const };
  const decision = recordHumanAcceptance({ execution: pass, decision: 'ACCEPTED', reason: 'Synthetic retest accepted by authorized lab witness.', decidedBy: 'LAB-WITNESS', decidedAt: '2026-09-08T13:00:00Z' });
  const accepted = applyHumanAcceptance(pass, decision);
  return {
    execution: accepted,
    calculation: {
      calculationId: `CALC:${accepted.executionId}:response`, executionId: accepted.executionId, metricKey: 'pcs.response_time_s', algorithmVersion: 'LAB-1',
      inputSignalKeys: ['pcs.command_kw', 'pcs.actual_kw'], resultValue: responseSeconds, unit: 's', calculatedAt: '2026-09-08T13:00:00Z', notes: [],
    },
  };
};

test('G19 commissioning core E2E synthetic certification', () => {
  const fixture = createCommissioningLabFixture();
  assert.equal(fixture.projects[0].projectId, 'DAS-BESS-LAB');
  assert.equal(fixture.scopeAssets.find((item) => item.assetId === 'SB-LAB-004-EXTERNAL')?.status, 'EXCLUDED');

  const dqSamples: TelemetrySample[] = [];
  for (let i = 0; i < 30; i += 1) dqSamples.push(sample('PCS-LAB-001', 'pcs.health_kw', i, ts(i)));
  dqSamples.push(sample('SB-LAB-001', 'solbank.active_power_kw', null, ts(31), 'MISSING'));
  const dq = evaluateDataQuality(dqSamples, { expectedSamples: 31 });
  assert.equal(dq.quality, 'DEGRADED');

  const phaseSamples = [
    sample('PCS-LAB-001', 'pcs.active_power_kw', 500, ts(0)),
    sample('PCS-LAB-001', 'pcs.active_power_kw', 0, ts(5)),
    sample('PCS-LAB-001', 'pcs.active_power_kw', -500, ts(10)),
  ];
  const phases = detectTestPhases({
    executionId: 'EXEC-LAB-001', samples: phaseSamples,
    rules: [
      { phaseType: 'CHARGING', signalKey: 'pcs.active_power_kw', predicate: (s) => typeof s.value === 'number' && s.value > 100 },
      { phaseType: 'HOLD', signalKey: 'pcs.active_power_kw', predicate: (s) => typeof s.value === 'number' && Math.abs(s.value) <= 100 },
      { phaseType: 'DISCHARGING', signalKey: 'pcs.active_power_kw', predicate: (s) => typeof s.value === 'number' && s.value < -100 },
    ],
  });
  assert.deepEqual(phases.map((phase) => phase.phaseType), ['CHARGING', 'HOLD', 'DISCHARGING']);

  const metricSamples = [
    sample('PCS-LAB-001', 'pcs.command_kw', 500, ts(0)),
    sample('PCS-LAB-001', 'pcs.actual_kw', 50, ts(5)),
    sample('PCS-LAB-001', 'pcs.actual_kw', 150, ts(18)),
  ];
  const calculations = calculateCommissioningMetrics({
    executionId: 'EXEC-LAB-001', samples: metricSamples,
    definitions: [{ metricKey: 'pcs.response_time_s', unit: 's', requiredSignalKeys: ['pcs.command_kw', 'pcs.actual_kw'], calculate: builtInCommissioningMetrics.responseTimeSeconds('pcs.command_kw', 'pcs.actual_kw', 100) }],
    algorithmVersion: 'LAB-1', calculatedAt: ts(30),
  });
  assert.equal(calculations[0].resultValue, 18);

  const criterion: CriterionSnapshot = {
    criterionSnapshotId: 'CRIT-SNAP-LAB-001', criterionId: 'CRIT-LAB-001', executionId: 'EXEC-LAB-001', snapshotAt: ts(0),
    name: 'LAB PCS response time', variable: 'pcs.response_time_s', operator: '<=', maxValue: 10, unit: 's', sourceType: 'LAB', sourceReference: 'ORBI LAB', sourceRevision: '1', mandatory: true, status: 'CONFIRMED', severityOnFail: 'MAJOR',
  };
  const initialCriterion = evaluateCriterion(criterion, calculations[0], 'LAB', ts(31));
  assert.equal(initialCriterion.result, 'FAIL');

  const anomalyTelemetry: TelemetrySample[] = [
    sample('RACK-LAB-2-07', 'rack.temperature_c', 47, ts(0), 'GOOD', '°C'),
    sample('RACK-LAB-3-11', 'rack.soc_pct', 22, ts(0), 'GOOD', '%'),
    sample('SB-LAB-001', 'solbank.active_power_kw', null, ts(5), 'MISSING'),
    sample('RACK-LAB-3-04', 'rack.voltage_v', 1000, ts(0), 'GOOD', 'V'),
    sample('RACK-LAB-3-04', 'rack.voltage_v', 1000, ts(5), 'GOOD', 'V'),
    sample('RACK-LAB-3-04', 'rack.voltage_v', 1000, ts(10), 'GOOD', 'V'),
    sample('RACK-LAB-3-04', 'rack.voltage_v', 1000, ts(15), 'GOOD', 'V'),
    sample('SB-LAB-004-EXTERNAL', 'solbank.active_power_kw', 250, ts(20)),
  ];
  const anomalyContext: CommissioningAnomalyContext = {
    projectId: 'DAS-BESS-LAB', campaignId: 'CAMPAIGN-LAB-001', executionId: 'EXEC-LAB-001', evaluatedAt: ts(40),
    telemetry: anomalyTelemetry,
    calculations: [calculations[0], { ...calculations[0], calculationId: 'CALC:MISMATCH', metricKey: 'pcs_meter_mismatch_pct', resultValue: 4.5, unit: '%' }],
    events: [event('BMS-LAB-001', 'BMS-WARN-204')],
    scopeAssetStatusByAssetId: { 'SB-LAB-004-EXTERNAL': 'EXCLUDED' },
  };
  const anomalies = runAnomalyRules(anomalyContext, createLabAnomalyRules());
  assert.equal(anomalies.length, 9);

  const findings = createFindingsFromAnomalies({ projectId: 'DAS-BESS-LAB', evaluatedAt: ts(41), anomalies, policies: LAB_FINDING_POLICIES });
  assert.equal(findings.length, 5);
  assert.ok(findings.every((finding) => finding.rootCauseState === 'UNKNOWN'));

  const punch = createPunchItems(findings, ts(42));
  assert.equal(punch.length, 3);
  const readyPunch = punch.map((item) => ({ ...item, status: 'READY_FOR_RETEST' as const }));

  const retestDrafts = [
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[0], executionId: 'EXEC-LAB-R1', createdAt: '2026-09-08T12:50:00Z', actor: 'LAB' }),
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[0], executionId: 'EXEC-LAB-R2', createdAt: '2026-09-08T12:51:00Z', actor: 'LAB' }),
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[1], executionId: 'EXEC-LAB-R3', createdAt: '2026-09-08T12:52:00Z', actor: 'LAB' }),
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[2], executionId: 'EXEC-LAB-R4', createdAt: '2026-09-08T12:53:00Z', actor: 'LAB' }),
  ];
  const accepted = retestDrafts.map((draft, index) => acceptedCopy({ ...draft, executionNumber: index + 2 }, [8, 7, 6, 5][index]));
  assert.equal(accepted.length, 4);
  assert.ok(accepted.every((item) => item.execution.orbiAssessment === 'PASS' && item.execution.humanAcceptance === 'ACCEPTED'));

  const retestCriterion = { ...criterion, executionId: accepted[3].execution.executionId, criterionSnapshotId: 'CRIT-SNAP-LAB-R4' };
  const retestEvaluation = evaluateCriterion(retestCriterion, accepted[3].calculation, 'LAB', '2026-09-08T13:05:00Z');
  assert.equal(retestEvaluation.result, 'PASS');
  assert.equal(summarizeCriteriaAssessment([retestCriterion], [retestEvaluation]), 'PASS');

  const baseline = buildCommissioningBaseline({
    baselineId: 'BASE-LAB-001', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', revision: '1', assetId: 'PB-LAB-001',
    executions: accepted.map((item) => item.execution), calculations: accepted.map((item) => item.calculation), metricKeys: ['pcs.response_time_s'],
    acceptedAt: '2026-09-08T13:10:00Z', acceptedBy: 'LAB-WITNESS',
  });
  assert.equal(baseline.status, 'AVAILABLE');
  assert.equal(baseline.metrics[0].value, 5);

  const closedFindings = findings.map((finding) => ({ ...finding, status: 'CLOSED' as const }));
  const closedPunch = punch.map((item) => ({ ...item, status: 'CLOSED' as const, closureEvidenceIds: [`EVID:${item.punchItemId}`] }));
  const gate: CommissioningGate = {
    gateId: 'GATE-15', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', campaignId: 'CAMPAIGN-LAB-001', name: 'Handover Acceptance', status: 'NOT_READY', blockerIds: [], evidenceIds: [],
    createdAt: ts(0), createdBy: 'LAB', updatedAt: ts(0), updatedBy: 'LAB',
  };
  const approvedGate = evaluateCommissioningGate({
    gate, executions: accepted.map((item) => item.execution), findings: closedFindings, punchItems: closedPunch,
    requiredExecutionIds: accepted.map((item) => item.execution.executionId), humanApprovalGranted: true, evaluatedAt: '2026-09-08T13:15:00Z', evaluatedBy: 'LAB-WITNESS',
  });
  assert.equal(approvedGate.status, 'APPROVED');

  const acceptanceDecisions = accepted.map((item, index) => recordHumanAcceptance({ execution: item.execution, decision: 'ACCEPTED', reason: `Retest ${index + 1} accepted.`, decidedBy: 'LAB-WITNESS', decidedAt: `2026-09-08T13:2${index}:00Z` }));
  const handover: HandoverPackage = {
    handoverPackageId: 'HANDOVER-LAB-001', projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', status: 'DRAFT', baselineId: baseline.baselineId,
    requiredDocumentReferences: ['TEST-REPORT', 'BASELINE-REPORT'], evidenceIds: ['EVID-HANDOVER'], openFindingIds: [], openPunchItemIds: [], humanAcceptanceDecisionIds: [],
    createdAt: '2026-09-08T13:30:00Z', createdBy: 'LAB', updatedAt: '2026-09-08T13:30:00Z', updatedBy: 'LAB',
  };
  const readyHandover = evaluateHandoverReadiness({
    handover, baseline, findings: closedFindings, punchItems: closedPunch, acceptanceDecisions,
    requiredDocumentReferences: ['TEST-REPORT', 'BASELINE-REPORT'], evaluatedAt: '2026-09-08T13:35:00Z', evaluatedBy: 'LAB-WITNESS',
  });
  assert.equal(readyHandover.status, 'READY');
});
