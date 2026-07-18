export type PVMetricsBessDataSourceType =
  | 'bess-ems'
  | 'bess-bms'
  | 'bess-pcs'
  | 'bess-scada-readonly'
  | 'bess-meter'
  | 'poi-meter'
  | 'bess-data-logger'
  | 'bess-cloud-portal'
  | 'manual-demo';

export type PVMetricsBessDataSourceStatus =
  | 'demo'
  | 'available-readonly'
  | 'pending-client-approval'
  | 'not-available'
  | 'not-validated';

export type PVMetricsBessTelemetryConfidence =
  | 'high'
  | 'medium'
  | 'low'
  | 'not-tested';

export type PVMetricsBessDataSourceProfile = {
  id: string;
  sourceType: PVMetricsBessDataSourceType;
  sourceName: string;
  vendorLabel: string;
  status: PVMetricsBessDataSourceStatus;
  isReadOnly: boolean;
  isPrimaryTelemetrySource: boolean;
  isPrimaryMeasurementSource: boolean;
  expectedSignals: string[];
  sourceOfTruthLabel: string;
  notes: string;
};
