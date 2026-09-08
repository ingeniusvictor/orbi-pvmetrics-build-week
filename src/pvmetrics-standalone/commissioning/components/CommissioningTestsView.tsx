import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Database,
  FileCheck2,
  Gauge,
  ShieldCheck,
} from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type {
  CriterionEvaluation,
  CriterionSnapshot,
  Evidence,
  TestExecution,
  TestInstance,
  TestTemplate,
} from '../contracts';

const assessmentClass: Record<string, string> = {
  PASS: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  WARNING: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  FAIL: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  INCONCLUSIVE: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  PENDING: 'border-gray-700 bg-gray-900 text-gray-300',
  ACCEPTED: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  ACCEPTED_WITH_COMMENTS: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  RETEST_REQUIRED: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  REJECTED: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  GOOD: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  DEGRADED: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  POOR: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
  INVALID: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
};

const valueText = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return 'MISSING';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  return String(value);
};

const expectationText = (criterion: CriterionSnapshot): string => {
  const unit = criterion.unit ? ` ${criterion.unit}` : '';
  if (criterion.operator === 'BETWEEN' && criterion.minValue !== undefined && criterion.maxValue !== undefined) {
    return `${criterion.minValue}–${criterion.maxValue}${unit}`;
  }
  if (criterion.operator === 'OUTSIDE' && criterion.minValue !== undefined && criterion.maxValue !== undefined) {
    return `outside ${criterion.minValue}–${criterion.maxValue}${unit}`;
  }
  if (criterion.maxValue !== undefined) return `${criterion.operator} ${criterion.maxValue}${unit}`;
  if (criterion.minValue !== undefined) return `${criterion.operator} ${criterion.minValue}${unit}`;
  if (criterion.expectedValue !== undefined) return `${criterion.operator} ${valueText(criterion.expectedValue)}${unit}`;
  return 'MISSING';
};

const latestExecutionFor = (testInstance: TestInstance, executions: TestExecution[]): TestExecution | undefined =>
  executions
    .filter((execution) => execution.testInstanceId === testInstance.testInstanceId)
    .sort((a, b) => b.executionNumber - a.executionNumber)[0];

const deriveNextAction = (execution: TestExecution | undefined, evidenceCount: number): string => {
  if (!execution) return 'Await an execution record and its approved evidence package.';
  if (execution.dataQuality === 'INVALID' || execution.dataQuality === 'POOR') return 'Review data quality before relying on the assessment.';
  if (execution.orbiAssessment === 'INCONCLUSIVE') return 'Resolve missing data or evidence and repeat the analytical assessment.';
  if (execution.orbiAssessment === 'FAIL') return 'Route the result through human review, Finding and Punch workflows as applicable.';
  if (execution.humanAcceptance === 'RETEST_REQUIRED') return 'Retest evidence is required before closure can be considered.';
  if (execution.humanAcceptance === 'REJECTED') return 'Authorized human rejection is active; review the recorded reason and follow-up workflow.';
  if (evidenceCount === 0) return 'Link required evidence before any acceptance is inferred.';
  if (execution.humanAcceptance === 'PENDING') return 'Authorized human acceptance remains pending.';
  return 'No analytical follow-up is indicated by the stored execution state.';
};

const deriveRisk = (execution: TestExecution | undefined, evidenceCount: number): string => {
  if (!execution) return 'NO EXECUTION RECORD';
  if (execution.dataQuality === 'INVALID' || execution.dataQuality === 'POOR') return 'DATA QUALITY BLOCKER';
  if (execution.orbiAssessment === 'FAIL') return 'ASSESSMENT FAILURE';
  if (execution.orbiAssessment === 'INCONCLUSIVE') return 'ASSESSMENT INCONCLUSIVE';
  if (execution.humanAcceptance === 'REJECTED' || execution.humanAcceptance === 'RETEST_REQUIRED') return 'HUMAN ACTION REQUIRED';
  if (evidenceCount === 0) return 'EVIDENCE LINKAGE REQUIRED';
  if (execution.humanAcceptance === 'PENDING') return 'HUMAN ACCEPTANCE PENDING';
  return 'NO CURRENT ANALYTICAL BLOCKER';
};

export const CommissioningTestsView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const snapshot = state.snapshot;

  const templateById = useMemo(
    () => new Map<string, TestTemplate>(snapshot.testTemplates.map((item): [string, TestTemplate] => [item.testTemplateId, item])),
    [snapshot.testTemplates],
  );
  const assetNameById = useMemo(
    () => new Map(snapshot.assets.map((asset) => [asset.assetId, asset.name] as const)),
    [snapshot.assets],
  );

  if (snapshot.testInstances.length === 0) {
    return (
      <div className="space-y-5" id="commissioning-tests-view">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Test Execution / Detail</p>
          <h2 className="mt-1 text-lg font-bold text-white">No test instances loaded</h2>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-200">The workspace has no test instance records yet.</p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">
            Scope and campaign readiness do not imply that a commissioning test has been executed. Test Detail will populate only from explicit test instances, executions, criteria, calculations and evidence records.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3 text-[10px] leading-relaxed text-cyan-200">
            Shadow Mode: this view never starts tests, changes setpoints, energizes equipment or writes to BMS / PCS / EMS / SCADA.
          </div>
        </div>
      </div>
    );
  }

  const selected = snapshot.testInstances.find((item) => item.testInstanceId === selectedTestId) ?? snapshot.testInstances[0];
  const template = templateById.get(selected.testTemplateId);
  const latestExecution = latestExecutionFor(selected, snapshot.testExecutions);
  const executionId = latestExecution?.executionId;
  const phases = executionId ? snapshot.testPhases.filter((phase) => phase.executionId === executionId) : [];
  const criteria = executionId ? snapshot.criterionSnapshots.filter((criterion) => criterion.executionId === executionId) : [];
  const evaluations = executionId ? snapshot.criterionEvaluations.filter((evaluation) => evaluation.executionId === executionId) : [];
  const calculations = executionId ? snapshot.calculations.filter((calculation) => calculation.executionId === executionId) : [];
  const evidence: Evidence[] = executionId ? snapshot.evidence.filter((item) => item.executionId === executionId) : [];
  const evaluationByCriterionSnapshotId = new Map<string, CriterionEvaluation>(
    evaluations.map(
      (evaluation): [string, CriterionEvaluation] => [evaluation.criterionSnapshotId, evaluation],
    ),
  );
  const nextAction = deriveNextAction(latestExecution, evidence.length);
  const risk = deriveRisk(latestExecution, evidence.length);

  return (
    <div className="space-y-5" id="commissioning-tests-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Test Execution / Detail</p>
          <h2 className="mt-1 text-lg font-bold text-white">Commissioning test record</h2>
        </div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Test instance
          <select
            value={selected.testInstanceId}
            onChange={(event) => setSelectedTestId(event.target.value)}
            className="mt-1 block min-h-11 min-w-72 rounded-lg border border-gray-700 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500"
          >
            {snapshot.testInstances.map((item) => {
              const itemTemplate = templateById.get(item.testTemplateId);
              return <option key={item.testInstanceId} value={item.testInstanceId}>{itemTemplate?.code ?? item.testInstanceId} · {assetNameById.get(item.assetId) ?? item.assetId}</option>;
            })}
          </select>
        </label>
      </div>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" aria-label="Execution status summary">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Status</p>
          <p className="mt-2 text-sm font-bold text-white">{latestExecution?.status ?? selected.status}</p>
          <p className="mt-1 text-[10px] text-gray-500">{latestExecution ? `Execution #${latestExecution.executionNumber} · ${latestExecution.executionType}` : 'Test instance only'}</p>
        </article>
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">ORBI assessment</p>
          <span className={`mt-2 inline-flex rounded border px-2 py-1 text-[10px] font-black ${assessmentClass[latestExecution?.orbiAssessment ?? 'PENDING']}`}>{latestExecution?.orbiAssessment ?? 'NOT EVALUATED'}</span>
          <p className="mt-2 text-[10px] text-gray-500">Analytical result only; not final acceptance.</p>
        </article>
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Human acceptance</p>
          <span className={`mt-2 inline-flex rounded border px-2 py-1 text-[10px] font-black ${assessmentClass[latestExecution?.humanAcceptance ?? 'PENDING']}`}>{latestExecution?.humanAcceptance ?? 'PENDING'}</span>
          <p className="mt-2 text-[10px] text-gray-500">Separate authority from ORBI assessment.</p>
        </article>
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Data quality</p>
          <span className={`mt-2 inline-flex rounded border px-2 py-1 text-[10px] font-black ${assessmentClass[latestExecution?.dataQuality ?? 'PENDING']}`}>{latestExecution?.dataQuality ?? 'NOT AVAILABLE'}</span>
          <p className="mt-2 text-[10px] text-gray-500">Missing/invalid data must not be silently replaced.</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-3" aria-label="Status risk next action">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-gray-500">Current record</p>
          <p className="mt-1 text-xs font-semibold text-gray-200">{template?.name ?? selected.testTemplateId}</p>
          <p className="mt-1 text-[10px] text-gray-500">Asset: {assetNameById.get(selected.assetId) ?? selected.assetId}</p>
        </article>
        <article className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-amber-300">Risk / blocker signal</p>
          <p className="mt-1 text-xs font-bold text-gray-100">{risk}</p>
        </article>
        <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-cyan-300">Next analytical action</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-200">{nextAction}</p>
        </article>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950 p-5">
        <div className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">Test definition</h3></div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 text-[10px]">
          <div><p className="text-gray-600">Code</p><p className="mt-1 font-semibold text-gray-300">{template?.code ?? 'MISSING'}</p></div>
          <div><p className="text-gray-600">Category</p><p className="mt-1 font-semibold text-gray-300">{template?.category ?? 'MISSING'}</p></div>
          <div><p className="text-gray-600">Procedure reference</p><p className="mt-1 font-semibold text-gray-300">{template?.procedureReference ?? 'MISSING'}</p></div>
          <div><p className="text-gray-600">OEM reference</p><p className="mt-1 font-semibold text-gray-300">{template?.oemReference ?? 'MISSING'}</p></div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-400">{template?.description ?? 'No test-template description recorded.'}</p>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950 p-5">
        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-cyan-400" /><h3 className="text-sm font-bold text-white">Detected phases</h3></div><span className="text-[10px] text-gray-500">{phases.length} phase(s)</span></div>
        {phases.length === 0 ? <p className="mt-4 text-xs text-gray-500">No phase records linked to the selected execution.</p> : (
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            {phases.map((phase) => (
              <article key={phase.testPhaseId} className="rounded-lg border border-gray-800 bg-gray-900 p-3 text-[10px]">
                <p className="font-bold text-gray-200">{phase.phaseType}</p>
                <p className="mt-1 text-gray-500">{phase.startedAt} → {phase.endedAt ?? 'OPEN'}</p>
                <p className="mt-1 text-gray-600">Source: {phase.detectionSource}{phase.confidence !== undefined ? ` · confidence ${phase.confidence}` : ''}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-950 p-5">
        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-violet-400" /><h3 className="text-sm font-bold text-white">Criteria & evaluations</h3></div><span className="text-[10px] text-gray-500">{criteria.length} snapshot(s)</span></div>
        {criteria.length === 0 ? <p className="mt-4 text-xs text-gray-500">No criterion snapshots linked to the selected execution.</p> : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-[10px]">
              <caption className="sr-only">Commissioning criteria and recorded evaluations</caption>
              <thead className="border-b border-gray-800 text-gray-500"><tr><th className="px-2 py-2">Criterion</th><th className="px-2 py-2">Expected</th><th className="px-2 py-2">Measured</th><th className="px-2 py-2">Result</th><th className="px-2 py-2">Source</th><th className="px-2 py-2">Evidence</th></tr></thead>
              <tbody>
                {criteria.map((criterion) => {
                  const evaluation = evaluationByCriterionSnapshotId.get(criterion.criterionSnapshotId);
                  return (
                    <tr key={criterion.criterionSnapshotId} className="border-b border-gray-900 align-top">
                      <td className="px-2 py-3"><p className="font-semibold text-gray-200">{criterion.name}</p><p className="mt-1 font-mono text-[9px] text-gray-600">{criterion.variable}</p></td>
                      <td className="px-2 py-3 text-gray-300">{expectationText(criterion)}</td>
                      <td className="px-2 py-3 text-gray-300">{valueText(evaluation?.measuredValue)}{criterion.unit && evaluation?.measuredValue !== null && evaluation?.measuredValue !== undefined ? ` ${criterion.unit}` : ''}</td>
                      <td className="px-2 py-3"><span className={`rounded border px-2 py-1 font-black ${assessmentClass[evaluation?.result ?? 'PENDING']}`}>{evaluation?.result ?? 'NOT EVALUATED'}</span>{evaluation?.reason ? <p className="mt-2 max-w-xs text-gray-500">{evaluation.reason}</p> : null}</td>
                      <td className="px-2 py-3"><p className="text-gray-300">{criterion.sourceType} · {criterion.status}</p><p className="mt-1 text-gray-600">{criterion.sourceReference ?? 'MISSING'}{criterion.sourceRevision ? ` · rev ${criterion.sourceRevision}` : ''}</p></td>
                      <td className="px-2 py-3 text-gray-400">{evaluation?.evidenceIds.length ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Database className="h-4 w-4 text-cyan-400" /><h3 className="text-sm font-bold text-white">Calculated metrics</h3></div><span className="text-[10px] text-gray-500">{calculations.length}</span></div>
          {calculations.length === 0 ? <p className="mt-4 text-xs text-gray-500">No calculations linked to this execution.</p> : <div className="mt-4 space-y-2">{calculations.map((calculation) => <div key={calculation.calculationId} className="rounded-lg border border-gray-800 bg-gray-900 p-3 text-[10px]"><div className="flex justify-between gap-3"><span className="font-semibold text-gray-300">{calculation.metricKey}</span><span className="font-mono text-cyan-300">{valueText(calculation.resultValue)}{calculation.unit ? ` ${calculation.unit}` : ''}</span></div><p className="mt-1 text-gray-600">Algorithm {calculation.algorithmVersion}</p></div>)}</div>}
        </article>

        <article className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">Linked evidence</h3></div><span className="text-[10px] text-gray-500">{evidence.length}</span></div>
          {evidence.length === 0 ? <p className="mt-4 text-xs text-amber-300">No evidence is linked to this execution. A PASS or acceptance must not be inferred from this view.</p> : <div className="mt-4 space-y-2">{evidence.map((item) => <div key={item.evidenceId} className="rounded-lg border border-gray-800 bg-gray-900 p-3 text-[10px]"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-gray-300">{item.name}</p><p className="mt-1 text-gray-600">{item.type} · {item.source}</p></div><span className="font-mono text-gray-600">{item.evidenceId}</span></div></div>)}</div>}
        </article>
      </section>
    </div>
  );
};