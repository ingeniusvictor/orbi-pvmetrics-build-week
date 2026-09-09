import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PILOT_OPTIONAL_ARTIFACT_KINDS,
  PILOT_REQUIRED_ARTIFACT_KINDS,
} from './pilotReadiness';
import {
  PILOT_CSV_DATA_EXCHANGE_TEMPLATES,
  assessPilotCsvHeader,
  getPilotCsvTemplateColumns,
  renderPilotCsvTemplate,
} from './dataExchangeTemplates';

test('every required and optional pilot artifact kind has a CSV exchange template', () => {
  const kinds = [...PILOT_REQUIRED_ARTIFACT_KINDS, ...PILOT_OPTIONAL_ARTIFACT_KINDS];
  assert.deepEqual(new Set(Object.keys(PILOT_CSV_DATA_EXCHANGE_TEMPLATES)), new Set(kinds));
});

test('normalized telemetry template remains aligned with the current importer contract', () => {
  assert.deepEqual(getPilotCsvTemplateColumns('TELEMETRY_EXPORT'), [
    'timestamp',
    'assetId',
    'signalKey',
    'value',
    'unit',
    'sourceSystem',
    'quality',
  ]);
});

test('rendered templates contain headers only and no fabricated project records', () => {
  for (const kind of Object.keys(PILOT_CSV_DATA_EXCHANGE_TEMPLATES) as Array<keyof typeof PILOT_CSV_DATA_EXCHANGE_TEMPLATES>) {
    const csv = renderPilotCsvTemplate(kind);
    assert.equal(csv.split(/\r?\n/).filter(Boolean).length, 1);
    assert.doesNotMatch(csv, /Diego de Almagro|SolBank|SMA|synthetic|PROJECT-1/i);
  }
});

test('missing mandatory columns block a template header', () => {
  const assessment = assessPilotCsvHeader('TELEMETRY_EXPORT', 'timestamp,assetId,value');
  assert.equal(assessment.status, 'BLOCKED');
  assert.ok(assessment.missingRequiredColumns.includes('signalKey'));
  assert.ok(assessment.missingRequiredColumns.includes('quality'));
});

test('additional source columns are retained for review without silently blocking admission', () => {
  const assessment = assessPilotCsvHeader(
    'EVENT_EXPORT',
    'timestamp,sourceSystem,assetId,eventCode,vendorSpecificState',
  );
  assert.equal(assessment.status, 'READY_FOR_REVIEW');
  assert.deepEqual(assessment.unexpectedColumns, ['vendorSpecificState']);
  assert.ok(assessment.warnings.some((warning) => /must not be interpreted silently/.test(warning)));
});

test('duplicate headers block deterministic exchange parsing', () => {
  const assessment = assessPilotCsvHeader(
    'PROJECT_IDENTITY',
    'projectId,officialProjectName,sourceDocument,projectId',
  );
  assert.equal(assessment.status, 'BLOCKED');
  assert.deepEqual(assessment.duplicateColumns, ['projectId']);
});

test('source-verification templates carry explicit provenance fields', () => {
  const assetColumns = getPilotCsvTemplateColumns('ASSET_REGISTER');
  const mappingColumns = getPilotCsvTemplateColumns('SIGNAL_MAPPING');
  const evidenceColumns = getPilotCsvTemplateColumns('EVIDENCE_PACKAGE_INDEX');
  const authorityColumns = getPilotCsvTemplateColumns('AUTHORITY_REGISTER');

  assert.ok(assetColumns.includes('sourceDocument'));
  assert.ok(assetColumns.includes('verificationStatus'));
  assert.ok(mappingColumns.includes('sourceDocument'));
  assert.ok(mappingColumns.includes('verificationStatus'));
  assert.ok(evidenceColumns.includes('verificationStatus'));
  assert.ok(authorityColumns.includes('sourceDocument'));
  assert.ok(authorityColumns.includes('verificationStatus'));
});
