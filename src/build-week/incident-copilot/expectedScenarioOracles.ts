export const EXPECTED_SCENARIO_ORACLES = {
  'synthetic-pv-inverter-block-derating': {
    priorityIncidentId: 'incident-inverter-block-derating',
    confidenceScore: 88,
    factCount: 5,
    hypothesisCount: 1,
    energyRisk: { lowMwh: 8.4, likelyMwh: 10.5, highMwh: 12.6 },
  },
  'synthetic-ambiguous-pv-underperformance': {
    priorityIncidentId: 'incident-pv-performance-deviation',
    confidenceScore: 49,
    factCount: 5,
    hypothesisCount: 3,
    energyRisk: { lowMwh: 21.6, likelyMwh: 27, highMwh: 32.4 },
  },
  'synthetic-bess-ems-meter-mismatch': {
    priorityIncidentId: 'incident-bess-source-mismatch',
    confidenceScore: 69,
    factCount: 6,
    hypothesisCount: 2,
    energyRisk: { lowMwh: 2.08, likelyMwh: 2.6, highMwh: 3.12 },
  },
  'synthetic-hybrid-communication-loss': {
    priorityIncidentId: 'incident-communications-visibility-loss',
    confidenceScore: 39,
    factCount: 2,
    hypothesisCount: 2,
    energyRisk: null,
  },
} as const;
