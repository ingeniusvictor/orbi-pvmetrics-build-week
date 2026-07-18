import {
  PVMetricsFutureConnectorContractRequirement,
  PVMetricsFutureConnectorHumanReviewRequirement,
  PVMetricsFutureConnectorQaRequirement,
  PVMetricsFutureConnectorRegistry,
  PVMetricsFutureConnectorRegistryItem,
} from '../types/pvmetrics-future-connector-registry.types';
import {
  PVMetricsReadOnlyDataDomain,
  PVMetricsReadOnlyForbiddenOperation,
} from '../types/pvmetrics-readonly-data-contract.types';

const globalForbiddenOperations: PVMetricsReadOnlyForbiddenOperation[] = [
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

const globalSafetyBoundaries = [
  'No crea conectores reales.',
  'No conecta SCADA real.',
  'No lee medidores reales.',
  'No llama weather APIs.',
  'No envía información al CEN.',
  'No usa credenciales.',
  'No usa secrets.',
  'No usa backend.',
  'No usa localStorage.',
  'No ejecuta POST/PUT/PATCH/DELETE.',
  'No habilita telecontrol.',
  'No modifica setpoints.',
  'No controla BESS.',
  'No controla inversores.',
];

const baseQaRequirements: PVMetricsFutureConnectorQaRequirement[] = [
  {
    requirementId: 'qa-read-only-contract',
    label: 'Contrato read-only obligatorio',
    required: true,
    description:
      'Todo conector futuro debe declarar contrato read-only antes de cualquier implementación.',
  },
  {
    requirementId: 'qa-no-write-methods',
    label: 'Sin métodos mutativos',
    required: true,
    description:
      'El diseño futuro debe bloquear POST, PUT, PATCH, DELETE y cualquier comando operativo.',
  },
  {
    requirementId: 'qa-freshness-quality-gate',
    label: 'Gate de freshness y calidad',
    required: true,
    description:
      'Todo paquete futuro debe pasar por el Source Freshness & Data Quality Gate.',
  },
];

const baseHumanReviewRequirements: PVMetricsFutureConnectorHumanReviewRequirement[] = [
  {
    reviewId: 'review-owner-consent',
    label: 'Consentimiento del propietario del sistema',
    ownerHint: 'client-owner',
    requiredBeforeActivation: true,
    description:
      'Cualquier conexión futura requiere autorización explícita del propietario del sistema.',
  },
  {
    reviewId: 'review-security-scope',
    label: 'Revisión de alcance de seguridad',
    ownerHint: 'security',
    requiredBeforeActivation: true,
    description:
      'El alcance debe ser solo lectura y sin permisos de escritura, despacho o control.',
  },
  {
    reviewId: 'review-data-governance',
    label: 'Gobernanza de datos',
    ownerHint: 'data-governance',
    requiredBeforeActivation: true,
    description:
      'Debe existir trazabilidad de fuente, timestamp, unidad, dominio y separación FV/BESS.',
  },
];

const createContractRequirement = (
  contractRequirementId: string,
  domain: PVMetricsReadOnlyDataDomain,
  label: string,
): PVMetricsFutureConnectorContractRequirement => ({
  contractRequirementId,
  domain,
  label,
  mustHaveSourceId: true,
  mustHaveTimestamp: true,
  mustHaveUnit: true,
  mustSeparatePvBess:
    domain === 'scada' ||
    domain === 'meter' ||
    domain === 'forecast' ||
    domain === 'commercial-impact',
  mustPassFreshnessGate: true,
  mustPassQualityGate: true,
  description:
    'Requisito mock para asegurar trazabilidad, freshness, calidad y uso read-only antes de cualquier integración futura.',
});

const safetyBoundary =
  'Este registro es mock y conceptual. No crea conectores reales, no usa credenciales, no llama APIs, no conecta SCADA, no lee medidores, no envía información al CEN, no ejecuta escritura externa, no modifica setpoints, no controla BESS y no controla inversores.';

const items: PVMetricsFutureConnectorRegistryItem[] = [
  {
    connectorId: 'future-plant-profile-readonly',
    label: 'Plant Profile Read-Only',
    description:
      'Conector conceptual futuro para leer perfil de planta, capacidad, tecnología, zona horaria y separación FV/BESS.',
    connectorFamily: 'plant-profile',
    sourceType: 'future-file-import',
    domains: ['plant-profile'],
    lifecycleStatus: 'contract-defined',
    securityStatus: 'read-only-required',
    permissionStatus: 'owner-consent-required',
    riskLevel: 'medium',
    allowedAccessMode: 'read-only',
    allowedCapabilities: [
      'read-plant-profile',
      'validate-data-quality',
      'normalize-units',
      'separate-pv-bess',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-plant-profile',
        'plant-profile',
        'Perfil de planta trazable',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Listo solo como contrato conceptual. Requiere consentimiento y definición de fuente antes de activar cualquier lectura real.',
    safetyBoundary,
  },
  {
    connectorId: 'future-weather-provider-readonly',
    label: 'Weather Provider Read-Only',
    description:
      'Conector conceptual futuro para clima, irradiancia, nubosidad y temperatura sin llamar APIs todavía.',
    connectorFamily: 'weather-provider',
    sourceType: 'future-api',
    domains: ['weather', 'forecast'],
    lifecycleStatus: 'concept',
    securityStatus: 'credential-review-required',
    permissionStatus: 'credential-scope-required',
    riskLevel: 'high',
    allowedAccessMode: 'contract-only',
    allowedCapabilities: [
      'read-weather-data',
      'validate-freshness',
      'validate-data-quality',
      'normalize-units',
      'generate-mock-summary',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-weather',
        'weather',
        'Datos climáticos con timestamp y unidad',
      ),
      createContractRequirement(
        'contract-forecast',
        'forecast',
        'Uso conceptual en forecast mock',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Solo blueprint. No existe API key, no existe llamada climática y no existe forecast real.',
    blockedReason:
      'Bloqueado para integración real hasta definir proveedor, contrato, scopes y manejo seguro de credenciales.',
    safetyBoundary,
  },
  {
    connectorId: 'future-scada-readonly',
    label: 'SCADA Read-Only',
    description:
      'Conector conceptual futuro para señales SCADA solo lectura, sin telecontrol ni acknowledge de alarmas.',
    connectorFamily: 'scada',
    sourceType: 'future-scada-read',
    domains: ['scada', 'operational-events', 'forecast-accuracy'],
    lifecycleStatus: 'concept',
    securityStatus: 'blocked-telecontrol-risk',
    permissionStatus: 'permission-blocked',
    riskLevel: 'critical',
    allowedAccessMode: 'blocked',
    allowedCapabilities: [
      'read-scada-signal',
      'validate-freshness',
      'validate-data-quality',
      'separate-pv-bess',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-scada',
        'scada',
        'Señales SCADA solo lectura',
      ),
      createContractRequirement(
        'contract-operational-events',
        'operational-events',
        'Eventos operacionales trazables',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Alto riesgo. Debe permanecer bloqueado hasta demostrar read-only estricto, sin telecontrol, sin setpoints y sin acknowledge.',
    blockedReason:
      'Riesgo crítico por cercanía a operación real, telecontrol, alarmas y setpoints.',
    safetyBoundary,
  },
  {
    connectorId: 'future-meter-readonly',
    label: 'Meter Read-Only',
    description:
      'Conector conceptual futuro para energía medida, sin comandos de medidor ni uso en billing real.',
    connectorFamily: 'meter',
    sourceType: 'future-meter-read',
    domains: ['meter', 'forecast-accuracy', 'commercial-impact'],
    lifecycleStatus: 'concept',
    securityStatus: 'read-only-required',
    permissionStatus: 'owner-consent-required',
    riskLevel: 'high',
    allowedAccessMode: 'contract-only',
    allowedCapabilities: [
      'read-meter-energy',
      'validate-freshness',
      'validate-data-quality',
      'normalize-units',
      'separate-pv-bess',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-meter',
        'meter',
        'Lectura de energía medida trazable',
      ),
      createContractRequirement(
        'contract-commercial-meter',
        'commercial-impact',
        'Uso comercial conceptual no billing',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Solo contrato futuro. No lee medidores reales ni calcula facturación.',
    blockedReason:
      'Debe bloquear cualquier comando de medidor o uso de billing real.',
    safetyBoundary,
  },
  {
    connectorId: 'future-cen-readiness',
    label: 'CEN Readiness No-Submit',
    description:
      'Conector conceptual futuro para preparación regulatoria sin envío real al CEN.',
    connectorFamily: 'cen-readiness',
    sourceType: 'future-regulatory-read',
    domains: ['cen-compliance'],
    lifecycleStatus: 'contract-defined',
    securityStatus: 'consent-required',
    permissionStatus: 'owner-consent-required',
    riskLevel: 'high',
    allowedAccessMode: 'no-submit',
    allowedCapabilities: [
      'read-cen-readiness',
      'validate-data-quality',
      'generate-mock-summary',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-cen-readiness',
        'cen-compliance',
        'Readiness regulatorio sin envío',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Puede modelar readiness conceptual, pero queda prohibido cualquier envío regulatorio real.',
    blockedReason:
      'CEN_SUBMIT debe permanecer prohibido en todas las fases actuales.',
    safetyBoundary,
  },
  {
    connectorId: 'future-om-events-readonly',
    label: 'O&M Events Read-Only',
    description:
      'Conector conceptual futuro para importar eventos de O&M sin crear ni cerrar órdenes de trabajo.',
    connectorFamily: 'om-events',
    sourceType: 'future-file-import',
    domains: ['operational-events', 'forecast-accuracy'],
    lifecycleStatus: 'mock-ready',
    securityStatus: 'safe-mock-only',
    permissionStatus: 'no-permission-needed-mock',
    riskLevel: 'low',
    allowedAccessMode: 'mock-only',
    allowedCapabilities: [
      'read-om-event',
      'validate-data-quality',
      'generate-mock-summary',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-om-events',
        'operational-events',
        'Eventos O&M mock importables',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Seguro como mock local. No crea órdenes, no cierra tareas y no despacha cuadrillas.',
    safetyBoundary,
  },
  {
    connectorId: 'future-commercial-assumptions-readonly',
    label: 'Commercial Assumptions Read-Only',
    description:
      'Conector conceptual futuro para supuestos comerciales controlados sin contratos reales, ERP ni billing.',
    connectorFamily: 'commercial-assumptions',
    sourceType: 'future-commercial-read',
    domains: ['commercial-impact', 'executive-intelligence'],
    lifecycleStatus: 'mock-ready',
    securityStatus: 'safe-mock-only',
    permissionStatus: 'no-permission-needed-mock',
    riskLevel: 'medium',
    allowedAccessMode: 'mock-only',
    allowedCapabilities: [
      'read-commercial-assumption',
      'validate-data-quality',
      'generate-mock-summary',
    ],
    forbiddenOperations: globalForbiddenOperations,
    contractRequirements: [
      createContractRequirement(
        'contract-commercial-assumptions',
        'commercial-impact',
        'Supuestos comerciales mock',
      ),
    ],
    qaRequirements: baseQaRequirements,
    humanReviewRequirements: baseHumanReviewRequirements,
    readinessSummary:
      'Seguro como mock local. No usa precios reales, contratos reales, ERP ni billing.',
    safetyBoundary,
  },
];

export const PV_METRICS_FUTURE_CONNECTOR_REGISTRY_MOCK_DATA: PVMetricsFutureConnectorRegistry =
  {
    registryId: 'pvmetrics-future-connector-registry-mock-data',
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-G — Read-Only Data Contract & Connector Readiness',
    module: '1O-G.3B — Future Connector Registry Mock Data',
    internalVersion: '0.1O-G.3B-future-connector-registry-mock-data',
    registryStatus: 'mock-registry-ready',
    items,
    summary: {
      totalConnectors: items.length,
      mockReadyCount: items.filter((item) => item.lifecycleStatus === 'mock-ready')
        .length,
      approvedForFutureReadOnlyCount: items.filter(
        (item) => item.lifecycleStatus === 'approved-for-future-read-only',
      ).length,
      blockedCount: items.filter((item) => item.allowedAccessMode === 'blocked')
        .length,
      credentialReviewRequiredCount: items.filter(
        (item) => item.securityStatus === 'credential-review-required',
      ).length,
      consentRequiredCount: items.filter(
        (item) =>
          item.permissionStatus === 'owner-consent-required' ||
          item.securityStatus === 'consent-required',
      ).length,
      criticalRiskCount: items.filter((item) => item.riskLevel === 'critical')
        .length,
    },
    globalForbiddenOperations,
    globalSafetyBoundaries,
    nextRecommendedModule:
      '1O-G.3C.1 — Future Connector Registry Visual Card',
  };
