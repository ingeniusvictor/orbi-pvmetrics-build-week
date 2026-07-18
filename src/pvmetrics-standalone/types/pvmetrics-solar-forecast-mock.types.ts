import { PVMetricsSolarForecastHorizon } from './pvmetrics-solar-forecast-blueprint.types';

export type PVMetricsSolarForecastMockWeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'high-temperature'
  | 'unstable';

export type PVMetricsSolarForecastMockPoint = {
  hourLabel: string;
  hour: number;
  expectedPowerMw: number;
  lowerBandMw: number;
  upperBandMw: number;
  expectedEnergyMwh: number;
  weatherFactorPct: number;
  availabilityFactorPct: number;
  soilingFactorPct: number;
  bessInfluencePct: number;
  confidencePct: number;
  condition: PVMetricsSolarForecastMockWeatherCondition;
};

export type PVMetricsSolarForecastMockSeries = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  horizon: PVMetricsSolarForecastHorizon;
  horizonLabel: string;
  installedCapacityMwac: number;
  totalForecastEnergyMwh: number;
  peakForecastPowerMw: number;
  averageConfidencePct: number;
  points: PVMetricsSolarForecastMockPoint[];
  safetyBoundary: string;
};
