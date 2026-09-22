import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const validator = path.resolve('scripts/validate-pvmetrics-agent-observation.mjs');

const base = {
  schemaVersion: 'pvm.agent.observation.v1',
  status: 'success',
  summary: 'Repository verification completed.',
  nextActions: ['Record final evidence.'],
  artifacts: ['docs/ecc/PVMETRICS_ECC_P6_AGENT_HARNESS.md'],
  evidence: [
    { kind: 'ci', reference: 'workflow-run:example', verification: 'verified' },
  ],
  authorityImpact: {
    liveOtConnection: false,
    plantCommand: false,
    commissioningAcceptance: false,
    verifiedRealPilot: false,
    realDataStatus: false,
    secrets: false,
    canonicalGit: false,
  },
};

const withObservation = (value, run) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pvm-agent-observation-'));
  const file = path.join(dir, 'observation.json');
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  try {
    return run(file);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

test('accepts a normal structured success observation', () => {
  withObservation(base, (file) => {
    const output = execFileSync(process.execPath, [validator, file], { encoding: 'utf8' });
    assert.match(output, /VALID pvm\.agent\.observation\.v1/);
  });
});

test('requires recovery fields for error observations', () => {
  withObservation({ ...base, status: 'error' }, (file) => {
    const result = spawnSync(process.execPath, [validator, file], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /error observations require recovery/);
  });
});

test('accepts error observation with explicit safe recovery and stop condition', () => {
  const value = {
    ...base,
    status: 'error',
    recovery: {
      rootCauseHint: 'Required source evidence was unavailable.',
      safeRetry: 'Retry only after obtaining a new governed evidence source.',
      stopCondition: 'Stop if the next action would require unauthorized OT access.',
    },
  };
  withObservation(value, (file) => {
    const output = execFileSync(process.execPath, [validator, file], { encoding: 'utf8' });
    assert.match(output, /VALID/);
  });
});

test('rejects unknown fields instead of silently widening the contract', () => {
  withObservation({ ...base, grantPlantAuthority: true }, (file) => {
    const result = spawnSync(process.execPath, [validator, file], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unknown top-level field/);
  });
});

test('requires every authority-impact field to be explicit booleans', () => {
  const value = {
    ...base,
    authorityImpact: {
      ...base.authorityImpact,
      plantCommand: 'no',
    },
  };
  withObservation(value, (file) => {
    const result = spawnSync(process.execPath, [validator, file], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /authorityImpact\.plantCommand must be boolean/);
  });
});
