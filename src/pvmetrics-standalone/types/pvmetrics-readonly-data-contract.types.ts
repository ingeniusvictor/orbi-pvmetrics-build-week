export type PVMetricsReadOnlyConnectorFamily =
  | 'plant-profile'
  | 'weather-provider'
  | 'scada'
  | 'meter'
  | 'cen-readiness'
  | 'om-events'
  | 'commercial-assumptions'
  | 'manual-mock'
  | 'future-connector';

export type PVMetricsReadOnlyAccessMode =
  | 'read-only'
  | 'mock-only'
  | 'no-submit'
  | 'contract-only'
  | 'blocked';

export type PVMetricsReadOnlySourceType =
  | 'mock'
  | 'manual'
  | 'future-api'
  | 'future-file-import'
  | 'future-scada-read'
  | 'future-meter-read'
  | 'future-regulatory-read'
  | 'future-commercial-read';

export type PVMetricsReadOnlyFreshnessStatus =
  | 'fresh'
  | 'stale'
  | 'missing'
  | 'timestamp-missing'
  | 'future-source'
  | 'unknown'
  | 'rejected';

export type PVMetricsReadOnlyDataQualityStatus =
  | 'valid'
  | 'warning'
  | 'incomplete'
  | 'blocked'
  | 'unit-conflict'
  | 'source-missing'
  | 'timestamp-missing'
  | 'fv-bess-mixed'
  | 'human-review-required';

export type PVMetricsReadOnlyUnit =
  | 'kW'
  | 'MW'
  | 'kWh'
  | 'MWh'
  | 'percent'
  | 'USD'
  | 'USD_PER_MWH'
  | 'W_PER_M2'
  | 'CELSIUS'
  | 'BOOLEAN'
  | 'TEXT'
  | 'COUNT'
  | 'UNITLESS'
  | 'UNKNOWN';

export type PVMetricsReadOnlyDataDomain =
  | 'forecast'
  | 'plant-profile'
  | 'weather'
  | 'scada'
  | 'meter'
  | 'cen-compliance'
  | 'operational-events'
  | 'forecast-accuracy'
  | 'soiling-cleaning'
  | 'commercial-impact'
  | 'executive-intelligence'
  | 'data-quality';

export type PVMetricsReadOnlyAssetSeparation =
  | 'pv-only'
  | 'bess-only'
  | 'poi-total'
  | 'mixed-rejected'
  | 'not-applicable'
  | 'unknown';

export type PVMetricsReadOnlyForbiddenOperation =
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'TELECONTROL'
  | 'SETPOINT_WRITE'
  | 'BESS_COMMAND'
  | 'INVERTER_COMMAND'
  | 'METER_COMMAND'
  | 'SCADA_ACK'
  | 'CEN_SUBMIT'
  | 'ERP_WRITE'
  | 'BILLING'
  | 'WORK_ORDER_CREATE';

export type PVMetricsReadOnlySourceDescriptor = {
  sourceId: string;
  sourceName: string;
  sourceType: PVMetricsReadOnlySourceType;
  connectorFamily: PVMetricsReadOnlyConnectorFamily;
  accessMode: PVMetricsReadOnlyAccessMode;
  isRealConnector: false;
  isMockSafe: boolean;
  description: string;
};

export type PVMetricsReadOnlyContractField = {
  fieldId: string;
  label: string;
  domain: PVMetricsReadOnlyDataDomain;
  required: boolean;
  expectedUnit: PVMetricsReadOnlyUnit;
  sourceRequired: boolean;
  timestampRequired: boolean;
  assetSeparationRequired: boolean;
  description: string;
};

export type PVMetricsReadOnlyNormalizedSignal = {
  signalId: string;
  label: string;
  domain: PVMetricsReadOnlyDataDomain;
  value: number | string | boolean | null;
  unit: PVMetricsReadOnlyUnit;
  sourceId: string;
  measuredAtLabel: string | null;
  generatedAtLabel: string;
  freshnessStatus: PVMetricsReadOnlyFreshnessStatus;
  dataQualityStatus: PVMetricsReadOnlyDataQualityStatus;
  assetSeparation: PVMetricsReadOnlyAssetSeparation;
  notes: string[];
};

export type PVMetricsReadOnlyContractRule = {
  ruleId: string;
  label: string;
  severity: 'info' | 'warning' | 'blocking';
  description: string;
  failureMessage: string;
};

export type PVMetricsReadOnlyConnectorContract = {
  contractId: string;
  connectorFamily: PVMetricsReadOnlyConnectorFamily;
  accessMode: PVMetricsReadOnlyAccessMode;
  sourceDescriptor: PVMetricsReadOnlySourceDescriptor;
  fields: PVMetricsReadOnlyContractField[];
  contractRules: PVMetricsReadOnlyContractRule[];
  forbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  safetyBoundary: string;
};

export type PVMetricsReadOnlyDataPacket = {
  packetId: string;
  generatedAtLabel: string;
  sourceDescriptor: PVMetricsReadOnlySourceDescriptor;
  signals: PVMetricsReadOnlyNormalizedSignal[];
  freshnessStatus: PVMetricsReadOnlyFreshnessStatus;
  dataQualityStatus: PVMetricsReadOnlyDataQualityStatus;
  blockedReasons: string[];
  warnings: string[];
  safetyBoundary: string;
};

export type PVMetricsReadOnlyDataContractRegistry = {
  registryId: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-G — Read-Only Data Contract & Connector Readiness';
  contracts: PVMetricsReadOnlyConnectorContract[];
  globalForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  globalSafetyBoundaries: string[];
  nextRecommendedModule: string;
};
