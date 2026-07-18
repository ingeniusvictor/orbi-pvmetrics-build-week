import { PVMetricsReadonlyPilotFinalHandoffPackage } from './pvmetrics-readonly-pilot-final-handoff.types';

export type PVMetricsReadonlyConnectorSourceType =
  | 'scada-readonly'
  | 'ems-readonly'
  | 'bms-readonly'
  | 'pcs-readonly'
  | 'meter-readonly'
  | 'inverter-platform-readonly'
  | 'weather-source-readonly'
  | 'manual-file-import'
  | 'demo-simulator'
  | 'client-report';

export type PVMetricsReadonlyConnectorProtocolFamily =
  | 'rest-api-concept'
  | 'csv-file-concept'
  | 'json-file-concept'
  | 'database-view-concept'
  | 'opcua-readonly-concept'
  | 'modbus-readonly-concept'
  | 'mqtt-readonly-concept'
  | 'manual-entry-concept'
  | 'not-defined';

export type PVMetricsReadonlyConnectorRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'blocked';

export type PVMetricsReadonlyConnectorBlueprintStatus =
  | 'blocked'
  | 'draft-blueprint'
  | 'ready-for-security-review'
  | 'ready-for-client-architecture-review';

export type PVMetricsReadonlyConnectorCandidate = {
  id: string;
  label: string;
  sourceType: PVMetricsReadonlyConnectorSourceType;
  protocolFamily: PVMetricsReadonlyConnectorProtocolFamily;
  expectedSignals: string[];
  riskLevel: PVMetricsReadonlyConnectorRiskLevel;
  readOnlyRequired: boolean;
  credentialsPolicy: string;
  allowedActions: string[];
  forbiddenActions: string[];
  preConnectionChecks: string[];
  notes: string;
};

export type PVMetricsReadonlyConnectorGuardrail = {
  id: string;
  label: string;
  category:
    | 'security'
    | 'credentials'
    | 'network'
    | 'data-quality'
    | 'operations'
    | 'governance'
    | 'safety-boundary';
  mandatory: boolean;
  blocksIfMissing: boolean;
  description: string;
};

export type PVMetricsReadonlyConnectorDataFlowStep = {
  id: string;
  order: number;
  label: string;
  description: string;
  allowed: boolean;
};

export type PVMetricsReadonlyConnectorBlueprint = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  blueprintStatus: PVMetricsReadonlyConnectorBlueprintStatus;
  blueprintStatusLabel: string;

  connectorCount: number;
  lowRiskConnectors: number;
  mediumRiskConnectors: number;
  highRiskConnectors: number;
  blockedConnectors: number;

  candidates: PVMetricsReadonlyConnectorCandidate[];
  guardrails: PVMetricsReadonlyConnectorGuardrail[];
  dataFlow: PVMetricsReadonlyConnectorDataFlowStep[];

  allowedSourceTypes: PVMetricsReadonlyConnectorSourceType[];
  forbiddenIntegrationPatterns: string[];
  credentialPolicies: string[];
  preConnectionRequirements: string[];
  securityBoundaries: string[];
  architectureRisks: string[];
  requiredActions: string[];

  internalBlueprintText: string;
  clientBlueprintText: string;
  safetyBoundary: string;

  sourceFinalHandoff: PVMetricsReadonlyPilotFinalHandoffPackage;
};
