import React from 'react';
import {
  PVMetricsPlantConfiguratorFieldCheck,
  PVMetricsPlantConfiguratorStep,
  PVMetricsPlantConfiguratorStepId,
} from '../../types/pvmetrics-plant-configurator.types';
import { AlertCircle, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';

type PVMetricsPlantConfiguratorStepperProps = {
  steps: PVMetricsPlantConfiguratorStep[];
  activeStepId: PVMetricsPlantConfiguratorStepId;
  checks: PVMetricsPlantConfiguratorFieldCheck[];
  onSelectStep: (stepId: PVMetricsPlantConfiguratorStepId) => void;
};

export const PVMetricsPlantConfiguratorStepper: React.FC<PVMetricsPlantConfiguratorStepperProps> = ({
  steps,
  activeStepId,
  checks,
  onSelectStep,
}) => {
  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-4" id="plant-configurator-stepper">
      <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-800">
        Pasos de Configuración
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const stepChecks = checks.filter((check) => check.stepId === step.id);
          const totalInStep = stepChecks.length;
          
          const missingCount = stepChecks.filter((check) => check.status === 'missing').length;
          const warningCount = stepChecks.filter((check) => check.status === 'warning').length;
          const completeCount = stepChecks.filter((check) => check.status === 'complete').length;

          let stepStatus: 'complete' | 'warning' | 'missing' | 'none' = 'none';
          if (totalInStep > 0) {
            if (missingCount > 0) {
              stepStatus = 'missing';
            } else if (warningCount > 0) {
              stepStatus = 'warning';
            } else {
              stepStatus = 'complete';
            }
          }

          // Decide color classes
          let bgClass = 'bg-slate-950 text-gray-400 border-gray-850';
          let iconColor = 'text-gray-500';

          if (stepStatus === 'complete') {
            bgClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            iconColor = 'text-emerald-400';
          } else if (stepStatus === 'warning') {
            bgClass = 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            iconColor = 'text-amber-500';
          } else if (stepStatus === 'missing') {
            bgClass = 'bg-red-500/5 text-red-400 border-red-500/20';
            iconColor = 'text-red-400';
          } else {
            bgClass = 'bg-slate-950/40 text-cyan-400 border-gray-800/80';
            iconColor = 'text-cyan-500/70';
          }

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between min-h-[82px] cursor-pointer ${bgClass} ${
                isActive 
                  ? 'ring-2 ring-cyan-500/80 border-cyan-500/50 shadow-md shadow-cyan-500/5' 
                  : 'hover:border-gray-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Step number & status */}
              <div className="flex items-center justify-between w-full text-[9px] font-mono font-bold text-gray-500 mb-1">
                <span>0{index + 1}</span>
                {stepStatus === 'complete' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {stepStatus === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                {stepStatus === 'missing' && <AlertCircle className="w-3 h-3 text-red-400" />}
                {stepStatus === 'none' && <Circle className="w-2 h-2 text-gray-600 fill-current" />}
              </div>

              {/* Step name */}
              <span className="text-[10px] font-bold leading-tight tracking-tight uppercase truncate max-w-full block">
                {step.shortTitle}
              </span>

              {/* Progress counter */}
              <span className="text-[9px] font-mono text-gray-500 mt-1">
                {totalInStep > 0 ? `${completeCount}/${totalInStep}` : '---'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
