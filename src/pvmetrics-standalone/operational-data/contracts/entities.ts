import type {
  OperationalAssetType,
  OperationalEvidenceType,
  OperationalProvenance,
  OperationalQualityStatus,
  OperationalSourceType,
  OperationalValueType,
  OperationalVerificationState,
} from './taxonomy';

export type OperationalAsset = {
  assetId: string;
  plantId: string;
  assetType: OperationalAssetType;
  displayName?: string;
  parentAssetId?: string;
  verificationState: OperationalVerificationState;
  referenceable: boolean;
};

export type OperationalSource = {
  sourceId: string;
  sourceType: OperationalSourceType;
  sourceSystem: string;
  provenance: OperationalProvenance;
  verificationState: OperationalVerificationState;
  reference?: string;
  referenceable: boolean;
};

export type OperationalSignalDefinition = {
  signalId: string;
  signalKey: string;
  assetTypes: OperationalAssetType[];
  displayLabel?: string;
  declaredUnit?: string;
  valueType: OperationalValueType;
  sourceMappingReference?: string;
  verificationState: OperationalVerificationState;
  referenceable: boolean;
};

export type OperationalEvidenceReference = {
  evidenceId: string;
  evidenceType: OperationalEvidenceType;
  reference: string;
  sourceId?: string;
  sha256?: string;
  capturedAt?: string;
  verificationState: OperationalVerificationState;
  referenceable: boolean;
};

export type GovernedObservation = {
  observationId: string;
  assetId: string;
  signalId: string;
  signalKey: string;
  sourceId: string;
  timestamp: string;
  value: number | string | boolean | null;
  unit?: string;
  quality: OperationalQualityStatus;
  provenance: OperationalProvenance;
  verificationState: OperationalVerificationState;
  evidenceIds: string[];
};

export type GovernedOperationalCatalog = {
  assets: readonly OperationalAsset[];
  sources: readonly OperationalSource[];
  signals: readonly OperationalSignalDefinition[];
  evidence: readonly OperationalEvidenceReference[];
};
