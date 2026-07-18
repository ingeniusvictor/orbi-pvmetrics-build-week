import {
  PVMetricsDataSource,
  PVMetricsDataSourceManagerDataset,
} from '../types/pvmetrics-data-source.types';

const calculateAverageReadiness = (sources: PVMetricsDataSource[]) => {
  if (!sources.length) return 0;
  const total = sources.reduce((sum, source) => sum + source.readinessPct, 0);
  return Math.round(total / sources.length);
};

export const createPvMetricsDataSourcesDemo = (): PVMetricsDataSourceManagerDataset => {
  const sources: PVMetricsDataSource[] = [
    {
      id: 'demo-local',
      name: 'Demo local ORBI',
      type: 'demo-local',
      status: 'active-demo',
      securityMode: 'local-demo',
      refreshMode: 'near-real-time',
      description:
        'Generador local de señales sintéticas para preventa, QA y demostraciones ejecutivas.',
      expectedSignals: [
        'Producción esperada',
        'Producción real simulada',
        'Irradiancia GHI',
        'PR horario',
        'SOC BESS',
      ],
      lastSyncLabel: 'Activo ahora',
      ownerLabel: 'ORBI Sandbox',
      readinessPct: 100,
      notes: 'Fuente principal actual. No requiere conexión externa.',
    },
    {
      id: 'csv-historical',
      name: 'CSV histórico de planta',
      type: 'csv-historical',
      status: 'available',
      securityMode: 'sandbox',
      refreshMode: 'manual',
      description:
        'Preparado para importar históricos de producción, irradiancia, temperatura y energía.',
      expectedSignals: [
        'Timestamp',
        'Potencia AC',
        'Energía acumulada',
        'Irradiancia',
        'Temperatura módulo',
      ],
      lastSyncLabel: 'Pendiente de archivo',
      ownerLabel: 'Operaciones / Cliente',
      readinessPct: 70,
      notes: 'Importación real se implementará en módulo futuro.',
    },
    {
      id: 'excel-workbook',
      name: 'Excel de performance',
      type: 'excel-workbook',
      status: 'pending',
      securityMode: 'sandbox',
      refreshMode: 'manual',
      description:
        'Fuente preparada para planillas de cálculo técnico o reportes de performance FV.',
      expectedSignals: [
        'Energía diaria',
        'Disponibilidad',
        'Pérdidas',
        'PR diario',
      ],
      lastSyncLabel: 'No conectado',
      ownerLabel: 'Ingeniería',
      readinessPct: 55,
      notes: 'Pendiente definir plantilla estándar.',
    },
    {
      id: 'client-api',
      name: 'API cliente',
      type: 'client-api',
      status: 'not-authorized',
      securityMode: 'not-connected',
      refreshMode: 'scheduled',
      description:
        'Canal futuro para consulta read-only de señales desde sistemas del cliente.',
      expectedSignals: [
        'Potencia activa',
        'Energía',
        'Estado de inversores',
        'Alarmas',
      ],
      lastSyncLabel: 'Sin autorización',
      ownerLabel: 'Cliente / TI',
      readinessPct: 35,
      notes: 'Requiere credenciales, contrato de datos y entorno seguro.',
    },
    {
      id: 'scada-readonly',
      name: 'SCADA read-only',
      type: 'scada-readonly',
      status: 'simulated',
      securityMode: 'read-only',
      refreshMode: 'near-real-time',
      description:
        'Preparación conceptual para lectura SCADA sin escritura ni telecontrol.',
      expectedSignals: [
        'Potencia SCADA real',
        'Estado comunicación',
        'Calidad enlace',
        'Alarmas SCADA',
        'Timestamp de señal',
      ],
      lastSyncLabel: 'Simulado',
      ownerLabel: 'SCADA / OT',
      readinessPct: 60,
      notes: 'Solo lectura. No habilitar comandos de control.',
    },
    {
      id: 'data-logger',
      name: 'Data logger de planta',
      type: 'data-logger',
      status: 'pending',
      securityMode: 'not-connected',
      refreshMode: 'scheduled',
      description:
        'Fuente futura para concentrar señales de campo desde registradores industriales.',
      expectedSignals: [
        'Irradiancia',
        'Temperatura ambiente',
        'Temperatura módulo',
        'Viento',
      ],
      lastSyncLabel: 'Pendiente',
      ownerLabel: 'Campo FV',
      readinessPct: 45,
      notes: 'Requiere definición de protocolo y formato de exportación.',
    },
    {
      id: 'energy-meter',
      name: 'Medidor de energía',
      type: 'energy-meter',
      status: 'pending',
      securityMode: 'read-only',
      refreshMode: 'near-real-time',
      description:
        'Preparación para señales de medidores como energía activa, potencia y calidad eléctrica.',
      expectedSignals: [
        'Potencia activa',
        'Energía activa',
        'Tensión',
        'Corriente',
        'Frecuencia',
      ],
      lastSyncLabel: 'Pendiente',
      ownerLabel: 'Medición',
      readinessPct: 50,
      notes: 'Lectura read-only futura. Sin escritura de parámetros.',
    },
    {
      id: 'weather-station',
      name: 'Estación meteorológica',
      type: 'weather-station',
      status: 'simulated',
      securityMode: 'sandbox',
      refreshMode: 'near-real-time',
      description:
        'Fuente meteorológica para irradiancia, temperatura, viento y variables ambientales.',
      expectedSignals: [
        'GHI',
        'POA',
        'Temperatura ambiente',
        'Viento',
        'Humedad',
      ],
      lastSyncLabel: 'Simulado',
      ownerLabel: 'Meteo',
      readinessPct: 75,
      notes: 'Actualmente representada mediante curvas demo de alta fidelidad.',
    },
    {
      id: 'bess-ems',
      name: 'EMS BESS',
      type: 'bess-ems',
      status: 'simulated',
      securityMode: 'read-only',
      refreshMode: 'near-real-time',
      description:
        'Preparación para lectura futura del Energy Management System del BESS.',
      expectedSignals: [
        'SOC',
        'Potencia BESS',
        'Modo BESS',
        'RTE',
        'Estado de batería',
      ],
      lastSyncLabel: 'Simulado',
      ownerLabel: 'BESS / EMS',
      readinessPct: 65,
      notes: 'Solo lectura. Sin setpoints ni comandos de despacho.',
    },
    {
      id: 'source-bess-ems-demo',
      name: 'EMS BESS Demo',
      type: 'bess-ems',
      status: 'simulated',
      securityMode: 'read-only',
      refreshMode: 'near-real-time',
      description:
        'Fuente conceptual EMS BESS para SOC, modo operativo, potencia de carga/descarga y estado de almacenamiento.',
      expectedSignals: [
        'bess-soc',
        'bess-power',
        'bess-mode',
        'bess-available-energy',
        'bess-alarms',
      ],
      lastSyncLabel: 'Simulado',
      ownerLabel: 'BESS / EMS',
      readinessPct: 80,
      notes: 'Solo lectura. Sin setpoints ni comandos de despacho.',
    },
    {
      id: 'source-bess-meter-demo',
      name: 'Medidor BESS Demo',
      type: 'bess-meter',
      status: 'simulated',
      securityMode: 'read-only',
      refreshMode: 'near-real-time',
      description:
        'Fuente conceptual de medición BESS para validar potencia y energía cargada/descargada.',
      expectedSignals: [
        'bess-meter-power',
        'bess-import-energy',
        'bess-export-energy',
      ],
      lastSyncLabel: 'Simulado',
      ownerLabel: 'Medición',
      readinessPct: 85,
      notes: 'Permite contrastar EMS/PCS contra medición real.',
    },
    {
      id: 'source-poi-meter-demo',
      name: 'Medidor POI Demo',
      type: 'poi-meter',
      status: 'simulated',
      securityMode: 'read-only',
      refreshMode: 'near-real-time',
      description:
        'Medidor conceptual de punto de interconexión para contraste entre planta, BESS y red.',
      expectedSignals: [
        'poi-active-power',
        'poi-import-energy',
        'poi-export-energy',
      ],
      lastSyncLabel: 'Simulado',
      ownerLabel: 'Medición POI',
      readinessPct: 90,
      notes: 'Punto de entrega en frontera.',
    },
  ];

  const summary = {
    totalSources: sources.length,
    activeDemoSources: sources.filter((source) => source.status === 'active-demo').length,
    readOnlyReadySources: sources.filter((source) => source.securityMode === 'read-only').length,
    pendingSources: sources.filter((source) => source.status === 'pending').length,
    notAuthorizedSources: sources.filter((source) => source.status === 'not-authorized').length,
    averageReadinessPct: calculateAverageReadiness(sources),
  };

  return {
    summary,
    sources,
  };
};
