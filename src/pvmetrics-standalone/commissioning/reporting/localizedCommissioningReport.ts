import type { CommissioningLocale } from '../localization/commissioningLocale';
import { commissioningCanonicalLabel } from '../localization/commissioningLocale';
import { renderCommissioningReportText, type CommissioningReport } from './commissioningReport';

export const renderLocalizedCommissioningReportText = (
  report: CommissioningReport,
  locale: CommissioningLocale,
): string => {
  if (locale === 'en') return renderCommissioningReportText(report);

  const label = (value: string) => commissioningCanonicalLabel('es', value);
  const lines = [
    'ORBI PVMETRICS — INFORME DE PUESTA EN SERVICIO BESS',
    `Esquema: ${report.schemaVersion}`,
    `Generado: ${report.generatedAt}`,
    `Generado por: ${report.generatedBy}`,
    `Modo: SOLO LECTURA / MODO SOMBRA`,
    '',
    `Proyecto: ${report.project.name} (${report.project.projectId})`,
    `Cliente: ${report.project.client}`,
    `Sitio: ${report.project.site}, ${report.project.region}, ${report.project.country}`,
    `Alcance: ${report.scope.name} · Revisión ${report.scope.revision} · ${label(report.scope.status)}`,
    '',
    'RESUMEN',
    `Activos en alcance: ${report.summary.assetsInScope}`,
    `Instancias de prueba: ${report.summary.testInstances}`,
    `Ejecuciones de prueba: ${report.summary.testExecutions}`,
    `Evaluaciones ORBI: CUMPLE ${report.summary.executionAssessmentCounts.PASS} / ADVERTENCIA ${report.summary.executionAssessmentCounts.WARNING} / NO CUMPLE ${report.summary.executionAssessmentCounts.FAIL} / NO CONCLUYENTE ${report.summary.executionAssessmentCounts.INCONCLUSIVE}`,
    `Anomalías activas: ${report.summary.anomalies.active} (${report.summary.anomalies.gateBlocking} bloquean hitos)`,
    `Hallazgos abiertos: ${report.summary.findings.open} (${report.summary.findings.criticalOpen} críticos)`,
    `Pendientes abiertos: ${report.summary.punchItems.open} (${report.summary.punchItems.readyForRetest} listos para reprueba)`,
    `Registros de evidencia: ${report.summary.evidenceRecords}`,
    `Líneas base disponibles: ${report.summary.baselines.available}/${report.summary.baselines.total}`,
    `Paquetes de entrega listos o posteriores: ${report.summary.handoverPackages.readyOrBeyond}/${report.summary.handoverPackages.total}`,
    '',
    'TRAZABILIDAD',
    `Anomalías: ${report.traceability.anomalyIds.join(', ') || 'NINGUNA'}`,
    `Hallazgos: ${report.traceability.findingIds.join(', ') || 'NINGUNO'}`,
    `Pendientes: ${report.traceability.punchItemIds.join(', ') || 'NINGUNO'}`,
    `Evidencias: ${report.traceability.evidenceIds.join(', ') || 'NINGUNA'}`,
    `Decisiones de aceptación humana: ${report.traceability.humanAcceptanceDecisionIds.join(', ') || 'NINGUNA'}`,
    '',
    'LÍMITES DE AUTORIDAD',
    '- Este informe se genera desde el snapshot almacenado de Puesta en Servicio y no emite comandos OT ni modifica sistemas de planta.',
    '- La evaluación analítica ORBI es distinta de la aceptación humana y de la aceptación contractual.',
    '- Los umbrales, documentos, evidencias o mapeos faltantes permanecen faltantes y no deben inferirse.',
    '- La trazabilidad puede conservar observaciones asociadas a activos EXCLUIDOS registrados explícitamente; esto no incorpora dichos activos al alcance de aceptación.',
    '- Un estado de entrega LISTO o APROBADO no autoriza energización ni operación.',
  ];

  return `${lines.join('\n')}\n`;
};
