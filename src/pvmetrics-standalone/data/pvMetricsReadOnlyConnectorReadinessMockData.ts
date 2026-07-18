import {
  PVMetricsAllowedConnectorReadinessItem,
  PVMetricsBlockedConnectorReadinessItem,
  PVMetricsConnectorCandidateCategory,
  PVMetricsConnectorExitCriterion,
  PVMetricsConnectorRiskRegisterItem,
  PVMetricsControlledReadOnlyConnectorReadinessPack,
  PVMetricsCredentialSecretBoundary,
  PVMetricsDataContractReviewGate,
  PVMetricsQaConnectorSafetyGate,
  PVMetricsReadOnlyConnectorPrinciple,
  PVMetricsSandboxReadinessGate,
} from '../types/pvmetrics-read-only-connector-readiness.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion =
  '0.1O-Q.1B-read-only-connector-readiness-mock-data';

export const PV_METRICS_CONNECTOR_READINESS_PURPOSE_MOCK: string[] = [
  'Evaluar readiness conceptual para conectores futuros de solo lectura.',
  'Separar blueprint, sandbox, piloto y producción como etapas distintas.',
  'Bloquear conectores reales, credenciales, tokens, secrets y llamadas externas.',
  'Definir condiciones mínimas de contrato de datos, sandbox y QA antes de cualquier integración futura.',
  'Mantener ORBI PVMetrics IA completamente local, mock, read-only y no productivo.',
];

export const PV_METRICS_ALLOWED_CONNECTOR_READINESS_ITEMS_MOCK: PVMetricsAllowedConnectorReadinessItem[] =
  [
    {
      itemId: 'allowed-connector-category-review',
      label: 'Revisión de categorías candidatas',
      itemType: 'allowed-readiness-item',
      description:
        'Permite clasificar conectores futuros de forma conceptual, sin endpoints, credenciales ni llamadas reales.',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-data-contract-draft',
      label: 'Borrador de contrato de datos',
      itemType: 'allowed-readiness-item',
      description:
        'Permite definir campos esperados, frecuencia conceptual, formato y límites sin leer sistemas reales.',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-sandbox-checklist',
      label: 'Checklist de sandbox futuro',
      itemType: 'allowed-readiness-item',
      description:
        'Permite preparar criterios para un sandbox read-only aislado antes de cualquier conector real.',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-risk-review',
      label: 'Revisión de riesgos de conector',
      itemType: 'allowed-readiness-item',
      description:
        'Permite evaluar riesgos de secrets, escritura accidental, uso regulatorio indebido y alcance prematuro.',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_CONNECTOR_READINESS_ITEMS_MOCK: PVMetricsBlockedConnectorReadinessItem[] =
  [
    {
      itemId: 'blocked-real-scada-connector',
      label: 'Conector SCADA real',
      itemType: 'blocked-readiness-item',
      reason:
        'Este bloque no implementa conectores reales ni lectura de sistemas SCADA.',
      safeAlternative:
        'Mantener solo categoría conceptual y derivar a roadmap separado con contrato, sandbox and QA.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-real-meter-connector',
      label: 'Conector de medidores reales',
      itemType: 'blocked-readiness-item',
      reason:
        'Este bloque no implementa lectura de medidores físicos, comerciales o regulatorios.',
      safeAlternative:
        'Definir contrato de datos conceptual sin endpoint ni lectura real.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-secrets',
      label: 'Credenciales, tokens o secrets',
      itemType: 'blocked-readiness-item',
      reason:
        'Está prohibido incorporar credenciales, tokens, API keys, passwords o secrets.',
      safeAlternative:
        'Usar placeholders conceptuales sin valores reales.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-write-methods',
      label: 'Métodos de escritura',
      itemType: 'blocked-readiness-item',
      reason:
        'POST/PUT/PATCH/DELETE real, telecontrol, setpoints y comandos operacionales están fuera de alcance.',
      safeAlternative:
        'Restringir todo a evaluación read-only conceptual.',
      severity: 'critical',
    },
  ];

export const PV_METRICS_READ_ONLY_CONNECTOR_PRINCIPLES_MOCK: PVMetricsReadOnlyConnectorPrinciple[] =
  [
    {
      principleId: 'principle-read-only-only',
      label: 'Solo lectura estricta',
      itemType: 'read-only-principle',
      description:
        'Todo conector futuro debe partir como read-only, sin escritura, sin comandos y sin mutaciones.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-client-secrets',
      label: 'Sin secrets en cliente',
      itemType: 'read-only-principle',
      description:
        'No puede existir ningún token, API key, password o secret en frontend, mocks, README o localStorage.',
      mandatory: true,
    },
    {
      principleId: 'principle-contract-before-connector',
      label: 'Contrato antes de conector',
      itemType: 'read-only-principle',
      description:
        'Antes de cualquier implementación futura debe existir contrato de datos aprobado.',
      mandatory: true,
    },
    {
      principleId: 'principle-sandbox-before-pilot',
      label: 'Sandbox antes de piloto',
      itemType: 'read-only-principle',
      description:
        'Cualquier prueba futura debe pasar por sandbox aislado antes de piloto con datos reales.',
      mandatory: true,
    },
  ];

export const PV_METRICS_CONNECTOR_CANDIDATE_CATEGORIES_MOCK: PVMetricsConnectorCandidateCategory[] =
  [
    {
      categoryId: 'candidate-scada-read-only',
      label: 'SCADA read-only futuro',
      itemType: 'connector-candidate-category',
      status: 'blocked-until-approved',
      description:
        'Categoría conceptual para lectura futura de SCADA. No contiene endpoints, credenciales ni llamadas reales.',
    },
    {
      categoryId: 'candidate-meter-read-only',
      label: 'Medidores read-only futuros',
      itemType: 'connector-candidate-category',
      status: 'blocked-until-approved',
      description:
        'Categoría conceptual para lectura futura de medidores. Requiere contrato, sandbox, QA y aprobación cliente.',
    },
    {
      categoryId: 'candidate-weather-api-read-only',
      label: 'Weather API read-only futura',
      itemType: 'connector-candidate-category',
      status: 'blocked-until-approved',
      description:
        'Categoría conceptual para datos meteorológicos externos. No usa API key ni request real.',
    },
    {
      categoryId: 'candidate-sanitized-file-import',
      label: 'Importación sanitizada futura',
      itemType: 'connector-candidate-category',
      status: 'concept-only',
      description:
        'Categoría conceptual para revisar muestras estáticas aprobadas y sanitizadas, sin backend ni persistencia real.',
    },
  ];

export const PV_METRICS_CREDENTIAL_SECRET_BOUNDARIES_MOCK: PVMetricsCredentialSecretBoundary[] =
  [
    {
      boundaryId: 'boundary-no-frontend-secrets',
      label: 'Sin secrets en frontend',
      itemType: 'credential-secret-boundary',
      allowed: false,
      description:
        'No se permiten credenciales, tokens, API keys, passwords ni secrets en código cliente.',
    },
    {
      boundaryId: 'boundary-no-local-storage-secrets',
      label: 'Sin secrets en localStorage',
      itemType: 'credential-secret-boundary',
      allowed: false,
      description:
        'No se permite guardar secretos o configuraciones productivas en localStorage.',
    },
    {
      boundaryId: 'boundary-no-production-env',
      label: 'Sin variables productivas',
      itemType: 'credential-secret-boundary',
      allowed: false,
      description:
        'No se agregan variables de entorno productivas ni endpoints reales en este bloque.',
    },
    {
      boundaryId: 'boundary-conceptual-placeholder',
      label: 'Placeholders conceptuales',
      itemType: 'credential-secret-boundary',
      allowed: true,
      description:
        'Solo se permiten nombres conceptuales sin valores reales para documentar necesidades futuras.',
    },
  ];

export const PV_METRICS_DATA_CONTRACT_REVIEW_GATES_MOCK: PVMetricsDataContractReviewGate[] =
  [
    {
      gateId: 'gate-field-definition',
      label: 'Definición de campos',
      itemType: 'data-contract-gate',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Definir campos esperados, unidades, granularidad y formato sin leer sistemas reales.',
    },
    {
      gateId: 'gate-sanitization',
      label: 'Sanitización de datos',
      itemType: 'data-contract-gate',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Confirmar que cualquier muestra futura esté anonimizada, aprobada y libre de datos sensibles.',
    },
    {
      gateId: 'gate-client-authorization',
      label: 'Autorización cliente',
      itemType: 'data-contract-gate',
      required: true,
      reviewerRole: 'client-owner',
      description:
        'Confirmar autorización explícita antes de cualquier uso futuro de datos reales.',
    },
  ];

export const PV_METRICS_SANDBOX_READINESS_GATES_MOCK: PVMetricsSandboxReadinessGate[] =
  [
    {
      gateId: 'sandbox-isolation',
      label: 'Aislamiento de sandbox',
      itemType: 'sandbox-readiness-gate',
      required: true,
      description:
        'El sandbox futuro debe estar separado de producción y sin capacidad de escritura.',
    },
    {
      gateId: 'sandbox-no-production-secrets',
      label: 'Sin secrets productivos',
      itemType: 'sandbox-readiness-gate',
      required: true,
      description:
        'El sandbox futuro no debe usar credenciales productivas, personales ni compartidas.',
    },
    {
      gateId: 'sandbox-auditability',
      label: 'Auditoría segura',
      itemType: 'sandbox-readiness-gate',
      required: true,
      description:
        'Toda prueba futura debe ser auditable sin exponer datos sensibles o credenciales.',
    },
  ];

export const PV_METRICS_QA_CONNECTOR_SAFETY_GATES_MOCK: PVMetricsQaConnectorSafetyGate[] =
  [
    {
      gateId: 'qa-no-write',
      label: 'Validación no-write',
      itemType: 'qa-safety-gate',
      required: true,
      description:
        'QA debe confirmar ausencia de POST/PUT/PATCH/DELETE real, telecontrol y comandos operacionales.',
    },
    {
      gateId: 'qa-no-real-calls',
      label: 'Validación sin llamadas reales',
      itemType: 'qa-safety-gate',
      required: true,
      description:
        'QA debe confirmar que no se llama SCADA, medidores, CEN, weather APIs ni servicios externos reales.',
    },
    {
      gateId: 'qa-no-secret-storage',
      label: 'Validación no-secrets',
      itemType: 'qa-safety-gate',
      required: true,
      description:
        'QA debe confirmar ausencia de credenciales, tokens, secrets, API keys y rutas productivas.',
    },
  ];

export const PV_METRICS_CONNECTOR_RISK_REGISTER_MOCK: PVMetricsConnectorRiskRegisterItem[] =
  [
    {
      riskId: 'risk-premature-real-connector',
      label: 'Conector real prematuro',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear implementación real hasta contrato de datos, sandbox, QA y aprobación humana.',
    },
    {
      riskId: 'risk-secret-leak',
      label: 'Filtración de secrets',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Prohibir secrets en frontend, mocks, README, localStorage, commits y variables productivas.',
    },
    {
      riskId: 'risk-write-capability',
      label: 'Capacidad de escritura accidental',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Validar no-write y bloquear cualquier POST/PUT/PATCH/DELETE real o comando operacional.',
    },
    {
      riskId: 'risk-regulatory-confusion',
      label: 'Confusión regulatoria',
      itemType: 'risk-register-item',
      severity: 'high',
      mitigation:
        'Declarar que no existe envío CEN ni reporte oficial/regulatorio desde este bloque.',
    },
  ];

export const PV_METRICS_CONNECTOR_EXIT_CRITERIA_MOCK: PVMetricsConnectorExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript de connector readiness está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'El pack queda poblado con mock data local, seguro y no productivo.',
    },
    {
      criterionId: 'exit-no-real-connectors',
      label: 'Sin conectores reales',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'Este módulo no crea conectores reales ni llama APIs, SCADA, medidores o CEN.',
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

export const PV_METRICS_CONTROLLED_READ_ONLY_CONNECTOR_READINESS_PACK_MOCK: PVMetricsControlledReadOnlyConnectorReadinessPack =
  {
    packId: 'pvmetrics-controlled-read-only-connector-readiness-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-Q — Controlled Read-Only Connector Readiness',
    module: '1O-Q.1B — Read-Only Connector Readiness Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    connectorReadinessPurpose: PV_METRICS_CONNECTOR_READINESS_PURPOSE_MOCK,
    allowedConnectorReadinessItems:
      PV_METRICS_ALLOWED_CONNECTOR_READINESS_ITEMS_MOCK,
    blockedConnectorReadinessItems:
      PV_METRICS_BLOCKED_CONNECTOR_READINESS_ITEMS_MOCK,
    readOnlyConnectorPrinciples:
      PV_METRICS_READ_ONLY_CONNECTOR_PRINCIPLES_MOCK,
    connectorCandidateCategories:
      PV_METRICS_CONNECTOR_CANDIDATE_CATEGORIES_MOCK,
    credentialSecretBoundaries:
      PV_METRICS_CREDENTIAL_SECRET_BOUNDARIES_MOCK,
    dataContractReviewGates: PV_METRICS_DATA_CONTRACT_REVIEW_GATES_MOCK,
    sandboxReadinessGates: PV_METRICS_SANDBOX_READINESS_GATES_MOCK,
    qaConnectorSafetyGates: PV_METRICS_QA_CONNECTOR_SAFETY_GATES_MOCK,
    connectorRiskRegister: PV_METRICS_CONNECTOR_RISK_REGISTER_MOCK,
    connectorExitCriteria: PV_METRICS_CONNECTOR_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Read-Only Connector Readiness mock data. No crea conectores reales, no usa credenciales, no tokens, no secrets, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule:
      '1O-Q.2A — Connector Readiness Visual Card',
  };
