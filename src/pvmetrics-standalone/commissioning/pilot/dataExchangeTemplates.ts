import type { PilotArtifactKind } from './pilotReadiness';

export type CsvExchangeTemplate = {
  kind: PilotArtifactKind;
  fileName: string;
  label: string;
  requiredColumns: readonly string[];
  optionalColumns: readonly string[];
};

export type CsvHeaderAssessment = {
  status: 'BLOCKED' | 'READY_FOR_REVIEW';
  missingRequiredColumns: string[];
  duplicateColumns: string[];
  unexpectedColumns: string[];
  warnings: string[];
};

const template = (
  kind: PilotArtifactKind,
  fileName: string,
  label: string,
  requiredColumns: readonly string[],
  optionalColumns: readonly string[] = [],
): CsvExchangeTemplate => ({ kind, fileName, label, requiredColumns, optionalColumns });

export const PILOT_CSV_DATA_EXCHANGE_TEMPLATES: Readonly<Record<PilotArtifactKind, CsvExchangeTemplate>> = {
  PROJECT_IDENTITY: template(
    'PROJECT_IDENTITY',
    'project_identity.csv',
    'Project identity',
    ['projectId', 'officialProjectName', 'sourceDocument'],
    ['siteName', 'clientOwner', 'epcIntegrator', 'bessOem', 'pcsOem', 'country', 'region', 'ratedPowerMw', 'ratedEnergyMwh', 'sourceRevision', 'sourceDate', 'notes'],
  ),
  SCOPE_REGISTER: template(
    'SCOPE_REGISTER',
    'scope_register.csv',
    'Commissioning scope register',
    ['scopeRevision', 'scopeItemId', 'assetOrSystemRef', 'scopeStatus', 'sourceDocument'],
    ['responsibleParty', 'sourceRevision', 'sourceSection', 'notes'],
  ),
  ASSET_REGISTER: template(
    'ASSET_REGISTER',
    'asset_register.csv',
    'As-built asset register',
    ['sourceAssetId', 'sourceDocument', 'verificationStatus'],
    ['parentSourceAssetId', 'assetName', 'assetType', 'manufacturer', 'model', 'serialNumber', 'sourceRevision', 'sourceSection', 'notes'],
  ),
  TEST_MATRIX: template(
    'TEST_MATRIX',
    'test_matrix.csv',
    'Commissioning test matrix',
    ['testCode', 'testName', 'procedureDocument'],
    ['applicableAssetRef', 'procedureRevision', 'procedureSection', 'requiredSignals', 'requiredEvidence', 'witnessRole', 'reviewerRole', 'approverRole', 'retestRule', 'prerequisites', 'holdPoints', 'notes'],
  ),
  CRITERIA_SOURCES: template(
    'CRITERIA_SOURCES',
    'criteria_sources.csv',
    'Acceptance criteria source register',
    ['criterionId', 'testCode', 'criterionName', 'sourceDocument', 'status'],
    ['operator', 'expectedValue', 'expectedUnit', 'sourceRevision', 'sourceSection', 'authorityPriority', 'notes'],
  ),
  SIGNAL_DICTIONARY: template(
    'SIGNAL_DICTIONARY',
    'signal_dictionary.csv',
    'Source signal dictionary',
    ['sourceSystem', 'sourceSignal'],
    ['description', 'unit', 'dataType', 'sourceAssetId', 'scale', 'offset', 'signConvention', 'qualitySemantics', 'sampleRate', 'sourceDocument', 'sourceRevision', 'notes'],
  ),
  SIGNAL_MAPPING: template(
    'SIGNAL_MAPPING',
    'signal_mapping.csv',
    'Source-to-ORBI signal mapping',
    ['sourceSystem', 'sourceSignal', 'sourceDocument', 'verificationStatus'],
    ['sourceAssetId', 'canonicalAssetId', 'canonicalSignalKey', 'sourceUnit', 'canonicalUnit', 'scale', 'offset', 'signMultiplier', 'sourceRevision', 'sourceSection', 'notes'],
  ),
  TELEMETRY_EXPORT: template(
    'TELEMETRY_EXPORT',
    'telemetry_normalized.csv',
    'Normalized offline telemetry',
    ['timestamp', 'assetId', 'signalKey', 'value', 'unit', 'sourceSystem', 'quality'],
  ),
  EVENT_EXPORT: template(
    'EVENT_EXPORT',
    'event_export.csv',
    'Event and alarm export',
    ['timestamp', 'sourceSystem', 'assetId', 'eventCode'],
    ['severity', 'state', 'message', 'acknowledgedAt', 'clearedAt', 'sourceFileReference', 'notes'],
  ),
  EVIDENCE_PACKAGE_INDEX: template(
    'EVIDENCE_PACKAGE_INDEX',
    'evidence_index.csv',
    'Evidence package index',
    ['evidenceId', 'evidenceType', 'fileName', 'verificationStatus'],
    ['assetId', 'testCode', 'executionReference', 'capturedAt', 'sourceDocument', 'sha256', 'witnessOrAuthor', 'notes'],
  ),
  AUTHORITY_REGISTER: template(
    'AUTHORITY_REGISTER',
    'authority_register.csv',
    'Human authority register',
    ['personOrRoleId', 'role', 'sourceDocument', 'verificationStatus'],
    ['displayName', 'organization', 'canExecute', 'canWitness', 'canReview', 'canAcceptReject', 'canApproveClosureRetest', 'canApproveHandover', 'sourceRevision', 'notes'],
  ),
};

export const getPilotCsvTemplate = (kind: PilotArtifactKind): CsvExchangeTemplate =>
  PILOT_CSV_DATA_EXCHANGE_TEMPLATES[kind];

export const getPilotCsvTemplateColumns = (kind: PilotArtifactKind): string[] => {
  const item = getPilotCsvTemplate(kind);
  return [...item.requiredColumns, ...item.optionalColumns];
};

export const renderPilotCsvTemplate = (kind: PilotArtifactKind): string =>
  `${getPilotCsvTemplateColumns(kind).join(',')}\n`;

const parseCsvHeader = (headerLine: string): string[] => {
  const firstLine = headerLine.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0]?.trim() ?? '';
  if (!firstLine) return [];
  return firstLine
    .split(',')
    .map((column) => column.trim().replace(/^"|"$/g, ''))
    .filter((column) => column.length > 0);
};

export const assessPilotCsvHeader = (
  kind: PilotArtifactKind,
  headerLine: string,
): CsvHeaderAssessment => {
  const item = getPilotCsvTemplate(kind);
  const columns = parseCsvHeader(headerLine);
  const seen = new Set<string>();
  const duplicateColumns = columns.filter((column) => {
    if (seen.has(column)) return true;
    seen.add(column);
    return false;
  });
  const missingRequiredColumns = item.requiredColumns.filter((column) => !seen.has(column));
  const allowed = new Set([...item.requiredColumns, ...item.optionalColumns]);
  const unexpectedColumns = columns.filter((column) => !allowed.has(column));
  const warnings: string[] = [];

  if (columns.length === 0) warnings.push('CSV header is empty.');
  if (unexpectedColumns.length > 0) {
    warnings.push('Additional source columns are allowed but must not be interpreted silently.');
  }

  return {
    status: missingRequiredColumns.length === 0 && duplicateColumns.length === 0 ? 'READY_FOR_REVIEW' : 'BLOCKED',
    missingRequiredColumns,
    duplicateColumns: [...new Set(duplicateColumns)],
    unexpectedColumns,
    warnings,
  };
};
