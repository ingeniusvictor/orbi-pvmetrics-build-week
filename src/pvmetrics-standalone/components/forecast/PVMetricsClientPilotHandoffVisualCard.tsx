import { PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK } from '../../data/pvMetricsClientPilotHandoffMockData';
import {
  PVMetricsClientPilotHandoffPack,
  PVMetricsDecisionGateStatus,
  PVMetricsPilotReadinessCondition,
  PVMetricsPilotRiskSeverity,
} from '../../types/pvmetrics-client-pilot-handoff.types';

type PVMetricsClientPilotHandoffVisualCardProps = {
  handoffPack?: PVMetricsClientPilotHandoffPack;
};

const getRiskTone = (severity: PVMetricsPilotRiskSeverity) => {
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

const getGateTone = (status: PVMetricsDecisionGateStatus) => {
  switch (status) {
    case 'passed':
      return 'border-emerald-400/30 bg-emerald-950/25 text-emerald-100';
    case 'requires-human-review':
      return 'border-violet-400/30 bg-violet-950/25 text-violet-100';
    case 'blocked':
      return 'border-amber-400/30 bg-amber-950/25 text-amber-100';
    case 'forbidden':
    default:
      return 'border-rose-400/30 bg-rose-950/25 text-rose-100';
  }
};

const getReadinessTone = (
  status: PVMetricsPilotReadinessCondition['status'],
) => {
  switch (status) {
    case 'ready':
      return 'border-emerald-400/30 bg-emerald-950/25 text-emerald-100';
    case 'requires-human-review':
      return 'border-violet-400/30 bg-violet-950/25 text-violet-100';
    case 'blocked':
      return 'border-rose-400/30 bg-rose-950/25 text-rose-100';
    case 'pending':
    default:
      return 'border-amber-400/30 bg-amber-950/25 text-amber-100';
  }
};

export const PVMetricsClientPilotHandoffVisualCard = ({
  handoffPack = PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK,
}: PVMetricsClientPilotHandoffVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            CLIENT PILOT HANDOFF
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Entrega segura para conversación de piloto cliente
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Paquete visual para explicar qué se puede mostrar, qué queda
            bloqueado y qué condiciones mínimas deben existir antes de avanzar
            hacia un piloto real read-only.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-cyan-100">
            {handoffPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {handoffPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {handoffPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {handoffPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Client Handoff Sections
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {handoffPack.handoffSections.map((section) => (
            <article
              key={section.sectionId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-lg font-black text-slate-50">
                  {section.label}
                </h4>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-950/30 px-3 py-1 text-xs font-bold text-cyan-100">
                  {section.required ? 'Required' : 'Optional'}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {section.objective}
              </p>

              <p className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-950/20 p-3 text-sm text-emerald-100">
                {section.clientMessage}
              </p>

              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                Audiencias: {section.audienceTypes.join(' / ')}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Allowed Pilot Materials
          </p>

          <div className="mt-4 space-y-3">
            {handoffPack.allowedPilotMaterials.map((material) => (
              <article
                key={material.materialId}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-black text-slate-50">
                    {material.label}
                  </p>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-950/30 px-3 py-1 text-xs font-bold text-emerald-100">
                    {material.clientVisible ? 'Client visible' : 'Internal'}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {material.description}
                </p>

                <p className="mt-2 text-xs text-emerald-100">
                  {material.safetyNote}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-rose-400/20 bg-rose-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
            Blocked Pilot Claims
          </p>

          <div className="mt-4 space-y-3">
            {handoffPack.blockedPilotClaims.map((claim) => (
              <article
                key={claim.claimId}
                className={getRiskTone(claim.severity)}
              >
                <div className="rounded-2xl border border-current/20 p-4">
                  <p className="text-sm font-black">
                    NO decir: {claim.forbiddenClaim}
                  </p>

                  <p className="mt-2 text-sm">
                    Decir en su lugar: {claim.safeAlternative}
                  </p>

                  <p className="mt-2 text-xs font-bold uppercase">
                    Severidad: {claim.severity}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
          Pilot Readiness Conditions
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {handoffPack.pilotReadinessConditions.map((condition) => (
            <article
              key={condition.conditionId}
              className={`rounded-2xl border p-4 ${getReadinessTone(
                condition.status,
              )}`}
            >
              <p className="text-xs font-bold uppercase opacity-70">
                {condition.status}
              </p>

              <h4 className="mt-1 text-lg font-black">{condition.label}</h4>

              <p className="mt-2 text-sm leading-6">{condition.description}</p>

              <p className="mt-3 text-xs font-semibold uppercase">
                Required: {condition.required ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
            Pilot Risk Register
          </p>

          <div className="mt-4 space-y-3">
            {handoffPack.pilotRiskRegister.map((risk) => (
              <article
                key={risk.riskId}
                className={`rounded-2xl border p-4 ${getRiskTone(
                  risk.severity,
                )}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-black">{risk.label}</p>
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

        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Decision Gates
          </p>

          <div className="mt-4 space-y-3">
            {handoffPack.decisionGates.map((gate) => (
              <article
                key={gate.gateId}
                className={`rounded-2xl border p-4 ${getGateTone(gate.status)}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-black">{gate.label}</p>
                  <span className="rounded-full border border-current/20 px-3 py-1 text-xs font-bold uppercase">
                    {gate.status}
                  </span>
                </div>

                <p className="mt-2 text-sm">{gate.description}</p>

                <p className="mt-2 text-xs font-semibold uppercase">
                  Next Action: {gate.nextAction}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Safe Next Steps
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {handoffPack.safeNextSteps.map((step) => (
            <article
              key={step.stepId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-xs font-bold uppercase text-slate-500">
                Paso {step.order}
              </p>

              <h4 className="mt-1 text-lg font-black text-slate-50">
                {step.label}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {step.description}
              </p>

              <p className="mt-3 text-xs font-semibold uppercase text-cyan-100">
                Allowed: {step.allowed ? 'YES' : 'NO'}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase text-violet-100">
                Human Review: {step.requiresHumanReview ? 'YES' : 'NO'}
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
          {handoffPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
