import React, { useMemo, useState } from 'react';
import { ClipboardCheck, ShieldCheck } from 'lucide-react';
import { CommissioningService } from '../application/commissioningService';
import { COMMISSIONING_FEATURE_FLAGS } from '../config/commissioningFeatureFlags';
import { BrowserLocalStorageDriver, CommissioningRepository } from '../persistence';
import { CommissioningOverview } from './CommissioningOverview';
import { CommissioningScopeView } from './CommissioningScopeView';
import { CommissioningCampaignsView } from './CommissioningCampaignsView';
import { CommissioningTestsView } from './CommissioningTestsView';
import { CommissioningAnomalyRadarView } from './CommissioningAnomalyRadarView';
import { CommissioningFindingsView } from './CommissioningFindingsView';
import { CommissioningPunchRetestView } from './CommissioningPunchRetestView';
import { CommissioningEvidenceView } from './CommissioningEvidenceView';
import { CommissioningBaselineView } from './CommissioningBaselineView';
import { CommissioningHandoverView } from './CommissioningHandoverView';

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
  const loadSyntheticCertificationScenario = () => setState(service.initializeSyntheticCertificationScenario());

  const renderActiveSection = () => {
    if (activeSection === 'overview') return <CommissioningOverview state={state} />;
    if (activeSection === 'scope') return <CommissioningScopeView state={state} />;
    if (activeSection === 'campaigns') return <CommissioningCampaignsView state={state} />;
    if (activeSection === 'tests') return <CommissioningTestsView state={state} />;
    if (activeSection === 'anomalies') return <CommissioningAnomalyRadarView state={state} />;
    if (activeSection === 'findings') return <CommissioningFindingsView state={state} />;
    if (activeSection === 'punch') return <CommissioningPunchRetestView state={state} />;
    if (activeSection === 'evidence') return <CommissioningEvidenceView state={state} />;
    if (activeSection === 'baseline') return <CommissioningBaselineView state={state} />;
    if (activeSection === 'handover') return <CommissioningHandoverView state={state} />;
    return null;
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
          {COMMISSIONING_FEATURE_FLAGS.showInternalCertificationBadge ? (
            <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Core E2E · G19 PASS
            </div>
          ) : null}
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
          <div className="space-y-5 py-8 text-center">
            <div>
              <p className="text-sm font-semibold text-white">Commissioning workspace sin dataset cargado</p>
              <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-400">El Core está preparado para carga manual/archivo y lectura de datos PVMetrics. Para validar la interfaz puede abrir el laboratorio sintético local. Ninguna opción conecta SCADA/BMS/PCS reales y ninguna persiste hasta una acción explícita de guardado.</p>
            </div>

            <div className={`mx-auto grid max-w-3xl grid-cols-1 gap-3 ${COMMISSIONING_FEATURE_FLAGS.certificationScenarioEnabled ? 'md:grid-cols-2' : ''}`}>
              {COMMISSIONING_FEATURE_FLAGS.syntheticBaseLabEnabled ? (
                <article className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Synthetic base lab</p>
                  <h2 className="mt-2 text-sm font-bold text-white">Contexto base / empty-state validation</h2>
                  <p className="mt-2 text-[10px] leading-relaxed text-gray-500">Carga proyecto, scope, campaña y jerarquía de activos. Los registros analíticos posteriores permanecen vacíos hasta procesamiento explícito.</p>
                  <button type="button" onClick={loadSyntheticLab} className="mt-4 min-h-11 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-extrabold text-emerald-300 hover:bg-emerald-500/15">Abrir laboratorio sintético</button>
                </article>
              ) : null}

              {COMMISSIONING_FEATURE_FLAGS.certificationScenarioEnabled ? (
                <article className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left">
                  <p className="text-[9px] font-black uppercase tracking-wider text-cyan-300">Internal certification fixture</p>
                  <h2 className="mt-2 text-sm font-bold text-white">Escenario E2E procesado</h2>
                  <p className="mt-2 text-[10px] leading-relaxed text-gray-400">Reutiliza los motores determinísticos del Core para poblar Anomaly → Finding → Punch → Retest → Baseline → Handover. Es exclusivamente sintético y no otorga autoridad operacional.</p>
                  <button type="button" onClick={loadSyntheticCertificationScenario} className="mt-4 min-h-11 w-full rounded-lg bg-cyan-400 px-4 text-xs font-extrabold text-slate-950 hover:bg-cyan-300">Abrir escenario E2E procesado</button>
                </article>
              ) : null}
            </div>

            <p className="mx-auto max-w-2xl text-[10px] leading-relaxed text-amber-200">Los laboratorios son herramientas de validación local. Sus estados PASS / READY / ACCEPTED son registros sintéticos de prueba y nunca autorizan energización, operación de equipos ni acciones sobre sistemas OT reales.</p>
          </div>
        ) : renderActiveSection()}
      </div>
    </section>
  );
};

export default CommissioningWorkspaceView;
