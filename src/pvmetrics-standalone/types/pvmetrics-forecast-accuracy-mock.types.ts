import {
  PVMetricsForecastAccuracyLevel,
  PVMetricsForecastErrorCategory,
} from './pvmetrics-forecast-accuracy-blueprint.types';
import { PVMetricsOperationalEventMockAssessment } from './pvmetrics-operational-event-mock.types';
import { PVMetricsSolarForecastMockSeries } from './pvmetrics-solar-forecast-mock.types';

export type PVMetricsForecastAccuracyMockPoint = {
  hourLabel: string;
  forecastPowerMw: number;
  observedPowerMw: number;
  lowerBandMw: number;
  upperBandMw: number;
  absoluteErrorMw: number;
  squaredErrorMw: number;
  percentageErrorPct: number;
  biasMw: number;
  insideConfidenceBand: boolean;
  errorCategory: PVMetricsForecastErrorCategory;
  explainedByEvent: boolean;
  explanation: string;
};

export type PVMetricsForecastAccuracyRootCauseItem = {
  category: PVMetricsForecastErrorCategory;
  label: string;
  pointsAffected: number;
  estimatedErrorMw: number;
  estimatedErrorMwh: number;
  contributionPct: number;
  explanation: string;
};

export type PVMetricsForecastAccuracyKpis = {
  maeMw: number;
  rmseMw: number;
  mapePct: number;
  biasMw: number;
  nmaePct: number;
  confidenceHitRatePct: number;
  eventExplainedErrorPct: number;
};

export type PVMetricsForecastAccuracyMockAssessment = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  horizonLabel: string;

  accuracyLevel: PVMetricsForecastAccuracyLevel;
  accuracyLevelLabel: string;
  dominantErrorCategory: PVMetricsForecastErrorCategory;
  dominantErrorLabel: string;

  kpis: PVMetricsForecastAccuracyKpis;
  points: PVMetricsForecastAccuracyMockPoint[];
  rootCauseBreakdown: PVMetricsForecastAccuracyRootCauseItem[];

  interpretationNotes: string[];
  omRecommendations: string[];
  dataQualityWarnings: string[];

  internalAccuracyText: string;
  clientAccuracyText: string;
  safetyBoundary: string;

  sourceForecastSeries: PVMetricsSolarForecastMockSeries;
  sourceOperationalEventsAssessment?: PVMetricsOperationalEventMockAssessment;
};
