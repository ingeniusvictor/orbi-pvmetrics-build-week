import type { IncidentScenario, ValidationIssue, ValidationResult } from './domain';
import { findForbiddenOperationalLanguage } from './validation';
import {
  ADVISORY_LIMITS,
  GPT_ADVISORY_MODEL,
  GPT_ADVISORY_PROVIDER_ID,
  GPT_ADVISORY_ROLE,
  type AdvisoryRequestV1,
  type AdvisoryResponseV1,
  type GptAdvisoryContentV1,
} from './advisoryDomain';
import {
  SYNTHETIC_INCIDENT_SCENARIOS,
  type SyntheticIncidentScenarioId,
} from './syntheticScenarios';

const scenarioIds = new Set<string>(
  SYNTHETIC_INCIDENT_SCENARIOS.map((scenario) => scenario.id),
);

const definitiveRootCausePattern =
  /\b(?:the\s+)?(?:root\s+)?cause\s+(?:is|was|has been confirmed as)\s+(?!not\b|unknown\b|unconfirmed\b)|\b(?:the\s+)?(?:incident|event|underperformance|derating|mismatch|outage|loss)\s+(?:is|was)\s+caused by\b|\b(?:definitive|definitively|conclusive|conclusively|confirmed)\s+(?:root cause|cause|caused by)\b/i;

const additionalOperationalPattern =
  /\bswitch(?:ing)?\b|\bbreaker\b|\bset\s*point\b|\b(?:ack|acknowledge|acknowledgement|acknowledgment)\b|\bremote[- ]control\b|\bscada[- ]control\b|\btelecontrol\b/i;

const providerApprovalPattern =
  /\b(?:i|we|the model|the provider|the advisory|gpt(?:-5\.6)?)\s+(?:approve|approves|approved|reject|rejects|rejected|request changes|requests changes)\b|\b(?:review state|pending-review|changes-requested|approved by the model|rejected by the model)\b/i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const addIssue = (
  issues: ValidationIssue[],
  path: string,
  code: string,
  message: string,
) => issues.push({ path, code, message });

const hasExactKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length &&
    actual.every((key, index) => key === expected[index]);
};

const validateBoundedString = (
  value: unknown,
  path: string,
  maxLength: number,
  issues: ValidationIssue[],
) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    addIssue(issues, path, 'required-string', 'A non-empty string is required.');
    return;
  }
  if (value.length > maxLength) {
    addIssue(issues, path, 'string-too-long', `Text exceeds ${maxLength} characters.`);
  }
};

const validateGeneratedTextSafety = (
  value: string,
  path: string,
  issues: ValidationIssue[],
) => {
  if (findForbiddenOperationalLanguage(value).length > 0) {
    addIssue(issues, path, 'operational-command-language', 'Operational command language is forbidden.');
  }
  if (additionalOperationalPattern.test(value)) {
    addIssue(issues, path, 'operational-control-language', 'Switching, setpoint, ACK, SCADA, remote-control, or telecontrol language is forbidden.');
  }
  if (definitiveRootCausePattern.test(value)) {
    addIssue(issues, path, 'definitive-root-cause', 'The advisory cannot declare a definitive root cause.');
  }
  if (providerApprovalPattern.test(value)) {
    addIssue(issues, path, 'provider-approval-language', 'The advisory cannot approve, reject, or set review state.');
  }
};

const collectGeneratedStrings = (value: unknown): Array<{ path: string; value: string }> => {
  const strings: Array<{ path: string; value: string }> = [];
  const visit = (item: unknown, path: string) => {
    if (typeof item === 'string') {
      strings.push({ path, value: item });
      return;
    }
    if (Array.isArray(item)) {
      item.forEach((child, index) => visit(child, `${path}[${index}]`));
      return;
    }
    if (isRecord(item)) {
      Object.entries(item).forEach(([key, child]) => visit(child, `${path}.${key}`));
    }
  };
  visit(value, '$');
  return strings;
};

export const GPT_ADVISORY_CONTENT_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    schemaVersion: { type: 'string', enum: ['1.0'] },
    advisorySummary: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.advisorySummaryChars },
    uncertaintyExplanation: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.uncertaintyExplanationChars },
    humanReviewQuestions: {
      type: 'array',
      minItems: 1,
      maxItems: ADVISORY_LIMITS.questionCount,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.idChars },
          question: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.questionChars },
          rationale: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.rationaleChars },
          evidenceIds: {
            type: 'array',
            minItems: 1,
            maxItems: ADVISORY_LIMITS.evidenceIdsPerItem,
            items: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.idChars },
          },
        },
        required: ['id', 'question', 'rationale', 'evidenceIds'],
      },
    },
    investigationConsiderations: {
      type: 'array',
      minItems: 1,
      maxItems: ADVISORY_LIMITS.considerationCount,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.idChars },
          consideration: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.considerationChars },
          rationale: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.rationaleChars },
          evidenceIds: {
            type: 'array',
            minItems: 1,
            maxItems: ADVISORY_LIMITS.evidenceIdsPerItem,
            items: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.idChars },
          },
          requiresHumanApproval: { type: 'boolean', const: true },
        },
        required: ['id', 'consideration', 'rationale', 'evidenceIds', 'requiresHumanApproval'],
      },
    },
    limitations: {
      type: 'array',
      minItems: 1,
      maxItems: ADVISORY_LIMITS.limitationCount,
      items: { type: 'string', minLength: 1, maxLength: ADVISORY_LIMITS.limitationChars },
    },
    safety: {
      type: 'object',
      additionalProperties: false,
      properties: {
        advisoryOnly: { type: 'boolean', const: true },
        humanApprovalRequired: { type: 'boolean', const: true },
        noOperationalCommands: { type: 'boolean', const: true },
      },
      required: ['advisoryOnly', 'humanApprovalRequired', 'noOperationalCommands'],
    },
  },
  required: [
    'schemaVersion',
    'advisorySummary',
    'uncertaintyExplanation',
    'humanReviewQuestions',
    'investigationConsiderations',
    'limitations',
    'safety',
  ],
};

export const isSyntheticIncidentScenarioId = (
  value: unknown,
): value is SyntheticIncidentScenarioId =>
  typeof value === 'string' && scenarioIds.has(value);

export const validateAdvisoryRequest = (
  input: unknown,
): ValidationResult<AdvisoryRequestV1> => {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [{ path: '$', code: 'invalid-type', message: 'Advisory request must be an object.' }],
    };
  }
  if (!hasExactKeys(input, ['schemaVersion', 'scenarioId', 'assessmentId'])) {
    addIssue(issues, '$', 'unexpected-properties', 'Only schemaVersion, scenarioId, and assessmentId are accepted.');
  }
  if (input.schemaVersion !== '1.0') {
    addIssue(issues, 'schemaVersion', 'unsupported-version', 'Only advisory request schema 1.0 is supported.');
  }
  if (!isSyntheticIncidentScenarioId(input.scenarioId)) {
    addIssue(issues, 'scenarioId', 'unknown-scenario', 'Scenario must be one of the four fixed synthetic scenarios.');
  }
  validateBoundedString(input.assessmentId, 'assessmentId', 240, issues);
  return issues.length > 0
    ? { ok: false, issues }
    : { ok: true, value: input as AdvisoryRequestV1 };
};

const validateEvidenceIds = (
  value: unknown,
  path: string,
  validEvidenceIds: Set<string>,
  issues: ValidationIssue[],
) => {
  if (!Array.isArray(value) || value.length < 1 || value.length > ADVISORY_LIMITS.evidenceIdsPerItem) {
    addIssue(issues, path, 'invalid-evidence-list', 'One to eight evidence IDs are required.');
    return;
  }
  const seen = new Set<string>();
  value.forEach((evidenceId, index) => {
    if (typeof evidenceId !== 'string' || !validEvidenceIds.has(evidenceId)) {
      addIssue(issues, `${path}[${index}]`, 'unknown-evidence', `Unknown evidence reference: ${String(evidenceId)}`);
    } else if (seen.has(evidenceId)) {
      addIssue(issues, `${path}[${index}]`, 'duplicate-evidence', `Duplicate evidence reference: ${evidenceId}`);
    }
    if (typeof evidenceId === 'string') seen.add(evidenceId);
  });
};

export const validateGptAdvisoryContent = (
  input: unknown,
  scenario: IncidentScenario,
): ValidationResult<GptAdvisoryContentV1> => {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [{ path: '$', code: 'invalid-type', message: 'Advisory content must be an object.' }],
    };
  }
  if (!hasExactKeys(input, [
    'schemaVersion',
    'advisorySummary',
    'uncertaintyExplanation',
    'humanReviewQuestions',
    'investigationConsiderations',
    'limitations',
    'safety',
  ])) {
    addIssue(issues, '$', 'unexpected-properties', 'Advisory content contains missing or additional properties.');
  }
  if (input.schemaVersion !== '1.0') {
    addIssue(issues, 'schemaVersion', 'unsupported-version', 'Only advisory schema 1.0 is supported.');
  }
  validateBoundedString(input.advisorySummary, 'advisorySummary', ADVISORY_LIMITS.advisorySummaryChars, issues);
  validateBoundedString(input.uncertaintyExplanation, 'uncertaintyExplanation', ADVISORY_LIMITS.uncertaintyExplanationChars, issues);
  const evidenceIds = new Set(scenario.observations.map((observation) => observation.id));

  if (!Array.isArray(input.humanReviewQuestions) || input.humanReviewQuestions.length < 1 || input.humanReviewQuestions.length > ADVISORY_LIMITS.questionCount) {
    addIssue(issues, 'humanReviewQuestions', 'invalid-array-size', 'One to five human-review questions are required.');
  } else {
    input.humanReviewQuestions.forEach((item, index) => {
      const path = `humanReviewQuestions[${index}]`;
      if (!isRecord(item) || !hasExactKeys(item, ['id', 'question', 'rationale', 'evidenceIds'])) {
        addIssue(issues, path, 'invalid-item', 'Question must contain only id, question, rationale, and evidenceIds.');
        return;
      }
      validateBoundedString(item.id, `${path}.id`, ADVISORY_LIMITS.idChars, issues);
      validateBoundedString(item.question, `${path}.question`, ADVISORY_LIMITS.questionChars, issues);
      validateBoundedString(item.rationale, `${path}.rationale`, ADVISORY_LIMITS.rationaleChars, issues);
      validateEvidenceIds(item.evidenceIds, `${path}.evidenceIds`, evidenceIds, issues);
    });
  }

  if (!Array.isArray(input.investigationConsiderations) || input.investigationConsiderations.length < 1 || input.investigationConsiderations.length > ADVISORY_LIMITS.considerationCount) {
    addIssue(issues, 'investigationConsiderations', 'invalid-array-size', 'One to five investigation considerations are required.');
  } else {
    input.investigationConsiderations.forEach((item, index) => {
      const path = `investigationConsiderations[${index}]`;
      if (!isRecord(item) || !hasExactKeys(item, ['id', 'consideration', 'rationale', 'evidenceIds', 'requiresHumanApproval'])) {
        addIssue(issues, path, 'invalid-item', 'Consideration contains missing or additional properties.');
        return;
      }
      validateBoundedString(item.id, `${path}.id`, ADVISORY_LIMITS.idChars, issues);
      validateBoundedString(item.consideration, `${path}.consideration`, ADVISORY_LIMITS.considerationChars, issues);
      validateBoundedString(item.rationale, `${path}.rationale`, ADVISORY_LIMITS.rationaleChars, issues);
      validateEvidenceIds(item.evidenceIds, `${path}.evidenceIds`, evidenceIds, issues);
      if (item.requiresHumanApproval !== true) {
        addIssue(issues, `${path}.requiresHumanApproval`, 'human-approval-required', 'Human approval must be exactly true.');
      }
    });
  }

  if (!Array.isArray(input.limitations) || input.limitations.length < 1 || input.limitations.length > ADVISORY_LIMITS.limitationCount) {
    addIssue(issues, 'limitations', 'invalid-array-size', 'One to five limitations are required.');
  } else {
    input.limitations.forEach((limitation, index) =>
      validateBoundedString(limitation, `limitations[${index}]`, ADVISORY_LIMITS.limitationChars, issues));
  }

  if (!isRecord(input.safety) || !hasExactKeys(input.safety, ['advisoryOnly', 'humanApprovalRequired', 'noOperationalCommands'])) {
    addIssue(issues, 'safety', 'invalid-safety-flags', 'All exact safety flags are required.');
  } else {
    if (input.safety.advisoryOnly !== true) addIssue(issues, 'safety.advisoryOnly', 'invalid-safety-flag', 'advisoryOnly must be true.');
    if (input.safety.humanApprovalRequired !== true) addIssue(issues, 'safety.humanApprovalRequired', 'invalid-safety-flag', 'humanApprovalRequired must be true.');
    if (input.safety.noOperationalCommands !== true) addIssue(issues, 'safety.noOperationalCommands', 'invalid-safety-flag', 'noOperationalCommands must be true.');
  }

  collectGeneratedStrings(input).forEach(({ path, value }) =>
    validateGeneratedTextSafety(value, path, issues));

  return issues.length > 0
    ? { ok: false, issues }
    : { ok: true, value: input as GptAdvisoryContentV1 };
};

export const validateAdvisoryResponse = (
  input: unknown,
  scenario: IncidentScenario,
  expectedAssessmentId: string,
): ValidationResult<AdvisoryResponseV1> => {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [{ path: '$', code: 'invalid-type', message: 'Advisory response must be an object.' }],
    };
  }
  if (!hasExactKeys(input, ['schemaVersion', 'assessmentId', 'provider', 'advisory'])) {
    addIssue(issues, '$', 'unexpected-properties', 'Advisory response contains missing or additional properties.');
  }
  if (input.schemaVersion !== '1.0') addIssue(issues, 'schemaVersion', 'unsupported-version', 'Only advisory response schema 1.0 is supported.');
  if (input.assessmentId !== expectedAssessmentId) addIssue(issues, 'assessmentId', 'assessment-mismatch', 'Advisory response must match the deterministic assessment.');
  if (!isRecord(input.provider) || !hasExactKeys(input.provider, ['id', 'model', 'role'])) {
    addIssue(issues, 'provider', 'invalid-provider', 'Exact provider metadata is required.');
  } else {
    if (input.provider.id !== GPT_ADVISORY_PROVIDER_ID) addIssue(issues, 'provider.id', 'invalid-provider', 'Unexpected advisory provider.');
    if (input.provider.model !== GPT_ADVISORY_MODEL) addIssue(issues, 'provider.model', 'invalid-model', 'Unexpected advisory model.');
    if (input.provider.role !== GPT_ADVISORY_ROLE) addIssue(issues, 'provider.role', 'invalid-role', 'Unexpected advisory role.');
  }
  const advisoryValidation = validateGptAdvisoryContent(input.advisory, scenario);
  if (advisoryValidation.ok === false) {
    issues.push(...advisoryValidation.issues.map((issue) => ({
      ...issue,
      path: `advisory.${issue.path}`,
    })));
  }
  return issues.length > 0
    ? { ok: false, issues }
    : { ok: true, value: input as AdvisoryResponseV1 };
};
