import type { GovernedObservation, GovernedOperationalCatalog } from '../contracts';

export type SyntheticOperationalFixture = GovernedOperationalCatalog & {
  observation: GovernedObservation;
};

export const createSyntheticOperationalFixture = (): SyntheticOperationalFixture => ({
  assets: [{
    assetId: 'SYNTH-ASSET-INVERTER-01',
    plantId: 'SYNTH-PLANT-01',
    assetType: 'INVERTER',
    displayName: 'Synthetic inverter 01',
    verificationState: 'SOURCE_DECLARED',
    referenceable: true,
  }],
  sources: [{
    sourceId: 'SYNTH-SOURCE-TELEMETRY-01',
    sourceType: 'SYNTHETIC_DEMO',
    sourceSystem: 'ORBI_SYNTHETIC_DEMO',
    provenance: 'SYNTHETIC',
    verificationState: 'SOURCE_DECLARED',
    reference: 'Synthetic fixture only; no live connection.',
    referenceable: true,
  }],
  signals: [{
    signalId: 'SYNTH-SIGNAL-AC_POWER',
    signalKey: 'ac_power_kw',
    assetTypes: ['INVERTER'],
    displayLabel: 'Synthetic AC power',
    declaredUnit: 'kW',
    valueType: 'NUMBER',
    verificationState: 'SOURCE_DECLARED',
    referenceable: true,
  }],
  evidence: [{
    evidenceId: 'SYNTH-EVIDENCE-TELEMETRY-01',
    evidenceType: 'CSV_EXPORT',
    reference: 'synthetic://operational-data/telemetry-01.csv',
    sourceId: 'SYNTH-SOURCE-TELEMETRY-01',
    sha256: 'synthetic-fixture-hash-not-authenticity-proof',
    capturedAt: '2026-01-01T12:00:00.000Z',
    verificationState: 'SOURCE_DECLARED',
    referenceable: true,
  }],
  observation: {
    observationId: 'SYNTH-OBSERVATION-AC_POWER-01',
    assetId: 'SYNTH-ASSET-INVERTER-01',
    signalId: 'SYNTH-SIGNAL-AC_POWER',
    signalKey: 'ac_power_kw',
    sourceId: 'SYNTH-SOURCE-TELEMETRY-01',
    timestamp: '2026-01-01T12:00:00.000Z',
    value: 125.4,
    unit: 'kW',
    quality: 'GOOD',
    provenance: 'SYNTHETIC',
    verificationState: 'SOURCE_DECLARED',
    evidenceIds: ['SYNTH-EVIDENCE-TELEMETRY-01'],
  },
});
