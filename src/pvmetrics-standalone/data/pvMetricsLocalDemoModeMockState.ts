import {
  PVMetricsClientNarrativeGuardrail,
  PVMetricsDemoAudienceMode,
  PVMetricsDemoExitCriterion,
  PVMetricsDemoForbiddenCapability,
  PVMetricsDemoSafetyLock,
  PVMetricsLocalDemoModeState,
  PVMetricsOperatorNote,
  PVMetricsPresentationFlowPack,
  PVMetricsPresentationStage,
  PVMetricsSafeDemoScriptLine,
} from '../types/pvmetrics-local-demo-mode.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-J.1B-local-demo-mode-mock-state';

export const PV_METRICS_DEMO_AUDIENCE_MODES_MOCK: PVMetricsDemoAudienceMode[] =
  [
    {
      audienceId: 'executive-demo',
      label: 'Executive Demo',
      description:
        'Presentación orientada a valor, evidencia piloto, seguridad y potencial comercial.',
      allowedFocus: [
        'Resumen ejecutivo',
        'Readiness local',
        'Evidencia piloto',
        'Valor conceptual',
        'Safety boundaries',
      ],
      blockedFocus: [
        'Datos reales',
        'Promesas de operación productiva',
        'Resultados oficiales',
        'Conexiones activas',
      ],
    },
    {
      audienceId: 'technical-demo',
      label: 'Technical Demo',
      description:
        'Presentación orientada a arquitectura, QA, sandbox, gates y trazabilidad.',
      allowedFocus: [
        'Version Registry',
        'QA Checklist',
        'Controlled Sandbox',
        'Replay mock',
        'No Real Integration Statement',
      ],
      blockedFocus: [
        'SCADA real',
        'Medidores reales',
        'Credenciales',
        'Setpoints',
        'Comandos BESS/inversores',
      ],
    },
    {
      audienceId: 'internal-qa-demo',
      label: 'Internal QA Demo',
      description:
        'Presentación orientada a cierre de módulos, anti-mix, seguridad y auditoría interna.',
      allowedFocus: [
        'Build limpio',
        'TypeScript limpio',
        'Closure snapshots',
        'Checklists',
        'Riesgos bloqueados',
      ],
      blockedFocus: [
        'Activación de conectores reales',
        'Persistencia automática',
        'Correos automáticos',
        'PDF real',
      ],
    },
  ];

export const PV_METRICS_DEMO_SAFETY_LOCKS_MOCK: PVMetricsDemoSafetyLock[] = [
  {
    lockId: 'no-real-data',
    label: 'No Real Data Lock',
    status: 'locked',
    enforced: true,
    description:
      'La demo usa exclusivamente mock data local o estructuras conceptuales.',
  },
  {
    lockId: 'no-network',
    label: 'No Network Lock',
    status: 'locked',
    enforced: true,
    description:
      'La demo no llama APIs, backend, SCADA, medidores, CEN ni servicios externos.',
  },
  {
    lockId: 'no-persistence',
    label: 'No Persistence Lock',
    status: 'locked',
    enforced: true,
    description:
      'La demo no usa localStorage, base de datos ni almacenamiento persistente.',
  },
  {
    lockId: 'no-mutation',
    label: 'No Mutation Lock',
    status: 'locked',
    enforced: true,
    description:
      'La demo no ejecuta POST/PUT/PATCH/DELETE reales ni escribe en sistemas externos.',
  },
  {
    lockId: 'no-operational-control',
    label: 'No Operational Control Lock',
    status: 'locked',
    enforced: true,
    description:
      'La demo no habilita telecontrol, setpoints, BESS commands ni inverter commands.',
  },
  {
    lockId: 'no-secrets',
    label: 'No Secrets Lock',
    status: 'locked',
    enforced: true,
    description:
      'La demo no usa credenciales, tokens, secrets ni variables productivas.',
  },
];

export const PV_METRICS_PRESENTATION_STAGES_MOCK: PVMetricsPresentationStage[] =
  [
    {
      stageId: 'context-and-scope',
      order: 1,
      label: 'Contexto y alcance',
      objective:
        'Explicar que ORBI PVMetrics IA es una app independiente local, mock y read-only.',
      safetyReminder:
        'Aclarar desde el inicio que no existe conexión real ni datos oficiales.',
      audienceModes: ['executive-demo', 'technical-demo', 'internal-qa-demo'],
    },
    {
      stageId: 'product-readiness',
      order: 2,
      label: 'Product Readiness',
      objective:
        'Mostrar versión estable, manifest, QA checklist y módulos cerrados.',
      safetyReminder:
        'No presentar la demo como certificación externa ni reporte oficial.',
      audienceModes: ['executive-demo', 'technical-demo', 'internal-qa-demo'],
    },
    {
      stageId: 'controlled-sandbox',
      order: 3,
      label: 'Controlled Sandbox',
      objective:
        'Mostrar gates, replay mock, escenarios seguros, revisión humana y bloqueos.',
      safetyReminder:
        'Repetir que el sandbox es conceptual, local y no operacional.',
      audienceModes: ['technical-demo', 'internal-qa-demo'],
    },
    {
      stageId: 'pilot-evidence',
      order: 4,
      label: 'Pilot Evidence Pack',
      objective:
        'Mostrar narrativa demo cliente, evidencia visible y textos copiables.',
      safetyReminder:
        'Aclarar que no hay PDF real, correo real, backend ni integración externa.',
      audienceModes: ['executive-demo', 'technical-demo'],
    },
    {
      stageId: 'next-steps',
      order: 5,
      label: 'Próximos pasos',
      objective:
        'Explicar qué se requeriría para un piloto futuro seguro y aprobado.',
      safetyReminder:
        'Toda integración real futura requiere consentimiento, contrato read-only y revisión humana.',
      audienceModes: ['executive-demo', 'technical-demo'],
    },
  ];

export const PV_METRICS_SAFE_DEMO_SCRIPT_MOCK: PVMetricsSafeDemoScriptLine[] = [
  {
    lineId: 'script-01-local-readonly',
    order: 1,
    text: 'Esta demo es local, conceptual y read-only.',
    required: true,
  },
  {
    lineId: 'script-02-mock-data',
    order: 2,
    text: 'Los datos mostrados son mock o estructuras locales del prototipo.',
    required: true,
  },
  {
    lineId: 'script-03-no-real-systems',
    order: 3,
    text: 'El sistema no está conectado a SCADA, medidores, CEN, clima, backend ni correo.',
    required: true,
  },
  {
    lineId: 'script-04-sandbox-blocks-risk',
    order: 4,
    text: 'El sandbox demuestra cómo se bloquearían riesgos antes de cualquier piloto real.',
    required: true,
  },
  {
    lineId: 'script-05-future-approval',
    order: 5,
    text: 'Cualquier integración real futura requerirá aprobación formal, revisión humana y contrato read-only.',
    required: true,
  },
];

export const PV_METRICS_OPERATOR_NOTES_MOCK: PVMetricsOperatorNote[] = [
  {
    noteId: 'note-no-promises',
    label: 'No prometer integración real',
    severity: 'critical',
    instruction:
      'No afirmar que existen conectores reales, producción activa o datos oficiales.',
  },
  {
    noteId: 'note-use-safe-language',
    label: 'Usar lenguaje seguro',
    severity: 'warning',
    instruction:
      'Repetir local, mock, read-only y seguro durante la presentación.',
  },
  {
    noteId: 'note-no-credentials',
    label: 'No mostrar credenciales',
    severity: 'critical',
    instruction:
      'No mencionar ni mostrar tokens, API keys, secretos o variables productivas.',
  },
];

export const PV_METRICS_CLIENT_NARRATIVE_GUARDRAILS_MOCK: PVMetricsClientNarrativeGuardrail[] =
  [
    {
      guardrailId: 'guardrail-readiness-not-production',
      label: 'Readiness, no producción',
      preferredLanguage:
        'La app está preparada para una conversación piloto segura.',
      forbiddenLanguage:
        'La app ya está conectada a producción o lista para operar plantas reales.',
    },
    {
      guardrailId: 'guardrail-conceptual-not-official',
      label: 'Conceptual, no oficial',
      preferredLanguage:
        'Los reportes son conceptuales y sirven para validar enfoque.',
      forbiddenLanguage:
        'Los reportes son oficiales, regulatorios o comerciales definitivos.',
    },
    {
      guardrailId: 'guardrail-future-integration',
      label: 'Integración futura aprobada',
      preferredLanguage:
        'Una integración real futura requiere consentimiento y revisión humana.',
      forbiddenLanguage:
        'Podemos conectar de inmediato SCADA, medidores o CEN.',
    },
  ];

export const PV_METRICS_DEMO_FORBIDDEN_CAPABILITIES_MOCK: PVMetricsDemoForbiddenCapability[] =
  [
    'PDF_EXPORT_REAL',
    'EMAIL_SEND_REAL',
    'BACKEND',
    'REAL_CONNECTOR',
    'SCADA_CONNECTION',
    'METER_READING',
    'WEATHER_API',
    'CEN_SUBMIT',
    'CREDENTIALS',
    'TOKENS',
    'SECRETS',
    'LOCAL_STORAGE',
    'POST_PUT_PATCH_DELETE',
    'TELECONTROL',
    'SETPOINTS',
    'BESS_COMMANDS',
    'INVERTER_COMMANDS',
    'ERP_WRITE',
    'BILLING',
    'WORK_ORDER_CREATE',
  ];

export const PV_METRICS_DEMO_EXIT_CRITERIA_MOCK: PVMetricsDemoExitCriterion[] =
  [
    {
      criterionId: 'exit-blueprint-ready',
      label: 'Blueprint y tipos listos',
      required: true,
      passed: true,
      description:
        'El modo demo cuenta con blueprint, tipos y mock state local.',
    },
    {
      criterionId: 'exit-safety-locks-declared',
      label: 'Safety locks declarados',
      required: true,
      passed: true,
      description:
        'Los locks de datos reales, red, persistencia, mutación, operación y secrets están activos conceptualmente.',
    },
    {
      criterionId: 'exit-no-runtime-toggle',
      label: 'Sin toggle runtime real',
      required: true,
      passed: true,
      description:
        'Este módulo no crea un interruptor real de demo mode.',
    },
    {
      criterionId: 'exit-no-localstorage',
      label: 'Sin localStorage',
      required: true,
      passed: true,
      description:
        'El estado demo es constante local y no persistente.',
    },
  ];

export const PV_METRICS_LOCAL_DEMO_MODE_STATE_MOCK: PVMetricsLocalDemoModeState =
  {
    stateId: 'pvmetrics-local-demo-mode-state-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    status: 'mock-state-ready',
    activeAudienceMode: 'executive-demo',
    isRuntimeToggleEnabled: false,
    isPersistent: false,
    isNetworkEnabled: false,
    safetyLocks: PV_METRICS_DEMO_SAFETY_LOCKS_MOCK,
    forbiddenCapabilities: PV_METRICS_DEMO_FORBIDDEN_CAPABILITIES_MOCK,
    safetyBoundary:
      'Local Demo Mode mock state. No toggle real, no localStorage, no red, no backend, no conectores reales, no SCADA, no medidores, no CEN, no credenciales, no escritura real, no telecontrol, no setpoints, no BESS commands y no inverter commands.',
  };

export const PV_METRICS_PRESENTATION_FLOW_PACK_MOCK: PVMetricsPresentationFlowPack =
  {
    packId: 'pvmetrics-presentation-flow-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-J — Local Demo Mode Hardening & Presentation Flow',
    module: '1O-J.1B — Local Demo Mode Mock State',
    internalVersion,
    status: 'mock-state-ready',
    audienceModes: PV_METRICS_DEMO_AUDIENCE_MODES_MOCK,
    presentationStages: PV_METRICS_PRESENTATION_STAGES_MOCK,
    safeDemoScript: PV_METRICS_SAFE_DEMO_SCRIPT_MOCK,
    operatorNotes: PV_METRICS_OPERATOR_NOTES_MOCK,
    clientNarrativeGuardrails: PV_METRICS_CLIENT_NARRATIVE_GUARDRAILS_MOCK,
    exitCriteria: PV_METRICS_DEMO_EXIT_CRITERIA_MOCK,
    demoModeState: PV_METRICS_LOCAL_DEMO_MODE_STATE_MOCK,
    nextRecommendedModule: '1O-J.2A — Presentation Flow Visual Card',
  };
