import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const PVMetricsPlantConfiguratorSecurityNote: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-red-500/10 rounded-xl p-5 space-y-4" id="plant-configurator-security-note">
      {/* Alert Header */}
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-widest">
            Límites de Seguridad y Sandbox Local
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            <strong>LÍMITE DE SEGURIDAD:</strong> El configurador trabaja únicamente con un borrador local en memoria. No guarda información productiva, no usa localStorage, no consulta APIs, no conecta SCADA, no almacena credenciales y no ejecuta comandos hacia activos físicos.
          </p>
        </div>
      </div>

      {/* Safety Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <span className="px-2 py-1 bg-slate-950 border border-gray-850 text-[8.5px] font-mono font-bold rounded text-red-400 text-center uppercase tracking-tight">
          LOCAL MEMORY ONLY
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-850 text-[8.5px] font-mono font-bold rounded text-red-400 text-center uppercase tracking-tight">
          NO STORAGE
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-850 text-[8.5px] font-mono font-bold rounded text-red-400 text-center uppercase tracking-tight">
          NO API CALLS
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-850 text-[8.5px] font-mono font-bold rounded text-red-400 text-center uppercase tracking-tight">
          NO SCADA WRITE
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-850 text-[8.5px] font-mono font-bold rounded text-red-400 text-center uppercase tracking-tight">
          NO TELECONTROL
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-850 text-[8.5px] font-mono font-bold rounded text-emerald-400 text-center uppercase tracking-tight">
          READ-ONLY FIRST
        </span>
      </div>

      {/* Secondary Warning Text */}
      <div className="flex items-start gap-2.5 bg-slate-950/40 p-3 rounded-lg border border-gray-850">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
          El resultado del wizard es una preparación conceptual. Para avanzar a un piloto real se requiere documentación técnica, validación formal del cliente, aprobación legal del contrato y autorización read-only del SCADA de planta.
        </p>
      </div>
    </div>
  );
};
