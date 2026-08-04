import React from 'react';
import { ArrowRight, Eye, FlaskConical, SearchCheck } from 'lucide-react';
import type { PortfolioReviewQueueItem, SyntheticPlant } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { localizePresentationText } from '../presentationLocalization';
import { DisclosurePanel, EmptyState, SectionHeader, StatusBadge, SyntheticBadge } from '../shared/Display';

const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-500/40 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

export const HumanReviewQueue: React.FC<{
  queue: PortfolioReviewQueueItem[];
  plants: SyntheticPlant[];
  caseTitle: (caseId: string) => string;
  t: ClimateRecoveryCopy;
  locale: ClimateRecoveryLocale;
  onCase: (caseId: string) => void;
}> = ({ queue, plants, caseTitle, t, locale, onCase }) => (
  <div id="cr-review-queue" tabIndex={-1} className="space-y-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
    <SectionHeader title={t.humanReviewQueue} description={t.queueNotice} />
    <DisclosurePanel disclosure={t.disclosure} boundary={t.operatorBoundary} ariaLabel={t.syntheticDisclosureLabel} />
    {queue.length === 0 && <EmptyState title={t.noResults} />}
    <ol className="space-y-3">
      {queue.map((item) => {
        const plant = plants.find((candidate) => candidate.id === item.plantId);
        return (
          <li key={item.caseId} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-amber-500 px-2.5 py-1 font-mono text-xs font-black text-slate-950">#{item.dueOrder}</span><StatusBadge value={item.priority} t={t} /><StatusBadge value="medium" label={`${t.urgency}: ${localizePresentationText(item.urgency, locale)}`} t={t} /><SyntheticBadge label={t.demonstration} /></div>
                <h3 className="mt-3 text-sm font-bold text-white">{caseTitle(item.caseId)}</h3><p className="mt-1 text-xs text-slate-500">{plant?.name ?? item.plantId} · {item.caseId}</p>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-950/60 p-3"><h4 className="text-xs font-bold uppercase text-slate-500">{t.reason}</h4><ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-4 text-slate-300">{item.reason.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
                  <div className="rounded-xl bg-slate-950/60 p-3"><h4 className="text-xs font-bold uppercase text-slate-500">{t.evidenceGap}</h4><ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-4 text-slate-300">{item.evidenceGap.length ? item.evidenceGap.map((gap) => <li key={gap}>{gap}</li>) : <li>{t.noEvidenceGap}</li>}</ul></div>
                  <div className="rounded-xl bg-slate-950/60 p-3"><h4 className="text-xs font-bold uppercase text-slate-500">{t.reviewType}</h4><ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-4 text-slate-300">{item.recommendedReviewType.map((review) => <li key={review}>{review}</li>)}</ul></div>
                </div>
              </div>
              <div className="grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                <button type="button" onClick={() => onCase(item.caseId)} className={buttonClass}><Eye className="h-4 w-4" />{t.inspectCase}<ArrowRight className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => onCase(item.caseId)} className={buttonClass}><SearchCheck className="h-4 w-4" />{t.inspectEvidence}</button>
                <button type="button" onClick={() => onCase(item.caseId)} className={buttonClass}><FlaskConical className="h-4 w-4" />{t.inspectMethodology}</button>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  </div>
);
