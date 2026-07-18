const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_READ_ONLY_CONNECTOR_READINESS_BLUEPRINT = {
  id: 'pvmetrics-controlled-read-only-connector-readiness-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-Q — Controlled Read-Only Connector Readiness',
  module: '1O-Q.0 — Controlled Read-Only Connector Readiness Blueprint',
  internalVersion:
    '0.1O-Q.0-controlled-read-only-connector-readiness-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_CONNECTORS',
  blueprintStatusLabel:
    'READ-ONLY CONNECTOR READINESS — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Preparar una estructura conceptual para evaluar readiness futura de conectores solo lectura en ORBI PVMetrics IA, sin crear conectores reales, sin usar credenciales, sin leer sistemas productivos y sin ejecutar llamadas externas.',

  connectorReadinessPurpose: [
    'Definir condiciones mínimas antes de considerar conectores read-only futuros.',
    'Separar claramente blueprint, sandbox, piloto y producción.',
    'Bloquear cualquier integración real prematura.',
    'Declarar límites de credenciales, secrets, APIs, SCADA, medidores y CEN.',
    'Establecer gates de contrato de datos, sandbox, QA y aprobación humana.',
  ],

  allowedConnectorReadinessItems: [
    'Revisión conceptual de categorías de conectores candidatos.',
    'Definición de contrato de datos esperado sin endpoints reales.',
    'Checklist de seguridad para integración futura read-only.',
    'Evaluación de sandbox futuro sin credenciales reales.',
    'Mapa conceptual de datos permitidos y bloqueados.',
    'Registro de riesgos previo a cualquier implementación real.',
  ],

  blockedConnectorReadinessItems: [
    'Implementar conectores SCADA reales.',
    'Implementar lectura de medidores reales.',
    'Guardar credenciales, tokens o secrets.',
    'Llamar APIs reales.',
    'Crear backend productivo o base de datos real.',
    'Ejecutar POST/PUT/PATCH/DELETE real.',
    'Enviar CEN o reportes regulatorios reales.',
    'Ejecutar telecontrol, setpoints, comandos BESS, inversores o SCADA ACK.',
  ],

  readOnlyConnectorPrinciples: [
    {
      id: 'principle-no-write',
      label: 'Sin escritura',
      description:
        'Todo conector futuro debe comenzar como read-only y sin capacidad de mutar sistemas.',
      mandatory: true,
    },
    {
      id: 'principle-no-secrets-in-client',
      label: 'Sin secrets en cliente',
      description:
        'Ninguna credencial, token o secret debe quedar embebida en frontend, README, mocks o localStorage.',
      mandatory: true,
    },
    {
      id: 'principle-sandbox-first',
      label: 'Sandbox primero',
      description:
        'Cualquier prueba futura debe pasar por sandbox aislado antes de hablar de piloto.',
      mandatory: true,
    },
    {
      id: 'principle-data-contract-first',
      label: 'Contrato de datos primero',
      description:
        'Antes de un conector real debe existir contrato de datos aprobado y sanitizado.',
      mandatory: true,
    },
  ],

  connectorCandidateCategories: [
    {
      id: 'candidate-scada-read-only',
      label: 'SCADA read-only futuro',
      status: 'blocked-until-approved',
      description:
        'Categoría conceptual para lectura futura de SCADA, sin endpoints, sin credenciales y sin llamadas reales.',
    },
    {
      id: 'candidate-meter-read-only',
      label: 'Medidores read-only futuros',
      status: 'blocked-until-approved',
      description:
        'Categoría conceptual para lectura futura de medidores, condicionada a contrato, sandbox y QA.',
    },
    {
      id: 'candidate-weather-read-only',
      label: 'Weather data read-only futuro',
      status: 'blocked-until-approved',
      description:
        'Categoría conceptual para datos meteorológicos externos, sin API key ni request real.',
    },
    {
      id: 'candidate-file-import-sanitized',
      label: 'Importación sanitizada',
      status: 'concept-only',
      description:
        'Categoría conceptual para revisar muestras estáticas aprobadas y sanitizadas, sin backend ni persistencia real.',
    },
  ],

  credentialSecretBoundaries: [
    {
      id: 'boundary-no-client-secrets',
      label: 'No secrets en cliente',
      allowed: false,
      description:
        'No se permiten credenciales, tokens, API keys, passwords ni secrets dentro de frontend o mocks.',
    },
    {
      id: 'boundary-no-env-production',
      label: 'No variables productivas',
      allowed: false,
      description:
        'No se deben agregar variables de entorno productivas en este bloque.',
    },
    {
      id: 'boundary-placeholder-only',
      label: 'Placeholders conceptuales',
      allowed: true,
      description:
        'Solo se permiten nombres conceptuales sin valores reales para documentar necesidades futuras.',
    },
  ],

  dataContractReviewGates: [
    {
      id: 'gate-data-fields',
      label: 'Campos de datos esperados',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Definir campos esperados sin conectar endpoints ni leer sistemas reales.',
    },
    {
      id: 'gate-data-sanitization',
      label: 'Sanitización de datos',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Confirmar que cualquier muestra futura esté anonimizada, aprobada y sin datos sensibles.',
    },
    {
      id: 'gate-data-ownership',
      label: 'Propiedad y autorización',
      required: true,
      reviewerRole: 'client-owner',
      description:
        'Confirmar autorización cliente antes de cualquier dato real futuro.',
    },
  ],

  sandboxReadinessGates: [
    {
      id: 'sandbox-gate-isolation',
      label: 'Aislamiento de sandbox',
      required: true,
      description:
        'El sandbox futuro debe estar separado de producción y sin capacidad de escritura.',
    },
    {
      id: 'sandbox-gate-no-production-secrets',
      label: 'Sin secrets productivos',
      required: true,
      description:
        'El sandbox futuro no debe usar secrets productivos ni credenciales personales.',
    },
    {
      id: 'sandbox-gate-observability',
      label: 'Observabilidad segura',
      required: true,
      description:
        'Cualquier prueba futura debe permitir auditoría sin exponer datos sensibles.',
    },
  ],

  qaConnectorSafetyGates: [
    {
      id: 'qa-gate-no-write-methods',
      label: 'Sin métodos de escritura',
      required: true,
      description:
        'QA debe confirmar ausencia de POST/PUT/PATCH/DELETE real y comandos operacionales.',
    },
    {
      id: 'qa-gate-no-real-calls',
      label: 'Sin llamadas reales',
      required: true,
      description:
        'QA debe confirmar que este bloque no llama APIs, SCADA, medidores, CEN ni servicios reales.',
    },
    {
      id: 'qa-gate-no-secret-storage',
      label: 'Sin almacenamiento de secretos',
      required: true,
      description:
        'QA debe confirmar que no existe almacenamiento de credenciales, tokens, secrets o API keys.',
    },
  ],

  connectorRiskRegister: [
    {
      id: 'risk-premature-connector',
      label: 'Conector real prematuro',
      severity: 'critical',
      mitigation:
        'Bloquear implementación real hasta contrato, sandbox, QA y aprobación humana.',
    },
    {
      id: 'risk-secret-leak',
      label: 'Filtración de secrets',
      severity: 'critical',
      mitigation:
        'Prohibir secrets en cliente, mocks, README, localStorage y commits.',
    },
    {
      id: 'risk-write-capability',
      label: 'Capacidad de escritura accidental',
      severity: 'critical',
      mitigation:
        'Validar no-write y bloquear POST/PUT/PATCH/DELETE real.',
    },
    {
      id: 'risk-regulatory-misuse',
      label: 'Uso regulatorio indebido',
      severity: 'high',
      mitigation:
        'Declarar que no hay envío CEN ni reportes oficiales desde este bloque.',
    },
  ],

  connectorExitCriteria: [
    'Blueprint de connector readiness creado.',
    'Allowed Connector Readiness Items declarados.',
    'Blocked Connector Readiness Items declarados.',
    'Read-Only Connector Principles declarados.',
    'Connector Candidate Categories declaradas.',
    'Credential & Secret Boundaries declaradas.',
    'Data Contract Review Gates declarados.',
    'Sandbox Readiness Gates declarados.',
    'QA Connector Safety Gates declarados.',
    'Connector Risk Register declarado.',
    'Safety Boundary declarada.',
    'No se crean conectores reales.',
    'No se usan credenciales reales.',
    'No se usan tokens.',
    'No se usan secrets.',
    'No se lee SCADA real.',
    'No se leen medidores reales.',
    'No se llama API real.',
    'No se usa backend.',
    'No se usa base de datos.',
    'No se usa localStorage.',
    'No se ejecuta POST/PUT/PATCH/DELETE real.',
    'No se ejecuta telecontrol.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint solo define readiness conceptual de conectores read-only. No crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no ejecuta POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores y no habilita producción real.',

  nextRoadmap: [
    '1O-Q.1A — Read-Only Connector Readiness Types',
    '1O-Q.1B — Read-Only Connector Readiness Mock Data',
    '1O-Q.2A — Connector Readiness Visual Card',
    '1O-Q.2B — Connector Readiness Export Text Box',
    '1O-Q.3A — Connector Readiness Wizard Integration',
    '1O-Q.4A — Connector Readiness Final QA & Closure',
  ],

  nextRecommendedModule: '1O-Q.1A — Read-Only Connector Readiness Types',
} as const;
