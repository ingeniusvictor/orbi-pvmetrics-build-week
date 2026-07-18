export type PVMetricsPlantIntakeFileType =
  | 'plain-text'
  | 'txt'
  | 'docx'
  | 'pdf'
  | 'manual-paste'
  | 'unknown';

export type PVMetricsPlantIntakeConfidence =
  | 'high'
  | 'medium'
  | 'low'
  | 'missing';

export type PVMetricsPlantIntakeField = {
  key: string;
  label: string;
  rawValue: string;
  normalizedValue: string;
  confidence: PVMetricsPlantIntakeConfidence;
  required: boolean;
  notes?: string;
};

export type PVMetricsPlantIntakeParsedResult = {
  id: string;
  sourceFileType: PVMetricsPlantIntakeFileType;
  sourceLabel: string;
  parsedAtLabel: string;
  rawText: string;
  fields: PVMetricsPlantIntakeField[];
  missingRequiredFields: string[];
  warnings: string[];
  canCreateDraft: boolean;
  canRequestValidation: boolean;
};

export type PVMetricsPlantIntakeNormalizedPayload = {
  workspaceName: string;
  ownerName: string;
  plantName: string;
  plantCode: string;
  country: string;
  region: string;
  commune: string;
  timezone: string;

  technology: 'pv-only' | 'pv-bess';
  pvCapacityDcMwp: number | null;
  pvCapacityAcMw: number | null;
  mountingType: 'fixed-tilt' | 'single-axis-tracker' | 'dual-axis-tracker' | 'unknown';
  inverterCount: number | null;
  inverterModel: string;

  hasBess: boolean;
  bessPowerMw: number | null;
  bessEnergyMwh: number | null;
  bessMinSocPct: number | null;
  bessMaxSocPct: number | null;
  bessRoundTripEfficiencyPct: number | null;
  bessEmsVendor: string;
  bessTelemetrySourceLabel: string;
  bessMeasurementSourceLabel: string;

  environmentSourceLabel: string;
  scadaSourceLabel: string;
  meterSourceLabel: string;
  weatherSourceLabel: string;
  readonlyApprovalLabel: string;

  notes: string;
};
