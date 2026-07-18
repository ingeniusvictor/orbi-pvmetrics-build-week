import {
  PVMetricsReadOnlyDataDomain,
  PVMetricsReadOnlyForbiddenOperation,
} from './pvmetrics-readonly-data-contract.types';
import {
  PVMetricsSourceQualityGateDecision,
  PVMetricsSourceQualityGateStatus,
} from './pvmetrics-source-freshness-quality-gate.types';

export type PVMetricsControlledSandboxStatus =
  | 'concept-only'
  | 'types-ready'
  | 'mock-session-ready'
  | 'gate-replay-ready'
  | 'visual-ready'
  | 'blocked'
  | 'closed';

export type PVMetricsControlledSandboxSourceMode =
  | 'mock-memory'
  | 'static-fixture'
  | 'manual-json-future'
  | 'real-api-blocked'
  | 'real-scada-blocked'
  | 'real-meter-blocked'
  | 'real-cen-blocked'
  | 'real-erp-blocked';

export type PVMetricsControlledSandboxSourceSafety =
  | 'allowed-mock'
  | 'allowed-static'
  | 'future-review-required'
  | 'blocked-real-source'
  | 'blocked-credential-risk'
  | 'blocked-telecontrol-risk'
  | 'blocked-write-risk';

export type PVMetricsControlledSandboxRunMode =
  | 'dry-run'
  | 'mock-replay'
  | 'gate-only'
  | 'visual-demo'
  | 'blocked-real-run';

export type PVMetricsControlledSandboxGateId =
  | 'read-only-data-contract'
  | 'source-freshness-quality'
  | 'future-connector-registry'
  | 'human-review'
  | 'anti-write'
  | 'anti-telecontrol'
  | 'anti-credential';

export type PVMetricsControlledSandboxEventType =
  | 'session-created'
  | 'source-loaded'
  | 'gate-started'
  | 'gate-passed'
  | 'gate-warning'
  | 'gate-blocked'
  | 'human-review-required'
  | 'forbidden-operation-detected'
  | 'session-closed';

export type PVMetricsControlledSandboxChecklistStatus =
  | 'passed'
  | 'warning'
  | 'blocked'
  | 'not-applicable'
  | 'pending-human-review';

export type PVMetricsControlledSandboxSource = {
  sourceId: string;
  label: string;
  mode: PVMetricsControlledSandboxSourceMode;
  safety: PVMetricsControlledSandboxSourceSafety;
  domains: PVMetricsReadOnlyDataDomain[];
  isRealSource: false;
  isNetworkEnabled: false;
  requiresCredential: false;
  description: string;
  blockedReason?: string;
};

export type PVMetricsControlledSandboxGate = {
  gateId: PVMetricsControlledSandboxGateId;
  label: string;
  required: boolean;
  description: string;
  decisionIfFailed: PVMetricsSourceQualityGateDecision;
};

export type PVMetricsControlledSandboxGateResult = {
  gateId: PVMetricsControlledSandboxGateId;
  status: PVMetricsSourceQualityGateStatus;
  decision: PVMetricsSourceQualityGateDecision;
  passed: boolean;
  warnings: string[];
  blockedReasons: string[];
  humanReviewReasons: string[];
  explanation: string;
};

export type PVMetricsControlledSandboxChecklistItem = {
  itemId: string;
  label: string;
  category:
    | 'activation'
    | 'consent'
    | 'security'
    | 'qa'
    | 'anti-write'
    | 'anti-telecontrol'
    | 'anti-mix';
  required: boolean;
  status: PVMetricsControlledSandboxChecklistStatus;
  description: string;
};

export type PVMetricsControlledSandboxEvent = {
  eventId: string;
  eventType: PVMetricsControlledSandboxEventType;
  generatedAtLabel: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'blocking' | 'critical';
};

export type PVMetricsControlledSandboxReplayStep = {
  stepId: string;
  order: number;
  label: string;
  sourceId: string;
  gateId: PVMetricsControlledSandboxGateId;
  expectedStatus: PVMetricsSourceQualityGateStatus;
  expectedDecision: PVMetricsSourceQualityGateDecision;
  description: string;
};

export type PVMetricsControlledSandboxSession = {
  sessionId: string;
  generatedAtLabel: string;
  status: PVMetricsControlledSandboxStatus;
  runMode: PVMetricsControlledSandboxRunMode;
  source: PVMetricsControlledSandboxSource;
  gates: PVMetricsControlledSandboxGate[];
  checklist: PVMetricsControlledSandboxChecklistItem[];
  replaySteps: PVMetricsControlledSandboxReplayStep[];
  events: PVMetricsControlledSandboxEvent[];
  attemptedForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  safetyBoundary: string;
};

export type PVMetricsControlledSandboxRunResult = {
  runId: string;
  generatedAtLabel: string;
  sessionId: string;
  overallStatus: PVMetricsControlledSandboxStatus;
  overallDecision: PVMetricsSourceQualityGateDecision;
  gateResults: PVMetricsControlledSandboxGateResult[];
  blockedReasons: string[];
  warnings: string[];
  humanReviewReasons: string[];
  internalSandboxText: string;
  clientSandboxText: string;
  safetyBoundary: string;
};

export type PVMetricsControlledSandboxRegistry = {
  registryId: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-H — Controlled Read-Only Integration Sandbox';
  module: '1O-H.1A — Controlled Sandbox Types';
  internalVersion: '0.1O-H.1A-controlled-sandbox-types';
  status: PVMetricsControlledSandboxStatus;
  allowedSourceModes: PVMetricsControlledSandboxSourceMode[];
  blockedSourceModes: PVMetricsControlledSandboxSourceMode[];
  mandatoryGates: PVMetricsControlledSandboxGate[];
  globalForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  globalSafetyBoundaries: string[];
  nextRecommendedModule: string;
};
