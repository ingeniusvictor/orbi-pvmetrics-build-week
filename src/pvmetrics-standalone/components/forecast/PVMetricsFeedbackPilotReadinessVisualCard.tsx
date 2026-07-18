import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK } from '../../data/pvMetricsClientDemoFeedbackMockData';
import { PVMetricsControlledClientDemoFeedbackPack } from '../../types/pvmetrics-client-demo-feedback.types';

type Props = {
  feedbackPack?: PVMetricsControlledClientDemoFeedbackPack;
};

type PanelProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const Panel = ({ title, eyebrow, children }: PanelProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
        {eyebrow}
      </p>
    )}
    <h4 className="mt-1 text-lg font-black text-slate-50">{title}</h4>
    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full border border-emerald-400/30 bg-emerald-950/30 px-3 py-1 text-xs font-bold uppercase text-emerald-100">
    {children}
  </span>
);

const RiskBadge = ({ severity }: { severity: string }) => {
  const tone =
    severity === 'critical'
      ? 'border-rose-400/40 bg-rose-950/40 text-rose-100'
      : severity === 'high'
        ? 'border-amber-400/40 bg-amber-950/40 text-amber-100'
        : 'border-cyan-400/40 bg-cyan-950/40 text-cyan-100';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone}`}>
      {severity}
    </span>
  );
};

const SignalBadge = ({ signal }: { signal: string }) => {
  const tone =
    signal === 'blocking'
      ? 'border-rose-400/40 bg-rose-950/40 text-rose-100'
      : signal === 'caution'
        ? 'border-amber-400/40 bg-amber-950/40 text-amber-100'
        : 'border-emerald-400/40 bg-emerald-950/40 text-emerald-100';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone}`}>
      {signal}
    </span>
  );
};

export const PVMetricsFeedbackPilotReadinessVisualCard = ({
  feedbackPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            CLIENT DEMO FEEDBACK
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Feedback & Pilot Readiness
          </h3>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para ordenar feedback post-demo y señales de readiness
            para un piloto futuro read-only, sin capturar datos reales ni activar
            integraciones externas.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-emerald-100">
            {feedbackPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {feedbackPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {feedbackPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {feedbackPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Demo Feedback Purpose" eyebrow="Purpose">
          {feedbackPack.demoFeedbackPurpose.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300"
            >
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Allowed Feedback Inputs" eyebrow="Allowed">
          {feedbackPack.allowedFeedbackInputs.map((item) => (
            <article
              key={item.inputId}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-emerald-100">
                  {item.label}
                </h5>
                <Badge>{item.inputType}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              <p className="mt-2 text-xs text-emerald-100">
                Revisión humana: {item.requiresHumanReview ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Blocked Feedback Inputs" eyebrow="Blocked">
          {feedbackPack.blockedFeedbackInputs.map((item) => (
            <article
              key={item.inputId}
              className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-rose-100">
                  {item.label}
                </h5>
                <RiskBadge severity={item.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.reason}</p>
              <p className="mt-2 text-xs text-cyan-100">
                Alternativa segura: {item.safeAlternative}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Feedback Categories" eyebrow="Categories">
          {feedbackPack.feedbackCategories.map((category) => (
            <article
              key={category.categoryId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">
                  {category.label}
                </h5>
                <Badge>{category.ownerRole}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {category.description}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Pilot Readiness Dimensions" eyebrow="Readiness">
          {feedbackPack.pilotReadinessDimensions.map((dimension) => (
            <article
              key={dimension.dimensionId}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-cyan-100">
                  {dimension.label}
                </h5>
                <Badge>{dimension.required ? 'Required' : 'Optional'}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {dimension.description}
              </p>
              <p className="mt-2 text-xs text-cyan-100">
                Condición mínima: {dimension.minimumCondition}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Client Question Log Rules" eyebrow="Questions">
          {feedbackPack.clientQuestionLogRules.map((rule) => (
            <article
              key={rule.ruleId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <h5 className="text-sm font-black text-slate-100">
                {rule.label}
              </h5>
              <p className="mt-2 text-sm text-slate-400">{rule.rule}</p>
              {rule.escalationRole && (
                <p className="mt-2 text-xs text-emerald-100">
                  Escalar a: {rule.escalationRole}
                </p>
              )}
            </article>
          ))}
        </Panel>

        <Panel title="Readiness Signal Guidelines" eyebrow="Signals">
          {feedbackPack.readinessSignalGuidelines.map((signal) => (
            <article
              key={signal.signalId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">
                  {signal.label}
                </h5>
                <SignalBadge signal={signal.signal} />
              </div>
              <p className="mt-2 text-sm text-slate-400">{signal.meaning}</p>
              <p className="mt-2 text-xs text-emerald-100">
                Acción: {signal.action}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Pilot Risk Register" eyebrow="Risks">
          {feedbackPack.pilotRiskRegister.map((risk) => (
            <article
              key={risk.riskId}
              className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-amber-100">
                  {risk.label}
                </h5>
                <RiskBadge severity={risk.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{risk.mitigation}</p>
              <p className="mt-2 text-xs text-amber-100">
                Owner: {risk.ownerRole}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Human Review Gates" eyebrow="Gates">
          {feedbackPack.humanReviewGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3"
            >
              <h5 className="text-sm font-black text-violet-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">{gate.description}</p>
              <p className="mt-2 text-xs text-violet-100">
                Reviewer: {gate.reviewerRole} | Required:{' '}
                {gate.required ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Pilot Readiness Exit Criteria" eyebrow="Closure">
          {feedbackPack.pilotReadinessExitCriteria.map((criterion) => (
            <article
              key={criterion.criterionId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <Badge>{criterion.passed ? 'Passed' : 'Pending'}</Badge>
              <h5 className="mt-2 text-sm font-black text-slate-100">
                {criterion.label}
              </h5>
              <p className="mt-2 text-sm text-slate-400">
                {criterion.description}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-rose-100">
          {feedbackPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
