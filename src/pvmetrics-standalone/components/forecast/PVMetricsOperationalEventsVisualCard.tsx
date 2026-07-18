import { PVMetricsOperationalEventMockAssessment } from '../../types/pvmetrics-operational-event-mock.types';

type PVMetricsOperationalEventsVisualCardProps = {
  assessment: PVMetricsOperationalEventMockAssessment;
};

const statusTone = {
  'no-events': 'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  monitoring: 'border-cyan-400/30 bg-cyan-950/20 text-cyan-100',
  'review-required': 'border-amber-400/30 bg-amber-950/20 text-amber-100',
  'critical-review-required':
    'border-rose-400/30 bg-rose-950/20 text-rose-100',
};

const severityTone = {
  low: 'text-slate-300',
  medium: 'text-amber-300',
  high: 'text-orange-300',
  critical: 'text-rose-300',
};

const severityLabel = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

const eventStatusLabel = {
  draft: 'Borrador',
  active: 'Activo',
  'under-review': 'En revisión',
  resolved: 'Resuelto',
  cancelled: 'Cancelado',
};

const eventCategoryLabel = {
  'planned-maintenance': 'Mantenimiento programado',
  'forced-outage': 'Indisponibilidad forzada',
  'partial-derating': 'Derating parcial',
  'grid-curtailment': 'Limitación de red',
  'inverter-issue': 'Evento inversor',
  'bess-limitation': 'Limitación BESS',
  'weather-related': 'Evento climático',
  'soiling-related': 'Soiling',
  'communication-loss': 'Pérdida comunicación',
  'data-quality-issue': 'Calidad de datos',
  'manual-note': 'Nota manual',
};

const impactLevelLabel = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico',
};

const cenImpactLabel = {
  none: 'Sin impacto',
  warning: 'Advertencia',
  'blocking-review': 'Revisión bloqueante',
};

export const PVMetricsOperationalEventsVisualCard = ({
  assessment,
}: PVMetricsOperationalEventsVisualCardProps) => {
  return (
    <section className="rounded-3xl border border-orange-400/20 bg-slate-950/80 p-5 shadow-2xl" id="pvmetrics-operational-events-visual-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">
            OPERATIONAL EVENT LAYER
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Eventos operacionales mock
          </h3>

          <p className="mt-2 max-w-5xl text-sm text-slate-400">
            Evaluación local de eventos que pueden explicar cambios en forecast,
            disponibilidad, performance, compliance CEN y calidad de datos.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${statusTone[assessment.status]}`}
        >
          <p className="text-xs uppercase tracking-wide">Estado operacional</p>
          <p className="mt-1 max-w-xs text-lg font-black uppercase">
            {assessment.statusLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Eventos totales', assessment.impactSummary.totalEvents],
          ['Eventos activos', assessment.impactSummary.activeEvents],
          ['Eventos críticos', assessment.impactSummary.criticalEvents],
          ['Eventos high', assessment.impactSummary.highEvents],
          [
            'Impacto forecast',
            impactLevelLabel[assessment.impactSummary.forecastImpactLevel],
          ],
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

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          [
            'Impacto potencia',
            `${assessment.impactSummary.estimatedTotalPowerImpactMw} MW`,
          ],
          [
            'Impacto energía',
            `${assessment.impactSummary.estimatedTotalEnergyImpactMwh} MWh`,
          ],
          [
            'Impacto disponibilidad',
            `${assessment.impactSummary.estimatedAvailabilityImpactPct}%`,
          ],
          [
            'Impacto compliance CEN',
            cenImpactLabel[assessment.impactSummary.cenComplianceImpact],
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-orange-400/10 bg-orange-950/10 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-orange-300">
              {label}
            </p>
            <p className="mt-1 text-xl font-bold text-orange-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tabla de eventos operacionales mock
        </p>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Evento</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2">Severidad</th>
              <th className="px-3 py-2">Ventana</th>
              <th className="px-3 py-2">Activo</th>
              <th className="px-3 py-2">MW</th>
              <th className="px-3 py-2">MWh</th>
              <th className="px-3 py-2">Disp.</th>
              <th className="px-3 py-2">Evidencia</th>
              <th className="px-3 py-2">Acción recomendada</th>
            </tr>
          </thead>

          <tbody>
            {assessment.events.map((event) => (
              <tr
                key={event.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {event.title}
                </td>
                <td className="px-3 py-3">
                  {eventCategoryLabel[event.category]}
                </td>
                <td className="px-3 py-3">
                  {eventStatusLabel[event.status]}
                </td>
                <td className={`px-3 py-3 font-semibold ${severityTone[event.severity]}`}>
                  {severityLabel[event.severity]}
                </td>
                <td className="px-3 py-3">
                  {event.startTimeLabel}–{event.endTimeLabel}
                </td>
                <td className="px-3 py-3">{event.affectedAsset}</td>
                <td className="px-3 py-3">{event.estimatedPowerImpactMw}</td>
                <td className="px-3 py-3">{event.estimatedEnergyImpactMwh}</td>
                <td className="px-3 py-3">
                  {event.estimatedAvailabilityImpactPct}%
                </td>
                <td className="px-3 py-3">{event.evidence}</td>
                <td className="px-3 py-3">{event.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Notas de ajuste forecast
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-100">
            {assessment.forecastAdjustmentNotes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Advertencias compliance CEN
          </p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100">
            {assessment.complianceWarnings.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Recomendaciones O&M
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100">
            {assessment.omRecommendations.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Advertencias de calidad de datos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {assessment.dataQualityWarnings.length ? (
              assessment.dataQualityWarnings.map((item) => (
                <li key={item}>• {item}</li>
              ))
            ) : (
              <li>• Sin advertencias de calidad de datos en este set mock.</li>
            )}
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
