import { PVMetricsForecastAccuracyBlueprint } from '../types/pvmetrics-forecast-accuracy-blueprint.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_FORECAST_ACCURACY_BLUEPRINT: PVMetricsForecastAccuracyBlueprint =
  {
    id: 'pvmetrics-forecast-accuracy-blueprint',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    blueprintStatus: 'ready-for-mock-engine',
    blueprintStatusLabel: 'BLUEPRINT DE FORECAST ACCURACY LISTO',
    productTitle: 'ORBI Forecast Accuracy & Error Analytics',
    productVision:
      'Crear una capa conceptual para medir la precisión del forecast solar, explicar desviaciones, separar causas operacionales y transformar el error en aprendizaje técnico.',
    competitivePositioning:
      'Suncast puede entregar forecast. ORBI debe diferenciarse explicando por qué el forecast acertó o falló, conectando error con clima, disponibilidad, soiling, BESS, curtailment, datos y eventos O&M.',
    metricDefinitions: [
      {
        id: 'metric-mae',
        metric: 'mae',
        label: 'MAE — Error Absoluto Medio',
        description:
          'Promedio de la diferencia absoluta entre forecast y generación observada.',
        interpretation:
          'Permite entender el error promedio en unidades de energía o potencia.',
        goodDirection: 'lower-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-rmse',
        metric: 'rmse',
        label: 'RMSE — Raíz del Error Cuadrático Medio',
        description:
          'Métrica que penaliza más fuerte errores grandes del forecast.',
        interpretation:
          'Útil para detectar desviaciones relevantes o ventanas con error crítico.',
        goodDirection: 'lower-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-mape',
        metric: 'mape',
        label: 'MAPE — Error Porcentual Absoluto Medio',
        description:
          'Error relativo promedio respecto a la generación observada.',
        interpretation:
          'Ayuda a comparar desempeño entre plantas o ventanas, con precaución en horas de baja generación.',
        goodDirection: 'lower-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-wmape',
        metric: 'wmape',
        label: 'WMAPE — Error Porcentual Absoluto Ponderado',
        description:
          'Error absoluto ponderado por energía, más estable en ventanas con generación baja.',
        interpretation:
          'Métrica recomendada para reportes ejecutivos porque reduce distorsiones de horas con baja generación.',
        goodDirection: 'lower-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'planned',
      },
      {
        id: 'metric-bias',
        metric: 'bias',
        label: 'Bias — Sesgo del forecast',
        description:
          'Indica si el forecast tiende a sobreestimar o subestimar generación.',
        interpretation:
          'Un valor cercano a cero indica ausencia de sesgo sistemático.',
        goodDirection: 'zero-is-ideal',
        requiresActualGeneration: true,
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-nmae',
        metric: 'nmae',
        label: 'NMAE — MAE Normalizado',
        description:
          'Error absoluto medio normalizado contra capacidad o energía de referencia.',
        interpretation:
          'Permite comparar plantas de distinta escala.',
        goodDirection: 'lower-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'planned',
      },
      {
        id: 'metric-confidence-hit-rate',
        metric: 'confidence-hit-rate',
        label: 'Confidence Hit Rate',
        description:
          'Porcentaje de puntos reales que caen dentro de la banda de confianza del forecast.',
        interpretation:
          'Ayuda a evaluar si las bandas de incertidumbre son realistas.',
        goodDirection: 'higher-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'planned',
      },
      {
        id: 'metric-event-explained-error',
        metric: 'event-explained-error',
        label: 'Event Explained Error',
        description:
          'Porcentaje del error que puede explicarse por eventos operacionales registrados o simulados.',
        interpretation:
          'Diferencia a ORBI: no solo mide error, sino que intenta explicar su causa.',
        goodDirection: 'higher-is-better',
        requiresActualGeneration: true,
        safeMockAvailability: 'available-now',
      },
    ],
    evaluationWindows: [
      {
        id: 'window-intraday',
        window: 'intraday',
        label: 'Intradía',
        objective:
          'Evaluar precisión dentro del mismo día para detectar cambios rápidos de clima, disponibilidad o datos.',
        useCase:
          'Ajuste operativo, revisión de desvíos rápidos y alertas de O&M.',
      },
      {
        id: 'window-day-ahead',
        window: 'day-ahead',
        label: 'Día siguiente',
        objective:
          'Medir la calidad del forecast emitido para el día siguiente.',
        useCase:
          'Madurez del forecast solar, revisión cliente y preparación regulatoria conceptual.',
      },
      {
        id: 'window-rolling-7-days',
        window: 'rolling-7-days',
        label: 'Rolling 7 días',
        objective:
          'Detectar patrones recientes de error, sesgo y desviaciones recurrentes.',
        useCase:
          'Seguimiento semanal de performance del modelo.',
      },
      {
        id: 'window-rolling-30-days',
        window: 'rolling-30-days',
        label: 'Rolling 30 días',
        objective:
          'Consolidar desempeño mensual y explicar degradaciones o mejoras.',
        useCase:
          'Reporte técnico, revisión O&M y análisis ejecutivo.',
      },
      {
        id: 'window-event-window',
        window: 'event-window',
        label: 'Ventana de evento',
        objective:
          'Evaluar precisión durante un evento operacional específico.',
        useCase:
          'Separar error del modelo versus error explicado por falla, recorte, soiling, BESS o comunicación.',
      },
    ],
    errorCategories: [
      {
        id: 'error-weather',
        category: 'weather-error',
        label: 'Error meteorológico',
        description:
          'Desviación asociada a nubosidad, irradiancia, temperatura u otra condición climática no capturada.',
        typicalEvidence:
          'Cambio abrupto de irradiancia, nubosidad no prevista, temperatura elevada o condición meteorológica inestable.',
        relatedOperationalEventCategories: ['weather-related'],
        impactedAreas: ['forecast-quality', 'om-planning', 'client-reporting'],
        recommendedAction:
          'Cruzar con fuente meteorológica validada antes de atribuir el error al modelo.',
      },
      {
        id: 'error-availability',
        category: 'availability-error',
        label: 'Error por disponibilidad',
        description:
          'Desviación generada por indisponibilidad, falla o mantenimiento no incluido en el forecast.',
        typicalEvidence:
          'Evento activo de falla, mantenimiento, derating o inversor fuera de servicio.',
        relatedOperationalEventCategories: [
          'planned-maintenance',
          'forced-outage',
          'partial-derating',
          'inverter-issue',
        ],
        impactedAreas: [
          'forecast-quality',
          'om-planning',
          'cen-compliance',
          'commercial-risk',
        ],
        recommendedAction:
          'Actualizar disponibilidad conceptual y separar pérdida operacional de error del forecast.',
      },
      {
        id: 'error-soiling',
        category: 'soiling-error',
        label: 'Error por soiling',
        description:
          'Desviación asociada a suciedad, polvo, barro, aves o pérdida óptica acumulada.',
        typicalEvidence:
          'Pérdida progresiva, diferencia entre strings o tendencia de generación bajo irradiancia similar.',
        relatedOperationalEventCategories: ['soiling-related'],
        impactedAreas: ['forecast-quality', 'om-planning', 'client-reporting'],
        recommendedAction:
          'Marcar evento de soiling y derivar a futuro módulo de optimización de limpieza.',
      },
      {
        id: 'error-bess-separation',
        category: 'bess-separation-error',
        label: 'Error por separación FV/BESS',
        description:
          'Desviación aparente causada por no separar generación FV, carga BESS y descarga BESS.',
        typicalEvidence:
          'Energía observada en POI no coincide con generación FV pura por operación de almacenamiento.',
        relatedOperationalEventCategories: ['bess-limitation'],
        impactedAreas: ['bess-analysis', 'forecast-quality', 'data-governance'],
        recommendedAction:
          'Separar mediciones FV, BESS y POI antes de evaluar error del forecast solar.',
      },
      {
        id: 'error-curtailment',
        category: 'curtailment-error',
        label: 'Error por curtailment o recorte',
        description:
          'Desviación generada por limitación externa de red o instrucción operacional.',
        typicalEvidence:
          'Potencia limitada, recorte sostenido o evento de grid curtailment declarado.',
        relatedOperationalEventCategories: ['grid-curtailment'],
        impactedAreas: ['forecast-quality', 'cen-compliance', 'commercial-risk'],
        recommendedAction:
          'Separar recorte externo de performance interno de planta.',
      },
      {
        id: 'error-data-quality',
        category: 'data-quality-error',
        label: 'Error por calidad de datos',
        description:
          'Desviación causada por datos faltantes, atrasados, duplicados, congelados o no confiables.',
        typicalEvidence:
          'Pérdida de comunicación, logger sin datos, timestamp irregular o medición incompleta.',
        relatedOperationalEventCategories: [
          'communication-loss',
          'data-quality-issue',
        ],
        impactedAreas: ['data-governance', 'cen-compliance', 'client-reporting'],
        recommendedAction:
          'Bloquear conclusiones automáticas y exigir revisión humana.',
      },
      {
        id: 'error-model-bias',
        category: 'model-bias',
        label: 'Sesgo del modelo',
        description:
          'Tendencia persistente del forecast a sobreestimar o subestimar generación.',
        typicalEvidence:
          'Bias positivo o negativo recurrente durante varias ventanas.',
        relatedOperationalEventCategories: [],
        impactedAreas: ['forecast-quality', 'client-reporting'],
        recommendedAction:
          'Revisar supuestos, normalización, climatología y calibración futura.',
      },
      {
        id: 'error-unexplained',
        category: 'unexplained-error',
        label: 'Error no explicado',
        description:
          'Desviación relevante sin causa operacional, meteorológica o de datos identificada.',
        typicalEvidence:
          'Error alto sin evento asociado ni evidencia suficiente.',
        relatedOperationalEventCategories: ['manual-note'],
        impactedAreas: ['forecast-quality', 'om-planning', 'client-reporting'],
        recommendedAction:
          'Crear nota manual de revisión y escalar a análisis técnico.',
      },
    ],
    readinessChecks: [
      {
        id: 'check-forecast-series',
        label: 'Serie forecast disponible',
        required: true,
        description:
          'Debe existir una serie forecast para calcular precisión conceptual.',
        blocksAccuracyAssessment: true,
      },
      {
        id: 'check-observed-series',
        label: 'Serie observada disponible',
        required: true,
        description:
          'En una fase real, debe existir generación observada validada. En esta fase solo se permite mock.',
        blocksAccuracyAssessment: true,
      },
      {
        id: 'check-capacity-reference',
        label: 'Referencia de capacidad',
        required: true,
        description:
          'Debe existir capacidad AC o referencia energética para normalizar métricas.',
        blocksAccuracyAssessment: true,
      },
      {
        id: 'check-operational-events',
        label: 'Eventos operacionales disponibles',
        required: false,
        description:
          'Permiten explicar parte del error y separar desviaciones atribuibles a operación.',
        blocksAccuracyAssessment: false,
      },
      {
        id: 'check-data-quality',
        label: 'Calidad de datos validada',
        required: true,
        description:
          'Debe declararse si los datos son mock, reales, incompletos o pendientes.',
        blocksAccuracyAssessment: true,
      },
      {
        id: 'check-human-review',
        label: 'Revisión humana',
        required: true,
        description:
          'Todo análisis de precisión debe pasar por revisión técnica antes de uso externo.',
        blocksAccuracyAssessment: true,
      },
    ],
    interpretationRules: [
      'MAE y RMSE deben interpretarse junto con capacidad de planta y ventana horaria.',
      'MAPE debe usarse con cuidado en horas de baja generación.',
      'Bias persistente indica sobreestimación o subestimación sistemática.',
      'Un error alto durante un evento operacional no debe atribuirse automáticamente al modelo.',
      'La separación FV/BESS es obligatoria antes de evaluar precisión solar en plantas híbridas.',
      'La calidad de datos puede invalidar la evaluación de precisión.',
      'Ninguna métrica mock debe presentarse como desempeño real.',
      'Toda conclusión debe mantener revisión humana y Safety Boundary.',
    ],
    safetyBoundaries: [
      'No calcula precisión real.',
      'No consume datos reales.',
      'No conecta SCADA.',
      'No lee medidores reales.',
      'No usa APIs meteorológicas reales.',
      'No envía información al CEN.',
      'No guarda datos en backend.',
      'No crea reportes regulatorios reales.',
      'No crea órdenes de trabajo.',
      'No controla BESS.',
      'No controla inversores.',
      'No modifica setpoints.',
      'No habilita telecontrol.',
    ],
    nextRecommendedModule:
      '1O-F.4B — Forecast Accuracy & Error Analytics Mock Engine',
  };
