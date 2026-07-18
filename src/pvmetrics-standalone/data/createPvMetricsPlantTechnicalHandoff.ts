import {
  PVMetricsPlantConfiguratorDraft,
  PVMetricsPlantConfiguratorValidationResult,
} from '../types/pvmetrics-plant-configurator.types';
import {
  PVMetricsPlantHandoffGap,
  PVMetricsPlantHandoffReadinessLevel,
  PVMetricsPlantHandoffRequiredSource,
  PVMetricsPlantHandoffSignalGroup,
  PVMetricsPlantTechnicalHandoff,
} from '../types/pvmetrics-plant-handoff.types';

const getGeneratedAtLabel = () =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date());

const readinessLabel: Record<PVMetricsPlantHandoffReadinessLevel, string> = {
  incomplete: 'PERFIL INCOMPLETO',
  'draft-ready': 'BORRADOR TÉCNICO POSIBLE',
  'client-validation-ready': 'LISTO PARA VALIDACIÓN CLIENTE',
  'readonly-pilot-ready': 'LISTO PARA PREPARAR PILOTO READ-ONLY',
};

const resolveReadinessLevel = (
  validation: PVMetricsPlantConfiguratorValidationResult,
): PVMetricsPlantHandoffReadinessLevel => {
  const {
    completionPct,
    canPrepareReadonlyPilot,
    canRequestClientValidation,
    canCreateDraftProfile,
  } = validation.summary;

  if (canPrepareReadonlyPilot) return 'readonly-pilot-ready';
  if (canRequestClientValidation) return 'client-validation-ready';
  if (canCreateDraftProfile || completionPct >= 35) return 'draft-ready';
  return 'incomplete';
};

const resolveRequiredSources = (
  draft: PVMetricsPlantConfiguratorDraft,
): PVMetricsPlantHandoffRequiredSource[] => {
  const sources: PVMetricsPlantHandoffRequiredSource[] = [
    'technical-datasheet',
    'single-line-diagram',
    'inverter-list',
    'metering-source',
    'weather-station-source',
    'external-environment-source',
    'historical-production',
    'readonly-approval',
  ];

  if (draft.hasScadaReadonly !== 'not-available') {
    sources.push('scada-tag-list');
  }

  if (draft.hasBess) {
    sources.push(
      'bess-ems-source',
      'bess-bms-source',
      'bess-pcs-source',
      'bess-dedicated-meter',
      'poi-meter',
    );
  }

  return sources;
};

const resolveRequiredSignalGroups = (
  draft: PVMetricsPlantConfiguratorDraft,
): PVMetricsPlantHandoffSignalGroup[] => {
  const groups: PVMetricsPlantHandoffSignalGroup[] = [
    'plant-production',
    'solar-resource',
    'weather',
    'environment-telemetry',
    'inverter',
    'metering',
    'availability',
  ];

  if (draft.hasScadaReadonly !== 'not-available') {
    groups.push('scada');
  }

  if (draft.hasBess) {
    groups.push('bess', 'bess-telemetry', 'bess-measurement');
  }

  return groups;
};

const resolveGaps = (
  validation: PVMetricsPlantConfiguratorValidationResult,
): PVMetricsPlantHandoffGap[] =>
  validation.checks
    .filter((check) => check.status === 'missing' || check.status === 'warning')
    .slice(0, 14)
    .map((check) => ({
      id: `gap-${check.id}`,
      label: check.label,
      severity: check.status === 'missing' ? 'critical' : ('warning' as const),
      recommendation:
        check.status === 'missing'
          ? `Completar: ${check.message}`
          : `Revisar: ${check.message}`,
    }));

const buildExecutiveSummary = (
  draft: PVMetricsPlantConfiguratorDraft,
  validation: PVMetricsPlantConfiguratorValidationResult,
  level: PVMetricsPlantHandoffReadinessLevel,
) => {
  const technologyLabel = draft.technology === 'pv-bess' ? 'FV + BESS' : 'FV';

  return `Perfil draft local para ${
    draft.plantName || 'planta sin nombre'
  } (${technologyLabel}) con completitud ${
    validation.summary.completionPct
  }%. Estado: ${
    readinessLabel[level]
  }. Este resumen no representa una ficha oficial y requiere validación del cliente antes de cualquier piloto real.`;
};

const buildPlantTechnicalSummary = (
  draft: PVMetricsPlantConfiguratorDraft,
) =>
  [
    `Cliente/workspace: ${draft.ownerName || 'Pendiente'} / ${
      draft.workspaceName || 'Pendiente'
    }.`,
    `Planta: ${draft.plantName || 'Pendiente'} (${
      draft.plantCode || 'sin código'
    }).`,
    `Ubicación: ${draft.commune || 'Pendiente'}, ${
      draft.region || 'Pendiente'
    }, ${draft.country || 'Pendiente'}.`,
    `Zona horaria: ${draft.timezone || 'Pendiente'}.`,
    `FV: ${
      draft.pvCapacityDcMwp || 'pendiente'
    } MWp DC / ${draft.pvCapacityAcMw || 'pendiente'} MW AC.`,
    `Estructura: ${draft.mountingType}.`,
    `Fuentes planta: SCADA read-only ${draft.hasScadaReadonly}, medidor ${draft.hasEnergyMeter}, meteo ${draft.hasWeatherStation}.`,
    `Aprobación read-only: ${draft.readonlyApproval}.`,
  ].join('\n');

const buildBessTechnicalSummary = (
  draft: PVMetricsPlantConfiguratorDraft,
) => {
  if (!draft.hasBess) {
    return 'BESS: no aplica. La planta está configurada como FV-only y no requiere fuentes BESS.';
  }

  return [
    `BESS: ${draft.bessPowerMw ?? 'pendiente'} MW de potencia / ${
      draft.bessEnergyMwh ?? 'pendiente'
    } MWh de capacidad energética.`,
    `Modo operación BESS: ${draft.bessOperationMode}.`,
    `EMS/BMS/PCS vendor: ${draft.bessEmsVendor || 'Pendiente'}.`,
    `SOC mínimo/máximo: ${draft.bessMinSocPct ?? 'pendiente'}% / ${
      draft.bessMaxSocPct ?? 'pendiente'
    }%.`,
    `Eficiencia round-trip: ${
      draft.bessRoundTripEfficiencyPct ?? 'pendiente'
    }%.`,
    `Fuente telemetría BESS: ${
      draft.bessTelemetrySourceLabel || 'Pendiente EMS/BMS/PCS'
    }.`,
    `Fuente medición BESS: ${
      draft.bessMeasurementSourceLabel || 'Pendiente medidor BESS/POI'
    }.`,
    `Source-of-truth BESS: ${
      draft.sourceOfTruthLabel || 'Pendiente ficha técnica BESS/EMS'
    }.`,
  ].join('\n');
};

const buildDataProvenanceSummary = (
  draft: PVMetricsPlantConfiguratorDraft,
) =>
  [
    'Jerarquía de procedencia sugerida:',
    '1. Datos operacionales validados: SCADA, medidor, EMS/BMS/PCS o medidor BESS read-only.',
    '2. Datos meteorológicos on-site: estación meteo, GHI/POA, temperatura, viento.',
    '3. Datos ambientales externos: clima, irradiancia estimada o forecast por ubicación.',
    '4. Históricos cliente: CSV, Excel o reportes.',
    '5. Simulación local ORBI: fallback demo cuando no existe fuente real disponible.',
    '',
    `Estado actual SCADA read-only: ${draft.hasScadaReadonly}.`,
    `Estado fuente meteorológica: ${draft.hasWeatherStation}.`,
    `Estado medidor planta: ${draft.hasEnergyMeter}.`,
    draft.hasBess
      ? `Estado fuentes BESS: telemetría ${draft.bessTelemetrySourceLabel || 'pendiente'} / medición ${draft.bessMeasurementSourceLabel || 'pendiente'}.`
      : 'Estado BESS: no aplica para FV-only.',
  ].join('\n');

const resolveNextSteps = (
  level: PVMetricsPlantHandoffReadinessLevel,
  draft: PVMetricsPlantConfiguratorDraft,
): string[] => {
  const bessSteps = draft.hasBess
    ? [
        'Confirmar potencia BESS MW y capacidad energética BESS MWh con ficha técnica.',
        'Confirmar fuente de telemetría BESS: EMS, BMS, PCS o SCADA BESS read-only.',
        'Confirmar fuente de medición BESS: medidor dedicado o medidor POI.',
        'Validar señales BESS mínimas: SOC, potencia MW, energía cargada/descargada, modo operativo y alarmas.',
      ]
    : ['Confirmar formalmente que la planta no incluye BESS o que BESS no aplica al alcance.'];

  if (level === 'readonly-pilot-ready') {
    return [
      'Preparar paquete de piloto read-only.',
      'Confirmar lista de tags SCADA y permisos de solo lectura.',
      'Validar fuente de medición principal y estación meteorológica.',
      'Confirmar procedencia de datos ambientales externos u on-site.',
      ...bessSteps,
      'Revisar mapeo de señales mínimas en ORBI PVMetrics IA.',
      'Ejecutar Readiness Matrix antes de cualquier conexión real.',
    ];
  }

  if (level === 'client-validation-ready') {
    return [
      'Enviar resumen técnico al cliente para validación.',
      'Solicitar ficha técnica oficial y diagrama unilineal.',
      'Confirmar capacidades FV.',
      'Confirmar si los datos ambientales serán externos por ubicación u on-site.',
      ...bessSteps,
      'Solicitar autorización read-only formal.',
      'Revisar fuentes disponibles para señales críticas.',
    ];
  }

  if (level === 'draft-ready') {
    return [
      'Completar brechas críticas del perfil.',
      'Confirmar ubicación, potencia FV y datos técnicos básicos.',
      'Definir procedencia ambiental: externa por ubicación, estación on-site o demo local.',
      ...bessSteps,
      'Identificar SCADA, medidor y estación meteorológica.',
      'Reunir documentación técnica mínima.',
      'Preparar revisión interna antes de contactar al cliente.',
    ];
  }

  return [
    'Completar datos básicos de cliente, planta y ubicación.',
    'Definir potencia FV DC/AC.',
    'Definir fuente ambiental disponible por ubicación u on-site.',
    ...bessSteps,
    'Completar fuentes de medición y disponibilidad de datos.',
    'No avanzar a validación cliente hasta completar datos mínimos.',
  ];
};

const buildCopyableText = (
  handoff: Omit<PVMetricsPlantTechnicalHandoff, 'copyableText'>,
) =>
  [
    'ORBI PVMetrics IA — Technical Handoff Draft',
    `Generado: ${handoff.generatedAtLabel}`,
    `Estado: ${handoff.readinessLabel}`,
    '',
    'Resumen ejecutivo:',
    handoff.executiveSummary,
    '',
    'Resumen técnico FV/planta:',
    handoff.plantTechnicalSummary,
    '',
    'Resumen técnico BESS:',
    handoff.bessTechnicalSummary,
    '',
    'Procedencia de datos:',
    handoff.dataProvenanceSummary,
    '',
    'Fuentes requeridas:',
    handoff.requiredSources.join(', '),
    '',
    'Grupos de señales requeridas:',
    handoff.requiredSignalGroups.join(', '),
    '',
    'Brechas principales:',
    handoff.gaps.length
      ? handoff.gaps
          .map(
            (gap) =>
              `- [${gap.severity.toUpperCase()}] ${gap.label}: ${gap.recommendation}`,
          )
          .join('\n')
      : '- Sin brechas principales detectadas.',
    '',
    'Próximos pasos:',
    handoff.nextSteps.map((step) => `- ${step}`).join('\n'),
    '',
    'Límite de seguridad:',
    handoff.safetyBoundary,
  ].join('\n');

export const createPvMetricsPlantTechnicalHandoff = (
  draft: PVMetricsPlantConfiguratorDraft,
  validation: PVMetricsPlantConfiguratorValidationResult,
): PVMetricsPlantTechnicalHandoff => {
  const readiness = resolveReadinessLevel(validation);

  const base = {
    id: `handoff-${draft.id}`,
    generatedAtLabel: getGeneratedAtLabel(),
    title: 'Technical Handoff Draft',
    readinessLevel: readiness,
    readinessLabel: readinessLabel[readiness],
    draft,
    validation,
    requiredSources: resolveRequiredSources(draft),
    requiredSignalGroups: resolveRequiredSignalGroups(draft),
    gaps: resolveGaps(validation),
    executiveSummary: buildExecutiveSummary(draft, validation, readiness),
    plantTechnicalSummary: buildPlantTechnicalSummary(draft),
    bessTechnicalSummary: buildBessTechnicalSummary(draft),
    dataProvenanceSummary: buildDataProvenanceSummary(draft),
    nextSteps: resolveNextSteps(readiness, draft),
    safetyBoundary:
      'Este handoff es local, conceptual y no oficial. No guarda datos, no conecta SCADA, no ejecuta APIs, no modifica setpoints, no envía comandos y no habilita telecontrol.',
  };

  return {
    ...base,
    copyableText: buildCopyableText(base),
  };
};
