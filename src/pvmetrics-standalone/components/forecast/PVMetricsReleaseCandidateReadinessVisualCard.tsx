import { PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK } from '../../data/pvMetricsReleaseCandidateMockData';
import {
  PVMetricsReleaseCandidateChecklistStatus,
  PVMetricsReleaseCandidateRiskSeverity,
  PVMetricsStandaloneClientDemoReleaseCandidatePack,
} from '../../types/pvmetrics-release-candidate.types';

type PVMetricsReleaseCandidateReadinessVisualCardProps = {
  releasePack?: PVMetricsStandaloneClientDemoReleaseCandidatePack;
};

const getStatusTone = (status: PVMetricsReleaseCandidateChecklistStatus) => {
  switch (status) {
    case 'ready':
      return 'border-emerald-400/30 bg-emerald-950/25 text-emerald-100';
    case 'requires-run':
      return 'border-cyan-400/30 bg-cyan-950/25 text-cyan-100';
    case 'requires-human-review':
      return 'border-violet-400/30 bg-violet-950/25 text-violet-100';
    case 'blocked':
      return 'border-rose-400/30 bg-rose-950/25 text-rose-100';
    case 'not-applicable':
      return 'border-slate-500/30 bg-slate-900/60 text-slate-200';
    case 'pending':
    default:
      return 'border-amber-400/30 bg-amber-950/25 text-amber-100';
  }
};

const getRiskTone = (severity: PVMetricsReleaseCandidateRiskSeverity) => {
  switch (severity) {
    case 'critical':
      return 'border-rose-400/30 bg-rose-950/25 text-rose-100';
    case 'high':
      return 'border-amber-400/30 bg-amber-950/25 text-amber-100';
    case 'medium':
      return 'border-cyan-400/30 bg-cyan-950/25 text-cyan-100';
    case 'low':
    default:
      return 'border-emerald-400/30 bg-emerald-950/25 text-emerald-100';
  }
};

export const PVMetricsReleaseCandidateReadinessVisualCard = ({
  releasePack = PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK,
}: PVMetricsReleaseCandidateReadinessVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            RELEASE CANDIDATE READINESS
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Standalone Client Demo Release Candidate
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista de readiness para evaluar ORBI PVMetrics IA como demo
            independiente candidata a release interno/controlado. Esta vista no
            genera ZIP, APK, PDF, correo, backend, API ni conector real.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-cyan-100">
            {releasePack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {releasePack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {releasePack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {releasePack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Release Candidate Scope
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {releasePack.releaseCandidateScope.map((scope) => (
            <article
              key={scope.scopeId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-xs font-bold uppercase text-slate-500">
                {scope.included ? 'Incluido' : 'Excluido'}
              </p>

              <h4 className="mt-1 text-lg font-black text-slate-50">
                {scope.label}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {scope.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-rose-400/20 bg-rose-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
          Demo Package Boundaries
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {releasePack.demoPackageBoundaries.map((boundary) => (
            <span
              key={boundary.boundaryId}
              className="rounded-full border border-rose-400/20 bg-rose-950/30 px-3 py-1 text-xs font-semibold text-rose-100"
              title={boundary.description}
            >
              {boundary.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Client Demo Readiness
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.clientDemoReadinessChecklist.map((item) => (
              <article
                key={item.readinessId}
                className={`rounded-2xl border p-4 ${getStatusTone(
                  item.status,
                )}`}
              >
                <p className="text-xs font-bold uppercase opacity-70">
                  {item.status}
                </p>
                <h4 className="mt-1 text-sm font-black">{item.label}</h4>
                <p className="mt-2 text-sm leading-6">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Technical Readiness
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.technicalReadinessChecklist.map((item) => (
              <article
                key={item.readinessId}
                className={`rounded-2xl border p-4 ${getStatusTone(
                  item.status,
                )}`}
              >
                <p className="text-xs font-bold uppercase opacity-70">
                  {item.status}
                </p>
                <h4 className="mt-1 text-sm font-black">{item.label}</h4>
                {item.command && (
                  <code className="mt-2 block rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs">
                    {item.command}
                  </code>
                )}
                <p className="mt-2 text-sm leading-6">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Safety Readiness
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.safetyReadinessChecklist.map((item) => (
              <article
                key={item.readinessId}
                className={`rounded-2xl border p-4 ${getStatusTone(
                  item.status,
                )}`}
              >
                <p className="text-xs font-bold uppercase opacity-70">
                  {item.status}
                </p>
                <h4 className="mt-1 text-sm font-black">{item.label}</h4>
                <p className="mt-2 text-sm leading-6">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Build & TypeScript Requirements
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.buildAndTypescriptRequirements.map((requirement) => (
              <article
                key={requirement.requirementId}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-slate-100">
                    {requirement.label}
                  </h4>

                  <span className="rounded-full border border-slate-600 px-3 py-1 text-xs font-bold uppercase text-slate-300">
                    Required: {requirement.required ? 'YES' : 'NO'}
                  </span>
                </div>

                {requirement.command && (
                  <code className="mt-2 block rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-200">
                    {requirement.command}
                  </code>
                )}

                <p className="mt-2 text-sm text-slate-400">
                  {requirement.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Allowed Demo Capabilities
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.allowedDemoCapabilities.map((capability) => (
              <article
                key={capability.capabilityId}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-slate-100">
                    {capability.label}
                  </h4>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-950/30 px-3 py-1 text-xs font-bold text-emerald-100">
                    {capability.clientVisible ? 'Client visible' : 'Internal'}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {capability.description}
                </p>

                <p className="mt-2 text-xs text-emerald-100">
                  {capability.safetyNote}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-rose-400/20 bg-rose-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
            Blocked Production Claims
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.blockedProductionClaims.map((claim) => (
              <article
                key={claim.claimId}
                className={`rounded-2xl border p-4 ${getRiskTone(
                  claim.severity,
                )}`}
              >
                <p className="text-sm font-black">
                  NO decir: {claim.forbiddenClaim}
                </p>
                <p className="mt-2 text-sm">
                  Alternativa segura: {claim.safeAlternative}
                </p>
                <p className="mt-2 text-xs font-bold uppercase">
                  Severidad: {claim.severity}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
            Release Candidate Risks
          </p>

          <div className="mt-4 space-y-3">
            {releasePack.releaseCandidateRisks.map((risk) => (
              <article
                key={risk.riskId}
                className={`rounded-2xl border p-4 ${getRiskTone(
                  risk.severity,
                )}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-black">{risk.label}</h4>
                  <span className="rounded-full border border-current/20 px-3 py-1 text-xs font-bold uppercase">
                    {risk.severity}
                  </span>
                </div>

                <p className="mt-2 text-sm">{risk.mitigation}</p>
                <p className="mt-2 text-xs uppercase opacity-80">
                  Owner: {risk.ownerRole}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Human Review Gates
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {releasePack.humanReviewGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-violet-400/20 bg-slate-950/60 p-4"
            >
              <p className="text-xs font-bold uppercase text-violet-300">
                {gate.reviewerRole}
              </p>

              <h4 className="mt-1 text-lg font-black text-slate-50">
                {gate.label}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {gate.description}
              </p>

              <p className="mt-3 text-xs font-semibold uppercase text-violet-100">
                Required: {gate.required ? 'YES' : 'NO'}
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
          {releasePack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
