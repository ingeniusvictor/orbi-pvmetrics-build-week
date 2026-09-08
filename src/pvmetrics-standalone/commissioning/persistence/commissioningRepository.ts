import type {
  Anomaly,
  Calculation,
  CommissioningAsset,
  CommissioningBaseline,
  CommissioningCampaign,
  CommissioningDataset,
  CommissioningEvent,
  CommissioningGate,
  CommissioningProject,
  CommissioningScope,
  CorrectiveAction,
  Criterion,
  CriterionEvaluation,
  CriterionSnapshot,
  Evidence,
  Finding,
  HandoverPackage,
  HumanAcceptanceDecision,
  PunchItem,
  Requirement,
  ScopeAsset,
  SignalDefinition,
  SignalMapping,
  TelemetrySample,
  TestExecution,
  TestInstance,
  TestPhase,
  TestTemplate,
} from '../contracts';
import type { CommissioningStorageDriver } from './storageDriver';

export const COMMISSIONING_SCHEMA_VERSION = 1 as const;
export const COMMISSIONING_SNAPSHOT_KEY = 'workspace';

export type CommissioningSnapshot = {
  projects: CommissioningProject[];
  scopes: CommissioningScope[];
  assets: CommissioningAsset[];
  scopeAssets: ScopeAsset[];
  campaigns: CommissioningCampaign[];
  testTemplates: TestTemplate[];
  testInstances: TestInstance[];
  testExecutions: TestExecution[];
  testPhases: TestPhase[];
  criteria: Criterion[];
  criterionSnapshots: CriterionSnapshot[];
  criterionEvaluations: CriterionEvaluation[];
  signalDefinitions: SignalDefinition[];
  signalMappings: SignalMapping[];
  telemetrySamples: TelemetrySample[];
  datasets: CommissioningDataset[];
  events: CommissioningEvent[];
  evidence: Evidence[];
  calculations: Calculation[];
  anomalies: Anomaly[];
  findings: Finding[];
  correctiveActions: CorrectiveAction[];
  punchItems: PunchItem[];
  humanAcceptanceDecisions: HumanAcceptanceDecision[];
  gates: CommissioningGate[];
  requirements: Requirement[];
  baselines: CommissioningBaseline[];
  handoverPackages: HandoverPackage[];
};

export type CommissioningPersistenceEnvelope = {
  schemaVersion: typeof COMMISSIONING_SCHEMA_VERSION;
  savedAt: string;
  snapshot: CommissioningSnapshot;
};

export type CommissioningLoadResult =
  | { status: 'EMPTY'; snapshot: CommissioningSnapshot }
  | { status: 'LOADED'; snapshot: CommissioningSnapshot; savedAt: string }
  | { status: 'INVALID'; snapshot: CommissioningSnapshot; reason: string };

export const createEmptyCommissioningSnapshot = (): CommissioningSnapshot => ({
  projects: [],
  scopes: [],
  assets: [],
  scopeAssets: [],
  campaigns: [],
  testTemplates: [],
  testInstances: [],
  testExecutions: [],
  testPhases: [],
  criteria: [],
  criterionSnapshots: [],
  criterionEvaluations: [],
  signalDefinitions: [],
  signalMappings: [],
  telemetrySamples: [],
  datasets: [],
  events: [],
  evidence: [],
  calculations: [],
  anomalies: [],
  findings: [],
  correctiveActions: [],
  punchItems: [],
  humanAcceptanceDecisions: [],
  gates: [],
  requirements: [],
  baselines: [],
  handoverPackages: [],
});

const snapshotArrayKeys: Array<keyof CommissioningSnapshot> = [
  'projects', 'scopes', 'assets', 'scopeAssets', 'campaigns', 'testTemplates',
  'testInstances', 'testExecutions', 'testPhases', 'criteria', 'criterionSnapshots',
  'criterionEvaluations', 'signalDefinitions', 'signalMappings', 'telemetrySamples',
  'datasets', 'events', 'evidence', 'calculations', 'anomalies', 'findings',
  'correctiveActions', 'punchItems', 'humanAcceptanceDecisions', 'gates',
  'requirements', 'baselines', 'handoverPackages',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateCommissioningEnvelope = (
  value: unknown,
): value is CommissioningPersistenceEnvelope => {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== COMMISSIONING_SCHEMA_VERSION) return false;
  if (typeof value.savedAt !== 'string') return false;
  if (!isRecord(value.snapshot)) return false;

  return snapshotArrayKeys.every((key) => Array.isArray(value.snapshot[key]));
};

export class CommissioningRepository {
  constructor(
    private readonly driver: CommissioningStorageDriver,
    private readonly key = COMMISSIONING_SNAPSHOT_KEY,
  ) {}

  load(): CommissioningLoadResult {
    const raw = this.driver.read(this.key);
    if (raw === null) {
      return { status: 'EMPTY', snapshot: createEmptyCommissioningSnapshot() };
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!validateCommissioningEnvelope(parsed)) {
        return {
          status: 'INVALID',
          snapshot: createEmptyCommissioningSnapshot(),
          reason: 'Stored commissioning payload does not match schema version 1.',
        };
      }

      return {
        status: 'LOADED',
        snapshot: parsed.snapshot,
        savedAt: parsed.savedAt,
      };
    } catch {
      return {
        status: 'INVALID',
        snapshot: createEmptyCommissioningSnapshot(),
        reason: 'Stored commissioning payload is not valid JSON.',
      };
    }
  }

  save(snapshot: CommissioningSnapshot, savedAt = new Date().toISOString()): void {
    const envelope: CommissioningPersistenceEnvelope = {
      schemaVersion: COMMISSIONING_SCHEMA_VERSION,
      savedAt,
      snapshot,
    };

    this.driver.write(this.key, JSON.stringify(envelope));
  }

  reset(): void {
    this.driver.remove(this.key);
  }
}
