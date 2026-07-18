import { createPvMetricsPlantConfiguratorDraft } from './createPvMetricsPlantConfiguratorDraft';
import {
  PVMetricsPlantConfiguratorDraft,
} from '../types/pvmetrics-plant-configurator.types';
import {
  PVMetricsMountingType,
} from '../types/pvmetrics-plant-profile.types';
import { PVMetricsPlantIntakeParsedResult } from '../types/pvmetrics-plant-intake.types';

const getFieldValue = (
  intake: PVMetricsPlantIntakeParsedResult,
  label: string,
) =>
  intake.fields.find((field) => field.label === label)?.normalizedValue ?? '';

const toNumberOrNull = (value: string) => {
  const cleaned = value
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  if (!cleaned.trim()) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const toBoolean = (value: string) => {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  return ['si', 'sí', 'yes', 'true', '1', 'fv+bess', 'pv-bess'].includes(
    normalized,
  );
};

const normalizeTechnology = (value: string): 'pv-only' | 'pv-bess' => {
  const normalized = value.toLowerCase();

  if (normalized.includes('bess') || normalized.includes('bateria') || normalized.includes('baterias')) {
    return 'pv-bess';
  }

  return 'pv-only';
};

const normalizeMountingType = (value: string): PVMetricsMountingType => {
  const normalized = value.toLowerCase();

  if (normalized.includes('tracker') || normalized.includes('seguidor')) {
    return 'single-axis-tracker';
  }

  if (normalized.includes('dual')) {
    return 'dual-axis-tracker';
  }

  if (normalized.includes('fixed') || normalized.includes('fija')) {
    return 'fixed-tilt';
  }

  return 'unknown';
};

const normalizeSourceAvailability = (value: string) => {
  const normalized = value.toLowerCase();

  if (
    normalized.includes('disponible') ||
    normalized.includes('available') ||
    normalized.includes('read-only') ||
    normalized.includes('readonly')
  ) {
    return 'available' as const;
  }

  if (
    normalized.includes('pendiente') ||
    normalized.includes('pending') ||
    normalized.includes('por validar')
  ) {
    return 'pending' as const;
  }

  if (
    normalized.includes('no disponible') ||
    normalized.includes('not available') ||
    normalized.includes('no aplica')
  ) {
    return 'not-available' as const;
  }

  return 'unknown' as const;
};

export const createPvMetricsDraftFromIntake = (
  intake: PVMetricsPlantIntakeParsedResult,
): PVMetricsPlantConfiguratorDraft => {
  const baseDraft = createPvMetricsPlantConfiguratorDraft();

  const technology = normalizeTechnology(getFieldValue(intake, 'Tecnología'));
  const hasBess =
    technology === 'pv-bess' || toBoolean(getFieldValue(intake, 'Tiene BESS'));

  return {
    ...baseDraft,

    workspaceName:
      getFieldValue(intake, 'Workspace') || baseDraft.workspaceName,
    ownerName: getFieldValue(intake, 'Cliente') || baseDraft.ownerName,
    plantName: getFieldValue(intake, 'Nombre planta') || baseDraft.plantName,
    plantCode: getFieldValue(intake, 'Código planta') || baseDraft.plantCode,

    country: getFieldValue(intake, 'País') || baseDraft.country,
    region: getFieldValue(intake, 'Región') || baseDraft.region,
    commune: getFieldValue(intake, 'Comuna') || baseDraft.commune,
    timezone: getFieldValue(intake, 'Zona horaria') || baseDraft.timezone,

    technology,
    hasBess,

    pvCapacityDcMwp:
      toNumberOrNull(getFieldValue(intake, 'Potencia FV DC')) ??
      baseDraft.pvCapacityDcMwp,
    pvCapacityAcMw:
      toNumberOrNull(getFieldValue(intake, 'Potencia FV AC')) ??
      baseDraft.pvCapacityAcMw,
    mountingType: normalizeMountingType(getFieldValue(intake, 'Tipo estructura')),

    inverterCount:
      toNumberOrNull(getFieldValue(intake, 'Cantidad inversores')) ??
      baseDraft.inverterCount,
    inverterModel:
      getFieldValue(intake, 'Modelo inversor') || baseDraft.inverterModel,

    bessPowerMw: hasBess
      ? toNumberOrNull(getFieldValue(intake, 'Potencia BESS'))
      : null,
    bessEnergyMwh: hasBess
      ? toNumberOrNull(getFieldValue(intake, 'Energía BESS'))
      : null,
    bessMinSocPct: hasBess
      ? toNumberOrNull(getFieldValue(intake, 'SOC mínimo')) ??
        baseDraft.bessMinSocPct
      : null,
    bessMaxSocPct: hasBess
      ? toNumberOrNull(getFieldValue(intake, 'SOC máximo')) ??
        baseDraft.bessMaxSocPct
      : null,
    bessRoundTripEfficiencyPct: hasBess
      ? toNumberOrNull(getFieldValue(intake, 'Eficiencia round-trip')) ??
        baseDraft.bessRoundTripEfficiencyPct
      : null,
    bessEmsVendor:
      getFieldValue(intake, 'EMS/BMS/PCS') || baseDraft.bessEmsVendor,

    hasScadaReadonly: normalizeSourceAvailability(
      getFieldValue(intake, 'Fuente SCADA'),
    ),
    hasEnergyMeter: normalizeSourceAvailability(
      getFieldValue(intake, 'Fuente medidor planta'),
    ),
    hasWeatherStation: normalizeSourceAvailability(
      getFieldValue(intake, 'Fuente meteorológica'),
    ),

    bessTelemetrySourceLabel:
      getFieldValue(intake, 'Fuente telemetría BESS') ||
      baseDraft.bessTelemetrySourceLabel,
    bessMeasurementSourceLabel:
      getFieldValue(intake, 'Fuente medición BESS') ||
      baseDraft.bessMeasurementSourceLabel,

    readonlyApproval:
      normalizeSourceAvailability(getFieldValue(intake, 'Aprobación read-only')) ===
      'available'
        ? 'approved'
        : baseDraft.readonlyApproval,

    sourceOfTruthLabel:
      'Draft generado desde ORBI Plant Intake v1 — pendiente de validación cliente',

    notes:
      [
        baseDraft.notes,
        getFieldValue(intake, 'Notas'),
        `Origen intake: ${intake.sourceLabel}`,
      ]
        .filter(Boolean)
        .join('\n'),
  };
};
