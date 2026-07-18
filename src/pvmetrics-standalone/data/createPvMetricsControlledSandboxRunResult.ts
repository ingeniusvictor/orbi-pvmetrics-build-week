import {
  PVMetricsControlledSandboxGateResult,
  PVMetricsControlledSandboxRegistry,
  PVMetricsControlledSandboxRunResult,
  PVMetricsControlledSandboxSession,
} from '../types/pvmetrics-controlled-sandbox.types';
import { PVMetricsReadOnlyForbiddenOperation } from '../types/pvmetrics-readonly-data-contract.types';
import { PVMetricsSourceQualityGateDecision } from '../types/pvmetrics-source-freshness-quality-gate.types';
import {
  createPvMetricsControlledSandboxMandatoryGates,
  createPvMetricsControlledSandboxMockSessionBase,
  PV_METRICS_CONTROLLED_SANDBOX_FORBIDDEN_OPERATIONS,
  PV_METRICS_CONTROLLED_SANDBOX_SAFETY_BOUNDARY,
} from './createPvMetricsControlledSandboxMockSessionBase';

type CreatePvMetricsControlledSandboxRunResultInput = {
  session?: PVMetricsControlledSandboxSession;
  attemptedForbiddenOperations?: PVMetricsReadOnlyForbiddenOperation[];
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const telecontrolOperations: PVMetricsReadOnlyForbiddenOperation[] = [
  'TELECONTROL',
  'SETPOINT_WRITE',
  'BESS_COMMAND',
  'INVERTER_COMMAND',
  'METER_COMMAND',
  'SCADA_ACK',
];

const createGateResults = (
  session: PVMetricsControlledSandboxSession,
  attemptedForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[],
): PVMetricsControlledSandboxGateResult[] => {
  const sourceBlocked = session.source.safety.startsWith('blocked');
  const needsReview = session.source.safety === 'future-review-required';
  const hasForbiddenOps = attemptedForbiddenOperations.length > 0;
  const hasTelecontrolOps = attemptedForbiddenOperations.some((operation) =>
    telecontrolOperations.includes(operation),
  );

  return session.gates.map((gate) => {
    if (gate.gateId === 'anti-write' && hasForbiddenOps) {
      return {
        gateId: gate.gateId,
        status: 'blocked',
        decision: 'reject-packet',
        passed: false,
        warnings: [],
        blockedReasons: [
          `Operaciones prohibidas detectadas: ${attemptedForbiddenOperations.join(', ')}`,
        ],
        humanReviewReasons: [],
        explanation:
          'Anti-Write Policy bloqueó la sesión por intento de operación mutativa.',
      };
    }

    if (gate.gateId === 'anti-telecontrol' && hasTelecontrolOps) {
      return {
        gateId: gate.gateId,
        status: 'blocked',
        decision: 'reject-packet',
        passed: false,
        warnings: [],
        blockedReasons: [
          'Operación de telecontrol, setpoint o comando operativo detectada.',
        ],
        humanReviewReasons: [],
        explanation:
          'Anti-Telecontrol Policy bloqueó la sesión por riesgo operacional.',
      };
    }

    if (sourceBlocked) {
      return {
        gateId: gate.gateId,
        status: 'blocked',
        decision: 'reject-packet',
        passed: false,
        warnings: [],
        blockedReasons: [
          session.source.blockedReason ??
            'Fuente bloqueada por política de sandbox controlado.',
        ],
        humanReviewReasons: [],
        explanation: `${gate.label} bloqueó la sesión porque la fuente no es mock/local segura.`,
      };
    }

    if (needsReview || gate.gateId === 'human-review') {
      return {
        gateId: gate.gateId,
        status: needsReview ? 'human-review-required' : 'passed',
        decision: needsReview ? 'require-human-review' : 'allow-mock-use',
        passed: !needsReview,
        warnings: needsReview
          ? ['Fuente futura requiere revisión humana antes de activarse.']
          : [],
        blockedReasons: [],
        humanReviewReasons: needsReview
          ? ['Modo manual-json-future no puede activarse automáticamente.']
          : [],
        explanation: needsReview
          ? `${gate.label} requiere revisión humana.`
          : `${gate.label} aprobado en modo mock read-only.`,
      };
    }

    return {
      gateId: gate.gateId,
      status: 'passed',
      decision: 'allow-mock-use',
      passed: true,
      warnings: [],
      blockedReasons: [],
      humanReviewReasons: [],
      explanation: `${gate.label} aprobado en modo mock read-only.`,
    };
  });
};

const resolveOverallDecision = (
  gateResults: PVMetricsControlledSandboxGateResult[],
): PVMetricsSourceQualityGateDecision => {
  if (gateResults.some((gate) => gate.decision === 'reject-packet')) {
    return 'reject-packet';
  }

  if (gateResults.some((gate) => gate.decision === 'require-human-review')) {
    return 'require-human-review';
  }

  if (gateResults.some((gate) => gate.decision === 'allow-with-warning')) {
    return 'allow-with-warning';
  }

  return 'allow-mock-use';
};

const buildInternalSandboxText = (
  session: PVMetricsControlledSandboxSession,
  gateResults: PVMetricsControlledSandboxGateResult[],
) =>
  [
    'ORBI PVMetrics IA — Controlled Sandbox Run Result',
    `Session ID: ${session.sessionId}`,
    `Generated: ${session.generatedAtLabel}`,
    `Status: ${session.status}`,
    `Run Mode: ${session.runMode}`,
    `Source: ${session.source.label}`,
    `Source Mode: ${session.source.mode}`,
    `Source Safety: ${session.source.safety}`,
    '',
    'Gate Results:',
    gateResults
      .map(
        (gate) =>
          `- ${gate.gateId}: ${gate.status} / ${gate.decision} — ${gate.explanation}`,
      )
      .join('\n'),
    '',
    'Checklist:',
    session.checklist
      .map((item) => `- [${item.status}] ${item.label}`)
      .join('\n'),
    '',
    'Safety Boundary:',
    session.safetyBoundary,
  ].join('\n');

const buildClientSandboxText = (
  session: PVMetricsControlledSandboxSession,
  gateResults: PVMetricsControlledSandboxGateResult[],
) =>
  [
    'Resumen conceptual de sandbox controlado ORBI PVMetrics IA',
    '',
    `Estado de sesión: ${session.status}.`,
    `Modo de ejecución: ${session.runMode}.`,
    `Fuente evaluada: ${session.source.label}.`,
    '',
    gateResults.some((gate) => gate.status === 'blocked')
      ? 'La sesión fue bloqueada por criterios de seguridad.'
      : gateResults.some((gate) => gate.status === 'human-review-required')
        ? 'La sesión requiere revisión humana antes de cualquier avance futuro.'
        : 'La sesión mock fue evaluada correctamente en modo local read-only.',
    '',
    'Este sandbox es conceptual, local y seguro. No conecta SCADA, no lee medidores, no llama APIs, no envía datos al CEN, no usa credenciales, no ejecuta escritura externa, no modifica setpoints, no controla BESS y no controla inversores.',
  ].join('\n');

export const createPvMetricsControlledSandboxRunResult = ({
  session,
  attemptedForbiddenOperations,
}: CreatePvMetricsControlledSandboxRunResultInput = {}): PVMetricsControlledSandboxRunResult => {
  const sandboxSession =
    session ?? createPvMetricsControlledSandboxMockSessionBase();

  const operations =
    attemptedForbiddenOperations ??
    sandboxSession.attemptedForbiddenOperations;

  const gateResults = createGateResults(sandboxSession, operations);
  const overallDecision = resolveOverallDecision(gateResults);

  return {
    runId: `controlled-sandbox-run-${sandboxSession.source.mode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    sessionId: sandboxSession.sessionId,
    overallStatus: sandboxSession.status,
    overallDecision,
    gateResults,
    blockedReasons: gateResults.flatMap((gate) => gate.blockedReasons),
    warnings: gateResults.flatMap((gate) => gate.warnings),
    humanReviewReasons: gateResults.flatMap(
      (gate) => gate.humanReviewReasons,
    ),
    internalSandboxText: buildInternalSandboxText(sandboxSession, gateResults),
    clientSandboxText: buildClientSandboxText(sandboxSession, gateResults),
    safetyBoundary: PV_METRICS_CONTROLLED_SANDBOX_SAFETY_BOUNDARY,
  };
};

export const PV_METRICS_CONTROLLED_SANDBOX_MOCK_REGISTRY: PVMetricsControlledSandboxRegistry =
  {
    registryId: 'pvmetrics-controlled-sandbox-mock-registry',
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-H — Controlled Read-Only Integration Sandbox',
    module: '1O-H.1A — Controlled Sandbox Types',
    internalVersion: '0.1O-H.1A-controlled-sandbox-types',
    status: 'mock-session-ready',
    allowedSourceModes: ['mock-memory', 'static-fixture'],
    blockedSourceModes: [
      'real-api-blocked',
      'real-scada-blocked',
      'real-meter-blocked',
      'real-cen-blocked',
      'real-erp-blocked',
    ],
    mandatoryGates: createPvMetricsControlledSandboxMandatoryGates(),
    globalForbiddenOperations: PV_METRICS_CONTROLLED_SANDBOX_FORBIDDEN_OPERATIONS,
    globalSafetyBoundaries: [
      'No sandbox real.',
      'No conectores reales.',
      'No SCADA real.',
      'No medidores reales.',
      'No weather API.',
      'No envío CEN real.',
      'No credenciales.',
      'No secrets.',
      'No backend.',
      'No localStorage.',
      'No POST/PUT/PATCH/DELETE real.',
      'No telecontrol.',
      'No setpoints.',
      'No comandos BESS.',
      'No comandos inversores.',
    ],
    nextRecommendedModule: '1O-H.2A — Sandbox Gate Replay Mock Data',
  };
