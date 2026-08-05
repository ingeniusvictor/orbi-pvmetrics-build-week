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
import {
  GUIDED_DEMO_STEPS,
  advanceGuidedDemo,
  createGuidedDemoState,
  exitGuidedDemo,
  previousGuidedDemo,
  resetGuidedDemo,
  skipGuidedDemo,
} from './demo/guidedDemoSteps';
import { formatCaseCount, localizePresentationText } from './presentationLocalization';
import {
  GUIDED_DEMO_MAX_ANCHOR_ATTEMPTS,
  GUIDED_DEMO_MAX_CORRECTIVE_SCROLLS,
  GUIDED_DEMO_SCROLL_OFFSET_DESKTOP,
  GUIDED_DEMO_SCROLL_OFFSET_MOBILE,
  GUIDED_DEMO_SCROLL_OFFSET_TABLET,
  getGuidedDemoScrollOffset,
  isElementWithinViewport,
} from './demo/useGuidedDemoNavigation';

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
const esDetails = listClimateRecoveryCases('es').map((item) => getClimateRecoveryCaseDetail(item.caseId, 'es')).filter((item) => item !== undefined);
const esCaseHtml = esDetails.map((detail) => renderToStaticMarkup(React.createElement(CaseDetailView, {
  detail, locale: 'es', t: getClimateRecoveryCopy('es'), onBack: () => undefined,
}))).join('\n');
const insufficientEsHtml = renderToStaticMarkup(React.createElement(CaseDetailView, {
  detail: getClimateRecoveryCaseDetail('DEMO-CR-CASE-C', 'es'), locale: 'es', t: getClimateRecoveryCopy('es'), onBack: () => undefined,
}));
const indexSource = readFileSync(join(here, '..', '..', '..', '..', 'index.html'), 'utf8');
const cssSource = readFileSync(join(here, '..', '..', '..', 'index.css'), 'utf8');
const overviewSource = readFileSync(join(here, 'overview', 'PortfolioOverview.tsx'), 'utf8');
const viewSource = readFileSync(join(here, 'ClimateRecoveryView.tsx'), 'utf8');
const launcherSource = readFileSync(join(here, 'demo', 'GuidedDemoLauncher.tsx'), 'utf8');
const displaySource = readFileSync(join(here, 'shared', 'Display.tsx'), 'utf8');
const opportunitySource = readFileSync(join(here, 'cases', 'OpportunityList.tsx'), 'utf8');

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
test('71 pending-review KPI equals the canonical queue length', () => assert.equal(en.executive.summary.pendingHumanReviewCount, en.executive.reviewQueue.length));
test('72 Patagonia BESS is included in the canonical review queue', () => assert.ok(en.executive.reviewQueue.some((item) => item.caseId === 'CR04-CASE-BESS-OPERATION')));
test('73 review queue contains no duplicate case IDs', () => assert.equal(new Set(en.executive.reviewQueue.map((item) => item.caseId)).size, en.executive.reviewQueue.length));
test('74 Spanish localizes every required KPI key', () => {
  assert.equal(localizePresentationText('kpi.estimatedEnergyLoss', 'es'), 'Pérdida de energía estimada');
  assert.equal(localizePresentationText('kpi.estimatedRecoverableEnergy', 'es'), 'Energía recuperable estimada');
});
test('75 seven-day scenario key is localized in both locales', () => {
  assert.equal(localizePresentationText('scenario.seven-days', 'es'), 'Escenario de siete días');
  assert.equal(localizePresentationText('scenario.seven-days', 'en'), 'Seven-day scenario');
});
test('76 request-more-data action is localized', () => {
  assert.equal(localizePresentationText('request-more-data', 'es'), 'Solicitar más datos');
  assert.match(insufficientEsHtml, /Solicitar más datos/);
});
test('77 Spanish case detail exposes no unresolved presentation keys', () => assert.doesNotMatch(esCaseHtml, /(?:kpi|scenario|action)\.[A-Za-z]/));
test('78 English case detail exposes no unresolved presentation keys', () => assert.doesNotMatch(caseHtml, /(?:kpi|scenario|action)\.[A-Za-z]/));
test('79 guided demo launcher is visible in free mode', () => assert.match(html, /Iniciar demo guiada/));
test('80 guided demo contains exactly eight steps', () => assert.equal(GUIDED_DEMO_STEPS.length, 8));
test('81 guided demo order is stable and contiguous', () => assert.deepEqual(GUIDED_DEMO_STEPS.map((step) => step.order), [1, 2, 3, 4, 5, 6, 7, 8]));
test('82 guided demo previous and next links are internally coherent', () => GUIDED_DEMO_STEPS.forEach((step, index) => {
  assert.equal(step.previousStepId, GUIDED_DEMO_STEPS[index - 1]?.id);
  assert.equal(step.nextStepId, GUIDED_DEMO_STEPS[index + 1]?.id);
}));
test('83 step 1 targets the portfolio overview', () => assert.equal(GUIDED_DEMO_STEPS[0].targetSection, 'overview'));
test('84 step 4 targets the recoverable inverter case', () => assert.equal(GUIDED_DEMO_STEPS[3].caseId, 'DEMO-CR-CASE-A'));
test('85 step 5 targets the non-recoverable grid case', () => assert.equal(GUIDED_DEMO_STEPS[4].caseId, 'DEMO-CR-CASE-B'));
test('86 step 6 targets the insufficient-data sensor case', () => assert.equal(GUIDED_DEMO_STEPS[5].caseId, 'DEMO-CR-CASE-C'));
test('87 step 7 targets human review and explainability', () => assert.equal(GUIDED_DEMO_STEPS[6].targetSection, 'review'));
test('88 step 8 targets scenario and climate impact', () => assert.equal(GUIDED_DEMO_STEPS[7].anchorId, 'guided-demo-anchor-climate-recovery'));
test('89 every disclosure-required demo step declares locale support', () => assert.ok(GUIDED_DEMO_STEPS.filter((step) => step.syntheticDisclosureRequired).every((step) => step.localeSupport.includes('es') && step.localeSupport.includes('en'))));
test('90 guided demo has no autoplay contract', () => assert.doesNotMatch(source, /autoPlay|setInterval|setTimeout/));
test('91 guided demo uses no implicit clock', () => assert.doesNotMatch(source, /Date\.now/));
test('92 guided demo uses no randomness', () => assert.doesNotMatch(source, /Math\.random/));
test('93 guided demo performs no fetch', () => assert.doesNotMatch(source, /\bfetch\s*\(/));
test('94 guided demo uses no browser persistence', () => assert.doesNotMatch(source, /localStorage|sessionStorage/));
test('95 guided demo contracts include focus warnings viewport and deterministic start fields', () => {
  const step = GUIDED_DEMO_STEPS[0];
  assert.ok(step.anchorId && step.warnings.length && step.expectedViewport);
  assert.equal(createGuidedDemoState('es').startedAt, '2026-08-03T12:00:00.000Z');
});
test('96 initial demo state is free and inactive', () => {
  const state = createGuidedDemoState('es'); assert.equal(state.mode, 'free'); assert.equal(state.active, false);
});
test('97 reset returns deterministically to guided step 1', () => {
  const state = resetGuidedDemo({ ...createGuidedDemoState('es'), currentStepId: 'climate-impact', completedStepIds: ['problem'] });
  assert.equal(state.currentStepId, 'problem'); assert.deepEqual(state.completedStepIds, []); assert.equal(state.mode, 'guided');
});
test('98 next advances and records completion', () => {
  const state = advanceGuidedDemo(resetGuidedDemo(createGuidedDemoState('en')));
  assert.equal(state.currentStepId, 'opportunity'); assert.deepEqual(state.completedStepIds, ['problem']);
});
test('99 previous returns without inventing completion', () => {
  const state = previousGuidedDemo({ ...resetGuidedDemo(createGuidedDemoState('en')), currentStepId: 'opportunity' });
  assert.equal(state.currentStepId, 'problem'); assert.deepEqual(state.completedStepIds, []);
});
test('100 skip follows the explicit next-step contract', () => assert.equal(skipGuidedDemo(resetGuidedDemo(createGuidedDemoState('en'))).currentStepId, 'opportunity'));
test('101 final next exits to free mode', () => {
  const state = advanceGuidedDemo({ ...resetGuidedDemo(createGuidedDemoState('en')), currentStepId: 'climate-impact' });
  assert.equal(state.active, false); assert.equal(state.mode, 'free');
});
test('102 explicit exit preserves deterministic state without mutation', () => {
  const original = resetGuidedDemo(createGuidedDemoState('es')); const exited = exitGuidedDemo(original);
  assert.equal(original.active, true); assert.equal(exited.active, false); assert.equal(exited.mode, 'free');
});
test('103 reset preserves configured locale and reduced-motion preference', () => {
  const state = resetGuidedDemo({ ...createGuidedDemoState('en', true), locale: 'en' });
  assert.equal(state.locale, 'en'); assert.equal(state.reducedMotion, true);
});
test('104 keyboard contract supports Escape exit', () => assert.match(source, /event\.key === 'Escape'/));
test('105 keyboard contract supports previous and next arrow keys', () => {
  assert.match(source, /event\.key === 'ArrowRight'/); assert.match(source, /event\.key === 'ArrowLeft'/);
});
test('106 guided steps declare focus targets and focus management', () => {
  assert.ok(GUIDED_DEMO_STEPS.every((step) => step.anchorId)); assert.match(source, /waitForAnchor[\s\S]*focus\(\{ preventScroll: true \}\)/);
});
test('107 guided shell announces step changes through a live region', () => assert.match(source, /aria-live="polite"/));
test('108 case detail implements eight progressive-disclosure accordions', () => assert.equal((source.match(/<Accordion id=/g) ?? []).length, 8));
test('109 evidence accordion has explicit expanded and controls semantics', () => assert.match(source, /aria-expanded=\{open\}[\s\S]*aria-controls/));
test('110 hypotheses remain available in secondary detail', () => assert.match(source, /id="hypotheses"[\s\S]*detail\.hypotheses/));
test('111 suppressed actions are separated from recommended actions', () => {
  assert.match(source, /status !== 'suppressed'/); assert.match(source, /id="suppressed-actions"/);
});
test('112 critical warnings render before technical accordions', () => assert.ok(source.indexOf('cr-case-warnings') < source.indexOf('id="evidence"')));
test('113 Climate Recovery free overview has exactly one h1', () => assert.equal((html.match(/<h1\b/g) ?? []).length, 1));
test('114 ranking table has an accessible caption', () => assert.match(html, /<caption class="sr-only">Ranking de cinco plantas sintéticas/));
test('115 opportunities table declares its caption contract', () => assert.match(source, /t\.opportunitiesCaption/));
test('116 outer shell selects have programmatic names', () => {
  assert.match(appSource, /htmlFor="workspace-company"/); assert.match(appSource, /aria-label=\{shellEnglish \? 'Solar Plant \/ BESS' : 'Planta Solar \/ BESS'\}/);
});
test('117 primary navigation exposes semantic active state', () => assert.match(appSource, /aria-current=\{isSelected \? 'page'/));
test('118 mobile tabs use a reduced-scrollbar fade contract', () => assert.match(cssSource, /\.cr-mobile-tabs[\s\S]*mask-image[\s\S]*scrollbar/));
test('119 Climate Recovery secondary copy does not use 9–11px utilities', () => assert.doesNotMatch(source, /text-\[(?:9|10|11)px\]/));
test('120 browser title defaults to the general product', () => assert.match(indexSource, /<title>ORBI PVMetrics IA<\/title>/));
test('121 Climate Recovery sets and restores its scoped document title', () => assert.match(source, /document\.title = 'ORBI PVMetrics IA — Climate Recovery Edition'[\s\S]*document\.title = previousTitle/));
test('122 Guided Demo shell is lazy-loaded', () => assert.match(source, /lazy\(\(\) => import\('\.\/demo\/GuidedDemoShell'\)/));
test('123 case detail evaluation is deferred outside the opportunities view', () => assert.match(source, /activeSection !== 'opportunities'/));
test('124 reduced motion is honored by guided focus and CSS', () => {
  assert.match(source, /prefers-reduced-motion: reduce/); assert.match(cssSource, /prefers-reduced-motion: reduce/);
});
test('125 demo source exposes no GPT or operational approval control', () => {
  assert.doesNotMatch(source, /\bGPT(?:-\d)?\b/i); assert.doesNotMatch(source, /<button[^>]*>[^<]*(approve|dispatch)/i);
});
test('126 guided demo declares eight unique bounded anchor IDs', () => {
  const anchors = GUIDED_DEMO_STEPS.map((step) => step.anchorId);
  assert.equal(anchors.length, 8); assert.equal(new Set(anchors).size, 8);
});
test('127 every guided step anchor is represented by the anchor component contract', () => {
  assert.match(source, /data-guided-demo-anchor=\{stepId\}/);
  GUIDED_DEMO_STEPS.forEach((step) => assert.ok(source.includes(step.anchorId)));
});
test('128 guided navigation never uses block center or scrollIntoView', () => {
  assert.doesNotMatch(source, /scrollIntoView|block:\s*['"]center['"]/);
});
test('129 scroll offsets are centralized for desktop tablet and mobile', () => {
  assert.equal(getGuidedDemoScrollOffset(1440, 400), GUIDED_DEMO_SCROLL_OFFSET_DESKTOP);
  assert.equal(getGuidedDemoScrollOffset(768, 300), 300 + GUIDED_DEMO_SCROLL_OFFSET_TABLET);
  assert.equal(getGuidedDemoScrollOffset(390, 250), 250 + GUIDED_DEMO_SCROLL_OFFSET_MOBILE);
});
test('130 reduced motion selects automatic scrolling', () => assert.match(source, /reducedMotion \? 'auto' : 'smooth'/));
test('131 regular motion selects smooth scrolling', () => assert.match(source, /ScrollBehavior = reducedMotion \? 'auto' : 'smooth'/));
test('132 lazy anchor synchronization is bounded to eight attempts', () => {
  assert.equal(GUIDED_DEMO_MAX_ANCHOR_ATTEMPTS, 8); assert.match(source, /attempts <= GUIDED_DEMO_MAX_ANCHOR_ATTEMPTS/);
});
test('133 rapid step navigation cancels the preceding request', () => {
  assert.match(source, /new AbortController\(\)/); assert.match(source, /return \(\) => controller\.abort\(\)/);
});
test('134 missing lazy targets return a typed timeout', () => assert.match(source, /status: 'timeout'/));
test('135 focus occurs only after the mounted anchor is returned', () => {
  assert.ok(source.indexOf('const waited = await waitForAnchor') < source.indexOf('target.focus({ preventScroll: true })'));
});
test('136 guided focus has no body fallback', () => assert.doesNotMatch(source, /document\.body\.focus|activeElement\s*=\s*document\.body/));
test('137 visibility assessment reports the guided shell', () => assert.match(source, /shellVisible: within\(shell\)/));
test('138 visibility assessment reports the target anchor', () => assert.match(source, /targetVisible: isElementWithinViewport/));
test('139 visibility assessment reports controls and narrative', () => {
  assert.match(source, /controlsVisible: within\(controls\)/); assert.match(source, /narrativeVisible: within\(narrative\)/);
});
test('140 corrective scroll is capped at one', () => {
  assert.equal(GUIDED_DEMO_MAX_CORRECTIVE_SCROLLS, 1); assert.match(source, /correctiveScrolls >= GUIDED_DEMO_MAX_CORRECTIVE_SCROLLS/);
});
test('141 Exit restoration prefers the launcher', () => assert.match(source, /getElementById\('guided-demo-launcher'\)[\s\S]*focusTarget\?\.focus/));
test('142 Escape delegates to the same restoration path', () => assert.match(source, /event\.key === 'Escape'[\s\S]*exitGuided\(true\)/));
test('143 final Return to Overview delegates to the restoration path', () => assert.match(source, /!currentStep\.nextStepId\) exitGuided\(true\)/));
test('144 Reset returns to step one and resets secondary open state', () => {
  assert.equal(resetGuidedDemo({ ...createGuidedDemoState('en'), currentStepId: 'climate-impact' }).currentStepId, 'problem');
  assert.match(source, /setOpenSections\(new Set\(guidedOpenSections\)\)/);
});
test('145 step 4 requires Evidence open', () => assert.deepEqual(GUIDED_DEMO_STEPS[3].requiredOpenSections, ['evidence']));
test('146 step 6 requires Methodology open', () => assert.deepEqual(GUIDED_DEMO_STEPS[5].requiredOpenSections, ['methodology']));
test('147 step 7 requires the review queue open', () => assert.deepEqual(GUIDED_DEMO_STEPS[6].requiredOpenSections, ['review-queue']));
test('148 step 8 requires the recovery scenario visible', () => assert.deepEqual(GUIDED_DEMO_STEPS[7].requiredOpenSections, ['recovery-scenario']));
test('149 the previous scroll position is captured and restored in memory', () => {
  assert.match(source, /scrollYBeforeGuidedDemo/); assert.match(source, /top: snapshot\.scrollYBeforeGuidedDemo/);
});
test('150 previous section plant and case selections are captured', () => {
  assert.match(source, /selectedSectionBeforeGuidedDemo/); assert.match(source, /selectedPlantBeforeGuidedDemo/); assert.match(source, /selectedCaseBeforeGuidedDemo/);
});
test('151 navigation state uses no browser persistence', () => assert.doesNotMatch(source, /localStorage|sessionStorage/));
test('152 navigation uses no unbounded timer or interval', () => assert.doesNotMatch(source, /setTimeout|setInterval/));
test('153 guided controls meet the 44px touch target contract', () => assert.match(source, /const button = 'inline-flex min-h-11 min-w-11/));
test('154 mobile narrative is compactable through an accessible control', () => {
  assert.match(source, /aria-expanded=\{expanded\}/); assert.match(source, /aria-controls="guided-demo-narrative-details"/);
});
test('155 Spanish case pluralization is grammatical', () => {
  assert.equal(formatCaseCount(1, 'es'), '1 caso'); assert.equal(formatCaseCount(2, 'es'), '2 casos');
});
test('156 English case pluralization is grammatical', () => {
  assert.equal(formatCaseCount(1, 'en'), '1 case'); assert.equal(formatCaseCount(2, 'en'), '2 cases');
});
test('157 residual Spanish statuses are complete', () => {
  const labels = getClimateRecoveryCopy('es').statusLabels;
  assert.deepEqual([labels['under-review'], labels.critical, labels.sufficient, labels.soon, labels.proposed, labels.generated, labels['very-high'], labels.suppressed, labels['partially-sufficient']], ['En revisión', 'Crítica', 'Suficiente', 'Pronto', 'Propuesta', 'Generada', 'Muy alta', 'Suprimida', 'Parcialmente suficiente']);
});
test('158 residual English statuses are complete', () => {
  const labels = getClimateRecoveryCopy('en').statusLabels;
  assert.deepEqual([labels['under-review'], labels.critical, labels.sufficient, labels.soon, labels.proposed, labels.generated, labels['very-high'], labels.suppressed, labels['partially-sufficient']], ['Under review', 'Critical', 'Sufficient', 'Soon', 'Proposed', 'Generated', 'Very high', 'Suppressed', 'Partially sufficient']);
});
test('159 visible English presentation data contains no case(s) placeholder', () => assert.doesNotMatch(JSON.stringify(en.executive), /case\(s\)/i));
test('160 both locale flows expose no unresolved presentation keys', () => {
  assert.doesNotMatch(esCaseHtml, /(?:kpi|scenario|action)\.[A-Za-z]/); assert.doesNotMatch(caseHtml, /(?:kpi|scenario|action)\.[A-Za-z]/);
});
test('161 the outer shell follows Climate Recovery English locale', () => {
  assert.match(appSource, /shellEnglish[\s\S]*SAFE SIMULATION ENVIRONMENT/); assert.match(appSource, /Company Workspace/);
});
test('162 guided anchors are programmatically focusable and one pixel high', () => assert.match(source, /tabIndex=\{-1\}[\s\S]*className="block h-px w-full/));
test('163 guided shell uses sticky bounded layout', () => {
  assert.match(cssSource, /\.guided-demo-shell[\s\S]*position: sticky[\s\S]*max-height/);
});
test('164 target failure has an accessible status fallback', () => {
  assert.match(source, /navigationMessage && <p role="status"/); assert.match(source, /guidedTargetUnavailable/);
});
test('165 viewport helper includes boundaries and rejects clipping', () => {
  assert.equal(isElementWithinViewport({ top: 10, bottom: 90 }, 10, 90), true);
  assert.equal(isElementWithinViewport({ top: 9, bottom: 90 }, 10, 90), false);
  assert.equal(isElementWithinViewport({ top: 10, bottom: 91 }, 10, 90), false);
});

test('166 CR-07 premium Spanish hero communicates the recovery outcome', () => {
  const copy = getClimateRecoveryCopy('es');
  assert.equal(copy.heroLine1, 'Recupera energía limpia perdida.');
  assert.match(html, /Recupera energía limpia perdida/);
});
test('167 CR-07 premium English hero has the approved executive headline', () => {
  const copy = getClimateRecoveryCopy('en');
  assert.deepEqual([copy.heroLine1, copy.heroLine2, copy.heroLine3], ['Recover lost clean energy.', 'Reduce avoidable emissions.', 'Prioritize opportunities with explainable AI.']);
});
test('168 hero keeps the synthetic executive demonstration badge visible', () => assert.match(html, /Demostración ejecutiva sintética/));
test('169 executive overview still renders exactly six KPI cards', () => assert.equal((html.match(/group relative min-w-0/g) ?? []).length, 6));
test('170 score centerpiece renders the unchanged service score', () => assert.ok(html.includes(en.executive.rankings[0].score.toFixed(2))));
test('171 score centerpiece explicitly rejects probability and certification claims', () => assert.match(html, /No es una probabilidad ni una métrica certificada/));
test('172 reduced motion disables CR-07 reveal motion without a count-up timer', () => {
  assert.match(cssSource, /prefers-reduced-motion: reduce[\s\S]*\.climate-recovery-view \*[\s\S]*animation-duration: 0\.01ms/);
  assert.doesNotMatch(viewSource + displaySource, /setInterval|requestAnimationFrame|countUp/);
});
test('173 featured opportunity is selected from the service-provided featured list', () => assert.match(overviewSource, /executive\.featuredCases\.slice\(0, 4\)/));
test('174 featured opportunity is not hardcoded to Aurora', () => {
  assert.doesNotMatch(overviewSource, /CR04-PLANT-AURORA|DEMO-CR-CASE-A/);
  assert.ok(html.includes(es.executive.featuredCases[0].summary.caseTitle));
});
test('175 executive leaderboard consumes the first three service rankings', () => assert.match(overviewSource, /executive\.rankings\.slice\(0, 3\)/));
test('176 complete ranking remains accessible below the leaderboard', () => {
  assert.match(overviewSource, /executive\.rankings\.map/);
  assert.match(html, /<caption class="sr-only">Ranking de cinco plantas sintéticas/);
});
test('177 overlap penalties remain visible in leaderboard and full ranking', () => assert.match(overviewSource, /overlapPenalty[\s\S]*overlapNotice/));
test('178 recoverability donut uses the service-provided percentage', () => {
  const recoverable = es.executive.recoverabilityDistribution.statuses.find((item) => item.status === 'recoverable');
  assert.match(html, new RegExp(`${recoverable?.percentage ?? 0}%`));
});
test('179 charts include visible textual summaries in addition to graphics', () => {
  assert.match(overviewSource, /recoverabilitySummary/); assert.match(overviewSource, /prioritySummary/); assert.match(overviewSource, /dataQualityRecommendation/);
});
test('180 Presentation Mode launcher is present in the initial view', () => assert.match(html, /Modo Presentación/));
test('181 the experience switch exposes Free Explore', () => assert.match(html, /Exploración libre/));
test('182 the experience switch exposes Guided Demo', () => assert.match(html, /Iniciar demo guiada/));
test('183 the experience switch exposes Presentation Mode as a real button', () => assert.match(launcherSource, /aria-pressed=\{presentation\}[\s\S]*onPresentation/));
test('184 Guided Demo attenuates the global sidebar', () => assert.match(cssSource, /data-cr-mode='guided'[\s\S]*cr-global-sidebar[\s\S]*opacity: 0\.72/));
test('185 Presentation Mode minimizes the global sidebar and technical chrome', () => {
  assert.match(cssSource, /data-cr-mode='presentation'[\s\S]*cr-global-sidebar[\s\S]*width: 4\.5rem/);
  assert.match(cssSource, /cr-technical-chrome[\s\S]*cr-operational-banner[\s\S]*display: none/);
});
test('186 Presentation Mode has a clear exit control', () => assert.match(launcherSource, /exitPresentation/));
test('187 Presentation Mode has a reset control and preserves guided reset', () => {
  assert.match(launcherSource, /resetPresentation/); assert.match(viewSource, /resetPresentationView/); assert.match(source, /onReset=\{resetDemo\}/);
});
test('188 Presentation Mode never invokes the Fullscreen API automatically', () => assert.doesNotMatch(source + appSource, /requestFullscreen|webkitRequestFullscreen/));
test('189 Recording Safe is visible with a bounded non-guarantee', () => {
  assert.match(launcherSource, /recordingSafe/); assert.match(getClimateRecoveryCopy('en').recordingSafeBoundary, /does not guarantee/);
});
test('190 synthetic disclosures remain present in premium and presentation layouts', () => assert.ok((html.match(/sintétic/g) ?? []).length >= 2));
test('191 Estimated language remains visible for energy and emissions', () => {
  assert.match(html, /Energía recuperable estimada/); assert.match(html, /Emisiones evitadas estimadas/);
});
test('192 Human Review remains visible in KPI featured and navigation surfaces', () => assert.match(html, /Revisión humana/));
test('193 CR-07 centralizes surface radius spacing motion and easing tokens', () => {
  for (const token of ['--cr-surface-primary', '--cr-surface-secondary', '--cr-surface-elevated', '--cr-radius-sm', '--cr-spacing-section', '--cr-motion-fast', '--cr-motion-standard', '--cr-motion-panel', '--cr-easing-standard']) assert.match(cssSource, new RegExp(token));
});
test('194 CR-07 reduced-motion contract removes transforms and delays', () => assert.match(cssSource, /prefers-reduced-motion[\s\S]*animation-delay: 0ms[\s\S]*transform: none/));
test('195 premium buttons keep visible keyboard focus', () => assert.match(launcherSource, /focus-visible:ring-2/));
test('196 static metric cards retain article semantics and tier metadata', () => assert.match(displaySource, /<article data-metric-card data-kpi-tier/));
test('197 premium empty state supports an explanatory recovery hint', () => assert.match(displaySource, /description\?: string[\s\S]*border-dashed/));
test('198 no-results state offers a real reset-filters button', () => assert.match(opportunitySource, /cases\.length === 0[\s\S]*setFilters\(EMPTY_CLIMATE_RECOVERY_FILTERS\)/));
test('199 CR-07 Climate Recovery copy has no 9 to 11 pixel utilities', () => assert.doesNotMatch(source, /text-\[(?:9|10|11)px\]/));
test('200 Presentation Mode has a bounded mobile 360-compatible shell rule', () => assert.match(cssSource, /@media \(max-width: 767px\)[\s\S]*data-cr-mode='presentation'[\s\S]*cr-global-sidebar[\s\S]*display: none/));
test('201 CR-07 Climate Recovery controls use 44px minimum targets', () => assert.doesNotMatch(source, /min-h-10(?:\s|['"])/));
test('202 CR-07 uses no local or session storage', () => assert.doesNotMatch(source, /localStorage|sessionStorage/));
test('203 CR-07 uses no network fetch', () => assert.doesNotMatch(source, /\bfetch\s*\(/));
test('204 CR-07 uses no implicit current clock', () => assert.doesNotMatch(source, /Date\.now/));
test('205 CR-07 uses no random visual or data behavior', () => assert.doesNotMatch(source, /Math\.random/));
test('206 CR-07 introduces no GPT runtime or claims', () => assert.doesNotMatch(source, /\bGPT(?:-\d)?\b/i));
test('207 CR-07 UI still imports only public Climate Recovery presentation contracts', () => assert.doesNotMatch(source, /climate-recovery\/(?:engine|fixtures|registry|portfolio\/data)/));
test('208 CR-07 does not add an install step or dependency mutation to tests', () => assert.doesNotMatch(packageJson.scripts.test, /npm (?:i|install)|npm ci/));
test('209 the outer shell receives bounded free guided and presentation modes', () => assert.match(appSource, /'free' \| 'guided' \| 'presentation'[\s\S]*onExperienceModeChange/));
test('210 Presentation Mode state is in memory only', () => assert.match(viewSource, /useState\(false\)[\s\S]*setPresentationMode/));
test('211 premium overview preserves a single h1', () => assert.equal((html.match(/<h1\b/g) ?? []).length, 1));
test('212 three-mode switch uses accessible pressed states', () => assert.equal((launcherSource.match(/aria-pressed=/g) ?? []).length, 3));
test('213 score ring exposes an accessible out-of-100 label and band', () => assert.match(displaySource, /role="img"[\s\S]*out of 100[\s\S]*band/));
