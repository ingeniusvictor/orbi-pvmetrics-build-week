import { PVMetricsSoilingCleaningBlueprint } from '../types/pvmetrics-soiling-cleaning-blueprint.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_SOILING_CLEANING_BLUEPRINT: PVMetricsSoilingCleaningBlueprint =
  {
    id: 'pvmetrics-soiling-cleaning-blueprint',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    blueprintStatus: 'ready-for-mock-optimization',
    blueprintStatusLabel: 'BLUEPRINT SOILING & CLEANING LISTO',
    productTitle: 'ORBI Soiling & Cleaning Optimization',
    productVision:
      'Preparar una capa conceptual para estimar pérdidas por suciedad, evaluar conveniencia de limpieza y conectar la decisión con forecast, performance, accuracy, O&M y riesgo comercial.',
    competitivePositioning:
      'ORBI debe diferenciarse explicando si una pérdida se debe a soiling, cuánto podría recuperarse y si conviene limpiar antes de generar una recomendación O&M.',
    supportedSources: [
      'manual-estimate',
      'soiling-station',
      'pyranometer-comparison',
      'visual-field-report',
      'historical-performance-trend',
      'weather-dust-risk',
      'future-integration',
    ],
    fields: [
      {
        id: 'field-plant-context',
        label: 'Contexto de planta',
        category: 'plant-context',
        required: true,
        description:
          'Nombre, código, capacidad y configuración conceptual de la planta.',
        validationRule:
          'Debe existir perfil técnico antes de estimar pérdidas por soiling.',
      },
      {
        id: 'field-soiling-source',
        label: 'Fuente de soiling',
        category: 'soiling-source',
        required: true,
        description:
          'Origen conceptual de la estimación: manual, estación, piranómetro, inspección visual, tendencia histórica o integración futura.',
        validationRule:
          'Debe indicarse si la fuente es mock, manual, pendiente o futura.',
      },
      {
        id: 'field-estimated-loss',
        label: 'Pérdida estimada',
        category: 'loss-estimation',
        required: true,
        description:
          'Pérdida porcentual, energética o comercial atribuible a suciedad.',
        validationRule:
          'Debe declarar unidad conceptual y método de estimación.',
      },
      {
        id: 'field-cleaning-context',
        label: 'Contexto de limpieza',
        category: 'cleaning-context',
        required: true,
        description:
          'Costo, acceso, agua, cuadrilla y factibilidad conceptual de limpieza.',
        validationRule:
          'Debe quedar claro que no crea órdenes de limpieza reales.',
      },
      {
        id: 'field-safety-condition',
        label: 'Condición HSEC',
        category: 'safety-context',
        required: true,
        description:
          'Restricciones de seguridad, clima, acceso y permisos antes de cualquier acción real.',
        validationRule:
          'Toda recomendación debe exigir revisión humana/HSEC.',
      },
      {
        id: 'field-traceability',
        label: 'Trazabilidad',
        category: 'traceability',
        required: true,
        description:
          'Origen, versión, fecha, modo mock y Safety Boundary.',
        validationRule:
          'Debe conservar versión del registry y declaración de uso conceptual.',
      },
    ],
    metricDefinitions: [
      {
        id: 'metric-soiling-loss-pct',
        metric: 'estimated-soiling-loss-pct',
        label: 'Pérdida por soiling (%)',
        description:
          'Reducción conceptual de generación atribuida a suciedad.',
        interpretation:
          'A mayor pérdida, mayor necesidad de revisar limpieza.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-energy-loss-mwh',
        metric: 'estimated-energy-loss-mwh',
        label: 'Pérdida energética estimada',
        description:
          'Energía mock no capturada por efecto de soiling.',
        interpretation:
          'Permite comparar pérdida contra costo de limpieza.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-cleaning-payback',
        metric: 'cleaning-payback-index',
        label: 'Índice de retorno de limpieza',
        description:
          'Relación conceptual entre energía recuperable y costo de limpieza.',
        interpretation:
          'Valor alto sugiere mayor conveniencia conceptual de limpieza.',
        goodDirection: 'higher-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-dust-risk',
        metric: 'dust-risk-index',
        label: 'Índice de riesgo de polvo',
        description:
          'Riesgo conceptual de acumulación por entorno, clima y estacionalidad.',
        interpretation:
          'Ayuda a anticipar pérdida futura por suciedad.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-forecast-impact',
        metric: 'forecast-impact-pct',
        label: 'Impacto en forecast',
        description:
          'Efecto conceptual del soiling sobre forecast y accuracy.',
        interpretation:
          'Conecta soiling con error analytics y causas raíz.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
    ],
    decisionFactors: [
      {
        id: 'factor-soiling-loss',
        factor: 'soiling-loss',
        label: 'Pérdida por soiling',
        description:
          'Magnitud estimada de pérdida energética por suciedad.',
        impactOnDecision:
          'A mayor pérdida, mayor prioridad de limpieza conceptual.',
        requiredForRecommendation: true,
      },
      {
        id: 'factor-cleaning-cost',
        factor: 'cleaning-cost',
        label: 'Costo de limpieza',
        description:
          'Costo conceptual de ejecutar limpieza total o parcial.',
        impactOnDecision:
          'Debe compararse contra energía recuperable.',
        requiredForRecommendation: true,
      },
      {
        id: 'factor-rain-forecast',
        factor: 'rain-forecast',
        label: 'Lluvia esperada',
        description:
          'Lluvia conceptual que puede reducir urgencia de limpieza.',
        impactOnDecision:
          'Si hay lluvia relevante, puede recomendar espera y reevaluación.',
        requiredForRecommendation: false,
      },
      {
        id: 'factor-safety-condition',
        factor: 'safety-condition',
        label: 'Condición HSEC',
        description:
          'Condiciones de seguridad, acceso y permisos.',
        impactOnDecision:
          'Cualquier condición insegura bloquea recomendación ejecutiva real.',
        requiredForRecommendation: true,
      },
      {
        id: 'factor-forecast-accuracy-impact',
        factor: 'forecast-accuracy-impact',
        label: 'Impacto en accuracy',
        description:
          'Relación entre suciedad y error explicado del forecast.',
        impactOnDecision:
          'Si soiling explica error relevante, prioriza revisión O&M.',
        requiredForRecommendation: false,
      },
    ],
    impactDefinitions: [
      {
        id: 'impact-forecast',
        area: 'forecast',
        label: 'Impacto sobre forecast',
        description:
          'El soiling puede reducir energía esperada o introducir sesgo.',
        recommendedAction:
          'Incluir factor soiling mock en explicación del forecast.',
      },
      {
        id: 'impact-performance',
        area: 'performance',
        label: 'Impacto sobre performance',
        description:
          'El soiling puede explicar pérdida bajo irradiancia similar.',
        recommendedAction:
          'Separar soiling de fallas, curtailment, BESS o calidad de datos.',
      },
      {
        id: 'impact-forecast-accuracy',
        area: 'forecast-accuracy',
        label: 'Impacto sobre forecast accuracy',
        description:
          'El soiling puede aumentar MAE/MAPE y aparecer como causa raíz.',
        recommendedAction:
          'Conectar con Error Analytics para clasificar error por soiling.',
      },
      {
        id: 'impact-om-planning',
        area: 'om-planning',
        label: 'Impacto sobre O&M',
        description:
          'La limpieza requiere coordinación de cuadrilla, acceso y seguridad.',
        recommendedAction:
          'Crear recomendación conceptual, nunca orden de trabajo real.',
      },
      {
        id: 'impact-commercial-risk',
        area: 'commercial-risk',
        label: 'Riesgo comercial',
        description:
          'La pérdida por soiling puede representar energía no capturada.',
        recommendedAction:
          'Comparar costo de limpieza contra energía recuperable en motor futuro.',
      },
    ],
    interpretationRules: [
      'Una pérdida de soiling mock no debe presentarse como medición real.',
      'La limpieza debe evaluarse comparando pérdida recuperable versus costo conceptual.',
      'La lluvia futura puede reducir urgencia, pero no debe asumirse sin fuente validada.',
      'La seguridad HSEC bloquea cualquier recomendación ejecutiva real.',
      'El soiling debe separarse de fallas, curtailment, BESS y calidad de datos.',
      'Toda recomendación debe requerir revisión humana antes de cualquier acción en terreno.',
    ],
    traceabilityRules: [
      'Toda estimación debe indicar fuente de soiling.',
      'Toda recomendación debe indicar si es mock, manual, pendiente o futura.',
      'Toda recomendación debe conservar versión, fecha y Safety Boundary.',
      'Toda recomendación alta debe exigir revisión O&M/HSEC.',
      'Ninguna recomendación debe crear órdenes de limpieza reales.',
      'Ninguna recomendación debe enviar correos ni activar flujos externos.',
    ],
    safetyBoundaries: [
      'No usa sensores reales de soiling.',
      'No lee piranómetros reales.',
      'No conecta SCADA.',
      'No lee medidores reales.',
      'No usa APIs meteorológicas reales.',
      'No crea órdenes de limpieza reales.',
      'No guarda datos en backend.',
      'No envía correos reales.',
      'No exporta PDF.',
      'No envía información al CEN.',
      'No controla BESS.',
      'No controla inversores.',
      'No modifica setpoints.',
      'No habilita telecontrol.',
    ],
    nextRecommendedModule:
      '1O-F.5B — Soiling & Cleaning Optimization Mock Engine',
  };
