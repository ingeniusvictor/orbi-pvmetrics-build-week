import type { NumberFormatOptions } from './numberFormatter';
import { formatNumber } from './numberFormatter';

export type EnergyUnit = 'Wh' | 'kWh' | 'MWh' | 'GWh';

const KWH_PER_UNIT: Record<EnergyUnit, number> = {
  Wh: 0.001,
  kWh: 1,
  MWh: 1_000,
  GWh: 1_000_000,
};

export const formatEnergy = (
  valueKwh: number | undefined,
  unit: EnergyUnit,
  options: Omit<NumberFormatOptions, 'unit'>,
) => formatNumber(
  valueKwh === undefined ? undefined : valueKwh / KWH_PER_UNIT[unit],
  { ...options, unit },
);
