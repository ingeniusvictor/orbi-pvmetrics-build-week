import React, { useState } from 'react';
import { useAppState } from '../app/StateContext';
import { Company, Plant, PlantType } from '../types';
import { Settings, Save, RefreshCw, Upload, Download, ShieldAlert, Plus, Trash2, Battery, Sun, Network, FileCheck } from 'lucide-react';
import { PVMetricsIndependentReleasePanel } from '../../components/PVMetricsIndependentReleasePanel';
import { PVMetricsDemoSecurityBoundaryCard } from '../../components/PVMetricsDemoSecurityBoundaryCard';
import { PVMetricsDeploymentChecklistPanel } from '../../components/PVMetricsDeploymentChecklistPanel';
import { PVMetricsVersionRegistryBadge } from './system/PVMetricsVersionRegistryBadge';
import { PVMetricsCompetitiveStrategyCard } from './system/PVMetricsCompetitiveStrategyCard';


export const ConfigView: React.FC = () => {
  const { 
    companies, 
    setCompanies, 
    activeCompanyId, 
    activePlantId, 
    activeCompany, 
    activePlant,
    updatePlantConfig,
    lockdown,
    resetAllToDefault
  } = useAppState();

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [configTab, setConfigTab] = useState<'parameters' | 'release'>('parameters');

  // Editable parameters for current active plant
  const [pvCapacity, setPvCapacity] = useState(activePlant.pv.capacityMW);
  const [trackerType, setTrackerType] = useState(activePlant.pv.trackerType);
  const [bessCapacityMW, setBessCapacityMW] = useState(activePlant.bess.capacityMW);
  const [bessCapacityMWh, setBessCapacityMWh] = useState(activePlant.bess.capacityMWh);
  const [bessEff, setBessEff] = useState(activePlant.bess.roundTripEfficiency);
  const [bessDegradation, setBessDegradation] = useState(activePlant.bess.degradationRatePercentPerYear);
  const [scadaProtocol, setScadaProtocol] = useState(activePlant.scada.protocol);

  const handleSavePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockdown.enabled) {
      setErrorMsg('Las configuraciones están bloqueadas por el Pre-Meeting Lockdown.');
      return;
    }

    const updated: Plant = {
      ...activePlant,
      pv: {
        ...activePlant.pv,
        capacityMW: Number(pvCapacity),
        trackerType: trackerType,
      },
      bess: {
        ...activePlant.bess,
        capacityMW: Number(bessCapacityMW),
        capacityMWh: Number(bessCapacityMWh),
        roundTripEfficiency: Number(bessEff),
        degradationRatePercentPerYear: Number(bessDegradation),
      },
      scada: {
        ...activePlant.scada,
        protocol: scadaProtocol,
      }
    };

    updatePlantConfig(activeCompanyId, activePlantId, updated);
    setMessage('Configuración de la planta guardada con éxito.');
    setTimeout(() => setMessage(''), 3000);
  };

  // Backup actions
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ companies }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ORBI_PVMetrics_Backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (lockdown.enabled) {
      setErrorMsg('No se puede importar backup durante el Lockdown.');
      return;
    }

    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.companies && Array.isArray(parsed.companies)) {
            setCompanies(parsed.companies);
            setMessage('¡Copia de seguridad importada con éxito!');
            setTimeout(() => setMessage(''), 3000);
          } else {
            throw new Error('Estructura de JSON inválida.');
          }
        } catch (err) {
          setErrorMsg('Archivo JSON corrupto o inválido.');
          setTimeout(() => setErrorMsg(''), 3000);
        }
      };
    }
  };

  return (
    <div className="space-y-6" id="config-view">
      {/* Pre-Meeting Lockdown Shield */}
      {lockdown.enabled && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs">
            <strong className="text-rose-200">Parámetros Congelados:</strong> El Pre-Meeting Lockdown está activo. Las modificaciones de capacidad y el cargado de copias de seguridad están bloqueados. Diríjase a <strong>Reportes &gt; Pre-Meeting Lockdown</strong> para desbloquearlo.
          </div>
        </div>
      )}

      {/* PV Metrics Version Registry */}
      <PVMetricsVersionRegistryBadge />

      {/* Competitive Strategy Lock */}
      <PVMetricsCompetitiveStrategyCard />

      {/* Sub-tab Navigation */}
      <div className="flex gap-2 border-b border-gray-800 pb-2 flex-wrap">
        <button
          onClick={() => setConfigTab('parameters')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition flex items-center gap-1.5 ${
            configTab === 'parameters'
              ? 'border-amber-500 text-white font-bold bg-amber-500/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-amber-500" />
          Parámetros de Planta ({activePlant.name})
        </button>
        <button
          onClick={() => setConfigTab('release')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition flex items-center gap-1.5 ${
            configTab === 'release'
              ? 'border-amber-500 text-white font-bold bg-amber-500/5'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-amber-500" />
          Control de Calidad & Release Lock
        </button>
      </div>

      {configTab === 'parameters' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Plant configuration forms */}
          <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-500" />
              Configuración de Parámetros de Planta ({activePlant.name})
            </h3>

            <form onSubmit={handleSavePlant} className="space-y-4 text-xs">
              
              {/* PV Section */}
              <div className="space-y-3 p-4 bg-gray-950 border border-gray-850 rounded-lg">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Sun className="w-4 h-4 text-amber-500" /> Parámetros Fotovoltaicos (FV)
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Capacidad PV Nominal (MW):</label>
                    <input 
                      type="number" 
                      value={pvCapacity}
                      disabled={lockdown.enabled}
                      onChange={(e) => setPvCapacity(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Tipo de Seguidor (Tracker):</label>
                    <select 
                      value={trackerType}
                      disabled={lockdown.enabled}
                      onChange={(e) => setTrackerType(e.target.value as any)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Fixed">Fijo (Fixed)</option>
                      <option value="Single-Axis">Eje Único (Single-Axis)</option>
                      <option value="Dual-Axis">Eje Doble (Dual-Axis)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* BESS Section */}
              <div className="space-y-3 p-4 bg-gray-950 border border-gray-850 rounded-lg">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Battery className="w-4 h-4 text-emerald-400" /> Parámetros de Batería (BESS)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Capacidad BESS Nominal (MW):</label>
                    <input 
                      type="number" 
                      value={bessCapacityMW}
                      disabled={lockdown.enabled}
                      onChange={(e) => setBessCapacityMW(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Capacidad Energía Nominal (MWh):</label>
                    <input 
                      type="number" 
                      value={bessCapacityMWh}
                      disabled={lockdown.enabled}
                      onChange={(e) => setBessCapacityMWh(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Eficiencia de Ciclo RTE (%):</label>
                    <input 
                      type="number" 
                      value={bessEff}
                      disabled={lockdown.enabled}
                      onChange={(e) => setBessEff(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Tasa Degradación Anual (%/año):</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={bessDegradation}
                      disabled={lockdown.enabled}
                      onChange={(e) => setBessDegradation(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SCADA Parameters */}
              <div className="space-y-3 p-4 bg-gray-950 border border-gray-850 rounded-lg">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Network className="w-4 h-4 text-indigo-400" /> Parámetros SCADA
                </h4>

                <div>
                  <label className="text-gray-400 block mb-1">Protocolo Local:</label>
                  <select 
                    value={scadaProtocol}
                    disabled={lockdown.enabled}
                    onChange={(e) => setScadaProtocol(e.target.value as any)}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Modbus TCP">Modbus TCP (Puerto 502)</option>
                    <option value="IEC 104">IEC 60870-5-104 (Puerto 2404)</option>
                    <option value="DNP3">DNP3 Secure (Puerto 20000)</option>
                    <option value="OPC UA">OPC UA Client (Puerto 4840)</option>
                  </select>
                </div>
              </div>

              {/* Live Monitoring Parameters (Módulo 1M-B.2) */}
              <div className="space-y-3 p-4 bg-gray-950 border border-gray-850 rounded-lg" id="live-monitoring-parameters">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Settings className="w-4 h-4 text-cyan-400" /> Parámetros de Monitoreo Live FV + BESS
                </h4>
                
                <p className="text-[10px] text-gray-400">
                  Estos parámetros ajustan la simulación visual y preparan la futura lectura read-only de datos reales. No ejecutan comandos hacia activos físicos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-400 block mb-1">Capacidad Planta FV (MW):</label>
                    <input 
                      type="text" 
                      value="6.0 MW" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Umbral PR Aceptable (%):</label>
                    <input 
                      type="text" 
                      value="80%" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Umbral Temperatura Módulo (°C):</label>
                    <input 
                      type="text" 
                      value="65°C" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Tolerancia Telemetría vs SCADA (%):</label>
                    <input 
                      type="text" 
                      value="5%" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Potencia Máxima BESS (MW):</label>
                    <input 
                      type="text" 
                      value="2.0 MW" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Simulación SCADA Activa:</label>
                    <input 
                      type="text" 
                      value="Sí (Activo)" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Eventos Simulados Activos:</label>
                    <input 
                      type="text" 
                      value="Sí (Activo)" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Zona Horaria:</label>
                    <input 
                      type="text" 
                      value="America/Santiago" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Intervalo de Refresco Visual:</label>
                    <input 
                      type="text" 
                      value="30 segundos" 
                      disabled 
                      className="w-full bg-gray-900/50 border border-gray-800/80 rounded px-2.5 py-2 text-gray-400 font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* Message prompts */}
              {message && <div className="text-xs text-emerald-400 font-bold">{message}</div>}
              {errorMsg && <div className="text-xs text-rose-400 font-bold">{errorMsg}</div>}

              <button 
                type="submit" 
                disabled={lockdown.enabled}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Guardar Configuración de Planta
              </button>
            </form>
          </div>

          {/* Global actions: Reset default & JSON backups */}
          <div className="space-y-6">
            {/* Backup Suite */}
            <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Copia de Seguridad (Backup Suite)</h3>
              <p className="text-xs text-gray-400">
                Exporte el estado completo del workspace (multiempresa) a un archivo local JSON para recuperarlo posteriormente.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={handleExportBackup}
                  className="w-full py-2 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar Configuración JSON
                </button>

                <div className="relative">
                  <input 
                    type="file" 
                    accept=".json"
                    disabled={lockdown.enabled}
                    onChange={handleImportBackup}
                    className="hidden" 
                    id="backup-upload" 
                  />
                  <label 
                    htmlFor="backup-upload"
                    className={`w-full py-2 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-300 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${lockdown.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Importar Configuración JSON
                  </label>
                </div>
              </div>
            </div>

            {/* Reset System default */}
            <div className="p-5 bg-gray-900 border border-gray-800 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-white">Mantenimiento de Sistema</h3>
              <p className="text-xs text-gray-400">
                Restablezca todos los parámetros del simulador, presets y checklists del Local Storage a los valores originales de fábrica.
              </p>

              <button 
                onClick={() => {
                  if(window.confirm('¿Desea restablecer toda la base de datos a sus valores por defecto? Esta acción no se puede deshacer.')) {
                    resetAllToDefault();
                    setMessage('Sistema reiniciado con éxito. Recargue para refrescar.');
                    window.location.reload();
                  }
                }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restablecer Valores de Fábrica
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <PVMetricsIndependentReleasePanel />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PVMetricsDeploymentChecklistPanel />
            </div>
            <div className="lg:col-span-1">
              <PVMetricsDemoSecurityBoundaryCard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
