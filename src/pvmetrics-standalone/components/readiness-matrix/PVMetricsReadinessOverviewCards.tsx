import React from 'react';
import { PVMetricsReadinessMatrixSummary } from '../../types/pvmetrics-readiness-matrix.types';
import { 
  Clipboard, 
  CheckCircle2, 
  Zap, 
  AlertTriangle, 
  Ban, 
  XCircle, 
  Flame, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

type PVMetricsReadinessOverviewCardsProps = {
  summary: PVMetricsReadinessMatrixSummary;
};

export const PVMetricsReadinessOverviewCards: React.FC<PVMetricsReadinessOverviewCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'Filas Totales',
      value: summary.totalRows,
      icon: Clipboard,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      label: 'Señales Evaluadas',
    },
    {
      title: 'Ready Demo',
      value: summary.readyDemoRows,
      icon: Zap,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      label: 'Listas para Demostración',
    },
    {
      title: 'Ready Read-Only',
      value: summary.readyReadonlyRows,
      icon: ShieldCheck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      label: 'Listas para Piloto',
    },
    {
      title: 'Parciales',
      value: summary.partialRows,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      borderColor: 'border-yellow-500/20',
      label: 'Faltan Ajustes Menores',
    },
    {
      title: 'Bloqueadas',
      value: summary.blockedRows,
      icon: Ban,
      color: 'text-rose-500',
      borderColor: 'border-rose-500/25',
      label: 'Sin Autorización',
    },
    {
      title: 'No Listas',
      value: summary.notReadyRows,
      icon: XCircle,
      color: 'text-red-500',
      borderColor: 'border-red-500/25',
      label: 'Errores Críticos',
    },
    {
      title: 'Riesgo Crítico',
      value: summary.criticalRiskRows,
      icon: Flame,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      label: 'Requieren Mitigación',
    },
    {
      title: 'Readiness Promedio',
      value: `${summary.averageReadinessPct}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      label: 'Porcentaje de Avance',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3" id="readiness-overview-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-3 bg-gray-900 border ${card.borderColor} rounded-xl flex flex-col justify-between transition-all duration-300 hover:border-gray-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{card.title}</span>
              <Icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-white tracking-tight">{card.value}</div>
              <span className="text-[8px] text-gray-500 font-mono block mt-0.5">{card.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
