import React from 'react';
import { 
  PVMetricsPlantTechnicalProfile,
  PVMetricsPlantValidationStatus,
  PVMetricsPlantProfileDataSource 
} from '../../types/pvmetrics-plant-profile.types';
import { Battery, Zap, MapPin, Layers, FileText } from 'lucide-react';

type PVMetricsPlantProfileCardGridProps = {
  plants: PVMetricsPlantTechnicalProfile[];
  selectedPlantId: string;
  onSelectPlant: (plantId: string) => void;
};

const validationStatusLabel: Record<PVMetricsPlantValidationStatus, string> = {
  'demo-only': 'DEMO NO OFICIAL',
  draft: 'BORRADOR',
  'pending-client-validation': 'PENDIENTE CLIENTE',
  'validated-by-client': 'VALIDADA POR CLIENTE',
  'ready-for-readonly-pilot': 'READY READ-ONLY PILOT',
};

const sourceTypeLabel: Record<PVMetricsPlantProfileDataSource, string> = {
  demo: 'Demo local',
  'client-document': 'Documento cliente',
  'engineering-sheet': 'Ficha ingeniería',
  'scada-readonly': 'SCADA read-only',
  'csv-historical': 'CSV histórico',
  'excel-workbook': 'Excel',
  'manual-entry': 'Ingreso manual',
  'not-validated': 'No validado',
};

export const PVMetricsPlantProfileCardGrid: React.FC<PVMetricsPlantProfileCardGridProps> = ({
  plants,
  selectedPlantId,
  onSelectPlant,
}) => {
  
  const getValidationBadgeStyles = (status: PVMetricsPlantValidationStatus) => {
    switch (status) {
      case 'demo-only':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'draft':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'pending-client-validation':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'validated-by-client':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ready-for-readonly-pilot':
        return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/35';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-750';
    }
  };

  return (
    <div className="space-y-3" id="plant-profile-card-grid">
      <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
        Plantas Disponibles / Workspaces
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {plants.map((plant) => {
          const isSelected = plant.id === selectedPlantId;
          const isDemo = plant.validationStatus === 'demo-only';
          const isDraft = plant.validationStatus === 'draft';
          
          return (
            <div
              key={plant.id}
              id={`plant-card-${plant.id}`}
              onClick={() => onSelectPlant(plant.id)}
              className={`p-5 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/40 border-gray-800/80 hover:bg-slate-900/80 hover:border-gray-700'
              }`}
            >
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight uppercase">
                      {plant.plantName}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-mono tracking-wider block mt-0.5">
                      Código: {plant.plantCode} • {plant.technology === 'pv-bess' ? 'FV + BESS' : 'FV Sola'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase tracking-wider border shrink-0 ${getValidationBadgeStyles(
                      plant.validationStatus
                    )}`}
                  >
                    {isDemo ? 'DEMO EDITABLE / NO OFICIAL' : isDraft ? 'PLANTA NUEVA / PENDIENTE FICHA' : validationStatusLabel[plant.validationStatus]}
                  </span>
                </div>

                {/* Technical stats breakdown */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-800/60 my-3 text-xs bg-slate-950/30 p-2.5 rounded-lg font-mono">
                  <div>
                    <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Capacidad FV (DC)</span>
                    <span className="font-extrabold text-white">
                      {plant.pvCapacityDcMwp > 0 ? `${plant.pvCapacityDcMwp.toFixed(2)} MWp` : 'Sin Ficha'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Capacidad FV (AC)</span>
                    <span className="font-extrabold text-white">
                      {plant.pvCapacityAcMw > 0 ? `${plant.pvCapacityAcMw.toFixed(2)} MW` : 'Sin Ficha'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-500 uppercase tracking-tight">Capacidad BESS</span>
                    <span className="font-extrabold text-white flex items-center gap-1">
                      {plant.hasBess ? (
                        <>
                          <Battery className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>
                            {plant.bessPowerMw ? `${plant.bessPowerMw} MW` : '---'}
                          </span>
                        </>
                      ) : (
                        'No tiene'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1 text-[10px] text-gray-400">
                <span className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-600" />
                  <span>
                    {plant.region ? `${plant.region}, ${plant.country}` : 'Por definir'}
                  </span>
                </span>
                <span className="flex items-center gap-1 font-mono text-gray-500">
                  <FileText className="w-3 h-3 text-gray-600" />
                  <span>
                    Fte: <strong className="text-gray-400">{sourceTypeLabel[plant.sourceType]}</strong>
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
