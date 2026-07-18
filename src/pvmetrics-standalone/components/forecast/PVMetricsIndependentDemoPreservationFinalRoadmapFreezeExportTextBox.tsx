import { useMemo, useState } from 'react';
import { PV_METRICS_INDEPENDENT_DEMO_PRESERVATION_FINAL_ROADMAP_FREEZE_PACK_MOCK } from '../../data/pvMetricsIndependentDemoPreservationFinalRoadmapFreezeMockData';
import { PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack } from '../../types/pvmetrics-independent-demo-preservation-final-roadmap-freeze.types';

type Props = {
  finalFreezePack?: PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveFinalFreezeSummary = (
  finalFreezePack: PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de Independent Demo Preservation & Final Roadmap Freeze',
    '',
    'Declaración obligatoria:',
    'Este resumen es local, conceptual, final-freeze-only, roadmap-preservation-only, read-only, demo-only y no productivo. No crea release real, no crea backup real, no crea ZIP real, no crea PDF real, no crea snapshot descargable real, no crea paquete final descargable, no crea release artifact, no sube archivos, no descarga archivos, no usa storage externo, no usa localStorage, no usa IndexedDB, no usa backend, no usa base de datos real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea PowerPoint real, no crea APK real, no crea instalador real, no crea ejecutable real, no usa WebRTC, no usa Socket.IO, no usa SDP, no usa ICE, no usa TURN, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN y no habilita telecontrol.',
    '',
    `Versión: ${finalFreezePack.internalVersion}`,
    `Estado: ${finalFreezePack.status}`,
    `Bloque: ${finalFreezePack.roadmapBlock}`,
    `Generado: ${finalFreezePack.generatedAtLabel}`,
    '',
    'Propósito de preservación final:',
    list(finalFreezePack.finalPreservationPurpose, (item) => item),
    '',
    'Bloques preservados conceptualmente:',
    list(
      finalFreezePack.preservedRoadmapBlocks,
      (block) =>
        `${block.label} | Status: ${block.freezeStatus} | ${block.description}`,
    ),
    '',
    'Dominios del freeze final:',
    list(
      finalFreezePack.finalFreezeDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.freezeMode} | ${domain.description}`,
    ),
    '',
    'Gates del freeze final:',
    list(
      finalFreezePack.finalFreezeGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Roles de revisión conceptual:',
    list(
      finalFreezePack.finalFreezeRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Postura final:',
    'El freeze final confirma que ORBI PVMetrics IA permanece como demo independiente local, mock, read-only, demo-only, no productiva, sin artefactos reales, sin release real y sin acciones externas.',
    '',
    'Cierre ejecutivo:',
    'Este Independent Demo Preservation & Final Roadmap Freeze no representa release real, backup real, paquete final real, aprobación de cliente, comité real, piloto real, producción real, contrato real ni decisión legal. Cualquier paso real posterior debe ser manual, humano, externo a la app y definido en un alcance separado.',
    '',
    'Final Freeze Boundary:',
    finalFreezePack.finalFreezeBoundary,
  ].join('\n');

const buildInternalFinalFreezeReport = (
  finalFreezePack: PVMetricsIndependentDemoPreservationFinalRoadmapFreezePack,
) =>
  [
    'ORBI PVMetrics IA — Reporte técnico interno de Independent Demo Preservation & Final Roadmap Freeze',
    `Pack ID: ${finalFreezePack.packId}`,
    `Generated: ${finalFreezePack.generatedAtLabel}`,
    `Version: ${finalFreezePack.internalVersion}`,
    `Status: ${finalFreezePack.status}`,
    `Roadmap Block: ${finalFreezePack.roadmapBlock}`,
    '',
    'Final Preservation Purpose:',
    list(finalFreezePack.finalPreservationPurpose, (item) => item),
    '',
    'Preserved Roadmap Blocks:',
    list(
      finalFreezePack.preservedRoadmapBlocks,
      (block) =>
        `${block.label} | Status: ${block.freezeStatus} | ${block.description}`,
    ),
    '',
    'Allowed Final Freeze Items:',
    list(
      finalFreezePack.allowedFinalFreezeItems,
      (item) =>
        `${item.label} | Mode: ${item.freezeMode} | Human review: ${
          item.requiresHumanReview ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Final Freeze Items:',
    list(
      finalFreezePack.blockedFinalFreezeItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Final Freeze Principles:',
    list(
      finalFreezePack.finalFreezePrinciples,
      (principle) =>
        `${principle.label} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        } | ${principle.description}`,
    ),
    '',
    'Final Freeze Domains:',
    list(
      finalFreezePack.finalFreezeDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.freezeMode} | ${domain.description}`,
    ),
    '',
    'Final Freeze Gates:',
    list(
      finalFreezePack.finalFreezeGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Final Freeze Roles:',
    list(
      finalFreezePack.finalFreezeRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Final Freeze Risk Register:',
    list(
      finalFreezePack.finalFreezeRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Final Freeze Exit Criteria:',
    list(
      finalFreezePack.finalFreezeExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label} | Required: ${
          criterion.required ? 'yes' : 'no'
        } | ${criterion.description}`,
    ),
    '',
    'Final Freeze Boundary:',
    finalFreezePack.finalFreezeBoundary,
    '',
    `Next Recommended Module: ${finalFreezePack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsIndependentDemoPreservationFinalRoadmapFreezeExportTextBox =
  ({
    finalFreezePack = PV_METRICS_INDEPENDENT_DEMO_PRESERVATION_FINAL_ROADMAP_FREEZE_PACK_MOCK,
  }: Props) => {
    const [copiedTarget, setCopiedTarget] = useState<
      'executive-summary' | 'internal-report' | null
    >(null);

    const executiveSummary = useMemo(
      () => buildExecutiveFinalFreezeSummary(finalFreezePack),
      [finalFreezePack],
    );

    const internalReport = useMemo(
      () => buildInternalFinalFreezeReport(finalFreezePack),
      [finalFreezePack],
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
            INDEPENDENT DEMO PRESERVATION & FINAL ROADMAP FREEZE EXPORT
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Export local del freeze final independiente
          </h3>

          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Export local en texto plano para copiar un resumen ejecutivo y un
            reporte técnico interno del freeze final del roadmap independiente.
            No crea PDF, no crea ZIP, no crea backup real, no crea release
            artifact, no descarga archivos, no sube archivos y no ejecuta
            acciones externas reales.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  Executive Final Freeze
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
                  Internal Final Freeze Report
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
            Final Freeze Boundary
          </p>

          <p className="mt-2 text-sm leading-6 text-rose-100">
            Este export es solo texto local copiable. No crea backup real, no
            crea ZIP real, no crea PDF real, no crea snapshot descargable real,
            no crea paquete final descargable, no crea release artifact, no
            sube archivos, no descarga archivos, no usa storage externo, no usa
            localStorage, no usa IndexedDB, no usa backend, no usa base de datos
            real, no convierte la demo en release real, no aprueba producción,
            no aprueba piloto real, no crea comité real, no crea acta legal
            real, no crea contrato real, no crea PowerPoint real, no crea APK
            real, no crea instalador real, no crea ejecutable real, no usa
            WebRTC, Socket.IO, SDP, ICE ni TURN, no envía emails reales, no crea
            reuniones, links ni invitaciones reales, no incorpora datos reales,
            no crea conectores reales, no usa credenciales, tokens, secrets,
            API keys ni passwords, no lee SCADA, medidores, CEN ni APIs reales,
            no ejecuta POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints,
            no comandos BESS/inversores, no SCADA ACK, no forecast oficial, no
            reporte regulatorio, no trazabilidad real y no evidencia operacional
            real.
          </p>
        </div>
      </section>
    );
  };
