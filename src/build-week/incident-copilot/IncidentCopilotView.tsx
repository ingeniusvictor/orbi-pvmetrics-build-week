import {
  AlertTriangle,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileQuestion,
  FlaskConical,
  Gauge,
  Link2,
  ListChecks,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { requestGptAdvisory } from './advisoryClient';
import {
  clearIncidentAdvisory,
  createIncidentAdvisoryState,
  GPT_ADVISORY_TITLE,
  recordIncidentAdvisory,
} from './advisoryDomain';
import {
  HumanReviewState,
  IncidentAssessment,
  IncidentObservation,
} from './domain';
import {
  DEVELOPMENT_ASSISTANCE,
  deterministicIncidentAnalysisProvider,
  RUNTIME_ANALYSIS_PROVIDER,
} from './providers';
import {
  applyHumanReview,
  createIncidentCopilotSession,
  recordIncidentAnalysis,
  selectIncidentScenario,
} from './reviewWorkflow';
import {
  getSyntheticScenario,
  SYNTHETIC_INCIDENT_SCENARIOS,
  type SyntheticIncidentScenarioId,
} from './syntheticScenarios';

const qualityStyle: Record<IncidentObservation['quality'], string> = {
  valid: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  suspect: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  stale: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  missing: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const reviewStyle: Record<HumanReviewState, string> = {
  'pending-review': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'changes-requested': 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const reviewLabel: Record<HumanReviewState, string> = {
  'pending-review': 'Pending review',
  approved: 'Approved by human',
  'changes-requested': 'Changes requested',
  rejected: 'Rejected by human',
};

const EvidenceLinks = ({ ids }: { ids: string[] }) => (
  <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Linked evidence">
    {ids.map((id) => (
      <a
        key={id}
        href={`#evidence-${id}`}
        className="inline-flex items-center gap-1 rounded border border-cyan-500/20 bg-cyan-500/5 px-2 py-1 font-mono text-[9px] text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <Link2 className="h-3 w-3" />
        {id}
      </a>
    ))}
  </div>
);

const Section = ({
  title,
  icon: Icon,
  children,
  id,
}: {
  title: string;
  icon: typeof ShieldCheck;
  children: ReactNode;
  id?: string;
}) => (
  <section id={id} className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-xl shadow-black/10">
    <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-200">
      <Icon className="h-4 w-4 text-amber-400" />
      {title}
    </h2>
    {children}
  </section>
);

const SummaryCards = ({ assessment }: { assessment: IncidentAssessment }) => {
  const energy = assessment.risk.energy;
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-gray-900 p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-300">Priority incident</p>
        <h2 className="mt-2 text-lg font-bold text-white">{assessment.priorityIncident.title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-gray-400">{assessment.priorityIncident.rationale}</p>
        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase">
          <span className="rounded bg-red-500/15 px-2 py-1 text-red-300">{assessment.priorityIncident.severity}</span>
          <span className="text-gray-500">Priority score {assessment.priorityIncident.score}/100</span>
        </div>
        <EvidenceLinks ids={assessment.priorityIncident.evidenceIds} />
      </div>

      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-gray-900 p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-300">Operational & energy risk</p>
        <h2 className="mt-2 text-lg font-bold capitalize text-white">{assessment.risk.operationalLevel} operational risk</h2>
        <p className="mt-2 text-xs leading-relaxed text-gray-400">{assessment.risk.operationalSummary}</p>
        <div className="mt-3 rounded-lg border border-gray-800 bg-black/20 p-3 text-xs text-gray-300">
          {energy.quantification === 'bounded' ? (
            <>
              <span className="font-bold text-orange-300">{energy.lowMwh}–{energy.highMwh} MWh</span>
              <span className="ml-2 text-gray-500">midpoint {energy.likelyMwh} MWh</span>
            </>
          ) : (
            <span className="font-bold text-orange-300">Not quantifiable from current valid evidence</span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-gray-900 p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">Confidence & uncertainty</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-4xl font-black text-white">{assessment.confidence.score}</span>
          <span className="pb-1 text-xs font-bold uppercase text-cyan-300">{assessment.confidence.level}</span>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800"
          role="progressbar"
          aria-label="Analysis confidence"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={assessment.confidence.score}
        >
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: `${assessment.confidence.score}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-400">{assessment.confidence.uncertainty}</p>
        <p className="mt-2 text-[10px] text-gray-500">Evidence quality score: {assessment.confidence.evidenceQualityScore}/100</p>
      </div>
    </div>
  );
};

export default function IncidentCopilotView() {
  const [session, setSession] = useState(() =>
    createIncidentCopilotSession(SYNTHETIC_INCIDENT_SCENARIOS[0].id),
  );
  const [reviewNote, setReviewNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [advisoryState, setAdvisoryState] = useState(
    createIncidentAdvisoryState,
  );
  const [isGeneratingAdvisory, setIsGeneratingAdvisory] = useState(false);
  const [advisoryError, setAdvisoryError] = useState('');
  const advisoryRequestVersion = useRef(0);
  const scenario = getSyntheticScenario(session.selectedScenarioId);

  const qualityCounts = useMemo(
    () =>
      scenario.observations.reduce(
        (counts, item) => ({
          ...counts,
          [item.quality]: counts[item.quality] + 1,
        }),
        { valid: 0, suspect: 0, stale: 0, missing: 0 },
      ),
    [scenario],
  );

  const handleScenarioChange = (id: string) => {
    advisoryRequestVersion.current += 1;
    setSession((current) => selectIncidentScenario(current, id));
    setReviewNote('');
    setError('');
    setAdvisoryState(clearIncidentAdvisory());
    setAdvisoryError('');
    setIsGeneratingAdvisory(false);
  };

  const handleAnalyze = async () => {
    advisoryRequestVersion.current += 1;
    setIsAnalyzing(true);
    setError('');
    setAdvisoryState(clearIncidentAdvisory());
    setAdvisoryError('');
    setIsGeneratingAdvisory(false);
    try {
      const assessment = await deterministicIncidentAnalysisProvider.analyze({
        scenario,
      });
      setSession((current) => recordIncidentAnalysis(current, assessment));
      setReviewNote('');
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : 'Deterministic analysis failed.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAdvisory = async () => {
    const assessment = session.assessment;
    if (!assessment) return;
    const requestVersion = advisoryRequestVersion.current + 1;
    advisoryRequestVersion.current = requestVersion;
    setIsGeneratingAdvisory(true);
    setAdvisoryError('');
    setAdvisoryState(clearIncidentAdvisory());
    try {
      const response = await requestGptAdvisory(
        {
          schemaVersion: '1.0',
          scenarioId: scenario.id as SyntheticIncidentScenarioId,
          assessmentId: assessment.assessmentId,
        },
        scenario,
      );
      if (advisoryRequestVersion.current === requestVersion) {
        setAdvisoryState(recordIncidentAdvisory(response));
      }
    } catch (advisoryRequestError) {
      if (advisoryRequestVersion.current === requestVersion) {
        setAdvisoryError(
          advisoryRequestError instanceof Error
            ? advisoryRequestError.message
            : 'The optional advisory failed safely. The deterministic assessment remains authoritative.',
        );
      }
    } finally {
      if (advisoryRequestVersion.current === requestVersion) {
        setIsGeneratingAdvisory(false);
      }
    }
  };

  const handleReview = (
    state: 'approved' | 'changes-requested' | 'rejected',
  ) => setSession((current) => applyHumanReview(current, state, reviewNote));

  const assessment = session.assessment;

  return (
    <div className="space-y-5" data-testid="incident-copilot-view">
      <header className="overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-gray-900 to-cyan-500/10">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300">
                <Sparkles className="h-3 w-3" /> OpenAI Build Week
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                <BrainCircuit className="h-3 w-3" /> Deterministic local analysis
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">Incident Intelligence Copilot</h1>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-gray-400">
              Evidence-led assessment of fixed synthetic PV and BESS incidents. Facts, hypotheses and uncertainty remain separate; every action is advisory and subject to human authority.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-gray-800 bg-slate-950/70 p-3 text-[10px] leading-relaxed text-gray-400">
            <p><strong className="text-gray-200">Runtime analysis provider:</strong> {RUNTIME_ANALYSIS_PROVIDER}</p>
            <p><strong className="text-gray-200">Optional supplemental runtime:</strong> Server-side GPT-5.6 Sol advisory interpretation</p>
            <p><strong className="text-gray-200">Development assistance:</strong> {DEVELOPMENT_ASSISTANCE}</p>
            <p className="mt-1 text-amber-300">Synthetic demonstration · read-only · no control</p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <label htmlFor="incident-scenario" className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Selected synthetic scenario
            </label>
            <select
              id="incident-scenario"
              value={session.selectedScenarioId}
              onChange={(event) => handleScenarioChange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {SYNTHETIC_INCIDENT_SCENARIOS.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-relaxed text-gray-400">{scenario.description}</p>
            <p className="mt-1 font-mono text-[9px] text-gray-600">
              {scenario.asset.id} · {scenario.window.start} → {scenario.window.end}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {assessment ? 'Rerun analysis' : 'Analyze synthetic scenario'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Evidence quality summary">
          <span className="mr-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500">
            <Gauge className="h-3.5 w-3.5" /> Evidence quality
          </span>
          {(Object.keys(qualityCounts) as Array<keyof typeof qualityCounts>).map((quality) => (
            <span key={quality} className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase ${qualityStyle[quality]}`}>
              {quality}: {qualityCounts[quality]}
            </span>
          ))}
        </div>
        {error && <p role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</p>}
      </section>

      {!assessment ? (
        <section className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/50 p-10 text-center">
          <FlaskConical className="mx-auto h-8 w-8 text-amber-400" />
          <h2 className="mt-3 text-sm font-bold text-white">Ready for deterministic analysis</h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-gray-500">
            Review the raw synthetic observations below, then run the local evidence engine. Deterministic analysis makes no external call; the optional GPT-5.6 advisory is separate and must be requested explicitly.
          </p>
        </section>
      ) : (
        <>
          <SummaryCards assessment={assessment} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Section title="Confirmed facts" icon={BadgeCheck}>
              <div className="space-y-3">
                {assessment.confirmedFacts.map((fact) => (
                  <article key={fact.id} className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                    <p className="text-xs leading-relaxed text-gray-300">{fact.statement}</p>
                    <EvidenceLinks ids={fact.evidenceIds} />
                  </article>
                ))}
              </div>
            </Section>

            <Section title="Technical hypotheses" icon={ShieldQuestion}>
              <div className="space-y-3">
                {assessment.hypotheses.map((hypothesis) => (
                  <article key={hypothesis.id} className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-3">
                    <div className="flex items-start gap-2">
                      <span className="rounded bg-cyan-500/10 px-2 py-1 text-[8px] font-bold uppercase text-cyan-300">Unconfirmed</span>
                      <p className="text-xs leading-relaxed text-gray-300">{hypothesis.statement}</p>
                    </div>
                    <p className="mt-2 text-[10px] leading-relaxed text-gray-500">{hypothesis.uncertainty}</p>
                    <EvidenceLinks ids={[...hypothesis.supportingEvidenceIds, ...hypothesis.conflictingEvidenceIds]} />
                  </article>
                ))}
              </div>
            </Section>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Section title="Conflicting evidence" icon={AlertTriangle}>
              {assessment.conflictingEvidence.length ? (
                <div className="space-y-3">
                  {assessment.conflictingEvidence.map((conflict) => (
                    <article key={conflict.id} className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                      <p className="text-xs font-semibold text-gray-300">{conflict.statement}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-orange-200/70">{conflict.implication}</p>
                      <EvidenceLinks ids={conflict.evidenceIds} />
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No explicit evidence conflict was detected for the priority pattern.</p>
              )}
            </Section>

            <Section title="Missing information" icon={FileQuestion}>
              <div className="space-y-3">
                {assessment.missingInformation.map((item) => (
                  <article key={item.id} className="rounded-xl border border-gray-800 bg-slate-950/50 p-3">
                    <p className="text-xs font-semibold text-gray-200">{item.question}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{item.whyItMatters}</p>
                  </article>
                ))}
              </div>
            </Section>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Section title="Ordered field verification" icon={SearchCheck}>
              <ol className="space-y-3">
                {assessment.verificationSteps.map((step) => (
                  <li key={step.id} className="flex gap-3 rounded-xl border border-gray-800 bg-slate-950/50 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-slate-950">{step.order}</span>
                    <div>
                      <p className="text-xs font-semibold leading-relaxed text-gray-200">{step.action}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{step.rationale}</p>
                      <p className="mt-1 text-[9px] text-amber-300/70">{step.safetyBoundary}</p>
                      <EvidenceLinks ids={step.relatedEvidenceIds} />
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Advisory O&M actions" icon={ListChecks}>
              <div className="space-y-3">
                {assessment.advisoryActions.map((action) => (
                  <article key={action.id} className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-amber-500/10 px-2 py-1 text-[8px] font-bold uppercase text-amber-300">{action.priority}</span>
                      <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase text-gray-500">
                        <ShieldCheck className="h-3 w-3" /> Human approval required
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-200">{action.action}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{action.rationale}</p>
                  </article>
                ))}
              </div>
            </Section>
          </div>

          <Section title="Executive summary" icon={ClipboardCheck}>
            <p className="text-sm leading-7 text-gray-300">{assessment.executiveSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[9px] font-mono text-gray-500">
              <span>Assessment: {assessment.assessmentId}</span>
              <span>·</span>
              <span>Rules: {assessment.trace.ruleIds.join(', ')}</span>
            </div>
          </Section>

          <section
            aria-labelledby="gpt-advisory-title"
            className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-gray-900 to-cyan-500/5 p-5 shadow-xl shadow-black/10"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-violet-200">
                    Supplemental and non-authoritative
                  </span>
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-200">
                    Human review required
                  </span>
                </div>
                <h2 id="gpt-advisory-title" className="flex items-center gap-2 text-sm font-black text-white">
                  <Sparkles className="h-4 w-4 text-violet-300" /> {GPT_ADVISORY_TITLE}
                </h2>
                <p id="gpt-advisory-boundary" className="mt-2 max-w-3xl text-xs leading-relaxed text-gray-400">
                  The deterministic assessment remains authoritative. GPT-5.6 cannot modify facts, priority, risk, confidence, evidence, calculations, or review state. Only fixed synthetic data is sent; output is advisory and cannot approve an assessment or control equipment.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAdvisory}
                disabled={isGeneratingAdvisory}
                aria-describedby="gpt-advisory-boundary"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/15 px-5 py-3 text-xs font-black uppercase tracking-wider text-violet-100 transition hover:bg-violet-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-wait disabled:opacity-60"
              >
                <Sparkles className={`h-4 w-4 ${isGeneratingAdvisory ? 'animate-pulse' : ''}`} />
                {isGeneratingAdvisory ? 'Generating advisory' : 'Generate GPT-5.6 advisory'}
              </button>
            </div>

            {advisoryError && (
              <p role="alert" className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200">
                {advisoryError}
              </p>
            )}

            {advisoryState.response && (
              <div className="mt-5 space-y-4" data-testid="gpt-advisory-interpretation">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <article className="rounded-xl border border-violet-500/20 bg-slate-950/55 p-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-200">Advisory summary</h3>
                    <p className="mt-2 text-xs leading-6 text-gray-300">{advisoryState.response.advisory.advisorySummary}</p>
                  </article>
                  <article className="rounded-xl border border-cyan-500/20 bg-slate-950/55 p-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">Uncertainty explanation</h3>
                    <p className="mt-2 text-xs leading-6 text-gray-300">{advisoryState.response.advisory.uncertaintyExplanation}</p>
                  </article>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-xl border border-gray-800 bg-slate-950/55 p-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-200">Human-review questions</h3>
                    <ol className="mt-3 space-y-3">
                      {advisoryState.response.advisory.humanReviewQuestions.map((question) => (
                        <li key={question.id} className="rounded-lg border border-gray-800 bg-black/20 p-3">
                          <p className="text-xs font-semibold leading-relaxed text-gray-200">{question.question}</p>
                          <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{question.rationale}</p>
                          <EvidenceLinks ids={question.evidenceIds} />
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-xl border border-gray-800 bg-slate-950/55 p-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-200">Investigation considerations</h3>
                    <ol className="mt-3 space-y-3">
                      {advisoryState.response.advisory.investigationConsiderations.map((consideration) => (
                        <li key={consideration.id} className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3">
                          <span className="text-[8px] font-bold uppercase text-amber-300">Human approval required</span>
                          <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-200">{consideration.consideration}</p>
                          <p className="mt-1 text-[10px] leading-relaxed text-gray-500">{consideration.rationale}</p>
                          <EvidenceLinks ids={consideration.evidenceIds} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-slate-950/55 p-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-200">Limitations</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-gray-400">
                    {advisoryState.response.advisory.limitations.map((limitation) => (
                      <li key={limitation}>{limitation}</li>
                    ))}
                  </ul>
                  <p className="mt-3 font-mono text-[9px] text-gray-500">
                    Provider: {advisoryState.response.provider.id} · Model: {advisoryState.response.provider.model} · Role: {advisoryState.response.provider.role}
                  </p>
                </div>
              </div>
            )}
          </section>

          <Section title="Human review state" icon={ShieldCheck} id="incident-human-review">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <span role="status" aria-live="polite" className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${reviewStyle[assessment.review.state]}`}>
                  {reviewLabel[assessment.review.state]}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  The provider cannot approve its own assessment. Rerunning analysis or changing scenario resets this state to pending review.
                </p>
                <label htmlFor="review-note" className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-gray-400">Human review note</label>
                <textarea
                  id="review-note"
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  rows={3}
                  placeholder="Optional reviewer rationale"
                  className="mt-2 w-full rounded-xl border border-gray-700 bg-slate-950 p-3 text-xs text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                <button type="button" onClick={() => handleReview('approved')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[10px] font-bold uppercase text-emerald-300 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
                <button type="button" onClick={() => handleReview('changes-requested')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-[10px] font-bold uppercase text-orange-300 hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
                  <ChevronRight className="h-4 w-4" /> Request changes
                </button>
                <button type="button" onClick={() => handleReview('rejected')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[10px] font-bold uppercase text-red-300 hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          </Section>
        </>
      )}

      <Section title="Raw synthetic evidence" icon={FlaskConical} id="incident-evidence">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {scenario.observations.map((item) => (
            <article
              key={item.id}
              id={`evidence-${item.id}`}
              tabIndex={-1}
              className="scroll-mt-6 rounded-xl border border-gray-800 bg-slate-950/60 p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-within:border-cyan-500/30 target:border-cyan-400 target:bg-cyan-500/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[9px] text-cyan-300">{item.id}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase ${qualityStyle[item.quality]}`}>{item.quality}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-300">{item.statement}</p>
              <dl className="mt-2 grid grid-cols-1 gap-1 text-[9px] text-gray-500 sm:grid-cols-2">
                <div><dt className="inline font-bold text-gray-400">Signal: </dt><dd className="inline font-mono">{item.signal}</dd></div>
                <div><dt className="inline font-bold text-gray-400">Value: </dt><dd className="inline font-mono">{String(item.value)} {item.unit}</dd></div>
                <div><dt className="inline font-bold text-gray-400">Source: </dt><dd className="inline">{item.source.label}</dd></div>
                <div><dt className="inline font-bold text-gray-400">Time: </dt><dd className="inline font-mono">{item.observedAt}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
