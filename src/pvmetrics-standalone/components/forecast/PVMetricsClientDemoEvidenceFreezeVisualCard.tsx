import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK } from '../../data/pvMetricsClientDemoEvidenceFreezeMockData';
import { PVMetricsControlledClientDemoEvidenceFreezePack } from '../../types/pvmetrics-client-demo-evidence-freeze.types';

type Props = {
  evidencePack?: PVMetricsControlledClientDemoEvidenceFreezePack;
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
        : severity === 'medium'
          ? 'border-cyan-400/40 bg-cyan-950/40 text-cyan-100'
          : 'border-emerald-400/40 bg-emerald-950/40 text-emerald-100';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone}`}>
      {severity}
    </span>
  );
};

export const PVMetricsClientDemoEvidenceFreezeVisualCard = ({
  evidencePack = PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            CLIENT DEMO EVIDENCE FREEZE
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Controlled Client Demo Evidence Freeze Visual Card
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para revisar evidencia demo controlada antes de cliente:
            readiness, narrativa segura, límites de seguridad, gates, roles,
            riesgos y criterios de salida. No genera archivos reales ni release
            productiva.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-cyan-100">
            {evidencePack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {evidencePack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {evidencePack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {evidencePack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Client Demo Evidence Purpose" eyebrow="Purpose">
          {evidencePack.clientDemoEvidencePurpose.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300"
            >
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Demo Evidence Freeze Principles" eyebrow="Principles">
          {evidencePack.demoEvidenceFreezePrinciples.map((principle) => (
            <article
              key={principle.principleId}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-cyan-100">
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

        <Panel title="Allowed Demo Evidence Items" eyebrow="Allowed">
          {evidencePack.allowedDemoEvidenceItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-emerald-100">
                  {item.label}
                </h5>
                <Badge>{item.evidenceMode}</Badge>
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

        <Panel title="Blocked Demo Evidence Items" eyebrow="Blocked">
          {evidencePack.blockedDemoEvidenceItems.map((item) => (
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

        <Panel title="Demo Evidence Categories" eyebrow="Categories">
          {evidencePack.demoEvidenceCategories.map((category) => (
            <article
              key={category.categoryId}
              className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-violet-100">
                  {category.label}
                </h5>
                <Badge>{category.evidenceMode}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {category.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Demo Evidence Review Gates" eyebrow="Review">
          {evidencePack.demoEvidenceReviewGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/10 p-3"
            >
              <h5 className="text-sm font-black text-blue-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-xs text-blue-100">
                Required: {gate.required ? 'YES' : 'NO'}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {gate.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Demo Evidence Safety Gates" eyebrow="Safety">
          {evidencePack.demoEvidenceSafetyGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3"
            >
              <h5 className="text-sm font-black text-rose-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-xs text-rose-100">
                Required: {gate.required ? 'YES' : 'NO'}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {gate.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Demo Evidence Approval Roles" eyebrow="Approvals">
          {evidencePack.demoEvidenceApprovalRoles.map((role) => (
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

        <Panel title="Demo Evidence Risk Register" eyebrow="Risks">
          {evidencePack.demoEvidenceRiskRegister.map((risk) => (
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

        <Panel title="Demo Evidence Exit Criteria" eyebrow="Closure">
          {evidencePack.demoEvidenceExitCriteria.map((criterion) => (
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
          Evidence Freeze Boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-rose-100">
          {evidencePack.evidenceFreezeBoundary}
        </p>
      </div>
    </section>
  );
};
