import React from 'react';
import { PVMetricsReadinessMatrixRow } from '../../types/pvmetrics-readiness-matrix.types';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Flame, ShieldCheck, HelpCircle } from 'lucide-react';

type PVMetricsReadinessRiskSummaryCardProps = {
  rows: PVMetricsReadinessMatrixRow[];
};

export const PVMetricsReadinessRiskSummaryCard: React.FC<PVMetricsReadinessRiskSummaryCardProps> = ({ rows }) => {
  const lowRisk = rows.filter((row) => row.riskLevel === 'low').length;
  const mediumRisk = rows.filter((row) => row.riskLevel === 'medium').length;
  const highRisk = rows.filter((row) => row.riskLevel === 'high').length;
  const criticalRisk = rows.filter((row) => row.riskLevel === 'critical').length;

  const criticalBlocked = rows.filter(
    (row) =>
      row.signalCriticality === 'critical' &&
      (row.readinessStatus === 'blocked' || row.readinessStatus === 'not-ready')
  );

  const pendingApproval = rows.filter(
    (row) => row.authorizationStatus === 'pending-client-approval'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="readiness-risk-summary-card">
      {/* Col 1: Distribución por Riesgo */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Distribución de Riesgo de Señales
          </h3>

          <div className="space-y-3">
            {/* Critical */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  CRÍTICO
                </span>
                <span>{criticalRisk} señales</span>
              </div>
              <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full" 
                  style={{ width: `${rows.length ? (criticalRisk / rows.length) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-amber-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  ALTO
                </span>
                <span>{highRisk} señales</span>
              </div>
              <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${rows.length ? (highRisk / rows.length) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  MEDIO
                </span>
                <span>{mediumRisk} señales</span>
              </div>
              <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full" 
                  style={{ width: `${rows.length ? (mediumRisk / rows.length) * 100 : 0}%` }} 
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  BAJO
                </span>
                <span>{lowRisk} señales</span>
              </div>
              <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full" 
                  style={{ width: `${rows.length ? (lowRisk / rows.length) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 leading-normal mt-4 italic">
          El riesgo se evalúa según la calidad operacional de la señal combinada con el nivel de autorización y criticidad.
        </p>
      </div>

      {/* Col 2: Señales Críticas en Riesgo */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Señales Críticas Bloqueadas / No Listas ({criticalBlocked.length})
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
            Estas señales deben ser priorizadas y autorizadas antes de avanzar con cualquier fase de piloto:
          </p>

          {criticalBlocked.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {criticalBlocked.map((row) => (
                <div key={row.id} className="p-2 bg-gray-950 border border-red-500/10 rounded flex items-center justify-between text-[10px] font-mono">
                  <div className="truncate pr-2">
                    <span className="text-gray-300 block truncate">{row.signalName}</span>
                    <span className="text-[8px] text-gray-500 truncate">{row.tagKey}</span>
                  </div>
                  <span className="text-rose-400 uppercase text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold">
                    {row.readinessStatus.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-2.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>Ninguna señal crítica bloqueada o fuera de servicio.</span>
            </div>
          )}
        </div>

        <span className="text-[9px] text-gray-500 font-mono text-right mt-2">
          Garantía de Control Activo
        </span>
      </div>

      {/* Col 3: Autorizaciones Pendientes */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Fuentes Pendientes de Aprobación ({pendingApproval.length})
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
            Canales de datos que necesitan el consentimiento formal del cliente para integrarse en modo Read-Only:
          </p>

          {pendingApproval.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {pendingApproval.map((row) => (
                <div key={row.id} className="p-2 bg-gray-950 border border-yellow-500/10 rounded flex items-center justify-between text-[10px] font-mono">
                  <div className="truncate pr-2">
                    <span className="text-gray-300 block truncate">{row.signalName}</span>
                    <span className="text-[8px] text-cyan-500 truncate">{row.sourceName}</span>
                  </div>
                  <span className="text-amber-400 uppercase text-[8px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                    PENDIENTE
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-2.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>Todas las fuentes requeridas cuentan con autorización simulada.</span>
            </div>
          )}
        </div>

        <span className="text-[9px] text-gray-500 font-mono text-right mt-2">
          Gobernanza de Datos Locales
        </span>
      </div>
    </div>
  );
};
