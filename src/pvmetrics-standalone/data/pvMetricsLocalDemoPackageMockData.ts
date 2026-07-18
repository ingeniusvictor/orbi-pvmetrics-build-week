import {
  PVMetricsAssemblyExitCriterion,
  PVMetricsAssemblyRisk,
  PVMetricsBlockedRealReleaseArtifact,
  PVMetricsDemoEnvironmentAssumption,
  PVMetricsHumanApprovalGate,
  PVMetricsLocalDemoPackageAssemblyPack,
  PVMetricsLocalDemoPackageContentItem,
  PVMetricsOperatorPreflightChecklistItem,
  PVMetricsOperatorSignOffScopeItem,
  PVMetricsReviewerSignOffChecklistItem,
} from '../types/pvmetrics-local-demo-package.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-M.1B-local-demo-package-mock-data';

export const PV_METRICS_LOCAL_DEMO_PACKAGE_CONTENTS_MOCK: PVMetricsLocalDemoPackageContentItem[] =
  [
    {
      contentId: 'content-local-app-view',
      label: 'Vista local de la app',
      description:
        'Ejecución local o entorno controlado para revisar wizard, tarjetas visuales, reportes copiables y límites de seguridad.',
      clientVisible: true,
      allowed: true,
      safetyNote: 'No debe presentarse como deploy productivo.',
    },
    {
      contentId: 'content-readme',
      label: 'README documentado',
      description:
        'Documento local con roadmap, módulos completados, límites, QA y versión interna.',
      clientVisible: false,
      allowed: true,
      safetyNote: 'Material interno salvo revisión humana previa.',
    },
    {
      contentId: 'content-version-registry',
      label: 'Version Registry',
      description:
        'Registro local de versión, bloque activo, módulo estable y siguiente módulo recomendado.',
      clientVisible: false,
      allowed: true,
      safetyNote: 'No reemplaza un sistema formal de release productivo.',
    },
    {
      contentId: 'content-qa-checklist',
      label: 'QA Checklist',
      description:
        'Checklist independiente para verificar build, TypeScript y límites de seguridad.',
      clientVisible: false,
      allowed: true,
      safetyNote: 'Debe revisarse antes de cualquier presentación externa.',
    },
    {
      contentId: 'content-copyable-texts',
      label: 'Textos copiables locales',
      description:
        'Resúmenes cliente y reportes internos generados en textareas locales.',
      clientVisible: true,
      allowed: true,
      safetyNote: 'Requieren revisión humana antes de compartirse.',
    },
    {
      contentId: 'content-real-artifact',
      label: 'Artefacto release real',
      description:
        'ZIP, APK, PDF, firma digital, deploy o paquete distribuible real.',
      clientVisible: false,
      allowed: false,
      safetyNote: 'Bloqueado en 1O-M; requiere roadmap separado.',
    },
  ];

export const PV_METRICS_BLOCKED_REAL_RELEASE_ARTIFACTS_MOCK: PVMetricsBlockedRealReleaseArtifact[] =
  [
    {
      artifactId: 'artifact-zip',
      label: 'ZIP real distribuible',
      blocked: true,
      reason: 'No existe proceso de empaquetado real aprobado en este bloque.',
      safeAlternative: 'Usar inventario conceptual de contenidos permitidos.',
    },
    {
      artifactId: 'artifact-apk',
      label: 'APK Android real',
      blocked: true,
      reason: 'No existe pipeline Android ni QA móvil productivo en este bloque.',
      safeAlternative: 'Mantener demo local web/controlada.',
    },
    {
      artifactId: 'artifact-pdf',
      label: 'PDF oficial',
      blocked: true,
      reason: 'No existe motor PDF oficial ni firma documental real.',
      safeAlternative: 'Usar texto local copiable sujeto a revisión humana.',
    },
    {
      artifactId: 'artifact-digital-signature',
      label: 'Firma digital real',
      blocked: true,
      reason:
        'No se implementa firma criptográfica ni certificado legal/productivo.',
      safeAlternative: 'Usar sign-off humano administrativo y conceptual.',
    },
    {
      artifactId: 'artifact-production-deploy',
      label: 'Deploy productivo',
      blocked: true,
      reason: 'No existe backend, hosting productivo, dominios ni hardening real.',
      safeAlternative: 'Mantener entorno local o desarrollo controlado.',
    },
  ];

export const PV_METRICS_OPERATOR_SIGN_OFF_SCOPE_MOCK: PVMetricsOperatorSignOffScopeItem[] =
  [
    {
      scopeId: 'scope-local-mock-readonly',
      label: 'Confirmar demo local/mock/read-only',
      description:
        'El operador confirma que la presentación no corresponde a producción ni integración real.',
      required: true,
    },
    {
      scopeId: 'scope-no-real-artifacts',
      label: 'Confirmar ausencia de artefactos reales',
      description:
        'El operador confirma que no se generó ZIP, APK, PDF, deploy ni firma digital real.',
      required: true,
    },
    {
      scopeId: 'scope-no-secrets',
      label: 'Confirmar ausencia de secretos',
      description:
        'El operador confirma que no existen credenciales, tokens, secrets ni variables productivas.',
      required: true,
    },
    {
      scopeId: 'scope-no-operational-control',
      label: 'Confirmar ausencia de control operacional',
      description:
        'El operador confirma que no existe SCADA real, telecontrol, setpoints ni comandos BESS/inversores.',
      required: true,
    },
  ];

export const PV_METRICS_OPERATOR_PREFLIGHT_CHECKLIST_MOCK: PVMetricsOperatorPreflightChecklistItem[] =
  [
    {
      checklistId: 'operator-build-run',
      label: 'Build ejecutado',
      status: 'requires-run',
      command: 'npm run build',
      description:
        'Debe ejecutarse antes de considerar la demo lista para revisión.',
      required: true,
    },
    {
      checklistId: 'operator-typescript-run',
      label: 'TypeScript ejecutado',
      status: 'requires-run',
      command: 'tsc --noEmit',
      description:
        'Debe ejecutarse para confirmar que no existan errores de tipos.',
      required: true,
    },
    {
      checklistId: 'operator-demo-labels-visible',
      label: 'Etiquetas demo visibles',
      status: 'requires-human-review',
      description:
        'Verificar que la app declara mock, read-only, no real integration y no producción.',
      required: true,
    },
    {
      checklistId: 'operator-copy-text-reviewed',
      label: 'Textos copiables revisados',
      status: 'requires-human-review',
      description:
        'Todo resumen cliente debe revisarse antes de compartirse externamente.',
      required: true,
    },
  ];

export const PV_METRICS_REVIEWER_SIGN_OFF_CHECKLIST_MOCK: PVMetricsReviewerSignOffChecklistItem[] =
  [
    {
      checklistId: 'reviewer-anti-mix',
      label: 'Anti-mezcla validada',
      status: 'requires-human-review',
      reviewerRole: 'qa-owner',
      description:
        'Confirmar que no existen imports, rutas ni componentes de otros proyectos ORBI.',
      required: true,
    },
    {
      checklistId: 'reviewer-safety-boundaries',
      label: 'Safety Boundaries validadas',
      status: 'requires-human-review',
      reviewerRole: 'technical-owner',
      description:
        'Confirmar exclusiones de ZIP/APK/PDF, backend, APIs, SCADA, medidores, CEN y telecontrol.',
      required: true,
    },
    {
      checklistId: 'reviewer-commercial-claims',
      label: 'Claims comerciales revisados',
      status: 'requires-human-review',
      reviewerRole: 'commercial-owner',
      description:
        'Evitar afirmar producción, forecast oficial, reporte regulatorio o integración real.',
      required: true,
    },
    {
      checklistId: 'reviewer-client-demo-approval',
      label: 'Aprobación demo cliente',
      status: 'pending',
      reviewerRole: 'release-owner',
      description:
        'Debe existir aprobación humana antes de presentación externa.',
      required: true,
    },
  ];

export const PV_METRICS_DEMO_ENVIRONMENT_ASSUMPTIONS_MOCK: PVMetricsDemoEnvironmentAssumption[] =
  [
    {
      assumptionId: 'assumption-local-controlled',
      label: 'Entorno local/controlado',
      description:
        'La demo se ejecuta localmente o en un entorno de desarrollo controlado.',
      mustBeTrue: true,
    },
    {
      assumptionId: 'assumption-no-prod-credentials',
      label: 'Sin credenciales productivas',
      description:
        'La demo no usa credenciales, tokens, secrets ni variables de producción.',
      mustBeTrue: true,
    },
    {
      assumptionId: 'assumption-no-external-services',
      label: 'Sin servicios externos',
      description:
        'La demo no llama APIs, backend, weather services, CEN, SCADA ni medidores reales.',
      mustBeTrue: true,
    },
    {
      assumptionId: 'assumption-no-physical-effects',
      label: 'Sin efectos físicos',
      description:
        'La demo no modifica sistemas físicos ni opera telecontrol o setpoints.',
      mustBeTrue: true,
    },
  ];

export const PV_METRICS_HUMAN_APPROVAL_GATES_MOCK: PVMetricsHumanApprovalGate[] =
  [
    {
      gateId: 'gate-before-local-package-label',
      label: 'Antes de declarar paquete demo local',
      required: true,
      reviewerRole: 'release-owner',
      description:
        'Validar que el paquete es conceptual/local y no un artefacto distribuible real.',
    },
    {
      gateId: 'gate-before-client-presentation',
      label: 'Antes de presentación cliente',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Revisar textos, boundaries, claims bloqueados y riesgos antes de mostrar a cliente.',
    },
    {
      gateId: 'gate-before-real-artifact',
      label: 'Antes de cualquier artefacto real',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Todo ZIP/APK/PDF/deploy real queda bloqueado hasta roadmap separado.',
    },
  ];

export const PV_METRICS_ASSEMBLY_RISKS_MOCK: PVMetricsAssemblyRisk[] = [
  {
    riskId: 'risk-package-seen-as-release',
    label: 'Paquete demo confundido con release real',
    severity: 'high',
    mitigation:
      'Usar etiquetas visibles de demo local, mock, read-only y no productivo.',
    ownerRole: 'release-owner',
  },
  {
    riskId: 'risk-unreviewed-client-text',
    label: 'Texto cliente no revisado',
    severity: 'high',
    mitigation:
      'Exigir revisión humana antes de compartir cualquier resumen externo.',
    ownerRole: 'qa-owner',
  },
  {
    riskId: 'risk-artifact-generated-too-early',
    label: 'Artefacto real generado antes de QA',
    severity: 'critical',
    mitigation:
      'Bloquear ZIP/APK/PDF real en este bloque y moverlo a roadmap separado.',
    ownerRole: 'technical-owner',
  },
  {
    riskId: 'risk-operational-misuse',
    label: 'Uso operacional indebido',
    severity: 'critical',
    mitigation:
      'Mantener prohibidos SCADA real, telecontrol, setpoints, BESS commands e inverter commands.',
    ownerRole: 'operations-owner',
  },
];

export const PV_METRICS_ASSEMBLY_EXIT_CRITERIA_MOCK: PVMetricsAssemblyExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript del paquete demo local está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      required: true,
      passed: true,
      description:
        'El pack local de ensamblaje queda poblado con datos mock seguros.',
    },
    {
      criterionId: 'exit-no-real-artifacts',
      label: 'Sin artefactos reales',
      required: true,
      passed: true,
      description:
        'Este módulo no genera ZIP, APK, PDF, firma digital, correo, backend, API ni conector real.',
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

export const PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK: PVMetricsLocalDemoPackageAssemblyPack =
  {
    packId: 'pvmetrics-local-demo-package-assembly-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-M — Local Demo Package Assembly & Operator Sign-Off',
    module: '1O-M.1B — Local Demo Package Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    packageContents: PV_METRICS_LOCAL_DEMO_PACKAGE_CONTENTS_MOCK,
    blockedRealReleaseArtifacts: PV_METRICS_BLOCKED_REAL_RELEASE_ARTIFACTS_MOCK,
    operatorSignOffScope: PV_METRICS_OPERATOR_SIGN_OFF_SCOPE_MOCK,
    operatorPreflightChecklist: PV_METRICS_OPERATOR_PREFLIGHT_CHECKLIST_MOCK,
    reviewerSignOffChecklist: PV_METRICS_REVIEWER_SIGN_OFF_CHECKLIST_MOCK,
    demoEnvironmentAssumptions: PV_METRICS_DEMO_ENVIRONMENT_ASSUMPTIONS_MOCK,
    humanApprovalGates: PV_METRICS_HUMAN_APPROVAL_GATES_MOCK,
    assemblyRisks: PV_METRICS_ASSEMBLY_RISKS_MOCK,
    assemblyExitCriteria: PV_METRICS_ASSEMBLY_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Local Demo Package mock data. No ZIP/APK/PDF real, no firma digital real, no correos reales, no backend, no APIs, no localStorage, no conectores reales, no SCADA, no medidores, no CEN, no credenciales, no tokens, no secrets, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule: '1O-M.2A — Operator Sign-Off Visual Card',
  };
