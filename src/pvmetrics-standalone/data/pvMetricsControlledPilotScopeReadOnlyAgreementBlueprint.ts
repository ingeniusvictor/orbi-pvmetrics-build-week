const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_PILOT_SCOPE_READ_ONLY_AGREEMENT_BLUEPRINT =
  {
    id: 'pvmetrics-controlled-pilot-scope-read-only-agreement-blueprint',
    appName: 'ORBI PVMetrics IA',
    roadmapBlock:
      '1O-P — Controlled Pilot Scope & Read-Only Integration Agreement',
    module:
      '1O-P.0 — Controlled Pilot Scope & Read-Only Integration Agreement Blueprint',
    internalVersion:
      '0.1O-P.0-controlled-pilot-scope-read-only-agreement-blueprint',
    generatedAtLabel: getGeneratedAtLabel(),

    blueprintStatus: 'CONCEPT_ONLY_NO_REAL_INTEGRATION',
    blueprintStatusLabel:
      'CONTROLLED PILOT SCOPE — SOLO BLUEPRINT CONCEPTUAL READ-ONLY',

    purpose:
      'Preparar una estructura conceptual para definir el alcance seguro de un piloto futuro de ORBI PVMetrics IA, limitado a integración read-only, datos sanitizados, aprobación humana y sin impacto operacional.',

    pilotScopePurpose: [
      'Definir qué podría considerarse dentro de un piloto futuro read-only.',
      'Bloquear cualquier uso productivo, operativo o regulatorio prematuro.',
      'Separar demo local, piloto controlado y producción real como etapas distintas.',
      'Establecer principios mínimos antes de cualquier conector real.',
      'Forzar revisión humana técnica, QA, comercial y cliente antes de avanzar.',
    ],

    allowedPilotScopeItems: [
      'Evaluación conceptual de datos históricos sanitizados.',
      'Revisión de estructura de reportes no oficiales.',
      'Validación de flujo visual con datos mock o muestras anonimizadas.',
      'Definición de requerimientos de integración read-only futura.',
      'Revisión de seguridad, accesos y límites antes de cualquier conexión real.',
      'Documento conceptual de alcance sujeto a aprobación humana.',
    ],

    blockedPilotScopeItems: [
      'Conexión SCADA real directa.',
      'Lectura directa de medidores reales.',
      'Credenciales, tokens o secrets productivos.',
      'Telecontrol, setpoints, comandos BESS, comandos inversores o SCADA ACK.',
      'Envío CEN o reportes regulatorios reales.',
      'Producción real o uso operacional en despacho.',
      'Backend productivo, base de datos real o almacenamiento de datos sensibles.',
      'Compromisos comerciales definitivos sin revisión legal/comercial.',
    ],

    readOnlyIntegrationPrinciples: [
      {
        id: 'principle-read-only-first',
        label: 'Read-only primero',
        description:
          'Todo piloto futuro debe comenzar con acceso de solo lectura y sin capacidad de escritura.',
        mandatory: true,
      },
      {
        id: 'principle-sanitized-data',
        label: 'Datos sanitizados',
        description:
          'Toda muestra debe estar anonimizada, sanitizada o aprobada antes de uso.',
        mandatory: true,
      },
      {
        id: 'principle-no-operational-impact',
        label: 'Sin impacto operacional',
        description:
          'El piloto no debe modificar activos, setpoints, estados, alarmas, comandos ni reportes oficiales.',
        mandatory: true,
      },
      {
        id: 'principle-human-approval',
        label: 'Aprobación humana',
        description:
          'Toda transición de demo a piloto requiere validación técnica, QA, comercial y cliente.',
        mandatory: true,
      },
    ],

    dataAccessBoundaries: [
      {
        id: 'boundary-no-secrets',
        label: 'Sin secretos productivos',
        allowed: false,
        description:
          'No se deben solicitar, guardar ni pegar credenciales, tokens o secrets dentro de esta app.',
      },
      {
        id: 'boundary-approved-sample',
        label: 'Muestra aprobada',
        allowed: true,
        description:
          'Solo se permite considerar muestras sanitizadas y aprobadas para diseño conceptual.',
      },
      {
        id: 'boundary-no-direct-scada',
        label: 'Sin SCADA directo',
        allowed: false,
        description:
          'No existe conexión directa a SCADA real desde este bloque.',
      },
      {
        id: 'boundary-no-meter-live',
        label: 'Sin medidores live',
        allowed: false,
        description:
          'No existe lectura live de medidores físicos o comerciales desde este bloque.',
      },
    ],

    clientApprovalGates: [
      {
        id: 'client-gate-scope',
        label: 'Aprobación de alcance cliente',
        required: true,
        description:
          'El cliente debe aprobar claramente el alcance read-only antes de cualquier piloto.',
      },
      {
        id: 'client-gate-data',
        label: 'Aprobación de datos cliente',
        required: true,
        description:
          'El cliente debe aprobar qué datos sanitizados podrían revisarse en piloto.',
      },
      {
        id: 'client-gate-boundaries',
        label: 'Aprobación de límites operacionales',
        required: true,
        description:
          'El cliente debe aceptar que no habrá telecontrol, setpoints, comandos ni reportes oficiales.',
      },
    ],

    technicalApprovalGates: [
      {
        id: 'tech-gate-architecture',
        label: 'Revisión de arquitectura',
        required: true,
        description:
          'Validar que cualquier integración futura sea read-only, reversible, aislada y auditable.',
      },
      {
        id: 'tech-gate-data-contract',
        label: 'Contrato de datos',
        required: true,
        description:
          'Definir estructura esperada de datos antes de implementar cualquier conector real.',
      },
      {
        id: 'tech-gate-environment',
        label: 'Entorno controlado',
        required: true,
        description:
          'Separar demo, sandbox, piloto y producción en ambientes distintos.',
      },
    ],

    qaApprovalGates: [
      {
        id: 'qa-gate-no-write',
        label: 'Validación no-write',
        required: true,
        description:
          'QA debe confirmar que no existe POST/PUT/PATCH/DELETE real ni comandos operacionales.',
      },
      {
        id: 'qa-gate-no-secrets',
        label: 'Validación no-secrets',
        required: true,
        description:
          'QA debe confirmar que no se almacenan credenciales, tokens, secrets ni rutas productivas.',
      },
      {
        id: 'qa-gate-claims',
        label: 'Validación de claims',
        required: true,
        description:
          'QA debe validar que no se promete producción, forecast oficial ni reportes regulatorios.',
      },
    ],

    legalCommercialReviewNotes: [
      'Cualquier piloto futuro requiere revisión comercial y legal antes de compartir propuesta formal.',
      'No se deben comprometer precios, plazos, SLA, integración real o producción desde este blueprint.',
      'Todo documento compartido debe declarar que el alcance es read-only y sujeto a aprobación.',
      'El uso de datos reales debe estar autorizado, acotado, sanitizado y documentado.',
    ],

    pilotRiskRegister: [
      {
        id: 'risk-scope-creep',
        label: 'Crecimiento de alcance no controlado',
        severity: 'high',
        mitigation:
          'Mantener alcance read-only, gates humanos y lista explícita de elementos bloqueados.',
      },
      {
        id: 'risk-secret-exposure',
        label: 'Exposición de secretos',
        severity: 'critical',
        mitigation:
          'Prohibir credenciales/tokens/secrets y exigir revisión QA antes de cualquier integración.',
      },
      {
        id: 'risk-operational-impact',
        label: 'Impacto operacional accidental',
        severity: 'critical',
        mitigation:
          'Bloquear escritura, telecontrol, setpoints, BESS, inversores y SCADA ACK.',
      },
      {
        id: 'risk-regulatory-confusion',
        label: 'Confusión regulatoria',
        severity: 'high',
        mitigation:
          'Declarar que no hay envío CEN ni reportes oficiales/regulatorios desde este piloto conceptual.',
      },
    ],

    pilotExitCriteria: [
      'Blueprint de alcance piloto creado.',
      'Allowed Pilot Scope Items declarados.',
      'Blocked Pilot Scope Items declarados.',
      'Read-Only Integration Principles declarados.',
      'Data Access Boundaries declarados.',
      'Client Approval Gates declarados.',
      'Technical Approval Gates declarados.',
      'QA Approval Gates declarados.',
      'Legal / Commercial Review Notes declaradas.',
      'Pilot Risk Register declarado.',
      'Safety Boundary declarada.',
      'No se crea UI nueva.',
      'No se modifica wizard.',
      'No se crean conectores reales.',
      'No se usan credenciales reales.',
      'No se lee SCADA real.',
      'No se leen medidores reales.',
      'No se envía CEN.',
      'No se ejecuta telecontrol.',
      'No se ejecutan setpoints.',
      'No se ejecutan comandos BESS/inversores.',
      'Build correcto.',
      'TypeScript limpio.',
    ],

    safetyBoundary:
      'Este blueprint solo define alcance conceptual para un piloto futuro read-only. No crea conectores reales, no usa credenciales, no usa tokens, no usa secrets, no lee SCADA real, no lee medidores reales, no envía CEN, no ejecuta POST/PUT/PATCH/DELETE real, no usa backend, no APIs, no base de datos real, no localStorage, no telecontrol, no setpoints, no comandos BESS, no comandos inversores y no habilita producción real.',

    nextRoadmap: [
      '1O-P.1A — Controlled Pilot Scope Types',
      '1O-P.1B — Controlled Pilot Scope Mock Data',
      '1O-P.2A — Pilot Scope & Read-Only Agreement Visual Card',
      '1O-P.2B — Pilot Agreement Export Text Box',
      '1O-P.3A — Pilot Scope Wizard Integration',
      '1O-P.4A — Pilot Scope Final QA & Closure',
    ],

    nextRecommendedModule: '1O-P.1A — Controlled Pilot Scope Types',
  } as const;
