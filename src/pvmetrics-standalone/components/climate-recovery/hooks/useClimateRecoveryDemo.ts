import { useCallback, useMemo, useState } from 'react';
import {
  DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
  assessClimateRecoveryCase,
  createClimateRecoveryApplicationService,
  createSyntheticClimateRecoveryPortfolioService,
  resolveClimateRecoveryText,
  validateClimateRecoveryCase,
} from '../../../climate-recovery';
import type {
  CaseCatalogItem,
  CaseDetailPresentation,
  ClimateRecoveryApplicationService,
  ClimateRecoveryCatalogFilters,
  ClimateRecoveryCatalogSort,
  DemoCaseRegistry,
  DemoCaseRegistryEntry,
  PlantSummaryPresentation,
  PortfolioExecutivePresentation,
  SyntheticPortfolio,
  SyntheticPlant,
} from '../../../climate-recovery';
import type { ClimateRecoveryLocale } from '../copy';
import {
  localizeCaseCatalogItem,
  localizeCaseDetailPresentation,
  localizeExecutivePresentation,
  localizeSyntheticPlant,
} from '../presentationLocalization';

export type ClimateRecoverySection = 'overview' | 'plants' | 'opportunities' | 'review' | 'case';

export type ClimateRecoveryFilters = {
  plantId: string;
  category: string;
  recoverability: string;
  priorityBand: string;
  confidenceLevel: string;
  dataSufficiency: string;
  humanReviewRequired: string;
  climateImpactAvailability: string;
};

export const EMPTY_CLIMATE_RECOVERY_FILTERS: ClimateRecoveryFilters = {
  plantId: '', category: '', recoverability: '', priorityBand: '', confidenceLevel: '',
  dataSufficiency: '', humanReviewRequired: '', climateImpactAvailability: '',
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const buildRegistry = (portfolio: SyntheticPortfolio): DemoCaseRegistry => {
  const entries: DemoCaseRegistryEntry[] = portfolio.caseDefinitions.map((definition) => {
    const caseData = portfolio.cases.find((item) => item.id === definition.caseId);
    const plant = portfolio.plants.find((item) => item.id === definition.plantId);
    if (!caseData || !plant) throw new Error(`Invalid CR-04 registry mapping: ${definition.caseId}`);
    return {
      caseData,
      metadata: {
        displayName: definition.displayName,
        plantDisplayName: plant.name,
        assetDisplayName: caseData.asset.name,
        scenarioPurpose: definition.narrativeRole,
        expectedNarrative: definition.narrativeRole,
        expectedOutcome: definition.expectedRecoverability,
        sortOrder: definition.demoSequence,
        featured: definition.featured,
        datasetReality: 'synthetic',
        disclosure: definition.syntheticDisclosure,
      },
    };
  });
  return {
    list: () => clone(entries),
    getById: (caseId) => {
      const found = entries.find((entry) => entry.caseData.id === caseId);
      return found ? clone(found) : undefined;
    },
    validate: () => {
      const errors = entries.flatMap((entry) => validateClimateRecoveryCase(entry.caseData).errors);
      return { valid: errors.length === 0, value: clone(entries), issues: errors, errors, warnings: [] };
    },
  };
};

const createDemoRuntime = () => {
  const portfolioService = createSyntheticClimateRecoveryPortfolioService();
  const portfolio = portfolioService.getPortfolio();
  const applicationService: ClimateRecoveryApplicationService = createClimateRecoveryApplicationService({
    caseRegistry: buildRegistry(portfolio),
    assessmentEngine: assessClimateRecoveryCase,
    applicationConfiguration: DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
    textResolver: resolveClimateRecoveryText,
  });
  return { portfolioService, portfolio, applicationService };
};

const applicationOptions = (evaluationTimestamp: string, locale: ClimateRecoveryLocale) => ({
  evaluationTimestamp,
  locale,
  configurationOverrides: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
});

const snapshotFromRuntime = (runtime: ReturnType<typeof createDemoRuntime>, locale: ClimateRecoveryLocale) => {
  const executive = localizeExecutivePresentation(runtime.portfolioService.getPortfolioExecutiveSummary({ locale }), locale);
  return {
    executive,
    plants: runtime.portfolioService.listPlants().map((plant) => localizeSyntheticPlant(plant, locale)),
    definitions: clone(runtime.portfolio.caseDefinitions),
    availableFilters: runtime.applicationService.getAvailableFilters(),
    metadata: runtime.portfolioService.getPortfolioMetadata(),
    validation: runtime.portfolioService.validatePortfolio(),
  };
};

export const createClimateRecoveryDemoSnapshot = (locale: ClimateRecoveryLocale) => snapshotFromRuntime(createDemoRuntime(), locale);

const toApplicationFilters = (filters: ClimateRecoveryFilters): ClimateRecoveryCatalogFilters => ({
  category: filters.category ? filters.category as ClimateRecoveryCatalogFilters['category'] : undefined,
  recoverability: filters.recoverability ? filters.recoverability as ClimateRecoveryCatalogFilters['recoverability'] : undefined,
  priorityBand: filters.priorityBand || undefined,
  confidenceLevel: filters.confidenceLevel ? filters.confidenceLevel as ClimateRecoveryCatalogFilters['confidenceLevel'] : undefined,
  dataSufficiency: filters.dataSufficiency || undefined,
  humanReviewRequired: filters.humanReviewRequired ? filters.humanReviewRequired === 'true' : undefined,
  climateImpactAvailability: filters.climateImpactAvailability ? filters.climateImpactAvailability as ClimateRecoveryCatalogFilters['climateImpactAvailability'] : undefined,
  syntheticOnly: true,
});

export const listClimateRecoveryCases = (
  locale: ClimateRecoveryLocale,
  filters: ClimateRecoveryFilters = EMPTY_CLIMATE_RECOVERY_FILTERS,
  sort: ClimateRecoveryCatalogSort = 'priority-desc',
) => {
  const runtime = createDemoRuntime();
  return runtime.applicationService.listCases({
    ...applicationOptions(runtime.portfolio.evaluationTimestamp, locale),
    filters: toApplicationFilters(filters),
    sort,
    pagination: { page: 1, pageSize: 50 },
  }).items.map((item) => localizeCaseCatalogItem(item, locale));
};

export const getClimateRecoveryCaseDetail = (caseId: string, locale: ClimateRecoveryLocale) => {
  const runtime = createDemoRuntime();
  const result = runtime.applicationService.getCase(caseId, applicationOptions(runtime.portfolio.evaluationTimestamp, locale));
  return result.ok ? localizeCaseDetailPresentation(result.data, locale) : undefined;
};

export type ClimateRecoveryDemo = {
  locale: ClimateRecoveryLocale;
  setLocale: (locale: ClimateRecoveryLocale) => void;
  activeSection: ClimateRecoverySection;
  navigate: (section: ClimateRecoverySection) => void;
  resetExploration: () => void;
  selectedPlantId?: string;
  selectPlant: (plantId: string) => void;
  showPlantList: () => void;
  selectedCaseId?: string;
  selectCase: (caseId: string) => void;
  executive: PortfolioExecutivePresentation;
  plants: SyntheticPlant[];
  selectedPlant?: SyntheticPlant;
  selectedPlantSummary?: PlantSummaryPresentation;
  selectedPlantCases: CaseCatalogItem[];
  cases: CaseCatalogItem[];
  selectedCase?: CaseDetailPresentation;
  filters: ClimateRecoveryFilters;
  setFilters: (filters: ClimateRecoveryFilters) => void;
  sort: ClimateRecoveryCatalogSort;
  setSort: (sort: ClimateRecoveryCatalogSort) => void;
  availableFilters: Record<string, readonly string[]>;
  casePlantId: (caseId: string) => string | undefined;
  caseTitle: (caseId: string) => string;
  caseDataSufficiency: (caseId: string) => string;
  serviceValid: boolean;
  serviceIssues: string[];
};

export const useClimateRecoveryDemo = (): ClimateRecoveryDemo => {
  const [locale, setLocale] = useState<ClimateRecoveryLocale>('es');
  const [activeSection, setActiveSection] = useState<ClimateRecoverySection>('overview');
  const [selectedPlantId, setSelectedPlantId] = useState<string>();
  const [selectedCaseId, setSelectedCaseId] = useState<string>();
  const [filters, setFilters] = useState(EMPTY_CLIMATE_RECOVERY_FILTERS);
  const [sort, setSort] = useState<ClimateRecoveryCatalogSort>('priority-desc');
  const runtime = useMemo(() => createDemoRuntime(), []);
  const snapshot = useMemo(() => snapshotFromRuntime(runtime, locale), [locale, runtime]);

  const cases = useMemo(() => {
    const result = runtime.applicationService.listCases({
      ...applicationOptions(runtime.portfolio.evaluationTimestamp, locale),
      filters: toApplicationFilters(filters),
      sort,
      pagination: { page: 1, pageSize: 50 },
    });
    const localized = result.items.map((item) => localizeCaseCatalogItem(item, locale));
    if (!filters.plantId) return localized;
    const ids = new Set(snapshot.definitions.filter((item) => item.plantId === filters.plantId).map((item) => item.caseId));
    return localized.filter((item) => ids.has(item.caseId));
  }, [filters, locale, runtime, snapshot.definitions, sort]);

  const allCases = useMemo(() => runtime.applicationService.listCases({
    ...applicationOptions(runtime.portfolio.evaluationTimestamp, locale),
    filters: { syntheticOnly: true },
    sort: 'priority-desc',
    pagination: { page: 1, pageSize: 50 },
  }).items.map((item) => localizeCaseCatalogItem(item, locale)), [locale, runtime]);

  const selectedCase = useMemo(() => {
    if (!selectedCaseId) return undefined;
    const result = runtime.applicationService.getCase(selectedCaseId, applicationOptions(runtime.portfolio.evaluationTimestamp, locale));
    return result.ok ? localizeCaseDetailPresentation(result.data, locale) : undefined;
  }, [locale, runtime, selectedCaseId]);

  const caseDataSufficiencyById = useMemo(() => new Map(allCases.map((item) => {
    if (activeSection !== 'opportunities') return [item.caseId, 'unavailable'] as const;
    const result = runtime.applicationService.getCase(
      item.caseId,
      applicationOptions(runtime.portfolio.evaluationTimestamp, locale),
    );
    return [item.caseId, result.ok ? result.data.summary.dataSufficiency : 'unavailable'] as const;
  })), [activeSection, allCases, locale, runtime]);

  const navigate = useCallback((section: ClimateRecoverySection) => setActiveSection(section), []);
  const selectPlant = useCallback((plantId: string) => {
    setSelectedPlantId(plantId);
    setActiveSection('plants');
  }, []);
  const showPlantList = useCallback(() => {
    setSelectedPlantId(undefined);
    setActiveSection('plants');
  }, []);
  const selectCase = useCallback((caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveSection('case');
  }, []);
  const resetExploration = useCallback(() => {
    setActiveSection('overview');
    setSelectedPlantId(undefined);
    setSelectedCaseId(undefined);
    setFilters(EMPTY_CLIMATE_RECOVERY_FILTERS);
    setSort('priority-desc');
  }, []);

  return {
    locale, setLocale, activeSection, navigate, resetExploration, selectedPlantId, selectPlant, showPlantList, selectedCaseId, selectCase,
    executive: snapshot.executive,
    plants: snapshot.plants,
    selectedPlant: snapshot.plants.find((item) => item.id === selectedPlantId),
    selectedPlantSummary: snapshot.executive.plantSummaries.find((item) => item.plantId === selectedPlantId),
    selectedPlantCases: allCases.filter((item) => snapshot.definitions.find((definition) => definition.caseId === item.caseId)?.plantId === selectedPlantId),
    cases, selectedCase, filters, setFilters, sort, setSort,
    availableFilters: snapshot.availableFilters,
    casePlantId: (caseId) => snapshot.definitions.find((item) => item.caseId === caseId)?.plantId,
    caseTitle: (caseId) => allCases.find((item) => item.caseId === caseId)?.title ?? caseId,
    caseDataSufficiency: (caseId) => caseDataSufficiencyById.get(caseId) ?? 'unavailable',
    serviceValid: snapshot.validation.valid,
    serviceIssues: snapshot.validation.issues.map((issue) => issue.message),
  };
};
