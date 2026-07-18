import { PVMetricsOperationalEventBlueprint } from '../types/pvmetrics-operational-event-blueprint.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_OPERATIONAL_EVENT_BLUEPRINT: PVMetricsOperationalEventBlueprint =
  {
    id: 'pvmetrics-operational-event-blueprint',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    blueprintStatus: 'ready-for-mock-engine',
    blueprintStatusLabel: 'BLUEPRINT DE EVENTOS OPERACIONALES LISTO',
    productTitle: 'ORBI Operational Event Layer',
    productVision:
      'Crear una capa conceptual para registrar eventos de disponibilidad, fallas, limitaciones, derating, soiling, clima y calidad de datos que expliquen variaciones del forecast y performance.',
    competitivePositioning:
      'Suncast permite registrar eventos que afectan pronósticos. ORBI debe ir más allá: conectar cada evento con forecast, O&M, BESS, compliance, evidencia y explicación técnica.',
    eventTypes: [
      {
        id: 'event-planned-maintenance',
        category: 'planned-maintenance',
        label: 'Mantenimiento programado',
        description:
          'Evento planificado que puede reducir disponibilidad o modificar la curva esperada.',
        defaultSeverity: 'medium',
        impactedAreas: ['forecast', 'availability', 'om-planning', 'cen-compliance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-end-time',
          'field-affected-asset',
          'field-responsible-party',
        ],
        recommendedAction:
          'Registrar ventana horaria, activo afectado y reducción esperada antes de recalcular forecast.',
      },
      {
        id: 'event-forced-outage',
        category: 'forced-outage',
        label: 'Falla / indisponibilidad forzada',
        description:
          'Evento no planificado que reduce o anula generación esperada parcial o totalmente.',
        defaultSeverity: 'critical',
        impactedAreas: ['forecast', 'availability', 'performance', 'cen-compliance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-affected-asset',
          'field-impact-estimation',
          'field-evidence',
        ],
        recommendedAction:
          'Identificar activo afectado, potencia indisponible, hora de inicio y evidencia técnica.',
      },
      {
        id: 'event-partial-derating',
        category: 'partial-derating',
        label: 'Derating parcial',
        description:
          'Limitación parcial de potencia disponible por condición técnica, térmica, operacional o externa.',
        defaultSeverity: 'high',
        impactedAreas: ['forecast', 'availability', 'performance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-end-time',
          'field-impact-estimation',
        ],
        recommendedAction:
          'Declarar potencia limitada, causa probable y duración estimada.',
      },
      {
        id: 'event-grid-curtailment',
        category: 'grid-curtailment',
        label: 'Recorte / limitación de red',
        description:
          'Restricción externa que reduce generación o inyección esperada.',
        defaultSeverity: 'high',
        impactedAreas: ['forecast', 'performance', 'cen-compliance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-impact-estimation',
          'field-evidence',
        ],
        recommendedAction:
          'Separar pérdida por red de pérdida por performance interno de planta.',
      },
      {
        id: 'event-inverter-issue',
        category: 'inverter-issue',
        label: 'Evento de inversor',
        description:
          'Falla, alarma, limitación o comportamiento anómalo en inversores.',
        defaultSeverity: 'high',
        impactedAreas: ['forecast', 'availability', 'performance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-affected-asset',
          'field-evidence',
        ],
        recommendedAction:
          'Identificar inversor, potencia afectada, alarma conceptual y acción O&M sugerida.',
      },
      {
        id: 'event-bess-limitation',
        category: 'bess-limitation',
        label: 'Limitación BESS',
        description:
          'Condición de almacenamiento que puede afectar interpretación de energía observada.',
        defaultSeverity: 'medium',
        impactedAreas: ['forecast', 'bess-separation', 'performance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-impact-estimation',
          'field-traceability',
        ],
        recommendedAction:
          'Separar generación FV pura de carga/descarga BESS antes de explicar desviaciones.',
      },
      {
        id: 'event-weather-related',
        category: 'weather-related',
        label: 'Evento climático',
        description:
          'Condición meteorológica que impacta forecast o explica desviación de generación.',
        defaultSeverity: 'medium',
        impactedAreas: ['forecast', 'performance', 'om-planning'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-impact-estimation',
        ],
        recommendedAction:
          'Relacionar evento con irradiancia, nubosidad, temperatura o condición climática declarada.',
      },
      {
        id: 'event-soiling-related',
        category: 'soiling-related',
        label: 'Evento de soiling',
        description:
          'Pérdida por suciedad, polvo, barro, aves u otra condición que degrade generación.',
        defaultSeverity: 'medium',
        impactedAreas: ['forecast', 'performance', 'om-planning'],
        requiredFields: [
          'field-event-title',
          'field-impact-estimation',
          'field-evidence',
        ],
        recommendedAction:
          'Evaluar pérdida energética y priorizar limpieza en módulo futuro de optimización.',
      },
      {
        id: 'event-communication-loss',
        category: 'communication-loss',
        label: 'Pérdida de comunicación',
        description:
          'Falta de datos por comunicación, SCADA, gateway, logger, medidor o enlace.',
        defaultSeverity: 'high',
        impactedAreas: ['data-quality', 'forecast', 'cen-compliance'],
        requiredFields: [
          'field-event-title',
          'field-start-time',
          'field-affected-asset',
          'field-evidence',
        ],
        recommendedAction:
          'Marcar datos como incompletos y evitar conclusiones operacionales sin validación.',
      },
    ],
    fields: [
      {
        id: 'field-event-title',
        label: 'Título del evento',
        category: 'event-identification',
        required: true,
        description: 'Nombre breve y trazable del evento operacional.',
        validationRule: 'Debe existir un título no vacío.',
      },
      {
        id: 'field-start-time',
        label: 'Hora de inicio',
        category: 'time-window',
        required: true,
        description: 'Inicio estimado o real del evento.',
        validationRule: 'Debe declararse fecha/hora o indicar pendiente de confirmación.',
      },
      {
        id: 'field-end-time',
        label: 'Hora de término',
        category: 'time-window',
        required: false,
        description: 'Término estimado o real del evento.',
        validationRule: 'Si no existe, el evento se considera abierto o en revisión.',
      },
      {
        id: 'field-affected-asset',
        label: 'Activo afectado',
        category: 'affected-asset',
        required: true,
        description: 'Planta, inversor, BESS, medidor, tracker, comunicación o área afectada.',
        validationRule: 'Debe indicar activo específico o nivel planta.',
      },
      {
        id: 'field-impact-estimation',
        label: 'Estimación de impacto',
        category: 'impact-estimation',
        required: true,
        description: 'Impacto estimado en MW, MWh, porcentaje o disponibilidad.',
        validationRule: 'Debe indicar unidad conceptual y método de estimación.',
      },
      {
        id: 'field-evidence',
        label: 'Evidencia',
        category: 'evidence',
        required: false,
        description: 'Nota, captura, alarma, reporte, observación o referencia documental.',
        validationRule: 'Debe dejar claro si la evidencia es mock, manual o pendiente.',
      },
      {
        id: 'field-responsible-party',
        label: 'Responsable',
        category: 'responsible-party',
        required: true,
        description: 'Persona, equipo o área que revisa el evento.',
        validationRule: 'Debe existir responsable conceptual antes de cerrar evento.',
      },
      {
        id: 'field-traceability',
        label: 'Trazabilidad',
        category: 'traceability',
        required: true,
        description: 'Origen, fecha, versión y modo seguro del evento.',
        validationRule: 'Todo evento debe conservar Safety Boundary y origen local/mock.',
      },
    ],
    impactDefinitions: [
      {
        id: 'impact-forecast',
        area: 'forecast',
        label: 'Impacto sobre forecast',
        description:
          'El evento puede aumentar incertidumbre o ajustar energía/potencia esperada.',
        forecastEffect:
          'Reduce confianza, modifica curva esperada o agrega explicación técnica.',
      },
      {
        id: 'impact-availability',
        area: 'availability',
        label: 'Impacto sobre disponibilidad',
        description:
          'El evento puede reducir disponibilidad técnica o comercial de planta.',
        forecastEffect:
          'Reduce disponibilidad mock y genera riesgo de desviación.',
      },
      {
        id: 'impact-performance',
        area: 'performance',
        label: 'Impacto sobre performance',
        description:
          'El evento puede explicar pérdida entre generación esperada y observada.',
        forecastEffect:
          'Clasifica pérdida como técnica, climática, externa o de calidad de datos.',
      },
      {
        id: 'impact-cen-compliance',
        area: 'cen-compliance',
        label: 'Impacto sobre compliance CEN',
        description:
          'El evento puede afectar madurez, trazabilidad o readiness del forecast.',
        forecastEffect:
          'Agrega advertencia o bloqueante conceptual al assessment CEN.',
      },
      {
        id: 'impact-bess-separation',
        area: 'bess-separation',
        label: 'Separación FV/BESS',
        description:
          'El evento obliga a separar generación FV de efectos de almacenamiento.',
        forecastEffect:
          'Evita atribuir carga/descarga BESS a error de forecast solar.',
      },
      {
        id: 'impact-data-quality',
        area: 'data-quality',
        label: 'Calidad de datos',
        description:
          'El evento puede indicar datos incompletos, duplicados, atrasados o no confiables.',
        forecastEffect:
          'Reduce confianza y obliga a revisión humana.',
      },
    ],
    traceabilityRules: [
      'Todo evento debe tener categoría, estado, severidad y ventana temporal.',
      'Todo evento debe indicar si su evidencia es mock, manual, pendiente o futura.',
      'Todo evento que afecte forecast debe declarar impacto estimado.',
      'Todo evento que afecte compliance debe conservar Safety Boundary.',
      'Todo evento crítico debe requerir revisión humana.',
      'Ningún evento debe disparar comandos, setpoints ni acciones remotas.',
    ],
    safetyBoundaries: [
      'No registra eventos reales en backend.',
      'No conecta SCADA.',
      'No lee alarmas reales.',
      'No lee medidores reales.',
      'No consume APIs.',
      'No envía información al CEN.',
      'No crea órdenes de trabajo reales.',
      'No controla BESS.',
      'No controla inversores.',
      'No modifica setpoints.',
      'No habilita telecontrol.',
    ],
    nextRecommendedModule:
      '1O-F.3B — Availability / Outage / Limitation Mock Event Engine',
  };
