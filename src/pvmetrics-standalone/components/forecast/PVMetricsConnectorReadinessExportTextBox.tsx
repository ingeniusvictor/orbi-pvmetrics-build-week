import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_READ_ONLY_CONNECTOR_READINESS_PACK_MOCK } from '../../data/pvMetricsReadOnlyConnectorReadinessMockData';
import { PVMetricsControlledReadOnlyConnectorReadinessPack } from '../../types/pvmetrics-read-only-connector-readiness.types';

type Props = {
  readinessPack?: PVMetricsControlledReadOnlyConnectorReadinessPack;
};

const buildExecutiveConnectorReadinessReport = (
  readinessPack: PVMetricsControlledReadOnlyConnectorReadinessPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte ejecutivo de Read-Only Connector Readiness',
    '',
    'Declaración obligatoria:',
    'Este reporte es conceptual, local, mock, read-only y no productivo. No crea conectores reales, no usa credenciales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${readinessPack.internalVersion}`,
    `Estado: ${readinessPack.status}`,
    `Bloque: ${readinessPack.roadmapBlock}`,
    `Generado: ${readinessPack.generatedAtLabel}`,
    '',
    'Propósito de readiness:',
    readinessPack.connectorReadinessPurpose.map((item) => `- ${item}`).join('\n'),
    '',
    'Elementos permitidos para readiness:',
    readinessPack.allowedConnectorReadinessItems
      .map(
        (item) =>
          `- ${item.label}: ${item.description} | Revisión humana: ${
            item.requiresHumanReview ? 'yes' : 'no'
          }`,
      )
      .join('\n'),
    '',
    'Elementos bloqueados:',
    readinessPack.blockedConnectorReadinessItems
      .map(
        (item) =>
          `- ${item.label}: ${item.reason} | Severidad: ${item.severity} | Alternativa segura: ${item.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Principios read-only:',
    readinessPack.readOnlyConnectorPrinciples
      .map(
        (principle) =>
          `- ${principle.label}: ${principle.description} | Mandatory: ${
            principle.mandatory ? 'yes' : 'no'
          }`,
      )
      .join('\n'),
    '',
    'Categorías candidatas conceptuales:',
    readinessPack.connectorCandidateCategories
      .map(
        (category) =>
          `- ${category.label} | Estado: ${category.status} | ${category.description}`,
      )
      .join('\n'),
    '',
    'Cierre ejecutivo:',
    'Cualquier avance hacia conectores reales requiere contrato de datos, sandbox aislado, QA de seguridad, aprobación humana y revisión separada. Este módulo no habilita integración real.',
    '',
    'Safety Boundary:',
    readinessPack.safetyBoundary,
  ].join('\n');

const buildInternalConnectorReadinessReview = (
  readinessPack: PVMetricsControlledReadOnlyConnectorReadinessPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte técnico interno de Connector Readiness',
    `Pack ID: ${readinessPack.packId}`,
    `Generated: ${readinessPack.generatedAtLabel}`,
    `Version: ${readinessPack.internalVersion}`,
    `Status: ${readinessPack.status}`,
    `Roadmap Block: ${readinessPack.roadmapBlock}`,
    '',
    'Credential & Secret Boundaries:',
    readinessPack.credentialSecretBoundaries
      .map(
        (boundary) =>
          `- ${boundary.label} | Allowed: ${
            boundary.allowed ? 'yes' : 'no'
          } | ${boundary.description}`,
      )
      .join('\n'),
    '',
    'Data Contract Review Gates:',
    readinessPack.dataContractReviewGates
      .map(
        (gate) =>
          `- ${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Sandbox Readiness Gates:',
    readinessPack.sandboxReadinessGates
      .map(
        (gate) =>
          `- ${gate.label} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'QA Connector Safety Gates:',
    readinessPack.qaConnectorSafetyGates
      .map(
        (gate) =>
          `- ${gate.label} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Connector Risk Register:',
    readinessPack.connectorRiskRegister
      .map(
        (risk) =>
          `- ${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
      )
      .join('\n'),
    '',
    'Connector Exit Criteria:',
    readinessPack.connectorExitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Blocked Connector Readiness Items:',
    readinessPack.blockedConnectorReadinessItems
      .map(
        (item) =>
          `- ${item.label} | Severity: ${item.severity} | Reason: ${item.reason}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    readinessPack.safetyBoundary,
    '',
    `Next Recommended Module: ${readinessPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsConnectorReadinessExportTextBox = ({
  readinessPack = PV_METRICS_CONTROLLED_READ_ONLY_CONNECTOR_READINESS_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-report' | 'internal-review' | null
  >(null);

  const executiveReportText = useMemo(
    () => buildExecutiveConnectorReadinessReport(readinessPack),
    [readinessPack],
  );

  const internalReviewText = useMemo(
    () => buildInternalConnectorReadinessReview(readinessPack),
    [readinessPack],
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
    <section className="rounded-3xl border border-sky-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
          CONNECTOR READINESS EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Read-only connector readiness copiable
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para documentar readiness conceptual de
          conectores read-only. No genera archivos reales, no llama APIs, no
          crea conectores y no ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-sky-400/20 bg-sky-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                Executive Connector Readiness
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte ejecutivo
              </h4>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy('executive-report', executiveReportText)
              }
              className="rounded-xl border border-sky-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-sky-100 hover:bg-sky-400/10"
            >
              {copiedTarget === 'executive-report' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={executiveReportText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal Connector Review
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte técnico interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy('internal-review', internalReviewText)
              }
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'internal-review' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReviewText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No crea conectores reales,
          no usa credenciales, tokens ni secrets, no lee SCADA, no lee medidores,
          no llama APIs reales, no envía CEN, no usa backend, base de datos,
          localStorage, POST/PUT/PATCH/DELETE real, telecontrol, setpoints ni
          comandos BESS/inversores.
        </p>
      </div>
    </section>
  );
};
