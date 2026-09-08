import React, { useMemo, useState } from 'react';
import { ClipboardCheck, Link2, Search, ShieldCheck } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type {
  CommissioningBaseline,
  Finding,
  HandoverPackage,
  HandoverStatus,
  HumanAcceptanceDecision,
  PunchItem,
} from '../contracts';

type StatusFilter = 'ALL' | HandoverStatus;

const statusClass: Record<HandoverStatus, string> = {
  DRAFT: 'border-gray-700 bg-gray-900 text-gray-300',
  BLOCKED: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  READY: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  APPROVED: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  RECEIVED_BY_O_AND_M: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
};

const isAcceptedDecision = (decision: HumanAcceptanceDecision): boolean =>
  decision.decision === 'ACCEPTED' || decision.decision === 'ACCEPTED_WITH_COMMENTS';

export const CommissioningHandoverView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const snapshot = state.snapshot;
  const packages = snapshot.handoverPackages;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [query, setQuery] = useState('');

  const baselineById = useMemo(
    () => new Map<string, CommissioningBaseline>(
      snapshot.baselines.map((baseline): [string, CommissioningBaseline] => [baseline.baselineId, baseline]),
    ),
    [snapshot.baselines],
  );
  const findingById = useMemo(
    () => new Map<string, Finding>(
      snapshot.findings.map((finding): [string, Finding] => [finding.findingId, finding]),
    ),
    [snapshot.findings],
  );
  const punchById = useMemo(
    () => new Map<string, PunchItem>(
      snapshot.punchItems.map((punch): [string, PunchItem] => [punch.punchItemId, punch]),
    ),
    [snapshot.punchItems],
  );
  const decisionById = useMemo(
    () => new Map<string, HumanAcceptanceDecision>(
      snapshot.humanAcceptanceDecisions.map((decision): [string, HumanAcceptanceDecision] => [decision.acceptanceDecisionId, decision]),
    ),
    [snapshot.humanAcceptanceDecisions],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return packages.filter((handover) => {
      if (statusFilter !== 'ALL' && handover.status !== statusFilter) return false;
      if (!normalized) return true;
      const baseline = handover.baselineId ? baselineById.get(handover.baselineId) : undefined;
      return [
        handover.handoverPackageId,
        handover.projectId,
        handover.scopeId,
        handover.status,
        handover.preparedBy,
        handover.approvedBy,
        handover.receivedByOandM,
        baseline?.revision,
        ...handover.requiredDocumentReferences,
        ...handover.openFindingIds,
        ...handover.openPunchItemIds,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [baselineById, packages, query, statusFilter]);

  if (packages.length === 0) {
    return (
      <div className="space-y-5" id="commissioning-handover-view">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Handover</p>
          <h2 className="mt-1 text-lg font-bold text-white">No handover package loaded</h2>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center">
          <ClipboardCheck className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-200">The current snapshot contains no commissioning handover package.</p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">Handover readiness requires an available baseline, resolved Findings and Punch Items, the governing document set, and explicit human acceptance. An empty register does not imply readiness.</p>
        </div>
      </div>
    );
  }

  const blockedCount = packages.filter((handover) => handover.status === 'BLOCKED').length;
  const readyCount = packages.filter((handover) => handover.status === 'READY').length;
  const approvedCount = packages.filter((handover) => handover.status === 'APPROVED').length;
  const receivedCount = packages.filter((handover) => handover.status === 'RECEIVED_BY_O_AND_M').length;

  return (
    <div className="space-y-5" id="commissioning-handover-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Handover</p>
          <h2 className="mt-1 text-lg font-bold text-white">Commissioning handover readiness</h2>
          <p className="mt-1 text-xs text-gray-500">Stored delivery package, blockers, acceptance evidence and transfer metadata. Operational authorization remains outside PVMetrics.</p>
        </div>
        <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-[10px] font-semibold text-amber-200">READY ≠ ENERGIZATION AUTHORITY · HUMAN / CONTRACTUAL GATES REMAIN EXTERNAL</div>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5" aria-label="Handover summary">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Total</p><p className="mt-2 text-2xl font-black text-white">{packages.length}</p></article>
        <article className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-4"><p className="text-[9px] font-black uppercase text-rose-300">Blocked</p><p className="mt-2 text-2xl font-black text-white">{blockedCount}</p></article>
        <article className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"><p className="text-[9px] font-black uppercase text-emerald-300">Ready</p><p className="mt-2 text-2xl font-black text-white">{readyCount}</p></article>
        <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"><p className="text-[9px] font-black uppercase text-cyan-300">Approved</p><p className="mt-2 text-2xl font-black text-white">{approvedCount}</p></article>
        <article className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4"><p className="text-[9px] font-black uppercase text-violet-300">Received by O&M</p><p className="mt-2 text-2xl font-black text-white">{receivedCount}</p></article>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]" aria-label="Handover filters">
        <label className="relative block"><span className="sr-only">Search handover packages</span><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search package, project, scope, baseline, document or responsible person" className="min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-emerald-500" /></label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500"><option value="ALL">All packages</option><option value="DRAFT">Draft</option><option value="BLOCKED">Blocked</option><option value="READY">Ready</option><option value="APPROVED">Approved</option><option value="RECEIVED_BY_O_AND_M">Received by O&M</option></select></label>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center text-xs text-gray-500">No handover packages match the current filters.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((handover: HandoverPackage) => {
            const baseline = handover.baselineId ? baselineById.get(handover.baselineId) : undefined;
            const openFindings = handover.openFindingIds.map((id) => findingById.get(id)).filter((item): item is Finding => Boolean(item));
            const openPunches = handover.openPunchItemIds.map((id) => punchById.get(id)).filter((item): item is PunchItem => Boolean(item));
            const decisions = handover.humanAcceptanceDecisionIds.map((id) => decisionById.get(id)).filter((item): item is HumanAcceptanceDecision => Boolean(item));
            const acceptedDecision = decisions.some(isAcceptedDecision);
            const missingDecisionRefs = handover.humanAcceptanceDecisionIds.length - decisions.length;
            const baselineReady = baseline?.status === 'AVAILABLE';

            const visibleBlockers: string[] = [];
            if (!baselineReady) visibleBlockers.push(baseline ? `Baseline ${baseline.baselineId} is ${baseline.status}.` : 'No AVAILABLE baseline is resolved in the current snapshot.');
            if (handover.openFindingIds.length > 0) visibleBlockers.push(`${handover.openFindingIds.length} open Finding reference(s) are stored on the package.`);
            if (handover.openPunchItemIds.length > 0) visibleBlockers.push(`${handover.openPunchItemIds.length} open Punch reference(s) are stored on the package.`);
            if (!acceptedDecision) visibleBlockers.push('No resolved ACCEPTED / ACCEPTED_WITH_COMMENTS decision is available from the package decision references.');
            if (missingDecisionRefs > 0) visibleBlockers.push(`${missingDecisionRefs} human acceptance decision reference(s) are not loaded.`);

            return (
              <article key={handover.handoverPackageId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className={`rounded border px-2 py-1 text-[9px] font-black ${statusClass[handover.status]}`}>{handover.status.replaceAll('_', ' ')}</span>{baseline ? <span className={`rounded border px-2 py-1 text-[9px] font-black ${baselineReady ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>BASELINE · {baseline.status}</span> : <span className="rounded border border-rose-500/25 bg-rose-500/10 px-2 py-1 text-[9px] font-black text-rose-300">BASELINE · MISSING</span>}</div>
                    <h3 className="mt-3 text-sm font-bold text-white">Handover package · {handover.handoverPackageId}</h3>
                    <p className="mt-2 text-xs text-gray-500">Project <span className="font-mono text-gray-400">{handover.projectId}</span> · Scope <span className="font-mono text-gray-400">{handover.scopeId}</span></p>
                  </div>
                  <div className="shrink-0 text-right"><p className="text-[9px] text-gray-600">Updated by</p><p className="mt-1 text-[10px] font-semibold text-gray-300">{handover.updatedBy}</p><p className="mt-1 font-mono text-[9px] text-gray-600">{handover.updatedAt}</p></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8 text-[10px]">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Baseline</p><p className="mt-1 break-all font-mono text-gray-400">{handover.baselineId ?? 'MISSING'}</p></div>
                  <div className={`rounded-lg border p-3 ${handover.openFindingIds.length > 0 ? 'border-rose-500/15 bg-rose-500/5' : 'border-emerald-500/15 bg-emerald-500/5'}`}><p className={handover.openFindingIds.length > 0 ? 'text-rose-300' : 'text-emerald-300'}>Open Findings</p><p className="mt-1 text-lg font-bold text-white">{handover.openFindingIds.length}</p></div>
                  <div className={`rounded-lg border p-3 ${handover.openPunchItemIds.length > 0 ? 'border-orange-500/15 bg-orange-500/5' : 'border-emerald-500/15 bg-emerald-500/5'}`}><p className={handover.openPunchItemIds.length > 0 ? 'text-orange-300' : 'text-emerald-300'}>Open Punch</p><p className="mt-1 text-lg font-bold text-white">{handover.openPunchItemIds.length}</p></div>
                  <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3"><p className="text-cyan-300">Documents recorded</p><p className="mt-1 text-lg font-bold text-white">{handover.requiredDocumentReferences.length}</p></div>
                  <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3"><p className="text-violet-300">Evidence</p><p className="mt-1 text-lg font-bold text-white">{handover.evidenceIds.length}</p></div>
                  <div className={`rounded-lg border p-3 ${acceptedDecision ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-amber-500/15 bg-amber-500/5'}`}><p className={acceptedDecision ? 'text-emerald-300' : 'text-amber-300'}>Human accepted</p><p className="mt-1 font-black text-white">{acceptedDecision ? 'YES' : 'NO'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Prepared by</p><p className="mt-1 font-semibold text-gray-300">{handover.preparedBy ?? 'PENDING'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Received by O&M</p><p className="mt-1 font-semibold text-gray-300">{handover.receivedByOandM ?? 'PENDING'}</p></div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <div className={`rounded-lg border p-3 ${visibleBlockers.length > 0 ? 'border-amber-500/15 bg-amber-500/5' : 'border-emerald-500/15 bg-emerald-500/5'}`}>
                    <div className="flex items-center gap-2"><ShieldCheck className={`h-3.5 w-3.5 ${visibleBlockers.length > 0 ? 'text-amber-300' : 'text-emerald-300'}`} /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Visible readiness indicators</p></div>
                    {visibleBlockers.length === 0 ? <p className="mt-2 text-[10px] leading-relaxed text-emerald-200">No blocker is visible from baseline, stored Finding/Punch references or resolved human decision references. Document completeness still requires the governing required-document list.</p> : <div className="mt-2 space-y-1">{visibleBlockers.map((blocker) => <p key={blocker} className="text-[10px] leading-relaxed text-amber-200">• {blocker}</p>)}</div>}
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
                    <div className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-cyan-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Transfer milestones</p></div>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-[10px] md:grid-cols-3"><div><p className="text-gray-600">Prepared</p><p className="mt-1 text-gray-300">{handover.preparedBy ?? 'PENDING'}</p><p className="font-mono text-gray-600">{handover.preparedAt ?? '—'}</p></div><div><p className="text-gray-600">Approved</p><p className="mt-1 text-gray-300">{handover.approvedBy ?? 'PENDING'}</p><p className="font-mono text-gray-600">{handover.approvedAt ?? '—'}</p></div><div><p className="text-gray-600">O&M receipt</p><p className="mt-1 text-gray-300">{handover.receivedByOandM ?? 'PENDING'}</p><p className="font-mono text-gray-600">{handover.receivedAt ?? '—'}</p></div></div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Required document references recorded</p>{handover.requiredDocumentReferences.length === 0 ? <p className="mt-2 text-[10px] text-gray-500">No document references recorded on this package.</p> : <div className="mt-2 space-y-1">{handover.requiredDocumentReferences.map((reference) => <p key={reference} className="break-all text-[10px] text-gray-400">{reference}</p>)}</div>}<p className="mt-3 text-[9px] leading-relaxed text-amber-300">PVMetrics cannot infer missing contractual documents unless the governing required-document list is provided to the readiness workflow.</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Open issue references</p>{handover.openFindingIds.length === 0 && handover.openPunchItemIds.length === 0 ? <p className="mt-2 text-[10px] text-emerald-300">No open Finding or Punch references stored.</p> : <div className="mt-2 space-y-2">{handover.openFindingIds.map((id) => { const finding = findingById.get(id); return <div key={id} className="rounded border border-rose-500/10 bg-gray-950 p-2 text-[10px]"><p className="font-mono text-rose-300">{id}</p><p className="mt-1 text-gray-300">{finding?.title ?? 'Finding not loaded.'}</p>{finding ? <p className="mt-1 text-gray-600">{finding.severity} · {finding.status}</p> : null}</div>; })}{handover.openPunchItemIds.map((id) => { const punch = punchById.get(id); return <div key={id} className="rounded border border-orange-500/10 bg-gray-950 p-2 text-[10px]"><p className="font-mono text-orange-300">{id}</p><p className="mt-1 text-gray-300">{punch?.description ?? 'Punch Item not loaded.'}</p>{punch ? <p className="mt-1 text-gray-600">{punch.severity} · {punch.status}</p> : null}</div>; })}</div>}</div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Human acceptance decisions</p>{handover.humanAcceptanceDecisionIds.length === 0 ? <p className="mt-2 text-[10px] text-amber-300">No acceptance decision references stored.</p> : <div className="mt-2 space-y-2">{handover.humanAcceptanceDecisionIds.map((id) => { const decision = decisionById.get(id); return <div key={id} className="rounded border border-gray-800 bg-gray-950 p-2 text-[10px]"><p className="font-mono text-gray-500">{id}</p>{decision ? <><p className={`mt-1 font-black ${isAcceptedDecision(decision) ? 'text-emerald-300' : 'text-amber-300'}`}>{decision.decision.replaceAll('_', ' ')}</p><p className="mt-1 text-gray-500">{decision.decidedBy} · {decision.decidedAt}</p><p className="mt-1 text-gray-400">{decision.reason}</p></> : <p className="mt-1 text-amber-300">Decision record not loaded.</p>}</div>; })}</div>}</div>
                </div>

                <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-[10px] leading-relaxed text-gray-500">Stored status: <span className="font-black text-gray-300">{handover.status.replaceAll('_', ' ')}</span>. This screen does not recompute, approve, receive or modify the package. If stored status and current visible references appear inconsistent, the package must be re-evaluated through the approved Handover workflow.</div>
              </article>
            );
          })}
        </div>
      )}

      <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] leading-relaxed text-gray-500"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />The canonical readiness engine requires an AVAILABLE baseline, zero open Findings, zero open Punch Items, complete required-document references and at least one accepted human decision. READY / APPROVED / RECEIVED_BY_O_AND_M are documentary commissioning states and do not issue OT commands or energization authority.</div>
    </div>
  );
};