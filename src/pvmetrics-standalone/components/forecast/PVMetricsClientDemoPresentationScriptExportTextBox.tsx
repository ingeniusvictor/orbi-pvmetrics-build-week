import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK } from '../../data/pvMetricsClientDemoPresentationScriptMockData';
import { PVMetricsControlledClientDemoPresentationScriptPack } from '../../types/pvmetrics-client-demo-presentation-script.types';

type Props = {
  scriptPack?: PVMetricsControlledClientDemoPresentationScriptPack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutivePresentationScript = (
  scriptPack: PVMetricsControlledClientDemoPresentationScriptPack,
) =>
  [
    'ORBI PVMetrics IA — Guion ejecutivo de presentación demo',
    '',
    'Declaración obligatoria:',
    'Este guion es local, conceptual, script-only, demo-only, read-only y no productivo. No graba video real, no crea audio real, no crea voz real, no crea avatar real, no crea PowerPoint real, no crea PDF real, no crea ZIP real, no crea APK real ni release productiva. No envía emails reales, no crea reuniones reales, no crea links reales, no crea invitaciones reales, no incorpora datos reales, no crea conectores reales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${scriptPack.internalVersion}`,
    `Estado: ${scriptPack.status}`,
    `Bloque: ${scriptPack.roadmapBlock}`,
    `Generado: ${scriptPack.generatedAtLabel}`,
    '',
    'Propósito del guion:',
    list(scriptPack.clientDemoPresentationScriptPurpose, (item) => item),
    '',
    'Guion ejecutivo sugerido:',
    '1. Apertura: Presentar ORBI PVMetrics IA como una demo local de inteligencia FV/O&M conceptual.',
    '2. Problema: Explicar la necesidad de ordenar análisis, forecast conceptual, readiness, QA y reportabilidad en un entorno seguro.',
    '3. Solución: Mostrar que la app permite visualizar flujos, escenarios, evidencia y boundaries sin tocar sistemas reales.',
    '4. Demo: Recorrer el wizard, tarjetas visuales y export locales usando únicamente mock data.',
    '5. Seguridad: Aclarar que no hay SCADA, medidores, CEN, APIs reales, telecontrol, forecast oficial ni reporte regulatorio.',
    '6. Próximos pasos: Proponer revisión humana y, si aplica, un futuro piloto read-only con alcance separado.',
    '',
    'Secciones de presentación:',
    list(
      scriptPack.presentationScriptSections,
      (section) =>
        `${section.label} | Mode: ${section.scriptMode} | Duration: ${section.recommendedDuration} | ${section.description}`,
    ),
    '',
    'Bloques de tiempo:',
    list(
      scriptPack.presentationScriptTimingBlocks,
      (timing) => `${timing.label} | ${timing.duration} | ${timing.description}`,
    ),
    '',
    'Disclaimers obligatorios:',
    list(
      scriptPack.presentationScriptSafetyDisclaimers,
      (disclaimer) => `${disclaimer.label}: ${disclaimer.disclaimer}`,
    ),
    '',
    'Cierre ejecutivo:',
    'La presentación debe cerrar reforzando que ORBI PVMetrics IA es una demo local, mock, read-only, no productiva y sin acciones externas reales. Cualquier piloto futuro debe ser read-only, controlado y aprobado por responsables humanos.',
    '',
    'Presentation Script Boundary:',
    scriptPack.presentationScriptBoundary,
  ].join('\n');

const buildInternalPresentationScriptReview = (
  scriptPack: PVMetricsControlledClientDemoPresentationScriptPack,
) =>
  [
    'ORBI PVMetrics IA — Revisión técnica interna de Client Demo Presentation Script',
    `Pack ID: ${scriptPack.packId}`,
    `Generated: ${scriptPack.generatedAtLabel}`,
    `Version: ${scriptPack.internalVersion}`,
    `Status: ${scriptPack.status}`,
    `Roadmap Block: ${scriptPack.roadmapBlock}`,
    '',
    'Allowed Presentation Script Items:',
    list(
      scriptPack.allowedPresentationScriptItems,
      (item) =>
        `${item.label} | Mode: ${item.scriptMode} | Approval: ${
          item.requiresApproval ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Presentation Script Items:',
    list(
      scriptPack.blockedPresentationScriptItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Presentation Script Principles:',
    list(
      scriptPack.presentationScriptPrinciples,
      (principle) =>
        `${principle.label} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        } | ${principle.description}`,
    ),
    '',
    'Presentation Script Speaker Notes:',
    list(
      scriptPack.presentationScriptSpeakerNotes,
      (note) =>
        `${note.label} | Mode: ${note.scriptMode} | Mandatory: ${
          note.mandatory ? 'yes' : 'no'
        } | ${note.note}`,
    ),
    '',
    'Presentation Script Safety Disclaimers:',
    list(
      scriptPack.presentationScriptSafetyDisclaimers,
      (disclaimer) =>
        `${disclaimer.label} | Mandatory: ${
          disclaimer.mandatory ? 'yes' : 'no'
        } | ${disclaimer.disclaimer}`,
    ),
    '',
    'Presentation Script Approval Roles:',
    list(
      scriptPack.presentationScriptApprovalRoles,
      (role) =>
        `${role.label} | Reviewer: ${role.reviewerRole} | Required: ${
          role.required ? 'yes' : 'no'
        } | ${role.description}`,
    ),
    '',
    'Presentation Script Risk Register:',
    list(
      scriptPack.presentationScriptRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Presentation Script Exit Criteria:',
    list(
      scriptPack.presentationScriptExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label}: ${
          criterion.description
        }`,
    ),
    '',
    'Presentation Script Boundary:',
    scriptPack.presentationScriptBoundary,
    '',
    `Next Recommended Module: ${scriptPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsClientDemoPresentationScriptExportTextBox = ({
  scriptPack = PV_METRICS_CONTROLLED_CLIENT_DEMO_PRESENTATION_SCRIPT_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-script' | 'internal-review' | null
  >(null);

  const executiveScript = useMemo(
    () => buildExecutivePresentationScript(scriptPack),
    [scriptPack],
  );

  const internalReview = useMemo(
    () => buildInternalPresentationScriptReview(scriptPack),
    [scriptPack],
  );

  const handleCopy = async (
    target: 'executive-script' | 'internal-review',
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
    <section className="rounded-3xl border border-fuchsia-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
          CLIENT DEMO PRESENTATION SCRIPT EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local del guion de presentación demo
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para copiar un guion ejecutivo y una
          revisión técnica interna. No crea video, audio, avatar, PowerPoint,
          PDF ni entrega externa real.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-fuchsia-400/20 bg-fuchsia-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">
                Executive Script
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Guion ejecutivo
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('executive-script', executiveScript)}
              className="rounded-xl border border-fuchsia-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-100 hover:bg-fuchsia-400/10"
            >
              {copiedTarget === 'executive-script' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={executiveScript}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-amber-400/20 bg-amber-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                Internal Review
              </p>

              <h4 className="text-lg font-bold text-slate-100">
                Revisión técnica interna
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal-review', internalReview)}
              className="rounded-xl border border-amber-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-100 hover:bg-amber-400/10"
            >
              {copiedTarget === 'internal-review' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReview}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Presentation Script Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No graba video real, no crea
          audio real, no crea voz real, no crea avatar real, no crea PowerPoint
          real, no crea PDF real, ZIP real, APK real ni release productiva. No
          envía emails reales, no crea reuniones reales, no crea links reales,
          no crea invitaciones reales, no incorpora datos reales, no crea
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
