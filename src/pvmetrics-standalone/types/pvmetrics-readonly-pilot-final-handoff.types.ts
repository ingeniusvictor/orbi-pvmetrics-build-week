import { PVMetricsReadonlyPilotDataContractDraft } from './pvmetrics-readonly-pilot-data-contract.types';

export type PVMetricsReadonlyPilotFinalHandoffStatus =
  | 'blocked'
  | 'draft-handoff'
  | 'ready-for-internal-review'
  | 'ready-for-client-handoff';

export type PVMetricsReadonlyPilotFinalHandoffItemStatus =
  | 'complete'
  | 'pending'
  | 'warning'
  | 'blocked';

export type PVMetricsReadonlyPilotFinalHandoffItemCategory =
  | 'scope'
  | 'review-pack'
  | 'go-no-go'
  | 'data-contract'
  | 'security'
  | 'governance'
  | 'client-action'
  | 'orbi-action';

export type PVMetricsReadonlyPilotFinalHandoffItem = {
  id: string;
  category: PVMetricsReadonlyPilotFinalHandoffItemCategory;
  label: string;
  status: PVMetricsReadonlyPilotFinalHandoffItemStatus;
  requiredForClientHandoff: boolean;
  evidence: string;
  nextAction: string;
};

export type PVMetricsReadonlyPilotFinalHandoffPackage = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;

  handoffStatus: PVMetricsReadonlyPilotFinalHandoffStatus;
  handoffStatusLabel: string;

  inheritedContractStatusLabel: string;
  inheritedGoNoGoDecisionLabel: string;
  inheritedReadinessScorePct: number;

  totalItems: number;
  completeItems: number;
  pendingItems: number;
  warningItems: number;
  blockedItems: number;

  handoffItems: PVMetricsReadonlyPilotFinalHandoffItem[];

  preparedDeliverables: string[];
  criticalPendingItems: string[];
  recommendedPendingItems: string[];
  finalRisks: string[];
  actionsBeforePilot: string[];
  securityBoundaries: string[];

  executiveSummary: string;
  internalHandoffText: string;
  clientHandoffText: string;
  safetyBoundary: string;

  sourceDataContract: PVMetricsReadonlyPilotDataContractDraft;
};
