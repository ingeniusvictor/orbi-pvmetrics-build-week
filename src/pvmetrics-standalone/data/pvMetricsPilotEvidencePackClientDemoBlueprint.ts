const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_PILOT_EVIDENCE_PACK_CLIENT_DEMO_BLUEPRINT = {
  id: 'pvmetrics-pilot-evidence-pack-client-demo-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-I — Pilot Evidence Pack & Client Demo',
  module: '1O-I.0 — Pilot Evidence Pack & Client Demo Blueprint',
  internalVersion: '0.1O-I.0-pilot-evidence-pack-client-demo-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_EXPORT',
  blueprintStatusLabel: 'PILOT EVIDENCE PACK — SOLO BLUEPRINT',

  purpose:
    'Preparar una estructura conceptual para demostrar ORBI PVMetrics IA a clientes o stakeholders mediante evidencia local, mock, read-only y segura, sin crear exportaciones reales, sin backend y sin conectores externos.',

  evidenceCategories: [
    {
      id: 'evidence-product-readiness',
      label: 'Product Readiness',
      description:
        'Evidencia de madurez funcional, navegación, wizard, reportes locales y módulos cerrados.',
      examples: [
        'Version Registry',
        'App Manifest',
        'QA Checklist',
        'Roadmap completado',
        'Snapshots de cierre por bloque',
      ],
    },
    {
      id: 'evidence-safety-readiness',
      label: 'Safety Readiness',
      description:
        'Evidencia de límites operacionales, ausencia de telecontrol, ausencia de escritura real y protección anti-credenciales.',
      examples: [
        'Safety Boundaries',
        'Anti-Write Policy',
        'Anti-Telecontrol Policy',
        'Controlled Sandbox Closure',
        'Forbidden Operations',
      ],
    },
    {
      id: 'evidence-client-demo',
      label: 'Client Demo',
      description:
        'Evidencia conceptual para explicar valor comercial, técnico y operacional del prototipo sin usar datos reales.',
      examples: [
        'Resumen cliente',
        'Demo narrative',
        'Escenarios mock',
        'Replay visual',
        'Reportes copiables',
      ],
    },
    {
      id: 'evidence-technical-traceability',
      label: 'Technical Traceability',
      description:
        'Evidencia de trazabilidad técnica por módulos, versiones, QA y restricciones.',
      examples: [
        'Módulos cerrados',
        'Checks QA',
        'Context Lock',
        'Anti-Mix Rules',
        'Build limpio',
      ],
    },
  ],

  clientDemoNarrative: [
    'ORBI PVMetrics IA es una aplicación independiente para evaluar de forma local y segura escenarios de performance FV, forecasting, impacto comercial y readiness conceptual.',
    'La demo no usa datos reales ni conectores externos.',
    'El valor principal es mostrar cómo se estructuraría una evaluación técnica/comercial bajo límites read-only.',
    'El sandbox demuestra que el sistema permite escenarios mock seguros, exige revisión humana y bloquea escritura, telecontrol y fuentes reales.',
    'El paquete de evidencia futura debe servir para conversación piloto con cliente sin comprometer operación real.',
  ],

  clientReadinessChecklist: [
    'Existe versión estable consolidada.',
    'Existe App Manifest actualizado.',
    'Existe QA Checklist actualizado.',
    'Existen cierres de bloques previos.',
    'Existe explicación de Safety Boundaries.',
    'Existe narrativa cliente clara.',
    'Existe separación entre demo mock y datos reales.',
    'Existe declaración explícita de no integración real.',
    'Existe prohibición de telecontrol y setpoints.',
    'Existe prohibición de CEN submit real.',
  ],

  technicalEvidenceChecklist: [
    'Build correcto.',
    'TypeScript limpio.',
    'Version Registry sincronizado.',
    'App Manifest sincronizado.',
    'QA Checklist sincronizado.',
    'README actualizado.',
    'Bloques 1O-G y 1O-H cerrados.',
    'Sandbox Gate Replay integrado al wizard.',
    'Export Box local copiable.',
    'Sin dependencia de backend.',
    'Sin persistencia localStorage.',
  ],

  safetyEvidenceChecklist: [
    'No sandbox real.',
    'No conectores reales.',
    'No SCADA real.',
    'No medidores reales.',
    'No weather API.',
    'No envío CEN real.',
    'No credenciales.',
    'No secrets.',
    'No backend.',
    'No localStorage.',
    'No correos reales.',
    'No export PDF real.',
    'No POST/PUT/PATCH/DELETE real.',
    'No telecontrol.',
    'No setpoints.',
    'No comandos BESS.',
    'No comandos inversores.',
  ],

  pilotBoundaries: [
    'Toda evidencia debe ser local y conceptual.',
    'Toda demo debe usar mock data o datos sanitizados futuros.',
    'Todo reporte debe declararse como no oficial.',
    'Toda integración real queda fuera del bloque 1O-I inicial.',
    'Toda exportación futura debe ser local y revisable antes de enviarse.',
    'Toda conversación cliente debe aclarar que no existe conexión operacional.',
  ],

  noRealIntegrationStatement:
    'Este blueprint no habilita integraciones reales, no exporta PDF, no envía correos, no usa backend, no llama APIs, no consume SCADA, no lee medidores, no envía información al CEN, no usa credenciales y no ejecuta operaciones mutativas.',

  nextRoadmap: [
    '1O-I.1A — Pilot Evidence Pack Types',
    '1O-I.1B — Pilot Evidence Pack Mock Data',
    '1O-I.2A — Client Demo Narrative Card',
    '1O-I.2B — Pilot Evidence Export Text Box',
    '1O-I.3A — Pilot Evidence Pack Wizard Integration',
    '1O-I.4A — Pilot Evidence Final QA & Closure',
  ],

  nextRecommendedModule: '1O-I.1A — Pilot Evidence Pack Types',
} as const;
