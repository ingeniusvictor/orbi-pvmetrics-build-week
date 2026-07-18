import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PVMetricsPlantIntakeSecurityNote: React.FC = () => {
  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4"
      id="pvmetrics-plant-intake-security-note"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            LÍMITE DE SEGURIDAD Y PRIVACIDAD DE DATOS
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            <strong>LÍMITE DE SEGURIDAD:</strong> Smart Plant Intake trabaja únicamente con texto local en memoria. TXT puede leerse localmente desde el navegador. DOCX y PDF quedan preparados como soporte futuro, pero no se procesan productivamente en esta fase. No se suben documentos, no se guardan archivos, no se realiza OCR, no se conecta SCADA, no se consumen APIs, no se almacenan credenciales, no se modifican setpoints y no se habilita telecontrol.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-800">
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
          TXT LOCAL READY
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-cyan-400 uppercase">
          DOCX FUTURE
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-cyan-400 uppercase">
          PDF FUTURE
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
          NO OCR
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
          NO STORAGE
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
          NO API CALLS
        </span>
        <span className="px-2 py-1 bg-slate-950 border border-gray-800 text-[9px] font-mono font-bold rounded text-rose-500 uppercase">
          NO TELECONTROL
        </span>
      </div>

      <p className="text-[11px] text-gray-400 italic">
        Todo resultado importado queda como draft pendiente de validación cliente. El sistema ayuda a completar el formulario, pero no certifica que los datos sean oficiales.
      </p>
    </div>
  );
};

