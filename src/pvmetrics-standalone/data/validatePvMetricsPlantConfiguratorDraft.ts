import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorFieldCheck,
  PVMetricsPlantConfiguratorFieldStatus,
  PVMetricsPlantConfiguratorValidationResult,
} from '../types/pvmetrics-plant-configurator.types';

const isTextReady = (value: string | null | undefined): boolean => 
  typeof value === 'string' && value.trim().length > 0;

const isPositiveNumber = (value: number | null | undefined): boolean =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const clampPct = (value: number): number => 
  Math.max(0, Math.min(100, Math.round(value)));

const createCheck = (
  id: string,
  label: string,
  stepId: PVMetricsPlantConfiguratorFieldCheck['stepId'],
  status: PVMetricsPlantConfiguratorFieldStatus,
  message: string,
): PVMetricsPlantConfiguratorFieldCheck => ({
  id,
  label,
  stepId,
  status,
  message,
});

export const validatePvMetricsPlantConfiguratorDraft = (
  draft: PVMetricsPlantConfiguratorDraft,
): PVMetricsPlantConfiguratorValidationResult => {
  const checks: PVMetricsPlantConfiguratorFieldCheck[] = [
    createCheck(
      'workspace-name',
      'Nombre de workspace',
      'workspace',
      isTextReady(draft.workspaceName) ? 'complete' : 'missing',
      isTextReady(draft.workspaceName)
        ? 'Workspace definido.'
        : 'Falta definir workspace del cliente.',
    ),
    createCheck(
      'owner-name',
      'Nombre de cliente',
      'workspace',
      isTextReady(draft.ownerName) ? 'complete' : 'missing',
      isTextReady(draft.ownerName)
        ? 'Cliente definido.'
        : 'Falta definir nombre del cliente.',
    ),
    createCheck(
      'plant-name',
      'Nombre de planta',
      'plant-identity',
      isTextReady(draft.plantName) ? 'complete' : 'missing',
      isTextReady(draft.plantName)
        ? 'Nombre de planta definido.'
        : 'Falta definir nombre de planta.',
    ),
    createCheck(
      'plant-code',
      'Código de planta',
      'plant-identity',
      isTextReady(draft.plantCode) ? 'complete' : 'missing',
      isTextReady(draft.plantCode)
        ? 'Código de planta definido.'
        : 'Falta definir código interno de planta.',
    ),
    createCheck(
      'commune',
      'Comuna / localidad',
      'location',
      isTextReady(draft.commune) ? 'complete' : 'missing',
      isTextReady(draft.commune)
        ? 'Ubicación base definida.'
        : 'Falta comuna o localidad de la planta.',
    ),
    createCheck(
      'pv-dc',
      'Potencia FV DC MWp',
      'pv-system',
      isPositiveNumber(draft.pvCapacityDcMwp) ? 'complete' : 'missing',
      isPositiveNumber(draft.pvCapacityDcMwp)
        ? 'Potencia DC definida.'
        : 'Falta potencia DC instalada.',
    ),
    createCheck(
      'pv-ac',
      'Potencia FV AC MW',
      'pv-system',
      isPositiveNumber(draft.pvCapacityAcMw) ? 'complete' : 'missing',
      isPositiveNumber(draft.pvCapacityAcMw)
        ? 'Potencia AC definida.'
        : 'Falta potencia AC nominal.',
    ),
    createCheck(
      'mounting-type',
      'Tipo de estructura',
      'pv-system',
      draft.mountingType !== 'unknown' ? 'complete' : 'missing',
      draft.mountingType !== 'unknown'
        ? 'Tipo de estructura definido.'
        : 'Falta definir estructura fija o tracker.',
    ),
    createCheck(
      'bess-size',
      'Potencia y energía BESS',
      'bess-system',
      !draft.hasBess
        ? 'not-required'
        : isPositiveNumber(draft.bessPowerMw) && isPositiveNumber(draft.bessEnergyMwh)
          ? 'complete'
          : 'missing',
      !draft.hasBess
        ? 'No aplica porque la planta no considera BESS.'
        : isPositiveNumber(draft.bessPowerMw) && isPositiveNumber(draft.bessEnergyMwh)
          ? 'BESS definido en MW y MWh.'
          : 'Falta potencia o energía BESS.',
    ),
    createCheck(
      'inverter-info',
      'Inversores',
      'equipment',
      isPositiveNumber(draft.inverterCount) && isTextReady(draft.inverterModel)
        ? 'complete'
        : 'warning',
      isPositiveNumber(draft.inverterCount) && isTextReady(draft.inverterModel)
        ? 'Cantidad y modelo de inversores definidos.'
        : 'Información de inversores pendiente o incompleta.',
    ),
    createCheck(
      'meter-info',
      'Medidor principal',
      'equipment',
      isTextReady(draft.meterModel) ? 'complete' : 'warning',
      isTextReady(draft.meterModel)
        ? 'Medidor principal definido.'
        : 'Medidor principal pendiente.',
    ),
    createCheck(
      'scada-readonly',
      'SCADA read-only',
      'data-sources',
      draft.hasScadaReadonly === 'available'
        ? 'complete'
        : draft.hasScadaReadonly === 'pending'
          ? 'warning'
          : 'missing',
      draft.hasScadaReadonly === 'available'
        ? 'Fuente SCADA read-only disponible.'
        : draft.hasScadaReadonly === 'pending'
          ? 'SCADA read-only pendiente de confirmación.'
          : 'SCADA read-only no disponible o desconocido.',
    ),
    createCheck(
      'energy-meter',
      'Fuente de medición',
      'data-sources',
      draft.hasEnergyMeter === 'available'
        ? 'complete'
        : draft.hasEnergyMeter === 'pending'
          ? 'warning'
          : 'missing',
      draft.hasEnergyMeter === 'available'
        ? 'Medición disponible.'
        : draft.hasEnergyMeter === 'pending'
          ? 'Medición pendiente de confirmación.'
          : 'Fuente de medición no disponible o desconocida.',
    ),
    createCheck(
      'weather-source',
      'Estación meteorológica',
      'data-sources',
      draft.hasWeatherStation === 'available'
        ? 'complete'
        : draft.hasWeatherStation === 'pending'
          ? 'warning'
          : 'missing',
      draft.hasWeatherStation === 'available'
        ? 'Fuente meteorológica disponible.'
        : draft.hasWeatherStation === 'pending'
          ? 'Fuente meteorológica pendiente.'
          : 'Fuente meteorológica no disponible o desconocida.',
    ),
    createCheck(
      'readonly-approval',
      'Autorización read-only',
      'readonly-security',
      draft.readonlyApproval === 'approved'
        ? 'complete'
        : draft.readonlyApproval === 'requested'
          ? 'warning'
          : 'missing',
      draft.readonlyApproval === 'approved'
        ? 'Autorización read-only aprobada.'
        : draft.readonlyApproval === 'requested'
          ? 'Autorización read-only solicitada.'
          : 'Autorización read-only aún no solicitada.',
    ),
    createCheck(
      'bess-telemetry-source',
      'Telemetría BESS',
      'data-sources',
      !draft.hasBess
        ? 'not-required'
        : (draft.hasBessEmsSource === 'available' || draft.hasBessBmsSource === 'available' || draft.hasBessPcsSource === 'available')
          ? 'complete'
          : (draft.hasBessEmsSource === 'pending' || draft.hasBessBmsSource === 'pending' || draft.hasBessPcsSource === 'pending')
            ? 'warning'
            : 'missing',
      !draft.hasBess
        ? 'No aplica para planta FV-only.'
        : (draft.hasBessEmsSource === 'available' || draft.hasBessBmsSource === 'available' || draft.hasBessPcsSource === 'available')
          ? 'Telemetría BESS mapeada correctamente.'
          : (draft.hasBessEmsSource === 'pending' || draft.hasBessBmsSource === 'pending' || draft.hasBessPcsSource === 'pending')
            ? 'Al menos una señal de telemetría BESS está pendiente.'
            : 'Falta declarar disponible al menos una fuente de telemetría BESS (EMS/BMS/PCS).',
    ),
    createCheck(
      'bess-measurement-source',
      'Medición Física BESS',
      'data-sources',
      !draft.hasBess
        ? 'not-required'
        : (draft.hasBessDedicatedMeter === 'available' || draft.hasPoiMeter === 'available')
          ? 'complete'
          : (draft.hasBessDedicatedMeter === 'pending' || draft.hasPoiMeter === 'pending')
            ? 'warning'
            : 'missing',
      !draft.hasBess
        ? 'No aplica para planta FV-only.'
        : (draft.hasBessDedicatedMeter === 'available' || draft.hasPoiMeter === 'available')
          ? 'Medición BESS validada en punto de acople.'
          : (draft.hasBessDedicatedMeter === 'pending' || draft.hasPoiMeter === 'pending')
            ? 'Medición BESS o POI pendiente de calibración.'
            : 'Falta declarar disponible al menos un medidor dedicado BESS o de frontera POI.',
    ),
  ];

  const totalChecks = checks.length;
  const completeChecks = checks.filter((check) => check.status === 'complete').length;
  const missingChecks = checks.filter((check) => check.status === 'missing').length;
  const warningChecks = checks.filter((check) => check.status === 'warning').length;
  const notRequiredChecks = checks.filter((check) => check.status === 'not-required').length;

  const applicableChecks = Math.max(1, totalChecks - notRequiredChecks);
  const rawPct = (completeChecks / applicableChecks) * 100;
  const completionPct = clampPct(rawPct);

  const canCreateDraftProfile = completionPct >= 35;
  const canRequestClientValidation = completionPct >= 70 && missingChecks <= 2;
  const canPrepareReadonlyPilot =
    completionPct >= 85 &&
    missingChecks === 0 &&
    draft.readonlyApproval === 'approved';

  return {
    summary: {
      totalChecks,
      completeChecks,
      missingChecks,
      warningChecks,
      notRequiredChecks,
      completionPct,
      canCreateDraftProfile,
      canRequestClientValidation,
      canPrepareReadonlyPilot,
    },
    checks,
  };
};
