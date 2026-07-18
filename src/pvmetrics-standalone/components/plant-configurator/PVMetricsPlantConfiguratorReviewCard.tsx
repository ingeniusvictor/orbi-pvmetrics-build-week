import React from 'react';
import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorValidationResult,
} from '../../types/pvmetrics-plant-configurator.types';
import { ShieldAlert, BookOpen, Layers, CheckCircle2, AlertTriangle, Cpu, Globe } from 'lucide-react';

type PVMetricsPlantConfiguratorReviewCardProps = {
  draft: PVMetricsPlantConfiguratorDraft;
  validation: PVMetricsPlantConfiguratorValidationResult;
};

export const PVMetricsPlantConfiguratorReviewCard: React.FC<PVMetricsPlantConfiguratorReviewCardProps> = ({
  draft,
  validation,
}) => {
  const { summary } = validation;

  // Decide recommended status
  let recommendedStatusTitle = 'Perfil Incompleto';
  let recommendedStatusDesc = 'Falta rellenar campos obligatorios básicos en el workspace e identificación.';
  let recommendedStatusColor = 'text-red-400 border-red-500/20 bg-red-500/5';

  if (summary.completionPct >= 85 && draft.readonlyApproval === 'approved') {
    recommendedStatusTitle = 'Listo para Preparar Piloto Read-Only';
    recommendedStatusDesc = 'El borrador posee información técnica suficiente y cuenta con la autorización formal firmada.';
    recommendedStatusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  } else if (summary.completionPct >= 70) {
    recommendedStatusTitle = 'Listo para Solicitar Validación Cliente';
    recommendedStatusDesc = 'Se ha cargado la mayoría de especificaciones técnicas. Se sugiere enviar borrador al cliente.';
    recommendedStatusColor = 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
  } else if (summary.completionPct >= 35) {
    recommendedStatusTitle = 'Borrador Conceptual Posible';
    recommendedStatusDesc = 'Se cuenta con identificación y capacidades iniciales para iniciar la preparación preliminar.';
    recommendedStatusColor = 'text-amber-500 border-amber-500/20 bg-amber-500/5';
  }

  // Compile available sources
  const sourceChecksList: string[] = [];
  if (draft.hasHistoricalCsv === 'available') sourceChecksList.push('CSV Históricos');
  if (draft.hasExcelWorkbook === 'available') sourceChecksList.push('Excel Ingeniería');
  if (draft.hasClientApi === 'available') sourceChecksList.push('Client API');
  if (draft.hasScadaReadonly === 'available') sourceChecksList.push('SCADA Read-Only');
  if (draft.hasEnergyMeter === 'available') sourceChecksList.push('Medidor Facturación');
  if (draft.hasWeatherStation === 'available') sourceChecksList.push('Estación Meteorológica');
  if (draft.hasBess && draft.hasBessEms === 'available') sourceChecksList.push('EMS BESS');

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-5" id="plant-configurator-review-card">
      <div className="border-b border-gray-850 pb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-cyan-400" />
        <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
          Resumen Ejecutivo del Borrador
        </h4>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
        {/* Workspace */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Cliente / Workspace
          </span>
          <p className="text-white font-extrabold">{draft.ownerName || 'Sin definir'}</p>
          <span className="text-[10px] text-gray-400 font-mono block">{draft.workspaceName || 'Sin definir'}</span>
        </div>

        {/* Plant ID */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Planta / Código
          </span>
          <p className="text-white font-extrabold">{draft.plantName || 'Sin definir'}</p>
          <span className="text-[10px] text-cyan-400 font-mono block uppercase">{draft.plantCode || 'P-PENDIENTE'}</span>
        </div>

        {/* Tech and location */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Tecnología & Ubicación
          </span>
          <p className="text-white font-bold uppercase tracking-tight text-[11px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" /> 
            {draft.technology === 'pv-bess' ? 'Híbrido FV + BESS' : 'Solo Solar FV'}
          </p>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
            <Globe className="w-3 h-3 text-gray-500" />
            {draft.commune || 'Comuna pendiente'}, {draft.country} ({draft.timezone})
          </p>
        </div>

        {/* Capacities */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Capacidades de Diseño
          </span>
          <p className="text-white font-bold">
            Solar: <span className="text-amber-400">{draft.pvCapacityDcMwp || 0} MWp DC</span> / {draft.pvCapacityAcMw || 0} MW AC
          </p>
          <p className="text-[10px] text-gray-400">
            Montaje: <span className="font-mono text-cyan-400">{draft.mountingType}</span>
          </p>
        </div>

        {/* BESS detail */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850 sm:col-span-2">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Configuración de Almacenamiento BESS
          </span>
          {draft.hasBess ? (
            <p className="text-white">
              Potencia: <span className="text-indigo-400 font-bold">{draft.bessPowerMw ?? 0} MW</span> | 
              Energía: <span className="text-indigo-400 font-bold">{draft.bessEnergyMwh ?? 0} MWh</span> | 
              Modo: <span className="font-mono uppercase text-gray-300 text-[10px]">{draft.bessOperationMode}</span>
            </p>
          ) : (
            <p className="text-gray-500 font-mono text-[10px]">No aplica para esta planta (Tecnología Solo Solar FV).</p>
          )}
        </div>

        {/* Available data sources */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850 sm:col-span-2">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Fuentes de Datos Confirmadas / Disponibles ({sourceChecksList.length})
          </span>
          {sourceChecksList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sourceChecksList.map((src) => (
                <span key={src} className="px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/30 text-[9px] font-mono text-cyan-400 rounded">
                  {src}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-mono text-[10px] pt-1">Ninguna fuente confirmada como disponible todavía.</p>
          )}
        </div>

        {/* Security / Approval */}
        <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-gray-850 sm:col-span-2">
          <span className="text-[10px] text-gray-500 font-mono uppercase font-bold tracking-wider block">
            Seguridad y Autorización Read-Only
          </span>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-gray-300">Estado de Autorización:</span>
            <span className={`font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
              draft.readonlyApproval === 'approved' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : draft.readonlyApproval === 'requested'
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                : 'bg-slate-900 text-gray-500 border border-gray-850'
            }`}>
              {draft.readonlyApproval}
            </span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1.5 border-t border-gray-900 pt-1">
            <span className="font-mono text-cyan-500">ORIGEN:</span>
            <span className="italic truncate">{draft.sourceOfTruthLabel || 'No documentado'}</span>
          </div>
        </div>
      </div>

      {/* Recommended Status Banner */}
      <div className={`p-3 rounded-xl border flex gap-3 ${recommendedStatusColor}`}>
        <Cpu className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest block">
            Estado Recomendado
          </span>
          <h5 className="font-extrabold text-xs uppercase tracking-tight">
            {recommendedStatusTitle}
          </h5>
          <p className="text-[10.5px] leading-tight opacity-90 font-sans">
            {recommendedStatusDesc}
          </p>
        </div>
      </div>

      {/* Official Ficha Disclaimer */}
      <div className="p-3 bg-slate-950/80 rounded-lg border border-gray-850/50 flex gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
        <p className="text-[9.5px] text-gray-500 leading-normal font-sans">
          <strong>Aviso de Alcance:</strong> Este resumen no equivale a ficha técnica oficial. Requiere documentación del cliente y validación formal antes de cualquier piloto real o conexión de servidores.
        </p>
      </div>
    </div>
  );
};
