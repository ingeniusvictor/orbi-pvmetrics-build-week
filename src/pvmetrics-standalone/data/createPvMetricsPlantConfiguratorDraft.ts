import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorStep,
} from '../types/pvmetrics-plant-configurator.types';

export const PVMETRICS_PLANT_CONFIGURATOR_STEPS: PVMetricsPlantConfiguratorStep[] =
  [
    {
      id: 'workspace',
      title: 'Cliente / Workspace',
      shortTitle: 'Workspace',
      description:
        'Define el cliente, workspace y contexto general donde se registrará la planta.',
      requiredFields: ['workspaceName', 'ownerName', 'country', 'region'],
    },
    {
      id: 'plant-identity',
      title: 'Identificación de Planta',
      shortTitle: 'Planta',
      description:
        'Registra el nombre, código interno y tecnología principal de la planta.',
      requiredFields: ['plantName', 'plantCode', 'technology'],
    },
    {
      id: 'location',
      title: 'Ubicación',
      shortTitle: 'Ubicación',
      description:
        'Define comuna, zona horaria y coordenadas para contextualizar recurso solar y operación.',
      requiredFields: ['commune', 'timezone'],
    },
    {
      id: 'pv-system',
      title: 'Sistema Fotovoltaico',
      shortTitle: 'FV',
      description:
        'Configura potencia DC/AC, tipo de estructura y datos básicos del campo FV.',
      requiredFields: ['pvCapacityDcMwp', 'pvCapacityAcMw', 'mountingType'],
    },
    {
      id: 'bess-system',
      title: 'Sistema BESS',
      shortTitle: 'BESS',
      description:
        'Configura potencia, energía, modo de operación y EMS del almacenamiento.',
      requiredFields: ['hasBess', 'bessPowerMw', 'bessEnergyMwh'],
    },
    {
      id: 'equipment',
      title: 'Equipamiento',
      shortTitle: 'Equipos',
      description:
        'Registra inversores, medidor principal, SCADA/data logger y estación meteorológica.',
      requiredFields: [
        'inverterCount',
        'inverterModel',
        'meterModel',
        'scadaVendor',
        'weatherStationModel',
      ],
    },
    {
      id: 'data-sources',
      title: 'Fuentes de Datos',
      shortTitle: 'Fuentes',
      description:
        'Identifica qué fuentes están disponibles para un futuro piloto read-only.',
      requiredFields: [
        'hasHistoricalCsv',
        'hasScadaReadonly',
        'hasEnergyMeter',
        'hasWeatherStation',
      ],
    },
    {
      id: 'readonly-security',
      title: 'Seguridad Read-Only',
      shortTitle: 'Seguridad',
      description:
        'Define autorización, validación cliente y límites de no escritura hacia activos.',
      requiredFields: [
        'readonlyApproval',
        'clientValidationRequired',
        'sourceOfTruthLabel',
      ],
    },
    {
      id: 'review',
      title: 'Revisión Final',
      shortTitle: 'Revisión',
      description:
        'Resume completitud, brechas y preparación conceptual antes de crear perfil draft.',
      requiredFields: [],
    },
  ];

export const createPvMetricsPlantConfiguratorDraft =
  (): PVMetricsPlantConfiguratorDraft => ({
    id: 'plant-config-draft-local',

    workspaceName: 'Workspace Cliente FV + BESS',
    ownerName: 'Nuevo Cliente',
    country: 'Chile',
    region: 'Por definir',
    contactLabel: 'Pendiente',

    plantName: '',
    plantCode: '',
    technology: 'pv-bess',

    commune: '',
    timezone: 'America/Santiago',
    latitude: null,
    longitude: null,

    pvCapacityDcMwp: 0,
    pvCapacityAcMw: 0,
    mountingType: 'unknown',

    inverterCount: null,
    inverterModel: '',
    meterModel: '',
    scadaVendor: '',
    dataLoggerVendor: '',
    weatherStationModel: '',

    hasBess: true,
    bessPowerMw: null,
    bessEnergyMwh: null,
    bessOperationMode: 'unknown',
    bessEmsVendor: '',

    hasHistoricalCsv: 'unknown',
    hasExcelWorkbook: 'unknown',
    hasClientApi: 'unknown',
    hasScadaReadonly: 'unknown',
    hasEnergyMeter: 'unknown',
    hasWeatherStation: 'unknown',
    hasBessEms: 'unknown',

    hasBessEmsSource: 'unknown',
    hasBessBmsSource: 'unknown',
    hasBessPcsSource: 'unknown',
    hasBessScadaReadonly: 'unknown',
    hasBessDedicatedMeter: 'unknown',
    hasPoiMeter: 'unknown',

    bessTelemetrySourceLabel: 'Pendiente de EMS/BMS/PCS BESS',
    bessMeasurementSourceLabel: 'Pendiente de medidor BESS o POI',

    readonlyApproval: 'not-requested',
    clientValidationRequired: true,
    sourceOfTruthLabel: 'Pendiente de ficha técnica del cliente',

    notes:
      'Borrador local para configurar una nueva planta FV + BESS. No representa información oficial ni conexión real.',
  });
