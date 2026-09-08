import React, { useMemo, useState } from 'react';
import { FileText, Link2, Search, ShieldCheck } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type { CommissioningAsset, Evidence, EvidenceType, TestExecution } from '../contracts';

type TypeFilter = 'ALL' | EvidenceType;

const evidenceTypes: EvidenceType[] = [
  'PHOTO', 'SCREENSHOT', 'CSV', 'XLSX', 'LOG', 'GRAPH', 'MEASUREMENT',
  'PDF', 'DOCUMENT', 'SCADA', 'BMS', 'PCS', 'COMMENT',
];

const typeClass: Record<EvidenceType, string> = {
  PHOTO: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  SCREENSHOT: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  CSV: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  XLSX: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  LOG: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
  GRAPH: 'border-blue-500/25 bg-blue-500/10 text-blue-300',
  MEASUREMENT: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  PDF: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  DOCUMENT: 'border-gray-500/25 bg-gray-500/10 text-gray-300',
  SCADA: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  BMS: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  PCS: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
  COMMENT: 'border-gray-500/25 bg-gray-500/10 text-gray-300',
};

const shortHash = (value: string): string => value.length > 20 ? `${value.slice(0, 12)}…${value.slice(-8)}` : value;

export const CommissioningEvidenceView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const snapshot = state.snapshot;
  const evidence = snapshot.evidence;
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [query, setQuery] = useState('');

  const assetById = useMemo(
    () => new Map<string, CommissioningAsset>(
      snapshot.assets.map((asset): [string, CommissioningAsset] => [asset.assetId, asset]),
    ),
    [snapshot.assets],
  );
  const executionById = useMemo(
    () => new Map<string, TestExecution>(
      snapshot.testExecutions.map((execution): [string, TestExecution] => [execution.executionId, execution]),
    ),
    [snapshot.testExecutions],
  );

  const linksByEvidenceId = useMemo(() => {
    const links = new Map<string, string[]>();
    const add = (evidenceId: string, label: string) => {
      const current = links.get(evidenceId) ?? [];
      current.push(label);
      links.set(evidenceId, current);
    };

    snapshot.anomalies.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Anomaly · ${item.anomalyId}`)));
    snapshot.findings.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Finding · ${item.findingId}`)));
    snapshot.punchItems.forEach((item) => item.closureEvidenceIds.forEach((id) => add(id, `Punch closure · ${item.punchItemId}`)));
    snapshot.criterionEvaluations.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Criterion evaluation · ${item.criterionEvaluationId}`)));
    snapshot.testPhases.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Test phase · ${item.testPhaseId}`)));
    snapshot.events.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Event · ${item.eventId}`)));
    snapshot.gates.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Gate · ${item.gateId}`)));
    snapshot.handoverPackages.forEach((item) => item.evidenceIds.forEach((id) => add(id, `Handover · ${item.handoverPackageId}`)));
    snapshot.datasets.forEach((item) => {
      if (item.rawEvidenceId) add(item.rawEvidenceId, `Dataset · ${item.datasetId}`);
    });

    return links;
  }, [snapshot]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return evidence.filter((item) => {
      if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
      if (!normalized) return true;
      const asset = item.assetId ? assetById.get(item.assetId) : undefined;
      const linked = linksByEvidenceId.get(item.evidenceId) ?? [];
      return [item.evidenceId, item.name, item.source, item.description, item.fileReference, item.sha256, asset?.name, ...linked]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [assetById, evidence, linksByEvidenceId, query, typeFilter]);

  if (evidence.length === 0) {
    return (
      <div className="space-y-5" id="commissioning-evidence-view">
        <div><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Evidence</p><h2 className="mt-1 text-lg font-bold text-white">No evidence records loaded</h2></div>
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-200">The current snapshot contains no registered commissioning evidence.</p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">Evidence may originate from approved file import, manual registration or existing read-only PVMetrics data. Missing evidence must remain missing; this UI never invents a file, measurement, screenshot or hash.</p>
        </div>
      </div>
    );
  }

  const withHash = evidence.filter((item) => Boolean(item.sha256)).length;
  const executionLinked = evidence.filter((item) => Boolean(item.executionId)).length;
  const assetScoped = evidence.filter((item) => Boolean(item.assetId)).length;
  const referenced = evidence.filter((item) => (linksByEvidenceId.get(item.evidenceId)?.length ?? 0) > 0).length;

  return (
    <div className="space-y-5" id="commissioning-evidence-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Evidence</p>
          <h2 className="mt-1 text-lg font-bold text-white">Commissioning evidence vault</h2>
          <p className="mt-1 text-xs text-gray-500">Read-only evidence registry with explicit source, asset/execution linkage and downstream traceability.</p>
        </div>
        <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-3 py-2 text-[10px] font-semibold text-cyan-200">HASH RECORDED ≠ HASH VERIFIED · NO EVIDENCE FABRICATION</div>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5" aria-label="Evidence summary">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Total</p><p className="mt-2 text-2xl font-black text-white">{evidence.length}</p></article>
        <article className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"><p className="text-[9px] font-black uppercase text-emerald-300">SHA-256 recorded</p><p className="mt-2 text-2xl font-black text-white">{withHash}</p></article>
        <article className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4"><p className="text-[9px] font-black uppercase text-violet-300">Execution-linked</p><p className="mt-2 text-2xl font-black text-white">{executionLinked}</p></article>
        <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"><p className="text-[9px] font-black uppercase text-cyan-300">Asset-scoped</p><p className="mt-2 text-2xl font-black text-white">{assetScoped}</p></article>
        <article className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4"><p className="text-[9px] font-black uppercase text-amber-300">Referenced downstream</p><p className="mt-2 text-2xl font-black text-white">{referenced}</p></article>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]" aria-label="Evidence filters">
        <label className="relative block"><span className="sr-only">Search evidence</span><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, name, source, asset, file or traceability link" className="min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-emerald-500" /></label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as TypeFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500"><option value="ALL">All evidence</option>{evidenceTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center text-xs text-gray-500">No evidence records match the current filters.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item: Evidence) => {
            const asset = item.assetId ? assetById.get(item.assetId) : undefined;
            const execution = item.executionId ? executionById.get(item.executionId) : undefined;
            const links = linksByEvidenceId.get(item.evidenceId) ?? [];
            return (
              <article key={item.evidenceId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                    <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded border px-2 py-1 text-[9px] font-black ${typeClass[item.type]}`}>{item.type}</span><span className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-[9px] font-bold text-gray-300">SOURCE · {item.source}</span></div><h3 className="mt-3 text-sm font-bold text-white">{item.name}</h3><p className="mt-2 max-w-4xl text-xs leading-relaxed text-gray-400">{item.description ?? 'No additional evidence description recorded.'}</p></div>
                  </div>
                  <p className="shrink-0 font-mono text-[9px] text-gray-600">{item.evidenceId}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7 text-[10px]">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Asset</p><p className="mt-1 font-semibold text-gray-300">{asset?.name ?? item.assetId ?? 'PROJECT / GENERAL'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Execution</p><p className="mt-1 break-all font-mono text-gray-400">{execution?.executionId ?? item.executionId ?? 'NOT LINKED'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Captured at</p><p className="mt-1 font-semibold text-gray-300">{item.capturedAt ?? 'NOT RECORDED'}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">File reference</p><p className="mt-1 break-all font-mono text-gray-400">{item.fileReference ?? 'NOT RECORDED'}</p></div>
                  <div className={`rounded-lg border p-3 ${item.sha256 ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-gray-800 bg-gray-900'}`}><p className="text-gray-600">SHA-256</p><p className={`mt-1 font-mono ${item.sha256 ? 'text-emerald-300' : 'text-gray-500'}`}>{item.sha256 ? shortHash(item.sha256) : 'NOT RECORDED'}</p></div>
                  <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3"><p className="text-violet-300">Trace links</p><p className="mt-1 text-lg font-bold text-white">{links.length}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Created by</p><p className="mt-1 font-semibold text-gray-300">{item.createdBy}</p></div>
                </div>

                <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-3">
                  <div className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-cyan-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Downstream traceability</p></div>
                  {links.length === 0 ? <p className="mt-2 text-[10px] text-gray-500">No downstream consumer currently references this Evidence ID.</p> : <div className="mt-2 flex flex-wrap gap-2">{links.map((link) => <span key={link} className="rounded border border-gray-800 bg-gray-950 px-2 py-1 text-[10px] text-gray-400">{link}</span>)}</div>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] leading-relaxed text-gray-500"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />A recorded SHA-256 value is presented as metadata only. PVMetrics must not label evidence as cryptographically verified unless an explicit verification workflow records that result.</div>
    </div>
  );
};