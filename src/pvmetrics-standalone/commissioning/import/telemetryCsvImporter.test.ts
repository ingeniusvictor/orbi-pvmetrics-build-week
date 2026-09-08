import assert from 'node:assert/strict';
import test from 'node:test';

import { importTelemetryCsv } from './telemetryCsvImporter';

const options = {
  datasetId: 'DATASET-1',
  projectId: 'DAS-BESS-LAB',
  scopeId: 'SCOPE-LAB-001',
  sourceName: 'telemetry.csv',
  actor: 'test',
  importedAt: '2026-09-08T12:00:00.000Z',
};

test('accepts valid telemetry CSV without changing units', () => {
  const csv = [
    'timestamp,assetId,signalKey,value,unit,sourceSystem,quality',
    '2026-09-08T12:00:00.000Z,PCS-LAB-001,pcs.active_power,4.1,MW,SCADA,GOOD',
  ].join('\n');
  const result = importTelemetryCsv(csv, options);

  assert.equal(result.dataset.importResult, 'ACCEPTED');
  assert.equal(result.dataset.dataQuality, 'GOOD');
  assert.equal(result.samples[0]?.value, 4.1);
  assert.equal(result.samples[0]?.unit, 'MW');
});

test('rejects missing required headers', () => {
  const result = importTelemetryCsv('timestamp,value\n2026-09-08T12:00:00.000Z,1', options);
  assert.equal(result.dataset.importResult, 'REJECTED');
  assert.equal(result.samples.length, 0);
  assert.match(result.dataset.errors[0] ?? '', /Missing required headers/);
});

test('duplicate samples are skipped and downgrade data quality', () => {
  const csv = [
    'timestamp,assetId,signalKey,value,unit,sourceSystem,quality',
    '2026-09-08T12:00:00.000Z,PCS-LAB-001,pcs.active_power,4.1,MW,SCADA,GOOD',
    '2026-09-08T12:00:00.000Z,PCS-LAB-001,pcs.active_power,4.2,MW,SCADA,GOOD',
  ].join('\n');
  const result = importTelemetryCsv(csv, options);

  assert.equal(result.samples.length, 1);
  assert.equal(result.dataset.duplicateSamples, 1);
  assert.equal(result.dataset.dataQuality, 'DEGRADED');
  assert.equal(result.dataset.importResult, 'ACCEPTED_WITH_WARNINGS');
});

test('invalid quality is never silently normalized', () => {
  const csv = [
    'timestamp,assetId,signalKey,value,unit,sourceSystem,quality',
    '2026-09-08T12:00:00.000Z,PCS-LAB-001,pcs.active_power,4.1,MW,SCADA,OK',
  ].join('\n');
  const result = importTelemetryCsv(csv, options);

  assert.equal(result.samples.length, 0);
  assert.equal(result.dataset.importResult, 'REJECTED');
  assert.match(result.dataset.errors[0] ?? '', /unsupported quality/);
});
