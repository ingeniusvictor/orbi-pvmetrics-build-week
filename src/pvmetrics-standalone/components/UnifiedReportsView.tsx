import React, { useState } from 'react';
import { ClipboardCheck, FileText } from 'lucide-react';
import { ReportsView } from './ReportsView';
import { CommissioningReportsPanel } from '../commissioning/components/CommissioningReportsPanel';

type ReportsDomain = 'operational' | 'commissioning';

export const UnifiedReportsView: React.FC = () => {
  const [domain, setDomain] = useState<ReportsDomain>('operational');

  return (
    <div className="space-y-5" id="unified-reports-view">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-1">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2" role="tablist" aria-label="Report domain">
          <button
            type="button"
            role="tab"
            aria-selected={domain === 'operational'}
            onClick={() => setDomain('operational')}
            className={`min-h-11 rounded-lg px-4 text-xs font-bold transition ${domain === 'operational' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <FileText className="mr-2 inline h-4 w-4" />
            PV + BESS Reports
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={domain === 'commissioning'}
            onClick={() => setDomain('commissioning')}
            className={`min-h-11 rounded-lg px-4 text-xs font-bold transition ${domain === 'commissioning' ? 'bg-emerald-500 text-slate-950' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <ClipboardCheck className="mr-2 inline h-4 w-4" />
            BESS Commissioning Report
          </button>
        </div>
      </div>

      <div role="tabpanel">
        {domain === 'operational' ? <ReportsView /> : <CommissioningReportsPanel />}
      </div>
    </div>
  );
};
