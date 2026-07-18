import React from 'react';
import { PVMetricsDocumentExtractorEvaluation } from '../../types/pvmetrics-document-extractor-evaluation.types';
import { ShieldAlert, CheckCircle2, AlertTriangle, Compass, ClipboardCheck, Play } from 'lucide-react';

type PVMetricsDocumentExtractorEvaluationCardProps = {
  evaluation: PVMetricsDocumentExtractorEvaluation | null;
};

const readinessLabel = {
  'ready-now': 'Disponible ahora',
  'safe-to-evaluate': 'Seguro para evaluar',
  'requires-library-review': 'Requiere evaluación de librería',
  'requires-ocr-future': 'Requiere OCR futuro',
  blocked: 'Bloqueado',
};

const riskLabel = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
  blocked: 'Bloqueado',
};

export const PVMetricsDocumentExtractorEvaluationCard: React.FC<
  PVMetricsDocumentExtractorEvaluationCardProps
> = ({ evaluation }) => {
  if (!evaluation) {
    return (
      <div
        className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-2.5"
        id="pvmetrics-document-extractor-evaluation-empty"
      >
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-gray-500" />
          <p className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-gray-400">
            EXTRACTOR EVALUATION
          </p>
        </div>
        <p className="text-xs text-gray-500 font-sans leading-normal">
          Seleccione o cargue un archivo arriba para evaluar su compatibilidad técnica, matriz de riesgos y el roadmap de extracción local correspondiente.
        </p>
      </div>
    );
  }

  // Visual highlights based on risk
  let riskColor = 'text-gray-400 bg-slate-950 border-gray-900';
  let riskIconColor = 'text-gray-400';
  if (evaluation.riskLevel === 'low') {
    riskColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    riskIconColor = 'text-emerald-400';
  } else if (evaluation.riskLevel === 'medium') {
    riskColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    riskIconColor = 'text-cyan-400';
  } else if (evaluation.riskLevel === 'high') {
    riskColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    riskIconColor = 'text-amber-400';
  } else if (evaluation.riskLevel === 'blocked') {
    riskColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    riskIconColor = 'text-rose-400';
  }

  let readinessColor = 'bg-slate-950 text-gray-400 border-gray-900';
  if (evaluation.readinessStatus === 'ready-now') {
    readinessColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (evaluation.readinessStatus === 'requires-library-review') {
    readinessColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  } else if (evaluation.readinessStatus === 'blocked') {
    readinessColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  }

  return (
    <div
      className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4"
      id="pvmetrics-document-extractor-evaluation-card"
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="space-y-1">
          <p className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-400">
            EXTRACTOR EVALUATION
          </p>
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            {evaluation.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border uppercase ${readinessColor}`}>
            {readinessLabel[evaluation.readinessStatus]}
          </span>
          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border uppercase ${riskColor}`}>
            {riskLabel[evaluation.riskLevel]}
          </span>
        </div>
      </div>

      {/* Main Behaviors Info */}
      <div className="space-y-3">
        <p className="text-xs text-gray-400 font-sans leading-normal">
          {evaluation.currentPhaseBehavior}
        </p>

        {/* Recommended Approach Banner */}
        <div className="bg-slate-950 border border-gray-850 rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Enfoque Recomendado
          </span>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {evaluation.recommendedApproach}
          </p>
        </div>

        {/* Future Path Banner */}
        <div className="bg-slate-950 border border-gray-850 rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
            Plan de Implementación Futuro
          </span>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {evaluation.futureImplementationPath}
          </p>
        </div>
      </div>

      {/* Decision Gates Checklist */}
      <div className="space-y-2 pt-2 border-t border-gray-800/50">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
          Checklist de Decisión Técnica (Gates)
        </span>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {evaluation.decisionGates.map((gate) => {
            let gateBg = 'bg-slate-950 border-gray-850';
            let gateText = 'text-gray-400';
            let GateIcon = AlertTriangle;

            if (gate.passed) {
              gateBg = 'bg-emerald-950/5 border-emerald-900/20';
              gateText = 'text-emerald-400';
              GateIcon = CheckCircle2;
            } else if (gate.riskLevel === 'blocked') {
              gateBg = 'bg-rose-950/5 border-rose-900/20';
              gateText = 'text-rose-400';
              GateIcon = ShieldAlert;
            } else if (gate.riskLevel === 'high') {
              gateBg = 'bg-amber-950/5 border-amber-900/20';
              gateText = 'text-amber-400';
              GateIcon = AlertTriangle;
            }

            return (
              <div
                key={gate.id}
                className={`border rounded-lg p-3 flex flex-col justify-between space-y-1.5 transition ${gateBg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-100 leading-tight">
                    {gate.label}
                  </span>
                  <GateIcon className={`w-4 h-4 shrink-0 ${gateText}`} />
                </div>
                <p className="text-[10px] text-gray-400 leading-snug font-sans">
                  {gate.note}
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-gray-900/40 mt-1">
                  <span className="text-gray-500 uppercase">Impacto:</span>
                  <span className={`uppercase font-bold ${gateText}`}>{gate.riskLevel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Limitations List */}
      <div className="space-y-1.5 pt-2 border-t border-gray-800/50 text-[11px] font-sans">
        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
          Limitaciones de Diseño Críticas
        </span>
        <ul className="space-y-1 text-gray-400 list-disc pl-4 leading-normal">
          {evaluation.limitations.map((limitation, i) => (
            <li key={i}>{limitation}</li>
          ))}
        </ul>
      </div>

      {/* Security Boundaries Alert */}
      <div className="bg-amber-950/10 border border-amber-500/10 rounded-lg p-3 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">
            Límite Seguro (Safety Boundary)
          </span>
          <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
            {evaluation.safetyBoundary}
          </p>
        </div>
      </div>
    </div>
  );
};
