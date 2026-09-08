import type { Anomaly, Finding, FindingSeverity } from '../contracts';

export type FindingPolicy = {
  ruleId: string;
  createFinding: boolean;
  category: string;
  severity?: FindingSeverity;
  requiresPunch: boolean;
};

export type FindingsInput = {
  projectId: string;
  evaluatedAt: string;
  anomalies: readonly Anomaly[];
  policies: readonly FindingPolicy[];
};

export const createFindingsFromAnomalies = ({ projectId, evaluatedAt, anomalies, policies }: FindingsInput): Finding[] => {
  const byRule = new Map(policies.map((policy) => [policy.ruleId, policy]));
  const findings: Finding[] = [];

  for (const anomaly of anomalies) {
    const policy = byRule.get(anomaly.ruleId);
    if (!policy?.createFinding) continue;
    findings.push({
      findingId: `FINDING:${anomaly.ruleId}:${anomaly.assetId}`,
      projectId,
      assetId: anomaly.assetId,
      executionId: anomaly.executionId,
      sourceAnomalyIds: [anomaly.anomalyId],
      title: anomaly.title,
      description: anomaly.description,
      category: policy.category,
      severity: policy.severity ?? anomaly.severity,
      status: 'OPEN',
      rootCauseState: 'UNKNOWN',
      evidenceIds: [...anomaly.evidenceIds],
      requiresPunch: policy.requiresPunch,
      createdAt: evaluatedAt,
      createdBy: 'ORBI-FINDINGS-ENGINE',
      updatedAt: evaluatedAt,
      updatedBy: 'ORBI-FINDINGS-ENGINE',
    });
  }

  return findings.sort((a, b) => a.findingId.localeCompare(b.findingId));
};

export const LAB_FINDING_POLICIES: FindingPolicy[] = [
  { ruleId: 'AR001', createFinding: true, category: 'THERMAL', requiresPunch: true },
  { ruleId: 'AR002', createFinding: false, category: 'SOC', requiresPunch: false },
  { ruleId: 'AR003', createFinding: true, category: 'PCS_RESPONSE', requiresPunch: false },
  { ruleId: 'AR004', createFinding: false, category: 'DATA_QUALITY', requiresPunch: false },
  { ruleId: 'AR005', createFinding: false, category: 'DATA_QUALITY', requiresPunch: false },
  { ruleId: 'AR006', createFinding: true, category: 'METERING', requiresPunch: false },
  { ruleId: 'AR007', createFinding: false, category: 'BMS_EVENT', requiresPunch: false },
  { ruleId: 'AR008', createFinding: true, category: 'SCOPE_ASSIGNMENT', requiresPunch: true },
  { ruleId: 'AR009', createFinding: true, category: 'SAFETY_FAST_STOP', severity: 'CRITICAL', requiresPunch: true },
];
