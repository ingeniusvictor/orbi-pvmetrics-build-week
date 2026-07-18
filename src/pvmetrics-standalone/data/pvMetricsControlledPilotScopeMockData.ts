import {
  PVMetricsAllowedPilotScopeItem,
  PVMetricsBlockedPilotScopeItem,
  PVMetricsClientApprovalGate,
  PVMetricsControlledPilotExitCriterion,
  PVMetricsControlledPilotRiskRegisterItem,
  PVMetricsControlledPilotScopeAgreementPack,
  PVMetricsDataAccessBoundary,
  PVMetricsLegalCommercialReviewNote,
  PVMetricsQaApprovalGate,
  PVMetricsReadOnlyIntegrationPrinciple,
  PVMetricsTechnicalApprovalGate,
} from '../types/pvmetrics-controlled-pilot-scope.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-P.1B-controlled-pilot-scope-mock-data';

export const PV_METRICS_CONTROLLED_PILOT_SCOPE_PURPOSE_MOCK: string[] = [
  'Definir un alcance seguro para un piloto futuro read-only.',
  'Separar demo local, piloto controlado y producción real como etapas distintas.',
  'Bloquear integración real prematura, telecontrol, setpoints y uso operacional.',
  'Declarar gates humanos antes de cualquier revisión técnica, comercial o cliente.',
  'Preparar lenguaje de acuerdo conceptual sin comprometer conectores reales.',
];

export const PV_METRICS_ALLOWED_PILOT_SCOPE_ITEMS_MOCK: PVMetricsAllowedPilotScopeItem[] =
  [
    {
      itemId: 'allowed-sanitized-historical-sample',
      label: 'Muestra histórica sanitizada',
      itemType: 'allowed-scope-item',
      description:
        'Uso conceptual de una muestra histórica aprobada, anonimizada o sanitizada para evaluación de flujo.',
      requiresHumanApproval: true,
    },
    {
      itemId: 'allowed-read-only-requirements',
      label: 'Requerimientos read-only',
      itemType: 'allowed-scope-item',
      description:
        'Levantamiento de requerimientos para posible integración futura de solo lectura.',
      requiresHumanApproval: true,
    },
    {
      itemId: 'allowed-non-official-report-review',
      label: 'Revisión de reportes no oficiales',
      itemType: 'allowed-scope-item',
      description:
        'Evaluación de estructura visual y narrativa de reportes conceptuales no regulatorios.',
      requiresHumanApproval: true,
    },
    {
      itemId: 'allowed-security-review',
      label: 'Revisión de seguridad conceptual',
      itemType: 'allowed-scope-item',
      description:
        'Revisión de límites, accesos, responsabilidades y controles antes de cualquier conector real.',
      requiresHumanApproval: true,
    },
  ];

export const PV_METRICS_BLOCKED_PILOT_SCOPE_ITEMS_MOCK: PVMetricsBlockedPilotScopeItem[] =
  [
    {
      itemId: 'blocked-direct-scada-connection',
      label: 'Conexión SCADA directa',
      itemType: 'blocked-scope-item',
      reason:
        'El bloque 1O-P no crea ni habilita conectores SCADA reales.',
      safeAlternative:
        'Documentar requerimiento futuro read-only sujeto a contrato, sandbox y QA.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-live-meter-read',
      label: 'Lectura live de medidores',
      itemType: 'blocked-scope-item',
      reason:
        'No se permite lectura directa de medidores físicos o comerciales desde este bloque.',
      safeAlternative:
        'Usar muestra histórica sanitizada y aprobada.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-credentials',
      label: 'Credenciales, tokens o secrets',
      itemType: 'blocked-scope-item',
      reason:
        'No se solicitan, almacenan ni pegan credenciales productivas.',
      safeAlternative:
        'Definir requerimiento de acceso como punto pendiente de seguridad.',
      severity: 'critical',
    },
    {
      itemId: 'blocked-operational-control',
      label: 'Control operacional',
      itemType: 'blocked-scope-item',
      reason:
        'Telecontrol, setpoints, BESS, inversores y SCADA ACK están fuera de alcance.',
      safeAlternative:
        'Mantener piloto como read-only, sin escritura ni comandos.',
      severity: 'critical',
    },
  ];

export const PV_METRICS_READ_ONLY_INTEGRATION_PRINCIPLES_MOCK: PVMetricsReadOnlyIntegrationPrinciple[] =
  [
    {
      principleId: 'principle-read-only',
      label: 'Solo lectura',
      itemType: 'read-only-principle',
      description:
        'Todo piloto futuro debe operar sin escritura, sin comandos y sin modificación de activos.',
      mandatory: true,
    },
    {
      principleId: 'principle-sanitized-data',
      label: 'Datos sanitizados',
      itemType: 'read-only-principle',
      description:
        'Las muestras deben estar anonimizadas, sanitizadas y aprobadas antes de uso.',
      mandatory: true,
    },
    {
      principleId: 'principle-environment-separation',
      label: 'Separación de ambientes',
      itemType: 'read-only-principle',
      description:
        'Demo, sandbox, piloto y producción deben tratarse como ambientes separados.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-approval',
      label: 'Aprobación humana',
      itemType: 'read-only-principle',
      description:
        'Toda transición hacia piloto requiere aprobación humana técnica, QA, cliente y comercial.',
      mandatory: true,
    },
  ];

export const PV_METRICS_DATA_ACCESS_BOUNDARIES_MOCK: PVMetricsDataAccessBoundary[] =
  [
    {
      boundaryId: 'boundary-approved-sample-only',
      label: 'Solo muestra aprobada',
      itemType: 'data-access-boundary',
      allowed: true,
      description:
        'Se permite considerar únicamente muestras sanitizadas y aprobadas para evaluación conceptual.',
    },
    {
      boundaryId: 'boundary-no-secrets',
      label: 'Sin secretos productivos',
      itemType: 'data-access-boundary',
      allowed: false,
      description:
        'No se deben solicitar, guardar, pegar ni exponer credenciales, tokens o secrets.',
    },
    {
      boundaryId: 'boundary-no-live-scada',
      label: 'Sin SCADA live',
      itemType: 'data-access-boundary',
      allowed: false,
      description:
        'No existe lectura ni conexión live a SCADA real desde este bloque.',
    },
    {
      boundaryId: 'boundary-no-live-meter',
      label: 'Sin medidores live',
      itemType: 'data-access-boundary',
      allowed: false,
      description:
        'No existe lectura live de medidores físicos, comerciales o regulatorios.',
    },
  ];

export const PV_METRICS_CLIENT_APPROVAL_GATES_MOCK: PVMetricsClientApprovalGate[] =
  [
    {
      gateId: 'client-gate-read-only-scope',
      label: 'Aprobación de alcance read-only',
      itemType: 'approval-gate',
      gateGroup: 'client',
      required: true,
      reviewerRole: 'client-owner',
      description:
        'El cliente debe aprobar que el piloto futuro será solo lectura y sin impacto operacional.',
    },
    {
      gateId: 'client-gate-data-authorization',
      label: 'Autorización de datos',
      itemType: 'approval-gate',
      gateGroup: 'client',
      required: true,
      reviewerRole: 'client-owner',
      description:
        'El cliente debe aprobar expresamente cualquier muestra sanitizada a revisar.',
    },
  ];

export const PV_METRICS_TECHNICAL_APPROVAL_GATES_MOCK: PVMetricsTechnicalApprovalGate[] =
  [
    {
      gateId: 'tech-gate-data-contract',
      label: 'Contrato de datos',
      itemType: 'approval-gate',
      gateGroup: 'technical',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Definir estructura esperada de datos antes de cualquier conector real futuro.',
    },
    {
      gateId: 'tech-gate-isolated-environment',
      label: 'Entorno aislado',
      itemType: 'approval-gate',
      gateGroup: 'technical',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Separar sandbox/piloto de cualquier entorno productivo o sistema operativo real.',
    },
  ];

export const PV_METRICS_QA_APPROVAL_GATES_MOCK: PVMetricsQaApprovalGate[] = [
  {
    gateId: 'qa-gate-no-write',
    label: 'Validación no-write',
    itemType: 'approval-gate',
    gateGroup: 'qa',
    required: true,
    reviewerRole: 'qa-owner',
    description:
      'Confirmar que no existe POST/PUT/PATCH/DELETE real ni comandos operacionales.',
  },
  {
    gateId: 'qa-gate-no-secrets',
    label: 'Validación no-secrets',
    itemType: 'approval-gate',
    gateGroup: 'qa',
    required: true,
    reviewerRole: 'qa-owner',
    description:
      'Confirmar que no se usan credenciales, tokens, secrets ni rutas productivas.',
  },
  {
    gateId: 'qa-gate-claims',
    label: 'Validación de claims',
    itemType: 'approval-gate',
    gateGroup: 'qa',
    required: true,
    reviewerRole: 'qa-owner',
    description:
      'Confirmar que no se promete producción, forecast oficial ni reporte regulatorio.',
  },
];

export const PV_METRICS_LEGAL_COMMERCIAL_REVIEW_NOTES_MOCK: PVMetricsLegalCommercialReviewNote[] =
  [
    {
      noteId: 'legal-note-scope-subject-to-approval',
      label: 'Alcance sujeto a aprobación',
      itemType: 'legal-commercial-note',
      ownerRole: 'legal-owner',
      note:
        'Todo piloto futuro debe quedar sujeto a aprobación escrita y alcance read-only definido.',
      requiresHumanReview: true,
    },
    {
      noteId: 'commercial-note-no-price-commitment',
      label: 'Sin compromiso de precio',
      itemType: 'legal-commercial-note',
      ownerRole: 'commercial-owner',
      note:
        'No se deben comprometer precios, plazos, SLA o entregables reales desde este mock.',
      requiresHumanReview: true,
    },
    {
      noteId: 'legal-note-data-authorization',
      label: 'Autorización de datos',
      itemType: 'legal-commercial-note',
      ownerRole: 'legal-owner',
      note:
        'El uso de cualquier dato real futuro requiere autorización, sanitización y documentación.',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_CONTROLLED_PILOT_RISK_REGISTER_MOCK: PVMetricsControlledPilotRiskRegisterItem[] =
  [
    {
      riskId: 'risk-scope-creep',
      label: 'Crecimiento de alcance',
      itemType: 'risk-register-item',
      severity: 'high',
      mitigation:
        'Mantener alcance read-only, gates humanos y blocked scope items visibles.',
      ownerRole: 'commercial-owner',
    },
    {
      riskId: 'risk-secret-exposure',
      label: 'Exposición de secretos',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Prohibir credenciales/tokens/secrets y exigir validación QA no-secrets.',
      ownerRole: 'qa-owner',
    },
    {
      riskId: 'risk-operational-impact',
      label: 'Impacto operacional accidental',
      itemType: 'risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear escritura, telecontrol, setpoints, BESS, inversores y SCADA ACK.',
      ownerRole: 'technical-owner',
    },
    {
      riskId: 'risk-regulatory-confusion',
      label: 'Confusión regulatoria',
      itemType: 'risk-register-item',
      severity: 'high',
      mitigation:
        'Reiterar que no hay envío CEN ni reportes oficiales/regulatorios.',
      ownerRole: 'qa-owner',
    },
  ];

export const PV_METRICS_CONTROLLED_PILOT_EXIT_CRITERIA_MOCK: PVMetricsControlledPilotExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript del alcance de piloto controlado está implementado.',
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
      criterionId: 'exit-no-real-integration',
      label: 'Sin integración real',
      itemType: 'exit-criterion',
      required: true,
      passed: true,
      description:
        'Este módulo no crea conectores reales, no usa credenciales y no lee sistemas reales.',
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

export const PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK: PVMetricsControlledPilotScopeAgreementPack =
  {
    packId: 'pvmetrics-controlled-pilot-scope-agreement-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock:
      '1O-P — Controlled Pilot Scope & Read-Only Integration Agreement',
    module: '1O-P.1B — Controlled Pilot Scope Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    pilotScopePurpose: PV_METRICS_CONTROLLED_PILOT_SCOPE_PURPOSE_MOCK,
    allowedPilotScopeItems: PV_METRICS_ALLOWED_PILOT_SCOPE_ITEMS_MOCK,
    blockedPilotScopeItems: PV_METRICS_BLOCKED_PILOT_SCOPE_ITEMS_MOCK,
    readOnlyIntegrationPrinciples:
      PV_METRICS_READ_ONLY_INTEGRATION_PRINCIPLES_MOCK,
    dataAccessBoundaries: PV_METRICS_DATA_ACCESS_BOUNDARIES_MOCK,
    clientApprovalGates: PV_METRICS_CLIENT_APPROVAL_GATES_MOCK,
    technicalApprovalGates: PV_METRICS_TECHNICAL_APPROVAL_GATES_MOCK,
    qaApprovalGates: PV_METRICS_QA_APPROVAL_GATES_MOCK,
    legalCommercialReviewNotes:
      PV_METRICS_LEGAL_COMMERCIAL_REVIEW_NOTES_MOCK,
    pilotRiskRegister: PV_METRICS_CONTROLLED_PILOT_RISK_REGISTER_MOCK,
    pilotExitCriteria: PV_METRICS_CONTROLLED_PILOT_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Controlled Pilot Scope mock data. No crea conectores reales, no usa credenciales, no tokens, no secrets, no lee SCADA real, no lee medidores reales, no envía CEN, no usa backend, no APIs, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule:
      '1O-P.2A — Pilot Scope & Read-Only Agreement Visual Card',
  };
