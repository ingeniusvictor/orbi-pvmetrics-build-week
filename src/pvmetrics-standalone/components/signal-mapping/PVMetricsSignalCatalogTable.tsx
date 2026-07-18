import React, { useState, useMemo } from 'react';
import { PVMetricsExpectedSignal, PVMetricsSignalDomain, PVMetricsSignalValidationStatus } from '../../types/pvmetrics-signal-mapping.types';
import { Search, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info, Star, HelpCircle, ShieldAlert } from 'lucide-react';

type PVMetricsSignalCatalogTableProps = {
  signals: PVMetricsExpectedSignal[];
};

const domainLabels: Record<PVMetricsSignalDomain, string> = {
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

const mappingStatusLabels = {
  'mapped-demo': 'MAPEADA DEMO',
  'mapped-readonly': 'MAPEADA READ-ONLY',
  'pending-mapping': 'PENDIENTE MAPEO',
  'requires-client-data': 'REQUIERE DATA CLIENTE',
  'not-authorized': 'NO AUTORIZADA',
};

const validationStatusLabels = {
  valid: 'VÁLIDA',
  warning: 'ADVERTENCIA',
  missing: 'AUSENTE',
  'out-of-range': 'FUERA DE RANGO',
  stale: 'OBSOLETA',
  'unit-mismatch': 'UNIDAD INCORRECTA',
  'not-tested': 'NO PROBADA',
};

const criticalityLabels = {
  low: 'BAJA',
  medium: 'MEDIA',
  high: 'ALTA',
  critical: 'CRÍTICA',
};

const refreshExpectationLabels = {
  'real-time': 'Real-time',
  'near-real-time': 'Near RT',
  hourly: 'Horario',
  daily: 'Diario',
  manual: 'Manual',
  'not-applicable': 'N/A',
};

export const PVMetricsSignalCatalogTable: React.FC<PVMetricsSignalCatalogTableProps> = ({ signals }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Toggle rows
  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const domains = useMemo(() => {
    const set = new Set<PVMetricsSignalDomain>();
    signals.forEach((s) => set.add(s.domain));
    return Array.from(set);
  }, [signals]);

  const statuses = useMemo(() => {
    const set = new Set<PVMetricsSignalValidationStatus>();
    signals.forEach((s) => set.add(s.validationStatus));
    return Array.from(set);
  }, [signals]);

  // Filter signals
  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      const matchesSearch = 
        signal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.tagKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signal.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDomain = selectedDomain === 'all' || signal.domain === selectedDomain;
      const matchesStatus = selectedStatus === 'all' || signal.validationStatus === selectedStatus;

      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [signals, searchTerm, selectedDomain, selectedStatus]);

  const formatRange = (min: number | null, max: number | null) => {
    if (min === null && max === null) return 'No numérico';
    if (min === null) return `≤ ${max}`;
    if (max === null) return `≥ ${min}`;
    return `${min} — ${max}`;
  };

  const getQualityBadgeColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (pct >= 70) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (pct >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getValidationBadgeColor = (status: PVMetricsSignalValidationStatus) => {
    switch (status) {
      case 'valid':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'warning':
      case 'stale':
      case 'unit-mismatch':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      case 'missing':
      case 'out-of-range':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
      case 'not-tested':
      default:
        return 'text-gray-400 bg-gray-950 border-gray-800';
    }
  };

  const getMappingBadgeColor = (status: string) => {
    if (status.startsWith('mapped')) {
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/15';
    }
    return 'text-gray-400 bg-gray-950 border-gray-800';
  };

  const getCriticalityBadgeColor = (crit: string) => {
    switch (crit) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20 font-bold';
      case 'high':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'medium':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'text-gray-500 bg-gray-950 border-gray-850';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" id="signal-catalog-table-container">
      {/* Filters Toolbar */}
      <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por señal, tag, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Dominio:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">TODOS</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {domainLabels[d]}
                </option>
              ))}
            </select>
          </div>

          {/* Validation Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Validación:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">TODOS</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {validationStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider bg-gray-950/40 select-none">
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-3">Señal</th>
              <th className="py-3 px-3">Tag interno</th>
              <th className="py-3 px-3">Dominio</th>
              <th className="py-3 px-3">Fuente esperada</th>
              <th className="py-3 px-3">Unidad</th>
              <th className="py-3 px-3">Rango válido</th>
              <th className="py-3 px-3">Refresco</th>
              <th className="py-3 px-3 text-center">Mapeo</th>
              <th className="py-3 px-3 text-center">Validación</th>
              <th className="py-3 px-3 text-center">Calidad</th>
              <th className="py-3 px-3 text-center">Criticidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredSignals.length > 0 ? (
              filteredSignals.map((signal) => {
                const isExpanded = expandedIds.has(signal.id);
                return (
                  <React.Fragment key={signal.id}>
                    {/* Primary Row */}
                    <tr 
                      className={`hover:bg-gray-850/40 transition-colors text-xs cursor-pointer ${isExpanded ? 'bg-gray-850/20' : ''}`}
                      onClick={() => toggleRow(signal.id)}
                    >
                      <td className="py-3 px-4 text-center">
                        <button className="text-gray-500 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      
                      <td className="py-3 px-3 font-semibold text-gray-200">
                        {signal.name}
                      </td>

                      <td className="py-3 px-3 font-mono text-[10px] text-gray-400">
                        {signal.tagKey}
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-850">
                          {domainLabels[signal.domain]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-400 font-mono text-[10px]">
                        {sourceLabels[signal.expectedSource]}
                      </td>

                      <td className="py-3 px-3 font-mono text-gray-400">
                        {signal.unit}
                      </td>

                      <td className="py-3 px-3 font-mono text-[10px] text-gray-400">
                        {formatRange(signal.validMin, signal.validMax)}
                      </td>

                      <td className="py-3 px-3 font-mono text-[10px] text-gray-400">
                        {refreshExpectationLabels[signal.refreshExpectation]}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getMappingBadgeColor(signal.mappingStatus)}`}>
                          {mappingStatusLabels[signal.mappingStatus]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getValidationBadgeColor(signal.validationStatus)}`}>
                          {validationStatusLabels[signal.validationStatus]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${getQualityBadgeColor(signal.qualityPct)}`}>
                          {signal.qualityPct}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getCriticalityBadgeColor(signal.criticality)}`}>
                          {criticalityLabels[signal.criticality]}
                        </span>
                      </td>
                    </tr>

                    {/* Secondary Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-gray-950/50">
                        <td colSpan={12} className="py-4 px-6 border-b border-gray-850">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px]">
                            {/* Descripción */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-cyan-400" />
                                DESCRIPCIÓN DE SEÑAL
                              </h4>
                              <p className="text-gray-300 leading-relaxed">
                                {signal.description}
                              </p>
                            </div>

                            {/* Módulos de destino */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-amber-400" />
                                MÓDULOS RECIPIENTES
                              </h4>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {signal.usedInModules.map((m) => (
                                  <span key={m} className="px-2 py-0.5 bg-gray-950 border border-gray-800 rounded text-[9px] text-gray-400 font-mono">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Nota de validación */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                NOTA DE VALIDACIÓN TÉCNICA
                              </h4>
                              <p className="text-gray-300 leading-relaxed italic">
                                "{signal.validationNote}"
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
                <td colSpan={12} className="py-8 text-center text-xs text-gray-500 font-mono">
                  No se encontraron señales con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-gray-950/40 border-t border-gray-800 text-[10px] font-mono text-gray-500 flex justify-between">
        <span>Mostrando {filteredSignals.length} de {signals.length} señales catalogadas</span>
        <span>Mapeo Técnico v1N-B.1</span>
      </div>
    </div>
  );
};
