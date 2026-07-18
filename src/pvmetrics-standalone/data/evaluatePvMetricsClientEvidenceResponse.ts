import { PVMetricsClientValidationRequestPack } from '../types/pvmetrics-client-validation-request.types';
import {
  PVMetricsClientEvidenceResponseDataset,
  PVMetricsClientEvidenceResponseEvaluation,
} from '../types/pvmetrics-client-evidence-response.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const isReceivedLike = (status: string) =>
  status === 'received' || status === 'partially-valid';

const resolveEvidenceScore = (
  dataset: PVMetricsClientEvidenceResponseDataset,
) => {
  if (!dataset.items.length) return 100;

  const totalPoints = dataset.items.length * 100;

  const points = dataset.items.reduce((sum, item) => {
    if (item.status === 'received') {
      if (item.quality === 'official') return sum + 100;
      if (item.quality === 'high') return sum + 85;
      if (item.quality === 'medium') return sum + 70;
      return sum + 55;
    }

    if (item.status === 'partially-valid') return sum + 45;
    if (item.status === 'not-required') return sum + 100;
    if (item.status === 'rejected') return sum + 0;

    return sum + 10;
  }, 0);

  return Math.round((points / totalPoints) * 100);
};

export const evaluatePvMetricsClientEvidenceResponse = ({
  dataset,
  pack,
}: {
  dataset: PVMetricsClientEvidenceResponseDataset;
  pack: PVMetricsClientValidationRequestPack;
}): PVMetricsClientEvidenceResponseEvaluation => {
  const totalItems = dataset.items.length;
  const receivedItems = dataset.items.filter(
    (item) => item.status === 'received',
  ).length;
  const partiallyValidItems = dataset.items.filter(
    (item) => item.status === 'partially-valid',
  ).length;
  const rejectedItems = dataset.items.filter(
    (item) => item.status === 'rejected',
  ).length;
  const pendingItems = dataset.items.filter(
    (item) => item.status === 'requested' || item.status === 'not-requested',
  ).length;
  const blockingPendingItems = dataset.items.filter(
    (item) =>
      item.blocksReadonlyPilot &&
      !isReceivedLike(item.status) &&
      item.status !== 'not-required',
  ).length;
  const officialEvidenceItems = dataset.items.filter(
    (item) => item.quality === 'official',
  ).length;

  const evidenceScorePct = resolveEvidenceScore(dataset);

  const canMoveToClientValidation =
    evidenceScorePct >= 60 && rejectedItems === 0 && blockingPendingItems <= 2;

  const canPrepareReadonlyPilot =
    evidenceScorePct >= 85 && blockingPendingItems === 0 && rejectedItems === 0;

  const readinessLabel = canPrepareReadonlyPilot
    ? 'EVIDENCIA SUFICIENTE PARA PREPARAR PILOTO READ-ONLY'
    : canMoveToClientValidation
      ? 'EVIDENCIA SUFICIENTE PARA VALIDACIÓN CLIENTE'
      : 'EVIDENCIA INSUFICIENTE — MANTENER COMO DRAFT';

  const nextActions = dataset.items
    .filter(
      (item) =>
        item.status === 'requested' ||
        item.status === 'not-requested' ||
        item.status === 'rejected' ||
        item.status === 'partially-valid',
    )
    .slice(0, 6)
    .map((item) => {
      if (item.status === 'rejected') {
        return `Solicitar corrección o reemplazo de evidencia: ${item.title}.`;
      }

      if (item.status === 'partially-valid') {
        return `Revisar evidencia parcial y solicitar complemento: ${item.title}.`;
      }

      return `Solicitar o confirmar evidencia pendiente: ${item.title}.`;
    });

  return {
    id: `evidence-evaluation-${dataset.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: dataset.plantName,
    plantCode: dataset.plantCode,
    totalItems,
    receivedItems,
    partiallyValidItems,
    rejectedItems,
    pendingItems,
    blockingPendingItems,
    officialEvidenceItems,
    evidenceScorePct,
    readinessLabel,
    canMoveToClientValidation,
    canPrepareReadonlyPilot,
    executiveNote:
      'Evaluación local y conceptual de evidencias recibidas. No certifica documentos oficiales ni reemplaza revisión humana.',
    nextActions,
    safetyBoundary:
      'Este simulador trabaja solo en memoria. No guarda documentos, no sube archivos, no envía correos, no conecta SCADA, no modifica setpoints y no habilita telecontrol.',
    sourceDataset: dataset,
    sourcePack: pack,
  };
};
