import type { CommissioningDataset, SampleQuality, TelemetrySample } from '../contracts';

export type TelemetryCsvImportOptions = {
  datasetId: string;
  projectId: string;
  scopeId: string;
  campaignId?: string;
  executionId?: string;
  sourceName: string;
  actor: string;
  importedAt: string;
};

export type TelemetryCsvImportResult = {
  dataset: CommissioningDataset;
  samples: TelemetrySample[];
};

const REQUIRED_HEADERS = [
  'timestamp',
  'assetId',
  'signalKey',
  'value',
  'unit',
  'sourceSystem',
  'quality',
] as const;

const VALID_QUALITIES: SampleQuality[] = ['GOOD', 'SUSPECT', 'MISSING', 'INVALID'];

const parseCsvLine = (line: string): string[] => {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      cells.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }

  if (quoted) throw new Error('Unclosed quoted field.');
  cells.push(current.trim());
  return cells;
};

const parseValue = (raw: string): number | string | boolean | null => {
  if (raw === '') return null;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : raw;
};

const isIsoLikeDate = (value: string): boolean => {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp);
};

const createDataset = (
  options: TelemetryCsvImportOptions,
  overrides: Partial<CommissioningDataset>,
): CommissioningDataset => ({
  datasetId: options.datasetId,
  projectId: options.projectId,
  scopeId: options.scopeId,
  campaignId: options.campaignId,
  executionId: options.executionId,
  sourceType: 'FILE_IMPORT',
  sourceName: options.sourceName,
  importResult: 'REJECTED',
  dataQuality: 'INVALID',
  warnings: [],
  errors: [],
  createdAt: options.importedAt,
  createdBy: options.actor,
  updatedAt: options.importedAt,
  updatedBy: options.actor,
  ...overrides,
});

export const importTelemetryCsv = (
  csvText: string,
  options: TelemetryCsvImportOptions,
): TelemetryCsvImportResult => {
  const normalized = csvText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return {
      dataset: createDataset(options, { errors: ['CSV file is empty.'] }),
      samples: [],
    };
  }

  let headers: string[];
  try {
    headers = parseCsvLine(lines[0]);
  } catch (error) {
    return {
      dataset: createDataset(options, { errors: [`Invalid CSV header: ${(error as Error).message}`] }),
      samples: [],
    };
  }

  const missingHeaders = REQUIRED_HEADERS.filter((required) => !headers.includes(required));
  if (missingHeaders.length > 0) {
    return {
      dataset: createDataset(options, {
        errors: [`Missing required headers: ${missingHeaders.join(', ')}.`],
      }),
      samples: [],
    };
  }

  const columnIndex = new Map(headers.map((header, index) => [header, index]));
  const samples: TelemetrySample[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  let duplicateSamples = 0;
  let invalidSamples = 0;
  let missingSamples = 0;

  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    let cells: string[];
    try {
      cells = parseCsvLine(lines[lineIndex]);
    } catch (error) {
      invalidSamples += 1;
      errors.push(`Line ${lineIndex + 1}: ${(error as Error).message}`);
      continue;
    }

    const get = (header: typeof REQUIRED_HEADERS[number]): string =>
      cells[columnIndex.get(header) ?? -1] ?? '';

    const timestamp = get('timestamp');
    const assetId = get('assetId');
    const signalKey = get('signalKey');
    const unit = get('unit');
    const sourceSystem = get('sourceSystem');
    const rawQuality = get('quality') as SampleQuality;
    const rawValue = get('value');

    if (!timestamp || !assetId || !signalKey || !sourceSystem || !isIsoLikeDate(timestamp)) {
      invalidSamples += 1;
      errors.push(`Line ${lineIndex + 1}: required identity fields or timestamp are invalid.`);
      continue;
    }

    if (!VALID_QUALITIES.includes(rawQuality)) {
      invalidSamples += 1;
      errors.push(`Line ${lineIndex + 1}: unsupported quality '${rawQuality}'.`);
      continue;
    }

    const identity = `${timestamp}|${assetId}|${signalKey}`;
    if (seen.has(identity)) {
      duplicateSamples += 1;
      warnings.push(`Line ${lineIndex + 1}: duplicate sample ${identity}.`);
      continue;
    }
    seen.add(identity);

    if (rawQuality === 'MISSING' || rawValue === '') missingSamples += 1;

    samples.push({
      timestamp,
      assetId,
      signalKey,
      value: parseValue(rawValue),
      unit: unit || undefined,
      sourceSystem,
      quality: rawQuality,
      rawReference: `${options.sourceName}:line:${lineIndex + 1}`,
    });
  }

  const receivedSamples = Math.max(lines.length - 1, 0);
  const acceptedSamples = samples.length;
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0 || duplicateSamples > 0 || missingSamples > 0;

  return {
    dataset: createDataset(options, {
      importResult: acceptedSamples === 0 && hasErrors
        ? 'REJECTED'
        : hasErrors || hasWarnings
          ? 'ACCEPTED_WITH_WARNINGS'
          : 'ACCEPTED',
      dataQuality: acceptedSamples === 0
        ? 'INVALID'
        : hasErrors
          ? 'POOR'
          : hasWarnings
            ? 'DEGRADED'
            : 'GOOD',
      receivedSamples,
      missingSamples,
      duplicateSamples,
      invalidSamples,
      warnings,
      errors,
    }),
    samples,
  };
};
