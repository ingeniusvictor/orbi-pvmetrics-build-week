const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_OPERATOR_SIGN_OFF_BLUEPRINT =
  {
    id: 'pvmetrics-local-demo-package-assembly-operator-sign-off-blueprint',
    appName: 'ORBI PVMetrics IA',
    roadmapBlock: '1O-M — Local Demo Package Assembly & Operator Sign-Off',
    module: '1O-M.0 — Local Demo Package Assembly & Operator Sign-Off Blueprint',
    internalVersion:
      '0.1O-M.0-local-demo-package-assembly-operator-sign-off-blueprint',
    generatedAtLabel: getGeneratedAtLabel(),

    blueprintStatus: 'CONCEPT_ONLY_NO_REAL_ARTIFACT',
    blueprintStatusLabel:
      'LOCAL DEMO PACKAGE ASSEMBLY — SOLO BLUEPRINT, SIN ARTEFACTO REAL',

    purpose:
      'Preparar una estructura conceptual para revisar qué debe contener un paquete demo local de ORBI PVMetrics IA y qué validaciones humanas deben firmarse antes de una presentación controlada. Este blueprint no genera ZIP, APK, PDF, firma digital real, correo, backend, API ni conector real.',

    localDemoPackageAssemblyScope: [
      'Inventario conceptual de contenidos permitidos para demo local.',
      'Separación estricta entre paquete demo conceptual y artefacto release real.',
      'Checklist previa del operador antes de presentar.',
      'Checklist de revisor técnico/QA antes de compartir externamente.',
      'Registro conceptual de riesgos de ensamblaje.',
      'Gates humanos antes de demo cliente, entrega interna o intento de integración futura.',
      'Declaración explícita de que no se genera artefacto productivo.',
    ],

    allowedLocalDemoPackageContents: [
      {
        id: 'allowed-local-app-view',
        label: 'Vista local de la app',
        description:
          'Ejecución local o entorno de desarrollo controlado para revisar el wizard y las tarjetas visuales.',
        clientVisible: true,
        safetyNote: 'No debe presentarse como deploy productivo.',
      },
      {
        id: 'allowed-readme',
        label: 'README documentado',
        description:
          'Documentación local con roadmap, límites, QA y estado de módulos.',
        clientVisible: false,
        safetyNote: 'Material interno salvo revisión humana previa.',
      },
      {
        id: 'allowed-version-registry',
        label: 'Version Registry',
        description:
          'Registro de versión interna, bloque activo, módulo estable y siguiente paso recomendado.',
        clientVisible: false,
        safetyNote: 'No sustituye control formal de releases.',
      },
      {
        id: 'allowed-qa-checklist',
        label: 'QA Checklist',
        description:
          'Checklist independiente para validar build, TypeScript y límites de seguridad.',
        clientVisible: false,
        safetyNote: 'Debe revisarse antes de cualquier demo externa.',
      },
      {
        id: 'allowed-copyable-texts',
        label: 'Textos copiables locales',
        description:
          'Resúmenes cliente y reportes internos generados en textareas locales.',
        clientVisible: true,
        safetyNote: 'Requieren revisión humana antes de compartirse.',
      },
      {
        id: 'allowed-closure-snapshots',
        label: 'Snapshots de cierre',
        description:
          'Objetos TypeScript locales que documentan cierres QA de bloques previos.',
        clientVisible: false,
        safetyNote: 'Evidencia técnica interna, no certificado oficial.',
      },
    ],

    blockedRealReleaseArtifacts: [
      'ZIP real distribuible.',
      'APK Android real.',
      'PDF oficial.',
      'Firma digital criptográfica real.',
      'Correo automático real.',
      'Deploy web productivo.',
      'Backend productivo.',
      'API pública.',
      'Conector SCADA real.',
      'Conector medidor real.',
      'Conector CEN real.',
      'Conector weather API real.',
      'Telecontrol.',
      'Setpoints.',
      'Comandos BESS.',
      'Comandos inversores.',
      'SCADA ACK.',
    ],

    operatorSignOffScope: [
      'Confirmar que la demo se presenta como local, mock, read-only y no productiva.',
      'Confirmar que no se generó ZIP/APK/PDF real.',
      'Confirmar que no existen credenciales, tokens ni secrets.',
      'Confirmar que no existen conectores reales activos.',
      'Confirmar que no existe telecontrol ni comandos operacionales.',
      'Confirmar que los textos cliente fueron revisados antes de compartirse.',
    ],

    operatorPreflightChecklist: [
      {
        id: 'operator-build-run',
        label: 'Build ejecutado',
        status: 'requires-run',
        command: 'npm run build',
        description:
          'El operador debe ejecutar build antes de considerar la demo lista para revisión.',
      },
      {
        id: 'operator-typescript-run',
        label: 'TypeScript ejecutado',
        status: 'requires-run',
        command: 'tsc --noEmit',
        description:
          'El operador debe validar que no existan errores TypeScript.',
      },
      {
        id: 'operator-demo-labels-visible',
        label: 'Etiquetas demo visibles',
        status: 'requires-human-review',
        description:
          'Verificar que la app declara mock, read-only, no real integration y no producción.',
      },
      {
        id: 'operator-copy-text-reviewed',
        label: 'Textos copiables revisados',
        status: 'requires-human-review',
        description:
          'Todo resumen cliente debe revisarse antes de compartirse externamente.',
      },
    ],

    reviewerSignOffChecklist: [
      {
        id: 'reviewer-anti-mix',
        label: 'Anti-mezcla validada',
        status: 'requires-human-review',
        description:
          'Confirmar que no hay imports, rutas ni componentes de otros proyectos ORBI.',
      },
      {
        id: 'reviewer-safety-boundaries',
        label: 'Safety Boundaries validadas',
        status: 'requires-human-review',
        description:
          'Confirmar que las exclusiones de ZIP/APK/PDF, backend, APIs, SCADA y telecontrol están visibles.',
      },
      {
        id: 'reviewer-commercial-claims',
        label: 'Claims comerciales revisados',
        status: 'requires-human-review',
        description:
          'Evitar afirmar producción, forecast oficial, reporte regulatorio o integración real.',
      },
      {
        id: 'reviewer-client-demo-approval',
        label: 'Aprobación demo cliente',
        status: 'pending',
        description:
          'Debe existir aprobación humana antes de presentación externa.',
      },
    ],

    demoEnvironmentAssumptions: [
      'La demo se ejecuta localmente o en entorno controlado de desarrollo.',
      'La demo no usa credenciales productivas.',
      'La demo no llama servicios externos.',
      'La demo no persiste mutaciones en localStorage.',
      'La demo no genera artefactos reales.',
      'La demo no modifica sistemas físicos.',
      'La demo puede requerir explicación verbal del operador para reforzar límites.',
    ],

    humanApprovalGates: [
      {
        id: 'gate-before-local-demo-package-label',
        label: 'Antes de declarar paquete demo local',
        required: true,
        reviewerRole: 'release-owner',
        description:
          'Validar que el paquete es conceptual/local y no artefacto distribuible real.',
      },
      {
        id: 'gate-before-client-presentation',
        label: 'Antes de presentación cliente',
        required: true,
        reviewerRole: 'qa-owner',
        description:
          'Revisar textos, boundaries, claims bloqueados y riesgos antes de mostrar a cliente.',
      },
      {
        id: 'gate-before-any-real-artifact',
        label: 'Antes de cualquier artefacto real',
        required: true,
        reviewerRole: 'technical-owner',
        description:
          'Todo ZIP/APK/PDF/deploy real queda bloqueado hasta roadmap separado.',
      },
    ],

    assemblyRisks: [
      {
        id: 'risk-package-seen-as-release',
        label: 'Paquete demo confundido con release real',
        severity: 'high',
        mitigation:
          'Usar etiquetas visibles de demo local, mock, read-only y no productivo.',
      },
      {
        id: 'risk-unreviewed-client-text',
        label: 'Texto cliente no revisado',
        severity: 'high',
        mitigation:
          'Exigir revisión humana antes de compartir cualquier resumen externo.',
      },
      {
        id: 'risk-artifact-generated-too-early',
        label: 'Artefacto real generado antes de QA',
        severity: 'critical',
        mitigation:
          'Bloquear ZIP/APK/PDF real en este bloque y moverlo a roadmap separado.',
      },
      {
        id: 'risk-operational-misuse',
        label: 'Uso operacional indebido',
        severity: 'critical',
        mitigation:
          'Mantener prohibidos SCADA real, telecontrol, setpoints, BESS commands e inverter commands.',
      },
    ],

    assemblyExitCriteria: [
      'Blueprint creado.',
      'Scope de ensamblaje local declarado.',
      'Contenidos permitidos del paquete demo declarados.',
      'Artefactos reales bloqueados declarados.',
      'Operator Sign-Off Scope declarado.',
      'Operator Preflight Checklist declarado.',
      'Reviewer Sign-Off Checklist declarado.',
      'Demo Environment Assumptions declaradas.',
      'Human Approval Gates declarados.',
      'Assembly Risks declarados.',
      'Safety Boundary declarada.',
      'Next Roadmap 1O-M declarado.',
      'No se crea UI nueva.',
      'No se modifica wizard.',
      'No se genera ZIP/APK/PDF real.',
      'No se crea firma digital real.',
      'No se envían correos.',
      'No se crea backend.',
      'No se llaman APIs.',
      'No se usa localStorage.',
      'No se crean conectores reales.',
      'Build correcto.',
      'TypeScript limpio.',
    ],

    safetyBoundary:
      'Este blueprint solo define ensamblaje conceptual de paquete demo local y firma humana simulada/administrativa. No genera ZIP, APK, PDF, firma digital real, correo, backend, API, localStorage, conector real, SCADA, medidor, weather API, CEN, credenciales, tokens, secrets, POST/PUT/PATCH/DELETE real, telecontrol, setpoints, comandos BESS ni comandos inversores.',

    nextRoadmap: [
      '1O-M.1A — Local Demo Package Types',
      '1O-M.1B — Local Demo Package Mock Data',
      '1O-M.2A — Operator Sign-Off Visual Card',
      '1O-M.2B — Local Demo Package Assembly Export Text Box',
      '1O-M.3A — Local Demo Package Wizard Integration',
      '1O-M.4A — Local Demo Package Final QA & Closure',
    ],

    nextRecommendedModule: '1O-M.1A — Local Demo Package Types',
  } as const;
