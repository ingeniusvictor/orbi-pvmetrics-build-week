import { 
  PVMetricsLiveMonitoringDataset, 
  PVMetricsDataMode, 
  PVMetricsTimePoint, 
  PVMetricsKpiSnapshot, 
  PVMetricsBessMode, 
  PVMetricsScadaStatus,
  PVMetricsTrendRange,
  PVMetricsTrendPoint,
  PVMetricsBessTelemetryRealitySnapshot,
  PVMetricsLiveDataSourceBadge,
  PVMetricsLiveDataProvenance,
  PVMetricsLiveDataTrustLevel
} from '../types/pvmetrics-live-monitoring.types';

export type CreatePvMetricsLiveDemoDataOptions = {
  now?: Date;
  timezone?: string;
  plantCapacityMw?: number;
  mode?: PVMetricsDataMode;
  environmentDataMode?: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available';
  operationalDataMode?: 'demo' | 'scada-readonly' | 'not-available';
  bessDataMode?: 'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available';
};

const getLocalHourDecimal = (date: Date, timezone: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

  return hour + minute / 60;
};

const getLocalTimeLabel = (date: Date, timezone: string) =>
  new Intl.DateTimeFormat('es-CL', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

const DEMO_SUNRISE_HOUR = 7.7;
const DEMO_SUNSET_HOUR = 18.0;

const isSolarWindow = (hour: number) =>
  hour >= DEMO_SUNRISE_HOUR && hour <= DEMO_SUNSET_HOUR;

const calculateIrradianceByHour = (hour: number) => {
  if (!isSolarWindow(hour)) return 0;

  const solarProgress =
    (hour - DEMO_SUNRISE_HOUR) / (DEMO_SUNSET_HOUR - DEMO_SUNRISE_HOUR);

  const bellCurve = Math.sin(Math.PI * solarProgress);

  const cloudNoise =
    0.94 + 0.06 * Math.sin(hour * 1.7) + 0.03 * Math.cos(hour * 2.9);

  return Math.max(0, Math.round(980 * bellCurve * cloudNoise));
};

const calculateAmbientTempByHour = (hour: number) => {
  const baseAmbient = 14 + Math.sin(((hour - 8) / 24) * 2 * Math.PI) * 7;
  return Math.round((baseAmbient + Math.sin(hour * 3) * 0.4) * 10) / 10;
};

const calculateModuleTempByHour = (
  hour: number,
  ambientTempC: number,
  irradianceWm2: number,
) => {
  return irradianceWm2 > 0
    ? Math.round((ambientTempC + (irradianceWm2 * 0.038) + Math.cos(hour * 4) * 0.6) * 10) / 10
    : ambientTempC;
};

const calculateExpectedPowerMw = (
  irradianceWm2: number,
  plantCapacityMw: number,
  moduleTempC: number,
) => {
  if (irradianceWm2 <= 0) return 0;

  const deratingFactor = 0.92;
  const tempCorrection = Math.max(0.78, 1 - Math.max(0, moduleTempC - 25) * 0.004);

  return Number(
    Math.min(
      plantCapacityMw,
      plantCapacityMw * (irradianceWm2 / 1000) * deratingFactor * tempCorrection,
    ).toFixed(2),
  );
};

const calculateActualPowerMw = (
  expectedPowerMw: number,
  hour: number,
) => {
  if (expectedPowerMw <= 0) return 0;

  const performanceFactor = 0.91 + 0.04 * Math.sin(hour * 0.8);

  return Number(Math.max(0, expectedPowerMw * performanceFactor).toFixed(2));
};

const calculateBessSocAndPower = (hour: number) => {
  let bessSocPct = 40;
  let bessPowerMw = 0; // Positive = charging, negative = discharging
  
  if (hour >= 0 && hour < 5) {
    // Midnight / early morning discharge
    bessPowerMw = -1.0; // -1.0 MW discharge
    bessSocPct = Math.max(15, Math.round(40 - (hour * 5)));
  } else if (hour >= 5 && hour < 8) {
    // Early morning standby
    bessPowerMw = 0;
    bessSocPct = 15;
  } else if (hour >= 8 && hour < 15) {
    // Day charging (solar availability)
    bessPowerMw = 1.2; // +1.2 MW charge
    bessSocPct = Math.min(90, Math.round(15 + (hour - 7) * 9.5));
  } else if (hour >= 15 && hour < 18) {
    // Standby at full SOC
    bessPowerMw = 0;
    bessSocPct = 90;
  } else if (hour >= 18 && hour < 22) {
    // Evening peak discharge
    bessPowerMw = -1.5; // -1.5 MW discharge
    bessSocPct = Math.max(40, Math.round(90 - (hour - 17) * 12.5));
  } else {
    // Night standby
    bessPowerMw = 0;
    bessSocPct = 40;
  }
  
  return { bessSocPct, bessPowerMw };
};

const calculateBessTelemetryRealitySnapshot = ({
  emsPowerMw,
  measuredPowerMw,
  emsSocPct,
  measuredEnergyCapacityMwh,
  energyChargedTodayMwh,
  measuredEnergyChargedTodayMwh,
  energyDischargedTodayMwh,
  measuredEnergyDischargedTodayMwh,
  sourceTelemetryLabel,
  sourceMeasurementLabel,
}: {
  emsPowerMw: number;
  measuredPowerMw: number;
  emsSocPct: number;
  measuredEnergyCapacityMwh: number;
  energyChargedTodayMwh: number;
  measuredEnergyChargedTodayMwh: number;
  energyDischargedTodayMwh: number;
  measuredEnergyDischargedTodayMwh: number;
  sourceTelemetryLabel: string;
  sourceMeasurementLabel: string;
}): PVMetricsBessTelemetryRealitySnapshot => {
  const powerDeltaMw = Number((emsPowerMw - measuredPowerMw).toFixed(2));

  const powerDeltaPct =
    Math.abs(emsPowerMw) > 0.1
      ? Number((Math.abs(powerDeltaMw) / Math.abs(emsPowerMw) * 100).toFixed(1))
      : 0;

  const chargedEnergyDeltaMwh = Number(
    (energyChargedTodayMwh - measuredEnergyChargedTodayMwh).toFixed(2),
  );

  const dischargedEnergyDeltaMwh = Number(
    (energyDischargedTodayMwh - measuredEnergyDischargedTodayMwh).toFixed(2),
  );

  const telemetryConfidence =
    powerDeltaPct <= 3
      ? 'high'
      : powerDeltaPct <= 8
        ? 'medium'
        : 'low';

  return {
    emsPowerMw,
    measuredPowerMw,
    powerDeltaMw,
    powerDeltaPct,

    emsSocPct,
    calculatedSocPct: null,
    socDeltaPct: null,

    emsEnergyChargedMwh: energyChargedTodayMwh,
    measuredEnergyChargedMwh: measuredEnergyChargedTodayMwh,
    chargedEnergyDeltaMwh,

    emsEnergyDischargedMwh: energyDischargedTodayMwh,
    measuredEnergyDischargedMwh: measuredEnergyDischargedTodayMwh,
    dischargedEnergyDeltaMwh,

    telemetryConfidence,
    statusLabel:
      telemetryConfidence === 'high'
        ? 'Telemetría BESS consistente con medición'
        : telemetryConfidence === 'medium'
          ? 'Diferencia moderada entre EMS y medición'
          : 'Diferencia alta: revisar fuente BESS',
    sourceTelemetryLabel,
    sourceMeasurementLabel,
  };
};

const createLiveDataSourceBadges = ({
  environmentDataMode,
  operationalDataMode,
  bessDataMode,
}: {
  environmentDataMode: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available';
  operationalDataMode: 'demo' | 'scada-readonly' | 'not-available';
  bessDataMode: 'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available';
}): PVMetricsLiveDataSourceBadge[] => {
  const badges: PVMetricsLiveDataSourceBadge[] = [];

  if (environmentDataMode === 'external-telemetry') {
    badges.push({
      id: 'environment-external-telemetry',
      label: 'AMBIENTAL REAL POR UBICACIÓN',
      provenance: 'external-environment-telemetry',
      trustLevel: 'external-real',
      isReadOnly: true,
      sourceDescription:
        'Datos ambientales obtenidos o estimados desde fuente externa por ubicación de planta.',
      safetyNote:
        'No corresponde necesariamente a medición on-site de piranómetro o estación propia de planta.',
    });
  }

  if (environmentDataMode === 'onsite-weather') {
    badges.push({
      id: 'environment-onsite-weather',
      label: 'METEO ON-SITE READ-ONLY',
      provenance: 'onsite-weather-station',
      trustLevel: 'onsite-real',
      isReadOnly: true,
      sourceDescription:
        'Datos meteorológicos provenientes de estación o sensores on-site autorizados en modo solo lectura.',
      safetyNote:
        'Lectura ambiental sin comandos ni escritura hacia equipos.',
    });
  }

  if (environmentDataMode === 'demo') {
    badges.push({
      id: 'environment-demo',
      label: 'AMBIENTAL DEMO LOCAL',
      provenance: 'orbi-demo-simulation',
      trustLevel: 'demo',
      isReadOnly: true,
      sourceDescription:
        'Datos ambientales generados localmente para demostración cuando no existe fuente real disponible.',
      safetyNote:
        'No utilizar como medición real de planta.',
    });
  }

  if (operationalDataMode === 'scada-readonly') {
    badges.push({
      id: 'plant-scada-readonly',
      label: 'OPERACIÓN PLANTA READ-ONLY',
      provenance: 'plant-scada-readonly',
      trustLevel: 'validated-real',
      isReadOnly: true,
      sourceDescription:
        'Datos operacionales de planta provenientes de SCADA/medición autorizada en modo solo lectura.',
      safetyNote:
        'Sin setpoints, sin comandos y sin telecontrol.',
    });
  }

  if (operationalDataMode === 'demo') {
    badges.push({
      id: 'plant-operational-demo',
      label: 'OPERACIÓN PLANTA DEMO',
      provenance: 'orbi-demo-simulation',
      trustLevel: 'demo',
      isReadOnly: true,
      sourceDescription:
        'Producción FV, SCADA, inversores y disponibilidad en simulación local.',
      safetyNote:
        'No representa operación real de planta conectada.',
    });
  }

  if (bessDataMode === 'ems-readonly') {
    badges.push({
      id: 'bess-ems-readonly',
      label: 'BESS EMS READ-ONLY',
      provenance: 'bess-ems-readonly',
      trustLevel: 'validated-real',
      isReadOnly: true,
      sourceDescription:
        'Telemetría BESS desde EMS/BMS/PCS autorizada en modo solo lectura.',
      safetyNote:
        'Sin control BESS, sin setpoints, sin carga/descarga remota.',
    });
  }

  if (bessDataMode === 'meter-readonly') {
    badges.push({
      id: 'bess-meter-readonly',
      label: 'BESS MEDICIÓN READ-ONLY',
      provenance: 'bess-meter-readonly',
      trustLevel: 'validated-real',
      isReadOnly: true,
      sourceDescription:
        'Medición física BESS desde medidor dedicado o POI autorizado.',
      safetyNote:
        'Lectura pasiva para contraste de telemetría vs medición.',
    });
  }

  if (bessDataMode === 'demo') {
    badges.push({
      id: 'bess-demo',
      label: 'BESS DEMO LOCAL',
      provenance: 'orbi-demo-simulation',
      trustLevel: 'demo',
      isReadOnly: true,
      sourceDescription:
        'SOC, potencia BESS y energía cargada/descargada generados localmente.',
      safetyNote:
        'No representa un BESS real conectado.',
    });
  }

  return badges;
};

export function createPvMetricsLiveDemoData(
  optionsOrMode: PVMetricsDataMode | CreatePvMetricsLiveDemoDataOptions = 'demo'
): PVMetricsLiveMonitoringDataset {
  let mode: PVMetricsDataMode = 'demo';
  let now = new Date();
  let timezone = 'America/Santiago';
  let plantCapacityMw = 6.0;
  let environmentDataMode: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available' = 'external-telemetry';
  let operationalDataMode: 'demo' | 'scada-readonly' | 'not-available' = 'demo';
  let bessDataMode: 'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available' = 'demo';

  if (typeof optionsOrMode === 'string') {
    mode = optionsOrMode;
  } else if (optionsOrMode && typeof optionsOrMode === 'object') {
    mode = optionsOrMode.mode ?? 'demo';
    now = optionsOrMode.now ?? new Date();
    timezone = optionsOrMode.timezone ?? 'America/Santiago';
    plantCapacityMw = optionsOrMode.plantCapacityMw ?? 6.0;
    environmentDataMode = optionsOrMode.environmentDataMode ?? 'external-telemetry';
    operationalDataMode = optionsOrMode.operationalDataMode ?? 'demo';
    bessDataMode = optionsOrMode.bessDataMode ?? 'demo';
  }

  const currentHour = getLocalHourDecimal(now, timezone);
  const timeSeries: PVMetricsTimePoint[] = [];
  
  // Daily values initialization
  let totalPVGenMWh = 0;
  let totalExpectedPVGenMWh = 0;
  let maxActualPowerMw = 0;
  let peakPowerTime = '12:00';
  
  // Construct 24 hours of data
  for (let h = 0; h < 24; h++) {
    const timeLabel = h < 10 ? `0${h}:00` : `${h}:00`;
    
    // Check if this point hour h is in the future
    const isFuturePoint = h > currentHour;
    const isNightPoint = !isSolarWindow(h);

    const irradianceWm2 = calculateIrradianceByHour(h);
    const ambientTempC = calculateAmbientTempByHour(h);
    const moduleTempC = calculateModuleTempByHour(h, ambientTempC, irradianceWm2);

    const expectedPowerMw = calculateExpectedPowerMw(irradianceWm2, plantCapacityMw, moduleTempC);
    
    let actualPowerMw: number | null = null;
    let telemetryPowerMw: number | null = null;
    let scadaPowerMw: number | null = null;
    let prPct: number | null = null;

    if (!isFuturePoint) {
      actualPowerMw = calculateActualPowerMw(expectedPowerMw, h);
      
      if (actualPowerMw > 0) {
        const telNoise = Math.sin(h * 4) * 0.08 + Math.cos(h * 2) * 0.04;
        telemetryPowerMw = Math.max(0, Math.round((actualPowerMw + telNoise) * 100) / 100);
        
        const scadaNoise = Math.cos(h * 3) * 0.03;
        scadaPowerMw = Math.max(0, Math.round((actualPowerMw + scadaNoise) * 100) / 100);
      } else {
        telemetryPowerMw = 0;
        scadaPowerMw = 0;
      }

      prPct = expectedPowerMw > 0.2 
        ? Math.min(100, Math.round((actualPowerMw / expectedPowerMw) * 100)) 
        : 0;

      // Accumulate daily metrics
      totalPVGenMWh += actualPowerMw;
      totalExpectedPVGenMWh += expectedPowerMw;
      if (actualPowerMw > maxActualPowerMw) {
        maxActualPowerMw = actualPowerMw;
        peakPowerTime = timeLabel;
      }
    }
    
    const { bessSocPct, bessPowerMw } = calculateBessSocAndPower(h);
    
    timeSeries.push({
      time: timeLabel,
      expectedPowerMw,
      actualPowerMw,
      telemetryPowerMw,
      scadaPowerMw,
      irradianceWm2,
      prPct,
      bessSocPct,
      bessPowerMw,
      ambientTempC,
      moduleTempC,
      isFuturePoint,
      isNightPoint
    });
  }
  
  const energyTodayMWh = Math.round(totalPVGenMWh * 100) / 100;
  const prDayAvgPct = totalExpectedPVGenMWh > 0 
    ? Math.round((totalPVGenMWh / totalExpectedPVGenMWh) * 100) 
    : 86;
  
  let scadaStatus: PVMetricsScadaStatus = 'simulated';
  let scadaQualityPct = 98.8;
  if (mode === 'scada-live') {
    scadaStatus = 'connected';
    scadaQualityPct = 100.0;
  } else if (mode === 'telemetry') {
    scadaStatus = 'connected';
    scadaQualityPct = 95.4;
  }
  
  // Actual values derived from system time
  const currentIrradianceWm2 = calculateIrradianceByHour(currentHour);
  const currentAmbientTempC = calculateAmbientTempByHour(currentHour);
  const currentModuleTempC = calculateModuleTempByHour(
    currentHour,
    currentAmbientTempC,
    currentIrradianceWm2,
  );

  const expectedPowerCurrentMw = calculateExpectedPowerMw(
    currentIrradianceWm2,
    plantCapacityMw,
    currentModuleTempC,
  );

  const actualPowerCurrentMw = calculateActualPowerMw(
    expectedPowerCurrentMw,
    currentHour,
  );

  const currentBess = calculateBessSocAndPower(currentHour);
  const bessMode: PVMetricsBessMode = currentBess.bessPowerMw > 0.1 
    ? 'charging' 
    : currentBess.bessPowerMw < -0.1 
      ? 'discharging' 
      : 'standby';

  const bessStatus = bessMode === 'charging'
    ? 'Cargando de excedente FV'
    : bessMode === 'discharging'
      ? 'Inyectando energía a la red (BESS)'
      : 'Standby / Batería en espera';
  
  const kpi: PVMetricsKpiSnapshot = {
    energyTodayMWh: energyTodayMWh || 38.72,
    energyYesterdayMWh: 36.48,
    prDayAvgPct: prDayAvgPct || 86,
    prYesterdayPct: 83,
    peakPowerMw: maxActualPowerMw || 5.21,
    peakPowerTime: peakPowerTime || '11:00',
    irradianceCurrentWm2: currentIrradianceWm2,
    expectedPowerCurrentMw,
    actualPowerCurrentMw,
    scadaStatus,
    scadaQualityPct,
    bessMode,
    bessSocPct: currentBess.bessSocPct,
    bessStatus,
    lastUpdateTime: getLocalTimeLabel(now, timezone),
    timezone
  };
  
  const losses = {
    temperaturePct: 2.1,
    mismatchPct: 1.8,
    shadingPct: 1.1,
    soilingPct: 1.0,
    clippingPct: 0.6,
    availabilityPct: 0.4,
    otherPct: 1.7
  };

  const alerts = mode === 'scada-live' ? [
    { id: '1', time: '10:21', level: 'info' as const, message: 'SCADA directo en modo lectura simulada', source: 'SCADA' },
    { id: '2', time: '09:47', level: 'info' as const, message: 'BESS cambió a modo CARGA', source: 'BESS' },
    { id: '3', time: '09:12', level: 'info' as const, message: 'Irradiancia normalizada', source: 'Meteo' },
    { id: '4', time: '08:33', level: 'warning' as const, message: 'Lectura SCADA directa activa (Simulada para Demo)', source: 'SCADA' },
    { id: '5', time: '07:58', level: 'warning' as const, message: 'Alta temperatura en módulo — String 04', source: 'Campo FV' }
  ] : mode === 'telemetry' ? [
    { id: '1', time: '10:21', level: 'info' as const, message: 'Enlace telemetría cloud activo y verificado', source: 'Cloud' },
    { id: '2', time: '09:47', level: 'info' as const, message: 'BESS cambió a modo CARGA', source: 'BESS' },
    { id: '3', time: '09:12', level: 'info' as const, message: 'Irradiancia normalizada', source: 'Meteo' },
    { id: '4', time: '08:33', level: 'warning' as const, message: 'Pérdida de comunicación temporal con inversor INV-12', source: 'Inversores' },
    { id: '5', time: '07:58', level: 'warning' as const, message: 'Alta temperatura en módulo — String 04', source: 'Campo FV' }
  ] : [
    { id: '1', time: '10:21', level: 'info' as const, message: 'Datos generados localmente para demostración segura', source: 'Simulación' },
    { id: '2', time: '09:47', level: 'info' as const, message: 'BESS cambió a modo CARGA', source: 'BESS' },
    { id: '3', time: '09:12', level: 'info' as const, message: 'Irradiancia normalizada', source: 'Meteo' },
    { id: '4', time: '08:33', level: 'warning' as const, message: 'Pérdida de comunicación simulada para INV-12', source: 'Inversores' },
    { id: '5', time: '07:58', level: 'warning' as const, message: 'Alta temperatura en módulo — String 04', source: 'Campo FV' }
  ];

  const subsystems = [
    { id: 'inv', name: 'Inversores', status: 'ok' as const, detail: '100% OK' },
    { id: 'str', name: 'Strings / String boxes', status: 'ok' as const, detail: '100% OK' },
    { id: 'tra', name: 'Transformador MT', status: 'ok' as const, detail: '100% OK' },
    { id: 'sca', name: 'Medición / SCADA', status: 'ok' as const, detail: mode === 'demo' ? 'Simulado estable' : 'Conectado estable' },
    { id: 'bes', name: 'BESS', status: 'ok' as const, detail: 'Normal / Cargando' },
    { id: 'met', name: 'Estación meteorológica', status: 'ok' as const, detail: 'Operativa demo' }
  ];

  const parameters = {
    plantCapacityMw: 6.0,
    prWarningThresholdPct: 80,
    moduleTempWarningThresholdC: 65,
    telemetryVsScadaTolerancePct: 5,
    bessMaxPowerMw: 2.0,
    scadaSimulationEnabled: true,
    simulatedEventsEnabled: true,
    timezone,
    visualRefreshSeconds: 30
  };

  let energyChargedTodayMwh = 0;
  let measuredEnergyChargedTodayMwh = 0;
  let energyDischargedTodayMwh = 0;
  let measuredEnergyDischargedTodayMwh = 0;

  timeSeries.forEach(point => {
    if (!point.isFuturePoint) {
      if (point.bessPowerMw > 0) {
        energyChargedTodayMwh += point.bessPowerMw;
      } else if (point.bessPowerMw < 0) {
        energyDischargedTodayMwh += Math.abs(point.bessPowerMw);
      }
    }
  });

  energyChargedTodayMwh = Number(energyChargedTodayMwh.toFixed(2));
  energyDischargedTodayMwh = Number(energyDischargedTodayMwh.toFixed(2));
  
  // Minor sensor error in physical meter
  measuredEnergyChargedTodayMwh = Number((energyChargedTodayMwh * 0.982).toFixed(2));
  measuredEnergyDischargedTodayMwh = Number((energyDischargedTodayMwh * 1.015).toFixed(2));

  const emsPowerMw = currentBess.bessPowerMw;
  const measuredPowerMw = emsPowerMw !== 0 
    ? Number((emsPowerMw * 0.975 + (Math.sin(currentHour) * 0.03)).toFixed(2))
    : 0;

  const bessTelemetryReality = calculateBessTelemetryRealitySnapshot({
    emsPowerMw,
    measuredPowerMw,
    emsSocPct: currentBess.bessSocPct,
    measuredEnergyCapacityMwh: 4.0,
    energyChargedTodayMwh,
    measuredEnergyChargedTodayMwh,
    energyDischargedTodayMwh,
    measuredEnergyDischargedTodayMwh,
    sourceTelemetryLabel: bessDataMode === 'ems-readonly' ? 'EMS BESS Read-Only (ems-readonly)' : 'EMS BESS (bess-ems) [Demo]',
    sourceMeasurementLabel: bessDataMode === 'meter-readonly' ? 'Medición BESS Read-Only (meter-readonly)' : 'Medidor BESS Dedicado [Demo]',
  });

  const dataSourceBadges = createLiveDataSourceBadges({
    environmentDataMode,
    operationalDataMode,
    bessDataMode,
  });

  return {
    mode,
    kpi,
    timeSeries,
    losses,
    alerts,
    subsystems,
    parameters,
    bessTelemetryReality,
    dataSourceBadges,
    environmentDataMode,
    operationalDataMode,
    bessDataMode
  };
}

export const createPvMetricsDailyTrendDemo = (): PVMetricsTrendPoint[] => {
  const points: PVMetricsTrendPoint[] = [];
  const plantCapacityMw = 6.0;
  for (let h = 0; h < 24; h++) {
    const label = h < 10 ? `0${h}:00` : `${h}:00`;
    
    // Irradiance bell curve (06:00 to 18:00)
    let irradiance = 0;
    if (h >= 6 && h <= 18) {
      const angle = ((h - 6) / 12) * Math.PI;
      const baseIrradiance = Math.sin(angle) * 920;
      const noise = Math.sin(h * 2) * 15 + Math.cos(h * 5) * 5;
      irradiance = Math.max(0, Math.round(baseIrradiance + noise));
    }
    
    // Expected Power MW
    const deratingFactor = 0.88;
    // Temperature effect
    const ambientTemp = 14 + Math.sin(((h - 8) / 24) * 2 * Math.PI) * 7;
    const moduleTemp = irradiance > 0 ? ambientTemp + (irradiance * 0.038) : ambientTemp;
    const tempCorrection = irradiance > 0 ? 1 - (moduleTemp - 25) * 0.004 : 1.0;
    
    let expectedPowerMw = 0;
    if (irradiance > 0) {
      expectedPowerMw = plantCapacityMw * (irradiance / 1000) * deratingFactor * tempCorrection;
      expectedPowerMw = Math.max(0, Math.round(expectedPowerMw * 100) / 100);
    }
    
    // Actual Power MW
    let actualPowerMw = 0;
    if (expectedPowerMw > 0) {
      const efficiencyRatio = 0.942 + (Math.sin(h * 1.5) * 0.015);
      actualPowerMw = Math.round(expectedPowerMw * efficiencyRatio * 100) / 100;
    }
    
    const prAvgPct = expectedPowerMw > 0 ? Math.min(100, Math.round((actualPowerMw / expectedPowerMw) * 100)) : 0;
    
    points.push({
      label,
      expectedEnergyMWh: expectedPowerMw, // 1 hour intervals: MW is equivalent to MWh
      actualEnergyMWh: actualPowerMw,
      expectedPowerMw,
      actualPowerMw,
      irradianceAvgWm2: irradiance,
      prAvgPct,
      lossesPct: irradiance > 0 ? 13.8 : 0,
      availabilityPct: 100.0,
    });
  }
  return points;
};

export const createPvMetricsWeeklyTrendDemo = (): PVMetricsTrendPoint[] => {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const actuals = [38.2, 41.0, 36.5, 39.7, 42.1, 34.8, 37.9];
  const weeklyWeatherFactor = [0.97, 1.03, 0.91, 0.99, 1.06, 0.88, 0.95];
  
  return days.map((day, idx) => {
    const factor = weeklyWeatherFactor[idx];
    const actualEnergyMWh = Math.round(actuals[idx] * 10) / 10;
    const expectedEnergyMWh = Math.round((actualEnergyMWh / (0.942 * factor)) * 10) / 10;
    const prAvgPct = Math.round((actualEnergyMWh / expectedEnergyMWh) * 100);
    const irradianceAvgWm2 = Math.round(480 * factor);
    const lossesPct = Math.round((14.2 + (1 - factor) * 3) * 10) / 10;
    const availabilityPct = idx === 5 ? 95.5 : 100.0; // Saturday maintenance
    
    return {
      label: day,
      expectedEnergyMWh,
      actualEnergyMWh,
      prAvgPct,
      lossesPct,
      availabilityPct,
      irradianceAvgWm2,
    };
  });
};

export const createPvMetricsMonthlyTrendDemo = (): PVMetricsTrendPoint[] => {
  const monthlyWeatherFactor = [
    1.02, 0.98, 0.94, 1.05, 1.01,
    0.89, 0.93, 1.04, 1.07, 0.96,
    0.85, 0.92, 1.00, 1.03, 0.97,
    0.90, 0.88, 1.06, 1.04, 0.99,
    0.95, 0.91, 0.87, 1.02, 1.05,
    0.98, 0.93, 1.01, 0.89, 0.96,
  ];
  
  return Array.from({ length: 30 }).map((_, idx) => {
    const label = (idx + 1).toString().padStart(2, '0');
    const factor = monthlyWeatherFactor[idx];
    
    let baseActual = 39.5;
    let availabilityPct = 100.0;
    
    if (idx === 5) {
      baseActual = 31.0;
    } else if (idx === 10) {
      baseActual = 24.5;
      availabilityPct = 68.0;
    } else if (idx === 17) {
      baseActual = 44.5;
    } else if (idx === 22) {
      baseActual = 29.5;
    } else if (idx === 28) {
      baseActual = 26.0;
      availabilityPct = 72.0;
    }
    
    const actualEnergyMWh = Math.round(baseActual * factor * 10) / 10;
    const expectedEnergyMWh = Math.round((baseActual / (availabilityPct < 100 ? 0.90 : 0.942)) * factor * 10) / 10;
    const prAvgPct = Math.round((actualEnergyMWh / expectedEnergyMWh) * 100);
    const irradianceAvgWm2 = Math.round(490 * factor);
    const lossesPct = Math.round((14.0 + (1 - factor) * 2.5 + (100 - availabilityPct) * 0.1) * 10) / 10;
    
    return {
      label,
      expectedEnergyMWh,
      actualEnergyMWh,
      prAvgPct,
      lossesPct,
      availabilityPct,
      irradianceAvgWm2,
    };
  });
};

export const createPvMetricsTrendDemoByRange = (
  range: PVMetricsTrendRange,
): PVMetricsTrendPoint[] => {
  if (range === 'weekly') return createPvMetricsWeeklyTrendDemo();
  if (range === 'monthly') return createPvMetricsMonthlyTrendDemo();
  return createPvMetricsDailyTrendDemo();
};
