import type { ValidationIssue } from '../../types/validation';
import { createSyntheticClimateRecoveryCases } from '../../fixtures/syntheticCases';
import { validateClimateRecoveryCase } from '../../validation/case';
import type {
  DemoCaseMetadata,
  DemoCaseRegistry,
  DemoCaseRegistryEntry,
} from '../contracts/applicationContracts';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const DEMO_METADATA: Record<string, DemoCaseMetadata> = {
  'DEMO-CR-CASE-A': {
    displayName: 'Aurora Demo — Inverter Opportunity',
    plantDisplayName: 'Aurora Synthetic Solar Park',
    assetDisplayName: 'Aurora Demo Inverter 01',
    scenarioPurpose: 'Show a potentially recoverable inverter/MPPT opportunity.',
    expectedNarrative: 'Estimated recovery with uncertainty and human review.',
    expectedOutcome: 'Remote read-only review precedes any field activity.',
    sortOrder: 1,
    featured: true,
    datasetReality: 'synthetic',
    disclosure: 'Fictional synthetic case for deterministic demonstration only.',
  },
  'DEMO-CR-CASE-B': {
    displayName: 'Brisa Demo — Grid Curtailment',
    plantDisplayName: 'Brisa Synthetic Solar Park',
    assetDisplayName: 'Brisa Demo Grid Interface',
    scenarioPurpose: 'Show a non-recoverable external grid limitation.',
    expectedNarrative: 'No asset-maintenance recovery or climate claim.',
    expectedOutcome: 'Monitor or escalate the classification without maintenance dispatch.',
    sortOrder: 2,
    featured: true,
    datasetReality: 'synthetic',
    disclosure: 'Fictional synthetic case for deterministic demonstration only.',
  },
  'DEMO-CR-CASE-C': {
    displayName: 'Cielo Demo — Insufficient Sensor Data',
    plantDisplayName: 'Cielo Synthetic Solar Park',
    assetDisplayName: 'Cielo Demo Reference Sensor',
    scenarioPurpose: 'Show fail-closed behavior when observability is insufficient.',
    expectedNarrative: 'Insufficient data appears before any opportunity claim.',
    expectedOutcome: 'Request more data; do not estimate energy or climate impact.',
    sortOrder: 3,
    featured: true,
    datasetReality: 'synthetic',
    disclosure: 'Fictional synthetic case for deterministic demonstration only.',
  },
  'DEMO-CR-CASE-D': {
    displayName: 'Delta Demo — Overlap Review',
    plantDisplayName: 'Delta Synthetic Solar Park',
    assetDisplayName: 'Delta Demo Inverter 01',
    scenarioPurpose: 'Show possible double counting across overlapping losses.',
    expectedNarrative: 'Overlap warning precedes aggregate recovery values.',
    expectedOutcome: 'Human review is required before aggregation.',
    sortOrder: 4,
    featured: true,
    datasetReality: 'synthetic',
    disclosure: 'Fictional synthetic case for deterministic demonstration only.',
  },
};

const buildEntries = (): DemoCaseRegistryEntry[] =>
  createSyntheticClimateRecoveryCases().map((caseData) => ({
    caseData,
    metadata: clone(DEMO_METADATA[caseData.id]),
  }));

const registryIssue = (code: string, path: string, message: string): ValidationIssue => ({
  code,
  path,
  message,
  severity: 'error',
  remediation: 'Correct the demo registry before using the application service.',
});

export const createDemoCaseRegistry = (): DemoCaseRegistry => {
  const entries = buildEntries();
  return {
    list: () => clone(entries).sort((a, b) => a.metadata.sortOrder - b.metadata.sortOrder),
    getById: (caseId) => {
      const found = entries.find((entry) => entry.caseData.id === caseId);
      return found ? clone(found) : undefined;
    },
    validate: () => {
      const issues: ValidationIssue[] = [];
      const ids = new Set<string>();
      for (const [index, entry] of entries.entries()) {
        if (ids.has(entry.caseData.id)) {
          issues.push(registryIssue('duplicate-demo-case-id', `entries[${index}].caseData.id`, `Duplicate case ID: ${entry.caseData.id}`));
        }
        ids.add(entry.caseData.id);
        if (!entry.metadata || entry.metadata.datasetReality !== 'synthetic' || !entry.metadata.disclosure) {
          issues.push(registryIssue('invalid-demo-metadata', `entries[${index}].metadata`, 'Synthetic demo metadata and disclosure are required.'));
        }
        const caseResult = validateClimateRecoveryCase(entry.caseData);
        issues.push(...caseResult.errors);
      }
      return {
        valid: issues.length === 0,
        issues,
        errors: issues,
        warnings: [],
        value: clone(entries),
      };
    },
  };
};
