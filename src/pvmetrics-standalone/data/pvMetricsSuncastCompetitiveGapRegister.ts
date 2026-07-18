import { PVMetricsCompetitiveStrategyRegister } from '../types/pvmetrics-competitive-strategy.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_SUNCAST_COMPETITIVE_GAP_REGISTER: PVMetricsCompetitiveStrategyRegister =
  {
    id: 'pvmetrics-suncast-competitive-gap-register',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    competitorReference: 'Suncast / Nexor',
    strategyTitle:
      'Forecast Strategy Lock — Superar a Suncast con inteligencia técnica, O&M y BESS',
    strategyStatement:
      'ORBI PVMetrics IA debe evolucionar desde una plataforma de validación y preparación read-only hacia un centro predictivo, explicativo y auditable de performance renovable.',
    positioningStatement:
      'Suncast predice generación. ORBI PVMetrics IA debe predecir, explicar, auditar, recomendar y preparar decisiones técnicas seguras para plantas FV+BESS.',
    competitiveGaps: [
      {
        id: 'gap-solar-forecast',
        area: 'Forecast solar',
        competitorCapability:
          'Pronóstico de generación solar con modelos predictivos y datos meteorológicos.',
        orbiCurrentStatus: 'missing',
        priority: 'critical',
        orbiTargetCapability:
          'Motor conceptual de forecast solar con forecast diario, horario y explicación técnica de desviaciones.',
        recommendedModule: '1O-F.1 — Solar Forecasting Product Blueprint',
        strategicReason:
          'El forecast es el núcleo del producto competidor. ORBI necesita una capa predictiva propia para competir frente a clientes como AES.',
      },
      {
        id: 'gap-cen-compliance',
        area: 'Cumplimiento regulatorio',
        competitorCapability:
          'Preparación y envío de pronósticos al operador eléctrico según formato requerido.',
        orbiCurrentStatus: 'missing',
        priority: 'critical',
        orbiTargetCapability:
          'Simulador de cumplimiento CEN con calendario, estado de pronóstico, trazabilidad y preparación de formatos.',
        recommendedModule: '1O-F.2 — CEN Forecast Compliance Simulator',
        strategicReason:
          'En Chile, el valor del forecast está ligado al cumplimiento regulatorio y a la relación con el Coordinador Eléctrico Nacional.',
      },
      {
        id: 'gap-outage-limitations',
        area: 'Eventos operacionales',
        competitorCapability:
          'Registro de mantenimientos, fallas parciales, fallas totales y limitaciones de planta que impactan el pronóstico.',
        orbiCurrentStatus: 'missing',
        priority: 'critical',
        orbiTargetCapability:
          'Capa de eventos de indisponibilidad, limitaciones, derating, mantenimientos y restricciones operacionales que ajusten forecast y performance.',
        recommendedModule:
          '1O-F.3 — Availability / Outage / Limitation Event Layer',
        strategicReason:
          'Sin eventos operacionales, un forecast no explica por qué la planta no generó lo esperado.',
      },
      {
        id: 'gap-forecast-accuracy',
        area: 'Precisión forecast',
        competitorCapability:
          'Seguimiento de precisión predictiva y mejora de modelos.',
        orbiCurrentStatus: 'missing',
        priority: 'high',
        orbiTargetCapability:
          'Análisis MAE, RMSE, MAPE, bias, error horario, error por nubosidad y comparación contra baseline.',
        recommendedModule: '1O-F.4 — Forecast Accuracy & Error Analytics',
        strategicReason:
          'La precisión debe ser medible y auditable para demostrar superioridad técnica frente a competidores.',
      },
      {
        id: 'gap-soiling',
        area: 'Soiling y limpieza',
        competitorCapability:
          'Predicción de suciedad y optimización de limpieza en parques FV.',
        orbiCurrentStatus: 'missing',
        priority: 'high',
        orbiTargetCapability:
          'Predicción de soiling, pérdida energética, recomendación de lavado, costo estimado y prioridad O&M.',
        recommendedModule: '1O-F.5 — Soiling Forecast & Cleaning Optimizer',
        strategicReason:
          'El soiling conecta forecast, performance y O&M; puede transformarse en diferenciador fuerte para ORBI.',
      },
      {
        id: 'gap-sentinel',
        area: 'Vigilancia inteligente',
        competitorCapability:
          'Monitoreo/vigilancia automatizada tipo Sentinel.',
        orbiCurrentStatus: 'partial',
        priority: 'high',
        orbiTargetCapability:
          'ORBI Sentinel PV: capa de detección de desviaciones, datos faltantes, pérdida probable, anomalías y recomendaciones.',
        recommendedModule: '1O-F.6 — ORBI Sentinel PV Monitoring Layer',
        strategicReason:
          'ORBI debe alertar no solo que algo ocurre, sino explicar causa probable, impacto energético y acción sugerida.',
      },
      {
        id: 'gap-market-grid-context',
        area: 'Mercado y operador',
        competitorCapability:
          'Datos de mercado, operador y operación en tiempo real integrados en plataforma.',
        orbiCurrentStatus: 'planned',
        priority: 'medium',
        orbiTargetCapability:
          'Market & Grid Context read-only: estado de mercado, operador, restricciones, precios conceptuales y señales regulatorias.',
        recommendedModule:
          '1O-G.1 — Market & Grid Context Read-Only Blueprint',
        strategicReason:
          'A futuro ORBI debe entender contexto eléctrico, no solo datos internos de planta.',
      },
      {
        id: 'gap-wind',
        area: 'Eólico',
        competitorCapability:
          'Forecast eólico además de forecast solar.',
        orbiCurrentStatus: 'missing',
        priority: 'future',
        orbiTargetCapability:
          'Módulo futuro ORBI WindMetrics IA para forecast eólico y performance de aerogeneradores.',
        recommendedModule: 'Future — ORBI WindMetrics IA',
        strategicReason:
          'No es prioridad inmediata para PVMetrics FV+BESS, pero será relevante para portafolios renovables amplios.',
      },
      {
        id: 'gap-explainable-ai',
        area: 'IA explicativa',
        competitorCapability:
          'Plataforma predictiva orientada a forecast.',
        orbiCurrentStatus: 'differentiator',
        priority: 'critical',
        orbiTargetCapability:
          'IA explicativa que responda por qué hay desviación, qué datos faltan, qué acción O&M conviene y qué riesgo regulatorio existe.',
        recommendedModule:
          'Cross-cutting — ORBI Foton Prime Explainability Layer',
        strategicReason:
          'La ventaja de ORBI no debe ser solo predecir, sino explicar y guiar decisiones técnicas.',
      },
    ],
    recommendedRoadmap: [
      {
        id: 'roadmap-1of1',
        module: '1O-F.1',
        title: 'Solar Forecasting Product Blueprint',
        objective:
          'Diseñar el producto de forecast solar conceptual: horizontes, entradas, salidas, KPIs y explicación técnica.',
        priority: 'critical',
      },
      {
        id: 'roadmap-1of2',
        module: '1O-F.2',
        title: 'CEN Forecast Compliance Simulator',
        objective:
          'Simular cumplimiento regulatorio, calendario de envío, trazabilidad y estado de forecast.',
        priority: 'critical',
      },
      {
        id: 'roadmap-1of3',
        module: '1O-F.3',
        title: 'Availability / Outage / Limitation Event Layer',
        objective:
          'Registrar eventos operacionales que impactan forecast, disponibilidad y performance.',
        priority: 'critical',
      },
      {
        id: 'roadmap-1of4',
        module: '1O-F.4',
        title: 'Forecast Accuracy & Error Analytics',
        objective:
          'Medir precisión del forecast con métricas técnicas y comparación contra baseline.',
        priority: 'high',
      },
      {
        id: 'roadmap-1of5',
        module: '1O-F.5',
        title: 'Soiling Forecast & Cleaning Optimizer',
        objective:
          'Estimar suciedad, pérdida energética y recomendación de lavado óptima.',
        priority: 'high',
      },
      {
        id: 'roadmap-1of6',
        module: '1O-F.6',
        title: 'ORBI Sentinel PV Monitoring Layer',
        objective:
          'Detectar desviaciones, anomalías, datos faltantes y acciones recomendadas.',
        priority: 'high',
      },
      {
        id: 'roadmap-1of7',
        module: '1O-F.7',
        title: 'Read-Only Connector Blueprint & Integration Guardrails',
        objective:
          'Retomar arquitectura segura de conectores después de definir producto predictivo competitivo.',
        priority: 'medium',
      },
    ],
    differentiators: [
      'Forecast más explicación técnica de causa probable.',
      'Integración natural con BESS y separación FV/BESS.',
      'Performance técnico por señal, inversor, clima, evento y contrato de datos.',
      'Gobernanza read-only antes de cualquier integración.',
      'Handoff técnico y cliente generado dentro de la app.',
      'IA explicativa orientada a O&M y riesgo regulatorio.',
      'Soiling conectado a decisión económica y logística de limpieza.',
      'Sentinel PV para detectar anomalías y no solo mostrar datos.',
    ],
    safetyBoundaries: [
      'Este registro es estratégico y local.',
      'No crea forecast real todavía.',
      'No conecta SCADA.',
      'No consume APIs meteorológicas reales.',
      'No lee medidores reales.',
      'No envía pronósticos al CEN.',
      'No controla BESS.',
      'No controla inversores.',
      'No modifica setpoints.',
      'No habilita telecontrol.',
    ],
    nextRecommendedModule: '1O-F.1 — Solar Forecasting Product Blueprint',
  };
