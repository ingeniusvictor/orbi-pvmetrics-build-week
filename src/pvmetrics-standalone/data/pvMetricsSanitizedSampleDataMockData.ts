import {
  PVMetricsAllowedSampleDataItem,
  PVMetricsBlockedSampleDataItem,
  PVMetricsControlledSanitizedSampleDataPack,
  PVMetricsForbiddenSampleContent,
  PVMetricsSampleDataApprovalGate,
  PVMetricsSampleDataDomain,
  PVMetricsSampleDataExitCriterion,
  PVMetricsSampleDataFieldPlaceholder,
  PVMetricsSampleDataPrivacyGate,
  PVMetricsSampleDataQualityGate,
  PVMetricsSampleDataRiskRegisterItem,
  PVMetricsSanitizationRequirement,
  PVMetricsSanitizedSampleDataPrinciple,
  PVMetricsSyntheticSampleRule,
} from '../types/pvmetrics-sanitized-sample-data.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-S.1B-sanitized-sample-data-mock-data';

export const PV_METRICS_SAMPLE_DATA_PURPOSE_MOCK: string[] = [
  'Definir una muestra local, sintética y demo-only compatible con el contrato read-only 1O-R.',
  'Representar estructura, dominios, placeholders y reglas de calidad sin usar datos reales.',
  'Evitar trazabilidad a clientes, plantas, activos, medidores, inversores, endpoints o usuarios reales.',
  'Bloquear credenciales, tokens, secrets, API keys, passwords, rutas internas y comandos operacionales.',
  'Preparar una base segura para visualización, QA y presentación conceptual sin impacto productivo.',
];

export const PV_METRICS_ALLOWED_SAMPLE_DATA_ITEMS_MOCK: PVMetricsAllowedSampleDataItem[] =
  [
    {
      itemId: 'allowed-synthetic-timeseries',
      label: 'Series temporales sintéticas',
      itemType: 'allowed-sample-data-item',
      description:
        'Series generadas artificialmente con valores plausibles, no derivados de una planta real.',
      sampleMode: 'synthetic',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-demo-only-placeholders',
      label: 'Placeholders demo-only',
      itemType: 'allowed-sample-data-item',
      description:
        'Valores ficticios para nombres, IDs, timestamps, potencia, energía, irradiancia y temperatura.',
      sampleMode: 'demo-only',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-sanitized-structure',
      label: 'Estructura sanitizada',
      itemType: 'allowed-sample-data-item',
      description:
        'Estructura de campos y dominios sin valores reales, endpoints, identificadores o rutas internas.',
      sampleMode: 'sanitized',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-quality-notes',
      label: 'Notas de calidad simuladas',
      itemType: 'allowed-sample-data-item',
      description:
        'Notas conceptuales para representar gaps, nulos, granularidad o validaciones sin eventos reales.',
      sampleMode: 'placeholder-only',
      requiresApproval: false,
    },
  ];

export const PV_METRICS_BLOCKED_SAMPLE_DATA_ITEMS_MOCK: PVMetricsBlockedSampleDataItem[] =
  [
    {
      itemId: 'blocked-real-plant-data',
      label: 'Datos reales de planta',
      itemType: 'blocked-sample-data-item',
      severity: 'critical',
      reason:
        'La muestra no puede contener mediciones reales, históricos reales ni exportaciones reales.',
      safeAlternative:
        'Usar datos sintéticos con etiqueta SYNTHETIC_SAMPLE.',
    },
    {
      itemId: 'blocked-client-identifiers',
      label: 'Identificadores reales de cliente o activo',
      itemType: 'blocked-sample-data-item',
      severity: 'critical',
      reason:
        'Nombres reales de clientes, plantas, inversores, medidores, usuarios o rutas internas quedan prohibidos.',
      safeAlternative:
        'Usar nombres ficticios como Demo Plant, Synthetic Meter o Sample Asset.',
    },
    {
      itemId: 'blocked-secrets',
      label: 'Credenciales, tokens, API keys o passwords',
      itemType: 'blocked-sample-data-item',
      severity: 'critical',
      reason:
        'Ningún secret puede aparecer en muestras, mocks, README, frontend o reportes.',
      safeAlternative:
        'Usar textos explícitos como NOT_INCLUDED o FORBIDDEN_SECRET_FIELD.',
    },
    {
      itemId: 'blocked-operational-events',
      label: 'Eventos operacionales reales',
      itemType: 'blocked-sample-data-item',
      severity: 'high',
      reason:
        'Fallas reales, indisponibilidades reales, alarmas reales o eventos comerciales reales no deben incorporarse.',
      safeAlternative:
        'Usar eventos ficticios con etiqueta SYNTHETIC_EVENT.',
    },
  ];

export const PV_METRICS_SANITIZED_SAMPLE_DATA_PRINCIPLES_MOCK: PVMetricsSanitizedSampleDataPrinciple[] =
  [
    {
      principleId: 'principle-synthetic-first',
      label: 'Synthetic-first',
      itemType: 'sanitized-sample-data-principle',
      description:
        'Preferir muestras sintéticas antes que sanitizadas para evitar exposición de datos reales.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-identifiability',
      label: 'No identificabilidad',
      itemType: 'sanitized-sample-data-principle',
      description:
        'La muestra no debe permitir identificar cliente, planta, activo, usuario, IP, endpoint ni ruta interna.',
      mandatory: true,
    },
    {
      principleId: 'principle-read-only-context',
      label: 'Contexto solo lectura',
      itemType: 'sanitized-sample-data-principle',
      description:
        'Toda muestra debe servir solo para visualización, QA y demo, nunca para control u operación.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-approval',
      label: 'Aprobación humana obligatoria',
      itemType: 'sanitized-sample-data-principle',
      description:
        'Toda evolución hacia muestras reales sanitizadas requiere aprobación técnica, QA, cliente y seguridad.',
      mandatory: true,
    },
  ];

export const PV_METRICS_SYNTHETIC_SAMPLE_RULES_MOCK: PVMetricsSyntheticSampleRule[] =
  [
    {
      ruleId: 'rule-no-production-origin',
      label: 'Sin origen productivo',
      itemType: 'synthetic-sample-rule',
      description:
        'Los valores deben ser ficticios y no derivados directamente de datos productivos.',
      mandatory: true,
    },
    {
      ruleId: 'rule-demo-calendar',
      label: 'Calendario demo',
      itemType: 'synthetic-sample-rule',
      description:
        'Los timestamps pueden ser ficticios o relativos, nunca usados como evidencia operacional.',
      mandatory: true,
    },
    {
      ruleId: 'rule-generic-identifiers',
      label: 'Identificadores genéricos',
      itemType: 'synthetic-sample-rule',
      description:
        'Los nombres de planta, activos, medidores e inversores deben ser genéricos.',
      mandatory: true,
    },
    {
      ruleId: 'rule-explicit-labeling',
      label: 'Etiquetado explícito',
      itemType: 'synthetic-sample-rule',
      description:
        'Toda serie debe marcarse como SYNTHETIC_SAMPLE, SANITIZED_SAMPLE o DEMO_ONLY.',
      mandatory: true,
    },
  ];

export const PV_METRICS_SANITIZATION_REQUIREMENTS_MOCK: PVMetricsSanitizationRequirement[] =
  [
    {
      requirementId: 'sanitize-remove-secrets',
      label: 'Eliminar secrets',
      itemType: 'sanitization-requirement',
      description:
        'Eliminar credenciales, tokens, API keys, passwords y secrets de toda muestra futura.',
      required: true,
    },
    {
      requirementId: 'sanitize-remove-endpoints',
      label: 'Eliminar endpoints productivos',
      itemType: 'sanitization-requirement',
      description:
        'Eliminar URLs, IPs, rutas internas, nombres de servidores y endpoints reales.',
      required: true,
    },
    {
      requirementId: 'sanitize-remove-client-identifiers',
      label: 'Eliminar identificadores de cliente',
      itemType: 'sanitization-requirement',
      description:
        'Eliminar nombres reales de clientes, plantas, personas, correos, usuarios y activos.',
      required: true,
    },
    {
      requirementId: 'sanitize-remove-operational-events',
      label: 'Eliminar eventos operacionales',
      itemType: 'sanitization-requirement',
      description:
        'Eliminar eventos reales, alarmas reales, indisponibilidades reales y reportes regulatorios reales.',
      required: true,
    },
  ];

export const PV_METRICS_FORBIDDEN_SAMPLE_CONTENT_MOCK: PVMetricsForbiddenSampleContent[] =
  [
    {
      contentId: 'forbidden-passwords',
      label: 'Passwords',
      itemType: 'forbidden-sample-content',
      severity: 'critical',
      reason:
        'Las contraseñas no pueden existir en muestras, mocks, frontend, README ni reportes.',
    },
    {
      contentId: 'forbidden-api-keys',
      label: 'API keys / tokens / secrets',
      itemType: 'forbidden-sample-content',
      severity: 'critical',
      reason:
        'Toda credencial o secret real queda fuera de alcance.',
    },
    {
      contentId: 'forbidden-production-urls',
      label: 'URLs, IPs y endpoints productivos',
      itemType: 'forbidden-sample-content',
      severity: 'critical',
      reason:
        'La muestra no debe exponer infraestructura real.',
    },
    {
      contentId: 'forbidden-real-asset-ids',
      label: 'IDs reales de medidores, inversores o SCADA',
      itemType: 'forbidden-sample-content',
      severity: 'critical',
      reason:
        'Los identificadores reales permiten trazabilidad a activos productivos.',
    },
    {
      contentId: 'forbidden-operational-commands',
      label: 'Setpoints, comandos BESS, inversores o SCADA ACK',
      itemType: 'forbidden-sample-content',
      severity: 'critical',
      reason:
        'Las muestras sanitizadas son solo lectura y no pueden contener comandos operacionales.',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_DOMAINS_MOCK: PVMetricsSampleDataDomain[] =
  [
    {
      domainId: 'sample-domain-plant-profile',
      label: 'Perfil ficticio de planta',
      itemType: 'sample-data-domain',
      description:
        'Dominio para representar una planta demo con nombre, tecnología y capacidad ficticia.',
      sampleMode: 'synthetic',
    },
    {
      domainId: 'sample-domain-generation-series',
      label: 'Serie sintética de generación',
      itemType: 'sample-data-domain',
      description:
        'Dominio para potencia y energía sintética compatible con el contrato read-only 1O-R.',
      sampleMode: 'synthetic',
    },
    {
      domainId: 'sample-domain-weather-reference',
      label: 'Referencia climática sintética',
      itemType: 'sample-data-domain',
      description:
        'Dominio para irradiancia y temperatura ficticia sin fuente meteorológica real.',
      sampleMode: 'synthetic',
    },
    {
      domainId: 'sample-domain-availability-flags',
      label: 'Flags ficticios de disponibilidad',
      itemType: 'sample-data-domain',
      description:
        'Dominio opcional para estados ficticios sin relación con eventos reales.',
      sampleMode: 'synthetic',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_FIELD_PLACEHOLDERS_MOCK: PVMetricsSampleDataFieldPlaceholder[] =
  [
    {
      placeholderId: 'placeholder-plant-id',
      label: 'plantId',
      itemType: 'sample-data-field-placeholder',
      placeholderValue: 'DEMO_PLANT_001',
      sampleMode: 'placeholder-only',
      rule: 'Debe ser ficticio y no coincidir con activo real.',
    },
    {
      placeholderId: 'placeholder-timestamp',
      label: 'timestamp',
      itemType: 'sample-data-field-placeholder',
      placeholderValue: '2026-01-01T12:00:00-03:00',
      sampleMode: 'synthetic',
      rule: 'Debe ser calendario demo, no evidencia operacional.',
    },
    {
      placeholderId: 'placeholder-active-power',
      label: 'activePowerKw',
      itemType: 'sample-data-field-placeholder',
      placeholderValue: '1234.5',
      sampleMode: 'synthetic',
      rule: 'Valor sintético plausible, no derivado de medición real.',
    },
    {
      placeholderId: 'placeholder-energy',
      label: 'energyKwh',
      itemType: 'sample-data-field-placeholder',
      placeholderValue: '567.8',
      sampleMode: 'synthetic',
      rule: 'Valor sintético plausible, no exportado desde medidor real.',
    },
    {
      placeholderId: 'placeholder-irradiance',
      label: 'irradianceWm2',
      itemType: 'sample-data-field-placeholder',
      placeholderValue: '850',
      sampleMode: 'synthetic',
      rule: 'Valor sintético no proveniente de estación meteorológica real.',
    },
    {
      placeholderId: 'placeholder-temperature',
      label: 'ambientTemperatureC',
      itemType: 'sample-data-field-placeholder',
      placeholderValue: '24.6',
      sampleMode: 'synthetic',
      rule: 'Valor ficticio sin fuente meteorológica real.',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_QUALITY_GATES_MOCK: PVMetricsSampleDataQualityGate[] =
  [
    {
      gateId: 'sample-quality-schema-match',
      label: 'Compatibilidad con contrato 1O-R',
      itemType: 'sample-data-quality-gate',
      required: true,
      description:
        'La muestra debe respetar dominios, campos, unidades y límites del contrato read-only 1O-R.',
    },
    {
      gateId: 'sample-quality-clear-labeling',
      label: 'Etiquetado explícito',
      itemType: 'sample-data-quality-gate',
      required: true,
      description:
        'Toda muestra debe indicar claramente si es synthetic, sanitized, demo-only o placeholder-only.',
    },
    {
      gateId: 'sample-quality-no-real-reconstruction',
      label: 'No reconstrucción de datos reales',
      itemType: 'sample-data-quality-gate',
      required: true,
      description:
        'La muestra no debe permitir inferir curvas, eventos, clientes, activos o producción real.',
    },
    {
      gateId: 'sample-quality-plausible-ranges',
      label: 'Rangos plausibles pero ficticios',
      itemType: 'sample-data-quality-gate',
      required: true,
      description:
        'Los valores pueden ser plausibles para demo, pero no deben replicar datos de una planta específica.',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_PRIVACY_GATES_MOCK: PVMetricsSampleDataPrivacyGate[] =
  [
    {
      gateId: 'privacy-no-personal-data',
      label: 'Sin datos personales',
      itemType: 'sample-data-privacy-gate',
      required: true,
      description:
        'Excluir nombres, correos, usuarios, firmas, teléfonos o identificadores personales.',
    },
    {
      gateId: 'privacy-no-client-trace',
      label: 'Sin trazabilidad a cliente real',
      itemType: 'sample-data-privacy-gate',
      required: true,
      description:
        'Excluir nombres, IDs, nomenclaturas o patrones que permitan identificar cliente o contrato real.',
    },
    {
      gateId: 'privacy-no-infrastructure-trace',
      label: 'Sin trazabilidad de infraestructura',
      itemType: 'sample-data-privacy-gate',
      required: true,
      description:
        'Excluir URLs, IPs, endpoints, rutas internas, nombres de servidores y activos reales.',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_APPROVAL_GATES_MOCK: PVMetricsSampleDataApprovalGate[] =
  [
    {
      gateId: 'approval-technical-owner',
      label: 'Aprobación técnica',
      itemType: 'sample-data-approval-gate',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Valida estructura, unidades, plausibilidad, modo synthetic-first y compatibilidad con 1O-R.',
    },
    {
      gateId: 'approval-qa-owner',
      label: 'Aprobación QA',
      itemType: 'sample-data-approval-gate',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Valida ausencia de datos reales, secrets, endpoints, comandos y acciones externas.',
    },
    {
      gateId: 'approval-security-owner',
      label: 'Aprobación seguridad',
      itemType: 'sample-data-approval-gate',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Valida que la muestra no expone infraestructura, credenciales, secretos ni trazabilidad sensible.',
    },
    {
      gateId: 'approval-client-owner',
      label: 'Aprobación cliente',
      itemType: 'sample-data-approval-gate',
      reviewerRole: 'client-owner',
      required: false,
      description:
        'Requerida solo si en el futuro se evalúa una muestra sanitizada con origen o revisión del cliente.',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_RISK_REGISTER_MOCK: PVMetricsSampleDataRiskRegisterItem[] =
  [
    {
      riskId: 'risk-real-data-leak',
      label: 'Fuga de datos reales',
      itemType: 'sample-data-risk-register-item',
      severity: 'critical',
      mitigation:
        'Usar synthetic-first, revisión QA y gates de privacidad antes de cualquier muestra futura.',
    },
    {
      riskId: 'risk-client-identification',
      label: 'Identificación indirecta de cliente',
      itemType: 'sample-data-risk-register-item',
      severity: 'critical',
      mitigation:
        'Reemplazar nombres, patrones, IDs, rutas, eventos y nomenclaturas por placeholders genéricos.',
    },
    {
      riskId: 'risk-secret-exposure',
      label: 'Exposición de secrets',
      itemType: 'sample-data-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear credenciales, tokens, API keys, passwords, endpoints y rutas productivas.',
    },
    {
      riskId: 'risk-operational-command-exposure',
      label: 'Exposición de comandos operacionales',
      itemType: 'sample-data-risk-register-item',
      severity: 'critical',
      mitigation:
        'Excluir setpoints, comandos BESS, comandos de inversores, telecontrol y SCADA ACK.',
    },
    {
      riskId: 'risk-official-use-confusion',
      label: 'Confusión con uso oficial',
      itemType: 'sample-data-risk-register-item',
      severity: 'high',
      mitigation:
        'Declarar la muestra como demo-only, sintética, no productiva, no regulatoria y no operacional.',
    },
  ];

export const PV_METRICS_SAMPLE_DATA_EXIT_CRITERIA_MOCK: PVMetricsSampleDataExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'sample-data-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Controlled Sanitized Sample Data están implementados.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'sample-data-exit-criterion',
      required: true,
      passed: true,
      description:
        'El archivo de mock data local queda poblado con reglas, dominios, placeholders, gates, riesgos y safety boundary.',
    },
    {
      criterionId: 'exit-no-real-data',
      label: 'Sin datos reales',
      itemType: 'sample-data-exit-criterion',
      required: true,
      passed: true,
      description:
        'La muestra no incorpora mediciones, históricos, eventos, endpoints, credenciales ni identificadores reales.',
    },
    {
      criterionId: 'exit-no-operational-fields',
      label: 'Sin campos operacionales',
      itemType: 'sample-data-exit-criterion',
      required: true,
      passed: true,
      description:
        'No existen setpoints, telecontrol, comandos BESS, comandos de inversores ni SCADA ACK.',
    },
    {
      criterionId: 'exit-safety-boundary',
      label: 'Safety Boundary declarada',
      itemType: 'sample-data-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los límites de seguridad quedan declarados dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK: PVMetricsControlledSanitizedSampleDataPack =
  {
    packId: 'pvmetrics-controlled-sanitized-sample-data-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-S — Controlled Sanitized Sample Data',
    module: '1O-S.1B — Sanitized Sample Data Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    sampleDataPurpose: PV_METRICS_SAMPLE_DATA_PURPOSE_MOCK,
    allowedSampleDataItems: PV_METRICS_ALLOWED_SAMPLE_DATA_ITEMS_MOCK,
    blockedSampleDataItems: PV_METRICS_BLOCKED_SAMPLE_DATA_ITEMS_MOCK,
    sanitizedSampleDataPrinciples:
      PV_METRICS_SANITIZED_SAMPLE_DATA_PRINCIPLES_MOCK,
    syntheticSampleRules: PV_METRICS_SYNTHETIC_SAMPLE_RULES_MOCK,
    sanitizationRequirements: PV_METRICS_SANITIZATION_REQUIREMENTS_MOCK,
    forbiddenSampleContent: PV_METRICS_FORBIDDEN_SAMPLE_CONTENT_MOCK,
    sampleDataDomains: PV_METRICS_SAMPLE_DATA_DOMAINS_MOCK,
    sampleDataFieldPlaceholders:
      PV_METRICS_SAMPLE_DATA_FIELD_PLACEHOLDERS_MOCK,
    sampleDataQualityGates: PV_METRICS_SAMPLE_DATA_QUALITY_GATES_MOCK,
    sampleDataPrivacyGates: PV_METRICS_SAMPLE_DATA_PRIVACY_GATES_MOCK,
    sampleDataApprovalGates: PV_METRICS_SAMPLE_DATA_APPROVAL_GATES_MOCK,
    sampleDataRiskRegister: PV_METRICS_SAMPLE_DATA_RISK_REGISTER_MOCK,
    sampleDataExitCriteria: PV_METRICS_SAMPLE_DATA_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Controlled Sanitized Sample Data mock data. Todo es local, sintético, demo-only y no productivo. No incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',
    nextRecommendedModule: '1O-S.2A — Sanitized Sample Data Visual Card',
  };
