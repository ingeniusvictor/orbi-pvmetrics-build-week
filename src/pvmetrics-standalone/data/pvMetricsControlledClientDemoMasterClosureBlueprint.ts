const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_MASTER_CLOSURE_BLUEPRINT = {
  id: 'pvmetrics-controlled-client-demo-master-closure-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-X — Controlled Client Demo Master Closure',
  module: '1O-X.0 — Controlled Client Demo Master Closure Blueprint',
  internalVersion:
    '0.1O-X.0-controlled-client-demo-master-closure-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_RELEASE_NO_REAL_APPROVAL',
  blueprintStatusLabel:
    'CLIENT DEMO MASTER CLOSURE — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir un cierre maestro conceptual para la demo cliente de ORBI PVMetrics IA, consolidando bloques cerrados, límites de seguridad, evidencia demo, readiness, guion, review board y gobernanza humana sin convertir la demo en release real, sin aprobar producción, sin crear artefactos reales y sin ejecutar acciones externas.',

  masterClosurePurpose: [
    'Consolidar el cierre maestro de la demo cliente de ORBI PVMetrics IA.',
    'Confirmar que los bloques 1O-T, 1O-U, 1O-V y 1O-W quedaron cerrados como capas locales, mock, read-only, demo-only y no productivas.',
    'Separar explícitamente cierre conceptual de cualquier aprobación real, release real, piloto real, comité real o acta legal real.',
    'Definir una base para futuros tipos, mock data, visual card, export text box, wizard integration y cierre QA del bloque 1O-X.',
    'Mantener la aplicación aislada, sin datos reales, sin conectores reales, sin SCADA, sin medidores, sin CEN, sin APIs reales, sin backend y sin telecontrol.',
  ],

  completedDemoClosureBlocks: [
    {
      id: 'closed-block-1o-t',
      label: '1O-T — Controlled Client Demo Evidence Freeze',
      description:
        'Bloque de congelamiento de evidencia demo controlada, local, mock y sin evidencia operacional real.',
      closureStatus: 'closed',
    },
    {
      id: 'closed-block-1o-u',
      label: '1O-U — Controlled Client Demo Delivery Readiness',
      description:
        'Bloque de readiness conceptual de entrega demo, sin email, reunión, link, invitación, PDF, ZIP, APK ni release real.',
      closureStatus: 'closed',
    },
    {
      id: 'closed-block-1o-v',
      label: '1O-V — Controlled Client Demo Presentation Script',
      description:
        'Bloque de guion controlado de presentación demo, sin video, audio, voz, avatar, PowerPoint ni entrega externa real.',
      closureStatus: 'closed',
    },
    {
      id: 'closed-block-1o-w',
      label: '1O-W — Controlled Client Demo Final Review Board',
      description:
        'Bloque de mesa conceptual de revisión final, sin aprobación real, comité real, acta legal real ni decisión productiva.',
      closureStatus: 'closed',
    },
  ],

  allowedMasterClosureItems: [
    {
      id: 'allowed-master-demo-summary',
      label: 'Resumen maestro conceptual',
      description:
        'Resumen local del estado demo, bloques cerrados, boundaries, riesgos y próximos pasos humanos.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-master-safety-review',
      label: 'Revisión maestra de seguridad',
      description:
        'Validación conceptual de ausencia de datos reales, conectores reales, credenciales, APIs reales, SCADA, CEN, telecontrol y acciones externas.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-master-roadmap-review',
      label: 'Revisión maestra de roadmap',
      description:
        'Revisión del flujo 1O-T a 1O-W como bloques cerrados y del bloque 1O-X como cierre maestro conceptual.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-master-human-next-step',
      label: 'Próximo paso humano conceptual',
      description:
        'Texto que indica que cualquier paso real debe definirse manualmente fuera de la app, con alcance separado y aprobación humana.',
      requiresHumanReview: true,
    },
  ],

  blockedMasterClosureItems: [
    {
      id: 'blocked-master-real-release',
      label: 'Release real o productiva',
      severity: 'critical',
      reason:
        'El cierre maestro no puede crear, aprobar ni distribuir una release productiva.',
      safeAlternative:
        'Declarar únicamente cierre conceptual demo-only y recomendación humana externa.',
    },
    {
      id: 'blocked-master-real-approval',
      label: 'Aprobación real',
      severity: 'critical',
      reason:
        'El cierre maestro no puede simular aprobación real de cliente, comité, legal, producción, piloto o contrato.',
      safeAlternative:
        'Usar estados mock sin validez contractual, operacional ni legal.',
    },
    {
      id: 'blocked-master-real-artifacts',
      label: 'Artefactos reales',
      severity: 'critical',
      reason:
        'No se puede generar PDF real, ZIP real, APK real, instalador, ejecutable, PowerPoint final, video, audio, voz o avatar real.',
      safeAlternative:
        'Mantener todo como texto local/mock sin exportación productiva.',
    },
    {
      id: 'blocked-master-real-systems',
      label: 'Sistemas reales',
      severity: 'critical',
      reason:
        'No se puede conectar a SCADA, medidores, CEN, APIs reales, backend, bases de datos, endpoints o infraestructura real.',
      safeAlternative:
        'Usar únicamente mock data local y componentes read-only.',
    },
    {
      id: 'blocked-master-operations',
      label: 'Operación real',
      severity: 'critical',
      reason:
        'No se puede ejecutar telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
      safeAlternative:
        'Mantener lenguaje read-only, demo-only y no operacional.',
    },
    {
      id: 'blocked-master-network-realtime',
      label: 'Canales realtime o media',
      severity: 'high',
      reason:
        'No se debe introducir WebRTC, Socket.IO, SDP, streaming, grabación, audio, voz o avatar real.',
      safeAlternative:
        'Mantener cierre textual, local, mock y sin transmisión.',
    },
  ],

  masterClosurePrinciples: [
    {
      id: 'principle-master-closure-only',
      label: 'Master closure only',
      description:
        'El bloque solo consolida cierre conceptual; no publica, aprueba, envía, instala, agenda ni distribuye nada real.',
      mandatory: true,
    },
    {
      id: 'principle-no-production-conversion',
      label: 'Sin conversión productiva',
      description:
        'Ninguna capa cerrada puede interpretarse como release productiva, piloto real o herramienta operacional.',
      mandatory: true,
    },
    {
      id: 'principle-human-separation',
      label: 'Separación humana',
      description:
        'Toda decisión real debe estar fuera de la app y ser ejecutada manualmente por responsables humanos.',
      mandatory: true,
    },
    {
      id: 'principle-sandbox-integrity',
      label: 'Integridad sandbox',
      description:
        'La app permanece local, mock, read-only, demo-only, no productiva y sin acciones externas.',
      mandatory: true,
    },
    {
      id: 'principle-no-cross-project',
      label: 'Sin mezcla de proyectos',
      description:
        'El cierre maestro pertenece exclusivamente a ORBI PVMetrics IA y no puede importar lógica de otros proyectos ORBI.',
      mandatory: true,
    },
  ],

  masterClosureDomains: [
    {
      id: 'domain-master-build',
      label: 'Build, TypeScript y QA',
      description:
        'Confirmación conceptual de build correcto, TypeScript limpio, QA checklist actualizado y documentación sincronizada.',
      reviewMode: 'technical-closure',
    },
    {
      id: 'domain-master-evidence',
      label: 'Evidence Freeze',
      description:
        'Consolidación del bloque 1O-T sin datos reales ni evidencia operacional.',
      reviewMode: 'evidence-closure',
    },
    {
      id: 'domain-master-delivery',
      label: 'Delivery Readiness',
      description:
        'Consolidación del bloque 1O-U sin emails, reuniones, links, invitaciones ni artefactos reales.',
      reviewMode: 'delivery-closure',
    },
    {
      id: 'domain-master-script',
      label: 'Presentation Script',
      description:
        'Consolidación del bloque 1O-V sin video, audio, voz, avatar, PowerPoint ni entrega externa.',
      reviewMode: 'script-closure',
    },
    {
      id: 'domain-master-review-board',
      label: 'Final Review Board',
      description:
        'Consolidación del bloque 1O-W sin aprobación real, comité real, acta real ni decisión productiva.',
      reviewMode: 'board-closure',
    },
    {
      id: 'domain-master-security',
      label: 'Security & Isolation',
      description:
        'Validación de ausencia de credenciales, tokens, secrets, APIs reales, conectores, SCADA, CEN, backend, localStorage y telecontrol.',
      reviewMode: 'security-closure',
    },
  ],

  masterClosureGates: [
    {
      id: 'gate-master-build-clean',
      label: 'Build limpio',
      required: true,
      description:
        'La app debe compilar correctamente antes de cerrar el bloque maestro conceptual.',
    },
    {
      id: 'gate-master-typescript-clean',
      label: 'TypeScript limpio',
      required: true,
      description:
        'TypeScript debe estar libre de errores para validar el cierre maestro.',
    },
    {
      id: 'gate-master-prior-blocks-closed',
      label: 'Bloques previos cerrados',
      required: true,
      description:
        'Los bloques 1O-T, 1O-U, 1O-V y 1O-W deben estar documentados como cerrados.',
    },
    {
      id: 'gate-master-no-real-artifacts',
      label: 'Sin artefactos reales',
      required: true,
      description:
        'No deben existir PDF, ZIP, APK, instalador, ejecutable, PowerPoint, video, audio, voz, avatar ni release productiva.',
    },
    {
      id: 'gate-master-no-real-systems',
      label: 'Sin sistemas reales',
      required: true,
      description:
        'No deben existir conexiones reales a SCADA, medidores, CEN, APIs, backend, base de datos, WebRTC, Socket.IO o SDP.',
    },
    {
      id: 'gate-master-no-operations',
      label: 'Sin operación real',
      required: true,
      description:
        'No debe existir telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
    },
  ],

  masterClosureApprovalRoles: [
    {
      id: 'approval-master-demo-owner',
      label: 'Master Demo Owner',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Revisa cierre maestro conceptual, narrativa, bloques cerrados y próximos pasos humanos.',
    },
    {
      id: 'approval-master-qa-owner',
      label: 'Master QA Owner',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Revisa build, TypeScript, QA checklist, manifest, README y consistencia de versionado.',
    },
    {
      id: 'approval-master-security-owner',
      label: 'Master Security Owner',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Revisa boundaries, aislamiento, ausencia de datos reales, credenciales, APIs, SCADA, CEN, backend y telecontrol.',
    },
    {
      id: 'approval-master-technical-owner',
      label: 'Master Technical Owner',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Revisa arquitectura standalone, rutas permitidas, imports y ausencia de mezcla con otros proyectos ORBI.',
    },
  ],

  masterClosureRiskRegister: [
    {
      id: 'risk-master-closure-misread-as-release',
      label: 'Cierre maestro interpretado como release',
      severity: 'critical',
      mitigation:
        'Declarar explícitamente que el cierre maestro es conceptual y no aprueba producción, piloto, comité, contrato ni release.',
    },
    {
      id: 'risk-master-artifact-confusion',
      label: 'Confusión con artefactos reales',
      severity: 'high',
      mitigation:
        'Bloquear PDF, ZIP, APK, PowerPoint, instalador, ejecutable, video, audio, voz y avatar real.',
    },
    {
      id: 'risk-master-operational-confusion',
      label: 'Confusión operacional',
      severity: 'critical',
      mitigation:
        'Reforzar ausencia de SCADA, medidores, CEN, APIs reales, telecontrol, setpoints, comandos BESS/inversores y SCADA ACK.',
    },
    {
      id: 'risk-master-cross-project-mix',
      label: 'Mezcla cruzada ORBI',
      severity: 'critical',
      mitigation:
        'Mantener rutas, imports, providers, stores y componentes exclusivamente dentro de ORBI PVMetrics IA.',
    },
    {
      id: 'risk-master-realtime-or-media-leak',
      label: 'Introducción de realtime/media',
      severity: 'high',
      mitigation:
        'Bloquear WebRTC, Socket.IO, SDP, streaming, grabación, audio real, voz real y avatar real.',
    },
  ],

  masterClosureExitCriteria: [
    'Blueprint de Controlled Client Demo Master Closure creado.',
    'Master Closure Purpose declarado.',
    'Completed Demo Closure Blocks declarados.',
    'Allowed Master Closure Items declarados.',
    'Blocked Master Closure Items declarados.',
    'Master Closure Principles declarados.',
    'Master Closure Domains declarados.',
    'Master Closure Gates declarados.',
    'Master Closure Approval Roles declarados.',
    'Master Closure Risk Register declarado.',
    'Master Closure Exit Criteria declarado.',
    'Master Closure Boundary declarado.',
    'Next Roadmap 1O-X declarado.',
    'No se aprueba release real.',
    'No se aprueba producción real.',
    'No se crea artefacto real.',
    'No se conecta a sistemas reales.',
    'No se ejecuta operación real.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  masterClosureBoundary:
    'Este blueprint solo define el cierre maestro conceptual de la demo cliente. No convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea entregable legal real, no crea PowerPoint real, no crea PDF real, no crea ZIP real, no crea APK real, no crea instalador real, no crea ejecutable real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no usa WebRTC, no usa Socket.IO, no usa SDP, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial, no reporte regulatorio, no trazabilidad a cliente/planta/activo/infraestructura real y no evidencia operacional real.',

  nextRoadmap: [
    '1O-X.1A — Client Demo Master Closure Types',
    '1O-X.1B — Client Demo Master Closure Mock Data',
    '1O-X.2A — Client Demo Master Closure Visual Card',
    '1O-X.2B — Client Demo Master Closure Export Text Box',
    '1O-X.3A — Client Demo Master Closure Wizard Integration',
    '1O-X.4A — Client Demo Master Closure Final QA & Closure',
  ],

  nextRecommendedModule:
    '1O-X.1A — Client Demo Master Closure Types',
} as const;
