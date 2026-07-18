import { useMemo, useState } from 'react';
import { PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK } from '../../data/pvMetricsReleaseCandidateMockData';
import { PVMetricsStandaloneClientDemoReleaseCandidatePack } from '../../types/pvmetrics-release-candidate.types';

type PVMetricsReleaseCandidateChecklistExportTextBoxProps = {
  releasePack?: PVMetricsStandaloneClientDemoReleaseCandidatePack;
};

const buildClientReleaseCandidateSummary = (
  releasePack: PVMetricsStandaloneClientDemoReleaseCandidatePack,
) =>
  [
    'ORBI PVMetrics IA — Resumen cliente de Release Candidate Demo',
    '',
    'Contexto:',
    'ORBI PVMetrics IA se presenta como una demo independiente, local, mock, read-only y segura para revisión interna y conversación controlada con cliente piloto.',
    '',
    'Alcance incluido:',
    releasePack.releaseCandidateScope
      .filter((scope) => scope.included)
      .map((scope) => `- ${scope.label}: ${scope.description}`)
      .join('\n'),
    '',
    'Capacidades demostrables permitidas:',
    releasePack.allowedDemoCapabilities
      .filter((capability) => capability.clientVisible)
      .map(
        (capability) =>
          `- ${capability.label}: ${capability.description} | Seguridad: ${capability.safetyNote}`,
      )
      .join('\n'),
    '',
    'Readiness cliente:',
    releasePack.clientDemoReadinessChecklist
      .map(
        (item) =>
          `- ${item.label}: ${item.description} [estado=${item.status}]`,
      )
      .join('\n'),
    '',
    'Claims que NO deben hacerse:',
    releasePack.blockedProductionClaims
      .map(
        (claim) =>
          `- No afirmar: "${claim.forbiddenClaim}" | Alternativa segura: ${claim.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Límites del paquete demo:',
    releasePack.demoPackageBoundaries
      .map((boundary) => `- ${boundary.label}: ${boundary.description}`)
      .join('\n'),
    '',
    'Revisión humana requerida:',
    releasePack.humanReviewGates
      .map(
        (gate) =>
          `- ${gate.label}: ${gate.description} [responsable=${gate.reviewerRole}]`,
      )
      .join('\n'),
    '',
    'Declaración de seguridad:',
    releasePack.safetyBoundary,
    '',
    'Este resumen es texto local copiable. No genera ZIP, APK, PDF, correos, backend, APIs, localStorage ni conectores reales.',
  ].join('\n');

const buildInternalReleaseCandidateReport = (
  releasePack: PVMetricsStandaloneClientDemoReleaseCandidatePack,
) =>
  [
    'ORBI PVMetrics IA — Reporte interno de Release Candidate',
    `Pack ID: ${releasePack.packId}`,
    `Generated: ${releasePack.generatedAtLabel}`,
    `Version: ${releasePack.internalVersion}`,
    `Status: ${releasePack.status}`,
    `Roadmap Block: ${releasePack.roadmapBlock}`,
    '',
    'Release Candidate Scope:',
    releasePack.releaseCandidateScope
      .map(
        (scope) =>
          [
            `- ${scope.label}`,
            `  Included: ${scope.included ? 'yes' : 'no'}`,
            `  Description: ${scope.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Demo Package Boundaries:',
    releasePack.demoPackageBoundaries
      .map(
        (boundary) =>
          [
            `- ${boundary.label}`,
            `  Blocked: ${boundary.blocked ? 'yes' : 'no'}`,
            `  Description: ${boundary.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Client Demo Readiness Checklist:',
    releasePack.clientDemoReadinessChecklist
      .map(
        (item) =>
          [
            `- ${item.label}`,
            `  Status: ${item.status}`,
            `  Description: ${item.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Technical Readiness Checklist:',
    releasePack.technicalReadinessChecklist
      .map(
        (item) =>
          [
            `- ${item.label}`,
            `  Status: ${item.status}`,
            item.command ? `  Command: ${item.command}` : '  Command: N/A',
            `  Description: ${item.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Safety Readiness Checklist:',
    releasePack.safetyReadinessChecklist
      .map(
        (item) =>
          [
            `- ${item.label}`,
            `  Status: ${item.status}`,
            `  Description: ${item.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Build & TypeScript Requirements:',
    releasePack.buildAndTypescriptRequirements
      .map(
        (requirement) =>
          [
            `- ${requirement.label}`,
            `  Required: ${requirement.required ? 'yes' : 'no'}`,
            requirement.command
              ? `  Command: ${requirement.command}`
              : '  Command: N/A',
            `  Description: ${requirement.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Allowed Demo Capabilities:',
    releasePack.allowedDemoCapabilities
      .map(
        (capability) =>
          [
            `- ${capability.label}`,
            `  Client Visible: ${capability.clientVisible ? 'yes' : 'no'}`,
            `  Description: ${capability.description}`,
            `  Safety Note: ${capability.safetyNote}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Blocked Production Claims:',
    releasePack.blockedProductionClaims
      .map(
        (claim) =>
          [
            `- ${claim.claimId}`,
            `  Severity: ${claim.severity}`,
            `  Forbidden: ${claim.forbiddenClaim}`,
            `  Safe Alternative: ${claim.safeAlternative}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Release Candidate Risks:',
    releasePack.releaseCandidateRisks
      .map(
        (risk) =>
          [
            `- ${risk.label}`,
            `  Severity: ${risk.severity}`,
            `  Owner: ${risk.ownerRole}`,
            `  Mitigation: ${risk.mitigation}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Human Review Gates:',
    releasePack.humanReviewGates
      .map(
        (gate) =>
          [
            `- ${gate.label}`,
            `  Required: ${gate.required ? 'yes' : 'no'}`,
            `  Reviewer Role: ${gate.reviewerRole}`,
            `  Description: ${gate.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Exit Criteria:',
    releasePack.exitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    releasePack.safetyBoundary,
    '',
    `Next Recommended Module: ${releasePack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsReleaseCandidateChecklistExportTextBox = ({
  releasePack = PV_METRICS_STANDALONE_CLIENT_DEMO_RELEASE_CANDIDATE_PACK_MOCK,
}: PVMetricsReleaseCandidateChecklistExportTextBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'client' | 'internal' | null>(
    null,
  );

  const clientText = useMemo(
    () => buildClientReleaseCandidateSummary(releasePack),
    [releasePack],
  );

  const internalText = useMemo(
    () => buildInternalReleaseCandidateReport(releasePack),
    [releasePack],
  );

  const handleCopy = async (target: 'client' | 'internal', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          RELEASE CANDIDATE CHECKLIST EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Textos copiables del Release Candidate
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para resumen cliente e informe interno de
          readiness. No genera ZIP, APK, PDF, correo, backend, API, localStorage
          ni conectores reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Client / Release Candidate Summary
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Resumen cliente
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('client', clientText)}
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal / Release Candidate Report
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte interno
              </h4>
            </div>

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
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No crea ZIP, APK, PDF, no
          envía correos, no usa backend, no llama APIs, no usa localStorage, no
          conecta SCADA, no lee medidores, no usa weather APIs, no envía CEN, no
          usa credenciales/tokens/secrets, no ejecuta POST/PUT/PATCH/DELETE real,
          no habilita telecontrol, no modifica setpoints, no controla BESS y no
          controla inversores.
        </p>
      </div>
    </section>
  );
};
