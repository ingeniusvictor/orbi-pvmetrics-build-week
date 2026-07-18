import React from 'react';
import { PVMetricsPlantIntakeParsedResult } from '../../types/pvmetrics-plant-intake.types';
import { PVMetricsPlantConfiguratorDraft } from '../../types/pvmetrics-plant-configurator.types';
import { ClipboardCheck, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';

type PVMetricsPlantIntakeValidationCardProps = {
  parsedResult: PVMetricsPlantIntakeParsedResult | null;
  draftPreview: PVMetricsPlantConfiguratorDraft | null;
  onApplyDraft: () => void;
  lastAppliedLabel: string;
};

export const PVMetricsPlantIntakeValidationCard: React.FC<
  PVMetricsPlantIntakeValidationCardProps
> = ({ parsedResult, draftPreview, onApplyDraft, lastAppliedLabel }) => {
  if (!parsedResult) {
    return (
      <div
        className="bg-slate-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500 space-y-2"
        id="pvmetrics-plant-intake-validation-card-empty"
      >
        <ClipboardCheck className="w-8 h-8 mx-auto text-gray-700" />
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400">
          Validación &amp; Draft Preview
        </h3>
        <p className="text-xs text-gray-500">
          Analice un texto para visualizar el estado de completitud, advertencias y previsualizar la conversión técnica.
        </p>
      </div>
    );
  }

  const {
    missingRequiredFields,
    warnings,
    canCreateDraft,
    canRequestValidation,
  } = parsedResult;

  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-5"
      id="pvmetrics-plant-intake-validation-card"
    >
      <div className="border-b border-gray-800 pb-3">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-cyan-400" />
          Análisis del Intake &amp; Validación
        </h3>
      </div>

      {/* Warnings & Missing Fields Section */}
      <div className="space-y-3">
        {missingRequiredFields.length > 0 && (
          <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Campos Obligatorios Faltantes ({missingRequiredFields.length})
            </div>
            <ul className="list-disc pl-5 text-[11px] text-gray-300 space-y-1 font-sans">
              {missingRequiredFields.map((field) => (
                <li key={field}>
                  Campo <span className="font-semibold text-rose-300">{field}</span> no detectado o vacío.
                </li>
              ))}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="p-3 bg-amber-950/15 border border-amber-500/20 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Advertencias del Analizador ({warnings.length})
            </div>
            <ul className="list-disc pl-5 text-[11px] text-gray-300 space-y-1 font-sans">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {missingRequiredFields.length === 0 && warnings.length === 0 && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-emerald-400 font-mono text-xs font-bold uppercase">
                Intake Completo
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Todos los campos requeridos para el perfil seleccionado han sido identificados con éxito.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Capabilities Checklist */}
      <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-gray-850">
        <div>
          <div className="text-[9px] font-mono text-gray-500 uppercase">
            Estado Conversión
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                canCreateDraft ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-xs font-mono font-bold text-white uppercase">
              {canCreateDraft ? 'Apto para Draft' : 'Borrador No Disponible'}
            </span>
          </div>
        </div>

        <div>
          <div className="text-[9px] font-mono text-gray-500 uppercase">
            Preparación Validación
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                canRequestValidation ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-mono font-bold text-white uppercase">
              {canRequestValidation ? 'Listo para Validar' : 'Borrador Pendiente'}
            </span>
          </div>
        </div>
      </div>

      {/* Technical Draft Preview */}
      {draftPreview && (
        <div className="space-y-3 pt-3 border-t border-gray-800">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Resumen del Borrador Generado
          </h4>

          <div className="bg-slate-950 rounded-lg border border-gray-850 overflow-hidden divide-y divide-gray-900 text-xs font-mono">
            <div className="px-3 py-2 flex justify-between">
              <span className="text-gray-500">Cliente:</span>
              <span className="text-white font-bold">{draftPreview.ownerName || '--'}</span>
            </div>
            <div className="px-3 py-2 flex justify-between">
              <span className="text-gray-500">Nombre Planta:</span>
              <span className="text-white font-bold">{draftPreview.plantName || '--'}</span>
            </div>
            <div className="px-3 py-2 flex justify-between">
              <span className="text-gray-500">Tecnología:</span>
              <span className="text-cyan-400 font-bold uppercase">{draftPreview.technology}</span>
            </div>
            <div className="px-3 py-2 flex justify-between">
              <span className="text-gray-500">Capacidad FV:</span>
              <span className="text-white font-bold">
                {draftPreview.pvCapacityDcMwp ?? '--'} MWp / {draftPreview.pvCapacityAcMw ?? '--'} MW
              </span>
            </div>

            {draftPreview.hasBess && (
              <>
                <div className="px-3 py-2 flex justify-between bg-cyan-950/10">
                  <span className="text-cyan-500">Capacidad BESS:</span>
                  <span className="text-cyan-400 font-bold">
                    {draftPreview.bessPowerMw ?? '--'} MW / {draftPreview.bessEnergyMwh ?? '--'} MWh
                  </span>
                </div>
                <div className="px-3 py-2 flex justify-between">
                  <span className="text-gray-500">Fuentes BESS:</span>
                  <span className="text-white text-[10px] truncate max-w-[160px]" title={draftPreview.bessTelemetrySourceLabel}>
                    T: {draftPreview.bessTelemetrySourceLabel || '--'}
                  </span>
                </div>
                <div className="px-3 py-2 flex justify-between">
                  <span className="text-gray-500">Medición BESS:</span>
                  <span className="text-white text-[10px] truncate max-w-[160px]" title={draftPreview.bessMeasurementSourceLabel}>
                    M: {draftPreview.bessMeasurementSourceLabel || '--'}
                  </span>
                </div>
              </>
            )}

            <div className="px-3 py-2">
              <span className="text-gray-500 block mb-1">Estado Source-of-Truth:</span>
              <p className="text-[10px] text-amber-500 leading-snug italic">
                {draftPreview.sourceOfTruthLabel}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advisory Note */}
      <div className="p-3 bg-slate-950 rounded-lg border border-gray-850 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
          El draft aplicado no queda validado ni guardado. Debe ser revisado manualmente antes de cualquier uso técnico o propuesta de piloto.
        </p>
      </div>

      {/* Action Button */}
      <div className="space-y-2">
        <button
          onClick={onApplyDraft}
          disabled={!canCreateDraft || !draftPreview}
          className={`w-full py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition ${
            canCreateDraft && draftPreview
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500 cursor-pointer'
              : 'bg-slate-950 border border-gray-900 text-gray-600 cursor-not-allowed'
          }`}
        >
          <span>Aplicar Draft al Configurador</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {lastAppliedLabel && (
          <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold text-center rounded">
            ✓ {lastAppliedLabel}
          </div>
        )}
      </div>
    </div>
  );
};
