import assert from 'node:assert/strict';
import test from 'node:test';

import { createCommissioningLabFixture } from './createCommissioningLabFixture';

test('synthetic lab creates one project, scope and charge/discharge campaign', () => {
  const fixture = createCommissioningLabFixture();

  assert.equal(fixture.projects.length, 1);
  assert.equal(fixture.scopes.length, 1);
  assert.equal(fixture.campaigns.length, 1);
  assert.equal(fixture.campaigns[0]?.type, 'CHARGE_DISCHARGE');
});

test('power block contains exactly three in-scope SolBanks and thirty-six racks', () => {
  const fixture = createCommissioningLabFixture();
  const powerBlockChildren = fixture.assets.filter((asset) => asset.parentAssetId === 'PB-LAB-001');
  const solbanks = powerBlockChildren.filter((asset) => asset.assetType === 'SOLBANK');
  const racks = fixture.assets.filter((asset) => asset.assetType === 'RACK');

  assert.equal(solbanks.length, 3);
  assert.equal(racks.length, 36);
});

test('external fourth SolBank is explicitly excluded from commissioning scope', () => {
  const fixture = createCommissioningLabFixture();
  const external = fixture.assets.find((asset) => asset.assetId === 'SB-LAB-004-EXTERNAL');
  const scopeAsset = fixture.scopeAssets.find((entry) => entry.assetId === 'SB-LAB-004-EXTERNAL');

  assert.ok(external);
  assert.equal(external.parentAssetId, 'SITE-LAB-001');
  assert.equal(scopeAsset?.status, 'EXCLUDED');
});

test('fixture ids and timestamps are deterministic across repeated generation', () => {
  const first = createCommissioningLabFixture();
  const second = createCommissioningLabFixture();

  assert.deepEqual(first, second);
});
