import type { SignalMapping, TelemetrySample } from '../contracts';

export type NormalizationIssue = {
  code:
    | 'MAPPING_NOT_FOUND'
    | 'MAPPING_NOT_CONFIRMED'
    | 'SOURCE_UNIT_MISMATCH'
    | 'UNIT_TRANSFORM_NOT_DECLARED'
    | 'NON_NUMERIC_TRANSFORM';
  severity: 'WARNING' | 'ERROR';
  sampleIndex: number;
  sourceSignal: string;
  message: string;
};

export type NormalizationResult = {
  samples: TelemetrySample[];
  issues: NormalizationIssue[];
  normalizedCount: number;
  rejectedCount: number;
};

const requiresNumericTransform = (mapping: SignalMapping): boolean =>
  mapping.scale !== undefined ||
  mapping.offset !== undefined ||
  mapping.signMultiplier !== undefined;

export const normalizeTelemetry = (
  samples: TelemetrySample[],
  mappings: SignalMapping[],
): NormalizationResult => {
  const issues: NormalizationIssue[] = [];
  const normalized: TelemetrySample[] = [];

  samples.forEach((sample, sampleIndex) => {
    const mapping = mappings.find(
      (candidate) =>
        candidate.sourceSystem === sample.sourceSystem &&
        candidate.sourceSignal === sample.signalKey,
    );

    if (!mapping) {
      issues.push({
        code: 'MAPPING_NOT_FOUND',
        severity: 'ERROR',
        sampleIndex,
        sourceSignal: sample.signalKey,
        message: `No mapping found for ${sample.sourceSystem}:${sample.signalKey}.`,
      });
      return;
    }

    if (mapping.status !== 'CONFIRMED') {
      issues.push({
        code: 'MAPPING_NOT_CONFIRMED',
        severity: 'ERROR',
        sampleIndex,
        sourceSignal: sample.signalKey,
        message: `Mapping ${mapping.signalMappingId} is ${mapping.status}; normalization requires CONFIRMED.`,
      });
      return;
    }

    if (mapping.sourceUnit && sample.unit && mapping.sourceUnit !== sample.unit) {
      issues.push({
        code: 'SOURCE_UNIT_MISMATCH',
        severity: 'ERROR',
        sampleIndex,
        sourceSignal: sample.signalKey,
        message: `Sample unit ${sample.unit} does not match declared source unit ${mapping.sourceUnit}.`,
      });
      return;
    }

    const sourceUnit = mapping.sourceUnit ?? sample.unit;
    const canonicalUnit = mapping.canonicalUnit ?? sourceUnit;
    const unitChanges = Boolean(sourceUnit && canonicalUnit && sourceUnit !== canonicalUnit);
    const hasTransform = requiresNumericTransform(mapping);

    if (unitChanges && !hasTransform) {
      issues.push({
        code: 'UNIT_TRANSFORM_NOT_DECLARED',
        severity: 'ERROR',
        sampleIndex,
        sourceSignal: sample.signalKey,
        message: `Mapping changes unit ${sourceUnit} -> ${canonicalUnit} without an explicit scale/offset/sign transform.`,
      });
      return;
    }

    let value = sample.value;
    if (hasTransform && value !== null) {
      if (typeof value !== 'number') {
        issues.push({
          code: 'NON_NUMERIC_TRANSFORM',
          severity: 'ERROR',
          sampleIndex,
          sourceSignal: sample.signalKey,
          message: `Numeric transform configured for non-numeric value on ${sample.signalKey}.`,
        });
        return;
      }

      const scale = mapping.scale ?? 1;
      const offset = mapping.offset ?? 0;
      const sign = mapping.signMultiplier ?? 1;
      value = (value * scale + offset) * sign;
    }

    normalized.push({
      ...sample,
      signalKey: mapping.canonicalSignalKey,
      unit: canonicalUnit,
      value,
    });
  });

  return {
    samples: normalized,
    issues,
    normalizedCount: normalized.length,
    rejectedCount: samples.length - normalized.length,
  };
};
