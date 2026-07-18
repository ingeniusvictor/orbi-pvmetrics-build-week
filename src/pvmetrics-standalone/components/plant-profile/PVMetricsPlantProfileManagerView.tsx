import React, { useMemo, useState } from 'react';
import { createPvMetricsPlantProfilesDemo } from '../../data/createPvMetricsPlantProfilesDemo';
import { PVMetricsPlantTechnicalProfile } from '../../types/pvmetrics-plant-profile.types';
import { PVMetricsPlantProfileOverviewCards } from './PVMetricsPlantProfileOverviewCards';
import { PVMetricsPlantProfileCardGrid } from './PVMetricsPlantProfileCardGrid';
import { PVMetricsPlantProfileDetailCard } from './PVMetricsPlantProfileDetailCard';
import { PVMetricsPlantSourceOfTruthCard } from './PVMetricsPlantSourceOfTruthCard';
import { PVMetricsPlantOnboardingChecklistCard } from './PVMetricsPlantOnboardingChecklistCard';
import { PVMetricsPlantProfileSecurityNote } from './PVMetricsPlantProfileSecurityNote';
import { PVMetricsPlantConfiguratorWizardView } from '../plant-configurator/PVMetricsPlantConfiguratorWizardView';
import { PVMetricsSmartPlantIntakeView } from '../plant-intake/PVMetricsSmartPlantIntakeView';
import { PVMetricsPlantConfiguratorDraft } from '../../types/pvmetrics-plant-configurator.types';
import { ShieldCheck, Info, FileText, Settings, Database, Activity, LayoutGrid, ClipboardCheck, Sparkles } from 'lucide-react';

export const PVMetricsPlantProfileManagerView: React.FC = () => {
  const [activeProfileTab, setActiveProfileTab] = useState<
    'registered-profiles' | 'configurator' | 'smart-intake'
  >('registered-profiles');

  const [externalConfiguratorDraft, setExternalConfiguratorDraft] =
    useState<PVMetricsPlantConfiguratorDraft | null>(null);

  const [externalDraftVersion, setExternalDraftVersion] = useState(0);

  const handleApplyIntakeDraft = (draft: PVMetricsPlantConfiguratorDraft) => {
    setExternalConfiguratorDraft(draft);
    setExternalDraftVersion((current) => current + 1);
    setActiveProfileTab('configurator');
  };
  const dataset = useMemo(() => createPvMetricsPlantProfilesDemo(), []);
  const [selectedPlantId, setSelectedPlantId] = useState(
    dataset.plants[0]?.id ?? '',
  );

  const selectedPlant = useMemo(() => {
    return (
      dataset.plants.find((plant) => plant.id === selectedPlantId) ??
      dataset.plants[0]
    );
  }, [dataset, selectedPlantId]);

  return (
    <div className="space-y-6" id="pvmetrics-plant-profile-manager">
      {/* Top Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
              Módulo 1O-A & 1O-B.1
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              Plant Profile visual
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500 shrink-0" /> Plant Profile Manager
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestor de perfiles técnicos multi-cliente para plantas FV y FV + BESS en modo demo seguro y preparación read-only.
          </p>
        </div>

        {/* Top badges */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-cyan-400">
            MULTI-PLANT READY
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-amber-500">
            DEMO SOURCE-OF-TRUTH
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-emerald-400">
            READ-ONLY FIRST
          </span>
          <span className="px-2 py-1 bg-slate-900 border border-gray-800 text-[9px] font-mono font-bold rounded text-red-400">
            NO TELECONTROL
          </span>
        </div>
      </div>

      {/* Internal View Tab Switcher */}
      <div className="flex border-b border-gray-800 gap-2" id="plant-profile-tab-navigation">
        <button
          onClick={() => setActiveProfileTab('registered-profiles')}
          className={`px-4 py-2.5 text-xs font-mono font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'registered-profiles'
              ? 'border-amber-500 text-amber-500 bg-amber-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-slate-900/40'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Perfiles Registrados
        </button>
        <button
          onClick={() => setActiveProfileTab('smart-intake')}
          className={`px-4 py-2.5 text-xs font-mono font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'smart-intake'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-slate-900/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Agregar Planta Inteligente
        </button>
        <button
          onClick={() => setActiveProfileTab('configurator')}
          className={`px-4 py-2.5 text-xs font-mono font-extrabold uppercase tracking-wider border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'configurator'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-slate-900/40'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Configurar Nueva Planta
        </button>
      </div>

      {activeProfileTab === 'registered-profiles' ? (
        <>
          {/* Header Warning Banner */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              <strong className="text-amber-400 font-bold uppercase tracking-wider">Aviso de Simulación:</strong> Los perfiles demo son editables y no representan información oficial validada por cliente. Para una planta real se requiere ficha técnica formalizada, fuentes disponibles autorizadas y consentimiento de acceso read-only de SCADA.
            </p>
          </div>

          {/* 1. Bento Overview Cards */}
          <PVMetricsPlantProfileOverviewCards owners={dataset.owners} plants={dataset.plants} />

          {/* Main split: List & details */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Left column: Grid selector list */}
            <div className="xl:col-span-1 space-y-6">
              <PVMetricsPlantProfileCardGrid 
                plants={dataset.plants} 
                selectedPlantId={selectedPlantId}
                onSelectPlant={setSelectedPlantId}
              />

              {/* Source-of-truth card below lists */}
              {selectedPlant && <PVMetricsPlantSourceOfTruthCard plant={selectedPlant} />}
            </div>

            {/* Right column: Details and checklists */}
            <div className="xl:col-span-2 space-y-6">
              {selectedPlant ? (
                <>
                  {/* Detailed specs */}
                  <PVMetricsPlantProfileDetailCard plant={selectedPlant} />

                  {/* Onboarding and configuration checklist */}
                  <PVMetricsPlantOnboardingChecklistCard plant={selectedPlant} />
                </>
              ) : (
                <div className="bg-slate-900 border border-gray-850 rounded-xl p-8 text-center text-gray-500">
                  Seleccione una planta del listado para auditar su ficha técnica.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Security Limit Note */}
          <PVMetricsPlantProfileSecurityNote />
        </>
      ) : activeProfileTab === 'smart-intake' ? (
        <PVMetricsSmartPlantIntakeView onApplyDraft={handleApplyIntakeDraft} />
      ) : (
        <PVMetricsPlantConfiguratorWizardView
          externalDraft={externalConfiguratorDraft}
          externalDraftVersion={externalDraftVersion}
        />
      )}
    </div>
  );
};
