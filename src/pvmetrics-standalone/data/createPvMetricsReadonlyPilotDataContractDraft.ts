import { PVMetricsReadonlyPilotGoNoGoChecklist } from '../types/pvmetrics-readonly-pilot-gonogo.types';
import {
  PVMetricsReadonlyPilotDataContractDraft,
  PVMetricsReadonlyPilotDataContractResponsibility,
  PVMetricsReadonlyPilotDataContractSignal,
  PVMetricsReadonlyPilotDataContractSignalCriticality,
  PVMetricsReadonlyPilotDataContractSignalFrequency,
} from '../types/pvmetrics-readonly-pilot-data-contract.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const statusLabel: Record<PVMetricsReadonlyPilotDataContractDraft['contractStatus'], string> = {
  blocked: 'BLOQUEADO — NO GENERAR CONTRATO DE DATOS',
  draft: 'BORRADOR DE CONTRATO DE DATOS',
  'ready-for-client-review': 'LISTO PARA REVISIÓN CLIENTE',
  'ready-for-technical-review': 'LISTO PARA REVISIÓN TÉCNICA',
};

const resolveContractStatus = (
  checklist: PVMetricsReadonlyPilotGoNoGoChecklist,
): PVMetricsReadonlyPilotDataContractDraft['contractStatus'] => {
  if (checklist.decision === 'no-go') return 'blocked';
  if (checklist.decision === 'conditional-go') return 'ready-for-technical-review';
  if (checklist.decision === 'go') return 'ready-for-client-review';
  return 'draft';
};

const resolveCriticality = (
  checkStatus: string,
  blocksGo: boolean,
): PVMetricsReadonlyPilotDataContractSignalCriticality => {
  if (blocksGo) return 'critical';
  if (checkStatus === 'fail') return 'critical';
  if (checkStatus === 'warning') return 'high';
  return 'medium';
};

const resolveFrequency = (
  category: string,
): PVMetricsReadonlyPilotDataContractSignalFrequency => {
  if (category === 'signals' || category === 'bess') return 'near-real-time';
  if (category === 'data-quality') return 'daily';
  if (category === 'governance') return 'on-demand';
  return 'to-be-confirmed';
};

const createContractSignals = (
  checklist: PVMetricsReadonlyPilotGoNoGoChecklist,
): PVMetricsReadonlyPilotDataContractSignal[] =>
  checklist.checks.map((check) => ({
    id: `contract-signal-${check.id}`,
    label: check.label,
    category: check.category,
    unit: 'to-be-confirmed',
    expectedSource: check.evidence,
    suggestedFrequency: resolveFrequency(check.category),
    criticality: resolveCriticality(check.status, check.blocksGo),
    qualityRules: [
      'Debe tener timestamp claro o periodo de referencia.',
      'Debe ser consistente con la fuente declarada por el cliente.',
      'Debe mantenerse en modo solo lectura.',
      'Debe ser validada por responsable humano antes de una conexión real.',
    ],
    clientConfirmationRequired: check.requiredForGo || check.blocksGo,
    readOnlyOnly: true,
  }));

const clientResponsibilities: PVMetricsReadonlyPilotDataContractResponsibility[] = [
  {
    id: 'client-signal-availability',
    owner: 'client',
    label: 'Confirmar disponibilidad de señales',
    description:
      'El cliente debe confirmar cuáles señales están disponibles, su fuente, frecuencia, unidad y restricciones de acceso.',
  },
  {
    id: 'client-readonly-access',
    owner: 'client',
    label: 'Garantizar acceso estrictamente read-only',
    description:
      'El cliente debe confirmar que cualquier acceso futuro será solo lectura, sin escritura, comandos, setpoints ni telecontrol.',
  },
  {
    id: 'client-data-owner',
    owner: 'client',
    label: 'Designar responsable técnico de datos',
    description:
      'El cliente debe designar una contraparte técnica para validar señales, origen de datos y calidad.',
  },
];

const orbiResponsibilities: PVMetricsReadonlyPilotDataContractResponsibility[] = [
  {
    id: 'orbi-no-control',
    owner: 'orbi',
    label: 'Mantener operación sin control',
    description:
      'ORBI PVMetrics IA debe mantenerse como herramienta de análisis, sin control sobre SCADA, inversores, BESS, medidores, EMS, BMS o PCS.',
  },
  {
    id: 'orbi-no-secret-storage',
    owner: 'orbi',
    label: 'No almacenar credenciales productivas en frontend',
    description:
      'El frontend standalone no debe contener credenciales, tokens, llaves API ni secretos productivos.',
  },
  {
    id: 'orbi-human-review',
    owner: 'orbi',
    label: 'Declarar revisión humana obligatoria',
    description:
      'Todo resultado, readiness o recomendación debe considerarse conceptual hasta ser validado por un responsable humano.',
  },
];

const jointResponsibilities: PVMetricsReadonlyPilotDataContractResponsibility[] = [
  {
    id: 'joint-signal-matrix-review',
    owner: 'joint',
    label: 'Revisar matriz de señales',
    description:
      'Cliente y equipo ORBI deben revisar conjuntamente la matriz de señales antes de cualquier integración futura.',
  },
  {
    id: 'joint-security-boundary',
    owner: 'joint',
    label: 'Validar límite de seguridad',
    description:
      'Ambas partes deben aceptar que el alcance es read-only y excluye telecontrol, setpoints y comandos.',
  },
];

const qualityAssumptions = [
  'Las señales serán evaluadas de forma conceptual antes de cualquier conexión real.',
  'La frecuencia real debe ser confirmada por el cliente.',
  'Las unidades deben validarse contra documentación técnica o source-of-truth.',
  'La zona horaria debe quedar definida antes de analizar series temporales.',
  'La calidad de datos debe ser revisada por responsable humano.',
];

const explicitExclusions = [
  'Telecontrol.',
  'Modificación de setpoints.',
  'Comandos a inversores.',
  'Comandos a BESS.',
  'Comandos a EMS, BMS o PCS.',
  'Escritura sobre SCADA.',
  'Lectura real de medidores desde este módulo.',
  'Gestión de credenciales productivas en frontend.',
  'Operación comercial real.',
];

const readOnlySafetyClauses = [
  'El alcance es estrictamente solo lectura.',
  'No se habilita escritura hacia sistemas reales.',
  'No se ejecutan comandos.',
  'No se modifican setpoints.',
  'No se controla BESS ni inversores.',
  'No se almacenan credenciales productivas en frontend.',
];

const buildInternalContractText = (draftBase: Omit<PVMetricsReadonlyPilotDataContractDraft, 'internalContractText' | 'clientContractText'>) =>
  [
    'ORBI PVMetrics IA — Read-Only Pilot Data Contract Draft',
    `Generado: ${draftBase.generatedAtLabel}`,
    `Planta: ${draftBase.plantName} (${draftBase.plantCode})`,
    `Tecnología: ${draftBase.technologyLabel}`,
    `Estado: ${draftBase.contractStatusLabel}`,
    '',
    `Total señales/checks contractuales: ${draftBase.signalCount}`,
    `Críticas: ${draftBase.criticalSignals}`,
    `Altas: ${draftBase.highSignals}`,
    `Medias: ${draftBase.mediumSignals}`,
    `Bajas: ${draftBase.lowSignals}`,
    '',
    'Señales / checks contractuales:',
    draftBase.signals
      .map(
        (signal) =>
          `- [${signal.criticality}] ${signal.label} | Categoría: ${signal.category} | Fuente esperada: ${signal.expectedSource} | Frecuencia: ${signal.suggestedFrequency}`,
      )
      .join('\n'),
    '',
    'Responsabilidades cliente:',
    draftBase.clientResponsibilities.map((item) => `- ${item.label}: ${item.description}`).join('\n'),
    '',
    'Responsabilidades ORBI:',
    draftBase.orbiResponsibilities.map((item) => `- ${item.label}: ${item.description}`).join('\n'),
    '',
    'Exclusiones:',
    draftBase.explicitExclusions.map((item) => `- ${item}`).join('\n'),
    '',
    'Límite de seguridad:',
    draftBase.safetyBoundary,
  ].join('\n');

const buildClientContractText = (draftBase: Omit<PVMetricsReadonlyPilotDataContractDraft, 'internalContractText' | 'clientContractText'>) =>
  [
    'Estimado equipo,',
    '',
    `Compartimos el borrador conceptual de contrato de datos read-only para la planta ${draftBase.plantName} (${draftBase.plantCode}).`,
    '',
    `Estado actual: ${draftBase.contractStatusLabel}.`,
    '',
    'El objetivo es confirmar señales, fuentes, frecuencia esperada, unidades y límites de acceso antes de cualquier fase técnica futura.',
    '',
    'Señales / checks a revisar:',
    draftBase.signals
      .slice(0, 20)
      .map(
        (signal) =>
          `- ${signal.label} | Fuente esperada: ${signal.expectedSource} | Frecuencia sugerida: ${signal.suggestedFrequency}`,
      )
      .join('\n'),
    '',
    'Responsabilidades esperadas del cliente:',
    draftBase.clientResponsibilities.map((item) => `- ${item.label}: ${item.description}`).join('\n'),
    '',
    'Cláusulas read-only:',
    draftBase.readOnlySafetyClauses.map((item) => `- ${item}`).join('\n'),
    '',
    'Fuera de alcance:',
    draftBase.explicitExclusions.map((item) => `- ${item}`).join('\n'),
    '',
    'Este documento es un borrador conceptual y debe ser revisado por responsables técnicos antes de cualquier conexión real.',
  ].join('\n');

export const createPvMetricsReadonlyPilotDataContractDraft = (
  checklist: PVMetricsReadonlyPilotGoNoGoChecklist,
): PVMetricsReadonlyPilotDataContractDraft => {
  const signals = createContractSignals(checklist);

  const criticalSignals = signals.filter((signal) => signal.criticality === 'critical').length;
  const highSignals = signals.filter((signal) => signal.criticality === 'high').length;
  const mediumSignals = signals.filter((signal) => signal.criticality === 'medium').length;
  const lowSignals = signals.filter((signal) => signal.criticality === 'low').length;

  const contractStatus = resolveContractStatus(checklist);

  const base = {
    id: `readonly-pilot-data-contract-${checklist.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: checklist.plantName,
    plantCode: checklist.plantCode,
    technologyLabel: checklist.technologyLabel,
    contractStatus,
    contractStatusLabel: statusLabel[contractStatus],
    signalCount: signals.length,
    criticalSignals,
    highSignals,
    mediumSignals,
    lowSignals,
    signals,
    clientResponsibilities,
    orbiResponsibilities,
    jointResponsibilities,
    qualityAssumptions,
    explicitExclusions,
    readOnlySafetyClauses,
    safetyBoundary:
      'Este contrato de datos es un borrador local y conceptual. No conecta SCADA, no consume APIs, no lee medidores reales, no guarda credenciales, no modifica setpoints, no controla BESS, no controla inversores y no habilita telecontrol.',
    sourceGoNoGoChecklist: checklist,
  };

  return {
    ...base,
    internalContractText: buildInternalContractText(base),
    clientContractText: buildClientContractText(base),
  };
};
