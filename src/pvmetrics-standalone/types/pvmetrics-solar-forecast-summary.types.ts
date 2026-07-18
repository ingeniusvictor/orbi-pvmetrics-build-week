import { PVMetricsSolarForecastMockSeries } from './pvmetrics-solar-forecast-mock.types';

export type PVMetricsSolarForecastRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsSolarForecastRiskCategory =
  | 'weather'
  | 'availability'
  | 'soiling'
  | 'bess'
  | 'confidence'
  | 'regulatory'
  | 'data-quality';

export type PVMetricsSolarForecastRisk = {
  id: string;
  category: PVMetricsSolarForecastRiskCategory;
  level: PVMetricsSolarForecastRiskLevel;
  label: string;
  description: string;
  recommendedAction: string;
};

export type PVMetricsSolarForecastKpiSummary = {
  totalForecastEnergyMwh: number;
  peakForecastPowerMw: number;
  averageConfidencePct: number;
  lowestConfidencePct: number;
  estimatedWeatherLossPct: number;
  estimatedAvailabilityLossPct: number;
  estimatedSoilingLossPct: number;
  estimatedBessInfluencePct: number;
  forecastReadinessPct: number;
};

export type PVMetricsSolarForecastSummary = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  horizonLabel: string;

  kpis: PVMetricsSolarForecastKpiSummary;
  riskLevel: PVMetricsSolarForecastRiskLevel;
  risks: PVMetricsSolarForecastRisk[];

  executiveSummary: string;
  technicalExplanation: string;
  omRecommendations: string[];
  regulatoryNotes: string[];

  internalForecastText: string;
  clientForecastText: string;
  safetyBoundary: string;

  sourceSeries: PVMetricsSolarForecastMockSeries;
};
