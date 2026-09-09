import test from 'node:test';
import assert from 'node:assert/strict';
import { COMMISSIONING_FEATURE_FLAGS, COMMISSIONING_VISIBILITY } from '../commissioning/config/commissioningFeatureFlags';
import {
  PRODUCT_FEATURE_VISIBILITY,
  SHOW_INTERNAL_PRODUCT_SURFACES,
  isProductNavVisible,
} from './productFeatureVisibility';

test('G33 product navigation exposes commissioning and hides internal/legacy competition surfaces by default', () => {
  assert.equal(SHOW_INTERNAL_PRODUCT_SURFACES, false);
  assert.equal(PRODUCT_FEATURE_VISIBILITY.commissioning, 'VISIBLE');
  assert.equal(PRODUCT_FEATURE_VISIBILITY.climateRecovery, 'INTERNAL');
  assert.equal(PRODUCT_FEATURE_VISIBILITY.incidentCopilot, 'LEGACY');

  assert.equal(isProductNavVisible(PRODUCT_FEATURE_VISIBILITY.commissioning), true);
  assert.equal(isProductNavVisible(PRODUCT_FEATURE_VISIBILITY.climateRecovery), false);
  assert.equal(isProductNavVisible(PRODUCT_FEATURE_VISIBILITY.incidentCopilot), false);
});

test('G33 commissioning certification-only chrome is hidden while the base synthetic lab remains controlled', () => {
  assert.equal(COMMISSIONING_FEATURE_FLAGS.workspaceEnabled, true);
  assert.equal(COMMISSIONING_FEATURE_FLAGS.syntheticBaseLabEnabled, true);
  assert.equal(COMMISSIONING_FEATURE_FLAGS.certificationScenarioEnabled, false);
  assert.equal(COMMISSIONING_FEATURE_FLAGS.showInternalCertificationBadge, false);

  assert.equal(COMMISSIONING_VISIBILITY.workspace, 'VISIBLE');
  assert.equal(COMMISSIONING_VISIBILITY.syntheticBaseLab, 'FEATURE_FLAG');
  assert.equal(COMMISSIONING_VISIBILITY.processedCertificationScenario, 'INTERNAL');
  assert.equal(COMMISSIONING_VISIBILITY.internalGateBadges, 'HIDDEN');
});
