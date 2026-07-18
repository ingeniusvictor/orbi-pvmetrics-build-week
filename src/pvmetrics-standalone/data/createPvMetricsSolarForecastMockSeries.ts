import {
  PVMetricsSolarForecastHorizon,
} from '../types/pvmetrics-solar-forecast-blueprint.types';
import {
  PVMetricsSolarForecastMockPoint,
  PVMetricsSolarForecastMockSeries,
  PVMetricsSolarForecastMockWeatherCondition,
} from '../types/pvmetrics-solar-forecast-mock.types';

type CreatePvMetricsSolarForecastMockSeriesInput = {
  plantName?: string;
  plantCode?: string;
  installedCapacityMwac?: number;
  horizon?: PVMetricsSolarForecastHorizon;
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const horizonLabel: Record<PVMetricsSolarForecastHorizon, string> = {
  'same-day': 'Forecast intradía',
  'day-ahead': 'Forecast día siguiente',
  'week-ahead': 'Forecast semanal demo',
  'month-outlook': 'Outlook mensual conceptual',
  'regulatory-window': 'Ventana regulatoria conceptual',
};

const getSolarShape = (hour: number) => {
  if (hour < 6 || hour > 20) return 0;
  const normalized = (hour - 6) / 14;
  return Math.sin(Math.PI * normalized);
};

const getCondition = (hour: number): PVMetricsSolarForecastMockWeatherCondition => {
  if (hour >= 11 && hour <= 14) return 'partly-cloudy';
  if (hour === 15 || hour === 16) return 'cloudy';
  if (hour >= 17) return 'unstable';
  if (hour >= 12 && hour <= 15) return 'high-temperature';
  return 'clear';
};

const getWeatherFactorPct = (
  condition: PVMetricsSolarForecastMockWeatherCondition,
) => {
  const values: Record<PVMetricsSolarForecastMockWeatherCondition, number> = {
    clear: 98,
    'partly-cloudy': 86,
    cloudy: 72,
    'high-temperature': 90,
    unstable: 78,
  };

  return values[condition];
};

const round = (value: number) => Number(value.toFixed(2));

export const createPvMetricsSolarForecastMockSeries = ({
  plantName = 'ORBI Solar Demo Plant',
  plantCode = 'AES-DEMO-FV',
  installedCapacityMwac = 9,
  horizon = 'day-ahead',
}: CreatePvMetricsSolarForecastMockSeriesInput = {}): PVMetricsSolarForecastMockSeries => {
  const points: PVMetricsSolarForecastMockPoint[] = Array.from(
    { length: 24 },
    (_, hour) => {
      const shape = getSolarShape(hour);
      const condition = getCondition(hour);
      const weatherFactorPct = getWeatherFactorPct(condition);
      const availabilityFactorPct = hour >= 10 && hour <= 13 ? 96 : 99;
      const soilingFactorPct = 97;
      const bessInfluencePct = horizon === 'regulatory-window' ? 2 : 0;

      const rawPower =
        installedCapacityMwac *
        shape *
        (weatherFactorPct / 100) *
        (availabilityFactorPct / 100) *
        (soilingFactorPct / 100);

      const expectedPowerMw = round(Math.max(0, rawPower));
      const confidencePct = Math.max(
        55,
        Math.min(96, weatherFactorPct - (condition === 'unstable' ? 12 : 0)),
      );

      const bandSpread = expectedPowerMw * ((100 - confidencePct) / 100);

      return {
        hourLabel: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        expectedPowerMw,
        lowerBandMw: round(Math.max(0, expectedPowerMw - bandSpread)),
        upperBandMw: round(expectedPowerMw + bandSpread),
        expectedEnergyMwh: expectedPowerMw,
        weatherFactorPct,
        availabilityFactorPct,
        soilingFactorPct,
        bessInfluencePct,
        confidencePct,
        condition,
      };
    },
  );

  const totalForecastEnergyMwh = round(
    points.reduce((sum, point) => sum + point.expectedEnergyMwh, 0),
  );

  const peakForecastPowerMw = round(
    Math.max(...points.map((point) => point.expectedPowerMw)),
  );

  const averageConfidencePct = round(
    points.reduce((sum, point) => sum + point.confidencePct, 0) / points.length,
  );

  return {
    id: `solar-forecast-mock-${plantCode}-${horizon}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName,
    plantCode,
    horizon,
    horizonLabel: horizonLabel[horizon],
    installedCapacityMwac,
    totalForecastEnergyMwh,
    peakForecastPowerMw,
    averageConfidencePct,
    points,
    safetyBoundary:
      'Este forecast es mock, local y conceptual. No usa APIs meteorológicas reales, no conecta SCADA, no lee medidores reales, no envía pronósticos al CEN, no controla BESS, no controla inversores y no modifica setpoints.',
  };
};
