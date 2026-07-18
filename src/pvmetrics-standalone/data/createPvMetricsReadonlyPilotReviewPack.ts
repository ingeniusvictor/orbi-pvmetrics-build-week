import { PVMetricsReadonlyPilotScope } from '../types/pvmetrics-readonly-pilot-scope.types';
import {
  PVMetricsReadonlyPilotReviewItem,
  PVMetricsReadonlyPilotReviewPack,
} from '../types/pvmetrics-readonly-pilot-review-pack.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const resolvePriority = (
  signalPriority: string,
): PVMetricsReadonlyPilotReviewItem['priority'] => {
  if (signalPriority === 'mandatory') return 'critical';
  if (signalPriority === 'recommended') return 'high';
  return 'medium';
};

const createSignalReviewItem = (
  signal: PVMetricsReadonlyPilotScope['signals'][number],
): PVMetricsReadonlyPilotReviewItem => ({
  id: `review-signal-${signal.id}`,
  category: signal.domain === 'bess' ? 'bess' : 'signal-availability',
  signalId: signal.id,
  label: `Confirmar disponibilidad de señal: ${signal.label}`,
  priority: resolvePriority(signal.priority),
  status: 'pending-client-confirmation',
  questionForClient:
    `¿La señal "${signal.label}" está disponible en modo solo lectura desde ${signal.expectedSource}?`,
  internalReason: signal.reason,
  blocksReadonlyPreparation: signal.priority === 'mandatory',
});

const baseGovernanceItems: PVMetricsReadonlyPilotReviewItem[] = [
  {
    id: 'review-readonly-access',
    category: 'read-only-access',
    label: 'Confirmar acceso estrictamente read-only',
    priority: 'critical',
    status: 'pending-client-confirmation',
    questionForClient:
      '¿El acceso disponible para ORBI PVMetrics IA puede ser limitado estrictamente a lectura, sin escritura, comandos ni modificación de setpoints?',
    internalReason:
      'El piloto solo puede avanzar si el alcance técnico excluye escritura, control y telecontrol.',
    blocksReadonlyPreparation: true,
  },
  {
    id: 'review-no-credentials-frontend',
    category: 'security',
    label: 'Confirmar que no se entregarán credenciales productivas al frontend',
    priority: 'critical',
    status: 'pending-client-confirmation',
    questionForClient:
      '¿Las credenciales productivas, si existen en fases futuras, quedarán fuera del frontend y serán gestionadas por una arquitectura segura?',
    internalReason:
      'El frontend standalone no debe contener credenciales reales ni secretos productivos.',
    blocksReadonlyPreparation: true,
  },
  {
    id: 'review-data-owner',
    category: 'governance',
    label: 'Confirmar responsable técnico de datos',
    priority: 'high',
    status: 'pending-client-confirmation',
    questionForClient:
      '¿Quién será el responsable técnico del cliente para validar disponibilidad, calidad y origen de las señales?',
    internalReason:
      'Se requiere contraparte técnica para validar el source-of-truth antes de cualquier piloto read-only.',
    blocksReadonlyPreparation: false,
  },
  {
    id: 'review-sample-period',
    category: 'data-quality',
    label: 'Confirmar periodo de muestra de datos',
    priority: 'high',
    status: 'pending-client-confirmation',
    questionForClient:
      '¿Qué periodo de datos históricos o simulados se puede usar para validar consistencia antes del piloto read-only?',
    internalReason:
      'Un periodo de muestra ayuda a detectar inconsistencias, señales incompletas o desfases horarios.',
    blocksReadonlyPreparation: false,
  },
];

const buildReadOnlyConfirmations = () => [
  'El acceso debe ser solo lectura.',
  'No se aceptan comandos hacia SCADA, inversores, BESS, EMS, BMS, PCS ni medidores.',
  'No se permite modificación de setpoints.',
  'No se deben exponer credenciales productivas en frontend.',
  'La matriz de señales debe ser validada por responsable humano.',
  'Toda conexión real futura debe pasar por aprobación técnica y de seguridad.',
];

const buildClientReviewText = (packBase: {
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;
  mandatorySignalSummary: string[];
  recommendedSignalSummary: string[];
  optionalSignalSummary: string[];
  items: PVMetricsReadonlyPilotReviewItem[];
  readOnlyConfirmations: string[];
  safetyBoundary: string;
}) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos el checklist de revisión para preparar el alcance de un piloto read-only de ORBI PVMetrics IA para la planta ${packBase.plantName} (${packBase.plantCode}).`,
    '',
    `Tecnología: ${packBase.technologyLabel}`,
    `Generado: ${packBase.generatedAtLabel}`,
    '',
    'Señales obligatorias a confirmar:',
    packBase.mandatorySignalSummary.length
      ? packBase.mandatorySignalSummary.map((item) => `- ${item}`).join('\n')
      : '- Sin señales obligatorias registradas.',
    '',
    'Señales recomendadas:',
    packBase.recommendedSignalSummary.length
      ? packBase.recommendedSignalSummary.map((item) => `- ${item}`).join('\n')
      : '- Sin señales recomendadas registradas.',
    '',
    'Señales opcionales:',
    packBase.optionalSignalSummary.length
      ? packBase.optionalSignalSummary.map((item) => `- ${item}`).join('\n')
      : '- Sin señales opcionales registradas.',
    '',
    'Preguntas de revisión cliente:',
    packBase.items
      .slice(0, 20)
      .map((item) => `- ${item.questionForClient}`)
      .join('\n'),
    '',
    'Confirmaciones read-only:',
    packBase.readOnlyConfirmations.map((item) => `- ${item}`).join('\n'),
    '',
    'Límite de seguridad:',
    packBase.safetyBoundary,
  ].join('\n');

const buildInternalReviewText = (packBase: {
  generatedAtLabel: string;
  plantName: string;
  plantCode: string;
  technologyLabel: string;
  totalItems: number;
  criticalItems: number;
  highItems: number;
  mediumItems: number;
  lowItems: number;
  bessItems: number;
  blockingItems: number;
  items: PVMetricsReadonlyPilotReviewItem[];
  safetyBoundary: string;
}) =>
  [
    'ORBI PVMetrics IA — Read-Only Pilot Client Review Pack',
    `Generado: ${packBase.generatedAtLabel}`,
    `Planta: ${packBase.plantName} (${packBase.plantCode})`,
    `Tecnología: ${packBase.technologyLabel}`,
    '',
    `Total ítems: ${packBase.totalItems}`,
    `Críticos: ${packBase.criticalItems}`,
    `Altos: ${packBase.highItems}`,
    `Medios: ${packBase.mediumItems}`,
    `Bajos: ${packBase.lowItems}`,
    `BESS: ${packBase.bessItems}`,
    `Bloqueantes: ${packBase.blockingItems}`,
    '',
    'Ítems de revisión:',
    packBase.items
      .map(
        (item) =>
          `- [${item.priority}] ${item.label} | ${item.category} | Bloquea: ${
            item.blocksReadonlyPreparation ? 'Sí' : 'No'
          } | Motivo: ${item.internalReason}`,
      )
      .join('\n'),
    '',
    'Límite de seguridad:',
    packBase.safetyBoundary,
  ].join('\n');

export const createPvMetricsReadonlyPilotReviewPack = (
  scope: PVMetricsReadonlyPilotScope,
): PVMetricsReadonlyPilotReviewPack => {
  const signalItems = scope.signals.map(createSignalReviewItem);
  const items = [...signalItems, ...baseGovernanceItems];

  const criticalItems = items.filter((item) => item.priority === 'critical').length;
  const highItems = items.filter((item) => item.priority === 'high').length;
  const mediumItems = items.filter((item) => item.priority === 'medium').length;
  const lowItems = items.filter((item) => item.priority === 'low').length;
  const bessItems = items.filter((item) => item.category === 'bess').length;
  const blockingItems = items.filter((item) => item.blocksReadonlyPreparation).length;

  const mandatorySignalSummary = scope.signals
    .filter((signal) => signal.priority === 'mandatory')
    .map((signal) => `${signal.label} (${signal.unit}) — ${signal.expectedSource}`);

  const recommendedSignalSummary = scope.signals
    .filter((signal) => signal.priority === 'recommended')
    .map((signal) => `${signal.label} (${signal.unit}) — ${signal.expectedSource}`);

  const optionalSignalSummary = scope.signals
    .filter((signal) => signal.priority === 'optional')
    .map((signal) => `${signal.label} (${signal.unit}) — ${signal.expectedSource}`);

  const generatedAtLabel = getGeneratedAtLabel();

  const base = {
    id: `readonly-pilot-review-pack-${scope.id}`,
    generatedAtLabel,
    plantName: scope.plantName,
    plantCode: scope.plantCode,
    technologyLabel: scope.technologyLabel,
    totalItems: items.length,
    criticalItems,
    highItems,
    mediumItems,
    lowItems,
    bessItems,
    blockingItems,
    items,
    mandatorySignalSummary,
    recommendedSignalSummary,
    optionalSignalSummary,
    readOnlyConfirmations: buildReadOnlyConfirmations(),
    safetyBoundary:
      'Este paquete es local y conceptual. No conecta SCADA, no consume APIs, no lee medidores reales, no guarda credenciales, no modifica setpoints, no controla BESS, no controla inversores y no habilita telecontrol.',
    sourceScope: scope,
  };

  return {
    ...base,
    clientReviewText: buildClientReviewText(base),
    internalReviewText: buildInternalReviewText(base),
  };
};
