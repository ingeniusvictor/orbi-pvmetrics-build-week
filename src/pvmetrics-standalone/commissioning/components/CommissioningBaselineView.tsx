import React, { useMemo, useState } from 'react';
import { ClipboardCheck, Link2, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type {
  CommissioningAsset,
  CommissioningBaseline,
  Finding,
  TestExecution,
} from '../contracts';

type BaselineStatus = CommissioningBaseline['status'];
type StatusFilter = 'ALL' | BaselineStatus;

const statusClass: Record<BaselineStatus, string> = {
  DRAFT: 'border-gray-700 bg-gray-900 text-gray-300',
  AVAILABLE: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  SUPERSEDED: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
};

const formatMetricValue = (value: number | string | boolean | null, unit?: string): string => {
  if (value === null) return 'NULL';
  const rendered = typeof value === 'boolean' ? (value ? 'TRUE' : 'FALSE') : String(value);
  return unit ? `${rendered} ${unit}` : rendered;
};

export const CommissioningBaselineView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const snapshot = state.snapshot;
  const baselines = snapshot.baselines;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
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
  const findingById = useMemo(
    () => new Map<string, Finding>(
      snapshot.findings.map((finding): [string, Finding] => [finding.findingId, finding]),
    ),
    [snapshot.findings],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return baselines.filter((baseline) => {
      if (statusFilter !== 'ALL' && baseline.status !== statusFilter) return false;
      if (!normalized) return true;
      const asset = assetById.get(baseline.assetId);
      return [
        baseline.baselineId,
        baseline.revision,
        baseline.status,
        baseline.acceptedBy,
        asset?.name,
        ...baseline.metrics.map((metric) => metric.metricKey),
        ...baseline.configurationReferences,
        ...baseline.knownDeviationFindingIds,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [assetById, baselines, query, statusFilter]);

  if (baselines.length === 0) {
    return (
      <div className="space-y-5" id="commissioning-baseline-view">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Baseline</p>
          <h2 className="mt-1 text-lg font-bold text-white">No commissioning baseline loaded</h2>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center">
          <ClipboardCheck className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-200">The current snapshot contains no accepted baseline artifact.</p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">A commissioning baseline is valid only when it is built from metrics belonging to an ORBI PASS execution with explicit human acceptance. Missing baseline data remains missing and must not be inferred from monitoring values.</p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-[10px] leading-relaxed text-amber-200">The basic UI laboratory intentionally contains topology, scope and campaign only. The certified Core E2E scenario validates baseline construction separately.</div>
        </div>
      </div>
    );
  }

  const availableCount = baselines.filter((baseline) => baseline.status === 'AVAILABLE').length;
  const draftCount = baselines.filter((baseline) => baseline.status === 'DRAFT').length;
  const supersededCount = baselines.filter((baseline) => baseline.status === 'SUPERSEDED').length;
  const metricCount = baselines.reduce((sum, baseline) => sum + baseline.metrics.length, 0);
  const withDeviationsCount = baselines.filter((baseline) => baseline.knownDeviationFindingIds.length > 0).length;

  return (
    <div className="space-y-5" id="commissioning-baseline-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Baseline</p>
          <h2 className="mt-1 text-lg font-bold text-white">Accepted commissioning reference</h2>
          <p className="mt-1 text-xs text-gray-500">Stored reference metrics with execution provenance, accepted revision, configuration context and known deviations.</p>
        </div>
        <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-[10px] font-semibold text-emerald-200">READ-ONLY · ACCEPTED PASS SOURCES ONLY · RETEST PRECEDENCE PRESERVED</div>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-6" aria-label="Baseline summary">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Total</p><p className="mt-2 text-2xl font-black text-white">{baselines.length}</p></article>
        <article className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"><p className="text-[9px] font-black uppercase text-emerald-300">Available</p><p className="mt-2 text-2xl font-black text-white">{availableCount}</p></article>
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Draft</p><p className="mt-2 text-2xl font-black text-white">{draftCount}</p></article>
        <article className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4"><p className="text-[9px] font-black uppercase text-amber-300">Superseded</p><p className="mt-2 text-2xl font-black text-white">{supersededCount}</p></article>
        <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"><p className="text-[9px] font-black uppercase text-cyan-300">Metrics</p><p className="mt-2 text-2xl font-black text-white">{metricCount}</p></article>
        <article className="rounded-xl border border-orange-500/15 bg-orange-500/5 p-4"><p className="text-[9px] font-black uppercase text-orange-300">With deviations</p><p className="mt-2 text-2xl font-black text-white">{withDeviationsCount}</p></article>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]" aria-label="Baseline filters">
        <label className="relative block"><span className="sr-only">Search baselines</span><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search baseline, revision, asset, metric, configuration or deviation" className="min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-emerald-500" /></label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500"><option value="ALL">All baselines</option><option value="AVAILABLE">Available</option><option value="DRAFT">Draft</option><option value="SUPERSEDED">Superseded</option></select></label>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center text-xs text-gray-500">No baselines match the current filters.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((baseline) => {
            const asset = assetById.get(baseline.assetId);
            return (
              <article key={baseline.baselineId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className={`rounded border px-2 py-1 text-[9px] font-black ${statusClass[baseline.status]}`}>{baseline.status}</span><span className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-[9px] font-bold text-gray-300">REV · {baseline.revision}</span></div>
                    <h3 className="mt-3 text-sm font-bold text-white">{asset?.name ?? baseline.assetId}</h3>
                    <p className="mt-2 text-xs text-gray-500">Accepted by <span className="font-semibold text-gray-300">{baseline.acceptedBy}</span> at <span className="font-mono text-gray-400">{baseline.acceptedAt}</span></p>
                  </div>
                  <p className="shrink-0 font-mono text-[9px] text-gray-600">{baseline.baselineId}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6 text-[10px]">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Project</p><p className="mt-1 break-all font-mono text-gray-400">{baseline.projectId}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Scope</p><p className="mt-1 break-all font-mono text-gray-400">{baseline.scopeId}</p></div>
                  <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/5 p-3"><p className="text-cyan-300">Metrics</p><p className="mt-1 text-lg font-bold text-white">{baseline.metrics.length}</p></div>
                  <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3"><p className="text-violet-300">Firmware entries</p><p className="mt-1 text-lg font-bold text-white">{Object.keys(baseline.firmwareVersions).length}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Config refs</p><p className="mt-1 text-lg font-bold text-white">{baseline.configurationReferences.length}</p></div>
                  <div className={`rounded-lg border p-3 ${baseline.knownDeviationFindingIds.length > 0 ? 'border-orange-500/15 bg-orange-500/5' : 'border-gray-800 bg-gray-900'}`}><p className={baseline.knownDeviationFindingIds.length > 0 ? 'text-orange-300' : 'text-gray-600'}>Known deviations</p><p className="mt-1 text-lg font-bold text-white">{baseline.knownDeviationFindingIds.length}</p></div>
                </div>

                <div className="mt-4 overflow-x-auto rounded-lg border border-gray-800">
                  <table className="min-w-full text-left text-[10px]">
                    <caption className="sr-only">Accepted baseline metrics and source executions</caption>
                    <thead className="bg-gray-900 text-gray-500"><tr><th className="px-3 py-2 font-black uppercase">Metric</th><th className="px-3 py-2 font-black uppercase">Value</th><th className="px-3 py-2 font-black uppercase">Source execution</th><th className="px-3 py-2 font-black uppercase">Type</th><th className="px-3 py-2 font-black uppercase">ORBI</th><th className="px-3 py-2 font-black uppercase">Human</th><th className="px-3 py-2 font-black uppercase">Calculation</th></tr></thead>
                    <tbody>
                      {baseline.metrics.map((metric) => {
                        const execution = executionById.get(metric.sourceExecutionId);
                        const isRetest = execution?.executionType === 'RETEST';
                        return (
                          <tr key={`${baseline.baselineId}:${metric.metricKey}`} className="border-t border-gray-800 bg-gray-950 text-gray-300">
                            <td className="px-3 py-3 font-semibold text-white">{metric.metricKey}</td>
                            <td className="px-3 py-3 font-mono">{formatMetricValue(metric.value, metric.unit)}</td>
                            <td className="px-3 py-3 font-mono text-gray-500">{metric.sourceExecutionId}</td>
                            <td className="px-3 py-3">{execution ? <span className={`inline-flex items-center gap-1 font-black ${isRetest ? 'text-violet-300' : 'text-gray-300'}`}>{isRetest ? <RotateCcw className="h-3 w-3" /> : null}{execution.executionType}{isRetest ? ' · PRECEDENCE' : ''}</span> : <span className="text-amber-300">NOT LOADED</span>}</td>
                            <td className="px-3 py-3 font-black">{execution?.orbiAssessment ?? 'NOT LOADED'}</td>
                            <td className="px-3 py-3 font-black">{execution?.humanAcceptance ?? 'NOT LOADED'}</td>
                            <td className="px-3 py-3 font-mono text-gray-500">{metric.calculationId ?? 'NOT RECORDED'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Firmware versions</p>{Object.keys(baseline.firmwareVersions).length === 0 ? <p className="mt-2 text-[10px] text-gray-500">No firmware versions recorded.</p> : <div className="mt-2 space-y-1">{Object.entries(baseline.firmwareVersions).map(([key, value]) => <p key={key} className="text-[10px] text-gray-400"><span className="font-semibold text-gray-300">{key}</span> · {value}</p>)}</div>}</div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><div className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-cyan-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Configuration references</p></div>{baseline.configurationReferences.length === 0 ? <p className="mt-2 text-[10px] text-gray-500">No configuration references recorded.</p> : <div className="mt-2 space-y-1">{baseline.configurationReferences.map((reference) => <p key={reference} className="break-all text-[10px] text-gray-400">{reference}</p>)}</div>}</div>
                  <div className={`rounded-lg border p-3 ${baseline.knownDeviationFindingIds.length > 0 ? 'border-orange-500/15 bg-orange-500/5' : 'border-gray-800 bg-gray-900'}`}><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Known deviations</p>{baseline.knownDeviationFindingIds.length === 0 ? <p className="mt-2 text-[10px] text-gray-500">No known deviation Finding IDs recorded.</p> : <div className="mt-2 space-y-2">{baseline.knownDeviationFindingIds.map((findingId) => { const finding = findingById.get(findingId); return <div key={findingId} className="rounded border border-orange-500/10 bg-gray-950 p-2 text-[10px]"><p className="font-mono text-orange-300">{findingId}</p><p className="mt-1 text-gray-300">{finding?.title ?? 'Finding not loaded in this snapshot.'}</p>{finding ? <p className="mt-1 text-gray-600">{finding.severity} · {finding.status}</p> : null}</div>; })}</div>}</div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] leading-relaxed text-gray-500"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-400" />A stored AVAILABLE baseline is a commissioning reference artifact, not a global handover approval and not an authorization to energize or operate equipment. When both accepted initial and accepted retest calculations exist for the same metric, the Core gives precedence to the retest source.</div>
    </div>
  );
};