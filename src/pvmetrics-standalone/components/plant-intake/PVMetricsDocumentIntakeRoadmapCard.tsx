import React from 'react';
import { createPvMetricsDocumentIntakeCapabilities } from '../../data/createPvMetricsDocumentIntakeCapabilities';
import { Compass, ShieldCheck } from 'lucide-react';

const statusLabel = {
  'supported-now': 'Disponible ahora',
  'planned-safe-local': 'Planificado local',
  'planned-requires-library': 'Planificado con evaluación',
  'blocked-in-current-phase': 'Bloqueado en esta fase',
  unsupported: 'No soportado',
};

export const PVMetricsDocumentIntakeRoadmapCard: React.FC = () => {
  const capabilities = createPvMetricsDocumentIntakeCapabilities();

  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4"
      id="pvmetrics-document-intake-roadmap-card"
    >
      <div className="border-b border-gray-800 pb-3">
        <p className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-400">
          DOCUMENT INTAKE ROADMAP
        </p>
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-tight flex items-center gap-2 mt-1">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          Soporte Seguro TXT / DOCX / PDF
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-sans">
          La fase actual permite TXT local. Word y PDF quedan preparados como soporte futuro, sin OCR, sin backend y sin envío a servicios externos.
        </p>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {capabilities.map((capability) => {
          let statusBadgeColor = 'bg-slate-950 text-gray-500 border-gray-900';
          if (capability.supportStatus === 'supported-now') {
            statusBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
          } else if (capability.supportStatus === 'planned-requires-library' || capability.supportStatus === 'planned-safe-local') {
            statusBadgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
          } else if (capability.supportStatus === 'blocked-in-current-phase' || capability.supportStatus === 'unsupported') {
            statusBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
          }

          return (
            <div
              key={capability.fileKind}
              className="bg-slate-950 border border-gray-850 rounded-lg p-3.5 space-y-2.5 hover:border-gray-800 transition"
            >
              <div className="flex items-center justify-between gap-2 border-b border-gray-900 pb-1.5">
                <span className="font-mono font-bold text-xs text-slate-100">
                  {capability.label}
                </span>
                <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border uppercase ${statusBadgeColor}`}>
                  {statusLabel[capability.supportStatus]}
                </span>
              </div>

              <div className="space-y-1 text-[11px] font-sans">
                <p className="text-gray-300 leading-normal">
                  <strong className="text-[10px] font-mono text-gray-400 uppercase block">Actual:</strong>
                  {capability.currentBehavior}
                </p>

                <p className="text-emerald-400 leading-normal">
                  <strong className="text-[10px] font-mono text-emerald-500 uppercase block mt-1">Siguiente fase:</strong>
                  {capability.futureBehavior}
                </p>
              </div>

              <div className="pt-1.5 border-t border-gray-900/60">
                <span className="text-[9px] font-mono text-gray-500 block uppercase font-bold mb-1">
                  Limitaciones / Control de riesgo:
                </span>
                <ul className="space-y-0.5 text-[10px] text-gray-400 list-disc pl-3.5 leading-snug">
                  {capability.limitations.map((limitation, i) => (
                    <li key={i}>{limitation}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
