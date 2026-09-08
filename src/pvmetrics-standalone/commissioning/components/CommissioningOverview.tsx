import React from 'react';
import { AlertTriangle, BatteryCharging, CheckCircle2, ClipboardList, Database, Gauge, ShieldCheck } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';

export const CommissioningOverview: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const project = state.snapshot.projects[0];
  const includedAssets = state.snapshot.scopeAssets.filter((item) => item.status === 'INCLUDED').length;
  const excludedAssets = state.snapshot.scopeAssets.filter((item) => item.status === 'EXCLUDED').length;
  const executions = state.snapshot.testExecutions.length;
  const acceptedExecutions = state.snapshot.testExecutions.filter((item) => item.humanAcceptance === 'ACCEPTED' || item.humanAcceptance === 'ACCEPTED_WITH_COMMENTS').length;
  const approvedGates = state.snapshot.gates.filter((item) => item.status === 'APPROVED').length;
  const gateCount = state.snapshot.gates.length;
  const dataQuality = state.snapshot.datasets.length === 0
    ? 'NO DATASET'
    : state.snapshot.datasets.some((item) => item.dataQuality === 'INVALID')
      ? 'INVALID'
      : state.snapshot.datasets.some((item) => item.dataQuality === 'POOR')
        ? 'POOR'
        : state.snapshot.datasets.some((item) => item.dataQuality === 'DEGRADED')
          ? 'DEGRADED'
          : 'GOOD';

  const cards = [
    { label: 'Scope assets', value: includedAssets, detail: `${excludedAssets} excluded`, icon: BatteryCharging },
    { label: 'Executions', value: executions, detail: `${acceptedExecutions} human accepted`, icon: ClipboardList },
    { label: 'Active anomalies', value: state.summary.activeAnomalyCount, detail: 'Rule-engine observations', icon: AlertTriangle },
    { label: 'Open punch', value: state.summary.openPunchCount, detail: 'Require closure workflow', icon: ShieldCheck },
    { label: 'Approved gates', value: approvedGates, detail: `${gateCount} gates recorded`, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-5" id="commissioning-overview">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 xl:col-span-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Current commissioning context</p>
          <h2 className="mt-2 text-lg font-bold text-white">{project?.name ?? 'No commissioning project loaded'}</h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            {project
              ? `${project.ratedPowerMw ?? '—'} MW / ${project.ratedEnergyMwh ?? '—'} MWh · ${project.region ?? 'Region pending'} · lifecycle ${project.lifecycleStatus.replaceAll('_', ' ')}`
              : 'Load or initialize a commissioning workspace to display scope, campaigns, tests and acceptance status.'}
          </p>
        </div>
        <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-5">
          <div className="flex items-center gap-2 text-cyan-300"><Database className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-wider">Data Quality</span></div>
          <p className="mt-3 text-2xl font-extrabold text-white">{dataQuality}</p>
          <p className="mt-2 text-xs text-gray-400">No PASS/FAIL is inferred when mandatory evidence or confirmed criteria are missing.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-800 bg-gray-950 p-4">
            <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{label}</p><Icon className="h-4 w-4 text-emerald-400" /></div>
            <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-[10px] text-gray-500">{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-amber-400" /><h3 className="text-sm font-bold text-white">Status → Risk → Next Action</h3></div>
          {executions === 0 ? (
            <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/5 p-4 text-xs text-gray-400">
              <strong className="text-amber-300">Status:</strong> scope/campaign prepared, no test execution recorded. <strong className="text-amber-300">Risk:</strong> acceptance cannot be assessed. <strong className="text-amber-300">Next:</strong> create or import the first controlled test execution and evidence package.
            </div>
          ) : (
            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <p><strong className="text-white">Status:</strong> {executions} execution(s) recorded.</p>
              <p><strong className="text-white">Risk:</strong> {state.summary.openFindingCount + state.summary.openPunchCount} open finding/punch item(s).</p>
              <p><strong className="text-white">Next:</strong> review unresolved evidence, criteria and human acceptance decisions.</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-5">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">Operational boundary</h3></div>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">This workspace observes, correlates, evaluates and documents. It does not issue BMS/PCS/EMS/SCADA commands, change setpoints, operate protections or authorize energization. Gate approval and final acceptance remain explicit human decisions.</p>
        </div>
      </div>
    </div>
  );
};
