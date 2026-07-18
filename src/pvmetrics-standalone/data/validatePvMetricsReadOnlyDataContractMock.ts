import {
  PVMetricsReadOnlyDataPacket,
  PVMetricsReadOnlyDataQualityStatus,
  PVMetricsReadOnlyForbiddenOperation,
  PVMetricsReadOnlyFreshnessStatus,
  PVMetricsReadOnlyNormalizedSignal,
  PVMetricsReadOnlySourceDescriptor,
} from '../types/pvmetrics-readonly-data-contract.types';

type ValidatePvMetricsReadOnlyDataContractMockInput = {
  packetId?: string;
  sourceDescriptor?: PVMetricsReadOnlySourceDescriptor;
  signals?: PVMetricsReadOnlyNormalizedSignal[];
  attemptedOperations?: PVMetricsReadOnlyForbiddenOperation[];
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const defaultSourceDescriptor: PVMetricsReadOnlySourceDescriptor = {
  sourceId: 'mock-readonly-source',
  sourceName: 'ORBI PVMetrics Mock Read-Only Source',
  sourceType: 'mock',
  connectorFamily: 'manual-mock',
  accessMode: 'mock-only',
  isRealConnector: false,
  isMockSafe: true,
  description:
    'Fuente local mock para validar contrato read-only sin conectores reales.',
};

const createDefaultSignals = (): PVMetricsReadOnlyNormalizedSignal[] => [
  {
    signalId: 'mock-forecast-energy',
    label: 'Forecast Energy Mock',
    domain: 'forecast',
    value: 52,
    unit: 'MWh',
    sourceId: 'mock-readonly-source',
    measuredAtLabel: getGeneratedAtLabel(),
    generatedAtLabel: getGeneratedAtLabel(),
    freshnessStatus: 'fresh',
    dataQualityStatus: 'valid',
    assetSeparation: 'pv-only',
    notes: ['Dato mock local seguro.'],
  },
  {
    signalId: 'mock-soiling-loss',
    label: 'Soiling Loss Mock',
    domain: 'soiling-cleaning',
    value: 4.8,
    unit: 'percent',
    sourceId: 'mock-readonly-source',
    measuredAtLabel: getGeneratedAtLabel(),
    generatedAtLabel: getGeneratedAtLabel(),
    freshnessStatus: 'fresh',
    dataQualityStatus: 'valid',
    assetSeparation: 'pv-only',
    notes: ['Dato mock local seguro.'],
  },
];

const mergeUnique = (items: string[]) => Array.from(new Set(items));

const resolveFreshnessStatus = (
  signals: PVMetricsReadOnlyNormalizedSignal[],
): PVMetricsReadOnlyFreshnessStatus => {
  if (signals.length === 0) return 'missing';
  if (signals.some((signal) => signal.freshnessStatus === 'rejected')) {
    return 'rejected';
  }
  if (signals.some((signal) => signal.freshnessStatus === 'missing')) {
    return 'missing';
  }
  if (signals.some((signal) => signal.freshnessStatus === 'timestamp-missing')) {
    return 'timestamp-missing';
  }
  if (signals.some((signal) => signal.freshnessStatus === 'stale')) {
    return 'stale';
  }
  if (signals.some((signal) => signal.freshnessStatus === 'unknown')) {
    return 'unknown';
  }
  return 'fresh';
};

const getSignalBlockedReasons = (
  signal: PVMetricsReadOnlyNormalizedSignal,
): string[] => {
  const reasons: string[] = [];

  if (!signal.sourceId) {
    reasons.push(`Signal ${signal.signalId}: sourceId missing.`);
  }

  if (!signal.measuredAtLabel) {
    reasons.push(`Signal ${signal.signalId}: measuredAt timestamp missing.`);
  }

  if (signal.unit === 'UNKNOWN') {
    reasons.push(`Signal ${signal.signalId}: unknown unit.`);
  }

  if (signal.assetSeparation === 'mixed-rejected') {
    reasons.push(`Signal ${signal.signalId}: FV/BESS mixed data rejected.`);
  }

  if (
    signal.dataQualityStatus === 'blocked' ||
    signal.dataQualityStatus === 'unit-conflict' ||
    signal.dataQualityStatus === 'source-missing' ||
    signal.dataQualityStatus === 'timestamp-missing' ||
    signal.dataQualityStatus === 'fv-bess-mixed'
  ) {
    reasons.push(
      `Signal ${signal.signalId}: data quality status is ${signal.dataQualityStatus}.`,
    );
  }

  if (
    signal.freshnessStatus === 'rejected' ||
    signal.freshnessStatus === 'missing'
  ) {
    reasons.push(
      `Signal ${signal.signalId}: freshness status is ${signal.freshnessStatus}.`,
    );
  }

  return reasons;
};

const getSignalWarnings = (
  signal: PVMetricsReadOnlyNormalizedSignal,
): string[] => {
  const warnings: string[] = [];

  if (signal.freshnessStatus === 'stale') {
    warnings.push(`Signal ${signal.signalId}: stale data.`);
  }

  if (signal.freshnessStatus === 'unknown') {
    warnings.push(`Signal ${signal.signalId}: unknown freshness.`);
  }

  if (
    signal.dataQualityStatus === 'warning' ||
    signal.dataQualityStatus === 'incomplete' ||
    signal.dataQualityStatus === 'human-review-required'
  ) {
    warnings.push(
      `Signal ${signal.signalId}: data quality requires review (${signal.dataQualityStatus}).`,
    );
  }

  if (signal.assetSeparation === 'unknown') {
    warnings.push(`Signal ${signal.signalId}: asset separation unknown.`);
  }

  return warnings;
};

const resolveDataQualityStatus = (
  blockedReasons: string[],
  warnings: string[],
): PVMetricsReadOnlyDataQualityStatus => {
  if (blockedReasons.some((reason) => reason.includes('FV/BESS'))) {
    return 'fv-bess-mixed';
  }

  if (blockedReasons.some((reason) => reason.includes('unknown unit'))) {
    return 'unit-conflict';
  }

  if (blockedReasons.some((reason) => reason.includes('sourceId'))) {
    return 'source-missing';
  }

  if (blockedReasons.some((reason) => reason.includes('timestamp'))) {
    return 'timestamp-missing';
  }

  if (blockedReasons.length > 0) return 'blocked';
  if (warnings.length > 0) return 'warning';

  return 'valid';
};

export const validatePvMetricsReadOnlyDataContractMock = ({
  packetId = 'mock-readonly-data-packet',
  sourceDescriptor = defaultSourceDescriptor,
  signals = createDefaultSignals(),
  attemptedOperations = [],
}: ValidatePvMetricsReadOnlyDataContractMockInput = {}): PVMetricsReadOnlyDataPacket => {
  const blockedReasons: string[] = [];
  const warnings: string[] = [];

  if (sourceDescriptor.isRealConnector) {
    blockedReasons.push('Real connector detected. Only mock/read-only contracts are allowed.');
  }

  if (sourceDescriptor.accessMode === 'blocked') {
    blockedReasons.push('Source access mode is blocked.');
  }

  if (
    sourceDescriptor.accessMode !== 'read-only' &&
    sourceDescriptor.accessMode !== 'mock-only' &&
    sourceDescriptor.accessMode !== 'contract-only' &&
    sourceDescriptor.accessMode !== 'no-submit'
  ) {
    blockedReasons.push(`Unsupported access mode: ${sourceDescriptor.accessMode}.`);
  }

  if (attemptedOperations.length > 0) {
    blockedReasons.push(
      `Forbidden operations attempted: ${attemptedOperations.join(', ')}.`,
    );
  }

  if (signals.length === 0) {
    blockedReasons.push('No signals provided in read-only data packet.');
  }

  signals.forEach((signal) => {
    blockedReasons.push(...getSignalBlockedReasons(signal));
    warnings.push(...getSignalWarnings(signal));
  });

  const uniqueBlockedReasons = mergeUnique(blockedReasons);
  const uniqueWarnings = mergeUnique(warnings);

  const freshnessStatus = resolveFreshnessStatus(signals);
  const dataQualityStatus = resolveDataQualityStatus(
    uniqueBlockedReasons,
    uniqueWarnings,
  );

  return {
    packetId,
    generatedAtLabel: getGeneratedAtLabel(),
    sourceDescriptor,
    signals,
    freshnessStatus,
    dataQualityStatus,
    blockedReasons: uniqueBlockedReasons,
    warnings: uniqueWarnings,
    safetyBoundary:
      'Este validador es mock, local y read-only. No crea conectores reales, no conecta SCADA, no lee medidores reales, no llama weather APIs, no envía información al CEN, no usa credenciales, no usa secrets, no ejecuta POST/PUT/PATCH/DELETE, no controla BESS, no controla inversores y no modifica setpoints.',
  };
};
