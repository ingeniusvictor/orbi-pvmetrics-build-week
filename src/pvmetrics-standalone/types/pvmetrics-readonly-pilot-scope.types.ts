import { PVMetricsClientValidationDecisionSummary } from './pvmetrics-client-validation-decision.types';

export type PVMetricsReadonlyPilotSignalPriority =
  | 'mandatory'
  | 'recommended'
  | 'optional';

export type PVMetricsReadonlyPilotSignalDomain =
  | 'plant-metering'
  | 'inverter'
  | 'weather'
  | 'bess'
  | 'availability'
  | 'alarms'
  | 'metadata'
  | 'commercial';

export type PVMetricsReadonlyPilotSignal = {
  id: string;
  label: string;
  domain: PVMetricsReadonlyPilotSignalDomain;
  priority: PVMetricsReadonlyPilotSignalPriority;
  unit: string;
  expectedSource: string;
  reason: string;
  readOnlyRequired: boolean;
};

export type PVMetricsReadonlyPilotScopeStatus =
  | 'blocked'
  | 'draft-scope'
  | 'ready-for-client-review'
  | 'ready-for-readonly-preparation';

export type PVMetricsReadonlyPilotScope = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  status: PVMetricsReadonlyPilotScopeStatus;
  statusLabel: string;

  signalCount: number;
  mandatorySignals: number;
  recommendedSignals: number;
  optionalSignals: number;
  bessSignals: number;

  signals: PVMetricsReadonlyPilotSignal[];
  outOfScopeItems: string[];
  preConnectionCriteria: string[];

  safetyBoundary: string;
  executiveSummary: string;

  sourceDecision: PVMetricsClientValidationDecisionSummary;
};
