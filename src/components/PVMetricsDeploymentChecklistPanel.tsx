import React, { useState } from 'react';
import { ClipboardCheck, Sparkles, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { PVMetricsDeploymentReadiness } from '../release/PVMetricsDeploymentReadiness';

export const PVMetricsDeploymentChecklistPanel: React.FC = () => {
  const [steps, setSteps] = useState(PVMetricsDeploymentReadiness);

  const toggleStep = (id: number) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const checkedCount = steps.filter(s => s.checked).length;
  const percent = Math.round((checkedCount / steps.length) * 100);

  return (
    <div id="deployment-checklist-panel" className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-amber-500" />
            Checklist de Despliegue & Preparación Operativa
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Control de pre-vuelo antes de la presentación con el equipo ejecutivo</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-mono font-bold">
            {percent}% LISTO
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-amber-500 h-full transition-all duration-500" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className="flex items-start gap-3 p-3 bg-gray-950 hover:bg-gray-850 border border-gray-850 rounded-lg text-left transition"
          >
            <div className="mt-0.5 text-amber-500 shrink-0">
              {step.checked ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-gray-600" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${step.checked ? 'text-gray-200 line-through' : 'text-white'}`}>
                  {step.stepName}
                </span>
                <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded border font-bold ${
                  step.category === 'técnico' 
                    ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
                    : step.category === 'seguridad' 
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {step.category}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 leading-normal">{step.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-[10px] text-gray-400 flex items-start gap-2 leading-relaxed">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span>
          <strong>Garantía de Demo:</strong> La validación exitosa de estos {steps.length} puntos asegura que la presentación de la interfaz se llevará a cabo en condiciones óptimas de simulación de planta fotovoltaica y almacenamiento sin interactuar con ningún sistema real.
        </span>
      </div>
    </div>
  );
};
