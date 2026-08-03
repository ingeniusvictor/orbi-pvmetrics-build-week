import type { NumberFormatOptions } from './numberFormatter';
import { formatNumber } from './numberFormatter';

export type EmissionsUnit = 'kgCO2e' | 'tCO2e';

export const formatEmissions = (
  valueKgCO2e: number | undefined,
  unit: EmissionsUnit,
  options: Omit<NumberFormatOptions, 'unit'>,
) => formatNumber(
  valueKgCO2e === undefined
    ? undefined
    : unit === 'tCO2e'
      ? valueKgCO2e / 1_000
      : valueKgCO2e,
  { ...options, unit },
);
