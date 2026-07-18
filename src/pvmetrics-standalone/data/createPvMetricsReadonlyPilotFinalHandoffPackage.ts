import { PVMetricsReadonlyPilotDataContractDraft } from '../types/pvmetrics-readonly-pilot-data-contract.types';
import {
  PVMetricsReadonlyPilotFinalHandoffItem,
  PVMetricsReadonlyPilotFinalHandoffPackage,
  PVMetricsReadonlyPilotFinalHandoffStatus,
} from '../types/pvmetrics-readonly-pilot-final-handoff.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const handoffStatusLabelMap: Record<PVMetricsReadonlyPilotFinalHandoffStatus, string> = {
  blocked: 'BLOQUEADO — HANDOFF NO RECOMENDADO',
  'draft-handoff': 'HANDOFF EN BORRADOR',
  'ready-for-internal-review': 'LISTO PARA REVISIÓN INTERNA',
  'ready-for-client-handoff': 'LISTO PARA HANDOFF CLIENTE',
};

const resolveHandoffStatus = (
  contract: PVMetricsReadonlyPilotDataContractDraft,
): PVMetricsReadonlyPilotFinalHandoffStatus => {
  if (contract.contractStatus === 'blocked') return 'blocked';

  if (contract.contractStatus === 'ready-for-client-review') {
    return 'ready-for-client-handoff';
  }

  if (contract.contractStatus === 'ready-for-technical-review') {
    return 'ready-for-internal-review';
  }

  return 'draft-handoff';
};

const getInheritedGoNoGoDecisionLabel = (
  contract: PVMetricsReadonlyPilotDataContractDraft,
) => contract.sourceGoNoGoChecklist.decisionLabel;

const getInheritedReadinessScore = (
  contract: PVMetricsReadonlyPilotDataContractDraft,
) => contract.sourceGoNoGoChecklist.readinessScorePct;

const buildHandoffItems = (
  contract: PVMetricsReadonlyPilotDataContractDraft,
): PVMetricsReadonlyPilotFinalHandoffItem[] => {
  const goNoGo = contract.sourceGoNoGoChecklist;
  const hasBlockedContract = contract.contractStatus === 'blocked';
  const hasCriticalSignals = contract.criticalSignals > 0;
  const hasClientResponsibilities = contract.clientResponsibilities.length > 0;
  const hasOrbiResponsibilities = contract.orbiResponsibilities.length > 0;
  const hasReadOnlyClauses = contract.readOnlySafetyClauses.length >= 5;
  const hasExplicitExclusions = contract.explicitExclusions.length >= 5;

  return [
    {
      id: 'handoff-scope-ready',
      category: 'scope',
      label: 'Alcance read-only consolidado',
      status: contract.signalCount > 0 ? 'complete' : 'blocked',
      requiredForClientHandoff: true,
      evidence: `${contract.signalCount} señal(es)/check(s) contractual(es) registradas.`,
      nextAction:
        contract.signalCount > 0
          ? 'Mantener matriz de señales como referencia del handoff.'
          : 'Completar matriz de señales antes de preparar handoff.',
    },
    {
      id: 'handoff-gonogo-ready',
      category: 'go-no-go',
      label: 'Decisión Go/No-Go disponible',
      status: goNoGo.decision === 'no-go' ? 'blocked' : 'complete',
      requiredForClientHandoff: true,
      evidence: goNoGo.decisionLabel,
      nextAction:
        goNoGo.decision === 'no-go'
          ? 'Resolver bloqueantes antes de continuar.'
          : 'Usar decisión como base del cierre pre-piloto.',
    },
    {
      id: 'handoff-readiness-score',
      category: 'go-no-go',
      label: 'Readiness Score registrado',
      status: goNoGo.readinessScorePct >= 80 ? 'complete' : 'warning',
      requiredForClientHandoff: false,
      evidence: `${goNoGo.readinessScorePct}% de preparación.`,
      nextAction:
        goNoGo.readinessScorePct >= 80
          ? 'Mantener score como referencia ejecutiva.'
          : 'Revisar acciones requeridas para mejorar madurez antes de handoff cliente.',
    },
    {
      id: 'handoff-data-contract-ready',
      category: 'data-contract',
      label: 'Contrato de datos conceptual generado',
      status: hasBlockedContract ? 'blocked' : 'complete',
      requiredForClientHandoff: true,
      evidence: contract.contractStatusLabel,
      nextAction:
        hasBlockedContract
          ? 'No presentar contrato a cliente hasta resolver estado bloqueado.'
          : 'Usar borrador como base de conversación técnica.',
    },
    {
      id: 'handoff-critical-signals-reviewed',
      category: 'data-contract',
      label: 'Señales críticas identificadas',
      status: hasCriticalSignals ? 'warning' : 'complete',
      requiredForClientHandoff: false,
      evidence: `${contract.criticalSignals} señal(es)/check(s) crítico(s).`,
      nextAction:
        hasCriticalSignals
          ? 'Solicitar confirmación explícita del cliente para señales críticas.'
          : 'Sin señales críticas pendientes de atención especial.',
    },
    {
      id: 'handoff-client-responsibilities',
      category: 'client-action',
      label: 'Responsabilidades cliente definidas',
      status: hasClientResponsibilities ? 'complete' : 'warning',
      requiredForClientHandoff: true,
      evidence: `${contract.clientResponsibilities.length} responsabilidad(es) cliente.`,
      nextAction:
        'Confirmar contraparte técnica, disponibilidad de señales y límites read-only.',
    },
    {
      id: 'handoff-orbi-responsibilities',
      category: 'orbi-action',
      label: 'Responsabilidades ORBI definidas',
      status: hasOrbiResponsibilities ? 'complete' : 'warning',
      requiredForClientHandoff: true,
      evidence: `${contract.orbiResponsibilities.length} responsabilidad(es) ORBI.`,
      nextAction:
        'Mantener límites de análisis, no-control y revisión humana obligatoria.',
    },
    {
      id: 'handoff-readonly-clauses',
      category: 'security',
      label: 'Cláusulas read-only incluidas',
      status: hasReadOnlyClauses ? 'complete' : 'blocked',
      requiredForClientHandoff: true,
      evidence: `${contract.readOnlySafetyClauses.length} cláusula(s) read-only.`,
      nextAction:
        hasReadOnlyClauses
          ? 'Mantener cláusulas visibles en el paquete final.'
          : 'Agregar cláusulas read-only antes de handoff.',
    },
    {
      id: 'handoff-explicit-exclusions',
      category: 'security',
      label: 'Exclusiones explícitas incluidas',
      status: hasExplicitExclusions ? 'complete' : 'blocked',
      requiredForClientHandoff: true,
      evidence: `${contract.explicitExclusions.length} exclusión(es) explícita(s).`,
      nextAction:
        hasExplicitExclusions
          ? 'Usar exclusiones como límite de seguridad del handoff.'
          : 'Agregar exclusiones de telecontrol, setpoints, comandos y credenciales.',
    },
  ];
};

const buildPreparedDeliverables = () => [
  'Alcance conceptual de piloto read-only.',
  'Checklist de revisión cliente.',
  'Go/No-Go técnico local.',
  'Borrador conceptual de contrato de datos.',
  'Matriz de señales contractuales.',
  'Responsabilidades cliente/ORBI/conjuntas.',
  'Cláusulas read-only y exclusiones explícitas.',
  'Textos copiables para revisión interna y cliente.',
];

const buildSecurityBoundaries = () => [
  'No SCADA real.',
  'No APIs reales.',
  'No lectura de medidores reales.',
  'No telecontrol.',
  'No modificación de setpoints.',
  'No comandos a inversores.',
  'No comandos a BESS.',
  'No credenciales productivas en frontend.',
  'No backend productivo.',
  'No envío automático de correos.',
  'No exportación PDF desde este módulo.',
];

const buildExecutiveSummary = (
  contract: PVMetricsReadonlyPilotDataContractDraft,
  statusLabelStr: string,
) =>
  [
    `Paquete final de handoff read-only para ${contract.plantName} (${contract.plantCode}).`,
    `Estado del handoff: ${statusLabelStr}.`,
    `Estado contractual heredado: ${contract.contractStatusLabel}.`,
    `Decisión Go/No-Go heredada: ${contract.sourceGoNoGoChecklist.decisionLabel}.`,
    `Readiness Score heredado: ${contract.sourceGoNoGoChecklist.readinessScorePct}%.`,
    'Este paquete consolida alcance, revisión cliente, Go/No-Go y contrato conceptual de datos sin habilitar conexiones reales.',
  ].join(' ');

const buildInternalHandoffText = (base: Omit<PVMetricsReadonlyPilotFinalHandoffPackage, 'internalHandoffText' | 'clientHandoffText'>) =>
  [
    'ORBI PVMetrics IA — Read-Only Pilot Final Handoff Package',
    `Generado: ${base.generatedAtLabel}`,
    `Planta: ${base.plantName} (${base.plantCode})`,
    `Tecnología: ${base.technologyLabel}`,
    `Estado handoff: ${base.handoffStatusLabel}`,
    `Estado contractual: ${base.inheritedContractStatusLabel}`,
    `Decisión Go/No-Go: ${base.inheritedGoNoGoDecisionLabel}`,
    `Readiness Score: ${base.inheritedReadinessScorePct}%`,
    '',
    'Resumen ejecutivo:',
    base.executiveSummary,
    '',
    'Entregables preparados:',
    base.preparedDeliverables.map((item) => `- ${item}`).join('\n'),
    '',
    'Checklist final:',
    base.handoffItems
      .map(
        (item) =>
          `- [${item.status}] ${item.label} | Categoría: ${item.category} | Requerido: ${
            item.requiredForClientHandoff ? 'Sí' : 'No'
          } | Evidencia: ${item.evidence}`,
      )
      .join('\n'),
    '',
    'Pendientes críticos:',
    base.criticalPendingItems.length
      ? base.criticalPendingItems.map((item) => `- ${item}`).join('\n')
      : '- Sin pendientes críticos.',
    '',
    'Acciones antes de piloto:',
    base.actionsBeforePilot.length
      ? base.actionsBeforePilot.map((item) => `- ${item}`).join('\n')
      : '- Sin acciones adicionales.',
    '',
    'Límites de seguridad:',
    base.securityBoundaries.map((item) => `- ${item}`).join('\n'),
    '',
    'Safety Boundary:',
    base.safetyBoundary,
  ].join('\n');

const buildClientHandoffText = (base: Omit<PVMetricsReadonlyPilotFinalHandoffPackage, 'internalHandoffText' | 'clientHandoffText'>) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos el paquete conceptual de handoff para revisión de un eventual piloto read-only de ORBI PVMetrics IA en la planta ${base.plantName} (${base.plantCode}).`,
    '',
    `Estado del paquete: ${base.handoffStatusLabel}.`,
    `Decisión técnica previa: ${base.inheritedGoNoGoDecisionLabel}.`,
    `Readiness Score: ${base.inheritedReadinessScorePct}%.`,
    '',
    'Entregables preparados:',
    base.preparedDeliverables.map((item) => `- ${item}`).join('\n'),
    '',
    'Puntos que requieren atención:',
    base.criticalPendingItems.length
      ? base.criticalPendingItems.map((item) => `- ${item}`).join('\n')
      : '- No se registran pendientes críticos en esta revisión conceptual.',
    '',
    'Límites de seguridad:',
    base.securityBoundaries.map((item) => `- ${item}`).join('\n'),
    '',
    'Este paquete es conceptual y no autoriza conexión real. Cualquier avance futuro debe ser revisado y aprobado por responsables técnicos y de seguridad.',
  ].join('\n');

export const createPvMetricsReadonlyPilotFinalHandoffPackage = (
  contract: PVMetricsReadonlyPilotDataContractDraft,
): PVMetricsReadonlyPilotFinalHandoffPackage => {
  const handoffStatus = resolveHandoffStatus(contract);
  const handoffItems = buildHandoffItems(contract);

  const completeItems = handoffItems.filter((item) => item.status === 'complete').length;
  const pendingItems = handoffItems.filter((item) => item.status === 'pending').length;
  const warningItems = handoffItems.filter((item) => item.status === 'warning').length;
  const blockedItems = handoffItems.filter((item) => item.status === 'blocked').length;

  const criticalPendingItems = handoffItems
    .filter((item) => item.requiredForClientHandoff && item.status !== 'complete')
    .map((item) => `${item.label}: ${item.nextAction}`);

  const recommendedPendingItems = handoffItems
    .filter((item) => !item.requiredForClientHandoff && item.status !== 'complete')
    .map((item) => `${item.label}: ${item.nextAction}`);

  const finalRisks = handoffItems
    .filter((item) => item.status === 'warning' || item.status === 'blocked')
    .map((item) => `${item.label}: ${item.evidence}`);

  const actionsBeforePilot = handoffItems
    .filter((item) => item.status !== 'complete')
    .map((item) => item.nextAction);

  const base = {
    id: `readonly-pilot-final-handoff-${contract.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: contract.plantName,
    plantCode: contract.plantCode,
    technologyLabel: contract.technologyLabel,
    handoffStatus,
    handoffStatusLabel: handoffStatusLabelMap[handoffStatus],
    inheritedContractStatusLabel: contract.contractStatusLabel,
    inheritedGoNoGoDecisionLabel: getInheritedGoNoGoDecisionLabel(contract),
    inheritedReadinessScorePct: getInheritedReadinessScore(contract),
    totalItems: handoffItems.length,
    completeItems,
    pendingItems,
    warningItems,
    blockedItems,
    handoffItems,
    preparedDeliverables: buildPreparedDeliverables(),
    criticalPendingItems,
    recommendedPendingItems,
    finalRisks,
    actionsBeforePilot,
    securityBoundaries: buildSecurityBoundaries(),
    executiveSummary: buildExecutiveSummary(contract, handoffStatusLabelMap[handoffStatus]),
    safetyBoundary:
      'Este paquete final de handoff es local y conceptual. No conecta SCADA, no consume APIs, no lee medidores reales, no guarda credenciales, no modifica setpoints, no controla BESS, no controla inversores y no habilita telecontrol.',
    sourceDataContract: contract,
  };

  return {
    ...base,
    internalHandoffText: buildInternalHandoffText(base),
    clientHandoffText: buildClientHandoffText(base),
  };
};
