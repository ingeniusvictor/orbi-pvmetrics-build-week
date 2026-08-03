import type { PresentationStatusToken } from '../contracts/presentationModels';

export const presentStatus = (status: string): PresentationStatusToken => {
  if (['critical'].includes(status)) return 'critical';
  if (['invalid', 'blocked', 'confirmed-overlap'].includes(status)) return 'blocked';
  if (['unavailable', 'insufficient', 'not-assessed'].includes(status)) return 'unavailable';
  if (['high', 'warning', 'possible-overlap'].includes(status)) return 'warning';
  if (['medium', 'partial', 'partially-sufficient', 'pending', 'needs-more-data'].includes(status)) return 'caution';
  if (['complete', 'available', 'sufficient', 'recoverable', 'accepted', 'verified'].includes(status)) return 'positive';
  if (['low', 'informational'].includes(status)) return 'informative';
  return 'neutral';
};
