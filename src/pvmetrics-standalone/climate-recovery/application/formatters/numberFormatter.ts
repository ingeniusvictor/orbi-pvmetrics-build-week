import type { DataOrigin, DatasetReality } from '../../types/taxonomy';
import type { ClimateRecoveryLocale } from '../contracts/queryContracts';
import type { PresentationValue } from '../contracts/presentationModels';

export type NumberFormatOptions = {
  locale: ClimateRecoveryLocale;
  precision: number;
  compactThreshold?: number;
  unit?: string;
  origin?: DataOrigin;
  datasetReality?: DatasetReality;
  isEstimate?: boolean;
  isProjection?: boolean;
  disclosure?: string;
  limitations?: string[];
};

const localeTag = (locale: ClimateRecoveryLocale) => locale === 'es' ? 'es-CL' : 'en-US';

export const unavailableNumber = (
  formattedValue: string,
  options: NumberFormatOptions,
  availability: 'unavailable' | 'blocked' | 'not-applicable' = 'unavailable',
): PresentationValue<number> => ({
  formattedValue,
  unit: options.unit,
  availability,
  origin: options.origin ?? 'derived',
  datasetReality: options.datasetReality ?? 'synthetic',
  isEstimate: options.isEstimate ?? false,
  isProjection: options.isProjection ?? false,
  isSynthetic: (options.datasetReality ?? 'synthetic') === 'synthetic',
  disclosure: options.disclosure ?? ((options.datasetReality ?? 'synthetic') === 'synthetic'
    ? 'Synthetic presentation value; not operational data.'
    : undefined),
  limitations: [...(options.limitations ?? [])],
});

export const formatNumber = (
  value: number | undefined,
  options: NumberFormatOptions,
): PresentationValue<number> => {
  if (value === undefined || !Number.isFinite(value)) {
    return unavailableNumber(
      options.locale === 'es' ? 'No disponible' : 'Unavailable',
      { ...options, limitations: [...(options.limitations ?? []), 'A finite numeric value was not available.'] },
    );
  }
  const compact = options.compactThreshold !== undefined && Math.abs(value) >= options.compactThreshold;
  const formattedNumber = new Intl.NumberFormat(localeTag(options.locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: options.precision,
    notation: compact ? 'compact' : 'standard',
    useGrouping: true,
  }).format(value);
  return {
    value,
    formattedValue: options.unit ? `${formattedNumber} ${options.unit}` : formattedNumber,
    unit: options.unit,
    availability: 'available',
    origin: options.origin ?? 'derived',
    datasetReality: options.datasetReality ?? 'synthetic',
    isEstimate: options.isEstimate ?? false,
    isProjection: options.isProjection ?? false,
    isSynthetic: (options.datasetReality ?? 'synthetic') === 'synthetic',
    disclosure: options.disclosure ?? ((options.datasetReality ?? 'synthetic') === 'synthetic'
      ? 'Synthetic presentation value; not operational data.'
      : undefined),
    limitations: [...(options.limitations ?? [])],
  };
};
