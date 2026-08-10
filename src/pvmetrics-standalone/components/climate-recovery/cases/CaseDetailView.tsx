import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  ShieldAlert,
} from 'lucide-react';
import type { CaseDetailPresentation, RecommendedActionPresentation } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';
import { GuidedDemoAnchor, type GuidedDemoAnchorContract } from '../demo/GuidedDemoAnchor';
import { formatPresentationNumber, localizePresentationText } from '../presentationLocalization';
import {
  AvailabilityValue,
  DisclosurePanel,
  EmptyState,
  MetricCard,
  Panel,
  SectionHeader,
  StatusBadge,
  SyntheticBadge,
} from '../shared/Display';

const buttonClass = 'cr-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400';

const formatRate = (value: number, locale: ClimateRecoveryLocale) => new Intl.NumberFormat(
  locale === 'es' ? 'es-CL' : 'en-US',
  { style: 'percent', maximumFractionDigits: 1 },
).format(value);

const TextList: React.FC<{ items: string[]; empty: string }> = ({ items, empty }) => items.length > 0
  ? <ul className="list-disc space-y-2 pl-5 text-xs leading-5 text-slate-300">{items.map((item, index) => <li key={`${index}:${item}`}>{item}</li>)}</ul>
  : <p className="text-xs text-slate-500">{empty}</p>;

const Accordion: React.FC<{
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ id, title, open, onToggle, children }) => (
  <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      id={`${id}-button`}
      onClick={onToggle}
      className="cr-button flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
    >
      {title}<ChevronDown className={`h-4 w-4 text-amber-300 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
    </button>
    <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} hidden={!open} className="border-t border-slate-800 p-4 sm:p-5">
      {children}
    </div>
  </section>
);

const ActionCard: React.FC<{
  action: RecommendedActionPresentation;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  suppressed?: boolean;
}> = ({ action, locale, t, suppressed = false }) => (
  <article className={`rounded-xl border p-4 ${suppressed ? 'border-slate-700 bg-slate-950/35' : 'border-amber-500/20 bg-amber-500/[0.06]'}`}>
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge value={action.urgency} t={t} />
      <StatusBadge value={action.status} t={t} />
      {action.requiresApproval && <StatusBadge value="pending-review" label={t.approvalRequired} t={t} />}
    </div>
    <p className="mt-3 text-sm font-bold text-white">{localizePresentationText(action.actionType, locale)}</p>
    <p className="mt-2 text-xs leading-5 text-slate-300">{action.rationale}</p>
    <p className="mt-2 text-xs leading-5 text-cyan-100"><strong>{t.expectedOutcome}:</strong> {action.expectedOutcome}</p>
    <div className="mt-3"><TextList items={[...action.safetyNotes, ...action.uncertaintyNotes]} empty={t.noneDocumented} /></div>
  </article>
);

export const CaseDetailView: React.FC<{
  detail?: CaseDetailPresentation;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  onBack: () => void;
  guidedOpenSections?: readonly string[];
  guidedAnchor?: GuidedDemoAnchorContract;
}> = ({ detail, locale, t, onBack, guidedOpenSections, guidedAnchor }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(guidedOpenSections));
  useEffect(() => {
    setOpenSections(new Set(guidedOpenSections));
  }, [detail?.summary.caseId, guidedOpenSections]);
  if (!detail) return <EmptyState title={t.caseNotFound} action={<button type="button" onClick={onBack} className={buttonClass}>{t.back}</button>} />;

  const toggle = (id: string) => setOpenSections((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const recommendedActions = detail.actions.filter((action) => action.status !== 'suppressed');
  const suppressedActions = detail.actions.filter((action) => action.status === 'suppressed');
  const evidenceGroups = {
    supporting: detail.evidence.filter((item) => item.direction.includes('support')),
    contradicting: detail.evidence.filter((item) => item.direction.includes('contradict')),
    neutral: detail.evidence.filter((item) => item.qualityStatus !== 'unavailable' && !item.direction.includes('support') && !item.direction.includes('contradict')),
    unavailable: detail.evidence.filter((item) => item.qualityStatus === 'unavailable'),
  };
  const assumptions = [...new Set([...detail.scenarios.flatMap((item) => item.assumptions), ...detail.climateImpact.assumptions, ...detail.explainability.assumptions])];
  const limitations = [...new Set([...detail.limitations, ...detail.scenarios.flatMap((item) => item.limitations), ...detail.climateImpact.limitations, ...detail.explainability.limitations])];

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className={buttonClass}><ArrowLeft className="h-4 w-4" />{t.opportunities}</button>

      {guidedAnchor && ['recoverable-case', 'non-recoverable'].includes(guidedAnchor.stepId) && <GuidedDemoAnchor {...guidedAnchor} />}
      <div id="cr-case-summary" tabIndex={-1} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
        <Panel>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2"><StatusBadge value={detail.summary.priorityBand} t={t} /><StatusBadge value={detail.summary.recoverability} t={t} /><StatusBadge value={detail.summary.currentStatus} t={t} /><SyntheticBadge label={t.demonstration} /></div>
              <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">{detail.summary.caseTitle}</h2>
              <p className="mt-2 text-xs text-slate-500">{detail.summary.plantId} · {detail.summary.assetId} · {detail.summary.category}</p>
              <p className="mt-4 text-base font-semibold leading-6 text-cyan-100">{detail.summary.headline}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{detail.summary.executiveNarrative}</p>
            </div>
            <dl className="grid shrink-0 grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-2">
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.confidence}</dt><dd className="mt-1 font-mono text-white"><AvailabilityValue value={detail.summary.confidence} locale={locale} t={t} /></dd></div>
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.dataSufficiency}</dt><dd className="mt-1"><StatusBadge value={detail.summary.dataSufficiency} t={t} /></dd></div>
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.review}</dt><dd className="mt-1"><StatusBadge value={detail.summary.humanReviewRequired ? 'pending-review' : 'low'} label={detail.summary.humanReviewRequired ? t.required : t.notRequired} t={t} /></dd></div>
              <div className="rounded-xl bg-slate-950/70 p-3"><dt className="text-slate-500">{t.evaluated}</dt><dd className="mt-1 font-mono text-white">{detail.summary.lastEvaluatedAt.formattedValue}</dd></div>
            </dl>
          </div>
        </Panel>
      </div>

      {guidedAnchor?.stepId === 'insufficient-data' && <GuidedDemoAnchor {...guidedAnchor} />}
      {detail.warnings.length > 0 && <div id="cr-case-warnings" tabIndex={-1} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><Panel><div className="flex items-center gap-2 text-sm font-bold text-amber-300"><AlertTriangle className="h-4 w-4" />{t.warnings}</div><div className="mt-3"><TextList items={detail.warnings} empty={t.noneDocumented} /></div></Panel></div>}
      {detail.climateImpact.availability === 'blocked' && <div id="cr-climate-blocking" tabIndex={-1} className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100"><div className="flex items-center gap-2 font-bold"><ShieldAlert className="h-4 w-4" />{t.blocked}</div><div className="mt-2"><TextList items={detail.climateImpact.blockingReasons} empty={t.noneDocumented} /></div></div>}
      <DisclosurePanel disclosure={detail.disclosures[0] ?? detail.summary.syntheticDisclosure} boundary={t.operatorBoundary} ariaLabel={t.syntheticDisclosureLabel} />

      <section aria-labelledby="case-key-metrics">
        <SectionHeader title={t.keyMetrics} />
        <div id="case-key-metrics" className="mt-4 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4">
          {detail.kpis.map((kpi) => <MetricCard key={kpi.id} label={kpi.labelKey} explanation={kpi.explanation} status={kpi.value.availability}><AvailabilityValue value={kpi.value} locale={locale} t={t} /></MetricCard>)}
        </div>
      </section>

      <Panel>
        <SectionHeader title={t.recommendedNextStepTitle} description={detail.summary.recommendedNextStep} />
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {recommendedActions.length ? recommendedActions.map((action) => <ActionCard key={action.id} action={action} locale={locale} t={t} />) : <EmptyState title={t.noneDocumented} />}
        </div>
      </Panel>

      {guidedAnchor?.stepId === 'climate-impact' && <GuidedDemoAnchor {...guidedAnchor} />}
      <div id="cr-recovery-scenario" tabIndex={-1} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
        <Panel>
          <SectionHeader title={t.recoveryScenario} description={t.scenarioDisclosure} />
          {detail.scenarios.length === 0 ? <div className="mt-4"><EmptyState title={t.unavailable} /></div> : <div className="mt-4 space-y-4">{detail.scenarios.map((scenario) => {
            const comparable = typeof scenario.noIntervention.value === 'number' && typeof scenario.intervention.value === 'number';
            const maximum = comparable ? Math.max(scenario.noIntervention.value!, scenario.intervention.value!, 1) : 1;
            return <article key={scenario.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex flex-wrap gap-2"><SyntheticBadge label={t.projected} /><StatusBadge value="informational" label={`${t.horizon}: ${localizePresentationText(scenario.horizon, locale)}`} t={t} /></div>
              <p className="mt-3 text-sm font-bold text-white">{scenario.nameKey}</p>
              <dl className="mt-4 grid grid-cols-1 gap-2 min-[430px]:grid-cols-3 text-xs"><div className="rounded-lg bg-slate-900 p-3"><dt className="text-slate-500">{t.noIntervention}</dt><dd className="mt-2 font-mono text-slate-100"><AvailabilityValue value={scenario.noIntervention} locale={locale} t={t} /></dd></div><div className="rounded-lg bg-slate-900 p-3"><dt className="text-slate-500">{t.withIntervention}</dt><dd className="mt-2 font-mono text-slate-100"><AvailabilityValue value={scenario.intervention} locale={locale} t={t} /></dd></div><div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3"><dt className="text-emerald-300">{t.projectedRecovery}</dt><dd className="mt-2 font-mono text-emerald-100"><AvailabilityValue value={scenario.recoveredEnergy} locale={locale} t={t} /></dd></div></dl>
              {comparable && <div className="mt-4 space-y-2" role="img" aria-label={`${t.noIntervention}: ${scenario.noIntervention.formattedValue}; ${t.withIntervention}: ${scenario.intervention.formattedValue}`}><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-slate-500" style={{ width: `${Math.max(3, (scenario.noIntervention.value! / maximum) * 100)}%` }} /></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(3, (scenario.intervention.value! / maximum) * 100)}%` }} /></div></div>}
              <table className="mt-4 w-full text-left text-xs"><caption className="sr-only">{t.scenarioTable}</caption><thead className="text-slate-500"><tr><th scope="col" className="py-1">{t.noIntervention}</th><th scope="col" className="py-1">{t.withIntervention}</th><th scope="col" className="py-1">{t.projectedRecovery}</th></tr></thead><tbody><tr className="text-slate-200"><td className="py-1"><AvailabilityValue value={scenario.noIntervention} locale={locale} t={t} /></td><td className="py-1"><AvailabilityValue value={scenario.intervention} locale={locale} t={t} /></td><td className="py-1"><AvailabilityValue value={scenario.recoveredEnergy} locale={locale} t={t} /></td></tr></tbody></table>
              <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2"><p>{t.recoveryRate}: {detail.summary.recoveryOpportunity.recoveryRateAssumption === undefined ? t.unavailable : formatRate(detail.summary.recoveryOpportunity.recoveryRateAssumption, locale)}</p><p>{t.uncertainty}: {detail.summary.recoveryOpportunity.uncertainty ? `${formatPresentationNumber(detail.summary.recoveryOpportunity.uncertainty.lowerBound, locale)}–${formatPresentationNumber(detail.summary.recoveryOpportunity.uncertainty.upperBound, locale)} ${detail.summary.recoveryOpportunity.uncertainty.unit} · ${detail.summary.recoveryOpportunity.uncertainty.confidenceDescriptor}` : t.unavailable}</p></div>
            </article>;
          })}</div>}
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.avoidedEmissions}</dt><dd className="mt-2 font-mono text-white"><AvailabilityValue value={detail.climateImpact.estimatedAvoidedEmissions} locale={locale} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.factor}</dt><dd className="mt-2 font-mono text-white"><AvailabilityValue value={detail.climateImpact.emissionFactor} locale={locale} t={t} /></dd></div>
            <div className="rounded-xl bg-slate-950/60 p-3"><dt className="text-slate-500">{t.verification}</dt><dd className="mt-2"><StatusBadge value="unavailable" label={t.notVerified} t={t} /></dd></div>
          </dl>
        </Panel>
      </div>

      <Panel>
        <div className="flex items-start gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" /><div><SectionHeader title={t.review} /><p className="mt-2 text-sm leading-6 text-slate-300">{detail.explainability.humanReviewExplanation}</p><p className="mt-2 text-xs text-slate-500">{t.operatorBoundary}</p></div></div>
      </Panel>

      <section aria-labelledby="technical-details-heading" className="space-y-3">
        <div id="technical-details-heading"><SectionHeader title={t.technicalDetails} description={t.hypothesesBoundary} /></div>

        <Accordion id="evidence" title={t.evidence} open={openSections.has('evidence')} onToggle={() => toggle('evidence')}>
          <div className="grid gap-4 lg:grid-cols-2">{(Object.entries(evidenceGroups) as Array<[keyof typeof evidenceGroups, typeof detail.evidence]>).map(([key, values]) => <div key={key}><p className="text-xs font-bold text-cyan-200">{{ supporting: t.supporting, contradicting: t.contradicting, neutral: t.neutral, unavailable: t.missing }[key]}</p><div className="mt-2 space-y-2">{values.length ? values.map((item) => <article key={item.id} className="rounded-lg bg-slate-950/60 p-3"><p className="text-xs font-semibold text-white">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-400">{item.description}</p><div className="mt-2 flex flex-wrap items-center gap-2"><StatusBadge value={item.qualityStatus} t={t} /><span className="font-mono text-xs text-slate-500">{t.source}: {item.sourceReference}</span></div></article>) : <p className="text-xs text-slate-500">{t.noneDocumented}</p>}</div></div>)}</div>
          <div className="mt-4"><p className="text-xs font-bold text-amber-200">{t.missing}</p><div className="mt-2"><TextList items={detail.explainability.missingEvidence} empty={t.noneDocumented} /></div></div>
        </Accordion>

        <Accordion id="hypotheses" title={t.hypotheses} open={openSections.has('hypotheses')} onToggle={() => toggle('hypotheses')}>
          <div className="grid gap-3 lg:grid-cols-2">{detail.hypotheses.map((hypothesis) => <article key={hypothesis.id} className="rounded-xl bg-slate-950/50 p-4"><div className="flex flex-wrap gap-2"><StatusBadge value={hypothesis.status} t={t} /><StatusBadge value="medium" label={`${t.confidence}: ${hypothesis.confidence}`} t={t} />{hypothesis.requiresHumanReview && <StatusBadge value="pending-review" label={t.review} t={t} />}</div><p className="mt-3 text-sm font-bold text-white">{hypothesis.title}</p><p className="mt-2 text-xs leading-5 text-slate-300">{hypothesis.summary}</p><p className="mt-2 text-xs text-slate-500">{t.notDiagnosis}</p></article>)}</div>
        </Accordion>

        <Accordion id="timeline" title={t.timeline} open={openSections.has('timeline')} onToggle={() => toggle('timeline')}>
          <p className="text-xs text-slate-500">{t.stableTimeline}</p><ol className="mt-4 space-y-4 border-l border-slate-700 pl-5">{detail.timeline.map((event) => <li key={event.id} className="relative"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-amber-400" /><div className="flex flex-wrap items-center gap-2"><time className="font-mono text-xs text-slate-500">{event.timestamp}</time><StatusBadge value={event.severity} t={t} /></div><p className="mt-2 text-xs font-bold text-white">{localizePresentationText(event.eventType, locale)}</p><p className="mt-1 text-xs leading-5 text-slate-400">{event.descriptionKey}</p></li>)}</ol>
        </Accordion>

        <Accordion id="explainability" title={t.why} open={openSections.has('explainability')} onToggle={() => toggle('explainability')}>
          <p className="text-sm leading-6 text-slate-300">{detail.explainability.summary}</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2"><div><p className="text-xs font-bold text-emerald-300">{t.supporting}</p><TextList items={detail.explainability.supportingEvidence} empty={t.noneDocumented} /><p className="mt-4 text-xs font-bold text-rose-300">{t.contradicting}</p><TextList items={detail.explainability.contradictingEvidence} empty={t.noneDocumented} /></div><div><p className="flex items-center gap-2 text-xs font-bold text-cyan-200"><FlaskConical className="h-4 w-4" />{t.appliedRules}</p><ul className="mt-2 space-y-2">{detail.explainability.traceHighlights.map((rule) => <li key={`${rule.ruleId}:${rule.summary}`} className="rounded-lg bg-slate-950/60 p-3 text-xs"><span className="font-mono font-bold text-amber-300">{rule.ruleId}</span><p className="mt-1 text-slate-300">{rule.summary}</p><p className="mt-1 text-slate-600">{rule.version}</p></li>)}</ul></div></div>
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-100"><p className="font-bold">{t.scoreDisclaimer}</p><p className="mt-1">{detail.explainability.confidenceExplanation}</p></div>
        </Accordion>

        <Accordion id="methodology" title={t.methodology} open={openSections.has('methodology')} onToggle={() => toggle('methodology')}>
          <dl className="grid gap-4 text-xs lg:grid-cols-2"><div className="rounded-xl bg-slate-950/60 p-4"><dt className="font-bold text-cyan-200">{t.recoveryOpportunity}</dt><dd className="mt-2 leading-5 text-slate-300">{detail.summary.recoveryOpportunity.methodology}</dd></div><div className="rounded-xl bg-slate-950/60 p-4"><dt className="font-bold text-cyan-200">{t.climateImpact}</dt><dd className="mt-2 leading-5 text-slate-300">{detail.climateImpact.methodology}</dd></div><div className="rounded-xl bg-slate-950/60 p-4"><dt className="font-bold text-cyan-200">{t.factor}</dt><dd className="mt-2 text-slate-300">{detail.climateImpact.factorRegion ?? t.unavailable}{detail.climateImpact.factorYear ? ` · ${detail.climateImpact.factorYear}` : ''} · {t.demonstration}</dd></div><div className="rounded-xl bg-slate-950/60 p-4"><dt className="font-bold text-cyan-200">{t.appliedRules}</dt><dd className="mt-2 font-mono text-slate-300">{detail.explainability.ruleVersions.join(', ')}</dd></div></dl>
        </Accordion>

        <Accordion id="assumptions" title={t.assumptions} open={openSections.has('assumptions')} onToggle={() => toggle('assumptions')}><TextList items={assumptions} empty={t.noneDocumented} /></Accordion>
        <Accordion id="limitations" title={t.limitations} open={openSections.has('limitations')} onToggle={() => toggle('limitations')}><TextList items={limitations} empty={t.noneDocumented} /></Accordion>
        <Accordion id="suppressed-actions" title={t.suppressedActions} open={openSections.has('suppressed-actions')} onToggle={() => toggle('suppressed-actions')}>
          <p className="mb-4 text-xs leading-5 text-slate-400">{t.suppressedReason}</p><div className="grid gap-3 lg:grid-cols-2">{suppressedActions.length ? suppressedActions.map((action) => <ActionCard key={action.id} action={action} locale={locale} t={t} suppressed />) : <EmptyState title={t.noneDocumented} />}</div>
        </Accordion>
      </section>
    </div>
  );
};
