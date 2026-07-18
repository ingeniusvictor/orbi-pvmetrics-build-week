import React from 'react';
import { PVMetricsSubsystemStatus } from '../../types/pvmetrics-live-monitoring.types';
import { CheckCircle, AlertCircle, HelpCircle, PowerOff } from 'lucide-react';

interface PVMetricsSubsystemStatusCardProps {
  subsystems: PVMetricsSubsystemStatus[];
}

export const PVMetricsSubsystemStatusCard: React.FC<PVMetricsSubsystemStatusCardProps> = ({ subsystems }) => {
  return (
    <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between h-full" id="card-subsystem-status">
      <div>
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-4 flex items-center gap-1.5">
          ESTADO DE SUBSISTEMAS
        </h3>

        <div className="space-y-3">
          {subsystems.map((sub) => {
            let statusText = 'OK';
            let dotColor = 'bg-emerald-500';
            let textColor = 'text-emerald-400';
            let Icon = CheckCircle;

            if (sub.status === 'partial') {
              statusText = 'PARCIAL';
              dotColor = 'bg-cyan-500';
              textColor = 'text-cyan-400';
              Icon = AlertCircle;
            } else if (sub.status === 'warning') {
              statusText = 'ADVERTENCIA';
              dotColor = 'bg-amber-500';
              textColor = 'text-amber-400';
              Icon = AlertCircle;
            } else if (sub.status === 'offline') {
              statusText = 'OFFLINE';
              dotColor = 'bg-rose-500';
              textColor = 'text-rose-400';
              Icon = PowerOff;
            }

            return (
              <div key={sub.id} className="flex items-center justify-between border-b border-gray-850/50 pb-2 last:border-b-0 last:pb-0">
                <div className="min-w-0 pr-2">
                  <span className="text-[11px] text-gray-300 font-medium block truncate">{sub.name}</span>
                  <span className="text-[9px] text-gray-500 block truncate">{sub.detail}</span>
                </div>
                
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${textColor}`}>
                    {statusText}
                  </span>
                  <span className="relative flex h-2 w-2">
                    {sub.status === 'ok' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-2 text-[9px] text-gray-500 font-mono text-right">
        Todas las lecturas de telemetría validadas
      </div>
    </div>
  );
};
