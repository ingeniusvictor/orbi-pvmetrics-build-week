import { PVMetricsCenComplianceMockAssessment } from '../../types/pvmetrics-cen-compliance-mock.types';

type PVMetricsCenComplianceVisualCardProps = {
  assessment: PVMetricsCenComplianceMockAssessment;
};

const statusTone = {
  blocked: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  'not-ready': 'border-orange-400/30 bg-orange-950/20 text-orange-100',
  'draft-review': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'conceptually-ready':
    'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
};

const severityTone = {
  critical: 'text-rose-300',
  high: 'text-orange-300',
  medium: 'text-amber-300',
  low: 'text-slate-300',
};

const severityLabel = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const categoryLabel = {
  'plant-identification': 'Identificación planta',
  'forecast-energy': 'Energía forecast',
  'forecast-power': 'Potencia forecast',
  availability: 'Disponibilidad',
  limitations: 'Limitaciones',
  'weather-assumption': 'Supuesto clima',
  timestamp: 'Timestamp',
  traceability: 'Trazabilidad',
  'responsible-party': 'Responsable',
  'safety-boundary': 'Safety Boundary',
};

export const PVMetricsCenComplianceVisualCard = ({
  assessment,
}: PVMetricsCenComplianceVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-violet-400/20 bg-slate-950/80 p-5 shadow-2xl" id="pvmetrics-cen-compliance-visual-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
            CEN FORECAST COMPLIANCE SIMULATOR
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Assessment CEN mock conceptual
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Evaluación local de preparación, trazabilidad y madurez conceptual
            del forecast solar mock antes de cualquier uso regulatorio.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${statusTone[assessment.status]}`}
        >
          <p className="text-xs uppercase tracking-wide">Estado</p>
          <p className="mt-1 max-w-xs text-lg font-black uppercase">
            {assessment.statusLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Compliance Score', `${assessment.complianceScorePct}%`],
          ['Checks aprobados', `${assessment.passedChecks}/${assessment.totalChecks}`],
          ['Bloqueantes', `${assessment.blockedChecks}`],
          ['Campos faltantes', `${assessment.missingRequiredFields}`],
          ['Horizonte', assessment.horizonLabel],
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

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Evaluación de campos conceptuales
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Campo</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Requerido</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Evidencia</th>
            </tr>
          </thead>

          <tbody>
            {assessment.fieldAssessments.map((field) => (
              <tr
                key={field.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {field.label}
                </td>
                <td className="px-3 py-3">{categoryLabel[field.category]}</td>
                <td className="px-3 py-3">{field.required ? 'Sí' : 'No'}</td>
                <td className="px-3 py-3">
                  {field.available ? (
                    <span className="font-semibold text-emerald-300">
                      Disponible
                    </span>
                  ) : (
                    <span className="font-semibold text-amber-300">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">{field.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Evaluación de checks de cumplimiento
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Check</th>
              <th className="px-3 py-2">Severidad</th>
              <th className="px-3 py-2">Resultado</th>
              <th className="px-3 py-2">Bloquea</th>
              <th className="px-3 py-2">Evidencia</th>
              <th className="px-3 py-2">Acción</th>
            </tr>
          </thead>

          <tbody>
            {assessment.checkAssessments.map((check) => (
              <tr
                key={check.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {check.label}
                </td>
                <td className={`px-3 py-3 font-semibold ${severityTone[check.severity]}`}>
                  {severityLabel[check.severity]}
                </td>
                <td className="px-3 py-3">
                  {check.passed ? (
                    <span className="font-semibold text-emerald-300">OK</span>
                  ) : (
                    <span className="font-semibold text-amber-300">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {check.blocksSubmission ? 'Sí' : 'No'}
                </td>
                <td className="px-3 py-3">{check.evidence}</td>
                <td className="px-3 py-3">{check.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Bloqueantes
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {assessment.blockers.length ? (
              assessment.blockers.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin bloqueantes críticos adicionales.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Advertencias
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {assessment.warnings.length ? (
              assessment.warnings.map((item) => <li key={item}>• {item}</li>)
            ) : (
              <li>• Sin advertencias adicionales.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Notas regulatorias
          </p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100">
            {assessment.regulatoryNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {assessment.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
