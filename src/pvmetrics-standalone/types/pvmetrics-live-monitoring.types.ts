export type PVMetricsDataMode = 'demo' | 'telemetry' | 'scada-live';

export type PVMetricsScadaStatus = 'connected' | 'simulated' | 'disconnected';

export type PVMetricsBessMode = 'charging' | 'discharging' | 'standby';

export type PVMetricsKpiSnapshot = {
  energyTodayMWh: number;
  energyYesterdayMWh: number;
  prDayAvgPct: number;
  prYesterdayPct: number;
  peakPowerMw: number;
  peakPowerTime: string;
  irradianceCurrentWm2: number;
  expectedPowerCurrentMw: number;
  actualPowerCurrentMw: number;
  scadaStatus: PVMetricsScadaStatus;
  scadaQualityPct: number;
  bessMode: PVMetricsBessMode;
  bessSocPct: number;
  bessStatus: string;
  lastUpdateTime: string;
  timezone: string;
};

export type PVMetricsTimePoint = {
  time: string;
  expectedPowerMw: number;
  forecastExpectedPowerMw?: number | null;
  actualPowerMw: number | null;
  telemetryPowerMw: number | null;
  scadaPowerMw: number | null;
  irradianceWm2: number;
  prPct: number | null;
  bessSocPct: number;
  bessPowerMw: number;
  ambientTempC: number;
  moduleTempC: number;
  isFuturePoint?: boolean;
  isNightPoint?: boolean;
};

export type PVMetricsLossBreakdown = {
  temperaturePct: number;
  mismatchPct: number;
  shadingPct: number;
  soilingPct: number;
  clippingPct: number;
  availabilityPct: number;
  otherPct: number;
};

export type PVMetricsAlertLevel = 'info' | 'warning' | 'critical';

export type PVMetricsAlertEvent = {
  id: string;
  time: string;
  level: PVMetricsAlertLevel;
  message: string;
  source?: string;
};

export type PVMetricsSubsystemStatusValue =
  | 'ok'
  | 'partial'
  | 'warning'
  | 'offline';

export type PVMetricsSubsystemStatus = {
  id: string;
  name: string;
  status: PVMetricsSubsystemStatusValue;
  detail: string;
};

export type PVMetricsLiveMonitoringParameters = {
  plantCapacityMw: number;
  prWarningThresholdPct: number;
  moduleTempWarningThresholdC: number;
  telemetryVsScadaTolerancePct: number;
  bessMaxPowerMw: number;
  scadaSimulationEnabled: boolean;
  simulatedEventsEnabled: boolean;
  timezone: string;
  visualRefreshSeconds: number;
};

export type PVMetricsLiveDataProvenance =
  | 'orbi-demo-simulation'
  | 'external-environment-telemetry'
  | 'onsite-weather-station'
  | 'historical-client-file'
  | 'plant-scada-readonly'
  | 'bess-ems-readonly'
  | 'bess-meter-readonly'
  | 'not-available';

export type PVMetricsLiveDataTrustLevel =
  | 'demo'
  | 'estimated'
  | 'external-real'
  | 'onsite-real'
  | 'validated-real'
  | 'pending-validation';

export type PVMetricsLiveDataSourceBadge = {
  id: string;
  label: string;
  provenance: PVMetricsLiveDataProvenance;
  trustLevel: PVMetricsLiveDataTrustLevel;
  isReadOnly: boolean;
  sourceDescription: string;
  safetyNote: string;
};

export type PVMetricsLiveMonitoringDataset = {
  mode: PVMetricsDataMode;
  kpi: PVMetricsKpiSnapshot;
  timeSeries: PVMetricsTimePoint[];
  losses: PVMetricsLossBreakdown;
  alerts: PVMetricsAlertEvent[];
  subsystems: PVMetricsSubsystemStatus[];
  parameters: PVMetricsLiveMonitoringParameters;
  bessTelemetryReality?: PVMetricsBessTelemetryRealitySnapshot;
  dataSourceBadges?: PVMetricsLiveDataSourceBadge[];
  environmentDataMode?: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available';
  operationalDataMode?: 'demo' | 'scada-readonly' | 'not-available';
  bessDataMode?: 'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available';
};

export type PVMetricsTrendRange = 'daily' | 'weekly' | 'monthly';

export type PVMetricsTrendPoint = {
  label: string;
  expectedEnergyMWh: number;
  actualEnergyMWh: number | null;
  expectedPowerMw?: number;
  actualPowerMw?: number | null;
  irradianceAvgWm2?: number;
  prAvgPct: number | null;
  lossesPct: number;
  availabilityPct: number;
  telemetryPowerMw?: number | null;
  scadaPowerMw?: number | null;
};

export type PVMetricsBessTelemetryRealitySnapshot = {
  emsPowerMw: number;
  measuredPowerMw: number;
  powerDeltaMw: number;
  powerDeltaPct: number;

  emsSocPct: number;
  calculatedSocPct: number | null;
  socDeltaPct: number | null;

  emsEnergyChargedMwh: number;
  measuredEnergyChargedMwh: number;
  chargedEnergyDeltaMwh: number;

  emsEnergyDischargedMwh: number;
  measuredEnergyDischargedMwh: number;
  dischargedEnergyDeltaMwh: number;

  telemetryConfidence: 'high' | 'medium' | 'low' | 'not-tested';
  statusLabel: string;
  sourceTelemetryLabel: string;
  sourceMeasurementLabel: string;
};

