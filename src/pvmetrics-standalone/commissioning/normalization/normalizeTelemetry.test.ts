import assert from 'node:assert/strict';
import test from 'node:test';

import type { SignalMapping, TelemetrySample } from '../contracts';
import { normalizeTelemetry } from './normalizeTelemetry';

const sample: TelemetrySample = {
  timestamp: '2026-09-08T12:00:00.000Z',
  assetId: 'PCS-LAB-001',
  signalKey: 'P_ACTIVE_KW',
  value: 4100,
  unit: 'kW',
  sourceSystem: 'SCADA',
  quality: 'GOOD',
};

const baseMapping: SignalMapping = {
  signalMappingId: 'MAP-1',
  sourceSystem: 'SCADA',
  sourceSignal: 'P_ACTIVE_KW',
  canonicalSignalKey: 'pcs.active_power',
  sourceUnit: 'kW',
  canonicalUnit: 'MW',
  scale: 0.001,
  status: 'CONFIRMED',
  createdAt: '2026-09-08T12:00:00.000Z',
  createdBy: 'test',
  updatedAt: '2026-09-08T12:00:00.000Z',
  updatedBy: 'test',
};

test('confirmed explicit unit transform normalizes signal and value', () => {
  const result = normalizeTelemetry([sample], [baseMapping]);
  assert.equal(result.rejectedCount, 0);
  assert.equal(result.samples[0]?.signalKey, 'pcs.active_power');
  assert.equal(result.samples[0]?.value, 4.1);
  assert.equal(result.samples[0]?.unit, 'MW');
});

test('unit relabel without explicit transform is rejected', () => {
  const mapping = { ...baseMapping, scale: undefined };
  const result = normalizeTelemetry([sample], [mapping]);

  assert.equal(result.normalizedCount, 0);
  assert.ok(result.issues.some((issue) => issue.code === 'UNIT_TRANSFORM_NOT_DECLARED'));
});

test('pending mapping cannot normalize telemetry', () => {
  const mapping = { ...baseMapping, status: 'PENDING_CONFIRMATION' as const };
  const result = normalizeTelemetry([sample], [mapping]);

  assert.equal(result.normalizedCount, 0);
  assert.ok(result.issues.some((issue) => issue.code === 'MAPPING_NOT_CONFIRMED'));
});
