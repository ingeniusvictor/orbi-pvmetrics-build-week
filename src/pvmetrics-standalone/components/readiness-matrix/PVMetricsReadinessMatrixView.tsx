import React from 'react';
import { createPvMetricsReadinessMatrixDemo } from '../../data/createPvMetricsReadinessMatrixDemo';
import { PVMetricsReadinessOverviewCards } from './PVMetricsReadinessOverviewCards';
import { PVMetricsReadinessRiskSummaryCard } from './PVMetricsReadinessRiskSummaryCard';
import { PVMetricsReadinessPilotGateCard } from './PVMetricsReadinessPilotGateCard';
import { PVMetricsReadinessMatrixTable } from './PVMetricsReadinessMatrixTable';
import { PVMetricsReadinessSecurityNote } from './PVMetricsReadinessSecurityNote';
import { Info } from 'lucide-react';

export const PVMetricsReadinessMatrixView: React.FC = () => {
  const dataset = createPvMetricsReadinessMatrixDemo();

  return (
    <div className="space-y-6" id="readiness-matrix-view-layer">
      {/* Upper informational message */}
      <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-300 font-semibold">SOVEREIGN READINESS ASSESSMENT:</strong> Esta matriz cruza las fuentes de datos configuradas, el catálogo técnico de señales esperadas y las reglas de validación de calidad del motor local. Es una herramienta técnica de preventa y gobernanza previa a pilotos read-only.
        </div>
      </div>

      {/* Overview stats cards */}
      <PVMetricsReadinessOverviewCards summary={dataset.summary} />

      {/* Pilot readiness gate status */}
      <PVMetricsReadinessPilotGateCard summary={dataset.summary} />

      {/* Risk and sources summary */}
      <PVMetricsReadinessRiskSummaryCard rows={dataset.rows} />

      {/* Main Readiness Grid */}
      <PVMetricsReadinessMatrixTable rows={dataset.rows} />

      {/* Security Footer */}
      <PVMetricsReadinessSecurityNote />
    </div>
  );
};

export default PVMetricsReadinessMatrixView;
