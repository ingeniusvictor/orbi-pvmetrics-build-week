const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CLIENT_PILOT_HANDOFF_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-client-pilot-handoff-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-K — Client Pilot Handoff & Safe Next Steps',
  module: '1O-K.4A — Client Pilot Handoff Final QA & Closure',
  internalVersion: '0.1O-K.4A-client-pilot-handoff-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel: 'BLOQUE 1O-K CERRADO — QA PASSED',

  completedLayers: [
    {
      id: '1O-K.0',
      label: 'Client Pilot Handoff & Safe Next Steps Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual para preparar entrega segura a cliente piloto, safe next steps, decision gates, blocked claims, readiness conditions y safety boundary.',
    },
    {
      id: '1O-K.1A',
      label: 'Client Pilot Handoff Types',
      status: 'completed',
      summary:
        'Tipos TypeScript para Client Handoff Sections, Allowed Pilot Materials, Blocked Pilot Claims, Readiness Conditions, Risk Register, Decision Gates y Handoff Pack.',
    },
    {
      id: '1O-K.1B',
      label: 'Client Pilot Handoff Mock Data',
      status: 'completed',
      summary:
        'Mock data local seguro para handoff cliente piloto, condiciones de readiness, revisión humana, riesgos, decision gates y próximos pasos seguros.',
    },
    {
      id: '1O-K.2A',
      label: 'Client Pilot Handoff Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual para mostrar secciones de handoff, materiales permitidos, claims bloqueados, condiciones piloto, risk register, decision gates y safe next steps.',
    },
    {
      id: '1O-K.2B',
      label: 'Safe Next Steps Export Text Box',
      status: 'completed',
      summary:
        'Export box local con resumen cliente y reporte interno de handoff copiables, sin PDF real, sin correo, sin backend y sin APIs.',
    },
    {
      id: '1O-K.3A',
      label: 'Client Pilot Handoff Wizard Integration',
      status: 'completed',
      summary:
        'Integración visual al wizard de Client Pilot Handoff Visual Card y Safe Next Steps Export Text Box usando mock data local.',
    },
  ],

  finalQaAssertions: [
    'Build correcto.',
    'TypeScript limpio.',
    'Bloque 1O-K opera solo con mock data local.',
    'Client Pilot Handoff Visual Card visible en wizard.',
    'Safe Next Steps Export Text Box visible en wizard.',
    'Client Handoff Sections visibles.',
    'Allowed Pilot Materials visibles.',
    'Blocked Pilot Claims visibles.',
    'Pilot Readiness Conditions visibles.',
    'Human Review Requirements incluidos en el pack.',
    'Read-Only Future Integration Conditions incluidos en el pack.',
    'Pilot Risk Register visible.',
    'Decision Gates visibles.',
    'Safe Next Steps visibles.',
    'Resumen cliente copiable.',
    'Reporte interno de handoff copiable.',
    'Safety Boundary visible.',
    'No existe PDF export real.',
    'No existen correos reales.',
    'No existe backend.',
    'No existen APIs externas.',
    'No existe localStorage.',
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

  clientPilotHandoffClosureRules: [
    'El handoff cliente piloto debe mantenerse como guía local, mock y read-only.',
    'Toda conversación cliente debe aclarar que ORBI PVMetrics IA no está conectado a sistemas reales.',
    'Todo resumen cliente debe evitar sobrepromesas comerciales u operacionales.',
    'Todo reporte interno debe declarar bloqueos, riesgos, decision gates y revisión humana obligatoria.',
    'Todo piloto futuro requiere alcance aprobado, contrato read-only, sanitización de datos y QA previo.',
    'Toda integración real futura queda fuera del bloque 1O-K y debe implementarse como roadmap separado.',
    'Toda capacidad de telecontrol, setpoints, BESS commands, inverter commands o SCADA ACK queda prohibida.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-K pertenece exclusivamente a ORBI PVMetrics IA.',
    'No se deben importar componentes, rutas, stores, providers o servicios de otros proyectos ORBI.',
    'Cualquier referencia cruzada debe detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
    'No PDF export real.',
    'No correos reales.',
    'No backend.',
    'No APIs externas.',
    'No localStorage.',
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
    'El bloque 1O-K queda cerrado como capa local, mock, read-only y segura para preparar la conversación de cliente piloto. El wizard ahora muestra el handoff completo, materiales permitidos, claims bloqueados, condiciones de readiness, riesgos, decision gates, próximos pasos seguros y textos copiables, sin PDF real, sin correo real, sin backend, sin APIs, sin conectores reales y sin impacto operacional.',

  nextRecommendedModule:
    '1O-L.0 — Standalone Client Demo Release Candidate Blueprint',
} as const;
