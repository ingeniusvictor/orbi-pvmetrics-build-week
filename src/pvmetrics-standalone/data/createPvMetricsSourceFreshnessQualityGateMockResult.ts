import { validatePvMetricsReadOnlyDataContractMock } from './validatePvMetricsReadOnlyDataContractMock';
import {
  PVMetricsReadOnlyDataPacket,
  PVMetricsReadOnlyForbiddenOperation,
  PVMetricsReadOnlyNormalizedSignal,
} from '../types/pvmetrics-readonly-data-contract.types';
import {
  PVMetricsSourceDataQualityAssessment,
  PVMetricsSourceForbiddenOperationAssessment,
  PVMetricsSourceFreshnessAssessment,
  PVMetricsSourceQualityGateCheck,
  PVMetricsSourceQualityGateDecision,
  PVMetricsSourceQualityGateFinding,
  PVMetricsSourceQualityGateResult,
  PVMetricsSourceQualityGateStatus,
} from '../types/pvmetrics-source-freshness-quality-gate.types';

type CreatePvMetricsSourceFreshnessQualityGateMockResultInput = {
  packet?: PVMetricsReadOnlyDataPacket;
  attemptedOperations?: PVMetricsReadOnlyForbiddenOperation[];
};

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const getPrimarySignal = (
  packet: PVMetricsReadOnlyDataPacket,
): PVMetricsReadOnlyNormalizedSignal | null => packet.signals[0] ?? null;

const resolveFreshnessAssessment = (
  packet: PVMetricsReadOnlyDataPacket,
): PVMetricsSourceFreshnessAssessment => {
  const primarySignal = getPrimarySignal(packet);

  const isStale =
    packet.freshnessStatus === 'stale' ||
    packet.freshnessStatus === 'unknown' ||
    packet.freshnessStatus === 'timestamp-missing';

  const isBlocked =
    packet.freshnessStatus === 'missing' ||
    packet.freshnessStatus === 'rejected' ||
    packet.freshnessStatus === 'timestamp-missing';

  return {
    freshnessStatus: packet.freshnessStatus,
    measuredAtLabel: primarySignal?.measuredAtLabel ?? null,
    generatedAtLabel: packet.generatedAtLabel,
    ageMinutesLabel: isBlocked
      ? 'No evaluable'
      : isStale
        ? 'Mayor al umbral mock'
        : 'Dentro del umbral mock',
    windowLabel: `${primarySignal?.domain ?? 'data-quality'} mock window`,
    isStale,
    isBlocked,
    explanation: isBlocked
      ? 'El paquete no puede ser usado automáticamente por missing/rejected/timestamp-missing.'
      : isStale
        ? 'El paquete puede requerir revisión por freshness no óptima.'
        : 'El paquete se considera fresco dentro del escenario mock.',
  };
};

const resolveDataQualityAssessment = (
  packet: PVMetricsReadOnlyDataPacket,
): PVMetricsSourceDataQualityAssessment => {
  const primarySignal = getPrimarySignal(packet);

  return {
    dataQualityStatus: packet.dataQualityStatus,
    unit: primarySignal?.unit ?? 'UNKNOWN',
    assetSeparation: primarySignal?.assetSeparation ?? 'unknown',
    sourceIdPresent: Boolean(primarySignal?.sourceId),
    timestampPresent: Boolean(primarySignal?.measuredAtLabel),
    unitRecognized: primarySignal?.unit !== 'UNKNOWN',
    fvBessSeparated:
      primarySignal?.assetSeparation === 'pv-only' ||
      primarySignal?.assetSeparation === 'bess-only' ||
      primarySignal?.assetSeparation === 'poi-total' ||
      primarySignal?.assetSeparation === 'not-applicable',
    explanation:
      packet.dataQualityStatus === 'valid'
        ? 'La calidad de datos mock permite uso conceptual.'
        : 'La calidad de datos mock requiere advertencia, bloqueo o revisión humana.',
  };
};

const createForbiddenOperationAssessments = (
  attemptedOperations: PVMetricsReadOnlyForbiddenOperation[],
): PVMetricsSourceForbiddenOperationAssessment[] =>
  attemptedOperations.map((attemptedOperation) => ({
    attemptedOperation,
    blocked: true,
    reason: `Operación prohibida detectada: ${attemptedOperation}. El flujo read-only debe bloquearla.`,
  }));

const createChecks = (
  packet: PVMetricsReadOnlyDataPacket,
  attemptedOperations: PVMetricsReadOnlyForbiddenOperation[],
): PVMetricsSourceQualityGateCheck[] => {
  const primarySignal = getPrimarySignal(packet);

  return [
    {
      checkId: 'check-source-id',
      category: 'source-id',
      label: 'Source ID',
      status: primarySignal?.sourceId ? 'passed' : 'blocked',
      severity: primarySignal?.sourceId ? 'info' : 'blocking',
      decision: primarySignal?.sourceId ? 'allow-mock-use' : 'reject-packet',
      details: primarySignal?.sourceId
        ? `sourceId presente: ${primarySignal.sourceId}`
        : 'sourceId ausente.',
      recommendedAction:
        'Mantener sourceId obligatorio para toda señal read-only.',
    },
    {
      checkId: 'check-timestamp',
      category: 'timestamp',
      label: 'Timestamp',
      status: primarySignal?.measuredAtLabel ? 'passed' : 'blocked',
      severity: primarySignal?.measuredAtLabel ? 'info' : 'blocking',
      decision: primarySignal?.measuredAtLabel
        ? 'allow-mock-use'
        : 'reject-packet',
      details: primarySignal?.measuredAtLabel
        ? `measuredAt: ${primarySignal.measuredAtLabel}`
        : 'Timestamp ausente.',
      recommendedAction:
        'Bloquear interpretación automática si no existe timestamp.',
    },
    {
      checkId: 'check-freshness',
      category: 'freshness',
      label: 'Freshness',
      status:
        packet.freshnessStatus === 'fresh'
          ? 'passed'
          : packet.freshnessStatus === 'stale' ||
              packet.freshnessStatus === 'unknown'
            ? 'passed-with-warnings'
            : 'blocked',
      severity:
        packet.freshnessStatus === 'fresh'
          ? 'info'
          : packet.freshnessStatus === 'stale'
            ? 'warning'
            : 'blocking',
      decision:
        packet.freshnessStatus === 'fresh'
          ? 'allow-mock-use'
          : packet.freshnessStatus === 'stale' ||
              packet.freshnessStatus === 'unknown'
            ? 'allow-with-warning'
            : 'reject-packet',
      details: `freshnessStatus: ${packet.freshnessStatus}`,
      recommendedAction:
        'Revisar freshness antes de alimentar motores de forecast o executive intelligence.',
    },
    {
      checkId: 'check-unit',
      category: 'unit',
      label: 'Unidad',
      status: primarySignal?.unit && primarySignal.unit !== 'UNKNOWN'
        ? 'passed'
        : 'blocked',
      severity: primarySignal?.unit && primarySignal.unit !== 'UNKNOWN'
        ? 'info'
        : 'blocking',
      decision: primarySignal?.unit && primarySignal.unit !== 'UNKNOWN'
        ? 'allow-mock-use'
        : 'reject-packet',
      details: `unit: ${primarySignal?.unit ?? 'UNKNOWN'}`,
      recommendedAction:
        'Normalizar unidades antes de usar cualquier señal.',
    },
    {
      checkId: 'check-asset-separation',
      category: 'asset-separation',
      label: 'Separación FV/BESS',
      status:
        primarySignal?.assetSeparation === 'mixed-rejected'
          ? 'blocked'
          : primarySignal?.assetSeparation === 'unknown'
            ? 'human-review-required'
            : 'passed',
      severity:
        primarySignal?.assetSeparation === 'mixed-rejected'
          ? 'critical'
          : primarySignal?.assetSeparation === 'unknown'
            ? 'warning'
            : 'info',
      decision:
        primarySignal?.assetSeparation === 'mixed-rejected'
          ? 'reject-packet'
          : primarySignal?.assetSeparation === 'unknown'
            ? 'require-human-review'
            : 'allow-mock-use',
      details: `assetSeparation: ${primarySignal?.assetSeparation ?? 'unknown'}`,
      recommendedAction:
        'Mantener señales FV, BESS y POI separadas antes de cualquier cálculo.',
    },
    {
      checkId: 'check-forbidden-operations',
      category: 'forbidden-operation',
      label: 'Operaciones prohibidas',
      status: attemptedOperations.length > 0 ? 'blocked' : 'passed',
      severity: attemptedOperations.length > 0 ? 'critical' : 'info',
      decision:
        attemptedOperations.length > 0 ? 'reject-packet' : 'allow-mock-use',
      details:
        attemptedOperations.length > 0
          ? attemptedOperations.join(', ')
          : 'No se detectaron operaciones prohibidas.',
      recommendedAction:
        'Bloquear cualquier intento POST/PUT/PATCH/DELETE, telecontrol, setpoint o comando.',
    },
  ];
};

const createFindings = (
  blockedReasons: string[],
  warnings: string[],
  humanReviewReasons: string[],
): PVMetricsSourceQualityGateFinding[] => [
  ...blockedReasons.map((message, index) => ({
    findingId: `blocked-${index + 1}`,
    category: 'safety-boundary' as const,
    severity: 'blocking' as const,
    title: 'Bloqueo del gate',
    message,
    decision: 'reject-packet' as const,
  })),
  ...warnings.map((message, index) => ({
    findingId: `warning-${index + 1}`,
    category: 'data-quality' as const,
    severity: 'warning' as const,
    title: 'Advertencia del gate',
    message,
    decision: 'allow-with-warning' as const,
  })),
  ...humanReviewReasons.map((message, index) => ({
    findingId: `review-${index + 1}`,
    category: 'human-review' as const,
    severity: 'warning' as const,
    title: 'Revisión humana requerida',
    message,
    decision: 'require-human-review' as const,
  })),
];

const resolveOverallStatus = (
  checks: PVMetricsSourceQualityGateCheck[],
): PVMetricsSourceQualityGateStatus => {
  if (checks.some((check) => check.status === 'blocked')) return 'blocked';
  if (checks.some((check) => check.status === 'human-review-required')) {
    return 'human-review-required';
  }
  if (checks.some((check) => check.status === 'passed-with-warnings')) {
    return 'passed-with-warnings';
  }
  return 'passed';
};

const resolveOverallDecision = (
  overallStatus: PVMetricsSourceQualityGateStatus,
): PVMetricsSourceQualityGateDecision => {
  if (overallStatus === 'blocked') return 'reject-packet';
  if (overallStatus === 'human-review-required') return 'require-human-review';
  if (overallStatus === 'passed-with-warnings') return 'allow-with-warning';
  if (overallStatus === 'passed') return 'allow-mock-use';
  return 'block-automatic-use';
};

export const createPvMetricsSourceFreshnessQualityGateMockResult = ({
  packet,
  attemptedOperations = [],
}: CreatePvMetricsSourceFreshnessQualityGateMockResultInput = {}): PVMetricsSourceQualityGateResult => {
  const readOnlyPacket =
    packet ?? validatePvMetricsReadOnlyDataContractMock({ attemptedOperations });

  const primarySignal = getPrimarySignal(readOnlyPacket);
  const freshnessAssessment = resolveFreshnessAssessment(readOnlyPacket);
  const dataQualityAssessment = resolveDataQualityAssessment(readOnlyPacket);
  const forbiddenOperationAssessments =
    createForbiddenOperationAssessments(attemptedOperations);

  const checks = createChecks(readOnlyPacket, attemptedOperations);

  const humanReviewReasons = checks
    .filter((check) => check.status === 'human-review-required')
    .map((check) => check.details);

  const blockedReasons = [
    ...readOnlyPacket.blockedReasons,
    ...forbiddenOperationAssessments.map((item) => item.reason),
  ];

  const warnings = readOnlyPacket.warnings;

  const findings = createFindings(
    blockedReasons,
    warnings,
    humanReviewReasons,
  );

  const overallStatus = resolveOverallStatus(checks);
  const overallDecision = resolveOverallDecision(overallStatus);

  return {
    gateId: `source-quality-gate-${readOnlyPacket.packetId}`,
    generatedAtLabel: getGeneratedAtLabel(),
    sourceId: readOnlyPacket.sourceDescriptor.sourceId,
    sourceName: readOnlyPacket.sourceDescriptor.sourceName,
    domain: primarySignal?.domain ?? 'data-quality',
    overallStatus,
    overallDecision,
    freshnessAssessment,
    dataQualityAssessment,
    forbiddenOperationAssessments,
    checks,
    findings,
    blockedReasons,
    warnings,
    humanReviewReasons,
    safetyBoundary:
      'Este Source Freshness & Data Quality Gate es mock, local y read-only. No crea conectores reales, no conecta SCADA, no lee medidores reales, no llama weather APIs, no envía información al CEN, no usa credenciales, no usa secrets, no ejecuta POST/PUT/PATCH/DELETE, no controla BESS, no controla inversores y no modifica setpoints.',
  };
};
