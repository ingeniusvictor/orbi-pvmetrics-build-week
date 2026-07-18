import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK } from '../../data/pvMetricsClientDemoEvidenceFreezeMockData';
import { PVMetricsControlledClientDemoEvidenceFreezePack } from '../../types/pvmetrics-client-demo-evidence-freeze.types';

type Props = {
  evidencePack?: PVMetricsControlledClientDemoEvidenceFreezePack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveEvidenceReport = (
  evidencePack: PVMetricsControlledClientDemoEvidenceFreezePack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de evidencia demo controlada',
    '',
    'Declaración obligatoria:',
    'Este documento es local, conceptual, demo-only, read-only y no productivo. No crea PDF real, ZIP real, APK real ni release productiva. No incorpora datos reales, no crea conectores reales, no usa credenciales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${evidencePack.internalVersion}`,
    `Estado: ${evidencePack.status}`,
    `Bloque: ${evidencePack.roadmapBlock}`,
    `Generado: ${evidencePack.generatedAtLabel}`,
    '',
    'Propósito de evidencia demo:',
    list(evidencePack.clientDemoEvidencePurpose, (item) => item),
    '',
    'Principios de congelación:',
    list(
      evidencePack.demoEvidenceFreezePrinciples,
      (principle) =>
        `${principle.label}: ${principle.description} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        }`,
    ),
    '',
    'Categorías de evidencia:',
    list(
      evidencePack.demoEvidenceCategories,
      (category) =>
        `${category.label} | Mode: ${category.evidenceMode} | ${category.description}`,
    ),
    '',
    'Evidencia permitida:',
    list(
      evidencePack.allowedDemoEvidenceItems,
      (item) =>
        `${item.label} | Mode: ${item.evidenceMode} | Approval: ${
          item.requiresApproval ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Cierre ejecutivo:',
    'La evidencia demo queda limitada a readiness local, narrativa cliente segura, trazabilidad QA conceptual y Safety Boundary. No constituye release productiva, forecast oficial, reporte regulatorio ni evidencia operacional.',
    '',
    'Evidence Freeze Boundary:',
    evidencePack.evidenceFreezeBoundary,
  ].join('\n');

const buildInternalEvidenceReview = (
  evidencePack: PVMetricsControlledClientDemoEvidenceFreezePack,
) =>
  [
    'ORBI PVMetrics IA — Revisión técnica interna de Client Demo Evidence Freeze',
    `Pack ID: ${evidencePack.packId}`,
    `Generated: ${evidencePack.generatedAtLabel}`,
    `Version: ${evidencePack.internalVersion}`,
    `Status: ${evidencePack.status}`,
    `Roadmap Block: ${evidencePack.roadmapBlock}`,
    '',
    'Allowed Demo Evidence Items:',
    list(
      evidencePack.allowedDemoEvidenceItems,
      (item) =>
        `${item.label} | Mode: ${item.evidenceMode} | Approval: ${
          item.requiresApproval ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Demo Evidence Items:',
    list(
      evidencePack.blockedDemoEvidenceItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Demo Evidence Review Gates:',
    list(
      evidencePack.demoEvidenceReviewGates,
      (gate) =>
        `${gate.label} | Required: ${gate.required ? 'yes' : 'no'} | ${
          gate.description
        }`,
    ),
    '',
    'Demo Evidence Safety Gates:',
    list(
      evidencePack.demoEvidenceSafetyGates,
      (gate) =>
        `${gate.label} | Required: ${gate.required ? 'yes' : 'no'} | ${
          gate.description
        }`,
    ),
    '',
    'Demo Evidence Approval Roles:',
    list(
      evidencePack.demoEvidenceApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Demo Evidence Risk Register:',
    list(
      evidencePack.demoEvidenceRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Demo Evidence Exit Criteria:',
    list(
      evidencePack.demoEvidenceExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label}: ${
          criterion.description
        }`,
    ),
    '',
    'Evidence Freeze Boundary:',
    evidencePack.evidenceFreezeBoundary,
    '',
    `Next Recommended Module: ${evidencePack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsClientDemoEvidenceFreezeExportTextBox = ({
  evidencePack = PV_METRICS_CONTROLLED_CLIENT_DEMO_EVIDENCE_FREEZE_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-report' | 'internal-review' | null
  >(null);

  const executiveReport = useMemo(
    () => buildExecutiveEvidenceReport(evidencePack),
    [evidencePack],
  );

  const internalReview = useMemo(
    () => buildInternalEvidenceReview(evidencePack),
    [evidencePack],
  );

  const handleCopy = async (
    target: 'executive-report' | 'internal-review',
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
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-5 shadow-2xl animate-fade-in">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          CLIENT DEMO EVIDENCE EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local de evidencia demo controlada
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para documentar readiness, narrativa,
          gates, aprobaciones, riesgos y límites antes de presentar la demo.
          No genera archivos reales, no usa datos reales y no ejecuta acciones
          externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Executive Report
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Resumen ejecutivo
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('executive-report', executiveReport)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10 transition-colors"
            >
              {copiedTarget === 'executive-report' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={executiveReport}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300 focus:outline-none focus:border-cyan-400/50"
          />
        </article>

        <article className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                Internal Review
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte técnico interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal-review', internalReview)}
              className="rounded-xl border border-amber-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-100 hover:bg-amber-400/10 transition-colors"
            >
              {copiedTarget === 'internal-review' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReview}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300 focus:outline-none focus:border-amber-400/50"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Evidence Freeze Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No crea PDF real, ZIP real,
          APK real ni release productiva. No incorpora datos reales, no crea
          conectores reales, no usa credenciales, tokens, secrets, API keys ni
          passwords, no lee SCADA, no lee medidores, no llama APIs reales, no
          envía CEN, no usa backend, base de datos, localStorage,
          POST/PUT/PATCH/DELETE real, telecontrol, setpoints, comandos
          BESS/inversores, SCADA ACK, forecast oficial ni reporte regulatorio.
        </p>
      </div>
    </section>
  );
};
