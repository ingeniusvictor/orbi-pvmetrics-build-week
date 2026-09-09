export type PilotArtifactKind =
  | 'PROJECT_IDENTITY'
  | 'SCOPE_REGISTER'
  | 'ASSET_REGISTER'
  | 'TEST_MATRIX'
  | 'CRITERIA_SOURCES'
  | 'SIGNAL_DICTIONARY'
  | 'SIGNAL_MAPPING'
  | 'TELEMETRY_EXPORT'
  | 'EVENT_EXPORT'
  | 'EVIDENCE_PACKAGE_INDEX'
  | 'AUTHORITY_REGISTER';

export type PilotArtifactStatus = 'PROVIDED' | 'MISSING' | 'PENDING_VALIDATION' | 'NOT_APPLICABLE';

export type PilotArtifact = {
  artifactId: string;
  kind: PilotArtifactKind;
  status: PilotArtifactStatus;
  reference?: string;
  revision?: string;
  sha256?: string;
  notes?: string[];
};

export type PilotReadinessInput = {
  projectId?: string;
  scopeRevision?: string;
  artifacts: readonly PilotArtifact[];
  realTimeConnectorConfigured?: boolean;
  writebackCapabilityConfigured?: boolean;
  operationalAuthorityClaimed?: boolean;
};

export type PilotReadinessStatus = 'BLOCKED' | 'READY_FOR_OFFLINE_INGEST';

export type PilotReadinessResult = {
  status: PilotReadinessStatus;
  blockers: string[];
  warnings: string[];
  requiredArtifacts: number;
  providedRequiredArtifacts: number;
  boundary: {
    offlineOnly: true;
    operationalReady: false;
    energizationAuthorized: false;
    otWritebackAllowed: false;
  };
};

export const PILOT_REQUIRED_ARTIFACT_KINDS: readonly PilotArtifactKind[] = [
  'PROJECT_IDENTITY',
  'SCOPE_REGISTER',
  'ASSET_REGISTER',
  'TEST_MATRIX',
  'CRITERIA_SOURCES',
  'SIGNAL_MAPPING',
  'TELEMETRY_EXPORT',
  'EVIDENCE_PACKAGE_INDEX',
  'AUTHORITY_REGISTER',
];

export const PILOT_OPTIONAL_ARTIFACT_KINDS: readonly PilotArtifactKind[] = [
  'SIGNAL_DICTIONARY',
  'EVENT_EXPORT',
];

const HASH_REQUIRED_KINDS = new Set<PilotArtifactKind>([
  'TELEMETRY_EXPORT',
  'EVENT_EXPORT',
  'EVIDENCE_PACKAGE_INDEX',
]);

const artifactsByKind = (
  artifacts: readonly PilotArtifact[],
): Map<PilotArtifactKind, PilotArtifact[]> => {
  const grouped = new Map<PilotArtifactKind, PilotArtifact[]>();
  for (const artifact of artifacts) {
    const current = grouped.get(artifact.kind) ?? [];
    current.push(artifact);
    grouped.set(artifact.kind, current);
  }
  return grouped;
};

export const assessPilotReadiness = (input: PilotReadinessInput): PilotReadinessResult => {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const grouped = artifactsByKind(input.artifacts);

  if (!input.projectId?.trim()) blockers.push('Project identity is not declared.');
  if (!input.scopeRevision?.trim()) blockers.push('Scope revision is not declared.');

  let providedRequiredArtifacts = 0;

  for (const kind of PILOT_REQUIRED_ARTIFACT_KINDS) {
    const candidates = grouped.get(kind) ?? [];
    const provided = candidates.filter((artifact) => artifact.status === 'PROVIDED');
    const pending = candidates.some((artifact) => artifact.status === 'PENDING_VALIDATION');

    if (provided.length > 0) {
      providedRequiredArtifacts += 1;
      continue;
    }

    if (pending) {
      blockers.push(`${kind} is pending validation.`);
    } else {
      blockers.push(`${kind} is required for offline pilot intake.`);
    }
  }

  for (const artifact of input.artifacts) {
    if (artifact.status !== 'PROVIDED') continue;

    if (!artifact.reference?.trim()) {
      blockers.push(`${artifact.kind} (${artifact.artifactId}) is marked PROVIDED without a traceable reference.`);
    }

    if (HASH_REQUIRED_KINDS.has(artifact.kind) && !artifact.sha256?.trim()) {
      blockers.push(`${artifact.kind} (${artifact.artifactId}) requires a recorded SHA-256 before offline ingest.`);
    }
  }

  if (input.realTimeConnectorConfigured) {
    blockers.push('Real-time connector configuration is outside G34 offline pilot intake scope.');
  }

  if (input.writebackCapabilityConfigured) {
    blockers.push('OT writeback capability is prohibited for the G34 pilot intake boundary.');
  }

  if (input.operationalAuthorityClaimed) {
    blockers.push('Offline pilot readiness must not be represented as operational or energization authority.');
  }

  const eventExports = grouped.get('EVENT_EXPORT') ?? [];
  if (!eventExports.some((artifact) => artifact.status === 'PROVIDED')) {
    warnings.push('No event export is provided; alarm/trip correlation will remain limited during the pilot dry run.');
  }

  const signalDictionaries = grouped.get('SIGNAL_DICTIONARY') ?? [];
  if (!signalDictionaries.some((artifact) => artifact.status === 'PROVIDED')) {
    warnings.push('No source signal dictionary is provided; the supplied signal mapping must carry the source semantics explicitly.');
  }

  return {
    status: blockers.length === 0 ? 'READY_FOR_OFFLINE_INGEST' : 'BLOCKED',
    blockers,
    warnings,
    requiredArtifacts: PILOT_REQUIRED_ARTIFACT_KINDS.length,
    providedRequiredArtifacts,
    boundary: {
      offlineOnly: true,
      operationalReady: false,
      energizationAuthorized: false,
      otWritebackAllowed: false,
    },
  };
};
