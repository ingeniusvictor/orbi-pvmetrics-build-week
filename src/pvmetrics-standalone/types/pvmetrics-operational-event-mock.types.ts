import {
  PVMetricsOperationalEventCategory,
  PVMetricsOperationalEventImpactArea,
  PVMetricsOperationalEventSeverity,
  PVMetricsOperationalEventStatus,
} from './pvmetrics-operational-event-blueprint.types';

export type PVMetricsOperationalEventEvidenceMode =
  | 'mock'
  | 'manual-note'
  | 'pending-validation'
  | 'future-integration';

export type PVMetricsOperationalEventMockItem = {
  id: string;
  title: string;
  category: PVMetricsOperationalEventCategory;
  status: PVMetricsOperationalEventStatus;
  severity: PVMetricsOperationalEventSeverity;
  startTimeLabel: string;
  endTimeLabel: string;
  affectedAsset: string;
  estimatedPowerImpactMw: number;
  estimatedEnergyImpactMwh: number;
  estimatedAvailabilityImpactPct: number;
  impactedAreas: PVMetricsOperationalEventImpactArea[];
  evidenceMode: PVMetricsOperationalEventEvidenceMode;
  evidence: string;
  recommendedAction: string;
  traceabilityNote: string;
};

export type PVMetricsOperationalEventMockAssessmentStatus =
  | 'no-events'
  | 'monitoring'
  | 'review-required'
  | 'critical-review-required';

export type PVMetricsOperationalEventMockImpactSummary = {
  totalEvents: number;
  activeEvents: number;
  criticalEvents: number;
  highEvents: number;
  estimatedTotalPowerImpactMw: number;
  estimatedTotalEnergyImpactMwh: number;
  estimatedAvailabilityImpactPct: number;
  forecastImpactLevel: 'low' | 'medium' | 'high' | 'critical';
  cenComplianceImpact: 'none' | 'warning' | 'blocking-review';
};

export type PVMetricsOperationalEventMockAssessment = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  status: PVMetricsOperationalEventMockAssessmentStatus;
  statusLabel: string;
  impactSummary: PVMetricsOperationalEventMockImpactSummary;
  events: PVMetricsOperationalEventMockItem[];
  forecastAdjustmentNotes: string[];
  complianceWarnings: string[];
  omRecommendations: string[];
  dataQualityWarnings: string[];
  internalEventText: string;
  clientEventText: string;
  safetyBoundary: string;
};
