import {
  PVMetricsOperationalEventMockAssessment,
  PVMetricsOperationalEventMockAssessmentStatus,
  PVMetricsOperationalEventMockItem,
} from '../types/pvmetrics-operational-event-mock.types';

type CreatePvMetricsOperationalEventMockAssessmentInput = {
  plantName?: string;
  plantCode?: string;
  installedCapacityMwac?: number;
  includeBess?: boolean;
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const round = (value: number) => Number(value.toFixed(2));

const statusLabel: Record<PVMetricsOperationalEventMockAssessmentStatus, string> = {
  'no-events': 'SIN EVENTOS OPERACIONALES MOCK',
  monitoring: 'MONITOREO CON EVENTOS MENORES',
  'review-required': 'REVISIÓN OPERACIONAL REQUERIDA',
  'critical-review-required': 'REVISIÓN CRÍTICA REQUERIDA',
};

const createDemoEvents = ({
  installedCapacityMwac,
  includeBess,
}: Required<
  Pick<
    CreatePvMetricsOperationalEventMockAssessmentInput,
    'installedCapacityMwac' | 'includeBess'
  >
>): PVMetricsOperationalEventMockItem[] => {
  const inverterImpactMw = round(installedCapacityMwac * 0.12);
  const deratingImpactMw = round(installedCapacityMwac * 0.08);

  const events: PVMetricsOperationalEventMockItem[] = [
    {
      id: 'mock-event-inverter-derating-01',
      title: 'Derating parcial en bloque de inversores',
      category: 'partial-derating',
      status: 'active',
      severity: 'high',
      startTimeLabel: '10:00',
      endTimeLabel: '13:00',
      affectedAsset: 'Bloque inversores FV — demo',
      estimatedPowerImpactMw: inverterImpactMw,
      estimatedEnergyImpactMwh: round(inverterImpactMw * 3),
      estimatedAvailabilityImpactPct: 4.5,
      impactedAreas: ['forecast', 'availability', 'performance', 'cen-compliance'],
      evidenceMode: 'mock',
      evidence:
        'Evento simulado para demostrar cómo una limitación parcial reduce potencia esperada y readiness regulatorio.',
      recommendedAction:
        'Revisar causa probable, ventana horaria y potencia indisponible antes de interpretar desviación de forecast.',
      traceabilityNote:
        'Evento local/mock generado por ORBI PVMetrics IA. No proviene de SCADA ni alarma real.',
    },
    {
      id: 'mock-event-weather-clouding-01',
      title: 'Nubosidad operacional no confirmada',
      category: 'weather-related',
      status: 'under-review',
      severity: 'medium',
      startTimeLabel: '14:00',
      endTimeLabel: '16:00',
      affectedAsset: 'Planta FV completa — demo',
      estimatedPowerImpactMw: deratingImpactMw,
      estimatedEnergyImpactMwh: round(deratingImpactMw * 2),
      estimatedAvailabilityImpactPct: 0,
      impactedAreas: ['forecast', 'performance', 'om-planning'],
      evidenceMode: 'pending-validation',
      evidence:
        'Supuesto climático mock pendiente de validación con fuente meteorológica autorizada.',
      recommendedAction:
        'Cruzar con irradiancia, nubosidad y temperatura cuando exista fuente validada.',
      traceabilityNote:
        'Evento climático conceptual sin API meteorológica real.',
    },
    {
      id: 'mock-event-communication-loss-01',
      title: 'Pérdida de comunicación de fuente de datos',
      category: 'communication-loss',
      status: 'under-review',
      severity: 'medium',
      startTimeLabel: '08:00',
      endTimeLabel: '09:00',
      affectedAsset: 'Gateway / logger demo',
      estimatedPowerImpactMw: 0,
      estimatedEnergyImpactMwh: 0,
      estimatedAvailabilityImpactPct: 0,
      impactedAreas: ['data-quality', 'forecast', 'cen-compliance'],
      evidenceMode: 'mock',
      evidence:
        'Evento mock de calidad de datos. No implica pérdida física de generación.',
      recommendedAction:
        'Marcar ventana como datos incompletos y evitar conclusiones regulatorias sin revisión humana.',
      traceabilityNote:
        'No existe lectura real de gateway, medidor ni SCADA.',
    },
  ];

  if (!includeBess) return events;

  return [
    ...events,
    {
      id: 'mock-event-bess-separation-01',
      title: 'Separación FV/BESS requerida',
      category: 'bess-limitation',
      status: 'draft',
      severity: 'medium',
      startTimeLabel: '12:00',
      endTimeLabel: '15:00',
      affectedAsset: 'BESS demo',
      estimatedPowerImpactMw: round(installedCapacityMwac * 0.05),
      estimatedEnergyImpactMwh: round(installedCapacityMwac * 0.05 * 3),
      estimatedAvailabilityImpactPct: 0,
      impactedAreas: ['forecast', 'bess-separation', 'performance'],
      evidenceMode: 'mock',
      evidence:
        'Evento BESS conceptual para recordar que carga/descarga no debe confundirse con generación FV.',
      recommendedAction:
        'Separar energía FV, carga BESS y descarga BESS antes de explicar desviaciones.',
      traceabilityNote:
        'No controla BESS ni lee EMS/BMS/PCS reales.',
    },
  ];
};

const resolveStatus = (
  events: PVMetricsOperationalEventMockItem[],
): PVMetricsOperationalEventMockAssessmentStatus => {
  if (!events.length) return 'no-events';
  if (events.some((event) => event.severity === 'critical')) {
    return 'critical-review-required';
  }
  if (events.some((event) => event.severity === 'high')) {
    return 'review-required';
  }
  return 'monitoring';
};

const resolveForecastImpactLevel = (
  totalEnergyImpactMwh: number,
  installedCapacityMwac: number,
): 'low' | 'medium' | 'high' | 'critical' => {
  const impactRatio = installedCapacityMwac
    ? totalEnergyImpactMwh / installedCapacityMwac
    : 0;

  if (impactRatio >= 3) return 'critical';
  if (impactRatio >= 1.5) return 'high';
  if (impactRatio >= 0.5) return 'medium';
  return 'low';
};

const buildInternalText = (
  assessmentBase: Omit<
    PVMetricsOperationalEventMockAssessment,
    'internalEventText' | 'clientEventText'
  >,
) =>
  [
    'ORBI PVMetrics IA — Operational Event Mock Assessment',
    `Generado: ${assessmentBase.generatedAtLabel}`,
    `Planta: ${assessmentBase.plantName} (${assessmentBase.plantCode})`,
    `Estado: ${assessmentBase.statusLabel}`,
    '',
    'Resumen:',
    `- Eventos totales: ${assessmentBase.impactSummary.totalEvents}`,
    `- Eventos activos: ${assessmentBase.impactSummary.activeEvents}`,
    `- Eventos críticos: ${assessmentBase.impactSummary.criticalEvents}`,
    `- Impacto potencia: ${assessmentBase.impactSummary.estimatedTotalPowerImpactMw} MW`,
    `- Impacto energía: ${assessmentBase.impactSummary.estimatedTotalEnergyImpactMwh} MWh`,
    `- Impacto disponibilidad: ${assessmentBase.impactSummary.estimatedAvailabilityImpactPct}%`,
    '',
    'Eventos:',
    assessmentBase.events
      .map(
        (event) =>
          `- [${event.severity}] ${event.title} | ${event.startTimeLabel}-${event.endTimeLabel} | ${event.affectedAsset} | Impacto ${event.estimatedPowerImpactMw} MW / ${event.estimatedEnergyImpactMwh} MWh | Acción: ${event.recommendedAction}`,
      )
      .join('\n'),
    '',
    'Notas forecast:',
    assessmentBase.forecastAdjustmentNotes.map((item) => `- ${item}`).join('\n'),
    '',
    'Advertencias compliance:',
    assessmentBase.complianceWarnings.map((item) => `- ${item}`).join('\n'),
    '',
    'Recomendaciones O&M:',
    assessmentBase.omRecommendations.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    assessmentBase.safetyBoundary,
  ].join('\n');

const buildClientText = (
  assessmentBase: Omit<
    PVMetricsOperationalEventMockAssessment,
    'internalEventText' | 'clientEventText'
  >,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos una revisión conceptual de eventos operacionales mock para ${assessmentBase.plantName} (${assessmentBase.plantCode}).`,
    '',
    `Estado: ${assessmentBase.statusLabel}.`,
    `Eventos detectados: ${assessmentBase.impactSummary.totalEvents}.`,
    `Impacto energético estimado mock: ${assessmentBase.impactSummary.estimatedTotalEnergyImpactMwh} MWh.`,
    '',
    'Puntos de atención:',
    assessmentBase.events
      .map((event) => `- ${event.title}: ${event.recommendedAction}`)
      .join('\n'),
    '',
    'Este resultado es conceptual. No proviene de SCADA, no lee alarmas reales, no crea órdenes de trabajo y no debe usarse como registro operacional oficial.',
  ].join('\n');

export const createPvMetricsOperationalEventMockAssessment = ({
  plantName = 'ORBI Solar Demo Plant',
  plantCode = 'AES-DEMO-FV',
  installedCapacityMwac = 9,
  includeBess = true,
}: CreatePvMetricsOperationalEventMockAssessmentInput = {}): PVMetricsOperationalEventMockAssessment => {
  const events = createDemoEvents({
    installedCapacityMwac,
    includeBess,
  });

  const estimatedTotalPowerImpactMw = round(
    events.reduce((sum, event) => sum + event.estimatedPowerImpactMw, 0),
  );

  const estimatedTotalEnergyImpactMwh = round(
    events.reduce((sum, event) => sum + event.estimatedEnergyImpactMwh, 0),
  );

  const estimatedAvailabilityImpactPct = round(
    events.reduce((sum, event) => sum + event.estimatedAvailabilityImpactPct, 0),
  );

  const criticalEvents = events.filter((event) => event.severity === 'critical').length;
  const highEvents = events.filter((event) => event.severity === 'high').length;
  const activeEvents = events.filter((event) => event.status === 'active').length;

  const forecastImpactLevel = resolveForecastImpactLevel(
    estimatedTotalEnergyImpactMwh,
    installedCapacityMwac,
  );

  const cenComplianceImpact: 'none' | 'warning' | 'blocking-review' =
    events.some((event) => event.impactedAreas.includes('cen-compliance') && event.severity === 'high')
      ? 'blocking-review'
      : events.some((event) => event.impactedAreas.includes('cen-compliance'))
        ? 'warning'
        : 'none';

  const status = resolveStatus(events);

  const forecastAdjustmentNotes = [
    'Los eventos mock deben considerarse como explicación conceptual de desviaciones del forecast.',
    `Impacto energético mock acumulado: ${estimatedTotalEnergyImpactMwh} MWh.`,
    `Nivel de impacto forecast: ${forecastImpactLevel}.`,
  ];

  const complianceWarnings = [
    'Los eventos con impacto CEN requieren revisión humana antes de cualquier salida externa.',
    cenComplianceImpact === 'blocking-review'
      ? 'Existe al menos un evento mock de alta severidad que bloquea uso regulatorio conceptual.'
      : 'No se detectan bloqueantes CEN críticos adicionales en el set mock.',
  ];

  const omRecommendations = [
    'Validar si la desviación del forecast se explica por evento operacional antes de atribuirla al modelo.',
    'Separar pérdidas por clima, red, inversor, BESS, disponibilidad y calidad de datos.',
    'No crear órdenes de trabajo reales desde este módulo mock.',
  ];

  const dataQualityWarnings = events
    .filter((event) => event.impactedAreas.includes('data-quality'))
    .map((event) => `${event.title}: ${event.recommendedAction}`);

  const safetyBoundary =
    'Este assessment de eventos es mock, local y conceptual. No registra eventos reales en backend, no conecta SCADA, no lee alarmas reales, no lee medidores reales, no envía información al CEN, no crea órdenes de trabajo, no controla BESS, no controla inversores y no modifica setpoints.';

  const base = {
    id: `operational-event-assessment-${plantCode}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName,
    plantCode,
    status,
    statusLabel: statusLabel[status],
    impactSummary: {
      totalEvents: events.length,
      activeEvents,
      criticalEvents,
      highEvents,
      estimatedTotalPowerImpactMw,
      estimatedTotalEnergyImpactMwh,
      estimatedAvailabilityImpactPct,
      forecastImpactLevel,
      cenComplianceImpact,
    },
    events,
    forecastAdjustmentNotes,
    complianceWarnings,
    omRecommendations,
    dataQualityWarnings,
    safetyBoundary,
  };

  return {
    ...base,
    internalEventText: buildInternalText(base),
    clientEventText: buildClientText(base),
  };
};
