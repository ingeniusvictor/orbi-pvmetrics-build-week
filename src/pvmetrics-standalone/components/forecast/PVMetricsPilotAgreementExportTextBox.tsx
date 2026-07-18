import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK } from '../../data/pvMetricsControlledPilotScopeMockData';
import { PVMetricsControlledPilotScopeAgreementPack } from '../../types/pvmetrics-controlled-pilot-scope.types';

type Props = {
  agreementPack?: PVMetricsControlledPilotScopeAgreementPack;
};

const buildClientPilotAgreementText = (
  agreementPack: PVMetricsControlledPilotScopeAgreementPack,
) =>
  [
    'ORBI PVMetrics IA — Acuerdo conceptual de piloto read-only',
    '',
    'Declaración obligatoria:',
    'Este acuerdo es conceptual, local, mock, read-only y no productivo. No crea conectores reales, no usa credenciales, no lee SCADA, no lee medidores, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    'Propósito del alcance piloto:',
    agreementPack.pilotScopePurpose.map((item) => `- ${item}`).join('\n'),
    '',
    'Elementos permitidos en el alcance conceptual:',
    agreementPack.allowedPilotScopeItems
      .map((item) => `- ${item.label}: ${item.description}`)
      .join('\n'),
    '',
    'Elementos bloqueados:',
    agreementPack.blockedPilotScopeItems
      .map(
        (item) =>
          `- ${item.label}: ${item.reason} | Alternativa segura: ${item.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Principios read-only:',
    agreementPack.readOnlyIntegrationPrinciples
      .map(
        (principle) =>
          `- ${principle.label}: ${principle.description} | Mandatory: ${
            principle.mandatory ? 'yes' : 'no'
          }`,
      )
      .join('\n'),
    '',
    'Límites de acceso a datos:',
    agreementPack.dataAccessBoundaries
      .map(
        (boundary) =>
          `- ${boundary.label} | Allowed: ${
            boundary.allowed ? 'yes' : 'no'
          } | ${boundary.description}`,
      )
      .join('\n'),
    '',
    'Gates de aprobación cliente:',
    agreementPack.clientApprovalGates
      .map(
        (gate) =>
          `- ${gate.label}: ${gate.description} | Required: ${
            gate.required ? 'yes' : 'no'
          }`,
      )
      .join('\n'),
    '',
    'Notas legales/comerciales:',
    agreementPack.legalCommercialReviewNotes
      .map((note) => `- ${note.label}: ${note.note}`)
      .join('\n'),
    '',
    'Cierre seguro:',
    'Cualquier avance a piloto real requiere aprobación humana, alcance escrito, datos sanitizados, contrato read-only y revisión técnica/QA/comercial/legal separada.',
    '',
    'Safety Boundary:',
    agreementPack.safetyBoundary,
  ].join('\n');

const buildInternalPilotReviewReport = (
  agreementPack: PVMetricsControlledPilotScopeAgreementPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte interno de Pilot Scope & Read-Only Agreement',
    `Pack ID: ${agreementPack.packId}`,
    `Generated: ${agreementPack.generatedAtLabel}`,
    `Version: ${agreementPack.internalVersion}`,
    `Status: ${agreementPack.status}`,
    `Roadmap Block: ${agreementPack.roadmapBlock}`,
    '',
    'Technical Approval Gates:',
    agreementPack.technicalApprovalGates
      .map(
        (gate) =>
          `- ${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'QA Approval Gates:',
    agreementPack.qaApprovalGates
      .map(
        (gate) =>
          `- ${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Pilot Risk Register:',
    agreementPack.pilotRiskRegister
      .map(
        (risk) =>
          `- ${risk.label} | Severity: ${risk.severity} | Owner: ${risk.ownerRole} | Mitigation: ${risk.mitigation}`,
      )
      .join('\n'),
    '',
    'Pilot Exit Criteria:',
    agreementPack.pilotExitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Blocked Scope Items:',
    agreementPack.blockedPilotScopeItems
      .map(
        (item) =>
          `- ${item.label} | Severity: ${item.severity} | Reason: ${item.reason}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    agreementPack.safetyBoundary,
    '',
    `Next Recommended Module: ${agreementPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsPilotAgreementExportTextBox = ({
  agreementPack = PV_METRICS_CONTROLLED_PILOT_SCOPE_AGREEMENT_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'client-agreement' | 'internal-review' | null
  >(null);

  const clientAgreementText = useMemo(
    () => buildClientPilotAgreementText(agreementPack),
    [agreementPack],
  );

  const internalReviewText = useMemo(
    () => buildInternalPilotReviewReport(agreementPack),
    [agreementPack],
  );

  const handleCopy = async (
    target: 'client-agreement' | 'internal-review',
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
    <section className="rounded-3xl border border-blue-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
          PILOT AGREEMENT EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Acuerdo piloto read-only copiable
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para presentar alcance conceptual de piloto
          read-only y revisar internamente gates, riesgos y límites. No genera
          archivos reales ni ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-blue-400/20 bg-blue-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                Client Read-Only Agreement
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Acuerdo conceptual cliente
              </h4>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy('client-agreement', clientAgreementText)
              }
              className="rounded-xl border border-blue-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 hover:bg-blue-400/10"
            >
              {copiedTarget === 'client-agreement' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientAgreementText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal Pilot Review
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte interno
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
          no envía CEN, no usa backend, APIs, base de datos, localStorage,
          POST/PUT/PATCH/DELETE real, telecontrol, setpoints ni comandos
          BESS/inversores.
        </p>
      </div>
    </section>
  );
};
