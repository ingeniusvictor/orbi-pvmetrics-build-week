export type CommissioningLocale = 'es' | 'en';

export const DEFAULT_COMMISSIONING_LOCALE: CommissioningLocale = 'es';

export const commissioningText = (
  locale: CommissioningLocale,
  spanish: string,
  english: string,
): string => locale === 'es' ? spanish : english;

const SPANISH_CANONICAL_LABELS: Readonly<Record<string, string>> = {
  ALL: 'TODOS',
  INFO: 'INFORMACIÓN',
  WARNING: 'ADVERTENCIA',
  MAJOR: 'MAYOR',
  CRITICAL: 'CRÍTICA',
  OPEN: 'ABIERTO',
  ACTIVE: 'ACTIVA',
  NEW: 'NUEVA',
  CLEARED: 'DESPEJADA',
  ACK: 'RECONOCIDA',
  UNDER_REVIEW: 'EN REVISIÓN',
  ACTION_REQUIRED: 'ACCIÓN REQUERIDA',
  READY_FOR_RETEST: 'LISTO PARA REPRUEBA',
  CLOSED: 'CERRADO',
  DISMISSED: 'DESCARTADO',
  CONVERTED_TO_FINDING: 'CONVERTIDA EN HALLAZGO',
  UNKNOWN: 'DESCONOCIDA',
  SUSPECTED: 'SOSPECHADA',
  CONFIRMED: 'CONFIRMADA',
  INFORMATIONAL: 'INFORMATIVA',
  ASSESSMENT_RELEVANT: 'RELEVANTE PARA EVALUACIÓN',
  GATE_BLOCKING: 'BLOQUEA HITO',
  INCLUDED: 'INCLUIDO',
  PARTIAL: 'PARCIAL',
  EXCLUDED: 'EXCLUIDO',
  THIRD_PARTY: 'TERCERO',
  PENDING_CONFIRMATION: 'PENDIENTE DE CONFIRMACIÓN',
  PLANNED: 'PLANIFICADA',
  READY: 'LISTA',
  IN_PROGRESS: 'EN PROGRESO',
  BLOCKED: 'BLOQUEADA',
  COMPLETED: 'COMPLETADA',
  CANCELLED: 'CANCELADA',
  PASS: 'CUMPLE',
  FAIL: 'NO CUMPLE',
  INCONCLUSIVE: 'NO CONCLUYENTE',
  PENDING: 'PENDIENTE',
  ACCEPTED: 'ACEPTADA',
  ACCEPTED_WITH_COMMENTS: 'ACEPTADA CON COMENTARIOS',
  RETEST_REQUIRED: 'REPRUEBA REQUERIDA',
  REJECTED: 'RECHAZADA',
  GOOD: 'BUENA',
  DEGRADED: 'DEGRADADA',
  POOR: 'DEFICIENTE',
  INVALID: 'INVÁLIDA',
  DRAFT: 'BORRADOR',
  AVAILABLE: 'DISPONIBLE',
  SUPERSEDED: 'REEMPLAZADA',
  APPROVED: 'APROBADA',
  RECEIVED_BY_O_AND_M: 'RECIBIDA POR O&M',
  PROVIDED: 'PROPORCIONADO',
  MISSING: 'FALTANTE',
  PENDING_VALIDATION: 'PENDIENTE DE VALIDACIÓN',
  NOT_APPLICABLE: 'NO APLICA',
  RETEST: 'REPRUEBA',
  INITIAL: 'INICIAL',
};

export const commissioningCanonicalLabel = (
  locale: CommissioningLocale,
  value: string,
): string => {
  if (locale === 'es') return SPANISH_CANONICAL_LABELS[value] ?? value.replaceAll('_', ' ');
  return value.replaceAll('_', ' ');
};

export const commissioningBooleanLabel = (
  locale: CommissioningLocale,
  value: boolean,
): string => commissioningText(locale, value ? 'SÍ' : 'NO', value ? 'YES' : 'NO');

export const commissioningMissingLabel = (locale: CommissioningLocale): string =>
  commissioningText(locale, 'FALTANTE', 'MISSING');

export const commissioningNotRecordedLabel = (locale: CommissioningLocale): string =>
  commissioningText(locale, 'NO REGISTRADO', 'NOT RECORDED');

export const commissioningNotLoadedLabel = (locale: CommissioningLocale): string =>
  commissioningText(locale, 'NO CARGADO', 'NOT LOADED');
