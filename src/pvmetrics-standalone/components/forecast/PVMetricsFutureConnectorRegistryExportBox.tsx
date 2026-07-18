import { useMemo, useState } from 'react';
import { PVMetricsFutureConnectorRegistry } from '../../types/pvmetrics-future-connector-registry.types';

type PVMetricsFutureConnectorRegistryExportBoxProps = {
  registry: PVMetricsFutureConnectorRegistry;
};

const buildInternalText = (registry: PVMetricsFutureConnectorRegistry) =>
  [
    'ORBI PVMetrics IA — Future Connector Registry',
    `Roadmap Block: ${registry.roadmapBlock}`,
    `Module: ${registry.module}`,
    `Version: ${registry.internalVersion}`,
    `Registry Status: ${registry.registryStatus}`,
    '',
    'Registry Summary:',
    `- Total Connectors: ${registry.summary.totalConnectors}`,
    `- Mock Ready: ${registry.summary.mockReadyCount}`,
    `- Approved Future Read-Only: ${registry.summary.approvedForFutureReadOnlyCount}`,
    `- Blocked: ${registry.summary.blockedCount}`,
    `- Credential Review Required: ${registry.summary.credentialReviewRequiredCount}`,
    `- Consent Required: ${registry.summary.consentRequiredCount}`,
    `- Critical Risk: ${registry.summary.criticalRiskCount}`,
    '',
    'Connector Items:',
    registry.items
      .map((item) =>
        [
          `- ${item.label} (${item.connectorId})`,
          `  Family: ${item.connectorFamily}`,
          `  Domains: ${item.domains.join(', ')}`,
          `  Lifecycle: ${item.lifecycleStatus}`,
          `  Security: ${item.securityStatus}`,
          `  Permission: ${item.permissionStatus}`,
          `  Risk: ${item.riskLevel}`,
          `  Access Mode: ${item.allowedAccessMode}`,
          `  Allowed Capabilities: ${item.allowedCapabilities.join(', ')}`,
          `  Forbidden Operations: ${item.forbiddenOperations.join(', ')}`,
          `  Readiness: ${item.readinessSummary}`,
          item.blockedReason ? `  Blocked Reason: ${item.blockedReason}` : '',
          `  Safety Boundary: ${item.safetyBoundary}`,
        ]
          .filter(Boolean)
          .join('\n'),
      )
      .join('\n\n'),
    '',
    'Global Forbidden Operations:',
    registry.globalForbiddenOperations.map((operation) => `- ${operation}`).join('\n'),
    '',
    'Global Safety Boundaries:',
    registry.globalSafetyBoundaries.map((boundary) => `- ${boundary}`).join('\n'),
    '',
    'Next Recommended Module:',
    registry.nextRecommendedModule,
  ].join('\n');

const buildClientText = (registry: PVMetricsFutureConnectorRegistry) =>
  [
    'Resumen conceptual de conectores futuros ORBI PVMetrics IA',
    '',
    `Estado del registro: ${registry.registryStatus}.`,
    `Total de conectores conceptuales: ${registry.summary.totalConnectors}.`,
    `Conectores listos como mock: ${registry.summary.mockReadyCount}.`,
    `Conectores bloqueados: ${registry.summary.blockedCount}.`,
    `Conectores con revisión de credenciales requerida: ${registry.summary.credentialReviewRequiredCount}.`,
    `Conectores con consentimiento requerido: ${registry.summary.consentRequiredCount}.`,
    `Conectores con riesgo crítico: ${registry.summary.criticalRiskCount}.`,
    '',
    'Este registro muestra únicamente conectores conceptuales futuros. No existe conexión real con SCADA, medidores, clima, CEN, ERP, billing ni sistemas externos.',
    '',
    'Conectores conceptuales:',
    registry.items
      .map(
        (item) =>
          `- ${item.label}: ${item.readinessSummary}`,
      )
      .join('\n'),
    '',
    'Todos los conectores se mantienen bajo arquitectura read-only/mock y no habilitan escritura, telecontrol, setpoints, comandos BESS ni comandos de inversores.',
  ].join('\n');

export const PVMetricsFutureConnectorRegistryExportBox = ({
  registry,
}: PVMetricsFutureConnectorRegistryExportBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'internal' | 'client' | null>(
    null,
  );

  const internalText = useMemo(() => buildInternalText(registry), [registry]);
  const clientText = useMemo(() => buildClientText(registry), [registry]);

  const handleCopy = async (target: 'internal' | 'client', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/70 p-5 shadow-2xl">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
          FUTURE CONNECTOR REGISTRY EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Reportes copiables del registro de conectores
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Export local para revisión interna y comunicación cliente. No crea
          conectores, no envía datos, no exporta PDF y no llama APIs.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-teal-400/20 bg-teal-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Reporte interno del registro
            </h4>

            <button
              type="button"
              onClick={() => handleCopy('internal', internalText)}
              className="rounded-xl border border-teal-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-teal-100 hover:bg-teal-400/10"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>

        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen cliente del registro
            </h4>

            <button
              type="button"
              onClick={() => handleCopy('client', clientText)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300"
          />
        </article>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          Nota de seguridad
        </p>

        <p className="mt-2 text-sm text-amber-100">
          Este export es solo texto local copiable. No activa conectores, no
          guarda credenciales, no sincroniza fuentes reales y no representa
          aprobación técnica para conexión externa.
        </p>
      </div>
    </section>
  );
};
