import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  CLIMATE_OPPORTUNITY_SCORE_CONFIGURATION,
  SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_METADATA,
  SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION,
  assessClimateRecoveryCase,
  calculateClimateOpportunityScore,
  createSyntheticClimateRecoveryPortfolioService,
  getSyntheticPortfolioConfiguration,
} from './index';
import type { SyntheticPortfolio } from './portfolio/contracts/portfolioContracts';
import { EXPECTED_SYNTHETIC_PORTFOLIO_RESULTS as EXPECTED } from './portfolio/fixtures/expectedPortfolioResults';

const service = () => createSyntheticClimateRecoveryPortfolioService();
const portfolio = () => service().getPortfolio();
const assess = (caseId: string, source = portfolio()) => {
  const caseData = source.cases.find((item) => item.id === caseId);
  assert.ok(caseData, `Missing case ${caseId}`);
  return assessClimateRecoveryCase({
    caseData,
    evaluationTimestamp: source.evaluationTimestamp,
    emissionFactors: caseData.emissionFactors,
    configuration: { maximumAllowedDataAgeMinutes: 60 * 24 * 45 },
    requestedOperations: {
      assessEnergyLoss: true,
      generateRecoveryScenarios: true,
      estimateClimateImpact: true,
      recoveryHorizons: ['seven-days'],
    },
  });
};

const portfolioSources = () => {
  const root = join(process.cwd(), 'src', 'pvmetrics-standalone', 'climate-recovery', 'portfolio');
  const files: string[] = [];
  const visit = (path: string) => readdirSync(path).forEach((name) => {
    const child = join(path, name);
    if (statSync(child).isDirectory()) visit(child);
    else if (name.endsWith('.ts')) files.push(child);
  });
  visit(root);
  return files.map((file) => readFileSync(file, 'utf8')).join('\n');
};

test('01 portfolio contains exactly five plants', () => assert.equal(portfolio().plants.length, 5));
test('02 portfolio contains exactly fourteen cases', () => assert.equal(portfolio().cases.length, 14));
test('03 plant IDs are unique', () => {
  const ids = portfolio().plants.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
});
test('04 case IDs are unique', () => {
  const ids = portfolio().cases.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
});
test('05 every case references an existing plant', () => {
  const ids = new Set(portfolio().plants.map((item) => item.id));
  assert.ok(portfolio().cases.every((item) => ids.has(item.plant.id)));
});
test('06 every plant case ID exists', () => {
  const ids = new Set(portfolio().cases.map((item) => item.id));
  assert.ok(portfolio().plants.flatMap((item) => item.caseIds).every((id) => ids.has(id)));
});
test('07 portfolio and all loss records are synthetic', () => {
  const value = portfolio();
  assert.equal(value.datasetReality, 'synthetic');
  assert.ok(value.cases.flatMap((item) => item.losses).every((item) => item.datasetReality === 'synthetic'));
});
test('08 mandatory disclosures are present', () => {
  const value = portfolio();
  assert.ok(value.disclosure.length > 0 && value.plants.every((item) => item.disclosure.length > 0));
  assert.ok(value.cases.flatMap((item) => item.provenance).every((item) => item.syntheticDisclosure));
});
test('09 all nominal capacities are positive', () => assert.ok(portfolio().plants.every((item) => item.nominalCapacityMw > 0)));
test('10 BESS capacity and technology profile are coherent', () => {
  const plants = portfolio().plants;
  assert.ok(plants.filter((item) => item.technologyProfile.hasBess).every((item) => (item.technologyProfile.bessPowerMw ?? 0) > 0 && (item.technologyProfile.bessEnergyMwh ?? 0) > 0));
  assert.ok(plants.filter((item) => !item.technologyProfile.hasBess).every((item) => item.bessCapacityMwh === undefined));
});
test('11 canonical evaluation and creation timestamps are fixed UTC values', () => {
  const value = portfolio();
  assert.equal(value.evaluationTimestamp, '2026-08-03T12:00:00.000Z');
  assert.equal(value.createdAt, '2026-08-03T09:00:00.000Z');
});
test('12 portfolio sources do not use Date.now', () => assert.doesNotMatch(portfolioSources(), /Date\.now/));
test('13 portfolio sources do not use Math.random', () => assert.doesNotMatch(portfolioSources(), /Math\.random/));
test('14 portfolio has no coordinate fields', () => assert.doesNotMatch(portfolioSources(), /\b(latitude|longitude|lat|lng)\s*:/i));
test('15 plant names are the five approved fictional identities', () => {
  assert.deepEqual(portfolio().plants.map((item) => item.name), ['Aurora Solar', 'Helios Norte', 'Valle Verde', 'Patagonia Storage', 'Costa Sur Solar']);
});
test('16 both emission factors are valid synthetic factors', () => {
  const factors = portfolio().emissionFactors;
  assert.equal(factors.length, 2);
  assert.ok(factors.every((item) => item.datasetReality === 'synthetic' && item.value > 0 && item.methodology.length > 0 && item.limitations.length > 0));
  const baseline = service().getPortfolioExecutiveSummary().summary.estimatedClimateImpact.value;
  const sensitivity = service().getPortfolioExecutiveSummary({ emissionFactorId: factors[1].id }).summary.estimatedClimateImpact.value;
  assert.notEqual(baseline, sensitivity);
});
test('17 exactly one emission factor is default', () => assert.equal(portfolio().emissionFactors.filter((item) => item.isDefault).length, 1));
test('18 an expired factor is blocked rather than used', () => {
  const value = portfolio();
  value.emissionFactors[0].validTo = '2026-08-02T23:59:59.000Z';
  value.cases.forEach((item) => { item.emissionFactors[0].validTo = '2026-08-02T23:59:59.000Z'; });
  assert.equal(assess('CR04-CASE-SOILING', value).climateImpact.status, 'blocked');
});
test('19 service is deterministic for identical input', () => assert.deepEqual(service().getPortfolioExecutiveSummary(), service().getPortfolioExecutiveSummary()));
test('20 service does not mutate portfolio fixtures', () => {
  const app = service(); const before = app.getPortfolio(); app.getPortfolioExecutiveSummary(); assert.deepEqual(app.getPortfolio(), before);
});
test('21 Aurora summary contains four cases', () => assert.equal(service().getPlantSummary('CR04-PLANT-AURORA')?.caseCount, 4));
test('22 Helios summary contains three cases', () => assert.equal(service().getPlantSummary('CR04-PLANT-HELIOS')?.caseCount, 3));
test('23 Valle summary contains two cases', () => assert.equal(service().getPlantSummary('CR04-PLANT-VALLE')?.caseCount, 2));
test('24 Patagonia summary contains three cases', () => assert.equal(service().getPlantSummary('CR04-PLANT-PATAGONIA')?.caseCount, 3));
test('25 Costa Sur summary contains two cases', () => assert.equal(service().getPlantSummary('CR04-PLANT-COSTA')?.caseCount, 2));
test('26 curtailment is non-recoverable through asset maintenance', () => assert.equal(assess('DEMO-CR-CASE-B').recoverability.status, 'non-recoverable'));
test('27 design-context clipping is not classified as automatic failure', () => assert.equal(assess('CR04-CASE-CLIPPING').recoverability.status, 'non-recoverable'));
test('28 communications gap is insufficient and indeterminate', () => {
  const result = assess('CR04-CASE-COMMUNICATIONS');
  assert.equal(result.dataSufficiency.status, 'insufficient'); assert.equal(result.recoverability.status, 'indeterminate');
});
test('29 sensor quality limits confidence', () => assert.ok(assess('DEMO-CR-CASE-C').recoverability.confidenceScore <= 0.39));
test('30 BESS strategy case does not assume operational error', () => {
  const result = assess('CR04-CASE-BESS-OPERATION');
  assert.equal(result.recoverability.status, 'indeterminate'); assert.match(result.recoverability.reasons.join(' '), /not assumed/i);
});
test('31 soiling recommends assessment before maintenance', () => {
  const result = assess('CR04-CASE-SOILING');
  assert.ok(result.recommendations.recommendedActions.some((item) => item.actionType === 'cleaning-assessment'));
  assert.ok(result.recommendations.suppressedActions.some((item) => item.actionType === 'maintenance-intervention'));
});
test('32 inverter assessment starts with remote review', () => assert.ok(assess('CR04-CASE-INVERTER-HIGH').recommendations.recommendedActions.some((item) => item.actionType === 'remote-review')));
test('33 maintenance-delay case has a positive recoverable scenario', () => assert.ok((assess('CR04-CASE-MAINTENANCE-DELAY').scenarios[0]?.recoveredEnergy.valueKwh ?? 0) > 0));
test('34 overlap is detected in canonical Case D', () => assert.ok(assess('DEMO-CR-CASE-D').doubleCounting.some((item) => item.status === 'possible-overlap')));
test('35 default aggregation excludes overlap', () => assert.ok(service().getPortfolioExecutiveSummary().excludedCaseIds.includes('DEMO-CR-CASE-D')));
test('36 include-with-warning includes possible overlap provisionally', () => {
  const result = service().getPortfolioExecutiveSummary({ overlapPolicy: 'include-with-warning' });
  assert.ok(result.summary.includedCaseIds.includes('DEMO-CR-CASE-D')); assert.equal(result.summary.aggregationStatus, 'warning');
});
test('37 block-aggregation returns blocked totals', () => {
  const result = service().getPortfolioExecutiveSummary({ overlapPolicy: 'block-aggregation' });
  assert.equal(result.summary.aggregationStatus, 'blocked'); assert.equal(result.kpis.estimatedRecoverableEnergy.value, undefined);
});
test('38 unavailable BESS recovery is excluded from aggregation', () => assert.ok(service().getPortfolioExecutiveSummary().excludedCaseIds.includes('CR04-CASE-BESS-OPERATION')));
test('39 blocked insufficient cases are excluded from aggregation', () => assert.ok(service().getPortfolioExecutiveSummary().excludedCaseIds.includes('DEMO-CR-CASE-C')));
test('40 non-recoverable cases are excluded from aggregation', () => assert.ok(service().getPortfolioExecutiveSummary().excludedCaseIds.includes('DEMO-CR-CASE-B')));
test('41 every Climate Opportunity Score is within zero and one hundred', () => assert.ok(service().getPlantRanking().every((item) => item.score >= 0 && item.score <= 100)));
test('42 score exposes all weighted components and explanation', () => {
  const score = service().getPlantSummary('CR04-PLANT-AURORA')?.climateOpportunityScore;
  assert.equal(Object.keys(score?.components ?? {}).length, 9); assert.ok((score?.explanation.length ?? 0) >= 6);
});
test('43 score explicitly is not a probability or operational value', () => {
  const score = service().getPlantSummary('CR04-PLANT-AURORA')?.climateOpportunityScore;
  assert.equal(score?.isProbability, false); assert.equal(score?.isOperational, false);
});
test('44 insufficient data caps score below high', () => {
  const score = calculateClimateOpportunityScore({ estimatedRecoverableEnergyKwh: 999999, recoverabilityRatios: [1], highestPriorityScore: 100, confidenceScores: [1], dataQualityRatios: [1], climateAvailableCount: 1, reviewReadyCount: 1, caseCount: 1, possibleOverlapCount: 0, insufficientDataCount: 1, confirmedOverlapCount: 0 });
  assert.ok(score.score <= CLIMATE_OPPORTUNITY_SCORE_CONFIGURATION.insufficientDataScoreCap);
});
test('45 possible overlap applies a score penalty', () => assert.ok((service().getPlantSummary('CR04-PLANT-PATAGONIA')?.overlapPenalty ?? 0) > 0));
test('46 ranking is deterministic', () => assert.deepEqual(service().getPlantRanking(), service().getPlantRanking()));
test('47 ranking uses stable expected order', () => assert.deepEqual(service().getPlantRanking().map((item) => item.plantName), EXPECTED.expectedRanking));
test('48 review queue has contiguous deterministic due order', () => assert.deepEqual(service().getReviewQueue().map((item) => item.dueOrder), service().getReviewQueue().map((_, index) => index + 1)));
test('49 review queue does not create dates or operational orders', () => assert.ok(service().getReviewQueue().every((item) => !Object.hasOwn(item, 'dueDate') && !Object.hasOwn(item, 'workOrderId'))));
test('50 data-quality overview counts every case once', () => assert.equal(service().getDataQualityOverview().statuses.reduce((sum, item) => sum + item.count, 0), 14));
test('51 recoverability distribution matches canonical counts', () => {
  const counts = Object.fromEntries(service().getRecoverabilityDistribution().statuses.map((item) => [item.status, item.count]));
  assert.deepEqual(counts, EXPECTED.recoverabilityCounts);
});
test('52 priority distribution counts every case once', () => assert.equal(service().getPriorityDistribution().statuses.reduce((sum, item) => sum + item.count, 0), 14));
test('53 featured cases are CR-03 detail presentations', () => {
  const featured = service().getFeaturedCases(); assert.ok(featured.length > 0); assert.ok(featured.every((item) => item.metadata.presentationVersion.startsWith('cr-03')));
});
test('54 all five plant summaries are returned in executive presentation', () => assert.equal(service().getPortfolioExecutiveSummary().plantSummaries.length, 5));
test('55 executive summary contains exactly fourteen cases', () => assert.equal(service().getPortfolioExecutiveSummary().summary.caseCount, 14));
test('56 metadata declares the fixed safe local boundary', () => {
  const metadata = service().getPortfolioMetadata();
  assert.equal(metadata.datasetReality, 'synthetic'); assert.equal(metadata.credentialRequired, false); assert.equal(metadata.networkRequired, false);
});
test('57 every ranking item is non-operational', () => assert.ok(service().getPlantRanking().every((item) => item.isOperational === false)));
test('58 no raw or presented result is verified', () => {
  assert.ok(portfolio().cases.flatMap((item) => item.verifications).every((item) => item.verificationStatus !== 'verified'));
  assert.ok(service().getFeaturedCases().every((item) => item.climateImpact.isVerified === false));
});
test('59 supported locales are Spanish and English', () => assert.deepEqual(service().getPortfolioMetadata().supportedLocales, ['es', 'en']));
test('60 portfolio sources do not import React', () => assert.doesNotMatch(portfolioSources(), /from\s+['"]react['"]|import\s+React/));
test('61 portfolio sources do not access browser storage or fetch', () => assert.doesNotMatch(portfolioSources(), /\bwindow\.|\bdocument\.|\blocalStorage\b|\bfetch\s*\(/));
test('62 portfolio sources contain no network clients', () => assert.doesNotMatch(portfolioSources(), /https?:\/\/|WebSocket|XMLHttpRequest/));
test('63 portfolio validation passes and confirms canonical counts', () => {
  const result = service().validatePortfolio(); assert.equal(result.valid, true); assert.equal(result.plantCount, EXPECTED.plantCount); assert.equal(result.caseCount, EXPECTED.caseCount);
});
test('64 public configuration and metadata expose CR-04 version and safe flags', () => {
  assert.equal(getSyntheticPortfolioConfiguration().portfolioVersion, SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_VERSION);
  assert.equal(SYNTHETIC_CLIMATE_RECOVERY_PORTFOLIO_METADATA.productionOperational, false);
});
