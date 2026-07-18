import React from 'react';
import { Cpu, Info } from 'lucide-react';

export const PVMetricsDataSourceArchitectureNote: React.FC = () => {
  return (
    <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="datasource-architecture-note">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-4xl">
          <strong className="text-gray-300">ARQUITECTURA PROPUESTA:</strong> ORBI PVMetrics IA debe recibir datos desde fuentes externas mediante una capa intermedia de lectura, normalización y validación. Esta capa debe transformar señales heterogéneas en un modelo interno común antes de alimentar los dashboards de monitoreo, performance y BESS.
        </p>
      </div>
      
      <div className="flex flex-col items-end flex-shrink-0 text-right">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <Cpu className="w-3.5 h-3.5 text-gray-600" />
          <span>SCADA Read-Only First</span>
        </div>
        <span className="text-[9px] text-gray-600 font-mono mt-0.5 max-w-xs block leading-tight">
          La prioridad es lectura segura y calidad de datos antes de considerar pilotos interactivos bidireccionales.
        </span>
      </div>
    </div>
  );
};
