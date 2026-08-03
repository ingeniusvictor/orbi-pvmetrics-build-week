import { isValidIsoDate } from '../../validation/primitives';
import type { ClimateRecoveryLocale } from '../contracts/queryContracts';
import type { PresentationValue } from '../contracts/presentationModels';

export const formatIsoDate = (
  isoValue: string | undefined,
  locale: ClimateRecoveryLocale,
  timeZone = 'UTC',
  disclosure = 'Synthetic timestamp presentation; not operational history.',
): PresentationValue<string> => {
  if (!isoValue || !isValidIsoDate(isoValue)) {
    return {
      formattedValue: locale === 'es' ? 'No disponible' : 'Unavailable',
      availability: 'unavailable',
      origin: 'derived',
      datasetReality: 'synthetic',
      isEstimate: false,
      isProjection: false,
      isSynthetic: true,
      disclosure,
      limitations: ['A valid ISO 8601 timestamp with timezone was not available.'],
    };
  }
  return {
    value: isoValue,
    formattedValue: new Intl.DateTimeFormat(locale === 'es' ? 'es-CL' : 'en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    }).format(new Date(isoValue)),
    availability: 'available',
    origin: 'derived',
    datasetReality: 'synthetic',
    isEstimate: false,
    isProjection: false,
    isSynthetic: true,
    disclosure,
    limitations: [`Timestamp presented in ${timeZone}.`],
  };
};
