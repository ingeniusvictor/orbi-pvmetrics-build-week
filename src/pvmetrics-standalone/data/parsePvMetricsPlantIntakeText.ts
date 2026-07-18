import {
  PVMetricsPlantIntakeField,
  PVMetricsPlantIntakeFileType,
  PVMetricsPlantIntakeParsedResult,
} from '../types/pvmetrics-plant-intake.types';
import {
  PVMETRICS_PLANT_INTAKE_BESS_REQUIRED_FIELDS,
  PVMETRICS_PLANT_INTAKE_REQUIRED_FIELDS,
} from './pvMetricsPlantIntakeTemplate';

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const getParsedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const extractFieldValue = (rawText: string, label: string) => {
  const normalizedLabel = normalizeText(label);
  const lines = rawText.split(/\r?\n/);

  const matchedLine = lines.find((line) => {
    const [left] = line.split(':');
    return normalizeText(left) === normalizedLabel;
  });

  if (!matchedLine) return '';

  const [, ...rest] = matchedLine.split(':');
  return rest.join(':').trim();
};

const createField = (
  rawText: string,
  label: string,
  required: boolean,
): PVMetricsPlantIntakeField => {
  const rawValue = extractFieldValue(rawText, label);
  const normalizedValue = rawValue.trim();

  return {
    key: normalizeText(label).replace(/\s+/g, '-'),
    label,
    rawValue,
    normalizedValue,
    confidence: normalizedValue ? 'high' : required ? 'missing' : 'low',
    required,
  };
};

export const parsePvMetricsPlantIntakeText = ({
  rawText,
  sourceFileType = 'manual-paste',
  sourceLabel = 'Texto pegado manualmente',
}: {
  rawText: string;
  sourceFileType?: PVMetricsPlantIntakeFileType;
  sourceLabel?: string;
}): PVMetricsPlantIntakeParsedResult => {
  const baseLabels = [
    'Cliente',
    'Workspace',
    'Nombre planta',
    'Código planta',
    'País',
    'Región',
    'Comuna',
    'Zona horaria',
    'Tecnología',
    'Potencia FV DC',
    'Potencia FV AC',
    'Tipo estructura',
    'Cantidad inversores',
    'Modelo inversor',
    'Tiene BESS',
    'Potencia BESS',
    'Energía BESS',
    'SOC mínimo',
    'SOC máximo',
    'Eficiencia round-trip',
    'EMS/BMS/PCS',
    'Fuente ambiental',
    'Fuente SCADA',
    'Fuente medidor planta',
    'Fuente meteorológica',
    'Fuente telemetría BESS',
    'Fuente medición BESS',
    'Aprobación read-only',
    'Notas',
  ];

  const hasBessValue = extractFieldValue(rawText, 'Tiene BESS');
  const hasBess =
    ['si', 'sí', 'yes', 'true', 'fv+bess', 'pv-bess'].includes(
      normalizeText(hasBessValue),
    ) || normalizeText(extractFieldValue(rawText, 'Tecnología')).includes('bess');

  const fields = baseLabels.map((label) => {
    const required =
      PVMETRICS_PLANT_INTAKE_REQUIRED_FIELDS.includes(label) ||
      (hasBess && PVMETRICS_PLANT_INTAKE_BESS_REQUIRED_FIELDS.includes(label));

    return createField(rawText, label, required);
  });

  const missingRequiredFields = fields
    .filter((field) => field.required && !field.normalizedValue)
    .map((field) => field.label);

  const warnings = [
    ...(sourceFileType === 'pdf'
      ? ['PDF marcado como fuente. En esta fase se requiere texto extraído o pegado manualmente.']
      : []),
    ...(sourceFileType === 'docx'
      ? ['DOCX marcado como fuente. En esta fase se requiere texto extraído o pegado manualmente.']
      : []),
    ...(missingRequiredFields.length
      ? ['Existen campos obligatorios pendientes. El perfil quedará como draft no validado.']
      : []),
  ];

  return {
    id: `plant-intake-${Date.now()}`,
    sourceFileType,
    sourceLabel,
    parsedAtLabel: getParsedAtLabel(),
    rawText,
    fields,
    missingRequiredFields,
    warnings,
    canCreateDraft: fields.some((field) => field.normalizedValue),
    canRequestValidation: missingRequiredFields.length === 0,
  };
};
