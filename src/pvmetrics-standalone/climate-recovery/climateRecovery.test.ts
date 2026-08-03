import assert from 'node:assert/strict';
import test from 'node:test';
import type {
  ClimateRecoveryCase,
  RecoveryVerification,
  UncertaintyRange,
} from './index';
import {
  assessDoubleCounting,
  clampConfidenceScore,
  createSyntheticClimateRecoveryCases,
  deriveConfidenceLevel,
  validateClimateImpactEstimate,
  validateClimateRecoveryCase,
  validateConfidenceConsistency,
  validateDataProvenance,
  validateDiagnosticHypothesis,
  validateEmissionFactor,
  validateRecommendedAction,
  validateRecoverableLoss,
  validateRecoveryScenario,
  validateRecoveryVerification,
  validateUncertaintyRange,
} from './index';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const getCases = (): [
  ClimateRecoveryCase,
  ClimateRecoveryCase,
  ClimateRecoveryCase,
  ClimateRecoveryCase,
] => createSyntheticClimateRecoveryCases() as [
  ClimateRecoveryCase,
  ClimateRecoveryCase,
  ClimateRecoveryCase,
  ClimateRecoveryCase,
];

const validSyntheticVerification = (): RecoveryVerification => ({
  id: 'DEMO-VERIFICATION-TEST',
  lossId: 'DEMO-LOSS-A-INVERTER',
  actionId: 'DEMO-ACTION-A-REMOTE',
  scenarioId: 'DEMO-SCENARIO-A-SEVEN-DAYS',
  verificationWindow: {
    start: '2026-07-08T00:00:00Z',
    end: '2026-07-09T00:00:00Z',
  },
  baselinePeriod: {
    start: '2026-07-01T00:00:00Z',
    end: '2026-07-02T00:00:00Z',
  },
  postActionPeriod: {
    start: '2026-07-08T00:00:00Z',
    end: '2026-07-09T00:00:00Z',
  },
  baselineEnergyKwh: 10000,
  observedPostActionEnergyKwh: 10500,
  normalizedExpectedEnergyKwh: 10200,
  estimatedRecoveredEnergyKwh: 300,
  uncertaintyRange: {
    lowerBound: 100,
    centralEstimate: 300,
    upperBound: 500,
    unit: 'kWh',
    confidenceDescriptor: 'Synthetic verification estimate',
    methodology: 'Fixed synthetic before/after comparison.',
  },
  weatherNormalizationApplied: true,
  normalizationMethod: 'Fixed fictional normalization method.',
  confoundingFactors: ['Synthetic irradiance differs between periods.'],
  dataQualityStatus: 'valid',
  origin: 'estimated',
  datasetReality: 'synthetic',
  verificationStatus: 'estimated-recovery',
  confidenceLevel: 'medium',
  confidenceScore: 0.5,
  evidenceIds: ['DEMO-EVIDENCE-A-POWER'],
  assumptions: ['The synthetic periods are comparable after fictional normalization.'],
  limitations: ['This is not a real verification result.'],
  humanReviewStatus: 'pending',
  createdAt: '2026-07-09T01:00:00Z',
  updatedAt: '2026-07-09T01:00:00Z',
});

test('derives the centralized confidence levels at all boundaries', () => {
  assert.equal(deriveConfidenceLevel(0), 'very-low');
  assert.equal(deriveConfidenceLevel(0.19), 'very-low');
  assert.equal(deriveConfidenceLevel(0.2), 'low');
  assert.equal(deriveConfidenceLevel(0.4), 'medium');
  assert.equal(deriveConfidenceLevel(0.6), 'high');
  assert.equal(deriveConfidenceLevel(0.8), 'very-high');
  assert.equal(deriveConfidenceLevel(1), 'very-high');
});

test('clamps confidence without allowing non-finite values through', () => {
  assert.equal(clampConfidenceScore(-0.1), 0);
  assert.equal(clampConfidenceScore(0.45), 0.45);
  assert.equal(clampConfidenceScore(1.2), 1);
  assert.equal(clampConfidenceScore(Number.NaN), 0);
});

test('rejects invalid confidence scores', () => {
  const result = validateConfidenceConsistency(1.01, 'very-high');
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'confidence-score-out-of-range'));
});

test('accepts an ordered non-negative uncertainty range', () => {
  const range: UncertaintyRange = {
    lowerBound: 1,
    centralEstimate: 2,
    upperBound: 3,
    unit: 'kWh',
    confidenceDescriptor: 'Test range',
    methodology: 'Fixed test method.',
  };
  assert.equal(validateUncertaintyRange(range).valid, true);
});

test('rejects an inverted uncertainty range', () => {
  const range: UncertaintyRange = {
    lowerBound: 3,
    centralEstimate: 2,
    upperBound: 1,
    unit: 'kWh',
    confidenceDescriptor: 'Test range',
    methodology: 'Fixed test method.',
  };
  const result = validateUncertaintyRange(range);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'unordered-uncertainty-range'));
});

test('rejects negative energy loss', () => {
  const [caseA] = getCases();
  caseA.losses[0].estimatedEnergyLossKwh = -1;
  const result = validateRecoverableLoss(caseA.losses[0]);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some(
      (issue) => issue.code === 'non-negative-finite-number-required',
    ),
  );
});

test('requires synthetic disclosure on provenance', () => {
  const [caseA] = getCases();
  delete caseA.provenance[0].syntheticDisclosure;
  const result = validateDataProvenance(caseA.provenance[0]);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'synthetic-disclosure-required'),
  );
});

test('rejects high-confidence hypotheses without supporting evidence', () => {
  const [caseA] = getCases();
  caseA.hypotheses[0].evidenceFor = [];
  const result = validateDiagnosticHypothesis(caseA.hypotheses[0]);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'high-confidence-evidence-required'),
  );
});

test('rejects confirmed-by-human status without completed review', () => {
  const [caseA] = getCases();
  caseA.hypotheses[0].status = 'confirmed-by-human';
  caseA.hypotheses[0].humanReviewStatus = 'pending';
  const result = validateDiagnosticHypothesis(caseA.hypotheses[0]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'human-confirmation-required'));
});

test('rejects verified recovery backed by synthetic data', () => {
  const verification = validSyntheticVerification();
  verification.verificationStatus = 'verified';
  verification.verifiedBy = 'DEMO-HUMAN-REVIEWER';
  verification.verifiedAt = '2026-07-09T02:00:00Z';
  verification.humanReviewStatus = 'accepted';
  const result = validateRecoveryVerification(verification);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'synthetic-data-cannot-be-verified'),
  );
});

test('requires an emission factor for climate-impact validation', () => {
  const [caseA] = getCases();
  const result = validateClimateImpactEstimate(caseA.climateImpactEstimates[0]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'emission-factor-required'));
});

test('rejects an invalid emission factor', () => {
  const [caseA] = getCases();
  const factor = clone(caseA.emissionFactors[0]);
  factor.value = 0;
  assert.equal(validateEmissionFactor(factor).valid, false);
  const impactResult = validateClimateImpactEstimate(
    caseA.climateImpactEstimates[0],
    factor,
  );
  assert.ok(impactResult.errors.some((issue) => issue.code === 'invalid-emission-factor'));
});

test('requires days for a custom recovery horizon', () => {
  const [caseA] = getCases();
  const scenario = caseA.scenarios[0];
  scenario.horizon = 'custom';
  delete scenario.customHorizonDays;
  const result = validateRecoveryScenario(scenario);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'custom-horizon-days-required'));
});

test('rejects field action without safety notes', () => {
  const [caseA] = getCases();
  const action = caseA.actions[0];
  action.actionType = 'field-inspection';
  action.safetyNotes = [];
  const result = validateRecommendedAction(action);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'field-safety-notes-required'));
});

test('rejects a recovery intervention for a non-recoverable loss', () => {
  const [, caseB] = getCases();
  caseB.actions[0].actionType = 'maintenance-intervention';
  caseB.actions[0].safetyNotes = ['Synthetic safety boundary.'];
  const result = validateClimateRecoveryCase(caseB);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'non-recoverable-action-conflict'),
  );
});

test('insufficient-data fixture requests more data and does not claim impact', () => {
  const [, , caseC] = getCases();
  assert.equal(caseC.losses[0].recoverabilityStatus, 'indeterminate');
  assert.equal(caseC.losses[0].confidenceLevel, 'low');
  assert.equal(caseC.actions[0].actionType, 'request-more-data');
  assert.equal(caseC.climateImpactEstimates.length, 0);
  assert.equal(validateClimateRecoveryCase(caseC).valid, true);
});

test('grid-curtailment fixture is non-recoverable and not a maintenance priority', () => {
  const [, caseB] = getCases();
  assert.equal(caseB.losses[0].category, 'grid-curtailment');
  assert.equal(caseB.losses[0].recoverabilityStatus, 'non-recoverable');
  assert.equal(caseB.actions[0].actionType, 'no-action');
  assert.equal(caseB.climateImpactEstimates.length, 0);
  assert.equal(validateClimateRecoveryCase(caseB).valid, true);
});

test('flags the overlapping fixture as possible overlap', () => {
  const [, , , caseD] = getCases();
  const result = assessDoubleCounting(caseD.losses[0], caseD.losses[1]);
  assert.equal(result.status, 'possible-overlap');
  assert.equal(result.requiresHumanReview, true);
  assert.equal(result.recommendedTreatment, 'request-review');
});

test('reports clear when losses do not overlap', () => {
  const [caseA, caseB] = getCases();
  const result = assessDoubleCounting(caseA.losses[0], caseB.losses[0]);
  assert.equal(result.status, 'clear');
  assert.equal(result.recommendedTreatment, 'count-separately');
});

test('synthetic fixtures are exactly reproducible', () => {
  assert.deepEqual(
    createSyntheticClimateRecoveryCases(),
    createSyntheticClimateRecoveryCases(),
  );
});

test('all complete Climate Recovery fixtures validate', () => {
  for (const recoveryCase of createSyntheticClimateRecoveryCases()) {
    const result = validateClimateRecoveryCase(recoveryCase);
    assert.equal(
      result.valid,
      true,
      `${recoveryCase.id}: ${JSON.stringify(result.errors)}`,
    );
  }
});

test('double-counting assessment never consolidates records automatically', () => {
  const [, , , caseD] = getCases();
  const before = clone(caseD.losses);
  const result = assessDoubleCounting(caseD.losses[0], caseD.losses[1]);
  assert.deepEqual(caseD.losses, before);
  assert.equal(caseD.losses.length, 2);
  assert.notEqual(result.recommendedTreatment, 'consolidate');
  assert.notEqual(result.recommendedTreatment, 'exclude-one');
});

test('all fixture energy and climate values are non-negative', () => {
  for (const recoveryCase of createSyntheticClimateRecoveryCases()) {
    for (const loss of recoveryCase.losses) {
      for (const value of [
        loss.estimatedPowerLossKw,
        loss.estimatedEnergyLossKwh,
        loss.estimatedDailyEnergyLossKwh,
      ]) {
        if (value !== undefined) assert.ok(value >= 0);
      }
    }
    for (const scenario of recoveryCase.scenarios) {
      assert.ok(scenario.noInterventionEnergyLossKwh >= 0);
      assert.ok(scenario.interventionEnergyLossKwh >= 0);
      assert.ok(scenario.estimatedRecoveredEnergyKwh >= 0);
    }
    for (const impact of recoveryCase.climateImpactEstimates) {
      assert.ok(impact.recoveredEnergyKwh >= 0);
      assert.ok(impact.avoidedEmissionsKgCO2e >= 0);
    }
  }
});

test('closed case requires completed human review', () => {
  const [caseA] = getCases();
  caseA.status = 'closed';
  caseA.humanReviewStatus = 'not-requested';
  const result = validateClimateRecoveryCase(caseA);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'closed-case-human-review-required'),
  );
});

test('recovery estimate cannot exceed scenario difference', () => {
  const [caseA] = getCases();
  caseA.scenarios[0].estimatedRecoveredEnergyKwh = 6000;
  const result = validateRecoveryScenario(caseA.scenarios[0]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((issue) => issue.code === 'inconsistent-recovered-energy'));
});

test('degraded data cannot be provisionally verified', () => {
  const verification = validSyntheticVerification();
  verification.dataQualityStatus = 'degraded';
  verification.verificationStatus = 'provisionally-verified';
  const result = validateRecoveryVerification(verification);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'data-quality-limits-verification'),
  );
});

test('synthetic climate impact cannot be marked verified', () => {
  const [caseA] = getCases();
  const impact = caseA.climateImpactEstimates[0];
  impact.status = 'verified';
  impact.verificationStatus = 'verified';
  impact.humanReviewStatus = 'accepted';
  const result = validateClimateImpactEstimate(impact, caseA.emissionFactors[0]);
  assert.equal(result.valid, false);
  assert.ok(
    result.errors.some((issue) => issue.code === 'synthetic-impact-cannot-be-verified'),
  );
});
