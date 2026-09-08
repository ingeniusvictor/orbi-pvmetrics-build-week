import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BrowserLocalStorageDriver,
  CommissioningRepository,
  MemoryCommissioningStorageDriver,
  createEmptyCommissioningSnapshot,
} from './index';

class FakeBrowserStorage {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

test('empty repository returns a complete empty commissioning snapshot', () => {
  const repository = new CommissioningRepository(new MemoryCommissioningStorageDriver());
  const result = repository.load();

  assert.equal(result.status, 'EMPTY');
  assert.deepEqual(result.snapshot, createEmptyCommissioningSnapshot());
});

test('repository round-trips a versioned snapshot deterministically', () => {
  const driver = new MemoryCommissioningStorageDriver();
  const repository = new CommissioningRepository(driver);
  const snapshot = createEmptyCommissioningSnapshot();
  snapshot.projects.push({
    projectId: 'PROJECT-001',
    name: 'Synthetic BESS Commissioning Lab',
    lifecycleStatus: 'IN_PRE_COMMISSIONING',
    createdAt: '2026-09-08T12:00:00.000Z',
    createdBy: 'test',
    updatedAt: '2026-09-08T12:00:00.000Z',
    updatedBy: 'test',
  });

  repository.save(snapshot, '2026-09-08T12:01:00.000Z');
  const result = repository.load();

  assert.equal(result.status, 'LOADED');
  if (result.status !== 'LOADED') return;
  assert.equal(result.savedAt, '2026-09-08T12:01:00.000Z');
  assert.equal(result.snapshot.projects[0]?.projectId, 'PROJECT-001');
});

test('invalid JSON never becomes commissioning state', () => {
  const driver = new MemoryCommissioningStorageDriver();
  driver.write('workspace', '{bad-json');
  const repository = new CommissioningRepository(driver);

  const result = repository.load();
  assert.equal(result.status, 'INVALID');
  assert.deepEqual(result.snapshot, createEmptyCommissioningSnapshot());
});

test('unknown schema version is rejected instead of silently migrated', () => {
  const driver = new MemoryCommissioningStorageDriver();
  driver.write(
    'workspace',
    JSON.stringify({
      schemaVersion: 999,
      savedAt: '2026-09-08T12:00:00.000Z',
      snapshot: createEmptyCommissioningSnapshot(),
    }),
  );
  const repository = new CommissioningRepository(driver);

  const result = repository.load();
  assert.equal(result.status, 'INVALID');
});

test('browser driver scopes commissioning keys and reset removes only its scoped key', () => {
  const storage = new FakeBrowserStorage();
  storage.setItem('unrelated:key', 'keep');
  const driver = new BrowserLocalStorageDriver(storage, 'commissioning-test');
  const repository = new CommissioningRepository(driver);

  repository.save(createEmptyCommissioningSnapshot(), '2026-09-08T12:00:00.000Z');
  assert.ok(storage.values.has('commissioning-test:workspace'));
  assert.equal(storage.getItem('unrelated:key'), 'keep');

  repository.reset();
  assert.equal(storage.getItem('commissioning-test:workspace'), null);
  assert.equal(storage.getItem('unrelated:key'), 'keep');
});
