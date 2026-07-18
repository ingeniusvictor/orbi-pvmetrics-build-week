const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_LOCAL_DEMO_PACKAGE_FINAL_QA_CLOSURE = {
  id: 'pvmetrics-local-demo-package-final-qa-closure',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-M — Local Demo Package Assembly & Operator Sign-Off',
  module: '1O-M.4A — Local Demo Package Final QA & Closure',
  internalVersion: '0.1O-M.4A-local-demo-package-final-qa-closure',
  generatedAtLabel: getGeneratedAtLabel(),

  closureStatus: 'CLOSED_QA_PASSED',
  closureStatusLabel:
    'BLOQUE 1O-M CERRADO — LOCAL DEMO PACKAGE QA PASSED',

  completedLayers: [
    {
      id: '1O-M.0',
      label: 'Local Demo Package Assembly & Operator Sign-Off Blueprint',
      status: 'completed',
      summary:
        'Blueprint conceptual para preparar ensamblaje local de paquete demo, contenidos permitidos, artefactos reales bloqueados, firma humana operador/revisor, riesgos y gates humanos.',
    },
    {
      id: '1O-M.1A',
      label: 'Local Demo Package Types',
      status: 'completed',
      summary:
        'Tipos TypeScript para Local Demo Package Status, Checklist Status, Risk Severity, Reviewer Role, contenidos, artefactos bloqueados, preflight, reviewer checklist, gates, riesgos y pack de ensamblaje.',
    },
    {
      id: '1O-M.1B',
      label: 'Local Demo Package Mock Data',
      status: 'completed',
      summary:
        'Mock data local seguro para contenidos permitidos, artefactos bloqueados, sign-off scope, preflight, reviewer checklist, environment assumptions, gates, riesgos y exit criteria.',
    },
    {
      id: '1O-M.2A',
      label: 'Operator Sign-Off Visual Card',
      status: 'completed',
      summary:
        'Tarjeta visual para mostrar paquete demo local, artefactos bloqueados, preflight operador, revisión humana, supuestos de entorno, riesgos, criterios de salida y Safety Boundary.',
    },
    {
      id: '1O-M.2B',
      label: 'Local Demo Package Assembly Export Text Box',
      status: 'completed',
      summary:
        'Export box local con resumen de paquete demo y reporte interno de ensamblaje/sign-off copiables en texto plano, sin ZIP/APK/PDF real, sin firma digital real y sin acciones externas.',
    },
    {
      id: '1O-M.3A',
      label: 'Local Demo Package Wizard Integration',
      status: 'completed',
      summary:
        'Integración visual al wizard de Operator Sign-Off Visual Card y Local Demo Package Assembly Export Text Box usando mock data local.',
    },
  ],

  finalQaAssertions: [
    'Build correcto.',
    'TypeScript limpio.',
    'Bloque 1O-M opera solo con mock data local.',
    'Operator Sign-Off Visual Card visible en wizard.',
    'Local Demo Package Assembly Export Text Box visible en wizard.',
    'Local Demo Package Assembly Pack usado localmente.',
    'Local Demo Package Contents visibles.',
    'Blocked Real Release Artifacts visibles.',
    'Operator Sign-Off Scope visible.',
    'Operator Preflight Checklist visible.',
    'Reviewer Sign-Off Checklist visible.',
    'Demo Environment Assumptions visibles.',
    'Human Approval Gates visibles.',
    'Assembly Risks visibles.',
    'Assembly Exit Criteria visibles.',
    'Resumen paquete demo local copiable.',
    'Reporte interno de ensamblaje y sign-off copiable.',
    'Safety Boundary visible.',
    'No existe ZIP real.',
    'No existe APK real.',
    'No existe PDF export real.',
    'No existe firma digital real.',
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
    'No existe producción real habilitada.',
    'No existe artefacto release real.',
    'No existen imports de otros proyectos ORBI.',
  ],

  localDemoPackageClosureRules: [
    'El bloque 1O-M queda congelado como ensamblaje local conceptual, mock, read-only y no productivo.',
    'Toda presentación debe aclarar que no existe ZIP/APK/PDF real generado por este bloque.',
    'Toda firma mostrada o referenciada en 1O-M corresponde a sign-off humano administrativo/conceptual, no a firma digital criptográfica real.',
    'Todo resumen paquete demo local debe indicar que no existen backend, APIs, conectores reales ni artefactos productivos.',
    'Todo reporte interno debe declarar contenidos permitidos, artefactos bloqueados, preflight, reviewer checklist, assumptions, gates, risks y exit criteria.',
    'Todo uso externo requiere revisión humana previa de textos copiables y claims comerciales.',
    'Todo artefacto real futuro queda fuera de 1O-M y debe implementarse como roadmap separado.',
    'Todo telecontrol, setpoint, BESS command, inverter command o SCADA ACK queda prohibido.',
  ],

  antiMixClosureRules: [
    'El bloque 1O-M pertenece exclusivamente a ORBI PVMetrics IA.',
    'No se deben importar componentes, rutas, stores, providers o servicios de otros proyectos ORBI.',
    'Cualquier referencia cruzada debe detener implementación y reportar POSIBLE MEZCLA DE PROYECTOS.',
  ],

  safetyBoundaries: [
    'No ZIP real.',
    'No APK real.',
    'No PDF export real.',
    'No firma digital real.',
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
    'No producción real.',
    'No artefacto release real.',
  ],

  closureStatement:
    'El bloque 1O-M queda cerrado como capa local, mock, read-only y no productiva para ensamblaje conceptual de paquete demo y sign-off humano operador/revisor. El wizard ahora muestra contenidos permitidos, artefactos reales bloqueados, preflight operador, checklist revisor, supuestos de entorno, gates humanos, riesgos, criterios de salida y textos copiables, sin ZIP/APK/PDF real, sin firma digital real, sin correos, sin backend, sin APIs, sin conectores reales y sin impacto operacional.',

  nextRecommendedModule:
    '1O-N.0 — Controlled Client Demo Session Runbook Blueprint',
} as const;
