import React, { useState } from 'react';
import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorValidationResult,
} from '../../types/pvmetrics-plant-configurator.types';
import { RefreshCw, Copy, Check, Eye, Trash2, ShieldAlert } from 'lucide-react';

type PVMetricsPlantConfiguratorDraftPreviewCardProps = {
  draft: PVMetricsPlantConfiguratorDraft;
  validation: PVMetricsPlantConfiguratorValidationResult;
  onResetDraft: () => void;
};

export const PVMetricsPlantConfiguratorDraftPreviewCard: React.FC<PVMetricsPlantConfiguratorDraftPreviewCardProps> = ({
  draft,
  validation,
  onResetDraft,
}) => {
  const [copied, setCopied] = useState(false);

  // Compile technical summary as a text block
  const getTechnicalSummaryText = () => {
    return `PERFIL DRAFT LOCAL — NO OFICIAL
=====================================
Cliente: ${draft.ownerName || 'Pendiente'}
Workspace: ${draft.workspaceName || 'Pendiente'}
Planta: ${draft.plantName || 'Sin Nombre'} (Código: ${draft.plantCode || 'P-PENDIENTE'})
Tecnología: ${draft.technology === 'pv-bess' ? 'Híbrido Solar + BESS' : 'Solo Solar FV'}
Ubicación: ${draft.commune || 'Pendiente'}, ${draft.country} (Region: ${draft.region || 'Pendiente'})
Zona Horaria: ${draft.timezone}
Coordenadas: Lat ${draft.latitude ?? 'N/A'} | Lon ${draft.longitude ?? 'N/A'}

POTENCIA Y SISTEMA FV
---------------------
Capacidad FV: ${draft.pvCapacityDcMwp || 0} MWp DC / ${draft.pvCapacityAcMw || 0} MW AC
Estructura / Montaje: ${draft.mountingType}
Inversores: ${draft.inverterCount ?? 'N/A'} unidades (Modelo: ${draft.inverterModel || 'N/A'})

SISTEMA BESS
------------
Cuenta con BESS: ${draft.hasBess ? 'SÍ' : 'NO'}
${draft.hasBess ? `Capacidad BESS: ${draft.bessPowerMw ?? 0} MW / ${draft.bessEnergyMwh ?? 0} MWh\nModo Operación: ${draft.bessOperationMode}\nVendor EMS: ${draft.bessEmsVendor || 'Pendiente'}` : 'No aplica BESS'}

FUENTES DE DATOS (ESTADO)
------------------------
CSV Históricos: ${draft.hasHistoricalCsv}
Excel Ficha Técnica: ${draft.hasExcelWorkbook}
Client API: ${draft.hasClientApi}
SCADA Read-Only: ${draft.hasScadaReadonly}
Medidor Principal: ${draft.hasEnergyMeter}
Estación Meteorológica: ${draft.hasWeatherStation}
${draft.hasBess ? `
FUENTES DE DATOS BESS DEDICADAS
-------------------------------
EMS BESS Source: ${draft.hasBessEmsSource}
BMS BESS Source: ${draft.hasBessBmsSource}
PCS BESS Source: ${draft.hasBessPcsSource}
SCADA BESS Read-Only: ${draft.hasBessScadaReadonly}
Medidor dedicado BESS: ${draft.hasBessDedicatedMeter}
Medidor POI / Frontera: ${draft.hasPoiMeter}
` : ''}

SEGURIDAD Y VALIDACIONES
-----------------------
Aprobación Read-Only: ${draft.readonlyApproval}
Validación de Cliente Requerida: ${draft.clientValidationRequired ? 'SÍ' : 'NO'}
Origen Ficha Técnica: ${draft.sourceOfTruthLabel || 'Pendiente'}
Completitud del Borrador: ${validation.summary.completionPct}%

NOTAS OPERACIONALES:
${draft.notes || 'Ninguna'}`;
  };

  const handleCopy = async () => {
    const text = getTechnicalSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4" id="plant-configurator-draft-preview-card">
      <div className="flex items-center justify-between border-b border-gray-850 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            Vista Previa de Perfil Borrador
          </h4>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider animate-pulse">
          Modo Borrador
        </span>
      </div>

      {/* Profile Mock Display */}
      <div className="bg-slate-950 p-4 rounded-xl border border-gray-850 text-xs space-y-3 font-mono">
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-500 text-[10px]">NAME:</span>
          <span className="text-white font-bold">{draft.plantName || <span className="text-red-500/80 italic">{"[PENDIENTE_NOMBRE]"}</span>}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">CODE:</span>
          <span className="text-cyan-400 font-bold">{draft.plantCode || <span className="text-red-500/80 italic">{"[PENDIENTE_CODIGO]"}</span>}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">TECHNOLOGY:</span>
          <span className="text-white font-bold uppercase">{draft.technology}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">LOCATION:</span>
          <span className="text-gray-300">
            {draft.commune || 'Localidad...'}, {draft.country}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">TIMEZONE:</span>
          <span className="text-gray-400">{draft.timezone}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">SOLAR MWP/MW:</span>
          <span className="text-amber-500 font-bold">{draft.pvCapacityDcMwp || 0} DC / {draft.pvCapacityAcMw || 0} AC</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">MOUNTING TYPE:</span>
          <span className="text-gray-300 uppercase text-[10px]">{draft.mountingType}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">BESS PARAMS:</span>
          <span className="text-indigo-400 font-bold">
            {draft.hasBess ? `${draft.bessPowerMw ?? 0}MW / ${draft.bessEnergyMwh ?? 0}MWh` : 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">SCADA READONLY:</span>
          <span className="text-gray-300 uppercase text-[10px]">{draft.hasScadaReadonly}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">ENERGY METER:</span>
          <span className="text-gray-300 uppercase text-[10px]">{draft.hasEnergyMeter}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">WEATHER STATION:</span>
          <span className="text-gray-300 uppercase text-[10px]">{draft.hasWeatherStation}</span>
        </div>
        {draft.hasBess && (
          <>
            <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2 text-[10px] text-gray-500">
              <span>BESS EMS / BMS / PCS:</span>
              <span className="text-gray-300 font-bold uppercase text-[9px]">
                {draft.hasBessEmsSource === 'available' ? 'EMS' : ''}
                {draft.hasBessBmsSource === 'available' ? ' + BMS' : ''}
                {draft.hasBessPcsSource === 'available' ? ' + PCS' : ''}
                {!draft.hasBessEmsSource && !draft.hasBessBmsSource && !draft.hasBessPcsSource ? 'Ninguno' : ''}
                {(draft.hasBessEmsSource && draft.hasBessEmsSource !== 'available' && draft.hasBessBmsSource !== 'available' && draft.hasBessPcsSource !== 'available') ? 'Incompleto' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2 text-[10px] text-gray-500">
              <span>BESS METERS / POI:</span>
              <span className="text-gray-300 font-bold uppercase text-[9px]">
                {draft.hasBessDedicatedMeter === 'available' ? 'Dedicado' : ''}
                {draft.hasPoiMeter === 'available' ? ' + POI' : ''}
                {draft.hasBessDedicatedMeter !== 'available' && draft.hasPoiMeter !== 'available' ? 'Incompleto' : ''}
              </span>
            </div>
          </>
        )}
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">RO-APPROVAL:</span>
          <span className="text-emerald-400 uppercase font-bold text-[10px]">{draft.readonlyApproval}</span>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-gray-900/60 pt-2">
          <span className="text-gray-500 text-[10px]">S-O-T LABEL:</span>
          <span className="text-gray-400 truncate max-w-[200px] text-right">{draft.sourceOfTruthLabel || 'N/A'}</span>
        </div>
      </div>

      {/* Copy and reset Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 px-4 py-2 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Ficha Draft</span>
            </>
          )}
        </button>

        <button
          onClick={onResetDraft}
          className="px-3 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-400 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
          title="Resetear todo el borrador actual"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Copy status helper */}
      {copied && (
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[10px] text-center font-sans">
          Ficha técnica copiada al portapapeles correctamente para su almacenamiento o documentación.
        </div>
      )}

      {/* Info warning regarding action limits */}
      <div className="p-2.5 bg-slate-950 rounded-lg border border-gray-850 text-[10px] text-gray-500 font-sans space-y-1">
        <div className="flex items-center gap-1 text-amber-500/70">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span className="font-bold font-mono text-[9px] uppercase tracking-wider">Acciones Deshabilitadas</span>
        </div>
        <p className="leading-normal">
          Las acciones de persistencia (Guardar Ficha Real, Sincronizar Base de Datos, Conectar SCADA, Importación Real de Documentos) están bloqueadas por límites de seguridad local.
        </p>
      </div>
    </div>
  );
};
