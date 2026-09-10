import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = process.cwd();
const COMMISSIONING_ROOT = join(ROOT, 'src/pvmetrics-standalone/commissioning');
const APP_PATH = join(ROOT, 'src/pvmetrics-standalone/app/OrbiPVMetricsStandaloneApp.tsx');
const WORKSPACE_PATH = join(COMMISSIONING_ROOT, 'components/CommissioningWorkspaceView.tsx');
const UNIFIED_REPORTS_PATH = join(ROOT, 'src/pvmetrics-standalone/components/UnifiedReportsView.tsx');
const COMMISSIONING_REPORTS_PATH = join(COMMISSIONING_ROOT, 'components/CommissioningReportsPanel.tsx');
const REPORT_BUILDER_PATH = join(COMMISSIONING_ROOT, 'reporting/commissioningReport.ts');
const FEATURE_FLAGS_PATH = join(COMMISSIONING_ROOT, 'config/commissioningFeatureFlags.ts');

const read = (path: string) => readFileSync(path, 'utf8');

const productionSources = (directory: string): string[] => {
  const files: string[] = [];
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...productionSources(fullPath));
      continue;
    }
    if (!/\.tsx?$/.test(entry) || entry.endsWith('.test.ts') || entry.endsWith('.test.tsx')) continue;
    files.push(fullPath);
  }
  return files;
};

test('G32-A feature flag exposes Commissioning intentionally', () => {
  const source = read(FEATURE_FLAGS_PATH);
  assert.match(source, /workspaceEnabled:\s*true/);
});

test('G32-A main navigation routes Commissioning through the feature flag', () => {
  const source = read(APP_PATH);
  assert.match(source, /COMMISSIONING_FEATURE_FLAGS\.workspaceEnabled/);
  assert.match(source, /id:\s*'commissioning'/);
  assert.match(source, /<CommissioningWorkspaceView\b/);
  assert.match(source, /locale=\{commissioningLocale\}/);
  assert.match(source, /onLocaleChange=\{setCommissioningLocale\}/);
});

test('G32-A workspace exposes every approved commissioning section without placeholders', () => {
  const source = read(WORKSPACE_PATH);
  const sectionIds = ['overview', 'scope', 'campaigns', 'tests', 'anomalies', 'findings', 'punch', 'evidence', 'baseline', 'handover'];
  for (const sectionId of sectionIds) assert.match(source, new RegExp(`id:\\s*'${sectionId}'`));
  const viewNames = [
    'CommissioningOverview',
    'CommissioningScopeView',
    'CommissioningCampaignsView',
    'CommissioningTestsView',
    'CommissioningAnomalyRadarView',
    'CommissioningFindingsView',
    'CommissioningPunchRetestView',
    'CommissioningEvidenceView',
    'CommissioningBaselineView',
    'CommissioningHandoverView',
  ];
  for (const viewName of viewNames) assert.match(source, new RegExp(`<${viewName}\\s+state=\\{state\\}`));
  assert.doesNotMatch(source, /se implementa en los siguientes bloques UI/i);
});

test('G32-A global Reports preserves legacy reports and adds Commissioning as a separate domain', () => {
  const app = read(APP_PATH);
  const unified = read(UNIFIED_REPORTS_PATH);
  assert.match(app, /<UnifiedReportsView\b/);
  assert.match(unified, /<ReportsView\s*\/>/);
  assert.match(unified, /<CommissioningReportsPanel\b/);
  assert.match(unified, /PV \+ BESS Reports/);
  assert.match(unified, /BESS Commissioning Report/);
});

test('G32-A Commissioning report builder is deterministic by contract and does not use implicit clocks or randomness', () => {
  const source = read(REPORT_BUILDER_PATH);
  assert.doesNotMatch(source, /Date\.now\s*\(/);
  assert.doesNotMatch(source, /new\s+Date\s*\(/);
  assert.doesNotMatch(source, /Math\.random\s*\(/);
  assert.match(source, /generatedAt/);
  assert.match(source, /generatedBy/);
  assert.match(source, /READ_ONLY_SHADOW_MODE/);
});

test('G32-A Commissioning report generation remains explicit and local', () => {
  const source = read(COMMISSIONING_REPORTS_PATH);
  assert.match(source, /onClick=\{generateReport\}/);
  assert.match(source, /buildCommissioningReport/);
  assert.match(source, /new Blob/);
  assert.match(source, /Export TXT/);
  assert.match(source, /Export JSON/);
  assert.doesNotMatch(source, /fetch\s*\(/);
});

test('G32-A production Commissioning code contains no direct network client', () => {
  const combined = productionSources(COMMISSIONING_ROOT).map(read).join('\n');
  assert.doesNotMatch(combined, /\bfetch\s*\(/);
  assert.doesNotMatch(combined, /new\s+WebSocket\s*\(/);
  assert.doesNotMatch(combined, /XMLHttpRequest/);
  assert.doesNotMatch(combined, /navigator\.sendBeacon/);
});

test('G32-A production Commissioning code imports no generative AI provider', () => {
  const combined = productionSources(COMMISSIONING_ROOT).map(read).join('\n');
  assert.doesNotMatch(combined, /from\s+['"]openai['"]/i);
  assert.doesNotMatch(combined, /from\s+['"]@google\/genai['"]/i);
  assert.doesNotMatch(combined, /OpenAI\s*\(/);
  assert.doesNotMatch(combined, /GoogleGenAI\s*\(/);
});

test('G32-A production Commissioning code exposes no direct OT command API', () => {
  const combined = productionSources(COMMISSIONING_ROOT).map(read).join('\n');
  const prohibitedOperationalIdentifiers = [
    'writeSetpoint',
    'sendCommand',
    'dispatchCommand',
    'operateBreaker',
    'tripBreaker',
    'closeBreaker',
    'writeToBms',
    'writeToPcs',
    'writeToScada',
  ];
  for (const identifier of prohibitedOperationalIdentifiers) {
    assert.doesNotMatch(combined, new RegExp(`\\b${identifier}\\b`, 'i'));
  }
});

test('G32-A visible safety copy keeps analytical and human authority separate', () => {
  const workspace = read(WORKSPACE_PATH);
  const reports = read(COMMISSIONING_REPORTS_PATH);
  const baseline = read(join(COMMISSIONING_ROOT, 'components/CommissioningBaselineView.tsx'));
  const handover = read(join(COMMISSIONING_ROOT, 'components/CommissioningHandoverView.tsx'));
  assert.match(workspace, /No OT Writeback/i);
  assert.match(workspace, /aceptación final permanece bajo responsabilidad humana autorizada/i);
  assert.match(reports, /does not execute tests, change acceptance, close Punch Items or write to OT systems/i);
  assert.match(baseline, /not an authorization to energize or operate equipment/i);
  assert.match(handover, /READY ≠ ENERGIZATION AUTHORITY/i);
});
