import { PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK } from '../../data/pvMetricsLocalDemoPackageMockData';
import {
  PVMetricsLocalDemoPackageAssemblyPack,
  PVMetricsLocalDemoPackageChecklistStatus,
  PVMetricsLocalDemoPackageRiskSeverity,
} from '../../types/pvmetrics-local-demo-package.types';

type PVMetricsOperatorSignOffVisualCardProps = {
  assemblyPack?: PVMetricsLocalDemoPackageAssemblyPack;
};

const getStatusTone = (status: PVMetricsLocalDemoPackageChecklistStatus) => {
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

const getRiskTone = (severity: PVMetricsLocalDemoPackageRiskSeverity) => {
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

export const PVMetricsOperatorSignOffVisualCard = ({
  assemblyPack = PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK,
}: PVMetricsOperatorSignOffVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-violet-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
            OPERATOR SIGN-OFF
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Local Demo Package Assembly
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para revisar contenidos permitidos, artefactos reales
            bloqueados, preflight del operador, revisión humana y riesgos antes
            de una presentación controlada.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-400/30 bg-violet-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-violet-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-violet-100">
            {assemblyPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {assemblyPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {assemblyPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {assemblyPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Local Demo Package Contents
          </p>

          <div className="mt-4 space-y-3">
            {assemblyPack.packageContents.map((content) => (
              <article
                key={content.contentId}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-slate-100">
                    {content.label}
                  </h4>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                      content.allowed
                        ? 'border-emerald-400/30 bg-emerald-950/30 text-emerald-100'
                        : 'border-rose-400/30 bg-rose-950/30 text-rose-100'
                    }`}
                  >
                    {content.allowed ? 'Allowed' : 'Blocked'}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {content.description}
                </p>

                <p className="mt-2 text-xs text-emerald-100">
                  {content.safetyNote}
                </p>

                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                  Client visible: {content.clientVisible ? 'YES' : 'NO'}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-rose-400/20 bg-rose-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
            Blocked Real Release Artifacts
          </p>

          <div className="mt-4 space-y-3">
            {assemblyPack.blockedRealReleaseArtifacts.map((artifact) => (
              <article
                key={artifact.artifactId}
                className="rounded-2xl border border-rose-400/20 bg-slate-950/60 p-4"
              >
                <p className="text-sm font-black text-rose-100">
                  {artifact.label}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Motivo: {artifact.reason}
                </p>

                <p className="mt-2 rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-3 text-sm text-cyan-100">
                  Alternativa segura: {artifact.safeAlternative}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Operator Sign-Off Scope
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {assemblyPack.operatorSignOffScope.map((scope) => (
            <article
              key={scope.scopeId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-xs font-bold uppercase text-violet-300">
                Required: {scope.required ? 'YES' : 'NO'}
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

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Operator Preflight Checklist
          </p>

          <div className="mt-4 space-y-3">
            {assemblyPack.operatorPreflightChecklist.map((item) => (
              <article
                key={item.checklistId}
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

                <p className="mt-2 text-xs font-semibold uppercase">
                  Required: {item.required ? 'YES' : 'NO'}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
            Reviewer Sign-Off Checklist
          </p>

          <div className="mt-4 space-y-3">
            {assemblyPack.reviewerSignOffChecklist.map((item) => (
              <article
                key={item.checklistId}
                className={`rounded-2xl border p-4 ${getStatusTone(
                  item.status,
                )}`}
              >
                <p className="text-xs font-bold uppercase opacity-70">
                  {item.status}
                </p>

                <h4 className="mt-1 text-sm font-black">{item.label}</h4>

                <p className="mt-2 text-sm leading-6">{item.description}</p>

                <p className="mt-2 text-xs font-semibold uppercase">
                  Reviewer: {item.reviewerRole}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Demo Environment Assumptions
          </p>

          <div className="mt-4 space-y-3">
            {assemblyPack.demoEnvironmentAssumptions.map((assumption) => (
              <article
                key={assumption.assumptionId}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <p className="text-xs font-bold uppercase text-emerald-300">
                  Must be true: {assumption.mustBeTrue ? 'YES' : 'NO'}
                </p>

                <h4 className="mt-1 text-sm font-black text-slate-100">
                  {assumption.label}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {assumption.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Human Approval Gates
          </p>

          <div className="mt-4 space-y-3">
            {assemblyPack.humanApprovalGates.map((gate) => (
              <article
                key={gate.gateId}
                className="rounded-2xl border border-violet-400/20 bg-slate-950/60 p-4"
              >
                <p className="text-xs font-bold uppercase text-violet-300">
                  {gate.reviewerRole}
                </p>

                <h4 className="mt-1 text-sm font-black text-slate-100">
                  {gate.label}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {gate.description}
                </p>

                <p className="mt-2 text-xs font-semibold uppercase text-violet-100">
                  Required: {gate.required ? 'YES' : 'NO'}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          Assembly Risks
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {assemblyPack.assemblyRisks.map((risk) => (
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

              <p className="mt-2 text-sm leading-6">{risk.mitigation}</p>

              <p className="mt-2 text-xs uppercase opacity-80">
                Owner: {risk.ownerRole}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-700 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Assembly Exit Criteria
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {assemblyPack.assemblyExitCriteria.map((criterion) => (
            <article
              key={criterion.criterionId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-xs font-bold uppercase text-slate-500">
                {criterion.passed ? 'Passed' : 'Pending'}
              </p>

              <h4 className="mt-1 text-sm font-black text-slate-100">
                {criterion.label}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {criterion.description}
              </p>

              <p className="mt-2 text-xs font-semibold uppercase text-slate-300">
                Required: {criterion.required ? 'YES' : 'NO'}
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
          {assemblyPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
