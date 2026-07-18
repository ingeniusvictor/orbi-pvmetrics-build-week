import {
  PVMetricsSignalCriticality,
  PVMetricsSignalDomain,
  PVMetricsSignalSourceType,
  PVMetricsSignalValidationStatus,
} from './pvmetrics-signal-mapping.types';

export type PVMetricsSignalQualityRuleType =
  | 'presence-check'
  | 'range-check'
  | 'unit-check'
  | 'timestamp-check'
  | 'stale-check'
  | 'frozen-signal-check'
  | 'quality-threshold-check'
  | 'source-authorization-check'
  | 'cross-source-delta-check'
  | 'critical-signal-readiness-check';

export type PVMetricsSignalQualityRuleSeverity =
  | 'info'
  | 'warning'
  | 'critical';

export type PVMetricsSignalQualityRuleStatus =
  | 'passed'
  | 'warning'
  | 'failed'
  | 'not-tested'
  | 'blocked';

export type PVMetricsSignalQualityAction =
  | 'monitor'
  | 'review-mapping'
  | 'request-client-data'
  | 'validate-unit'
  | 'validate-range'
  | 'check-source-authorization'
  | 'confirm-scada-tag'
  | 'confirm-instrument-health'
  | 'prepare-readonly-pilot'
  | 'no-action-required';

export type PVMetricsSignalQualityRule = {
  id: string;
  signalId: string;
  signalName: string;
  tagKey: string;
  domain: PVMetricsSignalDomain;
  expectedSource: PVMetricsSignalSourceType;
  ruleType: PVMetricsSignalQualityRuleType;
  severity: PVMetricsSignalQualityRuleSeverity;
  status: PVMetricsSignalQualityRuleStatus;
  validationStatus: PVMetricsSignalValidationStatus;
  criticality: PVMetricsSignalCriticality;
  qualityPct: number;
  ruleLabel: string;
  expectedCondition: string;
  simulatedFinding: string;
  recommendedAction: PVMetricsSignalQualityAction;
  riskNote: string;
};

export type PVMetricsSignalQualityRulesSummary = {
  totalRules: number;
  passedRules: number;
  warningRules: number;
  failedRules: number;
  blockedRules: number;
  notTestedRules: number;
  criticalRules: number;
  averageQualityPct: number;
  operationalRiskScore: number;
};

export type PVMetricsSignalQualityRulesDataset = {
  summary: PVMetricsSignalQualityRulesSummary;
  rules: PVMetricsSignalQualityRule[];
};
