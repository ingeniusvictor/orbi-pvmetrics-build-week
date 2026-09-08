import type { DataQuality, SampleQuality, TelemetrySample } from '../contracts';

export type DataQualityIssueCode =
  | 'NO_SAMPLES'
  | 'MISSING_VALUE'
  | 'INVALID_SAMPLE'
  | 'SUSPECT_SAMPLE'
  | 'DUPLICATE_SAMPLE'
  | 'FROZEN_SIGNAL'
  | 'LOW_COVERAGE';

export type DataQualityIssue = {
  code: DataQualityIssueCode;
  severity: 'WARNING' | 'ERROR';
  assetId?: string;
  signalKey?: string;
  timestamp?: string;
  message: string;
};

export type DataQualitySummary = {
  quality: DataQuality;
  totalSamples: number;
  goodSamples: number;
  suspectSamples: number;
  missingSamples: number;
  invalidSamples: number;
  duplicateSamples: number;
  frozenSignalKeys: string[];
  coveragePercent: number;
  issues: DataQualityIssue[];
};

export type DataQualityOptions = {
  expectedSamples?: number;
  frozenRunLength?: number;
};

const qualityRank: Record<SampleQuality, number> = {
  GOOD: 0,
  SUSPECT: 1,
  MISSING: 2,
  INVALID: 3,
};

const classify = (summary: Omit<DataQualitySummary, 'quality'>): DataQuality => {
  if (summary.totalSamples === 0 || summary.invalidSamples > 0 || summary.coveragePercent < 50) return 'INVALID';
  if (summary.missingSamples > 0 || summary.coveragePercent < 80) return 'POOR';
  if (summary.suspectSamples > 0 || summary.duplicateSamples > 0 || summary.frozenSignalKeys.length > 0 || summary.coveragePercent < 95) return 'DEGRADED';
  return 'GOOD';
};

export const evaluateDataQuality = (
  samples: readonly TelemetrySample[],
  options: DataQualityOptions = {},
): DataQualitySummary => {
  const issues: DataQualityIssue[] = [];
  const expectedSamples = options.expectedSamples ?? samples.length;
  const frozenRunLength = Math.max(3, options.frozenRunLength ?? 4);

  if (samples.length === 0) {
    issues.push({ code: 'NO_SAMPLES', severity: 'ERROR', message: 'No telemetry samples were supplied.' });
  }

  let goodSamples = 0;
  let suspectSamples = 0;
  let missingSamples = 0;
  let invalidSamples = 0;
  const seen = new Set<string>();
  let duplicateSamples = 0;
  const grouped = new Map<string, TelemetrySample[]>();

  for (const sample of samples) {
    if (sample.quality === 'GOOD') goodSamples += 1;
    else if (sample.quality === 'SUSPECT') {
      suspectSamples += 1;
      issues.push({ code: 'SUSPECT_SAMPLE', severity: 'WARNING', assetId: sample.assetId, signalKey: sample.signalKey, timestamp: sample.timestamp, message: 'Sample is marked SUSPECT.' });
    } else if (sample.quality === 'MISSING' || sample.value === null) {
      missingSamples += 1;
      issues.push({ code: 'MISSING_VALUE', severity: 'ERROR', assetId: sample.assetId, signalKey: sample.signalKey, timestamp: sample.timestamp, message: 'Sample value is missing.' });
    } else {
      invalidSamples += 1;
      issues.push({ code: 'INVALID_SAMPLE', severity: 'ERROR', assetId: sample.assetId, signalKey: sample.signalKey, timestamp: sample.timestamp, message: 'Sample is marked INVALID.' });
    }

    const key = `${sample.timestamp}|${sample.assetId}|${sample.signalKey}`;
    if (seen.has(key)) {
      duplicateSamples += 1;
      issues.push({ code: 'DUPLICATE_SAMPLE', severity: 'WARNING', assetId: sample.assetId, signalKey: sample.signalKey, timestamp: sample.timestamp, message: 'Duplicate timestamp/asset/signal sample detected.' });
    }
    seen.add(key);

    const groupKey = `${sample.assetId}|${sample.signalKey}`;
    const list = grouped.get(groupKey) ?? [];
    list.push(sample);
    grouped.set(groupKey, list);
  }

  const frozenSignalKeys: string[] = [];
  for (const [groupKey, list] of grouped) {
    const ordered = [...list].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    let run = 1;
    let frozen = false;
    for (let i = 1; i < ordered.length; i += 1) {
      const prev = ordered[i - 1];
      const current = ordered[i];
      if (qualityRank[prev.quality] <= 1 && qualityRank[current.quality] <= 1 && current.value === prev.value && current.value !== null) run += 1;
      else run = 1;
      if (run >= frozenRunLength) frozen = true;
    }
    if (frozen) {
      frozenSignalKeys.push(groupKey);
      const [assetId, signalKey] = groupKey.split('|');
      issues.push({ code: 'FROZEN_SIGNAL', severity: 'WARNING', assetId, signalKey, message: `Signal remained unchanged for at least ${frozenRunLength} consecutive samples.` });
    }
  }

  const coveragePercent = expectedSamples <= 0 ? 100 : Math.min(100, (samples.length / expectedSamples) * 100);
  if (coveragePercent < 95) issues.push({ code: 'LOW_COVERAGE', severity: coveragePercent < 80 ? 'ERROR' : 'WARNING', message: `Telemetry coverage is ${coveragePercent.toFixed(1)}%.` });

  const base = {
    totalSamples: samples.length,
    goodSamples,
    suspectSamples,
    missingSamples,
    invalidSamples,
    duplicateSamples,
    frozenSignalKeys: frozenSignalKeys.sort(),
    coveragePercent,
    issues,
  };

  return { quality: classify(base), ...base };
};
