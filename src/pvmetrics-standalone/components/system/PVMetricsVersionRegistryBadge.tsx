import React from 'react';
import { PV_METRICS_VERSION_REGISTRY } from '../../version/pvMetricsVersionRegistry';

export const PVMetricsVersionRegistryBadge = () => {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            PV METRICS VERSION REGISTRY
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            {PV_METRICS_VERSION_REGISTRY.appName}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Registro interno de versión embebido en la aplicación para mantener trazabilidad del roadmap.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Internal Version
          </p>
          <p className="mt-1 text-sm font-black text-emerald-100">
            {PV_METRICS_VERSION_REGISTRY.internalVersion}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Módulo estable', PV_METRICS_VERSION_REGISTRY.currentStableModule],
          ['Bloque actual', PV_METRICS_VERSION_REGISTRY.currentRoadmapBlock],
          ['Siguiente módulo', PV_METRICS_VERSION_REGISTRY.nextRecommendedModule],
          ['Modo seguridad', PV_METRICS_VERSION_REGISTRY.safetyMode],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Context Lock activo
        </p>
        <p className="mt-2 text-sm text-cyan-50">
          {PV_METRICS_VERSION_REGISTRY.contextLock}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Flujo estable registrado
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {PV_METRICS_VERSION_REGISTRY.lastKnownStableFlow.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Límites de seguridad
        </p>
        <ul className="mt-3 space-y-2 text-sm text-rose-100">
          {PV_METRICS_VERSION_REGISTRY.safetyBoundaries.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
