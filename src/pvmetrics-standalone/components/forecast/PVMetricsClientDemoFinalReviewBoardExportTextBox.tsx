import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_FINAL_REVIEW_BOARD_PACK_MOCK } from '../../data/pvMetricsClientDemoFinalReviewBoardMockData';
import { PVMetricsControlledClientDemoFinalReviewBoardPack } from '../../types/pvmetrics-client-demo-final-review-board.types';

type Props = {
  reviewPack?: PVMetricsControlledClientDemoFinalReviewBoardPack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveFinalReviewSummary = (
  reviewPack: PVMetricsControlledClientDemoFinalReviewBoardPack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de Final Review Board',
    '',
    'Declaración obligatoria:',
    'Este resumen es local, conceptual, review-only, demo-only, read-only y no productivo. No aprueba release real, no crea comité real, no crea acta legal real, no crea PDF real, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${reviewPack.internalVersion}`,
    `Estado: ${reviewPack.status}`,
    `Bloque: ${reviewPack.roadmapBlock}`,
    `Generado: ${reviewPack.generatedAtLabel}`,
    '',
    'Propósito del Final Review Board:',
    list(reviewPack.finalReviewBoardPurpose, (item) => item),
    '',
    'Dominios revisados:',
    list(
      reviewPack.finalReviewDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.reviewMode} | ${domain.description}`,
    ),
    '',
    'Gates de revisión:',
    list(
      reviewPack.finalReviewGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Roles de revisión conceptual:',
    list(
      reviewPack.finalReviewApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Postura final:',
    'La mesa conceptual confirma que ORBI PVMetrics IA permanece como demo local, mock, read-only, demo-only, no productiva y sin acciones externas reales.',
    '',
    'Cierre ejecutivo:',
    'Este board no representa aprobación de cliente, comité real, release real, piloto real, producción real ni decisión contractual. Cualquier siguiente paso debe ser manual, humano, externo a la app y definido en un alcance separado.',
    '',
    'Final Review Boundary:',
    reviewPack.finalReviewBoundary,
  ].join('\n');

const buildInternalFinalReviewReport = (
  reviewPack: PVMetricsControlledClientDemoFinalReviewBoardPack,
) =>
  [
    'ORBI PVMetrics IA — Revisión técnica interna de Final Review Board',
    `Pack ID: ${reviewPack.packId}`,
    `Generated: ${reviewPack.generatedAtLabel}`,
    `Version: ${reviewPack.internalVersion}`,
    `Status: ${reviewPack.status}`,
    `Roadmap Block: ${reviewPack.roadmapBlock}`,
    '',
    'Allowed Final Review Board Items:',
    list(
      reviewPack.allowedFinalReviewBoardItems,
      (item) =>
        `${item.label} | Mode: ${item.reviewMode} | Human review: ${
          item.requiresHumanReview ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Final Review Board Items:',
    list(
      reviewPack.blockedFinalReviewBoardItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Final Review Board Principles:',
    list(
      reviewPack.finalReviewBoardPrinciples,
      (principle) =>
        `${principle.label} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        } | ${principle.description}`,
    ),
    '',
    'Final Review Domains:',
    list(
      reviewPack.finalReviewDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.reviewMode} | ${domain.description}`,
    ),
    '',
    'Final Review Gates:',
    list(
      reviewPack.finalReviewGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Final Review Approval Roles:',
    list(
      reviewPack.finalReviewApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Final Review Risk Register:',
    list(
      reviewPack.finalReviewRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Final Review Exit Criteria:',
    list(
      reviewPack.finalReviewExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label} | Required: ${
          criterion.required ? 'yes' : 'no'
        } | ${criterion.description}`,
    ),
    '',
    'Final Review Boundary:',
    reviewPack.finalReviewBoundary,
    '',
    `Next Recommended Module: ${reviewPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsClientDemoFinalReviewBoardExportTextBox = ({
  reviewPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_FINAL_REVIEW_BOARD_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-summary' | 'internal-report' | null
  >(null);

  const executiveSummary = useMemo(
    () => buildExecutiveFinalReviewSummary(reviewPack),
    [reviewPack],
  );

  const internalReport = useMemo(
    () => buildInternalFinalReviewReport(reviewPack),
    [reviewPack],
  );

  const handleCopy = async (
    target: 'executive-summary' | 'internal-report',
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
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          CLIENT DEMO FINAL REVIEW BOARD EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local de la mesa final conceptual
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para copiar un resumen ejecutivo y una
          revisión técnica interna del board conceptual. No aprueba release real,
          no crea comité real, no crea acta legal real, no crea PDF y no ejecuta
          acciones externas reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Executive Summary
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Resumen ejecutivo
              </h4>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy('executive-summary', executiveSummary)
              }
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'executive-summary' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={executiveSummary}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                Internal Report
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Revisión técnica interna
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal-report', internalReport)}
              className="rounded-xl border border-amber-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-100 hover:bg-amber-400/10"
            >
              {copiedTarget === 'internal-report' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReport}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Final Review Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No aprueba release real, no
          crea comité real, no crea acta legal real, no crea PDF real, ZIP real,
          APK real ni release productiva. No envía emails reales, no crea
          reuniones reales, no crea links reales, no crea invitaciones reales,
          no incorpora datos reales, no crea conectores reales, no usa
          credenciales, tokens, secrets, API keys ni passwords, no lee SCADA, no
          lee medidores, no llama APIs reales, no envía CEN, no usa backend,
          base de datos, localStorage, POST/PUT/PATCH/DELETE real, telecontrol,
          setpoints, comandos BESS/inversores, SCADA ACK, forecast oficial ni
          reporte regulatorio.
        </p>
      </div>
    </section>
  );
};
