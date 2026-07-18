import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_ARCHIVE_READ_ONLY_MAINTENANCE_PACK_MOCK } from '../../data/pvMetricsClientDemoArchiveReadOnlyMaintenanceMockData';
import { PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack } from '../../types/pvmetrics-client-demo-archive-read-only-maintenance.types';

type Props = {
  archiveMaintenancePack?: PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveArchiveMaintenanceSummary = (
  archiveMaintenancePack: PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de Client Demo Archive & Read-Only Maintenance',
    '',
    'Declaración obligatoria:',
    'Este resumen es local, conceptual, archive-only, maintenance-read-only, demo-only y no productivo. No crea backup real, no crea ZIP real, no crea PDF real, no crea snapshot descargable real, no sube archivos, no descarga archivos, no usa storage externo, no usa localStorage, no usa IndexedDB, no usa backend, no usa base de datos real, no convierte la demo en release real, no aprueba producción, no aprueba piloto real, no crea comité real, no crea acta legal real, no crea contrato real, no crea PowerPoint real, no crea APK real, no crea instalador real, no crea ejecutable real, no usa WebRTC, no usa Socket.IO, no usa SDP, no usa ICE, no usa TURN, no envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN y no habilita telecontrol.',
    '',
    `Versión: ${archiveMaintenancePack.internalVersion}`,
    `Estado: ${archiveMaintenancePack.status}`,
    `Bloque: ${archiveMaintenancePack.roadmapBlock}`,
    `Generado: ${archiveMaintenancePack.generatedAtLabel}`,
    '',
    'Propósito de Archive & Read-Only Maintenance:',
    list(archiveMaintenancePack.archiveMaintenancePurpose, (item) => item),
    '',
    'Bloques archivados conceptualmente:',
    list(
      archiveMaintenancePack.archivedDemoClosureBlocks,
      (block) =>
        `${block.label} | Status: ${block.archiveStatus} | ${block.description}`,
    ),
    '',
    'Dominios de archivo y mantenimiento:',
    list(
      archiveMaintenancePack.archiveMaintenanceDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.maintenanceMode} | ${domain.description}`,
    ),
    '',
    'Gates del archivo read-only:',
    list(
      archiveMaintenancePack.archiveMaintenanceGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Roles de revisión conceptual:',
    list(
      archiveMaintenancePack.archiveMaintenanceRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Postura final:',
    'El archivo y mantenimiento read-only confirma que ORBI PVMetrics IA permanece como demo local, mock, archive-only, maintenance-read-only, demo-only, no productiva y sin acciones externas reales.',
    '',
    'Cierre ejecutivo:',
    'Este Archive & Read-Only Maintenance no representa backup real, archivo real, release real, aprobación de cliente, comité real, piloto real, producción real, contrato real ni decisión legal. Cualquier mantenimiento real debe ser manual, humano, externo a la app y definido en un alcance separado.',
    '',
    'Archive & Maintenance Boundary:',
    archiveMaintenancePack.archiveMaintenanceBoundary,
  ].join('\n');

const buildInternalArchiveMaintenanceReport = (
  archiveMaintenancePack: PVMetricsControlledClientDemoArchiveReadOnlyMaintenancePack,
) =>
  [
    'ORBI PVMetrics IA — Reporte técnico interno de Client Demo Archive & Read-Only Maintenance',
    `Pack ID: ${archiveMaintenancePack.packId}`,
    `Generated: ${archiveMaintenancePack.generatedAtLabel}`,
    `Version: ${archiveMaintenancePack.internalVersion}`,
    `Status: ${archiveMaintenancePack.status}`,
    `Roadmap Block: ${archiveMaintenancePack.roadmapBlock}`,
    '',
    'Archive & Maintenance Purpose:',
    list(archiveMaintenancePack.archiveMaintenancePurpose, (item) => item),
    '',
    'Archived Demo Closure Blocks:',
    list(
      archiveMaintenancePack.archivedDemoClosureBlocks,
      (block) =>
        `${block.label} | Status: ${block.archiveStatus} | ${block.description}`,
    ),
    '',
    'Allowed Archive & Maintenance Items:',
    list(
      archiveMaintenancePack.allowedArchiveMaintenanceItems,
      (item) =>
        `${item.label} | Mode: ${item.maintenanceMode} | Human review: ${
          item.requiresHumanReview ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Archive & Maintenance Items:',
    list(
      archiveMaintenancePack.blockedArchiveMaintenanceItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Archive & Maintenance Principles:',
    list(
      archiveMaintenancePack.archiveMaintenancePrinciples,
      (principle) =>
        `${principle.label} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        } | ${principle.description}`,
    ),
    '',
    'Archive & Maintenance Domains:',
    list(
      archiveMaintenancePack.archiveMaintenanceDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.maintenanceMode} | ${domain.description}`,
    ),
    '',
    'Archive & Maintenance Gates:',
    list(
      archiveMaintenancePack.archiveMaintenanceGates,
      (gate) =>
        `[${gate.passed ? 'passed' : 'pending'}] ${gate.label} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Archive & Maintenance Roles:',
    list(
      archiveMaintenancePack.archiveMaintenanceRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Archive & Maintenance Risk Register:',
    list(
      archiveMaintenancePack.archiveMaintenanceRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Archive & Maintenance Exit Criteria:',
    list(
      archiveMaintenancePack.archiveMaintenanceExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label} | Required: ${
          criterion.required ? 'yes' : 'no'
        } | ${criterion.description}`,
    ),
    '',
    'Archive & Maintenance Boundary:',
    archiveMaintenancePack.archiveMaintenanceBoundary,
    '',
    `Next Recommended Module: ${archiveMaintenancePack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsClientDemoArchiveReadOnlyMaintenanceExportTextBox = ({
  archiveMaintenancePack = PV_METRICS_CONTROLLED_CLIENT_DEMO_ARCHIVE_READ_ONLY_MAINTENANCE_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-summary' | 'internal-report' | null
  >(null);

  const executiveSummary = useMemo(
    () => buildExecutiveArchiveMaintenanceSummary(archiveMaintenancePack),
    [archiveMaintenancePack],
  );

  const internalReport = useMemo(
    () => buildInternalArchiveMaintenanceReport(archiveMaintenancePack),
    [archiveMaintenancePack],
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
          CLIENT DEMO ARCHIVE & READ-ONLY MAINTENANCE EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local del archivo conceptual read-only
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para copiar un resumen ejecutivo y un
          reporte técnico interno del archivo conceptual y mantenimiento
          read-only. No crea PDF, no crea ZIP, no crea backup real, no descarga
          archivos, no sube archivos y no ejecuta acciones externas reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Executive Archive Maintenance
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
                Internal Archive Maintenance Report
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
          Archive & Maintenance Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No crea archivo real de
          respaldo, no crea ZIP real, no crea PDF real, no crea backup real, no
          crea snapshot descargable real, no crea exportación productiva, no
          sube archivos, no descarga archivos, no usa storage externo, no usa
          localStorage, no usa IndexedDB, no usa backend, no usa base de datos
          real, no convierte la demo en release real, no aprueba producción, no
          aprueba piloto real, no crea comité real, no crea acta legal real, no
          crea contrato real, no crea PowerPoint real, no crea APK real, no crea
          instalador real, no crea ejecutable real, no usa WebRTC, Socket.IO,
          SDP, ICE ni TURN, no envía emails reales, no crea reuniones, links ni
          invitaciones reales, no incorpora datos reales, no crea conectores
          reales, no usa credenciales, tokens, secrets, API keys ni passwords,
          no lee SCADA, medidores, CEN ni APIs reales, no ejecuta
          POST/PUT/PATCH/DELETE real, no telecontrol, no setpoints, no comandos
          BESS/inversores, no SCADA ACK, no forecast oficial ni reporte
          regulatorio.
        </p>
      </div>
    </section>
  );
};
