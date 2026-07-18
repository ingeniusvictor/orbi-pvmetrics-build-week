import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK } from '../../data/pvMetricsClientDemoFeedbackMockData';
import { PVMetricsControlledClientDemoFeedbackPack } from '../../types/pvmetrics-client-demo-feedback.types';

type Props = {
  feedbackPack?: PVMetricsControlledClientDemoFeedbackPack;
};

const buildClientSafeFeedbackSummary = (
  feedbackPack: PVMetricsControlledClientDemoFeedbackPack,
) =>
  [
    'ORBI PVMetrics IA — Resumen seguro post-demo cliente',
    '',
    'Declaración obligatoria:',
    'Este resumen es conceptual, local, mock, read-only y no productivo. No captura feedback real, no envía formularios, no agenda reuniones, no genera documentos oficiales y no conecta SCADA, medidores, CEN, backend ni APIs.',
    '',
    'Propósito del feedback:',
    feedbackPack.demoFeedbackPurpose.map((item) => `- ${item}`).join('\n'),
    '',
    'Inputs permitidos:',
    feedbackPack.allowedFeedbackInputs
      .map((input) => `- ${input.label}: ${input.description}`)
      .join('\n'),
    '',
    'Inputs bloqueados:',
    feedbackPack.blockedFeedbackInputs
      .map(
        (input) =>
          `- ${input.label}: ${input.reason} | Alternativa segura: ${input.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Dimensiones de readiness para piloto:',
    feedbackPack.pilotReadinessDimensions
      .map(
        (dimension) =>
          `- ${dimension.label}: ${dimension.description} | Condición mínima: ${dimension.minimumCondition}`,
      )
      .join('\n'),
    '',
    'Señales de readiness:',
    feedbackPack.readinessSignalGuidelines
      .map(
        (signal) =>
          `- ${signal.label} (${signal.signal}): ${signal.meaning} | Acción: ${signal.action}`,
      )
      .join('\n'),
    '',
    'Cierre seguro:',
    'Cualquier piloto futuro requiere alcance aprobado, revisión humana, datos read-only sanitizados y roadmap separado. No existe producción real ni integración operacional desde este bloque.',
    '',
    'Safety Boundary:',
    feedbackPack.safetyBoundary,
  ].join('\n');

const buildInternalFeedbackReadinessReport = (
  feedbackPack: PVMetricsControlledClientDemoFeedbackPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte interno de Feedback & Pilot Readiness',
    `Pack ID: ${feedbackPack.packId}`,
    `Generated: ${feedbackPack.generatedAtLabel}`,
    `Version: ${feedbackPack.internalVersion}`,
    `Status: ${feedbackPack.status}`,
    `Roadmap Block: ${feedbackPack.roadmapBlock}`,
    '',
    'Feedback Categories:',
    feedbackPack.feedbackCategories
      .map(
        (category) =>
          `- ${category.label} | Owner: ${category.ownerRole} | ${category.description}`,
      )
      .join('\n'),
    '',
    'Client Question Log Rules:',
    feedbackPack.clientQuestionLogRules
      .map(
        (rule) =>
          `- ${rule.label}: ${rule.rule}${
            rule.escalationRole ? ` | Escalation: ${rule.escalationRole}` : ''
          }`,
      )
      .join('\n'),
    '',
    'Pilot Risk Register:',
    feedbackPack.pilotRiskRegister
      .map(
        (risk) =>
          `- ${risk.label} | Severity: ${risk.severity} | Owner: ${risk.ownerRole} | Mitigation: ${risk.mitigation}`,
      )
      .join('\n'),
    '',
    'Human Review Gates:',
    feedbackPack.humanReviewGates
      .map(
        (gate) =>
          `- ${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Pilot Readiness Exit Criteria:',
    feedbackPack.pilotReadinessExitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    feedbackPack.safetyBoundary,
    '',
    `Next Recommended Module: ${feedbackPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsFeedbackSummaryExportTextBox = ({
  feedbackPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_FEEDBACK_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'client-summary' | 'internal-report' | null
  >(null);

  const clientSummaryText = useMemo(
    () => buildClientSafeFeedbackSummary(feedbackPack),
    [feedbackPack],
  );

  const internalReportText = useMemo(
    () => buildInternalFeedbackReadinessReport(feedbackPack),
    [feedbackPack],
  );

  const handleCopy = async (
    target: 'client-summary' | 'internal-report',
    value: string,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          FEEDBACK SUMMARY EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Resumen post-demo y readiness copiable
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para ordenar feedback conceptual y evaluar
          señales de piloto futuro read-only. No genera archivos reales ni
          ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Client Safe Summary
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Resumen seguro cliente
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('client-summary', clientSummaryText)}
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'client-summary' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientSummaryText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal Readiness Report
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal-report', internalReportText)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'internal-report' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReportText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No captura feedback real, no
          envía formularios, no agenda reuniones, no graba sesiones, no genera
          ZIP/APK/PDF, no envía correos, no usa backend, APIs, localStorage,
          conectores reales, SCADA, medidores, CEN, telecontrol, setpoints ni
          comandos BESS/inversores.
        </p>
      </div>
    </section>
  );
};
