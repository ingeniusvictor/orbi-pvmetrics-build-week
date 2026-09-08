import type { AnomalyRule, CommissioningAnomalyContext } from './anomalyEngine';
import { calculationValue, numericTelemetry } from './anomalyEngine';

const make = (
  context: CommissioningAnomalyContext,
  ruleId: string,
  assetId: string,
  title: string,
  description: string,
  severity: 'INFO' | 'WARNING' | 'MAJOR' | 'CRITICAL',
  impact: 'INFORMATIONAL' | 'ASSESSMENT_RELEVANT' | 'GATE_BLOCKING',
) => ({
  anomalyId: `${ruleId}:${assetId}:${context.evaluatedAt}`,
  executionId: context.executionId,
  campaignId: context.campaignId,
  assetId,
  ruleId,
  ruleVersion: 'LAB-1',
  title,
  description,
  severity,
  impact,
  status: 'NEW' as const,
  detectedAt: context.evaluatedAt,
  evidenceIds: [],
  criterionSnapshotIds: [],
  calculationIds: [],
  notes: ['Synthetic LAB rule. Must not govern PROJECT mode.'],
});

const maxValue = (context: CommissioningAnomalyContext, key: string, assetId: string): number | null => {
  const values = numericTelemetry(context, key, assetId).map((sample) => sample.value as number);
  return values.length ? Math.max(...values) : null;
};

const minValue = (context: CommissioningAnomalyContext, key: string, assetId: string): number | null => {
  const values = numericTelemetry(context, key, assetId).map((sample) => sample.value as number);
  return values.length ? Math.min(...values) : null;
};

export const createLabAnomalyRules = (): AnomalyRule[] => [
  {
    ruleId: 'AR001', ruleVersion: 'LAB-1', evaluate: (context) => {
      const assetId = 'RACK-LAB-2-07';
      const max = maxValue(context, 'rack.temperature_c', assetId);
      return max !== null && max > 45
        ? [make(context, 'AR001', assetId, 'Rack thermal excursion', `Synthetic rack temperature reached ${max} °C.`, 'MAJOR', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR002', ruleVersion: 'LAB-1', evaluate: (context) => {
      const assetId = 'RACK-LAB-3-11';
      const min = minValue(context, 'rack.soc_pct', assetId);
      return min !== null && min < 25
        ? [make(context, 'AR002', assetId, 'Rack SOC deviation', `Synthetic rack SOC fell to ${min}%.`, 'WARNING', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR003', ruleVersion: 'LAB-1', evaluate: (context) => {
      const value = calculationValue(context, 'pcs.response_time_s');
      return value !== null && value > 10
        ? [make(context, 'AR003', 'PCS-LAB-001', 'PCS slow response', `Synthetic PCS response time was ${value}s versus LAB threshold 10s.`, 'MAJOR', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR004', ruleVersion: 'LAB-1', evaluate: (context) => {
      const missing = context.telemetry.some((sample) => sample.assetId === 'SB-LAB-001' && sample.quality === 'MISSING');
      return missing
        ? [make(context, 'AR004', 'SB-LAB-001', 'Telemetry dropout', 'Synthetic SolBank 1 contains missing telemetry samples.', 'WARNING', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR005', ruleVersion: 'LAB-1', evaluate: (context) => {
      const assetId = 'RACK-LAB-3-04';
      const samples = numericTelemetry(context, 'rack.voltage_v', assetId);
      const frozen = samples.length >= 4 && samples.every((sample) => sample.value === samples[0].value);
      return frozen
        ? [make(context, 'AR005', assetId, 'Frozen rack voltage signal', 'Synthetic rack voltage remained unchanged across the evaluation window.', 'WARNING', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR006', ruleVersion: 'LAB-1', evaluate: (context) => {
      const value = calculationValue(context, 'pcs_meter_mismatch_pct');
      return value !== null && Math.abs(value) > 3
        ? [make(context, 'AR006', 'PB-LAB-001', 'PCS / meter mismatch', `Synthetic PCS-to-meter mismatch was ${value}%.`, 'MAJOR', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR007', ruleVersion: 'LAB-1', evaluate: (context) => {
      const event = context.events.find((candidate) => candidate.code === 'BMS-WARN-204');
      return event
        ? [make(context, 'AR007', event.assetId ?? 'BMS-LAB-001', 'BMS warning detected', 'Synthetic BMS-WARN-204 event detected.', 'WARNING', 'ASSESSMENT_RELEVANT')]
        : [];
    },
  },
  {
    ruleId: 'AR008', ruleVersion: 'LAB-1', evaluate: (context) => {
      const assetId = 'SB-LAB-004-EXTERNAL';
      const isExcluded = context.scopeAssetStatusByAssetId[assetId] === 'EXCLUDED';
      const response = numericTelemetry(context, 'solbank.active_power_kw', assetId).some((sample) => Math.abs(sample.value as number) > 50);
      return isExcluded && response
        ? [make(context, 'AR008', assetId, 'Cross-block response outside scope', 'Excluded comparison SolBank responded during in-scope test execution.', 'MAJOR', 'GATE_BLOCKING')]
        : [];
    },
  },
  {
    ruleId: 'AR009', ruleVersion: 'LAB-1', evaluate: (context) => {
      const fastStop = context.events.some((event) => event.assetId === 'SB-LAB-003' && event.code === 'FAST-STOP-RECEIVED');
      return !fastStop
        ? [make(context, 'AR009', 'SB-LAB-003', 'Fast Stop evidence missing', 'No synthetic Fast Stop receipt event was observed for SolBank 3.', 'CRITICAL', 'GATE_BLOCKING')]
        : [];
    },
  },
];
