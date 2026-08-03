import { validateEmissionFactor } from '../../validation/impact';
import type { DataQualityStatus } from '../../types/taxonomy';
import type { SyntheticPortfolio, PortfolioValidationIssue, PortfolioValidationResult } from '../contracts/portfolioContracts';

const QUALITY_STATUSES: DataQualityStatus[] = [
  'valid', 'degraded', 'incomplete', 'stale', 'conflicting', 'unavailable', 'unknown',
];

export const validateSyntheticPortfolio = (portfolio: SyntheticPortfolio): PortfolioValidationResult => {
  const issues: PortfolioValidationIssue[] = [];
  const add = (code: string, path: string, message: string, severity: 'warning' | 'error' = 'error') =>
    issues.push({ code, path, message, severity });
  const plantIds = portfolio.plants.map((item) => item.id);
  const caseIds = portfolio.cases.map((item) => item.id);
  if (portfolio.datasetReality !== 'synthetic') add('portfolio-not-synthetic', 'datasetReality', 'Portfolio must be synthetic.');
  if (!portfolio.disclosure.trim()) add('missing-disclosure', 'disclosure', 'Portfolio disclosure is required.');
  if (portfolio.plants.length !== 5) add('unexpected-plant-count', 'plants', 'Canonical CR-04 portfolio requires exactly five plants.');
  if (portfolio.cases.length !== 14) add('unexpected-case-count', 'cases', 'Canonical CR-04 portfolio requires exactly fourteen cases.');
  if (new Set(plantIds).size !== plantIds.length) add('duplicate-plant-id', 'plants', 'Plant IDs must be unique.');
  if (new Set(caseIds).size !== caseIds.length) add('duplicate-case-id', 'cases', 'Case IDs must be unique.');
  const plants = new Set(plantIds);
  const cases = new Set(caseIds);
  portfolio.plants.forEach((plant, index) => {
    if (plant.datasetReality !== 'synthetic' || !plant.disclosure.trim()) add('invalid-plant-reality', `plants[${index}]`, 'Every plant must be disclosed as synthetic.');
    if (plant.status !== 'demo') add('invalid-plant-status', `plants[${index}].status`, 'Every CR-04 plant must use demo status.');
    if (!(plant.nominalCapacityMw > 0)) add('invalid-capacity', `plants[${index}].nominalCapacityMw`, 'Capacity must be positive.');
    if (plant.technologyProfile.hasBess && !(plant.technologyProfile.bessPowerMw && plant.technologyProfile.bessEnergyMwh)) add('invalid-bess-profile', `plants[${index}].technologyProfile`, 'BESS power and energy are required when hasBess is true.');
    plant.caseIds.forEach((caseId) => { if (!cases.has(caseId)) add('missing-plant-case', `plants[${index}].caseIds`, `Unknown case ${caseId}.`); });
  });
  portfolio.cases.forEach((caseData, index) => {
    if (!plants.has(caseData.plant.id)) add('missing-case-plant', `cases[${index}].plant.id`, `Unknown plant ${caseData.plant.id}.`);
    if (caseData.losses.some((loss) => loss.datasetReality !== 'synthetic')) add('case-not-synthetic', `cases[${index}].losses`, 'Every loss must be synthetic.');
    if (caseData.provenance.some((item) => item.datasetReality !== 'synthetic' || !item.syntheticDisclosure)) add('case-disclosure-missing', `cases[${index}].provenance`, 'Every provenance record must disclose synthetic reality.');
  });
  const defaults = portfolio.emissionFactors.filter((item) => item.isDefault);
  if (defaults.length !== 1 || defaults[0]?.id !== portfolio.defaultEmissionFactorId) add('invalid-default-factor', 'emissionFactors', 'Exactly one valid default synthetic factor is required.');
  portfolio.emissionFactors.forEach((factor, index) => {
    if (factor.datasetReality !== 'synthetic') add('factor-not-synthetic', `emissionFactors[${index}]`, 'Every factor must be synthetic.');
    validateEmissionFactor(factor).errors.forEach((item) => add(item.code, `emissionFactors[${index}]`, item.message));
    if (Date.parse(portfolio.evaluationTimestamp) < Date.parse(factor.validFrom) || (factor.validTo && Date.parse(portfolio.evaluationTimestamp) > Date.parse(factor.validTo))) add('factor-outside-validity', `emissionFactors[${index}]`, 'Factor must be valid at evaluationTimestamp.');
  });
  const dataQualityCounts = Object.fromEntries(QUALITY_STATUSES.map((status) => [status, 0])) as Record<DataQualityStatus, number>;
  portfolio.cases.forEach((caseData) => caseData.evidence.forEach((item) => { dataQualityCounts[item.qualityStatus] += 1; }));
  return { valid: issues.every((item) => item.severity !== 'error'), issues, plantCount: portfolio.plants.length, caseCount: portfolio.cases.length, dataQualityCounts };
};
