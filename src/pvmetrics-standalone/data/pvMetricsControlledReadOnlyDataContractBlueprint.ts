const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_BLUEPRINT = {
  id: 'pvmetrics-controlled-read-only-data-contract-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-R — Controlled Read-Only Data Contract',
  module: '1O-R.0 — Controlled Read-Only Data Contract Blueprint',
  internalVersion: '0.1O-R.0-controlled-read-only-data-contract-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_DATA',
  blueprintStatusLabel:
    'READ-ONLY DATA CONTRACT — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir una estructura conceptual de contrato de datos read-only para ORBI PVMetrics IA antes de cualquier conector futuro, sin datos reales, sin endpoints, sin credenciales, sin llamadas externas y sin impacto operacional.',

  dataContractPurpose: [
    'Definir qué dominios de datos serían necesarios para un piloto read-only futuro.',
    'Separar datos requeridos, opcionales y prohibidos antes de cualquier integración real.',
    'Documentar criterios de calidad, sanitización, propiedad y revisión de esquema.',
    'Bloquear datos sensibles, credenciales, secretos, rutas productivas y endpoints reales.',
    'Preparar una base conceptual para revisión técnica, QA, cliente y seguridad.',
  ],

  allowedDataContractItems: [
    'Definición conceptual de dominios de datos.',
    'Definición de campos esperados sin valores reales.',
    'Especificación de unidades, granularidad y etiquetas de ejemplo no productivas.',
    'Criterios de calidad de datos para revisión futura.',
    'Criterios de sanitización antes de cualquier uso de muestra real.',
    'Gates de aprobación humana antes de pasar a sandbox o piloto.',
  ],

  blockedDataContractItems: [
    'Incorporar datos reales de planta.',
    'Incorporar datos comerciales sensibles.',
    'Guardar credenciales, tokens, API keys, passwords o secrets.',
    'Definir endpoints reales de SCADA, medidores, weather APIs, CEN o backend.',
    'Leer datos live.',
    'Enviar reportes regulatorios.',
    'Ejecutar llamadas reales de red.',
    'Usar datos para forecast oficial o despacho operacional.',
  ],

  readOnlyDataContractPrinciples: [
    {
      id: 'principle-schema-before-data',
      label: 'Esquema antes que datos',
      description:
        'Primero se define estructura conceptual; después, en otro bloque, se evalúa una muestra sanitizada.',
      mandatory: true,
    },
    {
      id: 'principle-no-real-values',
      label: 'Sin valores reales',
      description:
        'Este blueprint no debe incluir datos reales, valores productivos, mediciones live ni rutas reales.',
      mandatory: true,
    },
    {
      id: 'principle-read-only-contract',
      label: 'Contrato solo lectura',
      description:
        'Todo dato futuro debe ser consumido en modo read-only, sin escritura, sin comandos y sin mutaciones.',
      mandatory: true,
    },
    {
      id: 'principle-human-approval',
      label: 'Aprobación humana obligatoria',
      description:
        'Toda evolución hacia datos reales requiere aprobación humana técnica, QA, cliente y seguridad.',
      mandatory: true,
    },
  ],

  requiredDataDomains: [
    {
      id: 'domain-plant-identity',
      label: 'Identidad de planta',
      description:
        'Dominio conceptual para identificar planta, zona, tecnología y límites generales sin datos sensibles.',
      required: true,
    },
    {
      id: 'domain-generation-timeseries',
      label: 'Serie temporal de generación',
      description:
        'Dominio conceptual para potencia/energía histórica o simulada, sujeto a sanitización y aprobación futura.',
      required: true,
    },
    {
      id: 'domain-weather-reference',
      label: 'Referencia meteorológica',
      description:
        'Dominio conceptual para irradiancia, temperatura y variables climáticas necesarias para análisis no oficial.',
      required: true,
    },
    {
      id: 'domain-availability-status',
      label: 'Estado de disponibilidad',
      description:
        'Dominio conceptual para flags de disponibilidad o indisponibilidad, sin control operacional.',
      required: false,
    },
  ],

  requiredDataFields: [
    {
      id: 'field-timestamp',
      label: 'timestamp',
      domain: 'generation-timeseries',
      expectedType: 'ISO datetime string',
      expectedUnit: 'America/Santiago or UTC explicitly declared',
      required: true,
      description:
        'Marca temporal normalizada para alinear series de generación y clima.',
    },
    {
      id: 'field-active-power-kw',
      label: 'activePowerKw',
      domain: 'generation-timeseries',
      expectedType: 'number',
      expectedUnit: 'kW',
      required: true,
      description:
        'Potencia activa conceptual para análisis read-only no oficial.',
    },
    {
      id: 'field-energy-kwh',
      label: 'energyKwh',
      domain: 'generation-timeseries',
      expectedType: 'number',
      expectedUnit: 'kWh',
      required: true,
      description:
        'Energía acumulada o intervalar conceptual, según contrato futuro.',
    },
    {
      id: 'field-irradiance',
      label: 'irradianceWm2',
      domain: 'weather-reference',
      expectedType: 'number',
      expectedUnit: 'W/m²',
      required: true,
      description:
        'Irradiancia conceptual para evaluación futura de rendimiento.',
    },
    {
      id: 'field-temperature',
      label: 'ambientTemperatureC',
      domain: 'weather-reference',
      expectedType: 'number',
      expectedUnit: '°C',
      required: true,
      description:
        'Temperatura ambiente conceptual para análisis no oficial.',
    },
  ],

  optionalDataFields: [
    {
      id: 'optional-module-temperature',
      label: 'moduleTemperatureC',
      domain: 'weather-reference',
      expectedType: 'number',
      expectedUnit: '°C',
      description:
        'Temperatura de módulo conceptual, útil si existe fuente aprobada.',
    },
    {
      id: 'optional-availability-flag',
      label: 'availabilityFlag',
      domain: 'availability-status',
      expectedType: 'boolean or enum',
      expectedUnit: 'N/A',
      description:
        'Flag conceptual para indicar disponibilidad, sin control ni ACK operacional.',
    },
    {
      id: 'optional-curtailment-flag',
      label: 'curtailmentFlag',
      domain: 'availability-status',
      expectedType: 'boolean or enum',
      expectedUnit: 'N/A',
      description:
        'Flag conceptual de limitación o recorte, solo si el cliente lo autoriza y sanitiza.',
    },
  ],

  forbiddenDataFields: [
    {
      id: 'forbidden-password',
      label: 'password',
      reason:
        'Credenciales y passwords están totalmente fuera de alcance.',
      severity: 'critical',
    },
    {
      id: 'forbidden-api-key',
      label: 'apiKey',
      reason:
        'API keys, tokens y secrets no deben aparecer en contrato, mocks, README ni frontend.',
      severity: 'critical',
    },
    {
      id: 'forbidden-endpoint-url',
      label: 'productionEndpointUrl',
      reason:
        'Endpoints productivos reales no deben documentarse ni almacenarse en este bloque.',
      severity: 'critical',
    },
    {
      id: 'forbidden-setpoint',
      label: 'setpointCommand',
      reason:
        'Setpoints, consignas y comandos operacionales no pertenecen a un contrato read-only.',
      severity: 'critical',
    },
    {
      id: 'forbidden-personal-data',
      label: 'personalData',
      reason:
        'Datos personales o sensibles no son necesarios para PVMetrics y deben excluirse.',
      severity: 'high',
    },
  ],

  dataQualityGates: [
    {
      id: 'quality-gate-timezone',
      label: 'Timezone explícito',
      required: true,
      description:
        'Todo timestamp futuro debe declarar zona horaria o normalización UTC.',
    },
    {
      id: 'quality-gate-units',
      label: 'Unidades explícitas',
      required: true,
      description:
        'Todo campo numérico debe declarar unidad esperada y criterio de conversión.',
    },
    {
      id: 'quality-gate-missing-values',
      label: 'Tratamiento de datos faltantes',
      required: true,
      description:
        'Debe existir regla conceptual para nulos, gaps, NaN o muestras incompletas.',
    },
    {
      id: 'quality-gate-granularity',
      label: 'Granularidad definida',
      required: true,
      description:
        'Debe declararse granularidad esperada, por ejemplo 5 min, 15 min, horario o diario.',
    },
  ],

  dataSanitizationGates: [
    {
      id: 'sanitize-no-secrets',
      label: 'Sin secrets',
      required: true,
      description:
        'Toda muestra futura debe confirmar ausencia de credenciales, tokens, API keys y passwords.',
    },
    {
      id: 'sanitize-no-personal-data',
      label: 'Sin datos personales',
      required: true,
      description:
        'Toda muestra futura debe excluir datos personales, correos, usuarios y rutas sensibles.',
    },
    {
      id: 'sanitize-no-production-endpoints',
      label: 'Sin endpoints productivos',
      required: true,
      description:
        'Toda muestra futura debe excluir URLs reales, IPs productivas y rutas internas sensibles.',
    },
  ],

  dataOwnershipGates: [
    {
      id: 'ownership-client-approval',
      label: 'Aprobación cliente',
      required: true,
      reviewerRole: 'client-owner',
      description:
        'El cliente debe aprobar cualquier muestra futura antes de su uso.',
    },
    {
      id: 'ownership-technical-approval',
      label: 'Aprobación técnica',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'El responsable técnico debe validar estructura, dominios, unidades y límites.',
    },
    {
      id: 'ownership-qa-approval',
      label: 'Aprobación QA',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'QA debe validar que el contrato no habilita datos reales, secrets ni acciones externas.',
    },
  ],

  schemaReviewGates: [
    {
      id: 'schema-gate-required-fields',
      label: 'Required fields completos',
      required: true,
      description:
        'El esquema futuro debe contener campos mínimos antes de cualquier mock data avanzado.',
    },
    {
      id: 'schema-gate-forbidden-fields',
      label: 'Forbidden fields bloqueados',
      required: true,
      description:
        'El esquema debe bloquear campos prohibidos como secrets, endpoints y comandos.',
    },
    {
      id: 'schema-gate-read-only-semantics',
      label: 'Semántica read-only',
      required: true,
      description:
        'La estructura debe ser compatible con lectura y visualización, nunca con control.',
    },
  ],

  dataContractRiskRegister: [
    {
      id: 'risk-real-data-leak',
      label: 'Fuga de datos reales',
      severity: 'critical',
      mitigation:
        'Mantener el blueprint sin valores reales and exigir sanitización antes de cualquier muestra futura.',
    },
    {
      id: 'risk-secret-in-schema',
      label: 'Secret incluido en esquema',
      severity: 'critical',
      mitigation:
        'Bloquear campos de credenciales, tokens, API keys, passwords y endpoints reales.',
    },
    {
      id: 'risk-operational-command-field',
      label: 'Campo de comando operacional',
      severity: 'critical',
      mitigation:
        'Excluir setpoints, comandos, SCADA ACK, BESS, inversores y telecontrol.',
    },
    {
      id: 'risk-official-forecast-confusion',
      label: 'Confusión con forecast oficial',
      severity: 'high',
      mitigation:
        'Declarar que el contrato es conceptual y no produce forecast oficial ni reporte regulatorio.',
    },
  ],

  dataContractExitCriteria: [
    'Blueprint de contrato de datos read-only creado.',
    'Data Contract Purpose declarado.',
    'Allowed Data Contract Items declarados.',
    'Blocked Data Contract Items declarados.',
    'Read-Only Data Contract Principles declarados.',
    'Required Data Domains declarados.',
    'Required Data Fields declarados.',
    'Optional Data Fields declarados.',
    'Forbidden Data Fields declarados.',
    'Data Quality Gates declarados.',
    'Data Sanitization Gates declarados.',
    'Data Ownership Gates declarados.',
    'Schema Review Gates declarados.',
    'Data Contract Risk Register declarado.',
    'Safety Boundary declarada.',
    'No se incorporan datos reales.',
    'No se crean conectores reales.',
    'No se usan credenciales reales.',
    'No se usan tokens.',
    'No se usan secrets.',
    'No se llama API real.',
    'No se lee SCADA real.',
    'No se leen medidores reales.',
    'No se envía CEN.',
    'No se usa backend.',
    'No se usa base de datos.',
    'No se usa localStorage.',
    'No se ejecuta POST/PUT/PATCH/DELETE real.',
    'No se ejecuta telecontrol.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint solo define un contrato conceptual de datos read-only. No incorpora datos reales, no crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no ejecuta POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',

  nextRoadmap: [
    '1O-R.1A — Read-Only Data Contract Types',
    '1O-R.1B — Read-Only Data Contract Mock Data',
    '1O-R.2A — Data Contract Visual Card',
    '1O-R.2B — Data Contract Export Text Box',
    '1O-R.3A — Data Contract Wizard Integration',
    '1O-R.4A — Data Contract Final QA & Closure',
  ],

  nextRecommendedModule: '1O-R.1A — Read-Only Data Contract Types',
} as const;
