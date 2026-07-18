import React from 'react';
import { PVMetricsPlantIntakeParsedResult } from '../../types/pvmetrics-plant-intake.types';
import { Table, Eye } from 'lucide-react';

type PVMetricsPlantIntakeParsedFieldsTableProps = {
  parsedResult: PVMetricsPlantIntakeParsedResult | null;
};

export const PVMetricsPlantIntakeParsedFieldsTable: React.FC<
  PVMetricsPlantIntakeParsedFieldsTableProps
> = ({ parsedResult }) => {
  if (!parsedResult) {
    return (
      <div
        className="bg-slate-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500 space-y-2"
        id="pvmetrics-plant-intake-parsed-fields-table-empty"
      >
        <Table className="w-8 h-8 mx-auto text-gray-700" />
        <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
          Aún no hay análisis
        </p>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Pegue texto técnico o cargue un archivo .txt en el panel de entrada y presione &quot;Analizar texto&quot; para visualizar los campos identificados.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl overflow-hidden space-y-4"
      id="pvmetrics-plant-intake-parsed-fields-table"
    >
      <div className="px-5 pt-5 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Campos Identificados ({parsedResult.fields.filter(f => f.normalizedValue).length} / {parsedResult.fields.length})
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-400 bg-slate-950 px-2 py-1 rounded border border-gray-850">
          Procedencia: {parsedResult.sourceLabel}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-gray-400 border-y border-gray-850">
            <tr>
              <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider">Campo</th>
              <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider">Valor Detectado</th>
              <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider">Requerido</th>
              <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider">Confianza</th>
              <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-850">
            {parsedResult.fields.map((field) => {
              const hasValue = !!field.normalizedValue;

              // Confidence badge color classes
              let confidenceClasses = 'bg-slate-950 text-gray-500 border-gray-900';
              if (field.confidence === 'high') {
                confidenceClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
              } else if (field.confidence === 'medium') {
                confidenceClasses = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
              } else if (field.confidence === 'low') {
                confidenceClasses = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
              } else if (field.confidence === 'missing') {
                confidenceClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
              }

              return (
                <tr
                  key={field.key}
                  className={`hover:bg-slate-950/45 transition ${
                    !hasValue && field.required ? 'bg-rose-950/5' : ''
                  }`}
                >
                  {/* Campo */}
                  <td className="px-5 py-2.5 font-sans font-semibold text-gray-200">
                    {field.label}
                  </td>

                  {/* Valor Detectado */}
                  <td className="px-5 py-2.5 max-w-[220px] truncate">
                    {hasValue ? (
                      <span className="text-white text-xs font-mono bg-slate-950 px-2 py-0.5 rounded border border-gray-850">
                        {field.rawValue}
                      </span>
                    ) : (
                      <span className="text-gray-600 italic text-[11px]">
                        -- vacío --
                      </span>
                    )}
                  </td>

                  {/* Requerido */}
                  <td className="px-5 py-2.5">
                    {field.required ? (
                      <span className="text-[10px] font-mono font-extrabold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                        SÍ
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-500">
                        No
                      </span>
                    )}
                  </td>

                  {/* Confianza */}
                  <td className="px-5 py-2.5">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border uppercase ${confidenceClasses}`}
                    >
                      {field.confidence}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-2.5">
                    {hasValue ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                        ✓ Detectado
                      </span>
                    ) : field.required ? (
                      <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">
                        ✗ Requerido Faltante
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-500 italic">
                        Opcional
                      </span>
                    )}
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
