import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PVMetricsPlantProfileSecurityNote: React.FC = () => {
  return (
    <div className="bg-slate-950/60 border border-gray-800 p-5 rounded-xl space-y-4" id="plant-profile-security-note">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs">
          <h4 className="font-extrabold text-white tracking-wide font-mono text-[11px] uppercase">
            DECLARACIÓN DE SOBERANÍA Y LÍMITES DE SEGURIDAD
          </h4>
          <p className="text-gray-300 leading-relaxed font-semibold">
            LÍMITE DE SEGURIDAD: Plant Profile Manager solo administra perfiles técnicos locales y presets demo. No conecta SCADA, no consume APIs reales, no lee archivos productivos, no guarda credenciales y no ejecuta comandos sobre activos físicos.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Para una planta real, ORBI PVMetrics IA requiere ficha técnica validada, mapeo de señales, fuentes autorizadas y aprobación read-only antes de cualquier piloto.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-900/60">
        <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold bg-gray-900 text-gray-400 border border-gray-800 uppercase tracking-wider">
          LOCAL PROFILES
        </span>
        <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold bg-gray-900 text-gray-400 border border-gray-800 uppercase tracking-wider">
          DEMO PRESETS
        </span>
        <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold bg-gray-900 text-gray-400 border border-gray-800 uppercase tracking-wider">
          NO API CALLS
        </span>
        <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold bg-gray-900 text-gray-400 border border-gray-800 uppercase tracking-wider">
          NO SCADA WRITE
        </span>
        <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold bg-gray-900 text-gray-400 border border-gray-800 uppercase tracking-wider">
          NO TELECONTROL
        </span>
        <span className="px-2.5 py-0.5 rounded text-[8px] font-mono font-extrabold bg-gray-900 text-gray-400 border border-gray-800 uppercase tracking-wider">
          READ-ONLY FIRST
        </span>
      </div>
    </div>
  );
};
