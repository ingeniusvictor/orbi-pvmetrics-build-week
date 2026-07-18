import React from 'react';
import { PVMetricsDocumentIntakeValidationResult } from '../../types/pvmetrics-document-intake.types';
import { ShieldCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type PVMetricsDocumentIntakeFileGuardCardProps = {
  validationResult: PVMetricsDocumentIntakeValidationResult | null;
};

export const PVMetricsDocumentIntakeFileGuardCard: React.FC<
  PVMetricsDocumentIntakeFileGuardCardProps
> = ({ validationResult }) => {
  if (!validationResult) {
    return (
      <div
        className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-2.5"
        id="pvmetrics-document-intake-file-guard-empty"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-500" />
          <p className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-gray-400">
            FILE GUARD ACTIVE
          </p>
        </div>
        <p className="text-xs text-gray-500 font-sans leading-normal">
          Aún no se ha evaluado ningún archivo. TXT está permitido localmente; PDF y DOCX quedan como soporte futuro. Todos los análisis se ejecutan de forma segura en memoria local del cliente.
        </p>
      </div>
    );
  }

  const {
    fileName,
    fileKind,
    fileSizeKb,
    isAllowedInCurrentPhase,
    warning,
    recommendation,
  } = validationResult;

  let headerColor = 'text-amber-400';
  let bgColor = 'bg-amber-950/10 border-amber-500/20';
  let Icon = AlertTriangle;

  if (isAllowedInCurrentPhase) {
    headerColor = 'text-emerald-400';
    bgColor = 'bg-emerald-950/10 border-emerald-500/20';
    Icon = CheckCircle;
  } else if (fileKind === 'unknown') {
    headerColor = 'text-rose-400';
    bgColor = 'bg-rose-950/10 border-rose-500/20';
    Icon = AlertTriangle;
  }

  return (
    <div
      className={`border rounded-xl p-5 space-y-3.5 transition-colors ${bgColor}`}
      id="pvmetrics-document-intake-file-guard"
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-800/50 pb-2">
        <div className="flex items-start gap-2.5">
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${headerColor}`} />
          <div className="space-y-0.5">
            <p className={`text-[10px] font-mono font-extrabold uppercase tracking-wider ${headerColor}`}>
              FILE GUARD EVALUATION
            </p>
            <h4 className="text-xs font-mono font-bold text-white truncate max-w-[200px]" title={fileName}>
              {fileName}
            </h4>
            <p className="text-[10px] font-mono text-gray-400">
              Ext: <span className="uppercase text-slate-100 font-bold">{fileKind}</span> · Tamaño: <span className="text-slate-100 font-bold">{fileSizeKb} KB</span>
            </p>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
            isAllowedInCurrentPhase
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          }`}
        >
          {isAllowedInCurrentPhase ? 'Permitido ahora' : 'No permitido en esta fase'}
        </span>
      </div>

      <div className="space-y-2 font-sans text-xs">
        <p className="text-slate-200 leading-normal">
          <strong className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Resultado de Seguridad:</strong>
          {warning}
        </p>

        <p className="text-gray-300 leading-normal bg-slate-950/40 p-2.5 rounded-lg border border-gray-850">
          <strong className="text-[10px] font-mono text-amber-500 uppercase block mb-0.5">Recomendación:</strong>
          {recommendation}
        </p>
      </div>

      <div className="text-[10px] text-gray-400 italic">
        *Sovereign Safe Mode: Este validador opera 100% de manera offline en su navegador. Ningún documento o metadato se sube a Internet, no se usa backend y no hay persistencia externa.
      </div>
    </div>
  );
};
