import {
  AdvisoryOmAction,
  ConfidenceLevel,
  ConflictingEvidence,
  ConfirmedFact,
  FieldVerificationStep,
  INCIDENT_ENGINE_VERSION,
  IncidentAssessment,
  IncidentCandidate,
  IncidentConfidence,
  IncidentObservation,
  IncidentRisk,
  IncidentScenario,
  MissingInformation,
  OperationalRiskLevel,
  TechnicalHypothesis,
} from './domain';
import { validateIncidentScenario } from './validation';

const round = (value: number, digits = 2) =>
  Number(value.toFixed(digits));

const observationBySignal = (
  scenario: IncidentScenario,
  signal: string,
): IncidentObservation | undefined =>
  scenario.observations.find((item) => item.signal === signal);

type NumericIncidentObservation = IncidentObservation & { value: number };

const numberObservation = (
  scenario: IncidentScenario,
  signal: string,
  acceptedQualities: IncidentObservation['quality'][] = ['valid'],
): NumericIncidentObservation | undefined => {
  const item = observationBySignal(scenario, signal);
  return item &&
    typeof item.value === 'number' &&
    acceptedQualities.includes(item.quality)
    ? (item as NumericIncidentObservation)
    : undefined;
};

const durationHours = (scenario: IncidentScenario) =>
  (Date.parse(scenario.window.end) - Date.parse(scenario.window.start)) /
  3_600_000;

const severityOrder = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
} as const;

export const rankIncidentCandidates = (
  candidates: readonly IncidentCandidate[],
): IncidentCandidate[] =>
  [...candidates].sort(
    (left, right) =>
      right.score - left.score ||
      severityOrder[right.severity] - severityOrder[left.severity] ||
      left.id.localeCompare(right.id),
  );

const createIncidentCandidates = (
  scenario: IncidentScenario,
): IncidentCandidate[] => {
  const candidates: IncidentCandidate[] = [];
  const expected = numberObservation(scenario, 'pv.expected_power_mw', [
    'valid',
    'suspect',
  ]);
  const actual = numberObservation(scenario, 'pv.actual_power_mw');
  const inverterAlarm = observationBySignal(scenario, 'inverter.alarm_code');
  const pr = numberObservation(scenario, 'pv.performance_ratio_pct');
  const communications = observationBySignal(scenario, 'communications.status');
  const dataAge = numberObservation(scenario, 'data.age_minutes');
  const emsSoc = numberObservation(scenario, 'bess.ems_soc_pct');
  const meterSoc = numberObservation(scenario, 'bess.meter_soc_pct');
  const emsPower = numberObservation(scenario, 'bess.ems_power_mw');
  const meterPower = numberObservation(scenario, 'bess.meter_power_mw');

  if (
    expected &&
    actual &&
    inverterAlarm?.value === 'DERATING_ACTIVE' &&
    actual.value < expected.value * 0.8
  ) {
    candidates.push({
      id: 'incident-inverter-block-derating',
      title: 'Localized inverter-block derating pattern',
      severity: 'high',
      score: 86,
      rationale:
        'A valid derating alarm coincides with a material localized power deficit while peer-block and irradiance observations remain available.',
      evidenceIds: [expected.id, actual.id, inverterAlarm.id],
    });
  }

  if (
    expected &&
    actual &&
    (actual.value < expected.value * 0.85 || (pr && pr.value < 80))
  ) {
    candidates.push({
      id: 'incident-pv-performance-deviation',
      title: 'PV performance deviation requiring evidence review',
      severity: 'high',
      score: inverterAlarm?.value === 'DERATING_ACTIVE' ? 72 : 74,
      rationale:
        'Measured PV output is materially below the synthetic expectation, but the available observations must be separated from possible causes.',
      evidenceIds: [expected.id, actual.id, ...(pr ? [pr.id] : [])],
    });
  }

  if (
    emsSoc &&
    meterSoc &&
    emsPower &&
    meterPower &&
    (Math.abs(emsSoc.value - meterSoc.value) >= 8 ||
      Math.abs(emsPower.value - meterPower.value) >= 0.5)
  ) {
    candidates.push({
      id: 'incident-bess-source-mismatch',
      title: 'BESS EMS-versus-meter telemetry mismatch',
      severity: 'high',
      score: 80,
      rationale:
        'Synchronized synthetic EMS and independent-meter readings disagree beyond the deterministic comparison thresholds.',
      evidenceIds: [emsSoc.id, meterSoc.id, emsPower.id, meterPower.id],
    });
  }

  if (
    communications?.value === 'OFFLINE' ||
    (dataAge && dataAge.value >= 30)
  ) {
    candidates.push({
      id: 'incident-communications-visibility-loss',
      title: 'Hybrid-site operational visibility loss',
      severity: 'critical',
      score: 92,
      rationale:
        'The synthetic gateway is offline and current PV/BESS operational values are stale or unavailable, preventing reliable present-state assessment.',
      evidenceIds: [
        ...(communications ? [communications.id] : []),
        ...(dataAge ? [dataAge.id] : []),
      ],
    });
  }

  if (candidates.length === 0) {
    const available = scenario.observations.filter(
      (item) => item.quality !== 'missing',
    );
    candidates.push({
      id: 'incident-evidence-review',
      title: 'Evidence review required',
      severity: 'medium',
      score: 50,
      rationale:
        'No deterministic incident rule crossed its threshold; the synthetic evidence remains available for human review.',
      evidenceIds: available.slice(0, 2).map((item) => item.id),
    });
  }
  return rankIncidentCandidates(candidates);
};

const createConfirmedFacts = (
  scenario: IncidentScenario,
): ConfirmedFact[] =>
  scenario.observations
    .filter((item) => item.quality === 'valid')
    .map((item, index) => ({
      id: `fact-${index + 1}`,
      classification: 'confirmed-fact' as const,
      statement: item.statement,
      evidenceIds: [item.id],
    }));

type ExplanationPack = {
  hypotheses: TechnicalHypothesis[];
  conflicts: ConflictingEvidence[];
  missing: MissingInformation[];
  steps: FieldVerificationStep[];
  actions: AdvisoryOmAction[];
  ruleIds: string[];
  confidenceCap: number;
};

const createExplanationPack = (
  scenario: IncidentScenario,
  priority: IncidentCandidate,
): ExplanationPack => {
  const evidence = (signal: string) =>
    observationBySignal(scenario, signal)?.id;
  const ids = (...values: Array<string | undefined>) =>
    values.filter((value): value is string => Boolean(value));
  const safetyBoundary =
    'Read-only field verification only; no operational command or equipment control is authorized.';

  if (priority.id === 'incident-inverter-block-derating') {
    return {
      hypotheses: [
        {
          id: 'hypothesis-inverter-protective-derating',
          classification: 'technical-hypothesis',
          statement:
            'The affected inverter block may be limiting output under an internal protective or thermal derating condition.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(
            evidence('inverter.alarm_code'),
            evidence('pv.actual_power_mw'),
            evidence('pv.expected_power_mw'),
          ),
          conflictingEvidenceIds: [],
          uncertainty:
            'The alarm code and power pattern do not identify the underlying trigger without local logs and DC-side measurements.',
        },
      ],
      conflicts: [],
      missing: [
        {
          id: 'missing-inverter-trigger-log',
          question: 'What event detail and temperature history accompany the derating alarm?',
          whyItMatters: 'It distinguishes thermal, grid, DC-side, and internal protection triggers.',
        },
        {
          id: 'missing-dc-string-current',
          question: 'Are DC string currents balanced inside the affected block?',
          whyItMatters: 'The current sample omits DC-side evidence needed to narrow the hypothesis.',
        },
      ],
      steps: [
        {
          id: 'verify-inverter-local-record',
          order: 1,
          action: 'Review the local inverter event record and temperature trend with an authorized technician.',
          rationale: 'Confirms the alarm context without changing equipment state.',
          safetyBoundary,
          relatedEvidenceIds: ids(evidence('inverter.alarm_code')),
        },
        {
          id: 'verify-dc-comparison',
          order: 2,
          action: 'Compare read-only DC current and voltage measurements across the affected and peer blocks.',
          rationale: 'Tests whether the power deficit is isolated upstream or inside the inverter block.',
          safetyBoundary,
          relatedEvidenceIds: ids(
            evidence('pv.actual_power_mw'),
            evidence('pv.peer_block_power_mw'),
          ),
        },
      ],
      actions: [
        {
          id: 'action-inverter-review',
          priority: 'now',
          action: 'Assign an authorized field technician to review the affected inverter block and preserve diagnostic logs.',
          rationale: 'The localized deficit and alarm justify timely inspection while the diagnosis remains unconfirmed.',
          requiresHumanApproval: true,
        },
        {
          id: 'action-forecast-caveat',
          priority: 'next-shift',
          action: 'Annotate internal energy-risk estimates with the temporary block-availability caveat.',
          rationale: 'Prevents the synthetic deficit from being misclassified as a weather-only deviation.',
          requiresHumanApproval: true,
        },
      ],
      ruleIds: ['rule-pv-localized-deficit', 'rule-inverter-derating-alarm'],
      confidenceCap: 88,
    };
  }

  if (priority.id === 'incident-pv-performance-deviation') {
    return {
      hypotheses: [
        {
          id: 'hypothesis-soiling-loss',
          classification: 'technical-hypothesis',
          statement: 'Residual soiling or uneven post-cleaning condition may contribute to the PV deficit.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(evidence('pv.performance_ratio_pct')),
          conflictingEvidenceIds: ids(evidence('maintenance.cleaning_completed')),
          uncertainty: 'No soiling index is available, and the recent cleaning record weighs against a simple soiling explanation.',
        },
        {
          id: 'hypothesis-irradiance-reference-bias',
          classification: 'technical-hypothesis',
          statement: 'The expected-power baseline may be biased by the suspect irradiance observation.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(evidence('weather.irradiance_wm2')),
          conflictingEvidenceIds: [],
          uncertainty: 'An independent irradiance reference is missing.',
        },
        {
          id: 'hypothesis-unobserved-availability-loss',
          classification: 'technical-hypothesis',
          statement: 'A partial availability loss not represented by active alarms may contribute to the deviation.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(
            evidence('pv.expected_power_mw'),
            evidence('pv.actual_power_mw'),
          ),
          conflictingEvidenceIds: ids(evidence('inverter.alarm_code')),
          uncertainty: 'The synthetic alarm list is clear and per-inverter availability is not included.',
        },
      ],
      conflicts: [
        {
          id: 'conflict-cleaning-versus-soiling',
          statement: 'Low performance is observed despite a recent synthetic cleaning record.',
          evidenceIds: ids(
            evidence('pv.performance_ratio_pct'),
            evidence('maintenance.cleaning_completed'),
          ),
          implication: 'Soiling remains possible but cannot be treated as a confirmed cause.',
        },
        {
          id: 'conflict-deficit-versus-alarm-clear',
          statement: 'The PV deficit is present while the synthetic inverter alarm list is clear.',
          evidenceIds: ids(
            evidence('pv.actual_power_mw'),
            evidence('inverter.alarm_code'),
          ),
          implication: 'Alarm absence does not prove full availability, but it weakens an alarm-led diagnosis.',
        },
      ],
      missing: [
        {
          id: 'missing-independent-irradiance',
          question: 'What does an independent, quality-checked irradiance reference report for the same interval?',
          whyItMatters: 'It is required to test whether the expected-power baseline is biased.',
        },
        {
          id: 'missing-soiling-index',
          question: 'What is the measured soiling ratio after the recorded cleaning activity?',
          whyItMatters: 'It tests the soiling hypothesis without relying on appearance or timing alone.',
        },
        {
          id: 'missing-inverter-availability',
          question: 'Are all synthetic inverter blocks reporting comparable availability and power?',
          whyItMatters: 'Per-block data is needed to distinguish plant-wide baseline error from localized loss.',
        },
      ],
      steps: [
        {
          id: 'verify-meteo-reference',
          order: 1,
          action: 'Compare the suspect irradiance sample with an authorized independent reference and inspect sensor quality flags.',
          rationale: 'Validates the baseline before attributing the power deficit to equipment.',
          safetyBoundary,
          relatedEvidenceIds: ids(evidence('weather.irradiance_wm2')),
        },
        {
          id: 'verify-block-availability',
          order: 2,
          action: 'Review read-only block-level power and availability for the same synthetic interval.',
          rationale: 'Identifies whether the deviation is localized or site-wide.',
          safetyBoundary,
          relatedEvidenceIds: ids(
            evidence('pv.actual_power_mw'),
            evidence('inverter.alarm_code'),
          ),
        },
        {
          id: 'verify-soiling-condition',
          order: 3,
          action: 'Obtain an approved soiling measurement and verify the maintenance record in the field.',
          rationale: 'Tests the residual-soiling hypothesis against direct evidence.',
          safetyBoundary,
          relatedEvidenceIds: ids(evidence('maintenance.cleaning_completed')),
        },
      ],
      actions: [
        {
          id: 'action-hold-root-cause',
          priority: 'now',
          action: 'Keep the incident classification open until independent irradiance and block-availability evidence is reviewed.',
          rationale: 'Multiple plausible explanations remain and current evidence conflicts.',
          requiresHumanApproval: true,
        },
        {
          id: 'action-preserve-samples',
          priority: 'next-shift',
          action: 'Preserve the relevant read-only telemetry and maintenance observations for technical comparison.',
          rationale: 'Supports reproducible human review without altering field equipment.',
          requiresHumanApproval: true,
        },
      ],
      ruleIds: ['rule-pv-performance-deficit', 'rule-ambiguity-cap', 'rule-conflicting-evidence'],
      confidenceCap: 49,
    };
  }

  if (priority.id === 'incident-bess-source-mismatch') {
    return {
      hypotheses: [
        {
          id: 'hypothesis-bess-scaling-or-timestamp',
          classification: 'technical-hypothesis',
          statement: 'A scaling, sign-convention, or timestamp-alignment issue may explain the EMS-versus-meter mismatch.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(
            evidence('bess.ems_soc_pct'),
            evidence('bess.meter_soc_pct'),
            evidence('bess.ems_power_mw'),
            evidence('bess.meter_power_mw'),
          ),
          conflictingEvidenceIds: [],
          uncertainty: 'The sample does not include synchronized raw registers or mapping metadata.',
        },
        {
          id: 'hypothesis-meter-calibration',
          classification: 'technical-hypothesis',
          statement: 'Independent-meter calibration or transformation metadata may contribute to the discrepancy.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(evidence('meter.calibration_verified')),
          conflictingEvidenceIds: [],
          uncertainty: 'Calibration verification is absent from the synthetic evidence pack.',
        },
      ],
      conflicts: [
        {
          id: 'conflict-bess-mismatch-without-alarm',
          statement: 'Source readings disagree while temperature and BMS alarm observations remain normal.',
          evidenceIds: ids(
            evidence('bess.ems_power_mw'),
            evidence('bess.meter_power_mw'),
            evidence('bess.temperature_c'),
            evidence('bess.alarm_code'),
          ),
          implication: 'The evidence supports a data-integrity review, not a confirmed battery hardware failure.',
        },
      ],
      missing: [
        {
          id: 'missing-bess-raw-registers',
          question: 'Are the EMS and meter samples time-aligned and using the same sign and scaling conventions?',
          whyItMatters: 'A direct source comparison is required before interpreting the mismatch physically.',
        },
        {
          id: 'missing-meter-calibration',
          question: 'Is current calibration and transformation metadata available for the synthetic meter?',
          whyItMatters: 'It establishes whether the independent comparison source is trustworthy.',
        },
        {
          id: 'missing-bms-energy-balance',
          question: 'Does the read-only BMS energy balance corroborate either SOC estimate?',
          whyItMatters: 'A third independent calculation can narrow the source-of-truth issue.',
        },
      ],
      steps: [
        {
          id: 'verify-bess-time-alignment',
          order: 1,
          action: 'Compare synchronized read-only EMS and meter samples with their timestamp, sign, and scaling metadata.',
          rationale: 'Tests the most direct telemetry-integrity explanations.',
          safetyBoundary,
          relatedEvidenceIds: ids(
            evidence('bess.ems_power_mw'),
            evidence('bess.meter_power_mw'),
          ),
        },
        {
          id: 'verify-bess-calibration',
          order: 2,
          action: 'Review the independent meter calibration and transformation record.',
          rationale: 'Confirms whether the comparison source can be treated as reference evidence.',
          safetyBoundary,
          relatedEvidenceIds: ids(evidence('meter.calibration_verified')),
        },
        {
          id: 'verify-bess-third-source',
          order: 3,
          action: 'Compare the discrepancy with authorized read-only BMS energy counters and SOC history.',
          rationale: 'Adds an independent source without changing BESS operation.',
          safetyBoundary,
          relatedEvidenceIds: ids(
            evidence('bess.ems_soc_pct'),
            evidence('bess.meter_soc_pct'),
          ),
        },
      ],
      actions: [
        {
          id: 'action-bess-data-review',
          priority: 'now',
          action: 'Flag the BESS energy-accounting view for authorized human review until source alignment is verified.',
          rationale: 'The mismatch can distort operational interpretation even without evidence of hardware failure.',
          requiresHumanApproval: true,
        },
        {
          id: 'action-bess-preserve-registers',
          priority: 'next-shift',
          action: 'Preserve synchronized read-only source samples and mapping metadata for comparison.',
          rationale: 'Supports a traceable source-of-truth decision.',
          requiresHumanApproval: true,
        },
      ],
      ruleIds: ['rule-bess-soc-delta', 'rule-bess-power-delta', 'rule-no-hardware-fault-inference'],
      confidenceCap: 69,
    };
  }

  if (priority.id === 'incident-communications-visibility-loss') {
    return {
      hypotheses: [
        {
          id: 'hypothesis-gateway-or-network-path',
          classification: 'technical-hypothesis',
          statement: 'A gateway or local network-path issue may explain the loss of current PV and BESS telemetry.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(
            evidence('communications.status'),
            evidence('data.age_minutes'),
          ),
          conflictingEvidenceIds: [],
          uncertainty: 'No local gateway health record or network diagnostic is included.',
        },
        {
          id: 'hypothesis-physical-operation-unknown',
          classification: 'technical-hypothesis',
          statement: 'The plant and BESS may still be operating, but their present physical state cannot be established from stale telemetry.',
          rootCauseStatus: 'unconfirmed',
          supportingEvidenceIds: ids(
            evidence('pv.actual_power_mw'),
            evidence('bess.ems_soc_pct'),
          ),
          conflictingEvidenceIds: ids(evidence('grid.poi_power_mw')),
          uncertainty: 'The independent current POI measurement is missing.',
        },
      ],
      conflicts: [
        {
          id: 'conflict-model-versus-stale-site-data',
          statement: 'A current synthetic expectation exists, but site power and BESS observations are stale.',
          evidenceIds: ids(
            evidence('pv.expected_power_mw'),
            evidence('pv.actual_power_mw'),
            evidence('bess.ems_soc_pct'),
          ),
          implication: 'Model expectation cannot establish current physical production or storage state.',
        },
      ],
      missing: [
        {
          id: 'missing-current-poi-power',
          question: 'What is the current read-only POI power from an independent authorized source?',
          whyItMatters: 'It is required to bound current energy impact during the telemetry outage.',
        },
        {
          id: 'missing-gateway-health',
          question: 'What do local gateway health and network diagnostics report?',
          whyItMatters: 'They distinguish a communications-path issue from a wider site outage.',
        },
        {
          id: 'missing-current-bess-state',
          question: 'What is the current locally observed BESS state from an authorized read-only source?',
          whyItMatters: 'The latest BESS SOC observation is stale.',
        },
      ],
      steps: [
        {
          id: 'verify-independent-poi',
          order: 1,
          action: 'Obtain a current read-only POI measurement from an authorized independent source.',
          rationale: 'Establishes present energy flow while primary telemetry is unavailable.',
          safetyBoundary,
          relatedEvidenceIds: ids(evidence('grid.poi_power_mw')),
        },
        {
          id: 'verify-gateway-local-health',
          order: 2,
          action: 'Have an authorized technician inspect local gateway health indicators and preserved network diagnostics.',
          rationale: 'Tests the communications-path hypothesis locally.',
          safetyBoundary,
          relatedEvidenceIds: ids(
            evidence('communications.status'),
            evidence('data.age_minutes'),
          ),
        },
        {
          id: 'verify-current-asset-state',
          order: 3,
          action: 'Confirm current PV and BESS status through approved local read-only observations.',
          rationale: 'Separates telemetry visibility loss from physical asset unavailability.',
          safetyBoundary,
          relatedEvidenceIds: ids(
            evidence('pv.actual_power_mw'),
            evidence('bess.ems_soc_pct'),
          ),
        },
      ],
      actions: [
        {
          id: 'action-communications-escalation',
          priority: 'now',
          action: 'Escalate the loss of operational visibility to the authorized site and communications teams.',
          rationale: 'Current PV and BESS state cannot be trusted from stale telemetry.',
          requiresHumanApproval: true,
        },
        {
          id: 'action-mark-data-gap',
          priority: 'now',
          action: 'Mark the outage interval as unavailable for definitive performance or energy conclusions.',
          rationale: 'Prevents stale values from being treated as current facts.',
          requiresHumanApproval: true,
        },
      ],
      ruleIds: ['rule-communications-offline', 'rule-stale-data', 'rule-energy-risk-not-quantifiable'],
      confidenceCap: 39,
    };
  }

  return {
    hypotheses: [],
    conflicts: [],
    missing: [
      {
        id: 'missing-rule-threshold-evidence',
        question: 'What additional validated evidence is available for this event?',
        whyItMatters: 'No deterministic incident rule crossed its threshold.',
      },
    ],
    steps: [
      {
        id: 'verify-additional-evidence',
        order: 1,
        action: 'Collect additional authorized read-only observations for human review.',
        rationale: 'The current sample does not support a more specific assessment.',
        safetyBoundary,
        relatedEvidenceIds: priority.evidenceIds,
      },
    ],
    actions: [
      {
        id: 'action-monitor',
        priority: 'planned',
        action: 'Continue human review of validated read-only evidence.',
        rationale: 'No specific deterministic incident threshold was reached.',
        requiresHumanApproval: true,
      },
    ],
    ruleIds: ['rule-evidence-review-fallback'],
    confidenceCap: 45,
  };
};

const qualityWeight = {
  valid: 100,
  suspect: 55,
  stale: 25,
  missing: 0,
} as const;

const confidenceLevel = (score: number): ConfidenceLevel =>
  score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

const createConfidence = (
  scenario: IncidentScenario,
  priority: IncidentCandidate,
  pack: ExplanationPack,
): IncidentConfidence => {
  const total = scenario.observations.length;
  const evidenceQualityScore = round(
    scenario.observations.reduce(
      (sum, item) => sum + qualityWeight[item.quality],
      0,
    ) / total,
    0,
  );
  const missingCount = scenario.observations.filter(
    (item) => item.quality === 'missing',
  ).length;
  const staleCount = scenario.observations.filter(
    (item) => item.quality === 'stale',
  ).length;
  const suspectCount = scenario.observations.filter(
    (item) => item.quality === 'suspect',
  ).length;
  const supportScore = Math.min(priority.evidenceIds.length / 3, 1) * 25;
  const rawScore =
    evidenceQualityScore * 0.55 +
    supportScore +
    20 -
    missingCount * 3 -
    staleCount * 3 -
    suspectCount * 3 -
    pack.conflicts.length * 5;
  const score = Math.max(10, Math.min(pack.confidenceCap, Math.round(rawScore)));
  const drivers = [
    `${priority.evidenceIds.length} observations directly support the priority pattern.`,
    `${missingCount} missing, ${staleCount} stale, and ${suspectCount} suspect observations affect certainty.`,
    `${pack.conflicts.length} explicit evidence conflict(s) remain visible.`,
  ];
  return {
    score,
    level: confidenceLevel(score),
    evidenceQualityScore,
    drivers,
    uncertainty:
      score >= 75
        ? 'The incident pattern is well supported, but the underlying technical trigger still requires field confirmation.'
        : score >= 50
          ? 'The incident pattern is credible, but missing independent evidence limits causal confidence.'
          : 'Current evidence is insufficient for a definitive cause or complete energy-impact estimate.',
  };
};

const operationalRiskLevel = (score: number): OperationalRiskLevel =>
  score >= 90 ? 'critical' : score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low';

const createRisk = (
  scenario: IncidentScenario,
  priority: IncidentCandidate,
): IncidentRisk => {
  const hours = durationHours(scenario);
  const expected = numberObservation(scenario, 'pv.expected_power_mw');
  const actual = numberObservation(scenario, 'pv.actual_power_mw');
  const emsPower = numberObservation(scenario, 'bess.ems_power_mw');
  const meterPower = numberObservation(scenario, 'bess.meter_power_mw');
  let affectedPowerMw: number | null = null;

  if (expected && actual) {
    affectedPowerMw = Math.min(
      scenario.asset.capacityMw,
      Math.max(0, expected.value - actual.value),
    );
  } else if (emsPower && meterPower) {
    affectedPowerMw = Math.min(
      scenario.asset.capacityMw,
      Math.abs(emsPower.value - meterPower.value),
    );
  }

  const operationalLevel = operationalRiskLevel(priority.score);
  if (affectedPowerMw === null) {
    return {
      operationalLevel,
      operationalSummary:
        'Operational visibility is materially impaired; current physical PV/BESS state requires human verification.',
      energy: {
        quantification: 'not-quantifiable',
        lowMwh: null,
        likelyMwh: null,
        highMwh: null,
        affectedPowerMw: null,
        basis: 'No current valid independent power observation is available.',
        assumptions: [
          'Stale telemetry is not treated as current physical production.',
          'No energy value is invented from model expectation alone.',
        ],
      },
    };
  }

  const likelyMwh = round(affectedPowerMw * hours);
  return {
    operationalLevel,
    operationalSummary:
      priority.id === 'incident-bess-source-mismatch'
        ? 'The source mismatch can distort BESS energy accounting and operational interpretation until reviewed.'
        : 'The synthetic power deficit creates material availability and energy exposure during the assessed window.',
    energy: {
      quantification: 'bounded',
      lowMwh: round(likelyMwh * 0.8),
      likelyMwh,
      highMwh: round(likelyMwh * 1.2),
      affectedPowerMw: round(affectedPowerMw),
      basis:
        priority.id === 'incident-bess-source-mismatch'
          ? 'Absolute difference between synchronized synthetic EMS and meter power over the scenario window.'
          : 'Positive difference between valid synthetic expected and measured power over the scenario window.',
      assumptions: [
        `The assessed duration is ${round(hours)} hours.`,
        'The power difference is held constant only to create a transparent synthetic bound.',
        'The estimate is advisory and not a settlement, dispatch, or regulatory value.',
      ],
    },
  };
};

const createExecutiveSummary = (
  priority: IncidentCandidate,
  risk: IncidentRisk,
  confidence: IncidentConfidence,
  pack: ExplanationPack,
) => {
  const energySummary =
    risk.energy.quantification === 'bounded'
      ? `Synthetic energy exposure is bounded at ${risk.energy.lowMwh}-${risk.energy.highMwh} MWh, with ${risk.energy.likelyMwh} MWh as the transparent midpoint.`
      : 'Energy exposure cannot be quantified from current valid evidence.';
  const hypothesisSummary =
    pack.hypotheses.length === 1
      ? '1 technical hypothesis remains unconfirmed'
      : `${pack.hypotheses.length} technical hypotheses remain unconfirmed`;

  return `${priority.title} is the priority incident based on ${priority.evidenceIds.length} directly linked observation(s). ${energySummary} Confidence is ${confidence.level} (${confidence.score}/100). ${hypothesisSummary}, and human review is required before any O&M action.`;
};

export const analyzeIncidentDeterministically = (
  scenario: IncidentScenario,
): IncidentAssessment => {
  const scenarioValidation = validateIncidentScenario(scenario);
  if (scenarioValidation.ok === false) {
    throw new Error(
      `Invalid incident scenario: ${scenarioValidation.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ')}`,
    );
  }

  const priority = createIncidentCandidates(scenario)[0];
  const pack = createExplanationPack(scenario, priority);
  const confidence = createConfidence(scenario, priority, pack);
  const risk = createRisk(scenario, priority);
  const traceEvidenceIds = Array.from(
    new Set([
      ...priority.evidenceIds,
      ...pack.hypotheses.flatMap((item) => [
        ...item.supportingEvidenceIds,
        ...item.conflictingEvidenceIds,
      ]),
      ...pack.conflicts.flatMap((item) => item.evidenceIds),
      ...pack.steps.flatMap((item) => item.relatedEvidenceIds),
    ]),
  );

  return {
    schemaVersion: '1.0',
    assessmentId: `${scenario.id}:${INCIDENT_ENGINE_VERSION}:${scenario.analysisAsOf}`,
    scenarioId: scenario.id,
    analyzedAt: scenario.analysisAsOf,
    provider: {
      id: 'deterministic-local-evidence-engine',
      label: 'Deterministic local evidence engine',
      engineVersion: INCIDENT_ENGINE_VERSION,
    },
    priorityIncident: priority,
    confirmedFacts: createConfirmedFacts(scenario),
    hypotheses: pack.hypotheses,
    conflictingEvidence: pack.conflicts,
    missingInformation: pack.missing,
    verificationSteps: pack.steps,
    advisoryActions: pack.actions,
    risk,
    confidence,
    executiveSummary: createExecutiveSummary(priority, risk, confidence, pack),
    review: {
      state: 'pending-review',
      note: '',
      authority: 'human-only',
    },
    trace: {
      ruleIds: pack.ruleIds,
      evidenceIds: traceEvidenceIds,
    },
  };
};
