import React from 'react';
import { PVMetricsLossBreakdown } from '../../types/pvmetrics-live-monitoring.types';
import { HelpCircle } from 'lucide-react';

interface PVMetricsLossDistributionCardProps {
  losses: PVMetricsLossBreakdown;
}

export const PVMetricsLossDistributionCard: React.FC<PVMetricsLossDistributionCardProps> = ({ losses }) => {
  const totalLossesPct =
    losses.temperaturePct +
    losses.mismatchPct +
    losses.shadingPct +
    losses.soilingPct +
    losses.clippingPct +
    losses.availabilityPct +
    losses.otherPct;

  const items = [
    { label: 'Temperatura', value: losses.temperaturePct, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Desajuste (Mismatch)', value: losses.mismatchPct, color: 'bg-orange-500', text: 'text-orange-400' },
    { label: 'Sombreamiento', value: losses.shadingPct, color: 'bg-yellow-500', text: 'text-yellow-400' },
    { label: 'Soiling (Polvo)', value: losses.soilingPct, color: 'bg-cyan-500', text: 'text-cyan-400' },
    { label: 'Clipping (Inversor)', value: losses.clippingPct, color: 'bg-purple-500', text: 'text-purple-400' },
    { label: 'Disponibilidad', value: losses.availabilityPct, color: 'bg-rose-500', text: 'text-rose-400' },
    { label: 'Otros factores', value: losses.otherPct, color: 'bg-slate-500', text: 'text-slate-400' },
  ];

  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between h-full" id="card-loss-distribution">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-1.5">
            DISTRIBUCIÓN DE PÉRDIDAS (DÍA)
            <span className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-gray-500 cursor-help hover:text-gray-300" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-56 p-2 bg-gray-950 text-[10px] text-gray-300 rounded shadow-lg border border-gray-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Pérdidas acumuladas estimadas con respecto al recurso solar teórico disponible de la fecha.
              </span>
            </span>
          </h3>
          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">
            Total: {totalLossesPct.toFixed(1)}%
          </span>
        </div>

        <div className="space-y-2.5">
          {items.map((item) => {
            const pctOfTotal = totalLossesPct > 0 ? (item.value / totalLossesPct) * 100 : 0;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-400">{item.label}</span>
                  <span className={`font-mono font-bold ${item.text}`}>{item.value.toFixed(1)}%</span>
                </div>
                
                {/* Horizontal Gauge Bar */}
                <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(item.value / 3.5) * 100}%` }} // Normalizing against 3.5% max limit for visual appeal
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-2 text-[9px] text-gray-500 font-mono flex items-center justify-between">
        <span>Eficiencia global: {(100 - totalLossesPct).toFixed(1)}%</span>
        <span>Modelo climático: GHI real</span>
      </div>
    </div>
  );
};
