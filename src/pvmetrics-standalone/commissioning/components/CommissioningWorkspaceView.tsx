import React, { useMemo, useState } from 'react';
import { ClipboardCheck, ShieldCheck } from 'lucide-react';
import { CommissioningService } from '../application/commissioningService';
import { BrowserLocalStorageDriver, CommissioningRepository } from '../persistence';
import { CommissioningOverview } from './CommissioningOverview';
import { CommissioningScopeView } from './CommissioningScopeView';
import { CommissioningCampaignsView } from './CommissioningCampaignsView';
import { CommissioningTestsView } from './CommissioningTestsView';

type WorkspaceSection =
  | 'overview'
  | 'scope'
  | 'campaigns'
  | 'tests'
  | 'anomalies'
  | 'findings'
  | 'punch'
  | 'evidence'
  | 'baseline'
  | 'handover';

const sections: Array<{ id: WorkspaceSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'scope', label: 'Scope' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'tests', label: 'Tests' },
  { id: 'anomalies', label: 'Anomaly Radar' },
  { id: 'findings', label: 'Findings' },
  { id: 'punch', label: 'Punch List' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'baseline', label: 'Baseline' },
  { id: 'handover', label: 'Handover' },
];

const CommissioningWorkspaceView: React.FC = () => {
  const service = useMemo(
    () => new CommissioningService(
      new CommissioningRepository(new BrowserLocalStorageDriver(window.localStorage)),
    ),
    [],
  );
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('overview');
  const [state, setState] = useState(() => service.getState());

  const loadSyntheticLab = () => setState(service.initializeSyntheticLab());

  const renderActiveSection = () => {
    if (activeSection === 'overview') return <CommissioningOverview state={state} />;
    if (activeSection === 'scope') return <CommissioningScopeView state={state} />;
    if (activeSection === 'campaigns') return <CommissioningCampaignsView state={state} />;
    if (activeSection === 'tests') return <CommissioningTestsView state={state} />;
    return (
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Sección activa</p>
        <h2 className="text-lg font-bold text-white">{sections.find((section) => section.id === activeSection)?.label}</h2>
        <p className="text-xs text-gray-500">La vista detallada de {sections.find((section) => section.id === activeSection)?.label} se implementa en los siguientes bloques UI. Este shell no contiene controles operacionales.</p>
      </div>
    );
  };

  return (
    <section className="space-y-5" id="commissioning-workspace" aria-label="BESS Commissioning Workspace">
      <header className="rounded-xl border border-emerald-500/20 bg-gray-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-300">Commissioning Workspace</span>
              <span className="rounded border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-300">Shadow Mode</span>
              <span className="rounded border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-300">No OT Writeback</span>
            </div>
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-emerald-400" />
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">BESS Commissioning</h1>
                <p className="mt-1 text-xs text-gray-400">Verificación documental y analítica de cumplimiento antes de aceptación. La aceptación final permanece bajo responsabilidad humana autorizada.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Core E2E · G19 PASS
          </div>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 p-1" aria-label="Commissioning sections">
        {sections.map((section) => (
          <button
            type="button"
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`min-h-11 whitespace-nowrap rounded-lg px-3 text-xs font-bold transition ${activeSection === section.id ? 'bg-emerald-500 text-slate-950' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            aria-current={activeSection === section.id ? 'page' : undefined}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        {state.loadStatus === 'EMPTY' ? (
          <div className="space-y-4 py-8 text-center">
            <p className="text-sm font-semibold text-white">Commissioning workspace sin dataset cargado</p>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-gray-400">El Core está preparado para carga manual/archivo y lectura de datos PVMetrics. Para validar la interfaz puede abrir el laboratorio sintético local. Esto no conecta SCADA/BMS/PCS reales y no persiste hasta una acción explícita de guardado.</p>
            <button type="button" onClick={loadSyntheticLab} className="min-h-11 rounded-lg bg-emerald-500 px-4 text-xs font-extrabold text-slate-950 hover:bg-emerald-400">Abrir laboratorio sintético</button>
          </div>
        ) : renderActiveSection()}
      </div>
    </section>
  );
};

export default CommissioningWorkspaceView;
