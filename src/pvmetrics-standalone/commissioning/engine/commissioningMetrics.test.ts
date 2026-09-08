import test from 'node:test';
import assert from 'node:assert/strict';
import { builtInCommissioningMetrics, calculateCommissioningMetrics } from './commissioningMetrics';
import type { TelemetrySample } from '../contracts';

const make = (timestamp: string, signalKey: string, value: number): TelemetrySample => ({
  timestamp,
  assetId: 'PB-LAB-001',
  signalKey,
  value,
  unit: 'kW',
  sourceSystem: 'LAB',
  quality: 'GOOD',
});

test('metrics engine calculates values without deciding PASS or FAIL', () => {
  const samples = [
    make('2026-01-01T00:00:00Z', 'pcs.power_kw', 100),
    make('2026-01-01T00:00:05Z', 'pcs.power_kw', 200),
  ];
  const calculations = calculateCommissioningMetrics({
    executionId: 'EXEC-001',
    samples,
    definitions: [{ metricKey: 'avg_power_kw', unit: 'kW', requiredSignalKeys: ['pcs.power_kw'], calculate: builtInCommissioningMetrics.average('pcs.power_kw') }],
    algorithmVersion: 'metrics-v1',
    calculatedAt: '2026-01-01T01:00:00Z',
  });
  assert.equal(calculations[0].resultValue, 150);
  assert.equal('result' in calculations[0], false);
});

test('tracking error uses timestamp-aligned pairs only', () => {
  const metric = builtInCommissioningMetrics.absoluteTrackingErrorMean('actual', 'reference');
  const value = metric([
    make('2026-01-01T00:00:00Z', 'actual', 90),
    make('2026-01-01T00:00:00Z', 'reference', 100),
    make('2026-01-01T00:00:05Z', 'actual', 130),
    make('2026-01-01T00:00:05Z', 'reference', 100),
  ]);
  assert.equal(value, 20);
});

test('response time returns null when required response is absent', () => {
  const metric = builtInCommissioningMetrics.responseTimeSeconds('command_kw', 'actual_kw', 100);
  const value = metric([make('2026-01-01T00:00:00Z', 'command_kw', 500)]);
  assert.equal(value, null);
});

test('response time is calculated deterministically from telemetry timestamps', () => {
  const metric = builtInCommissioningMetrics.responseTimeSeconds('command_kw', 'actual_kw', 100);
  const value = metric([
    make('2026-01-01T00:00:00Z', 'command_kw', 500),
    make('2026-01-01T00:00:05Z', 'actual_kw', 50),
    make('2026-01-01T00:00:10Z', 'actual_kw', 150),
  ]);
  assert.equal(value, 10);
});
