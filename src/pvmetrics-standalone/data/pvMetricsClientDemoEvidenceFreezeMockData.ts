import {
  PVMetricsAllowedDemoEvidenceItem,
  PVMetricsBlockedDemoEvidenceItem,
  PVMetricsDemoEvidenceCategory,
  PVMetricsDemoEvidenceFreezePrinciple,
  PVMetricsDemoEvidenceReviewGate,
  PVMetricsDemoEvidenceSafetyGate,
  PVMetricsDemoEvidenceApprovalRole,
  PVMetricsDemoEvidenceRiskRegisterItem,
  PVMetricsDemoEvidenceExitCriterion,
  PVMetricsControlledClientDemoEvidenceFreezePack,
} from '../types/pvmetrics-client-demo-evidence-freeze.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-T.1B-client-demo-evidence-freeze-mock-data';

export const PV_METRICS_CLIENT_DEMO_EVIDENCE_PURPOSE_MOCK: string[] = [
  'Congelar evidencia demo segura para explicar ORBI PVMetrics IA a cliente o stakeholders.',
  'Consolidar estado visual de readiness sin convertir la demo en release productiva.',
  'Documentar bloques cerrados, QA superado, límites de seguridad y exclusiones técnicas.',
  'Evitar datos reales, trazabilidad a cliente/planta/activo/infraestructura y promesas de forecast oficial.',
  'Preparar una base local para una futura tarjeta visual y export text box de evidencia demo.',
];

export const PV_METRICS_ALLOWED_DEMO_EVIDENCE_ITEMS_MOCK: PVMetricsAllowedDemoEvidenceItem[] =
  [
    {
      itemId: 'allowed-demo-readiness-summary',
      label: 'Resumen de readiness demo',
      itemType: 'allowed-demo-evidence-item',
      description:
        'Resumen textual de bloques cerrados, build correcto, TypeScript limpio y wizard integrado.',
      evidenceMode: 'demo-readiness',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-safety-boundary-statement',
      label: 'Declaración de Safety Boundary',
      itemType: 'allowed-demo-evidence-item',
      description:
        'Declaración explícita de no datos reales, no conectores, no telecontrol y no forecast oficial.',
      evidenceMode: 'safety-boundary',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-qa-traceability',
      label: 'Trazabilidad QA conceptual',
      itemType: 'allowed-demo-evidence-item',
      description:
        'Listado conceptual de módulos completados, criterios de QA y exclusiones técnicas.',
      evidenceMode: 'qa-trace',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-client-narrative',
      label: 'Narrativa cliente segura',
      itemType: 'allowed-demo-evidence-item',
      description:
        'Texto ejecutivo para explicar valor, alcance y límites de la demo sin prometer producción.',
      evidenceMode: 'text-only',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-local-build-status',
      label: 'Estado de build local',
      itemType: 'allowed-demo-evidence-item',
      description:
        'Registro textual de build correcto y TypeScript limpio sin distribuir artefactos productivos.',
      evidenceMode: 'text-only',
      requiresApproval: false,
    },
  ];

export const PV_METRICS_BLOCKED_DEMO_EVIDENCE_ITEMS_MOCK: PVMetricsBlockedDemoEvidenceItem[] =
  [
    {
      itemId: 'blocked-real-client-data',
      label: 'Datos reales de cliente',
      itemType: 'blocked-demo-evidence-item',
      severity: 'critical',
      reason:
        'La evidencia demo no debe incluir mediciones, históricos, clientes, plantas, activos ni eventos reales.',
      safeAlternative:
        'Usar texto demo-only, synthetic-first y referencias genéricas sin trazabilidad.',
    },
    {
      itemId: 'blocked-production-artifacts',
      label: 'Artefactos productivos',
      itemType: 'blocked-demo-evidence-item',
      severity: 'critical',
      reason:
        'PDF, ZIP, APK, ejecutables, instaladores o paquetes productivos reales quedan fuera de esta fase.',
      safeAlternative:
        'Usar mock data local y export text en fases posteriores, sin archivo real productivo.',
    },
    {
      itemId: 'blocked-credentials-or-endpoints',
      label: 'Credenciales, endpoints o infraestructura',
      itemType: 'blocked-demo-evidence-item',
      severity: 'critical',
      reason:
        'No se debe exponer tokens, API keys, passwords, URLs, IPs, rutas internas ni servidores.',
      safeAlternative:
        'Mantener placeholders genéricos y declarar estos campos como prohibidos.',
    },
    {
      itemId: 'blocked-official-forecast-claim',
      label: 'Afirmación de forecast oficial',
      itemType: 'blocked-demo-evidence-item',
      severity: 'high',
      reason:
        'La evidencia demo no puede prometer forecast oficial, envío CEN, reporte regulatorio ni operación productiva.',
      safeAlternative:
        'Declarar la demo como conceptual, local, no regulatoria y no operacional.',
    },
    {
      itemId: 'blocked-operational-control-proof',
      label: 'Prueba de control operacional',
      itemType: 'blocked-demo-evidence-item',
      severity: 'critical',
      reason:
        'No debe existir evidencia de telecontrol, setpoints, comandos BESS, comandos de inversores o SCADA ACK.',
      safeAlternative:
        'Mostrar únicamente límites read-only y disclaimers de no operación.',
    },
  ];

export const PV_METRICS_DEMO_EVIDENCE_FREEZE_PRINCIPLES_MOCK: PVMetricsDemoEvidenceFreezePrinciple[] =
  [
    {
      principleId: 'principle-demo-only',
      label: 'Demo-only',
      itemType: 'demo-evidence-freeze-principle',
      description:
        'Toda evidencia debe describirse como demo local, conceptual, no productiva y sin validez operacional.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-real-data',
      label: 'Sin datos reales',
      itemType: 'demo-evidence-freeze-principle',
      description:
        'La evidencia no debe incorporar datos reales, trazabilidad a cliente/planta/activo ni eventos reales.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-release-artifact',
      label: 'Sin artefacto release',
      itemType: 'demo-evidence-freeze-principle',
      description:
        'Este bloque no produce PDF, ZIP, APK, ejecutable, instalador ni release productivo.',
      mandatory: true,
    },
    {
      principleId: 'principle-read-only-proof',
      label: 'Prueba read-only',
      itemType: 'demo-evidence-freeze-principle',
      description:
        'La evidencia debe reforzar que PVMetrics es local, mock, read-only y sin acciones externas.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-approval',
      label: 'Aprobación humana',
      itemType: 'demo-evidence-freeze-principle',
      description:
        'Toda evidencia para cliente debe pasar por revisión técnica, QA, seguridad y responsable de demo.',
      mandatory: true,
    },
  ];

export const PV_METRICS_DEMO_EVIDENCE_CATEGORIES_MOCK: PVMetricsDemoEvidenceCategory[] =
  [
    {
      categoryId: 'category-demo-readiness',
      label: 'Demo Readiness',
      itemType: 'demo-evidence-category',
      description:
        'Estado de módulos cerrados, build correcto, TypeScript limpio y wizard integrado.',
      evidenceMode: 'demo-readiness',
    },
    {
      categoryId: 'category-safety-boundaries',
      label: 'Safety Boundaries',
      itemType: 'demo-evidence-category',
      description:
        'Declaraciones explícitas de no datos reales, no conectores, no telecontrol y no forecast oficial.',
      evidenceMode: 'safety-boundary',
    },
    {
      categoryId: 'category-client-narrative',
      label: 'Narrativa cliente',
      itemType: 'demo-evidence-category',
      description:
        'Resumen ejecutivo para explicar alcance, valor conceptual y límites de la demo.',
      evidenceMode: 'text-only',
    },
    {
      categoryId: 'category-qa-traceability',
      label: 'Trazabilidad QA',
      itemType: 'demo-evidence-category',
      description:
        'Lista conceptual de bloques cerrados, criterios validados y exclusiones técnicas.',
      evidenceMode: 'qa-trace',
    },
    {
      categoryId: 'category-no-release-artifact',
      label: 'No Release Artifact',
      itemType: 'demo-evidence-category',
      description:
        'Evidencia textual de que no se generó PDF, ZIP, APK, instalador ni release productiva.',
      evidenceMode: 'placeholder-only',
    },
  ];

export const PV_METRICS_DEMO_EVIDENCE_REVIEW_GATES_MOCK: PVMetricsDemoEvidenceReviewGate[] = [
  {
    gateId: 'gate-technical-readiness',
    label: 'Technical Readiness Review',
    itemType: 'demo-evidence-review-gate',
    required: true,
    description: 'Verificar que la demo compila correctamente y no posee errores de sintaxis o de TypeScript.',
  },
  {
    gateId: 'gate-qa-verification',
    label: 'QA Verification Gate',
    itemType: 'demo-evidence-review-gate',
    required: true,
    description: 'Confirmar cumplimiento del checklist independiente de QA y ausencia de componentes externos mezclados.',
  },
  {
    gateId: 'gate-security-compliance',
    label: 'Security & Safety Gate',
    itemType: 'demo-evidence-review-gate',
    required: true,
    description: 'Garantizar el aislamiento absoluto de datos reales, credenciales, tokens y llaves de API.',
  },
];

export const PV_METRICS_DEMO_EVIDENCE_SAFETY_GATES_MOCK: PVMetricsDemoEvidenceSafetyGate[] = [
  {
    gateId: 'safety-no-scada-telecontrol',
    label: 'No SCADA Telecontrol Barrier',
    itemType: 'demo-evidence-safety-gate',
    required: true,
    description: 'Bloqueo explícito de todo intento de envío de setpoints o comandos operacionales a inversores o BESS.',
  },
  {
    gateId: 'safety-no-real-data-leak',
    label: 'No Real Data Leak Prevention',
    itemType: 'demo-evidence-safety-gate',
    required: true,
    description: 'Inspección de código para evitar imports de credenciales de entornos productivos o del CEN.',
  },
];

export const PV_METRICS_DEMO_EVIDENCE_APPROVAL_ROLES_MOCK: PVMetricsDemoEvidenceApprovalRole[] = [
  {
    approvalId: 'approval-demo-owner',
    label: 'Aprobación Demo Owner',
    itemType: 'demo-evidence-approval-role',
    reviewerRole: 'demo-owner',
    required: true,
    description: 'Valida la narrativa comercial y que el contenido cumple con la propuesta para stakeholders.',
  },
  {
    approvalId: 'approval-qa-owner',
    label: 'Aprobación QA Owner',
    itemType: 'demo-evidence-approval-role',
    reviewerRole: 'qa-owner',
    required: true,
    description: 'Certifica el cumplimiento de todas las exigencias del checklist de QA independiente.',
  },
  {
    approvalId: 'approval-security-owner',
    label: 'Aprobación Security Owner',
    itemType: 'demo-evidence-approval-role',
    reviewerRole: 'security-owner',
    required: true,
    description: 'Asegura que no se expone información sensible ni accesos a la red SCADA real.',
  },
];

export const PV_METRICS_DEMO_EVIDENCE_RISK_REGISTER_MOCK: PVMetricsDemoEvidenceRiskRegisterItem[] = [
  {
    riskId: 'risk-accidental-scada-link',
    label: 'Intento accidental de conexión SCADA real',
    itemType: 'demo-evidence-risk-register-item',
    severity: 'critical',
    mitigation: 'Mantener código puramente local con disclaimers forzados en compilación y sin paquetes de red SCADA.',
  },
  {
    riskId: 'risk-leaking-mock-as-real',
    label: 'Confusión de datos mock con reales en la presentación',
    itemType: 'demo-evidence-risk-register-item',
    severity: 'medium',
    mitigation: 'Mostrar marcas de agua estáticas claras e indicadores persistentes de "Local Demo Only" en cabeceras.',
  },
];

export const PV_METRICS_DEMO_EVIDENCE_EXIT_CRITERIA_MOCK: PVMetricsDemoEvidenceExitCriterion[] = [
  {
    criterionId: 'exit-types-verified',
    label: 'Definición de tipos base completada',
    itemType: 'demo-evidence-exit-criterion',
    required: true,
    passed: true,
    description: 'Todos los tipos base para el empaque y control de evidencia de demo han sido declarados.',
  },
  {
    criterionId: 'exit-mock-data-populated',
    label: 'Población de mock data local finalizada',
    itemType: 'demo-evidence-exit-criterion',
    required: true,
    passed: true,
    description: 'Los diccionarios locales de riesgo, gates de seguridad y principios están declarados y accesibles.',
  },
  {
    criterionId: 'exit-no-external-contaminants',
    label: 'Ausencia de componentes externos',
    itemType: 'demo-evidence-exit-criterion',
    required: true,
    passed: true,
    description: 'No se importaron componentes de otros proyectos ORBI ni WebRTC/Socket.IO.',
  },
];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK: PVMetricsControlledClientDemoEvidenceFreezePack = {
  packId: 'pack-demo-evidence-freeze-types',
  generatedAtLabel: getGeneratedAtLabel(),
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-T — Controlled Client Demo Evidence Freeze',
  module: '1O-T.1B — Client Demo Evidence Freeze Mock Data',
  internalVersion: '0.1O-T.1B-client-demo-evidence-freeze-mock-data',
  status: 'mock-data-ready',
  clientDemoEvidencePurpose: PV_METRICS_CLIENT_DEMO_EVIDENCE_PURPOSE_MOCK,
  allowedDemoEvidenceItems: PV_METRICS_ALLOWED_DEMO_EVIDENCE_ITEMS_MOCK,
  blockedDemoEvidenceItems: PV_METRICS_BLOCKED_DEMO_EVIDENCE_ITEMS_MOCK,
  demoEvidenceFreezePrinciples: PV_METRICS_DEMO_EVIDENCE_FREEZE_PRINCIPLES_MOCK,
  demoEvidenceCategories: PV_METRICS_DEMO_EVIDENCE_CATEGORIES_MOCK,
  demoEvidenceReviewGates: PV_METRICS_DEMO_EVIDENCE_REVIEW_GATES_MOCK,
  demoEvidenceSafetyGates: PV_METRICS_DEMO_EVIDENCE_SAFETY_GATES_MOCK,
  demoEvidenceApprovalRoles: PV_METRICS_DEMO_EVIDENCE_APPROVAL_ROLES_MOCK,
  demoEvidenceRiskRegister: PV_METRICS_DEMO_EVIDENCE_RISK_REGISTER_MOCK,
  demoEvidenceExitCriteria: PV_METRICS_DEMO_EVIDENCE_EXIT_CRITERIA_MOCK,
  evidenceFreezeBoundary: 'Límite local estricto sin PDFs, ZIPs, APKs reales, base de datos ni telecontrol activo.',
  nextRecommendedModule: '1O-T.1C — Client Demo Evidence Freeze Visual State',
};
