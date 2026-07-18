import {
  PVMetricsAllowedDemoCapability,
  PVMetricsBlockedProductionClaim,
  PVMetricsBuildRequirement,
  PVMetricsClientDemoReadinessItem,
  PVMetricsDemoPackageBoundary,
  PVMetricsHumanReviewGate,
  PVMetricsReleaseCandidateExitCriterion,
  PVMetricsReleaseCandidateRisk,
  PVMetricsReleaseCandidateScopeItem,
  PVMetricsSafetyReadinessItem,
  PVMetricsStandaloneClientDemoReleaseCandidatePack,
  PVMetricsTechnicalReadinessItem,
} from '../types/pvmetrics-release-candidate.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-L.1B-release-candidate-mock-data';

export const PV_METRICS_RELEASE_CANDIDATE_SCOPE_MOCK: PVMetricsReleaseCandidateScopeItem[] =
  [
    {
      scopeId: 'scope-standalone-local-demo',
      label: 'Demo independiente local',
      description:
        'ORBI PVMetrics IA puede revisarse como demo local independiente, sin sistemas reales conectados.',
      included: true,
    },
    {
      scopeId: 'scope-client-controlled-presentation',
      label: 'Presentación controlada a cliente',
      description:
        'La demo puede usarse para conversación cliente piloto con límites, claims bloqueados y revisión humana.',
      included: true,
    },
    {
      scopeId: 'scope-wizard-security-layers',
      label: 'Wizard con capas de seguridad',
      description:
        'El wizard muestra sandbox, evidencia piloto, demo flow, safety locks y handoff cliente.',
      included: true,
    },
    {
      scopeId: 'scope-release-artifact',
      label: 'Artefacto externo real',
      description:
        'No se genera ZIP, APK, PDF ni paquete distribuible real en este bloque.',
      included: false,
    },
  ];

export const PV_METRICS_DEMO_PACKAGE_BOUNDARIES_MOCK: PVMetricsDemoPackageBoundary[] =
  [
    {
      boundaryId: 'boundary-no-zip',
      label: 'No ZIP real',
      blocked: true,
      description: 'Este bloque no genera paquetes ZIP distribuibles.',
    },
    {
      boundaryId: 'boundary-no-apk',
      label: 'No APK real',
      blocked: true,
      description: 'Este bloque no genera APK Android.',
    },
    {
      boundaryId: 'boundary-no-pdf',
      label: 'No PDF real',
      blocked: true,
      description: 'Este bloque no genera documentos PDF reales.',
    },
    {
      boundaryId: 'boundary-no-backend',
      label: 'No backend',
      blocked: true,
      description: 'No se crea servidor, API, base de datos ni endpoint remoto.',
    },
    {
      boundaryId: 'boundary-no-real-connectors',
      label: 'No conectores reales',
      blocked: true,
      description:
        'No se conectan SCADA, medidores, weather APIs, CEN, ERP ni servicios externos.',
    },
    {
      boundaryId: 'boundary-no-operational-control',
      label: 'No control operacional',
      blocked: true,
      description:
        'No existe telecontrol, setpoints, comandos BESS, comandos inversores ni SCADA ACK.',
    },
  ];

export const PV_METRICS_CLIENT_DEMO_READINESS_CHECKLIST_MOCK: PVMetricsClientDemoReadinessItem[] =
  [
    {
      readinessId: 'client-narrative-ready',
      label: 'Narrativa cliente lista',
      status: 'ready',
      description:
        'La demo cuenta con narrativa cliente, handoff visual y próximos pasos seguros.',
    },
    {
      readinessId: 'client-boundaries-visible',
      label: 'Límites visibles',
      status: 'ready',
      description:
        'No Real Integration Statement, safety boundaries y claims bloqueados están visibles.',
    },
    {
      readinessId: 'client-copy-text-ready',
      label: 'Textos copiables listos',
      status: 'ready',
      description:
        'Resumen cliente y reporte interno existen como texto local copiable.',
    },
    {
      readinessId: 'client-human-review-required',
      label: 'Revisión humana requerida',
      status: 'requires-human-review',
      description:
        'Todo texto externo debe revisarse antes de compartirse con cliente.',
    },
  ];

export const PV_METRICS_TECHNICAL_READINESS_CHECKLIST_MOCK: PVMetricsTechnicalReadinessItem[] =
  [
    {
      readinessId: 'technical-build-clean',
      label: 'Build limpio',
      status: 'requires-run',
      command: 'npm run build',
      description:
        'Debe ejecutarse antes de declarar release candidate interno.',
    },
    {
      readinessId: 'technical-typescript-clean',
      label: 'TypeScript limpio',
      status: 'requires-run',
      command: 'tsc --noEmit',
      description:
        'Debe ejecutarse sin errores antes de cerrar el bloque release candidate.',
    },
    {
      readinessId: 'technical-registry-synced',
      label: 'Version Registry sincronizado',
      status: 'ready',
      description:
        'El registro de versión apunta al bloque 1O-L y al siguiente módulo recomendado.',
    },
    {
      readinessId: 'technical-manifest-synced',
      label: 'App Manifest sincronizado',
      status: 'ready',
      description:
        'El manifiesto independiente refleja versión, bloque y módulo activo.',
    },
  ];

export const PV_METRICS_SAFETY_READINESS_CHECKLIST_MOCK: PVMetricsSafetyReadinessItem[] =
  [
    {
      readinessId: 'safety-readonly-posture',
      label: 'Postura read-only',
      status: 'ready',
      description:
        'La demo opera con mock data local, sin escrituras reales ni efectos externos.',
    },
    {
      readinessId: 'safety-no-network-effects',
      label: 'Sin efectos de red',
      status: 'ready',
      description:
        'No existen llamadas API, backend, POST/PUT/PATCH/DELETE reales ni conectores activos.',
    },
    {
      readinessId: 'safety-no-operational-control',
      label: 'Sin control operacional',
      status: 'ready',
      description:
        'Telecontrol, setpoints, BESS commands e inverter commands quedan prohibidos.',
    },
    {
      readinessId: 'safety-no-secrets',
      label: 'Sin secretos',
      status: 'ready',
      description:
        'No se agregan credenciales, tokens, secrets ni variables productivas.',
    },
  ];

export const PV_METRICS_BUILD_AND_TYPESCRIPT_REQUIREMENTS_MOCK: PVMetricsBuildRequirement[] =
  [
    {
      requirementId: 'requirement-build',
      label: 'Build de producción',
      command: 'npm run build',
      required: true,
      description: 'Debe completar sin errores.',
    },
    {
      requirementId: 'requirement-typescript',
      label: 'Verificación TypeScript',
      command: 'tsc --noEmit',
      required: true,
      description: 'Debe completar sin errores.',
    },
    {
      requirementId: 'requirement-no-cross-imports',
      label: 'Sin imports cruzados ORBI',
      required: true,
      description:
        'No deben existir imports desde proyectos ORBI ajenos a PVMetrics.',
    },
    {
      requirementId: 'requirement-no-release-artifact',
      label: 'Sin artefacto externo real',
      required: true,
      description:
        'No se debe generar ZIP, APK, PDF, deploy, correo ni backend real.',
    },
  ];

export const PV_METRICS_ALLOWED_DEMO_CAPABILITIES_MOCK: PVMetricsAllowedDemoCapability[] =
  [
    {
      capabilityId: 'capability-local-wizard',
      label: 'Wizard local',
      description:
        'Configurador local con capas visuales de seguridad, evidencia y handoff.',
      clientVisible: true,
      safetyNote: 'No conecta sistemas reales.',
    },
    {
      capabilityId: 'capability-visual-cards',
      label: 'Visual cards mock',
      description:
        'Tarjetas visuales para sandbox, evidence pack, demo mode, handoff y readiness.',
      clientVisible: true,
      safetyNote: 'Representan estados mock y no producción.',
    },
    {
      capabilityId: 'capability-copy-textareas',
      label: 'Textareas copiables',
      description:
        'Textos locales copiables para revisión humana y conversación cliente.',
      clientVisible: true,
      safetyNote: 'No generan PDF ni correos automáticos.',
    },
    {
      capabilityId: 'capability-qa-artifacts',
      label: 'Artefactos QA',
      description:
        'Version Registry, App Manifest, QA Checklist, README y closure snapshots.',
      clientVisible: false,
      safetyNote: 'Material interno para control de release candidate.',
    },
  ];

export const PV_METRICS_BLOCKED_PRODUCTION_CLAIMS_MOCK: PVMetricsBlockedProductionClaim[] =
  [
    {
      claimId: 'claim-production-ready',
      forbiddenClaim: 'La app está lista para producción.',
      safeAlternative:
        'La app está lista como demo local candidata a release controlado.',
      severity: 'high',
    },
    {
      claimId: 'claim-real-scada',
      forbiddenClaim: 'La app está conectada a SCADA real.',
      safeAlternative:
        'La app no conecta SCADA; muestra cómo se prepararía un piloto read-only futuro.',
      severity: 'critical',
    },
    {
      claimId: 'claim-official-report',
      forbiddenClaim: 'La app genera reportes oficiales o regulatorios.',
      safeAlternative:
        'La app genera textos conceptuales copiables sujetos a revisión humana.',
      severity: 'high',
    },
    {
      claimId: 'claim-operational-control',
      forbiddenClaim: 'La app puede controlar BESS, inversores o setpoints.',
      safeAlternative:
        'La app excluye telecontrol, setpoints y comandos operacionales.',
      severity: 'critical',
    },
  ];

export const PV_METRICS_RELEASE_CANDIDATE_RISKS_MOCK: PVMetricsReleaseCandidateRisk[] =
  [
    {
      riskId: 'risk-demo-seen-as-production',
      label: 'Demo confundida con producción',
      severity: 'high',
      mitigation:
        'Usar etiquetas local, mock, read-only y no productivo durante la presentación.',
      ownerRole: 'release-owner',
    },
    {
      riskId: 'risk-client-overinterpretation',
      label: 'Cliente interpreta resultados como oficiales',
      severity: 'high',
      mitigation:
        'Reforzar No Real Integration Statement y evitar lenguaje regulatorio.',
      ownerRole: 'commercial-owner',
    },
    {
      riskId: 'risk-real-integration-pressure',
      label: 'Presión por integración real prematura',
      severity: 'critical',
      mitigation:
        'Bloquear integración real hasta roadmap separado, contrato read-only y QA dedicado.',
      ownerRole: 'technical-owner',
    },
    {
      riskId: 'risk-unvalidated-artifact',
      label: 'Entrega de artefacto no validado',
      severity: 'medium',
      mitigation:
        'No generar ZIP/APK/PDF real en este bloque; mantener solo mock data y readiness.',
      ownerRole: 'qa-owner',
    },
  ];

export const PV_METRICS_HUMAN_REVIEW_GATES_MOCK: PVMetricsHumanReviewGate[] = [
  {
    gateId: 'gate-before-client-demo',
    label: 'Antes de demo cliente',
    required: true,
    reviewerRole: 'technical-owner',
    description:
      'Validar build, TypeScript, safety boundaries y claims bloqueados.',
  },
  {
    gateId: 'gate-before-sharing-text',
    label: 'Antes de compartir textos externos',
    required: true,
    reviewerRole: 'qa-owner',
    description:
      'Revisar cualquier resumen cliente o reporte interno antes de enviarlo.',
  },
  {
    gateId: 'gate-before-real-integration',
    label: 'Antes de cualquier integración real',
    required: true,
    reviewerRole: 'operations-owner',
    description:
      'Toda integración real queda bloqueada hasta roadmap separado y contrato read-only.',
  },
];

export const PV_METRICS_RELEASE_CANDIDATE_EXIT_CRITERIA_MOCK: PVMetricsReleaseCandidateExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      required: true,
      passed: true,
      description:
        'El contrato TypeScript del Release Candidate está implementado.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      required: true,
      passed: true,
      description:
        'El pack local de Release Candidate queda poblado con mock data seguro.',
    },
    {
      criterionId: 'exit-no-real-artifacts',
      label: 'Sin artefactos reales',
      required: true,
      passed: true,
      description:
        'Este módulo no genera ZIP, APK, PDF, correo, backend, API ni conector real.',
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

export const PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK: PVMetricsStandaloneClientDemoReleaseCandidatePack =
  {
    packId: 'pvmetrics-standalone-client-demo-release-candidate-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-L — Standalone Client Demo Release Candidate',
    module: '1O-L.1B — Release Candidate Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    releaseCandidateScope: PV_METRICS_RELEASE_CANDIDATE_SCOPE_MOCK,
    demoPackageBoundaries: PV_METRICS_DEMO_PACKAGE_BOUNDARIES_MOCK,
    clientDemoReadinessChecklist:
      PV_METRICS_CLIENT_DEMO_READINESS_CHECKLIST_MOCK,
    technicalReadinessChecklist:
      PV_METRICS_TECHNICAL_READINESS_CHECKLIST_MOCK,
    safetyReadinessChecklist: PV_METRICS_SAFETY_READINESS_CHECKLIST_MOCK,
    buildAndTypescriptRequirements:
      PV_METRICS_BUILD_AND_TYPESCRIPT_REQUIREMENTS_MOCK,
    allowedDemoCapabilities: PV_METRICS_ALLOWED_DEMO_CAPABILITIES_MOCK,
    blockedProductionClaims: PV_METRICS_BLOCKED_PRODUCTION_CLAIMS_MOCK,
    releaseCandidateRisks: PV_METRICS_RELEASE_CANDIDATE_RISKS_MOCK,
    humanReviewGates: PV_METRICS_HUMAN_REVIEW_GATES_MOCK,
    exitCriteria: PV_METRICS_RELEASE_CANDIDATE_EXIT_CRITERIA_MOCK,
    safetyBoundary:
      'Release Candidate mock data local. No ZIP/APK/PDF real, no correos reales, no backend, no APIs, no localStorage, no conectores reales, no SCADA, no medidores, no CEN, no credenciales, no tokens, no secrets, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS y no comandos inversores.',
    nextRecommendedModule:
      '1O-L.2A — Release Candidate Readiness Visual Card',
  };
