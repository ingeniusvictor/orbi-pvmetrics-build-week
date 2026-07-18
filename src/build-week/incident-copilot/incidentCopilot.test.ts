import assert from 'node:assert/strict';
import test from 'node:test';
import { IncidentAssessment, IncidentCandidate, IncidentScenario } from './domain';
import { EXPECTED_SCENARIO_ORACLES } from './expectedScenarioOracles';
import {
  deterministicIncidentAnalysisProvider,
  RUNTIME_ANALYSIS_PROVIDER,
} from './providers';
import {
  analyzeIncidentDeterministically,
  rankIncidentCandidates,
} from './reasoningEngine';
import {
  applyHumanReview,
  createIncidentCopilotSession,
  recordIncidentAnalysis,
  selectIncidentScenario,
} from './reviewWorkflow';
import {
  getSyntheticScenario,
  SYNTHETIC_INCIDENT_SCENARIOS,
} from './syntheticScenarios';
import {
  findForbiddenOperationalLanguage,
  validateIncidentAssessment,
  validateIncidentScenario,
} from './validation';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const allAssessmentEvidenceIds = (assessment: IncidentAssessment) => [
  ...assessment.priorityIncident.evidenceIds,
  ...assessment.confirmedFacts.flatMap((item) => item.evidenceIds),
  ...assessment.hypotheses.flatMap((item) => [
    ...item.supportingEvidenceIds,
    ...item.conflictingEvidenceIds,
  ]),
  ...assessment.conflictingEvidence.flatMap((item) => item.evidenceIds),
  ...assessment.verificationSteps.flatMap((item) => item.relatedEvidenceIds),
  ...assessment.trace.evidenceIds,
];

test('exactly four fixed synthetic scenarios satisfy the scenario schema', () => {
  assert.equal(SYNTHETIC_INCIDENT_SCENARIOS.length, 4);
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const result = validateIncidentScenario(scenario);
    if (result.ok === false) {
      assert.fail(JSON.stringify(result.issues));
    }
    assert.equal(result.ok, true);
    assert.equal(scenario.synthetic, true);
    assert.ok(!Number.isNaN(Date.parse(scenario.analysisAsOf)));
    assert.ok(scenario.asset.id.startsWith('DEMO-'));
    assert.ok(scenario.observations.every((item) => item.assetId.startsWith('DEMO-')));
  }
});

test('scenario validation enforces synthetic-only evidence', () => {
  const scenario = clone(SYNTHETIC_INCIDENT_SCENARIOS[0]) as unknown as Record<string, unknown>;
  scenario.synthetic = false;
  const result = validateIncidentScenario(scenario);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.issues.some((issue) => issue.code === 'synthetic-only'));
  }
});

test('scenario validation enforces read-only evidence sources', () => {
  const scenario = clone(SYNTHETIC_INCIDENT_SCENARIOS[0]) as IncidentScenario;
  (scenario.observations[0].source as { access: string }).access = 'write';
  const result = validateIncidentScenario(scenario);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.issues.some((issue) => issue.code === 'read-only-only'));
  }
});

test('scenario inputs contain raw observations rather than embedded expected assessments', () => {
  const forbiddenKeys = new Set([
    'priorityIncident',
    'rootCause',
    'expectedAssessment',
    'confidence',
    'hypotheses',
    'advisoryActions',
  ]);
  const walk = (value: unknown): void => {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.equal(forbiddenKeys.has(key), false, `Fixture contains forbidden conclusion key: ${key}`);
      walk(child);
    }
  };
  SYNTHETIC_INCIDENT_SCENARIOS.forEach(walk);
});

test('deterministic engine matches separate scenario oracles', () => {
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const oracle = EXPECTED_SCENARIO_ORACLES[scenario.id];
    const assessment = analyzeIncidentDeterministically(scenario);
    assert.equal(assessment.priorityIncident.id, oracle.priorityIncidentId);
    assert.equal(assessment.confidence.score, oracle.confidenceScore);
    assert.equal(assessment.confirmedFacts.length, oracle.factCount);
    assert.equal(assessment.hypotheses.length, oracle.hypothesisCount);
    if (oracle.energyRisk === null) {
      assert.equal(assessment.risk.energy.quantification, 'not-quantifiable');
      assert.equal(assessment.risk.energy.likelyMwh, null);
    } else {
      assert.equal(assessment.risk.energy.quantification, 'bounded');
      assert.deepEqual(
        {
          lowMwh: assessment.risk.energy.lowMwh,
          likelyMwh: assessment.risk.energy.likelyMwh,
          highMwh: assessment.risk.energy.highMwh,
        },
        oracle.energyRisk,
      );
    }
  }
});

test('repeated deterministic analysis is byte-equivalent', async () => {
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const first = await deterministicIncidentAnalysisProvider.analyze({ scenario });
    const second = await deterministicIncidentAnalysisProvider.analyze({ scenario });
    assert.deepEqual(second, first);
    assert.equal(JSON.stringify(second), JSON.stringify(first));
  }
});

test('incident ranking uses stable lexical tie-breaking', () => {
  const candidates: IncidentCandidate[] = [
    {
      id: 'candidate-z',
      title: 'Z',
      severity: 'high',
      score: 80,
      rationale: 'Synthetic tie candidate.',
      evidenceIds: [],
    },
    {
      id: 'candidate-a',
      title: 'A',
      severity: 'high',
      score: 80,
      rationale: 'Synthetic tie candidate.',
      evidenceIds: [],
    },
  ];
  assert.deepEqual(
    rankIncidentCandidates(candidates).map((item) => item.id),
    ['candidate-a', 'candidate-z'],
  );
});

test('all assessment evidence references resolve to raw observations', () => {
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const validEvidence = new Set(scenario.observations.map((item) => item.id));
    const assessment = analyzeIncidentDeterministically(scenario);
    for (const reference of allAssessmentEvidenceIds(assessment)) {
      assert.ok(validEvidence.has(reference), `Unknown evidence ${reference}`);
    }
  }
});

test('confirmed facts never contain hypotheses', () => {
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const assessment = analyzeIncidentDeterministically(scenario);
    assert.ok(
      assessment.confirmedFacts.every(
        (fact) => fact.classification === 'confirmed-fact',
      ),
    );
    assert.ok(
      assessment.hypotheses.every(
        (hypothesis) =>
          hypothesis.classification === 'technical-hypothesis' &&
          hypothesis.rootCauseStatus === 'unconfirmed',
      ),
    );
  }
});

test('ambiguous PV scenario does not invent a definitive cause', () => {
  const assessment = analyzeIncidentDeterministically(
    getSyntheticScenario('synthetic-ambiguous-pv-underperformance'),
  );
  const rendered = JSON.stringify(assessment).toLowerCase();
  assert.equal(
    /root cause is|definitive cause is|cause has been confirmed/.test(rendered),
    false,
  );
  assert.equal(assessment.hypotheses.length, 3);
  assert.ok(assessment.conflictingEvidence.length >= 2);
  assert.ok(assessment.missingInformation.length >= 3);
});

test('stale, missing, suspect, and conflicting evidence reduce confidence', () => {
  const strong = analyzeIncidentDeterministically(
    getSyntheticScenario('synthetic-pv-inverter-block-derating'),
  );
  const ambiguous = analyzeIncidentDeterministically(
    getSyntheticScenario('synthetic-ambiguous-pv-underperformance'),
  );
  const stale = analyzeIncidentDeterministically(
    getSyntheticScenario('synthetic-hybrid-communication-loss'),
  );
  assert.ok(ambiguous.confidence.score < strong.confidence.score);
  assert.ok(stale.confidence.score < ambiguous.confidence.score);
  assert.equal(stale.confidence.level, 'low');
});

test('bounded energy risk is ordered and capped by synthetic asset exposure', () => {
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const energy = analyzeIncidentDeterministically(scenario).risk.energy;
    if (energy.quantification === 'bounded') {
      assert.ok(energy.lowMwh! >= 0);
      assert.ok(energy.lowMwh! <= energy.likelyMwh!);
      assert.ok(energy.likelyMwh! <= energy.highMwh!);
      const hours =
        (Date.parse(scenario.window.end) - Date.parse(scenario.window.start)) /
        3_600_000;
      assert.ok(energy.highMwh! <= scenario.asset.capacityMw * hours * 1.2);
    }
  }
});

test('provider output validation rejects self-approval and command language', () => {
  const scenario = getSyntheticScenario('synthetic-bess-ems-meter-mismatch');
  const assessment = analyzeIncidentDeterministically(scenario);
  assert.equal(validateIncidentAssessment(assessment, scenario).ok, true);

  const selfApproved = clone(assessment);
  selfApproved.review.state = 'approved';
  const selfApprovedResult = validateIncidentAssessment(selfApproved, scenario);
  assert.equal(selfApprovedResult.ok, false);
  if (!selfApprovedResult.ok) {
    assert.ok(
      selfApprovedResult.issues.some(
        (issue) => issue.code === 'provider-cannot-approve',
      ),
    );
  }

  const commandOutput = clone(assessment);
  commandOutput.advisoryActions[0].action = 'Change the setpoint remotely.';
  const commandResult = validateIncidentAssessment(commandOutput, scenario);
  assert.equal(commandResult.ok, false);
  if (!commandResult.ok) {
    assert.ok(
      commandResult.issues.some(
        (issue) => issue.code === 'operational-command-language',
      ),
    );
  }
});

test('generated verification and O&M language contains no operational commands', () => {
  for (const scenario of SYNTHETIC_INCIDENT_SCENARIOS) {
    const assessment = analyzeIncidentDeterministically(scenario);
    for (const action of assessment.advisoryActions) {
      assert.equal(action.requiresHumanApproval, true);
      assert.deepEqual(findForbiddenOperationalLanguage(action.action), []);
    }
    for (const step of assessment.verificationSteps) {
      assert.deepEqual(findForbiddenOperationalLanguage(step.action), []);
    }
  }
});

test('review begins pending and resets after rerun or scenario change', async () => {
  const firstScenario = SYNTHETIC_INCIDENT_SCENARIOS[0];
  const secondScenario = SYNTHETIC_INCIDENT_SCENARIOS[1];
  let session = createIncidentCopilotSession(firstScenario.id);
  const firstAssessment = await deterministicIncidentAnalysisProvider.analyze({
    scenario: firstScenario,
  });
  session = recordIncidentAnalysis(session, firstAssessment);
  assert.equal(session.assessment?.review.state, 'pending-review');

  session = applyHumanReview(session, 'approved', 'Synthetic reviewer note.');
  assert.equal(session.assessment?.review.state, 'approved');
  assert.equal(session.assessment?.review.authority, 'human-only');

  const repeatedAssessment = await deterministicIncidentAnalysisProvider.analyze({
    scenario: firstScenario,
  });
  session = recordIncidentAnalysis(session, repeatedAssessment);
  assert.equal(session.assessment?.review.state, 'pending-review');
  assert.equal(session.assessment?.review.note, '');

  session = applyHumanReview(session, 'rejected', 'Synthetic rejection.');
  session = selectIncidentScenario(session, secondScenario.id);
  assert.equal(session.assessment, null);
  const secondAssessment = await deterministicIncidentAnalysisProvider.analyze({
    scenario: secondScenario,
  });
  session = recordIncidentAnalysis(session, secondAssessment);
  assert.equal(session.assessment?.review.state, 'pending-review');
});

test('runtime provider is truthfully labeled deterministic local', () => {
  assert.equal(RUNTIME_ANALYSIS_PROVIDER, 'Deterministic local evidence engine');
  assert.equal(deterministicIncidentAnalysisProvider.runtime, 'deterministic-local');
});
