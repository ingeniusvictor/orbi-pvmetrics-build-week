import { PVMetricsClientValidationGate } from './pvmetrics-client-validation.types';

export type PVMetricsClientRequestPriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export type PVMetricsClientRequestCategory =
  | 'identity'
  | 'technical-documentation'
  | 'metering'
  | 'scada-readonly'
  | 'weather'
  | 'bess'
  | 'permissions'
  | 'security';

export type PVMetricsClientValidationRequestItem = {
  id: string;
  category: PVMetricsClientRequestCategory;
  priority: PVMetricsClientRequestPriority;
  title: string;
  requestText: string;
  reason: string;
  blocksReadonlyPilot: boolean;
};

export type PVMetricsClientValidationRequestPack = {
  id: string;
  generatedAtLabel: string;
  title: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;
  gateLabel: string;
  scorePct: number;
  items: PVMetricsClientValidationRequestItem[];
  criticalItems: number;
  highItems: number;
  mediumItems: number;
  lowItems: number;
  executiveIntro: string;
  clientMessageDraft: string;
  technicalChecklistText: string;
  safetyBoundary: string;
  sourceGate: PVMetricsClientValidationGate;
};
