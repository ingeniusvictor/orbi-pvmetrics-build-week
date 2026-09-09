import assert from 'node:assert/strict';
import test from 'node:test';

import { assessTelemetryCsvContent } from './telemetryContentValidation';

const header = 'timestamp,assetId,signalKey,value,unit,sourceSystem,quality';

const row = (
  timestamp = '2026-09-09T12:00:00Z',
  assetId = 'PB-01',
  signalKey = 'pcs.active_power_kw',
  value = '1200.5',
  unit = 'kW',
  sourceSystem = 'PCS_EXPORT',
  quality = 'GOOD',
) => `${timestamp},${assetId},${signalKey},${value},${unit},${sourceSystem},${quality}`;

test('accepts a valid normalized telemetry CSV for review', () => {
  const result = assessTelemetryCsvContent(`${header}\n${row()}\n${row('2026-09-09T12:00:01Z', 'PB-01', 'pcs.active_power_kw', '1201.0')}\n`);
  assert.equal(result.status, 'READY_FOR_REVIEW');
  assert.equal(result.dataRowCount, 2);
  assert.deepEqual(result.issueCounts, {});
});

test('blocks a header-only telemetry template from content admission', () => {
  const result = assessTelemetryCsvContent(`${header}\n`);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.issueCounts.EMPTY_DATASET, 1);
});

test('detects invalid timestamp, empty asset, non-numeric value, missing unit and unknown quality', () => {
  const result = assessTelemetryCsvContent(`${header}\nnot-a-date,,pcs.active_power_kw,abc,,PCS_EXPORT,UNKNOWN\n`);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.issueCounts.INVALID_TIMESTAMP, 1);
  assert.equal(result.issueCounts.EMPTY_ASSET_ID, 1);
  assert.equal(result.issueCounts.NON_NUMERIC_VALUE, 1);
  assert.equal(result.issueCounts.MISSING_UNIT, 1);
  assert.equal(result.issueCounts.INVALID_QUALITY, 1);
});

test('detects exact duplicate rows', () => {
  const sample = row();
  const result = assessTelemetryCsvContent(`${header}\n${sample}\n${sample}\n`);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.issueCounts.DUPLICATE_ROW, 1);
});

test('detects conflicting samples for the same timestamp asset signal and source', () => {
  const result = assessTelemetryCsvContent(`${header}\n${row()}\n${row('2026-09-09T12:00:00Z', 'PB-01', 'pcs.active_power_kw', '1300.0')}\n`);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.issueCounts.CONFLICTING_SAMPLE, 1);
});

test('detects unit changes without silently converting values', () => {
  const result = assessTelemetryCsvContent(`${header}\n${row()}\n${row('2026-09-09T12:00:01Z', 'PB-01', 'pcs.active_power_kw', '1.2', 'MW')}\n`);
  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.issueCounts.INCONSISTENT_UNIT, 1);
});

test('warns on out-of-order rows but does not auto-sort them', () => {
  const result = assessTelemetryCsvContent(`${header}\n${row('2026-09-09T12:00:01Z')}\n${row('2026-09-09T12:00:00Z')}\n`);
  assert.equal(result.status, 'READY_FOR_REVIEW');
  assert.match(result.warnings.join(' '), /out of chronological order/i);
  assert.match(result.warnings.join(' '), /not auto-sorted/i);
});

test('supports quoted fields containing commas', () => {
  const result = assessTelemetryCsvContent(`${header}\n2026-09-09T12:00:00Z,PB-01,"pcs.power,phase_a",12.4,kW,PCS_EXPORT,GOOD\n`);
  assert.equal(result.status, 'READY_FOR_REVIEW');
  assert.equal(result.dataRowCount, 1);
});
