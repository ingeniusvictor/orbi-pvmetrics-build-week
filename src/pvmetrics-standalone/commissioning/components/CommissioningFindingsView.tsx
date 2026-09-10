import React, { useMemo, useState } from 'react';
import { AlertCircle, Clipboard, Link2, Search, ShieldQuestion } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import type { Anomaly, Finding, FindingSeverity, FindingStatus, RootCauseState } from '../contracts';
import { useCommissioningI18n } from '../localization/CommissioningLocaleContext';

const severityClass: Record<FindingSeverity, string> = {
  INFO: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300', WARNING: 'border-amber-500/25 bg-amber-500/10 text-amber-300', MAJOR: 'border-orange-500/25 bg-orange-500/10 text-orange-300', CRITICAL: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
};
const rootCauseClass: Record<RootCauseState, string> = {
  UNKNOWN: 'border-gray-700 bg-gray-900 text-gray-300', SUSPECTED: 'border-amber-500/25 bg-amber-500/10 text-amber-300', CONFIRMED: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
};
const statusClass: Record<FindingStatus, string> = {
  OPEN: 'text-cyan-300', UNDER_REVIEW: 'text-violet-300', ACTION_REQUIRED: 'text-orange-300', READY_FOR_RETEST: 'text-amber-300', CLOSED: 'text-emerald-300', DISMISSED: 'text-gray-500',
};
type StatusFilter = 'ALL' | FindingStatus;
type SeverityFilter = 'ALL' | FindingSeverity;
const countSeverity = (findings: Finding[], severity: FindingSeverity): number => findings.filter((item) => item.severity === severity).length;

export const CommissioningFindingsView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const i18n = useCommissioningI18n();
  const t = i18n.text;
  const snapshot = state.snapshot;
  const findings = snapshot.findings;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL');
  const [query, setQuery] = useState('');
  const assetById = useMemo(() => new Map(snapshot.assets.map((asset) => [asset.assetId, asset] as const)), [snapshot.assets]);
  const anomalyById = useMemo(() => new Map<string, Anomaly>(snapshot.anomalies.map((anomaly): [string, Anomaly] => [anomaly.anomalyId, anomaly])), [snapshot.anomalies]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return findings.filter((finding) => {
      if (statusFilter !== 'ALL' && finding.status !== statusFilter) return false;
      if (severityFilter !== 'ALL' && finding.severity !== severityFilter) return false;
      if (!normalized) return true;
      const asset = assetById.get(finding.assetId);
      return [finding.findingId, finding.title, finding.description, finding.category, finding.status, finding.rootCause, asset?.name].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [assetById, findings, query, severityFilter, statusFilter]);

  if (findings.length === 0) {
    return <div className="space-y-5" id="commissioning-findings-view"><div><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('Hallazgos', 'Findings')}</p><h2 className="mt-1 text-lg font-bold text-white">{t('No hay hallazgos formales cargados', 'No formal findings loaded')}</h2></div><div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center"><Clipboard className="mx-auto h-8 w-8 text-gray-600" /><p className="mt-3 text-sm font-semibold text-gray-200">{t('Ninguna anomalía está representada aquí como un Hallazgo formal.', 'No anomaly has been represented here as a formal Finding.')}</p><p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-gray-500">{t('Una anomalía puede mantenerse informativa, requerir revisión de datos o convertirse posteriormente en Hallazgo formal según el flujo aprobado. Un registro vacío no implica aceptación de Puesta en Servicio.', 'An anomaly may remain informational, require data review, or later become a formal Finding according to the approved workflow. An empty register does not imply commissioning acceptance.')}</p><div className="mx-auto mt-4 max-w-xl rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-[10px] leading-relaxed text-amber-200">{t('La causa raíz permanece DESCONOCIDA salvo que una revisión autorizada registre explícitamente otro estado. El motor de Hallazgos no confirma automáticamente la causa raíz.', 'Root cause remains UNKNOWN unless an authorized review explicitly records another state. The Findings engine does not auto-confirm root cause.')}</div></div></div>;
  }

  const openCount = findings.filter((item) => item.status !== 'CLOSED' && item.status !== 'DISMISSED').length;
  const openPunchRequired = findings.filter((item) => item.requiresPunch && item.status !== 'CLOSED' && item.status !== 'DISMISSED').length;
  const unknownRootCause = findings.filter((item) => item.rootCauseState === 'UNKNOWN').length;
  const confirmedRootCause = findings.filter((item) => item.rootCauseState === 'CONFIRMED').length;

  return (
    <div className="space-y-5" id="commissioning-findings-view">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('Hallazgos', 'Findings')}</p><h2 className="mt-1 text-lg font-bold text-white">{t('Registro formal de hallazgos de Puesta en Servicio', 'Formal commissioning findings register')}</h2><p className="mt-1 text-xs text-gray-500">{t('Elementos formales de revisión derivados de evidencia explícita y decisiones del flujo. El estado de causa raíz se muestra independientemente del hallazgo.', 'Formal review items derived from explicit evidence and workflow decisions. Root-cause state is shown independently from the finding itself.')}</p></div><div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-[10px] font-semibold text-amber-200">{t('LÍMITE DE REVISIÓN HUMANA · LA CAUSA RAÍZ ES EXPLÍCITA', 'HUMAN REVIEW BOUNDARY · ROOT CAUSE IS EXPLICIT')}</div></div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8" aria-label={t('Resumen de hallazgos', 'Finding summary')}>
        {[[t('Total','Total'), findings.length, ''], [t('Flujo abierto','Open workflow'), openCount, 'cyan'], [t('Información','Info'), countSeverity(findings,'INFO'), 'cyan'], [t('Advertencia','Warning'), countSeverity(findings,'WARNING'),'amber'], [t('Mayor','Major'),countSeverity(findings,'MAJOR'),'orange'], [t('Crítica','Critical'),countSeverity(findings,'CRITICAL'),'rose'], [t('Pendiente abierto requerido','Open punch required'),openPunchRequired,'amber'], [t('Causa raíz desconocida','Root cause unknown'),unknownRootCause,'']].map(([label,value,tone]) => <article key={String(label)} className={`rounded-xl border bg-gray-950 p-4 ${tone ? `border-${tone}-500/15` : 'border-gray-800'}`}><p className="text-[9px] font-black uppercase text-gray-500">{label}</p><p className="mt-2 text-2xl font-black text-white">{value}</p></article>)}
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto]" aria-label={t('Filtros de hallazgos', 'Finding filters')}>
        <label className="relative block"><span className="sr-only">{t('Buscar hallazgos','Search findings')}</span><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Buscar ID, título, categoría, activo o causa raíz','Search ID, title, category, asset or root cause')} className="min-h-11 w-full rounded-lg border border-gray-800 bg-gray-950 pl-10 pr-3 text-xs text-gray-200 outline-none placeholder:text-gray-700 focus:border-emerald-500" /></label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{t('Estado','Status')}<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200"><option value="ALL">{t('Todos los estados','All statuses')}</option>{(['OPEN','UNDER_REVIEW','ACTION_REQUIRED','READY_FOR_RETEST','CLOSED','DISMISSED'] as FindingStatus[]).map((value)=><option key={value} value={value}>{i18n.canonical(value)}</option>)}</select></label>
        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{t('Severidad','Severity')}<select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as SeverityFilter)} className="ml-2 min-h-11 rounded-lg border border-gray-800 bg-gray-950 px-3 text-xs font-semibold normal-case tracking-normal text-gray-200"><option value="ALL">{t('Todas las severidades','All severities')}</option>{(['INFO','WARNING','MAJOR','CRITICAL'] as FindingSeverity[]).map((value)=><option key={value} value={value}>{i18n.canonical(value)}</option>)}</select></label>
      </section>

      {filtered.length === 0 ? <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950 p-8 text-center text-xs text-gray-500">{t('Ningún hallazgo coincide con los filtros actuales.','No findings match the current filters.')}</div> : <div className="space-y-3">{filtered.map((finding) => {
        const asset = assetById.get(finding.assetId);
        const sourceAnomalies = finding.sourceAnomalyIds.map((id) => anomalyById.get(id)).filter(Boolean);
        return <article key={finding.findingId} className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="flex min-w-0 items-start gap-3"><AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${finding.severity === 'CRITICAL' ? 'text-rose-400' : finding.severity === 'MAJOR' ? 'text-orange-400' : finding.severity === 'WARNING' ? 'text-amber-400' : 'text-cyan-400'}`} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded border px-2 py-1 text-[9px] font-black ${severityClass[finding.severity]}`}>{i18n.canonical(finding.severity)}</span><span className={`text-[9px] font-black ${statusClass[finding.status]}`}>{i18n.canonical(finding.status)}</span><span className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-[9px] font-bold text-gray-300">{finding.category}</span></div><h3 className="mt-3 text-sm font-bold text-white">{finding.title}</h3><p className="mt-2 max-w-4xl text-xs leading-relaxed text-gray-400">{finding.description}</p></div></div><div className="shrink-0 text-right"><p className="font-mono text-[9px] text-gray-600">{finding.findingId}</p><span className={`mt-2 inline-flex rounded border px-2 py-1 text-[9px] font-black ${rootCauseClass[finding.rootCauseState]}`}>{t('CAUSA RAÍZ','ROOT CAUSE')} · {i18n.canonical(finding.rootCauseState)}</span></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7 text-[10px]">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">{t('Activo','Asset')}</p><p className="mt-1 font-semibold text-gray-300">{asset?.name ?? finding.assetId}</p></div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">{t('Anomalías de origen','Source anomalies')}</p><p className="mt-1 text-lg font-bold text-white">{finding.sourceAnomalyIds.length}</p></div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">{t('Evidencia','Evidence')}</p><p className="mt-1 text-lg font-bold text-white">{finding.evidenceIds.length}</p></div>
            <div className={`rounded-lg border p-3 ${finding.requiresPunch ? 'border-amber-500/15 bg-amber-500/5' : 'border-gray-800 bg-gray-900'}`}><p className="text-gray-600">{t('Pendiente requerido','Punch required')}</p><p className={`mt-1 font-black ${finding.requiresPunch ? 'text-amber-300' : 'text-gray-300'}`}>{i18n.boolean(finding.requiresPunch)}</p></div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">{t('Revisado por','Reviewed by')}</p><p className="mt-1 font-semibold text-gray-300">{finding.reviewedBy ?? t('PENDIENTE','PENDING')}</p></div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">{t('Revisado el','Reviewed at')}</p><p className="mt-1 font-semibold text-gray-300">{finding.reviewedAt ?? t('PENDIENTE','PENDING')}</p></div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><p className="text-gray-600">{t('Ejecución','Execution')}</p><p className="mt-1 break-all font-mono text-gray-400">{finding.executionId ?? i18n.missing}</p></div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-3"><div className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-cyan-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">{t('Vinculación con anomalía de origen','Source anomaly linkage')}</p></div>{sourceAnomalies.length === 0 ? <p className="mt-2 text-[10px] text-amber-300">{t('Los registros de anomalía referenciados no están cargados en este snapshot.','Referenced anomaly records are not loaded in this snapshot.')}</p> : <div className="mt-2 space-y-1">{sourceAnomalies.map((anomaly) => anomaly ? <p key={anomaly.anomalyId} className="text-[10px] text-gray-400"><span className="font-mono text-gray-600">{anomaly.ruleId}</span> · {anomaly.title}</p> : null)}</div>}</div>
            <div className={`rounded-lg border p-3 ${finding.rootCauseState === 'CONFIRMED' ? 'border-emerald-500/15 bg-emerald-500/5' : finding.rootCauseState === 'SUSPECTED' ? 'border-amber-500/15 bg-amber-500/5' : 'border-gray-800 bg-gray-900'}`}><div className="flex items-center gap-2"><ShieldQuestion className="h-3.5 w-3.5 text-violet-400" /><p className="text-[9px] font-black uppercase tracking-wider text-gray-600">{t('Registro de causa raíz','Root-cause record')}</p></div><p className="mt-2 text-[10px] leading-relaxed text-gray-300">{finding.rootCause ? finding.rootCause : t('No se ha registrado texto de causa raíz. El estado permanece explícito y no debe inferirse desde el título, la regla de anomalía ni la categoría.','No root cause text has been recorded. The state remains explicit and must not be inferred from title, anomaly rule or category.')}</p></div>
          </div>
        </article>;
      })}</div>}
      <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-[10px] text-gray-500">{t('Registros con causa raíz confirmada','Confirmed root-cause records')}: {confirmedRootCause}. {t('Un estado confirmado solo se muestra cuando ya existe en el Hallazgo almacenado; esta interfaz nunca eleva DESCONOCIDA o SOSPECHADA automáticamente.','A confirmed state is only displayed when it already exists in the stored Finding; this UI never upgrades UNKNOWN or SUSPECTED automatically.')}</div>
    </div>
  );
};