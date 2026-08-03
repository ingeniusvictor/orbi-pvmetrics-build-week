import type {
  ClimateRecoveryCase,
  DataProvenance,
  EvidenceItem,
  RecoverableLoss,
} from '../../contracts/entities';
import { createSyntheticClimateRecoveryCases } from '../../fixtures/syntheticCases';
import type {
  ConfidenceLevel,
  DataQualityStatus,
  EvidenceDirection,
  OperationalSeverity,
  RecoverabilityStatus,
  RecoverableLossCategory,
} from '../../types/taxonomy';
import type { PortfolioCaseDefinition } from '../contracts/portfolioContracts';
import {
  SYNTHETIC_PORTFOLIO_CREATED_AT,
  SYNTHETIC_PORTFOLIO_DISCLOSURE,
  createSyntheticPortfolioEmissionFactors,
} from './syntheticEmissionFactors';

type CaseSpec = {
  id: string;
  plantId: string;
  plantName: string;
  assetId: string;
  assetName: string;
  assetType: ClimateRecoveryCase['asset']['type'];
  title: string;
  summary: string;
  category: RecoverableLossCategory;
  recoverabilityStatus: RecoverabilityStatus;
  operationalSeverity: OperationalSeverity;
  detectedAt: string;
  durationHours: number;
  estimatedPowerLossKw?: number;
  estimatedEnergyLossKwh?: number;
  estimatedDailyEnergyLossKwh?: number;
  qualityStatus?: DataQualityStatus;
  evidenceDirection?: EvidenceDirection;
  evidenceWeight?: number;
  evidenceMetric?: string;
  evidenceDescription: string;
  observedValue?: number | string | null;
  expectedValue?: number | string | null;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  assumptions: string[];
  limitations: string[];
  humanReviewStatus?: ClimateRecoveryCase['humanReviewStatus'];
};

const timeBefore = (iso: string, hours: number): string =>
  new Date(Date.parse(iso) - hours * 3_600_000).toISOString();

const buildCase = (spec: CaseSpec): ClimateRecoveryCase => {
  const qualityStatus = spec.qualityStatus ?? 'valid';
  const evidenceDirection = spec.evidenceDirection ?? 'supports';
  const traceId = `${spec.id}-TRACE-01`;
  const evidenceId = `${spec.id}-EVIDENCE-01`;
  const lossId = `${spec.id}-LOSS-01`;
  const provenance: DataProvenance = {
    sourceId: `${spec.id}-SOURCE-01`,
    sourceType: 'synthetic-portfolio-fixture',
    origin: 'simulated',
    datasetReality: 'synthetic',
    qualityStatus,
    observedAt: spec.detectedAt,
    methodology: 'Fixed fictional observation generated for deterministic CR-04 assessment.',
    assumptions: [...spec.assumptions],
    limitations: ['No live instrument, SCADA, customer, coordinate, or real asset is represented.'],
    syntheticDisclosure: SYNTHETIC_PORTFOLIO_DISCLOSURE,
    traceId,
  };
  const evidence: EvidenceItem = {
    id: evidenceId,
    title: `${spec.title} evidence`,
    description: spec.evidenceDescription,
    direction: evidenceDirection,
    metricKey: spec.evidenceMetric,
    observedValue: spec.observedValue,
    expectedValue: spec.expectedValue,
    provenance,
    weight: spec.evidenceWeight ?? 0.76,
    qualityStatus,
    notes: evidenceDirection === 'unavailable'
      ? ['The fictional source is deliberately unavailable to demonstrate fail-closed behavior.']
      : ['Supports deterministic review but does not establish a diagnosis.'],
    createdAt: spec.detectedAt,
  };
  const central = spec.estimatedEnergyLossKwh
    ?? (spec.estimatedPowerLossKw === undefined ? 0 : spec.estimatedPowerLossKw * spec.durationHours);
  const loss: RecoverableLoss = {
    id: lossId,
    assetId: spec.assetId,
    plantId: spec.plantId,
    detectedAt: spec.detectedAt,
    analysisWindow: {
      start: timeBefore(spec.detectedAt, spec.durationHours),
      end: spec.detectedAt,
    },
    category: spec.category,
    title: spec.title,
    description: spec.summary,
    recoverabilityStatus: spec.recoverabilityStatus,
    operationalSeverity: spec.operationalSeverity,
    ...(spec.estimatedPowerLossKw !== undefined
      ? { estimatedPowerLossKw: spec.estimatedPowerLossKw }
      : {}),
    ...(spec.estimatedEnergyLossKwh !== undefined
      ? { estimatedEnergyLossKwh: spec.estimatedEnergyLossKwh }
      : {}),
    ...(spec.estimatedDailyEnergyLossKwh !== undefined
      ? { estimatedDailyEnergyLossKwh: spec.estimatedDailyEnergyLossKwh }
      : {}),
    uncertaintyRange: {
      lowerBound: Math.max(0, central * 0.78),
      centralEstimate: central,
      upperBound: central * 1.22,
      unit: 'kWh',
      confidenceDescriptor: 'Synthetic fixture range',
      methodology: 'Central synthetic input with a fixed ±22% illustrative range.',
    },
    origin: 'estimated',
    datasetReality: 'synthetic',
    confidenceLevel: spec.confidenceLevel,
    confidenceScore: spec.confidenceScore,
    evidenceIds: [evidenceId],
    hypothesisIds: [],
    exclusions: [],
    assumptions: [...spec.assumptions],
    limitations: [...spec.limitations],
    status: 'assessing',
    humanReviewStatus: spec.humanReviewStatus ?? 'pending',
    createdAt: spec.detectedAt,
    updatedAt: spec.detectedAt,
  };
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    plant: { id: spec.plantId, name: spec.plantName },
    asset: {
      id: spec.assetId,
      plantId: spec.plantId,
      name: spec.assetName,
      type: spec.assetType,
    },
    losses: [loss],
    evidence: [evidence],
    hypotheses: [],
    actions: [],
    scenarios: [],
    emissionFactors: createSyntheticPortfolioEmissionFactors(),
    climateImpactEstimates: [],
    verifications: [],
    status: 'under-review',
    provenance: [provenance],
    traceIds: [traceId],
    humanReviewStatus: spec.humanReviewStatus ?? 'pending',
    createdAt: spec.detectedAt,
    updatedAt: spec.detectedAt,
  };
};

const remapCanonicalCases = (): ClimateRecoveryCase[] => {
  const assignments = [
    ['CR04-PLANT-AURORA', 'Aurora Solar'],
    ['CR04-PLANT-HELIOS', 'Helios Norte'],
    ['CR04-PLANT-VALLE', 'Valle Verde'],
    ['CR04-PLANT-PATAGONIA', 'Patagonia Storage'],
  ] as const;
  return createSyntheticClimateRecoveryCases().map((caseData, index) => {
    const [plantId, plantName] = assignments[index];
    caseData.plant = { id: plantId, name: plantName };
    caseData.asset.plantId = plantId;
    caseData.losses.forEach((loss) => { loss.plantId = plantId; });
    caseData.emissionFactors = createSyntheticPortfolioEmissionFactors();
    caseData.scenarios = [];
    caseData.climateImpactEstimates = [];
    return caseData;
  });
};

const newCaseSpecs: CaseSpec[] = [
  {
    id: 'CR04-CASE-SOILING', plantId: 'CR04-PLANT-AURORA', plantName: 'Aurora Solar',
    assetId: 'CR04-AURORA-ARRAY-07', assetName: 'Aurora Synthetic Array 07', assetType: 'plant',
    title: 'Synthetic soiling recovery assessment', summary: 'A fictional peer-normalized yield deviation requires cleaning assessment before intervention.',
    category: 'soiling', recoverabilityStatus: 'recoverable', operationalSeverity: 'medium',
    detectedAt: '2026-08-03T10:55:00.000Z', durationHours: 5.25, estimatedPowerLossKw: 346,
    estimatedDailyEnergyLossKwh: 2847, evidenceMetric: 'synthetic.energy.peer_yield', evidenceDescription: 'Synthetic energy comparison shows a persistent yield deviation consistent with possible soiling.',
    observedValue: 0.914, expectedValue: 1, confidenceLevel: 'high', confidenceScore: 0.73,
    assumptions: ['The fictional peer group remains comparable within the analysis period.'],
    limitations: ['A cleaning assessment and human approval are required before any intervention.'],
  },
  {
    id: 'CR04-CASE-MPPT', plantId: 'CR04-PLANT-AURORA', plantName: 'Aurora Solar',
    assetId: 'CR04-AURORA-MPPT-14', assetName: 'Aurora Synthetic MPPT 14', assetType: 'string',
    title: 'Synthetic MPPT imbalance review', summary: 'A fictional MPPT current imbalance supports remote review before field inspection.',
    category: 'mppt-or-string', recoverabilityStatus: 'recoverable', operationalSeverity: 'high',
    detectedAt: '2026-08-03T10:42:00.000Z', durationHours: 3.4, estimatedPowerLossKw: 428,
    estimatedDailyEnergyLossKwh: 3196, evidenceMetric: 'synthetic.power.mppt_peer', evidenceDescription: 'Synthetic power traces show one MPPT below a fictional peer envelope.',
    observedValue: 71.8, expectedValue: 83.6, confidenceLevel: 'high', confidenceScore: 0.77,
    assumptions: ['The synthetic peer envelope is comparable.'], limitations: ['Remote review precedes any approved field activity.'],
  },
  {
    id: 'CR04-CASE-MAINTENANCE-DELAY', plantId: 'CR04-PLANT-AURORA', plantName: 'Aurora Solar',
    assetId: 'CR04-AURORA-WORKFLOW-03', assetName: 'Aurora Synthetic Maintenance Workflow 03', assetType: 'plant',
    title: 'Synthetic maintenance-delay opportunity', summary: 'A fictional unresolved advisory condition illustrates recoverable loss associated with delayed human-reviewed maintenance.',
    category: 'maintenance-delay', recoverabilityStatus: 'recoverable', operationalSeverity: 'high',
    detectedAt: '2026-08-03T10:21:00.000Z', durationHours: 6.15, estimatedPowerLossKw: 512,
    estimatedDailyEnergyLossKwh: 4213, evidenceMetric: 'synthetic.energy.pending_action', evidenceDescription: 'Synthetic power comparison remains below expectation while a fictional advisory review is pending.',
    observedValue: 6821, expectedValue: 9970, confidenceLevel: 'high', confidenceScore: 0.78,
    assumptions: ['The fictional condition persists until a human-reviewed intervention.'], limitations: ['No work order, dispatch, or real maintenance delay is represented.'],
  },
  {
    id: 'CR04-CASE-COMMUNICATIONS', plantId: 'CR04-PLANT-HELIOS', plantName: 'Helios Norte',
    assetId: 'CR04-HELIOS-COMMS-02', assetName: 'Helios Synthetic Communications Channel 02', assetType: 'communications',
    title: 'Synthetic communications gap', summary: 'A fictional communications interruption blocks energy attribution and requests independent data.',
    category: 'communications', recoverabilityStatus: 'indeterminate', operationalSeverity: 'low',
    detectedAt: '2026-08-03T11:11:00.000Z', durationHours: 1.75,
    qualityStatus: 'unavailable', evidenceDirection: 'unavailable', evidenceWeight: 0,
    evidenceMetric: 'synthetic.communications.availability', evidenceDescription: 'The fictional communications source is unavailable and does not prove energy loss.',
    observedValue: null, expectedValue: 'available', confidenceLevel: 'low', confidenceScore: 0.22,
    assumptions: [], limitations: ['Independent energy evidence is unavailable, so no recovery value may be asserted.'], humanReviewStatus: 'needs-more-data',
  },
  {
    id: 'CR04-CASE-CLIPPING', plantId: 'CR04-PLANT-HELIOS', plantName: 'Helios Norte',
    assetId: 'CR04-HELIOS-INVERTER-04', assetName: 'Helios Synthetic Inverter 04', assetType: 'inverter',
    title: 'Synthetic design-context clipping', summary: 'Fictional clipping aligned with a synthetic rated design envelope is not treated as equipment failure.',
    category: 'clipping', recoverabilityStatus: 'non-recoverable', operationalSeverity: 'informational',
    detectedAt: '2026-08-03T10:33:00.000Z', durationHours: 1.2, estimatedPowerLossKw: 184,
    evidenceMetric: 'synthetic.design.nameplate_dc_ac', evidenceDescription: 'Synthetic rated nameplate and DC/AC design context explain the clipping plateau.',
    observedValue: 1.24, expectedValue: 1.24, confidenceLevel: 'high', confidenceScore: 0.74,
    assumptions: ['The fictional design envelope is internally consistent.'], limitations: ['Classification is illustrative and does not validate a real design.'],
  },
  {
    id: 'CR04-CASE-UNDERPERFORMANCE', plantId: 'CR04-PLANT-VALLE', plantName: 'Valle Verde',
    assetId: 'CR04-VALLE-PLANT', assetName: 'Valle Synthetic Plant Aggregate', assetType: 'plant',
    title: 'Synthetic plant underperformance', summary: 'A fictional peer comparison suggests partially recoverable underperformance requiring evidence review.',
    category: 'underperformance', recoverabilityStatus: 'partially-recoverable', operationalSeverity: 'medium',
    detectedAt: '2026-08-03T10:06:00.000Z', durationHours: 4.6, estimatedPowerLossKw: 217,
    estimatedDailyEnergyLossKwh: 1759, evidenceMetric: 'synthetic.energy.plant_peer', evidenceDescription: 'Synthetic plant energy remains below a fictional comparable baseline.',
    observedValue: 4986, expectedValue: 5984, qualityStatus: 'degraded', confidenceLevel: 'medium', confidenceScore: 0.56,
    assumptions: ['The fictional comparison baseline is representative.'], limitations: ['Degraded synthetic evidence limits confidence and requires human review.'],
  },
  {
    id: 'CR04-CASE-BESS-OPERATION', plantId: 'CR04-PLANT-PATAGONIA', plantName: 'Patagonia Storage',
    assetId: 'CR04-PATAGONIA-BESS', assetName: 'Patagonia Synthetic BESS', assetType: 'bess',
    title: 'Synthetic BESS strategy review', summary: 'A fictional storage profile differs from one scenario without assuming bad operation.',
    category: 'bess-operation', recoverabilityStatus: 'indeterminate', operationalSeverity: 'medium',
    detectedAt: '2026-08-03T10:49:00.000Z', durationHours: 2.8, estimatedPowerLossKw: 306,
    evidenceMetric: 'synthetic.power.bess_strategy', evidenceDescription: 'Synthetic BESS power differs from one fictional strategy while alternative valid strategies remain possible.',
    observedValue: 5.4, expectedValue: 6.7, confidenceLevel: 'medium', confidenceScore: 0.54,
    assumptions: ['Multiple fictional operating strategies may be valid.'], limitations: ['No operational error, optimal dispatch, or control action is inferred.'],
  },
  {
    id: 'CR04-CASE-OPERATIONAL-CONFIG', plantId: 'CR04-PLANT-PATAGONIA', plantName: 'Patagonia Storage',
    assetId: 'CR04-PATAGONIA-HYBRID-CONTEXT', assetName: 'Patagonia Synthetic Hybrid Context', assetType: 'plant',
    title: 'Synthetic operational-configuration review', summary: 'A fictional configuration constraint supports a recoverable scenario subject to human approval.',
    category: 'operational-configuration', recoverabilityStatus: 'recoverable', operationalSeverity: 'high',
    detectedAt: '2026-08-03T10:15:00.000Z', durationHours: 4.25, estimatedPowerLossKw: 688,
    estimatedDailyEnergyLossKwh: 5381, evidenceMetric: 'synthetic.energy.configuration_envelope', evidenceDescription: 'Synthetic energy remains below a documented fictional configuration envelope.',
    observedValue: 8120, expectedValue: 11044, confidenceLevel: 'high', confidenceScore: 0.76,
    assumptions: ['The fictional configuration envelope is applicable for the demonstration period.'], limitations: ['Any change remains advisory and requires authorized human review.'],
  },
  {
    id: 'CR04-CASE-THERMAL-DERATING', plantId: 'CR04-PLANT-COSTA', plantName: 'Costa Sur Solar',
    assetId: 'CR04-COSTA-INVERTER-09', assetName: 'Costa Sur Synthetic Inverter 09', assetType: 'inverter',
    title: 'Synthetic expected thermal derating', summary: 'Fictional ambient and design evidence indicates expected thermal behavior rather than a fault.',
    category: 'thermal-derating', recoverabilityStatus: 'non-recoverable', operationalSeverity: 'informational',
    detectedAt: '2026-08-03T10:37:00.000Z', durationHours: 1.9, estimatedPowerLossKw: 263,
    evidenceMetric: 'synthetic.design.expected_ambient_derating', evidenceDescription: 'Synthetic ambient and design context indicates expected thermal derating within a fictional envelope.',
    observedValue: 0.948, expectedValue: 0.951, confidenceLevel: 'high', confidenceScore: 0.75,
    assumptions: ['The fictional thermal envelope is internally consistent.'], limitations: ['No real ambient measurement or equipment diagnosis is represented.'],
  },
  {
    id: 'CR04-CASE-INVERTER-HIGH', plantId: 'CR04-PLANT-COSTA', plantName: 'Costa Sur Solar',
    assetId: 'CR04-COSTA-INVERTER-17', assetName: 'Costa Sur Synthetic Inverter 17', assetType: 'inverter',
    title: 'Synthetic high-priority inverter review', summary: 'A persistent fictional inverter deviation creates a high synthetic review priority without dispatch authority.',
    category: 'inverter', recoverabilityStatus: 'recoverable', operationalSeverity: 'high',
    detectedAt: '2026-08-03T09:58:00.000Z', durationHours: 6.35, estimatedPowerLossKw: 914,
    estimatedDailyEnergyLossKwh: 7843, evidenceWeight: 0.94, evidenceMetric: 'synthetic.power.inverter_peer', evidenceDescription: 'Synthetic power comparison shows a persistent high-magnitude deviation against a fictional peer.',
    observedValue: 12762, expectedValue: 18566, confidenceLevel: 'very-high', confidenceScore: 0.86,
    assumptions: ['The fictional peer comparison remains applicable throughout the demonstration horizon.'], limitations: ['High priority is a review signal, not an automatic maintenance order.'],
  },
];

const definitions: PortfolioCaseDefinition[] = [
  ['DEMO-CR-CASE-A', 'CR04-PLANT-AURORA', 'Aurora inverter opportunity', 'inverter', true, 1, 'Canonical recoverable opportunity', 'partially-recoverable', 'high', 'partially-sufficient', 'available', true],
  ['CR04-CASE-SOILING', 'CR04-PLANT-AURORA', 'Aurora soiling assessment', 'soiling', true, 2, 'Cleaning assessment gate', 'recoverable', 'high', 'sufficient', 'available', true],
  ['CR04-CASE-MPPT', 'CR04-PLANT-AURORA', 'Aurora MPPT review', 'mppt-or-string', false, 3, 'Remote review first', 'recoverable', 'high', 'sufficient', 'available', true],
  ['CR04-CASE-MAINTENANCE-DELAY', 'CR04-PLANT-AURORA', 'Aurora maintenance delay', 'maintenance-delay', false, 4, 'Human-reviewed maintenance opportunity', 'recoverable', 'high', 'sufficient', 'available', true],
  ['DEMO-CR-CASE-B', 'CR04-PLANT-HELIOS', 'Helios grid curtailment', 'grid-curtailment', true, 5, 'Non-recoverable external limitation', 'non-recoverable', 'low', 'sufficient', 'unavailable', false],
  ['CR04-CASE-COMMUNICATIONS', 'CR04-PLANT-HELIOS', 'Helios communications gap', 'communications', false, 6, 'Insufficient observability', 'indeterminate', 'informational', 'insufficient', 'blocked', false],
  ['CR04-CASE-CLIPPING', 'CR04-PLANT-HELIOS', 'Helios design clipping', 'clipping', false, 7, 'Clipping is not automatically failure', 'non-recoverable', 'informational', 'sufficient', 'unavailable', false],
  ['DEMO-CR-CASE-C', 'CR04-PLANT-VALLE', 'Valle sensor data gap', 'sensor-quality', true, 8, 'Canonical fail-closed case', 'indeterminate', 'low', 'insufficient', 'blocked', false],
  ['CR04-CASE-UNDERPERFORMANCE', 'CR04-PLANT-VALLE', 'Valle underperformance', 'underperformance', false, 9, 'Degraded-data opportunity', 'partially-recoverable', 'medium', 'partially-sufficient', 'available', true],
  ['DEMO-CR-CASE-D', 'CR04-PLANT-PATAGONIA', 'Patagonia overlap review', 'underperformance', true, 10, 'Canonical double-counting warning', 'partially-recoverable', 'medium', 'sufficient', 'available', false],
  ['CR04-CASE-BESS-OPERATION', 'CR04-PLANT-PATAGONIA', 'Patagonia BESS strategy', 'bess-operation', false, 11, 'No automatic bad-operation assumption', 'indeterminate', 'medium', 'sufficient', 'unavailable', false],
  ['CR04-CASE-OPERATIONAL-CONFIG', 'CR04-PLANT-PATAGONIA', 'Patagonia configuration review', 'operational-configuration', false, 12, 'Configuration opportunity', 'recoverable', 'critical', 'sufficient', 'available', true],
  ['CR04-CASE-THERMAL-DERATING', 'CR04-PLANT-COSTA', 'Costa Sur thermal context', 'thermal-derating', false, 13, 'Expected behavior classification', 'non-recoverable', 'low', 'sufficient', 'unavailable', false],
  ['CR04-CASE-INVERTER-HIGH', 'CR04-PLANT-COSTA', 'Costa Sur inverter review', 'inverter', true, 14, 'High synthetic opportunity', 'recoverable', 'critical', 'sufficient', 'available', true],
].map((item) => {
  const [caseId, plantId, displayName, category, featured, demoSequence, narrativeRole, expectedRecoverability, expectedPriorityBand, expectedDataSufficiency, expectedClimateImpactAvailability, includeInDefaultAggregation] = item as [string, string, string, RecoverableLossCategory, boolean, number, string, RecoverabilityStatus, PortfolioCaseDefinition['expectedPriorityBand'], PortfolioCaseDefinition['expectedDataSufficiency'], PortfolioCaseDefinition['expectedClimateImpactAvailability'], boolean];
  return {
    caseId, plantId, displayName, category, featured, demoSequence, narrativeRole,
    expectedRecoverability, expectedPriorityBand, expectedDataSufficiency,
    expectedClimateImpactAvailability, includeInDefaultAggregation,
    ...(!includeInDefaultAggregation ? { exclusionReason: 'Unavailable, non-recoverable, insufficient, or overlap-gated under the default policy.' } : {}),
    syntheticDisclosure: SYNTHETIC_PORTFOLIO_DISCLOSURE,
  };
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createSyntheticPortfolioCases = (): ClimateRecoveryCase[] => [
  ...remapCanonicalCases(),
  ...newCaseSpecs.map(buildCase),
];

export const createPortfolioCaseDefinitions = (): PortfolioCaseDefinition[] => clone(definitions);

export const SYNTHETIC_PORTFOLIO_CASE_IDS: readonly string[] = Object.freeze(
  definitions.map((item) => item.caseId),
);

export { SYNTHETIC_PORTFOLIO_CREATED_AT };
