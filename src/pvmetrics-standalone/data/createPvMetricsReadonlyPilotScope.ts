import { PVMetricsClientValidationDecisionSummary } from '../types/pvmetrics-client-validation-decision.types';
import {
  PVMetricsReadonlyPilotScope,
  PVMetricsReadonlyPilotScopeStatus,
  PVMetricsReadonlyPilotSignal,
} from '../types/pvmetrics-readonly-pilot-scope.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const statusLabel: Record<PVMetricsReadonlyPilotScopeStatus, string> = {
  blocked: 'BLOQUEADO — NO PREPARAR PILOTO',
  'draft-scope': 'ALCANCE EN BORRADOR',
  'ready-for-client-review': 'ALCANCE LISTO PARA REVISIÓN CLIENTE',
  'ready-for-readonly-preparation':
    'ALCANCE LISTO PARA PREPARACIÓN READ-ONLY',
};

const baseSignals: PVMetricsReadonlyPilotSignal[] = [
  {
    id: 'plant-active-power',
    label: 'Potencia activa planta',
    domain: 'plant-metering',
    priority: 'mandatory',
    unit: 'MW',
    expectedSource: 'Medidor principal / POI / SCADA read-only',
    reason: 'Permite validar performance global y comparación contra forecast.',
    readOnlyRequired: true,
  },
  {
    id: 'plant-energy-today',
    label: 'Energía diaria acumulada',
    domain: 'plant-metering',
    priority: 'mandatory',
    unit: 'MWh',
    expectedSource: 'Medidor principal / SCADA read-only',
    reason: 'Base para análisis de producción diaria y desvíos.',
    readOnlyRequired: true,
  },
  {
    id: 'inverter-active-power',
    label: 'Potencia por inversor',
    domain: 'inverter',
    priority: 'mandatory',
    unit: 'kW/MW',
    expectedSource: 'SCADA read-only / gateway de inversores',
    reason:
      'Permite detectar desbalance, baja potencia o indisponibilidad parcial.',
    readOnlyRequired: true,
  },
  {
    id: 'inverter-status',
    label: 'Estado operacional por inversor',
    domain: 'inverter',
    priority: 'recommended',
    unit: 'status',
    expectedSource: 'SCADA read-only / plataforma inversores',
    reason: 'Ayuda a explicar pérdidas por indisponibilidad o alarmas.',
    readOnlyRequired: true,
  },
  {
    id: 'ghi-poa-irradiance',
    label: 'Irradiancia GHI/POA',
    domain: 'weather',
    priority: 'mandatory',
    unit: 'W/m²',
    expectedSource:
      'Estación meteorológica / fuente ambiental externa / sensor on-site',
    reason: 'Variable base para normalizar producción FV.',
    readOnlyRequired: true,
  },
  {
    id: 'module-temperature',
    label: 'Temperatura módulo o ambiente',
    domain: 'weather',
    priority: 'recommended',
    unit: '°C',
    expectedSource: 'Estación meteorológica / sensor on-site / fuente ambiental',
    reason:
      'Permite explicar pérdidas térmicas y desviaciones de rendimiento.',
    readOnlyRequired: true,
  },
  {
    id: 'availability-status',
    label: 'Disponibilidad planta',
    domain: 'availability',
    priority: 'recommended',
    unit: '% / status',
    expectedSource: 'SCADA read-only / cálculo local conceptual',
    reason:
      'Permite separar pérdidas operacionales de pérdidas por recurso solar.',
    readOnlyRequired: true,
  },
  {
    id: 'alarm-summary',
    label: 'Resumen de alarmas críticas',
    domain: 'alarms',
    priority: 'optional',
    unit: 'count/status',
    expectedSource: 'SCADA read-only / reporte cliente',
    reason: 'Contextualiza eventos que afecten producción.',
    readOnlyRequired: true,
  },
];

const bessSignals: PVMetricsReadonlyPilotSignal[] = [
  {
    id: 'bess-power',
    label: 'Potencia BESS',
    domain: 'bess',
    priority: 'mandatory',
    unit: 'MW',
    expectedSource: 'EMS/BMS/PCS read-only o medidor BESS',
    reason: 'Permite distinguir generación FV de carga/descarga BESS.',
    readOnlyRequired: true,
  },
  {
    id: 'bess-energy-capacity',
    label: 'Capacidad energética BESS',
    domain: 'bess',
    priority: 'mandatory',
    unit: 'MWh',
    expectedSource: 'Ficha técnica / EMS/BMS read-only',
    reason: 'Permite calcular energía almacenada y límites de operación.',
    readOnlyRequired: true,
  },
  {
    id: 'bess-soc',
    label: 'Estado de carga BESS',
    domain: 'bess',
    priority: 'mandatory',
    unit: '%',
    expectedSource: 'EMS/BMS read-only',
    reason:
      'Variable esencial para análisis energético y disponibilidad BESS.',
    readOnlyRequired: true,
  },
  {
    id: 'bess-mode',
    label: 'Modo operacional BESS',
    domain: 'bess',
    priority: 'recommended',
    unit: 'status',
    expectedSource: 'EMS/BMS/PCS read-only',
    reason:
      'Ayuda a interpretar carga, descarga, standby o indisponibilidad.',
    readOnlyRequired: true,
  },
];

const resolveStatus = (
  decision: PVMetricsClientValidationDecisionSummary,
): PVMetricsReadonlyPilotScopeStatus => {
  if (decision.decisionStatus === 'blocked') return 'blocked';

  if (decision.decisionStatus === 'ready-for-readonly-pilot-preparation') {
    return 'ready-for-readonly-preparation';
  }

  if (decision.decisionStatus === 'ready-for-client-validation') {
    return 'ready-for-client-review';
  }

  return 'draft-scope';
};

const shouldIncludeBessSignals = (
  decision: PVMetricsClientValidationDecisionSummary,
) => {
  const sourceText = [
    decision.technologyLabel,
    decision.internalCommitteeText,
    decision.clientFollowUpText,
  ]
    .join(' ')
    .toLowerCase();

  return (
    sourceText.includes('bess') ||
    sourceText.includes('battery') ||
    sourceText.includes('batería')
  );
};

export const createPvMetricsReadonlyPilotScope = (
  decision: PVMetricsClientValidationDecisionSummary,
): PVMetricsReadonlyPilotScope => {
  const includeBess = shouldIncludeBessSignals(decision);

  const signals = includeBess ? [...baseSignals, ...bessSignals] : baseSignals;

  const mandatorySignals = signals.filter(
    (signal) => signal.priority === 'mandatory',
  ).length;

  const recommendedSignals = signals.filter(
    (signal) => signal.priority === 'recommended',
  ).length;

  const optionalSignals = signals.filter(
    (signal) => signal.priority === 'optional',
  ).length;

  const bessSignalCount = signals.filter(
    (signal) => signal.domain === 'bess',
  ).length;

  const status = resolveStatus(decision);

  return {
    id: `readonly-pilot-scope-${decision.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: decision.plantName,
    plantCode: decision.plantCode,
    technologyLabel: decision.technologyLabel,
    status,
    statusLabel: statusLabel[status],
    signalCount: signals.length,
    mandatorySignals,
    recommendedSignals,
    optionalSignals,
    bessSignals: bessSignalCount,
    signals,
    outOfScopeItems: [
      'Telecontrol de inversores.',
      'Telecontrol de BESS.',
      'Modificación de setpoints.',
      'Comandos de carga o descarga.',
      'Escritura sobre SCADA, EMS, BMS, PCS o medidores.',
      'Gestión de credenciales productivas.',
      'Operación comercial real.',
    ],
    preConnectionCriteria: [
      'Validación humana del alcance técnico.',
      'Confirmación formal de señales disponibles por el cliente.',
      'Confirmación de acceso estrictamente read-only.',
      'Matriz de señales revisada y aprobada.',
      'Canal de datos autorizado sin escritura.',
      'Sin credenciales productivas dentro del frontend.',
      'Sin comandos ni setpoints habilitados.',
    ],
    safetyBoundary:
      'Este alcance es conceptual y local. No conecta SCADA, no consume APIs, no lee medidores reales, no modifica setpoints, no controla BESS, no controla inversores y no habilita telecontrol.',
    executiveSummary:
      'Alcance preliminar para preparar un piloto read-only de ORBI PVMetrics IA basado en la decisión de validación cliente y las evidencias simuladas.',
    sourceDecision: decision,
  };
};
