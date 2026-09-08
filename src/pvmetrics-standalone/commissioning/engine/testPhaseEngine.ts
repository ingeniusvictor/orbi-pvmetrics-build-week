import type { PhaseDetectionSource, PhaseType, TelemetrySample, TestPhase } from '../contracts';

export type PhaseRule = {
  phaseType: PhaseType;
  signalKey: string;
  predicate: (sample: TelemetrySample) => boolean;
};

export type DetectPhasesInput = {
  executionId: string;
  samples: readonly TelemetrySample[];
  rules: readonly PhaseRule[];
  detectionSource?: PhaseDetectionSource;
};

export const detectTestPhases = ({
  executionId,
  samples,
  rules,
  detectionSource = 'RULE_ENGINE',
}: DetectPhasesInput): TestPhase[] => {
  const ordered = [...samples].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const phases: TestPhase[] = [];

  let current: TestPhase | undefined;

  for (const sample of ordered) {
    const rule = rules.find((candidate) => candidate.signalKey === sample.signalKey && candidate.predicate(sample));
    if (!rule) continue;

    if (current?.phaseType === rule.phaseType) {
      current.endedAt = sample.timestamp;
      continue;
    }

    if (current && !current.endedAt) current.endedAt = sample.timestamp;

    current = {
      testPhaseId: `${executionId}:${rule.phaseType}:${sample.timestamp}`,
      executionId,
      phaseType: rule.phaseType,
      startedAt: sample.timestamp,
      detectionSource,
      confidence: detectionSource === 'RULE_ENGINE' ? 1 : undefined,
      evidenceIds: [],
    };
    phases.push(current);
  }

  return phases;
};

export const validatePhaseSequence = (phases: readonly TestPhase[]): string[] => {
  const errors: string[] = [];
  for (let i = 1; i < phases.length; i += 1) {
    const previous = phases[i - 1];
    const current = phases[i];
    if (current.startedAt < previous.startedAt) errors.push(`Phase ${current.testPhaseId} starts before previous phase.`);
    if (previous.endedAt && previous.endedAt > current.startedAt) errors.push(`Phase ${previous.testPhaseId} overlaps ${current.testPhaseId}.`);
  }
  return errors;
};
