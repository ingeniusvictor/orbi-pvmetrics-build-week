import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK } from '../../data/pvMetricsReadOnlyDataContractMockData';
import { PVMetricsControlledReadOnlyDataContractPack } from '../../types/pvmetrics-read-only-data-contract.types';

type Props = {
  dataContractPack?: PVMetricsControlledReadOnlyDataContractPack;
};

type PanelProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

const Panel = ({ title, eyebrow, children }: PanelProps) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
        {eyebrow}
      </p>
    )}
    <h4 className="mt-1 text-lg font-black text-slate-50">{title}</h4>
    <div className="mt-3 space-y-3">{children}</div>
  </section>
);

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full border border-emerald-400/30 bg-emerald-950/30 px-3 py-1 text-xs font-bold uppercase text-emerald-100">
    {children}
  </span>
);

const RiskBadge = ({ severity }: { severity: string }) => {
  const tone =
    severity === 'critical'
      ? 'border-rose-400/40 bg-rose-950/40 text-rose-100'
      : severity === 'high'
        ? 'border-amber-400/40 bg-amber-950/40 text-amber-100'
        : severity === 'medium'
          ? 'border-cyan-400/40 bg-cyan-950/40 text-cyan-100'
          : 'border-emerald-400/40 bg-emerald-950/40 text-emerald-100';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${tone}`}>
      {severity}
    </span>
  );
};

const RequiredBadge = ({ required }: { required: boolean }) => (
  <span
    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
      required
        ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-100'
        : 'border-slate-500/40 bg-slate-900/60 text-slate-300'
    }`}
  >
    {required ? 'Required' : 'Optional'}
  </span>
);

export const PVMetricsDataContractVisualCard = ({
  dataContractPack = PV_METRICS_CONTROLLED_READ_ONLY_DATA_CONTRACT_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            READ-ONLY DATA CONTRACT
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Controlled Data Contract Visual Card
          </h3>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para revisar el contrato conceptual de datos read-only:
            dominios, campos requeridos, campos opcionales, campos prohibidos,
            gates de calidad, sanitización, ownership, esquema, riesgos y límites
            de seguridad.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-emerald-100">
            {dataContractPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {dataContractPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {dataContractPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {dataContractPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Data Contract Purpose" eyebrow="Purpose">
          {dataContractPack.dataContractPurpose.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300"
            >
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Read-Only Data Contract Principles" eyebrow="Principles">
          {dataContractPack.readOnlyDataContractPrinciples.map((principle) => (
            <article
              key={principle.principleId}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-cyan-100">
                  {principle.label}
                </h5>
                <Badge>{principle.mandatory ? 'Mandatory' : 'Optional'}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {principle.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Allowed Data Contract Items" eyebrow="Allowed">
          {dataContractPack.allowedDataContractItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3"
            >
              <h5 className="text-sm font-black text-emerald-100">
                {item.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              <p className="mt-2 text-xs text-emerald-100">
                Revisión humana: {item.requiresHumanReview ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Blocked Data Contract Items" eyebrow="Blocked">
          {dataContractPack.blockedDataContractItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-rose-100">
                  {item.label}
                </h5>
                <RiskBadge severity={item.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.reason}</p>
              <p className="mt-2 text-xs text-cyan-100">
                Alternativa segura: {item.safeAlternative}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Required Data Domains" eyebrow="Domains">
          {dataContractPack.requiredDataDomains.map((domain) => (
            <article
              key={domain.domainId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">
                  {domain.label}
                </h5>
                <RequiredBadge required={domain.required} />
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {domain.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Required Data Fields" eyebrow="Required fields">
          {dataContractPack.requiredDataFields.map((field) => (
            <article
              key={field.fieldId}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-blue-100">
                  {field.label}
                </h5>
                <Badge>{field.expectedUnit}</Badge>
              </div>
              <p className="mt-2 text-xs text-blue-100">
                Domain: {field.domain} | Type: {field.expectedType}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {field.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Optional Data Fields" eyebrow="Optional fields">
          {dataContractPack.optionalDataFields.map((field) => (
            <article
              key={field.fieldId}
              className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3"
            >
              <h5 className="text-sm font-black text-violet-100">
                {field.label}
              </h5>
              <p className="mt-2 text-xs text-violet-100">
                Domain: {field.domain} | Type: {field.expectedType} | Unit:{' '}
                {field.expectedUnit}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {field.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Forbidden Data Fields" eyebrow="Forbidden fields">
          {dataContractPack.forbiddenDataFields.map((field) => (
            <article
              key={field.fieldId}
              className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-rose-100">
                  {field.fieldId === 'forbidden-personal-data' ? 'personalData' : field.label}
                </h5>
                <RiskBadge severity={field.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{field.reason}</p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Data Quality Gates" eyebrow="Quality">
          {dataContractPack.dataQualityGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <h5 className="text-sm font-black text-slate-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-sm text-slate-400">
                {gate.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Data Sanitization Gates" eyebrow="Sanitization">
          {dataContractPack.dataSanitizationGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3"
            >
              <h5 className="text-sm font-black text-cyan-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">
                {gate.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Data Ownership Gates" eyebrow="Ownership">
          {dataContractPack.dataOwnershipGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3"
            >
              <h5 className="text-sm font-black text-amber-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-xs text-amber-100">
                Reviewer: {gate.reviewerRole} | Required:{' '}
                {gate.required ? 'YES' : 'NO'}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {gate.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Schema Review Gates" eyebrow="Schema">
          {dataContractPack.schemaReviewGates.map((gate) => (
            <article
              key={gate.gateId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <h5 className="text-sm font-black text-slate-100">
                {gate.label}
              </h5>
              <p className="mt-2 text-sm text-slate-400">
                {gate.description}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Data Contract Risk Register" eyebrow="Risks">
          {dataContractPack.dataContractRiskRegister.map((risk) => (
            <article
              key={risk.riskId}
              className="rounded-2xl border border-amber-400/20 bg-amber-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-amber-100">
                  {risk.label}
                </h5>
                <RiskBadge severity={risk.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {risk.mitigation}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Data Contract Exit Criteria" eyebrow="Closure">
          {dataContractPack.dataContractExitCriteria.map((criterion) => (
            <article
              key={criterion.criterionId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <Badge>{criterion.passed ? 'Passed' : 'Pending'}</Badge>
              <h5 className="mt-2 text-sm font-black text-slate-100">
                {criterion.label}
              </h5>
              <p className="mt-2 text-sm text-slate-400">
                {criterion.description}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-950/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">
          Safety Boundary
        </p>
        <p className="mt-2 text-sm leading-6 text-rose-100">
          {dataContractPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
