import { useMemo, useState } from 'react';
import { PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK } from '../../data/pvMetricsLocalDemoPackageMockData';
import { PVMetricsLocalDemoPackageAssemblyPack } from '../../types/pvmetrics-local-demo-package.types';

type PVMetricsLocalDemoPackageAssemblyExportTextBoxProps = {
  assemblyPack?: PVMetricsLocalDemoPackageAssemblyPack;
};

const buildLocalDemoPackageSummary = (
  assemblyPack: PVMetricsLocalDemoPackageAssemblyPack,
) =>
  [
    'ORBI PVMetrics IA — Resumen de paquete demo local',
    '',
    'Contexto:',
    'Este paquete corresponde a una preparación local, mock, read-only y no productiva para una demostración controlada. No genera ZIP, APK, PDF, firma digital real, correo, backend, API ni conector real.',
    '',
    'Contenidos permitidos:',
    assemblyPack.packageContents
      .filter((content) => content.allowed)
      .map(
        (content) =>
          `- ${content.label}: ${content.description} | Seguridad: ${content.safetyNote}`,
      )
      .join('\n'),
    '',
    'Artefactos reales bloqueados:',
    assemblyPack.blockedRealReleaseArtifacts
      .map(
        (artifact) =>
          `- ${artifact.label}: ${artifact.reason} | Alternativa segura: ${artifact.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Alcance de firma del operador:',
    assemblyPack.operatorSignOffScope
      .map(
        (scope) =>
          `- ${scope.label}: ${scope.description} [required=${
            scope.required ? 'yes' : 'no'
          }]`,
      )
      .join('\n'),
    '',
    'Preflight operador:',
    assemblyPack.operatorPreflightChecklist
      .map(
        (item) =>
          `- ${item.label}: ${item.description} [status=${item.status}${
            item.command ? `, command=${item.command}` : ''
          }]`,
      )
      .join('\n'),
    '',
    'Revisión humana requerida:',
    assemblyPack.reviewerSignOffChecklist
      .map(
        (item) =>
          `- ${item.label}: ${item.description} [reviewer=${item.reviewerRole}, status=${item.status}]`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    assemblyPack.safetyBoundary,
    '',
    'Este resumen es texto local copiable. No crea artefactos reales ni ejecuta acciones externas.',
  ].join('\n');

const buildInternalAssemblyReport = (
  assemblyPack: PVMetricsLocalDemoPackageAssemblyPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte interno de Local Demo Package Assembly & Operator Sign-Off',
    `Pack ID: ${assemblyPack.packId}`,
    `Generated: ${assemblyPack.generatedAtLabel}`,
    `Version: ${assemblyPack.internalVersion}`,
    `Status: ${assemblyPack.status}`,
    `Roadmap Block: ${assemblyPack.roadmapBlock}`,
    '',
    'Local Demo Package Contents:',
    assemblyPack.packageContents
      .map(
        (content) =>
          [
            `- ${content.label}`,
            `  Allowed: ${content.allowed ? 'yes' : 'no'}`,
            `  Client Visible: ${content.clientVisible ? 'yes' : 'no'}`,
            `  Description: ${content.description}`,
            `  Safety Note: ${content.safetyNote}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Blocked Real Release Artifacts:',
    assemblyPack.blockedRealReleaseArtifacts
      .map(
        (artifact) =>
          [
            `- ${artifact.label}`,
            `  Blocked: ${artifact.blocked ? 'yes' : 'no'}`,
            `  Reason: ${artifact.reason}`,
            `  Safe Alternative: ${artifact.safeAlternative}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Operator Sign-Off Scope:',
    assemblyPack.operatorSignOffScope
      .map(
        (scope) =>
          [
            `- ${scope.label}`,
            `  Required: ${scope.required ? 'yes' : 'no'}`,
            `  Description: ${scope.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Operator Preflight Checklist:',
    assemblyPack.operatorPreflightChecklist
      .map(
        (item) =>
          [
            `- ${item.label}`,
            `  Status: ${item.status}`,
            `  Required: ${item.required ? 'yes' : 'no'}`,
            item.command ? `  Command: ${item.command}` : '  Command: N/A',
            `  Description: ${item.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Reviewer Sign-Off Checklist:',
    assemblyPack.reviewerSignOffChecklist
      .map(
        (item) =>
          [
            `- ${item.label}`,
            `  Status: ${item.status}`,
            `  Reviewer Role: ${item.reviewerRole}`,
            `  Required: ${item.required ? 'yes' : 'no'}`,
            `  Description: ${item.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Demo Environment Assumptions:',
    assemblyPack.demoEnvironmentAssumptions
      .map(
        (assumption) =>
          [
            `- ${assumption.label}`,
            `  Must Be True: ${assumption.mustBeTrue ? 'yes' : 'no'}`,
            `  Description: ${assumption.description}`,
          ].join('\n'),
      )
      .join('\n\n'),
    '',
    'Human Approval Gates:',
    assemblyPack.humanApprovalGates
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
    'Assembly Risks:',
    assemblyPack.assemblyRisks
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
    'Assembly Exit Criteria:',
    assemblyPack.assemblyExitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    assemblyPack.safetyBoundary,
    '',
    `Next Recommended Module: ${assemblyPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsLocalDemoPackageAssemblyExportTextBox = ({
  assemblyPack = PV_METRICS_LOCAL_DEMO_PACKAGE_ASSEMBLY_PACK_MOCK,
}: PVMetricsLocalDemoPackageAssemblyExportTextBoxProps) => {
  const [copiedTarget, setCopiedTarget] = useState<'summary' | 'internal' | null>(
    null,
  );

  const summaryText = useMemo(
    () => buildLocalDemoPackageSummary(assemblyPack),
    [assemblyPack],
  );

  const internalText = useMemo(
    () => buildInternalAssemblyReport(assemblyPack),
    [assemblyPack],
  );

  const handleCopy = async (
    target: 'summary' | 'internal',
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
    <section className="rounded-3xl border border-violet-400/20 bg-slate-950/85 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
          LOCAL DEMO PACKAGE EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Textos copiables de ensamblaje y sign-off
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para resumen del paquete demo e informe
          interno de sign-off. No genera ZIP, APK, PDF, firma digital real,
          correo, backend, API, localStorage ni conectores reales.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Local Demo / Package Summary
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Resumen paquete demo
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('summary', summaryText)}
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'summary' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={summaryText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal / Assembly Report
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
          Este export es solo texto local copiable. No crea ZIP, APK, PDF, firma
          digital real, correos, backend, APIs, localStorage, conectores reales,
          SCADA, lectura de medidores, weather APIs, CEN, credenciales, tokens,
          secrets, POST/PUT/PATCH/DELETE real, telecontrol, setpoints, comandos
          BESS ni comandos inversores.
        </p>
      </div>
    </section>
  );
};
