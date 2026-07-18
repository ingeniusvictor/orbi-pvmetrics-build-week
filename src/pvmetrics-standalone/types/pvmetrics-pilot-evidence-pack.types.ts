export type PVMetricsPilotEvidencePackStatus =
  | 'blueprint-only'
  | 'types-ready'
  | 'mock-data-ready'
  | 'visual-ready'
  | 'wizard-integrated'
  | 'qa-closed'
  | 'blocked';

export type PVMetricsPilotEvidenceCategoryId =
  | 'product-readiness'
  | 'safety-readiness'
  | 'client-demo'
  | 'technical-traceability'
  | 'qa-evidence'
  | 'commercial-readiness';

export type PVMetricsPilotEvidenceAudience =
  | 'internal-engineering'
  | 'client-executive'
  | 'client-technical'
  | 'qa-review'
  | 'commercial-review';

export type PVMetricsPilotEvidenceRiskLevel =
  | 'safe-mock'
  | 'review-required'
  | 'blocked-real-integration';

export type PVMetricsPilotEvidenceItemStatus =
  | 'available'
  | 'pending'
  | 'not-applicable'
  | 'blocked';

export type PVMetricsPilotEvidenceChecklistStatus =
  | 'passed'
  | 'warning'
  | 'blocked'
  | 'pending-human-review';

export type PVMetricsPilotEvidenceCategory = {
  categoryId: PVMetricsPilotEvidenceCategoryId;
  label: string;
  description: string;
  audience: PVMetricsPilotEvidenceAudience[];
  riskLevel: PVMetricsPilotEvidenceRiskLevel;
};

export type PVMetricsPilotEvidenceItem = {
  itemId: string;
  categoryId: PVMetricsPilotEvidenceCategoryId;
  label: string;
  status: PVMetricsPilotEvidenceItemStatus;
  audience: PVMetricsPilotEvidenceAudience[];
  summary: string;
  sourceModule: string;
  isMockOnly: true;
  isClientVisible: boolean;
  safetyNote: string;
};

export type PVMetricsPilotEvidenceChecklistItem = {
  checkId: string;
  label: string;
  status: PVMetricsPilotEvidenceChecklistStatus;
  required: boolean;
  description: string;
};

export type PVMetricsClientDemoNarrativeSection = {
  sectionId: string;
  title: string;
  audience: PVMetricsPilotEvidenceAudience;
  order: number;
  body: string;
  safetyDisclaimer: string;
};

export type PVMetricsPilotBoundary = {
  boundaryId: string;
  label: string;
  enforced: true;
  description: string;
};

export type PVMetricsNoRealIntegrationStatement = {
  statementId: string;
  title: string;
  body: string;
  prohibitedCapabilities: string[];
};

export type PVMetricsPilotEvidencePackSummary = {
  summaryId: string;
  appName: 'ORBI PVMetrics IA';
  roadmapBlock: '1O-I — Pilot Evidence Pack & Client Demo';
  module: string;
  internalVersion: string;
  status: PVMetricsPilotEvidencePackStatus;
  totalCategories: number;
  totalEvidenceItems: number;
  totalChecklistItems: number;
  clientVisibleItems: number;
  blockedItems: number;
  nextRecommendedModule: string;
};

export type PVMetricsPilotEvidencePack = {
  packId: string;
  generatedAtLabel: string;
  status: PVMetricsPilotEvidencePackStatus;
  categories: PVMetricsPilotEvidenceCategory[];
  evidenceItems: PVMetricsPilotEvidenceItem[];
  readinessChecklist: PVMetricsPilotEvidenceChecklistItem[];
  pilotBoundaries: PVMetricsPilotBoundary[];
  noRealIntegrationStatement: PVMetricsNoRealIntegrationStatement;
  summary: PVMetricsPilotEvidencePackSummary;
};

export type PVMetricsClientDemoPack = {
  demoPackId: string;
  generatedAtLabel: string;
  title: string;
  audience: PVMetricsPilotEvidenceAudience;
  narrativeSections: PVMetricsClientDemoNarrativeSection[];
  evidenceItems: PVMetricsPilotEvidenceItem[];
  safetyBoundaries: PVMetricsPilotBoundary[];
  noRealIntegrationStatement: PVMetricsNoRealIntegrationStatement;
  clientCopyText: string;
  internalCopyText: string;
};
