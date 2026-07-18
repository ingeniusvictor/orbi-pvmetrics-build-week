import React from 'react';
import { PVMetricsClientValidationGate } from '../../types/pvmetrics-client-validation.types';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react';

type PVMetricsSourceOfTruthChecklistCardProps = {
  gate: PVMetricsClientValidationGate;
};

const evidenceTypeLabels: Record<string, string> = {
  'technical-datasheet': 'Ficha Técnica',
  'single-line-diagram': 'Diagrama Unilineal',
  'inverter-list': 'Lista de Inversores',
  'metering-document': 'Doc. Medidor principal',
  'scada-tag-list': 'Listado de Tags SCADA',
  'weather-source': 'Estación/API Meteo',
  'bess-ems-document': 'Ficha EMS/BESS',
  'bess-meter-document': 'Medidor BESS/POI',
  'client-email-confirmation': 'Confirmación Email',
  'manual-entry': 'Ingreso Manual',
  'demo-placeholder': 'Marcador Demo',
};

const statusLabels: Record<string, string> = {
  validated: 'Validado',
  'pending-client': 'Pendiente cliente',
  missing: 'Faltante',
  'demo-only': 'Demo',
  'not-required': 'No requerido',
};

export const PVMetricsSourceOfTruthChecklistCard: React.FC<
  PVMetricsSourceOfTruthChecklistCardProps
> = ({ gate }) => {
  const { checks } = gate;

  return (
    <div
      className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-4"
      id="pvmetrics-source-of-truth-checklist-card"
    >
      <div className="border-b border-gray-800 pb-3">
        <h4 className="text-xs font-bold text-gray-200 font-mono tracking-wider uppercase flex items-center gap-2">
          📄 Checklist de Respaldo (Source-of-Truth Checklist)
        </h4>
        <p className="text-xs text-gray-400 mt-1">
          Detalle y trazabilidad de cada dato ingresado respecto a su origen documental y viabilidad para el piloto read-only.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[10px] font-mono font-extrabold text-gray-500 uppercase tracking-wider">
              <th className="py-2.5 px-3">Dato Evaluado</th>
              <th className="py-2.5 px-3">Evidencia Requerida</th>
              <th className="py-2.5 px-3">Estado</th>
              <th className="py-2.5 px-3">Piloto Read-Only</th>
              <th className="py-2.5 px-3">Nota Actual</th>
              <th className="py-2.5 px-3">Recomendación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40 text-xs font-sans">
            {checks.map((check) => {
              // Get status badge styles
              let statusBadgeStyle = 'bg-slate-950 text-gray-400 border-gray-800';
              let StatusIcon = HelpCircle;

              if (check.status === 'validated') {
                statusBadgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                StatusIcon = CheckCircle2;
              } else if (check.status === 'pending-client') {
                statusBadgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                StatusIcon = AlertTriangle;
              } else if (check.status === 'missing') {
                statusBadgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                StatusIcon = XCircle;
              } else if (check.status === 'not-required') {
                statusBadgeStyle = 'bg-gray-800/40 text-gray-500 border-transparent';
              }

              // Blocks pilot badge
              const isBlocking =
                check.blocksReadonlyPilot &&
                (check.status === 'missing' ||
                  check.status === 'pending-client' ||
                  check.status === 'demo-only');

              return (
                <tr
                  key={check.id}
                  className="hover:bg-slate-950/20 transition-colors"
                  id={`sot-check-${check.id}`}
                >
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    {check.label}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {evidenceTypeLabels[check.evidenceType] || check.evidenceType}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono inline-flex items-center gap-1 uppercase ${statusBadgeStyle}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusLabels[check.status] || check.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {check.blocksReadonlyPilot ? (
                      isBlocking ? (
                        <span className="px-2 py-0.5 rounded border border-rose-500/20 text-rose-400 bg-rose-500/10 text-[9px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 animate-pulse" />
                          BLOQUEA READ-ONLY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400 bg-emerald-500/10 text-[9px] font-mono uppercase tracking-wider">
                          APROBADO PILOTO
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono">No Crítico</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-[180px] truncate" title={check.note}>
                    {check.note}
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-[11px] leading-relaxed max-w-[220px]">
                    {check.recommendation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
