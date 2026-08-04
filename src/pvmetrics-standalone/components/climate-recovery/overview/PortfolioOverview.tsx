import React from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Layers3, TriangleAlert } from 'lucide-react';
import type { PortfolioExecutivePresentation } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { AvailabilityValue, MetricCard, Panel, SectionHeader, StatusBadge, SyntheticBadge } from '../shared/Display';

const chartColors = ['#10b981', '#22d3ee', '#64748b', '#8b5cf6', '#f59e0b'];

const actionClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

const ChartTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  disclosure: string;
}> = ({ active, payload, disclosure }) => active && payload?.length ? (
  <div className="max-w-56 rounded-xl border border-slate-700 bg-slate-950 p-3 text-[10px] shadow-xl">
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
  const distribution = executive.recoverabilityDistribution.statuses.map((item) => ({ name: item.status, value: item.count }));
  const priorities = executive.priorityDistribution.statuses.map((item) => ({ name: item.status, value: item.count }));
  return (
    <div className="space-y-6">
      <section aria-labelledby="portfolio-kpis-title">
        <SectionHeader title={t.overview} description={executive.summary.portfolioName} />
        <h3 id="portfolio-kpis-title" className="sr-only">Portfolio KPIs</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <MetricCard label={t.syntheticAssets} explanation={`${t.plantPortfolio}.`}>
            {executive.kpis.plantCount}
          </MetricCard>
          <MetricCard label={t.activeCases} explanation={`${executive.summary.recoverableCaseCount} ${t.statusLabels.recoverable.toLocaleLowerCase()} · ${executive.summary.insufficientDataCaseCount} ${t.statusLabels.insufficient.toLocaleLowerCase()}.`}>
            {executive.kpis.caseCount}
          </MetricCard>
          <MetricCard label={t.recoverableEnergy} explanation={executive.kpis.estimatedRecoverableEnergy.limitations[0] ?? t.estimated} status={executive.kpis.estimatedRecoverableEnergy.availability}>
            <AvailabilityValue value={executive.kpis.estimatedRecoverableEnergy} locale={locale} t={t} />
          </MetricCard>
          <MetricCard label={t.avoidedEmissions} explanation={executive.kpis.estimatedClimateImpact.limitations[0] ?? t.estimated} status={executive.kpis.estimatedClimateImpact.availability}>
            <AvailabilityValue value={executive.kpis.estimatedClimateImpact} locale={locale} t={t} />
          </MetricCard>
          <MetricCard label={t.pendingReview} explanation={t.operatorBoundary} status="pending-review">
            {executive.summary.pendingHumanReviewCount}
          </MetricCard>
          <MetricCard label={t.opportunityScore} explanation={`${topRank.plantName} · ${topRank.scoreBand}.`} tooltip={t.scoreTooltip}>
            {topRank.score.toFixed(2)}<span className="ml-1 text-xs text-slate-500">/100</span>
          </MetricCard>
        </div>
      </section>

      <Panel ariaLabel={t.plantRanking}>
        <SectionHeader title={t.plantRanking} description={t.scoreTooltip} />
        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-slate-800 lg:block">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead className="bg-slate-950/80 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>{['#', t.plant, t.asset, t.opportunityScore, t.recoverableEnergy, t.climateImpact, t.highPriority, t.pendingReview, t.dataQuality, ''].map((label) => <th key={label} scope="col" className="px-3 py-3 font-bold">{label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {executive.rankings.map((item) => {
                const plant = executive.plantSummaries.find((summary) => summary.plantId === item.plantId)!;
                return (
                  <tr key={item.plantId} className="bg-slate-900/30 hover:bg-slate-800/40">
                    <td className="px-3 py-3 font-mono text-amber-300">{item.rank}</td>
                    <td className="px-3 py-3"><div className="font-bold text-white">{item.plantName}</div><SyntheticBadge label={t.demonstration} /></td>
                    <td className="px-3 py-3 text-slate-300">{plant.assetType}</td>
                    <td className="px-3 py-3 font-mono font-bold text-white">{item.score.toFixed(2)}{item.overlapPenalty > 0 && <span className="mt-1 block text-[9px] font-normal text-amber-300">−{item.overlapPenalty} {t.overlapPenalty.toLocaleLowerCase()}</span>}</td>
                    <td className="px-3 py-3 text-slate-200"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></td>
                    <td className="px-3 py-3 text-slate-200"><AvailabilityValue value={item.estimatedClimateImpact} locale={locale} t={t} /></td>
                    <td className="px-3 py-3 text-slate-300">{item.highPriorityCaseCount}</td>
                    <td className="px-3 py-3 text-slate-300">{item.pendingReviewCount}</td>
                    <td className="px-3 py-3"><StatusBadge value={plant.dataQualityStatus} t={t} /></td>
                    <td className="px-3 py-3"><button type="button" onClick={() => onPlant(item.plantId)} className={actionClass}>{t.viewPlant}<ArrowRight className="h-3.5 w-3.5" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:hidden">
          {executive.rankings.map((item) => {
            const plant = executive.plantSummaries.find((summary) => summary.plantId === item.plantId)!;
            return (
              <article key={item.plantId} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] font-black text-amber-300">#{item.rank}</p><h3 className="mt-1 text-sm font-bold text-white">{item.plantName}</h3><p className="mt-1 text-[10px] text-slate-500">{plant.assetType}</p></div><SyntheticBadge label={t.demonstration} /></div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded-lg bg-slate-900 p-2"><dt className="text-slate-500">{t.opportunityScore}</dt><dd className="mt-1 font-mono font-bold text-white">{item.score.toFixed(2)} /100</dd></div><div className="rounded-lg bg-slate-900 p-2"><dt className="text-slate-500">{t.dataQuality}</dt><dd className="mt-1"><StatusBadge value={plant.dataQualityStatus} t={t} /></dd></div><div className="rounded-lg bg-slate-900 p-2"><dt className="text-slate-500">{t.recoverableEnergy}</dt><dd className="mt-1"><AvailabilityValue value={item.estimatedRecoverableEnergy} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-900 p-2"><dt className="text-slate-500">{t.climateImpact}</dt><dd className="mt-1"><AvailabilityValue value={item.estimatedClimateImpact} locale={locale} t={t} /></dd></div></dl>
                <p className="mt-3 text-[10px] text-slate-400">{t.highPriority}: {item.highPriorityCaseCount} · {t.pendingReview}: {item.pendingReviewCount}{item.overlapPenalty > 0 ? ` · ${t.overlapPenalty}: −${item.overlapPenalty}` : ''}</p>
                <button type="button" onClick={() => onPlant(item.plantId)} className={`${actionClass} mt-4 w-full`}>{t.viewPlant}<ArrowRight className="h-3.5 w-3.5" /></button>
              </article>
            );
          })}
        </div>
        {executive.rankings.some((item) => item.overlapPenalty > 0) && (
          <p className="mt-3 flex items-center gap-2 text-[11px] text-amber-300"><TriangleAlert className="h-4 w-4" /> Overlap penalties are visible and preserved from CR-04.</p>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel ariaLabel={t.recoverability}>
          <h3 className="text-sm font-bold text-white">{t.recoverability}</h3>
          <div className="mt-3 h-56" role="img" aria-label={distribution.map((item) => `${item.name}: ${item.value}`).join(', ')}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={distribution} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={2} isAnimationActive={false}>{distribution.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip content={<ChartTooltip disclosure={t.syntheticChartDisclosure} />} /></PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">{distribution.map((item, index) => <li key={item.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />{item.name in t.statusLabels ? t.statusLabels[item.name as keyof typeof t.statusLabels] : item.name}: <strong>{item.value}</strong></li>)}</ul>
        </Panel>
        <Panel ariaLabel={t.priority}>
          <h3 className="text-sm font-bold text-white">{t.priority}</h3>
          <div className="mt-3 h-56" role="img" aria-label={priorities.map((item) => `${item.name}: ${item.value}`).join(', ')}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorities} margin={{ top: 8, right: 8, bottom: 30, left: -20 }}><XAxis dataKey="name" stroke="#64748b" fontSize={9} angle={-20} textAnchor="end" interval={0} /><YAxis allowDecimals={false} stroke="#64748b" fontSize={10} /><Tooltip cursor={{ fill: '#1e293b' }} content={<ChartTooltip disclosure={t.syntheticChartDisclosure} />} /><Bar dataKey="value" fill="#f59e0b" radius={[5, 5, 0, 0]} isAnimationActive={false} /></BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] leading-4 text-slate-500">{executive.priorityDistribution.disclosure}</p>
        </Panel>
        <Panel ariaLabel={t.dataQuality}>
          <h3 className="text-sm font-bold text-white">{t.dataQuality}</h3>
          <ul className="mt-4 space-y-3">
            {executive.dataQualityOverview.statuses.filter((item) => item.count > 0).map((item) => (
              <li key={item.status} className="flex items-center gap-3">
                <StatusBadge value={item.status} t={t} />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-500" style={{ width: `${item.percentage}%` }} /></div>
                <span className="w-14 text-right font-mono text-xs text-slate-300">{item.count} · {item.percentage}%</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] leading-4 text-slate-500">{executive.dataQualityOverview.limitations[0]}</p>
        </Panel>
      </div>

      <section>
        <SectionHeader title={t.featured} description="Evidence suggests potential recovery opportunities; every case requires human review." />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {executive.featuredCases.slice(0, 4).map((detail) => (
            <article key={detail.summary.caseId} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-center gap-2"><StatusBadge value={detail.summary.priorityBand} t={t} /><StatusBadge value={detail.summary.recoverability} t={t} />{detail.summary.humanReviewRequired && <StatusBadge value="pending-review" label={t.review} t={t} />}<SyntheticBadge label={t.demonstration} /></div>
              <h3 className="mt-4 text-sm font-bold text-white">{detail.summary.caseTitle}</h3>
              <p className="mt-1 text-[11px] text-slate-500">{executive.plantSummaries.find((plant) => plant.plantId === detail.summary.plantId)?.plantName ?? detail.summary.plantId} · {detail.summary.category}</p>
              <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-300">{detail.summary.headline}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-slate-950/70 p-2"><dt className="text-slate-500">{t.estimatedEnergy}</dt><dd className="mt-1 font-mono text-slate-100"><AvailabilityValue value={detail.summary.recoveryOpportunity.estimatedEnergy} locale={locale} t={t} /></dd></div>
                <div className="rounded-lg bg-slate-950/70 p-2"><dt className="text-slate-500">{t.climateImpact}</dt><dd className="mt-1 font-mono text-slate-100"><AvailabilityValue value={detail.summary.climateImpact.estimatedAvoidedEmissions} locale={locale} t={t} /></dd></div>
              </dl>
              <p className="mt-3 text-[10px] text-slate-400">{t.confidence}: <AvailabilityValue value={detail.summary.confidence} locale={locale} t={t} /></p>
              <p className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-amber-200"><Layers3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />{detail.summary.recommendedNextStep}</p>
              <button type="button" onClick={() => onCase(detail.summary.caseId)} className={`${actionClass} mt-4 w-full`}>{t.inspectCase}<ArrowRight className="h-3.5 w-3.5" /></button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
