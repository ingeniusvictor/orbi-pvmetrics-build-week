import assert from 'node:assert/strict';
import test from 'node:test';
import type {
  AssessmentInput,
  ClimateRecoveryCase,
  DataSufficiencyAssessment,
  EmissionFactor,
} from './index';
import {
  CLIMATE_RECOVERY_ENGINE_VERSION,
  assessClimateImpact,
  assessClimateRecoveryCase,
  assessEnergyLoss,
  assessEvidence,
  createSyntheticClimateRecoveryCases,
  generateRecoveryScenarios,
  normalizeEmissionFactorToKgPerKwh,
  resolveAssessmentConfiguration,
} from './index';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const inputFor = (
  caseData: ClimateRecoveryCase,
  overrides: Partial<AssessmentInput> = {},
): AssessmentInput => ({
  caseData,
  evaluationTimestamp: caseData.updatedAt,
  emissionFactors: clone(caseData.emissionFactors),
  configuration: {},
  requestedOperations: {
    assessEnergyLoss: true,
    generateRecoveryScenarios: true,
    estimateClimateImpact: true,
    recoveryHorizons: ['seven-days'],
  },
  ...overrides,
});

const cases = (): [ClimateRecoveryCase, ClimateRecoveryCase, ClimateRecoveryCase, ClimateRecoveryCase] =>
  createSyntheticClimateRecoveryCases() as [ClimateRecoveryCase, ClimateRecoveryCase, ClimateRecoveryCase, ClimateRecoveryCase];

const sufficient = (value: DataSufficiencyAssessment): DataSufficiencyAssessment => ({
  ...value,
  status: 'sufficient',
  blockingReasons: [],
  missingCriticalFields: [],
  requiresMoreData: false,
  confidenceCap: undefined,
});

test('same assessment input produces the same output', () => {
  const [caseA] = cases();
  const input = inputFor(caseA);
  assert.deepEqual(assessClimateRecoveryCase(input), assessClimateRecoveryCase(clone(input)));
});

test('assessment does not use Date.now', () => {
  const [caseA] = cases();
  const original = Date.now;
  Date.now = () => { throw new Error('Date.now is forbidden'); };
  try {
    assert.equal(assessClimateRecoveryCase(inputFor(caseA)).caseId, caseA.id);
  } finally {
    Date.now = original;
  }
});

test('assessment does not use Math.random', () => {
  const [caseA] = cases();
  const original = Math.random;
  Math.random = () => { throw new Error('Math.random is forbidden'); };
  try {
    assert.equal(assessClimateRecoveryCase(inputFor(caseA)).engineVersion, CLIMATE_RECOVERY_ENGINE_VERSION);
  } finally {
    Math.random = original;
  }
});

test('invalid case input returns invalid', () => {
  const [caseA] = cases();
  caseA.id = '';
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.equal(result.status, 'invalid');
});

test('critical CR-01 validation failure blocks calculation', () => {
  const [caseA] = cases();
  delete caseA.provenance[0].syntheticDisclosure;
  delete caseA.evidence[0].provenance.syntheticDisclosure;
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.equal(result.status, 'invalid');
  assert.equal(result.energyLoss.status, 'invalid');
  assert.equal(result.climateImpact.status, 'blocked');
});

test('insufficient data blocks energy loss', () => {
  const [, , caseC] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseC));
  assert.equal(result.dataSufficiency.status, 'insufficient');
  assert.equal(result.energyLoss.status, 'unavailable');
});

test('supporting evidence increases evidence score', () => {
  const [caseA] = cases();
  const config = resolveAssessmentConfiguration();
  const supporting = assessEvidence([caseA.evidence[0]], config);
  const neutral = clone(caseA.evidence[0]);
  neutral.direction = 'neutral';
  assert.ok(supporting.netEvidenceScore > assessEvidence([neutral], config).netEvidenceScore);
});

test('contradicting evidence reduces net evidence score', () => {
  const [caseA] = cases();
  const config = resolveAssessmentConfiguration();
  const without = assessEvidence([caseA.evidence[0]], config);
  const withContradiction = assessEvidence(caseA.evidence, config);
  assert.ok(withContradiction.netEvidenceScore < without.netEvidenceScore);
});

test('stale evidence receives reduced weight', () => {
  const [caseA] = cases();
  const config = resolveAssessmentConfiguration();
  const stale = clone(caseA.evidence[0]);
  stale.qualityStatus = 'stale';
  assert.ok(assessEvidence([stale], config).qualityAdjustment < assessEvidence([caseA.evidence[0]], config).qualityAdjustment);
});

test('unavailable evidence reduces data sufficiency', () => {
  const [, , caseC] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseC));
  assert.equal(result.dataSufficiency.unavailableEvidenceCount, 1);
  assert.equal(result.dataSufficiency.requiresMoreData, true);
});

test('grid curtailment is non-recoverable for asset maintenance', () => {
  const [, caseB] = cases();
  assert.equal(assessClimateRecoveryCase(inputFor(caseB)).recoverability.status, 'non-recoverable');
});

test('grid curtailment does not recommend field inspection', () => {
  const [, caseB] = cases();
  const actions = assessClimateRecoveryCase(inputFor(caseB)).recommendations.recommendedActions;
  assert.equal(actions.some((action) => action.actionType === 'field-inspection'), false);
});

test('communications evidence alone does not demonstrate loss', () => {
  const [, , caseC] = cases();
  caseC.losses[0].category = 'communications';
  const result = assessClimateRecoveryCase(inputFor(caseC));
  assert.equal(result.recoverability.status, 'indeterminate');
  assert.equal(result.energyLoss.status, 'unavailable');
});

test('sensor quality limits confidence', () => {
  const [, , caseC] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseC));
  assert.ok((result.dataSufficiency.confidenceCap ?? 1) <= 0.19);
  assert.ok(result.recoverability.confidenceScore <= 0.19);
});

test('clipping is not automatically classified as failure', () => {
  const [, caseB] = cases();
  caseB.losses[0].category = 'clipping';
  const result = assessClimateRecoveryCase(inputFor(caseB));
  assert.equal(result.recoverability.status, 'indeterminate');
});

test('inverter recommendations put remote review before field inspection', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.equal(result.recommendations.recommendedActions[0].actionType, 'remote-review');
  assert.ok(result.recommendations.suppressedActions.some((action) => action.actionType === 'field-inspection'));
});

test('soiling generates cleaning assessment', () => {
  const [caseA] = cases();
  caseA.losses[0].category = 'soiling';
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.equal(result.recommendations.recommendedActions[0].actionType, 'cleaning-assessment');
});

test('field inspection requires approval and safety notes', () => {
  const [caseA] = cases();
  const field = assessClimateRecoveryCase(inputFor(caseA)).recommendations.suppressedActions.find(
    (action) => action.actionType === 'field-inspection',
  );
  assert.equal(field?.requiresApproval, true);
  assert.ok((field?.safetyNotes.length ?? 0) > 0);
});

test('direct-difference calculates expected minus actual', () => {
  const [caseA] = cases();
  const assessed = assessClimateRecoveryCase(inputFor(caseA));
  const energy = assessEnergyLoss({
    loss: caseA.losses[0], evidence: caseA.evidence,
    dataSufficiency: sufficient(assessed.dataSufficiency),
    configuration: resolveAssessmentConfiguration({ energyLossMethod: 'direct-difference' }),
    requestedOperations: { energyLossInputs: { expectedEnergyKwh: 100, actualEnergyKwh: 70 } },
  });
  assert.equal(energy.energyLossKwh, 30);
  assert.equal(energy.method, 'direct-difference');
});

test('direct-difference never produces negative loss', () => {
  const [caseA] = cases();
  const assessed = assessClimateRecoveryCase(inputFor(caseA));
  const energy = assessEnergyLoss({
    loss: caseA.losses[0], evidence: caseA.evidence,
    dataSufficiency: sufficient(assessed.dataSufficiency),
    configuration: resolveAssessmentConfiguration({ energyLossMethod: 'direct-difference' }),
    requestedOperations: { energyLossInputs: { expectedEnergyKwh: 70, actualEnergyKwh: 100 } },
  });
  assert.equal(energy.energyLossKwh, 0);
});

test('power-duration calculates kW times hours', () => {
  const [caseA] = cases();
  const assessed = assessClimateRecoveryCase(inputFor(caseA));
  const energy = assessEnergyLoss({
    loss: caseA.losses[0], evidence: caseA.evidence,
    dataSufficiency: sufficient(assessed.dataSufficiency),
    configuration: resolveAssessmentConfiguration({ energyLossMethod: 'power-duration' }),
    requestedOperations: { energyLossInputs: { estimatedPowerLossKw: 25, durationHours: 4 } },
  });
  assert.equal(energy.energyLossKwh, 100);
});

test('high-quality uncertainty uses the configured ten-percent convention', () => {
  const [caseA] = cases();
  const assessed = assessClimateRecoveryCase(inputFor(caseA));
  const energy = assessEnergyLoss({
    loss: caseA.losses[0], evidence: caseA.evidence,
    dataSufficiency: sufficient(assessed.dataSufficiency),
    configuration: resolveAssessmentConfiguration({ energyLossMethod: 'direct-difference' }),
    requestedOperations: { energyLossInputs: { expectedEnergyKwh: 100, actualEnergyKwh: 60 } },
  });
  assert.equal(energy.uncertaintyRange?.lowerBound, 36);
  assert.equal(energy.uncertaintyRange?.upperBound, 44);
});

test('degraded uncertainty uses the configured thirty-five-percent convention', () => {
  const [caseA] = cases();
  const assessed = assessClimateRecoveryCase(inputFor(caseA));
  const degraded = { ...sufficient(assessed.dataSufficiency), status: 'partially-sufficient' as const, confidenceCap: 0.39 };
  const energy = assessEnergyLoss({
    loss: caseA.losses[0], evidence: caseA.evidence, dataSufficiency: degraded,
    configuration: resolveAssessmentConfiguration({ energyLossMethod: 'direct-difference' }),
    requestedOperations: { energyLossInputs: { expectedEnergyKwh: 100, actualEnergyKwh: 60 } },
  });
  assert.equal(energy.uncertaintyRange?.lowerBound, 26);
  assert.equal(energy.uncertaintyRange?.upperBound, 54);
});

test('insufficient status never calculates energy', () => {
  const [, , caseC] = cases();
  assert.equal(assessClimateRecoveryCase(inputFor(caseC)).energyLoss.energyLossKwh, undefined);
});

test('recoverable loss generates a simulated scenario', () => {
  const [caseA] = cases();
  caseA.evidence = [caseA.evidence[0]];
  caseA.losses[0].evidenceIds = [caseA.evidence[0].id];
  caseA.hypotheses[0].evidenceAgainst = [];
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.equal(result.recoverability.status, 'recoverable');
  assert.equal(result.scenarios[0].status, 'simulated');
});

test('non-recoverable loss does not generate recovery', () => {
  const [, caseB] = cases();
  const scenario = assessClimateRecoveryCase(inputFor(caseB)).scenarios[0];
  assert.equal(scenario.status, 'blocked');
  assert.equal(scenario.recoveredEnergy.valueKwh, 0);
});

test('custom horizon requires positive days', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA));
  const scenario = generateRecoveryScenarios({
    energyLoss: result.energyLoss, recoverability: result.recoverability,
    configuration: resolveAssessmentConfiguration(), datasetReality: 'synthetic',
    requestedOperations: { recoveryHorizons: ['custom'] },
  });
  assert.equal(scenario[0].status, 'invalid');
});

test('recovery rate outside zero to one is invalid', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA));
  const scenario = generateRecoveryScenarios({
    energyLoss: result.energyLoss, recoverability: result.recoverability,
    configuration: resolveAssessmentConfiguration(), datasetReality: 'synthetic',
    requestedOperations: { recoveryHorizons: ['daily'], recoveryRate: 1.1 },
  });
  assert.equal(scenario[0].status, 'invalid');
});

test('kgCO2e per kWh factor is supported', () => {
  assert.equal(normalizeEmissionFactorToKgPerKwh({ value: 0.5, unit: 'kgCO2e-per-kWh' }), 0.5);
});

test('tCO2e per MWh factor is supported', () => {
  assert.equal(normalizeEmissionFactorToKgPerKwh({ value: 0.5, unit: 'tCO2e-per-MWh' }), 0.5);
});

test('supported emission-factor units are numerically equivalent', () => {
  const kg = normalizeEmissionFactorToKgPerKwh({ value: 1, unit: 'kgCO2e-per-kWh' });
  const tonnes = normalizeEmissionFactorToKgPerKwh({ value: 1, unit: 'tCO2e-per-MWh' });
  assert.equal(kg, tonnes);
});

test('missing emission factor blocks climate impact', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA, { emissionFactors: [] }));
  assert.equal(result.climateImpact.status, 'blocked');
});

test('invalid emission factor invalidates climate impact', () => {
  const [caseA] = cases();
  const factor = clone(caseA.emissionFactors[0]);
  factor.value = 0;
  const result = assessClimateRecoveryCase(inputFor(caseA, { emissionFactors: [factor] }));
  assert.equal(result.climateImpact.status, 'invalid');
});

test('expired emission factor blocks climate impact', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA, {
    evaluationTimestamp: '2027-01-01T00:00:00Z',
    configuration: { maximumAllowedDataAgeMinutes: 1_000_000 },
  }));
  assert.equal(result.climateImpact.status, 'blocked');
});

test('synthetic climate impact can never be verified', () => {
  const [caseA] = cases();
  assert.equal(assessClimateRecoveryCase(inputFor(caseA)).climateImpact.status, 'estimated');
});

test('climate impact is explicitly counterfactual and estimated', () => {
  const [caseA] = cases();
  const impact = assessClimateRecoveryCase(inputFor(caseA)).climateImpact;
  assert.ok(impact.limitations.some((item) => /counterfactual/i.test(item)));
  assert.equal(impact.status, 'estimated');
});

test('priority is always within zero and one hundred', () => {
  for (const recoveryCase of cases()) {
    const priority = assessClimateRecoveryCase(inputFor(recoveryCase)).priority;
    assert.ok(priority.score >= 0 && priority.score <= 100);
  }
});

test('insufficient data limits priority below high', () => {
  const [, , caseC] = cases();
  assert.ok(assessClimateRecoveryCase(inputFor(caseC)).priority.score < 60);
});

test('separate safety risk raises the priority score', () => {
  const [, , first] = cases();
  const [, , second] = cases();
  const baseline = assessClimateRecoveryCase(inputFor(first)).priority;
  const elevated = assessClimateRecoveryCase(inputFor(second, { operatorContext: { safetyRisk: 1, safetyNotes: ['Synthetic safety context.'] } })).priority;
  assert.ok(elevated.score > baseline.score);
  assert.ok(elevated.components.safetyRisk > 0);
});

test('high priority requires human review', () => {
  const [caseA] = cases();
  caseA.losses[0].operationalSeverity = 'critical';
  const result = assessClimateRecoveryCase(inputFor(caseA, {
    configuration: { priorityReferenceEnergyKwh: 1, priorityReferenceClimateKgCO2e: 1 },
  }));
  assert.ok(['high', 'critical'].includes(result.priority.band));
  assert.equal(result.priority.requiresHumanReview, true);
});

test('possible overlap emits a warning', () => {
  const [, , , caseD] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseD));
  assert.ok(result.doubleCounting.some((item) => item.status === 'possible-overlap'));
  assert.ok(result.warnings.some((item) => /possible-overlap/i.test(item)));
});

test('confirmed overlap blocks climate aggregation', () => {
  const [, , , caseD] = cases();
  caseD.losses[0].doubleCountingGroupId = 'DEMO-CONFIRMED';
  caseD.losses[1].doubleCountingGroupId = 'DEMO-CONFIRMED';
  const result = assessClimateRecoveryCase(inputFor(caseD));
  assert.ok(result.doubleCounting.some((item) => item.status === 'confirmed-overlap'));
  assert.ok(result.lossAssessments.every((item) => item.climateImpact.status === 'blocked'));
});

test('double counting never consolidates losses automatically', () => {
  const [, , , caseD] = cases();
  const before = clone(caseD.losses);
  const result = assessClimateRecoveryCase(inputFor(caseD));
  assert.deepEqual(caseD.losses, before);
  assert.equal(result.lossAssessments.length, 2);
});

test('trace contains every required stage in order', () => {
  const [caseA] = cases();
  assert.deepEqual(
    assessClimateRecoveryCase(inputFor(caseA)).trace.map((step) => step.stage),
    ['input-validation', 'data-sufficiency', 'evidence-scoring', 'recoverability', 'hypothesis-generation', 'energy-loss', 'scenario-generation', 'climate-impact', 'recommendation', 'priority', 'double-counting', 'final-status'],
  );
});

test('engine version is present on result and trace', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.equal(result.engineVersion, CLIMATE_RECOVERY_ENGINE_VERSION);
  assert.ok(result.trace.every((step) => step.version === CLIMATE_RECOVERY_ENGINE_VERSION));
});

test('fixture A produces recoverable assessment outputs', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA));
  assert.ok(['sufficient', 'partially-sufficient'].includes(result.dataSufficiency.status));
  assert.equal(result.recoverability.status, 'partially-recoverable');
  assert.ok((result.energyLoss.energyLossKwh ?? 0) > 0);
  assert.equal(result.scenarios[0].status, 'simulated');
  assert.equal(result.climateImpact.status, 'estimated');
  assert.ok(['medium', 'high'].includes(result.priority.band));
});

test('fixture B preserves non-recoverable classification and no climate recovery', () => {
  const [, caseB] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseB));
  assert.equal(result.recoverability.status, 'non-recoverable');
  assert.equal(result.scenarios[0].recoveredEnergy.valueKwh, 0);
  assert.notEqual(result.climateImpact.status, 'estimated');
});

test('fixture C requests more data without energy or climate impact', () => {
  const [, , caseC] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseC));
  assert.equal(result.dataSufficiency.status, 'insufficient');
  assert.equal(result.recommendations.recommendedActions[0].actionType, 'request-more-data');
  assert.equal(result.energyLoss.status, 'unavailable');
  assert.notEqual(result.climateImpact.status, 'estimated');
});

test('fixture D preserves individual priorities and overlap review', () => {
  const [, , , caseD] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseD));
  assert.equal(result.lossAssessments.length, 2);
  assert.ok(result.lossAssessments.every((item) => item.priority.score >= 0));
  assert.equal(result.requiresHumanReview, true);
});

test('result remains pure data without React browser or server values', () => {
  const [caseA] = cases();
  const serialized = JSON.stringify(assessClimateRecoveryCase(inputFor(caseA)));
  const parsed = JSON.parse(serialized) as Record<string, unknown>;
  assert.doesNotThrow(() => JSON.stringify(parsed));
  assert.equal(Object.hasOwn(parsed, 'window'), false);
  assert.equal(Object.hasOwn(parsed, 'document'), false);
});

test('climate impact pure function respects confirmed overlap before aggregation', () => {
  const [caseA] = cases();
  const result = assessClimateRecoveryCase(inputFor(caseA));
  const factor: EmissionFactor = caseA.emissionFactors[0];
  const impact = assessClimateImpact({
    scenarios: result.scenarios,
    factors: [factor],
    configuration: resolveAssessmentConfiguration(),
    requestedOperations: { estimateClimateImpact: true },
    dataSufficiency: result.dataSufficiency,
    evaluationTimestamp: caseA.updatedAt,
    datasetReality: 'synthetic',
    relatedDoubleCounting: [{ status: 'confirmed-overlap', relatedLossIds: ['a', 'b'], reasons: ['test'], recommendedTreatment: 'request-review', requiresHumanReview: true }],
  });
  assert.equal(impact.status, 'blocked');
});
