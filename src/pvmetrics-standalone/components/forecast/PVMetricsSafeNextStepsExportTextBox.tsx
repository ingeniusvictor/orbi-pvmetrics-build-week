import { useMemo, useState } from 'react';
import { PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK } from '../../data/pvMetricsClientPilotHandoffMockData';
import { PVMetricsClientPilotHandoffPack } from '../../types/pvmetrics-client-pilot-handoff.types';

type PVMetricsSafeNextStepsExportTextBoxProps = {
  handoffPack?: PVMetricsClientPilotHandoffPack;
};

const buildClientNextStepsText = (
  handoffPack: PVMetricsClientPilotHandoffPack,
) =>
  [
    'ORBI PVMetrics IA — Resumen cliente de próximos pasos seguros',
    '',
    'Contexto:',
    'ORBI PVMetrics IA se presenta como una demo local, mock, read-only y segura para evaluar valor, flujo de trabajo y condiciones de un piloto futuro.',
    '',
    'Qué se puede revisar en esta etapa:',
    handoffPack.allowedPilotMaterials
      .filter((material) => material.clientVisible)
      .map((material) => `- ${material.label}: ${material.description}`)
      .join('\n'),
    '',
    'Límites importantes:',
    handoffPack.blockedPilotClaims
      .map(
        (claim) =>
          `- No afirmar: "${claim.forbiddenClaim}" | Alternativa segura: ${claim.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Condiciones mínimas antes de un piloto real:',
    handoffPack.pilotReadinessConditions
      .map(
        (condition) =>
          `- ${condition.label}: ${condition.description} [estado=${condition.status}]`,
      )
      .join('\n'),
    '',
    'Próximos pasos seguros:',
    handoffPack.safeNextSteps
      .map(
        (step) =>
          `${step.order}. ${step.label}: ${step.description} [allowed=${
            step.allowed ? 'yes' : 'no'
          }, humanReview=${step.requiresHumanReview ? 'yes' : 'no'}]`,
      )
      .join('\n'),
    '',
    'Declaración de seguridad:',
    handoffPack.safetyBoundary,
    '',
    'Este resumen es texto local copiable. No genera PDF, no envía correos, no usa backend, no llama APIs y no conecta sistemas reales.',
  ].join('\n');

const buildInternalHandoffText = (
  handoffPack: PVMetricsClientPilotHandoffPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte interno de handoff piloto',
    `Pack ID: ${handoffPack.packId}`,
    `Generated: ${handoffPack.generatedAtLabel}`,
    `Version: ${handoffPack.internalVersion}`,
    `Status: ${handoffPack.status}`,
    '',
    'Client Handoff Sections:',
    handoffPack.handoffSections
      .map(
        (section) =>
          [
            `- ${section.label}`,
            `  Required: ${section.required ? 'yes' : 'no'}`,
            `  Audiences: ${section.audienceTypes.join(', ')}`,
            `  Objective: ${section.objective}`,
            `  Client Message: ${section.clientMessage}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Blocked Pilot Claims:',
    handoffPack.blockedPilotClaims
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
    'Pilot Readiness Conditions:',
    handoffPack.pilotReadinessConditions
      .map(
        (condition) =>
          [
            `- ${condition.label}`,
            `  Status: ${condition.status}`,
            `  Required: ${condition.required ? 'yes' : 'no'}`,
            `  Description: ${condition.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Human Review Requirements:',
    handoffPack.humanReviewRequirements
      .map(
        (requirement) =>
          [
            `- ${requirement.label}`,
            `  Reviewer Role: ${requirement.reviewerRole}`,
            `  Required Before: ${requirement.requiredBefore}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Read-Only Future Integration Conditions:',
    handoffPack.readOnlyFutureIntegrationConditions
      .map(
        (condition) =>
          [
            `- ${condition.label}`,
            `  Required: ${condition.required ? 'yes' : 'no'}`,
            `  Forbidden if missing: ${
              condition.forbiddenIfMissing ? 'yes' : 'no'
            }`,
            `  Description: ${condition.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Pilot Risk Register:',
    handoffPack.pilotRiskRegister
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
    'Decision Gates:',
    handoffPack.decisionGates
      .map(
        (gate) =>
          [
            `- ${gate.label}`,
            `  Status: ${gate.status}`,
            `  Description: ${gate.description}`,
            `  Next Action: ${gate.nextAction}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Safe Next Steps:',
    handoffPack.safeNextSteps
      .map(
        (step) =>
          [
            `${step.order}. ${step.label}`,
            `   Allowed: ${step.allowed ? 'yes' : 'no'}`,
            `   Human Review: ${step.requiresHumanReview ? 'yes' : 'no'}`,
            `   Description: ${step.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Exit Criteria:',
    handoffPack.exitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    handoffPack.safetyBoundary,
  ].join('\n');

export const PVMetricsSafeNextStepsExportTextBox = ({
  handoffPack = PV_METRICS_CLIENT_PILOT_HANDOFF_PACK_MOCK,
}: PVMetricsSafeNextStepsExportTextBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'client' | 'internal' | null>(
    null,
  );

  const clientText = useMemo(
    () => buildClientNextStepsText(handoffPack),
    [handoffPack],
  );

  const internalText = useMemo(
    () => buildInternalHandoffText(handoffPack),
    [handoffPack],
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
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          SAFE NEXT STEPS EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Textos copiables para próximos pasos seguros
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para preparar conversación cliente e
          informe interno de handoff piloto. No genera PDF, no envía correos, no
          usa backend, no llama APIs y no conecta sistemas reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Client / Safe Summary
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
                Internal / Pilot Handoff
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
          Este export es solo texto local copiable. No crea PDF real, no envía
          correos, no usa backend, no llama APIs, no usa localStorage, no conecta
          SCADA, no lee medidores, no usa weather APIs, no envía CEN, no usa
          credenciales/tokens/secrets, no ejecuta POST/PUT/PATCH/DELETE real, no
          habilita telecontrol, no modifica setpoints, no controla BESS y no
          controla inversores.
        </p>
      </div>
    </section>
  );
};
