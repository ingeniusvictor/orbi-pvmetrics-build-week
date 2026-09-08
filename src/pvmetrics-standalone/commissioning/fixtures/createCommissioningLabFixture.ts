import type {
  CommissioningAsset,
  CommissioningCampaign,
  CommissioningProject,
  CommissioningScope,
  ScopeAsset,
} from '../contracts';
import { createEmptyCommissioningSnapshot, type CommissioningSnapshot } from '../persistence';

const CREATED_AT = '2026-09-08T12:00:00.000Z';
const ACTOR = 'ORBI-SYNTHETIC-LAB';

const audit = {
  createdAt: CREATED_AT,
  createdBy: ACTOR,
  updatedAt: CREATED_AT,
  updatedBy: ACTOR,
};

const createAsset = (
  assetId: string,
  parentAssetId: string | undefined,
  assetType: CommissioningAsset['assetType'],
  name: string,
  metadata?: CommissioningAsset['metadata'],
): CommissioningAsset => ({
  ...audit,
  assetId,
  projectId: 'DAS-BESS-LAB',
  parentAssetId,
  assetType,
  name,
  metadata,
});

export const createCommissioningLabFixture = (): CommissioningSnapshot => {
  const snapshot = createEmptyCommissioningSnapshot();

  const project: CommissioningProject = {
    ...audit,
    projectId: 'DAS-BESS-LAB',
    name: 'Diego de Almagro Sur — Synthetic Commissioning Lab',
    client: 'SYNTHETIC CLIENT',
    oemBattery: 'e-STORAGE SolBank 3.0 — synthetic profile',
    oemPcs: 'SMA Sunny Central Storage — synthetic profile',
    country: 'Chile',
    region: 'Atacama',
    site: 'Synthetic DAS Lab',
    ratedPowerMw: 4.4,
    ratedEnergyMwh: 14.4,
    lifecycleStatus: 'IN_PRE_COMMISSIONING',
  };

  const scope: CommissioningScope = {
    ...audit,
    scopeId: 'SCOPE-LAB-001',
    projectId: project.projectId,
    revision: 'LAB-1',
    name: 'Synthetic Power Block Commissioning Scope',
    description: 'One synthetic power block with three in-scope SolBank containers plus one external comparison container.',
    status: 'APPROVED',
    approvedBy: ACTOR,
    approvedAt: CREATED_AT,
    effectiveAt: CREATED_AT,
    sourceReference: 'ORBI synthetic commissioning lab v0.1',
  };

  const campaign: CommissioningCampaign = {
    ...audit,
    campaignId: 'CAMPAIGN-LAB-001',
    projectId: project.projectId,
    scopeId: scope.scopeId,
    name: 'Synthetic Charge / Discharge Commissioning Campaign',
    type: 'CHARGE_DISCHARGE',
    description: 'Deterministic commissioning campaign used for import, criteria, anomaly, finding, punch, retest, baseline and handover validation.',
    plannedStart: CREATED_AT,
    status: 'READY',
  };

  const assets: CommissioningAsset[] = [
    createAsset('SITE-LAB-001', undefined, 'SITE', 'DAS Synthetic Site'),
    createAsset('MV-CIRCUIT-LAB-001', 'SITE-LAB-001', 'MV_CIRCUIT', '33 kV Synthetic Circuit 01'),
    createAsset('PB-LAB-001', 'MV-CIRCUIT-LAB-001', 'POWER_BLOCK', 'Power Block LAB-001'),
    createAsset('MVPS-LAB-001', 'PB-LAB-001', 'MVPS', 'Synthetic MV Power Station'),
    createAsset('PCS-LAB-001', 'PB-LAB-001', 'PCS', 'Synthetic PCS', { ratedPowerMw: 4.4 }),
    createAsset('METER-LAB-001', 'PB-LAB-001', 'METER', 'Synthetic Revenue / Test Meter'),
  ];

  for (let solbankNumber = 1; solbankNumber <= 3; solbankNumber += 1) {
    const solbankId = `SB-LAB-00${solbankNumber}`;
    assets.push(
      createAsset(solbankId, 'PB-LAB-001', 'SOLBANK', `Synthetic SolBank ${solbankNumber}`, {
        nominalEnergyMwh: 4.8,
        inScope: true,
      }),
      createAsset(`BMS-LAB-00${solbankNumber}`, solbankId, 'BMS', `Synthetic BMS ${solbankNumber}`),
      createAsset(`TMS-LAB-00${solbankNumber}`, solbankId, 'TMS', `Synthetic TMS ${solbankNumber}`),
      createAsset(`FIRE-LAB-00${solbankNumber}`, solbankId, 'FIRE_SYSTEM', `Synthetic Fire System ${solbankNumber}`),
    );

    for (let rackNumber = 1; rackNumber <= 12; rackNumber += 1) {
      const rackSuffix = String(rackNumber).padStart(2, '0');
      assets.push(
        createAsset(
          `RACK-LAB-${solbankNumber}-${rackSuffix}`,
          solbankId,
          'RACK',
          `SolBank ${solbankNumber} Rack ${rackSuffix}`,
        ),
      );
    }
  }

  assets.push(
    createAsset('SB-LAB-004-EXTERNAL', 'SITE-LAB-001', 'SOLBANK', 'External SolBank 4 — comparison only', {
      inScope: false,
      purpose: 'cross-block anomaly validation',
    }),
  );

  const scopeAssets: ScopeAsset[] = assets.map((asset) => ({
    scopeAssetId: `SCOPE-ASSET:${asset.assetId}`,
    scopeId: scope.scopeId,
    assetId: asset.assetId,
    status: asset.assetId === 'SB-LAB-004-EXTERNAL' ? 'EXCLUDED' : 'INCLUDED',
    responsibility: asset.assetId === 'SB-LAB-004-EXTERNAL' ? 'EXTERNAL COMPARISON ONLY' : 'ORBI SYNTHETIC LAB',
    notes: asset.assetId === 'SB-LAB-004-EXTERNAL'
      ? ['Must never be treated as part of PB-LAB-001 acceptance scope.']
      : [],
  }));

  snapshot.projects.push(project);
  snapshot.scopes.push(scope);
  snapshot.campaigns.push(campaign);
  snapshot.assets.push(...assets);
  snapshot.scopeAssets.push(...scopeAssets);

  return snapshot;
};
