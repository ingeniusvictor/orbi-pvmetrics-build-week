import {
  PVMetricsAllowedFinalFreezeItem,
  PVMetricsBlockedFinalFreezeItem,
  PVMetricsFinalFreezeDomain,
  PVMetricsFinalFreezeExitCriterion,
  PVMetricsFinalFreezeGate,
  PVMetricsFinalFreezePrinciple,
  PVMetricsFinalFreezeRiskRegisterItem,
  PVMetricsFinalFreezeRole,
  PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack,
  PVMetricsPreservedRoadmapBlock,
} from '../types/pvmetrics-independent-demo-preservation-final-roadmap-freeze.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion =
  '0.1O-Z.1B-independent-demo-preservation-final-roadmap-freeze-mock-data';

export const PV_METRICS_FINAL_PRESERVATION_PURPOSE_MOCK: string[] = [
  'Congelar conceptualmente el estado final de la demo independiente de ORBI PVMetrics IA.',
  'Preservar la trazabilidad de los bloques cerrados 1O-T, 1O-U, 1O-V, 1O-W, 1O-X y 1O-Y.',
  'Declarar que el roadmap independiente queda en estado final de demo preservada, no productiva y sin artefactos reales.',
  'Evitar interpretaciones erradas como release real, piloto real, backup real, entrega legal real, aprobación productiva o herramienta operacional.',
  'Preparar una base segura para futura visual card, export text box, wizard integration y cierre QA final del bloque 1O-Z.',
];

export const PV_METRICS_PRESERVED_ROADMAP_BLOCKS_MOCK: PVMetricsPreservedRoadmapBlock[] =
  [
    {
      blockId: 'preserved-block-1o-t',
      label: '1O-T — Controlled Client Demo Evidence Freeze',
      itemType: 'preserved-roadmap-block',
      description:
        'Bloque de evidencia demo congelada, local, mock, read-only y sin evidencia operacional real.',
      freezeStatus: 'preserved-conceptually',
    },
    {
      blockId: 'preserved-block-1o-u',
      label: '1O-U — Controlled Client Demo Delivery Readiness',
      itemType: 'preserved-roadmap-block',
      description:
        'Bloque de readiness conceptual de entrega demo sin envíos, reuniones, links, invitaciones ni artefactos reales.',
      freezeStatus: 'preserved-conceptually',
    },
    {
      blockId: 'preserved-block-1o-v',
      label: '1O-V — Controlled Client Demo Presentation Script',
      itemType: 'preserved-roadmap-block',
      description:
        'Bloque de guion controlado sin video, audio, voz, avatar, PowerPoint ni entrega externa real.',
      freezeStatus: 'preserved-conceptually',
    },
    {
      blockId: 'preserved-block-1o-w',
      label: '1O-W — Controlled Client Demo Final Review Board',
      itemType: 'preserved-roadmap-block',
      description:
        'Bloque de revisión final conceptual sin aprobación real, comité real, acta legal real ni decisión productiva.',
      freezeStatus: 'preserved-conceptually',
    },
    {
      blockId: 'preserved-block-1o-x',
      label: '1O-X — Controlled Client Demo Master Closure',
      itemType: 'preserved-roadmap-block',
      description:
        'Bloque de cierre maestro conceptual sin release real, sin aprobación productiva, sin artefactos reales y sin acciones externas.',
      freezeStatus: 'preserved-conceptually',
    },
    {
      blockId: 'preserved-block-1o-y',
      label: '1O-Y — Controlled Client Demo Archive & Read-Only Maintenance',
      itemType: 'preserved-roadmap-block',
      description:
        'Bloque de archivo conceptual y mantenimiento read-only sin backup real, sin storage, sin persistencia real y sin paquetes descargables.',
      freezeStatus: 'preserved-conceptually',
    },
  ];

export const PV_METRICS_ALLOWED_FINAL_FREEZE_ITEMS_MOCK: PVMetricsAllowedFinalFreezeItem[] =
  [
    {
      itemId: 'allowed-final-roadmap-state-review',
      label: 'Revisión final del estado de roadmap',
      itemType: 'allowed-final-freeze-item',
      description:
        'Revisión conceptual de bloques cerrados, versiones, QA, manifest, README y límites de seguridad.',
      freezeMode: 'roadmap-freeze',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-final-preservation-statement',
      label: 'Declaración final de preservación',
      itemType: 'allowed-final-freeze-item',
      description:
        'Texto local que confirma que la demo queda preservada como demo independiente, read-only, mock y no productiva.',
      freezeMode: 'boundary-lock',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-final-boundary-review',
      label: 'Revisión final de boundaries',
      itemType: 'allowed-final-freeze-item',
      description:
        'Validación conceptual de ausencia de release real, datos reales, conectores reales, storage, backup, SCADA, CEN, APIs reales y telecontrol.',
      freezeMode: 'boundary-lock',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-final-qa-freeze-note',
      label: 'Nota final de QA freeze',
      itemType: 'allowed-final-freeze-item',
      description:
        'Registro textual del freeze final de QA, sin crear artefactos productivos ni entregables legales.',
      freezeMode: 'qa-preservation',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-final-anti-mix-review',
      label: 'Revisión final anti-mezcla',
      itemType: 'allowed-final-freeze-item',
      description:
        'Revisión conceptual de rutas, imports, componentes y servicios para impedir mezcla con otros proyectos ORBI.',
      freezeMode: 'anti-mix-final-review',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-final-human-governance-note',
      label: 'Nota final de gobernanza humana',
      itemType: 'allowed-final-freeze-item',
      description:
        'Texto que recuerda que cualquier paso real posterior debe ocurrir manualmente fuera de la app y bajo alcance separado.',
      freezeMode: 'human-governance',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_FINAL_FREEZE_ITEMS_MOCK: PVMetricsBlockedFinalFreezeItem[] =
  [
    {
      itemId: 'blocked-final-real-release',
      label: 'Release real final',
      itemType: 'blocked-final-freeze-item',
      severity: 'critical',
      reason:
        'El freeze final no puede publicar, empaquetar, aprobar, instalar ni distribuir una release productiva.',
      safeAlternative:
        'Declarar únicamente estado final conceptual de demo independiente preservada.',
    },
    {
      itemId: 'blocked-final-real-artifact',
      label: 'Artefacto real final',
      itemType: 'blocked-final-freeze-item',
      severity: 'critical',
      reason:
        'No se puede crear ZIP, PDF, APK, instalador, ejecutable, snapshot descargable, bundle, backup ni paquete final real.',
      safeAlternative:
        'Mantener todo como constantes TypeScript, documentación local y texto conceptual.',
    },
    {
      itemId: 'blocked-final-real-storage',
      label: 'Storage o persistencia real',
      itemType: 'blocked-final-freeze-item',
      severity: 'critical',
      reason:
        'No se puede usar backend, base de datos real, storage externo, localStorage, IndexedDB, sincronización, uploads ni downloads.',
      safeAlternative:
        'Mantener datos mock locales sin persistencia real.',
    },
    {
      itemId: 'blocked-final-real-approval',
      label: 'Aprobación real',
      itemType: 'blocked-final-freeze-item',
      severity: 'critical',
      reason:
        'No se puede aprobar producción, piloto real, comité real, contrato real, acta legal real ni entrega legal real.',
      safeAlternative:
        'Usar solo estados conceptuales y revisión humana externa fuera de la app.',
    },
    {
      itemId: 'blocked-final-real-operation',
      label: 'Operación real',
      itemType: 'blocked-final-freeze-item',
      severity: 'critical',
      reason:
        'No se puede conectar a SCADA, medidores, CEN, APIs reales ni ejecutar telecontrol, setpoints, comandos BESS, comandos de inversores o SCADA ACK.',
      safeAlternative:
        'Mantener la app como demo read-only sin acciones externas.',
    },
    {
      itemId: 'blocked-final-realtime-media',
      label: 'Realtime/media real',
      itemType: 'blocked-final-freeze-item',
      severity: 'high',
      reason:
        'No se puede introducir WebRTC, Socket.IO, SDP, ICE, TURN, streaming, grabación, video, audio, voz ni avatar real.',
      safeAlternative:
        'Mantener visualización y texto local dentro de la app.',
    },
    {
      itemId: 'blocked-final-real-traceability',
      label: 'Trazabilidad real',
      itemType: 'blocked-final-freeze-item',
      severity: 'critical',
      reason:
        'No se puede crear trazabilidad a cliente real, planta real, activo real, infraestructura real, evento real o evidencia operacional real.',
      safeAlternative:
        'Usar referencias mock, genéricas y no identificables.',
    },
  ];

export const PV_METRICS_FINAL_FREEZE_PRINCIPLES_MOCK: PVMetricsFinalFreezePrinciple[] =
  [
    {
      principleId: 'principle-final-demo-preserved',
      label: 'Demo preservada',
      itemType: 'final-freeze-principle',
      description:
        'La app queda preservada como demo independiente conceptual, no como producto final operativo.',
      mandatory: true,
    },
    {
      principleId: 'principle-final-no-release',
      label: 'Sin release final real',
      itemType: 'final-freeze-principle',
      description:
        'El freeze del roadmap no crea release real, instalador, APK, ejecutable, ZIP, PDF, backup ni paquete descargable.',
      mandatory: true,
    },
    {
      principleId: 'principle-final-read-only',
      label: 'Read-only permanente',
      itemType: 'final-freeze-principle',
      description:
        'La demo permanece local, mock, read-only, demo-only y sin mutaciones externas.',
      mandatory: true,
    },
    {
      principleId: 'principle-final-no-persistence',
      label: 'Sin persistencia real',
      itemType: 'final-freeze-principle',
      description:
        'No usar storage externo, backend, base de datos real, localStorage, IndexedDB ni sincronización.',
      mandatory: true,
    },
    {
      principleId: 'principle-final-no-operational-bridge',
      label: 'Sin puente operacional',
      itemType: 'final-freeze-principle',
      description:
        'El freeze final no puede conectarse a operación real, SCADA, CEN, medidores, APIs reales ni telecontrol.',
      mandatory: true,
    },
    {
      principleId: 'principle-final-anti-mix',
      label: 'Anti-mezcla ORBI final',
      itemType: 'final-freeze-principle',
      description:
        'El bloque pertenece exclusivamente a ORBI PVMetrics IA y no puede importar lógica de otros proyectos ORBI.',
      mandatory: true,
    },
    {
      principleId: 'principle-final-no-real-files',
      label: 'Sin archivos reales finales',
      itemType: 'final-freeze-principle',
      description:
        'El freeze final no puede crear backups, snapshots descargables, bundles, ZIPs, PDFs, APKs, instaladores ni ejecutables.',
      mandatory: true,
    },
  ];

export const PV_METRICS_FINAL_FREEZE_DOMAINS_MOCK: PVMetricsFinalFreezeDomain[] =
  [
    {
      domainId: 'domain-final-roadmap-freeze',
      label: 'Roadmap Freeze',
      itemType: 'final-freeze-domain',
      freezeMode: 'roadmap-freeze',
      description:
        'Congelamiento conceptual de los bloques 1O-T, 1O-U, 1O-V, 1O-W, 1O-X y 1O-Y.',
    },
    {
      domainId: 'domain-final-qa-preservation',
      label: 'QA Preservation',
      itemType: 'final-freeze-domain',
      freezeMode: 'qa-preservation',
      description:
        'Validación de build, TypeScript, QA checklist, manifest, README y estado estable final.',
    },
    {
      domainId: 'domain-final-boundary-lock',
      label: 'Boundary Lock',
      itemType: 'final-freeze-domain',
      freezeMode: 'boundary-lock',
      description:
        'Validación de ausencia de release real, artefactos reales, datos reales, storage real, conectores reales y acciones externas.',
    },
    {
      domainId: 'domain-final-anti-mix',
      label: 'Anti-Mix Final Review',
      itemType: 'final-freeze-domain',
      freezeMode: 'anti-mix-final-review',
      description:
        'Verificación de rutas permitidas y ausencia de imports cruzados con otros proyectos ORBI.',
    },
    {
      domainId: 'domain-final-human-governance',
      label: 'Human Governance',
      itemType: 'final-freeze-domain',
      freezeMode: 'human-governance',
      description:
        'Confirmación de que cualquier paso real queda fuera de la app y requiere alcance humano separado.',
    },
  ];

export const PV_METRICS_FINAL_FREEZE_GATES_MOCK: PVMetricsFinalFreezeGate[] =
  [
    {
      gateId: 'gate-final-build-clean',
      label: 'Build limpio',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'La app debe compilar correctamente antes del freeze final conceptual.',
    },
    {
      gateId: 'gate-final-typescript-clean',
      label: 'TypeScript limpio',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'TypeScript debe estar libre de errores antes del freeze final.',
    },
    {
      gateId: 'gate-final-roadmap-preserved',
      label: 'Roadmap preservado',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'Los bloques 1O-T, 1O-U, 1O-V, 1O-W, 1O-X y 1O-Y deben estar representados como preservados conceptualmente.',
    },
    {
      gateId: 'gate-final-no-real-artifacts',
      label: 'Sin artefactos reales',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'No deben existir ZIP, PDF, APK, instaladores, ejecutables, snapshots descargables, backups ni paquetes finales reales.',
    },
    {
      gateId: 'gate-final-no-persistence',
      label: 'Sin persistencia real',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'No debe existir storage externo, backend, base de datos real, localStorage, IndexedDB, upload, download ni sincronización.',
    },
    {
      gateId: 'gate-final-no-operational-systems',
      label: 'Sin sistemas operacionales reales',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'No deben existir conexiones reales a SCADA, medidores, CEN, APIs reales, endpoints, telecontrol, setpoints o comandos.',
    },
    {
      gateId: 'gate-final-no-cross-project',
      label: 'Sin mezcla ORBI',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'No debe existir importación de rutas, stores, providers, componentes ni lógica de otros proyectos ORBI.',
    },
    {
      gateId: 'gate-final-no-realtime-media',
      label: 'Sin realtime/media',
      itemType: 'final-freeze-gate',
      required: true,
      passed: true,
      description:
        'No debe existir WebRTC, Socket.IO, SDP, ICE, TURN, streaming, grabación, video, audio, voz ni avatar real.',
    },
  ];

export const PV_METRICS_FINAL_FREEZE_ROLES_MOCK: PVMetricsFinalFreezeRole[] =
  [
    {
      roleId: 'role-final-demo-owner',
      label: 'Final Demo Owner',
      itemType: 'final-freeze-role',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Revisa que la demo quede preservada conceptualmente, sin promesas productivas ni distribución real.',
    },
    {
      roleId: 'role-final-qa-owner',
      label: 'Final QA Owner',
      itemType: 'final-freeze-role',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Revisa build, TypeScript, QA checklist, manifest, README y consistencia de freeze final.',
    },
    {
      roleId: 'role-final-security-owner',
      label: 'Final Security Owner',
      itemType: 'final-freeze-role',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Revisa boundaries finales: sin storage, credenciales, APIs reales, SCADA, CEN, backend, WebRTC, Socket.IO, SDP, ICE ni TURN.',
    },
    {
      roleId: 'role-final-technical-owner',
      label: 'Final Technical Owner',
      itemType: 'final-freeze-role',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Revisa arquitectura standalone, rutas permitidas, imports, mock data local y ausencia de mezcla ORBI.',
    },
    {
      roleId: 'role-final-business-observer',
      label: 'Final Business Observer',
      itemType: 'final-freeze-role',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Rol observador conceptual sin aprobación comercial, contractual, productiva ni legal real.',
    },
    {
      roleId: 'role-final-observer',
      label: 'Final Observer',
      itemType: 'final-freeze-role',
      reviewerRole: 'observer',
      required: false,
      description:
        'Rol observador conceptual sin capacidad de aprobar releases, contratos, backups, entregas ni acciones externas.',
    },
  ];

export const PV_METRICS_FINAL_FREEZE_RISK_REGISTER_MOCK: PVMetricsFinalFreezeRiskRegisterItem[] =
  [
    {
      riskId: 'risk-final-freeze-misread-as-release',
      label: 'Freeze interpretado como release real',
      itemType: 'final-freeze-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar explícitamente que el freeze final es conceptual y no crea release real, instalador, APK, ejecutable, ZIP, PDF ni paquete productivo.',
    },
    {
      riskId: 'risk-final-artifact-generation',
      label: 'Generación accidental de artefactos reales',
      itemType: 'final-freeze-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear backups, snapshots descargables, paquetes finales, bundles, ZIPs, PDFs, APKs, instaladores y ejecutables.',
    },
    {
      riskId: 'risk-final-persistence-regression',
      label: 'Regresión hacia persistencia real',
      itemType: 'final-freeze-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear storage externo, localStorage, IndexedDB, backend, base de datos real, uploads, downloads y sincronización.',
    },
    {
      riskId: 'risk-final-operational-confusion',
      label: 'Confusión con operación real',
      itemType: 'final-freeze-risk-register-item',
      severity: 'critical',
      mitigation:
        'Reforzar ausencia de SCADA, medidores, CEN, APIs reales, telecontrol, setpoints, comandos BESS, comandos de inversores y SCADA ACK.',
    },
    {
      riskId: 'risk-final-cross-project-import',
      label: 'Import cruzado ORBI',
      itemType: 'final-freeze-risk-register-item',
      severity: 'critical',
      mitigation:
        'Mantener rutas, imports, providers, stores, componentes y servicios exclusivamente dentro de ORBI PVMetrics IA.',
    },
    {
      riskId: 'risk-final-real-data-traceability',
      label: 'Trazabilidad real accidental',
      itemType: 'final-freeze-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear referencias a cliente real, planta real, activo real, infraestructura real, evento real o evidencia operacional real.',
    },
    {
      riskId: 'risk-final-realtime-media-regression',
      label: 'Regresión hacia realtime/media',
      itemType: 'final-freeze-risk-register-item',
      severity: 'high',
      mitigation:
        'Bloquear WebRTC, Socket.IO, SDP, ICE, TURN, streaming, grabación, video real, audio real, voz real y avatar real.',
    },
  ];

export const PV_METRICS_FINAL_FREEZE_EXIT_CRITERIA_MOCK: PVMetricsFinalFreezeExitCriterion[] =
  [
    {
      criterionId: 'exit-final-types-ready',
      label: 'Tipos listos',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Independent Demo Preservation & Final Roadmap Freeze están implementados.',
    },
    {
      criterionId: 'exit-final-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'El mock data local queda poblado con purpose, preserved blocks, allowed/blocked items, principles, domains, gates, roles, risks, exit criteria y boundary.',
    },
    {
      criterionId: 'exit-final-roadmap-blocks-preserved',
      label: 'Bloques preservados',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los bloques 1O-T, 1O-U, 1O-V, 1O-W, 1O-X y 1O-Y quedan representados como preservados conceptualmente.',
    },
    {
      criterionId: 'exit-final-no-real-release',
      label: 'Sin release real',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea release real, aprobación productiva, piloto real, contrato real, comité real ni entrega legal real.',
    },
    {
      criterionId: 'exit-final-no-real-artifacts',
      label: 'Sin artefactos reales',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea ZIP real, PDF real, APK real, snapshot descargable, instalador, ejecutable, bundle, backup ni paquete productivo.',
    },
    {
      criterionId: 'exit-final-no-persistence',
      label: 'Sin persistencia real',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se usa backend, base de datos real, storage externo, localStorage, IndexedDB, upload, download ni sincronización.',
    },
    {
      criterionId: 'exit-final-no-real-systems',
      label: 'Sin sistemas reales',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se conecta a SCADA, medidores, CEN, APIs reales, endpoints, WebRTC, Socket.IO, SDP, ICE ni TURN.',
    },
    {
      criterionId: 'exit-final-no-telecontrol',
      label: 'Sin telecontrol',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se ejecutan setpoints, comandos BESS, comandos de inversores, SCADA ACK ni acciones operativas reales.',
    },
    {
      criterionId: 'exit-final-no-real-traceability',
      label: 'Sin trazabilidad real',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea trazabilidad a cliente real, planta real, activo real, infraestructura real, evento real ni evidencia operacional real.',
    },
    {
      criterionId: 'exit-final-boundary-declared',
      label: 'Final Freeze Boundary declarado',
      itemType: 'final-freeze-exit-criterion',
      required: true,
      passed: true,
      description:
        'El límite de seguridad de la preservación final y freeze del roadmap queda declarado dentro del pack mock.',
    },
  ];

export const PV_METRICS_INDEPENDENT_DEMO_PRESERVATION_FINAL_ROADMAP_FREEZE_PACK_MOCK: PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack =
  {
    packId:
      'pvmetrics-independent-demo-preservation-final-roadmap-freeze-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock:
      '1O-Z — Independent Demo Preservation & Final Roadmap Freeze',
    module:
      '1O-Z.1B — Independent Demo Preservation & Final Roadmap Freeze Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    finalPreservationPurpose: PV_METRICS_FINAL_PRESERVATION_PURPOSE_MOCK,
    preservedRoadmapBlocks: PV_METRICS_PRESERVED_ROADMAP_BLOCKS_MOCK,
    allowedFinalFreezeItems: PV_METRICS_ALLOWED_FINAL_FREEZE_ITEMS_MOCK,
    blockedFinalFreezeItems: PV_METRICS_BLOCKED_FINAL_FREEZE_ITEMS_MOCK,
    finalFreezePrinciples: PV_METRICS_FINAL_FREEZE_PRINCIPLES_MOCK,
    finalFreezeDomains: PV_METRICS_FINAL_FREEZE_DOMAINS_MOCK,
    finalFreezeGates: PV_METRICS_FINAL_FREEZE_GATES_MOCK,
    finalFreezeRoles: PV_METRICS_FINAL_FREEZE_ROLES_MOCK,
    finalFreezeRiskRegister: PV_METRICS_FINAL_FREEZE_RISK_REGISTER_MOCK,
    finalFreezeExitCriteria: PV_METRICS_FINAL_FREEZE_EXIT_CRITERIA_MOCK,
    finalFreezeBoundary:
      'Independent Demo Preservation & Final Roadmap Freeze mock data. Todo es local, conceptual, final-freeze-only, roadmap-preservation-only, read-only, demo-only y no productivo. No crea backup real, no crea ZIP real, no crea PDF real, no crea snapshot descargable real, no crea paquete final descargable, no crea release artifact, no crea exportación productiva, no sube archivos, no descarga archivos, no usa storage externo, no usa localStorage, no usa IndexedDB, no usa backend, no usa base de datos real, no convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea entregable legal real, no crea PowerPoint real, no crea APK real, no crea instalador real, no crea ejecutable real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no usa WebRTC, no usa Socket.IO, no usa SDP, no usa ICE, no usa TURN, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial, no reporte regulatorio, no trazabilidad a cliente/planta/activo/infraestructura real y no evidencia operacional real.',
    nextRecommendedModule:
      '1O-Z.2A — Independent Demo Preservation & Final Roadmap Freeze Visual Card',
  };
