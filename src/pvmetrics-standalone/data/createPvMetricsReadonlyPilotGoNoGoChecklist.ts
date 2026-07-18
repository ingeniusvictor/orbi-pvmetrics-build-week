import { PVMetricsReadonlyPilotReviewPack } from '../types/pvmetrics-readonly-pilot-review-pack.types';
import {
  PVMetricsReadonlyPilotGoNoGoCheck,
  PVMetricsReadonlyPilotGoNoGoChecklist,
  PVMetricsReadonlyPilotGoNoGoDecision,
} from '../types/pvmetrics-readonly-pilot-gonogo.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const decisionLabel: Record<PVMetricsReadonlyPilotGoNoGoDecision, string> = {
  go: 'GO — PREPARACIÓN READ-ONLY POSIBLE',
  'conditional-go': 'CONDITIONAL GO — REQUIERE CIERRE DE OBSERVACIONES',
  'no-go': 'NO-GO — NO PREPARAR PILOTO READ-ONLY',
};

const createCheck = (
  check: PVMetricsReadonlyPilotGoNoGoCheck,
): PVMetricsReadonlyPilotGoNoGoCheck => check;

const hasMandatorySignals = (reviewPack: PVMetricsReadonlyPilotReviewPack) =>
  reviewPack.mandatorySignalSummary.length > 0;

const hasBlockingItems = (reviewPack: PVMetricsReadonlyPilotReviewPack) =>
  reviewPack.blockingItems > 0;

const hasBessScope = (reviewPack: PVMetricsReadonlyPilotReviewPack) =>
  reviewPack.bessItems > 0;

const buildChecks = (
  reviewPack: PVMetricsReadonlyPilotReviewPack,
): PVMetricsReadonlyPilotGoNoGoCheck[] => {
  const mandatorySignalCount = reviewPack.mandatorySignalSummary.length;
  const recommendedSignalCount = reviewPack.recommendedSignalSummary.length;
  const optionalSignalCount = reviewPack.optionalSignalSummary.length;
  const bessScope = hasBessScope(reviewPack);

  const checks: PVMetricsReadonlyPilotGoNoGoCheck[] = [
    createCheck({
      id: 'mandatory-signals-defined',
      category: 'signals',
      label: 'Señales obligatorias definidas',
      status: hasMandatorySignals(reviewPack) ? 'pass' : 'fail',
      requiredForGo: true,
      blocksGo: !hasMandatorySignals(reviewPack),
      evidence: `${mandatorySignalCount} señal(es) obligatoria(s) detectada(s).`,
      recommendation:
        'Definir señales mínimas obligatorias antes de preparar cualquier piloto read-only.',
    }),
    createCheck({
      id: 'recommended-signals-defined',
      category: 'signals',
      label: 'Señales recomendadas identificadas',
      status: recommendedSignalCount > 0 ? 'pass' : 'warning',
      requiredForGo: false,
      blocksGo: false,
      evidence: `${recommendedSignalCount} señal(es) recomendada(s) detectada(s).`,
      recommendation:
        'Agregar señales recomendadas mejora la capacidad de diagnóstico del piloto.',
    }),
    createCheck({
      id: 'optional-signals-defined',
      category: 'signals',
      label: 'Señales opcionales documentadas',
      status: optionalSignalCount > 0 ? 'pass' : 'warning',
      requiredForGo: false,
      blocksGo: false,
      evidence: `${optionalSignalCount} señal(es) opcional(es) detectada(s).`,
      recommendation:
        'Mantener señales opcionales documentadas permite ampliar análisis sin bloquear el piloto.',
    }),
    createCheck({
      id: 'readonly-confirmations-present',
      category: 'read-only-access',
      label: 'Confirmaciones read-only incluidas',
      status: reviewPack.readOnlyConfirmations.length >= 5 ? 'pass' : 'fail',
      requiredForGo: true,
      blocksGo: reviewPack.readOnlyConfirmations.length < 5,
      evidence: `${reviewPack.readOnlyConfirmations.length} confirmación(es) read-only registrada(s).`,
      recommendation:
        'Incluir confirmaciones explícitas de acceso solo lectura, sin escritura, comandos ni setpoints.',
    }),
    createCheck({
      id: 'blocking-items-reviewed',
      category: 'governance',
      label: 'Ítems bloqueantes identificados',
      status: hasBlockingItems(reviewPack) ? 'warning' : 'pass',
      requiredForGo: true,
      blocksGo: false,
      evidence: `${reviewPack.blockingItems} ítem(s) bloqueante(s) en el review pack.`,
      recommendation:
        'Revisar y cerrar bloqueantes con contraparte técnica antes de avanzar a conexión real.',
    }),
    createCheck({
      id: 'critical-items-reviewed',
      category: 'governance',
      label: 'Ítems críticos identificados',
      status: reviewPack.criticalItems > 0 ? 'warning' : 'pass',
      requiredForGo: true,
      blocksGo: false,
      evidence: `${reviewPack.criticalItems} ítem(s) crítico(s) registrado(s).`,
      recommendation:
        'Todo ítem crítico debe quedar confirmado o documentado antes de cualquier piloto real.',
    }),
    createCheck({
      id: 'security-no-frontend-credentials',
      category: 'security',
      label: 'Sin credenciales productivas en frontend',
      status: reviewPack.readOnlyConfirmations.some((item) =>
        item.toLowerCase().includes('credenciales'),
      )
        ? 'pass'
        : 'fail',
      requiredForGo: true,
      blocksGo: !reviewPack.readOnlyConfirmations.some((item) =>
        item.toLowerCase().includes('credenciales'),
      ),
      evidence:
        'Se valida que el review pack incluya una confirmación explícita sobre credenciales productivas.',
      recommendation:
        'Asegurar que credenciales productivas no se almacenen ni expongan en frontend.',
    }),
    createCheck({
      id: 'safety-no-commands',
      category: 'safety-boundary',
      label: 'Sin comandos, setpoints ni telecontrol',
      status:
        reviewPack.safetyBoundary.toLowerCase().includes('no modifica setpoints') &&
        reviewPack.safetyBoundary.toLowerCase().includes('no controla')
          ? 'pass'
          : 'fail',
      requiredForGo: true,
      blocksGo: !(
        reviewPack.safetyBoundary.toLowerCase().includes('no modifica setpoints') &&
        reviewPack.safetyBoundary.toLowerCase().includes('no controla')
      ),
      evidence: reviewPack.safetyBoundary,
      recommendation:
        'El límite de seguridad debe declarar explícitamente amparo de no-comandos, setpoints y control.',
    }),
    createCheck({
      id: 'client-review-text-ready',
      category: 'governance',
      label: 'Texto cliente generado',
      status: reviewPack.clientReviewText.length > 100 ? 'pass' : 'warning',
      requiredForGo: false,
      blocksGo: false,
      evidence: `Texto cliente con ${reviewPack.clientReviewText.length} caracteres.`,
      recommendation:
        'Revisar texto cliente antes de copiarlo a una minuta, correo o documento formal.',
    }),
    createCheck({
      id: 'internal-review-text-ready',
      category: 'governance',
      label: 'Texto interno generado',
      status: reviewPack.internalReviewText.length > 100 ? 'pass' : 'warning',
      requiredForGo: false,
      blocksGo: false,
      evidence: `Texto interno con ${reviewPack.internalReviewText.length} caracteres.`,
      recommendation:
        'Revisar texto interno antes de usarlo como minuta técnica.',
    }),
  ];

  if (bessScope) {
    checks.push(
      createCheck({
        id: 'bess-items-present',
        category: 'bess',
        label: 'Ítems BESS incluidos',
        status: reviewPack.bessItems > 0 ? 'pass' : 'fail',
        requiredForGo: true,
        blocksGo: reviewPack.bessItems === 0,
        evidence: `${reviewPack.bessItems} ítem(s) BESS detectado(s).`,
        recommendation:
          'Si existe BESS, deben estar incluidas señales y preguntas específicas de potencia, energía, SoC y modo operacional.',
      }),
      createCheck({
        id: 'bess-readonly-boundary',
        category: 'bess',
        label: 'BESS bajo límite read-only',
        status:
          reviewPack.safetyBoundary.toLowerCase().includes('no controla bess') ||
          reviewPack.safetyBoundary.toLowerCase().includes('no controla')
            ? 'pass'
            : 'fail',
        requiredForGo: true,
        blocksGo: !(
          reviewPack.safetyBoundary.toLowerCase().includes('no controla bess') ||
          reviewPack.safetyBoundary.toLowerCase().includes('no controla')
        ),
        evidence: reviewPack.safetyBoundary,
        recommendation:
          'El alcance BESS debe ser estrictamente lectura, sin carga, descarga, despacho ni setpoints.',
      }),
    );
  }

  return checks;
};

const resolveDecision = ({
  blockingChecks,
  failChecks,
  warningChecks,
}: {
  blockingChecks: number;
  failChecks: number;
  warningChecks: number;
}): PVMetricsReadonlyPilotGoNoGoDecision => {
  if (blockingChecks > 0 || failChecks > 0) return 'no-go';
  if (warningChecks > 0) return 'conditional-go';
  return 'go';
};

const buildInternalSummaryText = ({
  reviewPack,
  decision,
  readinessScorePct,
  checks,
  blockers,
  risks,
  requiredActions,
  safetyBoundary,
}: {
  reviewPack: PVMetricsReadonlyPilotReviewPack;
  decision: PVMetricsReadonlyPilotGoNoGoDecision;
  readinessScorePct: number;
  checks: PVMetricsReadonlyPilotGoNoGoCheck[];
  blockers: string[];
  risks: string[];
  requiredActions: string[];
  safetyBoundary: string;
}) =>
  [
    'ORBI PVMetrics IA — Read-Only Pilot Go/No-Go Checklist',
    `Generado: ${getGeneratedAtLabel()}`,
    `Planta: ${reviewPack.plantName} (${reviewPack.plantCode})`,
    `Tecnología: ${reviewPack.technologyLabel}`,
    `Decisión: ${decisionLabel[decision]}`,
    `Readiness Score: ${readinessScorePct}%`,
    '',
    'Checks:',
    checks
      .map(
        (check) =>
          `- [${check.status}] ${check.label} | Categoría: ${check.category} | Bloquea: ${
            check.blocksGo ? 'Sí' : 'No'
          } | Evidencia: ${check.evidence}`,
      )
      .join('\n'),
    '',
    'Bloqueantes:',
    blockers.length ? blockers.map((item) => `- ${item}`).join('\n') : '- Sin bloqueantes activos.',
    '',
    'Riesgos:',
    risks.length ? risks.map((item) => `- ${item}`).join('\n') : '- Sin riesgos relevantes activos.',
    '',
    'Acciones requeridas:',
    requiredActions.length
      ? requiredActions.map((item) => `- ${item}`).join('\n')
      : '- Sin acciones requeridas.',
    '',
    'Límite de seguridad:',
    safetyBoundary,
  ].join('\n');

export const createPvMetricsReadonlyPilotGoNoGoChecklist = (
  reviewPack: PVMetricsReadonlyPilotReviewPack,
): PVMetricsReadonlyPilotGoNoGoChecklist => {
  const checks = buildChecks(reviewPack);

  const passChecks = checks.filter((check) => check.status === 'pass').length;
  const warningChecks = checks.filter((check) => check.status === 'warning').length;
  const failChecks = checks.filter((check) => check.status === 'fail').length;
  const blockingChecks = checks.filter(
    (check) => check.blocksGo && check.status !== 'pass',
  ).length;
  const bessChecks = checks.filter((check) => check.category === 'bess').length;

  const readinessScorePct = checks.length
    ? Math.round((passChecks / checks.length) * 100)
    : 0;

  const decision = resolveDecision({
    blockingChecks,
    failChecks,
    warningChecks,
  });

  const blockers = checks
    .filter((check) => check.blocksGo && check.status !== 'pass')
    .map((check) => `${check.label}: ${check.recommendation}`);

  const risks = checks
    .filter((check) => check.status === 'warning' || check.status === 'fail')
    .map((check) => `${check.label}: ${check.evidence}`);

  const requiredActions = checks
    .filter((check) => check.status !== 'pass')
    .map((check) => check.recommendation);

  const safetyBoundary =
    'Este checklist es local y conceptual. No conecta SCADA, no consume APIs, no lee medidores reales, no guarda credenciales, no modifica setpoints, no controla BESS, no controla inversores y no habilita telecontrol.';

  return {
    id: `readonly-pilot-gonogo-${reviewPack.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: reviewPack.plantName,
    plantCode: reviewPack.plantCode,
    technologyLabel: reviewPack.technologyLabel,
    decision,
    decisionLabel: decisionLabel[decision],
    readinessScorePct,
    totalChecks: checks.length,
    passChecks,
    warningChecks,
    failChecks,
    blockingChecks,
    bessChecks,
    checks,
    blockers,
    risks,
    requiredActions,
    internalSummaryText: buildInternalSummaryText({
      reviewPack,
      decision,
      readinessScorePct,
      checks,
      blockers,
      risks,
      requiredActions,
      safetyBoundary,
    }),
    safetyBoundary,
    sourceReviewPack: reviewPack,
  };
};
