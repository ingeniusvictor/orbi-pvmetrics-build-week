import assert from 'node:assert/strict';
import test from 'node:test';
import { createCommissioningCertificationFixture } from '../fixtures/createCommissioningCertificationFixture';
import { createCommissioningLabFixture } from '../fixtures/createCommissioningLabFixture';
import { buildCommissioningReport, renderCommissioningReportText } from './commissioningReport';

const GENERATED_AT = '2026-09-08T18:45:00.000Z';
const GENERATED_BY = 'ORBI-REPORT-QA';

const buildLabReport = () => buildCommissioningReport({
  snapshot: createCommissioningLabFixture(),
  projectId: 'DAS-BESS-LAB',
  scopeId: 'SCOPE-LAB-001',
  generatedAt: GENERATED_AT,
  generatedBy: GENERATED_BY,
});

test('commissioning report is deterministic for identical snapshot and explicit generation context', () => {
  assert.deepEqual(buildLabReport(), buildLabReport());
});

test('commissioning report preserves scope exclusion and does not count external comparison SolBank', () => {
  const report = buildLabReport();
  assert.equal(report.summary.assetsInScope, 54);
  assert.equal(report.project.projectId, 'DAS-BESS-LAB');
  assert.equal(report.scope.scopeId, 'SCOPE-LAB-001');
  assert.equal(report.campaigns.length, 1);
});

test('processed E2E report preserves complete traceability without promoting excluded asset into acceptance scope', () => {
  const snapshot = createCommissioningCertificationFixture();
  const report = buildCommissioningReport({
    snapshot,
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    generatedAt: GENERATED_AT,
    generatedBy: GENERATED_BY,
  });

  assert.equal(
    snapshot.scopeAssets.find((item) => item.assetId === 'SB-LAB-004-EXTERNAL')?.status,
    'EXCLUDED',
  );
  assert.equal(report.summary.assetsInScope, 54);
  assert.equal(report.summary.anomalies.total, 9);
  assert.equal(report.summary.anomalies.active, 9);
  assert.equal(report.summary.findings.total, 5);
  assert.equal(report.summary.punchItems.total, 3);
  assert.equal(report.summary.evidenceRecords, 6);
  assert.equal(report.traceability.anomalyIds.length, 9);
  assert.equal(report.traceability.findingIds.length, 5);
  assert.equal(report.traceability.punchItemIds.length, 3);
  assert.equal(report.traceability.evidenceIds.length, 6);
  assert.equal(report.traceability.humanAcceptanceDecisionIds.length, 4);
  assert.match(report.limitations.join(' '), /EXCLUDED assets/i);
});

test('basic UI lab truthfully reports absent processed commissioning records', () => {
  const report = buildLabReport();
  assert.equal(report.summary.testExecutions, 0);
  assert.equal(report.summary.anomalies.total, 0);
  assert.equal(report.summary.findings.total, 0);
  assert.equal(report.summary.punchItems.total, 0);
  assert.equal(report.summary.evidenceRecords, 0);
  assert.equal(report.baseline, null);
  assert.equal(report.handover, null);
});

test('report counts accepted execution evidence baseline and handover without changing authority boundaries', () => {
  const snapshot = createCommissioningLabFixture();
  const audit = { createdAt: GENERATED_AT, createdBy: GENERATED_BY, updatedAt: GENERATED_AT, updatedBy: GENERATED_BY };

  snapshot.testTemplates.push({
    ...audit,
    testTemplateId: 'TT-REPORT-001',
    code: 'REPORT-TEST',
    name: 'Reporting certification test',
    category: 'REPORTING',
    assetType: 'PCS',
    description: 'Synthetic reporting fixture.',
    requiredSignalKeys: [],
    optionalSignalKeys: [],
    requiredEvidenceTypes: ['COMMENT'],
    applicability: 'MANDATORY',
    version: '1',
    status: 'ACTIVE',
  });
  snapshot.testInstances.push({
    ...audit,
    testInstanceId: 'TI-REPORT-001',
    testTemplateId: 'TT-REPORT-001',
    campaignId: 'CAMPAIGN-LAB-001',
    scopeId: 'SCOPE-LAB-001',
    assetId: 'PCS-LAB-001',
    applicability: 'MANDATORY',
    status: 'COMPLETED',
  });
  snapshot.testExecutions.push({
    ...audit,
    executionId: 'EXEC-REPORT-001',
    testInstanceId: 'TI-REPORT-001',
    executionNumber: 1,
    executionType: 'INITIAL',
    dataQuality: 'GOOD',
    orbiAssessment: 'PASS',
    humanAcceptance: 'ACCEPTED',
    status: 'PASS',
    notes: [],
  });
  snapshot.evidence.push({
    ...audit,
    evidenceId: 'EVID-REPORT-001',
    projectId: 'DAS-BESS-LAB',
    assetId: 'PCS-LAB-001',
    executionId: 'EXEC-REPORT-001',
    type: 'COMMENT',
    name: 'Synthetic accepted evidence',
    source: 'ORBI QA',
  });
  snapshot.humanAcceptanceDecisions.push({
    ...audit,
    acceptanceDecisionId: 'ACCEPT-REPORT-001',
    executionId: 'EXEC-REPORT-001',
    decision: 'ACCEPTED',
    reason: 'Synthetic QA acceptance.',
    decidedBy: GENERATED_BY,
    decidedAt: GENERATED_AT,
  });
  snapshot.baselines.push({
    ...audit,
    baselineId: 'BASELINE-REPORT-001',
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    revision: 'QA-1',
    assetId: 'PCS-LAB-001',
    acceptedAt: GENERATED_AT,
    acceptedBy: GENERATED_BY,
    metrics: [{ metricKey: 'response_time', value: 6, unit: 's', sourceExecutionId: 'EXEC-REPORT-001', acceptedAt: GENERATED_AT }],
    firmwareVersions: {},
    configurationReferences: [],
    knownDeviationFindingIds: [],
    status: 'AVAILABLE',
  });
  snapshot.handoverPackages.push({
    ...audit,
    handoverPackageId: 'HANDOVER-REPORT-001',
    projectId: 'DAS-BESS-LAB',
    scopeId: 'SCOPE-LAB-001',
    baselineId: 'BASELINE-REPORT-001',
    status: 'READY',
    requiredDocumentReferences: ['DOC-QA-001'],
    evidenceIds: ['EVID-REPORT-001'],
    openFindingIds: [],
    openPunchItemIds: [],
    humanAcceptanceDecisionIds: ['ACCEPT-REPORT-001'],
  });

  const report = buildCommissioningReport({ snapshot, projectId: 'DAS-BESS-LAB', scopeId: 'SCOPE-LAB-001', generatedAt: GENERATED_AT, generatedBy: GENERATED_BY });
  assert.equal(report.summary.testExecutions, 1);
  assert.equal(report.summary.executionAssessmentCounts.PASS, 1);
  assert.equal(report.summary.humanAcceptanceCounts.ACCEPTED, 1);
  assert.equal(report.summary.evidenceRecords, 1);
  assert.equal(report.summary.baselines.available, 1);
  assert.equal(report.summary.handoverPackages.readyOrBeyond, 1);
  assert.equal(report.baseline?.baselineId, 'BASELINE-REPORT-001');
  assert.equal(report.handover?.handoverPackageId, 'HANDOVER-REPORT-001');
  assert.match(report.limitations.join(' '), /does not authorize energization/i);
});

test('text report renders explicit Shadow Mode and authority limitations', () => {
  const text = renderCommissioningReportText(buildLabReport());
  assert.match(text, /READ_ONLY_SHADOW_MODE/);
  assert.match(text, /does not issue OT commands/i);
  assert.match(text, /does not authorize energization/i);
});

test('report builder rejects unknown project or scope instead of creating a partial report', () => {
  const snapshot = createCommissioningLabFixture();
  assert.throws(() => buildCommissioningReport({ snapshot, projectId: 'UNKNOWN', scopeId: 'SCOPE-LAB-001', generatedAt: GENERATED_AT, generatedBy: GENERATED_BY }), /was not found/);
  assert.throws(() => buildCommissioningReport({ snapshot, projectId: 'DAS-BESS-LAB', scopeId: 'UNKNOWN', generatedAt: GENERATED_AT, generatedBy: GENERATED_BY }), /was not found/);
});
