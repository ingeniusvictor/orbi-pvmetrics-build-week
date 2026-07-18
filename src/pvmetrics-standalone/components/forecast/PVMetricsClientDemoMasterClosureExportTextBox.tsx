import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_MASTER_CLOSURE_PACK_MOCK } from '../../data/pvMetricsClientDemoMasterClosureMockData';
import { PVMetricsControlledClientDemoMasterClosurePack } from '../../types/pvmetrics-client-demo-master-closure.types';

type Props = {
  masterClosurePack?: PVMetricsControlledClientDemoMasterClosurePack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveMasterClosureSummary = (
  masterClosurePack: PVMetricsControlledClientDemoMasterClosurePack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de Client Demo Master Closure',
    '',
    'Declaración obligatoria:',
    'Este resumen es local, conceptual, review-only, demo-only, read-only y no productivo. No convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea PowerPoint real, no crea PDF real, no crea ZIP real, no crea APK real, no crea instalador real, no crea ejecutable real, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos, no usa WebRTC, no usa Socket.IO, no usa SDP y no habilita telecontrol.',
    '',
    `Versión: ${masterClosurePack.internalVersion}`,
    `Estado: ${masterClosurePack.status}`,
    `Bloque: ${masterClosurePack.roadmapBlock}`,
    `Generado: ${masterClosurePack.generatedAtLabel}`,
    '',
    'Propósito del Master Closure:',
    list(masterClosurePack.masterClosurePurpose, (item) => item),
    '',
    'Bloques cerrados consolidados:',
    list(
      masterClosurePack.completedDemoClosureBlocks,
      (block) =>
        `${block.label} | Status: ${block.closureStatus} | ${block.description}`,
    ),
    '',
    'Dominios del cierre maestro:',
    list(
      masterClosurePack.masterClosureDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.closureMode} | ${domain.description}`,
    ),
    '',
    'Gates del cierre maestro:',
    list(
      masterClosurePack.masterClosureGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Roles de revisión conceptual:',
    list(
      masterClosurePack.masterClosureApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Postura final:',
    'El cierre maestro confirma que ORBI PVMetrics IA permanece como demo local, mock, read-only, demo-only, no productiva y sin acciones externas reales.',
    '',
    'Cierre ejecutivo:',
    'Este Master Closure no representa aprobación de cliente, comité real, release real, piloto real, producción real, contrato real ni decisión legal. Cualquier siguiente paso debe ser manual, humano, externo a la app y definido en un alcance separado.',
    '',
    'Master Closure Boundary:',
    masterClosurePack.masterClosureBoundary,
  ].join('\n');

const buildInternalMasterClosureReport = (
  masterClosurePack: PVMetricsControlledClientDemoMasterClosurePack,
) =>
  [
    'ORBI PVMetrics IA — Reporte técnico interno de Client Demo Master Closure',
    `Pack ID: ${masterClosurePack.packId}`,
    `Generated: ${masterClosurePack.generatedAtLabel}`,
    `Version: ${masterClosurePack.internalVersion}`,
    `Status: ${masterClosurePack.status}`,
    `Roadmap Block: ${masterClosurePack.roadmapBlock}`,
    '',
    'Master Closure Purpose:',
    list(masterClosurePack.masterClosurePurpose, (item) => item),
    '',
    'Completed Demo Closure Blocks:',
    list(
      masterClosurePack.completedDemoClosureBlocks,
      (block) =>
        `${block.label} | Status: ${block.closureStatus} | ${block.description}`,
    ),
    '',
    'Allowed Master Closure Items:',
    list(
      masterClosurePack.allowedMasterClosureItems,
      (item) =>
        `${item.label} | Mode: ${item.closureMode} | Human review: ${
          item.requiresHumanReview ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Master Closure Items:',
    list(
      masterClosurePack.blockedMasterClosureItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Master Closure Principles:',
    list(
      masterClosurePack.masterClosurePrinciples,
      (principle) =>
        `${principle.label} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        } | ${principle.description}`,
    ),
    '',
    'Master Closure Domains:',
    list(
      masterClosurePack.masterClosureDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.closureMode} | ${domain.description}`,
    ),
    '',
    'Master Closure Gates:',
    list(
      masterClosurePack.masterClosureGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Master Closure Approval Roles:',
    list(
      masterClosurePack.masterClosureApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Master Closure Risk Register:',
    list(
      masterClosurePack.masterClosureRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Master Closure Exit Criteria:',
    list(
      masterClosurePack.masterClosureExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label} | Required: ${
          criterion.required ? 'yes' : 'no'
        } | ${criterion.description}`,
    ),
    '',
    'Master Closure Boundary:',
    masterClosurePack.masterClosureBoundary,
    '',
    `Next Recommended Module: ${masterClosurePack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsClientDemoMasterClosureExportTextBox = ({
  masterClosurePack = PV_METRICS_CONTROLLED_CLIENT_DEMO_MASTER_CLOSURE_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-summary' | 'internal-report' | null
  >(null);

  const executiveSummary = useMemo(
    () => buildExecutiveMasterClosureSummary(masterClosurePack),
    [masterClosurePack],
  );

  const internalReport = useMemo(
    () => buildInternalMasterClosureReport(masterClosurePack),
    [masterClosurePack],
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
          CLIENT DEMO MASTER CLOSURE EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local del cierre maestro conceptual
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para copiar un resumen ejecutivo y un
          reporte técnico interno del cierre maestro conceptual. No crea PDF,
          no aprueba release real, no crea comité real, no crea acta legal real
          y no ejecuta acciones externas reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Executive Master Closure
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
                Internal Master Closure Report
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Reporte técnico interno
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
          Master Closure Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No convierte la demo en
          release real, no aprueba producción, no aprueba piloto real, no crea
          comité real, no crea acta legal real, no crea contrato real, no crea
          PowerPoint real, PDF real, ZIP real, APK real, instalador real,
          ejecutable real ni release productiva. No graba video real, no crea
          audio real, voz real ni avatar real. No usa WebRTC, Socket.IO ni SDP.
          No envía emails reales, no crea reuniones reales, links reales ni
          invitaciones reales. No incorpora datos reales, conectores reales,
          credenciales, tokens, secrets, API keys ni passwords. No lee SCADA,
          medidores, CEN ni APIs reales. No usa backend, base de datos,
          localStorage, POST/PUT/PATCH/DELETE real, telecontrol, setpoints,
          comandos BESS/inversores, SCADA ACK, forecast oficial ni reporte
          regulatorio.
        </p>
      </div>
    </section>
  );
};
