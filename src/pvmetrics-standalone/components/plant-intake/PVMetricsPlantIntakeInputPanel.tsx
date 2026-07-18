import React, { useRef } from 'react';
import { Play, Upload, FileType, Info, FileWarning } from 'lucide-react';
import { validatePvMetricsDocumentIntakeFile } from '../../data/validatePvMetricsDocumentIntakeFile';
import { PVMetricsDocumentIntakeValidationResult } from '../../types/pvmetrics-document-intake.types';

type PVMetricsPlantIntakeInputPanelProps = {
  rawText: string;
  sourceLabel: string;
  onRawTextChange: (value: string) => void;
  onSourceLabelChange: (value: string) => void;
  onParse: () => void;
  onLoadTxt: (file: File, text: string) => void;
  onFileGuardResult: (result: PVMetricsDocumentIntakeValidationResult) => void;
};

export const PVMetricsPlantIntakeInputPanel: React.FC<
  PVMetricsPlantIntakeInputPanelProps
> = ({
  rawText,
  sourceLabel,
  onRawTextChange,
  onSourceLabelChange,
  onParse,
  onLoadTxt,
  onFileGuardResult,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validatePvMetricsDocumentIntakeFile(file);
    onFileGuardResult(validation);

    if (!validation.canReadTextNow) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const text = await file.text();
      onLoadTxt(file, text);
    } catch (err) {
      console.error('Error al cargar archivo local:', err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4"
      id="pvmetrics-plant-intake-input-panel"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileType className="w-5 h-5 text-cyan-400" />
          Especificaciones de la Planta
        </h3>

        {/* Text File Upload Trigger */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.docx,.pdf"
            className="hidden"
            id="plant-intake-txt-uploader"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Cargar .txt Local
          </button>
        </div>
      </div>

      {/* Origin Name Label */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
          Nombre de Origen / Identificador Ficha:
        </label>
        <input
          type="text"
          value={sourceLabel}
          onChange={(e) => onSourceLabelChange(e.target.value)}
          placeholder="E.g. Correo comercial Cliente Solar, Especificación técnica.txt"
          className="w-full bg-slate-950 border border-gray-850 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Main Raw Text Area */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">
            Contenido Técnico / Estructurado (Pegar texto):
          </label>
          <span className="text-[10px] font-mono text-gray-500">
            {rawText.length} caracteres
          </span>
        </div>
        <textarea
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          placeholder="Pegue aquí el contenido técnico o use la plantilla..."
          className="w-full h-80 bg-slate-950 border border-gray-850 rounded-lg p-4 text-xs font-mono text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/50 resize-y"
        />
      </div>

      {/* Multi-Format Roadmap Warning */}
      <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded-lg flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
          <strong>Lectura Local Activa:</strong> En esta fase solo se permite lectura local de .txt. Para PDF o Word, pega aquí el texto ya extraído o usa el formato estructurado.
        </p>
      </div>

      <div className="p-3 bg-amber-950/10 border border-amber-500/10 rounded-lg flex items-start gap-2.5">
        <FileWarning className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
          <strong>Hoja de Ruta:</strong> El soporte nativo para importar y procesar directamente archivos .pdf y .docx se implementará de forma segura en las próximas iteraciones sin realizar OCR.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onParse}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 hover:border-cyan-400 text-white text-xs font-mono font-bold rounded-lg flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-950/10"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Analizar Texto Intake</span>
        </button>
      </div>
    </div>
  );
};
