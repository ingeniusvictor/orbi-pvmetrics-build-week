import type {
  AssessmentInput,
  ClimateRecoveryAssessmentResult,
} from '../../contracts/assessment';
import type { ClimateRecoveryCase } from '../../contracts/entities';
import type { ValidationResult } from '../../types/validation';
import type {
  CaseCatalogItem,
  CaseDetailPresentation,
  ExecutiveCaseSummary,
  ExplainabilitySection,
  PortfolioSummaryPresentation,
  RecoveryKpi,
  TimelineEvent,
} from './presentationModels';
import type {
  ClimateRecoveryCaseOptions,
  ClimateRecoveryCatalogQuery,
  ClimateRecoveryPortfolioQuery,
} from './queryContracts';

export type ClimateRecoveryApplicationError = {
  code: 'case-not-found' | 'invalid-query' | 'invalid-registry';
  message: string;
  limitations: string[];
};

export type ApplicationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ClimateRecoveryApplicationError };

export type ClimateRecoveryCatalogResult = {
  items: CaseCatalogItem[];
  totalCount: number;
  filteredCount: number;
  page: number;
  pageSize: number;
  warnings: string[];
};

export type DemoCaseMetadata = {
  displayName: string;
  plantDisplayName: string;
  assetDisplayName: string;
  scenarioPurpose: string;
  expectedNarrative: string;
  expectedOutcome: string;
  sortOrder: number;
  featured: boolean;
  datasetReality: 'synthetic';
  disclosure: string;
};

export type DemoCaseRegistryEntry = {
  caseData: ClimateRecoveryCase;
  metadata: DemoCaseMetadata;
};

export type DemoCaseRegistry = {
  list(): DemoCaseRegistryEntry[];
  getById(caseId: string): DemoCaseRegistryEntry | undefined;
  validate(): ValidationResult<DemoCaseRegistryEntry[]>;
};

export type ClimateRecoveryApplicationConfiguration = {
  defaultLocale: 'es' | 'en';
  supportedLocales: readonly ['es', 'en'];
  energyDisplayUnit: 'Wh' | 'kWh' | 'MWh' | 'GWh';
  emissionsDisplayUnit: 'kgCO2e' | 'tCO2e';
  decimalPrecision: number;
  compactNumberThreshold: number;
  catalogDefaultSort: ClimateRecoveryCatalogQuery['sort'];
  catalogPageSize: number;
  timelineMaxTraceHighlights: number;
  executiveSummaryMaxWarnings: number;
  allowSyntheticPortfolioAggregation: boolean;
  possibleOverlapAggregationPolicy:
    | 'exclude-overlap'
    | 'include-with-warning'
    | 'block-aggregation';
  showUnavailableKpis: boolean;
  showBlockedClimateImpact: boolean;
  requireSyntheticDisclosure: boolean;
  presentationVersion: string;
};

export type ClimateRecoveryTextResolution = {
  text: string;
  requestedLocale: string;
  resolvedLocale: 'es' | 'en';
  usedFallback: boolean;
  limitation?: string;
};

export type ClimateRecoveryTextResolver = (
  locale: string,
  key: string,
  params?: Record<string, string | number>,
) => ClimateRecoveryTextResolution;

export type ClimateRecoveryApplicationMetadata = {
  productName: 'ORBI PVMetrics IA';
  editionName: 'Climate Recovery Edition';
  companyName: 'ORBI Ecosystem SpA';
  applicationVersion: string;
  domainVersion: string;
  engineVersion: string;
  presentationVersion: string;
  datasetReality: 'synthetic';
  supportedLocales: readonly ['es', 'en'];
  credentialRequired: false;
  networkRequired: false;
  productionOperational: false;
  disclosures: string[];
  limitations: string[];
};

export type ClimateRecoveryApplicationServiceDependencies = {
  caseRegistry: DemoCaseRegistry;
  assessmentEngine: (input: AssessmentInput) => ClimateRecoveryAssessmentResult;
  applicationConfiguration: ClimateRecoveryApplicationConfiguration;
  textResolver: ClimateRecoveryTextResolver;
};

export type ClimateRecoveryApplicationService = {
  listCases(query: ClimateRecoveryCatalogQuery): ClimateRecoveryCatalogResult;
  getCase(caseId: string, options: ClimateRecoveryCaseOptions): ApplicationResult<CaseDetailPresentation>;
  getCaseSummary(caseId: string, options: ClimateRecoveryCaseOptions): ApplicationResult<ExecutiveCaseSummary>;
  getCaseKpis(caseId: string, options: ClimateRecoveryCaseOptions): ApplicationResult<RecoveryKpi[]>;
  getCaseTimeline(caseId: string, options: ClimateRecoveryCaseOptions): ApplicationResult<TimelineEvent[]>;
  getCaseExplainability(caseId: string, options: ClimateRecoveryCaseOptions): ApplicationResult<ExplainabilitySection>;
  getPortfolioSummary(query: ClimateRecoveryPortfolioQuery): PortfolioSummaryPresentation;
  evaluateCase(caseId: string, options: ClimateRecoveryCaseOptions): ApplicationResult<ClimateRecoveryAssessmentResult>;
  getAvailableFilters(): Record<string, readonly string[]>;
  getApplicationMetadata(): ClimateRecoveryApplicationMetadata;
};
