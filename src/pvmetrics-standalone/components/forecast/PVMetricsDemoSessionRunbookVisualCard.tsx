import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK } from '../../data/pvMetricsControlledDemoSessionMockData';
import { PVMetricsControlledClientDemoSessionRunbookPack } from '../../types/pvmetrics-controlled-demo-session.types';

type Props = {
  runbookPack?: PVMetricsControlledClientDemoSessionRunbookPack;
};

type PanelProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const Panel = ({ title, eyebrow, children }: PanelProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
        {eyebrow}
      </p>
    )}
    <h4 className="mt-1 text-lg font-black text-slate-50">{title}</h4>
    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full border border-cyan-400/30 bg-cyan-950/30 px-3 py-1 text-xs font-bold uppercase text-cyan-100">
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

export const PVMetricsDemoSessionRunbookVisualCard = ({
  runbookPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            CONTROLLED CLIENT DEMO SESSION
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Runbook visual de demo cliente controlada
          </h3>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Guía visual para conducir una demo local, mock, read-only, no productiva
            y segura, evitando sobrepromesas, acciones externas o impacto operacional.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">Estado</p>
          <p className="mt-1 text-sm font-black uppercase text-cyan-100">
            {runbookPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Versión</p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {runbookPack.internalVersion}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Roadmap</p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {runbookPack.roadmapBlock}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Generado</p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {runbookPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Propósito de la sesión" eyebrow="Purpose">
          {runbookPack.demoSessionPurpose.map((item) => (
            <p key={item} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Roles de demo" eyebrow="Roles">
          {runbookPack.demoSessionRoles.map((role) => (
            <article key={role.roleId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">{role.label}</h5>
                <Badge>{role.roleId}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{role.responsibility}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Fases de sesión" eyebrow="Phases">
          {runbookPack.demoSessionPhases.map((phase) => (
            <article key={phase.phaseId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <Badge>Fase {phase.order}</Badge>
              <h5 className="mt-2 text-sm font-black text-slate-100">{phase.label}</h5>
              <p className="mt-2 text-sm text-slate-400">{phase.objective}</p>
              <p className="mt-2 text-xs text-cyan-100">Foco permitido: {phase.allowedFocus}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Pre-Demo Checklist" eyebrow="Preflight">
          {runbookPack.preDemoChecklist.map((item) => (
            <article key={item.checklistId} className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">{item.label}</h5>
                <Badge>{item.status}</Badge>
              </div>
              {item.command && (
                <code className="mt-2 block rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-200">
                  {item.command}
                </code>
              )}
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            </article>
          ))}
        </Panel>
      </div>

      <Panel title="Live Demo Script" eyebrow="Script">
        <div className="grid gap-3 xl:grid-cols-2">
          {runbookPack.liveDemoScript.map((line) => (
            <article key={line.scriptId} className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{line.speakerRole}</Badge>
                <Badge>{line.phaseId}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">“{line.script}”</p>
              {line.safetyNote && (
                <p className="mt-2 text-xs text-violet-100">{line.safetyNote}</p>
              )}
            </article>
          ))}
        </div>
      </Panel>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Client-Safe Statements" eyebrow="Safe">
          {runbookPack.clientSafeStatements.map((item) => (
            <p key={item.statementId} className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3 text-sm text-emerald-100">
              {item.statement}
            </p>
          ))}
        </Panel>

        <Panel title="Forbidden Demo Actions" eyebrow="Blocked">
          {runbookPack.forbiddenDemoActions.map((item) => (
            <article key={item.actionId} className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-rose-100">{item.label}</h5>
                <RiskBadge severity={item.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.forbiddenAction}</p>
              <p className="mt-2 text-xs text-cyan-100">Alternativa: {item.safeAlternative}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Pause / Stop Criteria" eyebrow="Stop">
          {runbookPack.pauseStopCriteria.map((item) => (
            <article key={item.criterionId} className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-amber-100">{item.label}</h5>
                <RiskBadge severity={item.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">Trigger: {item.trigger}</p>
              <p className="mt-2 text-xs text-amber-100">Acción: {item.action}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Question Handling Rules" eyebrow="Questions">
          {runbookPack.questionHandlingRules.map((item) => (
            <article key={item.ruleId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <h5 className="text-sm font-black text-slate-100">{item.label}</h5>
              <p className="mt-2 text-sm text-slate-400">{item.rule}</p>
              {item.escalationRole && (
                <p className="mt-2 text-xs text-cyan-100">Escalar a: {item.escalationRole}</p>
              )}
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Evidence Capture Boundaries" eyebrow="Evidence">
          {runbookPack.evidenceCaptureBoundaries.map((item) => (
            <article key={item.boundaryId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">{item.label}</h5>
                <Badge>{item.allowed ? 'Allowed' : 'Blocked'}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
              <p className="mt-2 text-xs text-cyan-100">{item.safetyNote}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Post-Demo Follow-Up Rules" eyebrow="Follow-up">
          {runbookPack.postDemoFollowUpRules.map((item) => (
            <article key={item.ruleId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <h5 className="text-sm font-black text-slate-100">{item.label}</h5>
              <p className="mt-2 text-sm text-slate-400">{item.rule}</p>
              <p className="mt-2 text-xs text-cyan-100">
                Revisión humana: {item.requiresHumanReview ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Human Approval Gates" eyebrow="Gates">
          {runbookPack.humanApprovalGates.map((gate) => (
            <article key={gate.gateId} className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3">
              <h5 className="text-sm font-black text-violet-100">{gate.label}</h5>
              <p className="mt-2 text-sm text-slate-300">{gate.description}</p>
              <p className="mt-2 text-xs text-violet-100">Reviewer: {gate.reviewerRole}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Session Risks" eyebrow="Risks">
          {runbookPack.sessionRisks.map((risk) => (
            <article key={risk.riskId} className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-amber-100">{risk.label}</h5>
                <RiskBadge severity={risk.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{risk.mitigation}</p>
              <p className="mt-2 text-xs text-amber-100">Owner: {risk.ownerRole}</p>
            </article>
          ))}
        </Panel>
      </div>

      <Panel title="Session Exit Criteria" eyebrow="Closure">
        <div className="grid gap-3 xl:grid-cols-4">
          {runbookPack.sessionExitCriteria.map((criterion) => (
            <article key={criterion.criterionId} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
              <Badge>{criterion.passed ? 'Passed' : 'Pending'}</Badge>
              <h5 className="mt-2 text-sm font-black text-slate-100">{criterion.label}</h5>
              <p className="mt-2 text-sm text-slate-400">{criterion.description}</p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-rose-100">
          {runbookPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
