const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_FINAL_REVIEW_BOARD_BLUEPRINT = {
  id: 'pvmetrics-controlled-client-demo-final-review-board-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-W — Controlled Client Demo Final Review Board',
  module: '1O-W.0 — Controlled Client Demo Final Review Board Blueprint',
  internalVersion:
    '0.1O-W.0-controlled-client-demo-final-review-board-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_APPROVAL_NO_REAL_RELEASE',
  blueprintStatusLabel:
    'CLIENT DEMO FINAL REVIEW BOARD — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir una mesa conceptual de revisión final para evaluar si la demo local de ORBI PVMetrics IA está lista para una revisión humana posterior, sin aprobar release real, sin crear reunión real, sin generar actas legales reales, sin distribuir artefactos y sin ejecutar acciones externas.',

  finalReviewBoardPurpose: [
    'Consolidar la revisión final conceptual de la demo cliente de ORBI PVMetrics IA.',
    'Confirmar que los bloques anteriores mantienen límites locales, mock, read-only, demo-only y no productivos.',
    'Revisar madurez demo, scope, evidencia, delivery readiness, guion de presentación y riesgos.',
    'Evitar confundir readiness conceptual con aprobación real de producción, piloto real o entrega externa.',
    'Preparar la base para futuros tipos, mock data, visual card, export text box, wizard integration y cierre QA del bloque 1O-W.',
  ],

  allowedFinalReviewBoardItems: [
    {
      id: 'allowed-demo-maturity-review',
      label: 'Revisión de madurez demo',
      description:
        'Evaluación conceptual del estado de módulos cerrados, build, TypeScript, documentación y readiness local.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-scope-readiness-review',
      label: 'Revisión de alcance demo-only',
      description:
        'Validación conceptual de que la app no promete producción, forecast oficial, regulación, CEN ni operación real.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-safety-boundary-review',
      label: 'Revisión de safety boundaries',
      description:
        'Confirmación conceptual de ausencia de datos reales, conectores reales, credenciales, telecontrol y acciones externas.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-evidence-delivery-script-review',
      label: 'Revisión de evidencia, delivery y guion',
      description:
        'Validación conceptual de los bloques 1O-T, 1O-U y 1O-V como capas locales, auditables y no productivas.',
      requiresHumanReview: true,
    },
    {
      id: 'allowed-human-next-step-recommendation',
      label: 'Recomendación humana de próximo paso',
      description:
        'Texto conceptual que sugiere revisión humana posterior, sin aprobar ni ejecutar una entrega real.',
      requiresHumanReview: true,
    },
  ],

  blockedFinalReviewBoardItems: [
    {
      id: 'blocked-real-release-approval',
      label: 'Aprobación de release real',
      severity: 'critical',
      reason:
        'Este bloque no puede aprobar producción, publicación, distribución, instalación ni uso operativo.',
      safeAlternative:
        'Registrar únicamente una recomendación conceptual para revisión humana posterior.',
    },
    {
      id: 'blocked-real-client-approval',
      label: 'Aprobación real de cliente',
      severity: 'critical',
      reason:
        'No se puede simular ni registrar aprobación real de cliente, stakeholder, comité o responsable legal.',
      safeAlternative:
        'Usar roles mock y estados conceptuales sin validez contractual ni operacional.',
    },
    {
      id: 'blocked-real-meeting-or-minutes',
      label: 'Reunión o acta real',
      severity: 'critical',
      reason:
        'No se pueden crear reuniones reales, links, invitaciones, actas legales ni registros oficiales.',
      safeAlternative:
        'Crear únicamente una estructura conceptual de revisión local.',
    },
    {
      id: 'blocked-production-artifact',
      label: 'Artefacto productivo',
      severity: 'critical',
      reason:
        'No se puede crear PDF real, ZIP real, APK real, instalador, ejecutable ni release productiva.',
      safeAlternative:
        'Mantener todo como texto local/mock sin distribución real.',
    },
    {
      id: 'blocked-operational-or-regulatory-claim',
      label: 'Claim operacional o regulatorio',
      severity: 'critical',
      reason:
        'No se puede afirmar operación real, forecast oficial, envío CEN, reporte regulatorio o telecontrol.',
      safeAlternative:
        'Usar lenguaje demo-only, conceptual, read-only y no productivo.',
    },
  ],

  finalReviewBoardPrinciples: [
    {
      id: 'principle-review-only',
      label: 'Review-only',
      description:
        'El bloque solo define una revisión conceptual; no aprueba, publica, envía, agenda ni distribuye nada real.',
      mandatory: true,
    },
    {
      id: 'principle-human-governance',
      label: 'Gobernanza humana',
      description:
        'Toda decisión real debe quedar fuera de la app y ser ejecutada manualmente por responsables humanos.',
      mandatory: true,
    },
    {
      id: 'principle-no-production-approval',
      label: 'Sin aprobación productiva',
      description:
        'La mesa no puede convertir la demo en producto, piloto real, release real ni herramienta operacional.',
      mandatory: true,
    },
    {
      id: 'principle-safety-first',
      label: 'Safety-first',
      description:
        'La revisión prioriza límites, disclaimers, ausencia de datos reales, ausencia de conectores y ausencia de telecontrol.',
      mandatory: true,
    },
    {
      id: 'principle-traceable-demo-closure',
      label: 'Cierre demo trazable',
      description:
        'La revisión debe consolidar evidencia de módulos cerrados sin crear trazabilidad a cliente, planta, activo o infraestructura real.',
      mandatory: true,
    },
  ],

  finalReviewDomains: [
    {
      id: 'domain-build-and-typescript',
      label: 'Build y TypeScript',
      description:
        'Confirmación conceptual de build correcto, TypeScript limpio y app operativa en sandbox local.',
      reviewMode: 'technical-readiness',
    },
    {
      id: 'domain-scope-and-safety',
      label: 'Alcance y seguridad',
      description:
        'Validación de que la app sigue siendo local, mock, read-only, demo-only y no productiva.',
      reviewMode: 'safety-boundary',
    },
    {
      id: 'domain-evidence-freeze',
      label: 'Evidence Freeze',
      description:
        'Revisión del bloque 1O-T como evidencia demo controlada sin datos reales ni artefactos productivos.',
      reviewMode: 'evidence-review',
    },
    {
      id: 'domain-delivery-readiness',
      label: 'Delivery Readiness',
      description:
        'Revisión del bloque 1O-U como readiness conceptual sin email, reunión, link ni invitación real.',
      reviewMode: 'delivery-review',
    },
    {
      id: 'domain-presentation-script',
      label: 'Presentation Script',
      description:
        'Revisión del bloque 1O-V como guion textual controlado sin video, audio, avatar, PowerPoint ni entrega externa.',
      reviewMode: 'script-review',
    },
    {
      id: 'domain-final-risk-posture',
      label: 'Postura final de riesgos',
      description:
        'Revisión de riesgos de sobrepromesa, filtración de datos, confusión operacional y claims regulatorios.',
      reviewMode: 'risk-review',
    },
  ],

  finalReviewGates: [
    {
      id: 'gate-build-clean',
      label: 'Build limpio',
      required: true,
      description:
        'Confirmar que la app compila correctamente antes de considerar cualquier revisión humana posterior.',
    },
    {
      id: 'gate-typescript-clean',
      label: 'TypeScript limpio',
      required: true,
      description:
        'Confirmar que TypeScript no presenta errores antes de cerrar la revisión conceptual.',
    },
    {
      id: 'gate-safety-boundaries-present',
      label: 'Boundaries presentes',
      required: true,
      description:
        'Confirmar que los límites de no producción, no datos reales y no acciones externas están presentes.',
    },
    {
      id: 'gate-no-real-artifacts',
      label: 'Sin artefactos reales',
      required: true,
      description:
        'Confirmar que no se crean PDF, ZIP, APK, PowerPoint, video, audio, avatar ni release productiva.',
    },
    {
      id: 'gate-no-real-operations',
      label: 'Sin operación real',
      required: true,
      description:
        'Confirmar ausencia de SCADA real, medidores reales, CEN real, APIs reales, telecontrol, setpoints y comandos.',
    },
  ],

  finalReviewApprovalRoles: [
    {
      id: 'approval-final-demo-owner',
      label: 'Final Demo Owner',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Revisa narrativa, alcance demo, guion, readiness y próximos pasos conceptuales.',
    },
    {
      id: 'approval-final-qa-owner',
      label: 'Final QA Owner',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Revisa build, TypeScript, checklist, módulos cerrados y consistencia documental.',
    },
    {
      id: 'approval-final-security-owner',
      label: 'Final Security Owner',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Revisa ausencia de datos reales, credenciales, conectores, endpoints, infraestructura y telecontrol.',
    },
    {
      id: 'approval-final-technical-owner',
      label: 'Final Technical Owner',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Revisa aislamiento local, arquitectura standalone, dependencias seguras y ausencia de APIs reales.',
    },
    {
      id: 'approval-final-business-owner',
      label: 'Final Business Owner',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Revisión comercial conceptual si se planea una presentación externa posterior.',
    },
  ],

  finalReviewRiskRegister: [
    {
      id: 'risk-review-perceived-as-approval',
      label: 'Revisión interpretada como aprobación real',
      severity: 'critical',
      mitigation:
        'Incluir disclaimer de que el board es conceptual, sin aprobación legal, productiva, operacional ni comercial real.',
    },
    {
      id: 'risk-overpromising-final-demo',
      label: 'Sobrepromesa de madurez',
      severity: 'high',
      mitigation:
        'Reforzar que la demo es local, mock, read-only, no productiva y aún requiere revisión humana para cualquier piloto.',
    },
    {
      id: 'risk-sensitive-traceability',
      label: 'Trazabilidad sensible accidental',
      severity: 'critical',
      mitigation:
        'Bloquear referencias a clientes reales, plantas reales, activos reales, infraestructura, endpoints, IPs o credenciales.',
    },
    {
      id: 'risk-operational-confusion',
      label: 'Confusión con operación real',
      severity: 'critical',
      mitigation:
        'Declarar ausencia de SCADA real, medidores reales, CEN, APIs reales, telecontrol, setpoints y comandos.',
    },
    {
      id: 'risk-artifact-misuse',
      label: 'Uso indebido de artefactos',
      severity: 'high',
      mitigation:
        'No crear PDF, ZIP, APK, PowerPoint, video, audio, avatar, ejecutables ni release productiva.',
    },
  ],

  finalReviewExitCriteria: [
    'Blueprint de Final Review Board creado.',
    'Final Review Board Purpose declarado.',
    'Allowed Final Review Board Items declarados.',
    'Blocked Final Review Board Items declarados.',
    'Final Review Board Principles declarados.',
    'Final Review Domains declarados.',
    'Final Review Gates declarados.',
    'Final Review Approval Roles declarados.',
    'Final Review Risk Register declarado.',
    'Final Review Exit Criteria declarado.',
    'Final Review Boundary declarado.',
    'No se aprueba release real.',
    'No se crea comité real.',
    'No se crean actas reales.',
    'No se crean reuniones reales.',
    'No se crean artefactos reales.',
    'No se ejecutan acciones externas reales.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  finalReviewBoundary:
    'Este blueprint solo define una mesa conceptual de revisión final. No aprueba release real, no crea comité real, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no crea actas legales reales, no crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no crea PowerPoint real, no incorpora datos reales, no crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',

  nextRoadmap: [
    '1O-W.1A — Client Demo Final Review Board Types',
    '1O-W.1B — Client Demo Final Review Board Mock Data',
    '1O-W.2A — Client Demo Final Review Board Visual Card',
    '1O-W.2B — Client Demo Final Review Board Export Text Box',
    '1O-W.3A — Client Demo Final Review Board Wizard Integration',
    '1O-W.4A — Client Demo Final Review Board Final QA & Closure',
  ],

  nextRecommendedModule:
    '1O-W.1A — Client Demo Final Review Board Types',
} as const;
