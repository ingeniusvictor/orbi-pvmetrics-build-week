import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ClimateRecoveryView from './ClimateRecoveryView';
import { CaseDetailView } from './cases/CaseDetailView';
import { getClimateRecoveryCopy } from './copy';
import {
  EMPTY_CLIMATE_RECOVERY_FILTERS,
  createClimateRecoveryDemoSnapshot,
  getClimateRecoveryCaseDetail,
  listClimateRecoveryCases,
} from './hooks/useClimateRecoveryDemo';

const here = dirname(fileURLToPath(import.meta.url));
const appSource = readFileSync(join(here, '..', '..', 'app', 'OrbiPVMetricsStandaloneApp.tsx'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(here, '..', '..', '..', '..', 'package.json'), 'utf8')) as { scripts: Record<string, string> };
const en = createClimateRecoveryDemoSnapshot('en');
const es = createClimateRecoveryDemoSnapshot('es');
const cases = listClimateRecoveryCases('en');
const details = cases.map((item) => getClimateRecoveryCaseDetail(item.caseId, 'en')).filter((item) => item !== undefined);
const html = renderToStaticMarkup(React.createElement(ClimateRecoveryView));
const caseHtml = renderToStaticMarkup(React.createElement(CaseDetailView, {
  detail: details[0], locale: 'en', t: getClimateRecoveryCopy('en'), onBack: () => undefined,
}));

const sourceFiles = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? sourceFiles(path) : /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
});
const source = sourceFiles(here).filter((file) => !file.endsWith('.test.tsx')).map((file) => readFileSync(file, 'utf8')).join('\n');

test('1 navigation shows Climate Recovery', () => {
  assert.match(appSource, /climate-recovery/);
  assert.match(appSource, /Recuperación Climática/);
});
test('2 view renders without network', () => {
  assert.match(html, /Sin red/);
  assert.equal(en.metadata.networkRequired, false);
});
test('3 view renders without credentials', () => assert.equal(en.metadata.credentialRequired, false));
test('4 overview presents five plants', () => assert.equal(en.executive.plantSummaries.length, 5));
test('5 overview presents fourteen cases', () => assert.equal(en.executive.summary.caseCount, 14));
test('6 synthetic disclosure is visible', () => assert.match(html, /Todos los activos, casos y resultados de esta vista son sintéticos/));
test('7 overview has exactly six executive KPI cards', () => assert.equal((html.match(/group relative min-w-0/g) ?? []).length, 6));
test('8 recoverable energy is explicitly estimated', () => assert.match(html, /Energía recuperable estimada/));
test('9 emissions are explicitly estimated', () => assert.match(html, /Emisiones evitadas estimadas/));
test('10 score carries the non-probability tooltip', () => assert.match(html, /No es una probabilidad ni una métrica certificada/));
test('11 ranking shows five plants', () => assert.equal(en.executive.rankings.length, 5));
test('12 ranking preserves CR-04 order', () => assert.deepEqual(en.executive.rankings.map((item) => item.plantName), ['Aurora Solar', 'Costa Sur Solar', 'Patagonia Storage', 'Valle Verde', 'Helios Norte']));
test('13 review queue is populated deterministically', () => assert.ok(en.executive.reviewQueue.length > 0));
test('14 recoverability distribution accounts for all cases', () => assert.equal(en.executive.recoverabilityDistribution.statuses.reduce((sum, item) => sum + item.count, 0), 14));
test('15 priority distribution accounts for all cases', () => assert.equal(en.executive.priorityDistribution.statuses.reduce((sum, item) => sum + item.count, 0), 14));
test('16 data-quality overview accounts for all cases', () => assert.equal(en.executive.dataQualityOverview.totalCases, 14));
test('17 the visual selects four presentation-ready featured cases', () => {
  assert.ok(en.executive.featuredCases.length >= 4);
  assert.match(source, /featuredCases\.slice\(0, 4\)/);
});
test('18 plant list uses five synthetic assets', () => assert.ok(en.plants.every((plant) => plant.datasetReality === 'synthetic')));
test('19 plant detail inputs include region, capacity, cases and limitations', () => assert.ok(en.plants.every((plant) => plant.operatingRegion && plant.nominalCapacityMw > 0 && plant.caseIds.length > 0 && plant.limitations.length > 0)));
test('20 opportunity list exposes fourteen CR-03 catalog presentations', () => assert.equal(cases.length, 14));
test('21 local filters can isolate recoverability', () => assert.ok(listClimateRecoveryCases('en', { ...EMPTY_CLIMATE_RECOVERY_FILTERS, recoverability: 'non-recoverable' }).every((item) => item.recoverability === 'non-recoverable')));
test('22 sorting delegates to CR-03 and supports title ascending', () => {
  const titles = listClimateRecoveryCases('en', EMPTY_CLIMATE_RECOVERY_FILTERS, 'case-title-asc').map((item) => item.title);
  assert.deepEqual(titles, [...titles].sort((left, right) => left.localeCompare(right)));
});
test('23 all case details are available', () => assert.equal(details.length, 14));
test('24 scenario presentations remain simulated projections', () => assert.ok(details.flatMap((detail) => detail.scenarios).every((scenario) => scenario.isSimulated && scenario.isProjection)));
test('25 blocked climate values preserve reasons', () => assert.ok(details.some((detail) => detail.climateImpact.availability === 'blocked' && detail.climateImpact.blockingReasons.length > 0)));
test('26 unavailable values do not display numeric zero fallbacks', () => {
  const unavailable = cases.flatMap((item) => [item.estimatedRecoverableEnergy, item.estimatedClimateImpact]).filter((value) => value.availability !== 'available');
  assert.ok(unavailable.length > 0);
  assert.ok(unavailable.every((value) => value.value === undefined && !/^0(?:\.0+)?\b/.test(value.formattedValue)));
});
test('27 every recommended action is non-binding', () => assert.ok(details.flatMap((detail) => detail.actions).every((action) => action.isBinding === false)));
test('28 dashboard offers no dispatch controls', () => assert.doesNotMatch(source, /<button[^>]*>[^<]*(dispatch|despach)/i));
test('29 hypotheses remain non-diagnostic', () => assert.ok(details.flatMap((detail) => detail.hypotheses).every((hypothesis) => hypothesis.isDiagnosis === false)));
test('30 contradicting evidence remains inspectable', () => assert.ok(details.some((detail) => detail.explainability.contradictingEvidence.length > 0)));
test('31 missing evidence remains inspectable', () => assert.ok(details.some((detail) => detail.explainability.missingEvidence.length > 0)));
test('32 timeline is deterministic across repeated reads', () => {
  const id = cases[0].caseId;
  assert.deepEqual(getClimateRecoveryCaseDetail(id, 'en')?.timeline, getClimateRecoveryCaseDetail(id, 'en')?.timeline);
});
test('33 explainability retains rules and confidence language', () => assert.ok(details.every((detail) => detail.explainability.traceHighlights.length > 0 && detail.explainability.confidenceExplanation.length > 0)));
test('34 confidence disclaimer is visible', () => assert.match(source, /not a calibrated probability/));
test('35 human review is visible in every case summary', () => assert.ok(details.every((detail) => detail.summary.humanReviewRequired)));
test('36 grid curtailment does not claim maintenance recovery', () => {
  const detail = getClimateRecoveryCaseDetail('DEMO-CR-CASE-B', 'en')!;
  assert.equal(detail.summary.recoverability, 'non-recoverable');
  assert.match(`${detail.summary.executiveNarrative} ${detail.summary.recommendedNextStep}`, /maintenance|non-recoverable/i);
});
test('37 clipping is not presented as automatic failure', () => {
  const detail = getClimateRecoveryCaseDetail('CR04-CASE-CLIPPING', 'en')!;
  assert.doesNotMatch(detail.summary.executiveNarrative, /confirmed failure/i);
});
test('38 insufficient data leads before opportunity claims', () => {
  const detail = getClimateRecoveryCaseDetail('DEMO-CR-CASE-C', 'en')!;
  assert.equal(detail.summary.dataSufficiency, 'insufficient');
  assert.match(detail.summary.headline, /insufficient/i);
});
test('39 overlap warning remains visible', () => assert.ok(en.executive.warnings.some((warning) => /overlap/i.test(warning))));
test('40 Spanish visual labels are registered', () => assert.equal(getClimateRecoveryCopy('es').title, 'Recuperación Climática'));
test('41 English visual labels are registered', () => assert.equal(getClimateRecoveryCopy('en').title, 'Climate Recovery'));
test('42 locale switch has both options without reload', () => assert.match(html, /ES · Español[\s\S]*EN · English/));
test('43 mobile navigation uses real buttons and horizontal overflow containment', () => assert.match(source, /overflow-x-auto[\s\S]*<button/));
test('44 responsive classes cover one, two, three and six-column layouts', () => assert.match(source, /grid-cols-1[\s\S]*grid-cols-2[\s\S]*grid-cols-3[\s\S]*grid-cols-6/));
test('45 interactive elements use keyboard-focus styling', () => assert.match(source, /focus-visible:ring-2/));
test('46 semantic headings are present', () => assert.match(html, /<h1[\s\S]*<h2[\s\S]*<h3/));
test('47 aria labels identify navigation, filters and chart summaries', () => assert.match(source, /aria-label|ariaLabel/));
test('48 charts disable animation for reduced-motion safety', () => assert.match(source, /isAnimationActive=\{false\}/));
test('49 React components import presentation contracts, not calculation engines', () => {
  const componentSource = sourceFiles(here).filter((file) => !file.includes(`${join('hooks')}`) && !file.endsWith('.test.tsx')).map((file) => readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(componentSource, /assessmentEngine|climateImpactEngine|priorityEngine|score\.components/);
});
test('50 CR-05 does not use Date.now', () => assert.doesNotMatch(source, /Date\.now/));
test('51 CR-05 does not use Math.random', () => assert.doesNotMatch(source, /Math\.random/));
test('52 CR-05 does not use fetch', () => assert.doesNotMatch(source, /\bfetch\s*\(/));
test('53 CR-05 does not use localStorage', () => assert.doesNotMatch(source, /localStorage/));
test('54 CR-05 does not use GPT', () => assert.doesNotMatch(source, /\bGPT(?:-\d)?\b/i));
test('55 CR-05 does not reference API keys', () => assert.doesNotMatch(source, /api[_ -]?key/i));
test('56 metadata declares synthetic non-operational data', () => assert.equal(en.metadata.productionOperational, false));
test('57 historical tests remain in the test command', () => assert.match(packageJson.scripts.test, /incidentCopilot\.test\.ts[\s\S]*portfolio\.test\.ts/));
test('58 dashboard adds no runtime dependency and lockfile is not required by tests', () => assert.ok(!packageJson.scripts.test.includes('install')));
test('59 ES and EN services retain the same portfolio cardinality', () => assert.equal(es.executive.summary.caseCount, en.executive.summary.caseCount));
test('60 SSR overview exposes the canonical plant ranking leader', () => assert.match(html, /Aurora Solar/));
test('61 every case detail renders through the public CR-03 presentation without throwing', () => {
  details.forEach((detail) => assert.doesNotThrow(() => renderToStaticMarkup(React.createElement(CaseDetailView, {
    detail, locale: 'en', t: getClimateRecoveryCopy('en'), onBack: () => undefined,
  }))));
});
test('62 opportunity catalog renders data sufficiency in addition to the required columns', () => {
  assert.match(source, /caseDataSufficiency/);
  assert.match(source, /t\.dataSufficiency/);
});
test('63 plant list and detail expose priority review featured-case and limitation fields', () => {
  assert.match(source, /highPriorityCaseCount/);
  assert.match(source, /pendingReviewCount/);
  assert.match(source, /featuredCaseId/);
  assert.match(source, /selectedSummary\.limitations/);
});
test('64 scenario detail includes accessible table bars horizon rate and uncertainty', () => {
  assert.match(caseHtml, /Accessible scenario comparison/);
  assert.match(caseHtml, /Recovery Rate Assumption/);
  assert.match(caseHtml, /Uncertainty/);
  assert.match(source, /role="img"[\s\S]*scenario\.noIntervention/);
});
test('65 climate detail exposes methodology factor verification assumptions and limitations', () => {
  assert.match(source, /climateImpact\.methodology/);
  assert.match(source, /climateImpact\.factorRegion/);
  assert.match(source, /climateImpact\.assumptions/);
  assert.match(source, /climateImpact\.limitations/);
  assert.match(caseHtml, /Not verified/);
});
test('66 evidence exposes source quality contradiction and missing data', () => {
  assert.match(source, /item\.sourceReference/);
  assert.match(source, /qualityStatus === 'unavailable'/);
  assert.match(source, /explainability\.contradictingEvidence/);
  assert.match(source, /explainability\.missingEvidence/);
});
test('67 explainability displays confidence rationale rule versions assumptions and limitations', () => {
  assert.match(source, /explainability\.confidenceExplanation/);
  assert.match(source, /explainability\.ruleVersions/);
  assert.match(source, /explainability\.assumptions/);
  assert.match(source, /explainability\.limitations/);
});
test('68 UI adapter imports only the public Climate Recovery entry point', () => {
  const hookSource = readFileSync(join(here, 'hooks', 'useClimateRecoveryDemo.ts'), 'utf8');
  assert.match(hookSource, /from '\.\.\/\.\.\/\.\.\/climate-recovery'/);
  assert.doesNotMatch(hookSource, /climate-recovery\/(?:engine|fixtures|registry|contracts|portfolio\/data)/);
});
test('69 interface copy localizes safety language and statuses in ES and EN', () => {
  assert.equal(getClimateRecoveryCopy('es').readOnly, 'Solo lectura');
  assert.equal(getClimateRecoveryCopy('en').readOnly, 'Read-only');
  assert.equal(getClimateRecoveryCopy('es').statusLabels.recoverable, 'Recuperable');
  assert.equal(getClimateRecoveryCopy('en').statusLabels.recoverable, 'Recoverable');
});
test('70 pending human review uses a pending semantic token rather than an available success state', () => {
  assert.match(source, /status="pending-review"/);
  assert.match(source, /value="pending-review"/);
});
