const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_DEMO_SESSION_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-demo-session-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-N — Controlled Client Demo Session Runbook',
  module: '1O-N.4A — Demo Session Final QA & Closure',
  internalVersion: '0.1O-N.4A-demo-session-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel:
    'BLOQUE 1O-N CERRADO — CONTROLLED DEMO SESSION QA PASSED',

  completedLayers: [
    {
      id: '1O-N.0',
      label: 'Controlled Client Demo Session Runbook Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual para sesión demo cliente controlada, segura, local, mock, read-only y no productiva.',
    },
    {
      id: '1O-N.1A',
      label: 'Controlled Demo Session Types',
      status: 'completed',
      summary:
        'Tipos TypeScript para runbook, roles, fases, checklist, guion, declaraciones seguras, acciones prohibidas, criterios de pausa, riesgos y cierre.',
    },
    {
      id: '1O-N.1B.1',
      label: 'Controlled Demo Session Mock Data Base',
      status: 'completed',
      summary:
        'Primera mitad del mock data: Purpose, Roles, Phases, Pre-Demo Checklist, Live Demo Script y Client-Safe Statements.',
    },
    {
      id: '1O-N.1B.2',
      label: 'Controlled Demo Session Mock Data Completion',
      status: 'completed',
      summary:
        'Segunda mitad del mock data: Forbidden Demo Actions, Pause/Stop Criteria, Question Handling Rules, Evidence Boundaries, Follow-Up Rules, Gates, Risks, Exit Criteria y pack final.',
    },
    {
      id: '1O-N.2A',
      label: 'Demo Session Runbook Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual del runbook completo de sesión demo cliente controlada.',
    },
    {
      id: '1O-N.2B',
      label: 'Demo Session Script Export Text Box',
      status: 'completed',
      summary:
        'Caja local de exportación con guion seguro cliente y reporte interno copiable.',
    },
    {
      id: '1O-N.3A',
      label: 'Demo Session Wizard Integration',
      status: 'completed',
      summary:
        'Integración del runbook visual y export box al wizard principal usando mock pack local.',
    },
  ],

  finalQaAssertions: [
    'Controlled Demo Session Runbook visible en wizard.',
    'Demo Session Script Export Text Box visible en wizard.',
    'Controlled Client Demo Session Runbook Pack mock usado localmente.',
    'Purpose visible.',
    'Roles visibles.',
    'Phases visibles.',
    'Pre-Demo Checklist visible.',
    'Live Demo Script visible.',
    'Client-Safe Statements visibles.',
    'Forbidden Demo Actions visibles.',
    'Pause / Stop Criteria visibles.',
    'Question Handling Rules visibles.',
    'Evidence Capture Boundaries visibles.',
    'Post-Demo Follow-Up Rules visibles.',
    'Human Approval Gates visibles.',
    'Session Risks visibles.',
    'Session Exit Criteria visibles.',
    'Guion seguro cliente copiable.',
    'Reporte interno de runbook copiable.',
    'Safety Boundary visible.',
    'No hay agenda real de reuniones.',
    'No hay grabación real de sesión.',
    'No hay ZIP/APK/PDF real.',
    'No hay correos reales.',
    'No hay backend.',
    'No hay APIs.',
    'No hay localStorage.',
    'No hay conectores reales.',
    'No hay SCADA real.',
    'No hay medidores reales.',
    'No hay CEN real.',
    'No hay credenciales, tokens ni secrets.',
    'No hay POST/PUT/PATCH/DELETE real.',
    'No hay telecontrol.',
    'No hay setpoints.',
    'No hay comandos BESS.',
    'No hay comandos inversores.',
    'No hay producción real.',
    'No hay mezcla con otros proyectos ORBI.',
  ],

  demoSessionClosureRules: [
    'El bloque 1O-N queda congelado como runbook local, mock, read-only y no productivo para demo cliente controlada.',
    'Toda demo debe comenzar declarando No Real Integration Statement.',
    'Toda respuesta sobre integración real debe derivarse a roadmap separado read-only.',
    'Toda pregunta sobre telecontrol, setpoints, BESS, inversores o SCADA ACK queda fuera de alcance.',
    'Todo seguimiento externo requiere revisión humana previa.',
    'Los textos copiables no son documentos oficiales ni regulatorios.',
    'No se debe prometer producción, forecast oficial, reporte regulatorio, backend, APIs ni conectores reales desde este bloque.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-N belongs exclusively to ORBI PVMetrics IA.',
    'No importar rutas, stores, providers, componentes o servicios de otros proyectos ORBI.',
    'Si aparece referencia cruzada, detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
    'No agenda real.',
    'No grabación real.',
    'No ZIP real.',
    'No APK real.',
    'No PDF export real.',
    'No firma digital real.',
    'No correos reales.',
    'No backend.',
    'No APIs.',
    'No localStorage.',
    'No conectores reales.',
    'No SCADA real.',
    'No medidores reales.',
    'No weather API.',
    'No CEN real.',
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
    'El bloque 1O-N queda cerrado como runbook visual y exportable para conducir una demo cliente controlada de ORBI PVMetrics IA. La capa establece propósito, roles, fases, checklist, guion seguro, statements cliente, acciones prohibidas, criterios de pausa, reglas de preguntas, límites de evidencia, seguimiento, gates humanos, riesgos y criterios de cierre, manteniendo todo local, mock, read-only, no productivo y sin acciones externas reales.',

  nextRecommendedModule:
    '1O-O.0 — Controlled Client Demo Feedback & Pilot Readiness Blueprint',
} as const;
