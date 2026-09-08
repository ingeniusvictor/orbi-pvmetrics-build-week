import test from 'node:test';
import assert from 'node:assert/strict';
import { runAnomalyRules, type CommissioningAnomalyContext } from './anomalyEngine';
import { createLabAnomalyRules } from './createLabAnomalyRules';
import type { Calculation, CommissioningEvent, TelemetrySample } from '../contracts';

const telemetry = (assetId: string, signalKey: string, value: number | null, timestamp: string, quality: TelemetrySample['quality'] = 'GOOD'): TelemetrySample => ({
  timestamp,
  assetId,
  signalKey,
  value,
  unit: signalKey.includes('temperature') ? '°C' : signalKey.includes('soc') ? '%' : signalKey.includes('voltage') ? 'V' : 'kW',
  sourceSystem: 'LAB',
  quality,
});

const calculation = (metricKey: string, resultValue: number): Calculation => ({
  calculationId: `CALC:${metricKey}`,
  executionId: 'EXEC-LAB-001',
  metricKey,
  algorithmVersion: 'LAB-1',
  inputSignalKeys: [],
  resultValue,
  calculatedAt: '2026-09-08T12:10:00Z',
  notes: [],
});

const event = (assetId: string, code: string): CommissioningEvent => ({
  eventId: `EVENT:${assetId}:${code}`,
  projectId: 'DAS-BESS-LAB',
  assetId,
  executionId: 'EXEC-LAB-001',
  occurredAt: '2026-09-08T12:05:00Z',
  eventType: 'WARNING',
  severity: 'WARNING',
  code,
  message: code,
  sourceSystem: 'LAB',
  evidenceIds: [],
});

const context: CommissioningAnomalyContext = {
  projectId: 'DAS-BESS-LAB',
  campaignId: 'CAMPAIGN-LAB-001',
  executionId: 'EXEC-LAB-001',
  evaluatedAt: '2026-09-08T12:15:00Z',
  telemetry: [
    telemetry('RACK-LAB-2-07', 'rack.temperature_c', 47, '2026-09-08T12:00:00Z'),
    telemetry('RACK-LAB-3-11', 'rack.soc_pct', 22, '2026-09-08T12:00:00Z'),
    telemetry('SB-LAB-001', 'solbank.active_power_kw', null, '2026-09-08T12:00:05Z', 'MISSING'),
    telemetry('RACK-LAB-3-04', 'rack.voltage_v', 1000, '2026-09-08T12:00:00Z'),
    telemetry('RACK-LAB-3-04', 'rack.voltage_v', 1000, '2026-09-08T12:00:05Z'),
    telemetry('RACK-LAB-3-04', 'rack.voltage_v', 1000, '2026-09-08T12:00:10Z'),
    telemetry('RACK-LAB-3-04', 'rack.voltage_v', 1000, '2026-09-08T12:00:15Z'),
    telemetry('SB-LAB-004-EXTERNAL', 'solbank.active_power_kw', 250, '2026-09-08T12:00:20Z'),
  ],
  calculations: [
    calculation('pcs.response_time_s', 18),
    calculation('pcs_meter_mismatch_pct', 4.5),
  ],
  events: [event('BMS-LAB-001', 'BMS-WARN-204')],
  scopeAssetStatusByAssetId: {
    'SB-LAB-004-EXTERNAL': 'EXCLUDED',
  },
};

test('LAB anomaly profile produces exactly AR001 through AR009', () => {
  const anomalies = runAnomalyRules(context, createLabAnomalyRules());
  assert.equal(anomalies.length, 9);
  assert.deepEqual(anomalies.map((anomaly) => anomaly.ruleId), [
    'AR001', 'AR002', 'AR003', 'AR004', 'AR005', 'AR006', 'AR007', 'AR008', 'AR009',
  ]);
});

test('LAB anomalies are explicitly marked synthetic and do not confirm root cause', () => {
  const anomalies = runAnomalyRules(context, createLabAnomalyRules());
  assert.ok(anomalies.every((anomaly) => anomaly.notes.some((note) => note.includes('Synthetic LAB rule'))));
  assert.equal(anomalies.some((anomaly) => 'rootCause' in anomaly), false);
});

test('AR009 clears when Fast Stop evidence is present', () => {
  const withFastStop = {
    ...context,
    events: [...context.events, event('SB-LAB-003', 'FAST-STOP-RECEIVED')],
  };
  const anomalies = runAnomalyRules(withFastStop, createLabAnomalyRules());
  assert.equal(anomalies.some((anomaly) => anomaly.ruleId === 'AR009'), false);
  assert.equal(anomalies.length, 8);
});
