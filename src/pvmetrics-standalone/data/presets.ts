import { Company, ClientInfoItem, SCADARegister } from '../types';

export const DISCLAIMER_AES_CHILE = 'Preset de demostración. No contiene datos reales de ORBI Solar Demo.';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'orbi-solar-demo',
    name: 'ORBI Solar Demo Company',
    industry: 'Energy Production & Utilities',
    plants: [
      {
        id: 'andes-solar-ii',
        name: 'Helios Sur Hybrid + BESS',
        type: 'hybrid',
        region: 'Antofagasta, Atacama Desert',
        status: 'active',
        pv: {
          capacityMW: 180,
          panelType: 'Bifacial Mono-Si (540Wp)',
          inverterCount: 48,
          trackerType: 'Single-Axis',
          tiltDegrees: 0,
          azimuthDegrees: 180,
        },
        bess: {
          capacityMW: 112,
          capacityMWh: 560, // 5-hour duration
          roundTripEfficiency: 88.5,
          maxChargeRateMW: 112,
          maxDischargeRateMW: 112,
          minSocPercent: 5,
          maxSocPercent: 95,
          degradationRatePercentPerYear: 1.1,
          currentSocPercent: 42,
        },
        scada: {
          protocol: 'IEC 104',
          ipAddress: '192.0.2.81',
          port: 2404,
          scanRateSeconds: 1,
          reconnectDelaySeconds: 5,
          registerMappingVerified: true,
        },
      },
      {
        id: 'alfalfa-solar',
        name: 'Lumen Valley Solar',
        type: 'solar',
        region: 'Metropolitana, Chile',
        status: 'active',
        pv: {
          capacityMW: 45,
          panelType: 'Mono-PERC (450Wp)',
          inverterCount: 12,
          trackerType: 'Fixed',
          tiltDegrees: 28,
          azimuthDegrees: 0,
        },
        bess: {
          capacityMW: 0,
          capacityMWh: 0,
          roundTripEfficiency: 0,
          maxChargeRateMW: 0,
          maxDischargeRateMW: 0,
          minSocPercent: 0,
          maxSocPercent: 0,
          degradationRatePercentPerYear: 0,
        },
        scada: {
          protocol: 'Modbus TCP',
          ipAddress: '192.0.2.12',
          port: 502,
          scanRateSeconds: 2,
          reconnectDelaySeconds: 10,
          registerMappingVerified: true,
        },
      },
    ],
  },
  {
    id: 'pacific-solar',
    name: 'Nova Pacific Energy Demo',
    industry: 'Independent Power Producer (IPP)',
    plants: [
      {
        id: 'copiapo-hybrid',
        name: 'Atacama Nexus Hybrid',
        type: 'hybrid',
        region: 'Copiapó, Atacama',
        status: 'active',
        pv: {
          capacityMW: 90,
          panelType: 'Bifacial Tracker',
          inverterCount: 24,
          trackerType: 'Single-Axis',
          tiltDegrees: 0,
          azimuthDegrees: 180,
        },
        bess: {
          capacityMW: 40,
          capacityMWh: 160, // 4-hour duration
          roundTripEfficiency: 87.0,
          maxChargeRateMW: 40,
          maxDischargeRateMW: 40,
          minSocPercent: 10,
          maxSocPercent: 90,
          degradationRatePercentPerYear: 1.3,
          currentSocPercent: 15,
        },
        scada: {
          protocol: 'OPC UA',
          ipAddress: '198.51.100.15',
          port: 4840,
          scanRateSeconds: 1,
          reconnectDelaySeconds: 5,
          registerMappingVerified: false,
        },
      },
      {
        id: 'coquimbo-bess',
        name: 'Pacífico Storage Hub',
        type: 'bess',
        region: 'Coquimbo, Chile',
        status: 'maintenance',
        pv: {
          capacityMW: 0,
          panelType: 'None',
          inverterCount: 0,
          trackerType: 'Fixed',
          tiltDegrees: 0,
          azimuthDegrees: 0,
        },
        bess: {
          capacityMW: 50,
          capacityMWh: 200,
          roundTripEfficiency: 89.0,
          maxChargeRateMW: 50,
          maxDischargeRateMW: 50,
          minSocPercent: 3,
          maxSocPercent: 98,
          degradationRatePercentPerYear: 0.9,
          currentSocPercent: 88,
        },
        scada: {
          protocol: 'DNP3',
          ipAddress: '203.0.113.4',
          port: 20000,
          scanRateSeconds: 5,
          reconnectDelaySeconds: 15,
          registerMappingVerified: true,
        },
      },
    ],
  },
];

export const DEFAULT_CLIENT_INFO_CHECKLIST: ClientInfoItem[] = [
  { id: 'cli-01', label: 'Capacidad nominal de Inyección (Punto de Conexión)', checked: true, category: 'technical', notes: 'Verificado. Límite físico en subestación coincide con PV.' },
  { id: 'cli-02', label: 'Modelo matemático de degradación de baterías (BESS)', checked: true, category: 'technical', notes: 'Basado en ciclos diarios (LFP standard).' },
  { id: 'cli-03', label: 'Protocolo SCADA definido (Modbus/IEC 104/DNP3)', checked: true, category: 'technical', notes: 'Helios Sur Hybrid usa IEC 104 nativo.' },
  { id: 'cli-04', label: 'Tarifa horaria o bloque comercial del Coordinador Eléctrico', checked: true, category: 'commercial', notes: 'Regulado por bloques de costo marginal del CEN.' },
  { id: 'cli-05', label: 'Multas o cargos por desvíos de pronóstico', checked: false, category: 'commercial', notes: 'Pendiente confirmar si aplica compensación por sobre-inyección.' },
  { id: 'cli-06', label: 'Curva de precios de energía del nodo de inyección', checked: true, category: 'commercial', notes: 'Sincronizado con nodo 220kV de Antofagasta.' },
  { id: 'cli-07', label: 'Acceso a la API de datos de radiación GHI/DNI de la estación meteorológica', checked: false, category: 'technical', notes: 'Necesitamos telemetría directa de los piranómetros.' },
  { id: 'cli-08', label: 'Procedimiento de parada de emergencia y control manual de BESS', checked: true, category: 'operational', notes: 'EMS local tiene override físico de seguridad.' },
  { id: 'cli-09', label: 'Disponibilidad de enlaces de telecomunicaciones VPN seguros', checked: false, category: 'operational', notes: 'Requiere túnel IPsec IPSec con el Gateway de ORBI.' },
];

export const DEFAULT_SCADA_REGISTERS: SCADARegister[] = [
  { address: 30001, name: 'PV_ACTIVE_POWER_MW', type: 'Input', dataType: 'Float32', value: 124.5, status: 'valid' },
  { address: 30003, name: 'PV_IRRADIANCE_WM2', type: 'Input', dataType: 'Float32', value: 875.2, status: 'valid' },
  { address: 30005, name: 'BESS_SOC_PERCENT', type: 'Input', dataType: 'Float32', value: 42.0, status: 'valid' },
  { address: 30007, name: 'BESS_ACTIVE_POWER_MW', type: 'Input', dataType: 'Float32', value: -15.4, status: 'valid' }, // Negative = Charging
  { address: 30009, name: 'BESS_TEMPERATURE_C', type: 'Input', dataType: 'Float32', value: 24.8, status: 'valid' },
  { address: 30011, name: 'GRID_FREQ_HZ', type: 'Input', dataType: 'Float32', value: 50.02, status: 'valid' },
  { address: 40001, name: 'BESS_CHARGE_LIMIT_MW', type: 'Holding', dataType: 'Float32', value: 112.0, status: 'valid' },
  { address: 40003, name: 'BESS_DISCHARGE_LIMIT_MW', type: 'Holding', dataType: 'Float32', value: 112.0, status: 'valid' },
  { address: 40005, name: 'BESS_CONTROL_MODE', type: 'Holding', dataType: 'Uint16', value: 1, status: 'valid' }, // 1 = Remote/Advisor, 2 = Manual, 3 = Local Peak Shaving
  { address: 10001, name: 'HEARTBEAT_OK', type: 'Discrete Input', dataType: 'Boolean', value: true, status: 'valid' },
  { address: 10002, name: 'COMMS_FAULT', type: 'Discrete Input', dataType: 'Boolean', value: false, status: 'valid' },
  { address: 1,     name: 'EMS_REMOTE_ENABLE', type: 'Coil', dataType: 'Boolean', value: true, status: 'valid' },
  { address: 2,     name: 'GRID_BREAKER_CLOSE', type: 'Coil', dataType: 'Boolean', value: true, status: 'valid' },
];
