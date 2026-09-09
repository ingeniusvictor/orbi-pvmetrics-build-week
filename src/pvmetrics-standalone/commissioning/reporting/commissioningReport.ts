import type {
  AssessmentStatus,
  CommissioningBaseline,
  CommissioningCampaign,
  CommissioningProject,
  CommissioningScope,
  DataQuality,
  HandoverPackage,
  HumanAcceptanceStatus,
} from '../contracts';
import type { CommissioningSnapshot } from '../persistence';

export const COMMISSIONING_REPORT_SCHEMA_VERSION = 1 as const;

export type CommissioningReportInput = {
  snapshot: CommissioningSnapshot;
  projectId: string;
  scopeId: string;
  generatedAt: string;
  generatedBy: string;
};

export type StatusCount<T extends string> = Record<T, number>;

export type CommissioningReport = {
  schemaVersion: typeof COMMISSIONING_REPORT_SCHEMA_VERSION;
  generatedAt: string;
  generatedBy: string;
  mode: 'READ_ONLY_SHADOW_MODE';
  project: Pick<CommissioningProject, 'projectId' | 'name' | 'client' | 'country' | 'region' | 'site' | 'ratedPowerMw' | 'ratedEnergyMwh' | 'lifecycleStatus'>;
  scope: Pick<CommissioningScope, 'scopeId' | 'revision' | 'name' | 'status' | 'sourceReference'>;
  campaigns: Array<Pick<CommissioningCampaign, 'campaignId' | 'name' | 'type' | 'status'>>;
  summary: {
    assetsInScope: number;
    testInstances: number;
    testExecutions: number;
    executionAssessmentCounts: StatusCount<AssessmentStatus>;
    humanAcceptanceCounts: StatusCount<HumanAcceptanceStatus>;
    dataQualityCounts: StatusCount<DataQuality>;
    anomalies: { total: number; active: number; gateBlocking: number };
    findings: { total: number; open: number; criticalOpen: number };
    punchItems: { total: number; open: number; readyForRetest: number };
    evidenceRecords: number;
    baselines: { total: number; available: number };
    handoverPackages: { total: number; readyOrBeyond: number };
  };
  baseline: CommissioningBaseline | null;
  handover: HandoverPackage | null;
  traceability: {
    anomalyIds: string[];
    findingIds: string[];
    punchItemIds: string[];
    evidenceIds: string[];
    humanAcceptanceDecisionIds: string[];
  };
  limitations: string[];
};

const assessmentCounts = (): StatusCount<AssessmentStatus> => ({ PASS: 0, WARNING: 0, FAIL: 0, INCONCLUSIVE: 0 });
const acceptanceCounts = (): StatusCount<HumanAcceptanceStatus> => ({
  PENDING: 0,
  ACCEPTED: 0,
  ACCEPTED_WITH_COMMENTS: 0,
  RETEST_REQUIRED: 0,
  REJECTED: 0,
});
const dataQualityCounts = (): StatusCount<DataQuality> => ({ GOOD: 0, DEGRADED: 0, POOR: 0, INVALID: 0 });

const lexical = (values: readonly string[]): string[] => [...values].sort((a, b) => a.localeCompare(b));

export const buildCommissioningReport = ({
  snapshot,
  projectId,
  scopeId,
  generatedAt,
  generatedBy,
}: CommissioningReportInput): CommissioningReport => {
  const project = snapshot.projects.find((item) => item.projectId === projectId);
  if (!project) throw new Error(`Commissioning project ${projectId} was not found.`);
  const scope = snapshot.scopes.find((item) => item.scopeId === scopeId && item.projectId === projectId);
  if (!scope) throw new Error(`Commissioning scope ${scopeId} was not found for project ${projectId}.`);

  const campaigns = snapshot.campaigns.filter((item) => item.projectId === projectId && item.scopeId === scopeId);
  const campaignIds = new Set(campaigns.map((item) => item.campaignId));
  const instances = snapshot.testInstances.filter((item) => item.scopeId === scopeId && campaignIds.has(item.campaignId));
  const instanceIds = new Set(instances.map((item) => item.testInstanceId));
  const executions = snapshot.testExecutions.filter((item) => instanceIds.has(item.testInstanceId));
  const executionIds = new Set(executions.map((item) => item.executionId));

  const assessments = assessmentCounts();
  const acceptances = acceptanceCounts();
  const quality = dataQualityCounts();
  executions.forEach((execution) => {
    assessments[execution.orbiAssessment] += 1;
    acceptances[execution.humanAcceptance] += 1;
    quality[execution.dataQuality] += 1;
  });

  // Acceptance scope and traceability scope are intentionally different concepts.
  // EXCLUDED assets never count as assets in acceptance scope, but observations tied
  // to an explicitly registered excluded comparison asset must remain auditable.
  const scopeAssetRecords = snapshot.scopeAssets.filter((item) => item.scopeId === scopeId);
  const scopeAssetIds = new Set(
    scopeAssetRecords
      .filter((item) => item.status !== 'EXCLUDED')
      .map((item) => item.assetId),
  );
  const traceableScopeAssetIds = new Set(scopeAssetRecords.map((item) => item.assetId));

  const anomalies = snapshot.anomalies.filter((item) =>
    traceableScopeAssetIds.has(item.assetId) &&
    (item.executionId === undefined || executionIds.has(item.executionId)) &&
    (item.campaignId === undefined || campaignIds.has(item.campaignId)),
  );
  const findings = snapshot.findings.filter((item) => item.projectId === projectId && traceableScopeAssetIds.has(item.assetId));
  const findingIds = new Set(findings.map((item) => item.findingId));
  const punches = snapshot.punchItems.filter((item) => findingIds.has(item.findingId));
  const baselines = snapshot.baselines.filter((item) => item.projectId === projectId && item.scopeId === scopeId);
  const handovers = snapshot.handoverPackages.filter((item) => item.projectId === projectId && item.scopeId === scopeId);
  const decisions = snapshot.humanAcceptanceDecisions.filter((item) => executionIds.has(item.executionId));

  const evidenceIds = new Set<string>();
  snapshot.evidence.forEach((item) => {
    if (item.projectId !== projectId) return;
    if (item.assetId && !traceableScopeAssetIds.has(item.assetId)) return;
    if (item.executionId && !executionIds.has(item.executionId)) return;
    evidenceIds.add(item.evidenceId);
  });

  const baseline = [...baselines]
    .sort((a, b) => {
      if (a.status === 'AVAILABLE' && b.status !== 'AVAILABLE') return -1;
      if (b.status === 'AVAILABLE' && a.status !== 'AVAILABLE') return 1;
      return b.acceptedAt.localeCompare(a.acceptedAt);
    })[0] ?? null;

  const handoverRank: Record<HandoverPackage['status'], number> = {
    DRAFT: 0,
    BLOCKED: 1,
    READY: 2,
    APPROVED: 3,
    RECEIVED_BY_O_AND_M: 4,
  };
  const handover = [...handovers].sort((a, b) => handoverRank[b.status] - handoverRank[a.status] || b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;

  return {
    schemaVersion: COMMISSIONING_REPORT_SCHEMA_VERSION,
    generatedAt,
    generatedBy,
    mode: 'READ_ONLY_SHADOW_MODE',
    project: {
      projectId: project.projectId,
      name: project.name,
      client: project.client,
      country: project.country,
      region: project.region,
      site: project.site,
      ratedPowerMw: project.ratedPowerMw,
      ratedEnergyMwh: project.ratedEnergyMwh,
      lifecycleStatus: project.lifecycleStatus,
    },
    scope: {
      scopeId: scope.scopeId,
      revision: scope.revision,
      name: scope.name,
      status: scope.status,
      sourceReference: scope.sourceReference,
    },
    campaigns: campaigns
      .map(({ campaignId, name, type, status }) => ({ campaignId, name, type, status }))
      .sort((a, b) => a.campaignId.localeCompare(b.campaignId)),
    summary: {
      assetsInScope: scopeAssetIds.size,
      testInstances: instances.length,
      testExecutions: executions.length,
      executionAssessmentCounts: assessments,
      humanAcceptanceCounts: acceptances,
      dataQualityCounts: quality,
      anomalies: {
        total: anomalies.length,
        active: anomalies.filter((item) => !['CLEARED', 'DISMISSED'].includes(item.status)).length,
        gateBlocking: anomalies.filter((item) => item.impact === 'GATE_BLOCKING' && !['CLEARED', 'DISMISSED'].includes(item.status)).length,
      },
      findings: {
        total: findings.length,
        open: findings.filter((item) => !['CLOSED', 'DISMISSED'].includes(item.status)).length,
        criticalOpen: findings.filter((item) => item.severity === 'CRITICAL' && !['CLOSED', 'DISMISSED'].includes(item.status)).length,
      },
      punchItems: {
        total: punches.length,
        open: punches.filter((item) => item.status !== 'CLOSED').length,
        readyForRetest: punches.filter((item) => item.status === 'READY_FOR_RETEST').length,
      },
      evidenceRecords: evidenceIds.size,
      baselines: { total: baselines.length, available: baselines.filter((item) => item.status === 'AVAILABLE').length },
      handoverPackages: {
        total: handovers.length,
        readyOrBeyond: handovers.filter((item) => ['READY', 'APPROVED', 'RECEIVED_BY_O_AND_M'].includes(item.status)).length,
      },
    },
    baseline,
    handover,
    traceability: {
      anomalyIds: lexical(anomalies.map((item) => item.anomalyId)),
      findingIds: lexical(findings.map((item) => item.findingId)),
      punchItemIds: lexical(punches.map((item) => item.punchItemId)),
      evidenceIds: lexical([...evidenceIds]),
      humanAcceptanceDecisionIds: lexical(decisions.map((item) => item.acceptanceDecisionId)),
    },
    limitations: [
      'This report is generated from the stored Commissioning snapshot and does not issue OT commands or modify plant systems.',
      'ORBI analytical assessment is distinct from human acceptance and contractual acceptance.',
      'Missing thresholds, documents, evidence or mappings remain missing and must not be inferred.',
      'Traceability preserves observations linked to explicitly registered EXCLUDED assets; this does not include those assets in acceptance scope.',
      'A READY or APPROVED handover state does not authorize energization or operation.',
    ],
  };
};

export const renderCommissioningReportText = (report: CommissioningReport): string => {
  const lines = [
    'ORBI PVMETRICS — BESS COMMISSIONING REPORT',
    `Schema: ${report.schemaVersion}`,
    `Generated: ${report.generatedAt}`,
    `Generated by: ${report.generatedBy}`,
    `Mode: ${report.mode}`,
    '',
    `Project: ${report.project.name} (${report.project.projectId})`,
    `Client: ${report.project.client}`,
    `Site: ${report.project.site}, ${report.project.region}, ${report.project.country}`,
    `Scope: ${report.scope.name} · Revision ${report.scope.revision} · ${report.scope.status}`,
    '',
    'SUMMARY',
    `Assets in scope: ${report.summary.assetsInScope}`,
    `Test instances: ${report.summary.testInstances}`,
    `Test executions: ${report.summary.testExecutions}`,
    `ORBI assessments: PASS ${report.summary.executionAssessmentCounts.PASS} / WARNING ${report.summary.executionAssessmentCounts.WARNING} / FAIL ${report.summary.executionAssessmentCounts.FAIL} / INCONCLUSIVE ${report.summary.executionAssessmentCounts.INCONCLUSIVE}`,
    `Open anomalies: ${report.summary.anomalies.active} (${report.summary.anomalies.gateBlocking} gate-blocking)`,
    `Open findings: ${report.summary.findings.open} (${report.summary.findings.criticalOpen} critical)`,
    `Open punch items: ${report.summary.punchItems.open} (${report.summary.punchItems.readyForRetest} ready for retest)`,
    `Evidence records: ${report.summary.evidenceRecords}`,
    `Available baselines: ${report.summary.baselines.available}`,
    `Handover ready or beyond: ${report.summary.handoverPackages.readyOrBeyond}`,
    '',
    `Selected baseline: ${report.baseline ? `${report.baseline.baselineId} · ${report.baseline.status} · rev ${report.baseline.revision}` : 'NONE'}`,
    `Selected handover: ${report.handover ? `${report.handover.handoverPackageId} · ${report.handover.status}` : 'NONE'}`,
    '',
    'LIMITATIONS',
    ...report.limitations.map((item) => `- ${item}`),
  ];
  return lines.join('\n');
};
