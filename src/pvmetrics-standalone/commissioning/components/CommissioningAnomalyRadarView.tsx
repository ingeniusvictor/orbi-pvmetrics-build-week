import React, { useMemo, useState } from 'react';
import { AlertTriangle, Radar, Search, ShieldAlert, Waves } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type { Anomaly, AnomalyImpact, FindingSeverity } from '../contracts';

const severityClass: Record<FindingSeverity, string> = {
  INFO: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  WARNING: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  MAJOR: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
  CRITICAL: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
};

const impactClass: Record<AnomalyImpact, string> = {
  INFORMATIONAL: 'border-gray-700 bg-gray-900 text-gray-300',
  ASSESSMENT_RELEVANT: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  GATE_BLOCKING: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
};

const statusClass: Record<string, string> = {
  NEW: 'text-cyan-300',
  ACTIVE: 'text-amber-300',
  CLEARED: 'text-emerald-300',
  ACK: 'text-blue-300',
  UNDER_REVIEW: 'text-violet-300',
  DISMISSED: 'text-gray-500',
  CONVERTED_TO_FINDING: 'text-orange-300',
};

type SeverityFilter = 'ALL' | FindingSeverity;
type ImpactFilter = 'ALL' | AnomalyImpact;

const countBySeverity = (anomalies: Anomaly[], severity: FindingSeverity): number =>
  anomalies.filter((item) => item.severity === severity).length;

export const CommissioningAnomalyRadarView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL');
  const [impactFilter, setImpactFilter] = useState<ImpactFilter>('ALL');
  const [query, setQuery] = useState('');
  const snapshot = state.snapshot;
  const anomalies = snapshot.anomalies;

  const assetById = useMemo(
    () => new Map(snapshot.assets.map((asset) => [asset.assetId, asset] as const)),
    [snapshot.assets],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return anomalies.filter((anomaly) => {
      if (severityFilter !== 'ALL' && anomaly.severity !== severityFilter) return false;
      if (impactFilter !== 'ALL' && anomaly.impact !== impactFilter) return false;
      if (!normalizedQuery) return true;
      const asset = assetById.get(anomaly.assetId);
      return [anomaly.ruleId, anomaly.title, anomaly.description, anomaly.status, asset?.name, anomaly.assetId]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [anomalies, assetById, impactFilter, query, severityFilter]);

  if (anomalies.length === 0) {
    return (
      <div className="space-y-5" id="commissioning-anomaly-radar-view">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Anomaly Radar</p>
          <h2 className="mt-1 text-lg font-bold text-white">No anomaly records loaded</h2>
        </div>
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center">
          <Radar className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-3 text-sm font-semibold text-gray-200">The current workspace has no stored anomaly detections.</p>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">
            Anomaly Radar only displays explicit outputs from the commissioning anomaly engine or imported reviewed records. An empty radar does not prove that equipment is healthy and does not imply test acceptance.
          </p>
          <div className="mx-auto mt-4 max-w-xl rounded-lg border border-violet-500/15 bg-violet-500/5 p-3 text-[10px] leading-relaxed text-violet-200">
            Anomaly ≠ confirmed root cause. Root-cause confirmation belongs to the Findings workflow and authorized human review.
          </div>
        </div>
      </div>
    );
  }

  const gateBlocking = anomalies.filter((item) => item.impact === 'GATE_BLOCKING').length;
  const active = anomalies.filter((item) => item.status === 'ACTIVE' || item.status === 'NEW').length;
  const converted = anomalies.filter((item) => item.status === 'CONVERTED_TO_FINDING').length;

  return (
    <div className="space-y-5" id="commissioning-anomaly-radar-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Anomaly Radar</p>
          <h2 className="mt-1 text-lg font-bold text-white">Commissioning analytical anomaly register</h2>
          <p className="mt-1 text-xs text-gray-500">Rule-based observations for review. No anomaly establishes root cause or final acceptance by itself.</p>
        </div>
        <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2 text-[10px] font-semibold text-violet-200">READ-ONLY · NO ROOT-CAUSE AUTO-CONFIRM</div>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7" aria-label="Anomaly summary">
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Total</p><p className="mt-2 text-2xl font-black text-white">{anomalies.length}</p></article>
        <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"><p className="text-[9px] font-black uppercase text-cyan-300">Info</p><p className="mt-2 text-2xl font-black text-white">{countBySeverity(anomalies, 'INFO')}</p></article>
        <article className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4"><p className="text-[9px] font-black uppercase text-amber-300">Warning</p><p className="mt-2 text-2xl font-black text-white">{countBySeverity(anomalies, 'WARNING')}</p></article>
        <article className="rounded-xl border border-orange-500/15 bg-orange-500/5 p-4"><p className="text-[9px] font-black uppercase text-orange-300">Major</p><p className="mt-2 text-2xl font-black text-white">{countBySeverity(anomalies, 'MAJOR')}</p></article>
        <article className="rounded-xl border border-rose-500/15 bg-rose-500/5 p-4"><p className="text-[9px] font-black uppercase text-rose-300">Critical</p><p className="mt-2 text-2xl font-black text-white">{countBySeverity(anomalies, 'CRITICAL')}</p></article>
        <article className="rounded-xl border border-rose-500/15 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Gate blocking</p><p className="mt-2 text-2xl font-black text-rose-300">{gateBlocking}</p></article>
        <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Active / New</p><p className="mt-2 text-2xl font-black text-amber-300">{active}</p></article>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto]" aria-label="Anomaly filters">
        <label className="relative block">
          <span className="sr-only">Search anomalies</span>
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-600" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rule, title, asset or status" className="min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-emerald-500" />
        </label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Severity
          <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as SeverityFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500">
            <option value="ALL">All severities</option><option value="INFO">Info</option><option value="WARNING">Warning</option><option value="MAJOR">Major</option><option value="CRITICAL">Critical</option>
          </select>
        </label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Impact
          <select value={impactFilter} onChange={(event) => setImpactFilter(event.target.value as ImpactFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500">
            <option value="ALL">All impacts</option><option value="INFORMATIONAL">Informational</option><option value="ASSESSMENT_RELEVANT">Assessment relevant</option><option value="GATE_BLOCKING">Gate blocking</option>
          </select>
        </label>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center"><Waves className="mx-auto h-7 w-7 text-gray-600" /><p className="mt-3 text-xs font-semibold text-gray-300">No anomalies match the current filters.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((anomaly) => {
            const asset = assetById.get(anomaly.assetId);
            return (
              <article key={anomaly.anomalyId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <ShieldAlert className={`mt-0.5 h-5 w-5 shrink-0 ${anomaly.severity === 'CRITICAL' ? 'text-rose-400' : anomaly.severity === 'MAJOR' ? 'text-orange-400' : anomaly.severity === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><span className={`rounded border px-2 py-1 text-[9px] font-black ${severityClass[anomaly.severity]}`}>{anomaly.severity}</span><span className={`rounded border px-2 py-1 text-[9px] font-black ${impactClass[anomaly.impact]}`}>{anomaly.impact.replaceAll('_', ' ')}</span><span className={`text-[9px] font-black ${statusClass[anomaly.status] ?? 'text-gray-400'}`}>{anomaly.status.replaceAll('_', ' ')}</span></div>
                      <h3 className="mt-3 text-sm font-bold text-white">{anomaly.title}</h3>
                      <p className="mt-2 max-w-4xl text-xs leading-relaxed text-gray-400">{anomaly.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-[10px]"><p className="font-mono font-bold text-gray-300">{anomaly.ruleId}</p><p className="mt-1 text-gray-600">Rule v{anomaly.ruleVersion}</p></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6 text-[10px]">
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Asset</p><p className="mt-1 font-semibold text-gray-300">{asset?.name ?? anomaly.assetId}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Detected</p><p className="mt-1 font-semibold text-gray-300">{anomaly.detectedAt}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Evidence</p><p className="mt-1 text-lg font-bold text-white">{anomaly.evidenceIds.length}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Criteria refs</p><p className="mt-1 text-lg font-bold text-white">{anomaly.criterionSnapshotIds.length}</p></div>
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">Calculation refs</p><p className="mt-1 text-lg font-bold text-white">{anomaly.calculationIds.length}</p></div>
                  <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3"><p className="text-violet-300">Root cause</p><p className="mt-1 font-bold text-violet-100">NOT CONFIRMED</p></div>
                </div>

                {anomaly.notes.length > 0 ? <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">Analytical notes</p><ul className="mt-2 space-y-1 text-[10px] text-gray-400">{anomaly.notes.map((note, index) => <li key={`${anomaly.anomalyId}-note-${index}`}>• {note}</li>)}</ul></div> : null}
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] text-gray-500"><AlertTriangle className="h-3.5 w-3.5 text-amber-400" />{converted} anomaly record(s) are already marked as converted to Finding. Conversion does not itself confirm root cause.</div>
    </div>
  );
};
