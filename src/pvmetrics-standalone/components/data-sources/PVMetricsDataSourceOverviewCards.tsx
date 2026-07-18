import React from 'react';
import { PVMetricsDataSourceSummary } from '../../types/pvmetrics-data-source.types';
import { Database, ToggleLeft, ShieldAlert, FileText, Lock, CheckCircle } from 'lucide-react';

type PVMetricsDataSourceOverviewCardsProps = {
  summary: PVMetricsDataSourceSummary;
};

export const PVMetricsDataSourceOverviewCards: React.FC<PVMetricsDataSourceOverviewCardsProps> = ({ summary }) => {
  const cardData = [
    {
      title: 'Fuentes Registradas',
      value: summary.totalSources,
      icon: Database,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgColor: 'bg-cyan-500/5',
      label: 'Total catálogo'
    },
    {
      title: 'Demo Activa',
      value: summary.activeDemoSources,
      icon: ToggleLeft,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
      label: 'Simulador local'
    },
    {
      title: 'Read-Only Ready',
      value: summary.readOnlyReadySources,
      icon: CheckCircle,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
      bgColor: 'bg-indigo-500/5',
      label: 'Pre-configurado'
    },
    {
      title: 'Fuentes Pendientes',
      value: summary.pendingSources,
      icon: FileText,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgColor: 'bg-amber-500/5',
      label: 'Por definir / mapear'
    },
    {
      title: 'No Autorizadas',
      value: summary.notAuthorizedSources,
      icon: Lock,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      bgColor: 'bg-rose-500/5',
      label: 'Acceso bloqueado'
    },
    {
      title: 'Readiness Promedio',
      value: `${summary.averageReadinessPct}%`,
      icon: ShieldAlert,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/20',
      bgColor: 'bg-teal-500/5',
      label: 'Nivel preparación'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" id="datasource-overview-cards">
      {cardData.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.title} 
            className={`p-4 bg-gray-900 border ${card.borderColor} rounded-xl flex flex-col justify-between transition-all duration-300 hover:border-gray-700`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-white tracking-tight">{card.value}</div>
              <span className="text-[9px] text-gray-500 font-mono block mt-1">{card.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
