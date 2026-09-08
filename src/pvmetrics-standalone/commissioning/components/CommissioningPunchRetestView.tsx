import React, { useMemo, useState } from 'react';
import { AlertCircle, ClipboardCheck, Link2, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type {
  CommissioningAsset,
  Finding,
  FindingSeverity,
  PunchItem,
  PunchStatus,
  TestExecution,
} from '../contracts';
import { canClosePunchItem } from '../engine/punchEngine';

const severityClass: Record<FindingSeverity, string> = {
  INFO: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  WARNING: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  MAJOR: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
  CRITICAL: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
};

const statusClass: Record<PunchStatus, string> = {
  OPEN: 'text-cyan-300',
  ASSIGNED: 'text-violet-300',
  IN_PROGRESS: 'text-orange-300',
  READY_FOR_RETEST: 'text-amber-300',
  CLOSED: 'text-emerald-300',
};

type StatusFilter = 'ALL' | PunchStatus;

type ClosureAssessment = {
  label: string;
  nextAction: string;
  ready: boolean;
};

const getClosureAssessment = (
  punch: PunchItem,
  executions: readonly TestExecution[],
): ClosureAssessment => {
  if (punch.status === 'CLOSED') {
    return {
      label: 'CLOSED',
      nextAction: 'No further Punch workflow action is required unless an authorized review reopens the item.',
      ready: true,
    };
  }

  const closure = canClosePunchItem(punch, executions);
  if (closure.allowed) {
    return {
      label: 'ELIGIBLE FOR AUTHORIZED CLOSURE',
      nextAction: 'Authorized human closure may proceed. This UI does not perform the closure.',
      ready: true,
    };
  }

  if (punch.retestRequirement !== 'NO' && punch.retestExecutionIds.length === 0) {
    return {
      label: 'RETEST REQUIRED',
      nextAction: punch.status === 'READY_FOR_RETEST'
        ? 'Create the retest through the approved workflow and preserve the parent execution linkage.'
        : 'Complete the corrective workflow and reach READY_FOR_RETEST before a retest can be created.',
      ready: false,
    };
  }

  if (punch.retestRequirement !== 'NO') {
    const linked = executions.filter((execution) => punch.retestExecutionIds.includes(execution.executionId));
    const acceptedPass = linked.some((execution) =>
      execution.executionType === 'RETEST' &&
      execution.orbiAssessment === 'PASS' &&
      (execution.humanAcceptance === 'ACCEPTED' || execution.humanAcceptance === 'ACCEPTED_WITH_COMMENTS'),
    );
    if (!acceptedPass) {
      return {
        label: 'RETEST REVIEW PENDING',
        nextAction: 'Complete and review the linked retest. ORBI PASS and explicit human acceptance are both required.',
        ready: false,
      };
    }
  }

  if (punch.closureEvidenceIds.length === 0) {
    return {
      label: 'CLOSURE EVIDENCE REQUIRED',
      nextAction: 'Attach or register explicit closure evidence before authorized closure.',
      ready: false,
    };
  }

  return {
    label: 'BLOCKED',
    nextAction: closure.reason ?? 'Resolve the remaining Punch workflow blocker before closure.',
    ready: false,
  };
};

export const CommissioningPunchRetestView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const snapshot = state.snapshot;
  const punches = snapshot.punchItems;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [query, setQuery] = useState('');

  const assetById = useMemo(
    () => new Map<string, CommissioningAsset>(
      snapshot.assets.map((asset): [string, CommissioningAsset] => [asset.assetId, asset]),
    ),
    [snapshot.assets],
  );
  const findingById = useMemo(
    () => new Map<string, Finding>(
      snapshot.findings.map((finding): [string, Finding] => [finding.findingId, finding]),
    ),
    [snapshot.findings],
  );
  const executionById = useMemo(
    () => new Map<string, TestExecution>(
      snapshot.testExecutions.map((execution): [string, TestExecution] => [execution.executionId, execution]),
    ),
    [snapshot.testExecutions],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return punches.filter((punch) => {
      if (statusFilter !== 'ALL' && punch.status !== statusFilter) return false;
      if (!normalized) return true;
      const finding = findingById.get(punch.findingId);
      const asset = assetById.get(punch.assetId);
      return [
        punch.punchItemId,
        punch.description,
        punch.requiredAction,
        punch.status,
        punch.responsibleParty,
        punch.assignedTo,
        finding?.title,
        asset?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [assetById, findingById, punches, query, statusFilter]);

  if (punches.length === 0) {
    return (
      <div className="space-y-5" id="commissioning-punch-retest-view">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Punch List + Retest</p>
          <h2 className="mt-1 text-lg font-bold text-white">No Punch Items loaded</h2>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center">
          <ClipboardCheck className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-200">The current snapshot contains no formal Punch Items.</p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">Punch Items are created from formal Findings according to the approved workflow. An empty register does not imply commissioning acceptance or handover readiness.</p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-[10px] leading-relaxed text-amber-200">Retest creation and Punch closure remain controlled workflow actions. This screen only reads stored state and evaluates closure prerequisites.</div>
        </div>
      </div>
    );
  }

  const openCount = punches.filter((punch) => punch.status !== 'CLOSED').length;
  const readyForRetestCount = punches.filter((punch) => punch.status === 'READY_FOR_RETEST').length;
  const retestRequiredCount = punches.filter((punch) => punch.retestRequirement !== 'NO').length;
  const closureEligibleCount = punches.filter((punch) => getClosureAssessment(punch, snapshot.testExecutions).ready).length;

  return (
    <div className="space-y-5" id="commissioning-punch-retest-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Punch List + Retest</p>
          <h2 className="mt-1 text-lg font-bold text-white">Corrective workflow and retest traceability</h2>
          <p className="mt-1 text-xs text-gray-500">Punch status, retest linkage, ORBI assessment, human acceptance and closure evidence remain separate auditable signals.</p>
        </div>
        <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-[10px] font-semibold text-amber-200">READ-ONLY · NO AUTO-CLOSE · HUMAN AUTHORITY REQUIRED</div>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5" aria-label="Punch summary">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Total</p><p className="mt-2 text-2xl font-black text-white">{punches.length}</p></article>
        <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"><p className="text-[9px] font-black uppercase text-cyan-300">Open</p><p className="mt-2 text-2xl font-black text-white">{openCount}</p></article>
        <article className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4"><p className="text-[9px] font-black uppercase text-amber-300">Ready for retest</p><p className="mt-2 text-2xl font-black text-white">{readyForRetestCount}</p></article>
        <article className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4"><p className="text-[9px] font-black uppercase text-violet-300">Retest required</p><p className="mt-2 text-2xl font-black text-white">{retestRequiredCount}</p></article>
        <article className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"><p className="text-[9px] font-black uppercase text-emerald-300">Closure-ready / closed</p><p className="mt-2 text-2xl font-black text-white">{closureEligibleCount}</p></article>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]" aria-label="Punch filters">
        <label className="relative block">
          <span className="sr-only">Search Punch Items</span>
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-600" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, action, Finding, asset or assignee" className="min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-emerald-500" />
        </label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500"><option value="ALL">All statuses</option><option value="OPEN">Open</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In progress</option><option value="READY_FOR_RETEST">Ready for retest</option><option value="CLOSED">Closed</option></select></label>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center text-xs text-gray-500">No Punch Items match the current filters.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((punch) => {
            const finding = findingById.get(punch.findingId);
            const asset = assetById.get(punch.assetId);
            const linkedRetests = punch.retestExecutionIds
              .map((executionId) => executionById.get(executionId))
              .filter((execution): execution is TestExecution => Boolean(execution));
            const closure = getClosureAssessment(punch, snapshot.testExecutions);

            return (
              <article key={punch.punchItemId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${punch.severity === 'CRITICAL' ? 'text-rose-400' : punch.severity === 'MAJOR' ? 'text-orange-400' : punch.severity === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded border px-2 py-1 text-[9px] font-black ${severityClass[punch.severity]}`}>{punch.severity}</span>
                        <span className={`text-[9px] font-black ${statusClass[punch.status]}`}>{punch.status.replaceAll('_', ' ')}</span>
                        <span className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-[9px] font-bold text-gray-300">RETEST · {punch.retestRequirement}</span>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-white">{punch.description}</h3>
                      <p className="mt-2 max-w-4xl text-xs leading-relaxed text-gray-400">Required action: {punch.requiredAction}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right"><p className="font-mono text-[9px] text-gray-600">{punch.punchItemId}</p><span className={`mt-2 inline-flex rounded border px-2 py-1 text-[9px] font-black ${closure.ready ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>{closure.label}</span></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8 text-[10px]">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Asset</p><p className="mt-1 font-semibold text-gray-300">{asset?.name ?? punch.assetId}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Finding</p><p className="mt-1 break-all font-mono text-gray-400">{finding?.findingId ?? punch.findingId}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Responsible</p><p className="mt-1 font-semibold text-gray-300">{punch.responsibleParty ?? 'UNASSIGNED'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Assigned to</p><p className="mt-1 font-semibold text-gray-300">{punch.assignedTo ?? 'UNASSIGNED'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Target date</p><p className="mt-1 font-semibold text-gray-300">{punch.targetDate ?? 'NOT SET'}</p></div>
                  <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3"><p className="text-violet-300">Linked retests</p><p className="mt-1 text-lg font-bold text-white">{punch.retestExecutionIds.length}</p></div>
                  <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3"><p className="text-cyan-300">Closure evidence</p><p className="mt-1 text-lg font-bold text-white">{punch.closureEvidenceIds.length}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Closed by</p><p className="mt-1 font-semibold text-gray-300">{punch.closedBy ?? 'OPEN'}</p></div>
                </div>

                <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/5 p-3">
                  <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-amber-300" /><p className="text-[9px] font-black uppercase tracking-wider text-amber-300">Next workflow action</p></div>
                  <p className="mt-2 text-[10px] leading-relaxed text-gray-300">{closure.nextAction}</p>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
                    <div className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-cyan-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Finding linkage</p></div>
                    <p className="mt-2 text-[10px] font-semibold text-gray-300">{finding?.title ?? 'Linked Finding is not loaded in this snapshot.'}</p>
                    {finding ? <p className="mt-1 text-[10px] leading-relaxed text-gray-500">Finding status: {finding.status.replaceAll('_', ' ')} · Root cause: {finding.rootCauseState}</p> : null}
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
                    <div className="flex items-center gap-2"><RotateCcw className="h-3.5 w-3.5 text-violet-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Retest executions</p></div>
                    {punch.retestExecutionIds.length === 0 ? (
                      <p className="mt-2 text-[10px] text-gray-500">No retest execution is linked.</p>
                    ) : linkedRetests.length === 0 ? (
                      <p className="mt-2 text-[10px] text-amber-300">Retest IDs exist, but the corresponding executions are not loaded in this snapshot.</p>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {linkedRetests.map((execution) => (
                          <div key={execution.executionId} className="rounded border border-gray-800 bg-gray-950 p-2 text-[10px]">
                            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-gray-500">{execution.executionId}</span><span className="font-black text-violet-300">{execution.executionType}</span></div>
                            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4"><span className="text-gray-500">Status <b className="text-gray-300">{execution.status}</b></span><span className="text-gray-500">DQ <b className="text-gray-300">{execution.dataQuality}</b></span><span className="text-gray-500">ORBI <b className={execution.orbiAssessment === 'PASS' ? 'text-emerald-300' : execution.orbiAssessment === 'FAIL' ? 'text-rose-300' : 'text-amber-300'}>{execution.orbiAssessment}</b></span><span className="text-gray-500">Human <b className={execution.humanAcceptance.startsWith('ACCEPTED') ? 'text-emerald-300' : 'text-amber-300'}>{execution.humanAcceptance}</b></span></div>
                            <p className="mt-2 text-gray-600">Parent: {execution.parentExecutionId ?? 'MISSING'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] leading-relaxed text-gray-500">Closure eligibility is informational. A green eligibility state never closes the Punch Item, never changes human acceptance, and never authorizes energization or operation.</div>
    </div>
  );
};