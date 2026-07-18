import React from 'react';
import { FileText, ClipboardCopy } from 'lucide-react';

type PVMetricsPlantIntakeTemplateCardProps = {
  onUseTemplate: () => void;
  templateText: string;
};

export const PVMetricsPlantIntakeTemplateCard: React.FC<
  PVMetricsPlantIntakeTemplateCardProps
> = ({ onUseTemplate, templateText }) => {
  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4"
      id="pvmetrics-plant-intake-template-card"
    >
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Plantilla Oficial v1
          </h3>
        </div>
        <button
          onClick={onUseTemplate}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 hover:border-cyan-400 text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
        >
          <ClipboardCopy className="w-3.5 h-3.5" />
          Usar plantilla
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Campos Mínimos Obligatorios:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Cliente
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Nombre planta
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            País
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Región
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Comuna
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Tecnología
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Potencia FV DC
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Potencia FV AC
          </span>
        </div>
        <div className="text-[10px] text-gray-400">
          *Para FV+BESS se requieren además: Potencia BESS, Energía BESS, Fuente telemetría BESS, Fuente medición BESS.
        </div>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={templateText}
          className="w-full h-44 bg-slate-950 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-400 focus:outline-none resize-none"
        />
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-slate-900 border border-gray-800 rounded text-[9px] font-mono text-gray-500">
          Solo Lectura
        </div>
      </div>
    </div>
  );
};
