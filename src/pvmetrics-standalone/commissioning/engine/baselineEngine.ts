import type { Calculation, CommissioningBaseline, TestExecution } from '../contracts';

export type BuildBaselineInput = {
  baselineId: string;
  projectId: string;
  scopeId: string;
  revision: string;
  assetId: string;
  executions: readonly TestExecution[];
  calculations: readonly Calculation[];
  metricKeys: readonly string[];
  acceptedAt: string;
  acceptedBy: string;
  firmwareVersions?: Record<string, string>;
  configurationReferences?: string[];
  knownDeviationFindingIds?: string[];
};

const isAcceptedPass = (execution: TestExecution) =>
  execution.orbiAssessment === 'PASS' &&
  (execution.humanAcceptance === 'ACCEPTED' || execution.humanAcceptance === 'ACCEPTED_WITH_COMMENTS');

export const buildCommissioningBaseline = (input: BuildBaselineInput): CommissioningBaseline => {
  const accepted = input.executions.filter(isAcceptedPass);
  const byExecution = new Map(accepted.map((execution) => [execution.executionId, execution]));

  const metrics = input.metricKeys.flatMap((metricKey) => {
    const candidates = input.calculations
      .filter((calculation) => calculation.metricKey === metricKey && byExecution.has(calculation.executionId))
      .sort((a, b) => {
        const ea = byExecution.get(a.executionId)!;
        const eb = byExecution.get(b.executionId)!;
        if (ea.executionType === 'RETEST' && eb.executionType !== 'RETEST') return -1;
        if (eb.executionType === 'RETEST' && ea.executionType !== 'RETEST') return 1;
        return eb.executionNumber - ea.executionNumber;
      });
    const selected = candidates[0];
    if (!selected) return [];
    return [{
      metricKey,
      value: selected.resultValue ?? null,
      unit: selected.unit,
      sourceExecutionId: selected.executionId,
      calculationId: selected.calculationId,
      acceptedAt: input.acceptedAt,
    }];
  });

  if (metrics.length === 0) throw new Error('Baseline requires at least one metric from an accepted PASS execution.');

  return {
    baselineId: input.baselineId,
    projectId: input.projectId,
    scopeId: input.scopeId,
    revision: input.revision,
    assetId: input.assetId,
    acceptedAt: input.acceptedAt,
    acceptedBy: input.acceptedBy,
    metrics,
    firmwareVersions: input.firmwareVersions ?? {},
    configurationReferences: input.configurationReferences ?? [],
    knownDeviationFindingIds: input.knownDeviationFindingIds ?? [],
    status: 'AVAILABLE',
    createdAt: input.acceptedAt,
    createdBy: input.acceptedBy,
    updatedAt: input.acceptedAt,
    updatedBy: input.acceptedBy,
  };
};
