import type {
  Calculation,
  CommissioningDataset,
  CommissioningEvent,
  CommissioningGate,
  Criterion,
  CriterionSnapshot,
  Evidence,
  HandoverPackage,
  HumanAcceptanceDecision,
  TelemetrySample,
  TestExecution,
  TestInstance,
  TestTemplate,
} from '../contracts';
import type { CommissioningSnapshot } from '../persistence';
import { createCommissioningLabFixture } from './createCommissioningLabFixture';
import { evaluateDataQuality } from '../engine/dataQualityEngine';
import { detectTestPhases } from '../engine/testPhaseEngine';
import { builtInCommissioningMetrics, calculateCommissioningMetrics } from '../engine/commissioningMetrics';
import { evaluateCriterion } from '../engine/criteriaEngine';
import { runAnomalyRules, type CommissioningAnomalyContext } from '../engine/anomalyEngine';
import { createLabAnomalyRules } from '../engine/createLabAnomalyRules';
import { createFindingsFromAnomalies, LAB_FINDING_POLICIES } from '../engine/findingsEngine';
import { createPunchItems } from '../engine/punchEngine';
import { createRetestExecution } from '../engine/retestEngine';
import { recordHumanAcceptance, applyHumanAcceptance } from '../engine/humanAcceptanceEngine';
import { buildCommissioningBaseline } from '../engine/baselineEngine';
import { evaluateCommissioningGate } from '../engine/gateEngine';
import { evaluateHandoverReadiness } from '../engine/handoverEngine';

const CREATED_AT = '2026-09-08T12:00:00Z';
const LAB_ACTOR = 'ORBI-CERTIFICATION-LAB';
const HUMAN_ACTOR = 'LAB-WITNESS';

const audit = {
  createdAt: CREATED_AT,
  createdBy: LAB_ACTOR,
  updatedAt: CREATED_AT,
  updatedBy: LAB_ACTOR,
};

const ts = (seconds: number) => `2026-09-08T12:00:${String(seconds).padStart(2, '0')}Z`;

const sample = (
  assetId: string,
  signalKey: string,
  value: number | null,
  timestamp: string,
  quality: TelemetrySample['quality'] = 'GOOD',
  unit = 'kW',
): TelemetrySample => ({
  timestamp,
  assetId,
  signalKey,
  value,
  unit,
  sourceSystem: 'ORBI-CERTIFICATION-LAB',
  quality,
});

const labEvent = (assetId: string, code: string): CommissioningEvent => ({
  eventId: `EVENT:${assetId}:${code}`,
  projectId: 'DAS-BESS-LAB',
  assetId,
  executionId: 'EXEC-LAB-001',
  occurredAt: ts(20),
  eventType: 'WARNING',
  severity: 'WARNING',
  code,
  message: `${code} — synthetic certification event`,
  sourceSystem: 'ORBI-CERTIFICATION-LAB',
  evidenceIds: ['EVID-LAB-TELEMETRY'],
});

const initialExecution: TestExecution = {
  ...audit,
  executionId: 'EXEC-LAB-001',
  testInstanceId: 'TEST-LAB-001',
  executionNumber: 1,
  executionType: 'INITIAL',
  startedAt: ts(0),
  endedAt: ts(40),
  executedBy: LAB_ACTOR,
  witnessedBy: HUMAN_ACTOR,
  reviewedBy: HUMAN_ACTOR,
  dataQuality: 'DEGRADED',
  orbiAssessment: 'FAIL',
  humanAcceptance: 'RETEST_REQUIRED',
  status: 'RETEST_REQUIRED',
  notes: ['Synthetic initial execution intentionally contains deterministic commissioning anomalies.'],
};

type AcceptedRetest = {
  execution: TestExecution;
  calculation: Calculation;
  decision: HumanAcceptanceDecision;
};

const acceptRetest = (
  execution: TestExecution,
  responseSeconds: number,
  decidedAt: string,
): AcceptedRetest => {
  const pass: TestExecution = {
    ...execution,
    dataQuality: 'GOOD',
    orbiAssessment: 'PASS',
    status: 'CLOSED',
    endedAt: decidedAt,
    reviewedBy: HUMAN_ACTOR,
    approvedBy: HUMAN_ACTOR,
    updatedAt: decidedAt,
    updatedBy: HUMAN_ACTOR,
  };
  const decision = recordHumanAcceptance({
    execution: pass,
    decision: 'ACCEPTED',
    reason: 'Synthetic retest accepted by authorized lab witness.',
    decidedBy: HUMAN_ACTOR,
    decidedAt,
  });
  const accepted = applyHumanAcceptance(pass, decision);

  return {
    execution: accepted,
    decision,
    calculation: {
      calculationId: `CALC:${accepted.executionId}:response`,
      executionId: accepted.executionId,
      metricKey: 'pcs.response_time_s',
      algorithmVersion: 'LAB-1',
      inputSignalKeys: ['pcs.command_kw', 'pcs.actual_kw'],
      resultValue: responseSeconds,
      unit: 's',
      calculatedAt: decidedAt,
      notes: ['Synthetic deterministic retest response metric.'],
    },
  };
};

const testTemplate: TestTemplate = {
  ...audit,
  testTemplateId: 'TEMPLATE-LAB-001',
  code: 'BESS-TEST-LAB-001',
  name: 'Synthetic Charge / Discharge Functional Performance Test',
  category: 'CHARGE_DISCHARGE',
  assetType: 'POWER_BLOCK',
  description: 'Processed synthetic certification test used only for visual and deterministic E2E validation.',
  procedureReference: 'ORBI synthetic commissioning lab v0.1',
  oemReference: 'SYNTHETIC — NOT AN OEM CONTRACTUAL REQUIREMENT',
  requiredSignalKeys: ['pcs.command_kw', 'pcs.actual_kw'],
  optionalSignalKeys: ['pcs.active_power_kw'],
  requiredEvidenceTypes: ['CSV', 'GRAPH'],
  applicability: 'MANDATORY',
  version: 'LAB-1',
  status: 'ACTIVE',
};

const testInstance: TestInstance = {
  ...audit,
  testInstanceId: 'TEST-LAB-001',
  testTemplateId: testTemplate.testTemplateId,
  campaignId: 'CAMPAIGN-LAB-001',
  scopeId: 'SCOPE-LAB-001',
  assetId: 'PB-LAB-001',
  applicability: 'MANDATORY',
  plannedAt: CREATED_AT,
  assignedTo: LAB_ACTOR,
  witness: HUMAN_ACTOR,
  status: 'COMPLETED',
};

const criterionEntity: Criterion = {
  ...audit,
  criterionId: 'CRIT-LAB-001',
  testTemplateId: testTemplate.testTemplateId,
  name: 'LAB PCS response time',
  variable: 'pcs.response_time_s',
  operator: '<=',
  maxValue: 10,
  unit: 's',
  sourceType: 'LAB',
  sourceReference: 'ORBI CERTIFICATION LAB',
  sourceRevision: '1',
  mandatory: true,
  status: 'CONFIRMED',
  severityOnFail: 'MAJOR',
};

const evidence = (input: Omit<Evidence, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>): Evidence => ({
  ...audit,
  ...input,
});

export const createCommissioningCertificationFixture = (): CommissioningSnapshot => {
  const snapshot = createCommissioningLabFixture();

  const dqSamples: TelemetrySample[] = [];
  for (let i = 0; i < 30; i += 1) dqSamples.push(sample('PCS-LAB-001', 'pcs.health_kw', i, ts(i)));
  dqSamples.push(sample('SB-LAB-001', 'solbank.active_power_kw', null, ts(31), 'MISSING'));
  const dq = evaluateDataQuality(dqSamples, { expectedSamples: 31 });

  const phaseSamples = [
    sample('PCS-LAB-001', 'pcs.active_power_kw', 500, ts(0)),
    sample('PCS-LAB-001', 'pcs.active_power_kw', 0, ts(5)),
    sample('PCS-LAB-001', 'pcs.active_power_kw', -500, ts(10)),
  ];
  const phases = detectTestPhases({
    executionId: initialExecution.executionId,
    samples: phaseSamples,
    rules: [
      { phaseType: 'CHARGING', signalKey: 'pcs.active_power_kw', predicate: (item) => typeof item.value === 'number' && item.value > 100 },
      { phaseType: 'HOLD', signalKey: 'pcs.active_power_kw', predicate: (item) => typeof item.value === 'number' && Math.abs(item.value) <= 100 },
      { phaseType: 'DISCHARGING', signalKey: 'pcs.active_power_kw', predicate: (item) => typeof item.value === 'number' && item.value < -100 },
    ],
  });

  const metricSamples = [
    sample('PCS-LAB-001', 'pcs.command_kw', 500, ts(0)),
    sample('PCS-LAB-001', 'pcs.actual_kw', 50, ts(5)),
    sample('PCS-LAB-001', 'pcs.actual_kw', 150, ts(18)),
  ];
  const initialCalculations = calculateCommissioningMetrics({
    executionId: initialExecution.executionId,
    samples: metricSamples,
    definitions: [{
      metricKey: 'pcs.response_time_s',
      unit: 's',
      requiredSignalKeys: ['pcs.command_kw', 'pcs.actual_kw'],
      calculate: builtInCommissioningMetrics.responseTimeSeconds('pcs.command_kw', 'pcs.actual_kw', 100),
    }],
    algorithmVersion: 'LAB-1',
    calculatedAt: ts(30),
  });

  const initialCriterion: CriterionSnapshot = {
    criterionSnapshotId: 'CRIT-SNAP-LAB-001',
    criterionId: criterionEntity.criterionId,
    executionId: initialExecution.executionId,
    snapshotAt: ts(0),
    name: criterionEntity.name,
    variable: criterionEntity.variable,
    operator: criterionEntity.operator,
    maxValue: criterionEntity.maxValue,
    unit: criterionEntity.unit,
    sourceType: criterionEntity.sourceType,
    sourceReference: criterionEntity.sourceReference,
    sourceRevision: criterionEntity.sourceRevision,
    mandatory: criterionEntity.mandatory,
    status: criterionEntity.status,
    severityOnFail: criterionEntity.severityOnFail,
  };
  const initialEvaluation = evaluateCriterion(initialCriterion, initialCalculations[0], 'LAB', ts(31));

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
  const warningEvent = labEvent('BMS-LAB-001', 'BMS-WARN-204');
  const anomalyContext: CommissioningAnomalyContext = {
    projectId: 'DAS-BESS-LAB',
    campaignId: 'CAMPAIGN-LAB-001',
    executionId: initialExecution.executionId,
    evaluatedAt: ts(40),
    telemetry: anomalyTelemetry,
    calculations: [
      initialCalculations[0],
      {
        ...initialCalculations[0],
        calculationId: 'CALC:MISMATCH',
        metricKey: 'pcs_meter_mismatch_pct',
        resultValue: 4.5,
        unit: '%',
      },
    ],
    events: [warningEvent],
    scopeAssetStatusByAssetId: { 'SB-LAB-004-EXTERNAL': 'EXCLUDED' },
  };

  const detectedAnomalies = runAnomalyRules(anomalyContext, createLabAnomalyRules()).map((item) => ({
    ...item,
    evidenceIds: Array.from(new Set([...item.evidenceIds, 'EVID-LAB-TELEMETRY'])),
  }));

  const findings = createFindingsFromAnomalies({
    projectId: 'DAS-BESS-LAB',
    evaluatedAt: ts(41),
    anomalies: detectedAnomalies,
    policies: LAB_FINDING_POLICIES,
  });
  const closedFindings = findings.map((item) => ({
    ...item,
    status: 'CLOSED' as const,
    evidenceIds: Array.from(new Set([...item.evidenceIds, 'EVID-LAB-TELEMETRY'])),
    reviewedBy: HUMAN_ACTOR,
    reviewedAt: '2026-09-08T13:12:00Z',
    updatedAt: '2026-09-08T13:12:00Z',
    updatedBy: HUMAN_ACTOR,
  }));

  const createdPunch = createPunchItems(findings, ts(42));
  const readyPunch = createdPunch.map((item) => ({ ...item, status: 'READY_FOR_RETEST' as const }));
  const retestDrafts = [
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[0], executionId: 'EXEC-LAB-R1', createdAt: '2026-09-08T12:50:00Z', actor: LAB_ACTOR }),
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[0], executionId: 'EXEC-LAB-R2', createdAt: '2026-09-08T12:51:00Z', actor: LAB_ACTOR }),
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[1], executionId: 'EXEC-LAB-R3', createdAt: '2026-09-08T12:52:00Z', actor: LAB_ACTOR }),
    createRetestExecution({ parentExecution: initialExecution, punchItem: readyPunch[2], executionId: 'EXEC-LAB-R4', createdAt: '2026-09-08T12:53:00Z', actor: LAB_ACTOR }),
  ];
  const acceptedRetests = retestDrafts.map((draft, index) => acceptRetest(
    { ...draft, executionNumber: index + 2 },
    [8, 7, 6, 5][index],
    `2026-09-08T13:0${index + 1}:00Z`,
  ));

  const latestRetest = acceptedRetests[3];
  const retestCriterion: CriterionSnapshot = {
    ...initialCriterion,
    criterionSnapshotId: 'CRIT-SNAP-LAB-R4',
    executionId: latestRetest.execution.executionId,
    snapshotAt: '2026-09-08T13:04:00Z',
  };
  const retestEvaluation = evaluateCriterion(
    retestCriterion,
    latestRetest.calculation,
    'LAB',
    '2026-09-08T13:05:00Z',
  );

  const closedPunch = createdPunch.map((item, index) => {
    const retestExecutionIds = index === 0
      ? [acceptedRetests[0].execution.executionId, acceptedRetests[1].execution.executionId]
      : [acceptedRetests[index + 1].execution.executionId];
    return {
      ...item,
      status: 'CLOSED' as const,
      retestExecutionIds,
      closureEvidenceIds: [`EVID-CLOSURE-${index + 1}`],
      closedAt: '2026-09-08T13:14:00Z',
      closedBy: HUMAN_ACTOR,
      updatedAt: '2026-09-08T13:14:00Z',
      updatedBy: HUMAN_ACTOR,
    };
  });

  const baseline = buildCommissioningBaseline({
    baselineId: 'BASE-LAB-001',
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    revision: '1',
    assetId: 'PB-LAB-001',
    executions: acceptedRetests.map((item) => item.execution),
    calculations: acceptedRetests.map((item) => item.calculation),
    metricKeys: ['pcs.response_time_s'],
    acceptedAt: '2026-09-08T13:10:00Z',
    acceptedBy: HUMAN_ACTOR,
    firmwareVersions: { pcs: 'SYNTHETIC-LAB-1', bms: 'SYNTHETIC-LAB-1' },
    configurationReferences: ['ORBI-CERTIFICATION-LAB-CONFIG-1'],
  });

  const gate: CommissioningGate = {
    ...audit,
    gateId: 'GATE-15',
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    campaignId: 'CAMPAIGN-LAB-001',
    name: 'Handover Acceptance',
    status: 'NOT_READY',
    blockerIds: [],
    evidenceIds: ['EVID-HANDOVER'],
  };
  const approvedGate = evaluateCommissioningGate({
    gate,
    executions: acceptedRetests.map((item) => item.execution),
    findings: closedFindings,
    punchItems: closedPunch,
    requiredExecutionIds: acceptedRetests.map((item) => item.execution.executionId),
    humanApprovalGranted: true,
    evaluatedAt: '2026-09-08T13:15:00Z',
    evaluatedBy: HUMAN_ACTOR,
  });

  const handoverDraft: HandoverPackage = {
    ...audit,
    handoverPackageId: 'HANDOVER-LAB-001',
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    status: 'DRAFT',
    baselineId: baseline.baselineId,
    requiredDocumentReferences: ['TEST-REPORT', 'BASELINE-REPORT'],
    evidenceIds: ['EVID-HANDOVER'],
    openFindingIds: [],
    openPunchItemIds: [],
    humanAcceptanceDecisionIds: [],
    preparedBy: HUMAN_ACTOR,
    preparedAt: '2026-09-08T13:30:00Z',
  };
  const acceptanceDecisions = acceptedRetests.map((item) => item.decision);
  const readyHandover = evaluateHandoverReadiness({
    handover: handoverDraft,
    baseline,
    findings: closedFindings,
    punchItems: closedPunch,
    acceptanceDecisions,
    requiredDocumentReferences: ['TEST-REPORT', 'BASELINE-REPORT'],
    evaluatedAt: '2026-09-08T13:35:00Z',
    evaluatedBy: HUMAN_ACTOR,
  });

  const dataset: CommissioningDataset = {
    ...audit,
    datasetId: 'DATASET-LAB-001',
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    campaignId: 'CAMPAIGN-LAB-001',
    executionId: initialExecution.executionId,
    sourceType: 'FILE_IMPORT',
    sourceName: 'ORBI synthetic certification telemetry',
    rawEvidenceId: 'EVID-LAB-TELEMETRY',
    importResult: 'ACCEPTED_WITH_WARNINGS',
    dataQuality: dq.quality,
    coveragePercent: dq.coveragePercent,
    expectedSamples: 31,
    receivedSamples: dq.totalSamples,
    missingSamples: dq.missingSamples,
    duplicateSamples: dq.duplicateSamples,
    invalidSamples: dq.invalidSamples,
    frozenSignalCount: dq.frozenSignalKeys.length,
    warnings: dq.issues.filter((item) => item.severity === 'WARNING').map((item) => item.message),
    errors: dq.issues.filter((item) => item.severity === 'ERROR').map((item) => item.message),
  };

  const evidenceRecords: Evidence[] = [
    evidence({
      evidenceId: 'EVID-LAB-TELEMETRY',
      projectId: 'DAS-BESS-LAB',
      assetId: 'PB-LAB-001',
      executionId: initialExecution.executionId,
      type: 'CSV',
      name: 'Synthetic commissioning telemetry package',
      source: 'ORBI certification fixture',
      fileReference: 'synthetic://commissioning/telemetry.csv',
      sha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      capturedAt: ts(40),
      description: 'Synthetic evidence. Hash is recorded for display-path validation and is not independently verified by the UI.',
    }),
    evidence({
      evidenceId: 'EVID-LAB-RETEST-R4',
      projectId: 'DAS-BESS-LAB',
      assetId: 'PB-LAB-001',
      executionId: latestRetest.execution.executionId,
      type: 'GRAPH',
      name: 'Synthetic accepted retest response graph',
      source: 'ORBI certification fixture',
      fileReference: 'synthetic://commissioning/retest-r4-response.png',
      capturedAt: '2026-09-08T13:05:00Z',
      description: 'Synthetic visual evidence linked to the latest accepted retest.',
    }),
    ...closedPunch.map((item, index) => evidence({
      evidenceId: `EVID-CLOSURE-${index + 1}`,
      projectId: 'DAS-BESS-LAB',
      assetId: item.assetId,
      executionId: item.retestExecutionIds.at(-1),
      type: 'DOCUMENT',
      name: `Synthetic closure evidence ${index + 1}`,
      source: 'ORBI certification fixture',
      fileReference: `synthetic://commissioning/punch-${index + 1}-closure.pdf`,
      capturedAt: '2026-09-08T13:14:00Z',
      description: `Closure evidence for ${item.punchItemId}.`,
    })),
    evidence({
      evidenceId: 'EVID-HANDOVER',
      projectId: 'DAS-BESS-LAB',
      assetId: 'PB-LAB-001',
      type: 'DOCUMENT',
      name: 'Synthetic handover evidence package',
      source: 'ORBI certification fixture',
      fileReference: 'synthetic://commissioning/handover-package.pdf',
      capturedAt: '2026-09-08T13:30:00Z',
      description: 'Synthetic handover evidence for visual certification only.',
    }),
  ];

  snapshot.testTemplates.push(testTemplate);
  snapshot.testInstances.push(testInstance);
  snapshot.testExecutions.push(initialExecution, ...acceptedRetests.map((item) => item.execution));
  snapshot.testPhases.push(...phases);
  snapshot.criteria.push(criterionEntity);
  snapshot.criterionSnapshots.push(initialCriterion, retestCriterion);
  snapshot.criterionEvaluations.push(initialEvaluation, retestEvaluation);
  snapshot.telemetrySamples.push(...dqSamples, ...phaseSamples, ...metricSamples, ...anomalyTelemetry);
  snapshot.datasets.push(dataset);
  snapshot.events.push(warningEvent);
  snapshot.evidence.push(...evidenceRecords);
  snapshot.calculations.push(
    ...initialCalculations,
    ...acceptedRetests.map((item) => item.calculation),
  );
  snapshot.anomalies.push(...detectedAnomalies);
  snapshot.findings.push(...closedFindings);
  snapshot.punchItems.push(...closedPunch);
  snapshot.humanAcceptanceDecisions.push(...acceptanceDecisions);
  snapshot.gates.push(approvedGate);
  snapshot.baselines.push(baseline);
  snapshot.handoverPackages.push(readyHandover);

  return snapshot;
};
