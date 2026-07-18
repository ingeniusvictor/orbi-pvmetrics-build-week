import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK } from '../../data/pvMetricsControlledDemoSessionMockData';
import { PVMetricsControlledClientDemoSessionRunbookPack } from '../../types/pvmetrics-controlled-demo-session.types';

type Props = {
  runbookPack?: PVMetricsControlledClientDemoSessionRunbookPack;
};

const buildClientSafeDemoScript = (
  runbookPack: PVMetricsControlledClientDemoSessionRunbookPack,
) =>
  [
    'ORBI PVMetrics IA — Guion seguro de demo cliente',
    '',
    'Declaración inicial obligatoria:',
    'Esta demo es local, mock, read-only y no productiva. No está conectada a SCADA, medidores, CEN, backend, APIs ni sistemas reales.',
    '',
    'Propósito de la sesión:',
    runbookPack.demoSessionPurpose.map((item) => `- ${item}`).join('\n'),
    '',
    'Fases sugeridas:',
    runbookPack.demoSessionPhases
      .map(
        (phase) =>
          `- Fase ${phase.order}: ${phase.label} | Objetivo: ${phase.objective}`,
      )
      .join('\n'),
    '',
    'Guion de demo:',
    runbookPack.liveDemoScript
      .map(
        (line) =>
          `- [${line.speakerRole}] ${line.script}${
            line.safetyNote ? ` | Nota: ${line.safetyNote}` : ''
          }`,
      )
      .join('\n'),
    '',
    'Declaraciones seguras para cliente:',
    runbookPack.clientSafeStatements
      .map((statement) => `- ${statement.statement}`)
      .join('\n'),
    '',
    'Acciones prohibidas durante la demo:',
    runbookPack.forbiddenDemoActions
      .map(
        (action) =>
          `- ${action.forbiddenAction} | Alternativa segura: ${action.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Cierre recomendado:',
    'Cualquier piloto con datos reales requiere alcance aprobado, contrato read-only, sanitización, QA y revisión humana previa.',
    '',
    'Safety Boundary:',
    runbookPack.safetyBoundary,
  ].join('\n');

const buildInternalRunbookReport = (
  runbookPack: PVMetricsControlledClientDemoSessionRunbookPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte interno de Controlled Client Demo Session Runbook',
    `Pack ID: ${runbookPack.packId}`,
    `Generated: ${runbookPack.generatedAtLabel}`,
    `Version: ${runbookPack.internalVersion}`,
    `Status: ${runbookPack.status}`,
    `Roadmap Block: ${runbookPack.roadmapBlock}`,
    '',
    'Roles:',
    runbookPack.demoSessionRoles
      .map((role) => `- ${role.label} (${role.roleId}): ${role.responsibility}`)
      .join('\n'),
    '',
    'Pre-Demo Checklist:',
    runbookPack.preDemoChecklist
      .map(
        (item) =>
          `- ${item.label} | Status: ${item.status} | Required: ${
            item.required ? 'yes' : 'no'
          }${item.command ? ` | Command: ${item.command}` : ''}`,
      )
      .join('\n'),
    '',
    'Pause / Stop Criteria:',
    runbookPack.pauseStopCriteria
      .map(
        (item) =>
          `- ${item.label} | Severity: ${item.severity} | Trigger: ${item.trigger} | Action: ${item.action}`,
      )
      .join('\n'),
    '',
    'Question Handling Rules:',
    runbookPack.questionHandlingRules
      .map(
        (rule) =>
          `- ${rule.label}: ${rule.rule}${
            rule.escalationRole ? ` | Escalation: ${rule.escalationRole}` : ''
          }`,
      )
      .join('\n'),
    '',
    'Evidence Capture Boundaries:',
    runbookPack.evidenceCaptureBoundaries
      .map(
        (boundary) =>
          `- ${boundary.label} | Allowed: ${
            boundary.allowed ? 'yes' : 'no'
          } | ${boundary.description} | Safety: ${boundary.safetyNote}`,
      )
      .join('\n'),
    '',
    'Post-Demo Follow-Up Rules:',
    runbookPack.postDemoFollowUpRules
      .map(
        (rule) =>
          `- ${rule.label}: ${rule.rule} | Human Review: ${
            rule.requiresHumanReview ? 'yes' : 'no'
          }`,
      )
      .join('\n'),
    '',
    'Human Approval Gates:',
    runbookPack.humanApprovalGates
      .map(
        (gate) =>
          `- ${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Session Risks:',
    runbookPack.sessionRisks
      .map(
        (risk) =>
          `- ${risk.label} | Severity: ${risk.severity} | Owner: ${risk.ownerRole} | Mitigation: ${risk.mitigation}`,
      )
      .join('\n'),
    '',
    'Session Exit Criteria:',
    runbookPack.sessionExitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    runbookPack.safetyBoundary,
    '',
    `Next Recommended Module: ${runbookPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsDemoSessionScriptExportTextBox = ({
  runbookPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_SESSION_RUNBOOK_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<'client' | 'internal' | null>(
    null,
  );

  const clientScriptText = useMemo(
    () => buildClientSafeDemoScript(runbookPack),
    [runbookPack],
  );

  const internalReportText = useMemo(
    () => buildInternalRunbookReport(runbookPack),
    [runbookPack],
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
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          DEMO SESSION EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Guion y reporte interno copiables
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para conducir una demo cliente segura y
          registrar internamente límites, riesgos, criterios de parada y reglas
          de seguimiento. No genera archivos reales ni ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Client Safe Script
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Guion seguro cliente
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('client', clientScriptText)}
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'client' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientScriptText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal Runbook Report
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal', internalReportText)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'internal' ? 'Copiado' : 'Copiar'}
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
          Este export es solo texto local copiable. No agenda reuniones, no
          graba sesiones, no genera ZIP, APK, PDF, firma digital real, correos,
          backend, APIs, localStorage, conectores reales, SCADA, lectura de
          medidores, CEN, telecontrol, setpoints ni comandos BESS/inversores.
        </p>
      </div>
    </section>
  );
};
