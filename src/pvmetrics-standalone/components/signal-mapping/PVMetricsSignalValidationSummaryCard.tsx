import React from 'react';
import { PVMetricsExpectedSignal } from '../../types/pvmetrics-signal-mapping.types';
import { AlertTriangle, ShieldCheck, Heart, Power, HelpCircle } from 'lucide-react';

type PVMetricsSignalValidationSummaryCardProps = {
  signals: PVMetricsExpectedSignal[];
};

export const PVMetricsSignalValidationSummaryCard: React.FC<PVMetricsSignalValidationSummaryCardProps> = ({ signals }) => {
  const total = signals.length;

  const validationGroups = {
    valid: signals.filter((signal) => signal.validationStatus === 'valid').length,
    warning: signals.filter((signal) => signal.validationStatus === 'warning').length,
    missing: signals.filter((signal) => signal.validationStatus === 'missing').length,
    outOfRange: signals.filter((signal) => signal.validationStatus === 'out-of-range').length,
    stale: signals.filter((signal) => signal.validationStatus === 'stale').length,
    unitMismatch: signals.filter((signal) => signal.validationStatus === 'unit-mismatch').length,
    notTested: signals.filter((signal) => signal.validationStatus === 'not-tested').length,
  };

  const criticalityGroups = {
    low: signals.filter((signal) => signal.criticality === 'low').length,
    medium: signals.filter((signal) => signal.criticality === 'medium').length,
    high: signals.filter((signal) => signal.criticality === 'high').length,
    critical: signals.filter((signal) => signal.criticality === 'critical').length,
  };

  const criticalNotReady = signals.filter(
    (signal) =>
      signal.criticality === 'critical' &&
      signal.validationStatus !== 'valid',
  );

  const getPercent = (count: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="signal-validation-summary">
      {/* Col 1: Estado de Validación */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ESTADOS DE VALIDACIÓN (READINESS)
        </h3>
        <div className="space-y-3">
          {/* Válida */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>VÁLIDA ({validationGroups.valid})</span>
              <span>{getPercent(validationGroups.valid)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${getPercent(validationGroups.valid)}%` }} />
            </div>
          </div>
          {/* Advertencia & Obsolescencia & Desajuste de Unidad */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>ADVERTENCIA / OBSOLETA ({validationGroups.warning + validationGroups.stale + validationGroups.unitMismatch})</span>
              <span>{getPercent(validationGroups.warning + validationGroups.stale + validationGroups.unitMismatch)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${getPercent(validationGroups.warning + validationGroups.stale + validationGroups.unitMismatch)}%` }} />
            </div>
          </div>
          {/* Ausente & Fuera de Rango */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>AUSENTE / FUERA DE RANGO ({validationGroups.missing + validationGroups.outOfRange})</span>
              <span>{getPercent(validationGroups.missing + validationGroups.outOfRange)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${getPercent(validationGroups.missing + validationGroups.outOfRange)}%` }} />
            </div>
          </div>
          {/* No Probada */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>NO PROBADA ({validationGroups.notTested})</span>
              <span>{getPercent(validationGroups.notTested)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-600 rounded-full" style={{ width: `${getPercent(validationGroups.notTested)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Col 2: Distribución por Criticidad */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl">
        <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-4 flex items-center gap-2">
          <Power className="w-4 h-4 text-cyan-400" />
          CRITICIDAD OPERACIONAL
        </h3>
        <div className="space-y-3">
          {/* Crítica */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>CRÍTICA ({criticalityGroups.critical})</span>
              <span>{getPercent(criticalityGroups.critical)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${getPercent(criticalityGroups.critical)}%` }} />
            </div>
          </div>
          {/* Alta */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>ALTA ({criticalityGroups.high})</span>
              <span>{getPercent(criticalityGroups.high)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${getPercent(criticalityGroups.high)}%` }} />
            </div>
          </div>
          {/* Media */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>MEDIA ({criticalityGroups.medium})</span>
              <span>{getPercent(criticalityGroups.medium)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${getPercent(criticalityGroups.medium)}%` }} />
            </div>
          </div>
          {/* Baja */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1 font-mono">
              <span>BAJA ({criticalityGroups.low})</span>
              <span>{getPercent(criticalityGroups.low)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-600 rounded-full" style={{ width: `${getPercent(criticalityGroups.low)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Col 3: Alertas Críticas No Mapeadas */}
      <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-200 tracking-wider uppercase mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            CONTROL DE RIESGO DE SEÑALES
          </h3>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
            Señales etiquetadas como <strong className="text-red-400">CRÍTICA</strong> que aún no están validadas u homologadas con datos del cliente.
          </p>
          
          {criticalNotReady.length > 0 ? (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {criticalNotReady.map((sig) => (
                <div key={sig.id} className="p-1.5 bg-gray-950 border border-red-500/10 rounded flex items-center justify-between text-[10px] font-mono">
                  <span className="text-gray-300 truncate max-w-[130px]">{sig.name}</span>
                  <span className="text-red-400 uppercase text-[8px] bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 font-bold">
                    {sig.validationStatus === 'missing' ? 'AUSENTE' : 'NO PROBADA'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-2.5 text-[10px] text-emerald-400 font-mono">
              <Heart className="w-4 h-4" />
              <span>Todas las señales críticas están mapeadas y validadas correctamente.</span>
            </div>
          )}
        </div>
        <div className="text-[9px] text-gray-500 font-mono mt-3 text-right">
          Total de señales críticas evaluadas: {criticalityGroups.critical}
        </div>
      </div>
    </div>
  );
};
