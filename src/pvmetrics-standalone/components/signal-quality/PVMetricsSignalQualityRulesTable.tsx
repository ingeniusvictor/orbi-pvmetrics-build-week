import React, { useState, useMemo } from 'react';
import { PVMetricsSignalQualityRule, PVMetricsSignalQualityRuleStatus, PVMetricsSignalQualityRuleSeverity } from '../../types/pvmetrics-signal-quality-rules.types';
import { Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';

type PVMetricsSignalQualityRulesTableProps = {
  rules: PVMetricsSignalQualityRule[];
};

const domainLabels = {
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

const statusLabels: Record<PVMetricsSignalQualityRuleStatus, string> = {
  passed: 'SUPERADA',
  warning: 'ADVERTENCIA',
  failed: 'FALLIDA',
  'not-tested': 'NO PROBADA',
  blocked: 'BLOQUEADA',
};

const severityLabels: Record<PVMetricsSignalQualityRuleSeverity, string> = {
  info: 'INFORMACIÓN',
  warning: 'ADVERTENCIA',
  critical: 'CRÍTICA',
};

const ruleTypeLabels = {
  'presence-check': 'Presencia',
  'range-check': 'Rango',
  'unit-check': 'Unidad',
  'timestamp-check': 'Timestamp',
  'stale-check': 'Obsolescencia',
  'frozen-signal-check': 'Señal congelada',
  'quality-threshold-check': 'Calidad mínima',
  'source-authorization-check': 'Autorización fuente',
  'cross-source-delta-check': 'Diferencia entre fuentes',
  'critical-signal-readiness-check': 'Readiness crítica',
};

const actionLabels = {
  monitor: 'Monitorear',
  'review-mapping': 'Revisar mapeo',
  'request-client-data': 'Solicitar data cliente',
  'validate-unit': 'Validar unidad',
  'validate-range': 'Validar rango',
  'check-source-authorization': 'Revisar autorización',
  'confirm-scada-tag': 'Confirmar tag SCADA',
  'confirm-instrument-health': 'Confirmar instrumento',
  'prepare-readonly-pilot': 'Preparar piloto read-only',
  'no-action-required': 'Sin acción requerida',
};

export const PVMetricsSignalQualityRulesTable: React.FC<PVMetricsSignalQualityRulesTableProps> = ({ rules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
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

  const statuses = useMemo(() => {
    const set = new Set<PVMetricsSignalQualityRuleStatus>();
    rules.forEach((r) => set.add(r.status));
    return Array.from(set);
  }, [rules]);

  const severities = useMemo(() => {
    const set = new Set<PVMetricsSignalQualityRuleSeverity>();
    rules.forEach((r) => set.add(r.severity));
    return Array.from(set);
  }, [rules]);

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesSearch =
        rule.signalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.tagKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.ruleLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || rule.status === selectedStatus;
      const matchesSeverity = selectedSeverity === 'all' || rule.severity === selectedSeverity;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [rules, searchTerm, selectedStatus, selectedSeverity]);

  const getStatusColor = (status: PVMetricsSignalQualityRuleStatus) => {
    switch (status) {
      case 'passed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      case 'failed':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
      case 'blocked':
        return 'text-red-500 bg-red-500/10 border-red-500/25';
      case 'not-tested':
      default:
        return 'text-gray-400 bg-gray-950 border-gray-800';
    }
  };

  const getSeverityColor = (severity: PVMetricsSignalQualityRuleSeverity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20 font-bold';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'info':
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  const getQualityColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (pct >= 70) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (pct >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" id="signal-quality-rules-table-container">
      {/* Filters Toolbar */}
      <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar regla por señal, tag, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">TODOS</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 font-mono uppercase">Severidad:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-xs text-gray-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">TODAS</option>
              {severities.map((sev) => (
                <option key={sev} value={sev}>
                  {severityLabels[sev]}
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
              <th className="py-3 px-3">Señal / Tag</th>
              <th className="py-3 px-3">Dominio</th>
              <th className="py-3 px-3">Fuente</th>
              <th className="py-3 px-3">Regla Evaluada</th>
              <th className="py-3 px-3 text-center">Estado</th>
              <th className="py-3 px-3 text-center">Severidad</th>
              <th className="py-3 px-3 text-center">Calidad</th>
              <th className="py-3 px-3 text-center">Criticidad</th>
              <th className="py-3 px-3">Acción Recomendada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredRules.length > 0 ? (
              filteredRules.map((rule) => {
                const isExpanded = expandedIds.has(rule.id);
                return (
                  <React.Fragment key={rule.id}>
                    {/* Primary Row */}
                    <tr
                      className={`hover:bg-gray-850/40 transition-colors text-xs cursor-pointer ${isExpanded ? 'bg-gray-850/20' : ''}`}
                      onClick={() => toggleRow(rule.id)}
                    >
                      <td className="py-3 px-4 text-center">
                        <button className="text-gray-500 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-200 block">{rule.signalName}</span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{rule.tagKey}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] text-gray-400 bg-gray-950 px-2 py-0.5 rounded border border-gray-850">
                          {domainLabels[rule.domain]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-400 font-mono text-[10px]">
                        {sourceLabels[rule.expectedSource]}
                      </td>

                      <td className="py-3 px-3 text-gray-300">
                        <span className="font-medium text-gray-200">{ruleTypeLabels[rule.ruleType]}</span>
                        <span className="text-[10px] text-gray-500 block">{rule.ruleLabel}</span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusColor(rule.status)}`}>
                          {statusLabels[rule.status]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityColor(rule.severity)}`}>
                          {severityLabels[rule.severity]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${getQualityColor(rule.qualityPct)}`}>
                          {rule.qualityPct}%
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          rule.criticality === 'critical' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                          rule.criticality === 'high' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                          rule.criticality === 'medium' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                          'text-gray-500 bg-gray-950 border-gray-850'
                        }`}>
                          {rule.criticality.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-gray-300 font-medium">
                        <span className="px-2 py-1 bg-gray-950/80 rounded border border-gray-800 text-[11px]">
                          {actionLabels[rule.recommendedAction]}
                        </span>
                      </td>
                    </tr>

                    {/* Secondary Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-gray-950/50">
                        <td colSpan={10} className="py-4 px-6 border-b border-gray-850">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px]">
                            {/* Condición esperada */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-cyan-400" />
                                REGLA / CONDICIÓN ESPERADA
                              </h4>
                              <p className="text-gray-300 leading-relaxed">
                                {rule.expectedCondition}
                              </p>
                            </div>

                            {/* Hallazgo simulado */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                HALLAZGO SIMULADO
                              </h4>
                              <p className="text-gray-300 leading-relaxed">
                                {rule.simulatedFinding}
                              </p>
                            </div>

                            {/* Nota de riesgo */}
                            <div className="p-3 bg-gray-900 border border-gray-850 rounded-lg">
                              <h4 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                EVALUACIÓN DE RIESGO
                              </h4>
                              <p className="text-gray-300 leading-relaxed italic">
                                "{rule.riskNote}"
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
                <td colSpan={10} className="py-8 text-center text-xs text-gray-500 font-mono">
                  No se encontraron reglas con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-gray-950/40 border-t border-gray-800 text-[10px] font-mono text-gray-500 flex justify-between">
        <span>Mostrando {filteredRules.length} de {rules.length} reglas evaluadas</span>
        <span>Motor de Reglas v1N-B.2A</span>
      </div>
    </div>
  );
};
