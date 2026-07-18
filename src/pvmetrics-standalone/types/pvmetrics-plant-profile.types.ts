import { PVMetricsBessDataSourceProfile } from './pvmetrics-bess-datasource.types';

export type PVMetricsPlantProfileDataSource =
  | 'demo'
  | 'client-document'
  | 'engineering-sheet'
  | 'scada-readonly'
  | 'csv-historical'
  | 'excel-workbook'
  | 'manual-entry'
  | 'not-validated';

export type PVMetricsPlantValidationStatus =
  | 'demo-only'
  | 'draft'
  | 'pending-client-validation'
  | 'validated-by-client'
  | 'ready-for-readonly-pilot';

export type PVMetricsPlantTechnology = 'pv-only' | 'pv-bess';

export type PVMetricsMountingType =
  | 'fixed-tilt'
  | 'single-axis-tracker'
  | 'dual-axis-tracker'
  | 'unknown';

export type PVMetricsBessOperationMode =
  | 'not-applicable'
  | 'energy-shifting'
  | 'peak-shaving'
  | 'grid-support'
  | 'unknown';

export type PVMetricsPlantOwnerProfile = {
  id: string;
  ownerName: string;
  workspaceName: string;
  country: string;
  region: string;
  contactLabel?: string;
  isDemoWorkspace: boolean;
};

export type PVMetricsPlantTechnicalProfile = {
  id: string;
  ownerId: string;
  plantName: string;
  plantCode: string;
  technology: PVMetricsPlantTechnology;
  country: string;
  region: string;
  commune?: string;
  timezone: string;
  latitude?: number | null;
  longitude?: number | null;

  pvCapacityDcMwp: number;
  pvCapacityAcMw: number;
  mountingType: PVMetricsMountingType;

  inverterCount?: number | null;
  inverterModel?: string;
  meterModel?: string;
  scadaVendor?: string;
  dataLoggerVendor?: string;
  weatherStationModel?: string;

  hasBess: boolean;
  bessPowerMw?: number | null;
  bessEnergyMwh?: number | null;
  bessOperationMode: PVMetricsBessOperationMode;
  bessEmsVendor?: string;
  bessDataSources?: PVMetricsBessDataSourceProfile[];
  bessPrimaryTelemetrySourceId?: string | null;
  bessPrimaryMeasurementSourceId?: string | null;

  sourceType: PVMetricsPlantProfileDataSource;
  validationStatus: PVMetricsPlantValidationStatus;
  sourceOfTruthLabel: string;
  validatedBy?: string | null;
  lastValidatedAt?: string | null;

  notes: string;
};

export type PVMetricsPlantProfileDataset = {
  owners: PVMetricsPlantOwnerProfile[];
  plants: PVMetricsPlantTechnicalProfile[];
};
