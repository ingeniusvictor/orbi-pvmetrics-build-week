import test from 'node:test';
import assert from 'node:assert/strict';
import { CommissioningRepository, MemoryCommissioningStorageDriver } from '../persistence';
import { CommissioningService } from './commissioningService';

test('service starts empty over an empty repository', () => {
  const service = new CommissioningService(new CommissioningRepository(new MemoryCommissioningStorageDriver()));
  const state = service.getState();
  assert.equal(state.loadStatus, 'EMPTY');
  assert.equal(state.summary.projectCount, 0);
});

test('synthetic lab initialization is explicit and not persisted automatically', () => {
  const driver = new MemoryCommissioningStorageDriver();
  const repository = new CommissioningRepository(driver);
  const service = new CommissioningService(repository);
  const state = service.initializeSyntheticLab();
  assert.equal(state.summary.projectCount, 1);
  assert.equal(state.snapshot.projects[0].projectId, 'DAS-BESS-LAB');

  const secondService = new CommissioningService(new CommissioningRepository(driver));
  assert.equal(secondService.getState().loadStatus, 'EMPTY');
});

test('processed certification scenario is explicit, populated and not persisted automatically', () => {
  const driver = new MemoryCommissioningStorageDriver();
  const service = new CommissioningService(new CommissioningRepository(driver));
  const state = service.initializeSyntheticCertificationScenario();

  assert.equal(state.summary.projectCount, 1);
  assert.equal(state.summary.executionCount, 5);
  assert.equal(state.snapshot.anomalies.length, 9);
  assert.equal(state.snapshot.findings.length, 5);
  assert.equal(state.snapshot.punchItems.length, 3);
  assert.equal(state.summary.availableBaselineCount, 1);
  assert.equal(state.summary.readyHandoverCount, 1);

  const secondService = new CommissioningService(new CommissioningRepository(driver));
  assert.equal(secondService.getState().loadStatus, 'EMPTY');
});

test('explicit save persists the synthetic workspace', () => {
  const driver = new MemoryCommissioningStorageDriver();
  const service = new CommissioningService(new CommissioningRepository(driver));
  service.initializeSyntheticLab();
  service.save('2026-09-08T16:00:00Z');

  const reloaded = new CommissioningService(new CommissioningRepository(driver));
  assert.equal(reloaded.getState().loadStatus, 'LOADED');
  assert.equal(reloaded.getProject('DAS-BESS-LAB')?.name.includes('Synthetic'), true);
  assert.equal(reloaded.getScopes('DAS-BESS-LAB').length, 1);
  assert.equal(reloaded.getCampaigns('DAS-BESS-LAB').length, 1);
});

test('state reads are defensive copies', () => {
  const service = new CommissioningService(new CommissioningRepository(new MemoryCommissioningStorageDriver()));
  const state = service.initializeSyntheticLab();
  state.snapshot.projects[0].name = 'MUTATED OUTSIDE';
  assert.notEqual(service.getProject('DAS-BESS-LAB')?.name, 'MUTATED OUTSIDE');
});

test('reset clears persisted commissioning state without touching unrelated application state', () => {
  const driver = new MemoryCommissioningStorageDriver();
  const service = new CommissioningService(new CommissioningRepository(driver));
  service.initializeSyntheticLab();
  service.save();
  const reset = service.reset();
  assert.equal(reset.loadStatus, 'EMPTY');
  assert.equal(reset.summary.projectCount, 0);
});
