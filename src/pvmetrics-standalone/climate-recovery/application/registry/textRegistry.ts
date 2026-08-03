import type {
  ClimateRecoveryTextResolution,
  ClimateRecoveryTextResolver,
} from '../contracts/applicationContracts';

export type ClimateRecoveryTextKey = keyof typeof ENGLISH_TEXT;

const ENGLISH_TEXT = {
  'kpi.estimatedEnergyLoss': 'Estimated energy loss',
  'kpi.estimatedRecoverableEnergy': 'Estimated recoverable energy',
  'kpi.estimatedAvoidedEmissions': 'Estimated avoided emissions',
  'kpi.priorityScore': 'Priority score',
  'kpi.confidence': 'Confidence',
  'kpi.dataSufficiency': 'Data sufficiency',
  'kpi.recommendedActionCount': 'Recommended actions',
  'kpi.humanReviewStatus': 'Human review',
  'short.energyLoss': 'Energy loss',
  'short.recovery': 'Recovery',
  'short.climate': 'Climate',
  'short.priority': 'Priority',
  'short.confidence': 'Confidence',
  'short.sufficiency': 'Sufficiency',
  'short.actions': 'Actions',
  'short.review': 'Review',
  'value.unavailable': 'Unavailable',
  'value.blocked': 'Blocked',
  'value.notApplicable': 'Not applicable',
  'review.required': 'Human review required',
  'review.moreData': 'More data required',
  'disclosure.synthetic': 'Synthetic portfolio demonstration. Fictional data only; not operational or verified impact.',
  'headline.insufficient': 'Insufficient data: more evidence is required',
  'headline.nonRecoverable': 'External limitation is not recoverable through asset maintenance',
  'headline.overlap': 'Potential recovery requires overlap review before aggregation',
  'headline.recoverable': 'The evidence suggests a potentially recoverable opportunity',
  'narrative.insufficient': 'This synthetic demonstration has insufficient evidence to estimate energy recovery or climate impact. Human review and additional data are required.',
  'narrative.nonRecoverable': 'The evidence suggests an external grid limitation. It is classified as non-recoverable through asset maintenance, and no recovery or climate claim is presented.',
  'narrative.overlap': 'The evidence suggests potentially recoverable loss, but overlapping assessments may double count the same synthetic deviation. Review is required before aggregation.',
  'narrative.recoverable': 'The evidence suggests a potentially recoverable, estimated energy opportunity in this synthetic demonstration. The hypothesis, scenario, and climate impact remain uncertain and require human review.',
  'action.requestMoreData': 'Request additional evidence before reassessment.',
  'action.monitorExternal': 'Monitor or escalate the external classification; do not create asset maintenance work.',
  'action.reviewOverlap': 'Review overlapping loss scopes before using aggregate values.',
  'action.reviewEvidence': 'Perform the recommended read-only review before any approved field activity.',
  'confidence.explanation': 'Confidence is an internal qualitative score, not a calibrated probability.',
  'timeline.detection': 'Potential loss detected',
  'timeline.evidence': 'Evidence collected',
  'timeline.assessment': 'Deterministic assessment generated',
  'timeline.hypothesis': 'Hypothesis generated',
  'timeline.recommendation': 'Non-binding recommendation generated',
  'timeline.review': 'Human review requested',
  'timeline.scenario': 'Synthetic scenario generated',
  'timeline.climate': 'Counterfactual climate estimate generated',
  'timeline.warning': 'Assessment warning raised',
  'timeline.status': 'Case status recorded',
} as const;

const SPANISH_TEXT: Record<ClimateRecoveryTextKey, string> = {
  'kpi.estimatedEnergyLoss': 'Pérdida de energía estimada',
  'kpi.estimatedRecoverableEnergy': 'Energía recuperable estimada',
  'kpi.estimatedAvoidedEmissions': 'Emisiones evitadas estimadas',
  'kpi.priorityScore': 'Puntaje de prioridad',
  'kpi.confidence': 'Confianza',
  'kpi.dataSufficiency': 'Suficiencia de datos',
  'kpi.recommendedActionCount': 'Acciones recomendadas',
  'kpi.humanReviewStatus': 'Revisión humana',
  'short.energyLoss': 'Pérdida',
  'short.recovery': 'Recuperación',
  'short.climate': 'Clima',
  'short.priority': 'Prioridad',
  'short.confidence': 'Confianza',
  'short.sufficiency': 'Suficiencia',
  'short.actions': 'Acciones',
  'short.review': 'Revisión',
  'value.unavailable': 'No disponible',
  'value.blocked': 'Bloqueado',
  'value.notApplicable': 'No aplica',
  'review.required': 'Revisión humana requerida',
  'review.moreData': 'Se requieren más datos',
  'disclosure.synthetic': 'Demostración sintética de portafolio. Solo datos ficticios; no representa impacto operacional ni verificado.',
  'headline.insufficient': 'Datos insuficientes: se requiere más evidencia',
  'headline.nonRecoverable': 'La limitación externa no es recuperable mediante mantenimiento del activo',
  'headline.overlap': 'La recuperación potencial requiere revisar solapamientos antes de agregar',
  'headline.recoverable': 'La evidencia sugiere una oportunidad potencialmente recuperable',
  'narrative.insufficient': 'Esta demostración sintética no tiene evidencia suficiente para estimar recuperación energética o impacto climático. Se requieren datos adicionales y revisión humana.',
  'narrative.nonRecoverable': 'La evidencia sugiere una limitación externa de red. Se clasifica como no recuperable mediante mantenimiento del activo y no se presenta una afirmación de recuperación o clima.',
  'narrative.overlap': 'La evidencia sugiere una pérdida potencialmente recuperable, pero las evaluaciones solapadas pueden contar dos veces la misma desviación sintética. Se requiere revisión antes de agregar.',
  'narrative.recoverable': 'La evidencia sugiere una oportunidad energética estimada y potencialmente recuperable en esta demostración sintética. La hipótesis, el escenario y el impacto climático siguen siendo inciertos y requieren revisión humana.',
  'action.requestMoreData': 'Solicitar evidencia adicional antes de reevaluar.',
  'action.monitorExternal': 'Monitorear o escalar la clasificación externa; no crear trabajo de mantenimiento del activo.',
  'action.reviewOverlap': 'Revisar los alcances solapados antes de usar valores agregados.',
  'action.reviewEvidence': 'Realizar la revisión recomendada de solo lectura antes de cualquier actividad de campo aprobada.',
  'confidence.explanation': 'La confianza es un puntaje cualitativo interno, no una probabilidad calibrada.',
  'timeline.detection': 'Pérdida potencial detectada',
  'timeline.evidence': 'Evidencia recopilada',
  'timeline.assessment': 'Evaluación determinista generada',
  'timeline.hypothesis': 'Hipótesis generada',
  'timeline.recommendation': 'Recomendación no vinculante generada',
  'timeline.review': 'Revisión humana solicitada',
  'timeline.scenario': 'Escenario sintético generado',
  'timeline.climate': 'Estimación climática contrafactual generada',
  'timeline.warning': 'Advertencia de evaluación generada',
  'timeline.status': 'Estado del caso registrado',
};

const interpolate = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );

export const resolveClimateRecoveryText: ClimateRecoveryTextResolver = (
  locale,
  key,
  params = {},
): ClimateRecoveryTextResolution => {
  const requestedLocale = locale;
  const localized = locale === 'es' ? SPANISH_TEXT : ENGLISH_TEXT;
  const found = localized[key as ClimateRecoveryTextKey] ?? ENGLISH_TEXT[key as ClimateRecoveryTextKey];
  if (!found) {
    return {
      text: key,
      requestedLocale,
      resolvedLocale: locale === 'es' ? 'es' : 'en',
      usedFallback: true,
      limitation: `Missing Climate Recovery presentation text key: ${key}`,
    };
  }
  const resolvedLocale = locale === 'es' && SPANISH_TEXT[key as ClimateRecoveryTextKey] ? 'es' : 'en';
  return {
    text: interpolate(found, params),
    requestedLocale,
    resolvedLocale,
    usedFallback: resolvedLocale !== locale || !Object.hasOwn(localized, key),
    ...(resolvedLocale !== locale || !Object.hasOwn(localized, key)
      ? { limitation: `Locale or key fallback used for ${locale}:${key}` }
      : {}),
  };
};
