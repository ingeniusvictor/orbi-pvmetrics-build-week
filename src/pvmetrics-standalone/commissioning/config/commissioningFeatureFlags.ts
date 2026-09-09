export type CommissioningFeatureVisibility = 'VISIBLE' | 'INTERNAL' | 'FEATURE_FLAG' | 'HIDDEN' | 'LEGACY';

export const COMMISSIONING_FEATURE_FLAGS = {
  workspaceEnabled: true,
  syntheticBaseLabEnabled: true,
  certificationScenarioEnabled: false,
  showInternalCertificationBadge: false,
} as const;

export const COMMISSIONING_VISIBILITY = {
  workspace: 'VISIBLE',
  syntheticBaseLab: 'FEATURE_FLAG',
  processedCertificationScenario: 'INTERNAL',
  internalGateBadges: 'HIDDEN',
} as const satisfies Record<string, CommissioningFeatureVisibility>;
