import { PVMetricsCenComplianceBlueprint } from '../types/pvmetrics-cen-compliance-blueprint.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_CEN_COMPLIANCE_BLUEPRINT: PVMetricsCenComplianceBlueprint =
  {
    id: 'pvmetrics-cen-compliance-blueprint',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    blueprintStatus: 'draft-ready',
    blueprintStatusLabel: 'BLUEPRINT CEN CONCEPTUAL LISTO',
    productTitle: 'ORBI CEN Forecast Compliance Simulator',
    productVision:
      'Crear una capa conceptual que permita preparar, revisar y auditar la madurez de un forecast solar antes de cualquier envío regulatorio real.',
    competitivePositioning:
      'Suncast apoya forecast y cumplimiento. ORBI debe agregar simulación de cumplimiento, trazabilidad, explicación técnica, O&M y límites read-only antes de cualquier envío.',
    windows: [
      {
        id: 'window-day-ahead',
        window: 'day-ahead',
        label: 'Forecast día siguiente',
        objective:
          'Simular preparación de forecast para el día siguiente con energía, potencia, supuestos y trazabilidad.',
        intendedUse:
          'Validar si el forecast mock tiene información suficiente para una revisión operacional previa.',
      },
      {
        id: 'window-intraday-update',
        window: 'intraday-update',
        label: 'Actualización intradía',
        objective:
          'Simular ajustes conceptuales durante el día ante cambios de clima, disponibilidad o limitaciones.',
        intendedUse:
          'Preparar futuros módulos de actualización sin ejecutar envíos reales.',
      },
      {
        id: 'window-weekly-planning',
        window: 'weekly-planning',
        label: 'Planificación semanal',
        objective:
          'Simular vista de forecast para coordinar O&M, disponibilidad, limpieza y restricciones.',
        intendedUse:
          'Apoyar planificación técnica antes de módulos de cumplimiento avanzado.',
      },
      {
        id: 'window-monthly-operational-review',
        window: 'monthly-operational-review',
        label: 'Revisión operacional mensual',
        objective:
          'Preparar una vista conceptual para analizar forecast, desviaciones y cumplimiento histórico.',
        intendedUse:
          'Base futura para informes operacionales y revisión ejecutiva.',
      },
      {
        id: 'window-pmgd-operational-report',
        window: 'pmgd-operational-report-concept',
        label: 'Informe operacional PMGD conceptual',
        objective:
          'Definir estructura conceptual para una futura revisión mensual de operación PMGD.',
        intendedUse:
          'No genera informe real; solo prepara campos, trazabilidad y madurez documental.',
      },
    ],
    conceptualFields: [
      {
        id: 'field-plant-id',
        label: 'Identificación de planta',
        category: 'plant-identification',
        required: true,
        currentAvailability: 'available-demo',
        description:
          'Nombre, código, tecnología, capacidad y ubicación conceptual de la planta.',
        validationRule:
          'Debe existir un perfil técnico de planta antes de preparar cualquier simulación regulatoria.',
      },
      {
        id: 'field-forecast-energy',
        label: 'Energía forecast',
        category: 'forecast-energy',
        required: true,
        currentAvailability: 'available-demo',
        description:
          'Energía esperada por horizonte, generada desde el motor mock de forecast solar.',
        validationRule:
          'Debe existir energía forecast mayor o igual a cero y asociada a un horizonte definido.',
      },
      {
        id: 'field-forecast-power',
        label: 'Curva de potencia forecast',
        category: 'forecast-power',
        required: true,
        currentAvailability: 'available-demo',
        description:
          'Serie horaria conceptual de potencia esperada y bandas de confianza.',
        validationRule:
          'Debe existir una serie horaria y no debe superar límites conceptuales de capacidad AC.',
      },
      {
        id: 'field-availability',
        label: 'Disponibilidad',
        category: 'availability',
        required: true,
        currentAvailability: 'planned',
        description:
          'Disponibilidad conceptual asociada a fallas, mantenimientos o derating.',
        validationRule:
          'Debe declararse si la disponibilidad es real, estimada, demo o pendiente.',
      },
      {
        id: 'field-limitations',
        label: 'Limitaciones operacionales',
        category: 'limitations',
        required: true,
        currentAvailability: 'planned',
        description:
          'Restricciones, recortes, indisponibilidades o limitaciones que afecten el forecast.',
        validationRule:
          'Toda limitación debe tener causa, hora de inicio, hora de término estimada y responsable de validación.',
      },
      {
        id: 'field-weather-assumption',
        label: 'Supuesto meteorológico',
        category: 'weather-assumption',
        required: true,
        currentAvailability: 'planned',
        description:
          'Supuestos de irradiancia, nubosidad, temperatura o condición climática.',
        validationRule:
          'Debe identificarse si el clima proviene de mock, archivo autorizado, API futura o fuente validada.',
      },
      {
        id: 'field-timestamp',
        label: 'Timestamp y zona horaria',
        category: 'timestamp',
        required: true,
        currentAvailability: 'available-demo',
        description:
          'Hora de generación, horizonte y zona horaria usada para la simulación.',
        validationRule:
          'Toda serie debe indicar hora local o zona horaria de referencia.',
      },
      {
        id: 'field-traceability',
        label: 'Trazabilidad de versión',
        category: 'traceability',
        required: true,
        currentAvailability: 'available-demo',
        description:
          'Versión interna, módulo de origen, fecha de generación y modo mock/read-only.',
        validationRule:
          'Debe existir referencia a Version Registry y a Safety Boundary.',
      },
      {
        id: 'field-responsible-party',
        label: 'Responsable de revisión',
        category: 'responsible-party',
        required: true,
        currentAvailability: 'planned',
        description:
          'Persona o área responsable de revisar el forecast antes de cualquier uso externo.',
        validationRule:
          'Debe quedar claro que la revisión humana es obligatoria.',
      },
    ],
    complianceChecks: [
      {
        id: 'check-no-real-submission',
        label: 'Sin envío regulatorio real',
        severity: 'critical',
        category: 'safety',
        description:
          'El simulador no debe contener acciones, endpoints, botones ni payloads de envío al CEN.',
        blocksSubmission: true,
      },
      {
        id: 'check-human-review',
        label: 'Revisión humana obligatoria',
        severity: 'critical',
        category: 'human-review',
        description:
          'Todo forecast conceptual debe revisarse por responsable técnico antes de cualquier uso operativo.',
        blocksSubmission: true,
      },
      {
        id: 'check-plant-profile',
        label: 'Perfil de planta disponible',
        severity: 'high',
        category: 'data-completeness',
        description:
          'El forecast debe estar asociado a una planta, capacidad y tecnología definidas.',
        blocksSubmission: true,
      },
      {
        id: 'check-forecast-series',
        label: 'Serie forecast disponible',
        severity: 'high',
        category: 'forecast-consistency',
        description:
          'Debe existir una curva de forecast con energía, potencia y horizonte definido.',
        blocksSubmission: true,
      },
      {
        id: 'check-traceability',
        label: 'Trazabilidad activa',
        severity: 'high',
        category: 'traceability',
        description:
          'Todo resultado debe indicar origen mock, versión, módulo y límite de seguridad.',
        blocksSubmission: true,
      },
      {
        id: 'check-availability-context',
        label: 'Contexto de disponibilidad',
        severity: 'medium',
        category: 'data-completeness',
        description:
          'El simulador debe indicar si existen fallas, mantenimientos o limitaciones conocidas.',
        blocksSubmission: false,
      },
      {
        id: 'check-weather-assumptions',
        label: 'Supuestos meteorológicos declarados',
        severity: 'medium',
        category: 'forecast-consistency',
        description:
          'La simulación debe indicar que el clima es mock, estimado o pendiente de fuente validada.',
        blocksSubmission: false,
      },
      {
        id: 'check-regulatory-readiness',
        label: 'Readiness regulatorio conceptual',
        severity: 'medium',
        category: 'regulatory-readiness',
        description:
          'Debe existir un indicador de madurez antes de considerar futuros formatos regulatorios.',
        blocksSubmission: false,
      },
    ],
    regulatoryNotes: [
      'Este módulo no interpreta normativa vigente de forma oficial.',
      'Este módulo no reemplaza revisión legal, regulatoria ni técnica.',
      'Este módulo no envía pronósticos al Coordinador Eléctrico Nacional.',
      'Este módulo solo prepara una estructura conceptual de simulación.',
      'Los formatos reales deberán verificarse con documentación oficial y responsables técnicos antes de una integración futura.',
    ],
    safetyBoundaries: [
      'No envío CEN real.',
      'No conexión con plataformas regulatorias.',
      'No APIs reales.',
      'No SCADA real.',
      'No lectura de medidores reales.',
      'No forecast real.',
      'No telecontrol.',
      'No modificación de setpoints.',
      'No comandos BESS.',
      'No comandos inversores.',
    ],
    nextRecommendedModule:
      '1O-F.2B — CEN Forecast Compliance Mock Engine',
  };
