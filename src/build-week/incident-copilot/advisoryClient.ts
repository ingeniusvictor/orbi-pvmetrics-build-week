import type { IncidentScenario } from './domain';
import {
  ADVISORY_LIMITS,
  type AdvisoryRequestV1,
  type AdvisoryResponseV1,
} from './advisoryDomain';
import { validateAdvisoryResponse } from './advisoryValidation';

const ADVISORY_ENDPOINT = '/api/build-week/incident-advisory';

const statusMessage = (status: number): string => {
  if (status === 404 || status === 503) {
    return 'Optional GPT-5.6 advisory mode is unavailable. The deterministic assessment remains fully operational.';
  }
  if (status === 409) {
    return 'The deterministic assessment changed. Rerun it before requesting a new advisory.';
  }
  if (status === 429) {
    return 'The optional advisory service is temporarily rate limited. The deterministic assessment is unchanged.';
  }
  if (status === 504) {
    return 'The optional advisory request timed out. The deterministic assessment is unchanged.';
  }
  return 'The optional advisory could not be validated. The deterministic assessment remains authoritative.';
};

export const requestGptAdvisory = async (
  request: AdvisoryRequestV1,
  scenario: IncidentScenario,
  fetcher: typeof fetch = fetch,
): Promise<AdvisoryResponseV1> => {
  const body = JSON.stringify(request);
  if (new TextEncoder().encode(body).byteLength > ADVISORY_LIMITS.requestBytes) {
    throw new Error('Advisory request exceeds the local safety limit.');
  }

  let response: Response;
  try {
    response = await fetcher(ADVISORY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch {
    throw new Error(
      'Optional GPT-5.6 advisory mode is unavailable. The deterministic assessment remains fully operational.',
    );
  }

  if (!response.ok) throw new Error(statusMessage(response.status));

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('The optional advisory returned malformed data and was rejected.');
  }

  const validation = validateAdvisoryResponse(
    payload,
    scenario,
    request.assessmentId,
  );
  if (!validation.ok) {
    throw new Error('The optional advisory failed local safety validation and was rejected.');
  }
  return validation.value;
};
