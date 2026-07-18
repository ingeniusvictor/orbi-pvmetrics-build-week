import {
  PVMetricsReadonlyConnectorGuardrail,
  PVMetricsReadonlyConnectorSourceType,
} from '../types/pvmetrics-readonly-connector-blueprint.types';

export const PV_METRICS_READONLY_ALLOWED_SOURCE_TYPES: PVMetricsReadonlyConnectorSourceType[] =
  [
    'scada-readonly',
    'ems-readonly',
    'bms-readonly',
    'pcs-readonly',
    'meter-readonly',
    'inverter-platform-readonly',
    'weather-source-readonly',
    'manual-file-import',
    'demo-simulator',
    'client-report',
  ];

export const PV_METRICS_READONLY_FORBIDDEN_INTEGRATION_PATTERNS = [
  'Conexión con permisos de escritura.',
  'Telecontrol de inversores.',
  'Telecontrol de BESS.',
  'Setpoints desde frontend.',
  'Comandos desde navegador.',
  'Credenciales productivas embebidas.',
  'Tokens persistidos en localStorage.',
  'Backend improvisado sin revisión de seguridad.',
  'Protocolos productivos sin arquitectura aprobada.',
];

export const PV_METRICS_READONLY_CREDENTIAL_POLICIES = [
  'No guardar credenciales en frontend.',
  'No guardar tokens en localStorage.',
  'No exponer llaves API en bundle público.',
  'Cualquier secreto futuro debe vivir fuera del cliente visual.',
  'Todo acceso futuro debe ser revocable, auditado y mínimo necesario.',
];

export const PV_METRICS_READONLY_PRE_CONNECTION_REQUIREMENTS = [
  'Handoff final aprobado internamente.',
  'Cliente confirma fuente de datos.',
  'Cliente confirma acceso read-only.',
  'Matriz de señales aprobada.',
  'Responsable técnico cliente designado.',
  'Revisión de ciberseguridad completada.',
  'Política de credenciales definida fuera del frontend.',
  'Sin rutas de escritura, comandos ni setpoints.',
];

export const PV_METRICS_READONLY_SECURITY_BOUNDARIES = [
  'No SCADA real en este módulo.',
  'No APIs reales en este módulo.',
  'No lectura de medidores reales.',
  'No telecontrol.',
  'No comandos a inversores.',
  'No comandos a BESS.',
  'No modificación de setpoints.',
  'No credenciales productivas en frontend.',
  'No backend productivo.',
];

export const PV_METRICS_READONLY_CONNECTOR_GUARDRAILS: PVMetricsReadonlyConnectorGuardrail[] =
  [
    {
      id: 'guardrail-readonly-only',
      label: 'Acceso estrictamente read-only',
      category: 'safety-boundary',
      mandatory: true,
      blocksIfMissing: true,
      description:
        'Todo conector futuro debe quedar limitado a lectura. Cualquier capacidad de escritura bloquea la integración.',
    },
    {
      id: 'guardrail-no-frontend-secrets',
      label: 'Sin secretos en frontend',
      category: 'credentials',
      mandatory: true,
      blocksIfMissing: true,
      description:
        'No se permiten credenciales productivas, tokens, llaves API ni contraseñas dentro del frontend.',
    },
    {
      id: 'guardrail-no-commands',
      label: 'Sin comandos ni setpoints',
      category: 'operations',
      mandatory: true,
      blocksIfMissing: true,
      description:
        'La arquitectura no debe contener rutas, botones, funciones ni payloads de comando.',
    },
    {
      id: 'guardrail-human-approval',
      label: 'Aprobación humana obligatoria',
      category: 'governance',
      mandatory: true,
      blocksIfMissing: true,
      description:
        'Toda integración futura debe ser aprobada por responsables técnicos y de seguridad.',
    },
    {
      id: 'guardrail-data-quality',
      label: 'Validación de calidad de datos',
      category: 'data-quality',
      mandatory: true,
      blocksIfMissing: false,
      description:
        'Las señales deben validar unidad, timestamp, fuente y coherencia antes de usarse para análisis.',
    },
  ];

export const PV_METRICS_READONLY_CONNECTOR_SAFETY_BOUNDARY =
  'Este blueprint es local y conceptual. No conecta SCADA, no consume APIs, no lee medidores reales, no guarda credenciales, no modifica setpoints, no controla BESS, no controla inversores y no habilita telecontrol.';
