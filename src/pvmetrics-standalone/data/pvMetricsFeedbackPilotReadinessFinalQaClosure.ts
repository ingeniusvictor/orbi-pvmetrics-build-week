const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_FEEDBACK_PILOT_READINESS_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-feedback-pilot-readiness-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-O — Controlled Client Demo Feedback & Pilot Readiness',
  module: '1O-O.4A — Feedback & Pilot Readiness Final QA & Closure',
  internalVersion: '0.1O-O.4A-feedback-pilot-readiness-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel:
    'BLOQUE 1O-O CERRADO — FEEDBACK & PILOT READINESS QA PASSED',

  completedLayers: [
    {
      id: '1O-O.0',
      label:
        'Controlled Client Demo Feedback & Pilot Readiness Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual para ordenar feedback post-demo y evaluar readiness de piloto futuro read-only.',
    },
    {
      id: '1O-O.1A',
      label: 'Client Demo Feedback Types',
      status: 'completed',
      summary:
        'Tipos TypeScript para feedback status, inputs permitidos/bloqueados, categorías, readiness, señales, riesgos, gates y pack maestro.',
    },
    {
      id: '1O-O.1B',
      label: 'Client Demo Feedback Mock Data',
      status: 'completed',
      summary:
        'Mock data local para feedback post-demo, readiness conceptual, riesgos, gates, exit criteria y Safety Boundary.',
    },
    {
      id: '1O-O.2A',
      label: 'Feedback & Pilot Readiness Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual para mostrar feedback conceptual, señales de readiness, riesgos, gates y criterios de egreso.',
    },
    {
      id: '1O-O.2B',
      label: 'Feedback Summary Export Text Box',
      status: 'completed',
      summary:
        'Caja local de exportación con resumen seguro cliente post-demo y reporte interno de feedback/readiness.',
    },
    {
      id: '1O-O.3A',
      label: 'Feedback & Pilot Readiness Wizard Integration',
      status: 'completed',
      summary:
        'Integración visual del bloque 1O-O al wizard usando pack mock local.',
    },
  ],

  finalQaAssertions: [
    'Feedback & Pilot Readiness Visual Card visible en wizard.',
    'Feedback Summary Export Text Box visible en wizard.',
    'Controlled Client Demo Feedback Pack mock usado localmente.',
    'Demo Feedback Purpose visible.',
    'Allowed Feedback Inputs visibles.',
    'Blocked Feedback Inputs visibles.',
    'Feedback Categories visibles.',
    'Pilot Readiness Dimensions visibles.',
    'Client Question Log Rules visibles.',
    'Readiness Signal Guidelines visibles.',
    'Pilot Risk Register visible.',
    'Human Review Gates visibles.',
    'Pilot Readiness Exit Criteria visibles.',
    'Resumen seguro cliente post-demo copiable.',
    'Reporte interno de feedback/readiness copiable.',
    'Safety Boundary visible.',
    'No hay feedback real.',
    'No hay formularios reales.',
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
    'No hay artefacto release real.',
    'No hay mezcla con otros proyectos ORBI.',
  ],

  feedbackClosureRules: [
    'El bloque 1O-O queda congelado como capa local, mock, read-only y no productiva.',
    'Todo feedback mostrado es conceptual y no corresponde a feedback real de cliente.',
    'Todo resumen copiable debe tratarse como borrador interno o guía segura, no como documento oficial.',
    'Toda señal de readiness requiere revisión humana antes de sugerir piloto.',
    'Toda pregunta sobre SCADA, medidores, CEN, backend o APIs debe derivarse a roadmap read-only separado.',
    'Toda solicitud de telecontrol, setpoints, BESS, inversores o SCADA ACK queda fuera de alcance.',
    'No se debe prometer piloto, fechas, precios, producción, conectores reales ni forecast oficial desde este bloque.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-O pertenece exclusivamente a ORBI PVMetrics IA.',
    'No importar rutas, stores, providers, componentes o servicios de otros proyectos ORBI.',
    'Si aparece referencia cruzada, detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
    'No feedback real.',
    'No formularios reales.',
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
    'El bloque 1O-O queda cerrado como capa visual y exportable para ordenar feedback post-demo y evaluar readiness conceptual de piloto futuro read-only en ORBI PVMetrics IA. La capa establece inputs permitidos y bloqueados, categorías, dimensiones de readiness, reglas de preguntas, señales, riesgos, gates humanos, criterios de egreso y Safety Boundary, manteniendo todo local, mock, read-only, no productivo y sin acciones externas reales.',

  nextRecommendedModule:
    '1O-P.0 — Controlled Pilot Scope & Read-Only Integration Agreement Blueprint',
} as const;
