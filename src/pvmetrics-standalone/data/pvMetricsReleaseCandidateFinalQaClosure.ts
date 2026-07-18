const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_RELEASE_CANDIDATE_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-release-candidate-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-L — Standalone Client Demo Release Candidate',
  module: '1O-L.4A — Release Candidate Final QA & Closure',
  internalVersion: '0.1O-L.4A-release-candidate-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel: 'BLOQUE 1O-L CERRADO — RELEASE CANDIDATE QA PASSED',

  completedLayers: [
    {
      id: '1O-L.0',
      label: 'Standalone Client Demo Release Candidate Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual para preparar ORBI PVMetrics IA como demo independiente candidata a release interno/controlado, con scope, boundaries, readiness, riesgos y gates humanos.',
    },
    {
      id: '1O-L.1A',
      label: 'Release Candidate Types',
      status: 'completed',
      summary:
        'Tipos TypeScript para status, checklist status, risk severity, scope, boundaries, readiness, requirements, capabilities, claims bloqueados, riesgos, gates y pack release candidate.',
    },
    {
      id: '1O-L.1B',
      label: 'Release Candidate Mock Data',
      status: 'completed',
      summary:
        'Mock data local seguro para Standalone Client Demo Release Candidate con scope, boundaries, readiness checklists, capabilities, risks, human gates, exit criteria y safety boundary.',
    },
    {
      id: '1O-L.2A',
      label: 'Release Candidate Readiness Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual para mostrar readiness del Release Candidate: scope, boundaries, client/technical/safety readiness, requirements, claims bloqueados, riesgos, gates humanos y safety boundary.',
    },
    {
      id: '1O-L.2B',
      label: 'Release Candidate Checklist Export Text Box',
      status: 'completed',
      summary:
        'Export box local con resumen cliente y reporte interno de Release Candidate copiables en texto plano, sin ZIP/APK/PDF real, sin correos, sin backend y sin APIs.',
    },
    {
      id: '1O-L.3A',
      label: 'Release Candidate Wizard Integration',
      status: 'completed',
      summary:
        'Integración visual al wizard de Release Candidate Readiness Visual Card y Release Candidate Checklist Export Text Box usando mock data local.',
    },
  ],

  finalQaAssertions: [
    'Build correcto.',
    'TypeScript limpio.',
    'Bloque 1O-L opera solo con mock data local.',
    'Release Candidate Readiness Visual Card visible en wizard.',
    'Release Candidate Checklist Export Text Box visible en wizard.',
    'Standalone Client Demo Release Candidate Pack usado localmente.',
    'Release Candidate Scope visible.',
    'Demo Package Boundaries visibles.',
    'Client Demo Readiness Checklist visible.',
    'Technical Readiness Checklist visible.',
    'Safety Readiness Checklist visible.',
    'Build & TypeScript Requirements visibles.',
    'Allowed Demo Capabilities visibles.',
    'Blocked Production Claims visibles.',
    'Release Candidate Risks visibles.',
    'Human Review Gates visibles.',
    'Resumen cliente de Release Candidate copiable.',
    'Reporte interno de Release Candidate copiable.',
    'Safety Boundary visible.',
    'No existe ZIP real.',
    'No existe APK real.',
    'No existe PDF export real.',
    'No existen correos reales.',
    'No existe backend.',
    'No existen APIs externas.',
    'No existe localStorage para mutaciones persistentes.',
    'No existen conectores reales.',
    'No existe conexión SCADA real.',
    'No existe lectura de medidores reales.',
    'No existe weather API.',
    'No existe envío CEN real.',
    'No existen credenciales.',
    'No existen tokens.',
    'No existen secrets.',
    'No existen POST/PUT/PATCH/DELETE reales.',
    'No existe telecontrol.',
    'No existen setpoints.',
    'No existen comandos BESS.',
    'No existen comandos inversores.',
    'No existe producción real habilitada.',
    'No existe artefacto release real.',
    'No existen imports de otros proyectos ORBI.',
  ],

  releaseCandidateClosureRules: [
    'El bloque 1O-L queda congelado como Release Candidate Demo local, mock, read-only y no productivo.',
    'Toda presentación debe aclarar que no existe artefacto externo real ZIP/APK/PDF generado por este bloque.',
    'Todo texto cliente debe indicar que la app no conecta SCADA, medidores, CEN, weather APIs ni backend real.',
    'Todo uso comercial debe evitar claims de producción, integración real, forecast oficial o reporte regulatorio.',
    'Todo resumen externo requiere revisión humana antes de compartirse fuera del equipo.',
    'Toda integración real futura queda fuera de 1O-L y debe implementarse como roadmap separado.',
    'Todo telecontrol, setpoint, BESS command, inverter command o SCADA ACK queda prohibido.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-L pertenece exclusivamente a ORBI PVMetrics IA.',
    'No se deben importar componentes, rutas, stores, providers o servicios de otros proyectos ORBI.',
    'Cualquier referencia cruzada debe detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
    'No ZIP real.',
    'No APK real.',
    'No PDF export real.',
    'No correos reales.',
    'No backend.',
    'No APIs externas.',
    'No localStorage para mutaciones persistentes.',
    'No conectores reales.',
    'No SCADA real.',
    'No medidores reales.',
    'No weather API.',
    'No envío CEN real.',
    'No credenciales.',
    'No tokens.',
    'No secrets.',
    'No POST/PUT/PATCH/DELETE real.',
    'No telecontrol.',
    'No setpoints.',
    'No comandos BESS.',
    'No comandos inversores.',
    'No producción real.',
    'No artefacto release real.',
  ],

  closureStatement:
    'El bloque 1O-L queda cerrado como Release Candidate Demo local, mock, read-only, no productivo y seguro para revisión interna y conversación controlada con cliente piloto. El wizard ahora muestra readiness, límites del paquete demo, checklists cliente/técnico/seguridad, requerimientos de build y TypeScript, capabilities permitidas, claims bloqueados, riesgos, gates humanos y textos copiables, sin ZIP/APK/PDF real, sin correos, sin backend, sin APIs, sin conectores reales y sin impacto operacional.',

  nextRecommendedModule:
    '1O-M.0 — Local Demo Package Assembly & Operator Sign-Off Blueprint',
} as const;
