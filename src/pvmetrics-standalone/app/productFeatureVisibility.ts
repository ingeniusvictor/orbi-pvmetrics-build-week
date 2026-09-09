export type ProductFeatureVisibility = 'VISIBLE' | 'INTERNAL' | 'FEATURE_FLAG' | 'HIDDEN' | 'LEGACY';

export const PRODUCT_FEATURE_VISIBILITY = {
  commissioning: 'VISIBLE',
  climateRecovery: 'INTERNAL',
  incidentCopilot: 'LEGACY',
} as const satisfies Record<string, ProductFeatureVisibility>;

export const SHOW_INTERNAL_PRODUCT_SURFACES = false;

export const isProductNavVisible = (visibility: ProductFeatureVisibility): boolean =>
  visibility === 'VISIBLE' ||
  (SHOW_INTERNAL_PRODUCT_SURFACES && (visibility === 'INTERNAL' || visibility === 'FEATURE_FLAG'));
