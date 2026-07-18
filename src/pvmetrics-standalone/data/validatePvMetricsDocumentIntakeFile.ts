import {
  PVMetricsDocumentIntakeFileKind,
  PVMetricsDocumentIntakeValidationResult,
} from '../types/pvmetrics-document-intake.types';

const MAX_SAFE_FILE_SIZE_KB = 512;

const resolveFileKind = (fileName: string): PVMetricsDocumentIntakeFileKind => {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.txt')) return 'txt';
  if (lowerName.endsWith('.docx')) return 'docx';
  if (lowerName.endsWith('.pdf')) return 'pdf';

  return 'unknown';
};

export const validatePvMetricsDocumentIntakeFile = (
  file: File,
): PVMetricsDocumentIntakeValidationResult => {
  const fileKind = resolveFileKind(file.name);
  const fileSizeKb = Number((file.size / 1024).toFixed(1));
  const isTooLarge = fileSizeKb > MAX_SAFE_FILE_SIZE_KB;

  if (isTooLarge) {
    return {
      fileName: file.name,
      fileKind,
      fileSizeKb,
      isAllowedInCurrentPhase: false,
      canReadTextNow: false,
      warning:
        'Archivo demasiado grande para esta fase local segura (límite de 512 KB).',
      recommendation:
        'Usar un extracto de texto más pequeño o pegar solo la sección técnica relevante para no saturar el rendimiento del navegador.',
    };
  }

  if (fileKind === 'txt') {
    return {
      fileName: file.name,
      fileKind,
      fileSizeKb,
      isAllowedInCurrentPhase: true,
      canReadTextNow: true,
      warning:
        'TXT permitido. El contenido se leerá localmente en memoria del navegador.',
      recommendation:
        'Revisar el draft generado antes de aplicar al configurador.',
    };
  }

  if (fileKind === 'docx') {
    return {
      fileName: file.name,
      fileKind,
      fileSizeKb,
      isAllowedInCurrentPhase: false,
      canReadTextNow: false,
      warning:
        'DOCX detectado. La lectura productiva de Word está planificada para una fase futura.',
      recommendation:
        'Abrir el Word localmente, copiar el texto técnico relevante y pegarlo directamente en el cuadro de texto de Smart Plant Intake.',
    };
  }

  if (fileKind === 'pdf') {
    return {
      fileName: file.name,
      fileKind,
      fileSizeKb,
      isAllowedInCurrentPhase: false,
      canReadTextNow: false,
      warning:
        'PDF detectado. La lectura productiva de PDF está planificada para una fase futura.',
      recommendation:
        'Copiar el texto seleccionable del PDF y pegarlo manualmente en el cuadro de texto. Si el PDF es un escaneo de imagen, requerirá OCR en el futuro.',
    };
  }

  return {
    fileName: file.name,
    fileKind,
    fileSizeKb,
    isAllowedInCurrentPhase: false,
    canReadTextNow: false,
    warning:
      'Formato no reconocido para Smart Plant Intake.',
    recommendation:
      'Usar archivos con extensión .txt o copiar y pegar el texto técnico directamente en el área de entrada.',
  };
};
