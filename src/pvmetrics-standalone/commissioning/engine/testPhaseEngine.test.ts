import test from 'node:test';
import assert from 'node:assert/strict';
import { detectTestPhases, validatePhaseSequence } from './testPhaseEngine';
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

const rules = [
  { phaseType: 'CHARGING' as const, signalKey: 'pcs.active_power_kw', predicate: (s: TelemetrySample) => typeof s.value === 'number' && s.value > 100 },
  { phaseType: 'DISCHARGING' as const, signalKey: 'pcs.active_power_kw', predicate: (s: TelemetrySample) => typeof s.value === 'number' && s.value < -100 },
  { phaseType: 'HOLD' as const, signalKey: 'pcs.active_power_kw', predicate: (s: TelemetrySample) => typeof s.value === 'number' && Math.abs(s.value) <= 100 },
];

test('detects deterministic charging-hold-discharging sequence', () => {
  const phases = detectTestPhases({
    executionId: 'EXEC-001',
    samples: [
      make('2026-01-01T00:00:00Z', 'pcs.active_power_kw', 500),
      make('2026-01-01T00:00:05Z', 'pcs.active_power_kw', 520),
      make('2026-01-01T00:00:10Z', 'pcs.active_power_kw', 0),
      make('2026-01-01T00:00:15Z', 'pcs.active_power_kw', -500),
    ],
    rules,
  });
  assert.deepEqual(phases.map((p) => p.phaseType), ['CHARGING', 'HOLD', 'DISCHARGING']);
  assert.equal(phases[0].detectionSource, 'RULE_ENGINE');
});

test('phase engine ignores samples that do not match configured rules', () => {
  const phases = detectTestPhases({
    executionId: 'EXEC-001',
    samples: [make('2026-01-01T00:00:00Z', 'battery.soc_pct', 50)],
    rules,
  });
  assert.equal(phases.length, 0);
});

test('phase validation reports overlapping intervals', () => {
  const errors = validatePhaseSequence([
    { testPhaseId: 'P1', executionId: 'E1', phaseType: 'CHARGING', startedAt: '2026-01-01T00:00:00Z', endedAt: '2026-01-01T00:00:20Z', detectionSource: 'MANUAL', evidenceIds: [] },
    { testPhaseId: 'P2', executionId: 'E1', phaseType: 'HOLD', startedAt: '2026-01-01T00:00:10Z', detectionSource: 'MANUAL', evidenceIds: [] },
  ]);
  assert.equal(errors.length, 1);
});
