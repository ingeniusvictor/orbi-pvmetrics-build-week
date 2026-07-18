const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PILOT_READINESS_BLUEPRINT =
  {
    id: 'pvmetrics-controlled-client-demo-feedback-pilot-readiness-blueprint',
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-O — Controlled Client Demo Feedback & Pilot Readiness',
    module:
      '1O-O.0 — Controlled Client Demo Feedback & Pilot Readiness Blueprint',
    internalVersion:
      '0.1O-O.0-controlled-client-demo-feedback-pilot-readiness-blueprint',
    generatedAtLabel: getGeneratedAtLabel(),

    blueprintStatus: 'CONCEPT_ONLY_NO_REAL_FEEDBACK_CAPTURE',
    blueprintStatusLabel:
      'CLIENT DEMO FEEDBACK & PILOT READINESS — SOLO BLUEPRINT CONCEPTUAL',

    purpose:
      'Preparar una estructura conceptual para ordenar feedback posterior a una demo cliente controlada y evaluar readiness para un piloto futuro, sin capturar datos reales, sin formularios reales, sin backend, sin APIs y sin integración operacional.',

    demoFeedbackPurpose: [
      'Registrar de forma conceptual el interés del cliente después de una demo controlada.',
      'Separar feedback técnico, comercial, operacional, QA y de seguridad.',
      'Detectar señales de readiness para un piloto futuro read-only.',
      'Identificar riesgos de sobrepromesa, integración real prematura o uso operacional indebido.',
      'Definir si corresponde avanzar a un roadmap separado de piloto controlado.',
    ],

    allowedFeedbackInputs: [
      'Notas manuales internas revisadas por humano.',
      'Preguntas del cliente registradas de forma conceptual.',
      'Observaciones sobre claridad del flujo visual.',
      'Comentarios sobre valor potencial del dashboard.',
      'Interés preliminar en piloto futuro read-only.',
      'Riesgos o dudas detectadas durante la demo.',
    ],

    blockedFeedbackInputs: [
      'Formularios reales enviados al cliente.',
      'Encuestas automáticas.',
      'Grabaciones de sesión.',
      'Datos SCADA reales.',
      'Datos de medidores reales.',
      'Credenciales, tokens o secrets.',
      'Contratos, precios o compromisos comerciales definitivos.',
      'Órdenes de operación, setpoints, comandos BESS o comandos inversores.',
      'Envío CEN o reportes regulatorios reales.',
    ],

    feedbackCategories: [
      {
        id: 'feedback-value',
        label: 'Valor percibido',
        description:
          'Qué valor entiende el cliente: trazabilidad, forecast conceptual, readiness, reportes o organización O&M.',
        ownerRole: 'commercial-owner',
      },
      {
        id: 'feedback-technical',
        label: 'Preguntas técnicas',
        description:
          'Dudas sobre arquitectura, mock data, read-only future connectors, QA, límites y seguridad.',
        ownerRole: 'technical-owner',
      },
      {
        id: 'feedback-operational',
        label: 'Encaje operacional',
        description:
          'Cómo la solución podría calzar con operación O&M, sin asumir uso productivo.',
        ownerRole: 'operations-owner',
      },
      {
        id: 'feedback-safety',
        label: 'Seguridad y límites',
        description:
          'Riesgos sobre SCADA, telecontrol, credenciales, CEN, medidores y claims de producción.',
        ownerRole: 'qa-owner',
      },
    ],

    pilotReadinessDimensions: [
      {
        id: 'readiness-client-interest',
        label: 'Interés cliente',
        description:
          'Existe interés explícito en explorar un piloto futuro, sin solicitar producción inmediata.',
        minimumCondition:
          'El cliente entiende que todo avance real requiere alcance aprobado y contrato read-only.',
      },
      {
        id: 'readiness-safe-scope',
        label: 'Scope seguro',
        description:
          'El posible piloto puede limitarse a datos read-only, sanitizados y sin impacto operacional.',
        minimumCondition:
          'No incluye telecontrol, setpoints, comandos ni envío regulatorio real.',
      },
      {
        id: 'readiness-technical-feasibility',
        label: 'Factibilidad técnica',
        description:
          'Las preguntas técnicas pueden convertirse en roadmap futuro sin romper límites actuales.',
        minimumCondition:
          'Cualquier conector real queda fuera del demo y requiere módulo separado.',
      },
      {
        id: 'readiness-human-approval',
        label: 'Aprobación humana',
        description:
          'Responsables técnico, QA y comercial deben revisar feedback antes de proponer piloto.',
        minimumCondition:
          'No se envía propuesta, archivo o compromiso sin revisión humana.',
      },
    ],

    clientQuestionLogRules: [
      'Registrar preguntas como notas internas conceptuales.',
      'Clasificar preguntas por categoría: técnica, comercial, operacional, QA o seguridad.',
      'No responder con promesas de producción o integración real inmediata.',
      'Derivar preguntas de SCADA, medidores, CEN o backend a roadmap read-only separado.',
      'Marcar preguntas sobre telecontrol como fuera de alcance.',
      'No guardar datos sensibles, credenciales, tokens, secrets ni información operacional real.',
    ],

    readinessSignalGuidelines: [
      {
        id: 'signal-positive',
        label: 'Señal positiva',
        meaning:
          'El cliente entiende límites y pregunta por un piloto read-only controlado.',
        action:
          'Registrar como posible oportunidad de piloto, pendiente revisión humana.',
      },
      {
        id: 'signal-caution',
        label: 'Señal de cautela',
        meaning:
          'El cliente muestra interés, pero confunde demo con producción o pide conectores reales inmediatos.',
        action:
          'Reforzar límites, bloquear sobrepromesa y derivar a revisión técnica/QA.',
      },
      {
        id: 'signal-blocking',
        label: 'Señal bloqueante',
        meaning:
          'El cliente exige telecontrol, setpoints, comandos, CEN real o producción inmediata.',
        action:
          'No avanzar a piloto; registrar riesgo y requerir redefinición de alcance.',
      },
    ],

    pilotRiskRegister: [
      {
        id: 'risk-overpromise-after-demo',
        label: 'Sobrepromesa posterior a la demo',
        severity: 'high',
        mitigation:
          'Todo follow-up debe pasar por revisión humana y repetir límites de no producción.',
      },
      {
        id: 'risk-premature-real-integration',
        label: 'Integración real prematura',
        severity: 'critical',
        mitigation:
          'Bloquear conectores reales hasta roadmap read-only separado con QA dedicado.',
      },
      {
        id: 'risk-operational-misuse',
        label: 'Uso operacional indebido',
        severity: 'critical',
        mitigation:
          'Mantener prohibidos telecontrol, setpoints, BESS/inversores y SCADA ACK.',
      },
      {
        id: 'risk-sensitive-data-capture',
        label: 'Captura de datos sensibles',
        severity: 'critical',
        mitigation:
          'No capturar credenciales, tokens, secrets, SCADA real, medidores reales ni datos contractuales.',
      },
    ],

    humanReviewGates: [
      {
        id: 'gate-feedback-review',
        label: 'Revisión humana de feedback',
        required: true,
        reviewerRole: 'qa-owner',
        description:
          'Validar que el feedback no contiene datos sensibles ni compromisos no autorizados.',
      },
      {
        id: 'gate-pilot-scope-review',
        label: 'Revisión de scope piloto',
        required: true,
        reviewerRole: 'technical-owner',
        description:
          'Validar que cualquier piloto futuro sea read-only, sanitizado y sin impacto operacional.',
      },
      {
        id: 'gate-commercial-followup',
        label: 'Revisión de seguimiento comercial',
        required: true,
        reviewerRole: 'commercial-owner',
        description:
          'Validar que no existan promesas de producción, precios, fechas o entregables reales sin aprobación.',
      },
    ],

    pilotReadinessExitCriteria: [
      'Blueprint creado.',
      'Demo Feedback Purpose declarado.',
      'Allowed Feedback Inputs declarados.',
      'Blocked Feedback Inputs declarados.',
      'Feedback Categories declaradas.',
      'Pilot Readiness Dimensions declaradas.',
      'Client Question Log Rules declaradas.',
      'Readiness Signal Guidelines declaradas.',
      'Pilot Risk Register declarado.',
      'Human Review Gates declarados.',
      'Safety Boundary declarado.',
      'Next Roadmap 1O-O declarado.',
      'No se crea UI nueva.',
      'No se modifica wizard.',
      'No se captura feedback real.',
      'No se envían formularios reales.',
      'No se crea backend.',
      'No se llaman APIs.',
      'No se usa localStorage.',
      'No se crean conectores reales.',
      'Build correcto.',
      'TypeScript limpio.',
    ],

    safetyBoundary:
      'Este blueprint solo define una estructura conceptual para feedback de demo cliente y readiness de piloto. No captura feedback real, no envía formularios, no graba sesiones, no agenda reuniones, no genera ZIP/APK/PDF, no envía correos, no usa backend, no llama APIs, no usa localStorage, no conecta SCADA, no lee medidores, no envía CEN, no usa credenciales/tokens/secrets, no ejecuta POST/PUT/PATCH/DELETE real, no habilita telecontrol, setpoints, comandos BESS ni comandos inversores.',

    nextRoadmap: [
      '1O-O.1A — Client Demo Feedback Types',
      '1O-O.1B — Client Demo Feedback Mock Data',
      '1O-O.2A — Feedback & Pilot Readiness Visual Card',
      '1O-O.2B — Feedback Summary Export Text Box',
      '1O-O.3A — Feedback & Pilot Readiness Wizard Integration',
      '1O-O.4A — Feedback & Pilot Readiness Final QA & Closure',
    ],

    nextRecommendedModule: '1O-O.1A — Client Demo Feedback Types',
  } as const;
