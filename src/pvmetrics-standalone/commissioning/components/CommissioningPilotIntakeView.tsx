import React, { useMemo, useState } from 'react';
import { Download, FileCheck2, FolderOpen, RotateCcw, ShieldAlert } from 'lucide-react';
import {
  assessPilotReadiness,
  PILOT_OPTIONAL_ARTIFACT_KINDS,
  PILOT_REQUIRED_ARTIFACT_KINDS,
  type PilotArtifact,
  type PilotArtifactKind,
  type PilotReadinessResult,
} from '../pilot/pilotReadiness';
import {
  assessPilotCsvHeader,
  getPilotCsvTemplate,
  renderPilotCsvTemplate,
} from '../pilot/dataExchangeTemplates';
import { assessTelemetryCsvContent } from '../pilot/telemetryContentValidation';

const ARTIFACT_LABELS: Record<PilotArtifactKind, string> = {
  PROJECT_IDENTITY: 'Identidad del proyecto',
  SCOPE_REGISTER: 'Registro de alcance / Scope',
  ASSET_REGISTER: 'Registro de activos',
  TEST_MATRIX: 'Matriz de pruebas',
  CRITERIA_SOURCES: 'Fuentes de criterios de aceptación',
  SIGNAL_DICTIONARY: 'Diccionario de señales (opcional)',
  SIGNAL_MAPPING: 'Mapeo de señales',
  TELEMETRY_EXPORT: 'Export de telemetría',
  EVENT_EXPORT: 'Export de eventos / alarmas (opcional)',
  EVIDENCE_PACKAGE_INDEX: 'Índice del paquete de evidencias',
  AUTHORITY_REGISTER: 'Registro de autoridad / testigos / revisores',
};

const ALL_ARTIFACT_KINDS: readonly PilotArtifactKind[] = [
  ...PILOT_REQUIRED_ARTIFACT_KINDS,
  ...PILOT_OPTIONAL_ARTIFACT_KINDS,
];

const CSV_HEADER_READ_LIMIT_BYTES = 64 * 1024;
const TELEMETRY_CONTENT_READ_LIMIT_BYTES = 10 * 1024 * 1024;

const hashFileSha256 = async (file: File): Promise<string> => {
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto SHA-256 is unavailable in this browser context.');
  const buffer = await file.arrayBuffer();
  const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const createEmptyArtifacts = (): PilotArtifact[] =>
  ALL_ARTIFACT_KINDS.map((kind) => ({
    artifactId: `PILOT-${kind}`,
    kind,
    status: 'MISSING',
  }));

const downloadCsvTemplate = (kind: PilotArtifactKind) => {
  const item = getPilotCsvTemplate(kind);
  const blob = new Blob([renderPilotCsvTemplate(kind)], { type: 'text/csv;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = item.fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

const assessSelectedCsv = async (
  artifact: PilotArtifact,
  file: File,
): Promise<{ status: PilotArtifact['status']; notes: string[] }> => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    if (artifact.kind === 'TELEMETRY_EXPORT') {
      return {
        status: 'PENDING_VALIDATION',
        notes: ['TELEMETRY CONTENT BLOCKED — the current normalized telemetry preflight requires CSV. Non-CSV telemetry must use a later authorized offline parser; no format conversion is inferred.'],
      };
    }
    return {
      status: 'PROVIDED',
      notes: ['Non-CSV file selected. File identity and SHA-256 are recorded locally; content/structure still requires authorized manual validation.'],
    };
  }

  const headerSample = await file.slice(0, CSV_HEADER_READ_LIMIT_BYTES).text();
  const assessment = assessPilotCsvHeader(artifact.kind, headerSample);
  const notes: string[] = [];

  if (assessment.missingRequiredColumns.length > 0) {
    notes.push(`CSV HEADER BLOCKED — missing required columns: ${assessment.missingRequiredColumns.join(', ')}`);
  }
  if (assessment.duplicateColumns.length > 0) {
    notes.push(`CSV HEADER BLOCKED — duplicate columns: ${assessment.duplicateColumns.join(', ')}`);
  }
  if (assessment.unexpectedColumns.length > 0) {
    notes.push(`Additional source columns retained for review: ${assessment.unexpectedColumns.join(', ')}`);
  }
  notes.push(...assessment.warnings);

  if (assessment.status !== 'READY_FOR_REVIEW') {
    return { status: 'PENDING_VALIDATION', notes };
  }

  notes.unshift('CSV header admission PASS — required template columns are present and non-duplicated.');

  if (artifact.kind !== 'TELEMETRY_EXPORT') {
    notes.push('Row content and source authority remain subject to later validation.');
    return { status: 'PROVIDED', notes };
  }

  if (file.size > TELEMETRY_CONTENT_READ_LIMIT_BYTES) {
    notes.push(`TELEMETRY CONTENT PENDING — file exceeds the ${TELEMETRY_CONTENT_READ_LIMIT_BYTES / (1024 * 1024)} MB browser preflight limit. It must be processed by the controlled offline ingest path; no partial sample is accepted as full validation.`);
    return { status: 'PENDING_VALIDATION', notes };
  }

  const telemetryAssessment = assessTelemetryCsvContent(await file.text());
  const issueCount = Object.values(telemetryAssessment.issueCounts)
    .reduce((total, count) => total + (count ?? 0), 0);

  if (telemetryAssessment.status === 'BLOCKED') {
    notes.push(`TELEMETRY CONTENT BLOCKED — ${telemetryAssessment.dataRowCount} data row(s), ${issueCount} deterministic issue(s). No corrections were applied automatically.`);
    for (const issue of telemetryAssessment.issues.slice(0, 8)) {
      notes.push(`${issue.code}${issue.rowNumber ? ` · row ${issue.rowNumber}` : ''} — ${issue.message}`);
    }
    notes.push(...telemetryAssessment.warnings);
    return { status: 'PENDING_VALIDATION', notes };
  }

  notes.push(`Telemetry content admission PASS — ${telemetryAssessment.dataRowCount} data row(s) passed deterministic preflight checks for timestamp, asset/signal identity, numeric value, unit, source system, quality, duplicate/conflict and unit consistency.`);
  notes.push(...telemetryAssessment.warnings);
  notes.push('Content admission does not validate contractual criteria, source authority or operational acceptance.');
  return { status: 'PROVIDED', notes };
};

export const CommissioningPilotIntakeView: React.FC = () => {
  const [projectId, setProjectId] = useState('');
  const [scopeRevision, setScopeRevision] = useState('');
  const [artifacts, setArtifacts] = useState<PilotArtifact[]>(createEmptyArtifacts);
  const [fileMeta, setFileMeta] = useState<Record<string, { name: string; size: number }>>({});
  const [busyArtifactId, setBusyArtifactId] = useState<string | null>(null);
  const [result, setResult] = useState<PilotReadinessResult | null>(null);

  const requiredKindSet = useMemo(() => new Set(PILOT_REQUIRED_ARTIFACT_KINDS), []);

  const replaceArtifact = (artifactId: string, next: PilotArtifact) => {
    setArtifacts((current) => current.map((artifact) => artifact.artifactId === artifactId ? next : artifact));
    setResult(null);
  };

  const selectFile = async (artifact: PilotArtifact, file: File | undefined) => {
    if (!file) {
      replaceArtifact(artifact.artifactId, { artifactId: artifact.artifactId, kind: artifact.kind, status: 'MISSING' });
      setFileMeta((current) => {
        const next = { ...current };
        delete next[artifact.artifactId];
        return next;
      });
      return;
    }

    setBusyArtifactId(artifact.artifactId);
    setResult(null);
    try {
      const [sha256, csvAdmission] = await Promise.all([
        hashFileSha256(file),
        assessSelectedCsv(artifact, file),
      ]);
      replaceArtifact(artifact.artifactId, {
        artifactId: artifact.artifactId,
        kind: artifact.kind,
        status: csvAdmission.status,
        reference: file.name,
        sha256,
        notes: [
          'Selected locally in browser memory; not uploaded or persisted by Pilot Intake.',
          ...csvAdmission.notes,
        ],
      });
      setFileMeta((current) => ({ ...current, [artifact.artifactId]: { name: file.name, size: file.size } }));
    } catch (error) {
      replaceArtifact(artifact.artifactId, {
        artifactId: artifact.artifactId,
        kind: artifact.kind,
        status: 'PENDING_VALIDATION',
        reference: file.name,
        notes: [(error as Error).message],
      });
      setFileMeta((current) => ({ ...current, [artifact.artifactId]: { name: file.name, size: file.size } }));
    } finally {
      setBusyArtifactId(null);
    }
  };

  const evaluate = () => {
    setResult(assessPilotReadiness({
      projectId,
      scopeRevision,
      artifacts,
      realTimeConnectorConfigured: false,
      writebackCapabilityConfigured: false,
      operationalAuthorityClaimed: false,
    }));
  };

  const reset = () => {
    setProjectId('');
    setScopeRevision('');
    setArtifacts(createEmptyArtifacts());
    setFileMeta({});
    setBusyArtifactId(null);
    setResult(null);
  };

  return (
    <div className="space-y-5" id="commissioning-pilot-intake-view">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">G34 · Pilot Intake</p>
          <h2 className="mt-1 text-lg font-bold text-white">Preparación controlada de paquete piloto offline</h2>
          <p className="mt-1 max-w-4xl text-xs leading-relaxed text-gray-400">Selecciona únicamente exportaciones locales autorizadas. Esta vista evalúa si el paquete está completo para un dry run offline; no conecta SCADA/BMS/PCS/EMS, no inicia pruebas y no persiste archivos.</p>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-[10px] font-bold text-rose-200">OFFLINE ONLY · NO OT WRITEBACK · NO ENERGIZATION AUTHORITY</div>
      </header>

      <section className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
          <div>
            <p className="text-xs font-bold text-white">Privacidad y trazabilidad local</p>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-400">Los archivos seleccionados se leen en memoria del navegador para calcular SHA-256. Esta interfaz no los sube a un servidor, no usa red y no los guarda en localStorage. Las plantillas CSV descargables contienen únicamente encabezados genéricos, sin datos sintéticos ni datos de proyecto. Cuando se selecciona un CSV, sus encabezados se validan localmente; la telemetría CSV además pasa una validación determinística de contenido antes de admitirse como PROVIDED. El sistema no corrige filas, unidades ni valores automáticamente. El hash registrado por esta vista no sustituye una verificación independiente de evidencia.</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Project ID</span>
          <input value={projectId} onChange={(event) => { setProjectId(event.target.value); setResult(null); }} placeholder="Ej. DAS-BESS-PILOT" className="mt-2 min-h-11 w-full rounded-lg border border-gray-800 bg-gray-900 px-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-cyan-500" />
        </label>
        <label className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">Scope revision</span>
          <input value={scopeRevision} onChange={(event) => { setScopeRevision(event.target.value); setResult(null); }} placeholder="Ej. IFC-REV-03 / PILOT-REV-1" className="mt-2 min-h-11 w-full rounded-lg border border-gray-800 bg-gray-900 px-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-cyan-500" />
        </label>
      </section>

      <section className="space-y-2" aria-label="Pilot intake artifacts">
        {artifacts.map((artifact) => {
          const required = requiredKindSet.has(artifact.kind);
          const meta = fileMeta[artifact.artifactId];
          const busy = busyArtifactId === artifact.artifactId;
          return (
            <article key={artifact.artifactId} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-800 bg-gray-950 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold text-white">{ARTIFACT_LABELS[artifact.kind]}</p>
                  <span className={`rounded border px-2 py-0.5 text-[8px] font-black uppercase ${required ? 'border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border-gray-700 bg-gray-900 text-gray-400'}`}>{required ? 'Required' : 'Optional'}</span>
                  <span className={`rounded border px-2 py-0.5 text-[8px] font-black uppercase ${artifact.status === 'PROVIDED' ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : artifact.status === 'PENDING_VALIDATION' ? 'border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border-gray-700 bg-gray-900 text-gray-500'}`}>{busy ? 'HASHING / VALIDATING' : artifact.status.replaceAll('_', ' ')}</span>
                </div>
                {meta ? <p className="mt-2 break-all text-[10px] text-gray-500">{meta.name} · {meta.size.toLocaleString()} bytes{artifact.sha256 ? ` · SHA-256 ${artifact.sha256.slice(0, 16)}…` : ''}</p> : <p className="mt-2 text-[10px] text-gray-600">No local file selected.</p>}
                {artifact.notes?.length ? (
                  <div className="mt-2 space-y-1 text-[9px] leading-relaxed text-gray-500">
                    {artifact.notes.map((note) => <p key={note}>• {note}</p>)}
                  </div>
                ) : null}
              </div>
              <button type="button" onClick={() => downloadCsvTemplate(artifact.kind)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 text-xs font-bold text-gray-300 hover:bg-gray-800 hover:text-white" aria-label={`Descargar plantilla CSV para ${ARTIFACT_LABELS[artifact.kind]}`}>
                <Download className="h-4 w-4" />
                Descargar plantilla CSV
              </button>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-4 text-xs font-bold text-cyan-200 hover:bg-cyan-500/15">
                <FolderOpen className="h-4 w-4" />
                Seleccionar archivo local
                <input type="file" className="sr-only" aria-label={`Seleccionar ${ARTIFACT_LABELS[artifact.kind]}`} onChange={(event) => void selectFile(artifact, event.target.files?.[0])} />
              </label>
            </article>
          );
        })}
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled={busyArtifactId !== null} onClick={evaluate} className="min-h-11 flex-1 rounded-lg bg-cyan-400 px-4 text-xs font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">Evaluar preparación offline</button>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-950 px-4 text-xs font-bold text-gray-300 hover:bg-gray-900"><RotateCcw className="h-4 w-4" />Limpiar selección</button>
      </section>

      {result ? (
        <section className={`rounded-xl border p-5 ${result.status === 'READY_FOR_OFFLINE_INGEST' ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-amber-500/25 bg-amber-500/5'}`} aria-live="polite">
          <div className="flex items-center gap-2">
            <FileCheck2 className={`h-5 w-5 ${result.status === 'READY_FOR_OFFLINE_INGEST' ? 'text-emerald-300' : 'text-amber-300'}`} />
            <h3 className="text-sm font-black text-white">{result.status}</h3>
          </div>
          <p className="mt-2 text-[10px] text-gray-400">Required artifacts: {result.providedRequiredArtifacts}/{result.requiredArtifacts}. This status applies only to offline ingest admission.</p>
          {result.blockers.length > 0 ? <div className="mt-4"><p className="text-[9px] font-black uppercase tracking-wider text-amber-300">Blockers</p><ul className="mt-2 space-y-1 text-[10px] text-gray-300">{result.blockers.map((blocker) => <li key={blocker}>• {blocker}</li>)}</ul></div> : null}
          {result.warnings.length > 0 ? <div className="mt-4"><p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Warnings</p><ul className="mt-2 space-y-1 text-[10px] text-gray-400">{result.warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul></div> : null}
          <div className="mt-4 rounded-lg border border-rose-500/15 bg-rose-500/5 p-3 text-[10px] leading-relaxed text-rose-200">Operational ready: NO · Energization authorized: NO · OT writeback allowed: NO. Even a READY_FOR_OFFLINE_INGEST result only permits the next controlled offline review step.</div>
        </section>
      ) : null}
    </div>
  );
};