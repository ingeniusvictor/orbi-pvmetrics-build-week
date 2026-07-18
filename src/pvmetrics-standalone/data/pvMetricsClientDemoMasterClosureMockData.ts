import {
  PVMetricsAllowedMasterClosureItem,
  PVMetricsBlockedMasterClosureItem,
  PVMetricsCompletedDemoClosureBlock,
  PVMetricsControlledClientDemoMasterClosurePack,
  PVMetricsMasterClosureApprovalRole,
  PVMetricsMasterClosureDomain,
  PVMetricsMasterClosureExitCriterion,
  PVMetricsMasterClosureGate,
  PVMetricsMasterClosurePrinciple,
  PVMetricsMasterClosureRiskRegisterItem,
} from '../types/pvmetrics-client-demo-master-closure.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-X.1B-client-demo-master-closure-mock-data';

export const PV_METRICS_MASTER_CLOSURE_PURPOSE_MOCK: string[] = [
  'Consolidar el cierre maestro conceptual de la demo cliente de ORBI PVMetrics IA.',
  'Confirmar que los bloques 1O-T, 1O-U, 1O-V y 1O-W quedaron cerrados como capas locales, mock, read-only, demo-only y no productivas.',
  'Separar explícitamente el cierre conceptual de cualquier aprobación real, release real, piloto real, comité real, contrato real o acta legal real.',
  'Mantener la app aislada de datos reales, conectores reales, SCADA, medidores, CEN, APIs reales, backend, localStorage, WebRTC, Socket.IO, SDP y telecontrol.',
  'Preparar una base segura para futura visual card, export text box, wizard integration y cierre QA final del bloque 1O-X.',
];

export const PV_METRICS_COMPLETED_DEMO_CLOSURE_BLOCKS_MOCK: PVMetricsCompletedDemoClosureBlock[] =
  [
    {
      blockId: 'closed-block-1o-t',
      label: '1O-T — Controlled Client Demo Evidence Freeze',
      itemType: 'completed-demo-closure-block',
      description:
        'Bloque de congelamiento de evidencia demo controlada, local, mock, read-only y sin evidencia operacional real.',
      closureStatus: 'closed',
    },
    {
      blockId: 'closed-block-1o-u',
      label: '1O-U — Controlled Client Demo Delivery Readiness',
      itemType: 'completed-demo-closure-block',
      description:
        'Bloque de readiness conceptual de entrega demo, sin email, reunión, link, invitación, PDF, ZIP, APK ni release real.',
      closureStatus: 'closed',
    },
    {
      blockId: 'closed-block-1o-v',
      label: '1O-V — Controlled Client Demo Presentation Script',
      itemType: 'completed-demo-closure-block',
      description:
        'Bloque de guion controlado de presentación demo, sin video, audio, voz, avatar, PowerPoint ni entrega externa real.',
      closureStatus: 'closed',
    },
    {
      blockId: 'closed-block-1o-w',
      label: '1O-W — Controlled Client Demo Final Review Board',
      itemType: 'completed-demo-closure-block',
      description:
        'Bloque de mesa conceptual de revisión final, sin aprobación real, comité real, acta legal real ni decisión productiva.',
      closureStatus: 'closed',
    },
  ];

export const PV_METRICS_ALLOWED_MASTER_CLOSURE_ITEMS_MOCK: PVMetricsAllowedMasterClosureItem[] =
  [
    {
      itemId: 'allowed-master-demo-summary',
      label: 'Resumen maestro conceptual',
      itemType: 'allowed-master-closure-item',
      description:
        'Resumen local del estado demo, bloques cerrados, boundaries, riesgos, gates y próximos pasos humanos conceptuales.',
      closureMode: 'master-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-safety-review',
      label: 'Revisión maestra de seguridad',
      itemType: 'allowed-master-closure-item',
      description:
        'Validación conceptual de ausencia de datos reales, conectores reales, credenciales, APIs reales, SCADA, CEN, telecontrol y acciones externas.',
      closureMode: 'security-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-roadmap-review',
      label: 'Revisión maestra de roadmap',
      itemType: 'allowed-master-closure-item',
      description:
        'Revisión del flujo 1O-T a 1O-W como bloques cerrados y del bloque 1O-X como cierre maestro conceptual.',
      closureMode: 'master-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-evidence-summary',
      label: 'Resumen de Evidence Freeze',
      itemType: 'allowed-master-closure-item',
      description:
        'Consolidación conceptual del bloque 1O-T como evidencia demo local, mock, no operacional y no regulatoria.',
      closureMode: 'evidence-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-delivery-summary',
      label: 'Resumen de Delivery Readiness',
      itemType: 'allowed-master-closure-item',
      description:
        'Consolidación conceptual del bloque 1O-U como readiness de entrega demo sin envíos, reuniones, links, invitaciones ni artefactos reales.',
      closureMode: 'delivery-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-script-summary',
      label: 'Resumen de Presentation Script',
      itemType: 'allowed-master-closure-item',
      description:
        'Consolidación conceptual del bloque 1O-V como guion textual controlado sin media real ni presentación final.',
      closureMode: 'script-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-board-summary',
      label: 'Resumen de Final Review Board',
      itemType: 'allowed-master-closure-item',
      description:
        'Consolidación conceptual del bloque 1O-W como mesa final sin aprobación real, comité real, acta legal real ni decisión productiva.',
      closureMode: 'board-closure',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-master-human-next-step',
      label: 'Próximo paso humano conceptual',
      itemType: 'allowed-master-closure-item',
      description:
        'Texto que indica que cualquier paso real debe definirse manualmente fuera de la app, con alcance separado y aprobación humana.',
      closureMode: 'human-governance',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_MASTER_CLOSURE_ITEMS_MOCK: PVMetricsBlockedMasterClosureItem[] =
  [
    {
      itemId: 'blocked-master-real-release',
      label: 'Release real o productiva',
      itemType: 'blocked-master-closure-item',
      severity: 'critical',
      reason:
        'El cierre maestro no puede crear, aprobar, empaquetar, publicar ni distribuir una release productiva.',
      safeAlternative:
        'Declarar únicamente cierre conceptual demo-only y recomendación humana externa.',
    },
    {
      itemId: 'blocked-master-real-approval',
      label: 'Aprobación real',
      itemType: 'blocked-master-closure-item',
      severity: 'critical',
      reason:
        'El cierre maestro no puede simular aprobación real de cliente, comité, legal, producción, piloto, release o contrato.',
      safeAlternative:
        'Usar estados mock sin validez contractual, operacional, comercial ni legal.',
    },
    {
      itemId: 'blocked-master-real-artifacts',
      label: 'Artefactos reales',
      itemType: 'blocked-master-closure-item',
      severity: 'critical',
      reason:
        'No se puede generar PDF real, ZIP real, APK real, instalador, ejecutable, PowerPoint final, video, audio, voz o avatar real.',
      safeAlternative:
        'Mantener todo como texto local/mock sin exportación productiva ni distribución externa.',
    },
    {
      itemId: 'blocked-master-real-systems',
      label: 'Sistemas reales',
      itemType: 'blocked-master-closure-item',
      severity: 'critical',
      reason:
        'No se puede conectar a SCADA, medidores, CEN, APIs reales, backend, bases de datos, endpoints o infraestructura real.',
      safeAlternative:
        'Usar únicamente mock data local y componentes read-only.',
    },
    {
      itemId: 'blocked-master-operations',
      label: 'Operación real',
      itemType: 'blocked-master-closure-item',
      severity: 'critical',
      reason:
        'No se puede ejecutar telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
      safeAlternative:
        'Mantener lenguaje read-only, demo-only y no operacional.',
    },
    {
      itemId: 'blocked-master-network-realtime',
      label: 'Canales realtime o media',
      itemType: 'blocked-master-closure-item',
      severity: 'high',
      reason:
        'No se debe introducir WebRTC, Socket.IO, SDP, streaming, grabación, audio, voz o avatar real.',
      safeAlternative:
        'Mantener cierre textual, local, mock y sin transmisión.',
    },
    {
      itemId: 'blocked-master-real-traceability',
      label: 'Trazabilidad real',
      itemType: 'blocked-master-closure-item',
      severity: 'critical',
      reason:
        'No se puede crear trazabilidad a cliente real, planta real, activo real, infraestructura real, evento real o evidencia operacional real.',
      safeAlternative:
        'Usar referencias mock, genéricas y no identificables.',
    },
  ];

export const PV_METRICS_MASTER_CLOSURE_PRINCIPLES_MOCK: PVMetricsMasterClosurePrinciple[] =
  [
    {
      principleId: 'principle-master-closure-only',
      label: 'Master closure only',
      itemType: 'master-closure-principle',
      description:
        'El bloque solo consolida cierre conceptual; no publica, aprueba, envía, instala, agenda ni distribuye nada real.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-production-conversion',
      label: 'Sin conversión productiva',
      itemType: 'master-closure-principle',
      description:
        'Ninguna capa cerrada puede interpretarse como release productiva, piloto real o herramienta operacional.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-separation',
      label: 'Separación humana',
      itemType: 'master-closure-principle',
      description:
        'Toda decisión real debe estar fuera de la app y ser ejecutada manualmente por responsables humanos autorizados.',
      mandatory: true,
    },
    {
      principleId: 'principle-sandbox-integrity',
      label: 'Integridad sandbox',
      itemType: 'master-closure-principle',
      description:
        'La app permanece local, mock, read-only, demo-only, no productiva y sin acciones externas.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-cross-project',
      label: 'Sin mezcla de proyectos',
      itemType: 'master-closure-principle',
      description:
        'El cierre maestro pertenece exclusivamente a ORBI PVMetrics IA y no puede importar lógica de otros proyectos ORBI.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-realtime-media',
      label: 'Sin realtime/media',
      itemType: 'master-closure-principle',
      description:
        'El cierre maestro no puede introducir WebRTC, Socket.IO, SDP, streaming, grabación, audio real, voz real ni avatar real.',
      mandatory: true,
    },
  ];

export const PV_METRICS_MASTER_CLOSURE_DOMAINS_MOCK: PVMetricsMasterClosureDomain[] =
  [
    {
      domainId: 'domain-master-build',
      label: 'Build, TypeScript y QA',
      itemType: 'master-closure-domain',
      closureMode: 'technical-closure',
      description:
        'Confirmación conceptual de build correcto, TypeScript limpio, QA checklist actualizado y documentación sincronizada.',
    },
    {
      domainId: 'domain-master-evidence',
      label: 'Evidence Freeze',
      itemType: 'master-closure-domain',
      closureMode: 'evidence-closure',
      description:
        'Consolidación del bloque 1O-T sin datos reales, sin evidencia operacional y sin reportes regulatorios.',
    },
    {
      domainId: 'domain-master-delivery',
      label: 'Delivery Readiness',
      itemType: 'master-closure-domain',
      closureMode: 'delivery-closure',
      description:
        'Consolidación del bloque 1O-U sin emails, reuniones, links, invitaciones ni artefactos reales.',
    },
    {
      domainId: 'domain-master-script',
      label: 'Presentation Script',
      itemType: 'master-closure-domain',
      closureMode: 'script-closure',
      description:
        'Consolidación del bloque 1O-V sin video, audio, voz, avatar, PowerPoint ni entrega externa.',
    },
    {
      domainId: 'domain-master-review-board',
      label: 'Final Review Board',
      itemType: 'master-closure-domain',
      closureMode: 'board-closure',
      description:
        'Consolidación del bloque 1O-W sin aprobación real, comité real, acta real ni decisión productiva.',
    },
    {
      domainId: 'domain-master-security',
      label: 'Security & Isolation',
      itemType: 'master-closure-domain',
      closureMode: 'security-closure',
      description:
        'Validación de ausencia de credenciales, tokens, secrets, APIs reales, conectores, SCADA, CEN, backend, localStorage, WebRTC, Socket.IO, SDP y telecontrol.',
    },
    {
      domainId: 'domain-master-human-governance',
      label: 'Human Governance',
      itemType: 'master-closure-domain',
      closureMode: 'human-governance',
      description:
        'Confirmación de que cualquier decisión real queda fuera de la app y requiere responsables humanos, alcance separado y proceso externo.',
    },
  ];

export const PV_METRICS_MASTER_CLOSURE_GATES_MOCK: PVMetricsMasterClosureGate[] =
  [
    {
      gateId: 'gate-master-build-clean',
      label: 'Build limpio',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'La app debe compilar correctamente antes de cerrar el bloque maestro conceptual.',
    },
    {
      gateId: 'gate-master-typescript-clean',
      label: 'TypeScript limpio',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'TypeScript debe estar libre de errores para validar el cierre maestro.',
    },
    {
      gateId: 'gate-master-prior-blocks-closed',
      label: 'Bloques previos cerrados',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'Los bloques 1O-T, 1O-U, 1O-V y 1O-W deben estar documentados como cerrados.',
    },
    {
      gateId: 'gate-master-no-real-artifacts',
      label: 'Sin artefactos reales',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'No deben existir PDF, ZIP, APK, instalador, ejecutable, PowerPoint, video, audio, voz, avatar ni release productiva.',
    },
    {
      gateId: 'gate-master-no-real-systems',
      label: 'Sin sistemas reales',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'No deben existir conexiones reales a SCADA, medidores, CEN, APIs, backend, base de datos, WebRTC, Socket.IO o SDP.',
    },
    {
      gateId: 'gate-master-no-operations',
      label: 'Sin operación real',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'No debe existir telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
    },
    {
      gateId: 'gate-master-no-cross-project',
      label: 'Sin mezcla ORBI',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'No debe existir importación de rutas, stores, providers, componentes ni lógica de otros proyectos ORBI.',
    },
    {
      gateId: 'gate-master-no-real-approval',
      label: 'Sin aprobación real',
      itemType: 'master-closure-gate',
      required: true,
      passed: true,
      description:
        'No debe existir aprobación real de cliente, comité, release, producción, piloto, contrato o representante legal.',
    },
  ];

export const PV_METRICS_MASTER_CLOSURE_APPROVAL_ROLES_MOCK: PVMetricsMasterClosureApprovalRole[] =
  [
    {
      approvalId: 'approval-master-demo-owner',
      label: 'Master Demo Owner',
      itemType: 'master-closure-approval-role',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Revisa el cierre maestro conceptual, narrativa general, bloques cerrados, boundaries y próximos pasos humanos fuera de la app.',
    },
    {
      approvalId: 'approval-master-qa-owner',
      label: 'Master QA Owner',
      itemType: 'master-closure-approval-role',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Revisa build, TypeScript, QA checklist, manifest, README, versionado y consistencia documental del cierre maestro.',
    },
    {
      approvalId: 'approval-master-security-owner',
      label: 'Master Security Owner',
      itemType: 'master-closure-approval-role',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Revisa boundaries, aislamiento, ausencia de datos reales, credenciales, APIs reales, SCADA, CEN, backend, localStorage, WebRTC, Socket.IO, SDP y telecontrol.',
    },
    {
      approvalId: 'approval-master-technical-owner',
      label: 'Master Technical Owner',
      itemType: 'master-closure-approval-role',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Revisa arquitectura standalone, rutas permitidas, imports, mock data local y ausencia de mezcla con otros proyectos ORBI.',
    },
    {
      approvalId: 'approval-master-business-owner',
      label: 'Master Business Owner',
      itemType: 'master-closure-approval-role',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Revisión comercial conceptual, sin aprobar venta, contrato, piloto real, release real, propuesta legal ni compromiso externo.',
    },
    {
      approvalId: 'approval-master-observer',
      label: 'Master Observer',
      itemType: 'master-closure-approval-role',
      reviewerRole: 'observer',
      required: false,
      description:
        'Rol observador sin capacidad de aprobación real, útil únicamente para lectura conceptual del cierre maestro.',
    },
  ];

export const PV_METRICS_MASTER_CLOSURE_RISK_REGISTER_MOCK: PVMetricsMasterClosureRiskRegisterItem[] =
  [
    {
      riskId: 'risk-master-closure-misread-as-release',
      label: 'Cierre maestro interpretado como release',
      itemType: 'master-closure-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar explícitamente que el cierre maestro es conceptual y no aprueba producción, piloto real, comité real, contrato, instalación, distribución ni release productiva.',
    },
    {
      riskId: 'risk-master-artifact-confusion',
      label: 'Confusión con artefactos reales',
      itemType: 'master-closure-risk-register-item',
      severity: 'high',
      mitigation:
        'Bloquear PDF real, ZIP real, APK real, PowerPoint real, instalador, ejecutable, video real, audio real, voz real y avatar real.',
    },
    {
      riskId: 'risk-master-operational-confusion',
      label: 'Confusión operacional',
      itemType: 'master-closure-risk-register-item',
      severity: 'critical',
      mitigation:
        'Reforzar ausencia de SCADA real, medidores reales, CEN, APIs reales, telecontrol, setpoints, comandos BESS, comandos de inversores y SCADA ACK.',
    },
    {
      riskId: 'risk-master-data-traceability',
      label: 'Trazabilidad real accidental',
      itemType: 'master-closure-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear referencias a cliente real, planta real, activo real, infraestructura real, evento real, endpoint, IP, ruta interna, credencial o evidencia operacional real.',
    },
    {
      riskId: 'risk-master-cross-project-mix',
      label: 'Mezcla cruzada ORBI',
      itemType: 'master-closure-risk-register-item',
      severity: 'critical',
      mitigation:
        'Mantener rutas, imports, providers, stores, componentes, servicios y lógica exclusivamente dentro de ORBI PVMetrics IA.',
    },
    {
      riskId: 'risk-master-realtime-or-media-leak',
      label: 'Introducción de realtime/media',
      itemType: 'master-closure-risk-register-item',
      severity: 'high',
      mitigation:
        'Bloquear WebRTC, Socket.IO, SDP, streaming, grabación, audio real, voz real, avatar real y cualquier canal realtime/media no requerido.',
    },
    {
      riskId: 'risk-master-regulatory-misinterpretation',
      label: 'Interpretación regulatoria incorrecta',
      itemType: 'master-closure-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar que el cierre maestro no genera forecast oficial, reporte regulatorio, envío CEN, evidencia operacional ni cumplimiento productivo.',
    },
  ];

export const PV_METRICS_MASTER_CLOSURE_EXIT_CRITERIA_MOCK: PVMetricsMasterClosureExitCriterion[] =
  [
    {
      criterionId: 'exit-master-types-ready',
      label: 'Tipos listos',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Controlled Client Demo Master Closure están implementados.',
    },
    {
      criterionId: 'exit-master-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'El mock data local queda poblado con purpose, completed blocks, allowed/blocked items, principles, domains, gates, approvals, risks, exit criteria y boundary.',
    },
    {
      criterionId: 'exit-master-prior-blocks-closed',
      label: 'Bloques previos cerrados',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los bloques 1O-T, 1O-U, 1O-V y 1O-W quedan representados como cerrados dentro del cierre maestro conceptual.',
    },
    {
      criterionId: 'exit-master-no-real-release',
      label: 'Sin release real',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'El cierre maestro no crea, aprueba, empaqueta, instala, publica ni distribuye release productiva.',
    },
    {
      criterionId: 'exit-master-no-real-approval',
      label: 'Sin aprobación real',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'El cierre maestro no aprueba cliente real, comité real, contrato real, piloto real, producción real ni decisión legal real.',
    },
    {
      criterionId: 'exit-master-no-real-artifacts',
      label: 'Sin artefactos reales',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea PDF real, ZIP real, APK real, PowerPoint real, instalador real, ejecutable real, video real, audio real, voz real ni avatar real.',
    },
    {
      criterionId: 'exit-master-no-realtime-media',
      label: 'Sin realtime/media',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se introduce WebRTC, Socket.IO, SDP, streaming, grabación ni canales media/realtime.',
    },
    {
      criterionId: 'exit-master-no-real-data',
      label: 'Sin datos reales',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se incorporan clientes reales, plantas reales, activos reales, eventos reales, endpoints, IPs, rutas internas, credenciales ni infraestructura real.',
    },
    {
      criterionId: 'exit-master-no-real-operations',
      label: 'Sin operación real',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'No hay SCADA real, medidores reales, CEN real, APIs reales, telecontrol, setpoints, comandos BESS, comandos inversores ni SCADA ACK.',
    },
    {
      criterionId: 'exit-master-no-regulatory-output',
      label: 'Sin salida regulatoria',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'El cierre maestro no genera forecast oficial, reporte regulatorio, envío CEN ni evidencia operacional real.',
    },
    {
      criterionId: 'exit-master-boundary-declared',
      label: 'Master Closure Boundary declarado',
      itemType: 'master-closure-exit-criterion',
      required: true,
      passed: true,
      description:
        'El límite de seguridad del cierre maestro queda declarado dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_MASTER_CLOSURE_PACK_MOCK: PVMetricsControlledClientDemoMasterClosurePack =
  {
    packId: 'pvmetrics-controlled-client-demo-master-closure-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-X — Controlled Client Demo Master Closure',
    module: '1O-X.1B — Client Demo Master Closure Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    masterClosurePurpose: PV_METRICS_MASTER_CLOSURE_PURPOSE_MOCK,
    completedDemoClosureBlocks:
      PV_METRICS_COMPLETED_DEMO_CLOSURE_BLOCKS_MOCK,
    allowedMasterClosureItems:
      PV_METRICS_ALLOWED_MASTER_CLOSURE_ITEMS_MOCK,
    blockedMasterClosureItems:
      PV_METRICS_BLOCKED_MASTER_CLOSURE_ITEMS_MOCK,
    masterClosurePrinciples:
      PV_METRICS_MASTER_CLOSURE_PRINCIPLES_MOCK,
    masterClosureDomains: PV_METRICS_MASTER_CLOSURE_DOMAINS_MOCK,
    masterClosureGates: PV_METRICS_MASTER_CLOSURE_GATES_MOCK,
    masterClosureApprovalRoles:
      PV_METRICS_MASTER_CLOSURE_APPROVAL_ROLES_MOCK,
    masterClosureRiskRegister:
      PV_METRICS_MASTER_CLOSURE_RISK_REGISTER_MOCK,
    masterClosureExitCriteria:
      PV_METRICS_MASTER_CLOSURE_EXIT_CRITERIA_MOCK,
    masterClosureBoundary:
      'Controlled Client Demo Master Closure mock data. Todo es local, conceptual, review-only, demo-only, read-only y no productivo. No convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea entregable legal real, no crea PowerPoint real, no crea PDF real, no crea ZIP real, no crea APK real, no crea instalador real, no crea ejecutable real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no usa WebRTC, no usa Socket.IO, no usa SDP, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial, no reporte regulatorio, no trazabilidad a cliente/planta/activo/infraestructura real y no evidencia operacional real.',
    nextRecommendedModule:
      '1O-X.2A — Client Demo Master Closure Visual Card',
  };
