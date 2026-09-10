import React, { useMemo, useState } from 'react';
import { ClipboardCheck, Languages, ShieldCheck } from 'lucide-react';
import { CommissioningService } from '../application/commissioningService';
import { COMMISSIONING_FEATURE_FLAGS } from '../config/commissioningFeatureFlags';
import { BrowserLocalStorageDriver, CommissioningRepository } from '../persistence';
import {
  DEFAULT_COMMISSIONING_LOCALE,
  commissioningText,
  type CommissioningLocale,
} from '../localization/commissioningLocale';
import { CommissioningLocaleProvider } from '../localization/CommissioningLocaleContext';
import { CommissioningOverview } from './CommissioningOverview';
import { CommissioningPilotIntakeView } from './CommissioningPilotIntakeView';
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
  | 'pilot-intake'
  | 'scope'
  | 'campaigns'
  | 'tests'
  | 'anomalies'
  | 'findings'
  | 'punch'
  | 'evidence'
  | 'baseline'
  | 'handover';

const CommissioningWorkspaceView: React.FC<{
  locale?: CommissioningLocale;
  onLocaleChange?: (locale: CommissioningLocale) => void;
}> = ({ locale = DEFAULT_COMMISSIONING_LOCALE, onLocaleChange }) => {
  const service = useMemo(
    () => new CommissioningService(
      new CommissioningRepository(new BrowserLocalStorageDriver(window.localStorage)),
    ),
    [],
  );
  const [activeSection, setActiveSection] = useState<WorkspaceSection>('overview');
  const [state, setState] = useState(() => service.getState());
  const text = (spanish: string, english: string) => commissioningText(locale, spanish, english);

  const sections: Array<{ id: WorkspaceSection; label: string }> = [
    { id: 'overview', label: text('Resumen', 'Overview') },
    { id: 'pilot-intake', label: text('Ingreso Piloto', 'Pilot Intake') },
    { id: 'scope', label: text('Alcance', 'Scope') },
    { id: 'campaigns', label: text('Campañas', 'Campaigns') },
    { id: 'tests', label: text('Pruebas', 'Tests') },
    { id: 'anomalies', label: text('Radar de Anomalías', 'Anomaly Radar') },
    { id: 'findings', label: text('Hallazgos', 'Findings') },
    { id: 'punch', label: text('Lista de Pendientes', 'Punch List') },
    { id: 'evidence', label: text('Evidencias', 'Evidence') },
    { id: 'baseline', label: text('Línea Base', 'Baseline') },
    { id: 'handover', label: text('Entrega', 'Handover') },
  ];

  const loadSyntheticLab = () => setState(service.initializeSyntheticLab());
  const loadSyntheticCertificationScenario = () => setState(service.initializeSyntheticCertificationScenario());

  const renderActiveSection = () => {
    if (activeSection === 'overview') return <CommissioningOverview state={state} />;
    if (activeSection === 'pilot-intake') return <CommissioningPilotIntakeView />;
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
    <CommissioningLocaleProvider locale={locale}>
      <section className="space-y-5" id="commissioning-workspace" aria-label={text('Espacio de Puesta en Servicio BESS', 'BESS Commissioning Workspace')} lang={locale}>
        <header className="rounded-xl border border-emerald-500/20 bg-gray-900 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-300">{text('ESPACIO DE PUESTA EN SERVICIO', 'COMMISSIONING WORKSPACE')}</span>
                <span className="rounded border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-300">{text('MODO SOMBRA', 'SHADOW MODE')}</span>
                <span className="rounded border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-300">{text('SIN ESCRITURA OT', 'NO OT WRITEBACK')}</span>
              </div>
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-emerald-400" />
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">{text('Puesta en Servicio BESS', 'BESS Commissioning')}</h1>
                  <p className="mt-1 text-xs text-gray-400">{text(
                    'Verificación documental y analítica de cumplimiento antes de la aceptación. La aceptación final permanece bajo responsabilidad humana autorizada.',
                    'Documentary and analytical compliance verification before acceptance. Final acceptance remains under authorized human responsibility.',
                  )}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="commissioning-locale" className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2">
                <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-gray-500">
                  <Languages className="h-3.5 w-3.5" />{text('Idioma', 'Language')}
                </span>
                <select
                  id="commissioning-locale"
                  aria-label={text('Idioma de Puesta en Servicio', 'Commissioning language')}
                  value={locale}
                  onChange={(event) => onLocaleChange?.(event.target.value as CommissioningLocale)}
                  className="mt-1 min-h-9 rounded border border-gray-700 bg-gray-900 px-2 text-xs font-bold text-white outline-none focus:border-emerald-500"
                >
                  <option value="es">ES · Español</option>
                  <option value="en">EN · English</option>
                </select>
              </label>

              {COMMISSIONING_FEATURE_FLAGS.showInternalCertificationBadge ? (
                <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-gray-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Core E2E · G19 PASS
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 p-1" aria-label={text('Secciones de Puesta en Servicio', 'Commissioning sections')}>
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
          {activeSection === 'pilot-intake' ? (
            <CommissioningPilotIntakeView />
          ) : state.loadStatus === 'EMPTY' ? (
            <div className="space-y-5 py-8 text-center">
              <div>
                <p className="text-sm font-semibold text-white">{text('Espacio de Puesta en Servicio sin dataset cargado', 'Commissioning workspace with no dataset loaded')}</p>
                <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-400">{text(
                  'El Core está preparado para carga manual por archivo y lectura de datos PVMetrics. Para validar la interfaz puede abrir el laboratorio sintético local. Ninguna opción conecta SCADA/BMS/PCS reales y nada persiste hasta una acción explícita de guardado.',
                  'The Core is prepared for manual file-based loading and PVMetrics data reads. To validate the interface you may open the local synthetic laboratory. No option connects to real SCADA/BMS/PCS systems and nothing persists until an explicit save action.',
                )}</p>
              </div>

              <div className={`mx-auto grid max-w-3xl grid-cols-1 gap-3 ${COMMISSIONING_FEATURE_FLAGS.certificationScenarioEnabled ? 'md:grid-cols-2' : ''}`}>
                {COMMISSIONING_FEATURE_FLAGS.syntheticBaseLabEnabled ? (
                  <article className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">{text('LABORATORIO SINTÉTICO BASE', 'SYNTHETIC BASE LAB')}</p>
                    <h2 className="mt-2 text-sm font-bold text-white">{text('Contexto base / validación del estado vacío', 'Base context / empty-state validation')}</h2>
                    <p className="mt-2 text-[10px] leading-relaxed text-gray-500">{text(
                      'Carga proyecto, alcance, campaña y jerarquía de activos. Los registros analíticos posteriores permanecen vacíos hasta un procesamiento explícito.',
                      'Loads project, scope, campaign and asset hierarchy. Downstream analytical records remain empty until explicit processing.',
                    )}</p>
                    <button type="button" onClick={loadSyntheticLab} className="mt-4 min-h-11 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-extrabold text-emerald-300 hover:bg-emerald-500/15">{text('Abrir laboratorio sintético', 'Open synthetic laboratory')}</button>
                  </article>
                ) : null}

                {COMMISSIONING_FEATURE_FLAGS.certificationScenarioEnabled ? (
                  <article className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left">
                    <p className="text-[9px] font-black uppercase tracking-wider text-cyan-300">{text('FIXTURE INTERNA DE CERTIFICACIÓN', 'INTERNAL CERTIFICATION FIXTURE')}</p>
                    <h2 className="mt-2 text-sm font-bold text-white">{text('Escenario E2E procesado', 'Processed E2E scenario')}</h2>
                    <p className="mt-2 text-[10px] leading-relaxed text-gray-400">{text(
                      'Reutiliza los motores determinísticos del Core para poblar Anomalía → Hallazgo → Pendiente → Reprueba → Línea Base → Entrega. Es exclusivamente sintético y no otorga autoridad operacional.',
                      'Reuses deterministic Core engines to populate Anomaly → Finding → Punch → Retest → Baseline → Handover. It is exclusively synthetic and grants no operational authority.',
                    )}</p>
                    <button type="button" onClick={loadSyntheticCertificationScenario} className="mt-4 min-h-11 w-full rounded-lg bg-cyan-400 px-4 text-xs font-extrabold text-slate-950 hover:bg-cyan-300">{text('Abrir escenario E2E procesado', 'Open processed E2E scenario')}</button>
                  </article>
                ) : null}
              </div>

              <p className="mx-auto max-w-2xl text-[10px] leading-relaxed text-amber-200">{text(
                'Los laboratorios son herramientas de validación local. Sus estados CUMPLE / LISTO / ACEPTADO son registros sintéticos de prueba y nunca autorizan energización, operación de equipos ni acciones sobre sistemas OT reales.',
                'Laboratories are local validation tools. Their PASS / READY / ACCEPTED states are synthetic test records and never authorize energization, equipment operation or actions on real OT systems.',
              )}</p>
            </div>
          ) : renderActiveSection()}
        </div>
      </section>
    </CommissioningLocaleProvider>
  );
};

export default CommissioningWorkspaceView;
