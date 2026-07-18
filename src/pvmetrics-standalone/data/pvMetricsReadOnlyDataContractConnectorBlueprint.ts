const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_READ_ONLY_DATA_CONTRACT_CONNECTOR_BLUEPRINT = {
  id: 'pvmetrics-read-only-data-contract-connector-blueprint',
  appName: 'ORBI PVMetrics IA',
  roadmapBlock: '1O-G — Read-Only Data Contract & Connector Readiness',
  module: '1O-G.0 — Read-Only Data Contract & Connector Readiness Blueprint',
  internalVersion: '0.1O-G.0-read-only-data-contract-blueprint',
  generatedAtLabel: getGeneratedAtLabel(),
  blueprintStatus: 'READ_ONLY_CONCEPT_LOCKED',
  blueprintStatusLabel: 'CONTRATO READ-ONLY CONCEPTUAL BLOQUEADO',

  productVision:
    'Preparar una arquitectura futura de conectores solo lectura para alimentar forecast, eventos, compliance, accuracy, soiling, commercial impact y executive intelligence sin habilitar escritura, telecontrol, setpoints ni comandos sobre activos reales.',

  readOnlyPrinciples: [
    'Todo conector futuro debe ser read-only por defecto.',
    'Toda fuente externa debe declarar origen, timestamp, unidad, calidad y vigencia.',
    'Toda integración debe pasar por contrato de datos antes de ser usada por motores.',
    'Toda señal externa debe poder ser marcada como stale, missing, estimated o rejected.',
    'Ningún conector puede escribir sobre sistemas externos.',
    'Ningún conector puede enviar información al CEN.',
    'Ningún conector puede modificar setpoints.',
    'Ningún conector puede controlar BESS, inversores, medidores, reconectadores ni SCADA.',
  ],

  futureConnectorFamilies: [
    {
      id: 'connector-plant-profile',
      label: 'Plant Profile Read-Only Contract',
      purpose:
        'Leer perfil conceptual de planta: nombre, código, capacidad, zona horaria, tecnología y configuración FV/BESS.',
      readiness: 'planned-contract-only',
      allowedMode: 'read-only',
      forbiddenActions: ['write-profile', 'delete-profile', 'sync-secrets'],
    },
    {
      id: 'connector-weather',
      label: 'Weather Provider Read-Only Contract',
      purpose:
        'Preparar contrato futuro para datos climáticos externos sin llamar APIs todavía.',
      readiness: 'future-api-contract',
      allowedMode: 'read-only',
      forbiddenActions: ['api-call-now', 'store-api-key', 'auto-forecast-real'],
    },
    {
      id: 'connector-scada',
      label: 'SCADA Read-Only Contract',
      purpose:
        'Preparar estructura futura para lectura de señales SCADA sin conexión real.',
      readiness: 'future-read-only-contract',
      allowedMode: 'read-only',
      forbiddenActions: ['telecontrol', 'write-setpoint', 'ack-alarm', 'dispatch-command'],
    },
    {
      id: 'connector-meter',
      label: 'Meter Read-Only Contract',
      purpose:
        'Preparar contrato futuro para energía medida sin leer medidores reales todavía.',
      readiness: 'future-read-only-contract',
      allowedMode: 'read-only',
      forbiddenActions: ['meter-command', 'meter-config-write', 'billing-real'],
    },
    {
      id: 'connector-cen',
      label: 'CEN Readiness Contract',
      purpose:
        'Preparar estructura conceptual de readiness regulatorio sin envío real.',
      readiness: 'concept-only',
      allowedMode: 'no-submit',
      forbiddenActions: ['submit-real-data', 'regulatory-api-call', 'official-report'],
    },
    {
      id: 'connector-om-events',
      label: 'O&M Events Read-Only Contract',
      purpose:
        'Preparar contrato futuro para importar eventos de mantenimiento, fallas, derating o curtailment.',
      readiness: 'future-import-contract',
      allowedMode: 'read-only',
      forbiddenActions: ['create-work-order', 'close-work-order', 'dispatch-field-team'],
    },
    {
      id: 'connector-commercial',
      label: 'Commercial Assumptions Read-Only Contract',
      purpose:
        'Preparar contrato futuro para supuestos comerciales controlados sin precios reales ni contratos reales.',
      readiness: 'mock-only',
      allowedMode: 'read-only',
      forbiddenActions: ['erp-write', 'billing', 'invoice', 'contract-sync'],
    },
  ],

  dataContractRules: [
    'Todo dato debe incluir sourceId.',
    'Todo dato debe incluir generatedAt o measuredAt.',
    'Todo dato debe incluir unitLabel cuando aplique.',
    'Toda potencia debe normalizarse explícitamente como MW o kW.',
    'Toda energía debe normalizarse explícitamente como MWh o kWh.',
    'Toda moneda debe marcarse como mock si no proviene de contrato real validado.',
    'Toda señal FV/BESS debe mantenerse separada.',
    'Toda lectura sin timestamp válido debe marcarse como stale.',
    'Todo dato incompleto debe bloquear conclusiones automáticas.',
    'Toda integración futura debe tener fallback mock seguro.',
  ],

  consentAndCredentialRules: [
    'No agregar credenciales al frontend.',
    'No guardar API keys en código.',
    'No agregar secrets en README.',
    'No crear variables de entorno en este módulo.',
    'No conectar cuentas reales en esta fase.',
    'Toda integración futura requiere autorización explícita del propietario del sistema.',
    'Toda integración futura debe documentar alcance read-only antes de implementarse.',
  ],

  antiWriteSafetyRules: [
    'No POST.',
    'No PUT.',
    'No PATCH.',
    'No DELETE.',
    'No comandos.',
    'No acknowledge de alarmas.',
    'No cambios de configuración.',
    'No modificación de setpoints.',
    'No despacho BESS.',
    'No limitación de inversores.',
    'No envío regulatorio.',
    'No creación de órdenes de trabajo.',
    'No facturación.',
  ],

  staleDataRules: [
    'Si el timestamp es inexistente, marcar dato como stale.',
    'Si la fuente está caída, usar fallback mock y mostrar advertencia.',
    'Si la unidad no es reconocida, rechazar dato.',
    'Si el dato FV/BESS viene mezclado, bloquear interpretación automática.',
    'Si hay conflicto entre fuentes, exigir revisión humana.',
  ],

  traceabilityRules: [
    'Cada dato futuro debe mantener sourceId, sourceName y sourceType.',
    'Cada transformación debe declarar inputUnit y outputUnit.',
    'Cada cálculo debe declarar si usa mock, importado o externo.',
    'Cada resumen debe indicar versión de PVMetrics.',
    'Cada export box debe declarar que no es reporte oficial.',
  ],

  safetyBoundaries: [
    'No conecta SCADA real.',
    'No lee medidores reales.',
    'No llama weather APIs.',
    'No envía información al CEN.',
    'No usa precios reales.',
    'No usa contratos reales.',
    'No integra ERP.',
    'No calcula billing.',
    'No guarda credenciales.',
    'No usa backend.',
    'No usa localStorage.',
    'No envía correos.',
    'No exporta PDF.',
    'No controla BESS.',
    'No controla inversores.',
    'No modifica setpoints.',
    'No habilita telecontrol.',
  ],

  nextConnectorRoadmap: [
    '1O-G.1A — Read-Only Data Contract Types',
    '1O-G.1B — Read-Only Data Contract Mock Validator',
    '1O-G.2A — Source Freshness & Data Quality Gate',
    '1O-G.3A — Future Connector Registry UI Blueprint',
  ],

  nextRecommendedModule:
    '1O-G.1A — Read-Only Data Contract Types',
} as const;
