import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDataQuality } from './dataQualityEngine';
import type { TelemetrySample } from '../contracts';

const sample = (timestamp: string, value: number | null, quality: TelemetrySample['quality'] = 'GOOD'): TelemetrySample => ({
  timestamp,
  assetId: 'PB-LAB-001',
  signalKey: 'pcs.active_power_kw',
  value,
  unit: 'kW',
  sourceSystem: 'LAB',
  quality,
});

test('GOOD requires complete clean telemetry', () => {
  const result = evaluateDataQuality([
    sample('2026-01-01T00:00:00Z', 0),
    sample('2026-01-01T00:00:05Z', 10),
    sample('2026-01-01T00:00:10Z', 20),
  ], { expectedSamples: 3 });
  assert.equal(result.quality, 'GOOD');
});

test('missing mandatory telemetry degrades assessment rather than inventing a value', () => {
  const result = evaluateDataQuality([
    sample('2026-01-01T00:00:00Z', 0),
    sample('2026-01-01T00:00:05Z', null, 'MISSING'),
  ], { expectedSamples: 3 });
  assert.equal(result.quality, 'POOR');
  assert.equal(result.missingSamples, 1);
});

test('invalid samples make the dataset invalid', () => {
  const result = evaluateDataQuality([sample('2026-01-01T00:00:00Z', 1, 'INVALID')]);
  assert.equal(result.quality, 'INVALID');
});

test('duplicate samples are detected deterministically', () => {
  const t = '2026-01-01T00:00:00Z';
  const result = evaluateDataQuality([sample(t, 1), sample(t, 1)]);
  assert.equal(result.duplicateSamples, 1);
  assert.equal(result.quality, 'DEGRADED');
});

test('frozen signals are detected without declaring the underlying equipment failed', () => {
  const result = evaluateDataQuality([
    sample('2026-01-01T00:00:00Z', 5),
    sample('2026-01-01T00:00:05Z', 5),
    sample('2026-01-01T00:00:10Z', 5),
    sample('2026-01-01T00:00:15Z', 5),
  ], { frozenRunLength: 4 });
  assert.equal(result.quality, 'DEGRADED');
  assert.equal(result.frozenSignalKeys.length, 1);
  assert.ok(result.issues.some((issue) => issue.code === 'FROZEN_SIGNAL'));
});
