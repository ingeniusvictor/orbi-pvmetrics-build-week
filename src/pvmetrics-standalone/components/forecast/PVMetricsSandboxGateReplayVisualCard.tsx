import {
  PVMetricsSandboxGateReplayScenario,
  PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY,
} from '../../data/pvMetricsSandboxGateReplayMockData';

type PVMetricsSandboxGateReplayVisualCardProps = {
  scenarios: PVMetricsSandboxGateReplayScenario[];
};

const kindTone = {
  'safe-pass': 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  'human-review': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'blocked-source': 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'blocked-write': 'border-orange-400/30 bg-orange-950/20 text-orange-100',
  'blocked-telecontrol': 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'blocked-regulatory': 'border-violet-400/30 bg-violet-950/20 text-violet-100',
};

const decisionTone = {
  'allow-mock-use': 'text-emerald-300',
  'require-human-review': 'text-amber-300',
  'reject-packet': 'text-rose-300',
};

export const PVMetricsSandboxGateReplayVisualCard = ({
  scenarios,
}: PVMetricsSandboxGateReplayVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            SANDBOX GATE REPLAY
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Replay visual de escenarios controlados
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Visualización mock de escenarios permitidos, escenarios con revisión
            humana y escenarios bloqueados. No ejecuta sandbox real, no conecta
            fuentes externas y no llama APIs.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center text-cyan-100">
          <p className="text-xs uppercase tracking-wide">Replay Summary</p>
          <p className="mt-1 text-lg font-black uppercase">
            {PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.internalVersion}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Total scenarios
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-50">
            {PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.totalScenarios}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Safe pass
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-100">
            {PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.safePassCount}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-amber-300">
            Human review
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-100">
            {PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.humanReviewCount}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs uppercase tracking-wide text-rose-300">
            Blocked
          </p>
          <p className="mt-1 text-2xl font-bold text-rose-100">
            {PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.blockedCount}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {scenarios.map((scenario) => (
          <article
            key={scenario.scenarioId}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {scenario.scenarioId}
                </p>

                <h4 className="mt-1 text-xl font-black text-slate-50">
                  {scenario.label}
                </h4>

                <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
                  {scenario.description}
                </p>
              </div>

              <div
                className={`rounded-2xl border px-4 py-3 text-center ${kindTone[scenario.kind]}`}
              >
                <p className="text-xs uppercase tracking-wide">Kind</p>
                <p className="mt-1 text-sm font-black uppercase">
                  {scenario.kind}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Source Mode
                </p>
                <p className="mt-1 text-sm font-bold text-slate-100">
                  {scenario.sourceMode}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Source Safety
                </p>
                <p className="mt-1 text-sm font-bold text-cyan-200">
                  {scenario.sourceSafety}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Expected Outcome
                </p>
                <p className={`mt-1 text-sm font-bold ${decisionTone[scenario.expectedOutcome]}`}>
                  {scenario.expectedOutcome}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Overall Decision
                </p>
                <p className={`mt-1 text-sm font-bold ${decisionTone[scenario.overallDecision as keyof typeof decisionTone] ?? 'text-slate-300'}`}>
                  {scenario.overallDecision}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
                  Blocked Reasons
                </p>
                <ul className="mt-3 space-y-2 text-sm text-rose-100">
                  {scenario.blockedReasons.length > 0 ? (
                    scenario.blockedReasons.map((item) => (
                      <li key={item}>• {item}</li>
                    ))
                  ) : (
                    <li>• Sin bloqueos.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                  Warnings
                </p>
                <ul className="mt-3 space-y-2 text-sm text-amber-100">
                  {scenario.warnings.length > 0 ? (
                    scenario.warnings.map((item) => <li key={item}>• {item}</li>)
                  ) : (
                    <li>• Sin advertencias.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-orange-400/20 bg-orange-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Human Review
                </p>
                <ul className="mt-3 space-y-2 text-sm text-orange-100">
                  {scenario.humanReviewReasons.length > 0 ? (
                    scenario.humanReviewReasons.map((item) => (
                      <li key={item}>• {item}</li>
                    ))
                  ) : (
                    <li>• Sin revisión humana obligatoria.</li>
                  )}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {PV_METRICS_SANDBOX_GATE_REPLAY_MOCK_SUMMARY.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
