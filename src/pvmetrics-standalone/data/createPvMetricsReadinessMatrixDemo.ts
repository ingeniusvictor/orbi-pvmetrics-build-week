import { createPvMetricsDataSourcesDemo } from './createPvMetricsDataSourcesDemo';
import { createPvMetricsSignalMappingDemo } from './createPvMetricsSignalMappingDemo';
import { createPvMetricsSignalQualityRulesDemo } from './createPvMetricsSignalQualityRulesDemo';

import {
  PVMetricsReadinessAuthorizationStatus,
  PVMetricsReadinessMatrixDataset,
  PVMetricsReadinessMatrixRow,
  PVMetricsReadinessRecommendedAction,
  PVMetricsReadinessRiskLevel,
  PVMetricsReadinessStatus,
} from '../types/pvmetrics-readiness-matrix.types';

const clampPct = (value: number) => Math.max(0, Math.min(100, value));

const resolveAuthorizationStatus = (
  expectedSource: string,
  sourceStatus?: string,
): PVMetricsReadinessAuthorizationStatus => {
  if (expectedSource === 'demo-local') return 'authorized-demo';

  if (sourceStatus === 'active-demo' || sourceStatus === 'simulated') {
    return 'authorized-demo';
  }

  if (sourceStatus === 'available') {
    return 'authorized-readonly';
  }

  if (sourceStatus === 'not-authorized') {
    return 'not-authorized';
  }

  if (sourceStatus === 'pending') {
    return 'pending-client-approval';
  }

  return 'pending-client-approval';
};

const resolveReadinessStatus = (
  qualityPct: number,
  authorizationStatus: PVMetricsReadinessAuthorizationStatus,
  ruleStatus?: string,
): PVMetricsReadinessStatus => {
  if (authorizationStatus === 'not-authorized') return 'blocked';

  if (ruleStatus === 'failed' || ruleStatus === 'blocked') return 'not-ready';

  if (authorizationStatus === 'authorized-readonly' && qualityPct >= 85) {
    return 'ready-readonly';
  }

  if (authorizationStatus === 'authorized-demo' && qualityPct >= 80) {
    return 'ready-demo';
  }

  if (qualityPct >= 60) return 'partial';

  return 'not-ready';
};

const resolveRiskLevel = (
  readinessStatus: PVMetricsReadinessStatus,
  criticality: string,
): PVMetricsReadinessRiskLevel => {
  if (readinessStatus === 'blocked') return 'critical';
  if (readinessStatus === 'not-ready' && criticality === 'critical') return 'critical';
  if (readinessStatus === 'not-ready') return 'high';
  if (readinessStatus === 'partial') return 'medium';
  return 'low';
};

const resolveRecommendedAction = (
  expectedSource: string,
  authorizationStatus: PVMetricsReadinessAuthorizationStatus,
  readinessStatus: PVMetricsReadinessStatus,
): PVMetricsReadinessRecommendedAction => {
  if (authorizationStatus === 'not-authorized') return 'block-until-authorized';

  if (authorizationStatus === 'pending-client-approval') {
    return 'request-client-approval';
  }

  if (readinessStatus === 'ready-demo') return 'keep-demo';

  if (readinessStatus === 'ready-readonly') return 'prepare-readonly-pilot';

  if (expectedSource === 'scada-readonly') return 'confirm-scada-tag';

  if (expectedSource === 'energy-meter') return 'validate-metering-source';

  if (expectedSource === 'weather-station') return 'validate-weather-source';

  if (readinessStatus === 'partial') return 'validate-signal-quality';

  return 'confirm-source';
};

const resolveReadinessPct = (
  qualityPct: number,
  authorizationStatus: PVMetricsReadinessAuthorizationStatus,
  readinessStatus: PVMetricsReadinessStatus,
) => {
  let base = clampPct(qualityPct);

  if (authorizationStatus === 'authorized-readonly') base += 8;
  if (authorizationStatus === 'authorized-demo') base += 4;
  if (authorizationStatus === 'pending-client-approval') base -= 15;
  if (authorizationStatus === 'not-authorized') base -= 35;

  if (readinessStatus === 'blocked') base -= 30;
  if (readinessStatus === 'not-ready') base -= 20;
  if (readinessStatus === 'partial') base -= 8;

  return clampPct(Math.round(base));
};

const calculateReadinessSummary = (
  rows: PVMetricsReadinessMatrixRow[],
): PVMetricsReadinessMatrixDataset['summary'] => {
  const totalRows = rows.length;

  const averageReadinessPct = totalRows
    ? Math.round(
        rows.reduce((sum, row) => sum + clampPct(row.readinessPct), 0) /
          totalRows,
      )
    : 0;

  const pilotReadyRows = rows.filter(
    (row) =>
      row.readinessStatus === 'ready-readonly' ||
      row.readinessStatus === 'ready-demo',
  ).length;

  const pilotReadinessPct = totalRows
    ? Math.round((pilotReadyRows / totalRows) * 100)
    : 0;

  return {
    totalRows,
    readyDemoRows: rows.filter((row) => row.readinessStatus === 'ready-demo').length,
    readyReadonlyRows: rows.filter((row) => row.readinessStatus === 'ready-readonly').length,
    partialRows: rows.filter((row) => row.readinessStatus === 'partial').length,
    blockedRows: rows.filter((row) => row.readinessStatus === 'blocked').length,
    notReadyRows: rows.filter((row) => row.readinessStatus === 'not-ready').length,
    criticalRiskRows: rows.filter((row) => row.riskLevel === 'critical').length,
    averageReadinessPct,
    pilotReadinessPct,
  };
};

export const createPvMetricsReadinessMatrixDemo = (): PVMetricsReadinessMatrixDataset => {
  const sourceDataset = createPvMetricsDataSourcesDemo();
  const signalDataset = createPvMetricsSignalMappingDemo();
  const qualityDataset = createPvMetricsSignalQualityRulesDemo();

  const sources = sourceDataset.sources;
  const signals = signalDataset.signals;
  const rules = qualityDataset.rules;

  const rows: PVMetricsReadinessMatrixRow[] = signals.map((signal) => {
    const source = sources.find((item) => item.type === signal.expectedSource);

    const rule = rules.find((item) => item.signalId === signal.id);

    const authorizationStatus = resolveAuthorizationStatus(
      signal.expectedSource,
      source?.status,
    );

    const readinessStatus = resolveReadinessStatus(
      signal.qualityPct,
      authorizationStatus,
      rule?.status,
    );

    const riskLevel = resolveRiskLevel(
      readinessStatus,
      signal.criticality,
    );

    const readinessPct = resolveReadinessPct(
      signal.qualityPct,
      authorizationStatus,
      readinessStatus,
    );

    const recommendedAction = resolveRecommendedAction(
      signal.expectedSource,
      authorizationStatus,
      readinessStatus,
    );

    return {
      id: `readiness-${signal.id}`,
      signalId: signal.id,
      signalName: signal.name,
      tagKey: signal.tagKey,
      domain: signal.domain,
      expectedSource: signal.expectedSource,
      sourceName: source?.name ?? 'Fuente pendiente',
      sourceStatusLabel: source?.status ?? 'pending',
      signalCriticality: signal.criticality,
      authorizationStatus,
      readinessStatus,
      riskLevel,
      qualityPct: clampPct(signal.qualityPct),
      readinessPct,
      ruleStatusLabel: rule?.status ?? 'not-tested',
      recommendedAction,
      readinessNote:
        readinessStatus === 'ready-readonly'
          ? 'Señal preparada para piloto read-only bajo autorización formal.'
          : readinessStatus === 'ready-demo'
            ? 'Señal lista para demostración local segura.'
            : readinessStatus === 'partial'
              ? 'Señal parcialmente preparada. Requiere revisión antes de piloto.'
              : readinessStatus === 'blocked'
                ? 'Señal bloqueada por autorización o condición de seguridad.'
                : 'Señal no lista para piloto. Requiere corrección de fuente, calidad o mapeo.',
    };
  });

  return {
    summary: calculateReadinessSummary(rows),
    rows,
  };
};
