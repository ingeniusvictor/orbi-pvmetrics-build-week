import { PVMetricsDocumentIntakeFileKind } from './pvmetrics-document-intake.types';

export type PVMetricsExtractorReadinessStatus =
  | 'ready-now'
  | 'safe-to-evaluate'
  | 'requires-library-review'
  | 'requires-ocr-future'
  | 'blocked';

export type PVMetricsExtractorRiskLevel =
  | 'low'
  | 'medium'
  | 'high'
  | 'blocked';

export type PVMetricsExtractorDecisionGate = {
  id: string;
  label: string;
  passed: boolean;
  riskLevel: PVMetricsExtractorRiskLevel;
  note: string;
};

export type PVMetricsDocumentExtractorEvaluation = {
  id: string;
  fileKind: PVMetricsDocumentIntakeFileKind;
  title: string;
  readinessStatus: PVMetricsExtractorReadinessStatus;
  riskLevel: PVMetricsExtractorRiskLevel;
  recommendedApproach: string;
  currentPhaseBehavior: string;
  futureImplementationPath: string;
  decisionGates: PVMetricsExtractorDecisionGate[];
  limitations: string[];
  safetyBoundary: string;
};
