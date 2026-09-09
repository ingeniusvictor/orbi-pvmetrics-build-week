export type MappingVerificationStatus = 'UNVERIFIED' | 'SOURCE_CONFIRMED';

export type MappingSource = {
  sourceId: string;
  reference: string;
  revision?: string;
  sha256?: string;
  verificationStatus: MappingVerificationStatus;
};

export type AssetMappingEntry = {
  sourceAssetId: string;
  canonicalAssetId?: string;
  canonicalAssetType?: string;
  sourceId: string;
  verificationStatus: MappingVerificationStatus;
};

export type SignalMappingEntry = {
  sourceSignal: string;
  canonicalSignalKey?: string;
  sourceUnit?: string;
  canonicalUnit?: string;
  scale?: number;
  offset?: number;
  signMultiplier?: 1 | -1;
  sourceId: string;
  verificationStatus: MappingVerificationStatus;
};

export type ProjectMappingProfile = {
  profileId: string;
  projectId: string;
  scopeRevision: string;
  sources: MappingSource[];
  assets: AssetMappingEntry[];
  signals: SignalMappingEntry[];
};

export type ProjectMappingAssessment = {
  status: 'BLOCKED' | 'READY_FOR_MAPPING_REVIEW';
  blockers: string[];
  warnings: string[];
};

const nonEmpty = (value: string | undefined): boolean => Boolean(value?.trim());

export const assessProjectMappingProfile = (
  profile: ProjectMappingProfile,
): ProjectMappingAssessment => {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!nonEmpty(profile.profileId)) blockers.push('Mapping profile ID is required.');
  if (!nonEmpty(profile.projectId)) blockers.push('Project ID is required.');
  if (!nonEmpty(profile.scopeRevision)) blockers.push('Scope revision is required.');
  if (profile.sources.length === 0) blockers.push('At least one authoritative source is required.');

  const sourcesById = new Map(profile.sources.map((source) => [source.sourceId, source]));

  for (const source of profile.sources) {
    if (!nonEmpty(source.sourceId)) blockers.push('Every source requires a sourceId.');
    if (!nonEmpty(source.reference)) blockers.push(`Source '${source.sourceId || 'UNKNOWN'}' requires a traceable reference.`);
    if (source.verificationStatus === 'SOURCE_CONFIRMED' && !nonEmpty(source.reference)) {
      blockers.push(`Confirmed source '${source.sourceId || 'UNKNOWN'}' has no traceable reference.`);
    }
  }

  for (const asset of profile.assets) {
    const source = sourcesById.get(asset.sourceId);
    if (!source) {
      blockers.push(`Asset mapping '${asset.sourceAssetId || 'UNKNOWN'}' references unknown source '${asset.sourceId}'.`);
      continue;
    }
    if (!nonEmpty(asset.sourceAssetId)) blockers.push('Every asset mapping requires a sourceAssetId.');
    if (asset.verificationStatus === 'SOURCE_CONFIRMED') {
      if (source.verificationStatus !== 'SOURCE_CONFIRMED') {
        blockers.push(`Asset mapping '${asset.sourceAssetId}' cannot be confirmed from an unverified source.`);
      }
      if (!nonEmpty(asset.canonicalAssetId)) {
        blockers.push(`Confirmed asset mapping '${asset.sourceAssetId}' requires a canonicalAssetId.`);
      }
      if (!nonEmpty(asset.canonicalAssetType)) {
        warnings.push(`Confirmed asset mapping '${asset.sourceAssetId}' has no canonical asset type recorded.`);
      }
    } else {
      blockers.push(`Asset mapping '${asset.sourceAssetId || 'UNKNOWN'}' is still UNVERIFIED.`);
    }
  }

  for (const signal of profile.signals) {
    const source = sourcesById.get(signal.sourceId);
    if (!source) {
      blockers.push(`Signal mapping '${signal.sourceSignal || 'UNKNOWN'}' references unknown source '${signal.sourceId}'.`);
      continue;
    }
    if (!nonEmpty(signal.sourceSignal)) blockers.push('Every signal mapping requires a sourceSignal.');
    if (signal.verificationStatus === 'SOURCE_CONFIRMED') {
      if (source.verificationStatus !== 'SOURCE_CONFIRMED') {
        blockers.push(`Signal mapping '${signal.sourceSignal}' cannot be confirmed from an unverified source.`);
      }
      if (!nonEmpty(signal.canonicalSignalKey)) {
        blockers.push(`Confirmed signal mapping '${signal.sourceSignal}' requires a canonicalSignalKey.`);
      }
      if (!nonEmpty(signal.sourceUnit) || !nonEmpty(signal.canonicalUnit)) {
        warnings.push(`Signal mapping '${signal.sourceSignal}' has incomplete unit metadata and must not be silently converted.`);
      }
    } else {
      blockers.push(`Signal mapping '${signal.sourceSignal || 'UNKNOWN'}' is still UNVERIFIED.`);
    }
  }

  if (profile.assets.length === 0) warnings.push('No asset mappings are loaded yet.');
  if (profile.signals.length === 0) warnings.push('No signal mappings are loaded yet.');

  return {
    status: blockers.length === 0 ? 'READY_FOR_MAPPING_REVIEW' : 'BLOCKED',
    blockers,
    warnings,
  };
};

export const createEmptyProjectMappingProfile = (): ProjectMappingProfile => ({
  profileId: '',
  projectId: '',
  scopeRevision: '',
  sources: [],
  assets: [],
  signals: [],
});
