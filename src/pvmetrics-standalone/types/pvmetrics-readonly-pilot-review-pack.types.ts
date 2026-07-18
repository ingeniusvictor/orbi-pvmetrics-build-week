import { PVMetricsReadonlyPilotScope } from './pvmetrics-readonly-pilot-scope.types';

export type PVMetricsReadonlyPilotReviewItemStatus =
  | 'pending-client-confirmation'
  | 'confirmed'
  | 'requires-clarification'
  | 'not-applicable';

export type PVMetricsReadonlyPilotReviewItemCategory =
  | 'signal-availability'
  | 'source-system'
  | 'read-only-access'
  | 'data-quality'
  | 'bess'
  | 'security'
  | 'governance';

export type PVMetricsReadonlyPilotReviewItem = {
  id: string;
  category: PVMetricsReadonlyPilotReviewItemCategory;
  signalId?: string;
  label: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: PVMetricsReadonlyPilotReviewItemStatus;
  questionForClient: string;
  internalReason: string;
  blocksReadonlyPreparation: boolean;
};

export type PVMetricsReadonlyPilotReviewPack = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  totalItems: number;
  criticalItems: number;
  highItems: number;
  mediumItems: number;
  lowItems: number;
  bessItems: number;
  blockingItems: number;

  items: PVMetricsReadonlyPilotReviewItem[];

  mandatorySignalSummary: string[];
  recommendedSignalSummary: string[];
  optionalSignalSummary: string[];
  readOnlyConfirmations: string[];
  clientReviewText: string;
  internalReviewText: string;
  safetyBoundary: string;

  sourceScope: PVMetricsReadonlyPilotScope;
};
