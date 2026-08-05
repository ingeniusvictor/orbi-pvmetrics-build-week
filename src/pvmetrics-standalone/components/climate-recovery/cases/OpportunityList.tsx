import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { CaseCatalogItem, ClimateRecoveryCatalogSort, SyntheticPlant } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { EMPTY_CLIMATE_RECOVERY_FILTERS, type ClimateRecoveryFilters } from '../hooks/useClimateRecoveryDemo';
import { AvailabilityValue, EmptyState, SectionHeader, StatusBadge, SyntheticBadge } from '../shared/Display';

const controlClass = 'min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';
const buttonClass = 'cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

const options = (values: readonly string[] | undefined, t: ClimateRecoveryCopy) => (values ?? []).map((value) => (
  <option key={value} value={value}>{value in t.statusLabels ? t.statusLabels[value as keyof typeof t.statusLabels] : value}</option>
));

export const OpportunityList: React.FC<{
  cases: CaseCatalogItem[];
  plants: SyntheticPlant[];
  filters: ClimateRecoveryFilters;
  setFilters: (filters: ClimateRecoveryFilters) => void;
  sort: ClimateRecoveryCatalogSort;
  setSort: (sort: ClimateRecoveryCatalogSort) => void;
  availableFilters: Record<string, readonly string[]>;
  caseDataSufficiency: (caseId: string) => string;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  onCase: (caseId: string) => void;
}> = ({ cases, plants, filters, setFilters, sort, setSort, availableFilters, caseDataSufficiency, locale, t, onCase }) => {
  const update = (key: keyof ClimateRecoveryFilters, value: string) => setFilters({ ...filters, [key]: value });
  return (
    <div id="cr-opportunities" tabIndex={-1} className="space-y-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
      <SectionHeader title={t.opportunities} description={t.allCases} />
      <section aria-label={t.filters} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
          <label className="text-xs font-bold uppercase text-slate-400">{t.plant}<select aria-label={t.plant} className={`${controlClass} mt-1`} value={filters.plantId} onChange={(event) => update('plantId', event.target.value)}><option value="">{t.all}</option>{plants.map((plant) => <option key={plant.id} value={plant.id}>{plant.name}</option>)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.category}<select aria-label={t.category} className={`${controlClass} mt-1`} value={filters.category} onChange={(event) => update('category', event.target.value)}><option value="">{t.all}</option>{options(availableFilters.category, t)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.recoverability}<select aria-label={t.recoverability} className={`${controlClass} mt-1`} value={filters.recoverability} onChange={(event) => update('recoverability', event.target.value)}><option value="">{t.all}</option>{options(availableFilters.recoverability, t)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.priority}<select aria-label={t.priority} className={`${controlClass} mt-1`} value={filters.priorityBand} onChange={(event) => update('priorityBand', event.target.value)}><option value="">{t.all}</option>{options(availableFilters.priorityBand, t)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.confidence}<select aria-label={t.confidence} className={`${controlClass} mt-1`} value={filters.confidenceLevel} onChange={(event) => update('confidenceLevel', event.target.value)}><option value="">{t.all}</option>{options(availableFilters.confidenceLevel, t)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.dataSufficiency}<select aria-label={t.dataSufficiency} className={`${controlClass} mt-1`} value={filters.dataSufficiency} onChange={(event) => update('dataSufficiency', event.target.value)}><option value="">{t.all}</option>{options(availableFilters.dataSufficiency, t)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.review}<select aria-label={t.review} className={`${controlClass} mt-1`} value={filters.humanReviewRequired} onChange={(event) => update('humanReviewRequired', event.target.value)}><option value="">{t.all}</option><option value="true">{t.required}</option><option value="false">{t.notRequired}</option></select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.climateAvailability}<select aria-label={t.climateAvailability} className={`${controlClass} mt-1`} value={filters.climateImpactAvailability} onChange={(event) => update('climateImpactAvailability', event.target.value)}><option value="">{t.all}</option>{options(availableFilters.climateImpactAvailability, t)}</select></label>
          <label className="text-xs font-bold uppercase text-slate-400">{t.sort}<select aria-label={`${t.sort}: ${t.opportunities}`} className={`${controlClass} mt-1`} value={sort} onChange={(event) => setSort(event.target.value as ClimateRecoveryCatalogSort)}><option value="priority-desc">{t.highPriority} ↓</option><option value="recoverable-energy-desc">{t.estimatedEnergy} ↓</option><option value="climate-impact-desc">{t.climateImpact} ↓</option><option value="confidence-desc">{t.confidence} ↓</option><option value="case-title-asc">{t.case} A–Z</option></select></label>
          <button type="button" onClick={() => setFilters(EMPTY_CLIMATE_RECOVERY_FILTERS)} className={`${buttonClass} self-end`}><RotateCcw className="h-4 w-4" />{t.clearFilters}</button>
        </div>
      </section>

      {cases.length === 0 ? <EmptyState title={t.noResults} description={t.noResultsHint} action={<button type="button" onClick={() => setFilters(EMPTY_CLIMATE_RECOVERY_FILTERS)} className={buttonClass}><RotateCcw className="h-4 w-4" />{t.clearFilters}</button>} /> : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 xl:block">
            <table className="w-full min-w-[1200px] border-collapse text-left text-xs">
              <caption className="sr-only">{t.opportunitiesCaption}</caption>
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wide text-slate-500"><tr>{[t.case, t.plant, t.category, t.recoverability, t.priority, t.confidence, t.dataSufficiency, t.estimatedEnergy, t.climateImpact, t.review, t.recommendedAction, ''].map((label) => <th key={label} scope="col" className="px-3 py-3">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800">{cases.map((item) => (
                <tr key={item.caseId} className="bg-slate-900/40 hover:bg-slate-800/40">
                  <td className="max-w-52 px-3 py-3"><div className="font-bold text-white">{item.title}</div><div className="mt-1 font-mono text-xs text-slate-500">{item.caseId}</div></td>
                  <td className="px-3 py-3 text-slate-300">{item.plantName}</td><td className="px-3 py-3 text-slate-300">{item.category}</td><td className="px-3 py-3"><StatusBadge value={item.recoverability} t={t} /></td>
                  <td className="px-3 py-3 font-mono text-slate-200"><AvailabilityValue value={item.priority} locale={locale} t={t} /></td><td className="px-3 py-3 font-mono text-slate-200"><AvailabilityValue value={item.confidence} locale={locale} t={t} /></td>
                  <td className="px-3 py-3"><StatusBadge value={caseDataSufficiency(item.caseId)} t={t} /></td>
                  <td className="px-3 py-3 font-mono text-slate-200"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></td><td className="px-3 py-3 font-mono text-slate-200"><AvailabilityValue value={item.estimatedClimateImpact} locale={locale} t={t} /></td>
                  <td className="px-3 py-3">{item.humanReviewRequired ? <StatusBadge value="pending-review" label={t.required} t={t} /> : <StatusBadge value="low" label={t.notRequired} t={t} />}</td><td className="max-w-56 px-3 py-3 text-xs leading-4 text-slate-400">{item.recommendedNextStep}</td>
                  <td className="px-3 py-3"><button type="button" aria-label={`${t.inspectCase}: ${item.title}`} onClick={() => onCase(item.caseId)} className={buttonClass}>{t.inspect}<ArrowRight className="h-3.5 w-3.5" /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:hidden">{cases.map((item) => (
            <article key={item.caseId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-wrap gap-2"><StatusBadge value={item.recoverability} t={t} /><StatusBadge value={caseDataSufficiency(item.caseId)} t={t} /><SyntheticBadge label={t.demonstration} />{item.humanReviewRequired && <StatusBadge value="pending-review" label={t.review} t={t} />}</div>
              <h3 className="mt-3 text-sm font-bold text-white">{item.title}</h3><p className="mt-1 text-xs text-slate-500">{item.plantName} · {item.category}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.priority}</dt><dd className="mt-1 font-mono text-slate-200"><AvailabilityValue value={item.priority} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.confidence}</dt><dd className="mt-1 font-mono text-slate-200"><AvailabilityValue value={item.confidence} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.estimatedEnergy}</dt><dd className="mt-1 font-mono text-slate-200"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.climateImpact}</dt><dd className="mt-1 font-mono text-slate-200"><AvailabilityValue value={item.estimatedClimateImpact} locale={locale} t={t} /></dd></div></dl>
              <p className="mt-3 text-xs leading-4 text-slate-400">{item.recommendedNextStep}</p><button type="button" onClick={() => onCase(item.caseId)} className={`${buttonClass} mt-4 w-full`}>{t.inspectCase}<ArrowRight className="h-4 w-4" /></button>
            </article>
          ))}</div>
        </>
      )}
    </div>
  );
};
