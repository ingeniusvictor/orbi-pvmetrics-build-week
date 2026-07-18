import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { PVMetricsIndependentAppManifest } from '../release/PVMetricsIndependentAppManifest';

interface Props {
  className?: string;
}

export const PVMetricsStandaloneVersionCard: React.FC<Props> = ({ className = "" }) => {
  const badges = [
    { text: "INDEPENDENT APP", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { text: "CONFIGURABLE", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { text: "SIMULACIÓN LOCAL", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { text: "READ-ONLY", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { text: "NO REAL DISPATCH", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { text: "SCADA READY", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
  ];

  return (
    <div id="version-card" className={`p-5 bg-slate-950 border border-gray-800 rounded-xl relative overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Background radial accent */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase font-mono">Control de Versión</h4>
            <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
              {PVMetricsIndependentAppManifest.appName}
            </h3>
          </div>
        </div>

        <div className="border-t border-gray-900/60 pt-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium">Release ID:</span>
            <span className="font-mono text-amber-400 font-bold bg-amber-500/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
              {PVMetricsIndependentAppManifest.releaseName}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {badges.map((b, idx) => (
            <span 
              key={idx} 
              className={`text-[8px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border ${b.color}`}
            >
              {b.text}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-900/60 flex items-center gap-1.5 text-[10px] text-gray-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Garantía de Aislamiento Activa</span>
      </div>
    </div>
  );
};
