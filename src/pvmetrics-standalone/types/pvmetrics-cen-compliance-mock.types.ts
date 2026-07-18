import {
  PVMetricsCenComplianceBlueprint,
  PVMetricsCenComplianceCheckSeverity,
  PVMetricsCenComplianceFieldCategory,
} from './pvmetrics-cen-compliance-blueprint.types';
import { PVMetricsSolarForecastSummary } from './pvmetrics-solar-forecast-summary.types';

export type PVMetricsCenComplianceAssessmentStatus =
  | 'blocked'
  | 'not-ready'
  | 'draft-review'
  | 'conceptually-ready';

export type PVMetricsCenComplianceAssessmentItem = {
  id: string;
  label: string;
  severity: PVMetricsCenComplianceCheckSeverity;
  passed: boolean;
  blocksSubmission: boolean;
  evidence: string;
  recommendedAction: string;
};

export type PVMetricsCenComplianceFieldAssessment = {
  id: string;
  label: string;
  category: PVMetricsCenComplianceFieldCategory;
  required: boolean;
  available: boolean;
  evidence: string;
};

export type PVMetricsCenComplianceMockAssessment = {
  id: string;
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  horizonLabel: string;

  status: PVMetricsCenComplianceAssessmentStatus;
  statusLabel: string;
  complianceScorePct: number;

  totalChecks: number;
  passedChecks: number;
  blockedChecks: number;
  missingRequiredFields: number;

  fieldAssessments: PVMetricsCenComplianceFieldAssessment[];
  checkAssessments: PVMetricsCenComplianceAssessmentItem[];

  blockers: string[];
  warnings: string[];
  regulatoryNotes: string[];

  internalComplianceText: string;
  clientComplianceText: string;
  safetyBoundary: string;

  sourceForecastSummary: PVMetricsSolarForecastSummary;
  sourceBlueprint: PVMetricsCenComplianceBlueprint;
};
