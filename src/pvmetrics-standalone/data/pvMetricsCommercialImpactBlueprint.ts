import { PVMetricsCommercialImpactBlueprint } from '../types/pvmetrics-commercial-impact-blueprint.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const PV_METRICS_COMMERCIAL_IMPACT_BLUEPRINT: PVMetricsCommercialImpactBlueprint =
  {
    id: 'pvmetrics-commercial-impact-blueprint',
    appName: 'ORBI PVMetrics IA',
    generatedAtLabel: getGeneratedAtLabel(),
    blueprintStatus: 'mock-ready',
    blueprintStatusLabel: 'BLUEPRINT COMERCIAL MOCK LISTO',
    productTitle: 'ORBI Commercial Impact & Revenue Risk',
    productVision:
      'Crear una capa conceptual para traducir pérdidas técnicas mock en riesgo comercial, oportunidad de recuperación y priorización O&M sin usar precios reales ni contratos reales.',
    commercialScope:
      'Evaluación mock de exposición comercial asociada a forecast error, disponibilidad, soiling, curtailment, separación FV/BESS y calidad de datos.',
    supportedSources: [
      'mock-forecast-series',
      'mock-forecast-accuracy',
      'mock-operational-events',
      'mock-soiling-cleaning',
      'mock-availability-loss',
      'mock-curtailment-loss',
      'mock-bess-context',
      'manual-assumption',
      'future-market-api',
      'future-contract-data',
    ],
    fields: [
      {
        id: 'field-plant-context',
        label: 'Contexto de planta',
        category: 'plant-context',
        required: true,
        description:
          'Nombre, código, capacidad y perfil conceptual de la planta.',
        validationRule:
          'Debe existir perfil de planta antes de construir evaluación comercial mock.',
      },
      {
        id: 'field-energy-context',
        label: 'Contexto energético',
        category: 'energy-context',
        required: true,
        description:
          'Energía forecast, energía perdida, energía recuperable o exposición energética mock.',
        validationRule:
          'Debe indicarse que la energía proviene de simulaciones mock o supuestos manuales.',
      },
      {
        id: 'field-price-assumption',
        label: 'Supuesto de precio',
        category: 'price-assumption',
        required: true,
        description:
          'Precio conceptual mock usado para valorizar pérdidas u oportunidades.',
        validationRule:
          'Debe quedar marcado como mock. No usar precios reales ni contratos reales.',
      },
      {
        id: 'field-loss-source',
        label: 'Fuente de pérdida',
        category: 'loss-source',
        required: true,
        description:
          'Origen conceptual de la pérdida: forecast error, disponibilidad, soiling, curtailment, BESS o calidad de datos.',
        validationRule:
          'Debe vincularse a una fuente mock trazable.',
      },
      {
        id: 'field-risk-context',
        label: 'Contexto de riesgo',
        category: 'risk-context',
        required: true,
        description:
          'Nivel conceptual de exposición comercial asociado a la pérdida.',
        validationRule:
          'Debe expresarse como riesgo mock, no financiero real.',
      },
      {
        id: 'field-traceability',
        label: 'Trazabilidad',
        category: 'traceability',
        required: true,
        description:
          'Versión, fecha, fuente, supuestos mock y Safety Boundary.',
        validationRule:
          'Debe conservar versión del registry y declarar uso conceptual.',
      },
    ],
    metricDefinitions: [
      {
        id: 'metric-lost-energy',
        metric: 'estimated-lost-energy-mwh',
        label: 'Energía perdida estimada',
        description:
          'Energía mock no generada o no capturada por causa técnica conceptual.',
        interpretation:
          'Base energética para estimar exposición comercial mock.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-revenue-risk',
        metric: 'estimated-revenue-risk',
        label: 'Riesgo de ingreso estimado',
        description:
          'Valorización conceptual de la energía perdida usando precio mock.',
        interpretation:
          'Permite ordenar prioridades, pero no representa facturación real.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-recoverable-revenue',
        metric: 'recoverable-revenue-opportunity',
        label: 'Oportunidad de recuperación',
        description:
          'Valor conceptual de energía que podría recuperarse al corregir causa técnica.',
        interpretation:
          'Ayuda a priorizar acciones O&M de mayor retorno mock.',
        goodDirection: 'higher-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-forecast-error-commercial',
        metric: 'forecast-error-commercial-exposure',
        label: 'Exposición por error forecast',
        description:
          'Riesgo comercial mock asociado a desviaciones del forecast.',
        interpretation:
          'Conecta Forecast Accuracy con impacto comercial conceptual.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-availability-commercial',
        metric: 'availability-commercial-impact',
        label: 'Impacto comercial por disponibilidad',
        description:
          'Exposición mock atribuida a indisponibilidad, derating o fallas.',
        interpretation:
          'Ayuda a separar pérdida operacional de error del forecast.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-soiling-commercial',
        metric: 'soiling-commercial-impact',
        label: 'Impacto comercial por soiling',
        description:
          'Exposición mock asociada a suciedad y oportunidad de limpieza.',
        interpretation:
          'Conecta Soiling & Cleaning con riesgo comercial.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
      {
        id: 'metric-data-quality-commercial',
        metric: 'data-quality-commercial-risk',
        label: 'Riesgo comercial por calidad de datos',
        description:
          'Riesgo conceptual cuando datos incompletos impiden concluir impacto.',
        interpretation:
          'Debe bloquear conclusiones automáticas y exigir revisión humana.',
        goodDirection: 'lower-is-better',
        safeMockAvailability: 'available-now',
      },
    ],
    assumptionDefinitions: [
      {
        id: 'assumption-mock-energy-price',
        assumptionType: 'mock-energy-price',
        label: 'Precio energía mock',
        description:
          'Precio conceptual para valorizar energía perdida sin usar mercado real.',
        requiredForMockAssessment: true,
        mustBeMarkedAsMock: true,
      },
      {
        id: 'assumption-mock-contract-price',
        assumptionType: 'mock-contract-price',
        label: 'Precio contrato mock',
        description:
          'Supuesto conceptual de contrato, sin relación con contratos reales.',
        requiredForMockAssessment: false,
        mustBeMarkedAsMock: true,
      },
      {
        id: 'assumption-mock-recovery-factor',
        assumptionType: 'mock-recovery-factor',
        label: 'Factor de recuperación mock',
        description:
          'Porcentaje conceptual de pérdida que podría recuperarse con acción O&M.',
        requiredForMockAssessment: true,
        mustBeMarkedAsMock: true,
      },
      {
        id: 'assumption-manual-note',
        assumptionType: 'manual-note',
        label: 'Nota manual',
        description:
          'Comentario humano para explicar supuestos, límites o contexto.',
        requiredForMockAssessment: false,
        mustBeMarkedAsMock: true,
      },
    ],
    impactDefinitions: [
      {
        id: 'impact-client-reporting',
        area: 'client-reporting',
        label: 'Reporte cliente',
        description:
          'Permite explicar impacto comercial conceptual en lenguaje ejecutivo.',
        recommendedAction:
          'Generar texto cliente seguro, sin cifras reales ni compromisos contractuales.',
      },
      {
        id: 'impact-om-prioritization',
        area: 'om-prioritization',
        label: 'Priorización O&M',
        description:
          'Ayuda a ordenar acciones según pérdida técnica valorizada mock.',
        recommendedAction:
          'Cruzar con seguridad, disponibilidad de cuadrilla y revisión humana.',
      },
      {
        id: 'impact-forecast-risk',
        area: 'forecast-risk',
        label: 'Riesgo forecast',
        description:
          'Conecta error de forecast con exposición comercial conceptual.',
        recommendedAction:
          'No atribuir exposición comercial al modelo si existen eventos operacionales.',
      },
      {
        id: 'impact-soiling-cleaning',
        area: 'soiling-cleaning',
        label: 'Soiling & Cleaning',
        description:
          'Relaciona limpieza conceptual con oportunidad de recuperación.',
        recommendedAction:
          'Comparar costo mock de limpieza versus recuperación mock.',
      },
      {
        id: 'impact-bess-analysis',
        area: 'bess-analysis',
        label: 'Análisis BESS',
        description:
          'Evita confundir generación FV, carga/descarga BESS y energía POI.',
        recommendedAction:
          'Mantener separación FV/BESS antes de valorar impacto comercial.',
      },
      {
        id: 'impact-data-quality',
        area: 'data-quality',
        label: 'Calidad de datos',
        description:
          'Datos incompletos pueden invalidar una evaluación comercial.',
        recommendedAction:
          'Bloquear conclusión automática y exigir revisión técnica.',
      },
    ],
    interpretationRules: [
      'Todo valor comercial debe marcarse como mock.',
      'No usar precios reales de energía ni contratos reales.',
      'No presentar exposición mock como facturación, pérdida contractual ni ingreso real.',
      'Separar pérdidas por forecast, disponibilidad, soiling, curtailment, BESS y calidad de datos.',
      'No atribuir riesgo comercial al forecast si existe una causa operacional explicable.',
      'Toda conclusión comercial debe requerir revisión humana.',
    ],
    traceabilityRules: [
      'Toda métrica comercial debe indicar fuente mock.',
      'Todo supuesto de precio debe quedar marcado como mock.',
      'Toda recomendación debe conservar versión, fecha y Safety Boundary.',
      'Toda cifra comercial debe declararse no contractual.',
      'No se deben crear reportes oficiales, facturas ni integraciones ERP.',
    ],
    safetyBoundaries: [
      'No usa precios reales de energía.',
      'No usa contratos reales.',
      'No calcula facturación real.',
      'No integra ERP.',
      'No usa APIs de mercado.',
      'No usa datos comerciales reales de cliente.',
      'No conecta SCADA.',
      'No lee medidores reales.',
      'No envía información al CEN.',
      'No guarda datos en backend.',
      'No exporta PDF.',
      'No envía correos reales.',
      'No controla BESS.',
      'No controla inversores.',
      'No modifica setpoints.',
      'No habilita telecontrol.',
    ],
    nextRecommendedModule:
      '1O-F.6C.1 — Commercial Impact & Revenue Risk Mock Types',
  };
