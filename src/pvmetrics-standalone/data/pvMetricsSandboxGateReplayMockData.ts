import { PVMetricsControlledSandboxRunMode } from '../types/pvmetrics-controlled-sandbox.types';
import {
  PVMetricsReadOnlyForbiddenOperation,
} from '../types/pvmetrics-readonly-data-contract.types';
import {
  createPvMetricsControlledSandboxMockSessionBase,
} from './createPvMetricsControlledSandboxMockSessionBase';
import {
  createPvMetricsControlledSandboxRunResult,
} from './createPvMetricsControlledSandboxRunResult';

type PVMetricsSandboxGateReplayScenarioKind =
  | 'safe-pass'
  | 'human-review'
  | 'blocked-source'
  | 'blocked-write'
  | 'blocked-telecontrol'
  | 'blocked-regulatory';

type PVMetricsSandboxGateReplayScenarioConfig = {
  scenarioId: string;
  label: string;
  kind: PVMetricsSandboxGateReplayScenarioKind;
  runMode: PVMetricsControlledSandboxRunMode;
  sourceMode:
    | 'mock-memory'
    | 'static-fixture'
    | 'manual-json-future'
    | 'real-api-blocked'
    | 'real-scada-blocked'
    | 'real-meter-blocked'
    | 'real-cen-blocked';
  attemptedForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[];
  expectedOutcome:
    | 'allow-mock-use'
    | 'require-human-review'
    | 'reject-packet';
  description: string;
};

export type PVMetricsSandboxGateReplayScenario = {
  scenarioId: string;
  label: string;
  kind: PVMetricsSandboxGateReplayScenarioKind;
  expectedOutcome:
    | 'allow-mock-use'
    | 'require-human-review'
    | 'reject-packet';
  description: string;
  sessionId: string;
  sourceMode: string;
  sourceSafety: string;
  overallStatus: string;
  overallDecision: string;
  blockedReasons: string[];
  warnings: string[];
  humanReviewReasons: string[];
  internalText: string;
  clientText: string;
};

const scenarioConfigs: PVMetricsSandboxGateReplayScenarioConfig[] = [
  {
    scenarioId: 'replay-safe-mock-memory',
    label: 'Mock Memory seguro aprobado',
    kind: 'safe-pass',
    runMode: 'mock-replay',
    sourceMode: 'mock-memory',
    attemptedForbiddenOperations: [],
    expectedOutcome: 'allow-mock-use',
    description:
      'Escenario base seguro usando fuente en memoria local sin operaciones prohibidas.',
  },
  {
    scenarioId: 'replay-safe-static-fixture',
    label: 'Static Fixture seguro aprobado',
    kind: 'safe-pass',
    runMode: 'mock-replay',
    sourceMode: 'static-fixture',
    attemptedForbiddenOperations: [],
    expectedOutcome: 'allow-mock-use',
    description:
      'Escenario seguro usando fixture estático versionado dentro del frontend.',
  },
  {
    scenarioId: 'replay-manual-json-review',
    label: 'Manual JSON futuro con revisión humana',
    kind: 'human-review',
    runMode: 'gate-only',
    sourceMode: 'manual-json-future',
    attemptedForbiddenOperations: [],
    expectedOutcome: 'require-human-review',
    description:
      'Escenario futuro aún no habilitado automáticamente; exige revisión humana.',
  },
  {
    scenarioId: 'replay-real-api-blocked',
    label: 'Real API bloqueada',
    kind: 'blocked-source',
    runMode: 'blocked-real-run',
    sourceMode: 'real-api-blocked',
    attemptedForbiddenOperations: [],
    expectedOutcome: 'reject-packet',
    description:
      'Simula intento conceptual de usar API real. Debe bloquearse por riesgo de credenciales/red.',
  },
  {
    scenarioId: 'replay-real-scada-blocked',
    label: 'Real SCADA bloqueada',
    kind: 'blocked-source',
    runMode: 'blocked-real-run',
    sourceMode: 'real-scada-blocked',
    attemptedForbiddenOperations: [],
    expectedOutcome: 'reject-packet',
    description:
      'Simula intento conceptual de SCADA real. Debe bloquearse por riesgo operacional/telecontrol.',
  },
  {
    scenarioId: 'replay-real-meter-blocked',
    label: 'Real Meter bloqueado',
    kind: 'blocked-source',
    runMode: 'blocked-real-run',
    sourceMode: 'real-meter-blocked',
    attemptedForbiddenOperations: [],
    expectedOutcome: 'reject-packet',
    description:
      'Simula intento conceptual de medidor real. Debe bloquearse por hardware/billing/riesgo externo.',
  },
  {
    scenarioId: 'replay-post-blocked',
    label: 'POST bloqueado',
    kind: 'blocked-write',
    runMode: 'gate-only',
    sourceMode: 'mock-memory',
    attemptedForbiddenOperations: ['POST'],
    expectedOutcome: 'reject-packet',
    description:
      'Simula operación mutativa POST dentro del sandbox. Debe bloquearse.',
  },
  {
    scenarioId: 'replay-telecontrol-blocked',
    label: 'Telecontrol bloqueado',
    kind: 'blocked-telecontrol',
    runMode: 'gate-only',
    sourceMode: 'mock-memory',
    attemptedForbiddenOperations: ['TELECONTROL', 'SETPOINT_WRITE'],
    expectedOutcome: 'reject-packet',
    description:
      'Simula intento de telecontrol/setpoint. Debe bloquearse por seguridad operacional.',
  },
  {
    scenarioId: 'replay-cen-submit-blocked',
    label: 'CEN Submit bloqueado',
    kind: 'blocked-regulatory',
    runMode: 'gate-only',
    sourceMode: 'real-cen-blocked',
    attemptedForbiddenOperations: ['CEN_SUBMIT'],
    expectedOutcome: 'reject-packet',
    description:
      'Simula envío regulatorio real. Debe bloquearse completamente.',
  },
];

export const createPvMetricsSandboxGateReplayMockData =
  (): PVMetricsSandboxGateReplayScenario[] =>
    scenarioConfigs.map((config) => {
      const session = createPvMetricsControlledSandboxMockSessionBase({
        sourceMode: config.sourceMode,
        runMode: config.runMode,
        attemptedForbiddenOperations: config.attemptedForbiddenOperations,
      });

      const runResult = createPvMetricsControlledSandboxRunResult({
        session,
        attemptedForbiddenOperations: config.attemptedForbiddenOperations,
      });

      return {
        scenarioId: config.scenarioId,
        label: config.label,
        kind: config.kind,
        expectedOutcome: config.expectedOutcome,
        description: config.description,
        sessionId: session.sessionId,
        sourceMode: session.source.mode,
        sourceSafety: session.source.safety,
        overallStatus: runResult.overallStatus,
        overallDecision: runResult.overallDecision,
        blockedReasons: runResult.blockedReasons,
        warnings: runResult.warnings,
        humanReviewReasons: runResult.humanReviewReasons,
        internalText: runResult.internalSandboxText,
        clientText: runResult.clientSandboxText,
      };
    });

export const PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA =
  createPvMetricsSandboxGateReplayMockData();

export const PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY = {
  id: 'pvmetrics-sandbox-gate-replay-mock-summary',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-H — Controlled Read-Only Integration Sandbox',
  module: '1O-H.2A — Sandbox Gate Replay Mock Data',
  internalVersion: '0.1O-H.2A-sandbox-gate-replay-mock-data',
  totalScenarios: PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA.length,
  safePassCount: PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA.filter(
    (scenario) => scenario.kind === 'safe-pass',
  ).length,
  humanReviewCount: PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA.filter(
    (scenario) => scenario.kind === 'human-review',
  ).length,
  blockedCount: PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_DATA.filter(
    (scenario) => scenario.overallDecision === 'reject-packet',
  ).length,
  safetyBoundary:
    'Replay mock local. No crea UI, no modifica wizard, no conecta fuentes reales, no llama APIs, no usa credenciales, no ejecuta escritura externa, no habilita telecontrol, no modifica setpoints, no controla BESS y no controla inversores.',
  nextRecommendedModule:
    '1O-H.2B — Sandbox Gate Replay Visual Card',
} as const;
