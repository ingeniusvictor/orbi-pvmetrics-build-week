import { PV_METRICS_CEN_COMPLIANCE_BLUEPRINT } from './pvMetricsCenComplianceBlueprint';
import {
  PVMetricsCenComplianceAssessmentItem,
  PVMetricsCenComplianceAssessmentStatus,
  PVMetricsCenComplianceFieldAssessment,
  PVMetricsCenComplianceMockAssessment,
} from '../types/pvmetrics-cen-compliance-mock.types';
import { PVMetricsSolarForecastSummary } from '../types/pvmetrics-solar-forecast-summary.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const round = (value: number) => Number(value.toFixed(2));

const statusLabel: Record<PVMetricsCenComplianceAssessmentStatus, string> = {
  blocked: 'BLOQUEADO — NO APTO PARA USO REGULATORIO',
  'not-ready': 'NO LISTO — FALTAN DATOS REQUERIDOS',
  'draft-review': 'BORRADOR — REQUIERE REVISIÓN HUMANA',
  'conceptually-ready': 'CONCEPTUALMENTE LISTO PARA REVISIÓN',
};

const createFieldAssessments = (
  forecastSummary: PVMetricsSolarForecastSummary,
): PVMetricsCenComplianceFieldAssessment[] => {
  return PV_METRICS_CEN_COMPLIANCE_BLUEPRINT.conceptualFields.map((field) => {
    const available =
      field.currentAvailability === 'available-demo' ||
      field.id === 'field-forecast-energy' ||
      field.id === 'field-forecast-power' ||
      field.id === 'field-timestamp' ||
      field.id === 'field-traceability';

    const evidenceMap: Record<string, string> = {
      'field-plant-id': `${forecastSummary.plantName} (${forecastSummary.plantCode})`,
      'field-forecast-energy': `${forecastSummary.kpis.totalForecastEnergyMwh} MWh mock`,
      'field-forecast-power': `${forecastSummary.kpis.peakForecastPowerMw} MW peak mock`,
      'field-timestamp': forecastSummary.generatedAtLabel,
      'field-traceability': 'Forecast mock generado dentro de ORBI PVMetrics IA con Safety Boundary activo.',
    };

    return {
      id: field.id,
      label: field.label,
      category: field.category,
      required: field.required,
      available,
      evidence:
        evidenceMap[field.id] ??
        (available
          ? 'Disponible en modo demo/conceptual.'
          : 'Pendiente de fuente validada o revisión humana.'),
    };
  });
};

const createCheckAssessments = (
  forecastSummary: PVMetricsSolarForecastSummary,
  fields: PVMetricsCenComplianceFieldAssessment[],
): PVMetricsCenComplianceAssessmentItem[] => {
  return PV_METRICS_CEN_COMPLIANCE_BLUEPRINT.complianceChecks.map((check) => {
    let passed = true;
    let evidence = 'Check conceptual aprobado en modo mock.';
    let recommendedAction = 'Mantener revisión humana antes de cualquier uso externo.';

    if (check.id === 'check-no-real-submission') {
      passed = true;
      evidence = 'No existe envío real ni regulatory API en este módulo.';
      recommendedAction = 'Mantener el simulador como herramienta local y conceptual.';
    }

    if (check.id === 'check-human-review') {
      passed = false;
      evidence = 'La revisión humana está marcada como obligatoria y pendiente.';
      recommendedAction =
        'Asignar responsable técnico antes de considerar cualquier salida externa.';
    }

    if (check.id === 'check-plant-profile') {
      const plantField = fields.find((field) => field.id === 'field-plant-id');
      passed = Boolean(plantField?.available);
      evidence = plantField?.evidence ?? 'Perfil de planta no disponible.';
      recommendedAction = passed
        ? 'Mantener perfil trazable.'
        : 'Completar perfil técnico de planta.';
    }

    if (check.id === 'check-forecast-series') {
      passed =
        forecastSummary.kpis.totalForecastEnergyMwh >= 0 &&
        forecastSummary.kpis.peakForecastPowerMw >= 0;
      evidence = `${forecastSummary.kpis.totalForecastEnergyMwh} MWh mock / ${forecastSummary.kpis.peakForecastPowerMw} MW peak mock.`;
      recommendedAction = passed
        ? 'Validar contra datos reales solo en una fase futura autorizada.'
        : 'Regenerar forecast mock antes de continuar.';
    }

    if (check.id === 'check-traceability') {
      passed = true;
      evidence = forecastSummary.safetyBoundary;
      recommendedAction = 'Conservar versión, módulo y límite de seguridad.';
    }

    if (check.id === 'check-regulatory-readiness') {
      passed = forecastSummary.kpis.forecastReadinessPct >= 75;
      evidence = `Readiness conceptual forecast: ${forecastSummary.kpis.forecastReadinessPct}%.`;
      recommendedAction = passed
        ? 'Puede pasar a revisión conceptual.'
        : 'Mejorar supuestos, disponibilidad y calidad de datos.';
    }

    return {
      id: check.id,
      label: check.label,
      severity: check.severity,
      passed,
      blocksSubmission: check.blocksSubmission,
      evidence,
      recommendedAction,
    };
  });
};

const resolveStatus = (
  score: number,
  missingRequiredFields: number,
  blockers: string[],
): PVMetricsCenComplianceAssessmentStatus => {
  if (blockers.length > 0) return 'blocked';
  if (missingRequiredFields > 0) return 'not-ready';
  if (score >= 80) return 'conceptually-ready';
  return 'draft-review';
};

const buildInternalText = (
  assessmentBase: Omit<
    PVMetricsCenComplianceMockAssessment,
    'internalComplianceText' | 'clientComplianceText'
  >,
) =>
  [
    'ORBI PVMetrics IA — CEN Forecast Compliance Mock Assessment',
    `Generado: ${assessmentBase.generatedAtLabel}`,
    `Planta: ${assessmentBase.plantName} (${assessmentBase.plantCode})`,
    `Horizonte: ${assessmentBase.horizonLabel}`,
    `Estado: ${assessmentBase.statusLabel}`,
    `Compliance Score: ${assessmentBase.complianceScorePct}%`,
    '',
    'Campos:',
    assessmentBase.fieldAssessments
      .map(
        (field) =>
          `- ${field.label}: ${field.available ? 'Disponible' : 'Pendiente'} | ${field.evidence}`,
      )
      .join('\n'),
    '',
    'Checks:',
    assessmentBase.checkAssessments
      .map(
        (check) =>
          `- [${check.passed ? 'OK' : 'PENDIENTE'}] ${check.label}: ${check.evidence}`,
      )
      .join('\n'),
    '',
    'Bloqueantes:',
    assessmentBase.blockers.length
      ? assessmentBase.blockers.map((item) => `- ${item}`).join('\n')
      : '- Sin bloqueantes críticos adicionales.',
    '',
    'Advertencias:',
    assessmentBase.warnings.length
      ? assessmentBase.warnings.map((item) => `- ${item}`).join('\n')
      : '- Sin advertencias adicionales.',
    '',
    'Notas regulatorias:',
    assessmentBase.regulatoryNotes.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    assessmentBase.safetyBoundary,
  ].join('\n');

const buildClientText = (
  assessmentBase: Omit<
    PVMetricsCenComplianceMockAssessment,
    'internalComplianceText' | 'clientComplianceText'
  >,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos una evaluación conceptual de preparación regulatoria del forecast para ${assessmentBase.plantName} (${assessmentBase.plantCode}).`,
    '',
    `Horizonte: ${assessmentBase.horizonLabel}.`,
    `Estado conceptual: ${assessmentBase.statusLabel}.`,
    `Compliance Score mock: ${assessmentBase.complianceScorePct}%.`,
    '',
    'Puntos principales:',
    `- Checks aprobados: ${assessmentBase.passedChecks}/${assessmentBase.totalChecks}.`,
    `- Campos requeridos faltantes: ${assessmentBase.missingRequiredFields}.`,
    `- Bloqueantes: ${assessmentBase.blockedChecks}.`,
    '',
    'Advertencia:',
    'Este resultado es conceptual. No corresponde a envío real al CEN, no usa API regulatoria, no conecta SCADA y no debe usarse como cumplimiento oficial.',
  ].join('\n');

export const createPvMetricsCenComplianceMockAssessment = (
  forecastSummary: PVMetricsSolarForecastSummary,
): PVMetricsCenComplianceMockAssessment => {
  const blueprint = PV_METRICS_CEN_COMPLIANCE_BLUEPRINT;
  const fieldAssessments = createFieldAssessments(forecastSummary);
  const checkAssessments = createCheckAssessments(
    forecastSummary,
    fieldAssessments,
  );

  const missingRequiredFields = fieldAssessments.filter(
    (field) => field.required && !field.available,
  ).length;

  const blockers = checkAssessments
    .filter((check) => check.blocksSubmission && !check.passed)
    .map((check) => `${check.label}: ${check.recommendedAction}`);

  const warnings = checkAssessments
    .filter((check) => !check.blocksSubmission && !check.passed)
    .map((check) => `${check.label}: ${check.recommendedAction}`);

  const passedChecks = checkAssessments.filter((check) => check.passed).length;
  const totalChecks = checkAssessments.length;
  const blockedChecks = blockers.length;

  const complianceScorePct = round(
    Math.max(
      0,
      Math.min(
        100,
        (passedChecks / totalChecks) * 100 -
          missingRequiredFields * 6 -
          blockedChecks * 10,
      ),
    ),
  );

  const status = resolveStatus(
    complianceScorePct,
    missingRequiredFields,
    blockers,
  );

  const safetyBoundary =
    'Este assessment CEN es mock, local y conceptual. No envía forecast al CEN, no usa regulatory API, no conecta SCADA, no lee medidores reales, no ejecuta telecontrol, no modifica setpoints y no controla BESS ni inversores.';

  const base = {
    id: `cen-compliance-assessment-${forecastSummary.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: forecastSummary.plantName,
    plantCode: forecastSummary.plantCode,
    horizonLabel: forecastSummary.horizonLabel,
    status,
    statusLabel: statusLabel[status],
    complianceScorePct,
    totalChecks,
    passedChecks,
    blockedChecks,
    missingRequiredFields,
    fieldAssessments,
    checkAssessments,
    blockers,
    warnings,
    regulatoryNotes: blueprint.regulatoryNotes,
    safetyBoundary,
    sourceForecastSummary: forecastSummary,
    sourceBlueprint: blueprint,
  };

  return {
    ...base,
    internalComplianceText: buildInternalText(base),
    clientComplianceText: buildClientText(base),
  };
};
