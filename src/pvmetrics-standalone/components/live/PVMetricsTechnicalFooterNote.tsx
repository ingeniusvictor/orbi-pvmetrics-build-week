import React from 'react';
import { PVMetricsDataMode } from '../../types/pvmetrics-live-monitoring.types';
import { Info, Cpu } from 'lucide-react';

interface PVMetricsTechnicalFooterNoteProps {
  mode: PVMetricsDataMode;
  environmentDataMode?: 'demo' | 'external-telemetry' | 'onsite-weather' | 'not-available';
  operationalDataMode?: 'demo' | 'scada-readonly' | 'not-available';
  bessDataMode?: 'demo' | 'ems-readonly' | 'meter-readonly' | 'not-available';
}

export const PVMetricsTechnicalFooterNote: React.FC<PVMetricsTechnicalFooterNoteProps> = ({
  mode,
  environmentDataMode = 'external-telemetry',
  operationalDataMode = 'demo',
  bessDataMode = 'demo',
}) => {
  // Select supplementary warning/text according to mode
  let subText = '';
  
  if (operationalDataMode === 'scada-readonly' || bessDataMode === 'ems-readonly' || bessDataMode === 'meter-readonly') {
    subText = 'Modo híbrido con enlaces read-only de alta fidelidad autorizados para integraciones de campo.';
  } else if (environmentDataMode === 'external-telemetry') {
    subText = 'Modo híbrido read-only: ambiente real/estimado por ubicación + operación demo/local.';
  } else {
    subText = 'Sistema operando con datos demo/simulados para propósitos de preventa y validación comercial del cliente.';
  }

  return (
    <div className="p-4 bg-gray-950 border border-gray-900 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4" id="technical-footer-note">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-4xl">
          <strong className="text-gray-300">NOTA TÉCNICA (MODO HÍBRIDO):</strong> Conectado a SCADA, EMS o estimaciones satelitales, 
          ORBI PVMetrics IA compara valores telemetrizados, valores esperados del modelo y el comportamiento real de la planta. 
          Modo híbrido read-only: ambiente real/estimado por ubicación + operación demo/local hasta autorización SCADA/EMS/BMS. Sin comandos, sin setpoints y sin telecontrol.
        </p>
      </div>
      
      <div className="flex flex-col items-end flex-shrink-0 text-right">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <Cpu className="w-3.5 h-3.5 text-gray-600" />
          <span>{subText}</span>
        </div>
        <span className="text-[9px] text-gray-650 font-mono mt-0.5">Sin comandos de escritura de setpoint habilitados</span>
      </div>
    </div>
  );
};
