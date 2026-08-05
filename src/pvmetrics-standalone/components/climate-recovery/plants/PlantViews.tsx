import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BatteryCharging, Building2, TriangleAlert } from 'lucide-react';
import type { CaseCatalogItem, PlantSummaryPresentation, SyntheticPlant } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { AvailabilityValue, EmptyState, Panel, SectionHeader, StatusBadge, SyntheticBadge } from '../shared/Display';

const buttonClass = 'cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

export const PlantViews: React.FC<{
  plants: SyntheticPlant[];
  summaries: PlantSummaryPresentation[];
  selectedPlant?: SyntheticPlant;
  selectedSummary?: PlantSummaryPresentation;
  selectedPlantCases: CaseCatalogItem[];
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  onPlant: (plantId: string) => void;
  onCase: (caseId: string) => void;
  onBack: () => void;
}> = ({ plants, summaries, selectedPlant, selectedSummary, selectedPlantCases, locale, t, onPlant, onCase, onBack }) => {
  const [statusFilter, setStatusFilter] = useState('');
  if (selectedPlant && selectedSummary) {
    const filteredCases = selectedPlantCases.filter((item) => !statusFilter || item.recoverability === statusFilter);
    return (
      <div className="space-y-5">
        <button type="button" onClick={onBack} className={buttonClass}><ArrowLeft className="h-4 w-4" />{t.plants}</button>
        <Panel>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2"><SyntheticBadge label={t.demonstration} /><StatusBadge value={selectedSummary.highestPriority} t={t} /><StatusBadge value={selectedPlant.status} t={t} /></div>
              <h2 className="mt-4 text-2xl font-black text-white">{selectedPlant.name}</h2>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-400">{selectedPlant.description}</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-xs uppercase text-slate-500">{t.capacity}</dt><dd className="mt-1 font-mono text-sm font-bold text-white"><AvailabilityValue value={selectedSummary.nominalCapacity} locale={locale} t={t} /></dd></div>
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-xs uppercase text-slate-500">{t.region}</dt><dd className="mt-1 text-sm font-bold text-white">{selectedPlant.operatingRegion}</dd></div>
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-xs uppercase text-slate-500">{t.cases}</dt><dd className="mt-1 font-mono text-sm font-bold text-white">{selectedSummary.caseCount}</dd></div>
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-xs uppercase text-slate-500">{t.opportunityScore}</dt><dd className="mt-1 font-mono text-sm font-bold text-white" title={t.scoreTooltip}>{selectedSummary.climateOpportunityScore.score.toFixed(2)}</dd></div>
            </dl>
          </div>
        </Panel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Panel className="lg:col-span-2">
            <SectionHeader title={t.recoveryOpportunity} description={selectedSummary.recommendedNextStep} />
            <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><dt className="text-xs uppercase text-slate-500">{t.recoverableEnergy}</dt><dd className="mt-2 font-mono text-lg font-bold text-white"><AvailabilityValue value={selectedSummary.estimatedRecoverableEnergy} locale={locale} t={t} /></dd></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><dt className="text-xs uppercase text-slate-500">{t.climateImpact}</dt><dd className="mt-2 font-mono text-lg font-bold text-white"><AvailabilityValue value={selectedSummary.estimatedClimateImpact} locale={locale} t={t} /></dd></div>
            </dl>
          </Panel>
          <Panel ariaLabel={t.recoverability}>
            <h3 className="text-sm font-bold text-white">{t.recoverability}</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex justify-between"><span>{t.statusLabels.recoverable}</span><strong>{selectedSummary.recoverableCaseCount}</strong></li>
              <li className="flex justify-between"><span>{t.statusLabels['partially-recoverable']}</span><strong>{selectedSummary.partiallyRecoverableCaseCount}</strong></li>
              <li className="flex justify-between"><span>{t.statusLabels['non-recoverable']}</span><strong>{selectedSummary.nonRecoverableCaseCount}</strong></li>
              <li className="flex justify-between"><span>{t.statusLabels.insufficient}</span><strong>{selectedSummary.insufficientDataCaseCount}</strong></li>
              <li className="flex justify-between"><span>{t.pendingReview}</span><strong>{selectedSummary.pendingReviewCount}</strong></li>
            </ul>
          </Panel>
          <Panel ariaLabel={t.priority}>
            <h3 className="text-sm font-bold text-white">{t.priority}</h3>
            <dl className="mt-3 space-y-3 text-xs"><div className="flex items-center justify-between gap-3"><dt className="text-slate-400">{t.highestPriority}</dt><dd><StatusBadge value={selectedSummary.highestPriority} t={t} /></dd></div><div className="flex items-center justify-between gap-3"><dt className="text-slate-400">{t.highPriority}</dt><dd className="font-mono font-bold text-white">{selectedSummary.highPriorityCaseCount}</dd></div><div className="flex items-center justify-between gap-3"><dt className="text-slate-400">{t.reviewStatus}</dt><dd className="font-mono font-bold text-amber-300">{selectedSummary.pendingReviewCount}</dd></div></dl>
          </Panel>
        </div>
        <Panel><h3 className="flex items-center gap-2 text-sm font-bold text-amber-300"><TriangleAlert className="h-4 w-4" />{t.detailsAndLimitations}</h3><div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2"><div><h4 className="text-xs font-bold uppercase text-slate-500">{t.warnings}</h4>{selectedSummary.warnings.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">{selectedSummary.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p className="mt-2 text-xs text-slate-500">{t.noneDocumented}</p>}</div><div><h4 className="text-xs font-bold uppercase text-slate-500">{t.limitations}</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">{[...selectedPlant.limitations, ...selectedSummary.limitations].map((limitation, index) => <li key={`${index}:${limitation}`}>{limitation}</li>)}</ul></div></div></Panel>
        <section>
          <SectionHeader title={t.opportunities} action={<label className="text-xs font-bold uppercase text-slate-400">{t.recoverability}<select aria-label={`${t.recoverability}: ${selectedPlant.name}`} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="ml-2 min-h-11 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><option value="">{t.all}</option><option value="recoverable">{t.statusLabels.recoverable}</option><option value="partially-recoverable">{t.statusLabels['partially-recoverable']}</option><option value="non-recoverable">{t.statusLabels['non-recoverable']}</option><option value="indeterminate">{t.statusLabels.indeterminate}</option></select></label>} />
          <div className="mt-4 space-y-3">
            {filteredCases.length === 0 ? <EmptyState title={t.noResults} /> : filteredCases.map((item) => (
              <article key={item.caseId} className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:flex-row md:items-center">
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge value={item.priority.value?.toString() ?? 'medium'} label={item.priority.formattedValue} t={t} /><StatusBadge value={item.recoverability} t={t} /></div><h3 className="mt-2 truncate text-sm font-bold text-white">{item.title}</h3><p className="mt-1 text-xs text-slate-500">{item.category} · {item.recommendedNextStep}</p></div>
                <button type="button" onClick={() => onCase(item.caseId)} className={buttonClass}>{t.inspectCase}<ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader title={t.plants} description={t.plantPortfolio} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {plants.map((plant) => {
          const summary = summaries.find((item) => item.plantId === plant.id)!;
          return (
            <article key={plant.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-start justify-between gap-3"><div className="rounded-xl bg-amber-500/10 p-2 text-amber-300">{plant.technologyProfile.hasBess ? <BatteryCharging className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}</div><SyntheticBadge label={t.demonstration} /></div>
              <h3 className="mt-4 text-lg font-black text-white">{plant.name}</h3><p className="mt-1 text-xs text-slate-500">{plant.assetType} · {plant.operatingRegion}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.capacity}</dt><dd className="mt-1 font-mono text-slate-100"><AvailabilityValue value={summary.nominalCapacity} locale={locale} t={t} /></dd></div>
                <div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.cases}</dt><dd className="mt-1 font-mono text-slate-100">{summary.caseCount}</dd></div>
                <div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.opportunityScore}</dt><dd className="mt-1 font-mono text-slate-100">{summary.climateOpportunityScore.score.toFixed(2)}</dd></div>
                <div className="rounded-lg bg-slate-950/60 p-2"><dt className="text-slate-500">{t.dataQuality}</dt><dd className="mt-1"><StatusBadge value={summary.dataQualityStatus} t={t} /></dd></div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300"><span>{summary.recoverableCaseCount} {t.statusLabels.recoverable.toLocaleLowerCase()}</span><span>·</span><span>{summary.partiallyRecoverableCaseCount} {t.statusLabels['partially-recoverable'].toLocaleLowerCase()}</span><span>·</span><span>{summary.nonRecoverableCaseCount} {t.statusLabels['non-recoverable'].toLocaleLowerCase()}</span><span>·</span><span>{summary.insufficientDataCaseCount} {t.statusLabels.insufficient.toLocaleLowerCase()}</span></div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><p className="rounded-lg bg-slate-950/60 p-2 text-slate-400">{t.highPriority}: <strong className="text-white">{summary.highPriorityCaseCount}</strong></p><p className="rounded-lg bg-slate-950/60 p-2 text-slate-400">{t.pendingReview}: <strong className="text-white">{summary.pendingReviewCount}</strong></p>{summary.featuredCaseId && <p className="col-span-2 rounded-lg bg-slate-950/60 p-2 text-slate-400">{t.featuredCase}: <strong className="font-mono text-white">{summary.featuredCaseId}</strong></p>}</div>
              {summary.overlapWarningCount > 0 && <p className="mt-3 flex gap-2 text-xs text-amber-300"><TriangleAlert className="h-3.5 w-3.5" />{t.overlapPenalty}: −{summary.overlapPenalty}</p>}
              <button type="button" onClick={() => onPlant(plant.id)} className={`${buttonClass} mt-5 w-full`}>{t.viewPlant}<ArrowRight className="h-4 w-4" /></button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
