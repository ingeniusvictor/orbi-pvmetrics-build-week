const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_BLUEPRINT = {
  id: 'pvmetrics-controlled-sanitized-sample-data-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-S — Controlled Sanitized Sample Data',
  module: '1O-S.0 — Controlled Sanitized Sample Data Blueprint',
  internalVersion: '0.1O-S.0-controlled-sanitized-sample-data-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_SAMPLE_DATA',
  blueprintStatusLabel:
    'SANITIZED SAMPLE DATA — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir las reglas conceptuales para preparar futuras muestras sanitizadas o sintéticas de datos en ORBI PVMetrics IA, sin incorporar datos reales, sin conectores, sin endpoints y sin impacto operacional.',

  sampleDataPurpose: [
    'Definir cómo se estructurará una muestra futura compatible con el contrato read-only 1O-R.',
    'Separar muestras sintéticas, muestras sanitizadas y contenido estrictamente prohibido.',
    'Establecer gates de calidad, privacidad, aprobación y trazabilidad antes de usar cualquier muestra.',
    'Evitar filtración de datos reales, credenciales, endpoints, rutas internas o información sensible.',
    'Preparar una base conceptual para mock data seguro en el siguiente módulo 1O-S.1A/1B.',
  ],

  allowedSampleDataItems: [
    {
      id: 'allowed-synthetic-timeseries',
      label: 'Series temporales sintéticas',
      description:
        'Series generadas artificialmente con valores plausibles pero no derivados de planta real.',
      requiresApproval: true,
    },
    {
      id: 'allowed-sanitized-structure',
      label: 'Estructura sanitizada',
      description:
        'Estructura de campos, unidades y dominios sin valores reales, endpoints ni identificadores sensibles.',
      requiresApproval: true,
    },
    {
      id: 'allowed-placeholder-identifiers',
      label: 'Identificadores ficticios',
      description:
        'IDs ficticios como DEMO_PLANT_001 o SAMPLE_INVERTER_A sin relación con activos reales.',
      requiresApproval: true,
    },
    {
      id: 'allowed-quality-notes',
      label: 'Notas de calidad simuladas',
      description:
        'Notas conceptuales sobre gaps, granularidad o nulos sin representar eventos reales.',
      requiresApproval: false,
    },
  ],

  blockedSampleDataItems: [
    {
      id: 'blocked-real-plant-data',
      label: 'Datos reales de planta',
      severity: 'critical',
      reason:
        'Este bloque no puede incorporar mediciones reales, históricos reales ni exportaciones reales.',
      safeAlternative:
        'Usar datos sintéticos claramente etiquetados como ficticios.',
    },
    {
      id: 'blocked-client-identifiers',
      label: 'Identificadores reales de cliente o activo',
      severity: 'critical',
      reason:
        'Nombres reales de clientes, plantas, inversores, medidores, usuarios o rutas internas quedan fuera de alcance.',
      safeAlternative:
        'Usar nombres ficticios y genéricos como Demo Plant, Sample Meter o Synthetic Asset.',
    },
    {
      id: 'blocked-secrets',
      label: 'Credenciales, tokens, API keys o passwords',
      severity: 'critical',
      reason:
        'Ningún secret debe aparecer en muestras, mocks, README, frontend o reportes.',
      safeAlternative:
        'Usar textos explícitos como NOT_INCLUDED o FORBIDDEN_SECRET_FIELD.',
    },
    {
      id: 'blocked-operational-events',
      label: 'Eventos operacionales reales',
      severity: 'high',
      reason:
        'Fallas reales, indisponibilidades reales o eventos comerciales reales no deben incorporarse.',
      safeAlternative:
        'Usar eventos ficticios con etiqueta SYNTHETIC_EVENT.',
    },
  ],

  sanitizedSampleDataPrinciples: [
    {
      id: 'principle-synthetic-first',
      label: 'Synthetic-first',
      description:
        'Preferir muestras sintéticas antes que sanitizadas para evitar exposición de datos reales.',
      mandatory: true,
    },
    {
      id: 'principle-no-identifiability',
      label: 'No identificabilidad',
      description:
        'La muestra no debe permitir identificar cliente, planta, activo, usuario, IP, endpoint ni ruta interna.',
      mandatory: true,
    },
    {
      id: 'principle-read-only-context',
      label: 'Contexto solo lectura',
      description:
        'Toda muestra debe servir solo para visualización, QA y demo, nunca para control u operación.',
      mandatory: true,
    },
    {
      id: 'principle-human-approval',
      label: 'Aprobación humana obligatoria',
      description:
        'Toda evolución hacia muestras reales sanitizadas requiere aprobación técnica, QA, cliente y seguridad.',
      mandatory: true,
    },
  ],

  syntheticSampleRules: [
    'Los valores deben ser ficticios y no derivados directamente de datos productivos.',
    'Los timestamps pueden ser relativos o de calendario ficticio, nunca usados como evidencia operacional.',
    'Los nombres de planta, activos, medidores e inversores deben ser genéricos.',
    'Toda serie debe marcarse como SYNTHETIC_SAMPLE o SANITIZED_SAMPLE.',
    'Los rangos numéricos deben ser plausibles, pero no deben replicar curvas reales de una planta específica.',
  ],

  sanitizationRequirements: [
    'Eliminar credenciales, tokens, API keys, passwords y secrets.',
    'Eliminar URLs, IPs, endpoints, rutas internas y nombres de servidores.',
    'Eliminar nombres reales de clientes, plantas, personas, correos y usuarios.',
    'Eliminar IDs reales de medidores, inversores, SCADA, data loggers o activos.',
    'Eliminar eventos operacionales reales, alarmas reales y reportes regulatorios reales.',
    'Confirmar que la muestra no permite reconstruir información productiva.',
  ],

  forbiddenSampleContent: [
    'Contraseñas.',
    'API keys.',
    'Tokens.',
    'Secrets.',
    'URLs productivas.',
    'IPs productivas.',
    'Correos reales.',
    'Usuarios reales.',
    'Nombres reales de clientes.',
    'Nombres reales de plantas.',
    'IDs reales de medidores.',
    'IDs reales de inversores.',
    'Eventos operacionales reales.',
    'Reportes regulatorios reales.',
    'Setpoints.',
    'Comandos BESS.',
    'Comandos de inversores.',
    'SCADA ACK.',
  ],

  sampleDataDomains: [
    {
      id: 'sample-domain-plant-profile',
      label: 'Perfil ficticio de planta',
      description:
        'Dominio para representar una planta demo con nombre, tecnología y capacidad ficticia.',
      sampleMode: 'synthetic',
    },
    {
      id: 'sample-domain-generation-series',
      label: 'Serie sintética de generación',
      description:
        'Dominio para potencia y energía sintética compatible con el contrato read-only.',
      sampleMode: 'synthetic',
    },
    {
      id: 'sample-domain-weather-reference',
      label: 'Referencia climática sintética',
      description:
        'Dominio para irradiancia y temperatura ficticia sin fuente meteorológica real.',
      sampleMode: 'synthetic',
    },
    {
      id: 'sample-domain-availability-flags',
      label: 'Flags ficticios de disponibilidad',
      description:
        'Dominio opcional para estados ficticios sin relación con eventos reales.',
      sampleMode: 'synthetic',
    },
  ],

  sampleDataFieldPlaceholders: [
    {
      id: 'placeholder-plant-id',
      label: 'plantId',
      placeholderValue: 'DEMO_PLANT_001',
      rule: 'Debe ser ficticio y no coincidir con activo real.',
    },
    {
      id: 'placeholder-timestamp',
      label: 'timestamp',
      placeholderValue: '2026-01-01T12:00:00-03:00',
      rule: 'Debe ser muestra ficticia o calendario demo, no evidencia operacional.',
    },
    {
      id: 'placeholder-active-power',
      label: 'activePowerKw',
      placeholderValue: '1234.5',
      rule: 'Valor sintético plausible, no derivado de medición real.',
    },
    {
      id: 'placeholder-energy',
      label: 'energyKwh',
      placeholderValue: '567.8',
      rule: 'Valor sintético plausible, no exportado desde medidor real.',
    },
    {
      id: 'placeholder-irradiance',
      label: 'irradianceWm2',
      placeholderValue: '850',
      rule: 'Valor sintético no proveniente de estación meteorológica real.',
    },
  ],

  sampleDataQualityGates: [
    {
      id: 'sample-quality-schema-match',
      label: 'Compatibilidad con contrato 1O-R',
      required: true,
      description:
        'La muestra futura debe respetar dominios, campos y unidades del contrato read-only.',
    },
    {
      id: 'sample-quality-clear-labeling',
      label: 'Etiquetado explícito',
      required: true,
      description:
        'Toda muestra debe indicar si es synthetic, sanitized o demo-only.',
    },
    {
      id: 'sample-quality-no-real-reconstruction',
      label: 'No reconstrucción de datos reales',
      required: true,
      description:
        'La muestra no debe permitir inferir curvas, eventos, clientes o activos reales.',
    },
  ],

  sampleDataPrivacyGates: [
    {
      id: 'privacy-no-personal-data',
      label: 'Sin datos personales',
      required: true,
      description:
        'Excluir nombres, correos, usuarios, firmas, teléfonos o identificadores personales.',
    },
    {
      id: 'privacy-no-client-trace',
      label: 'Sin trazabilidad a cliente real',
      required: true,
      description:
        'Excluir nombres, IDs, nomenclaturas o patrones que permitan identificar al cliente.',
    },
    {
      id: 'privacy-no-infrastructure-trace',
      label: 'Sin trazabilidad de infraestructura',
      required: true,
      description:
        'Excluir URLs, IPs, rutas internas, endpoints, nombres de servidores o assets reales.',
    },
  ],

  sampleDataApprovalGates: [
    {
      id: 'approval-technical-owner',
      label: 'Aprobación técnica',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Valida estructura, unidades, plausibilidad y compatibilidad con 1O-R.',
    },
    {
      id: 'approval-qa-owner',
      label: 'Aprobación QA',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Valida ausencia de datos reales, secrets, endpoints y operaciones externas.',
    },
    {
      id: 'approval-client-owner',
      label: 'Aprobación cliente',
      reviewerRole: 'client-owner',
      required: false,
      description:
        'Requerida solo si en el futuro se evalúa una muestra sanitizada con origen del cliente.',
    },
  ],

  sampleDataRiskRegister: [
    {
      id: 'risk-real-data-leak',
      label: 'Fuga de datos reales',
      severity: 'critical',
      mitigation:
        'Usar synthetic-first, revisión QA y gates de privacidad antes de cualquier muestra.',
    },
    {
      id: 'risk-client-identification',
      label: 'Identificación indirecta de cliente',
      severity: 'critical',
      mitigation:
        'Reemplazar nombres, patrones, IDs, rutas y eventos por placeholders genéricos.',
    },
    {
      id: 'risk-secret-exposure',
      label: 'Exposición de secrets',
      severity: 'critical',
      mitigation:
        'Bloquear campos de credenciales, tokens, API keys, passwords y endpoints.',
    },
    {
      id: 'risk-official-use-confusion',
      label: 'Confusión con uso oficial',
      severity: 'high',
      mitigation:
        'Declarar la muestra como demo-only, no productiva, no regulatoria y no operacional.',
    },
  ],

  sampleDataExitCriteria: [
    'Blueprint de sanitized sample data creado.',
    'Purpose declarado.',
    'Allowed Sample Data Items declarados.',
    'Blocked Sample Data Items declarados.',
    'Sanitized Sample Data Principles declarados.',
    'Synthetic Sample Rules declaradas.',
    'Sanitization Requirements declarados.',
    'Forbidden Sample Content declarado.',
    'Sample Data Domains declarados.',
    'Sample Data Field Placeholders declarados.',
    'Sample Data Quality Gates declarados.',
    'Sample Data Privacy Gates declarados.',
    'Sample Data Approval Gates declarados.',
    'Sample Data Risk Register declarado.',
    'Safety Boundary declarada.',
    'No se crea mock data todavía.',
    'No se incorporan datos reales.',
    'No se crean conectores reales.',
    'No se usan credenciales reales.',
    'No se llama API real.',
    'No se lee SCADA real.',
    'No se lee medidor real.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint solo define reglas conceptuales para futuras muestras sanitizadas o sintéticas. No crea mock data todavía, no incorpora datos reales, no crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',

  nextRoadmap: [
    '1O-S.1A — Sanitized Sample Data Types',
    '1O-S.1B — Sanitized Sample Data Mock Data',
    '1O-S.2A — Sanitized Sample Data Visual Card',
    '1O-S.2B — Sanitized Sample Data Export Text Box',
    '1O-S.3A — Sanitized Sample Data Wizard Integration',
    '1O-S.4A — Sanitized Sample Data Final QA & Closure',
  ],

  nextRecommendedModule: '1O-S.1A — Sanitized Sample Data Types',
} as const;
