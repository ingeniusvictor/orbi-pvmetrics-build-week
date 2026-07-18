import {
  PVMetricsAllowedFeedbackInput,
  PVMetricsBlockedFeedbackInput,
  PVMetricsClientQuestionLogRule,
  PVMetricsControlledClientDemoFeedbackPack,
  PVMetricsFeedbackCategory,
  PVMetricsPilotHumanReviewGate,
  PVMetricsPilotReadinessDimension,
  PVMetricsPilotReadinessExitCriterion,
  PVMetricsPilotRiskRegisterItem,
  PVMetricsReadinessSignalGuideline,
} from '../types/pvmetrics-client-demo-feedback.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-O.1B-client-demo-feedback-mock-data';

export const PV_METRICS_DEMO_FEEDBACK_PURPOSE_MOCK: string[] = [
  'Ordenar feedback posterior a una demo cliente controlada.',
  'Separar observaciones comerciales, técnicas, operacionales y de seguridad.',
  'Identificar señales de readiness para un piloto futuro read-only.',
  'Evitar sobrepromesas de producción, integración real o uso operacional.',
  'Registrar próximos pasos solo como insumos de revisión humana.',
];

export const PV_METRICS_ALLOWED_FEEDBACK_INPUTS_MOCK: PVMetricsAllowedFeedbackInput[] =
  [
    {
      inputId: 'allowed-manual-note',
      label: 'Nota manual interna',
      inputType: 'manual-note',
      description:
        'Nota escrita manualmente por el equipo después de la demo controlada.',
      requiresHumanReview: true,
    },
    {
      inputId: 'allowed-client-question',
      label: 'Pregunta cliente conceptual',
      inputType: 'client-question',
      description:
        'Pregunta registrada de forma conceptual, sin datos sensibles ni compromisos.',
      requiresHumanReview: true,
    },
    {
      inputId: 'allowed-value-observation',
      label: 'Observación de valor',
      inputType: 'value-observation',
      description:
        'Comentario sobre valor percibido, claridad de flujo o interés en piloto futuro.',
      requiresHumanReview: true,
    },
    {
      inputId: 'allowed-technical-observation',
      label: 'Observación técnica',
      inputType: 'technical-observation',
      description:
        'Duda técnica sobre arquitectura futura, siempre separada de conectores reales actuales.',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_FEEDBACK_INPUTS_MOCK: PVMetricsBlockedFeedbackInput[] =
  [
    {
      inputId: 'blocked-scada-data',
      label: 'Datos SCADA reales',
      reason:
        'El bloque 1O-O no captura ni procesa información SCADA real.',
      safeAlternative:
        'Registrar solo una pregunta conceptual sobre integración read-only futura.',
      severity: 'critical',
    },
    {
      inputId: 'blocked-meter-data',
      label: 'Datos de medidores reales',
      reason:
        'El bloque 1O-O no lee ni almacena datos de medidores físicos.',
      safeAlternative:
        'Registrar necesidad futura como requisito técnico pendiente.',
      severity: 'critical',
    },
    {
      inputId: 'blocked-secrets',
      label: 'Credenciales, tokens o secrets',
      reason:
        'Está prohibido capturar cualquier secreto o credencial productiva.',
      safeAlternative:
        'Usar una nota sanitizada sin valores sensibles.',
      severity: 'critical',
    },
    {
      inputId: 'blocked-operational-command',
      label: 'Comandos operacionales',
      reason:
        'Telecontrol, setpoints, BESS, inversores o SCADA ACK están fuera de alcance.',
      safeAlternative:
        'Clasificar como fuera de alcance operacional.',
      severity: 'critical',
    },
  ];

export const PV_METRICS_FEEDBACK_CATEGORIES_MOCK: PVMetricsFeedbackCategory[] =
  [
    {
      categoryId: 'feedback-value',
      label: 'Valor percibido',
      description:
        'Claridad del valor para O&M, trazabilidad, readiness, reportes y organización.',
      ownerRole: 'commercial-owner',
    },
    {
      categoryId: 'feedback-technical',
      label: 'Preguntas técnicas',
      description:
        'Arquitectura, mock data, futuros conectores read-only, QA y límites técnicos.',
      ownerRole: 'technical-owner',
    },
    {
      categoryId: 'feedback-operational',
      label: 'Encaje operacional',
      description:
        'Posible ajuste a flujos O&M sin asumir producción ni uso operacional real.',
      ownerRole: 'operations-owner',
    },
    {
      categoryId: 'feedback-safety',
      label: 'Seguridad y límites',
      description:
        'Riesgos sobre SCADA, telecontrol, medidores, CEN, credenciales y claims.',
      ownerRole: 'qa-owner',
    },
  ];

export const PV_METRICS_PILOT_READINESS_DIMENSIONS_MOCK: PVMetricsPilotReadinessDimension[] =
  [
    {
      dimensionId: 'readiness-client-interest',
      label: 'Interés cliente',
      description:
        'El cliente muestra interés en explorar un piloto futuro controlado.',
      minimumCondition:
        'El cliente comprende que no existe producción ni integración real actual.',
      required: true,
    },
    {
      dimensionId: 'readiness-safe-scope',
      label: 'Scope seguro',
      description:
        'El piloto futuro puede limitarse a datos read-only, sanitizados y sin impacto operacional.',
      minimumCondition:
        'No incluye telecontrol, setpoints, BESS, inversores ni envío CEN real.',
      required: true,
    },
    {
      dimensionId: 'readiness-technical-path',
      label: 'Ruta técnica posible',
      description:
        'Las preguntas técnicas pueden convertirse en roadmap futuro separado.',
      minimumCondition:
        'Cualquier conector real queda fuera del demo y requiere QA dedicado.',
      required: true,
    },
    {
      dimensionId: 'readiness-human-approval',
      label: 'Aprobación humana',
      description:
        'Responsables técnico, QA y comercial revisan el feedback antes de proponer piloto.',
      minimumCondition:
        'No se envía propuesta ni compromiso externo sin revisión humana.',
      required: true,
    },
  ];

export const PV_METRICS_CLIENT_QUESTION_LOG_RULES_MOCK: PVMetricsClientQuestionLogRule[] =
  [
    {
      ruleId: 'question-classify',
      label: 'Clasificar pregunta',
      rule:
        'Toda pregunta debe clasificarse como técnica, comercial, operacional, QA o seguridad.',
      escalationRole: 'qa-owner',
    },
    {
      ruleId: 'question-no-promises',
      label: 'No prometer integración',
      rule:
        'No responder con promesas de producción, forecast oficial, conectores reales o fechas.',
      escalationRole: 'commercial-owner',
    },
    {
      ruleId: 'question-real-data',
      label: 'Datos reales como roadmap futuro',
      rule:
        'Preguntas sobre SCADA, medidores, CEN o backend deben derivarse a roadmap read-only separado.',
      escalationRole: 'technical-owner',
    },
    {
      ruleId: 'question-telecontrol-blocked',
      label: 'Telecontrol fuera de alcance',
      rule:
        'Preguntas sobre telecontrol, setpoints o comandos deben marcarse como fuera de alcance.',
      escalationRole: 'qa-owner',
    },
  ];

export const PV_METRICS_READINESS_SIGNAL_GUIDELINES_MOCK: PVMetricsReadinessSignalGuideline[] =
  [
    {
      signalId: 'signal-positive',
      signal: 'positive',
      label: 'Señal positiva',
      meaning:
        'El cliente entiende límites y pregunta por piloto read-only controlado.',
      action:
        'Registrar como posible oportunidad de piloto, pendiente revisión humana.',
    },
    {
      signalId: 'signal-caution',
      signal: 'caution',
      label: 'Señal de cautela',
      meaning:
        'El cliente muestra interés, pero confunde demo con producción o pide conectores reales inmediatos.',
      action:
        'Reforzar límites y derivar a revisión técnica/QA antes de avanzar.',
    },
    {
      signalId: 'signal-blocking',
      signal: 'blocking',
      label: 'Señal bloqueante',
      meaning:
        'El cliente exige telecontrol, setpoints, CEN real o producción inmediata.',
      action:
        'No avanzar a piloto; registrar riesgo y redefinir alcance.',
    },
  ];

export const PV_METRICS_PILOT_RISK_REGISTER_MOCK: PVMetricsPilotRiskRegisterItem[] =
  [
    {
      riskId: 'risk-overpromise-after-demo',
      label: 'Sobrepromesa posterior a demo',
      severity: 'high',
      mitigation:
        'Todo follow-up debe pasar por revisión humana y repetir límites de no producción.',
      ownerRole: 'commercial-owner',
    },
    {
      riskId: 'risk-premature-real-integration',
      label: 'Integración real prematura',
      severity: 'critical',
      mitigation:
        'Bloquear conectores reales hasta roadmap read-only separado con QA dedicado.',
      ownerRole: 'technical-owner',
    },
    {
      riskId: 'risk-operational-misuse',
      label: 'Uso operacional indebido',
      severity: 'critical',
      mitigation:
        'Mantener prohibidos telecontrol, setpoints, BESS, inversores y SCADA ACK.',
      ownerRole: 'qa-owner',
    },
    {
      riskId: 'risk-sensitive-data-capture',
      label: 'Captura de datos sensibles',
      severity: 'critical',
      mitigation:
        'No capturar credenciales, tokens, secrets, SCADA real, medidores ni contratos.',
      ownerRole: 'qa-owner',
    },
  ];

export const PV_METRICS_FEEDBACK_HUMAN_REVIEW_GATES_MOCK: PVMetricsPilotHumanReviewGate[] =
  [
    {
      gateId: 'gate-feedback-review',
      label: 'Revisión humana de feedback',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Validar que el feedback no contiene datos sensibles ni compromisos no autorizados.',
    },
    {
      gateId: 'gate-pilot-scope-review',
      label: 'Revisión de scope piloto',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Validar que cualquier piloto futuro sea read-only, sanitizado y sin impacto operacional.',
    },
    {
      gateId: 'gate-commercial-followup',
      label: 'Revisión de seguimiento comercial',
      required: true,
      reviewerRole: 'commercial-owner',
      description:
        'Validar que no existan promesas de producción, precios, fechas o entregables reales sin aprobación.',
    },
  ];

export const PV_METRICS_PILOT_READINESS_EXIT_CRITERIA_MOCK: PVMetricsPilotReadinessExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript de feedback y pilot readiness está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      required: true,
      passed: true,
      description:
        'El pack queda poblado con mock data local, seguro y no productivo.',
    },
    {
      criterionId: 'exit-no-real-feedback',
      label: 'Sin feedback real',
      required: true,
      passed: true,
      description:
        'Este módulo no captura feedback real ni envía formularios reales.',
    },
    {
      criterionId: 'exit-safety-boundary',
      label: 'Safety Boundary declarada',
      required: true,
      passed: true,
      description:
        'Los límites de seguridad quedan declarados dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK: PVMetricsControlledClientDemoFeedbackPack =
  {
    packId: 'pvmetrics-controlled-client-demo-feedback-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-O — Controlled Client Demo Feedback & Pilot Readiness',
    module: '1O-O.1B — Client Demo Feedback Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    demoFeedbackPurpose: PV_METRICS_DEMO_FEEDBACK_PURPOSE_MOCK,
    allowedFeedbackInputs: PV_METRICS_ALLOWED_FEEDBACK_INPUTS_MOCK,
    blockedFeedbackInputs: PV_METRICS_BLOCKED_FEEDBACK_INPUTS_MOCK,
    feedbackCategories: PV_METRICS_FEEDBACK_CATEGORIES_MOCK,
    pilotReadinessDimensions: PV_METRICS_PILOT_READINESS_DIMENSIONS_MOCK,
    clientQuestionLogRules: PV_METRICS_CLIENT_QUESTION_LOG_RULES_MOCK,
    readinessSignalGuidelines: PV_METRICS_READINESS_SIGNAL_GUIDELINES_MOCK,
    pilotRiskRegister: PV_METRICS_PILOT_RISK_REGISTER_MOCK,
    humanReviewGates: PV_METRICS_FEEDBACK_HUMAN_REVIEW_GATES_MOCK,
    pilotReadinessExitCriteria: PV_METRICS_PILOT_READINESS_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Client Demo Feedback mock data. No captura feedback real, no envía formularios reales, no agenda reuniones, no graba sesiones, no genera ZIP/APK/PDF real, no envía correos, no usa backend, no APIs, no localStorage, no conectores reales, no SCADA, no medidores, no CEN, no credenciales, no tokens, no secrets, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule: '1O-O.2A — Feedback & Pilot Readiness Visual Card',
  };
