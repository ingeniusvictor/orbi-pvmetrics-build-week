import type { DatasetReality } from '../../types/taxonomy';
import type { MetadataValue } from '../../types/common';

export type SyntheticAssetType =
  | 'utility-pv'
  | 'pmgd-pv'
  | 'distributed-pv'
  | 'bess'
  | 'hybrid-pv-bess';

export type SyntheticOperatingRegion =
  | 'northern-zone'
  | 'central-zone'
  | 'southern-zone'
  | 'synthetic-region';

export type PlantTechnologyProfile = {
  dcCapacityMw?: number;
  acCapacityMw?: number;
  inverterCount?: number;
  trackerType: 'fixed' | 'single-axis' | 'not-applicable' | 'synthetic';
  hasBess: boolean;
  bessPowerMw?: number;
  bessEnergyMwh?: number;
  telemetryProfile: 'complete' | 'partial' | 'degraded' | 'synthetic';
  syntheticVendorProfile: string;
  monitoringResolutionMinutes: number;
  expectedDataSources: string[];
  unavailableDataSources: string[];
  assumptions: string[];
  limitations: string[];
};

export type SyntheticPlant = {
  id: string;
  portfolioId: string;
  name: string;
  shortName: string;
  assetType: SyntheticAssetType;
  nominalCapacityMw: number;
  bessCapacityMwh?: number;
  operatingRegion: SyntheticOperatingRegion;
  countryCode: string;
  commissioningYear: number;
  status: 'operating' | 'monitoring' | 'demo';
  description: string;
  technologyProfile: PlantTechnologyProfile;
  caseIds: string[];
  datasetReality: Extract<DatasetReality, 'synthetic'>;
  disclosure: string;
  assumptions: string[];
  limitations: string[];
  metadata: Record<string, MetadataValue>;
};
