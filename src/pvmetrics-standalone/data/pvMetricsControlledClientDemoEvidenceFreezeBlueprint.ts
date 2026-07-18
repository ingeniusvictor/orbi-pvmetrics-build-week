const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_BLUEPRINT = {
  id: 'pvmetrics-controlled-client-demo-evidence-freeze-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-T — Controlled Client Demo Evidence Freeze',
  module: '1O-T.0 — Controlled Client Demo Evidence Freeze Blueprint',
  internalVersion:
    '0.1O-T.0-controlled-client-demo-evidence-freeze-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_ARTIFACT',
  blueprintStatusLabel:
    'CLIENT DEMO EVIDENCE FREEZE — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir una capa conceptual para congelar evidencia demo segura de ORBI PVMetrics IA antes de una presentación a cliente o stakeholders, sin crear PDF real, ZIP real, APK real, artefacto productivo, datos reales, conectores reales ni acciones externas.',

  clientDemoEvidencePurpose: [
    'Definir qué evidencia demo puede mostrarse de forma segura a cliente.',
    'Separar evidencia permitida, evidencia bloqueada y evidencia que requiere aprobación humana.',
    'Consolidar el estado de readiness visual sin convertirlo en release productiva.',
    'Reforzar que PVMetrics sigue siendo local, mock, demo-only, read-only y no operacional.',
    'Preparar una base conceptual para futura tarjeta visual y export text box de evidencia demo.',
  ],

  allowedDemoEvidenceItems: [
    {
      id: 'allowed-ui-screenshot-description',
      label: 'Descripción de pantallas demo',
      description:
        'Descripción textual de pantallas locales ya integradas al wizard, sin capturas reales obligatorias.',
      requiresApproval: true,
    },
    {
      id: 'allowed-readiness-summary',
      label: 'Resumen de readiness demo',
      description:
        'Resumen conceptual de bloques cerrados, QA superado y límites de seguridad.',
      requiresApproval: true,
    },
    {
      id: 'allowed-safety-boundary-statement',
      label: 'Declaración de Safety Boundary',
      description:
        'Texto explícito que indica que la demo no usa datos reales ni acciones externas.',
      requiresApproval: true,
    },
    {
      id: 'allowed-local-build-status',
      label: 'Estado de build local',
      description:
        'Registro textual de build correcto y TypeScript limpio, sin distribuir artefactos productivos.',
      requiresApproval: false,
    },
  ],

  blockedDemoEvidenceItems: [
    {
      id: 'blocked-real-client-data',
      label: 'Datos reales de cliente',
      severity: 'critical',
      reason:
        'La evidencia demo no debe incluir mediciones, clientes, plantas, activos ni eventos reales.',
      safeAlternative:
        'Usar texto demo-only y referencias sintéticas sin trazabilidad.',
    },
    {
      id: 'blocked-production-artifacts',
      label: 'Artefactos productivos',
      severity: 'critical',
      reason:
        'PDF, ZIP, APK, ejecutables o paquetes productivos reales quedan fuera de esta fase.',
      safeAlternative:
        'Usar blueprint conceptual y export text local en fases posteriores.',
    },
    {
      id: 'blocked-credentials-or-endpoints',
      label: 'Credenciales, endpoints o infraestructura',
      severity: 'critical',
      reason:
        'No se debe exponer tokens, API keys, passwords, URLs, IPs, rutas internas o servidores.',
      safeAlternative:
        'Mantener placeholders y declarar campos como prohibidos.',
    },
    {
      id: 'blocked-official-forecast-claim',
      label: 'Afirmación de forecast oficial',
      severity: 'high',
      reason:
        'La evidencia demo no puede prometer forecast oficial, reporte regulatorio ni operación productiva.',
      safeAlternative:
        'Declarar la demo como conceptual, no regulatoria y no operacional.',
    },
  ],

  demoEvidenceFreezePrinciples: [
    {
      id: 'principle-demo-only',
      label: 'Demo-only',
      description:
        'Toda evidencia debe describirse como demo local, conceptual, no productiva y sin validez operacional.',
      mandatory: true,
    },
    {
      id: 'principle-no-real-data',
      label: 'Sin datos reales',
      description:
        'La evidencia no debe incorporar datos reales, trazabilidad a cliente/planta/activo ni eventos reales.',
      mandatory: true,
    },
    {
      id: 'principle-no-release-artifact',
      label: 'Sin artefacto release',
      description:
        'Este bloque no produce PDF, ZIP, APK, ejecutable, instalador ni release productivo.',
      mandatory: true,
    },
    {
      id: 'principle-human-approval',
      label: 'Aprobación humana',
      description:
        'Toda evidencia para cliente debe pasar por revisión técnica, QA, seguridad y responsable de demo.',
      mandatory: true,
    },
  ],

  demoEvidenceCategories: [
    {
      id: 'category-demo-readiness',
      label: 'Demo Readiness',
      description:
        'Estado de módulos cerrados, build correcto, TypeScript limpio y wizard integrado.',
      evidenceMode: 'text-only',
    },
    {
      id: 'category-safety-boundaries',
      label: 'Safety Boundaries',
      description:
        'Declaraciones explícitas de no datos reales, no conectores, no telecontrol y no forecast oficial.',
      evidenceMode: 'text-only',
    },
    {
      id: 'category-client-narrative',
      label: 'Narrativa cliente',
      description:
        'Resumen ejecutivo para explicar alcance, valor conceptual y límites de la demo.',
      evidenceMode: 'text-only',
    },
    {
      id: 'category-qa-traceability',
      label: 'Trazabilidad QA',
      description:
        'Lista conceptual de bloques cerrados, criterios validados y exclusiones técnicas.',
      evidenceMode: 'text-only',
    },
  ],

  demoEvidenceReviewGates: [
    {
      id: 'review-gate-readiness',
      label: 'Readiness revisado',
      required: true,
      description:
        'Confirmar que los bloques previos están cerrados y no hay tareas críticas abiertas.',
    },
    {
      id: 'review-gate-safety',
      label: 'Safety Boundary revisada',
      required: true,
      description:
        'Confirmar que la evidencia declara claramente todos los límites de seguridad.',
    },
    {
      id: 'review-gate-language',
      label: 'Lenguaje comercial seguro',
      required: true,
      description:
        'Evitar promesas de producción, forecast oficial, conexión real o cumplimiento regulatorio.',
    },
    {
      id: 'review-gate-no-sensitive-info',
      label: 'Sin información sensible',
      required: true,
      description:
        'Confirmar ausencia de datos reales, credenciales, endpoints, infraestructura y trazabilidad.',
    },
  ],

  demoEvidenceSafetyGates: [
    {
      id: 'safety-gate-no-real-data',
      label: 'Sin datos reales',
      required: true,
      description:
        'La evidencia debe permanecer sin datos productivos, históricos reales o eventos reales.',
    },
    {
      id: 'safety-gate-no-actions',
      label: 'Sin acciones externas',
      required: true,
      description:
        'No debe ejecutar llamadas reales, export real, envío CEN, backend ni mutaciones.',
    },
    {
      id: 'safety-gate-no-control',
      label: 'Sin control operacional',
      required: true,
      description:
        'No debe sugerir telecontrol, setpoints, BESS, inversores ni SCADA ACK.',
    },
    {
      id: 'safety-gate-no-release',
      label: 'Sin release productiva',
      required: true,
      description:
        'No debe generar artefacto productivo ni distribuir instalación real.',
    },
  ],

  demoEvidenceApprovalRoles: [
    {
      id: 'approval-demo-owner',
      label: 'Demo Owner',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Valida narrativa, secuencia de presentación y límites comerciales.',
    },
    {
      id: 'approval-qa-owner',
      label: 'QA Owner',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Valida que la evidencia sea local, mock, read-only y no productiva.',
    },
    {
      id: 'approval-security-owner',
      label: 'Security Owner',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Valida ausencia de credenciales, endpoints, infraestructura y trazabilidad sensible.',
    },
    {
      id: 'approval-client-owner',
      label: 'Client Owner',
      reviewerRole: 'client-owner',
      required: false,
      description:
        'Solo requerido si la evidencia será compartida formalmente con cliente.',
    },
  ],

  demoEvidenceRiskRegister: [
    {
      id: 'risk-demo-confused-as-production',
      label: 'Demo confundida con producción',
      severity: 'high',
      mitigation:
        'Declarar en toda evidencia que la demo es conceptual, local, no productiva y no operacional.',
    },
    {
      id: 'risk-sensitive-data-exposure',
      label: 'Exposición de información sensible',
      severity: 'critical',
      mitigation:
        'Bloquear datos reales, credenciales, endpoints, IDs reales y trazabilidad a cliente o infraestructura.',
    },
    {
      id: 'risk-official-forecast-claim',
      label: 'Uso como forecast oficial',
      severity: 'critical',
      mitigation:
        'Incluir disclaimers de no forecast oficial, no CEN y no reporte regulatorio.',
    },
    {
      id: 'risk-release-artifact-misuse',
      label: 'Uso indebido como release',
      severity: 'high',
      mitigation:
        'No generar artefactos reales; mantener esta fase como blueprint conceptual.',
    },
  ],

  demoEvidenceExitCriteria: [
    'Blueprint de Client Demo Evidence Freeze creado.',
    'Client Demo Evidence Purpose declarado.',
    'Allowed Demo Evidence Items declarados.',
    'Blocked Demo Evidence Items declarados.',
    'Demo Evidence Freeze Principles declarados.',
    'Demo Evidence Categories declaradas.',
    'Demo Evidence Review Gates declarados.',
    'Demo Evidence Safety Gates declarados.',
    'Demo Evidence Approval Roles declarados.',
    'Demo Evidence Risk Register declarado.',
    'Demo Evidence Exit Criteria declarado.',
    'Evidence Freeze Boundary declarado.',
    'No se crea PDF real.',
    'No se crea ZIP real.',
    'No se crea APK real.',
    'No se crea release productiva.',
    'No se incorporan datos reales.',
    'No se crean conectores reales.',
    'No se usan credenciales reales.',
    'No se llama API real.',
    'No se lee SCADA real.',
    'No se lee medidor real.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  evidenceFreezeBoundary:
    'Este blueprint solo define reglas conceptuales para congelar evidencia demo segura. No crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no incorpora datos reales, no crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',

  nextRoadmap: [
    '1O-T.1A — Client Demo Evidence Freeze Types',
    '1O-T.1B — Client Demo Evidence Freeze Mock Data',
    '1O-T.2A — Client Demo Evidence Freeze Visual Card',
    '1O-T.2B — Client Demo Evidence Export Text Box',
    '1O-T.3A — Client Demo Evidence Wizard Integration',
    '1O-T.4A — Client Demo Evidence Final QA & Closure',
  ],

  nextRecommendedModule:
    '1O-T.1A — Client Demo Evidence Freeze Types',
} as const;
