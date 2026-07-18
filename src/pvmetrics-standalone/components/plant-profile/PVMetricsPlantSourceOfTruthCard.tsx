import React from 'react';
import { PVMetricsPlantTechnicalProfile } from '../../types/pvmetrics-plant-profile.types';
import { ShieldAlert, AlertTriangle, CheckCircle, Database } from 'lucide-react';

type PVMetricsPlantSourceOfTruthCardProps = {
  plant: PVMetricsPlantTechnicalProfile;
};

export const PVMetricsPlantSourceOfTruthCard: React.FC<PVMetricsPlantSourceOfTruthCardProps> = ({
  plant,
}) => {
  const isDemo = plant.validationStatus === 'demo-only';
  const isDraft = plant.validationStatus === 'draft';
  const isPending = plant.validationStatus === 'pending-client-validation';
  const isValidated = plant.validationStatus === 'validated-by-client';
  const isReady = plant.validationStatus === 'ready-for-readonly-pilot';

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4" id="plant-source-of-truth-card">
      <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-850 pb-2">
        <Database className="w-4 h-4 text-cyan-400" /> Fuente de Verdad (Source-of-Truth)
      </h3>

      <div className="space-y-3">
        {/* Status indicator row */}
        <div className="flex items-center justify-between text-xs bg-slate-950/40 p-3 rounded-lg border border-gray-850">
          <div>
            <span className="block text-[9px] text-gray-500 uppercase">Clase de Origen</span>
            <span className="font-bold text-white font-mono uppercase tracking-wide">
              {plant.sourceType.replace('-', ' ')}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] text-gray-500 uppercase">Estado Interno</span>
            <span className={`font-bold font-mono text-[10px] px-2 py-0.5 rounded border uppercase ${
              isDemo ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
              isDraft ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
              isPending ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {plant.validationStatus.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Warning / status text blocks */}
        {isDemo && (
          <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>PRESET DEMO NO VALIDADO</span>
            </div>
            <p className="text-xs text-amber-400/90 leading-relaxed font-sans">
              Este perfil es un preset demo editable. Sus valores no representan información oficial, no están validados por cliente y no deben utilizarse como source-of-truth técnico para decisiones operacionales.
            </p>
          </div>
        )}

        {isDraft && (
          <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>BORRADOR EN PLANIFICACIÓN</span>
            </div>
            <p className="text-xs text-cyan-300/90 leading-relaxed font-sans">
              Este perfil es un borrador inicial para configurar una nueva planta FV + BESS. Requiere ficha técnica, parámetros eléctricos, datos BESS, fuentes disponibles y autorización read-only antes de avanzar a piloto.
            </p>
          </div>
        )}

        {isPending && (
          <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>AUDITORÍA DE DOCUMENTO EN CURSO</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              La planta fue ingresada a partir de fichas de ingeniería o plantillas de diseño de proyecto, pero está pendiente de validación final y firma de conformidad técnica por parte del operador del cliente.
            </p>
          </div>
        )}

        {(isValidated || isReady) && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>PERFIL VALIDADO Y DISPONIBLE</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Este activo ha sido contrastado con la documentación técnica oficial del cliente y cumple los requerimientos de estructura para la habilitación de lectura segura read-only.
            </p>
          </div>
        )}

        {/* Source of Truth label explanation */}
        <div className="p-3 bg-slate-950/20 border border-gray-850 rounded-lg text-xs space-y-1.5">
          <span className="block text-[10px] text-gray-500 font-mono font-bold uppercase">
            Origen Oficial Documental:
          </span>
          <p className="text-gray-300 font-medium">
            {plant.sourceOfTruthLabel}
          </p>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            Se prohíbe el uso de datos sintéticos o aproximados de producción solar como base formal de facturación de pérdidas u optimizaciones sin documento legal que certifique las especificaciones nominales de la planta.
          </p>
        </div>
      </div>
    </div>
  );
};
