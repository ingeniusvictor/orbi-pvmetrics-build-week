import {
  PVMetricsAllowedFinalReviewBoardItem,
  PVMetricsBlockedFinalReviewBoardItem,
  PVMetricsControlledClientDemoFinalReviewBoardPack,
  PVMetricsFinalReviewApprovalRole,
  PVMetricsFinalReviewBoardPrinciple,
  PVMetricsFinalReviewDomain,
  PVMetricsFinalReviewExitCriterion,
  PVMetricsFinalReviewGate,
  PVMetricsFinalReviewRiskRegisterItem,
} from '../types/pvmetrics-client-demo-final-review-board.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-W.1B-client-demo-final-review-board-mock-data';

export const PV_METRICS_FINAL_REVIEW_BOARD_PURPOSE_MOCK: string[] = [
  'Consolidar una mesa conceptual de revisión final para la demo cliente de ORBI PVMetrics IA.',
  'Evaluar madurez demo, alcance, safety boundaries, evidence freeze, delivery readiness y presentation script readiness.',
  'Confirmar que la app se mantiene local, mock, read-only, demo-only, no productiva y sin acciones externas reales.',
  'Evitar que la revisión conceptual sea interpretada como aprobación real, release real, comité real, acta legal real o piloto real.',
  'Preparar una base segura para futura visual card, export text box, wizard integration y cierre QA del bloque 1O-W.',
];

export const PV_METRICS_ALLOWED_FINAL_REVIEW_BOARD_ITEMS_MOCK: PVMetricsAllowedFinalReviewBoardItem[] =
  [
    {
      itemId: 'allowed-demo-maturity-review',
      label: 'Revisión de madurez demo',
      itemType: 'allowed-final-review-board-item',
      description:
        'Evaluación conceptual del estado de módulos cerrados, build, TypeScript, documentación, QA checklist y readiness local.',
      reviewMode: 'technical-readiness',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-scope-readiness-review',
      label: 'Revisión de alcance demo-only',
      itemType: 'allowed-final-review-board-item',
      description:
        'Validación conceptual de que la app no promete producción, forecast oficial, regulación, CEN, integración real ni operación real.',
      reviewMode: 'safety-boundary',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-safety-boundary-review',
      label: 'Revisión de safety boundaries',
      itemType: 'allowed-final-review-board-item',
      description:
        'Confirmación conceptual de ausencia de datos reales, conectores reales, credenciales, endpoints, telecontrol y acciones externas.',
      reviewMode: 'safety-boundary',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-evidence-freeze-review',
      label: 'Revisión de Evidence Freeze',
      itemType: 'allowed-final-review-board-item',
      description:
        'Validación conceptual del bloque 1O-T como evidencia demo controlada, local, mock y sin trazabilidad operacional real.',
      reviewMode: 'evidence-review',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-delivery-readiness-review',
      label: 'Revisión de Delivery Readiness',
      itemType: 'allowed-final-review-board-item',
      description:
        'Validación conceptual del bloque 1O-U como readiness de entrega demo sin email, reunión, link, invitación ni artefactos reales.',
      reviewMode: 'delivery-review',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-presentation-script-review',
      label: 'Revisión de Presentation Script',
      itemType: 'allowed-final-review-board-item',
      description:
        'Validación conceptual del bloque 1O-V como guion textual controlado sin video, audio, avatar, PowerPoint ni entrega externa.',
      reviewMode: 'script-review',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-risk-posture-review',
      label: 'Revisión de postura de riesgo',
      itemType: 'allowed-final-review-board-item',
      description:
        'Evaluación conceptual de riesgos de sobrepromesa, filtración de datos, confusión operacional y claims regulatorios.',
      reviewMode: 'risk-review',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-human-next-step-recommendation',
      label: 'Recomendación humana de próximo paso',
      itemType: 'allowed-final-review-board-item',
      description:
        'Texto conceptual que puede sugerir una revisión humana posterior, sin aprobar ni ejecutar entrega, piloto o release real.',
      reviewMode: 'human-governance',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_FINAL_REVIEW_BOARD_ITEMS_MOCK: PVMetricsBlockedFinalReviewBoardItem[] =
  [
    {
      itemId: 'blocked-real-release-approval',
      label: 'Aprobación de release real',
      itemType: 'blocked-final-review-board-item',
      severity: 'critical',
      reason:
        'El board conceptual no puede aprobar producción, publicación, distribución, instalación ni uso operativo.',
      safeAlternative:
        'Registrar únicamente una recomendación conceptual para revisión humana posterior.',
    },
    {
      itemId: 'blocked-real-client-approval',
      label: 'Aprobación real de cliente',
      itemType: 'blocked-final-review-board-item',
      severity: 'critical',
      reason:
        'No se puede simular ni registrar aprobación real de cliente, stakeholder, comité, representante legal o responsable comercial.',
      safeAlternative:
        'Usar roles mock y estados conceptuales sin validez contractual, operacional ni comercial.',
    },
    {
      itemId: 'blocked-real-meeting-or-minutes',
      label: 'Reunión o acta real',
      itemType: 'blocked-final-review-board-item',
      severity: 'critical',
      reason:
        'No se pueden crear reuniones reales, links, invitaciones, actas legales, minutas oficiales ni registros formales.',
      safeAlternative:
        'Crear únicamente una estructura conceptual de revisión local y texto copiable no oficial.',
    },
    {
      itemId: 'blocked-production-artifact',
      label: 'Artefacto productivo',
      itemType: 'blocked-final-review-board-item',
      severity: 'critical',
      reason:
        'No se puede crear PDF real, ZIP real, APK real, instalador, ejecutable, PowerPoint final ni release productiva.',
      safeAlternative:
        'Mantener todo como texto local/mock sin distribución real ni empaquetado productivo.',
    },
    {
      itemId: 'blocked-operational-or-regulatory-claim',
      label: 'Claim operacional o regulatorio',
      itemType: 'blocked-final-review-board-item',
      severity: 'critical',
      reason:
        'No se puede afirmar operación real, forecast oficial, envío CEN, reporte regulatorio, telecontrol o cumplimiento productivo.',
      safeAlternative:
        'Usar lenguaje demo-only, conceptual, read-only, no productivo y sin validez regulatoria.',
    },
    {
      itemId: 'blocked-real-data-traceability',
      label: 'Trazabilidad real de datos',
      itemType: 'blocked-final-review-board-item',
      severity: 'critical',
      reason:
        'No se puede crear trazabilidad a cliente real, planta real, activo real, evento real, infraestructura real, endpoints, IPs o credenciales.',
      safeAlternative:
        'Usar referencias mock y lenguaje no identificable.',
    },
  ];

export const PV_METRICS_FINAL_REVIEW_BOARD_PRINCIPLES_MOCK: PVMetricsFinalReviewBoardPrinciple[] =
  [
    {
      principleId: 'principle-review-only',
      label: 'Review-only',
      itemType: 'final-review-board-principle',
      description:
        'El bloque solo define una revisión conceptual; no aprueba, publica, envía, agenda, invita ni distribuye nada real.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-governance',
      label: 'Gobernanza humana',
      itemType: 'final-review-board-principle',
      description:
        'Toda decisión real debe quedar fuera de la app y ser ejecutada manualmente por responsables humanos autorizados.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-production-approval',
      label: 'Sin aprobación productiva',
      itemType: 'final-review-board-principle',
      description:
        'La mesa no puede convertir la demo en producto, piloto real, release real, herramienta operacional ni activo regulatorio.',
      mandatory: true,
    },
    {
      principleId: 'principle-safety-first',
      label: 'Safety-first',
      itemType: 'final-review-board-principle',
      description:
        'La revisión prioriza límites, disclaimers, ausencia de datos reales, ausencia de conectores, ausencia de credenciales y ausencia de telecontrol.',
      mandatory: true,
    },
    {
      principleId: 'principle-traceable-demo-closure',
      label: 'Cierre demo trazable',
      itemType: 'final-review-board-principle',
      description:
        'La revisión consolida evidencia de módulos cerrados sin crear trazabilidad a cliente, planta, activo, evento o infraestructura real.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-external-action',
      label: 'Sin acción externa',
      itemType: 'final-review-board-principle',
      description:
        'El board no debe ejecutar emails, calendarios, reuniones, enlaces, APIs, descargas, subidas, paquetes ni acciones de red.',
      mandatory: true,
    },
  ];

export const PV_METRICS_FINAL_REVIEW_DOMAINS_MOCK: PVMetricsFinalReviewDomain[] =
  [
    {
      domainId: 'domain-build-and-typescript',
      label: 'Build y TypeScript',
      itemType: 'final-review-domain',
      reviewMode: 'technical-readiness',
      description:
        'Confirmación conceptual de build correcto, TypeScript limpio y app operativa en sandbox local.',
    },
    {
      domainId: 'domain-architecture-isolation',
      label: 'Aislamiento standalone',
      itemType: 'final-review-domain',
      reviewMode: 'technical-readiness',
      description:
        'Revisión de rutas permitidas, ausencia de imports cruzados y separación estricta de otros proyectos ORBI.',
    },
    {
      domainId: 'domain-scope-and-safety',
      label: 'Alcance y seguridad',
      itemType: 'final-review-domain',
      reviewMode: 'safety-boundary',
      description:
        'Validación de que la app sigue siendo local, mock, read-only, demo-only y no productiva.',
    },
    {
      domainId: 'domain-evidence-freeze',
      label: 'Evidence Freeze',
      itemType: 'final-review-domain',
      reviewMode: 'evidence-review',
      description:
        'Revisión del bloque 1O-T como evidencia demo controlada sin datos reales ni artefactos productivos.',
    },
    {
      domainId: 'domain-delivery-readiness',
      label: 'Delivery Readiness',
      itemType: 'final-review-domain',
      reviewMode: 'delivery-review',
      description:
        'Revisión del bloque 1O-U como readiness conceptual sin email, reunión, link, invitación ni entrega real.',
    },
    {
      domainId: 'domain-presentation-script',
      label: 'Presentation Script',
      itemType: 'final-review-domain',
      reviewMode: 'script-review',
      description:
        'Revisión del bloque 1O-V como guion textual controlado sin video, audio, avatar, PowerPoint ni entrega externa.',
    },
    {
      domainId: 'domain-final-risk-posture',
      label: 'Postura final de riesgos',
      itemType: 'final-review-domain',
      reviewMode: 'risk-review',
      description:
        'Revisión de riesgos de sobrepromesa, filtración de datos, confusión operacional, claims regulatorios y uso indebido de artefactos.',
    },
    {
      domainId: 'domain-human-governance',
      label: 'Gobernanza humana',
      itemType: 'final-review-domain',
      reviewMode: 'human-governance',
      description:
        'Validación de que cualquier decisión real queda fuera de la app y requiere responsables humanos.',
    },
  ];

export const PV_METRICS_FINAL_REVIEW_GATES_MOCK: PVMetricsFinalReviewGate[] =
  [
    {
      gateId: 'gate-build-clean',
      label: 'Build limpio',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar que la app compila correctamente antes de considerar cualquier revisión humana posterior.',
    },
    {
      gateId: 'gate-typescript-clean',
      label: 'TypeScript limpio',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar que TypeScript no presenta errores antes de cerrar la revisión conceptual.',
    },
    {
      gateId: 'gate-safety-boundaries-present',
      label: 'Boundaries presentes',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar que los límites de no producción, no datos reales y no acciones externas están presentes.',
    },
    {
      gateId: 'gate-no-real-artifacts',
      label: 'Sin artefactos reales',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar que no se crean PDF, ZIP, APK, PowerPoint, video, audio, avatar, ejecutables ni release productiva.',
    },
    {
      gateId: 'gate-no-real-operations',
      label: 'Sin operación real',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar ausencia de SCADA real, medidores reales, CEN real, APIs reales, telecontrol, setpoints y comandos.',
    },
    {
      gateId: 'gate-no-real-approval',
      label: 'Sin aprobación real',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar que no existe aprobación real de cliente, comité, release, producción, piloto ni representante legal.',
    },
    {
      gateId: 'gate-no-project-mix',
      label: 'Sin mezcla de proyectos',
      itemType: 'final-review-gate',
      required: true,
      passed: true,
      description:
        'Confirmar que el módulo pertenece exclusivamente a ORBI PVMetrics IA y no importa rutas ni componentes de otros proyectos ORBI.',
    },
  ];

export const PV_METRICS_FINAL_REVIEW_APPROVAL_ROLES_MOCK: PVMetricsFinalReviewApprovalRole[] =
  [
    {
      approvalId: 'approval-final-demo-owner',
      label: 'Final Demo Owner',
      itemType: 'final-review-approval-role',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Revisa narrativa, alcance demo, madurez local, readiness, guion de presentación y próximos pasos conceptuales.',
    },
    {
      approvalId: 'approval-final-qa-owner',
      label: 'Final QA Owner',
      itemType: 'final-review-approval-role',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Revisa build, TypeScript, QA checklist, módulos cerrados, trazabilidad documental y consistencia del roadmap.',
    },
    {
      approvalId: 'approval-final-security-owner',
      label: 'Final Security Owner',
      itemType: 'final-review-approval-role',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Revisa ausencia de datos reales, credenciales, tokens, secrets, API keys, endpoints, infraestructura, conectores y telecontrol.',
    },
    {
      approvalId: 'approval-final-technical-owner',
      label: 'Final Technical Owner',
      itemType: 'final-review-approval-role',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Revisa aislamiento standalone, dependencias seguras, arquitectura local, mock data y ausencia de APIs reales.',
    },
    {
      approvalId: 'approval-final-business-owner',
      label: 'Final Business Owner',
      itemType: 'final-review-approval-role',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Revisión comercial conceptual si se planea una presentación externa posterior, sin aprobar ventas, contratos ni pilotos reales.',
    },
    {
      approvalId: 'approval-final-observer',
      label: 'Observer',
      itemType: 'final-review-approval-role',
      reviewerRole: 'observer',
      required: false,
      description:
        'Rol observador sin capacidad de aprobación real, útil solo para lectura conceptual del board.',
    },
  ];

export const PV_METRICS_FINAL_REVIEW_RISK_REGISTER_MOCK: PVMetricsFinalReviewRiskRegisterItem[] =
  [
    {
      riskId: 'risk-review-perceived-as-approval',
      label: 'Revisión interpretada como aprobación real',
      itemType: 'final-review-risk-register-item',
      severity: 'critical',
      mitigation:
        'Incluir disclaimer de que el board es conceptual, sin aprobación legal, productiva, operacional, comercial ni contractual real.',
    },
    {
      riskId: 'risk-overpromising-final-demo',
      label: 'Sobrepromesa de madurez',
      itemType: 'final-review-risk-register-item',
      severity: 'high',
      mitigation:
        'Reforzar que la demo es local, mock, read-only, no productiva y que cualquier piloto requiere revisión humana y alcance separado.',
    },
    {
      riskId: 'risk-sensitive-traceability',
      label: 'Trazabilidad sensible accidental',
      itemType: 'final-review-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear referencias a clientes reales, plantas reales, activos reales, eventos reales, infraestructura, endpoints, IPs, rutas internas o credenciales.',
    },
    {
      riskId: 'risk-operational-confusion',
      label: 'Confusión con operación real',
      itemType: 'final-review-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar ausencia de SCADA real, medidores reales, CEN, APIs reales, telecontrol, setpoints, comandos BESS, comandos de inversores y SCADA ACK.',
    },
    {
      riskId: 'risk-artifact-misuse',
      label: 'Uso indebido de artefactos',
      itemType: 'final-review-risk-register-item',
      severity: 'high',
      mitigation:
        'No crear PDF, ZIP, APK, PowerPoint, video, audio, avatar, ejecutables, instaladores ni release productiva.',
    },
    {
      riskId: 'risk-regulatory-misinterpretation',
      label: 'Interpretación regulatoria incorrecta',
      itemType: 'final-review-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar que el board no produce forecast oficial, reporte regulatorio, envío CEN ni evidencia operacional real.',
    },
    {
      riskId: 'risk-cross-project-contamination',
      label: 'Contaminación cruzada de proyectos ORBI',
      itemType: 'final-review-risk-register-item',
      severity: 'critical',
      mitigation:
        'Mantener rutas, imports, providers, stores y componentes exclusivamente dentro de ORBI PVMetrics IA.',
    },
  ];

export const PV_METRICS_FINAL_REVIEW_EXIT_CRITERIA_MOCK: PVMetricsFinalReviewExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Controlled Client Demo Final Review Board están implementados.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'El mock data local queda poblado con purpose, allowed/blocked items, principles, domains, gates, approvals, risks, exit criteria y boundary.',
    },
    {
      criterionId: 'exit-no-real-approval',
      label: 'Sin aprobación real',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'El board no aprueba release real, cliente real, comité real, piloto real, producción real ni decisión contractual real.',
    },
    {
      criterionId: 'exit-no-real-meeting-or-minutes',
      label: 'Sin reunión o acta real',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crean reuniones reales, links reales, invitaciones reales, actas legales reales ni minutas oficiales.',
    },
    {
      criterionId: 'exit-no-real-artifacts',
      label: 'Sin artefactos reales',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea PDF real, ZIP real, APK real, PowerPoint real, video real, audio real, avatar real, instalador ni release productiva.',
    },
    {
      criterionId: 'exit-no-real-data',
      label: 'Sin datos reales',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se incorporan clientes reales, plantas reales, activos reales, eventos reales, endpoints, IPs, rutas internas, credenciales ni infraestructura real.',
    },
    {
      criterionId: 'exit-no-real-operations',
      label: 'Sin operación real',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'No hay SCADA real, medidores reales, CEN real, APIs reales, telecontrol, setpoints, comandos BESS, comandos inversores ni SCADA ACK.',
    },
    {
      criterionId: 'exit-no-regulatory-output',
      label: 'Sin salida regulatoria',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'El board no genera forecast oficial, reporte regulatorio, envío CEN ni evidencia operacional real.',
    },
    {
      criterionId: 'exit-final-review-boundary',
      label: 'Final Review Boundary declarado',
      itemType: 'final-review-exit-criterion',
      required: true,
      passed: true,
      description:
        'El límite de seguridad de la mesa conceptual queda declarado dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_FINAL_REVIEW_BOARD_PACK_MOCK: PVMetricsControlledClientDemoFinalReviewBoardPack =
  {
    packId: 'pvmetrics-controlled-client-demo-final-review-board-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-W — Controlled Client Demo Final Review Board',
    module: '1O-W.1B — Client Demo Final Review Board Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    finalReviewBoardPurpose: PV_METRICS_FINAL_REVIEW_BOARD_PURPOSE_MOCK,
    allowedFinalReviewBoardItems:
      PV_METRICS_ALLOWED_FINAL_REVIEW_BOARD_ITEMS_MOCK,
    blockedFinalReviewBoardItems:
      PV_METRICS_BLOCKED_FINAL_REVIEW_BOARD_ITEMS_MOCK,
    finalReviewBoardPrinciples:
      PV_METRICS_FINAL_REVIEW_BOARD_PRINCIPLES_MOCK,
    finalReviewDomains: PV_METRICS_FINAL_REVIEW_DOMAINS_MOCK,
    finalReviewGates: PV_METRICS_FINAL_REVIEW_GATES_MOCK,
    finalReviewApprovalRoles:
      PV_METRICS_FINAL_REVIEW_APPROVAL_ROLES_MOCK,
    finalReviewRiskRegister:
      PV_METRICS_FINAL_REVIEW_RISK_REGISTER_MOCK,
    finalReviewExitCriteria:
      PV_METRICS_FINAL_REVIEW_EXIT_CRITERIA_MOCK,
    finalReviewBoundary:
      'Controlled Client Demo Final Review Board mock data. Todo es local, conceptual, review-only, demo-only, read-only y no productivo. No aprueba release real, no crea comité real, no crea acta legal real, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no crea PowerPoint real, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial, no reporte regulatorio, no trazabilidad a cliente/planta/activo/infraestructura real y no evidencia operacional real.',
    nextRecommendedModule:
      '1O-W.2A — Client Demo Final Review Board Visual Card',
  };
