import {
  PVMetricsAllowedDataContractItem,
  PVMetricsBlockedDataContractItem,
  PVMetricsControlledReadOnlyDataContractPack,
  PVMetricsDataContractExitCriterion,
  PVMetricsDataContractRiskRegisterItem,
  PVMetricsDataOwnershipGate,
  PVMetricsDataQualityGate,
  PVMetricsDataSanitizationGate,
  PVMetricsForbiddenDataField,
  PVMetricsOptionalDataField,
  PVMetricsReadOnlyDataContractPrinciple,
  PVMetricsRequiredDataDomain,
  PVMetricsRequiredDataField,
  PVMetricsSchemaReviewGate,
} from '../types/pvmetrics-read-only-data-contract.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-R.1B-read-only-data-contract-mock-data';

export const PV_METRICS_DATA_CONTRACT_PURPOSE_MOCK: string[] = [
  'Definir un contrato conceptual de datos read-only antes de cualquier conector futuro.',
  'Separar dominios requeridos, campos opcionales y campos prohibidos sin incorporar valores reales.',
  'Estandarizar nombres, tipos esperados, unidades, granularidad y límites de seguridad.',
  'Bloquear datos sensibles, credenciales, endpoints reales, comandos y campos operacionales.',
  'Preparar revisión técnica, QA, cliente y seguridad antes de cualquier sandbox o piloto real.',
];

export const PV_METRICS_ALLOWED_DATA_CONTRACT_ITEMS_MOCK: PVMetricsAllowedDataContractItem[] =
  [
    {
      itemId: 'allowed-conceptual-domains',
      label: 'Dominios conceptuales',
      itemType: 'allowed-data-contract-item',
      description:
        'Definición conceptual de dominios de datos sin incorporar información real de planta.',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-field-signatures',
      label: 'Firmas de campos',
      itemType: 'allowed-data-contract-item',
      description:
        'Definición de nombres, tipos esperados, unidades y descripciones sin valores reales.',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-quality-gates',
      label: 'Gates de calidad',
      itemType: 'allowed-data-contract-item',
      description:
        'Criterios conceptuales para timezone, unidades, granularidad, nulos y consistencia.',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-sanitization-rules',
      label: 'Reglas de sanitización',
      itemType: 'allowed-data-contract-item',
      description:
        'Reglas para excluir secrets, datos personales, endpoints productivos y rutas sensibles.',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_DATA_CONTRACT_ITEMS_MOCK: PVMetricsBlockedDataContractItem[] =
  [
    {
      itemId: 'blocked-real-values',
      label: 'Valores reales de planta',
      itemType: 'blocked-data-contract-item',
      reason:
        'Este bloque solo define estructura conceptual y no debe incluir datos reales.',
      safeAlternative:
        'Usar nombres de campos, tipos esperados y unidades sin valores productivos.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-credentials',
      label: 'Credenciales, tokens o secrets',
      itemType: 'blocked-data-contract-item',
      reason:
        'Passwords, API keys, tokens y secrets no pertenecen a un contrato de datos read-only.',
      safeAlternative:
        'Declarar estos campos como forbidden data fields.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-production-endpoints',
      label: 'Endpoints productivos',
      itemType: 'blocked-data-contract-item',
      reason:
        'URLs, IPs, rutas productivas y endpoints reales no deben almacenarse ni documentarse aquí.',
      safeAlternative:
        'Usar categorías conceptuales sin endpoint, host, IP ni path real.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-operational-commands',
      label: 'Campos de comando operacional',
      itemType: 'blocked-data-contract-item',
      reason:
        'Setpoints, telecontrol, BESS, inversores, SCADA ACK o consignas no son datos read-only.',
      safeAlternative:
        'Mantener únicamente campos de lectura conceptual no operativa.',
      severity: 'critical',
    },
  ];

export const PV_METRICS_READ_ONLY_DATA_CONTRACT_PRINCIPLES_MOCK: PVMetricsReadOnlyDataContractPrinciple[] =
  [
    {
      principleId: 'principle-schema-before-data',
      label: 'Esquema antes que datos',
      itemType: 'read-only-data-contract-principle',
      description:
        'Primero se define estructura, dominios y campos; después, en otra fase, se evalúa muestra sanitizada.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-real-values',
      label: 'Sin valores reales',
      itemType: 'read-only-data-contract-principle',
      description:
        'El contrato no contiene mediciones reales, credenciales, endpoints ni valores productivos.',
      mandatory: true,
    },
    {
      principleId: 'principle-read-only-semantics',
      label: 'Semántica solo lectura',
      itemType: 'read-only-data-contract-principle',
      description:
        'Los campos se orientan a lectura, análisis conceptual y visualización, nunca a control operacional.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-approval',
      label: 'Aprobación humana',
      itemType: 'read-only-data-contract-principle',
      description:
        'Toda transición hacia datos reales futuros requiere aprobación técnica, QA, cliente y seguridad.',
      mandatory: true,
    },
  ];

export const PV_METRICS_REQUIRED_DATA_DOMAINS_MOCK: PVMetricsRequiredDataDomain[] =
  [
    {
      domainId: 'domain-plant-identity',
      label: 'Identidad de planta',
      itemType: 'required-data-domain',
      description:
        'Dominio conceptual para identificar planta, zona, tecnología y capacidad sin datos sensibles.',
      required: true,
    },
    {
      domainId: 'domain-generation-timeseries',
      label: 'Serie temporal de generación',
      itemType: 'required-data-domain',
      description:
        'Dominio conceptual para potencia, energía y timestamp sin lectura live ni valores reales.',
      required: true,
    },
    {
      domainId: 'domain-weather-reference',
      label: 'Referencia meteorológica',
      itemType: 'required-data-domain',
      description:
        'Dominio conceptual para irradiancia, temperatura y variables climáticas no oficiales.',
      required: true,
    },
    {
      domainId: 'domain-availability-status',
      label: 'Estado de disponibilidad',
      itemType: 'required-data-domain',
      description:
        'Dominio conceptual opcional para flags read-only de disponibilidad o limitación.',
      required: false,
    },
  ];

export const PV_METRICS_REQUIRED_DATA_FIELDS_MOCK: PVMetricsRequiredDataField[] =
  [
    {
      fieldId: 'field-timestamp',
      label: 'timestamp',
      itemType: 'required-data-field',
      criticality: 'required',
      domain: 'generation-timeseries',
      expectedType: 'ISO datetime string',
      expectedUnit: 'UTC or America/Santiago explicitly declared',
      required: true,
      description:
        'Marca temporal normalizada para alinear series de generación y clima.',
    },
    {
      fieldId: 'field-active-power-kw',
      label: 'activePowerKw',
      itemType: 'required-data-field',
      criticality: 'required',
      domain: 'generation-timeseries',
      expectedType: 'number',
      expectedUnit: 'kW',
      required: true,
      description:
        'Campo conceptual de potencia activa para análisis read-only no oficial.',
    },
    {
      fieldId: 'field-energy-kwh',
      label: 'energyKwh',
      itemType: 'required-data-field',
      criticality: 'required',
      domain: 'generation-timeseries',
      expectedType: 'number',
      expectedUnit: 'kWh',
      required: true,
      description:
        'Campo conceptual de energía intervalar o acumulada según contrato futuro.',
    },
    {
      fieldId: 'field-irradiance-wm2',
      label: 'irradianceWm2',
      itemType: 'required-data-field',
      criticality: 'required',
      domain: 'weather-reference',
      expectedType: 'number',
      expectedUnit: 'W/m²',
      required: true,
      description:
        'Campo conceptual de irradiancia para evaluación futura no oficial.',
    },
    {
      fieldId: 'field-ambient-temperature-c',
      label: 'ambientTemperatureC',
      itemType: 'required-data-field',
      criticality: 'required',
      domain: 'weather-reference',
      expectedType: 'number',
      expectedUnit: '°C',
      required: true,
      description:
        'Campo conceptual de temperatura ambiente para análisis no oficial.',
    },
  ];

export const PV_METRICS_OPTIONAL_DATA_FIELDS_MOCK: PVMetricsOptionalDataField[] =
  [
    {
      fieldId: 'optional-module-temperature-c',
      label: 'moduleTemperatureC',
      itemType: 'optional-data-field',
      criticality: 'optional',
      domain: 'weather-reference',
      expectedType: 'number',
      expectedUnit: '°C',
      required: false,
      description:
        'Campo opcional conceptual de temperatura de módulo si existe fuente aprobada.',
    },
    {
      fieldId: 'optional-availability-flag',
      label: 'availabilityFlag',
      itemType: 'optional-data-field',
      criticality: 'optional',
      domain: 'availability-status',
      expectedType: 'boolean | enum',
      expectedUnit: 'N/A',
      required: false,
      description:
        'Flag conceptual de disponibilidad, sin ACK, control ni telemetría live.',
    },
    {
      fieldId: 'optional-curtailment-flag',
      label: 'curtailmentFlag',
      itemType: 'optional-data-field',
      criticality: 'optional',
      domain: 'availability-status',
      expectedType: 'boolean | enum',
      expectedUnit: 'N/A',
      required: false,
      description:
        'Flag conceptual de recorte o limitación, solo con autorización y sanitización futura.',
    },
  ];

export const PV_METRICS_FORBIDDEN_DATA_FIELDS_MOCK: PVMetricsForbiddenDataField[] =
  [
    {
      fieldId: 'forbidden-password',
      label: 'password',
      itemType: 'forbidden-data-field',
      criticality: 'forbidden',
      reason:
        'Passwords y credenciales están totalmente fuera del contrato de datos.',
      severity: 'critical',
    },
    {
      fieldId: 'forbidden-api-key',
      label: 'apiKey',
      itemType: 'forbidden-data-field',
      criticality: 'forbidden',
      reason:
        'API keys, tokens y secrets no deben aparecer en mocks, README, frontend ni contrato.',
      severity: 'critical',
    },
    {
      fieldId: 'forbidden-production-endpoint-url',
      label: 'productionEndpointUrl',
      itemType: 'forbidden-data-field',
      criticality: 'forbidden',
      reason:
        'Endpoints productivos reales no deben documentarse ni almacenarse.',
      severity: 'critical',
    },
    {
      fieldId: 'forbidden-setpoint-command',
      label: 'setpointCommand',
      itemType: 'forbidden-data-field',
      criticality: 'forbidden',
      reason:
        'Setpoints, consignas y comandos operacionales no pertenecen a un contrato read-only.',
      severity: 'critical',
    },
    {
      fieldId: 'forbidden-personal-data',
      label: 'personalData',
      itemType: 'forbidden-data-field',
      criticality: 'forbidden',
      reason:
        'Datos personales, correos, usuarios o identificadores sensibles deben excluirse.',
      severity: 'high',
    },
  ];

export const PV_METRICS_DATA_QUALITY_GATES_MOCK: PVMetricsDataQualityGate[] =
  [
    {
      gateId: 'quality-timezone',
      label: 'Timezone explícito',
      itemType: 'data-quality-gate',
      required: true,
      description:
        'Todo timestamp futuro debe declarar zona horaria o normalización UTC.',
    },
    {
      gateId: 'quality-units',
      label: 'Unidades explícitas',
      itemType: 'data-quality-gate',
      required: true,
      description:
        'Todo campo numérico debe declarar unidad esperada y criterio de conversión.',
    },
    {
      gateId: 'quality-missing-values',
      label: 'Tratamiento de datos faltantes',
      itemType: 'data-quality-gate',
      required: true,
      description:
        'Debe existir regla conceptual para nulos, gaps, NaN o muestras incompletas.',
    },
    {
      gateId: 'quality-granularity',
      label: 'Granularidad definida',
      itemType: 'data-quality-gate',
      required: true,
      description:
        'Debe declararse granularidad esperada, por ejemplo 5 min, 15 min, horario o diario.',
    },
  ];

export const PV_METRICS_DATA_SANITIZATION_GATES_MOCK: PVMetricsDataSanitizationGate[] =
  [
    {
      gateId: 'sanitize-no-secrets',
      label: 'Sin secrets',
      itemType: 'data-sanitization-gate',
      required: true,
      description:
        'Toda muestra futura debe confirmar ausencia de credenciales, tokens, API keys y passwords.',
    },
    {
      gateId: 'sanitize-no-personal-data',
      label: 'Sin datos personales',
      itemType: 'data-sanitization-gate',
      required: true,
      description:
        'Toda muestra futura debe excluir datos personales, correos, usuarios y rutas sensibles.',
    },
    {
      gateId: 'sanitize-no-production-endpoints',
      label: 'Sin endpoints productivos',
      itemType: 'data-sanitization-gate',
      required: true,
      description:
        'Toda muestra futura debe excluir URLs reales, IPs productivas y rutas internas sensibles.',
    },
  ];

export const PV_METRICS_DATA_OWNERSHIP_GATES_MOCK: PVMetricsDataOwnershipGate[] =
  [
    {
      gateId: 'ownership-client-approval',
      label: 'Aprobación cliente',
      itemType: 'data-ownership-gate',
      required: true,
      reviewerRole: 'client-owner',
      description:
        'El cliente debe aprobar cualquier muestra futura antes de su uso.',
    },
    {
      gateId: 'ownership-technical-approval',
      label: 'Aprobación técnica',
      itemType: 'data-ownership-gate',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'El responsable técnico debe validar estructura, dominios, unidades y límites.',
    },
    {
      gateId: 'ownership-qa-approval',
      label: 'Aprobación QA',
      itemType: 'data-ownership-gate',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'QA debe validar que el contrato no habilita datos reales, secrets ni acciones externas.',
    },
  ];

export const PV_METRICS_SCHEMA_REVIEW_GATES_MOCK: PVMetricsSchemaReviewGate[] =
  [
    {
      gateId: 'schema-required-fields',
      label: 'Required fields completos',
      itemType: 'schema-review-gate',
      required: true,
      description:
        'El esquema futuro debe contener campos mínimos antes de cualquier mock data avanzado.',
    },
    {
      gateId: 'schema-forbidden-fields',
      label: 'Forbidden fields bloqueados',
      itemType: 'schema-review-gate',
      required: true,
      description:
        'El esquema debe bloquear campos prohibidos como secrets, endpoints y comandos.',
    },
    {
      gateId: 'schema-read-only-semantics',
      label: 'Semántica read-only',
      itemType: 'schema-review-gate',
      required: true,
      description:
        'La estructura debe ser compatible con lectura y visualización, nunca con control.',
    },
  ];

export const PV_METRICS_DATA_CONTRACT_RISK_REGISTER_MOCK: PVMetricsDataContractRiskRegisterItem[] =
  [
    {
      riskId: 'risk-real-data-leak',
      label: 'Fuga de datos reales',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Mantener el mock sin valores reales y exigir sanitización antes de cualquier muestra futura.',
    },
    {
      riskId: 'risk-secret-in-schema',
      label: 'Secret incluido en esquema',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear campos de credenciales, tokens, API keys, passwords y endpoints reales.',
    },
    {
      riskId: 'risk-operational-command-field',
      label: 'Campo de comando operacional',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Excluir setpoints, comandos, SCADA ACK, BESS, inversores y telecontrol.',
    },
    {
      riskId: 'risk-official-forecast-confusion',
      label: 'Confusión con forecast oficial',
      itemType: 'risk-register-item',
      severity: 'high',
      mitigation:
        'Declarar que el contrato es conceptual y no produce forecast oficial ni reporte regulatorio.',
    },
  ];

export const PV_METRICS_DATA_CONTRACT_EXIT_CRITERIA_MOCK: PVMetricsDataContractExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript de data contract read-only está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'El pack queda poblado con mock data local, seguro y sin valores reales.',
    },
    {
      criterionId: 'exit-no-real-data',
      label: 'Sin datos reales',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'Este módulo no incorpora mediciones, endpoints, credenciales ni valores productivos.',
    },
    {
      criterionId: 'exit-safety-boundary',
      label: 'Safety Boundary declarada',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'Los límites de seguridad quedan declarados dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK: PVMetricsControlledReadOnlyDataContractPack =
  {
    packId: 'pvmetrics-controlled-read-only-data-contract-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-R — Controlled Read-Only Data Contract',
    module: '1O-R.1B — Read-Only Data Contract Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    dataContractPurpose: PV_METRICS_DATA_CONTRACT_PURPOSE_MOCK,
    allowedDataContractItems: PV_METRICS_ALLOWED_DATA_CONTRACT_ITEMS_MOCK,
    blockedDataContractItems: PV_METRICS_BLOCKED_DATA_CONTRACT_ITEMS_MOCK,
    readOnlyDataContractPrinciples:
      PV_METRICS_READ_ONLY_DATA_CONTRACT_PRINCIPLES_MOCK,
    requiredDataDomains: PV_METRICS_REQUIRED_DATA_DOMAINS_MOCK,
    requiredDataFields: PV_METRICS_REQUIRED_DATA_FIELDS_MOCK,
    optionalDataFields: PV_METRICS_OPTIONAL_DATA_FIELDS_MOCK,
    forbiddenDataFields: PV_METRICS_FORBIDDEN_DATA_FIELDS_MOCK,
    dataQualityGates: PV_METRICS_DATA_QUALITY_GATES_MOCK,
    dataSanitizationGates: PV_METRICS_DATA_SANITIZATION_GATES_MOCK,
    dataOwnershipGates: PV_METRICS_DATA_OWNERSHIP_GATES_MOCK,
    schemaReviewGates: PV_METRICS_SCHEMA_REVIEW_GATES_MOCK,
    dataContractRiskRegister: PV_METRICS_DATA_CONTRACT_RISK_REGISTER_MOCK,
    dataContractExitCriteria: PV_METRICS_DATA_CONTRACT_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Read-Only Data Contract mock data. No incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',
    nextRecommendedModule: '1O-R.2A — Data Contract Visual Card',
  };
