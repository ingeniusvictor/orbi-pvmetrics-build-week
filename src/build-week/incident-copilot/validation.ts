import {
  IncidentAssessment,
  IncidentObservation,
  IncidentScenario,
  ValidationIssue,
  ValidationResult,
} from './domain';

const evidenceKinds = new Set([
  'telemetry',
  'alarm',
  'maintenance-note',
  'weather',
  'data-quality',
]);
const evidenceQualities = new Set(['valid', 'suspect', 'stale', 'missing']);
const assetKinds = new Set(['pv', 'bess', 'hybrid']);
const knownUnits = new Set([
  'MW',
  'MWh',
  '%',
  'W/m2',
  'A',
  'C',
  'minutes',
  'state',
  'boolean',
]);

const operationalCommandPattern =
  /\b(setpoint|telecontrol|remote control|switching command|dispatch command|scada ack|acknowledge alarm|open breaker|close breaker)\b|\b(abrir|cerrar)\s+(interruptor|seccionador)|\bcambiar\s+setpoint\b/i;

const sensitiveContentPattern =
  /sk-(?:proj|svcacct)-[A-Za-z0-9_-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)\d{1,3}\.\d{1,3}\b|https?:\/\//i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isIsoTimestamp = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value));

const addIssue = (
  issues: ValidationIssue[],
  path: string,
  code: string,
  message: string,
) => issues.push({ path, code, message });

const validateObservation = (
  value: unknown,
  index: number,
  issues: ValidationIssue[],
): value is IncidentObservation => {
  const path = `observations[${index}]`;
  if (!isRecord(value)) {
    addIssue(issues, path, 'invalid-type', 'Observation must be an object.');
    return false;
  }

  for (const field of ['id', 'assetId', 'signal', 'unit', 'statement']) {
    if (typeof value[field] !== 'string' || value[field].length === 0) {
      addIssue(issues, `${path}.${field}`, 'required-string', `${field} is required.`);
    }
  }
  if (!isIsoTimestamp(value.observedAt)) {
    addIssue(issues, `${path}.observedAt`, 'invalid-timestamp', 'A fixed ISO timestamp is required.');
  }
  if (!evidenceKinds.has(String(value.kind))) {
    addIssue(issues, `${path}.kind`, 'invalid-enum', 'Unknown evidence kind.');
  }
  if (!evidenceQualities.has(String(value.quality))) {
    addIssue(issues, `${path}.quality`, 'invalid-enum', 'Unknown evidence quality.');
  }
  if (!knownUnits.has(String(value.unit))) {
    addIssue(issues, `${path}.unit`, 'unknown-unit', 'Unit is not allowed by the synthetic scenario schema.');
  }
  if (value.quality === 'missing' && value.value !== null) {
    addIssue(issues, `${path}.value`, 'missing-value-present', 'Missing evidence must use a null value.');
  }
  if (value.quality !== 'missing' && value.value === null) {
    addIssue(issues, `${path}.value`, 'unexpected-null', 'Available evidence cannot use a null value.');
  }

  if (!isRecord(value.source)) {
    addIssue(issues, `${path}.source`, 'invalid-source', 'A synthetic read-only source is required.');
  } else {
    if (value.source.provenance !== 'synthetic') {
      addIssue(issues, `${path}.source.provenance`, 'synthetic-only', 'Only synthetic evidence is accepted.');
    }
    if (value.source.access !== 'read-only') {
      addIssue(issues, `${path}.source.access`, 'read-only-only', 'Evidence sources must be read-only.');
    }
    if (
      typeof value.source.id !== 'string' ||
      !value.source.id.startsWith('DEMO-')
    ) {
      addIssue(issues, `${path}.source.id`, 'fictional-id-required', 'Source IDs must use the DEMO- prefix.');
    }
    if (typeof value.source.label !== 'string' || value.source.label.length === 0) {
      addIssue(issues, `${path}.source.label`, 'required-string', 'Source label is required.');
    }
  }

  if (typeof value.assetId !== 'string' || !value.assetId.startsWith('DEMO-')) {
    addIssue(issues, `${path}.assetId`, 'fictional-id-required', 'Asset IDs must use the DEMO- prefix.');
  }

  if (sensitiveContentPattern.test(JSON.stringify(value))) {
    addIssue(issues, path, 'sensitive-content', 'Evidence contains a forbidden endpoint, private-network address, key, or private key.');
  }
  return true;
};
export const validateIncidentScenario = (
  input: unknown,
): ValidationResult<IncidentScenario> => {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [{ path: '$', code: 'invalid-type', message: 'Scenario must be an object.' }],
    };
  }

  if (input.schemaVersion !== '1.0') {
    addIssue(issues, 'schemaVersion', 'unsupported-version', 'Only scenario schema 1.0 is supported.');
  }
  if (input.synthetic !== true) {
    addIssue(issues, 'synthetic', 'synthetic-only', 'Scenario must be explicitly synthetic.');
  }
  for (const field of ['id', 'title', 'description']) {
    if (typeof input[field] !== 'string' || input[field].length === 0) {
      addIssue(issues, field, 'required-string', `${field} is required.`);
    }
  }
  if (!isIsoTimestamp(input.analysisAsOf)) {
    addIssue(issues, 'analysisAsOf', 'invalid-timestamp', 'A fixed analysis timestamp is required.');
  }

  if (!isRecord(input.asset)) {
    addIssue(issues, 'asset', 'invalid-asset', 'Asset profile is required.');
  } else {
    if (typeof input.asset.id !== 'string' || !input.asset.id.startsWith('DEMO-')) {
      addIssue(issues, 'asset.id', 'fictional-id-required', 'Asset ID must use the DEMO- prefix.');
    }
    if (typeof input.asset.label !== 'string' || input.asset.label.length === 0) {
      addIssue(issues, 'asset.label', 'required-string', 'Asset label is required.');
    }
    if (!assetKinds.has(String(input.asset.kind))) {
      addIssue(issues, 'asset.kind', 'invalid-enum', 'Unknown asset kind.');
    }
    if (!isFiniteNumber(input.asset.capacityMw) || input.asset.capacityMw <= 0 || input.asset.capacityMw > 500) {
      addIssue(issues, 'asset.capacityMw', 'out-of-range', 'Synthetic capacity must be greater than 0 and at most 500 MW.');
    }
    if (
      input.asset.kind === 'pv' &&
      input.asset.bessCapacityMwh !== null
    ) {
      addIssue(issues, 'asset.bessCapacityMwh', 'asset-domain-mismatch', 'PV-only scenarios cannot include BESS capacity.');
    }
    if (
      (input.asset.kind === 'bess' || input.asset.kind === 'hybrid') &&
      (!isFiniteNumber(input.asset.bessCapacityMwh) || input.asset.bessCapacityMwh <= 0)
    ) {
      addIssue(issues, 'asset.bessCapacityMwh', 'out-of-range', 'BESS and hybrid scenarios require positive synthetic energy capacity.');
    }
  }

  if (!isRecord(input.window)) {
    addIssue(issues, 'window', 'invalid-window', 'Incident window is required.');
  } else {
    if (!isIsoTimestamp(input.window.start)) {
      addIssue(issues, 'window.start', 'invalid-timestamp', 'Window start must be an ISO timestamp.');
    }
    if (!isIsoTimestamp(input.window.end)) {
      addIssue(issues, 'window.end', 'invalid-timestamp', 'Window end must be an ISO timestamp.');
    }
    if (
      isIsoTimestamp(input.window.start) &&
      isIsoTimestamp(input.window.end) &&
      Date.parse(input.window.end) <= Date.parse(input.window.start)
    ) {
      addIssue(issues, 'window', 'invalid-order', 'Window end must be after window start.');
    }
  }

  if (!Array.isArray(input.observations) || input.observations.length === 0) {
    addIssue(issues, 'observations', 'required-array', 'At least one raw observation is required.');
  } else {
    input.observations.forEach((item, index) => validateObservation(item, index, issues));
    const ids = input.observations
      .filter(isRecord)
      .map((item) => item.id)
      .filter((id): id is string => typeof id === 'string');
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    for (const id of new Set(duplicateIds)) {
      addIssue(issues, 'observations', 'duplicate-id', `Duplicate observation ID: ${id}`);
    }
  }

  if (sensitiveContentPattern.test(JSON.stringify(input))) {
    addIssue(issues, '$', 'sensitive-content', 'Scenario contains forbidden sensitive or network content.');
  }

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, value: input as IncidentScenario };
};

export const findForbiddenOperationalLanguage = (text: string): string[] => {
  const match = text.match(operationalCommandPattern);
  return match ? [match[0]] : [];
};

const validateEvidenceReferences = (
  references: unknown,
  path: string,
  evidenceIds: Set<string>,
  issues: ValidationIssue[],
) => {
  if (!Array.isArray(references)) {
    addIssue(issues, path, 'required-array', 'Evidence references must be an array.');
    return;
  }
  for (const [index, reference] of references.entries()) {
    if (typeof reference !== 'string' || !evidenceIds.has(reference)) {
      addIssue(issues, `${path}[${index}]`, 'unknown-evidence', `Unknown evidence reference: ${String(reference)}`);
    }
  }
};

export const validateIncidentAssessment = (
  input: unknown,
  scenario: IncidentScenario,
): ValidationResult<IncidentAssessment> => {
  const issues: ValidationIssue[] = [];
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [{ path: '$', code: 'invalid-type', message: 'Assessment must be an object.' }],
    };
  }

  const evidenceIds = new Set(scenario.observations.map((item) => item.id));
  if (input.schemaVersion !== '1.0') {
    addIssue(issues, 'schemaVersion', 'unsupported-version', 'Only assessment schema 1.0 is supported.');
  }
  if (input.scenarioId !== scenario.id) {
    addIssue(issues, 'scenarioId', 'scenario-mismatch', 'Assessment must reference the analyzed scenario.');
  }
  if (!isRecord(input.provider) || input.provider.id !== 'deterministic-local-evidence-engine') {
    addIssue(issues, 'provider', 'invalid-provider', 'Only the deterministic local provider is enabled.');
  }

  if (!isRecord(input.priorityIncident)) {
    addIssue(issues, 'priorityIncident', 'required-object', 'Priority incident is required.');
  } else {
    validateEvidenceReferences(input.priorityIncident.evidenceIds, 'priorityIncident.evidenceIds', evidenceIds, issues);
  }

  if (!Array.isArray(input.confirmedFacts)) {
    addIssue(issues, 'confirmedFacts', 'required-array', 'Confirmed facts are required.');
  } else {
    input.confirmedFacts.forEach((fact, index) => {
      if (!isRecord(fact) || fact.classification !== 'confirmed-fact') {
        addIssue(issues, `confirmedFacts[${index}]`, 'fact-classification', 'Confirmed facts cannot contain hypotheses.');
        return;
      }
      validateEvidenceReferences(fact.evidenceIds, `confirmedFacts[${index}].evidenceIds`, evidenceIds, issues);
    });
  }

  if (!Array.isArray(input.hypotheses)) {
    addIssue(issues, 'hypotheses', 'required-array', 'Technical hypotheses are required.');
  } else {
    input.hypotheses.forEach((hypothesis, index) => {
      if (
        !isRecord(hypothesis) ||
        hypothesis.classification !== 'technical-hypothesis' ||
        hypothesis.rootCauseStatus !== 'unconfirmed'
      ) {
        addIssue(issues, `hypotheses[${index}]`, 'hypothesis-classification', 'Hypotheses must remain explicitly unconfirmed.');
        return;
      }
      validateEvidenceReferences(hypothesis.supportingEvidenceIds, `hypotheses[${index}].supportingEvidenceIds`, evidenceIds, issues);
      validateEvidenceReferences(hypothesis.conflictingEvidenceIds, `hypotheses[${index}].conflictingEvidenceIds`, evidenceIds, issues);
    });
  }

  for (const field of [
    'conflictingEvidence',
    'missingInformation',
    'verificationSteps',
    'advisoryActions',
  ]) {
    if (!Array.isArray(input[field])) {
      addIssue(issues, field, 'required-array', `${field} is required.`);
    }
  }

  if (Array.isArray(input.verificationSteps)) {
    const orders = input.verificationSteps.map((step) =>
      isRecord(step) ? step.order : null,
    );
    orders.forEach((order, index) => {
      if (order !== index + 1) {
        addIssue(issues, `verificationSteps[${index}].order`, 'invalid-order', 'Verification steps must be consecutively ordered.');
      }
    });
  }

  if (Array.isArray(input.advisoryActions)) {
    input.advisoryActions.forEach((action, index) => {
      if (!isRecord(action) || action.requiresHumanApproval !== true) {
        addIssue(issues, `advisoryActions[${index}].requiresHumanApproval`, 'human-approval-required', 'Every advisory action requires human approval.');
      }
      if (isRecord(action) && typeof action.action === 'string') {
        const forbidden = findForbiddenOperationalLanguage(action.action);
        if (forbidden.length > 0) {
          addIssue(issues, `advisoryActions[${index}].action`, 'operational-command-language', `Forbidden operational command language: ${forbidden.join(', ')}`);
        }
      }
    });
  }

  if (Array.isArray(input.verificationSteps)) {
    input.verificationSteps.forEach((step, index) => {
      if (isRecord(step) && typeof step.action === 'string') {
        const forbidden = findForbiddenOperationalLanguage(step.action);
        if (forbidden.length > 0) {
          addIssue(issues, `verificationSteps[${index}].action`, 'operational-command-language', `Forbidden operational command language: ${forbidden.join(', ')}`);
        }
      }
    });
  }

  if (!isRecord(input.risk) || !isRecord(input.risk.energy)) {
    addIssue(issues, 'risk', 'required-object', 'Energy and operational risk are required.');
  } else if (input.risk.energy.quantification === 'bounded') {
    const low = input.risk.energy.lowMwh;
    const likely = input.risk.energy.likelyMwh;
    const high = input.risk.energy.highMwh;
    if (
      !isFiniteNumber(low) ||
      !isFiniteNumber(likely) ||
      !isFiniteNumber(high) ||
      low < 0 ||
      low > likely ||
      likely > high
    ) {
      addIssue(issues, 'risk.energy', 'invalid-bounds', 'Energy-risk bounds must be finite, non-negative, and ordered low <= likely <= high.');
    }
  }

  if (!isRecord(input.confidence) || !isFiniteNumber(input.confidence.score) || input.confidence.score < 0 || input.confidence.score > 100) {
    addIssue(issues, 'confidence.score', 'out-of-range', 'Confidence score must be between 0 and 100.');
  }
  if (!isRecord(input.review) || input.review.state !== 'pending-review' || input.review.authority !== 'human-only') {
    addIssue(issues, 'review', 'provider-cannot-approve', 'Provider output must begin pending human review.');
  }
  if (typeof input.executiveSummary !== 'string' || input.executiveSummary.length === 0) {
    addIssue(issues, 'executiveSummary', 'required-string', 'Executive summary is required.');
  }

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, value: input as IncidentAssessment };
};
