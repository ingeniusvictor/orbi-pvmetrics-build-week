import React from 'react';
import { PVMetricsAlertEvent } from '../../types/pvmetrics-live-monitoring.types';
import { ShieldAlert, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

interface PVMetricsRecentAlertsCardProps {
  alerts: PVMetricsAlertEvent[];
}

export const PVMetricsRecentAlertsCard: React.FC<PVMetricsRecentAlertsCardProps> = ({ alerts }) => {
  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between h-full" id="card-recent-alerts">
      <div>
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-1.5">
          ALERTAS Y EVENTOS RECIENTES
        </h3>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const isCritical = alert.level === 'critical';
            const isWarning = alert.level === 'warning';
            
            // Icon selection
            const Icon = isCritical 
              ? ShieldAlert 
              : isWarning 
                ? AlertTriangle 
                : Info;
            
            // Border and text styling
            const containerClass = isCritical
              ? 'border-red-500/20 bg-red-500/5'
              : isWarning
                ? 'border-amber-500/20 bg-amber-500/5'
                : 'border-cyan-500/10 bg-cyan-500/5';
                
            const textClass = isCritical
              ? 'text-red-400'
              : isWarning
                ? 'text-amber-400'
                : 'text-cyan-400';

            return (
              <div 
                key={alert.id} 
                className={`p-2 rounded border flex gap-2.5 transition items-start ${containerClass}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${textClass}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-gray-300">{alert.time}</span>
                    {alert.source && (
                      <span className="text-[8px] font-mono tracking-widest uppercase bg-gray-950 px-1 py-0.5 rounded text-gray-500 border border-gray-800">
                        {alert.source}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5 break-words">
                    {alert.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-2.5 border-t border-gray-800/50 flex items-center gap-1 text-[9px] text-gray-500 font-mono">
        <ShieldCheck className="w-3 h-3 text-emerald-500" />
        <span>Simulación de eventos segura activa.</span>
      </div>
    </div>
  );
};
