import React from 'react';
import { PVMetricsPlantTechnicalProfile } from '../../types/pvmetrics-plant-profile.types';
import { CheckSquare, Square, ClipboardList, Info } from 'lucide-react';

type PVMetricsPlantOnboardingChecklistCardProps = {
  plant: PVMetricsPlantTechnicalProfile;
};

export const PVMetricsPlantOnboardingChecklistCard: React.FC<PVMetricsPlantOnboardingChecklistCardProps> = ({
  plant,
}) => {
  const checklist = [
    {
      id: 'name',
      label: 'Nombre de la planta solar configurado',
      done: Boolean(plant.plantName && plant.plantName !== 'Pendiente' && plant.plantName !== 'Por definir'),
    },
    {
      id: 'location',
      label: 'Ubicación, región, comuna y zona horaria',
      done: Boolean(plant.region && plant.region !== 'Por definir' && plant.region !== 'Por definir'),
    },
    {
      id: 'dc-capacity',
      label: 'Potencia FV DC MWp declarada',
      done: plant.pvCapacityDcMwp > 0,
    },
    {
      id: 'ac-capacity',
      label: 'Potencia FV AC MW declarada',
      done: plant.pvCapacityAcMw > 0,
    },
    {
      id: 'structure',
      label: 'Tipo de estructura (fija o tracker)',
      done: plant.mountingType !== 'unknown',
    },
    {
      id: 'scada',
      label: 'SCADA, data logger o Gateway definido',
      done: Boolean(
        (plant.scadaVendor && plant.scadaVendor !== 'Pendiente' && plant.scadaVendor !== 'No validado') ||
        (plant.dataLoggerVendor && plant.dataLoggerVendor !== 'Pendiente' && plant.dataLoggerVendor !== 'No validado')
      ),
    },
    {
      id: 'bess',
      label: 'Configuración BESS (o exención técnica)',
      done: !plant.hasBess || Boolean((plant.bessPowerMw ?? 0) > 0 && (plant.bessEnergyMwh ?? 0) > 0),
    },
    {
      id: 'readonly-auth',
      label: 'Autorización técnica read-only firmada',
      done: plant.validationStatus === 'ready-for-readonly-pilot' || plant.validationStatus === 'validated-by-client',
    },
  ];

  const totalItems = checklist.length;
  const completedItems = checklist.filter((item) => item.done).length;
  const progressPct = Math.round((completedItems / totalItems) * 100);

  const getOnboardingState = (progress: number) => {
    if (progress === 100) {
      return {
        label: 'Listo para piloto read-only',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      };
    }
    if (progress >= 70) {
      return {
        label: 'Listo para validación cliente',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      };
    }
    if (progress >= 40) {
      return {
        label: 'En preparación',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      };
    }
    return {
      label: 'Ficha técnica incompleta',
      color: 'text-gray-400 bg-slate-950 border-gray-800',
    };
  };

  const state = getOnboardingState(progressPct);

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 space-y-4" id="plant-onboarding-checklist-card">
      {/* Title */}
      <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-850 pb-2">
        <ClipboardList className="w-4 h-4 text-amber-500" /> Checklist de Onboarding Técnico
      </h3>

      {/* Progress section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">Progreso de Perfil:</span>
          <span className="text-white font-bold">{completedItems} / {totalItems} ({progressPct}%)</span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-gray-850">
          <div 
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* State badge */}
      <div className={`p-2.5 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider text-center ${state.color}`}>
        {state.label}
      </div>

      {/* Checklist list */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
        {checklist.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-start gap-2.5 p-2 rounded-lg text-xs border ${
              item.done 
                ? 'bg-slate-950/20 border-gray-850/40 text-gray-300' 
                : 'bg-slate-950/10 border-gray-900/30 text-gray-500'
            }`}
          >
            {item.done ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-tight font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-950/30 p-2.5 rounded-lg border border-gray-850 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-gray-500 leading-normal">
          Para que una nueva planta FV sea dada de alta y pueda integrarse al monitoreo, el checklist de parámetros s-o-t de ingeniería debe completarse en su totalidad.
        </p>
      </div>
    </div>
  );
};
