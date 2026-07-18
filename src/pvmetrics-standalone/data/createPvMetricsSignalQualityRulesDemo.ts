import { createPvMetricsSignalMappingDemo } from './createPvMetricsSignalMappingDemo';
import {
  PVMetricsSignalQualityRule,
  PVMetricsSignalQualityRulesDataset,
  PVMetricsSignalQualityRuleStatus,
} from '../types/pvmetrics-signal-quality-rules.types';

const clampPct = (value: number) => Math.max(0, Math.min(100, value));

const resolveRuleStatus = (
  validationStatus: string,
  qualityPct: number,
): PVMetricsSignalQualityRuleStatus => {
  if (validationStatus === 'valid' && qualityPct >= 85) return 'passed';
  if (validationStatus === 'warning') return 'warning';
  if (validationStatus === 'missing') return 'failed';
  if (validationStatus === 'out-of-range') return 'failed';
  if (validationStatus === 'stale') return 'warning';
  if (validationStatus === 'unit-mismatch') return 'failed';
  if (validationStatus === 'not-tested') return 'not-tested';
  if (qualityPct < 50) return 'failed';
  if (qualityPct < 75) return 'warning';
  return 'not-tested';
};

const resolveRiskScore = (rules: PVMetricsSignalQualityRule[]) => {
  if (!rules.length) return 0;

  const riskPoints = rules.reduce((sum, rule) => {
    if (rule.status === 'failed') return sum + 12;
    if (rule.status === 'blocked') return sum + 10;
    if (rule.status === 'warning') return sum + 6;
    if (rule.status === 'not-tested') return sum + 4;
    return sum + 1;
  }, 0);

  return Math.min(100, Math.round((riskPoints / (rules.length * 12)) * 100));
};

export const createPvMetricsSignalQualityRulesDemo = (): PVMetricsSignalQualityRulesDataset => {
  const signalDataset = createPvMetricsSignalMappingDemo();
  const signals = signalDataset.signals;

  const rules: PVMetricsSignalQualityRule[] = signals.map((signal) => {
    const status = resolveRuleStatus(signal.validationStatus, signal.qualityPct);

    return {
      id: `rule-${signal.id}`,
      signalId: signal.id,
      signalName: signal.name,
      tagKey: signal.tagKey,
      domain: signal.domain,
      expectedSource: signal.expectedSource,
      ruleType:
        signal.validMin === null && signal.validMax === null
          ? 'presence-check'
          : 'range-check',
      severity:
        signal.criticality === 'critical'
          ? 'critical'
          : signal.criticality === 'high'
            ? 'warning'
            : 'info',
      status,
      validationStatus: signal.validationStatus,
      criticality: signal.criticality,
      qualityPct: clampPct(signal.qualityPct),
      ruleLabel:
        signal.validMin === null && signal.validMax === null
          ? 'Validación de presencia y estado'
          : 'Validación de rango operacional',
      expectedCondition:
        signal.validMin === null && signal.validMax === null
          ? `La señal ${signal.name} debe estar presente, actualizada y con estado interpretable.`
          : `La señal ${signal.name} debe mantenerse dentro del rango ${signal.validMin} — ${signal.validMax} ${signal.unit}.`,
      simulatedFinding:
        status === 'passed'
          ? 'Regla superada en entorno demo local.'
          : status === 'warning'
            ? 'Advertencia simulada: requiere revisión de mapeo, fuente o calidad.'
            : status === 'failed'
              ? 'Falla simulada: señal ausente, fuera de rango o no lista para piloto.'
              : 'Regla pendiente de prueba con fuente real autorizada.',
      recommendedAction:
        status === 'passed'
          ? 'no-action-required'
          : signal.mappingStatus === 'requires-client-data'
            ? 'request-client-data'
            : signal.mappingStatus === 'pending-mapping'
              ? 'review-mapping'
              : signal.mappingStatus === 'not-authorized'
                ? 'check-source-authorization'
                : signal.validationStatus === 'unit-mismatch'
                  ? 'validate-unit'
                  : signal.validationStatus === 'out-of-range'
                    ? 'validate-range'
                    : signal.expectedSource === 'scada-readonly'
                      ? 'confirm-scada-tag'
                      : 'monitor',
      riskNote:
        signal.criticality === 'critical' && status !== 'passed'
          ? 'Señal crítica no completamente lista. Requiere revisión antes de piloto read-only.'
          : status === 'passed'
            ? 'Sin riesgo relevante en simulación actual.'
            : 'Requiere seguimiento antes de habilitar integración real.',
    };
  });

  const calculateSummary = (
    rulesList: PVMetricsSignalQualityRule[],
  ): PVMetricsSignalQualityRulesDataset['summary'] => {
    const averageQualityPct = rulesList.length
      ? Math.round(
          rulesList.reduce((sum, rule) => sum + clampPct(rule.qualityPct), 0) /
            rulesList.length,
        )
      : 0;

    return {
      totalRules: rulesList.length,
      passedRules: rulesList.filter((rule) => rule.status === 'passed').length,
      warningRules: rulesList.filter((rule) => rule.status === 'warning').length,
      failedRules: rulesList.filter((rule) => rule.status === 'failed').length,
      blockedRules: rulesList.filter((rule) => rule.status === 'blocked').length,
      notTestedRules: rulesList.filter((rule) => rule.status === 'not-tested').length,
      criticalRules: rulesList.filter((rule) => rule.severity === 'critical').length,
      averageQualityPct,
      operationalRiskScore: resolveRiskScore(rulesList),
    };
  };

  return {
    summary: calculateSummary(rules),
    rules,
  };
};
