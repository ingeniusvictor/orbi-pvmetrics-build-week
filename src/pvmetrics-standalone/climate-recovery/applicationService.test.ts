import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  CLIMATE_RECOVERY_ENGINE_VERSION,
  CLIMATE_RECOVERY_PRESENTATION_VERSION,
  DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
  assessClimateRecoveryCase,
  createClimateRecoveryApplicationService,
  createDemoCaseRegistry,
  resolveClimateRecoveryText,
} from './index';
import { formatIsoDate } from './application/formatters/dateFormatter';
import { formatEmissions } from './application/formatters/emissionsFormatter';
import { formatEnergy } from './application/formatters/energyFormatter';
import { formatNumber } from './application/formatters/numberFormatter';
import { formatPercentage } from './application/formatters/percentageFormatter';

const IDS = ['DEMO-CR-CASE-A', 'DEMO-CR-CASE-B', 'DEMO-CR-CASE-C', 'DEMO-CR-CASE-D'] as const;
const TIMESTAMPS: Record<(typeof IDS)[number], string> = {
  'DEMO-CR-CASE-A': '2026-07-01T12:00:00Z',
  'DEMO-CR-CASE-B': '2026-07-02T14:00:00Z',
  'DEMO-CR-CASE-C': '2026-07-03T09:30:00Z',
  'DEMO-CR-CASE-D': '2026-07-04T16:00:00Z',
};

const registry = () => createDemoCaseRegistry();
const service = () => createClimateRecoveryApplicationService({
  caseRegistry: registry(),
  assessmentEngine: assessClimateRecoveryCase,
  applicationConfiguration: DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
  textResolver: resolveClimateRecoveryText,
});
const options = (id: (typeof IDS)[number], locale: 'es' | 'en' = 'en') => ({
  evaluationTimestamp: TIMESTAMPS[id],
  locale,
});
const catalogQuery = {
  evaluationTimestamp: '2026-07-04T16:00:00Z',
  locale: 'en' as const,
  configurationOverrides: { maximumAllowedDataAgeMinutes: 10_000 },
};
const getCase = (id: (typeof IDS)[number]) => {
  const result = service().getCase(id, options(id));
  assert.equal(result.ok, true);
  if ('error' in result) throw new Error(`Unexpected case presentation error for ${id}`);
  return result.data;
};
const formatOptions = {
  locale: 'en' as const,
  precision: 2,
  datasetReality: 'synthetic' as const,
  disclosure: 'Synthetic test disclosure.',
};

const applicationSources = (): string => {
  const root = join(process.cwd(), 'src', 'pvmetrics-standalone', 'climate-recovery', 'application');
  const files: string[] = [];
  const visit = (path: string) => {
    for (const name of readdirSync(path)) {
      const child = join(path, name);
      if (statSync(child).isDirectory()) visit(child);
      else if (name.endsWith('.ts')) files.push(child);
    }
  };
  visit(root);
  return files.map((file) => readFileSync(file, 'utf8')).join('\n');
};

test('01 service application sources do not import React', () => {
  assert.doesNotMatch(applicationSources(), /from\s+['"]react['"]|import\s+React/);
});

test('02 service application sources do not access browser globals', () => {
  assert.doesNotMatch(applicationSources(), /\bwindow\.|\bdocument\.|\blocalStorage\b/);
});

test('03 identical catalog queries produce identical results', () => {
  const app = service();
  assert.deepEqual(app.listCases(catalogQuery), app.listCases(structuredClone(catalogQuery)));
});

test('04 registry contains exactly four cases', () => {
  assert.equal(registry().list().length, 4);
});

test('05 registry case IDs are unique', () => {
  const ids = registry().list().map((item) => item.caseData.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('06 explicit registry validation accepts all fixtures', () => {
  assert.equal(registry().validate().valid, true);
});

test('07 registry list is sorted by deterministic sort order', () => {
  assert.deepEqual(registry().list().map((item) => item.metadata.sortOrder), [1, 2, 3, 4]);
});

test('08 registry supports lookup by ID with a defensive copy', () => {
  const first = registry().getById(IDS[0]);
  assert.equal(first?.caseData.id, IDS[0]);
});

test('09 missing case returns a typed result instead of throwing', () => {
  const result = service().getCase('DEMO-MISSING', options(IDS[0]));
  assert.equal('error' in result ? result.error.code : undefined, 'case-not-found');
});

test('10 Case A summary describes a potentially recoverable opportunity', () => {
  assert.match(getCase(IDS[0]).summary.headline, /recoverable/i);
});

test('11 Case B summary identifies non-recoverable external limitation', () => {
  assert.equal(getCase(IDS[1]).summary.recoverability, 'non-recoverable');
});

test('12 Case C summary leads with insufficient data', () => {
  assert.match(getCase(IDS[2]).summary.headline, /^Insufficient data/i);
});

test('13 Case D summary leads with overlap review', () => {
  assert.match(getCase(IDS[3]).summary.headline, /overlap review/i);
});

test('14 Case A presents estimated recovery', () => {
  const value = getCase(IDS[0]).summary.recoveryOpportunity.estimatedEnergy;
  assert.equal(value.availability, 'available');
  assert.equal(value.isEstimate, true);
});

test('15 Case B does not present maintenance recovery', () => {
  const detail = getCase(IDS[1]);
  assert.equal(detail.summary.recoveryOpportunity.estimatedEnergy.value, undefined);
  assert.match(detail.summary.recommendedNextStep, /do not create asset maintenance work/i);
});

test('16 Case C keeps insufficient data before opportunity language', () => {
  const detail = getCase(IDS[2]);
  assert.equal(detail.summary.dataSufficiency, 'insufficient');
  assert.doesNotMatch(detail.summary.executiveNarrative, /potentially recoverable/i);
});

test('17 Case D exposes an overlap warning', () => {
  assert.ok(getCase(IDS[3]).summary.keyWarnings.some((item) => /overlap/i.test(item)));
});

test('18 unavailable presentation values are not replaced by zero', () => {
  const value = getCase(IDS[2]).summary.recoveryOpportunity.estimatedEnergy;
  assert.equal(value.availability, 'unavailable');
  assert.equal(value.value, undefined);
});

test('19 blocked climate impact includes a reason', () => {
  const climate = getCase(IDS[2]).climateImpact;
  assert.equal(climate.availability, 'blocked');
  assert.ok(climate.blockingReasons.length > 0);
});

test('20 every synthetic detail carries a disclosure', () => {
  for (const id of IDS) {
    const detail = getCase(id);
    assert.ok(detail.disclosures[0].length > 0);
    const visit = (value: unknown) => {
      if (!value || typeof value !== 'object') return;
      const record = value as Record<string, unknown>;
      if (record.isSynthetic === true && typeof record.availability === 'string') {
        assert.equal(typeof record.disclosure, 'string');
        assert.ok((record.disclosure as string).length > 0);
      }
      for (const nested of Object.values(record)) visit(nested);
    };
    visit(detail);
  }
});

test('21 estimated values are labeled as estimates', () => {
  assert.equal(getCase(IDS[0]).climateImpact.estimatedAvoidedEmissions.isEstimate, true);
});

test('22 projected values are labeled as projections', () => {
  assert.equal(getCase(IDS[0]).scenarios[0].recoveredEnergy.isProjection, true);
});

test('23 synthetic climate impact is never verified', () => {
  for (const id of IDS) assert.equal(getCase(id).climateImpact.isVerified, false);
});

test('24 synthetic recovery score is never operational', () => {
  for (const id of IDS) assert.equal(getCase(id).recoveryScore.isOperational, false);
});

test('25 all presented actions are non-binding', () => {
  for (const id of IDS) assert.ok(getCase(id).actions.every((item) => item.isBinding === false));
});

test('26 suppressed field inspection preserves approval and safety gates', () => {
  const field = getCase(IDS[0]).actions.find((item) => item.actionType === 'field-inspection');
  assert.equal(field?.status, 'suppressed');
  assert.equal(field?.requiresApproval, true);
  assert.ok((field?.safetyNotes.length ?? 0) > 0);
});

test('27 every KPI has source references', () => {
  for (const id of IDS) assert.ok(getCase(id).kpis.every((item) => item.sourceReferences.length > 0));
});

test('28 confidence explicitly says it is not a calibrated probability', () => {
  const confidence = getCase(IDS[0]).kpis.find((item) => item.id === 'confidence');
  assert.match(confidence?.explanation ?? '', /not a calibrated probability/i);
});

test('29 priority remains within zero and one hundred', () => {
  for (const id of IDS) {
    const value = getCase(id).summary.priorityScore.value;
    assert.ok(value !== undefined && value >= 0 && value <= 100);
  }
});

test('30 timeline is deterministic', () => {
  assert.deepEqual(getCase(IDS[0]).timeline, getCase(IDS[0]).timeline);
});

test('31 timeline uses stable IDs to break timestamp ties', () => {
  const timeline = getCase(IDS[0]).timeline;
  const sorted = [...timeline].sort((a, b) => a.timestamp.localeCompare(b.timestamp) || a.id.localeCompare(b.id));
  assert.deepEqual(timeline, sorted);
});

test('32 timeline contains only supported event types and explicit timestamps', () => {
  const allowed = new Set(['detection', 'evidence-collected', 'assessment-generated', 'hypothesis-generated', 'recommendation-generated', 'review-requested', 'scenario-generated', 'climate-estimate-generated', 'warning-raised', 'case-status']);
  assert.ok(getCase(IDS[0]).timeline.every((item) => allowed.has(item.eventType) && item.timestamp.endsWith('Z')));
});

test('33 explainability retains contradicting evidence', () => {
  assert.ok(getCase(IDS[0]).explainability.contradictingEvidence.length > 0);
});

test('34 explainability retains missing evidence', () => {
  assert.ok(getCase(IDS[2]).explainability.missingEvidence.length > 0);
});

test('35 explainability exposes selected highlights, not the full technical trace', () => {
  const app = service();
  const detail = app.getCase(IDS[0], options(IDS[0]));
  const assessment = app.evaluateCase(IDS[0], options(IDS[0]));
  assert.ok(detail.ok && assessment.ok);
  if (detail.ok && assessment.ok) assert.ok(detail.data.explainability.traceHighlights.length < assessment.data.trace.length);
});

test('36 energy formatter supports Wh', () => {
  assert.equal(formatEnergy(1, 'Wh', formatOptions).formattedValue, '1,000 Wh');
});

test('37 energy formatter supports kWh', () => {
  assert.equal(formatEnergy(1, 'kWh', formatOptions).formattedValue, '1 kWh');
});

test('38 energy formatter supports MWh', () => {
  assert.equal(formatEnergy(1_000, 'MWh', formatOptions).formattedValue, '1 MWh');
});

test('39 energy formatter supports GWh', () => {
  assert.equal(formatEnergy(1_000_000, 'GWh', formatOptions).formattedValue, '1 GWh');
});

test('40 emissions formatter supports kilograms', () => {
  assert.equal(formatEmissions(1_000, 'kgCO2e', formatOptions).formattedValue, '1,000 kgCO2e');
});

test('41 emissions formatter supports tonnes', () => {
  assert.equal(formatEmissions(1_000, 'tCO2e', formatOptions).formattedValue, '1 tCO2e');
});

test('42 percentage formatter accepts a normalized value', () => {
  assert.equal(formatPercentage(0.725, formatOptions).formattedValue, '72.5 %');
});

test('43 non-finite number is unavailable without zero fallback', () => {
  const value = formatNumber(Number.NaN, formatOptions);
  assert.equal(value.availability, 'unavailable');
  assert.equal(value.value, undefined);
});

test('44 date formatter is deterministic with explicit UTC', () => {
  assert.equal(
    formatIsoDate('2026-07-01T12:00:00Z', 'en', 'UTC').formattedValue,
    formatIsoDate('2026-07-01T12:00:00Z', 'en', 'UTC').formattedValue,
  );
});

test('45 Spanish text resolver returns Spanish', () => {
  assert.equal(resolveClimateRecoveryText('es', 'kpi.confidence').text, 'Confianza');
});

test('46 English text resolver returns English', () => {
  assert.equal(resolveClimateRecoveryText('en', 'kpi.confidence').text, 'Confidence');
});

test('47 missing text key returns a deterministic fallback limitation', () => {
  const result = resolveClimateRecoveryText('es', 'missing.key');
  assert.equal(result.text, 'missing.key');
  assert.equal(result.usedFallback, true);
  assert.ok(result.limitation);
});

test('48 catalog filters by category', () => {
  const result = service().listCases({ ...catalogQuery, filters: { category: 'grid-curtailment' } });
  assert.deepEqual(result.items.map((item) => item.caseId), [IDS[1]]);
});

test('49 catalog filters by priority band', () => {
  const first = service().evaluateCase(IDS[0], catalogQuery);
  assert.ok(first.ok);
  const priorityBand = first.ok ? first.data.priority.band : 'medium';
  const filtered = service().listCases({ ...catalogQuery, filters: { priorityBand } });
  assert.ok(filtered.items.length > 0);
  for (const item of filtered.items) {
    const result = service().evaluateCase(item.caseId, catalogQuery);
    assert.equal(result.ok ? result.data.priority.band : undefined, priorityBand);
  }
});

test('50 catalog filters by required human review', () => {
  const result = service().listCases({ ...catalogQuery, filters: { humanReviewRequired: true } });
  assert.equal(result.filteredCount, 4);
});

test('51 catalog sorts priority descending', () => {
  const values = service().listCases({ ...catalogQuery, sort: 'priority-desc' }).items.map((item) => item.priority.value ?? -1);
  assert.deepEqual(values, [...values].sort((a, b) => b - a));
});

test('52 catalog sorts recoverable energy descending', () => {
  const values = service().listCases({ ...catalogQuery, sort: 'recoverable-energy-desc' }).items.map((item) => item.estimatedRecoverableEnergy.value ?? -1);
  assert.deepEqual(values, [...values].sort((a, b) => b - a));
});

test('53 portfolio contains four synthetic cases', () => {
  assert.equal(service().getPortfolioSummary(catalogQuery).caseCount, 4);
});

test('54 portfolio excludes non-recoverable Case B from totals', () => {
  assert.ok(service().getPortfolioSummary(catalogQuery).excludedCaseIds.includes(IDS[1]));
});

test('55 portfolio excludes insufficient Case C from totals', () => {
  assert.ok(service().getPortfolioSummary(catalogQuery).excludedCaseIds.includes(IDS[2]));
});

test('56 default portfolio policy excludes overlap Case D', () => {
  const result = service().getPortfolioSummary(catalogQuery);
  assert.equal(result.overlapPolicy, 'exclude-overlap');
  assert.ok(result.excludedCaseIds.includes(IDS[3]));
});

test('57 portfolio records included and excluded cases', () => {
  const result = service().getPortfolioSummary(catalogQuery);
  assert.deepEqual(result.includedCaseIds, [IDS[0]]);
  assert.deepEqual(result.excludedCaseIds, [IDS[1], IDS[2], IDS[3]]);
});

test('58 include-with-warning policy includes overlap provisionally', () => {
  const result = service().getPortfolioSummary({ ...catalogQuery, overlapPolicy: 'include-with-warning' });
  assert.ok(result.includedCaseIds.includes(IDS[3]));
  assert.equal(result.aggregationStatus, 'warning');
});

test('59 block-aggregation policy returns blocked values', () => {
  const result = service().getPortfolioSummary({ ...catalogQuery, overlapPolicy: 'block-aggregation' });
  assert.equal(result.aggregationStatus, 'blocked');
  assert.equal(result.estimatedRecoverableEnergy.value, undefined);
});

test('60 application service does not mutate registry fixtures', () => {
  const caseRegistry = registry();
  const before = caseRegistry.list();
  const app = createClimateRecoveryApplicationService({
    caseRegistry,
    assessmentEngine: assessClimateRecoveryCase,
    applicationConfiguration: DEFAULT_CLIMATE_RECOVERY_APPLICATION_CONFIGURATION,
    textResolver: resolveClimateRecoveryText,
  });
  app.listCases(catalogQuery);
  assert.deepEqual(caseRegistry.list(), before);
});

test('61 available operations are descriptors and reflect case state', () => {
  const operations = getCase(IDS[2]).availableOperations;
  assert.ok(operations.includes('request-human-review'));
  assert.ok(operations.includes('request-more-data'));
  assert.ok(operations.includes('inspect-methodology'));
});

test('62 application metadata declares the safe local boundary', () => {
  const metadata = service().getApplicationMetadata();
  assert.equal(metadata.credentialRequired, false);
  assert.equal(metadata.networkRequired, false);
  assert.equal(metadata.productionOperational, false);
  assert.equal(metadata.datasetReality, 'synthetic');
});

test('63 engine version is propagated into case metadata', () => {
  assert.equal(getCase(IDS[0]).metadata.engineVersion, CLIMATE_RECOVERY_ENGINE_VERSION);
});

test('64 presentation version is propagated into case metadata', () => {
  assert.equal(getCase(IDS[0]).metadata.presentationVersion, CLIMATE_RECOVERY_PRESENTATION_VERSION);
});

test('65 application sources do not use implicit clocks randomness network or AI', () => {
  assert.doesNotMatch(applicationSources(), /Date\.now|Math\.random|\bfetch\s*\(|\bOpenAI\b|\bGemini\b/);
});
