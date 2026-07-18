export type PlantType = 'solar' | 'bess' | 'hybrid';

export interface BESSConfig {
  capacityMW: number;
  capacityMWh: number;
  roundTripEfficiency: number; // e.g. 88
  maxChargeRateMW: number;
  maxDischargeRateMW: number;
  minSocPercent: number; // e.g. 5
  maxSocPercent: number; // e.g. 95
  degradationRatePercentPerYear: number; // e.g. 1.2
  currentSocPercent?: number; // active SOC
}

export interface PVConfig {
  capacityMW: number;
  panelType: string; // e.g. 'Bifacial Mono-Si'
  inverterCount: number;
  trackerType: 'Fixed' | 'Single-Axis' | 'Dual-Axis';
  tiltDegrees: number;
  azimuthDegrees: number;
}

export interface SCADAConfig {
  protocol: 'Modbus TCP' | 'DNP3' | 'IEC 104' | 'OPC UA';
  ipAddress: string;
  port: number;
  scanRateSeconds: number;
  reconnectDelaySeconds: number;
  registerMappingVerified: boolean;
}

export interface Plant {
  id: string;
  name: string;
  type: PlantType;
  region: string;
  status: 'active' | 'maintenance' | 'offline';
  pv: PVConfig;
  bess: BESSConfig;
  scada: SCADAConfig;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  plants: Plant[];
}

export interface TelemetryDataPoint {
  timestamp: string;
  solarRadiation: number; // W/m2
  pvPowerMW: number;
  bessSocPercent: number;
  bessChargeMW: number;
  bessDischargeMW: number;
  gridPowerMW: number;
  frequencyHz: number;
  voltageKV: number;
  dataQualityScore: number; // 0 - 100
  signalStrengthDbm: number; // -100 to -30
  packetLossPercent: number;
}

export interface ForecastHour {
  hour: number;
  timeLabel: string;
  radiationForecast: number;
  pvGenerationForecastMW: number;
  bessChargeAdviceMW: number;
  bessDischargeAdviceMW: number;
  socForecastPercent: number;
  marginalCostUSD: number; // $/MWh
  advisoryType: 'CHARGE' | 'DISCHARGE' | 'HOLD';
  confidenceScore: number; // 0 - 100
}

export interface WeeklyForecastDay {
  dayName: string;
  date: string;
  radiationSum: number;
  pvYieldMWh: number;
  bessCycles: number;
  commercialOptimizationUSD: number;
  confidenceScore: number;
}

export interface MonthlyForecastItem {
  monthName: string;
  pvYieldMWh: number;
  bessThroughputMWh: number;
  estimatedRevenueUSD: number;
  performanceRatio: number; // %
}

export interface PreMeetingLockdown {
  enabled: boolean;
  passwordHash: string;
  lockedAt?: string;
}

export interface DemoConfig {
  currentPreset: string;
  simulationSpeed: 'real' | 'fast' | 'paused';
  noiseLevel: 'low' | 'medium' | 'high';
  lockdown: PreMeetingLockdown;
}

export interface ReportSection {
  id: string;
  title: string;
  included: boolean;
}

export interface ReportTemplate {
  id: string;
  title: string;
  clientName: string;
  sections: ReportSection[];
  notes: string;
  createdAt: string;
}

export interface ClientInfoItem {
  id: string;
  label: string;
  checked: boolean;
  notes?: string;
  category: 'technical' | 'commercial' | 'operational';
}

export interface SCADARegister {
  address: number;
  name: string;
  type: 'Input' | 'Holding' | 'Coil' | 'Discrete Input';
  dataType: 'Float32' | 'Int16' | 'Uint16' | 'Boolean';
  value: string | number | boolean;
  status: 'valid' | 'stale' | 'error';
}
