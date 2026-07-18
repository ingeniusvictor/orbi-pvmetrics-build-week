import {
  PVMetricsPlantProfileDataset,
  PVMetricsPlantTechnicalProfile,
} from '../types/pvmetrics-plant-profile.types';

export const createPvMetricsPlantProfilesDemo =
  (): PVMetricsPlantProfileDataset => {
    const owners = [
      {
        id: 'owner-demo-orbi-solar-demo',
        ownerName: 'ORBI Solar Demo',
        workspaceName: 'Workspace ORBI Solar Demo',
        country: 'Chile',
        region: 'Demo',
        contactLabel: 'Preset demo editable',
        isDemoWorkspace: true,
      },
      {
        id: 'owner-demo-client-pvbess',
        ownerName: 'Cliente Solar + BESS Demo',
        workspaceName: 'Workspace Cliente FV + BESS',
        country: 'Chile',
        region: 'Demo',
        contactLabel: 'Nuevo cliente demo',
        isDemoWorkspace: true,
      },
    ];

    const plants: PVMetricsPlantTechnicalProfile[] = [
      {
        id: 'plant-aes-demo-01',
        ownerId: 'owner-demo-orbi-solar-demo',
        plantName: 'Planta FV Demo AES 01',
        plantCode: 'AES-DEMO-01',
        technology: 'pv-bess',
        country: 'Chile',
        region: 'Demo',
        commune: 'No validada',
        timezone: 'America/Santiago',
        latitude: null,
        longitude: null,

        pvCapacityDcMwp: 6.5,
        pvCapacityAcMw: 6.0,
        mountingType: 'single-axis-tracker',

        inverterCount: null,
        inverterModel: 'No validado',
        meterModel: 'No validado',
        scadaVendor: 'No validado',
        dataLoggerVendor: 'No validado',
        weatherStationModel: 'No validado',

        hasBess: true,
        bessPowerMw: 2.0,
        bessEnergyMwh: 4.0,
        bessOperationMode: 'energy-shifting',
        bessEmsVendor: 'No validado',
        bessPrimaryTelemetrySourceId: 'source-bess-ems-demo',
        bessPrimaryMeasurementSourceId: 'source-bess-meter-demo',
        bessDataSources: [
          {
            id: 'source-bess-ems-demo',
            sourceType: 'bess-ems',
            sourceName: 'EMS BESS Demo',
            vendorLabel: 'EMS Vendor S.A.',
            status: 'demo',
            isReadOnly: true,
            isPrimaryTelemetrySource: true,
            isPrimaryMeasurementSource: false,
            expectedSignals: [
              'bess-soc',
              'bess-power',
              'bess-mode',
              'bess-available-energy',
              'bess-alarms',
            ],
            sourceOfTruthLabel: 'Demo local ORBI',
            notes: 'Muestra telemetría operativa simulada.'
          },
          {
            id: 'source-bess-meter-demo',
            sourceType: 'bess-meter',
            sourceName: 'Medidor BESS Demo',
            vendorLabel: 'Meter Vendor S.A.',
            status: 'demo',
            isReadOnly: true,
            isPrimaryTelemetrySource: false,
            isPrimaryMeasurementSource: true,
            expectedSignals: [
              'bess-meter-power',
              'bess-import-energy',
              'bess-export-energy',
            ],
            sourceOfTruthLabel: 'Medidor dedicado BESS',
            notes: 'Muestra mediciones de realidad física del BESS.'
          },
          {
            id: 'source-poi-meter-demo',
            sourceType: 'poi-meter',
            sourceName: 'Medidor POI Demo',
            vendorLabel: 'POI Meter Vendor',
            status: 'demo',
            isReadOnly: true,
            isPrimaryTelemetrySource: false,
            isPrimaryMeasurementSource: false,
            expectedSignals: [
              'poi-active-power',
              'poi-import-energy',
              'poi-export-energy',
            ],
            sourceOfTruthLabel: 'Punto de Interconexión',
            notes: 'Punto de entrega en frontera.'
          }
        ],

        sourceType: 'demo',
        validationStatus: 'demo-only',
        sourceOfTruthLabel: 'Demo local ORBI — no validado por cliente',
        validatedBy: null,
        lastValidatedAt: null,

        notes:
          'Perfil demo editable. No representa información oficial ni conexión real con ORBI Solar Demo.',
      },
      {
        id: 'plant-client-demo-pvbess-01',
        ownerId: 'owner-demo-client-pvbess',
        plantName: 'Nuevo Parque Solar + BESS Demo',
        plantCode: 'CLIENT-PVBESS-DEMO-01',
        technology: 'pv-bess',
        country: 'Chile',
        region: 'Por definir',
        commune: 'Por definir',
        timezone: 'America/Santiago',
        latitude: null,
        longitude: null,

        pvCapacityDcMwp: 0,
        pvCapacityAcMw: 0,
        mountingType: 'unknown',

        inverterCount: null,
        inverterModel: 'Pendiente',
        meterModel: 'Pendiente',
        scadaVendor: 'Pendiente',
        dataLoggerVendor: 'Pendiente',
        weatherStationModel: 'Pendiente',

        hasBess: true,
        bessPowerMw: null,
        bessEnergyMwh: null,
        bessOperationMode: 'unknown',
        bessEmsVendor: 'Pendiente',

        sourceType: 'manual-entry',
        validationStatus: 'draft',
        sourceOfTruthLabel: 'Pendiente de ficha técnica del cliente',
        validatedBy: null,
        lastValidatedAt: null,

        notes:
          'Perfil base para configurar una nueva planta adquirida por cliente. Requiere ficha técnica, ubicación, capacidad FV, datos BESS y fuentes disponibles.',
      },
    ];

    return {
      owners,
      plants,
    };
  };
