import { PVMetricsSolarForecastProductBlueprint } from '../types/pvmetrics-solar-forecast-blueprint.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_SOLAR_FORECAST_PRODUCT_BLUEPRINT: PVMetricsSolarForecastProductBlueprint =
  {
    id: 'pvmetrics-solar-forecast-product-blueprint',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    blueprintStatus: 'ready-for-mock-engine',
    blueprintStatusLabel: 'LISTO PARA MOTOR MOCK DE FORECAST',
    productTitle: 'ORBI Solar Forecast IA',
    productVision:
      'Crear una capa predictiva solar capaz de estimar generación futura, explicar desviaciones, medir precisión y conectar forecast con O&M, BESS, soiling y cumplimiento regulatorio.',
    competitivePositioning:
      'Suncast predice generación. ORBI Solar Forecast IA debe predecir, explicar, auditar y recomendar acciones técnicas seguras.',
    horizons: [
      {
        id: 'horizon-same-day',
        horizon: 'same-day',
        label: 'Forecast intradía',
        description:
          'Predicción conceptual para el mismo día, orientada a seguimiento operacional y desviaciones rápidas.',
        intendedUse:
          'Detectar diferencias entre generación esperada y generación observada durante la operación diaria.',
      },
      {
        id: 'horizon-day-ahead',
        horizon: 'day-ahead',
        label: 'Forecast día siguiente',
        description:
          'Predicción conceptual para el día siguiente, pensada como base para cumplimiento y planificación.',
        intendedUse:
          'Preparar forecast operativo/regulatorio y anticipar riesgos de generación.',
      },
      {
        id: 'horizon-week-ahead',
        horizon: 'week-ahead',
        label: 'Forecast semanal',
        description:
          'Proyección conceptual de varios días para planificación O&M, limpieza y disponibilidad.',
        intendedUse:
          'Coordinar mantenimiento, lavado, inspección y priorización técnica.',
      },
      {
        id: 'horizon-month-outlook',
        horizon: 'month-outlook',
        label: 'Outlook mensual',
        description:
          'Vista conceptual de tendencia mensual de generación y riesgo de performance.',
        intendedUse:
          'Apoyar revisión ejecutiva, planificación y comparación contra presupuesto energético.',
      },
      {
        id: 'horizon-regulatory-window',
        horizon: 'regulatory-window',
        label: 'Ventana regulatoria',
        description:
          'Horizonte conceptual orientado a preparación de cumplimiento ante operador eléctrico.',
        intendedUse:
          'Preparar trazabilidad para futuros módulos de simulación CEN.',
      },
    ],
    requiredInputs: [
      {
        id: 'input-plant-profile',
        label: 'Perfil técnico de planta',
        category: 'plant-profile',
        required: true,
        currentAvailability: 'available-demo',
        description:
          'Capacidad DC/AC, ubicación, tecnología, configuración de planta y parámetros base.',
        safetyNote:
          'Debe provenir de perfil validado o demo local; no requiere conexión real.',
      },
      {
        id: 'input-weather',
        label: 'Datos meteorológicos',
        category: 'weather',
        required: true,
        currentAvailability: 'planned',
        description:
          'Irradiancia, temperatura ambiente, temperatura de módulo, nubosidad y variables climáticas.',
        safetyNote:
          'En esta etapa no se conectan APIs meteorológicas reales.',
      },
      {
        id: 'input-historical-generation',
        label: 'Generación histórica',
        category: 'historical-generation',
        required: true,
        currentAvailability: 'planned',
        description:
          'Series históricas de potencia y energía para calibrar el comportamiento esperado.',
        safetyNote:
          'No se leen medidores reales ni SCADA en este módulo.',
      },
      {
        id: 'input-availability-events',
        label: 'Disponibilidad e indisponibilidades',
        category: 'availability',
        required: true,
        currentAvailability: 'planned',
        description:
          'Disponibilidad de planta, fallas, mantenimientos, limitaciones y derating.',
        safetyNote:
          'Se modelará primero como eventos locales simulados.',
      },
      {
        id: 'input-soiling',
        label: 'Soiling',
        category: 'soiling',
        required: false,
        currentAvailability: 'planned',
        description:
          'Factor de suciedad, pérdida estimada y condición de limpieza.',
        safetyNote:
          'No controla lavados ni genera órdenes reales.',
      },
      {
        id: 'input-bess',
        label: 'BESS',
        category: 'bess',
        required: false,
        currentAvailability: 'planned',
        description:
          'Estado conceptual de almacenamiento, SoC y energía disponible para separar FV de BESS.',
        safetyNote:
          'No controla carga, descarga, despacho ni setpoints BESS.',
      },
    ],
    expectedOutputs: [
      {
        id: 'output-energy-forecast',
        label: 'Forecast de energía',
        category: 'energy-forecast',
        description:
          'Estimación conceptual de energía esperada por horizonte de forecast.',
        differentiator: false,
      },
      {
        id: 'output-power-curve',
        label: 'Curva de potencia esperada',
        category: 'power-curve',
        description:
          'Perfil horario conceptual de potencia para comparar contra operación real.',
        differentiator: false,
      },
      {
        id: 'output-confidence-band',
        label: 'Banda de confianza',
        category: 'confidence-band',
        description:
          'Rango superior/inferior conceptual para comunicar incertidumbre del forecast.',
        differentiator: true,
      },
      {
        id: 'output-risk-flags',
        label: 'Alertas de riesgo forecast',
        category: 'risk-flag',
        description:
          'Banderas por nubosidad, indisponibilidad, soiling, datos faltantes o baja confianza.',
        differentiator: true,
      },
      {
        id: 'output-explanation',
        label: 'Explicación técnica',
        category: 'technical-explanation',
        description:
          'Texto IA que explica por qué el forecast sube, baja o pierde confianza.',
        differentiator: true,
      },
      {
        id: 'output-regulatory-summary',
        label: 'Resumen regulatorio conceptual',
        category: 'regulatory-summary',
        description:
          'Resumen preparado para futuros módulos de cumplimiento ante operador eléctrico.',
        differentiator: true,
      },
      {
        id: 'output-om-recommendation',
        label: 'Recomendación O&M',
        category: 'om-recommendation',
        description:
          'Acciones sugeridas según impacto de forecast, disponibilidad, soiling o eventos.',
        differentiator: true,
      },
    ],
    forecastKpis: [
      {
        id: 'kpi-mae',
        label: 'MAE',
        category: 'accuracy',
        unit: 'MWh / MW',
        description: 'Error absoluto medio entre forecast y generación real.',
        whyItMatters:
          'Permite medir si el forecast es útil y comparar contra baseline.',
      },
      {
        id: 'kpi-rmse',
        label: 'RMSE',
        category: 'accuracy',
        unit: 'MWh / MW',
        description: 'Error cuadrático medio, sensible a errores grandes.',
        whyItMatters:
          'Ayuda a identificar días u horas con desviaciones severas.',
      },
      {
        id: 'kpi-mape',
        label: 'MAPE',
        category: 'accuracy',
        unit: '%',
        description: 'Error porcentual absoluto medio.',
        whyItMatters:
          'Facilita comunicar precisión a usuarios no técnicos.',
      },
      {
        id: 'kpi-bias',
        label: 'Bias',
        category: 'bias',
        unit: '% / MWh',
        description: 'Tendencia del forecast a sobreestimar o subestimar.',
        whyItMatters:
          'Permite corregir sesgos sistemáticos del modelo.',
      },
      {
        id: 'kpi-weather-impact',
        label: 'Impacto climático',
        category: 'weather-impact',
        unit: '% / MWh',
        description:
          'Pérdida o variación atribuida a irradiancia, temperatura o nubosidad.',
        whyItMatters:
          'Separa problemas climáticos de problemas técnicos.',
      },
      {
        id: 'kpi-availability-impact',
        label: 'Impacto disponibilidad',
        category: 'availability-impact',
        unit: '% / MWh',
        description:
          'Impacto de fallas, limitaciones o mantenimientos sobre generación esperada.',
        whyItMatters:
          'Conecta forecast con O&M real.',
      },
      {
        id: 'kpi-regulatory-readiness',
        label: 'Readiness regulatorio',
        category: 'regulatory-readiness',
        unit: '%',
        description:
          'Madurez conceptual para preparar forecast con trazabilidad regulatoria.',
        whyItMatters:
          'Apunta directamente a competir contra servicios usados para cumplimiento.',
      },
    ],
    differentiators: [
      {
        id: 'diff-explainability',
        label: 'Forecast explicativo',
        description:
          'El sistema no solo predice energía, también explica causa probable de desviaciones.',
        competitorGapAddressed:
          'Evita competir solo por curva de forecast y agrega valor técnico para O&M.',
      },
      {
        id: 'diff-bess-aware',
        label: 'Forecast consciente de BESS',
        description:
          'Separa generación FV, estado conceptual BESS y posibles efectos sobre energía observada.',
        competitorGapAddressed:
          'Permite abordar plantas híbridas FV+BESS con mayor claridad técnica.',
      },
      {
        id: 'diff-om-linked',
        label: 'Forecast conectado a O&M',
        description:
          'Cada desviación puede generar una recomendación técnica o una hipótesis operacional.',
        competitorGapAddressed:
          'Convierte forecast en herramienta de acción, no solo de reporte.',
      },
      {
        id: 'diff-governance',
        label: 'Forecast gobernado por datos validados',
        description:
          'El forecast nace desde perfiles, evidencias, contrato de datos y handoff read-only.',
        competitorGapAddressed:
          'Reduce riesgo de trabajar con señales no verificadas o mal interpretadas.',
      },
    ],
    safetyBoundaries: [
      'Este blueprint es conceptual y local.',
      'No calcula forecast real todavía.',
      'No conecta APIs meteorológicas reales.',
      'No conecta SCADA.',
      'No lee medidores reales.',
      'No envía pronósticos al CEN.',
      'No controla BESS.',
      'No controla inversores.',
      'No modifica setpoints.',
      'No habilita telecontrol.',
    ],
    nextRecommendedModule:
      '1O-F.1B — Solar Forecasting Logic & Mock Forecast Engine',
  };
