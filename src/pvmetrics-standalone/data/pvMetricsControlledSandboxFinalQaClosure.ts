const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_SANDBOX_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-controlled-sandbox-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-H — Controlled Read-Only Integration Sandbox',
  module: '1O-H.3A — Controlled Sandbox Final QA & Closure',
  internalVersion: '0.1O-H.3A-controlled-sandbox-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel: 'BLOQUE 1O-H CERRADO — QA PASSED',

  completedLayers: [
    {
      id: '1O-H.0',
      label: 'Controlled Read-Only Integration Sandbox Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual para sandbox read-only controlado, sin crear conectores reales ni llamadas externas.',
    },
    {
      id: '1O-H.1A',
      label: 'Controlled Sandbox Types',
      status: 'completed',
      summary:
        'Tipos base para sesión, fuente, gates, eventos, replay steps, run result y registry.',
    },
    {
      id: '1O-H.1B.1',
      label: 'Controlled Sandbox Mock Session Base Engine',
      status: 'completed',
      summary:
        'Base mock de sesión con source seguro, gates obligatorios, checklist, replay steps y eventos.',
    },
    {
      id: '1O-H.1B.2',
      label: 'Controlled Sandbox Run Result & Registry Engine',
      status: 'completed',
      summary:
        'Run Result, Gate Results, textos internos/cliente, blocked reasons, warnings, human review y mock registry.',
    },
    {
      id: '1O-H.2A',
      label: 'Sandbox Gate Replay Mock Data',
      status: 'completed',
      summary:
        'Escenarios mock de replay para aprobados, revisión humana y bloqueos por API, SCADA, medidor, POST, telecontrol y CEN submit.',
    },
    {
      id: '1O-H.2B',
      label: 'Sandbox Gate Replay Visual Card',
      status: 'completed',
      summary:
        'Visual card del replay con summary, escenarios, outcomes, bloqueos, warnings, revisión humana y Safety Boundary.',
    },
    {
      id: '1O-H.2C.1',
      label: 'Sandbox Gate Replay Export Box',
      status: 'completed',
      summary:
        'Export box local con reporte interno y resumen cliente copiables.',
    },
    {
      id: '1O-H.2C.2',
      label: 'Sandbox Gate Replay Wizard Integration',
      status: 'completed',
      summary:
        'Visual Card y Export Box integrados al wizard usando data mock local.',
    },
  ],

  finalQaAssertions: [
    'Build correcto.',
    'TypeScript limpio.',
    'Bloque 1O-H opera solo con mock data local.',
    'Sandbox Gate Replay visible en wizard.',
    'Export Box copia texto local al portapapeles.',
    'No existe sandbox real.',
    'No existen conectores reales.',
    'No existe conexión SCADA real.',
    'No existe lectura de medidores reales.',
    'No existe weather API.',
    'No existe envío CEN real.',
    'No existen credenciales.',
    'No existen secrets.',
    'No existe backend.',
    'No existe localStorage agregado por este bloque.',
    'No existen correos reales.',
    'No existe export PDF.',
    'No existen POST/PUT/PATCH/DELETE reales.',
    'No existe telecontrol.',
    'No existen setpoints.',
    'No existen comandos BESS.',
    'No existen comandos inversores.',
    'No existen imports de otros proyectos ORBI.',
  ],

  controlledSandboxClosureRules: [
    'Todo flujo sandbox debe permanecer mock/local hasta nueva autorización.',
    'Todo escenario real debe permanecer bloqueado.',
    'Todo escenario futuro manual debe exigir revisión humana.',
    'Todo intento de escritura debe ser rechazado.',
    'Todo intento de telecontrol debe ser rechazado.',
    'Todo intento de CEN submit debe ser rechazado.',
    'Toda fuente con credenciales, red o sistema real queda fuera del bloque 1O-H.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-H pertenece exclusivamente a ORBI PVMetrics IA.',
    'No se deben importar componentes, stores, rutas, providers o servicios de otros proyectos ORBI.',
    'Cualquier referencia cruzada debe detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
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
    'No export PDF.',
    'No POST/PUT/PATCH/DELETE real.',
    'No telecontrol.',
    'No setpoints.',
    'No comandos BESS.',
    'No comandos inversores.',
  ],

  closureStatement:
    'El bloque 1O-H queda cerrado como sandbox controlado, local, mock y read-only para validar escenarios seguros, revisión humana y bloqueos de riesgo sin abrir conexiones reales ni operaciones mutativas.',

  nextRecommendedModule:
    '1O-I.0 — Pilot Evidence Pack & Client Demo Blueprint',
} as const;
