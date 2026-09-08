import type {
  Anomaly,
  CommissioningBaseline,
  CommissioningCampaign,
  CommissioningProject,
  CommissioningScope,
  Finding,
  HandoverPackage,
  PunchItem,
  TestExecution,
} from '../contracts';
import { createCommissioningLabFixture } from '../fixtures/createCommissioningLabFixture';
import { createCommissioningCertificationFixture } from '../fixtures/createCommissioningCertificationFixture';
import {
  CommissioningRepository,
  type CommissioningLoadResult,
  type CommissioningSnapshot,
} from '../persistence';

export type CommissioningWorkspaceSummary = {
  projectCount: number;
  scopeCount: number;
  campaignCount: number;
  executionCount: number;
  activeAnomalyCount: number;
  openFindingCount: number;
  openPunchCount: number;
  availableBaselineCount: number;
  readyHandoverCount: number;
};

export type CommissioningWorkspaceState = {
  loadStatus: CommissioningLoadResult['status'];
  snapshot: CommissioningSnapshot;
  summary: CommissioningWorkspaceSummary;
};

const summarize = (snapshot: CommissioningSnapshot): CommissioningWorkspaceSummary => ({
  projectCount: snapshot.projects.length,
  scopeCount: snapshot.scopes.length,
  campaignCount: snapshot.campaigns.length,
  executionCount: snapshot.testExecutions.length,
  activeAnomalyCount: snapshot.anomalies.filter((item) => !['CLEARED', 'DISMISSED'].includes(item.status)).length,
  openFindingCount: snapshot.findings.filter((item) => !['CLOSED', 'DISMISSED'].includes(item.status)).length,
  openPunchCount: snapshot.punchItems.filter((item) => item.status !== 'CLOSED').length,
  availableBaselineCount: snapshot.baselines.filter((item) => item.status === 'AVAILABLE').length,
  readyHandoverCount: snapshot.handoverPackages.filter((item) => item.status === 'READY' || item.status === 'APPROVED').length,
});

export class CommissioningService {
  private snapshot: CommissioningSnapshot;
  private loadStatus: CommissioningLoadResult['status'];

  constructor(private readonly repository: CommissioningRepository) {
    const loaded = repository.load();
    this.snapshot = loaded.snapshot;
    this.loadStatus = loaded.status;
  }

  getState(): CommissioningWorkspaceState {
    return {
      loadStatus: this.loadStatus,
      snapshot: structuredClone(this.snapshot),
      summary: summarize(this.snapshot),
    };
  }

  initializeSyntheticLab(): CommissioningWorkspaceState {
    this.snapshot = createCommissioningLabFixture();
    this.loadStatus = 'LOADED';
    return this.getState();
  }

  initializeSyntheticCertificationScenario(): CommissioningWorkspaceState {
    this.snapshot = createCommissioningCertificationFixture();
    this.loadStatus = 'LOADED';
    return this.getState();
  }

  replaceSnapshot(snapshot: CommissioningSnapshot): CommissioningWorkspaceState {
    this.snapshot = structuredClone(snapshot);
    this.loadStatus = 'LOADED';
    return this.getState();
  }

  save(savedAt?: string): void {
    this.repository.save(this.snapshot, savedAt);
  }

  reset(): CommissioningWorkspaceState {
    this.repository.reset();
    const loaded = this.repository.load();
    this.snapshot = loaded.snapshot;
    this.loadStatus = loaded.status;
    return this.getState();
  }

  getProject(projectId: string): CommissioningProject | undefined {
    return this.snapshot.projects.find((item) => item.projectId === projectId);
  }

  getScopes(projectId?: string): CommissioningScope[] {
    return this.snapshot.scopes.filter((item) => projectId === undefined || item.projectId === projectId);
  }

  getCampaigns(projectId?: string): CommissioningCampaign[] {
    return this.snapshot.campaigns.filter((item) => projectId === undefined || item.projectId === projectId);
  }

  getExecutions(testInstanceId?: string): TestExecution[] {
    return this.snapshot.testExecutions.filter((item) => testInstanceId === undefined || item.testInstanceId === testInstanceId);
  }

  getAnomalies(executionId?: string): Anomaly[] {
    return this.snapshot.anomalies.filter((item) => executionId === undefined || item.executionId === executionId);
  }

  getFindings(projectId?: string): Finding[] {
    return this.snapshot.findings.filter((item) => projectId === undefined || item.projectId === projectId);
  }

  getPunchItems(): PunchItem[] {
    return [...this.snapshot.punchItems];
  }

  getBaselines(projectId?: string): CommissioningBaseline[] {
    return this.snapshot.baselines.filter((item) => projectId === undefined || item.projectId === projectId);
  }

  getHandoverPackages(projectId?: string): HandoverPackage[] {
    return this.snapshot.handoverPackages.filter((item) => projectId === undefined || item.projectId === projectId);
  }
}
