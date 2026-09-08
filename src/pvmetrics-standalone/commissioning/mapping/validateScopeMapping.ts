import type { CommissioningAsset, ScopeAsset } from '../contracts';

export type ScopeMappingIssue = {
  code:
    | 'ASSET_NOT_FOUND'
    | 'DUPLICATE_SCOPE_ASSET'
    | 'PARENT_NOT_FOUND'
    | 'INCLUDED_CHILD_OF_EXCLUDED_PARENT';
  severity: 'WARNING' | 'ERROR';
  assetId: string;
  message: string;
};

export type ScopeMappingValidationResult = {
  valid: boolean;
  includedCount: number;
  partialCount: number;
  excludedCount: number;
  pendingCount: number;
  thirdPartyCount: number;
  issues: ScopeMappingIssue[];
};

export const validateScopeMapping = (
  assets: CommissioningAsset[],
  scopeAssets: ScopeAsset[],
): ScopeMappingValidationResult => {
  const issues: ScopeMappingIssue[] = [];
  const assetById = new Map(assets.map((asset) => [asset.assetId, asset]));
  const scopeAssetByAssetId = new Map<string, ScopeAsset>();

  for (const scopeAsset of scopeAssets) {
    if (!assetById.has(scopeAsset.assetId)) {
      issues.push({
        code: 'ASSET_NOT_FOUND',
        severity: 'ERROR',
        assetId: scopeAsset.assetId,
        message: `Scope mapping references unknown asset ${scopeAsset.assetId}.`,
      });
    }

    if (scopeAssetByAssetId.has(scopeAsset.assetId)) {
      issues.push({
        code: 'DUPLICATE_SCOPE_ASSET',
        severity: 'ERROR',
        assetId: scopeAsset.assetId,
        message: `Asset ${scopeAsset.assetId} appears more than once in the same scope mapping set.`,
      });
    } else {
      scopeAssetByAssetId.set(scopeAsset.assetId, scopeAsset);
    }
  }

  for (const asset of assets) {
    if (asset.parentAssetId && !assetById.has(asset.parentAssetId)) {
      issues.push({
        code: 'PARENT_NOT_FOUND',
        severity: 'ERROR',
        assetId: asset.assetId,
        message: `Asset ${asset.assetId} references missing parent ${asset.parentAssetId}.`,
      });
      continue;
    }

    if (!asset.parentAssetId) continue;
    const ownMapping = scopeAssetByAssetId.get(asset.assetId);
    const parentMapping = scopeAssetByAssetId.get(asset.parentAssetId);

    if (
      ownMapping?.status === 'INCLUDED' &&
      parentMapping?.status === 'EXCLUDED'
    ) {
      issues.push({
        code: 'INCLUDED_CHILD_OF_EXCLUDED_PARENT',
        severity: 'ERROR',
        assetId: asset.assetId,
        message: `Included asset ${asset.assetId} cannot inherit from excluded parent ${asset.parentAssetId} without an explicit scope revision.`,
      });
    }
  }

  const count = (status: ScopeAsset['status']) =>
    scopeAssets.filter((scopeAsset) => scopeAsset.status === status).length;

  return {
    valid: !issues.some((issue) => issue.severity === 'ERROR'),
    includedCount: count('INCLUDED'),
    partialCount: count('PARTIAL'),
    excludedCount: count('EXCLUDED'),
    pendingCount: count('PENDING_CONFIRMATION'),
    thirdPartyCount: count('THIRD_PARTY'),
    issues,
  };
};
