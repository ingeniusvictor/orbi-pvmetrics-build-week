import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assessProjectMappingProfile,
  createEmptyProjectMappingProfile,
  type ProjectMappingProfile,
} from './projectMappingProfile';

test('empty mapping profile is blocked without inventing project data', () => {
  const assessment = assessProjectMappingProfile(createEmptyProjectMappingProfile());
  assert.equal(assessment.status, 'BLOCKED');
  assert.ok(assessment.blockers.some((item) => /Project ID/.test(item)));
  assert.ok(assessment.blockers.some((item) => /Scope revision/.test(item)));
  assert.ok(assessment.blockers.some((item) => /authoritative source/.test(item)));
});

test('unverified mappings remain blocked', () => {
  const profile: ProjectMappingProfile = {
    profileId: 'MAP-1',
    projectId: 'PROJECT-1',
    scopeRevision: 'REV-A',
    sources: [{ sourceId: 'SRC-1', reference: 'as-built.xlsx', verificationStatus: 'UNVERIFIED' }],
    assets: [{ sourceAssetId: 'PCS-01', sourceId: 'SRC-1', verificationStatus: 'UNVERIFIED' }],
    signals: [{ sourceSignal: 'P_AC', sourceId: 'SRC-1', verificationStatus: 'UNVERIFIED' }],
  };
  const assessment = assessProjectMappingProfile(profile);
  assert.equal(assessment.status, 'BLOCKED');
  assert.ok(assessment.blockers.some((item) => /still UNVERIFIED/.test(item)));
});

test('a confirmed mapping cannot rely on an unverified source', () => {
  const profile: ProjectMappingProfile = {
    profileId: 'MAP-2',
    projectId: 'PROJECT-1',
    scopeRevision: 'REV-A',
    sources: [{ sourceId: 'SRC-1', reference: 'tag-list.xlsx', verificationStatus: 'UNVERIFIED' }],
    assets: [],
    signals: [{
      sourceSignal: 'P_AC',
      canonicalSignalKey: 'pcs.active_power',
      sourceUnit: 'kW',
      canonicalUnit: 'kW',
      sourceId: 'SRC-1',
      verificationStatus: 'SOURCE_CONFIRMED',
    }],
  };
  const assessment = assessProjectMappingProfile(profile);
  assert.equal(assessment.status, 'BLOCKED');
  assert.ok(assessment.blockers.some((item) => /cannot be confirmed from an unverified source/.test(item)));
});

test('source-confirmed mappings can become ready for mapping review', () => {
  const profile: ProjectMappingProfile = {
    profileId: 'MAP-3',
    projectId: 'PROJECT-1',
    scopeRevision: 'REV-A',
    sources: [{ sourceId: 'SRC-1', reference: 'approved-as-built.xlsx', revision: 'A', verificationStatus: 'SOURCE_CONFIRMED' }],
    assets: [{
      sourceAssetId: 'PCS-01',
      canonicalAssetId: 'PCS-01',
      canonicalAssetType: 'PCS',
      sourceId: 'SRC-1',
      verificationStatus: 'SOURCE_CONFIRMED',
    }],
    signals: [{
      sourceSignal: 'P_AC',
      canonicalSignalKey: 'pcs.active_power',
      sourceUnit: 'kW',
      canonicalUnit: 'kW',
      scale: 1,
      signMultiplier: 1,
      sourceId: 'SRC-1',
      verificationStatus: 'SOURCE_CONFIRMED',
    }],
  };
  const assessment = assessProjectMappingProfile(profile);
  assert.equal(assessment.status, 'READY_FOR_MAPPING_REVIEW');
  assert.equal(assessment.blockers.length, 0);
});
