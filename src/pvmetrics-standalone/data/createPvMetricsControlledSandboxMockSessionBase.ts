import {
  PVMetricsControlledSandboxChecklistItem,
  PVMetricsControlledSandboxEvent,
  PVMetricsControlledSandboxGate,
  PVMetricsControlledSandboxReplayStep,
  PVMetricsControlledSandboxRunMode,
  PVMetricsControlledSandboxSession,
  PVMetricsControlledSandboxSource,
  PVMetricsControlledSandboxSourceMode,
  PVMetricsControlledSandboxSourceSafety,
  PVMetricsControlledSandboxStatus,
} from '../types/pvmetrics-controlled-sandbox.types';
import {
  PVMetricsReadOnlyDataDomain,
  PVMetricsReadOnlyForbiddenOperation,
} from '../types/pvmetrics-readonly-data-contract.types';

type CreatePvMetricsControlledSandboxMockSessionBaseInput = {
  sourceMode?: PVMetricsControlledSandboxSourceMode;
  runMode?: PVMetricsControlledSandboxRunMode;
  attemptedForbiddenOperations?: PVMetricsReadOnlyForbiddenOperation[];
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_SANDBOX_SAFETY_BOUNDARY =
  'Controlled Sandbox mock, local y read-only. No crea sandbox real, no conecta SCADA, no lee medidores reales, no llama weather APIs, no envía información al CEN, no usa credenciales, no usa secrets, no usa backend, no usa localStorage, no ejecuta escritura externa, no habilita telecontrol, no modifica setpoints, no controla BESS y no controla inversores.';

export const PV_METRICS_CONTROLLED_SANDBOX_FORBIDDEN_OPERATIONS: PVMetricsReadOnlyForbiddenOperation[] =
  [
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'TELECONTROL',
    'SETPOINT_WRITE',
    'BESS_COMMAND',
    'INVERTER_COMMAND',
    'METER_COMMAND',
    'SCADA_ACK',
    'CEN_SUBMIT',
    'ERP_WRITE',
    'BILLING',
    'WORK_ORDER_CREATE',
  ];

const createSourceSafety = (
  mode: PVMetricsControlledSandboxSourceMode,
): PVMetricsControlledSandboxSourceSafety => {
  if (mode === 'mock-memory') return 'allowed-mock';
  if (mode === 'static-fixture') return 'allowed-static';
  if (mode === 'manual-json-future') return 'future-review-required';
  if (mode === 'real-scada-blocked') return 'blocked-telecontrol-risk';
  if (mode === 'real-api-blocked') return 'blocked-credential-risk';

  return 'blocked-real-source';
};

const createSourceDomains = (
  mode: PVMetricsControlledSandboxSourceMode,
): PVMetricsReadOnlyDataDomain[] => {
  if (mode === 'real-scada-blocked') return ['scada', 'operational-events'];
  if (mode === 'real-meter-blocked') return ['meter', 'forecast-accuracy'];
  if (mode === 'real-cen-blocked') return ['cen-compliance'];
  if (mode === 'real-erp-blocked') return ['commercial-impact'];

  return ['data-quality', 'forecast', 'executive-intelligence'];
};

export const createPvMetricsControlledSandboxMockSource = (
  mode: PVMetricsControlledSandboxSourceMode,
): PVMetricsControlledSandboxSource => {
  const safety = createSourceSafety(mode);
  const blocked = safety.startsWith('blocked');

  return {
    sourceId: `sandbox-source-${mode}`,
    label: `Controlled Sandbox Source — ${mode}`,
    mode,
    safety,
    domains: createSourceDomains(mode),
    isRealSource: false,
    isNetworkEnabled: false,
    requiresCredential: false,
    description: blocked
      ? 'Fuente real bloqueada conceptualmente. No se habilita red, credenciales ni lectura externa.'
      : 'Fuente mock/local permitida para sesión de sandbox controlado.',
    blockedReason: blocked
      ? 'Modo bloqueado por política read-only, anti-credenciales, anti-write o anti-telecontrol.'
      : undefined,
  };
};

export const createPvMetricsControlledSandboxMandatoryGates =
  (): PVMetricsControlledSandboxGate[] => [
    {
      gateId: 'read-only-data-contract',
      label: 'Read-Only Data Contract',
      required: true,
      description:
        'Valida estructura read-only, sourceId, timestamp, unidad, dominio y separación FV/BESS.',
      decisionIfFailed: 'reject-packet',
    },
    {
      gateId: 'source-freshness-quality',
      label: 'Source Freshness & Data Quality',
      required: true,
      description:
        'Evalúa freshness, calidad de datos, warnings, bloqueos y revisión humana.',
      decisionIfFailed: 'block-automatic-use',
    },
    {
      gateId: 'future-connector-registry',
      label: 'Future Connector Registry',
      required: true,
      description:
        'Valida que la fuente exista como mock, contract-only o bloqueada dentro del registro conceptual.',
      decisionIfFailed: 'reject-packet',
    },
    {
      gateId: 'human-review',
      label: 'Human Review',
      required: true,
      description:
        'Fuerza revisión humana si aparece riesgo, consentimiento pendiente o fuente futura no aprobada.',
      decisionIfFailed: 'require-human-review',
    },
    {
      gateId: 'anti-write',
      label: 'Anti-Write Policy',
      required: true,
      description:
        'Bloquea POST, PUT, PATCH, DELETE, ERP write, billing, CEN submit y creación/cierre de órdenes.',
      decisionIfFailed: 'reject-packet',
    },
    {
      gateId: 'anti-telecontrol',
      label: 'Anti-Telecontrol Policy',
      required: true,
      description:
        'Bloquea telecontrol, setpoints, comandos BESS, comandos inversores, comandos de medidor y SCADA ACK.',
      decisionIfFailed: 'reject-packet',
    },
    {
      gateId: 'anti-credential',
      label: 'Anti-Credential Policy',
      required: true,
      description:
        'Bloquea credenciales, secrets, tokens, scopes de escritura y permisos administrativos.',
      decisionIfFailed: 'reject-packet',
    },
  ];

const createChecklist = (
  source: PVMetricsControlledSandboxSource,
  attemptedForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[],
): PVMetricsControlledSandboxChecklistItem[] => {
  const hasForbiddenOps = attemptedForbiddenOperations.length > 0;
  const blocked = source.safety.startsWith('blocked');
  const futureReview = source.safety === 'future-review-required';

  return [
    {
      itemId: 'activation-source-mode',
      label: 'Fuente mock/local permitida',
      category: 'activation',
      required: true,
      status: blocked
        ? 'blocked'
        : futureReview
          ? 'pending-human-review'
          : 'passed',
      description:
        'La fuente debe ser mock-memory o static-fixture para uso automático del sandbox.',
    },
    {
      itemId: 'security-no-credentials',
      label: 'Sin credenciales',
      category: 'security',
      required: true,
      status: 'passed',
      description:
        'La sesión base no requiere ni almacena credenciales, tokens o secrets.',
    },
    {
      itemId: 'anti-write-no-forbidden-ops',
      label: 'Sin operaciones de escritura',
      category: 'anti-write',
      required: true,
      status: hasForbiddenOps ? 'blocked' : 'passed',
      description:
        'POST/PUT/PATCH/DELETE y operaciones mutativas deben permanecer bloqueadas.',
    },
    {
      itemId: 'anti-telecontrol-no-commands',
      label: 'Sin telecontrol ni comandos',
      category: 'anti-telecontrol',
      required: true,
      status: attemptedForbiddenOperations.some((operation) =>
        [
          'TELECONTROL',
          'SETPOINT_WRITE',
          'BESS_COMMAND',
          'INVERTER_COMMAND',
          'METER_COMMAND',
          'SCADA_ACK',
        ].includes(operation),
      )
        ? 'blocked'
        : 'passed',
      description:
        'Telecontrol, setpoints, BESS, inversores, medidores y SCADA ACK deben permanecer bloqueados.',
    },
    {
      itemId: 'anti-mix-pvmetrics-only',
      label: 'Sin mezcla con otros proyectos ORBI',
      category: 'anti-mix',
      required: true,
      status: 'passed',
      description:
        'El sandbox pertenece exclusivamente a ORBI PVMetrics IA.',
    },
  ];
};

const createReplaySteps = (
  source: PVMetricsControlledSandboxSource,
): PVMetricsControlledSandboxReplayStep[] => [
  {
    stepId: 'step-01-source-load',
    order: 1,
    label: 'Cargar fuente mock',
    sourceId: source.sourceId,
    gateId: 'read-only-data-contract',
    expectedStatus: source.safety.startsWith('blocked') ? 'blocked' : 'passed',
    expectedDecision: source.safety.startsWith('blocked')
      ? 'reject-packet'
      : 'allow-mock-use',
    description:
      'Carga conceptual de fuente local sin red, sin credenciales y sin persistencia.',
  },
  {
    stepId: 'step-02-quality-gate',
    order: 2,
    label: 'Ejecutar gate de freshness/calidad',
    sourceId: source.sourceId,
    gateId: 'source-freshness-quality',
    expectedStatus:
      source.safety === 'future-review-required'
        ? 'human-review-required'
        : source.safety.startsWith('blocked')
          ? 'blocked'
          : 'passed',
    expectedDecision:
      source.safety === 'future-review-required'
        ? 'require-human-review'
        : source.safety.startsWith('blocked')
          ? 'reject-packet'
          : 'allow-mock-use',
    description:
      'Simula decisión de gate sin consumir datos reales.',
  },
];

const createEvents = (
  source: PVMetricsControlledSandboxSource,
): PVMetricsControlledSandboxEvent[] => {
  const generatedAtLabel = getGeneratedAtLabel();

  return [
    {
      eventId: 'event-session-created',
      eventType: 'session-created',
      generatedAtLabel,
      title: 'Sesión sandbox creada',
      message:
        'Sesión mock creada en memoria local, sin red, sin credenciales y sin persistencia.',
      severity: 'info',
    },
    {
      eventId: 'event-source-loaded',
      eventType: 'source-loaded',
      generatedAtLabel,
      title: 'Fuente evaluada',
      message: `${source.label} evaluada con safety=${source.safety}.`,
      severity: source.safety.startsWith('blocked') ? 'blocking' : 'info',
    },
  ];
};

const resolveSessionStatus = (
  source: PVMetricsControlledSandboxSource,
  attemptedForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[],
): PVMetricsControlledSandboxStatus => {
  if (source.safety.startsWith('blocked')) return 'blocked';
  if (attemptedForbiddenOperations.length > 0) return 'blocked';
  if (source.safety === 'future-review-required') return 'gate-replay-ready';
  return 'mock-session-ready';
};

export const createPvMetricsControlledSandboxMockSessionBase = ({
  sourceMode = 'mock-memory',
  runMode = 'mock-replay',
  attemptedForbiddenOperations = [],
}: CreatePvMetricsControlledSandboxMockSessionBaseInput = {}): PVMetricsControlledSandboxSession => {
  const source = createPvMetricsControlledSandboxMockSource(sourceMode);

  return {
    sessionId: `controlled-sandbox-session-base-${sourceMode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    status: resolveSessionStatus(source, attemptedForbiddenOperations),
    runMode,
    source,
    gates: createPvMetricsControlledSandboxMandatoryGates(),
    checklist: createChecklist(source, attemptedForbiddenOperations),
    replaySteps: createReplaySteps(source),
    events: createEvents(source),
    attemptedForbiddenOperations,
    safetyBoundary: PV_METRICS_CONTROLLED_SANDBOX_SAFETY_BOUNDARY,
  };
};
