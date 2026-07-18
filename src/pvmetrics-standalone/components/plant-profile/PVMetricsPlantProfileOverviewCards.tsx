import React from 'react';
import { 
  Building2, 
  Cpu, 
  Battery, 
  DraftingCompass, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Layers 
} from 'lucide-react';
import {
  PVMetricsPlantOwnerProfile,
  PVMetricsPlantTechnicalProfile,
} from '../../types/pvmetrics-plant-profile.types';

type PVMetricsPlantProfileOverviewCardsProps = {
  owners: PVMetricsPlantOwnerProfile[];
  plants: PVMetricsPlantTechnicalProfile[];
};

export const PVMetricsPlantProfileOverviewCards: React.FC<PVMetricsPlantProfileOverviewCardsProps> = ({
  owners,
  plants,
}) => {
  const totalOwners = owners.length;
  const totalPlants = plants.length;
  const pvBessPlants = plants.filter((plant) => plant.technology === 'pv-bess').length;
  const demoPlants = plants.filter((plant) => plant.validationStatus === 'demo-only').length;
  const draftPlants = plants.filter((plant) => plant.validationStatus === 'draft').length;
  const pendingValidation = plants.filter(
    (plant) => plant.validationStatus === 'pending-client-validation',
  ).length;

  const totalAcMw = plants.reduce((sum, plant) => sum + plant.pvCapacityAcMw, 0);
  const totalBessMw = plants.reduce(
    (sum, plant) => sum + (plant.bessPowerMw ?? 0),
    0,
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="plant-overview-cards">
      {/* Workspaces Owner Card */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Workspaces</span>
          <span className="block text-xl font-extrabold text-cyan-400">{totalOwners}</span>
        </div>
      </div>

      {/* Total Plants Card */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Plantas Registradas</span>
          <span className="block text-xl font-extrabold text-amber-400">{totalPlants}</span>
        </div>
      </div>

      {/* Solar + BESS Plants Card */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
          <Battery className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Sistemas FV + BESS</span>
          <span className="block text-xl font-extrabold text-indigo-400">{pvBessPlants}</span>
        </div>
      </div>

      {/* Capacidades Acumuladas */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Capacidad AC (FV/BESS)</span>
          <span className="block text-sm font-extrabold text-emerald-400 leading-tight">
            {totalAcMw.toFixed(1)} MWp FV / {totalBessMw.toFixed(1)} MW BESS
          </span>
        </div>
      </div>

      {/* Demo Mode */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-amber-500/15 text-amber-500 rounded-lg shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Perfiles Demo</span>
          <span className="block text-xl font-extrabold text-amber-500">{demoPlants}</span>
        </div>
      </div>

      {/* Drafts */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-cyan-500/15 text-cyan-400 rounded-lg shrink-0">
          <DraftingCompass className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Plantas en Borrador</span>
          <span className="block text-xl font-extrabold text-cyan-400">{draftPlants}</span>
        </div>
      </div>

      {/* Pending Validation */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Pendientes Cliente</span>
          <span className="block text-xl font-extrabold text-amber-500">{pendingValidation}</span>
        </div>
      </div>

      {/* Ready / Validated status */}
      <div className="bg-slate-900/60 border border-gray-800 p-4 rounded-xl flex items-center gap-3">
        <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">Bajo Piloto Read-Only</span>
          <span className="block text-xl font-extrabold text-emerald-400">
            {plants.filter((p) => p.validationStatus === 'ready-for-readonly-pilot').length}
          </span>
        </div>
      </div>
    </div>
  );
};
