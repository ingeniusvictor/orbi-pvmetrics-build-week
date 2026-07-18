const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_DELIVERY_READINESS_BLUEPRINT = {
  id: 'pvmetrics-controlled-client-demo-delivery-readiness-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-U — Controlled Client Demo Delivery Readiness',
  module: '1O-U.0 — Controlled Client Demo Delivery Readiness Blueprint',
  internalVersion:
    '0.1O-U.0-controlled-client-demo-delivery-readiness-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'CONCEPT_ONLY_NO_REAL_DELIVERY',
  blueprintStatusLabel:
    'CLIENT DEMO DELIVERY READINESS — SOLO BLUEPRINT CONCEPTUAL',

  purpose:
    'Definir una capa conceptual para preparar la readiness de entrega/presentación demo de ORBI PVMetrics IA, sin enviar correos reales, sin programar reuniones reales, sin crear links reales, sin invitaciones reales, sin artefactos productivos y sin acciones externas.',

  clientDemoDeliveryPurpose: [
    'Definir condiciones previas para presentar la demo de ORBI PVMetrics IA de forma segura.',
    'Separar preparación conceptual de entrega real, distribución real o reunión real.',
    'Consolidar narrativa, readiness, disclaimers, límites y roles antes de cualquier presentación.',
    'Evitar promesas de producción, forecast oficial, reporte regulatorio o integración real.',
    'Preparar una base para una futura tarjeta visual y export text box de delivery readiness.',
  ],

  allowedDeliveryReadinessItems: [
    {
      id: 'allowed-demo-agenda-outline',
      label: 'Agenda conceptual de demo',
      description:
        'Estructura textual de temas a presentar sin crear reunión real, invitación real ni link real.',
      requiresApproval: true,
    },
    {
      id: 'allowed-speaking-points',
      label: 'Puntos de conversación seguros',
      description:
        'Mensajes ejecutivos para explicar valor, alcance, límites y estado demo-only.',
      requiresApproval: true,
    },
    {
      id: 'allowed-readiness-checklist',
      label: 'Checklist conceptual de readiness',
      description:
        'Lista de verificación local para validar build, TypeScript, módulos cerrados y disclaimers.',
      requiresApproval: true,
    },
    {
      id: 'allowed-safety-disclaimer',
      label: 'Disclaimer de seguridad',
      description:
        'Texto explícito indicando que no hay datos reales, conectores reales, telecontrol ni forecast oficial.',
      requiresApproval: true,
    },
  ],

  blockedDeliveryReadinessItems: [
    {
      id: 'blocked-real-email-send',
      label: 'Envío de email real',
      severity: 'critical',
      reason:
        'Esta fase no puede enviar correos reales ni contactar clientes o stakeholders.',
      safeAlternative:
        'Preparar texto conceptual local para revisión humana posterior.',
    },
    {
      id: 'blocked-real-calendar-event',
      label: 'Reunión o invitación real',
      severity: 'critical',
      reason:
        'No se pueden crear eventos, invitaciones, calendarios ni links reales de reunión.',
      safeAlternative:
        'Usar agenda conceptual sin conexión a calendario ni participantes reales.',
    },
    {
      id: 'blocked-production-delivery',
      label: 'Entrega productiva',
      severity: 'critical',
      reason:
        'No se puede entregar APK, ZIP, PDF real, instalador, ejecutable ni release productiva.',
      safeAlternative:
        'Mantener readiness local y demo-only sin distribución real.',
    },
    {
      id: 'blocked-client-data-or-claims',
      label: 'Datos reales o claims oficiales',
      severity: 'critical',
      reason:
        'No se puede usar evidencia con datos reales ni afirmar forecast oficial o cumplimiento regulatorio.',
      safeAlternative:
        'Usar narrativa conceptual con disclaimers de no producción y no regulación.',
    },
  ],

  deliveryReadinessPrinciples: [
    {
      id: 'principle-preparation-only',
      label: 'Preparation-only',
      description:
        'El bloque solo prepara readiness conceptual; no ejecuta entrega real, envío real ni agenda real.',
      mandatory: true,
    },
    {
      id: 'principle-human-led-delivery',
      label: 'Entrega dirigida por humano',
      description:
        'Toda presentación, envío o invitación real debe ser ejecutada manualmente por un responsable humano.',
      mandatory: true,
    },
    {
      id: 'principle-no-production-claim',
      label: 'Sin promesa productiva',
      description:
        'El lenguaje debe evitar afirmar producción real, forecast oficial, integración real o reporte regulatorio.',
      mandatory: true,
    },
    {
      id: 'principle-safe-demo-narrative',
      label: 'Narrativa demo segura',
      description:
        'Toda comunicación debe indicar que PVMetrics es local, mock, read-only, demo-only y no operacional.',
      mandatory: true,
    },
  ],

  deliveryReadinessCategories: [
    {
      id: 'category-demo-agenda',
      label: 'Agenda demo',
      description:
        'Secuencia conceptual de presentación para explicar contexto, problema, solución, límites y próximos pasos.',
      deliveryMode: 'text-only',
    },
    {
      id: 'category-stakeholder-narrative',
      label: 'Narrativa stakeholder',
      description:
        'Mensajes ejecutivos para cliente, operaciones, QA, seguridad y responsables técnicos.',
      deliveryMode: 'text-only',
    },
    {
      id: 'category-readiness-checklist',
      label: 'Checklist readiness',
      description:
        'Validación conceptual de build, TypeScript, módulos cerrados, safety y ausencia de datos reales.',
      deliveryMode: 'checklist-only',
    },
    {
      id: 'category-delivery-boundary',
      label: 'Delivery Boundary',
      description:
        'Declaración de que no hay entrega real, envío real, reunión real ni artefacto productivo.',
      deliveryMode: 'safety-boundary',
    },
  ],

  deliveryPreparationGates: [
    {
      id: 'prep-gate-build-clean',
      label: 'Build limpio',
      required: true,
      description:
        'Confirmar build correcto antes de cualquier revisión humana de demo.',
    },
    {
      id: 'prep-gate-typescript-clean',
      label: 'TypeScript limpio',
      required: true,
      description:
        'Confirmar TypeScript sin errores antes de considerar readiness de presentación.',
    },
    {
      id: 'prep-gate-storyline-ready',
      label: 'Narrativa preparada',
      required: true,
      description:
        'Confirmar que la narrativa evita promesas de producción, regulación o integración real.',
    },
    {
      id: 'prep-gate-safety-disclaimer',
      label: 'Disclaimer visible',
      required: true,
      description:
        'Confirmar que el disclaimer de seguridad está definido antes de mostrar la demo.',
    },
  ],

  deliverySafetyGates: [
    {
      id: 'safety-gate-no-real-send',
      label: 'Sin envío real',
      required: true,
      description:
        'No se deben enviar emails, invitaciones, links ni mensajes reales desde la app.',
    },
    {
      id: 'safety-gate-no-real-artifact',
      label: 'Sin artefacto real',
      required: true,
      description:
        'No se deben crear PDF, ZIP, APK, ejecutables, instaladores ni releases productivas.',
    },
    {
      id: 'safety-gate-no-real-data',
      label: 'Sin datos reales',
      required: true,
      description:
        'No se deben incluir datos reales, históricos reales, eventos reales ni trazabilidad.',
    },
    {
      id: 'safety-gate-no-operations',
      label: 'Sin operación',
      required: true,
      description:
        'No debe existir telecontrol, setpoints, comandos BESS, comandos de inversores ni SCADA ACK.',
    },
  ],

  deliveryApprovalRoles: [
    {
      id: 'approval-demo-owner',
      label: 'Demo Owner',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Aprueba narrativa, agenda conceptual, disclaimers y secuencia de demo.',
    },
    {
      id: 'approval-qa-owner',
      label: 'QA Owner',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Aprueba build, TypeScript, checklist de readiness y límites demo-only.',
    },
    {
      id: 'approval-security-owner',
      label: 'Security Owner',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Aprueba ausencia de datos reales, credenciales, endpoints y trazabilidad sensible.',
    },
    {
      id: 'approval-business-owner',
      label: 'Business Owner',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Solo requerido si la demo se presentará a cliente o stakeholder externo.',
    },
  ],

  deliveryRiskRegister: [
    {
      id: 'risk-accidental-real-send',
      label: 'Envío real accidental',
      severity: 'critical',
      mitigation:
        'Mantener el bloque como texto local sin integraciones de email, calendario, links o mensajería.',
    },
    {
      id: 'risk-demo-perceived-as-production',
      label: 'Demo percibida como producción',
      severity: 'high',
      mitigation:
        'Usar disclaimers de demo-only, no producción, no regulación y no operación en toda narrativa.',
    },
    {
      id: 'risk-sensitive-info-exposure',
      label: 'Exposición de información sensible',
      severity: 'critical',
      mitigation:
        'Bloquear datos reales, credenciales, endpoints, IDs reales, rutas internas e infraestructura.',
    },
    {
      id: 'risk-artifact-distribution',
      label: 'Distribución de artefacto no aprobado',
      severity: 'high',
      mitigation:
        'No crear PDF, ZIP, APK, ejecutables, instaladores ni release productiva desde este bloque.',
    },
  ],

  deliveryExitCriteria: [
    'Blueprint de Client Demo Delivery Readiness creado.',
    'Client Demo Delivery Purpose declarado.',
    'Allowed Delivery Readiness Items declarados.',
    'Blocked Delivery Readiness Items declarados.',
    'Delivery Readiness Principles declarados.',
    'Delivery Readiness Categories declaradas.',
    'Delivery Preparation Gates declarados.',
    'Delivery Safety Gates declarados.',
    'Delivery Approval Roles declarados.',
    'Delivery Risk Register declarado.',
    'Delivery Exit Criteria declarado.',
    'Delivery Readiness Boundary declarado.',
    'No se envían emails reales.',
    'No se crean reuniones reales.',
    'No se crean links reales.',
    'No se crean invitaciones reales.',
    'No se crea PDF real.',
    'No se crea ZIP real.',
    'No se crea APK real.',
    'No se crea release productiva.',
    'No se incorporan datos reales.',
    'No se crean conectores reales.',
    'Build correcto.',
    'TypeScript limpio.',
  ],

  deliveryReadinessBoundary:
    'Este blueprint solo define readiness conceptual de entrega/demo. No envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no incorpora datos reales, no crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos real, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',

  nextRoadmap: [
    '1O-U.1A — Client Demo Delivery Readiness Types',
    '1O-U.1B — Client Demo Delivery Readiness Mock Data',
    '1O-U.2A — Client Demo Delivery Readiness Visual Card',
    '1O-U.2B — Client Demo Delivery Export Text Box',
    '1O-U.3A — Client Demo Delivery Wizard Integration',
    '1O-U.4A — Client Demo Delivery Final QA & Closure',
  ],

  nextRecommendedModule:
    '1O-U.1A — Client Demo Delivery Readiness Types',
} as const;
