import React from 'react';
import { PVMetricsSignalQualityRule } from '../../types/pvmetrics-signal-quality-rules.types';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Flame } from 'lucide-react';

type PVMetricsSignalQualityRiskCardProps = {
  rules: PVMetricsSignalQualityRule[];
  riskScore: number;
};

export const PVMetricsSignalQualityRiskCard: React.FC<PVMetricsSignalQualityRiskCardProps> = ({ rules, riskScore }) => {
  const failedRules = rules.filter((r) => r.status === 'failed');
  const criticalNotReady = rules.filter((r) => r.severity === 'critical' && r.status !== 'passed');

  const getRiskColorClass = (score: number) => {
    if (score <= 25) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score <= 50) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (score <= 75) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getRiskAction = (score: number) => {
    if (score <= 25) return 'Mantener monitoreo demo.';
    if (score <= 50) return 'Revisar señales con advertencia.';
    if (score <= 75) return 'Preparar corrección de mapeo antes de piloto.';
    return 'No avanzar a piloto sin validación técnica.';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="signal-quality-risk-card-container">
      {/* Col 1: Riesgo Global Card */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Riesgo Operacional de Señales
            </h3>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskColorClass(riskScore)}`}>
              {riskScore <= 25 ? 'BAJO' : riskScore <= 50 ? 'MEDIO' : riskScore <= 75 ? 'ALTO' : 'CRÍTICO'}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-shrink-0 w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-pulse" />
              <span className="text-xl font-bold text-white font-mono">{riskScore}%</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wide">Acción Recomendada:</span>
              <p className="text-xs text-white font-semibold mt-0.5">{getRiskAction(riskScore)}</p>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            El índice de riesgo es una evaluación local simulada basada en reglas de calidad, criticidad y estado de validación. No representa una conexión real a planta.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800/60 text-[9px] font-mono text-gray-500 flex justify-between">
          <span>Metodología Orbi Risk Index</span>
          <span>Sovereign Safe Mode</span>
        </div>
      </div>

      {/* Col 2: Alertas Críticas de Seguridad */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            READINESS CRÍTICA ({criticalNotReady.length})
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
            Señales operacionales de alta prioridad o críticas que presentan alguna inconformidad en el catálogo.
          </p>

          {criticalNotReady.length > 0 ? (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {criticalNotReady.map((rule) => (
                <div key={rule.id} className="p-2 bg-gray-950 border border-red-500/10 rounded flex items-center justify-between text-[10px] font-mono">
                  <div className="truncate pr-2">
                    <span className="text-gray-300 block truncate">{rule.signalName}</span>
                    <span className="text-[8px] text-gray-500 truncate">{rule.tagKey}</span>
                  </div>
                  <span className="text-rose-400 uppercase text-[8px] bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-bold flex-shrink-0">
                    {rule.status === 'failed' ? 'FALLIDA' : 'WARNING'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-3 text-xs text-emerald-400 font-mono">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Excelente. Todas las reglas de señales críticas están en estado verde.</span>
            </div>
          )}
        </div>
        <div className="text-[9px] text-gray-500 font-mono text-right mt-2">
          Gobernanza de Control de Activos
        </div>
      </div>

      {/* Col 3: Estado de Autenticación & Control Local */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            DIAGNÓSTICO DEL MOTOR DE REGLAS
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
            Garantías operacionales vigentes para el desarrollo del algoritmo sin impactar la planta productiva real:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Aislamiento Sandbox Total</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Modelado Lógico Offline</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Zero-Risk EMS & Inverter State</span>
            </div>
          </div>
        </div>
        <div className="p-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-lg text-[9px] text-gray-400 leading-normal mt-3">
          El 100% de los incidentes detectados son sintéticos para evaluar la resiliencia del software.
        </div>
      </div>
    </div>
  );
};
