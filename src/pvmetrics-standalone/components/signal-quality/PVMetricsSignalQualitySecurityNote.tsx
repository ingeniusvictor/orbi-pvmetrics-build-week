import React from 'react';
import { Lock, ShieldCheck, Key, RefreshCw } from 'lucide-react';

export const PVMetricsSignalQualitySecurityNote: React.FC = () => {
  return (
    <div className="p-5 bg-gray-950 border border-gray-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5" id="signal-quality-security-note">
      <div className="flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-[10px] font-bold text-rose-400 tracking-wider uppercase font-mono mb-1">
            LÍMITE DE SEGURIDAD OPERACIONAL (SOVEREIGN SAFE MODE)
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-4xl">
            <strong className="text-gray-300 font-semibold">LÍMITE DE SEGURIDAD:</strong> Este motor de reglas trabaja únicamente sobre señales de demostración y metadatos locales del catálogo. No ingiere datos productivos, no lee archivos externos, no consulta APIs reales, no conecta SCADA y no ejecuta acciones sobre activos físicos.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end flex-shrink-0 gap-2">
        <div className="flex flex-wrap gap-1.5 justify-end max-w-md">
          <span className="text-[8px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            LOCAL VALIDATION
          </span>
          <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            NO DATA INGESTION
          </span>
          <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            NO API CALLS
          </span>
          <span className="text-[8px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            NO SCADA WRITE
          </span>
          <span className="text-[8px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            NO TELECONTROL
          </span>
        </div>
        <span className="text-[9px] text-gray-600 font-mono text-right max-w-xs leading-normal">
          Cumplimiento total con los principios Sovereign Safe Mode.
        </span>
      </div>
    </div>
  );
};
