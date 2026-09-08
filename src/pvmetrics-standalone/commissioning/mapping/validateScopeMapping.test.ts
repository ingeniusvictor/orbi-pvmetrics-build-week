import assert from 'node:assert/strict';
import test from 'node:test';

import { createCommissioningLabFixture } from '../fixtures/createCommissioningLabFixture';
import { validateScopeMapping } from './validateScopeMapping';

test('synthetic lab scope mapping is valid with one explicitly excluded external SolBank', () => {
  const fixture = createCommissioningLabFixture();
  const result = validateScopeMapping(fixture.assets, fixture.scopeAssets);

  assert.equal(result.valid, true);
  assert.equal(result.excludedCount, 1);
  assert.equal(result.issues.length, 0);
});

test('unknown asset reference blocks scope mapping', () => {
  const fixture = createCommissioningLabFixture();
  const result = validateScopeMapping(fixture.assets, [
    ...fixture.scopeAssets,
    {
      scopeAssetId: 'BROKEN',
      scopeId: 'SCOPE-LAB-001',
      assetId: 'UNKNOWN-ASSET',
      status: 'INCLUDED',
    },
  ]);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.code === 'ASSET_NOT_FOUND'));
});

test('included child of excluded parent is rejected', () => {
  const fixture = createCommissioningLabFixture();
  const changed = fixture.scopeAssets.map((entry) =>
    entry.assetId === 'SB-LAB-001' ? { ...entry, status: 'EXCLUDED' as const } : entry,
  );

  const result = validateScopeMapping(fixture.assets, changed);
  assert.equal(result.valid, false);
  assert.ok(result.issues.some((issue) => issue.code === 'INCLUDED_CHILD_OF_EXCLUDED_PARENT'));
});
