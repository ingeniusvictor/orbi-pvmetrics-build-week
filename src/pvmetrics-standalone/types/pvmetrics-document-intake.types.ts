export type PVMetricsDocumentIntakeFileKind =
  | 'txt'
  | 'docx'
  | 'pdf'
  | 'unknown';

export type PVMetricsDocumentIntakeSupportStatus =
  | 'supported-now'
  | 'planned-safe-local'
  | 'planned-requires-library'
  | 'blocked-in-current-phase'
  | 'unsupported';

export type PVMetricsDocumentIntakeSafetyLevel =
  | 'safe-local'
  | 'requires-review'
  | 'blocked';

export type PVMetricsDocumentIntakeCapability = {
  fileKind: PVMetricsDocumentIntakeFileKind;
  label: string;
  supportStatus: PVMetricsDocumentIntakeSupportStatus;
  safetyLevel: PVMetricsDocumentIntakeSafetyLevel;
  currentBehavior: string;
  futureBehavior: string;
  limitations: string[];
};

export type PVMetricsDocumentIntakeValidationResult = {
  fileName: string;
  fileKind: PVMetricsDocumentIntakeFileKind;
  fileSizeKb: number;
  isAllowedInCurrentPhase: boolean;
  canReadTextNow: boolean;
  warning: string;
  recommendation: string;
};
