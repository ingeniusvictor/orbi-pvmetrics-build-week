const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CONTROLLED_READ_ONLY_INTEGRATION_SANDBOX_BLUEPRINT = {
  id: 'pvmetrics-controlled-read-only-integration-sandbox-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-H — Controlled Read-Only Integration Sandbox',
  module: '1O-H.0 — Controlled Read-Only Integration Sandbox Blueprint',
  internalVersion:
    '0.1O-H.0-controlled-read-only-integration-sandbox-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),

  blueprintStatus: 'SANDBOX_CONCEPT_ONLY',
  blueprintStatusLabel: 'SANDBOX CONTROLADO — SOLO CONCEPTUAL',

  productVision:
    'Preparar un sandbox futuro para probar flujos read-only de integración de datos sin conectar sistemas reales, sin credenciales, sin escritura externa, sin telecontrol y sin afectar activos fotovoltaicos, BESS, medidores, SCADA, CEN, ERP o billing.',

  sandboxPrinciples: [
    'El sandbox debe iniciar siempre en modo mock-only.',
    'Toda fuente debe pasar por contrato read-only.',
    'Todo paquete debe pasar por el Source Freshness & Data Quality Gate.',
    'Todo conector futuro debe estar registrado en Future Connector Registry.',
    'Toda prueba debe ser reversible, local y sin persistencia real.',
    'Toda señal debe declarar sourceId, timestamp, unidad, dominio y separación FV/BESS.',
    'Toda simulación debe mostrar claramente que no representa datos oficiales.',
    'Ningún flujo sandbox puede ejecutar escritura, despacho, telecontrol, setpoint o comando.',
  ],

  allowedSandboxSourceModes: [
    {
      id: 'sandbox-source-mock-memory',
      label: 'Mock Memory Source',
      allowed: true,
      description:
        'Fuente en memoria local para simular paquetes read-only sin persistencia.',
    },
    {
      id: 'sandbox-source-static-fixture',
      label: 'Static Fixture Source',
      allowed: true,
      description:
        'Fuente estática versionada dentro del código para pruebas controladas.',
    },
    {
      id: 'sandbox-source-manual-json-paste',
      label: 'Manual JSON Paste Future',
      allowed: false,
      description:
        'Futura carga manual controlada, aún no habilitada en este módulo.',
    },
    {
      id: 'sandbox-source-real-api',
      label: 'Real API Source',
      allowed: false,
      description:
        'Bloqueada en este bloque. No llamar APIs reales ni guardar credenciales.',
    },
    {
      id: 'sandbox-source-real-scada',
      label: 'Real SCADA Source',
      allowed: false,
      description:
        'Bloqueada por riesgo operacional. No conectar SCADA ni telecontrol.',
    },
  ],

  mandatoryGates: [
    {
      gateId: 'gate-read-only-contract',
      label: 'Read-Only Data Contract Gate',
      required: true,
      description:
        'Verifica estructura base, source descriptor, unidades, timestamps, operaciones prohibidas y separación FV/BESS.',
    },
    {
      gateId: 'gate-source-freshness-quality',
      label: 'Source Freshness & Data Quality Gate',
      required: true,
      description:
        'Determina si el paquete puede usarse como mock, con advertencia, con revisión humana o debe rechazarse.',
    },
    {
      gateId: 'gate-future-connector-registry',
      label: 'Future Connector Registry Gate',
      required: true,
      description:
        'Verifica lifecycle, seguridad, permisos, riesgo, capacidades permitidas y operaciones prohibidas.',
    },
    {
      gateId: 'gate-human-review',
      label: 'Human Review Gate',
      required: true,
      description:
        'Exige revisión humana antes de cualquier avance hacia integración real futura.',
    },
  ],

  activationChecklist: [
    'Confirmar que la fuente es mock-only o static fixture.',
    'Confirmar que no existen credenciales.',
    'Confirmar que no existe backend.',
    'Confirmar que no existe llamada de red.',
    'Confirmar que no existe POST/PUT/PATCH/DELETE.',
    'Confirmar que no existe telecontrol.',
    'Confirmar que no existen setpoints.',
    'Confirmar que no existen comandos BESS.',
    'Confirmar que no existen comandos inversores.',
    'Confirmar que todo dato tiene sourceId, timestamp, unidad y dominio.',
    'Confirmar que FV/BESS no viene mezclado.',
    'Confirmar que el gate permite solo uso mock o bloquea el paquete.',
  ],

  consentChecklist: [
    'Toda fuente real futura requiere consentimiento explícito del propietario.',
    'El consentimiento debe indicar alcance read-only.',
    'El consentimiento debe indicar fuente, sistema y dominio de datos.',
    'El consentimiento debe prohibir escritura externa.',
    'El consentimiento debe prohibir telecontrol.',
    'El consentimiento debe prohibir setpoints y comandos.',
    'El consentimiento debe documentarse antes de cualquier integración real futura.',
  ],

  securityChecklist: [
    'No guardar API keys en frontend.',
    'No agregar secrets al repositorio.',
    'No crear variables de entorno en este módulo.',
    'No exponer tokens en README.',
    'No permitir scopes de escritura.',
    'No permitir permisos de administración.',
    'No permitir control operativo.',
    'No permitir conexión SCADA real.',
    'No permitir lectura de medidores reales.',
    'No permitir envío CEN real.',
    'No permitir ERP ni billing.',
  ],

  qaChecklist: [
    'Build correcto.',
    'TypeScript limpio.',
    'Sandbox blueprint existe.',
    'Todas las fuentes reales están bloqueadas.',
    'Todos los gates obligatorios están declarados.',
    'Checklist de activación declarado.',
    'Checklist de consentimiento declarado.',
    'Checklist de seguridad declarado.',
    'Política anti-write declarada.',
    'Política anti-telecontrol declarada.',
    'Safety Boundaries declaradas.',
    'No hay integración real externa.',
  ],

  blockingCriteria: [
    'Fuente real detectada.',
    'Credenciales detectadas.',
    'Secret detectado.',
    'Método POST/PUT/PATCH/DELETE detectado.',
    'Telecontrol detectado.',
    'Setpoint detectado.',
    'Comando BESS detectado.',
    'Comando inversor detectado.',
    'SCADA real detectado.',
    'Medidor real detectado.',
    'Weather API real detectada.',
    'Envío CEN detectado.',
    'ERP o billing detectado.',
    'Datos FV/BESS mezclados sin separación.',
    'Timestamp ausente.',
    'Unidad desconocida.',
    'SourceId ausente.',
    'Import de otro proyecto ORBI detectado.',
  ],

  humanReviewCriteria: [
    'Fuente futura requiere consentimiento.',
    'Riesgo comercial no mock detectado.',
    'Riesgo regulatorio detectado.',
    'Dominio SCADA o medidor mencionado.',
    'Separación FV/BESS no clara.',
    'Freshness en warning.',
    'Data quality incompleta.',
    'Scope de credenciales no definido.',
    'Cliente o propietario debe aprobar acceso futuro.',
  ],

  antiWritePolicy: [
    'POST prohibido.',
    'PUT prohibido.',
    'PATCH prohibido.',
    'DELETE prohibido.',
    'ACK de alarma prohibido.',
    'Creación de órdenes prohibida.',
    'Cierre de órdenes prohibido.',
    'Escritura ERP prohibida.',
    'Billing prohibido.',
    'CEN submit prohibido.',
  ],

  antiTelecontrolPolicy: [
    'Telecontrol prohibido.',
    'Setpoint write prohibido.',
    'BESS command prohibido.',
    'Inverter command prohibido.',
    'Meter command prohibido.',
    'SCADA ACK prohibido.',
    'Dispatch command prohibido.',
    'Remote operation prohibida.',
  ],

  safetyBoundaries: [
    'No crea conectores reales.',
    'No crea sandbox funcional todavía.',
    'No conecta SCADA real.',
    'No lee medidores reales.',
    'No llama weather APIs.',
    'No envía información al CEN.',
    'No usa credenciales.',
    'No usa secrets.',
    'No usa backend.',
    'No usa localStorage.',
    'No envía correos reales.',
    'No exporta PDF.',
    'No ejecuta POST/PUT/PATCH/DELETE.',
    'No habilita telecontrol.',
    'No modifica setpoints.',
    'No controla BESS.',
    'No controla inversores.',
  ],

  nextSandboxRoadmap: [
    '1O-H.1A — Controlled Sandbox Types',
    '1O-H.1B — Controlled Sandbox Mock Session Engine',
    '1O-H.2A — Sandbox Gate Replay Mock Data',
    '1O-H.2B — Sandbox Gate Replay Visual Card',
    '1O-H.3A — Controlled Sandbox Final QA & Closure',
  ],

  nextRecommendedModule: '1O-H.1A — Controlled Sandbox Types',
} as const;
