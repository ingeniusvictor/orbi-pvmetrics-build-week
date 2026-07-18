import { useMemo, useState } from 'react';
import { PVMetricsSourceQualityGateResult } from '../../types/pvmetrics-source-freshness-quality-gate.types';

type PVMetricsSourceFreshnessQualityGateExportBoxProps = {
  gateResult: PVMetricsSourceQualityGateResult;
};

const buildInternalText = (gateResult: PVMetricsSourceQualityGateResult) =>
  [
    'ORBI PVMetrics IA — Source Freshness & Data Quality Gate',
    `Generado: ${gateResult.generatedAtLabel}`,
    `Source: ${gateResult.sourceName} (${gateResult.sourceId})`,
    `Domain: ${gateResult.domain}`,
    `Overall Status: ${gateResult.overallStatus}`,
    `Overall Decision: ${gateResult.overallDecision}`,
    '',
    'Freshness:',
    `- Status: ${gateResult.freshnessAssessment.freshnessStatus}`,
    `- Age: ${gateResult.freshnessAssessment.ageMinutesLabel}`,
    `- Window: ${gateResult.freshnessAssessment.windowLabel}`,
    `- Blocked: ${gateResult.freshnessAssessment.isBlocked ? 'YES' : 'NO'}`,
    `- Explanation: ${gateResult.freshnessAssessment.explanation}`,
    '',
    'Data Quality:',
    `- Status: ${gateResult.dataQualityAssessment.dataQualityStatus}`,
    `- Unit: ${gateResult.dataQualityAssessment.unit}`,
    `- Asset Separation: ${gateResult.dataQualityAssessment.assetSeparation}`,
    `- FV/BESS Separated: ${gateResult.dataQualityAssessment.fvBessSeparated ? 'YES' : 'NO'}`,
    `- Explanation: ${gateResult.dataQualityAssessment.explanation}`,
    '',
    'Gate Checks:',
    gateResult.checks
      .map(
        (check) =>
          `- [${check.status}] ${check.label} | ${check.category} | ${check.decision}: ${check.details}`,
      )
      .join('\n'),
    '',
    'Blocked Reasons:',
    gateResult.blockedReasons.length > 0
      ? gateResult.blockedReasons.map((item) => `- ${item}`).join('\n')
      : '- None',
    '',
    'Warnings:',
    gateResult.warnings.length > 0
      ? gateResult.warnings.map((item) => `- ${item}`).join('\n')
      : '- None',
    '',
    'Human Review:',
    gateResult.humanReviewReasons.length > 0
      ? gateResult.humanReviewReasons.map((item) => `- ${item}`).join('\n')
      : '- None',
    '',
    'Safety Boundary:',
    gateResult.safetyBoundary,
  ].join('\n');

const buildClientText = (gateResult: PVMetricsSourceQualityGateResult) =>
  [
    'Resumen conceptual de calidad de datos ORBI PVMetrics IA',
    '',
    `Estado general: ${gateResult.overallStatus}.`,
    `Decisión conceptual: ${gateResult.overallDecision}.`,
    `Fuente evaluada: ${gateResult.sourceName}.`,
    '',
    'El gate revisa freshness, calidad de datos, timestamp, unidades, separación FV/BESS y reglas de seguridad read-only.',
    '',
    gateResult.blockedReasons.length > 0
      ? 'El paquete presenta bloqueos conceptuales y no debe usarse automáticamente.'
      : gateResult.warnings.length > 0
        ? 'El paquete puede usarse solo como lectura mock con advertencias.'
        : 'El paquete no presenta bloqueos críticos en este escenario mock.',
    '',
    'Este resumen es local, mock y no representa conexión real con SCADA, medidores, APIs climáticas, CEN, ERP, billing ni sistemas operativos.',
  ].join('\n');

export const PVMetricsSourceFreshnessQualityGateExportBox = ({
  gateResult,
}: PVMetricsSourceFreshnessQualityGateExportBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'internal' | 'client' | null>(
    null,
  );

  const internalText = useMemo(() => buildInternalText(gateResult), [gateResult]);
  const clientText = useMemo(() => buildClientText(gateResult), [gateResult]);

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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          SOURCE QUALITY GATE EXPORT
        </p>

        <h3 className="text-xl font-bold text-slate-50">
          Reportes copiables del gate read-only
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Export local para revisión interna y comunicación cliente. No envía
          correos, no exporta PDF, no conecta fuentes reales y no ejecuta
          acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Reporte interno del gate
            </h4>

            <button
              type="button"
              onClick={() => handleCopy('internal', internalText)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
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

        <article className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-100">
              Resumen cliente del gate
            </h4>

            <button
              type="button"
              onClick={() => handleCopy('client', clientText)}
              className="rounded-xl border border-violet-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-violet-100 hover:bg-violet-400/10"
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
          Este export es solo texto local copiable. No genera documentos
          oficiales, no envía datos y no representa validación real de fuentes
          externas.
        </p>
      </div>
    </section>
  );
};
