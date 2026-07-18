import {
  PVMetricsBessOperationMode,
  PVMetricsMountingType,
  PVMetricsPlantTechnology,
} from './pvmetrics-plant-profile.types';

export type PVMetricsPlantConfiguratorStepId =
  | 'workspace'
  | 'plant-identity'
  | 'location'
  | 'pv-system'
  | 'bess-system'
  | 'equipment'
  | 'data-sources'
  | 'readonly-security'
  | 'review';

export type PVMetricsPlantConfiguratorFieldStatus =
  | 'complete'
  | 'missing'
  | 'warning'
  | 'not-required';

export type PVMetricsPlantConfiguratorSourceAvailability =
  | 'available'
  | 'pending'
  | 'not-available'
  | 'unknown';

export type PVMetricsPlantConfiguratorReadonlyApproval =
  | 'not-requested'
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'not-required';

export type PVMetricsPlantConfiguratorDraft = {
  id: string;

  workspaceName: string;
  ownerName: string;
  country: string;
  region: string;
  contactLabel: string;

  plantName: string;
  plantCode: string;
  technology: PVMetricsPlantTechnology;

  commune: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;

  pvCapacityDcMwp: number;
  pvCapacityAcMw: number;
  mountingType: PVMetricsMountingType;

  inverterCount: number | null;
  inverterModel: string;
  meterModel: string;
  scadaVendor: string;
  dataLoggerVendor: string;
  weatherStationModel: string;

  hasBess: boolean;
  bessPowerMw: number | null;
  bessEnergyMwh: number | null;
  bessOperationMode: PVMetricsBessOperationMode;
  bessEmsVendor: string;

  hasHistoricalCsv: PVMetricsPlantConfiguratorSourceAvailability;
  hasExcelWorkbook: PVMetricsPlantConfiguratorSourceAvailability;
  hasClientApi: PVMetricsPlantConfiguratorSourceAvailability;
  hasScadaReadonly: PVMetricsPlantConfiguratorSourceAvailability;
  hasEnergyMeter: PVMetricsPlantConfiguratorSourceAvailability;
  hasWeatherStation: PVMetricsPlantConfiguratorSourceAvailability;
  hasBessEms: PVMetricsPlantConfiguratorSourceAvailability;

  hasBessEmsSource: PVMetricsPlantConfiguratorSourceAvailability;
  hasBessBmsSource: PVMetricsPlantConfiguratorSourceAvailability;
  hasBessPcsSource: PVMetricsPlantConfiguratorSourceAvailability;
  hasBessScadaReadonly: PVMetricsPlantConfiguratorSourceAvailability;
  hasBessDedicatedMeter: PVMetricsPlantConfiguratorSourceAvailability;
  hasPoiMeter: PVMetricsPlantConfiguratorSourceAvailability;

  bessTelemetrySourceLabel: string;
  bessMeasurementSourceLabel: string;

  bessMinSocPct?: number | null;
  bessMaxSocPct?: number | null;
  bessRoundTripEfficiencyPct?: number | null;

  readonlyApproval: PVMetricsPlantConfiguratorReadonlyApproval;
  clientValidationRequired: boolean;
  sourceOfTruthLabel: string;

  notes: string;
};

export type PVMetricsPlantConfiguratorStep = {
  id: PVMetricsPlantConfiguratorStepId;
  title: string;
  shortTitle: string;
  description: string;
  requiredFields: string[];
};

export type PVMetricsPlantConfiguratorFieldCheck = {
  id: string;
  label: string;
  stepId: PVMetricsPlantConfiguratorStepId;
  status: PVMetricsPlantConfiguratorFieldStatus;
  message: string;
};

export type PVMetricsPlantConfiguratorValidationSummary = {
  totalChecks: number;
  completeChecks: number;
  missingChecks: number;
  warningChecks: number;
  notRequiredChecks: number;
  completionPct: number;
  canCreateDraftProfile: boolean;
  canRequestClientValidation: boolean;
  canPrepareReadonlyPilot: boolean;
};

export type PVMetricsPlantConfiguratorValidationResult = {
  summary: PVMetricsPlantConfiguratorValidationSummary;
  checks: PVMetricsPlantConfiguratorFieldCheck[];
};
