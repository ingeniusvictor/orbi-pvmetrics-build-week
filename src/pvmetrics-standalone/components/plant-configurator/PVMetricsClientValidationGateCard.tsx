import React from 'react';
import { PVMetricsClientValidationGate } from '../../types/pvmetrics-client-validation.types';
import {
  Shield,
  ShieldCheck,
  AlertOctagon,
  FileCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  HelpCircle,
} from 'lucide-react';

type PVMetricsClientValidationGateCardProps = {
  gate: PVMetricsClientValidationGate;
};

export const PVMetricsClientValidationGateCard: React.FC<
  PVMetricsClientValidationGateCardProps
> = ({ gate }) => {
  const {
    generatedAtLabel,
    gateStatus,
    gateLabel,
    scorePct,
    requiredChecks,
    validatedChecks,
    missingChecks,
    pendingChecks,
    blockingChecks,
    executiveNote,
    nextActions,
    safetyBoundary,
  } = gate;

  // Visual classes according to status
  let gateColorStyles = 'border-rose-500/30 text-rose-400 bg-rose-500/10';
  let statusIcon = <AlertOctagon className="w-5 h-5 text-rose-400" />;

  if (gateStatus === 'ready-for-readonly-pilot') {
    gateColorStyles = 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
    statusIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  } else if (gateStatus === 'ready-for-client-validation') {
    gateColorStyles = 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10';
    statusIcon = <FileCheck className="w-5 h-5 text-cyan-400" />;
  } else if (gateStatus === 'draft-only') {
    gateColorStyles = 'border-amber-500/30 text-amber-400 bg-amber-500/10';
    statusIcon = <Clock className="w-5 h-5 text-amber-400" />;
  }

  return (
    <div
      className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-6 animate-fadeIn"
      id="pvmetrics-client-validation-gate-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-gray-200 font-mono tracking-wider uppercase">
              ORBI Source-of-Truth & Client Validation Gate
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Evaluación conceptual del respaldo documental e idoneidad técnica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-gray-500 font-mono block">Evaluado (CLT):</span>
            <span className="text-xs text-gray-300 font-mono font-medium">{generatedAtLabel}</span>
          </div>
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-extrabold uppercase flex items-center gap-2 ${gateColorStyles}`}>
            {statusIcon}
            {gateLabel}
          </div>
        </div>
      </div>

      {/* Safety Boundary Banner */}
      <div className="p-3 bg-slate-950/60 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <strong className="text-amber-400 text-[10px] font-mono font-extrabold uppercase tracking-wider block">
            Límite Seguro (Safety Boundary)
          </strong>
          <p className="text-[10px] text-gray-300 leading-normal font-sans">
            {safetyBoundary}
          </p>
        </div>
      </div>

      {/* Warning Text */}
      <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div className="text-[10px] text-gray-300 leading-normal font-sans">
          Este gate no valida oficialmente la planta. Solo organiza el respaldo documental necesario antes de solicitar validación cliente o piloto read-only.
        </div>
      </div>

      {/* Scores & Statistics Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center space-y-1">
          <span className="text-[9px] text-gray-500 font-mono block uppercase">Documentación</span>
          <span className="text-xl font-mono font-bold text-white flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            {scorePct}%
          </span>
        </div>

        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center space-y-1">
          <span className="text-[9px] text-gray-500 font-mono block uppercase">Total Requeridos</span>
          <span className="text-xl font-mono font-bold text-slate-300">{requiredChecks}</span>
        </div>

        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center space-y-1">
          <span className="text-[9px] text-gray-500 font-mono block uppercase">Validados OK</span>
          <span className="text-xl font-mono font-bold text-emerald-400">{validatedChecks}</span>
        </div>

        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center space-y-1">
          <span className="text-[9px] text-gray-500 font-mono block uppercase">Pendientes / Faltan</span>
          <span className="text-xl font-mono font-bold text-amber-400">
            {pendingChecks} <span className="text-xs text-gray-600">/</span> {missingChecks}
          </span>
        </div>

        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[9px] text-gray-500 font-mono block uppercase">Bloqueantes Piloto</span>
          <span className={`text-xl font-mono font-bold ${blockingChecks > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {blockingChecks}
          </span>
        </div>
      </div>

      {/* Executive Note */}
      <div className="space-y-1.5">
        <h4 className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-wider block">
          Nota Ejecutiva de Respaldo
        </h4>
        <p className="p-3 bg-slate-950/40 rounded-lg border border-gray-850 text-xs text-gray-300 leading-relaxed font-sans italic">
          {executiveNote}
        </p>
      </div>

      {/* Next Actions */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-wider block">
          Próximas acciones recomendadas ({nextActions.length})
        </h4>

        {nextActions.length === 0 ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-mono">
            ¡Excelente! Toda la documentación crítica requerida se encuentra disponible o referenciada. El perfil está en condiciones ideales para validación formal del cliente.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {nextActions.map((action, i) => (
              <div
                key={i}
                className="p-2.5 bg-slate-950/30 border border-gray-850 rounded-lg text-[11px] text-gray-300 flex items-start gap-2"
              >
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-normal">{action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
