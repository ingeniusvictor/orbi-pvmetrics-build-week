import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, ClipboardCheck, FlaskConical, ShieldAlert } from 'lucide-react';
import type { CaseDetailPresentation } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { AvailabilityValue, DisclosurePanel, EmptyState, MetricCard, Panel, SectionHeader, StatusBadge, SyntheticBadge } from '../shared/Display';

const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

const formatRate = (value: number, locale: ClimateRecoveryLocale) => new Intl.NumberFormat(
  locale === 'es' ? 'es-CL' : 'en-US',
  { style: 'percent', maximumFractionDigits: 1 },
).format(value);

const TextList: React.FC<{ items: string[]; empty?: string }> = ({ items, empty }) => items.length > 0
  ? <ul className="list-disc space-y-1.5 pl-5 text-xs leading-5 text-slate-300">{items.map((item, index) => <li key={`${index}:${item}`}>{item}</li>)}</ul>
  : <p className="text-xs text-slate-500">{empty ?? 'None documented.'}</p>;

export const CaseDetailView: React.FC<{
  detail?: CaseDetailPresentation;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  onBack: () => void;
}> = ({ detail, locale, t, onBack }) => {
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  if (!detail) return <EmptyState title={t.caseNotFound} action={<button type="button" onClick={onBack} className={buttonClass}>{t.back}</button>} />;
  const visibleTimeline = showAllTimeline ? detail.timeline : detail.timeline.slice(0, 6);
  const evidenceGroups = {
    supporting: detail.evidence.filter((item) => item.direction.includes('support')),
    contradicting: detail.evidence.filter((item) => item.direction.includes('contradict')),
    neutral: detail.evidence.filter((item) => item.qualityStatus !== 'unavailable' && !item.direction.includes('support') && !item.direction.includes('contradict')),
    unavailable: detail.evidence.filter((item) => item.qualityStatus === 'unavailable'),
  };
  const assumptions = [...new Set([...detail.scenarios.flatMap((item) => item.assumptions), ...detail.climateImpact.assumptions, ...detail.explainability.assumptions])];
  const limitations = [...new Set([...detail.limitations, ...detail.climateImpact.limitations, ...detail.explainability.limitations])];
  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className={buttonClass}><ArrowLeft className="h-4 w-4" />{t.opportunities}</button>

      <Panel>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2"><StatusBadge value={detail.summary.priorityBand} t={t} /><StatusBadge value={detail.summary.recoverability} t={t} /><StatusBadge value={detail.summary.currentStatus} t={t} /><SyntheticBadge label={t.demonstration} /></div>
            <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">{detail.summary.caseTitle}</h2>
            <p className="mt-2 text-[11px] text-slate-500">{detail.summary.plantId} · {detail.summary.assetId} · {detail.summary.category}</p>
            <p className="mt-4 text-base font-semibold leading-6 text-cyan-100">{detail.summary.headline}</p>
            <p className="mt-3 text-xs leading-6 text-slate-300">{detail.summary.executiveNarrative}</p>
          </div>
          <dl className="grid shrink-0 grid-cols-2 gap-2 text-[10px] sm:grid-cols-3 lg:grid-cols-2">
            <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.confidence}</dt><dd className="mt-1 font-mono text-white"><AvailabilityValue value={detail.summary.confidence} locale={locale} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.dataSufficiency}</dt><dd className="mt-1"><StatusBadge value={detail.summary.dataSufficiency} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.review}</dt><dd className="mt-1"><StatusBadge value={detail.summary.humanReviewRequired ? 'pending-review' : 'low'} label={detail.summary.humanReviewRequired ? t.required : t.notRequired} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.evaluated}</dt><dd className="mt-1 font-mono text-white">{detail.summary.lastEvaluatedAt.formattedValue}</dd></div>
          </dl>
        </div>
      </Panel>

      <section>
        <SectionHeader title={t.keyMetrics} />
        <div className="mt-4 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4">
          {detail.kpis.map((kpi) => (
            <MetricCard key={kpi.id} label={kpi.labelKey} explanation={kpi.explanation} status={kpi.value.availability}>
              <AvailabilityValue value={kpi.value} locale={locale} t={t} />
            </MetricCard>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel>
          <SectionHeader title={t.recoveryOpportunity} description={detail.summary.recoveryOpportunity.methodology} />
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-[10px] font-bold uppercase text-slate-500">{t.recoverableEnergy}</p>
            <p className="mt-2 font-mono text-2xl font-black text-white"><AvailabilityValue value={detail.summary.recoveryOpportunity.estimatedEnergy} locale={locale} t={t} /></p>
            <div className="mt-3 flex flex-wrap gap-2"><StatusBadge value={detail.summary.recoverability} t={t} />{detail.summary.recoveryOpportunity.horizon && <StatusBadge value="informational" label={`${t.horizon}: ${detail.summary.recoveryOpportunity.horizon}`} t={t} />}</div>
          </div>
          <div className="mt-4"><h3 className="text-xs font-bold text-slate-200">{t.limitations}</h3><TextList items={detail.summary.recoveryOpportunity.limitations} empty={t.noneDocumented} /></div>
        </Panel>

        <Panel>
          <SectionHeader title={t.climateImpact} description={detail.climateImpact.methodology} />
          {detail.climateImpact.availability === 'blocked' && <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200"><div className="flex items-center gap-2 font-bold"><ShieldAlert className="h-4 w-4" />{t.blocked}</div><TextList items={detail.climateImpact.blockingReasons} empty={t.noneDocumented} /></div>}
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.avoidedEmissions}</dt><dd className="mt-2 font-mono text-lg font-bold text-white"><AvailabilityValue value={detail.climateImpact.estimatedAvoidedEmissions} locale={locale} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.factor}</dt><dd className="mt-2 font-mono text-lg font-bold text-white"><AvailabilityValue value={detail.climateImpact.emissionFactor} locale={locale} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.verification}</dt><dd className="mt-2"><StatusBadge value="unavailable" label={t.notVerified} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.counterfactual}</dt><dd className="mt-2"><StatusBadge value="informational" label={t.estimated} t={t} /></dd></div>
          </dl>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"><div><h3 className="text-[10px] font-bold uppercase text-slate-500">{t.assumptions}</h3><div className="mt-2"><TextList items={detail.climateImpact.assumptions} empty={t.noneDocumented} /></div></div><div><h3 className="text-[10px] font-bold uppercase text-slate-500">{t.limitations}</h3><div className="mt-2"><TextList items={detail.climateImpact.limitations} empty={t.noneDocumented} /></div></div></div>
          {(detail.climateImpact.factorRegion || detail.climateImpact.factorYear) && <p className="mt-4 text-[10px] text-slate-500">{t.factor}: {detail.climateImpact.factorRegion ?? t.unavailable}{detail.climateImpact.factorYear ? ` · ${detail.climateImpact.factorYear}` : ''} · {t.demonstration}</p>}
        </Panel>
      </div>

      <Panel>
        <SectionHeader title={t.actions} description={t.operatorBoundary} />
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {detail.actions.map((action) => (
            <article key={action.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap items-center gap-2"><StatusBadge value={action.urgency} t={t} /><StatusBadge value="pending-review" label={action.requiresApproval ? t.approvalRequired : t.review} t={t} /><StatusBadge value={action.status} t={t} /></div>
              <h3 className="mt-3 text-sm font-bold text-white">{action.actionType.replaceAll('-', ' ')}</h3><p className="mt-1 text-[10px] uppercase text-slate-500">{t.actionType} · {action.humanReviewStatus}</p><p className="mt-3 text-xs leading-5 text-slate-300">{action.rationale}</p><p className="mt-2 text-[10px] leading-4 text-cyan-200"><strong>{t.expectedOutcome}:</strong> {action.expectedOutcome}</p>
              <div className="mt-3"><h4 className="text-[10px] font-bold uppercase text-slate-500">{t.safetyAndUncertainty}</h4><TextList items={[...action.safetyNotes, ...action.uncertaintyNotes]} empty={t.noneDocumented} /></div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionHeader title={t.scenarios} description={t.scenarioDisclosure} />
        {detail.scenarios.length === 0 ? <div className="mt-4"><EmptyState title={t.unavailable} /></div> : <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">{detail.scenarios.map((scenario) => {
          const comparable = typeof scenario.noIntervention.value === 'number' && typeof scenario.intervention.value === 'number';
          const comparisonMaximum = comparable ? Math.max(scenario.noIntervention.value!, scenario.intervention.value!, 1) : 1;
          return (
            <article key={scenario.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap gap-2"><SyntheticBadge label={t.projected} /><StatusBadge value="informational" label={`${t.horizon}: ${scenario.horizon}`} t={t} /></div>
              <h3 className="mt-3 text-sm font-bold text-white">{scenario.nameKey}</h3>
              <dl className="mt-4 grid grid-cols-1 gap-2 min-[430px]:grid-cols-3 text-[10px]"><div className="rounded-lg bg-slate-900 p-3"><dt className="text-slate-500">{t.noIntervention}</dt><dd className="mt-2 font-mono text-slate-100"><AvailabilityValue value={scenario.noIntervention} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-900 p-3"><dt className="text-slate-500">{t.withIntervention}</dt><dd className="mt-2 font-mono text-slate-100"><AvailabilityValue value={scenario.intervention} locale={locale} t={t} /></dd></div><div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3"><dt className="text-emerald-300">{t.projectedRecovery}</dt><dd className="mt-2 font-mono text-emerald-100"><AvailabilityValue value={scenario.recoveredEnergy} locale={locale} t={t} /></dd></div></dl>
              {comparable && <div className="mt-4 space-y-2" role="img" aria-label={`${t.noIntervention}: ${scenario.noIntervention.formattedValue}; ${t.withIntervention}: ${scenario.intervention.formattedValue}`}><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-slate-500" style={{ width: `${Math.max(3, (scenario.noIntervention.value! / comparisonMaximum) * 100)}%` }} /></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(3, (scenario.intervention.value! / comparisonMaximum) * 100)}%` }} /></div></div>}
              <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-[10px]"><caption className="sr-only">{t.scenarioTable}</caption><thead className="text-slate-500"><tr><th scope="col" className="py-1">{t.noIntervention}</th><th scope="col" className="py-1">{t.withIntervention}</th><th scope="col" className="py-1">{t.projectedRecovery}</th></tr></thead><tbody><tr className="text-slate-200"><td className="py-1"><AvailabilityValue value={scenario.noIntervention} locale={locale} t={t} /></td><td className="py-1"><AvailabilityValue value={scenario.intervention} locale={locale} t={t} /></td><td className="py-1"><AvailabilityValue value={scenario.recoveredEnergy} locale={locale} t={t} /></td></tr></tbody></table></div>
              <dl className="mt-4 grid grid-cols-1 gap-2 min-[430px]:grid-cols-2 text-[10px]"><div className="rounded-lg bg-slate-900 p-3"><dt className="text-slate-500">{t.recoveryRate}</dt><dd className="mt-1 text-slate-200">{detail.summary.recoveryOpportunity.recoveryRateAssumption === undefined ? t.unavailable : formatRate(detail.summary.recoveryOpportunity.recoveryRateAssumption, locale)}</dd></div><div className="rounded-lg bg-slate-900 p-3"><dt className="text-slate-500">{t.uncertainty}</dt><dd className="mt-1 text-slate-200">{detail.summary.recoveryOpportunity.uncertainty ? `${detail.summary.recoveryOpportunity.uncertainty.lowerBound}–${detail.summary.recoveryOpportunity.uncertainty.upperBound} ${detail.summary.recoveryOpportunity.uncertainty.unit} · ${detail.summary.recoveryOpportunity.uncertainty.confidenceDescriptor}` : t.unavailable}</dd></div></dl>
              <div className="mt-3"><TextList items={[...scenario.assumptions, ...scenario.limitations]} empty={t.noneDocumented} /></div>
            </article>
          );
        })}</div>}
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel>
          <SectionHeader title={t.evidence} />
          <div className="mt-4 space-y-4">
            {([['supporting', t.supporting, CheckCircle2], ['contradicting', t.contradicting, AlertTriangle], ['neutral', t.neutral, CircleHelp], ['unavailable', t.missing, AlertTriangle]] as const).map(([key, label, Icon]) => (
              <div key={key}><h3 className="flex items-center gap-2 text-xs font-bold text-slate-200"><Icon className="h-4 w-4 text-cyan-300" />{label}</h3><div className="mt-2 space-y-2">{evidenceGroups[key].length ? evidenceGroups[key].map((item) => <article key={item.id} className="rounded-lg bg-slate-950/60 p-3"><p className="text-xs font-semibold text-white">{item.title}</p><p className="mt-1 text-[10px] leading-4 text-slate-400">{item.description}</p><div className="mt-2 flex flex-wrap items-center gap-2"><StatusBadge value={item.qualityStatus} t={t} /><span className="font-mono text-[9px] text-slate-500">{t.source}: {item.sourceReference}</span></div></article>) : <p className="text-[10px] text-slate-500">{t.noneDocumented}</p>}</div></div>
            ))}
            <div><h3 className="text-xs font-bold text-slate-200">{t.missing}</h3><div className="mt-2"><TextList items={detail.explainability.missingEvidence} empty={t.noneDocumented} /></div></div>
          </div>
        </Panel>
        <Panel>
          <SectionHeader title={t.hypotheses} description={t.hypothesesBoundary} />
          <div className="mt-4 space-y-3">{detail.hypotheses.map((hypothesis) => <article key={hypothesis.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex flex-wrap gap-2"><StatusBadge value={hypothesis.status} t={t} /><StatusBadge value="medium" label={`${t.confidence}: ${hypothesis.confidence}`} t={t} />{hypothesis.requiresHumanReview && <StatusBadge value="pending-review" label={t.review} t={t} />}</div><h3 className="mt-3 text-sm font-bold text-white">{hypothesis.title}</h3><p className="mt-2 text-xs leading-5 text-slate-300">{hypothesis.summary}</p><p className="mt-2 text-[10px] text-slate-500">{t.notDiagnosis}</p></article>)}</div>
        </Panel>
      </div>

      <Panel>
        <SectionHeader title={t.timeline} description={t.stableTimeline} />
        <ol className="mt-5 space-y-0 border-l border-slate-700 pl-5">{visibleTimeline.map((event) => <li key={event.id} className="relative pb-5"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-amber-400" /><div className="flex flex-wrap items-center gap-2"><time className="font-mono text-[10px] text-slate-500">{event.timestamp}</time><StatusBadge value={event.severity} t={t} /><SyntheticBadge label={t.demonstration} /></div><h3 className="mt-2 text-xs font-bold text-white">{event.eventType}</h3><p className="mt-1 text-[11px] leading-5 text-slate-400">{event.descriptionKey}</p></li>)}</ol>
        {detail.timeline.length > 6 && <button type="button" onClick={() => setShowAllTimeline((value) => !value)} aria-expanded={showAllTimeline} className={buttonClass}>{showAllTimeline ? t.showLess : t.showMore}</button>}
      </Panel>

      <Panel>
        <SectionHeader title={t.why} description={detail.explainability.summary} />
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-4"><div><h3 className="text-xs font-bold text-emerald-300">{t.supporting}</h3><TextList items={detail.explainability.supportingEvidence} empty={t.noneDocumented} /></div><div><h3 className="text-xs font-bold text-rose-300">{t.contradicting}</h3><TextList items={detail.explainability.contradictingEvidence} empty={t.noneDocumented} /></div><div><h3 className="text-xs font-bold text-amber-300">{t.missing}</h3><TextList items={detail.explainability.missingEvidence} empty={t.noneDocumented} /></div></div>
          <div><h3 className="flex items-center gap-2 text-xs font-bold text-cyan-200"><FlaskConical className="h-4 w-4" />{t.appliedRules}</h3><ul className="mt-2 space-y-2">{detail.explainability.traceHighlights.map((rule) => <li key={`${rule.ruleId}:${rule.summary}`} className="rounded-lg bg-slate-950/60 p-3 text-[10px]"><span className="font-mono font-bold text-amber-300">{rule.ruleId}</span><p className="mt-1 text-slate-300">{rule.summary}</p><p className="mt-1 text-slate-600">{rule.version}</p></li>)}</ul><p className="mt-3 text-[10px] text-slate-500">{t.methodology}: {detail.explainability.ruleVersions.join(', ')}</p></div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-100"><p className="font-bold">{t.scoreDisclaimer}</p><p className="mt-1"><strong>{t.confidenceExplanation}:</strong> {detail.explainability.confidenceExplanation}</p><p className="mt-1">{detail.explainability.humanReviewExplanation}</p></div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"><div><h3 className="text-xs font-bold text-slate-200">{t.assumptions}</h3><TextList items={detail.explainability.assumptions} empty={t.noneDocumented} /></div><div><h3 className="text-xs font-bold text-slate-200">{t.limitations}</h3><TextList items={detail.explainability.limitations} empty={t.noneDocumented} /></div></div>
      </Panel>

      {detail.warnings.length > 0 && <Panel><h2 className="flex items-center gap-2 text-sm font-bold text-amber-300"><AlertTriangle className="h-4 w-4" />{t.warnings}</h2><div className="mt-3"><TextList items={detail.warnings} empty={t.noneDocumented} /></div></Panel>}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Panel><h2 className="text-lg font-bold text-white">{t.assumptions}</h2><div className="mt-3"><TextList items={assumptions} empty={t.noneDocumented} /></div></Panel><Panel><h2 className="text-lg font-bold text-white">{t.limitations}</h2><div className="mt-3 max-h-72 overflow-y-auto pr-2"><TextList items={limitations} empty={t.noneDocumented} /></div></Panel></div>
      <DisclosurePanel disclosure={detail.disclosures[0] ?? detail.summary.syntheticDisclosure} boundary={t.operatorBoundary} />
      <Panel><div className="flex items-start gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><h2 className="text-sm font-bold text-white">{t.review}</h2><p className="mt-1 text-xs leading-5 text-slate-300">{detail.explainability.humanReviewExplanation}</p><p className="mt-2 text-[10px] text-slate-500">Available inspection operations: {detail.availableOperations.filter((operation) => operation !== 'none').join(', ')}. No operation executes dispatch or approval.</p></div></div></Panel>
    </div>
  );
};
