const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CLIENT_PILOT_HANDOFF_SAFE_NEXT_STEPS_BLUEPRINT = {
  id: 'pvmetrics-client-pilot-handoff-safe-next-steps-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-K — Client Pilot Handoff & Safe Next Steps',
  module: '1O-K.0 — Client Pilot Handoff & Safe Next Steps Blueprint',
  internalVersion:
    '0.1O-K.0-client-pilot-handoff-safe-next-steps-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_CLIENT_DELIVERY_RUNTIME',
  blueprintStatusLabel:
    'CLIENT PILOT HANDOFF — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Preparar una estructura conceptual para entregar ORBI PVMetrics IA a conversación de cliente piloto de forma segura, trazable y sin promesas operacionales. Este blueprint define qué se puede mostrar, qué debe quedar bloqueado y qué condiciones mínimas deben existir antes de cualquier piloto real.',

  clientHandoffSections: [
    {
      id: 'handoff-context',
      label: 'Contexto del prototipo',
      objective:
        'Explicar que ORBI PVMetrics IA es una app independiente, local, mock, read-only y preparada para demo segura.',
      clientMessage:
        'La solución se presenta como prototipo avanzado para evaluar valor, flujo de trabajo y condiciones de un piloto futuro.',
    },
    {
      id: 'handoff-capabilities',
      label: 'Capacidades demostrables',
      objective:
        'Mostrar wizard, sandbox, evidence pack, demo flow, safety locks y reportes copiables.',
      clientMessage:
        'La demo permite revisar la experiencia y el enfoque de seguridad sin conectarse a sistemas reales.',
    },
    {
      id: 'handoff-boundaries',
      label: 'Límites de seguridad',
      objective:
        'Declarar explícitamente que no existe conexión a SCADA, medidores, CEN, clima, backend, correo ni telecontrol.',
      clientMessage:
        'La demo no opera plantas reales, no envía datos externos y no modifica ningún sistema operacional.',
    },
    {
      id: 'handoff-pilot-path',
      label: 'Ruta hacia piloto seguro',
      objective:
        'Definir pasos mínimos para una futura evaluación piloto read-only aprobada.',
      clientMessage:
        'Cualquier piloto real requiere aprobación formal, alcance limitado, contrato read-only y revisión humana.',
    },
  ],

  allowedPilotMaterials: [
    'Wizard local de ORBI PVMetrics IA',
    'Controlled Sandbox mock',
    'Pilot Evidence Pack',
    'Client Demo Narrative',
    'Presentation Flow Visual Card',
    'Demo Safety Locks Visual Card',
    'Reportes copiables en texto plano',
    'QA Checklist',
    'Version Registry',
    'Closure Snapshots',
    'README técnico del prototipo',
  ],

  blockedPilotClaims: [
    'La app ya está conectada a SCADA real.',
    'La app lee medidores reales.',
    'La app envía información al CEN.',
    'La app genera reportes oficiales.',
    'La app ejecuta telecontrol.',
    'La app cambia setpoints.',
    'La app controla BESS o inversores.',
    'La app usa datos climáticos reales.',
    'La app tiene backend productivo.',
    'La app envía correos automáticos reales.',
    'La app ya está lista para operación productiva.',
  ],

  pilotReadinessConditions: [
    {
      id: 'condition-client-scope',
      label: 'Alcance piloto aprobado',
      required: true,
      description:
        'Debe existir un alcance escrito que limite el piloto a lectura, revisión y validación conceptual.',
    },
    {
      id: 'condition-readonly-contract',
      label: 'Contrato read-only',
      required: true,
      description:
        'Cualquier fuente futura debe ser explícitamente read-only, sin escritura ni control operacional.',
    },
    {
      id: 'condition-data-sanitization',
      label: 'Sanitización de datos',
      required: true,
      description:
        'Si se usan datos reales futuros, deben ser sanitizados, acotados y aprobados antes de cargarse.',
    },
    {
      id: 'condition-human-review',
      label: 'Revisión humana obligatoria',
      required: true,
      description:
        'Todo resultado piloto debe revisarse por una persona antes de compartirse o interpretarse como hallazgo.',
    },
    {
      id: 'condition-no-telecontrol',
      label: 'Exclusión de telecontrol',
      required: true,
      description:
        'El piloto no puede incluir setpoints, comandos BESS, comandos inversores ni ACK SCADA.',
    },
  ],

  humanReviewRequirements: [
    'Revisión humana antes de usar datos reales futuros.',
    'Revisión humana antes de mostrar resultados a cliente.',
    'Revisión humana antes de interpretar desviaciones comerciales.',
    'Revisión humana antes de generar un documento externo.',
    'Revisión humana antes de aprobar cualquier integración read-only.',
  ],

  readOnlyFutureIntegrationConditions: [
    'Fuente documentada.',
    'Dueño de datos identificado.',
    'Permiso explícito de uso.',
    'Contrato de solo lectura.',
    'Sin credenciales incrustadas en frontend.',
    'Sin tokens en repositorio.',
    'Sin endpoints de escritura.',
    'Sin POST/PUT/PATCH/DELETE reales.',
    'Sin telecontrol.',
    'Sin setpoints.',
    'Sin comandos BESS.',
    'Sin comandos inversores.',
    'Rollback manual definido.',
    'QA previo obligatorio.',
  ],

  pilotRiskRegister: [
    {
      id: 'risk-overpromise',
      label: 'Riesgo de sobrepromesa comercial',
      severity: 'high',
      mitigation:
        'Usar lenguaje de prototipo, demo local, mock y piloto futuro condicionado.',
    },
    {
      id: 'risk-real-data-confusion',
      label: 'Confusión entre datos mock y datos reales',
      severity: 'high',
      mitigation:
        'Mantener banners y textos de No Real Integration Statement visibles.',
    },
    {
      id: 'risk-unauthorized-integration',
      label: 'Intento de integración no autorizada',
      severity: 'critical',
      mitigation:
        'Bloquear conectores reales hasta existir alcance, contrato read-only y QA.',
    },
    {
      id: 'risk-operational-control',
      label: 'Riesgo de control operacional',
      severity: 'critical',
      mitigation:
        'Excluir telecontrol, setpoints, BESS commands, inverter commands y SCADA ACK.',
    },
    {
      id: 'risk-regulatory-misinterpretation',
      label: 'Interpretación regulatoria indebida',
      severity: 'high',
      mitigation:
        'Declarar que no hay envío CEN, reporte oficial ni certificación regulatoria.',
    },
  ],

  decisionGates: [
    {
      id: 'gate-demo-only',
      label: 'Demo local solamente',
      status: 'passed',
      description:
        'La app puede mostrarse como demo local, mock, read-only y segura.',
    },
    {
      id: 'gate-client-pilot',
      label: 'Piloto cliente',
      status: 'requires-human-review',
      description:
        'Requiere alcance aprobado, contrato read-only, sanitización de datos y QA.',
    },
    {
      id: 'gate-real-integration',
      label: 'Integración real',
      status: 'blocked',
      description:
        'Bloqueada en este roadmap hasta crear módulos específicos de integración controlada.',
    },
    {
      id: 'gate-operational-control',
      label: 'Control operacional',
      status: 'forbidden',
      description:
        'No permitido: telecontrol, setpoints, comandos BESS, inversores o SCADA ACK.',
    },
  ],

  exitCriteria: [
    'Blueprint creado.',
    'Client Handoff Sections declaradas.',
    'Allowed Pilot Materials declarados.',
    'Blocked Pilot Claims declarados.',
    'Pilot Readiness Conditions declaradas.',
    'Human Review Requirements declarados.',
    'Read-Only Future Integration Conditions declaradas.',
    'Pilot Risk Register declarado.',
    'Decision Gates declarados.',
    'Safety Boundary declarada.',
    'No se crea UI nueva.',
    'No se modifica wizard.',
    'No se crea PDF real.',
    'No se envían correos.',
    'No se crea backend.',
    'No se crean conectores reales.',
    'No se llama APIs.',
    'No se usa localStorage.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  safetyBoundary:
    'Este blueprint no crea entrega cliente real, no genera PDF, no envía correos, no crea backend, no crea conectores reales, no llama APIs, no usa localStorage, no conecta SCADA, no lee medidores, no usa weather API, no envía CEN, no usa credenciales/tokens/secrets, no ejecuta escritura real y no habilita telecontrol, setpoints, BESS commands ni inverter commands.',

  nextRoadmap: [
    '1O-K.1A — Client Pilot Handoff Types',
    '1O-K.1B — Client Pilot Handoff Mock Data',
    '1O-K.2A — Client Pilot Handoff Visual Card',
    '1O-K.2B — Safe Next Steps Export Text Box',
    '1O-K.3A — Client Pilot Handoff Wizard Integration',
    '1O-K.4A — Client Pilot Handoff Final QA & Closure',
  ],

  nextRecommendedModule: '1O-K.1A — Client Pilot Handoff Types',
} as const;
