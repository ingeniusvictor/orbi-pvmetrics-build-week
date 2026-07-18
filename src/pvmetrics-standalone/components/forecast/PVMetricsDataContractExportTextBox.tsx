import { useMemo, useState } from 'react';
import { PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK } from '../../data/pvMetricsReadOnlyDataContractMockData';
import { PVMetricsControlledReadOnlyDataContractPack } from '../../types/pvmetrics-read-only-data-contract.types';

type Props = {
  dataContractPack?: PVMetricsControlledReadOnlyDataContractPack;
};

const buildClientDataContractText = (
  dataContractPack: PVMetricsControlledReadOnlyDataContractPack,
) =>
  [
    'ORBI PVMetrics IA — Contrato conceptual de datos read-only',
    '',
    'Declaración obligatoria:',
    'Este contrato es conceptual, local, mock, read-only y no productivo. No incorpora datos reales, no crea conectores reales, no usa credenciales, no lee SCADA, no lee medidores, no llama APIs reales, no envía CEN, no opera activos y no habilita telecontrol.',
    '',
    `Versión: ${dataContractPack.internalVersion}`,
    `Estado: ${dataContractPack.status}`,
    `Bloque: ${dataContractPack.roadmapBlock}`,
    `Generado: ${dataContractPack.generatedAtLabel}`,
    '',
    'Propósito del contrato:',
    dataContractPack.dataContractPurpose.map((item) => `- ${item}`).join('\n'),
    '',
    'Dominios requeridos:',
    dataContractPack.requiredDataDomains
      .map(
        (domain) =>
          `- ${domain.label} | Required: ${
            domain.required ? 'yes' : 'no'
          } | ${domain.description}`,
      )
      .join('\n'),
    '',
    'Campos requeridos:',
    dataContractPack.requiredDataFields
      .map(
        (field) =>
          `- ${field.label} | Domain: ${field.domain} | Type: ${field.expectedType} | Unit: ${field.expectedUnit}`,
      )
      .join('\n'),
    '',
    'Campos opcionales:',
    dataContractPack.optionalDataFields
      .map(
        (field) =>
          `- ${field.label} | Domain: ${field.domain} | Type: ${field.expectedType} | Unit: ${field.expectedUnit}`,
      )
      .join('\n'),
    '',
    'Campos prohibidos:',
    dataContractPack.forbiddenDataFields
      .map(
        (field) =>
          `- ${field.label} | Severity: ${field.severity} | Reason: ${field.reason}`,
      )
      .join('\n'),
    '',
    'Cierre conceptual:',
    'Cualquier uso futuro de muestra real requiere aprobación humana, sanitización, contrato read-only, revisión técnica, QA, cliente y seguridad.',
    '',
    'Safety Boundary:',
    dataContractPack.safetyBoundary,
  ].join('\n');

const buildInternalDataContractReviewText = (
  dataContractPack: PVMetricsControlledReadOnlyDataContractPack,
) =>
  [
    'ORBI PVMetrics IA — Reporte técnico interno de Data Contract',
    `Pack ID: ${dataContractPack.packId}`,
    `Generated: ${dataContractPack.generatedAtLabel}`,
    `Version: ${dataContractPack.internalVersion}`,
    `Status: ${dataContractPack.status}`,
    `Roadmap Block: ${dataContractPack.roadmapBlock}`,
    '',
    'Allowed Data Contract Items:',
    dataContractPack.allowedDataContractItems
      .map(
        (item) =>
          `- ${item.label}: ${item.description} | Human review: ${
            item.requiresHumanReview ? 'yes' : 'no'
          }`,
      )
      .join('\n'),
    '',
    'Blocked Data Contract Items:',
    dataContractPack.blockedDataContractItems
      .map(
        (item) =>
          `- ${item.label} | Severity: ${item.severity} | Reason: ${item.reason} | Safe alternative: ${item.safeAlternative}`,
      )
      .join('\n'),
    '',
    'Data Quality Gates:',
    dataContractPack.dataQualityGates
      .map(
        (gate) =>
          `- ${gate.label} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Data Sanitization Gates:',
    dataContractPack.dataSanitizationGates
      .map(
        (gate) =>
          `- ${gate.label} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Data Ownership Gates:',
    dataContractPack.dataOwnershipGates
      .map(
        (gate) =>
          `- ${gate.label} | Reviewer: ${gate.reviewerRole} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Schema Review Gates:',
    dataContractPack.schemaReviewGates
      .map(
        (gate) =>
          `- ${gate.label} | Required: ${
            gate.required ? 'yes' : 'no'
          } | ${gate.description}`,
      )
      .join('\n'),
    '',
    'Data Contract Risk Register:',
    dataContractPack.dataContractRiskRegister
      .map(
        (risk) =>
          `- ${risk.label} | Severity: ${risk.severity} | Mitigation: ${risk.mitigation}`,
      )
      .join('\n'),
    '',
    'Data Contract Exit Criteria:',
    dataContractPack.dataContractExitCriteria
      .map(
        (criterion) =>
          `- [${criterion.passed ? 'passed' : 'pending'}] ${
            criterion.label
          }: ${criterion.description}`,
      )
      .join('\n'),
    '',
    'Safety Boundary:',
    dataContractPack.safetyBoundary,
    '',
    `Next Recommended Module: ${dataContractPack.nextRecommendedModule}`,
  ].join('\n');

export const PVMetricsDataContractExportTextBox = ({
  dataContractPack = PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK,
}: Props) => {
  const [copiedTarget, setCopiedTarget] = useState<
    'client-contract' | 'internal-review' | null
  >(null);

  const clientContractText = useMemo(
    () => buildClientDataContractText(dataContractPack),
    [dataContractPack],
  );

  const internalReviewText = useMemo(
    () => buildInternalDataContractReviewText(dataContractPack),
    [dataContractPack],
  );

  const handleCopy = async (
    target: 'client-contract' | 'internal-review',
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
          DATA CONTRACT EXPORT
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-50">
          Contrato de datos read-only copiable
        </h3>

        <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
          Export local en texto plano para documentar el contrato conceptual de
          datos read-only. No genera archivos reales, no incorpora datos reales,
          no llama APIs y no ejecuta acciones externas.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Client Data Contract
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Contrato conceptual
              </h4>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy('client-contract', clientContractText)
              }
              className="rounded-xl border border-emerald-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-400/10"
            >
              {copiedTarget === 'client-contract' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={clientContractText}
            className="mt-3 h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300"
          />
        </article>

        <article className="rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Internal Data Review
              </p>
              <h4 className="text-lg font-bold text-slate-100">
                Reporte técnico interno
              </h4>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy('internal-review', internalReviewText)
              }
              className="rounded-xl border border-cyan-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 hover:bg-cyan-400/10"
            >
              {copiedTarget === 'internal-review' ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <textarea
            readOnly
            value={internalReviewText}
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
