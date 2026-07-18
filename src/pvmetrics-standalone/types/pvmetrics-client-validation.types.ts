import { PVMetricsPlantConfiguratorDraft } from './pvmetrics-plant-configurator.types';

export type PVMetricsValidationEvidenceType =
  | 'technical-datasheet'
  | 'single-line-diagram'
  | 'inverter-list'
  | 'metering-document'
  | 'scada-tag-list'
  | 'weather-source'
  | 'bess-ems-document'
  | 'bess-meter-document'
  | 'client-email-confirmation'
  | 'manual-entry'
  | 'demo-placeholder';

export type PVMetricsValidationEvidenceStatus =
  | 'validated'
  | 'pending-client'
  | 'missing'
  | 'demo-only'
  | 'not-required';

export type PVMetricsValidationGateStatus =
  | 'blocked'
  | 'draft-only'
  | 'ready-for-client-validation'
  | 'ready-for-readonly-pilot';

export type PVMetricsSourceOfTruthCheck = {
  id: string;
  label: string;
  evidenceType: PVMetricsValidationEvidenceType;
  status: PVMetricsValidationEvidenceStatus;
  required: boolean;
  blocksReadonlyPilot: boolean;
  note: string;
  recommendation: string;
};

export type PVMetricsClientValidationGate = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;
  gateStatus: PVMetricsValidationGateStatus;
  gateLabel: string;
  scorePct: number;
  requiredChecks: number;
  validatedChecks: number;
  missingChecks: number;
  pendingChecks: number;
  blockingChecks: number;
  checks: PVMetricsSourceOfTruthCheck[];
  executiveNote: string;
  nextActions: string[];
  safetyBoundary: string;
  sourceDraft: PVMetricsPlantConfiguratorDraft;
};
