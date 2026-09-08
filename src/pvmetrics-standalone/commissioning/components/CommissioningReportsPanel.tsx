import React, { useMemo, useState } from 'react';
import { ClipboardCheck, Download, FileText, RefreshCw, ShieldCheck } from 'lucide-react';
import { CommissioningService, type CommissioningWorkspaceState } from '../application/commissioningService';
import { BrowserLocalStorageDriver, CommissioningRepository } from '../persistence';
import {
  buildCommissioningReport,
  renderCommissioningReportText,
  type CommissioningReport,
} from '../reporting/commissioningReport';

const downloadText = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const CommissioningReportsPanel: React.FC = () => {
  const service = useMemo(
    () => new CommissioningService(
      new CommissioningRepository(new BrowserLocalStorageDriver(window.localStorage)),
    ),
    [],
  );
  const initialState = useMemo(() => service.getState(), [service]);
  const [state, setState] = useState<CommissioningWorkspaceState>(initialState);
  const [projectId, setProjectId] = useState(initialState.snapshot.projects[0]?.projectId ?? '');
  const [scopeId, setScopeId] = useState(initialState.snapshot.scopes[0]?.scopeId ?? '');
  const [report, setReport] = useState<CommissioningReport | null>(null);
  const [message, setMessage] = useState('');

  const scopes = state.snapshot.scopes.filter((scope) => scope.projectId === projectId);

  const adoptState = (next: CommissioningWorkspaceState) => {
    setState(next);
    const nextProjectId = next.snapshot.projects[0]?.projectId ?? '';
    const nextScopeId = next.snapshot.scopes.find((scope) => scope.projectId === nextProjectId)?.scopeId ?? '';
    setProjectId(nextProjectId);
    setScopeId(nextScopeId);
    setReport(null);
    setMessage('');
  };

  const refreshStored = () => adoptState(service.getState());
  const openSyntheticLab = () => adoptState(service.initializeSyntheticLab());

  const handleProjectChange = (nextProjectId: string) => {
    setProjectId(nextProjectId);
    setScopeId(state.snapshot.scopes.find((scope) => scope.projectId === nextProjectId)?.scopeId ?? '');
    setReport(null);
    setMessage('');
  };

  const generateReport = () => {
    if (!projectId || !scopeId) {
      setMessage('Select a commissioning project and scope before generating the report.');
      return;
    }
    try {
      const next = buildCommissioningReport({
        snapshot: state.snapshot,
        projectId,
        scopeId,
        generatedAt: new Date().toISOString(),
        generatedBy: 'ORBI PVMetrics Report UI',
      });
      setReport(next);
      setMessage('Commissioning snapshot report generated locally. No commissioning state was modified.');
    } catch (error) {
      setReport(null);
      setMessage(error instanceof Error ? error.message : 'Unable to generate commissioning report.');
    }
  };

  const exportJson = () => {
    if (!report) return;
    downloadText(
      JSON.stringify(report, null, 2),
      `ORBI_PVMetrics_Commissioning_${report.project.projectId}_${report.scope.revision}.json`,
      'application/json;charset=utf-8',
    );
  };

  const exportText = () => {
    if (!report) return;
    downloadText(
      renderCommissioningReportText(report),
      `ORBI_PVMetrics_Commissioning_${report.project.projectId}_${report.scope.revision}.txt`,
      'text/plain;charset=utf-8',
    );
  };

  if (state.loadStatus === 'EMPTY' || state.snapshot.projects.length === 0) {
    return (
      <section className="space-y-5" aria-label="Commissioning reports">
        <div className="rounded-xl border border-emerald-500/20 bg-gray-900 p-5">
          <div className="flex items-start gap-3"><ClipboardCheck className="mt-0.5 h-5 w-5 text-emerald-400" /><div><p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">BESS Commissioning Report</p><h2 className="mt-1 text-lg font-bold text-white">No stored commissioning dataset</h2><p className="mt-2 text-xs leading-relaxed text-gray-400">Reports reads the scoped Commissioning repository. No persisted project is currently available. You can refresh stored data or open the synthetic lab in memory for a safe report preview.</p></div></div>
        </div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={refreshStored} className="min-h-11 rounded-lg border border-gray-700 bg-gray-950 px-4 text-xs font-bold text-gray-300 hover:border-emerald-500/40"><RefreshCw className="mr-2 inline h-3.5 w-3.5" />Refresh stored data</button><button type="button" onClick={openSyntheticLab} className="min-h-11 rounded-lg bg-emerald-500 px-4 text-xs font-extrabold text-slate-950 hover:bg-emerald-400">Open synthetic report preview</button></div>
        <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-[10px] leading-relaxed text-amber-200">Synthetic preview is in-memory only and does not create a real commissioning record, human acceptance or contractual handover.</div>
      </section>
    );
  }

  return (
    <section className="space-y-5" aria-label="Commissioning reports">
      <header className="rounded-xl border border-emerald-500/20 bg-gray-900 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-start gap-3"><FileText className="mt-0.5 h-5 w-5 text-emerald-400" /><div><p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">BESS Commissioning Report</p><h2 className="mt-1 text-lg font-bold text-white">Deterministic commissioning snapshot</h2><p className="mt-2 text-xs leading-relaxed text-gray-400">Build a local, traceable report from the stored Commissioning snapshot. Report generation does not execute tests, change acceptance, close Punch Items or write to OT systems.</p></div></div><span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[10px] font-black text-cyan-300">READ-ONLY SHADOW MODE</span></div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Project<select value={projectId} onChange={(event) => handleProjectChange(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500">{state.snapshot.projects.map((project) => <option key={project.projectId} value={project.projectId}>{project.name}</option>)}</select></label>
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Scope<select value={scopeId} onChange={(event) => { setScopeId(event.target.value); setReport(null); setMessage(''); }} className="mt-1 min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200 outline-none focus:border-emerald-500">{scopes.map((scope) => <option key={scope.scopeId} value={scope.scopeId}>{scope.name} · {scope.revision}</option>)}</select></label>
        <div className="flex items-end gap-2"><button type="button" onClick={refreshStored} title="Refresh stored commissioning data" className="min-h-11 rounded-lg border border-gray-700 bg-gray-950 px-3 text-xs font-bold text-gray-300 hover:border-emerald-500/40"><RefreshCw className="h-4 w-4" /></button><button type="button" onClick={generateReport} disabled={!projectId || !scopeId} className="min-h-11 rounded-lg bg-emerald-500 px-4 text-xs font-extrabold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">Generate report</button></div>
      </div>

      {message ? <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] text-gray-400">{message}</div> : null}

      {report ? (
        <div className="space-y-4">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8" aria-label="Commissioning report summary">
            <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Assets in scope</p><p className="mt-2 text-2xl font-black text-white">{report.summary.assetsInScope}</p></article>
            <article className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4"><p className="text-[9px] font-black uppercase text-cyan-300">Executions</p><p className="mt-2 text-2xl font-black text-white">{report.summary.testExecutions}</p></article>
            <article className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"><p className="text-[9px] font-black uppercase text-emerald-300">ORBI PASS</p><p className="mt-2 text-2xl font-black text-white">{report.summary.executionAssessmentCounts.PASS}</p></article>
            <article className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4"><p className="text-[9px] font-black uppercase text-amber-300">Active anomalies</p><p className="mt-2 text-2xl font-black text-white">{report.summary.anomalies.active}</p></article>
            <article className="rounded-xl border border-orange-500/15 bg-orange-500/5 p-4"><p className="text-[9px] font-black uppercase text-orange-300">Open findings</p><p className="mt-2 text-2xl font-black text-white">{report.summary.findings.open}</p></article>
            <article className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4"><p className="text-[9px] font-black uppercase text-violet-300">Open Punch</p><p className="mt-2 text-2xl font-black text-white">{report.summary.punchItems.open}</p></article>
            <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Evidence</p><p className="mt-2 text-2xl font-black text-white">{report.summary.evidenceRecords}</p></article>
            <article className="rounded-xl border border-gray-800 bg-gray-950 p-4"><p className="text-[9px] font-black uppercase text-gray-500">Handover</p><p className="mt-2 text-xs font-black text-white">{report.handover?.status.replaceAll('_', ' ') ?? 'NONE'}</p></article>
          </section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-gray-800 bg-gray-950 p-5"><p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Report identity</p><h3 className="mt-2 text-sm font-bold text-white">{report.project.name}</h3><p className="mt-2 text-xs text-gray-400">{report.scope.name} · rev {report.scope.revision}</p><div className="mt-3 grid grid-cols-2 gap-2 text-[10px]"><div><p className="text-gray-600">Generated</p><p className="mt-1 font-mono text-gray-400">{report.generatedAt}</p></div><div><p className="text-gray-600">Mode</p><p className="mt-1 font-black text-cyan-300">{report.mode}</p></div><div><p className="text-gray-600">Baseline</p><p className="mt-1 font-mono text-gray-400">{report.baseline?.baselineId ?? 'NONE'}</p></div><div><p className="text-gray-600">Handover</p><p className="mt-1 font-mono text-gray-400">{report.handover?.handoverPackageId ?? 'NONE'}</p></div></div></article>
            <article className="rounded-xl border border-gray-800 bg-gray-950 p-5"><p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Traceability package</p><div className="mt-3 grid grid-cols-2 gap-2 text-[10px]"><div><p className="text-gray-600">Anomaly IDs</p><p className="mt-1 text-lg font-bold text-white">{report.traceability.anomalyIds.length}</p></div><div><p className="text-gray-600">Finding IDs</p><p className="mt-1 text-lg font-bold text-white">{report.traceability.findingIds.length}</p></div><div><p className="text-gray-600">Punch IDs</p><p className="mt-1 text-lg font-bold text-white">{report.traceability.punchItemIds.length}</p></div><div><p className="text-gray-600">Acceptance decisions</p><p className="mt-1 text-lg font-bold text-white">{report.traceability.humanAcceptanceDecisionIds.length}</p></div></div></article>
          </div>

          <div className="flex flex-wrap gap-2"><button type="button" onClick={exportText} className="min-h-11 rounded-lg border border-gray-700 bg-gray-950 px-4 text-xs font-bold text-gray-200 hover:border-emerald-500/40"><Download className="mr-2 inline h-3.5 w-3.5" />Export TXT</button><button type="button" onClick={exportJson} className="min-h-11 rounded-lg border border-gray-700 bg-gray-950 px-4 text-xs font-bold text-gray-200 hover:border-emerald-500/40"><Download className="mr-2 inline h-3.5 w-3.5" />Export JSON</button></div>

          <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3"><div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-amber-300" /><p className="text-[9px] font-black uppercase tracking-wider text-amber-300">Authority boundary</p></div><div className="mt-2 space-y-1">{report.limitations.map((limitation) => <p key={limitation} className="text-[10px] leading-relaxed text-gray-300">• {limitation}</p>)}</div></div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center"><FileText className="mx-auto h-7 w-7 text-gray-600" /><p className="mt-3 text-sm font-semibold text-gray-300">Select project and scope, then generate a snapshot report.</p><p className="mx-auto mt-2 max-w-xl text-xs text-gray-500">Generation is local and explicit. The report is not a commissioning acceptance decision.</p></div>
      )}
    </section>
  );
};
