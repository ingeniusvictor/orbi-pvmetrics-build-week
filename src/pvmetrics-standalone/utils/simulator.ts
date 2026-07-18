import { Plant, ForecastHour, WeeklyForecastDay, MonthlyForecastItem, TelemetryDataPoint } from '../types';

/**
 * Generates daily 24-hour simulation data based on the selected plant's specs.
 */
export function generateDailyForecast(plant: Plant, noiseLevel: 'low' | 'medium' | 'high' = 'medium', seedDate = new Date()): ForecastHour[] {
  const hours: ForecastHour[] = [];
  const { pv, bess } = plant;

  // Noise amplitude
  const noiseAmp = noiseLevel === 'low' ? 0.03 : noiseLevel === 'medium' ? 0.08 : 0.18;

  // Initialize SOC tracking
  let soc = bess.currentSocPercent ?? 40;

  for (let h = 0; h < 24; h++) {
    // 1. Solar Radiation Bell Curve (peaks at hour 12.5)
    let radiation = 0;
    if (h >= 6 && h <= 19) {
      const x = (h - 12.5) / 3.5;
      radiation = Math.exp(-x * x) * 980; // W/m2 max
      // Add random noise
      const rand = Math.sin(h * 13 + seedDate.getDate()) * noiseAmp;
      radiation = Math.max(0, radiation * (1 + rand));
    }

    // 2. Solar PV Output
    let pvGen = 0;
    if (pv.capacityMW > 0) {
      const trackingBoost = pv.trackerType === 'Single-Axis' ? 1.15 : pv.trackerType === 'Dual-Axis' ? 1.25 : 1.0;
      const temperatureDecline = h >= 11 && h <= 15 ? 0.92 : 0.97; // inverter heat loss
      pvGen = pv.capacityMW * (radiation / 1000) * 0.82 * trackingBoost * temperatureDecline;
      pvGen = Math.min(pv.capacityMW, Math.max(0, pvGen));
    }

    // 3. Marginal Cost curve ($/MWh) - Solar-rich market typical profile
    // Peak solar hours have depressed or zero prices. Evening peaks have high prices.
    let price = 30; // base price
    if (h >= 10 && h <= 15) {
      price = 5 + Math.cos(h) * 4; // solar deflation
    } else if (h >= 18 && h <= 22) {
      price = 95 + Math.sin(h * 2) * 15; // evening peak
    } else if (h >= 7 && h <= 9) {
      price = 55 + Math.cos(h) * 8; // morning peak
    } else {
      price = 28 + Math.sin(h) * 5; // nighttime standard
    }
    // Prevent negative prices for simplicity
    price = Math.max(0.5, price);

    // 4. BESS Dispatch advice & state transitions
    let chargeAdvice = 0;
    let dischargeAdvice = 0;
    let advType: 'CHARGE' | 'DISCHARGE' | 'HOLD' = 'HOLD';

    if (bess.capacityMW > 0) {
      const hourlyMaxCharge = bess.maxChargeRateMW;
      const hourlyMaxDischarge = bess.maxDischargeRateMW;

      // Charge during high solar & low prices (hours 11 to 15)
      if (h >= 11 && h <= 15 && pvGen > (pv.capacityMW * 0.3)) {
        if (soc < bess.maxSocPercent) {
          const possibleCharge = Math.min(hourlyMaxCharge, pvGen * 0.6); // Charge using 60% of PV
          const roomToCharge = ((bess.maxSocPercent - soc) / 100) * bess.capacityMWh;
          chargeAdvice = Math.min(possibleCharge, roomToCharge);
          soc += (chargeAdvice * (bess.roundTripEfficiency / 100) / bess.capacityMWh) * 100;
          soc = Math.min(bess.maxSocPercent, soc);
          advType = 'CHARGE';
        }
      }
      // Discharge during high price hours (hours 18 to 22)
      else if (h >= 18 && h <= 22) {
        if (soc > bess.minSocPercent) {
          const possibleDischarge = hourlyMaxDischarge;
          const availableEnergy = ((soc - bess.minSocPercent) / 100) * bess.capacityMWh;
          dischargeAdvice = Math.min(possibleDischarge, availableEnergy);
          soc -= (dischargeAdvice / bess.capacityMWh) * 100;
          soc = Math.max(bess.minSocPercent, soc);
          advType = 'DISCHARGE';
        }
      }
      // Natural trickle-loss or hold
      else {
        advType = 'HOLD';
      }
    }

    // 5. Confidence score formulas
    let confidence = 96;
    if (noiseLevel === 'medium') confidence -= Math.abs(Math.sin(h)) * 3;
    if (noiseLevel === 'high') confidence -= Math.abs(Math.sin(h * 4)) * 12 + 5;
    if (plant.status !== 'active') confidence -= 20;

    const timeLabel = `${h.toString().padStart(2, '0')}:00`;

    hours.push({
      hour: h,
      timeLabel,
      radiationForecast: Math.round(radiation),
      pvGenerationForecastMW: parseFloat(pvGen.toFixed(2)),
      bessChargeAdviceMW: parseFloat(chargeAdvice.toFixed(2)),
      bessDischargeAdviceMW: parseFloat(dischargeAdvice.toFixed(2)),
      socForecastPercent: Math.round(soc),
      marginalCostUSD: parseFloat(price.toFixed(2)),
      advisoryType: advType,
      confidenceScore: Math.round(Math.max(10, Math.min(99, confidence))),
    });
  }

  return hours;
}

/**
 * Generates weekly aggregate data (7 days)
 */
export function generateWeeklyForecast(plant: Plant, noiseLevel: 'low' | 'medium' | 'high' = 'medium'): WeeklyForecastDay[] {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const baseDate = new Date();
  
  return days.map((dayName, idx) => {
    const dailyForecast = generateDailyForecast(plant, noiseLevel, new Date(baseDate.getTime() + idx * 24 * 3600 * 1000));
    
    // Aggregates
    const pvYieldMWh = dailyForecast.reduce((acc, curr) => acc + curr.pvGenerationForecastMW, 0);
    const bessDischarge = dailyForecast.reduce((acc, curr) => acc + curr.bessDischargeAdviceMW, 0);
    const bessCycles = plant.bess.capacityMWh > 0 ? bessDischarge / plant.bess.capacityMWh : 0;
    
    // Calculate simulated optimized arbitrage profit
    // (Discharge price * Discharge MW) - (Charge price * Charge MW)
    let arbitUSD = 0;
    dailyForecast.forEach(h => {
      arbitUSD += (h.bessDischargeAdviceMW * h.marginalCostUSD) - (h.bessChargeAdviceMW * h.marginalCostUSD);
    });

    const averageConfidence = dailyForecast.reduce((acc, curr) => acc + curr.confidenceScore, 0) / 24;

    return {
      dayName,
      date: new Date(baseDate.getTime() + idx * 24 * 3600 * 1000).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
      radiationSum: Math.round(dailyForecast.reduce((acc, curr) => acc + curr.radiationForecast, 0) / 10),
      pvYieldMWh: parseFloat(pvYieldMWh.toFixed(1)),
      bessCycles: parseFloat(bessCycles.toFixed(2)),
      commercialOptimizationUSD: parseFloat(Math.max(0, arbitUSD).toFixed(0)),
      confidenceScore: Math.round(averageConfidence),
    };
  });
}

/**
 * Generates monthly aggregate data (12 months)
 */
export function generateMonthlyForecast(plant: Plant): MonthlyForecastItem[] {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const seasonalFactors = [1.2, 1.15, 1.0, 0.8, 0.6, 0.5, 0.55, 0.7, 0.9, 1.05, 1.18, 1.25]; // Summer peak in Chile

  return months.map((monthName, idx) => {
    const factor = seasonalFactors[idx];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][idx];
    
    // Calculate base values modulated by seasonal factor
    const pvYieldMWh = plant.pv.capacityMW * 4.5 * daysInMonth * factor * 0.82;
    const bessThroughputMWh = plant.bess.capacityMWh * 0.95 * daysInMonth * (factor > 0.8 ? 1.0 : 0.8);
    
    // Arbitrage revenue
    const avgDischargePriceUSD = 98 * (1 + (1 - factor) * 0.15); // prices are slightly higher in winter due to low hydro
    const avgChargePriceUSD = 8 * factor; // solar hours are cheaper in summer
    const estimatedRevenueUSD = (bessThroughputMWh * avgDischargePriceUSD) - (bessThroughputMWh * (plant.bess.roundTripEfficiency / 100) * avgChargePriceUSD) + (pvYieldMWh * 42);

    const performanceRatio = 81.5 + (1 - factor) * 3; // cooler months have slightly higher panel efficiency

    return {
      monthName,
      pvYieldMWh: Math.round(pvYieldMWh),
      bessThroughputMWh: Math.round(bessThroughputMWh),
      estimatedRevenueUSD: Math.round(Math.max(0, estimatedRevenueUSD)),
      performanceRatio: parseFloat(Math.min(92, Math.max(70, performanceRatio)).toFixed(1)),
    };
  });
}

/**
 * Generates active telemetry with latency and packet loss simulation
 */
export function generateTelemetryData(plant: Plant, scanRateSec = 1): TelemetryDataPoint {
  const now = new Date();
  const h = now.getHours();
  
  // Radiation profile
  let radiation = 0;
  if (h >= 6 && h <= 19) {
    const x = (h - 12.5) / 3.5;
    radiation = Math.exp(-x * x) * 940;
    // Add micro-fluctuations (clouds)
    radiation *= (1 + (Math.sin(now.getSeconds() / 5) * 0.04));
  }

  // Solar Output
  let pvPower = 0;
  if (plant.pv.capacityMW > 0) {
    pvPower = plant.pv.capacityMW * (radiation / 1000) * 0.81;
    pvPower = Math.min(plant.pv.capacityMW, Math.max(0, pvPower));
  }

  // Latency & Connection status simulation
  const rand = Math.random();
  let latency = 12 + Math.floor(rand * 15);
  let loss = 0.0;
  
  if (plant.status === 'offline') {
    latency = 0;
    loss = 100.0;
  } else if (plant.status === 'maintenance') {
    latency = 120 + Math.floor(rand * 80);
    loss = 3.5;
  } else {
    // Standard noise
    if (rand > 0.98) {
      latency = 250; // spike
      loss = 1.0;
    }
  }

  // Data Quality Scorer calculation
  let dqScore = 100 - (loss * 4);
  if (latency > 150) dqScore -= 8;
  if (latency > 50 && latency <= 150) dqScore -= 3;
  if (plant.status === 'offline') dqScore = 0;
  dqScore = Math.max(0, Math.min(100, dqScore));

  const isBessActive = plant.bess.capacityMW > 0;
  let bessCharge = 0;
  let bessDischarge = 0;
  let soc = plant.bess.currentSocPercent ?? 42;

  if (isBessActive) {
    // Current dispatch state simulation based on hour
    if (h >= 11 && h <= 15) {
      bessCharge = Math.min(plant.bess.maxChargeRateMW, pvPower * 0.5);
    } else if (h >= 18 && h <= 22) {
      bessDischarge = Math.min(plant.bess.maxDischargeRateMW, plant.bess.capacityMW * 0.8);
    }
  }

  const gridPower = pvPower - bessCharge + bessDischarge;

  return {
    timestamp: now.toLocaleTimeString('es-CL'),
    solarRadiation: Math.round(radiation),
    pvPowerMW: parseFloat(pvPower.toFixed(2)),
    bessSocPercent: Math.round(soc),
    bessChargeMW: parseFloat(bessCharge.toFixed(2)),
    bessDischargeMW: parseFloat(bessDischarge.toFixed(2)),
    gridPowerMW: parseFloat(gridPower.toFixed(2)),
    frequencyHz: parseFloat((50 + (Math.sin(now.getSeconds() / 3) * 0.02) + (rand * 0.01 - 0.005)).toFixed(3)),
    voltageKV: parseFloat((220 + (Math.cos(now.getSeconds() / 10) * 0.8)).toFixed(2)),
    dataQualityScore: Math.round(dqScore),
    signalStrengthDbm: plant.status === 'active' ? -55 - Math.round(rand * 15) : -95,
    packetLossPercent: loss,
  };
}
