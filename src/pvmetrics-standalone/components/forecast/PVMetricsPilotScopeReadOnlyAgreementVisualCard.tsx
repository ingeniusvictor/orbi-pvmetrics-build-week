import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK } from '../../data/pvMetricsControlledPilotScopeMockData';
import { PVMetricsControlledPilotScopeAgreementPack } from '../../types/pvmetrics-controlled-pilot-scope.types';

type Props = {
  agreementPack?: PVMetricsControlledPilotScopeAgreementPack;
};

type PanelProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const Panel = ({ title, eyebrow, children }: PanelProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">
        {eyebrow}
      </p>
    )}
    <h4 className="mt-1 text-lg font-black text-slate-50">{title}</h4>
    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full border border-blue-400/30 bg-blue-950/30 px-3 py-1 text-xs font-bold uppercase text-blue-100">
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

const AccessBadge = ({ allowed }: { allowed: boolean }) => (
  <span
    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
      allowed
        ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-100'
        : 'border-rose-400/40 bg-rose-950/40 text-rose-100'
    }`}
  >
    {allowed ? 'Allowed' : 'Blocked'}
  </span>
);

export const PVMetricsPilotScopeReadOnlyAgreementVisualCard = ({
  agreementPack = PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-blue-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
            CONTROLLED PILOT SCOPE
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Pilot Scope & Read-Only Agreement
          </h3>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para presentar el alcance conceptual de un piloto futuro
            read-only, con límites de datos, gates humanos, riesgos y exclusiones
            operacionales estrictas.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-400/30 bg-blue-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-blue-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-blue-100">
            {agreementPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {agreementPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {agreementPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {agreementPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Pilot Scope Purpose" eyebrow="Purpose">
          {agreementPack.pilotScopePurpose.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300"
            >
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Allowed Pilot Scope Items" eyebrow="Allowed">
          {agreementPack.allowedPilotScopeItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-emerald-100">
                  {item.label}
                </h5>
                <Badge>{item.itemType}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              <p className="mt-2 text-xs text-emerald-100">
                Aprobación humana: {item.requiresHumanApproval ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Blocked Pilot Scope Items" eyebrow="Blocked">
          {agreementPack.blockedPilotScopeItems.map((item) => (
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

        <Panel title="Read-Only Integration Principles" eyebrow="Read-only">
          {agreementPack.readOnlyIntegrationPrinciples.map((principle) => (
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
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Data Access Boundaries" eyebrow="Data">
          {agreementPack.dataAccessBoundaries.map((boundary) => (
            <article
              key={boundary.boundaryId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">
                  {boundary.label}
                </h5>
                <AccessBadge allowed={boundary.allowed} />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {boundary.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Client Approval Gates" eyebrow="Client gates">
          {agreementPack.clientApprovalGates.map((gate) => (
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

        <Panel title="Technical Approval Gates" eyebrow="Technical gates">
          {agreementPack.technicalApprovalGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/10 p-3"
            >
              <h5 className="text-sm font-black text-blue-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">{gate.description}</p>
              <p className="mt-2 text-xs text-blue-100">
                Reviewer: {gate.reviewerRole} | Required:{' '}
                {gate.required ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="QA Approval Gates" eyebrow="QA gates">
          {agreementPack.qaApprovalGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3"
            >
              <h5 className="text-sm font-black text-amber-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">{gate.description}</p>
              <p className="mt-2 text-xs text-amber-100">
                Reviewer: {gate.reviewerRole} | Required:{' '}
                {gate.required ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Legal / Commercial Review Notes" eyebrow="Review">
          {agreementPack.legalCommercialReviewNotes.map((note) => (
            <article
              key={note.noteId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">
                  {note.label}
                </h5>
                <Badge>{note.ownerRole}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-400">{note.note}</p>
              <p className="mt-2 text-xs text-blue-100">
                Revisión humana: {note.requiresHumanReview ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Pilot Risk Register" eyebrow="Risks">
          {agreementPack.pilotRiskRegister.map((risk) => (
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

      <Panel title="Pilot Exit Criteria" eyebrow="Closure">
        <div className="grid gap-3 xl:grid-cols-4">
          {agreementPack.pilotExitCriteria.map((criterion) => (
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
        </div>
      </Panel>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-rose-100">
          {agreementPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
