import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Copy, 
  CheckCircle, 
  Terminal, 
  FlameKindling, 
  Lock, 
  Unlock, 
  AlertTriangle,
  Info,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { PVMetricsIndependentAppManifest } from '../release/PVMetricsIndependentAppManifest';
import { PVMetricsIndependentQaChecklist } from '../release/PVMetricsIndependentQaChecklist';
import { PVMetricsReleaseNotes } from '../release/PVMetricsReleaseNotes';

export const PVMetricsIndependentReleasePanel: React.FC = () => {
  const [qaItems, setQaItems] = useState(PVMetricsIndependentQaChecklist);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'qa' | 'manifest'>('notes');

  const toggleQa = (id: number) => {
    setQaItems(prev => prev.map(item => item.id === id ? { ...item, verified: !item.verified } : item));
  };

  const handleCopySummary = () => {
    const summaryText = `--- ORBI PVMETRICS IA RELEASE SUMMARY ---
AppName: ${PVMetricsIndependentAppManifest.appName}
ReleaseName: ${PVMetricsIndependentAppManifest.releaseName}
AppMode: ${PVMetricsIndependentAppManifest.appMode}
DefaultPreset: ${PVMetricsIndependentAppManifest.defaultPreset}

[Estatus Operativo]: 100% STANDALONE DEMO
- Corporate Assistant Included: ${PVMetricsIndependentAppManifest.corporateAssistantIncluded}
- Foton Prime Included: ${PVMetricsIndependentAppManifest.fotonPrimeIncluded}
- SCADA Connected: ${PVMetricsIndependentAppManifest.realScadaConnected}
- BESS Control Enabled: ${PVMetricsIndependentAppManifest.bessControlEnabled}

[Declaración Obligatoria]:
Esta aplicación es independiente de ORBI Corporate Assistant. La demo opera en modo local, no utiliza datos reales del cliente, no conecta SCADA real, no opera BESS y no ejecuta ventas de energía.

[Módulos Clave]:
${PVMetricsReleaseNotes.features.map(f => `* ${f}`).join('\n')}

[Límites de Seguridad]:
${PVMetricsReleaseNotes.limitations.map(l => `* ${l}`).join('\n')}
-----------------------------------------`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifiedCount = qaItems.filter(q => q.verified).length;
  const progressPercent = Math.round((verifiedCount / qaItems.length) * 100);

  return (
    <div id="independent-release-panel" className="space-y-6">
      
      {/* Top Banner Release Lock Card */}
      <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-20 -bottom-20 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-mono text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
                RELEASE LOCKED & AUDITED
              </span>
              <span className="bg-gray-800 border border-gray-700 text-gray-300 font-mono text-[9px] px-2 py-0.5 rounded">
                v1.2 Stable
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white tracking-tight">
              Consola de Integridad & QA Standalone
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
              Consola unificada para certificar la estabilidad de la demo de ORBI PVMetrics IA, asegurando el desacoplamiento total de recursos compartidos del ecosistema original.
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition shadow-lg shadow-amber-500/10"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>¡Copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Resumen de Versión</span>
              </>
            )}
          </button>
        </div>

        {/* Required Disclosure Block */}
        <div className="mt-5 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <Info className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-300 leading-relaxed font-medium">
            <strong>Garantía de Aislamiento Corporativo:</strong> Esta aplicación es independiente de ORBI Corporate Assistant. La demo opera en modo local, no utiliza datos reales del cliente, no conecta SCADA real, no opera BESS y no ejecuta ventas de energía.
          </div>
        </div>
      </div>

      {/* Grid containing Quick Stats and Tab Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Controls & Stats */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-4 bg-slate-950 border border-gray-800 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Estatus Técnico</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-gray-900/60 border border-gray-850 rounded">
                <span className="text-gray-400 font-medium">TypeScript Build:</span>
                <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900/60 border border-gray-850 rounded">
                <span className="text-gray-400 font-medium">TypeScript Linter:</span>
                <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">PASSED</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900/60 border border-gray-850 rounded">
                <span className="text-gray-400 font-medium">Foton Prime Dependency:</span>
                <span className="text-rose-400 font-bold font-mono bg-rose-500/10 px-1.5 py-0.5 rounded">NONE</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-900/60 border border-gray-850 rounded">
                <span className="text-gray-400 font-medium">Corporate API Link:</span>
                <span className="text-rose-400 font-bold font-mono bg-rose-500/10 px-1.5 py-0.5 rounded">NONE</span>
              </div>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="p-3 bg-slate-950 border border-gray-800 rounded-xl space-y-1">
            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 ${
                activeTab === 'notes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              Release Notes (v1.2)
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 ${
                activeTab === 'qa' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              <FileCheck className="w-4 h-4 shrink-0" />
              Checklist QA ({progressPercent}%)
            </button>
            <button
              onClick={() => setActiveTab('manifest')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 ${
                activeTab === 'manifest' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-900'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              Manifiesto Standalone
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="lg:col-span-3 p-6 bg-slate-950 border border-gray-800 rounded-2xl min-h-[400px]">
          
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Notas de Lanzamiento Estable</h3>
                <span className="text-[10px] text-gray-400 font-mono">Última actualización: {PVMetricsReleaseNotes.releaseDate}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest text-[10px] mb-2.5 text-amber-400">Funcionalidades Principales Incluidas:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    {PVMetricsReleaseNotes.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-900 pt-4">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest text-[10px] mb-2.5 text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" /> Limitaciones de Sandbox de la Demo:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-400">
                    {PVMetricsReleaseNotes.limitations.map((limit, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-500 shrink-0 font-bold font-mono mt-0.5">•</span>
                        <span>{limit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Auditoría de Control de Calidad Independiente</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Certificación de aislamiento del módulo antes de la entrega</p>
                </div>
                <div className="text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                  {verifiedCount} / {qaItems.length} Verificados ({progressPercent}%)
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Interactive Checklist list */}
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {qaItems.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => toggleQa(q.id)}
                    className="w-full flex items-start gap-3 p-2.5 bg-gray-900/50 hover:bg-gray-900 border border-gray-850 rounded-lg text-left transition"
                  >
                    <div className="mt-0.5 shrink-0 text-amber-500">
                      {q.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-700 rounded-full" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-x-2">
                        <span className={`text-xs font-semibold ${q.verified ? 'text-gray-300 line-through' : 'text-white'}`}>
                          {q.requirement}
                        </span>
                        <span className="text-[8px] font-mono uppercase text-gray-500 tracking-wider">
                          [{q.category}]
                        </span>
                      </div>
                      {q.notes && <p className="text-[10px] text-gray-500 leading-normal">{q.notes}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-4">
              <div className="border-b border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Manifiesto de Aplicación Independiente</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Metadatos técnicos y declaración formal de recursos autónomos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-gray-900/60 border border-gray-850 rounded-lg space-y-2">
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">appName:</span>
                    <span className="text-white font-semibold">"{PVMetricsIndependentAppManifest.appName}"</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">releaseName:</span>
                    <span className="text-amber-400 font-semibold">"{PVMetricsIndependentAppManifest.releaseName}"</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">appMode:</span>
                    <span className="text-indigo-400">"{PVMetricsIndependentAppManifest.appMode}"</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">origin:</span>
                    <span className="text-gray-300">"{PVMetricsIndependentAppManifest.origin}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">defaultPreset:</span>
                    <span className="text-amber-400">"{PVMetricsIndependentAppManifest.defaultPreset}"</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/60 border border-gray-850 rounded-lg space-y-2">
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">corporateAssistantIncluded:</span>
                    <span className="text-rose-400 font-bold">false</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">fotonPrimeIncluded:</span>
                    <span className="text-rose-400 font-bold">false</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">commandCenterIncluded:</span>
                    <span className="text-rose-400 font-bold">false</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">realScadaConnected:</span>
                    <span className="text-rose-400 font-bold">false</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-850 pb-1.5">
                    <span className="text-gray-400">bessControlEnabled:</span>
                    <span className="text-rose-400 font-bold">false</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">realEnergySalesEnabled:</span>
                    <span className="text-rose-400 font-bold">false</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg text-xs text-gray-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-[10px]">
                  ENV LOCK: PVMetrics_STABLE_DEMO_v1.2 // PERSISTENCE: LOCAL_STORAGE // SCOPE: READ_ONLY_DEMO
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
