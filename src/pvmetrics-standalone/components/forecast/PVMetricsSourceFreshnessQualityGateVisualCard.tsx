import { PVMetricsSourceQualityGateResult } from '../../types/pvmetrics-source-freshness-quality-gate.types';

type PVMetricsSourceFreshnessQualityGateVisualCardProps = {
  gateResult: PVMetricsSourceQualityGateResult;
};

const statusTone = {
  passed: 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  'passed-with-warnings': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  blocked: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'human-review-required': 'border-orange-400/30 bg-orange-950/20 text-orange-100',
  'not-evaluable': 'border-slate-400/30 bg-slate-900/40 text-slate-100',
};

const severityText = {
  info: 'text-slate-300',
  warning: 'text-amber-300',
  blocking: 'text-orange-300',
  critical: 'text-rose-300',
};

const decisionText = {
  'allow-mock-use': 'text-emerald-300',
  'allow-with-warning': 'text-amber-300',
  'block-automatic-use': 'text-orange-300',
  'require-human-review': 'text-orange-300',
  'reject-packet': 'text-rose-300',
};

export const PVMetricsSourceFreshnessQualityGateVisualCard = ({
  gateResult,
}: PVMetricsSourceFreshnessQualityGateVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            SOURCE FRESHNESS & DATA QUALITY GATE
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Gate read-only de calidad de datos
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Visualización mock del estado de freshness, calidad, separación
            FV/BESS, operaciones prohibidas y decisión final del paquete
            read-only. No conecta fuentes reales ni ejecuta acciones externas.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${statusTone[gateResult.overallStatus]}`}
        >
          <p className="text-xs uppercase tracking-wide">Overall Status</p>
          <p className="mt-1 text-lg font-black uppercase">
            {gateResult.overallStatus}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Overall Decision
          </p>
          <p
            className={`mt-1 text-lg font-bold ${decisionText[gateResult.overallDecision]}`}
          >
            {gateResult.overallDecision}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Source ID
          </p>
          <p className="mt-1 text-lg font-bold text-slate-50">
            {gateResult.sourceId}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Source Name
          </p>
          <p className="mt-1 text-lg font-bold text-slate-50">
            {gateResult.sourceName}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Domain
          </p>
          <p className="mt-1 text-lg font-bold text-slate-50">
            {gateResult.domain}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Freshness Assessment
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Status:</span>{' '}
              {gateResult.freshnessAssessment.freshnessStatus}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Age:</span>{' '}
              {gateResult.freshnessAssessment.ageMinutesLabel}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Window:</span>{' '}
              {gateResult.freshnessAssessment.windowLabel}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Blocked:</span>{' '}
              {gateResult.freshnessAssessment.isBlocked ? 'Sí' : 'No'}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-cyan-100">
            {gateResult.freshnessAssessment.explanation}
          </p>
        </article>

        <article className="rounded-2xl border border-violet-400/20 bg-violet-950/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Data Quality Assessment
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Status:</span>{' '}
              {gateResult.dataQualityAssessment.dataQualityStatus}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Unit:</span>{' '}
              {gateResult.dataQualityAssessment.unit}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">Asset:</span>{' '}
              {gateResult.dataQualityAssessment.assetSeparation}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-slate-100">FV/BESS:</span>{' '}
              {gateResult.dataQualityAssessment.fvBessSeparated
                ? 'Separado'
                : 'Revisión requerida'}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-violet-100">
            {gateResult.dataQualityAssessment.explanation}
          </p>
        </article>
      </div>

      {gateResult.forbiddenOperationAssessments.length > 0 && (
        <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Operaciones prohibidas detectadas
          </p>

          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {gateResult.forbiddenOperationAssessments.map((item) => (
              <li key={item.attemptedOperation}>
                • {item.attemptedOperation}: {item.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Gate Checks
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Check</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Severidad</th>
              <th className="px-3 py-2">Decisión</th>
              <th className="px-3 py-2">Detalle</th>
            </tr>
          </thead>

          <tbody>
            {gateResult.checks.map((item) => (
              <tr
                key={item.checkId}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {item.label}
                </td>
                <td className="px-3 py-3">{item.category}</td>
                <td className="px-3 py-3">{item.status}</td>
                <td
                  className={`px-3 py-3 font-semibold ${severityText[item.severity]}`}
                >
                  {item.severity}
                </td>
                <td
                  className={`px-3 py-3 font-semibold ${decisionText[item.decision]}`}
                >
                  {item.decision}
                </td>
                <td className="px-3 py-3">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Gate Findings
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Finding</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Severidad</th>
              <th className="px-3 py-2">Decisión</th>
              <th className="px-3 py-2">Mensaje</th>
            </tr>
          </thead>

          <tbody>
            {gateResult.findings.length > 0 ? (
              gateResult.findings.map((item) => (
                <tr
                  key={item.findingId}
                  className="border-t border-slate-800 text-slate-300"
                >
                  <td className="px-3 py-3 font-semibold text-slate-100">
                    {item.title}
                  </td>
                  <td className="px-3 py-3">{item.category}</td>
                  <td
                    className={`px-3 py-3 font-semibold ${severityText[item.severity]}`}
                  >
                    {item.severity}
                  </td>
                  <td
                    className={`px-3 py-3 font-semibold ${decisionText[item.decision]}`}
                  >
                    {item.decision}
                  </td>
                  <td className="px-3 py-3">{item.message}</td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-slate-800 text-slate-400">
                <td className="px-3 py-3" colSpan={5}>
                  Sin findings críticos en este escenario mock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Blocked Reasons
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {gateResult.blockedReasons.length > 0 ? (
              gateResult.blockedReasons.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin bloqueos.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Warnings
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {gateResult.warnings.length > 0 ? (
              gateResult.warnings.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin advertencias.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-orange-400/20 bg-orange-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
            Human Review
          </p>
          <ul className="mt-3 space-y-2 text-sm text-orange-100">
            {gateResult.humanReviewReasons.length > 0 ? (
              gateResult.humanReviewReasons.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>• Sin revisión humana obligatoria.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm text-rose-100">{gateResult.safetyBoundary}</p>
      </div>
    </section>
  );
};
