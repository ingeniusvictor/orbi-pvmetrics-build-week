import React, { useState } from 'react';
import { PVMetricsClientValidationRequestPack } from '../../types/pvmetrics-client-validation-request.types';
import { Copy, Check, MessageSquare, ListTodo, AlertTriangle } from 'lucide-react';

type PVMetricsClientValidationRequestExportBoxProps = {
  pack: PVMetricsClientValidationRequestPack;
};

export const PVMetricsClientValidationRequestExportBox: React.FC<
  PVMetricsClientValidationRequestExportBoxProps
> = ({ pack }) => {
  const { clientMessageDraft, technicalChecklistText } = pack;
  const [copiedTarget, setCopiedTarget] = useState<'message' | 'checklist' | null>(null);

  const handleCopy = async (target: 'message' | 'checklist', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <div
      className="p-6 bg-gray-900 border border-gray-800 rounded-xl space-y-6"
      id="pvmetrics-client-validation-request-export-box"
    >
      <div className="border-b border-gray-800 pb-3">
        <h4 className="text-xs font-bold text-gray-200 font-mono tracking-wider uppercase flex items-center gap-2">
          📤 Copiar y Compartir (Request Export Hub)
        </h4>
        <p className="text-xs text-gray-400 mt-1">
          Copie el borrador de correo para el cliente o el checklist técnico detallado en un solo clic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Message Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Mensaje para Cliente
            </span>
            <button
              onClick={() => handleCopy('message', clientMessageDraft)}
              className="px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-950 hover:bg-slate-900 text-gray-300 rounded border border-gray-800 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {copiedTarget === 'message' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Mensaje</span>
                </>
              )}
            </button>
          </div>

          <textarea
            readOnly
            value={clientMessageDraft}
            className="w-full h-64 p-4 bg-slate-950 border border-gray-850 rounded-lg text-xs font-sans text-gray-300 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
          />
        </div>

        {/* Technical Checklist Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5" />
              Checklist Técnico Detallado
            </span>
            <button
              onClick={() => handleCopy('checklist', technicalChecklistText)}
              className="px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-950 hover:bg-slate-900 text-gray-300 rounded border border-gray-800 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {copiedTarget === 'checklist' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Checklist</span>
                </>
              )}
            </button>
          </div>

          <textarea
            readOnly
            value={technicalChecklistText}
            className="w-full h-64 p-4 bg-slate-950 border border-gray-850 rounded-lg text-xs font-mono text-gray-300 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Footnote / Verification */}
      <div className="pt-2 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        <span>Sin envío directo ni almacenamiento externo habilitados para resguardar la privacidad del activo.</span>
      </div>
    </div>
  );
};
