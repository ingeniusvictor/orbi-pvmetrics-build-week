import {
  PVMetricsAllowedDeliveryReadinessItem,
  PVMetricsBlockedDeliveryReadinessItem,
  PVMetricsControlledClientDemoDeliveryReadinessPack,
  PVMetricsDeliveryApprovalRole,
  PVMetricsDeliveryExitCriterion,
  PVMetricsDeliveryPreparationGate,
  PVMetricsDeliveryReadinessCategory,
  PVMetricsDeliveryReadinessPrinciple,
  PVMetricsDeliveryRiskRegisterItem,
  PVMetricsDeliverySafetyGate,
} from '../types/pvmetrics-client-demo-delivery-readiness.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion = '0.1O-U.1B-client-demo-delivery-readiness-mock-data';

export const PV_METRICS_CLIENT_DEMO_DELIVERY_PURPOSE_MOCK: string[] = [
  'Preparar la readiness conceptual de entrega/presentación demo de ORBI PVMetrics IA.',
  'Definir una secuencia segura para explicar valor, alcance, límites y estado demo-only.',
  'Consolidar agenda, speaking points, checklist, disclaimers y roles humanos antes de cualquier presentación.',
  'Evitar envíos reales, reuniones reales, links reales, invitaciones reales y artefactos productivos.',
  'Reforzar que la app sigue siendo local, mock, read-only, demo-only, no regulatoria y no operacional.',
];

export const PV_METRICS_ALLOWED_DELIVERY_READINESS_ITEMS_MOCK: PVMetricsAllowedDeliveryReadinessItem[] =
  [
    {
      itemId: 'allowed-demo-agenda-outline',
      label: 'Agenda conceptual de demo',
      itemType: 'allowed-delivery-readiness-item',
      description:
        'Estructura textual de temas a presentar sin crear reunión real, invitación real ni link real.',
      deliveryMode: 'agenda-outline',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-speaking-points',
      label: 'Puntos de conversación seguros',
      itemType: 'allowed-delivery-readiness-item',
      description:
        'Mensajes ejecutivos para explicar valor, alcance, límites, readiness y estado demo-only.',
      deliveryMode: 'speaking-points',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-readiness-checklist',
      label: 'Checklist conceptual de readiness',
      itemType: 'allowed-delivery-readiness-item',
      description:
        'Lista de verificación local para validar build, TypeScript, módulos cerrados y disclaimers.',
      deliveryMode: 'checklist-only',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-safety-disclaimer',
      label: 'Disclaimer de seguridad',
      itemType: 'allowed-delivery-readiness-item',
      description:
        'Texto explícito indicando que no hay datos reales, conectores reales, telecontrol ni forecast oficial.',
      deliveryMode: 'safety-boundary',
      requiresApproval: true,
    },
    {
      itemId: 'allowed-human-next-steps',
      label: 'Próximos pasos humanos',
      itemType: 'allowed-delivery-readiness-item',
      description:
        'Lista conceptual de acciones que deben ser ejecutadas manualmente por responsables humanos fuera de la app.',
      deliveryMode: 'text-only',
      requiresApproval: true,
    },
  ];

export const PV_METRICS_BLOCKED_DELIVERY_READINESS_ITEMS_MOCK: PVMetricsBlockedDeliveryReadinessItem[] =
  [
    {
      itemId: 'blocked-real-email-send',
      label: 'Envío de email real',
      itemType: 'blocked-delivery-readiness-item',
      severity: 'critical',
      reason:
        'Esta fase no puede enviar correos reales ni contactar clientes o stakeholders.',
      safeAlternative:
        'Preparar texto conceptual local para revisión humana posterior.',
    },
    {
      itemId: 'blocked-real-calendar-event',
      label: 'Reunión o invitación real',
      itemType: 'blocked-delivery-readiness-item',
      severity: 'critical',
      reason:
        'No se pueden crear eventos, invitaciones, calendarios ni links reales de reunión.',
      safeAlternative:
        'Usar agenda conceptual sin conexión a calendario ni participantes reales.',
    },
    {
      itemId: 'blocked-production-delivery',
      label: 'Entrega productiva',
      itemType: 'blocked-delivery-readiness-item',
      severity: 'critical',
      reason:
        'No se puede entregar APK, ZIP, PDF real, instalador, ejecutable ni release productiva.',
      safeAlternative:
        'Mantener readiness local y demo-only sin distribución real.',
    },
    {
      itemId: 'blocked-client-data-or-claims',
      label: 'Datos reales o claims oficiales',
      itemType: 'blocked-delivery-readiness-item',
      severity: 'critical',
      reason:
        'No se puede usar evidencia con datos reales ni afirmar forecast oficial, envío CEN o cumplimiento regulatorio.',
      safeAlternative:
        'Usar narrativa conceptual con disclaimers de no producción, no regulación y no operación.',
    },
    {
      itemId: 'blocked-operational-delivery',
      label: 'Entrega con operación o telecontrol',
      itemType: 'blocked-delivery-readiness-item',
      severity: 'critical',
      reason:
        'No puede existir entrega que incluya setpoints, comandos BESS, comandos de inversores, SCADA ACK o telecontrol.',
      safeAlternative:
        'Usar solo una demostración local read-only sin acciones externas.',
    },
  ];

export const PV_METRICS_DELIVERY_READINESS_PRINCIPLES_MOCK: PVMetricsDeliveryReadinessPrinciple[] =
  [
    {
      principleId: 'principle-preparation-only',
      label: 'Preparation-only',
      itemType: 'delivery-readiness-principle',
      description:
        'El bloque solo prepara readiness conceptual; no ejecuta entrega real, envío real ni agenda real.',
      mandatory: true,
    },
    {
      principleId: 'principle-human-led-delivery',
      label: 'Entrega dirigida por humano',
      itemType: 'delivery-readiness-principle',
      description:
        'Toda presentación, envío o invitación real debe ser ejecutada manualmente por un responsable humano.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-production-claim',
      label: 'Sin promesa productiva',
      itemType: 'delivery-readiness-principle',
      description:
        'El lenguaje debe evitar afirmar producción real, forecast oficial, integración real o reporte regulatorio.',
      mandatory: true,
    },
    {
      principleId: 'principle-safe-demo-narrative',
      label: 'Narrativa demo segura',
      itemType: 'delivery-readiness-principle',
      description:
        'Toda comunicación debe indicar que PVMetrics es local, mock, read-only, demo-only y no operacional.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-automated-contact',
      label: 'Sin contacto automatizado',
      itemType: 'delivery-readiness-principle',
      description:
        'La app no debe enviar correos, mensajes, invitaciones, enlaces ni notificaciones reales.',
      mandatory: true,
    },
  ];

export const PV_METRICS_DELIVERY_READINESS_CATEGORIES_MOCK: PVMetricsDeliveryReadinessCategory[] =
  [
    {
      categoryId: 'category-demo-agenda',
      label: 'Agenda demo',
      itemType: 'delivery-readiness-category',
      description:
        'Secuencia conceptual de presentación para explicar contexto, problema, solución, límites y próximos pasos.',
      deliveryMode: 'agenda-outline',
    },
    {
      categoryId: 'category-stakeholder-narrative',
      label: 'Narrativa stakeholder',
      itemType: 'delivery-readiness-category',
      description:
        'Mensajes ejecutivos para cliente, operaciones, QA, seguridad y responsables técnicos.',
      deliveryMode: 'speaking-points',
    },
    {
      categoryId: 'category-readiness-checklist',
      label: 'Checklist readiness',
      itemType: 'delivery-readiness-category',
      description:
        'Validación conceptual de build, TypeScript, módulos cerrados, safety y ausencia de datos reales.',
      deliveryMode: 'checklist-only',
    },
    {
      categoryId: 'category-delivery-boundary',
      label: 'Delivery Boundary',
      itemType: 'delivery-readiness-category',
      description:
        'Declaración de que no hay entrega real, envío real, reunión real ni artefacto productivo.',
      deliveryMode: 'safety-boundary',
    },
    {
      categoryId: 'category-human-approval',
      label: 'Aprobación humana',
      itemType: 'delivery-readiness-category',
      description:
        'Revisión conceptual por roles humanos antes de cualquier contacto real fuera de la app.',
      deliveryMode: 'readiness-summary',
    },
  ];

export const PV_METRICS_DELIVERY_PREPARATION_GATES_MOCK: PVMetricsDeliveryPreparationGate[] =
  [
    {
      gateId: 'prep-gate-build-clean',
      label: 'Build limpio',
      itemType: 'delivery-preparation-gate',
      required: true,
      description:
        'Confirmar build correcto antes de cualquier revisión humana de demo.',
    },
    {
      gateId: 'prep-gate-typescript-clean',
      label: 'TypeScript limpio',
      itemType: 'delivery-preparation-gate',
      required: true,
      description:
        'Confirmar TypeScript sin errores antes de considerar readiness de presentación.',
    },
    {
      gateId: 'prep-gate-storyline-ready',
      label: 'Narrativa preparada',
      itemType: 'delivery-preparation-gate',
      required: true,
      description:
        'Confirmar que la narrativa evita promesas de producción, regulación, integración real o operación automática.',
    },
    {
      gateId: 'prep-gate-safety-disclaimer',
      label: 'Disclaimer visible',
      itemType: 'delivery-preparation-gate',
      required: true,
      description:
        'Confirmar que el disclaimer de seguridad está definido antes de mostrar la demo.',
    },
    {
      gateId: 'prep-gate-human-review',
      label: 'Revisión humana pendiente',
      itemType: 'delivery-preparation-gate',
      required: true,
      description:
        'Confirmar que cualquier envío real queda fuera de la app y depende de revisión humana externa.',
    },
  ];

export const PV_METRICS_DELIVERY_SAFETY_GATES_MOCK: PVMetricsDeliverySafetyGate[] =
  [
    {
      gateId: 'safety-gate-no-real-send',
      label: 'Sin envío real',
      itemType: 'delivery-safety-gate',
      required: true,
      description:
        'No se deben enviar emails, invitaciones, links, mensajes ni notificaciones reales desde la app.',
    },
    {
      gateId: 'safety-gate-no-real-meeting',
      label: 'Sin reunión real',
      itemType: 'delivery-safety-gate',
      required: true,
      description:
        'No se deben crear reuniones, eventos de calendario, links de reunión ni invitaciones reales.',
    },
    {
      gateId: 'safety-gate-no-real-artifact',
      label: 'Sin artefacto real',
      itemType: 'delivery-safety-gate',
      required: true,
      description:
        'No se deben crear PDF, ZIP, APK, ejecutables, instaladores ni releases productivas.',
    },
    {
      gateId: 'safety-gate-no-real-data',
      label: 'Sin datos reales',
      itemType: 'delivery-safety-gate',
      required: true,
      description:
        'No se deben incluir datos reales, históricos reales, eventos reales, clientes reales ni trazabilidad.',
    },
    {
      gateId: 'safety-gate-no-operations',
      label: 'Sin operación',
      itemType: 'delivery-safety-gate',
      required: true,
      description:
        'No debe existir telecontrol, setpoints, comandos BESS, comandos de inversores, SCADA ACK ni acciones externas.',
    },
  ];

export const PV_METRICS_DELIVERY_APPROVAL_ROLES_MOCK: PVMetricsDeliveryApprovalRole[] =
  [
    {
      approvalId: 'approval-demo-owner',
      label: 'Demo Owner',
      itemType: 'delivery-approval-role',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Aprueba narrativa, agenda conceptual, disclaimers y secuencia de demo.',
    },
    {
      approvalId: 'approval-qa-owner',
      label: 'QA Owner',
      itemType: 'delivery-approval-role',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Aprueba build, TypeScript, checklist de readiness y límites demo-only.',
    },
    {
      approvalId: 'approval-security-owner',
      label: 'Security Owner',
      itemType: 'delivery-approval-role',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Aprueba ausencia de datos reales, credenciales, endpoints, infraestructura y trazabilidad sensible.',
    },
    {
      approvalId: 'approval-technical-owner',
      label: 'Technical Owner',
      itemType: 'delivery-approval-role',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Aprueba consistencia técnica de módulos cerrados, dependencias locales y ausencia de acciones externas.',
    },
    {
      approvalId: 'approval-business-owner',
      label: 'Business Owner',
      itemType: 'delivery-approval-role',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Solo requerido si la demo será presentada a cliente o stakeholder externo.',
    },
  ];

export const PV_METRICS_DELIVERY_RISK_REGISTER_MOCK: PVMetricsDeliveryRiskRegisterItem[] =
  [
    {
      riskId: 'risk-accidental-real-send',
      label: 'Envío real accidental',
      itemType: 'delivery-risk-register-item',
      severity: 'critical',
      mitigation:
        'Mantener el bloque como texto local sin integraciones de email, calendario, links, mensajería o notificaciones.',
    },
    {
      riskId: 'risk-demo-perceived-as-production',
      label: 'Demo percibida como producción',
      itemType: 'delivery-risk-register-item',
      severity: 'high',
      mitigation:
        'Usar disclaimers de demo-only, no producción, no regulación y no operación en toda narrativa.',
    },
    {
      riskId: 'risk-sensitive-info-exposure',
      label: 'Exposición de información sensible',
      itemType: 'delivery-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear datos reales, credenciales, endpoints, IDs reales, rutas internas, infraestructura y trazabilidad.',
    },
    {
      riskId: 'risk-artifact-distribution',
      label: 'Distribución de artefacto no aprobado',
      itemType: 'delivery-risk-register-item',
      severity: 'high',
      mitigation:
        'No crear PDF, ZIP, APK, ejecutables, instaladores ni release productiva desde este bloque.',
    },
    {
      riskId: 'risk-official-claim',
      label: 'Claim oficial indebido',
      itemType: 'delivery-risk-register-item',
      severity: 'critical',
      mitigation:
        'Evitar afirmar forecast oficial, envío CEN, cumplimiento regulatorio, integración real o operación productiva.',
    },
  ];

export const PV_METRICS_DELIVERY_EXIT_CRITERIA_MOCK: PVMetricsDeliveryExitCriterion[] =
  [
    {
      criterionId: 'exit-types-ready',
      label: 'Tipos listos',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Controlled Client Demo Delivery Readiness están implementados.',
    },
    {
      criterionId: 'exit-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'El mock data local queda poblado con purpose, allowed/blocked items, principles, categories, gates, approvals, risks y boundary.',
    },
    {
      criterionId: 'exit-no-real-send',
      label: 'Sin envío real',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se envían emails, invitaciones, links, mensajes ni notificaciones reales.',
    },
    {
      criterionId: 'exit-no-real-meeting',
      label: 'Sin reunión real',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crean reuniones, eventos de calendario, links reales ni invitaciones reales.',
    },
    {
      criterionId: 'exit-no-real-artifact',
      label: 'Sin artefacto real',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea PDF real, ZIP real, APK real, ejecutable, instalador ni release productiva.',
    },
    {
      criterionId: 'exit-no-real-data',
      label: 'Sin datos reales',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'La readiness no incorpora mediciones, históricos, eventos, endpoints, credenciales ni identificadores reales.',
    },
    {
      criterionId: 'exit-delivery-boundary',
      label: 'Delivery Readiness Boundary declarado',
      itemType: 'delivery-exit-criterion',
      required: true,
      passed: true,
      description:
        'El límite de seguridad queda declarado dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_DELIVERY_READINESS_PACK_MOCK: PVMetricsControlledClientDemoDeliveryReadinessPack =
  {
    packId: 'pvmetrics-controlled-client-demo-delivery-readiness-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-U — Controlled Client Demo Delivery Readiness',
    module: '1O-U.1B — Client Demo Delivery Readiness Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    clientDemoDeliveryPurpose: PV_METRICS_CLIENT_DEMO_DELIVERY_PURPOSE_MOCK,
    allowedDeliveryReadinessItems:
      PV_METRICS_ALLOWED_DELIVERY_READINESS_ITEMS_MOCK,
    blockedDeliveryReadinessItems:
      PV_METRICS_BLOCKED_DELIVERY_READINESS_ITEMS_MOCK,
    deliveryReadinessPrinciples:
      PV_METRICS_DELIVERY_READINESS_PRINCIPLES_MOCK,
    deliveryReadinessCategories:
      PV_METRICS_DELIVERY_READINESS_CATEGORIES_MOCK,
    deliveryPreparationGates:
      PV_METRICS_DELIVERY_PREPARATION_GATES_MOCK,
    deliverySafetyGates: PV_METRICS_DELIVERY_SAFETY_GATES_MOCK,
    deliveryApprovalRoles: PV_METRICS_DELIVERY_APPROVAL_ROLES_MOCK,
    deliveryRiskRegister: PV_METRICS_DELIVERY_RISK_REGISTER_MOCK,
    deliveryExitCriteria: PV_METRICS_DELIVERY_EXIT_CRITERIA_MOCK,
    deliveryReadinessBoundary:
      'Controlled Client Demo Delivery Readiness mock data. Todo es local, conceptual, demo-only, read-only y no productivo. No envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no crea PDF real, no crea ZIP real, no crea APK real, no crea release productiva, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no usa backend, no base de datos, no localStorage, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial y no reporte regulatorio.',
    nextRecommendedModule:
      '1O-U.2A — Client Demo Delivery Readiness Visual Card',
  };
