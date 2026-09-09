import {
  assessPilotReadiness,
  type PilotReadinessInput,
  type PilotReadinessResult,
} from './pilotReadiness';
import {
  assessProjectMappingProfile,
  type ProjectMappingAssessment,
  type ProjectMappingProfile,
} from './projectMappingProfile';

export const PILOT_READINESS_PACK_SCHEMA_VERSION = 1 as const;

export type PilotSourceReality = 'NO_REAL_PACKAGE' | 'REAL_SOURCE_PACKAGE';
export type PilotDryRunStatus = 'NOT_STARTED' | 'BLOCKED' | 'COMPLETED';
export type PilotReadinessPackStatus =
  | 'PENDING_SOURCE_DATA'
  | 'BLOCKED'
  | 'READY_FOR_OFFLINE_DRY_RUN';

export type PilotReadinessPackInput = {
  generatedAt: string;
  generatedBy: string;
  sourceReality: PilotSourceReality;
  readinessInput: PilotReadinessInput;
  mappingProfile: ProjectMappingProfile;
  dryRunStatus?: PilotDryRunStatus;
  knownLimitations?: readonly string[];
};

export type PilotReadinessPack = {
  schemaVersion: typeof PILOT_READINESS_PACK_SCHEMA_VERSION;
  generatedAt: string;
  generatedBy: string;
  mode: 'OFFLINE_READ_ONLY_PILOT';
  sourceReality: PilotSourceReality;
  status: PilotReadinessPackStatus;
  projectId: string | null;
  scopeRevision: string | null;
  intake: PilotReadinessResult;
  mapping: ProjectMappingAssessment & {
    profileId: string | null;
    sourceCount: number;
    confirmedSourceCount: number;
    assetMappingCount: number;
    confirmedAssetMappingCount: number;
    signalMappingCount: number;
    confirmedSignalMappingCount: number;
  };
  integrationBlockers: string[];
  dryRun: {
    status: PilotDryRunStatus;
    operationalAuthorizationGranted: false;
  };
  boundary: {
    offlineOnly: true;
    liveOtConnectionAllowed: false;
    otWritebackAllowed: false;
    energizationAuthorized: false;
    operationalAuthorizationGranted: false;
    humanAcceptanceRequired: true;
  };
  limitations: string[];
};

const trimmedOrNull = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

const unique = (items: readonly string[]): string[] => [...new Set(items)];

export const buildPilotReadinessPack = ({
  generatedAt,
  generatedBy,
  sourceReality,
  readinessInput,
  mappingProfile,
  dryRunStatus = 'NOT_STARTED',
  knownLimitations = [],
}: PilotReadinessPackInput): PilotReadinessPack => {
  const intake = assessPilotReadiness(readinessInput);
  const mappingAssessment = assessProjectMappingProfile(mappingProfile);
  const integrationBlockers: string[] = [];

  const intakeProjectId = trimmedOrNull(readinessInput.projectId);
  const mappingProjectId = trimmedOrNull(mappingProfile.projectId);
  const intakeScopeRevision = trimmedOrNull(readinessInput.scopeRevision);
  const mappingScopeRevision = trimmedOrNull(mappingProfile.scopeRevision);

  if (intakeProjectId && mappingProjectId && intakeProjectId !== mappingProjectId) {
    integrationBlockers.push(
      `Project ID mismatch between pilot intake '${intakeProjectId}' and mapping profile '${mappingProjectId}'.`,
    );
  }

  if (intakeScopeRevision && mappingScopeRevision && intakeScopeRevision !== mappingScopeRevision) {
    integrationBlockers.push(
      `Scope revision mismatch between pilot intake '${intakeScopeRevision}' and mapping profile '${mappingScopeRevision}'.`,
    );
  }

  let status: PilotReadinessPackStatus;
  if (sourceReality === 'NO_REAL_PACKAGE') {
    status = 'PENDING_SOURCE_DATA';
  } else if (
    intake.status === 'BLOCKED' ||
    mappingAssessment.status === 'BLOCKED' ||
    integrationBlockers.length > 0
  ) {
    status = 'BLOCKED';
  } else {
    status = 'READY_FOR_OFFLINE_DRY_RUN';
  }

  const limitations = unique([
    ...(sourceReality === 'NO_REAL_PACKAGE'
      ? ['No verified real-project source package is loaded; project-specific readiness claims remain pending.']
      : []),
    'This pack is an offline pilot-readiness artifact and does not authorize energization, operation, dispatch or OT writeback.',
    'READY_FOR_OFFLINE_DRY_RUN means only that verified inputs are sufficient to begin an offline dry run.',
    'ORBI analytical assessment remains separate from human and contractual acceptance.',
    'Recorded hashes provide traceability references but are not independent evidence verification.',
    'Missing topology, tags, units, scaling, sign conventions, thresholds and OEM criteria must remain unresolved until verified from authoritative sources.',
    ...knownLimitations,
  ]);

  return {
    schemaVersion: PILOT_READINESS_PACK_SCHEMA_VERSION,
    generatedAt,
    generatedBy,
    mode: 'OFFLINE_READ_ONLY_PILOT',
    sourceReality,
    status,
    projectId: intakeProjectId ?? mappingProjectId,
    scopeRevision: intakeScopeRevision ?? mappingScopeRevision,
    intake,
    mapping: {
      ...mappingAssessment,
      profileId: trimmedOrNull(mappingProfile.profileId),
      sourceCount: mappingProfile.sources.length,
      confirmedSourceCount: mappingProfile.sources.filter((item) => item.verificationStatus === 'SOURCE_CONFIRMED').length,
      assetMappingCount: mappingProfile.assets.length,
      confirmedAssetMappingCount: mappingProfile.assets.filter((item) => item.verificationStatus === 'SOURCE_CONFIRMED').length,
      signalMappingCount: mappingProfile.signals.length,
      confirmedSignalMappingCount: mappingProfile.signals.filter((item) => item.verificationStatus === 'SOURCE_CONFIRMED').length,
    },
    integrationBlockers,
    dryRun: {
      status: dryRunStatus,
      operationalAuthorizationGranted: false,
    },
    boundary: {
      offlineOnly: true,
      liveOtConnectionAllowed: false,
      otWritebackAllowed: false,
      energizationAuthorized: false,
      operationalAuthorizationGranted: false,
      humanAcceptanceRequired: true,
    },
    limitations,
  };
};

export const renderPilotReadinessPackText = (pack: PilotReadinessPack): string => {
  const blockers = unique([
    ...pack.intake.blockers,
    ...pack.mapping.blockers,
    ...pack.integrationBlockers,
  ]);
  const warnings = unique([
    ...pack.intake.warnings,
    ...pack.mapping.warnings,
  ]);

  const lines = [
    'ORBI PVMETRICS — BESS COMMISSIONING PILOT READINESS PACK',
    `Schema: ${pack.schemaVersion}`,
    `Generated: ${pack.generatedAt}`,
    `Generated by: ${pack.generatedBy}`,
    `Mode: ${pack.mode}`,
    `Source reality: ${pack.sourceReality}`,
    `Status: ${pack.status}`,
    '',
    `Project ID: ${pack.projectId ?? 'NOT DECLARED'}`,
    `Scope revision: ${pack.scopeRevision ?? 'NOT DECLARED'}`,
    '',
    'INTAKE COVERAGE',
    `Required artifacts: ${pack.intake.providedRequiredArtifacts}/${pack.intake.requiredArtifacts}`,
    `Intake status: ${pack.intake.status}`,
    '',
    'MAPPING COVERAGE',
    `Mapping status: ${pack.mapping.status}`,
    `Sources confirmed: ${pack.mapping.confirmedSourceCount}/${pack.mapping.sourceCount}`,
    `Assets confirmed: ${pack.mapping.confirmedAssetMappingCount}/${pack.mapping.assetMappingCount}`,
    `Signals confirmed: ${pack.mapping.confirmedSignalMappingCount}/${pack.mapping.signalMappingCount}`,
    '',
    `Offline dry run: ${pack.dryRun.status}`,
    'Operational authorization: NO',
    'Energization authorization: NO',
    'OT writeback: NO',
    '',
    'BLOCKERS',
    ...(blockers.length > 0 ? blockers.map((item) => `- ${item}`) : ['- NONE']),
    '',
    'WARNINGS',
    ...(warnings.length > 0 ? warnings.map((item) => `- ${item}`) : ['- NONE']),
    '',
    'LIMITATIONS',
    ...pack.limitations.map((item) => `- ${item}`),
  ];

  return lines.join('\n');
};
