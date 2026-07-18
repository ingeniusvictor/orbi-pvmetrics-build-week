import {
  PVMetricsAllowedArchiveMaintenanceItem,
  PVMetricsArchivedDemoClosureBlock,
  PVMetricsArchiveMaintenanceDomain,
  PVMetricsArchiveMaintenanceExitCriterion,
  PVMetricsArchiveMaintenanceGate,
  PVMetricsArchiveMaintenancePrinciple,
  PVMetricsArchiveMaintenanceRiskRegisterItem,
  PVMetricsArchiveMaintenanceRole,
  PVMetricsBlockedArchiveMaintenanceItem,
  PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack,
} from '../types/pvmetrics-client-demo-archive-read-only-maintenance.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const internalVersion =
  '0.1O-Y.1B-client-demo-archive-read-only-maintenance-mock-data';

export const PV_METRICS_ARCHIVE_MAINTENANCE_PURPOSE_MOCK: string[] = [
  'Consolidar el archivo conceptual y mantenimiento read-only de la demo cliente de ORBI PVMetrics IA.',
  'Representar el estado archivado de los bloques 1O-T, 1O-U, 1O-V, 1O-W y 1O-X sin crear backups reales ni paquetes descargables.',
  'Preservar la demo como local, mock, read-only, demo-only y no productiva.',
  'Separar explícitamente archivo conceptual de cualquier backup real, ZIP real, PDF real, storage externo, localStorage, IndexedDB, backend o base de datos real.',
  'Preparar una base segura para futura visual card, export text box, wizard integration y cierre QA del bloque 1O-Y.',
];

export const PV_METRICS_ARCHIVED_DEMO_CLOSURE_BLOCKS_MOCK: PVMetricsArchivedDemoClosureBlock[] =
  [
    {
      blockId: 'archived-block-1o-t',
      label: '1O-T — Controlled Client Demo Evidence Freeze',
      itemType: 'archived-demo-closure-block',
      description:
        'Bloque de evidencia demo congelada, local, mock, read-only y sin evidencia operacional real.',
      archiveStatus: 'conceptually-archived',
    },
    {
      blockId: 'archived-block-1o-u',
      label: '1O-U — Controlled Client Demo Delivery Readiness',
      itemType: 'archived-demo-closure-block',
      description:
        'Bloque de readiness conceptual de entrega demo sin envíos, reuniones, links, invitaciones ni artefactos reales.',
      archiveStatus: 'conceptually-archived',
    },
    {
      blockId: 'archived-block-1o-v',
      label: '1O-V — Controlled Client Demo Presentation Script',
      itemType: 'archived-demo-closure-block',
      description:
        'Bloque de guion controlado sin video, audio, voz, avatar, PowerPoint ni entrega externa real.',
      archiveStatus: 'conceptually-archived',
    },
    {
      blockId: 'archived-block-1o-w',
      label: '1O-W — Controlled Client Demo Final Review Board',
      itemType: 'archived-demo-closure-block',
      description:
        'Bloque de mesa conceptual de revisión final sin aprobación real, comité real, acta legal real ni decisión productiva.',
      archiveStatus: 'conceptually-archived',
    },
    {
      blockId: 'archived-block-1o-x',
      label: '1O-X — Controlled Client Demo Master Closure',
      itemType: 'archived-demo-closure-block',
      description:
        'Bloque de cierre maestro conceptual sin release real, sin aprobación productiva, sin artefactos reales y sin acciones externas.',
      archiveStatus: 'conceptually-archived',
    },
  ];

export const PV_METRICS_ALLOWED_ARCHIVE_MAINTENANCE_ITEMS_MOCK: PVMetricsAllowedArchiveMaintenanceItem[] =
  [
    {
      itemId: 'allowed-read-only-demo-state-review',
      label: 'Revisión read-only del estado demo',
      itemType: 'allowed-archive-maintenance-item',
      description:
        'Revisión conceptual del estado final de la demo, roadmap, QA, manifest, README y límites de seguridad.',
      maintenanceMode: 'archive-state',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-compatibility-note',
      label: 'Nota de compatibilidad conceptual',
      itemType: 'allowed-archive-maintenance-item',
      description:
        'Registro textual de compatibilidad futura sin ejecutar migraciones reales, instalaciones, paquetes ni acciones externas.',
      maintenanceMode: 'maintenance-notes',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-maintenance-risk-review',
      label: 'Revisión de riesgos de mantenimiento',
      itemType: 'allowed-archive-maintenance-item',
      description:
        'Evaluación conceptual de riesgos de regresión, mezcla de proyectos, pérdida de boundaries o confusión con producción.',
      maintenanceMode: 'read-only-qa',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-archive-boundary-statement',
      label: 'Declaración de límite de archivo',
      itemType: 'allowed-archive-maintenance-item',
      description:
        'Texto local que aclara que el archivo es conceptual y no representa backup real, exportación real, ZIP real, PDF real ni storage externo.',
      maintenanceMode: 'boundary-preservation',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-anti-mix-maintenance-check',
      label: 'Chequeo anti-mezcla de mantenimiento',
      itemType: 'allowed-archive-maintenance-item',
      description:
        'Revisión conceptual de rutas permitidas e imports para impedir mezcla con otros proyectos ORBI.',
      maintenanceMode: 'anti-mix-review',
      requiresHumanReview: true,
    },
    {
      itemId: 'allowed-human-maintenance-note',
      label: 'Nota humana de mantenimiento',
      itemType: 'allowed-archive-maintenance-item',
      description:
        'Nota conceptual para responsables humanos, sin ejecutar acciones reales ni crear compromisos externos.',
      maintenanceMode: 'human-governance',
      requiresHumanReview: true,
    },
  ];

export const PV_METRICS_BLOCKED_ARCHIVE_MAINTENANCE_ITEMS_MOCK: PVMetricsBlockedArchiveMaintenanceItem[] =
  [
    {
      itemId: 'blocked-real-backup',
      label: 'Backup real',
      itemType: 'blocked-archive-maintenance-item',
      severity: 'critical',
      reason:
        'El bloque no puede crear, descargar, subir, empaquetar ni sincronizar backups reales.',
      safeAlternative:
        'Mantener únicamente una representación conceptual del estado archivado.',
    },
    {
      itemId: 'blocked-real-archive-package',
      label: 'Paquete real de archivo',
      itemType: 'blocked-archive-maintenance-item',
      severity: 'critical',
      reason:
        'No se puede crear ZIP, PDF, APK, instalador, ejecutable, bundle descargable ni paquete de release.',
      safeAlternative:
        'Usar documentación local y mock data sin empaquetado productivo.',
    },
    {
      itemId: 'blocked-real-storage',
      label: 'Storage real o persistencia',
      itemType: 'blocked-archive-maintenance-item',
      severity: 'critical',
      reason:
        'No se puede usar backend, base de datos real, storage externo, localStorage, IndexedDB ni sincronización de archivos.',
      safeAlternative:
        'Mantener datos mock en constantes TypeScript read-only.',
    },
    {
      itemId: 'blocked-real-maintenance-action',
      label: 'Acción real de mantenimiento',
      itemType: 'blocked-archive-maintenance-item',
      severity: 'critical',
      reason:
        'No se puede ejecutar migración real, limpieza real, actualización remota, patch productivo ni operation sobre sistemas reales.',
      safeAlternative:
        'Registrar solo notas conceptuales y criterios QA locales.',
    },
    {
      itemId: 'blocked-real-production-transition',
      label: 'Transición productiva',
      itemType: 'blocked-archive-maintenance-item',
      severity: 'critical',
      reason:
        'El archivo conceptual no puede convertirse en release, piloto real, contrato, aprobación de producción ni entrega legal.',
      safeAlternative:
        'Reforzar que cualquier paso real debe ocurrir fuera de la app y con alcance humano separado.',
    },
    {
      itemId: 'blocked-real-data-traceability',
      label: 'Trazabilidad real',
      itemType: 'blocked-archive-maintenance-item',
      severity: 'critical',
      reason:
        'No se puede crear trazabilidad a cliente real, planta real, activo real, infraestructura real, evento real o evidencia operacional real.',
      safeAlternative:
        'Usar referencias mock, genéricas y no identificables.',
    },
  ];

export const PV_METRICS_ARCHIVE_MAINTENANCE_PRINCIPLES_MOCK: PVMetricsArchiveMaintenancePrinciple[] =
  [
    {
      principleId: 'principle-archive-is-conceptual',
      label: 'Archivo conceptual',
      itemType: 'archive-maintenance-principle',
      description:
        'El archivo es una representación local del estado demo; no crea backup, paquete, storage ni exportación real.',
      mandatory: true,
    },
    {
      principleId: 'principle-read-only-maintenance',
      label: 'Mantenimiento read-only',
      itemType: 'archive-maintenance-principle',
      description:
        'El mantenimiento permitido es revisión conceptual, QA estático y documentación; no muta sistemas ni datos reales.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-persistence',
      label: 'Sin persistencia real',
      itemType: 'archive-maintenance-principle',
      description:
        'No usar backend, base de datos real, localStorage, IndexedDB, storage externo ni sincronización.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-production-bridge',
      label: 'Sin puente productivo',
      itemType: 'archive-maintenance-principle',
      description:
        'El bloque no puede actuar como puente hacia release real, piloto real, operación real o cumplimiento regulatorio.',
      mandatory: true,
    },
    {
      principleId: 'principle-anti-mix',
      label: 'Anti-mezcla ORBI',
      itemType: 'archive-maintenance-principle',
      description:
        'El archivo conceptual pertenece exclusivamente a ORBI PVMetrics IA y no puede importar lógica de otros proyectos ORBI.',
      mandatory: true,
    },
    {
      principleId: 'principle-no-real-files',
      label: 'Sin archivos reales',
      itemType: 'archive-maintenance-principle',
      description:
        'El bloque no puede crear archivos reales de respaldo, snapshots descargables, PDFs, ZIPs, APKs, instaladores ni ejecutables.',
      mandatory: true,
    },
  ];

export const PV_METRICS_ARCHIVE_MAINTENANCE_DOMAINS_MOCK: PVMetricsArchiveMaintenanceDomain[] =
  [
    {
      domainId: 'domain-archive-roadmap-state',
      label: 'Estado de roadmap archivado',
      itemType: 'archive-maintenance-domain',
      maintenanceMode: 'archive-state',
      description:
        'Revisión conceptual de bloques cerrados 1O-T, 1O-U, 1O-V, 1O-W y 1O-X.',
    },
    {
      domainId: 'domain-read-only-qa',
      label: 'QA read-only',
      itemType: 'archive-maintenance-domain',
      maintenanceMode: 'read-only-qa',
      description:
        'Validación de build, TypeScript, checklist, manifest, README y ausencia de regresiones sandbox.',
    },
    {
      domainId: 'domain-boundary-preservation',
      label: 'Preservación de boundaries',
      itemType: 'archive-maintenance-domain',
      maintenanceMode: 'boundary-preservation',
      description:
        'Validación de que no se agregan acciones reales, sistemas reales, storage real ni artefactos reales.',
    },
    {
      domainId: 'domain-maintenance-notes',
      label: 'Notas de mantenimiento',
      itemType: 'archive-maintenance-domain',
      maintenanceMode: 'maintenance-notes',
      description:
        'Notas conceptuales para mantenimiento futuro sin migraciones, instalaciones ni operaciones reales.',
    },
    {
      domainId: 'domain-anti-mix',
      label: 'Anti-mix architecture',
      itemType: 'archive-maintenance-domain',
      maintenanceMode: 'anti-mix-review',
      description:
        'Verificación de rutas permitidas y ausencia de imports cruzados con otros proyectos ORBI.',
    },
    {
      domainId: 'domain-human-governance',
      label: 'Gobernanza humana',
      itemType: 'archive-maintenance-domain',
      maintenanceMode: 'human-governance',
      description:
        'Confirmación de que cualquier acción real de archivo, backup, entrega o mantenimiento queda fuera de la app.',
    },
  ];

export const PV_METRICS_ARCHIVE_MAINTENANCE_GATES_MOCK: PVMetricsArchiveMaintenanceGate[] =
  [
    {
      gateId: 'gate-archive-build-clean',
      label: 'Build limpio',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'La app debe compilar correctamente antes de considerar el archivo conceptual como válido.',
    },
    {
      gateId: 'gate-archive-typescript-clean',
      label: 'TypeScript limpio',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'TypeScript debe estar libre de errores para validar mantenimiento read-only.',
    },
    {
      gateId: 'gate-archive-no-real-backup',
      label: 'Sin backup real',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'No deben existir backups, descargas, subidas, ZIP, PDF, APK, instaladores ni paquetes reales.',
    },
    {
      gateId: 'gate-archive-no-persistence',
      label: 'Sin persistencia real',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'No debe existir backend, base de datos real, localStorage, IndexedDB, storage externo ni sincronización.',
    },
    {
      gateId: 'gate-archive-no-real-systems',
      label: 'Sin sistemas reales',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'No deben existir conexiones reales a SCADA, medidores, CEN, APIs, endpoints, WebRTC, Socket.IO o SDP.',
    },
    {
      gateId: 'gate-archive-no-production-transition',
      label: 'Sin transición productiva',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'No debe existir release real, piloto real, aprobación productiva, contrato real ni entrega legal real.',
    },
    {
      gateId: 'gate-archive-no-cross-project',
      label: 'Sin mezcla ORBI',
      itemType: 'archive-maintenance-gate',
      required: true,
      passed: true,
      description:
        'No debe existir importación de rutas, stores, providers, componentes ni lógica de otros proyectos ORBI.',
    },
  ];

export const PV_METRICS_ARCHIVE_MAINTENANCE_ROLES_MOCK: PVMetricsArchiveMaintenanceRole[] =
  [
    {
      roleId: 'role-archive-demo-owner',
      label: 'Archive Demo Owner',
      itemType: 'archive-maintenance-role',
      reviewerRole: 'demo-owner',
      required: true,
      description:
        'Revisa que el estado demo archivado sea conceptual, legible, read-only y sin promesas productivas.',
    },
    {
      roleId: 'role-archive-qa-owner',
      label: 'Archive QA Owner',
      itemType: 'archive-maintenance-role',
      reviewerRole: 'qa-owner',
      required: true,
      description:
        'Revisa build, TypeScript, QA checklist, manifest, README y consistencia de cierre read-only.',
    },
    {
      roleId: 'role-archive-security-owner',
      label: 'Archive Security Owner',
      itemType: 'archive-maintenance-role',
      reviewerRole: 'security-owner',
      required: true,
      description:
        'Revisa ausencia de storage real, credenciales, APIs reales, SCADA, CEN, backend, localStorage, IndexedDB y acciones externas.',
    },
    {
      roleId: 'role-archive-technical-owner',
      label: 'Archive Technical Owner',
      itemType: 'archive-maintenance-role',
      reviewerRole: 'technical-owner',
      required: true,
      description:
        'Revisa arquitectura standalone, rutas permitidas, imports, mock data local y ausencia de mezcla ORBI.',
    },
    {
      roleId: 'role-archive-business-observer',
      label: 'Archive Business Observer',
      itemType: 'archive-maintenance-role',
      reviewerRole: 'business-owner',
      required: false,
      description:
        'Rol observador conceptual sin aprobación comercial, contractual, productiva ni legal real.',
    },
    {
      roleId: 'role-archive-observer',
      label: 'Archive Observer',
      itemType: 'archive-maintenance-role',
      reviewerRole: 'observer',
      required: false,
      description:
        'Rol de lectura conceptual sin capacidad de aprobar backups, releases, contratos, entregas ni acciones externas.',
    },
  ];

export const PV_METRICS_ARCHIVE_MAINTENANCE_RISK_REGISTER_MOCK: PVMetricsArchiveMaintenanceRiskRegisterItem[] =
  [
    {
      riskId: 'risk-archive-misread-as-backup',
      label: 'Archivo conceptual interpretado como backup real',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar que no existe backup real, ZIP real, PDF real, descarga, subida, storage externo ni persistencia real.',
    },
    {
      riskId: 'risk-maintenance-misread-as-production-support',
      label: 'Mantenimiento interpretado como soporte productivo',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Reforzar que el mantenimiento es read-only, conceptual, no operativo y sin conexión a sistemas reales.',
    },
    {
      riskId: 'risk-archive-storage-regression',
      label: 'Regresión hacia persistencia real',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear backend, base de datos real, localStorage, IndexedDB, storage externo, sincronización, uploads y downloads.',
    },
    {
      riskId: 'risk-cross-project-import',
      label: 'Import cruzado ORBI',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Mantener rutas, imports, providers, stores, componentes y servicios exclusivamente dentro de ORBI PVMetrics IA.',
    },
    {
      riskId: 'risk-production-transition',
      label: 'Transición accidental a producción',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear release real, piloto real, contrato real, artefactos productivos, aprobaciones reales y entregables legales reales.',
    },
    {
      riskId: 'risk-real-file-generation',
      label: 'Generación accidental de archivos reales',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Bloquear snapshots descargables, PDFs, ZIPs, APKs, instaladores, ejecutables, bundles, backups y exportaciones productivas.',
    },
    {
      riskId: 'risk-operational-maintenance-confusion',
      label: 'Confusión con mantenimiento operacional',
      itemType: 'archive-maintenance-risk-register-item',
      severity: 'critical',
      mitigation:
        'Declarar ausencia de SCADA, medidores, CEN, APIs reales, telecontrol, setpoints, comandos BESS, comandos de inversores y SCADA ACK.',
    },
  ];

export const PV_METRICS_ARCHIVE_MAINTENANCE_EXIT_CRITERIA_MOCK: PVMetricsArchiveMaintenanceExitCriterion[] =
  [
    {
      criterionId: 'exit-archive-types-ready',
      label: 'Tipos listos',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los tipos TypeScript para Controlled Client Demo Archive & Read-Only Maintenance están implementados.',
    },
    {
      criterionId: 'exit-archive-mock-data-ready',
      label: 'Mock data listo',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'El mock data local queda poblado con purpose, archived blocks, allowed/blocked items, principles, domains, gates, roles, risks, exit criteria y boundary.',
    },
    {
      criterionId: 'exit-archive-blocks-represented',
      label: 'Bloques archivados representados',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'Los bloques 1O-T, 1O-U, 1O-V, 1O-W y 1O-X quedan representados como conceptualmente archivados.',
    },
    {
      criterionId: 'exit-archive-no-real-backup',
      label: 'Sin backup real',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea, descarga, sube, empaqueta, sincroniza ni distribuye backup real.',
    },
    {
      criterionId: 'exit-archive-no-real-files',
      label: 'Sin archivos reales',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se crea ZIP real, PDF real, APK real, snapshot descargable, instalador, ejecutable, bundle ni paquete productivo.',
    },
    {
      criterionId: 'exit-archive-no-persistence',
      label: 'Sin persistencia real',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se usa backend, base de datos real, storage externo, localStorage, IndexedDB ni sincronización.',
    },
    {
      criterionId: 'exit-archive-no-real-systems',
      label: 'Sin sistemas reales',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se conecta a SCADA, medidores, CEN, APIs reales, endpoints, WebRTC, Socket.IO ni SDP.',
    },
    {
      criterionId: 'exit-archive-no-real-maintenance-action',
      label: 'Sin acción real de mantenimiento',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'No se ejecutan migraciones reales, limpiezas reales, patches productivos, actualizaciones remotas ni operaciones sobre sistemas reales.',
    },
    {
      criterionId: 'exit-archive-no-production-transition',
      label: 'Sin transición productiva',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'No hay release real, piloto real, aprobación productiva, contrato real, entrega legal real ni producción real.',
    },
    {
      criterionId: 'exit-archive-boundary-declared',
      label: 'Archive & Maintenance Boundary declarado',
      itemType: 'archive-maintenance-exit-criterion',
      required: true,
      passed: true,
      description:
        'El límite de seguridad del archivo conceptual y mantenimiento read-only queda declarado dentro del pack mock.',
    },
  ];

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_ARCHIVE_READ_ONLY_MAINTENANCE_PACK_MOCK: PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack =
  {
    packId:
      'pvmetrics-controlled-client-demo-archive-read-only-maintenance-pack-mock',
    generatedAtLabel: getGeneratedAtLabel(),
    appName: 'ORBI PVMetrics IA',
    roadmapBlock:
      '1O-Y — Controlled Client Demo Archive & Read-Only Maintenance',
    module:
      '1O-Y.1B — Client Demo Archive & Read-Only Maintenance Mock Data',
    internalVersion,
    status: 'mock-data-ready',
    archiveMaintenancePurpose:
      PV_METRICS_ARCHIVE_MAINTENANCE_PURPOSE_MOCK,
    archivedDemoClosureBlocks:
      PV_METRICS_ARCHIVED_DEMO_CLOSURE_BLOCKS_MOCK,
    allowedArchiveMaintenanceItems:
      PV_METRICS_ALLOWED_ARCHIVE_MAINTENANCE_ITEMS_MOCK,
    blockedArchiveMaintenanceItems:
      PV_METRICS_BLOCKED_ARCHIVE_MAINTENANCE_ITEMS_MOCK,
    archiveMaintenancePrinciples:
      PV_METRICS_ARCHIVE_MAINTENANCE_PRINCIPLES_MOCK,
    archiveMaintenanceDomains:
      PV_METRICS_ARCHIVE_MAINTENANCE_DOMAINS_MOCK,
    archiveMaintenanceGates: PV_METRICS_ARCHIVE_MAINTENANCE_GATES_MOCK,
    archiveMaintenanceRoles: PV_METRICS_ARCHIVE_MAINTENANCE_ROLES_MOCK,
    archiveMaintenanceRiskRegister:
      PV_METRICS_ARCHIVE_MAINTENANCE_RISK_REGISTER_MOCK,
    archiveMaintenanceExitCriteria:
      PV_METRICS_ARCHIVE_MAINTENANCE_EXIT_CRITERIA_MOCK,
    archiveMaintenanceBoundary:
      'Controlled Client Demo Archive & Read-Only Maintenance mock data. Todo es local, conceptual, archive-only, maintenance-read-only, demo-only y no productivo. No crea archivo real de respaldo, no crea ZIP real, no crea PDF real, no crea backup real, no crea snapshot descargable real, no crea exportación productiva, no sube archivos, no descarga archivos, no usa storage externo, no usa localStorage, no usa IndexedDB, no usa backend, no usa base de datos real, no convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea entregable legal real, no crea PowerPoint real, no crea APK real, no crea instalador real, no crea ejecutable real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no usa WebRTC, no usa Socket.IO, no usa SDP, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial, no reporte regulatorio, no trazabilidad a cliente/planta/activo/infraestructura real y no evidencia operacional real.',
    nextRecommendedModule:
      '1O-Y.2A — Client Demo Archive & Read-Only Maintenance Visual Card',
  };
