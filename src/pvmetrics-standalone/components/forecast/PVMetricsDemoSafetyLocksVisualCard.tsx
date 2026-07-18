import { PV_METRICS_PRESENTATION_FLOW_PACK_MOCK } from '../../data/pvMetricsLocalDemoModeMockState';
import { PVMetricsPresentationFlowPack } from '../../types/pvmetrics-local-demo-mode.types';

type PVMetricsDemoSafetyLocksVisualCardProps = {
  flowPack?: PVMetricsPresentationFlowPack;
};

const lockTone = {
  locked: 'border-emerald-400/25 bg-emerald-950/20 text-emerald-100',
  warning: 'border-amber-400/25 bg-amber-950/20 text-amber-100',
  blocked: 'border-rose-400/25 bg-rose-950/20 text-rose-100',
  'pending-review': 'border-violet-400/25 bg-violet-950/20 text-violet-100',
};

export const PVMetricsDemoSafetyLocksVisualCard = ({
  flowPack = PV_METRICS_PRESENTATION_FLOW_PACK_MOCK,
}: PVMetricsDemoSafetyLocksVisualCardProps) => {
  const demoState = flowPack.demoModeState;

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            DEMO SAFETY LOCKS
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Bloqueos de seguridad del modo demo local
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista de seguridad para confirmar que el modo demo sigue siendo
            local, mock, no persistente, sin red, sin mutaciones y sin control
            operacional.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-emerald-100">
            {demoState.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Runtime Toggle
          </p>
          <p className="mt-1 text-lg font-black text-rose-200">
            {demoState.isRuntimeToggleEnabled ? 'ENABLED' : 'DISABLED'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Persistence
          </p>
          <p className="mt-1 text-lg font-black text-rose-200">
            {demoState.isPersistent ? 'ACTIVE' : 'DISABLED'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Network
          </p>
          <p className="mt-1 text-lg font-black text-rose-200">
            {demoState.isNetworkEnabled ? 'ACTIVE' : 'DISABLED'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Audience
          </p>
          <p className="mt-1 text-lg font-black text-cyan-100">
            {demoState.activeAudienceMode}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Active Safety Locks
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {demoState.safetyLocks.map((lock) => (
            <article
              key={lock.lockId}
              className={`rounded-2xl border p-4 ${lockTone[lock.status]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    {lock.lockId}
                  </p>

                  <h4 className="mt-1 text-lg font-black">{lock.label}</h4>
                </div>

                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold uppercase">
                  {lock.status}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6">{lock.description}</p>

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide">
                Enforced: {lock.enforced ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-rose-400/20 bg-rose-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
          Forbidden Capabilities
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {demoState.forbiddenCapabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-rose-400/20 bg-rose-950/30 px-3 py-1 text-xs font-semibold text-rose-100"
            >
              {capability}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Demo State Summary
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs text-slate-500">State ID</p>
            <p className="mt-1 text-sm font-bold text-slate-100">
              {demoState.stateId}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs text-slate-500">Generated</p>
            <p className="mt-1 text-sm font-bold text-slate-100">
              {demoState.generatedAtLabel}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs text-slate-500">Runtime Toggle</p>
            <p className="mt-1 text-sm font-bold text-emerald-100">
              False
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs text-slate-500">Network Enabled</p>
            <p className="mt-1 text-sm font-bold text-emerald-100">
              False
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          {demoState.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
