const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_CLIENT_DEMO_ARCHIVE_READ_ONLY_MAINTENANCE_BLUEPRINT =
  {
    id: 'pvmetrics-controlled-client-demo-archive-read-only-maintenance-blueprint',
    appName: 'ORBI PVMetrics IA',
    roadmapBlock:
      '1O-Y — Controlled Client Demo Archive & Read-Only Maintenance',
    module:
      '1O-Y.0 — Controlled Client Demo Archive & Read-Only Maintenance Blueprint',
    internalVersion:
      '0.1O-Y.0-controlled-client-demo-archive-read-only-maintenance-blueprint',
    generatedAtLabel: getGeneratedAtLabel(),

    blueprintStatus: 'CONCEPT_ONLY_NO_REAL_ARCHIVE_NO_REAL_BACKUP',
    blueprintStatusLabel:
      'CLIENT DEMO ARCHIVE & READ-ONLY MAINTENANCE — SOLO BLUEPRINT CONCEPTUAL',

    purpose:
      'Definir una capa conceptual de archivo controlado y mantenimiento read-only para la demo cliente de ORBI PVMetrics IA, conservando la app como demo local, mock, no productiva, sin backup real, sin ZIP real, sin PDF real, sin storage externo, sin localStorage, sin IndexedDB, sin backend, sin base de datos real y sin acciones externas.',

    archiveMaintenancePurpose: [
      'Consolidar el estado final de la demo cliente después del cierre maestro 1O-X.',
      'Definir cómo mantener la demo en modo read-only conceptual sin crear archivos reales, backups reales, paquetes descargables ni almacenamiento externo.',
      'Preservar el valor demostrativo de ORBI PVMetrics IA sin convertirlo en release real, piloto real, producto operacional ni artefacto regulatorio.',
      'Establecer límites para mantenimiento futuro: solo documentación, QA conceptual, revisión de compatibilidad y prevención de regresiones sandbox.',
      'Preparar una base segura para futuros tipos, mock data, visual card, export text box, wizard integration y cierre QA del bloque 1O-Y.',
    ],

    archivedDemoClosureBlocks: [
      {
        id: 'archived-block-1o-t',
        label: '1O-T — Controlled Client Demo Evidence Freeze',
        description:
          'Bloque de evidencia demo congelada, local, mock, read-only y sin evidencia operacional real.',
        archiveStatus: 'conceptually-archived',
      },
      {
        id: 'archived-block-1o-u',
        label: '1O-U — Controlled Client Demo Delivery Readiness',
        description:
          'Bloque de readiness conceptual de entrega demo sin envíos, reuniones, links, invitaciones ni artefactos reales.',
        archiveStatus: 'conceptually-archived',
      },
      {
        id: 'archived-block-1o-v',
        label: '1O-V — Controlled Client Demo Presentation Script',
        description:
          'Bloque de guion controlado sin video, audio, voz, avatar, PowerPoint ni entrega externa real.',
        archiveStatus: 'conceptually-archived',
      },
      {
        id: 'archived-block-1o-w',
        label: '1O-W — Controlled Client Demo Final Review Board',
        description:
          'Bloque de mesa conceptual de revisión final sin aprobación real, comité real, acta legal real ni decisión productiva.',
        archiveStatus: 'conceptually-archived',
      },
      {
        id: 'archived-block-1o-x',
        label: '1O-X — Controlled Client Demo Master Closure',
        description:
          'Bloque de cierre maestro conceptual sin release real, sin aprobación productiva, sin artefactos reales y sin acciones externas.',
        archiveStatus: 'conceptually-archived',
      },
    ],

    allowedArchiveMaintenanceItems: [
      {
        id: 'allowed-read-only-demo-state-review',
        label: 'Revisión read-only del estado demo',
        description:
          'Revisión conceptual del estado final de la demo, roadmap, QA, manifest, README y límites de seguridad.',
        requiresHumanReview: true,
      },
      {
        id: 'allowed-compatibility-note',
        label: 'Nota de compatibilidad conceptual',
        description:
          'Registro textual de compatibilidad futura sin ejecutar migraciones reales, instalaciones, paquetes ni acciones externas.',
        requiresHumanReview: true,
      },
      {
        id: 'allowed-maintenance-risk-review',
        label: 'Revisión de riesgos de mantenimiento',
        description:
          'Evaluación conceptual de riesgos de regresión, mezcla de proyectos, pérdida de boundaries o confusión con producción.',
        requiresHumanReview: true,
      },
      {
        id: 'allowed-archive-boundary-statement',
        label: 'Declaración de límite de archivo',
        description:
          'Texto local que aclara que el archivo es conceptual y no representa backup real, exportación real, ZIP real, PDF real ni storage externo.',
        requiresHumanReview: true,
      },
    ],

    blockedArchiveMaintenanceItems: [
      {
        id: 'blocked-real-backup',
        label: 'Backup real',
        severity: 'critical',
        reason:
          'El bloque no puede crear, descargar, subir, empaquetar ni sincronizar backups reales.',
        safeAlternative:
          'Mantener únicamente una representation conceptual del estado archivado.',
      },
      {
        id: 'blocked-real-archive-package',
        label: 'Paquete real de archivo',
        severity: 'critical',
        reason:
          'No se puede crear ZIP, PDF, APK, instalador, ejecutable, bundle descargable ni paquete de release.',
        safeAlternative:
          'Usar documentación local y mock data sin empaquetado productivo.',
      },
      {
        id: 'blocked-real-storage',
        label: 'Storage real o persistencia',
        severity: 'critical',
        reason:
          'No se puede usar backend, base de datos real, storage externo, localStorage, IndexedDB ni sincronización de archivos.',
        safeAlternative:
          'Mantener datos mock en constantes TypeScript read-only.',
      },
      {
        id: 'blocked-real-maintenance-action',
        label: 'Acción real de mantenimiento',
        severity: 'critical',
        reason:
          'No se puede ejecutar migración real, limpieza real, actualización remota, patch productivo ni operación sobre sistemas reales.',
        safeAlternative:
          'Registrar solo notas conceptuales y criterios QA locales.',
      },
      {
        id: 'blocked-real-production-transition',
        label: 'Transición productiva',
        severity: 'critical',
        reason:
          'El archivo conceptual no puede convertirse en release, piloto real, contrato, aprobación de producción ni entrega legal.',
        safeAlternative:
          'Reforzar que cualquier paso real debe ocurrir fuera de la app y con alcance humano separado.',
      },
    ],

    archiveMaintenancePrinciples: [
      {
        id: 'principle-archive-is-conceptual',
        label: 'Archivo conceptual',
        description:
          'El archivo es una representación local del estado demo; no crea backup, paquete, storage ni exportación real.',
        mandatory: true,
      },
      {
        id: 'principle-read-only-maintenance',
        label: 'Mantenimiento read-only',
        description:
          'El mantenimiento permitido es revisión conceptual, QA estático y documentación; no muta sistemas ni datos reales.',
        mandatory: true,
      },
      {
        id: 'principle-no-persistence',
        label: 'Sin persistencia real',
        description:
          'No usar backend, base de datos real, localStorage, IndexedDB, storage externo ni sincronización.',
        mandatory: true,
      },
      {
        id: 'principle-no-production-bridge',
        label: 'Sin puente productivo',
        description:
          'El bloque no puede actuar como puente hacia release real, piloto real, operación real o cumplimiento regulatorio.',
        mandatory: true,
      },
      {
        id: 'principle-anti-mix',
        label: 'Anti-mezcla ORBI',
        description:
          'El archivo conceptual pertenece exclusivamente a ORBI PVMetrics IA y no puede importar lógica de otros proyectos ORBI.',
        mandatory: true,
      },
    ],

    archiveMaintenanceDomains: [
      {
        id: 'domain-archive-roadmap-state',
        label: 'Estado de roadmap archivado',
        description:
          'Revisión conceptual de bloques cerrados 1O-T, 1O-U, 1O-V, 1O-W y 1O-X.',
        reviewMode: 'archive-state',
      },
      {
        id: 'domain-read-only-qa',
        label: 'QA read-only',
        description:
          'Validación de build, TypeScript, checklist, manifest, README y ausencia de regresiones sandbox.',
        reviewMode: 'read-only-qa',
      },
      {
        id: 'domain-boundary-preservation',
        label: 'Preservación de boundaries',
        description:
          'Validación de que no se agregan acciones reales, sistemas reales, storage real ni artefactos reales.',
        reviewMode: 'boundary-preservation',
      },
      {
        id: 'domain-maintenance-notes',
        label: 'Notas de mantenimiento',
        description:
          'Notas conceptuales para mantenimiento futuro sin migraciones, instalaciones ni operaciones reales.',
        reviewMode: 'maintenance-notes',
      },
      {
        id: 'domain-anti-mix',
        label: 'Anti-mix architecture',
        description:
          'Verificación de rutas permitidas y ausencia de imports cruzados con otros proyectos ORBI.',
        reviewMode: 'anti-mix-review',
      },
    ],

    archiveMaintenanceGates: [
      {
        id: 'gate-archive-build-clean',
        label: 'Build limpio',
        required: true,
        description:
          'La app debe compilar correctamente antes de considerar el archivo conceptual como válido.',
      },
      {
        id: 'gate-archive-typescript-clean',
        label: 'TypeScript limpio',
        required: true,
        description:
          'TypeScript debe estar libre de errores para validar mantenimiento read-only.',
      },
      {
        id: 'gate-archive-no-real-backup',
        label: 'Sin backup real',
        required: true,
        description:
          'No deben existir backups, descargas, subidas, ZIP, PDF, APK, instaladores ni paquetes reales.',
      },
      {
        id: 'gate-archive-no-persistence',
        label: 'Sin persistencia real',
        required: true,
        description:
          'No debe existir backend, base de datos real, localStorage, IndexedDB, storage externo ni sincronización.',
      },
      {
        id: 'gate-archive-no-real-systems',
        label: 'Sin sistemas reales',
        required: true,
        description:
          'No deben existir conexiones reales a SCADA, medidores, CEN, APIs, endpoints, WebRTC, Socket.IO o SDP.',
      },
      {
        id: 'gate-archive-no-production-transition',
        label: 'Sin transición productiva',
        required: true,
        description:
          'No debe existir release real, piloto real, aprobación productiva, contrato real ni entrega legal real.',
      },
    ],

    archiveMaintenanceRoles: [
      {
        id: 'role-archive-demo-owner',
        label: 'Archive Demo Owner',
        reviewerRole: 'demo-owner',
        required: true,
        description:
          'Revisa que el estado demo archivado sea conceptual, legible y sin promesas productivas.',
      },
      {
        id: 'role-archive-qa-owner',
        label: 'Archive QA Owner',
        reviewerRole: 'qa-owner',
        required: true,
        description:
          'Revisa build, TypeScript, QA checklist, manifest, README y consistencia de cierre read-only.',
      },
      {
        id: 'role-archive-security-owner',
        label: 'Archive Security Owner',
        reviewerRole: 'security-owner',
        required: true,
        description:
          'Revisa ausencia de storage real, credenciales, APIs reales, SCADA, CEN, backend, localStorage e IndexedDB.',
      },
      {
        id: 'role-archive-technical-owner',
        label: 'Archive Technical Owner',
        reviewerRole: 'technical-owner',
        required: true,
        description:
          'Revisa arquitectura standalone, rutas permitidas, imports, mock data local y ausencia de mezcla ORBI.',
      },
    ],

    archiveMaintenanceRiskRegister: [
      {
        id: 'risk-archive-misread-as-backup',
        label: 'Archivo conceptual interpretado como backup real',
        severity: 'critical',
        mitigation:
          'Declarar que no existe backup real, ZIP real, PDF real, descarga, subida, storage externo ni persistencia real.',
      },
      {
        id: 'risk-maintenance-misread-as-production-support',
        label: 'Mantenimiento interpretado como soporte productivo',
        severity: 'critical',
        mitigation:
          'Reforzar que el mantenimiento es read-only, conceptual y no operativo.',
      },
      {
        id: 'risk-archive-storage-regression',
        label: 'Regresión hacia persistencia real',
        severity: 'critical',
        mitigation:
          'Bloquear backend, base de datos real, localStorage, IndexedDB, storage externo y sincronización.',
      },
      {
        id: 'risk-cross-project-import',
        label: 'Import cruzado ORBI',
        severity: 'critical',
        mitigation:
          'Mantener rutas, imports, providers, stores, componentes y servicios exclusivamente dentro de ORBI PVMetrics IA.',
      },
      {
        id: 'risk-production-transition',
        label: 'Transición accidental a producción',
        severity: 'critical',
        mitigation:
          'Bloquear release real, piloto real, contrato real, artefactos productivos y aprobaciones reales.',
      },
    ],

    archiveMaintenanceExitCriteria: [
      'Blueprint de Controlled Client Demo Archive & Read-Only Maintenance creado.',
      'Archive & Maintenance Purpose declarado.',
      'Archived Demo Closure Blocks declarados.',
      'Allowed Archive & Maintenance Items declarados.',
      'Blocked Archive & Maintenance Items declarados.',
      'Archive & Maintenance Principles declarados.',
      'Archive & Maintenance Domains declarados.',
      'Archive & Maintenance Gates declarados.',
      'Archive & Maintenance Roles declarados.',
      'Archive & Maintenance Risk Register declarado.',
      'Archive & Maintenance Exit Criteria declarado.',
      'Archive & Maintenance Boundary declarado.',
      'Next Roadmap 1O-Y declarado.',
      'No se crea backup real.',
      'No se crea ZIP real.',
      'No se crea PDF real.',
      'No se usa storage externo.',
      'No se usa localStorage.',
      'No se usa IndexedDB.',
      'No se crea transición productiva.',
      'Build correcto.',
      'TypeScript limpio.',
    ],

    archiveMaintenanceBoundary:
      'Este blueprint solo define archivo conceptual y mantenimiento read-only de la demo cliente. No crea archivo real de respaldo, no crea ZIP real, no crea PDF real, no crea backup real, no crea snapshot descargable real, no crea exportación productiva, no sube archivos, no descarga archivos, no usa storage externo, no usa localStorage, no usa IndexedDB, no usa backend, no usa base de datos real, no convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea entregable legal real, no crea PowerPoint real, no crea APK real, no crea instalador real, no crea ejecutable real, no crea release productiva, no graba video real, no crea audio real, no crea voz real, no crea avatar real, no usa WebRTC, no usa Socket.IO, no usa SDP, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no usa credenciales, no tokens, no secrets, no API keys, no passwords, no lee SCADA real, no lee medidores reales, no llama APIs reales, no envía CEN, no POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos BESS, no comandos inversores, no SCADA ACK, no forecast oficial, no reporte regulatorio, no trazabilidad a cliente/planta/activo/infraestructura real y no evidencia operacional real.',

    nextRoadmap: [
      '1O-Y.1A — Client Demo Archive & Read-Only Maintenance Types',
      '1O-Y.1B — Client Demo Archive & Read-Only Maintenance Mock Data',
      '1O-Y.2A — Client Demo Archive & Read-Only Maintenance Visual Card',
      '1O-Y.2B — Client Demo Archive & Read-Only Maintenance Export Text Box',
      '1O-Y.3A — Client Demo Archive & Read-Only Maintenance Wizard Integration',
      '1O-Y.4A — Client Demo Archive & Read-Only Maintenance Final QA & Closure',
    ],

    nextRecommendedModule:
      '1O-Y.1A — Client Demo Archive & Read-Only Maintenance Types',
  } as const;
