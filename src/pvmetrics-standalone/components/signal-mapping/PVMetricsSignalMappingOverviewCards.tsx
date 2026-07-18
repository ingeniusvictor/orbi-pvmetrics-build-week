import React from 'react';
import { PVMetricsSignalMappingSummary } from '../../types/pvmetrics-signal-mapping.types';
import { Database, ToggleLeft, ShieldAlert, FileText, Lock, CheckCircle, AlertTriangle, EyeOff } from 'lucide-react';

type PVMetricsSignalMappingOverviewCardsProps = {
  summary: PVMetricsSignalMappingSummary;
};

export const PVMetricsSignalMappingOverviewCards: React.FC<PVMetricsSignalMappingOverviewCardsProps> = ({ summary }) => {
  const cardData = [
    {
      title: 'Señales Totales',
      value: summary.totalSignals,
      icon: Database,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgColor: 'bg-cyan-500/5',
      label: 'Catálogo de diseño'
    },
    {
      title: 'Señales Mapeadas',
      value: summary.mappedSignals,
      icon: ToggleLeft,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
      label: 'Demo o Read-Only'
    },
    {
      title: 'Pendientes',
      value: summary.pendingSignals,
      icon: FileText,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/5',
      label: 'Falta parametrizar'
    },
    {
      title: 'Válidas',
      value: summary.validSignals,
      icon: CheckCircle,
      color: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
      label: 'Rango y firma OK'
    },
    {
      title: 'Warnings',
      value: summary.warningSignals,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      borderColor: 'border-yellow-500/20',
      bgColor: 'bg-yellow-500/5',
      label: 'Ruido / Desvío'
    },
    {
      title: 'Ausentes',
      value: summary.missingSignals,
      icon: EyeOff,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      bgColor: 'bg-rose-500/5',
      label: 'Sin señal física'
    },
    {
      title: 'Calidad Promedio',
      value: `${summary.averageQualityPct}%`,
      icon: ShieldAlert,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/20',
      bgColor: 'bg-teal-500/5',
      label: 'Gobernanza de datos'
    },
    {
      title: 'Señales Críticas',
      value: summary.criticalSignals,
      icon: Lock,
      color: 'text-red-400',
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/5',
      label: 'Control operacional'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3" id="signal-mapping-overview-cards">
      {cardData.map((card) => {
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
              <div className="text-xl font-bold font-mono text-white tracking-tight">{card.value}</div>
              <span className="text-[8px] text-gray-500 font-mono block mt-0.5">{card.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
