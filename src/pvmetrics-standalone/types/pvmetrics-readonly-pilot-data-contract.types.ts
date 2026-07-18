import { PVMetricsReadonlyPilotGoNoGoChecklist } from './pvmetrics-readonly-pilot-gonogo.types';

export type PVMetricsReadonlyPilotDataContractSignalFrequency =
  | 'near-real-time'
  | 'hourly'
  | 'daily'
  | 'on-demand'
  | 'to-be-confirmed';

export type PVMetricsReadonlyPilotDataContractSignalCriticality =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export type PVMetricsReadonlyPilotDataContractSignal = {
  id: string;
  label: string;
  category: string;
  unit: string;
  expectedSource: string;
  suggestedFrequency: PVMetricsReadonlyPilotDataContractSignalFrequency;
  criticality: PVMetricsReadonlyPilotDataContractSignalCriticality;
  qualityRules: string[];
  clientConfirmationRequired: boolean;
  readOnlyOnly: boolean;
};

export type PVMetricsReadonlyPilotDataContractResponsibility = {
  id: string;
  owner: 'client' | 'orbi' | 'joint';
  label: string;
  description: string;
};

export type PVMetricsReadonlyPilotDataContractDraft = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  contractStatus:
    | 'blocked'
    | 'draft'
    | 'ready-for-client-review'
    | 'ready-for-technical-review';

  contractStatusLabel: string;

  signalCount: number;
  criticalSignals: number;
  highSignals: number;
  mediumSignals: number;
  lowSignals: number;

  signals: PVMetricsReadonlyPilotDataContractSignal[];
  clientResponsibilities: PVMetricsReadonlyPilotDataContractResponsibility[];
  orbiResponsibilities: PVMetricsReadonlyPilotDataContractResponsibility[];
  jointResponsibilities: PVMetricsReadonlyPilotDataContractResponsibility[];

  qualityAssumptions: string[];
  explicitExclusions: string[];
  readOnlySafetyClauses: string[];

  internalContractText: string;
  clientContractText: string;
  safetyBoundary: string;

  sourceGoNoGoChecklist: PVMetricsReadonlyPilotGoNoGoChecklist;
};
