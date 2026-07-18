import { PVMetricsClientValidationRequestPack } from './pvmetrics-client-validation-request.types';

export type PVMetricsClientEvidenceStatus =
  | 'not-requested'
  | 'requested'
  | 'received'
  | 'partially-valid'
  | 'rejected'
  | 'not-required';

export type PVMetricsClientEvidenceQuality =
  | 'not-reviewed'
  | 'low'
  | 'medium'
  | 'high'
  | 'official';

export type PVMetricsClientEvidenceResponseItem = {
  id: string;
  requestItemId: string;
  title: string;
  category: string;
  priority: string;
  status: PVMetricsClientEvidenceStatus;
  quality: PVMetricsClientEvidenceQuality;
  blocksReadonlyPilot: boolean;
  simulatedEvidenceLabel: string;
  reviewerNote: string;
};

export type PVMetricsClientEvidenceResponseDataset = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  sourcePackId: string;
  items: PVMetricsClientEvidenceResponseItem[];
};

export type PVMetricsClientEvidenceResponseEvaluation = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  totalItems: number;
  receivedItems: number;
  partiallyValidItems: number;
  rejectedItems: number;
  pendingItems: number;
  blockingPendingItems: number;
  officialEvidenceItems: number;
  evidenceScorePct: number;
  readinessLabel: string;
  canMoveToClientValidation: boolean;
  canPrepareReadonlyPilot: boolean;
  executiveNote: string;
  nextActions: string[];
  safetyBoundary: string;
  sourceDataset: PVMetricsClientEvidenceResponseDataset;
  sourcePack: PVMetricsClientValidationRequestPack;
};
