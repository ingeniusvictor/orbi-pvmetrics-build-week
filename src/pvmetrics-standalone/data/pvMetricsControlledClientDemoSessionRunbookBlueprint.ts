const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_BLUEPRINT = {
  id: 'pvmetrics-controlled-client-demo-session-runbook-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-N — Controlled Client Demo Session Runbook',
  module: '1O-N.0 — Controlled Client Demo Session Runbook Blueprint',
  internalVersion:
    '0.1O-N.0-controlled-client-demo-session-runbook-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_SESSION_ACTION',
  blueprintStatusLabel:
    'CONTROLLED CLIENT DEMO SESSION RUNBOOK — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Preparar una guía conceptual para conducir una demo cliente de ORBI PVMetrics IA de forma controlada, segura, local, mock, read-only y no productiva, evitando sobrepromesas, acciones externas, integraciones reales o impacto operacional.',

  demoSessionPurpose: [
    'Presentar la propuesta de valor de ORBI PVMetrics IA como demo local y segura.',
    'Mostrar wizard, readiness, handoff cliente, release candidate, paquete demo local y sign-off humano.',
    'Explicar límites de seguridad antes de mostrar cualquier pantalla.',
    'Guiar conversación cliente sin afirmar producción, integración real ni reporte oficial.',
    'Recoger preguntas y próximos pasos sin comprometer conectores reales ni artefactos productivos.',
  ],

  demoSessionRoles: [
    {
      id: 'role-demo-operator',
      label: 'Demo Operator',
      responsibility:
        'Conduce la demo, sigue el guion, muestra pantallas permitidas y detiene la sesión si aparece riesgo de sobrepromesa.',
    },
    {
      id: 'role-technical-owner',
      label: 'Technical Owner',
      responsibility:
        'Responde dudas técnicas de arquitectura, límites read-only, build, TypeScript y rutas futuras de integración controlada.',
    },
    {
      id: 'role-qa-owner',
      label: 'QA Owner',
      responsibility:
        'Verifica que el discurso mantenga Safety Boundaries, No Real Integration Statement y claims seguros.',
    },
    {
      id: 'role-commercial-owner',
      label: 'Commercial Owner',
      responsibility:
        'Maneja expectativas comerciales, evitando prometer producción, resultados oficiales o conectores reales.',
    },
    {
      id: 'role-client-observer',
      label: 'Client Observer',
      responsibility:
        'Observa la demo, formula preguntas y valida interés sin recibir artefactos productivos ni acceso operativo.',
    },
  ],

  demoSessionPhases: [
    {
      id: 'phase-opening',
      label: 'Apertura y contexto',
      order: 1,
      objective:
        'Declarar que la demo es local, mock, read-only, no productiva y sin conexión a sistemas reales.',
      allowedFocus:
        'Propósito, valor, alcance, límites y forma segura de evaluación.',
    },
    {
      id: 'phase-guided-wizard',
      label: 'Recorrido guiado por wizard',
      order: 2,
      objective:
        'Mostrar las capas visuales ya integradas sin activar funciones reales.',
      allowedFocus:
        'Wizard, tarjetas visuales, checklists, readiness, handoff y reportes copiables.',
    },
    {
      id: 'phase-client-handoff',
      label: 'Handoff cliente y próximos pasos',
      order: 3,
      objective:
        'Explicar materiales permitidos, claims bloqueados, gates humanos y ruta segura a piloto.',
      allowedFocus:
        'Client Pilot Handoff, Safe Next Steps y revisión humana.',
    },
    {
      id: 'phase-release-candidate',
      label: 'Release Candidate Demo',
      order: 4,
      objective:
        'Mostrar readiness de demo candidata sin afirmar release productivo.',
      allowedFocus:
        'Scope, boundaries, risks, readiness y blocked production claims.',
    },
    {
      id: 'phase-package-signoff',
      label: 'Paquete demo local y sign-off',
      order: 5,
      objective:
        'Mostrar ensamblaje conceptual, contenidos permitidos, artefactos bloqueados y sign-off humano.',
      allowedFocus:
        'Operator Sign-Off, preflight, reviewer checklist, risks y Safety Boundary.',
    },
    {
      id: 'phase-closing',
      label: 'Cierre y próximos pasos',
      order: 6,
      objective:
        'Cerrar con preguntas, límites reiterados y próximos pasos condicionados a revisión humana.',
      allowedFocus:
        'Preguntas, minuta conceptual, evaluación interna y roadmap futuro separado.',
    },
  ],

  preDemoChecklist: [
    {
      id: 'pre-build',
      label: 'Build validado',
      status: 'requires-run',
      command: 'npm run build',
      description:
        'Debe ejecutarse antes de cualquier demo cliente o revisión externa.',
    },
    {
      id: 'pre-typescript',
      label: 'TypeScript validado',
      status: 'requires-run',
      command: 'tsc --noEmit',
      description:
        'Debe ejecutarse para confirmar estabilidad técnica antes de la sesión.',
    },
    {
      id: 'pre-demo-mode-language',
      label: 'Lenguaje seguro preparado',
      status: 'requires-human-review',
      description:
        'El operador debe revisar guion y evitar claims productivos u oficiales.',
    },
    {
      id: 'pre-no-secrets',
      label: 'Sin secretos visibles',
      status: 'requires-human-review',
      description:
        'Confirmar que no hay credenciales, tokens, secrets ni variables productivas visibles.',
    },
    {
      id: 'pre-no-real-connectors',
      label: 'Sin conectores reales',
      status: 'requires-human-review',
      description:
        'Confirmar que no se activan SCADA, medidores, weather APIs, CEN, backend ni APIs externas.',
    },
  ],

  liveDemoScript: [
    {
      id: 'script-opening-disclaimer',
      phaseId: 'phase-opening',
      speakerRole: 'demo-operator',
      script:
        'Antes de comenzar, esta es una demo local, mock, read-only y no productiva. No está conectada a SCADA, medidores, CEN, backend ni sistemas reales.',
    },
    {
      id: 'script-value',
      phaseId: 'phase-opening',
      speakerRole: 'demo-operator',
      script:
        'El objetivo es mostrar el flujo de trabajo, la trazabilidad, los límites de seguridad y cómo podríamos preparar un piloto futuro controlado.',
    },
    {
      id: 'script-wizard',
      phaseId: 'phase-guided-wizard',
      speakerRole: 'demo-operator',
      script:
        'Recorreremos el wizard y las capas visuales. Todo lo que se ve aquí opera con datos mock locales y no ejecuta acciones externas.',
    },
    {
      id: 'script-handoff',
      phaseId: 'phase-client-handoff',
      speakerRole: 'demo-operator',
      script:
        'Esta sección ordena materiales permitidos, afirmaciones bloqueadas, condiciones de readiness y próximos pasos seguros.',
    },
    {
      id: 'script-release-candidate',
      phaseId: 'phase-release-candidate',
      speakerRole: 'technical-owner',
      script:
        'Release Candidate aquí significa demo interna/controlada, no producción ni artefacto distribuible real.',
    },
    {
      id: 'script-package',
      phaseId: 'phase-package-signoff',
      speakerRole: 'qa-owner',
      script:
        'Este paquete demo local no genera ZIP, APK, PDF ni firma digital real. Es una guía de ensamblaje conceptual y sign-off humano.',
    },
    {
      id: 'script-closing',
      phaseId: 'phase-closing',
      speakerRole: 'commercial-owner',
      script:
        'Cualquier piloto con datos reales requeriría alcance aprobado, contrato read-only, sanitización, QA y revisión humana previa.',
    },
  ],

  clientSafeStatements: [
    'Esta demo es local, mock, read-only y no productiva.',
    'La app no está conectada a SCADA real.',
    'La app no lee medidores reales.',
    'La app no envía información al CEN.',
    'La app no genera reportes oficiales ni regulatorios.',
    'La app no ejecuta telecontrol, setpoints ni comandos BESS/inversores.',
    'Los textos copiables son insumos de revisión humana, no documentos oficiales.',
    'Un piloto real requeriría un roadmap separado, contrato read-only y QA dedicado.',
  ],

  forbiddenDemoActions: [
    'Afirmar que la app está en producción.',
    'Afirmar que existe conexión SCADA real.',
    'Afirmar que existe lectura de medidores reales.',
    'Afirmar que existe envío CEN real.',
    'Afirmar que existe forecast oficial.',
    'Afirmar que existe reporte regulatorio oficial.',
    'Prometer ZIP/APK/PDF real desde este bloque.',
    'Prometer firma digital criptográfica real desde este bloque.',
    'Prometer backend, APIs o conectores reales ya habilitados.',
    'Ejecutar comandos operacionales o simular que existen comandos reales.',
    'Mostrar credenciales, tokens, secrets o pantallas productivas.',
  ],

  pauseStopCriteria: [
    {
      id: 'stop-real-integration-request',
      label: 'Solicitud de integración real inmediata',
      severity: 'high',
      action:
        'Pausar y aclarar que toda integración real queda fuera de la demo y requiere roadmap separado.',
    },
    {
      id: 'stop-production-claim',
      label: 'Confusión con producción',
      severity: 'high',
      action:
        'Detener el avance y reiterar No Real Integration Statement y demo no productiva.',
    },
    {
      id: 'stop-secret-exposure',
      label: 'Riesgo de exposición de secretos',
      severity: 'critical',
      action:
        'Detener la sesión inmediatamente y revisar pantalla antes de continuar.',
    },
    {
      id: 'stop-operational-control',
      label: 'Pregunta o presión por telecontrol',
      severity: 'critical',
      action:
        'Reafirmar que telecontrol, setpoints, BESS/inversores y SCADA ACK están prohibidos.',
    },
  ],

  questionHandlingRules: [
    'Responder primero con el límite de seguridad y luego con la ruta futura posible.',
    'No improvisar capacidades no implementadas.',
    'No prometer fechas, conectores, forecast oficial ni reportes regulatorios.',
    'Registrar preguntas para revisión humana posterior.',
    'Si la pregunta implica datos reales o integración, derivarla a piloto futuro read-only.',
    'Si la pregunta implica control operacional, marcarla como fuera de alcance.',
  ],

  evidenceCaptureBoundaries: [
    'Solo se permite capturar notas internas manuales.',
    'No se graba sesión real desde este módulo.',
    'No se genera minuta PDF real.',
    'No se envía correo automático.',
    'No se adjuntan archivos reales.',
    'No se suben evidencias a backend, nube ni APIs.',
    'Cualquier evidencia externa requiere aprobación humana previa.',
  ],

  postDemoFollowUpRules: [
    'Preparar resumen conceptual revisado por humano.',
    'Reiterar límites: no producción, no SCADA, no medidores, no CEN, no telecontrol.',
    'Separar preguntas comerciales de preguntas técnicas.',
    'Enviar próximos pasos solo si fueron aprobados por responsable humano.',
    'No enviar archivos ZIP/APK/PDF generados automáticamente.',
    'No comprometer integración real sin contrato read-only y QA dedicado.',
  ],

  humanApprovalGates: [
    {
      id: 'gate-before-demo',
      label: 'Antes de demo cliente',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Validar guion, límites, claims seguros, build, TypeScript y ausencia de secretos.',
    },
    {
      id: 'gate-before-answering-integration',
      label: 'Antes de responder sobre integración real',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Toda respuesta sobre integración real debe mantenerse condicionada a roadmap separado.',
    },
    {
      id: 'gate-before-followup',
      label: 'Antes de seguimiento externo',
      required: true,
      reviewerRole: 'commercial-owner',
      description:
        'Todo seguimiento externo debe revisar claims, límites y próximos pasos seguros.',
    },
  ],

  sessionRisks: [
    {
      id: 'risk-overpromise',
      label: 'Sobrepromesa durante la demo',
      severity: 'high',
      mitigation:
        'Usar guion seguro, client-safe statements y forbidden demo actions visibles.',
    },
    {
      id: 'risk-client-confuses-demo-with-production',
      label: 'Cliente confunde demo con producción',
      severity: 'high',
      mitigation:
        'Repetir No Real Integration Statement al inicio, mitad y cierre de la demo.',
    },
    {
      id: 'risk-pressure-for-real-connector',
      label: 'Presión por conector real inmediato',
      severity: 'critical',
      mitigation:
        'Activar pause/stop criteria y derivar a roadmap read-only separado.',
    },
    {
      id: 'risk-secret-or-real-system-exposure',
      label: 'Exposición accidental de secreto o sistema real',
      severity: 'critical',
      mitigation:
        'Detener sesión, ocultar pantalla y revisar entorno antes de continuar.',
    },
  ],

  sessionExitCriteria: [
    'Blueprint creado.',
    'Demo Session Purpose declarado.',
    'Demo Session Roles declarados.',
    'Demo Session Phases declaradas.',
    'Pre-Demo Checklist declarado.',
    'Live Demo Script declarado.',
    'Client-Safe Statements declarados.',
    'Forbidden Demo Actions declaradas.',
    'Pause / Stop Criteria declarados.',
    'Question Handling Rules declaradas.',
    'Evidence Capture Boundaries declaradas.',
    'Post-Demo Follow-Up Rules declaradas.',
    'Human Approval Gates declarados.',
    'Session Risks declarados.',
    'Safety Boundary declarada.',
    'Next Roadmap 1O-N declarado.',
    'No se crea UI nueva.',
    'No se modifica wizard.',
    'No se agenda reunión real.',
    'No se graba sesión real.',
    'No se genera ZIP/APK/PDF real.',
    'No se crea firma digital real.',
    'No se envían correos.',
    'No se crea backend.',
    'No se llaman APIs.',
    'No se usa localStorage.',
    'No se crean conectores reales.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint solo define un runbook conceptual para una sesión demo cliente controlada. No agenda reuniones reales, no graba sesiones, no genera ZIP/APK/PDF, no crea firma digital real, no envía correos, no crea backend, no llama APIs, no usa localStorage, no crea conectores reales, no conecta SCADA, no lee medidores, no usa weather API, no envía CEN, no usa credenciales/tokens/secrets, no ejecuta POST/PUT/PATCH/DELETE real, no habilita telecontrol, setpoints, comandos BESS ni comandos inversores.',

  nextRoadmap: [
    '1O-N.1A — Controlled Demo Session Types',
    '1O-N.1B — Controlled Demo Session Mock Data',
    '1O-N.2A — Demo Session Runbook Visual Card',
    '1O-N.2B — Demo Session Script Export Text Box',
    '1O-N.3A — Demo Session Wizard Integration',
    '1O-N.4A — Demo Session Final QA & Closure',
  ],

  nextRecommendedModule: '1O-N.1A — Controlled Demo Session Types',
} as const;
