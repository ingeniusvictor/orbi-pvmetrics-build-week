import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export const PVMetricsReadinessSecurityNote: React.FC = () => {
  return (
    <div className="p-5 bg-gray-950 border border-gray-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5" id="readiness-security-note">
      <div className="flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-[10px] font-bold text-rose-400 tracking-wider uppercase font-mono mb-1">
            LÍMITE DE SEGURIDAD OPERACIONAL (SOVEREIGN SAFE MODE)
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-4xl">
            <strong className="text-gray-300 font-semibold">LÍMITE DE SEGURIDAD:</strong> La Readiness Matrix utiliza únicamente metadatos locales, fuentes simuladas, catálogo de señales y reglas demo. No ingiere datos reales, no consulta APIs, no abre archivos externos, no conecta SCADA y no ejecuta comandos hacia activos físicos. Esta vista permite evaluar la preparación conceptual antes de cualquier piloto real autorizado.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end flex-shrink-0 gap-2">
        <div className="flex flex-wrap gap-1.5 justify-end max-w-md">
          <span className="text-[8px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            LOCAL MATRIX
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
          <span className="text-[8px] font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/25 px-2 py-0.5 rounded uppercase tracking-wide">
            READ-ONLY FIRST
          </span>
        </div>
        <span className="text-[9px] text-gray-600 font-mono text-right max-w-xs leading-normal">
          Evaluación analítica sin puertos físicos abiertos o habilitados.
        </span>
      </div>
    </div>
  );
};
