import React, { lazy, Suspense, useState } from 'react';
import { StateProvider, useAppState } from './StateContext';
import { DashboardView } from '../components/DashboardView';
import { PVMetricsLiveMonitoringDashboard } from '../components/live/PVMetricsLiveMonitoringDashboard';
import { ForecastViews } from '../components/ForecastViews';
import { BessView } from '../components/BessView';
import { EnergySalesView } from '../components/EnergySalesView';
import { ScadaView } from '../components/ScadaView';
import { UnifiedReportsView } from '../components/UnifiedReportsView';
import { ConfigView } from '../components/ConfigView';
import {
  LayoutDashboard,
  Activity,
  Clock,
  Calendar,
  BarChart3,
  BatteryCharging,
  Coins,
  Radio,
  FileEdit,
  Sliders,
  AlertOctagon,
  Info,
  Menu,
  X,
  Building2,
  Cpu,
  Database,
  GitCommit,
  ShieldCheck,
  Sparkles,
  Leaf,
  ClipboardCheck,
} from 'lucide-react';
import { PVMetricsDataSourceManagerView } from '../components/data-sources/PVMetricsDataSourceManagerView';
import { PVMetricsSignalMappingView } from '../components/signal-mapping/PVMetricsSignalMappingView';
import { PVMetricsSignalQualityRulesView } from '../components/signal-quality/PVMetricsSignalQualityRulesView';
import { PVMetricsPlantProfileManagerView } from '../components/plant-profile/PVMetricsPlantProfileManagerView';
import { COMMISSIONING_FEATURE_FLAGS } from '../commissioning/config/commissioningFeatureFlags';

const IncidentCopilotView = lazy(
  () => import('../../build-week/incident-copilot/IncidentCopilotView'),
);
const ClimateRecoveryView = lazy(
  () => import('../components/climate-recovery/ClimateRecoveryView'),
);
const CommissioningWorkspaceView = lazy(
  () => import('../commissioning/components/CommissioningWorkspaceView'),
);

type MainViewType = 'dashboard' | 'incident-copilot' | 'climate-recovery' | 'commissioning' | 'live' | 'diario' | 'semanal' | 'mensual' | 'bess' | 'venta' | 'scada' | 'reportes' | 'config' | 'datasources' | 'signalmapping' | 'signalquality' | 'plantprofiles';

const OrbiPVMetricsStandaloneInner: React.FC = () => {
  const {
    companies,
    activeCompanyId,
    activePlantId,
    activeCompany,
    activePlant,
    setActiveCompanyId,
    setActivePlantId
  } = useAppState();

  const [activeView, setActiveView] = useState<MainViewType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [climateRecoveryLocale, setClimateRecoveryLocale] = useState<'es' | 'en'>('es');
  const [climateRecoveryMode, setClimateRecoveryMode] = useState<'free' | 'guided' | 'presentation'>('free');
  const shellEnglish = activeView === 'climate-recovery' && climateRecoveryLocale === 'en';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(COMMISSIONING_FEATURE_FLAGS.workspaceEnabled
      ? [{ id: 'commissioning', label: 'Commissioning', icon: ClipboardCheck, badge: 'BESS' }]
      : []),
    { id: 'climate-recovery', label: shellEnglish ? 'Climate Recovery' : 'Recuperación Climática', icon: Leaf, badge: 'CR-06.1' },
    { id: 'incident-copilot', label: 'Incident Copilot', icon: Sparkles, badge: 'Build Week' },
    { id: 'live', label: shellEnglish ? 'Live Monitoring' : 'Monitoreo Live', icon: Activity },
    { id: 'diario', label: shellEnglish ? 'Daily' : 'Diario', icon: Clock },
    { id: 'semanal', label: shellEnglish ? 'Weekly' : 'Semanal', icon: Calendar },
    { id: 'mensual', label: shellEnglish ? 'Monthly' : 'Mensual', icon: BarChart3 },
    { id: 'bess', label: 'BESS', icon: BatteryCharging },
    { id: 'venta', label: shellEnglish ? 'Energy Sales' : 'Venta Energía', icon: Coins },
    { id: 'scada', label: 'SCADA', icon: Radio },
    { id: 'plantprofiles', label: shellEnglish ? 'Plant Profiles' : 'Perfiles de Planta', icon: Building2 },
    { id: 'datasources', label: shellEnglish ? 'Data Sources' : 'Fuentes de Datos', icon: Database },
    { id: 'signalmapping', label: shellEnglish ? 'Signal Mapping' : 'Mapeo de Señales', icon: GitCommit },
    { id: 'signalquality', label: shellEnglish ? 'Quality Rules' : 'Reglas de Calidad', icon: ShieldCheck },
    { id: 'reportes', label: shellEnglish ? 'Reports' : 'Reportes', icon: FileEdit },
    { id: 'config', label: shellEnglish ? 'Settings' : 'Configuración', icon: Sliders },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'incident-copilot':
        return (
          <Suspense
            fallback={
              <div className="rounded-xl border border-amber-500/20 bg-gray-900 p-8 text-center text-xs text-amber-300">
                Loading Build Week Incident Copilot…
              </div>
            }
          >
            <IncidentCopilotView />
          </Suspense>
        );
      case 'climate-recovery':
        return (
          <Suspense
            fallback={
              <div className="rounded-xl border border-cyan-500/20 bg-gray-900 p-8 text-center text-xs text-cyan-300">
                Loading Climate Recovery synthetic portfolio…
              </div>
            }
          >
            <ClimateRecoveryView
              onExit={() => { setClimateRecoveryMode('free'); setActiveView('dashboard'); }}
              onLocaleChange={setClimateRecoveryLocale}
              onExperienceModeChange={setClimateRecoveryMode}
            />
          </Suspense>
        );
      case 'commissioning':
        return (
          <Suspense
            fallback={
              <div className="rounded-xl border border-emerald-500/20 bg-gray-900 p-8 text-center text-xs text-emerald-300">
                Loading BESS Commissioning Workspace…
              </div>
            }
          >
            <CommissioningWorkspaceView />
          </Suspense>
        );
      case 'live':
        return <PVMetricsLiveMonitoringDashboard />;
      case 'diario':
        return <ForecastViews initialTab="daily" />;
      case 'semanal':
        return <ForecastViews initialTab="weekly" />;
      case 'mensual':
        return <ForecastViews initialTab="monthly" />;
      case 'bess':
        return <BessView />;
      case 'venta':
        return <EnergySalesView />;
      case 'scada':
        return <ScadaView />;
      case 'plantprofiles':
        return <PVMetricsPlantProfileManagerView />;
      case 'datasources':
        return <PVMetricsDataSourceManagerView />;
      case 'signalmapping':
        return <PVMetricsSignalMappingView />;
      case 'signalquality':
        return <PVMetricsSignalQualityRulesView />;
      case 'reportes':
        return <UnifiedReportsView />;
      case 'config':
        return <ConfigView />;
      default:
        return <DashboardView />;
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setActiveCompanyId(cid);
    const nextCompany = companies.find(c => c.id === cid);
    if (nextCompany && nextCompany.plants.length > 0) {
      setActivePlantId(nextCompany.plants[0].id);
    }
  };

  return (
    <div className="cr-shell min-h-screen bg-[#0a0f1d] text-[#f9fafb] flex flex-col font-sans antialiased custom-scrollbar selection:bg-amber-500 selection:text-slate-900" data-cr-mode={activeView === 'climate-recovery' ? climateRecoveryMode : 'free'}>
      <div className="cr-technical-chrome no-print bg-slate-950 border-b border-gray-800 text-[10px] text-gray-400 px-4 py-2 flex flex-wrap gap-x-6 gap-y-1.5 items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{shellEnglish ? 'SAFE SIMULATION ENVIRONMENT' : 'ENTORNO SEGURO DE SIMULACIÓN'}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-800 font-bold uppercase text-[8px]">{shellEnglish ? 'LOCAL SIMULATION' : 'SIMULACIÓN LOCAL'}</span>
          <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-800 font-bold uppercase text-[8px]">READ-ONLY</span>
          <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-800 font-bold uppercase text-[8px]">NO REAL DISPATCH</span>
          <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-800 font-bold uppercase text-[8px]">CONFIGURABLE</span>
          <span className="bg-gray-900 px-2 py-0.5 rounded text-gray-300 border border-gray-800 font-bold uppercase text-[8px]">SCADA READY</span>
        </div>
        <div className="text-gray-500 hidden md:block">
          {shellEnglish ? 'No active real SCADA connection' : 'Sin conexión SCADA real activa'}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative">
        <aside className="cr-global-sidebar no-print w-full md:w-64 bg-slate-950 border-r border-gray-800 flex flex-col justify-between shrink-0">
          <div>
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500 rounded text-slate-950">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="cr-sidebar-brand-copy">
                  <p className="text-sm font-bold tracking-tight text-white uppercase">ORBI PVMetrics IA</p>
                  <p className="text-[9px] text-gray-500 font-mono tracking-wider">Demo Client v1.1</p>
                </div>
              </div>
            </div>

            <div className="cr-workspace-controls p-4 border-b border-gray-800 space-y-3">
              <div>
                <label htmlFor="workspace-company" className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-amber-500" /> {shellEnglish ? 'Company Workspace' : 'Workspace Empresa'}
                </label>
                <select
                  id="workspace-company"
                  aria-label={shellEnglish ? 'Company Workspace' : 'Workspace Empresa'}
                  value={activeCompanyId}
                  onChange={handleCompanyChange}
                  className="w-full bg-gray-900 border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-amber-500 mt-1.5 font-semibold"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="workspace-plant" className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Radio className="w-3 h-3 text-amber-500" /> {shellEnglish ? 'Solar Plant / BESS' : 'Planta Solar / BESS'}
                </label>
                <select
                  id="workspace-plant"
                  aria-label={shellEnglish ? 'Solar Plant / BESS' : 'Planta Solar / BESS'}
                  value={activePlantId}
                  onChange={(e) => setActivePlantId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-amber-500 mt-1.5"
                >
                  {activeCompany.plants.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:hidden p-4 flex justify-between items-center bg-gray-900/50 border-b border-gray-800">
              <span className="text-xs font-semibold text-gray-300">{shellEnglish ? 'Navigation' : 'Navegación'}</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="primary-navigation"
                className="rounded p-1 text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            <nav id="primary-navigation" className={`p-3 space-y-1 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeView === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    aria-current={isSelected ? 'page' : undefined}
                    onClick={() => {
                      setClimateRecoveryMode('free');
                      setActiveView(item.id as MainViewType);
                      setMobileMenuOpen(false);
                    }}
                    className={`cr-global-nav-button w-full flex min-h-11 items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="cr-sidebar-label truncate">{item.label}</span>
                      {'badge' in item && item.badge && (
                        <span
                          className={`cr-nav-badge shrink-0 rounded px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider ${
                            isSelected
                              ? 'bg-slate-950/15 text-slate-900'
                              : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="cr-sidebar-footer p-4 border-t border-gray-800 text-[9px] text-gray-500 space-y-2 hidden md:block">
            <p className="leading-relaxed font-sans">
              <strong>{shellEnglish ? 'Sandbox guarantee:' : 'Garantía de Sandbox:'}</strong> {shellEnglish ? 'No active connection to real EMS/BMS or SCADA.' : 'Sin conexión con EMS/BMS o SCADA real activo.'}
            </p>
            <p className="text-[8px] text-gray-600">
              ORBI PVMetrics IA — Solar Forecasting, PV & BESS Simulation.
            </p>
          </div>
        </aside>

        <main className="cr-main-display flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[100vh] custom-scrollbar">
          <div className="cr-operational-banner no-print p-3 bg-gray-900/50 border border-gray-850 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-400 leading-relaxed">
              <strong>{shellEnglish ? 'Operational boundary:' : 'Exclusividad de Operación:'}</strong> {shellEnglish
                ? 'ORBI PVMetrics IA does not operate BESS, send commands to EMS/BMS, or execute energy sales. This software is read-only in a local demonstration simulation. Commercial windows are non-binding technical evaluation suggestions.'
                : 'ORBI PVMetrics IA no opera BESS, no envía comandos al EMS/BMS y no ejecuta ventas de energía. Este software opera de manera read-only en simulación local demostrativa. Las ventanas comerciales son sugerencias de evaluación técnica no vinculantes.'}
            </div>
          </div>

          <div className="animate-fadeIn">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export const OrbiPVMetricsStandaloneApp: React.FC = () => {
  return (
    <StateProvider>
      <OrbiPVMetricsStandaloneInner />
    </StateProvider>
  );
};