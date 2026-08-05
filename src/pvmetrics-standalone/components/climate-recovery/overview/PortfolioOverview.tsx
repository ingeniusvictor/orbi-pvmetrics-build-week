import React from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Layers3, Sparkles, TriangleAlert } from 'lucide-react';
import type { PortfolioExecutivePresentation } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { GuidedDemoAnchor } from '../demo/GuidedDemoAnchor';
import { AvailabilityValue, MetricCard, Panel, ScoreMetricCard, SectionHeader, StatusBadge, SyntheticBadge } from '../shared/Display';

const chartColors = ['#10b981', '#22d3ee', '#64748b', '#8b5cf6', '#f59e0b'];
const priorityColors: Record<string, string> = { critical: '#fb7185', high: '#fb923c', medium: '#f59e0b', low: '#38bdf8', informational: '#64748b' };
const actionClass = 'cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

const ChartTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  disclosure: string;
}> = ({ active, payload, disclosure }) => active && payload?.length ? (
  <div className="max-w-56 rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs shadow-xl">
    <p className="font-bold text-white">{payload[0].name}: {payload[0].value}</p>
    <p className="mt-1 leading-4 text-slate-400">{disclosure}</p>
  </div>
) : null;

export const PortfolioOverview: React.FC<{
  executive: PortfolioExecutivePresentation;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  onPlant: (plantId: string) => void;
  onCase: (caseId: string) => void;
}> = ({ executive, locale, t, onPlant, onCase }) => {
  const topRank = executive.rankings[0];
  const topThree = executive.rankings.slice(0, 3);
  const presentationFeatured = executive.featuredCases.slice(0, 4);
  const featured = presentationFeatured[0];
  const secondaryFeatured = presentationFeatured.slice(1);
  const distribution = executive.recoverabilityDistribution.statuses.map((item) => ({
    status: item.status,
    name: item.status in t.statusLabels ? t.statusLabels[item.status as keyof typeof t.statusLabels] : item.status,
    value: item.count,
    percentage: item.percentage,
  }));
  const priorities = executive.priorityDistribution.statuses.map((item) => ({
    status: item.status,
    name: item.status in t.statusLabels ? t.statusLabels[item.status as keyof typeof t.statusLabels] : item.status,
    value: item.count,
    percentage: item.percentage,
  }));
  const recoverable = executive.recoverabilityDistribution.statuses.find((item) => item.status === 'recoverable');
  const priorityEmphasis = priorities.filter((item) => item.status === 'critical' || item.status === 'high');
  const featuredPlant = executive.plantSummaries.find((plant) => plant.plantId === featured?.summary.plantId);

  return (
    <div id="cr-portfolio-overview" tabIndex={-1} className="cr-section-stack flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
      <GuidedDemoAnchor id="guided-demo-anchor-problem" stepId="problem" label={`${t.guidedDemo}: ${t.overview}`} />

      <section id="cr-executive-kpis" tabIndex={-1} aria-labelledby="portfolio-kpis-title" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
        <GuidedDemoAnchor id="guided-demo-anchor-opportunity" stepId="opportunity" label={`${t.guidedDemo}: ${t.recoverableEnergy}`} />
        <SectionHeader title={t.primaryIndicators} description={executive.summary.portfolioName} />
        <h3 id="portfolio-kpis-title" className="sr-only">Portfolio KPIs</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <MetricCard tier="primary" label={t.recoverableEnergy} explanation={executive.kpis.estimatedRecoverableEnergy.limitations[0] ?? t.estimated} status={executive.kpis.estimatedRecoverableEnergy.availability}>
              <AvailabilityValue value={executive.kpis.estimatedRecoverableEnergy} locale={locale} t={t} />
            </MetricCard>
          </div>
          <div className="lg:col-span-4">
            <MetricCard tier="primary" label={t.avoidedEmissions} explanation={executive.kpis.estimatedClimateImpact.limitations[0] ?? t.estimated} status={executive.kpis.estimatedClimateImpact.availability}>
              <AvailabilityValue value={executive.kpis.estimatedClimateImpact} locale={locale} t={t} />
            </MetricCard>
          </div>
          <div className="lg:col-span-4">
            <ScoreMetricCard
              label={t.opportunityScore}
              score={topRank.score}
              band={`${t.scoreBand}: ${topRank.scoreBand in t.statusLabels ? t.statusLabels[topRank.scoreBand as keyof typeof t.statusLabels] : topRank.scoreBand}`}
              explanation={`${topRank.plantName}. ${t.scoreTooltip}`}
              tooltip={t.scoreTooltip}
              syntheticLabel={t.demonstration}
            />
          </div>
        </div>
        <h3 className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{t.supportingIndicators}</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-3">
          <MetricCard label={t.syntheticAssets} explanation={`${t.plantPortfolio}.`}>{executive.kpis.plantCount}</MetricCard>
          <MetricCard label={t.activeCases} explanation={`${executive.summary.recoverableCaseCount} ${t.statusLabels.recoverable.toLocaleLowerCase()} · ${executive.summary.insufficientDataCaseCount} ${t.statusLabels.insufficient.toLocaleLowerCase()}.`}>{executive.kpis.caseCount}</MetricCard>
          <MetricCard label={t.pendingReview} explanation={t.operatorBoundary} status="pending-review">{executive.summary.pendingHumanReviewCount}</MetricCard>
        </div>
      </section>

      <div id="cr-plant-ranking" tabIndex={-1} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
        <GuidedDemoAnchor id="guided-demo-anchor-portfolio-ranking" stepId="ranking" label={`${t.guidedDemo}: ${t.plantRanking}`} />
        <Panel ariaLabel={t.plantRanking} className="cr-leaderboard-reveal">
          <SectionHeader title={t.leaderboard} description={t.scoreTooltip} />
          <ol className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3" aria-label={t.leaderboard}>
            {topThree.map((item) => {
              const plant = executive.plantSummaries.find((summary) => summary.plantId === item.plantId)!;
              return (
                <li key={item.plantId}>
                  <article className={`cr-interactive-card h-full rounded-2xl border p-4 ${item.rank === 1 ? 'border-amber-400/45 bg-[linear-gradient(145deg,rgba(245,158,11,0.13),rgba(15,23,42,0.9))]' : 'border-slate-700 bg-slate-950/45'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-xl font-mono text-sm font-black ${item.rank === 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-200'}`}>{item.rank}</span><div><h3 className="text-sm font-black text-white">{item.plantName}</h3><p className="mt-1 text-xs text-slate-500">{plant.assetType}</p></div></div>
                      <span className="font-mono text-2xl font-black text-cyan-200">{item.score.toFixed(2)}</span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.recoverableEnergy}</dt><dd className="mt-1 font-mono text-slate-100"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></dd></div>
                      <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.dataQuality}</dt><dd className="mt-1"><StatusBadge value={plant.dataQualityStatus} t={t} /></dd></div>
                      <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.highPriority}</dt><dd className="mt-1 font-mono font-bold text-white">{item.highPriorityCaseCount}</dd></div>
                      <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.pendingReview}</dt><dd className="mt-1 font-mono font-bold text-white">{item.pendingReviewCount}</dd></div>
                    </dl>
                    {item.overlapPenalty > 0 && <p className="mt-3 flex items-center gap-2 text-xs text-amber-300"><TriangleAlert className="h-4 w-4" />{t.overlapPenalty}: −{item.overlapPenalty}</p>}
                    <button type="button" onClick={() => onPlant(item.plantId)} className={`${actionClass} mt-4 w-full`}>{t.viewPlant}<ArrowRight className="h-3.5 w-3.5" /></button>
                  </article>
                </li>
              );
            })}
          </ol>

          <details className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/35" open>
            <summary className="cr-button flex min-h-11 cursor-pointer items-center justify-between rounded-2xl px-4 text-sm font-bold text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">{t.fullRanking}<span className="text-xs font-normal text-slate-500">5 / 5</span></summary>
            <div className="hidden overflow-x-auto border-t border-slate-800 lg:block">
              <table className="w-full min-w-[900px] border-collapse text-left text-xs">
                <caption className="sr-only">{t.rankingCaption}</caption>
                <thead className="bg-slate-950/80 text-xs uppercase tracking-wide text-slate-500"><tr>{['#', t.plant, t.asset, t.opportunityScore, t.recoverableEnergy, t.climateImpact, t.highPriority, t.pendingReview, t.dataQuality, ''].map((label) => <th key={label} scope="col" className="px-3 py-3 font-bold">{label}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-800">{executive.rankings.map((item) => {
                  const plant = executive.plantSummaries.find((summary) => summary.plantId === item.plantId)!;
                  return <tr key={item.plantId} className="bg-slate-900/30 hover:bg-slate-800/40"><td className="px-3 py-3 font-mono text-amber-300">{item.rank}</td><td className="px-3 py-3"><div className="font-bold text-white">{item.plantName}</div><SyntheticBadge label={t.demonstration} /></td><td className="px-3 py-3 text-slate-300">{plant.assetType}</td><td className="px-3 py-3 font-mono font-bold text-white">{item.score.toFixed(2)}{item.overlapPenalty > 0 && <span className="mt-1 block text-xs font-normal text-amber-300">−{item.overlapPenalty} {t.overlapPenalty.toLocaleLowerCase()}</span>}</td><td className="px-3 py-3 text-slate-200"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></td><td className="px-3 py-3 text-slate-200"><AvailabilityValue value={item.estimatedClimateImpact} locale={locale} t={t} /></td><td className="px-3 py-3 text-slate-300">{item.highPriorityCaseCount}</td><td className="px-3 py-3 text-slate-300">{item.pendingReviewCount}</td><td className="px-3 py-3"><StatusBadge value={plant.dataQualityStatus} t={t} /></td><td className="px-3 py-3"><button type="button" onClick={() => onPlant(item.plantId)} className={actionClass}>{t.viewPlant}<ArrowRight className="h-3.5 w-3.5" /></button></td></tr>;
                })}</tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 gap-3 border-t border-slate-800 p-3 lg:hidden">{executive.rankings.map((item) => {
              const plant = executive.plantSummaries.find((summary) => summary.plantId === item.plantId)!;
              return <article key={item.plantId} className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-black text-amber-300">#{item.rank}</p><h3 className="mt-1 text-sm font-bold text-white">{item.plantName}</h3><p className="mt-1 text-xs text-slate-500">{plant.assetType}</p></div><span className="font-mono text-xl font-black text-cyan-200">{item.score.toFixed(2)}</span></div><dl className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-slate-900 p-2"><dt className="text-slate-500">{t.recoverableEnergy}</dt><dd className="mt-1"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-900 p-2"><dt className="text-slate-500">{t.dataQuality}</dt><dd className="mt-1"><StatusBadge value={plant.dataQualityStatus} t={t} /></dd></div></dl><p className="mt-3 text-xs text-slate-400">{t.highPriority}: {item.highPriorityCaseCount} · {t.pendingReview}: {item.pendingReviewCount}{item.overlapPenalty > 0 ? ` · ${t.overlapPenalty}: −${item.overlapPenalty}` : ''}</p><button type="button" onClick={() => onPlant(item.plantId)} className={`${actionClass} mt-4 w-full`}>{t.viewPlant}<ArrowRight className="h-3.5 w-3.5" /></button></article>;
            })}</div>
          </details>
          {executive.rankings.some((item) => item.overlapPenalty > 0) && <p className="mt-3 flex items-center gap-2 text-xs text-amber-300"><TriangleAlert className="h-4 w-4" />{t.overlapNotice}</p>}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel ariaLabel={t.recoverability}>
          <h3 className="text-base font-black text-white">{t.recoverability}</h3>
          <div className="relative mt-3 h-56" role="img" aria-label={distribution.map((item) => `${item.name}: ${item.value}, ${item.percentage}%`).join(', ')}>
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={distribution} dataKey="value" nameKey="name" innerRadius={54} outerRadius={80} paddingAngle={2} isAnimationActive={false}>{distribution.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip content={<ChartTooltip disclosure={t.syntheticChartDisclosure} />} /></PieChart></ResponsiveContainer>
            <div className="cr-donut-center" aria-hidden="true"><span className="font-mono text-3xl font-black text-white">{recoverable?.percentage ?? 0}%</span><span className="mt-1 text-xs font-bold text-emerald-300">{t.statusLabels.recoverable}</span><span className="mt-1 text-xs text-slate-500">{recoverable?.count ?? 0} / {executive.recoverabilityDistribution.totalCases}</span></div>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-xs text-slate-300">{distribution.map((item, index) => <li key={item.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /><span>{item.name}: <strong>{item.value}</strong> · {item.percentage}%</span></li>)}</ul>
          <p className="mt-4 text-xs leading-5 text-slate-500">{t.recoverabilitySummary} {t.syntheticChartDisclosure}</p>
        </Panel>
        <Panel ariaLabel={t.priority}>
          <h3 className="text-base font-black text-white">{t.priority}</h3>
          <div className="mt-3 h-56" role="img" aria-label={priorities.map((item) => `${item.name}: ${item.value}, ${item.percentage}%`).join(', ')}><ResponsiveContainer width="100%" height="100%"><BarChart data={priorities} margin={{ top: 8, right: 8, bottom: 34, left: -16 }}><XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-18} textAnchor="end" interval={0} /><YAxis allowDecimals={false} stroke="#94a3b8" fontSize={10} /><Tooltip cursor={{ fill: '#1e293b' }} content={<ChartTooltip disclosure={t.syntheticChartDisclosure} />} /><Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>{priorities.map((item) => <Cell key={item.status} fill={priorityColors[item.status] ?? '#64748b'} />)}</Bar></BarChart></ResponsiveContainer></div>
          <p className="text-xs font-semibold leading-5 text-slate-300">{priorityEmphasis.map((item) => `${item.name}: ${item.value}`).join(' · ')}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{t.prioritySummary} {executive.priorityDistribution.disclosure}</p>
        </Panel>
        <Panel ariaLabel={t.dataQuality}>
          <h3 className="text-base font-black text-white">{t.dataQuality}</h3>
          <ul className="mt-5 space-y-4">{executive.dataQualityOverview.statuses.filter((item) => item.count > 0).map((item) => <li key={item.status}><div className="mb-2 flex items-center justify-between gap-3"><StatusBadge value={item.status} t={t} /><span className="font-mono text-xs font-bold text-slate-200">{item.count} · {item.percentage}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-800" role="img" aria-label={`${item.status}: ${item.percentage}%`}><div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-300" style={{ width: `${item.percentage}%` }} /></div></li>)}</ul>
          <p className="mt-5 text-xs font-semibold leading-5 text-slate-300">{t.dataQualityRecommendation}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{executive.dataQualityOverview.limitations[0]}</p>
        </Panel>
      </div>

      {featured && <section data-featured-source="portfolio-service">
        <SectionHeader title={t.featured} description={t.featuredDescription} />
        <article className="cr-featured-reveal mt-5 overflow-hidden rounded-3xl border border-amber-400/35 bg-[radial-gradient(circle_at_90%_10%,rgba(34,211,238,0.12),transparent_38%),linear-gradient(145deg,rgba(30,41,59,0.95),rgba(2,6,23,0.98))] p-5 shadow-[var(--cr-glow-accent)] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-950"><Sparkles className="h-3.5 w-3.5" />{t.topOpportunity}</span><StatusBadge value={featured.summary.priorityBand} t={t} /><StatusBadge value={featured.summary.recoverability} t={t} /><SyntheticBadge label={t.demonstration} /></div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{featuredPlant?.plantName ?? featured.summary.plantId} · {featured.summary.category}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{featured.summary.caseTitle}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{featured.summary.headline}</p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-4"><Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><p className="text-xs font-black uppercase tracking-wide text-amber-200">{t.recommendedAction}</p><p className="mt-2 text-sm leading-6 text-slate-200">{featured.summary.recommendedNextStep}</p></div></div>
            </div>
            <div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-950/65 p-4"><dt className="text-slate-500">{t.estimatedEnergy}</dt><dd className="mt-2 font-mono text-lg font-black text-white"><AvailabilityValue value={featured.summary.recoveryOpportunity.estimatedEnergy} locale={locale} t={t} /></dd></div>
                <div className="rounded-2xl bg-slate-950/65 p-4"><dt className="text-slate-500">{t.climateImpact}</dt><dd className="mt-2 font-mono text-lg font-black text-white"><AvailabilityValue value={featured.summary.climateImpact.estimatedAvoidedEmissions} locale={locale} t={t} /></dd></div>
                <div className="rounded-2xl bg-slate-950/65 p-4"><dt className="text-slate-500">{t.confidence}</dt><dd className="mt-2 font-mono font-bold text-white"><AvailabilityValue value={featured.summary.confidence} locale={locale} t={t} /></dd></div>
                <div className="rounded-2xl bg-slate-950/65 p-4"><dt className="text-slate-500">{t.review}</dt><dd className="mt-2"><StatusBadge value={featured.summary.humanReviewRequired ? 'pending-review' : 'low'} label={featured.summary.humanReviewRequired ? t.required : t.notRequired} t={t} /></dd></div>
              </dl>
              <button type="button" onClick={() => onCase(featured.summary.caseId)} className={`${actionClass} mt-4 w-full`}>{t.inspectCase}<ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </article>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">{secondaryFeatured.map((detail) => <article key={detail.summary.caseId} className="cr-interactive-card flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex flex-wrap items-center gap-2"><StatusBadge value={detail.summary.priorityBand} t={t} /><StatusBadge value={detail.summary.recoverability} t={t} />{detail.summary.humanReviewRequired && <StatusBadge value="pending-review" label={t.review} t={t} />}</div><h3 className="mt-4 text-sm font-bold text-white">{detail.summary.caseTitle}</h3><p className="mt-1 text-xs text-slate-500">{executive.plantSummaries.find((plant) => plant.plantId === detail.summary.plantId)?.plantName ?? detail.summary.plantId} · {detail.summary.category}</p><p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-300">{detail.summary.headline}</p><button type="button" onClick={() => onCase(detail.summary.caseId)} className={`${actionClass} mt-auto pt-3`}>{t.inspectCase}<ArrowRight className="h-3.5 w-3.5" /></button></article>)}</div>
      </section>}
    </div>
  );
};
