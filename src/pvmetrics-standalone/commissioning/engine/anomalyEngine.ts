import type { Anomaly, Calculation, CommissioningEvent, TelemetrySample } from '../contracts';

export type CommissioningAnomalyContext = {
  projectId: string;
  campaignId?: string;
  executionId?: string;
  evaluatedAt: string;
  telemetry: readonly TelemetrySample[];
  calculations: readonly Calculation[];
  events: readonly CommissioningEvent[];
  scopeAssetStatusByAssetId: Readonly<Record<string, 'INCLUDED' | 'PARTIAL' | 'EXCLUDED' | 'THIRD_PARTY' | 'PENDING_CONFIRMATION'>>;
};

export type AnomalyRule = {
  ruleId: string;
  ruleVersion: string;
  evaluate: (context: CommissioningAnomalyContext) => Array<Omit<Anomaly, 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>>;
};

export const runAnomalyRules = (
  context: CommissioningAnomalyContext,
  rules: readonly AnomalyRule[],
): Anomaly[] => {
  const seen = new Set<string>();
  const anomalies: Anomaly[] = [];

  for (const rule of rules) {
    for (const candidate of rule.evaluate(context)) {
      const dedupeKey = `${candidate.ruleId}|${candidate.assetId}|${candidate.detectedAt}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      anomalies.push({
        ...candidate,
        createdAt: context.evaluatedAt,
        createdBy: 'ORBI-RULE-ENGINE',
        updatedAt: context.evaluatedAt,
        updatedBy: 'ORBI-RULE-ENGINE',
      });
    }
  }

  return anomalies.sort((a, b) => a.ruleId.localeCompare(b.ruleId) || a.assetId.localeCompare(b.assetId));
};

export const numericTelemetry = (
  context: CommissioningAnomalyContext,
  signalKey: string,
  assetId?: string,
): TelemetrySample[] => context.telemetry.filter((sample) =>
  sample.signalKey === signalKey &&
  (assetId === undefined || sample.assetId === assetId) &&
  typeof sample.value === 'number' &&
  Number.isFinite(sample.value),
);

export const calculationValue = (context: CommissioningAnomalyContext, metricKey: string): number | null => {
  const value = context.calculations.find((calculation) => calculation.metricKey === metricKey)?.resultValue;
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};
