import { PV_METRICS_PRESENTATION_FLOW_PACK_MOCK } from '../../data/pvMetricsLocalDemoModeMockState';
import { PVMetricsPresentationFlowPack } from '../../types/pvmetrics-local-demo-mode.types';

type PVMetricsPresentationFlowVisualCardProps = {
  flowPack?: PVMetricsPresentationFlowPack;
};

const severityTone = {
  info: 'border-cyan-400/20 bg-cyan-950/20 text-cyan-100',
  warning: 'border-amber-400/20 bg-amber-950/20 text-amber-100',
  critical: 'border-rose-400/20 bg-rose-950/20 text-rose-100',
};

export const PVMetricsPresentationFlowVisualCard = ({
  flowPack = PV_METRICS_PRESENTATION_FLOW_PACK_MOCK,
}: PVMetricsPresentationFlowVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            LOCAL DEMO PRESENTATION FLOW
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Flujo seguro de presentación local
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Guía visual para presentar ORBI PVMetrics IA como demo local, mock,
            read-only y segura. No activa toggle real, no persiste estado y no
            conecta fuentes externas.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-cyan-100">
            {flowPack.internalVersion}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {flowPack.audienceModes.map((audience) => (
          <article
            key={audience.audienceId}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Audience Mode
            </p>

            <h4 className="mt-1 text-lg font-black text-slate-50">
              {audience.label}
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {audience.description}
            </p>

            <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-950/10 p-3">
              <p className="text-xs font-bold uppercase text-emerald-300">
                Enfoque permitido
              </p>
              <ul className="mt-2 space-y-1 text-xs text-emerald-100">
                {audience.allowedFocus.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-950/10 p-3">
              <p className="text-xs font-bold uppercase text-rose-300">
                Evitar
              </p>
              <ul className="mt-2 space-y-1 text-xs text-rose-100">
                {audience.blockedFocus.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Presentation Stages
        </p>

        <div className="mt-4 space-y-3">
          {flowPack.presentationStages.map((stage) => (
            <article
              key={stage.stageId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-lg font-black text-slate-50">
                  {stage.order}. {stage.label}
                </h4>

                <span className="rounded-full border border-violet-400/20 bg-violet-950/30 px-3 py-1 text-xs font-bold text-violet-100">
                  {stage.audienceModes.join(' / ')}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {stage.objective}
              </p>

              <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-950/20 p-3 text-sm text-amber-100">
                {stage.safetyReminder}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Safe Demo Script
          </p>

          <ol className="mt-3 space-y-2 text-sm text-cyan-100">
            {flowPack.safeDemoScript.map((line) => (
              <li key={line.lineId}>
                {line.order}. {line.text}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Operator Notes
          </p>

          <div className="mt-3 space-y-3">
            {flowPack.operatorNotes.map((note) => (
              <article
                key={note.noteId}
                className={`rounded-2xl border p-3 ${severityTone[note.severity]}`}
              >
                <p className="text-sm font-bold">{note.label}</p>
                <p className="mt-1 text-sm">{note.instruction}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Client Narrative Guardrails
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {flowPack.clientNarrativeGuardrails.map((guardrail) => (
            <article
              key={guardrail.guardrailId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-sm font-black text-slate-50">
                {guardrail.label}
              </p>

              <p className="mt-3 text-xs font-bold uppercase text-emerald-300">
                Usar
              </p>
              <p className="mt-1 text-sm text-emerald-100">
                {guardrail.preferredLanguage}
              </p>

              <p className="mt-3 text-xs font-bold uppercase text-rose-300">
                Evitar
              </p>
              <p className="mt-1 text-sm text-rose-100">
                {guardrail.forbiddenLanguage}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Exit Criteria
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {flowPack.exitCriteria.map((criterion) => (
            <article
              key={criterion.criterionId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-sm font-bold text-slate-100">
                {criterion.passed ? '✓' : '•'} {criterion.label}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {criterion.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          {flowPack.demoModeState.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
