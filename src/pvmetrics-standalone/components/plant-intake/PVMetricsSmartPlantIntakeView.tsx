import React, { useMemo, useState } from 'react';
import { parsePvMetricsPlantIntakeText } from '../../data/parsePvMetricsPlantIntakeText';
import { createPvMetricsDraftFromIntake } from '../../data/createPvMetricsDraftFromIntake';
import { PVMETRICS_PLANT_INTAKE_TEMPLATE_V1 } from '../../data/pvMetricsPlantIntakeTemplate';
import { PVMetricsPlantIntakeParsedResult } from '../../types/pvmetrics-plant-intake.types';
import { PVMetricsPlantConfiguratorDraft } from '../../types/pvmetrics-plant-configurator.types';
import { PVMetricsPlantIntakeInputPanel } from './PVMetricsPlantIntakeInputPanel';
import { PVMetricsPlantIntakeParsedFieldsTable } from './PVMetricsPlantIntakeParsedFieldsTable';
import { PVMetricsPlantIntakeValidationCard } from './PVMetricsPlantIntakeValidationCard';
import { PVMetricsPlantIntakeTemplateCard } from './PVMetricsPlantIntakeTemplateCard';
import { PVMetricsPlantIntakeSecurityNote } from './PVMetricsPlantIntakeSecurityNote';
import { PVMetricsDocumentIntakeValidationResult } from '../../types/pvmetrics-document-intake.types';
import { PVMetricsDocumentIntakeRoadmapCard } from './PVMetricsDocumentIntakeRoadmapCard';
import { PVMetricsDocumentIntakeFileGuardCard } from './PVMetricsDocumentIntakeFileGuardCard';
import { evaluatePvMetricsDocumentExtractor } from '../../data/evaluatePvMetricsDocumentExtractor';
import { PVMetricsDocumentExtractorEvaluationCard } from './PVMetricsDocumentExtractorEvaluationCard';
import { Sparkles, ArrowRightLeft } from 'lucide-react';

type PVMetricsSmartPlantIntakeViewProps = {
  onApplyDraft: (draft: PVMetricsPlantConfiguratorDraft) => void;
};

export const PVMetricsSmartPlantIntakeView: React.FC<
  PVMetricsSmartPlantIntakeViewProps
> = ({ onApplyDraft }) => {
  const [rawText, setRawText] = useState(PVMETRICS_PLANT_INTAKE_TEMPLATE_V1);
  const [sourceLabel, setSourceLabel] = useState('Plant Intake manual');
  const [parsedResult, setParsedResult] =
    useState<PVMetricsPlantIntakeParsedResult | null>(null);
  const [lastAppliedLabel, setLastAppliedLabel] = useState('');
  const [fileGuardResult, setFileGuardResult] =
    useState<PVMetricsDocumentIntakeValidationResult | null>(null);

  const extractorEvaluation = useMemo(
    () =>
      fileGuardResult
        ? evaluatePvMetricsDocumentExtractor(fileGuardResult.fileKind)
        : null,
    [fileGuardResult],
  );

  const draftPreview = useMemo(() => {
    if (!parsedResult || !parsedResult.canCreateDraft) return null;
    return createPvMetricsDraftFromIntake(parsedResult);
  }, [parsedResult]);

  const handleParse = () => {
    const result = parsePvMetricsPlantIntakeText({
      rawText,
      sourceFileType: 'manual-paste',
      sourceLabel,
    });

    setParsedResult(result);
    setLastAppliedLabel('');
  };

  const handleLoadTxt = async (file: File, text: string) => {
    setRawText(text);
    setSourceLabel(file.name);

    const result = parsePvMetricsPlantIntakeText({
      rawText: text,
      sourceFileType: 'txt',
      sourceLabel: file.name,
    });

    setParsedResult(result);
    setLastAppliedLabel('');
  };

  const handleApplyDraft = () => {
    if (!draftPreview) return;

    onApplyDraft(draftPreview);
    setLastAppliedLabel(
      `Borrador de "${draftPreview.plantName || 'Sin Nombre'}" cargado con éxito. Redirigiendo al configurador...`
    );
  };

  return (
    <div className="space-y-6" id="pvmetrics-smart-plant-intake-view">
      {/* Title & Subtitle Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Módulo 1O-C.1 & C.2
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              Smart Plant Intake
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" /> SMART PLANT INTAKE
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            Agrega plantas FV o FV+BESS desde texto técnico estructurado, archivo .txt local o plantilla ORBI Plant Intake v1.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
            LOCAL PARSER
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-cyan-400 uppercase">
            TXT READY
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-amber-500 uppercase">
            PDF/DOCX FUTURE
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-red-400 uppercase">
            NO STORAGE
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400 uppercase">
            READ-ONLY FIRST
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Side: Input panel & extracted fields preview */}
        <div className="xl:col-span-2 space-y-6">
          <PVMetricsPlantIntakeInputPanel
            rawText={rawText}
            sourceLabel={sourceLabel}
            onRawTextChange={setRawText}
            onSourceLabelChange={setSourceLabel}
            onParse={handleParse}
            onLoadTxt={handleLoadTxt}
            onFileGuardResult={setFileGuardResult}
          />

          <PVMetricsPlantIntakeParsedFieldsTable parsedResult={parsedResult} />
        </div>

        {/* Right Side: Validation status, Official Templates & Safety limits */}
        <div className="xl:col-span-1 space-y-6">
          <PVMetricsDocumentIntakeFileGuardCard validationResult={fileGuardResult} />
          <PVMetricsDocumentExtractorEvaluationCard evaluation={extractorEvaluation} />
          <PVMetricsDocumentIntakeRoadmapCard />

          <PVMetricsPlantIntakeValidationCard
            parsedResult={parsedResult}
            draftPreview={draftPreview}
            onApplyDraft={handleApplyDraft}
            lastAppliedLabel={lastAppliedLabel}
          />

          <PVMetricsPlantIntakeTemplateCard
            templateText={PVMETRICS_PLANT_INTAKE_TEMPLATE_V1}
            onUseTemplate={() => {
              setRawText(PVMETRICS_PLANT_INTAKE_TEMPLATE_V1);
              setSourceLabel('Plant Intake v1 template');
              setParsedResult(null);
              setLastAppliedLabel('');
            }}
          />

          <PVMetricsPlantIntakeSecurityNote />
        </div>
      </div>
    </div>
  );
};
