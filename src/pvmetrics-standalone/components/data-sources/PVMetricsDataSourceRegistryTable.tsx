import React, { useState } from 'react';
import { PVMetricsDataSource, PVMetricsDataSourceType, PVMetricsDataSourceStatus, PVMetricsDataSourceSecurityMode, PVMetricsDataSourceRefreshMode } from '../../types/pvmetrics-data-source.types';
import { ChevronDown, ChevronUp, Radio, HelpCircle, Shield, AlertTriangle, Cloud, Settings2, BarChart, Zap, Activity } from 'lucide-react';

type PVMetricsDataSourceRegistryTableProps = {
  sources: PVMetricsDataSource[];
};

const statusLabel: Record<PVMetricsDataSourceStatus, string> = {
  'active-demo': 'DEMO ACTIVA',
  available: 'DISPONIBLE',
  simulated: 'SIMULADA',
  pending: 'PENDIENTE',
  'not-authorized': 'NO AUTORIZADA',
  error: 'ERROR',
};

const statusColors: Record<PVMetricsDataSourceStatus, string> = {
  'active-demo': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  available: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  simulated: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'not-authorized': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  error: 'text-red-500 bg-red-500/10 border-red-500/20',
};

const securityLabel: Record<PVMetricsDataSourceSecurityMode, string> = {
  'local-demo': 'DEMO LOCAL',
  'read-only': 'SOLO LECTURA',
  sandbox: 'SANDBOX',
  'not-connected': 'NO CONECTADA',
};

const securityColors: Record<PVMetricsDataSourceSecurityMode, string> = {
  'local-demo': 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5',
  'read-only': 'text-cyan-400 border-cyan-500/10 bg-cyan-500/5',
  sandbox: 'text-indigo-400 border-indigo-500/10 bg-indigo-500/5',
  'not-connected': 'text-gray-400 border-gray-800 bg-gray-950/50',
};

const refreshLabel: Record<PVMetricsDataSourceRefreshMode, string> = {
  manual: 'MANUAL',
  scheduled: 'PROGRAMADO',
  'near-real-time': 'CASI REALTIME',
  'not-applicable': 'NO APLICA',
};

const typeIconMap: Record<PVMetricsDataSourceType, React.FC<{ className?: string }>> = {
  'demo-local': Radio,
  'csv-historical': BarChart,
  'excel-workbook': BarChart,
  'client-api': Cloud,
  'scada-readonly': Settings2,
  'data-logger': Settings2,
  'energy-meter': Shield,
  'weather-station': Cloud,
  'bess-ems': Shield,
  'bess-bms': Settings2,
  'bess-pcs': Zap,
  'bess-meter': Activity,
  'poi-meter': Activity,
  'bess-cloud-portal': Cloud,
};

export const PVMetricsDataSourceRegistryTable: React.FC<PVMetricsDataSourceRegistryTableProps> = ({ sources }) => {
  const [expandedId, setExpandedId] = useState<string | null>('demo-local');

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" id="datasource-registry">
      <div className="p-5 border-b border-gray-800/60 bg-gray-900/50 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-200 tracking-wider uppercase">CATÁLOGO DE REGISTRO DE FUENTES</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Definición lógica de origen de señales, mapeo de seguridad y nivel de preparación.</p>
        </div>
        <div className="text-[10px] text-gray-400 font-mono bg-gray-950 border border-gray-800 px-2 py-1 rounded">
          Total: {sources.length} fuentes de datos
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-950 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono border-b border-gray-800/80">
            <tr>
              <th className="py-3 px-4">Fuente / Origen</th>
              <th className="py-3 px-4 hidden md:table-cell">Tipo</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 hidden sm:table-cell">Seguridad</th>
              <th className="py-3 px-4 hidden lg:table-cell">Refresco</th>
              <th className="py-3 px-4">Readiness</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {sources.map((source) => {
              const isExpanded = expandedId === source.id;
              const TypeIcon = typeIconMap[source.type] || Radio;
              
              // Readiness progress bar color
              let progressColor = 'bg-rose-500';
              let textReadinessColor = 'text-rose-400';
              if (source.readinessPct >= 80) {
                progressColor = 'bg-emerald-500';
                textReadinessColor = 'text-emerald-400';
              } else if (source.readinessPct >= 50) {
                progressColor = 'bg-cyan-500';
                textReadinessColor = 'text-cyan-400';
              } else if (source.readinessPct >= 30) {
                progressColor = 'bg-amber-500';
                textReadinessColor = 'text-amber-400';
              }

              return (
                <React.Fragment key={source.id}>
                  {/* Main Row */}
                  <tr 
                    onClick={() => toggleExpand(source.id)}
                    className={`hover:bg-gray-850/50 cursor-pointer transition-colors duration-200 ${isExpanded ? 'bg-gray-850/20' : ''}`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-gray-950 border border-gray-800 rounded-lg text-gray-400 flex-shrink-0">
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-200">{source.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{source.ownerLabel}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3.5 px-4 hidden md:table-cell font-mono text-[10px] text-gray-400 uppercase">
                      {source.type.replace('-', ' ')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${statusColors[source.status]}`}>
                        {statusLabel[source.status]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-semibold border border-gray-800 ${securityColors[source.securityMode]}`}>
                        {securityLabel[source.securityMode]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-[10px] text-gray-400">
                      {refreshLabel[source.refreshMode]}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-[120px]">
                        <span className={`text-[10px] font-mono font-bold ${textReadinessColor} min-w-[32px]`}>
                          {source.readinessPct}%
                        </span>
                        <div className="h-1.5 w-full bg-gray-950 rounded-full overflow-hidden hidden xs:block">
                          <div 
                            className={`h-full ${progressColor} rounded-full`}
                            style={{ width: `${source.readinessPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 text-gray-500 hover:text-gray-300 rounded hover:bg-gray-850">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={7} className="p-0 bg-gray-950/40 border-t border-b border-gray-850/50">
                        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 text-xs text-gray-300">
                          {/* Columna Izquierda: Detalles e Info General */}
                          <div className="md:col-span-5 space-y-3">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                DESCRIPCIÓN DE LA FUENTE
                              </span>
                              <p className="text-[11px] text-gray-400 leading-relaxed bg-gray-950 border border-gray-900 rounded p-2.5">
                                {source.description}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                                  Sincronización
                                </span>
                                <span className="text-[10px] font-mono text-gray-400 font-medium">{source.lastSyncLabel}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                                  Responsable Técnico
                                </span>
                                <span className="text-[10px] text-cyan-400 font-medium">{source.ownerLabel}</span>
                              </div>
                            </div>
                          </div>

                          {/* Columna Central: Señales Esperadas */}
                          <div className="md:col-span-4">
                            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                              SEÑALES ESPERADAS / MAREADOR ({source.expectedSignals.length})
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {source.expectedSignals.map((sig) => (
                                <span 
                                  key={sig} 
                                  className="text-[10px] font-mono bg-gray-900 border border-gray-800 text-gray-400 px-2 py-1 rounded"
                                >
                                  {sig}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Columna Derecha: Notas de Integración y Readiness */}
                          <div className="md:col-span-3 space-y-3">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                NOTAS DE INTEGRACIÓN
                              </span>
                              <div className="p-2.5 bg-gray-900/40 border border-gray-850 rounded text-[10px] text-gray-400 italic">
                                "{source.notes}"
                              </div>
                            </div>

                            {source.status === 'active-demo' ? (
                              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-start gap-1.5">
                                <Radio className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                                <span className="text-[9px] text-emerald-400 font-medium leading-normal">
                                  Esta fuente está alimentando actualmente el Monitoreo Live de la pestaña principal.
                                </span>
                              </div>
                            ) : (
                              <div className="p-2 bg-gray-900 border border-gray-800 rounded flex items-start gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                <span className="text-[9px] text-gray-500 font-medium leading-normal">
                                  No conectada. Preparada visualmente como Readiness para futura conexión de campo.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
