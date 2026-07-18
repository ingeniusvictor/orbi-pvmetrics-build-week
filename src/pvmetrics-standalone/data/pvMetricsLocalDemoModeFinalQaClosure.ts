const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_LOCAL_DEMO_MODE_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-local-demo-mode-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-J — Local Demo Mode Hardening & Presentation Flow',
  module: '1O-J.4A — Local Demo Mode Final QA & Closure',
  internalVersion: '0.1O-J.4A-local-demo-mode-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel: 'BLOQUE 1O-J CERRADO — QA PASSED',

  completedLayers: [
    {
      id: '1O-J.0',
      label: 'Local Demo Mode Hardening & Presentation Flow Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual del modo demo local, flujo de presentación, audience modes, safety locks, guardrails y forbidden capabilities.',
    },
    {
      id: '1O-J.1A',
      label: 'Local Demo Mode Types',
      status: 'completed',
      summary:
        'Tipos TypeScript base para Demo Audience Modes, Safety Locks, Presentation Stages, Script, Notes, Guardrails, Exit Criteria y Presentation Flow Pack.',
    },
    {
      id: '1O-J.1B',
      label: 'Local Demo Mode Mock State',
      status: 'completed',
      summary:
        'Mock state local del modo demo y presentation flow pack, sin toggle runtime, sin persistencia y sin red.',
    },
    {
      id: '1O-J.2A',
      label: 'Presentation Flow Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual para Demo Audience Modes, Presentation Stages, Safe Demo Script, Operator Notes, Client Narrative Guardrails, Exit Criteria y Safety Boundary.',
    },
    {
      id: '1O-J.2B',
      label: 'Demo Safety Locks Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual de Demo Safety Locks, Forbidden Capabilities, Demo Mode State, No Network, No Persistence, No Mutation y Safety Boundary.',
    },
    {
      id: '1O-J.3A',
      label: 'Local Demo Mode Wizard Integration',
      status: 'completed',
      summary:
        'Integración visual al wizard de Presentation Flow Visual Card y Demo Safety Locks Visual Card usando mock state local.',
    },
  ],

  finalQaAssertions: [
    'Build correcto.',
    'TypeScript limpio.',
    'Bloque 1O-J opera solo con mock state local.',
    'Presentation Flow Visual Card visible en wizard.',
    'Demo Safety Locks Visual Card visible en wizard.',
    'Demo Audience Modes visibles.',
    'Presentation Stages visibles.',
    'Safe Demo Script visible.',
    'Operator Notes visibles.',
    'Client Narrative Guardrails visibles.',
    'Forbidden Capabilities visibles.',
    'Demo Mode State visible.',
    'Safety Boundary visible.',
    'No existe toggle real de demo mode.',
    'No existe localStorage.',
    'No existe PDF export real.',
    'No existen correos reales.',
    'No existe backend.',
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
    'No existen imports de otros proyectos ORBI.',
  ],

  localDemoClosureRules: [
    'El modo demo local es una guía visual y conceptual, no un modo runtime activo.',
    'El estado demo debe permanecer mock, local, no persistente y sin red.',
    'El flujo de presentación debe mantener narrativa segura para audiencias ejecutivas, técnicas y QA.',
    'Las safety locks deben mantenerse visibles antes de cualquier demo cliente.',
    'Toda conversación cliente debe declarar que no existe conexión real a SCADA, medidores, CEN, clima, backend ni correo.',
    'Toda futura activación de un toggle demo real debe implementarse como módulo separado con QA y revisión humana.',
    'Toda futura persistencia de preferencias demo debe implementarse como módulo separado y justificado.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-J pertenece exclusivamente a ORBI PVMetrics IA.',
    'No se deben importar componentes, rutas, stores, providers o servicios de otros proyectos ORBI.',
    'Cualquier referencia cruzada debe detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
    'No toggle real de demo mode.',
    'No localStorage.',
    'No PDF export real.',
    'No correos reales.',
    'No backend.',
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
  ],

  closureStatement:
    'El bloque 1O-J queda cerrado como capa local, mock, read-only y segura para endurecer el flujo de presentación demo. El wizard ahora muestra la guía de presentación, audiencias, guion seguro, notas de operador, guardrails narrativos, bloqueos de seguridad, capacidades prohibidas y safety boundary, sin activar ningún modo demo real, sin persistencia, sin red, sin backend y sin impacto operacional.',

  nextRecommendedModule:
    '1O-K.0 — Client Pilot Handoff & Safe Next Steps Blueprint',
} as const;
