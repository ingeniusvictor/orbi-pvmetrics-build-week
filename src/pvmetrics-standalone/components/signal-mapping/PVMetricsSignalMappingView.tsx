import React, { useState } from 'react';
import { createPvMetricsSignalMappingDemo } from '../../data/createPvMetricsSignalMappingDemo';
import { PVMetricsSignalMappingOverviewCards } from './PVMetricsSignalMappingOverviewCards';
import { PVMetricsSignalValidationSummaryCard } from './PVMetricsSignalValidationSummaryCard';
import { PVMetricsSignalCatalogTable } from './PVMetricsSignalCatalogTable';
import { PVMetricsSignalMappingSecurityNote } from './PVMetricsSignalMappingSecurityNote';
import { PVMetricsSignalQualityRulesView } from '../signal-quality/PVMetricsSignalQualityRulesView';
import { PVMetricsReadinessMatrixView } from '../readiness-matrix/PVMetricsReadinessMatrixView';
import { Info, HelpCircle, FileText, ShieldCheck, Grid } from 'lucide-react';

export const PVMetricsSignalMappingView: React.FC = () => {
  const dataset = createPvMetricsSignalMappingDemo();
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'rules' | 'readiness'>('catalog');

  return (
    <div className="space-y-6" id="signal-mapping-view">
      {/* Header and badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              SIGNAL READINESS
            </span>
            <span className="text-[9px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              READ-ONLY FIRST
            </span>
            <span className="text-[9px] font-mono font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              NO WRITEBACK
            </span>
            <span className="text-[9px] font-mono font-extrabold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              CATÁLOGO LOCAL
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight font-sans uppercase">
            {activeSubTab === 'catalog' 
              ? 'SIGNAL MAPPING & VALIDATION' 
              : activeSubTab === 'rules' 
                ? 'SIGNAL QUALITY RULES' 
                : 'READINESS MATRIX'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {activeSubTab === 'catalog'
              ? 'Catálogo técnico de señales, unidades, rangos válidos y calidad de datos para futuras integraciones read-only.'
              : activeSubTab === 'rules'
                ? 'Motor local de reglas para validar presencia, rango, unidad, timestamp, calidad y preparación de señales críticas.'
                : 'Matriz de preparación para piloto read-only basada en fuentes, señales, reglas de calidad, riesgo y autorización.'}
          </p>
        </div>

        {/* Dynamic sub-tabs */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 self-start lg:self-center" id="signal-mapping-tabs">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'catalog'
                ? 'bg-amber-500 text-slate-950'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Catálogo de Señales
          </button>
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'rules'
                ? 'bg-amber-500 text-slate-950'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Reglas de Calidad
          </button>
          <button
            onClick={() => setActiveSubTab('readiness')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'readiness'
                ? 'bg-amber-500 text-slate-950'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Readiness Matrix
          </button>
        </div>
      </div>

      {activeSubTab === 'catalog' && (
        <>
          {/* Warning/Preparation Info Note */}
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-300 font-semibold">PREPARACIÓN DE MAPEO LÓGICO:</strong> Este módulo no consume datos reales. Define el mapa técnico de señales esperadas para preparar importación, validación y futuras integraciones autorizadas. Ningún puerto físico de red o telecontrol está expuesto.
            </div>
          </div>

          {/* Summary KPI Overview Cards */}
          <PVMetricsSignalMappingOverviewCards summary={dataset.summary} />

          {/* Validation Summary charts/breakdowns */}
          <PVMetricsSignalValidationSummaryCard signals={dataset.signals} />

          {/* Main Signal Catalog Table */}
          <PVMetricsSignalCatalogTable signals={dataset.signals} />

          {/* Safe Sovereign Mode Security Footer */}
          <PVMetricsSignalMappingSecurityNote />
        </>
      )}

      {activeSubTab === 'rules' && (
        <PVMetricsSignalQualityRulesView />
      )}

      {activeSubTab === 'readiness' && (
        <PVMetricsReadinessMatrixView />
      )}
    </div>
  );
};

export default PVMetricsSignalMappingView;

