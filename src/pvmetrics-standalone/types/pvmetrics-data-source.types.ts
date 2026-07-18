export type PVMetricsDataSourceType =
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

export type PVMetricsDataSourceStatus =
  | 'active-demo'
  | 'available'
  | 'simulated'
  | 'pending'
  | 'not-authorized'
  | 'error';

export type PVMetricsDataSourceSecurityMode =
  | 'local-demo'
  | 'read-only'
  | 'sandbox'
  | 'not-connected';

export type PVMetricsDataSourceRefreshMode =
  | 'manual'
  | 'scheduled'
  | 'near-real-time'
  | 'not-applicable';

export type PVMetricsDataSource = {
  id: string;
  name: string;
  type: PVMetricsDataSourceType;
  status: PVMetricsDataSourceStatus;
  securityMode: PVMetricsDataSourceSecurityMode;
  refreshMode: PVMetricsDataSourceRefreshMode;
  description: string;
  expectedSignals: string[];
  lastSyncLabel: string;
  ownerLabel: string;
  readinessPct: number;
  notes: string;
};

export type PVMetricsDataSourceSummary = {
  totalSources: number;
  activeDemoSources: number;
  readOnlyReadySources: number;
  pendingSources: number;
  notAuthorizedSources: number;
  averageReadinessPct: number;
};

export type PVMetricsDataSourceManagerDataset = {
  summary: PVMetricsDataSourceSummary;
  sources: PVMetricsDataSource[];
};
