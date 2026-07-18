import {
  PVMetricsDocumentIntakeCapability,
  PVMetricsDocumentIntakeFileKind,
} from '../types/pvmetrics-document-intake.types';

export const createPvMetricsDocumentIntakeCapabilities =
  (): PVMetricsDocumentIntakeCapability[] => [
    {
      fileKind: 'txt',
      label: 'Archivo TXT',
      supportStatus: 'supported-now',
      safetyLevel: 'safe-local',
      currentBehavior:
        'Lectura local en navegador mediante file.text(), sin subir archivos ni guardar contenido.',
      futureBehavior:
        'Mantener como ruta simple y segura para documentos estructurados en ORBI Plant Intake v1.',
      limitations: [
        'Requiere texto estructurado o semiestructurado.',
        'No valida que los datos sean oficiales.',
      ],
    },
    {
      fileKind: 'docx',
      label: 'Documento Word DOCX',
      supportStatus: 'planned-requires-library',
      safetyLevel: 'requires-review',
      currentBehavior:
        'No se lee de forma productiva en esta fase. El usuario debe pegar el texto extraído manualmente.',
      futureBehavior:
        'Lectura local futura con extractor seguro de texto DOCX, sin backend y sin envío a servicios externos.',
      limitations: [
        'No implementar aún sin evaluar dependencia.',
        'No procesar imágenes embebidas ni OCR en esta fase.',
        'Todo resultado debe quedar pendiente de validación cliente.',
      ],
    },
    {
      fileKind: 'pdf',
      label: 'Documento PDF',
      supportStatus: 'planned-requires-library',
      safetyLevel: 'requires-review',
      currentBehavior:
        'No se lee de forma productiva en esta fase. El usuario debe pegar el texto extraído manualmente.',
      futureBehavior:
        'Lectura local futura de texto PDF seleccionable. OCR quedará como módulo separado y opcional.',
      limitations: [
        'No implementar OCR todavía.',
        'PDF escaneado no será compatible sin OCR futuro.',
        'No enviar PDF a APIs externas.',
        'Todo resultado debe quedar pendiente de validación cliente.',
      ],
    },
    {
      fileKind: 'unknown',
      label: 'Formato desconocido',
      supportStatus: 'unsupported',
      safetyLevel: 'blocked',
      currentBehavior:
        'Archivo bloqueado. Solo se permite TXT en esta fase.',
      futureBehavior:
        'Evaluar soporte solo si aporta valor técnico y cumple Sovereign Safe Mode.',
      limitations: [
        'No se procesa.',
        'No se guarda.',
        'No se sube.',
      ],
    },
  ];

export const getPvMetricsDocumentIntakeCapability = (
  fileKind: PVMetricsDocumentIntakeFileKind,
) =>
  createPvMetricsDocumentIntakeCapabilities().find(
    (capability) => capability.fileKind === fileKind,
  );
