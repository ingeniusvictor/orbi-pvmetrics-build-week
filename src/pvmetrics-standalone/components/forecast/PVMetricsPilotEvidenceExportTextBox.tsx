import { useMemo, useState } from 'react';
import {
  PV_METRICS_CLIENT_DEMO_PACK_MOCK,
  PV_METRICS_PILOT_EVIDENCE_PACK_MOCK,
} from '../../data/pvMetricsPilotEvidencePackMockData';
import {
  PVMetricsClientDemoPack,
  PVMetricsPilotEvidencePack,
} from '../../types/pvmetrics-pilot-evidence-pack.types';

type PVMetricsPilotEvidenceExportTextBoxProps = {
  evidencePack?: PVMetricsPilotEvidencePack;
  demoPack?: PVMetricsClientDemoPack;
};

const buildInternalEvidenceText = (
  evidencePack: PVMetricsPilotEvidencePack,
  demoPack: PVMetricsClientDemoPack,
) =>
  [
    'ORBI PVMetrics IA — Pilot Evidence Pack',
    `Pack ID: ${evidencePack.packId}`,
    `Generated: ${evidencePack.generatedAtLabel}`,
    `Status: ${evidencePack.status}`,
    `Version: ${evidencePack.summary.internalVersion}`,
    '',
    'Summary:',
    `- Total categories: ${evidencePack.summary.totalCategories}`,
    `- Total evidence items: ${evidencePack.summary.totalEvidenceItems}`,
    `- Total checklist items: ${evidencePack.summary.totalChecklistItems}`,
    `- Client visible items: ${evidencePack.summary.clientVisibleItems}`,
    `- Blocked items: ${evidencePack.summary.blockedItems}`,
    '',
    'Evidence Categories:',
    evidencePack.categories
      .map(
        (category) =>
          `- ${category.label}: ${category.description} [risk=${category.riskLevel}]`,
      )
      .join('\n'),
    '',
    'Evidence Items:',
    evidencePack.evidenceItems
      .map(
        (item) =>
          [
            `- ${item.label}`,
            `  Status: ${item.status}`,
            `  Source module: ${item.sourceModule}`,
            `  Client visible: ${item.isClientVisible ? 'yes' : 'no'}`,
            `  Summary: ${item.summary}`,
            `  Safety: ${item.safetyNote}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Readiness Checklist:',
    evidencePack.readinessChecklist
      .map(
        (check) =>
          `- [${check.status}] ${check.label}: ${check.description}`,
      )
      .join('\n'),
    '',
    'Pilot Boundaries:',
    evidencePack.pilotBoundaries
      .map((boundary) => `- ${boundary.label}: ${boundary.description}`)
      .join('\n'),
    '',
    'No Real Integration Statement:',
    evidencePack.noRealIntegrationStatement.body,
    '',
    'Client Demo Internal Preview:',
    demoPack.internalCopyText,
  ].join('\n');

const buildClientEvidenceText = (
  evidencePack: PVMetricsPilotEvidencePack,
  demoPack: PVMetricsClientDemoPack,
) =>
  [
    'Resumen piloto ORBI PVMetrics IA',
    '',
    'Esta demo muestra un prototipo local y seguro para revisar readiness técnico/comercial antes de cualquier integración real.',
    '',
    'Evidencia visible:',
    evidencePack.evidenceItems
      .filter((item) => item.isClientVisible)
      .map((item) => `- ${item.label}: ${item.summary}`)
      .join('\n'),
    '',
    'Límites del piloto:',
    evidencePack.pilotBoundaries
      .map((boundary) => `- ${boundary.label}: ${boundary.description}`)
      .join('\n'),
    '',
    'Narrativa demo:',
    demoPack.narrativeSections
      .map((section) => `- ${section.title}: ${section.body}`)
      .join('\n'),
    '',
    'Declaración de seguridad:',
    evidencePack.noRealIntegrationStatement.body,
    '',
    'Este texto es local y copiable. No genera PDF, no envía correos, no usa backend y no conecta sistemas reales.',
  ].join('\n');

export const PVMetricsPilotEvidenceExportTextBox = ({
  evidencePack = PV_METRICS_PILOT_EVIDENCE_PACK_MOCK,
  demoPack = PV_METRICS_CLIENT_DEMO_PACK_MOCK,
}: PVMetricsPilotEvidenceExportTextBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'internal' | 'client' | null>(
    null,
  );

  const internalText = useMemo(
    () => buildInternalEvidenceText(evidencePack, demoPack),
    [evidencePack, demoPack],
  );

  const clientText = useMemo(
    () => buildClientEvidenceText(evidencePack, demoPack),
    [evidencePack, demoPack],
  );

  const handleCopy = async (target: 'internal' | 'client', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-700/70 bg-slate-950/80 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          PILOT EVIDENCE EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Textos copiables para evidencia piloto
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para revisión interna y conversación
          cliente. No genera PDF, no envía correos, no usa backend, no guarda
          datos y no conecta fuentes reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Engineering / Internal
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

        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Client / Demo
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
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No crea PDF real, no envía
          correos, no usa backend, no usa localStorage, no conecta SCADA, no lee
          medidores, no llama APIs, no envía información al CEN, no usa
          credenciales, no ejecuta POST/PUT/PATCH/DELETE real, no modifica
          setpoints, no controla BESS y no controla inversores.
        </p>
      </div>
    </section>
  );
};
