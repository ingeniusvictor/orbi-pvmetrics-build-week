import React from 'react';
import { CalendarClock, CheckCircle2, CircleDot, Clock3 } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type { TestInstance } from '../contracts';
import { useCommissioningI18n } from '../localization/CommissioningLocaleContext';

const statusClass: Record<string, string> = {
  PLANNED: 'border-gray-700 bg-gray-900 text-gray-300',
  READY: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  IN_PROGRESS: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  BLOCKED: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  COMPLETED: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  CANCELLED: 'border-gray-700 bg-gray-800 text-gray-500',
};

export const CommissioningCampaignsView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const i18n = useCommissioningI18n();
  const t = i18n.text;
  const campaigns = state.snapshot.campaigns;
  const executionCountByCampaign = new Map<string, number>();
  const testInstanceById = new Map<string, TestInstance>(
    state.snapshot.testInstances.map((item): [string, TestInstance] => [item.testInstanceId, item]),
  );
  for (const execution of state.snapshot.testExecutions) {
    const instance = testInstanceById.get(execution.testInstanceId);
    if (!instance) continue;
    executionCountByCampaign.set(instance.campaignId, (executionCountByCampaign.get(instance.campaignId) ?? 0) + 1);
  }

  if (campaigns.length === 0) return <p className="text-xs text-gray-400">{t('No hay campañas de Puesta en Servicio cargadas.', 'No commissioning campaigns loaded.')}</p>;

  return (
    <div className="space-y-5" id="commissioning-campaigns-view">
      <div className="flex items-center justify-between">
        <div><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('Campañas de Prueba', 'Test Campaigns')}</p><h2 className="mt-1 text-lg font-bold text-white">{t('Registro de campañas de Puesta en Servicio', 'Commissioning campaign register')}</h2></div>
        <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-gray-400">{campaigns.length} {t('campaña(s)', 'campaign(s)')}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {campaigns.map((campaign) => {
          const count = executionCountByCampaign.get(campaign.campaignId) ?? 0;
          return (
            <article key={campaign.campaignId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3"><CalendarClock className="mt-0.5 h-5 w-5 text-emerald-400" /><div><p className="font-semibold text-white">{campaign.name}</p><p className="mt-1 font-mono text-[9px] text-gray-600">{campaign.campaignId}</p></div></div>
                <span className={`rounded border px-2 py-1 text-[9px] font-black ${statusClass[campaign.status] ?? statusClass.PLANNED}`}>{i18n.canonical(campaign.status)}</span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-gray-400">{campaign.description ?? t('No hay descripción de campaña registrada.', 'No campaign description recorded.')}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><CircleDot className="mb-2 h-3.5 w-3.5 text-cyan-400" /><p className="text-gray-500">{t('Tipo', 'Type')}</p><p className="mt-1 font-semibold text-gray-200">{i18n.canonical(campaign.type)}</p></div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><Clock3 className="mb-2 h-3.5 w-3.5 text-amber-400" /><p className="text-gray-500">{t('Ejecuciones', 'Executions')}</p><p className="mt-1 text-lg font-bold text-white">{count}</p></div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><CheckCircle2 className="mb-2 h-3.5 w-3.5 text-emerald-400" /><p className="text-gray-500">{t('Fin real', 'Actual end')}</p><p className="mt-1 font-semibold text-gray-200">{campaign.actualEnd ? t('REGISTRADO', 'RECORDED') : t('PENDIENTE', 'PENDING')}</p></div>
              </div>
              <div className="mt-4 text-[10px] text-gray-500">{t('Planificado', 'Planned')}: {campaign.plannedStart ?? i18n.missing} → {campaign.plannedEnd ?? i18n.missing}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
};