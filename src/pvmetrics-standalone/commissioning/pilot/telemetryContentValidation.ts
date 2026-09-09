export type TelemetryContentStatus = 'BLOCKED' | 'READY_FOR_REVIEW';

export type TelemetryIssueCode =
  | 'CSV_UNTERMINATED_QUOTE'
  | 'EMPTY_DATASET'
  | 'MISSING_REQUIRED_COLUMN'
  | 'ROW_WIDTH_MISMATCH'
  | 'INVALID_TIMESTAMP'
  | 'EMPTY_ASSET_ID'
  | 'EMPTY_SIGNAL_KEY'
  | 'NON_NUMERIC_VALUE'
  | 'MISSING_UNIT'
  | 'EMPTY_SOURCE_SYSTEM'
  | 'INVALID_QUALITY'
  | 'DUPLICATE_ROW'
  | 'CONFLICTING_SAMPLE'
  | 'INCONSISTENT_UNIT';

export type TelemetryContentIssue = {
  code: TelemetryIssueCode;
  rowNumber?: number;
  message: string;
};

export type TelemetryContentAssessment = {
  status: TelemetryContentStatus;
  dataRowCount: number;
  issues: TelemetryContentIssue[];
  issueCounts: Partial<Record<TelemetryIssueCode, number>>;
  warnings: string[];
};

const REQUIRED_COLUMNS = [
  'timestamp',
  'assetId',
  'signalKey',
  'value',
  'unit',
  'sourceSystem',
  'quality',
] as const;

const ALLOWED_QUALITY = new Set(['GOOD', 'SUSPECT', 'MISSING', 'INVALID']);
const MAX_REPORTED_ISSUES = 50;

const parseCsvRows = (input: string): { rows: string[][]; unterminatedQuote: boolean } => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };

  const pushRow = () => {
    pushField();
    if (row.some((value) => value.trim().length > 0)) rows.push(row);
    row = [];
  };

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (char === '"') {
      if (inQuotes && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushField();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && input[index + 1] === '\n') index += 1;
      pushRow();
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) pushRow();

  if (rows.length > 0 && rows[0][0]) rows[0][0] = rows[0][0].replace(/^\uFEFF/, '');

  return { rows, unterminatedQuote: inQuotes };
};

const normalizedNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const numeric = Number(trimmed);
  return Number.isFinite(numeric) ? numeric : null;
};

export const assessTelemetryCsvContent = (csvText: string): TelemetryContentAssessment => {
  const issues: TelemetryContentIssue[] = [];
  const issueCounts: Partial<Record<TelemetryIssueCode, number>> = {};
  const warnings: string[] = [];

  const addIssue = (issue: TelemetryContentIssue) => {
    issueCounts[issue.code] = (issueCounts[issue.code] ?? 0) + 1;
    if (issues.length < MAX_REPORTED_ISSUES) issues.push(issue);
  };

  const parsed = parseCsvRows(csvText);
  if (parsed.unterminatedQuote) {
    addIssue({ code: 'CSV_UNTERMINATED_QUOTE', message: 'CSV contains an unterminated quoted field.' });
  }

  if (parsed.rows.length === 0) {
    addIssue({ code: 'EMPTY_DATASET', message: 'Telemetry CSV has no header or data rows.' });
    return { status: 'BLOCKED', dataRowCount: 0, issues, issueCounts, warnings };
  }

  const header = parsed.rows[0].map((column) => column.trim());
  const indexByColumn = new Map(header.map((column, index) => [column, index]));

  for (const column of REQUIRED_COLUMNS) {
    if (!indexByColumn.has(column)) {
      addIssue({ code: 'MISSING_REQUIRED_COLUMN', message: `Telemetry CSV is missing required column: ${column}.` });
    }
  }

  const dataRows = parsed.rows.slice(1);
  if (dataRows.length === 0) {
    addIssue({ code: 'EMPTY_DATASET', message: 'Telemetry CSV contains headers only; at least one data row is required for content admission.' });
  }

  if ((issueCounts.MISSING_REQUIRED_COLUMN ?? 0) > 0) {
    return { status: 'BLOCKED', dataRowCount: dataRows.length, issues, issueCounts, warnings };
  }

  const exactRows = new Set<string>();
  const samplePayloadByKey = new Map<string, string>();
  const unitBySeries = new Map<string, string>();
  const lastTimestampBySeries = new Map<string, number>();
  let outOfOrderCount = 0;

  const read = (row: string[], column: string): string => row[indexByColumn.get(column)!]?.trim() ?? '';

  dataRows.forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 2;
    if (row.length !== header.length) {
      addIssue({
        code: 'ROW_WIDTH_MISMATCH',
        rowNumber,
        message: `Row ${rowNumber} has ${row.length} columns; expected ${header.length}.`,
      });
    }

    const timestamp = read(row, 'timestamp');
    const assetId = read(row, 'assetId');
    const signalKey = read(row, 'signalKey');
    const valueText = read(row, 'value');
    const unit = read(row, 'unit');
    const sourceSystem = read(row, 'sourceSystem');
    const quality = read(row, 'quality').toUpperCase();

    const timestampMs = Date.parse(timestamp);
    if (!timestamp || Number.isNaN(timestampMs)) {
      addIssue({ code: 'INVALID_TIMESTAMP', rowNumber, message: `Row ${rowNumber} has an invalid timestamp.` });
    }
    if (!assetId) addIssue({ code: 'EMPTY_ASSET_ID', rowNumber, message: `Row ${rowNumber} has an empty assetId.` });
    if (!signalKey) addIssue({ code: 'EMPTY_SIGNAL_KEY', rowNumber, message: `Row ${rowNumber} has an empty signalKey.` });
    if (normalizedNumber(valueText) === null) {
      addIssue({ code: 'NON_NUMERIC_VALUE', rowNumber, message: `Row ${rowNumber} has a missing or non-numeric value.` });
    }
    if (!unit) addIssue({ code: 'MISSING_UNIT', rowNumber, message: `Row ${rowNumber} has a missing unit.` });
    if (!sourceSystem) addIssue({ code: 'EMPTY_SOURCE_SYSTEM', rowNumber, message: `Row ${rowNumber} has an empty sourceSystem.` });
    if (!ALLOWED_QUALITY.has(quality)) {
      addIssue({
        code: 'INVALID_QUALITY',
        rowNumber,
        message: `Row ${rowNumber} quality must be one of GOOD, SUSPECT, MISSING or INVALID.`,
      });
    }

    const exactKey = row.map((value) => value.trim()).join('\u001f');
    if (exactRows.has(exactKey)) {
      addIssue({ code: 'DUPLICATE_ROW', rowNumber, message: `Row ${rowNumber} duplicates an earlier telemetry row exactly.` });
    } else {
      exactRows.add(exactKey);
    }

    if (timestamp && assetId && signalKey && sourceSystem) {
      const sampleKey = `${timestamp}\u001f${assetId}\u001f${signalKey}\u001f${sourceSystem}`;
      const payload = `${valueText}\u001f${unit}\u001f${quality}`;
      const previousPayload = samplePayloadByKey.get(sampleKey);
      if (previousPayload !== undefined && previousPayload !== payload) {
        addIssue({
          code: 'CONFLICTING_SAMPLE',
          rowNumber,
          message: `Row ${rowNumber} conflicts with an earlier sample for the same timestamp, asset, signal and source system.`,
        });
      } else if (previousPayload === undefined) {
        samplePayloadByKey.set(sampleKey, payload);
      }

      const seriesKey = `${assetId}\u001f${signalKey}\u001f${sourceSystem}`;
      const previousUnit = unitBySeries.get(seriesKey);
      if (unit && previousUnit && previousUnit !== unit) {
        addIssue({
          code: 'INCONSISTENT_UNIT',
          rowNumber,
          message: `Row ${rowNumber} changes unit from ${previousUnit} to ${unit} for the same asset/signal/source series.`,
        });
      } else if (unit && !previousUnit) {
        unitBySeries.set(seriesKey, unit);
      }

      if (!Number.isNaN(timestampMs)) {
        const previousTimestamp = lastTimestampBySeries.get(seriesKey);
        if (previousTimestamp !== undefined && timestampMs < previousTimestamp) outOfOrderCount += 1;
        lastTimestampBySeries.set(seriesKey, timestampMs);
      }
    }
  });

  if (outOfOrderCount > 0) {
    warnings.push(`${outOfOrderCount} telemetry row(s) are out of chronological order within their asset/signal/source series; rows are not auto-sorted.`);
  }
  if (issues.length >= MAX_REPORTED_ISSUES) {
    warnings.push(`Only the first ${MAX_REPORTED_ISSUES} content issues are displayed; issueCounts preserves the total count by type.`);
  }

  return {
    status: Object.values(issueCounts).some((count) => (count ?? 0) > 0) ? 'BLOCKED' : 'READY_FOR_REVIEW',
    dataRowCount: dataRows.length,
    issues,
    issueCounts,
    warnings,
  };
};
