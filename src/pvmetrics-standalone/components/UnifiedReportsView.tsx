import React, { useState } from 'react';
import { ClipboardCheck, FileText, Languages } from 'lucide-react';
import { ReportsView } from './ReportsView';
import { CommissioningReportsPanel } from '../commissioning/components/CommissioningReportsPanel';
import { DEFAULT_COMMISSIONING_LOCALE, commissioningText, type CommissioningLocale } from '../commissioning/localization/commissioningLocale';

type ReportsDomain = 'operational' | 'commissioning';

export const UnifiedReportsView: React.FC<{
  commissioningLocale?: CommissioningLocale;
  onCommissioningLocaleChange?: (locale: CommissioningLocale) => void;
}> = ({ commissioningLocale = DEFAULT_COMMISSIONING_LOCALE, onCommissioningLocaleChange }) => {
  const [domain, setDomain] = useState<ReportsDomain>('operational');
  const t = (es: string, en: string) => commissioningText(commissioningLocale, es, en);

  return (
    <div className="space-y-5" id="unified-reports-view">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-1">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2" role="tablist" aria-label={t('Dominio de reportes', 'Report domain')}>
          <button type="button" role="tab" aria-selected={domain === 'operational'} onClick={() => setDomain('operational')} className={`min-h-11 rounded-lg px-4 text-xs font-bold transition ${domain === 'operational' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><FileText className="mr-2 inline h-4 w-4" />{t('Reportes PV + BESS', 'PV + BESS Reports')}</button>
          <button type="button" role="tab" aria-selected={domain === 'commissioning'} onClick={() => setDomain('commissioning')} className={`min-h-11 rounded-lg px-4 text-xs font-bold transition ${domain === 'commissioning' ? 'bg-emerald-500 text-slate-950' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ClipboardCheck className="mr-2 inline h-4 w-4" />{t('Informe de Puesta en Servicio BESS', 'BESS Commissioning Report')}</button>
        </div>
      </div>

      {domain === 'commissioning' ? (
        <div className="flex justify-end">
          <label className="inline-flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] font-bold text-gray-400">
            <Languages className="h-4 w-4" />{t('Idioma', 'Language')}
            <select value={commissioningLocale} onChange={(event) => onCommissioningLocaleChange?.(event.target.value as CommissioningLocale)} className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs font-bold text-white">
              <option value="es">ES · Español</option><option value="en">EN · English</option>
            </select>
          </label>
        </div>
      ) : null}

      <div role="tabpanel">
        {domain === 'operational' ? <ReportsView /> : <CommissioningReportsPanel locale={commissioningLocale} />}
      </div>
    </div>
  );
};