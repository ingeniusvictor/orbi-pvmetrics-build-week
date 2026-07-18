import React, { useState, useMemo } from 'react';
import { PVMetricsReadinessMatrixRow } from '../../types/pvmetrics-readiness-matrix.types';
import { Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Ban, HelpCircle, ShieldAlert, Key } from 'lucide-react';

type PVMetricsReadinessMatrixTableProps = {
  rows: PVMetricsReadinessMatrixRow[];
};

const authorizationLabel = {
  'authorized-demo': 'AUTORIZADA DEMO',
  'authorized-readonly': 'AUTORIZADA READ-ONLY',
  'pending-client-approval': 'PENDIENTE CLIENTE',
  'not-authorized': 'NO AUTORIZADA',
  'not-required': 'NO REQUIERE',
};

const readinessLabel = {
  'ready-demo': 'READY DEMO',
  'ready-readonly': 'READY READ-ONLY',
  partial: 'PARCIAL',
  blocked: 'BLOQUEADA',
  'not-ready': 'NO LISTA',
};

const riskLabel = {
  low: 'BAJO',
  medium: 'MEDIO',
  high: 'ALTO',
  critical: 'CRÍTICO',
};

const actionLabel = {
  'keep-demo': 'Mantener demo',
  'confirm-source': 'Confirmar fuente',
  'request-client-approval': 'Solicitar aprobación cliente',
  'confirm-scada-tag': 'Confirmar tag SCADA',
  'validate-signal-quality': 'Validar calidad',
  'validate-metering-source': 'Validar medición',
  'validate-weather-source': 'Validar meteo',
  'prepare-readonly-pilot': 'Preparar piloto read-only',
  'block-until-authorized': 'Bloquear hasta autorización',
};

const domainLabel = {
  'plant-production': 'Producción FV',
  'solar-resource': 'Recurso solar',
  weather: 'Clima',
  bess: 'BESS',
  scada: 'SCADA',
  inverter: 'Inversores',
  metering: 'Medición',
  losses: 'Pérdidas',
  availability: 'Disponibilidad',
};

const sourceLabels = {
  'demo-local': 'Demo local',
  'csv-historical': 'CSV histórico',
  'excel-workbook': 'Excel',
  'client-api': 'API cliente',
  'scada-readonly': 'SCADA read-only',
  'data-logger': 'Data logger',
  'energy-meter': 'Medidor',
  'weather-station': 'Estación meteo',
  'bess-ems': 'EMS BESS',
};

export const PVMetricsReadinessMatrixTable: React.FC<PVMetricsReadinessMatrixTableProps> = ({ rows }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReadiness, setSelectedReadiness] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.signalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.tagKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.sourceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesReadiness = selectedReadiness === 'all' || row.readinessStatus === selectedReadiness;
      const matchesRisk = selectedRisk === 'all' || row.riskLevel === selectedRisk;

      return matchesSearch && matchesReadiness && matchesRisk;
    });
  }, [rows, searchTerm, selectedReadiness, selectedRisk]);

  const getReadinessBadgeStyle = (status: string) => {
    switch (status) {
      case 'ready-readonly':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 font-bold';
      case 'ready-demo':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
      case 'partial':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      case 'blocked':
        return 'text-red-500 bg-red-500/10 border-red-500/25';
      case 'not-ready':
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
    }
  };

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical':
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20 font-bold';
    }
  };

  const getAuthorizationBadgeStyle = (status: string) => {
    switch (status) {
      case 'authorized-readonly':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'authorized-demo':
        return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
      case 'pending-client-approval':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'not-authorized':
      default:
        return 'text-rose-400 border-rose-500/20 bg-rose-500/5 font-bold';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" id="readiness-matrix-table-container">
      {/* Filters Toolbar */}
      <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar señal, tag, fuente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Readiness Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Preparación:</span>
            <select
              value={selectedReadiness}
              onChange={(e) => setSelectedReadiness(e.target.value)}
              className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">TODOS</option>
              <option value="ready-readonly">READY READ-ONLY</option>
              <option value="ready-demo">READY DEMO</option>
              <option value="partial">PARCIAL</option>
              <option value="blocked">BLOQUEADA</option>
              <option value="not-ready">NO LISTA</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Riesgo:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">TODOS</option>
              <option value="low">BAJO</option>
              <option value="medium">MEDIO</option>
              <option value="high">ALTO</option>
              <option value="critical">CRÍTICO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Layer */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider bg-gray-950/40 select-none">
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-3">Señal / Tag</th>
              <th className="py-3 px-3">Dominio</th>
              <th className="py-3 px-3">Fuente Esperada</th>
              <th className="py-3 px-3">Autorización</th>
              <th className="py-3 px-3 text-center">Estado Preparación</th>
              <th className="py-3 px-3 text-center">Riesgo</th>
              <th className="py-3 px-3 text-center">Calidad</th>
              <th className="py-3 px-3 text-center">Readiness %</th>
              <th className="py-3 px-3 text-center">Calidad Regla</th>
              <th className="py-3 px-3">Acción Recomendada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => {
                const isExpanded = expandedIds.has(row.id);
                return (
                  <React.Fragment key={row.id}>
                    {/* Primary Row */}
                    <tr
                      className={`hover:bg-gray-850/40 transition-colors text-xs cursor-pointer ${isExpanded ? 'bg-gray-850/20' : ''}`}
                      onClick={() => toggleRow(row.id)}
                    >
                      <td className="py-3 px-4 text-center">
                        <button className="text-gray-500 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-200 block">{row.signalName}</span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{row.tagKey}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-850">
                          {domainLabel[row.domain]}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-gray-300 block">{row.sourceName}</span>
                        <span className="text-[10px] text-gray-500 font-mono block">{sourceLabels[row.expectedSource]}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getAuthorizationBadgeStyle(row.authorizationStatus)}`}>
                          {authorizationLabel[row.authorizationStatus]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getReadinessBadgeStyle(row.readinessStatus)}`}>
                          {readinessLabel[row.readinessStatus]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBadgeStyle(row.riskLevel)}`}>
                          {riskLabel[row.riskLevel]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-gray-300">
                        {row.qualityPct}%
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                        {row.readinessPct}%
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          row.ruleStatusLabel === 'passed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                          row.ruleStatusLabel === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                          row.ruleStatusLabel === 'failed' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 font-bold' :
                          'text-gray-500 bg-gray-950 border-gray-850'
                        }`}>
                          {row.ruleStatusLabel.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-gray-950 rounded border border-gray-800 text-[11px] text-gray-300 block text-center truncate">
                          {actionLabel[row.recommendedAction]}
                        </span>
                      </td>
                    </tr>

                    {/* Secondary Row for Details */}
                    {isExpanded && (
                      <tr className="bg-gray-950/50">
                        <td colSpan={11} className="py-4 px-6 border-b border-gray-850">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[11px]">
                            {/* Readiness Note */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1">
                                Nota de Preparación
                              </h4>
                              <p className="text-gray-300 leading-relaxed italic">
                                "{row.readinessNote}"
                              </p>
                            </div>

                            {/* Criticidad */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1">
                                Criticidad de Señal
                              </h4>
                              <p className="text-gray-300 leading-normal flex items-center gap-1.5 font-bold uppercase">
                                <span className={`w-2 h-2 rounded-full ${
                                  row.signalCriticality === 'critical' ? 'bg-rose-500' :
                                  row.signalCriticality === 'high' ? 'bg-amber-500' :
                                  'bg-cyan-500'
                                }`} />
                                {row.signalCriticality}
                              </p>
                            </div>

                            {/* Fuente esperada */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1">
                                Fuente de Datos Conectada
                              </h4>
                              <p className="text-gray-300 leading-normal">
                                {row.sourceName} ({row.sourceStatusLabel.toUpperCase()})
                              </p>
                            </div>

                            {/* ID de señal */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1">
                                Código Técnico / ID
                              </h4>
                              <p className="text-gray-400 leading-normal font-mono">
                                {row.signalId}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-8 text-center text-xs text-gray-500 font-mono">
                  No se encontraron registros con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-gray-950/40 border-t border-gray-800 text-[10px] font-mono text-gray-500 flex justify-between">
        <span>Mostrando {filteredRows.length} de {rows.length} señales operacionales</span>
        <span>Sovereign Readiness Grid v1N-B.2B</span>
      </div>
    </div>
  );
};
