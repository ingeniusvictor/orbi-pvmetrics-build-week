import {
  PVMetricsSignalCriticality,
  PVMetricsSignalDomain,
  PVMetricsSignalSourceType,
} from './pvmetrics-signal-mapping.types';

export type PVMetricsReadinessAuthorizationStatus =
  | 'authorized-demo'
  | 'authorized-readonly'
  | 'pending-client-approval'
  | 'not-authorized'
  | 'not-required';

export type PVMetricsReadinessStatus =
  | 'ready-demo'
  | 'ready-readonly'
  | 'partial'
  | 'blocked'
  | 'not-ready';

export type PVMetricsReadinessRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type PVMetricsReadinessRecommendedAction =
  | 'keep-demo'
  | 'confirm-source'
  | 'request-client-approval'
  | 'confirm-scada-tag'
  | 'validate-signal-quality'
  | 'validate-metering-source'
  | 'validate-weather-source'
  | 'prepare-readonly-pilot'
  | 'block-until-authorized';

export type PVMetricsReadinessMatrixRow = {
  id: string;
  signalId: string;
  signalName: string;
  tagKey: string;
  domain: PVMetricsSignalDomain;
  expectedSource: PVMetricsSignalSourceType;
  sourceName: string;
  sourceStatusLabel: string;
  signalCriticality: PVMetricsSignalCriticality;
  authorizationStatus: PVMetricsReadinessAuthorizationStatus;
  readinessStatus: PVMetricsReadinessStatus;
  riskLevel: PVMetricsReadinessRiskLevel;
  qualityPct: number;
  readinessPct: number;
  ruleStatusLabel: string;
  recommendedAction: PVMetricsReadinessRecommendedAction;
  readinessNote: string;
};

export type PVMetricsReadinessMatrixSummary = {
  totalRows: number;
  readyDemoRows: number;
  readyReadonlyRows: number;
  partialRows: number;
  blockedRows: number;
  notReadyRows: number;
  criticalRiskRows: number;
  averageReadinessPct: number;
  pilotReadinessPct: number;
};

export type PVMetricsReadinessMatrixDataset = {
  summary: PVMetricsReadinessMatrixSummary;
  rows: PVMetricsReadinessMatrixRow[];
};
