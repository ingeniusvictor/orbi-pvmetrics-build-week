import { PVMetricsFutureConnectorRegistry } from '../../types/pvmetrics-future-connector-registry.types';

type PVMetricsFutureConnectorRegistryVisualCardProps = {
  registry: PVMetricsFutureConnectorRegistry;
};

const riskTone = {
  low: 'text-emerald-300',
  medium: 'text-amber-300',
  high: 'text-orange-300',
  critical: 'text-rose-300',
  'not-evaluable': 'text-slate-300',
};

const lifecycleTone = {
  concept: 'border-slate-400/30 bg-slate-900/40 text-slate-200',
  'contract-defined': 'border-cyan-400/30 bg-cyan-950/20 text-cyan-100',
  'mock-ready': 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  'qa-review': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'approved-for-future-read-only':
    'border-teal-400/30 bg-teal-950/20 text-teal-100',
  blocked: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  deprecated: 'border-slate-600/30 bg-slate-950/60 text-slate-400',
};

const securityTone = {
  'safe-mock-only': 'text-emerald-300',
  'read-only-required': 'text-cyan-300',
  'credential-review-required': 'text-amber-300',
  'consent-required': 'text-violet-300',
  'blocked-dangerous-write-risk': 'text-rose-300',
  'blocked-telecontrol-risk': 'text-rose-300',
};

const permissionTone = {
  'no-permission-needed-mock': 'text-emerald-300',
  'owner-consent-required': 'text-violet-300',
  'credential-scope-required': 'text-amber-300',
  'read-only-scope-required': 'text-cyan-300',
  'permission-blocked': 'text-rose-300',
};

export const PVMetricsFutureConnectorRegistryVisualCard = ({
  registry,
}: PVMetricsFutureConnectorRegistryVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-teal-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
            FUTURE CONNECTOR REGISTRY
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Registro futuro de conectores read-only
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Visualización mock del mapa de conectores conceptuales. Esta capa no
            crea conectores reales, no llama APIs, no usa credenciales y no
            habilita escritura externa.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-400/30 bg-teal-950/20 px-5 py-4 text-center text-teal-100">
          <p className="text-xs uppercase tracking-wide">Registry Status</p>
          <p className="mt-1 text-lg font-black uppercase">
            {registry.registryStatus}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total Connectors', registry.summary.totalConnectors],
          ['Mock Ready', registry.summary.mockReadyCount],
          ['Blocked', registry.summary.blockedCount],
          ['Credential Review', registry.summary.credentialReviewRequiredCount],
          ['Consent Required', registry.summary.consentRequiredCount],
          ['Critical Risk', registry.summary.criticalRiskCount],
          [
            'Approved Read-Only',
            registry.summary.approvedForFutureReadOnlyCount,
          ],
          ['Forbidden Ops', registry.globalForbiddenOperations.length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {registry.items.map((item) => (
          <article
            key={item.connectorId}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {item.connectorFamily} · {item.allowedAccessMode}
                </p>

                <h4 className="mt-1 text-xl font-black text-slate-50">
                  {item.label}
                </h4>

                <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>

              <div
                className={`rounded-2xl border px-4 py-3 text-center ${lifecycleTone[item.lifecycleStatus]}`}
              >
                <p className="text-xs uppercase tracking-wide">Lifecycle</p>
                <p className="mt-1 text-sm font-black uppercase">
                  {item.lifecycleStatus}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Security
                </p>
                <p
                  className={`mt-1 text-sm font-bold ${securityTone[item.securityStatus]}`}
                >
                  {item.securityStatus}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Permission
                </p>
                <p
                  className={`mt-1 text-sm font-bold ${permissionTone[item.permissionStatus]}`}
                >
                  {item.permissionStatus}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Risk
                </p>
                <p className={`mt-1 text-sm font-bold ${riskTone[item.riskLevel]}`}>
                  {item.riskLevel}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Domains
                </p>
                <p className="mt-1 text-sm font-bold text-slate-100">
                  {item.domains.join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Capacidades permitidas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.allowedCapabilities.map((capability) => (
                    <span
                      key={capability}
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
                  Operaciones prohibidas
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.forbiddenOperations.slice(0, 10).map((operation) => (
                    <span
                      key={operation}
                      className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-100"
                    >
                      {operation}
                    </span>
                  ))}
                  {item.forbiddenOperations.length > 10 && (
                    <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-100">
                      +{item.forbiddenOperations.length - 10} más
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Requisitos de contrato
              </p>

              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">Dominio</th>
                    <th className="px-3 py-2">Requisito</th>
                    <th className="px-3 py-2">Source</th>
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">FV/BESS</th>
                    <th className="px-3 py-2">Gates</th>
                  </tr>
                </thead>

                <tbody>
                  {item.contractRequirements.map((requirement) => (
                    <tr
                      key={requirement.contractRequirementId}
                      className="border-t border-slate-800 text-slate-300"
                    >
                      <td className="px-3 py-3 font-semibold text-slate-100">
                        {requirement.domain}
                      </td>
                      <td className="px-3 py-3">{requirement.label}</td>
                      <td className="px-3 py-3">
                        {requirement.mustHaveSourceId ? 'Sí' : 'No'}
                      </td>
                      <td className="px-3 py-3">
                        {requirement.mustHaveTimestamp ? 'Sí' : 'No'}
                      </td>
                      <td className="px-3 py-3">
                        {requirement.mustHaveUnit ? 'Sí' : 'No'}
                      </td>
                      <td className="px-3 py-3">
                        {requirement.mustSeparatePvBess ? 'Sí' : 'No'}
                      </td>
                      <td className="px-3 py-3">
                        {requirement.mustPassFreshnessGate &&
                        requirement.mustPassQualityGate
                          ? 'Freshness + Quality'
                          : 'Parcial'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  QA Requirements
                </p>

                <ul className="mt-3 space-y-2 text-sm text-cyan-100">
                  {item.qaRequirements.map((requirement) => (
                    <li key={requirement.requirementId}>
                      • {requirement.label}:{' '}
                      <span className="text-slate-300">
                        {requirement.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-orange-400/20 bg-orange-950/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
                  Human Review
                </p>

                <ul className="mt-3 space-y-2 text-sm text-orange-100">
                  {item.humanReviewRequirements.map((requirement) => (
                    <li key={requirement.reviewId}>
                      • {requirement.label} ({requirement.ownerHint}):{' '}
                      <span className="text-slate-300">
                        {requirement.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {item.blockedReason && (
              <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
                  Blocked Reason
                </p>
                <p className="mt-2 text-sm text-rose-100">
                  {item.blockedReason}
                </p>
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Readiness Summary
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.readinessSummary}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Global Safety Boundaries
        </p>

        <ul className="mt-3 grid gap-2 text-sm text-rose-100 md:grid-cols-2">
          {registry.globalSafetyBoundaries.map((boundary) => (
            <li key={boundary}>• {boundary}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
