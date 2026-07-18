import React from 'react';
import { PVMetricsSignalQualityRulesSummary } from '../../types/pvmetrics-signal-quality-rules.types';
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Ban, HelpCircle, ShieldAlert, Zap, Flame } from 'lucide-react';

type PVMetricsSignalQualityOverviewCardsProps = {
  summary: PVMetricsSignalQualityRulesSummary;
};

export const PVMetricsSignalQualityOverviewCards: React.FC<PVMetricsSignalQualityOverviewCardsProps> = ({ summary }) => {
  const cardData = [
    {
      title: 'Reglas Totales',
      value: summary.totalRules,
      icon: ClipboardCheck,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      bgColor: 'bg-cyan-500/5',
      label: 'Reglas de Calidad'
    },
    {
      title: 'Superadas',
      value: summary.passedRules,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgColor: 'bg-emerald-500/5',
      label: 'Cumplen criterio'
    },
    {
      title: 'Warnings',
      value: summary.warningRules,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      borderColor: 'border-yellow-500/20',
      bgColor: 'bg-yellow-500/5',
      label: 'Desviaciones leves'
    },
    {
      title: 'Fallidas',
      value: summary.failedRules,
      icon: XCircle,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/20',
      bgColor: 'bg-rose-500/5',
      label: 'Incumplen criterio'
    },
    {
      title: 'Bloqueadas',
      value: summary.blockedRules,
      icon: Ban,
      color: 'text-red-500',
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/5',
      label: 'Falta autorización'
    },
    {
      title: 'No Probadas',
      value: summary.notTestedRules,
      icon: HelpCircle,
      color: 'text-gray-400',
      borderColor: 'border-gray-800',
      bgColor: 'bg-gray-950',
      label: 'Sin datos reales'
    },
    {
      title: 'Reglas Críticas',
      value: summary.criticalRules,
      icon: ShieldAlert,
      color: 'text-rose-500',
      borderColor: 'border-rose-500/25',
      bgColor: 'bg-rose-500/5',
      label: 'Seguridad / Control'
    },
    {
      title: 'Riesgo Operacional',
      value: `${summary.operationalRiskScore}%`,
      icon: Flame,
      color: summary.operationalRiskScore > 50 ? 'text-rose-400' : 'text-emerald-400',
      borderColor: summary.operationalRiskScore > 50 ? 'border-rose-500/20' : 'border-emerald-500/20',
      bgColor: summary.operationalRiskScore > 50 ? 'bg-rose-500/5' : 'bg-emerald-500/5',
      label: 'Índice de Incidencias'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3" id="signal-quality-overview-cards">
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
