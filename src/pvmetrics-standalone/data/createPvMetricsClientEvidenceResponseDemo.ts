import { PVMetricsClientValidationRequestPack } from '../types/pvmetrics-client-validation-request.types';
import {
  PVMetricsClientEvidenceResponseDataset,
  PVMetricsClientEvidenceResponseItem,
} from '../types/pvmetrics-client-evidence-response.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

export const createPvMetricsClientEvidenceResponseDemo = (
  pack: PVMetricsClientValidationRequestPack,
): PVMetricsClientEvidenceResponseDataset => {
  const items: PVMetricsClientEvidenceResponseItem[] = pack.items.map((item) => ({
    id: `evidence-${item.id}`,
    requestItemId: item.id,
    title: item.title,
    category: item.category,
    priority: item.priority,
    status: 'requested',
    quality: 'not-reviewed',
    blocksReadonlyPilot: item.blocksReadonlyPilot,
    simulatedEvidenceLabel: '',
    reviewerNote: item.reason,
  }));

  return {
    id: `evidence-response-${pack.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: pack.plantName,
    plantCode: pack.plantCode,
    sourcePackId: pack.id,
    items,
  };
};
