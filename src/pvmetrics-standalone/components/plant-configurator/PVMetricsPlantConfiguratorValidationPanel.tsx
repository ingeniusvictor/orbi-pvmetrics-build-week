import React from 'react';
import { PVMetricsPlantConfiguratorValidationResult } from '../../types/pvmetrics-plant-configurator.types';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  PlusCircle, 
  AlertOctagon, 
  CircleDot 
} from 'lucide-react';

type PVMetricsPlantConfiguratorValidationPanelProps = {
  validation: PVMetricsPlantConfiguratorValidationResult;
};

export const PVMetricsPlantConfiguratorValidationPanel: React.FC<PVMetricsPlantConfiguratorValidationPanelProps> = ({
  validation,
}) => {
  const { summary, checks } = validation;

  // Filter missing or warning checks as blocking/actionable
  const blockingChecks = checks.filter(
    (check) => check.status === 'missing' || check.status === 'warning'
  );

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-5" id="plant-configurator-validation-panel">
      {/* Header with Completion Pct */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-850">
        <div>
          <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            Resumen de Ficha y Brechas
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Métricas de preparación técnica
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-cyan-400 font-mono tracking-tighter">
            {summary.completionPct}%
          </span>
          <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-mono">
            Completitud
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-gray-850">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-500"
          style={{ width: `${summary.completionPct}%` }}
        />
      </div>

      {/* Metric counts mini-bento */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850">
          <span className="text-xs font-mono font-bold text-emerald-400 block">
            {summary.completeChecks}
          </span>
          <span className="text-[8px] font-mono text-gray-500 uppercase">Listos</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850">
          <span className="text-xs font-mono font-bold text-red-400 block">
            {summary.missingChecks}
          </span>
          <span className="text-[8px] font-mono text-gray-500 uppercase">Faltan</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850">
          <span className="text-xs font-mono font-bold text-amber-500 block">
            {summary.warningChecks}
          </span>
          <span className="text-[8px] font-mono text-gray-500 uppercase">Warns</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850">
          <span className="text-xs font-mono font-bold text-gray-400 block">
            {summary.notRequiredChecks}
          </span>
          <span className="text-[8px] font-mono text-gray-500 uppercase">N/A</span>
        </div>
      </div>

      {/* Actionable readiness list */}
      <div className="space-y-2">
        <h5 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
          Acciones & Flujos de Onboarding
        </h5>
        
        <div className="space-y-1.5">
          {/* Action 1: Create Conceptual Draft */}
          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
            summary.canCreateDraftProfile 
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
              : 'bg-slate-950/40 border-gray-850 text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10.5px] font-bold font-mono uppercase tracking-tight">Crear Borrador Conceptual</span>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase">
              {summary.canCreateDraftProfile ? 'Habilitado (≥35%)' : 'Falta Info'}
            </span>
          </div>

          {/* Action 2: Client Validation */}
          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
            summary.canRequestClientValidation 
              ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' 
              : 'bg-slate-950/40 border-gray-850 text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10.5px] font-bold font-mono uppercase tracking-tight">Solicitar Validación Cliente</span>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase">
              {summary.canRequestClientValidation ? 'Habilitado (≥70%)' : 'Falta Info'}
            </span>
          </div>

          {/* Action 3: Read-Only Pilot */}
          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
            summary.canPrepareReadonlyPilot 
              ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400' 
              : 'bg-slate-950/40 border-gray-850 text-gray-500'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10.5px] font-bold font-mono uppercase tracking-tight">Preparar Piloto Read-Only</span>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase">
              {summary.canPrepareReadonlyPilot ? 'Listo (≥85% + Aprobación)' : 'Falta Info'}
            </span>
          </div>
        </div>
      </div>

      {/* Actionable / Warning Check Details */}
      <div className="space-y-2">
        <h5 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertOctagon className="w-3 h-3 text-amber-500" /> Brechas Detectadas ({blockingChecks.length})
        </h5>

        {blockingChecks.length > 0 ? (
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {blockingChecks.map((check) => {
              const isMissing = check.status === 'missing';
              return (
                <div 
                  key={check.id} 
                  className={`p-2 rounded-lg border flex items-start gap-2 ${
                    isMissing 
                      ? 'bg-red-500/5 border-red-500/10 text-red-300' 
                      : 'bg-amber-500/5 border-amber-500/10 text-amber-300'
                  }`}
                >
                  {isMissing ? (
                    <XCircle className="w-3 h-3 shrink-0 text-red-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400 mt-0.5" />
                  )}
                  <div className="text-[10px]">
                    <span className="font-bold block uppercase tracking-tight text-[9px] text-gray-400">
                      {check.label}
                    </span>
                    <p className="mt-0.5 leading-tight font-sans text-gray-300">
                      {check.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 rounded-lg p-3 text-center text-[10px] flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            ¡Felicidades! No se registran brechas críticas en este borrador.
          </div>
        )}
      </div>
    </div>
  );
};
