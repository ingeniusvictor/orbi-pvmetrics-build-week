import type { IncidentAssessment, IncidentScenario } from './domain';
import type { SyntheticIncidentScenarioId } from './syntheticScenarios';

export const INCIDENT_ADVISORY_SCHEMA_VERSION = '1.0' as const;
export const GPT_ADVISORY_MODEL = 'gpt-5.6-sol' as const;
export const GPT_ADVISORY_PROVIDER_ID = 'openai-gpt-5.6-advisory' as const;
export const GPT_ADVISORY_TITLE = 'GPT-5.6 Advisory Interpretation' as const;
export const GPT_ADVISORY_ROLE = 'supplemental-advisory' as const;

export const ADVISORY_LIMITS = {
  requestBytes: 1_024,
  maxOutputTokens: 1_800,
  requestTimeoutMs: 30_000,
  advisorySummaryChars: 1_200,
  uncertaintyExplanationChars: 1_200,
  questionCount: 5,
  questionChars: 500,
  rationaleChars: 700,
  considerationCount: 5,
  considerationChars: 600,
  limitationCount: 5,
  limitationChars: 500,
  evidenceIdsPerItem: 8,
  idChars: 80,
} as const;

export type AdvisoryRequestV1 = {
  schemaVersion: typeof INCIDENT_ADVISORY_SCHEMA_VERSION;
  scenarioId: SyntheticIncidentScenarioId;
  assessmentId: string;
};

export type HumanReviewQuestionV1 = {
  id: string;
  question: string;
  rationale: string;
  evidenceIds: string[];
};

export type InvestigationConsiderationV1 = {
  id: string;
  consideration: string;
  rationale: string;
  evidenceIds: string[];
  requiresHumanApproval: true;
};

export type GptAdvisoryContentV1 = {
  schemaVersion: typeof INCIDENT_ADVISORY_SCHEMA_VERSION;
  advisorySummary: string;
  uncertaintyExplanation: string;
  humanReviewQuestions: HumanReviewQuestionV1[];
  investigationConsiderations: InvestigationConsiderationV1[];
  limitations: string[];
  safety: {
    advisoryOnly: true;
    humanApprovalRequired: true;
    noOperationalCommands: true;
  };
};

export type AdvisoryResponseV1 = {
  schemaVersion: typeof INCIDENT_ADVISORY_SCHEMA_VERSION;
  assessmentId: string;
  provider: {
    id: typeof GPT_ADVISORY_PROVIDER_ID;
    model: typeof GPT_ADVISORY_MODEL;
    role: typeof GPT_ADVISORY_ROLE;
  };
  advisory: GptAdvisoryContentV1;
};

export type IncidentAdvisoryProviderRequest = {
  scenario: IncidentScenario;
  assessment: IncidentAssessment;
};

export interface IncidentAdvisoryProvider {
  readonly id: typeof GPT_ADVISORY_PROVIDER_ID;
  readonly model: typeof GPT_ADVISORY_MODEL;
  readonly role: typeof GPT_ADVISORY_ROLE;
  generate(
    request: IncidentAdvisoryProviderRequest,
  ): Promise<AdvisoryResponseV1>;
}

export type AdvisoryTransportRequest = {
  instructions: string;
  input: string;
  responseSchema: Record<string, unknown>;
  timeoutMs: number;
  maxOutputTokens: number;
};

export type AdvisoryTransportResult = {
  status: 'completed' | 'incomplete' | 'failed';
  outputText: string;
  refused: boolean;
  responseModel: string;
};

export interface AdvisoryTransport {
  createStructuredAdvisory(
    request: AdvisoryTransportRequest,
  ): Promise<AdvisoryTransportResult>;
}

export type AdvisoryServiceErrorCode =
  | 'ADVISORY_INVALID_REQUEST'
  | 'ADVISORY_ASSESSMENT_MISMATCH'
  | 'ADVISORY_UNAVAILABLE'
  | 'ADVISORY_RATE_LIMITED'
  | 'ADVISORY_TIMEOUT'
  | 'ADVISORY_INVALID_RESPONSE'
  | 'ADVISORY_UPSTREAM_FAILED';

export class AdvisoryServiceError extends Error {
  readonly code: AdvisoryServiceErrorCode;
  readonly httpStatus: number;

  constructor(
    code: AdvisoryServiceErrorCode,
    safeMessage: string,
    httpStatus: number,
  ) {
    super(safeMessage);
    this.name = 'AdvisoryServiceError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export type AdvisoryErrorPayload = {
  error: {
    code: AdvisoryServiceErrorCode;
    message: string;
    deterministicModeAvailable: true;
  };
};

export const toAdvisoryErrorPayload = (
  error: AdvisoryServiceError,
): AdvisoryErrorPayload => ({
  error: {
    code: error.code,
    message: error.message,
    deterministicModeAvailable: true,
  },
});

export type IncidentAdvisoryState = {
  response: AdvisoryResponseV1 | null;
  assessmentId: string | null;
};

export const createIncidentAdvisoryState = (): IncidentAdvisoryState => ({
  response: null,
  assessmentId: null,
});

export const clearIncidentAdvisory = (): IncidentAdvisoryState =>
  createIncidentAdvisoryState();

export const recordIncidentAdvisory = (
  response: AdvisoryResponseV1,
): IncidentAdvisoryState => ({
  response,
  assessmentId: response.assessmentId,
});
