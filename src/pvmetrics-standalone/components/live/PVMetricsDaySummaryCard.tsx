import React from 'react';
import { Zap, Clock, ShieldCheck, Thermometer, Percent, ShieldAlert } from 'lucide-react';

interface PVMetricsDaySummaryCardProps {
  energyTodayMWh: number;
  plantAvailabilityPct?: number;
  operatingHours?: number;
  clippingLossPct?: number;
  temperatureLossPct?: number;
  availabilityLossPct?: number;
}

export const PVMetricsDaySummaryCard: React.FC<PVMetricsDaySummaryCardProps> = ({
  energyTodayMWh,
  plantAvailabilityPct = 99.2,
  operatingHours = 10.8,
  clippingLossPct = 0.6,
  temperatureLossPct = 2.1,
  availabilityLossPct = 0.4,
}) => {
  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between h-full" id="card-day-summary">
      <div>
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-4 flex items-center gap-1.5">
          RESUMEN ACUMULADO DEL DÍA
        </h3>
        
        <div className="space-y-3.5">
          {/* Energía acumulada */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs">Energía Acumulada</span>
            </div>
            <div className="text-sm font-bold font-mono text-white">
              {energyTodayMWh.toFixed(2)} <span className="text-[10px] text-gray-400 font-normal">MWh</span>
            </div>
          </div>

          {/* Horas de operación */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs">Horas de Operación</span>
            </div>
            <div className="text-sm font-bold font-mono text-white">
              {operatingHours.toFixed(1)} <span className="text-[10px] text-gray-400 font-normal">h</span>
            </div>
          </div>

          {/* Disponibilidad de planta */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs">Disponibilidad de Planta</span>
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {plantAvailabilityPct.toFixed(1)}%
            </div>
          </div>

          {/* Pérdidas por clipping */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Percent className="w-4 h-4 text-purple-400" />
              <span className="text-xs">Pérdidas por Clipping</span>
            </div>
            <div className="text-sm font-bold font-mono text-purple-400">
              {clippingLossPct.toFixed(1)}%
            </div>
          </div>

          {/* Pérdidas por temperatura */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span className="text-xs">Pérdidas por Temperatura</span>
            </div>
            <div className="text-sm font-bold font-mono text-amber-400">
              {temperatureLossPct.toFixed(1)}%
            </div>
          </div>

          {/* Pérdidas por indisponibilidad */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 text-gray-400">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-xs">Pérdida por Indisponibilidad</span>
            </div>
            <div className="text-sm font-bold font-mono text-rose-400">
              {availabilityLossPct.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-800/70 text-[9px] text-gray-500 font-mono">
        Cálculos integrados vía algoritmo diario PVMetrics
      </div>
    </div>
  );
};
