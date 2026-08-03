import type { NumberFormatOptions } from './numberFormatter';
import { formatNumber } from './numberFormatter';

export const formatPercentage = (
  normalizedValue: number | undefined,
  options: Omit<NumberFormatOptions, 'unit'>,
) => formatNumber(
  normalizedValue === undefined || !Number.isFinite(normalizedValue)
    ? undefined
    : normalizedValue * 100,
  { ...options, unit: '%' },
);
