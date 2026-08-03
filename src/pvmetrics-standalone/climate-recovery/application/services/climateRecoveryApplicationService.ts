import type { AssessmentInput } from '../../contracts/assessment';
import type {
  ApplicationResult,
  ClimateRecoveryApplicationService,
  ClimateRecoveryApplicationServiceDependencies,
  DemoCaseRegistryEntry,
} from '../contracts/applicationContracts';
import type { ClimateRecoveryCaseOptions, ClimateRecoveryCatalogQuery } from '../contracts/queryContracts';
import { presentCaseDetail } from '../presenters/caseDetailPresenter';
import type { PresenterContext } from '../presenters/presenterContext';
import { presentExecutiveSummary } from '../presenters/executiveSummaryPresenter';
import { presentExplainability } from '../presenters/explainabilityPresenter';
import { presentKpis } from '../presenters/kpiPresenter';
import { presentTimeline } from '../presenters/timelinePresenter';
import {
  filterCatalog,
  presentCatalogItem,
  sortCatalog,
  type EvaluatedDemoCase,
} from './caseCatalogService';
import { createPortfolioSummary } from './portfolioSummaryService';
import { CLIMATE_RECOVERY_ENGINE_VERSION } from '../../engine/version';

const error = <T>(code: 'case-not-found' | 'invalid-query' | 'invalid-registry', message: string): ApplicationResult<T> => ({
  ok: false,
  error: { code, message, limitations: ['No presentation result was fabricated.'] },
});

const inputFor = (entry: DemoCaseRegistryEntry, options: ClimateRecoveryCaseOptions): AssessmentInput => ({
  caseData: entry.caseData,
  evaluationTimestamp: options.evaluationTimestamp,
  emissionFactors: entry.caseData.emissionFactors,
  configuration: options.configurationOverrides,
  requestedOperations: {
    assessEnergyLoss: true,
    generateRecoveryScenarios: true,
    estimateClimateImpact: true,
    recoveryHorizons: ['seven-days'],
  },
});

export const createClimateRecoveryApplicationService = (
  dependencies: ClimateRecoveryApplicationServiceDependencies,
): ClimateRecoveryApplicationService => {
  const evaluateEntry = (
    entry: DemoCaseRegistryEntry,
    options: ClimateRecoveryCaseOptions,
  ): EvaluatedDemoCase => {
    const assessment = dependencies.assessmentEngine(inputFor(entry, options));
    const context: PresenterContext = {
      caseData: entry.caseData,
      assessment,
      demoMetadata: entry.metadata,
      configuration: dependencies.applicationConfiguration,
      locale: options.locale,
      textResolver: dependencies.textResolver,
    };
    return { entry, assessment, context };
  };

  const getEvaluated = (
    caseId: string,
    options: ClimateRecoveryCaseOptions,
  ): ApplicationResult<EvaluatedDemoCase> => {
    const registryValidation = dependencies.caseRegistry.validate();
    if (!registryValidation.valid) return error('invalid-registry', 'The demo case registry is invalid.');
    const entry = dependencies.caseRegistry.getById(caseId);
    if (!entry) return error('case-not-found', `Climate Recovery case not found: ${caseId}`);
    return { ok: true, data: evaluateEntry(entry, options) };
  };

  const evaluateAll = (query: ClimateRecoveryCatalogQuery): EvaluatedDemoCase[] =>
    dependencies.caseRegistry.list().map((entry) => evaluateEntry(entry, query));

  return {
    listCases: (query) => {
      const all = evaluateAll(query);
      const filtered = filterCatalog(all, query);
      const sorted = sortCatalog(
        filtered,
        query.sort ?? dependencies.applicationConfiguration.catalogDefaultSort,
      );
      const requestedPageSize = query.pagination?.pageSize ?? dependencies.applicationConfiguration.catalogPageSize;
      const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
        ? requestedPageSize
        : dependencies.applicationConfiguration.catalogPageSize;
      const requestedPage = query.pagination?.page ?? 1;
      const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
      const start = (page - 1) * pageSize;
      return {
        items: sorted.slice(start, start + pageSize).map(presentCatalogItem),
        totalCount: all.length,
        filteredCount: filtered.length,
        page,
        pageSize,
        warnings: [],
      };
    },
    getCase: (caseId, options) => {
      const result = getEvaluated(caseId, options);
      if ('error' in result) return { ok: false, error: result.error };
      return { ok: true, data: presentCaseDetail(result.data.context) };
    },
    getCaseSummary: (caseId, options) => {
      const result = getEvaluated(caseId, options);
      if ('error' in result) return { ok: false, error: result.error };
      return { ok: true, data: presentExecutiveSummary(result.data.context) };
    },
    getCaseKpis: (caseId, options) => {
      const result = getEvaluated(caseId, options);
      if ('error' in result) return { ok: false, error: result.error };
      return { ok: true, data: presentKpis(result.data.context) };
    },
    getCaseTimeline: (caseId, options) => {
      const result = getEvaluated(caseId, options);
      if ('error' in result) return { ok: false, error: result.error };
      return { ok: true, data: presentTimeline(result.data.context) };
    },
    getCaseExplainability: (caseId, options) => {
      const result = getEvaluated(caseId, options);
      if ('error' in result) return { ok: false, error: result.error };
      return { ok: true, data: presentExplainability(result.data.context) };
    },
    getPortfolioSummary: (query) => {
      const all = filterCatalog(evaluateAll(query), query);
      const disclosure = dependencies.textResolver(query.locale, 'disclosure.synthetic').text;
      return createPortfolioSummary(all, query, dependencies.applicationConfiguration, disclosure);
    },
    evaluateCase: (caseId, options) => {
      const result = getEvaluated(caseId, options);
      if ('error' in result) return { ok: false, error: result.error };
      return { ok: true, data: result.data.assessment };
    },
    getAvailableFilters: () => ({
      category: ['availability', 'underperformance', 'soiling', 'thermal-derating', 'inverter', 'mppt-or-string', 'communications', 'sensor-quality', 'grid-curtailment', 'clipping', 'bess-operation', 'operational-configuration', 'maintenance-delay', 'unknown'],
      recoverability: ['recoverable', 'partially-recoverable', 'non-recoverable', 'indeterminate', 'not-assessed'],
      priorityBand: ['informational', 'low', 'medium', 'high', 'critical'],
      confidenceLevel: ['very-low', 'low', 'medium', 'high', 'very-high'],
      dataSufficiency: ['sufficient', 'partially-sufficient', 'insufficient', 'invalid'],
      climateImpactAvailability: ['available', 'unavailable', 'blocked'],
    }),
    getApplicationMetadata: () => ({
      productName: 'ORBI PVMetrics IA',
      editionName: 'Climate Recovery Edition',
      companyName: 'ORBI Ecosystem SpA',
      applicationVersion: 'cr-03.0.0-application-service',
      domainVersion: 'cr-01.0.0-domain-foundation',
      engineVersion: CLIMATE_RECOVERY_ENGINE_VERSION,
      presentationVersion: dependencies.applicationConfiguration.presentationVersion,
      datasetReality: 'synthetic',
      supportedLocales: ['es', 'en'],
      credentialRequired: false,
      networkRequired: false,
      productionOperational: false,
      disclosures: [dependencies.textResolver('en', 'disclosure.synthetic').text],
      limitations: [
        'Local deterministic presentation of synthetic fixtures only.',
        'No live data, persistence, network, autonomous decision, or verified impact.',
      ],
    }),
  };
};
