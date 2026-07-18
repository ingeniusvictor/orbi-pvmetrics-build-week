import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK } from '../../data/pvMetricsSanitizedSampleDataMockData';
import { PVMetricsControlledSanitizedSampleDataPack } from '../../types/pvmetrics-sanitized-sample-data.types';

type Props = {
  sampleDataPack?: PVMetricsControlledSanitizedSampleDataPack;
};

const list = <T,>(items: T[], formatter: (item: T) => string) =>
  items.map((item) => `- ${formatter(item)}`).join('\n');

const buildExecutiveSampleDataReport = (
  sampleDataPack: PVMetricsControlledSanitizedSampleDataPack,
) =>
  [
    'ORBI PVMetrics IA — Resumen ejecutivo de muestras sanitizadas/sintéticas',
    '',
    'Declaración obligatoria:',
    'Este documento es local, conceptual, demo-only y no productivo. No incorpora datos reales, no crea conectores reales, no usa credenciales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${sampleDataPack.internalVersion}`,
    `Estado: ${sampleDataPack.status}`,
    `Bloque: ${sampleDataPack.roadmapBlock}`,
    `Generado: ${sampleDataPack.generatedAtLabel}`,
    '',
    'Propósito:',
    list(sampleDataPack.sampleDataPurpose, (item) => item),
    '',
    'Principios de muestra sanitizada:',
    list(
      sampleDataPack.sanitizedSampleDataPrinciples,
      (principle) =>
        `${principle.label}: ${principle.description} | Mandatory: ${
          principle.mandatory ? 'yes' : 'no'
        }`,
    ),
    '',
    'Reglas synthetic-first:',
    list(
      sampleDataPack.syntheticSampleRules,
      (rule) =>
        `${rule.label}: ${rule.description} | Mandatory: ${
          rule.mandatory ? 'yes' : 'no'
        }`,
    ),
    '',
    'Dominios de muestra:',
    list(
      sampleDataPack.sampleDataDomains,
      (domain) =>
        `${domain.label} | Mode: ${domain.sampleMode} | ${domain.description}`,
    ),
    '',
    'Placeholders demo:',
    list(
      sampleDataPack.sampleDataFieldPlaceholders,
      (placeholder) =>
        `${placeholder.label} = ${placeholder.placeholderValue} | Mode: ${placeholder.sampleMode} | Rule: ${placeholder.rule}`,
    ),
    '',
    'Cierre ejecutivo:',
    'Toda muestra futura debe ser synthetic-first, demo-only, no productiva, no regulatoria, sin trazabilidad a cliente/planta/activo real y sin posibilidad de operar sistemas.',
    '',
    'Safety Boundary:',
    sampleDataPack.safetyBoundary,
  ].join('\n');

const buildInternalSampleDataReview = (
  sampleDataPack: PVMetricsControlledSanitizedSampleDataPack,
) =>
  [
    'ORBI PVMetrics IA — Revisión técnica interna de Sanitized Sample Data',
    `Pack ID: ${sampleDataPack.packId}`,
    `Generated: ${sampleDataPack.generatedAtLabel}`,
    `Version: ${sampleDataPack.internalVersion}`,
    `Status: ${sampleDataPack.status}`,
    `Roadmap Block: ${sampleDataPack.roadmapBlock}`,
    '',
    'Allowed Sample Data Items:',
    list(
      sampleDataPack.allowedSampleDataItems,
      (item) =>
        `${item.label} | Mode: ${item.sampleMode} | Approval: ${
          item.requiresApproval ? 'yes' : 'no'
        } | ${item.description}`,
    ),
    '',
    'Blocked Sample Data Items:',
    list(
      sampleDataPack.blockedSampleDataItems,
      (item) =>
        `${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
    ),
    '',
    'Sanitization Requirements:',
    list(
      sampleDataPack.sanitizationRequirements,
      (requirement) =>
        `${requirement.label} | Required: ${
          requirement.required ? 'yes' : 'no'
        } | ${requirement.description}`,
    ),
    '',
    'Forbidden Sample Content:',
    list(
      sampleDataPack.forbiddenSampleContent,
      (content) =>
        `${content.label} | Severity: ${content.severity} | Reason: ${content.reason}`,
    ),
    '',
    'Sample Data Quality Gates:',
    list(
      sampleDataPack.sampleDataQualityGates,
      (gate) =>
        `${gate.label} | Required: ${gate.required ? 'yes' : 'no'} | ${
          gate.description
        }`,
    ),
    '',
    'Sample Data Privacy Gates:',
    list(
      sampleDataPack.sampleDataPrivacyGates,
      (gate) =>
        `${gate.label} | Required: ${gate.required ? 'yes' : 'no'} | ${
          gate.description
        }`,
    ),
    '',
    'Sample Data Approval Gates:',
    list(
      sampleDataPack.sampleDataApprovalGates,
      (gate) =>
        `${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
          gate.required ? 'yes' : 'no'
        } | ${gate.description}`,
    ),
    '',
    'Sample Data Risk Register:',
    list(
      sampleDataPack.sampleDataRiskRegister,
      (risk) =>
        `${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
    ),
    '',
    'Sample Data Exit Criteria:',
    list(
      sampleDataPack.sampleDataExitCriteria,
      (criterion) =>
        `[${criterion.passed ? 'passed' : 'pending'}] ${criterion.label}: ${
          criterion.description
        }`,
    ),
    '',
    'Safety Boundary:',
    sampleDataPack.safetyBoundary,
    '',
    `Next Recommended Module: ${sampleDataPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsSanitizedSampleDataExportTextBox = ({
  sampleDataPack = PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'executive-report' | 'internal-review' | null
  >(null);

  const executiveReport = useMemo(
    () => buildExecutiveSampleDataReport(sampleDataPack),
    [sampleDataPack],
  );

  const internalReview = useMemo(
    () => buildInternalSampleDataReview(sampleDataPack),
    [sampleDataPack],
  );

  const handleCopy = async (
    target: 'executive-report' | 'internal-review',
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
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
          SANITIZED SAMPLE DATA EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Export local de muestras sanitizadas/sintéticas
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para documentar muestras demo-only,
          synthetic-first y no productivas. No genera archivos reales, no usa
          datos reales, no llama APIs y no ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Executive Report
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Resumen ejecutivo
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('executive-report', executiveReport)}
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'executive-report' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={executiveReport}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal Review
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte técnico interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('internal-review', internalReview)}
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
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
          Safety Boundary
        </p>

        <p className="mt-2 text-sm leading-6 text-rose-100">
          Este export es solo texto local copiable. No incorpora datos reales,
          no crea conectores reales, no usa credenciales, tokens, secrets, API
          keys ni passwords, no lee SCADA, no lee medidores, no llama APIs
          reales, no envía CEN, no usa backend, base de datos, localStorage,
          POST/PUT/PATCH/DELETE real, telecontrol, setpoints, comandos
          BESS/inversores, SCADA ACK, forecast oficial ni reporte regulatorio.
        </p>
      </div>
    </section>
  );
};
