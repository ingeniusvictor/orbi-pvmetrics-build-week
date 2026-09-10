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
import { assessTelemetryCsvContent, type TelemetryIssueCode } from '../pilot/telemetryContentValidation';
import { useCommissioningI18n } from '../localization/CommissioningLocaleContext';
import type { CommissioningLocale } from '../localization/commissioningLocale';

const ARTIFACT_LABELS: Record<PilotArtifactKind, { es: string; en: string }> = {
  PROJECT_IDENTITY: { es: 'Identidad del proyecto', en: 'Project identity' },
  SCOPE_REGISTER: { es: 'Registro de alcance', en: 'Scope register' },
  ASSET_REGISTER: { es: 'Registro de activos', en: 'Asset register' },
  TEST_MATRIX: { es: 'Matriz de pruebas', en: 'Test matrix' },
  CRITERIA_SOURCES: { es: 'Fuentes de criterios de aceptación', en: 'Acceptance criteria sources' },
  SIGNAL_DICTIONARY: { es: 'Diccionario de señales (opcional)', en: 'Signal dictionary (optional)' },
  SIGNAL_MAPPING: { es: 'Mapeo de señales', en: 'Signal mapping' },
  TELEMETRY_EXPORT: { es: 'Exportación de telemetría', en: 'Telemetry export' },
  EVENT_EXPORT: { es: 'Exportación de eventos / alarmas (opcional)', en: 'Event / alarm export (optional)' },
  EVIDENCE_PACKAGE_INDEX: { es: 'Índice del paquete de evidencias', en: 'Evidence package index' },
  AUTHORITY_REGISTER: { es: 'Registro de autoridad / testigos / revisores', en: 'Authority / witness / reviewer register' },
};

const ALL_ARTIFACT_KINDS: readonly PilotArtifactKind[] = [
  ...PILOT_REQUIRED_ARTIFACT_KINDS,
  ...PILOT_OPTIONAL_ARTIFACT_KINDS,
];

const CSV_HEADER_READ_LIMIT_BYTES = 64 * 1024;
const TELEMETRY_CONTENT_READ_LIMIT_BYTES = 10 * 1024 * 1024;

type TextFn = (spanish: string, english: string) => string;

const artifactLabel = (kind: PilotArtifactKind, locale: CommissioningLocale): string =>
  ARTIFACT_LABELS[kind][locale];

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

const telemetryIssueText = (code: TelemetryIssueCode, t: TextFn): string => {
  const copy: Record<TelemetryIssueCode, [string, string]> = {
    CSV_UNTERMINATED_QUOTE: ['El CSV contiene un campo entre comillas sin cierre.', 'CSV contains an unterminated quoted field.'],
    EMPTY_DATASET: ['El CSV de telemetría no contiene filas de datos válidas.', 'Telemetry CSV contains no valid data rows.'],
    MISSING_REQUIRED_COLUMN: ['Falta una columna obligatoria en la telemetría.', 'A required telemetry column is missing.'],
    ROW_WIDTH_MISMATCH: ['La fila tiene una cantidad de columnas distinta al encabezado.', 'Row column count does not match the header.'],
    INVALID_TIMESTAMP: ['La marca de tiempo no es válida.', 'Timestamp is invalid.'],
    EMPTY_ASSET_ID: ['El identificador del activo está vacío.', 'Asset ID is empty.'],
    EMPTY_SIGNAL_KEY: ['La clave de señal está vacía.', 'Signal key is empty.'],
    NON_NUMERIC_VALUE: ['El valor está vacío o no es numérico.', 'Value is missing or non-numeric.'],
    MISSING_UNIT: ['Falta la unidad de medida.', 'Unit is missing.'],
    EMPTY_SOURCE_SYSTEM: ['El sistema de origen está vacío.', 'Source system is empty.'],
    INVALID_QUALITY: ['La calidad debe ser GOOD, SUSPECT, MISSING o INVALID.', 'Quality must be GOOD, SUSPECT, MISSING or INVALID.'],
    DUPLICATE_ROW: ['La fila duplica exactamente una muestra anterior.', 'Row exactly duplicates an earlier sample.'],
    CONFLICTING_SAMPLE: ['Existe una muestra conflictiva para la misma fecha, activo, señal y fuente.', 'A conflicting sample exists for the same timestamp, asset, signal and source.'],
    INCONSISTENT_UNIT: ['La serie cambia de unidad sin una conversión autorizada.', 'The series changes unit without an authorized conversion.'],
  };
  return t(copy[code][0], copy[code][1]);
};

const localizePilotMessage = (message: string, t: TextFn): string => {
  if (message === 'Project identity is not declared.') return t('La identidad del proyecto no está declarada.', message);
  if (message === 'Scope revision is not declared.') return t('La revisión del alcance no está declarada.', message);
  if (message.includes('is required for offline pilot intake.')) return t(message.replace('is required for offline pilot intake.', 'es obligatorio para el ingreso piloto offline.'), message);
  if (message.includes('is pending validation.')) return t(message.replace('is pending validation.', 'está pendiente de validación.'), message);
  if (message.includes('is marked PROVIDED without a traceable reference.')) return t(message.replace('is marked PROVIDED without a traceable reference.', 'está marcado como PROPORCIONADO sin una referencia trazable.'), message);
  if (message.includes('requires a recorded SHA-256 before offline ingest.')) return t(message.replace('requires a recorded SHA-256 before offline ingest.', 'requiere un SHA-256 registrado antes de la ingesta offline.'), message);
  if (message.startsWith('Real-time connector configuration')) return t('La configuración de conectores en tiempo real está fuera del alcance del ingreso piloto offline G34.', message);
  if (message.startsWith('OT writeback capability')) return t('La capacidad de escritura OT está prohibida dentro del límite de ingreso piloto G34.', message);
  if (message.startsWith('Offline pilot readiness must not')) return t('La preparación piloto offline no debe representarse como autoridad operacional ni de energización.', message);
  if (message.startsWith('No event export is provided')) return t('No se proporcionó una exportación de eventos; la correlación de alarmas y disparos quedará limitada durante el dry run.', message);
  if (message.startsWith('No source signal dictionary is provided')) return t('No se proporcionó un diccionario de señales de origen; el mapeo suministrado deberá contener explícitamente la semántica de la fuente.', message);
  return message;
};

const assessSelectedCsv = async (
  artifact: PilotArtifact,
  file: File,
  t: TextFn,
): Promise<{ status: PilotArtifact['status']; notes: string[] }> => {
  if (!file.name.toLowerCase().endsWith('.csv')) {
    if (artifact.kind === 'TELEMETRY_EXPORT') {
      return {
        status: 'PENDING_VALIDATION',
        notes: [t(
          'CONTENIDO DE TELEMETRÍA BLOQUEADO — la validación actual de telemetría normalizada requiere CSV. La telemetría en otro formato debe utilizar posteriormente un parser offline autorizado; no se infiere ninguna conversión de formato.',
          'TELEMETRY CONTENT BLOCKED — the current normalized telemetry preflight requires CSV. Non-CSV telemetry must use a later authorized offline parser; no format conversion is inferred.',
        )],
      };
    }
    return {
      status: 'PROVIDED',
      notes: [t(
        'Archivo no CSV seleccionado. La identidad del archivo y su SHA-256 se registran localmente; el contenido y la estructura aún requieren validación manual autorizada.',
        'Non-CSV file selected. File identity and SHA-256 are recorded locally; content/structure still requires authorized manual validation.',
      )],
    };
  }

  const headerSample = await file.slice(0, CSV_HEADER_READ_LIMIT_BYTES).text();
  const assessment = assessPilotCsvHeader(artifact.kind, headerSample);
  const notes: string[] = [];

  if (assessment.missingRequiredColumns.length > 0) {
    notes.push(t(
      `ENCABEZADO CSV BLOQUEADO — faltan columnas obligatorias: ${assessment.missingRequiredColumns.join(', ')}`,
      `CSV HEADER BLOCKED — missing required columns: ${assessment.missingRequiredColumns.join(', ')}`,
    ));
  }
  if (assessment.duplicateColumns.length > 0) {
    notes.push(t(
      `ENCABEZADO CSV BLOQUEADO — columnas duplicadas: ${assessment.duplicateColumns.join(', ')}`,
      `CSV HEADER BLOCKED — duplicate columns: ${assessment.duplicateColumns.join(', ')}`,
    ));
  }
  if (assessment.unexpectedColumns.length > 0) {
    notes.push(t(
      `Columnas adicionales de la fuente conservadas para revisión: ${assessment.unexpectedColumns.join(', ')}`,
      `Additional source columns retained for review: ${assessment.unexpectedColumns.join(', ')}`,
    ));
  }
  if (assessment.warnings.length > 0) {
    notes.push(t(
      'El encabezado CSV contiene advertencias que requieren revisión y no se interpretarán silenciosamente.',
      assessment.warnings.join(' '),
    ));
  }

  if (assessment.status !== 'READY_FOR_REVIEW') {
    return { status: 'PENDING_VALIDATION', notes };
  }

  notes.unshift(t(
    'Admisión de encabezado CSV: CUMPLE — las columnas obligatorias están presentes y no están duplicadas.',
    'CSV header admission PASS — required template columns are present and non-duplicated.',
  ));

  if (artifact.kind !== 'TELEMETRY_EXPORT') {
    notes.push(t(
      'El contenido de las filas y la autoridad de la fuente quedan sujetos a una validación posterior.',
      'Row content and source authority remain subject to later validation.',
    ));
    return { status: 'PROVIDED', notes };
  }

  if (file.size > TELEMETRY_CONTENT_READ_LIMIT_BYTES) {
    notes.push(t(
      `CONTENIDO DE TELEMETRÍA PENDIENTE — el archivo supera el límite de ${TELEMETRY_CONTENT_READ_LIMIT_BYTES / (1024 * 1024)} MB para validación previa en el navegador. Debe procesarse mediante la ruta controlada de ingesta offline; una muestra parcial nunca se acepta como validación completa.`,
      `TELEMETRY CONTENT PENDING — file exceeds the ${TELEMETRY_CONTENT_READ_LIMIT_BYTES / (1024 * 1024)} MB browser preflight limit. It must be processed by the controlled offline ingest path; no partial sample is accepted as full validation.`,
    ));
    return { status: 'PENDING_VALIDATION', notes };
  }

  const telemetryAssessment = assessTelemetryCsvContent(await file.text());
  const issueCount = Object.values(telemetryAssessment.issueCounts)
    .reduce((total, count) => total + (count ?? 0), 0);

  if (telemetryAssessment.status === 'BLOCKED') {
    notes.push(t(
      `CONTENIDO DE TELEMETRÍA BLOQUEADO — ${telemetryAssessment.dataRowCount} fila(s) de datos, ${issueCount} problema(s) determinístico(s). No se aplicó ninguna corrección automática.`,
      `TELEMETRY CONTENT BLOCKED — ${telemetryAssessment.dataRowCount} data row(s), ${issueCount} deterministic issue(s). No corrections were applied automatically.`,
    ));
    for (const issue of telemetryAssessment.issues.slice(0, 8)) {
      notes.push(`${issue.code}${issue.rowNumber ? ` · ${t('fila', 'row')} ${issue.rowNumber}` : ''} — ${telemetryIssueText(issue.code, t)}`);
    }
    if (telemetryAssessment.warnings.length > 0) {
      notes.push(t(
        'La telemetría contiene advertencias de orden o volumen de problemas; las filas no se reordenan ni corrigen automáticamente.',
        telemetryAssessment.warnings.join(' '),
      ));
    }
    return { status: 'PENDING_VALIDATION', notes };
  }

  notes.push(t(
    `Admisión de contenido de telemetría: CUMPLE — ${telemetryAssessment.dataRowCount} fila(s) superaron las comprobaciones determinísticas de fecha/hora, identidad de activo/señal, valor numérico, unidad, sistema de origen, calidad, duplicados/conflictos y consistencia de unidades.`,
    `Telemetry content admission PASS — ${telemetryAssessment.dataRowCount} data row(s) passed deterministic preflight checks for timestamp, asset/signal identity, numeric value, unit, source system, quality, duplicate/conflict and unit consistency.`,
  ));
  if (telemetryAssessment.warnings.length > 0) {
    notes.push(t(
      'La telemetría contiene registros fuera de orden cronológico; no se reordenaron automáticamente.',
      telemetryAssessment.warnings.join(' '),
    ));
  }
  notes.push(t(
    'La admisión de contenido no valida criterios contractuales, autoridad de la fuente ni aceptación operacional.',
    'Content admission does not validate contractual criteria, source authority or operational acceptance.',
  ));
  return { status: 'PROVIDED', notes };
};

export const CommissioningPilotIntakeView: React.FC = () => {
  const i18n = useCommissioningI18n();
  const { locale } = i18n;
  const t = i18n.text;
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
        assessSelectedCsv(artifact, file, t),
      ]);
      replaceArtifact(artifact.artifactId, {
        artifactId: artifact.artifactId,
        kind: artifact.kind,
        status: csvAdmission.status,
        reference: file.name,
        sha256,
        notes: [
          t(
            'Seleccionado localmente en la memoria del navegador; Pilot Intake no lo sube ni lo persiste.',
            'Selected locally in browser memory; not uploaded or persisted by Pilot Intake.',
          ),
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
        notes: [t('No fue posible completar la validación local del archivo.', 'Unable to complete local file validation.'), String((error as Error).message)],
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
          <p className="text-[10px] font-black uppercase tracking-wider text-cyan-300">G34 · {t('Ingreso Piloto', 'Pilot Intake')}</p>
          <h2 className="mt-1 text-lg font-bold text-white">{t('Preparación controlada del paquete piloto offline', 'Controlled offline pilot package preparation')}</h2>
          <p className="mt-1 max-w-4xl text-xs leading-relaxed text-gray-400">{t(
            'Selecciona únicamente exportaciones locales autorizadas. Esta vista evalúa si el paquete está completo para un dry run offline; no conecta SCADA/BMS/PCS/EMS, no inicia pruebas y no persiste archivos.',
            'Select only authorized local exports. This view evaluates whether the package is complete for an offline dry run; it does not connect to SCADA/BMS/PCS/EMS, start tests or persist files.',
          )}</p>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-[10px] font-bold text-rose-200">{t('SOLO OFFLINE · SIN ESCRITURA OT · SIN AUTORIDAD DE ENERGIZACIÓN', 'OFFLINE ONLY · NO OT WRITEBACK · NO ENERGIZATION AUTHORITY')}</div>
      </header>

      <section className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
          <div>
            <p className="text-xs font-bold text-white">{t('Privacidad y trazabilidad local', 'Local privacy and traceability')}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-400">{t(
              'Los archivos seleccionados se leen en memoria del navegador para calcular SHA-256. Esta interfaz no los sube a un servidor, no usa red y no los guarda en localStorage. Las plantillas CSV contienen solo encabezados genéricos, sin datos sintéticos ni de proyecto. Los encabezados y, para telemetría, el contenido se validan localmente sin corregir filas, unidades ni valores automáticamente. El hash registrado no sustituye una verificación independiente de evidencia.',
              'Selected files are read in browser memory to calculate SHA-256. This interface does not upload them to a server, use the network or save them to localStorage. CSV templates contain generic headers only, with no synthetic or project data. Headers and, for telemetry, content are validated locally without automatically correcting rows, units or values. A recorded hash does not replace independent evidence verification.',
            )}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">{t('ID del proyecto', 'Project ID')}</span>
          <input value={projectId} onChange={(event) => { setProjectId(event.target.value); setResult(null); }} placeholder={t('Ej. DAS-BESS-PILOT', 'e.g. DAS-BESS-PILOT')} className="mt-2 min-h-11 w-full rounded-lg border border-gray-800 bg-gray-900 px-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-cyan-500" />
        </label>
        <label className="rounded-xl border border-gray-800 bg-gray-950 p-4 text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">{t('Revisión del alcance', 'Scope revision')}</span>
          <input value={scopeRevision} onChange={(event) => { setScopeRevision(event.target.value); setResult(null); }} placeholder={t('Ej. IFC-REV-03 / PILOT-REV-1', 'e.g. IFC-REV-03 / PILOT-REV-1')} className="mt-2 min-h-11 w-full rounded-lg border border-gray-800 bg-gray-900 px-3 text-xs text-white outline-none placeholder:text-gray-700 focus:border-cyan-500" />
        </label>
      </section>

      <section className="space-y-2" aria-label={t('Artefactos de ingreso piloto', 'Pilot intake artifacts')}>
        {artifacts.map((artifact) => {
          const required = requiredKindSet.has(artifact.kind);
          const meta = fileMeta[artifact.artifactId];
          const busy = busyArtifactId === artifact.artifactId;
          const label = artifactLabel(artifact.kind, locale);
          return (
            <article key={artifact.artifactId} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-800 bg-gray-950 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold text-white">{label}</p>
                  <span className={`rounded border px-2 py-0.5 text-[8px] font-black uppercase ${required ? 'border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border-gray-700 bg-gray-900 text-gray-400'}`}>{required ? t('Obligatorio', 'Required') : t('Opcional', 'Optional')}</span>
                  <span className={`rounded border px-2 py-0.5 text-[8px] font-black uppercase ${artifact.status === 'PROVIDED' ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : artifact.status === 'PENDING_VALIDATION' ? 'border-amber-500/25 bg-amber-500/10 text-amber-300' : 'border-gray-700 bg-gray-900 text-gray-500'}`}>{busy ? t('CALCULANDO HASH / VALIDANDO', 'HASHING / VALIDATING') : i18n.canonical(artifact.status)}</span>
                </div>
                {meta ? <p className="mt-2 break-all text-[10px] text-gray-500">{meta.name} · {meta.size.toLocaleString(locale === 'es' ? 'es-CL' : 'en-US')} bytes{artifact.sha256 ? ` · SHA-256 ${artifact.sha256.slice(0, 16)}…` : ''}</p> : <p className="mt-2 text-[10px] text-gray-600">{t('No se ha seleccionado un archivo local.', 'No local file selected.')}</p>}
                {artifact.notes?.length ? (
                  <div className="mt-2 space-y-1 text-[9px] leading-relaxed text-gray-500">
                    {artifact.notes.map((note) => <p key={note}>• {note}</p>)}
                  </div>
                ) : null}
              </div>
              <button type="button" onClick={() => downloadCsvTemplate(artifact.kind)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-4 text-xs font-bold text-gray-300 hover:bg-gray-800 hover:text-white" aria-label={t(`Descargar plantilla CSV para ${label}`, `Download CSV template for ${label}`)}>
                <Download className="h-4 w-4" />
                {t('Descargar plantilla CSV', 'Download CSV template')}
              </button>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-4 text-xs font-bold text-cyan-200 hover:bg-cyan-500/15">
                <FolderOpen className="h-4 w-4" />
                {t('Seleccionar archivo local', 'Select local file')}
                <input type="file" className="sr-only" aria-label={t(`Seleccionar ${label}`, `Select ${label}`)} onChange={(event) => void selectFile(artifact, event.target.files?.[0])} />
              </label>
            </article>
          );
        })}
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled={busyArtifactId !== null} onClick={evaluate} className="min-h-11 flex-1 rounded-lg bg-cyan-400 px-4 text-xs font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{t('Evaluar preparación offline', 'Evaluate offline readiness')}</button>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-950 px-4 text-xs font-bold text-gray-300 hover:bg-gray-900"><RotateCcw className="h-4 w-4" />{t('Limpiar selección', 'Clear selection')}</button>
      </section>

      {result ? (
        <section className={`rounded-xl border p-5 ${result.status === 'READY_FOR_OFFLINE_INGEST' ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-amber-500/25 bg-amber-500/5'}`} aria-live="polite">
          <div className="flex items-center gap-2">
            <FileCheck2 className={`h-5 w-5 ${result.status === 'READY_FOR_OFFLINE_INGEST' ? 'text-emerald-300' : 'text-amber-300'}`} />
            <h3 className="text-sm font-black text-white">{result.status === 'READY_FOR_OFFLINE_INGEST' ? t('LISTO PARA INGESTA OFFLINE', 'READY FOR OFFLINE INGEST') : t('BLOQUEADO', 'BLOCKED')}</h3>
          </div>
          <p className="mt-2 text-[10px] text-gray-400">{t('Artefactos obligatorios', 'Required artifacts')}: {result.providedRequiredArtifacts}/{result.requiredArtifacts}. {t('Este estado aplica únicamente a la admisión para ingesta offline.', 'This status applies only to offline ingest admission.')}</p>
          {result.blockers.length > 0 ? <div className="mt-4"><p className="text-[9px] font-black uppercase tracking-wider text-amber-300">{t('Bloqueos', 'Blockers')}</p><ul className="mt-2 space-y-1 text-[10px] text-gray-300">{result.blockers.map((blocker) => <li key={blocker}>• {localizePilotMessage(blocker, t)}</li>)}</ul></div> : null}
          {result.warnings.length > 0 ? <div className="mt-4"><p className="text-[9px] font-black uppercase tracking-wider text-gray-500">{t('Advertencias', 'Warnings')}</p><ul className="mt-2 space-y-1 text-[10px] text-gray-400">{result.warnings.map((warning) => <li key={warning}>• {localizePilotMessage(warning, t)}</li>)}</ul></div> : null}
          <div className="mt-4 rounded-lg border border-rose-500/15 bg-rose-500/5 p-3 text-[10px] leading-relaxed text-rose-200">{t(
            'Preparado para operación: NO · Energización autorizada: NO · Escritura OT permitida: NO. Incluso un resultado LISTO PARA INGESTA OFFLINE solo permite el siguiente paso controlado de revisión offline.',
            'Operational ready: NO · Energization authorized: NO · OT writeback allowed: NO. Even a READY FOR OFFLINE INGEST result only permits the next controlled offline review step.',
          )}</div>
        </section>
      ) : null}
    </div>
  );
};