import type { ReactNode } from 'react';
import { PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK } from '../../data/pvMetricsSanitizedSampleDataMockData';
import { PVMetricsControlledSanitizedSampleDataPack } from '../../types/pvmetrics-sanitized-sample-data.types';

type Props = {
  sampleDataPack?: PVMetricsControlledSanitizedSampleDataPack;
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

export const PVMetricsSanitizedSampleDataVisualCard = ({
  sampleDataPack = PV_METRICS_CONTROLLED_SANITIZED_SAMPLE_DATA_PACK_MOCK,
}: Props) => {
  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-slate-950/90 p-5 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            SANITIZED SAMPLE DATA
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-50">
            Controlled Sanitized Sample Data Visual Card
          </h3>
          <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-400">
            Vista local para revisar muestras sintéticas/sanitizadas demo-only:
            propósito, reglas synthetic-first, requisitos de sanitización,
            dominios, placeholders, gates, riesgos y límites de seguridad.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-300">
            Estado
          </p>
          <p className="mt-1 text-sm font-black uppercase text-emerald-100">
            {sampleDataPack.status}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Versión
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {sampleDataPack.internalVersion}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Roadmap
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {sampleDataPack.roadmapBlock}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Generado
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">
            {sampleDataPack.generatedAtLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Sample Data Purpose" eyebrow="Purpose">
          {sampleDataPack.sampleDataPurpose.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300"
            >
              {item}
            </p>
          ))}
        </Panel>

        <Panel title="Sanitized Sample Data Principles" eyebrow="Principles">
          {sampleDataPack.sanitizedSampleDataPrinciples.map((principle) => (
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

        <Panel title="Allowed Sample Data Items" eyebrow="Allowed">
          {sampleDataPack.allowedSampleDataItems.map((item) => (
            <article
              key={item.itemId}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-emerald-100">
                  {item.label}
                </h5>
                <Badge>{item.sampleMode}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              <p className="mt-2 text-xs text-emerald-100">
                Revisión: {item.requiresApproval ? 'YES' : 'NO'}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Blocked Sample Data Items" eyebrow="Blocked">
          {sampleDataPack.blockedSampleDataItems.map((item) => (
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

        <Panel title="Synthetic Sample Rules" eyebrow="Synthetic-first">
          {sampleDataPack.syntheticSampleRules.map((rule) => (
            <article
              key={rule.ruleId}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/10 p-3"
            >
              <h5 className="text-sm font-black text-blue-100">
                {rule.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">
                {rule.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Sanitization Requirements" eyebrow="Sanitization">
          {sampleDataPack.sanitizationRequirements.map((requirement) => (
            <article
              key={requirement.requirementId}
              className="rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-3"
            >
              <h5 className="text-sm font-black text-cyan-100">
                {requirement.label}
              </h5>
              <p className="mt-2 text-sm text-slate-300">
                {requirement.description}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Forbidden Sample Content" eyebrow="Forbidden">
          {sampleDataPack.forbiddenSampleContent.map((content) => (
            <article
              key={content.contentId}
              className="rounded-2xl border border-rose-400/20 bg-rose-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-rose-100">
                  {content.label}
                </h5>
                <RiskBadge severity={content.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{content.reason}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Sample Data Domains" eyebrow="Domains">
          {sampleDataPack.sampleDataDomains.map((domain) => (
            <article
              key={domain.domainId}
              className="rounded-2xl border border-violet-400/20 bg-violet-950/10 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-violet-100">
                  {domain.label}
                </h5>
                <Badge>{domain.sampleMode}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {domain.description}
              </p>
            </article>
          ))}
        </Panel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Panel title="Sample Data Field Placeholders" eyebrow="Placeholders">
          {sampleDataPack.sampleDataFieldPlaceholders.map((placeholder) => (
            <article
              key={placeholder.placeholderId}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-sm font-black text-slate-100">
                  {placeholder.label}
                </h5>
                <Badge>{placeholder.sampleMode}</Badge>
              </div>
              <p className="mt-2 font-mono text-xs text-emerald-100">
                {placeholder.placeholderValue}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {placeholder.rule}
              </p>
            </article>
          ))}
        </Panel>

        <Panel title="Sample Data Quality Gates" eyebrow="Quality">
          {sampleDataPack.sampleDataQualityGates.map((gate) => (
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

        <Panel title="Sample Data Privacy Gates" eyebrow="Privacy">
          {sampleDataPack.sampleDataPrivacyGates.map((gate) => (
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

        <Panel title="Sample Data Approval Gates" eyebrow="Approval">
          {sampleDataPack.sampleDataApprovalGates.map((gate) => (
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

        <Panel title="Sample Data Risk Register" eyebrow="Risks">
          {sampleDataPack.sampleDataRiskRegister.map((risk) => (
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

        <Panel title="Sample Data Exit Criteria" eyebrow="Closure">
          {sampleDataPack.sampleDataExitCriteria.map((criterion) => (
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
          {sampleDataPack.safetyBoundary}
        </p>
      </div>
    </section>
  );
};
