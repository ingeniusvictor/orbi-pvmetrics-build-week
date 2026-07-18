import {
  PVMetricsAllowedPilotMaterial,
  PVMetricsBlockedPilotClaim,
  PVMetricsClientHandoffSection,
  PVMetricsClientPilotHandoffPack,
  PVMetricsDecisionGate,
  PVMetricsHumanReviewRequirement,
  PVMetricsPilotHandoffExitCriterion,
  PVMetricsPilotReadinessCondition,
  PVMetricsPilotRiskRegisterItem,
  PVMetricsReadOnlyFutureIntegrationCondition,
  PVMetricsSafeNextStep,
} from '../types/pvmetrics-client-pilot-handoff.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-K.1B-client-pilot-handoff-mock-data';

export const PV_METRICS_CLIENT_HANDOFF_SECTIONS_MOCK: PVMetricsClientHandoffSection[] =
  [
    {
      sectionId: 'handoff-context',
      label: 'Contexto del prototipo',
      objective:
        'Explicar que ORBI PVMetrics IA es una app independiente, local, mock, read-only y segura.',
      clientMessage:
        'La solución se presenta como prototipo avanzado para evaluar valor, flujo de trabajo y condiciones de un piloto futuro.',
      audienceTypes: ['client-executive', 'client-technical'],
      required: true,
    },
    {
      sectionId: 'handoff-capabilities',
      label: 'Capacidades demostrables',
      objective:
        'Mostrar wizard, sandbox, evidence pack, demo flow, safety locks y reportes copiables.',
      clientMessage:
        'La demo permite revisar experiencia, trazabilidad y enfoque de seguridad sin conectarse a sistemas reales.',
      audienceTypes: ['client-executive', 'client-technical', 'internal-commercial'],
      required: true,
    },
    {
      sectionId: 'handoff-boundaries',
      label: 'Límites de seguridad',
      objective:
        'Declarar explícitamente que no existe conexión a SCADA, medidores, CEN, clima, backend, correo ni telecontrol.',
      clientMessage:
        'La demo no opera plantas reales, no envía datos externos y no modifica ningún sistema operacional.',
      audienceTypes: ['client-executive', 'client-technical', 'operations-review'],
      required: true,
    },
    {
      sectionId: 'handoff-pilot-path',
      label: 'Ruta hacia piloto seguro',
      objective:
        'Definir pasos mínimos para una futura evaluación piloto read-only aprobada.',
      clientMessage:
        'Cualquier piloto real requiere aprobación formal, alcance limitado, contrato read-only y revisión humana.',
      audienceTypes: ['client-executive', 'client-technical', 'operations-review'],
      required: true,
    },
    {
      sectionId: 'handoff-review-requirements',
      label: 'Revisión humana obligatoria',
      objective:
        'Reforzar que cualquier dato real, interpretación externa o integración futura requiere revisión humana.',
      clientMessage:
        'Antes de usar datos reales o compartir resultados externos debe existir revisión humana y control de alcance.',
      audienceTypes: ['internal-qa', 'operations-review', 'client-technical'],
      required: true,
    },
  ];

export const PV_METRICS_ALLOWED_PILOT_MATERIALS_MOCK: PVMetricsAllowedPilotMaterial[] =
  [
    {
      materialId: 'wizard-local',
      label: 'Wizard local',
      description:
        'Configurador visual local para explicar el flujo conceptual de ORBI PVMetrics IA.',
      clientVisible: true,
      safetyNote: 'No conecta sistemas reales ni persiste datos.',
    },
    {
      materialId: 'controlled-sandbox-mock',
      label: 'Controlled Sandbox mock',
      description:
        'Sandbox simulado para mostrar gates, bloqueos y escenarios seguros.',
      clientVisible: true,
      safetyNote: 'Opera solo con escenarios mock.',
    },
    {
      materialId: 'pilot-evidence-pack',
      label: 'Pilot Evidence Pack',
      description:
        'Paquete de evidencia piloto conceptual con límites y readiness.',
      clientVisible: true,
      safetyNote: 'No constituye reporte oficial ni regulatorio.',
    },
    {
      materialId: 'client-demo-narrative',
      label: 'Client Demo Narrative',
      description:
        'Narrativa cliente para explicar valor, límites y próximos pasos.',
      clientVisible: true,
      safetyNote: 'Debe presentarse como demo local y no como producción.',
    },
    {
      materialId: 'presentation-flow-card',
      label: 'Presentation Flow Card',
      description:
        'Tarjeta visual con flujo de presentación, guion seguro y guardrails.',
      clientVisible: true,
      safetyNote: 'Guía de presentación, no modo runtime activo.',
    },
    {
      materialId: 'demo-safety-locks-card',
      label: 'Demo Safety Locks Card',
      description:
        'Tarjeta visual de bloqueos activos y capacidades prohibidas.',
      clientVisible: true,
      safetyNote: 'Confirma que no hay red, persistencia ni control operacional.',
    },
    {
      materialId: 'plain-text-reports',
      label: 'Reportes copiables en texto plano',
      description:
        'Textos locales copiables para revisión interna y resumen cliente.',
      clientVisible: true,
      safetyNote: 'No son PDF real ni correo automático.',
    },
    {
      materialId: 'qa-checklist',
      label: 'QA Checklist',
      description:
        'Checklist de validación técnica y límites de seguridad del prototipo.',
      clientVisible: false,
      safetyNote: 'Material interno de control y trazabilidad.',
    },
  ];

export const PV_METRICS_BLOCKED_PILOT_CLAIMS_MOCK: PVMetricsBlockedPilotClaim[] =
  [
    {
      claimId: 'real-scada-connected',
      forbiddenClaim: 'La app ya está conectada a SCADA real.',
      safeAlternative:
        'La app demuestra cómo podría evaluarse una integración futura bajo contrato read-only.',
      severity: 'critical',
    },
    {
      claimId: 'real-meter-reading',
      forbiddenClaim: 'La app lee medidores reales.',
      safeAlternative:
        'La app usa mock data local y puede preparar criterios para una futura lectura read-only aprobada.',
      severity: 'critical',
    },
    {
      claimId: 'cen-submit-enabled',
      forbiddenClaim: 'La app envía información al CEN.',
      safeAlternative:
        'La app no envía CEN; solo muestra una narrativa conceptual de readiness.',
      severity: 'critical',
    },
    {
      claimId: 'official-reporting',
      forbiddenClaim: 'La app genera reportes oficiales.',
      safeAlternative:
        'La app genera textos conceptuales copiables para revisión humana.',
      severity: 'high',
    },
    {
      claimId: 'telecontrol-enabled',
      forbiddenClaim: 'La app permite telecontrol.',
      safeAlternative:
        'La app excluye telecontrol, setpoints, BESS commands e inverter commands.',
      severity: 'critical',
    },
    {
      claimId: 'production-ready',
      forbiddenClaim: 'La app ya está lista para operación productiva.',
      safeAlternative:
        'La app está lista para demo local segura y conversación piloto controlada.',
      severity: 'high',
    },
  ];

export const PV_METRICS_PILOT_READINESS_CONDITIONS_MOCK: PVMetricsPilotReadinessCondition[] =
  [
    {
      conditionId: 'client-scope-approved',
      label: 'Alcance piloto aprobado',
      required: true,
      status: 'requires-human-review',
      description:
        'Debe existir un alcance escrito que limite el piloto a lectura, revisión y validación conceptual.',
    },
    {
      conditionId: 'readonly-contract',
      label: 'Contrato read-only',
      required: true,
      status: 'pending',
      description:
        'Toda fuente futura debe quedar limitada a lectura y sin control operacional.',
    },
    {
      conditionId: 'data-sanitization',
      label: 'Sanitización de datos',
      required: true,
      status: 'pending',
      description:
        'Cualquier dato real futuro debe ser sanitizado y aprobado antes de cargarse.',
    },
    {
      conditionId: 'human-review',
      label: 'Revisión humana obligatoria',
      required: true,
      status: 'requires-human-review',
      description:
        'Todo resultado externo debe ser revisado por una persona responsable.',
    },
    {
      conditionId: 'no-telecontrol',
      label: 'Exclusión de telecontrol',
      required: true,
      status: 'ready',
      description:
        'El piloto excluye setpoints, comandos BESS, comandos inversores y ACK SCADA.',
    },
  ];

export const PV_METRICS_HUMAN_REVIEW_REQUIREMENTS_MOCK: PVMetricsHumanReviewRequirement[] =
  [
    {
      requirementId: 'review-before-real-data',
      label: 'Revisión antes de datos reales',
      requiredBefore: 'Cargar o interpretar cualquier dato real futuro.',
      reviewerRole: 'technical-owner',
      required: true,
    },
    {
      requirementId: 'review-before-client-share',
      label: 'Revisión antes de compartir con cliente',
      requiredBefore: 'Enviar o presentar resultados fuera del equipo interno.',
      reviewerRole: 'qa-owner',
      required: true,
    },
    {
      requirementId: 'review-before-commercial-interpretation',
      label: 'Revisión antes de interpretación comercial',
      requiredBefore: 'Usar resultados para conclusiones comerciales o contractuales.',
      reviewerRole: 'commercial-owner',
      required: true,
    },
    {
      requirementId: 'review-before-operations',
      label: 'Revisión operacional',
      requiredBefore: 'Relacionar resultados con condiciones de operación de planta.',
      reviewerRole: 'operations-owner',
      required: true,
    },
  ];

export const PV_METRICS_READ_ONLY_FUTURE_INTEGRATION_CONDITIONS_MOCK: PVMetricsReadOnlyFutureIntegrationCondition[] =
  [
    {
      conditionId: 'source-documented',
      label: 'Fuente documentada',
      required: true,
      description: 'Toda fuente futura debe estar identificada y documentada.',
      forbiddenIfMissing: true,
    },
    {
      conditionId: 'data-owner-approved',
      label: 'Dueño de datos aprobado',
      required: true,
      description: 'Debe existir autorización explícita del dueño de datos.',
      forbiddenIfMissing: true,
    },
    {
      conditionId: 'no-frontend-secrets',
      label: 'Sin secretos en frontend',
      required: true,
      description: 'No se permiten credenciales, tokens o secrets en el frontend.',
      forbiddenIfMissing: true,
    },
    {
      conditionId: 'no-write-endpoints',
      label: 'Sin endpoints de escritura',
      required: true,
      description: 'La integración futura no debe incluir endpoints de escritura.',
      forbiddenIfMissing: true,
    },
    {
      conditionId: 'manual-rollback',
      label: 'Rollback manual definido',
      required: true,
      description: 'Debe existir procedimiento manual de rollback antes de piloto.',
      forbiddenIfMissing: true,
    },
  ];

export const PV_METRICS_PILOT_RISK_REGISTER_MOCK: PVMetricsPilotRiskRegisterItem[] =
  [
    {
      riskId: 'risk-overpromise',
      label: 'Sobrepromesa comercial',
      severity: 'high',
      mitigation:
        'Usar lenguaje de prototipo, demo local y piloto futuro condicionado.',
      ownerRole: 'commercial-owner',
    },
    {
      riskId: 'risk-real-data-confusion',
      label: 'Confusión entre mock y real',
      severity: 'high',
      mitigation:
        'Mantener No Real Integration Statement visible durante la demo.',
      ownerRole: 'qa-owner',
    },
    {
      riskId: 'risk-unauthorized-integration',
      label: 'Integración no autorizada',
      severity: 'critical',
      mitigation:
        'Bloquear conectores reales hasta existir alcance, contrato read-only y QA.',
      ownerRole: 'technical-owner',
    },
    {
      riskId: 'risk-operational-control',
      label: 'Control operacional indebido',
      severity: 'critical',
      mitigation:
        'Excluir telecontrol, setpoints, BESS commands, inverter commands y SCADA ACK.',
      ownerRole: 'operations-owner',
    },
  ];

export const PV_METRICS_DECISION_GATES_MOCK: PVMetricsDecisionGate[] = [
  {
    gateId: 'gate-demo-only',
    label: 'Demo local solamente',
    status: 'passed',
    description:
      'La app puede mostrarse como demo local, mock, read-only y segura.',
    nextAction: 'Preparar handoff visual y resumen cliente.',
  },
  {
    gateId: 'gate-client-pilot',
    label: 'Piloto cliente',
    status: 'requires-human-review',
    description:
      'Requiere alcance aprobado, contrato read-only, sanitización de datos y QA.',
    nextAction: 'Solicitar aprobación humana antes de cualquier piloto.',
  },
  {
    gateId: 'gate-real-integration',
    label: 'Integración real',
    status: 'blocked',
    description:
      'Bloqueada hasta crear módulos específicos de integración controlada.',
    nextAction: 'No implementar conectores reales en este bloque.',
  },
  {
    gateId: 'gate-operational-control',
    label: 'Control operacional',
    status: 'forbidden',
    description:
      'No permitido: telecontrol, setpoints, comandos BESS/inversores o SCADA ACK.',
    nextAction: 'Mantener explícitamente fuera del roadmap piloto.',
  },
];

export const PV_METRICS_SAFE_NEXT_STEPS_MOCK: PVMetricsSafeNextStep[] = [
  {
    stepId: 'step-review-demo-flow',
    order: 1,
    label: 'Revisar demo local',
    description:
      'Validar wizard, sandbox, evidence pack, presentation flow y safety locks.',
    allowed: true,
    requiresHumanReview: false,
  },
  {
    stepId: 'step-prepare-client-summary',
    order: 2,
    label: 'Preparar resumen cliente',
    description:
      'Generar texto claro con capacidades, límites y ruta de piloto seguro.',
    allowed: true,
    requiresHumanReview: true,
  },
  {
    stepId: 'step-define-pilot-scope',
    order: 3,
    label: 'Definir alcance piloto',
    description:
      'Acordar alcance read-only, datos permitidos, responsables y exclusiones.',
    allowed: true,
    requiresHumanReview: true,
  },
  {
    stepId: 'step-real-integration',
    order: 4,
    label: 'Integración real',
    description:
      'No permitida en este bloque; requiere roadmap separado y QA dedicado.',
    allowed: false,
    requiresHumanReview: true,
  },
];

export const PV_METRICS_PILOT_HANDOFF_EXIT_CRITERIA_MOCK: PVMetricsPilotHandoffExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript de handoff cliente piloto está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      required: true,
      passed: true,
      description:
        'El paquete local de handoff queda poblado con datos mock seguros.',
    },
    {
      criterionId: 'exit-no-real-delivery',
      label: 'Sin entrega real cliente',
      required: true,
      passed: true,
      description:
        'Este módulo no crea PDF, correo, backend, API ni conector real.',
    },
    {
      criterionId: 'exit-safety-boundary',
      label: 'Safety Boundary declarada',
      required: true,
      passed: true,
      description:
        'Los límites de seguridad quedan visibles dentro del pack mock.',
    },
  ];

export const PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK: PVMetricsClientPilotHandoffPack =
  {
    packId: 'pvmetrics-client-pilot-handoff-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-K — Client Pilot Handoff & Safe Next Steps',
    module: '1O-K.1B — Client Pilot Handoff Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    handoffSections: PV_METRICS_CLIENT_HANDOFF_SECTIONS_MOCK,
    allowedPilotMaterials: PV_METRICS_ALLOWED_PILOT_MATERIALS_MOCK,
    blockedPilotClaims: PV_METRICS_BLOCKED_PILOT_CLAIMS_MOCK,
    pilotReadinessConditions: PV_METRICS_PILOT_READINESS_CONDITIONS_MOCK,
    humanReviewRequirements: PV_METRICS_HUMAN_REVIEW_REQUIREMENTS_MOCK,
    readOnlyFutureIntegrationConditions:
      PV_METRICS_READ_ONLY_FUTURE_INTEGRATION_CONDITIONS_MOCK,
    pilotRiskRegister: PV_METRICS_PILOT_RISK_REGISTER_MOCK,
    decisionGates: PV_METRICS_DECISION_GATES_MOCK,
    safeNextSteps: PV_METRICS_SAFE_NEXT_STEPS_MOCK,
    exitCriteria: PV_METRICS_PILOT_HANDOFF_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Client Pilot Handoff mock data local. No PDF real, no correos reales, no backend, no conectores reales, no APIs, no localStorage, no SCADA, no medidores, no CEN, no credenciales, no tokens, no secrets, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule: '1O-K.2A — Client Pilot Handoff Visual Card',
  };
