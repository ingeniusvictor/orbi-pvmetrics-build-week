import { PVMetricsPlantConfiguratorDraft } from '../types/pvmetrics-plant-configurator.types';
import {
  PVMetricsClientValidationGate,
  PVMetricsSourceOfTruthCheck,
  PVMetricsValidationEvidenceStatus,
  PVMetricsValidationEvidenceType,
  PVMetricsValidationGateStatus,
} from '../types/pvmetrics-client-validation.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const isReadyText = (value?: string | null) =>
  Boolean(value && value.trim().length > 2);

const isPositiveNumber = (value?: number | null) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const createCheck = ({
  id,
  label,
  evidenceType,
  status,
  required,
  blocksReadonlyPilot,
  note,
  recommendation,
}: {
  id: string;
  label: string;
  evidenceType: PVMetricsValidationEvidenceType;
  status: PVMetricsValidationEvidenceStatus;
  required: boolean;
  blocksReadonlyPilot: boolean;
  note: string;
  recommendation: string;
}): PVMetricsSourceOfTruthCheck => ({
  id,
  label,
  evidenceType,
  status,
  required,
  blocksReadonlyPilot,
  note,
  recommendation,
});

const resolveBasicEvidenceStatus = (
  hasValue: boolean,
  sourceLabel?: string,
): PVMetricsValidationEvidenceStatus => {
  const normalized = (sourceLabel ?? '').toLowerCase();

  if (!hasValue) return 'missing';

  if (
    normalized.includes('demo') ||
    normalized.includes('no validado') ||
    normalized.includes('pendiente')
  ) {
    return 'pending-client';
  }

  if (
    normalized.includes('validado') ||
    normalized.includes('cliente') ||
    normalized.includes('oficial') ||
    normalized.includes('read-only')
  ) {
    return 'validated';
  }

  return 'pending-client';
};

const resolveGateStatus = ({
  scorePct,
  blockingChecks,
  missingChecks,
  pendingChecks,
}: {
  scorePct: number;
  blockingChecks: number;
  missingChecks: number;
  pendingChecks: number;
}): PVMetricsValidationGateStatus => {
  if (blockingChecks > 0 || missingChecks > 3) return 'blocked';
  if (scorePct >= 85 && blockingChecks === 0 && missingChecks === 0) {
    return 'ready-for-readonly-pilot';
  }
  if (scorePct >= 65 && missingChecks <= 2) {
    return 'ready-for-client-validation';
  }
  if (pendingChecks > 0 || scorePct >= 35) return 'draft-only';
  return 'blocked';
};

const gateLabel: Record<PVMetricsValidationGateStatus, string> = {
  blocked: 'BLOQUEADO — FALTAN DATOS CRÍTICOS',
  'draft-only': 'SOLO BORRADOR — REQUIERE RESPALDO',
  'ready-for-client-validation': 'LISTO PARA VALIDACIÓN CLIENTE',
  'ready-for-readonly-pilot': 'LISTO PARA PILOTO READ-ONLY',
};

export const createPvMetricsClientValidationGate = (
  draft: PVMetricsPlantConfiguratorDraft,
): PVMetricsClientValidationGate => {
  const hasBess = Boolean(draft.hasBess);

  const checks: PVMetricsSourceOfTruthCheck[] = [
    createCheck({
      id: 'client-owner',
      label: 'Cliente / propietario',
      evidenceType: 'client-email-confirmation',
      status: resolveBasicEvidenceStatus(isReadyText(draft.ownerName), draft.sourceOfTruthLabel),
      required: true,
      blocksReadonlyPilot: true,
      note: draft.ownerName || 'Cliente pendiente',
      recommendation: 'Confirmar cliente o propietario responsable del activo.',
    }),
    createCheck({
      id: 'plant-identity',
      label: 'Identificación de planta',
      evidenceType: 'technical-datasheet',
      status: resolveBasicEvidenceStatus(
        isReadyText(draft.plantName) && isReadyText(draft.plantCode),
        draft.sourceOfTruthLabel,
      ),
      required: true,
      blocksReadonlyPilot: true,
      note: `${draft.plantName || 'Planta pendiente'} / ${draft.plantCode || 'Código pendiente'}`,
      recommendation: 'Validar nombre y código de planta con documentación oficial.',
    }),
    createCheck({
      id: 'location',
      label: 'Ubicación y zona horaria',
      evidenceType: 'technical-datasheet',
      status: resolveBasicEvidenceStatus(
        isReadyText(draft.country) && isReadyText(draft.region) && isReadyText(draft.commune),
        draft.sourceOfTruthLabel,
      ),
      required: true,
      blocksReadonlyPilot: true,
      note: `${draft.commune || 'Comuna pendiente'}, ${draft.region || 'Región pendiente'}, ${draft.country || 'País pendiente'}`,
      recommendation: 'Confirmar ubicación para asociar telemetría ambiental y zona horaria.',
    }),
    createCheck({
      id: 'pv-capacity',
      label: 'Capacidad FV DC/AC',
      evidenceType: 'technical-datasheet',
      status: resolveBasicEvidenceStatus(
        isPositiveNumber(draft.pvCapacityDcMwp) && isPositiveNumber(draft.pvCapacityAcMw),
        draft.sourceOfTruthLabel,
      ),
      required: true,
      blocksReadonlyPilot: true,
      note: `${draft.pvCapacityDcMwp ?? 'Pendiente'} MWp DC / ${draft.pvCapacityAcMw ?? 'Pendiente'} MW AC`,
      recommendation: 'Confirmar potencia FV con ficha técnica o documentación de ingeniería.',
    }),
    createCheck({
      id: 'inverter-data',
      label: 'Datos de inversores',
      evidenceType: 'inverter-list',
      status: resolveBasicEvidenceStatus(
        isReadyText(draft.inverterModel) || isPositiveNumber(draft.inverterCount),
        draft.sourceOfTruthLabel,
      ),
      required: true,
      blocksReadonlyPilot: false,
      note: `${draft.inverterCount ?? 'Cantidad pendiente'} inversores / ${draft.inverterModel || 'Modelo pendiente'}`,
      recommendation: 'Solicitar listado de inversores, modelo y cantidad instalada.',
    }),
    createCheck({
      id: 'metering',
      label: 'Fuente de medición planta',
      evidenceType: 'metering-document',
      status:
        draft.hasEnergyMeter === 'available'
          ? 'validated'
          : draft.hasEnergyMeter === 'pending'
            ? 'pending-client'
            : 'missing',
      required: true,
      blocksReadonlyPilot: true,
      note: `Estado medidor planta: ${draft.hasEnergyMeter}`,
      recommendation: 'Confirmar medidor principal, fuente de energía y permiso de lectura.',
    }),
    createCheck({
      id: 'scada-readonly',
      label: 'SCADA read-only / tags',
      evidenceType: 'scada-tag-list',
      status:
        draft.hasScadaReadonly === 'available'
          ? 'validated'
          : draft.hasScadaReadonly === 'pending'
            ? 'pending-client'
            : 'missing',
      required: true,
      blocksReadonlyPilot: true,
      note: `Estado SCADA read-only: ${draft.hasScadaReadonly}`,
      recommendation: 'Solicitar listado de tags SCADA y autorización read-only formal.',
    }),
    createCheck({
      id: 'weather-source',
      label: 'Fuente meteorológica / ambiental',
      evidenceType: 'weather-source',
      status:
        draft.hasWeatherStation === 'available'
          ? 'validated'
          : draft.hasWeatherStation === 'pending'
            ? 'pending-client'
            : 'pending-client',
      required: true,
      blocksReadonlyPilot: false,
      note: `Estado fuente meteo: ${draft.hasWeatherStation}`,
      recommendation: 'Definir si se usará estación on-site o telemetría ambiental externa por ubicación.',
    }),
  ];

  if (hasBess) {
    checks.push(
      createCheck({
        id: 'bess-capacity',
        label: 'Capacidad BESS MW/MWh',
        evidenceType: 'bess-ems-document',
        status: resolveBasicEvidenceStatus(
          isPositiveNumber(draft.bessPowerMw) && isPositiveNumber(draft.bessEnergyMwh),
          (draft as any).bessSourceOfTruthLabel || draft.sourceOfTruthLabel,
        ),
        required: true,
        blocksReadonlyPilot: true,
        note: `${draft.bessPowerMw ?? 'Pendiente'} MW / ${draft.bessEnergyMwh ?? 'Pendiente'} MWh`,
        recommendation: 'Confirmar potencia y capacidad BESS con ficha técnica del sistema de almacenamiento.',
      }),
      createCheck({
        id: 'bess-telemetry',
        label: 'Fuente telemetría BESS',
        evidenceType: 'bess-ems-document',
        status: resolveBasicEvidenceStatus(
          isReadyText(draft.bessTelemetrySourceLabel),
          draft.bessTelemetrySourceLabel,
        ),
        required: true,
        blocksReadonlyPilot: true,
        note: draft.bessTelemetrySourceLabel || 'Fuente telemetría BESS pendiente',
        recommendation: 'Confirmar EMS/BMS/PCS/SCADA BESS read-only como fuente de telemetría.',
      }),
      createCheck({
        id: 'bess-measurement',
        label: 'Fuente medición BESS',
        evidenceType: 'bess-meter-document',
        status: resolveBasicEvidenceStatus(
          isReadyText(draft.bessMeasurementSourceLabel),
          draft.bessMeasurementSourceLabel,
        ),
        required: true,
        blocksReadonlyPilot: true,
        note: draft.bessMeasurementSourceLabel || 'Medidor BESS/POI pendiente',
        recommendation: 'Confirmar medidor dedicado BESS o POI para contrastar telemetría vs medición física.',
      }),
    );
  } else {
    checks.push(
      createCheck({
        id: 'bess-not-required',
        label: 'BESS no requerido',
        evidenceType: 'manual-entry',
        status: 'not-required',
        required: false,
        blocksReadonlyPilot: false,
        note: 'Planta configurada como FV-only.',
        recommendation: 'Confirmar que BESS no forma parte del alcance.',
      }),
    );
  }

  const requiredChecks = checks.filter((check) => check.required).length;
  const validatedChecks = checks.filter((check) => check.status === 'validated').length;
  const missingChecks = checks.filter((check) => check.status === 'missing').length;
  const pendingChecks = checks.filter((check) => check.status === 'pending-client').length;
  const blockingChecks = checks.filter(
    (check) =>
      check.blocksReadonlyPilot &&
      (check.status === 'missing' || check.status === 'pending-client' || check.status === 'demo-only'),
  ).length;

  const scorePct =
    requiredChecks > 0
      ? Math.round((validatedChecks / requiredChecks) * 100)
      : 0;

  const gateStatus = resolveGateStatus({
    scorePct,
    blockingChecks,
    missingChecks,
    pendingChecks,
  });

  const nextActions = checks
    .filter((check) => check.status === 'missing' || check.status === 'pending-client')
    .slice(0, 6)
    .map((check) => check.recommendation);

  return {
    id: `client-validation-${draft.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    plantName: draft.plantName || 'Planta pendiente',
    plantCode: draft.plantCode || 'Sin código',
    technologyLabel: hasBess ? 'FV + BESS' : 'FV',
    gateStatus,
    gateLabel: gateLabel[gateStatus],
    scorePct,
    requiredChecks,
    validatedChecks,
    missingChecks,
    pendingChecks,
    blockingChecks,
    checks,
    executiveNote:
      'Evaluación local de respaldo documental y source-of-truth. No certifica datos oficiales; solo organiza brechas para validación cliente.',
    nextActions,
    safetyBoundary:
      'Este gate es conceptual, local y read-only. No guarda datos, no conecta SCADA, no ejecuta APIs, no modifica setpoints y no habilita telecontrol.',
    sourceDraft: draft,
  };
};
