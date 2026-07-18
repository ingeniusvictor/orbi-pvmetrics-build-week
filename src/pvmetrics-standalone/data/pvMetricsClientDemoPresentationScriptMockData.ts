import {
  PVMetricsAllowedPresentationScriptItem,
  PVMetricsBlockedPresentationScriptItem,
  PVMetricsControlledClientDemoPresentationScriptPack,
  PVMetricsPresentationScriptApprovalRole,
  PVMetricsPresentationScriptExitCriterion,
  PVMetricsPresentationScriptPrinciple,
  PVMetricsPresentationScriptRiskRegisterItem,
  PVMetricsPresentationScriptSafetyDisclaimer,
  PVMetricsPresentationScriptSection,
  PVMetricsPresentationScriptSpeakerNote,
  PVMetricsPresentationScriptTimingBlock,
} from '../types/pvmetrics-client-demo-presentation-script.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-V.1B-client-demo-presentation-script-mock-data';

export const PV_METRICS_CLIENT_DEMO_PRESENTATION_SCRIPT_PURPOSE_MOCK: string[] =
  [
    'Preparar un guion conceptual y seguro para presentar ORBI PVMetrics IA ante cliente o stakeholder.',
    'Ordenar la narrativa de la demo en apertura, problema, solución, recorrido, límites y próximos pasos.',
    'Evitar claims de producción, forecast oficial, reporte regulatorio, integración real u operación real.',
    'Reforzar que toda la presentación describe una app local, mock, read-only, demo-only y no productiva.',
    'Crear una base para futura tarjeta visual, export text box y guion copiable sin generar video, audio, avatar, deck ni entrega real.',
  ];

export const PV_METRICS_ALLOWED_PRESENTATION_SCRIPT_ITEMS_MOCK: PVMetricsAllowedPresentationScriptItem[] =
  [
    {
      itemId: 'allowed-opening-script',
      label: 'Apertura conceptual',
      itemType: 'allowed-presentation-script-item',
      description:
        'Texto inicial para presentar el contexto, propósito y alcance demo-only de ORBI PVMetrics IA sin afirmar producción real.',
      scriptMode: 'opening',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-problem-framing',
      label: 'Planteamiento del problema',
      itemType: 'allowed-presentation-script-item',
      description:
        'Explicación segura del dolor operativo: dispersión de datos, forecast conceptual, readiness, análisis local y reportabilidad demo.',
      scriptMode: 'problem-framing',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-solution-overview',
      label: 'Resumen de solución',
      itemType: 'allowed-presentation-script-item',
      description:
        'Descripción conceptual de la propuesta de valor, manteniendo claro que no existe operación productiva ni integración real.',
      scriptMode: 'solution-overview',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-demo-flow',
      label: 'Flujo de demo local',
      itemType: 'allowed-presentation-script-item',
      description:
        'Secuencia conceptual de pantallas o módulos a mostrar dentro de la app, sin datos reales ni conexión externa.',
      scriptMode: 'demo-walkthrough',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-safety-disclaimers',
      label: 'Disclaimers de seguridad',
      itemType: 'allowed-presentation-script-item',
      description:
        'Mensajes obligatorios para aclarar que no hay SCADA real, CEN real, API real, telecontrol ni forecast oficial.',
      scriptMode: 'safety-disclaimer',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-technical-review',
      label: 'Revisión técnica controlada',
      itemType: 'allowed-presentation-script-item',
      description:
        'Puntos para explicar QA, límites, módulos cerrados, aislamiento local y ausencia de acciones externas reales.',
      scriptMode: 'technical-review',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-next-steps',
      label: 'Próximos pasos humanos',
      itemType: 'allowed-presentation-script-item',
      description:
        'Cierre conceptual indicando revisión humana, validación de alcance y posibles pilotos read-only futuros.',
      scriptMode: 'next-steps',
      requiresApproval: true,
    },
  ];

export const PV_METRICS_BLOCKED_PRESENTATION_SCRIPT_ITEMS_MOCK: PVMetricsBlockedPresentationScriptItem[] =
  [
    {
      itemId: 'blocked-official-forecast-claim',
      label: 'Claim de forecast oficial',
      itemType: 'blocked-presentation-script-item',
      severity: 'critical',
      reason:
        'El guion no puede afirmar que PVMetrics genera pronósticos oficiales, regulatorios o enviados al CEN.',
      safeAlternative:
        'Explicar que la demo muestra lógica conceptual y escenarios mock no operacionales.',
    },
    {
      itemId: 'blocked-production-readiness-claim',
      label: 'Claim de producción lista',
      itemType: 'blocked-presentation-script-item',
      severity: 'critical',
      reason:
        'No se puede afirmar que la app está lista para producción, operación real o integración inmediata.',
      safeAlternative:
        'Indicar que es una demo local controlada con readiness conceptual.',
    },
    {
      itemId: 'blocked-real-client-data-reference',
      label: 'Referencia a datos reales de cliente o planta',
      itemType: 'blocked-presentation-script-item',
      severity: 'critical',
      reason:
        'No se puede mencionar trazabilidad real a clientes, plantas, activos, eventos, medidores o infraestructura.',
      safeAlternative:
        'Usar escenarios ficticios, mock data y lenguaje no identificable.',
    },
    {
      itemId: 'blocked-operational-command-claim',
      label: 'Claim de operación o telecontrol',
      itemType: 'blocked-presentation-script-item',
      severity: 'critical',
      reason:
        'No se puede afirmar que el sistema ejecuta comandos BESS, inversores, setpoints, SCADA ACK o telecontrol.',
      safeAlternative:
        'Indicar que la demo es read-only, sin comandos y sin control operacional.',
    },
    {
      itemId: 'blocked-real-media-export',
      label: 'Creación de video, audio, avatar o deck real',
      itemType: 'blocked-presentation-script-item',
      severity: 'high',
      reason:
        'Este bloque no crea video real, audio real, voz real, avatar real, PowerPoint real ni presentación final.',
      safeAlternative:
        'Preparar únicamente guion textual conceptual para revisión humana.',
    },
    {
      itemId: 'blocked-regulatory-report-claim',
      label: 'Claim de reporte regulatorio',
      itemType: 'blocked-presentation-script-item',
      severity: 'critical',
      reason:
        'No se puede afirmar que la demo genera informes regulatorios válidos, reportes CEN o cumplimiento normativo productivo.',
      safeAlternative:
        'Presentar los reportes como ejemplos conceptuales locales no regulatorios.',
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_PRINCIPLES_MOCK: PVMetricsPresentationScriptPrinciple[] =
  [
    {
      principleId: 'principle-script-only',
      label: 'Script-only',
      itemType: 'presentation-script-principle',
      description:
        'El bloque solo prepara guion conceptual, sin crear video, audio, avatar, deck, PDF ni entrega real.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-led-presentation',
      label: 'Presentación dirigida por humano',
      itemType: 'presentation-script-principle',
      description:
        'Toda presentación real, grabación real, publicación o envío real debe ser ejecutado manualmente por un responsable humano.',
      mandatory: true,
    },
    {
      principleId: 'principle-safe-claims',
      label: 'Claims seguros',
      itemType: 'presentation-script-principle',
      description:
        'El guion debe evitar promesas de producción, forecast oficial, integración real, cumplimiento regulatorio u operación real.',
      mandatory: true,
    },
    {
      principleId: 'principle-demo-only-language',
      label: 'Lenguaje demo-only',
      itemType: 'presentation-script-principle',
      description:
        'Toda narrativa debe indicar que PVMetrics es local, mock, read-only, demo-only y no productivo.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-identifiable-real-data',
      label: 'Sin datos reales identificables',
      itemType: 'presentation-script-principle',
      description:
        'El guion debe evitar clientes reales, plantas reales, activos reales, endpoints, credenciales, eventos reales o infraestructura real.',
      mandatory: true,
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_SECTIONS_MOCK: PVMetricsPresentationScriptSection[] =
  [
    {
      sectionId: 'section-opening',
      label: 'Apertura',
      itemType: 'presentation-script-section',
      scriptMode: 'opening',
      description:
        'Presentación breve del propósito de ORBI PVMetrics IA y del carácter demo-only.',
      recommendedDuration: '30-45 segundos',
    },
    {
      sectionId: 'section-problem',
      label: 'Problema operativo',
      itemType: 'presentation-script-section',
      scriptMode: 'problem-framing',
      description:
        'Explicación del desafío conceptual: lectura, forecast, análisis, readiness y reportabilidad.',
      recommendedDuration: '60-90 segundos',
    },
    {
      sectionId: 'section-solution',
      label: 'Solución propuesta',
      itemType: 'presentation-script-section',
      scriptMode: 'solution-overview',
      description:
        'Explicación de la plataforma como demo local de inteligencia FV/O&M conceptual.',
      recommendedDuration: '90-120 segundos',
    },
    {
      sectionId: 'section-demo-walkthrough',
      label: 'Recorrido demo',
      itemType: 'presentation-script-section',
      scriptMode: 'demo-walkthrough',
      description:
        'Secuencia segura de módulos visibles en el wizard, sin datos reales ni acciones externas.',
      recommendedDuration: '3-5 minutos',
    },
    {
      sectionId: 'section-technical-review',
      label: 'Revisión técnica',
      itemType: 'presentation-script-section',
      scriptMode: 'technical-review',
      description:
        'Explicación de QA, módulos cerrados, boundaries, aislamiento y restricciones de no producción.',
      recommendedDuration: '2-3 minutos',
    },
    {
      sectionId: 'section-boundaries',
      label: 'Límites y seguridad',
      itemType: 'presentation-script-section',
      scriptMode: 'safety-disclaimer',
      description:
        'Declaración explícita de no producción, no SCADA, no CEN, no APIs, no telecontrol y no reporte regulatorio.',
      recommendedDuration: '60 segundos',
    },
    {
      sectionId: 'section-next-steps',
      label: 'Próximos pasos',
      itemType: 'presentation-script-section',
      scriptMode: 'next-steps',
      description:
        'Cierre con revisión humana, validación de alcance y posible piloto read-only futuro.',
      recommendedDuration: '45-60 segundos',
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_TIMING_BLOCKS_MOCK: PVMetricsPresentationScriptTimingBlock[] =
  [
    {
      timingId: 'timing-short-demo',
      label: 'Demo corta',
      itemType: 'presentation-script-timing-block',
      duration: '5 minutos',
      description:
        'Versión ejecutiva breve para explicar problema, solución, límites y próximos pasos.',
    },
    {
      timingId: 'timing-standard-demo',
      label: 'Demo estándar',
      itemType: 'presentation-script-timing-block',
      duration: '10-12 minutos',
      description:
        'Versión balanceada para mostrar narrativa, visuales principales, export local y safety gates.',
    },
    {
      timingId: 'timing-technical-demo',
      label: 'Demo técnica',
      itemType: 'presentation-script-timing-block',
      duration: '15-20 minutos',
      description:
        'Versión extendida para revisar módulos, QA, boundaries, restricciones y roadmap.',
    },
    {
      timingId: 'timing-executive-snapshot',
      label: 'Snapshot ejecutivo',
      itemType: 'presentation-script-timing-block',
      duration: '2-3 minutos',
      description:
        'Versión ultra breve para introducir valor, estado demo-only y condición de piloto futuro read-only.',
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_SPEAKER_NOTES_MOCK: PVMetricsPresentationScriptSpeakerNote[] =
  [
    {
      noteId: 'speaker-note-opening-demo-only',
      label: 'Aclaración inicial demo-only',
      itemType: 'presentation-script-speaker-note',
      scriptMode: 'opening',
      note:
        'Antes de mostrar cualquier pantalla, indicar que ORBI PVMetrics IA es una demo local, mock, read-only, no productiva y sin conexión a sistemas reales.',
      mandatory: true,
    },
    {
      noteId: 'speaker-note-problem-framing',
      label: 'Problema explicado sin datos reales',
      itemType: 'presentation-script-speaker-note',
      scriptMode: 'problem-framing',
      note:
        'Explicar el problema operativo de forma general: dispersión de datos, necesidad de análisis, forecast conceptual y reportabilidad, sin nombrar clientes, plantas ni activos reales.',
      mandatory: true,
    },
    {
      noteId: 'speaker-note-solution-overview',
      label: 'Solución como propuesta conceptual',
      itemType: 'presentation-script-speaker-note',
      scriptMode: 'solution-overview',
      note:
        'Presentar PVMetrics como una propuesta de inteligencia FV/O&M conceptual, no como producto final, no como integración real y no como herramienta regulatoria.',
      mandatory: true,
    },
    {
      noteId: 'speaker-note-demo-walkthrough',
      label: 'Recorrido de módulos seguros',
      itemType: 'presentation-script-speaker-note',
      scriptMode: 'demo-walkthrough',
      note:
        'Durante el recorrido, reforzar que los módulos usan mock data local, no leen SCADA, no leen medidores, no llaman APIs reales y no ejecutan acciones externas.',
      mandatory: true,
    },
    {
      noteId: 'speaker-note-safety-boundary',
      label: 'Boundary de seguridad',
      itemType: 'presentation-script-speaker-note',
      scriptMode: 'safety-disclaimer',
      note:
        'Declarar explícitamente que la demo no envía CEN, no controla inversores, no controla BESS, no modifica setpoints y no ejecuta SCADA ACK.',
      mandatory: true,
    },
    {
      noteId: 'speaker-note-next-steps',
      label: 'Cierre con próximos pasos humanos',
      itemType: 'presentation-script-speaker-note',
      scriptMode: 'next-steps',
      note:
        'Cerrar indicando que cualquier piloto futuro debe ser read-only, controlado, aprobado por responsables humanos y definido en un alcance separado.',
      mandatory: true,
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_SAFETY_DISCLAIMERS_MOCK: PVMetricsPresentationScriptSafetyDisclaimer[] =
  [
    {
      disclaimerId: 'disclaimer-conceptual-demo-only',
      label: 'Demo conceptual',
      itemType: 'presentation-script-safety-disclaimer',
      disclaimer:
        'Esta presentación es conceptual y demo-only. No representa una operación productiva ni un sistema conectado a infraestructura real.',
      mandatory: true,
    },
    {
      disclaimerId: 'disclaimer-no-real-systems',
      label: 'Sin sistemas reales',
      itemType: 'presentation-script-safety-disclaimer',
      disclaimer:
        'ORBI PVMetrics IA no está conectada a SCADA, medidores, CEN, APIs reales, bases de datos productivas ni sistemas operacionales.',
      mandatory: true,
    },
    {
      disclaimerId: 'disclaimer-no-real-data',
      label: 'Sin datos reales',
      itemType: 'presentation-script-safety-disclaimer',
      disclaimer:
        'La información mostrada es mock/local y no representa datos reales de cliente, planta, activo, evento o infraestructura.',
      mandatory: true,
    },
    {
      disclaimerId: 'disclaimer-no-telecontrol',
      label: 'Sin telecontrol',
      itemType: 'presentation-script-safety-disclaimer',
      disclaimer:
        'La demo no ejecuta telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
      mandatory: true,
    },
    {
      disclaimerId: 'disclaimer-no-official-forecast',
      label: 'Sin forecast oficial',
      itemType: 'presentation-script-safety-disclaimer',
      disclaimer:
        'La demo no constituye forecast oficial, reporte regulatorio, envío CEN ni herramienta operacional productiva.',
      mandatory: true,
    },
    {
      disclaimerId: 'disclaimer-human-approval',
      label: 'Revisión humana requerida',
      itemType: 'presentation-script-safety-disclaimer',
      disclaimer:
        'Cualquier piloto futuro deberá definirse como read-only, controlado y aprobado por responsables humanos.',
      mandatory: true,
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_APPROVAL_ROLES_MOCK: PVMetricsPresentationScriptApprovalRole[] =
  [
    {
      approvalId: 'approval-demo-owner',
      label: 'Demo Owner',
      itemType: 'presentation-script-approval-role',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Aprueba narrativa, tiempos, secuencia de presentación, lenguaje demo-only y mensajes de cierre.',
    },
    {
      approvalId: 'approval-qa-owner',
      label: 'QA Owner',
      itemType: 'presentation-script-approval-role',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Aprueba que el guion no contradiga estado técnico, build, TypeScript, QA, módulos cerrados ni roadmap.',
    },
    {
      approvalId: 'approval-security-owner',
      label: 'Security Owner',
      itemType: 'presentation-script-approval-role',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Aprueba disclaimers, ausencia de datos reales, credenciales, endpoints, infraestructura y trazabilidad sensible.',
    },
    {
      approvalId: 'approval-technical-owner',
      label: 'Technical Owner',
      itemType: 'presentation-script-approval-role',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Aprueba que el guion describa correctamente arquitectura local, aislamiento, mock data y ausencia de acciones externas.',
    },
    {
      approvalId: 'approval-business-owner',
      label: 'Business Owner',
      itemType: 'presentation-script-approval-role',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Aprueba el enfoque comercial si la presentación será externa o frente a stakeholder cliente.',
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_RISK_REGISTER_MOCK: PVMetricsPresentationScriptRiskRegisterItem[] =
  [
    {
      riskId: 'risk-overpromising',
      label: 'Sobrepromesa comercial',
      itemType: 'presentation-script-risk-register-item',
      severity: 'high',
      mitigation:
        'Usar lenguaje demo-only y evitar afirmar producción, integración real, forecast oficial, envío CEN o reporte regulatorio.',
    },
    {
      riskId: 'risk-sensitive-reference',
      label: 'Referencia sensible accidental',
      itemType: 'presentation-script-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear mención de clientes reales, plantas reales, activos reales, endpoints, credenciales, IPs, rutas internas o infraestructura.',
    },
    {
      riskId: 'risk-demo-confused-with-operation',
      label: 'Demo confundida con operación real',
      itemType: 'presentation-script-risk-register-item',
      severity: 'critical',
      mitigation:
        'Repetir que la demo es local, mock, read-only, no productiva y sin telecontrol.',
    },
    {
      riskId: 'risk-real-media-assumption',
      label: 'Asumir video, audio, avatar o deck real',
      itemType: 'presentation-script-risk-register-item',
      severity: 'medium',
      mitigation:
        'Aclarar que este bloque solo prepara guion textual conceptual, no material audiovisual final.',
    },
    {
      riskId: 'risk-regulatory-misinterpretation',
      label: 'Interpretación regulatoria incorrecta',
      itemType: 'presentation-script-risk-register-item',
      severity: 'critical',
      mitigation:
        'Incluir disclaimer de no forecast oficial, no reporte regulatorio, no envío CEN y no cumplimiento productivo.',
    },
  ];

export const PV_METRICS_PRESENTATION_SCRIPT_EXIT_CRITERIA_MOCK: PVMetricsPresentationScriptExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Controlled Client Demo Presentation Script están implementados.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'El mock data local queda poblado con purpose, allowed/blocked items, principles, sections, timing, notes, disclaimers, approvals, risks y boundary.',
    },
    {
      criterionId: 'exit-no-real-media',
      label: 'Sin media real',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea video real, audio real, voz real, avatar real, PowerPoint real ni material audiovisual final.',
    },
    {
      criterionId: 'exit-no-real-delivery',
      label: 'Sin entrega externa real',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se envían emails, reuniones, links, invitaciones, PDF, ZIP, APK ni release productiva.',
    },
    {
      criterionId: 'exit-safe-claims',
      label: 'Claims seguros',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'El guion evita producción real, integración real, forecast oficial, reporte regulatorio, envío CEN y operación real.',
    },
    {
      criterionId: 'exit-no-real-data',
      label: 'Sin datos reales',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'El guion no incorpora clientes reales, plantas reales, activos reales, endpoints, credenciales ni infraestructura real.',
    },
    {
      criterionId: 'exit-script-boundary',
      label: 'Presentation Script Boundary declarado',
      itemType: 'presentation-script-exit-criterion',
      required: true,
      passed: true,
      description:
        'El límite de seguridad queda declarado dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK: PVMetricsControlledClientDemoPresentationScriptPack =
  {
    packId: 'pvmetrics-controlled-client-demo-presentation-script-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-V — Controlled Client Demo Presentation Script',
    module: '1O-V.1B — Client Demo Presentation Script Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    clientDemoPresentationScriptPurpose:
      PV_METRICS_CLIENT_DEMO_PRESENTATION_SCRIPT_PURPOSE_MOCK,
    allowedPresentationScriptItems:
      PV_METRICS_ALLOWED_PRESENTATION_SCRIPT_ITEMS_MOCK,
    blockedPresentationScriptItems:
      PV_METRICS_BLOCKED_PRESENTATION_SCRIPT_ITEMS_MOCK,
    presentationScriptPrinciples:
      PV_METRICS_PRESENTATION_SCRIPT_PRINCIPLES_MOCK,
    presentationScriptSections: PV_METRICS_PRESENTATION_SCRIPT_SECTIONS_MOCK,
    presentationScriptTimingBlocks:
      PV_METRICS_PRESENTATION_SCRIPT_TIMING_BLOCKS_MOCK,
    presentationScriptSpeakerNotes:
      PV_METRICS_PRESENTATION_SCRIPT_SPEAKER_NOTES_MOCK,
    presentationScriptSafetyDisclaimers:
      PV_METRICS_PRESENTATION_SCRIPT_SAFETY_DISCLAIMERS_MOCK,
    presentationScriptApprovalRoles:
      PV_METRICS_PRESENTATION_SCRIPT_APPROVAL_ROLES_MOCK,
    presentationScriptRiskRegister:
      PV_METRICS_PRESENTATION_SCRIPT_RISK_REGISTER_MOCK,
    presentationScriptExitCriteria:
      PV_METRICS_PRESENTATION_SCRIPT_EXIT_CRITERIA_MOCK,
    presentationScriptBoundary:
      'Controlled Client Demo Presentation Script mock data. Todo es local, conceptual, script-only, demo-only, read-only y no productivo. No graba video real, no crea audio real, no crea voz real, no crea avatar real, no crea PowerPoint real, no crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',
    nextRecommendedModule:
      '1O-V.2A — Client Demo Presentation Script Visual Card',
  };

