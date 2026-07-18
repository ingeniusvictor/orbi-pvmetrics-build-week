import React from 'react';
import { createPvMetricsDataSourcesDemo } from '../../data/createPvMetricsDataSourcesDemo';
import { PVMetricsDataSourceOverviewCards } from './PVMetricsDataSourceOverviewCards';
import { PVMetricsDataSourceRegistryTable } from './PVMetricsDataSourceRegistryTable';
import { PVMetricsDataSourceSecurityCard } from './PVMetricsDataSourceSecurityCard';
import { PVMetricsDataSourceReadinessTimeline } from './PVMetricsDataSourceReadinessTimeline';
import { PVMetricsDataSourceArchitectureNote } from './PVMetricsDataSourceArchitectureNote';
import { ShieldCheck, Info } from 'lucide-react';

export const PVMetricsDataSourceManagerView: React.FC = () => {
  const dataset = createPvMetricsDataSourcesDemo();

  return (
    <div className="space-y-6" id="datasource-manager-view">
      {/* Header and badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              READ-ONLY READINESS
            </span>
            <span className="text-[9px] font-mono font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              SIN TELECONTROL
            </span>
            <span className="text-[9px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded tracking-wide uppercase">
              STANDALONE SAFE MODE
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight font-sans uppercase">
            DATA SOURCE MANAGER
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Gestor de fuentes de datos para simulación, validación y futura integración read-only.
          </p>
        </div>
      </div>

      {/* Warning Alert Note */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-300 font-semibold">PREPARACIÓN DE ARQUITECTURA SEGURA:</strong> Este panel no conecta sistemas productivos. Solo prepara la arquitectura de lectura, validación y mapeo para futuros pilotos autorizados. Ningún comando será enviado a inversores, BESS o instrumentos físicos.
        </div>
      </div>

      {/* Overview Cards */}
      <PVMetricsDataSourceOverviewCards summary={dataset.summary} />

      {/* Main Grid: Left Registry, Right Security & Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <PVMetricsDataSourceRegistryTable sources={dataset.sources} />
        </div>
        
        <div className="xl:col-span-4 space-y-6">
          <PVMetricsDataSourceSecurityCard />
          <PVMetricsDataSourceReadinessTimeline />
        </div>
      </div>

      {/* Proposed Architecture Note / technical footer */}
      <PVMetricsDataSourceArchitectureNote />
    </div>
  );
};
export default PVMetricsDataSourceManagerView;
