import { PVMetricsReadonlyPilotDataContractDraft } from '../../types/pvmetrics-readonly-pilot-data-contract.types';

type PVMetricsReadonlyPilotDataContractCardProps = {
  contract: PVMetricsReadonlyPilotDataContractDraft;
};

const statusTone = {
  blocked: 'border-rose-400/30 bg-rose-950/20 text-rose-100',
  draft: 'border-slate-500/30 bg-slate-900/60 text-slate-100',
  'ready-for-client-review':
    'border-emerald-400/30 bg-emerald-950/20 text-emerald-100',
  'ready-for-technical-review':
    'border-amber-400/30 bg-amber-950/20 text-amber-100',
};

const ownerLabel = {
  client: 'Cliente',
  orbi: 'ORBI',
  joint: 'Conjunta',
};

export const PVMetricsReadonlyPilotDataContractCard = ({
  contract,
}: PVMetricsReadonlyPilotDataContractCardProps) => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            READ-ONLY DATA CONTRACT
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Borrador conceptual de contrato de datos
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Matriz local para ordenar señales, responsabilidades, reglas de calidad y cláusulas read-only antes de cualquier integración futura.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-5 py-4 text-center ${statusTone[contract.contractStatus]}`}
        >
          <p className="text-xs uppercase tracking-wide">
            Estado contractual
          </p>
          <p className="mt-1 text-sm font-black uppercase">
            {contract.contractStatusLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Total señales', contract.signalCount],
          ['Críticas', contract.criticalSignals],
          ['Altas', contract.highSignals],
          ['Medias', contract.mediumSignals],
          ['Bajas', contract.lowSignals],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-50">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Señal / check</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">Unidad</th>
              <th className="px-3 py-2">Fuente esperada</th>
              <th className="px-3 py-2">Frecuencia</th>
              <th className="px-3 py-2">Criticidad</th>
              <th className="px-3 py-2">Read-only</th>
            </tr>
          </thead>

          <tbody>
            {contract.signals.map((signal) => (
              <tr
                key={signal.id}
                className="border-t border-slate-800 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-slate-100">
                  {signal.label}
                </td>
                <td className="px-3 py-3">{signal.category}</td>
                <td className="px-3 py-3">{signal.unit}</td>
                <td className="px-3 py-3">{signal.expectedSource}</td>
                <td className="px-3 py-3">{signal.suggestedFrequency}</td>
                <td className="px-3 py-3">{signal.criticality}</td>
                <td className="px-3 py-3">
                  {signal.readOnlyOnly ? 'Sí' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Responsabilidades cliente
          </p>
          <ul className="mt-3 space-y-2 text-sm text-emerald-100">
            {contract.clientResponsibilities.map((item) => (
              <li key={item.id}>
                • <strong>{item.label}</strong>: {item.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Responsabilidades ORBI
          </p>
          <ul className="mt-3 space-y-2 text-sm text-cyan-50">
            {contract.orbiResponsibilities.map((item) => (
              <li key={item.id}>
                • <strong>{item.label}</strong>: {item.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-violet-400/20 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Responsabilidades conjuntas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-violet-100">
            {contract.jointResponsibilities.map((item) => (
              <li key={item.id}>
                • <strong>{ownerLabel[item.owner]}</strong> — {item.label}: {item.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reglas de calidad
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {contract.qualityAssumptions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
            Exclusiones explícitas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-rose-100">
            {contract.explicitExclusions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Cláusulas read-only
          </p>
          <ul className="mt-3 space-y-2 text-sm text-amber-100">
            {contract.readOnlySafetyClauses.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Límite de seguridad
        </p>
        <p className="mt-2 text-sm text-rose-100">
          {contract.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
