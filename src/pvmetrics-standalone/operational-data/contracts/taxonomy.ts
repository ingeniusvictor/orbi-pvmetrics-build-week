export type OperationalAssetType =
  | 'PLANT'
  | 'PV_ARRAY'
  | 'INVERTER'
  | 'BESS'
  | 'METER'
  | 'WEATHER_STATION'
  | 'GATEWAY'
  | 'OTHER';

export type OperationalSourceType =
  | 'SCADA_EXPORT'
  | 'METER_EXPORT'
  | 'INVERTER_EXPORT'
  | 'BESS_EMS_EXPORT'
  | 'WEATHER_SOURCE'
  | 'MANUAL_OBSERVATION'
  | 'SYNTHETIC_DEMO'
  | 'OTHER';

export type OperationalProvenance = 'SYNTHETIC' | 'DECLARED_REAL';

export type OperationalVerificationState =
  | 'UNVERIFIED'
  | 'SOURCE_DECLARED'
  | 'SOURCE_VERIFIED';

export type OperationalValueType = 'NUMBER' | 'STRING' | 'BOOLEAN';

export type OperationalQualityStatus = 'GOOD' | 'SUSPECT' | 'MISSING' | 'INVALID' | 'UNKNOWN';

export type OperationalEvidenceType =
  | 'CSV_EXPORT'
  | 'DOCUMENT'
  | 'SCREENSHOT'
  | 'MANUAL_NOTE'
  | 'OTHER';

export const OPERATIONAL_QUALITY_STATUSES = [
  'GOOD',
  'SUSPECT',
  'MISSING',
  'INVALID',
  'UNKNOWN',
] as const satisfies readonly OperationalQualityStatus[];
