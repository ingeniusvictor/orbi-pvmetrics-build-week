import {
  IncidentAnalysisProvider,
  IncidentAssessment,
} from './domain';
import { analyzeIncidentDeterministically } from './reasoningEngine';
import { validateIncidentAssessment } from './validation';

export const RUNTIME_ANALYSIS_PROVIDER =
  'Deterministic local evidence engine' as const;
export const DEVELOPMENT_ASSISTANCE = 'GPT-5.6 Sol and Codex' as const;

export const deterministicIncidentAnalysisProvider: IncidentAnalysisProvider = {
  id: 'deterministic-local-evidence-engine',
  label: RUNTIME_ANALYSIS_PROVIDER,
  runtime: 'deterministic-local',
  async analyze({ scenario }): Promise<IncidentAssessment> {
    const assessment = analyzeIncidentDeterministically(scenario);
    const validation = validateIncidentAssessment(assessment, scenario);
    if (validation.ok === false) {
      throw new Error(
        `Deterministic provider produced invalid output: ${validation.issues
          .map((issue) => `${issue.path}: ${issue.message}`)
          .join('; ')}`,
      );
    }
    return validation.value;
  },
};
