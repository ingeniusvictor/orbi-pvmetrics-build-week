import { PVMetricsClientValidationGate } from '../types/pvmetrics-client-validation.types';
import {
  PVMetricsClientRequestCategory,
  PVMetricsClientRequestPriority,
  PVMetricsClientValidationRequestItem,
  PVMetricsClientValidationRequestPack,
} from '../types/pvmetrics-client-validation-request.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const resolveCategory = (checkId: string): PVMetricsClientRequestCategory => {
  if (checkId.includes('client') || checkId.includes('identity')) return 'identity';
  if (checkId.includes('scada')) return 'scada-readonly';
  if (checkId.includes('meter')) return 'metering';
  if (checkId.includes('weather')) return 'weather';
  if (checkId.includes('bess')) return 'bess';
  if (checkId.includes('readonly')) return 'permissions';
  if (checkId.includes('inverter') || checkId.includes('capacity')) {
    return 'technical-documentation';
  }

  return 'technical-documentation';
};

const resolvePriority = ({
  blocksReadonlyPilot,
  status,
}: {
  blocksReadonlyPilot: boolean;
  status: string;
}): PVMetricsClientRequestPriority => {
  if (blocksReadonlyPilot && status === 'missing') return 'critical';
  if (blocksReadonlyPilot) return 'high';
  if (status === 'missing') return 'medium';
  return 'low';
};

const createRequestItem = (
  check: PVMetricsClientValidationGate['checks'][number],
): PVMetricsClientValidationRequestItem => {
  const priority = resolvePriority({
    blocksReadonlyPilot: check.blocksReadonlyPilot,
    status: check.status,
  });

  return {
    id: `request-${check.id}`,
    category: resolveCategory(check.id),
    priority,
    title: check.label,
    requestText: check.recommendation,
    reason: check.note,
    blocksReadonlyPilot: check.blocksReadonlyPilot,
  };
};

const buildExecutiveIntro = (gate: PVMetricsClientValidationGate) =>
  [
    `Preparación de validación técnica para ${gate.plantName} (${gate.plantCode}).`,
    `Tecnología: ${gate.technologyLabel}.`,
    `Estado actual: ${gate.gateLabel}.`,
    `Score documental local: ${gate.scorePct}%.`,
    'Este paquete organiza la información requerida para validar el perfil y evaluar un eventual piloto read-only.',
  ].join(' ');

const buildClientMessageDraft = (
  gate: PVMetricsClientValidationGate,
  items: PVMetricsClientValidationRequestItem[],
) => {
  const criticalOrHigh = items.filter(
    (item) => item.priority === 'critical' || item.priority === 'high',
  );

  const mediumLow = items.filter(
    (item) => item.priority === 'medium' || item.priority === 'low',
  );

  return [
    'Estimado equipo,',
    '',
    `Estamos preparando la validación técnica del perfil de la planta ${gate.plantName} (${gate.plantCode}) en ORBI PVMetrics IA.`,
    '',
    'Para avanzar de forma segura hacia una revisión técnica y eventual piloto read-only, necesitamos confirmar la siguiente información:',
    '',
    'Requerimientos críticos / altos:',
    criticalOrHigh.length
      ? criticalOrHigh
          .map((item) => `- ${item.title}: ${item.requestText}`)
          .join('\n')
      : '- Sin requerimientos críticos pendientes detectados.',
    '',
    'Requerimientos complementarios:',
    mediumLow.length
      ? mediumLow.map((item) => `- ${item.title}: ${item.requestText}`).join('\n')
      : '- Sin requerimientos complementarios pendientes detectados.',
    '',
    'Límite de seguridad:',
    'La revisión propuesta es estrictamente read-only. No considera telecontrol, modificación de setpoints, envío de comandos a inversores/BESS ni escritura hacia activos físicos.',
    '',
    'Quedamos atentos a la documentación o confirmación correspondiente.',
  ].join('\n');
};

const buildTechnicalChecklistText = (
  items: PVMetricsClientValidationRequestItem[],
) =>
  [
    'ORBI PVMetrics IA — Checklist de Validación Cliente',
    '',
    ...items.map((item) =>
      [
        `- [ ] ${item.title}`,
        `  Categoría: ${item.category}`,
        `  Prioridad: ${item.priority}`,
        `  Solicitud: ${item.requestText}`,
        `  Motivo: ${item.reason}`,
        `  Bloquea piloto read-only: ${item.blocksReadonlyPilot ? 'Sí' : 'No'}`,
      ].join('\n'),
    ),
  ].join('\n');

export const createPvMetricsClientValidationRequestPack = (
  gate: PVMetricsClientValidationGate,
): PVMetricsClientValidationRequestPack => {
  const items = gate.checks
    .filter(
      (check) =>
        check.status === 'missing' ||
        check.status === 'pending-client' ||
        check.status === 'demo-only',
    )
    .map(createRequestItem);

  const criticalItems = items.filter((item) => item.priority === 'critical').length;
  const highItems = items.filter((item) => item.priority === 'high').length;
  const mediumItems = items.filter((item) => item.priority === 'medium').length;
  const lowItems = items.filter((item) => item.priority === 'low').length;

  return {
    id: `client-request-pack-${gate.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    title: 'Client Validation Request Pack',
    plantName: gate.plantName,
    plantCode: gate.plantCode,
    technologyLabel: gate.technologyLabel,
    gateLabel: gate.gateLabel,
    scorePct: gate.scorePct,
    items,
    criticalItems,
    highItems,
    mediumItems,
    lowItems,
    executiveIntro: buildExecutiveIntro(gate),
    clientMessageDraft: buildClientMessageDraft(gate, items),
    technicalChecklistText: buildTechnicalChecklistText(items),
    safetyBoundary:
      'Paquete local copiable. No envía correos, no guarda datos, no conecta SCADA, no ejecuta APIs, no modifica setpoints y no habilita telecontrol.',
    sourceGate: gate,
  };
};
