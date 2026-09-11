import assert from 'node:assert/strict';
import test from 'node:test';

import { createSyntheticOperationalFixture } from './fixtures/createSyntheticOperationalFixture';
import { validateGovernedObservation } from './validation/validateGovernedObservation';

const validateFixture = () => {
  const fixture = createSyntheticOperationalFixture();
  return { fixture, result: validateGovernedObservation(fixture.observation, fixture) };
};

const issueCodes = (result: ReturnType<typeof validateGovernedObservation>) => result.issues.map((issue) => issue.code);

test('valid synthetic governed observation passes and preserves GOOD quality', () => {
  const { fixture, result } = validateFixture();
  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.issues, []);
  assert.equal(fixture.observation.quality, 'GOOD');
  assert.equal(fixture.observation.provenance, 'SYNTHETIC');
});

test('blocks missing asset, source, and signal references', () => {
  const fixture = createSyntheticOperationalFixture();
  const missingAsset = validateGovernedObservation({ ...fixture.observation, assetId: '' }, fixture);
  const missingSource = validateGovernedObservation({ ...fixture.observation, sourceId: '' }, fixture);
  const missingSignal = validateGovernedObservation({ ...fixture.observation, signalId: '', signalKey: '' }, fixture);
  assert.ok(issueCodes(missingAsset).includes('MISSING_ASSET_ID'));
  assert.ok(issueCodes(missingSource).includes('MISSING_SOURCE_ID'));
  assert.ok(issueCodes(missingSignal).includes('MISSING_SIGNAL_ID'));
  assert.ok(issueCodes(missingSignal).includes('MISSING_SIGNAL_KEY'));
});

test('blocks invalid timestamps, unit mismatches, and incompatible values', () => {
  const fixture = createSyntheticOperationalFixture();
  const invalidTimestamp = validateGovernedObservation({ ...fixture.observation, timestamp: 'not-a-timestamp' }, fixture);
  const invalidUnit = validateGovernedObservation({ ...fixture.observation, unit: 'MW' }, fixture);
  const invalidValue = validateGovernedObservation({ ...fixture.observation, value: '125.4' }, fixture);
  assert.ok(issueCodes(invalidTimestamp).includes('INVALID_TIMESTAMP'));
  assert.ok(issueCodes(invalidUnit).includes('UNIT_MISMATCH'));
  assert.ok(issueCodes(invalidValue).includes('VALUE_TYPE_MISMATCH'));
});

test('blocks invalid quality and evidence references that cannot be resolved', () => {
  const fixture = createSyntheticOperationalFixture();
  const invalidQuality = validateGovernedObservation({ ...fixture.observation, quality: 'PERFECT' as never }, fixture);
  const missingEvidence = validateGovernedObservation({ ...fixture.observation, evidenceIds: ['UNKNOWN-EVIDENCE'] }, fixture);
  assert.ok(issueCodes(invalidQuality).includes('INVALID_QUALITY'));
  assert.ok(issueCodes(missingEvidence).includes('EVIDENCE_NOT_REFERENCEABLE'));
});

test('blocks a synthetic source or observation presented as verified real source', () => {
  const fixture = createSyntheticOperationalFixture();
  const verifiedSourceCatalog = { ...fixture, sources: fixture.sources.map((source) => ({ ...source, verificationState: 'SOURCE_VERIFIED' as const })) };
  const verifiedObservation = validateGovernedObservation({ ...fixture.observation, verificationState: 'SOURCE_VERIFIED' }, fixture);
  const verifiedSource = validateGovernedObservation(fixture.observation, verifiedSourceCatalog);
  assert.ok(issueCodes(verifiedObservation).includes('SYNTHETIC_SOURCE_CLAIMED_VERIFIED'));
  assert.ok(issueCodes(verifiedSource).includes('SYNTHETIC_SOURCE_CLAIMED_VERIFIED'));
});

test('validator is deterministic and does not mutate its inputs', () => {
  const fixture = createSyntheticOperationalFixture();
  const before = structuredClone(fixture);
  const first = validateGovernedObservation(fixture.observation, fixture);
  const second = validateGovernedObservation(fixture.observation, fixture);
  assert.deepEqual(first, second);
  assert.deepEqual(fixture, before);
});
