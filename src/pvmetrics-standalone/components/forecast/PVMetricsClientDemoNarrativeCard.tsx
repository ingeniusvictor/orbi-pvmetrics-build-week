import { PV_METRICS_CLIENT_DEMO_PACK_MOCK } from '../../data/pvMetricsPilotEvidencePackMockData';
import { PVMetricsClientDemoPack } from '../../types/pvmetrics-pilot-evidence-pack.types';

type PVMetricsClientDemoNarrativeCardProps = {
  demoPack?: PVMetricsClientDemoPack;
};

const audienceLabel = {
  'internal-engineering': 'Ingeniería interna',
  'client-executive': 'Cliente ejecutivo',
  'client-technical': 'Cliente técnico',
  'qa-review': 'Revisión QA',
  'commercial-review': 'Revisión comercial',
};

export const PVMetricsClientDemoNarrativeCard = ({
  demoPack = PV_METRICS_CLIENT_DEMO_PACK_MOCK,
}: PVMetricsClientDemoNarrativeCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            CLIENT DEMO NARRATIVE
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            {demoPack.title}
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Narrativa visual para explicar el valor de ORBI PVMetrics IA en una
            conversación piloto, usando solo evidencia local, mock y segura.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-cyan-300">
            Audiencia
          </p>
          <p className="mt-1 text-sm font-black text-cyan-100">
            {audienceLabel[demoPack.audience]}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {demoPack.narrativeSections.map((section) => (
          <article
            key={section.sectionId}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sección {section.order}
                </p>

                <h4 className="mt-1 text-lg font-black text-slate-50">
                  {section.title}
                </h4>
              </div>

              <span className="rounded-full border border-cyan-400/20 bg-cyan-950/20 px-3 py-1 text-xs font-semibold text-cyan-100">
                {audienceLabel[section.audience]}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {section.body}
            </p>

            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                Safety Disclaimer
              </p>
              <p className="mt-1 text-sm text-amber-100">
                {section.safetyDisclaimer}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Evidencia visible para cliente
        </p>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {demoPack.evidenceItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="text-sm font-bold text-slate-100">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.summary}
              </p>
              <p className="mt-3 text-xs text-emerald-200">
                {item.safetyNote}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
            Pilot Boundaries
          </p>

          <ul className="mt-3 space-y-3 text-sm text-violet-100">
            {demoPack.safetyBoundaries.map((boundary) => (
              <li key={boundary.boundaryId}>
                <span className="font-bold">{boundary.label}:</span>{' '}
                {boundary.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-rose-400/20 bg-rose-950/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">
            No Real Integration Statement
          </p>

          <p className="mt-3 text-sm leading-6 text-rose-100">
            {demoPack.noRealIntegrationStatement.body}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Vista previa del texto cliente
        </p>

        <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
          {demoPack.clientCopyText}
        </pre>
      </div>
    </section>
  );
};
