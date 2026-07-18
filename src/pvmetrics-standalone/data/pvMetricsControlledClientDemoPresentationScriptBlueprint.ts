const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_BLUEPRINT = {
  id: 'pvmetrics-controlled-client-demo-presentation-script-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-V — Controlled Client Demo Presentation Script',
  module: '1O-V.0 — Controlled Client Demo Presentation Script Blueprint',
  internalVersion:
    '0.1O-V.0-controlled-client-demo-presentation-script-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_MEDIA_NO_REAL_DELIVERY',
  blueprintStatusLabel:
    'CLIENT DEMO PRESENTATION SCRIPT — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir una capa conceptual para preparar el guion seguro de presentación de ORBI PVMetrics IA ante cliente/stakeholder, sin grabar video real, sin crear audio real, sin crear avatar real, sin generar presentación real, sin enviar contenido real y sin ejecutar acciones externas.',

  clientDemoPresentationScriptPurpose: [
    'Preparar una narrativa clara para explicar qué es ORBI PVMetrics IA y qué problema resuelve.',
    'Ordenar la presentación en secciones seguras: contexto, dolor operativo, propuesta, demo local, límites y próximos pasos.',
    'Evitar claims productivos, regulatorios, oficiales u operacionales.',
    'Asegurar que todo discurso indique que la app es local, mock, read-only, demo-only y no productiva.',
    'Preparar una base para futuras tarjetas visuales, export text box y guion copiable.',
  ],

  allowedPresentationScriptItems: [
    {
      id: 'allowed-opening-script',
      label: 'Apertura conceptual',
      description:
        'Texto inicial para presentar el contexto y propósito de ORBI PVMetrics IA sin afirmar producción real.',
      requiresApproval: true,
    },
    {
      id: 'allowed-problem-framing',
      label: 'Planteamiento del problema',
      description:
        'Explicación segura del dolor operativo: dispersión de datos, forecast conceptual, readiness y análisis local.',
      requiresApproval: true,
    },
    {
      id: 'allowed-demo-flow',
      label: 'Flujo de demo local',
      description:
        'Secuencia conceptual de pantallas o módulos a mostrar, sin datos reales ni conexión externa.',
      requiresApproval: true,
    },
    {
      id: 'allowed-safety-disclaimers',
      label: 'Disclaimers de seguridad',
      description:
        'Mensajes obligatorios para aclarar que no hay SCADA real, CEN real, API real, telecontrol ni forecast oficial.',
      requiresApproval: true,
    },
    {
      id: 'allowed-next-steps',
      label: 'Próximos pasos humanos',
      description:
        'Cierre conceptual indicando revisión humana, validación de alcance y posibles pilotos read-only futuros.',
      requiresApproval: true,
    },
  ],

  blockedPresentationScriptItems: [
    {
      id: 'blocked-official-forecast-claim',
      label: 'Claim de forecast oficial',
      severity: 'critical',
      reason:
        'El guion no puede afirmar que PVMetrics genera pronósticos oficiales, regulatorios o enviados al CEN.',
      safeAlternative:
        'Explicar que la demo muestra lógica conceptual y escenarios mock no operacionales.',
    },
    {
      id: 'blocked-production-readiness-claim',
      label: 'Claim de producción lista',
      severity: 'critical',
      reason:
        'No se puede afirmar que la app está lista para producción, operación real o integración inmediata.',
      safeAlternative:
        'Indicar que es una demo local controlada con readiness conceptual.',
    },
    {
      id: 'blocked-real-client-data-reference',
      label: 'Referencia a datos reales de cliente/planta',
      severity: 'critical',
      reason:
        'No se puede mencionar trazabilidad real a clientes, plantas, activos, eventos o infraestructura.',
      safeAlternative:
        'Usar escenarios ficticios, mock data y lenguaje no identificable.',
    },
    {
      id: 'blocked-operational-command-claim',
      label: 'Claim de operación o telecontrol',
      severity: 'critical',
      reason:
        'No se puede afirmar que el sistema ejecuta comandos BESS, inversores, setpoints o SCADA ACK.',
      safeAlternative:
        'Indicar que la demo es read-only, sin comandos y sin control operacional.',
    },
    {
      id: 'blocked-real-media-export',
      label: 'Creación de video/audio/avatar real',
      severity: 'high',
      reason:
        'Este bloque no crea video real, audio real, voz real, avatar real ni presentación final.',
      safeAlternative:
        'Preparar únicamente guion textual conceptual para revisión humana.',
    },
  ],

  presentationScriptPrinciples: [
    {
      id: 'principle-script-only',
      label: 'Script-only',
      description:
        'El bloque solo prepara guion conceptual, sin crear video, audio, avatar, deck, PDF ni entrega real.',
      mandatory: true,
    },
    {
      id: 'principle-human-led-presentation',
      label: 'Presentación dirigida por humano',
      description:
        'Toda presentación real, grabación real o envío real debe ser ejecutado manualmente por un responsable humano.',
      mandatory: true,
    },
    {
      id: 'principle-safe-claims',
      label: 'Claims seguros',
      description:
        'El guion debe evitar promesas de producción, forecast oficial, integración real, cumplimiento regulatorio u operación real.',
      mandatory: true,
    },
    {
      id: 'principle-demo-only-language',
      label: 'Lenguaje demo-only',
      description:
        'Toda narrativa debe indicar que PVMetrics es local, mock, read-only, demo-only y no productivo.',
      mandatory: true,
    },
  ],

  presentationScriptSections: [
    {
      id: 'section-opening',
      label: 'Apertura',
      description:
        'Presentación breve del propósito de ORBI PVMetrics IA y del carácter demo-only.',
      recommendedDuration: '30-45 segundos',
    },
    {
      id: 'section-problem',
      label: 'Problema operativo',
      description:
        'Explicación del desafío conceptual: lectura, forecast, análisis, readiness y reportabilidad.',
      recommendedDuration: '60-90 segundos',
    },
    {
      id: 'section-solution',
      label: 'Solución propuesta',
      description:
        'Explicación de la plataforma como demo local de inteligencia FV/O&M conceptual.',
      recommendedDuration: '90-120 segundos',
    },
    {
      id: 'section-demo-walkthrough',
      label: 'Recorrido demo',
      description:
        'Secuencia segura de módulos visibles en el wizard, sin datos reales ni acciones externas.',
      recommendedDuration: '3-5 minutos',
    },
    {
      id: 'section-boundaries',
      label: 'Límites y seguridad',
      description:
        'Declaración explícita de no producción, no SCADA, no CEN, no APIs, no telecontrol y no reporte regulatorio.',
      recommendedDuration: '60 segundos',
    },
    {
      id: 'section-next-steps',
      label: 'Próximos pasos',
      description:
        'Cierre con revisión humana, validación de alcance y posible piloto read-only futuro.',
      recommendedDuration: '45-60 segundos',
    },
  ],

  presentationScriptTimingBlocks: [
    {
      id: 'timing-short-demo',
      label: 'Demo corta',
      duration: '5 minutos',
      description:
        'Versión ejecutiva breve para explicar problema, solución, límites y próximos pasos.',
    },
    {
      id: 'timing-standard-demo',
      label: 'Demo estándar',
      duration: '10-12 minutos',
      description:
        'Versión balanceada para mostrar narrativa, visuales principales, export local y safety gates.',
    },
    {
      id: 'timing-technical-demo',
      label: 'Demo técnica',
      duration: '15-20 minutos',
      description:
        'Versión extendida para revisar módulos, QA, boundaries, restricciones y roadmap.',
    },
  ],

  presentationScriptSpeakerNotes: [
    'Aclarar desde el inicio que se trata de una demo local, mock, read-only y no productiva.',
    'No mencionar datos reales, clientes reales, plantas reales, activos reales ni infraestructura real.',
    'No afirmar forecast oficial, envío CEN, cumplimiento regulatorio ni integración real.',
    'No prometer telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
    'Explicar que la demo busca validar valor, narrativa, seguridad y posible alcance futuro.',
    'Cerrar indicando que cualquier siguiente paso real requiere revisión humana, autorización y alcance separado.',
  ],

  presentationScriptSafetyDisclaimers: [
    'Esta presentación es conceptual y demo-only.',
    'ORBI PVMetrics IA no está conectada a SCADA, medidores, CEN, APIs reales ni sistemas productivos.',
    'La información mostrada es mock/local y no representa datos reales de cliente, planta, activo o infraestructura.',
    'La demo no ejecuta telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
    'La demo no constituye forecast oficial, reporte regulatorio ni herramienta operacional productiva.',
    'Cualquier piloto futuro deberá definirse como read-only, controlado y aprobado por responsables humanos.',
  ],

  presentationScriptApprovalRoles: [
    {
      id: 'approval-demo-owner',
      label: 'Demo Owner',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Aprueba narrativa, tiempos, secuencia de presentación y mensajes de cierre.',
    },
    {
      id: 'approval-qa-owner',
      label: 'QA Owner',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Aprueba que el guion no contradiga el estado técnico, build, TypeScript, QA ni roadmap.',
    },
    {
      id: 'approval-security-owner',
      label: 'Security Owner',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Aprueba disclaimers, ausencia de datos reales, credenciales, endpoints e infraestructura.',
    },
    {
      id: 'approval-business-owner',
      label: 'Business Owner',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Aprueba el enfoque comercial si la presentación será externa.',
    },
  ],

  presentationScriptRiskRegister: [
    {
      id: 'risk-overpromising',
      label: 'Sobrepromesa comercial',
      severity: 'high',
      mitigation:
        'Usar lenguaje demo-only y evitar afirmar producción, integración real, forecast oficial o reporte regulatorio.',
    },
    {
      id: 'risk-sensitive-reference',
      label: 'Referencia sensible accidental',
      severity: 'critical',
      mitigation:
        'Bloquear mención de clientes reales, plantas reales, activos reales, endpoints, credenciales o infraestructura.',
    },
    {
      id: 'risk-demo-confused-with-operation',
      label: 'Demo confundida con operación real',
      severity: 'critical',
      mitigation:
        'Repetir que la demo es local, mock, read-only y sin telecontrol.',
    },
    {
      id: 'risk-real-media-assumption',
      label: 'Asumir video/audio/deck real',
      severity: 'medium',
      mitigation:
        'Aclarar que este bloque solo prepara guion textual conceptual, no material audiovisual final.',
    },
  ],

  presentationScriptExitCriteria: [
    'Blueprint de Presentation Script creado.',
    'Client Demo Presentation Script Purpose declarado.',
    'Allowed Presentation Script Items declarados.',
    'Blocked Presentation Script Items declarados.',
    'Presentation Script Principles declarados.',
    'Presentation Script Sections declaradas.',
    'Presentation Script Timing Blocks declarados.',
    'Presentation Script Speaker Notes declaradas.',
    'Presentation Script Safety Disclaimers declarados.',
    'Presentation Script Approval Roles declarados.',
    'Presentation Script Risk Register declarado.',
    'Presentation Script Exit Criteria declarado.',
    'Presentation Script Boundary declarado.',
    'No se graba video real.',
    'No se crea audio real.',
    'No se crea avatar real.',
    'No se crea deck real.',
    'No se crea PDF real.',
    'No se envía contenido real.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  presentationScriptBoundary:
    'Este blueprint solo define un guion conceptual de presentación demo. No graba video real, no crea audio real, no crea voz real, no crea avatar real, no crea presentación PowerPoint real, no crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',

  nextRoadmap: [
    '1O-V.1A — Client Demo Presentation Script Types',
    '1O-V.1B — Client Demo Presentation Script Mock Data',
    '1O-V.2A — Client Demo Presentation Script Visual Card',
    '1O-V.2B — Client Demo Presentation Script Export Text Box',
    '1O-V.3A — Client Demo Presentation Script Wizard Integration',
    '1O-V.4A — Client Demo Presentation Script Final QA & Closure',
  ],

  nextRecommendedModule:
    '1O-V.1A — Client Demo Presentation Script Types',
} as const;
