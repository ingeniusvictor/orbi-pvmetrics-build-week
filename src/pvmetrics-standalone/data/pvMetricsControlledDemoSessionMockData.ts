import {
  PVMetricsClientSafeStatement,
  PVMetricsControlledClientDemoSessionRunbookPack,
  PVMetricsControlledDemoHumanApprovalGate,
  PVMetricsControlledDemoSessionExitCriterion,
  PVMetricsControlledDemoSessionRisk,
  PVMetricsDemoSessionPhase,
  PVMetricsDemoSessionRole,
  PVMetricsEvidenceCaptureBoundary,
  PVMetricsForbiddenDemoAction,
  PVMetricsLiveDemoScriptLine,
  PVMetricsPauseStopCriterion,
  PVMetricsPostDemoFollowUpRule,
  PVMetricsPreDemoChecklistItem,
  PVMetricsQuestionHandlingRule,
} from '../types/pvmetrics-controlled-demo-session.types';

export const PV_METRICS_DEMO_SESSION_PURPOSE_MOCK: string[] = [
  'Presentar ORBI PVMetrics IA como demo local, mock, read-only y no productiva.',
  'Mostrar wizard, readiness, client handoff, release candidate, paquete demo local y sign-off humano.',
  'Explicar límites de seguridad antes de mostrar cualquier pantalla.',
  'Guiar una conversación cliente sin afirmar producción, integración real ni reporte oficial.',
  'Recolectar preguntas para revisión humana posterior, sin comprometer conectores reales ni artefactos productivos.',
];

export const PV_METRICS_DEMO_SESSION_ROLES_MOCK: PVMetricsDemoSessionRole[] = [
  {
    roleId: 'demo-operator',
    label: 'Demo Operator',
    responsibility:
      'Conduce la demo, sigue el guion, muestra solo pantallas permitidas y detiene la sesión si aparece riesgo de sobrepromesa.',
  },
  {
    roleId: 'technical-owner',
    label: 'Technical Owner',
    responsibility:
      'Responde dudas técnicas sobre arquitectura, límites read-only, build, TypeScript y rutas futuras de integración controlada.',
  },
  {
    roleId: 'qa-owner',
    label: 'QA Owner',
    responsibility:
      'Verifica que la demo mantenga Safety Boundaries, No Real Integration Statement y claims seguros.',
  },
  {
    roleId: 'commercial-owner',
    label: 'Commercial Owner',
    responsibility:
      'Maneja expectativas comerciales, evitando prometer producción, forecast oficial, reporte regulatorio o conectores reales.',
  },
  {
    roleId: 'client-observer',
    label: 'Client Observer',
    responsibility:
      'Observa la demo y formula preguntas sin recibir artefactos productivos ni acceso operativo.',
  },
];

export const PV_METRICS_DEMO_SESSION_PHASES_MOCK: PVMetricsDemoSessionPhase[] =
  [
    {
      phaseId: 'phase-opening',
      label: 'Apertura y contexto',
      order: 1,
      objective:
        'Declarar que la demo es local, mock, read-only, no productiva y sin conexión a sistemas reales.',
      allowedFocus:
        'Propósito, valor, alcance, límites y forma segura de evaluación.',
    },
    {
      phaseId: 'phase-guided-wizard',
      label: 'Recorrido guiado por wizard',
      order: 2,
      objective:
        'Mostrar capas visuales integradas sin activar funciones reales.',
      allowedFocus:
        'Wizard, tarjetas visuales, checklists, readiness, handoff y reportes copiables.',
    },
    {
      phaseId: 'phase-client-handoff',
      label: 'Handoff cliente y próximos pasos',
      order: 3,
      objective:
        'Explicar materiales permitidos, claims bloqueados, gates humanos y ruta segura a piloto.',
      allowedFocus:
        'Client Pilot Handoff, Safe Next Steps y revisión humana.',
    },
    {
      phaseId: 'phase-release-candidate',
      label: 'Release Candidate Demo',
      order: 4,
      objective:
        'Mostrar readiness de demo candidata sin afirmar release productivo.',
      allowedFocus:
        'Scope, boundaries, risks, readiness y blocked production claims.',
    },
    {
      phaseId: 'phase-package-signoff',
      label: 'Paquete demo local y sign-off',
      order: 5,
      objective:
        'Mostrar ensamblaje conceptual, contenidos permitidos, artefactos bloqueados y sign-off humano.',
      allowedFocus:
        'Operator Sign-Off, preflight, reviewer checklist, risks y Safety Boundary.',
    },
    {
      phaseId: 'phase-closing',
      label: 'Cierre y próximos pasos',
      order: 6,
      objective:
        'Cerrar con preguntas, límites reiterados y próximos pasos condicionados a revisión humana.',
      allowedFocus:
        'Preguntas, minuta conceptual, evaluación interna y roadmap futuro separado.',
    },
  ];

export const PV_METRICS_PRE_DEMO_CHECKLIST_MOCK: PVMetricsPreDemoChecklistItem[] =
  [
    {
      checklistId: 'pre-build',
      label: 'Build validado',
      status: 'requires-run',
      command: 'npm run build',
      description:
        'Debe ejecutarse antes de cualquier demo cliente o revisión externa.',
      required: true,
    },
    {
      checklistId: 'pre-typescript',
      label: 'TypeScript validado',
      status: 'requires-run',
      command: 'tsc --noEmit',
      description:
        'Debe ejecutarse para confirmar estabilidad técnica antes de la sesión.',
      required: true,
    },
    {
      checklistId: 'pre-demo-mode-language',
      label: 'Lenguaje seguro preparado',
      status: 'requires-human-review',
      description:
        'El operador debe revisar guion y evitar claims productivos, oficiales o regulatorios.',
      required: true,
    },
    {
      checklistId: 'pre-no-secrets',
      label: 'Sin secretos visibles',
      status: 'requires-human-review',
      description:
        'Confirmar que no hay credenciales, tokens, secrets ni variables productivas visibles.',
      required: true,
    },
    {
      checklistId: 'pre-no-real-connectors',
      label: 'Sin conectores reales',
      status: 'requires-human-review',
      description:
        'Confirmar que no se activan SCADA, medidores, weather APIs, CEN, backend ni APIs externas.',
      required: true,
    },
  ];

export const PV_METRICS_LIVE_DEMO_SCRIPT_MOCK: PVMetricsLiveDemoScriptLine[] = [
  {
    scriptId: 'script-opening-disclaimer',
    phaseId: 'phase-opening',
    speakerRole: 'demo-operator',
    script:
      'Antes de comenzar, esta es una demo local, mock, read-only y no productiva. No está conectada a SCADA, medidores, CEN, backend ni sistemas reales.',
    safetyNote:
      'Debe decirse antes de mostrar pantallas para evitar confusión con producción.',
  },
  {
    scriptId: 'script-value',
    phaseId: 'phase-opening',
    speakerRole: 'demo-operator',
    script:
      'El objetivo es mostrar el flujo de trabajo, la trazabilidad, los límites de seguridad y cómo podríamos preparar un piloto futuro controlado.',
    safetyNote:
      'No prometer fechas, integraciones reales ni forecast oficial.',
  },
  {
    scriptId: 'script-wizard',
    phaseId: 'phase-guided-wizard',
    speakerRole: 'demo-operator',
    script:
      'Recorreremos el wizard y sus capas visuales. Todo lo que se ve aquí opera con datos mock locales y no ejecuta acciones externas.',
    safetyNote:
      'No afirmar que los datos provienen de SCADA real o medidores reales.',
  },
  {
    scriptId: 'script-release-candidate',
    phaseId: 'phase-release-candidate',
    speakerRole: 'technical-owner',
    script:
      'Release Candidate aquí significa demo interna/controlada, no producción ni artefacto distribuible real.',
    safetyNote:
      'No usar lenguaje de lanzamiento comercial o productivo.',
  },
  {
    scriptId: 'script-package',
    phaseId: 'phase-package-signoff',
    speakerRole: 'qa-owner',
    script:
      'Este paquete demo local no genera ZIP, APK, PDF ni firma digital real. Es una guía de ensamblaje conceptual y sign-off humano.',
    safetyNote:
      'Diferenciar firma humana administrativa de firma digital real.',
  },
  {
    scriptId: 'script-closing',
    phaseId: 'phase-closing',
    speakerRole: 'commercial-owner',
    script:
      'Cualquier piloto con datos reales requeriría alcance aprobado, contrato read-only, sanitización, QA y revisión humana previa.',
    safetyNote:
      'No comprometer integración real ni costos/fechas sin revisión.',
  },
];

export const PV_METRICS_CLIENT_SAFE_STATEMENTS_MOCK: PVMetricsClientSafeStatement[] =
  [
    {
      statementId: 'safe-local-demo',
      label: 'Demo local',
      statement: 'Esta demo es local, mock, read-only y no productiva.',
      required: true,
    },
    {
      statementId: 'safe-no-scada',
      label: 'Sin SCADA real',
      statement: 'La app no está conectada a SCADA real.',
      required: true,
    },
    {
      statementId: 'safe-no-meter',
      label: 'Sin medidores reales',
      statement: 'La app no lee medidores reales.',
      required: true,
    },
    {
      statementId: 'safe-no-cen',
      label: 'Sin envío CEN',
      statement: 'La app no envía información al CEN.',
      required: true,
    },
    {
      statementId: 'safe-no-official-report',
      label: 'Sin reporte oficial',
      statement: 'La app no genera reportes oficiales ni regulatorios.',
      required: true,
    },
    {
      statementId: 'safe-no-control',
      label: 'Sin control operacional',
      statement:
        'La app no ejecuta telecontrol, setpoints ni comandos BESS/inversores.',
      required: true,
    },
  ];

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-N.1B.2-controlled-demo-session-mock-data-completion';

export const PV_METRICS_FORBIDDEN_DEMO_ACTIONS_MOCK: PVMetricsForbiddenDemoAction[] =
  [
    {
      actionId: 'forbidden-production-claim',
      label: 'Claim de producción',
      forbiddenAction: 'Afirmar que la app está en producción.',
      safeAlternative:
        'Declarar que es demo local, mock, read-only y no productiva.',
      severity: 'high',
    },
    {
      actionId: 'forbidden-real-scada',
      label: 'Claim de SCADA real',
      forbiddenAction: 'Afirmar que existe conexión SCADA real.',
      safeAlternative:
        'Explicar que cualquier conector real requiere roadmap read-only separado.',
      severity: 'critical',
    },
    {
      actionId: 'forbidden-real-artifacts',
      label: 'Promesa de artefactos reales',
      forbiddenAction:
        'Prometer ZIP, APK, PDF, firma digital real o deploy desde este bloque.',
      safeAlternative:
        'Indicar que solo existen textos locales copiables y revisión conceptual.',
      severity: 'high',
    },
    {
      actionId: 'forbidden-operational-control',
      label: 'Control operacional',
      forbiddenAction:
        'Ejecutar o simular telecontrol, setpoints, comandos BESS, comandos inversores o SCADA ACK.',
      safeAlternative:
        'Reafirmar que todo control operacional está fuera de alcance.',
      severity: 'critical',
    },
  ];

export const PV_METRICS_PAUSE_STOP_CRITERIA_MOCK: PVMetricsPauseStopCriterion[] =
  [
    {
      criterionId: 'stop-real-integration-request',
      label: 'Solicitud de integración real inmediata',
      severity: 'high',
      trigger:
        'El cliente pide conectar SCADA, medidores, CEN, backend o APIs durante la demo.',
      action:
        'Pausar y aclarar que toda integración real queda fuera de la demo y requiere roadmap separado.',
    },
    {
      criterionId: 'stop-production-claim',
      label: 'Confusión con producción',
      severity: 'high',
      trigger:
        'El cliente interpreta que la app ya está productiva o disponible para operación real.',
      action:
        'Detener el avance y reiterar No Real Integration Statement y demo no productiva.',
    },
    {
      criterionId: 'stop-secret-exposure',
      label: 'Riesgo de exposición de secretos',
      severity: 'critical',
      trigger:
        'Aparece una pantalla con credenciales, tokens, secrets o rutas productivas.',
      action:
        'Detener la sesión, ocultar pantalla y revisar entorno antes de continuar.',
    },
    {
      criterionId: 'stop-operational-control',
      label: 'Presión por telecontrol',
      severity: 'critical',
      trigger:
        'El cliente solicita operar setpoints, BESS, inversores, SCADA ACK o comandos reales.',
      action:
        'Reafirmar que telecontrol, setpoints, BESS, inversores y SCADA ACK están prohibidos.',
    },
  ];

export const PV_METRICS_QUESTION_HANDLING_RULES_MOCK: PVMetricsQuestionHandlingRule[] =
  [
    {
      ruleId: 'question-security-first',
      label: 'Primero el límite de seguridad',
      rule:
        'Toda respuesta sobre datos reales debe comenzar aclarando límite read-only y no real integration.',
      escalationRole: 'qa-owner',
    },
    {
      ruleId: 'question-no-improvisation',
      label: 'No improvisar capacidades',
      rule:
        'No prometer funciones no implementadas, conectores reales, forecast oficial ni reportes regulatorios.',
      escalationRole: 'technical-owner',
    },
    {
      ruleId: 'question-register-for-review',
      label: 'Registrar para revisión',
      rule:
        'Preguntas relevantes deben quedar registradas para revisión humana posterior.',
      escalationRole: 'commercial-owner',
    },
    {
      ruleId: 'question-operational-control-out-of-scope',
      label: 'Control operacional fuera de alcance',
      rule:
        'Toda pregunta sobre telecontrol, setpoints o comandos debe marcarse como fuera de alcance.',
      escalationRole: 'qa-owner',
    },
  ];

export const PV_METRICS_EVIDENCE_CAPTURE_BOUNDARIES_MOCK: PVMetricsEvidenceCaptureBoundary[] =
  [
    {
      boundaryId: 'evidence-manual-notes',
      label: 'Notas manuales internas',
      allowed: true,
      description:
        'Se permite capturar notas internas manuales sobre preguntas y próximos pasos.',
      safetyNote: 'No convertir automáticamente en documento externo.',
    },
    {
      boundaryId: 'evidence-session-recording',
      label: 'Grabación de sesión',
      allowed: false,
      description:
        'No se graba sesión real desde este módulo ni se gestiona consentimiento.',
      safetyNote: 'Requiere proceso separado y aprobación humana.',
    },
    {
      boundaryId: 'evidence-pdf-minutes',
      label: 'Minuta PDF real',
      allowed: false,
      description:
        'No se genera minuta PDF real ni documento oficial desde este bloque.',
      safetyNote: 'Usar texto conceptual revisado por humano.',
    },
    {
      boundaryId: 'evidence-cloud-upload',
      label: 'Subida a nube/backend',
      allowed: false,
      description:
        'No se suben evidencias a backend, nube, APIs ni conectores externos.',
      safetyNote: 'Mantener todo local y conceptual.',
    },
  ];

export const PV_METRICS_POST_DEMO_FOLLOW_UP_RULES_MOCK: PVMetricsPostDemoFollowUpRule[] =
  [
    {
      ruleId: 'followup-human-reviewed-summary',
      label: 'Resumen revisado por humano',
      rule:
        'Preparar resumen conceptual revisado por responsable humano antes de compartir externamente.',
      requiresHumanReview: true,
    },
    {
      ruleId: 'followup-repeat-boundaries',
      label: 'Reiterar límites',
      rule:
        'Todo seguimiento debe reiterar que no existe producción, SCADA, medidores, CEN, backend, APIs ni telecontrol.',
      requiresHumanReview: true,
    },
    {
      ruleId: 'followup-separate-questions',
      label: 'Separar preguntas',
      rule:
        'Separar preguntas comerciales, técnicas, QA y futuras integraciones read-only.',
      requiresHumanReview: true,
    },
    {
      ruleId: 'followup-no-real-artifacts',
      label: 'No enviar artefactos reales',
      rule:
        'No enviar ZIP, APK, PDF, firma digital, deploy ni adjuntos generados automáticamente.',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_DEMO_HUMAN_APPROVAL_GATES_MOCK: PVMetricsControlledDemoHumanApprovalGate[] =
  [
    {
      gateId: 'gate-before-demo',
      label: 'Antes de demo cliente',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Validar guion, límites, claims seguros, build, TypeScript y ausencia de secretos.',
    },
    {
      gateId: 'gate-before-answering-integration',
      label: 'Antes de responder sobre integración real',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Toda respuesta sobre integración real debe mantenerse condicionada a roadmap separado.',
    },
    {
      gateId: 'gate-before-followup',
      label: 'Antes de seguimiento externo',
      required: true,
      reviewerRole: 'commercial-owner',
      description:
        'Todo seguimiento externo debe revisar claims, límites y próximos pasos seguros.',
    },
  ];

export const PV_METRICS_DEMO_SESSION_RISKS_MOCK: PVMetricsControlledDemoSessionRisk[] =
  [
    {
      riskId: 'risk-overpromise',
      label: 'Sobrepromesa durante la demo',
      severity: 'high',
      mitigation:
        'Usar guion seguro, client-safe statements y forbidden demo actions visibles.',
      ownerRole: 'commercial-owner',
    },
    {
      riskId: 'risk-client-confuses-demo-with-production',
      label: 'Cliente confunde demo con producción',
      severity: 'high',
      mitigation:
        'Repetir No Real Integration Statement al inicio, mitad y cierre de la demo.',
      ownerRole: 'demo-operator',
    },
    {
      riskId: 'risk-pressure-for-real-connector',
      label: 'Presión por conector real inmediato',
      severity: 'critical',
      mitigation:
        'Activar pause/stop criteria y derivar a roadmap read-only separado.',
      ownerRole: 'technical-owner',
    },
    {
      riskId: 'risk-secret-or-real-system-exposure',
      label: 'Exposición accidental de secreto o sistema real',
      severity: 'critical',
      mitigation:
        'Detener sesión, ocultar pantalla y revisar entorno antes de continuar.',
      ownerRole: 'qa-owner',
    },
  ];

export const PV_METRICS_DEMO_SESSION_EXIT_CRITERIA_MOCK: PVMetricsControlledDemoSessionExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript del runbook de sesión demo controlada está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data completo',
      required: true,
      passed: true,
      description:
        'El runbook queda poblado con datos mock seguros y no productivos.',
    },
    {
      criterionId: 'exit-no-real-session-action',
      label: 'Sin acciones reales de sesión',
      required: true,
      passed: true,
      description:
        'Este módulo no agenda reuniones, no graba sesiones, no envía correos y no genera documentos reales.',
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

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK: PVMetricsControlledClientDemoSessionRunbookPack =
  {
    packId: 'pvmetrics-controlled-client-demo-session-runbook-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-N — Controlled Client Demo Session Runbook',
    module: '1O-N.1B.2 — Controlled Demo Session Mock Data Completion',
    internalVersion,
    status: 'mock-data-ready',
    demoSessionPurpose: PV_METRICS_DEMO_SESSION_PURPOSE_MOCK,
    demoSessionRoles: PV_METRICS_DEMO_SESSION_ROLES_MOCK,
    demoSessionPhases: PV_METRICS_DEMO_SESSION_PHASES_MOCK,
    preDemoChecklist: PV_METRICS_PRE_DEMO_CHECKLIST_MOCK,
    liveDemoScript: PV_METRICS_LIVE_DEMO_SCRIPT_MOCK,
    clientSafeStatements: PV_METRICS_CLIENT_SAFE_STATEMENTS_MOCK,
    forbiddenDemoActions: PV_METRICS_FORBIDDEN_DEMO_ACTIONS_MOCK,
    pauseStopCriteria: PV_METRICS_PAUSE_STOP_CRITERIA_MOCK,
    questionHandlingRules: PV_METRICS_QUESTION_HANDLING_RULES_MOCK,
    evidenceCaptureBoundaries: PV_METRICS_EVIDENCE_CAPTURE_BOUNDARIES_MOCK,
    postDemoFollowUpRules: PV_METRICS_POST_DEMO_FOLLOW_UP_RULES_MOCK,
    humanApprovalGates: PV_METRICS_DEMO_HUMAN_APPROVAL_GATES_MOCK,
    sessionRisks: PV_METRICS_DEMO_SESSION_RISKS_MOCK,
    sessionExitCriteria: PV_METRICS_DEMO_SESSION_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Controlled Demo Session mock data. No agenda reuniones reales, no graba sesiones reales, no genera ZIP/APK/PDF real, no crea firma digital real, no envía correos reales, no usa backend, no APIs, no localStorage, no conectores reales, no SCADA, no medidores, no weather API, no CEN, no credenciales, no tokens, no secrets, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule: '1O-N.2A — Demo Session Runbook Visual Card',
  };
