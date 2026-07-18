import React, { useState, useRef } from 'react';
import { PVMetricsPlantTechnicalHandoff } from '../../types/pvmetrics-plant-handoff.types';
import { Copy, Check, FileCode } from 'lucide-react';

interface PVMetricsPlantTechnicalHandoffExportBoxProps {
  handoff: PVMetricsPlantTechnicalHandoff;
}

export const PVMetricsPlantTechnicalHandoffExportBox: React.FC<PVMetricsPlantTechnicalHandoffExportBoxProps> = ({
  handoff,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    try {
      if (textareaRef.current) {
        textareaRef.current.select();
      }
      await navigator.clipboard.writeText(handoff.copyableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4 animate-fadeIn" id="technical-handoff-export-box">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-gray-200 font-mono tracking-wider uppercase">
            Exportar Borrador Técnico (Conceptual)
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-slate-950 text-xs font-black font-mono transition-all uppercase tracking-wider cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar handoff técnico
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-gray-400 leading-normal">
        Copia este bloque de texto estructurado para utilizarlo en tus minutas de reunión técnica, propuestas de piloto preliminares o ingeniería conceptual de validación de canales SCADA/EMS.
      </p>

      <div className="relative">
        <textarea
          ref={textareaRef}
          readOnly
          value={handoff.copyableText}
          rows={10}
          className="w-full bg-slate-950/80 border border-gray-850 rounded-lg p-3.5 text-[10px] text-gray-300 font-mono focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-none scrollbar-thin select-all"
        />
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-gray-800 text-[8px] text-gray-500 font-mono uppercase tracking-widest pointer-events-none">
          Draft Read-Only
        </div>
      </div>

      <div className="pt-2 text-center">
        <span className="text-[9px] text-gray-500 font-mono">
          🛡️ No guarda credenciales, no usa base de datos ni envía paquetes a internet.
        </span>
      </div>
    </div>
  );
};
