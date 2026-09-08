import type { Calculation, TelemetrySample } from '../contracts';

export type MetricDefinition = {
  metricKey: string;
  unit?: string;
  requiredSignalKeys: string[];
  calculate: (samples: readonly TelemetrySample[]) => number | string | boolean | null;
};

export type CalculateMetricsInput = {
  executionId: string;
  samples: readonly TelemetrySample[];
  definitions: readonly MetricDefinition[];
  algorithmVersion: string;
  calculatedAt: string;
};

const numericValues = (samples: readonly TelemetrySample[], signalKey: string): number[] =>
  samples
    .filter((sample) => sample.signalKey === signalKey && sample.quality !== 'INVALID' && sample.value !== null)
    .map((sample) => sample.value)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));

export const builtInCommissioningMetrics = {
  average: (signalKey: string) => (samples: readonly TelemetrySample[]) => {
    const values = numericValues(samples, signalKey);
    if (values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },
  min: (signalKey: string) => (samples: readonly TelemetrySample[]) => {
    const values = numericValues(samples, signalKey);
    return values.length ? Math.min(...values) : null;
  },
  max: (signalKey: string) => (samples: readonly TelemetrySample[]) => {
    const values = numericValues(samples, signalKey);
    return values.length ? Math.max(...values) : null;
  },
  absoluteTrackingErrorMean: (actualKey: string, referenceKey: string) => (samples: readonly TelemetrySample[]) => {
    const byTimestamp = new Map<string, Record<string, number>>();
    for (const sample of samples) {
      if (sample.quality === 'INVALID' || typeof sample.value !== 'number' || !Number.isFinite(sample.value)) continue;
      if (sample.signalKey !== actualKey && sample.signalKey !== referenceKey) continue;
      const entry = byTimestamp.get(sample.timestamp) ?? {};
      entry[sample.signalKey] = sample.value;
      byTimestamp.set(sample.timestamp, entry);
    }
    const errors = [...byTimestamp.values()]
      .filter((entry) => typeof entry[actualKey] === 'number' && typeof entry[referenceKey] === 'number')
      .map((entry) => Math.abs(entry[actualKey] - entry[referenceKey]));
    if (errors.length === 0) return null;
    return errors.reduce((sum, value) => sum + value, 0) / errors.length;
  },
  responseTimeSeconds: (commandKey: string, responseKey: string, responseThreshold: number) => (samples: readonly TelemetrySample[]) => {
    const command = samples.find((sample) => sample.signalKey === commandKey && typeof sample.value === 'number' && Math.abs(sample.value) > 0);
    if (!command) return null;
    const commandTime = Date.parse(command.timestamp);
    const response = [...samples]
      .filter((sample) => sample.signalKey === responseKey && typeof sample.value === 'number' && Math.abs(sample.value) >= responseThreshold)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .find((sample) => Date.parse(sample.timestamp) >= commandTime);
    if (!response) return null;
    return (Date.parse(response.timestamp) - commandTime) / 1000;
  },
};

export const calculateCommissioningMetrics = ({
  executionId,
  samples,
  definitions,
  algorithmVersion,
  calculatedAt,
}: CalculateMetricsInput): Calculation[] =>
  definitions.map((definition, index) => ({
    calculationId: `${executionId}:${definition.metricKey}:${index + 1}`,
    executionId,
    metricKey: definition.metricKey,
    algorithmVersion,
    inputSignalKeys: [...definition.requiredSignalKeys],
    windowStart: samples.length ? [...samples].sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0].timestamp : undefined,
    windowEnd: samples.length ? [...samples].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0].timestamp : undefined,
    resultValue: definition.calculate(samples),
    unit: definition.unit,
    calculatedAt,
    notes: [],
  }));
