import React from 'react';
import { PVMetricsClientValidationRequestPack } from '../../types/pvmetrics-client-validation-request.types';
import { AlertCircle, FileText, CheckCircle, ShieldAlert, Compass } from 'lucide-react';

type PVMetricsClientValidationRequestPackCardProps = {
  pack: PVMetricsClientValidationRequestPack;
};

const categoryLabel: Record<string, string> = {
  identity: 'Identidad',
  'technical-documentation': 'Documentación técnica',
  metering: 'Medición',
  'scada-readonly': 'SCADA read-only',
  weather: 'Clima / meteo',
  bess: 'BESS',
  permissions: 'Permisos',
  security: 'Seguridad',
};

const priorityLabel: Record<string, string> = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const PVMetricsClientValidationRequestPackCard: React.FC<
  PVMetricsClientValidationRequestPackCardProps
> = ({ pack }) => {
  const {
    plantName,
    plantCode,
    technologyLabel,
    gateLabel,
    scorePct,
    items,
    criticalItems,
    highItems,
    mediumItems,
    lowItems,
    executiveIntro,
    safetyBoundary,
  } = pack;

  return (
    <div
      className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-6 animate-fadeIn"
      id="pvmetrics-client-validation-request-pack-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="text-sm font-bold text-gray-200 font-mono tracking-wider uppercase">
              Client Validation Request Pack
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Requerimientos y checklist de validación para {plantName} ({plantCode}).
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-2 py-1 rounded bg-slate-950 text-gray-400 border border-gray-800 text-[10px] font-mono font-bold uppercase">
            {technologyLabel}
          </span>
          <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold">
            Score: {scorePct}%
          </span>
        </div>
      </div>

      {/* Safety Boundary Banner */}
      <div className="p-3 bg-amber-950/10 border border-amber-500/15 rounded-lg flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="space-y-0.5">
          <strong className="text-amber-500 text-[10px] font-mono font-bold uppercase tracking-wider block">
            Límite Seguro (Safety Boundary)
          </strong>
          <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
            {safetyBoundary}
          </p>
        </div>
      </div>

      {/* Warning Text */}
      <div className="p-3.5 bg-slate-950/40 border border-gray-850 rounded-lg text-xs text-gray-400 leading-normal font-sans">
        Este paquete no se envía automáticamente. Solo prepara texto local para revisión humana antes de contactar al cliente.
      </div>

      {/* Intro */}
      <div className="p-4 bg-slate-950/60 border border-gray-850 rounded-lg space-y-1">
        <span className="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-wider block">
          Introducción Ejecutiva
        </span>
        <p className="text-xs text-gray-300 font-sans leading-relaxed">
          {executiveIntro}
        </p>
      </div>

      {/* Priorities breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center">
          <span className="text-[9px] text-rose-400 font-mono block uppercase font-bold">Críticas</span>
          <span className="text-lg font-mono font-bold text-rose-400">{criticalItems}</span>
        </div>
        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center">
          <span className="text-[9px] text-amber-400 font-mono block uppercase font-bold">Altas</span>
          <span className="text-lg font-mono font-bold text-amber-400">{highItems}</span>
        </div>
        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center">
          <span className="text-[9px] text-cyan-400 font-mono block uppercase font-bold">Medias</span>
          <span className="text-lg font-mono font-bold text-cyan-400">{mediumItems}</span>
        </div>
        <div className="p-3 bg-slate-950/40 border border-gray-850 rounded-lg text-center">
          <span className="text-[9px] text-gray-400 font-mono block uppercase font-bold">Bajas</span>
          <span className="text-lg font-mono font-bold text-gray-300">{lowItems}</span>
        </div>
      </div>

      {/* Requested Items List */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-wider block">
          Listado de Solicitudes Activas ({items.length})
        </h4>

        {items.length === 0 ? (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-center">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-400 font-mono mt-1.5 font-bold">
              ¡No hay solicitudes pendientes!
            </p>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Todos los datos clave cuentan con respaldo o están confirmados.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {items.map((item) => {
              let priorityColor = 'text-gray-400 border-gray-850 bg-slate-950';
              if (item.priority === 'critical') {
                priorityColor = 'text-rose-400 border-rose-500/20 bg-rose-500/5';
              } else if (item.priority === 'high') {
                priorityColor = 'text-amber-400 border-amber-500/20 bg-amber-500/5';
              } else if (item.priority === 'medium') {
                priorityColor = 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
              }

              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-950/30 border border-gray-850 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {item.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase bg-slate-950 text-gray-400 border-gray-800">
                        {categoryLabel[item.category] || item.category}
                      </span>
                      {item.blocksReadonlyPilot && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold">
                          Bloquea Piloto
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {item.requestText}
                    </p>
                    <p className="text-[10px] text-gray-500 font-sans leading-relaxed italic">
                      Motivo actual: {item.reason}
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase self-start ${priorityColor}`}>
                    {priorityLabel[item.priority]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
