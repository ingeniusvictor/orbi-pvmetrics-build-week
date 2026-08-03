import type { DemoCaseRegistry, DemoCaseRegistryEntry } from '../../application/contracts/applicationContracts';
import type { ValidationIssue } from '../../types/validation';
import { validateClimateRecoveryCase } from '../../validation/case';
import type { SyntheticPortfolio } from '../contracts/portfolioContracts';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createPortfolioCaseRegistry = (portfolio: SyntheticPortfolio): DemoCaseRegistry => {
  const definitionById = new Map(portfolio.caseDefinitions.map((item) => [item.caseId, item]));
  const plantById = new Map(portfolio.plants.map((item) => [item.id, item]));
  const entries: DemoCaseRegistryEntry[] = portfolio.cases.map((caseData) => {
    const definition = definitionById.get(caseData.id);
    const plant = plantById.get(caseData.plant.id);
    if (!definition || !plant) throw new Error(`Invalid CR-04 registry source for ${caseData.id}.`);
    return {
      caseData: clone(caseData),
      metadata: {
        displayName: definition.displayName,
        plantDisplayName: plant.name,
        assetDisplayName: caseData.asset.name,
        scenarioPurpose: definition.narrativeRole,
        expectedNarrative: `Expected recoverability: ${definition.expectedRecoverability}.`,
        expectedOutcome: definition.includeInDefaultAggregation
          ? 'Eligible for synthetic aggregation when CR-03 values are available.'
          : definition.exclusionReason ?? 'Review before aggregation.',
        sortOrder: definition.demoSequence,
        featured: definition.featured,
        datasetReality: 'synthetic',
        disclosure: definition.syntheticDisclosure,
      },
    };
  });
  return {
    list: () => clone(entries).sort((a, b) => a.metadata.sortOrder - b.metadata.sortOrder),
    getById: (caseId) => {
      const found = entries.find((item) => item.caseData.id === caseId);
      return found ? clone(found) : undefined;
    },
    validate: () => {
      const issues: ValidationIssue[] = [];
      const ids = new Set<string>();
      entries.forEach((entry, index) => {
        if (ids.has(entry.caseData.id)) {
          issues.push({
            code: 'duplicate-portfolio-case-id', path: `entries[${index}].caseData.id`,
            message: `Duplicate case ID: ${entry.caseData.id}`, severity: 'error',
            remediation: 'Assign a unique stable case ID.',
          });
        }
        ids.add(entry.caseData.id);
        issues.push(...validateClimateRecoveryCase(entry.caseData).errors);
      });
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
