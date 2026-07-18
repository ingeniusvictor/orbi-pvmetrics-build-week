export type PVMetricsSignalDomain =
  | 'plant-production'
  | 'solar-resource'
  | 'weather'
  | 'bess'
  | 'scada'
  | 'inverter'
  | 'metering'
  | 'losses'
  | 'availability';

export type PVMetricsSignalSourceType =
  | 'demo-local'
  | 'csv-historical'
  | 'excel-workbook'
  | 'client-api'
  | 'scada-readonly'
  | 'data-logger'
  | 'energy-meter'
  | 'weather-station'
  | 'bess-ems'
  | 'bess-bms'
  | 'bess-pcs'
  | 'bess-meter'
  | 'poi-meter'
  | 'bess-cloud-portal';

export type PVMetricsSignalMappingStatus =
  | 'mapped-demo'
  | 'mapped-readonly'
  | 'pending-mapping'
  | 'requires-client-data'
  | 'not-authorized';

export type PVMetricsSignalValidationStatus =
  | 'valid'
  | 'warning'
  | 'missing'
  | 'out-of-range'
  | 'stale'
  | 'unit-mismatch'
  | 'not-tested';

export type PVMetricsSignalCriticality =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsSignalRefreshExpectation =
  | 'real-time'
  | 'near-real-time'
  | 'hourly'
  | 'daily'
  | 'manual'
  | 'not-applicable';

export type PVMetricsExpectedSignal = {
  id: string;
  name: string;
  tagKey: string;
  domain: PVMetricsSignalDomain;
  expectedSource: PVMetricsSignalSourceType;
  unit: string;
  validMin: number | null;
  validMax: number | null;
  refreshExpectation: PVMetricsSignalRefreshExpectation;
  mappingStatus: PVMetricsSignalMappingStatus;
  validationStatus: PVMetricsSignalValidationStatus;
  qualityPct: number;
  criticality: PVMetricsSignalCriticality;
  usedInModules: string[];
  description: string;
  validationNote: string;
};

export type PVMetricsSignalMappingSummary = {
  totalSignals: number;
  mappedSignals: number;
  pendingSignals: number;
  validSignals: number;
  warningSignals: number;
  missingSignals: number;
  averageQualityPct: number;
  criticalSignals: number;
};

export type PVMetricsSignalMappingDataset = {
  summary: PVMetricsSignalMappingSummary;
  signals: PVMetricsExpectedSignal[];
};
