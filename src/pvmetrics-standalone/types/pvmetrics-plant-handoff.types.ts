import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorValidationResult,
} from './pvmetrics-plant-configurator.types';

export type PVMetricsPlantHandoffReadinessLevel =
  | 'incomplete'
  | 'draft-ready'
  | 'client-validation-ready'
  | 'readonly-pilot-ready';

export type PVMetricsPlantHandoffRequiredSource =
  | 'technical-datasheet'
  | 'single-line-diagram'
  | 'inverter-list'
  | 'metering-source'
  | 'scada-tag-list'
  | 'weather-station-source'
  | 'external-environment-source'
  | 'historical-production'
  | 'bess-ems-source'
  | 'bess-bms-source'
  | 'bess-pcs-source'
  | 'bess-dedicated-meter'
  | 'poi-meter'
  | 'readonly-approval';

export type PVMetricsPlantHandoffSignalGroup =
  | 'plant-production'
  | 'solar-resource'
  | 'weather'
  | 'environment-telemetry'
  | 'bess'
  | 'bess-telemetry'
  | 'bess-measurement'
  | 'scada'
  | 'inverter'
  | 'metering'
  | 'availability';

export type PVMetricsPlantHandoffGap = {
  id: string;
  label: string;
  severity: 'info' | 'warning' | 'critical';
  recommendation: string;
};

export type PVMetricsPlantTechnicalHandoff = {
  id: string;
  generatedAtLabel: string;
  title: string;
  readinessLevel: PVMetricsPlantHandoffReadinessLevel;
  readinessLabel: string;

  draft: PVMetricsPlantConfiguratorDraft;
  validation: PVMetricsPlantConfiguratorValidationResult;

  requiredSources: PVMetricsPlantHandoffRequiredSource[];
  requiredSignalGroups: PVMetricsPlantHandoffSignalGroup[];
  gaps: PVMetricsPlantHandoffGap[];

  executiveSummary: string;
  plantTechnicalSummary: string;
  bessTechnicalSummary: string;
  dataProvenanceSummary: string;
  nextSteps: string[];
  safetyBoundary: string;
  copyableText: string;
};
