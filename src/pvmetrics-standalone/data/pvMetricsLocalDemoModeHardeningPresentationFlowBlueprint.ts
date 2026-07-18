const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_LOCAL_DEMO_MODE_HARDENING_PRESENTATION_FLOW_BLUEPRINT = {
  id: 'pvmetrics-local-demo-mode-hardening-presentation-flow-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-J — Local Demo Mode Hardening & Presentation Flow',
  module: '1O-J.0 — Local Demo Mode Hardening & Presentation Flow Blueprint',
  internalVersion:
    '0.1O-J.0-local-demo-mode-hardening-presentation-flow-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_RUNTIME_DEMO_MODE',
  blueprintStatusLabel:
    'LOCAL DEMO MODE HARDENING — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Preparar una arquitectura conceptual para endurecer el futuro modo demo local y ordenar el flujo de presentación de ORBI PVMetrics IA, sin crear toggles reales, sin persistencia, sin backend, sin APIs y sin integraciones operacionales.',

  demoAudienceModes: [
    {
      id: 'audience-executive',
      label: 'Executive Demo',
      description:
        'Flujo orientado a valor, readiness, seguridad, evidencia piloto y narrativa de negocio.',
      allowedFocus: [
        'Resumen ejecutivo',
        'Evidencia piloto',
        'Readiness local',
        'Safety boundaries',
        'Valor comercial conceptual',
      ],
      blockedFocus: [
        'Datos reales',
        'Promesas de conexión operativa',
        'Resultados oficiales',
        'Despacho real',
      ],
    },
    {
      id: 'audience-technical',
      label: 'Technical Demo',
      description:
        'Flujo orientado a arquitectura read-only, gates, sandbox, QA y trazabilidad.',
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
      id: 'audience-internal-qa',
      label: 'Internal QA Demo',
      description:
        'Flujo orientado a validación interna, anti-mix, módulos cerrados y límites de seguridad.',
      allowedFocus: [
        'Build limpio',
        'TypeScript limpio',
        'Checklists',
        'Closure snapshots',
        'Riesgos bloqueados',
      ],
      blockedFocus: [
        'Activación de conectores reales',
        'Persistencia automática',
        'Correos automáticos',
        'PDF real',
      ],
    },
  ],

  demoSafetyLocks: [
    {
      id: 'lock-no-real-data',
      label: 'No Real Data Lock',
      enforced: true,
      description:
        'La demo debe usar solo mock data, fixtures locales o datos sanitizados futuros aprobados.',
    },
    {
      id: 'lock-no-network',
      label: 'No Network Lock',
      enforced: true,
      description:
        'La demo no debe llamar APIs, backend, SCADA, medidores, servicios climáticos ni CEN.',
    },
    {
      id: 'lock-no-persistence',
      label: 'No Persistence Lock',
      enforced: true,
      description:
        'La demo no debe usar localStorage, base de datos, sesión persistente ni almacenamiento externo.',
    },
    {
      id: 'lock-no-mutation',
      label: 'No Mutation Lock',
      enforced: true,
      description:
        'La demo no debe ejecutar POST/PUT/PATCH/DELETE reales ni escribir en sistemas externos.',
    },
    {
      id: 'lock-no-operational-control',
      label: 'No Operational Control Lock',
      enforced: true,
      description:
        'La demo no debe habilitar telecontrol, setpoints, BESS commands, inverter commands ni SCADA ACK.',
    },
  ],

  presentationStages: [
    {
      id: 'stage-01-context',
      label: 'Contexto y alcance',
      order: 1,
      objective:
        'Explicar que ORBI PVMetrics IA es una app independiente local y read-only.',
      safetyReminder:
        'Aclarar desde el inicio que no existe conexión real ni datos oficiales.',
    },
    {
      id: 'stage-02-product-readiness',
      label: 'Product Readiness',
      order: 2,
      objective:
        'Mostrar versión estable, manifest, QA y módulos cerrados.',
      safetyReminder:
        'No presentar resultados como certificación externa u oficial.',
    },
    {
      id: 'stage-03-controlled-sandbox',
      label: 'Controlled Sandbox',
      order: 3,
      objective:
        'Mostrar gates, replay mock, escenarios seguros, revisión humana y bloqueos.',
      safetyReminder:
        'Repetir que el sandbox es conceptual, local y no operacional.',
    },
    {
      id: 'stage-04-pilot-evidence',
      label: 'Pilot Evidence Pack',
      order: 4,
      objective:
        'Mostrar narrativa demo cliente, evidencia visible y textos copiables.',
      safetyReminder:
        'Aclarar que no hay PDF real, correo real ni backend.',
    },
    {
      id: 'stage-05-next-steps',
      label: 'Próximos pasos',
      order: 5,
      objective:
        'Explicar qué se requeriría para un piloto futuro seguro y aprobado.',
      safetyReminder:
        'Toda integración real futura requiere consentimiento, contrato read-only y revisión humana.',
    },
  ],

  safeDemoScript: [
    'Esta demo es local, conceptual y read-only.',
    'Los datos mostrados son mock o estructuras locales del prototipo.',
    'El sistema no está conectado a SCADA, medidores, CEN, clima, backend ni correo.',
    'El sandbox demuestra cómo se bloquearían riesgos antes de cualquier piloto real.',
    'El objetivo de esta etapa es evaluar valor, narrativa, seguridad y readiness técnico.',
    'Cualquier integración real futura requerirá aprobación formal, revisión humana y contrato read-only.',
  ],

  operatorNotes: [
    'No prometer integración real durante la demo.',
    'No afirmar que los valores mock representan producción real.',
    'No decir que existe envío regulatorio automático.',
    'No ofrecer telecontrol, setpoints ni comandos como capacidades actuales.',
    'No mostrar ni mencionar credenciales, tokens o secrets.',
    'Usar siempre la frase: local, mock, read-only y seguro.',
  ],

  clientNarrativeGuardrails: [
    'Hablar de preparación piloto, no de operación productiva.',
    'Hablar de evidencia conceptual, no de reporte oficial.',
    'Hablar de readiness, no de certificación regulatoria.',
    'Hablar de potencial integración futura, no de conexión activa.',
    'Hablar de revisión humana obligatoria antes de cualquier conexión real.',
  ],

  forbiddenCapabilities: [
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
  ],

  exitCriteria: [
    'Blueprint creado.',
    'Demo audience modes declarados.',
    'Safety locks declarados.',
    'Presentation stages declarados.',
    'Safe demo script declarado.',
    'Operator notes declaradas.',
    'Client narrative guardrails declaradas.',
    'Forbidden capabilities declaradas.',
    'No se crea UI nueva.',
    'No se modifica wizard.',
    'No se agrega localStorage.',
    'No se agregan conectores reales.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint no crea modo demo real, no crea UI, no modifica wizard, no usa localStorage, no exporta PDF, no envía correos, no usa backend, no llama APIs, no conecta SCADA, no lee medidores, no envía CEN, no usa credenciales/tokens/secrets, no ejecuta escritura real y no habilita telecontrol, setpoints, BESS commands ni inverter commands.',

  nextRoadmap: [
    '1O-J.1A — Local Demo Mode Types',
    '1O-J.1B — Local Demo Mode Mock State',
    '1O-J.2A — Presentation Flow Visual Card',
    '1O-J.2B — Demo Safety Locks Visual Card',
    '1O-J.3A — Local Demo Mode Wizard Integration',
    '1O-J.4A — Local Demo Mode Final QA & Closure',
  ],

  nextRecommendedModule: '1O-J.1A — Local Demo Mode Types',
} as const;
