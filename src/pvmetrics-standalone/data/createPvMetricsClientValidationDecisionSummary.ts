import { PVMetricsClientValidationGate } from '../types/pvmetrics-client-validation.types';
import { PVMetricsClientValidationRequestPack } from '../types/pvmetrics-client-validation-request.types';
import { PVMetricsClientEvidenceResponseEvaluation } from '../types/pvmetrics-client-evidence-response.types';
import {
  PVMetricsClientValidationDecisionItem,
  PVMetricsClientValidationDecisionRiskLevel,
  PVMetricsClientValidationDecisionStatus,
  PVMetricsClientValidationDecisionSummary,
} from '../types/pvmetrics-client-validation-decision.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const decisionLabel: Record<PVMetricsClientValidationDecisionStatus, string> = {
  blocked: 'BLOQUEADO — NO AVANZAR',
  'draft-review-required': 'REQUIERE REVISIÓN DE BORRADOR',
  'ready-for-client-validation': 'LISTO PARA VALIDACIÓN CLIENTE',
  'ready-for-readonly-pilot-preparation':
    'LISTO PARA PREPARAR PILOTO READ-ONLY',
};

const resolveRiskLevel = ({
  blockingChecks,
  rejectedEvidenceItems,
  criticalRequestItems,
  combinedReadinessPct,
}: {
  blockingChecks: number;
  rejectedEvidenceItems: number;
  criticalRequestItems: number;
  combinedReadinessPct: number;
}): PVMetricsClientValidationDecisionRiskLevel => {
  if (
    blockingChecks > 3 ||
    rejectedEvidenceItems > 0 ||
    criticalRequestItems > 2
  ) {
    return 'critical';
  }

  if (
    blockingChecks > 0 ||
    criticalRequestItems > 0 ||
    combinedReadinessPct < 60
  ) {
    return 'high';
  }

  if (combinedReadinessPct < 85) return 'medium';

  return 'low';
};

const resolveDecisionStatus = ({
  gate,
  evidence,
  combinedReadinessPct,
  riskLevel,
}: {
  gate: PVMetricsClientValidationGate;
  evidence: PVMetricsClientEvidenceResponseEvaluation;
  combinedReadinessPct: number;
  riskLevel: PVMetricsClientValidationDecisionRiskLevel;
}): PVMetricsClientValidationDecisionStatus => {
  if (
    riskLevel === 'critical' ||
    gate.blockingChecks > 0 ||
    evidence.rejectedItems > 0
  ) {
    return 'blocked';
  }

  if (
    evidence.canPrepareReadonlyPilot &&
    gate.gateStatus === 'ready-for-readonly-pilot' &&
    combinedReadinessPct >= 85
  ) {
    return 'ready-for-readonly-pilot-preparation';
  }

  if (evidence.canMoveToClientValidation && combinedReadinessPct >= 65) {
    return 'ready-for-client-validation';
  }

  return 'draft-review-required';
};

const createDecisionItem = ({
  id,
  label,
  status,
  note,
}: PVMetricsClientValidationDecisionItem): PVMetricsClientValidationDecisionItem => ({
  id,
  label,
  status,
  note,
});

const buildDecisionItems = ({
  gate,
  requestPack,
  evidence,
}: {
  gate: PVMetricsClientValidationGate;
  requestPack: PVMetricsClientValidationRequestPack;
  evidence: PVMetricsClientEvidenceResponseEvaluation;
}): PVMetricsClientValidationDecisionItem[] => [
  createDecisionItem({
    id: 'gate-status',
    label: 'Source-of-Truth Gate',
    status:
      gate.gateStatus === 'ready-for-readonly-pilot' ||
      gate.gateStatus === 'ready-for-client-validation'
        ? 'ok'
        : gate.gateStatus === 'draft-only'
          ? 'warning'
          : 'blocked',
    note: `${gate.gateLabel} · Score documental ${gate.scorePct}%`,
  }),
  createDecisionItem({
    id: 'evidence-score',
    label: 'Evidence Response',
    status:
      evidence.canPrepareReadonlyPilot || evidence.canMoveToClientValidation
        ? 'ok'
        : evidence.evidenceScorePct >= 50
          ? 'warning'
          : 'blocked',
    note: `${evidence.readinessLabel} · Evidence Score ${evidence.evidenceScorePct}%`,
  }),
  createDecisionItem({
    id: 'critical-requests',
    label: 'Solicitudes críticas pendientes',
    status:
      requestPack.criticalItems === 0
        ? 'ok'
        : requestPack.criticalItems <= 2
          ? 'warning'
          : 'blocked',
    note: `${requestPack.criticalItems} solicitud(es) críticas activas.`,
  }),
  createDecisionItem({
    id: 'blocking-items',
    label: 'Bloqueantes read-only',
    status:
      gate.blockingChecks === 0 && evidence.blockingPendingItems === 0
        ? 'ok'
        : 'blocked',
    note: `Gate bloqueantes: ${gate.blockingChecks}. Evidencias bloqueantes pendientes: ${evidence.blockingPendingItems}.`,
  }),
  createDecisionItem({
    id: 'rejected-evidence',
    label: 'Evidencias rechazadas',
    status: evidence.rejectedItems === 0 ? 'ok' : 'blocked',
    note: `${evidence.rejectedItems} evidencia(s) rechazada(s).`,
  }),
];

const buildRemainingBlockers = ({
  gate,
  requestPack,
  evidence,
}: {
  gate: PVMetricsClientValidationGate;
  requestPack: PVMetricsClientValidationRequestPack;
  evidence: PVMetricsClientEvidenceResponseEvaluation;
}) => {
  const blockers = [
    ...gate.checks
      .filter(
        (check) =>
          check.blocksReadonlyPilot &&
          (check.status === 'missing' ||
            check.status === 'pending-client' ||
            check.status === 'demo-only'),
      )
      .map((check) => `${check.label}: ${check.recommendation}`),

    ...requestPack.items
      .filter((item) => item.priority === 'critical')
      .map((item) => `${item.title}: ${item.requestText}`),

    ...evidence.sourceDataset.items
      .filter(
        (item) =>
          item.blocksReadonlyPilot &&
          item.status !== 'received' &&
          item.status !== 'not-required',
      )
      .map(
        (item) =>
          `${item.title}: evidencia aún no confirmada como recibida/oficial.`,
      ),
  ];

  return Array.from(new Set(blockers)).slice(0, 10);
};

const buildRecommendedNextActions = ({
  decisionStatus,
  remainingBlockers,
  evidence,
}: {
  decisionStatus: PVMetricsClientValidationDecisionStatus;
  remainingBlockers: string[];
  evidence: PVMetricsClientEvidenceResponseEvaluation;
}) => {
  if (decisionStatus === 'ready-for-readonly-pilot-preparation') {
    return [
      'Preparar matriz final de señales read-only requeridas.',
      'Confirmar ventana de revisión técnica con cliente.',
      'Verificar que no exista escritura, telecontrol ni setpoints en el alcance.',
      'Preparar checklist de readiness antes de cualquier conexión real.',
    ];
  }

  if (decisionStatus === 'ready-for-client-validation') {
    return [
      'Enviar resumen de validación al cliente para revisión.',
      'Solicitar confirmación formal de datos pendientes menores.',
      'Revisar evidencias parciales antes de avanzar a piloto read-only.',
      ...evidence.nextActions.slice(0, 3),
    ];
  }

  if (remainingBlockers.length) {
    return ['Resolver bloqueantes críticos antes de avanzar.', ...remainingBlockers.slice(0, 5)];
  }

  return [
    'Completar revisión documental interna.',
    'Solicitar evidencias faltantes.',
    'Mantener el perfil como borrador hasta recibir respaldo suficiente.',
  ];
};

const buildInternalCommitteeText = (
  summary: Omit<
    PVMetricsClientValidationDecisionSummary,
    'internalCommitteeText' | 'clientFollowUpText'
  >,
) =>
  [
    'ORBI PVMetrics IA — Client Validation Decision Summary',
    `Generado: ${summary.generatedAtLabel}`,
    `Planta: ${summary.plantName} (${summary.plantCode})`,
    `Tecnología: ${summary.technologyLabel}`,
    `Decisión: ${summary.decisionLabel}`,
    `Riesgo: ${summary.riskLevel}`,
    '',
    `Gate Score: ${summary.gateScorePct}%`,
    `Evidence Score: ${summary.evidenceScorePct}%`,
    `Combined Readiness: ${summary.combinedReadinessPct}%`,
    '',
    'Resumen ejecutivo:',
    summary.executiveSummary,
    '',
    'Racional de decisión:',
    summary.decisionRationale,
    '',
    'Bloqueantes restantes:',
    summary.remainingBlockers.length
      ? summary.remainingBlockers.map((blocker) => `- ${blocker}`).join('\n')
      : '- Sin bloqueantes críticos pendientes.',
    '',
    'Acciones recomendadas:',
    summary.recommendedNextActions.map((action) => `- ${action}`).join('\n'),
    '',
    'Límite de seguridad:',
    summary.safetyBoundary,
  ].join('\n');

const buildClientFollowUpText = (
  summary: Omit<
    PVMetricsClientValidationDecisionSummary,
    'internalCommitteeText' | 'clientFollowUpText'
  >,
) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos el estado de revisión técnica del perfil de la planta ${summary.plantName} (${summary.plantCode}) en ORBI PVMetrics IA.`,
    '',
    `Estado actual: ${summary.decisionLabel}.`,
    `Readiness combinado: ${summary.combinedReadinessPct}%.`,
    '',
    summary.remainingBlockers.length
      ? 'Para avanzar, necesitamos revisar o completar los siguientes puntos:'
      : 'No se detectan bloqueantes críticos activos en esta simulación local.',
    summary.remainingBlockers.length
      ? summary.remainingBlockers.map((blocker) => `- ${blocker}`).join('\n')
      : '',
    '',
    'La revisión se mantiene bajo alcance estrictamente read-only: sin telecontrol, sin modificación de setpoints, sin comandos a inversores o BESS y sin escritura hacia sistemas reales.',
    '',
    'Quedamos atentos a sus comentarios o documentación complementaria.',
  ].join('\n');

export const createPvMetricsClientValidationDecisionSummary = ({
  gate,
  requestPack,
  evidence,
}: {
  gate: PVMetricsClientValidationGate;
  requestPack: PVMetricsClientValidationRequestPack;
  evidence: PVMetricsClientEvidenceResponseEvaluation;
}): PVMetricsClientValidationDecisionSummary => {
  const combinedReadinessPct = Math.round(
    gate.scorePct * 0.45 + evidence.evidenceScorePct * 0.55,
  );

  const riskLevel = resolveRiskLevel({
    blockingChecks: gate.blockingChecks + evidence.blockingPendingItems,
    rejectedEvidenceItems: evidence.rejectedItems,
    criticalRequestItems: requestPack.criticalItems,
    combinedReadinessPct,
  });

  const decisionStatus = resolveDecisionStatus({
    gate,
    evidence,
    combinedReadinessPct,
    riskLevel,
  });

  const decisionItems = buildDecisionItems({
    gate,
    requestPack,
    evidence,
  });

  const remainingBlockers = buildRemainingBlockers({
    gate,
    requestPack,
    evidence,
  });

  const recommendedNextActions = buildRecommendedNextActions({
    decisionStatus,
    remainingBlockers,
    evidence,
  });

  const base = {
    id: `client-validation-decision-${gate.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: gate.plantName,
    plantCode: gate.plantCode,
    technologyLabel: gate.technologyLabel,
    decisionStatus,
    decisionLabel: decisionLabel[decisionStatus],
    riskLevel,
    gateScorePct: gate.scorePct,
    evidenceScorePct: evidence.evidenceScorePct,
    combinedReadinessPct,
    blockingChecks: gate.blockingChecks + evidence.blockingPendingItems,
    pendingEvidenceItems: evidence.pendingItems,
    rejectedEvidenceItems: evidence.rejectedItems,
    criticalRequestItems: requestPack.criticalItems,
    decisionItems,
    executiveSummary:
      'Resumen local de decisión basado en respaldo documental, solicitudes pendientes y simulación de evidencias recibidas. No constituye aprobación oficial.',
    decisionRationale:
      `La decisión combina Source-of-Truth Gate (${gate.scorePct}%) and Evidence Score (${evidence.evidenceScorePct}%). ` +
      `El estado resultante es ${decisionLabel[decisionStatus]} con riesgo ${riskLevel}.`,
    remainingBlockers,
    recommendedNextActions,
    safetyBoundary:
      'Este resumen es local, conceptual y read-only. No guarda datos, no envía correos, no exporta PDF, no conecta SCADA, no ejecuta APIs, no modifica setpoints y no habilita telecontrol.',
    sourceGate: gate,
    sourceRequestPack: requestPack,
    sourceEvidenceEvaluation: evidence,
  };

  return {
    ...base,
    internalCommitteeText: buildInternalCommitteeText(base),
    clientFollowUpText: buildClientFollowUpText(base),
  };
};
