const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_BLUEPRINT = {
  id: 'pvmetrics-standalone-client-demo-release-candidate-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-L — Standalone Client Demo Release Candidate',
  module: '1O-L.0 — Standalone Client Demo Release Candidate Blueprint',
  internalVersion:
    '0.1O-L.0-standalone-client-demo-release-candidate-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_RELEASE_ARTIFACT',
  blueprintStatusLabel:
    'STANDALONE CLIENT DEMO RELEASE CANDIDATE — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Preparar una estructura conceptual para evaluar ORBI PVMetrics IA como demo independiente candidata a release, manteniendo la app local, mock, read-only, segura y sin artefactos externos reales.',

  releaseCandidateScope: [
    'Demo independiente local para revisión interna.',
    'Presentación controlada a cliente piloto.',
    'Wizard configurador con capas de seguridad visibles.',
    'Sandbox controlado mock.',
    'Pilot Evidence Pack visible.',
    'Local Demo Mode visible.',
    'Client Pilot Handoff visible.',
    'Textos copiables locales para revisión humana.',
    'Version Registry, App Manifest, QA Checklist y README sincronizados.',
  ],

  demoPackageBoundaries: [
    'No se genera ZIP real.',
    'No se genera APK real.',
    'No se genera PDF real.',
    'No se envían correos reales.',
    'No se crea backend.',
    'No se llaman APIs.',
    'No se usa localStorage.',
    'No se crean conectores reales.',
    'No se conecta SCADA.',
    'No se leen medidores reales.',
    'No se usa weather API.',
    'No se envía información al CEN.',
    'No se agregan credenciales.',
    'No se agregan tokens.',
    'No se agregan secrets.',
    'No existe telecontrol.',
    'No existen setpoints.',
    'No existen comandos BESS.',
    'No existen comandos inversores.',
  ],

  clientDemoReadinessChecklist: [
    {
      id: 'client-demo-narrative-ready',
      label: 'Narrativa cliente lista',
      status: 'ready',
      description:
        'La demo cuenta con narrativa cliente, handoff, próximos pasos seguros y límites visibles.',
    },
    {
      id: 'client-demo-boundaries-visible',
      label: 'Límites visibles',
      status: 'ready',
      description:
        'Los límites de no integración real, no SCADA, no CEN y no telecontrol están declarados.',
    },
    {
      id: 'client-demo-copy-text-ready',
      label: 'Textos copiables listos',
      status: 'ready',
      description:
        'Existen textos locales copiables para resumen cliente y reporte interno.',
    },
    {
      id: 'client-demo-no-overpromise',
      label: 'Sin sobrepromesas',
      status: 'ready',
      description:
        'Blocked Claims y guardrails reducen riesgo de prometer capacidades productivas inexistentes.',
    },
  ],

  technicalReadinessChecklist: [
    {
      id: 'technical-build-clean',
      label: 'Build limpio',
      status: 'requires-run',
      description:
        'Debe ejecutarse npm run build antes de declarar release candidate interno.',
    },
    {
      id: 'technical-typescript-clean',
      label: 'TypeScript limpio',
      status: 'requires-run',
      description:
        'Debe ejecutarse tsc --noEmit sin errores ni advertencias críticas.',
    },
    {
      id: 'technical-registry-synced',
      label: 'Registry sincronizado',
      status: 'ready',
      description:
        'Version Registry debe apuntar al módulo activo y al siguiente módulo recomendado.',
    },
    {
      id: 'technical-manifest-synced',
      label: 'Manifest sincronizado',
      status: 'ready',
      description:
        'PVMetricsIndependentAppManifest debe reflejar versión, bloque y módulo actual.',
    },
  ],

  safetyReadinessChecklist: [
    {
      id: 'safety-readonly',
      label: 'Read-only posture',
      status: 'ready',
      description:
        'El release candidate demo debe mantenerse local, mock y sin operaciones de escritura.',
    },
    {
      id: 'safety-no-network-effects',
      label: 'Sin efectos de red',
      status: 'ready',
      description:
        'No deben existir POST/PUT/PATCH/DELETE reales ni llamadas externas.',
    },
    {
      id: 'safety-no-operational-control',
      label: 'Sin control operacional',
      status: 'ready',
      description:
        'Telecontrol, setpoints, comandos BESS e inversores quedan prohibidos.',
    },
    {
      id: 'safety-no-secrets',
      label: 'Sin secretos',
      status: 'ready',
      description:
        'No deben existir credenciales, tokens, secrets ni variables productivas.',
    },
  ],

  buildAndTypescriptRequirements: [
    'npm run build debe completar sin errores.',
    'tsc --noEmit debe completar sin errores.',
    'No deben aparecer imports de otros proyectos ORBI.',
    'No deben aparecer rutas fuera de src/pvmetrics-standalone/** salvo release/README permitidos.',
    'No deben agregarse dependencias pesadas para exportación real.',
    'No deben agregarse scripts de despliegue productivo.',
  ],

  allowedDemoCapabilities: [
    'Wizard local.',
    'Visual cards mock.',
    'Textareas copiables.',
    'Clipboard local con acción humana.',
    'Version Registry.',
    'App Manifest.',
    'QA Checklist.',
    'README.',
    'Closure snapshots.',
    'Safety boundaries visibles.',
    'No Real Integration Statements.',
  ],

  blockedProductionClaims: [
    'Release candidate productivo.',
    'Aplicación conectada a SCADA real.',
    'Lectura de medidores reales.',
    'Envío CEN habilitado.',
    'Forecast oficial.',
    'Reporte regulatorio oficial.',
    'Backend productivo.',
    'Correo automático real.',
    'Exportación PDF oficial.',
    'Integración ERP real.',
    'Control BESS.',
    'Control inversores.',
    'Telecontrol o setpoints.',
  ],

  releaseCandidateRisks: [
    {
      id: 'risk-demo-seen-as-production',
      label: 'Demo confundida con producción',
      severity: 'high',
      mitigation:
        'Usar etiquetas Release Candidate Demo, local, mock, read-only y no productivo.',
    },
    {
      id: 'risk-client-overinterpretation',
      label: 'Cliente interpreta resultados como oficiales',
      severity: 'high',
      mitigation:
        'Reforzar No Real Integration Statement y evitar lenguaje de reporte oficial.',
    },
    {
      id: 'risk-unsafe-next-step',
      label: 'Solicitud de integración real prematura',
      severity: 'critical',
      mitigation:
        'Derivar a roadmap futuro separado con contrato read-only, QA y revisión humana.',
    },
    {
      id: 'risk-artifact-leak',
      label: 'Entrega de artefacto no validado',
      severity: 'medium',
      mitigation:
        'No generar ZIP/APK/PDF real in this block. Only blueprint and checks.',
    },
  ],

  humanReviewGates: [
    {
      id: 'gate-before-client-demo',
      label: 'Antes de demo cliente',
      required: true,
      reviewerRole: 'technical-owner',
      description:
        'Validar que build, TypeScript, safety boundaries y claims bloqueados están correctos.',
    },
    {
      id: 'gate-before-sharing-text',
      label: 'Antes de compartir textos externos',
      required: true,
      reviewerRole: 'qa-owner',
      description:
        'Revisar resumen cliente y reporte interno antes de enviarlos fuera del equipo.',
    },
    {
      id: 'gate-before-any-real-integration',
      label: 'Antes de cualquier integración real',
      required: true,
      reviewerRole: 'operations-owner',
      description:
        'Toda integración real queda bloqueada hasta roadmap separado, contrato read-only y QA dedicado.',
    },
  ],

  exitCriteria: [
    'Blueprint creado.',
    'Release Candidate Scope declarado.',
    'Demo Package Boundaries declarados.',
    'Client Demo Readiness Checklist declarado.',
    'Technical Readiness Checklist declarado.',
    'Safety Readiness Checklist declarado.',
    'Build & TypeScript Requirements declarados.',
    'Allowed Demo Capabilities declaradas.',
    'Blocked Production Claims declarados.',
    'Release Candidate Risks declarados.',
    'Human Review Gates declarados.',
    'Safety Boundary declarada.',
    'Next Roadmap 1O-L declarado.',
    'No se crea UI nueva.',
    'No se modifica wizard.',
    'No se genera ZIP/APK/PDF real.',
    'No se envían correos.',
    'No se crea backend.',
    'No se llaman APIs.',
    'No se usa localStorage.',
    'No se crean conectores reales.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint no genera release externo real, no crea ZIP/APK/PDF, no envía correos, no crea backend, no llama APIs, no usa localStorage, no crea conectores reales, no conecta SCADA, no lee medidores, no usa weather API, no envía CEN, no usa credenciales/tokens/secrets, no ejecuta escritura real y no habilita telecontrol, setpoints, BESS commands ni inverter commands.',

  nextRoadmap: [
    '1O-L.1A — Release Candidate Types',
    '1O-L.1B — Release Candidate Mock Data',
    '1O-L.2A — Release Candidate Readiness Visual Card',
    '1O-L.2B — Release Candidate Checklist Export Text Box',
    '1O-L.3A — Release Candidate Wizard Integration',
    '1O-L.4A — Release Candidate Final QA & Closure',
  ],

  nextRecommendedModule: '1O-L.1A — Release Candidate Types',
} as const;
