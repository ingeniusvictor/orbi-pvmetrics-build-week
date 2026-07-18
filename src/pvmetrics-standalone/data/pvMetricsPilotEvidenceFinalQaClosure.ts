const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_PILOT_EVIDENCE_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-pilot-evidence-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-I — Pilot Evidence Pack & Client Demo',
  module: '1O-I.4A — Pilot Evidence Final QA & Closure',
  internalVersion: '0.1O-I.4A-pilot-evidence-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel: 'BLOQUE 1O-I CERRADO — QA PASSED',

  completedLayers: [
    {
      id: '1O-I.0',
      label: 'Pilot Evidence Pack & Client Demo Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual del paquete de evidencia piloto y demo cliente, sin PDF real, sin correos, sin backend y sin conectores.',
    },
    {
      id: '1O-I.1A',
      label: 'Pilot Evidence Pack Types',
      status: 'completed',
      summary:
        'Tipos base para evidence pack, client demo pack, boundaries, checklist, summary y declaración de no integración real.',
    },
    {
      id: '1O-I.1B',
      label: 'Pilot Evidence Pack Mock Data',
      status: 'completed',
      summary:
        'Mock data local con categories, evidence items, readiness checklist, pilot boundaries, No Real Integration Statement y textos copiables.',
    },
    {
      id: '1O-I.2A',
      label: 'Client Demo Narrative Card',
      status: 'completed',
      summary:
        'Visual card de narrativa cliente con audiencia, secciones narrativas, disclaimers, evidence items, boundaries y client copy preview.',
    },
    {
      id: '1O-I.2B',
      label: 'Pilot Evidence Export Text Box',
      status: 'completed',
      summary:
        'Export box local con reporte interno y resumen cliente copiables, sin PDF, sin correos, sin backend y sin persistencia.',
    },
    {
      id: '1O-I.3A',
      label: 'Pilot Evidence Pack Wizard Integration',
      status: 'completed',
      summary:
        'Narrativa cliente y export text box integrados al wizard usando mock data local.',
    },
  ],

  finalQaAssertions: [
    'Build correcto.',
    'TypeScript limpio.',
    'Bloque 1O-I opera solo con mock data local.',
    'Client Demo Narrative Card visible en wizard.',
    'Pilot Evidence Export Text Box visible en wizard.',
    'Reporte interno copiable localmente.',
    'Resumen cliente copiable localmente.',
    'No Real Integration Statement visible.',
    'Safety Boundary visible.',
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
    'No existe localStorage agregado por este bloque.',
    'No existen POST/PUT/PATCH/DELETE reales.',
    'No existe telecontrol.',
    'No existen setpoints.',
    'No existen comandos BESS.',
    'No existen comandos inversores.',
    'No existen imports de otros proyectos ORBI.',
  ],

  pilotEvidenceClosureRules: [
    'Toda evidencia piloto debe permanecer local, mock y revisable.',
    'Todo texto copiable debe declarar que no existe integración real.',
    'Todo resumen cliente debe mantener lenguaje conceptual y no operacional.',
    'Toda futura exportación PDF debe implementarse como módulo separado y seguro.',
    'Todo futuro envío por correo debe implementarse como módulo separado y con confirmación humana.',
    'Toda integración real queda fuera del bloque 1O-I.',
    'Toda conversación cliente debe aclarar que el entorno no toca plantas reales.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-I pertenece exclusivamente a ORBI PVMetrics IA.',
    'No se deben importar componentes, rutas, stores, providers o servicios de otros proyectos ORBI.',
    'Cualquier referencia cruzada debe detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
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
    'No localStorage.',
    'No POST/PUT/PATCH/DELETE real.',
    'No telecontrol.',
    'No setpoints.',
    'No comandos BESS.',
    'No comandos inversores.',
  ],

  closureStatement:
    'El bloque 1O-I queda cerrado como capa de evidencia piloto y demo cliente local, mock, read-only y segura. Permite presentar narrativa, evidencia técnica, límites operacionales y textos copiables sin exportar PDF real, sin enviar correos, sin backend, sin conectores externos y sin impacto operacional.',

  nextRecommendedModule:
    '1O-J.0 — Local Demo Mode Hardening & Presentation Flow Blueprint',
} as const;
