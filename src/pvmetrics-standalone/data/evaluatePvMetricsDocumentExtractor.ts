import { PVMetricsDocumentIntakeFileKind } from '../types/pvmetrics-document-intake.types';
import {
  PVMetricsDocumentExtractorEvaluation,
  PVMetricsExtractorDecisionGate,
  PVMetricsExtractorReadinessStatus,
  PVMetricsExtractorRiskLevel,
} from '../types/pvmetrics-document-extractor-evaluation.types';

const createGate = ({
  id,
  label,
  passed,
  riskLevel,
  note,
}: PVMetricsExtractorDecisionGate): PVMetricsExtractorDecisionGate => ({
  id,
  label,
  passed,
  riskLevel,
  note,
});

const getOverallRisk = (
  gates: PVMetricsExtractorDecisionGate[],
): PVMetricsExtractorRiskLevel => {
  if (gates.some((gate) => gate.riskLevel === 'blocked')) return 'blocked';
  if (gates.some((gate) => gate.riskLevel === 'high')) return 'high';
  if (gates.some((gate) => gate.riskLevel === 'medium')) return 'medium';
  return 'low';
};

const getReadinessFromRisk = (
  fileKind: PVMetricsDocumentIntakeFileKind,
  riskLevel: PVMetricsExtractorRiskLevel,
): PVMetricsExtractorReadinessStatus => {
  if (fileKind === 'txt') return 'ready-now';
  if (riskLevel === 'blocked') return 'blocked';
  if (fileKind === 'pdf') return 'requires-library-review';
  if (fileKind === 'docx') return 'requires-library-review';
  return 'blocked';
};

export const evaluatePvMetricsDocumentExtractor = (
  fileKind: PVMetricsDocumentIntakeFileKind,
): PVMetricsDocumentExtractorEvaluation => {
  if (fileKind === 'txt') {
    const gates = [
      createGate({
        id: 'txt-local-read',
        label: 'Lectura local en navegador',
        passed: true,
        riskLevel: 'low',
        note: 'TXT ya puede leerse con file.text() sin backend ni librerías externas.',
      }),
      createGate({
        id: 'txt-no-parser-risk',
        label: 'Riesgo de extracción estructural',
        passed: true,
        riskLevel: 'low',
        note: 'El contenido ya es texto plano y puede pasar directo al parser ORBI Plant Intake.',
      }),
    ];

    return {
      id: 'extractor-eval-txt',
      fileKind,
      title: 'Evaluación extractor TXT',
      readinessStatus: 'ready-now',
      riskLevel: getOverallRisk(gates),
      recommendedApproach:
        'Mantener lectura local TXT con file.text() y parser ORBI Plant Intake v1.',
      currentPhaseBehavior:
        'Permitido actualmente. El archivo se lee localmente en memoria.',
      futureImplementationPath:
        'Mantener como ruta principal recomendada para cargas técnicas estructuradas.',
      decisionGates: gates,
      limitations: [
        'Requiere que el usuario mantenga estructura mínima del formato ORBI Plant Intake v1.',
        'No valida por sí solo la oficialidad de los datos.',
      ],
      safetyBoundary:
        'Lectura local en memoria, sin subida, sin persistencia, sin APIs y sin telecontrol.',
    };
  }

  if (fileKind === 'docx') {
    const gates = [
      createGate({
        id: 'docx-needs-library',
        label: 'Requiere extractor local especializado',
        passed: false,
        riskLevel: 'medium',
        note: 'DOCX necesita una librería local evaluada antes de habilitar lectura productiva.',
      }),
      createGate({
        id: 'docx-no-ocr',
        label: 'Sin OCR en esta fase',
        passed: true,
        riskLevel: 'low',
        note: 'DOCX de texto seleccionable podría ser viable; imágenes embebidas no se procesarán.',
      }),
      createGate({
        id: 'docx-sovereign-safe',
        label: 'Sovereign Safe Mode',
        passed: false,
        riskLevel: 'medium',
        note: 'Debe confirmarse que la futura librería no haga llamadas externas ni use workers remotos.',
      }),
    ];

    const risk = getOverallRisk(gates);

    return {
      id: 'extractor-eval-docx',
      fileKind,
      title: 'Evaluación extractor DOCX',
      readinessStatus: getReadinessFromRisk(fileKind, risk),
      riskLevel: risk,
      recommendedApproach:
        'Evaluar un extractor DOCX local, liviano y sin llamadas externas. Mantener bloqueo productivo hasta validación.',
      currentPhaseBehavior:
        'Bloqueado productivamente. El usuario debe copiar y pegar el texto del Word.',
      futureImplementationPath:
        'Fase futura: lectura local de texto DOCX seleccionable, sin OCR, sin backend y con límite de tamaño.',
      decisionGates: gates,
      limitations: [
        'No procesar imágenes embebidas.',
        'No interpretar tablas complejas en esta fase.',
        'No enviar documentos a servicios externos.',
        'Todo resultado debe quedar como draft pendiente de validación cliente.',
      ],
      safetyBoundary:
        'DOCX no se procesa productivamente todavía. Futura lectura solo local, sin backend, sin APIs y sin persistencia.',
    };
  }

  if (fileKind === 'pdf') {
    const gates = [
      createGate({
        id: 'pdf-needs-library',
        label: 'Requiere extractor PDF local',
        passed: false,
        riskLevel: 'medium',
        note: 'PDF requiere evaluar librería local para texto seleccionable.',
      }),
      createGate({
        id: 'pdf-scanned-blocked',
        label: 'PDF escaneado requiere OCR',
        passed: false,
        riskLevel: 'high',
        note: 'PDF escaneado no debe procesarse ahora. OCR queda como módulo futuro separado.',
      }),
      createGate({
        id: 'pdf-no-external-api',
        label: 'Sin API externa',
        passed: true,
        riskLevel: 'low',
        note: 'No se permite enviar PDF a servicios externos de extracción.',
      }),
    ];

    const risk = getOverallRisk(gates);

    return {
      id: 'extractor-eval-pdf',
      fileKind,
      title: 'Evaluación extractor PDF',
      readinessStatus: getReadinessFromRisk(fileKind, risk),
      riskLevel: risk,
      recommendedApproach:
        'Evaluar lectura local futura solo para PDF con texto seleccionable. PDF escaneado queda fuera hasta módulo OCR soberano.',
      currentPhaseBehavior:
        'Bloqueado productivamente. El usuario debe copiar texto seleccionable del PDF y pegarlo manualmente.',
      futureImplementationPath:
        'Fase futura: extractor local de texto PDF seleccionable. OCR será módulo separado, opcional y estrictamente auditado.',
      decisionGates: gates,
      limitations: [
        'PDF escaneado no compatible sin OCR.',
        'Tablas complejas pueden requerir revisión manual.',
        'No enviar PDF a APIs externas.',
        'Todo resultado debe quedar como draft pendiente de validación cliente.',
      ],
      safetyBoundary:
        'PDF no se procesa productivamente todavía. Futura lectura debe ser local, sin backend, sin OCR automático y sin persistencia.',
    };
  }

  const gates = [
    createGate({
      id: 'unknown-blocked',
      label: 'Formato desconocido',
      passed: false,
      riskLevel: 'blocked',
      note: 'No existe ruta segura de extracción para este formato.',
    }),
  ];

  return {
    id: 'extractor-eval-unknown',
    fileKind: 'unknown',
    title: 'Evaluación formato desconocido',
    readinessStatus: 'blocked',
    riskLevel: 'blocked',
    recommendedApproach:
      'Bloquear formato y solicitar TXT o texto pegado manualmente.',
    currentPhaseBehavior:
      'Bloqueado.',
    futureImplementationPath:
      'No planificado salvo que exista necesidad técnica clara.',
    decisionGates: gates,
    limitations: [
      'No se procesa.',
      'No se guarda.',
      'No se sube.',
    ],
    safetyBoundary:
      'Formato bloqueado por seguridad.',
  };
};
