import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK } from '../../data/pvMetricsClientDemoPresentationScriptMockData';
import { PVMetricsControlledClientDemoPresentationScriptPack } from '../../types/pvmetrics-client-demo-presentation-script.types';

type Props = {
  scriptPack?: PVMetricsControlledClientDemoPresentationScriptPack;
};

type PanelProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const Panel = ({ title, eyebrow, children }: PanelProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
        {eyebrow}
      </p>
    )}

    <h4 className="mt-1 text-lg font-black text-slate-50">{title}</h4>

    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-950/30 px-3 py-1 text-xs font-bold uppercase text-fuchsia-100">
    {children}
  </span>
);

const RiskBadge = ({ severity }: { severity: string }) => {
  const tone =
    severity === 'critical'
      ? 'border-rose-400/40 bg-rose-950/40 text-rose-100'
      : severity === 'high'
        ? 'border-amber-400/40 bg-amber-950/40 text-amber-100'
        : severity === 'medium'
          ? 'border-cyan-400/40 bg-cyan-950/40 text-cyan-100'
          : 'border-emerald-400/40 bg-emerald-950/40 text-emerald-100';

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone}`}
    >
      {severity}
    </span>
  );
};

export const PVMetricsClientDemoPresentationScriptVisualCard = ({
  scriptPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-fuchsia-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
            CLIENT DEMO PRESENTATION SCRIPT
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Controlled Client Demo Presentation Script Visual Card
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para revisar el guion seguro de presentación demo:
            propósito, secciones, tiempos, notas del orador, disclaimers,
            aprobaciones, riesgos y límites. No genera video, audio, avatar,
            PowerPoint, PDF ni entrega externa real.
          </p>
        </div>

        <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-fuchsia-300">
            Estado
          </p>

          <p className="mt-1 text-sm font-black uppercase text-fuchsia-100">
            {scriptPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>

          <p className="mt-1 text-sm font-black text-slate-100">
            {scriptPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>

          <p className="mt-1 text-sm font-black text-slate-100">
            {scriptPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>

          <p className="mt-1 text-sm font-black text-slate-100">
            {scriptPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Client Demo Presentation Script Purpose" eyebrow="Purpose">
          {scriptPack.clientDemoPresentationScriptPurpose.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300"
            >
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Presentation Script Principles" eyebrow="Principles">
          {scriptPack.presentationScriptPrinciples.map((principle) => (
            <article
              key={principle.principleId}
              className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-fuchsia-100">
                  {principle.label}
                </h5>

                <Badge>{principle.mandatory ? 'Mandatory' : 'Optional'}</Badge>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {principle.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Allowed Presentation Script Items" eyebrow="Allowed">
          {scriptPack.allowedPresentationScriptItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-emerald-100">
                  {item.label}
                </h5>

                <Badge>{item.scriptMode}</Badge>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {item.description}
              </p>

              <p className="mt-2 text-xs text-emerald-100">
                Revisión: {item.requiresApproval ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Blocked Presentation Script Items" eyebrow="Blocked">
          {scriptPack.blockedPresentationScriptItems.map((item) => (
            <article
              key={item.itemId}
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

        <Panel title="Presentation Script Sections" eyebrow="Sections">
          {scriptPack.presentationScriptSections.map((section) => (
            <article
              key={section.sectionId}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-cyan-100">
                  {section.label}
                </h5>

                <Badge>{section.scriptMode}</Badge>
              </div>

              <p className="mt-2 text-xs text-cyan-100">
                Duración recomendada: {section.recommendedDuration}
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {section.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Presentation Script Timing Blocks" eyebrow="Timing">
          {scriptPack.presentationScriptTimingBlocks.map((timing) => (
            <article
              key={timing.timingId}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-blue-100">
                  {timing.label}
                </h5>

                <Badge>{timing.duration}</Badge>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {timing.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Presentation Script Speaker Notes" eyebrow="Speaker Notes">
          {scriptPack.presentationScriptSpeakerNotes.map((note) => (
            <article
              key={note.noteId}
              className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-violet-100">
                  {note.label}
                </h5>

                <Badge>{note.scriptMode}</Badge>
              </div>

              <p className="mt-2 text-xs text-violet-100">
                Mandatory: {note.mandatory ? 'YES' : 'NO'}
              </p>

              <p className="mt-2 text-sm text-slate-300">{note.note}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Presentation Script Safety Disclaimers" eyebrow="Safety">
          {scriptPack.presentationScriptSafetyDisclaimers.map((disclaimer) => (
            <article
              key={disclaimer.disclaimerId}
              className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-rose-100">
                  {disclaimer.label}
                </h5>

                <Badge>{disclaimer.mandatory ? 'Mandatory' : 'Optional'}</Badge>
              </div>

              <p className="mt-2 text-sm text-slate-300">
                {disclaimer.disclaimer}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Presentation Script Approval Roles" eyebrow="Approvals">
          {scriptPack.presentationScriptApprovalRoles.map((role) => (
            <article
              key={role.approvalId}
              className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3"
            >
              <h5 className="text-sm font-black text-amber-100">
                {role.label}
              </h5>

              <p className="mt-2 text-xs text-amber-100">
                Reviewer: {role.reviewerRole} | Required:{' '}
                {role.required ? 'YES' : 'NO'}
              </p>

              <p className="mt-2 text-sm text-slate-300">
                {role.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Presentation Script Risk Register" eyebrow="Risks">
          {scriptPack.presentationScriptRiskRegister.map((risk) => (
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

              <p className="mt-2 text-sm text-slate-300">
                {risk.mitigation}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Presentation Script Exit Criteria" eyebrow="Closure">
          {scriptPack.presentationScriptExitCriteria.map((criterion) => (
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
          Presentation Script Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          {scriptPack.presentationScriptBoundary}
        </p>
      </div>
    </section>
  );
};
